---
title: "配置 使用经验"
related_feature_ids:
  - api-keys.claude.models-thinking-levels
  - api-keys.codex.models-thinking-levels
  - api-keys.openai-compatibility.models-max-context-length
  - api-keys.openai-compatibility.models-thinking-levels
  - cli.server.antigravity-login
  - cli.server.codex-login
  - cli.server.config
  - cli.server.xai-login
  - client.codex.optimize-multi-agent-v2
  - models.codex-catalog.value
  - oauth.providers.antigravity-antigravity-credits
  - oauth.settings.max-context-length
  - requests.payload.filter-params
  - route.v1.get-models
  - route.v1.post-chat-completions
  - route.v1.post-messages
  - route.v1.post-responses
source_issues:
  - 255
  - 482
  - 483
  - 496
  - 508
  - 1509
  - 2185
  - 2836
  - 3386
  - 3718
  - 3842
  - 3932
  - 4708
  - 4728
  - 4825
  - 4845
  - 4883
  - 4885
  - 5007
  - 5066
  - 5207
  - 5409
  - 5499
  - 5895
  - 6362
  - 6552
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---
# 配置

## 适用版本与边界

本页收录的做法只对照钉住提交 `911f49cbd49f4fe2516979754a7488a3fd14fe64` 里仍然存在的配置、路由或命令。本页不是官方行为承诺。密钥、Cookie、邮箱、授权文件和用户请求正文都没有抄入。

## 短做法

