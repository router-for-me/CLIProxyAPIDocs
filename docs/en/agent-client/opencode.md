---
title: OpenCode
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# OpenCode

This page explains how to point the base URL and access key of OpenCode's built-in OpenAI provider at this proxy, and which registered endpoints that provider calls.

## 1. What this solves

OpenCode's `openai` provider uses an OpenAI-compatible model catalog and Chat Completions by default. After `baseURL` and `apiKey` point at this proxy, both kinds of request enter the registered `/v1` routes.

## 2. Scope and non-goals

This page changes only the built-in `openai` provider in `~/.config/opencode/opencode.json`. Create the file if it does not exist. It does not configure the Anthropic provider, and it does not switch this provider to Responses.

The key acceptance order is in [Client API keys](/api/access). The model must be an ID that already appears in the current catalog. This page does not install an extra npm provider.

## 3. How to configure or call it

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openai": {
      "options": {
        "baseURL": "https://example.invalid/v1",
        "apiKey": "YOUR_API_KEY"
      }
    }
  }
}
```

`baseURL` must include `/v1`. `apiKey` must be a configured client key. OpenCode places it in `Authorization: Bearer YOUR_API_KEY`.

This provider calls:

| Method and path | route ID |
| --- | --- |
| `GET /v1/models` | `route.v1.get-models` |
| `POST /v1/chat/completions` | `route.v1.post-chat-completions` |

When there is no `Anthropic-Version`, `User-Agent` does not have the `claude-cli` prefix and does not contain `grok-shell`, and the query string has no `client_version`, `GET /v1/models` returns the OpenAI list.

## 4. Details

These fields belong to OpenCode. They are not YAML keys of this proxy.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| `provider.openai.options.baseURL` | Base URL of the OpenAI provider. |  | Write `https://example.invalid/v1`. The client appends `/models` and `/chat/completions`. |
| `provider.openai.options.apiKey` | Client key sent to this proxy. |  | The value is `YOUR_API_KEY`. This proxy treats it as the token in `Authorization`. |
| `model` | Optional default model ID. |  | If set, it must be a registered model ID. This page does not name a specific one. |

`X-Session-Affinity` sent by OpenCode is recognized as an OpenCode session. It is not a route. It only takes part in session affinity.

## 5. Common errors and limits

If no key is sent, the response is 401 with the body `{"error":"Missing API key"}`. If the key does not match, the response is 401 with the body `{"error":"Invalid API key"}`. When `access.api-keys` is empty, the check is skipped. When sample-key safe mode matches, `/v1` returns 403.

If `baseURL` omits `/v1` or adds an extra `/v1`, the assembled path is not a registered path in the table above. `POST /v1/chat/completions` returns SSE only for the JSON boolean `stream: true`. If there is no `messages` but there is `input` or `instructions`, the request is converted to Chat Completions before it runs.

This configuration does not call `POST /v1/messages` or `POST /v1/responses`.

## 6. Related behavior

The key is in [Client API keys](/api/access). The model list and Chat Completions are in [OpenAI Chat](/api/openai-chat). Session affinity is in [Routing strategy](/routing/strategy).

## 7. Field experience

None yet.
