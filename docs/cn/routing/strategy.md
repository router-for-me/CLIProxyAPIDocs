---
title: 路由策略
feature_ids:
  - routing.force-model-prefix.value
  - routing.retry.max-retry-credentials
  - routing.retry.max-retry-interval
  - routing.retry.request-retry
  - routing.session-affinity-rebind-on.value
  - routing.session-affinity-subagents.value
  - routing.session-affinity-ttl.value
  - routing.session-affinity.value
  - routing.strategy.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 路由策略

## 1. 这段解决什么问题

这里决定多个匹配凭证时先用哪一个，是否把同一会话固定在同一凭证上，以及失败后还能再换几轮、每轮换几个、最多等多久。

## 2. 适用条件与不做的事

这些键属于 `routing`。它们不创建上游密钥，也不修改单把密钥上的 `weight`、`priority` 或 `request-retry`。已建立的会话绑定优先于凭证优先级；优先级仍决定冷绑定、没有会话的请求，以及故障转移后的重新绑定。`session-affinity` 为 false 时，子会话继承和重绑条件都不生效。

## 3. 怎么配置或怎么调用

```yaml
routing:
  strategy: "round-robin"
  session-affinity: false
  session-affinity-ttl: "1h"
  session-affinity-subagents: true
  session-affinity-rebind-on: "any"
  force-model-prefix: false
  retry:
    request-retry: 0
    max-retry-credentials: 0
    max-retry-interval: 0
```

示例配置文件把 `request-retry` 写成 3、把 `max-retry-interval` 写成 30。未写时的零值仍是表中的 defaults。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| routing.force-model-prefix | 无前缀模型名是否只能落到无前缀凭证。 | false | true 时，无前缀请求只使用没有前缀的凭证，除非前缀本身等于模型名。false 时，无前缀请求也可以使用带前缀的凭证。带前缀凭证仍暴露 prefix/model。 |
| routing.retry.max-retry-credentials | 每一轮最多尝试的不同凭证数。 | 0 | 0 或负数表示尝试该轮全部合格凭证；负数在载入和运行时被规范成 0。被上限跳过的凭证仍随全局轮次老化。 |
| routing.retry.max-retry-interval | 进入下一轮之前，为冷却等待的最长秒数。 | 0 | 非正数不允许正的冷却等待，但不关闭同一轮故障转移，也不关闭无需等待的后续轮次。 |
| routing.retry.request-retry | 第 0 轮之后还可以再进行的凭证轮数。 | 0 | 负数按 0。第 r 轮只接纳有效值至少为 r 的凭证。凭证或提供商上的显式非负数优先；省略或负数继承这里；显式 0 只进入第 0 轮。追加轮次适用于 HTTP 403、408、429、500、502、503、504 以及临时传输错误。 |
| routing.session-affinity-rebind-on | 哪些失败会把已绑定会话改绑到故障转移凭证。 | Supported values: - "any" (default): any credential-attributed failure unbinds and rebinds on failover. | 只有 quota 改变默认 any。408、5xx、空流和缓冲区上限在 quota 下只为该请求故障转移并保留原绑定；429、401、402、403、404 或模型不支持、invalid_grant 仍会重绑。其他值按 any。会话粘性关闭时忽略。 |
| routing.session-affinity-subagents | 带子会话引用的请求是否复用父凭证。 | Default: true. | 省略或空指针保持 true。false 时子会话走回退选择器。只作用于 Claude、Codex、Antigravity 和 Gemini。会话粘性关闭时忽略。 |
| routing.session-affinity-ttl | 会话到凭证绑定的保留时间。 | Default: 1h. | 运行时缺省为 1h。小于 1 秒的正时长提升到 1 秒。空值、无法解析或非正时长保持 1h。可写 30m、1h、2h30m。 |
| routing.session-affinity | 把会话固定到同一上游凭证。 | false | 优先使用 Claude Code、Codex、OpenCode 和 pi 的显式会话头，然后是 prompt_cache_key、Responses 对话 ID、旧请求体 ID、执行或派生会话标识，以及消息内容 hash。绑定凭证不可用时仍会故障转移。 |
| routing.strategy | 凭证选择策略。 | Supported values: "round-robin" (default), "weighted-round-robin", "fill-first". | round-robin、weighted-round-robin、fill-first。别名 roundrobin、rr、weightedroundrobin、wrr、fillfirst、ff 会规范化；其他值仍是 round-robin。加权使用凭证整数 weight，省略为 1，最大 1,000,000，非正数在该策略期间排除凭证。fill-first 按确定顺序取第一个可用凭证。 |

## 5. 常见错误与边界

无法识别的 `strategy` 不会报错，而是继续使用 round-robin。`session-affinity-ttl` 无法解析时不拒绝配置，绑定仍按 1 小时保留。`session-affinity-rebind-on` 不是 `quota` 时按 `any`，不返回配置错误。全局 `request-retry` 为负数时按 0，不拒绝启动。

## 6. 相关功能

冷却见 [冷却](/cn/routing/cooldown)。出站代理见 [出站请求](/cn/routing/requests-value)。凭证权重见 [凭证权重](/cn/accounts/api-keys-weight)。

## 7. 使用经验

暂无
