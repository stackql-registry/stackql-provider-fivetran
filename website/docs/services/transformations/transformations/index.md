--- 
title: transformations
hide_title: false
hide_table_of_contents: false
keywords:
  - transformations
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

Creates, updates, deletes, gets or lists a <code>transformations</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="transformations" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.transformations.transformations" /></td></tr>
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
    <td>The unique identifier for the transformation within the Fivetran system (example: transformation_id)</td>
</tr>
<tr>
    <td><CopyableCode code="created_by_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the actor (user or system key) within the Fivetran system (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the transformation was created (example: 2024-01-02T00:00:00.743708Z)</td>
</tr>
<tr>
    <td><CopyableCode code="last_ended_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the transformation was ended last time (example: 2024-01-02T00:00:00.000001Z)</td>
</tr>
<tr>
    <td><CopyableCode code="last_started_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the transformation was started last time (example: 2024-01-02T00:00:00.000001Z)</td>
</tr>
<tr>
    <td><CopyableCode code="output_model_names" /></td>
    <td><code>array</code></td>
    <td>The list of transformation output models</td>
</tr>
<tr>
    <td><CopyableCode code="paused" /></td>
    <td><code>boolean</code></td>
    <td>The field indicates whether transformation is in paused state</td>
</tr>
<tr>
    <td><CopyableCode code="schedule" /></td>
    <td><code>object</code></td>
    <td>The transformation schedule</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>The status of transformation (NEW, SCHEDULING, RUNNING, TERMINATING, SUCCEEDED, FAILED, BLOCKED, CANCELED, PARTIALLY_SUCCEEDED) (example: RUNNING)</td>
</tr>
<tr>
    <td><CopyableCode code="transformation_config" /></td>
    <td><code>object</code></td>
    <td>Depends on `type` (DBT_CORE, QUICKSTART).</td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>Transformation type (DBT_CORE, QUICKSTART) (example: DBT_CORE)</td>
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
    <td>The unique identifier for the transformation within the Fivetran system (example: transformation_id)</td>
</tr>
<tr>
    <td><CopyableCode code="created_by_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the actor (user or system key) within the Fivetran system (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the transformation was created (example: 2024-01-02T00:00:00.743708Z)</td>
</tr>
<tr>
    <td><CopyableCode code="last_ended_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the transformation was ended last time (example: 2024-01-02T00:00:00.000001Z)</td>
</tr>
<tr>
    <td><CopyableCode code="last_started_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp when the transformation was started last time (example: 2024-01-02T00:00:00.000001Z)</td>
</tr>
<tr>
    <td><CopyableCode code="output_model_names" /></td>
    <td><code>array</code></td>
    <td>The list of transformation output models</td>
</tr>
<tr>
    <td><CopyableCode code="paused" /></td>
    <td><code>boolean</code></td>
    <td>The field indicates whether transformation is in paused state</td>
</tr>
<tr>
    <td><CopyableCode code="schedule" /></td>
    <td><code>object</code></td>
    <td>The transformation schedule</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>The status of transformation (NEW, SCHEDULING, RUNNING, TERMINATING, SUCCEEDED, FAILED, BLOCKED, CANCELED, PARTIALLY_SUCCEEDED) (example: RUNNING)</td>
</tr>
<tr>
    <td><CopyableCode code="transformation_config" /></td>
    <td><code>object</code></td>
    <td>Depends on `type` (DBT_CORE, QUICKSTART).</td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>Transformation type (DBT_CORE, QUICKSTART) (example: DBT_CORE)</td>
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
    <td><a href="#parameter-transformation_id"><code>transformation_id</code></a></td>
    <td></td>
    <td>Returns a transformation details if a valid identifier is provided.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a>, <a href="#parameter-group_id"><code>group_id</code></a>, <a href="#parameter-project_id"><code>project_id</code></a>, <a href="#parameter-type"><code>type</code></a></td>
    <td>Returns a list of all transformations within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td></td>
    <td></td>
    <td>Creates a new transformation.</td>
</tr>
<tr>
    <td><a href="#update"><CopyableCode code="update" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-transformation_id"><code>transformation_id</code></a></td>
    <td></td>
    <td>Updates the transformation if a valid identifier is provided.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-transformation_id"><code>transformation_id</code></a></td>
    <td></td>
    <td>Deletes a transformation if a valid identifier is provided.</td>
</tr>
<tr>
    <td><a href="#cancel"><CopyableCode code="cancel" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-transformation_id"><code>transformation_id</code></a></td>
    <td></td>
    <td>Cancels the execution of the transformation if a valid identifier is provided.</td>
</tr>
<tr>
    <td><a href="#run"><CopyableCode code="run" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-transformation_id"><code>transformation_id</code></a></td>
    <td></td>
    <td>Runs the transformation if a valid identifier is provided.</td>
</tr>
<tr>
    <td><a href="#upgrade_package"><CopyableCode code="upgrade_package" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-transformation_id"><code>transformation_id</code></a></td>
    <td></td>
    <td>Upgrades the Quickstart transformation package to latest version if a valid identifier is provided.</td>
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
<tr id="parameter-transformation_id">
    <td><CopyableCode code="transformation_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the transformation within the Fivetran system</td>
