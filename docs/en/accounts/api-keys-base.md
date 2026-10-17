---
title: Upstream base URLs
feature_ids:
  - api-keys.claude.base-url
  - api-keys.codex.base-url
  - api-keys.gemini.base-url
  - api-keys.interactions.base-url
  - api-keys.meta.base-url
  - api-keys.openai-compatibility.base-url
  - api-keys.vertex.base-url
  - api-keys.xai.base-url
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Upstream base URLs

## 1. What this solves

This page covers the base-url of each upstream group. It belongs to the group, not to a single key inside the group.

## 2. Scope and non-goals

It does not invent endpoints beyond the official addresses. A Codex or xAI API key cannot switch to the official endpoint by omitting base-url: entries with an empty address are dropped on load. Empty values for the other providers are in the details. An OpenAI-compatible provider also has no built-in official address.

## 3. How to configure or call it

```yaml
api-keys:
  gemini:
    - name: gemini-1
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
  vertex:
    - name: vertex-1
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.base-url | Upstream base URL of that group or provider. | If empty, the default Claude API URL will be used. | An empty value uses https://api.anthropic.com. The address belongs to the group. Writing it into a single key makes loading fail. |
| api-keys.codex.base-url | Upstream base URL of that group or provider. | If empty, the default Codex API URL will be used. | If it is still empty after trimming leading and trailing whitespace, SanitizeCodexKeys drops the entry. The official address in the executor is not applied to a deleted configuration. The address belongs to the group and cannot be written on a single key. |
| api-keys.gemini.base-url | Upstream base URL of that group or provider. | empty string | An empty value uses https://generativelanguage.googleapis.com. |
| api-keys.interactions.base-url | Upstream base URL of that group or provider. | empty string | An empty value uses https://generativelanguage.googleapis.com. These keys are used only for a direct /v1beta/interactions. |
| api-keys.meta.base-url | Upstream base URL of that group or provider. | If empty, the default Codex API URL will be used. | An empty value uses https://api.meta.ai/v1. The address belongs to the group. |
| api-keys.openai-compatibility.base-url | Upstream base URL of that group or provider. | empty string | During normalization, an entry with an empty base address is removed so it does not take part in routing. |
| api-keys.vertex.base-url | Upstream base URL of that group or provider. | empty string | When omitted, it uses Google Vertex. If the value already contains /publishers/, it is treated as a complete resource prefix and only /{model}:{action} is appended. Otherwise /v1 is inserted when missing, then /publishers/google/models is appended. An existing /v1 or /v1beta1 is not repeated. |
| api-keys.xai.base-url | Upstream base URL of that group or provider. | If empty, the default Codex API URL will be used. | If it is still empty after trimming leading and trailing whitespace, SanitizeXAIKeys drops the entry. The official address in the executor is not applied to a deleted configuration. The address belongs to the group and cannot be written on a single key. |

## 5. Common errors and limits

If a non-OpenAI-compatible provider writes base-url inside a `keys` entry, loading fails. If a Codex or xAI entry's base-url is still empty after trimming leading and trailing whitespace, the whole entry is dropped on load. The official address in the executor is not applied again to those deleted configurations. An empty base-url on an OpenAI-compatible provider is also removed during normalization and does not take part in routing. A Vertex value that contains `/publishers/` is treated as a complete resource prefix.

## 6. Related behavior

The key is in [Upstream API keys](/accounts/api-keys-api).

## 7. Field experience

- [Do not add another slash after the version segment of a base URL](/experience/accounts#exp-accounts-base-url-no-extra-slash)
- [A Claude base URL should not repeat /v1](/experience/accounts#exp-accounts-claude-base-url-host-only)
- [A responses upstream is written to a Codex API key](/experience/accounts#exp-accounts-codex-api-key-base-url)
- [A compatible provider needs both a base URL and an alias](/experience/accounts#exp-accounts-compat-base-and-alias)
- [A custom Gemini address has two spellings](/experience/accounts#exp-accounts-gemini-custom-base-url)
- [A Kimi-compatible call needs a User-Agent](/experience/accounts#exp-accounts-kimi-user-agent)
- [An OpenAI-compatible base URL includes the version segment](/experience/accounts#exp-accounts-openai-base-url-v1)
- [Connect a third party through the OpenAI-compatible section](/experience/accounts#exp-accounts-openai-compatible-provider)
- [Rotate a Vertex credential the upstream marked as violating policy](/experience/accounts#exp-accounts-rotate-vertex-key)
- [On an xAI 403, switch to an API key](/experience/accounts#exp-accounts-xai-api-key-fallback)
- [A Codex client calls the responses route](/experience/api#exp-api-call-responses)
- [A compatible credential always calls chat completions](/experience/api#exp-api-compat-always-chat)
- [DeepSeek needs the client to lower max tokens](/experience/api#exp-api-deepseek-max-tokens)
- [A third-party DeepSeek does not fill OpenAI thinking fields](/experience/api#exp-api-deepseek-no-openai-thinking)
- [Image calls are recorded on the base chat model](/experience/api#exp-api-image-base-model)
- [A non-Claude upstream reports usage only at the end of the message](/experience/api#exp-api-messages-usage-at-end)
- [Use a payload filter to drop fields the upstream rejects](/experience/routing#exp-routing-filter-rejected-fields)
- [A keep-alive marker is not a JSON response](/experience/routing#exp-routing-keepalive-is-not-json)
- [Add extra_body with an override rule](/experience/routing#exp-routing-override-extra-body)
- [A payload override still applies after a thinking suffix](/experience/routing#exp-routing-override-is-final)
