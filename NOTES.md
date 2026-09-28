# NOTES

Findings from the build, answered with evidence where possible. Sources: the pinned spec (`provider-dev/downloaded/fivetran-v1.json`, upstream sha256 `7da34593de3f...`, fetched 2026-09-27, see `provider-dev/config/spec_pin.json`), the endpoint inventory (`provider-dev/config/endpoint_inventory.csv`), the mock-server integration suite (`tests/integration/`), probes of the stackql engine (v0.12.718) against the mock, direct calls to the live API, the live smoke suite, and the Terraform provider and Go SDK sources (`fivetran/terraform-provider-fivetran`, `fivetran/go-fivetran`). Sibling-build findings (supabase, clickhouse, keycloak) are reused, not re-derived.

## 1. The spec and its deterministic fixes

Fivetran serves one unversioned OpenAPI 3.0.1 document at `https://fivetran.com/assets-docs/openapi/file_v1.json` (linked from the "OpenAPI definition" page of the API reference): 105 paths, 179 operations, 2,989 schemas, 3.2 MB. It validates with swagger-parser as served. The fixes below are applied in `record_spec_pin.mjs` before validation and counted in the pin; the committed snapshot is the fixed document, pretty-printed (700 KB, 147 schemas), so a refresh is a readable diff.

| Fix class | Count | What and why |
|---|---|---|
| `discriminator_families_collapsed` | 15 | Request and response schemas for connections, destinations, log services, private links, transformations and transformation projects carry a `discriminator` whose mapping fans out to one schema per connector or service type. The operations reference the base schema only. The discriminator is removed. |
| `discriminator_variants_dropped` | 1,702 | The mapped variants (781 connection types alone, each with a request, a response and a config schema). |
| `variant_properties_declared` | 20 | The properties the variants add (`config`, `auth`, `external_secrets_keys_config`, `project_config`, `transformation_config`) are declared on the base as objects: typed from the variants where a family has one or two variants, free-form otherwise. |
| `orphan_schemas_removed` | 2,842 | Schemas unreachable from any operation after the collapse. |
| `accept_header_params_removed` | 157 | See finding 4. |
| `accept_header_versioned_removed` | 22 | See finding 4. |
| `bare_object_response_enveloped` | 3 | See finding 3. |
| `data_array_declared` | 1 | See finding 3. |
| `relative_doc_links_absolutized` | 55 | Descriptions link to the vendor's documentation with site-relative markdown links (`](/docs/...)`); rewritten to `https://fivetran.com/docs/...`. Left relative they are broken links on the docs site. |
| `required_name_corrected` | 2 | `required` names a property the schema does not declare, where the snake_case form is declared: `hubServerUrl` for `hub_server_url` (HVR hub registration) and `columnType` for `column_type` (row filter clause). |

**Consequence of the collapse:** `config` and `auth` are JSON values at the SQL surface. The keys a connector type accepts are queryable through the provider itself: `SELECT config, auth FROM fivetran.metadata.connector_types WHERE service = '<type>'`. A refresh that only adds connector types moves the upstream hash and leaves the snapshot byte-identical.

## 2. Server: fixed, no environment variable

The API has one host and no account, region or deployment segment in its URLs, so there is no path or server variable to resolve from the environment. Every service document carries `https://api.fivetran.com` and the vendor's paths (`/v1/...`, and one public path `/public/connector-types`).

