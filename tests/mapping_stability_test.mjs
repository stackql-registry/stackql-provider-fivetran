#!/usr/bin/env node

// Tests provider-dev/scripts/check_mapping_stability.mjs itself: the check
// guards every future release, so it is proven against fixtures derived from
// the current all_services.csv rather than trusted.
//
// Each case rewrites a copy of the CSV to simulate a regeneration and runs
// the check with the unmodified CSV as the baseline:
//   - identical                          -> passes
//   - an operation added                 -> passes, reported as an addition
//   - a method moved to another resource -> fails
//   - a method renamed                   -> fails
//   - a verb changed                     -> fails
//   - a select's object key changed      -> fails
//   - a mapped operation now skipped     -> fails
//   - a mapped operation removed         -> fails
//   - any of the above with ALLOW_BREAKING_MAPPING_CHANGES=1 -> passes,
//     still listing the change
//
// Usage: node tests/mapping_stability_test.mjs

import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseCsv, toCsv } from '../provider-dev/scripts/lib/spec_helpers.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const script = path.join(repoRoot, 'provider-dev', 'scripts', 'check_mapping_stability.mjs');
const csvPath = path.join(repoRoot, 'provider-dev', 'config', 'all_services.csv');

const baselineRows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
const header = baselineRows[0];
const col = Object.fromEntries(header.map((h, i) => [h, i]));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'stackql-mapping-test-'));
const baselineFile = path.join(tmp, 'baseline.csv');
fs.writeFileSync(baselineFile, toCsv(baselineRows));

const results = [];
function check(name, cond, note = '') {
  results.push({ name, pass: !!cond });
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : `  [${String(note).slice(0, 300)}]`}`);
}

function run(name, mutate, env = {}) {
  const rows = baselineRows.map((r) => [...r]);
  const mutated = mutate(rows) || rows;
  const currentFile = path.join(tmp, `${name.replace(/\W+/g, '_')}.csv`);
  fs.writeFileSync(currentFile, toCsv(mutated));
  const childEnv = { ...process.env, ...env };
  if (!('ALLOW_BREAKING_MAPPING_CHANGES' in env)) delete childEnv.ALLOW_BREAKING_MAPPING_CHANGES;
  const p = spawnSync(process.execPath, [script, '--baseline-file', baselineFile, '--current-file', currentFile], { encoding: 'utf8', env: childEnv });
  return { code: p.status, out: `${p.stdout}\n${p.stderr}` };
}

const rowOf = (rows, operationId) => {
  const row = rows.find((r) => r[col.operationId] === operationId);
  if (!row) throw new Error(`fixture operation ${operationId} not in all_services.csv`);
  return row;
};

try {
  let r = run('identical', () => {});
  check('identical mapping passes', r.code === 0 && /no breaking mapping changes/.test(r.out), r.out);

  r = run('added', (rows) => {
    const clone = [...rowOf(rows, 'list_all_groups')];
    clone[col.operationId] = 'list_group_audit_events';
    clone[col.path] = '/v1/groups/{group_id}/audit-events';
    clone[col.stackql_resource_name] = 'audit_events';
    rows.push(clone);
  });
  check('an added operation passes and is reported as an addition', r.code === 0 && /new operation: list_group_audit_events -> groups\.audit_events\.list/.test(r.out) && /new resource: groups\.audit_events/.test(r.out), r.out);

  r = run('moved', (rows) => { rowOf(rows, 'sync_connection')[col.stackql_resource_name] = 'syncs'; });
  check('a method moved to another resource fails', r.code === 1 && /moved: sync_connection connections\.connections -> connections\.syncs/.test(r.out), r.out);

  r = run('moved service', (rows) => { rowOf(rows, 'list_all_roles')[col.filename] = 'users.yaml'; });
  check('a method moved to another service fails (and the emptied resource is reported)', r.code === 1 && /moved: list_all_roles account\.roles -> users\.roles/.test(r.out) && /resource removed: account\.roles/.test(r.out), r.out);

  r = run('renamed', (rows) => { rowOf(rows, 'run_setup_tests')[col.stackql_method_name] = 'test'; });
  check('a renamed method fails', r.code === 1 && /method renamed: run_setup_tests connections\.connections\.run_setup_tests \[exec\] -> test/.test(r.out), r.out);

  r = run('verb', (rows) => { rowOf(rows, 'delete_user_membership_in_account')[col.stackql_verb] = 'delete'; });
  check('a changed verb fails', r.code === 1 && /verb changed: delete_user_membership_in_account \(users\.users\.remove_account_role\) exec -> delete/.test(r.out), r.out);

  r = run('object key', (rows) => { rowOf(rows, 'list_connections')[col.stackql_object_key] = '$.data'; });
  check('a changed select object key fails', r.code === 1 && /object key changed: list_connections .* \$\.data\.items -> \$\.data/.test(r.out), r.out);

  r = run('skipped', (rows) => {
    const row = rowOf(rows, 'create_group');
    row[col.stackql_resource_name] = 'skip_this_resource';
    row[col.stackql_method_name] = '';
    row[col.stackql_verb] = '';
  });
  check('a mapped operation that becomes skipped fails', r.code === 1 && /unmapped: create_group \(groups\.groups\.create \[insert\]\) is now skipped/.test(r.out), r.out);

  r = run('removed', (rows) => rows.filter((x) => x[col.operationId] !== 'delete_webhook'));
  check('a removed operation fails', r.code === 1 && /removed: delete_webhook \(webhooks\.webhooks\.delete \[delete\]\)/.test(r.out), r.out);

  r = run('path only', (rows) => { rowOf(rows, 'group_details')[col.path] = '/v2/groups/{group_id}'; });
  check('a path change alone passes (operations are keyed on the operationId)', r.code === 0, r.out);

  r = run('accepted', (rows) => { rowOf(rows, 'sync_connection')[col.stackql_resource_name] = 'syncs'; }, { ALLOW_BREAKING_MAPPING_CHANGES: '1' });
  check('ALLOW_BREAKING_MAPPING_CHANGES=1 accepts a breaking change and still lists it', r.code === 0 && /moved: sync_connection/.test(r.out) && /ACCEPTED/.test(r.out), r.out);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

const failed = results.filter((x) => !x.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length) process.exit(1);
