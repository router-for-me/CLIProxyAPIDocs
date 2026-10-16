---
title: xAI 搜索工具
feature_ids:
  - upstream.xai.inject-x-search
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# xAI 搜索工具

## 1. 这段解决什么问题

在请求没有声明 x_search 时，由代理补上 xAI 的原生搜索工具。

## 2. 适用条件与不做的事

登录和 API 密钥不在本页。注入后，适用时也会把它加入 tool_choice.allowed_tools。

## 3. 怎么配置或怎么调用

```yaml
upstream:
  xai:
    inject-x-search: false
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| upstream.xai.inject-x-search | 请求没声明时是否注入 xAI 的 x_search。 | false | true 时，只在请求没有声明 x_search 时注入，适用时也加入 tool_choice.allowed_tools。 |

## 5. 常见错误与边界

false 或不写都不会注入。true 只在请求自己没有声明该工具时注入。

## 6. 相关功能

登录见 [xAI 登录](/cn/accounts/xai)。

## 7. 使用经验

暂无
