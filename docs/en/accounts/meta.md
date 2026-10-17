---
title: Meta login
feature_ids:
  - auth.meta.login
  - cli.server.meta-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Meta login

## 1. What this solves

This page covers device-code login for Meta Muse.

## 2. Scope and non-goals

API keys are on the upstream-key pages. This page does not describe Muse's internal token exchange.

## 3. How to configure or call it

```bash
cli-proxy-api --meta-login
cli-proxy-api --meta-login --no-browser
```

The command prints the verification URL and the user code. Without `--no-browser` it opens a browser and waits until Meta reports expiry or the authorization completes. `--oauth-callback-port` is not used by this flow.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| Meta login | The command that starts this login or import. |  | Started by --meta-login. |
| --meta-login | The command that starts this login or import. | false | Meta Muse device code. The callback-port flag is not used. |

## 5. Common errors and limits

It fails when the device code or the user code is missing. When the device code expires, the error contains `device code has expired`. If authorization is refused, the flow fails.

## 6. Related behavior

The key is in [Upstream API keys](/accounts/api-keys-api).

## 7. Field experience

None yet.
