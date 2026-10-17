---
title: Management API v8
feature_ids:
  - management.v8.delete-config-path
  - management.v8.get-config
  - management.v8.get-config-path
  - management.v8.get-config-yaml
  - management.v8.patch-config
  - management.v8.patch-config-path
  - management.v8.put-config
  - management.v8.put-config-path
  - management.v8.put-config-yaml
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Management API v8

## 1. What this solves

Use `/v8/management` to read or change the persisted v8 configuration tree. Paths match YAML keys. A successful change is written back to the file and hot-reloaded.

## 2. Scope and non-goals

This page covers only configuration reads and writes. Credentials, OAuth, logs, plugins, routing actions, the version query, and proxied requests are on the other pages in this directory. `/v0/management` is no longer maintained. See [Management API](/management/api). Field meanings are on the feature pages. The whole configuration is not repeated here.

Home mode returns 404. The response is also 404 when `management.secret-key`, `MANAGEMENT_PASSWORD`, and the local password are all empty.

## 3. How to configure or call it

The base URL is `https://example.invalid`. Except for the OAuth callback noted elsewhere, every request needs the management key:

```http
GET /v8/management/config HTTP/1.1
Host: example.invalid
Authorization: Bearer YOUR_API_KEY
```

The plaintext key can also be placed in `X-Management-Key`. A non-local caller also needs `management.allow-remote: true`, unless `MANAGEMENT_PASSWORD` is set.

| Method and path | Purpose |
| --- | --- |
| GET /v8/management/config | Return the v8 view of the whole configuration as JSON. |
| PUT /v8/management/config | Replace the whole configuration with a JSON object. |
| PATCH /v8/management/config | Deep-merge a JSON object into the whole configuration. |
| GET /v8/management/config.yaml | Return the normalized YAML body, with type `application/yaml`. |
| PUT /v8/management/config.yaml | Replace the whole configuration with a YAML body. |
| GET /v8/management/config/\<path\> | Return that YAML node as JSON. |
| PUT /v8/management/config/\<path\> | Replace that node. |
| PATCH /v8/management/config/\<path\> | Deep-merge an object. Any other type is replaced directly. |
| DELETE /v8/management/config/\<path\> | Delete that node. |

A path segment is a YAML map key, not an array index. A list must be replaced as a whole. The request body is the value itself. Do not wrap it again in the old `value` or `items`. A successful write returns `{"status":"ok","config-version":8}`.

The optional `If-Match` header is compared with the strong ETag of the current file contents. Without that header, the write is unconditional. A value of `*` matches any current version. A mismatch returns 412 with the error `precondition_failed`, and the current ETag is sent back.

## 4. Details

The Default column matches the ledger `defaults` verbatim. These routes have no separate configuration default.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| DELETE /v8/management/config/\*path | Delete the selected configuration node. |  | The root cannot be deleted: 400 `cannot_delete_config`. A missing path is 404 `not_found`. |
| GET /v8/management/config | Read the JSON view of the whole configuration. |  | Does not rewrite the disk. The response carries `Cache-Control: no-store` and an ETag. A read failure is 500 `read_failed`. |
| GET /v8/management/config/\*path | Read one YAML node as JSON. |  | A missing path is 404 `not_found`. If the parent is not a map, or a segment is empty, a write is 400 `invalid_path`. A missing read is 404. |
| GET /v8/management/config.yaml | Read the normalized YAML bytes. |  | Success is not JSON. GET does not by itself migrate an old file to v8. |
| PATCH /v8/management/config | Deep-merge the root object. |  | The root must be a JSON object, otherwise 400 `config_must_be_object`. `null` is saved. It does not delete a field. |
| PATCH /v8/management/config/\*path | Merge or replace the selected node. |  | A non-JSON body, except on the YAML endpoint, returns 400 `invalid_json`. A body that cannot be parsed returns 400 `invalid_body`. |
| PUT /v8/management/config | Replace the whole configuration. |  | Validation failure is 400 `invalid_config`. If parsing succeeds but the configuration bytes are still invalid, the response may be 422 `invalid_config`. |
| PUT /v8/management/config/\*path | Replace the selected node. |  | Intermediate map keys that do not exist yet are created. After success, the saved file is hot-reloaded. |
| PUT /v8/management/config.yaml | Replace the whole configuration with a YAML body. |  | Like a JSON write, it accepts optional `If-Match`. A write failure is 500 `write_failed`. |

## 5. Common errors and limits

The three fields below belong to Home. If a write changes them, the response is 400 with the error `read_only_field`, and `field` is the matching path:

- `credentials/concurrency/lifecycle-config-revision`
- `credentials/concurrency/observation-barrier-revision`
- `plugins/auth-revision`

A JSON read removes `username` and `credential` of a realtime ICE server from the response, and may include a runtime auth index in the `api-keys` view. Those indexes are stripped on write and are not saved as configuration. A YAML read returns the normalized bytes and does not apply that JSON field removal. A write without `If-Match` overwrites content someone else just saved. A weak ETag or a malformed tag does not match.

## 6. Related behavior

The key and the remote switch are in [Management settings](/operations/management-settings). Credential files are in [Credentials](/management/v8-credentials).

## 7. Field experience

None yet.
