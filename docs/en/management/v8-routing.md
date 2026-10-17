---
title: Routing actions
feature_ids:
  - management.v8.get-routing-model-definitions-channel
  - management.v8.post-routing-cooldown-reset
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Routing actions

## 1. What this solves

Read the static model definitions for a channel, or clear the quota and cooldown routing state on one credential.

## 2. Scope and non-goals

Both routes require the management key. They do not change the `routing` configuration. Strategy and cooldown duration are still decided by the routing configuration pages. What is cleared is the running cooldown state, not the credential file.

## 3. How to configure or call it

The base URL is `https://example.invalid`. The header is `Authorization: Bearer YOUR_API_KEY`.

Read model definitions. `:channel` can also be the `channel` query parameter. The query parameter is read only when the path is empty.

```http
GET /v8/management/routing/model-definitions/codex HTTP/1.1
Host: example.invalid
Authorization: Bearer YOUR_API_KEY
```

Clear cooldown:

```http
POST /v8/management/routing/cooldown/reset HTTP/1.1
Host: example.invalid
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{"auth_index":"AUTH_INDEX"}
```

`AUTH_INDEX` comes from the auth index in the credential list. It is not a model name.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| GET /v8/management/routing/model-definitions/:channel | Return the static model list for that channel. |  | The channel is required, otherwise 400 `channel is required`. An unknown channel is 400 `unknown channel`. Known channels: `claude`, `gemini`, `gemini-interactions`, `vertex`, `aistudio`, `codex`, `kimi`, `kimi-ai`, `kimi.ai`, `kimi.com`, `antigravity`, `xai`, `x-ai`, `grok`, `devin`, `meta`, `muse`. The response contains the lowercased `channel` and `models`. |
| POST /v8/management/routing/cooldown/reset | Clear quota and cooldown routing state by `auth_index`. |  | An invalid body is 400 `invalid request body`. An empty `auth_index` is 400 `auth_index is required`. A missing credential is 404 `auth not found`. If the manager is unavailable, the response is 503. Success returns `status`, `auth_index`, and `models`. |

## 5. Common errors and limits

Channel comparison is case-insensitive, but an unknown alias is not guessed as another provider. `kimi` and `kimi-ai` use the same static model set. `xai` and `grok`, and `meta` and `muse`, each share a set as well. Reset does not create a credential. If the reset fails internally, the response is 500 and the error starts with `failed to reset quota`.

## 6. Related behavior

The credential list is in [Credentials](/management/v8-credentials). The selection strategy is not changed on this page.

## 7. Field experience

- [Clear cooldown with the management route](/experience/management#exp-management-reset-cooldown)
