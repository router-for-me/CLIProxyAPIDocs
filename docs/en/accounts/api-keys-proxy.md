---
title: Per-key proxy
feature_ids:
  - api-keys.claude.proxy-url
  - api-keys.codex.proxy-url
  - api-keys.gemini.proxy-url
  - api-keys.interactions.proxy-url
  - api-keys.meta.proxy-url
  - api-keys.vertex.proxy-url
  - api-keys.xai.proxy-url
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Per-key proxy

## 1. What this solves

Let one upstream group or one key use its own proxy instead of the global proxy.

## 2. Scope and non-goals

The proxy of an OpenAI-compatible provider is on the keys entry. See api-key-entries next to the weight page. This page is proxy-url for the other providers.

## 3. How to configure or call it

```yaml
api-keys:
  gemini:
    - name: gemini-1
      proxy-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
          proxy-url: "https://example.invalid"
```

The v8 template also allows an empty value to fall back to the global `requests.proxy-url`, and `direct` means a direct connection.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.proxy-url | Proxy address used by this key or provider. | empty string | An empty value falls back to requests.proxy-url. The v8 template writes direct to bypass the proxy. An OpenAI-compatible provider's proxy is written on the keys entry. Other providers can write it on the group, and a single key can override it. |
| api-keys.codex.proxy-url | Proxy address used by this key or provider. | empty string | An empty value falls back to requests.proxy-url. The v8 template writes direct to bypass the proxy. An OpenAI-compatible provider's proxy is written on the keys entry. Other providers can write it on the group, and a single key can override it. |
| api-keys.gemini.proxy-url | Proxy address used by this key or provider. | empty string | An empty value falls back to requests.proxy-url. The v8 template writes direct to bypass the proxy. An OpenAI-compatible provider's proxy is written on the keys entry. Other providers can write it on the group, and a single key can override it. |
| api-keys.interactions.proxy-url | Proxy address used by this key or provider. | empty string | An empty value falls back to requests.proxy-url. The v8 template writes direct to bypass the proxy. An OpenAI-compatible provider's proxy is written on the keys entry. Other providers can write it on the group, and a single key can override it. |
| api-keys.meta.proxy-url | Proxy address used by this key or provider. | empty string | An empty value falls back to requests.proxy-url. The v8 template writes direct to bypass the proxy. An OpenAI-compatible provider's proxy is written on the keys entry. Other providers can write it on the group, and a single key can override it. |
| api-keys.vertex.proxy-url | Proxy address used by this key or provider. | empty string | An empty value falls back to requests.proxy-url. The v8 template writes direct to bypass the proxy. An OpenAI-compatible provider's proxy is written on the keys entry. Other providers can write it on the group, and a single key can override it. |
| api-keys.xai.proxy-url | Proxy address used by this key or provider. | empty string | An empty value falls back to requests.proxy-url. The v8 template writes direct to bypass the proxy. An OpenAI-compatible provider's proxy is written on the keys entry. Other providers can write it on the group, and a single key can override it. |

## 5. Common errors and limits

These keys have no separate URL-syntax rejection on this page. An empty string is treated as a fallback.

## 6. Related behavior

The proxy and weight of an OpenAI-compatible entry are registered together in [Credential weight](/accounts/api-keys-weight) and [Upstream API keys](/accounts/api-keys-api).

## 7. Field experience

- [Assign a proxy to one credential](/experience/routing#exp-routing-per-credential-proxy)

