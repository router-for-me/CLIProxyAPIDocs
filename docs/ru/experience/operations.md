---
title: "Эксплуатация"
related_feature_ids:
  - auth.claude.login
  - cli.server.antigravity-login
  - cli.server.codex-login
  - cli.server.config
  - cli.server.tui
  - management.allow-remote.value
  - management.disable-control-panel.value
  - management.secret-key.value
  - management.v8.get-observability-usage-api-keys
  - management.v8.get-observability-usage-queue
  - models.catalog.value
  - oauth.auth-dir.value
  - observability.logs.debug
  - observability.logs.logging-to-file
  - observability.logs.logs-max-total-size-mb
  - observability.logs.request-log
  - observability.usage.usage-statistics-enabled
  - route.management-html.get
  - server.commercial-mode.value
  - server.host.value
  - server.port.value
  - server.tls.cert
  - server.tls.enable
  - server.tls.key
source_issues:
  - 56
  - 190
  - 541
  - 635
  - 681
  - 844
  - 863
  - 944
  - 954
  - 1020
  - 1393
  - 1497
  - 1589
  - 1772
  - 1790
  - 2195
  - 2315
  - 2498
  - 2541
  - 2617
  - 2828
  - 2925
  - 2955
  - 3035
  - 3220
  - 3270
  - 3405
  - 3732
  - 3743
  - 4019
  - 4483
  - 4807
  - 5314
  - 5972
  - 6060
  - 6323
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Эксплуатация

## Версия и границы

Практики на этой странице сверены только с конфигурацией, маршрутами или командами, которые ещё есть в закреплённом коммите `911f49cbd49f4fe2516979754a7488a3fd14fe64`. Эта страница не является официальным обещанием поведения. Ключи, cookie, адреса электронной почты, файлы авторизации и тела запросов пользователей сюда не копировались.

## Короткие практики

