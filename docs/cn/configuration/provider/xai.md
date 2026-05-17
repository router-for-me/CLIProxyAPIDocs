# xAI / Grok（OAuth 登录）

CLIProxyAPI 支持通过 xAI OAuth 登录 Grok Build 账户。登录后，该账户会作为 `xai` 提供商使用，默认上游 API 地址为 `https://api.x.ai/v1`。

## 登录

```bash
./cli-proxy-api --xai-login
```

选项：加上 `--no-browser` 可打印登录地址而不自动打开浏览器。默认本地 OAuth 回调监听 `127.0.0.1:56121/callback`。

如果默认回调端口不可用，可以指定端口：

```bash
./cli-proxy-api --xai-login --oauth-callback-port <port>
```

在远程或无浏览器环境中，请按命令输出的 SSH 隧道提示操作。如果 CLI 要求手动粘贴 callback token，请只粘贴 token 本身，不要粘贴完整回调 URL。

## 支持的 API

- 文本模型会路由到 xAI Responses API，可通过 `/v1/responses`、`/v1/chat/completions` 等 OpenAI 兼容端点调用。
- 图片请求使用 `/v1/images/generations` 和 `/v1/images/edits`，模型为 `grok-imagine-image` 或 `grok-imagine-image-quality`。
- 视频请求使用 `/v1/videos`、`/v1/videos/generations`、`/v1/videos/edits`、`/v1/videos/extensions` 和 `/v1/videos/{request_id}`，模型为 `grok-imagine-video`。

xAI 图片和视频模型可以直接使用模型名，也可以使用 `xai/`、`x-ai/` 或 `grok/` 前缀。

## 模型控制

在 `oauth-model-alias` 中使用 `xai` 渠道，可以为模型暴露新的客户端可见名称：

```yaml
oauth-model-alias:
  xai:
    - name: "grok-4.3"
      alias: "grok-latest"
```

在 `oauth-excluded-models` 中使用同一渠道，可以从模型列表和路由中隐藏模型：

```yaml
oauth-excluded-models:
  xai:
    - "grok-3-mini"
```

## 请求说明

CLIProxyAPI 会在发送到 xAI 上游前规范化 Responses 请求：移除不支持的续接/缓存字段，调整工具定义以兼容 xAI，并且只为支持 reasoning effort 的 Grok 模型保留 reasoning 设置。
