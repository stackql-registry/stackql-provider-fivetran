# StackQL fivetran (Fivetran REST API) provider build pipeline.
#
# Every step is deterministic and re-runnable; manual mapping decisions live
# in provider-dev/scripts, never in hand-edited artifacts. `make all` runs
# the full chain: fetch/verify the spec pin -> inventory -> split service
# specs -> mappings (+ stability check against the committed
# all_services.csv) -> pre-normalize -> normalize -> generate -> post-process
# -> offline + integration + meta-route tests -> docs -> website build.
# `make smoke` (live, needs credentials) is separate so `all` never touches
# a real account.
#
# Requirements: Node >= 20, GNU make, a stackql binary ($STACKQL, ./stackql
# or on PATH), Python 3 (a venv with pystackql is created on demand for the
# smoke suite), yarn for the website. Runs under Linux / WSL / macOS.
#
# Live credentials for the smoke suite (never committed - .env is
# gitignored; `make smoke` sources it if present). The names are the
# Terraform provider's:
#   FIVETRAN_APIKEY      API key
#   FIVETRAN_APISECRET   API secret

SHELL := bash
.DEFAULT_GOAL := help

PROVIDER := fivetran
SOURCE_PROJECT ?= https://github.com/stackql-registry/stackql-provider-$(PROVIDER)
SERVICES_DIR := provider-dev/openapi/src/$(PROVIDER)
# The server (https://api.fivetran.com, fixed) is the single source of truth
# in provider-dev/config/servers.json - shared by bin/split.mjs and this file.
SERVERS := provider-dev/config/servers.json
# HTTP basic auth from the API key and secret (the Terraform provider's
# variable names). snake_case_aliases presents the one camelCase wire name
# (the groupId query parameter, paired with request.nativeCasing: camel on
# its method, set in post_process) as snake_case.
PROVIDER_CONFIG := {"auth": {"type": "basic", "valuePrefix": "Basic ", "username_var": "FIVETRAN_APIKEY", "password_var": "FIVETRAN_APISECRET"}, "snake_case_aliases": true}
# Cursor pagination is uniform across the API (cursor query parameter in,
# data.next_cursor out), so it is configured once per service document.
SERVICE_CONFIG := {"pagination": {"requestToken": {"key": "cursor", "location": "query"}, "responseToken": {"key": "$$.data.next_cursor", "location": "body"}}}
VENV := .venv
PY := $(VENV)/bin/python
ENV_FILE := .env

.PHONY: help deps fetch-spec refresh-spec inventory split mappings check-mappings pre-normalize normalize generate post-process build \
        test-offline test-integration test-meta test smoke smoke-live smoke-read-only smoke-cleanup venv \
        docs website website-start clean all

help: ## show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'

deps: ## install node dependencies (latest @stackql/provider-utils per package.json range)
	npm install

# ---------------------------------------------------------------- pipeline

fetch-spec: ## download the Fivetran spec and verify it against the pin (fails on drift)
	npm run fetch-spec

refresh-spec: ## download the spec and ACCEPT the upstream change (rewrites the pin - review the diff)
	npm run fetch-spec -- --update

inventory: ## build provider-dev/config/endpoint_inventory.csv from the pinned spec
	npm run build-inventory

split: ## split the pinned spec into per-service specs (snake_case path parameters)
	npm run split -- --provider-name $(PROVIDER) --overwrite

mappings: ## regenerate all_services.csv, apply the deterministic mappings, check them against the committed baseline
	rm -f provider-dev/config/all_services.csv
	npm run generate-mappings -- --provider-name $(PROVIDER) --input-dir provider-dev/source --output-dir provider-dev/config
	npm run map-operations
	$(MAKE) check-mappings

check-mappings: ## fail if a committed operation -> resource.method mapping changed (ALLOW_BREAKING_MAPPING_CHANGES=1 accepts)
	npm run check-mappings

