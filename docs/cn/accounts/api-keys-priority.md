---
title: 凭证优先级
feature_ids:
  - api-keys.claude.priority
  - api-keys.codex.priority
  - api-keys.gemini.priority
  - api-keys.interactions.priority
  - api-keys.meta.priority
  - api-keys.openai-compatibility.priority
  - api-keys.vertex.priority
  - api-keys.xai.priority
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 凭证优先级

## 1. 这段解决什么问题

多条凭证都能处理同一个模型时，用优先级决定先选谁。

## 2. 适用条件与不做的事

OpenAI 兼容提供商的优先级在提供商上。其他提供商可写在组上，并由密钥覆盖。权重是另一页。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  claude:
    - name: claude-1
      priority: 0
      keys:
        - api-key: "YOUR_API_KEY"
          priority: 10
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.priority | 多条凭证同时匹配时的优先级。 | Higher values are preferred; defaults to 0. | 数值越大越优先。省略时为 0。 |
| api-keys.codex.priority | 多条凭证同时匹配时的优先级。 | Higher values are preferred; defaults to 0. | 数值越大越优先。省略时为 0。 |
| api-keys.gemini.priority | 多条凭证同时匹配时的优先级。 | Higher values are preferred; defaults to 0. | 数值越大越优先。省略时为 0。 |
| api-keys.interactions.priority | 多条凭证同时匹配时的优先级。 | Higher values are preferred; defaults to 0. | 数值越大越优先。省略时为 0。 |
| api-keys.meta.priority | 多条凭证同时匹配时的优先级。 | Higher values are preferred; defaults to 0. | 数值越大越优先。省略时为 0。 |
| api-keys.openai-compatibility.priority | 多条凭证同时匹配时的优先级。 | Higher values are preferred; defaults to 0. | 数值越大越优先。省略时为 0。 |
| api-keys.vertex.priority | 多条凭证同时匹配时的优先级。 | Higher values are preferred; defaults to 0. | 数值越大越优先。省略时为 0。 |
| api-keys.xai.priority | 多条凭证同时匹配时的优先级。 | Higher values are preferred; defaults to 0. | 数值越大越优先。省略时为 0。 |

## 5. 常见错误与边界

没有范围拒绝。数值越大越优先，省略为 0。

## 6. 相关功能

权重见 [凭证权重](/cn/accounts/api-keys-weight)。

## 7. 使用经验

暂无
