---
title: Claude upstream behavior
feature_ids:
  - upstream.claude.disable-claude-cloak-mode
  - upstream.claude.disable-cloaking-model-list
  - upstream.claude.header-defaults-anthropic-beta-append
  - upstream.claude.header-defaults-anthropic-beta-strip
  - upstream.claude.header-defaults-arch
  - upstream.claude.header-defaults-client-request-id
  - upstream.claude.header-defaults-inject-diagnostics
  - upstream.claude.header-defaults-os
  - upstream.claude.header-defaults-package-version
  - upstream.claude.header-defaults-runtime-version
  - upstream.claude.header-defaults-stabilize-device-profile
  - upstream.claude.header-defaults-timeout
  - upstream.claude.header-defaults-timezone
  - upstream.claude.header-defaults-user-agent
  - upstream.claude.model-level-cooling
  - upstream.claude.session-date-pin-days
  - upstream.claude.tool-search
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Claude upstream behavior

## 1. What this solves

This page covers cloaking, the model list, the fingerprint baseline, tool search, model-level cooling, and the session date shared by every Claude credential.

## 2. Scope and non-goals

The cloak and fingerprint-profile of a single API key are not on this page. Codex upstream switches are on the Codex provider options page.

## 3. How to configure or call it

```yaml
upstream:
  claude:
    model-level-cooling: false
    tool-search: false
    session-date-pin-days: 7
    disable-claude-cloak-mode: false
    disable-cloaking-model-list: false
    header-defaults:
      user-agent: ""
      package-version: ""
      runtime-version: ""
      os: ""
      arch: ""
      timeout: ""
      timezone: ""
      stabilize-device-profile: false
      anthropic-beta-strip: []
      anthropic-beta-append: []
      inject-diagnostics: false
      client-request-id: "on"
```

When `session-date-pin-days` is omitted, it is treated as 7 days. An explicit 0 keeps a continuity date of 1 hour. Version strings in the template are only examples. They are not defaults in the code.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| upstream.claude.disable-claude-cloak-mode | Whether Claude credentials default to no request cloaking. | When true, every Claude credential defaults to no cloaking ("never"); a specific credential can still re-enable or override it via its own cloak settings (the per claude-api-key "cloak" block, or a "cloak_mode" value in the auth/OAuth token file). | auto: do not cloak when there is a clear native-entry signal. always: cloak clients that are not confirmed, while confirmed native Claude Code still passes through. never: do not cloak. Writing a cloak block enables cloaking for an API key that has no fingerprint specified. |
| upstream.claude.disable-cloaking-model-list | Whether the model list returns raw model IDs. | false | When true, the Anthropic model list returns raw model IDs. |
| upstream.claude.header-defaults.anthropic-beta-append | upstream.claude.header-defaults.anthropic-beta-append | nil | After deletion, append exact names that are not already present. |
| upstream.claude.header-defaults.anthropic-beta-strip | upstream.claude.header-defaults.anthropic-beta-strip | nil | Delete by exact name and keep the order of the rest. Blank and duplicate items are removed. |
| upstream.claude.header-defaults.arch | upstream.claude.header-defaults.arch | empty string | Pinned only when stabilize-device-profile is true. |
| upstream.claude.header-defaults.client-request-id | upstream.claude.header-defaults.client-request-id | empty string | Empty and on generate a UUID. passthrough forwards only the caller's value. off does not send it. Any other value warns and falls back to empty, which means on. |
| upstream.claude.header-defaults.inject-diagnostics | upstream.claude.header-defaults.inject-diagnostics | nil | When omitted, a Claude Code CLI fingerprint still injects diagnostics. An explicit false stops injection, and also stops the cache-diagnosis beta. |
| upstream.claude.header-defaults.os | upstream.claude.header-defaults.os | empty string | Pinned only when stabilize-device-profile is true. |
| upstream.claude.header-defaults.package-version | upstream.claude.header-defaults.package-version | empty string | An empty value does not set a package-version baseline. |
| upstream.claude.header-defaults.runtime-version | upstream.claude.header-defaults.runtime-version | empty string | An empty value does not set a runtime-version baseline. |
| upstream.claude.header-defaults.stabilize-device-profile | upstream.claude.header-defaults.stabilize-device-profile | nil | true pins the operating system and architecture, and stops automatically learning a newer software version. |
| upstream.claude.header-defaults.timeout | upstream.claude.header-defaults.timeout | empty string | An empty value does not provide a timeout fallback. |
| upstream.claude.header-defaults.timezone | upstream.claude.header-defaults.timezone | empty string | timezone in the credential JSON wins. An empty value does not set a fallback timezone. |
| upstream.claude.header-defaults.user-agent | upstream.claude.header-defaults.user-agent | empty string | An empty value is not injected. Only a verified native client whose version matches the baseline keeps its own shape. |
| upstream.claude.model-level-cooling | Whether quota cooling applies only to the current model. | false | upstream.claude.model-level-cooling |
| upstream.claude.session-date-pin-days | Days the cloaking currentDate is kept for a session. | A nil value (unset) defaults to 7 days; an explicit 0 keeps the continuity-scoped pin (1h lifetime). | When omitted, it is 7 days. An explicit 0 keeps a continuity date of 1 hour. An overly large number of days is truncated so the duration does not overflow. |
| upstream.claude.tool-search | Whether to enable Codex tool_search on the Claude Responses path. | Default false keeps the translation that predates tool_search support. | When true, Codex tool_search is enabled on the Claude Responses path. An official address, or a key whose native-tool-search is true, uses native search. |

## 5. Common errors and limits

If `client-request-id` is not on, off, passthrough, or empty, loading warns and falls back to the empty value. Empty means on. An unrecognized value does not make configuration loading fail. Anthropic-Beta names match by exact string. Blank and duplicate items are removed.

## 6. Related behavior

Per-key cloaking is in [Claude request cloaking](/accounts/api-keys-cloak). The fingerprint is in [Claude fingerprint](/accounts/api-keys-fingerprint).

## 7. Field experience

- [Turn Claude cloak off when it is not needed](/experience/accounts#exp-accounts-claude-cloak-off)
