---
outline: 'deep'
---

# Command Line Extension Capability

The command line extension capability lets a plugin register its own CLI flags with CLIProxyAPI and run plugin logic when those flags are triggered.

## Capability Field

```json
{
  "capabilities": {
    "command_line_plugin": true
  }
}
```

Source references:

- `sdk/pluginapi/types.go`: `CommandLinePlugin`, `CommandLineFlag`, `CommandLineExecutionRequest`, `CommandLineExecutionResponse`
- `sdk/pluginabi/types.go`: `command_line.register`, `command_line.execute`
- `internal/pluginhost/command_line.go`: command line plugin registration and execution

Example references:

- `examples/plugin/cli/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodCommandLineRegister`, `MethodCommandLineExecute`

## Methods

| Method | Purpose |
| --- | --- |
| `command_line.register` | Declares CLI flags owned by the plugin. |
| `command_line.execute` | Runs the plugin command when one of its flags is triggered. |

## Registering Flags

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

Supported `Type` values:

- `bool`
- `string`
- `int`
- `int64`
- `float64`
- `duration`

## Execution Request

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

## Execution Response

```json
{
  "Stdout": "base64-stdout",
  "Stderr": "base64-stderr",
  "Auths": [],
  "ExitCode": 0
}
```

`Auths` can return credential records created by the command, and the host persists them.

## Development Notes

- Flag names should be stable and avoid collisions with existing host flags.
- Command line plugins are suitable for login, credential import, or diagnostics, not long-running tasks.
- A non-zero `ExitCode` affects the process exit code.

