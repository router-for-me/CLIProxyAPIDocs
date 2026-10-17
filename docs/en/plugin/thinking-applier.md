---
title: Thinking Applier
feature_ids:
  - plugin.thinking-applier.identifier
  - plugin.thinking-applier.apply-thinking
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Thinking Applier

`ThinkingApplier` writes an already normalized thinking configuration into the provider payload.

## 1. What this solves

After the host finishes parsing the thinking mode, the plugin rewrites the provider fields in the body according to its own provider key.

## 2. Scope and non-goals

It does not parse the thinking suffix in the user request. It only receives an already normalized `ThinkingConfig`. The only modes are the four canonical values `budget`, `level`, `none`, and `auto`.

## 3. How to configure or call it

Set `capabilities.thinking_applier` to true.

```go
Identifier() string
ApplyThinking(context.Context, ThinkingApplyRequest) (PayloadResponse, error)
```

The ABI method names are `thinking.identifier` and `thinking.apply`. The identifier result field is `identifier`, and it should return the provider key handled by this applier.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.thinking-applier.identifier | `Identifier`, ABI `thinking.identifier`. |  | No parameters. Returns the provider key. Failure or blank is treated as an empty string. |
| plugin.thinking-applier.apply-thinking | `ApplyThinking`, ABI `thinking.apply`. |  | Parameter `ThinkingApplyRequest`, return `PayloadResponse`. |
| ThinkingApplyRequest.Provider | Provider key being applied. |  | Already normalized. |
| ThinkingApplyRequest.Model | Associated model. |  | `ModelInfo`. Fields are in [Model Registrar](/plugin/model-registrar). |
| ThinkingApplyRequest.Config | Parsed canonical thinking configuration. |  | `Mode`, `Budget`, `Level`. |
| ThinkingApplyRequest.Body | Provider payload to rewrite. |  | `[]byte`. |
| ThinkingConfig.Mode | Canonical mode. |  | `budget`, `level`, `none`, or `auto`. |
| ThinkingConfig.Budget | Normalized token budget. |  | Integer. |
| ThinkingConfig.Level | Normalized named level. |  | String. |
| PayloadResponse.Body | Payload after the provider fields are written. |  | `[]byte`. |

## 5. Common errors and limits

When `ApplyThinking` returns `error`, ABI `ok` is false. When `http_status` is omitted or 0, it is treated as HTTP 500.

An empty identifier cannot be matched by provider. A `Mode` outside the four canonical values is not input this interface is supposed to parse again.

## 6. Related behavior

The thinking capability field `ThinkingSupport` on a model is in [Model Registrar](/plugin/model-registrar).

## 7. Field experience

None yet.

