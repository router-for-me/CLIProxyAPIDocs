---
outline: 'deep'
---

# Возможность расширения командной строки

Возможность расширения командной строки позволяет плагину регистрировать собственные CLI-флаги в CLIProxyAPI и выполнять логику плагина при срабатывании этих флагов.

## Поле возможности

```json
{
  "capabilities": {
    "command_line_plugin": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `CommandLinePlugin`, `CommandLineFlag`, `CommandLineExecutionRequest`, `CommandLineExecutionResponse`
- `sdk/pluginabi/types.go`: `command_line.register`, `command_line.execute`
- `internal/pluginhost/command_line.go`: регистрация и выполнение command line plugin

Примеры:

- `examples/plugin/cli/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodCommandLineRegister`, `MethodCommandLineExecute`

## Методы

| Метод | Назначение |
| --- | --- |
| `command_line.register` | Объявляет CLI-флаги, принадлежащие плагину. |
| `command_line.execute` | Выполняет команду плагина, когда срабатывает его флаг. |

## Регистрация flag

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

Поддерживаемые значения `Type`:

- `bool`
- `string`
- `int`
- `int64`
- `float64`
- `duration`

## Запрос выполнения

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

## Ответ выполнения

```json
{
  "Stdout": "base64-stdout",
  "Stderr": "base64-stderr",
  "Auths": [],
  "ExitCode": 0
}
```

`Auths` может вернуть записи учётных данных, созданные командой; хост сохранит их.

## Замечания по разработке

- Имена flag должны быть стабильными и не конфликтовать с существующими параметрами хоста.
- Command line plugin подходит для входа, импорта учётных данных или диагностики, но не для долгоживущих задач.
- Ненулевой `ExitCode` влияет на код выхода процесса.

