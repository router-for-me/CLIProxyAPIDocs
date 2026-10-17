---
title: 按密钥排除模型
feature_ids:
  - api-keys.claude.excluded-models
  - api-keys.codex.excluded-models
  - api-keys.gemini.excluded-models
  - api-keys.interactions.excluded-models
  - api-keys.meta.excluded-models
  - api-keys.vertex.excluded-models
  - api-keys.xai.excluded-models
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 按密钥排除模型

## 1. 这段解决什么问题

让某一上游组或某一把密钥不提供列出的模型。

## 2. 适用条件与不做的事

这是 API 密钥凭证上的排除。OAuth 文件凭证使用 oauth.excluded-models。OpenAI 兼容提供商没有单独的排除字段。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  gemini:
    - name: gemini-1
      excluded-models:
        - "gemini-2.5-pro"
        - "gemini-2.5-*"
        - "*-preview"
        - "*flash*"
      keys:
        - api-key: "YOUR_API_KEY"
          excluded-models: []
```

密钥上的空列表会清掉从组继承的排除。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.excluded-models | 按提供商排除 OAuth 凭证上的模型。 | nil | 省略时不排除。条目支持精确名，以及前缀、后缀和子串通配，例如 gemini-2.5-*、*-preview、*flash*。 |
| api-keys.codex.excluded-models | 按提供商排除 OAuth 凭证上的模型。 | nil | 省略时不排除。条目支持精确名，以及前缀、后缀和子串通配，例如 gemini-2.5-*、*-preview、*flash*。 |
| api-keys.gemini.excluded-models | 按提供商排除 OAuth 凭证上的模型。 | nil | 省略时不排除。条目支持精确名，以及前缀、后缀和子串通配，例如 gemini-2.5-*、*-preview、*flash*。 |
| api-keys.interactions.excluded-models | 按提供商排除 OAuth 凭证上的模型。 | nil | 省略时不排除。条目支持精确名，以及前缀、后缀和子串通配，例如 gemini-2.5-*、*-preview、*flash*。 |
| api-keys.meta.excluded-models | 按提供商排除 OAuth 凭证上的模型。 | nil | 省略时不排除。条目支持精确名，以及前缀、后缀和子串通配，例如 gemini-2.5-*、*-preview、*flash*。 |
| api-keys.vertex.excluded-models | 按提供商排除 OAuth 凭证上的模型。 | nil | 省略时不排除。条目支持精确名，以及前缀、后缀和子串通配，例如 gemini-2.5-*、*-preview、*flash*。 |
| api-keys.xai.excluded-models | 按提供商排除 OAuth 凭证上的模型。 | nil | 省略时不排除。条目支持精确名，以及前缀、后缀和子串通配，例如 gemini-2.5-*、*-preview、*flash*。 |

## 5. 常见错误与边界

不匹配的通配只是不排除，不会让配置载入失败。

## 6. 相关功能

OAuth 排除见 [OAuth 目录、别名与排除](/cn/accounts/oauth)。

## 7. 使用经验

- [在单份凭证上排除模型](/cn/experience/accounts#exp-accounts-exclude-model)
