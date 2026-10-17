---
title: Model Router
feature_ids:
  - plugin.model-router.route-model
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Model Router

`ModelRouter` decides who executes the request before model-to-provider resolution and credential selection.

## 1. What this solves

The plugin can name its own executor, another plugin executor, or an existing built-in provider as the target of this request.

## 2. Scope and non-goals

There is only `RouteModel`. It does not replace the executor itself. When the target is `self`, this plugin still needs an [Executor](/plugin/executor). It also does not pick an ID from candidate credentials. That is [Scheduler](/plugin/scheduler).

## 3. How to configure or call it

Set `capabilities.model_router` to true.

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-router",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-router"
    },
    "capabilities": {
      "model_router": true
    }
  }
}
```

```go
RouteModel(context.Context, ModelRouteRequest) (ModelRouteResponse, error)
```

The ABI method name is `model.route`. When `Handled` is true, `TargetKind` must be `self`, `executor`, or `provider`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.model-router.route-model | `RouteModel`, ABI `model.route`. |  | Parameter `ModelRouteRequest`, return `ModelRouteResponse`. |
| ModelRouteRequest.Plugin | Plugin metadata. |  | `Metadata`. |
| ModelRouteRequest.PluginID | Host-local plugin ID. |  | String. |
| ModelRouteRequest.SourceFormat | Original client protocol. |  | String. |
| ModelRouteRequest.RequestedModel | Client model before a provider and a credential are selected. |  | String. |
| ModelRouteRequest.Stream | Whether streaming output is expected. |  | Boolean. |
| ModelRouteRequest.Headers | Inbound headers. |  | `http.Header`. |
| ModelRouteRequest.Query | Query parameters. |  | `url.Values`. |
| ModelRouteRequest.Body | Original client body. |  | `[]byte`, base64 in JSON. |
| ModelRouteRequest.Metadata | Context snapshot. |  | Read-only, understood as JSON values. |
| ModelRouteRequest.AvailableProviders | Built-in provider keys that currently have registered credentials. |  | Read-only. When `TargetKind` is `provider`, the target may be chosen from this list. |
| ModelRouteResponse.Handled | Whether a routing decision was made. |  | Not adopted when false. |
| ModelRouteResponse.TargetKind | Target kind. |  | `self`, `executor`, `provider`. Any other value is invalid. |
| ModelRouteResponse.Target | Target. |  | For `executor` it is a plugin ID. For `provider` it is a provider key, and blank is invalid. `self` uses the current router plugin ID. |
| ModelRouteResponse.TargetModel | Model name on the provider path. |  | Meaningful only for `provider`. Empty keeps the model requested by the client. |
| ModelRouteResponse.Reason | Optional diagnostic reason. |  | String. |

## 5. Common errors and limits

When the method returns `error`, that routing attempt fails. When ABI `http_status` is omitted or 0, it is treated as HTTP 500.

`Handled` true with a kind other than the three, or a blank `Target` for `executor` or `provider`, is not a valid decision. A `provider` target key has surrounding whitespace removed and is converted to lowercase.

## 6. Related behavior

Execution is in [Executor](/plugin/executor). Credential selection is in [Scheduler](/plugin/scheduler).

## 7. Field experience

None yet.

