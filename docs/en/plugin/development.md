---
title: Plugin development
feature_ids: []
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: true
translation_pending: false
---

# Plugin development

Each interface has been split according to `sdk/pluginapi` and `sdk/pluginabi` in the pinned commit. This page no longer registers features, and it does not repeat each method's parameters and return values.

`ABIVersion` is 1. The current JSON contract `SchemaVersion` is 6. A plugin registers with `plugin.register`. After it is already registered, later configuration uses `plugin.reconfigure`. `Name`, `Version`, `Author`, and `GitHubRepository` in `result.metadata` cannot be blank, and at least one capability must be turned on, or registration is invalid. Disable and exit correspond to `plugin.quiesce` and `plugin.shutdown`. The load directory and the enable switch are in [Plugin loading and the store](/operations/plugins).

- [Model registrar](/plugin/model-registrar), [Model provider](/plugin/model-provider), [Credential provider](/plugin/auth-provider), [Frontend authentication provider](/plugin/frontend-auth-provider), [Exclusive frontend authentication](/plugin/frontend-auth-exclusive), [Scheduler](/plugin/scheduler), [Model router](/plugin/model-router), [Executor](/plugin/executor)
- [Request translation](/plugin/request-translator), [Request normalization](/plugin/request-normalizer), [Request interceptor](/plugin/request-interceptor), [Request lifecycle](/plugin/request-lifecycle)
- [Response translation](/plugin/response-translator), [Response normalization](/plugin/response-normalizer), [Before-translation response guide](/plugin/response-before-translator), [After-translation response guide](/plugin/response-after-translator), [Response interceptor](/plugin/response-interceptor), [Streaming response interceptor](/plugin/response-stream-interceptor), [WebSocket response observer](/plugin/websocket-observer)
- [Thinking handling](/plugin/thinking-applier), [Usage observer](/plugin/usage-plugin), [Command-line extension](/plugin/command-line-plugin), [Management API](/plugin/management-api), [Quota provider](/plugin/quota-provider), [Host HTTP client](/plugin/host-callbacks)
