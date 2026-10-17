---
title: Изображения, речь и видео
feature_ids:
  - multimedia.disable-image-generation.value
  - multimedia.gpt-image-2-base-model.value
  - multimedia.video-result-auth-cache-ttl.value
  - route.v1.post-images-generations
  - route.v1.post-images-edits
  - route.v1.post-audio-speech
  - route.v1.post-tts
  - route.openai.post-v1-videos
  - route.openai.get-v1-videos-video-id
  - route.openai.get-v1-videos-video-id-content
  - route.v1.post-videos
  - route.v1.post-videos-generations
  - route.v1.post-videos-edits
  - route.v1.post-videos-extensions
  - route.v1.get-videos-request-id
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Изображения, речь и видео

Здесь описаны маршруты изображений, речи и видео закреплённого коммита и три мультимедийные настройки, отнесённые к этой странице.

## 1. Какую задачу решает этот раздел

Эти маршруты принимают совместимые с OpenAI генерацию и редактирование изображений, речь xAI, видеозадачи в форме OpenAI и нативные вызовы видео xAI. Три настройки решают, доступен ли встроенный `image_generation`, какую базовую модель использует старый размещённый путь изображений Codex и как долго ID видео остаётся привязанным к учётным данным, которые его создали.

## 2. Когда применимо и чего здесь нет

Все маршруты сначала проходят проверку клиентского ключа. `/v1` и `/openai/v1` используют одну проверку. Ключ и безопасный режим примерных ключей описаны в разделе [Клиентские ключи](/ru/api/access).

Здесь не описывается, как инструмент внедряется в Chat Completions. Значения `chat` и `passthrough` у `multimedia.disable-image-generation` меняют список инструмента `image_generation` на конечных точках, которые не являются изображениями. Сами эти конечные точки находятся на своих страницах вызова.

Модели изображений принимают только `gpt-image-1.5`, `gpt-image-2`, `gpt-image-2.5-flare`, `gpt-image-2.5-sunburst`, `gpt-image-2.5`, `grok-imagine-image`, `grok-imagine-image-quality`, `grok-imagine-image-2.0` и зарегистрированную совместимую модель, чей тип — модель изображений OpenAI. Имя изображения xAI может иметь префикс `xai/`, `x-ai/` или `grok/`.

## 3. Как настроить или вызвать

```yaml
multimedia:
  disable-image-generation: false
  gpt-image-2-base-model: "gpt-5.4-mini"
  video-result-auth-cache-ttl: "3h"
```

`gpt-image-2-base-model` в примере конфигурации закомментирован. Если он пуст или не начинается с `gpt-`, код использует `gpt-5.4-mini`. Значение выше — только допустимый пример, а не второй набор значений по умолчанию.

Генерация изображений. Если `model` опущена, используется `gpt-image-2`. Если `response_format` опущено, используется `b64_json`.

```bash
curl https://example.invalid/v1/images/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-image-2","prompt":"a red square","response_format":"b64_json"}'
```

Редактирование изображений принимает JSON, чей `Content-Type` начинается с `application/json`, или форму, чей `Content-Type` начинается с `multipart/form-data`. Пустой `Content-Type` тоже читается как форма.

```bash
curl https://example.invalid/v1/images/edits \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "model=gpt-image-2" \
  -F "prompt=a red square" \
  -F "image=@/path/to/image.png"
```

Речь. `POST /v1/audio/speech` и `POST /v1/tts` используют один обработчик. Если `model` опущена, маршрутизация идёт на `grok-tts`.

```bash
curl https://example.invalid/v1/audio/speech \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"grok-tts","input":"hello","response_format":"mp3"}'
```

Создание видео в форме OpenAI находится на `/openai/v1/videos`. Если `model` опущена, используется `grok-imagine-video`. Если `seconds` опущено, берётся `4`. Если `size` опущено, берётся `720x1280`.

```bash
curl https://example.invalid/openai/v1/videos \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"grok-imagine-video","prompt":"a red square","seconds":"4","size":"720x1280"}'
```

Запрос и скачивание помещают `id` из ответа создания в путь. Если параметр запроса скачивания `variant` опущен, он равен `video`.

```bash
curl https://example.invalid/openai/v1/videos/<video_id> \
  -H "Authorization: Bearer YOUR_API_KEY"
```

```bash
curl "https://example.invalid/openai/v1/videos/<video_id>/content?variant=video" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Нативное видео xAI использует четыре пути записи ниже и один путь запроса. Если `model` опущена, это тоже `grok-imagine-video`. `POST /v1/videos` и `POST /v1/videos/generations` — один обработчик.

```bash
curl https://example.invalid/v1/videos/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"grok-imagine-video","prompt":"a red square"}'
```

```bash
curl https://example.invalid/v1/videos/<request_id> \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Для `POST /v1/videos/edits` и `POST /v1/videos/extensions` замените `generations` в адресе выше на `edits` или `extensions`.

## 4. Подробности

Столбец «По умолчанию» совпадает с `defaults` в реестре дословно. Пустая ячейка означает, что поле — пустая строка.

