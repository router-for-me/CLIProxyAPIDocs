---
title: Model thinking
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
translation_pending: false
---

# Model thinking

## 1. What this solves

Each upstream API-key group can declare thinking capability for its own models: discrete levels, or a token-budget range, and whether 0 may turn it off or -1 may leave allocation to the upstream. The proxy validates and clamps the thinking amount proposed by the client against this declaration.

## 2. Scope and non-goals

The fields are written at `api-keys.<provider>[].models[].thinking`. The providers are claude, codex, gemini, interactions, meta, openai-compatibility, vertex, and xai. This describes model capability, not the budget of one request. A parenthetical suffix on the model name is not on this page. Built-in model capability in the OAuth catalog is not overridden item by item by these keys, unless the same upstream name is written into an explicit `thinking` object here.

## 3. How to configure or call it

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

A budget model replaces `levels` with `min`, `max`, `zero-allowed`, and `dynamic-allowed`. Do not write levels and a budget window as the same effective capability. The 1024 and 32768 in the example are only example values. They are not the defaults of these keys.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.models.thinking.dynamic-allowed | Whether a budget of -1 is allowed, meaning a dynamic thinking budget. | false | When levels contains auto, normalization sets this to true. When false, auto no longer stays -1: a levels-only model becomes medium, and a model with a budget range becomes (min+max)/2. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.claude.models.thinking.levels | Discrete reasoning levels this model allows. | nil | When non-empty, levels are used instead of a token budget. Values are trimmed, lowercased, and deduplicated. An empty string is dropped. none also turns on zero-allowed, and auto also turns on dynamic-allowed. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.claude.models.thinking.max | Upper bound of the thinking budget, inclusive. | 0 | When min and max are both 0, the strict same-family budget check does not build a numeric window. If either min or max is not 0, including when both are not 0, a same-family budget that still comes from the request body and is still in budget mode returns BUDGET_OUT_OF_RANGE when it is outside the closed interval. A budget of 0 leaves budget mode first, so it does not return this error. A non-Claude target that does not allow 0 changes it to min and logs a warning. If min is still 0, the result is still 0. A Claude target keeps budget 0 when thinking is turned off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.claude.models.thinking.min | Lower bound of the thinking budget, inclusive. | 0 | When min and max are both 0, the strict same-family budget check does not build a numeric window. If either min or max is not 0, including when both are not 0, a same-family budget that still comes from the request body and is still in budget mode returns BUDGET_OUT_OF_RANGE when it is outside the closed interval. A budget of 0 leaves budget mode first, so it does not return this error. A non-Claude target that does not allow 0 changes it to min and logs a warning. If min is still 0, the result is still 0. A Claude target keeps budget 0 when thinking is turned off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.claude.models.thinking.zero-allowed | Whether a budget of 0 is allowed, used to turn thinking off. | false | When levels contains none, normalization sets this to true. A model that neither allows 0 nor has none in levels cannot stay fully off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.codex.models.thinking.dynamic-allowed | Whether a budget of -1 is allowed, meaning a dynamic thinking budget. | false | When levels contains auto, normalization sets this to true. When false, auto no longer stays -1: a levels-only model becomes medium, and a model with a budget range becomes (min+max)/2. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.codex.models.thinking.levels | Discrete reasoning levels this model allows. | nil | When non-empty, levels are used instead of a token budget. Values are trimmed, lowercased, and deduplicated. An empty string is dropped. none also turns on zero-allowed, and auto also turns on dynamic-allowed. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.codex.models.thinking.max | Upper bound of the thinking budget, inclusive. | 0 | When min and max are both 0, the strict same-family budget check does not build a numeric window. If either min or max is not 0, including when both are not 0, a same-family budget that still comes from the request body and is still in budget mode returns BUDGET_OUT_OF_RANGE when it is outside the closed interval. A budget of 0 leaves budget mode first, so it does not return this error. A non-Claude target that does not allow 0 changes it to min and logs a warning. If min is still 0, the result is still 0. A Claude target keeps budget 0 when thinking is turned off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.codex.models.thinking.min | Lower bound of the thinking budget, inclusive. | 0 | When min and max are both 0, the strict same-family budget check does not build a numeric window. If either min or max is not 0, including when both are not 0, a same-family budget that still comes from the request body and is still in budget mode returns BUDGET_OUT_OF_RANGE when it is outside the closed interval. A budget of 0 leaves budget mode first, so it does not return this error. A non-Claude target that does not allow 0 changes it to min and logs a warning. If min is still 0, the result is still 0. A Claude target keeps budget 0 when thinking is turned off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.codex.models.thinking.zero-allowed | Whether a budget of 0 is allowed, used to turn thinking off. | false | When levels contains none, normalization sets this to true. A model that neither allows 0 nor has none in levels cannot stay fully off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.gemini.models.thinking.dynamic-allowed | Whether a budget of -1 is allowed, meaning a dynamic thinking budget. | false | When levels contains auto, normalization sets this to true. When false, auto no longer stays -1: a levels-only model becomes medium, and a model with a budget range becomes (min+max)/2. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.gemini.models.thinking.levels | Discrete reasoning levels this model allows. | nil | When non-empty, levels are used instead of a token budget. Values are trimmed, lowercased, and deduplicated. An empty string is dropped. none also turns on zero-allowed, and auto also turns on dynamic-allowed. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.gemini.models.thinking.max | Upper bound of the thinking budget, inclusive. | 0 | When min and max are both 0, the strict same-family budget check does not build a numeric window. If either min or max is not 0, including when both are not 0, a same-family budget that still comes from the request body and is still in budget mode returns BUDGET_OUT_OF_RANGE when it is outside the closed interval. A budget of 0 leaves budget mode first, so it does not return this error. A non-Claude target that does not allow 0 changes it to min and logs a warning. If min is still 0, the result is still 0. A Claude target keeps budget 0 when thinking is turned off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.gemini.models.thinking.min | Lower bound of the thinking budget, inclusive. | 0 | When min and max are both 0, the strict same-family budget check does not build a numeric window. If either min or max is not 0, including when both are not 0, a same-family budget that still comes from the request body and is still in budget mode returns BUDGET_OUT_OF_RANGE when it is outside the closed interval. A budget of 0 leaves budget mode first, so it does not return this error. A non-Claude target that does not allow 0 changes it to min and logs a warning. If min is still 0, the result is still 0. A Claude target keeps budget 0 when thinking is turned off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.gemini.models.thinking.zero-allowed | Whether a budget of 0 is allowed, used to turn thinking off. | false | When levels contains none, normalization sets this to true. A model that neither allows 0 nor has none in levels cannot stay fully off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.interactions.models.thinking.dynamic-allowed | Whether a budget of -1 is allowed, meaning a dynamic thinking budget. | false | When levels contains auto, normalization sets this to true. When false, auto no longer stays -1: a levels-only model becomes medium, and a model with a budget range becomes (min+max)/2. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.interactions.models.thinking.levels | Discrete reasoning levels this model allows. | nil | When non-empty, levels are used instead of a token budget. Values are trimmed, lowercased, and deduplicated. An empty string is dropped. none also turns on zero-allowed, and auto also turns on dynamic-allowed. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.interactions.models.thinking.max | Upper bound of the thinking budget, inclusive. | 0 | When min and max are both 0, the strict same-family budget check does not build a numeric window. If either min or max is not 0, including when both are not 0, a same-family budget that still comes from the request body and is still in budget mode returns BUDGET_OUT_OF_RANGE when it is outside the closed interval. A budget of 0 leaves budget mode first, so it does not return this error. A non-Claude target that does not allow 0 changes it to min and logs a warning. If min is still 0, the result is still 0. A Claude target keeps budget 0 when thinking is turned off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.interactions.models.thinking.min | Lower bound of the thinking budget, inclusive. | 0 | When min and max are both 0, the strict same-family budget check does not build a numeric window. If either min or max is not 0, including when both are not 0, a same-family budget that still comes from the request body and is still in budget mode returns BUDGET_OUT_OF_RANGE when it is outside the closed interval. A budget of 0 leaves budget mode first, so it does not return this error. A non-Claude target that does not allow 0 changes it to min and logs a warning. If min is still 0, the result is still 0. A Claude target keeps budget 0 when thinking is turned off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.interactions.models.thinking.zero-allowed | Whether a budget of 0 is allowed, used to turn thinking off. | false | When levels contains none, normalization sets this to true. A model that neither allows 0 nor has none in levels cannot stay fully off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.meta.models.thinking.dynamic-allowed | Whether a budget of -1 is allowed, meaning a dynamic thinking budget. | false | When levels contains auto, normalization sets this to true. When false, auto no longer stays -1: a levels-only model becomes medium, and a model with a budget range becomes (min+max)/2. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.meta.models.thinking.levels | Discrete reasoning levels this model allows. | nil | When non-empty, levels are used instead of a token budget. Values are trimmed, lowercased, and deduplicated. An empty string is dropped. none also turns on zero-allowed, and auto also turns on dynamic-allowed. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.meta.models.thinking.max | Upper bound of the thinking budget, inclusive. | 0 | When min and max are both 0, the strict same-family budget check does not build a numeric window. If either min or max is not 0, including when both are not 0, a same-family budget that still comes from the request body and is still in budget mode returns BUDGET_OUT_OF_RANGE when it is outside the closed interval. A budget of 0 leaves budget mode first, so it does not return this error. A non-Claude target that does not allow 0 changes it to min and logs a warning. If min is still 0, the result is still 0. A Claude target keeps budget 0 when thinking is turned off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.meta.models.thinking.min | Lower bound of the thinking budget, inclusive. | 0 | When min and max are both 0, the strict same-family budget check does not build a numeric window. If either min or max is not 0, including when both are not 0, a same-family budget that still comes from the request body and is still in budget mode returns BUDGET_OUT_OF_RANGE when it is outside the closed interval. A budget of 0 leaves budget mode first, so it does not return this error. A non-Claude target that does not allow 0 changes it to min and logs a warning. If min is still 0, the result is still 0. A Claude target keeps budget 0 when thinking is turned off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.meta.models.thinking.zero-allowed | Whether a budget of 0 is allowed, used to turn thinking off. | false | When levels contains none, normalization sets this to true. A model that neither allows 0 nor has none in levels cannot stay fully off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.openai-compatibility.models.thinking.dynamic-allowed | Whether a budget of -1 is allowed, meaning a dynamic thinking budget. | false | When levels contains auto, normalization sets this to true. When false, auto no longer stays -1: a levels-only model becomes medium, and a model with a budget range becomes (min+max)/2. If a non-image OpenAI-compatible model omits the whole thinking block, registration uses low, medium, and high. An image model does not get that omission default. An explicit thinking object replaces the static model metadata. |
| api-keys.openai-compatibility.models.thinking.levels | Discrete reasoning levels this model allows. | nil | When non-empty, levels are used instead of a token budget. Values are trimmed, lowercased, and deduplicated. An empty string is dropped. none also turns on zero-allowed, and auto also turns on dynamic-allowed. If a non-image OpenAI-compatible model omits the whole thinking block, registration uses low, medium, and high. An image model does not get that omission default. An explicit thinking object replaces the static model metadata. |
| api-keys.openai-compatibility.models.thinking.max | Upper bound of the thinking budget, inclusive. | 0 | When min and max are both 0, the strict same-family budget check does not build a numeric window. If either min or max is not 0, including when both are not 0, a same-family budget that still comes from the request body and is still in budget mode returns BUDGET_OUT_OF_RANGE when it is outside the closed interval. A budget of 0 leaves budget mode first, so it does not return this error. A non-Claude target that does not allow 0 changes it to min and logs a warning. If min is still 0, the result is still 0. A Claude target keeps budget 0 when thinking is turned off. If a non-image OpenAI-compatible model omits the whole thinking block, registration uses low, medium, and high. An image model does not get that omission default. An explicit thinking object replaces the static model metadata. |
| api-keys.openai-compatibility.models.thinking.min | Lower bound of the thinking budget, inclusive. | 0 | When min and max are both 0, the strict same-family budget check does not build a numeric window. If either min or max is not 0, including when both are not 0, a same-family budget that still comes from the request body and is still in budget mode returns BUDGET_OUT_OF_RANGE when it is outside the closed interval. A budget of 0 leaves budget mode first, so it does not return this error. A non-Claude target that does not allow 0 changes it to min and logs a warning. If min is still 0, the result is still 0. A Claude target keeps budget 0 when thinking is turned off. If a non-image OpenAI-compatible model omits the whole thinking block, registration uses low, medium, and high. An image model does not get that omission default. An explicit thinking object replaces the static model metadata. |
| api-keys.openai-compatibility.models.thinking.zero-allowed | Whether a budget of 0 is allowed, used to turn thinking off. | false | When levels contains none, normalization sets this to true. A model that neither allows 0 nor has none in levels cannot stay fully off. If a non-image OpenAI-compatible model omits the whole thinking block, registration uses low, medium, and high. An image model does not get that omission default. An explicit thinking object replaces the static model metadata. |
| api-keys.vertex.models.thinking.dynamic-allowed | Whether a budget of -1 is allowed, meaning a dynamic thinking budget. | false | When levels contains auto, normalization sets this to true. When false, auto no longer stays -1: a levels-only model becomes medium, and a model with a budget range becomes (min+max)/2. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.vertex.models.thinking.levels | Discrete reasoning levels this model allows. | nil | When non-empty, levels are used instead of a token budget. Values are trimmed, lowercased, and deduplicated. An empty string is dropped. none also turns on zero-allowed, and auto also turns on dynamic-allowed. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.vertex.models.thinking.max | Upper bound of the thinking budget, inclusive. | 0 | When min and max are both 0, the strict same-family budget check does not build a numeric window. If either min or max is not 0, including when both are not 0, a same-family budget that still comes from the request body and is still in budget mode returns BUDGET_OUT_OF_RANGE when it is outside the closed interval. A budget of 0 leaves budget mode first, so it does not return this error. A non-Claude target that does not allow 0 changes it to min and logs a warning. If min is still 0, the result is still 0. A Claude target keeps budget 0 when thinking is turned off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.vertex.models.thinking.min | Lower bound of the thinking budget, inclusive. | 0 | When min and max are both 0, the strict same-family budget check does not build a numeric window. If either min or max is not 0, including when both are not 0, a same-family budget that still comes from the request body and is still in budget mode returns BUDGET_OUT_OF_RANGE when it is outside the closed interval. A budget of 0 leaves budget mode first, so it does not return this error. A non-Claude target that does not allow 0 changes it to min and logs a warning. If min is still 0, the result is still 0. A Claude target keeps budget 0 when thinking is turned off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.vertex.models.thinking.zero-allowed | Whether a budget of 0 is allowed, used to turn thinking off. | false | When levels contains none, normalization sets this to true. A model that neither allows 0 nor has none in levels cannot stay fully off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.xai.models.thinking.dynamic-allowed | Whether a budget of -1 is allowed, meaning a dynamic thinking budget. | false | When levels contains auto, normalization sets this to true. When false, auto no longer stays -1: a levels-only model becomes medium, and a model with a budget range becomes (min+max)/2. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.xai.models.thinking.levels | Discrete reasoning levels this model allows. | nil | When non-empty, levels are used instead of a token budget. Values are trimmed, lowercased, and deduplicated. An empty string is dropped. none also turns on zero-allowed, and auto also turns on dynamic-allowed. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.xai.models.thinking.max | Upper bound of the thinking budget, inclusive. | 0 | When min and max are both 0, the strict same-family budget check does not build a numeric window. If either min or max is not 0, including when both are not 0, a same-family budget that still comes from the request body and is still in budget mode returns BUDGET_OUT_OF_RANGE when it is outside the closed interval. A budget of 0 leaves budget mode first, so it does not return this error. A non-Claude target that does not allow 0 changes it to min and logs a warning. If min is still 0, the result is still 0. A Claude target keeps budget 0 when thinking is turned off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.xai.models.thinking.min | Lower bound of the thinking budget, inclusive. | 0 | When min and max are both 0, the strict same-family budget check does not build a numeric window. If either min or max is not 0, including when both are not 0, a same-family budget that still comes from the request body and is still in budget mode returns BUDGET_OUT_OF_RANGE when it is outside the closed interval. A budget of 0 leaves budget mode first, so it does not return this error. A non-Claude target that does not allow 0 changes it to min and logs a warning. If min is still 0, the result is still 0. A Claude target keeps budget 0 when thinking is turned off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |
| api-keys.xai.models.thinking.zero-allowed | Whether a budget of 0 is allowed, used to turn thinking off. | false | When levels contains none, normalization sets this to true. A model that neither allows 0 nor has none in levels cannot stay fully off. An explicit thinking object replaces the static thinking metadata on that upstream model name. When the object is omitted, a capability from the static catalog may still remain. |

