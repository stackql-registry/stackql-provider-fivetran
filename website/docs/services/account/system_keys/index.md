--- 
title: system_keys
hide_title: false
hide_table_of_contents: false
keywords:
  - system_keys
  - account
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

Creates, updates, deletes, gets or lists a <code>system_keys</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="system_keys" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.account.system_keys" /></td></tr>
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
    <td>The unique identifier for the system key within the Fivetran system (example: key_id)</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>The system key name within the account (example: MySystemKey)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The system key creation timestamp (example: 2023-08-20T10:15:20.677566Z)</td>
</tr>
<tr>
    <td><CopyableCode code="expired_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The system key expiration timestamp (example: 2024-08-20T10:15:20.677566Z)</td>
</tr>
<tr>
    <td><CopyableCode code="key" /></td>
    <td><code>string</code></td>
    <td>The key value of the system key (example: ft_rDefAFDSgFdAGdFG)</td>
</tr>
<tr>
    <td><CopyableCode code="last_used_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp of last usage (example: 2023-08-20T10:15:20.677566Z)</td>
</tr>
<tr>
    <td><CopyableCode code="permissions" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="secret" /></td>
    <td><code>string</code></td>
    <td>The secret value of rotated system key (example: uytFfdSfDADFgfCgFBVsdCSFg4fsGfFg87fhRuuFASuTHkETSfg)</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The system key update timestamp (example: 2023-08-20T10:15:20.677566Z)</td>
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
    <td>The unique identifier for the system key within the Fivetran system (example: key_id)</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>The system key name within the account (example: MySystemKey)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The system key creation timestamp (example: 2023-08-20T10:15:20.677566Z)</td>
</tr>
<tr>
    <td><CopyableCode code="expired_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The system key expiration timestamp (example: 2024-08-20T10:15:20.677566Z)</td>
</tr>
<tr>
    <td><CopyableCode code="key" /></td>
    <td><code>string</code></td>
    <td>The key value of the system key (example: ft_rDefAFDSgFdAGdFG)</td>
</tr>
<tr>
    <td><CopyableCode code="last_used_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp of last usage (example: 2023-08-20T10:15:20.677566Z)</td>
</tr>
<tr>
    <td><CopyableCode code="permissions" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="secret" /></td>
    <td><code>string</code></td>
    <td>The secret value of rotated system key (example: uytFfdSfDADFgfCgFBVsdCSFg4fsGfFg87fhRuuFASuTHkETSfg)</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The system key update timestamp (example: 2023-08-20T10:15:20.677566Z)</td>
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
    <td><a href="#parameter-key_id"><code>key_id</code></a></td>
    <td></td>
    <td>Retrieves a system key object within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns a list of system keys within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td></td>
    <td></td>
    <td>Creates a new system key with your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#update"><CopyableCode code="update" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-key_id"><code>key_id</code></a></td>
    <td></td>
    <td>Updates an existing system key within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-key_id"><code>key_id</code></a></td>
    <td></td>
    <td>Deletes a system key from your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#rotate"><CopyableCode code="rotate" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-key_id"><code>key_id</code></a></td>
    <td></td>
    <td>Updates the secret value and expired_at date for an existing system key within your Fivetran account.</td>
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
<tr id="parameter-key_id">
    <td><CopyableCode code="key_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the system key within your Fivetran account.</td>
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

Retrieves a system key object within your Fivetran account.

```sql
SELECT
id,
name,
created_at,
expired_at,
key,
last_used_at,
permissions,
secret,
updated_at
FROM fivetran.account.system_keys
WHERE key_id = '{{ key_id }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns a list of system keys within your Fivetran account.

```sql
SELECT
id,
name,
created_at,
expired_at,
key,
last_used_at,
permissions,
secret,
updated_at
FROM fivetran.account.system_keys
WHERE "limit" = '{{ limit }}'
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

Creates a new system key with your Fivetran account.

```sql
INSERT INTO fivetran.account.system_keys (
name,
expiration_period,
permissions
)
SELECT 
'{{ name }}',
'{{ expiration_period }}',
'{{ permissions }}'
RETURNING
id,
name,
created_at,
expired_at,
key,
last_used_at,
permissions,
secret,
updated_at
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: system_keys
  props:
    - name: name
      value: "{{ name }}"
      description: |
        The system key name within the account
    - name: expiration_period
      value: "{{ expiration_period }}"
      description: |
        The system key's expiration period
      valid_values: ['ONE_WEEK', 'ONE_MONTH', 'THREE_MONTHS', 'SIX_MONTHS', 'INFINITE']
    - name: permissions
      value:
        - resource_type: "{{ resource_type }}"
          access_level: "{{ access_level }}"
          resource_filter:
            ids:
              - "{{ ids }}"
            group_ids:
              - "{{ group_ids }}"
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

Updates an existing system key within your Fivetran account.

```sql
UPDATE fivetran.account.system_keys
SET 
name = '{{ name }}',
permissions = '{{ permissions }}'
WHERE 
key_id = '{{ key_id }}' --required
RETURNING
id,
name,
created_at,
expired_at,
key,
last_used_at,
permissions,
secret,
updated_at;
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

Deletes a system key from your Fivetran account.

```sql
DELETE FROM fivetran.account.system_keys
WHERE key_id = '{{ key_id }}' --required
;
```
</TabItem>
</Tabs>


## Lifecycle Methods

EXEC variables use wire (API) names.

<Tabs
    defaultValue="rotate"
    values={[
        { label: 'rotate', value: 'rotate' }
    ]}
>
<TabItem value="rotate">

Updates the secret value and expired_at date for an existing system key within your Fivetran account.

```sql
EXEC fivetran.account.system_keys.rotate 
@key_id='{{ key_id }}' --required 
@@json=
'{
"expiration_period": "{{ expiration_period }}"
}'
;
```
</TabItem>
</Tabs>
