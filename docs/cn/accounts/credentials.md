---
title: 凭证并发与在途观测
feature_ids:
  - credentials.concurrency.busy-retry-max
  - credentials.concurrency.busy-retry-min
  - credentials.concurrency.cleanup-interval
  - credentials.concurrency.cpa-cancel-bound
  - credentials.concurrency.cpa-heartbeat-timeout
  - credentials.concurrency.lifecycle-config-revision
  - credentials.concurrency.max-limit
  - credentials.concurrency.observation-barrier-revision
  - credentials.concurrency.reclaim-grace
  - credentials.concurrency.release-flush-interval
  - credentials.concurrency.release-max-backoff
  - credentials.in-flight.max-aggregate-groups
  - credentials.in-flight.max-details
  - credentials.in-flight.max-part-bytes
  - credentials.in-flight.max-part-count
  - credentials.in-flight.max-revision-bytes
  - credentials.in-flight.max-string-bytes
  - credentials.in-flight.snapshot-interval
  - credentials.in-flight.staging-retention
  - credentials.in-flight.stale-after
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 凭证并发与在途观测

## 1. 这段解决什么问题

这里说明 Home 使用的凭证并发租约，以及在途观测快照的上限。

## 2. 适用条件与不做的事

这些键给 Home 的凭证生命周期使用。它们不选择模型，也不保存 OAuth 令牌。v8 路径是 `credentials.concurrency` 和 `credentials.in-flight`；旧路径是 `credential-concurrency` 和 `credential-in-flight`。

## 3. 怎么配置或怎么调用

```yaml
credentials:
  concurrency:
    lifecycle-config-revision: 1
    observation-barrier-revision: 0
    cpa-heartbeat-timeout: 3s
    cpa-cancel-bound: 5s
    reclaim-grace: 5s
    cleanup-interval: 5s
    release-flush-interval: 250ms
    release-max-backoff: 2s
    busy-retry-min: 250ms
    busy-retry-max: 1s
    max-limit: 1000000
  in-flight:
    snapshot-interval: 2s
    stale-after: 10s
    max-part-bytes: 262144
    max-part-count: 64
    max-revision-bytes: 16777216
    max-aggregate-groups: 100000
    max-details: 10000
    max-string-bytes: 256
    staging-retention: 1m
```

上面的并发时间是字段缺省时 `WithDefaults` 填入的值。在途字段由载入器在解析 YAML 之前填入。表中的「默认值」仍是台账里的零值原文。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| credentials.concurrency.busy-retry-max | 凭证正忙时重试等待的上限。 | 0s | 缺省的 0 变成 1s。必须是正的整毫秒，且不能小于 busy-retry-min。 |
| credentials.concurrency.busy-retry-min | 凭证正忙时重试等待的下限。 | 0s | 缺省的 0 变成 250ms。必须是正的整毫秒，且不能大于 busy-retry-max。 |
| credentials.concurrency.cleanup-interval | 并发租约清理间隔。 | 0s | 缺省的 0 变成 5s。必须为正。 |
| credentials.concurrency.cpa-cancel-bound | 取消 CPA 侧并发租约的时限。 | 0s | 缺省的 0 变成 5s。节点心跳加 reclaim-grace 必须大于它加上 cpa-heartbeat-timeout。 |
| credentials.concurrency.cpa-heartbeat-timeout | CPA 并发心跳超时。 | 0s | 缺省的 0 变成 3s。必须为正。 |
| credentials.concurrency.lifecycle-config-revision | Home 生命周期配置修订号。 | 0 | 缺省可以是 0。一旦写出，0 或负数都会使载入失败。 |
| credentials.concurrency.max-limit | 并发租约数量上限。 | 0 | 缺省的 0 变成 1000000。允许范围是 1 到 1000000。 |
| credentials.concurrency.observation-barrier-revision | 观测屏障修订号。 | 0 | 不能为负。缺省保持 0。 |
| credentials.concurrency.reclaim-grace | 回收租约前的宽限。 | 0s | 缺省的 0 变成 5s。必须为正。 |
| credentials.concurrency.release-flush-interval | 释放刷新间隔。 | 0s | 缺省的 0 变成 250ms。必须为正，且不能大于 release-max-backoff。 |
| credentials.concurrency.release-max-backoff | 释放刷新的最大退避。 | 0s | 缺省的 0 变成 2s。必须为正，且不能小于 release-flush-interval。 |
| credentials.in-flight.max-aggregate-groups | 在途观测保留的聚合组上限。 | 0 | 缺省时载入器填 100000。允许 1 到 100000。 |
| credentials.in-flight.max-details | 在途观测保留的明细上限。 | 0 | 缺省时载入器填 10000。允许 0 到 10000。 |
| credentials.in-flight.max-part-bytes | 单个快照分片的字节上限。 | 0 | 缺省时载入器填 262144。不能小于 1024。 |
| credentials.in-flight.max-part-count | 一次修订允许的分片数。 | 0 | 缺省时载入器填 64。允许 1 到 64。 |
| credentials.in-flight.max-revision-bytes | 一次修订的字节上限。 | 0 | 缺省时载入器填 16777216。必须落在 max-part-bytes 到 16777216 之间，并能被分片数装下。 |
| credentials.in-flight.max-string-bytes | 一条观测字符串保留的字节上限。 | 0 | 缺省时载入器填 256。允许 1 到 256。 |
| credentials.in-flight.snapshot-interval | 在途快照间隔。 | empty string | 缺省时载入器填 2s。必须是正的时长，stale-after 至少是它的三倍。 |
| credentials.in-flight.staging-retention | 暂存观测数据的保留时间。 | empty string | 缺省时载入器填 1m。必须是正的时长。 |
| credentials.in-flight.stale-after | 快照视为过期的年龄。 | empty string | 缺省时载入器填 10s。必须至少为三个快照间隔。 |

## 5. 常见错误与边界

并发配置不满足正数时长、毫秒对齐、退避顺序或 `max-limit` 范围时，配置载入失败。`lifecycle-config-revision` 一旦出现就不能为 0 或负数。在途时长无法解析、`stale-after` 不足三个快照间隔，或分片容量装不下修订大小时，同样失败。节点心跳加 reclaim-grace 必须大于 CPA 心跳加 cancel bound，否则生命周期校验失败。

## 6. 相关功能

凭证文件目录见 [OAuth 目录、别名与排除](/cn/accounts/oauth)。

## 7. 使用经验

暂无
