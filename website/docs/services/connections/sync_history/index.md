--- 
title: sync_history
hide_title: false
hide_table_of_contents: false
keywords:
  - sync_history
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

Creates, updates, deletes, gets or lists a <code>sync_history</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="sync_history" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.connections.sync_history" /></td></tr>
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
    <td><CopyableCode code="sync_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the sync.</td>
</tr>
<tr>
    <td><CopyableCode code="end" /></td>
    <td><code>string</code></td>
    <td>The UTC timestamp of when the sync finished, in ISO 8601 format. Null if the sync is still in progress.</td>
</tr>
<tr>
    <td><CopyableCode code="reason" /></td>
    <td><code>string</code></td>
    <td>The failure reason if the sync did not complete successfully. Omitted if the sync completed without errors.</td>
</tr>
<tr>
    <td><CopyableCode code="stages" /></td>
    <td><code>object</code></td>
    <td>The data volume processed in each stage of the sync pipeline.</td>
</tr>
<tr>
    <td><CopyableCode code="start" /></td>
    <td><code>string</code></td>
    <td>The UTC timestamp of when the sync started, in ISO 8601 format. Null if the sync has not started yet.</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>The outcome of the sync. Possible values: `COMPLETED`, `FAILURE`, `CANCELED`, `INCOMPLETE`, `RESCHEDULED`, `PAUSED`.</td>
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
    <td><a href="#parameter-connection_id"><code>connection_id</code></a></td>
    <td><a href="#parameter-duration"><code>duration</code></a>, <a href="#parameter-start_time"><code>start_time</code></a>, <a href="#parameter-end_time"><code>end_time</code></a>, <a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns a list of sync history records for the specified connection. The maximum time window is 7 days.</td>
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
<tr id="parameter-duration">
    <td><CopyableCode code="duration" /></td>
    <td><code>integer (int32)</code></td>
    <td>Deprecated. Use `start_time` and `end_time` instead.</td>
</tr>
<tr id="parameter-end_time">
    <td><CopyableCode code="end_time" /></td>
    <td><code>string</code></td>
    <td>The end of the time range for which to retrieve sync history, in ISO 8601 format (for example, 2026-01-01T01:00:00Z). If omitted, defaults to one hour after `start_time`. Must be after `start_time`.</td>
</tr>
<tr id="parameter-limit">
    <td><CopyableCode code="limit" /></td>
    <td><code>integer (int32)</code></td>
    <td>Number of records to fetch per page. Accepts a number in the range 1..1000; the default value is 100.</td>
</tr>
<tr id="parameter-start_time">
    <td><CopyableCode code="start_time" /></td>
    <td><code>string</code></td>
    <td>The start of the time range for which to retrieve sync history, in ISO 8601 format (for example, 2026-01-01T00:00:00Z). If omitted, defaults to one hour before `end_time`. The maximum allowed range between `start_time` and `end_time` is 7 days.</td>
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

Returns a list of sync history records for the specified connection. The maximum time window is 7 days.

```sql
SELECT
sync_id,
"end",
reason,
stages,
"start",
status
FROM fivetran.connections.sync_history
WHERE connection_id = '{{ connection_id }}' -- required
AND duration = '{{ duration }}'
AND start_time = '{{ start_time }}'
AND end_time = '{{ end_time }}'
AND "limit" = '{{ limit }}'
;
```
</TabItem>
</Tabs>
