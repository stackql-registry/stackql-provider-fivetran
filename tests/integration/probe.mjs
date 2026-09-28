#!/usr/bin/env node

// Developer probe: start the mock Fivetran API, materialise the test
// registry (as run_integration_tests.mjs does) and run the SQL statements
// given on the command line, printing stackql's stdout/stderr and the wire
// calls the mock saw for each. Handy when a binding misbehaves.
//
// Usage: node tests/integration/probe.mjs "SELECT ..." "EXEC ..." [--env KEY=VALUE ...] [--unset KEY]

import { spawn } from 'child_process';
import { startMockServer, EXPECTED_KEY, EXPECTED_SECRET } from './mock_fivetran_server.mjs';
import { buildTestRegistry, findStackql, repoRoot } from './harness.mjs';

const args = process.argv.slice(2);
const sqls = [];
const envOverrides = {};
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--env') { const [k, ...v] = args[++i].split('='); envOverrides[k] = v.join('='); }
  else if (args[i] === '--unset') { envOverrides[args[++i]] = undefined; }
  else sqls.push(args[i]);
}

const { server, port, log } = await startMockServer();
const registry = buildTestRegistry(port, '.registry-probe-tmp');
const bin = findStackql();

function run(sql) {
  return new Promise((resolve) => {
    const env = { ...process.env, FIVETRAN_APIKEY: EXPECTED_KEY, FIVETRAN_APISECRET: EXPECTED_SECRET, ...envOverrides };
    for (const [k, v] of Object.entries(envOverrides)) if (v === undefined) delete env[k];
    const child = spawn(bin, [`--registry=${registry}`, 'exec', sql, '--output', 'json'], { cwd: repoRoot, env });
    let out = '', err = '';
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    child.on('close', () => resolve({ out: out.trim(), err: err.trim() }));
  });
}

try {
  for (const sql of sqls) {
    const mark = log.length;
    const { out, err } = await run(sql);
    console.log(`\n=== ${sql}`);
    console.log(`stdout: ${out.slice(0, 1200)}`);
    if (err) console.log(`stderr: ${err.slice(0, 800)}`);
    for (const e of log.slice(mark)) console.log(`wire: ${e.method} ${e.path} query=${JSON.stringify(e.query)} accept=${e.accept} ct=${e.contentType} body=${JSON.stringify(e.body)} -> ${e.status}`);
  }
} finally {
  server.close();
}
