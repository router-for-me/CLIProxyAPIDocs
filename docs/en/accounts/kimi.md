---
title: Kimi login
feature_ids:
  - auth.kimi.login
  - cli.server.kimi-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Kimi login

## 1. What this solves

This page covers device-code login for Kimi.com.

## 2. Scope and non-goals

Kimi.ai uses a different command. See Kimi.ai login. This page does not configure an API key.

## 3. How to configure or call it

```bash
cli-proxy-api --kimi-login
cli-proxy-api --kimi-login --no-browser
```

The command prints the verification URL and the user code. Without `--no-browser` it tries to open a browser. The saved provider is `kimi`. This flow does not use `--oauth-callback-port`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| Kimi login | The command that starts this login or import. |  | Kimi.com uses --kimi-login. Kimi.ai uses --kimi-ai-login. |
| --kimi-login | The command that starts this login or import. | false | Kimi.com device code. The saved provider is kimi. The callback-port flag is not used. |

## 5. Common errors and limits

If the device-code flow cannot start, it fails. The error contains `kimi: failed to start device flow`. If authorization times out or is refused, it fails. The error contains `kimi:`.

## 6. Related behavior

Kimi.ai is in [Kimi.ai login](/accounts/kimi-ai).

## 7. Field experience

- [Kimi uses the international-site login](/experience/accounts#exp-accounts-kimi-international-login)
- [A broken Kimi key should switch to OAuth](/experience/accounts#exp-accounts-kimi-oauth-instead-of-broken-key)
- [Kimi responses keep Kimi's own tools](/experience/api#exp-api-kimi-native-responses)
- [Visible models follow the pinned catalog](/experience/introduction#exp-introduction-catalog-is-authoritative)
