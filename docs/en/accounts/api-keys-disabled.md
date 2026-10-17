---
title: Disable an OpenAI-compatible provider
feature_ids:
  - api-keys.openai-compatibility.disabled
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Disable an OpenAI-compatible provider

## 1. What this solves

Stop one OpenAI-compatible provider from taking part in routing without deleting its configuration.

## 2. Scope and non-goals

This applies only to one provider entry under `api-keys.openai-compatibility`. It cannot disable one Claude or Gemini key.

## 3. How to configure or call it

```yaml
api-keys:
  openai-compatibility:
    - name: openrouter
      disabled: true
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.openai-compatibility.disabled | Whether this whole OpenAI-compatible provider is disabled. | false | When true, that provider does not take part in routing. When false, it is used normally. |

## 5. Common errors and limits

true only keeps it out of routing. It does not raise an error on load. false or omitting it means the provider is available.

## 6. Related behavior

The name is in [OpenAI-compatible provider name](/accounts/api-keys-name).

## 7. Field experience

- [Use disabled to turn off a compatible provider](/experience/accounts#exp-accounts-disable-compat-provider)
