---
title: 停用 OpenAI 兼容提供商
feature_ids:
  - api-keys.openai-compatibility.disabled
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 停用 OpenAI 兼容提供商

## 1. 这段解决什么问题

不删除配置的情况下，让一个 OpenAI 兼容提供商不再参与路由。

## 2. 适用条件与不做的事

只作用于 `api-keys.openai-compatibility` 的一个提供商条目。不能用来停用 Claude 或 Gemini 的某一把密钥。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  openai-compatibility:
    - name: openrouter
      disabled: true
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.openai-compatibility.disabled | 是否停用这一整个 OpenAI 兼容提供商。 | false | true 时该提供商不参与路由。false 时正常使用。 |

## 5. 常见错误与边界

true 只是不参与路由，不会在载入时报错。false 或省略表示可用。

## 6. 相关功能

名称见 [OpenAI 兼容提供商名称](/cn/accounts/api-keys-name)。

## 7. 使用经验

- [用 disabled 停用兼容提供商](/cn/experience/accounts#exp-accounts-disable-compat-provider)
