---
title: PI
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# PI

This page explains how to give the base URL and access key to CLIProxyAPI with the official PI provider, and which registered endpoints that provider calls.

## 1. What this solves

`@router-for-me/pi-cliproxyapi-provider` reads the model catalog from this proxy and sends inference requests to the Codex Responses alias. The base URL is this proxy's root address, and the access key is the client key. When transport is `websocket-cached`, continuation uses the registered WebSocket.

## 2. Scope and non-goals

Install this provider first, then log in inside PI. This page does not configure Fast or request pause, and it does not change the `client.codex` catalog switches. Those switches are in [Codex client catalog](/routing/client).

Use the root address `https://example.invalid` for login. Do not treat `/v1` or `/backend-api` as a base URL you must type. The provider normalizes them itself. The key is in [Client API keys](/api/access).

## 3. How to configure or call it

Install:

```bash
pi install npm:@router-for-me/pi-cliproxyapi-provider
```

In PI, run `/login CLIProxyAPI` or `/login cliproxyapi` and enter:

- Base URL: `https://example.invalid`
- Access key: `YOUR_API_KEY`

Then run `/settings` and set `Transport` to `websocket-cached`.

If you are not using interactive login, you can write `~/.pi/agent/cliproxyapi.json`:

```json
{
  "baseUrl": "https://example.invalid",
  "apiKey": "YOUR_API_KEY"
}
```

The environment variables `CLIPROXYAPI_BASE_URL` and `CLIPROXYAPI_API_KEY` take priority over this file. When the provider fetches the catalog, it sends `Authorization: Bearer YOUR_API_KEY`.

The provider normalizes the root address into two fixed addresses. The model catalog is `https://example.invalid/v1/models?client_version=pi`, and the inference base is `https://example.invalid/backend-api/`. It therefore calls:

| Method and path | route ID |
| --- | --- |
| `GET /v1/models` | `route.v1.get-models` |
| `POST /backend-api/codex/responses` | `route.backend-api.post-codex-responses` |
| `GET /backend-api/codex/responses` | `route.backend-api.get-codex-responses` |
| `POST /backend-api/codex/responses/compact` | `route.backend-api.post-codex-responses-compact` |

When the input already contains `/v1` or `/backend-api`, inference is still normalized to the same `/backend-api/`, and the catalog is still `/v1/models?client_version=pi` on the root address. `websocket-cached` uses the WebSocket of `GET /backend-api/codex/responses`. HTTP chat uses `POST` on the same path. Compaction uses `POST /backend-api/codex/responses/compact`. After compaction, the provider closes the WebSocket reused by that session.

## 4. Details

These fields belong to the PI provider. They are not YAML keys of this proxy.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| `baseUrl` | Root address of this proxy. | When neither the environment variable nor the configuration file is set, the provider uses its own root-address default. The example on this page writes `https://example.invalid`. | Prefer the root address. A value that includes `/v1` or `/backend-api` is still normalized and does not move the catalog URL. |
| `apiKey` | Client key sent to this proxy. |  | Required, unless it was already provided by `/login` or `CLIPROXYAPI_API_KEY`. The value is `YOUR_API_KEY`, placed in `Authorization: Bearer`. |
| `CLIPROXYAPI_BASE_URL` | Environment variable that overrides `baseUrl`. |  | When non-empty, it takes priority over the configuration file and the address saved by login. |
| `CLIPROXYAPI_API_KEY` | Environment variable that overrides `apiKey`. |  | When non-empty, it takes priority over the configuration file and the key saved by login. |
| `Transport` | PI transport. |  | This page sets it to `websocket-cached`, which corresponds to `GET /backend-api/codex/responses`. |

As soon as the query string contains the key `client_version`, `GET /v1/models` returns the Codex client catalog. The value the provider sends is `pi`. `X-Slot-Session-Id` is recognized as a PI session. It is not a route.

Login validation only requires the catalog request to return HTTP 200. An empty model list still counts as a successful login. A non-200 response or a network error asks you to enter the base URL and key again.

## 5. Common errors and limits

If the catalog request does not carry `Authorization: Bearer YOUR_API_KEY` and no other configured key is present, the response is 401 with the body `{"error":"Missing API key"}`. If the value does not match, the response is 401 with the body `{"error":"Invalid API key"}`. The provider treats a non-200 response as a failed login.

When sample-key safe mode matches, both `/v1` and `/backend-api/codex` return 403 before the handler runs and set `X-CPA-SAFE-MODE: example-api-key`. Login therefore does not succeed.

`POST /backend-api/codex/responses` and `POST /v1/responses` use the same handler: SSE is returned only for the JSON boolean `stream: true`. `POST /backend-api/codex/responses/compact` returns 400 for the JSON boolean `stream: true`. `GET /backend-api/codex/responses` must complete a WebSocket upgrade. A failed upgrade does not start a session. When `access.api-keys` is empty, these routes no longer require a client key, but the provider still sends `Authorization`.

## 6. Related behavior

The key is in [Client API keys](/api/access). How these four routes are handled is in [Responses](/api/responses) and [OpenAI Chat](/api/openai-chat). Codex catalog switches are in [Codex client catalog](/routing/client). Session affinity is in [Routing strategy](/routing/strategy).

## 7. Field experience

None yet.
