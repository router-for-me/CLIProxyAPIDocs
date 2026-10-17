---
title: Model Registrar
feature_ids:
  - plugin.model-registrar.register-models
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Model Registrar

`ModelRegistrar` submits a set of development-time model metadata at registration.

## 1. What this solves

With one call, the plugin declares its own provider key and the complete model list so the host can register those models.

## 2. Scope and non-goals

There is only `RegisterModels`. It does not discover models from a single credential. That is `ModelsForAuth` on [Model Provider](/plugin/model-provider). It also does not execute requests.

The registration metadata `Name`, `Version`, `Author`, and `GitHubRepository` cannot be blank. The load switch is in [Plugin loading and the store](/operations/plugins).

## 3. How to configure or call it

Set `capabilities.model_registrar` to true. The current contract version is 6.

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-models",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-models"
    },
    "capabilities": {
      "model_registrar": true
    }
  }
}
```

```go
RegisterModels(context.Context, ModelRegistrationRequest) (ModelRegistrationResponse, error)
```

The ABI method name is `model.register`. Fields without a `json` tag use the Go exported name.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.model-registrar.register-models | `RegisterModels`, ABI `model.register`. |  | Parameter `ModelRegistrationRequest`, return `ModelRegistrationResponse`. |
| ModelRegistrationRequest.Plugin | Metadata of the plugin being registered. |  | `Metadata`: `Name`, `Version`, `Author`, `GitHubRepository`, `Logo`, `ConfigFields`. |
| ModelRegistrationResponse.Provider | Provider key for this set of models. |  | String. |
| ModelRegistrationResponse.Models | Complete model set supplied by the plugin. |  | `[]ModelInfo`. |
| ModelInfo.ID | Stable model ID used in requests. |  | String. |
| ModelInfo.Object | API object type, usually `model`. |  | String. |
| ModelInfo.Created | Metadata creation time. |  | Unix seconds, `int64`. |
| ModelInfo.OwnedBy | Owner or provider. |  | String. |
| ModelInfo.Type | Capability-family classification. |  | String. |
| ModelInfo.DisplayName | Display name. |  | String. |
| ModelInfo.Name | Provider-native model name. |  | String. |
| ModelInfo.Version | Revision. It may be empty. |  | String. |
| ModelInfo.Description | Short description. |  | String. |
| ModelInfo.InputTokenLimit | Maximum accepted input tokens. |  | `int64`. |
| ModelInfo.OutputTokenLimit | Maximum output tokens. |  | `int64`. |
| ModelInfo.SupportedGenerationMethods | Supported generation method names. |  | `[]string`. |
| ModelInfo.ContextLength | Upper bound of the total context length. |  | `int64`. |
| ModelInfo.MaxCompletionTokens | Maximum completion tokens. |  | `int64`. |
| ModelInfo.SupportedParameters | Supported request parameter names. |  | `[]string`. |
| ModelInfo.SupportedInputModalities | Input modalities. |  | `[]string`. |
| ModelInfo.SupportedOutputModalities | Output modalities. |  | `[]string`. |
| ModelInfo.Thinking | Optional reasoning budget. |  | `ThinkingSupport`: `Min`, `Max`, `ZeroAllowed`, `DynamicAllowed`, `Levels`. |
| ModelInfo.UserDefined | Whether it comes from user configuration. |  | Boolean. |

## 5. Common errors and limits

When the method returns `error`, the ABI envelope `ok` is false. `error.code` and `error.message` are required. When `http_status` is omitted or 0, it is treated as HTTP 500.

`Models` means the complete set, not an incremental patch.

## 6. Related behavior

Discovering models by credential is in [Model Provider](/plugin/model-provider). Actually sending the request is in [Executor](/plugin/executor).

## 7. Field experience

None yet.

