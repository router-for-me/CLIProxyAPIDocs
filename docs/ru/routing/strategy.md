---
title: Стратегия маршрутизации
feature_ids:
  - routing.force-model-prefix.value
  - routing.retry.max-retry-credentials
  - routing.retry.max-retry-interval
  - routing.retry.request-retry
  - routing.session-affinity-rebind-on.value
  - routing.session-affinity-subagents.value
  - routing.session-affinity-ttl.value
  - routing.session-affinity.value
  - routing.strategy.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Стратегия маршрутизации

## 1. Какую задачу решает этот раздел

Здесь решается, какие из нескольких подходящих учётных данных использовать первыми, фиксировать ли один сеанс на одних учётных данных и после сбоя сколько ещё кругов можно сделать, сколько учётных данных пробовать в круге и как долго максимум ждать.

## 2. Когда применимо и чего здесь нет

Эти ключи принадлежат `routing`. Они не создают ключ upstream и не меняют `weight`, `priority` или `request-retry` на одном ключе. Уже установленная привязка сеанса важнее приоритета учётных данных. Приоритет всё ещё решает холодную привязку, запрос без сеанса и повторную привязку после переключения. Когда `session-affinity` равен false, ни наследование дочернего сеанса, ни условие перепривязки не действуют.

## 3. Как настроить или вызвать

```yaml
routing:
  strategy: "round-robin"
  session-affinity: false
  session-affinity-ttl: "1h"
  session-affinity-subagents: true
  session-affinity-rebind-on: "any"
  force-model-prefix: false
  retry:
    request-retry: 0
    max-retry-credentials: 0
    max-retry-interval: 0
```

В примере конфигурации `request-retry` записан как 3, а `max-retry-interval` как 30. Нулевые значения, когда поля не записаны, всё равно являются defaults в таблице.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| routing.force-model-prefix | Может ли имя модели без префикса попасть только на учётные данные без префикса. | false | При true запрос без префикса использует только учётные данные без префикса, если сам префикс не равен имени модели. При false запрос без префикса может использовать и учётные данные с префиксом. Учётные данные с префиксом всё равно открывают prefix/model. |
| routing.retry.max-retry-credentials | Сколько разных учётных данных один круг может попробовать максимум. | 0 | 0 или отрицательное значение означает, что пробуются все годные учётные данные этого круга. Отрицательное значение при загрузке и во время работы нормализуется в 0. Учётные данные, пропущенные из-за предела, всё равно стареют вместе с глобальными кругами. |
| routing.retry.max-retry-interval | Самое долгое ожидание охлаждения в секундах перед следующим кругом. | 0 | Неположительное значение не разрешает положительное ожидание охлаждения, но не выключает переключение в том же круге и не выключает последующие круги, которым ожидание не нужно. |
| routing.retry.request-retry | Сколько кругов учётных данных ещё можно выполнить после круга 0. | 0 | Отрицательное значение считается 0. Круг r принимает только учётные данные, чьё действующее значение не меньше r. Явное неотрицательное значение на учётных данных или провайдере побеждает. Пропуск или отрицательное значение наследуют это. Явный 0 входит только в круг 0. Дополнительные круги применяются к HTTP 403, 408, 429, 500, 502, 503, 504 и временным ошибкам транспорта. |
| routing.session-affinity-rebind-on | Какие сбои перепривязывают уже привязанный сеанс к учётным данным переключения. | Supported values: - "any" (default): any credential-attributed failure unbinds and rebinds on failover. | Только quota меняет any по умолчанию. При quota 408, 5xx, пустой поток и предел буфера переключаются только для этого запроса и сохраняют исходную привязку. 429, 401, 402, 403, 404, неподдерживаемая модель или invalid_grant всё равно перепривязывают. Другое значение считается any. При выключенной привязке сеанса игнорируется. |
| routing.session-affinity-subagents | Повторно ли использует родительские учётные данные запрос со ссылкой на дочерний сеанс. | Default: true. | Пропуск или пустой указатель остаются true. При false дочерний сеанс идёт через запасной выбиратель. Действует только на Claude, Codex, Antigravity и Gemini. При выключенной привязке сеанса игнорируется. |
| routing.session-affinity-ttl | Как долго хранится привязка сеанса к учётным данным. | Default: 1h. | Во время работы по умолчанию 1h. Положительная длительность короче 1 секунды поднимается до 1 секунды. Пустое значение, неразбираемое или неположительная длительность остаются 1h. Можно записать 30m, 1h и 2h30m. |
| routing.session-affinity | Фиксирует сеанс на одних учётных данных upstream. | false | Сначала используются явные заголовки сеанса Claude Code, Codex, OpenCode и pi, затем prompt_cache_key, ID диалога Responses, старый ID тела запроса, идентификатор выполнения или производного сеанса и хеш содержимого сообщения. Если привязанные учётные данные недоступны, переключение всё равно происходит. |
| routing.strategy | Стратегия выбора учётных данных. | Supported values: "round-robin" (default), "weighted-round-robin", "fill-first". | round-robin, weighted-round-robin и fill-first. Псевдонимы roundrobin, rr, weightedroundrobin, wrr, fillfirst и ff нормализуются. Любое другое значение всё равно round-robin. Взвешенный выбор использует целый weight учётных данных. Пропуск равен 1. Максимум 1,000,000. Неположительное число исключает учётные данные, пока действует эта стратегия. fill-first берёт первые доступные учётные данные в фиксированном порядке. |

