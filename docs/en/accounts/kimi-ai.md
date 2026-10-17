---
title: Kimi.ai login
feature_ids:
  - cli.server.kimi-ai-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Kimi.ai login

## 1. What this solves

This page covers device-code login for Kimi.ai. It is not the same provider as Kimi.com.

## 2. Scope and non-goals

It does not include Kimi.com, and it does not include the fingerprint used when Kimi is treated as a Claude gateway.

## 3. How to configure or call it

```bash
cli-proxy-api --kimi-ai-login
cli-proxy-api --kimi-ai-login --no-browser
```

The command prints the verification URL and the user code, and it opens a browser unless `--no-browser` is set. The saved provider is `kimi-ai`. `--oauth-callback-port` does not take part in this flow.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| --kimi-ai-login | The command that starts this login or import. | false | Kimi.ai device code. The saved provider is kimi-ai. The callback-port flag is not used. |

## 5. Common errors and limits

As with Kimi.com, a startup failure or an authorization failure returns with the `kimi:` prefix.

## 6. Related behavior

Kimi.com is in [Kimi login](/accounts/kimi). The fingerprint is in [Claude fingerprint](/accounts/api-keys-fingerprint).

## 7. Field experience

None yet.