| Поле | Значение | По умолчанию | Ограничение |
| --- | --- | --- | --- |
| multimedia.disable-image-generation.value | Разрешён ли встроенный `image_generation`. | Supported values: - false (default): image_generation is enabled everywhere (normal behavior). | `false` включает его везде. `true` отключает его везде и заставляет оба маршрута изображений вернуть 404. `chat` прекращает внедрение только на конечных точках, которые не являются изображениями. Маршруты изображений остаются доступными. `passthrough` не меняет список инструментов на таких конечных точках. Маршруты изображений совпадают с `chat`. |
| multimedia.gpt-image-2-base-model.value | Базовая модель старого размещённого пути `image_generation`, когда запрос изображения Codex не идёт напрямую в Image API. | If empty or invalid, the default base model ("gpt-5.4-mini") is used. | После удаления пробелов значение должно начинаться с `gpt-` без учёта регистра. Пустое или любое другое значение заменяется на `gpt-5.4-mini`. |
| multimedia.video-result-auth-cache-ttl.value | Как долго ID видео остаётся привязанным к учётным данным, которые его создали. | Empty or invalid values use the default 3h. | Используется строка duration Go, например `30m` или `3h`. Действует только положительная длительность. Привязка существует только в памяти процесса. |
| route.v1.post-images-generations | `POST /v1/images/generations`. |  | Это должен быть допустимый JSON. `prompt` не может быть пустым. Если `model` опущена, это `gpt-image-2`. |
| route.v1.post-images-edits | `POST /v1/images/edits`. |  | И JSON, и форма требуют `prompt`. Поля изображения формы — `image` или `image[]`. |
| route.v1.post-audio-speech | `POST /v1/audio/speech`. |  | Тело не больше 1 MiB. Если `input` пуст, читается `text`. Текст не длиннее 60000 кодовых точек Unicode. |
| route.v1.post-tts | `POST /v1/tts`. |  | Тот же обработчик, что у `POST /v1/audio/speech`. Ошибка неподдерживаемой модели всё равно пишет `/v1/audio/speech`. |
| route.openai.post-v1-videos | `POST /openai/v1/videos`. |  | Требуется `prompt`. `seconds` должно быть целым. Меньше 1 считается как 1. Больше 15 считается как 15. |
| route.openai.get-v1-videos-video-id | `GET /openai/v1/videos/:video_id`. |  | Параметр пути не может быть пустым. `object` ответа равен `video`. |
| route.openai.get-v1-videos-video-id-content | `GET /openai/v1/videos/:video_id/content`. |  | `variant` может быть только `video`. Содержимое берётся из `video.url` результата и должно быть адресом `http` или `https` с хостом. |
| route.v1.post-videos | `POST /v1/videos`. |  | Нативное видео xAI. Модель должна быть моделью видео xAI. |
| route.v1.post-videos-generations | `POST /v1/videos/generations`. |  | Тот же обработчик, что у `POST /v1/videos`. |
| route.v1.post-videos-edits | `POST /v1/videos/edits`. |  | Тот же обработчик нативного видео, другой путь. |
| route.v1.post-videos-extensions | `POST /v1/videos/extensions`. |  | Тот же обработчик нативного видео, другой путь. |
| route.v1.get-videos-request-id | `GET /v1/videos/:request_id`. |  | Параметр пути не может быть пустым. Если он опущен, также пробуется одноимённый `video_id`. |

`disable-image-generation` также принимает строку. Перед сравнением пробелы удаляются, значение переводится в нижний регистр. `true`, `1`, `on` и `yes` означают полное отключение. `false`, `0`, `off`, `no` и пустая строка означают включение. `chat` и `passthrough` — ещё два состояния. Нераспознанное значение приводит к ошибке загрузки конфигурации. Текст ошибки перечисляет допустимые значения `true`, `false`, `chat` и `passthrough`.

В формате ответа изображения только `url` без учёта регистра сохраняется как `url`. Любое другое значение считается `b64_json`. При логическом JSON `stream: true` генерация и редактирование изображений возвращают SSE.

Распознаваемые базовые имена моделей речи — пустая строка, `tts-1`, `tts-1-hd`, `gpt-4o-mini-tts`, `grok-tts` и `grok-voice-tts-1.0`. Первые три непустых имени OpenAI и `grok-tts` маршрутизируются на `grok-tts`. `grok-voice-tts-1.0` сохраняет себя. Префиксы `xai/`, `x-ai/` и `grok/` сначала снимаются. Конечная пара скобок и их содержимое тоже снимаются. Если `voice` и `voice_id` опущены, используется `eve`. Следующие голоса OpenAI отображаются. Неизвестное имя передаётся upstream как есть: `alloy` — `ara`, `ash` — `orion`, `ballad` — `luna`, `coral` — `celeste`, `echo` — `rex`, `fable` — `sal`, `onyx` — `leo`, `nova` — `eve`, `sage` — `iris`, `shimmer` — `aurora`, `verse` — `lumen`. Если `language` опущено, это `auto`. `response_format` принимает только `mp3`, `wav` и `pcm`. Если опущено, это `mp3`. Можно вместо этого использовать объект `output_format.codec` и положительный `sample_rate`. Частота дискретизации по умолчанию — `24000`. `speed` записывается только если это число больше 0.

