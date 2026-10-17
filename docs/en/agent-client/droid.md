---
title: Factory Droid
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Factory Droid

This page explains how to set the base URL and access key on a Factory Droid custom model, and which registered endpoint each `provider` calls.

## 1. What this solves

Droid chooses the request shape from `provider`. After the base URL points at this proxy and `apiKey` is set to the client key, Anthropic models use Messages, OpenAI Responses models use Responses, and other OpenAI-compatible models use Chat Completions. All three paths are registered routes.

## 2. Scope and non-goals

The current file is `customModels` in `~/.factory/settings.json`. This page does not maintain the old `~/.factory/config.json`.

This page does not configure Bedrock, does not set organization limits, and does not register a new model name for this proxy. `model` must be an ID that already appears in the current catalog. The key acceptance order is in [Client API keys](/api/access).

## 3. How to configure or call it

Write one entry per protocol inside `customModels`. Every `apiKey` is `YOUR_API_KEY`.

```json
{
  "customModels": [
    {
      "model": "<已登记的模型 ID>",
      "baseUrl": "https://example.invalid",
      "apiKey": "YOUR_API_KEY",
      "provider": "anthropic"
    },
    {
      "model": "<已登记的模型 ID>",
      "baseUrl": "https://example.invalid/v1",
      "apiKey": "YOUR_API_KEY",
      "provider": "openai"
    },
    {
      "model": "<已登记的模型 ID>",
      "baseUrl": "https://example.invalid/v1",
      "apiKey": "YOUR_API_KEY",
      "provider": "generic-chat-completion-api"
    }
  ]
}
```

`provider` decides the path the client appends:

| provider | Base URL | Method and path | route ID |
| --- | --- | --- | --- |
| `anthropic` | `https://example.invalid` | `POST /v1/messages` | `route.v1.post-messages` |
| `openai` | `https://example.invalid/v1` | `POST /v1/responses` | `route.v1.post-responses` |
| `generic-chat-completion-api` | `https://example.invalid/v1` | `POST /v1/chat/completions` | `route.v1.post-chat-completions` |

The `anthropic` base URL must not include `/v1`. Do not use `openai` to call Chat Completions. Use `generic-chat-completion-api` for that kind of model.

`anthropic` places `apiKey` in `X-Api-Key` by default. When the gateway requires `Authorization: Bearer`, add `"authMode": "bearer"` to that entry. This proxy accepts both headers. `openai` and `generic-chat-completion-api` use `Authorization: Bearer YOUR_API_KEY`.

## 4. Details

These fields belong to Droid's `customModels`. They are not YAML keys of this proxy.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| `model` | Model ID in the request body. |  | It must be an ID this proxy can currently route. This page does not add model names. |
| `baseUrl` | API base URL for that model entry. |  | `anthropic` uses the root `https://example.invalid`. The other two use `https://example.invalid/v1`. |
| `apiKey` | Client key sent to this proxy. |  | The value is `YOUR_API_KEY`. It may be omitted, but if this proxy still has keys configured, omitting it returns 401. |
| `provider` | Chooses the request shape. |  | Use only the three values in the table above. `openai` is Responses, not Chat Completions. |
| `authMode` | Which header carries the key for `anthropic`. |  | When omitted or set to `provider-default`, the header is `X-Api-Key`. `bearer` uses `Authorization: Bearer`. This applies only to non-Bedrock `anthropic`. |

`GET /v1/models` (`route.v1.get-models`) is not a required call for these three custom models. A custom model's ID comes from the `model` field.

## 5. Common errors and limits

If no key is sent, the response is 401 with the body `{"error":"Missing API key"}`. If the key is not in `access.api-keys`, the response is 401 with the body `{"error":"Invalid API key"}`. When the list is empty, the check is skipped.

If the `anthropic` base URL is written as `https://example.invalid/v1`, the client appends `/v1/messages` again and the result is not the registered `POST /v1/messages`. If the `openai` base URL omits `/v1`, it does not land on `POST /v1/responses` either.

`POST /v1/messages` treats a missing `stream`, or the JSON boolean `false`, as one JSON body. `POST /v1/responses` returns SSE only for the JSON boolean `stream: true`. `POST /v1/chat/completions` likewise treats only the JSON boolean `true` as streaming. If there is no `messages` but there is `input` or `instructions`, the request is converted to Chat Completions first.

When sample-key safe mode matches, these `/v1` paths return 403 before the handler runs.

## 6. Related behavior

The key is in [Client API keys](/api/access). Messages are in [Claude Messages](/api/claude-messages). Responses are in [Responses](/api/responses). Chat Completions are in [OpenAI Chat](/api/openai-chat).

## 7. Field experience

None yet.
