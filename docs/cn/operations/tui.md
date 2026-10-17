---
title: 终端界面
feature_ids:
  - cli.server.management-base-url
  - cli.server.standalone
  - cli.server.tui
  - mode.tui.start
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 终端界面

## 1. 这段解决什么问题

用终端里的管理界面操作一台已经在运行的代理，或者在同一进程里先拉起内嵌服务器再连上它。

## 2. 适用条件与不做的事

`--tui` 本身不选择上游账号。不带 `--standalone` 时，它只是管理 API 的客户端，代理必须已经在运行。管理密钥和 `base-url` 见 [管理端设置](/cn/operations/management-settings)。Home 连接见 [CLIProxyAPI Home](/cn/operations/home)。

## 3. 怎么配置或怎么调用

只做客户端：

```bash
cli-proxy-api --tui --management-base-url https://example.invalid
```

在本进程内嵌服务器并打开终端界面：

```bash
cli-proxy-api --tui --standalone
```

对应的配置项是 `management.base-url`。命令行非空时优先于配置。两者都空时，客户端连 `http://127.0.0.1:` 加端口；`server.port` 为正数时用该端口，否则用 8317。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| --management-base-url | TUI 客户端模式的远程管理 API 基址。 | empty string | 只在 `--tui` 且没有 `--standalone` 时用来选择目标。示例形式为 `https://example.invalid`。 |
| --standalone | 在 TUI 模式中启动内嵌的本地服务器。 | false | 必须和 `--tui` 一起使用才会走内嵌服务器。未给 `--password` 时，进程生成只存在于内存的本地管理密码。内嵌服务器约 30 次探测仍未就绪则退出，并报告 `embedded server is not ready`。 |
| --tui | 启动终端管理界面。 | false | false 时按普通代理进程启动。 |
| TUI | 用户入口：带终端管理界面启动。 |  | 由 `--tui` 进入。没有 `--standalone` 时不在本进程启动代理。 |

## 5. 常见错误与边界

只写 `--standalone`、不写 `--tui`，不会因此打开终端界面，也不会按该开关单独嵌入服务器。客户端模式连不上管理 API 时，终端界面报 `TUI error`。内嵌模式会把标准输出和标准错误暂时接到空设备，失败时再恢复并打印错误。`--local-model` 在纯客户端 TUI（有 `--tui` 且无 `--standalone`）下不会按本地目录模式打印那条启动说明。

## 6. 相关功能

基址和密钥见 [管理端设置](/cn/operations/management-settings)。保活端点在带本地密码时出现，见 [健康检查](/cn/operations/health)。

## 7. 使用经验

- [TUI 默认只是管理客户端](/cn/experience/operations#exp-operations-tui-is-client)
