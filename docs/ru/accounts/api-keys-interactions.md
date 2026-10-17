---
title: Vertex Interactions
feature_ids:
  - api-keys.vertex.interactions
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Vertex Interactions

## 1. Какую задачу решает этот раздел

Позволяет одному ключу Vertex API использовать нативный Vertex Interactions API.

## 2. Когда применимо и чего здесь нет

Только эта настройка. Группа ключей interactions у Gemini — отдельный набор ключей. Это логическое значение её не переключает.

## 3. Как настроить или вызвать

```yaml
api-keys:
  vertex:
    - name: vertex-1
      interactions: true
      keys:
        - api-key: "YOUR_API_KEY"
```

Чтобы включить это в JSON сервисного аккаунта, запишите `interactions: true` в корне файла.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.vertex.interactions | Идёт ли этот ключ Vertex в нативный Interactions API. | nil | Пропуск или false не включает. true заставляет этот ключ Vertex идти в нативный Vertex Interactions API. В файле сервисного аккаунта в корне пишется interactions: true. |

## 5. Типичные ошибки и границы

Пропуск считается невключённым. Обычный ключ Gemini generateContent не меняется.

## 6. Связанные возможности

Ключ Interactions — запись interactions в разделе [Ключи upstream API](/ru/accounts/api-keys-api).

## 7. Практический опыт

Пока нет.
