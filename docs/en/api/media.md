---
title: Images, speech, and video
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

# Images, speech, and video

This page covers the image, speech, and video routes in the pinned commit, and the three multimedia settings that belong to this page.

## 1. What this solves

These routes accept OpenAI-compatible image generation and editing, xAI speech, OpenAI-shaped video tasks, and native xAI video calls. The three settings decide whether the built-in `image_generation` is available, which base model the legacy hosted Codex image path uses, and how long a video ID stays bound to the credential that created it.

## 2. Scope and non-goals

Every route passes the client-key check first. `/v1` and `/openai/v1` use the same check. The key and sample-key safe mode are in [Client API keys](/api/access).

This page does not describe how a tool is injected into Chat Completions. The `chat` and `passthrough` values of `multimedia.disable-image-generation` change the `image_generation` tool list on non-image endpoints. Those endpoints themselves are on their own call pages.

Image models accept only `gpt-image-1.5`, `gpt-image-2`, `gpt-image-2.5-flare`, `gpt-image-2.5-sunburst`, `gpt-image-2.5`, `grok-imagine-image`, `grok-imagine-image-quality`, `grok-imagine-image-2.0`, and a registered compatible model whose type is an OpenAI image model. An xAI image name may have the prefix `xai/`, `x-ai/`, or `grok/`.

## 3. How to configure or call it

```yaml
multimedia:
  disable-image-generation: false
  gpt-image-2-base-model: "gpt-5.4-mini"
  video-result-auth-cache-ttl: "3h"
```

`gpt-image-2-base-model` is a comment in the sample configuration. When it is empty or does not start with `gpt-`, the code uses `gpt-5.4-mini`. The value above is only a legal example. It is not a second default.

Image generation. When `model` is omitted, `gpt-image-2` is used. When `response_format` is omitted, `b64_json` is used.

```bash
curl https://example.invalid/v1/images/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-image-2","prompt":"a red square","response_format":"b64_json"}'
```

Image editing accepts JSON whose `Content-Type` starts with `application/json`, or a form whose `Content-Type` starts with `multipart/form-data`. An empty `Content-Type` is also read as a form.

```bash
curl https://example.invalid/v1/images/edits \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "model=gpt-image-2" \
  -F "prompt=a red square" \
  -F "image=@/path/to/image.png"
```

Speech. `POST /v1/audio/speech` and `POST /v1/tts` use the same handler. When `model` is omitted, routing uses `grok-tts`.

```bash
curl https://example.invalid/v1/audio/speech \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"grok-tts","input":"hello","response_format":"mp3"}'
```

OpenAI-shaped video creation is at `/openai/v1/videos`. When `model` is omitted, `grok-imagine-video` is used. When `seconds` is omitted, `4` is used. When `size` is omitted, `720x1280` is used.

```bash
curl https://example.invalid/openai/v1/videos \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"grok-imagine-video","prompt":"a red square","seconds":"4","size":"720x1280"}'
```

Query and download put the `id` from the creation response into the path. When the download query parameter `variant` is omitted, it is `video`.

```bash
curl https://example.invalid/openai/v1/videos/<video_id> \
  -H "Authorization: Bearer YOUR_API_KEY"
```

