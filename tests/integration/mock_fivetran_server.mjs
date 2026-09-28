#!/usr/bin/env node

// Mock Fivetran REST API for integration-testing the generated fivetran
// provider without an account. Serves canned JSON in the wire shapes the
// real API returns (verified against the live API, NOTES.md): every body is
// the {code, message, data} envelope; collections are {items, next_cursor}
// under data with an opaque cursor; single reads carry the entity under
// data; deletes and most actions answer {code, message}; the public
// connector metadata read carries a bare array under data. Errors are the
// vendor's {code, message} with the entity-qualified code (NotFound_Group).
// Mutable in-memory stores make the group, connection, webhook, team and
// membership lifecycles round-trip realistically.
//
// Every /v1 request must carry `Authorization: Basic base64(key:secret)`
// for EXPECTED_KEY / EXPECTED_SECRET or it is rejected 401 - this proves the
// provider's basic auth wiring (FIVETRAN_APIKEY / FIVETRAN_APISECRET). The
// /public path is unauthenticated, as on the real API.
//
// Collections page at DEFAULT_PAGE_SIZE rows when the request carries no
// `limit`, so the seed data spans more than one page and the tests can see
// stackql follow the cursor.
//
// Every request is logged (method, path, query, the Authorization / Accept /
// Content-Type headers, parsed body) so the tests can assert on the wire.
//
// Exports startMockServer() for the test runner; also runnable standalone:
//   node tests/integration/mock_fivetran_server.mjs [port]

import http from 'http';
import { URL } from 'url';

export const EXPECTED_KEY = 'mockApiKey0123456789';
export const EXPECTED_SECRET = 'mockApiSecret0123456789abcdefghij';
export const EXPECTED_BASIC = Buffer.from(`${EXPECTED_KEY}:${EXPECTED_SECRET}`).toString('base64');
export const DEFAULT_PAGE_SIZE = 2;

export const GROUP_A = 'decent_dropsy';
export const GROUP_B = 'projected_sickle';
export const GROUP_C = 'interval_mailbox';
export const CONNECTION_A = 'speak_inexpensive';
export const CONNECTION_B = 'rarity_hospitable';
export const FUNCTION_CONNECTION = 'cropping_function';
export const DESTINATION_A = GROUP_A;
export const USER_A = 'nozzle_eat';
export const USER_B = 'cherry_spoilt';
export const TEAM_A = 'clarification_expand';
export const WEBHOOK_A = 'recoup_befell';
export const AGENT_A = 'lubricant_ambition';
export const PROXY_A = 'cautious_subgroup';
export const ESM_A = 'vault_primary';
export const TRANSFORMATION_A = 'wither_overheat';
export const SYSTEM_KEY_A = 'meaningless_restoration';

const RATE_HEADERS = { 'x-rate-limit': '500', 'x-rate-limit-remaining': '499' };
const EXPIRATION_PERIODS = ['ONE_WEEK', 'ONE_MONTH', 'THREE_MONTHS', 'SIX_MONTHS', 'INFINITE'];
const NOW = '2026-09-01T02:03:04.000000Z';

let idCounter = 0;
const newId = (prefix) => `${prefix}_mock${String(++idCounter).padStart(3, '0')}`;

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function connectionObj(id, groupId, service, schema, extra = {}) {
  return {
    id, group_id: groupId, service, service_version: 1, schema, connected_by: USER_A, created_at: NOW,
    succeeded_at: null, failed_at: null, paused: true, pause_after_trial: false, sync_frequency: 360,
    data_delay_threshold: 0, data_delay_sensitivity: 'NORMAL', private_link_id: null, networking_method: 'Directly',
    proxy_agent_id: null, schedule_type: 'auto',
    status: { setup_state: 'incomplete', schema_status: 'ready', sync_state: 'paused', update_state: 'on_schedule', is_historical_sync: true, tasks: [], warnings: [] },
    config: { sync_format: 'Unpacked', auth_method: 'NONE' },
    ...extra
  };
}

