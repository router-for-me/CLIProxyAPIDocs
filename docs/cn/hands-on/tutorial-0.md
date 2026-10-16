# 零：配置详细解说

配置已经能启动时，按下面的顺序打开对应功能页。本页不列出键的默认值，也不再贴出一份完整的 `config.yaml`。默认值、约束和错误只以所链接的页面为准。

## 场景

你打开现有配置，想确认监听、客户端密钥、管理端、上游账号和路由各自该改哪里。

## 步骤

1. 先确认进程读哪一份配置，以及有哪些启动参数。见[命令行参数](/cn/introduction/install)。
2. 改主机、端口、请求体上限或受信任代理时，只改[监听与进程](/cn/operations/server)。需要证书时另看 [TLS](/cn/operations/tls)。
3. 调用本代理的密钥写在[客户端密钥](/cn/api/access)。它不是上游提供商的密钥。示例一律使用 `YOUR_API_KEY`。
4. 管理 API、控制面板和远程访问见[管理端设置](/cn/operations/management-settings)。管理路由见[管理 API v8](/cn/management/apiv8)。
5. OAuth 凭证放在哪、如何起别名，见[OAuth 目录、别名与排除](/cn/accounts/oauth)。各提供商登录分开看：[Claude 登录](/cn/accounts/claude)、[Codex 登录](/cn/accounts/codex)、[反重力登录](/cn/accounts/antigravity)、[Kimi 登录](/cn/accounts/kimi)、[Kimi.ai 登录](/cn/accounts/kimi-ai)、[xAI 登录](/cn/accounts/xai)、[Devin 登录](/cn/accounts/devin)、[Meta 登录](/cn/accounts/meta)、[Vertex 服务账号导入](/cn/accounts/vertex)。回调见[OAuth 回调](/cn/accounts/oauth-callback)。
6. 用 API 密钥而不是 OAuth 时，密钥见[上游 API 密钥](/cn/accounts/api-keys-api)，基础地址见[上游基础地址](/cn/accounts/api-keys-base)。名称、别名、前缀、优先级、权重、按密钥代理和额外请求头分别见[OpenAI 兼容提供商名称](/cn/accounts/api-keys-name)、[上游模型别名](/cn/accounts/api-keys-models)、[模型名前缀](/cn/accounts/api-keys-prefix)、[凭证优先级](/cn/accounts/api-keys-priority)、[凭证权重](/cn/accounts/api-keys-weight)、[按密钥代理](/cn/accounts/api-keys-proxy)、[上游额外请求头](/cn/accounts/api-keys-headers)。
7. 模型列表从哪里来，见[模型目录](/cn/introduction/models)。思考档位见[模型思考能力](/cn/configuration/thinking-models)。
8. 多凭证怎么选、失败后怎么换，见[路由策略](/cn/routing/strategy)。冷却见[冷却](/cn/routing/cooldown)。旧的配额开关不再驱动切换，见[配额兼容开关](/cn/routing/quota-exceeded)。
9. 要改写出站 JSON 时，按动作打开对应页，不要在本页写规则表：[默认载荷规则](/cn/routing/requests-default)、[覆盖载荷规则](/cn/routing/requests-override)、[过滤载荷规则](/cn/routing/requests-filter)、[出站请求](/cn/routing/requests-value)、[首字节前重试](/cn/routing/requests-bootstrap)、[流式保活](/cn/routing/requests-keepalive)、[首个 token 前保活](/cn/routing/requests-send)。
10. 日志和用量见[日志与用量](/cn/operations/observability)。存活探测见[健康检查](/cn/operations/health)。局域网发现见[局域网发现](/cn/operations/discovery)。Home 见 [CLIProxyAPI Home](/cn/operations/home)。插件加载见[插件加载与商店](/cn/operations/plugins)。
11. 用容器启动时，只按[使用 Docker Compose](/cn/docker/docker)操作。

## 不要在本页完成的事

不要把某一页的字段表复制到这里。本页若单独写出某个键的含义，就会变成那项功能的另一份说明书。
