---
title: Правила фильтрации payload
feature_ids:
  - requests.payload.filter-models-exist
  - requests.payload.filter-models-from-protocol
  - requests.payload.filter-models-headers
  - requests.payload.filter-models-match
  - requests.payload.filter-models-name
  - requests.payload.filter-models-not-exist
  - requests.payload.filter-models-not-match
  - requests.payload.filter-models-protocol
  - requests.payload.filter-params
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Правила фильтрации payload

## 1. Какую задачу решает этот раздел

`requests.payload.filter` удаляет поля по пути JSON. Он нужен, чтобы убрать параметры, которые upstream не должен видеть.

## 2. Когда применимо и чего здесь нет

Фильтрация выполняется после правил по умолчанию и правил переопределения, поэтому может удалить путь, который эти правила только что записали. `params` здесь — список путей, а не отображение пути в значение. Если `models` пуст или ни одна запись модели не совпала полностью, правило ничего не удаляет. Если хотя бы одна запись модели в том же правиле совпала, удаление происходит. Новое значение здесь не записывается.

## 3. Как настроить или вызвать

```yaml
requests:
  payload:
    filter:
      - models:
          - name: "gemini-*"
            protocol: "gemini"
        params:
          - "generationConfig.thinkingConfig.thinkingBudget"
          - "generationConfig.responseJsonSchema"
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| requests.payload.filter.models.exist | Эти пути JSON должны существовать и не быть null. | nil | Путь должен существовать и не быть null. Пустой путь игнорируется. |
| requests.payload.filter.models.from-protocol | Ограничение протокола источника. | empty string | Пустое значение не ограничивает. openai-response, openai-responses и response нормализуются в responses. Если протокол источника пуст, непустое условие не совпадает. |
| requests.payload.filter.models.headers | Шаблоны заголовков запроса, которые должны совпасть. | nil | Каждый настроенный заголовок должен совпасть. `*` в значении — шаблон. Пустое отображение не ограничивает. Если в запросе нет этого заголовка, правило не совпадает. |
| requests.payload.filter.models.match | Пути JSON должны быть равны этим значениям. | nil | Все условия должны выполниться. Пустой путь игнорируется. Сравнение идёт по нормализованному значению JSON. |
| requests.payload.filter.models.name | Имя модели или шаблон. | empty string | Пустое имя не совпадает. `*` совпадает с любым кандидатом. Кандидаты включают имя модели upstream. Если есть модель запроса, они также включают имя после удаления суффикса мышления. Исходное имя запроса с суффиксом добавляется только когда само имя запроса имеет суффикс мышления. |
| requests.payload.filter.models.not-exist | Эти пути JSON должны отсутствовать или быть null. | nil | Путь должен отсутствовать или быть null. Непустое значение означает, что правило не совпадает. Пустой путь игнорируется. |
| requests.payload.filter.models.not-match | Пути JSON не должны быть равны этим значениям. | nil | Если любой путь равен настроенному значению, всё правило не совпадает. Пустой путь игнорируется. |
| requests.payload.filter.models.protocol | Ограничение целевого протокола. | empty string | Не зависит от регистра. Пустое значение не ограничивает. Исполнитель передаёт фактический протокол, например openai, gemini, claude, codex, antigravity или interactions. |
| requests.payload.filter.params | Пути JSON, которые нужно удалить из payload. | nil | Удаляются после default, default-raw, override и override-raw. Поэтому можно удалить путь, который только что записали. Пустой путь пропускается. Неудачное удаление тоже пропускается. |

## 5. Типичные ошибки и границы

Пустой путь и неудачное удаление пропускаются. Остальные пути не прерываются. Если условие модели или протокола не совпало, удаления нет. Если `models` пуст, правило не действует.

## 6. Связанные возможности

Два других вида правил описаны в разделах [Правила payload по умолчанию](/ru/routing/requests-default), [Правила переопределения payload](/ru/routing/requests-override) и [Правила фильтрации payload](/ru/routing/requests-filter). Само мышление моделей — в разделе [Мышление моделей](/ru/configuration/thinking-models).

## 7. Практический опыт

- [Уровень мышления нельзя объявить фильтрацией](/ru/experience/configuration#exp-configuration-levels-before-filter)
- [Фильтруйте поле, если уровень не разрешён](/ru/experience/configuration#exp-configuration-levels-or-filter)
- [Не задавайте бюджет одновременно с фильтрацией reasoning_effort](/ru/experience/routing#exp-routing-filter-effort-without-budget)
- [Фильтром payload уберите поля, которые отклоняет upstream](/ru/experience/routing#exp-routing-filter-rejected-fields)
