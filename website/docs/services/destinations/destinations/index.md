--- 
title: destinations
hide_title: false
hide_table_of_contents: false
keywords:
  - destinations
  - destinations
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

Creates, updates, deletes, gets or lists a <code>destinations</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="destinations" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.destinations.destinations" /></td></tr>
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
    <td>The unique identifier for the destination within the Fivetran system (example: destination_id)</td>
</tr>
<tr>
    <td><CopyableCode code="external_secrets_manager_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the &#91;External Secrets Manager&#93;(https:​//fivetran.com/docs/rest-api/api-reference/external-secrets-managers) instance. Destination service must &#91;support&#93;(https:​//fivetran.com/docs/core-concepts/features/external-secret-managers#destinations) External Secrets Manager feature to use this field.</td>
</tr>
<tr>
    <td><CopyableCode code="group_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the group within the Fivetran system. (example: group_id)</td>
</tr>
<tr>
    <td><CopyableCode code="hybrid_deployment_agent_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the hybrid deployment agent within the Fivetran system (example: hybrid_deployment_agent_id)</td>
</tr>
<tr>
    <td><CopyableCode code="local_processing_agent_id" /></td>
    <td><code>string</code></td>
    <td>(Deprecated) The unique identifier for the hybrid deployment agent within the Fivetran system (example: local_processing_agent_id)</td>
</tr>
<tr>
    <td><CopyableCode code="private_link_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the self-served private link that is used by the connection (example: private_link_id)</td>
</tr>
<tr>
    <td><CopyableCode code="proxy_agent_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the proxy agent within the Fivetran system (example: proxy_agent_id)</td>
</tr>
<tr>
    <td><CopyableCode code="config" /></td>
    <td><code>object</code></td>
    <td>The `config` object for the `service` in question (a JSON value; its keys depend on the `service`). The accepted keys per type are documented in the vendor's API reference and returned by the connector metadata endpoints.</td>
</tr>
<tr>
    <td><CopyableCode code="daylight_saving_time_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Shift my UTC offset with daylight savings time (US Only)</td>
</tr>
<tr>
    <td><CopyableCode code="external_secrets_keys_config" /></td>
    <td><code>object</code></td>
    <td>The `external_secrets_keys_config` object for the `service` in question (a JSON value; its keys depend on the `service`). The accepted keys per type are documented in the vendor's API reference and returned by the connector metadata endpoints.</td>
</tr>
<tr>
    <td><CopyableCode code="networking_method" /></td>
    <td><code>string</code></td>
    <td> (Directly, PrivateLink, SshTunnel, ProxyAgent)</td>
</tr>
<tr>
    <td><CopyableCode code="region" /></td>
    <td><code>string</code></td>
    <td>Data processing location. This is where Fivetran will operate and run computation on data. (GCP_US_EAST4, GCP_US_WEST1, GCP_US_CENTRAL1, GCP_EUROPE_WEST3, GCP_AUSTRALIA_SOUTHEAST1, GCP_NORTHAMERICA_NORTHEAST1, GCP_EUROPE_WEST2, GCP_ASIA_SOUTHEAST1, GCP_ASIA_SOUTHEAST2, GCP_ASIA_SOUTH1, GCP_ASIA_NORTHEAST1, GCP_ASIA_NORTHEAST3, GCP_ME_CENTRAL2, AWS_US_EAST_1, AWS_US_EAST_2, AWS_US_WEST_2, AWS_AP_NORTHEAST_1, AWS_AP_NORTHEAST_2, AWS_AP_SOUTHEAST_1, AWS_AP_SOUTHEAST_2, AWS_EU_CENTRAL_1, AWS_EU_NORTH_1, AWS_EU_WEST_1, AWS_EU_WEST_2, AWS_EU_WEST_3, AWS_AP_SOUTH_1, AWS_CA_CENTRAL_1, AWS_US_GOV_WEST_1, AZURE_EASTUS2, AZURE_AUSTRALIAEAST, AZURE_UKSOUTH, AZURE_WESTEUROPE, AZURE_CENTRALUS, AZURE_CANADACENTRAL, AZURE_UAENORTH, AZURE_SOUTHEASTASIA, AZURE_EASTUS, AZURE_JAPANEAST, AZURE_CENTRALINDIA, AZURE_GERMANYWESTCENTRAL, AZURE_WESTUS3, AZURE_SWITZERLANDNORTH, AZURE_KOREACENTRAL) (example: GCP_US_EAST4)</td>
