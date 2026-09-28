#!/usr/bin/env python3
"""pystackql smoke test for the fivetran (Fivetran REST API) stackql provider.

Exercises the salient resources against a real account: read smokes over the
control plane (account, users, roles, groups, destinations, connections,
connector metadata, teams, webhooks, system keys, transformations, networking,
logging) and free, self-cleaning write lifecycles, modelled on the resources
the Terraform provider documents first (fivetran_group, fivetran_destination,
fivetran_connector, fivetran_webhook, fivetran_team and its memberships):

  - group        INSERT ... RETURNING / SELECT / UPDATE / DELETE
  - destination  INSERT (setup tests off) / SELECT / UPDATE / DELETE
  - connection   INSERT (paused, setup tests off) / SELECT / UPDATE / DELETE
  - webhook      account and group scope: INSERT / UPDATE / EXEC test / DELETE
  - team         INSERT / UPDATE / group, connection and user memberships /
                 EXEC remove_account_role / DELETE
  - system key   INSERT / UPDATE / EXEC rotate / DELETE
  - proxy agent  INSERT / SELECT / DELETE

Cost: nothing. Fivetran bills on monthly active rows, and no step here moves
data: the connection is created paused with setup tests off, it is never
synced (no EXEC sync / resync), and the destination it would load into is a
placeholder that is never connected. Groups, webhooks, teams, system keys and
proxy agents are free objects.

Everything created is named `stackql_smoke_<stamp>`; before running, the
script sweeps breadcrumbs with that prefix so each run starts from a clean
slate. Nothing that the script did not create is modified.

Credentials come from the environment, exactly as the provider itself reads
them (the Terraform provider's variable names):

    export FIVETRAN_APIKEY=...
    export FIVETRAN_APISECRET=...

Rate limiting: the account is allowed 500 API calls in a rolling one-hour
window (`x-rate-limit: 500`; a 429 carries `retry-after`). A full run makes
about 100 calls, a read-only run about 35. Before anything else the harness
asks the API how much of the window is left (one direct call, reading
`x-rate-limit-remaining`) and refuses to start a run it could not finish -
a run that dies half way leaves objects behind. If a 429 arrives anyway the
run stops at once; `make smoke-cleanup` sweeps the leftovers once the window
has moved on.

pystackql provides and upgrades the stackql binary; the statements themselves
run through that binary directly so that stderr is inspected on every
statement. (Through pystackql's execute() an HTTP error on a SELECT comes
back as an empty result, which would let a failing read pass as "no rows".)

Never run this against a production account.

Usage:
    pip install pystackql
    python tests/smoke_test.py                 # local provider-dev/openapi registry (default)
    python tests/smoke_test.py --live          # the published provider in the stackql registry
    python tests/smoke_test.py --read-only     # read smokes only, no writes
    python tests/smoke_test.py --cleanup-only  # just sweep breadcrumbs
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
SMOKE_PREFIX = "stackql_smoke_"
INTER_REQUEST_DELAY_S = 0.3
API_BASE = "https://api.fivetran.com"
# API calls a run needs, with margin (the account allows 500 per rolling hour)
CALLS_FULL_RUN = 140
CALLS_READ_ONLY = 50
CALLS_CLEANUP = 25
# INSERT / UPDATE ... RETURNING through a response objectKey, server-level
# pagination config and the casing aliases all predate this; it is the
# version the sibling providers require. pystackql manages its own stackql
# binary, so the harness upgrades it when older.
MIN_STACKQL_VERSION = (0, 10, 601)

ERROR_RE = re.compile(
    r"http response status code: [45]|over HTTP error|error assembling|"
    r"cannot find matching operation|FindRoute|no matching operation|"
    r"cannot find any viable servers|parser error|panic|error processing response|"
    r"no request body for operation|schema unsuitable|Unauthorized|Forbidden|"
    r"sql packet preparation error|SQL logic error|no such column|syntax error|"
    r"cannot resolve|not found in|disallowed",
    re.I,
)
RATE_LIMIT_RE = re.compile(r"status code: 429|Too Many Requests|TooManyRequests", re.I)


class RateLimited(Exception):
    """The API answered 429: the run stops, nothing further is attempted."""


class Smoke:
    def __init__(self, args: argparse.Namespace) -> None:
        self.args = args
        self.stamp = str(int(time.time()))[-6:]
        self.name = f"{SMOKE_PREFIX}{self.stamp}"
        self.results: list[tuple[str, str, str]] = []
        self.requests = 0
        self.user_id = ""

        for var in ("FIVETRAN_APIKEY", "FIVETRAN_APISECRET"):
            if not os.environ.get(var):
                sys.exit(f"{var} is not set - see the module docstring")

        from pystackql import StackQL

        # pystackql supplies (and upgrades) the binary; see the docstring for
        # why the statements do not go through its execute()
        self.sq = StackQL(output="dict")
        self.ensure_stackql_version()
        self.registry_args: list[str] = []
        if not args.live:
            reg_path = (BASE_DIR / "provider-dev" / "openapi").resolve()
            registry = {"url": "file://" + reg_path.as_posix(), "localDocRoot": reg_path.as_posix(), "verifyConfig": {"nopVerify": True}}
            self.registry_args = ["--registry", json.dumps(registry, separators=(",", ":"))]
        else:
            print("pulling the published fivetran provider from the stackql registry")
            out, err = self.run("REGISTRY PULL fivetran")
            print(f"  {(out or err).splitlines()[-1] if (out or err) else 'pulled'}")

    def ensure_stackql_version(self) -> None:
        def parse(v: str) -> tuple[int, ...]:
            return tuple(int(x) for x in re.findall(r"\d+", str(v))[:3])

        current = parse(getattr(self.sq, "version", "") or "")
        if current and current >= MIN_STACKQL_VERSION:
            return
        print(f"stackql {self.sq.version} at {self.sq.bin_path} is older than "
              f"v{'.'.join(map(str, MIN_STACKQL_VERSION))} - upgrading pystackql's binary")
        self.sq.upgrade(showprogress=False)
        if parse(self.sq.version) < MIN_STACKQL_VERSION:
            sys.exit(f"stackql {self.sq.version} is still too old after upgrade")

    # ------------------------------------------------------------ API budget
    def api_budget(self) -> tuple[int | None, str]:
        """Calls left in the rolling window, from one direct request."""
        token = base64.b64encode(f"{os.environ['FIVETRAN_APIKEY']}:{os.environ['FIVETRAN_APISECRET']}".encode()).decode()
        req = urllib.request.Request(f"{API_BASE}/v1/account/info", headers={"Authorization": f"Basic {token}", "Accept": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                remaining = resp.headers.get("x-rate-limit-remaining")
                return (int(remaining) if remaining is not None else None), ""
        except urllib.error.HTTPError as exc:
            if exc.code == 429:
                return 0, f"retry-after {exc.headers.get('retry-after', '?')}s"
            return None, f"HTTP {exc.code}"
        except (urllib.error.URLError, TimeoutError, ValueError) as exc:
            return None, str(exc)

    def require_budget(self, needed: int) -> None:
        if self.args.live and os.environ.get("FIVETRAN_SMOKE_SKIP_BUDGET_CHECK"):
            return
        remaining, detail = self.api_budget()
        if remaining is None:
            print(f"API budget: could not be read ({detail}) - continuing")
            return
        print(f"API budget: {remaining} calls left in the rolling hour, this run needs up to {needed}")
        if remaining < needed:
            sys.exit(f"not enough API budget to finish the run ({remaining} < {needed}{', ' + detail if detail else ''}) - "
                     "nothing was started; retry when the rolling window has moved on")

    # ------------------------------------------------------------------ core
    def run(self, sql: str) -> tuple[str, str]:
        cmd = [self.sq.bin_path, "exec", sql, "--output", "json", *self.registry_args]
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=600, cwd=BASE_DIR, check=False)
        return proc.stdout.strip(), proc.stderr.strip()

    def q(self, sql: str):
        """Runs one statement. Returns (rows, error); error is None on success."""
        # serial pacing under the rate limit
        if self.requests:
            time.sleep(INTER_REQUEST_DELAY_S)
        self.requests += 1
        try:
            stdout, stderr = self.run(sql)
        except Exception as exc:  # noqa: BLE001
            return [], str(exc)
        text = f"{stderr}\n{stdout}"
        if RATE_LIMIT_RE.search(text):
            raise RateLimited(text.strip()[:300])
        rows: list = []
        if stdout.startswith(("[", "{")):
            try:
                parsed = json.loads(stdout)
                rows = parsed if isinstance(parsed, list) else [parsed]
            except ValueError:
                return [], f"unparseable output: {stdout[:200]}"
        elif ERROR_RE.search(stdout):
            return [], stdout
        # stderr also carries the status line of a successful statement
        # ("The operation was despatched successfully"), so only error
        # patterns fail it
        if ERROR_RE.search(stderr):
            return rows, stderr
        if rows and isinstance(rows[0], dict) and "error" in rows[0]:
            return rows, json.dumps(rows, default=str)
        return rows, None

    def step(self, name: str, sql: str, expect_rows: bool = False, contains: str | None = None):
        rows, err = self.q(sql)
        if err:
            self.results.append((name, "FAIL", err[:300]))
            print(f"  FAIL  {name}  [{err[:200]}]")
            return None
        blob = json.dumps(rows, default=str)
        if expect_rows and not rows:
            self.results.append((name, "FAIL", "expected rows, got none"))
            print(f"  FAIL  {name}  [no rows]")
            return None
        if contains and contains not in blob:
            self.results.append((name, "FAIL", f"'{contains}' not in result"))
            print(f"  FAIL  {name}  ['{contains}' not in {blob[:120]}]")
            return None
        self.results.append((name, "PASS", ""))
        print(f"  PASS  {name}")
        return rows

    def note(self, name: str, ok: bool, detail: str = "") -> None:
        self.results.append((name, "PASS" if ok else "FAIL", detail))
        print(f"  {'PASS' if ok else 'FAIL'}  {name}{('  [' + detail[:160] + ']') if detail and not ok else ''}")

    def returning_id(self, name: str, sql: str, key: str = "id") -> str:
        rows = self.step(name, sql, expect_rows=True)
        return str(rows[0].get(key) or "") if rows else ""

    # ------------------------------------------------------- breadcrumb sweep
    def sweep(self, label: str, list_sql: str, name_key: str, delete_sql, anywhere: bool = False) -> None:
        rows, err = self.q(list_sql)
        if err:
            print(f"  WARN {label} sweep list failed: {err[:140]}")
            return
        for r in rows or []:
            value = str(r.get(name_key, ""))
            if value.startswith(SMOKE_PREFIX) or (anywhere and SMOKE_PREFIX in value):
                print(f"  sweeping {label} {value} ({r.get('id')})")
                _, derr = self.q(delete_sql(r))
                if derr:
                    print(f"  WARN {label} sweep delete failed: {derr[:140]}")

    def cleanup_breadcrumbs(self) -> None:
        print("== breadcrumb sweep ==")
        # webhook urls carry the prefix in their path, not at the start
        self.sweep("webhook", "SELECT id, url FROM fivetran.webhooks.webhooks", "url",
                   lambda r: f"DELETE FROM fivetran.webhooks.webhooks WHERE webhook_id = '{r['id']}'", anywhere=True)
        self.sweep("team", "SELECT id, name FROM fivetran.teams.teams", "name",
                   lambda r: f"DELETE FROM fivetran.teams.teams WHERE team_id = '{r['id']}'")
        self.sweep("system key", "SELECT id, name FROM fivetran.account.system_keys", "name",
                   lambda r: f"DELETE FROM fivetran.account.system_keys WHERE key_id = '{r['id']}'")
        self.sweep("proxy agent", "SELECT id, display_name FROM fivetran.networking.proxy_agents", "display_name",
                   lambda r: f"DELETE FROM fivetran.networking.proxy_agents WHERE agent_id = '{r['id']}'")
        # groups last: their connections and destination go first
        rows, err = self.q("SELECT id, name FROM fivetran.groups.groups")
        if err:
            print(f"  WARN group sweep list failed: {err[:140]}")
            return
        for g in rows or []:
            if not str(g.get("name", "")).startswith(SMOKE_PREFIX):
                continue
            gid = g["id"]
            print(f"  sweeping group {g['name']} ({gid})")
            conns, cerr = self.q(f"SELECT id FROM fivetran.groups.connections WHERE group_id = '{gid}'")
            for c in ([] if cerr else conns or []):
                self.q(f"DELETE FROM fivetran.connections.connections WHERE connection_id = '{c['id']}'")
            self.q(f"DELETE FROM fivetran.destinations.destinations WHERE destination_id = '{gid}'")
            self.q(f"DELETE FROM fivetran.groups.groups WHERE group_id = '{gid}'")

    # -------------------------------------------------------------- read path
    def read_smokes(self) -> None:
        print("== read smokes ==")
        self.step("show services", "SHOW SERVICES IN fivetran", expect_rows=True, contains="connections")
        acct = self.step("account info", "SELECT account_id, account_name, user_id FROM fivetran.account.account_info", expect_rows=True)
        if acct:
            self.user_id = str(acct[0].get("user_id") or "")
        self.step("roles", "SELECT name, is_custom, scope FROM fivetran.account.roles", expect_rows=True, contains="Account Administrator")
        self.step("system keys", "SELECT id, name, expired_at FROM fivetran.account.system_keys")
        users = self.step("users", "SELECT id, email, role, verified, active FROM fivetran.users.users", expect_rows=True)
        if users and not self.user_id:
            self.user_id = str(users[0]["id"])
        if self.user_id:
            self.step("user get (WHERE user_id)", f"SELECT id, email, given_name, family_name, role FROM fivetran.users.users WHERE user_id = '{self.user_id}'", expect_rows=True, contains=self.user_id)
            self.step("user group memberships", f"SELECT id, role, created_at FROM fivetran.users.group_memberships WHERE user_id = '{self.user_id}'")
            self.step("user connection memberships", f"SELECT id, role, created_at FROM fivetran.users.connection_memberships WHERE user_id = '{self.user_id}'")
        groups = self.step("groups", "SELECT id, name, created_at FROM fivetran.groups.groups")
        if groups:
            gid = groups[0]["id"]
            self.step("group get (WHERE group_id)", f"SELECT id, name, created_at FROM fivetran.groups.groups WHERE group_id = '{gid}'", expect_rows=True, contains=gid)
            self.step("group users", f"SELECT id, email, role FROM fivetran.groups.users WHERE group_id = '{gid}'")
            self.step("group connections", f"SELECT id, service, \"schema\" FROM fivetran.groups.connections WHERE group_id = '{gid}'")
            self.step("connections filtered by group_id (query parameter pushdown)", f"SELECT id, service, paused FROM fivetran.connections.connections WHERE group_id = '{gid}'")
        dests = self.step("destinations", "SELECT id, group_id, service, region, setup_status FROM fivetran.destinations.destinations")
        if dests:
            self.step("destination get (config addressed with json_extract)", f"SELECT id, service, time_zone_offset, json_extract(config, '$.project_id') AS project_id FROM fivetran.destinations.destinations WHERE destination_id = '{dests[0]['id']}'", expect_rows=True)
        self.step("connections", "SELECT id, group_id, service, \"schema\", paused, sync_frequency, json_extract(status, '$.setup_state') AS setup_state, json_extract(status, '$.sync_state') AS sync_state FROM fivetran.connections.connections")
        # limit 500: the catalogue (about 800 types) arrives in two pages, so
        # the cursor is followed live for two calls, not eight
        types = self.step("connector types (cursor pagination, 500 per page)", "SELECT id, name, type, connector_class FROM fivetran.metadata.connector_types WHERE \"limit\" = 500", expect_rows=True, contains="google_sheets")
        if types is not None:
            self.note("connector types span more than one page (> 500 rows)", len(types) > 500, f"{len(types)} rows")
        self.step("connector type get (WHERE service)", "SELECT id, name, type, link_to_docs FROM fivetran.metadata.connector_types WHERE service = 'google_sheets'", expect_rows=True, contains="google_sheets")
        self.step("public connector types (unauthenticated path)", "SELECT id, name, type FROM fivetran.metadata.public_connector_types", expect_rows=True)
        self.step("teams", "SELECT id, name, description, role FROM fivetran.teams.teams")
        self.step("webhooks", "SELECT id, type, group_id, url, active, events FROM fivetran.webhooks.webhooks")
        self.step("transformations", "SELECT id, status, paused, created_at FROM fivetran.transformations.transformations")
        # list rows are summaries on this resource: status, errors and
        # project_config are columns of the single read only
        self.step("transformation projects", "SELECT id, type, group_id, created_at FROM fivetran.transformations.transformation_projects")
        # "limit" is the page size, not a row cap: stackql pages to exhaustion,
        # so a small value multiplies the calls. 1000 makes this one call.
        self.step("quickstart package metadata (one page of 1000)", "SELECT id, name, version FROM fivetran.transformations.package_metadata WHERE \"limit\" = 1000", expect_rows=True)
        self.step("private links", "SELECT id, name, region, service FROM fivetran.networking.private_links")
        self.step("proxy agents", "SELECT id, display_name, region FROM fivetran.networking.proxy_agents")
        self.step("hybrid deployment agents", "SELECT id, display_name, group_id FROM fivetran.hybrid_deployment.agents")
        self.step("log services", "SELECT id, service, enabled FROM fivetran.external_logging.log_services")
        self.step("external secrets managers", "SELECT id, name, type FROM fivetran.external_secrets_managers.secrets_managers")
        self.step("external secrets manager entities", "SELECT id, type FROM fivetran.external_secrets_managers.entities")
        self.step("connector sdk packages", "SELECT * FROM fivetran.connector_sdk.packages")
        _, err = self.q("SELECT name FROM fivetran.groups.groups WHERE group_id = 'stackql_smoke_no_such_group'")
        self.note("404 surfaced with the vendor's error code (NotFound_Group)", bool(err) and "404" in err and "NotFound_Group" in err, err or "no error")

    # ------------------------------------------------------------- write path
    def group_estate_lifecycle(self) -> None:
        name = self.name
        print(f"== group / destination / connection lifecycle ({name}) ==")
        gid = self.returning_id("group INSERT ... RETURNING", f"INSERT INTO fivetran.groups.groups (name) SELECT '{name}' RETURNING id, name, created_at")
        if not gid:
            return
        try:
            self.step("group get", f"SELECT id, name FROM fivetran.groups.groups WHERE group_id = '{gid}'", expect_rows=True, contains=name)
            self.step("group UPDATE ... RETURNING (name)", f"UPDATE fivetran.groups.groups SET name = '{name}_b' WHERE group_id = '{gid}' RETURNING id, name", expect_rows=True, contains=f"{name}_b")
            self.step("group ssh public key", f"SELECT public_key FROM fivetran.groups.ssh_public_keys WHERE group_id = '{gid}'", expect_rows=True, contains="ssh-rsa")
            self.step("group service account", f"SELECT service_account FROM fivetran.groups.service_accounts WHERE group_id = '{gid}'", expect_rows=True)
            self.step("group users", f"SELECT id, email, role FROM fivetran.groups.users WHERE group_id = '{gid}'", expect_rows=True)

            # destination: a placeholder that is never connected (setup tests off)
            config = json.dumps({"host": "stackql-smoke.example.com", "port": 5432, "database": "smoke", "user": "smoke", "password": f"smoke-{self.stamp}", "connection_type": "Directly"})
            did = self.returning_id(
                "destination INSERT ... RETURNING (config as a JSON object, setup tests off)",
                f"INSERT INTO fivetran.destinations.destinations (group_id, service, region, time_zone_offset, run_setup_tests, config) "
                f"SELECT '{gid}', 'postgres_rds_warehouse', 'GCP_US_EAST4', '0', false, '{config}' RETURNING id, service, region, setup_status")
            if did:
                self.step("destination get", f"SELECT id, group_id, service, setup_status, json_extract(config, '$.host') AS host FROM fivetran.destinations.destinations WHERE destination_id = '{did}'", expect_rows=True, contains="stackql-smoke.example.com")
                self.step("destination UPDATE ... RETURNING (time_zone_offset, setup tests off)", f"UPDATE fivetran.destinations.destinations SET time_zone_offset = '+10', run_setup_tests = 'false' WHERE destination_id = '{did}' RETURNING id, time_zone_offset", expect_rows=True, contains="+10")

            # connection: created paused, setup tests off, never synced
            conn_config = json.dumps({"schema": name, "table": "events"})
            cid = self.returning_id(
                "connection INSERT ... RETURNING (paused, setup tests off)",
                f"INSERT INTO fivetran.connections.connections (group_id, service, paused, run_setup_tests, config) "
                f"SELECT '{gid}', 'webhooks', true, false, '{conn_config}' RETURNING id, service, \"schema\", paused")
            if cid:
                try:
                    self.step("connection get", f"SELECT id, service, \"schema\", paused, sync_frequency, json_extract(status, '$.sync_state') AS sync_state FROM fivetran.connections.connections WHERE connection_id = '{cid}'", expect_rows=True, contains="paused")
                    rows = self.step("connection UPDATE ... RETURNING (sync_frequency, stays paused)", f"UPDATE fivetran.connections.connections SET sync_frequency = 1440, paused = 'true' WHERE connection_id = '{cid}' RETURNING id, sync_frequency, paused", expect_rows=True)
                    if rows:
                        self.note("connection UPDATE applied (the API coerces string-typed values)", str(rows[0].get("sync_frequency")) == "1440" and str(rows[0].get("paused")).lower() == "true", json.dumps(rows, default=str))
                    self.step("connections by group_id and schema (two query parameters pushed down)", f"SELECT id FROM fivetran.connections.connections WHERE group_id = '{gid}' AND \"schema\" = '{name}.events'", expect_rows=True, contains=cid)
                    self.step("group connections", f"SELECT id, service FROM fivetran.groups.connections WHERE group_id = '{gid}'", expect_rows=True, contains=cid)
                    self.step("connection sync history (empty - never synced)", f"SELECT sync_id, status FROM fivetran.connections.sync_history WHERE connection_id = '{cid}'")
                    self.step("connection certificates", f"SELECT hash, type FROM fivetran.certificates.connection_certificates WHERE connection_id = '{cid}'")
                    self.step("connection fingerprints", f"SELECT hash, public_key FROM fivetran.certificates.connection_fingerprints WHERE connection_id = '{cid}'")
                    self.team_lifecycle(gid, cid)
                    self.webhook_lifecycle(gid)
                finally:
                    self.step("connection DELETE", f"DELETE FROM fivetran.connections.connections WHERE connection_id = '{cid}'")
            if did:
                self.step("destination DELETE", f"DELETE FROM fivetran.destinations.destinations WHERE destination_id = '{did}'")
        finally:
            self.step("group DELETE", f"DELETE FROM fivetran.groups.groups WHERE group_id = '{gid}'")
            rows, err = self.q("SELECT id FROM fivetran.groups.groups")
            self.note("group gone after DELETE", not err and all(r.get("id") != gid for r in rows or []), err or "still listed")

    def webhook_lifecycle(self, gid: str) -> None:
        print("== webhook lifecycle (account and group scope) ==")
        url = f"https://example.com/{self.name}"
        wid = self.returning_id("account webhook INSERT ... RETURNING (inactive)", f"INSERT INTO fivetran.webhooks.webhooks (url, events, active, secret) SELECT '{url}', '[\"sync_start\",\"sync_end\"]', false, 'smoke-{self.stamp}' RETURNING id, type, url, active")
        if wid:
            self.step("webhook get", f"SELECT id, type, url, active, events FROM fivetran.webhooks.webhooks WHERE webhook_id = '{wid}'", expect_rows=True, contains="account")
            self.step("webhook UPDATE ... RETURNING (events)", f"UPDATE fivetran.webhooks.webhooks SET events = '[\"sync_end\"]', active = 'false' WHERE webhook_id = '{wid}' RETURNING id, events", expect_rows=True, contains="sync_end")
            self.step("webhook EXEC test", f"EXEC fivetran.webhooks.webhooks.test @webhook_id = '{wid}', @event = 'sync_end'")
            self.step("account webhook DELETE", f"DELETE FROM fivetran.webhooks.webhooks WHERE webhook_id = '{wid}'")
        gwid = self.returning_id("group webhook INSERT ... RETURNING (routed by group_id)", f"INSERT INTO fivetran.webhooks.webhooks (group_id, url, events, active) SELECT '{gid}', '{url}-group', '[\"sync_end\"]', false RETURNING id, type, group_id")
        if gwid:
            self.step("group webhook get", f"SELECT id, type, group_id FROM fivetran.webhooks.webhooks WHERE webhook_id = '{gwid}'", expect_rows=True, contains=gid)
            self.step("group webhook DELETE", f"DELETE FROM fivetran.webhooks.webhooks WHERE webhook_id = '{gwid}'")

    def team_lifecycle(self, gid: str, cid: str) -> None:
        name = self.name
        print(f"== team and membership lifecycle ({name}) ==")
        tid = self.returning_id("team INSERT ... RETURNING", f"INSERT INTO fivetran.teams.teams (name, description, role) SELECT '{name}', 'stackql smoke', 'Account Reviewer' RETURNING id, name, role")
        if not tid:
            return
        try:
            self.step("team UPDATE ... RETURNING (description)", f"UPDATE fivetran.teams.teams SET description = 'stackql smoke v2' WHERE team_id = '{tid}' RETURNING id, description", expect_rows=True, contains="v2")
            self.step("team group membership INSERT ... RETURNING", f"INSERT INTO fivetran.teams.group_memberships (team_id, id, role) SELECT '{tid}', '{gid}', 'Destination Reviewer' RETURNING id, role", expect_rows=True, contains=gid)
            self.step("team group membership get (two path parameters)", f"SELECT id, role FROM fivetran.teams.group_memberships WHERE team_id = '{tid}' AND group_id = '{gid}'", expect_rows=True, contains="Destination Reviewer")
            self.step("team group membership UPDATE ... RETURNING", f"UPDATE fivetran.teams.group_memberships SET role = 'Destination Analyst' WHERE team_id = '{tid}' AND group_id = '{gid}' RETURNING id, role", expect_rows=True, contains="Destination Analyst")
            self.step("team group memberships list", f"SELECT id, role FROM fivetran.teams.group_memberships WHERE team_id = '{tid}'", expect_rows=True)
            self.step("team connection membership INSERT ... RETURNING", f"INSERT INTO fivetran.teams.connection_memberships (team_id, id, role) SELECT '{tid}', '{cid}', 'Connector Reviewer' RETURNING id, role", expect_rows=True, contains=cid)
            self.step("team connection memberships list", f"SELECT id, role FROM fivetran.teams.connection_memberships WHERE team_id = '{tid}'", expect_rows=True, contains=cid)
            self.step("team connection membership DELETE", f"DELETE FROM fivetran.teams.connection_memberships WHERE team_id = '{tid}' AND connection_id = '{cid}'")
            self.step("team group membership DELETE", f"DELETE FROM fivetran.teams.group_memberships WHERE team_id = '{tid}' AND group_id = '{gid}'")
            if self.user_id:
                self.step("team user membership INSERT ... RETURNING", f"INSERT INTO fivetran.teams.user_memberships (team_id, user_id, role) SELECT '{tid}', '{self.user_id}', 'Team Member' RETURNING user_id, role", expect_rows=True, contains=self.user_id)
                self.step("team user memberships list", f"SELECT user_id, role FROM fivetran.teams.user_memberships WHERE team_id = '{tid}'", expect_rows=True, contains=self.user_id)
                self.step("team user membership DELETE", f"DELETE FROM fivetran.teams.user_memberships WHERE team_id = '{tid}' AND user_id = '{self.user_id}'")
            self.step("team EXEC remove_account_role", f"EXEC fivetran.teams.teams.remove_account_role @team_id = '{tid}'")
            rows = self.step("team get after remove_account_role", f"SELECT id, name, role FROM fivetran.teams.teams WHERE team_id = '{tid}'", expect_rows=True)
            if rows:
                self.note("team account role removed", rows[0].get("role") in (None, "", "null"), json.dumps(rows, default=str))
        finally:
            self.step("team DELETE", f"DELETE FROM fivetran.teams.teams WHERE team_id = '{tid}'")

    def system_key_lifecycle(self) -> None:
        name = self.name
        print(f"== system key lifecycle ({name}) ==")
        kid = self.returning_id("system key INSERT ... RETURNING (one week, read-only on destinations)", f"INSERT INTO fivetran.account.system_keys (name, expiration_period, permissions) SELECT '{name}', 'ONE_WEEK', '[{{\"resource_type\": \"DESTINATION\", \"access_level\": \"READ\"}}]' RETURNING id, name, expired_at")
        if not kid:
            return
        try:
            self.step("system key get", f"SELECT id, name, expired_at, permissions FROM fivetran.account.system_keys WHERE key_id = '{kid}'", expect_rows=True, contains="DESTINATION")
            self.step("system key UPDATE ... RETURNING (name)", f"UPDATE fivetran.account.system_keys SET name = '{name}_b' WHERE key_id = '{kid}' RETURNING id, name", expect_rows=True, contains=f"{name}_b")
            self.step("system key EXEC rotate", f"EXEC fivetran.account.system_keys.rotate @key_id = '{kid}', @expiration_period = 'ONE_WEEK'")
        finally:
            self.step("system key DELETE", f"DELETE FROM fivetran.account.system_keys WHERE key_id = '{kid}'")

    def proxy_agent_lifecycle(self) -> None:
        name = self.name
        print(f"== proxy agent lifecycle ({name}) ==")
        rows = self.step("proxy agent INSERT ... RETURNING", f"INSERT INTO fivetran.networking.proxy_agents (display_name, group_region) SELECT '{name}', 'GCP_US_EAST4' RETURNING agent_id, orchestrator_host", expect_rows=True)
        aid = str(rows[0].get("agent_id") or "") if rows else ""
        if not aid:
            return
        try:
            self.step("proxy agent get (enveloped on the wire)", f"SELECT id, display_name, region, registered_at FROM fivetran.networking.proxy_agents WHERE agent_id = '{aid}'", expect_rows=True, contains=name)
            self.step("proxy agent connections", f"SELECT connection_id FROM fivetran.networking.proxy_agent_connections WHERE agent_id = '{aid}'")
        finally:
            self.step("proxy agent DELETE", f"DELETE FROM fivetran.networking.proxy_agents WHERE agent_id = '{aid}'")

    # ---------------------------------------------------------------- summary
    def summary(self) -> int:
        print("\n== summary ==")
        counts = {"PASS": 0, "FAIL": 0}
        for name, status, note in self.results:
            counts[status] = counts.get(status, 0) + 1
            if status != "PASS":
                print(f"  {status:5s} {name}  [{note[:200]}]")
        print(f"  {counts['PASS']} passed, {counts['FAIL']} failed; {self.requests} statements, paced at {INTER_REQUEST_DELAY_S}s "
              f"(registry: {'public' if self.args.live else 'local'}); cost: nothing billable (no data moved)")
        return 1 if counts["FAIL"] else 0


def main() -> int:
    ap = argparse.ArgumentParser(description="fivetran provider smoke test")
    ap.add_argument("--live", action="store_true", help="run against the published provider in the stackql registry (default: the local provider-dev/openapi file registry)")
    ap.add_argument("--cleanup-only", action="store_true", help="sweep stackql_smoke_* breadcrumbs and exit")
    ap.add_argument("--read-only", action="store_true", help="read smokes only")
    args = ap.parse_args()

    smoke = Smoke(args)
    print(f"fivetran smoke test  registry={'public' if args.live else 'local'}  name={smoke.name}  stackql={smoke.sq.version}")
    smoke.require_budget(CALLS_CLEANUP if args.cleanup_only else CALLS_READ_ONLY if args.read_only else CALLS_FULL_RUN)
    try:
        if not args.read_only:
            smoke.cleanup_breadcrumbs()
        if args.cleanup_only:
            return 0
        smoke.read_smokes()
        if not args.read_only:
            smoke.group_estate_lifecycle()
            smoke.system_key_lifecycle()
            smoke.proxy_agent_lifecycle()
            smoke.cleanup_breadcrumbs()
    except RateLimited as exc:
        print(f"\nRATE LIMITED - run stopped after {smoke.requests} statements: {exc}")
        print("objects created by this run may still exist; run `make smoke-cleanup` once the rolling window has moved on")
        smoke.summary()
        return 2
    return smoke.summary()


if __name__ == "__main__":
    sys.exit(main())