`/openai/v1/videos` принимает модели видео xAI, а также модель, чьё базовое имя равно `sora-2` или начинается с `sora-2-`. Базовые имена xAI — `grok-imagine-video`, `grok-imagine-video-1.5` и `grok-imagine-video-1.5-preview`. Правила префиксов совпадают с изображениями. `size` может быть только `720x1280`, `1280x720`, `1024x1792` или `1792x1024`. `reference_images` не больше 7 и не может использоваться вместе с входным изображением. `input_reference` не может одновременно дать `image_url` и `file_id`. `file_id` не принимается.

Четыре нативных маршрута записи xAI не принимают `sora-2`. `grok-imagine-video-1.5-preview` перед отправкой на выполнение записывается как `grok-imagine-video-1.5`.

Привязка видео использует `request_id` из результата создания, а если его нет — `id`. Последующий запрос `/openai/v1/videos/:video_id` и скачивание содержимого предпочитают эти учётные данные и модель маршрутизации, пока привязка не истекла.

## 5. Типичные ошибки и границы

Когда `multimedia.disable-image-generation` равен `true`, оба маршрута изображений сразу возвращают 404 без тела JSON.

Если тело запроса изображения не является допустимым JSON, ответ — 400, сообщение — `Invalid request: body must be valid JSON`. Если `prompt` пуст, ответ — 400, сообщение — `Invalid request: prompt is required`. Если модель не поддерживается, ответ — 400, сообщение перечисляет `/v1/images/generations`, `/v1/images/edits` и имена моделей выше. Если `Content-Type` редактирования не JSON, не форма и не пуст, ответ — 400, сообщение содержит `unsupported Content-Type`. Если разбор формы не удался и его нельзя классифицировать, статус — 400. Если в форме нет `image` или `image[]`, ответ — 400, сообщение — `Invalid request: image is required`. У этих тел `error.type` равен `invalid_request_error`.

Если тело речи больше 1 MiB, ответ — 400, сообщение — `request body is larger than 1MB`. Если базовое имя модели не поддерживается, ответ — 400, сообщение — `Model <имя> is not supported on /v1/audio/speech. Use grok-tts.`. Если JSON недопустим, сообщение — `body must be valid JSON`. Если и `input`, и `text` пусты, сообщение — `input is required`. Если длиннее 60000 кодовых точек, сообщение — `input is longer than 60000 characters`. Если `output_format` не объект, сообщение — `output_format must be an object`. Если кодировка не `mp3`, `wav` или `pcm`, сообщение — `response_format must be mp3, wav, or pcm`. Если чтение тела запроса не удалось и его нельзя классифицировать, статус — 400, сообщение начинается с `Invalid request:`.

Ошибки параметров `POST /openai/v1/videos` возвращают JSON. `object` равен `video`, `status` равен `failed`, и присутствуют `error.code` и `error.message`. Неклассифицированная ошибка чтения — 400. `prompt is required`, `seconds must be an integer` и `size must be one of 720x1280, 1280x720, 1024x1792, or 1792x1024` оборачиваются после `Invalid request:`. Неподдерживаемая модель возвращает 400. Сообщение — `Model <имя> is not supported on <путь>. Use sora-2.`, даже если этот маршрут также принимает модели видео xAI. `reference_images supports at most 7 images on xAI`, `image and reference_images cannot be combined on xAI`, `input_reference must provide exactly one of image_url or file_id` и `input_reference.file_id is not supported for xAI video generation; use input_reference.image_url` возвращаются тем же объектом неудачи.

Если у запроса или скачивания нет ID пути, ответ — 400. Сообщения — `Invalid request: video_id is required` и `Invalid request: request_id is required`. Если `variant` скачивания не `video`, ответ — 400, сообщение содержит `is not available for xAI video downloads`. Если в результате нет `video.url` или адрес не `http`/`https` с хостом, ответ — 502.

Четыре нативных маршрута записи возвращают 400, когда модель не является моделью видео xAI. Сообщение перечисляет `/v1/videos/generations`, `/v1/videos/edits` и `/v1/videos/extensions` и требует `grok-imagine-video`. `error.type` равен `invalid_request_error`.

Если `video-result-auth-cache-ttl` пуст, не разбирается или не является положительной длительностью, используются 3 часа. После истечения запрос и скачивание больше не принуждают использовать учётные данные момента создания.

## 6. Связанные возможности

Клиентский ключ описан в разделе [Клиентские ключи](/ru/api/access). Вызовы диалога — в разделе [OpenAI Chat](/ru/api/openai-chat).

## 7. Практический опыт

- [Встроенные изображения используют OAuth Codex](/ru/experience/accounts#exp-accounts-codex-oauth-for-images)
- [Прекратите внедрять инструмент изображений](/ru/experience/api#exp-api-disable-image-tool-injection)
- [Вызовы изображений записываются на базовую модель чата](/ru/experience/api#exp-api-image-base-model)
- [gpt-image-2 вызывается через дополнение чата после переопределения](/ru/experience/routing#exp-routing-gpt-image-override)
