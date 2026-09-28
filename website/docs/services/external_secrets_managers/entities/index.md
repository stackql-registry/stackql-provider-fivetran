--- 
title: entities
hide_title: false
hide_table_of_contents: false
keywords:
  - entities
  - external_secrets_managers
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

Creates, updates, deletes, gets or lists an <code>entities</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="entities" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.external_secrets_managers.entities" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

<Tabs
    defaultValue="list_by_esm"
    values={[
        { label: 'list_by_esm', value: 'list_by_esm' },
        { label: 'list', value: 'list' }
    ]}
>
<TabItem value="list_by_esm">

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
    <td>The unique identifier of the source connection or destination. (example: connection_id)</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>The schema name of the source connection, or the name of the destination group. (example: my_schema)</td>
</tr>
<tr>
    <td><CopyableCode code="secret_manager_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the External Secrets Manager instance. (example: lucky_tiger)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>Timestamp when the entity was created (example: 2024-01-01T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="enabled" /></td>
    <td><code>boolean</code></td>
    <td>Whether the source connection or destination is currently active and connected.</td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>The type of entity using this External Secrets Manager. Possible values: SOURCE, DESTINATION. (SOURCE, DESTINATION) (example: SOURCE)</td>
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
    <td>The unique identifier of the source connection or destination. (example: connection_id)</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>The schema name of the source connection, or the name of the destination group. (example: my_schema)</td>
</tr>
<tr>
    <td><CopyableCode code="secret_manager_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the External Secrets Manager instance. (example: lucky_tiger)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>Timestamp when the entity was created (example: 2024-01-01T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="enabled" /></td>
    <td><code>boolean</code></td>
    <td>Whether the source connection or destination is currently active and connected.</td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>The type of entity using this External Secrets Manager. Possible values: SOURCE, DESTINATION. (SOURCE, DESTINATION) (example: SOURCE)</td>
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
    <td><a href="#list_by_esm"><CopyableCode code="list_by_esm" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-esm_id"><code>esm_id</code></a></td>
    <td><a href="#parameter-type"><code>type</code></a></td>
    <td>Returns a list of source connections and destinations that are using a specific External Secrets Manager.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-esm_id"><code>esm_id</code></a>, <a href="#parameter-type"><code>type</code></a></td>
    <td>Returns a list of all source connections and destinations that are using any External Secrets Manager within your Fivetran account.</td>
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
<tr id="parameter-esm_id">
    <td><CopyableCode code="esm_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the External Secrets Manager instance.</td>
</tr>
<tr id="parameter-esm_id">
    <td><CopyableCode code="esm_id" /></td>
    <td><code>string</code></td>
    <td>Filter by a specific External Secrets Manager ID.</td>
</tr>
<tr id="parameter-type">
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>Filter by entity type. Accepted values are source, destination, or all.</td>
</tr>
</tbody>
</table>

## `SELECT` examples

<Tabs
    defaultValue="list_by_esm"
    values={[
        { label: 'list_by_esm', value: 'list_by_esm' },
        { label: 'list', value: 'list' }
    ]}
>
<TabItem value="list_by_esm">

Returns a list of source connections and destinations that are using a specific External Secrets Manager.

```sql
SELECT
id,
name,
secret_manager_id,
created_at,
enabled,
type
FROM fivetran.external_secrets_managers.entities
WHERE esm_id = '{{ esm_id }}' -- required
AND type = '{{ type }}'
;
```
</TabItem>
<TabItem value="list">

Returns a list of all source connections and destinations that are using any External Secrets Manager within your Fivetran account.

```sql
SELECT
id,
name,
secret_manager_id,
created_at,
enabled,
type
FROM fivetran.external_secrets_managers.entities
WHERE esm_id = '{{ esm_id }}'
AND type = '{{ type }}'
;
```
</TabItem>
</Tabs>
