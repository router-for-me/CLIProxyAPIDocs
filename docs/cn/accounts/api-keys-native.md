---
title: Claude 原生工具搜索
feature_ids:
  - api-keys.claude.native-tool-search
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Claude 原生工具搜索

## 1. 这段解决什么问题

声明一把使用自定义地址的 Claude 密钥可以接收 Anthropic 原生工具搜索。

## 2. 适用条件与不做的事

官方 api.anthropic.com 不需要这个开关。它还依赖 upstream.claude.tool-search。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  claude:
    - name: claude-1
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
          native-tool-search: true
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.native-tool-search | 是否信任自定义地址上的 Anthropic 原生工具搜索。 | false | 官方 api.anthropic.com 不需要它。自定义 base-url 要把它设为 true，并且 upstream.claude.tool-search 也要为 true，才会信任 defer_loading 和 tool_reference。 |

## 5. 常见错误与边界

false 或省略时，自定义网关不按原生工具搜索处理。仅打开这一项而全局 tool-search 仍为 false 时，不会单独启用 Codex tool_search。

## 6. 相关功能

全局开关见 [Claude 上游行为](/cn/accounts/upstream)。

## 7. 使用经验

暂无
