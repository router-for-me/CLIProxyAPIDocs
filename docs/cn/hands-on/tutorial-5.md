# 伍：Docker服务器部署

在已经装好 Docker Compose 的机器上，用仓库里的 Compose 文件启动服务，并做一次不经过模型的存活检查。

## 场景

机器可以是 VPS，也可以是别的主机。安装 Docker 本身不是本产品的功能，本页不提供安装脚本。

## 步骤

1. 在含有 `docker-compose.yml` 的仓库根目录按[使用 Docker Compose](/cn/docker/docker)启动和停止。不要在本页再写一份服务定义或端口表。
2. 容器对外端口，以及进程实际绑定的主机和端口，以该页和[监听与进程](/cn/operations/server)为准。两边不一致时，不要在教程里折中。
3. 挂进容器的配置里，客户端密钥只按[客户端密钥](/cn/api/access)修改。管理端只按[管理端设置](/cn/operations/management-settings)修改。凭证目录只按[OAuth 目录、别名与排除](/cn/accounts/oauth)修改。
4. 进程起来后访问健康检查。见[健康检查](/cn/operations/health)。这不能证明上游模型可用。
5. 要看日志或用量，见[日志与用量](/cn/operations/observability)。要改成 HTTPS，见 [TLS](/cn/operations/tls)。
6. 磁盘会丢失，或要改用数据库、对象存储、Git 时，离开本页，改走对应的云部署教程。那些教程同样只链接存储页，不复制环境变量表。

## 不要在本页完成的事

不编写克隆命令，不复制 `config.example.yaml` 的全文，也不编写防火墙规则。
