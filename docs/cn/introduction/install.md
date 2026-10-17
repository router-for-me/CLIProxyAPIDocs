---
title: 命令行参数
feature_ids:
  - cli.server.config
  - cli.server.discover
  - cli.server.discover-config
  - cli.server.discover-exclude
  - cli.server.discover-include
  - cli.server.discover-json
  - cli.server.discover-service-type
  - cli.server.discover-timeout
  - cli.server.exclude
  - cli.server.include
  - cli.server.json
  - cli.server.local-model
  - cli.server.no-browser
  - cli.server.oauth-callback-port
  - cli.server.password
  - cli.server.service-type
  - cli.server.siwc-bind
  - cli.server.timeout
  - cli.server.vertex-import-prefix
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 命令行参数

这里只说明钉住提交里、归在本页的 `CLIProxyAPI` 参数。二进制名与镜像内的 `./CLIProxyAPI` 一致。Go 的参数解析同时接受一个或两个减号；下文按台账标题写成两个减号。

## 1. 这段解决什么问题

这些参数决定进程读哪一份配置、要不要只做一次局域网发现、登录时是否打开浏览器、用哪个本地回调端口、是否设置本地管理密码，以及是否改用内置模型目录。发现有两种写法：子命令 `discover`，以及仍可用的 `--discover` / `--discover-json`。

## 2. 适用条件与不做的事

适用直接运行该二进制的时候。`discover` 子命令会先被单独解析并退出，不会启动代理，也不接受 `--discover-*` 这组旧参数。

本页不说明各提供商的登录参数本身，不说明管理密钥怎么配置，也不说明 Docker Compose。`--vertex-import-prefix` 只在同时使用 `--vertex-import` 时生效；导入步骤不在本页。`--password` 不是管理密钥的替代品：管理密钥和环境变量 `MANAGEMENT_PASSWORD` 都为空时，管理接口不会接受这个密码。

## 3. 怎么配置或怎么调用

指定配置文件。留空时，在没有 Postgres、对象存储、Git 或 Home 配置来源的情况下，加载工作目录中的 `config.yaml`。

```bash
CLIProxyAPI --config /path/to/config.yaml
```

子命令发现。`--include` 和 `--exclude` 写逗号分隔的网卡名，名称不区分大小写，末尾的 `*` 表示前缀。只要这两个参数里有一个非空，就会同时替换配置文件中的两份过滤列表。

```bash
CLIProxyAPI discover --timeout 3 --include eth0 --exclude "docker*"
CLIProxyAPI discover --json --config /path/to/config.yaml
```

旧参数发现。`--discover-json` 本身就会开始扫描并退出。

```bash
CLIProxyAPI --discover --discover-timeout 3 --discover-include eth0 --discover-exclude "docker*"
CLIProxyAPI --discover-json
```

内置模型目录、不自动打开浏览器、本地管理密码，以及把 Sign in with ChatGPT 写进已有的 Codex 凭证文件：

```bash
CLIProxyAPI --local-model
CLIProxyAPI --no-browser --siwc-bind credential.json
CLIProxyAPI --password YOUR_API_KEY
```

`credential.json` 必须是已配置认证目录中的文件名，或者该目录内文件的绝对路径。`--oauth-callback-port` 大于 0 时覆盖登录和 `--siwc-bind` 的本地回调端口；默认 `0` 表示沿用各提供商自己的端口。

```bash
CLIProxyAPI --vertex-import /path/to/service-account.json --vertex-import-prefix team-a
```

`team-a` 只是一个不含斜杠的前缀示例，不是默认值。

## 4. 细项说明

