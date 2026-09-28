--- 
title: connections
hide_title: false
hide_table_of_contents: false
keywords:
  - connections
  - connections
  - fivetran
  - infrastructure-as-code
  - configuration-as-data
  - cloud inventory
description: Query, deploy and manage fivetran resources using SQL
custom_edit_url: null
image: /img/stackql-fivetran-provider-featured-image.png
---

import CopyableCode from '@site/src/components/CopyableCode/CopyableCode';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Creates, updates, deletes, gets or lists a <code>connections</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="connections" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.connections.connections" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

<Tabs
    defaultValue="get"
    values={[
        { label: 'get', value: 'get' },
        { label: 'list', value: 'list' }
    ]}
>
<TabItem value="get">

<table>
<thead>
    <tr>
    <th>Name</th>
    <th>Datatype</th>
    <th>Description</th>
    </tr>
</thead>
<tbody>
<tr>
    <td><CopyableCode code="id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of this connection. Use this value as the `connectionId` path parameter when calling other Connections API endpoints, such as &#91;Retrieve Connection Details&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/connection-details) or &#91;Sync Connection Data&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/sync-connection). (example: connection_id)</td>
</tr>
<tr>
    <td><CopyableCode code="external_secrets_manager_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the &#91;External Secrets Manager&#93;(https:​//fivetran.com/docs/rest-api/api-reference/external-secrets-managers) instance. Connector service must &#91;support&#93;(https:​//fivetran.com/docs/core-concepts/features/external-secret-managers#connectors) External Secrets Manager feature to use this field. (example: esm_id)</td>
</tr>
<tr>
    <td><CopyableCode code="group_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the destination group this connection belongs to. Use this value with the &#91;List All Groups&#93;(https:​//fivetran.com/docs/rest-api/api-reference/groups/list-all-groups) or &#91;Retrieve Group Details&#93;(https:​//fivetran.com/docs/rest-api/api-reference/groups/group-details) endpoints. (example: group_id)</td>
</tr>
<tr>
    <td><CopyableCode code="hybrid_deployment_agent_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the hybrid deployment agent within the Fivetran system. If not specified, the agent ID from the destination will be used (example: agent_id)</td>
</tr>
<tr>
    <td><CopyableCode code="private_link_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the self-served private link that is used by the connection (example: link_id)</td>
</tr>
<tr>
    <td><CopyableCode code="proxy_agent_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the proxy agent within the Fivetran system (example: agent_id)</td>
</tr>
<tr>
    <td><CopyableCode code="config" /></td>
    <td><code>object</code></td>
    <td>The `config` object for the `service` in question (a JSON value; its keys depend on the `service`). The accepted keys per type are documented in the vendor's API reference and returned by the connector metadata endpoints.</td>
</tr>
<tr>
    <td><CopyableCode code="connect_card" /></td>
    <td><code>object</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="connect_card_config" /></td>
    <td><code>object</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="connected_by" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the user who created this connection. `null` if the connection was created programmatically without a user context. Use this value with the &#91;Retrieve User Details&#93;(https:​//fivetran.com/docs/rest-api/api-reference/users/user-details) endpoint. (example: priceless_odour)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp of the time the connection was created in your account (example: 2023-12-01T15:43:29.013729Z)</td>
</tr>
<tr>
    <td><CopyableCode code="daily_sync_time" /></td>
    <td><code>string</code></td>
    <td>The daily sync start time, in `HH:MM` format (UTC), at which the connection syncs. Returned only when `sync_frequency` is `1440` and `daily_sync_time` was explicitly set. `null` otherwise. (example: 14:00)</td>
</tr>
<tr>
    <td><CopyableCode code="data_delay_sensitivity" /></td>
    <td><code>string</code></td>
    <td>The level of data delay notification threshold. Possible values: LOW, NORMAL, HIGH, CUSTOM, SYNC_FREQUENCY. The default value is LOW. CUSTOM is only available for customers using the &#91;Enterprise plan&#93;(https:​//fivetran.com/docs/getting-started/pricing#fivetranplans) or above. (LOW, NORMAL, HIGH, CUSTOM, SYNC_FREQUENCY) (example: LOW)</td>
</tr>
<tr>
    <td><CopyableCode code="data_delay_threshold" /></td>
    <td><code>integer (int32)</code></td>
    <td>Custom sync delay notification threshold in minutes. The default value is 0. This parameter is only used when data_delay_sensitivity set to CUSTOM.</td>
</tr>
<tr>
    <td><CopyableCode code="destination_configuration" /></td>
    <td><code>object</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="destination_schema_names" /></td>
    <td><code>string</code></td>
    <td>Defines how schema names appear in your destination.  &lt;br /&gt; The possible values are:  &lt;br /&gt; - FIVETRAN_NAMING - Uses Fivetran naming conventions to simplify and standardize the schema, table and column names in the destination. &lt;br /&gt; - SOURCE_NAMING - Preserves source schema table and column names in the destination. &lt;br /&gt; (FIVETRAN_NAMING, SOURCE_NAMING) (example: FIVETRAN_NAMING)</td>
