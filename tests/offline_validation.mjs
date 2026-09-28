#!/usr/bin/env node

// Quick offline validation of the generated provider against the local file
// registry - no network, no server. Runs SHOW SERVICES / SHOW RESOURCES /
// SHOW METHODS and DESCRIBE EXTENDED over representative resources and
// asserts expected counts and mappings: the service and resource inventory,
// the verb mapping, snake_case path parameters, naive request body
// translation, and the provider document itself (basic auth variables,
// service-level cursor pagination, object keys). Exit 1 on any failure.
//
// Usage: node tests/offline_validation.mjs
// Binary resolution: $STACKQL, ./stackql(.exe), then PATH.

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const regPath = path.join(repoRoot, 'provider-dev', 'openapi').replace(/\\/g, '/');
const providerDir = path.join(repoRoot, 'provider-dev', 'openapi', 'src', 'fivetran', 'v00.00.00000');
const registry = JSON.stringify({ url: `file://${regPath}`, localDocRoot: regPath, verifyConfig: { nopVerify: true } });

function findBinary() {
  if (process.env.STACKQL && fs.existsSync(process.env.STACKQL)) return process.env.STACKQL;
  for (const name of ['stackql', 'stackql.exe']) {
    const local = path.join(repoRoot, name);
    if (fs.existsSync(local)) return local;
  }
  return 'stackql'; // PATH
}
const bin = findBinary();

function runSql(sql) {
  return new Promise((resolve) => {
    const child = spawn(bin, [`--registry=${registry}`, 'exec', sql, '--output', 'json'], { cwd: repoRoot, env: process.env });
    let stdout = '', stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('close', (code) => {
      let rows = [];
      try { rows = JSON.parse(stdout) ?? []; } catch { rows = []; }
      resolve({ code, rows, stdout, stderr });
    });
    child.on('error', (err) => resolve({ code: -1, rows: [], stdout: '', stderr: String(err) }));
  });
}

