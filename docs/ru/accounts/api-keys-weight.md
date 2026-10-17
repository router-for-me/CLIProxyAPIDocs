---
title: Вес учётных данных
feature_ids:
  - api-keys.claude.weight
  - api-keys.codex.weight
  - api-keys.gemini.weight
  - api-keys.interactions.weight
  - api-keys.meta.weight
  - api-keys.vertex.weight
  - api-keys.xai.weight
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Вес учётных данных

## 1. Какую задачу решает этот раздел

Даёт каждому ключу upstream долю во взвешенном опросе.

## 2. Когда применимо и чего здесь нет

Вес провайдера, совместимого с OpenAI, находится в записи keys. После загрузки имя поля — api-key-entries.weight. У других провайдеров он записывается в keys. Приоритет — это не вес.

## 3. Как настроить или вызвать

```yaml
api-keys:
  claude:
    - name: claude-1
      keys:
        - api-key: "YOUR_API_KEY"
          weight: 1
  openai-compatibility:
    - name: openrouter
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
          weight: 1
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.claude.weight | Доля во взвешенном опросе. | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | При пропуске считается 1. Целое меньше или равное 0 не участвует во взвешенном выборе. Нецелое значение приводит к ошибке загрузки конфигурации. Ошибка содержит weight must be an integer. Больше 1000000 приводит к ошибке. Ошибка содержит weight must not exceed 1000000. |
| api-keys.codex.weight | Доля во взвешенном опросе. | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | При пропуске считается 1. Целое меньше или равное 0 не участвует во взвешенном выборе. Нецелое значение приводит к ошибке загрузки конфигурации. Ошибка содержит weight must be an integer. Больше 1000000 приводит к ошибке. Ошибка содержит weight must not exceed 1000000. |
| api-keys.gemini.weight | Доля во взвешенном опросе. | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | При пропуске считается 1. Целое меньше или равное 0 не участвует во взвешенном выборе. Нецелое значение приводит к ошибке загрузки конфигурации. Ошибка содержит weight must be an integer. Больше 1000000 приводит к ошибке. Ошибка содержит weight must not exceed 1000000. |
| api-keys.interactions.weight | Доля во взвешенном опросе. | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | При пропуске считается 1. Целое меньше или равное 0 не участвует во взвешенном выборе. Нецелое значение приводит к ошибке загрузки конфигурации. Ошибка содержит weight must be an integer. Больше 1000000 приводит к ошибке. Ошибка содержит weight must not exceed 1000000. |
| api-keys.meta.weight | Доля во взвешенном опросе. | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | При пропуске считается 1. Целое меньше или равное 0 не участвует во взвешенном выборе. Нецелое значение приводит к ошибке загрузки конфигурации. Ошибка содержит weight must be an integer. Больше 1000000 приводит к ошибке. Ошибка содержит weight must not exceed 1000000. |
| api-keys.vertex.weight | Доля во взвешенном опросе. | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | При пропуске считается 1. Целое меньше или равное 0 не участвует во взвешенном выборе. Нецелое значение приводит к ошибке загрузки конфигурации. Ошибка содержит weight must be an integer. Больше 1000000 приводит к ошибке. Ошибка содержит weight must not exceed 1000000. |
| api-keys.xai.weight | Доля во взвешенном опросе. | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | При пропуске считается 1. Целое меньше или равное 0 не участвует во взвешенном выборе. Нецелое значение приводит к ошибке загрузки конфигурации. Ошибка содержит weight must be an integer. Больше 1000000 приводит к ошибке. Ошибка содержит weight must not exceed 1000000. |

## 5. Типичные ошибки и границы

При пропуске считается 1. Значение меньше или равное 0 исключает эти учётные данные и не сообщает об ошибке. Нецелое значение или значение больше 1000000 приводит к ошибке загрузки конфигурации.

## 6. Связанные возможности

Приоритет описан в разделе [Приоритет учётных данных](/ru/accounts/api-keys-priority).

## 7. Практический опыт

Пока нет.

