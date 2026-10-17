---
title: Claude request cloaking
feature_ids:
  - api-keys.claude.cloak-cache-user-id
  - api-keys.claude.cloak-mode
  - api-keys.claude.cloak-sensitive-words
  - api-keys.claude.cloak-strict-mode
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Claude request cloaking

## 1. What this solves

This page covers cloak on one Claude API key: when to cloak, how to handle the system prompt, sensitive words, and whether to cache user_id.

## 2. Scope and non-goals

The global default is upstream.claude.disable-claude-cloak-mode. An OAuth credential changes fields such as cloak_mode in the credential JSON, not the YAML on this page. The fingerprint is not a subfield of cloak.

## 3. How to configure or call it

```yaml
api-keys:
  claude:
    - name: claude-1
      keys:
        - api-key: "YOUR_API_KEY"
          cloak:
            mode: "auto"
            strict-mode: false
            sensitive-words:
              - "API"
            cache-user-id: false
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.cloak.cache-user-id | api-keys.claude.cloak.cache-user-id | nil | When omitted or false, each request generates a new random user_id. When true, it is reused by API key. |
| api-keys.claude.cloak.mode | api-keys.claude.cloak.mode | Mode controls cloaking behavior: "auto" (default), "always", or "never". | auto: do not cloak when there is a clear native-entry signal. always: cloak clients that are not confirmed, while confirmed native Claude Code still passes through. never: do not cloak. Writing a cloak block enables cloaking for an API key that has no fingerprint specified. |
| api-keys.claude.cloak.sensitive-words | api-keys.claude.cloak.sensitive-words | nil | Listed words are disrupted with zero-width characters in the matching prompt. When omitted, they are not processed. |
| api-keys.claude.cloak.strict-mode | api-keys.claude.cloak.strict-mode | - false (default): legacy-model whitelist uses a user reminder; all other models use a mid-conversation system message - true: strip caller system prompts and keep only the Claude Code billing and identity blocks | false: the legacy-model whitelist uses a user reminder, and other models use a system message in the conversation. true: strip the caller system and keep only the Claude Code billing and identity blocks. |

## 5. Common errors and limits

mode should be configured only as auto, always, or never. Writing a cloak block enables cloaking for an API key that has no fingerprint specified. Confirmed native Claude Code still passes through under always.

## 6. Related behavior

The global switch is in [Claude upstream behavior](/accounts/upstream). The fingerprint is in [Claude fingerprint](/accounts/api-keys-fingerprint).

## 7. Field experience

None yet.
