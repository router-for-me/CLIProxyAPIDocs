---
title: "Доступ к API"
related_feature_ids:
  - access.api-keys.value
  - api-keys.claude.models-thinking-levels
  - api-keys.codex.base-url
  - api-keys.gemini.models-thinking-levels
  - api-keys.openai-compatibility.base-url
  - api-keys.openai-compatibility.models-name
  - api-keys.openai-compatibility.models-thinking-levels
  - cli.server.antigravity-login
  - cli.server.claude-login
  - cli.server.codex-login
  - cli.server.config
  - cli.server.kimi-login
  - mode.docker.compose
  - models.codex-catalog.value
  - multimedia.disable-image-generation.value
  - multimedia.gpt-image-2-base-model.value
  - oauth.auth-dir.value
  - oauth.providers.aistudio-ws-auth
  - observability.logs.request-log
  - requests.payload.override-params
  - route.v1.get-models
  - route.v1.post-chat-completions
  - route.v1.post-images-generations
  - route.v1.post-messages
  - route.v1.post-messages-count-tokens
  - route.v1.post-responses
  - route.v1.post-responses-compact
  - route.v1beta.post-models-action
source_issues:
  - 13
  - 22
  - 37
  - 73
  - 158
  - 181
  - 203
  - 228
  - 269
  - 308
  - 313
  - 335
  - 391
  - 573
  - 599
  - 637
  - 712
  - 740
  - 741
  - 751
  - 978
  - 1009
  - 1012
  - 1083
  - 1173
  - 1199
  - 1240
  - 1365
  - 1401
  - 1468
  - 1476
  - 1540
  - 1692
  - 1700
  - 1913
  - 1918
  - 1961
  - 2406
  - 2459
  - 2714
  - 2753
  - 2764
  - 2986
  - 3006
  - 3012
  - 3352
  - 3365
  - 3376
  - 3443
  - 3531
  - 3628
  - 3697
  - 3738
  - 3814
  - 3816
  - 3907
  - 4092
  - 4169
  - 4172
  - 4440
  - 4594
  - 4783
  - 4933
  - 4937
  - 4963
  - 4969
  - 4987
  - 5021
  - 5028
  - 5253
  - 5301
  - 5624
  - 5647
  - 5656
  - 5711
  - 6396
  - 6623
  - 6663
  - 6674
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Доступ к API

## Версия и границы

Практики на этой странице сверены только с конфигурацией, маршрутами или командами, которые ещё есть в закреплённом коммите `911f49cbd49f4fe2516979754a7488a3fd14fe64`. Эта страница не является официальным обещанием поведения. Ключи, cookie, адреса электронной почты, файлы авторизации и тела запросов пользователей сюда не копировались.

## Короткие практики

