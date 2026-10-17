---
title: Каталог OAuth, псевдонимы и исключения
feature_ids:
  - oauth.auth-auto-refresh-workers.value
  - oauth.auth-dir.value
  - oauth.excluded-models.value
  - oauth.model-alias.alias
  - oauth.model-alias.display-name
  - oauth.model-alias.force-mapping
  - oauth.model-alias.fork
  - oauth.model-alias.name
  - oauth.providers.devin-sensitive-words
  - oauth.request-scoped-errors.action
  - oauth.request-scoped-errors.match
  - oauth.request-scoped-errors.match-regexr
  - oauth.request-scoped-errors.status
  - oauth.settings.alias
  - oauth.settings.max-context-length
  - oauth.settings.name
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Каталог OAuth, псевдонимы и исключения

## 1. Какую задачу решает этот раздел

Здесь собраны каталог файловых учётных данных OAuth, потоки обновления, псевдонимы моделей, настройки контекста, глобальные исключения и правила ошибок по провайдеру.

## 2. Когда применимо и чего здесь нет

Это не применяется к группам `api-keys`. Команды входа провайдеров на этой странице не описаны. Каналы псевдонимов следуют перечисленным в шаблоне: vertex, aistudio, antigravity, claude, codex, kimi, xai и meta. Ключ провайдера плагина тоже может появиться в том же отображении.

## 3. Как настроить или вызвать

```yaml
oauth:
  auth-dir: "~/.cli-proxy-api"
  auth-auto-refresh-workers: 16
  model-alias:
    codex:
      - name: "gpt-5"
        alias: "g5"
        fork: false
        display-name: "GPT-5"
        force-mapping: false
  settings:
    codex:
      - name: "gpt-5"
        alias: "g5"
        max-context-length: 0
  excluded-models:
    codex:
      - "gpt-5-codex-mini"
  request-scoped-errors:
    codex:
      - status: 400
        match:
          - "context_window_exceeded"
        match-regexr:
          - "context_window_exceeded$"
        action: "stop"
  providers:
    devin:
      sensitive-words:
        - "API"
```

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| oauth.auth-auto-refresh-workers | oauth.auth-auto-refresh-workers | When <= 0, the default worker count is used. | Больше 0 перекрывает значение 16 по умолчанию. Меньше или равно 0 всё равно использует 16. |
| oauth.auth-dir | oauth.auth-dir | empty string | Пустое значение разрешается в ~/.cli-proxy-api. Значение, начинающееся с ~, раскрывается в домашний каталог пользователя. |
| oauth.excluded-models | oauth.excluded-models | nil | oauth.excluded-models |
| oauth.model-alias.alias | Имя модели, которое видит клиент. | empty string | Клиент использует это имя. В настройках OAuth точное совпадение псевдонима важнее совпадения имени. На одном уровне побеждает более поздняя запись. |
| oauth.model-alias.display-name | Читаемое имя, показываемое в каталоге. | empty string | При пропуске каталог не использует отдельное отображаемое имя. |
| oauth.model-alias.force-mapping | Записывать поле модели в ответе upstream обратно как псевдоним клиента. | false | При true поле модели в ответе записывается обратно как псевдоним. false не переписывает его. |
| oauth.model-alias.fork | Открывать ли псевдоним, сохраняя исходное имя модели. | false | При true исходный ID модели остаётся, а псевдоним появляется как дополнительная модель клиента. |
| oauth.model-alias.name | Имя модели, отправляемое upstream, или имя модели, которому должна соответствовать настройка OAuth. | empty string | Запрос отправляется на это имя модели upstream. Псевдонимы OAuth не действуют на группы api-keys. |
| oauth.providers.devin.sensitive-words | oauth.providers.devin.sensitive-words | nil | Перечисленные слова в соответствующей подсказке разбиваются символами нулевой ширины. При пропуске не обрабатываются. |
| oauth.request-scoped-errors.action | Что делать с этой ошибкой upstream после совпадения. | empty string | Используются только stop, stop-and-cooldown, continue и continue-and-cooldown. В глобальном правиле OAuth пустое действие отбрасывается и отдельно не сообщается как ошибка. |
| oauth.request-scoped-errors.match | Сопоставлять тело ошибки upstream подстрокой. | nil | При пропуске сопоставления по подстроке нет. Если код состояния не положителен или и подстрока, и регулярное выражение пусты, это правило OAuth отбрасывается. |
| oauth.request-scoped-errors.match-regexr | Сопоставлять тело ошибки upstream регулярным выражением. | nil | При пропуске сопоставления по регулярному выражению нет. Пустые элементы удаляются. |
| oauth.request-scoped-errors.status | Код состояния HTTP upstream для сопоставления. | 0 | oauth.request-scoped-errors.status |
| oauth.settings.alias | Имя модели, которое видит клиент. | empty string | Клиент использует это имя. В настройках OAuth точное совпадение псевдонима важнее совпадения имени. На одном уровне побеждает более поздняя запись. |
| oauth.settings.max-context-length | Длина контекста, объявляемая клиенту Codex. | 0 | 0 означает, что окно контекста, объявляемое клиенту Codex, не перекрывается. Перекрывает только положительное число. |
| oauth.settings.name | Имя модели, отправляемое upstream, или имя модели, которому должна соответствовать настройка OAuth. | empty string | Запрос отправляется на это имя модели upstream. Псевдонимы OAuth не действуют на группы api-keys. |

