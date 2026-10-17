---
title: 上游模型别名
feature_ids:
  - api-keys.claude.models-alias
  - api-keys.claude.models-display-name
  - api-keys.claude.models-force-mapping
  - api-keys.claude.models-is-compat
  - api-keys.claude.models-max-context-length
  - api-keys.claude.models-name
  - api-keys.codex.models-alias
  - api-keys.codex.models-display-name
  - api-keys.codex.models-force-mapping
  - api-keys.codex.models-is-compat
  - api-keys.codex.models-max-context-length
  - api-keys.codex.models-name
  - api-keys.codex.models-support-configuration-update
  - api-keys.gemini.models-alias
  - api-keys.gemini.models-display-name
  - api-keys.gemini.models-force-mapping
  - api-keys.gemini.models-is-compat
  - api-keys.gemini.models-max-context-length
  - api-keys.gemini.models-name
  - api-keys.interactions.models-alias
  - api-keys.interactions.models-display-name
  - api-keys.interactions.models-force-mapping
  - api-keys.interactions.models-is-compat
  - api-keys.interactions.models-max-context-length
  - api-keys.interactions.models-name
  - api-keys.meta.models-alias
  - api-keys.meta.models-display-name
  - api-keys.meta.models-force-mapping
  - api-keys.meta.models-is-compat
  - api-keys.meta.models-max-context-length
  - api-keys.meta.models-name
  - api-keys.meta.models-support-configuration-update
  - api-keys.openai-compatibility.models-alias
  - api-keys.openai-compatibility.models-display-name
  - api-keys.openai-compatibility.models-force-mapping
  - api-keys.openai-compatibility.models-image
  - api-keys.openai-compatibility.models-input-modalities
  - api-keys.openai-compatibility.models-is-compat
  - api-keys.openai-compatibility.models-max-context-length
  - api-keys.openai-compatibility.models-name
  - api-keys.openai-compatibility.models-output-modalities
  - api-keys.openai-compatibility.models-use-max-completion-tokens
  - api-keys.vertex.models-alias
  - api-keys.vertex.models-display-name
  - api-keys.vertex.models-force-mapping
  - api-keys.vertex.models-name
  - api-keys.xai.models-alias
  - api-keys.xai.models-display-name
  - api-keys.xai.models-force-mapping
  - api-keys.xai.models-is-compat
  - api-keys.xai.models-max-context-length
  - api-keys.xai.models-name
  - api-keys.xai.models-support-configuration-update
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 上游模型别名

## 1. 这段解决什么问题

把客户端使用的模型名映射到上游模型名，并附带目录显示、上下文、兼容和图像等选项。

## 2. 适用条件与不做的事

