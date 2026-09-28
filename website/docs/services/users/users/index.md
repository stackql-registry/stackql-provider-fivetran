--- 
title: users
hide_title: false
hide_table_of_contents: false
keywords:
  - users
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

Creates, updates, deletes, gets or lists a <code>users</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="users" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.users.users" /></td></tr>
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
    <td>The unique identifier for the user within the Fivetran system. (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="family_name" /></td>
    <td><code>string</code></td>
    <td>The last name of the user. (example: Doe)</td>
</tr>
<tr>
    <td><CopyableCode code="given_name" /></td>
    <td><code>string</code></td>
    <td>The first name of the user. (example: John)</td>
</tr>
<tr>
    <td><CopyableCode code="active" /></td>
    <td><code>boolean</code></td>
    <td>The field indicates if the user is an active Fivetran account user.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp that the user created their Fivetran account (example: 2024-01-01T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="email" /></td>
    <td><code>string</code></td>
    <td>The email address that the user has associated with their user profile. Optional for service accounts (`user_type: SERVICE_ACCOUNT`). (example: user@email.value)</td>
</tr>
<tr>
    <td><CopyableCode code="has_api_key" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the user has an assigned API key, including expired keys. Accepted values: `true` or `false`.</td>
</tr>
<tr>
    <td><CopyableCode code="invited" /></td>
    <td><code>boolean</code></td>
    <td>The field indicates whether the user has been invited to your account.</td>
</tr>
<tr>
    <td><CopyableCode code="logged_in_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The last time that the user has logged into their Fivetran account. (example: 2024-01-01T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="phone" /></td>
    <td><code>string</code></td>
    <td>The phone number of the user. (example: +1234567890)</td>
</tr>
<tr>
    <td><CopyableCode code="picture" /></td>
    <td><code>string</code></td>
    <td>The user's avatar as a URL link (for example, 'http:&lt;!-- --&gt;//mycompany.com/avatars/john_white.png') or base64 data URI (for example, 'data:image/png;base64,aHR0cDovL215Y29tcGFueS5jb20vYXZhdGFycy9qb2huX3doaXRlLnBuZw==') (example: AFg65aoa7af4r3feaAa6bi7se ... base64 encoded image ... blDFSs87gQ==)</td>
</tr>
<tr>
    <td><CopyableCode code="role" /></td>
    <td><code>string</code></td>
    <td>The role that you would like to assign to the user  (example: Account Administrator)</td>
</tr>
<tr>
    <td><CopyableCode code="user_type" /></td>
    <td><code>string</code></td>
    <td>The type of user. Possible values: `REGULAR_USER`: A human user who can log in to the Fivetran dashboard and interact with the API, and `SERVICE_ACCOUNT`: A non-human identity for machine-to-machine API access that cannot log in to the dashboard. (REGULAR_USER, SERVICE_ACCOUNT) (example: SERVICE_ACCOUNT)</td>
</tr>
<tr>
    <td><CopyableCode code="verified" /></td>
    <td><code>boolean</code></td>
    <td>The field indicates whether the user has verified their email address in the account creation process.</td>
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
    <td>The unique identifier for the user within the Fivetran system. (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="family_name" /></td>
    <td><code>string</code></td>
    <td>The last name of the user. (example: Doe)</td>
</tr>
<tr>
    <td><CopyableCode code="given_name" /></td>
    <td><code>string</code></td>
    <td>The first name of the user. (example: John)</td>
</tr>
<tr>
    <td><CopyableCode code="active" /></td>
    <td><code>boolean</code></td>
    <td>The field indicates if the user is an active Fivetran account user.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp that the user created their Fivetran account (example: 2024-01-01T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="email" /></td>
    <td><code>string</code></td>
    <td>The email address that the user has associated with their user profile. Optional for service accounts (`user_type: SERVICE_ACCOUNT`). (example: user@email.value)</td>
</tr>
<tr>
    <td><CopyableCode code="has_api_key" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether the user has an assigned API key, including expired keys. Accepted values: `true` or `false`.</td>
</tr>
<tr>
    <td><CopyableCode code="invited" /></td>
    <td><code>boolean</code></td>
    <td>The field indicates whether the user has been invited to your account.</td>
</tr>
<tr>
    <td><CopyableCode code="logged_in_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The last time that the user has logged into their Fivetran account. (example: 2024-01-01T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="phone" /></td>
    <td><code>string</code></td>
    <td>The phone number of the user. (example: +1234567890)</td>
</tr>
<tr>
    <td><CopyableCode code="picture" /></td>
    <td><code>string</code></td>
    <td>The user's avatar as a URL link (for example, 'http:&lt;!-- --&gt;//mycompany.com/avatars/john_white.png') or base64 data URI (for example, 'data:image/png;base64,aHR0cDovL215Y29tcGFueS5jb20vYXZhdGFycy9qb2huX3doaXRlLnBuZw==') (example: AFg65aoa7af4r3feaAa6bi7se ... base64 encoded image ... blDFSs87gQ==)</td>
</tr>
<tr>
    <td><CopyableCode code="role" /></td>
    <td><code>string</code></td>
    <td>The role that you would like to assign to the user  (example: Account Administrator)</td>
</tr>
<tr>
    <td><CopyableCode code="user_type" /></td>
    <td><code>string</code></td>
    <td>The type of user. Possible values: `REGULAR_USER`: A human user who can log in to the Fivetran dashboard and interact with the API, and `SERVICE_ACCOUNT`: A non-human identity for machine-to-machine API access that cannot log in to the dashboard. (REGULAR_USER, SERVICE_ACCOUNT) (example: SERVICE_ACCOUNT)</td>
</tr>
<tr>
    <td><CopyableCode code="verified" /></td>
    <td><code>boolean</code></td>
    <td>The field indicates whether the user has verified their email address in the account creation process.</td>
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
    <td>Returns a user object if a valid identifier was provided.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a>, <a href="#parameter-active"><code>active</code></a>, <a href="#parameter-user_type"><code>user_type</code></a>, <a href="#parameter-has_api_key"><code>has_api_key</code></a></td>
    <td>Returns a list of all users within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td><a href="#parameter-email"><code>email</code></a>, <a href="#parameter-family_name"><code>family_name</code></a>, <a href="#parameter-given_name"><code>given_name</code></a></td>
    <td></td>
    <td>Creates a new user in your Fivetran account.&lt;br /&gt;&lt;br /&gt;For a regular user, an invitation email is sent, and the user must accept it before gaining access; their details are accessible through the API in the meantime.&lt;br /&gt;&lt;br /&gt;For a service account, the user gets created immediately with no invitation or email validation required.&lt;br /&gt;&lt;br /&gt;&gt; Note: A service account user can't create another service account user.&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#update"><CopyableCode code="update" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-user_id"><code>user_id</code></a></td>
    <td></td>
    <td>Updates information for an existing user within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-user_id"><code>user_id</code></a></td>
    <td></td>
    <td>Deletes a user from your Fivetran account. You will be unable to delete an account owner user if there is only one remaining.</td>
</tr>
<tr>
    <td><a href="#remove_account_role"><CopyableCode code="remove_account_role" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-user_id"><code>user_id</code></a></td>
    <td></td>
    <td>Removes a user's role from an account, but the user remains a member of the account.</td>
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
<tr id="parameter-active">
    <td><CopyableCode code="active" /></td>
    <td><code>boolean</code></td>
    <td>Indicates whether to return only enabled users (true) or not (false). By default, both enabled (allowed to log in) and suspended users are returned.</td>
</tr>
<tr id="parameter-cursor">
    <td><CopyableCode code="cursor" /></td>
    <td><code>string</code></td>
    <td>Paging cursor, &#91;read more about pagination&#93;(https:​//fivetran.com/docs/rest-api/pagination)</td>
</tr>
<tr id="parameter-has_api_key">
    <td><CopyableCode code="has_api_key" /></td>
    <td><code>string</code></td>
    <td>Indicates whether the user has an assigned API key, including expired keys. Accepted values: `true` or `false`.</td>
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

Returns a user object if a valid identifier was provided.

```sql
SELECT
id,
family_name,
given_name,
active,
created_at,
email,
has_api_key,
invited,
logged_in_at,
phone,
picture,
role,
user_type,
verified
FROM fivetran.users.users
WHERE user_id = '{{ user_id }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns a list of all users within your Fivetran account.

```sql
SELECT
id,
family_name,
given_name,
active,
created_at,
email,
has_api_key,
invited,
logged_in_at,
phone,
picture,
role,
user_type,
verified
FROM fivetran.users.users
WHERE "limit" = '{{ limit }}'
AND active = '{{ active }}'
AND user_type = '{{ user_type }}'
AND has_api_key = '{{ has_api_key }}'
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

Creates a new user in your Fivetran account.&lt;br /&gt;&lt;br /&gt;For a regular user, an invitation email is sent, and the user must accept it before gaining access; their details are accessible through the API in the meantime.&lt;br /&gt;&lt;br /&gt;For a service account, the user gets created immediately with no invitation or email validation required.&lt;br /&gt;&lt;br /&gt;&gt; Note: A service account user can't create another service account user.&lt;br /&gt;

```sql
INSERT INTO fivetran.users.users (
email,
family_name,
given_name,
phone,
picture,
role,
user_type
)
SELECT 
'{{ email }}' /* required */,
'{{ family_name }}' /* required */,
'{{ given_name }}' /* required */,
'{{ phone }}',
'{{ picture }}',
'{{ role }}',
'{{ user_type }}'
RETURNING
id,
family_name,
given_name,
active,
created_at,
email,
has_api_key,
invited,
logged_in_at,
phone,
picture,
role,
user_type,
verified
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: users
  props:
    - name: email
      value: "{{ email }}"
      description: |
        The email address that the user has associated with their user profile. Optional for service accounts (\`user_type: SERVICE_ACCOUNT\`).
    - name: family_name
      value: "{{ family_name }}"
      description: |
        The last name of the user.
    - name: given_name
      value: "{{ given_name }}"
      description: |
        The first name of the user.
    - name: phone
      value: "{{ phone }}"
      description: |
        The phone number of the user.
    - name: picture
      value: "{{ picture }}"
      description: |
        The user's avatar as a URL link (for example, 'http:<!-- -->//mycompany.com/avatars/john_white.png') or base64 data URI (for example, 'data:image/png;base64,aHR0cDovL215Y29tcGFueS5jb20vYXZhdGFycy9qb2huX3doaXRlLnBuZw==')
    - name: role
      value: "{{ role }}"
      description: |
        The role that you would like to assign to the user
    - name: user_type
      value: "{{ user_type }}"
      description: |
        The type of user. Possible values: \`REGULAR_USER\`: A human user who can log in to the Fivetran dashboard and interact with the API, and \`SERVICE_ACCOUNT\`: A non-human identity for machine-to-machine API access that cannot log in to the dashboard.
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

Updates information for an existing user within your Fivetran account.

```sql
UPDATE fivetran.users.users
SET 
phone = '{{ phone }}',
picture = '{{ picture }}',
role = '{{ role }}',
family_name = '{{ family_name }}',
given_name = '{{ given_name }}'
WHERE 
user_id = '{{ user_id }}' --required
RETURNING
id,
family_name,
given_name,
active,
created_at,
email,
has_api_key,
invited,
logged_in_at,
phone,
picture,
role,
user_type,
verified;
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

Deletes a user from your Fivetran account. You will be unable to delete an account owner user if there is only one remaining.

```sql
DELETE FROM fivetran.users.users
WHERE user_id = '{{ user_id }}' --required
;
```
</TabItem>
</Tabs>


## Lifecycle Methods

EXEC variables use wire (API) names.

<Tabs
    defaultValue="remove_account_role"
    values={[
        { label: 'remove_account_role', value: 'remove_account_role' }
    ]}
>
<TabItem value="remove_account_role">

Removes a user's role from an account, but the user remains a member of the account.

```sql
EXEC fivetran.users.users.remove_account_role 
@user_id='{{ user_id }}' --required
;
```
</TabItem>
</Tabs>
