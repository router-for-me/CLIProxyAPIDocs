---
title: Codex client catalog
feature_ids:
  - client.codex.enable-apply-patch
  - client.codex.optimize-multi-agent-v2
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Codex client catalog

## 1. What this solves

When a Codex client fetches the model catalog, the proxy can additionally advertise freeform `apply_patch`, and it can rewrite official Codex multi-agent v2 requests. Both switches apply to OAuth and API-key routing.

## 2. Scope and non-goals

They live under `client.codex`, not `oauth.providers.codex`, and not on a single API key. The old provider path of `optimize-multi-agent-v2` migrates here. When the canonical path is present, it wins. An explicit false also wins. This page does not change upstream Codex cloaking, WebSocket steering, or the media relay.

## 3. How to configure or call it

```yaml
client:
  codex:
    enable-apply-patch: false
    optimize-multi-agent-v2: false
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| client.codex.enable-apply-patch | Whether to advertise freeform apply_patch in the Codex client catalog. | Default false clears the capability regardless of template metadata. | false clears that capability from template metadata and keeps only models that natively declare freeform apply_patch. When true, non-template and bridge models supported by every routing executor also advertise freeform. |
| client.codex.optimize-multi-agent-v2 | Whether to optimize official Codex multi-agent v2 requests. | Default false leaves the client's multi-agent behavior unchanged. | false does not change the client's multi-agent behavior. When true, it refreshes the model details of spawn_agent, removes message-parameter encryption, normalizes encrypted agent_message for Codex, and converts agent_message in a non-Codex upstream protocol into an ordinary user message. It applies only to Codex Desktop, codex-tui, and codex_cli_rs. |

## 5. Common errors and limits

Both keys are booleans. false is a valid configuration. It is not omission. If `optimize-multi-agent-v2` is written only on the old provider path, and `client.codex` already has a value, the old path does not override it.

## 6. Related behavior

Credential selection is in [Routing strategy](/routing/strategy). Rewriting the final JSON per model is in [Default payload rules](/routing/requests-default), [Override payload rules](/routing/requests-override), and [Filter payload rules](/routing/requests-filter).

## 7. Field experience

- [Turn on the multi-agent compatibility switch](/experience/configuration#exp-configuration-optimize-multi-agent)
