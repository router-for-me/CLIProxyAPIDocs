---
title: 模型名前缀
feature_ids:
  - api-keys.claude.prefix
  - api-keys.codex.prefix
  - api-keys.gemini.prefix
  - api-keys.interactions.prefix
  - api-keys.meta.prefix
  - api-keys.openai-compatibility.prefix
  - api-keys.vertex.prefix
  - api-keys.xai.prefix
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 模型名前缀

## 1. 这段解决什么问题

给一条凭证或一个提供商加上模型名前缀，避免不同组的同名模型混在一起。

## 2. 适用条件与不做的事

前缀写在组上，也可以由单把密钥覆盖。它不是 OAuth 别名。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  gemini:
    - name: gemini-1
      prefix: "teamA"
      keys:
        - api-key: "YOUR_API_KEY"
```

调用时使用 `teamA/` 加上模型名，才会选中这组。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.prefix | 调用该凭证时必须带上的模型名前缀。 | empty string | 省略时不加前缀。设置后，客户端模型名要带这个前缀才会选中该凭证。 |
| api-keys.codex.prefix | 调用该凭证时必须带上的模型名前缀。 | empty string | 省略时不加前缀。设置后，客户端模型名要带这个前缀才会选中该凭证。 |
| api-keys.gemini.prefix | 调用该凭证时必须带上的模型名前缀。 | empty string | 省略时不加前缀。设置后，客户端模型名要带这个前缀才会选中该凭证。 |
| api-keys.interactions.prefix | 调用该凭证时必须带上的模型名前缀。 | empty string | 省略时不加前缀。设置后，客户端模型名要带这个前缀才会选中该凭证。 |
| api-keys.meta.prefix | 调用该凭证时必须带上的模型名前缀。 | empty string | 省略时不加前缀。设置后，客户端模型名要带这个前缀才会选中该凭证。 |
| api-keys.openai-compatibility.prefix | 调用该凭证时必须带上的模型名前缀。 | empty string | 省略时不加前缀。设置后，客户端模型名要带这个前缀才会选中该凭证。 |
| api-keys.vertex.prefix | 调用该凭证时必须带上的模型名前缀。 | empty string | 省略时不加前缀。设置后，客户端模型名要带这个前缀才会选中该凭证。 |
| api-keys.xai.prefix | 调用该凭证时必须带上的模型名前缀。 | empty string | 省略时不加前缀。设置后，客户端模型名要带这个前缀才会选中该凭证。 |

## 5. 常见错误与边界

空字符串表示不要求前缀。它不会在载入时校验前缀是否含斜杠。

## 6. 相关功能

别名见 [上游模型别名](/cn/accounts/api-keys-models)。

## 7. 使用经验

- [兼容模型要写入配置才出现在列表](/cn/experience/accounts#exp-accounts-list-compat-models)
- [无前缀请求失败时检查强制前缀](/cn/experience/routing#exp-routing-force-prefix-off)
