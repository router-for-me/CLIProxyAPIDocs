---
title: Повторы и ошибки уровня запроса
feature_ids:
  - api-keys.claude.request-retry
  - api-keys.claude.request-scoped-errors-action
  - api-keys.claude.request-scoped-errors-match
  - api-keys.claude.request-scoped-errors-match-regexr
  - api-keys.claude.request-scoped-errors-status
  - api-keys.codex.request-retry
  - api-keys.codex.request-scoped-errors-action
  - api-keys.codex.request-scoped-errors-match
  - api-keys.codex.request-scoped-errors-match-regexr
  - api-keys.codex.request-scoped-errors-status
  - api-keys.gemini.request-retry
  - api-keys.gemini.request-scoped-errors-action
  - api-keys.gemini.request-scoped-errors-match
  - api-keys.gemini.request-scoped-errors-match-regexr
  - api-keys.gemini.request-scoped-errors-status
  - api-keys.interactions.request-retry
  - api-keys.interactions.request-scoped-errors-action
  - api-keys.interactions.request-scoped-errors-match
  - api-keys.interactions.request-scoped-errors-match-regexr
  - api-keys.interactions.request-scoped-errors-status
  - api-keys.meta.request-retry
  - api-keys.meta.request-scoped-errors-action
  - api-keys.meta.request-scoped-errors-match
  - api-keys.meta.request-scoped-errors-match-regexr
  - api-keys.meta.request-scoped-errors-status
  - api-keys.openai-compatibility.request-retry
  - api-keys.openai-compatibility.request-scoped-errors-action
  - api-keys.openai-compatibility.request-scoped-errors-match
  - api-keys.openai-compatibility.request-scoped-errors-match-regexr
  - api-keys.openai-compatibility.request-scoped-errors-status
  - api-keys.vertex.request-retry
  - api-keys.xai.request-retry
  - api-keys.xai.request-scoped-errors-action
  - api-keys.xai.request-scoped-errors-match
  - api-keys.xai.request-scoped-errors-match-regexr
  - api-keys.xai.request-scoped-errors-status
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Повторы и ошибки уровня запроса

## 1. Какую задачу решает этот раздел

Перекрывает глобальное число кругов повтора для учётных данных или провайдера и по коду состояния upstream и телу ошибки решает, остановиться, продолжить и нужно ли охлаждение.

## 2. Когда применимо и чего здесь нет

У ключа Vertex в реестре есть только request-retry. Полей ошибки уровня запроса нет. Такие же правила для файловых учётных данных OAuth находятся на странице OAuth.

## 3. Как настроить или вызвать

