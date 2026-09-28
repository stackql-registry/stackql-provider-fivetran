#!/usr/bin/env node

// Splits the pinned Fivetran OpenAPI definition into per-service StackQL
// service specs. The spec is split by the ordered path rules in
// provider-dev/config/service_names.json (shared with build_inventory.mjs via
// lib/spec_helpers.mjs). Unmatched paths fail the run without writing.
//
// provider-utils split() cleans its output dir on every call, so the spec is
// split into a temp dir and the requested service specs are copied into
// --output-dir (all services by default, or a --services subset).
//
// After the split every service spec gets the server in
// provider-dev/config/servers.json (https://api.fivetran.com, fixed) and
// every path parameter is presented in snake_case (connectionId ->
// connection_id; the names never reach the wire). Paths keep the vendor's
// form, /v1 prefix included.
//
// Usage:
//   node bin/split.mjs --provider-name fivetran \
//     [--api-doc provider-dev/downloaded/fivetran-v1.json] \
//     [--output-dir provider-dev/source] \
//     [--services groups,connections] [--overwrite] [--verbose]

import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { providerdev } from '@stackql/provider-utils';
import { makeServiceResolver, loadServiceConfig, renamePathParameters } from '../provider-dev/scripts/lib/spec_helpers.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const getArg = (flag) => {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : null;
};

const providerName = getArg('--provider-name') || 'fivetran';
const apiDoc = getArg('--api-doc') || path.join(repoRoot, 'provider-dev', 'downloaded', 'fivetran-v1.json');
const outputDir = getArg('--output-dir') || path.join(repoRoot, 'provider-dev', 'source');
const servicesFilter = getArg('--services') ? getArg('--services').split(',').map((s) => s.trim()) : null;
const overwrite = args.includes('--overwrite');
const verbose = args.includes('--verbose');

if (!fs.existsSync(apiDoc)) {
  console.error(`Error: spec not found at ${apiDoc} (run npm run fetch-spec first)`);
  process.exit(1);
}
const resolveService = makeServiceResolver();
const titles = loadServiceConfig().titles || {};
const serversPath = path.join(repoRoot, 'provider-dev', 'config', 'servers.json');
const servers = JSON.parse(fs.readFileSync(serversPath, 'utf8'));

// Prepare the output directory, preserving non-spec files (e.g. .gitkeep)
fs.mkdirSync(outputDir, { recursive: true });
const existing = fs.readdirSync(outputDir).filter((f) => /\.(yaml|yml|json)$/.test(f));
if (existing.length > 0 && !overwrite) {
  console.error(`Error: output directory ${outputDir} is not empty. Use --overwrite to replace existing service specs.`);
  process.exit(1);
}

const unmapped = new Set();
const svcDiscriminatorFn = (pathKey) => {
  const service = resolveService(pathKey);
  if (!service) {
    unmapped.add(pathKey);
    return 'unmapped_service';
  }
  return service;
};

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stackql-split-'));
const written = [];
try {
  const result = await providerdev.split({
    apiDoc,
    providerName,
    outputDir: tmpDir,
    svcDiscriminator: 'function',
    svcDiscriminatorFn,
    overwrite: true,
    verbose,
    svcNameOverrides: {}
  });
  if (!result) {
    console.error('Error: split failed');
    process.exit(1);
  }
  if (unmapped.size > 0) {
    console.error('Error: paths with no service rule in provider-dev/config/service_names.json:');
    for (const t of [...unmapped].sort()) console.error(`  ${t}`);
    process.exit(1);
  }

  const docs = [];
  for (const outFile of fs.readdirSync(tmpDir).sort()) {
    const service = outFile.replace(/\.(yaml|yml|json)$/, '');
    if (servicesFilter && !servicesFilter.includes(service)) continue;
    const doc = yaml.load(fs.readFileSync(path.join(tmpDir, outFile), 'utf8'));
    if (!titles[service]) {
      console.error(`Error: service ${service} has no title/description in provider-dev/config/service_names.json`);
      process.exit(1);
    }
    doc.info = { ...(doc.info || {}), title: `Fivetran ${titles[service].title} API`, description: titles[service].description };
    const counts = renamePathParameters(doc, servers);
    docs.push({ outFile, doc, counts });
  }

  // Clear previous service specs only after the split and config validated
  for (const f of existing) {
    fs.rmSync(path.join(outputDir, f));
  }
  for (const { outFile, doc, counts } of docs) {
    fs.writeFileSync(path.join(outputDir, outFile), yaml.dump(doc, { lineWidth: -1, noRefs: true }));
    written.push(`${outFile} (${counts.paths} paths${counts.merged ? `, ${counts.merged} path item merged` : ''}, ${counts.renamed} path parameter declarations renamed)`);
  }
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

console.log(`Split completed: ${written.length} service specs written to ${outputDir}`);
for (const f of written.sort()) {
  console.log(`  ${f}`);
}
console.log(`Server: ${servers[0].url}`);
