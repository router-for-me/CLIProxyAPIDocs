---
title: 首个 token 前保活
feature_ids:
  - requests.streaming.send-keepalive-before-ft
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 首个 token 前保活

## 1. 这段解决什么问题

有的客户端在首个 token 到来之前就会因为空闲而断开。本开关允许在那段时间发送 SSE 心跳。

## 2. 适用条件与不做的事

它只控制首个 token 之前。间隔仍由 `keepalive-seconds` 决定。本键为 true 但间隔不是正数时，不会发送。它不改变 WebSocket Ping 的间隔配置本身。

## 3. 怎么配置或怎么调用

```yaml
requests:
  streaming:
    keepalive-seconds: 0
    send-keepalive-before-ft: false
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| requests.streaming.send-keepalive-before-ft | 在首个 token 之前是否发送 SSE 心跳。 | Default is false. | 只有本键为 true 且 keepalive-seconds 大于 0 时才发送。单独为 true 不会打开保活。 |

## 5. 常见错误与边界

false 不是错误。true 配合 0 或负数的 `keepalive-seconds` 也不会发送心跳，配置本身不被拒绝。

## 6. 相关功能

间隔见 [流式保活](/cn/routing/requests-keepalive)。

## 7. 使用经验

暂无