</tr>
<tr id="parameter-cursor">
    <td><CopyableCode code="cursor" /></td>
    <td><code>string</code></td>
    <td>Paging cursor, &#91;read more about pagination&#93;(https:​//fivetran.com/docs/rest-api/pagination)</td>
</tr>
<tr id="parameter-group_id">
    <td><CopyableCode code="group_id" /></td>
    <td><code>string</code></td>
    <td>Specify the group identifier to filter transformations by group</td>
</tr>
<tr id="parameter-limit">
    <td><CopyableCode code="limit" /></td>
    <td><code>integer (int32)</code></td>
    <td>Number of records to fetch per page. Accepts a number in the range 1..1000; the default value is 100.</td>
</tr>
<tr id="parameter-project_id">
    <td><CopyableCode code="project_id" /></td>
    <td><code>string</code></td>
    <td>Specify dbt project identifier to filter transformations by project</td>
</tr>
<tr id="parameter-type">
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>Transformation type filter</td>
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

Returns a transformation details if a valid identifier is provided.

```sql
SELECT
id,
created_by_id,
created_at,
last_ended_at,
last_started_at,
output_model_names,
paused,
schedule,
status,
transformation_config,
type
FROM fivetran.transformations.transformations
WHERE transformation_id = '{{ transformation_id }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns a list of all transformations within your Fivetran account.

```sql
SELECT
id,
created_by_id,
created_at,
last_ended_at,
last_started_at,
output_model_names,
paused,
schedule,
status,
transformation_config,
type
FROM fivetran.transformations.transformations
WHERE "limit" = '{{ limit }}'
AND group_id = '{{ group_id }}'
AND project_id = '{{ project_id }}'
AND type = '{{ type }}'
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

Creates a new transformation.

```sql
INSERT INTO fivetran.transformations.transformations (
schedule,
type,
paused,
transformation_config
)
SELECT 
'{{ schedule }}',
'{{ type }}',
{{ paused }},
'{{ transformation_config }}'
RETURNING
id,
created_by_id,
created_at,
last_ended_at,
last_started_at,
output_model_names,
paused,
schedule,
status,
transformation_config,
type
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: transformations
  props:
    - name: schedule
      value:
        cron:
          - "{{ cron }}"
        interval: {{ interval }}
        schedule_type: "{{ schedule_type }}"
        days_of_week:
          - "{{ days_of_week }}"
        time_of_day: "{{ time_of_day }}"
        connection_ids:
          - "{{ connection_ids }}"
        transformation_ids:
          - "{{ transformation_ids }}"
        smart_syncing: {{ smart_syncing }}
    - name: type
      value: "{{ type }}"
      valid_values: ['DBT_CORE', 'QUICKSTART']
    - name: paused
      value: {{ paused }}
    - name: transformation_config
      description: |
        Depends on \`type\` (DBT_CORE, QUICKSTART).
      value:
        project_id: "{{ project_id }}"
        name: "{{ name }}"
        steps:
          - name: "{{ name }}"
            command: "{{ command }}"
        package_name: "{{ package_name }}"
        connection_ids:
          - "{{ connection_ids }}"
        excluded_models:
          - "{{ excluded_models }}"
        configurable_variables: "{{ configurable_variables }}"
        group_id: "{{ group_id }}"
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

Updates the transformation if a valid identifier is provided.

```sql
UPDATE fivetran.transformations.transformations
SET 
schedule = '{{ schedule }}',
paused = {{ paused }},
transformation_config = '{{ transformation_config }}'
WHERE 
transformation_id = '{{ transformation_id }}' --required
RETURNING
id,
created_by_id,
created_at,
last_ended_at,
last_started_at,
output_model_names,
paused,
schedule,
status,
transformation_config,
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

Deletes a transformation if a valid identifier is provided.

```sql
DELETE FROM fivetran.transformations.transformations
WHERE transformation_id = '{{ transformation_id }}' --required
;
```
</TabItem>
</Tabs>


## Lifecycle Methods

EXEC variables use wire (API) names.

<Tabs
    defaultValue="cancel"
    values={[
        { label: 'cancel', value: 'cancel' },
        { label: 'run', value: 'run' },
        { label: 'upgrade_package', value: 'upgrade_package' }
    ]}
>
<TabItem value="cancel">

Cancels the execution of the transformation if a valid identifier is provided.

```sql
EXEC fivetran.transformations.transformations.cancel 
@transformation_id='{{ transformation_id }}' --required
;
```
</TabItem>
<TabItem value="run">

Runs the transformation if a valid identifier is provided.

```sql
EXEC fivetran.transformations.transformations.run 
@transformation_id='{{ transformation_id }}' --required 
@@json=
'{
"full_refresh": {{ full_refresh }}
}'
;
```
</TabItem>
<TabItem value="upgrade_package">

Upgrades the Quickstart transformation package to latest version if a valid identifier is provided.

```sql
EXEC fivetran.transformations.transformations.upgrade_package 
@transformation_id='{{ transformation_id }}' --required
;
```
</TabItem>
</Tabs>
