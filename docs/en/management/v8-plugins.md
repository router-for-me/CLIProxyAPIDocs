---
title: Plugins
feature_ids:
  - management.v8.delete-plugins-id
  - management.v8.delete-plugins-id-quota
  - management.v8.get-plugins
  - management.v8.get-plugins-id-quota
  - management.v8.get-plugins-store
  - management.v8.post-plugins-id-quota
  - management.v8.post-plugins-store-id-install
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Plugins

## 1. What this solves

List discovered and configured plugins, delete a local plugin and its configuration, browse the plugin store and install from it, and read or reset the quota a plugin provides for one of its credentials.

## 2. Scope and non-goals

These routes require the management key. Whether plugins are loaded, the directory, and store authentication are in [Plugin loading and the store](/operations/plugins). This page does not implement a plugin interface. Quota matters only for a plugin that declares the quota capability.

## 3. How to configure or call it

The base URL is `https://example.invalid`. The header is `Authorization: Bearer YOUR_API_KEY`.

| Method and path | Purpose |
| --- | --- |
| GET /v8/management/plugins | List the directory, configuration, and registered plugins. |
| DELETE /v8/management/plugins/:id | Delete that local plugin file and its saved configuration. |
| GET /v8/management/plugins/store | Fetch the store catalog and local install state. |
| POST /v8/management/plugins/store/:id/install | Install that plugin from the store. |
| GET /v8/management/plugins/:id/quota | Read that plugin's quota for a credential. |
| POST /v8/management/plugins/:id/quota | Ask the plugin to fetch the quota again. |
| DELETE /v8/management/plugins/:id/quota | Ask the plugin to reset the quota, and reset the routing-side quota state. |

Quota `auth_index` can be the query parameter `auth_index` or `authIndex`. POST and DELETE can also use `auth_index`, `authIndex`, or `AuthIndex` in JSON. Install can use the query parameters `version` and `source`. If the body also has `version`, the two values must match after normalization.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| DELETE /v8/management/plugins/:id | Delete the local plugin and its configuration entry. |  | Not found is 404 `plugin_not_found`. If the directory cannot be resolved, the response is 500 `plugin_directory_invalid`. On success, `status` is `deleted`. |
| DELETE /v8/management/plugins/:id/quota | Reset plugin quota. |  | A missing `auth_index` is 400. A missing credential is 404 `auth not found`. If the plugin has no quota provider, the response is 404 `quota provider not found for plugin`. If the plugin rejects the call, the response is 502. |
| GET /v8/management/plugins | Return the plugin list. |  | The success body contains `plugins_enabled`, `plugins_dir`, and `plugins`. `effective_enabled` is true for an instance only when the global switch is enabled, the instance is enabled, and it is registered. |
| GET /v8/management/plugins/:id/quota | Read quota. |  | The auth index in the query is required, otherwise 400 `auth_index is required`. A fetch failure is 502. |
| GET /v8/management/plugins/store | List store entries. |  | An invalid source configuration is 500 `plugin_store_source_invalid`. If there are no plugins and the source errors, the response is 502 `plugin_store_registry_failed`. A partial source failure still returns `source_errors`. |
| POST /v8/management/plugins/:id/quota | Fetch quota again for the credential in the body. |  | An invalid body is 400 `invalid request body`. The other errors match GET. |
| POST /v8/management/plugins/store/:id/install | Install a plugin from the store. |  | If query `version` conflicts with body `version`, the response is 400 `invalid_request`. `source` can name the origin. |

## 5. Common errors and limits

An illegal plugin ID returns 400 with the error `invalid_plugin_id`. The store list does not query the latest release for an entry that is not installed, or whose source cannot update an installed plugin. Install uses the process's own operating system and architecture. If the plugin reset succeeds but the routing-side reset fails, the response is 500 and the error starts with `failed to reset routing quota`. When global `plugins.enabled` is false, effective enablement in the list is still false.

## 6. Related behavior

Configuration keys are in [Plugin loading and the store](/operations/plugins). Credential files are in [Credentials](/management/v8-credentials).

## 7. Field experience

None yet.
