#!/usr/bin/env node

// Fivetran-specific checks and adjustments applied to provider-dev/source
// before the generic provider-utils normalize pass. Deterministic and
// idempotent; validates and fails without writing on any unexpected shape.
//
// Spec defects (response shapes, required names) are fixed upstream of this
// step, in record_spec_pin.mjs, so the inventory and the mapping see the
// corrected shapes. What is left here is about the provider surface:
//
// 1. Body / parameter name collisions. With naive request body translation
//    a body property is addressed by its plain name, and any-sdk binds a
//    name to an operation parameter before it looks at the body - so a body
//    property that shares a name with a path or query parameter could never
//    be set. None exist today (path parameters are entity-qualified:
//    connection_id, group_id, ...; the membership bodies use `id`); a
//    refresh that introduces one fails here rather than shipping a
//    silently unsettable attribute.
//
// 2. Operation-level `servers`. The vendor declares none; one appearing
//    would bypass the FIVETRAN_API_URL server template, so it fails here.
//
// 3. Example values on the path parameters are dropped: the vendor's
//    examples are placeholder strings ("connection_id") that read as
//    defaults in generated docs.
//
// Usage: node provider-dev/scripts/pre_normalize.mjs [--dry-run]

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { HTTP_VERBS, makeResolver } from './lib/spec_helpers.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const sourceDir = path.join(repoRoot, 'provider-dev', 'source');
const dryRun = process.argv.includes('--dry-run');

const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith('.yaml')).sort();
if (files.length === 0) {
  console.error(`Error: no service specs in ${sourceDir} - run npm run split first`);
  process.exit(1);
}

const errors = [];
const stats = { operations_checked: 0, body_operations_checked: 0, path_param_examples_removed: 0 };
const pending = [];

for (const f of files) {
  const fp = path.join(sourceDir, f);
  const doc = yaml.load(fs.readFileSync(fp, 'utf8'));
  const resolve = makeResolver(doc);
  let touched = false;

  for (const [pathKey, item] of Object.entries(doc.paths || {})) {
    if (item.servers) errors.push(`${f}: ${pathKey} declares path-level servers in the source spec`);
    for (const verb of HTTP_VERBS) {
      const op = item[verb];
      if (!op) continue;
      stats.operations_checked++;
      if (op.servers) errors.push(`${f}: ${verb.toUpperCase()} ${pathKey} declares operation-level servers`);
      const params = [...(item.parameters || []), ...(op.parameters || [])].map((p) => resolve(p)).filter(Boolean);

      // every path placeholder has a declaration, and the reverse
      const declared = new Set(params.filter((p) => p.in === 'path').map((p) => p.name));
      const placeholders = new Set((pathKey.match(/\{[^}]+\}/g) || []).map((s) => s.slice(1, -1)));
      for (const name of placeholders) if (!declared.has(name)) errors.push(`${f}: ${verb.toUpperCase()} ${pathKey} has no declaration for path parameter ${name}`);
      for (const name of declared) if (!placeholders.has(name)) errors.push(`${f}: ${verb.toUpperCase()} ${pathKey} declares path parameter ${name} that is not in the path`);

      // 3. placeholder examples on path parameters
      for (const p of [...(item.parameters || []), ...(op.parameters || [])]) {
        if (!p || p.$ref || p.in !== 'path') continue;
        for (const holder of [p, p.schema]) {
          if (holder && 'example' in holder) {
            delete holder.example;
            stats.path_param_examples_removed++;
            touched = true;
          }
        }
      }

      // 1. body / parameter name collisions
      const content = resolve(op.requestBody)?.content;
      if (!content) continue;
      stats.body_operations_checked++;
      const paramNames = new Set(params.filter((p) => p.in === 'path' || p.in === 'query').map((p) => p.name));
      for (const [mediaType, media] of Object.entries(content)) {
        if (!mediaType.includes('json')) continue;
        const schema = resolve(media.schema);
        for (const prop of Object.keys(schema?.properties || {})) {
          if (paramNames.has(prop)) errors.push(`${f}: ${verb.toUpperCase()} ${pathKey} body property ${prop} collides with a path/query parameter of the same name`);
        }
      }
    }
  }

  pending.push({ fp, doc, touched });
}

if (errors.length > 0) {
  console.error(`FAILED with ${errors.length} error(s), nothing written:`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
if (!dryRun) {
  for (const { fp, doc, touched } of pending) if (touched) fs.writeFileSync(fp, yaml.dump(doc, { lineWidth: -1, noRefs: true }));
}
console.log(`pre_normalize: ${Object.entries(stats).map(([k, v]) => `${k}: ${v}`).join(', ')}${dryRun ? ' (dry run)' : ''}`);
