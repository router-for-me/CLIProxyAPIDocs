# Z.AI / GLM（OAuth 登录）

CLIProxyAPI 通过 OAuth 支持 Z.AI GLM 编程套餐 — 无需 API 密钥。提供两个身份提供商：**Z.AI 国际版**（`chat.z.ai`）和 **BigModel / 智谱**（中国大陆，`bigmodel.cn`）。登录后，账户会作为 `zai` 提供商使用，默认通过 Anthropic 兼容端点提供 GLM 模型（Z.AI 为 `https://api.z.ai/api/anthropic`，BigModel 为 `https://open.bigmodel.cn/api/anthropic`）。

## 登录

### Z.AI（国际版）

```bash
./cli-proxy-api --zai-login
```

### BigModel（中国大陆）

```bash
./cli-proxy-api --zai-login --zai-provider bigmodel
```

无需 API 密钥 — 授权后，登录会自动签发标准编程套餐 API 密钥（与官方客户端的步骤相同）。

选项：加上 `--no-browser` 可打印登录地址而不自动打开浏览器。

- **Z.AI** 使用服务端中转的 CLI 流程（基于轮询），不会启动本地回调服务器。
- **BigModel** 通过本地回环回调完成登录。默认绑定一个自动空闲端口；可用 `--oauth-callback-port <port>` 覆盖：

```bash
./cli-proxy-api --zai-login --zai-provider bigmodel --oauth-callback-port <port>
```

由于 BigModel 回调是回环地址，浏览器与代理必须运行在同一主机上（CLI 登录始终满足此条件）。

## 支持的模型

- `glm-4.5`
- `glm-4.5-air`
- `glm-4.6`
- `glm-4.7`
- `glm-5`
- `glm-5-turbo`
- `glm-5.1`
- `glm-5.2`

GLM 模型为混合推理：可关闭思考，且 `glm-5.2` 提供两个思考强度等级（`high`、`max`）。

## 模型控制

在 `oauth-model-alias` 中使用 `zai` 渠道，为模型暴露不同的客户端可见名称：

```yaml
oauth-model-alias:
  zai:
    - name: "glm-4.6"
      alias: "glm-latest"
```

在 `oauth-excluded-models` 中使用同一渠道，从模型列表和路由中隐藏模型：

```yaml
oauth-excluded-models:
  zai:
    - "glm-4.5-air"
```

## 请求说明

OAuth 令牌本身并不是推理凭证，因此登录会签发标准编程套餐 API 密钥，并作为 `x-api-key` 发送到 Anthropic 兼容端点（无客户端/验证码校验）。签发的密钥保存在认证文件中并用于模型路由；GLM 请求通过 Anthropic 兼容路径进行转换。
