---
title: Нативный поиск инструментов Claude
feature_ids:
  - api-keys.claude.native-tool-search
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Нативный поиск инструментов Claude

## 1. Какую задачу решает этот раздел

Объявляет, что ключ Claude с пользовательским адресом может принимать нативный поиск инструментов Anthropic.

## 2. Когда применимо и чего здесь нет

Официальному api.anthropic.com этот переключатель не нужен. Он также зависит от upstream.claude.tool-search.

## 3. Как настроить или вызвать

```yaml
api-keys:
  claude:
    - name: claude-1
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
          native-tool-search: true
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.claude.native-tool-search | Доверять ли нативному поиску инструментов Anthropic на пользовательском адресе. | false | Официальному api.anthropic.com он не нужен. У пользовательского base-url его нужно задать true, и upstream.claude.tool-search тоже должен быть true, прежде чем defer_loading и tool_reference будут доверенными. |

## 5. Типичные ошибки и границы

При false или пропуске пользовательский шлюз не обрабатывается как нативный поиск инструментов. Если включена только эта настройка, а глобальный tool-search всё ещё false, Codex tool_search сам по себе не включается.

## 6. Связанные возможности

Глобальный переключатель описан в разделе [Поведение Claude upstream](/ru/accounts/upstream).

## 7. Практический опыт

Пока нет.
