---
title: CLIProxyAPI Home
feature_ids:
  - cli.server.home-disable-cluster-discovery
  - cli.server.home-jwt
  - mode.home.jwt
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# CLIProxyAPI Home

## 1. 这段解决什么问题

用控制面 JWT 把本进程接到 CLIProxyAPI Home：引导 mTLS 证书，从 Home 拉取配置，并按该配置运行。可选关闭集群节点发现，固定使用 JWT 里的地址。

## 2. 适用条件与不做的事

这不是管理 API，也不是终端界面。Home 启用后，`/v0/management` 和 `/v8/management` 返回 404。本地 Postgres、对象存储和 Git 存储在从 Home 加载配置时被关掉。插件的 Home 同步是否成功不在本页展开安装步骤；插件目录见 [插件加载与商店](/cn/operations/plugins)。

## 3. 怎么配置或怎么调用

```bash
cli-proxy-api --home-jwt YOUR_API_KEY
```

JWT 里应已包含控制面要求的字段。不要把真实 JWT 写进配置文件或文档。

保持 JWT 中的地址、不做 CLUSTER NODES 发现：

```bash
cli-proxy-api --home-jwt YOUR_API_KEY --home-disable-cluster-discovery
```

命令行 `--home-jwt` 为空时，非空的环境变量 `HOME_JWT` 或 `home_jwt` 会填入同一值。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| --home-disable-cluster-discovery | 关闭 Home 的 CLUSTER NODES 发现，继续使用 `--home-jwt` 里配置的地址。 | false | 仅当 JWT 已通过解析并生成 Home 配置后才会把 `DisableClusterDiscovery` 设为 true。 |
| --home-jwt | Home 控制面 JWT，用于 mTLS 证书引导和连接。 | empty string | 必须能解析出 `certificate_id`、`cluster_id`、`ca_fingerprint`、`enrollment_secret`，以及非空 IP 和正数端口。无效时记录 `invalid -home-jwt` 并退出启动。配置拉取失败同样停止。 |
| CLIProxyAPI Home | 用控制面 JWT 连接到 CLIProxyAPI Home。 |  | 成功后从 Home 读取配置，用量统计被设为 true，端口在省略或非正数时规范为 8317。 |

## 5. 常见错误与边界

JWT 不是三段、缺少上述字段，或目标地址无效时，不会启动代理。从 Home 取配置失败或解析失败时同样返回。插件同步失败会记录错误并停止后续启动。Home 模式下不要再指望本机管理 API；调用会得到 404。

## 6. 相关功能

终端界面见 [终端界面](/cn/operations/tui)。管理密钥为何在 Home 下无效，见 [管理端设置](/cn/operations/management-settings)。

## 7. 使用经验

暂无
