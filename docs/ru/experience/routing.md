---
title: "Маршрутизация и запросы"
related_feature_ids:
  - api-keys.claude.prefix
  - api-keys.claude.priority
  - api-keys.claude.proxy-url
  - api-keys.codex.models-name
  - api-keys.codex.models-thinking-levels
  - api-keys.codex.priority
  - api-keys.codex.proxy-url
  - api-keys.gemini.api-key
  - api-keys.gemini.proxy-url
  - api-keys.openai-compatibility.base-url
  - api-keys.openai-compatibility.models-alias
  - api-keys.openai-compatibility.name
  - api-keys.xai.models-thinking-levels
  - cli.server.antigravity-login
  - cli.server.claude-login
  - cli.server.codex-login
  - cli.server.xai-login
  - management.disable-control-panel.value
  - management.secret-key.value
  - management.v8.get-credentials
  - mode.docker.compose
  - models.codex-catalog.value
  - multimedia.gpt-image-2-base-model.value
  - oauth.auth-dir.value
  - oauth.model-alias.alias
  - oauth.model-alias.fork
  - requests.payload.default-params
  - requests.payload.filter-params
  - requests.payload.override-params
  - requests.proxy-url.value
  - requests.streaming.keepalive-seconds
  - route.management-html.get
  - route.v1.get-models
  - route.v1.post-chat-completions
  - route.v1.post-messages
  - route.v1.post-responses
  - routing.cooldown.disable-cooling
  - routing.cooldown.save-cooldown-status
  - routing.force-model-prefix.value
  - routing.retry.max-retry-interval
  - routing.retry.request-retry
  - routing.session-affinity.value
  - routing.strategy.value
source_issues:
  - 48
  - 178
  - 197
  - 304
  - 417
  - 480
  - 557
  - 690
  - 711
  - 737
  - 768
  - 784
  - 845
  - 847
  - 893
  - 937
  - 966
  - 976
  - 1021
  - 1044
  - 1072
  - 1089
  - 1160
  - 1186
  - 1213
  - 1217
  - 1236
  - 1256
  - 1290
  - 1304
  - 1376
  - 1382
  - 1456
  - 1647
  - 1712
  - 1740
  - 1749
  - 1793
  - 2050
  - 2107
  - 2180
  - 2261
  - 2352
  - 2369
  - 2378
  - 2404
  - 2425
  - 2470
  - 2546
  - 2593
  - 2611
  - 2632
  - 2687
  - 2758
  - 2811
  - 2855
  - 2877
  - 2913
  - 2934
  - 2943
  - 2961
  - 2965
  - 3126
  - 3189
  - 3288
  - 3301
  - 3429
  - 3577
  - 3655
  - 3707
  - 3711
  - 3884
  - 4105
  - 4149
  - 4203
  - 4263
  - 4327
  - 4439
  - 4453
  - 4474
  - 4502
  - 4508
  - 4706
  - 4846
  - 5112
  - 5286
  - 5648
  - 5983
  - 6178
  - 6284
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Маршрутизация и запросы

## Версия и границы

Практики на этой странице сверены только с конфигурацией, маршрутами или командами, которые ещё есть в закреплённом коммите `911f49cbd49f4fe2516979754a7488a3fd14fe64`. Эта страница не является официальным обещанием поведения. Ключи, cookie, адреса электронной почты, файлы авторизации и тела запросов пользователей сюда не копировались.

## Короткие практики

