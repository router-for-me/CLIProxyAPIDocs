---
title: Claude login
feature_ids:
  - auth.claude.login
  - cli.server.claude-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Claude login

## 1. What this solves

This page explains how to log in to Claude with browser OAuth and write the token into the credential directory.

## 2. Scope and non-goals

It includes only --claude-login. API keys, cloaking, the fingerprint, and CCH are not on this page. Kimi login is not on this page either.

## 3. How to configure or call it

```bash
cli-proxy-api --claude-login
cli-proxy-api --claude-login --no-browser
cli-proxy-api --claude-login --oauth-callback-port 54545
```

The default listen port is `54545`. `--no-browser` prints the authorization URL and does not open a browser. The callback wait is 5 minutes. On success it prints the save path and `Claude authentication successful!`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| Claude login | The command that starts this login or import. |  | Started by --claude-login. The token is written to oauth.auth-dir. |
| --claude-login | The command that starts this login or import. | false | The default port is 54545, and the wait is 5 minutes. If the port is in use, the exit code is 13. |

## 5. Common errors and limits

If the port is already in use, the process ends with exit code 13. The error type is `port_in_use`. Other authentication failures print `Claude authentication failed:` and do not necessarily exit the process.

## 6. Related behavior

The key and cloaking are in [Upstream API keys](/accounts/api-keys-api) and [Claude request cloaking](/accounts/api-keys-cloak). The main-service callback is in [OAuth callbacks](/accounts/oauth-callback).

## 7. Field experience

- [Turn Claude cloak off when it is not needed](/experience/accounts#exp-accounts-claude-cloak-off)
- [Use manual login when there is no browser](/experience/accounts#exp-accounts-claude-manual-login)
- [Send the client key when calling a public route](/experience/api#exp-api-require-client-key)
- [Provide a configuration file or a login before startup](/experience/introduction#exp-introduction-start-with-config-or-login)
- [auth_unavailable means no usable credential](/experience/operations#exp-operations-auth-unavailable-means-no-credential)
- [Let the server complete login through a proxy itself](/experience/routing#exp-routing-proxy-for-token-exchange)
