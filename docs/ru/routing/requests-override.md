---
title: Правила переопределения payload
feature_ids:
  - requests.payload.override-models-exist
  - requests.payload.override-models-from-protocol
  - requests.payload.override-models-headers
  - requests.payload.override-models-match
  - requests.payload.override-models-name
  - requests.payload.override-models-not-exist
  - requests.payload.override-models-not-match
  - requests.payload.override-models-protocol
  - requests.payload.override-params
  - requests.payload.override-raw-models-exist
  - requests.payload.override-raw-models-from-protocol
  - requests.payload.override-raw-models-headers
  - requests.payload.override-raw-models-match
  - requests.payload.override-raw-models-name
  - requests.payload.override-raw-models-not-exist
  - requests.payload.override-raw-models-not-match
  - requests.payload.override-raw-models-protocol
  - requests.payload.override-raw-params
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Правила переопределения payload

## 1. Какую задачу решает этот раздел

`requests.payload.override` всегда записывает поле и заменяет уже имеющееся значение. `override-raw` тоже всегда записывает, но вставляет значение как исходный JSON.

## 2. Когда применимо и чего здесь нет

На одном пути побеждает более позднее совпавшее правило переопределения. Они выполняются после правил по умолчанию и до правил фильтрации. Правило фильтрации всё ещё может удалить записанный здесь путь. Если `models` пуст или ни одна запись модели не совпала полностью, правило ничего не записывает. Если хотя бы одна запись модели в том же правиле совпала, запись происходит. «Записывать только при отсутствии» здесь не описано.

## 3. Как настроить или вызвать

