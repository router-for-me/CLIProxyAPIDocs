---
title: Antigravity login
feature_ids:
  - auth.antigravity.login
  - cli.server.antigravity-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Antigravity login

## 1. What this solves

This page explains how to log an Antigravity account into this proxy and save the token in the credential directory.

## 2. Scope and non-goals

It includes only --antigravity-login and the matching login entry. The connection pool, sensitive words, credits, and signature cache are on the Antigravity provider options page. If the callback hits the running main service, see OAuth callbacks.

## 3. How to configure or call it

```bash
cli-proxy-api --antigravity-login
cli-proxy-api --antigravity-login --no-browser
cli-proxy-api --antigravity-login --oauth-callback-port 51121
```

By default it waits on local port `51121`. The callback path is `/oauth-callback`. When `--oauth-callback-port` is greater than 0, that port is used. `--no-browser` only prints the address and the SSH tunnel hint. It does not open a browser. The wait is 5 minutes. On success it prints the save path, the account label, and `Antigravity authentication successful!`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| Antigravity login | The command that starts this login or import. |  | Started by --antigravity-login. |
| --antigravity-login | The command that starts this login or import. | false | The default port is 51121, the path is /oauth-callback, and the wait is 5 minutes. On failure it only logs the error and returns. |

## 5. Common errors and limits

If the callback port cannot be listened on, or authentication fails, the command logs the error and returns. It does not end with exit code 13 the way Claude or Codex does. This is not a client API key.

## 6. Related behavior

Provider options are in [Antigravity provider options](/configuration/provider/antigravity). The callback on the main service is in [OAuth callbacks](/accounts/oauth-callback). The credential directory is in [OAuth directory, aliases, and exclusions](/accounts/oauth).

## 7. Field experience

- [Map a client model name to the real model with an alias](/experience/accounts#exp-accounts-alias-client-model)
- [Antigravity hides models the account cannot use](/experience/accounts#exp-accounts-antigravity-hides-unusable-models)
- [Use Antigravity login for a Google account instead of Gemini CLI](/experience/accounts#exp-accounts-antigravity-instead-of-gemini-cli)
- [Log in again after an Antigravity credential expires](/experience/accounts#exp-accounts-antigravity-login-again)
- [Set a User-Agent on an Antigravity credential](/experience/accounts#exp-accounts-antigravity-user-agent)
- [Keep waiting for the callback during Antigravity login](/experience/accounts#exp-accounts-antigravity-wait-for-callback)
- [A refresh worker count of 0 still uses the default](/experience/accounts#exp-accounts-refresh-workers-zero)
- [Antigravity Claude uses messages](/experience/api#exp-api-antigravity-claude-messages)
- [Antigravity images use chat completions](/experience/api#exp-api-antigravity-image-chat)
- [The count endpoint counts tools the upstream way](/experience/api#exp-api-count-tokens-tool-shape)
- [Do not expect the proxy to invent reasoning text the catalog did not return](/experience/api#exp-api-no-synthetic-reasoning)
- [The client uses the model id from the catalog](/experience/api#exp-api-use-listed-model-id)
- [Declare thinking levels on the model entry](/experience/configuration#exp-configuration-declare-thinking-levels)
- [Visible models follow the pinned catalog](/experience/introduction#exp-introduction-catalog-is-authoritative)
- [auth_unavailable means no usable credential](/experience/operations#exp-operations-auth-unavailable-means-no-credential)
- [After a 429, skip that model until the reset time](/experience/routing#exp-routing-cooldown-until-reset)
- [Let the server complete login through a proxy itself](/experience/routing#exp-routing-proxy-for-token-exchange)

