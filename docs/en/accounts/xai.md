---
title: xAI login
feature_ids:
  - auth.xai.login
  - cli.server.xai-login
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# xAI login

## 1. What this solves

This page covers device-code login for xAI. The current login is not a local browser callback port.

## 2. Scope and non-goals

It does not include an API key, and it does not include x_search injection. The old documentation's `127.0.0.1:56121/callback` is not the current behavior of this command.

## 3. How to configure or call it

```bash
cli-proxy-api --xai-login
cli-proxy-api --xai-login --no-browser
```

The command requests a device code from xAI, prints the verification URL and the user code, and opens a browser unless `--no-browser` is set. The wait comes from the expiry seconds returned by xAI. On success it prints `xAI authentication successful`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| Xai login | The command that starts this login or import. |  | Started by --xai-login. |
| --xai-login | The command that starts this login or import. | false | Device-code flow. It does not use --oauth-callback-port. The wait comes from the expiry seconds returned by xAI. |

## 5. Common errors and limits

It fails when the device-code response is missing device_code, user_code, or the verification URL. Expiry, refusal, or cancellation of the context all end the login. `--oauth-callback-port` does not change this flow.

## 6. Related behavior

The search tool is in [xAI search tool](/configuration/provider/xai). The key is in [Upstream API keys](/accounts/api-keys-api).

## 7. Field experience

- [On an xAI 403, switch to an API key](/experience/accounts#exp-accounts-xai-api-key-fallback)
- [Log in to xAI with a device code](/experience/accounts#exp-accounts-xai-device-login)
- [Turn on the multi-agent compatibility switch](/experience/configuration#exp-configuration-optimize-multi-agent)
- [Use a payload filter to drop fields the upstream rejects](/experience/routing#exp-routing-filter-rejected-fields)
- [Patch a Grok sub-agent with a payload override](/experience/routing#exp-routing-override-grok-subagent)
