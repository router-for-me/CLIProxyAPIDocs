---
outline: 'deep'
---

# Возможность регистратора моделей

Возможность регистратора моделей регистрирует статические метаданные моделей, предоставленные плагином, в реестре моделей CLIProxyAPI. Она подходит для плагинов с фиксированным набором моделей, которым не нужно динамическое обнаружение по учётным данным.

## Поле возможности

Объявляется в результате регистрации `plugin.register` или `plugin.reconfigure`:

```json
{
  "capabilities": {
    "model_registrar": true
  }
}
```

Исходный код:

- `sdk/pluginapi/types.go`: `ModelRegistrar`, `ModelRegistrationRequest`, `ModelRegistrationResponse`, `ModelInfo`
- `sdk/pluginabi/types.go`: `model.register`
- `internal/pluginhost/adapters.go`: `RegisterModels`, `callModelRegistrar`

Пример:

- `examples/plugin/simple/go/main.go`: `MethodModelRegister`

## Время вызова

После загрузки или перенастройки плагина хост вызывает `model.register` на этапе регистрации моделей. Возвращённые модели попадают в список моделей и процесс сопоставления маршрутов.

Если тот же плагин также объявляет [возможность исполнителя](./executor), эти модели связываются с executor этого плагина. Если executor нет, хост регистрирует их как обычные model clients, предоставленные плагином.

## Запрос

Запрос `model.register` соответствует `ModelRegistrationRequest`:

```json
{
  "Plugin": {
    "Name": "example",
    "Version": "0.1.0",
    "Author": "router-for-me"
  }
}
```

`Plugin` — метаданные текущего плагина, по которым плагин может решить, какие модели возвращать для своей версии или конфигурации.

## Ответ

Верните `ModelRegistrationResponse`:

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
  ]
}
```

Ключевые моменты:

- `Provider` должен быть стабильным идентификатором провайдера.
- `Models` должен быть полным набором моделей, а не дельтой.
- `ID` — имя модели, используемое клиентскими запросами.
- `Thinking` может объявлять диапазон thinking, поддерживаемый моделью, для проверки thinking-конфигурации и последующей [возможности Thinking applier](./thinking-applier).

## Замечания по разработке

- Не возвращайте пустой `Provider` или пустой ID модели; хост пропускает невалидные модели.
- Registrar моделей отвечает только за статические модели. Если модели нужно динамически обнаруживать для каждого OAuth или файловых учётных данных, используйте [возможность провайдера моделей](./model-provider).
- Если модель должна обрабатываться только executor плагина, одновременно объявите возможность executor и задайте подходящий `executor_model_scope`.

