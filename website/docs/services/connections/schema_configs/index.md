--- 
title: schema_configs
hide_title: false
hide_table_of_contents: false
keywords:
  - schema_configs
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

Creates, updates, deletes, gets or lists a <code>schema_configs</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="schema_configs" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.connections.schema_configs" /></td></tr>
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
    <td><CopyableCode code="enable_new_by_default" /></td>
    <td><code>boolean</code></td>
    <td>The boolean value specifying whether to enable new schemas, tables, and columns by default</td>
</tr>
<tr>
    <td><CopyableCode code="row_filtering_supported" /></td>
    <td><code>boolean</code></td>
    <td>A boolean value that specifies whether row filtering is available for the tables in this connection. It is `true` only when the row filtering feature is enabled for the connection, the connector type supports row filtering. It is `false` when the connector type does not support row filtering. This field is omitted from the response when the row filtering feature is not enabled for the connection.</td>
</tr>
<tr>
    <td><CopyableCode code="schema_change_handling" /></td>
    <td><code>string</code></td>
    <td>The possible values for the schema_change_handling parameter are as follows: &lt;br /&gt; - `ALLOW_ALL` - all new schemas, tables, and columns which appear in the source after the initial setup are included in syncs &lt;br /&gt; - `ALLOW_COLUMNS` - all new schemas and tables which appear in the source after the initial setup are excluded from syncs, but new columns are included &lt;br /&gt; - `BLOCK_ALL` - all new schemas, tables, and columns which appear in the source after the initial setup are excluded from syncs (ALLOW_ALL, ALLOW_COLUMNS, BLOCK_ALL) (example: ALLOW_ALL)</td>