## 5. Типичные ошибки и границы

Нераспознанная `strategy` не сообщается как ошибка. Продолжает использоваться round-robin. Если `session-affinity-ttl` нельзя разобрать, конфигурация не отклоняется. Привязка всё равно хранится 1 час. Если `session-affinity-rebind-on` не `quota`, он считается `any`, и ошибка конфигурации не возвращается. Если глобальный `request-retry` отрицателен, он считается 0, и запуск не отклоняется.

## 6. Связанные возможности

Охлаждение описано в разделе [Охлаждение](/ru/routing/cooldown). Исходящий прокси — в разделе [Исходящие запросы](/ru/routing/requests-value). Вес учётных данных — в разделе [Вес учётных данных](/ru/accounts/api-keys-weight).

## 7. Практический опыт

- [Сопоставьте имя модели клиента с настоящей моделью через псевдоним](/ru/experience/accounts#exp-accounts-alias-client-model)
- [Псевдоним участвует в опросе только когда совпадает с запрошенным именем модели](/ru/experience/accounts#exp-accounts-alias-matches-request)
- [Режиму goal Codex нужны все три настройки сразу](/ru/experience/accounts#exp-accounts-codex-goal-mode)
- [Совместимые провайдеры используют одну стратегию маршрутизации](/ru/experience/routing#exp-routing-compat-shares-strategy)
- [После 429 пропускайте эту модель до времени восстановления](/ru/experience/routing#exp-routing-cooldown-until-reset)
- [Используйте fill-first, чтобы заполнить одни учётные данные](/ru/experience/routing#exp-routing-fill-first)
- [fill-first возвращается к прежней учётной записи после восстановления квоты](/ru/experience/routing#exp-routing-fill-first-recovers)
- [Если запрос без префикса не удался, проверьте принудительный префикс](/ru/experience/routing#exp-routing-force-prefix-off)
- [Опрос начинается только после исчерпания приоритета](/ru/experience/routing#exp-routing-priority-before-strategy)
- [responses чередуется по общему ключу кэша](/ru/experience/routing#exp-routing-responses-cache-key)
- [503 обрабатывается кругами повтора](/ru/experience/routing#exp-routing-retry-503)
- [Опрос пропускает учётные данные, которые не могут обслужить запрос](/ru/experience/routing#exp-routing-round-robin-skip)
- [Одноимённые модели используют одну стратегию маршрутизации](/ru/experience/routing#exp-routing-same-model-name)
- [Включите привязку сеанса, чтобы сохранить зашифрованное рассуждение](/ru/experience/routing#exp-routing-session-affinity)
- [Для повтора 429 используйте существующие повтор и охлаждение](/ru/experience/routing#exp-routing-tune-retry-and-cooling)
