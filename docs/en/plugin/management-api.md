---
title: Management API
feature_ids:
  - plugin.management-api.register-management
  - plugin.management-handler.handle-management
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Management API

This page covers the two public interfaces already assigned here: `ManagementAPI` registers routes, and `ManagementHandler` handles a request that matches.

## 1. What this solves

Under the prefix supplied by the host, the plugin declares exact management routes and browser resource routes, and returns a status code, headers, and a body when a request arrives.

## 2. Scope and non-goals

It does not implement the host's own management API. `BasePath` in the registration request is the only prefix where the plugin may mount management routes. The value is `/v0/management`. `ResourceBasePath` is `/v0/resource/plugins/` plus the plugin ID.

Resource routes do not go through management authentication. A GET management declaration with a non-empty `Menu` does not also register a management endpoint. It is registered only as a resource route.

## 3. How to configure or call it

Set `capabilities.management_api` to true.

```go
RegisterManagement(context.Context, ManagementRegistrationRequest) (ManagementRegistrationResponse, error)
HandleManagement(context.Context, ManagementRequest) (ManagementResponse, error)
```

The ABI method names are `management.register` and `management.handle`. The `Handler` of each `ManagementRoute` and `ResourceRoute` implements the second interface.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.management-api.register-management | `RegisterManagement`, ABI `management.register`. |  | Parameter `ManagementRegistrationRequest`. |
| plugin.management-handler.handle-management | `HandleManagement`, ABI `management.handle`. |  | Parameter `ManagementRequest`, return `ManagementResponse`. |
| ManagementRegistrationRequest.Plugin | Plugin metadata. |  | `Metadata`. |
| ManagementRegistrationRequest.BasePath | Management route prefix. |  | Fixed as `/v0/management`. |
| ManagementRegistrationRequest.ResourceBasePath | Resource prefix. |  | `/v0/resource/plugins/<pluginID>`. |
| ManagementRegistrationResponse.Routes | Exact management routes to expose. |  | `[]ManagementRoute`. |
| ManagementRegistrationResponse.Resources | Browser resources. |  | Mounted under the resource prefix. |
| ManagementRoute.Method | HTTP method. |  | Blank is treated as GET. Whitespace makes the whole route invalid. |
| ManagementRoute.Path | Exact path. |  | A relative path gets a leading `/`, then is mounted under `/v0/management`. A path that already has that prefix has it removed and then mounted again. |
| ManagementRoute.Menu | Legacy resource menu title. |  | When the method is GET and this is non-empty, the `/v0/management` endpoint is not registered. It is registered only as a resource route. |
| ManagementRoute.Description | Legacy menu description. |  | String. |
| ManagementRoute.Handler | Object that handles this route. |  | Cannot be empty, or the route is invalid. |
| ResourceRoute.Path | Exact resource path. |  | Mounted under that plugin's resource prefix. |
| ResourceRoute.Menu | Management UI menu title. |  | A resource request is GET. |
| ResourceRoute.Description | UI description. |  | String. |
| ResourceRoute.Handler | Resource handler object. |  | Cannot be empty. A resource request does not carry management authentication. |
| ManagementRequest.Method | Actual HTTP method. |  | String. |
| ManagementRequest.Path | Request path. |  | String. |
| ManagementRequest.Headers | Request headers. |  | `http.Header`. |
| ManagementRequest.Query | Query parameters. |  | `url.Values`. |
| ManagementRequest.Body | Raw body. |  | `[]byte`. A resource GET does not use the body. |
| ManagementResponse.StatusCode | HTTP status code. |  | 0 is treated as 200. |
| ManagementResponse.Headers | Response headers. |  | `http.Header`. |
| ManagementResponse.Body | Raw response body. |  | A JSON string at contract 6 and above is not HTML-escaped. Below 6 it is still escaped. The current version is 6. |

## 5. Common errors and limits

When the handler returns `error`, a management request gets HTTP 502 and the body `plugin management handler failed`. A resource request is also 502, with the body `plugin resource handler failed`.

The following routes are not registered: an empty path, a method that contains whitespace, a final path that is not under the matching prefix, or a path that contains whitespace, `:`, or `*`. A resource path also rejects `..`. A route that conflicts with a reserved route, or with a higher-priority plugin's resource path, is skipped. A GET management declaration with a non-empty `Menu` does not enter `/v0/management`. It is registered only as a resource route.

The registration method's own `error` still uses the ABI envelope. When `http_status` is omitted or 0, it is treated as HTTP 500.

## 6. Related behavior

Existing routes of the host management surface are not on this page. Plugin installation is in [Plugin loading and the store](/operations/plugins).

## 7. Field experience

None yet.

