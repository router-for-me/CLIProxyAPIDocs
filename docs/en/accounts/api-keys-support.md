---
title: prompt_cache_key
feature_ids:
  - api-keys.openai-compatibility.support-prompt-cache-key
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# prompt_cache_key

## 1. What this solves

Let one OpenAI-compatible provider inject a derived prompt_cache_key for requests that support it.

## 2. Scope and non-goals

This is only this one setting. It is not support-configuration-update on a Codex model.

## 3. How to configure or call it

```yaml
api-keys:
  openai-compatibility:
    - name: openrouter
      base-url: "https://example.invalid"
      support-prompt-cache-key: false
      keys:
        - api-key: "YOUR_API_KEY"
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.openai-compatibility.support-prompt-cache-key | Whether to inject a derived prompt_cache_key. | false | When true, a derived prompt_cache_key is injected for requests that support it. When false, it is not injected. |

## 5. Common errors and limits

false, or omitting the key, injects nothing. true applies only to requests that support the field.

## 6. Related behavior

configuration_update on a model is in [Upstream model aliases](/accounts/api-keys-models).

## 7. Field experience

None yet.
