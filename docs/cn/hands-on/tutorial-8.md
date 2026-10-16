# 云部署（数据库存储）

容器磁盘不可靠时，用 PostgreSQL 保存配置和令牌，再按普通方式调用代理。

## 场景

数据库连接由环境变量打开。变量名、是否必填和启动顺序只写在 [PostgreSQL 存储](/cn/configuration/storage/pgsql)。本页不复制那张表，也不新增变量。

## 步骤

1. 按 PostgreSQL 存储页准备环境变量。连接串里的口令不要写进教程或仓库。
2. 仍用[使用 Docker Compose](/cn/docker/docker)启动进程。该页说明只有 `DEPLOY` 为 `cloud` 时才会进入云部署等待。除此之外不要在本页解释等待。
3. 存储页提到的管理口令，其访问规则以[管理端设置](/cn/operations/management-settings)为准。
4. 数据库里的配置内容仍是普通配置。客户端密钥见[客户端密钥](/cn/api/access)，上游密钥见[上游 API 密钥](/cn/accounts/api-keys-api)，凭证目录见[OAuth 目录、别名与排除](/cn/accounts/oauth)。
5. 进程监听见[监听与进程](/cn/operations/server)。起来之后用[健康检查](/cn/operations/health)。

## 不要在本页完成的事

不写某个托管平台的点击流程，不给出真实数据库连接串。
