#!/usr/bin/env node

// Helper for bin/fetch-spec.sh: applies the deterministic fixes below to the
// freshly downloaded Fivetran OpenAPI definition, validates the result with
// @apidevtools/swagger-parser, verifies the download against
// provider-dev/config/spec_pin.json, and writes the snapshot into place.
//
// - Validation failure: fail without writing anything.
// - No pin recorded: record it (first fetch).
// - Pin matches: refresh the fetched date only.
// - Pin mismatch: fail without writing anything, unless UPDATE=true, in
//   which case the new hash is recorded (a reviewed spec refresh).
//
// The pin records the raw upstream sha256 (drift is always compared against
// upstream) plus the sha256 of the snapshot on disk and the fix counts. The
// snapshot is written pretty-printed so a refresh is a readable diff.
//
// Reports the spec's stated version, path count and operation count on every
// run. Inputs via environment: UPDATE, TMP_DIR, DOWNLOAD_DIR, PIN_FILE,
// SPEC_URL, SPEC_FILE.

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import SwaggerParser from '@apidevtools/swagger-parser';

const update = process.env.UPDATE === 'true';
const tmpDir = process.env.TMP_DIR;
const downloadDir = process.env.DOWNLOAD_DIR;
const pinFile = process.env.PIN_FILE;
const specUrl = process.env.SPEC_URL;
const specFile = process.env.SPEC_FILE;

if (!tmpDir || !downloadDir || !pinFile || !specUrl || !specFile) {
  console.error('record_spec_pin.mjs: missing TMP_DIR / DOWNLOAD_DIR / PIN_FILE / SPEC_URL / SPEC_FILE');
  process.exit(1);
}

const tmpPath = path.join(tmpDir, specFile);
const content = fs.readFileSync(tmpPath);
const spec = JSON.parse(content.toString('utf8'));
const schemas = spec.components?.schemas || {};
const HTTP_VERBS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];

// Deterministic fixes, counted in the pin (a class that is absent from a
// given snapshot simply counts 0):
//
//   discriminator_families_collapsed / discriminator_variants_dropped -
//     the request and response schemas for connections, destinations, log
//     services, private links, transformations and transformation projects
//     carry a `discriminator` whose mapping fans out to one schema per
//     connector / service type (781 connection variants alone, three
//     schemas each - about 2,600 of the 2,989 schemas). The operations
//     reference the base schema only. The variants differ in the shape of
//     a handful of service-specific object properties (config, auth,
//     external_secrets_keys_config, project_config, transformation_config),
//     which SQL users pass and read as JSON values. The discriminator is
//     removed, the service-specific properties are declared on the base as
//     objects (typed from the variants where the family has one or two
//     variants, free-form otherwise), and the variant schemas fall out in
//     the orphan sweep. The per-service shapes stay queryable through
//     fivetran.metadata.connector_types.
//   variant_properties_declared - the service-specific object properties
//     added to the collapsed bases
//   orphan_schemas_removed - schemas unreachable from any operation after
//     the collapse
//   accept_header_params_removed / accept_header_versioned_removed - every
//     operation declares an `Accept` header parameter: plain
//     application/json on most, application/json;version=2 on the
//     connection and destination operations (API version negotiation). It
//     is not a usable input: stackql always sends the declared response
//     media type as Accept, which overrides both a parameter default and a
//     supplied value (proven against the mock), and the live API answers
//     the version-negotiated operations identically either way (NOTES.md
//     finding 4). All are removed; the two counts record the split.
//   bare_object_response_enveloped - three operations declare their 2xx
//     body as the bare entity (GET /v1/proxy/{agentId} and the two
//     fingerprint approvals) although the API wraps every response in
//     {code, message, data} (confirmed live for the proxy agent read,
//     NOTES.md finding 3); the declared schema is moved under `data`
//   data_array_declared - GET /public/connector-types declares `data` as a
//     single connector object; the API returns an array of them (confirmed
//     live); `data` is redeclared as an array of that object
//   relative_doc_links_absolutized - descriptions link to the vendor's
//     documentation with site-relative markdown links ("](/docs/...)"),
//     which resolve against whatever site renders them; rewritten to
//     https://fivetran.com/docs/...
//   required_name_corrected - a `required` entry naming a property the
//     schema does not declare, where the snake_case form of the name is
//     declared (HvrHubRegistrationRequest: hubServerUrl -> hub_server_url)
const fixes = {
  discriminator_families_collapsed: 0,
  discriminator_variants_dropped: 0,
  variant_properties_declared: 0,
  orphan_schemas_removed: 0,
  accept_header_params_removed: 0,
  accept_header_versioned_removed: 0,
  bare_object_response_enveloped: 0,
  data_array_declared: 0,
  required_name_corrected: 0,
  relative_doc_links_absolutized: 0
};

