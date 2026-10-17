---
title: Ключи upstream API
feature_ids:
  - api-keys.claude.api-key
  - api-keys.codex.api-key
  - api-keys.gemini.api-key
  - api-keys.interactions.api-key
  - api-keys.meta.api-key
  - api-keys.openai-compatibility.api-key-entries-api-key
  - api-keys.openai-compatibility.api-key-entries-proxy-url
  - api-keys.openai-compatibility.api-key-entries-weight
  - api-keys.vertex.api-key
  - api-keys.xai.api-key
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Ключи upstream API

## 1. Какую задачу решает этот раздел

Здесь описаны ключи, которыми каждый провайдер upstream вызывает модель. Это не клиентские ключи вызова этого прокси.

## 2. Когда применимо и чего здесь нет

v8 записывает всех провайдеров, кроме совместимых с OpenAI, как группу: `name`, `base-url` и `keys`. Ключ записывается в `keys`. Ключи провайдера, совместимого с OpenAI, записываются в `keys` группы и после загрузки соответствуют `api-key-entries`. Клиентские ключи по-прежнему `access.api-keys`.

## 3. Как настроить или вызвать

```yaml
api-keys:
  claude:
    - name: claude-1
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
  openai-compatibility:
    - name: openrouter
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.claude.api-key | Ключ доступа к этому upstream. | empty string | Записывается в keys группы v8. Официальный ключ Claude при пустом base-url идёт на https://api.anthropic.com. |
| api-keys.codex.api-key | Ключ доступа к этому upstream. | empty string | Записывается в keys группы v8. При пустом base-url используется https://chatgpt.com/backend-api/codex. |
| api-keys.gemini.api-key | Ключ доступа к этому upstream. | empty string | Записывается в keys группы v8. При пустом base-url используется https://generativelanguage.googleapis.com. |
| api-keys.interactions.api-key | Ключ доступа к этому upstream. | empty string | Записывается в keys группы v8. При пустом base-url используется https://generativelanguage.googleapis.com. |
| api-keys.meta.api-key | Ключ доступа к этому upstream. | empty string | Записывается в keys группы v8. Пустой base-url использует https://api.meta.ai/v1. |
| api-keys.openai-compatibility.api-key-entries.api-key | api-keys.openai-compatibility.api-key-entries.api-key | empty string | Записывается в keys группы openai-compatibility. После загрузки соответствует api-key-entries.api-key. |
| api-keys.openai-compatibility.api-key-entries.proxy-url | api-keys.openai-compatibility.api-key-entries.proxy-url | empty string | Пустое значение откатывается к requests.proxy-url. Шаблон v8 записывает direct, чтобы обойти прокси. Прокси провайдера, совместимого с OpenAI, записывается в записи keys. У других провайдеров его можно записать на группе, и один ключ может перекрыть его. |
| api-keys.openai-compatibility.api-key-entries.weight | api-keys.openai-compatibility.api-key-entries.weight | An omitted value defaults to 1; non-positive values exclude this credential; maximum 1,000,000. | При пропуске считается 1. Целое меньше или равное 0 не участвует во взвешенном выборе. Нецелое значение приводит к ошибке загрузки конфигурации. Ошибка содержит weight must be an integer. Больше 1000000 приводит к ошибке. Ошибка содержит weight must not exceed 1000000. |
| api-keys.vertex.api-key | Ключ доступа к этому upstream. | empty string | Отправляется как x-goog-api-key. Записывается в keys группы v8. |
| api-keys.xai.api-key | Ключ доступа к этому upstream. | empty string | Записывается в keys группы v8. Ключ API с пустым base-url использует https://api.x.ai/v1. |

## 5. Типичные ошибки и границы

Загрузка конфигурации не удаётся, если значение провайдера не список, группа не отображение или `keys` не список. Кроме совместимого с OpenAI, запись `base-url` в один ключ не удаётся. Ошибка содержит `base-url belongs to the group`. Неподдерживаемое поле на группе тоже приводит к ошибке.

## 6. Связанные возможности

Адреса описаны в разделе [Базовые URL upstream](/ru/accounts/api-keys-base). Вес — в разделе [Вес учётных данных](/ru/accounts/api-keys-weight).

## 7. Практический опыт

- [Upstream responses записывается в ключ API Codex](/ru/experience/accounts#exp-accounts-codex-api-key-base-url)
- [Добавьте несколько ключей под одним базовым адресом](/ru/experience/accounts#exp-accounts-multiple-keys-one-provider)
- [Подключайте третью сторону через раздел, совместимый с OpenAI](/ru/experience/accounts#exp-accounts-openai-compatible-provider)
- [При искажённом ответе сначала проверьте прокси на ключе](/ru/experience/accounts#exp-accounts-trace-key-proxy)
- [Одноимённые модели используют одну стратегию маршрутизации](/ru/experience/routing#exp-routing-same-model-name)
