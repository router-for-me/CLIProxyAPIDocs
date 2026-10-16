---
title: 图像、语音与视频
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
---

# 图像、语音与视频

这里说明钉住提交里的图像、语音、视频路由，以及归在本页的三项多媒体配置。

## 1. 这段解决什么问题

这些路由分别接受 OpenAI 兼容的图像生成和编辑、xAI 语音、OpenAI 形态的视频任务，以及 xAI 原生视频调用。三项配置决定内置 `image_generation` 是否可用、Codex 旧托管图像路径使用哪一个基础模型，以及视频 ID 与创建它的凭证绑定多久。

## 2. 适用条件与不做的事

全部路由都先经过客户端密钥校验。`/v1` 与 `/openai/v1` 使用同一套校验。密钥和示例密钥安全模式见[客户端密钥](/cn/api/access)。

本页不说明 Chat Completions 里如何注入工具。`multimedia.disable-image-generation` 的 `chat` 和 `passthrough` 会改变非图像端点上的 `image_generation` 工具列表；那些端点本身在各自的调用页。

图像模型只接受 `gpt-image-1.5`、`gpt-image-2`、`gpt-image-2.5-flare`、`gpt-image-2.5-sunburst`、`gpt-image-2.5`、`grok-imagine-image`、`grok-imagine-image-quality`、`grok-imagine-image-2.0`，以及已登记且类型为 OpenAI 图像模型的兼容模型。xAI 图像名可以带前缀 `xai/`、`x-ai/` 或 `grok/`。

## 3. 怎么配置或怎么调用

```yaml
multimedia:
  disable-image-generation: false
  gpt-image-2-base-model: "gpt-5.4-mini"
  video-result-auth-cache-ttl: "3h"
```

`gpt-image-2-base-model` 在示例配置里是注释。空着或不以 `gpt-` 开头时，代码使用 `gpt-5.4-mini`。上面的值只是一个合法示例，不是另一套默认值。

图像生成。省略 `model` 时使用 `gpt-image-2`。省略 `response_format` 时使用 `b64_json`。

```bash
curl https://example.invalid/v1/images/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-image-2","prompt":"a red square","response_format":"b64_json"}'
```

图像编辑接受 `Content-Type` 以 `application/json` 开头的 JSON，或以 `multipart/form-data` 开头的表单。`Content-Type` 为空时也按表单读取。

```bash
curl https://example.invalid/v1/images/edits \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "model=gpt-image-2" \
  -F "prompt=a red square" \
  -F "image=@/path/to/image.png"
```

语音。`POST /v1/audio/speech` 与 `POST /v1/tts` 使用同一处理函数。省略 `model` 时按 `grok-tts` 路由。

```bash
curl https://example.invalid/v1/audio/speech \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"grok-tts","input":"hello","response_format":"mp3"}'
```

OpenAI 形态的视频创建在 `/openai/v1/videos`。省略 `model` 时使用 `grok-imagine-video`。省略 `seconds` 时按 `4`，省略 `size` 时按 `720x1280`。

```bash
curl https://example.invalid/openai/v1/videos \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"grok-imagine-video","prompt":"a red square","seconds":"4","size":"720x1280"}'
```

查询和下载把创建响应里的 `id` 放进路径。下载的查询参数 `variant` 省略时为 `video`。

```bash
curl https://example.invalid/openai/v1/videos/<video_id> \
  -H "Authorization: Bearer YOUR_API_KEY"
```

