# 桌面客户端

项目地址：[EasyCLIProxyAPI](https://github.com/router-for-me/EasyCLIProxyAPI)

EasyCLIProxyAPI(ecpa)是CLIProxyAPI官方推出的桌面客户端，主要面向本地部署使用的用户。

## 功能介绍
EasyCLIProxyAPI可以将多个Codex、Antigratity、Grok、Claude等的账号订阅额度反代成API格式(支持OpenAI、Anthropic/Gemini格式互换)，供任意工具使用，实现token free(自由)。同时也支持多个API聚合接入，方便用户接入多个渠道使用。此外还提供了智能体配置功能，便于用户一键配置codex、claude code、opencode、pi、openclaw等智能体。


## 使用教程

软件支持OAuth账号登录和API接入两种方式，按需选择即可。在接入之后，即可在首页复制API URL和API Key，可用于接入智能体应用，或用于开发自己的AI应用。

### OAuth接入
进入软件OAuth页面后登录选择所需平台账号登录，软件会自动使用默认浏览器打开登录页面，如果需要指定浏览器请在右上角选择。在页面登录后，可在"认证文件"处管理凭证文件。

### API接入
API接入方式需要用户在软件中配置API Key，如果是OpenAI兼容格式，用户还可自行选择所支持的思考级别。

## 配置智能体

各个配置智能体的方法基本一致，选择合适的模型应用配置后重启智能体软件即可。

### Codex智能体
Codex智能体有两种配置方式，分别是OAuth配置方式和API配置方式。OAuth配置方式可正确识别模型列表，优先推荐这个方法，需要用户先使用 ChatGPT账户（任意订阅，包含免费账户）登录Codex。需要额外注意的是，凭证文件使用太久之后可能会失效，需要重新登录。

## 共享给其他人用
软件默认监听127.0.0.1本地回环地址，如需对外开放使用，则需在"高级设置"中开启"允许局域网"选项，此时将监听0.0.0.0地址。局域网内其他用户也可使用API服务，可按需分配密钥。系统防火墙可能会阻止局域网的访问，需要用户进行合理的配置。