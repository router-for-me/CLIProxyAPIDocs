# 云部署（自带存储）

平台能为容器保留磁盘时，用 Compose 已经声明的卷保存配置和凭证，不启用远程存储。

## 场景

你没有单独的数据库、对象存储或 Git 仓库，只希望容器重启后配置文件和认证目录还在。云厂商控制台的点击步骤不是本产品的行为，本页不写。

## 步骤

1. 按[使用 Docker Compose](/cn/docker/docker)启动。配置文件、认证目录、日志和插件目录的挂载以该页为准。
2. 认证目录在配置中的位置见[OAuth 目录、别名与排除](/cn/accounts/oauth)。挂载目标要和该页的目录一致，不要在本页发明另一条路径。
3. 若平台把 `DEPLOY` 设为 `cloud`，是否进入等待以 Compose 页描述的进程行为为准。本页不补充等待条件。
4. 写入卷里的配置时，客户端密钥、管理端和监听仍分别见[客户端密钥](/cn/api/access)、[管理端设置](/cn/operations/management-settings)、[监听与进程](/cn/operations/server)。
5. 用[健康检查](/cn/operations/health)确认进程。不要用一次模型请求代替存活检查。
6. 若其实没有持久磁盘，停止本场景，改走[云部署（数据库存储）](/cn/hands-on/tutorial-8)、[云部署（对象存储）](/cn/hands-on/tutorial-9)或[云部署（Git存储）](/cn/hands-on/tutorial-10)。

## 不要在本页完成的事

不列出数据库、对象存储或 Git 的环境变量。启用它们就不再是自带存储。
