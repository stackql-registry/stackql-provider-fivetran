#!/usr/bin/env node

// Integration tests: run the generated fivetran provider (local file
// registry) against the mock Fivetran API and assert row-level results and
// wire calls for each operation archetype:
//   - HTTP basic auth from FIVETRAN_APIKEY / FIVETRAN_APISECRET (the mock
//     401s anything else), and the 401 surfaced
//   - the {code, message, data} envelope: $.data.items collections and
//     $.data single reads
//   - cursor pagination followed across pages (groups, connector types,
//     roles, sync history)
//   - query parameters pushed down (connections by group_id / schema)
//   - Accept: application/json on every operation (the vendor's
//     version=2 negotiation is not expressible, NOTES.md finding 4)
//   - INSERT ... RETURNING, UPDATE ... RETURNING, DELETE
//   - JSON object body attributes (connection config) and typed scalars
//   - the two webhook INSERT methods routed by signature
//   - memberships addressed by two path parameters
//   - schema config: connection-level, schema-level and table-level UPDATE
//     routed by signature; the columns read, update and delete
//   - EXEC lifecycle actions (sync, resync, run_setup_tests,
//     remove_account_role, rotate)
//   - the snake_case key on the one camelCase query parameter (group_id ->
//     groupId, request.nativeCasing)
//   - the public (unauthenticated, non-/v1) connector metadata read
//   - the 404 and 400 error bodies surfaced
//
// The provider's server is https-only and cannot address the mock, so the
// harness (harness.mjs) materialises a TEST COPY of provider-dev/openapi in
// tests/integration/.registry-tmp (gitignored, recreated each run) with the
// server URL rewritten to the mock. provider-dev/** is never modified.
//
// Requires a stackql binary: $STACKQL, ./stackql, or `stackql` on PATH.
//
// Usage: node tests/integration/run_integration_tests.mjs [--verbose]

import {
  startMockServer, EXPECTED_BASIC, DEFAULT_PAGE_SIZE,
  GROUP_A, GROUP_B, CONNECTION_A, CONNECTION_B, FUNCTION_CONNECTION, DESTINATION_A,
  USER_A, USER_B, TEAM_A, WEBHOOK_A, AGENT_A, PROXY_A, ESM_A
} from './mock_fivetran_server.mjs';
import { buildTestRegistry, makeRunSql, findStackql } from './harness.mjs';

const verbose = process.argv.includes('--verbose');
const t0 = Date.now();

