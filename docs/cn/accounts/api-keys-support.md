---
title: prompt_cache_key
feature_ids:
  - api-keys.openai-compatibility.support-prompt-cache-key
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# prompt_cache_key

## 1. 这段解决什么问题

让一个 OpenAI 兼容提供商为支持的请求注入派生的 prompt_cache_key。

## 2. 适用条件与不做的事

只这一条。它不是 Codex 模型上的 support-configuration-update。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  openai-compatibility:
    - name: openrouter
      base-url: "https://example.invalid"
      support-prompt-cache-key: false
      keys:
        - api-key: "YOUR_API_KEY"
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.openai-compatibility.support-prompt-cache-key | 是否注入派生的 prompt_cache_key。 | false | true 时为支持的请求注入派生的 prompt_cache_key。false 时不注入。 |

## 5. 常见错误与边界

false 或不写都不注入。true 只对支持该字段的请求生效。

## 6. 相关功能

模型上的 configuration_update 见 [上游模型别名](/cn/accounts/api-keys-models)。

## 7. 使用经验

暂无
