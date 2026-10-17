---
title: Claude Code
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Claude Code

This page explains how to point Claude Code's base URL and access key at this proxy, and which registered endpoints that configuration calls.

## 1. What this solves

Claude Code sends Anthropic-compatible requests to the official address by default. After the base URL is changed to this proxy and the access key is changed to an entry in `access.api-keys`, chat, token counting, and the model catalog all enter routes this proxy has already registered.

## 2. Scope and non-goals

This page changes only Claude Code's own environment variables. It does not create an upstream Claude credential, and it does not change this proxy's `access.api-keys`. The key acceptance order and the sample-key safe mode are in [Client API keys](/api/access).

This page does not set a permission mode, timeout, telemetry, reasoning effort, or a specific model name. The model must be an ID that already appears in the current catalog. This page also does not describe protocol conversion before a request reaches an upstream.

## 3. How to configure or call it

Edit `~/.claude/settings.json`. Do not include `/v1` in the base URL. The client appends the rest of the path itself.

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://example.invalid",
    "ANTHROPIC_AUTH_TOKEN": "YOUR_API_KEY",
    "CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY": "1"
  }
}
```

`YOUR_API_KEY` must be exactly equal to one configured client key. This proxy checks `Authorization`, `X-Goog-Api-Key`, `X-Api-Key`, and the query parameters `key` and `auth_token`, in that order, and uses the first key that is already configured. When `Authorization` starts with `Bearer` followed by a space, only the token after it is used.

With this configuration, the client calls these registered endpoints:

| Method and path | route ID |
| --- | --- |
| `POST /v1/messages` | `route.v1.post-messages` |
| `POST /v1/messages/count_tokens` | `route.v1.post-messages-count-tokens` |
| `GET /v1/models` | `route.v1.get-models` |

The model catalog is called only when the discovery switch above is on and the client actually fetches the catalog. Chat and token counting do not depend on that switch.

## 4. Details

These fields belong to Claude Code. They are not YAML keys of this proxy. A blank default means the value does not point at this proxy.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| `ANTHROPIC_BASE_URL` | API root address used by Claude Code. |  | Write a root such as `https://example.invalid`. Do not write `https://example.invalid/v1`. The client appends `/v1/messages`, `/v1/messages/count_tokens`, and `/v1/models`. |
| `ANTHROPIC_AUTH_TOKEN` | Client key sent to this proxy. |  | The value must be a configured key such as `YOUR_API_KEY`. It is not an upstream provider key. |
| `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY` | Whether the client fetches the model catalog. |  | `GET /v1/models` is requested only when this is `1`. When the request carries `Anthropic-Version`, or `User-Agent` starts with `claude-cli`, that route returns the Claude catalog. |

`X-Claude-Code-Session-Id` is recognized by this proxy as a Claude session and is used for session affinity. It is not a route.

## 5. Common errors and limits

If none of the accepted keys is present, the response is 401 with the body `{"error":"Missing API key"}`. If a value is present but none matches the configuration, the response is 401 with the body `{"error":"Invalid API key"}`. When `access.api-keys` is empty, these routes no longer require a client key.

When sample-key safe mode is enabled and the list still contains `your-api-key-1`, `your-api-key-2`, or `your-api-key-3`, a `/v1` prefix returns 403 before the handler runs and sets `X-CPA-SAFE-MODE: example-api-key`. Do not use a template key as `ANTHROPIC_AUTH_TOKEN`.

If the base URL also includes `/v1`, the path the client builds is not a registered path in the table above. `POST /v1/messages` returns one JSON body only when `stream` is absent or is the JSON boolean `false`. Any other `stream` value that is present uses SSE. The count route returns JSON only.

## 6. Related behavior

How to write the key is in [Client API keys](/api/access). Status and bodies for the two message routes are in [Claude Messages](/api/claude-messages). The catalog format is in [OpenAI Chat](/api/openai-chat). Session affinity is in [Routing strategy](/routing/strategy).

## 7. Field experience

None yet.
