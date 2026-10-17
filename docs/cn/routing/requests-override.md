---
title: 覆盖载荷规则
feature_ids:
  - requests.payload.override-models-exist
  - requests.payload.override-models-from-protocol
  - requests.payload.override-models-headers
  - requests.payload.override-models-match
  - requests.payload.override-models-name
  - requests.payload.override-models-not-exist
  - requests.payload.override-models-not-match
  - requests.payload.override-models-protocol
  - requests.payload.override-params
  - requests.payload.override-raw-models-exist
  - requests.payload.override-raw-models-from-protocol
  - requests.payload.override-raw-models-headers
  - requests.payload.override-raw-models-match
  - requests.payload.override-raw-models-name
  - requests.payload.override-raw-models-not-exist
  - requests.payload.override-raw-models-not-match
  - requests.payload.override-raw-models-protocol
  - requests.payload.override-raw-params
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 覆盖载荷规则

## 1. 这段解决什么问题

`requests.payload.override` 总是写入字段，并替换已有值。`override-raw` 同样总是写入，但把值当作原始 JSON 插入。

## 2. 适用条件与不做的事

同一路径上后匹配的覆盖规则胜出。它们发生在默认规则之后、过滤规则之前。过滤规则随后仍可删掉这里写上的路径。`models` 为空，或没有任何一条模型条目完全匹配时，该规则不写入。同一条规则里只要有一条模型条目匹配就会写入。本页不负责“仅在缺失时写入”。

## 3. 怎么配置或怎么调用

```yaml
requests:
  payload:
    override:
      - models:
          - name: "gpt-*"
            protocol: "codex"
        params:
          "reasoning.effort": "high"
    override-raw:
      - models:
          - name: "gpt-*"
            protocol: "codex"
        params:
          "response_format": "{\"type\":\"json_schema\"}"
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| requests.payload.override.models.exist | 这些 JSON 路径必须存在且非 null。 | nil | 路径必须存在且不是 null。空路径被忽略。 |
| requests.payload.override.models.from-protocol | 来源协议限制。 | empty string | 空值不限制。openai-response、openai-responses 和 response 规范化为 responses。来源协议为空时，非空条件不匹配。 |
| requests.payload.override.models.headers | 必须匹配的请求头模式。 | nil | 每个配置头都必须匹配，值里的 * 是通配符。空映射不限制。请求没有该头则规则不匹配。 |
| requests.payload.override.models.match | JSON 路径必须等于这些值。 | nil | 全部条件都要成功。空路径被忽略。按规范化后的 JSON 值比较。 |
| requests.payload.override.models.name | 模型名或通配符。 | empty string | 空名称不匹配。* 匹配任意候选。候选包含上游模型名；若有请求模型，还包含去掉思考后缀后的名称。只有请求名本身带思考后缀时，才再加入带后缀的原请求名。 |
| requests.payload.override.models.not-exist | 这些 JSON 路径必须缺失或为 null。 | nil | 路径必须缺失或为 null。出现非 null 值则规则不匹配。空路径被忽略。 |
| requests.payload.override.models.not-match | JSON 路径不得等于这些值。 | nil | 任一路径等于配置值则整条规则不匹配。空路径被忽略。 |
| requests.payload.override.models.protocol | 目标协议限制。 | empty string | 大小写不敏感。空值不限制。执行器会传入 openai、gemini、claude、codex、antigravity 或 interactions 等实际协议。 |
| requests.payload.override.params | 要写入载荷的 JSON 路径和值。 | nil | 总是写入并替换已有值。后匹配的 override 规则胜出。 |
| requests.payload.override-raw.models.exist | 这些 JSON 路径必须存在且非 null。 | nil | 路径必须存在且不是 null。空路径被忽略。 |
| requests.payload.override-raw.models.from-protocol | 来源协议限制。 | empty string | 空值不限制。openai-response、openai-responses 和 response 规范化为 responses。来源协议为空时，非空条件不匹配。 |
| requests.payload.override-raw.models.headers | 必须匹配的请求头模式。 | nil | 每个配置头都必须匹配，值里的 * 是通配符。空映射不限制。请求没有该头则规则不匹配。 |
| requests.payload.override-raw.models.match | JSON 路径必须等于这些值。 | nil | 全部条件都要成功。空路径被忽略。按规范化后的 JSON 值比较。 |
| requests.payload.override-raw.models.name | 模型名或通配符。 | empty string | 空名称不匹配。* 匹配任意候选。候选包含上游模型名；若有请求模型，还包含去掉思考后缀后的名称。只有请求名本身带思考后缀时，才再加入带后缀的原请求名。 |
| requests.payload.override-raw.models.not-exist | 这些 JSON 路径必须缺失或为 null。 | nil | 路径必须缺失或为 null。出现非 null 值则规则不匹配。空路径被忽略。 |
| requests.payload.override-raw.models.not-match | JSON 路径不得等于这些值。 | nil | 任一路径等于配置值则整条规则不匹配。空路径被忽略。 |
| requests.payload.override-raw.models.protocol | 目标协议限制。 | empty string | 大小写不敏感。空值不限制。执行器会传入 openai、gemini、claude、codex、antigravity 或 interactions 等实际协议。 |
| requests.payload.override-raw.params | 要写入载荷的 JSON 路径和原始 JSON。 | nil | 总是写入原始 JSON。字符串原样插入且必须是有效 JSON。后匹配的 override-raw 胜出。SetRawBytes 失败则跳过。 |

## 5. 常见错误与边界

原始 JSON 无效或 `SetRawBytes` 失败时跳过该路径。协议或模型条件不匹配时不写入，也不报配置错误。空的 `models` 使整条规则不生效。

## 6. 相关功能

另外两类规则见 [默认载荷规则](/cn/routing/requests-default)、[覆盖载荷规则](/cn/routing/requests-override) 和 [过滤载荷规则](/cn/routing/requests-filter)。模型思考能力本身见 [模型思考能力](/cn/configuration/thinking-models)。

## 7. 使用经验

- [第三方 DeepSeek 不会填 OpenAI 思考字段](/cn/experience/api#exp-api-deepseek-no-openai-thinking)
- [别名加覆盖表达 Opus 努力值](/cn/experience/routing#exp-routing-alias-and-override-effort)
- [gpt-image-2 通过覆盖后的聊天补全调用](/cn/experience/routing#exp-routing-gpt-image-override)
- [用覆盖规则增加 extra_body](/cn/experience/routing#exp-routing-override-extra-body)
- [用载荷覆盖修补 Grok 子代理](/cn/experience/routing#exp-routing-override-grok-subagent)
- [载荷覆盖在思考后缀之后仍生效](/cn/experience/routing#exp-routing-override-is-final)
- [不同模型使用不同的覆盖规则](/cn/experience/routing#exp-routing-separate-payload-by-model)
