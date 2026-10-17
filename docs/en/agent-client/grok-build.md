---
title: Grok Build
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Grok Build

This page explains how to point Grok Build's model-catalog address and access key at this proxy, and which registered endpoints it calls.

## 1. What this solves

Grok Build uses its own configuration for the model-list address and the API base URL. After they point at this proxy, the catalog request is answered by `GET /v1/models` with the Grok Shell catalog. Each catalog entry has `api_backend` set to `responses`, and the following chat uses the Responses route.

## 2. Scope and non-goals

This page changes only the API key in `~/.grok/auth.json` and the endpoints in `~/.grok/config.toml`. It does not log in to upstream xAI, and it does not change this proxy's `api-keys.xai` or `oauth` credentials.

The user, email, and retention period in the account file are not the client key. This page does not write them. The model must be an ID that already appears in the Grok Shell catalog. The key is in [Client API keys](/api/access).

## 3. How to configure or call it

`~/.grok/auth.json`:

```json
{
  "xai::api_key": {
    "key": "YOUR_API_KEY",
    "auth_mode": "api_key"
  }
}
```

`~/.grok/config.toml`:

```toml
[features]
remote_fetch = true

[endpoints]
models_base_url = "https://example.invalid/v1"
models_list_url = "https://example.invalid/v1/models"
```

`YOUR_API_KEY` must be a configured client key. This proxy accepts `Authorization: Bearer YOUR_API_KEY` and `X-Api-Key: YOUR_API_KEY`.

When `remote_fetch = true`, the client fetches the catalog from `models_list_url`, then sends Responses requests to `models_base_url`:

| Method and path | route ID |
| --- | --- |
| `GET /v1/models` | `route.v1.get-models` |
| `POST /v1/responses` | `route.v1.post-responses` |

When `User-Agent` contains `grok-shell`, `GET /v1/models` returns the Grok Shell catalog rather than the OpenAI list. That catalog writes `api_backend` as `responses` on every model, so the chat base URL is `https://example.invalid/v1` and the path is `/responses`.

## 4. Details

These fields belong to Grok Build. They are not YAML keys of this proxy.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| `xai::api_key.key` | Client key sent to this proxy. |  | The value is `YOUR_API_KEY`. `auth_mode` uses `api_key`. |
| `features.remote_fetch` | Whether to fetch the remote catalog from the configured address. |  | `models_list_url` is requested only when this is `true`. |
| `endpoints.models_list_url` | Full URL of the model catalog. |  | It must be `https://example.invalid/v1/models`, which matches `route.v1.get-models`. |
| `endpoints.models_base_url` | Base URL for Responses. |  | Write `https://example.invalid/v1`. The client appends `/responses`, which matches `route.v1.post-responses`. |

The `grok-shell` comparison is case-insensitive and happens before the `client_version` query parameter. When `User-Agent` contains `grok-shell`, `GET /v1/models` still returns the Grok Shell catalog even if the request also has `client_version`, and each model's `api_backend` is still `responses`. Only when the request is not Grok Shell does the presence of `client_version` switch the response to the Codex client catalog.

## 5. Common errors and limits

If no key is sent, the response is 401 with the body `{"error":"Missing API key"}`. If the key does not match, the response is 401 with the body `{"error":"Invalid API key"}`. When `access.api-keys` is empty, the check is skipped. When sample-key safe mode matches, these two `/v1` paths return 403.

If `models_list_url` is not `/v1/models`, it does not hit `route.v1.get-models`. If `models_base_url` adds another `/v1` or omits `/v1`, chat does not hit `POST /v1/responses`.

When `User-Agent` does not contain `grok-shell`, that same `GET /v1/models` does not return the Grok Shell catalog. `POST /v1/responses` returns SSE only for the JSON boolean `stream: true`. The configuration on this page does not call `GET /v1/responses`, and it does not call the aliases under `/backend-api/codex`.

## 6. Related behavior

The key is in [Client API keys](/api/access). How the catalog format is chosen is in [OpenAI Chat](/api/openai-chat). Responses status and bodies are in [Responses](/api/responses).

## 7. Field experience

None yet.
