---
title: Переключатель ключа Alpha Search
feature_ids:
  - api-keys.codex.alpha-search
  - api-keys.meta.alpha-search
  - api-keys.xai.alpha-search
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Переключатель ключа Alpha Search

## 1. Какую задачу решает этот раздел

Разрешает одному ключу API Codex, Meta или xAI обслуживать Alpha Search.

## 2. Когда применимо и чего здесь нет

Сам HTTP-путь Alpha Search сюда не входит. У ключа Claude этого поля нет.

## 3. Как настроить или вызвать

```yaml
api-keys:
  codex:
    - name: codex-1
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
          alpha-search: false
```

Когда он включён, вызов использует base-url этой группы плюс `/alpha/search`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.codex.alpha-search | Может ли этот ключ обслуживать Alpha Search. | false | При false этот ключ не обслуживает Alpha Search. При true он обслуживается через base-url группы плюс /alpha/search. |
| api-keys.meta.alpha-search | Может ли этот ключ обслуживать Alpha Search. | false | При false этот ключ не обслуживает Alpha Search. При true он обслуживается через base-url группы плюс /alpha/search. |
| api-keys.xai.alpha-search | Может ли этот ключ обслуживать Alpha Search. | false | При false этот ключ не обслуживает Alpha Search. При true он обслуживается через base-url группы плюс /alpha/search. |

## 5. Типичные ошибки и границы

При false этот ключ не берёт на себя Alpha Search. Если нет base-url, публичный маршрут использует собственный 503 этого маршрута. Здесь это не повторяется.

## 6. Связанные возможности

Публичный путь описан в разделе Responses. Базовый адрес — в разделе [Базовые URL upstream](/ru/accounts/api-keys-base).

## 7. Практический опыт

Пока нет.
