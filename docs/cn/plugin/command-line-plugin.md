---
outline: 'deep'
---

# 命令行扩展能力

命令行扩展能力允许插件向 CLIProxyAPI 注册自己的命令行参数，并在这些参数触发时执行插件逻辑。

## 能力字段

```json
{
  "capabilities": {
    "command_line_plugin": true
  }
}
```

源码参考：

- `sdk/pluginapi/types.go`：`CommandLinePlugin`、`CommandLineFlag`、`CommandLineExecutionRequest`、`CommandLineExecutionResponse`
- `sdk/pluginabi/types.go`：`command_line.register`、`command_line.execute`
- `internal/pluginhost/command_line.go`：命令行插件注册和执行

示例参考：

- `examples/plugin/cli/go/main.go`
- `examples/plugin/simple/go/main.go`：`MethodCommandLineRegister`、`MethodCommandLineExecute`

## 方法

| 方法 | 作用 |
| --- | --- |
| `command_line.register` | 声明插件拥有的命令行 flag。 |
| `command_line.execute` | 当插件 flag 触发时执行插件命令。 |

## 注册 flag

```json
{
  "Flags": [
    {
      "Name": "plugin-example-command",
      "Usage": "Run the example C ABI plugin command",
      "Type": "bool",
      "DefaultValue": "false"
    }
  ]
}
```

支持的 `Type`：

- `bool`
- `string`
- `int`
- `int64`
- `float64`
- `duration`

## 执行请求

```json
{
  "Program": "cli-proxy-api",
  "Args": ["--plugin-example-command"],
  "ConfigPath": "config.yaml",
  "Host": {},
  "Flags": {
    "plugin-example-command": {
      "Name": "plugin-example-command",
      "Type": "bool",
      "Value": "true",
      "Set": true
    }
  },
  "TriggeredFlags": {}
}
```

## 执行响应

```json
{
  "Stdout": "base64-stdout",
  "Stderr": "base64-stderr",
  "Auths": [],
  "ExitCode": 0
}
```

`Auths` 可返回命令创建的凭证记录，由宿主持久化。

## 开发注意

- flag 名应稳定且避免与宿主已有参数冲突。
- 命令行插件适合登录、导入凭证或诊断命令，不适合长期运行任务。
- 返回非零 `ExitCode` 会影响进程退出码。
