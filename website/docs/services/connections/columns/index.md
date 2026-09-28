--- 
title: columns
hide_title: false
hide_table_of_contents: false
keywords:
  - columns
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

Creates, updates, deletes, gets or lists a <code>columns</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="columns" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.connections.columns" /></td></tr>
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
    <td><CopyableCode code="columns" /></td>
    <td><code>object</code></td>
    <td>The set of columns within your table schema config. Each key is the column name as stored in the connection schema config. Column names are case-sensitive; an incorrect case results in an HTTP 404 error. The `columns` object in the response contains the columns whose `enabled` value has been set by the user after the initial sync. (title: Columns)</td>
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
    <td><a href="#parameter-connection_id"><code>connection_id</code></a>, <a href="#parameter-schema_name"><code>schema_name</code></a>, <a href="#parameter-table_name"><code>table_name</code></a></td>
    <td></td>
    <td>Returns the real-time column list for one source table by querying the source. The response includes the current enabled and hashed flags, and the patchable fields.&lt;br /&gt;&lt;br /&gt;To determine whether this endpoint is available for a table, first &#91;retrieve the connection schema config&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connection-schema/connection-schema-config) and check the table's public &#91;`supports_columns_config` response field&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connection-schema/connection-schema-config#supports_columns_config). Column-level schema metadata support is reported per table rather than as a static connector-wide list. If `supports_columns_config` is `false`, column metadata is not available for that table.&lt;br /&gt;&lt;br /&gt;&gt; NOTE: This endpoint works only for an existing connection that is in a 'Connected' state.&lt;br /&gt;&lt;br /&gt;&gt; NOTE: The connection schema config response includes every schema and table, but includes only columns that were explicitly overridden. Use this endpoint when you need the exhaustive real-time column list for a table that supports column-level configuration.&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#update"><CopyableCode code="update" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a>, <a href="#parameter-schema_name"><code>schema_name</code></a>, <a href="#parameter-table_name"><code>table_name</code></a>, <a href="#parameter-column_name"><code>column_name</code></a>, <a href="#parameter-enabled"><code>enabled</code></a></td>
    <td></td>
    <td>Updates the column config within your table for an existing connection within your Fivetran account.&lt;br /&gt;&lt;br /&gt;For the NetSuite SuiteAnalytics and Salesforce and Salesforce Sandbox connectors, the 'schemas' map field will always have a single entry with the 'netsuite' or 'salesforce' key, respectively.&lt;br /&gt;&gt; NOTE: The response contains all known schemas and tables. Also, it contains columns whose state has ever been set by the user. For more information, see also the &#91;Connection Schema config&#93;(https:​//fivetran.com/docs/rest-api/tutorials/connection-schema-configuration-use-cases) tutorial.&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a>, <a href="#parameter-schema_name"><code>schema_name</code></a>, <a href="#parameter-table_name"><code>table_name</code></a>, <a href="#parameter-column_name"><code>column_name</code></a></td>
    <td></td>
    <td>Marks a blocked column for deletion from your destination table. The column will be dropped during the next sync.&lt;br /&gt;&lt;br /&gt;For the NetSuite SuiteAnalytics and Salesforce and Salesforce Sandbox connectors, the 'schemas' map field will always have a single entry with the 'netsuite' or 'salesforce' key, respectively.&lt;br /&gt;</td>
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
<tr id="parameter-column_name">
    <td><CopyableCode code="column_name" /></td>
    <td><code>string</code></td>
    <td>The column name as stored in the connection schema config. This value is case-sensitive; an incorrect case results in an HTTP 404 error.</td>
</tr>
<tr id="parameter-connection_id">
    <td><CopyableCode code="connection_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the connection. Retrieve it from the `id` field in the &#91;List All Connections&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/list-connections) response, or from the `id` field returned when you &#91;Create a Connection&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connections/create-connection).</td>
</tr>
<tr id="parameter-schema_name">
    <td><CopyableCode code="schema_name" /></td>
    <td><code>string</code></td>
    <td>The schema name as stored in the connection schema config. This value is case-sensitive; an incorrect case results in an HTTP 404 error.</td>
</tr>
<tr id="parameter-table_name">
    <td><CopyableCode code="table_name" /></td>
    <td><code>string</code></td>
    <td>The table name as stored in the connection schema config. This value is case-sensitive; an incorrect case results in an HTTP 404 error.</td>
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

Returns the real-time column list for one source table by querying the source. The response includes the current enabled and hashed flags, and the patchable fields.&lt;br /&gt;&lt;br /&gt;To determine whether this endpoint is available for a table, first &#91;retrieve the connection schema config&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connection-schema/connection-schema-config) and check the table's public &#91;`supports_columns_config` response field&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connection-schema/connection-schema-config#supports_columns_config). Column-level schema metadata support is reported per table rather than as a static connector-wide list. If `supports_columns_config` is `false`, column metadata is not available for that table.&lt;br /&gt;&lt;br /&gt;&gt; NOTE: This endpoint works only for an existing connection that is in a 'Connected' state.&lt;br /&gt;&lt;br /&gt;&gt; NOTE: The connection schema config response includes every schema and table, but includes only columns that were explicitly overridden. Use this endpoint when you need the exhaustive real-time column list for a table that supports column-level configuration.&lt;br /&gt;

```sql
SELECT
columns
FROM fivetran.connections.columns
WHERE connection_id = '{{ connection_id }}' -- required
AND schema_name = '{{ schema_name }}' -- required
AND table_name = '{{ table_name }}' -- required
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

Updates the column config within your table for an existing connection within your Fivetran account.&lt;br /&gt;&lt;br /&gt;For the NetSuite SuiteAnalytics and Salesforce and Salesforce Sandbox connectors, the 'schemas' map field will always have a single entry with the 'netsuite' or 'salesforce' key, respectively.&lt;br /&gt;&gt; NOTE: The response contains all known schemas and tables. Also, it contains columns whose state has ever been set by the user. For more information, see also the &#91;Connection Schema config&#93;(https:​//fivetran.com/docs/rest-api/tutorials/connection-schema-configuration-use-cases) tutorial.&lt;br /&gt;

```sql
UPDATE fivetran.connections.columns
SET 
enabled = {{ enabled }},
hashed = {{ hashed }},
is_primary_key = {{ is_primary_key }},
target_data_type = '{{ target_data_type }}'
WHERE 
connection_id = '{{ connection_id }}' --required
AND schema_name = '{{ schema_name }}' --required
AND table_name = '{{ table_name }}' --required
AND column_name = '{{ column_name }}' --required
AND enabled = {{ enabled }} --required
RETURNING
enable_new_by_default,
row_filtering_supported,
schema_change_handling,
schemas;
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

Marks a blocked column for deletion from your destination table. The column will be dropped during the next sync.&lt;br /&gt;&lt;br /&gt;For the NetSuite SuiteAnalytics and Salesforce and Salesforce Sandbox connectors, the 'schemas' map field will always have a single entry with the 'netsuite' or 'salesforce' key, respectively.&lt;br /&gt;

```sql
DELETE FROM fivetran.connections.columns
WHERE connection_id = '{{ connection_id }}' --required
AND schema_name = '{{ schema_name }}' --required
AND table_name = '{{ table_name }}' --required
AND column_name = '{{ column_name }}' --required
;
```
</TabItem>
</Tabs>
