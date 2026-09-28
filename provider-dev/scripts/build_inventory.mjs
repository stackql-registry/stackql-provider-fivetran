#!/usr/bin/env node

// Builds the endpoint inventory (provider-dev/config/endpoint_inventory.csv)
// from the pinned Fivetran spec: one row per operation with the vendor's
// operationId and tag, the path as the provider carries it (snake_case path
// parameters), the path and query parameters, cursor
// pagination, request body presence / kind / properties, the deprecated
// flag, the response shape and its object key, the service (from the
// path rules in provider-dev/config/service_names.json), a draft resource
// and StackQL verb, and a skip reason where the operation is not mapped.
//
// The draft resource/verb columns are the mechanical derivation -
// map_operations.mjs produces the authoritative mapping. Fails without
// writing if any path lacks a service rule.
//
// Usage: npm run build-inventory

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pluralize from 'pluralize';
import {
  INVENTORY_VERBS, pathParams, makeResolver, makeServiceResolver, providerPath,
  classifyResponseShape, classifyRequestBody, queryParams, isCursorPaginated,
  skipReason, deriveResource, deriveMethod, toCsv
} from './lib/spec_helpers.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const specPath = path.join(repoRoot, 'provider-dev', 'downloaded', 'fivetran-v1.json');
const outPath = path.join(repoRoot, 'provider-dev', 'config', 'endpoint_inventory.csv');

const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const resolve = makeResolver(spec);
const resolveService = makeServiceResolver();

const rows = [];
const errors = [];
const stats = { byService: {}, byVerb: {}, byShape: {}, byDisposition: {} };
const bump = (obj, key) => { obj[key] = (obj[key] || 0) + 1; };
let paginated = 0, deprecated = 0;

for (const [pathKey, pathItem] of Object.entries(spec.paths || {})) {
  for (const verb of INVENTORY_VERBS) {
    const op = pathItem[verb];
    if (!op) continue;

    const service = resolveService(pathKey);
    if (!service) {
      errors.push(`no service rule matches ${verb.toUpperCase()} ${pathKey}`);
      continue;
    }
    const provPath = providerPath(pathKey);
    const { shape, objectKey } = classifyResponseShape(op, resolve);
    const skip = skipReason(pathKey, op, resolve);
    const body = classifyRequestBody(op, resolve);
    const query = queryParams(op, pathItem, resolve);
    const cursor = isCursorPaginated(op, pathItem, resolve);
    const draft = deriveMethod(provPath, verb, shape);

    rows.push({
      method: verb,
      path: pathKey,
      provider_path: provPath,
      operation_id: op.operationId,
      tag: (op.tags || []).join(';'),
      path_params: pathParams(provPath).join(';'),
      query_params: query.map((p) => p.name + (p.required ? '*' : '')).join(';'),
      cursor_paginated: cursor ? 'y' : '',
      has_request_body: body.has,
      body_kinds: body.kinds.join(';'),
      body_properties: body.properties.join(';'),
      body_required: body.required.join(';'),
      deprecated: op.deprecated ? 'y' : '',
      response_shape: shape,
      response_object_key: objectKey,
      service,
      draft_resource: skip ? '' : deriveResource(provPath, verb, pluralize),
      draft_method: skip ? '' : draft.method,
      draft_verb: skip ? '' : draft.sqlVerb,
      skip_reason: skip
    });

    bump(stats.byShape, shape);
    bump(stats.byDisposition, skip ? `skipped: ${skip}` : 'mapped');
    if (cursor) paginated++;
    if (op.deprecated) deprecated++;
    if (!skip) {
      bump(stats.byService, service);
      bump(stats.byVerb, draft.sqlVerb);
    }
  }
}

if (errors.length > 0) {
  console.error(`FAILED with ${errors.length} error(s), nothing written:`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

const columns = Object.keys(rows[0]);
fs.writeFileSync(outPath, toCsv([columns, ...rows.map((r) => columns.map((c) => r[c] ?? ''))]));

console.log(`Endpoint inventory written to ${outPath} (${rows.length} operations)\n`);
const printStats = (title, obj) => {
  console.log(title);
  for (const [k, v] of Object.entries(obj).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`);
};
printStats('By disposition:', stats.byDisposition);
printStats('\nMapped operations by service:', stats.byService);
printStats('\nMapped operations by draft StackQL verb:', stats.byVerb);
printStats('\nBy response shape:', stats.byShape);
console.log(`\nCursor-paginated collections: ${paginated}; deprecated operations: ${deprecated}`);
