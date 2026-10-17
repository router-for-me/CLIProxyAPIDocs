---
title: "运行 使用经验"
related_feature_ids:
  - auth.claude.login
  - cli.server.antigravity-login
  - cli.server.codex-login
  - cli.server.config
  - cli.server.tui
  - management.allow-remote.value
  - management.disable-control-panel.value
  - management.secret-key.value
  - management.v8.get-observability-usage-api-keys
  - management.v8.get-observability-usage-queue
  - models.catalog.value
  - oauth.auth-dir.value
  - observability.logs.debug
  - observability.logs.logging-to-file
  - observability.logs.logs-max-total-size-mb
  - observability.logs.request-log
  - observability.usage.usage-statistics-enabled
  - route.management-html.get
  - server.commercial-mode.value
  - server.host.value
  - server.port.value
  - server.tls.cert
  - server.tls.enable
  - server.tls.key
source_issues:
  - 56
  - 190
  - 541
  - 635
  - 681
  - 844
  - 863
  - 944
  - 954
  - 1020
  - 1393
  - 1497
  - 1589
  - 1772
  - 1790
  - 2195
  - 2315
  - 2498
  - 2541
  - 2617
  - 2828
  - 2925
  - 2955
  - 3035
  - 3220
  - 3270
  - 3405
  - 3732
  - 3743
  - 4019
  - 4483
  - 4807
  - 5314
  - 5972
  - 6060
  - 6323
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---
# 运行

## 适用版本与边界

本页收录的做法只对照钉住提交 `911f49cbd49f4fe2516979754a7488a3fd14fe64` 里仍然存在的配置、路由或命令。本页不是官方行为承诺。密钥、Cookie、邮箱、授权文件和用户请求正文都没有抄入。

## 短做法