const results = [];
function check(name, cond, note = '') {
  results.push({ name, pass: !!cond, note });
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : `  [${String(note).slice(0, 240)}]`}`);
}

const EXPECTED_RESOURCES = {
  account: ['account_info', 'roles', 'system_keys'],
  certificates: ['certificates', 'connection_certificates', 'connection_fingerprints', 'destination_certificates', 'destination_fingerprints'],
  connections: ['columns', 'connections', 'move_jobs', 'schema_configs', 'states', 'sync_history', 'warnings'],
  connector_sdk: ['packages'],
  destinations: ['destinations'],
  external_logging: ['account_log_services', 'log_services'],
  external_secrets_managers: ['entities', 'secrets_managers'],
  groups: ['connections', 'groups', 'service_accounts', 'ssh_public_keys', 'users'],
  hybrid_deployment: ['agents', 'hvr_hubs'],
  metadata: ['connector_types', 'public_connector_types'],
  networking: ['private_links', 'proxy_agent_connections', 'proxy_agents'],
  teams: ['connection_memberships', 'group_memberships', 'teams', 'user_memberships'],
  transformations: ['package_metadata', 'transformation_projects', 'transformations'],
  users: ['api_keys', 'connection_memberships', 'group_memberships', 'users'],
  webhooks: ['webhooks']
};
const EXPECTED_SERVICES = Object.keys(EXPECTED_RESOURCES);
const EXPECTED_RESOURCE_TOTAL = Object.values(EXPECTED_RESOURCES).reduce((n, r) => n + r.length, 0);

console.log(`stackql: ${bin}`);

// ---- the provider document
const providerDoc = yaml.load(fs.readFileSync(path.join(providerDir, 'provider.yaml'), 'utf8'));
const auth = providerDoc.config?.auth || {};
check('provider.yaml: basic auth from FIVETRAN_APIKEY / FIVETRAN_APISECRET (the Terraform variable names)', auth.type === 'basic' && auth.username_var === 'FIVETRAN_APIKEY' && auth.password_var === 'FIVETRAN_APISECRET' && auth.valuePrefix === 'Basic ', JSON.stringify(auth));
check('provider.yaml: snake_case_aliases is on', providerDoc.config?.snake_case_aliases === true, JSON.stringify(providerDoc.config));
check(`provider.yaml: ${EXPECTED_SERVICES.length} services`, Object.keys(providerDoc.providerServices || {}).sort().join() === [...EXPECTED_SERVICES].sort().join(), Object.keys(providerDoc.providerServices || {}).join());

let methodTotal = 0, selectTotal = 0, naiveTotal = 0, bodyMethods = 0;
const problems = [];
for (const svc of EXPECTED_SERVICES) {
  const doc = yaml.load(fs.readFileSync(path.join(providerDir, 'services', `${svc}.yaml`), 'utf8'));
  const pg = doc['x-stackQL-config']?.pagination;
  if (pg?.requestToken?.key !== 'cursor' || pg?.requestToken?.location !== 'query' || pg?.responseToken?.key !== '$.data.next_cursor' || pg?.responseToken?.location !== 'body') problems.push(`${svc}: pagination config ${JSON.stringify(pg)}`);
  if (doc.servers?.[0]?.url !== 'https://api.fivetran.com') problems.push(`${svc}: server ${JSON.stringify(doc.servers)}`);
  for (const p of Object.keys(doc.paths || {})) {
    for (const name of (p.match(/\{[^}]+\}/g) || [])) if (/[A-Z]/.test(name)) problems.push(`${svc}: camelCase path parameter ${name} in ${p}`);
  }
  for (const [rName, resource] of Object.entries(doc.components?.['x-stackQL-resources'] || {})) {
    const selects = new Set((resource.sqlVerbs?.select || []).map((x) => x.$ref.split('/').pop()));
    for (const [mName, method] of Object.entries(resource.methods || {})) {
      methodTotal++;
      const m = /^#\/paths\/(.+)\/([a-z]+)$/.exec(method.operation.$ref);
      const op = doc.paths[m[1].replace(/~1/g, '/')]?.[m[2]];
      if (!op) { problems.push(`${svc}.${rName}.${mName}: operation ref does not resolve`); continue; }
      if ((op.parameters || []).some((p) => p.in === 'header')) problems.push(`${svc}.${rName}.${mName}: header parameter on the surface`);
      if (selects.has(mName)) {
        selectTotal++;
        if (!['$.data', '$.data.items'].includes(method.response?.objectKey)) problems.push(`${svc}.${rName}.${mName}: select object key ${method.response?.objectKey}`);
      }
      if (op.requestBody) {
        bodyMethods++;
        if (method.config?.requestBodyTranslate?.algorithm === 'naive') naiveTotal++;
        else problems.push(`${svc}.${rName}.${mName}: request body without naive translation`);
      }
    }
  }
}
check('service documents: fixed server, service-level cursor pagination, snake_case path parameters, no header parameters, object keys on every select', problems.length === 0, problems.slice(0, 4).join('; '));
check(`naive request body translation on every method with a body (${bodyMethods})`, bodyMethods > 0 && naiveTotal === bodyMethods, `${naiveTotal}/${bodyMethods}`);
check('176 methods, 71 of them selects', methodTotal === 176 && selectTotal === 71, `${methodTotal} methods, ${selectTotal} selects`);

// ---- the registry as stackql sees it
let r = await runSql('SHOW SERVICES IN fivetran');
check(`SHOW SERVICES (${EXPECTED_SERVICES.length})`, r.rows.length === EXPECTED_SERVICES.length && EXPECTED_SERVICES.every((s) => r.rows.some((x) => x.name === s)), r.stderr || JSON.stringify(r.rows.map((x) => x.name)));

let resourceTotal = 0;
for (const [svc, expected] of Object.entries(EXPECTED_RESOURCES)) {
  r = await runSql(`SHOW RESOURCES IN fivetran.${svc}`);
  const names = r.rows.map((x) => x.name).sort();
  resourceTotal += names.length;
  check(`SHOW RESOURCES IN fivetran.${svc} (${expected.length})`, JSON.stringify(names) === JSON.stringify(expected), r.stderr || JSON.stringify(names));
}
check(`${EXPECTED_RESOURCE_TOTAL} resources in total`, resourceTotal === EXPECTED_RESOURCE_TOTAL, String(resourceTotal));

const methodsOf = async (fqrn) => {
  const res = await runSql(`SHOW METHODS IN ${fqrn}`);
  return { byName: Object.fromEntries(res.rows.map((m) => [m.MethodName, m])), raw: res };
};
const req = (m) => String(m?.RequiredParams || '').split(',').map((s) => s.trim()).filter(Boolean).sort().join(',');

// connections: verbs and lifecycle actions on the resource
let { byName, raw } = await methodsOf('fivetran.connections.connections');
check('connections.connections methods (10)', raw.rows.length === 10, JSON.stringify(Object.keys(byName)));
check('connections verbs (list/get SELECT, create INSERT, update UPDATE, delete DELETE; sync/resync/move/run_setup_tests/create_connect_card EXEC)',
  byName.list?.SQLVerb === 'SELECT' && byName.get?.SQLVerb === 'SELECT' && byName.create?.SQLVerb === 'INSERT' && byName.update?.SQLVerb === 'UPDATE' && byName.delete?.SQLVerb === 'DELETE' &&
  ['sync', 'resync', 'move', 'run_setup_tests', 'create_connect_card'].every((m) => byName[m]?.SQLVerb === 'EXEC'), JSON.stringify(raw.rows));
check('connections.list has no required params; get requires connection_id', req(byName.list) === '' && req(byName.get) === 'connection_id', JSON.stringify([byName.list, byName.get]));
check('connections.create requires group_id, service (naive body translate)', req(byName.create) === 'group_id,service', JSON.stringify(byName.create));
check('connections.move requires connection_id, destination_group_id', req(byName.move) === 'connection_id,destination_group_id', JSON.stringify(byName.move));

({ byName, raw } = await methodsOf('fivetran.connections.schema_configs'));
check('schema_configs: three UPDATE methods with distinct signatures',
  byName.update?.SQLVerb === 'UPDATE' && req(byName.update) === 'connection_id' &&
  byName.update_schema?.SQLVerb === 'UPDATE' && req(byName.update_schema) === 'connection_id,enabled,schema_name' &&
  byName.update_table?.SQLVerb === 'UPDATE' && req(byName.update_table) === 'connection_id,enabled,schema_name,table_name', JSON.stringify(raw.rows));
check('schema_configs: reload / drop_columns / resync_tables EXEC', ['reload', 'drop_columns', 'resync_tables'].every((m) => byName[m]?.SQLVerb === 'EXEC'), JSON.stringify(raw.rows));

({ byName, raw } = await methodsOf('fivetran.connections.columns'));
check('columns: get by connection_id, schema_name, table_name (unified names); update / delete add column_name',
  req(byName.get) === 'connection_id,schema_name,table_name' && /column_name/.test(byName.update?.RequiredParams) && /schema_name/.test(byName.update?.RequiredParams) && byName.delete?.SQLVerb === 'DELETE', JSON.stringify(raw.rows));

({ byName, raw } = await methodsOf('fivetran.users.users'));
check('users: get / update / delete all key on user_id (DELETE is {id} upstream); remove_account_role EXEC',
  req(byName.get) === 'user_id' && req(byName.update) === 'user_id' && req(byName.delete) === 'user_id' && byName.remove_account_role?.SQLVerb === 'EXEC', JSON.stringify(raw.rows));
check('users.create requires email, family_name, given_name', req(byName.create) === 'email,family_name,given_name', JSON.stringify(byName.create));

({ byName, raw } = await methodsOf('fivetran.webhooks.webhooks'));
check('webhooks: create_account_webhook (events, url) and create_group_webhook (+ group_id) are both INSERT; test EXEC',
  byName.create_account_webhook?.SQLVerb === 'INSERT' && req(byName.create_account_webhook) === 'events,url' &&
  byName.create_group_webhook?.SQLVerb === 'INSERT' && req(byName.create_group_webhook) === 'events,group_id,url' && byName.test?.SQLVerb === 'EXEC', JSON.stringify(raw.rows));

({ byName, raw } = await methodsOf('fivetran.teams.group_memberships'));
check('teams.group_memberships: list (team_id), get (group_id, team_id), create (id, role, team_id), update, delete',
  req(byName.list) === 'team_id' && req(byName.get) === 'group_id,team_id' && req(byName.create) === 'id,role,team_id' && byName.update?.SQLVerb === 'UPDATE' && byName.delete?.SQLVerb === 'DELETE', JSON.stringify(raw.rows));

({ byName, raw } = await methodsOf('fivetran.external_secrets_managers.entities'));
check('entities: list (no required params) and list_by_esm (esm_id) are both SELECT', byName.list?.SQLVerb === 'SELECT' && req(byName.list) === '' && byName.list_by_esm?.SQLVerb === 'SELECT' && req(byName.list_by_esm) === 'esm_id', JSON.stringify(raw.rows));

({ byName, raw } = await methodsOf('fivetran.connector_sdk.packages'));
check('connector_sdk.packages: list / get / delete only (multipart upload and binary download are skip-coded)', Object.keys(byName).sort().join() === 'delete,get,list', JSON.stringify(Object.keys(byName)));

({ byName, raw } = await methodsOf('fivetran.account.system_keys'));
check('system_keys: CRUD plus rotate EXEC', ['list', 'get', 'create', 'update', 'delete'].every((m) => byName[m]) && byName.rotate?.SQLVerb === 'EXEC' && req(byName.rotate) === 'key_id', JSON.stringify(raw.rows));

({ byName, raw } = await methodsOf('fivetran.hybrid_deployment.hvr_hubs'));
check('hvr_hubs.register requires fingerprint and hub_server_url (the required name corrected from hubServerUrl)', byName.register?.SQLVerb === 'EXEC' && req(byName.register) === 'fingerprint,hub_server_url', JSON.stringify(raw.rows));

// ---- DESCRIBE EXTENDED on representative resources
const describe = async (fqrn) => (await runSql(`DESCRIBE EXTENDED ${fqrn}`)).rows.map((c) => c.name);
let cols = await describe('fivetran.connections.connections');
check('DESCRIBE connections projects the entity under $.data (id, group_id, service, schema, paused, sync_frequency, status, config)', ['id', 'group_id', 'service', 'schema', 'paused', 'sync_frequency', 'status', 'config'].every((c) => cols.includes(c)) && !cols.includes('code') && !cols.includes('items'), JSON.stringify(cols));
cols = await describe('fivetran.groups.groups');
check('DESCRIBE groups (id, name, created_at)', ['id', 'name', 'created_at'].every((c) => cols.includes(c)) && !cols.includes('data'), JSON.stringify(cols));
cols = await describe('fivetran.destinations.destinations');
check('DESCRIBE destinations (id, group_id, service, region, setup_status, config)', ['id', 'group_id', 'service', 'region', 'setup_status', 'config'].every((c) => cols.includes(c)), JSON.stringify(cols));
cols = await describe('fivetran.metadata.public_connector_types');
check('DESCRIBE public_connector_types (data declared as an array of connector objects)', ['id', 'name', 'type', 'connector_class'].every((c) => cols.includes(c)), JSON.stringify(cols));
cols = await describe('fivetran.networking.proxy_agents');
check('DESCRIBE proxy_agents (the bare-object read re-enveloped)', ['id', 'display_name', 'region', 'registered_at'].every((c) => cols.includes(c)) && !cols.includes('data'), JSON.stringify(cols));
cols = await describe('fivetran.transformations.transformations');
check('DESCRIBE transformations carries transformation_config (collapsed discriminator family)', ['id', 'status', 'schedule', 'transformation_config'].every((c) => cols.includes(c)), JSON.stringify(cols));
cols = await describe('fivetran.connections.sync_history');
check('DESCRIBE sync_history (sync_id, status, start, end, stages)', ['sync_id', 'status', 'start', 'end', 'stages'].every((c) => cols.includes(c)), JSON.stringify(cols));
cols = await describe('fivetran.users.users');
check('DESCRIBE users (id, email, given_name, family_name, role, active)', ['id', 'email', 'given_name', 'family_name', 'role', 'active'].every((c) => cols.includes(c)), JSON.stringify(cols));
r = await runSql('DESCRIBE EXTENDED fivetran.hybrid_deployment.hvr_hubs');
check('DESCRIBE hvr_hubs is not selectable (EXEC register is the surface)', /not supported|no such|cannot/i.test(r.stdout + r.stderr) || r.rows.length === 0, r.stdout.slice(0, 200));

const failed = results.filter((x) => !x.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length) process.exit(1);
