---
title: Экспериментальная подпись CCH
feature_ids:
  - api-keys.claude.experimental-cch-signing
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Экспериментальная подпись CCH

## 1. Какую задачу решает этот раздел

Сохраняет experimental-cch-signing из старой конфигурации, чтобы старый файл всё ещё загружался.

## 2. Когда применимо и чего здесь нет

Само по себе оно больше не включает и не выключает подпись. Настоящие учётные данные Claude OAuth и отпечаток claude-code-cli на api.anthropic.com подписывают автоматически.

## 3. Как настроить или вызвать

```yaml
api-keys:
  claude:
    - name: claude-1
      keys:
        - api-key: "YOUR_API_KEY"
          experimental-cch-signing: false
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.claude.experimental-cch-signing | Переключатель CCH, сохранённый для старой конфигурации. | false | api-keys.claude.experimental-cch-signing |

## 5. Типичные ошибки и границы

Это логическое значение не отклоняется из-за true или false. Значение true не добавляет дополнительную подпись на неподдерживаемом шлюзе.

## 6. Связанные возможности

Отпечаток описан в разделе [Отпечаток Claude](/ru/accounts/api-keys-fingerprint).

## 7. Практический опыт

Пока нет.
