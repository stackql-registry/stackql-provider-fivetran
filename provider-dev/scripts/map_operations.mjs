#!/usr/bin/env node

// Populates stackql_resource_name, stackql_method_name, stackql_verb and
// stackql_object_key in provider-dev/config/all_services.csv from the split
// service specs in provider-dev/source. Deterministic and re-runnable on
// spec refreshes; review the CSV diff after running. Manual mapping decisions
// are applied as rules here, never as hand-edits to the CSV.
//
// Mapping conventions (see CLAUDE.md):
//   GET collection ({data: {items}})  -> SELECT  <resource>.list, objectKey
//                                        $.data.items (cursor pagination is
//                                        configured once, at service level)
//   GET single ({data: {...}})        -> SELECT  <resource>.get, objectKey
//                                        $.data
//   POST create                       -> INSERT  <resource>.create
//   PATCH edit                        -> UPDATE  <resource>.update
//   DELETE                            -> DELETE  <resource>.delete
//   POST/PATCH lifecycle actions      -> EXEC    <parent>.<action>
//     (sync, resync, run_setup_tests, move, rotate, run, cancel, ...) -
//     attached to the resource they act on, so the resource stays selectable
//   multipart upload, binary download -> skipped (skip_this_resource,
//                                        reason-coded in
//                                        endpoint_inventory.csv)
//
// Resource names come from RESOURCE_RULES; the mechanical derivation in
// lib/spec_helpers.mjs (scoping pairs stripped, last segment pluralized) is
// the fallback, so an operation added upstream still gets a name and the
// mapping stability check reports it as an addition to review.
//
// Validates before writing: every CSV row mapped or skipped with a reason,
// every spec operation present in the CSV, (resource, method) unique per
// service, and unique required-parameter signatures per (resource, sqlVerb).
// Fails without writing on violations.
//
// Usage: npm run map-operations [-- --out other.csv] [-- --report]

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import pluralize from 'pluralize';
import {
  HTTP_VERBS, pathParams, rulePath, makeResolver, classifyResponseShape,
  skipReason, deriveResource, deriveMethod, parseCsv, toCsv
} from './lib/spec_helpers.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const sourceDir = path.join(repoRoot, 'provider-dev', 'source');
const csvPath = path.join(repoRoot, 'provider-dev', 'config', 'all_services.csv');

