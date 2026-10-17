---
title: Расширение командной строки
feature_ids:
  - plugin.command-line-plugin.register-command-line
  - plugin.command-line-plugin.execute-command-line
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Расширение командной строки

`CommandLinePlugin` объявляет собственные флаги командной строки и выполняется, когда эти флаги срабатывают.

## 1. Какую задачу решает этот раздел

Плагин помещает флаги в `-help`. Когда пользователь передаёт его флаги, он получает результат разбора и может записать стандартный вывод, стандартную ошибку, код выхода и учётные данные, которые хост должен сохранить.

## 2. Когда применимо и чего здесь нет

HTTP-запросы он не обрабатывает. Записи учётных данных используют `AuthData`. Форма описана в разделе [Провайдер учётных данных](/ru/plugin/auth-provider). Хост сохраняет `Auths`.

## 3. Как настроить или вызвать

Задайте `capabilities.command_line_plugin` равным true.

```go
RegisterCommandLine(context.Context, CommandLineRegistrationRequest) (CommandLineRegistrationResponse, error)
ExecuteCommandLine(context.Context, CommandLineExecutionRequest) (CommandLineExecutionResponse, error)
```

Имена методов ABI — `command_line.register` и `command_line.execute`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.command-line-plugin.register-command-line | `RegisterCommandLine`, ABI `command_line.register`. |  | Единственный параметр — `Metadata` плагина. Возвращает `Flags`. |
| plugin.command-line-plugin.execute-command-line | `ExecuteCommandLine`, ABI `command_line.execute`. |  | Параметр `CommandLineExecutionRequest`. |
| CommandLineFlag.Name | Имя флага без ведущего дефиса. |  | Не может быть пустым, не может начинаться с `-`, не может быть `help` или `h` и не может содержать пробел или `=`. |
| CommandLineFlag.Usage | Описание в `-help`. |  | Строка. |
| CommandLineFlag.Type | Тип значения. |  | Пустое значение считается `bool`. Разрешены `bool`, `string`, `int`, `int64`, `float64`, `duration`, без учёта регистра. Другие типы пропускаются. |
| CommandLineFlag.DefaultValue | Текст значения по умолчанию, разбираемый по типу. |  | Если пусто, `bool` равен `false`, целые и `float64` равны `0`, `duration` равен `0s`, `string` остаётся пустой. Если разобрать по типу нельзя, весь флаг пропускается. |
| CommandLineExecutionRequest.Plugin | Метаданные плагина. |  | `Metadata`. |
| CommandLineExecutionRequest.Program | Имя программы, аргумент 0. |  | Строка. |
| CommandLineExecutionRequest.Args | Все аргументы после имени программы. |  | Включая все флаги. |
| CommandLineExecutionRequest.ConfigPath | Путь конфигурации, который фактически использует хост. |  | Строка. |
| CommandLineExecutionRequest.Host | Сводка конфигурации хоста. |  | `HostConfigSummary`. |
| CommandLineExecutionRequest.Flags | Все флаги, зарегистрированные хостом сейчас. |  | Ключ — имя флага. Значение — `Name`, `Type`, `Value`, `Set`. |
| CommandLineExecutionRequest.TriggeredFlags | Флаги этого плагина, которые вызвали это выполнение. |  | То же, что выше. |
| CommandLineFlagValue.Set | Передал ли его пользователь явно. |  | Логическое значение. |
| CommandLineExecutionResponse.Stdout | После выполнения пишется в стандартный вывод. |  | `[]byte`. |
| CommandLineExecutionResponse.Stderr | После выполнения пишется в стандартную ошибку. |  | `[]byte`. |
| CommandLineExecutionResponse.Auths | Учётные данные, созданные командой. |  | Хост отвечает за сохранение. Элементы — `AuthData`. |
| CommandLineExecutionResponse.ExitCode | Код выхода процесса. |  | Ненулевое значение используется как код выхода процесса. |

## 5. Типичные ошибки и границы

Когда метод возвращает `error`, ABI `ok` равен false. Если `http_status` опущен или равен 0, он считается HTTP 500.

Недопустимое имя флага, неподдерживаемый тип, неразбираемое значение по умолчанию и совпадение имени с уже существующим флагом или с плагином более высокого приоритета не дают зарегистрировать этот флаг. Пропущенный флаг не появляется в `TriggeredFlags`.

## 6. Связанные возможности

Поля учётных данных, созданных командой, описаны в разделе [Провайдер учётных данных](/ru/plugin/auth-provider).

## 7. Практический опыт

Пока нет.

