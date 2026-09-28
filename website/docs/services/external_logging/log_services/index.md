--- 
title: log_services
hide_title: false
hide_table_of_contents: false
keywords:
  - log_services
  - external_logging
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

Creates, updates, deletes, gets or lists a <code>log_services</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="log_services" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.external_logging.log_services" /></td></tr>
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
    <td>The unique identifier for the log service within the Fivetran system. (example: log_id)</td>
</tr>
<tr>
    <td><CopyableCode code="config" /></td>
    <td><code>object</code></td>
    <td>The `config` object for the `service` in question (a JSON value; its keys depend on the `service`). The accepted keys per type are documented in the vendor's API reference and returned by the connector metadata endpoints.</td>
</tr>
<tr>
    <td><CopyableCode code="enabled" /></td>
    <td><code>boolean</code></td>
    <td>The boolean value specifying whether the log service is enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="service" /></td>
    <td><code>string</code></td>
    <td>The name of the log service type within the Fivetran system. We support the following log services: `azure_monitor_log`, `cloudwatch`, `datadog_log`, `dynatrace`, `grafana_loki`, `splunkLog`, `new_relic_log`, `stackdriver` (Google Cloud Logging). (example: log_service_type)</td>
</tr>
<tr>
    <td><CopyableCode code="setup_tests" /></td>
    <td><code>array</code></td>
    <td>Results of the most recent setup test run.</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>object</code></td>
    <td>Setup status of the log service. Present when a setup status exists for the log service.</td>
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
    <td>The unique identifier for the log service within the Fivetran system. (example: log_id)</td>
</tr>
<tr>
    <td><CopyableCode code="enabled" /></td>
    <td><code>boolean</code></td>
    <td>The boolean value specifying whether the log service is enabled.</td>
</tr>
<tr>
    <td><CopyableCode code="service" /></td>
    <td><code>string</code></td>
    <td>The name of the log service type within the Fivetran system. We support the following log services: `azure_monitor_log`, `cloudwatch`, `datadog_log`, `dynatrace`, `grafana_loki`, `splunkLog`, `new_relic_log`, `stackdriver` (Google Cloud Logging). (example: log_service_type)</td>
</tr>
<tr>
    <td><CopyableCode code="status" /></td>
    <td><code>object</code></td>
    <td>Setup status of the log service. Present when a setup status exists for the log service.</td>
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
    <td><a href="#parameter-log_id"><code>log_id</code></a></td>
    <td></td>
    <td>Returns a group-level &#91;logging service&#93;(https:​//fivetran.com/docs/logs/external-logs) object if a valid identifier was provided.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns a list of all accessible &#91;logging services&#93;(https:​//fivetran.com/docs/logs/external-logs) within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td></td>
    <td></td>
    <td>Creates a new group-level &#91;logging service&#93;(https:​//fivetran.com/docs/logs/external-logs) within a specified group in your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#update"><CopyableCode code="update" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-log_id"><code>log_id</code></a></td>
    <td></td>
    <td>Updates information for an existing group-level &#91;logging service&#93;(https:​//fivetran.com/docs/logs/external-logs) within your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-log_id"><code>log_id</code></a></td>
    <td></td>
    <td>Deletes a group-level &#91;logging service&#93;(https:​//fivetran.com/docs/logs/external-logs) from your Fivetran account.</td>
</tr>
<tr>
    <td><a href="#run_setup_tests"><CopyableCode code="run_setup_tests" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-log_id"><code>log_id</code></a></td>
    <td></td>
    <td>Runs the setup tests for an existing group-level &#91;logging service&#93;(https:​//fivetran.com/docs/logs/external-logs) within your Fivetran account.</td>
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
<tr id="parameter-log_id">
    <td><CopyableCode code="log_id" /></td>
    <td><code>string</code></td>
    <td>The unique identifier for the log service within the Fivetran system.</td>
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

Returns a group-level [logging service](https://fivetran.com/docs/logs/external-logs) object if a valid identifier was provided.

```sql
SELECT
id,
config,
enabled,
service,
setup_tests,
status
FROM fivetran.external_logging.log_services
WHERE log_id = '{{ log_id }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns a list of all accessible [logging services](https://fivetran.com/docs/logs/external-logs) within your Fivetran account.

```sql
SELECT
id,
enabled,
service,
status
FROM fivetran.external_logging.log_services
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

Creates a new group-level [logging service](https://fivetran.com/docs/logs/external-logs) within a specified group in your Fivetran account.

```sql
INSERT INTO fivetran.external_logging.log_services (
group_id,
service,
enabled,
run_setup_tests,
config
)
SELECT 
'{{ group_id }}',
'{{ service }}',
{{ enabled }},
{{ run_setup_tests }},
'{{ config }}'
RETURNING
id,
config,
enabled,
service,
setup_tests,
status
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: log_services
  props:
    - name: group_id
      value: "{{ group_id }}"
      description: |
        The unique identifier for the group within the Fivetran system
    - name: service
      value: "{{ service }}"
      description: |
        The name of the log service type within the Fivetran system. We support the following log services: \`azure_monitor_log\`, \`cloudwatch\`, \`datadog_log\`, \`dynatrace\`, \`grafana_loki\`, \`splunkLog\`, \`new_relic_log\`, \`stackdriver\` (Google Cloud Logging).
    - name: enabled
      value: {{ enabled }}
      description: |
        The boolean value specifying whether the log service is enabled.
    - name: run_setup_tests
      value: {{ run_setup_tests }}
      description: |
        When \`true\`, Fivetran runs setup tests immediately after creating or updating the log service and returns the results in the \`setup_tests\` field of the response. Defaults to \`false\`.
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

Updates information for an existing group-level [logging service](https://fivetran.com/docs/logs/external-logs) within your Fivetran account.

```sql
UPDATE fivetran.external_logging.log_services
SET 
enabled = {{ enabled }},
config = '{{ config }}',
run_setup_tests = {{ run_setup_tests }}
WHERE 
log_id = '{{ log_id }}' --required
RETURNING
id,
config,
enabled,
service,
setup_tests,
status;
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

Deletes a group-level [logging service](https://fivetran.com/docs/logs/external-logs) from your Fivetran account.

```sql
DELETE FROM fivetran.external_logging.log_services
WHERE log_id = '{{ log_id }}' --required
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

Runs the setup tests for an existing group-level [logging service](https://fivetran.com/docs/logs/external-logs) within your Fivetran account.

```sql
EXEC fivetran.external_logging.log_services.run_setup_tests 
@log_id='{{ log_id }}' --required
;
```
</TabItem>
</Tabs>