</tr>
<tr>
    <td><CopyableCode code="service" /></td>
    <td><code>string</code></td>
    <td>The name for the destination type within the Fivetran system. (example: snowflake)</td>
</tr>
<tr>
    <td><CopyableCode code="setup_status" /></td>
    <td><code>string</code></td>
    <td>Destination setup status (INCOMPLETE, CONNECTED, BROKEN) (example: CONNECTED)</td>
</tr>
<tr>
    <td><CopyableCode code="setup_tests" /></td>
    <td><code>array</code></td>
    <td>Setup tests results for this destination</td>
</tr>
<tr>
    <td><CopyableCode code="time_zone_offset" /></td>
    <td><code>string</code></td>
    <td>Determines the time zone for the Fivetran sync schedule. (-11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, +1, +2, +3, +4, +5, +6, +7, +8, +9, +10, +11, +12) (example: +3)</td>
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
    <td>The unique identifier for the destination within the Fivetran system (example: destination_id)</td>
</tr>
<tr>
    <td><CopyableCode code="external_secrets_manager_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier of the &#91;External Secrets Manager&#93;(https:​//fivetran.com/docs/rest-api/api-reference/external-secrets-managers) instance. Destination service must &#91;support&#93;(https:​//fivetran.com/docs/core-concepts/features/external-secret-managers#destinations) External Secrets Manager feature to use this field.</td>
</tr>
<tr>
    <td><CopyableCode code="group_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the group within the Fivetran system. (example: group_id)</td>
</tr>
<tr>
    <td><CopyableCode code="hybrid_deployment_agent_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the hybrid deployment agent within the Fivetran system (example: hybrid_deployment_agent_id)</td>
</tr>
<tr>
    <td><CopyableCode code="local_processing_agent_id" /></td>
    <td><code>string</code></td>
    <td>(Deprecated) The unique identifier for the hybrid deployment agent within the Fivetran system (example: local_processing_agent_id)</td>
</tr>
<tr>
    <td><CopyableCode code="private_link_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the self-served private link that is used by the connection (example: private_link_id)</td>
</tr>
<tr>
    <td><CopyableCode code="proxy_agent_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the proxy agent within the Fivetran system (example: proxy_agent_id)</td>
</tr>
<tr>
    <td><CopyableCode code="daylight_saving_time_enabled" /></td>
    <td><code>boolean</code></td>
    <td>Shift my UTC offset with daylight savings time (US Only)</td>
</tr>
<tr>
    <td><CopyableCode code="networking_method" /></td>
    <td><code>string</code></td>
    <td> (Directly, PrivateLink, SshTunnel, ProxyAgent)</td>
</tr>
<tr>
    <td><CopyableCode code="region" /></td>
    <td><code>string</code></td>
    <td>Data processing location. This is where Fivetran will operate and run computation on data. (GCP_US_EAST4, GCP_US_WEST1, GCP_US_CENTRAL1, GCP_EUROPE_WEST3, GCP_AUSTRALIA_SOUTHEAST1, GCP_NORTHAMERICA_NORTHEAST1, GCP_EUROPE_WEST2, GCP_ASIA_SOUTHEAST1, GCP_ASIA_SOUTHEAST2, GCP_ASIA_SOUTH1, GCP_ASIA_NORTHEAST1, GCP_ASIA_NORTHEAST3, GCP_ME_CENTRAL2, AWS_US_EAST_1, AWS_US_EAST_2, AWS_US_WEST_2, AWS_AP_NORTHEAST_1, AWS_AP_NORTHEAST_2, AWS_AP_SOUTHEAST_1, AWS_AP_SOUTHEAST_2, AWS_EU_CENTRAL_1, AWS_EU_NORTH_1, AWS_EU_WEST_1, AWS_EU_WEST_2, AWS_EU_WEST_3, AWS_AP_SOUTH_1, AWS_CA_CENTRAL_1, AWS_US_GOV_WEST_1, AZURE_EASTUS2, AZURE_AUSTRALIAEAST, AZURE_UKSOUTH, AZURE_WESTEUROPE, AZURE_CENTRALUS, AZURE_CANADACENTRAL, AZURE_UAENORTH, AZURE_SOUTHEASTASIA, AZURE_EASTUS, AZURE_JAPANEAST, AZURE_CENTRALINDIA, AZURE_GERMANYWESTCENTRAL, AZURE_WESTUS3, AZURE_SWITZERLANDNORTH, AZURE_KOREACENTRAL) (example: GCP_US_EAST4)</td>
</tr>
<tr>
    <td><CopyableCode code="service" /></td>
    <td><code>string</code></td>
    <td>The name for the destination type within the Fivetran system. (example: snowflake)</td>
