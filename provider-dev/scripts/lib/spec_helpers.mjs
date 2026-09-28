// Shared helpers for the Fivetran spec scripts (build_inventory.mjs,
// map_operations.mjs, bin/split.mjs, pre_normalize.mjs, post_process.mjs):
// service resolution, path rebasing and path parameter naming, response
// shape classification, skip rules, and the mechanical resource / verb
// derivation. Single-sourced so the inventory and the authoritative mapping
// can never disagree on classification.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const HTTP_VERBS = ['get', 'post', 'put', 'patch', 'delete'];
export const INVENTORY_VERBS = ['get', 'post', 'put', 'patch', 'delete', 'head'];

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const serviceNamesPath = path.join(repoRoot, 'provider-dev', 'config', 'service_names.json');

export function camelToSnake(s) {
  return String(s).replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/[-. ]/g, '_').toLowerCase();
}

export function pathParams(pathKey) {
  return (pathKey.match(/\{[^}]+\}/g) || []).map((s) => s.slice(1, -1));
}

export function normalizePath(pathKey) {
  return pathKey.replace(/\{[^}]+\}/g, '{}');
}

// Resolves local $refs against the containing spec document, and looks
// through the single-member allOf wrappers the vendor's generator emits
// around every referenced property
export function makeResolver(spec) {
  return function resolve(schema, depth = 0) {
    if (!schema || depth > 12) return schema;
    if (schema.$ref) {
      const parts = schema.$ref.replace(/^#\//, '').split('/');
      let node = spec;
      for (const p of parts) node = node?.[p];
      return resolve(node, depth + 1);
    }
    if (Array.isArray(schema.allOf) && schema.allOf.length === 1 && !schema.properties && !schema.type) {
      return resolve(schema.allOf[0], depth + 1);
    }
    return schema;
  };
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export function loadServiceConfig() {
  return JSON.parse(fs.readFileSync(serviceNamesPath, 'utf8'));
}

// Service resolution from the ordered path rules in service_names.json,
// matched against the path as the vendor serves it. Every operation path
// must match a rule; a miss is an error the caller must surface.
export function makeServiceResolver() {
  const rules = loadServiceConfig().rules.map((r) => ({ re: new RegExp(r.pathRegex), service: r.service }));
  return function resolveService(pathKey) {
    for (const rule of rules) {
      if (rule.re.test(pathKey)) return rule.service;
    }
    return null;
  };
}

// ---------------------------------------------------------------------------
// Server and path parameter naming (bin/split.mjs, post_process.mjs)
// ---------------------------------------------------------------------------

// One fixed server: the API has a single host and no account, region or
// deployment segment in its URLs, so there is no server variable to resolve
// from the environment. Paths keep the vendor's form (/v1/..., and the one
// public path /public/connector-types). The Terraform provider's
// FIVETRAN_API_URL (a whole base URL) cannot be a server variable: any-sdk
// needs a literal scheme in the server template (NOTES.md finding 2).
export const API_HOST_URL = 'https://api.fivetran.com';
export const V1_PREFIX = '/v1';

// the path without the version prefix, params collapsed - the form the
// mapping rules are written against
export function rulePath(pathKey) {
  const p = pathKey.startsWith(V1_PREFIX + '/') ? pathKey.slice(V1_PREFIX.length) : pathKey;
  return normalizePath(p);
}

// Path parameter names at the SQL surface. Path parameter names never reach
// the wire (only their values do), so renaming them is safe. The vendor
// names them in camelCase (connectionId, groupId) with a few exceptions
// (package_id); all are presented in snake_case. Three names are also
// unified so one entity has one key everywhere:
//   DELETE /v1/users/{id}                      id     -> user_id
//   GET .../schemas/{schema}/tables/{table}/columns
//                                              schema -> schema_name
//                                              table  -> table_name
const PATH_PARAM_OVERRIDES = [
  { re: /^\/v1\/users\/\{id\}$/, from: 'id', to: 'user_id' },
  { re: /\/schemas\/\{schema\}\/tables\/\{table\}\/columns$/, from: 'schema', to: 'schema_name' },
  { re: /\/schemas\/\{schema\}\/tables\/\{table\}\/columns$/, from: 'table', to: 'table_name' }
];

export function pathParamRenames(upstreamPath) {
  const renames = new Map();
  for (const name of pathParams(upstreamPath)) {
    const override = PATH_PARAM_OVERRIDES.find((o) => o.from === name && o.re.test(upstreamPath));
    const to = override ? override.to : camelToSnake(name);
    if (to !== name) renames.set(name, to);
  }
  return renames;
}

// The path as the provider carries it: path parameters renamed
export function providerPath(upstreamPath) {
  const renames = pathParamRenames(upstreamPath);
  return upstreamPath.replace(/\{([^}]+)\}/g, (_, name) => `{${renames.get(name) || name}}`);
}

// Rewrites a split service document in place: sets the server, renames the
// path parameters in every path key and declaration. Returns the counts.
export function renamePathParameters(doc, servers) {
  const newPaths = {};
  let paths = 0, renamed = 0, merged = 0;
  for (const [pathKey, pathItem] of Object.entries(doc.paths || {})) {
    const renames = pathParamRenames(pathKey);
    const rename = (params) => {
      for (const p of params || []) {
        if (p && p.in === 'path' && renames.has(p.name)) {
          p.name = renames.get(p.name);
          renamed++;
        }
      }
    };
    rename(pathItem.parameters);
    for (const verb of HTTP_VERBS) rename(pathItem[verb]?.parameters);
    const target = providerPath(pathKey);
    if (target in newPaths) {
      // two upstream path items that differ only in a path parameter name
      // (/v1/users/{id} carries DELETE, /v1/users/{userId} GET and PATCH)
      // become one; their verbs must be disjoint
      for (const [k, v] of Object.entries(pathItem)) {
        if (k in newPaths[target]) throw new Error(`rebase collision: ${pathKey} -> ${target} (both declare ${k})`);
        newPaths[target][k] = v;
      }
      merged++;
    } else {
      newPaths[target] = pathItem;
    }
    paths++;
  }
  doc.paths = newPaths;
  doc.servers = JSON.parse(JSON.stringify(servers));
  return { paths, renamed, merged };
}

// ---------------------------------------------------------------------------
// Response and request classification
// ---------------------------------------------------------------------------

export function success2xx(op) {
  const codes = Object.keys(op.responses || {}).filter((c) => /^2/.test(c)).sort();
  for (const code of codes) {
    const content = op.responses[code].content || {};
    const jsonType = Object.keys(content).find((m) => m.includes('json'));
    if (jsonType && content[jsonType].schema) return { code, schema: content[jsonType].schema, mediaTypes: Object.keys(content) };
    if (Object.keys(content).length > 0) return { code, schema: null, mediaTypes: Object.keys(content) };
  }
  return { code: codes[0] || null, schema: null, mediaTypes: [] };
}

// Response shapes. The API wraps nearly everything in {code, message, data}:
//   data-items   - data is {items: [...], next_cursor}: a cursor-paginated
//                  collection (objectKey $.data.items)
//   data-array   - data is a bare array (objectKey $.data)
//   data-object  - data is a single object (objectKey $.data)
//   status-only  - {code, message} with no data (deletes, some actions)
//   bare-object  - a typed object with no envelope (three operations the
//                  spec declares that way)
//   untyped-json - JSON declared with an empty schema
//   none         - no 2xx content
export function classifyResponseShape(op, resolve) {
  const { schema, mediaTypes } = success2xx(op);
  if (!schema) return { shape: mediaTypes.length > 0 ? 'non-json' : 'none', objectKey: '' };
  const s = resolve(schema);
  const props = s?.properties || {};
  if (!s || (Object.keys(props).length === 0 && s.type !== 'array')) return { shape: 'untyped-json', objectKey: '' };
  if (props.data) {
    const data = resolve(props.data);
    if (data?.type === 'array') return { shape: 'data-array', objectKey: '$.data' };
    const items = data?.properties?.items ? resolve(data.properties.items) : null;
    if (items?.type === 'array') return { shape: 'data-items', objectKey: '$.data.items' };
    return { shape: 'data-object', objectKey: '$.data' };
  }
  if ('code' in props && Object.keys(props).every((k) => k === 'code' || k === 'message')) return { shape: 'status-only', objectKey: '' };
  return { shape: 'bare-object', objectKey: '' };
}

export function classifyRequestBody(op, resolve) {
  if (!op.requestBody) return { has: 'n', kinds: [], properties: [], required: [] };
  const rb = resolve(op.requestBody);
  const content = rb?.content || {};
  const kinds = Object.keys(content);
  const jsonType = kinds.find((m) => m.includes('json'));
  const s = jsonType ? resolve(content[jsonType].schema) : null;
  return { has: 'y', kinds, properties: Object.keys(s?.properties || {}), required: s?.required || [] };
}

export function queryParams(op, pathItem, resolve) {
  return [...(pathItem?.parameters || []), ...(op.parameters || [])]
    .map((p) => resolve(p))
    .filter((p) => p && p.in === 'query');
}

// Cursor pagination is uniform: `cursor` + `limit` in, data.next_cursor out
export function isCursorPaginated(op, pathItem, resolve) {
  return queryParams(op, pathItem, resolve).some((p) => p.name === 'cursor');
}

// ---------------------------------------------------------------------------
// Skip rules: operations that stay visible in the CSV artifacts but are not
// mapped to StackQL methods
// ---------------------------------------------------------------------------
//   multipart_package_upload - the Connector SDK package create / update
//     take multipart/form-data with a binary file part; standing binary
//     exclusion, the Connector SDK CLI is the upload path
//   binary_package_download - the Connector SDK package download returns
//     the package bytes (declared as an empty JSON schema)
export function skipReason(upstreamPath, op, resolve) {
  const body = classifyRequestBody(op, resolve);
  if (body.has === 'y' && body.kinds.length > 0 && body.kinds.every((k) => k.startsWith('multipart/'))) return 'multipart_package_upload';
  if (/\/connector-sdk\/packages\/\{[^}]+\}\/download$/.test(upstreamPath)) return 'binary_package_download';
  return '';
}