- <a id="exp-routing-same-model-name"></a>**Одноимённые модели используют одну стратегию маршрутизации** (`exp.routing.same-model-name`). Явление: Несколько провайдеров, учётных данных OAuth или API-ключей публикуют одно имя модели. Действие: Все эти учётные данные входят в routing.strategy. Отдельного выбора по провайдеру нет. Нестабильное имя Antigravity в ту же группу не сливается. Чтобы разделить имена, которые видит клиент, используйте псевдоним модели, а не ещё один режим шлюза. Источники issue: [#48](https://github.com/router-for-me/CLIProxyAPI/issues/48)、[#178](https://github.com/router-for-me/CLIProxyAPI/issues/178)、[#197](https://github.com/router-for-me/CLIProxyAPI/issues/197)、[#737](https://github.com/router-for-me/CLIProxyAPI/issues/737)、[#893](https://github.com/router-for-me/CLIProxyAPI/issues/893)、[#2369](https://github.com/router-for-me/CLIProxyAPI/issues/2369)、[#2425](https://github.com/router-for-me/CLIProxyAPI/issues/2425)、[#5983](https://github.com/router-for-me/CLIProxyAPI/issues/5983)。. Официальные страницы: [Псевдонимы моделей upstream](/ru/accounts/api-keys-models)、[Ключи upstream API](/ru/accounts/api-keys-api)、[Вход Codex](/ru/accounts/codex)、[Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth)、[Стратегия маршрутизации](/ru/routing/strategy).
- <a id="exp-routing-fill-first"></a>**Используйте fill-first, чтобы исчерпать одни учётные данные** (`exp.routing.fill-first`). Явление: Одну и ту же модель нужно сначала до конца использовать на одной учётной записи, а не опрашивать на каждом запросе. Действие: Задайте routing.strategy равным fill-first. Подходящие учётные данные берутся в фиксированном порядке, и используются первые ещё доступные, пока они могут обслуживать, а не опрос на каждый запрос. Источники issue: [#768](https://github.com/router-for-me/CLIProxyAPI/issues/768)、[#784](https://github.com/router-for-me/CLIProxyAPI/issues/784)、[#845](https://github.com/router-for-me/CLIProxyAPI/issues/845)、[#937](https://github.com/router-for-me/CLIProxyAPI/issues/937)、[#1304](https://github.com/router-for-me/CLIProxyAPI/issues/1304)。. Официальные страницы: [Стратегия маршрутизации](/ru/routing/strategy).
- <a id="exp-routing-round-robin-skip"></a>**Опрос пропускает учётные данные, которые не могут обслуживать** (`exp.routing.round-robin-skip`). Явление: При включённом round-robin трафик всё равно кажется сосредоточенным на немногих учётных записях. Действие: Стратегия по умолчанию помнит курсор по модели и пропускает учётные данные, которые сейчас не могут обслуживать, поэтому кажется, что сначала заполняется одна учётная запись. После обновления учётных данных курсор всё ещё хранится по модели. Это не случайная стратегия. Источники issue: [#1021](https://github.com/router-for-me/CLIProxyAPI/issues/1021)、[#2470](https://github.com/router-for-me/CLIProxyAPI/issues/2470)、[#2611](https://github.com/router-for-me/CLIProxyAPI/issues/2611)。. Официальные страницы: [Стратегия маршрутизации](/ru/routing/strategy).
- <a id="exp-routing-disable-cooling"></a>**Выключите охлаждение, чтобы учётные данные оставались доступными для выбора** (`exp.routing.disable-cooling`). Явление: После подряд идущих ошибок upstream появляется auth_unavailable, или модель исчезает из списка. Действие: Задайте routing.cooldown.disable-cooling равным true. Явное значение на учётных данных или провайдере важнее. Тогда ошибка больше не охлаждает учётные данные и не выводит их из выбора. Другого ключа cooldown-duration нет. Источники issue: [#976](https://github.com/router-for-me/CLIProxyAPI/issues/976)、[#1072](https://github.com/router-for-me/CLIProxyAPI/issues/1072)、[#1712](https://github.com/router-for-me/CLIProxyAPI/issues/1712)、[#2107](https://github.com/router-for-me/CLIProxyAPI/issues/2107)、[#2261](https://github.com/router-for-me/CLIProxyAPI/issues/2261)、[#2687](https://github.com/router-for-me/CLIProxyAPI/issues/2687)、[#2855](https://github.com/router-for-me/CLIProxyAPI/issues/2855)、[#3707](https://github.com/router-for-me/CLIProxyAPI/issues/3707)、[#4706](https://github.com/router-for-me/CLIProxyAPI/issues/4706)。. Официальные страницы: [Вход Codex](/ru/accounts/codex)、[Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth)、[OpenAI Chat](/ru/api/openai-chat)、[Охлаждение](/ru/routing/cooldown).
- <a id="exp-routing-cooldown-until-reset"></a>**После 429 пропускайте эту модель до времени восстановления** (`exp.routing.cooldown-until-reset`). Явление: После 429 или исчерпания квоты учётной записи следующие запросы её больше не выбирают. Действие: Прокси охлаждает эту модель на время восстановления, указанное ошибкой, и пропускает её при выборе, пока время не наступит. Охлаждение записывается по модели. Обновление токена не требует сначала закрыть файл учётных данных. Другие учётные данные той же модели пропускаются, только пока это охлаждение ещё действует. Источники issue: [#1456](https://github.com/router-for-me/CLIProxyAPI/issues/1456)、[#2593](https://github.com/router-for-me/CLIProxyAPI/issues/2593)、[#2632](https://github.com/router-for-me/CLIProxyAPI/issues/2632)、[#3655](https://github.com/router-for-me/CLIProxyAPI/issues/3655)、[#4508](https://github.com/router-for-me/CLIProxyAPI/issues/4508)、[#5286](https://github.com/router-for-me/CLIProxyAPI/issues/5286)。. Официальные страницы: [Вход Antigravity](/ru/accounts/antigravity)、[Вход Codex](/ru/accounts/codex)、[Каталоги моделей](/ru/introduction/models)、[Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth)、[Охлаждение](/ru/routing/cooldown)、[Стратегия маршрутизации](/ru/routing/strategy).
- <a id="exp-routing-session-affinity"></a>**Включите привязку сеанса, чтобы сохранить зашифрованное рассуждение** (`exp.routing.session-affinity`). Явление: После смены учётных данных в диалоге Responses зашифрованное рассуждение больше не совпадает. Действие: Задайте routing.session-affinity равным true, чтобы один сеанс оставался на одних учётных данных. По умолчанию false. Привязка не заменяет зашифрованное содержимое, которое upstream уже признал недействительным. Источники issue: [#1793](https://github.com/router-for-me/CLIProxyAPI/issues/1793)、[#3189](https://github.com/router-for-me/CLIProxyAPI/issues/3189)、[#3884](https://github.com/router-for-me/CLIProxyAPI/issues/3884)。. Официальные страницы: [Responses](/ru/api/responses)、[Стратегия маршрутизации](/ru/routing/strategy).
- <a id="exp-routing-priority-before-strategy"></a>**Опрос начинается только после исчерпания приоритета** (`exp.routing.priority-before-strategy`). Явление: После повышения priority всё ещё ожидается, что трафик делится с другими учётными данными по весу. Действие: Более высокий priority используется до исчерпания, и только потом применяется routing.strategy. priority — это не weight. Источники issue: [#3288](https://github.com/router-for-me/CLIProxyAPI/issues/3288)、[#4502](https://github.com/router-for-me/CLIProxyAPI/issues/4502)。. Официальные страницы: [Приоритет учётных данных](/ru/accounts/api-keys-priority)、[Стратегия маршрутизации](/ru/routing/strategy).
- <a id="exp-routing-per-credential-proxy"></a>**Задайте прокси для одних учётных данных** (`exp.routing.per-credential-proxy`). Явление: Нужно, чтобы только одна учётная запись шла через прокси, а остальные upstream сохранили глобальную настройку. Действие: Глобальное значение по умолчанию всё ещё requests.proxy-url. proxy_url в JSON учётных данных OAuth перекрывает только эту учётную запись. Записи API-ключей Claude, Gemini и Codex используют собственный proxy-url. Источники issue: [#304](https://github.com/router-for-me/CLIProxyAPI/issues/304)、[#690](https://github.com/router-for-me/CLIProxyAPI/issues/690)、[#847](https://github.com/router-for-me/CLIProxyAPI/issues/847)、[#1160](https://github.com/router-for-me/CLIProxyAPI/issues/1160)、[#1236](https://github.com/router-for-me/CLIProxyAPI/issues/1236)、[#1290](https://github.com/router-for-me/CLIProxyAPI/issues/1290)。. Официальные страницы: [Прокси ключа](/ru/accounts/api-keys-proxy)、[Исходящие запросы](/ru/routing/requests-value).
- <a id="exp-routing-proxy-for-token-exchange"></a>**Пусть сервер сам завершает вход через прокси** (`exp.routing.proxy-for-token-exchange`). Явление: Вход или запрос квоты не удаётся, но локальный браузер или системный прокси работает. Действие: Обмен токена использует собственный исходящий путь сервера. Задайте requests.proxy-url. В контейнере не указывайте localhost хоста. Когда вход Claude идёт через uTLS, используйте socks5, а не HTTP-прокси. Обновление токена Codex не читает прокси внутри файла учётных данных. Тогда используйте глобальный proxy-url. Источники issue: [#480](https://github.com/router-for-me/CLIProxyAPI/issues/480)、[#1186](https://github.com/router-for-me/CLIProxyAPI/issues/1186)、[#1213](https://github.com/router-for-me/CLIProxyAPI/issues/1213)、[#1217](https://github.com/router-for-me/CLIProxyAPI/issues/1217)、[#1256](https://github.com/router-for-me/CLIProxyAPI/issues/1256)、[#1376](https://github.com/router-for-me/CLIProxyAPI/issues/1376)、[#1749](https://github.com/router-for-me/CLIProxyAPI/issues/1749)、[#2050](https://github.com/router-for-me/CLIProxyAPI/issues/2050)、[#2180](https://github.com/router-for-me/CLIProxyAPI/issues/2180)、[#2934](https://github.com/router-for-me/CLIProxyAPI/issues/2934)、[#2943](https://github.com/router-for-me/CLIProxyAPI/issues/2943)。. Официальные страницы: [Вход Antigravity](/ru/accounts/antigravity)、[Вход Claude](/ru/accounts/claude)、[Вход Codex](/ru/accounts/codex)、[Запуск через Docker Compose](/ru/docker/docker)、[Исходящие запросы](/ru/routing/requests-value).
- <a id="exp-routing-management-page-download"></a>**Сделайте файл страницы управления загружаемым** (`exp.routing.management-page-download`). Явление: Страница управления даёт 404, или в контейнере нет management.html. Действие: management.html скачивается во время выполнения и не вшит в образ. Убедитесь, что requests.proxy-url доступен и не просрочен, и избегайте ограничения частоты GitHub. Когда disable-control-panel равен true, панель не предоставляется. В Docker после смены secret-key управления пересоберите контейнер. Источники issue: [#557](https://github.com/router-for-me/CLIProxyAPI/issues/557)、[#711](https://github.com/router-for-me/CLIProxyAPI/issues/711)、[#966](https://github.com/router-for-me/CLIProxyAPI/issues/966)、[#2378](https://github.com/router-for-me/CLIProxyAPI/issues/2378)、[#2913](https://github.com/router-for-me/CLIProxyAPI/issues/2913)、[#6178](https://github.com/router-for-me/CLIProxyAPI/issues/6178)。. Официальные страницы: [Параметры управления](/ru/operations/management-settings)、[Запуск через Docker Compose](/ru/docker/docker)、[Исходящие запросы](/ru/routing/requests-value)、[Прочие конечные точки](/ru/api/openai-other).
- <a id="exp-routing-filter-rejected-fields"></a>**Фильтром payload уберите поля, которые отклоняет upstream** (`exp.routing.filter-rejected-fields`). Явление: Codex, DeepSeek, GLM, NVIDIA или Grok отклоняет response_format, metadata, extra_body или другое поле. Действие: Перечислите удаляемые пути JSON в params у requests.payload.filter. Фильтрация выполняется после правил по умолчанию и правил переопределения. Источники issue: [#1647](https://github.com/router-for-me/CLIProxyAPI/issues/1647)、[#2352](https://github.com/router-for-me/CLIProxyAPI/issues/2352)、[#3301](https://github.com/router-for-me/CLIProxyAPI/issues/3301)、[#3577](https://github.com/router-for-me/CLIProxyAPI/issues/3577)、[#4105](https://github.com/router-for-me/CLIProxyAPI/issues/4105)、[#4149](https://github.com/router-for-me/CLIProxyAPI/issues/4149)、[#5112](https://github.com/router-for-me/CLIProxyAPI/issues/5112)、[#5648](https://github.com/router-for-me/CLIProxyAPI/issues/5648)。. Официальные страницы: [Базовые URL upstream](/ru/accounts/api-keys-base)、[Вход xAI](/ru/accounts/xai)、[Правила фильтрации payload](/ru/routing/requests-filter)、[Responses](/ru/api/responses).
- <a id="exp-routing-keepalive-is-not-json"></a>**Маркер keep-alive — не ответ JSON** (`exp.routing.keepalive-is-not-json`). Явление: В потоке OpenRouter появляется маркер keep-alive, и клиент считает его плохим JSON. Действие: Эти маркеры пересылаются вместе с потоком, совместимым с OpenAI. Они не являются ответом JSON. Интервал keep-alive задаётся requests.streaming.keepalive-seconds. Источники issue: [#417](https://github.com/router-for-me/CLIProxyAPI/issues/417)。. Официальные страницы: [Базовые URL upstream](/ru/accounts/api-keys-base)、[Потоковый keep-alive](/ru/routing/requests-keepalive).
- <a id="exp-routing-fork-alias-for-image-size"></a>**Различайте размеры изображений псевдонимом fork** (`exp.routing.fork-alias-for-image-size`). Явление: Нужны разные размеры изображений, но соответствующего встроенного id модели нет. Действие: Задайте fork у oauth-model-alias равным true, чтобы получить отдельный id, затем задайте параметры payload по умолчанию для этого псевдонима. Если fork не true, повторный псевдоним только переименовывает. Источники issue: [#1044](https://github.com/router-for-me/CLIProxyAPI/issues/1044)、[#2546](https://github.com/router-for-me/CLIProxyAPI/issues/2546)。. Официальные страницы: [Псевдонимы моделей upstream](/ru/accounts/api-keys-models)、[Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth)、[Правила payload по умолчанию](/ru/routing/requests-default).
- <a id="exp-routing-gemini-image-config-path"></a>**Размер изображения записывайте в imageConfig** (`exp.routing.gemini-image-config-path`). Явление: Размер и пропорции изображения Gemini не действуют. Действие: Параметрами payload по умолчанию запишите их в generationConfig.imageConfig. Не записывайте их на верхнем уровне generationConfig. Источники issue: [#1089](https://github.com/router-for-me/CLIProxyAPI/issues/1089)。. Официальные страницы: [Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth)、[Правила payload по умолчанию](/ru/routing/requests-default).
- <a id="exp-routing-responses-cache-key"></a>**responses сменяется по общему ключу кэша** (`exp.routing.responses-cache-key`). Явление: responses Codex переключается между учётными записями. Действие: Ротация использует общий prompt_cache_key. Закреплённый маршрут не поддерживает previous_response_id. Кэш подсказки длинного диалога не зависит от session-affinity. Источники issue: [#1382](https://github.com/router-for-me/CLIProxyAPI/issues/1382)、[#2811](https://github.com/router-for-me/CLIProxyAPI/issues/2811)。. Официальные страницы: [Вход Codex](/ru/accounts/codex)、[Responses](/ru/api/responses)、[Стратегия маршрутизации](/ru/routing/strategy).
- <a id="exp-routing-filter-effort-without-budget"></a>**При фильтрации reasoning_effort не задавайте бюджет одновременно** (`exp.routing.filter-effort-without-budget`). Явление: payload.filter не убрал reasoning_effort. Действие: Фильтрация убирает reasoning_effort, только если запрос одновременно не задал бюджет мышления. Источники issue: [#1740](https://github.com/router-for-me/CLIProxyAPI/issues/1740)。. Официальные страницы: [Правила фильтрации payload](/ru/routing/requests-filter).
- <a id="exp-routing-override-is-final"></a>**Переопределение payload действует и после суффикса мышления** (`exp.routing.override-is-final`). Явление: Суффикс мышления в имени модели вернул правило переопределения назад. Действие: payload.override выполняется после суффикса мышления и является последним предметным переписыванием. Слишком большой max_tokens тоже можно переписать им до DeepSeek. Источники issue: [#2404](https://github.com/router-for-me/CLIProxyAPI/issues/2404)、[#2758](https://github.com/router-for-me/CLIProxyAPI/issues/2758)。. Официальные страницы: [Базовые URL upstream](/ru/accounts/api-keys-base)、[Правила переопределения payload](/ru/routing/requests-override).
- <a id="exp-routing-retry-503"></a>**503 обрабатывается как круг повтора** (`exp.routing.retry-503`). Явление: 503 считается ограничением частоты, которому нужно долгое ожидание. Действие: 503 считается временной недоступностью. Повторять ли, решает routing.retry.request-retry, а не задержка ограничения частоты. Источники issue: [#2877](https://github.com/router-for-me/CLIProxyAPI/issues/2877)。. Официальные страницы: [Стратегия маршрутизации](/ru/routing/strategy).
- <a id="exp-routing-gpt-image-override"></a>**gpt-image-2 вызывается через дополнение чата после переопределения** (`exp.routing.gpt-image-override`). Явление: gpt-image-2 считают обычным id модели чата. Действие: Когда нужно переопределение payload, вызывайте через дополнение чата и задайте базовую модель чата изображений. Это не отдельная старая команда правки изображений. Источники issue: [#2961](https://github.com/router-for-me/CLIProxyAPI/issues/2961)。. Официальные страницы: [Изображения, речь и видео](/ru/api/media)、[Правила переопределения payload](/ru/routing/requests-override)、[OpenAI Chat](/ru/api/openai-chat).
- <a id="exp-routing-force-prefix-off"></a>**При ошибке запроса без префикса проверьте принудительный префикс** (`exp.routing.force-prefix-off`). Явление: gpt-image-2 или запрос без префикса не может выбрать учётные данные. Действие: Когда routing.force-model-prefix равен true, запрос без префикса использует только учётные данные без префикса. Если это ограничение не нужно, задайте false. prefix у claude — собственный префикс учётных данных. Источники issue: [#2965](https://github.com/router-for-me/CLIProxyAPI/issues/2965)、[#4474](https://github.com/router-for-me/CLIProxyAPI/issues/4474)。. Официальные страницы: [Префикс имени модели](/ru/accounts/api-keys-prefix)、[Стратегия маршрутизации](/ru/routing/strategy).
- <a id="exp-routing-alias-and-override-effort"></a>**Псевдоним вместе с переопределением выражает усилие Opus** (`exp.routing.alias-and-override-effort`). Явление: Нужны разные входы для разных значений усилия Opus. Действие: Используйте oauth-model-alias вместе с payload.override и сохраните запись суффикса в скобках. Источники issue: [#3126](https://github.com/router-for-me/CLIProxyAPI/issues/3126)。. Официальные страницы: [Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth)、[Правила переопределения payload](/ru/routing/requests-override)、[Claude Messages](/ru/api/claude-messages).
- <a id="exp-routing-fill-first-recovers"></a>**fill-first возвращается к прежней учётной записи после восстановления квоты** (`exp.routing.fill-first-recovers`). Явление: Не нужно автоматически возвращаться к прежней учётной записи после восстановления квоты. Действие: fill-first снова использует учётные данные после восстановления. Чтобы менять их по дням, переключайте сами через интерфейс управления учётными данными, а не добавляйте стратегию маршрутизации. Источники issue: [#3429](https://github.com/router-for-me/CLIProxyAPI/issues/3429)、[#3711](https://github.com/router-for-me/CLIProxyAPI/issues/3711)。. Официальные страницы: [Учётные данные](/ru/management/v8-credentials)、[Стратегия маршрутизации](/ru/routing/strategy).
- <a id="exp-routing-override-extra-body"></a>**Добавьте extra_body правилом переопределения** (`exp.routing.override-extra-body`). Явление: Клиенту нужен нестандартный extra_body. Действие: Запишите его в параметры payload.override. Переопределение действует на тело upstream и не печатается в консоль. Источники issue: [#4203](https://github.com/router-for-me/CLIProxyAPI/issues/4203)、[#4453](https://github.com/router-for-me/CLIProxyAPI/issues/4453)。. Официальные страницы: [Базовые URL upstream](/ru/accounts/api-keys-base)、[Мышление моделей](/ru/configuration/thinking-models)、[Правила переопределения payload](/ru/routing/requests-override).
- <a id="exp-routing-separate-payload-by-model"></a>**Разные модели используют разные правила переопределения** (`exp.routing.separate-payload-by-model`). Явление: Одно и то же переопределение xhigh ломает gpt-5.5, а gpt-5.6 работает. Действие: Запишите отдельные правила payload для gpt-5.5 и gpt-5.6. xhigh, подходящий 5.6, не переносите на 5.5. Источники issue: [#4263](https://github.com/router-for-me/CLIProxyAPI/issues/4263)。. Официальные страницы: [Мышление моделей](/ru/configuration/thinking-models)、[Правила переопределения payload](/ru/routing/requests-override).
- <a id="exp-routing-tune-retry-and-cooling"></a>**Повторы 429 настраивайте существующими повтором и охлаждением** (`exp.routing.tune-retry-and-cooling`). Явление: Снова и снова появляется предел повторов для 429. Действие: Настройте routing.retry.request-retry и переключатель охлаждения. Не добавляйте селектор. HTTP 400 уровня учётной записи не меняет учётные данные. Он обрабатывается как ошибочный запрос. Источники issue: [#4327](https://github.com/router-for-me/CLIProxyAPI/issues/4327)、[#4846](https://github.com/router-for-me/CLIProxyAPI/issues/4846)。. Официальные страницы: [Охлаждение](/ru/routing/cooldown)、[Стратегия маршрутизации](/ru/routing/strategy).
- <a id="exp-routing-override-grok-subagent"></a>**Чините субагента Grok переопределением payload** (`exp.routing.override-grok-subagent`). Явление: Вызов субагента Grok не удаётся. Действие: Запишите одно payload.override для grok-4.5. Это меняет только тело upstream и не гарантирует, что всякая ошибка субагента исчезнет. Источники issue: [#4439](https://github.com/router-for-me/CLIProxyAPI/issues/4439)。. Официальные страницы: [Вход xAI](/ru/accounts/xai)、[Правила переопределения payload](/ru/routing/requests-override).
- <a id="exp-routing-compat-shares-strategy"></a>**Совместимые провайдеры используют одну стратегию маршрутизации** (`exp.routing.compat-shares-strategy`). Явление: Кажется, что у провайдера, совместимого с OpenAI, есть отдельная стратегия маршрутизации. Действие: Они уже делят routing.strategy и priority с остальными учётными данными. name провайдера — не другой переключатель стратегии. Источники issue: [#6284](https://github.com/router-for-me/CLIProxyAPI/issues/6284)。. Официальные страницы: [Имя провайдера, совместимого с OpenAI](/ru/accounts/api-keys-name)、[Стратегия маршрутизации](/ru/routing/strategy).

## Отдельные страницы

В этой области нет практики, которой нужна отдельная страница.