</tr>
<tr>
    <td><CopyableCode code="setup_status" /></td>
    <td><code>string</code></td>
    <td>Destination setup status (INCOMPLETE, CONNECTED, BROKEN) (example: CONNECTED)</td>
</tr>
<tr>
    <td><CopyableCode code="time_zone_offset" /></td>
    <td><code>string</code></td>
    <td>Determines the time zone for the Fivetran sync schedule. (-11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, +1, +2, +3, +4, +5, +6, +7, +8, +9, +10, +11, +12) (example: +3)</td>
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
    <td><a href="#parameter-destination_id"><code>destination_id</code></a></td>
    <td></td>
    <td>Returns a destination object if a valid identifier was provided.&lt;br /&gt;&lt;br /&gt;To find a destination's unique identifier, call the &#91;List All Groups&#93;(https:​//fivetran.com/docs/rest-api/groups#listallgroups) endpoint and search the response `items` for your target destination by its `name` field. The group's `id` value is also the destination's `id`, since groups and destinations are mapped 1:1.&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns a list of all accessible destinations within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td><a href="#parameter-group_id"><code>group_id</code></a>, <a href="#parameter-service"><code>service</code></a>, <a href="#parameter-time_zone_offset"><code>time_zone_offset</code></a></td>
    <td></td>
    <td>Creates a new destination within a specified group in your Fivetran account.&lt;br /&gt;&lt;br /&gt;&gt; IMPORTANT: Groups and destinations are mapped 1:1 to each other. We do this mapping using the group's `id` value that we automatically generate when you create a group, and the destination's `group_id` value that you specify when you create a destination. This means that you must create a group in your Fivetran account before you can create a destination in it.&lt;br /&gt;&lt;br /&gt;&gt; IMPORTANT: If you want to get the certificate details, do not set `trust_certificates` to `true` when you create a destination with our REST API. We can only provide the certificate details through the failed Validate Certificate setup test. For a full walkthrough, see &#91;Get Destination Certificate Details&#93;(https:​//fivetran.com/docs/rest-api/tutorials/get-destination-certificate-details).&lt;br /&gt;</td>
</tr>
<tr>
    <td><a href="#update"><CopyableCode code="update" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-destination_id"><code>destination_id</code></a>, <a href="#parameter-time_zone_offset"><code>time_zone_offset</code></a></td>
    <td></td>
    <td>Updates information for an existing destination within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-destination_id"><code>destination_id</code></a></td>
    <td></td>
    <td>Deletes a destination from your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#run_setup_tests"><CopyableCode code="run_setup_tests" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-destination_id"><code>destination_id</code></a></td>
    <td></td>
    <td>Runs the setup tests for an existing destination within your Fivetran account.</td>
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

Returns a destination object if a valid identifier was provided.&lt;br /&gt;&lt;br /&gt;To find a destination's unique identifier, call the &#91;List All Groups&#93;(https:​//fivetran.com/docs/rest-api/groups#listallgroups) endpoint and search the response `items` for your target destination by its `name` field. The group's `id` value is also the destination's `id`, since groups and destinations are mapped 1:1.&lt;br /&gt;

```sql
SELECT
id,
external_secrets_manager_id,
group_id,
hybrid_deployment_agent_id,
local_processing_agent_id,
private_link_id,
proxy_agent_id,
config,
daylight_saving_time_enabled,
external_secrets_keys_config,
networking_method,
region,
service,
setup_status,
setup_tests,
time_zone_offset
FROM fivetran.destinations.destinations
WHERE destination_id = '{{ destination_id }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns a list of all accessible destinations within your Fivetran account.

```sql
SELECT
id,
external_secrets_manager_id,
group_id,
hybrid_deployment_agent_id,
local_processing_agent_id,
private_link_id,
proxy_agent_id,
daylight_saving_time_enabled,
networking_method,
region,
service,
setup_status,
time_zone_offset
FROM fivetran.destinations.destinations
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

Creates a new destination within a specified group in your Fivetran account.&lt;br /&gt;&lt;br /&gt;&gt; IMPORTANT: Groups and destinations are mapped 1:1 to each other. We do this mapping using the group's `id` value that we automatically generate when you create a group, and the destination's `group_id` value that you specify when you create a destination. This means that you must create a group in your Fivetran account before you can create a destination in it.&lt;br /&gt;&lt;br /&gt;&gt; IMPORTANT: If you want to get the certificate details, do not set `trust_certificates` to `true` when you create a destination with our REST API. We can only provide the certificate details through the failed Validate Certificate setup test. For a full walkthrough, see &#91;Get Destination Certificate Details&#93;(https:​//fivetran.com/docs/rest-api/tutorials/get-destination-certificate-details).&lt;br /&gt;

