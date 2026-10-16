---
title: 首字节前重试
feature_ids:
  - requests.streaming.bootstrap-retries
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 首字节前重试

## 1. 这段解决什么问题

流式响应在任何字节写给客户端之前失败时，代理还可以换凭证或度过临时错误。本键限制这种安全重试的次数。

## 2. 适用条件与不做的事

它只发生在首字节发出之前。已经向客户端写出字节之后，不再用本键重试。它也不是 `routing.retry.request-retry` 的凭证轮次。

## 3. 怎么配置或怎么调用

```yaml
requests:
  streaming:
    bootstrap-retries: 0
```

示例配置在启用时写成 1。未写时的零值是表中的 defaults。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| requests.streaming.bootstrap-retries | 首字节发送前允许的流式重试次数。 | Default is 0. | 小于或等于 0 时关闭。负数按 0。用来在写出字节前做凭证轮换或临时错误恢复。 |

## 5. 常见错误与边界

0 或负数不会被拒绝，也不会变成一次重试。首字节已经发送后，本次数不再使用。

## 6. 相关功能

凭证轮次见 [路由策略](/cn/routing/strategy)。保活间隔见 [流式保活](/cn/routing/requests-keepalive)。

## 7. 使用经验

暂无
