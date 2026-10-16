---
title: 模型思考能力
feature_ids:
  - api-keys.claude.models-thinking-dynamic-allowed
  - api-keys.claude.models-thinking-levels
  - api-keys.claude.models-thinking-max
  - api-keys.claude.models-thinking-min
  - api-keys.claude.models-thinking-zero-allowed
  - api-keys.codex.models-thinking-dynamic-allowed
  - api-keys.codex.models-thinking-levels
  - api-keys.codex.models-thinking-max
  - api-keys.codex.models-thinking-min
  - api-keys.codex.models-thinking-zero-allowed
  - api-keys.gemini.models-thinking-dynamic-allowed
  - api-keys.gemini.models-thinking-levels
  - api-keys.gemini.models-thinking-max
  - api-keys.gemini.models-thinking-min
  - api-keys.gemini.models-thinking-zero-allowed
  - api-keys.interactions.models-thinking-dynamic-allowed
  - api-keys.interactions.models-thinking-levels
  - api-keys.interactions.models-thinking-max
  - api-keys.interactions.models-thinking-min
  - api-keys.interactions.models-thinking-zero-allowed
  - api-keys.meta.models-thinking-dynamic-allowed
  - api-keys.meta.models-thinking-levels
  - api-keys.meta.models-thinking-max
  - api-keys.meta.models-thinking-min
  - api-keys.meta.models-thinking-zero-allowed
  - api-keys.openai-compatibility.models-thinking-dynamic-allowed
  - api-keys.openai-compatibility.models-thinking-levels
  - api-keys.openai-compatibility.models-thinking-max
  - api-keys.openai-compatibility.models-thinking-min
  - api-keys.openai-compatibility.models-thinking-zero-allowed
  - api-keys.vertex.models-thinking-dynamic-allowed
  - api-keys.vertex.models-thinking-levels
  - api-keys.vertex.models-thinking-max
  - api-keys.vertex.models-thinking-min
  - api-keys.vertex.models-thinking-zero-allowed
  - api-keys.xai.models-thinking-dynamic-allowed
  - api-keys.xai.models-thinking-levels
  - api-keys.xai.models-thinking-max
  - api-keys.xai.models-thinking-min
  - api-keys.xai.models-thinking-zero-allowed
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 模型思考能力

## 1. 这段解决什么问题

每个上游 API 密钥组可以为自己的模型声明思考能力：离散等级，或一个 token 预算区间，以及是否允许用 0 关闭、用 -1 交给上游动态分配。代理按这份声明校验和夹紧客户端提出的思考量。

## 2. 适用条件与不做的事

字段写在 `api-keys.<提供商>[].models[].thinking`，提供商是 claude、codex、gemini、interactions、meta、openai-compatibility、vertex 和 xai。它描述模型能力，不是请求里的当次预算。模型名括号后缀不属于本页。OAuth 目录里的内置模型能力也不由这些键逐项覆盖，除非同一上游名被写进这里的显式 `thinking` 对象。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  gemini:
    - name: gemini-1
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
      models:
        - name: "gemini-2.5-flash"
          alias: "gemini-flash"
          thinking:
            levels: ["high", "medium", "low", "none", "auto"]
        - name: "gemini-2.5-pro"
          alias: "gemini-pro"
          thinking:
            min: 1024
            max: 32768
            zero-allowed: true
            dynamic-allowed: true
  openai-compatibility:
    - name: compatible
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
      models:
        - name: "upstream-model"
          alias: "client-model"
          thinking:
            levels: ["low", "medium", "high"]