// ---------------------------------------------------------------------------
// Mechanical resource and verb derivation (the fallback under the explicit
// rules in map_operations.mjs - a new upstream operation gets a name from
// here, and the mapping stability check reports it as an addition)
// ---------------------------------------------------------------------------

// POST / PATCH / DELETE on these trailing static segments is an action on
// the parent resource (EXEC), not a row write
export const ACTION_SEGMENTS = new Set([
  'sync', 'resync', 'test', 'move', 'reload', 'drop-columns', 'connect-card', 'run', 'cancel', 'upgrade',
  'rotate', 'regenerate-secrets', 'reset-credentials', 're-auth', 'register-hub'
]);

// Strips the leading version segment, then iteratively strips scoping pairs
// (a static segment followed by a path parameter) while more segments
// follow: connections/{connection_id}/warnings -> warnings. The last
// stripped parent is kept so action segments can resolve to it.
export function scopedSegments(provPath) {
  let segs = provPath.split('/').filter(Boolean);
  if (segs[0] === 'v1') segs = segs.slice(1);
  let parent = null;
  while (segs.length > 2 && !segs[0].startsWith('{') && segs[1].startsWith('{')) {
    parent = segs[0];
    segs = segs.slice(2);
  }
  return { segs, parent };
}

export function deriveResource(provPath, verb, pluralizeFn) {
  const { segs, parent } = scopedSegments(provPath);
  let statics = segs.filter((s) => !s.startsWith('{'));
  const last = statics[statics.length - 1];
  if (verb !== 'get' && ACTION_SEGMENTS.has(last)) statics = statics.slice(0, -1);
  if (statics.length === 0 && parent) statics = [parent];
  if (statics.length === 0) return 'unknown';
  const snake = statics.map(camelToSnake);
  return [...snake.slice(0, -1), pluralizeFn(snake[snake.length - 1])].join('_');
}

export function deriveMethod(provPath, verb, shape) {
  const { segs } = scopedSegments(provPath);
  const statics = segs.filter((s) => !s.startsWith('{'));
  const last = statics[statics.length - 1];
  if (verb === 'get') return shape === 'data-items' || shape === 'data-array' ? { method: 'list', sqlVerb: 'select' } : { method: 'get', sqlVerb: 'select' };
  if (ACTION_SEGMENTS.has(last)) return { method: camelToSnake(last), sqlVerb: 'exec' };
  if (verb === 'delete') return { method: 'delete', sqlVerb: 'delete' };
  if (verb === 'patch' || verb === 'put') return { method: 'update', sqlVerb: 'update' };
  return { method: 'create', sqlVerb: 'insert' };
}

// ---------------------------------------------------------------------------
// CSV (RFC 4180, preserves column order)
// ---------------------------------------------------------------------------

export function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else { field += c; }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else { field += c; }
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

export function csvField(v) {
  const s = String(v ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows) {
  return rows.map((r) => r.map(csvField).join(',')).join('\n') + '\n';
}
