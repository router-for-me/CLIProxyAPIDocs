---
outline: 'deep'
---

# Возможность провайдера моделей

Возможность провайдера моделей предоставляет статические модели и динамически обнаруживает модели для конкретной записи учётных данных. Она лучше, чем registrar моделей, подходит для OAuth, файловых учётных данных или плагинов, которым нужен доступ к upstream-списку моделей.

## Поле возможности

```json
{
  "capabilities": {
    "model_provider": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `ModelProvider`, `StaticModelRequest`, `AuthModelRequest`, `ModelResponse`
- `sdk/pluginabi/types.go`: `model.static`, `model.for_auth`
- `internal/pluginhost/adapters.go`: `RegisterModels`, `ModelsForAuth`

Примеры:

- `examples/plugin/model/go/main.go`
- `examples/plugin/simple/go/main.go`: `MethodModelStatic`, `MethodModelForAuth`

## Методы

| Метод | Назначение |
| --- | --- |
| `model.static` | Возвращает статический список моделей, не зависящий от конкретных учётных данных. |
| `model.for_auth` | Возвращает список моделей для записи учётных данных и может одновременно вернуть обновление учётных данных. |

## Запрос статических моделей

`model.static` получает `StaticModelRequest`:

```json
{
  "Plugin": {},
  "Host": {
    "AuthDir": "~/.cli-proxy-api",
    "ProxyURL": "",
    "ForceModelPrefix": false
  }
}
```

## Обнаружение моделей по учётным данным

`model.for_auth` получает `AuthModelRequest`:

```json
{
  "AuthID": "auth-1",
  "AuthProvider": "plugin-example",
  "StorageJSON": "base64-json",
  "Metadata": {},
  "Attributes": {},
  "Host": {}
}
```

Если плагину нужно обратиться к upstream API моделей, используйте мост `host.http.*`, соответствующий HTTP-клиенту хоста из запроса. Так proxy, транспортная политика и логирование запросов остаются под управлением хоста.

## Ответ

`model.static` и `model.for_auth` возвращают `ModelResponse`:

```json
{
  "Provider": "plugin-example",
  "Models": [
    {
      "ID": "plugin-example-model",
      "Object": "model",
      "OwnedBy": "plugin-example",
      "DisplayName": "Plugin Example Model",
      "SupportedGenerationMethods": ["chat"],
      "ContextLength": 8192,
      "MaxCompletionTokens": 1024,
      "UserDefined": true
    }
  ],
  "AuthUpdate": {}
}
```

`AuthUpdate` может обновлять данные учётных данных во время обнаружения моделей, например информацию аккаунта, project ID или время следующего обновления, возвращённые upstream.

## Связь с executor

Если плагин также объявляет [возможность исполнителя](./executor), `executor_model_scope` управляет путём регистрации провайдера моделей:

- `static`: регистрирует только статические модели.
- `oauth`: обрабатывает только модели, найденные по учётным данным.
- `both` или пустое значение: поддерживает оба типа моделей.

## Замечания по разработке

- `model.for_auth` должен обрабатывать только распознанных им провайдеров учётных данных.
- Если `Provider` пустой, хост попытается использовать provider текущих учётных данных.
- Ошибка динамического обнаружения заставит хост считать обнаружение моделей для этих учётных данных обработанным, но неуспешным.

