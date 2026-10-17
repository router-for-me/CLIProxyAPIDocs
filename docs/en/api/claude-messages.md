---
title: Claude Messages
feature_ids:
  - route.v1.post-messages
  - route.v1.post-messages-count-tokens
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Claude Messages

This page covers Claude Messages calls and token counting in the pinned commit.

## 1. What this solves

`POST /v1/messages` accepts Claude-compatible JSON and uses `stream` to decide whether to return one JSON body or SSE. `POST /v1/messages/count_tokens` uses the same kind of request body to return a count. It does not start a stream.

## 2. Scope and non-goals

Both routes are in the `/v1` group and pass the client-key check first. The key and sample-key safe mode are in [Client API keys](/api/access).

This page does not list Claude models. `GET /v1/models` with `Anthropic-Version` or a `claude-cli` User-Agent is in [OpenAI Chat](/api/openai-chat). Gemini `countTokens` is not on this page.

The handler reads `model` and `stream`. The rest of the JSON goes on to later execution. This route does not declare extra required fields here.

## 3. How to configure or call it

Non-streaming messages:

```bash
curl https://example.invalid/v1/messages \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>","stream":false}'
```

For a streaming message, set `stream` to the JSON boolean `true`. The response uses SSE.

Counting:

```bash
curl https://example.invalid/v1/messages/count_tokens \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>"}'
```

The count response sets `Content-Type` to `application/json` first.

## 4. Details

The Default column matches the ledger `defaults` verbatim. A blank cell means the field is an empty string.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| route.v1.post-messages | `POST /v1/messages`. |  | When `stream` is absent, or is the JSON boolean `false`, the response is one JSON body. Any other `stream` value that is present uses SSE. |
| route.v1.post-messages-count-tokens | `POST /v1/messages/count_tokens`. |  | JSON only. The `model` in the request body selects the execution target. |

A model ID shaped like `claude-fable-5-dd-` plus a reversed fragment is restored to the original model name before routing. When the restored result equals the original value, the request body is left unchanged.

## 5. Common errors and limits

If reading the request body fails, the status of that read error is returned. When it cannot be classified, the status is 400. The body's `error.type` is `invalid_request_error`, and `error.message` starts with `Invalid request:`.

When execution fails, the outer `type` of a Claude error body is `error`. `error.type` and `error.message` inside it come from the execution error. The status code follows the status in the execution error. When there is no status, it is 500. A response body returned directly by the upstream is written with its original status. A body recognized as a missing thread is rewritten as a Claude error object with `error.details.error_code` `thread_not_found`.

If a non-streaming response starts with the gzip magic number, it is decompressed before being written to the client. If decompression fails, the original bytes are still written.

A streaming response returns 500 when an HTTP flusher cannot be obtained. This page does not define a separate set of streaming error codes. Errors from the execution stage use the Claude error object above.

## 6. Related behavior

The client key is in [Client API keys](/api/access). OpenAI chat is in [OpenAI Chat](/api/openai-chat).

## 7. Field experience

- [Map a client model name to the real model with an alias](/experience/accounts#exp-accounts-alias-client-model)
- [Claude Code uses a Codex login instead of a raw token](/experience/accounts#exp-accounts-codex-login-for-claude-code)
- [Compatible models keep signed thinking](/experience/accounts#exp-accounts-compat-preserves-signed-thinking)
- [Antigravity Claude uses messages](/experience/api#exp-api-antigravity-claude-messages)
- [Claude Code must call messages](/experience/api#exp-api-claude-code-messages)
- [The count endpoint counts tools the upstream way](/experience/api#exp-api-count-tokens-tool-shape)
- [DeepSeek needs the client to lower max tokens](/experience/api#exp-api-deepseek-max-tokens)
- [Drop unsupported Claude fields before sending to Codex](/experience/api#exp-api-drop-unsupported-claude-fields)
- [A non-Claude upstream reports usage only at the end of the message](/experience/api#exp-api-messages-usage-at-end)
- [Opus effort comes from output_config.effort](/experience/api#exp-api-opus-effort-field)
- [Send the client key when calling a public route](/experience/api#exp-api-require-client-key)
- [A tool round trip must carry the id](/experience/api#exp-api-tool-call-ids)
- [Declare thinking levels on the model entry](/experience/configuration#exp-configuration-declare-thinking-levels)
- [Choose a thinking level with a parenthetical suffix](/experience/configuration#exp-configuration-thinking-suffix)
- [An alias plus an override expresses Opus effort](/experience/routing#exp-routing-alias-and-override-effort)
