---
title: "管理 使用经验"
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---
# 管理

## 适用版本与边界

本页收录的做法只对照钉住提交 `911f49cbd49f4fe2516979754a7488a3fd14fe64` 里仍然存在的配置、路由或命令。本页不是官方行为承诺。密钥、Cookie、邮箱、授权文件和用户请求正文都没有抄入。

## 短做法

- <a id="exp-management-reset-cooldown"></a>**用管理路由清除冷却**（`exp.management.reset-cooldown`）。现象：上游额度已经恢复，但凭证仍被冷却跳过。做法：向 POST /v8/management/routing/cooldown/reset 提交该凭证的 auth_index。PATCH /v8/management/credentials/status 只修改 disabled，不会清除冷却。来源 issue：[#4724](https://github.com/router-for-me/CLIProxyAPI/issues/4724)、[#5611](https://github.com/router-for-me/CLIProxyAPI/issues/5611)、[#5639](https://github.com/router-for-me/CLIProxyAPI/issues/5639)、[#5649](https://github.com/router-for-me/CLIProxyAPI/issues/5649)。对应官方页：[管理端路由操作](/cn/management/v8-routing)、[冷却](/cn/routing/cooldown)。
- <a id="exp-management-disable-credential"></a>**用管理接口暂停凭证**（`exp.management.disable-credential`）。现象：额度用尽后只被冷却跳过，文件本身仍会继续参与。做法：冷却不会自动禁用凭证。用 PATCH /v8/management/credentials/status 把 disabled 设为 true 或 false 来暂停或恢复。来源 issue：[#3882](https://github.com/router-for-me/CLIProxyAPI/issues/3882)、[#5133](https://github.com/router-for-me/CLIProxyAPI/issues/5133)。对应官方页：[管理凭证](/cn/management/v8-credentials)、[冷却](/cn/routing/cooldown)。
- <a id="exp-management-api-call-proxy-order"></a>**管理代发请求仍会使用全局代理**（`exp.management.api-call-proxy-order`）。现象：以为管理端代发永远直连，不使用模型请求的 proxy-url。做法：POST /v8/management/requests/api-call 依次使用请求体 proxy_url、凭证代理，然后是全局 requests.proxy-url。都没有可用代理时才直连。来源 issue：[#6395](https://github.com/router-for-me/CLIProxyAPI/issues/6395)。对应官方页：[管理端代发请求](/cn/management/v8-requests)、[出站请求](/cn/routing/requests-value)。
- <a id="exp-management-disabled-oauth-still-refreshes"></a>**禁用的 OAuth 凭证仍会刷新**（`exp.management.disabled-oauth-still-refreshes`）。现象：关闭凭证后令牌过期。做法：真正的 OAuth 文件在 disabled 后默认仍刷新，避免停用期间过期。非 OAuth 来源的凭证不会这样刷新。来源 issue：[#3290](https://github.com/router-for-me/CLIProxyAPI/issues/3290)、[#3514](https://github.com/router-for-me/CLIProxyAPI/issues/3514)。对应官方页：[Codex 登录](/cn/accounts/codex)、[管理凭证](/cn/management/v8-credentials)。
- <a id="exp-management-set-credential-priority"></a>**在凭证字段上设置优先级**（`exp.management.set-credential-priority`）。现象：导入的 JSON 需要更高的 Plus 或 Pro 优先级。做法：用 PATCH /v8/management/credentials/fields 修改该凭证的 priority。新文件没有单独的默认优先级，要写在凭证自己身上。来源 issue：[#3348](https://github.com/router-for-me/CLIProxyAPI/issues/3348)、[#5030](https://github.com/router-for-me/CLIProxyAPI/issues/5030)。对应官方页：[凭证优先级](/cn/accounts/api-keys-priority)、[管理凭证](/cn/management/v8-credentials)、[OAuth 目录、别名与排除](/cn/accounts/oauth)。
- <a id="exp-management-reset-codex-from-panel"></a>**在管理页重置 Codex 账号**（`exp.management.reset-codex-from-panel`）。现象：想重置 Codex 账号，但只找到了凭证文件。做法：从管理页的凭证界面操作。代理没有另一条独立的重置命令。来源 issue：[#4024](https://github.com/router-for-me/CLIProxyAPI/issues/4024)。对应官方页：[Codex 登录](/cn/accounts/codex)、[其他入口](/cn/api/openai-other)。

## 独立页

这一区域没有需要独立成页的做法。
