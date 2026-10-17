---
title: Alpha Search key switch
feature_ids:
  - api-keys.codex.alpha-search
  - api-keys.meta.alpha-search
  - api-keys.xai.alpha-search
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Alpha Search key switch

## 1. What this solves

Allow one Codex, Meta, or xAI API key to serve Alpha Search.

## 2. Scope and non-goals

This does not include the Alpha Search HTTP path itself. A Claude key does not have this field.

## 3. How to configure or call it

```yaml
api-keys:
  codex:
    - name: codex-1
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
          alpha-search: false
```

When it is on, the call uses that group's base-url plus `/alpha/search`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.codex.alpha-search | Whether this key may serve Alpha Search. | false | When false, this key does not serve Alpha Search. When true, it is served through that group's base-url plus /alpha/search. |
| api-keys.meta.alpha-search | Whether this key may serve Alpha Search. | false | When false, this key does not serve Alpha Search. When true, it is served through that group's base-url plus /alpha/search. |
| api-keys.xai.alpha-search | Whether this key may serve Alpha Search. | false | When false, this key does not serve Alpha Search. When true, it is served through that group's base-url plus /alpha/search. |

## 5. Common errors and limits

When false, this key does not take Alpha Search. If the base-url is missing, the public route uses that route's own 503. It is not repeated on this page.

## 6. Related behavior

The public path is in the Responses section. The base URL is in [Upstream base URLs](/accounts/api-keys-base).

## 7. Field experience

None yet.
