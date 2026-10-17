---
title: Quota Provider
feature_ids:
  - plugin.quota-provider.identifier
  - plugin.quota-provider.describe-quota
  - plugin.quota-provider.fetch-quota
  - plugin.quota-provider.reset-quota
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Quota Provider

`QuotaProvider` supplies credential quota, balance, and billing information to the management side.

## 1. What this solves

The plugin declares which providers it supports and whether reset is possible, then returns a normalized quota for one credential, or performs a reset when that is supported.

## 2. Scope and non-goals

It does not log in or refresh. That is [Credential Provider](/plugin/auth-provider). A usage stream is not a quota snapshot. See [Usage Observer](/plugin/usage-plugin).

When `SupportsReset` from `DescribeQuota` is false, the caller should not rely on `ResetQuota` to change the quota.

## 3. How to configure or call it

Set `capabilities.quota_provider` to true.

```go
Identifier() string
DescribeQuota(context.Context, QuotaDescribeRequest) (QuotaDescribeResponse, error)
FetchQuota(context.Context, QuotaFetchRequest) (QuotaFetchResponse, error)
ResetQuota(context.Context, QuotaResetRequest) (QuotaResetResponse, error)
```

The ABI method names are `quota.identifier`, `quota.describe`, `quota.fetch`, and `quota.reset`. The identifier result field is `identifier`.

Fields on the request side that have a `json` tag use snake names. Tags on the response side are mainly camel case. Deserialization also accepts the snake names written below.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.quota-provider.identifier | `Identifier`, ABI `quota.identifier`. |  | Returns the provider key handled by this provider. Failure or blank is treated as an empty string. |
| plugin.quota-provider.describe-quota | `DescribeQuota`, ABI `quota.describe`. |  | Parameter `QuotaDescribeRequest`. |
| plugin.quota-provider.fetch-quota | `FetchQuota`, ABI `quota.fetch`. |  | Parameter `QuotaFetchRequest`. |
| plugin.quota-provider.reset-quota | `ResetQuota`, ABI `quota.reset`. |  | Parameter `QuotaResetRequest`. |
| QuotaDescribeRequest.Plugin | Plugin metadata. |  | JSON name `plugin`. |
| QuotaDescribeResponse.SupportedProviders | Supported provider keys. |  | JSON name `supported_providers`. |
| QuotaDescribeResponse.DisplayName | Display name. |  | JSON name `display_name`. |
| QuotaDescribeResponse.SupportsReset | Whether reset is supported. |  | JSON name `supports_reset`. |
| QuotaFetchRequest.AuthIndex | Credential index. |  | JSON name `auth_index`. The reset request uses the same name. |
| QuotaFetchRequest.AuthID | Credential ID. |  | JSON name `auth_id`. |
| QuotaFetchRequest.Provider | Credential provider. |  | JSON name `provider`. |
| QuotaFetchRequest.StorageJSON | Plugin persisted data. |  | JSON name `storage_json`, base64. |
| QuotaFetchRequest.Metadata | Host-mutable metadata. |  | JSON name `metadata`. |
| QuotaFetchRequest.Attributes | Immutable attributes. |  | JSON name `attributes`. |
| QuotaFetchRequest.Host | Host configuration summary. |  | JSON name `host`. |
| QuotaFetchRequest.HTTPClient | Host HTTP client. |  | Ignored by JSON. |
| QuotaFetchResponse.Subscription | Plan information. |  | The JSON name of `Plan` is `plan`. `TierName` accepts `tierName` or `tier_name`. `TierID` accepts `tierId` or `tier_id`. |
| QuotaFetchResponse.Summary | Numeric account summary. |  | JSON name `summary`. Elements are `QuotaMetric`. |
| QuotaFetchResponse.ServerTimeOffsetMs | Server time offset in milliseconds. |  | Accepts `serverTimeOffsetMs` or `server_time_offset_ms`. |
| QuotaFetchResponse.Groups | Quota groups. |  | JSON name `groups`. |
| QuotaGroup.DisplayName | Group name. |  | `displayName` or `display_name`. |
| QuotaGroup.Buckets | Windows inside the group. |  | JSON name `buckets`. |
| QuotaBucket.Window | Window name. |  | JSON name `window`. |
| QuotaBucket.RemainingFraction | Remaining fraction. |  | `remainingFraction` or `remaining_fraction`. |
| QuotaBucket.ResetTime | Reset time text. |  | `resetTime` or `reset_time`. |
| QuotaBucket.Description | Description. |  | JSON name `description`. |
| QuotaMetric.Key | Metric key. |  | JSON name `key`. |
| QuotaMetric.Label | Display label. |  | JSON name `label`. |
| QuotaMetric.Value | Numeric value. |  | JSON name `value`, `float64`. |
| QuotaMetric.Unit | Unit. |  | JSON name `unit`. |
| QuotaMetric.Format | Display format. |  | `number` or `currency`. |
| QuotaMetric.Currency | Currency code. |  | ISO 4217 when `Format` is `currency`. |
| QuotaResetRequest | Credential context at reset time. |  | The fields are the same as `QuotaFetchRequest`, including `HTTPClient`, which JSON ignores. |
| QuotaResetResponse.Success | Whether the reset succeeded. |  | JSON name `success`. |
| QuotaResetResponse.Message | Result description. |  | JSON name `message`. |

## 5. Common errors and limits

When any of the three methods that return `error` fails, ABI `ok` is false. When `http_status` is omitted or 0, it is treated as HTTP 500.

`QuotaResetResponse.Success` set to false is a business result. It is different from the method returning an error. When camel case and snake case appear together, an existing camel-case value wins. The snake name fills in only when the camel-case value is empty. `RemainingFraction` uses `remainingFraction` if it appears first, and otherwise uses `remaining_fraction`.

## 6. Related behavior

Credential material is in [Credential Provider](/plugin/auth-provider). Token counts after a request completes are in [Usage Observer](/plugin/usage-plugin).

## 7. Field experience

None yet.