```bash
curl "https://example.invalid/openai/v1/videos/<video_id>/content?variant=video" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

xAI 原生视频使用下面四个写路径和一个查询路径。省略 `model` 时同样是 `grok-imagine-video`。`POST /v1/videos` 与 `POST /v1/videos/generations` 是同一个处理函数。

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

`POST /v1/videos/edits` 和 `POST /v1/videos/extensions` 的地址只把上面的 `generations` 换成 `edits` 或 `extensions`。

## 4. 细项说明

「默认值」与台账 `defaults` 逐字相同。空白单元格表示该字段是空字符串。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| multimedia.disable-image-generation.value | 是否允许内置 `image_generation`。 | Supported values: - false (default): image_generation is enabled everywhere (normal behavior). | `false` 到处启用。`true` 到处禁用，并让两个图像路由返回 404。`chat` 只在非图像端点停止注入，图像路由仍可用。`passthrough` 不改非图像端点上的工具列表；图像路由与 `chat` 相同。 |
| multimedia.gpt-image-2-base-model.value | Codex 图像请求没有直接走 Image API 时，旧托管 `image_generation` 路径使用的基础模型。 | If empty or invalid, the default base model ("gpt-5.4-mini") is used. | 去掉空白后必须以 `gpt-` 开头，不区分大小写。空值或其他值都改用 `gpt-5.4-mini`。 |
| multimedia.video-result-auth-cache-ttl.value | 视频 ID 与创建它的凭证保持绑定的时长。 | Empty or invalid values use the default 3h. | 使用 Go 的 duration 字符串，例如 `30m` 或 `3h`。只有正时长生效。绑定只在进程内存中。 |
| route.v1.post-images-generations | `POST /v1/images/generations`。 |  | 必须是合法 JSON。`prompt` 不能为空。省略 `model` 时为 `gpt-image-2`。 |
| route.v1.post-images-edits | `POST /v1/images/edits`。 |  | JSON 与表单都要求 `prompt`。表单的图像字段是 `image` 或 `image[]`。 |
| route.v1.post-audio-speech | `POST /v1/audio/speech`。 |  | 正文最大 1 MiB。`input` 为空时改读 `text`。文本最长 60000 个 Unicode 码位。 |
| route.v1.post-tts | `POST /v1/tts`。 |  | 与 `POST /v1/audio/speech` 同一处理函数。不支持的模型错误仍写 `/v1/audio/speech`。 |
| route.openai.post-v1-videos | `POST /openai/v1/videos`。 |  | 要求 `prompt`。`seconds` 必须是整数，小于 1 按 1，大于 15 按 15。 |
| route.openai.get-v1-videos-video-id | `GET /openai/v1/videos/:video_id`。 |  | 路径参数不能为空。响应 `object` 为 `video`。 |
| route.openai.get-v1-videos-video-id-content | `GET /openai/v1/videos/:video_id/content`。 |  | `variant` 只能是 `video`。内容来自结果里的 `video.url`，且必须是带主机的 `http` 或 `https` 地址。 |
| route.v1.post-videos | `POST /v1/videos`。 |  | xAI 原生视频。模型必须是 xAI 视频模型。 |
| route.v1.post-videos-generations | `POST /v1/videos/generations`。 |  | 与 `POST /v1/videos` 同一处理函数。 |
| route.v1.post-videos-edits | `POST /v1/videos/edits`。 |  | 同一原生视频处理函数，路径不同。 |
| route.v1.post-videos-extensions | `POST /v1/videos/extensions`。 |  | 同一原生视频处理函数，路径不同。 |
| route.v1.get-videos-request-id | `GET /v1/videos/:request_id`。 |  | 路径参数不能为空。省略时也会尝试读取同名的 `video_id`。 |

`disable-image-generation` 还接受字符串，比较前会去掉空白并转为小写。`true`、`1`、`on`、`yes` 等于全部禁用。`false`、`0`、`off`、`no` 和空字符串等于启用。`chat` 与 `passthrough` 是另外两态。无法识别的值会导致配置加载失败，错误文本列出允许值为 `true`、`false`、`chat`、`passthrough`。

图像响应格式只有大小写不敏感的 `url` 保留为 `url`，其他值按 `b64_json`。JSON 布尔 `stream: true` 时，图像生成和编辑返回 SSE。

语音可识别的模型基名是空字符串、`tts-1`、`tts-1-hd`、`gpt-4o-mini-tts`、`grok-tts` 和 `grok-voice-tts-1.0`。前三个非空 OpenAI 名称以及 `grok-tts` 都路由到 `grok-tts`。`grok-voice-tts-1.0` 保持自身。前缀 `xai/`、`x-ai/`、`grok/` 会先去掉；末尾一对括号及其内容也会去掉。省略 `voice` 和 `voice_id` 时使用 `eve`。下列 OpenAI 音色会映射，未知名称原样传给上游：`alloy` 为 `ara`，`ash` 为 `orion`，`ballad` 为 `luna`，`coral` 为 `celeste`，`echo` 为 `rex`，`fable` 为 `sal`，`onyx` 为 `leo`，`nova` 为 `eve`，`sage` 为 `iris`，`shimmer` 为 `aurora`，`verse` 为 `lumen`。省略 `language` 时为 `auto`。`response_format` 只接受 `mp3`、`wav`、`pcm`；省略时为 `mp3`。也可以改用对象 `output_format.codec`，并可用正数 `sample_rate`，缺省采样率为 `24000`。`speed` 只有在它是大于 0 的数字时才写入。

`/openai/v1/videos` 接受 xAI 视频模型，也接受基名等于 `sora-2` 或以 `sora-2-` 开头的模型。xAI 基名是 `grok-imagine-video`、`grok-imagine-video-1.5` 和 `grok-imagine-video-1.5-preview`，前缀规则与图像相同。`size` 只能是 `720x1280`、`1280x720`、`1024x1792` 或 `1792x1024`。`reference_images` 最多 7 张，且不能和输入图像同时使用。`input_reference` 不能同时给出 `image_url` 和 `file_id`；`file_id` 不被接受。

四个 xAI 原生写路由不接受 `sora-2`。`grok-imagine-video-1.5-preview` 在发往执行前写成 `grok-imagine-video-1.5`。

视频绑定使用创建结果里的 `request_id`，没有时用 `id`。后续 `/openai/v1/videos/:video_id` 查询和内容下载会优先使用尚未过期的那次凭证和路由模型。

## 5. 常见错误与边界

`multimedia.disable-image-generation` 为 `true` 时，两个图像路由直接返回 404，没有 JSON 正文。

图像请求体不是合法 JSON 时返回 400，消息为 `Invalid request: body must be valid JSON`。`prompt` 为空时返回 400，消息为 `Invalid request: prompt is required`。模型不受支持时返回 400，消息列出 `/v1/images/generations`、`/v1/images/edits` 和上面的模型名。编辑的 `Content-Type` 既不是 JSON 也不是表单或空值时返回 400，消息包含 `unsupported Content-Type`。表单解析失败且不能归类时为 400。表单没有 `image` 或 `image[]` 时返回 400，消息为 `Invalid request: image is required`。这些正文的 `error.type` 都是 `invalid_request_error`。

语音正文超过 1 MiB 时返回 400，消息为 `request body is larger than 1MB`。模型基名不受支持时返回 400，消息为 `Model <名称> is not supported on /v1/audio/speech. Use grok-tts.`。JSON 不合法时消息为 `body must be valid JSON`。`input` 和 `text` 都为空时消息为 `input is required`。超过 60000 个码位时消息为 `input is longer than 60000 characters`。`output_format` 不是对象时消息为 `output_format must be an object`。编码不是 `mp3`、`wav` 或 `pcm` 时消息为 `response_format must be mp3, wav, or pcm`。读请求体失败且不能归类时为 400，消息以 `Invalid request:` 开头。

`POST /openai/v1/videos` 的参数错误返回 JSON，`object` 为 `video`，`status` 为 `failed`，并带 `error.code` 与 `error.message`。不能归类的读取失败是 400。`prompt is required`、`seconds must be an integer` 和 `size must be one of 720x1280, 1280x720, 1024x1792, or 1792x1024` 都包在 `Invalid request:` 后面。不受支持的模型返回 400，消息为 `Model <名称> is not supported on <路径>. Use sora-2.`，即使该路由也接受 xAI 视频模型。`reference_images supports at most 7 images on xAI`、`image and reference_images cannot be combined on xAI`、`input_reference must provide exactly one of image_url or file_id`，以及 `input_reference.file_id is not supported for xAI video generation; use input_reference.image_url`，同样以这个失败对象返回。

查询或下载缺少路径 ID 时返回 400，消息分别是 `Invalid request: video_id is required` 和 `Invalid request: request_id is required`。下载的 `variant` 不是 `video` 时返回 400，消息包含 `is not available for xAI video downloads`。结果没有 `video.url`，或地址不是带主机的 `http`/`https` 时返回 502。

四个原生写路由在模型不是 xAI 视频模型时返回 400，消息列出 `/v1/videos/generations`、`/v1/videos/edits`、`/v1/videos/extensions`，并要求 `grok-imagine-video`。`error.type` 为 `invalid_request_error`。

`video-result-auth-cache-ttl` 为空、无法解析或不是正时长时使用 3 小时。过期后，查询和下载不再强制使用创建时的凭证。

## 6. 相关功能

客户端密钥见[客户端密钥](/cn/api/access)。对话调用见 [OpenAI Chat](/cn/api/openai-chat)。

## 7. 使用经验

暂无
