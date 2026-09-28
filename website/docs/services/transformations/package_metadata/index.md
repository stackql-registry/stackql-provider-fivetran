--- 
title: package_metadata
hide_title: false
hide_table_of_contents: false
keywords:
  - package_metadata
  - transformations
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

Creates, updates, deletes, gets or lists a <code>package_metadata</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="package_metadata" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.transformations.package_metadata" /></td></tr>
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
    <td>The unique identifier for the Quickstart transformation package definition within the Fivetran system (example: package_definition_id)</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>The Quickstart transformation package name (example: package_definition_name)</td>
</tr>
<tr>
    <td><CopyableCode code="configurable_variables" /></td>
    <td><code>string</code></td>
    <td>The map of configurable variable values keyed by variable name. (opaque JSON object)</td>
</tr>
<tr>
    <td><CopyableCode code="connector_types" /></td>
    <td><code>array</code></td>
    <td>The set of connector types</td>
</tr>
<tr>
    <td><CopyableCode code="output_model_names" /></td>
    <td><code>array</code></td>
    <td>The list of transformation output models</td>
</tr>
<tr>
    <td><CopyableCode code="version" /></td>
    <td><code>string</code></td>
    <td>The Quickstart package definition version (example: version)</td>
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
    <td>The unique identifier for the Quickstart transformation package definition within the Fivetran system (example: package_definition_id)</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>The Quickstart transformation package name (example: package_definition_name)</td>
</tr>
<tr>
    <td><CopyableCode code="configurable_variables" /></td>
    <td><code>string</code></td>
    <td>The map of configurable variable values keyed by variable name. (opaque JSON object)</td>
</tr>
<tr>
    <td><CopyableCode code="connector_types" /></td>
    <td><code>array</code></td>
    <td>The set of connector types</td>
</tr>
<tr>
    <td><CopyableCode code="output_model_names" /></td>
    <td><code>array</code></td>
    <td>The list of transformation output models</td>
</tr>
<tr>
    <td><CopyableCode code="version" /></td>
    <td><code>string</code></td>
    <td>The Quickstart package definition version (example: version)</td>
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
    <td><a href="#parameter-package_definition_id"><code>package_definition_id</code></a></td>
    <td></td>
    <td>Returns the metadata details of the Quickstart transformation package if a valid identifier is provided.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-service"><code>service</code></a>, <a href="#parameter-name"><code>name</code></a>, <a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns a list of available Quickstart transformation package metadata details.</td>
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
<tr id="parameter-package_definition_id">
    <td><CopyableCode code="package_definition_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the Quickstart transformation package definition within the Fivetran system</td>
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
<tr id="parameter-name">
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Specify the package name to filter Quickstart packages by name</td>
</tr>
<tr id="parameter-service">
    <td><CopyableCode code="service" /></td>
    <td><code>string</code></td>
    <td>Specify the service identifier to filter Quickstart packages by connection service</td>
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

Returns the metadata details of the Quickstart transformation package if a valid identifier is provided.

```sql
SELECT
id,
name,
configurable_variables,
connector_types,
output_model_names,
version
FROM fivetran.transformations.package_metadata
WHERE package_definition_id = '{{ package_definition_id }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns a list of available Quickstart transformation package metadata details.

```sql
SELECT
id,
name,
configurable_variables,
connector_types,
output_model_names,
version
FROM fivetran.transformations.package_metadata
WHERE service = '{{ service }}'
AND name = '{{ name }}'
AND "limit" = '{{ limit }}'
;
```
</TabItem>
</Tabs>
