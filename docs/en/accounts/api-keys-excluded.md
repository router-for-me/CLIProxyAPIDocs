---
title: Per-key excluded models
feature_ids:
  - api-keys.claude.excluded-models
  - api-keys.codex.excluded-models
  - api-keys.gemini.excluded-models
  - api-keys.interactions.excluded-models
  - api-keys.meta.excluded-models
  - api-keys.vertex.excluded-models
  - api-keys.xai.excluded-models
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Per-key excluded models

## 1. What this solves

Stop one upstream group or one key from offering the listed models.

## 2. Scope and non-goals

This is exclusion on an API-key credential. An OAuth file credential uses oauth.excluded-models. An OpenAI-compatible provider has no separate exclusion field.

## 3. How to configure or call it

```yaml
api-keys:
  gemini:
    - name: gemini-1
      excluded-models:
        - "gemini-2.5-pro"
        - "gemini-2.5-*"
        - "*-preview"
        - "*flash*"
      keys:
        - api-key: "YOUR_API_KEY"
          excluded-models: []
```

An empty list on a key clears the exclusions inherited from the group.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.excluded-models | Exclude models on OAuth credentials by provider. | nil | When omitted, nothing is excluded. An entry supports an exact name, and prefix, suffix, and substring wildcards, for example gemini-2.5-*, *-preview, and *flash*. |
| api-keys.codex.excluded-models | Exclude models on OAuth credentials by provider. | nil | When omitted, nothing is excluded. An entry supports an exact name, and prefix, suffix, and substring wildcards, for example gemini-2.5-*, *-preview, and *flash*. |
| api-keys.gemini.excluded-models | Exclude models on OAuth credentials by provider. | nil | When omitted, nothing is excluded. An entry supports an exact name, and prefix, suffix, and substring wildcards, for example gemini-2.5-*, *-preview, and *flash*. |
| api-keys.interactions.excluded-models | Exclude models on OAuth credentials by provider. | nil | When omitted, nothing is excluded. An entry supports an exact name, and prefix, suffix, and substring wildcards, for example gemini-2.5-*, *-preview, and *flash*. |
| api-keys.meta.excluded-models | Exclude models on OAuth credentials by provider. | nil | When omitted, nothing is excluded. An entry supports an exact name, and prefix, suffix, and substring wildcards, for example gemini-2.5-*, *-preview, and *flash*. |
| api-keys.vertex.excluded-models | Exclude models on OAuth credentials by provider. | nil | When omitted, nothing is excluded. An entry supports an exact name, and prefix, suffix, and substring wildcards, for example gemini-2.5-*, *-preview, and *flash*. |
| api-keys.xai.excluded-models | Exclude models on OAuth credentials by provider. | nil | When omitted, nothing is excluded. An entry supports an exact name, and prefix, suffix, and substring wildcards, for example gemini-2.5-*, *-preview, and *flash*. |

## 5. Common errors and limits

A wildcard that does not match simply excludes nothing. It does not make configuration loading fail.

## 6. Related behavior

OAuth exclusion is in [OAuth directory, aliases, and exclusions](/accounts/oauth).

## 7. Field experience

- [Exclude a model on a single credential](/experience/accounts#exp-accounts-exclude-model)

