---
title: 默认载荷规则
feature_ids:
  - requests.payload.default-models-exist
  - requests.payload.default-models-from-protocol
  - requests.payload.default-models-headers
  - requests.payload.default-models-match
  - requests.payload.default-models-name
  - requests.payload.default-models-not-exist
  - requests.payload.default-models-not-match
  - requests.payload.default-models-protocol
  - requests.payload.default-params
  - requests.payload.default-raw-models-exist
  - requests.payload.default-raw-models-from-protocol
  - requests.payload.default-raw-models-headers
  - requests.payload.default-raw-models-match
  - requests.payload.default-raw-models-name
  - requests.payload.default-raw-models-not-exist
  - requests.payload.default-raw-models-not-match
  - requests.payload.default-raw-models-protocol
  - requests.payload.default-raw-params
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 默认载荷规则

## 1. 这段解决什么问题

`requests.payload.default` 只补上原始载荷里还没有的字段。`default-raw` 同样只补缺失字段，但把值当作原始 JSON 插入。

## 2. 适用条件与不做的事

规则挂在 `requests.payload`，在内置协议翻译和图像工具清理之后、请求发出之前应用。`models` 为空，或没有任何一条模型条目同时满足名称、协议、来源头和路径条件时，该规则不写字段。同一条规则里只要有一条模型条目匹配就会写入。本页的规则不会覆盖已经存在的值，也不会删除字段。

## 3. 怎么配置或怎么调用

```yaml
requests:
  payload:
    default:
      - models:
          - name: "gemini-*"
            protocol: "gemini"
            from-protocol: "responses"
            headers:
              X-Client-Tier: "tenant-*-region-*"
            match:
              - "metadata.client": "codex"
            not-match:
              - "metadata.mode": "dev"
            exist:
              - "tools"
            not-exist:
              - "metadata.disable_payload"
        params:
          "generationConfig.thinkingConfig.thinkingBudget": 32768
    default-raw:
      - models:
          - name: "gemini-2.5-pro"
            protocol: "gemini"
        params:
          "generationConfig.responseJsonSchema": "{\"type\":\"object\"}"
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| requests.payload.default.models.exist | 这些 JSON 路径必须存在且非 null。 | nil | 路径必须存在且不是 null。空路径被忽略。 |
| requests.payload.default.models.from-protocol | 来源协议限制。 | empty string | 空值不限制。openai-response、openai-responses 和 response 规范化为 responses。来源协议为空时，非空条件不匹配。 |
| requests.payload.default.models.headers | 必须匹配的请求头模式。 | nil | 每个配置头都必须匹配，值里的 * 是通配符。空映射不限制。请求没有该头则规则不匹配。 |
| requests.payload.default.models.match | JSON 路径必须等于这些值。 | nil | 全部条件都要成功。空路径被忽略。按规范化后的 JSON 值比较。 |
| requests.payload.default.models.name | 模型名或通配符。 | empty string | 空名称不匹配。* 匹配任意候选。候选包含上游模型名；若有请求模型，还包含去掉思考后缀后的名称。只有请求名本身带思考后缀时，才再加入带后缀的原请求名。 |
| requests.payload.default.models.not-exist | 这些 JSON 路径必须缺失或为 null。 | nil | 路径必须缺失或为 null。出现非 null 值则规则不匹配。空路径被忽略。 |
| requests.payload.default.models.not-match | JSON 路径不得等于这些值。 | nil | 任一路径等于配置值则整条规则不匹配。空路径被忽略。 |
| requests.payload.default.models.protocol | 目标协议限制。 | empty string | 大小写不敏感。空值不限制。执行器会传入 openai、gemini、claude、codex、antigravity 或 interactions 等实际协议。 |
| requests.payload.default.params | 要写入载荷的 JSON 路径和值。 | nil | 只在原始载荷缺少该路径时写入普通值。default 与 default-raw 对同一路径第一次成功写入胜出。 |
| requests.payload.default-raw.models.exist | 这些 JSON 路径必须存在且非 null。 | nil | 路径必须存在且不是 null。空路径被忽略。 |
| requests.payload.default-raw.models.from-protocol | 来源协议限制。 | empty string | 空值不限制。openai-response、openai-responses 和 response 规范化为 responses。来源协议为空时，非空条件不匹配。 |
| requests.payload.default-raw.models.headers | 必须匹配的请求头模式。 | nil | 每个配置头都必须匹配，值里的 * 是通配符。空映射不限制。请求没有该头则规则不匹配。 |
| requests.payload.default-raw.models.match | JSON 路径必须等于这些值。 | nil | 全部条件都要成功。空路径被忽略。按规范化后的 JSON 值比较。 |
| requests.payload.default-raw.models.name | 模型名或通配符。 | empty string | 空名称不匹配。* 匹配任意候选。候选包含上游模型名；若有请求模型，还包含去掉思考后缀后的名称。只有请求名本身带思考后缀时，才再加入带后缀的原请求名。 |
| requests.payload.default-raw.models.not-exist | 这些 JSON 路径必须缺失或为 null。 | nil | 路径必须缺失或为 null。出现非 null 值则规则不匹配。空路径被忽略。 |
| requests.payload.default-raw.models.not-match | JSON 路径不得等于这些值。 | nil | 任一路径等于配置值则整条规则不匹配。空路径被忽略。 |
| requests.payload.default-raw.models.protocol | 目标协议限制。 | empty string | 大小写不敏感。空值不限制。执行器会传入 openai、gemini、claude、codex、antigravity 或 interactions 等实际协议。 |
| requests.payload.default-raw.params | 要写入载荷的 JSON 路径和原始 JSON。 | nil | 只在原始载荷缺少该路径时写入。字符串按原始 JSON 原样插入，必须是有效 JSON；其他类型先做 JSON 编码。与 default 共享第一次写入。SetRawBytes 失败则跳过。 |

## 5. 常见错误与边界

原始 JSON 不是有效 JSON，或 `SetRawBytes` 失败时，该路径被跳过，不返回单独的配置加载错误。模型列表为空时整条规则不匹配。`default` 与 `default-raw` 写过的路径不会被后一条默认规则改写。

## 6. 相关功能

另外两类规则见 [默认载荷规则](/cn/routing/requests-default)、[覆盖载荷规则](/cn/routing/requests-override) 和 [过滤载荷规则](/cn/routing/requests-filter)。模型思考能力本身见 [模型思考能力](/cn/configuration/thinking-models)。

## 7. 使用经验

- [用 fork 别名区分图像尺寸](/cn/experience/routing#exp-routing-fork-alias-for-image-size)
- [图像尺寸写在 imageConfig](/cn/experience/routing#exp-routing-gemini-image-config-path)