// Explicit resource names, matched on (service, verb-optional, path without
// the /v1 prefix and with params collapsed to {}). First match wins, so
// specific rules precede the service's catch-all. Add rules here - never
// edit the CSV.
const RESOURCE_RULES = [
  // --- account
  { service: 'account', re: /^\/account\/info$/, resource: 'account_info' },
  { service: 'account', re: /^\/roles/, resource: 'roles' },
  { service: 'account', re: /^\/system-keys/, resource: 'system_keys' },
  // --- certificates: one resource per (owner, kind); the deprecated
  // account-level approve takes the owner in its body and has no read, so
  // it is the one method of its own resource
  { service: 'certificates', re: /^\/certificates$/, resource: 'certificates' },
  { service: 'certificates', re: /^\/connections\/\{\}\/certificates/, resource: 'connection_certificates' },
  { service: 'certificates', re: /^\/connections\/\{\}\/fingerprints/, resource: 'connection_fingerprints' },
  { service: 'certificates', re: /^\/destinations\/\{\}\/certificates/, resource: 'destination_certificates' },
  { service: 'certificates', re: /^\/destinations\/\{\}\/fingerprints/, resource: 'destination_fingerprints' },
  // --- connections: the lifecycle actions (sync, resync, move, setup
  // tests, connect card) are methods of connections; the schema-level and
  // table-level edits are methods of schema_configs (they edit the same
  // document the schema_configs read returns)
  { service: 'connections', re: /^\/connections\/\{\}\/move\/\{\}$/, resource: 'move_jobs' },
  { service: 'connections', re: /^\/connections\/\{\}\/state$/, resource: 'states' },
  { service: 'connections', re: /^\/connections\/\{\}\/sync-history$/, resource: 'sync_history' },
  { service: 'connections', re: /^\/connections\/\{\}\/warnings/, resource: 'warnings' },
  { service: 'connections', re: /^\/connections\/\{\}\/schemas\/\{\}\/tables\/\{\}\/columns/, resource: 'columns' },
  { service: 'connections', re: /^\/connections\/\{\}\/schemas/, resource: 'schema_configs' },
  { service: 'connections', re: /^\/connections/, resource: 'connections' },
  // --- connector_sdk
  { service: 'connector_sdk', re: /^\/connector-sdk\/packages/, resource: 'packages' },
  // --- destinations
  { service: 'destinations', re: /^\/destinations/, resource: 'destinations' },
  // --- external_logging
  { service: 'external_logging', re: /^\/external-logging\/account/, resource: 'account_log_services' },
  { service: 'external_logging', re: /^\/external-logging/, resource: 'log_services' },
  // --- external_secrets_managers
  { service: 'external_secrets_managers', re: /^\/external-secrets-managers-entities$/, resource: 'entities' },
  { service: 'external_secrets_managers', re: /^\/external-secrets-managers\/\{\}\/entities$/, resource: 'entities' },
  { service: 'external_secrets_managers', re: /^\/external-secrets-managers/, resource: 'secrets_managers' },
  // --- groups
  { service: 'groups', re: /^\/groups\/\{\}\/connections$/, resource: 'connections' },
  { service: 'groups', re: /^\/groups\/\{\}\/users/, resource: 'users' },
  { service: 'groups', re: /^\/groups\/\{\}\/public-key$/, resource: 'ssh_public_keys' },
  { service: 'groups', re: /^\/groups\/\{\}\/service-account$/, resource: 'service_accounts' },
  { service: 'groups', re: /^\/groups/, resource: 'groups' },
  // --- hybrid_deployment
  { service: 'hybrid_deployment', re: /^\/hvr\/register-hub$/, resource: 'hvr_hubs' },
  { service: 'hybrid_deployment', re: /^\/hybrid-deployment-agents/, resource: 'agents' },
  // --- metadata
  { service: 'metadata', re: /^\/public\/connector-types$/, resource: 'public_connector_types' },
  { service: 'metadata', re: /^\/metadata\/connector-types/, resource: 'connector_types' },
  // --- networking
  { service: 'networking', re: /^\/private-links/, resource: 'private_links' },
  { service: 'networking', re: /^\/proxy\/\{\}\/connections$/, resource: 'proxy_agent_connections' },
  { service: 'networking', re: /^\/proxy/, resource: 'proxy_agents' },
  // --- teams
  { service: 'teams', re: /^\/teams\/\{\}\/connections/, resource: 'connection_memberships' },
  { service: 'teams', re: /^\/teams\/\{\}\/groups/, resource: 'group_memberships' },
  { service: 'teams', re: /^\/teams\/\{\}\/users/, resource: 'user_memberships' },
  { service: 'teams', re: /^\/teams/, resource: 'teams' },
  // --- transformations
  { service: 'transformations', re: /^\/transformation-projects/, resource: 'transformation_projects' },
  { service: 'transformations', re: /^\/transformations\/package-metadata/, resource: 'package_metadata' },
  { service: 'transformations', re: /^\/transformations/, resource: 'transformations' },
  // --- users
  { service: 'users', re: /^\/users\/api-keys$/, resource: 'api_keys' },
  { service: 'users', re: /^\/users\/\{\}\/api-keys/, resource: 'api_keys' },
  { service: 'users', re: /^\/users\/\{\}\/connections/, resource: 'connection_memberships' },
  { service: 'users', re: /^\/users\/\{\}\/groups/, resource: 'group_memberships' },
  { service: 'users', re: /^\/users/, resource: 'users' },
  // --- webhooks
  { service: 'webhooks', re: /^\/webhooks/, resource: 'webhooks' }
];

