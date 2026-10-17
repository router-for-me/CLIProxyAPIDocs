---
title: Маскировка запросов Claude
feature_ids:
  - api-keys.claude.cloak-cache-user-id
  - api-keys.claude.cloak-mode
  - api-keys.claude.cloak-sensitive-words
  - api-keys.claude.cloak-strict-mode
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Маскировка запросов Claude

## 1. Какую задачу решает этот раздел

Здесь описан cloak одного ключа API Claude: когда маскировать, как обрабатывать system-подсказку, чувствительные слова и кэшировать ли user_id.

## 2. Когда применимо и чего здесь нет

Глобальное значение по умолчанию — upstream.claude.disable-claude-cloak-mode. Учётные данные OAuth меняют поля вроде cloak_mode в JSON учётных данных, а не YAML этой страницы. Отпечаток не является подполем cloak.

## 3. Как настроить или вызвать

```yaml
api-keys:
  claude:
    - name: claude-1
      keys:
        - api-key: "YOUR_API_KEY"
          cloak:
            mode: "auto"
            strict-mode: false
            sensitive-words:
              - "API"
            cache-user-id: false
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.claude.cloak.cache-user-id | api-keys.claude.cloak.cache-user-id | nil | При пропуске или false каждый запрос создаёт новый случайный user_id. При true он повторно используется по ключу API. |
| api-keys.claude.cloak.mode | api-keys.claude.cloak.mode | Mode controls cloaking behavior: "auto" (default), "always", or "never". | auto: не маскировать, когда есть явный сигнал нативного входа. always: маскировать неподтверждённых клиентов, а подтверждённый нативный Claude Code всё равно проходит напрямую. never: не маскировать. Запись блока cloak включает маскировку для ключа API, у которого не задан отпечаток. |
| api-keys.claude.cloak.sensitive-words | api-keys.claude.cloak.sensitive-words | nil | Перечисленные слова в соответствующей подсказке разбиваются символами нулевой ширины. При пропуске не обрабатываются. |
| api-keys.claude.cloak.strict-mode | api-keys.claude.cloak.strict-mode | - false (default): legacy-model whitelist uses a user reminder; all other models use a mid-conversation system message - true: strip caller system prompts and keep only the Claude Code billing and identity blocks | false: белый список старых моделей использует напоминание пользователя, остальные модели — system-сообщение в диалоге. true: убирает system вызывающего и оставляет только блоки оплаты и личности Claude Code. |

## 5. Типичные ошибки и границы

mode следует задавать только как auto, always или never. Запись блока cloak включает маскировку для ключа API без заданного отпечатка. Подтверждённый нативный Claude Code при always всё равно проходит напрямую.

## 6. Связанные возможности

Глобальный переключатель описан в разделе [Поведение Claude upstream](/ru/accounts/upstream). Отпечаток — в разделе [Отпечаток Claude](/ru/accounts/api-keys-fingerprint).

## 7. Практический опыт

Пока нет.
