---
title: Регистратор моделей
feature_ids:
  - plugin.model-registrar.register-models
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Регистратор моделей

`ModelRegistrar` при регистрации передаёт набор метаданных моделей этапа разработки.

## 1. Какую задачу решает этот раздел

Одним вызовом плагин объявляет свой ключ provider и полный список моделей, чтобы хост зарегистрировал эти модели.

## 2. Когда применимо и чего здесь нет

Есть только `RegisterModels`. Он не обнаруживает модели по одной учётной записи. Это `ModelsForAuth` в разделе [Провайдер моделей](/ru/plugin/model-provider). Запросы он тоже не выполняет.

Метаданные регистрации `Name`, `Version`, `Author` и `GitHubRepository` не могут быть пустыми. Переключатель загрузки описан в разделе [Загрузка плагинов и магазин](/ru/operations/plugins).

## 3. Как настроить или вызвать

Задайте `capabilities.model_registrar` равным true. Текущая версия контракта — 6.

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-models",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-models"
    },
    "capabilities": {
      "model_registrar": true
    }
  }
}
```

```go
RegisterModels(context.Context, ModelRegistrationRequest) (ModelRegistrationResponse, error)
```

Имя метода ABI — `model.register`. Поля без тега `json` используют экспортируемое имя Go.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.model-registrar.register-models | `RegisterModels`, ABI `model.register`. |  | Параметр `ModelRegistrationRequest`, возврат `ModelRegistrationResponse`. |
| ModelRegistrationRequest.Plugin | Метаданные регистрируемого плагина. |  | `Metadata`: `Name`, `Version`, `Author`, `GitHubRepository`, `Logo`, `ConfigFields`. |
| ModelRegistrationResponse.Provider | Ключ provider этого набора моделей. |  | Строка. |
| ModelRegistrationResponse.Models | Полный набор моделей, который даёт плагин. |  | `[]ModelInfo`. |
| ModelInfo.ID | Стабильный ID модели, используемый в запросах. |  | Строка. |
| ModelInfo.Object | Тип объекта API, обычно `model`. |  | Строка. |
| ModelInfo.Created | Время создания метаданных. |  | Секунды Unix, `int64`. |
| ModelInfo.OwnedBy | Владелец или провайдер. |  | Строка. |
| ModelInfo.Type | Классификация семейства возможностей. |  | Строка. |
| ModelInfo.DisplayName | Отображаемое имя. |  | Строка. |
| ModelInfo.Name | Собственное имя модели провайдера. |  | Строка. |
| ModelInfo.Version | Редакция. Может быть пустой. |  | Строка. |
| ModelInfo.Description | Краткое описание. |  | Строка. |
| ModelInfo.InputTokenLimit | Максимум принимаемых входных токенов. |  | `int64`. |
| ModelInfo.OutputTokenLimit | Максимум выходных токенов. |  | `int64`. |
| ModelInfo.SupportedGenerationMethods | Имена поддерживаемых методов генерации. |  | `[]string`. |
| ModelInfo.ContextLength | Верхняя граница полной длины контекста. |  | `int64`. |
| ModelInfo.MaxCompletionTokens | Максимум токенов дополнения. |  | `int64`. |
| ModelInfo.SupportedParameters | Имена поддерживаемых параметров запроса. |  | `[]string`. |
| ModelInfo.SupportedInputModalities | Входные модальности. |  | `[]string`. |
| ModelInfo.SupportedOutputModalities | Выходные модальности. |  | `[]string`. |
| ModelInfo.Thinking | Необязательный бюджет рассуждения. |  | `ThinkingSupport`: `Min`, `Max`, `ZeroAllowed`, `DynamicAllowed`, `Levels`. |
| ModelInfo.UserDefined | Пришло ли из конфигурации пользователя. |  | Логическое значение. |

## 5. Типичные ошибки и границы

Когда метод возвращает `error`, конверт ABI `ok` равен false. `error.code` и `error.message` обязательны. Если `http_status` опущен или равен 0, он считается HTTP 500.

`Models` означает полный набор, а не добавочную заплатку.

## 6. Связанные возможности

Обнаружение моделей по учётным данным описано в разделе [Провайдер моделей](/ru/plugin/model-provider). Фактическая отправка запроса — в разделе [Исполнитель](/ru/plugin/executor).

## 7. Практический опыт

Пока нет.

