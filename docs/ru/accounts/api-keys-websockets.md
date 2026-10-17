---
title: Транспорт WebSocket Responses
feature_ids:
  - api-keys.codex.websockets
  - api-keys.meta.websockets
  - api-keys.xai.websockets
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Транспорт WebSocket Responses

## 1. Какую задачу решает этот раздел

Позволяет одному ключу API Codex, xAI или Meta использовать транспорт WebSocket Responses.

## 2. Когда применимо и чего здесь нет

Это переключатель ключа. Полнодуплексный response-steering Codex — опция провайдера и на этой странице не описан.

## 3. Как настроить или вызвать

```yaml
api-keys:
  codex:
    - name: codex-1
      keys:
        - api-key: "YOUR_API_KEY"
          websockets: false
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.codex.websockets | Использует ли этот ключ транспорт WebSocket Responses. | false | При false транспорт WebSocket Responses для этого ключа не включается. |
| api-keys.meta.websockets | Использует ли этот ключ транспорт WebSocket Responses. | false | При false транспорт WebSocket Responses для этого ключа не включается. |
| api-keys.xai.websockets | Использует ли этот ключ транспорт WebSocket Responses. | false | При false транспорт WebSocket Responses для этого ключа не включается. |

## 5. Типичные ошибки и границы

false оставляет его выключенным. Медиа-реле он не открывает.

## 6. Связанные возможности

Поведение WebSocket на уровне провайдера описано в разделе [Параметры провайдера Codex](/ru/configuration/provider/codex).

## 7. Практический опыт

- [Режиму goal Codex нужны все три настройки сразу](/ru/experience/accounts#exp-accounts-codex-goal-mode)
- [Codex может использовать WebSocket клиента или WebSocket прокси](/ru/experience/accounts#exp-accounts-codex-websocket-or-http)
