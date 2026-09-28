// Shared harness for the mock-server test runners (run_integration_tests.mjs,
// run_docs_examples.mjs, probe.mjs): stackql binary resolution, the test
// copy of the registry pointed at the mock, and the statement runner.

import { spawn } from 'child_process';
import { existsSync, rmSync, cpSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { EXPECTED_KEY, EXPECTED_SECRET } from './mock_fivetran_server.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(here, '..', '..');
export const API_BASE = 'https://api.fivetran.com';

export function findStackql() {
  if (process.env.STACKQL) return process.env.STACKQL;
  const local = path.join(repoRoot, process.platform === 'win32' ? 'stackql.exe' : 'stackql');
  if (existsSync(local)) return local;
  return 'stackql'; // PATH
}

// The provider's server is https-only and cannot address the mock, so the
// runners materialise a TEST COPY of provider-dev/openapi in
// tests/integration/.registry-tmp (gitignored, recreated each run) with the
// server URL rewritten to the mock. provider-dev/** is never modified.
// Returns the --registry argument.
export function buildTestRegistry(port, name = '.registry-tmp') {
  const srcDir = path.join(repoRoot, 'provider-dev', 'openapi');
  const tmpDir = path.join(here, name);
  rmSync(tmpDir, { recursive: true, force: true });
  cpSync(srcDir, tmpDir, { recursive: true });
  const servicesDir = path.join(tmpDir, 'src', 'fivetran', 'v00.00.00000', 'services');
  const base = `http://localhost:${port}`;
  for (const f of readdirSync(servicesDir)) {
    if (!f.endsWith('.yaml')) continue;
    const fp = path.join(servicesDir, f);
    const doc = yaml.load(readFileSync(fp, 'utf8'));
    if (doc.servers?.[0]?.url !== API_BASE) throw new Error(`${f}: expected the top-level server ${API_BASE}`);
    doc.servers[0].url = base;
    writeFileSync(fp, yaml.dump(doc, { lineWidth: -1, noRefs: true }));
  }
  const regPath = tmpDir.split(path.sep).join('/');
  return JSON.stringify({ url: `file://${regPath}`, localDocRoot: regPath, verifyConfig: { nopVerify: true } });
}

export const ERRISH = /http response status code: [45]|error|panic|FindRoute|no matching operation|cannot find matching operation|disallowed|cannot find any viable servers|not supported/i;

// IMPORTANT: must be async (spawn, not spawnSync) - the mock server runs on
// the runner's event loop, so a synchronous wait for stackql deadlocks.
export function makeRunSql(registry, { verbose = false } = {}) {
  const stackqlBin = findStackql();
  return function runSql(sql, envOverrides = {}) {
    return new Promise((resolve) => {
      const env = { ...process.env, FIVETRAN_APIKEY: EXPECTED_KEY, FIVETRAN_APISECRET: EXPECTED_SECRET, ...envOverrides };
      for (const [k, v] of Object.entries(envOverrides)) if (v === undefined) delete env[k];
      const child = spawn(stackqlBin, [`--registry=${registry}`, 'exec', sql, '--output', 'json'], { cwd: repoRoot, env });
      let stdout = '', stderr = '';
      child.stdout.on('data', (d) => { stdout += d; });
      child.stderr.on('data', (d) => { stderr += d; });
      const timer = setTimeout(() => child.kill(), 120000);
      child.on('error', (e) => { clearTimeout(timer); resolve({ rows: null, err: String(e) }); });
      child.on('close', () => {
        clearTimeout(timer);
        stdout = stdout.trim();
        stderr = stderr.trim();
        if (verbose) console.log(`    sql: ${sql}\n    out: ${stdout.slice(0, 400)}${stderr ? `\n    err: ${stderr.slice(0, 400)}` : ''}`);
        if (ERRISH.test(stderr)) return resolve({ rows: null, err: stderr });
        if (!stdout) return resolve({ rows: [], err: null });
        try {
          // stackql --output json renders every scalar as a string ("true",
          // "60"); normalise so assertions can compare typed values
          const val = (v) => (v === 'true' ? true : v === 'false' ? false : (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v)) ? Number(v) : v);
          const parsed = JSON.parse(stdout);
          const rows = Array.isArray(parsed) ? parsed.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, val(v)]))) : parsed ?? [];
          resolve({ rows, err: null, text: stdout }); // literal null for zero rows
        } catch {
          resolve({ rows: [{ _text: stdout }], err: ERRISH.test(stdout) ? stdout : null, text: stdout }); // DML status text
        }
      });
    });
  };
}
