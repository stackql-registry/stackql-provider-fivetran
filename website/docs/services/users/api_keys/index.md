--- 
title: api_keys
hide_title: false
hide_table_of_contents: false
keywords:
  - api_keys
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

Creates, updates, deletes, gets or lists an <code>api_keys</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="api_keys" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.users.api_keys" /></td></tr>
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
    <td><CopyableCode code="user_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the user within the Fivetran system. (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp that the user created their API key (example: 2024-01-01T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="expires_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the API key expires. (example: 2024-04-01T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="key_status" /></td>
    <td><code>string</code></td>
    <td>The status of the API key. Possible values: `ACTIVE`: The key has a single active secret, `ACTIVE_GRACE`:  The key has two active secrets during rotation overlap, and `EXPIRED`: The key has expired. (ACTIVE, ACTIVE_GRACE, EXPIRED) (example: ACTIVE)</td>
</tr>
<tr>
    <td><CopyableCode code="key_value" /></td>
    <td><code>string</code></td>
    <td>The public identifier of the API key. (example: key_abc123)</td>
</tr>
<tr>
    <td><CopyableCode code="last_rotated_at" /></td>
    <td><code>string (date-time)</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="overlap_expires_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the previous secret expires after rotation. Only present during the overlap period. (example: 2024-03-08T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="user_type" /></td>
    <td><code>string</code></td>
    <td>The type of user. Possible values: `REGULAR_USER`: A human user who can log in to the Fivetran dashboard and interact with the API, and `SERVICE_ACCOUNT`: A non-human identity for machine-to-machine API access that cannot log in to the dashboard. (REGULAR_USER, SERVICE_ACCOUNT) (example: SERVICE_ACCOUNT)</td>
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
    <td><CopyableCode code="user_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the user within the Fivetran system. (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp that the user created their API key (example: 2024-01-01T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="expires_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the API key expires. (example: 2024-04-01T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="key_status" /></td>
    <td><code>string</code></td>
    <td>The status of the API key. Possible values: `ACTIVE`: The key has a single active secret, `ACTIVE_GRACE`:  The key has two active secrets during rotation overlap, and `EXPIRED`: The key has expired. (ACTIVE, ACTIVE_GRACE, EXPIRED) (example: ACTIVE)</td>
</tr>
<tr>
    <td><CopyableCode code="key_value" /></td>
    <td><code>string</code></td>
    <td>The public identifier of the API key. (example: key_abc123)</td>
</tr>
<tr>
    <td><CopyableCode code="last_rotated_at" /></td>
    <td><code>string (date-time)</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="overlap_expires_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the previous secret expires after rotation. Only present during the overlap period. (example: 2024-03-08T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="user_type" /></td>
    <td><code>string</code></td>
    <td>The type of user. Possible values: `REGULAR_USER`: A human user who can log in to the Fivetran dashboard and interact with the API, and `SERVICE_ACCOUNT`: A non-human identity for machine-to-machine API access that cannot log in to the dashboard. (REGULAR_USER, SERVICE_ACCOUNT) (example: SERVICE_ACCOUNT)</td>
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
    <td><a href="#parameter-user_id"><code>user_id</code></a></td>
    <td></td>
    <td>Returns the API key details for the specified service account.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a>, <a href="#parameter-user_type"><code>user_type</code></a></td>
    <td>Returns a paginated list of API keys for all users within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td><a href="#parameter-user_id"><code>user_id</code></a></td>
    <td></td>
    <td>Creates a new API key for the specified service account. The secret is&lt;br /&gt;returned once at creation and cannot be retrieved again.&lt;br /&gt;&lt;br /&gt;&gt; Note: Only a regular user can perform this operation.&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-user_id"><code>user_id</code></a></td>
    <td></td>
    <td>Deletes all API keys for the specified user.&lt;br /&gt;&lt;br /&gt;&gt; Note: Only a regular user can perform this operation.&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#rotate"><CopyableCode code="rotate" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-user_id"><code>user_id</code></a></td>
    <td></td>
    <td>Rotates the API key for the specified service account and generates a new secret.&lt;br /&gt;&lt;br /&gt;During the optional overlap period, both the old and new secrets remain valid, allowing zero-downtime credential rotation.&lt;br /&gt;&lt;br /&gt;&gt; Note: Only a regular user can perform this operation.&lt;br /&gt;</td>
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
<tr id="parameter-user_type">
    <td><CopyableCode code="user_type" /></td>
    <td><code>string</code></td>
    <td>The type of user. Possible values: `REGULAR_USER`: A human user who can log in to the Fivetran dashboard and interact with the API, and `SERVICE_ACCOUNT`: A non-human identity for machine-to-machine API access that cannot log in to the dashboard.</td>
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

Returns the API key details for the specified service account.

```sql
SELECT
user_id,
created_at,
expires_at,
key_status,
key_value,
last_rotated_at,
overlap_expires_at,
user_type
FROM fivetran.users.api_keys
WHERE user_id = '{{ user_id }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns a paginated list of API keys for all users within your Fivetran account.

```sql
SELECT
user_id,
created_at,
expires_at,
key_status,
key_value,
last_rotated_at,
overlap_expires_at,
user_type
FROM fivetran.users.api_keys
WHERE "limit" = '{{ limit }}'
AND user_type = '{{ user_type }}'
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

Creates a new API key for the specified service account. The secret is&lt;br /&gt;returned once at creation and cannot be retrieved again.&lt;br /&gt;&lt;br /&gt;&gt; Note: Only a regular user can perform this operation.&lt;br /&gt;

```sql
INSERT INTO fivetran.users.api_keys (
expiration_period_days,
user_id
)
SELECT 
{{ expiration_period_days }},
'{{ user_id }}'
RETURNING
created_at,
expires_at,
key_secret,
key_status,
key_value
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: api_keys
  props:
    - name: user_id
      value: "{{ user_id }}"
      description: Required parameter for the api_keys resource.
    - name: expiration_period_days
      value: {{ expiration_period_days }}
      description: |
        The number of days until the API key expires. Defaults to 90. Maximum is 365.
`}</CodeBlock>

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

Deletes all API keys for the specified user.&lt;br /&gt;&lt;br /&gt;&gt; Note: Only a regular user can perform this operation.&lt;br /&gt;

```sql
DELETE FROM fivetran.users.api_keys
WHERE user_id = '{{ user_id }}' --required
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

Rotates the API key for the specified service account and generates a new secret.&lt;br /&gt;&lt;br /&gt;During the optional overlap period, both the old and new secrets remain valid, allowing zero-downtime credential rotation.&lt;br /&gt;&lt;br /&gt;&gt; Note: Only a regular user can perform this operation.&lt;br /&gt;

```sql
EXEC fivetran.users.api_keys.rotate 
@user_id='{{ user_id }}' --required 
@@json=
'{
"expiration_period_days": {{ expiration_period_days }}, 
"overlap_days": {{ overlap_days }}
}'
;
```
</TabItem>
</Tabs>
