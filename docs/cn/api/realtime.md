---
title: 实时会话
feature_ids:
  - route.v1.post-live
  - route.v1.get-live-call-id
  - route.v1.get-realtime
  - route.v1.post-realtime
  - route.v1.post-realtime-calls
  - route.v1.get-realtime-calls-call-id
  - route.v1.post-realtime-client-secrets
  - route.v1.post-realtime-sessions
  - route.v1.post-realtime-transcription-sessions
  - route.v1.get-realtime-translations
  - route.v1.post-realtime-translations
  - route.v1.post-realtime-translations-client-secrets
  - route.v1.post-realtime-calls-call-id-hangup
  - route.v1.post-realtime-calls-call-id-accept
  - route.v1.post-realtime-calls-call-id-reject
  - route.v1.post-realtime-calls-call-id-refer
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 实时会话

这里说明钉住提交里的 Codex 实时通话、侧带 WebSocket、短期客户端密钥，以及当前会明确拒绝的实时能力。

## 1. 这段解决什么问题

`/v1/live` 和 `/v1/realtime` 用来建立 Codex 实时通话，或接上已建立通话的侧带 WebSocket。`/v1/realtime/client_secrets` 和 `/v1/realtime/sessions` 签发只在本代理内有效的短期密钥。翻译、转写和 SIP 控制在当前 Codex OAuth 上游没有对应能力，调用时直接返回 501。

## 2. 适用条件与不做的事

`/v1/live` 和 `/v1/live/:call_id` 在 `/v1` 分组上，使用普通客户端密钥校验，错误正文是字符串 `error`。其余本页路由不在该分组里。

`/v1/realtime`、`/v1/realtime/calls`、`/v1/realtime/calls/:call_id`，以及两个翻译入口，先识别 `Authorization: Bearer` 中以 `ek_` 开头的短期密钥。它不是 `ek_` 时，再按客户端密钥校验，但错误包成对象。短期密钥无效或过期时返回 401，`error.code` 为 `invalid_realtime_client_secret`，`error.type` 为 `invalid_request_error`，消息为 `Realtime client secret is invalid or expired`。

`client_secrets`、`sessions`、转写、翻译用的 `client_secrets`、挂断和三个 SIP 路径只使用客户端密钥的实时错误格式，不接受 `ek_` 作为替代认证。客户端密钥本身见[客户端密钥](/cn/api/access)。

这些路由选择的是 Codex OAuth 凭证。本页不说明 Responses 的 `GET /v1/responses` WebSocket。

## 3. 怎么配置或怎么调用

建立通话。`POST /v1/live`、`POST /v1/realtime` 和 `POST /v1/realtime/calls` 使用同一处理函数。JSON 可以省略 `model`，此时按 `gpt-live-1-codex` 选择凭证。也可以提交 `multipart/form-data`，或在持有短期密钥时提交 SDP。

```bash
curl https://example.invalid/v1/live \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-live-1-codex"}'
```

侧带 WebSocket 必须升级。通话 ID 由建立通话的响应给出，并且必须匹配 `^[A-Za-z0-9_-]{1,128}$`。

```text
GET https://example.invalid/v1/live/<call_id>
GET https://example.invalid/v1/realtime/calls/<call_id>
GET https://example.invalid/v1/realtime?call_id=<call_id>
```

不带 `call_id` 的 `GET /v1/realtime` 是另一条 WebSocket。省略查询参数 `model` 时先按 `gpt-realtime` 处理。

签发短期密钥。空正文也可以。省略 `session` 时，会话写成 `{"type":"realtime","model":"gpt-realtime"}`。

```bash
curl https://example.invalid/v1/realtime/client_secrets \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"expires_after":{"anchor":"created_at","seconds":600}}'
```

`POST /v1/realtime/sessions` 把整个正文当作会话对象，而不是包在 `session` 里。成功时额外返回 `client_secret.value` 和 `client_secret.expires_at`。

挂断已建立的通话：

