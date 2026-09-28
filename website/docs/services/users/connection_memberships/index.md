--- 
title: connection_memberships
hide_title: false
hide_table_of_contents: false
keywords:
  - connection_memberships
  - users
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

Creates, updates, deletes, gets or lists a <code>connection_memberships</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="connection_memberships" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.users.connection_memberships" /></td></tr>
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
    <td>The membership entity unique identifier (example: resource_id)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp that the user created their Fivetran account (example: 2024-01-01T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="role" /></td>
    <td><code>string</code></td>
    <td>The role the user has within the entity (example: Role Title)</td>
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
    <td>The membership entity unique identifier (example: resource_id)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp that the user created their Fivetran account (example: 2024-01-01T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="role" /></td>
    <td><code>string</code></td>
    <td>The role the user has within the entity (example: Role Title)</td>
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
    <td><a href="#parameter-user_id"><code>user_id</code></a>, <a href="#parameter-connection_id"><code>connection_id</code></a></td>
    <td></td>
    <td>Returns the details of a user's membership in a connection.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-user_id"><code>user_id</code></a></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns all connection membership for a user within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td><a href="#parameter-user_id"><code>user_id</code></a>, <a href="#parameter-id"><code>id</code></a>, <a href="#parameter-role"><code>role</code></a></td>
    <td></td>
    <td>Adds a connection membership</td>
</tr>
<tr>
    <td><a href="#update"><CopyableCode code="update" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-user_id"><code>user_id</code></a>, <a href="#parameter-connection_id"><code>connection_id</code></a>, <a href="#parameter-role"><code>role</code></a></td>
    <td></td>
    <td>Updates user membership in a connection.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-user_id"><code>user_id</code></a>, <a href="#parameter-connection_id"><code>connection_id</code></a></td>
    <td></td>
    <td>Removes user membership in a connection.</td>
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
<tr id="parameter-user_id">
    <td><CopyableCode code="user_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the user within the account.</td>
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

Returns the details of a user's membership in a connection.

```sql
SELECT
id,
created_at,
role
FROM fivetran.users.connection_memberships
WHERE user_id = '{{ user_id }}' -- required
AND connection_id = '{{ connection_id }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns all connection membership for a user within your Fivetran account.

```sql
SELECT
id,
created_at,
role
FROM fivetran.users.connection_memberships
WHERE user_id = '{{ user_id }}' -- required
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

Adds a connection membership

```sql
INSERT INTO fivetran.users.connection_memberships (
id,
role,
user_id
)
SELECT 
'{{ id }}' /* required */,
'{{ role }}' /* required */,
'{{ user_id }}'
RETURNING
id,
created_at,
role
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: connection_memberships
  props:
    - name: user_id
      value: "{{ user_id }}"
      description: Required parameter for the connection_memberships resource.
    - name: id
      value: "{{ id }}"
      description: |
        The membership entity unique identifier
    - name: role
      value: "{{ role }}"
      description: |
        The role that you would like to assign to the user
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

Updates user membership in a connection.

```sql
UPDATE fivetran.users.connection_memberships
SET 
role = '{{ role }}'
WHERE 
user_id = '{{ user_id }}' --required
AND connection_id = '{{ connection_id }}' --required
AND role = '{{ role }}' --required
RETURNING
id,
created_at,
role;
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

Removes user membership in a connection.

```sql
DELETE FROM fivetran.users.connection_memberships
WHERE user_id = '{{ user_id }}' --required
AND connection_id = '{{ connection_id }}' --required
;
```
</TabItem>
</Tabs>
