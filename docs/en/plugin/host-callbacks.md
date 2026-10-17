---
title: Host Callbacks
feature_ids:
  - plugin.host-http-client.do
  - plugin.host-http-client.do-stream
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Host Callbacks

`HostHTTPClient` is the public HTTP client the host gives to a plugin. This page covers only the two methods assigned here.

## 1. What this solves

The plugin sends non-streaming or streaming upstream requests through the host, so it follows the host transport policy. When request logging is on, the executor also uses it to keep the outbound request and the raw upstream response.

## 2. Scope and non-goals

There are only `Do` and `DoStream`. Other host callbacks that are not assigned to this page are not described here, and the host's private implementation is not described either.

The call sites appear in the request structures for credential login, refresh, model discovery by credential, the executor, and quota queries. The field name is always `HTTPClient`, and the `json` tag is `-`, so it does not appear in the ABI request JSON. A Go plugin calls this interface directly.

## 3. How to configure or call it

This is not a capability the plugin turns on in `capabilities`. It is the client passed in by the host.

```go
Do(context.Context, HTTPRequest) (HTTPResponse, error)
DoStream(context.Context, HTTPRequest) (HTTPStreamResponse, error)
```

The ABI method names are `host.http.do` and `host.http.do_stream`.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.host-http-client.do | `Do`, ABI `host.http.do`. |  | Parameter `HTTPRequest`, return `HTTPResponse`. |
| plugin.host-http-client.do-stream | `DoStream`, ABI `host.http.do_stream`. |  | Parameter `HTTPRequest`, return `HTTPStreamResponse`. |
| HTTPRequest.Method | HTTP method. |  | String. |
| HTTPRequest.URL | Absolute upstream address. |  | String. |
| HTTPRequest.Headers | Request headers. |  | `http.Header`. |
| HTTPRequest.Body | Raw body. |  | `[]byte`, base64 in JSON. |
| HTTPRequest.WireProfile | Optional on-the-wire representation. |  | A nil pointer changes nothing. JSON name `wire_profile`. |
| HTTPWireProfile.HTTP1Only | Use only HTTP/1.1 and do not negotiate HTTP/2. |  | JSON name `http1_only`. |
| HTTPWireProfile.DisableAutoCompression | Turn off transparent decompression and automatic `Accept-Encoding`. |  | JSON name `disable_auto_compression`. |
| HTTPWireProfile.HeaderProfile | Desired header-name order and case. |  | JSON name `header_profile`, `[]string`. |
| HTTPResponse.StatusCode | Upstream status code. |  | Integer. |
| HTTPResponse.Headers | Upstream response headers. |  | `http.Header`. |
| HTTPResponse.Body | Raw response body. |  | `[]byte`. |
| HTTPStreamResponse.StatusCode | Upstream status code. |  | Integer. |
| HTTPStreamResponse.Headers | Upstream response headers. |  | `http.Header`. |
| HTTPStreamResponse.Chunks | Streaming chunks until the channel closes. |  | Elements are `HTTPStreamChunk`. |
| HTTPStreamChunk.Payload | One chunk of raw bytes. |  | `[]byte`. |
| HTTPStreamChunk.Err | Error attached to this chunk. |  | `error`. |

## 5. Common errors and limits

Both methods return `error`. When `http_status` on the ABI failure envelope is omitted or 0, it is treated as HTTP 500.

`URL` is an absolute address. A nil `WireProfile` pointer adds no on-the-wire configuration. The streaming result is delivered through the `Chunks` channel, and closing the channel means the end.

## 6. Related behavior

The executor must use this client to reach upstream. See [Executor](/plugin/executor). Login and refresh are in [Credential Provider](/plugin/auth-provider).

## 7. Field experience

None yet.

