--- 
title: connections
hide_title: false
hide_table_of_contents: false
keywords:
  - connections
  - groups
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
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.groups.connections" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

<Tabs
    defaultValue="list"
    values={[
        { label: 'list', value: 'list' }
    ]}
>
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
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-group_id"><code>group_id</code></a></td>
    <td><a href="#parameter-schema"><code>schema</code></a>, <a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns a list of information about all connections within a group in your Fivetran account.</td>
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
<tr id="parameter-group_id">
    <td><CopyableCode code="group_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the group within the Fivetran system.</td>
</tr>
<tr id="parameter-cursor">
    <td><CopyableCode code="cursor" /></td>
    <td><code>string</code></td>
    <td>Paging cursor, &#91;read more about pagination&#93;(https:​//fivetran.com/docs/rest-api/pagination)</td>
</tr>
<tr id="parameter-limit">
    <td><CopyableCode code="limit" /></td>
    <td><code>integer (int32)</code></td>
    <td>Number of records to fetch per page. Accepts a number in the range 1..1000; the default value is 100.</td>
</tr>
<tr id="parameter-schema">
    <td><CopyableCode code="schema" /></td>
    <td><code>string</code></td>
    <td>The name used both as the connection's name within the Fivetran system and as the source schema's name within your destination.</td>
</tr>
</tbody>
</table>

## `SELECT` examples

<Tabs
    defaultValue="list"
    values={[
        { label: 'list', value: 'list' }
    ]}
>
<TabItem value="list">

Returns a list of information about all connections within a group in your Fivetran account.

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
FROM fivetran.groups.connections
WHERE group_id = '{{ group_id }}' -- required
AND "schema" = '{{ schema }}'
AND "limit" = '{{ limit }}'
;
```
</TabItem>
</Tabs>
