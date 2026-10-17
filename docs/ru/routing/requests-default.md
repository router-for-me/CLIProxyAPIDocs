---
title: Правила payload по умолчанию
feature_ids:
  - requests.payload.default-models-exist
  - requests.payload.default-models-from-protocol
  - requests.payload.default-models-headers
  - requests.payload.default-models-match
  - requests.payload.default-models-name
  - requests.payload.default-models-not-exist
  - requests.payload.default-models-not-match
  - requests.payload.default-models-protocol
  - requests.payload.default-params
  - requests.payload.default-raw-models-exist
  - requests.payload.default-raw-models-from-protocol
  - requests.payload.default-raw-models-headers
  - requests.payload.default-raw-models-match
  - requests.payload.default-raw-models-name
  - requests.payload.default-raw-models-not-exist
  - requests.payload.default-raw-models-not-match
  - requests.payload.default-raw-models-protocol
  - requests.payload.default-raw-params
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Правила payload по умолчанию

## 1. Какую задачу решает этот раздел

`requests.payload.default` дополняет только поля, которых ещё нет в исходном payload. `default-raw` тоже дополняет только отсутствующие поля, но вставляет значение как исходный JSON.

## 2. Когда применимо и чего здесь нет

Правила висят на `requests.payload`. Они применяются после встроенного перевода протокола и очистки инструмента изображений и до отправки запроса. Если `models` пуст или ни одна запись модели одновременно не удовлетворяет имени, протоколу, заголовку источника и условиям пути, правило не записывает поле. Если хотя бы одна запись модели в том же правиле совпала, запись происходит. Правила этой страницы не перекрывают уже существующее значение и не удаляют поля.

## 3. Как настроить или вызвать

