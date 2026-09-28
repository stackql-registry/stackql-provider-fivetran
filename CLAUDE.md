# CLAUDE.md

## Project

This repository builds and documents the `fivetran` provider for [StackQL](https://github.com/stackql/stackql), enabling SQL-based query and provisioning operations against the Fivetran REST API - groups and destinations, connections and their sync state, schema / table / column configuration, certificates and fingerprints, transformations and transformation projects, users, teams, roles and memberships, webhooks, system keys, log services, external secrets managers, private links, proxy agents, hybrid deployment agents, Connector SDK packages, and the connector catalogue.

The provider is a type 1 (DIRECT) build from the vendor's published OpenAPI document using `@stackql/provider-utils`, in the lean fixed-host mould of the supabase / clickhouse sibling repos (the reference for structure, scripts, tests and docs is [`stackql-provider-supabase`](../../S/stackql-provider-supabase)). Fivetran-specific findings live in [NOTES.md](NOTES.md) - read it before changing a mapping.

**Scope notes, recorded so they are never relitigated**: the REST API is the provider. There is no GraphQL surface to merge in. The HVR 6 REST API is a separate product with its own host and is out of scope (only the HVR hub registration, which is a Fivetran REST operation, is mapped).

## Spec source

Fivetran serves one unversioned OpenAPI document at `https://fivetran.com/assets-docs/openapi/file_v1.json`. `bin/fetch-spec.sh` downloads it, applies the deterministic fixes in `provider-dev/scripts/record_spec_pin.mjs` (counted in the pin), validates with `@apidevtools/swagger-parser`, and pins (URL, date, hash) in `provider-dev/config/spec_pin.json`. The snapshot in `provider-dev/downloaded/` is committed, pretty-printed. The weekly drift job opens an issue; refreshes are reviewed diffs (`make refresh-spec`), never silent regenerations. A spec defect gets a new fix class in `record_spec_pin.mjs`, not a hand edit.

The biggest fix is the discriminator collapse: about 2,800 of the 2,989 upstream schemas are per-connector variants that no operation references directly. They are dropped and `config` / `auth` are presented as JSON objects (NOTES.md finding 1).

## Design decisions (settled - see NOTES.md for the evidence)

- **Basic auth from `FIVETRAN_APIKEY` / `FIVETRAN_APISECRET`** - the Terraform provider's variable names. `valuePrefix: 'Basic '`.
- **One fixed server, `https://api.fivetran.com`**, vendor paths kept. There is no account or region segment to resolve from the environment, and the Terraform `FIVETRAN_API_URL` cannot be expressed as a server variable (finding 2). No `x-stackQL-envVar` anywhere.
- **No `Accept` parameter.** stackql sends the response media type; the vendor's `version=2` negotiation is not expressible and changes nothing on the live API today (finding 4).
- **Pagination is configured once per service document**: `cursor` in the query, `$.data.next_cursor` in the body (finding 5).
- **Object keys everywhere**: `$.data.items` on collections, `$.data` on single reads and on every write that returns the entity - so `INSERT ... RETURNING` and `UPDATE ... RETURNING` work (finding 3).
- **snake_case surface**: path parameters renamed at the split (`connectionId` -> `connection_id`, and `id` / `schema` / `table` unified to `user_id` / `schema_name` / `table_name`); `snake_case_aliases: true` on the provider plus `request.nativeCasing: camel` on the one method with a camelCase query parameter (finding 8).
- **Naive request body translation on every method with a body.** No DELETE carries a body.
- **Lifecycle actions are EXEC methods on the resource they act on**; 2 of 45 resources are non-selectable (finding 12).
- **PATCH is UPDATE.** UPDATE values are sent as strings and the API coerces them (finding 10).
- **Skip codes** (3 operations): `multipart_package_upload`, `binary_package_download`.

## Toolchain rules

- Use the **latest** `@stackql/provider-utils` and `@stackql/pgwire-lite` (check npm before starting work; do not pin to an old minor). Node.js >= 20, `type: module`.
- Docusaurus 3.10.x for the microsite; `showLastUpdateTime` is flipped on in `website/docusaurus.config.js`.
- WSL is the execution environment on this machine (GNU make, bash, a `stackql` binary on PATH, Python 3, yarn). Node steps also run from Windows.
- The two CLI entry points (`provider-dev-utils.mjs`, `docgen-utils.mjs`) are npm scripts invoked through `node`; the Makefile is the operator surface (`make help`).

## Repository layout

```
Makefile               # the pipeline: make all / make test / make smoke ...
bin/                   # fetch-spec.sh, split.mjs, server lifecycle, test-meta-routes.cjs
provider-dev/
  downloaded/          # pinned spec snapshot (committed)
  config/              # spec_pin.json, service_names.json, servers.json, endpoint_inventory.csv, all_services.csv
  scripts/             # record_spec_pin, build_inventory, map_operations, check_mapping_stability,
                       # pre_normalize, post_process, lib/spec_helpers
  source/              # split + normalized per-service specs (build artifacts, committed)
  openapi/src/fivetran # generated provider output (committed)
  docgen/provider-data # headerContent1.txt / headerContent2.txt (landing page)
tests/
  offline_validation.mjs
  integration/         # mock_fivetran_server.mjs, harness.mjs, run_integration_tests.mjs,
                       # run_docs_examples.mjs, probe.mjs
  smoke_test.py        # live suite (--live, --read-only, --cleanup-only)
website/               # Docusaurus microsite (shared stackql/docusaurus-config vendored at build)
.github/workflows/     # build-and-test.yml (pin check, build, drift check, test layers, gated smoke,
                       # weekly spec-drift), web deploys
```

## Build pipeline

`make all` runs deps -> fetch-spec (pin verify) -> inventory -> split -> mappings (+ stability check) -> pre-normalize -> normalize -> generate (+ post-process) -> test-offline -> test-integration -> test-meta -> docs -> website. Every step is deterministic and re-runnable; manual mapping decisions are rules in `map_operations.mjs` (`RESOURCE_RULES`, `METHOD_RULES`) and skip codes in `lib/spec_helpers.mjs`, never hand-edits to CSVs or specs. Validate-and-fail-without-writing is the standard for every script.

To take an upstream change: `make refresh-spec`, then `make all`, then review the diff.

## all_services.csv is the mapping contract

`provider-dev/config/all_services.csv` is committed as the durable record of every operation -> service.resource.method mapping. It is regenerated from scratch on every build, and `make mappings` then runs `check_mapping_stability.mjs`, which compares it with the committed copy (git HEAD), keyed on the vendor's operationId, and **fails the build** when a mapped operation disappears, moves to another service or resource, changes method name or verb, or (for a select) changes object key. New operations are reported as additions and pass.

A deliberate breaking change is accepted with `ALLOW_BREAKING_MAPPING_CHANGES=1 make mappings`; record it in NOTES.md and the release notes. A new upstream operation with no `RESOURCE_RULES` entry gets a mechanically derived name and is listed at the end of the mapping output - give it a rule before it is published, because after that its name is part of the contract.

## Tests

1. `make test-offline` - the provider documents and `SHOW` / `DESCRIBE` against the local file registry, then `tests/mapping_stability_test.mjs`, which proves the stability check against fixtures.
2. `make test-integration` - the mock Fivetran API (`tests/integration/mock_fivetran_server.mjs`, wire shapes verified against the live API, basic auth enforced) with row-level and wire-level assertions per archetype, then every SQL statement in the landing page and the README run against the mock. `tests/integration/probe.mjs "<sql>"` prints stackql output and the wire call for ad-hoc binding checks.
3. `make test-meta` - the meta-route walk over a local server.
4. `make smoke` / `make smoke-live` / `make smoke-read-only` / `make smoke-cleanup` - live, with credentials from `.env` (`FIVETRAN_APIKEY`, `FIVETRAN_APISECRET`). `smoke-live` runs against the provider published in the stackql registry.

Never run tests against a production account.

## Live testing: cost and rate limit

- **Cost**: Fivetran bills on data moved by a sync. The smoke suite never syncs: its connection is created paused with setup tests off, in a group whose destination is a placeholder. A run costs nothing. Do not add `sync`, `resync`, connection setup tests or a transformation run to it.
- **Rate limit**: 500 API calls per rolling hour on the test account. A full smoke run is about 100 calls. The harness checks the remaining budget before it starts and stops at the first 429; if a run dies half way, `make smoke-cleanup` sweeps the `stackql_smoke_*` leftovers once the window has moved on. Ad-hoc probing spends the same budget - use the mock (`probe.mjs`) first.
- `users.create` sends an invitation email. It is not in the suite.

## Publish and docs

Push the `fivetran` dir to `providers/src` in a feature branch of [`stackql-provider-registry`](https://github.com/stackql/stackql-provider-registry) and follow the registry release flow; verify with `registry pull fivetran` from the dev registry and `make smoke-live`. Docs: `make docs` (generate + sanitize) then `make website`; GitHub Pages with `fivetran-provider.stackql.io` CNAME -> `stackql.github.io.`.

## Writing conventions

- README and docs copy: measured, precise, no hyperbole. Third-person or passive framing for descriptive copy.
- No em dashes; use `-`. No characters not on a QWERTY keyboard; use `->` for arrows.
- Sample queries are realistic and runnable, with `json_extract` for nested fields; `"schema"`, `"start"`, `"end"` and `"limit"` are double-quoted. Every SQL block in the landing page and README is executed by `run_docs_examples.mjs`, so the identifiers in examples are the mock's seed data (`decent_dropsy`, `speak_inexpensive`, ...).

## Non-negotiables

1. Latest `@stackql/provider-utils`, always
2. A committed mapping does not change without `ALLOW_BREAKING_MAPPING_CHANGES=1` and a NOTES.md entry
3. The smoke suite moves no data and checks its API budget before it starts
4. Deterministic scripts, never hand-edits to derived artifacts
5. Every regeneration is followed by `make test` before commit
6. Smoke tests clean up everything they create
7. The wire wins over the spec: a shape the live API contradicts is fixed at the pin step, with the evidence in NOTES.md
