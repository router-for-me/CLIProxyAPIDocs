---
outline: 'deep'
---

# Возможность провайдера учётных данных

Возможность провайдера учётных данных позволяет плагину участвовать в разборе файлов учётных данных, входе, опросе статуса и обновлении. Она подходит для добавления upstream-провайдера, которому нужны OAuth, коды устройства, файлы API Key или пользовательские JSON-учётные данные.

## Поле возможности

```json
{
  "capabilities": {
    "auth_provider": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `AuthProvider`, `AuthData`, `AuthParseRequest`, `AuthLoginStartRequest`, `AuthLoginPollRequest`, `AuthRefreshRequest`
- `sdk/pluginabi/types.go`: `auth.identifier`, `auth.parse`, `auth.login.start`, `auth.login.poll`, `auth.refresh`
- `internal/pluginhost/adapters.go`: разбор учётных данных, обновление и мост к HTTP-клиенту хоста

Примеры:

- `examples/plugin/auth/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodAuthIdentifier`, `MethodAuthParse`, `MethodAuthLoginStart`, `MethodAuthLoginPoll`, `MethodAuthRefresh`

## Методы

| Метод | Назначение |
| --- | --- |
| `auth.identifier` | Возвращает идентификатор provider, за который отвечает плагин. |
| `auth.parse` | Пытается разобрать JSON учётных данных, найденный хостом. |
| `auth.login.start` | Начинает вход и возвращает URL, который должен открыть пользователь, и состояние опроса. |
| `auth.login.poll` | Опрос входа; при успехе возвращает `AuthData`. |
| `auth.refresh` | Обновляет существующие учётные данные и возвращает обновлённые данные и время следующего обновления. |

## AuthData

`AuthData` — основная структура обмена учётными данными между плагином и хостом:

```json
{
  "Provider": "plugin-example",
  "ID": "plugin-example-auth",
  "FileName": "plugin-example.json",
  "Label": "Plugin Example",
  "Prefix": "",
  "ProxyURL": "",
  "Disabled": false,
  "StorageJSON": "base64-json",
  "Metadata": {},
  "Attributes": {},
  "NextRefreshAfter": "2026-06-15T12:00:00Z"
}
```

Назначение полей:

- `StorageJSON` — постоянное содержимое учётных данных, которым владеет плагин.
- `Metadata` — изменяемые метаданные, которыми управляет хост.
- `Attributes` — неизменяемые атрибуты, связанные с маршрутизацией и провайдером.
- `NextRefreshAfter` задаёт время следующего активного обновления хостом.

## Процесс входа

`auth.login.start` возвращает:

```json
{
  "Provider": "plugin-example",
  "URL": "https://example.com/login",
  "State": "opaque-state",
  "ExpiresAt": "2026-06-15T12:05:00Z",
  "Metadata": {}
}
```

`auth.login.poll` возвращает статус:

```json
{
  "Status": "pending",
  "Message": "waiting for user confirmation"
}
```

При успешном входе `Status` равен `success`, а `Auth` заполнен.

## Замечания по разработке

- `auth.parse` должен явно указывать через `Handled`, распознал ли он файл учётных данных.
- Когда плагину нужно обратиться к upstream endpoint для входа или обновления, используйте HTTP-мост хоста, чтобы не обходить proxy и политику логирования.
- Не пишите в логи `StorageJSON`, access token, refresh token или исходные пользовательские учётные данные.
- Если плагин также предоставляет обнаружение моделей, обычно он работает вместе с [возможностью провайдера моделей](./model-provider).