</tr>
<tr>
    <td><CopyableCode code="schemas" /></td>
    <td><code>object</code></td>
    <td>The set of schemas within your connection schema config. Each key is the schema name as stored in the connection schema config. Schema names are case-sensitive; an incorrect case results in an HTTP 404 error. (title: Schemas)</td>
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
    <td>&lt;br /&gt;Returns the top-level schema configuration for an existing connection within your Fivetran account. The response includes global flags, every schema, each table, and only the columns that were explicitly overridden. &lt;br /&gt;&lt;br /&gt;Use this endpoint to read the current data-selection tree for a connection, to back up the schema before making edits, or to copy the configuration to another connection.&lt;br /&gt;&lt;br /&gt;&gt; NOTE: To restore a backed-up schema or copy the configuration to another connection, use the &#91;Update a Connection Schema Config&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connection-schema/modify-connection-schema-config) endpoint.&lt;br /&gt;&lt;br /&gt;For more information, see the &#91;Connection Schema config&#93;(https:​//fivetran.com/docs/rest-api/tutorials/connection-schema-configuration-use-cases) tutorial.&lt;br /&gt;&lt;br /&gt;&gt; NOTE: Unedited columns (those following table defaults) are omitted from the response. For a read-only cataloging workflow, walk this response from schemas to tables, inspect each table's `supports_columns_config` field, and call the &#91;Retrieve Source Table Columns Config&#93;(https:​//fivetran.com/docs/rest-api/api-reference/connection-schema/connection-column-config) endpoint only for tables where that field is `true`.&lt;br /&gt;&lt;br /&gt;For the NetSuite SuiteAnalytics, and Salesforce and Salesforce Sandbox connectors, the 'schemas' map field contains a single entry with the 'netsuite' or 'salesforce' key, respectively. For the 'schema.name_in_destination` name field, these connectors always return the destination schema name you set in the connection setup form.&lt;br /&gt;&lt;br /&gt;For more information on using this API endpoint with the the Oracle Fusion Cloud Applications connectors, see the &#91;Schema information documentation&#93;(https:​//fivetran.com/docs/connectors/applications/oracle-fusion-cloud-applications#schemainformation).&lt;br /&gt;&lt;br /&gt;&gt; IMPORTANT: This endpoint does not apply to &#91;Magic Folder&#93;(https:​//fivetran.com/docs/connectors/files#magicfolder) connectors.&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a>, <a href="#parameter-schemas"><code>schemas</code></a></td>
    <td></td>
    <td>Configures a Connection Schema for a new connection before the schema is captured from the source.&lt;br /&gt;&lt;br /&gt;&gt; NOTE: The response returns the exact settings provided in the request.&lt;br /&gt;&lt;br /&gt;After the initial sync, when the connection captures the schema from the source, Fivetran attempts to apply the specified settings to the actual schema.&lt;br /&gt;If certain tables or columns cannot be excluded, the settings for those entities are ignored.&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#update_table"><CopyableCode code="update_table" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a>, <a href="#parameter-schema_name"><code>schema_name</code></a>, <a href="#parameter-table_name"><code>table_name</code></a>, <a href="#parameter-enabled"><code>enabled</code></a></td>
    <td></td>
    <td>Updates the table config within your database schema for an existing connection within your Fivetran account.&lt;br /&gt;&lt;br /&gt;For the NetSuite SuiteAnalytics and Salesforce and Salesforce Sandbox connectors, the 'schemas' map field will always have a single entry with the 'netsuite' or 'salesforce' key, respectively.&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#update_schema"><CopyableCode code="update_schema" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a>, <a href="#parameter-schema_name"><code>schema_name</code></a>, <a href="#parameter-enabled"><code>enabled</code></a></td>
    <td></td>
    <td>Updates the database schema config for an existing connection within your Fivetran account (for a single schema within a connection with multiple schemas). &lt;br /&gt;&lt;br /&gt;&gt; NOTE: The response contains all known schemas and tables. Also, it contains columns whose state has ever been set by the user. For more information, see also the &#91;Connection Schema config&#93;(https:​//fivetran.com/docs/rest-api/tutorials/connection-schema-configuration-use-cases) tutorial. &lt;br /&gt;&lt;br /&gt;In this API call, the NetSuite SuiteAnalytics, Salesforce and Salesforce Sandbox connectors always return the schema name as 'netsuite' and 'salesforce', respectively. &lt;br /&gt;&lt;br /&gt;For more information about this API call for the Oracle Fusion Cloud Applications connectors, see our &#91;Schema information&#93;(https:​//fivetran.com/docs/connectors/applications/oracle-fusion-cloud-applications#schemainformation) documentation.&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#update"><CopyableCode code="update" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a></td>
    <td></td>
    <td>Updates the schema config for an existing connection within your Fivetran account.&lt;br /&gt;&lt;br /&gt;&gt; NOTE: For backward compatibility, the response may contain the 'enable_new_by_default' boolean field. It defines whether new schemas and tables discovered in the source are synced. The value is 'true' if you specify 'ALLOW_ALL' as a value of 'schema_change_handling'. In the future API versions, we may remove this field.&lt;br /&gt;&gt;&lt;br /&gt;&gt; The response contains all known schemas and tables. Also, it contains columns whose state has ever been set by the user. For more information, see also the &#91;Connection Schema config&#93;(https:​//fivetran.com/docs/rest-api/tutorials/connection-schema-configuration-use-cases) tutorial.&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#drop_columns"><CopyableCode code="drop_columns" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a>, <a href="#parameter-schemas"><code>schemas</code></a></td>
    <td></td>
    <td>Mark multiple blocked columns for deletion from your destination tables. The columns will be dropped during the next sync.</td>
</tr>
<tr>
    <td><a href="#reload"><CopyableCode code="reload" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a></td>
    <td></td>
    <td>Reloads the connection schema config for an existing connection within your Fivetran account.&lt;br /&gt;&lt;br /&gt;&gt; NOTE: This method reloads the full schema from the connection's data source. It may take a long time to complete the request. The method execution speed depends on the schema size and the number of databases, tables, and columns.&lt;br /&gt;&gt;&lt;br /&gt;&gt; The response contains all known schemas and tables. Also, it contains columns whose state has ever been set by the user. For more information, see also the &#91;Connection Schema config&#93;(https:​//fivetran.com/docs/rest-api/tutorials/connection-schema-configuration-use-cases) tutorial.&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#resync_tables"><CopyableCode code="resync_tables" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a></td>
    <td></td>
    <td>Triggers a historical sync of all data for multiple schema tables within a connection. This action does not override the standard sync frequency you defined in the Fivetran dashboard.</td>
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

