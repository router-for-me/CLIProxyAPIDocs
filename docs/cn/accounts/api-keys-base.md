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

- [基址不要在版本段后再加斜杠](/cn/experience/accounts#exp-accounts-base-url-no-extra-slash)
- [Claude 基址不要重复 /v1](/cn/experience/accounts#exp-accounts-claude-base-url-host-only)
- [responses 上游写到 Codex API key](/cn/experience/accounts#exp-accounts-codex-api-key-base-url)
- [兼容提供商要同时有基址和别名](/cn/experience/accounts#exp-accounts-compat-base-and-alias)
- [自定义 Gemini 地址有两种写法](/cn/experience/accounts#exp-accounts-gemini-custom-base-url)
- [Kimi 兼容调用需要 User-Agent](/cn/experience/accounts#exp-accounts-kimi-user-agent)
- [OpenAI 兼容基址带上版本段](/cn/experience/accounts#exp-accounts-openai-base-url-v1)
- [用 OpenAI 兼容段接入第三方](/cn/experience/accounts#exp-accounts-openai-compatible-provider)
- [轮换被上游判定违规的 Vertex 凭证](/cn/experience/accounts#exp-accounts-rotate-vertex-key)
- [xAI 403 时改用 API key](/cn/experience/accounts#exp-accounts-xai-api-key-fallback)
- [Codex 客户端调用 responses 路由](/cn/experience/api#exp-api-call-responses)
- [兼容凭证固定调用聊天补全](/cn/experience/api#exp-api-compat-always-chat)
- [DeepSeek 需要客户端降低 max token](/cn/experience/api#exp-api-deepseek-max-tokens)
- [第三方 DeepSeek 不会填 OpenAI 思考字段](/cn/experience/api#exp-api-deepseek-no-openai-thinking)
- [图像调用记在基础聊天模型上](/cn/experience/api#exp-api-image-base-model)
- [非 Claude 上游在消息末尾才给用量](/cn/experience/api#exp-api-messages-usage-at-end)
- [用载荷过滤去掉上游拒绝的字段](/cn/experience/routing#exp-routing-filter-rejected-fields)
- [保活标记不是 JSON 响应](/cn/experience/routing#exp-routing-keepalive-is-not-json)
- [用覆盖规则增加 extra_body](/cn/experience/routing#exp-routing-override-extra-body)
- [载荷覆盖在思考后缀之后仍生效](/cn/experience/routing#exp-routing-override-is-final)
