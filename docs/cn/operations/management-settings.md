---
title: 管理端设置
feature_ids:
  - management.allow-remote.value
  - management.base-url.value
  - management.disable-auto-update-panel.value
  - management.disable-control-panel.value
  - management.panel-github-repository.value
  - management.secret-key.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 管理端设置

## 1. 这段解决什么问题

决定管理 API 是否对非本机开放、用什么密钥认证、控制面板从哪里下载，以及终端界面作为客户端时去连哪一个管理地址。

## 2. 适用条件与不做的事

这些键属于 `management`。它们不描述 `/v8/management` 的每条路由；路由见 [管理 API v8](/cn/management/apiv8)。`/v0/management` 已停止维护，见 [管理 API](/cn/management/api)。Home 模式不暴露管理 API。

## 3. 怎么配置或怎么调用

```yaml
management:
  allow-remote: false
  secret-key: ""
  disable-control-panel: false
  panel-github-repository: "https://github.com/router-for-me/Cli-Proxy-API-Management-Center"
```

示例还注释了这两项，未写时按第 4 节 defaults：

```yaml
management:
  # disable-auto-update-panel: false
  # base-url: "https://example.invalid"
```

密钥使用占位 `YOUR_API_KEY`。明文会在加载时做 bcrypt 哈希并写回配置，请求时仍发送明文。

调用管理接口时，包括来自 localhost 的请求，用下面任一方式发送密钥：

- `Authorization: Bearer YOUR_API_KEY`
- `X-Management-Key: YOUR_API_KEY`

若 `Authorization` 不是 `Bearer` 加密钥，则整个头的值被当作密钥。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| management.allow-remote | 是否允许非 localhost 访问管理 API。 | false | false 时非本机返回 403，错误为 `remote management disabled`。本机仍要密钥。环境变量 `MANAGEMENT_PASSWORD` 非空时强制允许远程，且该值只存在于内存。 |
| management.base-url | TUI 客户端模式使用的远程管理 API 基址。 | empty string | 命令行 `--management-base-url` 优先。两者都空时使用 `http://127.0.0.1:` 加端口；端口取正数 `server.port`，否则为 8317。 |
| management.disable-auto-update-panel | 是否关闭管理面板资源的定期后台更新。 | When false (the default), the background updater remains enabled; when true, the panel is only downloaded on first access if missing. | true 时只在首次访问且本地缺失时下载，之后不自动更新。 |
| management.disable-control-panel | 为 true 时不提供、也不同步内置管理界面。 | false | 不影响管理 API 路由本身是否注册。 |
| management.panel-github-repository | 拉取管理面板资源的 GitHub 仓库。 | empty string | 接受仓库 URL，或 releases API 地址。加载时若为空，填入 `https://github.com/router-for-me/Cli-Proxy-API-Management-Center`。 |
| management.secret-key | 管理密钥，可以是明文或 bcrypt 哈希。 | empty string | 明文在加载或保存时哈希并写回。与 `MANAGEMENT_PASSWORD`、启动时的本地密码都为空时，不注册管理路由，`/v0/management` 与 `/v8/management` 返回 404。 |

## 5. 常见错误与边界

同一客户端 IP（含 localhost）连续 5 次认证失败后，封禁约 30 分钟，状态 403。缺少密钥是 401 `missing management key`；密钥错误是 401 `invalid management key`。Home 模式下一律 404，即使写了密钥。`--password` 或 TUI 独立模式生成的本地密码只接受来自 `127.0.0.1` 或 `::1` 的请求，不写入配置。

## 6. 相关功能

终端客户端见 [终端界面](/cn/operations/tui)。配置读写见 [管理 API v8](/cn/management/apiv8)。面板页面仍保留 [Web UI](/cn/management/webui)。

## 7. 使用经验

- [管理登录使用 secret-key](/cn/experience/operations#exp-operations-management-secret)
- [关闭面板后没有哈希管理地址](/cn/experience/operations#exp-operations-panel-route-is-html)
- [让管理页文件能够下载](/cn/experience/routing#exp-routing-management-page-download)
