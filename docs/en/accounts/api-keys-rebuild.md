---
title: Rebuild Claude system messages
feature_ids:
  - api-keys.claude.rebuild-mid-system-message
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Rebuild Claude system messages

## 1. What this solves

Move Claude messages whose role is system into the top-level system field.

## 2. Scope and non-goals

This applies only to a Claude API key. It is not cloak.strict-mode.

## 3. How to configure or call it

```yaml
api-keys:
  claude:
    - name: claude-1
      keys:
        - api-key: "YOUR_API_KEY"
          rebuild-mid-system-message: false
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.rebuild-mid-system-message | Whether to merge system-role messages into the top-level system field. | false | When true, Claude messages whose role is system are moved to the top-level system field. false leaves them as they are. |

## 5. Common errors and limits

false leaves the messages as they are. true moves only messages whose role is system.

## 6. Related behavior

How cloaking treats system is in [Claude request cloaking](/accounts/api-keys-cloak).

## 7. Field experience

None yet.