```yaml
requests:
  payload:
    override:
      - models:
          - name: "gpt-*"
            protocol: "codex"
        params:
          "reasoning.effort": "high"
    override-raw:
      - models:
          - name: "gpt-*"
            protocol: "codex"
        params:
          "response_format": "{\"type\":\"json_schema\"}"
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| requests.payload.override.models.exist | Эти пути JSON должны существовать и не быть null. | nil | Путь должен существовать и не быть null. Пустой путь игнорируется. |
| requests.payload.override.models.from-protocol | Ограничение протокола источника. | empty string | Пустое значение не ограничивает. openai-response, openai-responses и response нормализуются в responses. Если протокол источника пуст, непустое условие не совпадает. |
| requests.payload.override.models.headers | Шаблоны заголовков запроса, которые должны совпасть. | nil | Каждый настроенный заголовок должен совпасть. * в значении — шаблон. Пустое отображение не ограничивает. Если в запросе нет этого заголовка, правило не совпадает. |
| requests.payload.override.models.match | Пути JSON должны быть равны этим значениям. | nil | Все условия должны выполниться. Пустой путь игнорируется. Сравнение идёт по нормализованному значению JSON. |
| requests.payload.override.models.name | Имя модели или шаблон. | empty string | Пустое имя не совпадает. * совпадает с любым кандидатом. Кандидаты включают имя модели upstream. Если есть модель запроса, они также включают имя после удаления суффикса мышления. Исходное имя запроса с суффиксом добавляется только когда само имя запроса имеет суффикс мышления. |
| requests.payload.override.models.not-exist | Эти пути JSON должны отсутствовать или быть null. | nil | Путь должен отсутствовать или быть null. Непустое значение означает, что правило не совпадает. Пустой путь игнорируется. |
| requests.payload.override.models.not-match | Пути JSON не должны быть равны этим значениям. | nil | Если любой путь равен настроенному значению, всё правило не совпадает. Пустой путь игнорируется. |
| requests.payload.override.models.protocol | Ограничение целевого протокола. | empty string | Не зависит от регистра. Пустое значение не ограничивает. Исполнитель передаёт фактический протокол, например openai, gemini, claude, codex, antigravity или interactions. |
| requests.payload.override.params | Пути JSON и значения, которые нужно записать в payload. | nil | Всегда записывается и заменяет уже имеющееся значение. Побеждает более позднее совпавшее правило override. |
| requests.payload.override-raw.models.exist | Эти пути JSON должны существовать и не быть null. | nil | Путь должен существовать и не быть null. Пустой путь игнорируется. |
| requests.payload.override-raw.models.from-protocol | Ограничение протокола источника. | empty string | Пустое значение не ограничивает. openai-response, openai-responses и response нормализуются в responses. Если протокол источника пуст, непустое условие не совпадает. |
| requests.payload.override-raw.models.headers | Шаблоны заголовков запроса, которые должны совпасть. | nil | Каждый настроенный заголовок должен совпасть. * в значении — шаблон. Пустое отображение не ограничивает. Если в запросе нет этого заголовка, правило не совпадает. |
| requests.payload.override-raw.models.match | Пути JSON должны быть равны этим значениям. | nil | Все условия должны выполниться. Пустой путь игнорируется. Сравнение идёт по нормализованному значению JSON. |
| requests.payload.override-raw.models.name | Имя модели или шаблон. | empty string | Пустое имя не совпадает. * совпадает с любым кандидатом. Кандидаты включают имя модели upstream. Если есть модель запроса, они также включают имя после удаления суффикса мышления. Исходное имя запроса с суффиксом добавляется только когда само имя запроса имеет суффикс мышления. |
| requests.payload.override-raw.models.not-exist | Эти пути JSON должны отсутствовать или быть null. | nil | Путь должен отсутствовать или быть null. Непустое значение означает, что правило не совпадает. Пустой путь игнорируется. |
| requests.payload.override-raw.models.not-match | Пути JSON не должны быть равны этим значениям. | nil | Если любой путь равен настроенному значению, всё правило не совпадает. Пустой путь игнорируется. |
| requests.payload.override-raw.models.protocol | Ограничение целевого протокола. | empty string | Не зависит от регистра. Пустое значение не ограничивает. Исполнитель передаёт фактический протокол, например openai, gemini, claude, codex, antigravity или interactions. |
| requests.payload.override-raw.params | Пути JSON и исходный JSON, которые нужно записать в payload. | nil | Исходный JSON всегда записывается. Строка вставляется как есть и должна быть допустимым JSON. Побеждает более позднее совпавшее override-raw. Если SetRawBytes не удаётся, путь пропускается. |

## 5. Типичные ошибки и границы

Если исходный JSON недействителен или `SetRawBytes` не удаётся, этот путь пропускается. Если условие протокола или модели не совпало, записи нет и ошибка конфигурации не сообщается. Пустой `models` делает всё правило недействующим.

## 6. Связанные возможности

Два других вида правил описаны в разделах [Правила payload по умолчанию](/ru/routing/requests-default), [Правила переопределения payload](/ru/routing/requests-override) и [Правила фильтрации payload](/ru/routing/requests-filter). Само мышление моделей — в разделе [Мышление моделей](/ru/configuration/thinking-models).

## 7. Практический опыт

- [Сторонний DeepSeek не заполняет поля мышления OpenAI](/ru/experience/api#exp-api-deepseek-no-openai-thinking)
- [Псевдоним плюс переопределение выражают усилие Opus](/ru/experience/routing#exp-routing-alias-and-override-effort)
- [gpt-image-2 вызывается через дополнение чата после переопределения](/ru/experience/routing#exp-routing-gpt-image-override)
- [Добавьте extra_body правилом переопределения](/ru/experience/routing#exp-routing-override-extra-body)
- [Исправьте субагента Grok переопределением payload](/ru/experience/routing#exp-routing-override-grok-subagent)
- [Переопределение payload всё ещё действует после суффикса мышления](/ru/experience/routing#exp-routing-override-is-final)
- [Разные модели используют разные правила переопределения](/ru/experience/routing#exp-routing-separate-payload-by-model)

