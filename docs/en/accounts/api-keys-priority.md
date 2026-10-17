---
title: Credential priority
feature_ids:
  - api-keys.claude.priority
  - api-keys.codex.priority
  - api-keys.gemini.priority
  - api-keys.interactions.priority
  - api-keys.meta.priority
  - api-keys.openai-compatibility.priority
  - api-keys.vertex.priority
  - api-keys.xai.priority
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Credential priority

## 1. What this solves

When several credentials can handle the same model, priority decides which one is chosen first.

## 2. Scope and non-goals

The priority of an OpenAI-compatible provider is on the provider. Other providers can write it on the group, and a key can override it. Weight is another page.

## 3. How to configure or call it

```yaml
api-keys:
  claude:
    - name: claude-1
      priority: 0
      keys:
        - api-key: "YOUR_API_KEY"
          priority: 10
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.priority | Priority when several credentials match at once. | Higher values are preferred; defaults to 0. | A higher number is preferred. When omitted, it is 0. |
| api-keys.codex.priority | Priority when several credentials match at once. | Higher values are preferred; defaults to 0. | A higher number is preferred. When omitted, it is 0. |
| api-keys.gemini.priority | Priority when several credentials match at once. | Higher values are preferred; defaults to 0. | A higher number is preferred. When omitted, it is 0. |
| api-keys.interactions.priority | Priority when several credentials match at once. | Higher values are preferred; defaults to 0. | A higher number is preferred. When omitted, it is 0. |
| api-keys.meta.priority | Priority when several credentials match at once. | Higher values are preferred; defaults to 0. | A higher number is preferred. When omitted, it is 0. |
| api-keys.openai-compatibility.priority | Priority when several credentials match at once. | Higher values are preferred; defaults to 0. | A higher number is preferred. When omitted, it is 0. |
| api-keys.vertex.priority | Priority when several credentials match at once. | Higher values are preferred; defaults to 0. | A higher number is preferred. When omitted, it is 0. |
| api-keys.xai.priority | Priority when several credentials match at once. | Higher values are preferred; defaults to 0. | A higher number is preferred. When omitted, it is 0. |

## 5. Common errors and limits

There is no range rejection. A higher number is preferred. Omitting it means 0.

## 6. Related behavior

Weight is in [Credential weight](/accounts/api-keys-weight).

## 7. Field experience

- [Codex goal mode needs all three settings together](/experience/accounts#exp-accounts-codex-goal-mode)
- [Set priority on a credential field](/experience/management#exp-management-set-credential-priority)
- [Round-robin starts only after priority is exhausted](/experience/routing#exp-routing-priority-before-strategy)

