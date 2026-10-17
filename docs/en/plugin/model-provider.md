---
title: Model Provider
feature_ids:
  - plugin.model-provider.static-models
  - plugin.model-provider.models-for-auth
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Model Provider

`ModelProvider` supplies static models and models discovered from one credential.

## 1. What this solves

The static list does not depend on a login credential. `ModelsForAuth` uses that credential to query the provider for models and can also hand back an updated credential.

## 2. Scope and non-goals

Both methods must be implemented. One-time registration during development is [Model Registrar](/plugin/model-registrar), not this interface. This interface does not execute chat requests.

If the same plugin also has an executor, `executor_model_scope` decides which side is available for static models and OAuth credential models: `static`, `oauth`, or `both`. An empty value is treated as `both`. That field belongs to executor registration. See [Executor](/plugin/executor).

## 3. How to configure or call it

Set `capabilities.model_provider` to true.

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-model-provider",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-model-provider"
    },
    "capabilities": {
      "model_provider": true
    }
  }
}
```

```go
StaticModels(context.Context, StaticModelRequest) (ModelResponse, error)
ModelsForAuth(context.Context, AuthModelRequest) (ModelResponse, error)
```

The ABI method names are `model.static` and `model.for_auth`. Fields without a tag use the Go exported name. `[]byte` is base64.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.model-provider.static-models | `StaticModels`, ABI `model.static`. |  | Parameter `StaticModelRequest`, return `ModelResponse`. |
| plugin.model-provider.models-for-auth | `ModelsForAuth`, ABI `model.for_auth`. |  | Parameter `AuthModelRequest`, return `ModelResponse`. |
| StaticModelRequest.Plugin | Plugin metadata. |  | `Metadata`. |
| StaticModelRequest.Host | Host configuration summary. |  | `AuthDir`, `ProxyURL`, `ForceModelPrefix`, `OAuthModelAlias`, `ExcludedModels`. |
| AuthModelRequest.Plugin | Plugin metadata. |  | `Metadata`. |
| AuthModelRequest.AuthID | Credential ID used for discovery. |  | String. |
| AuthModelRequest.AuthProvider | Credential provider. |  | String. |
| AuthModelRequest.StorageJSON | Plugin persisted data. |  | `[]byte`. |
| AuthModelRequest.Metadata | Host-mutable metadata. |  | `map[string]any`. |
| AuthModelRequest.Attributes | Immutable attributes. |  | `map[string]string`. |
| AuthModelRequest.Host | Host configuration summary. |  | `HostConfigSummary`. |
| AuthModelRequest.HTTPClient | Host HTTP client. |  | Ignored by JSON. See [Host Callbacks](/plugin/host-callbacks). |
| ModelResponse.Provider | Provider that owns the models. |  | String. |
| ModelResponse.Models | Complete discovered model set. |  | `[]ModelInfo`. The fields are the same `ModelInfo` as in [Model Registrar](/plugin/model-registrar). |
| ModelResponse.AuthUpdate | Credential that discovery needs to write back. |  | `AuthData`. Keep it empty when no update is needed. |

## 5. Common errors and limits

When `error` is returned, ABI `ok` is false. When `http_status` is omitted or 0, it is treated as HTTP 500.

`Models` is the complete set. `HTTPClient` does not enter JSON.

## 6. Related behavior

One-time registration is in [Model Registrar](/plugin/model-registrar). The credential shape is in [Credential Provider](/plugin/auth-provider).

## 7. Field experience

None yet.

