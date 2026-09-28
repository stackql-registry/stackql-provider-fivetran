--- 
title: proxy_agents
hide_title: false
hide_table_of_contents: false
keywords:
  - proxy_agents
  - networking
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

Creates, updates, deletes, gets or lists a <code>proxy_agents</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="proxy_agents" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.networking.proxy_agents" /></td></tr>
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
    <td>The unique identifier for the proxy agent within the Fivetran system. (example: id)</td>
</tr>
<tr>
    <td><CopyableCode code="account_id" /></td>
    <td><code>string</code></td>
    <td>Fivetran Account ID. (example: account_id)</td>
</tr>
<tr>
    <td><CopyableCode code="display_name" /></td>
    <td><code>string</code></td>
    <td>Proxy agent name. (example: display_name)</td>
</tr>
<tr>
    <td><CopyableCode code="created_by" /></td>
    <td><code>string</code></td>
    <td>The actor who created the proxy agent. (example: created_by)</td>
</tr>
<tr>
    <td><CopyableCode code="region" /></td>
    <td><code>string</code></td>
    <td>Data processing location. This is where Fivetran will operate and run computation on data. (GCP_US_EAST4, GCP_US_WEST1, GCP_US_CENTRAL1, GCP_EUROPE_WEST3, GCP_AUSTRALIA_SOUTHEAST1, GCP_NORTHAMERICA_NORTHEAST1, GCP_EUROPE_WEST2, GCP_ASIA_SOUTHEAST1, GCP_ASIA_SOUTHEAST2, GCP_ASIA_SOUTH1, GCP_ASIA_NORTHEAST1, GCP_ASIA_NORTHEAST3, GCP_ME_CENTRAL2, AWS_US_EAST_1, AWS_US_EAST_2, AWS_US_WEST_2, AWS_AP_NORTHEAST_1, AWS_AP_NORTHEAST_2, AWS_AP_SOUTHEAST_1, AWS_AP_SOUTHEAST_2, AWS_EU_CENTRAL_1, AWS_EU_NORTH_1, AWS_EU_WEST_1, AWS_EU_WEST_2, AWS_EU_WEST_3, AWS_AP_SOUTH_1, AWS_CA_CENTRAL_1, AWS_US_GOV_WEST_1, AZURE_EASTUS2, AZURE_AUSTRALIAEAST, AZURE_UKSOUTH, AZURE_WESTEUROPE, AZURE_CENTRALUS, AZURE_CANADACENTRAL, AZURE_UAENORTH, AZURE_SOUTHEASTASIA, AZURE_EASTUS, AZURE_JAPANEAST, AZURE_CENTRALINDIA, AZURE_GERMANYWESTCENTRAL, AZURE_WESTUS3, AZURE_SWITZERLANDNORTH, AZURE_KOREACENTRAL) (example: GCP_US_EAST4)</td>
</tr>
<tr>
    <td><CopyableCode code="registered_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp of the time the proxy agent was created in your account. (example: 2018-12-01T15:43:29.013729Z)</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>The connection status of the proxy agent. (NOT_FOUND, CONNECTED, NOT_CONNECTED) (example: CONNECTED)</td>
</tr>
<tr>
    <td><CopyableCode code="usage" /></td>
    <td><code>array</code></td>
    <td>List of source connections and destinations using this proxy agent.</td>
</tr>
<tr>
    <td><CopyableCode code="version" /></td>
    <td><code>string</code></td>
    <td>The version of the proxy agent. (example: 1.0.0)</td>
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
    <td>The unique identifier for the proxy agent within the Fivetran system. (example: id)</td>
</tr>
<tr>
    <td><CopyableCode code="account_id" /></td>
    <td><code>string</code></td>
    <td>Fivetran Account ID. (example: account_id)</td>
</tr>
<tr>
    <td><CopyableCode code="display_name" /></td>
    <td><code>string</code></td>
    <td>Proxy agent name. (example: display_name)</td>
</tr>
<tr>
    <td><CopyableCode code="connector_count" /></td>
    <td><code>integer (int32)</code></td>
    <td>The number of source connections using the proxy agent.</td>
</tr>
<tr>
    <td><CopyableCode code="created_by" /></td>
    <td><code>string</code></td>
    <td>The actor who created the proxy agent. (example: created_by)</td>
</tr>
<tr>
    <td><CopyableCode code="destination_count" /></td>
    <td><code>integer (int32)</code></td>
    <td>The number of destinations using the proxy agent.</td>
</tr>
<tr>
    <td><CopyableCode code="region" /></td>
    <td><code>string</code></td>
    <td>Data processing location. This is where Fivetran will operate and run computation on data. (GCP_US_EAST4, GCP_US_WEST1, GCP_US_CENTRAL1, GCP_EUROPE_WEST3, GCP_AUSTRALIA_SOUTHEAST1, GCP_NORTHAMERICA_NORTHEAST1, GCP_EUROPE_WEST2, GCP_ASIA_SOUTHEAST1, GCP_ASIA_SOUTHEAST2, GCP_ASIA_SOUTH1, GCP_ASIA_NORTHEAST1, GCP_ASIA_NORTHEAST3, GCP_ME_CENTRAL2, AWS_US_EAST_1, AWS_US_EAST_2, AWS_US_WEST_2, AWS_AP_NORTHEAST_1, AWS_AP_NORTHEAST_2, AWS_AP_SOUTHEAST_1, AWS_AP_SOUTHEAST_2, AWS_EU_CENTRAL_1, AWS_EU_NORTH_1, AWS_EU_WEST_1, AWS_EU_WEST_2, AWS_EU_WEST_3, AWS_AP_SOUTH_1, AWS_CA_CENTRAL_1, AWS_US_GOV_WEST_1, AZURE_EASTUS2, AZURE_AUSTRALIAEAST, AZURE_UKSOUTH, AZURE_WESTEUROPE, AZURE_CENTRALUS, AZURE_CANADACENTRAL, AZURE_UAENORTH, AZURE_SOUTHEASTASIA, AZURE_EASTUS, AZURE_JAPANEAST, AZURE_CENTRALINDIA, AZURE_GERMANYWESTCENTRAL, AZURE_WESTUS3, AZURE_SWITZERLANDNORTH, AZURE_KOREACENTRAL) (example: GCP_US_EAST4)</td>
