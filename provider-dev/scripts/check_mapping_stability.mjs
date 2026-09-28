#!/usr/bin/env node

// Mapping stability check. provider-dev/config/all_services.csv is the
// durable, checked-in record of every operation -> service.resource.method
// mapping. This script compares the freshly generated CSV in the working
// tree with the committed one (git HEAD) and fails when a published mapping
// would change under a user's feet:
//
//   - an operation that was mapped is gone, or is now skipped
//   - an operation moved to a different service or resource
//   - an operation's method name or StackQL verb changed
//   - a select method's object key changed (the row source moved)
//
// Operations are keyed on the vendor's operationId, so a path rename
// upstream is not a breaking change by itself. New operations and newly
// mapped operations are additions: reported, never fatal.
//
// A deliberate breaking change is accepted by re-running with
// ALLOW_BREAKING_MAPPING_CHANGES=1 (or --accept); the changes are still
// listed so the commit message and NOTES.md can carry them.
//
// With no committed baseline (the first build, or outside a git checkout)
// the check reports that and passes.
//
// Usage: npm run check-mappings [-- --accept] [-- --baseline <git-ref>]
//                               [-- --baseline-file <csv>] [-- --current-file <csv>]
//   --baseline       the git ref holding the published mapping (default HEAD)
//   --baseline-file  compare with a CSV on disk instead of a git ref (a
//                    released copy, or a fixture)
//   --current-file   the CSV to check (default the working-tree file)

import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseCsv } from './lib/spec_helpers.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const relPath = 'provider-dev/config/all_services.csv';
const args = process.argv.slice(2);
const argValue = (flag) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : null);
const csvPath = argValue('--current-file') ? path.resolve(argValue('--current-file')) : path.join(repoRoot, relPath);
const accept = args.includes('--accept') || process.env.ALLOW_BREAKING_MAPPING_CHANGES === '1';
const baselineFile = argValue('--baseline-file');
const baselineRef = baselineFile ? baselineFile : argValue('--baseline') || 'HEAD';

function index(text) {
  const rows = parseCsv(text);
  const col = Object.fromEntries(rows[0].map((h, i) => [h, i]));
  const out = new Map();
  for (const row of rows.slice(1)) {
    const resource = row[col.stackql_resource_name];
    out.set(row[col.operationId], {
      operationId: row[col.operationId],
      service: row[col.filename].replace(/\.(yaml|yml|json)$/, ''),
      path: row[col.path],
      verb: row[col.verb],
      resource,
      method: row[col.stackql_method_name],
      sqlVerb: row[col.stackql_verb],
      objectKey: row[col.stackql_object_key],
      mapped: !!resource && resource !== 'skip_this_resource'
    });
  }
  return out;
}

if (!fs.existsSync(csvPath)) {
  console.error(`Error: ${csvPath} not found - run the mappings step first`);
  process.exit(1);
}
if (baselineFile && !fs.existsSync(baselineFile)) {
  console.error(`Error: baseline file ${baselineFile} not found`);
  process.exit(1);
}
const current = index(fs.readFileSync(csvPath, 'utf8'));

let baselineText = null;
if (baselineFile) {
  baselineText = fs.readFileSync(baselineFile, 'utf8');
} else {
  try {
    baselineText = execFileSync('git', ['show', `${baselineRef}:${relPath}`], { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
  } catch {
    baselineText = null;
  }
}
if (baselineText === null) {
  console.log(`Mapping stability: no committed baseline at ${baselineRef}:${relPath} - nothing to compare (${[...current.values()].filter((r) => r.mapped).length} mapped operations will become the baseline once committed)`);
  process.exit(0);
}
const baseline = index(baselineText);

const fqmn = (r) => `${r.service}.${r.resource}.${r.method} [${r.sqlVerb}]`;
const breaking = [];
const additions = [];
for (const [opId, was] of baseline) {
  if (!was.mapped) continue;
  const now = current.get(opId);
  if (!now) { breaking.push(`removed: ${opId} (${fqmn(was)}) is no longer in the spec`); continue; }
  if (!now.mapped) { breaking.push(`unmapped: ${opId} (${fqmn(was)}) is now skipped`); continue; }
  if (now.service !== was.service || now.resource !== was.resource) breaking.push(`moved: ${opId} ${was.service}.${was.resource} -> ${now.service}.${now.resource}`);
  else if (now.method !== was.method) breaking.push(`method renamed: ${opId} ${fqmn(was)} -> ${now.method}`);
  if (now.sqlVerb !== was.sqlVerb) breaking.push(`verb changed: ${opId} (${was.service}.${was.resource}.${was.method}) ${was.sqlVerb} -> ${now.sqlVerb}`);
  if (was.sqlVerb === 'select' && now.sqlVerb === 'select' && now.objectKey !== was.objectKey) breaking.push(`object key changed: ${opId} (${fqmn(was)}) ${was.objectKey || '(none)'} -> ${now.objectKey || '(none)'}`);
}
for (const [opId, now] of current) {
  if (!now.mapped) continue;
  const was = baseline.get(opId);
  if (!was) additions.push(`new operation: ${opId} -> ${fqmn(now)}`);
  else if (!was.mapped) additions.push(`newly mapped: ${opId} -> ${fqmn(now)}`);
}

// a resource that loses every method disappears from the provider
const resourcesOf = (idx) => new Set([...idx.values()].filter((r) => r.mapped).map((r) => `${r.service}.${r.resource}`));
const before = resourcesOf(baseline), after = resourcesOf(current);
for (const r of before) if (!after.has(r)) breaking.push(`resource removed: ${r}`);
for (const r of after) if (!before.has(r)) additions.push(`new resource: ${r}`);

console.log(`Mapping stability vs ${baselineRef}: ${[...baseline.values()].filter((r) => r.mapped).length} mapped operations in the baseline, ${[...current.values()].filter((r) => r.mapped).length} now`);
for (const a of additions) console.log(`  + ${a}`);
if (breaking.length === 0) {
  console.log(`  no breaking mapping changes${additions.length ? ` (${additions.length} addition(s))` : ''}`);
  process.exit(0);
}
for (const b of breaking) console.log(`  ! ${b}`);
if (accept) {
  console.log(`  ${breaking.length} breaking mapping change(s) ACCEPTED (ALLOW_BREAKING_MAPPING_CHANGES) - record them in NOTES.md and the release notes`);
  process.exit(0);
}
console.error(`FAILED: ${breaking.length} breaking mapping change(s). Fix the rule in map_operations.mjs, or re-run with ALLOW_BREAKING_MAPPING_CHANGES=1 to accept a deliberate change.`);
process.exit(1);