- <a id="exp-api-require-client-key"></a>**При вызове публичного маршрута передавайте клиентский ключ** (`exp.api.require-client-key`). Явление: Клиент получает Missing API key или Invalid API key, либо /v1 совсем не проверяет личность. Действие: Задайте клиентский ключ в access.api-keys и отправляйте один из них в запросе. Не отправляйте ключ upstream. Если список пуст, публичные маршруты клиентский ключ не проверяют. Базовый адрес Claude Code — корневой путь прокси. Для учётной записи Codex дополнительно выполните --codex-login. Источники issue: [#13](https://github.com/router-for-me/CLIProxyAPI/issues/13)、[#22](https://github.com/router-for-me/CLIProxyAPI/issues/22)、[#37](https://github.com/router-for-me/CLIProxyAPI/issues/37)、[#181](https://github.com/router-for-me/CLIProxyAPI/issues/181)、[#228](https://github.com/router-for-me/CLIProxyAPI/issues/228)、[#573](https://github.com/router-for-me/CLIProxyAPI/issues/573)、[#637](https://github.com/router-for-me/CLIProxyAPI/issues/637)、[#2406](https://github.com/router-for-me/CLIProxyAPI/issues/2406)、[#2459](https://github.com/router-for-me/CLIProxyAPI/issues/2459)、[#2714](https://github.com/router-for-me/CLIProxyAPI/issues/2714)、[#3006](https://github.com/router-for-me/CLIProxyAPI/issues/3006)、[#3443](https://github.com/router-for-me/CLIProxyAPI/issues/3443)、[#3628](https://github.com/router-for-me/CLIProxyAPI/issues/3628)。. Официальные страницы: [Клиентские ключи](/ru/api/access)、[Вход Claude](/ru/accounts/claude)、[Вход Codex](/ru/accounts/codex)、[Параметры командной строки](/ru/introduction/install)、[Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth)、[Журналы и использование](/ru/operations/observability)、[OpenAI Chat](/ru/api/openai-chat)、[Claude Messages](/ru/api/claude-messages)、[Responses](/ru/api/responses).
- <a id="exp-api-replace-example-client-keys"></a>**Замените примеры клиентских ключей** (`exp.api.replace-example-client-keys`). Явление: Публичная служба всё ещё использует заполнитель вроде your-api-key-1 из примера конфигурации. Действие: Замените эти примеры своими access.api-keys и заставьте процесс прочитать изменённую конфигурацию. Безопасный режим примера отклоняет публичный доступ, в котором ещё есть your-api-key-1, your-api-key-2 или your-api-key-3. Источники issue: [#751](https://github.com/router-for-me/CLIProxyAPI/issues/751)、[#3376](https://github.com/router-for-me/CLIProxyAPI/issues/3376)、[#3814](https://github.com/router-for-me/CLIProxyAPI/issues/3814)、[#4963](https://github.com/router-for-me/CLIProxyAPI/issues/4963)、[#4987](https://github.com/router-for-me/CLIProxyAPI/issues/4987)。. Официальные страницы: [Клиентские ключи](/ru/api/access)、[Запуск через Docker Compose](/ru/docker/docker).
- <a id="exp-api-call-responses"></a>**Клиент Codex вызывает маршрут responses** (`exp.api.call-responses`). Явление: Клиент Codex идёт через дополнение чата или запрашивает несуществующий /responses. Действие: Вызывайте POST /v1/responses. Дополнение чата несёт поля, которые Codex не принимает. Быстрый чат Codex — собственный интерфейс клиента. Прокси предоставляет только этот маршрут. Источники issue: [#1401](https://github.com/router-for-me/CLIProxyAPI/issues/1401)、[#1692](https://github.com/router-for-me/CLIProxyAPI/issues/1692)、[#1913](https://github.com/router-for-me/CLIProxyAPI/issues/1913)、[#2764](https://github.com/router-for-me/CLIProxyAPI/issues/2764)、[#2986](https://github.com/router-for-me/CLIProxyAPI/issues/2986)、[#3697](https://github.com/router-for-me/CLIProxyAPI/issues/3697)、[#5711](https://github.com/router-for-me/CLIProxyAPI/issues/5711)。. Официальные страницы: [Базовые URL upstream](/ru/accounts/api-keys-base)、[Вход Codex](/ru/accounts/codex)、[Responses](/ru/api/responses).
- <a id="exp-api-gemini-native-route"></a>**Изображения и структурный вывод Gemini идут по собственному маршруту** (`exp.api.gemini-native-route`). Явление: Изображения или структурный вывод Gemini на совместимом с OpenAI пути пусты, либо повторяется более ранний ход. Действие: Используйте generateContent на /v1beta. Структурный вывод помещает response schema в это тело запроса. Не переходите на POST /v1/images/generations. Когда модель изображений Gemini CLI уже недоступна, используйте этот маршрут после входа AI Studio или Antigravity. Источники issue: [#203](https://github.com/router-for-me/CLIProxyAPI/issues/203)、[#313](https://github.com/router-for-me/CLIProxyAPI/issues/313)、[#335](https://github.com/router-for-me/CLIProxyAPI/issues/335)、[#1012](https://github.com/router-for-me/CLIProxyAPI/issues/1012)、[#1476](https://github.com/router-for-me/CLIProxyAPI/issues/1476)、[#1918](https://github.com/router-for-me/CLIProxyAPI/issues/1918)。. Официальные страницы: [Аутентификация WebSocket AI Studio](/ru/configuration/provider/ai-studio)、[Gemini](/ru/api/gemini).
- <a id="exp-api-gemini-audio-chat"></a>**Аудио Gemini идёт через дополнение чата** (`exp.api.gemini-audio-chat`). Явление: Клиенту нужно передать аудио Gemini этому прокси. Действие: Вызывайте POST /v1/chat/completions и помещайте аудио во фрагмент содержимого файла. Источники issue: [#73](https://github.com/router-for-me/CLIProxyAPI/issues/73)。. Официальные страницы: [OpenAI Chat](/ru/api/openai-chat).
- <a id="exp-api-copilot-chat-sampling"></a>**Когда Copilot идёт через /v1, опускайте top_p** (`exp.api.copilot-chat-sampling`). Явление: Совместимому с OpenAI клиенту Copilot нужен доступ к Gemini. Действие: Направьте клиента на /v1. temperature задайте 0 и не отправляйте top_p одновременно. Источники issue: [#158](https://github.com/router-for-me/CLIProxyAPI/issues/158)。. Официальные страницы: [OpenAI Chat](/ru/api/openai-chat).
- <a id="exp-api-gemini-thinking-field"></a>**Пересылайте мышление AI Studio по полю upstream** (`exp.api.gemini-thinking-field`). Явление: Мышление AI Studio не действует так, как ожидал клиент. Действие: На generateContent по /v1beta пересылайте настройки мышления вызывающей стороны. Поле должно быть тем, которое принимает upstream. Источники issue: [#269](https://github.com/router-for-me/CLIProxyAPI/issues/269)。. Официальные страницы: [Мышление моделей](/ru/configuration/thinking-models)、[Gemini](/ru/api/gemini).
- <a id="exp-api-chat-reasoning-effort"></a>**Дополнение чата отдаёт мышление потоком только при переданном reasoning effort** (`exp.api.chat-reasoning-effort`). Явление: Текст мышления Gemini не появляется в потоке дополнения чата. Действие: Запрос должен содержать reasoning effort, и только тогда текст мышления выходит вместе с дополнением чата. Источники issue: [#308](https://github.com/router-for-me/CLIProxyAPI/issues/308)。. Официальные страницы: [Мышление моделей](/ru/configuration/thinking-models)、[OpenAI Chat](/ru/api/openai-chat).
- <a id="exp-api-use-listed-model-id"></a>**Клиент использует id модели из каталога** (`exp.api.use-listed-model-id`). Явление: Клиент всё ещё запрашивает старое имя предварительной версии или угадывает id, которого нет в каталоге. Действие: Из клиента, который уже указывает на этот прокси, вызывайте id, который ещё есть в каталоге, например gemini-3-pro-preview. Не продолжайте использовать старый id Antigravity, который уже заменён. Источники issue: [#391](https://github.com/router-for-me/CLIProxyAPI/issues/391)、[#3365](https://github.com/router-for-me/CLIProxyAPI/issues/3365)。. Официальные страницы: [Вход Antigravity](/ru/accounts/antigravity)、[OpenAI Chat](/ru/api/openai-chat).
- <a id="exp-api-deepseek-max-tokens"></a>**DeepSeek требует, чтобы клиент снизил max token** (`exp.api.deepseek-max-tokens`). Явление: Claude Code не может вызвать DeepSeek через раздел, совместимый с OpenAI. Действие: Снизьте max token клиента до диапазона, который принимает upstream. Та же конфигурация openai-compatibility внутри диапазона работает. Источники issue: [#599](https://github.com/router-for-me/CLIProxyAPI/issues/599)。. Официальные страницы: [Базовые URL upstream](/ru/accounts/api-keys-base)、[Claude Messages](/ru/api/claude-messages).
- <a id="exp-api-count-tokens-tool-shape"></a>**Интерфейс подсчёта считает инструменты способом upstream** (`exp.api.count-tokens-tool-shape`). Явление: /context в Claude Code показывает очень мало токенов инструментов или сжимает слишком рано. Действие: Так считает Google count-tokens. Инструмент может быть посчитан как один токен. Вызывается существующий маршрут подсчёта. Прокси не уменьшает контекст. Источники issue: [#712](https://github.com/router-for-me/CLIProxyAPI/issues/712)、[#741](https://github.com/router-for-me/CLIProxyAPI/issues/741)。. Официальные страницы: [Вход Antigravity](/ru/accounts/antigravity)、[Claude Messages](/ru/api/claude-messages).
- <a id="exp-api-claude-code-messages"></a>**Claude Code должен вызывать messages** (`exp.api.claude-code-messages`). Явление: Состояние токенов Claude Code всё время нулевое. Действие: Клиент должен вызывать /v1/messages. Если он указывает на дополнение чата, Claude Code не считает по протоколу сообщений. Источники issue: [#740](https://github.com/router-for-me/CLIProxyAPI/issues/740)。. Официальные страницы: [Claude Messages](/ru/api/claude-messages).
- <a id="exp-api-antigravity-image-chat"></a>**Изображения Antigravity идут через дополнение чата** (`exp.api.antigravity-image-chat`). Явление: В списке моделей учётных данных Gemini CLI нет модели изображений. Действие: Вызовы изображений используют учётные данные --antigravity-login и идут по маршруту дополнения чата. Источники issue: [#978](https://github.com/router-for-me/CLIProxyAPI/issues/978)。. Официальные страницы: [Вход Antigravity](/ru/accounts/antigravity)、[OpenAI Chat](/ru/api/openai-chat).
- <a id="exp-api-tool-call-ids"></a>**Обмен с инструментом должен нести id** (`exp.api.tool-call-ids`). Явление: Ход инструмента gemini-claude падает на следующем вызове. Действие: И functionCall, и functionResponse должны нести один и тот же id. Источники issue: [#1009](https://github.com/router-for-me/CLIProxyAPI/issues/1009)。. Официальные страницы: [Claude Messages](/ru/api/claude-messages).
- <a id="exp-api-gemini-for-images"></a>**Модели изображений используют протокол Gemini** (`exp.api.gemini-for-images`). Явление: На пути responses нет вывода изображений чата. Действие: Вызывайте модели изображений протоколом Gemini. Не ожидайте, что у responses есть официальное сопоставление. Источники issue: [#1083](https://github.com/router-for-me/CLIProxyAPI/issues/1083)。. Официальные страницы: [Responses](/ru/api/responses)、[Gemini](/ru/api/gemini).
- <a id="exp-api-antigravity-claude-messages"></a>**Claude Antigravity идёт через messages** (`exp.api.antigravity-claude-messages`). Явление: Совместимый с OpenAI маршрут потерял вызовы инструментов Claude Antigravity. Действие: Пусть OpenCode вызывает маршрут сообщений Anthropic. Имя модели — id вроде claude-opus-4-6-thinking, без префикса gemini-. Не смешивайте тот же диалог с собственным вызовом Anthropic, иначе бюджет мышления не применится. Если способ показа не выбран, пустой блок мышления — ожидаемый результат. Источники issue: [#1173](https://github.com/router-for-me/CLIProxyAPI/issues/1173)、[#1199](https://github.com/router-for-me/CLIProxyAPI/issues/1199)、[#1468](https://github.com/router-for-me/CLIProxyAPI/issues/1468)、[#5253](https://github.com/router-for-me/CLIProxyAPI/issues/5253)。. Официальные страницы: [Вход Antigravity](/ru/accounts/antigravity)、[Claude Messages](/ru/api/claude-messages).
- <a id="exp-api-restart-after-auth-removal"></a>**После удаления учётных данных перезапустите процесс, чтобы обновился список моделей** (`exp.api.restart-after-auth-removal`). Явление: Учётные данные, уже удалённые из каталога, всё ещё есть в GET /v1/models. Действие: После удаления файла в auth-dir перезапустите процесс. Только тогда список моделей уберёт их. Источники issue: [#1240](https://github.com/router-for-me/CLIProxyAPI/issues/1240)。. Официальные страницы: [Каталог OAuth, псевдонимы и исключения](/ru/accounts/oauth)、[OpenAI Chat](/ru/api/openai-chat).
- <a id="exp-api-messages-usage-at-end"></a>**Не-Claude upstream даёт использование только в конце сообщений** (`exp.api.messages-usage-at-end`). Явление: input_tokens в message_start потока messages равен нулю. Действие: Только upstream Claude заполняет входные токены в message_start. У совместимого с OpenAI чата нет начального объекта использования. Использование даётся в конце. Если upstream опускает использование, история тоже нулевая. Источники issue: [#1365](https://github.com/router-for-me/CLIProxyAPI/issues/1365)、[#1700](https://github.com/router-for-me/CLIProxyAPI/issues/1700)、[#2753](https://github.com/router-for-me/CLIProxyAPI/issues/2753)。. Официальные страницы: [Базовые URL upstream](/ru/accounts/api-keys-base)、[Журналы и использование](/ru/operations/observability)、[Claude Messages](/ru/api/claude-messages).
- <a id="exp-api-opus-effort-field"></a>**Усилие Opus берётся из output_config.effort** (`exp.api.opus-effort-field`). Явление: Нужна отдельная модель мышления для Claude Opus 4.6. Действие: Маршрут messages уже читает output_config.effort. Используйте это поле, а не создавайте ещё один id модели. Источники issue: [#1540](https://github.com/router-for-me/CLIProxyAPI/issues/1540)。. Официальные страницы: [Мышление моделей](/ru/configuration/thinking-models)、[Claude Messages](/ru/api/claude-messages).
- <a id="exp-api-avoid-chat-translation"></a>**Не преобразуйте через дополнение чата, если клиент может говорить протоколом upstream** (`exp.api.avoid-chat-translation`). Явление: Дополнение чата занимает много CPU. Действие: Обновитесь до закреплённой версии и пусть клиент использует собственный протокол upstream. Преобразование протокола расходует больше CPU, чем прямое соединение. Источники issue: [#1961](https://github.com/router-for-me/CLIProxyAPI/issues/1961)。. Официальные страницы: [OpenAI Chat](/ru/api/openai-chat).
- <a id="exp-api-image-base-model"></a>**Вызовы изображений записываются на базовую модель чата** (`exp.api.image-base-model`). Явление: Использование gpt-image-2 не записано под именем модели изображений. Действие: Генерация изображений — инструмент базовой модели чата. Запись использует настроенную базовую модель. Прозрачный фон обозначается полем background на маршруте изображений. Прокси не переводит вертикальные размеры видео. Источники issue: [#3012](https://github.com/router-for-me/CLIProxyAPI/issues/3012)、[#3907](https://github.com/router-for-me/CLIProxyAPI/issues/3907)、[#4937](https://github.com/router-for-me/CLIProxyAPI/issues/4937)。. Официальные страницы: [Базовые URL upstream](/ru/accounts/api-keys-base)、[Изображения, речь и видео](/ru/api/media).
- <a id="exp-api-responses-stream-shape"></a>**Поток responses не использует DONE как конец** (`exp.api.responses-stream-shape`). Явление: Клиент ждёт маркер DONE у responses или видит HTTP 200 до первого события. Действие: Протокол responses не отправляет DONE. Поток может вернуть 200 до первого события, потому что прокси не ждёт этот промежуток. Если другой поток OpenAI несёт DONE, он должен быть последним. Поздние блоки переносятся перед ним. Источники issue: [#3352](https://github.com/router-for-me/CLIProxyAPI/issues/3352)、[#4594](https://github.com/router-for-me/CLIProxyAPI/issues/4594)、[#4783](https://github.com/router-for-me/CLIProxyAPI/issues/4783)。. Официальные страницы: [Responses](/ru/api/responses).
- <a id="exp-api-disable-image-tool-injection"></a>**Прекратите внедрять инструмент изображений** (`exp.api.disable-image-tool-injection`). Явление: Смешанные бесплатные и платные учётные данные Codex ломают кэш подсказки, или gpt-5.5 нельзя использовать. Действие: Используйте multimedia.disable-image-generation, чтобы прекратить внедрение image_generation. true одновременно выключает маршрут изображений. Чтобы остановить только внедрение, используйте chat или passthrough, как на странице возможности. Источники issue: [#3531](https://github.com/router-for-me/CLIProxyAPI/issues/3531)、[#4172](https://github.com/router-for-me/CLIProxyAPI/issues/4172)、[#4440](https://github.com/router-for-me/CLIProxyAPI/issues/4440)。. Официальные страницы: [Вход Codex](/ru/accounts/codex)、[Каталоги моделей](/ru/introduction/models)、[Изображения, речь и видео](/ru/api/media)、[Responses](/ru/api/responses).
- <a id="exp-api-deepseek-no-openai-thinking"></a>**Сторонний DeepSeek не заполняет поля мышления OpenAI** (`exp.api.deepseek-no-openai-thinking`). Явление: В дополнении чата нет полей мышления в стиле OpenAI. Действие: Учётные данные DeepSeek, совместимые с OpenAI, не заполняют это поле за вызывающую сторону. Включено ли мышление, определяется записью этой модели. Правило переопределения в стиле чата не совпадает с reasoning.effort у responses. Источники issue: [#3738](https://github.com/router-for-me/CLIProxyAPI/issues/3738)、[#4933](https://github.com/router-for-me/CLIProxyAPI/issues/4933)。. Официальные страницы: [Базовые URL upstream](/ru/accounts/api-keys-base)、[Мышление моделей](/ru/configuration/thinking-models)、[Правила переопределения payload](/ru/routing/requests-override)、[OpenAI Chat](/ru/api/openai-chat).
- <a id="exp-api-compaction-needs-model"></a>**Сжатию нужна модель сжатия от upstream** (`exp.api.compaction-needs-model`). Явление: Сжатие Codex не удаётся. Действие: Модель, используемая для сжатия, должна быть в каталоге upstream. Если в совместимом с OpenAI каталоге этой модели нет, сжать нельзя. Источники issue: [#3816](https://github.com/router-for-me/CLIProxyAPI/issues/3816)。. Официальные страницы: [Псевдонимы моделей upstream](/ru/accounts/api-keys-models)、[Responses](/ru/api/responses).
- <a id="exp-api-responses-instructions"></a>**responses использует instructions вместо system** (`exp.api.responses-instructions`). Явление: Роль system в запросе отклоняется. Действие: У протокола responses нет роли system. Поместите указания в instructions. Явные источники веб-поиска и вызовы собственных инструментов с пространством имён сохраняются как есть. Источники issue: [#4092](https://github.com/router-for-me/CLIProxyAPI/issues/4092)、[#5021](https://github.com/router-for-me/CLIProxyAPI/issues/5021)、[#6623](https://github.com/router-for-me/CLIProxyAPI/issues/6623)。. Официальные страницы: [Вход Codex](/ru/accounts/codex)、[Responses](/ru/api/responses).
- <a id="exp-api-no-synthetic-reasoning"></a>**Не ожидайте, что прокси допишет текст мышления, если каталог его не возвращает** (`exp.api.no-synthetic-reasoning`). Явление: Claude Code не видит блоки рассуждения gpt-5.6. Действие: Если каталог моделей не даёт текст мышления, прокси не дописывает его ради показа. Текст рассуждения Gemini тоже пересылается так, как прислал upstream. Источники issue: [#4169](https://github.com/router-for-me/CLIProxyAPI/issues/4169)、[#6663](https://github.com/router-for-me/CLIProxyAPI/issues/6663)。. Официальные страницы: [Вход Antigravity](/ru/accounts/antigravity)、[Вход Codex](/ru/accounts/codex)、[Каталоги моделей](/ru/introduction/models)、[OpenAI Chat](/ru/api/openai-chat).
- <a id="exp-api-reasoning-summary-vs-effort"></a>**Сводка рассуждения появляется только когда запрос её требует** (`exp.api.reasoning-summary-vs-effort`). Явление: У responses нет сводки рассуждения, а у дополнения чата есть. Действие: responses включает рассуждение, только если запрос просит summary. Дополнение чата выводит его из reasoning effort. Источники issue: [#4969](https://github.com/router-for-me/CLIProxyAPI/issues/4969)。. Официальные страницы: [OpenAI Chat](/ru/api/openai-chat)、[Responses](/ru/api/responses).
- <a id="exp-api-chat-done-marker"></a>**Поток дополнения чата заканчивается DONE** (`exp.api.chat-done-marker`). Явление: Клиент считает поток без DONE закрытым раньше времени. Действие: Поток дополнения чата OpenAI должен заканчиваться DONE. Без этого маркера он считается уже закрытым. Источники issue: [#5028](https://github.com/router-for-me/CLIProxyAPI/issues/5028)。. Официальные страницы: [OpenAI Chat](/ru/api/openai-chat).
- <a id="exp-api-drop-unsupported-claude-fields"></a>**Перед отправкой в Codex уберите неподдерживаемые поля Claude** (`exp.api.drop-unsupported-claude-fields`). Явление: Поля Claude приводят к ошибке запроса Codex. Действие: Поля, которые Codex не принимает, например stop sequences, убираются, чтобы доставка продолжилась. Источники issue: [#5301](https://github.com/router-for-me/CLIProxyAPI/issues/5301)。. Официальные страницы: [Вход Codex](/ru/accounts/codex)、[Claude Messages](/ru/api/claude-messages).
- <a id="exp-api-chat-image-model"></a>**Модель диалога с изображениями всё равно идёт через дополнение чата** (`exp.api.chat-image-model`). Явление: gemini-3.1-flash-image отправляется на отдельный маршрут изображений. Действие: Считайте её обычной моделью изображений чата и вызывайте дополнение чата, а не другой маршрут изображений. Источники issue: [#5624](https://github.com/router-for-me/CLIProxyAPI/issues/5624)。. Официальные страницы: [OpenAI Chat](/ru/api/openai-chat).
- <a id="exp-api-kimi-native-responses"></a>**responses Kimi сохраняет собственные инструменты Kimi** (`exp.api.kimi-native-responses`). Явление: Типы инструментов Codex переписываются на responses Kimi. Действие: responses после входа Kimi пересылается на собственную конечную точку Kimi. Инструменты только для Codex и tool_search не переписываются в другой тип. Источники issue: [#5647](https://github.com/router-for-me/CLIProxyAPI/issues/5647)、[#5656](https://github.com/router-for-me/CLIProxyAPI/issues/5656)。. Официальные страницы: [Вход Kimi](/ru/accounts/kimi)、[Responses](/ru/api/responses).
- <a id="exp-api-one-client-key-endpoint"></a>**Клиентские ключи используют один вход прокси** (`exp.api.one-client-key-endpoint`). Явление: Нужно разделить вход прокси по проектам. Действие: У закреплённой версии нет входа по проектам. Ключи в access.api-keys используют один и тот же набор публичных маршрутов. Источники issue: [#6396](https://github.com/router-for-me/CLIProxyAPI/issues/6396)。. Официальные страницы: [Клиентские ключи](/ru/api/access).
- <a id="exp-api-compat-always-chat"></a>**Совместимые учётные данные всегда вызывают дополнение чата** (`exp.api.compat-always-chat`). Явление: Учётные данные, совместимые с OpenAI, не идут через responses. Действие: Такие учётные данные всегда вызывают конечную точку дополнения чата upstream. Upstream responses нужно настраивать на API-ключе Codex. Источники issue: [#6674](https://github.com/router-for-me/CLIProxyAPI/issues/6674)。. Официальные страницы: [Базовые URL upstream](/ru/accounts/api-keys-base)、[OpenAI Chat](/ru/api/openai-chat).

## Отдельные страницы

В этой области нет практики, которой нужна отдельная страница.

