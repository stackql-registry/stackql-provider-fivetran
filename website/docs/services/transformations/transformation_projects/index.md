--- 
title: transformation_projects
hide_title: false
hide_table_of_contents: false
keywords:
  - transformation_projects
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

Creates, updates, deletes, gets or lists a <code>transformation_projects</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="transformation_projects" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.transformations.transformation_projects" /></td></tr>
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
    <td>The unique identifier for the transformation project within the Fivetran system</td>
</tr>
<tr>
    <td><CopyableCode code="created_by_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the actor (user or system key) within the Fivetran system</td>
</tr>
<tr>
    <td><CopyableCode code="group_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the group within the Fivetran system</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the transformation project was created</td>
</tr>
<tr>
    <td><CopyableCode code="errors" /></td>
    <td><code>array</code></td>
    <td>The list of errors occurred during project processing and setup</td>
</tr>
<tr>
    <td><CopyableCode code="project_config" /></td>
    <td><code>object</code></td>
    <td>Depends on `type` (DBT_CORE).</td>
</tr>
<tr>
    <td><CopyableCode code="setup_tests" /></td>
    <td><code>array</code></td>
    <td>The setup tests results</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>The status of transformation project (NOT_READY, READY, ERROR)</td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>Transformation project type (DBT_CORE)</td>
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
    <td>The unique identifier for the transformation project within the Fivetran system</td>
</tr>
<tr>
    <td><CopyableCode code="created_by_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the actor (user or system key) within the Fivetran system</td>
</tr>
<tr>
    <td><CopyableCode code="group_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the group within the Fivetran system</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the transformation project was created</td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>Transformation project type (DBT_CORE)</td>
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
    <td><a href="#parameter-project_id"><code>project_id</code></a></td>
    <td></td>
    <td>Returns transformation project details if a valid identifier was provided.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns a list of all transformation projects available via API within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td></td>
    <td></td>
    <td>Creates a new transformation project.</td>
</tr>
<tr>
    <td><a href="#update"><CopyableCode code="update" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-project_id"><code>project_id</code></a></td>
    <td></td>
    <td>Updates transformation project if a valid identifier was provided.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-project_id"><code>project_id</code></a></td>
    <td></td>
    <td>Deletes transformation project if a valid identifier was provided.</td>
</tr>
<tr>
    <td><a href="#test"><CopyableCode code="test" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-project_id"><code>project_id</code></a></td>
    <td></td>
    <td>Triggers tests for an existing transformation project.</td>
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
<tr id="parameter-project_id">
    <td><CopyableCode code="project_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the transformation project within the Fivetran system</td>
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

Returns transformation project details if a valid identifier was provided.

```sql
SELECT
id,
created_by_id,
group_id,
created_at,
errors,
project_config,
setup_tests,
status,
type
FROM fivetran.transformations.transformation_projects
WHERE project_id = '{{ project_id }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns a list of all transformation projects available via API within your Fivetran account.

```sql
SELECT
id,
created_by_id,
group_id,
created_at,
type
FROM fivetran.transformations.transformation_projects
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

Creates a new transformation project.

```sql
INSERT INTO fivetran.transformations.transformation_projects (
group_id,
type,
run_tests,
project_config
)
SELECT 
'{{ group_id }}',
'{{ type }}',
{{ run_tests }},
'{{ project_config }}'
RETURNING
id,
created_by_id,
group_id,
created_at,
errors,
project_config,
setup_tests,
status,
type
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: transformation_projects
  props:
    - name: group_id
      value: "{{ group_id }}"
      description: |
        The unique identifier for the group within the Fivetran system
    - name: type
      value: "{{ type }}"
      description: |
        Transformation project type
      valid_values: ['DBT_CORE']
    - name: run_tests
      value: {{ run_tests }}
      description: |
        The boolean flag specifies if the project should be tested after creation or update operation
    - name: project_config
      description: |
        Depends on \`type\` (DBT_CORE).
      value:
        dbt_version: "{{ dbt_version }}"
        default_schema: "{{ default_schema }}"
        git_remote_url: "{{ git_remote_url }}"
        folder_path: "{{ folder_path }}"
        git_branch: "{{ git_branch }}"
        threads: {{ threads }}
        target_name: "{{ target_name }}"
        environment_vars:
          - "{{ environment_vars }}"
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

Updates transformation project if a valid identifier was provided.

```sql
UPDATE fivetran.transformations.transformation_projects
SET 
run_tests = {{ run_tests }},
project_config = '{{ project_config }}'
WHERE 
project_id = '{{ project_id }}' --required
RETURNING
id,
created_by_id,
group_id,
created_at,
errors,
project_config,
setup_tests,
status,
type;
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

Deletes transformation project if a valid identifier was provided.

```sql
DELETE FROM fivetran.transformations.transformation_projects
WHERE project_id = '{{ project_id }}' --required
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

Triggers tests for an existing transformation project.

```sql
EXEC fivetran.transformations.transformation_projects.test 
@project_id='{{ project_id }}' --required
;
```
</TabItem>
</Tabs>
