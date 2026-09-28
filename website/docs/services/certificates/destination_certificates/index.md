--- 
title: destination_certificates
hide_title: false
hide_table_of_contents: false
keywords:
  - destination_certificates
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

Creates, updates, deletes, gets or lists a <code>destination_certificates</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="destination_certificates" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.certificates.destination_certificates" /></td></tr>
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
    <td>The unique identifier of the certificate (Base64URL encoded hash of the certificate). (example: Y29ubmVjdG9yIGNlcnRpZmljYXRlIGhhc2g)</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>The certificate name. (example: Certificate Name)</td>
</tr>
<tr>
    <td><CopyableCode code="hash" /></td>
    <td><code>string</code></td>
    <td>Hash of the certificate. (example: jhg5UI7fgrI6yy...)</td>
</tr>
<tr>
    <td><CopyableCode code="public_key" /></td>
    <td><code>string</code></td>
    <td>The certificate decoded public key. (example: Sun RSA public key, 2048 bits params: null modulus: 7685655455... public exponent: 65537)</td>
</tr>
<tr>
    <td><CopyableCode code="sha_1" /></td>
    <td><code>string</code></td>
    <td>SHA1 of certificate. (example: c8de1d13vtu435ilj435lj345796d8jh7hk8hgk) (wire: sha1)</td>
</tr>
<tr>
    <td><CopyableCode code="sha_256" /></td>
    <td><code>string</code></td>
    <td>SHA256 of certificate. (example: 5vt6rt6jtr654eef94ec3f91122a623b389f4d331ff330026e43af21013vb45f) (wire: sha256)</td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>Type of the certificate. (example: TLS)</td>
