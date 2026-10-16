---
title: OpenAI 兼容提供商名称
feature_ids:
  - api-keys.openai-compatibility.name
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# OpenAI 兼容提供商名称

## 1. 这段解决什么问题

给一个 OpenAI 兼容上游一个稳定名称，供识别和 User-Agent 等位置使用。

## 2. 适用条件与不做的事

其他提供商 v8 组上的 name 只是组标签，不是本页这条功能。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
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
| api-keys.openai-compatibility.name | OpenAI 兼容提供商的识别名。 | empty string | 用来识别这个 OpenAI 兼容提供商。模板说明它会出现在 User-Agent 等位置。 |

## 5. 常见错误与边界

空名称没有单独的拒绝语句。没有 base-url 的条目会在整理时被移除。

## 6. 相关功能

停用见 [停用 OpenAI 兼容提供商](/cn/accounts/api-keys-disabled)。

## 7. 使用经验

暂无
