---
title: "Routing and requests"
related_feature_ids:
  - api-keys.claude.prefix
  - api-keys.claude.priority
  - api-keys.claude.proxy-url
  - api-keys.codex.models-name
  - api-keys.codex.models-thinking-levels
  - api-keys.codex.priority
  - api-keys.codex.proxy-url
  - api-keys.gemini.api-key
  - api-keys.gemini.proxy-url
  - api-keys.openai-compatibility.base-url
  - api-keys.openai-compatibility.models-alias
  - api-keys.openai-compatibility.name
  - api-keys.xai.models-thinking-levels
  - cli.server.antigravity-login
  - cli.server.claude-login
  - cli.server.codex-login
  - cli.server.xai-login
  - management.disable-control-panel.value
  - management.secret-key.value
  - management.v8.get-credentials
  - mode.docker.compose
  - models.codex-catalog.value
  - multimedia.gpt-image-2-base-model.value
  - oauth.auth-dir.value
  - oauth.model-alias.alias
  - oauth.model-alias.fork
  - requests.payload.default-params
  - requests.payload.filter-params
  - requests.payload.override-params
  - requests.proxy-url.value
  - requests.streaming.keepalive-seconds
  - route.management-html.get
  - route.v1.get-models
  - route.v1.post-chat-completions
  - route.v1.post-messages
  - route.v1.post-responses
  - routing.cooldown.disable-cooling
  - routing.cooldown.save-cooldown-status
  - routing.force-model-prefix.value
  - routing.retry.max-retry-interval
  - routing.retry.request-retry
  - routing.session-affinity.value
  - routing.strategy.value
source_issues:
  - 48
  - 178
  - 197
  - 304
  - 417
  - 480
  - 557
  - 690
  - 711
  - 737
  - 768
  - 784
  - 845
  - 847
  - 893
  - 937
  - 966
  - 976
  - 1021
  - 1044
  - 1072
  - 1089
  - 1160
  - 1186
  - 1213
  - 1217
  - 1236
  - 1256
  - 1290
  - 1304
  - 1376
  - 1382
  - 1456
  - 1647
  - 1712
  - 1740
  - 1749
  - 1793
  - 2050
  - 2107
  - 2180
  - 2261
  - 2352
  - 2369
  - 2378
  - 2404
  - 2425
  - 2470
  - 2546
  - 2593
  - 2611
  - 2632
  - 2687
  - 2758
  - 2811
  - 2855
  - 2877
  - 2913
  - 2934
  - 2943
  - 2961
  - 2965
  - 3126
  - 3189
  - 3288
  - 3301
  - 3429
  - 3577
  - 3655
  - 3707
  - 3711
  - 3884
  - 4105
  - 4149
  - 4203
  - 4263
  - 4327
  - 4439
  - 4453
  - 4474
  - 4502
  - 4508
  - 4706
  - 4846
  - 5112
  - 5286
  - 5648
  - 5983
  - 6178
  - 6284
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Routing and requests

## Scope and limits

The practices on this page are checked only against configuration, routes, or commands that still exist in pinned commit `911f49cbd49f4fe2516979754a7488a3fd14fe64`. This page is not an official behavior promise. Keys, cookies, email addresses, authorization files, and user request bodies were not copied in.

## Short practices