思考量不在本页。OAuth 别名不在本页。同一别名重复出现时，模板说明客户端仍只看到一个名字，请求会在这些上游名之间轮询。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  claude:
    - name: claude-1
      models:
        - name: "claude-3-5-sonnet-20241022"
          alias: "claude-sonnet-latest"
          display-name: "Claude Sonnet"
          max-context-length: 0
          force-mapping: false
          is-compat: false
      keys:
        - api-key: "YOUR_API_KEY"
  openai-compatibility:
    - name: openrouter
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
      models:
        - name: "upstream-model"
          alias: "client-model"
          image: false
          input-modalities: [text]
          output-modalities: [text]
          use-max-completion-tokens: false
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.models.alias | api-keys.claude.models.alias | empty string | 客户端使用这个名字。OAuth 设置里，精确别名匹配优先于名称匹配，同级以后出现的条目为准。 |
| api-keys.claude.models.display-name | api-keys.claude.models.display-name | empty string | 省略时目录不使用单独的显示名。 |
| api-keys.claude.models.force-mapping | api-keys.claude.models.force-mapping | false | true 时把响应中的模型字段写回别名。false 不改写。 |
| api-keys.claude.models.is-compat | api-keys.claude.models.is-compat | Default false keeps the normal signature validation behavior. | false 保持普通签名校验。true 保留空签名 thinking，并为 Claude 兼容 API 密钥模型启用按提供商的签名重放。 |
| api-keys.claude.models.max-context-length | api-keys.claude.models.max-context-length | 0 | 0 表示不覆盖向 Codex 客户端公布的上下文窗口。正数才覆盖。 |
| api-keys.claude.models.name | api-keys.claude.models.name | empty string | 请求发往这个上游模型名。OAuth 别名不作用于 api-keys 分组。 |
| api-keys.codex.models.alias | api-keys.codex.models.alias | empty string | 客户端使用这个名字。OAuth 设置里，精确别名匹配优先于名称匹配，同级以后出现的条目为准。 |
| api-keys.codex.models.display-name | api-keys.codex.models.display-name | empty string | 省略时目录不使用单独的显示名。 |
| api-keys.codex.models.force-mapping | api-keys.codex.models.force-mapping | false | true 时把响应中的模型字段写回别名。false 不改写。 |
| api-keys.codex.models.is-compat | api-keys.codex.models.is-compat | Default false keeps the native behavior unchanged. | 还要 client.codex.optimize-multi-agent-v2 为 true，才会把 MultiAgentV2 的 agent_message 转成可移植的 Responses 输入。false 保持原生行为。 |
| api-keys.codex.models.max-context-length | api-keys.codex.models.max-context-length | 0 | 0 表示不覆盖向 Codex 客户端公布的上下文窗口。正数才覆盖。 |
| api-keys.codex.models.name | api-keys.codex.models.name | empty string | 请求发往这个上游模型名。OAuth 别名不作用于 api-keys 分组。 |
| api-keys.codex.models.support-configuration-update | api-keys.codex.models.support-configuration-update | It defaults to false, independently of the built-in OAuth model catalog. | 默认 false，并且不受内置 OAuth 模型目录影响。true 才为这把 API 密钥模型启用 configuration_update。 |
| api-keys.gemini.models.alias | api-keys.gemini.models.alias | empty string | 客户端使用这个名字。OAuth 设置里，精确别名匹配优先于名称匹配，同级以后出现的条目为准。 |
| api-keys.gemini.models.display-name | api-keys.gemini.models.display-name | empty string | 省略时目录不使用单独的显示名。 |
| api-keys.gemini.models.force-mapping | api-keys.gemini.models.force-mapping | false | true 时把响应中的模型字段写回别名。false 不改写。 |
| api-keys.gemini.models.is-compat | api-keys.gemini.models.is-compat | Default false keeps the normal signature validation behavior. | false 保持普通签名校验。true 为兼容上游保留空签名 thinking。 |
| api-keys.gemini.models.max-context-length | api-keys.gemini.models.max-context-length | 0 | 0 表示不覆盖向 Codex 客户端公布的上下文窗口。正数才覆盖。 |
| api-keys.gemini.models.name | api-keys.gemini.models.name | empty string | 请求发往这个上游模型名。OAuth 别名不作用于 api-keys 分组。 |
| api-keys.interactions.models.alias | api-keys.interactions.models.alias | empty string | 客户端使用这个名字。OAuth 设置里，精确别名匹配优先于名称匹配，同级以后出现的条目为准。 |
| api-keys.interactions.models.display-name | api-keys.interactions.models.display-name | empty string | 省略时目录不使用单独的显示名。 |
| api-keys.interactions.models.force-mapping | api-keys.interactions.models.force-mapping | false | true 时把响应中的模型字段写回别名。false 不改写。 |
| api-keys.interactions.models.is-compat | api-keys.interactions.models.is-compat | Default false keeps the normal signature validation behavior. | false 保持普通签名校验。true 为兼容上游保留空签名 thinking。 |
| api-keys.interactions.models.max-context-length | api-keys.interactions.models.max-context-length | 0 | 0 表示不覆盖向 Codex 客户端公布的上下文窗口。正数才覆盖。 |
| api-keys.interactions.models.name | api-keys.interactions.models.name | empty string | 请求发往这个上游模型名。OAuth 别名不作用于 api-keys 分组。 |
| api-keys.meta.models.alias | api-keys.meta.models.alias | empty string | 客户端使用这个名字。OAuth 设置里，精确别名匹配优先于名称匹配，同级以后出现的条目为准。 |
| api-keys.meta.models.display-name | api-keys.meta.models.display-name | empty string | 省略时目录不使用单独的显示名。 |
| api-keys.meta.models.force-mapping | api-keys.meta.models.force-mapping | false | true 时把响应中的模型字段写回别名。false 不改写。 |
| api-keys.meta.models.is-compat | api-keys.meta.models.is-compat | Default false keeps the native behavior unchanged. | 还要 client.codex.optimize-multi-agent-v2 为 true，才会把 MultiAgentV2 的 agent_message 转成可移植的 Responses 输入。false 保持原生行为。 |
| api-keys.meta.models.max-context-length | api-keys.meta.models.max-context-length | 0 | 0 表示不覆盖向 Codex 客户端公布的上下文窗口。正数才覆盖。 |
| api-keys.meta.models.name | api-keys.meta.models.name | empty string | 请求发往这个上游模型名。OAuth 别名不作用于 api-keys 分组。 |
| api-keys.meta.models.support-configuration-update | api-keys.meta.models.support-configuration-update | It defaults to false, independently of the built-in OAuth model catalog. | 默认 false，并且不受内置 OAuth 模型目录影响。true 才为这把 API 密钥模型启用 configuration_update。 |
| api-keys.openai-compatibility.models.alias | api-keys.openai-compatibility.models.alias | empty string | 客户端使用这个名字。OAuth 设置里，精确别名匹配优先于名称匹配，同级以后出现的条目为准。 |
| api-keys.openai-compatibility.models.display-name | api-keys.openai-compatibility.models.display-name | empty string | 省略时目录不使用单独的显示名。 |
| api-keys.openai-compatibility.models.force-mapping | api-keys.openai-compatibility.models.force-mapping | false | true 时把响应中的模型字段写回别名。false 不改写。 |
| api-keys.openai-compatibility.models.image | api-keys.openai-compatibility.models.image | false | true 才允许 /v1/images/generations 和 /v1/images/edits。它不表示对话输入支持图像。 |
| api-keys.openai-compatibility.models.input-modalities | api-keys.openai-compatibility.models.input-modalities | nil | 例如 text、image。这是对话和 Responses 的输入能力，不是图像端点开关。 |
| api-keys.openai-compatibility.models.is-compat | api-keys.openai-compatibility.models.is-compat | Default false keeps the normal signature validation behavior. | false 保持普通签名校验。true 为兼容上游保留 Claude thinking 块。 |
| api-keys.openai-compatibility.models.max-context-length | api-keys.openai-compatibility.models.max-context-length | 0 | 0 表示不覆盖向 Codex 客户端公布的上下文窗口。正数才覆盖。 |
| api-keys.openai-compatibility.models.name | api-keys.openai-compatibility.models.name | empty string | 请求发往这个上游模型名。OAuth 别名不作用于 api-keys 分组。 |
| api-keys.openai-compatibility.models.output-modalities | api-keys.openai-compatibility.models.output-modalities | nil | 已知时声明输出模态，例如 text、image。省略表示不额外声明。 |
| api-keys.openai-compatibility.models.use-max-completion-tokens | api-keys.openai-compatibility.models.use-max-completion-tokens | Default false preserves max_tokens for older compatible upstreams. | false 继续发送 max_tokens。true 改为 max_completion_tokens。 |
| api-keys.vertex.models.alias | api-keys.vertex.models.alias | empty string | 客户端使用这个名字。OAuth 设置里，精确别名匹配优先于名称匹配，同级以后出现的条目为准。 |
| api-keys.vertex.models.display-name | api-keys.vertex.models.display-name | empty string | 省略时目录不使用单独的显示名。 |
| api-keys.vertex.models.force-mapping | api-keys.vertex.models.force-mapping | false | true 时把响应中的模型字段写回别名。false 不改写。 |
| api-keys.vertex.models.name | api-keys.vertex.models.name | empty string | 请求发往这个上游模型名。OAuth 别名不作用于 api-keys 分组。 |
| api-keys.xai.models.alias | api-keys.xai.models.alias | empty string | 客户端使用这个名字。OAuth 设置里，精确别名匹配优先于名称匹配，同级以后出现的条目为准。 |
| api-keys.xai.models.display-name | api-keys.xai.models.display-name | empty string | 省略时目录不使用单独的显示名。 |
| api-keys.xai.models.force-mapping | api-keys.xai.models.force-mapping | false | true 时把响应中的模型字段写回别名。false 不改写。 |
| api-keys.xai.models.is-compat | api-keys.xai.models.is-compat | Default false keeps the native behavior unchanged. | 还要 client.codex.optimize-multi-agent-v2 为 true，才会把 MultiAgentV2 的 agent_message 转成可移植的 Responses 输入。false 保持原生行为。 |
| api-keys.xai.models.max-context-length | api-keys.xai.models.max-context-length | 0 | 0 表示不覆盖向 Codex 客户端公布的上下文窗口。正数才覆盖。 |
| api-keys.xai.models.name | api-keys.xai.models.name | empty string | 请求发往这个上游模型名。OAuth 别名不作用于 api-keys 分组。 |
| api-keys.xai.models.support-configuration-update | api-keys.xai.models.support-configuration-update | It defaults to false, independently of the built-in OAuth model catalog. | 默认 false，并且不受内置 OAuth 模型目录影响。true 才为这把 API 密钥模型启用 configuration_update。 |