</tr>
<tr>
    <td><CopyableCode code="validated_by" /></td>
    <td><code>string</code></td>
    <td>The unique identified for the user who has approved the certificate. (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="validated_date" /></td>
    <td><code>string (date-time)</code></td>
    <td>Date when certificate has been validated and approved. (example: 2023-08-20T10:15:20.677566Z)</td>
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
    <td>The unique identifier of the certificate (Base64URL encoded hash of the certificate). (example: Y29ubmVjdG9yIGNlcnRpZmljYXRlIGhhc2g)</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>The certificate name. (example: Certificate Name)</td>
</tr>
<tr>
    <td><CopyableCode code="hash" /></td>
    <td><code>string</code></td>
    <td>Hash of the certificate. (example: jhg5UI7fgrI6yy...)</td>
</tr>
<tr>
    <td><CopyableCode code="public_key" /></td>
    <td><code>string</code></td>
    <td>The certificate decoded public key. (example: Sun RSA public key, 2048 bits params: null modulus: 7685655455... public exponent: 65537)</td>
</tr>
<tr>
    <td><CopyableCode code="sha_1" /></td>
    <td><code>string</code></td>
    <td>SHA1 of certificate. (example: c8de1d13vtu435ilj435lj345796d8jh7hk8hgk) (wire: sha1)</td>
</tr>
<tr>
    <td><CopyableCode code="sha_256" /></td>
    <td><code>string</code></td>
    <td>SHA256 of certificate. (example: 5vt6rt6jtr654eef94ec3f91122a623b389f4d331ff330026e43af21013vb45f) (wire: sha256)</td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>Type of the certificate. (example: TLS)</td>
</tr>
<tr>
    <td><CopyableCode code="validated_by" /></td>
    <td><code>string</code></td>
    <td>The unique identified for the user who has approved the certificate. (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="validated_date" /></td>
    <td><code>string (date-time)</code></td>
    <td>Date when certificate has been validated and approved. (example: 2023-08-20T10:15:20.677566Z)</td>
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
    <td><a href="#parameter-destination_id"><code>destination_id</code></a>, <a href="#parameter-hash"><code>hash</code></a></td>
    <td></td>
    <td>Returns details of the certificate approved for the specified destination with specified certificate hash.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-destination_id"><code>destination_id</code></a></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns the list of approved certificates for the specified destination.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td><a href="#parameter-destination_id"><code>destination_id</code></a>, <a href="#parameter-encoded_cert"><code>encoded_cert</code></a>, <a href="#parameter-hash"><code>hash</code></a></td>
    <td></td>
    <td>Approves a certificate, so Fivetran trusts this certificate for a destination database connection. &lt;br /&gt;The destination connection setup tests will fail if a non-approved certificate is provided.&lt;br /&gt;&lt;br /&gt;&gt; NOTE: This is only required for destination connections based on the following databases: &lt;br /&gt;&gt;  - &#91;MySQL&#93;(https:​//fivetran.com/docs/destinations/mysql#supportedimplementations)&lt;br /&gt;&gt;  - &#91;PostgreSQL&#93;(https:​//fivetran.com/docs/destinations/postgresql#supportedimplementations)&lt;br /&gt;&gt;  - &#91;SQLServer&#93;(https:​//fivetran.com/docs/destinations/sql-server#supportedimplementations)&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-destination_id"><code>destination_id</code></a>, <a href="#parameter-hash"><code>hash</code></a></td>
    <td></td>
    <td>Revokes a certificate, so Fivetran no longer trusts it while connecting to the destination database.</td>
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
<tr id="parameter-destination_id">
    <td><CopyableCode code="destination_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the destination within the Fivetran system.</td>
</tr>
<tr id="parameter-hash">
    <td><CopyableCode code="hash" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the certificate (Base64URL encoded hash of the certificate).</td>
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

Returns details of the certificate approved for the specified destination with specified certificate hash.

```sql
SELECT
id,
name,
hash,
public_key,
sha_1,
sha_256,
type,
validated_by,
validated_date
FROM fivetran.certificates.destination_certificates
WHERE destination_id = '{{ destination_id }}' -- required
AND hash = '{{ hash }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns the list of approved certificates for the specified destination.

```sql
SELECT
id,
name,
hash,
public_key,
sha_1,
sha_256,
type,
validated_by,
validated_date
FROM fivetran.certificates.destination_certificates
WHERE destination_id = '{{ destination_id }}' -- required
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

Approves a certificate, so Fivetran trusts this certificate for a destination database connection. &lt;br /&gt;The destination connection setup tests will fail if a non-approved certificate is provided.&lt;br /&gt;&lt;br /&gt;&gt; NOTE: This is only required for destination connections based on the following databases: &lt;br /&gt;&gt;  - &#91;MySQL&#93;(https:​//fivetran.com/docs/destinations/mysql#supportedimplementations)&lt;br /&gt;&gt;  - &#91;PostgreSQL&#93;(https:​//fivetran.com/docs/destinations/postgresql#supportedimplementations)&lt;br /&gt;&gt;  - &#91;SQLServer&#93;(https:​//fivetran.com/docs/destinations/sql-server#supportedimplementations)&lt;br /&gt;

```sql
INSERT INTO fivetran.certificates.destination_certificates (
hash,
encoded_cert,
destination_id
)
SELECT 
'{{ hash }}' /* required */,
'{{ encoded_cert }}' /* required */,
'{{ destination_id }}'
RETURNING
id,
name,
hash,
public_key,
sha_1,
sha_256,
type,
validated_by,
validated_date
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: destination_certificates
  props:
    - name: destination_id
      value: "{{ destination_id }}"
      description: Required parameter for the destination_certificates resource.
    - name: hash
      value: "{{ hash }}"
      description: |
        Hash of the certificate.
    - name: encoded_cert
      value: "{{ encoded_cert }}"
      description: |
        The certificate encoded in base64.
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

Revokes a certificate, so Fivetran no longer trusts it while connecting to the destination database.

```sql
DELETE FROM fivetran.certificates.destination_certificates
WHERE destination_id = '{{ destination_id }}' --required
AND hash = '{{ hash }}' --required
;
```
</TabItem>
</Tabs>
