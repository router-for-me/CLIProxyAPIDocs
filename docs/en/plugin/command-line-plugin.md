---
title: Command Line Extension
feature_ids:
  - plugin.command-line-plugin.register-command-line
  - plugin.command-line-plugin.execute-command-line
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Command Line Extension

`CommandLinePlugin` declares its own command-line flags and runs when those flags are triggered.

## 1. What this solves

The plugin puts flags into `-help`. When the user passes its flags, it receives the parsed result and can write standard output, standard error, an exit code, and credentials for the host to persist.

## 2. Scope and non-goals

It does not handle HTTP requests. Credential records use `AuthData`. The shape is in [Credential Provider](/plugin/auth-provider). The host persists `Auths`.

## 3. How to configure or call it

Set `capabilities.command_line_plugin` to true.

```go
RegisterCommandLine(context.Context, CommandLineRegistrationRequest) (CommandLineRegistrationResponse, error)
ExecuteCommandLine(context.Context, CommandLineExecutionRequest) (CommandLineExecutionResponse, error)
```

The ABI method names are `command_line.register` and `command_line.execute`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.command-line-plugin.register-command-line | `RegisterCommandLine`, ABI `command_line.register`. |  | The only parameter is plugin `Metadata`. Returns `Flags`. |
| plugin.command-line-plugin.execute-command-line | `ExecuteCommandLine`, ABI `command_line.execute`. |  | Parameter `CommandLineExecutionRequest`. |
| CommandLineFlag.Name | Flag name, without a leading hyphen. |  | Cannot be empty, cannot start with `-`, cannot be `help` or `h`, and cannot contain whitespace or `=`. |
| CommandLineFlag.Usage | Description shown in `-help`. |  | String. |
| CommandLineFlag.Type | Value type. |  | Blank is treated as `bool`. Allowed values are `bool`, `string`, `int`, `int64`, `float64`, and `duration`, case-insensitive. Other types are skipped. |
| CommandLineFlag.DefaultValue | Default text parsed according to the type. |  | When blank, `bool` is `false`, integers and `float64` are `0`, `duration` is `0s`, and `string` stays empty. If it cannot be parsed as the type, the whole flag is skipped. |
| CommandLineExecutionRequest.Plugin | Plugin metadata. |  | `Metadata`. |
| CommandLineExecutionRequest.Program | Program name, argument 0. |  | String. |
| CommandLineExecutionRequest.Args | Every argument after the program name. |  | Includes every flag. |
| CommandLineExecutionRequest.ConfigPath | Configuration path actually used by the host. |  | String. |
| CommandLineExecutionRequest.Host | Host configuration summary. |  | `HostConfigSummary`. |
| CommandLineExecutionRequest.Flags | Every flag currently registered by the host. |  | The key is the flag name. The value is `Name`, `Type`, `Value`, `Set`. |
| CommandLineExecutionRequest.TriggeredFlags | Flags belonging to this plugin that triggered this execution. |  | Same as above. |
| CommandLineFlagValue.Set | Whether the user passed it explicitly. |  | Boolean. |
| CommandLineExecutionResponse.Stdout | Written to standard output after execution. |  | `[]byte`. |
| CommandLineExecutionResponse.Stderr | Written to standard error after execution. |  | `[]byte`. |
| CommandLineExecutionResponse.Auths | Credentials created by the command. |  | The host persists them. Elements are `AuthData`. |
| CommandLineExecutionResponse.ExitCode | Process exit code. |  | A non-zero value is used as the process exit code. |

## 5. Common errors and limits

When a method returns `error`, ABI `ok` is false. When `http_status` is omitted or 0, it is treated as HTTP 500.

An illegal flag name, an unsupported type, a default that cannot be parsed, and a name that collides with an existing flag or with a higher-priority plugin all keep that flag from being registered. A skipped flag does not appear in `TriggeredFlags`.

## 6. Related behavior

Fields of credentials created by a command are in [Credential Provider](/plugin/auth-provider).

## 7. Field experience

None yet.

