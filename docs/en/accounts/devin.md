---
title: Devin login
feature_ids:
  - auth.devin.login
  - cli.server.devin-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Devin login

## 1. What this solves

This page explains how to log in to Devin / Cognition and save the session credential.

## 2. Scope and non-goals

Sensitive words are in the provider settings on the OAuth page, not here. `/callback` on the main service is also its own page.

## 3. How to configure or call it

```bash
cli-proxy-api --devin-login
cli-proxy-api --devin-login --no-browser
```

Without `--no-browser`, a temporary port is bound by default. When `--oauth-callback-port` is greater than 0, that port is used instead. The callback address looks like `http://127.0.0.1:<port>/callback`, and the wait is 5 minutes. `--no-browser` does not start a callback port. It asks you to paste an authorization code or session token at the prompt. The prompt is `Paste the Devin authorization code or session token directly:`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| Devin login | The command that starts this login or import. |  | Started by --devin-login. It can be a browser callback or a pasted token. |
| --devin-login | The command that starts this login or import. | false | The default is a temporary port. With --no-browser it switches to pasting an authorization code or session token. The callback wait is 5 minutes. |

## 5. Common errors and limits

No-browser mode fails when there is no interactive prompt. The error contains `requires an interactive prompt`. Empty input cancels. A state mismatch fails. The error contains `state mismatch`. A failed callback write is on the OAuth callback page.

## 6. Related behavior

Sensitive words are in [OAuth directory, aliases, and exclusions](/accounts/oauth). The main-service callback is in [OAuth callbacks](/accounts/oauth-callback).

## 7. Field experience

None yet.
