--- 
title: warnings
hide_title: false
hide_table_of_contents: false
keywords:
  - warnings
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

Creates, updates, deletes, gets or lists a <code>warnings</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="warnings" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.connections.warnings" /></td></tr>
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
    <td><CopyableCode code="schema" /></td>
    <td><code>string</code></td>
    <td>The destination schema name. Omitted for warnings that are not scoped to a specific table. (example: my_schema)</td>
</tr>
<tr>
    <td><CopyableCode code="table" /></td>
    <td><code>string</code></td>
    <td>The destination table name. Omitted for warnings that are not scoped to a specific table. (example: my_table)</td>
</tr>
<tr>
    <td><CopyableCode code="warnings" /></td>
    <td><code>array</code></td>
    <td>List of warnings for this table</td>
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
    <td></td>
    <td>Retrieve all active warnings for a connection, grouped by destination table. Each warning includes a code, message, error details, and creation timestamp.</td>
</tr>
<tr>
    <td><a href="#dismiss"><CopyableCode code="dismiss" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a>, <a href="#parameter-warning_type"><code>warning_type</code></a></td>
    <td></td>
    <td>Dismiss all active warnings of a specific type for a connection. Requires the warning type to be registered in the warning type registry.</td>
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
<tr id="parameter-warning_type">
    <td><CopyableCode code="warning_type" /></td>
    <td><code>string</code></td>
    <td>The warning type to dismiss (e.g., 'resync_table_warning', 'type_coercion_to_null_warning')</td>
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

Retrieve all active warnings for a connection, grouped by destination table. Each warning includes a code, message, error details, and creation timestamp.

```sql
SELECT
"schema",
table,
warnings
FROM fivetran.connections.warnings
WHERE connection_id = '{{ connection_id }}' -- required
;
```
</TabItem>
</Tabs>


## `DELETE` examples

<Tabs
    defaultValue="dismiss"
    values={[
        { label: 'dismiss', value: 'dismiss' }
    ]}
>
<TabItem value="dismiss">

Dismiss all active warnings of a specific type for a connection. Requires the warning type to be registered in the warning type registry.

```sql
DELETE FROM fivetran.connections.warnings
WHERE connection_id = '{{ connection_id }}' --required
AND warning_type = '{{ warning_type }}' --required
;
```
</TabItem>
</Tabs>