```bash
curl -X POST https://example.invalid/v1/realtime/calls/<call_id>/hangup \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 4. 细项说明

「默认值」与台账 `defaults` 逐字相同。空白单元格表示该字段是空字符串。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| route.v1.post-live | `POST /v1/live`。 |  | 普通密钥校验。请求体最大 16 MiB。默认模型 `gpt-live-1-codex`。 |
| route.v1.get-live-call-id | `GET /v1/live/:call_id`。 |  | 侧带 WebSocket。普通密钥校验。通话 ID 必须匹配上面的正则。 |
| route.v1.get-realtime | `GET /v1/realtime`。 |  | 有 `call_id` 时改走侧带。否则必须是 WebSocket 升级。查询模型缺省为 `gpt-realtime`。 |
| route.v1.post-realtime | `POST /v1/realtime`。 |  | 与 `POST /v1/live` 同一处理函数，但认证和错误外形不同。 |
| route.v1.post-realtime-calls | `POST /v1/realtime/calls`。 |  | 同样调用建立通话的处理函数。 |
| route.v1.get-realtime-calls-call-id | `GET /v1/realtime/calls/:call_id`。 |  | 侧带 WebSocket，使用实时认证。 |
| route.v1.post-realtime-client-secrets | `POST /v1/realtime/client_secrets`。 |  | 正文最大 64 KiB。成功返回 `value`、`expires_at` 和 `session`。`Cache-Control` 为 `no-store`。 |
| route.v1.post-realtime-sessions | `POST /v1/realtime/sessions`。 |  | 旧入口。正文本身是会话对象。响应在会话字段外加入 `client_secret`。 |
| route.v1.post-realtime-transcription-sessions | `POST /v1/realtime/transcription_sessions`。 |  | 固定返回 501。 |
| route.v1.get-realtime-translations | `GET /v1/realtime/translations`。 |  | 固定返回 501。 |
| route.v1.post-realtime-translations | `POST /v1/realtime/translations`。 |  | 固定返回 501。 |
| route.v1.post-realtime-translations-client-secrets | `POST /v1/realtime/translations/client_secrets`。 |  | 固定返回 501。只走标准实时认证。 |
| route.v1.post-realtime-calls-call-id-hangup | `POST /v1/realtime/calls/:call_id/hangup`。 |  | 只挂断本代理建立并仍记录在本地的通话。 |
| route.v1.post-realtime-calls-call-id-accept | `POST /v1/realtime/calls/:call_id/accept`。 |  | 固定返回 501。 |
| route.v1.post-realtime-calls-call-id-reject | `POST /v1/realtime/calls/:call_id/reject`。 |  | 固定返回 501。 |
| route.v1.post-realtime-calls-call-id-refer | `POST /v1/realtime/calls/:call_id/refer`。 |  | 固定返回 501。 |

`gpt-realtime`、以 `gpt-realtime-` 开头的名称，以及包含 `realtime-preview` 的名称，选择凭证时都按 `gpt-live-1-codex` 处理。比较不区分大小写。其他非空模型名保持原样。

短期密钥的 `value` 以 `ek_` 开头。省略 `expires_after` 时有效期为 10 分钟。`anchor` 只能为空或 `created_at`。`seconds` 必须在 10 到 7200 之间。会话 `type` 省略时写成 `realtime`，且只能是 `realtime`。`model` 省略时写成 `gpt-realtime`。成功响应里的 `session.object` 为 `realtime.session`，并带有 `id` 与 `expires_at`。同一签发身份最多 64 条未过期密钥，进程内最多 1024 条。

持有 `ek_` 的建立通话请求必须是 SDP、纯文本 SDP 或 JSON。JSON 会写入该密钥保存的 `session`。WebSocket 上，密钥里的模型与查询模型经过上面的映射后必须相同。

## 5. 常见错误与边界

建立通话的请求体超过 16 MiB 时返回 413，消息为 `Codex live request body too large`。读取失败且不能归类时为 400，消息以 `failed to read Codex live request:` 开头。认证管理器不可用时返回 503，消息为 `Codex auth manager unavailable`。没有选中凭证时返回 503，消息为 `Codex auth unavailable`。在 `/v1/realtime` 下，这些 `writeLiveError` 失败会包成对象，4xx 的 `type` 为 `invalid_request_error`，401 的 `type` 为 `authentication_error`，其他状态的 `type` 为 `api_error`，`code` 为 `realtime_request_failed`。在 `/v1/live` 下，同一失败的正文是 `{"error":"<消息>"}`。选路失败且不能归类时为 503，消息是选路错误文本，并附加该错误携带的 `Retry-After`；外形仍按上面的路径区分。

侧带连接不是 WebSocket 升级时返回 426，并设置 `Upgrade: websocket`，消息为 `WebSocket upgrade required`。通话 ID 不匹配正则时返回 400。`/v1/live` 的消息是 `Invalid Codex live call ID`；`/v1/realtime` 的侧带使用同一函数，因此消息相同，但外形改为对象且 `code` 为 `realtime_request_failed`。会话正在接入时返回 409，消息为 `Codex live session already joining`。本地没有该通话时返回 404，消息为 `Codex live session not found`。

短期密钥与通话不匹配时返回 403，消息为 `Realtime client secret is not valid for this call`，`code` 为 `realtime_client_secret_scope_mismatch`。普通密钥的身份与创建通话时的身份不一致时返回 403，消息为 `Realtime call belongs to another API principal`，`code` 为 `realtime_call_scope_mismatch`。这两条在 `/v1/live` 上也是对象，不是字符串。

`GET /v1/realtime` 不是 WebSocket 升级时返回 426，`code` 为 `websocket_upgrade_required`，消息为 `WebSocket upgrade required`。短期密钥的模型与查询模型不一致时返回 403，`code` 为 `realtime_client_secret_scope_mismatch`，消息为 `Realtime client secret is not valid for the requested model`。认证管理器或 Codex 凭证不可用时返回 503，`code` 为 `codex_auth_unavailable`。

签发密钥的正文超过 64 KiB 时返回 413，消息仍是 `Codex live request body too large`，`code` 为 `invalid_request`。`client_secrets` 的 JSON 不合法时返回 400，消息为 `Invalid Realtime client secret request`。会话不是 JSON 对象时返回 400，消息为 `session must be a valid JSON object`，`code` 为 `invalid_session`。`type` 不是 `realtime` 时返回 501，`code` 为 `realtime_capability_not_supported`，消息包含 `Realtime session type is not supported by the Codex OAuth upstream`。`expires_after.anchor` 不是 `created_at` 时返回 400，消息为 `expires_after.anchor must be created_at`。秒数越界时返回 400，消息为 `expires_after.seconds must be between 10 and 7200`，`code` 为 `invalid_expires_after`。容量用尽时返回 429，响应头 `Retry-After: 1`，消息为 `Realtime client secret capacity exhausted`，`type` 为 `rate_limit_error`，`code` 为 `realtime_client_secret_capacity_exhausted`。服务不可用时返回 503，`code` 为 `realtime_client_secret_unavailable`。

挂断的通话 ID 不匹配正则时返回 400，消息为 `Invalid Realtime call ID`，`code` 为 `invalid_call_id`。本地没有通话时返回 404，消息为 `Realtime call not found`，`code` 为 `realtime_call_not_found`。身份不符时返回上面的 403。服务不可用时返回 503，消息为 `Codex live session service unavailable`，`code` 为 `realtime_session_unavailable`。找到通话后，挂断状态和上游正文按上游响应写回。

转写返回 501，消息为 `Realtime transcription-only sessions are not supported by the ChatGPT/Codex OAuth upstream`。两个翻译入口和翻译用的 `client_secrets` 返回 501，消息为 `Realtime translation sessions are not supported by the ChatGPT/Codex OAuth upstream`。`accept`、`reject`、`refer` 返回 501，消息分别是 `Realtime SIP accept are not supported by the ChatGPT/Codex OAuth upstream`、`Realtime SIP reject are not supported by the ChatGPT/Codex OAuth upstream` 和 `Realtime SIP refer are not supported by the ChatGPT/Codex OAuth upstream`。这些 501 的 `type` 为 `not_supported_error`，`code` 为 `realtime_capability_not_supported`。

## 6. 相关功能

客户端密钥见[客户端密钥](/cn/api/access)。Responses WebSocket 见 [Responses](/cn/api/responses)。

## 7. 使用经验

暂无