</tr>
<tr>
    <td><CopyableCode code="external_secrets_keys_config" /></td>
    <td><code>object</code></td>
    <td>The `external_secrets_keys_config` object for the `service` in question (a JSON value; its keys depend on the `service`). The accepted keys per type are documented in the vendor's API reference and returned by the connector metadata endpoints.</td>
</tr>
<tr>
    <td><CopyableCode code="failed_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The UTC timestamp of the most recent failed sync. `null` if the connection has never experienced a sync failure. (example: 2024-04-01T18:13:25.043659Z)</td>
</tr>
<tr>
    <td><CopyableCode code="networking_method" /></td>
    <td><code>string</code></td>
    <td> (Directly, SshTunnel, PrivateLink, ProxyAgent, UnmanagedProxyAgent, Unknown)</td>
</tr>
<tr>
    <td><CopyableCode code="pause_after_trial" /></td>
    <td><code>boolean</code></td>
    <td>Specifies whether the connection should be paused after the free trial period has ended</td>
</tr>
<tr>
    <td><CopyableCode code="paused" /></td>
    <td><code>boolean</code></td>
    <td>Specifies whether the connection is paused</td>
</tr>
<tr>
    <td><CopyableCode code="schedule" /></td>
    <td><code>object</code></td>
    <td>The connection's sync schedule configuration</td>
</tr>
<tr>
    <td><CopyableCode code="schedule_type" /></td>
    <td><code>string</code></td>
    <td>The connection schedule configuration type. Supported values: auto, manual (example: auto)</td>
</tr>
<tr>
    <td><CopyableCode code="schema" /></td>
    <td><code>string</code></td>
    <td>The name used both as the connection's name within the Fivetran system and as the source schema's name within your destination (example: schema.table)</td>
</tr>
<tr>
    <td><CopyableCode code="service" /></td>
    <td><code>string</code></td>
    <td>The connector name within the Fivetran system (example: google_ads)</td>
</tr>
<tr>
    <td><CopyableCode code="service_version" /></td>
    <td><code>integer (int32)</code></td>
    <td>The connector version within the Fivetran system</td>
</tr>
<tr>
    <td><CopyableCode code="setup_tests" /></td>
    <td><code>array</code></td>
    <td>Setup tests results for this connection</td>
</tr>
<tr>
    <td><CopyableCode code="source_sync_details" /></td>
    <td><code>string</code></td>
    <td>Read-only, connector-specific sync state. Depending on the connector type, this object may include source scope identifiers such as accounts, profiles, or projects; per-entity cursors or checkpoints; or last-synced timestamps. This field is optional, and its schema varies by connector type. To determine whether a connector exposes this information and inspect its returned fields, use &#91;Retrieve Connection Details&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/connection-details). (opaque JSON object)</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>object</code></td>
    <td>The current operational state of the connection, including setup state, sync state, update state, and any active tasks or warnings.</td>
</tr>
<tr>
    <td><CopyableCode code="succeeded_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The UTC timestamp of the most recent successful sync. `null` if the connection has never completed a successful sync. (example: 2024-03-17T12:31:40.870504Z)</td>
</tr>
<tr>
    <td><CopyableCode code="sync_frequency" /></td>
    <td><code>integer (int32)</code></td>
    <td>The connection sync frequency in minutes. `null` when the connection's schedule has no single cadence to report, such as a custom cron or multiple-time-of-day schedule. (1, 5, 15, 30, 60, 120, 180, 360, 480, 720, 1440)</td>
</tr>
</tbody>
</table>
</TabItem>
<TabItem value="list">

<table>
<thead>
    <tr>
    <th>Name</th>
    <th>Datatype</th>
    <th>Description</th>
    </tr>
</thead>
<tbody>
<tr>
    <td><CopyableCode code="id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the group within the Fivetran system. (example: connection_id)</td>
</tr>
<tr>
    <td><CopyableCode code="external_secrets_manager_id" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="group_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the group within the Fivetran system. (example: group_id)</td>
</tr>
<tr>
    <td><CopyableCode code="hybrid_deployment_agent_id" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="private_link_id" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="proxy_agent_id" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="config" /></td>
    <td><code>object</code></td>
    <td>The connection setup configuration.</td>
