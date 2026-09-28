--- 
title: private_links
hide_title: false
hide_table_of_contents: false
keywords:
  - private_links
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

Creates, updates, deletes, gets or lists a <code>private_links</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="private_links" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.networking.private_links" /></td></tr>
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
    <td>The unique identifier for the private link within the Fivetran system. (example: private_link_id)</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Private link name (example: PrivateLinkName)</td>
</tr>
<tr>
    <td><CopyableCode code="account_id" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="cloud_provider" /></td>
    <td><code>string</code></td>
    <td>Private link cloud provider (AWS, GCP, AZURE) (example: AWS)</td>
</tr>
<tr>
    <td><CopyableCode code="config" /></td>
    <td><code>object</code></td>
    <td>The `config` object for the `service` in question (a JSON value; its keys depend on the `service`). The accepted keys per type are documented in the vendor's API reference and returned by the connector metadata endpoints.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp of the time the private link was created in your account (example: 2023-12-01T15:43:29.013729Z)</td>
</tr>
<tr>
    <td><CopyableCode code="created_by" /></td>
    <td><code>string</code></td>
    <td>The actor who created the private link (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="host" /></td>
    <td><code>string</code></td>
    <td>The DNS name of the PrivateLink endpoint service. (example: example.host.com)</td>
</tr>
<tr>
    <td><CopyableCode code="region" /></td>
    <td><code>string</code></td>
    <td>Data processing location. This is where Fivetran will operate and run computation on data. (GCP_US_EAST4, GCP_US_WEST1, GCP_US_CENTRAL1, GCP_EUROPE_WEST3, GCP_AUSTRALIA_SOUTHEAST1, GCP_NORTHAMERICA_NORTHEAST1, GCP_EUROPE_WEST2, GCP_ASIA_SOUTHEAST1, GCP_ASIA_SOUTHEAST2, GCP_ASIA_SOUTH1, GCP_ASIA_NORTHEAST1, GCP_ASIA_NORTHEAST3, GCP_ME_CENTRAL2, AWS_US_EAST_1, AWS_US_EAST_2, AWS_US_WEST_2, AWS_AP_NORTHEAST_1, AWS_AP_NORTHEAST_2, AWS_AP_SOUTHEAST_1, AWS_AP_SOUTHEAST_2, AWS_EU_CENTRAL_1, AWS_EU_NORTH_1, AWS_EU_WEST_1, AWS_EU_WEST_2, AWS_EU_WEST_3, AWS_AP_SOUTH_1, AWS_CA_CENTRAL_1, AWS_US_GOV_WEST_1, AZURE_EASTUS2, AZURE_AUSTRALIAEAST, AZURE_UKSOUTH, AZURE_WESTEUROPE, AZURE_CENTRALUS, AZURE_CANADACENTRAL, AZURE_UAENORTH, AZURE_SOUTHEASTASIA, AZURE_EASTUS, AZURE_JAPANEAST, AZURE_CENTRALINDIA, AZURE_GERMANYWESTCENTRAL, AZURE_WESTUS3, AZURE_SWITZERLANDNORTH, AZURE_KOREACENTRAL) (example: AWS_US_EAST_1)</td>
</tr>
<tr>
    <td><CopyableCode code="resource_upstream_status" /></td>
    <td><code>string</code></td>
    <td>The upstream status of the PrivateLink resource as reported by the cloud provider. (example: IDLE)</td>
</tr>
<tr>
    <td><CopyableCode code="service" /></td>
    <td><code>string</code></td>
    <td>The name for the service type within the Fivetran system. (DATABRICKS_AWS, SNOWFLAKE_AWS, REDSHIFT_AWS, SOURCE_AWS, DATABRICKS_AZURE, SNOWFLAKE_AZURE, ONELAKE_AZURE, POSTGRES_WAREHOUSE_AZURE, SQL_DATA_WAREHOUSE_AZURE, SOURCE_AZURE, SNOWFLAKE_GCP, SOURCE_GCP, DATABRICKS_GCP) (example: DATABRICKS)</td>
</tr>
<tr>
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>Private link state (CREATING, UPDATING, DESTROYING, OK, FAIL) (example: OK)</td>
</tr>
<tr>
    <td><CopyableCode code="state_summary" /></td>
    <td><code>string</code></td>
    <td>Private link state summary (example: ...)</td>
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
    <td>The unique identifier for the private link within the Fivetran system. (example: private_link_id)</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>Private link name (example: PrivateLinkName)</td>
</tr>
<tr>
    <td><CopyableCode code="account_id" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="cloud_provider" /></td>
    <td><code>string</code></td>
    <td>Private link cloud provider (AWS, GCP, AZURE) (example: AWS)</td>
</tr>
<tr>
    <td><CopyableCode code="config" /></td>
    <td><code>object</code></td>
    <td>The `config` object for the `service` in question (a JSON value; its keys depend on the `service`). The accepted keys per type are documented in the vendor's API reference and returned by the connector metadata endpoints.</td>
</tr>
<tr>
    <td><CopyableCode code="created_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The timestamp of the time the private link was created in your account (example: 2023-12-01T15:43:29.013729Z)</td>
</tr>
<tr>
    <td><CopyableCode code="created_by" /></td>
    <td><code>string</code></td>
    <td>The actor who created the private link (example: user_id)</td>
</tr>
<tr>
    <td><CopyableCode code="host" /></td>
    <td><code>string</code></td>
    <td>The DNS name of the PrivateLink endpoint service. (example: example.host.com)</td>
</tr>
<tr>
    <td><CopyableCode code="region" /></td>
    <td><code>string</code></td>
    <td>Data processing location. This is where Fivetran will operate and run computation on data. (GCP_US_EAST4, GCP_US_WEST1, GCP_US_CENTRAL1, GCP_EUROPE_WEST3, GCP_AUSTRALIA_SOUTHEAST1, GCP_NORTHAMERICA_NORTHEAST1, GCP_EUROPE_WEST2, GCP_ASIA_SOUTHEAST1, GCP_ASIA_SOUTHEAST2, GCP_ASIA_SOUTH1, GCP_ASIA_NORTHEAST1, GCP_ASIA_NORTHEAST3, GCP_ME_CENTRAL2, AWS_US_EAST_1, AWS_US_EAST_2, AWS_US_WEST_2, AWS_AP_NORTHEAST_1, AWS_AP_NORTHEAST_2, AWS_AP_SOUTHEAST_1, AWS_AP_SOUTHEAST_2, AWS_EU_CENTRAL_1, AWS_EU_NORTH_1, AWS_EU_WEST_1, AWS_EU_WEST_2, AWS_EU_WEST_3, AWS_AP_SOUTH_1, AWS_CA_CENTRAL_1, AWS_US_GOV_WEST_1, AZURE_EASTUS2, AZURE_AUSTRALIAEAST, AZURE_UKSOUTH, AZURE_WESTEUROPE, AZURE_CENTRALUS, AZURE_CANADACENTRAL, AZURE_UAENORTH, AZURE_SOUTHEASTASIA, AZURE_EASTUS, AZURE_JAPANEAST, AZURE_CENTRALINDIA, AZURE_GERMANYWESTCENTRAL, AZURE_WESTUS3, AZURE_SWITZERLANDNORTH, AZURE_KOREACENTRAL) (example: AWS_US_EAST_1)</td>
</tr>
<tr>
    <td><CopyableCode code="resource_upstream_status" /></td>
    <td><code>string</code></td>
    <td>The upstream status of the PrivateLink resource as reported by the cloud provider. (example: IDLE)</td>
</tr>
<tr>
    <td><CopyableCode code="service" /></td>
    <td><code>string</code></td>
    <td>The name for the service type within the Fivetran system. (DATABRICKS_AWS, SNOWFLAKE_AWS, REDSHIFT_AWS, SOURCE_AWS, DATABRICKS_AZURE, SNOWFLAKE_AZURE, ONELAKE_AZURE, POSTGRES_WAREHOUSE_AZURE, SQL_DATA_WAREHOUSE_AZURE, SOURCE_AZURE, SNOWFLAKE_GCP, SOURCE_GCP, DATABRICKS_GCP) (example: DATABRICKS)</td>
</tr>
<tr>
    <td><CopyableCode code="state" /></td>
    <td><code>string</code></td>
    <td>Private link state (CREATING, UPDATING, DESTROYING, OK, FAIL) (example: OK)</td>
</tr>
<tr>
    <td><CopyableCode code="state_summary" /></td>
    <td><code>string</code></td>
    <td>Private link state summary (example: ...)</td>
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
    <td><a href="#parameter-private_link_id"><code>private_link_id</code></a></td>
    <td></td>
    <td>Returns a private link object if a valid identifier was provided.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns a list of all private links.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td><a href="#parameter-config"><code>config</code></a>, <a href="#parameter-name"><code>name</code></a>, <a href="#parameter-region"><code>region</code></a>, <a href="#parameter-service"><code>service</code></a></td>
    <td></td>
    <td>Creates a new private link in your Fivetran account. &lt;br /&gt;&lt;br /&gt;&gt; NOTE: See the &#91;Set Up a Connection With Private Links tutorial&#93;(https:​//fivetran.com/docs/rest-api/tutorials/set-up-connection-with-private-links) to learn how to use this endpoint to set up a &#91;database connection&#93;(https:​//fivetran.com/docs/connectors/databases) with &#91;private networking&#93;(https:​//fivetran.com/docs/using-fivetran/features#privatenetworking).&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#update"><CopyableCode code="update" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-private_link_id"><code>private_link_id</code></a></td>
    <td></td>
    <td>Updates information for an existing private link within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-private_link_id"><code>private_link_id</code></a></td>
    <td></td>
    <td>Deletes a private link from your Fivetran account.</td>
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
<tr id="parameter-private_link_id">
    <td><CopyableCode code="private_link_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the private link within the Fivetran system</td>
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

Returns a private link object if a valid identifier was provided.

```sql
SELECT
id,
name,
account_id,
cloud_provider,
config,
created_at,
created_by,
host,
region,
resource_upstream_status,
service,
state,
state_summary
FROM fivetran.networking.private_links
WHERE private_link_id = '{{ private_link_id }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns a list of all private links.

```sql
SELECT
id,
name,
account_id,
cloud_provider,
config,
created_at,
created_by,
host,
region,
resource_upstream_status,
service,
state,
state_summary
FROM fivetran.networking.private_links
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

Creates a new private link in your Fivetran account. &lt;br /&gt;&lt;br /&gt;&gt; NOTE: See the &#91;Set Up a Connection With Private Links tutorial&#93;(https:​//fivetran.com/docs/rest-api/tutorials/set-up-connection-with-private-links) to learn how to use this endpoint to set up a &#91;database connection&#93;(https:​//fivetran.com/docs/connectors/databases) with &#91;private networking&#93;(https:​//fivetran.com/docs/using-fivetran/features#privatenetworking).&lt;br /&gt;

```sql
INSERT INTO fivetran.networking.private_links (
name,
region,
service,
config
)
SELECT 
'{{ name }}' /* required */,
'{{ region }}' /* required */,
'{{ service }}' /* required */,
'{{ config }}' /* required */
RETURNING
id,
name,
account_id,
cloud_provider,
config,
created_at,
created_by,
host,
region,
resource_upstream_status,
service,
state,
state_summary
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: private_links
  props:
    - name: name
      value: "{{ name }}"
      description: |
        Private link name
    - name: region
      value: "{{ region }}"
      description: |
        Data processing location. This is where Fivetran will operate and run computation on data.
      valid_values: ['GCP_US_EAST4', 'GCP_US_WEST1', 'GCP_US_CENTRAL1', 'GCP_EUROPE_WEST3', 'GCP_AUSTRALIA_SOUTHEAST1', 'GCP_NORTHAMERICA_NORTHEAST1', 'GCP_EUROPE_WEST2', 'GCP_ASIA_SOUTHEAST1', 'GCP_ASIA_SOUTHEAST2', 'GCP_ASIA_SOUTH1', 'GCP_ASIA_NORTHEAST1', 'GCP_ASIA_NORTHEAST3', 'GCP_ME_CENTRAL2', 'AWS_US_EAST_1', 'AWS_US_EAST_2', 'AWS_US_WEST_2', 'AWS_AP_NORTHEAST_1', 'AWS_AP_NORTHEAST_2', 'AWS_AP_SOUTHEAST_1', 'AWS_AP_SOUTHEAST_2', 'AWS_EU_CENTRAL_1', 'AWS_EU_NORTH_1', 'AWS_EU_WEST_1', 'AWS_EU_WEST_2', 'AWS_EU_WEST_3', 'AWS_AP_SOUTH_1', 'AWS_CA_CENTRAL_1', 'AWS_US_GOV_WEST_1', 'AZURE_EASTUS2', 'AZURE_AUSTRALIAEAST', 'AZURE_UKSOUTH', 'AZURE_WESTEUROPE', 'AZURE_CENTRALUS', 'AZURE_CANADACENTRAL', 'AZURE_UAENORTH', 'AZURE_SOUTHEASTASIA', 'AZURE_EASTUS', 'AZURE_JAPANEAST', 'AZURE_CENTRALINDIA', 'AZURE_GERMANYWESTCENTRAL', 'AZURE_WESTUS3', 'AZURE_SWITZERLANDNORTH', 'AZURE_KOREACENTRAL']
    - name: service
      value: "{{ service }}"
      description: |
        The name for the service type within the Fivetran system.
      valid_values: ['DATABRICKS_AWS', 'SNOWFLAKE_AWS', 'REDSHIFT_AWS', 'SOURCE_AWS', 'DATABRICKS_AZURE', 'SNOWFLAKE_AZURE', 'ONELAKE_AZURE', 'POSTGRES_WAREHOUSE_AZURE', 'SQL_DATA_WAREHOUSE_AZURE', 'SOURCE_AZURE', 'SNOWFLAKE_GCP', 'SOURCE_GCP', 'DATABRICKS_GCP']
    - name: config
      value: "{{ config }}"
      description: |
        The \`config\` object for the \`service\` in question (a JSON value; its keys depend on the \`service\`). The accepted keys per type are documented in the vendor's API reference and returned by the connector metadata endpoints.
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

Updates information for an existing private link within your Fivetran account.

```sql
UPDATE fivetran.networking.private_links
SET 
config = '{{ config }}'
WHERE 
private_link_id = '{{ private_link_id }}' --required
RETURNING
id,
name,
account_id,
cloud_provider,
config,
created_at,
created_by,
host,
region,
resource_upstream_status,
service,
state,
state_summary;
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

Deletes a private link from your Fivetran account.

```sql
DELETE FROM fivetran.networking.private_links
WHERE private_link_id = '{{ private_link_id }}' --required
;
```
</TabItem>
</Tabs>
