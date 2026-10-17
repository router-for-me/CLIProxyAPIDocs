---
title: Responses WebSocket transport
feature_ids:
  - api-keys.codex.websockets
  - api-keys.meta.websockets
  - api-keys.xai.websockets
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Responses WebSocket transport

## 1. What this solves

Let one Codex, xAI, or Meta API key use the Responses WebSocket transport.

## 2. Scope and non-goals

This is a per-key switch. Codex full-duplex response-steering is a provider option. It is not on this page.

## 3. How to configure or call it

```yaml
api-keys:
  codex:
    - name: codex-1
      keys:
        - api-key: "YOUR_API_KEY"
          websockets: false
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.codex.websockets | Whether this key uses the Responses WebSocket transport. | false | When false, Responses WebSocket transport is not enabled for that key. |
| api-keys.meta.websockets | Whether this key uses the Responses WebSocket transport. | false | When false, Responses WebSocket transport is not enabled for that key. |
| api-keys.xai.websockets | Whether this key uses the Responses WebSocket transport. | false | When false, Responses WebSocket transport is not enabled for that key. |

## 5. Common errors and limits

false leaves it disabled. It does not open a media relay.

## 6. Related behavior

Provider-level WebSocket behavior is in [Codex provider options](/configuration/provider/codex).

## 7. Field experience

- [Codex goal mode needs all three settings together](/experience/accounts#exp-accounts-codex-goal-mode)
- [Codex can use the client WebSocket or the proxy WebSocket](/experience/accounts#exp-accounts-codex-websocket-or-http)
