---
title: Responses WebSocket 传输
feature_ids:
  - api-keys.codex.websockets
  - api-keys.meta.websockets
  - api-keys.xai.websockets
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Responses WebSocket 传输

## 1. 这段解决什么问题

让 Codex、xAI 或 Meta 的某一把 API 密钥使用 Responses WebSocket 传输。

## 2. 适用条件与不做的事

这是密钥开关。Codex 全双工 response-steering 是提供商选项，不在本页。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  codex:
    - name: codex-1
      keys:
        - api-key: "YOUR_API_KEY"
          websockets: false
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.codex.websockets | 是否对这把密钥使用 Responses WebSocket 传输。 | false | false 时不启用该密钥的 Responses WebSocket 传输。 |
| api-keys.meta.websockets | 是否对这把密钥使用 Responses WebSocket 传输。 | false | false 时不启用该密钥的 Responses WebSocket 传输。 |
| api-keys.xai.websockets | 是否对这把密钥使用 Responses WebSocket 传输。 | false | false 时不启用该密钥的 Responses WebSocket 传输。 |

## 5. 常见错误与边界

false 保持不启用。它不会打开媒体中继。

## 6. 相关功能

提供商级 WebSocket 行为见 [Codex 提供商选项](/cn/configuration/provider/codex)。

## 7. 使用经验

- [Codex goal 模式要同时设置三项](/cn/experience/accounts#exp-accounts-codex-goal-mode)
- [Codex 可用客户端或代理的 WebSocket](/cn/experience/accounts#exp-accounts-codex-websocket-or-http)
