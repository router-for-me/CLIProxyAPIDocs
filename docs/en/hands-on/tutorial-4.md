---
title: "Four: Relay Forwarding Integration"
translation_pending: false
---

# Four: Relay Forwarding Integration

Put an OpenAI-compatible relay, or a Claude or Codex upstream API, behind this proxy, then call this proxy with a client key.

## Scenario

You already have the relay base URL and the upstream key. Addresses in the documentation are written as `https://example.invalid`. Both the upstream key and the client key are written as `YOUR_API_KEY`. Do not write a real key from a provider console into the repository.

## Steps

1. Separate the two kinds of keys first. The client calls this proxy. See [Client API keys](/api/access). The key sent upstream is in [Upstream API keys](/accounts/api-keys-api).
2. The base URL belongs to the whole group, not to a single key. See [Upstream base URLs](/accounts/api-keys-base). An OpenAI-compatible provider has no built-in official address. Fill it in as that page says.
3. Give the OpenAI-compatible upstream a name. See [OpenAI-compatible provider name](/accounts/api-keys-name).
4. To map the model name the client sees to the relay model name, see [Upstream model aliases](/accounts/api-keys-models). To expose only some models, see [Model-name prefix](/accounts/api-keys-prefix) and [Per-key excluded models](/accounts/api-keys-excluded).
5. To give multiple keys a priority or a weight, see [Credential priority](/accounts/api-keys-priority) and [Credential weight](/accounts/api-keys-weight). When one key uses its own proxy, see [Per-key proxy](/accounts/api-keys-proxy).
6. Do not expand disabling a whole group, extra headers, retries, or single-key cooldown on this page. See [Disable an OpenAI-compatible provider](/accounts/api-keys-disabled), [Upstream extra headers](/accounts/api-keys-headers), [Retry and request-scoped errors](/accounts/api-keys-request), and [Cooldown and the Codex cloak switch](/accounts/api-keys-disable).
7. If Claude also needs upstream behavior changes, see [Claude upstream behavior](/accounts/upstream). Do not mix that into the API-key pages.
8. After the configuration is written, call a registered route with the client key. Chat completions are in [OpenAI Chat](/api/openai-chat), Responses are in [Responses](/api/responses), and Claude is in [Claude Messages](/api/claude-messages).
9. When several upstreams are available at once, the selection order is in [Routing strategy](/routing/strategy).
10. An agent only changes its own provider address and this proxy's client key. See [Codex](/agent-client/codex), [Claude Code](/agent-client/claude-code), [OpenCode](/agent-client/opencode), [Factory Droid](/agent-client/droid), [PI](/agent-client/pi), and [Grok Build](/agent-client/grok-build).

## What not to finish on this page

Do not paste a real address, screenshot, or complete configuration from a particular relay. The field shape is defined by the feature pages in the steps.