pre-normalize: ## fivetran-specific spec checks and adjustments (name collisions, placeholder examples)
	node provider-dev/scripts/pre_normalize.mjs

normalize: ## generic provider-utils normalize pass (allOf flatten, opaque objects, ...)
	npm run normalize -- --api-dir provider-dev/source

generate: ## generate the provider (basic auth, cursor pagination, naive request body translate)
	rm -rf provider-dev/openapi/*
	npm run generate-provider -- \
	  --provider-name $(PROVIDER) \
	  --input-dir provider-dev/source \
	  --output-dir $(SERVICES_DIR) \
	  --config-path provider-dev/config/all_services.csv \
	  --servers $(SERVERS) \
	  --provider-config '$(PROVIDER_CONFIG)' \
	  --service-config '$(SERVICE_CONFIG)' \
	  --naive-req-body-translate \
	  --overwrite
	$(MAKE) post-process

post-process: ## re-apply generated-provider fixes (object keys on writes, casing) and verify servers and pagination
	node provider-dev/scripts/post_process.mjs

build: fetch-spec inventory split mappings pre-normalize normalize generate ## full spec -> provider pipeline

# ------------------------------------------------------------------- tests

test-offline: ## offline validation against the local file registry (SHOW / DESCRIBE), and the mapping stability check's own tests
	node tests/offline_validation.mjs
	node tests/mapping_stability_test.mjs

test-integration: ## row-level integration tests against the mock Fivetran API, then every documentation example
	node tests/integration/run_integration_tests.mjs
	node tests/integration/run_docs_examples.mjs

test-meta: ## meta-route suite against a local stackql server
	npm run start-server
	npm run test-meta-routes -- $(PROVIDER) || (npm run stop-server; exit 1)
	npm run stop-server

test: test-offline test-integration test-meta ## all non-live test layers

$(VENV)/bin/activate:
	python3 -m venv $(VENV)
	$(VENV)/bin/pip install --quiet --upgrade pip pystackql

venv: $(VENV)/bin/activate ## create the python venv with pystackql for the smoke suite

# `make smoke` sources .env when present so a developer checkout works
# without exporting anything; CI sets the variables from secrets.
with_env = set -a; [ -f $(ENV_FILE) ] && source <(tr -d '\r' < $(ENV_FILE)); set +a;

smoke: venv ## live smoke suite with the locally generated provider - reads + free write lifecycles (needs credentials)
	@$(with_env) $(PY) tests/smoke_test.py

smoke-live: venv ## live smoke suite against the PUBLISHED provider in the stackql registry (post-publish verification)
	@$(with_env) $(PY) tests/smoke_test.py --live

smoke-read-only: venv ## live read smokes only, no writes
	@$(with_env) $(PY) tests/smoke_test.py --read-only

smoke-cleanup: venv ## sweep stackql_smoke_* groups, webhooks, teams and system keys and exit
	@$(with_env) $(PY) tests/smoke_test.py --cleanup-only

# -------------------------------------------------------------------- docs

docs: ## generate the website docs, then sanitize
	npm run generate-docs -- \
	  --provider-name $(PROVIDER) \
	  --provider-dir ./$(SERVICES_DIR)/v00.00.00000 \
	  --output-dir ./website \
	  --provider-data-dir ./provider-dev/docgen/provider-data 	  --snake-case-aliases \
	  --source-project $(SOURCE_PROJECT)
	node website/scripts/sanitize-docs.mjs

website: ## build the docusaurus microsite (vendors shared config first)
	cd website && yarn install && yarn build

website-start: ## run the docusaurus dev server
	cd website && yarn install && yarn start

clean: ## remove generated artifacts (provider output, docs, website build, test registry copy)
	rm -rf provider-dev/openapi/* website/build website/.docusaurus website/docs/services tests/integration/.registry-tmp tests/integration/.registry-docs-tmp tests/integration/.registry-probe-tmp

all: deps build test docs website ## everything non-live: deps, pipeline, tests, docs, site build
