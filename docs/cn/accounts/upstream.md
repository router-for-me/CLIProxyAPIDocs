---
title: Claude 上游行为
feature_ids:
  - upstream.claude.disable-claude-cloak-mode
  - upstream.claude.disable-cloaking-model-list
  - upstream.claude.header-defaults-anthropic-beta-append
  - upstream.claude.header-defaults-anthropic-beta-strip
  - upstream.claude.header-defaults-arch
  - upstream.claude.header-defaults-client-request-id
  - upstream.claude.header-defaults-inject-diagnostics
  - upstream.claude.header-defaults-os
  - upstream.claude.header-defaults-package-version
  - upstream.claude.header-defaults-runtime-version
  - upstream.claude.header-defaults-stabilize-device-profile
  - upstream.claude.header-defaults-timeout
  - upstream.claude.header-defaults-timezone
  - upstream.claude.header-defaults-user-agent
  - upstream.claude.model-level-cooling
  - upstream.claude.session-date-pin-days
  - upstream.claude.tool-search
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Claude 上游行为

## 1. 这段解决什么问题

这里说明所有 Claude 凭证共用的伪装、模型列表、指纹基线、工具搜索、模型级冷却和会话日期。

## 2. 适用条件与不做的事

单把 API 密钥的 cloak 和 fingerprint-profile 不在本页。Codex 上游开关在 Codex 提供商选项页。

## 3. 怎么配置或怎么调用

```yaml
upstream:
  claude:
    model-level-cooling: false
    tool-search: false
    session-date-pin-days: 7
    disable-claude-cloak-mode: false
    disable-cloaking-model-list: false
    header-defaults:
      user-agent: ""
      package-version: ""
      runtime-version: ""
      os: ""
      arch: ""
      timeout: ""
      timezone: ""
      stabilize-device-profile: false
      anthropic-beta-strip: []
      anthropic-beta-append: []
      inject-diagnostics: false
      client-request-id: "on"
```

`session-date-pin-days` 省略时按 7 天。显式 0 保留 1 小时的连续性日期。模板里的版本字符串只是示例，不是代码里的默认值。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| upstream.claude.disable-claude-cloak-mode | 是否让 Claude 凭证默认不做请求伪装。 | When true, every Claude credential defaults to no cloaking ("never"); a specific credential can still re-enable or override it via its own cloak settings (the per claude-api-key "cloak" block, or a "cloak_mode" value in the auth/OAuth token file). | auto：有明确原生入口信号时不伪装。always：未确认客户端都伪装，已确认的原生 Claude Code 仍直通。never：不伪装。写出 cloak 块就会为未指定指纹的 API 密钥启用伪装。 |
| upstream.claude.disable-cloaking-model-list | 模型列表是否返回原始模型 ID。 | false | true 时 Anthropic 模型列表返回原始模型 ID。 |
| upstream.claude.header-defaults.anthropic-beta-append | upstream.claude.header-defaults.anthropic-beta-append | nil | 在删除之后追加尚不存在的精确名称。 |
| upstream.claude.header-defaults.anthropic-beta-strip | upstream.claude.header-defaults.anthropic-beta-strip | nil | 按精确名称删除，保持其余顺序。空白和重复项会被去掉。 |
| upstream.claude.header-defaults.arch | upstream.claude.header-defaults.arch | empty string | 只在 stabilize-device-profile 为 true 时钉住。 |
| upstream.claude.header-defaults.client-request-id | upstream.claude.header-defaults.client-request-id | empty string | 空和 on 生成 UUID；passthrough 只转发调用方的值；off 不发送。其他值警告后退回空，即 on。 |
| upstream.claude.header-defaults.inject-diagnostics | upstream.claude.header-defaults.inject-diagnostics | nil | 省略时，Claude Code CLI 指纹仍注入 diagnostics。显式 false 停止注入，并一并停止 cache-diagnosis beta。 |
| upstream.claude.header-defaults.os | upstream.claude.header-defaults.os | empty string | 只在 stabilize-device-profile 为 true 时钉住。 |
| upstream.claude.header-defaults.package-version | upstream.claude.header-defaults.package-version | empty string | 空值不设置包版本基线。 |
| upstream.claude.header-defaults.runtime-version | upstream.claude.header-defaults.runtime-version | empty string | 空值不设置运行时版本基线。 |
| upstream.claude.header-defaults.stabilize-device-profile | upstream.claude.header-defaults.stabilize-device-profile | nil | true 钉住操作系统和架构，并不再自动学习更新的软件版本。 |
| upstream.claude.header-defaults.timeout | upstream.claude.header-defaults.timeout | empty string | 空值不提供超时回退。 |
| upstream.claude.header-defaults.timezone | upstream.claude.header-defaults.timezone | empty string | 凭证 JSON 里的 timezone 优先。空值不设置回退时区。 |
| upstream.claude.header-defaults.user-agent | upstream.claude.header-defaults.user-agent | empty string | 空值不注入。只有版本对上基线的已核实原生客户端才保留自己的形状。 |
| upstream.claude.model-level-cooling | 配额冷却是否只作用于当前模型。 | false | upstream.claude.model-level-cooling |
| upstream.claude.session-date-pin-days | 伪装用的 currentDate 按会话保留的天数。 | A nil value (unset) defaults to 7 days; an explicit 0 keeps the continuity-scoped pin (1h lifetime). | 省略按 7 天。显式 0 保留 1 小时的连续性日期。过大的天数会被截断，以免时长溢出。 |
| upstream.claude.tool-search | 是否在 Claude Responses 路径启用 Codex tool_search。 | Default false keeps the translation that predates tool_search support. | true 时在 Claude Responses 路径启用 Codex tool_search。官方地址或 native-tool-search 为 true 的密钥走原生搜索。 |

## 5. 常见错误与边界

`client-request-id` 不是 on、off、passthrough 或空时，载入会警告并退回空值，空值即 on。不识别的值不会让配置载入失败。Anthropic-Beta 名称按精确字符串匹配，空白和重复项会被去掉。

## 6. 相关功能

单密钥伪装见 [Claude 请求伪装](/cn/accounts/api-keys-cloak)。指纹见 [Claude 指纹配置](/cn/accounts/api-keys-fingerprint)。

## 7. 使用经验

暂无
