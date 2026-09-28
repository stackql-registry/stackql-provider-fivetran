--- 
title: connector_types
hide_title: false
hide_table_of_contents: false
keywords:
  - connector_types
  - metadata
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

Creates, updates, deletes, gets or lists a <code>connector_types</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="connector_types" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="fivetran.metadata.connector_types" /></td></tr>
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
    <td>The connector type identifier within the Fivetran system (example: google_ads)</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>The connector service name within the Fivetran system (example: Google Ads)</td>
</tr>
<tr>
    <td><CopyableCode code="auth" /></td>
    <td><code>string</code></td>
    <td>Metadata for authorization fields (optional) (opaque JSON object)</td>
</tr>
<tr>
    <td><CopyableCode code="config" /></td>
    <td><code>string</code></td>
    <td>Metadata for configuration fields (opaque JSON object)</td>
</tr>
<tr>
    <td><CopyableCode code="connector_class" /></td>
    <td><code>string</code></td>
    <td> (standard, lite)</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>The description characterizing the purpose of the connector (example: Google Ads is an online advertising platform)</td>
</tr>
<tr>
    <td><CopyableCode code="external_secrets_keys_config" /></td>
    <td><code>string</code></td>
    <td>(opaque JSON object)</td>
</tr>
<tr>
    <td><CopyableCode code="icon_url" /></td>
    <td><code>string</code></td>
    <td>The icon resource URL (example: https:​//fivetran.com/integrations/google_ads/resources/google-ads.png)</td>
</tr>
<tr>
    <td><CopyableCode code="icons" /></td>
    <td><code>array</code></td>
    <td>The set of additional icon resource URLs in different formats (.svg, .png). Updating this list is not a breaking change. The set of icon URLs or the icons themselves may be changed</td>
</tr>
<tr>
    <td><CopyableCode code="link_to_docs" /></td>
    <td><code>string</code></td>
    <td>The link to the connector documentation (example: https:​//fivetran.com/docs/connectors/applications/google-ads)</td>
</tr>
<tr>
    <td><CopyableCode code="link_to_erd" /></td>
    <td><code>string</code></td>
    <td>The link to the connector ERD (entity–relationship diagram) (example: https:​//docs.google.com/presentation/d/1f16zOPxwT1AXoOcNkvwT82ApKqU1yhtJ04f-73M91nw/embed)</td>
</tr>
<tr>
    <td><CopyableCode code="service_status" /></td>
    <td><code>string</code></td>
    <td>The current availability status of the connector (general_availability, beta, private_preview, sunset, development) (example: general_availability)</td>
</tr>
<tr>
    <td><CopyableCode code="service_status_updated_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The date (yyyy-MM-dd) the connector status was updated to the current availability status</td>
</tr>
<tr>
    <td><CopyableCode code="supported_features" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>The connector service type (API, Dbt, Marketing, HumanResources, Finance, Productivity, Engineering, Support, Sales, Security, SuperConnectorTest, Free, File, Database, Events, Function, BITool, Warehouse, Log, Hvr) (example: Marketing)</td>
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
    <td>The connector type identifier within the Fivetran system (example: google_ads)</td>
</tr>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><code>string</code></td>
    <td>The connector service name within the Fivetran system (example: Google Ads)</td>
</tr>
<tr>
    <td><CopyableCode code="connector_class" /></td>
    <td><code>string</code></td>
    <td> (standard, lite)</td>
</tr>
<tr>
    <td><CopyableCode code="description" /></td>
    <td><code>string</code></td>
    <td>The description characterizing the purpose of the connector (example: Google Ads is an online advertising platform)</td>
</tr>
<tr>
    <td><CopyableCode code="icon_url" /></td>
    <td><code>string</code></td>
    <td>The icon resource URL (example: https:​//fivetran.com/integrations/google_ads/resources/google-ads.png)</td>
</tr>
<tr>
    <td><CopyableCode code="icons" /></td>
    <td><code>array</code></td>
    <td>The set of additional icon resource URLs in different formats (.svg, .png). Updating this list is not a breaking change. The set of icon URLs or the icons themselves may be changed</td>
</tr>
<tr>
    <td><CopyableCode code="link_to_docs" /></td>
    <td><code>string</code></td>
    <td>The link to the connector documentation (example: https:​//fivetran.com/docs/connectors/applications/google-ads)</td>
</tr>
<tr>
    <td><CopyableCode code="link_to_erd" /></td>
    <td><code>string</code></td>
    <td>The link to the connector ERD (entity–relationship diagram) (example: https:​//docs.google.com/presentation/d/1f16zOPxwT1AXoOcNkvwT82ApKqU1yhtJ04f-73M91nw/embed)</td>
</tr>
<tr>
    <td><CopyableCode code="service_status" /></td>
    <td><code>string</code></td>
    <td>The current availability status of the connector (general_availability, beta, private_preview, sunset, development) (example: general_availability)</td>
</tr>
<tr>
    <td><CopyableCode code="service_status_updated_at" /></td>
    <td><code>string (date-time)</code></td>
    <td>The date (yyyy-MM-dd) the connector status was updated to the current availability status</td>
</tr>
<tr>
    <td><CopyableCode code="supported_features" /></td>
    <td><code>array</code></td>
    <td></td>
</tr>
<tr>
    <td><CopyableCode code="type" /></td>
    <td><code>string</code></td>
    <td>The connector service type (API, Dbt, Marketing, HumanResources, Finance, Productivity, Engineering, Support, Sales, Security, SuperConnectorTest, Free, File, Database, Events, Function, BITool, Warehouse, Log, Hvr) (example: Marketing)</td>
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
    <td><a href="#parameter-service"><code>service</code></a></td>
    <td></td>
    <td>Returns metadata of configuration parameters and authorization parameters for a specified connector type.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-cursor"><code>cursor</code></a>, <a href="#parameter-limit"><code>limit</code></a></td>
    <td>Returns all available source types within your Fivetran account. This endpoint makes it easier to display Fivetran connectors within your application because it provides metadata including the proper source name ('Facebook Ads' instead of 'facebook_ads'), the source icon, information about the Hybrid deployment support, and links to Fivetran resources. As we update source names and icons, that metadata will automatically update within this endpoint</td>
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
<tr id="parameter-service">
    <td><CopyableCode code="service" /></td>
    <td><code>string</code></td>
    <td>&#91;The connector type&#93;(https:​//fivetran.com/docs/rest-api/getting-started#commonterms) identifier within the Fivetran system</td>
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

Returns metadata of configuration parameters and authorization parameters for a specified connector type.

```sql
SELECT
id,
name,
auth,
config,
connector_class,
description,
external_secrets_keys_config,
icon_url,
icons,
link_to_docs,
link_to_erd,
service_status,
service_status_updated_at,
supported_features,
type
FROM fivetran.metadata.connector_types
WHERE service = '{{ service }}' -- required
;
```
</TabItem>
<TabItem value="list">

Returns all available source types within your Fivetran account. This endpoint makes it easier to display Fivetran connectors within your application because it provides metadata including the proper source name ('Facebook Ads' instead of 'facebook_ads'), the source icon, information about the Hybrid deployment support, and links to Fivetran resources. As we update source names and icons, that metadata will automatically update within this endpoint

```sql
SELECT
id,
name,
connector_class,
description,
icon_url,
icons,
link_to_docs,
link_to_erd,
service_status,
service_status_updated_at,
supported_features,
type
FROM fivetran.metadata.connector_types
WHERE "limit" = '{{ limit }}'
;
```
</TabItem>
</Tabs>
