---
title: Model-name prefix
feature_ids:
  - api-keys.claude.prefix
  - api-keys.codex.prefix
  - api-keys.gemini.prefix
  - api-keys.interactions.prefix
  - api-keys.meta.prefix
  - api-keys.openai-compatibility.prefix
  - api-keys.vertex.prefix
  - api-keys.xai.prefix
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Model-name prefix

## 1. What this solves

Add a model-name prefix to one credential or one provider, so models with the same name in different groups do not mix.

## 2. Scope and non-goals

The prefix is written on the group, and a single key can override it. It is not an OAuth alias.

## 3. How to configure or call it

```yaml
api-keys:
  gemini:
    - name: gemini-1
      prefix: "teamA"
      keys:
        - api-key: "YOUR_API_KEY"
```

A call uses `teamA/` plus the model name before this group is selected.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.prefix | Model-name prefix required when calling that credential. | empty string | When omitted, no prefix is added. After it is set, the client model name must carry this prefix before that credential is selected. |
| api-keys.codex.prefix | Model-name prefix required when calling that credential. | empty string | When omitted, no prefix is added. After it is set, the client model name must carry this prefix before that credential is selected. |
| api-keys.gemini.prefix | Model-name prefix required when calling that credential. | empty string | When omitted, no prefix is added. After it is set, the client model name must carry this prefix before that credential is selected. |
| api-keys.interactions.prefix | Model-name prefix required when calling that credential. | empty string | When omitted, no prefix is added. After it is set, the client model name must carry this prefix before that credential is selected. |
| api-keys.meta.prefix | Model-name prefix required when calling that credential. | empty string | When omitted, no prefix is added. After it is set, the client model name must carry this prefix before that credential is selected. |
| api-keys.openai-compatibility.prefix | Model-name prefix required when calling that credential. | empty string | When omitted, no prefix is added. After it is set, the client model name must carry this prefix before that credential is selected. |
| api-keys.vertex.prefix | Model-name prefix required when calling that credential. | empty string | When omitted, no prefix is added. After it is set, the client model name must carry this prefix before that credential is selected. |
| api-keys.xai.prefix | Model-name prefix required when calling that credential. | empty string | When omitted, no prefix is added. After it is set, the client model name must carry this prefix before that credential is selected. |

## 5. Common errors and limits

An empty string means no prefix is required. Load does not check whether the prefix contains a slash.

## 6. Related behavior

Aliases are in [Upstream model aliases](/accounts/api-keys-models).

## 7. Field experience

- [A compatible model appears in the list only after it is written into the configuration](/experience/accounts#exp-accounts-list-compat-models)
- [If a request without a prefix fails, check the forced prefix](/experience/routing#exp-routing-force-prefix-off)

