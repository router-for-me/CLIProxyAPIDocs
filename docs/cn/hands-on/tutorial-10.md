# 云部署（Git存储）

容器磁盘不可靠时，用 Git 仓库保存配置和令牌，再按普通方式调用代理。

## 场景

Git 远程地址和认证由环境变量打开。变量名、是否必填和启动顺序只写在 [Git 存储](/cn/configuration/storage/git)。本页不复制那张表，也不新增变量。

## 步骤

1. 按 Git 存储页准备环境变量。个人访问令牌不要写进教程或仓库。
2. 访问 GitHub API 时，配置里的令牌和 `GITSTORE_GIT_TOKEN` 谁优先，只看[监听与进程](/cn/operations/server)里 `server.github-token` 的说明。不要在本页重写优先级。
3. 仍用[使用 Docker Compose](/cn/docker/docker)启动进程。该页说明只有 `DEPLOY` 为 `cloud` 时才会进入云部署等待。除此之外不要在本页解释等待。
4. 存储页提到的管理口令，其访问规则以[管理端设置](/cn/operations/management-settings)为准。
5. 仓库里的配置内容仍是普通配置。客户端密钥见[客户端密钥](/cn/api/access)，上游密钥见[上游 API 密钥](/cn/accounts/api-keys-api)，凭证目录见[OAuth 目录、别名与排除](/cn/accounts/oauth)。
6. 进程监听见[监听与进程](/cn/operations/server)。起来之后用[健康检查](/cn/operations/health)。

## 不要在本页完成的事

不写某个 Git 托管平台的建库点击流程，不给出真实仓库地址或令牌。
