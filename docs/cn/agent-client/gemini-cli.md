# Gemini CLI

启动 CLIProxyAPI 服务器，根据您的认证方式选择以下配置之一。

## Login with Google (OAuth)

将 `CODE_ASSIST_ENDPOINT` 环境变量设置为 CLIProxyAPI 服务器的 URL。

```bash
export CODE_ASSIST_ENDPOINT="http://127.0.0.1:8317"
```

服务器将中继 `loadCodeAssist`、`onboardUser` 和 `countTokens` 请求。并自动在多个账户之间轮询文本生成请求。

> [!NOTE]  
> 此功能仅允许本地访问，因为找不到一个可以验证请求的方法。
> 所以只能强制只有 `127.0.0.1` 可以访问。

## Use Gemini API Key

配置 Gemini API Base URL 和 API Key：

```bash
export GOOGLE_GEMINI_BASE_URL="http://127.0.0.1:8317"
export GEMINI_API_KEY="sk-dummy"
```

> [!NOTE]  
> 与 OAuth 模式不同，此模式下允许 CLIProxyAPI 配置为任何 IP 地址或域名。
