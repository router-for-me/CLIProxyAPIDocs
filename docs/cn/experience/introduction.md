---
title: "介绍 使用经验"
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---
# 介绍

## 适用版本与边界

本页收录的做法只对照钉住提交 `911f49cbd49f4fe2516979754a7488a3fd14fe64` 里仍然存在的配置、路由或命令。本页不是官方行为承诺。密钥、Cookie、邮箱、授权文件和用户请求正文都没有抄入。

## 短做法

- <a id="exp-introduction-start-with-config-or-login"></a>**启动前提供配置或登录**（`exp.introduction.start-with-config-or-login`）。现象：进程没有配置文件也没有凭证。做法：用 --config 指向配置文件，或先执行 --claude-login 这类提供商登录，再开始服务。来源 issue：[#917](https://github.com/router-for-me/CLIProxyAPI/issues/917)。对应官方页：[Claude 登录](/cn/accounts/claude)、[命令行参数](/cn/introduction/install)。
- <a id="exp-introduction-catalog-is-authoritative"></a>**可见模型以钉住目录为准**（`exp.introduction.catalog-is-authoritative`）。现象：客户端看不到某个 Codex 或 Kimi 模型，或仍请求已移除的 id。做法：以钉住版本的模型目录和账号类型为准。目录没有的名字不会被加上，上游已移除的 id 也不会保留。升级到包含该目录项的版本后重新登录，或重启以完成远程模型刷新。不要采用 issue 里报出的上下文长度。来源 issue：[#1577](https://github.com/router-for-me/CLIProxyAPI/issues/1577)、[#2139](https://github.com/router-for-me/CLIProxyAPI/issues/2139)、[#2216](https://github.com/router-for-me/CLIProxyAPI/issues/2216)、[#2806](https://github.com/router-for-me/CLIProxyAPI/issues/2806)、[#2938](https://github.com/router-for-me/CLIProxyAPI/issues/2938)、[#2980](https://github.com/router-for-me/CLIProxyAPI/issues/2980)、[#2994](https://github.com/router-for-me/CLIProxyAPI/issues/2994)、[#3647](https://github.com/router-for-me/CLIProxyAPI/issues/3647)、[#3803](https://github.com/router-for-me/CLIProxyAPI/issues/3803)、[#4195](https://github.com/router-for-me/CLIProxyAPI/issues/4195)、[#4476](https://github.com/router-for-me/CLIProxyAPI/issues/4476)、[#4494](https://github.com/router-for-me/CLIProxyAPI/issues/4494)。对应官方页：[反重力登录](/cn/accounts/antigravity)、[Codex 登录](/cn/accounts/codex)、[Kimi 登录](/cn/accounts/kimi)、[模型目录](/cn/introduction/models)、[OpenAI Chat](/cn/api/openai-chat)。
- <a id="exp-introduction-copy-example-config"></a>**用示例文件作为配置起点**（`exp.introduction.copy-example-config`）。现象：发布包里没有现成的 config.yaml，或想重置管理状态。做法：把该版本的 config.example.yaml 复制为 config.yaml 后再启动。Homebrew 同样编辑安装后的配置，并设置 secret-key。来源 issue：[#1964](https://github.com/router-for-me/CLIProxyAPI/issues/1964)、[#2064](https://github.com/router-for-me/CLIProxyAPI/issues/2064)、[#3135](https://github.com/router-for-me/CLIProxyAPI/issues/3135)。对应官方页：[命令行参数](/cn/introduction/install)。
- <a id="exp-introduction-local-model-catalog"></a>**本地模型开关跳过远程刷新**（`exp.introduction.local-model-catalog`）。现象：不想在启动时拉取远程模型列表。做法：--local-model 使用内置目录，并跳过远程刷新。某个目录字段已有内容时，仍以该字段为准。来源 issue：[#5554](https://github.com/router-for-me/CLIProxyAPI/issues/5554)。对应官方页：[命令行参数](/cn/introduction/install)、[模型目录](/cn/introduction/models)。

## 独立页

这一区域没有需要独立成页的做法。