```

预算模型用 `min`、`max`、`zero-allowed` 和 `dynamic-allowed` 替换 `levels`，不要把等级和预算窗口写成同一套有效能力。示例里的 1024 与 32768 只是示例值，不是这些键的默认值。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.models.thinking.dynamic-allowed | 是否允许预算 -1，表示动态思考预算。 | false | levels 含 auto 时规范化会把它设为 true。为 false 时，auto 不再保持 -1：只有等级的模型改为 medium；有预算范围的模型改为 (min+max)/2。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.claude.models.thinking.levels | 该模型允许的离散推理等级。 | nil | 非空时按等级而不是 token 预算。值会去掉空白、转成小写并去重；空字符串丢弃。none 同时打开 zero-allowed，auto 同时打开 dynamic-allowed。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.claude.models.thinking.max | 思考预算的上限，含该值。 | 0 | min 与 max 都是 0 时，同家族严格预算检查不建立数值窗口。只要 min 或 max 有一个不是 0，包括两者同时不是 0，来自请求体的同家族预算若超出闭区间，或预算为 0 且 zero-allowed 为 false，都返回 BUDGET_OUT_OF_RANGE。0 落在闭区间内也不能豁免后一种情况。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.claude.models.thinking.min | 思考预算的下限，含该值。 | 0 | min 与 max 都是 0 时，同家族严格预算检查不建立数值窗口。只要 min 或 max 有一个不是 0，包括两者同时不是 0，来自请求体的同家族预算若超出闭区间，或预算为 0 且 zero-allowed 为 false，都返回 BUDGET_OUT_OF_RANGE。0 落在闭区间内也不能豁免后一种情况。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.claude.models.thinking.zero-allowed | 是否允许预算 0，用来关闭思考。 | false | levels 含 none 时规范化会把它设为 true。既不允许 0、levels 里也没有 none 的模型不能保持完全关闭。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.codex.models.thinking.dynamic-allowed | 是否允许预算 -1，表示动态思考预算。 | false | levels 含 auto 时规范化会把它设为 true。为 false 时，auto 不再保持 -1：只有等级的模型改为 medium；有预算范围的模型改为 (min+max)/2。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.codex.models.thinking.levels | 该模型允许的离散推理等级。 | nil | 非空时按等级而不是 token 预算。值会去掉空白、转成小写并去重；空字符串丢弃。none 同时打开 zero-allowed，auto 同时打开 dynamic-allowed。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.codex.models.thinking.max | 思考预算的上限，含该值。 | 0 | min 与 max 都是 0 时，同家族严格预算检查不建立数值窗口。只要 min 或 max 有一个不是 0，包括两者同时不是 0，来自请求体的同家族预算若超出闭区间，或预算为 0 且 zero-allowed 为 false，都返回 BUDGET_OUT_OF_RANGE。0 落在闭区间内也不能豁免后一种情况。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.codex.models.thinking.min | 思考预算的下限，含该值。 | 0 | min 与 max 都是 0 时，同家族严格预算检查不建立数值窗口。只要 min 或 max 有一个不是 0，包括两者同时不是 0，来自请求体的同家族预算若超出闭区间，或预算为 0 且 zero-allowed 为 false，都返回 BUDGET_OUT_OF_RANGE。0 落在闭区间内也不能豁免后一种情况。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.codex.models.thinking.zero-allowed | 是否允许预算 0，用来关闭思考。 | false | levels 含 none 时规范化会把它设为 true。既不允许 0、levels 里也没有 none 的模型不能保持完全关闭。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.gemini.models.thinking.dynamic-allowed | 是否允许预算 -1，表示动态思考预算。 | false | levels 含 auto 时规范化会把它设为 true。为 false 时，auto 不再保持 -1：只有等级的模型改为 medium；有预算范围的模型改为 (min+max)/2。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.gemini.models.thinking.levels | 该模型允许的离散推理等级。 | nil | 非空时按等级而不是 token 预算。值会去掉空白、转成小写并去重；空字符串丢弃。none 同时打开 zero-allowed，auto 同时打开 dynamic-allowed。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.gemini.models.thinking.max | 思考预算的上限，含该值。 | 0 | min 与 max 都是 0 时，同家族严格预算检查不建立数值窗口。只要 min 或 max 有一个不是 0，包括两者同时不是 0，来自请求体的同家族预算若超出闭区间，或预算为 0 且 zero-allowed 为 false，都返回 BUDGET_OUT_OF_RANGE。0 落在闭区间内也不能豁免后一种情况。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.gemini.models.thinking.min | 思考预算的下限，含该值。 | 0 | min 与 max 都是 0 时，同家族严格预算检查不建立数值窗口。只要 min 或 max 有一个不是 0，包括两者同时不是 0，来自请求体的同家族预算若超出闭区间，或预算为 0 且 zero-allowed 为 false，都返回 BUDGET_OUT_OF_RANGE。0 落在闭区间内也不能豁免后一种情况。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.gemini.models.thinking.zero-allowed | 是否允许预算 0，用来关闭思考。 | false | levels 含 none 时规范化会把它设为 true。既不允许 0、levels 里也没有 none 的模型不能保持完全关闭。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.interactions.models.thinking.dynamic-allowed | 是否允许预算 -1，表示动态思考预算。 | false | levels 含 auto 时规范化会把它设为 true。为 false 时，auto 不再保持 -1：只有等级的模型改为 medium；有预算范围的模型改为 (min+max)/2。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.interactions.models.thinking.levels | 该模型允许的离散推理等级。 | nil | 非空时按等级而不是 token 预算。值会去掉空白、转成小写并去重；空字符串丢弃。none 同时打开 zero-allowed，auto 同时打开 dynamic-allowed。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.interactions.models.thinking.max | 思考预算的上限，含该值。 | 0 | min 与 max 都是 0 时，同家族严格预算检查不建立数值窗口。只要 min 或 max 有一个不是 0，包括两者同时不是 0，来自请求体的同家族预算若超出闭区间，或预算为 0 且 zero-allowed 为 false，都返回 BUDGET_OUT_OF_RANGE。0 落在闭区间内也不能豁免后一种情况。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.interactions.models.thinking.min | 思考预算的下限，含该值。 | 0 | min 与 max 都是 0 时，同家族严格预算检查不建立数值窗口。只要 min 或 max 有一个不是 0，包括两者同时不是 0，来自请求体的同家族预算若超出闭区间，或预算为 0 且 zero-allowed 为 false，都返回 BUDGET_OUT_OF_RANGE。0 落在闭区间内也不能豁免后一种情况。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.interactions.models.thinking.zero-allowed | 是否允许预算 0，用来关闭思考。 | false | levels 含 none 时规范化会把它设为 true。既不允许 0、levels 里也没有 none 的模型不能保持完全关闭。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.meta.models.thinking.dynamic-allowed | 是否允许预算 -1，表示动态思考预算。 | false | levels 含 auto 时规范化会把它设为 true。为 false 时，auto 不再保持 -1：只有等级的模型改为 medium；有预算范围的模型改为 (min+max)/2。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.meta.models.thinking.levels | 该模型允许的离散推理等级。 | nil | 非空时按等级而不是 token 预算。值会去掉空白、转成小写并去重；空字符串丢弃。none 同时打开 zero-allowed，auto 同时打开 dynamic-allowed。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.meta.models.thinking.max | 思考预算的上限，含该值。 | 0 | min 与 max 都是 0 时，同家族严格预算检查不建立数值窗口。只要 min 或 max 有一个不是 0，包括两者同时不是 0，来自请求体的同家族预算若超出闭区间，或预算为 0 且 zero-allowed 为 false，都返回 BUDGET_OUT_OF_RANGE。0 落在闭区间内也不能豁免后一种情况。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.meta.models.thinking.min | 思考预算的下限，含该值。 | 0 | min 与 max 都是 0 时，同家族严格预算检查不建立数值窗口。只要 min 或 max 有一个不是 0，包括两者同时不是 0，来自请求体的同家族预算若超出闭区间，或预算为 0 且 zero-allowed 为 false，都返回 BUDGET_OUT_OF_RANGE。0 落在闭区间内也不能豁免后一种情况。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.meta.models.thinking.zero-allowed | 是否允许预算 0，用来关闭思考。 | false | levels 含 none 时规范化会把它设为 true。既不允许 0、levels 里也没有 none 的模型不能保持完全关闭。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.openai-compatibility.models.thinking.dynamic-allowed | 是否允许预算 -1，表示动态思考预算。 | false | levels 含 auto 时规范化会把它设为 true。为 false 时，auto 不再保持 -1：只有等级的模型改为 medium；有预算范围的模型改为 (min+max)/2。非图像的 OpenAI 兼容模型如果整段省略 thinking，登记时使用 low、medium、high。图像模型不会得到这段省略默认。显式 thinking 对象会替换静态模型元数据。 |
| api-keys.openai-compatibility.models.thinking.levels | 该模型允许的离散推理等级。 | nil | 非空时按等级而不是 token 预算。值会去掉空白、转成小写并去重；空字符串丢弃。none 同时打开 zero-allowed，auto 同时打开 dynamic-allowed。非图像的 OpenAI 兼容模型如果整段省略 thinking，登记时使用 low、medium、high。图像模型不会得到这段省略默认。显式 thinking 对象会替换静态模型元数据。 |
| api-keys.openai-compatibility.models.thinking.max | 思考预算的上限，含该值。 | 0 | min 与 max 都是 0 时，同家族严格预算检查不建立数值窗口。只要 min 或 max 有一个不是 0，包括两者同时不是 0，来自请求体的同家族预算若超出闭区间，或预算为 0 且 zero-allowed 为 false，都返回 BUDGET_OUT_OF_RANGE。0 落在闭区间内也不能豁免后一种情况。非图像的 OpenAI 兼容模型如果整段省略 thinking，登记时使用 low、medium、high。图像模型不会得到这段省略默认。显式 thinking 对象会替换静态模型元数据。 |
| api-keys.openai-compatibility.models.thinking.min | 思考预算的下限，含该值。 | 0 | min 与 max 都是 0 时，同家族严格预算检查不建立数值窗口。只要 min 或 max 有一个不是 0，包括两者同时不是 0，来自请求体的同家族预算若超出闭区间，或预算为 0 且 zero-allowed 为 false，都返回 BUDGET_OUT_OF_RANGE。0 落在闭区间内也不能豁免后一种情况。非图像的 OpenAI 兼容模型如果整段省略 thinking，登记时使用 low、medium、high。图像模型不会得到这段省略默认。显式 thinking 对象会替换静态模型元数据。 |
| api-keys.openai-compatibility.models.thinking.zero-allowed | 是否允许预算 0，用来关闭思考。 | false | levels 含 none 时规范化会把它设为 true。既不允许 0、levels 里也没有 none 的模型不能保持完全关闭。非图像的 OpenAI 兼容模型如果整段省略 thinking，登记时使用 low、medium、high。图像模型不会得到这段省略默认。显式 thinking 对象会替换静态模型元数据。 |
| api-keys.vertex.models.thinking.dynamic-allowed | 是否允许预算 -1，表示动态思考预算。 | false | levels 含 auto 时规范化会把它设为 true。为 false 时，auto 不再保持 -1：只有等级的模型改为 medium；有预算范围的模型改为 (min+max)/2。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.vertex.models.thinking.levels | 该模型允许的离散推理等级。 | nil | 非空时按等级而不是 token 预算。值会去掉空白、转成小写并去重；空字符串丢弃。none 同时打开 zero-allowed，auto 同时打开 dynamic-allowed。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.vertex.models.thinking.max | 思考预算的上限，含该值。 | 0 | min 与 max 都是 0 时，同家族严格预算检查不建立数值窗口。只要 min 或 max 有一个不是 0，包括两者同时不是 0，来自请求体的同家族预算若超出闭区间，或预算为 0 且 zero-allowed 为 false，都返回 BUDGET_OUT_OF_RANGE。0 落在闭区间内也不能豁免后一种情况。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.vertex.models.thinking.min | 思考预算的下限，含该值。 | 0 | min 与 max 都是 0 时，同家族严格预算检查不建立数值窗口。只要 min 或 max 有一个不是 0，包括两者同时不是 0，来自请求体的同家族预算若超出闭区间，或预算为 0 且 zero-allowed 为 false，都返回 BUDGET_OUT_OF_RANGE。0 落在闭区间内也不能豁免后一种情况。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.vertex.models.thinking.zero-allowed | 是否允许预算 0，用来关闭思考。 | false | levels 含 none 时规范化会把它设为 true。既不允许 0、levels 里也没有 none 的模型不能保持完全关闭。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.xai.models.thinking.dynamic-allowed | 是否允许预算 -1，表示动态思考预算。 | false | levels 含 auto 时规范化会把它设为 true。为 false 时，auto 不再保持 -1：只有等级的模型改为 medium；有预算范围的模型改为 (min+max)/2。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.xai.models.thinking.levels | 该模型允许的离散推理等级。 | nil | 非空时按等级而不是 token 预算。值会去掉空白、转成小写并去重；空字符串丢弃。none 同时打开 zero-allowed，auto 同时打开 dynamic-allowed。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.xai.models.thinking.max | 思考预算的上限，含该值。 | 0 | min 与 max 都是 0 时，同家族严格预算检查不建立数值窗口。只要 min 或 max 有一个不是 0，包括两者同时不是 0，来自请求体的同家族预算若超出闭区间，或预算为 0 且 zero-allowed 为 false，都返回 BUDGET_OUT_OF_RANGE。0 落在闭区间内也不能豁免后一种情况。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.xai.models.thinking.min | 思考预算的下限，含该值。 | 0 | min 与 max 都是 0 时，同家族严格预算检查不建立数值窗口。只要 min 或 max 有一个不是 0，包括两者同时不是 0，来自请求体的同家族预算若超出闭区间，或预算为 0 且 zero-allowed 为 false，都返回 BUDGET_OUT_OF_RANGE。0 落在闭区间内也不能豁免后一种情况。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |
| api-keys.xai.models.thinking.zero-allowed | 是否允许预算 0，用来关闭思考。 | false | levels 含 none 时规范化会把它设为 true。既不允许 0、levels 里也没有 none 的模型不能保持完全关闭。显式 thinking 对象会替换该上游模型名上的静态思考元数据。省略对象时，仍可能保留静态目录里的能力。 |

## 5. 常见错误与边界

同一提供商家族、思考量来自请求体而不是模型名后缀，且 `min` 或 `max` 不是 0（两者同时非 0 也算）时，预算越出闭区间，或预算为 0 且 `zero-allowed` 为 false，都会返回 `BUDGET_OUT_OF_RANGE`。只设置 `max`、`min` 仍为 0 且不允许 0 时，预算 0 仍被拒绝。请求的等级不在 `levels` 中，并且不能夹到支持的等级时，返回 `LEVEL_NOT_SUPPORTED`。`min` 和 `max` 同时为 0 不会因此被拒绝，它只是不建立数值窗口。`dynamic-allowed: false` 不会拒绝 auto，而是改成 medium 或预算中点。

## 6. 相关功能

这些 ID 的导读页是 [思考量设置](/cn/configuration/thinking)。模型别名见 [上游模型别名](/cn/accounts/api-keys-models)。用规则改最终 JSON 见 [覆盖载荷规则](/cn/routing/requests-override)。

## 7. 使用经验

暂无
