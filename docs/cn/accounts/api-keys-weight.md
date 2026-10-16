---
title: 凭证权重
feature_ids:
  - api-keys.claude.weight
  - api-keys.codex.weight
  - api-keys.gemini.weight
  - api-keys.interactions.weight
  - api-keys.meta.weight
  - api-keys.vertex.weight
  - api-keys.xai.weight
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 凭证权重

## 1. 这段解决什么问题

在加权轮询里给每把上游密钥一个份额。

## 2. 适用条件与不做的事

OpenAI 兼容提供商的权重在 keys 条目上，字段名载入后是 api-key-entries.weight。其他提供商写在 keys 上。优先级不是权重。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  claude:
    - name: claude-1
      keys:
        - api-key: "YOUR_API_KEY"
          weight: 1
  openai-compatibility:
    - name: openrouter
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
          weight: 1
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.weight | 加权轮询中的份额。 | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | 省略时按 1。小于等于 0 的整数不参与加权选择。非整数使配置载入失败，错误含 weight must be an integer。大于 1000000 失败，错误含 weight must not exceed 1000000。 |
| api-keys.codex.weight | 加权轮询中的份额。 | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | 省略时按 1。小于等于 0 的整数不参与加权选择。非整数使配置载入失败，错误含 weight must be an integer。大于 1000000 失败，错误含 weight must not exceed 1000000。 |
| api-keys.gemini.weight | 加权轮询中的份额。 | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | 省略时按 1。小于等于 0 的整数不参与加权选择。非整数使配置载入失败，错误含 weight must be an integer。大于 1000000 失败，错误含 weight must not exceed 1000000。 |
| api-keys.interactions.weight | 加权轮询中的份额。 | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | 省略时按 1。小于等于 0 的整数不参与加权选择。非整数使配置载入失败，错误含 weight must be an integer。大于 1000000 失败，错误含 weight must not exceed 1000000。 |
| api-keys.meta.weight | 加权轮询中的份额。 | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | 省略时按 1。小于等于 0 的整数不参与加权选择。非整数使配置载入失败，错误含 weight must be an integer。大于 1000000 失败，错误含 weight must not exceed 1000000。 |
| api-keys.vertex.weight | 加权轮询中的份额。 | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | 省略时按 1。小于等于 0 的整数不参与加权选择。非整数使配置载入失败，错误含 weight must be an integer。大于 1000000 失败，错误含 weight must not exceed 1000000。 |
| api-keys.xai.weight | 加权轮询中的份额。 | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | 省略时按 1。小于等于 0 的整数不参与加权选择。非整数使配置载入失败，错误含 weight must be an integer。大于 1000000 失败，错误含 weight must not exceed 1000000。 |

## 5. 常见错误与边界

省略按 1。小于等于 0 排除该凭证，不报错。非整数或大于 1000000 时配置载入失败。

## 6. 相关功能

优先级见 [凭证优先级](/cn/accounts/api-keys-priority)。

## 7. 使用经验

暂无
