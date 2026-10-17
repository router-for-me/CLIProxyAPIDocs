---
title: "Zero: Detailed Configuration Explanation"
translation_pending: false
---

# Zero: Detailed Configuration Explanation

Once the configuration can start, open the matching feature page in the order below. This page does not list key defaults and does not paste a complete `config.yaml`. Defaults, constraints, and errors are defined only by the linked pages.

## Scenario

You open an existing configuration and want to confirm where to change the listener, the client key, the management endpoint, upstream accounts, and routing.

## Steps

1. First confirm which configuration file the process reads, and which startup flags exist. See [Command-line flags](/introduction/install).
2. When changing the host, port, request-body limit, or trusted proxies, change only [Listener and process](/operations/server). For certificates, also see [TLS](/operations/tls).
3. The key that calls this proxy is in [Client API keys](/api/access). It is not an upstream provider key. Examples always use `YOUR_API_KEY`.
4. The management API, control panel, and remote access are in [Management settings](/operations/management-settings). Management routes are in [Management API v8](/management/apiv8).
5. Where OAuth credentials go, and how to alias them, is in [OAuth directory, aliases, and exclusions](/accounts/oauth). Provider logins are separate: [Claude login](/accounts/claude), [Codex login](/accounts/codex), [Antigravity login](/accounts/antigravity), [Kimi login](/accounts/kimi), [Kimi.ai login](/accounts/kimi-ai), [xAI login](/accounts/xai), [Devin login](/accounts/devin), [Meta login](/accounts/meta), and [Vertex service-account import](/accounts/vertex). Callbacks are in [OAuth callbacks](/accounts/oauth-callback).
6. When using an API key instead of OAuth, the key is in [Upstream API keys](/accounts/api-keys-api) and the base URL is in [Upstream base URLs](/accounts/api-keys-base). Name, aliases, prefix, priority, weight, per-key proxy, and extra headers are in [OpenAI-compatible provider name](/accounts/api-keys-name), [Upstream model aliases](/accounts/api-keys-models), [Model-name prefix](/accounts/api-keys-prefix), [Credential priority](/accounts/api-keys-priority), [Credential weight](/accounts/api-keys-weight), [Per-key proxy](/accounts/api-keys-proxy), and [Upstream extra headers](/accounts/api-keys-headers).
7. Where the model list comes from is in [Model catalogs](/introduction/models). Thinking levels are in [Model thinking](/configuration/thinking-models).
8. How multiple credentials are chosen, and how a failure switches away, is in [Routing strategy](/routing/strategy). Cooldown is in [Cooldown](/routing/cooldown). The old quota switches no longer drive switching. See [Quota compatibility switches](/routing/quota-exceeded).
9. To change outbound JSON, open the page for that action. Do not write a rule table on this page: [Default payload rules](/routing/requests-default), [Override payload rules](/routing/requests-override), [Filter payload rules](/routing/requests-filter), [Outbound requests](/routing/requests-value), [Retry before the first byte](/routing/requests-bootstrap), [Streaming keep-alive](/routing/requests-keepalive), and [Keep-alive before the first token](/routing/requests-send).
10. Logs and usage are in [Logs and usage](/operations/observability). Liveness probes are in [Health checks](/operations/health). LAN discovery is in [LAN discovery](/operations/discovery). Home is in [CLIProxyAPI Home](/operations/home). Plugin loading is in [Plugin loading and the store](/operations/plugins).
11. When starting with a container, follow only [Run with Docker Compose](/docker/docker).

## What not to finish on this page

Do not copy a field table from another page into this one. If this page states the meaning of a key by itself, it becomes a second manual for that feature.
