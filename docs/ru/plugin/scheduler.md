---
title: Планировщик
feature_ids:
  - plugin.scheduler.pick
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Планировщик

`Scheduler` делает один выбор из кандидатов учётных данных до встроенного планировщика.

## 1. Какую задачу решает этот раздел

Плагин может указать один `AuthID`, вернуть выбор встроенным `round-robin` или `fill-first` либо явно отклонить кандидатов этого круга.

## 2. Когда применимо и чего здесь нет

Есть только `Pick`. Он не выполняет вход и не обновляет учётные данные. Он также не переписывает маршрут от модели к исполнителю. Это [Маршрутизатор моделей](/ru/plugin/model-router).

Когда `SchedulerAcrossPriorities` равен false, `Candidates` содержит только доступные учётные данные текущего самого высокого уровня приоритета. При true он содержит все уровни приоритета. Это логическое значение регистрации `scheduler_across_priorities`, а не метод этого интерфейса.

## 3. Как настроить или вызвать

Задайте `capabilities.scheduler` равным true.

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-scheduler",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-scheduler"
    },
    "capabilities": {
      "scheduler": true
    }
  }
}
```

```go
Pick(context.Context, SchedulerPickRequest) (SchedulerPickResponse, error)
```

Имя метода ABI — `scheduler.pick`. JSON `SchedulerPickResponse` принимает и экспортируемое имя Go, и змеиное имя: `AuthID` или `auth_id`, `DelegateBuiltin` или `delegate_builtin`, `Handled` или `handled`, `Reject` или `reject`, `RejectReason` или `reject_reason`, `RejectCode` или `reject_code`. Для одного поля экспортируемое имя Go идёт первым.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| plugin.scheduler.pick | `Pick`, ABI `scheduler.pick`. |  | Параметр `SchedulerPickRequest`, возврат `SchedulerPickResponse`. |
| SchedulerPickRequest.Plugin | Метаданные плагина. |  | `Metadata`. |
| SchedulerPickRequest.Provider | Основной provider маршрутизированного запроса. |  | Строка. |
| SchedulerPickRequest.Providers | Все provider, которые принимает этот маршрут. |  | `[]string`. |
| SchedulerPickRequest.Model | Запрошенный ID модели. |  | Строка. |
| SchedulerPickRequest.Stream | Ожидается ли потоковый вывод. |  | Логическое значение. |
| SchedulerPickRequest.Options | Вход планирования уровня запроса. |  | `Headers` — `map[string][]string`. `Metadata` — `map[string]any`. |
| SchedulerPickRequest.Candidates | Учётные данные, из которых можно выбрать. |  | См. поля кандидата ниже. Без пересечения приоритетов включён только самый высокий уровень. |
| SchedulerAuthCandidate.ID | ID учётных данных. |  | Выбранный `AuthID` должен равняться ID какого-либо кандидата. |
| SchedulerAuthCandidate.Provider | Провайдер учётных данных. |  | Строка. |
| SchedulerAuthCandidate.Priority | Приоритет хоста. |  | Целое число. |
| SchedulerAuthCandidate.Status | Состояние, видимое хосту. |  | Строка. |
| SchedulerAuthCandidate.Attributes | Неизменяемые атрибуты. |  | `map[string]string`. |
| SchedulerAuthCandidate.Metadata | Метаданные, которые хост может менять. |  | `map[string]any`. |
| SchedulerPickResponse.AuthID | ID выбранных учётных данных. |  | Должен присутствовать в `Candidates`. |
| SchedulerPickResponse.DelegateBuiltin | Имя встроенного планировщика, которому передаётся выбор. |  | Может быть только `round-robin` или `fill-first`. |
| SchedulerPickResponse.Handled | Принял ли плагин решение планирования. |  | При false этот результат не применяется. |
| SchedulerPickResponse.Reject | Явно ли отклонён выбор. |  | Когда это и `Handled` оба true, выбор заканчивается и возвращается ошибка, без отката к встроенному планировщику. |
| SchedulerPickResponse.RejectReason | Причина отказа. |  | Если пусто, используется `scheduler rejected candidate selection`. |
| SchedulerPickResponse.RejectCode | Код ошибки отказа. |  | Если пусто, используется `auth_unavailable`. |

## 5. Типичные ошибки и границы

Когда `Pick` возвращает `error`, этот круг выбора заканчивается этой ошибкой. Если ABI `http_status` опущен или равен 0, он считается HTTP 500.

`Handled` равный false или отсутствие и `AuthID`, и `DelegateBuiltin` не является действительным решением. `AuthID` вне кандидатов или `DelegateBuiltin` не равный `round-robin` / `fill-first` тоже недействительны. Когда `Reject` и `Handled` оба true, отката нет.

## 6. Связанные возможности

Содержимое учётных данных описано в разделе [Провайдер учётных данных](/ru/plugin/auth-provider). Смена маршрута модели — в разделе [Маршрутизатор моделей](/ru/plugin/model-router).

## 7. Практический опыт

Пока нет.

