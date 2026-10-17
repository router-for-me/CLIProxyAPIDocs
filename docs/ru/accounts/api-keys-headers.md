---
title: Дополнительные заголовки upstream
feature_ids:
  - api-keys.claude.headers
  - api-keys.codex.headers
  - api-keys.gemini.headers
  - api-keys.interactions.headers
  - api-keys.meta.headers
  - api-keys.openai-compatibility.headers
  - api-keys.vertex.headers
  - api-keys.xai.headers
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Дополнительные заголовки upstream

## 1. Какую задачу решает этот раздел

Добавляет дополнительные HTTP-заголовки к одной группе upstream или ключу.

## 2. Когда применимо и чего здесь нет

Эти заголовки отправляются upstream. Это не заголовки, которые прокси требует от клиента. Заголовки провайдера, совместимого с OpenAI, записываются на провайдере, а не на одном ключе.

## 3. Как настроить или вызвать

```yaml
api-keys:
  gemini:
    - name: gemini-1
      headers:
        X-Custom-Header: "custom-value"
      keys:
        - api-key: "YOUR_API_KEY"
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.claude.headers | Дополнительные HTTP-заголовки, отправляемые этому upstream. | nil | Заголовки отображения добавляются к запросу этого upstream. При пропуске не добавляются. |
| api-keys.codex.headers | Дополнительные HTTP-заголовки, отправляемые этому upstream. | nil | Заголовки отображения добавляются к запросу этого upstream. При пропуске не добавляются. |
| api-keys.gemini.headers | Дополнительные HTTP-заголовки, отправляемые этому upstream. | nil | Заголовки отображения добавляются к запросу этого upstream. При пропуске не добавляются. |
| api-keys.interactions.headers | Дополнительные HTTP-заголовки, отправляемые этому upstream. | nil | Заголовки отображения добавляются к запросу этого upstream. При пропуске не добавляются. |
| api-keys.meta.headers | Дополнительные HTTP-заголовки, отправляемые этому upstream. | nil | Заголовки отображения добавляются к запросу этого upstream. При пропуске не добавляются. |
| api-keys.openai-compatibility.headers | Дополнительные HTTP-заголовки, отправляемые этому upstream. | nil | Заголовки отображения добавляются к запросу этого upstream. При пропуске не добавляются. |
| api-keys.vertex.headers | Дополнительные HTTP-заголовки, отправляемые этому upstream. | nil | Заголовки отображения добавляются к запросу этого upstream. При пропуске не добавляются. |
| api-keys.xai.headers | Дополнительные HTTP-заголовки, отправляемые этому upstream. | nil | Заголовки отображения добавляются к запросу этого upstream. При пропуске не добавляются. |

## 5. Типичные ошибки и границы

У значений заголовков нет отдельного отказа по формату. Отображение, явно заданное на ключе, целиком заменяет отображение группы.

## 6. Связанные возможности

Заголовки базовой линии отпечатка Claude описаны в разделе [Поведение Claude upstream](/ru/accounts/upstream). Это другой набор ключей.

## 7. Практический опыт

- [Совместимому вызову Kimi нужен User-Agent](/ru/experience/accounts#exp-accounts-kimi-user-agent)
- [Заголовки совместимого провайдера действуют только на этого провайдера](/ru/experience/accounts#exp-accounts-provider-headers)
