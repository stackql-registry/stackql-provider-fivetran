--- 
title: states
hide_title: false
hide_table_of_contents: false
keywords:
  - states
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

Creates, updates, deletes, gets or lists a <code>states</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="states" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.connections.states" /></td></tr>
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
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>A freeform JSON object representing the connector's cursor or internal state. The structure is defined by the connector implementation and varies by connector type. Returns 400 if no state has been written yet. (opaque JSON object)</td>
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
    <td>This endpoint returns the connection state for &#91;Function&#93;(https:​//fivetran.com/docs/connectors/functions) and &#91;Connector SDK&#93;(https:​//fivetran.com/docs/connector-sdk) connections. Sending a request for any other connection type returns `400 Bad Request`. To update the connection state, use &#91;Update Connection State&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/modify-connection-state).&lt;br /&gt;&lt;br /&gt;To read the sync status for any connection type, use &#91;Retrieve connection details&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/connection-details) and inspect the `status` object in the response.&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#update"><CopyableCode code="update" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a></td>
    <td></td>
    <td>Updates the connection state. This endpoint is only supported for &#91;Function&#93;(https:​//fivetran.com/docs/connectors/functions) and &#91;Connection SDK&#93;(https:​//fivetran.com/docs/connectors/connector-sdk) connectors. To update the state, you should pause your connection first.&lt;br /&gt;&lt;br /&gt;To update the connection state, do the following:&lt;br /&gt;&lt;br /&gt;  1. Pause connection using &#91;Update a Connection&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/modify-connection) endpoint (set 'paused' to 'true').&lt;br /&gt;  2. Update the state by using the &#91;Update Connection State&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/modify-connection-state) endpoint.&lt;br /&gt;  3. Unpause the connection by setting the 'paused' parameter to 'false' in the &#91;Update a Connection&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/modify-connection) endpoint request.&lt;br /&gt;</td>
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

This endpoint returns the connection state for &#91;Function&#93;(https:​//fivetran.com/docs/connectors/functions) and &#91;Connector SDK&#93;(https:​//fivetran.com/docs/connector-sdk) connections. Sending a request for any other connection type returns `400 Bad Request`. To update the connection state, use &#91;Update Connection State&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/modify-connection-state).&lt;br /&gt;&lt;br /&gt;To read the sync status for any connection type, use &#91;Retrieve connection details&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/connection-details) and inspect the `status` object in the response.&lt;br /&gt;

```sql
SELECT
state
FROM fivetran.connections.states
WHERE connection_id = '{{ connection_id }}' -- required
;
```
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

Updates the connection state. This endpoint is only supported for &#91;Function&#93;(https:​//fivetran.com/docs/connectors/functions) and &#91;Connection SDK&#93;(https:​//fivetran.com/docs/connectors/connector-sdk) connectors. To update the state, you should pause your connection first.&lt;br /&gt;&lt;br /&gt;To update the connection state, do the following:&lt;br /&gt;&lt;br /&gt;  1. Pause connection using &#91;Update a Connection&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/modify-connection) endpoint (set 'paused' to 'true').&lt;br /&gt;  2. Update the state by using the &#91;Update Connection State&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/modify-connection-state) endpoint.&lt;br /&gt;  3. Unpause the connection by setting the 'paused' parameter to 'false' in the &#91;Update a Connection&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/modify-connection) endpoint request.&lt;br /&gt;

```sql
UPDATE fivetran.connections.states
SET 
state = '{{ state }}'
WHERE 
connection_id = '{{ connection_id }}' --required
RETURNING
state;
```
</TabItem>
</Tabs>
