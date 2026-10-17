---
title: AI Studio WebSocket authentication
feature_ids:
  - oauth.providers.aistudio-ws-auth
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# AI Studio WebSocket authentication

## 1. What this solves

Decide whether the WebSocket API requires authentication.

## 2. Scope and non-goals

This page no longer describes third-party AI Studio applications. It keeps only ws-auth from the pinned code.

## 3. How to configure or call it

```yaml
oauth:
  providers:
    aistudio:
      ws-auth: true
```

An old file can still write `ws-auth` at the root. The sample maps this switch to `/v1/ws`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| oauth.providers.aistudio.ws-auth | oauth.providers.aistudio.ws-auth | false | oauth.providers.aistudio.ws-auth |

## 5. Common errors and limits

The loader sets the value to true before parsing YAML, so omitting it means authentication is on. Only an explicit false turns it off. The default text in the table is still the ledger's false. That is the field's zero value, not the loaded result.

## 6. Related behavior

Login and aliases are in [OAuth directory, aliases, and exclusions](/accounts/oauth).

## 7. Field experience

- [Send images through AI Studio](/experience/accounts#exp-accounts-aistudio-for-images)
- [An HTTPS page uses wss](/experience/accounts#exp-accounts-aistudio-wss)
- [Gemini images and structured output use the native route](/experience/api#exp-api-gemini-native-route)
