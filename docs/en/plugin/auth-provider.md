---
title: Credential Provider
feature_ids:
  - plugin.auth-provider.identifier
  - plugin.auth-provider.parse-auth
  - plugin.auth-provider.start-login
  - plugin.auth-provider.poll-login
  - plugin.auth-provider.refresh-auth
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Credential Provider

`AuthProvider` lets a plugin parse credential files and complete login, polling, and refresh.

## 1. What this solves

The host hands discovered credential JSON, the login action, and expiry refresh to the plugin. The plugin returns `AuthData`, or expands several `Auths` from one piece of material.

## 2. Scope and non-goals

Implement only the five methods of `sdk/pluginapi.AuthProvider`. Frontend request authentication is [Frontend Authentication Provider](/plugin/frontend-auth-provider). Choosing which credential to use is [Scheduler](/plugin/scheduler). Private host callbacks are not written on this page.

At registration, `Name`, `Version`, `Author`, and `GitHubRepository` cannot be blank, and at least one capability must be turned on. The plugin directory is in [Plugin loading and the store](/operations/plugins).

## 3. How to configure or call it

Set `auth_provider` in the result of `plugin.register` or `plugin.reconfigure`. The current `sdk/pluginabi.SchemaVersion` is 6.

```json
{
  "ok": true,
  "result": {
    "schema_version": 6,
    "metadata": {
      "Name": "example-auth",
      "Version": "0.1.0",
      "Author": "example",
      "GitHubRepository": "https://example.invalid/example-auth"
    },
    "capabilities": {
      "auth_provider": true
    }
  }
}
```

Go signatures:

```go
Identifier() string
ParseAuth(context.Context, AuthParseRequest) (AuthParseResponse, error)
StartLogin(context.Context, AuthLoginStartRequest) (AuthLoginStartResponse, error)
PollLogin(context.Context, AuthLoginPollRequest) (AuthLoginPollResponse, error)
RefreshAuth(context.Context, AuthRefreshRequest) (AuthRefreshResponse, error)
```

The ABI method names, in order, are `auth.identifier`, `auth.parse`, `auth.login.start`, `auth.login.poll`, and `auth.refresh`. Fields without a `json` tag use the Go exported name. `[]byte` is base64 in JSON. `time.Time` is RFC3339.

