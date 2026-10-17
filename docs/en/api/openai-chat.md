---
title: OpenAI Chat
feature_ids:
  - route.v1.get-models
  - route.v1.post-chat-completions
  - route.v1.post-completions
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# OpenAI Chat

This page covers OpenAI Chat Completions, Completions, and the default model list in the pinned commit.

## 1. What this solves

These three routes let a caller use OpenAI-compatible JSON to list models, start a chat completion, or start a legacy text completion. They are all mounted on the `/v1` group.

## 2. Scope and non-goals

All three routes pass the client-key check first. How to write the key, and sample-key safe mode, are in [Client API keys](/api/access). When safe mode matches, the request returns 403 before it enters the handler on this page.

This page does not describe a query for one model. `GET /v1/models/*model` is in [Other endpoints](/api/openai-other). Claude Messages, Gemini, and Responses are not on this page.

`model` must be a model the current process can route. This page does not add model names.

## 3. How to configure or call it

Model list:

```bash
curl https://example.invalid/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Chat completion. Only a `stream` that is the JSON boolean `true` returns SSE. Omitting it, or any other value, returns one JSON body.

```bash
curl https://example.invalid/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>","stream":false}'
```

Legacy completion likewise treats only the JSON boolean `true` for `stream` as streaming. When `prompt` is an empty string, the user text sent for execution is `Complete this:`.

```bash
curl https://example.invalid/v1/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>","prompt":"Continue.","stream":false}'
```

## 4. Details

The Default column matches the ledger `defaults` verbatim. A blank cell means the field is an empty string.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| route.v1.get-models | `GET /v1/models`. Returns the models that are currently visible. |  | See the format selection in section 5. An ordinary OpenAI list keeps only `id`, `object`, `created`, and `owned_by`. The outer object is `{"object":"list","data":[...]}`. |
| route.v1.post-chat-completions | `POST /v1/chat/completions`. |  | The JSON boolean `stream: true` uses SSE. Otherwise the response is one JSON body. If there is no `messages` but there is `input` or `instructions`, the Responses body is converted to Chat Completions before execution. |
| route.v1.post-completions | `POST /v1/completions`. |  | The JSON boolean `stream: true` uses SSE. An empty `prompt` becomes the user text `Complete this:`. The non-streaming response `object` is `text_completion`. |

`POST /v1/completions` carries `model`, `max_tokens`, `temperature`, `top_p`, `frequency_penalty`, `presence_penalty`, `stop`, `stream`, `logprobs`, `top_logprobs`, and `echo` into execution when they are already present in the request. Fields that are not present are not filled in by this route.

## 5. Common errors and limits

If reading the request body fails, both `POST` routes return the status of that read error. When it cannot be classified, the status is 400. The body's `error.type` is `invalid_request_error`, and `error.message` starts with `Invalid request:`.

`GET /v1/models` chooses the catalog format from the request:

- When `User-Agent` contains `grok-shell`, the Grok Shell catalog is returned. The comparison is case-insensitive.
- When the query string contains the key `client_version`, even if the value is empty, the Codex client catalog is returned. An encoding failure returns 500. `error.type` is `server_error`, and the message starts with `Failed to encode model list:`.
- When the request has `Anthropic-Version`, or `User-Agent` starts with `claude-cli`, the Claude model list is returned.
- Otherwise the OpenAI list above is returned.

When Home is enabled, `client_version` uses Home's Codex client catalog, and the other lists use the Home model catalog. An unavailable control center returns 503. `error.type` is `server_error`, and `error.message` is `home control center unavailable`. A failed catalog fetch from Home returns 502. `error.type` is `server_error`. When Home marks the result as an authentication failure, the status follows that result and `error.type` is `authentication_error`.

When a single model is required, 502 is returned only when `json.Unmarshal` of the whole catalog fails. The body is `{"error":{"message":"Invalid model catalog","type":"api_error"}}`. When the catalog is valid JSON but has no `data` or `models` array, the response is 404 with the body `{"error":{"message":"Model not found","type":"invalid_request_error","code":"model_not_found"}}`. The list path on this page does not take that branch. It writes the catalog directly.

## 6. Related behavior

One model is in [Other endpoints](/api/openai-other). The client key is in [Client API keys](/api/access). Responses are in [Responses](/api/responses).

## 7. Field experience

- [Map a client model name to the real model with an alias](/experience/accounts#exp-accounts-alias-client-model)
- [Exclude a model on a single credential](/experience/accounts#exp-accounts-exclude-model)
- [A compatible model appears in the list only after it is written into the configuration](/experience/accounts#exp-accounts-list-compat-models)
- [Antigravity images use chat completions](/experience/api#exp-api-antigravity-image-chat)
- [Do not translate through chat completions when the upstream protocol can be called directly](/experience/api#exp-api-avoid-chat-translation)
- [A chat-completion stream ends with DONE](/experience/api#exp-api-chat-done-marker)
- [An image chat model still uses chat completions](/experience/api#exp-api-chat-image-model)
- [Chat completions stream thinking only when reasoning effort is sent](/experience/api#exp-api-chat-reasoning-effort)
- [A compatible credential always calls chat completions](/experience/api#exp-api-compat-always-chat)
- [Omit top_p when Copilot uses /v1](/experience/api#exp-api-copilot-chat-sampling)
- [A third-party DeepSeek does not fill OpenAI thinking fields](/experience/api#exp-api-deepseek-no-openai-thinking)
- [Gemini audio uses chat completions](/experience/api#exp-api-gemini-audio-chat)
- [Do not expect the proxy to invent reasoning text the catalog did not return](/experience/api#exp-api-no-synthetic-reasoning)
- [A reasoning summary appears only when the request asks for it](/experience/api#exp-api-reasoning-summary-vs-effort)
- [Send the client key when calling a public route](/experience/api#exp-api-require-client-key)
- [Restart after deleting a credential before the model list updates](/experience/api#exp-api-restart-after-auth-removal)
- [The client uses the model id from the catalog](/experience/api#exp-api-use-listed-model-id)
- [Do not send a thinking level the model rejects](/experience/configuration#exp-configuration-reject-minimal-effort)
- [Choose a thinking level with a parenthetical suffix](/experience/configuration#exp-configuration-thinking-suffix)
- [Visible models follow the pinned catalog](/experience/introduction#exp-introduction-catalog-is-authoritative)
- [Turn cooling off to keep the credential selectable](/experience/routing#exp-routing-disable-cooling)
- [gpt-image-2 is called through chat completions after an override](/experience/routing#exp-routing-gpt-image-override)