## 5. Типичные ошибки и границы

Псевдонимы и настройки не приводят к ошибке загрузки из-за неизвестного имени канала. Правила OAuth уровня запроса отбрасывают запись, у которой код состояния не положителен, действие пусто или и подстрока, и регулярное выражение пусты. Они не роняют всю конфигурацию. Пустой каталог учётных данных разрешается в `~/.cli-proxy-api`. Если домашний каталог нельзя разрешить, при запуске записывается `failed to resolve auth directory`. Если число потоков обновления меньше или равно 0, всё равно используется 16.

## 6. Связанные возможности

Страницы входа — это входы провайдеров в боковой панели. Исключение ключей API описано в разделе [Исключённые модели ключа](/ru/accounts/api-keys-excluded).

## 7. Практический опыт

- [Сопоставьте имя модели клиента с настоящей моделью через псевдоним](/ru/experience/accounts#exp-accounts-alias-client-model)
- [Войдите снова после того, как учётные данные Antigravity перестали действовать](/ru/experience/accounts#exp-accounts-antigravity-login-again)
- [Оставьте две рабочие области для одной учётной записи Codex](/ru/experience/accounts#exp-accounts-codex-keep-workspaces)
- [Войдите в Codex снова после смены плана или токена](/ru/experience/accounts#exp-accounts-codex-login-again)
- [Копируйте учётные данные, копируя весь каталог](/ru/experience/accounts#exp-accounts-copy-auth-dir)
- [Направьте каталог учётных данных на выделенный путь](/ru/experience/accounts#exp-accounts-dedicated-auth-dir)
- [Исключите модель на одной учётной записи](/ru/experience/accounts#exp-accounts-exclude-model)
- [Вынесите файл из каталога, чтобы отключить учётные данные](/ru/experience/accounts#exp-accounts-move-auth-file)
- [Число потоков обновления 0 всё равно использует значение по умолчанию](/ru/experience/accounts#exp-accounts-refresh-workers-zero)
- [Обрабатывайте конкретный 429 правилом ошибки уровня запроса](/ru/experience/accounts#exp-accounts-request-scoped-error-action)
- [Передавайте клиентский ключ при вызове публичного маршрута](/ru/experience/api#exp-api-require-client-key)
- [Перезапустите после удаления учётных данных, чтобы обновился список моделей](/ru/experience/api#exp-api-restart-after-auth-removal)
- [Измените объявляемое окно через max-context-length](/ru/experience/configuration#exp-configuration-advertise-context-length)
- [Подготовьте конфигурацию и каталог учётных данных до запуска](/ru/experience/docker#exp-docker-prepare-auth-dir)
- [Задайте приоритет в поле учётных данных](/ru/experience/management#exp-management-set-credential-priority)
- [Журналы пишутся в доступный для записи каталог logs](/ru/experience/operations#exp-operations-log-directory)
- [Вход в управление использует secret-key](/ru/experience/operations#exp-operations-management-secret)
- [Псевдоним плюс переопределение выражают усилие Opus](/ru/experience/routing#exp-routing-alias-and-override-effort)
- [После 429 пропускайте эту модель до времени восстановления](/ru/experience/routing#exp-routing-cooldown-until-reset)
- [Выключите охлаждение, чтобы учётные данные оставались выбираемыми](/ru/experience/routing#exp-routing-disable-cooling)
- [Используйте псевдоним fork, чтобы различать размеры изображений](/ru/experience/routing#exp-routing-fork-alias-for-image-size)
- [Размер изображения записывается в imageConfig](/ru/experience/routing#exp-routing-gemini-image-config-path)
- [Одноимённые модели используют одну стратегию маршрутизации](/ru/experience/routing#exp-routing-same-model-name)
