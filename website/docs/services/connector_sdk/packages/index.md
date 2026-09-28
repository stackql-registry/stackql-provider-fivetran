--- 
title: packages
hide_title: false
hide_table_of_contents: false
keywords:
  - packages
  - connector_sdk
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

Creates, updates, deletes, gets or lists a <code>packages</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="packages" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.connector_sdk.packages" /></td></tr>
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
    <td>The unique identifier for the Connector SDK package. (example: package_id)</td>
</tr>
<tr>
    <td><CopyableCode code="connection_id" /></td>
    <td><code>string</code></td>
    <td>The connection identifier associated with this package. Each package can only be associated with one connection at a time. Returns null if the package is not yet associated with any connection. (example: connection_id)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the package was created. (example: 2024-01-14T19:30:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="created_by" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the user who created the package. (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="file_sha256_hash" /></td>
    <td><code>string</code></td>
    <td>The SHA-256 hash of the uploaded package file. Used for integrity verification and change detection. (example: a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2)</td>
</tr>
<tr>
    <td><CopyableCode code="last_updated_by" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the user who last updated the package. (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the package was last updated. (example: 2024-01-14T20:15:00Z)</td>
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
    <td>The unique identifier for the Connector SDK package. (example: package_id)</td>
</tr>
<tr>
    <td><CopyableCode code="connection_id" /></td>
    <td><code>string</code></td>
    <td>The connection identifier associated with this package. Each package can only be associated with one connection at a time. Returns null if the package is not yet associated with any connection. (example: connection_id)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the package was created. (example: 2024-01-14T19:30:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="created_by" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the user who created the package. (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="file_sha256_hash" /></td>
    <td><code>string</code></td>
    <td>The SHA-256 hash of the uploaded package file. Used for integrity verification and change detection. (example: a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2)</td>
</tr>
<tr>
    <td><CopyableCode code="last_updated_by" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the user who last updated the package. (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the package was last updated. (example: 2024-01-14T20:15:00Z)</td>
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
    <td><a href="#parameter-package_id"><code>package_id</code></a></td>
    <td></td>
    <td>Returns details for a specific Connector SDK package.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns a list of all Connector SDK packages in your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-package_id"><code>package_id</code></a></td>
    <td></td>
    <td>Permanently deletes a Connector SDK package from your Fivetran account.&lt;br /&gt;&lt;br /&gt;&gt; **Warning:** Packages that are associated with a connection cannot be deleted. You must first delete the connection before deleting the package.&lt;br /&gt;</td>
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
<tr id="parameter-package_id">
    <td><CopyableCode code="package_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the Connector SDK package.</td>
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

Returns details for a specific Connector SDK package.

```sql
SELECT
id,
connection_id,
created_at,
created_by,
file_sha256_hash,
last_updated_by,
updated_at
FROM fivetran.connector_sdk.packages
WHERE package_id = '{{ package_id }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns a list of all Connector SDK packages in your Fivetran account.

```sql
SELECT
id,
connection_id,
created_at,
created_by,
file_sha256_hash,
last_updated_by,
updated_at
FROM fivetran.connector_sdk.packages
WHERE "limit" = '{{ limit }}'
;
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

Permanently deletes a Connector SDK package from your Fivetran account.&lt;br /&gt;&lt;br /&gt;&gt; **Warning:** Packages that are associated with a connection cannot be deleted. You must first delete the connection before deleting the package.&lt;br /&gt;

```sql
DELETE FROM fivetran.connector_sdk.packages
WHERE package_id = '{{ package_id }}' --required
;
```
</TabItem>
</Tabs>
