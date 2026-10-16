# 云部署（对象存储）

容器磁盘不可靠时，用 S3 兼容对象存储保存配置和令牌，再按普通方式调用代理。

## 场景

对象存储由环境变量打开。端点、桶和访问密钥的名称与约束只写在[对象存储](/cn/configuration/storage/s3)。本页不复制那张表，也不新增变量。访问密钥不要写成真实值，文档示例继续使用 `YOUR_API_KEY` 只表示占位，不表示这里有另一套键。

## 步骤

1. 按对象存储页准备环境变量。不要把访问密钥写进教程或仓库。
2. 仍用[使用 Docker Compose](/cn/docker/docker)启动进程。该页说明只有 `DEPLOY` 为 `cloud` 时才会进入云部署等待。除此之外不要在本页解释等待。
3. 存储页提到的管理口令，其访问规则以[管理端设置](/cn/operations/management-settings)为准。
4. 对象里的配置内容仍是普通配置。客户端密钥见[客户端密钥](/cn/api/access)，上游密钥见[上游 API 密钥](/cn/accounts/api-keys-api)，凭证目录见[OAuth 目录、别名与排除](/cn/accounts/oauth)。
5. 进程监听见[监听与进程](/cn/operations/server)。起来之后用[健康检查](/cn/operations/health)。

## 不要在本页完成的事

不写某个云厂商控制台的点击流程，不给出真实端点、桶名或访问密钥。