The result object of `auth.identifier` has only the field `identifier`. The example is `examples/plugin/auth` in the repository.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugin.auth-provider.identifier | `Identifier`, ABI `auth.identifier`. |  | No parameters. Returns the provider identifier string. Failure or blank is treated as an empty string. |
| plugin.auth-provider.parse-auth | `ParseAuth`, ABI `auth.parse`. |  | Parameter `AuthParseRequest`, return `AuthParseResponse`. |
| plugin.auth-provider.start-login | `StartLogin`, ABI `auth.login.start`. |  | Parameter `AuthLoginStartRequest`, return `AuthLoginStartResponse`. |
| plugin.auth-provider.poll-login | `PollLogin`, ABI `auth.login.poll`. |  | Parameter `AuthLoginPollRequest`, return `AuthLoginPollResponse`. |
| plugin.auth-provider.refresh-auth | `RefreshAuth`, ABI `auth.refresh`. |  | Parameter `AuthRefreshRequest`, return `AuthRefreshResponse`. |
| AuthParseRequest.Provider | Provider key being parsed. |  | String. |
| AuthParseRequest.Path | Source path of the credential material. It may be empty. |  | String. |
| AuthParseRequest.FileName | Credential file name. |  | String. |
| AuthParseRequest.RawJSON | Raw credential JSON. |  | `[]byte`. |
| AuthParseRequest.Host | Host configuration summary related to the plugin. |  | `HostConfigSummary`. |
| AuthParseResponse.Handled | Whether the plugin recognized this material. |  | When false, `Auth` is not adopted. |
| AuthParseResponse.Auth | One credential when recognition succeeds. |  | `AuthData`. |
| AuthParseResponse.Auths | Several runtime credentials expanded from one piece of material. |  | `[]AuthData`. |
| AuthLoginStartRequest.Provider | Provider key of the login flow. |  | String. |
| AuthLoginStartRequest.BaseURL | Host callback or login base URL. |  | String. |
| AuthLoginStartRequest.Host | Host configuration summary. |  | `HostConfigSummary`. |
| AuthLoginStartRequest.HTTPClient | HTTP client that sends according to the host transport policy. |  | `HostHTTPClient`, ignored by JSON. See [Host Callbacks](/plugin/host-callbacks). |
| AuthLoginStartRequest.Metadata | Plugin-defined login context. |  | `map[string]any`. |
| AuthLoginStartResponse.Provider | Provider key of the login flow. |  | String. |
| AuthLoginStartResponse.URL | Login address for the user to open. |  | String. |
| AuthLoginStartResponse.State | Opaque state used for polling. |  | Handed to `PollLogin`. |
| AuthLoginStartResponse.ExpiresAt | Expiry time of this login round. |  | `time.Time`. |
| AuthLoginStartResponse.Metadata | Plugin-defined polling context. |  | `map[string]any`. |
| AuthLoginPollRequest.Provider | Provider key of the login flow. |  | String. |
| AuthLoginPollRequest.State | State returned by `StartLogin`. |  | String. |
| AuthLoginPollRequest.Host | Host configuration summary. |  | `HostConfigSummary`. |
| AuthLoginPollRequest.HTTPClient | Host HTTP client. |  | Ignored by JSON. |
| AuthLoginPollRequest.Metadata | Plugin-defined polling context. |  | `map[string]any`. |
| AuthLoginPollResponse.Status | Current login status. |  | Can only be `pending`, `success`, or `error`. |
| AuthLoginPollResponse.Message | Progress or error text. |  | String. |
| AuthLoginPollResponse.Auth | One credential on success. |  | Used when `Status` is `success`. |
| AuthLoginPollResponse.Auths | Several credentials expanded from one login. |  | `[]AuthData`. |
| AuthRefreshRequest.AuthID | Credential ID to refresh. |  | String. |
| AuthRefreshRequest.AuthProvider | Credential provider. |  | String. |
| AuthRefreshRequest.StorageJSON | The plugin's own persisted data. |  | `[]byte`. |
| AuthRefreshRequest.Metadata | Host-mutable metadata. |  | `map[string]any`. |
| AuthRefreshRequest.Attributes | Immutable routing and provider attributes. |  | `map[string]string`. |
| AuthRefreshRequest.Host | Host configuration summary. |  | `HostConfigSummary`. |
| AuthRefreshRequest.HTTPClient | Host HTTP client. |  | Ignored by JSON. |
| AuthRefreshResponse.Auth | Credential after refresh. |  | `AuthData`. |
| AuthRefreshResponse.NextRefreshAfter | Earliest time the next refresh is allowed. |  | `time.Time`. |
| AuthData.Provider | Provider that owns the credential. |  | String. |
| AuthData.ID | Stable ID on the host side. |  | String. |
| AuthData.FileName | Source or persisted file name. |  | String. |
| AuthData.Label | Display name. |  | String. |
| AuthData.Prefix | Model prefix of this credential. |  | String. |
| AuthData.ProxyURL | Credential-level proxy address. |  | String. |
| AuthData.Disabled | Whether to skip this credential. |  | Boolean. |
| AuthData.StorageJSON | The plugin's own persisted data. |  | `[]byte`. |
| AuthData.Metadata | Host-mutable metadata. |  | `map[string]any`. |
| AuthData.Attributes | Immutable attributes. |  | `map[string]string`. |
| AuthData.NextRefreshAfter | Earliest time the next refresh is allowed. |  | `time.Time`. |
| HostConfigSummary.AuthDir | Resolved credential directory. |  | String. |
| HostConfigSummary.ProxyURL | Configured upstream proxy. |  | String. |
| HostConfigSummary.ForceModelPrefix | Whether an alias keeps the provider prefix. |  | Boolean. |
| HostConfigSummary.OAuthModelAlias | Mapping from provider to model aliases. |  | Elements are `ModelAlias`, with `Name` and `Alias`. |
| HostConfigSummary.ExcludedModels | Model names hidden by provider. |  | `map[string][]string`. |

## 5. Common errors and limits

When any of the four methods that return `error` fails, the ABI envelope `ok` is false. `error.code` and `error.message` are required. `retryable` may be omitted. When `http_status` is omitted or 0, it is treated as HTTP 500.

When `ParseAuth` does not recognize the material, it returns `Handled: false` rather than treating an empty `AuthData` as a successful credential. Login status accepts only `pending`, `success`, and `error`. `HTTPClient` does not enter JSON.

## 6. Related behavior

The model list is in [Model Provider](/plugin/model-provider). Choosing a credential is in [Scheduler](/plugin/scheduler). Upstream calls are in [Host Callbacks](/plugin/host-callbacks).

## 7. Field experience

None yet.

