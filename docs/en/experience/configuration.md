---
title: "Configuration"
related_feature_ids:
  - api-keys.claude.models-thinking-levels
  - api-keys.codex.models-thinking-levels
  - api-keys.openai-compatibility.models-max-context-length
  - api-keys.openai-compatibility.models-thinking-levels
  - cli.server.antigravity-login
  - cli.server.codex-login
  - cli.server.config
  - cli.server.xai-login
  - client.codex.optimize-multi-agent-v2
  - models.codex-catalog.value
  - oauth.providers.antigravity-antigravity-credits
  - oauth.settings.max-context-length
  - requests.payload.filter-params
  - route.v1.get-models
  - route.v1.post-chat-completions
  - route.v1.post-messages
  - route.v1.post-responses
source_issues:
  - 255
  - 482
  - 483
  - 496
  - 508
  - 1509
  - 2185
  - 2836
  - 3386
  - 3718
  - 3842
  - 3932
  - 4708
  - 4728
  - 4825
  - 4845
  - 4883
  - 4885
  - 5007
  - 5066
  - 5207
  - 5409
  - 5499
  - 5895
  - 6362
  - 6552
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Configuration

## Scope and limits

The practices on this page are checked only against configuration, routes, or commands that still exist in pinned commit `911f49cbd49f4fe2516979754a7488a3fd14fe64`. This page is not an official behavior promise. Keys, cookies, email addresses, authorization files, and user request bodies were not copied in.

## Short practices

