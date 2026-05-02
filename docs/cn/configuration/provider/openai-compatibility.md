# OpenAI 兼容供应商

### OpenAI 兼容上游提供商

通过 `openai-compatibility` 配置上游 OpenAI 兼容提供商（例如 OpenRouter）。

- name：内部识别名
- disabled：可选，设为 true 则禁用该提供商（无需删除配置）
- base-url：提供商基础地址
- api-key-entries：API密钥条目列表，支持可选的每密钥代理配置（推荐且为持久化格式）
- models：将上游模型 `name` 映射为本地可用 `alias`

> 兼容说明：旧字段 `api-keys` 会在加载时自动迁移为 `api-key-entries`，保存配置时会被移除；请直接使用 `api-key-entries`。

支持每密钥代理配置的示例：

```yaml
openai-compatibility:
  - name: "openrouter"
    disabled: false
    base-url: "https://openrouter.ai/api/v1"
    api-key-entries:
      - api-key: "sk-or-v1-...b780"
        proxy-url: "socks5://proxy.example.com:1080"
      - api-key: "sk-or-v1-...b781"
    models:
      - name: "moonshotai/kimi-k2:free"
        alias: "kimi-k2"
```

使用方式：在 `/v1/chat/completions` 中将 `model` 设为别名（如 `kimi-k2`），代理将自动路由到对应提供商与模型。
