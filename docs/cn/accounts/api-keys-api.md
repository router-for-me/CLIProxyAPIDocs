---
title: 上游 API 密钥
feature_ids:
  - api-keys.claude.api-key
  - api-keys.codex.api-key
  - api-keys.gemini.api-key
  - api-keys.interactions.api-key
  - api-keys.meta.api-key
  - api-keys.openai-compatibility.api-key-entries-api-key
  - api-keys.openai-compatibility.api-key-entries-proxy-url
  - api-keys.openai-compatibility.api-key-entries-weight
  - api-keys.vertex.api-key
  - api-keys.xai.api-key
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 上游 API 密钥

## 1. 这段解决什么问题

这里说明各上游提供商用来调用模型的密钥，不是调用本代理的客户端密钥。

## 2. 适用条件与不做的事

v8 把除 OpenAI 兼容以外的提供商写成组：`name`、`base-url` 和 `keys`。密钥写在 `keys` 里。OpenAI 兼容提供商的密钥写在组的 `keys` 里，载入后对应 `api-key-entries`。客户端密钥仍是 `access.api-keys`。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  claude:
    - name: claude-1
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
  openai-compatibility:
    - name: openrouter
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.api-key | 访问该上游的密钥。 | empty string | 写在 v8 组的 keys 里。官方 Claude 密钥在 base-url 为空时走 https://api.anthropic.com。 |
| api-keys.codex.api-key | 访问该上游的密钥。 | empty string | 写在 v8 组的 keys 里。base-url 为空时走 https://chatgpt.com/backend-api/codex。 |
| api-keys.gemini.api-key | 访问该上游的密钥。 | empty string | 写在 v8 组的 keys 里。base-url 为空时走 https://generativelanguage.googleapis.com。 |
| api-keys.interactions.api-key | 访问该上游的密钥。 | empty string | 写在 v8 组的 keys 里。base-url 为空时走 https://generativelanguage.googleapis.com。 |
| api-keys.meta.api-key | 访问该上游的密钥。 | empty string | 写在 v8 组的 keys 里。空 base-url 使用 https://api.meta.ai/v1。 |
| api-keys.openai-compatibility.api-key-entries.api-key | api-keys.openai-compatibility.api-key-entries.api-key | empty string | 写在 openai-compatibility 组的 keys 里，载入后对应 api-key-entries.api-key。 |
| api-keys.openai-compatibility.api-key-entries.proxy-url | api-keys.openai-compatibility.api-key-entries.proxy-url | empty string | 空值回落到 requests.proxy-url。v8 模板把 direct 写成绕过代理。OpenAI 兼容提供商的代理写在 keys 条目上，其他提供商可写在组上并由单把密钥覆盖。 |
| api-keys.openai-compatibility.api-key-entries.weight | api-keys.openai-compatibility.api-key-entries.weight | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | 省略时按 1。小于等于 0 的整数不参与加权选择。非整数使配置载入失败，错误含 weight must be an integer。大于 1000000 失败，错误含 weight must not exceed 1000000。 |
| api-keys.vertex.api-key | 访问该上游的密钥。 | empty string | 作为 x-goog-api-key 发送。写在 v8 组的 keys 里。 |
| api-keys.xai.api-key | 访问该上游的密钥。 | empty string | 写在 v8 组的 keys 里。空 base-url 的 API 密钥使用 https://api.x.ai/v1。 |

## 5. 常见错误与边界

提供商值不是列表、组不是映射，或 `keys` 不是列表时，配置载入失败。除 OpenAI 兼容以外，把 `base-url` 写进单把密钥会失败，错误含 `base-url belongs to the group`。组上出现不支持的字段也会失败。

## 6. 相关功能

地址见 [上游基础地址](/cn/accounts/api-keys-base)。权重见 [凭证权重](/cn/accounts/api-keys-weight)。

## 7. 使用经验

暂无
