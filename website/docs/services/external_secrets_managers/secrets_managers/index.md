--- 
title: secrets_managers
hide_title: false
hide_table_of_contents: false
keywords:
  - secrets_managers
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

Creates, updates, deletes, gets or lists a <code>secrets_managers</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="secrets_managers" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.external_secrets_managers.secrets_managers" /></td></tr>
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
    <td>The unique identifier of the External Secrets Manager instance. (example: lucky_tiger)</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>The name of the ESM instance (example: My AWS Secrets Manager)</td>
</tr>
<tr>
    <td><CopyableCode code="config" /></td>
    <td><code>object</code></td>
    <td>Provider-specific configuration.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the ESM instance was created. (example: 2026-05-20T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="is_hybrid_deployment" /></td>
    <td><code>boolean</code></td>
    <td>Whether this External Secrets Manager instance is compatible with Hybrid Deployment environments.</td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>The ESM provider type (AWS_SECRET_MANAGER, AZURE_KEY_VAULT, HASHICORP_VAULT) (example: AWS_SECRET_MANAGER)</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the ESM instance was last updated. (example: 2026-05-20T00:00:00Z)</td>
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
    <td>The unique identifier of the External Secrets Manager instance. (example: lucky_tiger)</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>The name of the ESM instance (example: My AWS Secrets Manager)</td>
</tr>
<tr>
    <td><CopyableCode code="config" /></td>
    <td><code>object</code></td>
    <td>Provider-specific configuration.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the ESM instance was created. (example: 2026-05-20T00:00:00Z)</td>
</tr>
<tr>
    <td><CopyableCode code="is_hybrid_deployment" /></td>
    <td><code>boolean</code></td>
    <td>Whether this External Secrets Manager instance is compatible with Hybrid Deployment environments.</td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>The ESM provider type (AWS_SECRET_MANAGER, AZURE_KEY_VAULT, HASHICORP_VAULT) (example: AWS_SECRET_MANAGER)</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the ESM instance was last updated. (example: 2026-05-20T00:00:00Z)</td>
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
    <td><a href="#parameter-esm_id"><code>esm_id</code></a></td>
    <td></td>
    <td>Returns the details of an existing External Secrets Manager instance.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns a list of all External Secrets Manager instances within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td><a href="#parameter-config"><code>config</code></a>, <a href="#parameter-name"><code>name</code></a>, <a href="#parameter-type"><code>type</code></a></td>
    <td></td>
    <td>Creates a new External Secrets Manager instance within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#update"><CopyableCode code="update" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-esm_id"><code>esm_id</code></a>, <a href="#parameter-config"><code>config</code></a></td>
    <td></td>
    <td>Updates the configuration of an existing External Secrets Manager instance.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-esm_id"><code>esm_id</code></a></td>
    <td></td>
    <td>Deletes an External Secrets Manager instance from your Fivetran account. The instance must not be in use by any source connections or destinations.</td>
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

Returns the details of an existing External Secrets Manager instance.

```sql
SELECT
id,
name,
config,
created_at,
is_hybrid_deployment,
type,
updated_at
FROM fivetran.external_secrets_managers.secrets_managers
WHERE esm_id = '{{ esm_id }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns a list of all External Secrets Manager instances within your Fivetran account.

```sql
SELECT
id,
name,
config,
created_at,
is_hybrid_deployment,
type,
updated_at
FROM fivetran.external_secrets_managers.secrets_managers
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

Creates a new External Secrets Manager instance within your Fivetran account.

```sql
INSERT INTO fivetran.external_secrets_managers.secrets_managers (
type,
name,
config,
is_hybrid_deployment
)
SELECT 
'{{ type }}' /* required */,
'{{ name }}' /* required */,
'{{ config }}' /* required */,
{{ is_hybrid_deployment }}
RETURNING
id,
name,
config,
created_at,
is_hybrid_deployment,
type,
updated_at
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: secrets_managers
  props:
    - name: type
      value: "{{ type }}"
      description: |
        The ESM provider type. Supported values: AWS_SECRET_MANAGER, AZURE_KEY_VAULT, HASHICORP_VAULT.
      valid_values: ['AWS_SECRET_MANAGER', 'AZURE_KEY_VAULT', 'HASHICORP_VAULT']
    - name: name
      value: "{{ name }}"
      description: |
        The name of the External Secrets Manager instance. Must be unique within the account.
    - name: config
      value: "{{ config }}"
      description: |
        Provider-specific configuration object. For AWS_SECRET_MANAGER: role_arn (required). For AZURE_KEY_VAULT: vault_url (required), tenant_id (required for SaaS). For HASHICORP_VAULT: vault_address (required), role_id and secret_id (required for SaaS), namespace (optional).
    - name: is_hybrid_deployment
      value: {{ is_hybrid_deployment }}
      description: |
        Whether this External Secrets Manager instance is compatible with Hybrid Deployment environments.
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

Updates the configuration of an existing External Secrets Manager instance.

```sql
UPDATE fivetran.external_secrets_managers.secrets_managers
SET 
config = '{{ config }}'
WHERE 
esm_id = '{{ esm_id }}' --required
AND config = '{{ config }}' --required
RETURNING
id,
name,
config,
created_at,
is_hybrid_deployment,
type,
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

Deletes an External Secrets Manager instance from your Fivetran account. The instance must not be in use by any source connections or destinations.

```sql
DELETE FROM fivetran.external_secrets_managers.secrets_managers
WHERE esm_id = '{{ esm_id }}' --required
;
```
</TabItem>
</Tabs>
