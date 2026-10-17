---
title: 流式保活
feature_ids:
  - requests.streaming.keepalive-seconds
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 流式保活

## 1. 这段解决什么问题

流已经开始之后，代理可以按固定间隔发送保活，避免中间设备把空闲连接关掉。

## 2. 适用条件与不做的事

本键只决定间隔。它不决定首个 token 到达前是否发送，也不重试尚未写出字节的流。非流式空行保活是另一个键。

## 3. 怎么配置或怎么调用

```yaml
requests:
  streaming:
    keepalive-seconds: 0
```

示例配置把启用时的间隔写成 15。未写时的零值是表中的 defaults。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| requests.streaming.keepalive-seconds | SSE 心跳或 WebSocket Ping 的间隔秒数。 | Default is 0. | 小于或等于 0 时关闭。SSE 心跳正文是 `: keep-alive` 加一个空行。WebSocket 发送 Ping 控制帧。 |

## 5. 常见错误与边界

0 或负数不会被拒绝，只是不发送保活。只把本键设成正数，并不会在首个 token 之前发送心跳。

## 6. 相关功能

首个 token 之前见 [首个 token 前保活](/cn/routing/requests-send)。首字节之前的重试见 [首字节前重试](/cn/routing/requests-bootstrap)。非流式空行见 [出站请求](/cn/routing/requests-value)。

## 7. 使用经验

- [保活标记不是 JSON 响应](/cn/experience/routing#exp-routing-keepalive-is-not-json)