- <a id="exp-operations-usage-stays-in-memory"></a>**Использование остаётся только в памяти** (`exp.operations.usage-stays-in-memory`). Явление: После перезапуска или обновления использование обнуляется, и в панели нет истории. Действие: Сначала включите usage-statistics-enabled. Счётчики можно смотреть через GET /v8/management/observability/usage/api-keys. Записи забираются через GET /v8/management/observability/usage/queue. Прокси не пишет их на диск, и интерфейса восстановления нет. Источники issue: [#541](https://github.com/router-for-me/CLIProxyAPI/issues/541)、[#681](https://github.com/router-for-me/CLIProxyAPI/issues/681)、[#863](https://github.com/router-for-me/CLIProxyAPI/issues/863)、[#1497](https://github.com/router-for-me/CLIProxyAPI/issues/1497)、[#1589](https://github.com/router-for-me/CLIProxyAPI/issues/1589)、[#2828](https://github.com/router-for-me/CLIProxyAPI/issues/2828)、[#2955](https://github.com/router-for-me/CLIProxyAPI/issues/2955)、[#3035](https://github.com/router-for-me/CLIProxyAPI/issues/3035)、[#3220](https://github.com/router-for-me/CLIProxyAPI/issues/3220)。. Официальные страницы: [Наблюдаемость](/ru/management/v8-observability)、[Журналы и использование](/ru/operations/observability).
- <a id="exp-operations-request-log-text"></a>**Смотрите исходный текст в журнале запросов** (`exp.operations.request-log-text`). Явление: Использование равно нулю, или нужно подтвердить, записан ли запрос. Действие: request-log — переключатель конфигурации. После включения журнал — читаемый текст, а не структурный поток. Если upstream опускает использование, по нему смотрят исходное тело. Если ещё включён debug, журнал пишет имя выбранного файла учётных данных. Источники issue: [#1020](https://github.com/router-for-me/CLIProxyAPI/issues/1020)、[#1772](https://github.com/router-for-me/CLIProxyAPI/issues/1772)、[#3732](https://github.com/router-for-me/CLIProxyAPI/issues/3732)、[#4807](https://github.com/router-for-me/CLIProxyAPI/issues/4807)、[#5314](https://github.com/router-for-me/CLIProxyAPI/issues/5314)。. Официальные страницы: [Журналы и использование](/ru/operations/observability).
- <a id="exp-operations-cap-request-logs"></a>**Ограничьте общий размер журналов запросов** (`exp.operations.cap-request-logs`). Явление: После включения request-log диск или том Docker продолжает расти. Действие: Задайте logs-max-total-size-mb положительным числом. Самые старые журналы удаляются только после превышения этого предела. 0 означает без очистки. Источники issue: [#2498](https://github.com/router-for-me/CLIProxyAPI/issues/2498)、[#3405](https://github.com/router-for-me/CLIProxyAPI/issues/3405)。. Официальные страницы: [Журналы и использование](/ru/operations/observability).
- <a id="exp-operations-disable-request-log"></a>**Выключите журнал запросов, чтобы остановить поток** (`exp.operations.disable-request-log`). Явление: После запуска журналы запросов резко растут. Действие: Задайте request-log равным false и пусть клиент перестанет отправлять слишком большие подсказки. Источники issue: [#635](https://github.com/router-for-me/CLIProxyAPI/issues/635)。. Официальные страницы: [Журналы и использование](/ru/operations/observability).
- <a id="exp-operations-management-secret"></a>**Вход в управление использует secret-key** (`exp.operations.management-secret`). Явление: Удалённый или веб-доступ не открывает сторону управления, или пароль управления не удаётся вспомнить. Действие: Ключ управления — это secret-key в конфигурации, и он должен совпадать с MANAGEMENT_PASSWORD. Для удалённого доступа также задайте allow-remote равным true. Сервер не может восстановить старый пароль из хеша. Учётные данные, созданные этим проектом, можно использовать, скопировав их в auth-dir. Источники issue: [#56](https://github.com/router-for-me/CLIProxyAPI/issues/56)、[#844](https://github.com/router-for-me/CLIProxyAPI/issues/844)、[#2315](https://github.com/router-for-me/CLIProxyAPI/issues/2315)、[#2617](https://github.com/router-for-me/CLIProxyAPI/issues/2617)、[#2925](https://github.com/router-for-me/CLIProxyAPI/issues/2925)、[#3270](https://github.com/router-for-me/CLIProxyAPI/issues/3270)。. Официальные страницы: [Параметры командной строки](/ru/introduction/install)、[Параметры управления](/ru/operations/management-settings)、[Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth)、[Прочие конечные точки](/ru/api/openai-other).
- <a id="exp-operations-bind-host-port"></a>**Пустой host слушает все интерфейсы** (`exp.operations.bind-host-port`). Явление: Служба должна привязаться только к одному адресу, или смысл пустого host неясен. Действие: Когда server.host пуст, она слушает все интерфейсы на server.port. Заполняйте host, только если нужен конкретный адрес. Источники issue: [#190](https://github.com/router-for-me/CLIProxyAPI/issues/190)。. Официальные страницы: [Прослушивание и процесс](/ru/operations/server).
- <a id="exp-operations-reduce-memory"></a>**Выключите дорогие журналы, чтобы снизить память** (`exp.operations.reduce-memory`). Явление: Память процесса растёт вместе с запросами. Действие: Выключите usage-statistics-enabled, request-log и debug. Чтобы ещё снизить накладные расходы на запрос, задайте server.commercial-mode равным true. Тогда промежуточный слой журнала запросов не подключается. Источники issue: [#944](https://github.com/router-for-me/CLIProxyAPI/issues/944)。. Официальные страницы: [Журналы и использование](/ru/operations/observability)、[Прослушивание и процесс](/ru/operations/server).
- <a id="exp-operations-log-directory"></a>**Журналы пишутся в доступный для записи каталог logs** (`exp.operations.log-directory`). Явление: В каталоге конфигурации Home журналов нет. Действие: Журналы приложения и request-log сначала пишутся в logs под доступным для записи базовым каталогом. Если этого каталога нет, используется logs текущего каталога. В auth-dir/logs они попадают, только если текущий каталог недоступен для записи. Источники issue: [#954](https://github.com/router-for-me/CLIProxyAPI/issues/954)、[#5972](https://github.com/router-for-me/CLIProxyAPI/issues/5972)。. Официальные страницы: [Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth)、[Журналы и использование](/ru/operations/observability).
- <a id="exp-operations-auth-unavailable-means-no-credential"></a>**auth_unavailable означает, что нет доступных учётных данных** (`exp.operations.auth-unavailable-means-no-credential`). Явление: Запрос возвращает auth_unavailable, и это принимают за отклонённое тело. Действие: Это значит, что у этой модели нет учётных данных, которые можно выбрать. Это не значит, что тело запроса недопустимо. Включите request-log, чтобы увидеть, почему модель скрыта. Имя модели в каталоге также не значит, что пригодные учётные данные Claude или Codex уже есть. Источники issue: [#1393](https://github.com/router-for-me/CLIProxyAPI/issues/1393)、[#6060](https://github.com/router-for-me/CLIProxyAPI/issues/6060)、[#6323](https://github.com/router-for-me/CLIProxyAPI/issues/6323)。. Официальные страницы: [Вход Claude](/ru/accounts/claude)、[Вход Antigravity](/ru/accounts/antigravity)、[Вход Codex](/ru/accounts/codex)、[Каталоги моделей](/ru/introduction/models)、[Журналы и использование](/ru/operations/observability).
- <a id="exp-operations-tui-is-client"></a>**TUI по умолчанию только клиент управления** (`exp.operations.tui-is-client`). Явление: После выхода --tui останавливается и прокси, либо наоборот кажется, что он поднимет службу. Действие: --tui без --standalone только подключается к уже работающему API управления. Сам он процесс прокси не удерживает. Источники issue: [#1790](https://github.com/router-for-me/CLIProxyAPI/issues/1790)。. Официальные страницы: [Терминальный интерфейс](/ru/operations/tui).
- <a id="exp-operations-tls-needs-cert"></a>**При включении TLS нужен сертификат** (`exp.operations.tls-needs-cert`). Явление: После включения TLS HTTPS не запускается. Действие: Когда server.tls.enable равен true, ни tls.cert, ни tls.key не могут быть пустыми. Источники issue: [#2195](https://github.com/router-for-me/CLIProxyAPI/issues/2195)。. Официальные страницы: [TLS](/ru/operations/tls).
- <a id="exp-operations-panel-route-is-html"></a>**После выключения панели нет адреса управления с хешем** (`exp.operations.panel-route-is-html`). Явление: URL управления с хешем возвращает 404. Действие: Когда disable-control-panel равен true, панель не предоставляется. Маршрут панели — только management.html. Другого адреса с хешем нет. Источники issue: [#2541](https://github.com/router-for-me/CLIProxyAPI/issues/2541)。. Официальные страницы: [Параметры управления](/ru/operations/management-settings)、[Прочие конечные точки](/ru/api/openai-other).
- <a id="exp-operations-port-already-bound"></a>**Если порт уже занят, сначала остановите старый процесс** (`exp.operations.port-already-bound`). Явление: При запуске виден баннер версии для разработки или конфликт порта. Действие: Другой процесс уже занял server.port. Остановите старый процесс и затем запускайте снова. Источники issue: [#3743](https://github.com/router-for-me/CLIProxyAPI/issues/3743)。. Официальные страницы: [Прослушивание и процесс](/ru/operations/server).
- <a id="exp-operations-disconnect-drops-usage"></a>**После отключения клиента нет итогового использования** (`exp.operations.disconnect-drops-usage`). Явление: В статистике использования нет последнего блока. Действие: Отключение клиента отменяет вызов upstream, поэтому итоговый блок использования не приходит. Сама статистика по-прежнему только в памяти, и она может включать счётчики чтения и создания кэша. Источники issue: [#4019](https://github.com/router-for-me/CLIProxyAPI/issues/4019)、[#4483](https://github.com/router-for-me/CLIProxyAPI/issues/4483)。. Официальные страницы: [Журналы и использование](/ru/operations/observability).

## Отдельные страницы

В этой области нет практики, которой нужна отдельная страница.

