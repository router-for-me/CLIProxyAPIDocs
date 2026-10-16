---
title: 模型目录
feature_ids:
  - models.catalog.value
  - models.codex-catalog.value
  - models.devin-catalog.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 模型目录

## 1. 这段解决什么问题

`models` 分别为通用模型目录、Codex 客户端目录和 Devin 目录指定来源。三项互不影响。空值沿用进程默认：`--local-model` 使用内置目录，否则使用官方远程目录。写上绝对路径或 http(s) 地址后，只覆盖对应的那一项，并优先于 `--local-model`。

## 2. 适用条件与不做的事

这三项写在配置文件的 `models` 下。本页不说明某个模型 ID 怎么路由，也不说明目录 JSON 的内部字段。

Home 模式会停用通用目录和 Devin 目录，即使这两项写了显式来源；Codex 目录不受 Home 模式停用。`config.example.yaml` 只写了 Home 模式不加载通用目录，与代码不一致，以代码为准。

显式来源刷新失败时保留上一份有效目录，不会退回官方地址。文件和 URL 在来源变化时刷新，之后每 3 小时刷新一次。内置来源只加载一次，不再按这个间隔重复拉取。

## 3. 怎么配置或怎么调用

示例配置里的空值就是默认形态：

```yaml
models:
  catalog: ""
  codex-catalog: ""
  devin-catalog: ""
```

需要替换某一项时，使用绝对路径或带主机名的 http(s) 地址。下面的路径和地址是占位符，不是默认值：

```yaml
models:
  catalog: "/absolute/path/models.json"
  codex-catalog: "https://example.invalid/codex.json"
  devin-catalog: ""
```

只让空着的项目使用内置目录时，启动参数加上 `--local-model`。已经写明的项目仍使用上面的显式来源。

```bash
CLIProxyAPI --local-model --config /path/to/config.yaml
```

## 4. 细项说明

「默认值」与台账 `defaults` 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| models.catalog.value | `models.catalog`，通用模型目录来源。 | empty string | 空值在 `--local-model` 下为内置目录，否则为官方远程目录。非空必须是绝对路径，或带主机名的 http(s) URL。Home 模式改为停用，不再读取显式来源。 |
| models.codex-catalog.value | `models.codex-catalog`，Codex 客户端模型目录来源。 | empty string | 空值与显式来源的规则同上。Home 模式不停用这一项。 |
| models.devin-catalog.value | `models.devin-catalog`，Devin 模型目录来源。 | empty string | 空值与显式来源的规则同上。Home 模式改为停用，即使写了显式来源。示例注释没有写明这一点。 |

## 5. 常见错误与边界

相对路径、无法解析的地址、不是 http 或 https，以及 http(s) 地址没有主机名，都会在加载配置时被拒绝。错误文本为 `models.<字段> must be an http(s) URL or an absolute local path`，`<字段>` 是 `catalog`、`codex-catalog` 或 `devin-catalog`。配置因此不能加载。

自定义来源返回非成功 HTTP 状态、文件打不开、内容无效或超过读取大小上限时，这一次刷新失败，并保留上一份有效目录。自定义来源不会改去请求官方地址。来源被标为停用时不会发起读取。

## 6. 相关功能

`--local-model` 的适用启动方式见[命令行参数](/cn/introduction/install)。

## 7. 使用经验

暂无
