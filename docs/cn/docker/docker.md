---
title: 使用 Docker Compose
feature_ids:
  - mode.docker.compose
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 使用 Docker Compose

## 1. 这段解决什么问题

仓库根目录的 `docker-compose.yml` 定义服务 `cli-proxy-api`。用这份文件可以拉取或构建镜像、发布固定端口，并把配置、认证目录、日志和插件目录挂进容器。容器名是 `cli-proxy-api`，`pull_policy` 为 `always`，`restart` 为 `unless-stopped`。文件没有改写镜像启动命令，镜像内的命令是 `./CLIProxyAPI`。

## 2. 适用条件与不做的事

适用已经安装 Docker Compose、并且在含有该文件的仓库根目录操作的时候。本页不说明 `docker run` 一次性命令，不说明各登录参数，也不说明 `docker-build.sh` 或 `docker-build.ps1`。

文件中的 `env_file: .env` 被注释掉了，因此这份 Compose 文件不会把 `.env` 载入容器。${变量:-默认值} 仍由执行 Compose 的环境做替换。插件目录已经挂到 `/CLIProxyAPI/plugins`，不需要再按旧说明补一行同样的挂载。

## 3. 怎么配置或怎么调用

在仓库根目录启动。文件名是 Compose 的默认文件名，不需要额外的 `-f`。

```bash
docker compose up -d
```

停止该 Compose 项目：

```bash
docker compose down
```

现行文件的服务定义如下。构建参数和被注释的 `env_file` 保留原样：

```yaml
services:
  cli-proxy-api:
    image: ${CLI_PROXY_IMAGE:-eceasy/cli-proxy-api:latest}
    pull_policy: always
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VERSION: ${VERSION:-dev}
        COMMIT: ${COMMIT:-none}
        BUILD_DATE: ${BUILD_DATE:-unknown}
    container_name: cli-proxy-api
    # env_file:
    #   - .env
    environment:
      DEPLOY: ${DEPLOY:-}
    ports:
      - "8317:8317"
      - "8085:8085"
      - "1455:1455"
      - "54545:54545"
      - "51121:51121"
      - "11451:11451"
    volumes:
      - ${CLI_PROXY_CONFIG_PATH:-./config.yaml}:/CLIProxyAPI/config.yaml
      - ${CLI_PROXY_AUTH_PATH:-./auths}:/root/.cli-proxy-api
      - ${CLI_PROXY_LOG_PATH:-./logs}:/CLIProxyAPI/logs
      - ${CLI_PROXY_PLUGIN_PATH:-./plugins}:/CLIProxyAPI/plugins
    restart: unless-stopped
```

`DEPLOY` 传入容器。进程只在它的值是 `cloud` 时进入云部署等待；默认空值不会进入。本页不展开云部署。

## 4. 细项说明

「默认值」与台账 `defaults` 逐字相同。`mode.docker.compose` 的默认值为空字符串，因此该单元格留空。其余默认值是 `docker-compose.yml` 里写明的替换结果。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| mode.docker.compose | 用仓库根目录的 `docker-compose.yml` 运行服务。 |  | 不覆盖镜像命令，不加载被注释的 `env_file`。 |
| CLI_PROXY_IMAGE | 服务镜像。 | eceasy/cli-proxy-api:latest | `pull_policy: always`。也可按文件中的 `build` 从当前目录的 Dockerfile 构建。 |
| VERSION | 构建参数。 | dev | 只在构建镜像时使用。 |
| COMMIT | 构建参数。 | none | 只在构建镜像时使用。 |
| BUILD_DATE | 构建参数。 | unknown | 只在构建镜像时使用。 |
| DEPLOY | 传入容器的环境变量。 | 空字符串 | 只有值为 `cloud` 时进程才进入云部署等待。 |
| CLI_PROXY_CONFIG_PATH | 宿主机配置文件，挂到 `/CLIProxyAPI/config.yaml`。 | ./config.yaml | 路径相对仓库根目录。 |
| CLI_PROXY_AUTH_PATH | 宿主机认证目录，挂到 `/root/.cli-proxy-api`。 | ./auths | 路径相对仓库根目录。 |
| CLI_PROXY_LOG_PATH | 宿主机日志目录，挂到 `/CLIProxyAPI/logs`。 | ./logs | 路径相对仓库根目录。 |
| CLI_PROXY_PLUGIN_PATH | 宿主机插件目录，挂到 `/CLIProxyAPI/plugins`。 | ./plugins | 文件已经包含这项挂载。 |
| ports | 发布到宿主机的端口。 | 8317、8085、1455、54545、51121、11451 | 映射两边端口号相同。本页不另给这些端口命名。 |

## 5. 常见错误与边界

宿主机上的默认相对路径不存在时，Compose 仍会按自己的挂载规则处理；这份文件没有额外的存在性检查。被注释的 `env_file` 不会生效。空的 `DEPLOY` 不会打开云部署等待。

本文件没有传入 `--config`、`--local-model` 或其他命令行参数。容器内行为以挂载的 `/CLIProxyAPI/config.yaml` 和镜像默认命令为准。

## 6. 相关功能

命令行参数见[命令行参数](/cn/introduction/install)。模型目录见[模型目录](/cn/introduction/models)。

## 7. 使用经验

暂无
