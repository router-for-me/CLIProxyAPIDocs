---
title: 重建 Claude system 消息
feature_ids:
  - api-keys.claude.rebuild-mid-system-message
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 重建 Claude system 消息

## 1. 这段解决什么问题

把 Claude 消息列表里 role 为 system 的消息移到顶层 system 字段。

## 2. 适用条件与不做的事

只作用于 Claude API 密钥。它不是 cloak.strict-mode。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  claude:
    - name: claude-1
      keys:
        - api-key: "YOUR_API_KEY"
          rebuild-mid-system-message: false
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.rebuild-mid-system-message | 是否把消息里的 system 角色并入顶层 system。 | false | true 时把 role 为 system 的 Claude 消息移到顶层 system。false 保持原样。 |

## 5. 常见错误与边界

false 保持消息原样。true 只移动 role 为 system 的消息。

## 6. 相关功能

伪装对 system 的处理见 [Claude 请求伪装](/cn/accounts/api-keys-cloak)。

## 7. 使用经验

暂无
