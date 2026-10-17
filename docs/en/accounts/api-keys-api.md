---
title: Upstream API keys
feature_ids:
  - api-keys.claude.api-key
  - api-keys.codex.api-key
  - api-keys.gemini.api-key
  - api-keys.interactions.api-key
  - api-keys.meta.api-key
  - api-keys.openai-compatibility.api-key-entries-api-key
  - api-keys.openai-compatibility.api-key-entries-proxy-url
  - api-keys.openai-compatibility.api-key-entries-weight
  - api-keys.vertex.api-key
  - api-keys.xai.api-key
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Upstream API keys

## 1. What this solves

This page covers the keys each upstream provider uses to call a model. They are not the client keys used to call this proxy.

## 2. Scope and non-goals

v8 writes every provider except OpenAI-compatible as a group: `name`, `base-url`, and `keys`. The key is written inside `keys`. An OpenAI-compatible provider's keys are written in the group's `keys`, and after load they correspond to `api-key-entries`. The client keys are still `access.api-keys`.

## 3. How to configure or call it

```yaml
api-keys:
  claude:
    - name: claude-1
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
  openai-compatibility:
    - name: openrouter
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.api-key | Key used to access that upstream. | empty string | Written in the v8 group's keys. An official Claude key uses https://api.anthropic.com when base-url is empty. |
| api-keys.codex.api-key | Key used to access that upstream. | empty string | Written in the v8 group's keys. When base-url is empty, it uses https://chatgpt.com/backend-api/codex. |
| api-keys.gemini.api-key | Key used to access that upstream. | empty string | Written in the v8 group's keys. When base-url is empty, it uses https://generativelanguage.googleapis.com. |
| api-keys.interactions.api-key | Key used to access that upstream. | empty string | Written in the v8 group's keys. When base-url is empty, it uses https://generativelanguage.googleapis.com. |
| api-keys.meta.api-key | Key used to access that upstream. | empty string | Written in the v8 group's keys. An empty base-url uses https://api.meta.ai/v1. |
| api-keys.openai-compatibility.api-key-entries.api-key | api-keys.openai-compatibility.api-key-entries.api-key | empty string | Written in the openai-compatibility group's keys. After load it corresponds to api-key-entries.api-key. |
| api-keys.openai-compatibility.api-key-entries.proxy-url | api-keys.openai-compatibility.api-key-entries.proxy-url | empty string | An empty value falls back to requests.proxy-url. The v8 template writes direct to bypass the proxy. An OpenAI-compatible provider's proxy is written on the keys entry. Other providers can write it on the group, and a single key can override it. |
| api-keys.openai-compatibility.api-key-entries.weight | api-keys.openai-compatibility.api-key-entries.weight | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | When omitted, it is treated as 1. An integer less than or equal to 0 does not take part in weighted selection. A non-integer makes configuration loading fail. The error contains weight must be an integer. Greater than 1000000 fails. The error contains weight must not exceed 1000000. |
| api-keys.vertex.api-key | Key used to access that upstream. | empty string | Sent as x-goog-api-key. Written in the v8 group's keys. |
| api-keys.xai.api-key | Key used to access that upstream. | empty string | Written in the v8 group's keys. An API key with an empty base-url uses https://api.x.ai/v1. |

## 5. Common errors and limits

Configuration loading fails when a provider value is not a list, a group is not a map, or `keys` is not a list. Except for OpenAI-compatible, writing `base-url` into a single key fails. The error contains `base-url belongs to the group`. An unsupported field on a group also fails.

## 6. Related behavior

Addresses are in [Upstream base URLs](/accounts/api-keys-base). Weight is in [Credential weight](/accounts/api-keys-weight).

## 7. Field experience

- [A responses upstream is written to a Codex API key](/experience/accounts#exp-accounts-codex-api-key-base-url)
- [Add several keys under the same base URL](/experience/accounts#exp-accounts-multiple-keys-one-provider)
- [Connect a third party through the OpenAI-compatible section](/experience/accounts#exp-accounts-openai-compatible-provider)
- [If the response is malformed, check the proxy on the key first](/experience/accounts#exp-accounts-trace-key-proxy)
- [Models with the same name share a routing strategy](/experience/routing#exp-routing-same-model-name)