const refName = (ref) => ref.split('/').pop();

// flattened top-level properties of a schema, following $ref and allOf
function flatProperties(node, seen = new Set()) {
  const out = {};
  if (!node) return out;
  if (node.$ref) {
    const n = refName(node.$ref);
    if (seen.has(n)) return out;
    seen.add(n);
    return flatProperties(schemas[n], seen);
  }
  for (const sub of node.allOf || []) Object.assign(out, flatProperties(sub, seen));
  Object.assign(out, node.properties || {});
  return out;
}

// ---- 1. collapse discriminator families
for (const [name, schema] of Object.entries(schemas)) {
  if (!schema || !schema.discriminator) continue;
  const mapping = schema.discriminator.mapping || {};
  const propertyName = schema.discriminator.propertyName;
  const variants = Object.entries(mapping);
  const baseProps = new Set(Object.keys(schema.properties || {}));
  const extra = new Map(); // property -> [variant property schemas]
  for (const [, ref] of variants) {
    for (const [prop, propSchema] of Object.entries(flatProperties({ $ref: ref }))) {
      if (baseProps.has(prop)) continue;
      if (!extra.has(prop)) extra.set(prop, []);
      extra.get(prop).push(propSchema);
    }
  }
  schema.properties = schema.properties || {};
  for (const [prop, variantSchemas] of [...extra.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (variants.length <= 2 && variantSchemas.every((s) => s && s.type === 'object')) {
      // small family: the union of the variants' typed properties
      const merged = { type: 'object', description: `Depends on \`${propertyName}\` (${variants.map(([k]) => k).sort().join(', ')}).`, properties: {} };
      for (const s of variantSchemas) Object.assign(merged.properties, JSON.parse(JSON.stringify(s.properties || {})));
      schema.properties[prop] = merged;
    } else {
      schema.properties[prop] = {
        type: 'object',
        additionalProperties: true,
        description: `The \`${prop}\` object for the \`${propertyName}\` in question (a JSON value; its keys depend on the \`${propertyName}\`). The accepted keys per type are documented in the vendor's API reference and returned by the connector metadata endpoints.`
      };
    }
    fixes.variant_properties_declared++;
  }
  delete schema.discriminator;
  fixes.discriminator_families_collapsed++;
  fixes.discriminator_variants_dropped += variants.length;
  if (process.env.VERBOSE) console.log(`  collapsed ${name}: ${variants.length} variant(s) on ${propertyName}, declared ${[...extra.keys()].join(', ') || 'nothing'}`);
}

// ---- 2. Accept header parameter
for (const [pathKey, pathItem] of Object.entries(spec.paths || {})) {
  for (const verb of HTTP_VERBS) {
    const op = pathItem[verb];
    if (!op || !Array.isArray(op.parameters)) continue;
    const kept = [];
    for (const p of op.parameters) {
      if (p && p.in === 'header' && String(p.name).toLowerCase() === 'accept') {
        const value = String(p.schema?.default);
        if (value === 'application/json') fixes.accept_header_params_removed++;
        else if (/^application\/json;version=\d+$/.test(value)) fixes.accept_header_versioned_removed++;
        else {
          console.error(`Unexpected Accept default "${value}" on ${verb.toUpperCase()} ${pathKey}, nothing written`);
          process.exit(1);
        }
        continue;
      }
      kept.push(p);
    }
    if (kept.length > 0) op.parameters = kept; else delete op.parameters;
  }
}

// ---- 3. response shape defects
const deref = (node) => {
  let n = node, depth = 0;
  while (n && depth++ < 12) {
    if (n.$ref) n = schemas[refName(n.$ref)];
    else if (Array.isArray(n.allOf) && n.allOf.length === 1 && !n.properties && !n.type) n = n.allOf[0];
    else break;
  }
  return n;
};
for (const [pathKey, pathItem] of Object.entries(spec.paths || {})) {
  for (const verb of HTTP_VERBS) {
    const op = pathItem[verb];
    if (!op) continue;
    for (const [code, response] of Object.entries(op.responses || {})) {
      if (!/^2/.test(code)) continue;
      const media = response.content?.['application/json'];
      if (!media?.schema) continue;
      const resolved = deref(media.schema);
      const props = resolved?.properties || {};
      if (Object.keys(props).length === 0) continue;
      if (!('code' in props) && !('data' in props)) {
        media.schema = {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Response status code', example: 'Success' },
            message: { type: 'string', description: 'Response status text' },
            data: media.schema
          }
        };
        fixes.bare_object_response_enveloped++;
        if (process.env.VERBOSE) console.log(`  enveloped ${verb.toUpperCase()} ${pathKey} ${code}`);
      }
    }
  }
}
{
  const op = spec.paths?.['/public/connector-types']?.get;
  const envelope = deref(op?.responses?.['200']?.content?.['application/json']?.schema);
  const data = envelope?.properties?.data;
  if (!op || !data) {
    console.error('Expected GET /public/connector-types with a {data} envelope, nothing written');
    process.exit(1);
  }
  if (deref(data)?.type !== 'array') {
    envelope.properties.data = { type: 'array', description: 'The connector types', items: data };
    fixes.data_array_declared++;
  }
}

