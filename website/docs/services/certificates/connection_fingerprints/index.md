--- 
title: connection_fingerprints
hide_title: false
hide_table_of_contents: false
keywords:
  - connection_fingerprints
  - certificates
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

Creates, updates, deletes, gets or lists a <code>connection_fingerprints</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="connection_fingerprints" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.certificates.connection_fingerprints" /></td></tr>
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
    <td>The unique identifier of the fingerprint (Base64URL encoded hash of the fingerprint). (example: Y29ubmVjdG9yIGZpbmdlcnByaW50IGhhc2g)</td>
</tr>
<tr>
    <td><CopyableCode code="hash" /></td>
    <td><code>string</code></td>
    <td>Hash of the fingerprint. (example: eUtPirI6yy...)</td>
</tr>
<tr>
    <td><CopyableCode code="public_key" /></td>
    <td><code>string</code></td>
    <td>The SSH public key. (example: ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC6 ... fivetran user key)</td>
</tr>
<tr>
    <td><CopyableCode code="validated_by" /></td>
    <td><code>string</code></td>
    <td>The unique identified for the user who has approved the fingerprint. (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="validated_date" /></td>
    <td><code>string (date-time)</code></td>
    <td>Date when fingerprint has been validated and approved. (example: 2024-01-01T00:00:00Z)</td>
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
    <td>The unique identifier of the fingerprint (Base64URL encoded hash of the fingerprint). (example: Y29ubmVjdG9yIGZpbmdlcnByaW50IGhhc2g)</td>
</tr>
<tr>
    <td><CopyableCode code="hash" /></td>
    <td><code>string</code></td>
    <td>Hash of the fingerprint. (example: eUtPirI6yy...)</td>
</tr>
<tr>
    <td><CopyableCode code="public_key" /></td>
    <td><code>string</code></td>
    <td>The SSH public key. (example: ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC6 ... fivetran user key)</td>
</tr>
<tr>
    <td><CopyableCode code="validated_by" /></td>
    <td><code>string</code></td>
    <td>The unique identified for the user who has approved the fingerprint. (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="validated_date" /></td>
    <td><code>string (date-time)</code></td>
    <td>Date when fingerprint has been validated and approved. (example: 2024-01-01T00:00:00Z)</td>
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
    <td><a href="#parameter-connection_id"><code>connection_id</code></a>, <a href="#parameter-hash"><code>hash</code></a></td>
    <td></td>
    <td>Returns SSH fingerprint details approved for specified connection with specified hash</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns the list of approved SSH fingerprints for specified connection</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a>, <a href="#parameter-hash"><code>hash</code></a>, <a href="#parameter-public_key"><code>public_key</code></a></td>
    <td></td>
    <td>Approves a fingerprint, enabling Fivetran to trust it for a source database and establish connections via an SSH tunnel.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-connection_id"><code>connection_id</code></a>, <a href="#parameter-hash"><code>hash</code></a></td>
    <td></td>
    <td>Revokes a fingerprint, so Fivetran no longer trusts it while connecting to the source database through an SSH tunnel.</td>
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
<tr id="parameter-hash">
    <td><CopyableCode code="hash" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the fingerprint (Base64URL encoded hash of the fingerprint).</td>
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

Returns SSH fingerprint details approved for specified connection with specified hash

```sql
SELECT
id,
hash,
public_key,
validated_by,
validated_date
FROM fivetran.certificates.connection_fingerprints
WHERE connection_id = '{{ connection_id }}' -- required
AND hash = '{{ hash }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns the list of approved SSH fingerprints for specified connection

```sql
SELECT
id,
hash,
public_key,
validated_by,
validated_date
FROM fivetran.certificates.connection_fingerprints
WHERE connection_id = '{{ connection_id }}' -- required
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

Approves a fingerprint, enabling Fivetran to trust it for a source database and establish connections via an SSH tunnel.

```sql
INSERT INTO fivetran.certificates.connection_fingerprints (
hash,
public_key,
connection_id
)
SELECT 
'{{ hash }}' /* required */,
'{{ public_key }}' /* required */,
'{{ connection_id }}'
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: connection_fingerprints
  props:
    - name: connection_id
      value: "{{ connection_id }}"
      description: Required parameter for the connection_fingerprints resource.
    - name: hash
      value: "{{ hash }}"
      description: |
        Hash of the fingerprint.
    - name: public_key
      value: "{{ public_key }}"
      description: |
        The SSH public key.
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

Revokes a fingerprint, so Fivetran no longer trusts it while connecting to the source database through an SSH tunnel.

```sql
DELETE FROM fivetran.certificates.connection_fingerprints
WHERE connection_id = '{{ connection_id }}' --required
AND hash = '{{ hash }}' --required
;
```
</TabItem>
</Tabs>
