---
title: Claude 指纹配置
feature_ids:
  - api-keys.claude.fingerprint-profile
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Claude 指纹配置

## 1. 这段解决什么问题

决定一把 Claude API 密钥在 Messages 请求上使用调用方自己的指纹，还是 Claude Code CLI 指纹。

## 2. 适用条件与不做的事

它不把 API 密钥变成 OAuth 令牌，不启用刷新或 OAuth 取消语义。count_tokens 仍保持模型、消息和工具的原生形状。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  claude:
    - name: cli-compatible-gateway
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
          fingerprint-profile: "claude-code-cli"
```

省略或空字符串保持调用方指纹。`oauth-cli` 是 `claude-code-cli` 的旧写法。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.fingerprint-profile | 这把 Claude API 密钥使用的请求指纹。 | Empty/default keeps the caller request fingerprint and headers, including first-party api.anthropic.com API keys. | api-keys.claude.fingerprint-profile |

## 5. 常见错误与边界

其他字符串不会在普通配置载入时失败，请求时会按空指纹处理。管理接口写入会拒绝无法识别的值，错误含 `unsupported fingerprint-profile`。CCH 只在 api.anthropic.com 和 Vertex 上发出；其他网关即使选择了 CLI 指纹也不会带 cch。

## 6. 相关功能

伪装见 [Claude 请求伪装](/cn/accounts/api-keys-cloak)。全局指纹基线见 [Claude 上游行为](/cn/accounts/upstream)。

## 7. 使用经验

暂无
