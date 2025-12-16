# Web UI

项目地址：[Cli-Proxy-API-Management-Center](https://github.com/router-for-me/Cli-Proxy-API-Management-Center)

一个官方的基于Web的CLIProxyAPI管理界面。

基础路径：`http://localhost:8317/management`

设置 `remote-management.disable-control-panel` 为 `true` 时，服务器将跳过下载 `management.html`，且 `/management.html` 会返回 404，从而禁用内置管理界面。

你可以通过设置环境变量 `MANAGEMENT_STATIC_PATH` 来指定 `management.html` 的存储目录。

## 使用自定义 Web UI

现在支持从自定义 GitHub 仓库获取管理面板。配置示例：

```yaml
remote-management:
  panel-github-repository: "https://github.com/your-org/your-management-ui"
```

- 仓库地址写法：`https://github.com/<org>/<repo>`，程序会自动转换成 `https://api.github.com/repos/<org>/<repo>/releases/latest` 调用。
- 也可以直接写 API 地址：`https://api.github.com/repos/<org>/<repo>/releases/latest`。
- 后台会定期检查最新 Release，查找名为 `management.html` 的资产并下载到静态目录（默认是配置文件同级的 `static/`，或 `MANAGEMENT_STATIC_PATH` 指定的目录）。如资产包含 `digest` 字段（推荐使用 `sha256:<hex>`），会用于哈希校验。

## 在 GitHub 发布自定义 Web UI 的规范

1. 构建自定义管理面板，生成单个 `management.html`（建议将静态资源打包进同一个文件）。
2. 创建 GitHub 仓库并推送代码。
3. 创建 Release（使用 `latest` 会被自动检测），上传资产文件：
   - 必须包含文件名 **`management.html`**。
   - 推荐在资产元数据中填写 `digest` 字段，格式 `sha256:<文件哈希>`，方便校验完整性。
4. 在 CLIProxyAPI 配置中设置 `remote-management.panel-github-repository` 为该仓库地址或对应的 API 地址。
5. 重启或热加载配置后，服务器会自动拉取最新的管理面板。
