--- 
title: webhooks
hide_title: false
hide_table_of_contents: false
keywords:
  - webhooks
  - webhooks
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

Creates, updates, deletes, gets or lists a <code>webhooks</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="webhooks" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.webhooks.webhooks" /></td></tr>
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
    <td>Unique identifier for the webhook. (example: webhook_id)</td>
</tr>
<tr>
    <td><CopyableCode code="group_id" /></td>
    <td><code>string</code></td>
    <td>Unique identifier for the group associated with the webhook. (example: group_id)</td>
</tr>
<tr>
    <td><CopyableCode code="active" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the webhook is enabled to send events immediately upon occurrence.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>Timestamp indicating when the webhook was created. (example: 2024-01-01T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="created_by" /></td>
    <td><code>string</code></td>
    <td>Identifier of the user who created the webhook setting. (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="events" /></td>
    <td><code>array</code></td>
    <td>List of event types that trigger the webhook.</td>
</tr>
<tr>
    <td><CopyableCode code="secret" /></td>
    <td><code>string</code></td>
    <td>A secret string used to sign webhook payloads for verification. (example: ******)</td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>The type of the webhook. Specifies whether the webhook is associated with a group or an account. (group, account) (example: group)</td>
</tr>
<tr>
    <td><CopyableCode code="url" /></td>
    <td><code>string</code></td>
    <td>The endpoint URL where webhook events will be delivered. (example: https:​//your-host.your-domain/webhook)</td>
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
    <td>Unique identifier for the webhook. (example: webhook_id)</td>
</tr>
<tr>
    <td><CopyableCode code="group_id" /></td>
    <td><code>string</code></td>
    <td>Unique identifier for the group associated with the webhook. (example: group_id)</td>
</tr>
<tr>
    <td><CopyableCode code="active" /></td>
    <td><code>boolean</code></td>
    <td>Indicates if the webhook is enabled to send events immediately upon occurrence.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>Timestamp indicating when the webhook was created. (example: 2024-01-01T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="created_by" /></td>
    <td><code>string</code></td>
    <td>Identifier of the user who created the webhook setting. (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="events" /></td>
    <td><code>array</code></td>
    <td>List of event types that trigger the webhook.</td>
</tr>
<tr>
    <td><CopyableCode code="secret" /></td>
    <td><code>string</code></td>
    <td>A secret string used to sign webhook payloads for verification. (example: ******)</td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>The type of the webhook. Specifies whether the webhook is associated with a group or an account. (group, account) (example: group)</td>
</tr>
<tr>
    <td><CopyableCode code="url" /></td>
    <td><code>string</code></td>
    <td>The endpoint URL where webhook events will be delivered. (example: https:​//your-host.your-domain/webhook)</td>
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
    <td><a href="#parameter-webhook_id"><code>webhook_id</code></a></td>
    <td></td>
    <td>This endpoint allows you to retrieve details of the existing webhook for a given identifier</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>The endpoint allows you to retrieve the list of existing webhooks available for the current account</td>
</tr>
<tr>
    <td><a href="#create_group_webhook"><CopyableCode code="create_group_webhook" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td><a href="#parameter-group_id"><code>group_id</code></a>, <a href="#parameter-events"><code>events</code></a>, <a href="#parameter-url"><code>url</code></a></td>
    <td></td>
    <td>This endpoint allows you to create a new webhook for a given group</td>
</tr>
<tr>
    <td><a href="#create_account_webhook"><CopyableCode code="create_account_webhook" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td><a href="#parameter-events"><code>events</code></a>, <a href="#parameter-url"><code>url</code></a></td>
    <td></td>
    <td>This endpoint allows you to create a new webhook for the current account.</td>
</tr>
<tr>
    <td><a href="#update"><CopyableCode code="update" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-webhook_id"><code>webhook_id</code></a></td>
    <td></td>
    <td>The endpoint allows you to update the existing webhook with a given identifier</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-webhook_id"><code>webhook_id</code></a></td>
    <td></td>
    <td>This endpoint allows you to delete an existing webhook with a given identifier</td>
</tr>
<tr>
    <td><a href="#test"><CopyableCode code="test" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-webhook_id"><code>webhook_id</code></a>, <a href="#parameter-event"><code>event</code></a></td>
    <td></td>
    <td>The endpoint allows you to test an existing webhook. It sends a webhook with a given identifier for a dummy connection with identifier _connection_1</td>
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
<tr id="parameter-group_id">
    <td><CopyableCode code="group_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the group within the Fivetran system.</td>
</tr>
<tr id="parameter-webhook_id">
    <td><CopyableCode code="webhook_id" /></td>
    <td><code>string</code></td>
    <td>The webhook ID</td>
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

This endpoint allows you to retrieve details of the existing webhook for a given identifier

```sql
SELECT
id,
group_id,
active,
created_at,
created_by,
events,
secret,
type,
url
FROM fivetran.webhooks.webhooks
WHERE webhook_id = '{{ webhook_id }}' -- required
;
```
</TabItem>
<TabItem value="list">

The endpoint allows you to retrieve the list of existing webhooks available for the current account

```sql
SELECT
id,
group_id,
active,
created_at,
created_by,
events,
secret,
type,
url
FROM fivetran.webhooks.webhooks
WHERE "limit" = '{{ limit }}'
;
```
</TabItem>
</Tabs>


## `INSERT` examples

<Tabs
    defaultValue="create_group_webhook"
    values={[
        { label: 'create_group_webhook', value: 'create_group_webhook' },
        { label: 'create_account_webhook', value: 'create_account_webhook' },
        { label: 'Manifest', value: 'manifest' }
    ]}
>
<TabItem value="create_group_webhook">

This endpoint allows you to create a new webhook for a given group

```sql
INSERT INTO fivetran.webhooks.webhooks (
url,
events,
active,
secret,
group_id
)
SELECT 
'{{ url }}' /* required */,
'{{ events }}' /* required */,
{{ active }},
'{{ secret }}',
'{{ group_id }}'
RETURNING
id,
group_id,
active,
created_at,
created_by,
events,
secret,
type,
url
;
```
</TabItem>
<TabItem value="create_account_webhook">

This endpoint allows you to create a new webhook for the current account.

```sql
INSERT INTO fivetran.webhooks.webhooks (
url,
events,
active,
secret
)
SELECT 
'{{ url }}' /* required */,
'{{ events }}' /* required */,
{{ active }},
'{{ secret }}'
RETURNING
id,
group_id,
active,
created_at,
created_by,
events,
secret,
type,
url
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: webhooks
  props:
    - name: group_id
      value: "{{ group_id }}"
      description: Required parameter for the webhooks resource.
    - name: url
      value: "{{ url }}"
      description: |
        The endpoint URL where webhook events will be delivered.
    - name: events
      value:
        - "{{ events }}"
      description: |
        List of event types that trigger the webhook.
    - name: active
      value: {{ active }}
      description: |
        Indicates if the webhook is enabled to send events immediately upon occurrence.
    - name: secret
      value: "{{ secret }}"
      description: |
        A secret string used to sign webhook payloads for verification.
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

The endpoint allows you to update the existing webhook with a given identifier

```sql
UPDATE fivetran.webhooks.webhooks
SET 
url = '{{ url }}',
events = '{{ events }}',
active = {{ active }},
secret = '{{ secret }}'
WHERE 
webhook_id = '{{ webhook_id }}' --required
RETURNING
id,
group_id,
active,
created_at,
created_by,
events,
secret,
type,
url;
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

This endpoint allows you to delete an existing webhook with a given identifier

```sql
DELETE FROM fivetran.webhooks.webhooks
WHERE webhook_id = '{{ webhook_id }}' --required
;
```
</TabItem>
</Tabs>


## Lifecycle Methods

EXEC variables use wire (API) names.

<Tabs
    defaultValue="test"
    values={[
        { label: 'test', value: 'test' }
    ]}
>
<TabItem value="test">

The endpoint allows you to test an existing webhook. It sends a webhook with a given identifier for a dummy connection with identifier _connection_1

```sql
EXEC fivetran.webhooks.webhooks.test 
@webhook_id='{{ webhook_id }}' --required 
@@json=
'{
"event": "{{ event }}"
}'
;
```
</TabItem>
</Tabs>