// Method-name / verb overrides for cases the generic rules cannot express,
// matched on (verb, path in the same form). First match wins.
const METHOD_RULES = [
  // the deprecated account-level certificate approve
  { verb: 'post', re: /^\/certificates$/, method: 'approve', sqlVerb: 'exec' },
  // setup tests: the vendor's name for POST .../test on connections,
  // destinations and log services
  { verb: 'post', re: /^\/(connections|destinations)\/\{\}\/test$/, method: 'run_setup_tests', sqlVerb: 'exec' },
  { verb: 'post', re: /^\/external-logging\/(account|\{\})\/test$/, method: 'run_setup_tests', sqlVerb: 'exec' },
  // connect card token generation is an action on the connection
  { verb: 'post', re: /^\/connections\/\{\}\/connect-card$/, method: 'create_connect_card', sqlVerb: 'exec' },
  // schema config: actions, and the schema-level / table-level edits
  { verb: 'post', re: /^\/connections\/\{\}\/schemas\/reload$/, method: 'reload', sqlVerb: 'exec' },
  { verb: 'post', re: /^\/connections\/\{\}\/schemas\/drop-columns$/, method: 'drop_columns', sqlVerb: 'exec' },
  { verb: 'post', re: /^\/connections\/\{\}\/schemas\/tables\/resync$/, method: 'resync_tables', sqlVerb: 'exec' },
  { verb: 'patch', re: /^\/connections\/\{\}\/schemas\/\{\}$/, method: 'update_schema', sqlVerb: 'update' },
  { verb: 'patch', re: /^\/connections\/\{\}\/schemas\/\{\}\/tables\/\{\}$/, method: 'update_table', sqlVerb: 'update' },
  // dismissing a warning removes it from the warnings list
  { verb: 'delete', re: /^\/connections\/\{\}\/warnings\/\{\}$/, method: 'dismiss', sqlVerb: 'delete' },
  // the two entity reads differ in how the secrets manager is addressed
  { verb: 'get', re: /^\/external-secrets-managers\/\{\}\/entities$/, method: 'list_by_esm', sqlVerb: 'select' },
  // the hybrid deployment agent list filters on a camelCase query parameter
  // (groupId) - the method name is the default; post_process sets
  // request.nativeCasing so group_id resolves
  // HVR hub registration
  { verb: 'post', re: /^\/hvr\/register-hub$/, method: 'register', sqlVerb: 'exec' },
  // removing the account-level role is an action on the user / team, not a
  // row delete (the user / team stays)
  { verb: 'delete', re: /^\/(users|teams)\/\{\}\/role$/, method: 'remove_account_role', sqlVerb: 'exec' },
  // quickstart package upgrade
  { verb: 'post', re: /^\/transformations\/\{\}\/upgrade$/, method: 'upgrade_package', sqlVerb: 'exec' },
  // webhooks are created at account or group scope
  { verb: 'post', re: /^\/webhooks\/account$/, method: 'create_account_webhook', sqlVerb: 'insert' },
  { verb: 'post', re: /^\/webhooks\/group\/\{\}$/, method: 'create_group_webhook', sqlVerb: 'insert' }
];

// ---------------------------------------------------------------------------
// Index every operation in the split service specs
// ---------------------------------------------------------------------------

const ops = new Map(); // `${filename}::${path}::${verb}` -> { op, pathItem, resolve }
const specFiles = fs.readdirSync(sourceDir).filter((f) => f.endsWith('.yaml')).sort();
if (specFiles.length === 0) {
  console.error(`Error: no service specs in ${sourceDir} - run npm run split first`);
  process.exit(1);
}
for (const filename of specFiles) {
  const spec = yaml.load(fs.readFileSync(path.join(sourceDir, filename), 'utf8'));
  const resolve = makeResolver(spec);
  for (const [pathKey, pathItem] of Object.entries(spec.paths || {})) {
    for (const verb of HTTP_VERBS) {
      if (!pathItem[verb]) continue;
      ops.set(`${filename}::${pathKey}::${verb}`, { op: pathItem[verb], pathItem, resolve });
    }
  }
}

// ---------------------------------------------------------------------------
// Mapping
// ---------------------------------------------------------------------------

const derivedResources = [];
function resourceFor(service, pathKey, verb) {
  const norm = rulePath(pathKey);
  for (const rule of RESOURCE_RULES) {
    if (rule.service && rule.service !== service) continue;
    if (rule.verb && rule.verb !== verb) continue;
    if (rule.re.test(norm)) return rule.resource;
  }
  const derived = deriveResource(pathKey, verb, pluralize);
  derivedResources.push(`${service} ${verb.toUpperCase()} ${pathKey} -> ${derived}`);
  return derived;
}

