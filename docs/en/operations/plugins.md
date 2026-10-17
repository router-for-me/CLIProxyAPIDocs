---
title: Plugin loading and the store
feature_ids:
  - plugins.auth-revision.value
  - plugins.configs.enabled
  - plugins.configs.priority
  - plugins.dir.value
  - plugins.enabled.value
  - plugins.store-auth.allow-insecure
  - plugins.store-auth.apply-to
  - plugins.store-auth.header-name
  - plugins.store-auth.header-value-env
  - plugins.store-auth.match
  - plugins.store-auth.password-env
  - plugins.store-auth.token-env
  - plugins.store-auth.type
  - plugins.store-auth.username-env
  - plugins.store-sources.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Plugin loading and the store

## 1. What this solves

Decide whether dynamic plugins are loaded, which directory they are discovered from, whether each plugin instance is enabled and in what startup order, and optionally append third-party plugin stores and the authentication rules for those stores.

## 2. Scope and non-goals

This is host configuration, not an interface a plugin author has to implement. Interface notes remain on the plugin-development pages. The management routes for listing, installing, and quota are in [Plugins](/management/v8-plugins). `plugins.auth-revision` is maintained by Home and cannot be changed as an ordinary setting.

## 3. How to configure or call it

```yaml
plugins:
  enabled: false
  dir: "plugins"
  configs:
    example:
      enabled: true
      priority: 1
```

When appending a store and authentication, use `https://example.invalid` for the address. Put secrets in environment variables. The configuration only names the variables. The sample types are `bearer`, `basic`, `header`, and `github-token`.

```yaml
plugins:
  store-sources:
    - "https://example.invalid/cliproxy-plugins/registry.json"
  store-auth:
    - match: "https://example.invalid/bearer/"
      apply-to: ["registry", "artifact"]
      type: "bearer"
      token-env: "CLIPROXY_PLUGIN_STORE_TOKEN"
      allow-insecure: false
    - match: "https://example.invalid/basic/"
      apply-to: ["registry", "artifact"]
      type: "basic"
      username-env: "CLIPROXY_PLUGIN_STORE_USER"
      password-env: "CLIPROXY_PLUGIN_STORE_PASSWORD"
      allow-insecure: false
    - match: "https://example.invalid/header/"
      apply-to: ["registry", "artifact"]
      type: "header"
      header-name: "X-Plugin-Token"
      header-value-env: "CLIPROXY_PLUGIN_STORE_HEADER_TOKEN"
      allow-insecure: false
    - match: "https://example.invalid/repos/example/"
      apply-to: ["registry", "artifact"]
      type: "github-token"
      token-env: "CLIPROXY_PLUGIN_GITHUB_TOKEN"
      allow-insecure: false
```

The built-in official store is always included. `store-sources` only appends.

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| plugins.auth-revision | Changes when Home-managed plugin credentials change. | 0 | If Management API v8 changes this field, the response is 400 with the error `read_only_field`. |
| plugins.configs.enabled | Whether this plugin instance is enabled. | nil | During YAML parsing, nil is normalized to false. An instance's enabled flag does not implicitly turn on global `plugins.enabled`. |
| plugins.configs.priority | Plugin startup and routing order. | 0 | An integer. When omitted, it is 0. |
| plugins.dir | Plugin discovery directory. | empty string | An empty string is normalized to `plugins`. A value that starts with `~` expands to the user home directory. If `plugins.enabled` is true and the directory cannot be resolved, configuration loading fails. |
| plugins.enabled | Whether to load dynamic plugins. | false | When false, they are not loaded as enabled. |
| plugins.store-auth.allow-insecure | Whether a matched store URL may use http. | false | An http URL is accepted only when some rule's match and apply-to hit that URL and this field is true. Otherwise the error is insecure plugin store url requires matching allow-insecure auth rule. |
| plugins.store-auth.apply-to | Which request kinds this authentication applies to. | nil | `registry`, `metadata`, and `artifact` are allowed. Other values are not accepted on the parsed authentication. An empty list adds no kind. |
| plugins.store-auth.header-name | Header name used by the `header` type. | empty string | It cannot be empty, and it cannot contain a carriage return, a newline, or a colon. |
| plugins.store-auth.header-value-env | Name of the environment variable that holds the header value. | empty string | If the variable value is empty, that header authentication is treated as not configured. The value cannot contain CR or LF. |
| plugins.store-auth.match | Prefix used to match a store URL. | empty string | An empty match is dropped during normalization. It must be an https URL with a host, and it cannot carry user info, a query, or a fragment. |
| plugins.store-auth.password-env | Password environment-variable name for the `basic` type. | empty string | It must be non-empty together with the username variable. |
| plugins.store-auth.token-env | Token environment-variable name for `bearer` or `github-token`. | empty string | If the variable value is empty, that type of authentication does not apply. The token is not written into the plugin manifest. |
| plugins.store-auth.type | Authentication type. | empty string | An empty type is normalized to `none`. `none`, `bearer`, `basic`, `header`, and `github-token` are usable. Any other type is reported as unsupported. |
| plugins.store-auth.username-env | Username environment-variable name for the `basic` type. | empty string | It must be non-empty together with the password variable. |
| plugins.store-sources | Third-party store registries appended beyond the built-in official source. | nil | An invalid source makes the management store list return 500 `plugin_store_source_invalid`. |

## 5. Common errors and limits

A store URL cannot embed a username and password, and it cannot carry sensitive query parameters. If `match` is not https, or it has a query, fragment, or user info, the parsed rule is invalid. An `http` store address that does not hit a rule with `allow-insecure: true` is rejected. When global `enabled` is false, an instance with `configs.example.enabled: true` is still not effectively enabled. A v8 write that changes `auth-revision` is rejected, and the file is not saved because of it.

## 6. Related behavior

Install and quota are in [Plugins](/management/v8-plugins). Home sync is in [CLIProxyAPI Home](/operations/home).

## 7. Field experience

None yet.
