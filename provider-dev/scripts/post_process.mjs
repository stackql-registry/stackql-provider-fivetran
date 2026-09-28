#!/usr/bin/env node

// Post-generation fixes for things the generator cannot express. Idempotent;
// re-run after every generate. Validates and fails without writing.
//
// 1. Server sanity. Every service is generated on the one fixed server
//    (https://api.fivetran.com); a service document that lost it, or a
//    path-level override, fails here.
//
// 2. Object keys on writes. The generator applies stackql_object_key to GET
//    operations only. The API answers creates and updates with the same
//    {code, message, data} envelope as reads, so every INSERT / UPDATE /
//    EXEC method whose 2xx response declares `data` gets objectKey $.data -
//    `INSERT ... RETURNING id` then projects the created entity rather than
//    the envelope.
//
// 3. camelCase query parameters. The wire is snake_case throughout except
//    one query parameter (groupId on the hybrid deployment agent list).
//    `request.nativeCasing: camel` on that method lets the snake_case SQL
//    key (group_id) resolve to it.
//
// 4. Pagination sanity. Cursor pagination is configured once per service
//    (x-stackQL-config, from the Makefile's SERVICE_CONFIG); this step
//    verifies that every method on a cursor-paginated operation binds
//    $.data.items, so the configured tokens and the row source agree.
//
// Usage: node provider-dev/scripts/post_process.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { API_HOST_URL, camelToSnake, makeResolver, success2xx } from './lib/spec_helpers.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const servicesDir = path.join(repoRoot, 'provider-dev', 'openapi', 'src', 'fivetran', 'v00.00.00000', 'services');

if (!fs.existsSync(servicesDir)) {
  console.error(`Error: ${servicesDir} not found - run the generate step first`);
  process.exit(1);
}

const errors = [];
const docs = new Map();
const counts = { paths: 0, writeObjectKeys: 0, nativeCasing: 0, paginatedMethods: 0 };

const operationFor = (doc, ref) => {
  // '#/paths/~1groups~1{group_id}/get'
  const m = /^#\/paths\/(.+)\/([a-z]+)$/.exec(ref || '');
  if (!m) return null;
  const pathKey = m[1].replace(/~1/g, '/').replace(/~0/g, '~');
  return { pathKey, verb: m[2], op: doc.paths?.[pathKey]?.[m[2]] };
};

for (const f of fs.readdirSync(servicesDir).filter((x) => x.endsWith('.yaml')).sort()) {
  const doc = yaml.load(fs.readFileSync(path.join(servicesDir, f), 'utf8'));
  docs.set(f, doc);
  const resolve = makeResolver(doc);

  if (doc.servers?.length !== 1 || doc.servers[0].url !== API_HOST_URL) errors.push(`${f}: top-level server is not ${API_HOST_URL}`);
  if (!doc['x-stackQL-config']?.pagination?.responseToken) errors.push(`${f}: service-level pagination config is missing`);

  // 1. server sanity
  for (const [p, item] of Object.entries(doc.paths || {})) {
    if (item.servers) errors.push(`${f}: path ${p} carries a path-level servers override`);
    if (!p.startsWith('/v1/') && !p.startsWith('/public/')) errors.push(`${f}: unexpected path root ${p}`);
    counts.paths++;
  }

  const resources = doc.components?.['x-stackQL-resources'] || {};
  if (Object.keys(resources).length === 0) errors.push(`${f}: no x-stackQL-resources`);

  for (const [resourceName, resource] of Object.entries(resources)) {
    const selectRefs = new Set((resource.sqlVerbs?.select || []).map((r) => r.$ref));
    for (const [methodName, method] of Object.entries(resource.methods || {})) {
      const target = operationFor(doc, method.operation?.$ref);
      if (!target?.op) {
        errors.push(`${f}: ${resourceName}.${methodName} does not resolve to an operation`);
        continue;
      }
      const { op, verb } = target;
      const params = (op.parameters || []).map((p) => resolve(p)).filter(Boolean);
      const isSelect = selectRefs.has(`#/components/x-stackQL-resources/${resourceName}/methods/${methodName}`);

      // 2. object keys on writes
      if (!isSelect && verb !== 'get' && !method.response?.objectKey) {
        const envelope = resolve(success2xx(op).schema);
        const data = envelope?.properties?.data ? resolve(envelope.properties.data) : null;
        if (data && (data.type === 'object' || data.properties)) {
          method.response = { ...(method.response || {}), objectKey: '$.data' };
          counts.writeObjectKeys++;
        }
      }

      // 3. camelCase query parameters
      const camelQuery = params.filter((p) => p.in === 'query' && camelToSnake(p.name) !== p.name);
      if (camelQuery.length > 0) {
        method.request = { ...(method.request || {}), nativeCasing: 'camel' };
        counts.nativeCasing++;
      }

      // 4. pagination sanity
      if (params.some((p) => p.in === 'query' && p.name === 'cursor')) {
        if (!isSelect) errors.push(`${f}: ${resourceName}.${methodName} is cursor-paginated but is not a select method`);
        else if (method.response?.objectKey !== '$.data.items') errors.push(`${f}: ${resourceName}.${methodName} is cursor-paginated but binds ${method.response?.objectKey || 'no object key'}`);
        counts.paginatedMethods++;
      }
      if (isSelect && !method.response?.objectKey) errors.push(`${f}: select method ${resourceName}.${methodName} has no object key`);
    }
  }
}

if (errors.length > 0) {
  console.error(`FAILED with ${errors.length} error(s), nothing written:`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
for (const [f, d] of docs) fs.writeFileSync(path.join(servicesDir, f), yaml.dump(d, { lineWidth: -1, noRefs: true }));
console.log(`post_process: ${docs.size} services on ${API_HOST_URL} (${counts.paths} paths); objectKey $.data on ${counts.writeObjectKeys} write methods; request.nativeCasing: camel on ${counts.nativeCasing} method(s); ${counts.paginatedMethods} cursor-paginated select methods verified`);
