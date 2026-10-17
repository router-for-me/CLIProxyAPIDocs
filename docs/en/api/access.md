---
title: Client API keys
feature_ids:
  - access.api-keys.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Client API keys

This page covers only the client keys in the pinned commit that call this proxy's public endpoints. They are not upstream provider keys.

## 1. What this solves

`access.api-keys` lists the client keys this proxy accepts. After at least one valid key is configured, the public routes in this manual check the key in the request. When the list is empty, those routes no longer require a client key.

## 2. Scope and non-goals

In v8 configuration this is written at `access.api-keys`. A root-level string list `api-keys` in an old file is still loaded into the same field. When both are present, including when the new field is explicitly an empty list, `access.api-keys` wins.

If root-level `api-keys` is a map, it means upstream provider groups. It is not treated as client keys, and it cannot share the same YAML key with the client list. Upstream groups, the management key, and the `MANAGEMENT_PASSWORD` environment variable are not on this page.

Blank entries are removed. Duplicate entries are kept once. When no keys remain, the built-in `config-api-key` provider is not registered.

## 3. How to configure or call it

```yaml
access:
  api-keys:
    - "YOUR_API_KEY"
```

When calling a route in this manual that requires a key, any of the forms below works. The first configured key is taken in this order: `Authorization`, `X-Goog-Api-Key`, `X-Api-Key`, the query parameter `key`, and the query parameter `auth_token`.

When `Authorization` starts with `Bearer` followed by a space, only the token after it is used. The scheme name is case-insensitive. Otherwise the whole header value is treated as the key.

```bash
curl https://example.invalid/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

```bash
curl "https://example.invalid/v1/models?key=YOUR_API_KEY"
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| access.api-keys.value | This proxy's client key list. | nil | Blank entries are deleted. Duplicates are ignored. An empty list means client keys are not checked. |

## 5. Common errors and limits

If none of the keys above is provided, the response is 401 with the body `{"error":"Missing API key"}`. If a value is provided but none matches the configuration, the response is 401 with the body `{"error":"Invalid API key"}`.

On realtime routes that use the realtime authentication middleware, the same failure is wrapped as an object: `type` is `authentication_error`, `code` is `invalid_api_key`, and `param` is `null`. When the request body exceeds the configured body limit and is rejected during authentication, those paths change `type` to `invalid_request_error` and `code` to `request_body_too_large`. When the authentication service returns 500 or above, `type` is `server_error` and `code` is `authentication_service_error`. The ordinary `/v1`, `/v1beta`, `/openai/v1`, and `/backend-api/codex` groups still use the string `error` above.

Sample-key safe mode is enabled only on a normal startup or TUI standalone. It is not enabled for login, import, `--siwc-bind`, Home, or a cloud deployment whose configuration file does not exist. It is also not enabled when the process is only a TUI client connected to an existing service. Once enabled, if the list still contains `your-api-key-1`, `your-api-key-2`, or `your-api-key-3`, the prefixes `/v1`, `/v1beta`, `/openai/v1`, and `/backend-api/codex` return 403 before the handler runs and set the response header `X-CPA-SAFE-MODE: example-api-key`. The body is:

```json
{"error":"unsafe_example_api_key","message":"Proxy API endpoints are disabled because api-keys contains template values. Open /management.html?safe-mode=configure, update api-keys in Management, then retry."}
```

`GET` or `HEAD` `/` and `/management.html` then return a warning page instead of the original response. `/management.html?safe-mode=configure` is the exception. It still enters the management panel.

## 6. Related behavior

Calls that use these keys are in [OpenAI Chat](/api/openai-chat), [Responses](/api/responses), [Claude Messages](/api/claude-messages), [Gemini](/api/gemini), [Images, speech, and video](/api/media), [Realtime sessions](/api/realtime), and [Other endpoints](/api/openai-other).

## 7. Field experience

- [Client keys share one proxy entry](/experience/api#exp-api-one-client-key-endpoint)
- [Replace the sample client keys](/experience/api#exp-api-replace-example-client-keys)
- [Send the client key when calling a public route](/experience/api#exp-api-require-client-key)
