---
title: 插件开发
feature_ids: []
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: true
---

# 插件开发

各接口已按钉住提交的 `sdk/pluginapi` 与 `sdk/pluginabi` 拆开。本页不再登记功能，也不重复各方法的参数和返回值。

`ABIVersion` 是 1。当前 JSON 契约 `SchemaVersion` 是 6。插件用 `plugin.register` 登记；已经登记后再配置时走 `plugin.reconfigure`。`result.metadata` 的 `Name`、`Version`、`Author`、`GitHubRepository` 不能为空白，并且至少打开一项能力，否则登记无效。停用与退出对应 `plugin.quiesce`、`plugin.shutdown`。加载目录和启用开关见 [插件加载与商店](/cn/operations/plugins)。

- [模型注册器](/cn/plugin/model-registrar)、[模型提供方](/cn/plugin/model-provider)、[凭证提供方](/cn/plugin/auth-provider)、[前端认证提供方](/cn/plugin/frontend-auth-provider)、[前端认证独占模式](/cn/plugin/frontend-auth-exclusive)、[调度器](/cn/plugin/scheduler)、[模型路由](/cn/plugin/model-router)、[执行器](/cn/plugin/executor)
- [请求转换](/cn/plugin/request-translator)、[请求规整](/cn/plugin/request-normalizer)、[请求拦截](/cn/plugin/request-interceptor)、[请求生命周期](/cn/plugin/request-lifecycle)
- [响应转换](/cn/plugin/response-translator)、[响应规整](/cn/plugin/response-normalizer)、[响应转换前导读](/cn/plugin/response-before-translator)、[响应转换后导读](/cn/plugin/response-after-translator)、[响应拦截](/cn/plugin/response-interceptor)、[流式响应拦截](/cn/plugin/response-stream-interceptor)、[WebSocket 响应观察](/cn/plugin/websocket-observer)
- [Thinking 处理](/cn/plugin/thinking-applier)、[用量观察](/cn/plugin/usage-plugin)、[命令行扩展](/cn/plugin/command-line-plugin)、[Management API](/cn/plugin/management-api)、[额度提供方](/cn/plugin/quota-provider)、[宿主 HTTP 客户端](/cn/plugin/host-callbacks)
