---
title: Маршрутизатор моделей
feature_ids:
  - plugin.model-router.route-model
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Маршрутизатор моделей

`ModelRouter` решает, кто выполнит запрос, до разбора модели в провайдера и до выбора учётных данных.

## 1. Какую задачу решает этот раздел

Плагин может назначить целью этого запроса свой исполнитель, исполнитель другого плагина или уже существующий встроенный провайдер.

## 2. Когда применимо и чего здесь нет

Есть только `RouteModel`. Он не заменяет сам исполнитель. Если цель — `self`, у этого плагина всё равно должен быть [Исполнитель](/ru/plugin/executor). Он также не выбирает ID из кандидатов учётных данных. Это [Планировщик](/ru/plugin/scheduler).

## 3. Как настроить или вызвать

Задайте `capabilities.model_router` равным true.

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-router",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-router"
    },
    "capabilities": {
      "model_router": true
    }
  }
}
```

```go
RouteModel(context.Context, ModelRouteRequest) (ModelRouteResponse, error)
```

Имя метода ABI — `model.route`. Когда `Handled` равен true, `TargetKind` должен быть `self`, `executor` или `provider`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.model-router.route-model | `RouteModel`, ABI `model.route`. |  | Параметр `ModelRouteRequest`, возврат `ModelRouteResponse`. |
| ModelRouteRequest.Plugin | Метаданные плагина. |  | `Metadata`. |
| ModelRouteRequest.PluginID | Локальный для хоста ID плагина. |  | Строка. |
| ModelRouteRequest.SourceFormat | Исходный протокол клиента. |  | Строка. |
| ModelRouteRequest.RequestedModel | Модель клиента до выбора провайдера и учётных данных. |  | Строка. |
| ModelRouteRequest.Stream | Ожидается ли потоковый вывод. |  | Логическое значение. |
| ModelRouteRequest.Headers | Входящие заголовки. |  | `http.Header`. |
| ModelRouteRequest.Query | Параметры запроса. |  | `url.Values`. |
| ModelRouteRequest.Body | Исходное тело клиента. |  | `[]byte`, в JSON это base64. |
| ModelRouteRequest.Metadata | Снимок контекста. |  | Только для чтения, понимается как значения JSON. |
| ModelRouteRequest.AvailableProviders | Ключи встроенных provider, у которых сейчас есть зарегистрированные учётные данные. |  | Только для чтения. При `TargetKind` равном `provider` цель можно выбрать отсюда. |
| ModelRouteResponse.Handled | Принято ли решение о маршруте. |  | При false не применяется. |
| ModelRouteResponse.TargetKind | Вид цели. |  | `self`, `executor`, `provider`. Другие значения недействительны. |
| ModelRouteResponse.Target | Цель. |  | Для `executor` это ID плагина. Для `provider` это ключ provider, пустое значение недействительно. `self` использует ID текущего плагина маршрутизатора. |
| ModelRouteResponse.TargetModel | Имя модели на пути провайдера. |  | Имеет смысл только для `provider`. Пустое значение сохраняет модель, запрошенную клиентом. |
| ModelRouteResponse.Reason | Необязательная диагностическая причина. |  | Строка. |

## 5. Типичные ошибки и границы

Когда метод возвращает `error`, эта попытка маршрутизации завершается ошибкой. Если ABI `http_status` опущен или равен 0, он считается HTTP 500.

`Handled` равный true при виде не из трёх, или пустой `Target` для `executor` либо `provider`, не является действительным решением. У ключа цели `provider` снимаются крайние пробелы, и он переводится в нижний регистр.

## 6. Связанные возможности

Выполнение описано в разделе [Исполнитель](/ru/plugin/executor). Выбор учётных данных — в разделе [Планировщик](/ru/plugin/scheduler).

## 7. Практический опыт

Пока нет.

