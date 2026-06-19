# 肆：中转转发接入篇

在前几篇文章中，我们已经成功通过 OAuth 或 Cookie 方式接入了内置提供商。在本篇教程中，我们将更进一步，学习如何便捷地将各类 AI 中转服务接入 CLIProxyAPI。

首先，让我们回顾一下之前使用的配置文件：

```yaml
port: 8317

# 文件夹位置请根据你的实际情况填写
auth-dir: "Z:\\CLIProxyAPI\\auths"

request-retry: 3

quota-exceeded:
  switch-project: true
  switch-preview-model: true

api-keys:
# Key请自行设置，用于客户端访问代理
- "ABC-123456"
```

初次配置后，我们一直没有改动过它。现在，是时候对这个文件进行一些扩展了。

我们先来添加一个 Claude 的中转服务。为此，我们首先需要获取该服务的 `base-url`，这个地址通常可以在相应服务商的官方文档或教程中找到。

以 88code 为例，在其官方教程中可以找到如下信息：

![](https://img.072899.xyz/2025/09/11c41d79d62c02df1ac5d5998c75d3e5.png)

从图中可以获知，88code 中转 Claude 服务的 `base-url` 是 `https://www.88code.org/api`。

我们在配置文件中加入 `claude-api-key` 字段：

```yaml
port: 8317
auth-dir: "Z:\\CLIProxyAPI\\auths"
request-retry: 3
quota-exceeded:
  switch-project: true
  switch-preview-model: true
api-keys:
- "ABC-123456"

claude-api-key:
  - api-key: "88_XXXXXXXXXXXXXXXXXXXXXXXXX"
    base-url: "https://www.88code.org/api"
```

同样地，88code 也提供了 Codex 服务。我们依照相同的方法，找到其 `base-url`：

![](https://img.072899.xyz/2025/09/28e5ce297bca540e052863860dd9eb2c.png)

然后，在配置文件中添加 `codex-api-key` 字段：

```yaml
port: 8317
auth-dir: "Z:\\CLIProxyAPI\\auths"
request-retry: 3
quota-exceeded:
  switch-project: true
  switch-preview-model: true
api-keys:
- "ABC-123456"

claude-api-key:
  - api-key: "88_XXXXXXXXXXXXXXXXXXXXXXXXX"
    base-url: "https://www.88code.org/api"
    
codex-api-key:
  - api-key: "88_XXXXXXXXXXXXXXXXXXXXXXXXX"
    base-url: "https://www.88code.org/openai/v1"
```

对于其他服务商，也可以采用类似的方式进行添加。例如，我这里还有几个 PackyCode 的 Codex API Key，我将它们一并加入配置：

```yaml
port: 8317
auth-dir: "Z:\\CLIProxyAPI\\auths"
request-retry: 3
quota-exceeded:
  switch-project: true
  switch-preview-model: true
api-keys:
- "ABC-123456"

claude-api-key:
  - api-key: "88_XXXXXXXXXXXXXXXXXXXXXXXXX"
    base-url: "https://www.88code.org/api"
  - api-key: "sk-4cXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    base-url: "https://api.packycode.com"
  - api-key: "sk-HpYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
    base-url: "https://api.packycode.com"

codex-api-key:
  - api-key: "88_XXXXXXXXXXXXXXXXXXXXXXXXX"
    base-url: "https://www.88code.org/openai/v1"
  - api-key: "fk-4cXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    base-url: "https://oai-api.fkclaude.com/v1"
  - api-key: "sk-amXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    base-url: "https://codex-api.packycode.com/v1"
  - api-key: "sk-sTXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    base-url: "https://codex-api.packycode.com/v1"
```

请注意，即使是同一服务商、使用相同 `base-url` 的多个 `api-key`，也需要为每一条 `api-key` 单独声明 `base-url`，不可省略。

此外，CLIProxyAPI 还支持接入任何兼容 OpenAI 接口的供应商，这需要通过 `openai-compatibility` 字段来配置。在此不再赘述具体步骤，大家可以直接参考下方的配置文件示例进行配置：

```yaml
port: 8317
auth-dir: "Z:\\CLIProxyAPI\\auths"
request-retry: 3
quota-exceeded:
  switch-project: true
  switch-preview-model: true
api-keys:
- "ABC-123456"

claude-api-key:
  - api-key: "88_XXXXXXXXXXXXXXXXXXXXXXXXX"
    base-url: "https://www.88code.org/api"

codex-api-key:
  - api-key: "88_XXXXXXXXXXXXXXXXXXXXXXXXX"
    base-url: "https://www.88code.org/openai/v1"
  - api-key: "fk-4cXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    base-url: "https://oai-api.fkclaude.com/v1"
  - api-key: "sk-amXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    base-url: "https://codex-api.packycode.com/v1"
  - api-key: "sk-sTXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    base-url: "https://codex-api.packycode.com/v1"

openai-compatibility:
  - name: "openrouter"
    base-url: "https://openrouter.ai/api/v1"
    api-keys:
      - "sk-or-v1-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      - "sk-or-v1-bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    models:
      - name: "deepseek/deepseek-chat-v3.1:free"
        alias: "deepseek-v3.1"
      - name: "deepseek/deepseek-r1-0528:free"
        alias: "deepseek-r1-0528"
      - name: "x-ai/grok-4-fast:free"
        alias: "grok-4-fast"
  - name: "groq"
    base-url: "https://api.groq.com/openai/v1"
    api-keys:
      - "gsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    models:
      - name: "deepseek-r1-distill-llama-70b"
        alias: "deepseek-r1-70b"
```

可以看到，`openai-compatibility` 的配置逻辑与之前略有不同：同一供应商（Provider）下的所有 `api-key` 共享同一个 `base-url`。

至此，配置就完成了。剩下的模型连通性验证，就留给各位读者自行测试了。