// ---- 4. required names that do not match a declared property
const snake = (s) => String(s).replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
const fixRequired = (node) => {
  if (Array.isArray(node)) { node.forEach(fixRequired); return; }
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node.required) && node.properties && typeof node.properties === 'object') {
    node.required = node.required.map((name) => {
      if (name in node.properties || !(snake(name) in node.properties)) return name;
      fixes.required_name_corrected++;
      if (process.env.VERBOSE) console.log(`  required name ${name} -> ${snake(name)}`);
      return snake(name);
    });
  }
  for (const v of Object.values(node)) fixRequired(v);
};
fixRequired(spec);

// ---- 5. orphan sweep: drop schemas unreachable from any operation
const reachable = new Set();
const queue = [];
const collectRefs = (node) => {
  if (Array.isArray(node)) { node.forEach(collectRefs); return; }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === '$ref' && typeof v === 'string' && v.startsWith('#/components/schemas/')) {
        const n = refName(v);
        if (!reachable.has(n)) { reachable.add(n); queue.push(n); }
      } else {
        collectRefs(v);
      }
    }
  }
};
collectRefs(spec.paths);
for (const [section, entries] of Object.entries(spec.components || {})) {
  if (section !== 'schemas') collectRefs(entries);
}
while (queue.length > 0) collectRefs(schemas[queue.pop()]);
for (const name of Object.keys(schemas)) {
  if (!reachable.has(name)) {
    delete schemas[name];
    fixes.orphan_schemas_removed++;
  }
}

