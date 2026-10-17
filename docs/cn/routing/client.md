---
title: Codex 客户端目录
feature_ids:
  - client.codex.enable-apply-patch
  - client.codex.optimize-multi-agent-v2
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Codex 客户端目录

## 1. 这段解决什么问题

Codex 客户端拉取模型目录时，代理可以额外通告 freeform `apply_patch`，也可以改写官方 Codex 多代理 v2 请求。这两个开关同时作用于 OAuth 和 API 密钥路由。

## 2. 适用条件与不做的事

它们放在 `client.codex`，不是 `oauth.providers.codex`，也不放在单把 API 密钥上。`optimize-multi-agent-v2` 的旧提供商路径会迁移到这里；规范路径存在时胜出，显式 false 同样胜出。本页不改上游 Codex 伪装、WebSocket steering 或媒体中继。

## 3. 怎么配置或怎么调用

```yaml
client:
  codex:
    enable-apply-patch: false
    optimize-multi-agent-v2: false
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| client.codex.enable-apply-patch | 是否在 Codex 客户端目录中通告 freeform apply_patch。 | Default false clears the capability regardless of template metadata. | false 会清掉模板元数据里的该能力，只保留原生声明了 freeform apply_patch 的模型。true 时，每个路由执行器都支持的非模板和桥接模型也通告 freeform。 |
| client.codex.optimize-multi-agent-v2 | 是否优化官方 Codex 多代理 v2 请求。 | Default false leaves the client's multi-agent behavior unchanged. | false 不改变客户端的多代理行为。true 时刷新 spawn_agent 的模型细节，去掉消息参数加密，为 Codex 规范化加密的 agent_message，并把非 Codex 上游协议中的 agent_message 转成普通用户消息。只作用于 Codex Desktop、codex-tui 和 codex_cli_rs。 |

## 5. 常见错误与边界

两个键都是布尔值。false 是有效配置，不是省略。把 `optimize-multi-agent-v2` 只写在旧的提供商路径上时，若 `client.codex` 已给出值，旧路径不覆盖它。

## 6. 相关功能

凭证选择见 [路由策略](/cn/routing/strategy)。按模型改写最终 JSON 见 [默认载荷规则](/cn/routing/requests-default)、[覆盖载荷规则](/cn/routing/requests-override) 和 [过滤载荷规则](/cn/routing/requests-filter)。

## 7. 使用经验

- [打开多智能体兼容开关](/cn/experience/configuration#exp-configuration-optimize-multi-agent)
