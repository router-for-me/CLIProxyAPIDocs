---
title: Cooldown and the Codex cloak switch
feature_ids:
  - api-keys.claude.disable-cooling
  - api-keys.codex.disable-codex-cloaking
  - api-keys.codex.disable-cooling
  - api-keys.gemini.disable-cooling
  - api-keys.interactions.disable-cooling
  - api-keys.meta.disable-codex-cloaking
  - api-keys.meta.disable-cooling
  - api-keys.openai-compatibility.disable-cooling
  - api-keys.vertex.disable-cooling
  - api-keys.xai.disable-codex-cloaking
  - api-keys.xai.disable-cooling
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Cooldown and the Codex cloak switch

## 1. What this solves

This page explains how one credential overrides the global cooldown, and how a Codex-shaped key overrides Codex cloaking.

## 2. Scope and non-goals

The global cooldown is not on this page. Global Codex cloaking is in the Codex provider options. The cooldown switch of an OpenAI-compatible provider applies to the whole provider, not to one key.

## 3. How to configure or call it

```yaml
api-keys:
  claude:
    - name: claude-1
      disable-cooling: false
      keys:
        - api-key: "YOUR_API_KEY"
          disable-cooling: false
  codex:
    - name: codex-1
      keys:
        - api-key: "YOUR_API_KEY"
          disable-codex-cloaking: false
```

Both the group value and the key value can be written. A non-empty value on the key overrides the group.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.disable-cooling | Whether to override the global cooldown policy. | nil | When omitted, the global cooldown is inherited. true turns off authentication and model cooldown for this credential. false turns it on explicitly. |
| api-keys.codex.disable-codex-cloaking | Whether to stop forcing the official Codex identity headers. | nil | When omitted, upstream.codex.disable-codex-cloaking is inherited. true turns cloaking off. false turns it on explicitly. |
| api-keys.codex.disable-cooling | Whether to override the global cooldown policy. | nil | When omitted, the global cooldown is inherited. true turns off authentication and model cooldown for this credential. false turns it on explicitly. |
| api-keys.gemini.disable-cooling | Whether to override the global cooldown policy. | nil | When omitted, the global cooldown is inherited. true turns off authentication and model cooldown for this credential. false turns it on explicitly. |
| api-keys.interactions.disable-cooling | Whether to override the global cooldown policy. | nil | When omitted, the global cooldown is inherited. true turns off authentication and model cooldown for this credential. false turns it on explicitly. |
| api-keys.meta.disable-codex-cloaking | Whether to stop forcing the official Codex identity headers. | nil | When omitted, upstream.codex.disable-codex-cloaking is inherited. true turns cloaking off. false turns it on explicitly. |
| api-keys.meta.disable-cooling | Whether to override the global cooldown policy. | nil | When omitted, the global cooldown is inherited. true turns off authentication and model cooldown for this credential. false turns it on explicitly. |
| api-keys.openai-compatibility.disable-cooling | Whether to override the global cooldown policy. | nil | When omitted, the global cooldown is inherited. true turns off authentication and model cooldown for this credential. false turns it on explicitly. |
| api-keys.vertex.disable-cooling | Whether to override the global cooldown policy. | nil | When omitted, the global cooldown is inherited. true turns off authentication and model cooldown for this credential. false turns it on explicitly. |
| api-keys.xai.disable-codex-cloaking | Whether to stop forcing the official Codex identity headers. | nil | When omitted, upstream.codex.disable-codex-cloaking is inherited. true turns cloaking off. false turns it on explicitly. |
| api-keys.xai.disable-cooling | Whether to override the global cooldown policy. | nil | When omitted, the global cooldown is inherited. true turns off authentication and model cooldown for this credential. false turns it on explicitly. |

## 5. Common errors and limits

These fields do not reject the configuration because of true or false. Only omitting them means inheritance.

## 6. Related behavior

Global Codex cloaking is in [Codex provider options](/configuration/provider/codex).

## 7. Field experience

None yet.

