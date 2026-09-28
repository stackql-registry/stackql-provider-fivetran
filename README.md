# `fivetran` provider for [`stackql`](https://github.com/stackql/stackql)

This repository builds and documents the `fivetran` provider for StackQL, enabling SQL-based query and provisioning operations against the [Fivetran REST API](https://fivetran.com/docs/rest-api) - groups and destinations, connections and their sync state, schema, table and column configuration, certificates and fingerprints, transformations and transformation projects, users, teams, roles and memberships, webhooks, system keys, log services, external secrets managers, private links, proxy agents, hybrid deployment agents, Connector SDK packages, and the connector catalogue.

Coverage is generated mechanically from the vendor's published OpenAPI document: 176 of its 179 operations, as 176 methods on 45 resources in 15 services.

## Design Principles

1. **Fixed server, basic auth** - the API base is the literal `https://api.fivetran.com`. Authentication is HTTP basic with the API key and secret in `FIVETRAN_APIKEY` and `FIVETRAN_APISECRET`, the variables the Fivetran Terraform provider reads.
2. **Spec fetch is pinned** - Fivetran serves one unversioned OpenAPI document. `bin/fetch-spec.sh` downloads, fixes deterministically, validates and pins it (URL, date, sha256) in `provider-dev/config/spec_pin.json`; the snapshot is committed so every refresh is a reviewed diff.
3. **Connector configuration is JSON** - the vendor's document carries one schema set per connector type (about 2,800 of its 2,989 schemas). They are collapsed at the pin step; `config` and `auth` are JSON objects at the SQL surface, and the keys a connector type accepts are queryable from `fivetran.metadata.connector_types`.
4. **The mapping is a contract** - `provider-dev/config/all_services.csv` is committed as the durable record of every operation -> service.resource.method mapping, and the build fails when a regeneration would move or rename a published method.
5. **snake_case surface** - path parameters are presented in snake_case (`connection_id`), one name per entity.
6. **Pagination and object keys are uniform** - every collection follows the API's cursor; every read and every write that returns the entity projects it, so `INSERT ... RETURNING` and `UPDATE ... RETURNING` work.
7. **Lifecycle actions belong to their resource** - sync, resync, setup tests, rotate, run and the like are `EXEC` methods on the resource they act on; 43 of the 45 resources are selectable.
8. **Rate limit as a design input** - the API allows a fixed number of calls per rolling hour (500 on the test account). The live harness checks the remaining budget before it starts.
9. **Deterministic pipeline** - every step is scripted and re-runnable; mapping decisions are rules in scripts, never hand-edits to derived artifacts.

Findings behind these decisions - the spec fix classes, why `FIVETRAN_API_URL` and the `Accept` version negotiation are not mapped, the response shapes verified live, the engine's typing of statement values - are recorded in [NOTES.md](NOTES.md).

## Prerequisites

- Node.js >= 20
- A local `stackql` binary for testing (`$STACKQL`, `./stackql`, or on `PATH`; `bin/start-server.sh` downloads one only if none is found)
- GNU make and bash (Linux, WSL or macOS); Python 3 and yarn for the smoke suite and the website
- For live smoke tests: a Fivetran account and an API key and secret (never a production account)

Install dependencies:

```bash
npm install
```

### Makefile

Every step below is wrapped as a `make` target (`make help` lists them). The composite targets:

```bash
make all      # deps, full pipeline (fetch/pin verify, inventory, split, mappings + stability check,
              # pre-normalize, normalize, generate, post-process), offline + integration + meta-route
              # tests, docs generation, website build - no credentials needed
make test     # the three credential-free test layers
make smoke    # live smoke suite (sources .env if present)
```

`make all` never touches a real account - the live suites are separate targets (`smoke`, `smoke-live` against the published provider, `smoke-read-only`, `smoke-cleanup` to sweep breadcrumbs). Live credentials are read from the environment or a gitignored `.env` file (see `.env.example`):

```bash
FIVETRAN_APIKEY=...
FIVETRAN_APISECRET=...
```

To take an upstream change at any time: `make refresh-spec && make all`, then review the diff.

## 0. Download and Pin the Spec

```bash
make fetch-spec      # verify against the recorded pin (fails on drift)
make refresh-spec    # accept an upstream change (rewrites the pin - review the diff)
```

Pinned snapshot (2026-09-27): `OpenAPI Definition (v1)`, OpenAPI 3.0.1, 105 paths, 179 operations, upstream sha256 `7da34593de3f...`, 3.2 MB upstream and 700 KB after fixes. The fix classes applied before validation and counted in the pin: 15 discriminator families collapsed (1,702 variants dropped, 20 service-specific properties declared on the bases, 2,842 orphaned schemas removed), 179 `Accept` header parameters removed, 3 bare-object responses enveloped, 1 `data` redeclared as an array, 2 `required` names corrected.

## 1. Endpoint Inventory and Service Split

```bash
make inventory
make split
```

`make inventory` writes `provider-dev/config/endpoint_inventory.csv`: one row per operation with the vendor's operationId and tag, path and query parameters, cursor pagination, request body kind and properties, the deprecated flag, response shape and object key, service, a draft resource and verb, and a skip reason where an operation is not mapped.

Inventory of the pinned snapshot: 179 operations, 176 mapped and 3 skipped with reason codes (2 `multipart_package_upload`, 1 `binary_package_download`). 32 collections are cursor-paginated; 1 operation is deprecated.

The service split is recorded as ordered path rules in `provider-dev/config/service_names.json` (first match wins, unmatched paths fail the build). `make split` writes one spec per service to `provider-dev/source/` with the path parameters renamed to snake_case.

| Service | Resources |
|---|---|
| `account` | account_info, roles, system_keys |
| `certificates` | certificates, connection_certificates, connection_fingerprints, destination_certificates, destination_fingerprints |
| `connections` | connections, schema_configs, columns, states, sync_history, warnings, move_jobs |
| `connector_sdk` | packages |
| `destinations` | destinations |
| `external_logging` | log_services, account_log_services |
| `external_secrets_managers` | secrets_managers, entities |
| `groups` | groups, users, connections, ssh_public_keys, service_accounts |
| `hybrid_deployment` | agents, hvr_hubs |
| `metadata` | connector_types, public_connector_types |
| `networking` | private_links, proxy_agents, proxy_agent_connections |
| `teams` | teams, group_memberships, connection_memberships, user_memberships |
| `transformations` | transformations, transformation_projects, package_metadata |
| `users` | users, api_keys, group_memberships, connection_memberships |
| `webhooks` | webhooks |

## 2. Operation Mappings

```bash
make mappings
```

Regenerates `provider-dev/config/all_services.csv` from scratch, applies the rules in `provider-dev/scripts/map_operations.mjs`, and checks the result against the committed copy.

| API operation | StackQL | Object key |
|---|---|---|
| GET collection | `SELECT` `<resource>.list` | `$.data.items` |
| GET single | `SELECT` `<resource>.get` | `$.data` |
| POST create | `INSERT` `<resource>.create` | `$.data` (for `RETURNING`) |
| PATCH | `UPDATE` `<resource>.update` | `$.data` (for `RETURNING`) |
| DELETE | `DELETE` `<resource>.delete` | |
| POST / PATCH action | `EXEC` `<resource>.<action>` | `$.data` where the action returns the entity |

Mapped: 71 select, 28 insert, 23 update, 29 delete, 25 exec.

### Mapping stability

`all_services.csv` is the record of what has been published. `make mappings` ends with `make check-mappings`, which compares the regenerated file with the committed one (git HEAD), keyed on the vendor's operationId, and fails when:

- a mapped operation is gone or is now skipped
- an operation moved to another service or resource
- a method name or StackQL verb changed
- the object key of a select changed

New operations are reported and pass; so does a path change on its own. The check has its own tests (`tests/mapping_stability_test.mjs`, run by `make test-offline`). A deliberate breaking change is accepted explicitly:

```bash
ALLOW_BREAKING_MAPPING_CHANGES=1 make mappings
```

## 3. Generate the Provider

```bash
make pre-normalize normalize generate
```

`pre-normalize` validates the split specs (no body attribute may share a name with a path or query parameter, since naive body translation could not set it). `normalize` is the generic `@stackql/provider-utils` pass. `generate` writes `provider-dev/openapi/src/fivetran/v00.00.00000/` with basic auth, the service-level pagination configuration and naive request body translation, then `post-process` sets the object keys on writes and `request.nativeCasing` on the one method with a camelCase query parameter, and verifies servers and pagination.

`make build` runs steps 0 to 3.

## 4. Test the Provider

```bash
make test-offline       # 48 checks: provider documents, SHOW / DESCRIBE against the local registry;
                        # then 11 checks of the mapping stability check itself
make test-integration   # 76 checks against the mock Fivetran API, then every documentation example
make test-meta          # the meta-route walk: 15 services, 45 resources, 176 methods
make test               # all three
```

The mock (`tests/integration/mock_fivetran_server.mjs`) serves the wire shapes the live API returns, enforces basic auth, pages at two rows so the cursor is followed, and logs every request so the tests assert on the wire as well as on the rows. `tests/integration/probe.mjs` runs ad-hoc statements against it:

```bash
node tests/integration/probe.mjs "SELECT id, name FROM fivetran.groups.groups"
```

`run_docs_examples.mjs` executes every SQL block in the landing page (`provider-dev/docgen/provider-data/headerContent2.txt`) and in this README against the mock, so the examples stay runnable.

### Live smoke suite

```bash
make smoke             # reads + free write lifecycles, local provider
make smoke-read-only   # reads only
make smoke-live        # against the provider published in the stackql registry
make smoke-cleanup     # sweep stackql_smoke_* breadcrumbs
```

The write lifecycles follow the resources the Terraform provider documents first: a group, a destination, a connection, webhooks at account and group scope, a team with its group, connection and user memberships, a system key and a proxy agent - each created, read, updated and deleted.

**Cost: nothing.** Fivetran bills on data moved by a sync. The connection is created paused, with setup tests off, in a group whose destination is a placeholder that is never connected, and it is never synced. The other objects are free.

**Rate limit.** A full run is about 100 API calls against an allowance of 500 per rolling hour. The harness reads `x-rate-limit-remaining` before it starts and does not start a run it could not finish; if a 429 arrives anyway the run stops, and `make smoke-cleanup` sweeps what is left once the window has moved on.

## 5. Generate the Docs and Build the Site

```bash
make docs       # generate website/docs from the provider, then sanitize for MDX
make website    # build the Docusaurus microsite (3.10.x)
```

The landing page is assembled from `provider-dev/docgen/provider-data/headerContent1.txt` and `headerContent2.txt` (installation, authentication, getting started queries, conventions, examples). The sanitize step escapes vendor description text for MDX and makes the generated SQL examples runnable as written: the keyword identifiers (`schema`, `start`, `end`, `limit`) are double-quoted, and the pagination `cursor` is dropped since stackql follows it by itself.

Every page carries a "Last updated" stamp (`showLastUpdateTime`). The stamps come from git history, so they appear once the generated docs are committed.

## Using the Provider

```bash
export FIVETRAN_APIKEY='...'
export FIVETRAN_APISECRET='...'
stackql shell
```

Which account, and which groups:

```sql
SELECT account_id, account_name, user_id
FROM fivetran.account.account_info;

SELECT id, name, created_at
FROM fivetran.groups.groups;
```

Connections and their state (`schema` is a SQL keyword and is quoted):

```sql
SELECT id, group_id, service, "schema", paused, sync_frequency,
       json_extract(status, '$.setup_state') AS setup_state,
       json_extract(status, '$.sync_state') AS sync_state,
       succeeded_at, failed_at
FROM fivetran.connections.connections
WHERE group_id = 'decent_dropsy';
```

Create a group and a paused connection in it, getting the identifiers back:

```sql
INSERT INTO fivetran.groups.groups (name)
SELECT 'analytics'
RETURNING id, name;

INSERT INTO fivetran.connections.connections (group_id, service, paused, run_setup_tests, config)
SELECT 'decent_dropsy', 'webhooks', true, false, '{"schema": "events", "table": "inbound"}'
RETURNING id, service, "schema", paused;
```

Change it, act on it:

```sql
UPDATE fivetran.connections.connections
SET sync_frequency = 60
WHERE connection_id = 'speak_inexpensive'
RETURNING id, sync_frequency;

EXEC fivetran.connections.connections.sync @connection_id = 'speak_inexpensive';
```

The identifiers in these examples are placeholders. More examples are on the landing page of the docs site.

## Publishing

1. Push `provider-dev/openapi/src/fivetran` to `providers/src` in a feature branch of [`stackql-provider-registry`](https://github.com/stackql/stackql-provider-registry) and follow the registry release flow.
2. Verify from the dev registry: `registry pull fivetran`, then `make smoke-live`.
3. Docs: `make docs && make website`; the site is served from GitHub Pages at `fivetran-provider.stackql.io`.

This build replaces the `fivetran` provider published earlier (built from an older spec, `connectors` naming). Service, resource, method and parameter names change, and the credential variables become `FIVETRAN_APIKEY` / `FIVETRAN_APISECRET`.

## License

MIT
