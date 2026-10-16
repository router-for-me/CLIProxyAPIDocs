---
title: 冷却与 Codex 伪装开关
feature_ids:
  - api-keys.claude.disable-cooling
  - api-keys.codex.disable-codex-cloaking
  - api-keys.codex.disable-cooling
  - api-keys.gemini.disable-cooling
  - api-keys.interactions.disable-cooling
  - api-keys.meta.disable-codex-cloaking
  - api-keys.meta.disable-cooling
  - api-keys.openai-compatibility.disable-cooling
  - api-keys.vertex.disable-cooling
  - api-keys.xai.disable-codex-cloaking
  - api-keys.xai.disable-cooling
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 冷却与 Codex 伪装开关

## 1. 这段解决什么问题

这里说明单条凭证如何覆盖全局冷却，以及 Codex 形态的密钥如何覆盖 Codex 伪装。

## 2. 适用条件与不做的事

全局冷却不在本页。Codex 全局伪装见 Codex 提供商选项。OpenAI 兼容提供商的冷却开关作用在整个提供商，不在单把密钥。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  claude:
    - name: claude-1
      disable-cooling: false
      keys:
        - api-key: "YOUR_API_KEY"
          disable-cooling: false
  codex:
    - name: codex-1
      keys:
        - api-key: "YOUR_API_KEY"
          disable-codex-cloaking: false
```

组上的值和密钥上的值都可以写。密钥上的非空值覆盖组。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.disable-cooling | 是否覆盖全局冷却策略。 | nil | 省略表示继承全局冷却。true 关闭这条凭证的认证和模型冷却。false 明确打开。 |
| api-keys.codex.disable-codex-cloaking | 是否停止强制官方 Codex 身份头。 | nil | 省略表示继承 upstream.codex.disable-codex-cloaking。true 关闭伪装，false 明确打开。 |
| api-keys.codex.disable-cooling | 是否覆盖全局冷却策略。 | nil | 省略表示继承全局冷却。true 关闭这条凭证的认证和模型冷却。false 明确打开。 |
| api-keys.gemini.disable-cooling | 是否覆盖全局冷却策略。 | nil | 省略表示继承全局冷却。true 关闭这条凭证的认证和模型冷却。false 明确打开。 |
| api-keys.interactions.disable-cooling | 是否覆盖全局冷却策略。 | nil | 省略表示继承全局冷却。true 关闭这条凭证的认证和模型冷却。false 明确打开。 |
| api-keys.meta.disable-codex-cloaking | 是否停止强制官方 Codex 身份头。 | nil | 省略表示继承 upstream.codex.disable-codex-cloaking。true 关闭伪装，false 明确打开。 |
| api-keys.meta.disable-cooling | 是否覆盖全局冷却策略。 | nil | 省略表示继承全局冷却。true 关闭这条凭证的认证和模型冷却。false 明确打开。 |
| api-keys.openai-compatibility.disable-cooling | 是否覆盖全局冷却策略。 | nil | 省略表示继承全局冷却。true 关闭这条凭证的认证和模型冷却。false 明确打开。 |
| api-keys.vertex.disable-cooling | 是否覆盖全局冷却策略。 | nil | 省略表示继承全局冷却。true 关闭这条凭证的认证和模型冷却。false 明确打开。 |
| api-keys.xai.disable-codex-cloaking | 是否停止强制官方 Codex 身份头。 | nil | 省略表示继承 upstream.codex.disable-codex-cloaking。true 关闭伪装，false 明确打开。 |
| api-keys.xai.disable-cooling | 是否覆盖全局冷却策略。 | nil | 省略表示继承全局冷却。true 关闭这条凭证的认证和模型冷却。false 明确打开。 |

## 5. 常见错误与边界

这些字段不因为 true 或 false 拒绝配置。省略才表示继承。

## 6. 相关功能

全局 Codex 伪装见 [Codex 提供商选项](/cn/configuration/provider/codex)。

## 7. 使用经验

暂无
