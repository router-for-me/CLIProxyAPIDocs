---
title: OAuth directory, aliases, and exclusions
feature_ids:
  - oauth.auth-auto-refresh-workers.value
  - oauth.auth-dir.value
  - oauth.excluded-models.value
  - oauth.model-alias.alias
  - oauth.model-alias.display-name
  - oauth.model-alias.force-mapping
  - oauth.model-alias.fork
  - oauth.model-alias.name
  - oauth.providers.devin-sensitive-words
  - oauth.request-scoped-errors.action
  - oauth.request-scoped-errors.match
  - oauth.request-scoped-errors.match-regexr
  - oauth.request-scoped-errors.status
  - oauth.settings.alias
  - oauth.settings.max-context-length
  - oauth.settings.name
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# OAuth directory, aliases, and exclusions

## 1. What this solves

This page gathers the directory, refresh workers, model aliases, context settings, global exclusions, and per-provider error rules for file-based OAuth credentials.

## 2. Scope and non-goals

It does not apply to the `api-keys` groups. Provider login commands are not on this page. Alias channels follow the ones listed in the template: vertex, aistudio, antigravity, claude, codex, kimi, xai, and meta. A plugin provider key can also appear in the same map.

## 3. How to configure or call it

```yaml
oauth:
  auth-dir: "~/.cli-proxy-api"
  auth-auto-refresh-workers: 16
  model-alias:
    codex:
      - name: "gpt-5"
        alias: "g5"
        fork: false
        display-name: "GPT-5"
        force-mapping: false
  settings:
    codex:
      - name: "gpt-5"
        alias: "g5"
        max-context-length: 0
  excluded-models:
    codex:
      - "gpt-5-codex-mini"
  request-scoped-errors:
    codex:
      - status: 400
        match:
          - "context_window_exceeded"
        match-regexr:
          - "context_window_exceeded$"
        action: "stop"
  providers:
    devin:
      sensitive-words:
        - "API"
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| oauth.auth-auto-refresh-workers | oauth.auth-auto-refresh-workers | When <= 0, the default worker count is used. | Greater than 0 overrides the default 16. Less than or equal to 0 still uses 16. |
| oauth.auth-dir | oauth.auth-dir | empty string | An empty value resolves to ~/.cli-proxy-api. A value that starts with ~ expands to the user home directory. |
| oauth.excluded-models | oauth.excluded-models | nil | oauth.excluded-models |
| oauth.model-alias.alias | The model name the client sees. | empty string | The client uses this name. In OAuth settings, an exact alias match wins over a name match. At the same level, the later entry wins. |
| oauth.model-alias.display-name | Readable name shown in the catalog. | empty string | When omitted, the catalog does not use a separate display name. |
| oauth.model-alias.force-mapping | Rewrite the model field in the upstream response back to the client alias. | false | When true, the model field in the response is written back as the alias. false does not rewrite it. |
| oauth.model-alias.fork | Whether to expose the alias while also keeping the original model name. | false | When true, the original model ID remains, and the alias appears as an extra client model. |
| oauth.model-alias.name | Model name sent upstream, or the model name an OAuth setting must match. | empty string | The request is sent to this upstream model name. OAuth aliases do not apply to api-keys groups. |
| oauth.providers.devin.sensitive-words | oauth.providers.devin.sensitive-words | nil | Listed words are disrupted with zero-width characters in the matching prompt. When omitted, they are not processed. |
| oauth.request-scoped-errors.action | What to do with this upstream error after a match. | empty string | Only stop, stop-and-cooldown, continue, and continue-and-cooldown are used. In a global OAuth rule, an empty action is dropped and is not reported as its own error. |
| oauth.request-scoped-errors.match | Match the upstream error body with a substring. | nil | When omitted, there is no substring match. If the status code is not positive, or both the substring and the regular expression are empty, this OAuth rule is dropped. |
| oauth.request-scoped-errors.match-regexr | Match the upstream error body with a regular expression. | nil | When omitted, there is no regular-expression match. Blank items are removed. |
| oauth.request-scoped-errors.status | Upstream HTTP status code to match. | 0 | oauth.request-scoped-errors.status |
| oauth.settings.alias | The model name the client sees. | empty string | The client uses this name. In OAuth settings, an exact alias match wins over a name match. At the same level, the later entry wins. |
| oauth.settings.max-context-length | Context length advertised to a Codex client. | 0 | 0 means the context window advertised to a Codex client is not overridden. Only a positive number overrides it. |
| oauth.settings.name | Model name sent upstream, or the model name an OAuth setting must match. | empty string | The request is sent to this upstream model name. OAuth aliases do not apply to api-keys groups. |

## 5. Common errors and limits

Aliases and settings do not fail on load because of an unknown channel name. OAuth request-scoped rules drop an entry whose status code is not positive, whose action is empty, or whose substring and regular expression are both empty. They do not fail the whole configuration. An empty credential directory resolves to `~/.cli-proxy-api`. If the home directory cannot be resolved, startup logs `failed to resolve auth directory`. When the refresh worker count is less than or equal to 0, 16 is still used.

## 6. Related behavior

Login pages are the provider logins in the sidebar. API-key exclusion is in [Per-key excluded models](/accounts/api-keys-excluded).

## 7. Field experience

- [Map a client model name to the real model with an alias](/experience/accounts#exp-accounts-alias-client-model)
- [Log in again after an Antigravity credential expires](/experience/accounts#exp-accounts-antigravity-login-again)
- [Keep two workspaces for the same Codex account](/experience/accounts#exp-accounts-codex-keep-workspaces)
- [Log in to Codex again after a plan or token change](/experience/accounts#exp-accounts-codex-login-again)
- [Copy credentials by copying the whole directory](/experience/accounts#exp-accounts-copy-auth-dir)
- [Point the credential directory at a dedicated path](/experience/accounts#exp-accounts-dedicated-auth-dir)
- [Exclude a model on a single credential](/experience/accounts#exp-accounts-exclude-model)
- [Move a file out of the directory to disable a credential](/experience/accounts#exp-accounts-move-auth-file)
- [A refresh worker count of 0 still uses the default](/experience/accounts#exp-accounts-refresh-workers-zero)
- [Handle a specific 429 with a request-scoped error rule](/experience/accounts#exp-accounts-request-scoped-error-action)
- [Send the client key when calling a public route](/experience/api#exp-api-require-client-key)
- [Restart after deleting a credential before the model list updates](/experience/api#exp-api-restart-after-auth-removal)
- [Change the advertised window with max-context-length](/experience/configuration#exp-configuration-advertise-context-length)
- [Prepare the configuration and credential directory before start](/experience/docker#exp-docker-prepare-auth-dir)
- [Set priority on a credential field](/experience/management#exp-management-set-credential-priority)
- [Logs are written in a writable logs directory](/experience/operations#exp-operations-log-directory)
- [Management login uses secret-key](/experience/operations#exp-operations-management-secret)
- [An alias plus an override expresses Opus effort](/experience/routing#exp-routing-alias-and-override-effort)
- [After a 429, skip that model until the reset time](/experience/routing#exp-routing-cooldown-until-reset)
- [Turn cooling off to keep the credential selectable](/experience/routing#exp-routing-disable-cooling)
- [Use a fork alias to distinguish image sizes](/experience/routing#exp-routing-fork-alias-for-image-size)
- [Image size is written in imageConfig](/experience/routing#exp-routing-gemini-image-config-path)
- [Models with the same name share a routing strategy](/experience/routing#exp-routing-same-model-name)
