# Web UI

项目地址：[Cli-Proxy-API-Management-Center](https://github.com/router-for-me/Cli-Proxy-API-Management-Center)

一个官方的基于Web的CLIProxyAPI管理界面。

基础路径：`http://localhost:8317/management`

设置 `remote-management.disable-control-panel` 为 `true` 时，服务器将跳过下载 `management.html`，且 `/management.html` 会返回 404，从而禁用内置管理界面。

你可以通过设置环境变量 `MANAGEMENT_STATIC_PATH` 来指定 `management.html` 的存储目录。
