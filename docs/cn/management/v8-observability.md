---
title: 管理端日志与用量
feature_ids:
  - management.v8.delete-observability-logs
  - management.v8.get-observability-logs
  - management.v8.get-observability-logs-errors
  - management.v8.get-observability-logs-errors-name
  - management.v8.get-observability-logs-requests-id
  - management.v8.get-observability-usage-api-keys
  - management.v8.get-observability-usage-queue
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 管理端日志与用量

## 1. 这段解决什么问题

在管理 API 中读取或清空应用日志、列出或下载错误请求日志、按请求 ID 取回请求日志，并取走内存中的用量队列和 API 密钥用量计数。

## 2. 适用条件与不做的事

这些路由都需要管理密钥。是否写文件、是否记录请求、用量保留多久，由 [日志与用量](/cn/operations/observability) 决定。这里不修改那些配置键；改配置用 [管理 API v8](/cn/management/apiv8)。

## 3. 怎么配置或怎么调用

基址使用 `https://example.invalid`，请求头使用 `Authorization: Bearer YOUR_API_KEY`。

| 方法与路径 | 作用 |
| --- | --- |
| GET /v8/management/observability/logs | 读取应用日志行。 |
| DELETE /v8/management/observability/logs | 删除滚动日志并截断当前日志。 |
| GET /v8/management/observability/logs/errors | 列出错误请求日志。 |
| GET /v8/management/observability/logs/errors/:name | 下载指定错误日志文件。 |
| GET /v8/management/observability/logs/requests/:id | 按请求 ID 下载匹配的请求日志。 |
| GET /v8/management/observability/usage/api-keys | 返回内存中各 API 密钥的成功、失败和近期请求计数。 |
| GET /v8/management/observability/usage/queue | 取出最旧的用量队列记录。 |

应用日志可用查询参数 `cursor`、`limit`、`after`。`limit` 省略表示不按条数截断；给出时必须是大于 0 的整数。`after` 不是正整数时按 0 处理，不单独报错。用量队列的 `count` 省略时为 1，给出时必须是正整数。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| DELETE /v8/management/observability/logs | 清空应用日志文件。 |  | `logging-to-file` 为 false 时 400 `logging to file disabled`。目录不存在时 404 `log directory not found`。成功正文含 `success: true` 和 `removed`。 |
| GET /v8/management/observability/logs | 读取应用日志。 |  | 同样要求 `logging-to-file` 为 true。非法 `limit` 返回 400 `invalid limit`。 |
| GET /v8/management/observability/logs/errors | 列出 `error-*.log`。 |  | `request-log` 为 true 时返回空的 `files`，而不是错误。目录不存在时也返回空列表。 |
| GET /v8/management/observability/logs/errors/:name | 下载一个错误日志。 |  | 名称必须形如 `error-` 开头、`.log` 结尾，且不能含斜杠。否则按未找到或 400 `invalid log file name` 处理。 |
| GET /v8/management/observability/logs/requests/:id | 按请求 ID 后缀匹配日志文件。 |  | 缺少 ID 时 400 `missing request ID`。含斜杠时 400 `invalid request ID`。没有匹配文件时 404。 |
| GET /v8/management/observability/usage/api-keys | 汇总 `api_key` 凭证的用量。 |  | 凭证管理器不可用时 503。键是提供商，其下再以 `base_url\|api_key` 聚合。 |
| GET /v8/management/observability/usage/queue | 弹出最旧的用量记录。 |  | `count` 不是正整数时 400 `count must be a positive integer`。响应是 JSON 数组。 |

## 5. 常见错误与边界

配置对象不可用时，日志路由返回 503 `configuration unavailable`。日志目录未配置时返回 500 `log directory not configured`。`DELETE` 只删除滚动日志并截断名为当前活动日志的文件，不会删除目录里其他无关文件。用量统计关闭时，队列里没有新数据可取。API 密钥用量只统计种类为 `api_key` 且密钥非空的凭证。

## 6. 相关功能

开关和保留时间见 [日志与用量](/cn/operations/observability)。

## 7. 使用经验

- [用量只留在内存里](/cn/experience/operations#exp-operations-usage-stays-in-memory)