- <a id="exp-operations-usage-stays-in-memory"></a>**用量只留在内存里**（`exp.operations.usage-stays-in-memory`）。现象：重启或升级后用量归零，面板里也没有历史。做法：先打开 usage-statistics-enabled。计数可用 GET /v8/management/observability/usage/api-keys 查看，记录用 GET /v8/management/observability/usage/queue 取出。代理不把它们写入磁盘，也没有恢复接口。来源 issue：[#541](https://github.com/router-for-me/CLIProxyAPI/issues/541)、[#681](https://github.com/router-for-me/CLIProxyAPI/issues/681)、[#863](https://github.com/router-for-me/CLIProxyAPI/issues/863)、[#1497](https://github.com/router-for-me/CLIProxyAPI/issues/1497)、[#1589](https://github.com/router-for-me/CLIProxyAPI/issues/1589)、[#2828](https://github.com/router-for-me/CLIProxyAPI/issues/2828)、[#2955](https://github.com/router-for-me/CLIProxyAPI/issues/2955)、[#3035](https://github.com/router-for-me/CLIProxyAPI/issues/3035)、[#3220](https://github.com/router-for-me/CLIProxyAPI/issues/3220)。对应官方页：[管理端日志与用量](/cn/management/v8-observability)、[日志与用量](/cn/operations/observability)。
- <a id="exp-operations-request-log-text"></a>**用请求日志查看文本原文**（`exp.operations.request-log-text`）。现象：用量为零，或者想确认请求有没有被记下来。做法：request-log 是配置开关。打开后日志是可读文本，不是结构化流。用量被上游省略时，用它看原始正文。再打开 debug 时，日志会写出选中的凭证文件名。来源 issue：[#1020](https://github.com/router-for-me/CLIProxyAPI/issues/1020)、[#1772](https://github.com/router-for-me/CLIProxyAPI/issues/1772)、[#3732](https://github.com/router-for-me/CLIProxyAPI/issues/3732)、[#4807](https://github.com/router-for-me/CLIProxyAPI/issues/4807)、[#5314](https://github.com/router-for-me/CLIProxyAPI/issues/5314)。对应官方页：[日志与用量](/cn/operations/observability)。
- <a id="exp-operations-cap-request-logs"></a>**限制请求日志总大小**（`exp.operations.cap-request-logs`）。现象：打开 request-log 后磁盘或 Docker 卷持续增长。做法：把 logs-max-total-size-mb 设为正数。超过该上限才删除最旧日志。0 表示不清理。来源 issue：[#2498](https://github.com/router-for-me/CLIProxyAPI/issues/2498)、[#3405](https://github.com/router-for-me/CLIProxyAPI/issues/3405)。对应官方页：[日志与用量](/cn/operations/observability)。
- <a id="exp-operations-disable-request-log"></a>**关掉请求日志止住刷屏**（`exp.operations.disable-request-log`）。现象：启动后请求日志暴涨。做法：把 request-log 设为 false，并让客户端停止发送过大的提示词。来源 issue：[#635](https://github.com/router-for-me/CLIProxyAPI/issues/635)。对应官方页：[日志与用量](/cn/operations/observability)。
- <a id="exp-operations-management-secret"></a>**管理登录使用 secret-key**（`exp.operations.management-secret`）。现象：远程或网页打不开管理端，或记不住管理密码。做法：管理密钥是配置里的 secret-key，也要和 MANAGEMENT_PASSWORD 一致。远程访问还要把 allow-remote 设为 true。服务器不能从哈希里找回旧密码。本项目生成的凭证复制到 auth-dir 即可使用。来源 issue：[#56](https://github.com/router-for-me/CLIProxyAPI/issues/56)、[#844](https://github.com/router-for-me/CLIProxyAPI/issues/844)、[#2315](https://github.com/router-for-me/CLIProxyAPI/issues/2315)、[#2617](https://github.com/router-for-me/CLIProxyAPI/issues/2617)、[#2925](https://github.com/router-for-me/CLIProxyAPI/issues/2925)、[#3270](https://github.com/router-for-me/CLIProxyAPI/issues/3270)。对应官方页：[命令行参数](/cn/introduction/install)、[管理端设置](/cn/operations/management-settings)、[OAuth 目录、别名与排除](/cn/accounts/oauth)、[其他入口](/cn/api/openai-other)。
- <a id="exp-operations-bind-host-port"></a>**空 host 会监听所有接口**（`exp.operations.bind-host-port`）。现象：服务只想绑定某个地址，或不确定空 host 的含义。做法：server.host 为空时，在 server.port 上监听所有接口。需要指定地址时再填写 host。来源 issue：[#190](https://github.com/router-for-me/CLIProxyAPI/issues/190)。对应官方页：[监听与进程](/cn/operations/server)。
- <a id="exp-operations-reduce-memory"></a>**关掉高开销日志降低内存**（`exp.operations.reduce-memory`）。现象：进程内存随请求升高。做法：关闭 usage-statistics-enabled、request-log 和 debug。需要进一步减少每请求开销时，把 server.commercial-mode 设为 true，此时请求日志中间件不会挂上。来源 issue：[#944](https://github.com/router-for-me/CLIProxyAPI/issues/944)。对应官方页：[日志与用量](/cn/operations/observability)、[监听与进程](/cn/operations/server)。
- <a id="exp-operations-log-directory"></a>**日志写在可写的 logs 目录**（`exp.operations.log-directory`）。现象：在 Home 配置目录里找不到日志。做法：应用日志和 request-log 优先写到可写基础目录下的 logs。没有该目录时用当前目录的 logs，当前目录不可写才落到 auth-dir/logs。来源 issue：[#954](https://github.com/router-for-me/CLIProxyAPI/issues/954)、[#5972](https://github.com/router-for-me/CLIProxyAPI/issues/5972)。对应官方页：[OAuth 目录、别名与排除](/cn/accounts/oauth)、[日志与用量](/cn/operations/observability)。
- <a id="exp-operations-auth-unavailable-means-no-credential"></a>**auth_unavailable 表示没有可用凭证**（`exp.operations.auth-unavailable-means-no-credential`）。现象：请求返回 auth_unavailable，被当成正文被拒绝。做法：它表示该模型没有可选凭证，不是请求体不合法。打开 request-log 查看模型为何被隐藏。目录里有模型名也不等于已经有可用的 Claude 或 Codex 凭证。来源 issue：[#1393](https://github.com/router-for-me/CLIProxyAPI/issues/1393)、[#6060](https://github.com/router-for-me/CLIProxyAPI/issues/6060)、[#6323](https://github.com/router-for-me/CLIProxyAPI/issues/6323)。对应官方页：[Claude 登录](/cn/accounts/claude)、[反重力登录](/cn/accounts/antigravity)、[Codex 登录](/cn/accounts/codex)、[模型目录](/cn/introduction/models)、[日志与用量](/cn/operations/observability)。
- <a id="exp-operations-tui-is-client"></a>**TUI 默认只是管理客户端**（`exp.operations.tui-is-client`）。现象：--tui 退出后代理也停了，或反过来以为它会拉起服务。做法：不带 --standalone 的 --tui 只连接已经运行的管理 API，不会自己保持代理进程。来源 issue：[#1790](https://github.com/router-for-me/CLIProxyAPI/issues/1790)。对应官方页：[终端界面](/cn/operations/tui)。
- <a id="exp-operations-tls-needs-cert"></a>**启用 TLS 时必须提供证书**（`exp.operations.tls-needs-cert`）。现象：打开 TLS 后 HTTPS 起不来。做法：server.tls.enable 为 true 时，tls.cert 和 tls.key 都不能为空。来源 issue：[#2195](https://github.com/router-for-me/CLIProxyAPI/issues/2195)。对应官方页：[TLS](/cn/operations/tls)。
- <a id="exp-operations-panel-route-is-html"></a>**关闭面板后没有哈希管理地址**（`exp.operations.panel-route-is-html`）。现象：带哈希的管理 URL 返回 404。做法：disable-control-panel 为 true 时不提供面板。面板路由只是 management.html，没有另一条哈希地址。来源 issue：[#2541](https://github.com/router-for-me/CLIProxyAPI/issues/2541)。对应官方页：[管理端设置](/cn/operations/management-settings)、[其他入口](/cn/api/openai-other)。
- <a id="exp-operations-port-already-bound"></a>**端口已被占用时先停掉旧进程**（`exp.operations.port-already-bound`）。现象：启动时出现开发版横幅，或端口冲突。做法：另一进程已经绑定 server.port。停掉旧进程后再启动。来源 issue：[#3743](https://github.com/router-for-me/CLIProxyAPI/issues/3743)。对应官方页：[监听与进程](/cn/operations/server)。
- <a id="exp-operations-disconnect-drops-usage"></a>**客户端断开后没有最终用量**（`exp.operations.disconnect-drops-usage`）。现象：用量统计缺少最后一块。做法：客户端断开会取消上游调用，最终用量块就不会到达。统计本身仍然只在内存中，并且可以包含缓存读取和缓存创建计数。来源 issue：[#4019](https://github.com/router-for-me/CLIProxyAPI/issues/4019)、[#4483](https://github.com/router-for-me/CLIProxyAPI/issues/4483)。对应官方页：[日志与用量](/cn/operations/observability)。

## 独立页

这一区域没有需要独立成页的做法。