// ---- 6. site-relative documentation links in descriptions (after the
// sweep, so the count is of the links in the snapshot)
const RELATIVE_LINK = /\]\(\/docs\//g;
const absolutize = (node) => {
  if (Array.isArray(node)) { node.forEach(absolutize); return; }
  if (!node || typeof node !== 'object') return;
  for (const key of ['description', 'summary']) {
    if (typeof node[key] === 'string' && RELATIVE_LINK.test(node[key])) {
      RELATIVE_LINK.lastIndex = 0;
      fixes.relative_doc_links_absolutized += node[key].match(RELATIVE_LINK).length;
      node[key] = node[key].replace(RELATIVE_LINK, '](https://fivetran.com/docs/');
    }
    RELATIVE_LINK.lastIndex = 0;
  }
  for (const v of Object.values(node)) absolutize(v);
};
absolutize(spec);

for (const [name, count] of Object.entries(fixes)) {
  if (count > 0) console.log(`  fix ${name}: ${count}`);
}

// Validate before anything else touches disk
try {
  await SwaggerParser.validate(structuredClone(spec));
  console.log('Spec validated OK (@apidevtools/swagger-parser)');
} catch (err) {
  console.error(`Spec validation FAILED, nothing written: ${err.message}`);
  process.exit(1);
}

const pathKeys = Object.keys(spec.paths || {});
let opCount = 0;
for (const p of pathKeys) {
  for (const v of HTTP_VERBS) {
    if (spec.paths[p][v]) opCount++;
  }
}
console.log(`Spec: ${spec.info?.title} - openapi ${spec.openapi}, stated version ${spec.info?.version}, ${pathKeys.length} paths, ${opCount} operations, ${Object.keys(schemas).length} schemas after fixes`);

// The pin's sha256 is of the raw upstream bytes - drift is always compared
// against upstream; the written snapshot carries the deterministic fixes
const sha256 = crypto.createHash('sha256').update(content).digest('hex');

// Deterministic redaction of credential-shaped example values (none needed
// for the current Fivetran spec; add rules here if a refresh introduces any)
const REDACTIONS = [];
let sanitized = JSON.stringify(spec, null, 2) + '\n';
const redactionCounts = {};
for (const r of REDACTIONS) {
  const matches = sanitized.match(r.re);
  if (matches) {
    redactionCounts[r.name] = matches.length;
    sanitized = sanitized.replace(r.re, r.replacement);
  }
}
const sanitizedSha256 = crypto.createHash('sha256').update(sanitized).digest('hex');

let pin = { specs: {} };
if (fs.existsSync(pinFile)) {
  pin = JSON.parse(fs.readFileSync(pinFile, 'utf8'));
}
const pinKey = specFile.replace(/\.json$/, '');
const existing = pin.specs[pinKey];

if (existing && existing.sha256 !== sha256 && !update) {
  console.error(
    `Spec pin verification FAILED, nothing written: upstream content changed ` +
    `(pinned ${existing.sha256.slice(0, 12)}..., fetched ${sha256.slice(0, 12)}...). ` +
    `Re-run with --update to accept the refresh.`
  );
  process.exit(1);
}

const status = !existing ? 'pinned' : existing.sha256 === sha256 ? 'unchanged' : 'updated';
fs.mkdirSync(downloadDir, { recursive: true });
fs.writeFileSync(path.join(downloadDir, specFile), sanitized);
pin.specs[pinKey] = {
  url: specUrl,
  filename: specFile,
  spec_version: spec.info?.version,
  openapi: spec.openapi,
  paths: pathKeys.length,
  operations: opCount,
  schemas: Object.keys(schemas).length,
  sha256,
  sanitized_sha256: sanitizedSha256,
  fixes,
  redactions: redactionCounts,
  bytes: content.length,
  // the fetched date only moves when the content does, so an unchanged
  // re-fetch leaves the pin file byte-identical
  fetched: status === 'unchanged' && existing.fetched ? existing.fetched : new Date().toISOString().slice(0, 10)
};
fs.mkdirSync(path.dirname(pinFile), { recursive: true });
fs.writeFileSync(pinFile, JSON.stringify(pin, null, 2) + '\n');
console.log(`  ${specFile}: ${status} (upstream sha256 ${sha256.slice(0, 12)}..., ${content.length} bytes; snapshot ${sanitized.length} bytes)`);
for (const [name, count] of Object.entries(redactionCounts)) {
  console.log(`  redacted ${count} ${name} value(s) in the written snapshot (sanitized sha256 ${sanitizedSha256.slice(0, 12)}...)`);
}