## 5. 常见错误与边界

这些字段按类型载入。Codex 形态的 is-compat 只有在 client.codex.optimize-multi-agent-v2 也为 true 时才转换 agent_message。image 只打开两个图像路由，不表示对话可以输入图像。

## 6. 相关功能

OAuth 别名见 [OAuth 目录、别名与排除](/cn/accounts/oauth)。

## 7. 使用经验

- [别名要和请求的模型名一致才参与轮询](/cn/experience/accounts#exp-accounts-alias-matches-request)
- [兼容提供商要同时有基址和别名](/cn/experience/accounts#exp-accounts-compat-base-and-alias)
- [兼容模型保留签名思考](/cn/experience/accounts#exp-accounts-compat-preserves-signed-thinking)
- [展示名和别名是两个字段](/cn/experience/accounts#exp-accounts-display-name-field)
- [force-mapping 把响应模型改成别名](/cn/experience/accounts#exp-accounts-force-mapping-alias)
- [兼容模型要写入配置才出现在列表](/cn/experience/accounts#exp-accounts-list-compat-models)
- [用 OpenAI 兼容段接入第三方](/cn/experience/accounts#exp-accounts-openai-compatible-provider)
- [压缩需要上游提供压缩模型](/cn/experience/api#exp-api-compaction-needs-model)
- [用 max-context-length 改广告窗口](/cn/experience/configuration#exp-configuration-advertise-context-length)
- [用 fork 别名区分图像尺寸](/cn/experience/routing#exp-routing-fork-alias-for-image-size)
- [同名模型共用路由策略](/cn/experience/routing#exp-routing-same-model-name)
