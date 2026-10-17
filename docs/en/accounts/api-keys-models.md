---
title: Upstream model aliases
feature_ids:
  - api-keys.claude.models-alias
  - api-keys.claude.models-display-name
  - api-keys.claude.models-force-mapping
  - api-keys.claude.models-is-compat
  - api-keys.claude.models-max-context-length
  - api-keys.claude.models-name
  - api-keys.codex.models-alias
  - api-keys.codex.models-display-name
  - api-keys.codex.models-force-mapping
  - api-keys.codex.models-is-compat
  - api-keys.codex.models-max-context-length
  - api-keys.codex.models-name
  - api-keys.codex.models-support-configuration-update
  - api-keys.gemini.models-alias
  - api-keys.gemini.models-display-name
  - api-keys.gemini.models-force-mapping
  - api-keys.gemini.models-is-compat
  - api-keys.gemini.models-max-context-length
  - api-keys.gemini.models-name
  - api-keys.interactions.models-alias
  - api-keys.interactions.models-display-name
  - api-keys.interactions.models-force-mapping
  - api-keys.interactions.models-is-compat
  - api-keys.interactions.models-max-context-length
  - api-keys.interactions.models-name
  - api-keys.meta.models-alias
  - api-keys.meta.models-display-name
  - api-keys.meta.models-force-mapping
  - api-keys.meta.models-is-compat
  - api-keys.meta.models-max-context-length
  - api-keys.meta.models-name
  - api-keys.meta.models-support-configuration-update
  - api-keys.openai-compatibility.models-alias
  - api-keys.openai-compatibility.models-display-name
  - api-keys.openai-compatibility.models-force-mapping
  - api-keys.openai-compatibility.models-image
  - api-keys.openai-compatibility.models-input-modalities
  - api-keys.openai-compatibility.models-is-compat
  - api-keys.openai-compatibility.models-max-context-length
  - api-keys.openai-compatibility.models-name
  - api-keys.openai-compatibility.models-output-modalities
  - api-keys.openai-compatibility.models-use-max-completion-tokens
  - api-keys.vertex.models-alias
  - api-keys.vertex.models-display-name
  - api-keys.vertex.models-force-mapping
  - api-keys.vertex.models-name
  - api-keys.xai.models-alias
  - api-keys.xai.models-display-name
  - api-keys.xai.models-force-mapping
  - api-keys.xai.models-is-compat
  - api-keys.xai.models-max-context-length
  - api-keys.xai.models-name
  - api-keys.xai.models-support-configuration-update
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Upstream model aliases

## 1. What this solves

Map the model name the client uses to the upstream model name, and attach catalog display, context, compatibility, and image options.

## 2. Scope and non-goals

Thinking amount is not on this page. OAuth aliases are not on this page. When the same alias appears more than once, the template says the client still sees only one name, and requests round-robin across those upstream names.

## 3. How to configure or call it

