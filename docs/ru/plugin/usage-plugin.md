---
title: Наблюдение за использованием
feature_ids:
  - plugin.usage-plugin.handle-usage
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Наблюдение за использованием

`UsagePlugin` после завершения запроса получает одну запись использования.

## 1. Какую задачу решает этот раздел

Плагин получает модель, учётные данные, задержку, сведения об ошибке и счётчики токенов этого выполнения для собственной статистики.

## 2. Когда применимо и чего здесь нет

У `HandleUsage` нет возвращаемого `error`, поэтому запись нельзя отклонить возвратом ошибки. Он также не переписывает уже созданный ответ. Уведомление о конечном состоянии — это [Жизненный цикл запроса](/ru/plugin/request-lifecycle), другой интерфейс.

## 3. Как настроить или вызвать

Задайте `capabilities.usage_plugin` равным true.

```go
HandleUsage(context.Context, UsageRecord)
```

Имя метода ABI — `usage.handle`. Поля без тега используют экспортируемое имя Go. `time.Time` — RFC3339. `time.Duration` — целое число наносекунд.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.usage-plugin.handle-usage | `HandleUsage`, ABI `usage.handle`. |  | Параметр `UsageRecord`. Возвращаемого значения нет. |
| UsageRecord.RequestID | ID этого выполнения модели. |  | Строка UUID v4. |
| UsageRecord.TraceID | ID трассировки входящего HTTP. |  | 8 шестнадцатеричных знаков. Может быть пустым. |
| UsageRecord.Provider | Провайдер upstream. |  | Строка. |
| UsageRecord.BaseURL | Базовый адрес upstream у этого запроса или учётных данных. |  | Может быть пустым. |
| UsageRecord.ExecutorType | Имя реализации исполнителя. |  | Строка. |
| UsageRecord.Model | Фактически использованная модель. |  | Строка. |
| UsageRecord.Alias | Псевдоним на стороне пользователя. |  | Может быть пустым, если псевдоним не использовался. |
| UsageRecord.APIKey | Идентификатор ключа клиента. |  | Может быть пустым. Это не поле, гарантирующее исходный ключ. Понимайте его как идентификатор, который дал хост. |
| UsageRecord.IsNativeKey | Аутентифицирован ли провайдер собственной конфигурацией этого прокси. |  | Логическое значение. |
| UsageRecord.AccessProvider | Провайдер аутентификации клиента. |  | Например `config-inline` или ID плагина. |
| UsageRecord.SessionID | ID сеанса. |  | Может быть пустым. |
| UsageRecord.ParentSessionID | ID родительского сеанса. |  | Может быть пустым. |
| UsageRecord.AuthID | ID выбранных учётных данных. |  | Строка. |
| UsageRecord.AuthIndex | Индекс учётных данных. |  | Может быть пустым. |
| UsageRecord.AuthType | Тип учётных данных. |  | Строка. |
| UsageRecord.Source | Источник запроса. |  | Строка. |
| UsageRecord.ReasoningEffort | Запрошенная сила рассуждения. |  | Строка. |
| UsageRecord.ServiceTier | Запрошенный или сообщённый уровень обслуживания. |  | Строка. |
| UsageRecord.ResponseServiceTier | Итоговый уровень в ответе upstream. |  | Строка. |
| UsageRecord.ResponseModel | Имя модели в ответе upstream. |  | Пусто, если неизвестно. |
| UsageRecord.Generate | Просил ли клиент фактическую генерацию. |  | Хост до доставки нормализует опущенное значение в true. |
| UsageRecord.Stream | Было ли выполнение потоковым. |  | Логическое значение. |
| UsageRecord.RequestedAt | Время получения запроса. |  | `time.Time`. |
| UsageRecord.Latency | Полная задержка. |  | `time.Duration`. |
| UsageRecord.TTFT | Время до первого токена потока. |  | `time.Duration`. |
| UsageRecord.Failed | Была ли ошибка. |  | Логическое значение. |
| UsageRecord.Failure | Подробности ошибки. |  | `StatusCode` и `Body`. |
| UsageRecord.Detail | Счётчики токенов. |  | См. поля счётчиков ниже. Тип каждого — `int64`. |
| UsageRecord.ResponseHeaders | Выбранные заголовки ответа upstream. |  | `http.Header`. |
| UsageDetail.InputTokens | Входные токены. |  | `int64`. |
| UsageDetail.OutputTokens | Выходные токены. |  | `int64`. |
| UsageDetail.ReasoningTokens | Токены рассуждения. |  | `int64`. |
| UsageDetail.CachedTokens | Сумма кэшированных токенов. |  | `int64`. |
| UsageDetail.CacheReadTokens | Чтение кэша. |  | `int64`. |
| UsageDetail.CacheCreationTokens | Создание кэша. |  | `int64`. |
| UsageDetail.TotalTokens | Итого. |  | `int64`. |

## 5. Типичные ошибки и границы

У этого метода нет возврата ошибки. Конверт ошибки ABI не используется, чтобы отклонить запись использования. Если `Generate` опущен, до плагина он уже true. Тело ошибки находится в `Failure.Body`, код состояния — в `Failure.StatusCode`.

## 6. Связанные возможности

Конечное состояние описано в разделе [Жизненный цикл запроса](/ru/plugin/request-lifecycle).

## 7. Практический опыт

Пока нет.