```sql
INSERT INTO fivetran.destinations.destinations (
group_id,
service,
region,
time_zone_offset,
trust_certificates,
trust_fingerprints,
run_setup_tests,
daylight_saving_time_enabled,
hybrid_deployment_agent_id,
private_link_id,
networking_method,
proxy_agent_id,
external_secrets_manager_id,
config,
external_secrets_keys_config
)
SELECT 
'{{ group_id }}' /* required */,
'{{ service }}' /* required */,
'{{ region }}',
'{{ time_zone_offset }}' /* required */,
{{ trust_certificates }},
{{ trust_fingerprints }},
{{ run_setup_tests }},
{{ daylight_saving_time_enabled }},
'{{ hybrid_deployment_agent_id }}',
'{{ private_link_id }}',
'{{ networking_method }}',
'{{ proxy_agent_id }}',
'{{ external_secrets_manager_id }}',
'{{ config }}',
'{{ external_secrets_keys_config }}'
RETURNING
id,
external_secrets_manager_id,
group_id,
hybrid_deployment_agent_id,
local_processing_agent_id,
private_link_id,
proxy_agent_id,
config,
daylight_saving_time_enabled,
external_secrets_keys_config,
networking_method,
region,
service,
setup_status,
setup_tests,
time_zone_offset
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: destinations
  props:
    - name: group_id
      value: "{{ group_id }}"
      description: |
        The unique identifier for the group within the Fivetran system.
    - name: service
      value: "{{ service }}"
      description: |
        The name for the destination type within the Fivetran system.
    - name: region
      value: "{{ region }}"
      description: |
        Data processing location. This is where Fivetran will operate and run computation on data.
      valid_values: ['GCP_US_EAST4', 'GCP_US_WEST1', 'GCP_US_CENTRAL1', 'GCP_EUROPE_WEST3', 'GCP_AUSTRALIA_SOUTHEAST1', 'GCP_NORTHAMERICA_NORTHEAST1', 'GCP_EUROPE_WEST2', 'GCP_ASIA_SOUTHEAST1', 'GCP_ASIA_SOUTHEAST2', 'GCP_ASIA_SOUTH1', 'GCP_ASIA_NORTHEAST1', 'GCP_ASIA_NORTHEAST3', 'GCP_ME_CENTRAL2', 'AWS_US_EAST_1', 'AWS_US_EAST_2', 'AWS_US_WEST_2', 'AWS_AP_NORTHEAST_1', 'AWS_AP_NORTHEAST_2', 'AWS_AP_SOUTHEAST_1', 'AWS_AP_SOUTHEAST_2', 'AWS_EU_CENTRAL_1', 'AWS_EU_NORTH_1', 'AWS_EU_WEST_1', 'AWS_EU_WEST_2', 'AWS_EU_WEST_3', 'AWS_AP_SOUTH_1', 'AWS_CA_CENTRAL_1', 'AWS_US_GOV_WEST_1', 'AZURE_EASTUS2', 'AZURE_AUSTRALIAEAST', 'AZURE_UKSOUTH', 'AZURE_WESTEUROPE', 'AZURE_CENTRALUS', 'AZURE_CANADACENTRAL', 'AZURE_UAENORTH', 'AZURE_SOUTHEASTASIA', 'AZURE_EASTUS', 'AZURE_JAPANEAST', 'AZURE_CENTRALINDIA', 'AZURE_GERMANYWESTCENTRAL', 'AZURE_WESTUS3', 'AZURE_SWITZERLANDNORTH', 'AZURE_KOREACENTRAL']
    - name: time_zone_offset
      value: "{{ time_zone_offset }}"
      description: |
        Determines the time zone for the Fivetran sync schedule.
      valid_values: ['-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0', '+1', '+2', '+3', '+4', '+5', '+6', '+7', '+8', '+9', '+10', '+11', '+12']
    - name: trust_certificates
      value: {{ trust_certificates }}
      description: |
        Specifies whether we should trust the certificate automatically. The default value is FALSE. If a certificate is not trusted automatically, it has to be approved by calling the [Approve destination certificate endpoint](https://fivetran.com/docs/rest-api/api-reference/certificates/approve-destination-certificate).
        > IMPORTANT: To capture the \`hash\` and \`encoded_cert\` values needed for approval, omit this field or set it to \`false\`.
    - name: trust_fingerprints
      value: {{ trust_fingerprints }}
      description: |
        Specifies whether we should trust the SSH fingerprint automatically. The default value is FALSE. If a fingerprint is not trusted automatically, it has to be approved by calling the [Approve destination fingerprint endpoint](https://fivetran.com/docs/rest-api/api-reference/certificates/approve-destination-fingerprint).
        > IMPORTANT: To capture the \`hash\` and \`public_key\` values needed for approval, omit this field or set it to \`false\`.
    - name: run_setup_tests
      value: {{ run_setup_tests }}
      description: |
        Specifies whether setup tests should be run automatically.
    - name: daylight_saving_time_enabled
      value: {{ daylight_saving_time_enabled }}
      description: |
        Shift my UTC offset with daylight savings time (US Only)
    - name: hybrid_deployment_agent_id
      value: "{{ hybrid_deployment_agent_id }}"
      description: |
        The unique identifier for the hybrid deployment agent within the Fivetran system
    - name: private_link_id
      value: "{{ private_link_id }}"
      description: |
        The unique identifier for the self-served private link that is used by the connection
    - name: networking_method
      value: "{{ networking_method }}"
      valid_values: ['Directly', 'PrivateLink', 'SshTunnel', 'ProxyAgent']
    - name: proxy_agent_id
      value: "{{ proxy_agent_id }}"
      description: |
        The unique identifier for the proxy agent within the Fivetran system
    - name: external_secrets_manager_id
      value: "{{ external_secrets_manager_id }}"
      description: |
        The unique identifier of the [External Secrets Manager](https://fivetran.com/docs/rest-api/api-reference/external-secrets-managers) instance. Destination service must [support](https://fivetran.com/docs/core-concepts/features/external-secret-managers#destinations) External Secrets Manager feature to use this field.
    - name: config
      value: "{{ config }}"
      description: |
        The \`config\` object for the \`service\` in question (a JSON value; its keys depend on the \`service\`). The accepted keys per type are documented in the vendor's API reference and returned by the connector metadata endpoints.
    - name: external_secrets_keys_config
      value: "{{ external_secrets_keys_config }}"
      description: |
        The \`external_secrets_keys_config\` object for the \`service\` in question (a JSON value; its keys depend on the \`service\`). The accepted keys per type are documented in the vendor's API reference and returned by the connector metadata endpoints.
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

Updates information for an existing destination within your Fivetran account.

```sql
UPDATE fivetran.destinations.destinations
SET 
region = '{{ region }}',
config = '{{ config }}',
trust_certificates = {{ trust_certificates }},
trust_fingerprints = {{ trust_fingerprints }},
time_zone_offset = '{{ time_zone_offset }}',
run_setup_tests = {{ run_setup_tests }},
daylight_saving_time_enabled = {{ daylight_saving_time_enabled }},
hybrid_deployment_agent_id = '{{ hybrid_deployment_agent_id }}',
private_link_id = '{{ private_link_id }}',
networking_method = '{{ networking_method }}',
proxy_agent_id = '{{ proxy_agent_id }}',
external_secrets_manager_id = '{{ external_secrets_manager_id }}',
external_secrets_keys_config = '{{ external_secrets_keys_config }}'
WHERE 
destination_id = '{{ destination_id }}' --required
AND time_zone_offset = '{{ time_zone_offset }}' --required
RETURNING
id,
external_secrets_manager_id,
group_id,
hybrid_deployment_agent_id,
local_processing_agent_id,
private_link_id,
proxy_agent_id,
config,
daylight_saving_time_enabled,
external_secrets_keys_config,
networking_method,
region,
service,
setup_status,
setup_tests,
time_zone_offset;
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

Deletes a destination from your Fivetran account.

```sql
DELETE FROM fivetran.destinations.destinations
WHERE destination_id = '{{ destination_id }}' --required
;
```
</TabItem>
</Tabs>


## Lifecycle Methods

EXEC variables use wire (API) names.

<Tabs
    defaultValue="run_setup_tests"
    values={[
        { label: 'run_setup_tests', value: 'run_setup_tests' }
    ]}
>
<TabItem value="run_setup_tests">

Runs the setup tests for an existing destination within your Fivetran account.

```sql
EXEC fivetran.destinations.destinations.run_setup_tests 
@destination_id='{{ destination_id }}' --required 
@@json=
'{
"trust_certificates": {{ trust_certificates }}, 
"trust_fingerprints": {{ trust_fingerprints }}
}'
;
```
</TabItem>
</Tabs>
