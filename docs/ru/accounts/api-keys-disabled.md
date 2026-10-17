---
title: Отключение провайдера, совместимого с OpenAI
feature_ids:
  - api-keys.openai-compatibility.disabled
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Отключение провайдера, совместимого с OpenAI

## 1. Какую задачу решает этот раздел

Не удаляя конфигурацию, исключает одного провайдера, совместимого с OpenAI, из маршрутизации.

## 2. Когда применимо и чего здесь нет

Действует только на одну запись провайдера в `api-keys.openai-compatibility`. Этим нельзя отключить один ключ Claude или Gemini.

## 3. Как настроить или вызвать

```yaml
api-keys:
  openai-compatibility:
    - name: openrouter
      disabled: true
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.openai-compatibility.disabled | Отключён ли весь этот провайдер, совместимый с OpenAI. | false | При true провайдер не участвует в маршрутизации. При false используется как обычно. |

## 5. Типичные ошибки и границы

true только исключает его из маршрутизации и не даёт ошибку при загрузке. false или пропуск означают, что провайдер доступен.

## 6. Связанные возможности

Имя описано в разделе [Имя провайдера, совместимого с OpenAI](/ru/accounts/api-keys-name).

## 7. Практический опыт

- [Отключите совместимого провайдера через disabled](/ru/experience/accounts#exp-accounts-disable-compat-provider)