## 5. Common errors and limits

When the provider family is the same, the thinking amount comes from the request body rather than a model-name suffix, and `min` or `max` is not 0 (both non-zero counts too), a budget that is still in budget mode and outside the closed interval returns `BUDGET_OUT_OF_RANGE`. A budget of 0 first becomes thinking-off, so it does not return this error. A non-Claude target is then handled by clampBudget: if 0 is not allowed, it becomes min and a warning is logged. If min is still 0, the result is still 0. A Claude target keeps budget 0 directly when thinking is turned off. If the requested level is not in `levels` and cannot be clamped to a supported level, the result is `LEVEL_NOT_SUPPORTED`. `min` and `max` both being 0 is not rejected because of that. It simply does not build a numeric window. `dynamic-allowed: false` does not reject auto. It changes it to medium or to the budget midpoint.

## 6. Related behavior

The guide page for these IDs is [Thinking settings](/configuration/thinking). Model aliases are in [Upstream model aliases](/accounts/api-keys-models). Changing the final JSON with rules is in [Override payload rules](/routing/requests-override).

## 7. Field experience

- [Chat completions stream thinking only when reasoning effort is sent](/experience/api#exp-api-chat-reasoning-effort)
- [A third-party DeepSeek does not fill OpenAI thinking fields](/experience/api#exp-api-deepseek-no-openai-thinking)
- [Forward AI Studio thinking by the upstream field](/experience/api#exp-api-gemini-thinking-field)
- [Opus effort comes from output_config.effort](/experience/api#exp-api-opus-effort-field)
- [Declare thinking levels on the model entry](/experience/configuration#exp-configuration-declare-thinking-levels)
- [A thinking level cannot be declared by filtering](/experience/configuration#exp-configuration-levels-before-filter)
- [Filter the field when the level is not allowed](/experience/configuration#exp-configuration-levels-or-filter)
- [Do not send a thinking level the model rejects](/experience/configuration#exp-configuration-reject-minimal-effort)
- [Choose a thinking level with a parenthetical suffix](/experience/configuration#exp-configuration-thinking-suffix)
- [Add extra_body with an override rule](/experience/routing#exp-routing-override-extra-body)
- [Different models use different override rules](/experience/routing#exp-routing-separate-payload-by-model)

