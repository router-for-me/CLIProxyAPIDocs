---
title: prompt_cache_key
feature_ids:
  - api-keys.openai-compatibility.support-prompt-cache-key
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# prompt_cache_key

## 1. Какую задачу решает этот раздел

Позволяет одному провайдеру, совместимому с OpenAI, внедрять производный prompt_cache_key в запросы, которые его поддерживают.

## 2. Когда применимо и чего здесь нет

Только эта настройка. Это не support-configuration-update на модели Codex.

## 3. Как настроить или вызвать

```yaml
api-keys:
  openai-compatibility:
    - name: openrouter
      base-url: "https://example.invalid"
      support-prompt-cache-key: false
      keys:
        - api-key: "YOUR_API_KEY"
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.openai-compatibility.support-prompt-cache-key | Внедрять ли производный prompt_cache_key. | false | При true в поддерживаемые запросы внедряется производный prompt_cache_key. При false не внедряется. |

## 5. Типичные ошибки и границы

false или пропуск ничего не внедряют. true действует только на запросы, которые поддерживают это поле.

## 6. Связанные возможности

configuration_update на модели описан в разделе [Псевдонимы моделей upstream](/ru/accounts/api-keys-models).

## 7. Практический опыт

Пока нет.
