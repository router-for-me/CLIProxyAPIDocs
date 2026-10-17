---
title: Псевдонимы моделей upstream
feature_ids:
  - api-keys.claude.models-alias
  - api-keys.claude.models-display-name
  - api-keys.claude.models-force-mapping
  - api-keys.claude.models-is-compat
  - api-keys.claude.models-max-context-length
  - api-keys.claude.models-name
  - api-keys.codex.models-alias
  - api-keys.codex.models-display-name
  - api-keys.codex.models-force-mapping
  - api-keys.codex.models-is-compat
  - api-keys.codex.models-max-context-length
  - api-keys.codex.models-name
  - api-keys.codex.models-support-configuration-update
  - api-keys.gemini.models-alias
  - api-keys.gemini.models-display-name
  - api-keys.gemini.models-force-mapping
  - api-keys.gemini.models-is-compat
  - api-keys.gemini.models-max-context-length
  - api-keys.gemini.models-name
  - api-keys.interactions.models-alias
  - api-keys.interactions.models-display-name
  - api-keys.interactions.models-force-mapping
  - api-keys.interactions.models-is-compat
  - api-keys.interactions.models-max-context-length
  - api-keys.interactions.models-name
  - api-keys.meta.models-alias
  - api-keys.meta.models-display-name
  - api-keys.meta.models-force-mapping
  - api-keys.meta.models-is-compat
  - api-keys.meta.models-max-context-length
  - api-keys.meta.models-name
  - api-keys.meta.models-support-configuration-update
  - api-keys.openai-compatibility.models-alias
  - api-keys.openai-compatibility.models-display-name
  - api-keys.openai-compatibility.models-force-mapping
  - api-keys.openai-compatibility.models-image
  - api-keys.openai-compatibility.models-input-modalities
  - api-keys.openai-compatibility.models-is-compat
  - api-keys.openai-compatibility.models-max-context-length
  - api-keys.openai-compatibility.models-name
  - api-keys.openai-compatibility.models-output-modalities
  - api-keys.openai-compatibility.models-use-max-completion-tokens
  - api-keys.vertex.models-alias
  - api-keys.vertex.models-display-name
  - api-keys.vertex.models-force-mapping
  - api-keys.vertex.models-name
  - api-keys.xai.models-alias
  - api-keys.xai.models-display-name
  - api-keys.xai.models-force-mapping
  - api-keys.xai.models-is-compat
  - api-keys.xai.models-max-context-length
  - api-keys.xai.models-name
  - api-keys.xai.models-support-configuration-update
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Псевдонимы моделей upstream

## 1. Какую задачу решает этот раздел

Сопоставляет имя модели, которое использует клиент, с именем модели upstream и добавляет параметры отображения в каталоге, контекста, совместимости и изображений.

## 2. Когда применимо и чего здесь нет

Объём мышления на этой странице не описан. Псевдонимы OAuth здесь не описаны. Если один и тот же псевдоним появляется больше одного раза, шаблон говорит, что клиент всё равно видит одно имя, а запросы опрашивают эти имена upstream по кругу.

## 3. Как настроить или вызвать

