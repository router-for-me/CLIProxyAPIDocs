---
title: "Docker 使用经验"
related_feature_ids:
  - cli.server.config
  - mode.docker.compose
  - oauth.auth-dir.value
source_issues:
  - 32
  - 305
  - 403
  - 2009
  - 2450
  - 2682
  - 2950
  - 3272
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---
# Docker

## 适用版本与边界

本页收录的做法只对照钉住提交 `911f49cbd49f4fe2516979754a7488a3fd14fe64` 里仍然存在的配置、路由或命令。本页不是官方行为承诺。密钥、Cookie、邮箱、授权文件和用户请求正文都没有抄入。

## 短做法

- <a id="exp-docker-mount-real-config"></a>**容器挂载真实的配置文件**（`exp.docker.mount-real-config`）。现象：容器启动后把 config.yaml 当成目录并退出。做法：先在宿主机放好从示例复制的 config.yaml，再按文件挂进容器。不要挂载一个还不存在的路径。来源 issue：[#32](https://github.com/router-for-me/CLIProxyAPI/issues/32)、[#2009](https://github.com/router-for-me/CLIProxyAPI/issues/2009)、[#2450](https://github.com/router-for-me/CLIProxyAPI/issues/2450)、[#2682](https://github.com/router-for-me/CLIProxyAPI/issues/2682)、[#2950](https://github.com/router-for-me/CLIProxyAPI/issues/2950)。对应官方页：[命令行参数](/cn/introduction/install)、[使用 Docker Compose](/cn/docker/docker)。
- <a id="exp-docker-prepare-auth-dir"></a>**启动前准备好配置和凭证目录**（`exp.docker.prepare-auth-dir`）。现象：Compose 因目录不存在或配置里没有 auth-dir 而起不来。做法：启动前创建要挂载的配置目录和凭证目录，并在 config.yaml 里设置 oauth.auth-dir。来源 issue：[#305](https://github.com/router-for-me/CLIProxyAPI/issues/305)、[#3272](https://github.com/router-for-me/CLIProxyAPI/issues/3272)。对应官方页：[使用 Docker Compose](/cn/docker/docker)、[OAuth 目录、别名与排除](/cn/accounts/oauth)。
- <a id="exp-docker-same-storage-backends"></a>**容器继续使用现有存储方式**（`exp.docker.same-storage-backends`）。现象：在 Zeabur 一类平台上以为还要另一套存储开关。做法：容器仍使用已经支持的本地目录、Git、数据库或对象存储。不要再找平台专用的存储键。来源 issue：[#403](https://github.com/router-for-me/CLIProxyAPI/issues/403)。对应官方页：[使用 Docker Compose](/cn/docker/docker)。

## 独立页

这一区域没有需要独立成页的做法。