```yaml
api-keys:
  claude:
    - name: claude-1
      models:
        - name: "claude-3-5-sonnet-20241022"
          alias: "claude-sonnet-latest"
          display-name: "Claude Sonnet"
          max-context-length: 0
          force-mapping: false
          is-compat: false
      keys:
        - api-key: "YOUR_API_KEY"
  openai-compatibility:
    - name: openrouter
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
      models:
        - name: "upstream-model"
          alias: "client-model"
          image: false
          input-modalities: [text]
          output-modalities: [text]
          use-max-completion-tokens: false
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| api-keys.claude.models.alias | api-keys.claude.models.alias | empty string | The client uses this name. In OAuth settings, an exact alias match wins over a name match. At the same level, the later entry wins. |
| api-keys.claude.models.display-name | api-keys.claude.models.display-name | empty string | When omitted, the catalog does not use a separate display name. |
| api-keys.claude.models.force-mapping | api-keys.claude.models.force-mapping | false | When true, the model field in the response is written back as the alias. false does not rewrite it. |
| api-keys.claude.models.is-compat | api-keys.claude.models.is-compat | Default false keeps the normal signature validation behavior. | false keeps ordinary signature validation. true keeps empty-signature thinking and enables per-provider signature replay for Claude-compatible API-key models. |
| api-keys.claude.models.max-context-length | api-keys.claude.models.max-context-length | 0 | 0 means the context window advertised to a Codex client is not overridden. Only a positive number overrides it. |
| api-keys.claude.models.name | api-keys.claude.models.name | empty string | The request is sent to this upstream model name. OAuth aliases do not apply to api-keys groups. |
| api-keys.codex.models.alias | api-keys.codex.models.alias | empty string | The client uses this name. In OAuth settings, an exact alias match wins over a name match. At the same level, the later entry wins. |
| api-keys.codex.models.display-name | api-keys.codex.models.display-name | empty string | When omitted, the catalog does not use a separate display name. |
| api-keys.codex.models.force-mapping | api-keys.codex.models.force-mapping | false | When true, the model field in the response is written back as the alias. false does not rewrite it. |
| api-keys.codex.models.is-compat | api-keys.codex.models.is-compat | Default false keeps the native behavior unchanged. | MultiAgentV2 agent_message is converted to portable Responses input only when client.codex.optimize-multi-agent-v2 is also true. false keeps the native behavior. |
| api-keys.codex.models.max-context-length | api-keys.codex.models.max-context-length | 0 | 0 means the context window advertised to a Codex client is not overridden. Only a positive number overrides it. |
| api-keys.codex.models.name | api-keys.codex.models.name | empty string | The request is sent to this upstream model name. OAuth aliases do not apply to api-keys groups. |
| api-keys.codex.models.support-configuration-update | api-keys.codex.models.support-configuration-update | It defaults to false, independently of the built-in OAuth model catalog. | The default is false, and it is not affected by the built-in OAuth model catalog. Only true enables configuration_update for this API-key model. |
| api-keys.gemini.models.alias | api-keys.gemini.models.alias | empty string | The client uses this name. In OAuth settings, an exact alias match wins over a name match. At the same level, the later entry wins. |
| api-keys.gemini.models.display-name | api-keys.gemini.models.display-name | empty string | When omitted, the catalog does not use a separate display name. |
| api-keys.gemini.models.force-mapping | api-keys.gemini.models.force-mapping | false | When true, the model field in the response is written back as the alias. false does not rewrite it. |
| api-keys.gemini.models.is-compat | api-keys.gemini.models.is-compat | Default false keeps the normal signature validation behavior. | false keeps ordinary signature validation. true keeps empty-signature thinking for a compatible upstream. |
| api-keys.gemini.models.max-context-length | api-keys.gemini.models.max-context-length | 0 | 0 means the context window advertised to a Codex client is not overridden. Only a positive number overrides it. |
| api-keys.gemini.models.name | api-keys.gemini.models.name | empty string | The request is sent to this upstream model name. OAuth aliases do not apply to api-keys groups. |
| api-keys.interactions.models.alias | api-keys.interactions.models.alias | empty string | The client uses this name. In OAuth settings, an exact alias match wins over a name match. At the same level, the later entry wins. |
| api-keys.interactions.models.display-name | api-keys.interactions.models.display-name | empty string | When omitted, the catalog does not use a separate display name. |
| api-keys.interactions.models.force-mapping | api-keys.interactions.models.force-mapping | false | When true, the model field in the response is written back as the alias. false does not rewrite it. |
| api-keys.interactions.models.is-compat | api-keys.interactions.models.is-compat | Default false keeps the normal signature validation behavior. | false keeps ordinary signature validation. true keeps empty-signature thinking for a compatible upstream. |
| api-keys.interactions.models.max-context-length | api-keys.interactions.models.max-context-length | 0 | 0 means the context window advertised to a Codex client is not overridden. Only a positive number overrides it. |
| api-keys.interactions.models.name | api-keys.interactions.models.name | empty string | The request is sent to this upstream model name. OAuth aliases do not apply to api-keys groups. |
| api-keys.meta.models.alias | api-keys.meta.models.alias | empty string | The client uses this name. In OAuth settings, an exact alias match wins over a name match. At the same level, the later entry wins. |
| api-keys.meta.models.display-name | api-keys.meta.models.display-name | empty string | When omitted, the catalog does not use a separate display name. |
| api-keys.meta.models.force-mapping | api-keys.meta.models.force-mapping | false | When true, the model field in the response is written back as the alias. false does not rewrite it. |
| api-keys.meta.models.is-compat | api-keys.meta.models.is-compat | Default false keeps the native behavior unchanged. | MultiAgentV2 agent_message is converted to portable Responses input only when client.codex.optimize-multi-agent-v2 is also true. false keeps the native behavior. |
| api-keys.meta.models.max-context-length | api-keys.meta.models.max-context-length | 0 | 0 means the context window advertised to a Codex client is not overridden. Only a positive number overrides it. |
| api-keys.meta.models.name | api-keys.meta.models.name | empty string | The request is sent to this upstream model name. OAuth aliases do not apply to api-keys groups. |
| api-keys.meta.models.support-configuration-update | api-keys.meta.models.support-configuration-update | It defaults to false, independently of the built-in OAuth model catalog. | The default is false, and it is not affected by the built-in OAuth model catalog. Only true enables configuration_update for this API-key model. |
| api-keys.openai-compatibility.models.alias | api-keys.openai-compatibility.models.alias | empty string | The client uses this name. In OAuth settings, an exact alias match wins over a name match. At the same level, the later entry wins. |
| api-keys.openai-compatibility.models.display-name | api-keys.openai-compatibility.models.display-name | empty string | When omitted, the catalog does not use a separate display name. |
| api-keys.openai-compatibility.models.force-mapping | api-keys.openai-compatibility.models.force-mapping | false | When true, the model field in the response is written back as the alias. false does not rewrite it. |
| api-keys.openai-compatibility.models.image | api-keys.openai-compatibility.models.image | false | Only true allows /v1/images/generations and /v1/images/edits. It does not mean chat input supports images. |
| api-keys.openai-compatibility.models.input-modalities | api-keys.openai-compatibility.models.input-modalities | nil | For example text and image. This is input capability for chat and Responses, not the image-endpoint switch. |
| api-keys.openai-compatibility.models.is-compat | api-keys.openai-compatibility.models.is-compat | Default false keeps the normal signature validation behavior. | false keeps ordinary signature validation. true keeps Claude thinking blocks for a compatible upstream. |
| api-keys.openai-compatibility.models.max-context-length | api-keys.openai-compatibility.models.max-context-length | 0 | 0 means the context window advertised to a Codex client is not overridden. Only a positive number overrides it. |
| api-keys.openai-compatibility.models.name | api-keys.openai-compatibility.models.name | empty string | The request is sent to this upstream model name. OAuth aliases do not apply to api-keys groups. |
| api-keys.openai-compatibility.models.output-modalities | api-keys.openai-compatibility.models.output-modalities | nil | When known, declare output modalities, for example text and image. Omitting it means no extra declaration. |
| api-keys.openai-compatibility.models.use-max-completion-tokens | api-keys.openai-compatibility.models.use-max-completion-tokens | Default false preserves max_tokens for older compatible upstreams. | false keeps sending max_tokens. true switches to max_completion_tokens. |
| api-keys.vertex.models.alias | api-keys.vertex.models.alias | empty string | The client uses this name. In OAuth settings, an exact alias match wins over a name match. At the same level, the later entry wins. |
| api-keys.vertex.models.display-name | api-keys.vertex.models.display-name | empty string | When omitted, the catalog does not use a separate display name. |
| api-keys.vertex.models.force-mapping | api-keys.vertex.models.force-mapping | false | When true, the model field in the response is written back as the alias. false does not rewrite it. |
| api-keys.vertex.models.name | api-keys.vertex.models.name | empty string | The request is sent to this upstream model name. OAuth aliases do not apply to api-keys groups. |
| api-keys.xai.models.alias | api-keys.xai.models.alias | empty string | The client uses this name. In OAuth settings, an exact alias match wins over a name match. At the same level, the later entry wins. |
| api-keys.xai.models.display-name | api-keys.xai.models.display-name | empty string | When omitted, the catalog does not use a separate display name. |
| api-keys.xai.models.force-mapping | api-keys.xai.models.force-mapping | false | When true, the model field in the response is written back as the alias. false does not rewrite it. |
| api-keys.xai.models.is-compat | api-keys.xai.models.is-compat | Default false keeps the native behavior unchanged. | MultiAgentV2 agent_message is converted to portable Responses input only when client.codex.optimize-multi-agent-v2 is also true. false keeps the native behavior. |
| api-keys.xai.models.max-context-length | api-keys.xai.models.max-context-length | 0 | 0 means the context window advertised to a Codex client is not overridden. Only a positive number overrides it. |
| api-keys.xai.models.name | api-keys.xai.models.name | empty string | The request is sent to this upstream model name. OAuth aliases do not apply to api-keys groups. |
| api-keys.xai.models.support-configuration-update | api-keys.xai.models.support-configuration-update | It defaults to false, independently of the built-in OAuth model catalog. | The default is false, and it is not affected by the built-in OAuth model catalog. Only true enables configuration_update for this API-key model. |

## 5. Common errors and limits

These fields are loaded by type. A Codex-shaped is-compat converts agent_message only when client.codex.optimize-multi-agent-v2 is also true. image only opens the two image routes. It does not mean chat can accept an image.

## 6. Related behavior

OAuth aliases are in [OAuth directory, aliases, and exclusions](/accounts/oauth).

## 7. Field experience

- [An alias takes part in round-robin only when it matches the requested model name](/experience/accounts#exp-accounts-alias-matches-request)
- [A compatible provider needs both a base URL and an alias](/experience/accounts#exp-accounts-compat-base-and-alias)
- [Compatible models keep signed thinking](/experience/accounts#exp-accounts-compat-preserves-signed-thinking)
- [The display name and the alias are two fields](/experience/accounts#exp-accounts-display-name-field)
- [force-mapping changes the response model to the alias](/experience/accounts#exp-accounts-force-mapping-alias)
- [A compatible model appears in the list only after it is written into the configuration](/experience/accounts#exp-accounts-list-compat-models)
- [Connect a third party through the OpenAI-compatible section](/experience/accounts#exp-accounts-openai-compatible-provider)
- [Compaction needs the upstream to provide a compaction model](/experience/api#exp-api-compaction-needs-model)
- [Change the advertised window with max-context-length](/experience/configuration#exp-configuration-advertise-context-length)
- [Use a fork alias to distinguish image sizes](/experience/routing#exp-routing-fork-alias-for-image-size)
- [Models with the same name share a routing strategy](/experience/routing#exp-routing-same-model-name)