</tr>
<tr>
    <td><CopyableCode code="registered_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp of the time the proxy agent was created in your account. (example: 2018-12-01T15:43:29.013729Z)</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>string</code></td>
    <td>The connection status of the proxy agent. (NOT_FOUND, CONNECTED, NOT_CONNECTED) (example: CONNECTED)</td>
</tr>
<tr>
    <td><CopyableCode code="version" /></td>
    <td><code>string</code></td>
    <td>The version of the proxy agent. (example: 1.0.0)</td>
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
    <td>Retrieves the details of the specified proxy agent.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns a list of all proxy agents within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td></td>
    <td></td>
    <td>Creates a new proxy agent within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-agent_id"><code>agent_id</code></a></td>
    <td></td>
    <td>Deletes the specified proxy agent from your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#regenerate_secrets"><CopyableCode code="regenerate_secrets" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-agent_id"><code>agent_id</code></a></td>
    <td></td>
    <td>Regenerate secrets for proxy agent within your Fivetran account.</td>
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
    <td>The unique identifier for the proxy agent within the Fivetran system.</td>
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

Retrieves the details of the specified proxy agent.

```sql
SELECT
id,
account_id,
display_name,
created_by,
region,
registered_at,
status,
usage,
version
FROM fivetran.networking.proxy_agents
WHERE agent_id = '{{ agent_id }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns a list of all proxy agents within your Fivetran account.

```sql
SELECT
id,
account_id,
display_name,
connector_count,
created_by,
destination_count,
region,
registered_at,
status,
version
FROM fivetran.networking.proxy_agents
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

Creates a new proxy agent within your Fivetran account.

```sql
INSERT INTO fivetran.networking.proxy_agents (
display_name,
group_region
)
SELECT 
'{{ display_name }}',
'{{ group_region }}'
RETURNING
agent_id,
auth_token,
client_cert,
client_private_key,
orchestrator_host,
orchestrator_port
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: proxy_agents
  props:
    - name: display_name
      value: "{{ display_name }}"
      description: |
        Proxy agent name.
    - name: group_region
      value: "{{ group_region }}"
      description: |
        Data processing location. This is where Fivetran will operate and run computation on data (optional).
      valid_values: ['GCP_US_EAST4', 'GCP_US_WEST1', 'GCP_US_CENTRAL1', 'GCP_EUROPE_WEST3', 'GCP_AUSTRALIA_SOUTHEAST1', 'GCP_NORTHAMERICA_NORTHEAST1', 'GCP_EUROPE_WEST2', 'GCP_ASIA_SOUTHEAST1', 'GCP_ASIA_SOUTHEAST2', 'GCP_ASIA_SOUTH1', 'GCP_ASIA_NORTHEAST1', 'GCP_ASIA_NORTHEAST3', 'GCP_ME_CENTRAL2', 'AWS_US_EAST_1', 'AWS_US_EAST_2', 'AWS_US_WEST_2', 'AWS_AP_NORTHEAST_1', 'AWS_AP_NORTHEAST_2', 'AWS_AP_SOUTHEAST_1', 'AWS_AP_SOUTHEAST_2', 'AWS_EU_CENTRAL_1', 'AWS_EU_NORTH_1', 'AWS_EU_WEST_1', 'AWS_EU_WEST_2', 'AWS_EU_WEST_3', 'AWS_AP_SOUTH_1', 'AWS_CA_CENTRAL_1', 'AWS_US_GOV_WEST_1', 'AZURE_EASTUS2', 'AZURE_AUSTRALIAEAST', 'AZURE_UKSOUTH', 'AZURE_WESTEUROPE', 'AZURE_CENTRALUS', 'AZURE_CANADACENTRAL', 'AZURE_UAENORTH', 'AZURE_SOUTHEASTASIA', 'AZURE_EASTUS', 'AZURE_JAPANEAST', 'AZURE_CENTRALINDIA', 'AZURE_GERMANYWESTCENTRAL', 'AZURE_WESTUS3', 'AZURE_SWITZERLANDNORTH', 'AZURE_KOREACENTRAL']
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

Deletes the specified proxy agent from your Fivetran account.

```sql
DELETE FROM fivetran.networking.proxy_agents
WHERE agent_id = '{{ agent_id }}' --required
;
```
</TabItem>
</Tabs>


## Lifecycle Methods

EXEC variables use wire (API) names.

<Tabs
    defaultValue="regenerate_secrets"
    values={[
        { label: 'regenerate_secrets', value: 'regenerate_secrets' }
    ]}
>
<TabItem value="regenerate_secrets">

Regenerate secrets for proxy agent within your Fivetran account.

```sql
EXEC fivetran.networking.proxy_agents.regenerate_secrets 
@agent_id='{{ agent_id }}' --required
;
```
</TabItem>
</Tabs>
