---
title: Поведение Claude upstream
feature_ids:
  - upstream.claude.disable-claude-cloak-mode
  - upstream.claude.disable-cloaking-model-list
  - upstream.claude.header-defaults-anthropic-beta-append
  - upstream.claude.header-defaults-anthropic-beta-strip
  - upstream.claude.header-defaults-arch
  - upstream.claude.header-defaults-client-request-id
  - upstream.claude.header-defaults-inject-diagnostics
  - upstream.claude.header-defaults-os
  - upstream.claude.header-defaults-package-version
  - upstream.claude.header-defaults-runtime-version
  - upstream.claude.header-defaults-stabilize-device-profile
  - upstream.claude.header-defaults-timeout
  - upstream.claude.header-defaults-timezone
  - upstream.claude.header-defaults-user-agent
  - upstream.claude.model-level-cooling
  - upstream.claude.session-date-pin-days
  - upstream.claude.tool-search
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Поведение Claude upstream

## 1. Какую задачу решает этот раздел

Здесь описаны маскировка, список моделей, базовая линия отпечатка, поиск инструментов, охлаждение на уровне модели и дата сеанса, общие для всех учётных данных Claude.

## 2. Когда применимо и чего здесь нет

cloak и fingerprint-profile одного ключа API на этой странице не описаны. Переключатели Codex upstream находятся на странице параметров провайдера Codex.

## 3. Как настроить или вызвать

```yaml
upstream:
  claude:
    model-level-cooling: false
    tool-search: false
    session-date-pin-days: 7
    disable-claude-cloak-mode: false
    disable-cloaking-model-list: false
    header-defaults:
      user-agent: ""
      package-version: ""
      runtime-version: ""
      os: ""
      arch: ""
      timeout: ""
      timezone: ""
      stabilize-device-profile: false
      anthropic-beta-strip: []
      anthropic-beta-append: []
      inject-diagnostics: false
      client-request-id: "on"
```

Если `session-date-pin-days` опущено, считается 7 дней. Явный 0 сохраняет дату непрерывности на 1 час. Строки версий в шаблоне — только примеры. Это не значения по умолчанию в коде.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| upstream.claude.disable-claude-cloak-mode | Делают ли учётные данные Claude по умолчанию запросы без маскировки. | When true, every Claude credential defaults to no cloaking ("never"); a specific credential can still re-enable or override it via its own cloak settings (the per claude-api-key "cloak" block, or a "cloak_mode" value in the auth/OAuth token file). | auto: не маскировать, когда есть явный сигнал нативного входа. always: маскировать неподтверждённых клиентов, а подтверждённый нативный Claude Code всё равно проходит напрямую. never: не маскировать. Запись блока cloak включает маскировку для ключа API без заданного отпечатка. |
| upstream.claude.disable-cloaking-model-list | Возвращает ли список моделей исходные ID моделей. | false | При true список моделей Anthropic возвращает исходные ID моделей. |
| upstream.claude.header-defaults.anthropic-beta-append | upstream.claude.header-defaults.anthropic-beta-append | nil | После удаления добавляет точные имена, которых ещё нет. |
| upstream.claude.header-defaults.anthropic-beta-strip | upstream.claude.header-defaults.anthropic-beta-strip | nil | Удаляет по точному имени и сохраняет порядок остальных. Пустые и повторяющиеся элементы удаляются. |
| upstream.claude.header-defaults.arch | upstream.claude.header-defaults.arch | empty string | Фиксируется только когда stabilize-device-profile равен true. |
| upstream.claude.header-defaults.client-request-id | upstream.claude.header-defaults.client-request-id | empty string | Пустое значение и on создают UUID. passthrough пересылает только значение вызывающего. off не отправляет. Другое значение предупреждает и откатывается к пустому, то есть on. |
| upstream.claude.header-defaults.inject-diagnostics | upstream.claude.header-defaults.inject-diagnostics | nil | При пропуске отпечаток Claude Code CLI всё ещё внедряет diagnostics. Явный false прекращает внедрение и вместе с ним beta cache-diagnosis. |
| upstream.claude.header-defaults.os | upstream.claude.header-defaults.os | empty string | Фиксируется только когда stabilize-device-profile равен true. |
| upstream.claude.header-defaults.package-version | upstream.claude.header-defaults.package-version | empty string | Пустое значение не задаёт базовую линию версии пакета. |
| upstream.claude.header-defaults.runtime-version | upstream.claude.header-defaults.runtime-version | empty string | Пустое значение не задаёт базовую линию версии среды выполнения. |
| upstream.claude.header-defaults.stabilize-device-profile | upstream.claude.header-defaults.stabilize-device-profile | nil | true фиксирует операционную систему и архитектуру и больше не учит автоматически более новую версию программы. |
| upstream.claude.header-defaults.timeout | upstream.claude.header-defaults.timeout | empty string | Пустое значение не даёт отката тайм-аута. |
| upstream.claude.header-defaults.timezone | upstream.claude.header-defaults.timezone | empty string | timezone в JSON учётных данных важнее. Пустое значение не задаёт запасной часовой пояс. |
| upstream.claude.header-defaults.user-agent | upstream.claude.header-defaults.user-agent | empty string | Пустое значение не внедряется. Только проверенный нативный клиент, чья версия совпадает с базовой линией, сохраняет собственную форму. |
| upstream.claude.model-level-cooling | Действует ли охлаждение квоты только на текущую модель. | false | upstream.claude.model-level-cooling |
| upstream.claude.session-date-pin-days | Сколько дней currentDate для маскировки хранится для сеанса. | A nil value (unset) defaults to 7 days; an explicit 0 keeps the continuity-scoped pin (1h lifetime). | При пропуске это 7 дней. Явный 0 сохраняет дату непрерывности на 1 час. Слишком большое число дней обрезается, чтобы длительность не переполнилась. |
| upstream.claude.tool-search | Включать ли Codex tool_search на пути Claude Responses. | Default false keeps the translation that predates tool_search support. | При true Codex tool_search включается на пути Claude Responses. Официальный адрес или ключ с native-tool-search true использует нативный поиск. |

## 5. Типичные ошибки и границы

Если `client-request-id` не on, off, passthrough и не пуст, загрузка предупреждает и откатывается к пустому значению. Пустое означает on. Нераспознанное значение не приводит к ошибке загрузки конфигурации. Имена Anthropic-Beta сопоставляются точной строкой. Пустые и повторяющиеся элементы удаляются.

## 6. Связанные возможности

Маскировка одного ключа описана в разделе [Маскировка запросов Claude](/ru/accounts/api-keys-cloak). Отпечаток — в разделе [Отпечаток Claude](/ru/accounts/api-keys-fingerprint).

## 7. Практический опыт

- [Выключите маскировку Claude, если она не нужна](/ru/experience/accounts#exp-accounts-claude-cloak-off)
