---
title: Перестройка system-сообщений Claude
feature_ids:
  - api-keys.claude.rebuild-mid-system-message
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Перестройка system-сообщений Claude

## 1. Какую задачу решает этот раздел

Переносит сообщения Claude с role system в поле system верхнего уровня.

## 2. Когда применимо и чего здесь нет

Действует только на ключ API Claude. Это не cloak.strict-mode.

## 3. Как настроить или вызвать

```yaml
api-keys:
  claude:
    - name: claude-1
      keys:
        - api-key: "YOUR_API_KEY"
          rebuild-mid-system-message: false
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.claude.rebuild-mid-system-message | Сливать ли сообщения с ролью system в system верхнего уровня. | false | При true сообщения Claude с role system переносятся в system верхнего уровня. false оставляет их как есть. |

## 5. Типичные ошибки и границы

false оставляет сообщения как есть. true переносит только сообщения с role system.

## 6. Связанные возможности

Как маскировка обрабатывает system, описано в разделе [Маскировка запросов Claude](/ru/accounts/api-keys-cloak).

## 7. Практический опыт

Пока нет.
