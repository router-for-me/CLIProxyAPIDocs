---
title: AI Studio WebSocket 认证
feature_ids:
  - oauth.providers.aistudio-ws-auth
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# AI Studio WebSocket 认证

## 1. 这段解决什么问题

决定 WebSocket API 是否要求认证。

## 2. 适用条件与不做的事

本页不再介绍第三方 AI Studio 应用。只保留钉住代码里的 ws-auth。

## 3. 怎么配置或怎么调用

```yaml
oauth:
  providers:
    aistudio:
      ws-auth: true
```

旧文件仍可写根上的 `ws-auth`。示例把这个开关对应到 `/v1/ws`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| oauth.providers.aistudio.ws-auth | oauth.providers.aistudio.ws-auth | false | oauth.providers.aistudio.ws-auth |

## 5. 常见错误与边界

载入器在解析 YAML 前把该值设为 true，所以省略等于开启认证。只有显式 false 才关闭。表中的默认值原文仍是台账里的 false，那是字段零值，不是载入结果。

## 6. 相关功能

登录和别名见 [OAuth 目录、别名与排除](/cn/accounts/oauth)。

## 7. 使用经验

暂无
