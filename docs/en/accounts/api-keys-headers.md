---
title: Upstream extra headers
feature_ids:
  - api-keys.claude.headers
  - api-keys.codex.headers
  - api-keys.gemini.headers
  - api-keys.interactions.headers
  - api-keys.meta.headers
  - api-keys.openai-compatibility.headers
  - api-keys.vertex.headers
  - api-keys.xai.headers
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Upstream extra headers

## 1. What this solves

Add extra HTTP headers to one upstream group or key.

## 2. Scope and non-goals

These headers are sent upstream. They are not headers this proxy requires from the client. Headers for an OpenAI-compatible provider are written on the provider, not on a single key.

## 3. How to configure or call it

```yaml
api-keys:
  gemini:
    - name: gemini-1
      headers:
        X-Custom-Header: "custom-value"
      keys:
        - api-key: "YOUR_API_KEY"
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.headers | Extra HTTP headers sent to that upstream. | nil | Headers in the map are added to that upstream request. When omitted, none are added. |
| api-keys.codex.headers | Extra HTTP headers sent to that upstream. | nil | Headers in the map are added to that upstream request. When omitted, none are added. |
| api-keys.gemini.headers | Extra HTTP headers sent to that upstream. | nil | Headers in the map are added to that upstream request. When omitted, none are added. |
| api-keys.interactions.headers | Extra HTTP headers sent to that upstream. | nil | Headers in the map are added to that upstream request. When omitted, none are added. |
| api-keys.meta.headers | Extra HTTP headers sent to that upstream. | nil | Headers in the map are added to that upstream request. When omitted, none are added. |
| api-keys.openai-compatibility.headers | Extra HTTP headers sent to that upstream. | nil | Headers in the map are added to that upstream request. When omitted, none are added. |
| api-keys.vertex.headers | Extra HTTP headers sent to that upstream. | nil | Headers in the map are added to that upstream request. When omitted, none are added. |
| api-keys.xai.headers | Extra HTTP headers sent to that upstream. | nil | Headers in the map are added to that upstream request. When omitted, none are added. |

## 5. Common errors and limits

Header values have no separate format rejection. A map given explicitly on a key replaces the group's map as a whole.

## 6. Related behavior

Headers in the Claude fingerprint baseline are in [Claude upstream behavior](/accounts/upstream). Those are a different set of keys.

## 7. Field experience

- [A Kimi-compatible call needs a User-Agent](/experience/accounts#exp-accounts-kimi-user-agent)
- [A compatible provider's headers apply only to that provider](/experience/accounts#exp-accounts-provider-headers)
