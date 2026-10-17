---
title: 日志与用量
feature_ids:
  - observability.logs.debug
  - observability.logs.error-logs-max-files
  - observability.logs.logging-to-file
  - observability.logs.logs-max-total-size-mb
  - observability.logs.request-log
  - observability.pprof.addr
  - observability.pprof.enable
  - observability.usage.redis-usage-queue-retention-seconds
  - observability.usage.usage-statistics-enabled
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 日志与用量

## 1. 这段解决什么问题

决定应用日志写到标准输出还是滚动文件、是否记录代理请求、错误日志和日志目录如何清理、是否在内存中汇总用量，以及是否单独打开 pprof 调试端口。

## 2. 适用条件与不做的事

这些键属于 `observability`。管理 API 读取日志和用量队列的路由见 [管理端日志与用量](/cn/management/v8-observability)。`commercial-mode` 会关掉高开销请求日志，见 [监听与进程](/cn/operations/server)。这里不配置访问密钥。

## 3. 怎么配置或怎么调用

```yaml
observability:
  logs:
    debug: false
    logging-to-file: false
    logs-max-total-size-mb: 0
    error-logs-max-files: 10
    request-log: false
  usage:
    usage-statistics-enabled: false
    redis-usage-queue-retention-seconds: 60
  pprof:
    enable: false
    addr: "127.0.0.1:8316"
```

示例把 pprof 放在本机 `127.0.0.1:8316`。不要把它暴露到公网地址。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| observability.logs.debug | 打开或关闭调试级别日志及其他调试功能。 | false | 加载后按该值设置日志级别。 |
| observability.logs.error-logs-max-files | 请求日志关闭时保留的错误日志文件数量。 | Default is 10. | 超出后删除最旧的错误日志。0 关闭清理。负数在加载时改回 10。 |
| observability.logs.logging-to-file | 应用日志写入滚动文件还是标准输出。 | false | true 写滚动文件。管理端读取应用日志要求它为 true。 |
| observability.logs.logs-max-total-size-mb | 日志目录下日志文件的总大小上限，单位 MB。 | 0 | 超出后删除最旧的日志直到回到上限。0 关闭该清理。负数在加载时改为 0。 |
| observability.logs.request-log | 是否记录详细的代理请求日志。 | false | 管理请求不记入该日志。`commercial-mode` 为 true 时请求日志中间件不挂上。 |
| observability.pprof.addr | pprof HTTP 服务器的 host:port。 | empty string | 空值在加载和运行时使用 `127.0.0.1:8316`。 |
| observability.pprof.enable | 是否启动 pprof HTTP 调试服务器。 | false | false 时不监听。改为 true 或更换地址会重启该调试服务器。 |
| observability.usage.redis-usage-queue-retention-seconds | 用量队列条目在内存中为管理 API 保留的秒数。 | Default: 60. | 最大 3600。小于等于 0 时加载为 60。大于 3600 时夹紧到 3600 并写警告。Redis RESP 用量输出仅在 Home 模式禁用。 |
| observability.usage.usage-statistics-enabled | 是否在内存中汇总用量。 | false | false 时丢弃用量数据。Home 模式会把它强制设为 true。 |

## 5. 常见错误与边界

`logging-to-file` 为 false 时，管理端 `GET /v8/management/observability/logs` 返回 400，错误为 `logging to file disabled`。`request-log` 为 true 时，错误日志列表接口返回空的 `files`。pprof 地址留空不会保持空字符串，进程会改听 `127.0.0.1:8316`。保留秒数超出 3600 不会拒绝启动，只会夹紧。

## 6. 相关功能

读取队列和日志文件见 [管理端日志与用量](/cn/management/v8-observability)。商业模式见 [监听与进程](/cn/operations/server)。

## 7. 使用经验

- [非 Claude 上游在消息末尾才给用量](/cn/experience/api#exp-api-messages-usage-at-end)
- [调用公开路由时带上客户端密钥](/cn/experience/api#exp-api-require-client-key)
- [auth_unavailable 表示没有可用凭证](/cn/experience/operations#exp-operations-auth-unavailable-means-no-credential)
- [限制请求日志总大小](/cn/experience/operations#exp-operations-cap-request-logs)
- [关掉请求日志止住刷屏](/cn/experience/operations#exp-operations-disable-request-log)
- [客户端断开后没有最终用量](/cn/experience/operations#exp-operations-disconnect-drops-usage)
- [日志写在可写的 logs 目录](/cn/experience/operations#exp-operations-log-directory)
- [关掉高开销日志降低内存](/cn/experience/operations#exp-operations-reduce-memory)
- [用请求日志查看文本原文](/cn/experience/operations#exp-operations-request-log-text)
- [用量只留在内存里](/cn/experience/operations#exp-operations-usage-stays-in-memory)
