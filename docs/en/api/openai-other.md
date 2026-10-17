---
title: Other endpoints
feature_ids:
  - route.v1.get-models-model
  - route.v1.post-alpha-search
  - route.management-html.get
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Other endpoints

This page covers three public endpoints in the pinned commit that are not assigned to the other call pages: one model entry, `/v1/alpha/search`, and the management panel page.

## 1. What this solves

`GET /v1/models/*model` takes one record from the same model catalog. `POST /v1/alpha/search` hands a Codex search request to the selected Codex credential. `GET /management.html` returns the management control-panel file. It is not in the `/v1` group.

## 2. Scope and non-goals

The model query and the search both pass the client-key check first. The key and sample-key safe mode are in [Client API keys](/api/access). `GET /management.html` is registered without that client-key check.

The full model list is in [OpenAI Chat](/api/openai-chat). `/backend-api/codex/alpha/search` uses the same search handler. That description is in [Responses](/api/responses). The management key, the management API, and the panel repository address are not on this page.

## 3. How to configure or call it

One model. The path segment is the catalog entry's `id`. When the entry has no `id`, `slug` is compared.

```bash
curl https://example.invalid/v1/models/<已登记的模型 ID> \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Search. The optional JSON fields `id` and `model` are read. When `id` is non-empty after whitespace is removed, it is used as the `X-Session-ID` for selecting a credential.

```bash
curl https://example.invalid/v1/alpha/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"<已登记的模型 ID>"}'
```

Management panel:

```bash
curl -I https://example.invalid/management.html
```

When sample-key safe mode is already enabled, open the panel that can still be configured with `/management.html?safe-mode=configure`. `GET` or `HEAD` without that query becomes the warning page first.

## 4. Details

The Default column matches the ledger `defaults` verbatim. A blank cell means the field is an empty string.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| route.v1.get-models-model | `GET /v1/models/*model`. |  | The whole segment after the leading slash is removed is the model ID to look up. The catalog format matches `GET /v1/models`, but only the matching JSON record is written back. |
| route.v1.post-alpha-search | `POST /v1/alpha/search`. |  | At most 16 MiB is read. When the body parses as a JSON object, `prompt_cache_key` and `prompt_cache_retention` are deleted before forwarding. |
| route.management-html.get | `GET /management.html`. |  | It does not pass through the client-key middleware. If the file is missing, a panel download is attempted. A failed download is still 404. |

Search requires a base URL for a Codex credential in API-key form and forwards to `/alpha/search` under that address. An OAuth credential uses the Codex search upstream. If the model-routing target is not `codex`, the request is not sent.

## 5. Common errors and limits

The single-model route returns 502 only when `json.Unmarshal` of the whole catalog fails. The body is `{"error":{"message":"Invalid model catalog","type":"api_error"}}`. When the catalog is valid JSON but has no `data` or `models` array, or no entry whose `id` or `slug` matches the path, the response is 404 with the body `{"error":{"message":"Model not found","type":"invalid_request_error","code":"model_not_found"}}`.

How the list format is chosen, and Home failure statuses, match `GET /v1/models`. See [OpenAI Chat](/api/openai-chat). A Home or Grok Shell catalog also forms the list first, then takes one entry by `id` or `slug`.

Search statuses match `/backend-api/codex/alpha/search`: an unavailable auth manager is 503 `Codex auth manager unavailable`; no credential is 503 `Codex auth unavailable`; an API-key credential without a base URL is 503 `Codex Alpha Search API key base URL unavailable`. If reading the request body fails and cannot be classified, the status is 400 and `error` is `Failed to read search request`. If selection or model routing fails and cannot be classified, the status is 503. If the upstream request or reading the upstream body fails and cannot be classified, the status is 502, and the latter `error` is `Failed to read Codex search response`. After the request reaches the upstream, the status code, body, and upstream `Content-Type` are written back as they are. A `Retry-After` carried by a selection error is attached to the response.

`GET /management.html` returns 404 with no JSON body when the configuration is empty, Home is enabled, or the management control panel is turned off. An empty panel path, or a missing file that cannot be downloaded, is also 404. Any other error while reading the file status returns 500. On success the file contents are returned. They are not wrapped in JSON.

## 6. Related behavior

The model list is in [OpenAI Chat](/api/openai-chat). The Codex alias search is in [Responses](/api/responses). The client key is in [Client API keys](/api/access). How to use the management panel is in [Web UI](/management/webui).

## 7. Field experience

- [Reset a Codex account from the management page](/experience/management#exp-management-reset-codex-from-panel)
- [Management login uses secret-key](/experience/operations#exp-operations-management-secret)
- [After the panel is turned off there is no hashed management address](/experience/operations#exp-operations-panel-route-is-html)
- [Make the management page files downloadable](/experience/routing#exp-routing-management-page-download)
