---
title: 上游基础地址
feature_ids:
  - api-keys.claude.base-url
  - api-keys.codex.base-url
  - api-keys.gemini.base-url
  - api-keys.interactions.base-url
  - api-keys.meta.base-url
  - api-keys.openai-compatibility.base-url
  - api-keys.vertex.base-url
  - api-keys.xai.base-url
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 上游基础地址

## 1. 这段解决什么问题

这里说明每个上游组的 base-url。它属于组，不属于组里的单把密钥。

## 2. 适用条件与不做的事

不发明官方地址以外的端点。Codex 和 xAI 的 API 密钥不能靠省略 base-url 改走官方端点：载入时会丢掉地址为空的条目。其余提供商的空值见细项。OpenAI 兼容提供商也没有内置官方地址。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  gemini:
    - name: gemini-1
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
  vertex:
    - name: vertex-1
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.base-url | 该组或该提供商的上游基础地址。 | If empty, the default Claude API URL will be used. | 空值使用 https://api.anthropic.com。地址属于组，写进单把密钥会使载入失败。 |
| api-keys.codex.base-url | 该组或该提供商的上游基础地址。 | If empty, the default Codex API URL will be used. | 去掉首尾空白后若仍为空，SanitizeCodexKeys 会丢弃该条目。执行器里的官方地址不会套用到已删除的配置。地址属于组，不能写在单把密钥上。 |
| api-keys.gemini.base-url | 该组或该提供商的上游基础地址。 | empty string | 空值使用 https://generativelanguage.googleapis.com。 |
| api-keys.interactions.base-url | 该组或该提供商的上游基础地址。 | empty string | 空值使用 https://generativelanguage.googleapis.com。这些密钥只用于直接的 /v1beta/interactions。 |
| api-keys.meta.base-url | 该组或该提供商的上游基础地址。 | If empty, the default Codex API URL will be used. | 空值使用 https://api.meta.ai/v1。地址属于组。 |
| api-keys.openai-compatibility.base-url | 该组或该提供商的上游基础地址。 | empty string | 整理时会去掉基础地址为空的条目，使它不参与路由。 |
| api-keys.vertex.base-url | 该组或该提供商的上游基础地址。 | empty string | 省略时走 Google Vertex。值里已有 /publishers/ 时当作完整资源前缀，只再追加 /{model}:{action}。否则在缺少时插入 /v1，再追加 /publishers/google/models；已有的 /v1 或 /v1beta1 不会重复。 |
| api-keys.xai.base-url | 该组或该提供商的上游基础地址。 | If empty, the default Codex API URL will be used. | 去掉首尾空白后若仍为空，SanitizeXAIKeys 会丢弃该条目。执行器里的官方地址不会套用到已删除的配置。地址属于组，不能写在单把密钥上。 |

## 5. 常见错误与边界

非 OpenAI 兼容提供商如果把 base-url 写在 `keys` 条目里，载入失败。Codex 与 xAI 的条目在去掉首尾空白后如果 base-url 仍为空，载入时被整条丢弃，执行器里的官方地址不会再套用到这些已删除的配置。OpenAI 兼容提供商的空 base-url 也会在整理时被移除，不参与路由。Vertex 含 `/publishers/` 时被当作完整资源前缀。

## 6. 相关功能

密钥见 [上游 API 密钥](/cn/accounts/api-keys-api)。

## 7. 使用经验

暂无
