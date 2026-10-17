---
title: Claude 请求伪装
feature_ids:
  - api-keys.claude.cloak-cache-user-id
  - api-keys.claude.cloak-mode
  - api-keys.claude.cloak-sensitive-words
  - api-keys.claude.cloak-strict-mode
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Claude 请求伪装

## 1. 这段解决什么问题

这里说明单把 Claude API 密钥的 cloak：何时伪装、如何处理 system 提示、敏感词，以及是否缓存 user_id。

## 2. 适用条件与不做的事

全局默认是 upstream.claude.disable-claude-cloak-mode。OAuth 凭证改的是凭证 JSON 里的 cloak_mode 等字段，不是本页的 YAML。指纹不是 cloak 的子字段。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  claude:
    - name: claude-1
      keys:
        - api-key: "YOUR_API_KEY"
          cloak:
            mode: "auto"
            strict-mode: false
            sensitive-words:
              - "API"
            cache-user-id: false
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.cloak.cache-user-id | api-keys.claude.cloak.cache-user-id | nil | 省略或 false 时每个请求生成新的随机 user_id。true 时按 API 密钥复用。 |
| api-keys.claude.cloak.mode | api-keys.claude.cloak.mode | Mode controls cloaking behavior: "auto" (default), "always", or "never". | auto：有明确原生入口信号时不伪装。always：未确认客户端都伪装，已确认的原生 Claude Code 仍直通。never：不伪装。写出 cloak 块就会为未指定指纹的 API 密钥启用伪装。 |
| api-keys.claude.cloak.sensitive-words | api-keys.claude.cloak.sensitive-words | nil | 列出的词会在对应提示里用零宽字符打乱。省略时不处理。 |
| api-keys.claude.cloak.strict-mode | api-keys.claude.cloak.strict-mode | - false (default): legacy-model whitelist uses a user reminder; all other models use a mid-conversation system message - true: strip caller system prompts and keep only the Claude Code billing and identity blocks | false：旧模型白名单用用户提醒，其他模型用对话中的 system 消息。true：去掉调用方 system，只保留 Claude Code 账单和身份块。 |

## 5. 常见错误与边界

mode 只应按 auto、always、never 配置。写出 cloak 块就会为未指定指纹的 API 密钥启用伪装。已确认的原生 Claude Code 在 always 下仍然直通。

## 6. 相关功能

全局开关见 [Claude 上游行为](/cn/accounts/upstream)。指纹见 [Claude 指纹配置](/cn/accounts/api-keys-fingerprint)。

## 7. 使用经验

暂无
