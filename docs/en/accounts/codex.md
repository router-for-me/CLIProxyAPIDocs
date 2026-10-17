---
title: Codex login
feature_ids:
  - auth.codex.login
  - cli.server.codex-device-login
  - cli.server.codex-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Codex login

## 1. What this solves

This page covers the two Codex logins: a browser callback, and a device code.

## 2. Scope and non-goals

It does not include API keys, WebSocket, Alpha Search, or the provider-level stream buffer and media relay.

## 3. How to configure or call it

```bash
cli-proxy-api --codex-login
cli-proxy-api --codex-login --no-browser
cli-proxy-api --codex-device-login
```

Browser login listens on `1455` by default. The callback path is `/auth/callback`, and the wait is 5 minutes. Device-code login prints `https://auth.openai.com/codex/device` and the device code. Unless `--no-browser` is set, it tries to open that address. The device-code flow does not wait on a local OAuth port. The maximum wait is 15 minutes.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| Codex login | The command that starts this login or import. |  | The browser flow uses --codex-login. The device code uses --codex-device-login. |
| --codex-device-login | The command that starts this login or import. | false | Prints the device address and device code, waits at most 15 minutes, and does not listen on an OAuth port. |
| --codex-login | The command that starts this login or import. | false | The default port is 1455, the path is /auth/callback, and the wait is 5 minutes. If the port is in use, the exit code is 13. |

## 5. Common errors and limits

Browser login ends with exit code 13 when the port is in use. If the device-code response is missing required fields, it fails. The errors are `codex device flow did not return required fields` or `codex device flow token response missing required fields`.

## 6. Related behavior

Provider options are in [Codex provider options](/configuration/provider/codex). The key is in [Upstream API keys](/accounts/api-keys-api).

## 7. Field experience

- [A Codex credential file cannot contain comments](/experience/accounts#exp-accounts-codex-auth-file-shape)
- [After a successful Codex callback, return to the terminal to confirm](/experience/accounts#exp-accounts-codex-callback-enter)
- [A Codex client must match the User-Agent default](/experience/accounts#exp-accounts-codex-client-user-agent)
- [The desktop app points at the proxy in its own way](/experience/accounts#exp-accounts-codex-desktop-proxy)
- [Keep two workspaces for the same Codex account](/experience/accounts#exp-accounts-codex-keep-workspaces)
- [Log in to Codex again after a plan or token change](/experience/accounts#exp-accounts-codex-login-again)
- [Claude Code uses a Codex login instead of a raw token](/experience/accounts#exp-accounts-codex-login-for-claude-code)
- [Built-in images use Codex OAuth](/experience/accounts#exp-accounts-codex-oauth-for-images)
- [Advanced account security makes Codex refresh more often](/experience/accounts#exp-accounts-codex-refresh-security)
- [Exclude a model on a single credential](/experience/accounts#exp-accounts-exclude-model)
- [A Codex client calls the responses route](/experience/api#exp-api-call-responses)
- [Stop injecting the image tool](/experience/api#exp-api-disable-image-tool-injection)
- [Drop unsupported Claude fields before sending to Codex](/experience/api#exp-api-drop-unsupported-claude-fields)
- [Do not expect the proxy to invent reasoning text the catalog did not return](/experience/api#exp-api-no-synthetic-reasoning)
- [Send the client key when calling a public route](/experience/api#exp-api-require-client-key)
- [responses uses instructions instead of system](/experience/api#exp-api-responses-instructions)
- [Turn on the multi-agent compatibility switch](/experience/configuration#exp-configuration-optimize-multi-agent)
- [Visible models follow the pinned catalog](/experience/introduction#exp-introduction-catalog-is-authoritative)
- [A disabled OAuth credential is still refreshed](/experience/management#exp-management-disabled-oauth-still-refreshes)
- [Reset a Codex account from the management page](/experience/management#exp-management-reset-codex-from-panel)
- [auth_unavailable means no usable credential](/experience/operations#exp-operations-auth-unavailable-means-no-credential)
- [After a 429, skip that model until the reset time](/experience/routing#exp-routing-cooldown-until-reset)
- [Turn cooling off to keep the credential selectable](/experience/routing#exp-routing-disable-cooling)
- [Let the server complete login through a proxy itself](/experience/routing#exp-routing-proxy-for-token-exchange)
- [responses rotates by a shared cache key](/experience/routing#exp-routing-responses-cache-key)
- [Models with the same name share a routing strategy](/experience/routing#exp-routing-same-model-name)
