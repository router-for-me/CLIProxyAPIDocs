---
title: Приоритет учётных данных
feature_ids:
  - api-keys.claude.priority
  - api-keys.codex.priority
  - api-keys.gemini.priority
  - api-keys.interactions.priority
  - api-keys.meta.priority
  - api-keys.openai-compatibility.priority
  - api-keys.vertex.priority
  - api-keys.xai.priority
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Приоритет учётных данных

## 1. Какую задачу решает этот раздел

Когда несколько учётных данных могут обработать одну модель, приоритет решает, кого выбрать первым.

## 2. Когда применимо и чего здесь нет

Приоритет провайдера, совместимого с OpenAI, задаётся на провайдере. У других провайдеров его можно записать на группе, а ключ может перекрыть его. Вес — другая страница.

## 3. Как настроить или вызвать

```yaml
api-keys:
  claude:
    - name: claude-1
      priority: 0
      keys:
        - api-key: "YOUR_API_KEY"
          priority: 10
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.claude.priority | Приоритет, когда одновременно подходят несколько учётных данных. | Higher values are preferred; defaults to 0. | Чем больше число, тем выше приоритет. При пропуске равен 0. |
| api-keys.codex.priority | Приоритет, когда одновременно подходят несколько учётных данных. | Higher values are preferred; defaults to 0. | Чем больше число, тем выше приоритет. При пропуске равен 0. |
| api-keys.gemini.priority | Приоритет, когда одновременно подходят несколько учётных данных. | Higher values are preferred; defaults to 0. | Чем больше число, тем выше приоритет. При пропуске равен 0. |
| api-keys.interactions.priority | Приоритет, когда одновременно подходят несколько учётных данных. | Higher values are preferred; defaults to 0. | Чем больше число, тем выше приоритет. При пропуске равен 0. |
| api-keys.meta.priority | Приоритет, когда одновременно подходят несколько учётных данных. | Higher values are preferred; defaults to 0. | Чем больше число, тем выше приоритет. При пропуске равен 0. |
| api-keys.openai-compatibility.priority | Приоритет, когда одновременно подходят несколько учётных данных. | Higher values are preferred; defaults to 0. | Чем больше число, тем выше приоритет. При пропуске равен 0. |
| api-keys.vertex.priority | Приоритет, когда одновременно подходят несколько учётных данных. | Higher values are preferred; defaults to 0. | Чем больше число, тем выше приоритет. При пропуске равен 0. |
| api-keys.xai.priority | Приоритет, когда одновременно подходят несколько учётных данных. | Higher values are preferred; defaults to 0. | Чем больше число, тем выше приоритет. При пропуске равен 0. |

## 5. Типичные ошибки и границы

Отказа по диапазону нет. Чем больше число, тем выше приоритет. Пропуск означает 0.

## 6. Связанные возможности

Вес описан в разделе [Вес учётных данных](/ru/accounts/api-keys-weight).

## 7. Практический опыт

- [Режиму goal Codex нужны все три настройки сразу](/ru/experience/accounts#exp-accounts-codex-goal-mode)
- [Задайте приоритет в поле учётных данных](/ru/experience/management#exp-management-set-credential-priority)
- [Опрос начинается только после исчерпания приоритета](/ru/experience/routing#exp-routing-priority-before-strategy)