</tr>
<tr>
    <td><CopyableCode code="connect_card" /></td>
    <td><code>object</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="connect_card_config" /></td>
    <td><code>object</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="connected_by" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the user who has created the connection in your account. (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp of when the group was created in your account. (example: 2024-12-01T15:43:29.013729Z)</td>
</tr>
<tr>
    <td><CopyableCode code="daily_sync_time" /></td>
    <td><code>string</code></td>
    <td>The optional parameter that defines the sync start time when the sync frequency is already set or being set by the current request to 1440. It can be specified in one hour increments starting from 00:00 to 23:00. If not specified, we will use the baseline sync start time. This parameter has no effect on the 0 to 60 minutes offset used to determine the actual sync start time. (example: 14:00)</td>
</tr>
<tr>
    <td><CopyableCode code="data_delay_sensitivity" /></td>
    <td><code>string</code></td>
    <td> (LOW, NORMAL, HIGH, CUSTOM, SYNC_FREQUENCY)</td>
</tr>
<tr>
    <td><CopyableCode code="data_delay_threshold" /></td>
    <td><code>integer (int32)</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="destination_configuration" /></td>
    <td><code>object</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="destination_schema_names" /></td>
    <td><code>string</code></td>
    <td> (FIVETRAN_NAMING, SOURCE_NAMING)</td>
</tr>
<tr>
    <td><CopyableCode code="external_secrets_keys_config" /></td>
    <td><code>object</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="failed_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp of the time the connection sync failed last time. (example: 2024-12-01T15:43:29.013729Z)</td>
</tr>
<tr>
    <td><CopyableCode code="networking_method" /></td>
    <td><code>string</code></td>
    <td> (Directly, SshTunnel, PrivateLink, ProxyAgent, UnmanagedProxyAgent, Unknown)</td>
</tr>
<tr>
    <td><CopyableCode code="pause_after_trial" /></td>
    <td><code>boolean</code></td>
    <td>Specifies whether the connection should be paused after the free trial period has ended.</td>
</tr>
<tr>
    <td><CopyableCode code="paused" /></td>
    <td><code>boolean</code></td>
    <td>Specifies whether the connection is paused.</td>
</tr>
<tr>
    <td><CopyableCode code="schedule" /></td>
    <td><code>object</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="schedule_type" /></td>
    <td><code>string</code></td>
    <td>The connection schedule config type. Supported values: auto, manual. Lets you disable or enable an automatic data sync on a schedule. (example: auto)</td>
</tr>
<tr>
    <td><CopyableCode code="schema" /></td>
    <td><code>string</code></td>
    <td>The name used both as the connection's name within the Fivetran system and as the source schema's name within your destination. (example: gsheets.table)</td>
</tr>
<tr>
    <td><CopyableCode code="service" /></td>
    <td><code>string</code></td>
    <td>The name for the connector type within the Fivetran system. (example: google_sheets)</td>
</tr>
<tr>
    <td><CopyableCode code="service_version" /></td>
    <td><code>integer (int32)</code></td>
    <td>The connector type version within the Fivetran system.</td>
</tr>
<tr>
    <td><CopyableCode code="setup_tests" /></td>
    <td><code>array</code></td>
    <td>Setup tests results</td>
</tr>
<tr>
    <td><CopyableCode code="source_sync_details" /></td>
    <td><code>string</code></td>
    <td>Read-only, connector-specific sync state. Depending on the connector type, this object may include source scope identifiers such as accounts, profiles, or projects; per-entity cursors or checkpoints; or last-synced timestamps. This field is optional, and its schema varies by connector type. To determine whether a connector exposes this information and inspect its returned fields, use &#91;Retrieve Connection Details&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/connection-details). (opaque JSON object)</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>object</code></td>
    <td>The current state of the connection. </td>
</tr>
<tr>
    <td><CopyableCode code="succeeded_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp of the time the connection sync succeeded last time. (example: 2024-12-01T15:43:29.013729Z)</td>
</tr>
<tr>
    <td><CopyableCode code="sync_frequency" /></td>
    <td><code>integer (int32)</code></td>
    <td>The connection sync frequency in minutes. `null` when the connection's schedule has no single cadence to report, such as a custom cron or multiple-time-of-day schedule.</td>
</tr>
</tbody>
</table>
</TabItem>
</Tabs>

## Methods

The following methods are available for this resource:

<table>
<thead>
    <tr>
    <th>Name</th>
    <th>Accessible by</th>
    <th>Required Params</th>
    <th>Optional Params</th>
    <th>Description</th>
    </tr>
</thead>
<tbody>
<tr>
    <td><a href="#get"><CopyableCode code="get" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a></td>
    <td></td>
    <td>Returns a connection configuration and status details if a valid identifier was provided.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-group_id"><code>group_id</code></a>, <a href="#parameter-schema"><code>schema</code></a>, <a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns a list of all accessible connections within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td><a href="#parameter-group_id"><code>group_id</code></a>, <a href="#parameter-service"><code>service</code></a></td>
    <td></td>
    <td>Creates a new connection within a specified group in your Fivetran account. Runs setup tests and returns testing results. &lt;br /&gt;&lt;br /&gt;&gt; IMPORTANT: The `destination_schema_names` field will soon become a required field. Make sure to include it in your API requests when creating new connections to prevent future disruptions.&lt;br /&gt;&gt; IMPORTANT: If you want to get the fingerprint details, do not set `trust_fingerprints` to `true` when you create a connection with our REST API. We can only provide the fingerprint details through the failed SSH Tunnel Connection setup test. For a full walkthrough, see &#91;Get Connection Fingerprint Details&#93;(https:​//fivetran.com/docs/rest-api/tutorials/get-connection-fingerprint-details).</td>
</tr>
<tr>
    <td><a href="#update"><CopyableCode code="update" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a></td>
    <td></td>
    <td>Updates connection parameters for an existing connection within your Fivetran account.&lt;br /&gt;&lt;br /&gt;This endpoint requires at least one persistent configuration parameter to be specified (e.g., `sync_frequency`, `paused`, `config`, `auth`, `daily_sync_time`, `schema_status`).&lt;br /&gt;&lt;br /&gt;&gt; IMPORTANT: Parameters like `trust_certificates`, `trust_fingerprints`, and `run_setup_tests` are test-control parameters that affect only the behavior of setup tests during the update and do not persist in the connection configuration; they cannot be used on their own. If you want to run setup tests without making configuration changes, use the POST `/v1/connections/&#123;connectionId&#125;/test` endpoint instead.&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a></td>
    <td></td>
    <td>Deletes a connection from your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#create_connect_card"><CopyableCode code="create_connect_card" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a>, <a href="#parameter-connect_card_config"><code>connect_card_config</code></a></td>
    <td></td>
    <td>Generates the Connect Card URI for the connection</td>
</tr>
<tr>
    <td><a href="#move"><CopyableCode code="move" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a>, <a href="#parameter-destination_group_id"><code>destination_group_id</code></a></td>
    <td></td>
    <td>Moves a connection from its current destination group to a different destination group. The connection must be paused before calling this endpoint. Use `sync_behavior` to control how data syncs after the move: `CONTINUE` preserves the existing sync cursor so the connection resumes incremental sync from where it left off; `BACKFILL` resets the cursor and triggers a historical sync; `CONTINUE_WITH_DATA` preserves the cursor and additionally migrates existing data to the new destination by starting an asynchronous job. Use the `job_id` returned in the response to monitor progress via the move-connection-job-status endpoint. `CONTINUE_WITH_DATA` is supported only when moving a connection from Snowflake Native tables to a MDLS-linked Snowflake Lakehouse destination.</td>
</tr>
<tr>
    <td><a href="#resync"><CopyableCode code="resync" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a></td>
    <td></td>
    <td>Triggers a full historical sync of a connection or multiple schema tables within a connection. If the connection is paused, the table sync will be scheduled to be performed when the connection is re-enabled. If there is a data sync already in progress, we will try to complete it. If it fails, the request will be declined and the HTTP 409 Conflict error will be returned.</td>
</tr>
<tr>
    <td><a href="#sync"><CopyableCode code="sync" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a></td>
    <td></td>
    <td>Triggers a data sync for an existing connection within your Fivetran account without waiting for the next scheduled sync. This action does not override the standard sync frequency you defined in the Fivetran dashboard.&lt;br /&gt;&lt;br /&gt;When `schedule_type` is set to `manual`, this endpoint is the only way syncs occur — including syncs in a `rescheduled` state. For a full walkthrough, see &#91;Trigger Manual Syncs&#93;(https:​//fivetran.com/docs/rest-api/tutorials/trigger-syncs-manually).&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#run_setup_tests"><CopyableCode code="run_setup_tests" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a></td>
    <td></td>
    <td>Runs the setup tests for an existing connection within your Fivetran account. Use this parameter to test the connection without making any configuration changes. You can optionally include `trust_certificates` or `trust_fingerprints` parameters to automatically approve certificates or fingerprints during the test run.</td>
</tr>
</tbody>
</table>

## Parameters

Parameters can be passed in the `WHERE` clause of a query. Check the [Methods](#methods) section to see which parameters are required or optional for each operation.

<table>
<thead>
    <tr>
    <th>Name</th>
    <th>Datatype</th>
    <th>Description</th>
    </tr>
</thead>
<tbody>
<tr id="parameter-connection_id">
    <td><CopyableCode code="connection_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the connection. Retrieve it from the `id` field in the &#91;List All Connections&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/list-connections) response, or from the `id` field returned when you &#91;Create a Connection&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/create-connection).</td>
</tr>
<tr id="parameter-cursor">
    <td><CopyableCode code="cursor" /></td>
    <td><code>string</code></td>
    <td>Paging cursor, &#91;read more about pagination&#93;(https:​//fivetran.com/docs/rest-api/pagination)</td>
</tr>
<tr id="parameter-group_id">
    <td><CopyableCode code="group_id" /></td>
    <td><code>string</code></td>
    <td>Filter the list to connections belonging to this group. Retrieve group IDs from the &#91;List All Groups&#93;(https:​//fivetran.com/docs/rest-api/api-reference/groups/list-all-groups) endpoint.</td>
</tr>
<tr id="parameter-limit">
    <td><CopyableCode code="limit" /></td>
    <td><code>integer (int32)</code></td>
    <td>Number of records to fetch per page. Accepts a number in the range 1..1000; the default value is 100.</td>
</tr>
<tr id="parameter-schema">
    <td><CopyableCode code="schema" /></td>
    <td><code>string</code></td>
    <td>Filter the list to connections whose schema name matches this value. Partial matches are not supported.</td>
</tr>
</tbody>
</table>

## `SELECT` examples

<Tabs
    defaultValue="get"
    values={[
        { label: 'get', value: 'get' },
        { label: 'list', value: 'list' }
    ]}
>
<TabItem value="get">

Returns a connection configuration and status details if a valid identifier was provided.

```sql
SELECT
id,
external_secrets_manager_id,
group_id,
hybrid_deployment_agent_id,
private_link_id,
proxy_agent_id,
config,
connect_card,
connect_card_config,
connected_by,
created_at,
daily_sync_time,
data_delay_sensitivity,
data_delay_threshold,
destination_configuration,
destination_schema_names,
external_secrets_keys_config,
failed_at,
networking_method,
pause_after_trial,
paused,
schedule,
schedule_type,
"schema",
service,
service_version,
setup_tests,
source_sync_details,
status,
succeeded_at,
sync_frequency
FROM fivetran.connections.connections
WHERE connection_id = '{{ connection_id }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns a list of all accessible connections within your Fivetran account.

```sql
SELECT
id,
external_secrets_manager_id,
group_id,
hybrid_deployment_agent_id,
private_link_id,
proxy_agent_id,
config,
connect_card,
connect_card_config,
connected_by,
created_at,
daily_sync_time,
data_delay_sensitivity,
data_delay_threshold,
destination_configuration,
destination_schema_names,
external_secrets_keys_config,
failed_at,
networking_method,
pause_after_trial,
paused,
schedule,
schedule_type,
"schema",
service,
service_version,
setup_tests,
source_sync_details,
status,
succeeded_at,
sync_frequency
FROM fivetran.connections.connections
WHERE group_id = '{{ group_id }}'
AND "schema" = '{{ schema }}'
AND "limit" = '{{ limit }}'
;
```
</TabItem>
</Tabs>


## `INSERT` examples

<Tabs
    defaultValue="create"
    values={[
        { label: 'create', value: 'create' },
        { label: 'Manifest', value: 'manifest' }
    ]}
>
<TabItem value="create">

Creates a new connection within a specified group in your Fivetran account. Runs setup tests and returns testing results. &lt;br /&gt;&lt;br /&gt;&gt; IMPORTANT: The `destination_schema_names` field will soon become a required field. Make sure to include it in your API requests when creating new connections to prevent future disruptions.&lt;br /&gt;&gt; IMPORTANT: If you want to get the fingerprint details, do not set `trust_fingerprints` to `true` when you create a connection with our REST API. We can only provide the fingerprint details through the failed SSH Tunnel Connection setup test. For a full walkthrough, see &#91;Get Connection Fingerprint Details&#93;(https:​//fivetran.com/docs/rest-api/tutorials/get-connection-fingerprint-details).

```sql
INSERT INTO fivetran.connections.connections (
group_id,
service,
trust_certificates,
trust_fingerprints,
run_setup_tests,
paused,
pause_after_trial,
sync_frequency,
data_delay_sensitivity,
data_delay_threshold,
daily_sync_time,
schedule_type,
connect_card_config,
proxy_agent_id,
private_link_id,
networking_method,
hybrid_deployment_agent_id,
destination_configuration,
destination_schema_names,
external_secrets_manager_id,
auth,
config,
external_secrets_keys_config
)
SELECT 
'{{ group_id }}' /* required */,
'{{ service }}' /* required */,
{{ trust_certificates }},
{{ trust_fingerprints }},
{{ run_setup_tests }},
{{ paused }},
{{ pause_after_trial }},
{{ sync_frequency }},
'{{ data_delay_sensitivity }}',
{{ data_delay_threshold }},
'{{ daily_sync_time }}',
'{{ schedule_type }}',
'{{ connect_card_config }}',
'{{ proxy_agent_id }}',
'{{ private_link_id }}',
'{{ networking_method }}',
'{{ hybrid_deployment_agent_id }}',
'{{ destination_configuration }}',
'{{ destination_schema_names }}',
'{{ external_secrets_manager_id }}',
'{{ auth }}',
'{{ config }}',
'{{ external_secrets_keys_config }}'
RETURNING
id,
external_secrets_manager_id,
group_id,
hybrid_deployment_agent_id,
private_link_id,
proxy_agent_id,
config,
connect_card,
connect_card_config,
connected_by,
created_at,
daily_sync_time,
data_delay_sensitivity,
data_delay_threshold,
destination_configuration,
destination_schema_names,
external_secrets_keys_config,
failed_at,
networking_method,
pause_after_trial,
paused,
schedule,
schedule_type,
"schema",
service,
service_version,
setup_tests,
source_sync_details,
status,
succeeded_at,
sync_frequency
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: connections
  props:
    - name: group_id
      value: "{{ group_id }}"
      description: |
        The unique identifier of the destination group to create the connection in. Retrieve group IDs from the [List All Groups](https://fivetran.com/docs/rest-api/api-reference/groups/list-all-groups) endpoint.
    - name: service
      value: "{{ service }}"
      description: |
        The connector name within the Fivetran system
    - name: trust_certificates
      value: {{ trust_certificates }}
      description: |
        Specifies whether we should trust the certificate automatically during setup tests. The default value is FALSE. This parameter only affects the behavior of setup tests and does not persist in the connection configuration. When using the PATCH endpoint to update a connection, this parameter must be combined with \`run_setup_tests=true\` and at least one persistent configuration parameter (e.g., \`sync_frequency\`, \`paused\`, \`config\`, \`auth\`). If you only want to run setup tests with automatic certificate trust, use the POST \`/v1/connections/{connectionId}/test\` endpoint instead. If a certificate is not trusted automatically during testing, it has to be approved with [Certificates Management API Approve a destination certificate](https://fivetran.com/docs/rest-api/certificates#approveadestinationcertificate).
    - name: trust_fingerprints
      value: {{ trust_fingerprints }}
      description: |
        Specifies whether we should trust the SSH fingerprint automatically during setup tests. The default value is FALSE. This parameter only affects the behavior of setup tests and does not persist in the connection configuration. When using the PATCH endpoint to update a connection, this parameter must be combined with \`run_setup_tests=true\` and at least one persistent configuration parameter (e.g., \`sync_frequency\`, \`paused\`, \`config\`, \`auth\`). If you only want to run setup tests with automatic fingerprint trust, use the POST \`/v1/connections/{connectionId}/test\` endpoint instead. If a fingerprint is not trusted automatically during testing, it has to be approved with [Certificates Management API Approve a destination fingerprint](https://fivetran.com/docs/rest-api/certificates#approveadestinationfingerprint).
    - name: run_setup_tests
      value: {{ run_setup_tests }}
      description: |
        Specifies whether the setup tests should be run automatically after updating the connection. The default value is TRUE. When using this parameter in a PATCH request, you must also include at least one persistent configuration parameter (e.g., \`sync_frequency\`, \`paused\`, \`config\`, \`auth\`). This parameter can be combined with \`trust_certificates\` or \`trust_fingerprints\` to automatically approve \`certificates/fingerprints\` during the test run. To run setup tests without making configuration changes, use the POST \`/v1/connections/{connectionId}/test\` endpoint instead.
    - name: paused
      value: {{ paused }}
      description: |
        Specifies whether the connection is paused
    - name: pause_after_trial
      value: {{ pause_after_trial }}
      description: |
        Specifies whether the connection should be paused after the free trial period has ended
    - name: sync_frequency
      value: {{ sync_frequency }}
      description: |
        The connection sync frequency in minutes. \`null\` when the connection's schedule has no single cadence to report, such as a custom cron or multiple-time-of-day schedule.
      valid_values: ['1', '5', '15', '30', '60', '120', '180', '360', '480', '720', '1440']
    - name: data_delay_sensitivity
      value: "{{ data_delay_sensitivity }}"
      description: |
        The level of data delay notification threshold. Possible values: LOW, NORMAL, HIGH, CUSTOM, SYNC_FREQUENCY. The default value is LOW. CUSTOM is only available for customers using the [Enterprise plan](https://fivetran.com/docs/getting-started/pricing#fivetranplans) or above.
      valid_values: ['LOW', 'NORMAL', 'HIGH', 'CUSTOM', 'SYNC_FREQUENCY']
    - name: data_delay_threshold
      value: {{ data_delay_threshold }}
      description: |
        Custom sync delay notification threshold in minutes. The default value is 0. This parameter is only used when data_delay_sensitivity set to CUSTOM.
    - name: daily_sync_time
      value: "{{ daily_sync_time }}"
      description: |
        The optional parameter that defines the sync start time when the sync frequency is already set or being set by the current request to 1440. It can be specified in one hour increments starting from 00:00 to 23:00. If not specified, we will use [the baseline sync start time](https://fivetran.com/docs/getting-started/syncoverview#syncfrequencyandscheduling). This parameter has no effect on the [0 to 60 minutes offset](https://fivetran.com/docs/getting-started/syncoverview#syncstarttimesandoffsets) used to determine the actual sync start time
    - name: schedule_type
      value: "{{ schedule_type }}"
      description: |
        The connection schedule configuration type. Supported values: auto, manual
      valid_values: ['auto', 'manual']
    - name: connect_card_config
      value:
        redirect_uri: "{{ redirect_uri }}"
        hide_setup_guide: {{ hide_setup_guide }}
        all_fields: {{ all_fields }}
    - name: proxy_agent_id
      value: "{{ proxy_agent_id }}"
      description: |
        The unique identifier for the proxy agent within the Fivetran system
    - name: private_link_id
      value: "{{ private_link_id }}"
      description: |
        The unique identifier for the self-served private link that is used by the connection
    - name: networking_method
      value: "{{ networking_method }}"
      valid_values: ['Directly', 'PrivateLink', 'SshTunnel', 'ProxyAgent']
    - name: hybrid_deployment_agent_id
      value: "{{ hybrid_deployment_agent_id }}"
      description: |
        The unique identifier for the hybrid deployment agent within the Fivetran system. If not specified, the agent ID from the destination will be used
    - name: destination_configuration
      value:
        virtual_warehouse: "{{ virtual_warehouse }}"
    - name: destination_schema_names
      value: "{{ destination_schema_names }}"
      description: |
        Defines how you want the schema names to appear in your destination. <br /> The available values are:  <br /> - FIVETRAN_NAMING - Use Fivetran naming conventions to simplify and standardize the schema, table and column names in the destination. <br /> - SOURCE_NAMING - Preserve source schema table and column names in the destination. <br /> You can modify your selection only before the initial sync. Learn more in [our documentation](https://fivetran.com/docs/core-concepts#namingconventions) <br />
        > IMPORTANT: This field will soon become a required field. Make sure to include it in your API requests when creating new connections to prevent future disruptions.
      valid_values: ['FIVETRAN_NAMING', 'SOURCE_NAMING']
    - name: external_secrets_manager_id
      value: "{{ external_secrets_manager_id }}"
      description: |
        The unique identifier of the [External Secrets Manager](https://fivetran.com/docs/rest-api/api-reference/external-secrets-managers) instance. Connector service must [support](https://fivetran.com/docs/core-concepts/features/external-secret-managers#connectors) External Secrets Manager feature to use this field.
    - name: auth
      value: "{{ auth }}"
      description: |
        The \`auth\` object for the \`service\` in question (a JSON value; its keys depend on the \`service\`). The accepted keys per type are documented in the vendor's API reference and returned by the connector metadata endpoints.
    - name: config
      value: "{{ config }}"
      description: |
        The \`config\` object for the \`service\` in question (a JSON value; its keys depend on the \`service\`). The accepted keys per type are documented in the vendor's API reference and returned by the connector metadata endpoints.
    - name: external_secrets_keys_config
      value: "{{ external_secrets_keys_config }}"
      description: |
        The \`external_secrets_keys_config\` object for the \`service\` in question (a JSON value; its keys depend on the \`service\`). The accepted keys per type are documented in the vendor's API reference and returned by the connector metadata endpoints.
`}</CodeBlock>

</TabItem>
</Tabs>


## `UPDATE` examples

<Tabs
    defaultValue="update"
    values={[
        { label: 'update', value: 'update' }
    ]}
>
<TabItem value="update">

Updates connection parameters for an existing connection within your Fivetran account.&lt;br /&gt;&lt;br /&gt;This endpoint requires at least one persistent configuration parameter to be specified (e.g., `sync_frequency`, `paused`, `config`, `auth`, `daily_sync_time`, `schema_status`).&lt;br /&gt;&lt;br /&gt;&gt; IMPORTANT: Parameters like `trust_certificates`, `trust_fingerprints`, and `run_setup_tests` are test-control parameters that affect only the behavior of setup tests during the update and do not persist in the connection configuration; they cannot be used on their own. If you want to run setup tests without making configuration changes, use the POST `/v1/connections/&#123;connectionId&#125;/test` endpoint instead.&lt;br /&gt;

```sql
UPDATE fivetran.connections.connections
SET 
config = '{{ config }}',
auth = '{{ auth }}',
paused = {{ paused }},
trust_certificates = {{ trust_certificates }},
trust_fingerprints = {{ trust_fingerprints }},
sync_frequency = {{ sync_frequency }},
data_delay_threshold = {{ data_delay_threshold }},
data_delay_sensitivity = '{{ data_delay_sensitivity }}',
daily_sync_time = '{{ daily_sync_time }}',
pause_after_trial = {{ pause_after_trial }},
schema_status = '{{ schema_status }}',
is_historical_sync = {{ is_historical_sync }},
schedule_type = '{{ schedule_type }}',
run_setup_tests = {{ run_setup_tests }},
networking_method = '{{ networking_method }}',
hybrid_deployment_agent_id = '{{ hybrid_deployment_agent_id }}',
proxy_agent_id = '{{ proxy_agent_id }}',
private_link_id = '{{ private_link_id }}',
destination_configuration = '{{ destination_configuration }}',
external_secrets_manager_id = '{{ external_secrets_manager_id }}',
external_secrets_keys_config = '{{ external_secrets_keys_config }}'
WHERE 
connection_id = '{{ connection_id }}' --required
RETURNING
id,
external_secrets_manager_id,
group_id,
hybrid_deployment_agent_id,
private_link_id,
proxy_agent_id,
config,
connect_card,
connect_card_config,
connected_by,
created_at,
daily_sync_time,
data_delay_sensitivity,
data_delay_threshold,
destination_configuration,
destination_schema_names,
external_secrets_keys_config,
failed_at,
networking_method,
pause_after_trial,
paused,
schedule,
schedule_type,
"schema",
service,
service_version,
setup_tests,
source_sync_details,
status,
succeeded_at,
sync_frequency;
```
</TabItem>
</Tabs>


## `DELETE` examples

<Tabs
    defaultValue="delete"
    values={[
        { label: 'delete', value: 'delete' }
    ]}
>
<TabItem value="delete">

Deletes a connection from your Fivetran account.

```sql
DELETE FROM fivetran.connections.connections
WHERE connection_id = '{{ connection_id }}' --required
;
```
</TabItem>
</Tabs>


## Lifecycle Methods

EXEC variables use wire (API) names.

<Tabs
    defaultValue="create_connect_card"
    values={[
        { label: 'create_connect_card', value: 'create_connect_card' },
        { label: 'move', value: 'move' },
        { label: 'resync', value: 'resync' },
        { label: 'sync', value: 'sync' },
        { label: 'run_setup_tests', value: 'run_setup_tests' }
    ]}
>
<TabItem value="create_connect_card">

Generates the Connect Card URI for the connection

```sql
EXEC fivetran.connections.connections.create_connect_card 
@connection_id='{{ connection_id }}' --required 
@@json=
'{
"connect_card_config": "{{ connect_card_config }}"
}'
;
```
</TabItem>
<TabItem value="move">

Moves a connection from its current destination group to a different destination group. The connection must be paused before calling this endpoint. Use `sync_behavior` to control how data syncs after the move: `CONTINUE` preserves the existing sync cursor so the connection resumes incremental sync from where it left off; `BACKFILL` resets the cursor and triggers a historical sync; `CONTINUE_WITH_DATA` preserves the cursor and additionally migrates existing data to the new destination by starting an asynchronous job. Use the `job_id` returned in the response to monitor progress via the move-connection-job-status endpoint. `CONTINUE_WITH_DATA` is supported only when moving a connection from Snowflake Native tables to a MDLS-linked Snowflake Lakehouse destination.

```sql
EXEC fivetran.connections.connections.move 
@connection_id='{{ connection_id }}' --required 
@@json=
'{
"destination_group_id": "{{ destination_group_id }}", 
"sync_behavior": "{{ sync_behavior }}", 
"force_move": {{ force_move }}
}'
;
```
</TabItem>
<TabItem value="resync">

Triggers a full historical sync of a connection or multiple schema tables within a connection. If the connection is paused, the table sync will be scheduled to be performed when the connection is re-enabled. If there is a data sync already in progress, we will try to complete it. If it fails, the request will be declined and the HTTP 409 Conflict error will be returned.

```sql
EXEC fivetran.connections.connections.resync 
@connection_id='{{ connection_id }}' --required 
@@json=
'{
"scope": "{{ scope }}"
}'
;
```
</TabItem>
<TabItem value="sync">

Triggers a data sync for an existing connection within your Fivetran account without waiting for the next scheduled sync. This action does not override the standard sync frequency you defined in the Fivetran dashboard.&lt;br /&gt;&lt;br /&gt;When `schedule_type` is set to `manual`, this endpoint is the only way syncs occur — including syncs in a `rescheduled` state. For a full walkthrough, see &#91;Trigger Manual Syncs&#93;(https:​//fivetran.com/docs/rest-api/tutorials/trigger-syncs-manually).&lt;br /&gt;

```sql
EXEC fivetran.connections.connections.sync 
@connection_id='{{ connection_id }}' --required 
@@json=
'{
"force": {{ force }}
}'
;
```
</TabItem>
<TabItem value="run_setup_tests">

Runs the setup tests for an existing connection within your Fivetran account. Use this parameter to test the connection without making any configuration changes. You can optionally include `trust_certificates` or `trust_fingerprints` parameters to automatically approve certificates or fingerprints during the test run.

```sql
EXEC fivetran.connections.connections.run_setup_tests 
@connection_id='{{ connection_id }}' --required 
@@json=
'{
"trust_certificates": {{ trust_certificates }}, 
"trust_fingerprints": {{ trust_fingerprints }}
}'
;
```
</TabItem>
</Tabs>
