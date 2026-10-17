---
title: Alpha Search 密钥开关
feature_ids:
  - api-keys.codex.alpha-search
  - api-keys.meta.alpha-search
  - api-keys.xai.alpha-search
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Alpha Search 密钥开关

## 1. 这段解决什么问题

允许某一把 Codex、Meta 或 xAI API 密钥服务 Alpha Search。

## 2. 适用条件与不做的事

不包含 Alpha Search 的 HTTP 路径本身。Claude 密钥没有这个字段。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  codex:
    - name: codex-1
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
          alpha-search: false
```

打开后，调用使用该组 base-url 加上 `/alpha/search`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.codex.alpha-search | 是否允许这把密钥服务 Alpha Search。 | false | false 时这把密钥不服务 Alpha Search。true 时通过该组 base-url 加上 /alpha/search 提供。 |
| api-keys.meta.alpha-search | 是否允许这把密钥服务 Alpha Search。 | false | false 时这把密钥不服务 Alpha Search。true 时通过该组 base-url 加上 /alpha/search 提供。 |
| api-keys.xai.alpha-search | 是否允许这把密钥服务 Alpha Search。 | false | false 时这把密钥不服务 Alpha Search。true 时通过该组 base-url 加上 /alpha/search 提供。 |

## 5. 常见错误与边界

false 时这把密钥不承担 Alpha Search。缺少 base-url 时，公开路由会按该路由自己的 503 处理，不在本页重复。

## 6. 相关功能

公开路径见 Responses 分册。基础地址见 [上游基础地址](/cn/accounts/api-keys-base)。

## 7. 使用经验

暂无
