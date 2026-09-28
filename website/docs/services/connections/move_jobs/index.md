--- 
title: move_jobs
hide_title: false
hide_table_of_contents: false
keywords:
  - move_jobs
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

Creates, updates, deletes, gets or lists a <code>move_jobs</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="move_jobs" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.connections.move_jobs" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

<Tabs
    defaultValue="get"
    values={[
        { label: 'get', value: 'get' }
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
    <td>The unique identifier of the move job. Use this value to check the status of the move operation. (example: 01234567-89ab-cdef-0123-456789abcdef)</td>
</tr>
<tr>
    <td><CopyableCode code="connection_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the connection that was moved. (example: connection_id)</td>
</tr>
<tr>
    <td><CopyableCode code="destination_group_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the destination group to move the connection to. Retrieve group IDs from the &#91;List All Groups&#93;(https:​//fivetran.com/docs/rest-api/api-reference/groups/list-all-groups) endpoint. (example: destination_group_id)</td>
</tr>
<tr>
    <td><CopyableCode code="source_group_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the destination group the connection was moved from. (example: source_group_id)</td>
</tr>
<tr>
    <td><CopyableCode code="completed_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp of when the move job completed (successfully or with failure). Null if the job has not completed yet. (example: 2024-01-01T00:05:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp of when the move job was created. (example: 2024-01-01T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="error_message" /></td>
    <td><code>string</code></td>
    <td>The error message if the move job failed. Null if the job has not failed. (example: Error details if the job failed)</td>
</tr>
<tr>
    <td><CopyableCode code="started_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp of when the move job started processing. Null if the job has not started yet. (example: 2024-01-01T00:00:30Z)</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>The current status of the move job. Possible values: PENDING, IN_PROGRESS, SUCCESS, FAILED. (PENDING, IN_PROGRESS, SUCCESS, FAILED) (example: IN_PROGRESS)</td>
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
    <td><a href="#parameter-connection_id"><code>connection_id</code></a>, <a href="#parameter-job_id"><code>job_id</code></a></td>
    <td></td>
    <td>Retrieves the status of an asynchronous connection move job. Use this endpoint to monitor the progress of a connection move operation that was initiated with the `CONTINUE_WITH_DATA` sync behavior.</td>
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
<tr id="parameter-job_id">
    <td><CopyableCode code="job_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the move job. This is returned in the response when you initiate a connection move.</td>
</tr>
</tbody>
</table>

## `SELECT` examples

<Tabs
    defaultValue="get"
    values={[
        { label: 'get', value: 'get' }
    ]}
>
<TabItem value="get">

Retrieves the status of an asynchronous connection move job. Use this endpoint to monitor the progress of a connection move operation that was initiated with the `CONTINUE_WITH_DATA` sync behavior.

```sql
SELECT
id,
connection_id,
destination_group_id,
source_group_id,
completed_at,
created_at,
error_message,
started_at,
status
FROM fivetran.connections.move_jobs
WHERE connection_id = '{{ connection_id }}' -- required
AND job_id = '{{ job_id }}' -- required
;
```
</TabItem>
</Tabs>