```yaml
requests:
  payload:
    default:
      - models:
          - name: "gemini-*"
            protocol: "gemini"
            from-protocol: "responses"
            headers:
              X-Client-Tier: "tenant-*-region-*"
            match:
              - "metadata.client": "codex"
            not-match:
              - "metadata.mode": "dev"
            exist:
              - "tools"
            not-exist:
              - "metadata.disable_payload"
        params:
          "generationConfig.thinkingConfig.thinkingBudget": 32768
    default-raw:
      - models:
          - name: "gemini-2.5-pro"
            protocol: "gemini"
        params:
          "generationConfig.responseJsonSchema": "{\"type\":\"object\"}"
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| requests.payload.default.models.exist | Эти пути JSON должны существовать и не быть null. | nil | Путь должен существовать и не быть null. Пустой путь игнорируется. |
| requests.payload.default.models.from-protocol | Ограничение протокола источника. | empty string | Пустое значение не ограничивает. openai-response, openai-responses и response нормализуются в responses. Если протокол источника пуст, непустое условие не совпадает. |
| requests.payload.default.models.headers | Шаблоны заголовков запроса, которые должны совпасть. | nil | Каждый настроенный заголовок должен совпасть. * в значении — шаблон. Пустое отображение не ограничивает. Если в запросе нет этого заголовка, правило не совпадает. |
| requests.payload.default.models.match | Пути JSON должны быть равны этим значениям. | nil | Все условия должны выполниться. Пустой путь игнорируется. Сравнение идёт по нормализованному значению JSON. |
| requests.payload.default.models.name | Имя модели или шаблон. | empty string | Пустое имя не совпадает. * совпадает с любым кандидатом. Кандидаты включают имя модели upstream. Если есть модель запроса, они также включают имя после удаления суффикса мышления. Исходное имя запроса с суффиксом добавляется только когда само имя запроса имеет суффикс мышления. |
| requests.payload.default.models.not-exist | Эти пути JSON должны отсутствовать или быть null. | nil | Путь должен отсутствовать или быть null. Непустое значение означает, что правило не совпадает. Пустой путь игнорируется. |
| requests.payload.default.models.not-match | Пути JSON не должны быть равны этим значениям. | nil | Если любой путь равен настроенному значению, всё правило не совпадает. Пустой путь игнорируется. |
| requests.payload.default.models.protocol | Ограничение целевого протокола. | empty string | Не зависит от регистра. Пустое значение не ограничивает. Исполнитель передаёт фактический протокол, например openai, gemini, claude, codex, antigravity или interactions. |
| requests.payload.default.params | Пути JSON и значения, которые нужно записать в payload. | nil | Обычное значение записывается только когда в исходном payload нет этого пути. Первая успешная запись default или default-raw на том же пути побеждает. |
| requests.payload.default-raw.models.exist | Эти пути JSON должны существовать и не быть null. | nil | Путь должен существовать и не быть null. Пустой путь игнорируется. |
| requests.payload.default-raw.models.from-protocol | Ограничение протокола источника. | empty string | Пустое значение не ограничивает. openai-response, openai-responses и response нормализуются в responses. Если протокол источника пуст, непустое условие не совпадает. |
| requests.payload.default-raw.models.headers | Шаблоны заголовков запроса, которые должны совпасть. | nil | Каждый настроенный заголовок должен совпасть. * в значении — шаблон. Пустое отображение не ограничивает. Если в запросе нет этого заголовка, правило не совпадает. |
| requests.payload.default-raw.models.match | Пути JSON должны быть равны этим значениям. | nil | Все условия должны выполниться. Пустой путь игнорируется. Сравнение идёт по нормализованному значению JSON. |
| requests.payload.default-raw.models.name | Имя модели или шаблон. | empty string | Пустое имя не совпадает. * совпадает с любым кандидатом. Кандидаты включают имя модели upstream. Если есть модель запроса, они также включают имя после удаления суффикса мышления. Исходное имя запроса с суффиксом добавляется только когда само имя запроса имеет суффикс мышления. |
| requests.payload.default-raw.models.not-exist | Эти пути JSON должны отсутствовать или быть null. | nil | Путь должен отсутствовать или быть null. Непустое значение означает, что правило не совпадает. Пустой путь игнорируется. |
| requests.payload.default-raw.models.not-match | Пути JSON не должны быть равны этим значениям. | nil | Если любой путь равен настроенному значению, всё правило не совпадает. Пустой путь игнорируется. |
| requests.payload.default-raw.models.protocol | Ограничение целевого протокола. | empty string | Не зависит от регистра. Пустое значение не ограничивает. Исполнитель передаёт фактический протокол, например openai, gemini, claude, codex, antigravity или interactions. |
| requests.payload.default-raw.params | Пути JSON и исходный JSON, которые нужно записать в payload. | nil | Записывается только когда в исходном payload нет этого пути. Строка вставляется как исходный JSON и должна быть допустимым JSON. Другие типы сначала кодируются в JSON. Первая запись общая с default. Если SetRawBytes не удаётся, путь пропускается. |

## 5. Типичные ошибки и границы

Если исходный JSON не является допустимым JSON или `SetRawBytes` не удаётся, этот путь пропускается. Отдельная ошибка загрузки конфигурации не возвращается. Если список моделей пуст, всё правило не совпадает. Путь, записанный `default` или `default-raw`, более позднее правило по умолчанию не переписывает.

## 6. Связанные возможности

Два других вида правил описаны в разделах [Правила payload по умолчанию](/ru/routing/requests-default), [Правила переопределения payload](/ru/routing/requests-override) и [Правила фильтрации payload](/ru/routing/requests-filter). Само мышление моделей — в разделе [Мышление моделей](/ru/configuration/thinking-models).

## 7. Практический опыт

- [Используйте псевдоним fork, чтобы различать размеры изображений](/ru/experience/routing#exp-routing-fork-alias-for-image-size)
- [Размер изображения записывается в imageConfig](/ru/experience/routing#exp-routing-gemini-image-config-path)