The Terraform provider also reads `FIVETRAN_API_URL`, a whole base URL (the Go SDK's default is `https://api.fivetran.com/v1`). It is **not mapped**. A server template that is a single variable (`url: '{api_url}'` with `x-stackQL-envVar`) was generated and tried: stackql fails route assembly on it (`mux: path must start with a slash, got "{api_url}/groups"`), because the template needs a literal scheme. A host-only variable would work but would not be the Terraform variable, so none is invented. The integration tests address the mock by rewriting the server URL in a test copy of the registry.

## 3. Response shapes: one envelope, three spec defects

Every response is `{code, message, data}`. Verified live:

- Collections: `data` is `{items: [...], next_cursor}`; `next_cursor` is absent on the last page. Object key `$.data.items`.
- Single reads, creates and updates: the entity under `data`. Object key `$.data`.
- Deletes and most actions: `{code, message}`.
- Errors: `{code, message}` with an entity-qualified code (`NotFound_Group`, `InvalidInput`, `AuthFailed`, `TooManyRequests`).

Where the spec disagrees with the wire, the wire wins and the spec is fixed at the pin step:

- `GET /v1/proxy/{agentId}` is declared as the bare entity; the API returns the envelope (confirmed live by creating, reading and deleting a proxy agent). The two fingerprint approvals (`POST .../fingerprints`) are declared bare in the same way and are enveloped on the strength of that evidence and the uniform convention - not separately confirmed live, because that needs a connection with an SSH tunnel.
- `GET /public/connector-types` declares `data` as one connector object; the API returns an array.

Object keys on writes: the generator sets `objectKey` on GET operations only. `post_process.mjs` sets `$.data` on the 64 INSERT / UPDATE / EXEC methods whose response declares `data`, which is what makes `INSERT ... RETURNING id` and `UPDATE ... RETURNING ...` project the entity. Proven on the mock and live (group, destination, connection, webhook, team, memberships, system key). If a response that declares `data` arrives without it, stackql prints `error processing response: unknown key data` after the (successful) write; the live API returned `data` on every write exercised.

## 4. The Accept header and API version 2

The spec declares an `Accept` header parameter on every operation: `application/json` on 157, `application/json;version=2` on the 22 connection and destination operations. The Go SDK sends `version=2` for the same services.

It is not expressible, and it does not matter today:

- stackql always sends the declared response media type as `Accept`. With the parameter kept and its default in place (any-sdk prefills header parameters from their schema default), the mock still received `Accept: application/json`.
- Direct calls to the live API with `application/json`, `application/json;version=2`, `*/*` and no `Accept` returned byte-identical bodies for a connection and a destination read.

All 179 parameters are removed, so no method shows an `Accept` parameter. If the vendor ever makes the versions diverge, this is the finding to revisit.

## 5. Pagination: one configuration for the whole provider

Cursor pagination is uniform: `cursor` and `limit` query parameters in, `data.next_cursor` out. 32 collections declare it. It is configured once per service document (`x-stackQL-config.pagination`, from the Makefile's `SERVICE_CONFIG`): request token `cursor` in the query, response token `$.data.next_cursor` in the body. The response token path is absolute, not relative to the object key.

stackql reads at most 20 pages per query by default (`--http.response.pageLimit`, any value <= 0 removes the cap): 2,000 rows at the API's default page size, 20,000 at `"limit" = 1000`.

Proven on the mock (page size 2: groups 3 rows in 2 calls, connector types 5 rows in 3 calls) and live (792 connector types in 8 calls at the default page size of 100). `limit` accepts 1 to 1000; `WHERE "limit" = 1000` is the way to spend fewer calls. Four collections declare no `cursor` parameter: the two external secrets manager entity reads, the connection warnings, and the public connector metadata (a bare array).

### Predicate pushdown, and why LIMIT is not pushed down

Filters the API supports are declared query parameters and travel as such: `group_id` and `"schema"` on connections, `active`, `user_type` and `has_api_key` on users, `group_id`, `project_id` and `type` on transformations, `service` and `name` on package metadata, `duration`, `start_time` and `end_time` on sync history, `esm_id` and `type` on secrets manager entities, and `"limit"` everywhere a cursor exists. Everything else is filtered client-side. The API has no filter expression, projection or ordering parameter, so `queryParamPushdown` `filter`, `select` and `orderBy` have nothing to map to.

`queryParamPushdown.top` (SQL `LIMIT` -> the `limit` parameter) was tried on the mock and rejected. stackql pages to exhaustion whether or not a `LIMIT` is present, so pushing `LIMIT 1` down makes the page size 1 and multiplies the calls:

| Statement on a 5-row collection | Calls without pushdown | Calls with `top` pushdown |
|---|---|---|
| `SELECT id FROM ...connector_types` | 3 (mock page size 2) | 3 |
| `... LIMIT 1` | 3 | 5 (`limit=1` on every page) |
| `... WHERE type = 'Database' LIMIT 1` | 3 | 5 |
| `... WHERE "limit" = 4 LIMIT 3` | 2 (`limit=4`) | 2 (`limit=3`, the explicit value overridden) |

Against the live catalogue (792 rows) `LIMIT 1` would be 792 calls instead of 8, which is more than the hourly allowance. It also sent `limit` to operations that do not declare it. `LIMIT` stays client-side; `WHERE "limit" = n` is the page-size control.

## 6. Rate limit: 500 calls per rolling hour

The account used for the build allows 500 API calls in a rolling one-hour window (`x-rate-limit: 500`, `x-rate-limit-remaining`; a 429 carries `retry-after` in seconds and the body `{"code":"TooManyRequests","message":"Max 500 api calls allowed in one-hour rolling time period"}`). Whether the figure differs by plan is not established.

This was learned the hard way: the third consecutive smoke run exhausted the window half way through and could not delete what it had just created. The harness therefore:

- asks the API for `x-rate-limit-remaining` before it starts (one direct call) and refuses to start a run it could not finish (140 calls for a full run, 50 read-only, 25 cleanup);
- stops at the first 429 instead of carrying on;
- reads the connector catalogue at `"limit" = 500` (2 calls, still follows the cursor) instead of the default page size (8 calls), and the package metadata at `"limit" = 1000` (1 call). An early version read it with `"limit" = 5`, taking that for a row cap; it is the page size, so the read cost up to 20 calls a run.

A full run is about 100 calls. Four full runs in an hour do not fit.

## 7. Authentication

HTTP basic authentication with the API key as username and the API secret as password. The provider reads `FIVETRAN_APIKEY` and `FIVETRAN_APISECRET`, the names the Terraform provider reads (`os.Getenv` in `fivetran/framework/provider.go`). The provider published in the stackql registry before this build read `FIVETRAN_API_KEY` and `FIVETRAN_API_SECRET`; the rename is a breaking change, accepted for Terraform parity.

`valuePrefix: 'Basic '` is set explicitly: without it any-sdk sends the scheme in upper case. The mock rejects anything but `Authorization: Basic base64(key:secret)` and the suite asserts the header and the 401.

## 8. snake_case surface

The wire is snake_case in request and response bodies. Two corners are not:

- **Path parameters** are camelCase in the spec (`connectionId`, `groupId`, ...). A path parameter's name never reaches the wire, so `bin/split.mjs` renames them all to snake_case in the path keys and declarations. Three names are also unified so that one entity has one key: `DELETE /v1/users/{id}` uses `user_id` like its siblings (the two upstream path items merge into one), and the columns read uses `schema_name` and `table_name` like the schema and table edits beside it.
- **One query parameter** is camelCase: `groupId` on the hybrid deployment agent list. It is a wire name, so it stays, and `request.nativeCasing: camel` on that method lets `WHERE group_id = ...` resolve to it (proven on the wire).

`snake_case_aliases: true` is set on the provider so that stackql and the generated docs present that parameter as `group_id`. There are no camelCase response properties in the spec (checked across every schema), so the setting changes nothing else.

## 9. Keyword columns

`schema` (connections), `start` and `end` (sync history) and the `limit` parameter are parser keywords. They work double-quoted: `"schema"`, `"start"`, `"end"`, `"limit"`. Unquoted they are a syntax error. `status`, `type`, `role`, `name`, `config` and `state` need no quoting. As an EXEC argument the name is fine unquoted (`@schema = ...`, proven on the wire).

docgen writes the method examples from the column and parameter names, unquoted, and lists `cursor` among the optional parameters. `website/scripts/sanitize-docs.mjs` quotes the four keywords in select lists and predicates (42 places) and drops the `cursor` predicate (32 places) so the examples run as written.

## 10. Engine typing of statement values

As the supabase build found, on stackql v0.12.718:

- `INSERT ... SELECT 'x', true, 1440, '{"a": 1}'` sends typed JSON: booleans, numbers, and JSON-shaped strings as objects or arrays.
- `UPDATE ... SET paused = 'false', sync_frequency = 720` sends both as strings. The live API coerces them (`sync_frequency` came back as 720, `paused` as false).
- `EXEC ... @name = true` is a parser error; EXEC takes strings and numbers, and JSON-shaped strings become objects. A value whose type does not match the declared schema (a number for the `expiration_period` enum) results in no request being sent and no error being printed, so the smoke and integration suites assert on the wire call, not on the absence of an error.

## 11. List rows are summaries on five resources

stackql projects the columns of the method it routes to. On five resources the collection returns fewer properties than the single read, so a column can exist in `DESCRIBE` and be "no such column" on the list:

| Resource | Only on the single read |
|---|---|
| `destinations.destinations` | `config`, `setup_tests`, `external_secrets_keys_config` |
| `external_logging.log_services` | `config`, `setup_tests` |
| `metadata.connector_types` | `config`, `auth`, `external_secrets_keys_config` |
| `transformations.transformation_projects` | `status`, `errors`, `setup_tests`, `project_config` |
| `networking.proxy_agents` | `usage` (the list has `connector_count`, `destination_count` instead) |

Connections do not have this split: the list carries `config` and `status`. The docs state it; the resources are not split, because the entity is the same.

## 12. Mapping decisions

15 services, 45 resources, 176 methods (71 SELECT, 28 INSERT, 23 UPDATE, 29 DELETE, 25 EXEC); 3 operations skip-coded. Rules are in `map_operations.mjs`; `all_services.csv` is the record.

- **Lifecycle actions are methods of the resource they act on**, so the resource stays selectable: `connections.sync`, `resync`, `move`, `run_setup_tests`, `create_connect_card`; `destinations.run_setup_tests`; `transformations.run`, `cancel`, `upgrade_package`; `system_keys.rotate`; `api_keys.rotate`; `agents.re_auth`, `reset_credentials`; `proxy_agents.regenerate_secrets`; `webhooks.test`; `schema_configs.reload`, `drop_columns`, `resync_tables`.
- **`remove_account_role` is EXEC**, not DELETE: `DELETE /v1/users/{id}/role` removes the account-level role and leaves the user (or team). Confirmed live on a team (`role` is null afterwards).
- **Schema configuration is one resource with three UPDATE methods** routed by signature: `update` (`connection_id`), `update_schema` (+ `schema_name`), `update_table` (+ `table_name`). They edit the document the `schema_configs` read returns. Column edits are `columns.update` / `columns.delete`, next to the columns read.
- **Webhooks have two INSERT methods** routed by signature: `create_account_webhook`, and `create_group_webhook` when `group_id` is supplied. Confirmed live.
- **Memberships** are `connection_memberships`, `group_memberships` and `user_memberships` under `users` and `teams`; the body names the member `id` (or `user_id`), the path names the owner.
- **Two entity reads** on external secrets managers: `entities.list` (account-wide, optional `esm_id` filter) and `entities.list_by_esm` (path-scoped).
- **Non-selectable resources: 2.** `certificates.certificates` is the deprecated account-level approve, which takes the owner in its body and has no read. `hybrid_deployment.hvr_hubs` is the HVR hub registration. Neither has a resource to attach to.
- **Skip codes (3):** `multipart_package_upload` (Connector SDK package create and update take `multipart/form-data` with a binary file part; any-sdk has no multipart request support, and the Connector SDK CLI is the upload path), `binary_package_download` (the package download returns the package bytes; the spec declares it as `application/json` with an empty schema). The download could be bound with the octet-stream response transform the `aws.s3.objects` read uses (`overrideMediaType` plus a template wrapping the body in one column), but the real content type could not be observed - the account has no package and creating one needs the multipart upload - so it is left skipped rather than bound on a guess.
- **PATCH maps as UPDATE.** The API has no PUT. Nothing maps as REPLACE.

## 13. In the spec, not served

Three operations answer a route-level `404 {"code":"NotFound","message":"HTTP 404 Not Found"}` on the live API for the account used, by direct call as well as through the provider: `GET /v1/users/api-keys`, `GET /v1/users/{userId}/api-keys` and `GET /v1/connections/{connectionId}/warnings`. They stay mapped (`users.api_keys`, `connections.warnings`); the presumption is a staged rollout or plan gating. The smoke suite does not read them.

`GET /v1/connections/{id}/state` answers 400 for anything but a Function or Connector SDK connection, by design. `GET /v1/external-logging/account` and `GET /v1/connections/{id}/schemas` answer 404 until the object exists.

## 14. What costs money, and what the smoke suite does about it

Fivetran bills on monthly active rows: data moved by a sync. Control-plane objects are free. The smoke suite creates a connection **paused, with setup tests off, in a group whose destination is a placeholder that is never connected**, and never calls `sync` or `resync`. Its other objects (group, webhooks, team and memberships, system key, proxy agent) are free. Cost of a run: nothing. A connection can be created in a group that has no destination at all (confirmed live).

Creating a destination has a side effect: Fivetran adds a `fivetran_log` connection (the Fivetran Platform Connector, `connected_by: _fivetran_system`, schema `fivetran_metadata`) to the group. Observed live: it is created paused and had never synced; deleting the destination removes it, after which the group can be deleted. The suite does not address it directly. The sweep deletes every connection in a `stackql_smoke_*` group before the destination and the group, so an interrupted run is recoverable either way.

Things the suite deliberately does not do: invite a user (`users.create` sends an email), run connection setup tests, run a transformation, create a private link or a hybrid deployment agent.

## 15. The previously published provider

A `fivetran` provider built from an older spec is in the stackql registry (latest version `v23.04.00132`; 9 services, `connectors` naming, method names taken from the vendor's operationIds, `FIVETRAN_API_KEY` / `FIVETRAN_API_SECRET`). The vendor has since renamed connectors to connections throughout the API. This build replaces it; service, resource, method and parameter names and the credential variable names all change. `all_services.csv` starts the stable record from this build. Until this build is published, `make smoke-live` runs against the old provider and fails.

## Testing requirements

Four layers, in order:

1. `make test-offline` - 48 checks over the provider documents and `SHOW` / `DESCRIBE` against the local file registry, then 11 checks of the mapping stability check itself against fixtures (a moved, renamed, re-verbed, re-keyed, skipped or removed operation fails; an addition or a path change passes).
2. `make test-integration` - 76 row-level and wire-level checks against `tests/integration/mock_fivetran_server.mjs`, then every SQL statement in the landing page and the README run against the mock (`run_docs_examples.mjs`).
3. `make test-meta` - the meta-route walk: 15 services, 45 resources, 176 methods.
4. `make smoke` / `smoke-live` / `smoke-read-only` / `smoke-cleanup` - live, 89 checks in a full run, everything named `stackql_smoke_<stamp>`, breadcrumbs swept before and after, budget checked first.

Never against a production account.