const results = [];
function check(name, cond, note = '') {
  results.push({ name, pass: !!cond, note });
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${name}${!cond && note ? `  [${String(note).slice(0, 300)}]` : ''}`);
}

const { server, port, log, state } = await startMockServer();
const runSql = makeRunSql(buildTestRegistry(port), { verbose });
console.log(`mock Fivetran API on localhost:${port}, stackql: ${findStackql()}`);

const calls = (mark, method, p) => log.slice(mark).filter((e) => e.method === method && e.path === p);
const wire = (mark) => JSON.stringify(log.slice(mark).map((e) => `${e.method} ${e.path} ${JSON.stringify(e.query)} -> ${e.status}`));
const json = (v) => (typeof v === 'string' ? JSON.parse(v) : v);

try {
  // --- meta sanity
  let r = await runSql('SHOW SERVICES IN fivetran');
  check('show services (15)', r.rows && r.rows.length === 15, r.err || `got ${r.rows?.length}`);

  // --- basic auth + groups list across pages
  let mark = log.length;
  r = await runSql('SELECT id, name, created_at FROM fivetran.groups.groups');
  const groupCalls = calls(mark, 'GET', '/v1/groups');
  check(`groups list follows the cursor (3 rows over ${Math.ceil(3 / DEFAULT_PAGE_SIZE)} pages, $.data.items)`, r.rows && r.rows.length === 3 && groupCalls.length === 2 && !groupCalls[0].query.cursor && !!groupCalls[1].query.cursor, r.err || `rows=${r.rows?.length} wire=${wire(mark)}`);
  check('basic auth sent (Authorization: Basic base64(FIVETRAN_APIKEY:FIVETRAN_APISECRET))', groupCalls[0]?.authorization === `Basic ${EXPECTED_BASIC}`, JSON.stringify(groupCalls[0]?.authorization));
  check('no auth failures so far', state.authFailures === 0, `authFailures=${state.authFailures}`);
  r = await runSql('SELECT id FROM fivetran.groups.groups', { FIVETRAN_APISECRET: 'wrong' });
  check('wrong secret -> 401 surfaced', r.err && /401/.test(r.err), r.err || 'no error');
  mark = log.length;
  r = await runSql('SELECT id, name FROM fivetran.groups.groups WHERE "limit" = 100');
  check('limit pushed down as a query parameter (one page)', r.rows && r.rows.length === 3 && calls(mark, 'GET', '/v1/groups').length === 1 && calls(mark, 'GET', '/v1/groups')[0].query.limit === '100', r.err || wire(mark));

  // --- single reads ($.data)
  mark = log.length;
  r = await runSql(`SELECT id, name FROM fivetran.groups.groups WHERE group_id = '${GROUP_B}'`);
  check('group get by group_id (snake_case path parameter, $.data)', r.rows && r.rows.length === 1 && r.rows[0].name === 'Analytics' && calls(mark, 'GET', `/v1/groups/${GROUP_B}`).length === 1, r.err || JSON.stringify(r.rows));
  r = await runSql('SELECT account_id, account_name, user_id FROM fivetran.account.account_info');
  check('account_info get', r.rows && r.rows[0]?.account_id === 'mock_account', r.err || JSON.stringify(r.rows));
  r = await runSql(`SELECT public_key FROM fivetran.groups.ssh_public_keys WHERE group_id = '${GROUP_A}'`);
  check('group ssh public key', r.rows && String(r.rows[0]?.public_key).startsWith('ssh-rsa'), r.err || JSON.stringify(r.rows));
  r = await runSql(`SELECT service_account FROM fivetran.groups.service_accounts WHERE group_id = '${GROUP_A}'`);
  check('group service account', r.rows && /gserviceaccount/.test(r.rows[0]?.service_account), r.err || JSON.stringify(r.rows));
  r = await runSql(`SELECT id, email, role FROM fivetran.groups.users WHERE group_id = '${GROUP_A}'`);
  check('group users list', r.rows && r.rows.length === 1 && r.rows[0].id === USER_A && r.rows[0].role === 'Destination Administrator', r.err || JSON.stringify(r.rows));
  r = await runSql('SELECT name, is_custom FROM fivetran.account.roles');
  check('roles list (3 rows over 2 pages)', r.rows && r.rows.length === 3, r.err || JSON.stringify(r.rows));

  // --- group lifecycle: INSERT ... RETURNING, UPDATE ... RETURNING, DELETE
  mark = log.length;
  r = await runSql(`INSERT INTO fivetran.groups.groups (name) SELECT 'stackql_smoke_it' RETURNING id, name, created_at`);
  const groupPost = calls(mark, 'POST', '/v1/groups');
  const newGroup = r.rows?.[0]?.id;
  check('groups INSERT ... RETURNING projects the created entity ($.data on a write)', !r.err && groupPost.length === 1 && groupPost[0].body?.name === 'stackql_smoke_it' && Object.keys(groupPost[0].body).length === 1 && !!newGroup && r.rows[0].name === 'stackql_smoke_it', r.err || JSON.stringify([groupPost.map((c) => c.body), r.rows]));
  check('INSERT sends Content-Type application/json', /application\/json/.test(groupPost[0]?.contentType || ''), groupPost[0]?.contentType);
  mark = log.length;
  r = await runSql(`UPDATE fivetran.groups.groups SET name = 'stackql_smoke_it_2' WHERE group_id = '${newGroup}' RETURNING id, name`);
  const groupPatch = calls(mark, 'PATCH', `/v1/groups/${newGroup}`);
  check('groups UPDATE ... RETURNING (PATCH, body carries the SET keys only)', !r.err && groupPatch.length === 1 && groupPatch[0].body?.name === 'stackql_smoke_it_2' && Object.keys(groupPatch[0].body).length === 1 && r.rows?.[0]?.name === 'stackql_smoke_it_2', r.err || JSON.stringify([groupPatch.map((c) => c.body), r.rows]));

  // --- connections: query pushdown, Accept negotiation, JSON config body
  mark = log.length;
  r = await runSql(`SELECT id, service, "schema", paused, json_extract(status, '$.setup_state') AS setup_state FROM fivetran.connections.connections WHERE group_id = '${GROUP_A}'`);
  const connList = calls(mark, 'GET', '/v1/connections');
  check('connections list with group_id pushed down as a query parameter', r.rows && r.rows.length === 2 && connList.length === 1 && connList[0].query.group_id === GROUP_A && r.rows.some((x) => x.setup_state === 'connected'), r.err || `${JSON.stringify(r.rows)} ${wire(mark)}`);
  check('Accept: application/json sent (the response media type; no Accept parameter on the surface)', connList[0]?.accept === 'application/json', JSON.stringify(connList[0]?.accept));
  r = await runSql('SHOW EXTENDED METHODS IN fivetran.connections.connections');
  check('no method exposes an Accept parameter', r.rows && r.rows.length > 0 && !/accept/i.test(JSON.stringify(r.rows)), r.err || JSON.stringify(r.rows).slice(0, 300));
  mark = log.length;
  r = await runSql(`SELECT id FROM fivetran.connections.connections WHERE group_id = '${GROUP_A}' AND "schema" = 'hooks.events'`);
  check('connections list with schema pushed down (quoted keyword column)', r.rows && r.rows.length === 1 && r.rows[0].id === CONNECTION_B && calls(mark, 'GET', '/v1/connections')[0]?.query.schema === 'hooks.events', r.err || wire(mark));
  mark = log.length;
  r = await runSql('SELECT id FROM fivetran.connections.connections');
  check('connections list unfiltered pages through all 3', r.rows && r.rows.length === 3 && calls(mark, 'GET', '/v1/connections').length === 2, r.err || wire(mark));
  mark = log.length;
  r = await runSql(`SELECT id, service FROM fivetran.groups.connections WHERE group_id = '${GROUP_A}'`);
  check('groups.connections list (path-scoped sibling)', r.rows && r.rows.length === 2 && calls(mark, 'GET', `/v1/groups/${GROUP_A}/connections`).length === 1, r.err || wire(mark));
  mark = log.length;
  r = await runSql(`SELECT id, service, paused, sync_frequency FROM fivetran.connections.connections WHERE connection_id = '${CONNECTION_A}'`);
  check('connection get by connection_id', r.rows && r.rows[0]?.service === 'postgres' && r.rows[0]?.paused === false && calls(mark, 'GET', `/v1/connections/${CONNECTION_A}`).length === 1, r.err || JSON.stringify(r.rows));
  mark = log.length;
  r = await runSql(`INSERT INTO fivetran.connections.connections (group_id, service, paused, run_setup_tests, sync_frequency, config) SELECT '${newGroup}', 'webhooks', true, false, 1440, '{"schema": "stackql_smoke", "table": "events"}' RETURNING id, service, "schema", paused, sync_frequency`);
  const connPost = calls(mark, 'POST', '/v1/connections');
  const newConn = r.rows?.[0]?.id;
  check('connections INSERT: config travels as a JSON object, booleans and numbers typed', !r.err && connPost.length === 1 && connPost[0].body?.config?.schema === 'stackql_smoke' && connPost[0].body?.paused === true && connPost[0].body?.run_setup_tests === false && connPost[0].body?.sync_frequency === 1440, r.err || JSON.stringify(connPost.map((c) => c.body)));
  check('connections INSERT ... RETURNING row', !!newConn && r.rows[0].schema === 'stackql_smoke.events' && r.rows[0].paused === true, JSON.stringify(r.rows));
  mark = log.length;
  r = await runSql(`UPDATE fivetran.connections.connections SET paused = 'false', sync_frequency = 720 WHERE connection_id = '${newConn}'`);
  const connPatch = calls(mark, 'PATCH', `/v1/connections/${newConn}`);
  check('connections UPDATE (PATCH) wire body {paused, sync_frequency}', !r.err && connPatch.length === 1 && String(connPatch[0].body?.paused) === 'false' && String(connPatch[0].body?.sync_frequency) === '720' && Object.keys(connPatch[0].body).length === 2, r.err || JSON.stringify(connPatch.map((c) => c.body)));

  // --- EXEC lifecycle actions
  mark = log.length;
  r = await runSql(`EXEC fivetran.connections.connections.sync @connection_id = '${CONNECTION_A}'`);
  check('connections.sync EXEC -> POST /v1/connections/{id}/sync', !r.err && calls(mark, 'POST', `/v1/connections/${CONNECTION_A}/sync`).length === 1, r.err || wire(mark));
  mark = log.length;
  r = await runSql(`EXEC fivetran.connections.connections.resync @connection_id = '${CONNECTION_A}', @scope = '{"public": ["orders"]}'`);
  const resync = calls(mark, 'POST', `/v1/connections/${CONNECTION_A}/resync`);
  check('connections.resync EXEC carries scope as a JSON object', !r.err && resync.length === 1 && Array.isArray(resync[0].body?.scope?.public), r.err || JSON.stringify(resync.map((c) => c.body)));
  mark = log.length;
  r = await runSql(`EXEC fivetran.connections.connections.run_setup_tests @connection_id = '${CONNECTION_A}'`);
  check('connections.run_setup_tests EXEC -> POST /v1/connections/{id}/test', !r.err && calls(mark, 'POST', `/v1/connections/${CONNECTION_A}/test`).length === 1, r.err || wire(mark));
  mark = log.length;
  r = await runSql(`EXEC fivetran.destinations.destinations.run_setup_tests @destination_id = '${DESTINATION_A}'`);
  check('destinations.run_setup_tests EXEC', !r.err && calls(mark, 'POST', `/v1/destinations/${DESTINATION_A}/test`).length === 1, r.err || wire(mark));

  // --- connection sub-resources
  r = await runSql(`SELECT sync_id, status, "start", "end", json_extract(stages, '$.load.volume') AS load_volume FROM fivetran.connections.sync_history WHERE connection_id = '${CONNECTION_A}'`);
  check('sync_history list (3 rows over 2 pages, quoted keyword columns start / end)', r.rows && r.rows.length === 3 && r.rows.some((x) => x.load_volume === 3000) && String(r.rows[0].start).startsWith('2026-08-2'), r.err || JSON.stringify(r.rows));
  r = await runSql(`SELECT state FROM fivetran.connections.states WHERE connection_id = '${FUNCTION_CONNECTION}'`);
  check('connection state get (function connector)', r.rows && json(r.rows[0]?.state)?.cursor === '2026-08-31T00:00:00Z', r.err || JSON.stringify(r.rows));
  r = await runSql(`SELECT state FROM fivetran.connections.states WHERE connection_id = '${CONNECTION_A}'`);
  check('connection state on a non-function connector -> 400 surfaced', r.err && /400/.test(r.err) && /not a Function/.test(r.err), r.err || 'no error');
  mark = log.length;
  r = await runSql(`UPDATE fivetran.connections.states SET state = '{"cursor": "2026-09-01T00:00:00Z"}' WHERE connection_id = '${FUNCTION_CONNECTION}'`);
  const statePatch = calls(mark, 'PATCH', `/v1/connections/${FUNCTION_CONNECTION}/state`);
  check('connection state UPDATE sends the state object', !r.err && statePatch.length === 1 && statePatch[0].body?.state?.cursor === '2026-09-01T00:00:00Z', r.err || JSON.stringify(statePatch.map((c) => c.body)));
  r = await runSql(`SELECT job_id, status FROM fivetran.connections.move_jobs WHERE connection_id = '${CONNECTION_A}' AND job_id = 'job_mock001'`);
  check('move_jobs get (two path parameters)', r.rows && r.rows[0]?.status === 'COMPLETED', r.err || JSON.stringify(r.rows));

  // --- schema config: three UPDATE methods routed by signature
  r = await runSql(`SELECT schema_change_handling, enable_new_by_default, json_extract(schemas, '$.public.tables.orders.enabled') AS orders_enabled FROM fivetran.connections.schema_configs WHERE connection_id = '${CONNECTION_A}'`);
  check('schema_configs get (schemas map addressed with json_extract)', r.rows && r.rows[0]?.schema_change_handling === 'ALLOW_ALL' && [1, true].includes(r.rows[0]?.orders_enabled), r.err || JSON.stringify(r.rows));
  mark = log.length;
  r = await runSql(`UPDATE fivetran.connections.schema_configs SET schema_change_handling = 'BLOCK_ALL' WHERE connection_id = '${CONNECTION_A}'`);
  check('schema_configs UPDATE (connection level) -> PATCH /schemas', !r.err && calls(mark, 'PATCH', `/v1/connections/${CONNECTION_A}/schemas`).length === 1 && state.schemaConfigs.get(CONNECTION_A).schema_change_handling === 'BLOCK_ALL', r.err || wire(mark));
  mark = log.length;
  r = await runSql(`UPDATE fivetran.connections.schema_configs SET enabled = 'false' WHERE connection_id = '${CONNECTION_A}' AND schema_name = 'public'`);
  check('schema_configs UPDATE with schema_name -> PATCH /schemas/{schema_name}', !r.err && calls(mark, 'PATCH', `/v1/connections/${CONNECTION_A}/schemas/public`).length === 1, r.err || wire(mark));
  mark = log.length;
  r = await runSql(`UPDATE fivetran.connections.schema_configs SET enabled = 'false' WHERE connection_id = '${CONNECTION_A}' AND schema_name = 'public' AND table_name = 'orders'`);
  check('schema_configs UPDATE with table_name -> PATCH /schemas/{schema_name}/tables/{table_name}', !r.err && calls(mark, 'PATCH', `/v1/connections/${CONNECTION_A}/schemas/public/tables/orders`).length === 1, r.err || wire(mark));
  mark = log.length;
  r = await runSql(`SELECT json_extract(columns, '$.email.hashed') AS email_hashed, columns FROM fivetran.connections.columns WHERE connection_id = '${CONNECTION_A}' AND schema_name = 'public' AND table_name = 'orders'`);
  check('columns get (unified schema_name / table_name path parameters)', r.rows && r.rows.length === 1 && !!json(r.rows[0].columns)?.id && calls(mark, 'GET', `/v1/connections/${CONNECTION_A}/schemas/public/tables/orders/columns`).length === 1, r.err || JSON.stringify(r.rows));
  mark = log.length;
  r = await runSql(`UPDATE fivetran.connections.columns SET enabled = 'true', hashed = 'true' WHERE connection_id = '${CONNECTION_A}' AND schema_name = 'public' AND table_name = 'orders' AND column_name = 'email'`);
  check('columns UPDATE -> PATCH .../columns/{column_name}', !r.err && calls(mark, 'PATCH', `/v1/connections/${CONNECTION_A}/schemas/public/tables/orders/columns/email`).length === 1, r.err || wire(mark));
  mark = log.length;
  r = await runSql(`DELETE FROM fivetran.connections.columns WHERE connection_id = '${CONNECTION_A}' AND schema_name = 'public' AND table_name = 'orders' AND column_name = 'email'`);
  check('columns DELETE -> DELETE .../columns/{column_name}', !r.err && calls(mark, 'DELETE', `/v1/connections/${CONNECTION_A}/schemas/public/tables/orders/columns/email`).length === 1, r.err || wire(mark));
  mark = log.length;
  r = await runSql(`EXEC fivetran.connections.schema_configs.reload @connection_id = '${CONNECTION_A}', @exclude_mode = 'PRESERVE'`);
  check('schema_configs.reload EXEC with a body attribute', !r.err && calls(mark, 'POST', `/v1/connections/${CONNECTION_A}/schemas/reload`)[0]?.body?.exclude_mode === 'PRESERVE', r.err || wire(mark));

  // --- destinations
  mark = log.length;
  r = await runSql(`SELECT id, service, region, setup_status, json_extract(config, '$.project_id') AS project_id FROM fivetran.destinations.destinations WHERE destination_id = '${DESTINATION_A}'`);
  check('destination get (config addressed with json_extract)', r.rows && r.rows[0]?.project_id === 'mock-project' && calls(mark, 'GET', `/v1/destinations/${DESTINATION_A}`).length === 1, r.err || JSON.stringify(r.rows));

  // --- webhooks: two INSERT methods routed by signature
  mark = log.length;
  r = await runSql(`INSERT INTO fivetran.webhooks.webhooks (url, events, active) SELECT 'https://example.com/stackql-smoke', '["sync_start","sync_end"]', false RETURNING id, type, url, active`);
  const hookAcct = calls(mark, 'POST', '/v1/webhooks/account');
  const acctHook = r.rows?.[0]?.id;
  check('webhooks INSERT without group_id -> POST /v1/webhooks/account (events as a JSON array)', !r.err && hookAcct.length === 1 && Array.isArray(hookAcct[0].body?.events) && hookAcct[0].body.events.length === 2 && hookAcct[0].body.active === false && r.rows?.[0]?.type === 'account', r.err || `${JSON.stringify(hookAcct.map((c) => c.body))} ${wire(mark)}`);
  mark = log.length;
  r = await runSql(`INSERT INTO fivetran.webhooks.webhooks (group_id, url, events, active) SELECT '${GROUP_A}', 'https://example.com/stackql-smoke-group', '["sync_end"]', false RETURNING id, type, group_id`);
  const hookGroup = calls(mark, 'POST', `/v1/webhooks/group/${GROUP_A}`);
  const groupHook = r.rows?.[0]?.id;
  check('webhooks INSERT with group_id -> POST /v1/webhooks/group/{group_id} (group_id not in the body)', !r.err && hookGroup.length === 1 && !('group_id' in (hookGroup[0].body || {})) && r.rows?.[0]?.group_id === GROUP_A, r.err || `${JSON.stringify(hookGroup.map((c) => c.body))} ${wire(mark)}`);
  r = await runSql('SELECT id, type, url, active FROM fivetran.webhooks.webhooks');
  check('webhooks list (seed + 2 created)', r.rows && r.rows.length === 3 && r.rows.some((x) => x.id === WEBHOOK_A), r.err || JSON.stringify(r.rows));
  mark = log.length;
  r = await runSql(`EXEC fivetran.webhooks.webhooks.test @webhook_id = '${WEBHOOK_A}', @event = 'sync_end'`);
  check('webhooks.test EXEC (required body attribute)', !r.err && calls(mark, 'POST', `/v1/webhooks/${WEBHOOK_A}/test`)[0]?.body?.event === 'sync_end', r.err || wire(mark));
  for (const id of [acctHook, groupHook]) {
    r = await runSql(`DELETE FROM fivetran.webhooks.webhooks WHERE webhook_id = '${id}'`);
    check(`webhooks DELETE ${id}`, !r.err && !state.webhooks.has(id), r.err);
  }

  // --- teams and memberships
  r = await runSql(`SELECT id, name, role FROM fivetran.teams.teams WHERE team_id = '${TEAM_A}'`);
  check('team get', r.rows && r.rows[0]?.name === 'Data Platform', r.err || JSON.stringify(r.rows));
  mark = log.length;
  r = await runSql(`INSERT INTO fivetran.teams.group_memberships (team_id, id, role) SELECT '${TEAM_A}', '${GROUP_B}', 'Destination Analyst' RETURNING id, role`);
  const tgPost = calls(mark, 'POST', `/v1/teams/${TEAM_A}/groups`);
  check('team group membership INSERT (body {id, role}, team_id in the path)', !r.err && tgPost.length === 1 && tgPost[0].body?.id === GROUP_B && !('team_id' in tgPost[0].body) && r.rows?.[0]?.role === 'Destination Analyst', r.err || JSON.stringify(tgPost.map((c) => c.body)));
  r = await runSql(`SELECT id, role FROM fivetran.teams.group_memberships WHERE team_id = '${TEAM_A}'`);
  check('team group memberships list (2 rows)', r.rows && r.rows.length === 2, r.err || JSON.stringify(r.rows));
  mark = log.length;
  r = await runSql(`SELECT id, role FROM fivetran.teams.group_memberships WHERE team_id = '${TEAM_A}' AND group_id = '${GROUP_B}'`);
  check('team group membership get (two path parameters)', r.rows && r.rows.length === 1 && calls(mark, 'GET', `/v1/teams/${TEAM_A}/groups/${GROUP_B}`).length === 1, r.err || wire(mark));
  mark = log.length;
  r = await runSql(`UPDATE fivetran.teams.group_memberships SET role = 'Destination Reviewer' WHERE team_id = '${TEAM_A}' AND group_id = '${GROUP_B}' RETURNING id, role`);
  check('team group membership UPDATE ... RETURNING', !r.err && calls(mark, 'PATCH', `/v1/teams/${TEAM_A}/groups/${GROUP_B}`)[0]?.body?.role === 'Destination Reviewer' && r.rows?.[0]?.role === 'Destination Reviewer', r.err || wire(mark));
  r = await runSql(`DELETE FROM fivetran.teams.group_memberships WHERE team_id = '${TEAM_A}' AND group_id = '${GROUP_B}'`);
  check('team group membership DELETE', !r.err && !state.teamGroups.get(TEAM_A).has(GROUP_B), r.err);
  r = await runSql(`SELECT user_id, role FROM fivetran.teams.user_memberships WHERE team_id = '${TEAM_A}'`);
  check('team user memberships list', r.rows && r.rows[0]?.user_id === USER_B, r.err || JSON.stringify(r.rows));
  mark = log.length;
  r = await runSql(`EXEC fivetran.teams.teams.remove_account_role @team_id = '${TEAM_A}'`);
  check('teams.remove_account_role EXEC -> DELETE /v1/teams/{team_id}/role', !r.err && calls(mark, 'DELETE', `/v1/teams/${TEAM_A}/role`).length === 1, r.err || wire(mark));

  // --- users
  r = await runSql('SELECT id, email, role, active FROM fivetran.users.users');
  check('users list', r.rows && r.rows.length === 2, r.err || JSON.stringify(r.rows));
  r = await runSql(`SELECT id, role FROM fivetran.users.group_memberships WHERE user_id = '${USER_A}'`);
  check('user group memberships list', r.rows && r.rows[0]?.id === GROUP_A, r.err || JSON.stringify(r.rows));
  mark = log.length;
  r = await runSql(`EXEC fivetran.users.users.remove_account_role @user_id = '${USER_B}'`);
  check('users.remove_account_role EXEC -> DELETE /v1/users/{user_id}/role', !r.err && calls(mark, 'DELETE', `/v1/users/${USER_B}/role`).length === 1, r.err || wire(mark));
  mark = log.length;
  r = await runSql(`DELETE FROM fivetran.users.users WHERE user_id = '${USER_B}'`);
  check('users DELETE addresses user_id (the vendor names this one parameter id)', !r.err && calls(mark, 'DELETE', `/v1/users/${USER_B}`).length === 1 && !state.users.has(USER_B), r.err || wire(mark));

  // --- system keys: INSERT with an array attribute, EXEC rotate
  mark = log.length;
  r = await runSql(`INSERT INTO fivetran.account.system_keys (name, expiration_period, permissions) SELECT 'stackql_smoke_it', 'ONE_WEEK', '[{"resource_type": "DESTINATION", "access_level": "READ"}]' RETURNING id, name, expired_at`);
  const keyPost = calls(mark, 'POST', '/v1/system-keys');
  const newKey = r.rows?.[0]?.id;
  check('system_keys INSERT (permissions as a JSON array, expiration_period enum)', !r.err && Array.isArray(keyPost[0]?.body?.permissions) && keyPost[0]?.body?.permissions[0]?.access_level === 'READ' && keyPost[0]?.body?.expiration_period === 'ONE_WEEK' && !!newKey, r.err || JSON.stringify(keyPost.map((c) => c.body)));
  mark = log.length;
  r = await runSql(`EXEC fivetran.account.system_keys.rotate @key_id = '${newKey}', @expiration_period = 'ONE_MONTH'`);
  check('system_keys.rotate EXEC (body attribute)', !r.err && calls(mark, 'POST', `/v1/system-keys/${newKey}/rotate`)[0]?.body?.expiration_period === 'ONE_MONTH', r.err || JSON.stringify(log.slice(mark).map((c) => c.body)));
  r = await runSql(`DELETE FROM fivetran.account.system_keys WHERE key_id = '${newKey}'`);
  check('system_keys DELETE', !r.err && !state.systemKeys.has(newKey), r.err);

  // --- metadata: pagination, single read, the public path
  mark = log.length;
  r = await runSql('SELECT id, name, type FROM fivetran.metadata.connector_types');
  check('connector_types list (5 rows over 3 pages)', r.rows && r.rows.length === 5 && calls(mark, 'GET', '/v1/metadata/connector-types').length === 3, r.err || wire(mark));
  r = await runSql(`SELECT id, name, config FROM fivetran.metadata.connector_types WHERE service = 'postgres'`);
  check('connector_types get by service', r.rows && r.rows.length === 1 && r.rows[0].id === 'postgres', r.err || JSON.stringify(r.rows));
  mark = log.length;
  r = await runSql('SELECT id, name FROM fivetran.metadata.public_connector_types', { FIVETRAN_APIKEY: 'unused', FIVETRAN_APISECRET: 'unused' });
  check('public_connector_types list (non-/v1 path, bare array under data)', r.rows && r.rows.length === 5 && calls(mark, 'GET', '/public/connector-types').length === 1, r.err || wire(mark));

  // --- nativeCasing: group_id -> groupId on the one camelCase query parameter
  mark = log.length;
  r = await runSql(`SELECT id, display_name, group_id FROM fivetran.hybrid_deployment.agents WHERE group_id = '${GROUP_A}'`);
  const agentCalls = calls(mark, 'GET', '/v1/hybrid-deployment-agents');
  check('hybrid deployment agents: WHERE group_id travels as groupId (request.nativeCasing)', r.rows && r.rows.length === 1 && r.rows[0].id === AGENT_A && agentCalls[0]?.query.groupId === GROUP_A, r.err || wire(mark));
  mark = log.length;
  r = await runSql(`EXEC fivetran.hybrid_deployment.agents.re_auth @agent_id = '${AGENT_A}', @auth_type = 'KEY_PAIR'`);
  check('agents.re_auth EXEC (PATCH-backed action)', !r.err && calls(mark, 'PATCH', `/v1/hybrid-deployment-agents/${AGENT_A}/re-auth`).length === 1, r.err || wire(mark));

  // --- networking
  r = await runSql(`SELECT id, display_name, region FROM fivetran.networking.proxy_agents WHERE agent_id = '${PROXY_A}'`);
  check('proxy_agents get (enveloped on the wire, bare in the vendor spec)', r.rows && r.rows[0]?.display_name === 'proxy-east', r.err || JSON.stringify(r.rows));
  r = await runSql(`SELECT connection_id FROM fivetran.networking.proxy_agent_connections WHERE agent_id = '${PROXY_A}'`);
  check('proxy_agent_connections list', r.rows && r.rows[0]?.connection_id === CONNECTION_A, r.err || JSON.stringify(r.rows));

  // --- external secrets managers: two entity reads
  mark = log.length;
  r = await runSql(`SELECT id, type FROM fivetran.external_secrets_managers.entities WHERE type = 'CONNECTION'`);
  check('entities list (type pushed down, account-wide path)', r.rows && r.rows.length === 1 && calls(mark, 'GET', '/v1/external-secrets-managers-entities')[0]?.query.type === 'CONNECTION', r.err || wire(mark));
  mark = log.length;
  r = await runSql(`SELECT id, type FROM fivetran.external_secrets_managers.entities WHERE esm_id = '${ESM_A}'`);
  check('entities list_by_esm (esm_id routes to the path-scoped read)', r.rows && r.rows.length === 2 && calls(mark, 'GET', `/v1/external-secrets-managers/${ESM_A}/entities`).length === 1, r.err || wire(mark));

  // --- cleanup of what this run created, and the negative path
  r = await runSql(`DELETE FROM fivetran.connections.connections WHERE connection_id = '${newConn}'`);
  check('connections DELETE', !r.err && !state.connections.has(newConn), r.err);
  r = await runSql(`DELETE FROM fivetran.groups.groups WHERE group_id = '${newGroup}'`);
  check('groups DELETE', !r.err && !state.groups.has(newGroup), r.err);
  r = await runSql(`SELECT name FROM fivetran.groups.groups WHERE group_id = 'does_not_exist'`);
  check('404 error body surfaced (NotFound_Group)', r.err && /404/.test(r.err) && /NotFound_Group/.test(r.err), r.err || 'no error');
} finally {
  server.close();
}

const failed = results.filter((x) => !x.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
if (failed.length) {
  console.log('failed:');
  for (const f of failed) console.log(`  - ${f.name}${f.note ? `: ${String(f.note).slice(0, 400)}` : ''}`);
  process.exit(1);
}