```yaml
api-keys:
  claude:
    - name: claude-1
      models:
        - name: "claude-3-5-sonnet-20241022"
          alias: "claude-sonnet-latest"
          display-name: "Claude Sonnet"
          max-context-length: 0
          force-mapping: false
          is-compat: false
      keys:
        - api-key: "YOUR_API_KEY"
  openai-compatibility:
    - name: openrouter
      base-url: "https://example.invalid"
      keys:
        - api-key: "YOUR_API_KEY"
      models:
        - name: "upstream-model"
          alias: "client-model"
          image: false
          input-modalities: [text]
          output-modalities: [text]
          use-max-completion-tokens: false
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| api-keys.claude.models.alias | api-keys.claude.models.alias | empty string | Клиент использует это имя. В настройках OAuth точное совпадение псевдонима важнее совпадения имени. На одном уровне побеждает более поздняя запись. |
| api-keys.claude.models.display-name | api-keys.claude.models.display-name | empty string | При пропуске каталог не использует отдельное отображаемое имя. |
| api-keys.claude.models.force-mapping | api-keys.claude.models.force-mapping | false | При true поле модели в ответе записывается обратно как псевдоним. false не переписывает его. |
| api-keys.claude.models.is-compat | api-keys.claude.models.is-compat | Default false keeps the normal signature validation behavior. | false сохраняет обычную проверку подписи. true сохраняет thinking с пустой подписью и включает повтор подписи по провайдеру для моделей ключа API, совместимых с Claude. |
| api-keys.claude.models.max-context-length | api-keys.claude.models.max-context-length | 0 | 0 означает, что окно контекста, объявляемое клиенту Codex, не перекрывается. Перекрывает только положительное число. |
| api-keys.claude.models.name | api-keys.claude.models.name | empty string | Запрос отправляется на это имя модели upstream. Псевдонимы OAuth не действуют на группы api-keys. |
| api-keys.codex.models.alias | api-keys.codex.models.alias | empty string | Клиент использует это имя. В настройках OAuth точное совпадение псевдонима важнее совпадения имени. На одном уровне побеждает более поздняя запись. |
| api-keys.codex.models.display-name | api-keys.codex.models.display-name | empty string | При пропуске каталог не использует отдельное отображаемое имя. |
| api-keys.codex.models.force-mapping | api-keys.codex.models.force-mapping | false | При true поле модели в ответе записывается обратно как псевдоним. false не переписывает его. |
| api-keys.codex.models.is-compat | api-keys.codex.models.is-compat | Default false keeps the native behavior unchanged. | agent_message MultiAgentV2 преобразуется в переносимый ввод Responses только когда client.codex.optimize-multi-agent-v2 тоже true. false сохраняет нативное поведение. |
| api-keys.codex.models.max-context-length | api-keys.codex.models.max-context-length | 0 | 0 означает, что окно контекста, объявляемое клиенту Codex, не перекрывается. Перекрывает только положительное число. |
| api-keys.codex.models.name | api-keys.codex.models.name | empty string | Запрос отправляется на это имя модели upstream. Псевдонимы OAuth не действуют на группы api-keys. |
| api-keys.codex.models.support-configuration-update | api-keys.codex.models.support-configuration-update | It defaults to false, independently of the built-in OAuth model catalog. | По умолчанию false, и встроенный каталог моделей OAuth на него не влияет. Только true включает configuration_update для этой модели ключа API. |
| api-keys.gemini.models.alias | api-keys.gemini.models.alias | empty string | Клиент использует это имя. В настройках OAuth точное совпадение псевдонима важнее совпадения имени. На одном уровне побеждает более поздняя запись. |
| api-keys.gemini.models.display-name | api-keys.gemini.models.display-name | empty string | При пропуске каталог не использует отдельное отображаемое имя. |
| api-keys.gemini.models.force-mapping | api-keys.gemini.models.force-mapping | false | При true поле модели в ответе записывается обратно как псевдоним. false не переписывает его. |
| api-keys.gemini.models.is-compat | api-keys.gemini.models.is-compat | Default false keeps the normal signature validation behavior. | false сохраняет обычную проверку подписи. true сохраняет thinking с пустой подписью для совместимого upstream. |
| api-keys.gemini.models.max-context-length | api-keys.gemini.models.max-context-length | 0 | 0 означает, что окно контекста, объявляемое клиенту Codex, не перекрывается. Перекрывает только положительное число. |
| api-keys.gemini.models.name | api-keys.gemini.models.name | empty string | Запрос отправляется на это имя модели upstream. Псевдонимы OAuth не действуют на группы api-keys. |
| api-keys.interactions.models.alias | api-keys.interactions.models.alias | empty string | Клиент использует это имя. В настройках OAuth точное совпадение псевдонима важнее совпадения имени. На одном уровне побеждает более поздняя запись. |
| api-keys.interactions.models.display-name | api-keys.interactions.models.display-name | empty string | При пропуске каталог не использует отдельное отображаемое имя. |
| api-keys.interactions.models.force-mapping | api-keys.interactions.models.force-mapping | false | При true поле модели в ответе записывается обратно как псевдоним. false не переписывает его. |
| api-keys.interactions.models.is-compat | api-keys.interactions.models.is-compat | Default false keeps the normal signature validation behavior. | false сохраняет обычную проверку подписи. true сохраняет thinking с пустой подписью для совместимого upstream. |
| api-keys.interactions.models.max-context-length | api-keys.interactions.models.max-context-length | 0 | 0 означает, что окно контекста, объявляемое клиенту Codex, не перекрывается. Перекрывает только положительное число. |
| api-keys.interactions.models.name | api-keys.interactions.models.name | empty string | Запрос отправляется на это имя модели upstream. Псевдонимы OAuth не действуют на группы api-keys. |
| api-keys.meta.models.alias | api-keys.meta.models.alias | empty string | Клиент использует это имя. В настройках OAuth точное совпадение псевдонима важнее совпадения имени. На одном уровне побеждает более поздняя запись. |
| api-keys.meta.models.display-name | api-keys.meta.models.display-name | empty string | При пропуске каталог не использует отдельное отображаемое имя. |
| api-keys.meta.models.force-mapping | api-keys.meta.models.force-mapping | false | При true поле модели в ответе записывается обратно как псевдоним. false не переписывает его. |
| api-keys.meta.models.is-compat | api-keys.meta.models.is-compat | Default false keeps the native behavior unchanged. | agent_message MultiAgentV2 преобразуется в переносимый ввод Responses только когда client.codex.optimize-multi-agent-v2 тоже true. false сохраняет нативное поведение. |
| api-keys.meta.models.max-context-length | api-keys.meta.models.max-context-length | 0 | 0 означает, что окно контекста, объявляемое клиенту Codex, не перекрывается. Перекрывает только положительное число. |
| api-keys.meta.models.name | api-keys.meta.models.name | empty string | Запрос отправляется на это имя модели upstream. Псевдонимы OAuth не действуют на группы api-keys. |
| api-keys.meta.models.support-configuration-update | api-keys.meta.models.support-configuration-update | It defaults to false, independently of the built-in OAuth model catalog. | По умолчанию false, и встроенный каталог моделей OAuth на него не влияет. Только true включает configuration_update для этой модели ключа API. |
| api-keys.openai-compatibility.models.alias | api-keys.openai-compatibility.models.alias | empty string | Клиент использует это имя. В настройках OAuth точное совпадение псевдонима важнее совпадения имени. На одном уровне побеждает более поздняя запись. |
| api-keys.openai-compatibility.models.display-name | api-keys.openai-compatibility.models.display-name | empty string | При пропуске каталог не использует отдельное отображаемое имя. |
| api-keys.openai-compatibility.models.force-mapping | api-keys.openai-compatibility.models.force-mapping | false | При true поле модели в ответе записывается обратно как псевдоним. false не переписывает его. |
| api-keys.openai-compatibility.models.image | api-keys.openai-compatibility.models.image | false | Только true разрешает /v1/images/generations и /v1/images/edits. Это не означает, что ввод диалога поддерживает изображения. |
| api-keys.openai-compatibility.models.input-modalities | api-keys.openai-compatibility.models.input-modalities | nil | Например text и image. Это возможность ввода для диалога и Responses, а не переключатель конечной точки изображений. |
| api-keys.openai-compatibility.models.is-compat | api-keys.openai-compatibility.models.is-compat | Default false keeps the normal signature validation behavior. | false сохраняет обычную проверку подписи. true сохраняет блоки thinking Claude для совместимого upstream. |
| api-keys.openai-compatibility.models.max-context-length | api-keys.openai-compatibility.models.max-context-length | 0 | 0 означает, что окно контекста, объявляемое клиенту Codex, не перекрывается. Перекрывает только положительное число. |
| api-keys.openai-compatibility.models.name | api-keys.openai-compatibility.models.name | empty string | Запрос отправляется на это имя модели upstream. Псевдонимы OAuth не действуют на группы api-keys. |
| api-keys.openai-compatibility.models.output-modalities | api-keys.openai-compatibility.models.output-modalities | nil | Если известно, объявите модальности вывода, например text и image. Пропуск означает, что дополнительного объявления нет. |
| api-keys.openai-compatibility.models.use-max-completion-tokens | api-keys.openai-compatibility.models.use-max-completion-tokens | Default false preserves max_tokens for older compatible upstreams. | false продолжает отправлять max_tokens. true переходит на max_completion_tokens. |
| api-keys.vertex.models.alias | api-keys.vertex.models.alias | empty string | Клиент использует это имя. В настройках OAuth точное совпадение псевдонима важнее совпадения имени. На одном уровне побеждает более поздняя запись. |
| api-keys.vertex.models.display-name | api-keys.vertex.models.display-name | empty string | При пропуске каталог не использует отдельное отображаемое имя. |
| api-keys.vertex.models.force-mapping | api-keys.vertex.models.force-mapping | false | При true поле модели в ответе записывается обратно как псевдоним. false не переписывает его. |
| api-keys.vertex.models.name | api-keys.vertex.models.name | empty string | Запрос отправляется на это имя модели upstream. Псевдонимы OAuth не действуют на группы api-keys. |
| api-keys.xai.models.alias | api-keys.xai.models.alias | empty string | Клиент использует это имя. В настройках OAuth точное совпадение псевдонима важнее совпадения имени. На одном уровне побеждает более поздняя запись. |
| api-keys.xai.models.display-name | api-keys.xai.models.display-name | empty string | При пропуске каталог не использует отдельное отображаемое имя. |
| api-keys.xai.models.force-mapping | api-keys.xai.models.force-mapping | false | При true поле модели в ответе записывается обратно как псевдоним. false не переписывает его. |
| api-keys.xai.models.is-compat | api-keys.xai.models.is-compat | Default false keeps the native behavior unchanged. | agent_message MultiAgentV2 преобразуется в переносимый ввод Responses только когда client.codex.optimize-multi-agent-v2 тоже true. false сохраняет нативное поведение. |
| api-keys.xai.models.max-context-length | api-keys.xai.models.max-context-length | 0 | 0 означает, что окно контекста, объявляемое клиенту Codex, не перекрывается. Перекрывает только положительное число. |
| api-keys.xai.models.name | api-keys.xai.models.name | empty string | Запрос отправляется на это имя модели upstream. Псевдонимы OAuth не действуют на группы api-keys. |
| api-keys.xai.models.support-configuration-update | api-keys.xai.models.support-configuration-update | It defaults to false, independently of the built-in OAuth model catalog. | По умолчанию false, и встроенный каталог моделей OAuth на него не влияет. Только true включает configuration_update для этой модели ключа API. |

## 5. Типичные ошибки и границы

Эти поля загружаются по типу. is-compat в форме Codex преобразует agent_message только когда client.codex.optimize-multi-agent-v2 тоже true. image открывает только два маршрута изображений. Это не означает, что диалог может принять изображение.

## 6. Связанные возможности

Псевдонимы OAuth описаны в разделе [Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth).

## 7. Практический опыт

- [Псевдоним участвует в опросе только когда совпадает с запрошенным именем модели](/ru/experience/accounts#exp-accounts-alias-matches-request)
- [Совместимому провайдеру нужны и базовый адрес, и псевдоним](/ru/experience/accounts#exp-accounts-compat-base-and-alias)
- [Совместимые модели сохраняют подписанное мышление](/ru/experience/accounts#exp-accounts-compat-preserves-signed-thinking)
- [Отображаемое имя и псевдоним — два поля](/ru/experience/accounts#exp-accounts-display-name-field)
- [force-mapping меняет модель ответа на псевдоним](/ru/experience/accounts#exp-accounts-force-mapping-alias)
- [Совместимая модель появляется в списке только после записи в конфигурацию](/ru/experience/accounts#exp-accounts-list-compat-models)
- [Подключайте третью сторону через раздел, совместимый с OpenAI](/ru/experience/accounts#exp-accounts-openai-compatible-provider)
- [Сжатию нужна модель сжатия от upstream](/ru/experience/api#exp-api-compaction-needs-model)
- [Измените объявляемое окно через max-context-length](/ru/experience/configuration#exp-configuration-advertise-context-length)
- [Используйте псевдоним fork, чтобы различать размеры изображений](/ru/experience/routing#exp-routing-fork-alias-for-image-size)
- [Одноимённые модели используют одну стратегию маршрутизации](/ru/experience/routing#exp-routing-same-model-name)

