---
title: 额度提供方
feature_ids:
  - plugin.quota-provider.identifier
  - plugin.quota-provider.describe-quota
  - plugin.quota-provider.fetch-quota
  - plugin.quota-provider.reset-quota
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 额度提供方

`QuotaProvider` 向管理端提供凭证的额度、余额和账单信息。

## 1. 这段解决什么问题

插件声明自己支持哪些 provider、能否重置，再按一条凭证返回规范化额度，或在支持时执行重置。

## 2. 适用条件与不做的事

不负责登录和刷新，那是 [凭证提供方](/cn/plugin/auth-provider)。用量流水不是额度快照，见 [用量观察](/cn/plugin/usage-plugin)。

`DescribeQuota` 的 `SupportsReset` 为 false 时，调用方不应依赖 `ResetQuota` 改变额度。

## 3. 怎么配置或怎么调用

`capabilities.quota_provider` 设为 true。

```go
Identifier() string
DescribeQuota(context.Context, QuotaDescribeRequest) (QuotaDescribeResponse, error)
FetchQuota(context.Context, QuotaFetchRequest) (QuotaFetchResponse, error)
ResetQuota(context.Context, QuotaResetRequest) (QuotaResetResponse, error)
```

ABI 方法名是 `quota.identifier`、`quota.describe`、`quota.fetch`、`quota.reset`。标识结果字段是 `identifier`。

请求侧带 `json` 标签的字段使用蛇形名。响应侧标签以驼峰为主，反序列化同时接受下面写明的蛇形名。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.quota-provider.identifier | `Identifier`，ABI `quota.identifier`。 |  | 返回本提供方处理的 provider 键。失败或空白按空字符串处理。 |
| plugin.quota-provider.describe-quota | `DescribeQuota`，ABI `quota.describe`。 |  | 参数 `QuotaDescribeRequest`。 |
| plugin.quota-provider.fetch-quota | `FetchQuota`，ABI `quota.fetch`。 |  | 参数 `QuotaFetchRequest`。 |
| plugin.quota-provider.reset-quota | `ResetQuota`，ABI `quota.reset`。 |  | 参数 `QuotaResetRequest`。 |
| QuotaDescribeRequest.Plugin | 插件元数据。 |  | JSON 名 `plugin`。 |
| QuotaDescribeResponse.SupportedProviders | 支持的 provider 键。 |  | JSON 名 `supported_providers`。 |
| QuotaDescribeResponse.DisplayName | 展示名。 |  | JSON 名 `display_name`。 |
| QuotaDescribeResponse.SupportsReset | 是否支持重置。 |  | JSON 名 `supports_reset`。 |
| QuotaFetchRequest.AuthIndex | 凭证索引。 |  | JSON 名 `auth_index`。重置请求同名。 |
| QuotaFetchRequest.AuthID | 凭证 ID。 |  | JSON 名 `auth_id`。 |
| QuotaFetchRequest.Provider | 凭证 provider。 |  | JSON 名 `provider`。 |
| QuotaFetchRequest.StorageJSON | 插件持久化数据。 |  | JSON 名 `storage_json`，base64。 |
| QuotaFetchRequest.Metadata | 宿主可改元数据。 |  | JSON 名 `metadata`。 |
| QuotaFetchRequest.Attributes | 不可变属性。 |  | JSON 名 `attributes`。 |
| QuotaFetchRequest.Host | 宿主配置摘要。 |  | JSON 名 `host`。 |
| QuotaFetchRequest.HTTPClient | 宿主 HTTP 客户端。 |  | JSON 忽略。 |
| QuotaFetchResponse.Subscription | 套餐信息。 |  | `Plan` 的 JSON 名是 `plan`。`TierName` 接受 `tierName` 或 `tier_name`。`TierID` 接受 `tierId` 或 `tier_id`。 |
| QuotaFetchResponse.Summary | 账号数值摘要。 |  | JSON 名 `summary`。元素见 `QuotaMetric`。 |
| QuotaFetchResponse.ServerTimeOffsetMs | 服务器时间偏移毫秒。 |  | 接受 `serverTimeOffsetMs` 或 `server_time_offset_ms`。 |
| QuotaFetchResponse.Groups | 额度分组。 |  | JSON 名 `groups`。 |
| QuotaGroup.DisplayName | 分组名。 |  | `displayName` 或 `display_name`。 |
| QuotaGroup.Buckets | 分组内的窗口。 |  | JSON 名 `buckets`。 |
| QuotaBucket.Window | 窗口名。 |  | JSON 名 `window`。 |
| QuotaBucket.RemainingFraction | 剩余比例。 |  | `remainingFraction` 或 `remaining_fraction`。 |
| QuotaBucket.ResetTime | 重置时间文本。 |  | `resetTime` 或 `reset_time`。 |
| QuotaBucket.Description | 说明。 |  | JSON 名 `description`。 |
| QuotaMetric.Key | 指标键。 |  | JSON 名 `key`。 |
| QuotaMetric.Label | 展示标签。 |  | JSON 名 `label`。 |
| QuotaMetric.Value | 数值。 |  | JSON 名 `value`，`float64`。 |
| QuotaMetric.Unit | 单位。 |  | JSON 名 `unit`。 |
| QuotaMetric.Format | 展示格式。 |  | `number` 或 `currency`。 |
| QuotaMetric.Currency | 货币代码。 |  | `Format` 为 `currency` 时使用 ISO 4217。 |
| QuotaResetRequest | 重置时的凭证上下文。 |  | 字段与 `QuotaFetchRequest` 相同，含 JSON 忽略的 `HTTPClient`。 |
| QuotaResetResponse.Success | 重置是否成功。 |  | JSON 名 `success`。 |
| QuotaResetResponse.Message | 结果说明。 |  | JSON 名 `message`。 |

## 5. 常见错误与边界

三个带 `error` 的方法失败时，ABI `ok` 为 false。`http_status` 省略或为 0 时按 HTTP 500 处理。

`QuotaResetResponse.Success` 为 false 是业务结果，与方法返回错误不同。驼峰和蛇形名同时出现时，已有的驼峰值优先，蛇形名只在驼峰为空时补上。`RemainingFraction` 以先出现的 `remainingFraction` 为准，否则才用 `remaining_fraction`。

## 6. 相关功能

凭证材料见 [凭证提供方](/cn/plugin/auth-provider)。请求完成后的 token 计数见 [用量观察](/cn/plugin/usage-plugin)。

## 7. 使用经验

暂无
