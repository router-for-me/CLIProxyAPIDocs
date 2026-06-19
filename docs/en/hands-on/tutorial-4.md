# Four: Relay Forwarding Integration

In the previous articles, we have successfully integrated built-in providers through OAuth or Cookie methods. In this tutorial, we will go a step further and learn how to conveniently integrate various AI relay services into CLIProxyAPI.

First, let's review the configuration file we used before:

```yaml
port: 8317

# Please fill in the folder location according to your actual situation
auth-dir: "Z:\\CLIProxyAPI\\auths"

request-retry: 3

quota-exceeded:
  switch-project: true
  switch-preview-model: true

api-keys:
# Please set the Key yourself, used for client access to the proxy
- "ABC-123456"
```

After the initial configuration, we have not changed it. Now, it's time to expand this file.

Let's first add a Claude relay service. To do this, we first need to obtain the `base-url` of the service, which can usually be found in the official documentation or tutorials of the corresponding service provider.

Taking 88code as an example, the following information can be found in its official tutorial:

![](https://img.072899.xyz/2025/09/11c41d79d62c02df1ac5d5998c75d3e5.png)

From the figure, we can know that the `base-url` of the 88code relay Claude service is `https://www.88code.org/api`.

We add the `claude-api-key` field to the configuration file:

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

Similarly, 88code also provides Codex services. We use the same method to find its `base-url`:

![](https://img.072899.xyz/2025/09/28e5ce297bca540e052863860dd9eb2c.png)

Then, add the `codex-api-key` field to the configuration file:

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

For other service providers, you can also add them in a similar way. For example, I have a few PackyCode's Codex API Keys here, and I will add them to the configuration together:

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

Please note that even for multiple `api-key`s from the same service provider and using the same `base-url`, you need to declare the `base-url` separately for each `api-key`, and it cannot be omitted.

In addition, CLIProxyAPI also supports access to any provider compatible with the OpenAI interface, which needs to be configured through the `openai-compatibility` field. The specific steps will not be repeated here. You can directly refer to the configuration file example below for configuration:

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

As you can see, the configuration logic of `openai-compatibility` is slightly different from before: all `api-key`s under the same provider share the same `base-url`.

So far, the configuration is complete. The remaining model connectivity verification is left for readers to test by themselves.
