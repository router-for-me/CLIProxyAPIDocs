---
title: 过滤载荷规则
feature_ids:
  - requests.payload.filter-models-exist
  - requests.payload.filter-models-from-protocol
  - requests.payload.filter-models-headers
  - requests.payload.filter-models-match
  - requests.payload.filter-models-name
  - requests.payload.filter-models-not-exist
  - requests.payload.filter-models-not-match
  - requests.payload.filter-models-protocol
  - requests.payload.filter-params
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 过滤载荷规则

## 1. 这段解决什么问题

`requests.payload.filter` 按 JSON 路径删除字段。它用来去掉上游不应看到的参数。

## 2. 适用条件与不做的事

过滤在默认规则和覆盖规则之后执行，所以它可以删除那些规则刚刚写入的路径。`params` 在这里是路径列表，不是路径到值的映射。`models` 为空，或没有任何一条模型条目完全匹配时，该规则不删除。同一条规则里只要有一条模型条目匹配就会删除。本页不写入新值。

## 3. 怎么配置或怎么调用

```yaml
requests:
  payload:
    filter:
      - models:
          - name: "gemini-*"
            protocol: "gemini"
        params:
          - "generationConfig.thinkingConfig.thinkingBudget"
          - "generationConfig.responseJsonSchema"
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| requests.payload.filter.models.exist | 这些 JSON 路径必须存在且非 null。 | nil | 路径必须存在且不是 null。空路径被忽略。 |
| requests.payload.filter.models.from-protocol | 来源协议限制。 | empty string | 空值不限制。openai-response、openai-responses 和 response 规范化为 responses。来源协议为空时，非空条件不匹配。 |
| requests.payload.filter.models.headers | 必须匹配的请求头模式。 | nil | 每个配置头都必须匹配，值里的 * 是通配符。空映射不限制。请求没有该头则规则不匹配。 |
| requests.payload.filter.models.match | JSON 路径必须等于这些值。 | nil | 全部条件都要成功。空路径被忽略。按规范化后的 JSON 值比较。 |
| requests.payload.filter.models.name | 模型名或通配符。 | empty string | 空名称不匹配。* 匹配任意候选。候选包含上游模型名；若有请求模型，还包含去掉思考后缀后的名称。只有请求名本身带思考后缀时，才再加入带后缀的原请求名。 |
| requests.payload.filter.models.not-exist | 这些 JSON 路径必须缺失或为 null。 | nil | 路径必须缺失或为 null。出现非 null 值则规则不匹配。空路径被忽略。 |
| requests.payload.filter.models.not-match | JSON 路径不得等于这些值。 | nil | 任一路径等于配置值则整条规则不匹配。空路径被忽略。 |
| requests.payload.filter.models.protocol | 目标协议限制。 | empty string | 大小写不敏感。空值不限制。执行器会传入 openai、gemini、claude、codex、antigravity 或 interactions 等实际协议。 |
| requests.payload.filter.params | 要从载荷中删除的 JSON 路径。 | nil | 在 default、default-raw、override 和 override-raw 之后删除。因此可以删掉前面刚写上的路径。空路径跳过，删除失败也跳过。 |

## 5. 常见错误与边界

空路径和删除失败都会跳过，不中断其余路径。模型或协议条件不匹配时不删除。`models` 为空时规则不生效。

## 6. 相关功能

另外两类规则见 [默认载荷规则](/cn/routing/requests-default)、[覆盖载荷规则](/cn/routing/requests-override) 和 [过滤载荷规则](/cn/routing/requests-filter)。模型思考能力本身见 [模型思考能力](/cn/configuration/thinking-models)。

## 7. 使用经验

暂无