```yaml
api-keys:
  claude:
    - name: claude-1
      request-retry: 3
      request-scoped-errors:
        - status: 400
          match:
            - "prompt is too long"
          match-regexr:
            - "prompt is too long$"
          action: "stop"
      keys:
        - api-key: "YOUR_API_KEY"
          request-retry: 0
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.claude.request-retry | Дополнительные круги повтора для этих учётных данных. | nil | При пропуске или отрицательном значении используется глобальный request-retry. 0 выключает дополнительные круги повтора. |
| api-keys.claude.request-scoped-errors.action | Что делать с этой ошибкой upstream после совпадения. | empty string | Используются только stop, stop-and-cooldown, continue и continue-and-cooldown. В глобальном правиле OAuth пустое действие отбрасывается и отдельно не сообщается как ошибка. |
| api-keys.claude.request-scoped-errors.match | Сопоставлять тело ошибки upstream подстрокой. | nil | При пропуске сопоставления по подстроке нет. Если код состояния не положителен или и подстрока, и регулярное выражение пусты, это правило OAuth отбрасывается. |
| api-keys.claude.request-scoped-errors.match-regexr | Сопоставлять тело ошибки upstream регулярным выражением. | nil | При пропуске сопоставления по регулярному выражению нет. Пустые элементы удаляются. |
| api-keys.claude.request-scoped-errors.status | Код состояния HTTP upstream для сопоставления. | 0 | Сопоставляется с кодом состояния HTTP ответа upstream, например 400. Правило OAuth меньше или равное 0 отбрасывается. |
| api-keys.codex.request-retry | Дополнительные круги повтора для этих учётных данных. | nil | При пропуске или отрицательном значении используется глобальный request-retry. 0 выключает дополнительные круги повтора. |
| api-keys.codex.request-scoped-errors.action | Что делать с этой ошибкой upstream после совпадения. | empty string | Используются только stop, stop-and-cooldown, continue и continue-and-cooldown. В глобальном правиле OAuth пустое действие отбрасывается и отдельно не сообщается как ошибка. |
| api-keys.codex.request-scoped-errors.match | Сопоставлять тело ошибки upstream подстрокой. | nil | При пропуске сопоставления по подстроке нет. Если код состояния не положителен или и подстрока, и регулярное выражение пусты, это правило OAuth отбрасывается. |
| api-keys.codex.request-scoped-errors.match-regexr | Сопоставлять тело ошибки upstream регулярным выражением. | nil | При пропуске сопоставления по регулярному выражению нет. Пустые элементы удаляются. |
| api-keys.codex.request-scoped-errors.status | Код состояния HTTP upstream для сопоставления. | 0 | Сопоставляется с кодом состояния HTTP ответа upstream, например 400. Правило OAuth меньше или равное 0 отбрасывается. |
| api-keys.gemini.request-retry | Дополнительные круги повтора для этих учётных данных. | nil | При пропуске или отрицательном значении используется глобальный request-retry. 0 выключает дополнительные круги повтора. |
| api-keys.gemini.request-scoped-errors.action | Что делать с этой ошибкой upstream после совпадения. | empty string | Используются только stop, stop-and-cooldown, continue и continue-and-cooldown. В глобальном правиле OAuth пустое действие отбрасывается и отдельно не сообщается как ошибка. |
| api-keys.gemini.request-scoped-errors.match | Сопоставлять тело ошибки upstream подстрокой. | nil | При пропуске сопоставления по подстроке нет. Если код состояния не положителен или и подстрока, и регулярное выражение пусты, это правило OAuth отбрасывается. |
| api-keys.gemini.request-scoped-errors.match-regexr | Сопоставлять тело ошибки upstream регулярным выражением. | nil | При пропуске сопоставления по регулярному выражению нет. Пустые элементы удаляются. |
| api-keys.gemini.request-scoped-errors.status | Код состояния HTTP upstream для сопоставления. | 0 | Сопоставляется с кодом состояния HTTP ответа upstream, например 400. Правило OAuth меньше или равное 0 отбрасывается. |
| api-keys.interactions.request-retry | Дополнительные круги повтора для этих учётных данных. | nil | При пропуске или отрицательном значении используется глобальный request-retry. 0 выключает дополнительные круги повтора. |
| api-keys.interactions.request-scoped-errors.action | Что делать с этой ошибкой upstream после совпадения. | empty string | Используются только stop, stop-and-cooldown, continue и continue-and-cooldown. В глобальном правиле OAuth пустое действие отбрасывается и отдельно не сообщается как ошибка. |
| api-keys.interactions.request-scoped-errors.match | Сопоставлять тело ошибки upstream подстрокой. | nil | При пропуске сопоставления по подстроке нет. Если код состояния не положителен или и подстрока, и регулярное выражение пусты, это правило OAuth отбрасывается. |
| api-keys.interactions.request-scoped-errors.match-regexr | Сопоставлять тело ошибки upstream регулярным выражением. | nil | При пропуске сопоставления по регулярному выражению нет. Пустые элементы удаляются. |
| api-keys.interactions.request-scoped-errors.status | Код состояния HTTP upstream для сопоставления. | 0 | Сопоставляется с кодом состояния HTTP ответа upstream, например 400. Правило OAuth меньше или равное 0 отбрасывается. |
| api-keys.meta.request-retry | Дополнительные круги повтора для этих учётных данных. | nil | При пропуске или отрицательном значении используется глобальный request-retry. 0 выключает дополнительные круги повтора. |
| api-keys.meta.request-scoped-errors.action | Что делать с этой ошибкой upstream после совпадения. | empty string | Используются только stop, stop-and-cooldown, continue и continue-and-cooldown. В глобальном правиле OAuth пустое действие отбрасывается и отдельно не сообщается как ошибка. |
| api-keys.meta.request-scoped-errors.match | Сопоставлять тело ошибки upstream подстрокой. | nil | При пропуске сопоставления по подстроке нет. Если код состояния не положителен или и подстрока, и регулярное выражение пусты, это правило OAuth отбрасывается. |
| api-keys.meta.request-scoped-errors.match-regexr | Сопоставлять тело ошибки upstream регулярным выражением. | nil | При пропуске сопоставления по регулярному выражению нет. Пустые элементы удаляются. |
| api-keys.meta.request-scoped-errors.status | Код состояния HTTP upstream для сопоставления. | 0 | Сопоставляется с кодом состояния HTTP ответа upstream, например 400. Правило OAuth меньше или равное 0 отбрасывается. |
| api-keys.openai-compatibility.request-retry | Дополнительные круги повтора для этих учётных данных. | nil | При пропуске или отрицательном значении используется глобальный request-retry. 0 выключает дополнительные круги повтора. |
| api-keys.openai-compatibility.request-scoped-errors.action | Что делать с этой ошибкой upstream после совпадения. | empty string | Используются только stop, stop-and-cooldown, continue и continue-and-cooldown. В глобальном правиле OAuth пустое действие отбрасывается и отдельно не сообщается как ошибка. |
| api-keys.openai-compatibility.request-scoped-errors.match | Сопоставлять тело ошибки upstream подстрокой. | nil | При пропуске сопоставления по подстроке нет. Если код состояния не положителен или и подстрока, и регулярное выражение пусты, это правило OAuth отбрасывается. |
| api-keys.openai-compatibility.request-scoped-errors.match-regexr | Сопоставлять тело ошибки upstream регулярным выражением. | nil | При пропуске сопоставления по регулярному выражению нет. Пустые элементы удаляются. |
| api-keys.openai-compatibility.request-scoped-errors.status | Код состояния HTTP upstream для сопоставления. | 0 | Сопоставляется с кодом состояния HTTP ответа upstream, например 400. Правило OAuth меньше или равное 0 отбрасывается. |
| api-keys.vertex.request-retry | Дополнительные круги повтора для этих учётных данных. | nil | При пропуске или отрицательном значении используется глобальный request-retry. 0 выключает дополнительные круги повтора. |
| api-keys.xai.request-retry | Дополнительные круги повтора для этих учётных данных. | nil | При пропуске или отрицательном значении используется глобальный request-retry. 0 выключает дополнительные круги повтора. |
| api-keys.xai.request-scoped-errors.action | Что делать с этой ошибкой upstream после совпадения. | empty string | Используются только stop, stop-and-cooldown, continue и continue-and-cooldown. В глобальном правиле OAuth пустое действие отбрасывается и отдельно не сообщается как ошибка. |
| api-keys.xai.request-scoped-errors.match | Сопоставлять тело ошибки upstream подстрокой. | nil | При пропуске сопоставления по подстроке нет. Если код состояния не положителен или и подстрока, и регулярное выражение пусты, это правило OAuth отбрасывается. |
| api-keys.xai.request-scoped-errors.match-regexr | Сопоставлять тело ошибки upstream регулярным выражением. | nil | При пропуске сопоставления по регулярному выражению нет. Пустые элементы удаляются. |
| api-keys.xai.request-scoped-errors.status | Код состояния HTTP upstream для сопоставления. | 0 | Сопоставляется с кодом состояния HTTP ответа upstream, например 400. Правило OAuth меньше или равное 0 отбрасывается. |

## 5. Типичные ошибки и границы

Если request-retry опущен или отрицателен, наследуется глобальное значение. 0 выключает дополнительные круги. action использует stop, stop-and-cooldown, continue и continue-and-cooldown. Путь OAuth отбрасывает неполные правила. Правила ключа API настраиваются теми же четырьмя действиями.

## 6. Связанные возможности

Правила OAuth описаны в разделе [Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth).

## 7. Практический опыт

- [Обрабатывайте конкретный 429 правилом ошибки уровня запроса](/ru/experience/accounts#exp-accounts-request-scoped-error-action)
