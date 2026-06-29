# Web UI

项目地址：[Cli-Proxy-API-Management-Center](https://github.com/router-for-me/Cli-Proxy-API-Management-Center)

一个官方的基于Web的CLIProxyAPI管理界面。

基础路径：`http://localhost:8317/management.html`

设置 `remote-management.disable-control-panel` 为 `true` 时，服务器将跳过下载 `management.html`，且 `/management.html` 会返回 404，从而禁用内置管理界面。

你可以通过设置环境变量 `MANAGEMENT_STATIC_PATH` 来指定 `management.html` 的存储目录。

## 连接信息存储与插件资源页

官方管理中心会把连接状态存到管理中心当前 origin 的浏览器 `localStorage` 中。服务地址会被持久化，方便下次重新连接。管理密钥只会在用户启用记住密码，或迁移旧版已保存会话时持久化。存储值使用可逆混淆，不是加密安全边界。

当管理中心和 CLIProxyAPI 运行在同一个 origin 下时，从 `/v0/resource/plugins/<pluginID>/...` 加载的插件资源页也运行在同一个 origin 中。受信任的插件资源页可以读取同一份 `localStorage`，并复用其中保存的管理密钥调用 `/v0/management/...`。

安装并启用带资源页的插件，应视为信任该插件的浏览器端代码可以访问当前管理会话。插件资源页应打包自己的 JavaScript，不应加载第三方脚本，因为同源页面中的任何脚本都可以读取同源存储里的管理上下文。

如果你把管理中心部署在和 CLIProxyAPI 不同的 origin 上，浏览器同源策略会阻止插件资源 iframe 读取管理中心 origin 的 `localStorage`。这种部署下，插件页面应处理管理密钥缺失的情况，并提示用户打开同源管理页面或重新登录。

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