```bash
curl "https://example.invalid/openai/v1/videos/<video_id>/content?variant=video" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Native xAI video uses the four write paths below and one query path. When `model` is omitted, it is also `grok-imagine-video`. `POST /v1/videos` and `POST /v1/videos/generations` are the same handler.

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

For `POST /v1/videos/edits` and `POST /v1/videos/extensions`, replace `generations` in the address above with `edits` or `extensions`.

## 4. Details

The Default column matches the ledger `defaults` verbatim. A blank cell means the field is an empty string.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| multimedia.disable-image-generation.value | Whether the built-in `image_generation` is allowed. | Supported values: - false (default): image_generation is enabled everywhere (normal behavior). | `false` enables it everywhere. `true` disables it everywhere and makes both image routes return 404. `chat` stops injection only on non-image endpoints. The image routes remain usable. `passthrough` does not change the tool list on non-image endpoints. The image routes match `chat`. |
| multimedia.gpt-image-2-base-model.value | Base model used by the legacy hosted `image_generation` path when a Codex image request does not go directly to the Image API. | If empty or invalid, the default base model ("gpt-5.4-mini") is used. | After whitespace is removed, it must start with `gpt-`, case-insensitively. An empty value or any other value uses `gpt-5.4-mini` instead. |
| multimedia.video-result-auth-cache-ttl.value | How long a video ID stays bound to the credential that created it. | Empty or invalid values use the default 3h. | Uses a Go duration string, for example `30m` or `3h`. Only a positive duration takes effect. The binding exists only in process memory. |
| route.v1.post-images-generations | `POST /v1/images/generations`. |  | It must be valid JSON. `prompt` cannot be empty. When `model` is omitted, it is `gpt-image-2`. |
| route.v1.post-images-edits | `POST /v1/images/edits`. |  | Both JSON and forms require `prompt`. The form image fields are `image` or `image[]`. |
| route.v1.post-audio-speech | `POST /v1/audio/speech`. |  | The body is at most 1 MiB. When `input` is empty, `text` is read instead. The text is at most 60000 Unicode code points. |
| route.v1.post-tts | `POST /v1/tts`. |  | The same handler as `POST /v1/audio/speech`. An unsupported-model error still writes `/v1/audio/speech`. |
| route.openai.post-v1-videos | `POST /openai/v1/videos`. |  | `prompt` is required. `seconds` must be an integer. Less than 1 is treated as 1. Greater than 15 is treated as 15. |
| route.openai.get-v1-videos-video-id | `GET /openai/v1/videos/:video_id`. |  | The path parameter cannot be empty. The response `object` is `video`. |
| route.openai.get-v1-videos-video-id-content | `GET /openai/v1/videos/:video_id/content`. |  | `variant` can only be `video`. The content comes from `video.url` in the result, and it must be an `http` or `https` address with a host. |
| route.v1.post-videos | `POST /v1/videos`. |  | Native xAI video. The model must be an xAI video model. |
| route.v1.post-videos-generations | `POST /v1/videos/generations`. |  | The same handler as `POST /v1/videos`. |
| route.v1.post-videos-edits | `POST /v1/videos/edits`. |  | The same native-video handler, with a different path. |
| route.v1.post-videos-extensions | `POST /v1/videos/extensions`. |  | The same native-video handler, with a different path. |
| route.v1.get-videos-request-id | `GET /v1/videos/:request_id`. |  | The path parameter cannot be empty. When it is omitted, the same-named `video_id` is also tried. |

`disable-image-generation` also accepts a string. Before comparison, whitespace is removed and the value is lowercased. `true`, `1`, `on`, and `yes` mean disabled everywhere. `false`, `0`, `off`, `no`, and an empty string mean enabled. `chat` and `passthrough` are two further states. An unrecognized value makes configuration loading fail. The error text lists the allowed values `true`, `false`, `chat`, and `passthrough`.

For the image response format, only the case-insensitive `url` is kept as `url`. Any other value is treated as `b64_json`. When the JSON boolean `stream: true` is set, image generation and editing return SSE.

The speech model base names that are recognized are the empty string, `tts-1`, `tts-1-hd`, `gpt-4o-mini-tts`, `grok-tts`, and `grok-voice-tts-1.0`. The first three non-empty OpenAI names and `grok-tts` all route to `grok-tts`. `grok-voice-tts-1.0` keeps itself. The prefixes `xai/`, `x-ai/`, and `grok/` are removed first. A trailing pair of parentheses and their contents are also removed. When `voice` and `voice_id` are omitted, `eve` is used. The following OpenAI voices are mapped. An unknown name is passed to the upstream as it is: `alloy` is `ara`, `ash` is `orion`, `ballad` is `luna`, `coral` is `celeste`, `echo` is `rex`, `fable` is `sal`, `onyx` is `leo`, `nova` is `eve`, `sage` is `iris`, `shimmer` is `aurora`, and `verse` is `lumen`. When `language` is omitted, it is `auto`. `response_format` accepts only `mp3`, `wav`, and `pcm`. When omitted, it is `mp3`. You can instead use the object `output_format.codec`, and a positive `sample_rate`. The default sample rate is `24000`. `speed` is written only when it is a number greater than 0.

`/openai/v1/videos` accepts xAI video models, and also a model whose base name equals `sora-2` or starts with `sora-2-`. The xAI base names are `grok-imagine-video`, `grok-imagine-video-1.5`, and `grok-imagine-video-1.5-preview`. The prefix rules match images. `size` can only be `720x1280`, `1280x720`, `1024x1792`, or `1792x1024`. `reference_images` is at most 7, and it cannot be used together with an input image. `input_reference` cannot supply both `image_url` and `file_id`. `file_id` is not accepted.

The four native xAI write routes do not accept `sora-2`. `grok-imagine-video-1.5-preview` is written as `grok-imagine-video-1.5` before it is sent for execution.

The video binding uses `request_id` from the creation result, or `id` when that is absent. A later `/openai/v1/videos/:video_id` query and content download prefer that credential and routing model while the binding has not expired.

## 5. Common errors and limits

When `multimedia.disable-image-generation` is `true`, both image routes return 404 directly, with no JSON body.

If an image request body is not valid JSON, the response is 400 and the message is `Invalid request: body must be valid JSON`. If `prompt` is empty, the response is 400 and the message is `Invalid request: prompt is required`. If the model is unsupported, the response is 400 and the message lists `/v1/images/generations`, `/v1/images/edits`, and the model names above. If an edit `Content-Type` is neither JSON nor a form nor empty, the response is 400 and the message contains `unsupported Content-Type`. If form parsing fails and cannot be classified, the status is 400. If the form has neither `image` nor `image[]`, the response is 400 and the message is `Invalid request: image is required`. The `error.type` of these bodies is `invalid_request_error`.

If a speech body is larger than 1 MiB, the response is 400 and the message is `request body is larger than 1MB`. If the model base name is unsupported, the response is 400 and the message is `Model <name> is not supported on /v1/audio/speech. Use grok-tts.`. If the JSON is invalid, the message is `body must be valid JSON`. If both `input` and `text` are empty, the message is `input is required`. If it is longer than 60000 code points, the message is `input is longer than 60000 characters`. If `output_format` is not an object, the message is `output_format must be an object`. If the codec is not `mp3`, `wav`, or `pcm`, the message is `response_format must be mp3, wav, or pcm`. If reading the request body fails and cannot be classified, the status is 400 and the message starts with `Invalid request:`.

Parameter errors for `POST /openai/v1/videos` return JSON. `object` is `video`, `status` is `failed`, and it carries `error.code` and `error.message`. An unclassified read failure is 400. `prompt is required`, `seconds must be an integer`, and `size must be one of 720x1280, 1280x720, 1024x1792, or 1792x1024` are all wrapped after `Invalid request:`. An unsupported model returns 400. The message is `Model <name> is not supported on <path>. Use sora-2.`, even though that route also accepts xAI video models. `reference_images supports at most 7 images on xAI`, `image and reference_images cannot be combined on xAI`, `input_reference must provide exactly one of image_url or file_id`, and `input_reference.file_id is not supported for xAI video generation; use input_reference.image_url` are returned with the same failure object.

If a query or download is missing the path ID, the response is 400. The messages are `Invalid request: video_id is required` and `Invalid request: request_id is required`. If the download `variant` is not `video`, the response is 400 and the message contains `is not available for xAI video downloads`. If the result has no `video.url`, or the address is not `http`/`https` with a host, the response is 502.

The four native write routes return 400 when the model is not an xAI video model. The message lists `/v1/videos/generations`, `/v1/videos/edits`, and `/v1/videos/extensions`, and it requires `grok-imagine-video`. `error.type` is `invalid_request_error`.

When `video-result-auth-cache-ttl` is empty, cannot be parsed, or is not a positive duration, 3 hours is used. After it expires, queries and downloads no longer force the credential from creation time.

## 6. Related behavior

The client key is in [Client API keys](/api/access). Chat calls are in [OpenAI Chat](/api/openai-chat).

## 7. Field experience

- [Built-in images use Codex OAuth](/experience/accounts#exp-accounts-codex-oauth-for-images)
- [Stop injecting the image tool](/experience/api#exp-api-disable-image-tool-injection)
- [Image calls are recorded on the base chat model](/experience/api#exp-api-image-base-model)
- [gpt-image-2 is called through chat completions after an override](/experience/routing#exp-routing-gpt-image-override)
