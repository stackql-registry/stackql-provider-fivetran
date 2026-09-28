--- 
title: roles
hide_title: false
hide_table_of_contents: false
keywords:
  - roles
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

Creates, updates, deletes, gets or lists a <code>roles</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="roles" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.account.roles" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

<Tabs
    defaultValue="list"
    values={[
        { label: 'list', value: 'list' }
    ]}
>
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
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>The role name (example: Destination Administrator)</td>
</tr>
<tr>
    <td><CopyableCode code="replacement_role_name" /></td>
    <td><code>string</code></td>
    <td>The name of the new role replacing the deprecated role (example: Manage Destination)</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>The role description (example: Role Description)</td>
</tr>
<tr>
    <td><CopyableCode code="is_custom" /></td>
    <td><code>boolean</code></td>
    <td>Defines whether the role is standard or custom</td>
</tr>
<tr>
    <td><CopyableCode code="is_deprecated" /></td>
    <td><code>boolean</code></td>
    <td>Defines whether the role is deprecated</td>
</tr>
<tr>
    <td><CopyableCode code="scope" /></td>
    <td><code>array</code></td>
    <td>Defines the list of resources the role manages (ACCOUNT, DESTINATION, CONNECTOR, TEAM)</td>
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
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns a list of all predefined and custom roles within your Fivetran account.</td>
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
    defaultValue="list"
    values={[
        { label: 'list', value: 'list' }
    ]}
>
<TabItem value="list">

Returns a list of all predefined and custom roles within your Fivetran account.

```sql
SELECT
name,
replacement_role_name,
description,
is_custom,
is_deprecated,
scope
FROM fivetran.account.roles
WHERE "limit" = '{{ limit }}'
;
```
</TabItem>
</Tabs>
