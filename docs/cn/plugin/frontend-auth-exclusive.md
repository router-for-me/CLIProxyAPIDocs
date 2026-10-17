---
title: 前端认证独占模式
feature_ids: []
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: true
---

# 前端认证独占模式

`FrontendAuthProviderExclusive` 是登记布尔值，不是单独的接口方法，因此本页没有功能 ID。

它和 `frontend_auth_provider` 一起出现在 `plugin.register` 的 `capabilities` 里，JSON 键是 `frontend_auth_provider_exclusive`。按 `sdk/pluginapi.Capabilities` 的说明，设为 true 且该前端认证提供方被选中时，它成为唯一生效的请求认证提供方。方法仍是 [前端认证提供方](/cn/plugin/frontend-auth-provider) 的 `Identifier` 与 `Authenticate`。
