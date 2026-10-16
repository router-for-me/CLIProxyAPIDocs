---
title: 实验性 CCH 签名
feature_ids:
  - api-keys.claude.experimental-cch-signing
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 实验性 CCH 签名

## 1. 这段解决什么问题

保留旧配置里的 experimental-cch-signing，避免旧文件无法载入。

## 2. 适用条件与不做的事

它不再单独打开或关闭签名。真实 Claude OAuth，以及 api.anthropic.com 上的 claude-code-cli 指纹，会自动签名。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  claude:
    - name: claude-1
      keys:
        - api-key: "YOUR_API_KEY"
          experimental-cch-signing: false
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.experimental-cch-signing | 为旧配置保留的 CCH 开关。 | false | api-keys.claude.experimental-cch-signing |

## 5. 常见错误与边界

这个布尔值不会因为 true 或 false 被拒绝。把它设为 true 也不会在不受支持的网关上额外签名。

## 6. 相关功能

指纹见 [Claude 指纹配置](/cn/accounts/api-keys-fingerprint)。

## 7. 使用经验

暂无