- <a id="exp-configuration-declare-thinking-levels"></a>**在模型条目上声明思考档位**（`exp.configuration.declare-thinking-levels`）。现象：第三方模型没有 xhigh、ultra 或 max，或努力值被夹紧。做法：在该模型的 thinking.levels 里写出允许的档位。不写列表时，OpenAI 兼容模型只有 low、medium 和 high。来源 issue：[#3932](https://github.com/router-for-me/CLIProxyAPI/issues/3932)、[#4708](https://github.com/router-for-me/CLIProxyAPI/issues/4708)、[#4825](https://github.com/router-for-me/CLIProxyAPI/issues/4825)、[#4845](https://github.com/router-for-me/CLIProxyAPI/issues/4845)、[#4883](https://github.com/router-for-me/CLIProxyAPI/issues/4883)、[#4885](https://github.com/router-for-me/CLIProxyAPI/issues/4885)、[#5409](https://github.com/router-for-me/CLIProxyAPI/issues/5409)、[#5499](https://github.com/router-for-me/CLIProxyAPI/issues/5499)。对应官方页：[模型思考能力](/cn/configuration/thinking-models)、[反重力登录](/cn/accounts/antigravity)、[Claude Messages](/cn/api/claude-messages)。
- <a id="exp-configuration-thinking-suffix"></a>**用括号后缀选择思考档位**（`exp.configuration.thinking-suffix`）。现象：客户端想指定思考档位，但模型列表里没有单独的思考模型。做法：在模型名后加括号后缀，例如 (high) 或模型接受的数字预算。后缀优先于请求体里的思考参数。GET /v1/models 不列出这些档位。不要另造带连字符的思考模型 id。来源 issue：[#482](https://github.com/router-for-me/CLIProxyAPI/issues/482)、[#483](https://github.com/router-for-me/CLIProxyAPI/issues/483)、[#508](https://github.com/router-for-me/CLIProxyAPI/issues/508)、[#1509](https://github.com/router-for-me/CLIProxyAPI/issues/1509)。对应官方页：[模型思考能力](/cn/configuration/thinking-models)、[OpenAI Chat](/cn/api/openai-chat)、[Claude Messages](/cn/api/claude-messages)、[Responses](/cn/api/responses)。
- <a id="exp-configuration-git-storage-env"></a>**用环境变量启用 Git 存储**（`exp.configuration.git-storage-env`）。现象：希望非 Docker 的安装也使用 Git 保存配置和凭证。做法：设置 GITSTORE_GIT_URL 即可启用，不限于 Docker。需要时再设置 GITSTORE_LOCAL_PATH、GITSTORE_GIT_USERNAME、GITSTORE_GIT_TOKEN 和 GITSTORE_GIT_BRANCH。来源 issue：[#3386](https://github.com/router-for-me/CLIProxyAPI/issues/3386)。对应官方页：[命令行参数](/cn/introduction/install)。
- <a id="exp-configuration-storage-is-not-live-sync"></a>**Git 和对象存储不是实时多机同步**（`exp.configuration.storage-is-not-live-sync`）。现象：多台服务器共用 Git 或对象存储，期望登录结果立刻出现在另一台。做法：这两种后端会在本地凭证变更后推送，不是多机实时同步。另一台服务器不会在登录完成的同一刻看到新凭证。来源 issue：[#255](https://github.com/router-for-me/CLIProxyAPI/issues/255)。对应官方页：[命令行参数](/cn/introduction/install)。
- <a id="exp-configuration-unknown-keys-on-migrate"></a>**迁移时未知键会变成注释**（`exp.configuration.unknown-keys-on-migrate`）。现象：提供商段里写了额外键，期望运行时读取它们。做法：迁到 v8 时，无法识别的键会收成注释并被忽略。已经是 v8 的文件如果出现未知段，载入会拒绝，而不是当成备注生效。来源 issue：[#3718](https://github.com/router-for-me/CLIProxyAPI/issues/3718)。对应官方页：[命令行参数](/cn/introduction/install)。
- <a id="exp-configuration-reject-minimal-effort"></a>**不要发送模型拒绝的思考档**（`exp.configuration.reject-minimal-effort`）。现象：gpt-5.2 拒绝 reasoning effort minimal。做法：只发送该模型 thinking.levels 接受的档位，不要发送 minimal。来源 issue：[#496](https://github.com/router-for-me/CLIProxyAPI/issues/496)。对应官方页：[模型思考能力](/cn/configuration/thinking-models)、[OpenAI Chat](/cn/api/openai-chat)。
- <a id="exp-configuration-levels-or-filter"></a>**档位不允许时就过滤该字段**（`exp.configuration.levels-or-filter`）。现象：Claude Code 向 NVIDIA 模型发送了 xhigh。做法：允许的档位写在该模型的 thinking.levels 里。不能声明时，用 payload.filter 去掉该字段。来源 issue：[#2185](https://github.com/router-for-me/CLIProxyAPI/issues/2185)。对应官方页：[模型思考能力](/cn/configuration/thinking-models)、[过滤载荷规则](/cn/routing/requests-filter)。
- <a id="exp-configuration-antigravity-credits"></a>**额度切换前先走积分回退**（`exp.configuration.antigravity-credits`）。现象：Antigravity 积分和配额切换的顺序不清楚。做法：积分回退由提供商配置控制，并且发生在配额切换之前。来源 issue：[#2836](https://github.com/router-for-me/CLIProxyAPI/issues/2836)。对应官方页：[反重力提供商选项](/cn/configuration/provider/antigravity)。
- <a id="exp-configuration-levels-before-filter"></a>**思考档位不能靠过滤来声明**（`exp.configuration.levels-before-filter`）。现象：想用 payload.filter 去掉不支持的思考档。做法：支持的档位写在模型条目的 thinking.levels。过滤执行得太晚，不能代替这份声明。来源 issue：[#3842](https://github.com/router-for-me/CLIProxyAPI/issues/3842)。对应官方页：[模型思考能力](/cn/configuration/thinking-models)、[过滤载荷规则](/cn/routing/requests-filter)。
- <a id="exp-configuration-advertise-context-length"></a>**用 max-context-length 改广告窗口**（`exp.configuration.advertise-context-length`）。现象：第三方或 OAuth 模型需要对外显示另一个上下文长度。做法：在模型或 oauth.settings 上设置 max-context-length。不要新增目录字段，也不要沿用 issue 里报出的窗口数字。来源 issue：[#4728](https://github.com/router-for-me/CLIProxyAPI/issues/4728)、[#5066](https://github.com/router-for-me/CLIProxyAPI/issues/5066)、[#5895](https://github.com/router-for-me/CLIProxyAPI/issues/5895)、[#6362](https://github.com/router-for-me/CLIProxyAPI/issues/6362)、[#6552](https://github.com/router-for-me/CLIProxyAPI/issues/6552)。对应官方页：[上游模型别名](/cn/accounts/api-keys-models)、[模型目录](/cn/introduction/models)、[OAuth 目录、别名与排除](/cn/accounts/oauth)。
- <a id="exp-configuration-optimize-multi-agent"></a>**打开多智能体兼容开关**（`exp.configuration.optimize-multi-agent`）。现象：Codex 的 spawn_agent 报保留名，或 Grok 拒绝 Codex 子代理。做法：把 client.codex.optimize-multi-agent-v2 设为 true。默认 false 不改变客户端行为。不要使用 issue 里提到的其他未登记开关。来源 issue：[#5007](https://github.com/router-for-me/CLIProxyAPI/issues/5007)、[#5207](https://github.com/router-for-me/CLIProxyAPI/issues/5207)。对应官方页：[Codex 登录](/cn/accounts/codex)、[xAI 登录](/cn/accounts/xai)、[Codex 客户端目录](/cn/routing/client)。

## 独立页

这一区域没有需要独立成页的做法。