「默认值」与台账 `defaults` 逐字相同。空白单元格表示该字段是空字符串。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| cli.server.config | 顶层 `--config`。在没有 Postgres、对象存储、Git 或 Home 配置来源时选择要加载的 YAML。Home 已经提供配置时，非空值只保留给后续组件，不会改作配置文件再加载一次。 | empty string | 留空则使用工作目录下的 `config.yaml`。 |
| cli.server.discover | `--discover`。扫描局域网中的 AI 网关和 CLIProxyAPI 实例，打印结果后退出，不启动代理。 | false | `--discover-json` 也会进入同一扫描。 |
| cli.server.discover-config | `discover` 子命令的 `--config`。只用来读取该文件里的 `discovery.interfaces`。 | empty string | 不是顶层 `--config`。文件缺失或 YAML 无效时过滤列表为空，扫描仍继续。留空则使用工作目录下的 `config.yaml`。 |
| cli.server.discover-exclude | 配合 `--discover` 或 `--discover-json`，跳过列出的网卡。 |  | 逗号分隔，忽略空项和重复项。与 `--discover-include` 任一非空时，两份命令行列表替换配置文件中的过滤条件。 |
| cli.server.discover-include | 配合 `--discover` 或 `--discover-json`，只扫描列出的网卡，并覆盖默认的物理局域网网卡筛选。 |  | 规则与 `--discover-exclude` 相同。 |
| cli.server.discover-json | 执行同一次扫描，把网关以 JSON 数组写到标准输出后退出。 | false | 不把版本横幅写到标准输出。 |
| cli.server.discover-service-type | 配合旧发现参数，设置 DNS-SD 服务类型。 | empty string | 空值使用 `_ai-gateway._tcp`。 |
| cli.server.discover-timeout | 配合旧发现参数，设置扫描超时，单位秒。 | 3 | 小于或等于 0 按 3 秒；大于 60 秒按 60 秒。 |
| cli.server.exclude | `discover` 子命令的 `--exclude`，跳过列出的网卡。 |  | 匹配规则与 `--discover-exclude` 相同。与子命令 `--include` 任一非空时，替换配置文件中的过滤条件。 |
| cli.server.include | `discover` 子命令的 `--include`，只扫描列出的网卡，并覆盖默认物理局域网网卡筛选。 |  | 匹配规则与 `--discover-include` 相同。 |
| cli.server.json | `discover` 子命令的 `--json`。以 JSON 数组输出，并省略版本横幅。 | false | 扫描错误改为带 `error` 和空 `gateways` 的 JSON 对象。 |
| cli.server.local-model | 对应目录来源为空时使用内置模型目录。`models.catalog`、`models.codex-catalog` 或 `models.devin-catalog` 非空时，该项仍以显式来源为准。 | false | 普通启动和 TUI standalone 会采用它。只作为 TUI 客户端连接已有服务时不会调用。 |
| cli.server.no-browser | OAuth 登录不自动打开浏览器，改为打印授权地址。 | false | Devin 登录会打印授权地址，并提示粘贴授权码或会话令牌。命令行会装上默认的交互提示。 |
| cli.server.oauth-callback-port | 大于 0 时覆盖登录命令和 `--siwc-bind` 的本地回调端口。 | 0 | 0 表示保留提供商自己的端口。Devin 未覆盖时使用临时端口。 |
| cli.server.password | 传给服务的本地管理密码。帮助文本不显示这项。 | empty string | 只有普通启动且本参数非空时才注册 `GET /keep-alive`，并从端点启用起计算 10 秒空闲。TUI standalone 即使本参数非空，或在留空时自动生成了密码，也不注册该端点，也不会因此退出。普通启动留空则不设置该密码。TUI standalone 仅在本参数留空时自行生成密码。 |
| cli.server.service-type | `discover` 子命令的 `--service-type`。 | empty string | 空值使用 `_ai-gateway._tcp`。 |
| cli.server.siwc-bind | 指定已有 Codex 凭证文件，执行 Sign in with ChatGPT，写入 SIWC 段和 `use_siwc=true`，然后结束，不启动代理。 | empty string | 只能是认证目录中的绝对路径或纯文件名。`--no-browser` 和 `--oauth-callback-port` 对它生效。 |
| cli.server.timeout | `discover` 子命令的 `--timeout`，单位秒。 | 3 | 小于或等于 0 按 3 秒；大于 60 秒按 60 秒。 |
| cli.server.vertex-import-prefix | 与 `--vertex-import` 一起使用时，给 Vertex 模型名和保存的凭证文件加一段前缀。 | empty string | 去掉首尾斜杠后仍含 `/` 则拒绝保存。单独使用不会导入密钥。 |

## 5. 常见错误与边界

发现扫描找不到合格的物理网卡时退出码为 1。非 JSON 输出把 `Error scanning LAN: no qualified physical interfaces found for LAN discovery` 写到标准错误。JSON 输出则是包含 `error` 和空 `gateways` 的对象。没有发现网关不是错误，退出码为 0，并打印包括目标需要 `discovery.enabled: true` 在内的提示；本页不展开发现配置。

`discover` 子命令或顶层解析遇到无法识别的参数时，按 Go 的 `ExitOnError` 退出，退出码为 2。

`--siwc-bind` 会拒绝空路径、未配置认证目录、相对路径中带目录分隔符、文件不存在，以及文件不在认证目录内。回调端口已被占用时进程以错误退出。

`--vertex-import-prefix` 含有斜杠时记录错误 `vertex-import: prefix must be a single segment (no '/' allowed)`，不保存凭证。

只有普通启动并且 `--password` 非空时才注册 `GET /keep-alive`。该端点从 `Authorization: Bearer` 或 `X-Local-Password` 读取密码。缺失或不匹配返回 401，正文为 `invalid password`。计时从端点启用时开始：从未成功调用，或距离上一次成功调用已满 10 秒，进程都会退出。TUI standalone 即使密码非空或由程序自动生成，也不注册该端点，也不会因此在 10 秒后退出。管理接口仍先要求已配置管理密钥或 `MANAGEMENT_PASSWORD`；两者都为空时返回 403 `remote management key not set`，不会改用本参数。本机请求在已有上述密钥时可以用本参数通过校验。

`--config` 不能覆盖已经启用的 Postgres、对象存储、Git 或 Home 配置来源。

## 6. 相关功能

模型目录来源见[模型目录](/cn/introduction/models)。用仓库中的 Compose 文件启动见[使用 Docker Compose](/cn/docker/docker)。

## 7. 使用经验

- [没有浏览器时使用手动登录](/cn/experience/accounts#exp-accounts-claude-manual-login)
- [调用公开路由时带上客户端密钥](/cn/experience/api#exp-api-require-client-key)
- [用环境变量启用 Git 存储](/cn/experience/configuration#exp-configuration-git-storage-env)
- [Git 和对象存储不是实时多机同步](/cn/experience/configuration#exp-configuration-storage-is-not-live-sync)
- [迁移时未知键会变成注释](/cn/experience/configuration#exp-configuration-unknown-keys-on-migrate)
- [容器挂载真实的配置文件](/cn/experience/docker#exp-docker-mount-real-config)
- [用示例文件作为配置起点](/cn/experience/introduction#exp-introduction-copy-example-config)
- [本地模型开关跳过远程刷新](/cn/experience/introduction#exp-introduction-local-model-catalog)
- [启动前提供配置或登录](/cn/experience/introduction#exp-introduction-start-with-config-or-login)
- [管理登录使用 secret-key](/cn/experience/operations#exp-operations-management-secret)
