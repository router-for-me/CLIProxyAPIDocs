---
title: 反重力提供商选项
feature_ids:
  - oauth.providers.antigravity-antigravity-credits
  - oauth.providers.antigravity-connection-pool-enabled
  - oauth.providers.antigravity-connection-pool-idle-conn-timeout
  - oauth.providers.antigravity-connection-pool-max-idle-conns-per-host
  - oauth.providers.antigravity-sensitive-words
  - oauth.providers.antigravity-signature-bypass-strict
  - oauth.providers.antigravity-signature-cache-enabled
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 反重力提供商选项

## 1. 这段解决什么问题

说明 Antigravity OAuth 凭证共用的 credits、连接池、敏感词和 thinking 签名缓存。

## 2. 适用条件与不做的事

登录命令不在本页。这些选项不作用于 API 密钥组。

## 3. 怎么配置或怎么调用

```yaml
oauth:
  providers:
    antigravity:
      antigravity-credits: false
      sensitive-words:
        - "API"
      connection-pool:
        enabled: false
        idle-conn-timeout: "30s"
        max-idle-conns-per-host: 2
      signature-cache-enabled: true
      signature-bypass-strict: false
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| oauth.providers.antigravity.antigravity-credits | 免费层用尽后，是否改用带 Google One AI credits 的凭证。 | false | 只作用于 Claude 模型。全部免费层凭证因 429 或 503 用尽后，才用仍有 credits 的凭证做最后回退。false 或不写则不做这次回退。 |
| oauth.providers.antigravity.connection-pool.enabled | oauth.providers.antigravity.connection-pool.enabled | Defaults to false (short-lived connection mode). | oauth.providers.antigravity.connection-pool.enabled |
| oauth.providers.antigravity.connection-pool.idle-conn-timeout | oauth.providers.antigravity.connection-pool.idle-conn-timeout | Defaults to "30s". | oauth.providers.antigravity.connection-pool.idle-conn-timeout |
| oauth.providers.antigravity.connection-pool.max-idle-conns-per-host | oauth.providers.antigravity.connection-pool.max-idle-conns-per-host | Defaults to 2. | oauth.providers.antigravity.connection-pool.max-idle-conns-per-host |
| oauth.providers.antigravity.sensitive-words | oauth.providers.antigravity.sensitive-words | nil | 列出的词会在对应提示里用零宽字符打乱。省略时不处理。 |
| oauth.providers.antigravity.signature-bypass-strict | oauth.providers.antigravity.signature-bypass-strict | nil | oauth.providers.antigravity.signature-bypass-strict |
| oauth.providers.antigravity.signature-cache-enabled | oauth.providers.antigravity.signature-cache-enabled | When true (default), cached signatures are preferred and validated. | oauth.providers.antigravity.signature-cache-enabled |

## 5. 常见错误与边界

连接池只有 enabled 为 true 才启用。idle-conn-timeout 无法解析时警告并使用 30s；超过 210s 时截断为 210s；小于等于 0 时改为短连接。max-idle-conns-per-host 大于 100 时截断为 100，小于 0 时改为短连接。签名缓存省略时为 true。signature-bypass-strict 只在缓存关闭后起作用。antigravity-credits 为 true 时，只有 Claude 模型的免费层凭证都因 429 或 503 用尽后，才改用仍有 Google One AI credits 的凭证。false 或不写时没有这次回退。

## 6. 相关功能

登录见 [反重力登录](/cn/accounts/antigravity)。

## 7. 使用经验

- [额度切换前先走积分回退](/cn/experience/configuration#exp-configuration-antigravity-credits)