function mapOperation(filename, pathKey, verb) {
  const entry = ops.get(`${filename}::${pathKey}::${verb}`);
  if (!entry) return { error: `operation not found in ${sourceDir}` };
  const { op, resolve } = entry;
  const service = filename.replace(/\.yaml$/, '');

  const skip = skipReason(pathKey, op, resolve);
  if (skip) return { resource: 'skip_this_resource', method: '', sqlVerb: '', objectKey: '', skip };

  const norm = rulePath(pathKey);
  const resource = resourceFor(service, pathKey, verb);
  const { shape, objectKey } = classifyResponseShape(op, resolve);
  const rule = METHOD_RULES.find((r) => r.verb === verb && r.re.test(norm));
  const { method, sqlVerb } = rule || deriveMethod(pathKey, verb, shape);
  return { resource, method, sqlVerb, objectKey: sqlVerb === 'select' ? objectKey : '' };
}

// ---------------------------------------------------------------------------
// CSV read/transform/write
// ---------------------------------------------------------------------------

const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
const header = rows[0];
const col = Object.fromEntries(header.map((h, i) => [h, i]));
for (const required of ['filename', 'path', 'verb', 'operationId', 'stackql_resource_name', 'stackql_method_name', 'stackql_verb', 'stackql_object_key']) {
  if (!(required in col)) {
    console.error(`Missing expected CSV column: ${required}`);
    process.exit(1);
  }
}

// stable order: service, then path, then verb - so a regeneration diff only
// shows real changes
const verbOrder = Object.fromEntries(HTTP_VERBS.map((v, i) => [v, i]));
const body = rows.slice(1).sort((a, b) =>
  a[col.filename].localeCompare(b[col.filename]) ||
  a[col.path].localeCompare(b[col.path]) ||
  (verbOrder[a[col.verb]] ?? 9) - (verbOrder[b[col.verb]] ?? 9));

const errors = [];
const seenKeys = new Set();
const seenOperationIds = new Map();
const stats = { select: 0, insert: 0, update: 0, delete: 0, exec: 0, skipped: 0 };
const skipsByReason = {};

for (const row of body) {
  const filename = row[col.filename], pathKey = row[col.path], verb = row[col.verb];
  seenKeys.add(`${filename}::${pathKey}::${verb}`);
  const opId = row[col.operationId];
  if (!opId) errors.push(`${filename} ${verb} ${pathKey}: no operationId (the mapping stability check keys on it)`);
  else if (seenOperationIds.has(opId)) errors.push(`duplicate operationId ${opId} (${seenOperationIds.get(opId)} and ${verb} ${pathKey})`);
  seenOperationIds.set(opId, `${verb} ${pathKey}`);
  const m = mapOperation(filename, pathKey, verb);
  if (m.error) {
    errors.push(`${filename} ${verb} ${pathKey}: ${m.error}`);
    continue;
  }
  row[col.stackql_resource_name] = m.resource;
  if (m.resource === 'skip_this_resource') {
    stats.skipped++;
    skipsByReason[m.skip] = (skipsByReason[m.skip] || 0) + 1;
    row[col.stackql_method_name] = '';
    row[col.stackql_verb] = '';
    row[col.stackql_object_key] = '';
    continue;
  }
  row[col.stackql_method_name] = m.method;
  row[col.stackql_verb] = m.sqlVerb;
  row[col.stackql_object_key] = m.objectKey;
  if (!(m.sqlVerb in stats)) errors.push(`${filename} ${verb} ${pathKey}: unknown StackQL verb ${m.sqlVerb}`);
  else stats[m.sqlVerb]++;
}

// every spec operation must have a CSV row (else generate-provider misses it)
for (const key of ops.keys()) {
  if (!seenKeys.has(key)) errors.push(`in spec but not in CSV: ${key}`);
}

// ---------------------------------------------------------------------------
// Consistency checks
// ---------------------------------------------------------------------------

