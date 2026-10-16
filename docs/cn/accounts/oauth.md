---
title: OAuth 目录、别名与排除
feature_ids:
  - oauth.auth-auto-refresh-workers.value
  - oauth.auth-dir.value
  - oauth.excluded-models.value
  - oauth.model-alias.alias
  - oauth.model-alias.display-name
  - oauth.model-alias.force-mapping
  - oauth.model-alias.fork
  - oauth.model-alias.name
  - oauth.providers.devin-sensitive-words
  - oauth.request-scoped-errors.action
  - oauth.request-scoped-errors.match
  - oauth.request-scoped-errors.match-regexr
  - oauth.request-scoped-errors.status
  - oauth.settings.alias
  - oauth.settings.max-context-length
  - oauth.settings.name
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# OAuth 目录、别名与排除

## 1. 这段解决什么问题

这里集中说明文件型 OAuth 凭证的目录、刷新线程、模型别名、上下文设置、全局排除和按提供商的错误规则。

## 2. 适用条件与不做的事

不应用于 `api-keys` 分组。各提供商登录命令不在本页。别名渠道以模板列出的 vertex、aistudio、antigravity、claude、codex、kimi、xai、meta 为准；插件提供商键也可以出现在同一映射里。

## 3. 怎么配置或怎么调用

```yaml
oauth:
  auth-dir: "~/.cli-proxy-api"
  auth-auto-refresh-workers: 16
  model-alias:
    codex:
      - name: "gpt-5"
        alias: "g5"
        fork: false
        display-name: "GPT-5"
        force-mapping: false
  settings:
    codex:
      - name: "gpt-5"
        alias: "g5"
        max-context-length: 0
  excluded-models:
    codex:
      - "gpt-5-codex-mini"
  request-scoped-errors:
    codex:
      - status: 400
        match:
          - "context_window_exceeded"
        match-regexr:
          - "context_window_exceeded$"
        action: "stop"
  providers:
    devin:
      sensitive-words:
        - "API"
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| oauth.auth-auto-refresh-workers | oauth.auth-auto-refresh-workers | When <= 0, the default worker count is used. | 大于 0 时覆盖默认的 16。小于等于 0 仍用 16。 |
| oauth.auth-dir | oauth.auth-dir | empty string | 空值解析为 ~/.cli-proxy-api。以 ~ 开头时展开到用户主目录。 |
| oauth.excluded-models | oauth.excluded-models | nil | oauth.excluded-models |
| oauth.model-alias.alias | 客户端看到的模型名。 | empty string | 客户端使用这个名字。OAuth 设置里，精确别名匹配优先于名称匹配，同级以后出现的条目为准。 |
| oauth.model-alias.display-name | 目录里显示的可读名称。 | empty string | 省略时目录不使用单独的显示名。 |
| oauth.model-alias.force-mapping | 把上游响应里的模型字段改回客户端别名。 | false | true 时把响应中的模型字段写回别名。false 不改写。 |
| oauth.model-alias.fork | 是否在保留原模型名的同时再暴露别名。 | false | true 时原模型 ID 仍保留，别名作为额外的客户端模型出现。 |
| oauth.model-alias.name | 发给上游的模型名，或 OAuth 设置要匹配的模型名。 | empty string | 请求发往这个上游模型名。OAuth 别名不作用于 api-keys 分组。 |
| oauth.providers.devin.sensitive-words | oauth.providers.devin.sensitive-words | nil | 列出的词会在对应提示里用零宽字符打乱。省略时不处理。 |
| oauth.request-scoped-errors.action | 命中后如何处理这条上游错误。 | empty string | 只使用 stop、stop-and-cooldown、continue、continue-and-cooldown。OAuth 全局规则里空动作会被丢掉，不单独报错。 |
| oauth.request-scoped-errors.match | 用子字符串匹配上游错误正文。 | nil | 省略时不按子串匹配。状态码不是正数，或子串和正则都空，这条 OAuth 规则会被丢掉。 |
| oauth.request-scoped-errors.match-regexr | 用正则表达式匹配上游错误正文。 | nil | 省略时不按正则匹配。空白项会被去掉。 |
| oauth.request-scoped-errors.status | 要匹配的上游 HTTP 状态码。 | 0 | oauth.request-scoped-errors.status |
| oauth.settings.alias | 客户端看到的模型名。 | empty string | 客户端使用这个名字。OAuth 设置里，精确别名匹配优先于名称匹配，同级以后出现的条目为准。 |
| oauth.settings.max-context-length | 向 Codex 客户端公布的上下文长度。 | 0 | 0 表示不覆盖向 Codex 客户端公布的上下文窗口。正数才覆盖。 |
| oauth.settings.name | 发给上游的模型名，或 OAuth 设置要匹配的模型名。 | empty string | 请求发往这个上游模型名。OAuth 别名不作用于 api-keys 分组。 |

## 5. 常见错误与边界

别名和设置本身不因为未知渠道名在载入时失败。OAuth 请求级规则会丢掉状态码不是正数、动作为空、或子串与正则都空的条目，而不是让整个配置失败。凭证目录为空时解析为 `~/.cli-proxy-api`；家目录无法解析时启动记录 `failed to resolve auth directory`。刷新线程数小于等于 0 时仍用 16。

## 6. 相关功能

登录页见侧边栏中的各提供商登录。API 密钥排除见 [按密钥排除模型](/cn/accounts/api-keys-excluded)。

## 7. 使用经验

暂无
