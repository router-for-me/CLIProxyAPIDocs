# AI Studio 使用说明

您可以将本服务 (CLIProxyAPI) 作为后端，配合 [这个 AI Studio 应用](https://ai.studio/apps/949f2248-4b3c-44f9-8e6e-5a967ab930be) 使用。请遵循以下步骤进行配置：

1.  **启动 CLIProxyAPI 服务**：确保您的 CLIProxyAPI 实例正在本地或远程运行。
2.  **访问 AI Studio 应用**：在浏览器中登录您的 Google 账户，然后打开以下链接：
    - [https://ai.studio/apps/949f2248-4b3c-44f9-8e6e-5a967ab930be](https://ai.studio/apps/949f2248-4b3c-44f9-8e6e-5a967ab930be)

## 连接配置

默认情况下，AI Studio 应用会尝试连接到本地的 CLIProxyAPI (`ws://127.0.0.1:8317`)。

-   **连接到远程服务**：
    如果您需要连接到远程部署的 CLIProxyAPI，请修改 AI Studio 应用中的 `config.ts` 文件，更新 `WEBSOCKET_PROXY_URL` 的值。
    -   如果您的远程服务启用了 SSL，请使用 `wss://` 协议。
    -   如果未启用 SSL，请使用 `ws://` 协议。

## 认证配置

默认情况下，CLIProxyAPI 的 WebSocket 连接不要求认证。

-   **在 CLIProxyAPI 服务端启用认证**：
    在您的 `config.yaml` 文件中，将 `ws_auth` 设置为 `true`。
-   **在 AI Studio 客户端配置认证**：
    在 AI Studio 应用的 `config.ts` 文件中，设置 `JWT_TOKEN` 的值为您的认证令牌。
