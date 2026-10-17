---
title: Exclusive frontend authentication
feature_ids: []
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: true
translation_pending: false
---

# Exclusive frontend authentication

`FrontendAuthProviderExclusive` is a registration boolean, not a separate interface method, so this page has no feature ID.

It appears together with `frontend_auth_provider` in the `capabilities` of `plugin.register`. The JSON key is `frontend_auth_provider_exclusive`. As described by `sdk/pluginapi.Capabilities`, when it is true and that frontend authentication provider is selected, it becomes the only request-authentication provider that takes effect. The methods are still `Identifier` and `Authenticate` from [Frontend authentication provider](/plugin/frontend-auth-provider).