function schemaConfig() {
  return {
    enable_new_by_default: true, schema_change_handling: 'ALLOW_ALL', row_filtering_supported: false,
    schemas: {
      public: {
        name_in_destination: 'public', enabled: true,
        tables: {
          orders: { name_in_destination: 'orders', enabled: true, sync_mode: 'SOFT_DELETE', enabled_patch_settings: { allowed: true } },
          customers: { name_in_destination: 'customers', enabled: true, sync_mode: 'SOFT_DELETE', enabled_patch_settings: { allowed: true } },
          audit_log: { name_in_destination: 'audit_log', enabled: true, sync_mode: 'SOFT_DELETE', enabled_patch_settings: { allowed: true } }
        }
      }
    }
  };
}

function makeState() {
  return {
    groups: new Map([
      [GROUP_A, { id: GROUP_A, name: 'Warehouse', created_at: '2023-03-17T06:08:56.074403Z' }],
      [GROUP_B, { id: GROUP_B, name: 'Analytics', created_at: '2024-01-02T03:04:05.000000Z' }],
      [GROUP_C, { id: GROUP_C, name: 'Sandbox', created_at: '2025-06-07T08:09:10.000000Z' }]
    ]),
    connections: new Map([
      [CONNECTION_A, connectionObj(CONNECTION_A, GROUP_A, 'postgres', 'pg_prod', { paused: false, status: { setup_state: 'connected', schema_status: 'ready', sync_state: 'scheduled', update_state: 'on_schedule', is_historical_sync: false, tasks: [], warnings: [] } })],
      [CONNECTION_B, connectionObj(CONNECTION_B, GROUP_A, 'webhooks', 'hooks.events')],
      [FUNCTION_CONNECTION, connectionObj(FUNCTION_CONNECTION, GROUP_B, 'aws_lambda', 'fn_orders')]
    ]),
    connectionState: new Map([[FUNCTION_CONNECTION, { state: { cursor: '2026-08-31T00:00:00Z' } }]]),
    schemaConfigs: new Map([[CONNECTION_A, schemaConfig()]]),
    destinations: new Map([
      [DESTINATION_A, { id: DESTINATION_A, group_id: GROUP_A, service: 'big_query', region: 'GCP_US_EAST4', time_zone_offset: '-8', setup_status: 'connected', daylight_saving_time_enabled: false, private_link_id: null, networking_method: 'Directly', proxy_agent_id: null, config: { project_id: 'mock-project', data_set_location: 'US', secret_key: '******' } }]
    ]),
    users: new Map([
      [USER_A, { id: USER_A, email: 'owner@example.com', given_name: 'Olive', family_name: 'Owner', verified: true, invited: false, picture: null, phone: null, role: 'Account Administrator', active: true, logged_in_at: NOW, created_at: '2023-03-17T06:00:00.000000Z' }],
      [USER_B, { id: USER_B, email: 'analyst@example.com', given_name: 'Ana', family_name: 'Lyst', verified: true, invited: false, picture: null, phone: null, role: null, active: true, logged_in_at: null, created_at: '2024-02-03T04:05:06.000000Z' }]
    ]),
    groupUsers: new Map([[GROUP_A, new Map([[USER_A, 'Destination Administrator']])]]),
    teams: new Map([[TEAM_A, { id: TEAM_A, name: 'Data Platform', description: 'Owns the warehouse', role: 'Account Reviewer' }]]),
    teamGroups: new Map([[TEAM_A, new Map([[GROUP_A, { id: GROUP_A, role: 'Destination Reviewer', created_at: NOW }]])]]),
    teamConnections: new Map([[TEAM_A, new Map()]]),
    teamUsers: new Map([[TEAM_A, new Map([[USER_B, { user_id: USER_B, role: 'Team Member' }]])]]),
    userGroups: new Map([[USER_A, new Map([[GROUP_A, { id: GROUP_A, role: 'Destination Administrator', created_at: NOW }]])]]),
    webhooks: new Map([[WEBHOOK_A, { id: WEBHOOK_A, type: 'account', group_id: null, url: 'https://hooks.example.com/fivetran', events: ['sync_end'], active: true, secret: '******', created_at: NOW, created_by: USER_A }]]),
    systemKeys: new Map([[SYSTEM_KEY_A, { id: SYSTEM_KEY_A, name: 'ci', key: 'mockSystemKey', permissions: [{ resource_type: 'DESTINATION', access_level: 'READ' }], created_at: NOW, updated_at: null, expired_at: '2027-09-01T02:03:04.000000Z', last_used_at: null }]]),
    transformations: new Map([[TRANSFORMATION_A, { id: TRANSFORMATION_A, status: 'SUCCEEDED', paused: false, type: 'QUICKSTART', created_at: NOW, created_by_id: USER_A, last_started_at: null, last_ended_at: null, output_model_names: ['orders_daily'], schedule: { schedule_type: 'INTEGRATED' }, transformation_config: { package_name: 'shopify' } }]]),
    transformationRuns: [],
    agents: new Map([[AGENT_A, { id: AGENT_A, display_name: 'hybrid-syd', group_id: GROUP_A, registered_at: NOW, env_type: 'DOCKER', auth_type: 'KEY_PAIR', usage: [] }]]),
    proxies: new Map([[PROXY_A, { id: PROXY_A, account_id: 'mock_account', registered_at: NOW, region: 'GCP_US_EAST4', created_by: USER_A, display_name: 'proxy-east', version: null, status: null, usage: [] }]]),
    roles: [
      { name: 'Account Administrator', description: 'Full access', is_custom: false, scope: ['ACCOUNT'], is_deprecated: false, replacement_role_name: null },
      { name: 'Account Reviewer', description: 'Read access', is_custom: false, scope: ['ACCOUNT'], is_deprecated: false, replacement_role_name: null },
      { name: 'Destination Administrator', description: 'Destination access', is_custom: false, scope: ['DESTINATION'], is_deprecated: false, replacement_role_name: null }
    ],
    connectorTypes: ['google_sheets', 'postgres', 'salesforce', 'webhooks', 'zendesk'].map((id) => ({
      id, name: id.replace(/_/g, ' '), type: id === 'postgres' ? 'Database' : 'Application', description: `${id} connector`, icon_url: `https://cdn.example.com/${id}.svg`,
      icons: [], link_to_docs: `https://fivetran.com/docs/connectors/${id}`, connector_class: 'standard', supported_features: [{ id: 'API_CONFIGURABLE', notes: '' }], service_status: 'general_availability'
    })),
    esmEntities: [{ id: CONNECTION_A, type: 'CONNECTION', esm_id: ESM_A }, { id: DESTINATION_A, type: 'DESTINATION', esm_id: ESM_A }],
    syncRequests: [],
    roleRemovals: [],
    authFailures: 0
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ok = (data, message = 'Operation performed.') => ({ status: 200, body: data === undefined ? { code: 'Success', message } : { code: 'Success', message, data } });
const created = (data, message = 'Created.') => ({ status: 201, body: { code: 'Success', message, data } });
const notFound = (entity, id) => ({ status: 404, body: { code: `NotFound_${entity}`, message: `Cannot find entity '${entity}' with id '${id}'.` } });
const invalid = (message) => ({ status: 400, body: { code: 'InvalidInput', message } });

function page(items, query) {
  const limit = query.limit ? Number(query.limit) : DEFAULT_PAGE_SIZE;
  let offset = 0;
  if (query.cursor) {
    try {
      offset = JSON.parse(Buffer.from(query.cursor, 'base64').toString('utf8')).skip;
    } catch {
      return invalid(`Invalid cursor '${query.cursor}'`);
    }
  }
  const slice = items.slice(offset, offset + limit);
  const data = { items: slice };
  if (offset + limit < items.length) data.next_cursor = Buffer.from(JSON.stringify({ skip: offset + limit })).toString('base64').replace(/=+$/, '');
  return ok(data, 'Retrieved successfully');
}

// plain CRUD over a Map-backed collection
function crud(store, entity, { idPrefix, create, patch }) {
  return {
    list: (query, filter) => page([...store.values()].filter(filter || (() => true)), query),
    get: (id) => (store.has(id) ? ok(store.get(id), `${entity} retrieved`) : notFound(entity, id)),
    create: (body, extra = {}) => {
      const id = newId(idPrefix);
      const obj = create(id, body || {}, extra);
      if (obj.error) return invalid(obj.error);
      store.set(id, obj);
      return created(obj, `${entity} has been created`);
    },
    update: (id, body) => {
      if (!store.has(id)) return notFound(entity, id);
      const next = { ...store.get(id), ...(patch ? patch(body || {}) : body || {}) };
      store.set(id, next);
      return ok(next, `${entity} has been updated`);
    },
    remove: (id) => {
      if (!store.has(id)) return notFound(entity, id);
      store.delete(id);
      return ok(undefined, `${entity} with id '${id}' has been deleted`);
    }
  };
}

// memberships: a Map<parentId, Map<childId, row>>
function memberships(store, parents, parentEntity, idField) {
  const of = (parentId) => {
    if (!store.has(parentId)) store.set(parentId, new Map());
    return store.get(parentId);
  };
  return {
    list: (parentId, query) => (parents.has(parentId) ? page([...of(parentId).values()], query) : notFound(parentEntity, parentId)),
    get: (parentId, id) => (of(parentId).has(id) ? ok(of(parentId).get(id)) : notFound('Membership', id)),
    create: (parentId, body) => {
      if (!parents.has(parentId)) return notFound(parentEntity, parentId);
      const id = body?.[idField];
      if (!id || !body?.role) return invalid(`'${idField}' and 'role' are required`);
      const row = { [idField]: id, role: body.role, created_at: NOW };
      of(parentId).set(id, row);
      return created(row, 'Membership has been created');
    },
    update: (parentId, id, body) => {
      if (!of(parentId).has(id)) return notFound('Membership', id);
      of(parentId).set(id, { ...of(parentId).get(id), ...body });
      return ok(of(parentId).get(id), 'Membership has been updated');
    },
    remove: (parentId, id) => {
      if (!of(parentId).has(id)) return notFound('Membership', id);
      of(parentId).delete(id);
      return ok(undefined, 'Membership has been deleted');
    }
  };
}

// ---------------------------------------------------------------------------
// Routing
// ---------------------------------------------------------------------------

function route(state, method, pathname, query, body) {
  const seg = pathname.split('/').filter(Boolean);
  if (seg[0] === 'public') {
    if (method === 'GET' && seg[1] === 'connector-types') return ok(state.connectorTypes, 'Connector metadata retrieved successfully');
    return { status: 404, body: { code: 'NotFound', message: 'HTTP 404 Not Found' } };
  }
  if (seg[0] !== 'v1') return { status: 404, body: { code: 'NotFound', message: 'HTTP 404 Not Found' } };
  const [, a, b, c, d, e, f, g, h] = seg;

  const groups = crud(state.groups, 'Group', { idPrefix: 'group', create: (id, bd) => (bd.name ? { id, name: bd.name, created_at: NOW } : { error: "'name' is required" }) });
  const connections = crud(state.connections, 'Connection', {
    idPrefix: 'connection',
    create: (id, bd) => {
      if (!bd.group_id || !bd.service) return { error: "'group_id' and 'service' are required" };
      if (!state.groups.has(bd.group_id)) return { error: `Group '${bd.group_id}' not found` };
      if (bd.config !== undefined && (typeof bd.config !== 'object' || bd.config === null)) return { error: "'config' must be an object" };
      const schema = [bd.config?.schema, bd.config?.table].filter(Boolean).join('.') || `${bd.service}_${id}`;
      return connectionObj(id, bd.group_id, bd.service, schema, { paused: bd.paused ?? false, sync_frequency: bd.sync_frequency ?? 360, config: bd.config || {} });
    }
  });
  const destinations = crud(state.destinations, 'Destination', {
    idPrefix: 'destination',
    create: (id, bd) => (bd.group_id && bd.service ? { id: bd.group_id, group_id: bd.group_id, service: bd.service, region: bd.region || 'GCP_US_EAST4', time_zone_offset: bd.time_zone_offset || '0', setup_status: 'incomplete', config: bd.config || {} } : { error: "'group_id' and 'service' are required" })
  });
  const webhooks = crud(state.webhooks, 'Webhook', {
    idPrefix: 'webhook',
    create: (id, bd, extra) => (bd.url && Array.isArray(bd.events) ? { id, type: extra.type, group_id: extra.group_id || null, url: bd.url, events: bd.events, active: bd.active ?? true, secret: '******', created_at: NOW, created_by: USER_A } : { error: "'url' and 'events' (array) are required" })
  });
  const teams = crud(state.teams, 'Team', { idPrefix: 'team', create: (id, bd) => (bd.name && bd.role ? { id, name: bd.name, description: bd.description || null, role: bd.role } : { error: "'name' and 'role' are required" }) });
  const users = crud(state.users, 'User', { idPrefix: 'user', create: (id, bd) => (bd.email ? { id, email: bd.email, given_name: bd.given_name, family_name: bd.family_name, verified: false, invited: true, role: bd.role || null, active: true, created_at: NOW } : { error: "'email' is required" }) });
  const systemKeys = crud(state.systemKeys, 'SystemKey', {
    idPrefix: 'key',
    create: (id, bd) => {
      if (bd.expiration_period !== undefined && !EXPIRATION_PERIODS.includes(bd.expiration_period)) return { error: `expiration_period must be one of ${EXPIRATION_PERIODS.join(', ')}` };
      return { id, name: bd.name, key: 'mockSystemKey', secret: 'mockSystemSecret', permissions: bd.permissions || [], created_at: NOW, updated_at: null, expired_at: '2027-09-01T02:03:04.000000Z', last_used_at: null };
    }
  });
  const agents = crud(state.agents, 'Agent', { idPrefix: 'agent', create: (id, bd) => ({ id, display_name: bd.display_name, group_id: bd.group_id, registered_at: NOW, env_type: bd.env_type, auth_type: bd.auth_type || 'KEY_PAIR', usage: [] }) });
  const proxies = crud(state.proxies, 'Proxy', { idPrefix: 'proxy', create: (id, bd) => ({ id, account_id: 'mock_account', registered_at: NOW, region: bd.group_region, created_by: USER_A, display_name: bd.display_name, version: null, status: null, usage: [] }) });
  const standard = (col, id) => {
    if (!id) return method === 'GET' ? col.list(query) : method === 'POST' ? col.create(body) : null;
    if (method === 'GET') return col.get(id);
    if (method === 'PATCH') return col.update(id, body);
    if (method === 'DELETE') return col.remove(id);
    return null;
  };
  const member = (m, parentId, id) => {
    if (!id) return method === 'GET' ? m.list(parentId, query) : method === 'POST' ? m.create(parentId, body) : null;
    if (method === 'GET') return m.get(parentId, id);
    if (method === 'PATCH') return m.update(parentId, id, body);
    if (method === 'DELETE') return m.remove(parentId, id);
    return null;
  };

  switch (a) {
    case 'account':
      if (b === 'info' && method === 'GET') return ok({ account_id: 'mock_account', account_name: 'Mock_Account', user_id: USER_A, system_key_id: null }, 'Account information retrieved successfully');
      break;
    case 'roles':
      if (method === 'GET') return page(state.roles, query);
      break;
    case 'system-keys':
      if (c === 'rotate' && method === 'POST') {
        if (!state.systemKeys.has(b)) return notFound('SystemKey', b);
        if (body?.expiration_period !== undefined && !EXPIRATION_PERIODS.includes(body.expiration_period)) return invalid(`expiration_period must be one of ${EXPIRATION_PERIODS.join(', ')}`);
        return ok({ ...state.systemKeys.get(b), key: 'rotatedKey' }, `System key with id '${b}' has been rotated`);
      }
      if (!c) return standard(systemKeys, b);
      break;
    case 'groups': {
      if (!c) return standard(groups, b);
      if (!state.groups.has(b)) return notFound('Group', b);
      if (c === 'connections' && method === 'GET') return page([...state.connections.values()].filter((x) => x.group_id === b && (!query.schema || x.schema === query.schema)), query);
      if (c === 'public-key' && method === 'GET') return ok({ public_key: 'ssh-rsa AAAAMOCK fivetran user key\n' });
      if (c === 'service-account' && method === 'GET') return ok({ service_account: `g-${b.replace(/_/g, '-')}@fivetran-production.iam.gserviceaccount.com` });
      if (c === 'users') {
        const gu = state.groupUsers.get(b) || state.groupUsers.set(b, new Map()).get(b);
        if (!d && method === 'GET') return page([...gu.entries()].map(([id, role]) => ({ ...state.users.get(id), role })), query);
        if (!d && method === 'POST') {
          const u = [...state.users.values()].find((x) => x.email === body?.email);
          if (!u) return notFound('User', body?.email);
          gu.set(u.id, body.role);
          return ok(undefined, 'User has been added to the group');
        }
        if (d && method === 'DELETE') return gu.delete(d) ? ok(undefined, 'User has been removed from the group') : notFound('User', d);
      }
      break;
    }
    case 'connections': {
      if (!b) {
        if (method === 'GET') return page([...state.connections.values()].filter((x) => (!query.group_id || x.group_id === query.group_id) && (!query.schema || x.schema === query.schema)), query);
        return standard(connections, b);
      }
      if (!c) return standard(connections, b);
      if (!state.connections.has(b)) return notFound('Connection', b);
      const conn = state.connections.get(b);
      if (method === 'POST' && ['sync', 'resync', 'test', 'move', 'connect-card'].includes(c) && !d) {
        state.syncRequests.push({ connection: b, action: c, body });
        if (c === 'sync') return ok(undefined, `Sync has been successfully triggered for connection with id '${b}'`);
        if (c === 'resync') return ok(undefined, 'Re-sync has been triggered successfully');
        if (c === 'test') return ok({ ...conn, setup_tests: [{ title: 'Validate', status: 'PASSED', message: '', details: null }] }, 'Setup tests were completed');
        if (c === 'move') return ok({ job_id: 'job_mock001', status: 'IN_PROGRESS' }, 'Move has been started');
        if (c === 'connect-card') return ok({ connect_card: { token: 'mockConnectCardToken', uri: 'https://fivetran.com/connect-card/setup?auth=mock' }, connector_id: b }, 'Connect Card has been created');
      }
      if (c === 'move' && d && method === 'GET') return ok({ job_id: d, connection_id: b, status: 'COMPLETED' });
      if (c === 'state') {
        if (!state.connectionState.has(b)) return invalid(`Update state not allowed for connection with id = '${b}': not a Function or Connector SDK connector.`);
        if (method === 'GET') return ok(state.connectionState.get(b));
        if (method === 'PATCH') { state.connectionState.set(b, { state: body?.state }); return ok(state.connectionState.get(b), 'State has been updated'); }
      }
      if (c === 'sync-history' && method === 'GET') {
        return page([1, 2, 3].map((n) => ({ sync_id: `sync_${n}`, status: 'SUCCESSFUL', reason: null, start: `2026-08-2${n}T00:00:00Z`, end: `2026-08-2${n}T00:05:00Z`, stages: { extract: { volume: 1000 * n }, process: { volume: 1000 * n }, load: { volume: 1000 * n } } })), query);
      }
      if (c === 'warnings' && !d && method === 'GET') return page([{ type: 'STALE_DATA', message: 'Data is stale', created_at: NOW }], query);
      if (c === 'warnings' && d && method === 'DELETE') return ok(undefined, 'Warning has been dismissed');
      if (c === 'schemas') {
        const cfg = state.schemaConfigs.get(b);
        if (!d) {
          if (method === 'GET') return cfg ? ok(cfg) : { status: 404, body: { code: 'NotFound_SchemaConfig', message: `Connection with id '${b}' doesn't have schema config` } };
          if (method === 'POST') { state.schemaConfigs.set(b, { ...schemaConfig(), ...body }); return ok(state.schemaConfigs.get(b), 'Schema config has been created'); }
          if (method === 'PATCH') { Object.assign(cfg, body); return ok(cfg, 'Schema config has been updated'); }
        }
        if (['reload', 'drop-columns'].includes(d) && method === 'POST') { state.syncRequests.push({ connection: b, action: `schemas/${d}`, body }); return ok(cfg, `Schema ${d} done`); }
        if (d === 'tables' && e === 'resync' && method === 'POST') { state.syncRequests.push({ connection: b, action: 'schemas/tables/resync', body }); return ok(undefined, 'Re-sync has been triggered successfully'); }
        if (!cfg) return notFound('SchemaConfig', b);
        const schema = cfg.schemas[d];
        if (!schema) return notFound('Schema', d);
        if (!e && method === 'PATCH') { Object.assign(schema, body); return ok(cfg, 'Schema has been updated'); }
        if (e === 'tables' && f) {
          const table = schema.tables[f];
          if (!table) return notFound('Table', f);
          if (!g && method === 'PATCH') { Object.assign(table, body); return ok(cfg, 'Table has been updated'); }
          if (g === 'columns') {
            table.columns = table.columns || { id: { name_in_destination: 'id', enabled: true, hashed: false, is_primary_key: true }, email: { name_in_destination: 'email', enabled: true, hashed: false, is_primary_key: false } };
            if (!h && method === 'GET') return ok({ columns: table.columns });
            if (h && method === 'PATCH') { table.columns[h] = { ...(table.columns[h] || { name_in_destination: h }), ...body }; return ok(cfg, 'Column has been updated'); }
            if (h && method === 'DELETE') { delete table.columns[h]; return ok(undefined, 'Column has been dropped'); }
          }
        }
      }
      break;
    }
    case 'destinations':
      if (c === 'test' && method === 'POST') return state.destinations.has(b) ? ok({ ...state.destinations.get(b), setup_tests: [{ title: 'Connecting', status: 'PASSED', message: '' }] }, 'Setup tests were completed') : notFound('Destination', b);
      if (!c) return standard(destinations, b);
      break;
    case 'users': {
      if (b && c === 'role' && method === 'DELETE') { state.roleRemovals.push({ user: b }); return state.users.has(b) ? ok(undefined, 'User role has been removed') : notFound('User', b); }
      if (b && c === 'groups') return member(memberships(state.userGroups, state.users, 'User', 'id'), b, d);
      if (!c) return standard(users, b);
      break;
    }
    case 'teams': {
      if (b && c === 'role' && method === 'DELETE') { state.roleRemovals.push({ team: b }); return state.teams.has(b) ? ok(undefined, 'Team role has been removed') : notFound('Team', b); }
      if (b && c === 'groups') return member(memberships(state.teamGroups, state.teams, 'Team', 'id'), b, d);
      if (b && c === 'connections') return member(memberships(state.teamConnections, state.teams, 'Team', 'id'), b, d);
      if (b && c === 'users') return member(memberships(state.teamUsers, state.teams, 'Team', 'user_id'), b, d);
      if (!c) return standard(teams, b);
      break;
    }
    case 'webhooks':
      if (b === 'account' && !c && method === 'POST') return webhooks.create(body, { type: 'account' });
      if (b === 'group' && c && method === 'POST') return state.groups.has(c) ? webhooks.create(body, { type: 'group', group_id: c }) : notFound('Group', c);
      if (b && c === 'test' && method === 'POST') return state.webhooks.has(b) ? ok({ succeed: true, status: 200, message: 'OK' }, 'Webhook has been tested') : notFound('Webhook', b);
      if (!c) return standard(webhooks, b);
      break;
    case 'metadata':
      if (b === 'connector-types' && !c && method === 'GET') return page(state.connectorTypes, query);
      if (b === 'connector-types' && c && method === 'GET') {
        const t = state.connectorTypes.find((x) => x.id === c);
        return t ? ok({ ...t, config: { schema: { type: 'string' } }, auth: {} }) : notFound('ConnectorType', c);
      }
      break;
    case 'hybrid-deployment-agents':
      if (!b && method === 'GET') return page([...state.agents.values()].filter((x) => !query.groupId || x.group_id === query.groupId), query);
      if (c === 're-auth' && method === 'PATCH') return state.agents.has(b) ? ok({ ...state.agents.get(b), auth_type: body?.auth_type || 'KEY_PAIR' }, 'Agent has been re-authenticated') : notFound('Agent', b);
      if (c === 'reset-credentials' && method === 'POST') return state.agents.has(b) ? ok({ ...state.agents.get(b), token: 'mockToken' }, 'Credentials have been reset') : notFound('Agent', b);
      if (!c) return standard(agents, b);
      break;
    case 'proxy':
      if (b && c === 'connections' && method === 'GET') return page([{ connection_id: CONNECTION_A }], query);
      if (b && c === 'regenerate-secrets' && method === 'POST') return state.proxies.has(b) ? ok({ agent_id: b, auth_token: 'mockToken' }, 'Secrets have been regenerated') : notFound('Proxy', b);
      if (!c) return standard(proxies, b);
      break;
    case 'transformations': {
      if (!b && method === 'GET') return page([...state.transformations.values()].filter((x) => (!query.type || x.type === query.type)), query);
      if (b && !c && method === 'GET') return state.transformations.has(b) ? ok(state.transformations.get(b)) : notFound('Transformation', b);
      if (b && ['run', 'cancel', 'upgrade'].includes(c) && method === 'POST') {
        if (!state.transformations.has(b)) return notFound('Transformation', b);
        state.transformationRuns.push({ transformation: b, action: c, body });
        return ok(undefined, `Transformation ${c} has been requested`);
      }
      break;
    }
    case 'transformation-projects':
      if (!b && method === 'GET') return page([], query);
      break;
    case 'external-secrets-managers-entities':
      if (method === 'GET') return page(state.esmEntities.filter((x) => (!query.esm_id || x.esm_id === query.esm_id) && (!query.type || x.type === query.type)), query);
      break;
    case 'external-secrets-managers':
      if (!b && method === 'GET') return page([{ id: ESM_A, name: 'primary vault', type: 'HASHICORP_VAULT', is_hybrid_deployment: false, config: { vault_url: 'https://vault.example.com' }, created_at: NOW }], query);
      if (b && c === 'entities' && method === 'GET') return page(state.esmEntities.filter((x) => x.esm_id === b && (!query.type || x.type === query.type)), query);
      break;
    default:
      break;
  }
  return { status: 404, body: { code: 'NotFound', message: 'HTTP 404 Not Found' } };
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

export function startMockServer(port = 0) {
  const state = makeState();
  const log = [];
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      let body;
      try { body = raw ? JSON.parse(raw) : undefined; } catch { body = raw; }
      const query = Object.fromEntries(url.searchParams.entries());
      const entry = {
        method: req.method, path: url.pathname, query, body, raw,
        authorization: req.headers.authorization || '', accept: req.headers.accept || '', contentType: req.headers['content-type'] || ''
      };
      log.push(entry);

      let result;
      const authed = entry.authorization === `Basic ${EXPECTED_BASIC}`;
      if (!url.pathname.startsWith('/public/') && !authed) {
        state.authFailures++;
        result = { status: 401, body: { code: 'AuthFailed', message: 'Invalid authorization credentials' } };
      } else {
        try {
          result = route(state, req.method, url.pathname, query, body) || { status: 405, body: { code: 'MethodNotAllowed', message: `HTTP 405 Method Not Allowed` } };
        } catch (err) {
          result = { status: 500, body: { code: 'InternalError', message: String(err && err.stack ? err.stack : err) } };
        }
      }
      entry.status = result.status;
      res.writeHead(result.status, { 'Content-Type': 'application/json', ...RATE_HEADERS });
      res.end(JSON.stringify(result.body));
    });
  });
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve({ server, port: server.address().port, log, state }));
  });
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('mock_fivetran_server.mjs')) {
  const { port } = await startMockServer(Number(process.argv[2]) || 8099);
  console.log(`mock Fivetran API listening on http://localhost:${port} (key ${EXPECTED_KEY}, secret ${EXPECTED_SECRET})`);
}
