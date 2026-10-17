---
title: Провайдер моделей
feature_ids:
  - plugin.model-provider.static-models
  - plugin.model-provider.models-for-auth
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Провайдер моделей

`ModelProvider` предоставляет статические модели и модели, обнаруженные по одной учётной записи.

## 1. Какую задачу решает этот раздел

Статический список не зависит от учётных данных входа. `ModelsForAuth` использует эти учётные данные, чтобы запросить модели у провайдера, и может заодно вернуть обновлённые учётные данные.

## 2. Когда применимо и чего здесь нет

Нужно реализовать оба метода. Разовая регистрация на этапе разработки — это [Регистратор моделей](/ru/plugin/model-registrar), а не этот интерфейс. Этот интерфейс не выполняет запросы чата.

Если у того же плагина есть исполнитель, `executor_model_scope` решает, какая сторона доступна для статических моделей и моделей учётных данных OAuth: `static`, `oauth` или `both`. Пустое значение считается `both`. Это поле относится к регистрации исполнителя. См. [Исполнитель](/ru/plugin/executor).

## 3. Как настроить или вызвать

Задайте `capabilities.model_provider` равным true.

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-model-provider",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-model-provider"
    },
    "capabilities": {
      "model_provider": true
    }
  }
}
```

```go
StaticModels(context.Context, StaticModelRequest) (ModelResponse, error)
ModelsForAuth(context.Context, AuthModelRequest) (ModelResponse, error)
```

Имена методов ABI — `model.static` и `model.for_auth`. Поля без тега используют экспортируемое имя Go. `[]byte` — это base64.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.model-provider.static-models | `StaticModels`, ABI `model.static`. |  | Параметр `StaticModelRequest`, возврат `ModelResponse`. |
| plugin.model-provider.models-for-auth | `ModelsForAuth`, ABI `model.for_auth`. |  | Параметр `AuthModelRequest`, возврат `ModelResponse`. |
| StaticModelRequest.Plugin | Метаданные плагина. |  | `Metadata`. |
| StaticModelRequest.Host | Сводка конфигурации хоста. |  | `AuthDir`, `ProxyURL`, `ForceModelPrefix`, `OAuthModelAlias`, `ExcludedModels`. |
| AuthModelRequest.Plugin | Метаданные плагина. |  | `Metadata`. |
| AuthModelRequest.AuthID | ID учётных данных для обнаружения. |  | Строка. |
| AuthModelRequest.AuthProvider | Провайдер учётных данных. |  | Строка. |
| AuthModelRequest.StorageJSON | Сохранённые данные плагина. |  | `[]byte`. |
| AuthModelRequest.Metadata | Метаданные, которые хост может менять. |  | `map[string]any`. |
| AuthModelRequest.Attributes | Неизменяемые атрибуты. |  | `map[string]string`. |
| AuthModelRequest.Host | Сводка конфигурации хоста. |  | `HostConfigSummary`. |
| AuthModelRequest.HTTPClient | HTTP-клиент хоста. |  | JSON игнорирует. См. [Callback хоста](/ru/plugin/host-callbacks). |
| ModelResponse.Provider | Provider, которому принадлежат модели. |  | Строка. |
| ModelResponse.Models | Полный обнаруженный набор моделей. |  | `[]ModelInfo`. Поля те же, что `ModelInfo` в разделе [Регистратор моделей](/ru/plugin/model-registrar). |
| ModelResponse.AuthUpdate | Учётные данные, которые обнаружение должно записать обратно. |  | `AuthData`. Оставьте пустым, если обновление не нужно. |

## 5. Типичные ошибки и границы

Когда возвращается `error`, ABI `ok` равен false. Если `http_status` опущен или равен 0, он считается HTTP 500.

`Models` — полный набор. `HTTPClient` не входит в JSON.

## 6. Связанные возможности

Разовая регистрация описана в разделе [Регистратор моделей](/ru/plugin/model-registrar). Форма учётных данных — в разделе [Провайдер учётных данных](/ru/plugin/auth-provider).

## 7. Практический опыт

Пока нет.

