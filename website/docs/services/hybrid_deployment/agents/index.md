--- 
title: agents
hide_title: false
hide_table_of_contents: false
keywords:
  - agents
  - hybrid_deployment
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

Creates, updates, deletes, gets or lists an <code>agents</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="agents" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.hybrid_deployment.agents" /></td></tr>
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
    <td>The unique identifier for the hybrid deployment agent within the Fivetran system. (example: agent_id)</td>
</tr>
<tr>
    <td><CopyableCode code="group_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the group within your Fivetran account. (example: group_id)</td>
</tr>
<tr>
    <td><CopyableCode code="display_name" /></td>
    <td><code>string</code></td>
    <td>Hybrid Deployment Agent display name. (example: display_name)</td>
</tr>
<tr>
    <td><CopyableCode code="created_by" /></td>
    <td><code>string</code></td>
    <td>The actor who created the Hybrid Deployment Agent (example: created_by)</td>
</tr>
<tr>
    <td><CopyableCode code="deployment_type" /></td>
    <td><code>string</code></td>
    <td>Environment type. (DOCKER, PODMAN, KUBERNETES, SNOWPARK) (example: DOCKER)</td>
</tr>
<tr>
    <td><CopyableCode code="enabled" /></td>
    <td><code>boolean</code></td>
    <td>The boolean value specifying whether the Hybrid Deployment Agent is enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="last_used_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The time this Hybrid Deployment Agent was last used. (example: 2024-12-01T15:43:29.013729Z)</td>
</tr>
<tr>
    <td><CopyableCode code="online" /></td>
    <td><code>boolean</code></td>
    <td>The boolean value specifying whether the Hybrid Deployment Agent is online.</td>
</tr>
<tr>
    <td><CopyableCode code="registered_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>Time when this Hybrid Deployment Agent was created. (example: 2024-12-01T15:43:29.013729Z)</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>Time when this Hybrid Deployment Agent was updated. (example: 2024-12-01T15:43:29.013729Z)</td>
</tr>
<tr>
    <td><CopyableCode code="usage" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="version" /></td>
    <td><code>string</code></td>
    <td>Version of the Hybrid Deployment Agent (example: version)</td>
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
    <td>The unique identifier for the hybrid deployment agent within the Fivetran system. (example: agent_id)</td>
</tr>
<tr>
    <td><CopyableCode code="group_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the group within your Fivetran account. (example: group_id)</td>
</tr>
<tr>
    <td><CopyableCode code="display_name" /></td>
    <td><code>string</code></td>
    <td>Hybrid Deployment Agent display name. (example: display_name)</td>
</tr>
<tr>
    <td><CopyableCode code="created_by" /></td>
    <td><code>string</code></td>
    <td>The actor who created the Hybrid Deployment Agent (example: created_by)</td>
</tr>
<tr>
    <td><CopyableCode code="deployment_type" /></td>
    <td><code>string</code></td>
    <td>Environment type. (DOCKER, PODMAN, KUBERNETES, SNOWPARK) (example: DOCKER)</td>
</tr>
<tr>
    <td><CopyableCode code="enabled" /></td>
    <td><code>boolean</code></td>
    <td>The boolean value specifying whether the Hybrid Deployment Agent is enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="last_used_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The time this Hybrid Deployment Agent was last used. (example: 2024-12-01T15:43:29.013729Z)</td>
</tr>
<tr>
    <td><CopyableCode code="online" /></td>
    <td><code>boolean</code></td>
    <td>The boolean value specifying whether the Hybrid Deployment Agent is online.</td>
</tr>
<tr>
    <td><CopyableCode code="registered_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>Time when this Hybrid Deployment Agent was created. (example: 2024-12-01T15:43:29.013729Z)</td>
</tr>
<tr>
    <td><CopyableCode code="updated_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>Time when this Hybrid Deployment Agent was updated. (example: 2024-12-01T15:43:29.013729Z)</td>
</tr>
<tr>
    <td><CopyableCode code="usage" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="version" /></td>
    <td><code>string</code></td>
    <td>Version of the Hybrid Deployment Agent (example: version)</td>
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
    <td><a href="#parameter-agent_id"><code>agent_id</code></a></td>
    <td></td>
    <td>Returns Hybrid Deployment Agent Details.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-group_id"><code>group_id</code></a>, <a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns list of all Hybrid Deployment Agents within your Fivetran account, along with usage. Optionally filtered to a single group.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td><a href="#parameter-accept_terms"><code>accept_terms</code></a>, <a href="#parameter-display_name"><code>display_name</code></a>, <a href="#parameter-env_type"><code>env_type</code></a></td>
    <td></td>
    <td>Creates a new Hybrid Deployment Agent in a group.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-agent_id"><code>agent_id</code></a></td>
    <td></td>
    <td>Delete a Hybrid Deployment Agent.</td>