const methodSeen = new Map();
const sigSeen = new Map();
for (const row of body) {
  const resource = row[col.stackql_resource_name];
  if (!resource || resource === 'skip_this_resource') continue;
  const service = row[col.filename].replace(/\.yaml$/, '');
  const methodKey = `${service}.${resource}.${row[col.stackql_method_name]}`;
  if (methodSeen.has(methodKey)) {
    errors.push(`duplicate method ${methodKey} (${methodSeen.get(methodKey)} and ${row[col.path]}:${row[col.verb]})`);
  }
  methodSeen.set(methodKey, `${row[col.path]}:${row[col.verb]}`);

  const sqlVerb = row[col.stackql_verb];
  if (sqlVerb === 'exec') continue;
  // signature = required inputs: path params plus required query params
  const entry = ops.get(`${row[col.filename]}::${row[col.path]}::${row[col.verb]}`);
  const requiredQuery = [...(entry?.pathItem?.parameters || []), ...(entry?.op.parameters || [])]
    .map((p) => entry.resolve(p))
    .filter((p) => p && p.in === 'query' && p.required)
    .map((p) => p.name);
  const sig = [...pathParams(row[col.path]), ...requiredQuery].sort().join(',');
  const sigKey = `${service}.${resource}.${sqlVerb}::${sig}`;
  if (sigSeen.has(sigKey)) {
    errors.push(`signature clash on ${service}.${resource} ${sqlVerb} [${sig}] (${sigSeen.get(sigKey)} and ${row[col.stackql_method_name]})`);
  }
  sigSeen.set(sigKey, row[col.stackql_method_name]);
}

if (process.argv.includes('--report')) {
  // diagnostic listing of the derived mapping per operation (no write)
  for (const row of body) {
    console.log(`${row[col.filename].replace(/.yaml$/, '').padEnd(26)} ${row[col.verb].padEnd(6)} ${row[col.path].padEnd(78)} -> ${row[col.stackql_resource_name]}.${row[col.stackql_method_name]} [${row[col.stackql_verb]}] ${row[col.stackql_object_key]}`);
  }
}
if (errors.length > 0) {
  console.error(`FAILED with ${errors.length} error(s), nothing written:`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

const outArgIdx = process.argv.indexOf('--out');
const outPath = outArgIdx !== -1 ? path.resolve(process.argv[outArgIdx + 1]) : csvPath;
fs.writeFileSync(outPath, toCsv([header, ...body]));

// summary
const resourcesByService = new Map();
const selectable = new Set();
for (const row of body) {
  const resource = row[col.stackql_resource_name];
  if (!resource || resource === 'skip_this_resource') continue;
  const service = row[col.filename].replace(/\.yaml$/, '');
  if (!resourcesByService.has(service)) resourcesByService.set(service, new Set());
  resourcesByService.get(service).add(resource);
  if (row[col.stackql_verb] === 'select') selectable.add(`${service}.${resource}`);
}
const allResources = [...resourcesByService.entries()].flatMap(([s, rs]) => [...rs].map((r) => `${s}.${r}`));
const nonSelectable = allResources.filter((r) => !selectable.has(r)).sort();
console.log(`Mapped: select ${stats.select}, insert ${stats.insert}, update ${stats.update}, delete ${stats.delete}, exec ${stats.exec}; skipped ${stats.skipped}${stats.skipped ? ` (${Object.entries(skipsByReason).map(([k, v]) => `${k}: ${v}`).join(', ')})` : ''}`);
console.log(`Resources: ${allResources.length} across ${resourcesByService.size} services; non-selectable: ${nonSelectable.length}${nonSelectable.length ? ` (${nonSelectable.join(', ')})` : ''}`);
for (const [service, resources] of [...resourcesByService.entries()].sort()) {
  console.log(`  ${service}: ${[...resources].sort().join(', ')}`);
}
if (derivedResources.length > 0) {
  console.log(`\nNOTE: ${derivedResources.length} operation(s) matched no RESOURCE_RULES entry and took a mechanically derived resource name - review and add a rule:`);
  for (const d of derivedResources) console.log(`  ${d}`);
}
