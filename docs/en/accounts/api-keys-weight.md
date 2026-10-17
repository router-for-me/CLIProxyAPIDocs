---
title: Credential weight
feature_ids:
  - api-keys.claude.weight
  - api-keys.codex.weight
  - api-keys.gemini.weight
  - api-keys.interactions.weight
  - api-keys.meta.weight
  - api-keys.vertex.weight
  - api-keys.xai.weight
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Credential weight

## 1. What this solves

Give each upstream key a share in weighted round-robin.

## 2. Scope and non-goals

The weight of an OpenAI-compatible provider is on the keys entry. After load the field name is api-key-entries.weight. Other providers write it on keys. Priority is not weight.

## 3. How to configure or call it

```yaml
api-keys:
  claude:
    - name: claude-1
      keys:
        - api-key: "YOUR_API_KEY"
          weight: 1
  openai-compatibility:
    - name: openrouter
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
          weight: 1
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.weight | Share in weighted round-robin. | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | When omitted, it is treated as 1. An integer less than or equal to 0 does not take part in weighted selection. A non-integer makes configuration loading fail. The error contains weight must be an integer. Greater than 1000000 fails. The error contains weight must not exceed 1000000. |
| api-keys.codex.weight | Share in weighted round-robin. | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | When omitted, it is treated as 1. An integer less than or equal to 0 does not take part in weighted selection. A non-integer makes configuration loading fail. The error contains weight must be an integer. Greater than 1000000 fails. The error contains weight must not exceed 1000000. |
| api-keys.gemini.weight | Share in weighted round-robin. | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | When omitted, it is treated as 1. An integer less than or equal to 0 does not take part in weighted selection. A non-integer makes configuration loading fail. The error contains weight must be an integer. Greater than 1000000 fails. The error contains weight must not exceed 1000000. |
| api-keys.interactions.weight | Share in weighted round-robin. | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | When omitted, it is treated as 1. An integer less than or equal to 0 does not take part in weighted selection. A non-integer makes configuration loading fail. The error contains weight must be an integer. Greater than 1000000 fails. The error contains weight must not exceed 1000000. |
| api-keys.meta.weight | Share in weighted round-robin. | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | When omitted, it is treated as 1. An integer less than or equal to 0 does not take part in weighted selection. A non-integer makes configuration loading fail. The error contains weight must be an integer. Greater than 1000000 fails. The error contains weight must not exceed 1000000. |
| api-keys.vertex.weight | Share in weighted round-robin. | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | When omitted, it is treated as 1. An integer less than or equal to 0 does not take part in weighted selection. A non-integer makes configuration loading fail. The error contains weight must be an integer. Greater than 1000000 fails. The error contains weight must not exceed 1000000. |
| api-keys.xai.weight | Share in weighted round-robin. | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | When omitted, it is treated as 1. An integer less than or equal to 0 does not take part in weighted selection. A non-integer makes configuration loading fail. The error contains weight must be an integer. Greater than 1000000 fails. The error contains weight must not exceed 1000000. |

## 5. Common errors and limits

When omitted, it is treated as 1. A value less than or equal to 0 excludes that credential and does not report an error. A non-integer, or a value greater than 1000000, makes configuration loading fail.

## 6. Related behavior

Priority is in [Credential priority](/accounts/api-keys-priority).

## 7. Field experience

None yet.