- <a id="exp-configuration-declare-thinking-levels"></a>**Declare thinking levels on the model entry** (`exp.configuration.declare-thinking-levels`). Symptom: A third-party model has no xhigh, ultra, or max, or the effort value is clamped. Action: Write the allowed levels in that model's thinking.levels. When the list is omitted, an OpenAI-compatible model has only low, medium, and high. Source issues: [#3932](https://github.com/router-for-me/CLIProxyAPI/issues/3932)、[#4708](https://github.com/router-for-me/CLIProxyAPI/issues/4708)、[#4825](https://github.com/router-for-me/CLIProxyAPI/issues/4825)、[#4845](https://github.com/router-for-me/CLIProxyAPI/issues/4845)、[#4883](https://github.com/router-for-me/CLIProxyAPI/issues/4883)、[#4885](https://github.com/router-for-me/CLIProxyAPI/issues/4885)、[#5409](https://github.com/router-for-me/CLIProxyAPI/issues/5409)、[#5499](https://github.com/router-for-me/CLIProxyAPI/issues/5499)。. Official pages: [Model thinking](/configuration/thinking-models)、[Antigravity login](/accounts/antigravity)、[Claude Messages](/api/claude-messages).
- <a id="exp-configuration-thinking-suffix"></a>**Choose a thinking level with a parenthetical suffix** (`exp.configuration.thinking-suffix`). Symptom: The client wants to specify a thinking level, but the model list has no separate thinking model. Action: Add a parenthetical suffix after the model name, for example (high) or a numeric budget the model accepts. The suffix takes priority over thinking parameters in the request body. GET /v1/models does not list these levels. Do not invent a hyphenated thinking model id. Source issues: [#482](https://github.com/router-for-me/CLIProxyAPI/issues/482)、[#483](https://github.com/router-for-me/CLIProxyAPI/issues/483)、[#508](https://github.com/router-for-me/CLIProxyAPI/issues/508)、[#1509](https://github.com/router-for-me/CLIProxyAPI/issues/1509)。. Official pages: [Model thinking](/configuration/thinking-models)、[OpenAI Chat](/api/openai-chat)、[Claude Messages](/api/claude-messages)、[Responses](/api/responses).
- <a id="exp-configuration-git-storage-env"></a>**Enable Git storage with environment variables** (`exp.configuration.git-storage-env`). Symptom: A non-Docker installation should also use Git to store configuration and credentials. Action: Setting GITSTORE_GIT_URL is enough to enable it. It is not limited to Docker. Set GITSTORE_LOCAL_PATH, GITSTORE_GIT_USERNAME, GITSTORE_GIT_TOKEN, and GITSTORE_GIT_BRANCH only when they are needed. Source issues: [#3386](https://github.com/router-for-me/CLIProxyAPI/issues/3386)。. Official pages: [Command-line flags](/introduction/install).
- <a id="exp-configuration-storage-is-not-live-sync"></a>**Git and object storage are not live multi-machine sync** (`exp.configuration.storage-is-not-live-sync`). Symptom: Several servers share Git or object storage, and a login result is expected to appear on another machine immediately. Action: Both backends push after a local credential change. They are not live multi-machine sync. Another server does not see the new credential at the same moment login finishes. Source issues: [#255](https://github.com/router-for-me/CLIProxyAPI/issues/255)。. Official pages: [Command-line flags](/introduction/install).
- <a id="exp-configuration-unknown-keys-on-migrate"></a>**Unknown keys become comments during migration** (`exp.configuration.unknown-keys-on-migrate`). Symptom: Extra keys were written in a provider section and are expected to be read at runtime. Action: When migrating to v8, keys that cannot be recognized are collected into comments and ignored. If a file that is already v8 contains an unknown section, loading rejects it instead of treating it as a note that takes effect. Source issues: [#3718](https://github.com/router-for-me/CLIProxyAPI/issues/3718)。. Official pages: [Command-line flags](/introduction/install).
- <a id="exp-configuration-reject-minimal-effort"></a>**Do not send a thinking level the model rejects** (`exp.configuration.reject-minimal-effort`). Symptom: gpt-5.2 rejects reasoning effort minimal. Action: Send only a level that model's thinking.levels accepts. Do not send minimal. Source issues: [#496](https://github.com/router-for-me/CLIProxyAPI/issues/496)。. Official pages: [Model thinking](/configuration/thinking-models)、[OpenAI Chat](/api/openai-chat).
- <a id="exp-configuration-levels-or-filter"></a>**Filter the field when the level is not allowed** (`exp.configuration.levels-or-filter`). Symptom: Claude Code sent xhigh to an NVIDIA model. Action: Allowed levels are written in that model's thinking.levels. When they cannot be declared, use payload.filter to remove the field. Source issues: [#2185](https://github.com/router-for-me/CLIProxyAPI/issues/2185)。. Official pages: [Model thinking](/configuration/thinking-models)、[Filter payload rules](/routing/requests-filter).
- <a id="exp-configuration-antigravity-credits"></a>**Credit fallback runs before quota switching** (`exp.configuration.antigravity-credits`). Symptom: The order of Antigravity credits and quota switching is unclear. Action: Credit fallback is controlled by the provider configuration and happens before quota switching. Source issues: [#2836](https://github.com/router-for-me/CLIProxyAPI/issues/2836)。. Official pages: [Antigravity provider options](/configuration/provider/antigravity).
- <a id="exp-configuration-levels-before-filter"></a>**A thinking level cannot be declared by filtering** (`exp.configuration.levels-before-filter`). Symptom: You want to use payload.filter to remove an unsupported thinking level. Action: Supported levels are written in thinking.levels on the model entry. Filtering runs too late to replace that declaration. Source issues: [#3842](https://github.com/router-for-me/CLIProxyAPI/issues/3842)。. Official pages: [Model thinking](/configuration/thinking-models)、[Filter payload rules](/routing/requests-filter).
- <a id="exp-configuration-advertise-context-length"></a>**Change the advertised window with max-context-length** (`exp.configuration.advertise-context-length`). Symptom: A third-party or OAuth model needs to show a different context length. Action: Set max-context-length on the model or on oauth.settings. Do not add a catalog field, and do not reuse the window number reported in the issue. Source issues: [#4728](https://github.com/router-for-me/CLIProxyAPI/issues/4728)、[#5066](https://github.com/router-for-me/CLIProxyAPI/issues/5066)、[#5895](https://github.com/router-for-me/CLIProxyAPI/issues/5895)、[#6362](https://github.com/router-for-me/CLIProxyAPI/issues/6362)、[#6552](https://github.com/router-for-me/CLIProxyAPI/issues/6552)。. Official pages: [Upstream model aliases](/accounts/api-keys-models)、[Model catalogs](/introduction/models)、[OAuth directory, aliases, and exclusions](/accounts/oauth).
- <a id="exp-configuration-optimize-multi-agent"></a>**Turn on the multi-agent compatibility switch** (`exp.configuration.optimize-multi-agent`). Symptom: Codex spawn_agent reports a reserved name, or Grok rejects a Codex subagent. Action: Set client.codex.optimize-multi-agent-v2 to true. The default false does not change client behavior. Do not use other unregistered switches mentioned in the issue. Source issues: [#5007](https://github.com/router-for-me/CLIProxyAPI/issues/5007)、[#5207](https://github.com/router-for-me/CLIProxyAPI/issues/5207)。. Official pages: [Codex login](/accounts/codex)、[xAI login](/accounts/xai)、[Codex client catalog](/routing/client).

## Standalone pages

This area has no practice that needs its own page.

