#!/usr/bin/env node

// Runs every SQL statement in the landing page
// (provider-dev/docgen/provider-data/headerContent2.txt) and the README
// against the mock Fivetran API, in document order, and fails on any
// statement that errors. The examples are what users copy first; this keeps
// them runnable as the provider is regenerated.
//
// A statement passes when stackql parses it, routes it to a method and the
// mock answers 2xx. The identifiers the examples use (decent_dropsy,
// speak_inexpensive, ...) are the mock's seed data, so reads return rows and
// writes have something to act on.
//
// Each document runs against a fresh mock, because the examples end by
// deleting what they address.
//
// Usage: node tests/integration/run_docs_examples.mjs [--verbose]

import fs from 'fs';
import path from 'path';
import { startMockServer } from './mock_fivetran_server.mjs';
import { buildTestRegistry, makeRunSql, repoRoot } from './harness.mjs';

const verbose = process.argv.includes('--verbose');
const t0 = Date.now();

const DOCUMENTS = [
  'provider-dev/docgen/provider-data/headerContent2.txt',
  'README.md'
];

// ```sql fenced blocks -> statements (split on ; at end of line, comments kept
// with their statement)
function statementsOf(text) {
  const out = [];
  const fence = /```sql\r?\n([\s\S]*?)```/g;
  let m;
  while ((m = fence.exec(text)) !== null) {
    const line = text.slice(0, m.index).split('\n').length + 1;
    for (const raw of m[1].split(/;[ \t]*(?:\r?\n|$)/)) {
      const sql = raw.split('\n').filter((l) => !/^\s*--/.test(l)).join('\n').trim();
      if (sql) out.push({ sql, line });
    }
  }
  return out;
}

let failures = 0, total = 0;
for (const doc of DOCUMENTS) {
  const fp = path.join(repoRoot, doc);
  if (!fs.existsSync(fp)) {
    console.log(`SKIP ${doc} (not found)`);
    continue;
  }
  const statements = statementsOf(fs.readFileSync(fp, 'utf8'));
  const { server, port, log } = await startMockServer();
  const runSql = makeRunSql(buildTestRegistry(port, '.registry-docs-tmp'), { verbose });
  console.log(`${doc}: ${statements.length} statements against the mock on localhost:${port}`);
  try {
    for (const { sql, line } of statements) {
      total++;
      const mark = log.length;
      const r = await runSql(sql);
      const oneLine = sql.replace(/\s+/g, ' ');
      const meta = /^(show|describe|registry)\b/i.test(sql);
      const wire = log.slice(mark);
      const bad = wire.filter((e) => e.status >= 400);
      const pass = !r.err && bad.length === 0 && (meta || wire.length > 0);
      if (!pass) failures++;
      console.log(`  ${pass ? 'PASS' : 'FAIL'}  [${doc.split('/').pop()}:${line}] ${oneLine.slice(0, 110)}${oneLine.length > 110 ? '...' : ''}`);
      if (!pass) console.log(`        ${r.err ? String(r.err).slice(0, 400) : bad.length ? `wire: ${bad.map((e) => `${e.method} ${e.path} -> ${e.status}`).join(', ')}` : 'no request reached the API'}`);
    }
  } finally {
    server.close();
  }
}

console.log(`\n${total - failures}/${total} statements passed in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
if (failures || total === 0) process.exit(1);
