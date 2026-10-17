---
title: Thinking applier
feature_ids:
  - plugin.thinking-applier.identifier
  - plugin.thinking-applier.apply-thinking
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Thinking applier

`ThinkingApplier` записывает уже нормализованную конфигурацию мышления в payload провайдера.

## 1. Какую задачу решает этот раздел

После того как хост разобрал режим мышления, плагин по своему ключу provider переписывает поля провайдера в теле.

## 2. Когда применимо и чего здесь нет

Он не разбирает суффикс мышления в запросе пользователя и принимает только уже нормализованный `ThinkingConfig`. Режимы — только четыре канонических значения: `budget`, `level`, `none` и `auto`.

## 3. Как настроить или вызвать

Задайте `capabilities.thinking_applier` равным true.

```go
Identifier() string
ApplyThinking(context.Context, ThinkingApplyRequest) (PayloadResponse, error)
```

Имена методов ABI — `thinking.identifier` и `thinking.apply`. Поле результата идентификатора — `identifier`, и оно должно вернуть ключ provider, который обрабатывает этот applier.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.thinking-applier.identifier | `Identifier`, ABI `thinking.identifier`. |  | Без параметров. Возвращает ключ provider. Ошибка или пустое значение считаются пустой строкой. |
| plugin.thinking-applier.apply-thinking | `ApplyThinking`, ABI `thinking.apply`. |  | Параметр `ThinkingApplyRequest`, возврат `PayloadResponse`. |
| ThinkingApplyRequest.Provider | Применяемый ключ provider. |  | Уже нормализован. |
| ThinkingApplyRequest.Model | Связанная модель. |  | `ModelInfo`. Поля описаны в разделе [Регистратор моделей](/ru/plugin/model-registrar). |
| ThinkingApplyRequest.Config | Разобранная каноническая конфигурация мышления. |  | `Mode`, `Budget`, `Level`. |
| ThinkingApplyRequest.Body | Payload провайдера для переписывания. |  | `[]byte`. |
| ThinkingConfig.Mode | Канонический режим. |  | `budget`, `level`, `none` или `auto`. |
| ThinkingConfig.Budget | Нормализованный бюджет токенов. |  | Целое число. |
| ThinkingConfig.Level | Нормализованный именованный уровень. |  | Строка. |
| PayloadResponse.Body | Payload после записи полей провайдера. |  | `[]byte`. |

## 5. Типичные ошибки и границы

Когда `ApplyThinking` возвращает `error`, ABI `ok` равен false. Если `http_status` опущен или равен 0, он считается HTTP 500.

Пустой идентификатор нельзя сопоставить по provider. `Mode` вне четырёх канонических значений не является входом, который этот интерфейс должен разбирать заново.

## 6. Связанные возможности

Поле возможности мышления `ThinkingSupport` у модели описано в разделе [Регистратор моделей](/ru/plugin/model-registrar).

## 7. Практический опыт

Пока нет.

