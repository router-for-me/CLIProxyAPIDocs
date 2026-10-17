---
title: 按密钥代理
feature_ids:
  - api-keys.claude.proxy-url
  - api-keys.codex.proxy-url
  - api-keys.gemini.proxy-url
  - api-keys.interactions.proxy-url
  - api-keys.meta.proxy-url
  - api-keys.vertex.proxy-url
  - api-keys.xai.proxy-url
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 按密钥代理

## 1. 这段解决什么问题

让某一上游组或某一把密钥使用自己的代理，而不是全局代理。

## 2. 适用条件与不做的事

OpenAI 兼容提供商的代理在 keys 条目上，见权重页旁边的 api-key-entries。本页是其他提供商的 proxy-url。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  gemini:
    - name: gemini-1
      proxy-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
          proxy-url: "https://example.invalid"
```

v8 模板还允许空值回落全局 `requests.proxy-url`，并用 `direct` 表示直连。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.proxy-url | 这一条密钥或提供商使用的代理地址。 | empty string | 空值回落到 requests.proxy-url。v8 模板把 direct 写成绕过代理。OpenAI 兼容提供商的代理写在 keys 条目上，其他提供商可写在组上并由单把密钥覆盖。 |
| api-keys.codex.proxy-url | 这一条密钥或提供商使用的代理地址。 | empty string | 空值回落到 requests.proxy-url。v8 模板把 direct 写成绕过代理。OpenAI 兼容提供商的代理写在 keys 条目上，其他提供商可写在组上并由单把密钥覆盖。 |
| api-keys.gemini.proxy-url | 这一条密钥或提供商使用的代理地址。 | empty string | 空值回落到 requests.proxy-url。v8 模板把 direct 写成绕过代理。OpenAI 兼容提供商的代理写在 keys 条目上，其他提供商可写在组上并由单把密钥覆盖。 |
| api-keys.interactions.proxy-url | 这一条密钥或提供商使用的代理地址。 | empty string | 空值回落到 requests.proxy-url。v8 模板把 direct 写成绕过代理。OpenAI 兼容提供商的代理写在 keys 条目上，其他提供商可写在组上并由单把密钥覆盖。 |
| api-keys.meta.proxy-url | 这一条密钥或提供商使用的代理地址。 | empty string | 空值回落到 requests.proxy-url。v8 模板把 direct 写成绕过代理。OpenAI 兼容提供商的代理写在 keys 条目上，其他提供商可写在组上并由单把密钥覆盖。 |
| api-keys.vertex.proxy-url | 这一条密钥或提供商使用的代理地址。 | empty string | 空值回落到 requests.proxy-url。v8 模板把 direct 写成绕过代理。OpenAI 兼容提供商的代理写在 keys 条目上，其他提供商可写在组上并由单把密钥覆盖。 |
| api-keys.xai.proxy-url | 这一条密钥或提供商使用的代理地址。 | empty string | 空值回落到 requests.proxy-url。v8 模板把 direct 写成绕过代理。OpenAI 兼容提供商的代理写在 keys 条目上，其他提供商可写在组上并由单把密钥覆盖。 |

## 5. 常见错误与边界

本页这些键没有单独的 URL 语法拒绝语句。空字符串按回落处理。

## 6. 相关功能

OpenAI 兼容条目的代理和权重一起登记在 [凭证权重](/cn/accounts/api-keys-weight) 与 [上游 API 密钥](/cn/accounts/api-keys-api)。

## 7. 使用经验

- [为单个凭证指定代理](/cn/experience/routing#exp-routing-per-credential-proxy)
