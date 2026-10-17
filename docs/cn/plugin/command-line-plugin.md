---
title: 命令行扩展
feature_ids:
  - plugin.command-line-plugin.register-command-line
  - plugin.command-line-plugin.execute-command-line
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 命令行扩展

`CommandLinePlugin` 声明自己的命令行旗标，并在这些旗标触发时执行。

## 1. 这段解决什么问题

插件把旗标放进 `-help`，在用户传入自己的旗标时拿到解析结果，并可写出标准输出、标准错误、退出码，以及要由宿主落盘的凭证。

## 2. 适用条件与不做的事

不处理 HTTP 请求。凭证记录用 `AuthData`，形状见 [凭证提供方](/cn/plugin/auth-provider)。宿主负责持久化 `Auths`。

## 3. 怎么配置或怎么调用

`capabilities.command_line_plugin` 设为 true。

```go
RegisterCommandLine(context.Context, CommandLineRegistrationRequest) (CommandLineRegistrationResponse, error)
ExecuteCommandLine(context.Context, CommandLineExecutionRequest) (CommandLineExecutionResponse, error)
```

ABI 方法名是 `command_line.register` 与 `command_line.execute`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| plugin.command-line-plugin.register-command-line | `RegisterCommandLine`，ABI `command_line.register`。 |  | 参数只有插件 `Metadata`。返回 `Flags`。 |
| plugin.command-line-plugin.execute-command-line | `ExecuteCommandLine`，ABI `command_line.execute`。 |  | 参数 `CommandLineExecutionRequest`。 |
| CommandLineFlag.Name | 旗标名，不含前导横线。 |  | 不能为空，不能以 `-` 开头，不能是 `help` 或 `h`，不能含空白或 `=`。 |
| CommandLineFlag.Usage | `-help` 中的说明。 |  | 字符串。 |
| CommandLineFlag.Type | 值类型。 |  | 空白按 `bool`。允许 `bool`、`string`、`int`、`int64`、`float64`、`duration`，不区分大小写。其他类型被跳过。 |
| CommandLineFlag.DefaultValue | 按类型解析的默认文本。 |  | 空白时 `bool` 为 `false`，整数和 `float64` 为 `0`，`duration` 为 `0s`，`string` 保持空。无法按类型解析则整条旗标被跳过。 |
| CommandLineExecutionRequest.Plugin | 插件元数据。 |  | `Metadata`。 |
| CommandLineExecutionRequest.Program | 程序名，即参数 0。 |  | 字符串。 |
| CommandLineExecutionRequest.Args | 程序名之后的全部参数。 |  | 含所有旗标。 |
| CommandLineExecutionRequest.ConfigPath | 宿主实际使用的配置路径。 |  | 字符串。 |
| CommandLineExecutionRequest.Host | 宿主配置摘要。 |  | `HostConfigSummary`。 |
| CommandLineExecutionRequest.Flags | 宿主当前已登记的全部旗标。 |  | 键为旗标名。值为 `Name`、`Type`、`Value`、`Set`。 |
| CommandLineExecutionRequest.TriggeredFlags | 触发本次执行的、属于本插件的旗标。 |  | 同上。 |
| CommandLineFlagValue.Set | 用户是否显式传入。 |  | 布尔。 |
| CommandLineExecutionResponse.Stdout | 执行后写入标准输出。 |  | `[]byte`。 |
| CommandLineExecutionResponse.Stderr | 执行后写入标准错误。 |  | `[]byte`。 |
| CommandLineExecutionResponse.Auths | 命令创建的凭证。 |  | 宿主负责落盘。元素为 `AuthData`。 |
| CommandLineExecutionResponse.ExitCode | 进程退出码。 |  | 非 0 时作为进程退出码。 |

## 5. 常见错误与边界

方法返回 `error` 时 ABI `ok` 为 false。`http_status` 省略或为 0 时按 HTTP 500 处理。

非法旗标名、不支持的类型、无法解析的默认值，以及与已有旗标或更高优先级插件重名，都会使该旗标不被登记。被跳过的旗标不会出现在 `TriggeredFlags`。

## 6. 相关功能

命令创建的凭证字段见 [凭证提供方](/cn/plugin/auth-provider)。

## 7. 使用经验

暂无