<br />Returns the top-level schema configuration for an existing connection within your Fivetran account. The response includes global flags, every schema, each table, and only the columns that were explicitly overridden. <br /><br />Use this endpoint to read the current data-selection tree for a connection, to back up the schema before making edits, or to copy the configuration to another connection.<br /><br />&gt; NOTE: To restore a backed-up schema or copy the configuration to another connection, use the [Update a Connection Schema Config](https://fivetran.com/docs/rest-api/api-reference/connection-schema/modify-connection-schema-config) endpoint.<br /><br />For more information, see the [Connection Schema config](https://fivetran.com/docs/rest-api/tutorials/connection-schema-configuration-use-cases) tutorial.<br /><br />&gt; NOTE: Unedited columns (those following table defaults) are omitted from the response. For a read-only cataloging workflow, walk this response from schemas to tables, inspect each table's `supports_columns_config` field, and call the [Retrieve Source Table Columns Config](https://fivetran.com/docs/rest-api/api-reference/connection-schema/connection-column-config) endpoint only for tables where that field is `true`.<br /><br />For the NetSuite SuiteAnalytics, and Salesforce and Salesforce Sandbox connectors, the 'schemas' map field contains a single entry with the 'netsuite' or 'salesforce' key, respectively. For the 'schema.name_in_destination` name field, these connectors always return the destination schema name you set in the connection setup form.<br /><br />For more information on using this API endpoint with the the Oracle Fusion Cloud Applications connectors, see the [Schema information documentation](https://fivetran.com/docs/connectors/applications/oracle-fusion-cloud-applications#schemainformation).<br /><br />&gt; IMPORTANT: This endpoint does not apply to [Magic Folder](https://fivetran.com/docs/connectors/files#magicfolder) connectors.<br />

```sql
SELECT
enable_new_by_default,
row_filtering_supported,
schema_change_handling,
schemas
FROM fivetran.connections.schema_configs
WHERE connection_id = '{{ connection_id }}' -- required
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

Configures a Connection Schema for a new connection before the schema is captured from the source.&lt;br /&gt;&lt;br /&gt;&gt; NOTE: The response returns the exact settings provided in the request.&lt;br /&gt;&lt;br /&gt;After the initial sync, when the connection captures the schema from the source, Fivetran attempts to apply the specified settings to the actual schema.&lt;br /&gt;If certain tables or columns cannot be excluded, the settings for those entities are ignored.&lt;br /&gt;

```sql
INSERT INTO fivetran.connections.schema_configs (
schemas,
schema_change_handling,
connection_id
)
SELECT 
'{{ schemas }}' /* required */,
'{{ schema_change_handling }}',
'{{ connection_id }}'
RETURNING
enable_new_by_default,
row_filtering_supported,
schema_change_handling,
schemas
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: schema_configs
  props:
    - name: connection_id
      value: "{{ connection_id }}"
      description: Required parameter for the schema_configs resource.
    - name: schemas
      value: "{{ schemas }}"
      description: |
        The set of schemas within your connection schema config. Each key is the schema name as stored in the connection schema config. Schema names are case-sensitive; an incorrect case results in an HTTP 404 error.
    - name: schema_change_handling
      value: "{{ schema_change_handling }}"
      description: |
        The possible values for the schema_change_handling parameter are as follows: <br /> - \`ALLOW_ALL\` - all new schemas, tables, and columns which appear in the source after the initial setup are included in syncs <br /> - \`ALLOW_COLUMNS\` - all new schemas and tables which appear in the source after the initial setup are excluded from syncs, but new columns are included <br /> - \`BLOCK_ALL\` - all new schemas, tables, and columns which appear in the source after the initial setup are excluded from syncs
      valid_values: ['ALLOW_ALL', 'ALLOW_COLUMNS', 'BLOCK_ALL']
`}</CodeBlock>

</TabItem>
</Tabs>


## `UPDATE` examples

<Tabs
    defaultValue="update_table"
    values={[
        { label: 'update_table', value: 'update_table' },
        { label: 'update_schema', value: 'update_schema' },
        { label: 'update', value: 'update' }
    ]}
>
<TabItem value="update_table">

Updates the table config within your database schema for an existing connection within your Fivetran account.&lt;br /&gt;&lt;br /&gt;For the NetSuite SuiteAnalytics and Salesforce and Salesforce Sandbox connectors, the 'schemas' map field will always have a single entry with the 'netsuite' or 'salesforce' key, respectively.&lt;br /&gt;

```sql
UPDATE fivetran.connections.schema_configs
SET 
enabled = {{ enabled }},
columns = '{{ columns }}',
sync_mode = '{{ sync_mode }}',
row_filter = '{{ row_filter }}'
WHERE 
connection_id = '{{ connection_id }}' --required
AND schema_name = '{{ schema_name }}' --required
AND table_name = '{{ table_name }}' --required
AND enabled = {{ enabled }} --required
RETURNING
enable_new_by_default,
row_filtering_supported,
schema_change_handling,
schemas;
```
</TabItem>
<TabItem value="update_schema">

