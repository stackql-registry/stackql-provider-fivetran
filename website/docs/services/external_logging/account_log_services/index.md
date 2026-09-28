--- 
title: account_log_services
hide_title: false
hide_table_of_contents: false
keywords:
  - account_log_services
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

Creates, updates, deletes, gets or lists an <code>account_log_services</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="account_log_services" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.external_logging.account_log_services" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

<Tabs
    defaultValue="get"
    values={[
        { label: 'get', value: 'get' }
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
    <td></td>
    <td></td>
    <td>Returns the account-level &#91;logging service&#93;(https:​//fivetran.com/docs/logs/external-logs) if it exists.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td></td>
    <td></td>
    <td>Creates an account-level &#91;logging service&#93;(https:​//fivetran.com/docs/logs/external-logs).</td>
</tr>
<tr>
    <td><a href="#update"><CopyableCode code="update" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td></td>
    <td></td>
    <td>Updates information for the account-level &#91;logging service&#93;(https:​//fivetran.com/docs/logs/external-logs).</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td></td>
    <td></td>
    <td>Deletes the account-level &#91;logging service&#93;(https:​//fivetran.com/docs/logs/external-logs).</td>
</tr>
<tr>
    <td><a href="#run_setup_tests"><CopyableCode code="run_setup_tests" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td></td>
    <td></td>
    <td>Runs the setup tests for the account-level &#91;logging service&#93;(https:​//fivetran.com/docs/logs/external-logs).</td>
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

## `SELECT` examples

<Tabs
    defaultValue="get"
    values={[
        { label: 'get', value: 'get' }
    ]}
>
<TabItem value="get">

Returns the account-level [logging service](https://fivetran.com/docs/logs/external-logs) if it exists.

```sql
SELECT
id,
config,
enabled,
service,
setup_tests,
status
FROM fivetran.external_logging.account_log_services
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

Creates an account-level [logging service](https://fivetran.com/docs/logs/external-logs).

```sql
INSERT INTO fivetran.external_logging.account_log_services (
service,
enabled,
config,
run_setup_tests
)
SELECT 
'{{ service }}',
{{ enabled }},
'{{ config }}',
{{ run_setup_tests }}
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
- name: account_log_services
  props:
    - name: service
      value: "{{ service }}"
      description: |
        The name of the log service type within the Fivetran system. We support the following log services: \`azure_monitor_log\`, \`cloudwatch\`, \`datadog_log\`, \`dynatrace\`, \`grafana_loki\`, \`splunkLog\`, \`new_relic_log\`, \`stackdriver\` (Google Cloud Logging).
    - name: enabled
      value: {{ enabled }}
      description: |
        The boolean value specifying whether the log service is enabled.
    - name: config
      value: "{{ config }}"
      description: |
        (opaque JSON object)
    - name: run_setup_tests
      value: {{ run_setup_tests }}
      description: |
        When \`true\`, Fivetran runs setup tests immediately after creating or updating the log service and returns the results in the \`setup_tests\` field of the response. Defaults to \`false\`.
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

Updates information for the account-level [logging service](https://fivetran.com/docs/logs/external-logs).

```sql
UPDATE fivetran.external_logging.account_log_services
SET 
enabled = {{ enabled }},
config = '{{ config }}',
run_setup_tests = {{ run_setup_tests }}
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

Deletes the account-level [logging service](https://fivetran.com/docs/logs/external-logs).

```sql
DELETE FROM fivetran.external_logging.account_log_services
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

Runs the setup tests for the account-level [logging service](https://fivetran.com/docs/logs/external-logs).

```sql
EXEC fivetran.external_logging.account_log_services.run_setup_tests 

;
```
</TabItem>
</Tabs>