</tr>
<tr>
    <td><a href="#re_auth"><CopyableCode code="re_auth" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-agent_id"><code>agent_id</code></a></td>
    <td></td>
    <td>Regenerate authentication for a Hybrid Deployment Agent.</td>
</tr>
<tr>
    <td><a href="#reset_credentials"><CopyableCode code="reset_credentials" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-agent_id"><code>agent_id</code></a></td>
    <td></td>
    <td>Reset credentials for a Hybrid Deployment Agent.</td>
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
<tr id="parameter-agent_id">
    <td><CopyableCode code="agent_id" /></td>
    <td><code>string</code></td>
    <td>Hybrid Deployment Agent Id</td>
</tr>
<tr id="parameter-cursor">
    <td><CopyableCode code="cursor" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr id="parameter-group_id">
    <td><CopyableCode code="group_id" /></td>
    <td><code>string</code></td>
    <td>The Fivetran Group Id. (wire: groupId)</td>
</tr>
<tr id="parameter-limit">
    <td><CopyableCode code="limit" /></td>
    <td><code>integer (int32)</code></td>
    <td></td>
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

Returns Hybrid Deployment Agent Details.

```sql
SELECT
id,
group_id,
display_name,
created_by,
deployment_type,
enabled,
last_used_at,
online,
registered_at,
updated_at,
usage,
version
FROM fivetran.hybrid_deployment.agents
WHERE agent_id = '{{ agent_id }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns list of all Hybrid Deployment Agents within your Fivetran account, along with usage. Optionally filtered to a single group.

```sql
SELECT
id,
group_id,
display_name,
created_by,
deployment_type,
enabled,
last_used_at,
online,
registered_at,
updated_at,
usage,
version
FROM fivetran.hybrid_deployment.agents
WHERE group_id = '{{ group_id }}'
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

Creates a new Hybrid Deployment Agent in a group.

```sql
INSERT INTO fivetran.hybrid_deployment.agents (
group_id,
display_name,
env_type,
accept_terms,
auth_type
)
SELECT 
'{{ group_id }}',
'{{ display_name }}' /* required */,
'{{ env_type }}' /* required */,
{{ accept_terms }} /* required */,
'{{ auth_type }}'
RETURNING
id,
group_id,
display_name,
created_by,
deployment_type,
enabled,
files,
last_used_at,
online,
registered_at,
token,
updated_at,
version
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: agents
  props:
    - name: group_id
      value: "{{ group_id }}"
      description: |
        The unique identifier for the group within your Fivetran account.
    - name: display_name
      value: "{{ display_name }}"
      description: |
        Hybrid Deployment Agent display name.
    - name: env_type
      value: "{{ env_type }}"
      description: |
        Environment type.
      valid_values: ['DOCKER', 'PODMAN', 'KUBERNETES', 'SNOWPARK']
    - name: accept_terms
      value: {{ accept_terms }}
      description: |
        Boolean, must be true to indicate that the caller accepts the Fivetran On-Prem Software License Addendum.
    - name: auth_type
      value: "{{ auth_type }}"
      description: |
        Agent Auth Mode. Defines how agent should be authorised.
      valid_values: ['AUTO', 'MANUAL']
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

Delete a Hybrid Deployment Agent.

```sql
DELETE FROM fivetran.hybrid_deployment.agents
WHERE agent_id = '{{ agent_id }}' --required
;
```
</TabItem>
</Tabs>


## Lifecycle Methods

EXEC variables use wire (API) names.

<Tabs
    defaultValue="re_auth"
    values={[
        { label: 're_auth', value: 're_auth' },
        { label: 'reset_credentials', value: 'reset_credentials' }
    ]}
>
<TabItem value="re_auth">

Regenerate authentication for a Hybrid Deployment Agent.

```sql
EXEC fivetran.hybrid_deployment.agents.re_auth 
@agent_id='{{ agent_id }}' --required 
@@json=
'{
"auth_type": "{{ auth_type }}"
}'
;
```
</TabItem>
<TabItem value="reset_credentials">

Reset credentials for a Hybrid Deployment Agent.

```sql
EXEC fivetran.hybrid_deployment.agents.reset_credentials 
@agent_id='{{ agent_id }}' --required
;
```
</TabItem>
</Tabs>