Updates the database schema config for an existing connection within your Fivetran account (for a single schema within a connection with multiple schemas). &lt;br /&gt;&lt;br /&gt;&gt; NOTE: The response contains all known schemas and tables. Also, it contains columns whose state has ever been set by the user. For more information, see also the &#91;Connection Schema config&#93;(https:​//fivetran.com/docs/rest-api/tutorials/connection-schema-configuration-use-cases) tutorial. &lt;br /&gt;&lt;br /&gt;In this API call, the NetSuite SuiteAnalytics, Salesforce and Salesforce Sandbox connectors always return the schema name as 'netsuite' and 'salesforce', respectively. &lt;br /&gt;&lt;br /&gt;For more information about this API call for the Oracle Fusion Cloud Applications connectors, see our &#91;Schema information&#93;(https:​//fivetran.com/docs/connectors/applications/oracle-fusion-cloud-applications#schemainformation) documentation.&lt;br /&gt;

```sql
UPDATE fivetran.connections.schema_configs
SET 
enabled = {{ enabled }},
tables = '{{ tables }}'
WHERE 
connection_id = '{{ connection_id }}' --required
AND schema_name = '{{ schema_name }}' --required
AND enabled = {{ enabled }} --required
RETURNING
enable_new_by_default,
row_filtering_supported,
schema_change_handling,
schemas;
```
</TabItem>
<TabItem value="update">

Updates the schema config for an existing connection within your Fivetran account.&lt;br /&gt;&lt;br /&gt;&gt; NOTE: For backward compatibility, the response may contain the 'enable_new_by_default' boolean field. It defines whether new schemas and tables discovered in the source are synced. The value is 'true' if you specify 'ALLOW_ALL' as a value of 'schema_change_handling'. In the future API versions, we may remove this field.&lt;br /&gt;&gt;&lt;br /&gt;&gt; The response contains all known schemas and tables. Also, it contains columns whose state has ever been set by the user. For more information, see also the &#91;Connection Schema config&#93;(https:​//fivetran.com/docs/rest-api/tutorials/connection-schema-configuration-use-cases) tutorial.&lt;br /&gt;

```sql
UPDATE fivetran.connections.schema_configs
SET 
schemas = '{{ schemas }}',
schema_change_handling = '{{ schema_change_handling }}',
is_type_locked = {{ is_type_locked }}
WHERE 
connection_id = '{{ connection_id }}' --required
RETURNING
enable_new_by_default,
row_filtering_supported,
schema_change_handling,
schemas;
```
</TabItem>
</Tabs>


## Lifecycle Methods

EXEC variables use wire (API) names.

<Tabs
    defaultValue="drop_columns"
    values={[
        { label: 'drop_columns', value: 'drop_columns' },
        { label: 'reload', value: 'reload' },
        { label: 'resync_tables', value: 'resync_tables' }
    ]}
>
<TabItem value="drop_columns">

Mark multiple blocked columns for deletion from your destination tables. The columns will be dropped during the next sync.

```sql
EXEC fivetran.connections.schema_configs.drop_columns 
@connection_id='{{ connection_id }}' --required 
@@json=
'{
"schemas": "{{ schemas }}"
}'
;
```
</TabItem>
<TabItem value="reload">

Reloads the connection schema config for an existing connection within your Fivetran account.&lt;br /&gt;&lt;br /&gt;&gt; NOTE: This method reloads the full schema from the connection's data source. It may take a long time to complete the request. The method execution speed depends on the schema size and the number of databases, tables, and columns.&lt;br /&gt;&gt;&lt;br /&gt;&gt; The response contains all known schemas and tables. Also, it contains columns whose state has ever been set by the user. For more information, see also the &#91;Connection Schema config&#93;(https:​//fivetran.com/docs/rest-api/tutorials/connection-schema-configuration-use-cases) tutorial.&lt;br /&gt;

```sql
EXEC fivetran.connections.schema_configs.reload 
@connection_id='{{ connection_id }}' --required 
@@json=
'{
"exclude_mode": "{{ exclude_mode }}"
}'
;
```
</TabItem>
<TabItem value="resync_tables">

Triggers a historical sync of all data for multiple schema tables within a connection. This action does not override the standard sync frequency you defined in the Fivetran dashboard.

```sql
EXEC fivetran.connections.schema_configs.resync_tables 
@connection_id='{{ connection_id }}' --required 
@@json=
'{
"schema": "{{ schema }}"
}'
;
```
</TabItem>
</Tabs>
