---
title: Experimental CCH signing
feature_ids:
  - api-keys.claude.experimental-cch-signing
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Experimental CCH signing

## 1. What this solves

Keep experimental-cch-signing from an old configuration so an old file can still be loaded.

## 2. Scope and non-goals

It no longer turns signing on or off by itself. A real Claude OAuth credential, and a claude-code-cli fingerprint on api.anthropic.com, sign automatically.

## 3. How to configure or call it

```yaml
api-keys:
  claude:
    - name: claude-1
      keys:
        - api-key: "YOUR_API_KEY"
          experimental-cch-signing: false
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.experimental-cch-signing | CCH switch kept for old configuration. | false | api-keys.claude.experimental-cch-signing |

## 5. Common errors and limits

This boolean is not rejected because it is true or false. Setting it to true does not add extra signing on an unsupported gateway.

## 6. Related behavior

The fingerprint is in [Claude fingerprint](/accounts/api-keys-fingerprint).

## 7. Field experience

None yet.
