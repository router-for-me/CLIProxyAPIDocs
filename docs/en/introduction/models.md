---
title: Model catalogs
feature_ids:
  - models.catalog.value
  - models.codex-catalog.value
  - models.devin-catalog.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Model catalogs

## 1. What this solves

`models` sets the source for the general model catalog, the Codex client catalog, and the Devin catalog. The three entries do not affect one another. An empty value keeps the process default: `--local-model` uses the built-in catalog, otherwise the official remote catalog is used. An absolute path or an http(s) URL overrides only that one entry and takes priority over `--local-model`.

## 2. Scope and non-goals

These three entries live under `models` in the configuration file. This page does not explain how a model ID is routed, and it does not explain the internal fields of the catalog JSON.

Home mode disables the general catalog and the Devin catalog even when those entries have an explicit source. Home mode does not disable the Codex catalog. `config.example.yaml` only says that Home mode does not load the general catalog, which does not match the code. The code is authoritative.

If an explicit source fails to refresh, the previous valid catalog is kept. The process does not fall back to the official URL. File and URL sources refresh when the source changes, then once every 3 hours. A built-in source is loaded once and is not fetched again on that interval.

## 3. How to configure or call it

Empty values in the sample configuration are the default shape:

```yaml
models:
  catalog: ""
  codex-catalog: ""
  devin-catalog: ""
```

To replace one entry, use an absolute path or an http(s) URL that includes a host. The path and URL below are placeholders, not defaults:

```yaml
models:
  catalog: "/absolute/path/models.json"
  codex-catalog: "https://example.invalid/codex.json"
  devin-catalog: ""
```

To make only the empty entries use the built-in catalog, add `--local-model` to the startup flags. Entries that are already set still use the explicit source above.

```bash
CLIProxyAPI --local-model --config /path/to/config.yaml
```

## 4. Details

The Default column matches the ledger `defaults` verbatim.

| Field | Meaning | Default | Constraint |
| --- | --- | --- | --- |
| models.catalog.value | `models.catalog`, the source of the general model catalog. | empty string | An empty value is the built-in catalog when `--local-model` is set, otherwise the official remote catalog. A non-empty value must be an absolute path or an http(s) URL with a host. Home mode disables it and no longer reads an explicit source. |
| models.codex-catalog.value | `models.codex-catalog`, the source of the Codex client model catalog. | empty string | Empty and explicit sources follow the same rules as above. Home mode does not disable this entry. |
| models.devin-catalog.value | `models.devin-catalog`, the source of the Devin model catalog. | empty string | Empty and explicit sources follow the same rules as above. Home mode disables it even when an explicit source is set. The sample comment does not say this. |

## 5. Common errors and limits

A relative path, an unparseable address, a scheme other than http or https, or an http(s) URL without a host is rejected when the configuration is loaded. The error text is `models.<field> must be an http(s) URL or an absolute local path`, where `<field>` is `catalog`, `codex-catalog`, or `devin-catalog`. The configuration cannot be loaded.

If a custom source returns a non-success HTTP status, the file cannot be opened, the content is invalid, or the read exceeds the size limit, that refresh fails and the previous valid catalog is kept. A custom source is not redirected to the official URL. A source marked disabled is not read.

## 6. Related behavior

How `--local-model` applies at startup is covered in [Command-line flags](/introduction/install).

## 7. Field experience

- [Antigravity hides models the account cannot use](/experience/accounts#exp-accounts-antigravity-hides-unusable-models)
- [Log in to Codex again after a plan or token change](/experience/accounts#exp-accounts-codex-login-again)
- [Exclude a model on a single credential](/experience/accounts#exp-accounts-exclude-model)
- [Stop injecting the image tool](/experience/api#exp-api-disable-image-tool-injection)
- [Do not expect the proxy to invent reasoning text the catalog did not return](/experience/api#exp-api-no-synthetic-reasoning)
- [Change the advertised window with max-context-length](/experience/configuration#exp-configuration-advertise-context-length)
- [Visible models follow the pinned catalog](/experience/introduction#exp-introduction-catalog-is-authoritative)
- [The local-model switch skips the remote refresh](/experience/introduction#exp-introduction-local-model-catalog)
- [auth_unavailable means no usable credential](/experience/operations#exp-operations-auth-unavailable-means-no-credential)
- [After a 429, skip that model until the reset time](/experience/routing#exp-routing-cooldown-until-reset)