- <a id="exp-routing-same-model-name"></a>**Models with the same name share the routing strategy** (`exp.routing.same-model-name`). Symptom: Several providers, OAuth credentials, or API keys publish the same model name. Action: Those credentials all enter routing.strategy. There is no separate per-provider picker. An unstable Antigravity name is not merged into the same group. To separate the names the client sees, use a model alias rather than adding another gateway mode. Source issues: [#48](https://github.com/router-for-me/CLIProxyAPI/issues/48)、[#178](https://github.com/router-for-me/CLIProxyAPI/issues/178)、[#197](https://github.com/router-for-me/CLIProxyAPI/issues/197)、[#737](https://github.com/router-for-me/CLIProxyAPI/issues/737)、[#893](https://github.com/router-for-me/CLIProxyAPI/issues/893)、[#2369](https://github.com/router-for-me/CLIProxyAPI/issues/2369)、[#2425](https://github.com/router-for-me/CLIProxyAPI/issues/2425)、[#5983](https://github.com/router-for-me/CLIProxyAPI/issues/5983)。. Official pages: [Upstream model aliases](/accounts/api-keys-models)、[Upstream API keys](/accounts/api-keys-api)、[Codex login](/accounts/codex)、[OAuth directory, aliases, and exclusions](/accounts/oauth)、[Routing strategy](/routing/strategy).
- <a id="exp-routing-fill-first"></a>**Use fill-first to exhaust one credential** (`exp.routing.fill-first`). Symptom: The same model should finish one account before moving on, rather than rotating on every request. Action: Set routing.strategy to fill-first. Matching credentials are taken in a fixed order, and the first one that is still available is used until it can no longer serve, instead of rotating on every request. Source issues: [#768](https://github.com/router-for-me/CLIProxyAPI/issues/768)、[#784](https://github.com/router-for-me/CLIProxyAPI/issues/784)、[#845](https://github.com/router-for-me/CLIProxyAPI/issues/845)、[#937](https://github.com/router-for-me/CLIProxyAPI/issues/937)、[#1304](https://github.com/router-for-me/CLIProxyAPI/issues/1304)。. Official pages: [Routing strategy](/routing/strategy).
- <a id="exp-routing-round-robin-skip"></a>**Round-robin skips credentials that cannot serve** (`exp.routing.round-robin-skip`). Symptom: With round-robin on, traffic still seems concentrated on a few accounts. Action: The default strategy remembers a cursor per model and skips credentials that cannot serve right now, so it can look like one account is filled first. After a credential refresh, the cursor is still kept per model. This is not a random strategy. Source issues: [#1021](https://github.com/router-for-me/CLIProxyAPI/issues/1021)、[#2470](https://github.com/router-for-me/CLIProxyAPI/issues/2470)、[#2611](https://github.com/router-for-me/CLIProxyAPI/issues/2611)。. Official pages: [Routing strategy](/routing/strategy).
- <a id="exp-routing-disable-cooling"></a>**Turn cooling off to keep a credential selectable** (`exp.routing.disable-cooling`). Symptom: auth_unavailable appears after repeated upstream errors, or a model disappears from the list. Action: Set routing.cooldown.disable-cooling to true. An explicit value on the credential or provider wins. Failures then no longer cool the credential out of selection. There is no other cooldown-duration key. Source issues: [#976](https://github.com/router-for-me/CLIProxyAPI/issues/976)、[#1072](https://github.com/router-for-me/CLIProxyAPI/issues/1072)、[#1712](https://github.com/router-for-me/CLIProxyAPI/issues/1712)、[#2107](https://github.com/router-for-me/CLIProxyAPI/issues/2107)、[#2261](https://github.com/router-for-me/CLIProxyAPI/issues/2261)、[#2687](https://github.com/router-for-me/CLIProxyAPI/issues/2687)、[#2855](https://github.com/router-for-me/CLIProxyAPI/issues/2855)、[#3707](https://github.com/router-for-me/CLIProxyAPI/issues/3707)、[#4706](https://github.com/router-for-me/CLIProxyAPI/issues/4706)。. Official pages: [Codex login](/accounts/codex)、[OAuth directory, aliases, and exclusions](/accounts/oauth)、[OpenAI Chat](/api/openai-chat)、[Cooldown](/routing/cooldown).
- <a id="exp-routing-cooldown-until-reset"></a>**After a 429, skip that model until the recovery time** (`exp.routing.cooldown-until-reset`). Symptom: After an account reports 429 or exhausted quota, later requests no longer select it. Action: The proxy cools that model for the recovery time given by the error and skips it during selection until the time is reached. Cooldown is recorded per model. Refreshing the token does not require closing the credential file first. Other credentials for the same model are skipped only while this cooldown is still in effect. Source issues: [#1456](https://github.com/router-for-me/CLIProxyAPI/issues/1456)、[#2593](https://github.com/router-for-me/CLIProxyAPI/issues/2593)、[#2632](https://github.com/router-for-me/CLIProxyAPI/issues/2632)、[#3655](https://github.com/router-for-me/CLIProxyAPI/issues/3655)、[#4508](https://github.com/router-for-me/CLIProxyAPI/issues/4508)、[#5286](https://github.com/router-for-me/CLIProxyAPI/issues/5286)。. Official pages: [Antigravity login](/accounts/antigravity)、[Codex login](/accounts/codex)、[Model catalogs](/introduction/models)、[OAuth directory, aliases, and exclusions](/accounts/oauth)、[Cooldown](/routing/cooldown)、[Routing strategy](/routing/strategy).
- <a id="exp-routing-session-affinity"></a>**Turn on session affinity to keep encrypted reasoning** (`exp.routing.session-affinity`). Symptom: After a Responses conversation switches credentials, the encrypted reasoning content no longer matches. Action: Set routing.session-affinity to true so the same session stays on the same credential. The default is false. Affinity cannot replace encrypted content that upstream has already invalidated. Source issues: [#1793](https://github.com/router-for-me/CLIProxyAPI/issues/1793)、[#3189](https://github.com/router-for-me/CLIProxyAPI/issues/3189)、[#3884](https://github.com/router-for-me/CLIProxyAPI/issues/3884)。. Official pages: [Responses](/api/responses)、[Routing strategy](/routing/strategy).
- <a id="exp-routing-priority-before-strategy"></a>**Round-robin starts only after priority is exhausted** (`exp.routing.priority-before-strategy`). Symptom: After priority is raised, it is still expected to share traffic with other credentials by weight. Action: A higher priority is used until it is exhausted, and only then is routing.strategy applied. priority is not weight. Source issues: [#3288](https://github.com/router-for-me/CLIProxyAPI/issues/3288)、[#4502](https://github.com/router-for-me/CLIProxyAPI/issues/4502)。. Official pages: [Credential priority](/accounts/api-keys-priority)、[Routing strategy](/routing/strategy).
- <a id="exp-routing-per-credential-proxy"></a>**Set a proxy for a single credential** (`exp.routing.per-credential-proxy`). Symptom: Only one account should use a proxy. Other upstreams should keep the global setting. Action: The global default is still requests.proxy-url. Writing proxy_url in the OAuth credential JSON overrides only that account. Claude, Gemini, and Codex API key entries use their own proxy-url. Source issues: [#304](https://github.com/router-for-me/CLIProxyAPI/issues/304)、[#690](https://github.com/router-for-me/CLIProxyAPI/issues/690)、[#847](https://github.com/router-for-me/CLIProxyAPI/issues/847)、[#1160](https://github.com/router-for-me/CLIProxyAPI/issues/1160)、[#1236](https://github.com/router-for-me/CLIProxyAPI/issues/1236)、[#1290](https://github.com/router-for-me/CLIProxyAPI/issues/1290)。. Official pages: [Per-key proxy](/accounts/api-keys-proxy)、[Outbound requests](/routing/requests-value).
- <a id="exp-routing-proxy-for-token-exchange"></a>**Let the server itself finish login through a proxy** (`exp.routing.proxy-for-token-exchange`). Symptom: Login or a quota query fails, but the local browser or system proxy works. Action: Token exchange uses the server's own outbound path. Set requests.proxy-url. Inside a container, do not fill the host's localhost. When Claude login uses uTLS, use socks5, not an HTTP proxy. Codex refresh does not read the proxy inside the credential file. Use the global proxy-url then. Source issues: [#480](https://github.com/router-for-me/CLIProxyAPI/issues/480)、[#1186](https://github.com/router-for-me/CLIProxyAPI/issues/1186)、[#1213](https://github.com/router-for-me/CLIProxyAPI/issues/1213)、[#1217](https://github.com/router-for-me/CLIProxyAPI/issues/1217)、[#1256](https://github.com/router-for-me/CLIProxyAPI/issues/1256)、[#1376](https://github.com/router-for-me/CLIProxyAPI/issues/1376)、[#1749](https://github.com/router-for-me/CLIProxyAPI/issues/1749)、[#2050](https://github.com/router-for-me/CLIProxyAPI/issues/2050)、[#2180](https://github.com/router-for-me/CLIProxyAPI/issues/2180)、[#2934](https://github.com/router-for-me/CLIProxyAPI/issues/2934)、[#2943](https://github.com/router-for-me/CLIProxyAPI/issues/2943)。. Official pages: [Antigravity login](/accounts/antigravity)、[Claude login](/accounts/claude)、[Codex login](/accounts/codex)、[Run with Docker Compose](/docker/docker)、[Outbound requests](/routing/requests-value).
- <a id="exp-routing-management-page-download"></a>**Make the management page file downloadable** (`exp.routing.management-page-download`). Symptom: The management page is 404, or the container is missing management.html. Action: management.html is downloaded at runtime and is not baked into the image. Confirm that requests.proxy-url is reachable and not expired, and avoid GitHub rate limiting. When disable-control-panel is true, the panel is not served. In Docker, rebuild the container after changing the management secret-key. Source issues: [#557](https://github.com/router-for-me/CLIProxyAPI/issues/557)、[#711](https://github.com/router-for-me/CLIProxyAPI/issues/711)、[#966](https://github.com/router-for-me/CLIProxyAPI/issues/966)、[#2378](https://github.com/router-for-me/CLIProxyAPI/issues/2378)、[#2913](https://github.com/router-for-me/CLIProxyAPI/issues/2913)、[#6178](https://github.com/router-for-me/CLIProxyAPI/issues/6178)。. Official pages: [Management settings](/operations/management-settings)、[Run with Docker Compose](/docker/docker)、[Outbound requests](/routing/requests-value)、[Other endpoints](/api/openai-other).
- <a id="exp-routing-filter-rejected-fields"></a>**Use payload filtering to remove fields upstream rejects** (`exp.routing.filter-rejected-fields`). Symptom: Codex, DeepSeek, GLM, NVIDIA, or Grok rejects response_format, metadata, extra_body, or another field. Action: List the JSON paths to delete in params of requests.payload.filter. Filtering runs after the default rules and the override rules. Source issues: [#1647](https://github.com/router-for-me/CLIProxyAPI/issues/1647)、[#2352](https://github.com/router-for-me/CLIProxyAPI/issues/2352)、[#3301](https://github.com/router-for-me/CLIProxyAPI/issues/3301)、[#3577](https://github.com/router-for-me/CLIProxyAPI/issues/3577)、[#4105](https://github.com/router-for-me/CLIProxyAPI/issues/4105)、[#4149](https://github.com/router-for-me/CLIProxyAPI/issues/4149)、[#5112](https://github.com/router-for-me/CLIProxyAPI/issues/5112)、[#5648](https://github.com/router-for-me/CLIProxyAPI/issues/5648)。. Official pages: [Upstream base URLs](/accounts/api-keys-base)、[xAI login](/accounts/xai)、[Filter payload rules](/routing/requests-filter)、[Responses](/api/responses).
- <a id="exp-routing-keepalive-is-not-json"></a>**A keep-alive marker is not a JSON response** (`exp.routing.keepalive-is-not-json`). Symptom: A keep-alive marker appears in an OpenRouter stream and the client treats it as bad JSON. Action: These markers are forwarded with the OpenAI-compatible stream. They are not a JSON response. The keep-alive interval uses requests.streaming.keepalive-seconds. Source issues: [#417](https://github.com/router-for-me/CLIProxyAPI/issues/417)。. Official pages: [Upstream base URLs](/accounts/api-keys-base)、[Streaming keep-alive](/routing/requests-keepalive).
- <a id="exp-routing-fork-alias-for-image-size"></a>**Use a fork alias to distinguish image sizes** (`exp.routing.fork-alias-for-image-size`). Symptom: You want different image sizes, but there is no matching built-in model id. Action: Set fork on oauth-model-alias to true to get a separate id, then set payload default parameters for that alias. When fork is not true, a repeated alias only renames. Source issues: [#1044](https://github.com/router-for-me/CLIProxyAPI/issues/1044)、[#2546](https://github.com/router-for-me/CLIProxyAPI/issues/2546)。. Official pages: [Upstream model aliases](/accounts/api-keys-models)、[OAuth directory, aliases, and exclusions](/accounts/oauth)、[Default payload rules](/routing/requests-default).
- <a id="exp-routing-gemini-image-config-path"></a>**Write the image size in imageConfig** (`exp.routing.gemini-image-config-path`). Symptom: Gemini image size and aspect ratio do not take effect. Action: Use payload default parameters and write them to generationConfig.imageConfig. Do not write them at the top level of generationConfig. Source issues: [#1089](https://github.com/router-for-me/CLIProxyAPI/issues/1089)。. Official pages: [OAuth directory, aliases, and exclusions](/accounts/oauth)、[Default payload rules](/routing/requests-default).
- <a id="exp-routing-responses-cache-key"></a>**responses rotates by a shared cache key** (`exp.routing.responses-cache-key`). Symptom: Codex responses switches between accounts. Action: Rotation uses a shared prompt_cache_key. The pinned route does not support previous_response_id. Prompt caching for a long conversation does not depend on session-affinity. Source issues: [#1382](https://github.com/router-for-me/CLIProxyAPI/issues/1382)、[#2811](https://github.com/router-for-me/CLIProxyAPI/issues/2811)。. Official pages: [Codex login](/accounts/codex)、[Responses](/api/responses)、[Routing strategy](/routing/strategy).
- <a id="exp-routing-filter-effort-without-budget"></a>**Do not also set a budget when filtering reasoning_effort** (`exp.routing.filter-effort-without-budget`). Symptom: payload.filter did not remove reasoning_effort. Action: Filtering removes reasoning_effort only when the request did not also set a thinking budget. Source issues: [#1740](https://github.com/router-for-me/CLIProxyAPI/issues/1740)。. Official pages: [Filter payload rules](/routing/requests-filter).
- <a id="exp-routing-override-is-final"></a>**A payload override still applies after the thinking suffix** (`exp.routing.override-is-final`). Symptom: The thinking suffix on the model name changed the override rule back. Action: payload.override runs after the thinking suffix and is the last business rewrite. An oversized max_tokens can also be rewritten with it before it reaches DeepSeek. Source issues: [#2404](https://github.com/router-for-me/CLIProxyAPI/issues/2404)、[#2758](https://github.com/router-for-me/CLIProxyAPI/issues/2758)。. Official pages: [Upstream base URLs](/accounts/api-keys-base)、[Override payload rules](/routing/requests-override).
- <a id="exp-routing-retry-503"></a>**A 503 is handled as a retry round** (`exp.routing.retry-503`). Symptom: A 503 is treated as rate limiting that needs a long wait. Action: A 503 is treated as temporarily unavailable. Whether to try again is decided by routing.retry.request-retry, not by a rate-limit delay. Source issues: [#2877](https://github.com/router-for-me/CLIProxyAPI/issues/2877)。. Official pages: [Routing strategy](/routing/strategy).
- <a id="exp-routing-gpt-image-override"></a>**gpt-image-2 is called through chat completions after an override** (`exp.routing.gpt-image-override`). Symptom: gpt-image-2 is treated as an ordinary chat model id. Action: When a payload override is needed, call it through chat completions and set the image base chat model. It is not a separate old image-editing command. Source issues: [#2961](https://github.com/router-for-me/CLIProxyAPI/issues/2961)。. Official pages: [Images, speech, and video](/api/media)、[Override payload rules](/routing/requests-override)、[OpenAI Chat](/api/openai-chat).
- <a id="exp-routing-force-prefix-off"></a>**Check the forced prefix when a request without a prefix fails** (`exp.routing.force-prefix-off`). Symptom: gpt-image-2 or a request without a prefix cannot select a credential. Action: When routing.force-model-prefix is true, a request without a prefix uses only credentials without a prefix. Set it to false when this restriction is not needed. claude's prefix is the credential's own prefix. Source issues: [#2965](https://github.com/router-for-me/CLIProxyAPI/issues/2965)、[#4474](https://github.com/router-for-me/CLIProxyAPI/issues/4474)。. Official pages: [Model-name prefix](/accounts/api-keys-prefix)、[Routing strategy](/routing/strategy).
- <a id="exp-routing-alias-and-override-effort"></a>**An alias plus an override expresses Opus effort** (`exp.routing.alias-and-override-effort`). Symptom: You want different entries for different Opus effort values. Action: Use oauth-model-alias together with payload.override, and keep the parenthetical-suffix form. Source issues: [#3126](https://github.com/router-for-me/CLIProxyAPI/issues/3126)。. Official pages: [OAuth directory, aliases, and exclusions](/accounts/oauth)、[Override payload rules](/routing/requests-override)、[Claude Messages](/api/claude-messages).
- <a id="exp-routing-fill-first-recovers"></a>**fill-first returns to the earlier account after quota recovers** (`exp.routing.fill-first-recovers`). Symptom: You do not want it to return automatically to the earlier account after quota recovers. Action: fill-first uses the credential again after it recovers. To rotate by day, switch it yourself through the credential management API instead of adding a routing strategy. Source issues: [#3429](https://github.com/router-for-me/CLIProxyAPI/issues/3429)、[#3711](https://github.com/router-for-me/CLIProxyAPI/issues/3711)。. Official pages: [Credentials](/management/v8-credentials)、[Routing strategy](/routing/strategy).
- <a id="exp-routing-override-extra-body"></a>**Add extra_body with an override rule** (`exp.routing.override-extra-body`). Symptom: The client needs a non-standard extra_body. Action: Write it into the parameters of payload.override. The override applies to the upstream body and is not printed to the console. Source issues: [#4203](https://github.com/router-for-me/CLIProxyAPI/issues/4203)、[#4453](https://github.com/router-for-me/CLIProxyAPI/issues/4453)。. Official pages: [Upstream base URLs](/accounts/api-keys-base)、[Model thinking](/configuration/thinking-models)、[Override payload rules](/routing/requests-override).
- <a id="exp-routing-separate-payload-by-model"></a>**Different models use different override rules** (`exp.routing.separate-payload-by-model`). Symptom: The same xhigh override makes gpt-5.5 fail, while gpt-5.6 works. Action: Write separate payload rules for gpt-5.5 and gpt-5.6. Do not apply an xhigh that suits 5.6 to 5.5. Source issues: [#4263](https://github.com/router-for-me/CLIProxyAPI/issues/4263)。. Official pages: [Model thinking](/configuration/thinking-models)、[Override payload rules](/routing/requests-override).
- <a id="exp-routing-tune-retry-and-cooling"></a>**Handle 429 retries with the existing retry and cooling settings** (`exp.routing.tune-retry-and-cooling`). Symptom: The retry limit for repeated 429 responses keeps appearing. Action: Adjust routing.retry.request-retry and the cooling switch. Do not add a selector. An account-level HTTP 400 does not switch credentials. It is handled as a bad request. Source issues: [#4327](https://github.com/router-for-me/CLIProxyAPI/issues/4327)、[#4846](https://github.com/router-for-me/CLIProxyAPI/issues/4846)。. Official pages: [Cooldown](/routing/cooldown)、[Routing strategy](/routing/strategy).
- <a id="exp-routing-override-grok-subagent"></a>**Patch a Grok subagent with a payload override** (`exp.routing.override-grok-subagent`). Symptom: A Grok subagent call fails. Action: Write one payload.override for grok-4.5. This only changes the upstream body. It does not guarantee that every subagent error can be removed. Source issues: [#4439](https://github.com/router-for-me/CLIProxyAPI/issues/4439)。. Official pages: [xAI login](/accounts/xai)、[Override payload rules](/routing/requests-override).
- <a id="exp-routing-compat-shares-strategy"></a>**Compatible providers share the same routing strategy** (`exp.routing.compat-shares-strategy`). Symptom: It seems an OpenAI-compatible provider has its own routing strategy. Action: They already share routing.strategy and priority with the other credentials. The provider name is not another strategy switch. Source issues: [#6284](https://github.com/router-for-me/CLIProxyAPI/issues/6284)。. Official pages: [OpenAI-compatible provider name](/accounts/api-keys-name)、[Routing strategy](/routing/strategy).

## Standalone pages

This area has no practice that needs its own page.

