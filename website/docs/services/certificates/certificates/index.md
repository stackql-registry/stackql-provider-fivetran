--- 
title: certificates
hide_title: false
hide_table_of_contents: false
keywords:
  - certificates
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

Creates, updates, deletes, gets or lists a <code>certificates</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="certificates" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.certificates.certificates" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

`SELECT` not supported for this resource, use `SHOW METHODS` to view available operations for the resource.


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
    <td><a href="#approve"><CopyableCode code="approve" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-encoded_cert"><code>encoded_cert</code></a>, <a href="#parameter-hash"><code>hash</code></a></td>
    <td></td>
    <td>Approves a certificate for a connection/destination, so Fivetran trusts this certificate for a source/destination database. The connection/destination setup tests will fail if a non-approved certificate is provided.</td>
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
</tbody>
</table>

## Lifecycle Methods

EXEC variables use wire (API) names.

<Tabs
    defaultValue="approve"
    values={[
        { label: 'approve', value: 'approve' }
    ]}
>
<TabItem value="approve">

Approves a certificate for a connection/destination, so Fivetran trusts this certificate for a source/destination database. The connection/destination setup tests will fail if a non-approved certificate is provided.

```sql
EXEC fivetran.certificates.certificates.approve 
@@json=
'{
"hash": "{{ hash }}", 
"encoded_cert": "{{ encoded_cert }}", 
"connection_id": "{{ connection_id }}", 
"destination_id": "{{ destination_id }}"
}'
;
```
</TabItem>
</Tabs>
