---
title: "Introduction"
related_feature_ids:
  - cli.server.antigravity-login
  - cli.server.claude-login
  - cli.server.codex-login
  - cli.server.config
  - cli.server.kimi-login
  - cli.server.local-model
  - models.catalog.value
  - models.codex-catalog.value
  - route.v1.get-models
source_issues:
  - 917
  - 1577
  - 1964
  - 2064
  - 2139
  - 2216
  - 2806
  - 2938
  - 2980
  - 2994
  - 3135
  - 3647
  - 3803
  - 4195
  - 4476
  - 4494
  - 5554
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Introduction

## Scope and limits

The practices on this page are checked only against configuration, routes, or commands that still exist in pinned commit `911f49cbd49f4fe2516979754a7488a3fd14fe64`. This page is not an official behavior promise. Keys, cookies, email addresses, authorization files, and user request bodies were not copied in.

## Short practices

- <a id="exp-introduction-start-with-config-or-login"></a>**Provide configuration or a login before startup** (`exp.introduction.start-with-config-or-login`). Symptom: The process has neither a configuration file nor a credential. Action: Point --config at a configuration file, or first run a provider login such as --claude-login, then start the service. Source issues: [#917](https://github.com/router-for-me/CLIProxyAPI/issues/917)。. Official pages: [Claude login](/accounts/claude)、[Command-line flags](/introduction/install).
- <a id="exp-introduction-catalog-is-authoritative"></a>**Visible models follow the pinned catalog** (`exp.introduction.catalog-is-authoritative`). Symptom: The client cannot see a Codex or Kimi model, or it still requests an id that was removed. Action: Follow the model catalog and account type of the pinned version. A name that is not in the catalog is not added, and an id upstream has removed is not kept. After upgrading to a version that contains that catalog entry, log in again, or restart to finish the remote model refresh. Do not use the context length reported in the issue. Source issues: [#1577](https://github.com/router-for-me/CLIProxyAPI/issues/1577)、[#2139](https://github.com/router-for-me/CLIProxyAPI/issues/2139)、[#2216](https://github.com/router-for-me/CLIProxyAPI/issues/2216)、[#2806](https://github.com/router-for-me/CLIProxyAPI/issues/2806)、[#2938](https://github.com/router-for-me/CLIProxyAPI/issues/2938)、[#2980](https://github.com/router-for-me/CLIProxyAPI/issues/2980)、[#2994](https://github.com/router-for-me/CLIProxyAPI/issues/2994)、[#3647](https://github.com/router-for-me/CLIProxyAPI/issues/3647)、[#3803](https://github.com/router-for-me/CLIProxyAPI/issues/3803)、[#4195](https://github.com/router-for-me/CLIProxyAPI/issues/4195)、[#4476](https://github.com/router-for-me/CLIProxyAPI/issues/4476)、[#4494](https://github.com/router-for-me/CLIProxyAPI/issues/4494)。. Official pages: [Antigravity login](/accounts/antigravity)、[Codex login](/accounts/codex)、[Kimi login](/accounts/kimi)、[Model catalogs](/introduction/models)、[OpenAI Chat](/api/openai-chat).
- <a id="exp-introduction-copy-example-config"></a>**Use the example file as the configuration starting point** (`exp.introduction.copy-example-config`). Symptom: The release package has no ready-made config.yaml, or you want to reset management state. Action: Copy that version's config.example.yaml to config.yaml, then start. Homebrew likewise edits the configuration after installation and sets secret-key. Source issues: [#1964](https://github.com/router-for-me/CLIProxyAPI/issues/1964)、[#2064](https://github.com/router-for-me/CLIProxyAPI/issues/2064)、[#3135](https://github.com/router-for-me/CLIProxyAPI/issues/3135)。. Official pages: [Command-line flags](/introduction/install).
- <a id="exp-introduction-local-model-catalog"></a>**The local-model switch skips the remote refresh** (`exp.introduction.local-model-catalog`). Symptom: You do not want to pull the remote model list at startup. Action: --local-model uses the built-in catalog and skips the remote refresh. When a catalog field already has content, that field still wins. Source issues: [#5554](https://github.com/router-for-me/CLIProxyAPI/issues/5554)。. Official pages: [Command-line flags](/introduction/install)、[Model catalogs](/introduction/models).

## Standalone pages

This area has no practice that needs its own page.

