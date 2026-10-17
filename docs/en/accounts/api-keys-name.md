---
title: OpenAI-compatible provider name
feature_ids:
  - api-keys.openai-compatibility.name
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# OpenAI-compatible provider name

## 1. What this solves

Give one OpenAI-compatible upstream a stable name, used for identification and in places such as User-Agent.

## 2. Scope and non-goals

`name` on other provider v8 groups is only a group label. It is not the feature on this page.

## 3. How to configure or call it

```yaml
api-keys:
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
| api-keys.openai-compatibility.name | Identifying name of the OpenAI-compatible provider. | empty string | Used to identify this OpenAI-compatible provider. The template says it appears in places such as User-Agent. |

## 5. Common errors and limits

An empty name has no separate rejection message. An entry without a base-url is removed while the configuration is normalized.

## 6. Related behavior

Disabling it is in [Disable an OpenAI-compatible provider](/accounts/api-keys-disabled).

## 7. Field experience

- [Compatible providers share the same routing strategy](/experience/routing#exp-routing-compat-shares-strategy)
