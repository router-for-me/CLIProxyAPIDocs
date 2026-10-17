---
title: "Management"
related_feature_ids:
  - api-keys.codex.priority
  - cli.server.codex-login
  - management.v8.get-credentials
  - management.v8.patch-credentials-fields
  - management.v8.patch-credentials-status
  - management.v8.post-requests-api-call
  - management.v8.post-routing-cooldown-reset
  - oauth.auth-dir.value
  - requests.proxy-url.value
  - route.management-html.get
  - routing.cooldown.disable-cooling
source_issues:
  - 3290
  - 3348
  - 3514
  - 3882
  - 4024
  - 4724
  - 5030
  - 5133
  - 5611
  - 5639
  - 5649
  - 6395
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Management

## Scope and limits

The practices on this page are checked only against configuration, routes, or commands that still exist in pinned commit `911f49cbd49f4fe2516979754a7488a3fd14fe64`. This page is not an official behavior promise. Keys, cookies, email addresses, authorization files, and user request bodies were not copied in.

## Short practices

- <a id="exp-management-reset-cooldown"></a>**Clear cooldown with the management route** (`exp.management.reset-cooldown`). Symptom: Upstream quota has already recovered, but the credential is still skipped because of cooldown. Action: POST the credential's auth_index to POST /v8/management/routing/cooldown/reset. PATCH /v8/management/credentials/status only changes disabled. It does not clear cooldown. Source issues: [#4724](https://github.com/router-for-me/CLIProxyAPI/issues/4724)、[#5611](https://github.com/router-for-me/CLIProxyAPI/issues/5611)、[#5639](https://github.com/router-for-me/CLIProxyAPI/issues/5639)、[#5649](https://github.com/router-for-me/CLIProxyAPI/issues/5649)。. Official pages: [Routing actions](/management/v8-routing)、[Cooldown](/routing/cooldown).
- <a id="exp-management-disable-credential"></a>**Pause a credential with the management API** (`exp.management.disable-credential`). Symptom: After quota is exhausted, the credential is only skipped by cooldown, and the file itself still participates. Action: Cooldown does not disable a credential automatically. Use PATCH /v8/management/credentials/status and set disabled to true or false to pause or restore it. Source issues: [#3882](https://github.com/router-for-me/CLIProxyAPI/issues/3882)、[#5133](https://github.com/router-for-me/CLIProxyAPI/issues/5133)。. Official pages: [Credentials](/management/v8-credentials)、[Cooldown](/routing/cooldown).
- <a id="exp-management-api-call-proxy-order"></a>**A management proxied request still uses the global proxy** (`exp.management.api-call-proxy-order`). Symptom: It seems a management proxied call always connects directly and never uses the model request's proxy-url. Action: POST /v8/management/requests/api-call uses, in order, the request body's proxy_url, the credential proxy, and then the global requests.proxy-url. It connects directly only when none of those proxies is available. Source issues: [#6395](https://github.com/router-for-me/CLIProxyAPI/issues/6395)。. Official pages: [Proxied request](/management/v8-requests)、[Outbound requests](/routing/requests-value).
- <a id="exp-management-disabled-oauth-still-refreshes"></a>**A disabled OAuth credential still refreshes** (`exp.management.disabled-oauth-still-refreshes`). Symptom: The token expires after the credential is turned off. Action: A real OAuth file still refreshes by default after disabled, so it does not expire while it is paused. A credential that did not come from OAuth does not refresh this way. Source issues: [#3290](https://github.com/router-for-me/CLIProxyAPI/issues/3290)、[#3514](https://github.com/router-for-me/CLIProxyAPI/issues/3514)。. Official pages: [Codex login](/accounts/codex)、[Credentials](/management/v8-credentials).
- <a id="exp-management-set-credential-priority"></a>**Set priority on the credential field** (`exp.management.set-credential-priority`). Symptom: Imported JSON needs a higher Plus or Pro priority. Action: Use PATCH /v8/management/credentials/fields to change that credential's priority. A new file has no separate default priority. It has to be written on the credential itself. Source issues: [#3348](https://github.com/router-for-me/CLIProxyAPI/issues/3348)、[#5030](https://github.com/router-for-me/CLIProxyAPI/issues/5030)。. Official pages: [Credential priority](/accounts/api-keys-priority)、[Credentials](/management/v8-credentials)、[OAuth directory, aliases, and exclusions](/accounts/oauth).
- <a id="exp-management-reset-codex-from-panel"></a>**Reset a Codex account from the management page** (`exp.management.reset-codex-from-panel`). Symptom: You want to reset a Codex account, but you only found the credential file. Action: Do it from the credential screen on the management page. The proxy has no other independent reset command. Source issues: [#4024](https://github.com/router-for-me/CLIProxyAPI/issues/4024)。. Official pages: [Codex login](/accounts/codex)、[Other endpoints](/api/openai-other).

## Standalone pages

This area has no practice that needs its own page.

