---
title: "Operations"
related_feature_ids:
  - auth.claude.login
  - cli.server.antigravity-login
  - cli.server.codex-login
  - cli.server.config
  - cli.server.tui
  - management.allow-remote.value
  - management.disable-control-panel.value
  - management.secret-key.value
  - management.v8.get-observability-usage-api-keys
  - management.v8.get-observability-usage-queue
  - models.catalog.value
  - oauth.auth-dir.value
  - observability.logs.debug
  - observability.logs.logging-to-file
  - observability.logs.logs-max-total-size-mb
  - observability.logs.request-log
  - observability.usage.usage-statistics-enabled
  - route.management-html.get
  - server.commercial-mode.value
  - server.host.value
  - server.port.value
  - server.tls.cert
  - server.tls.enable
  - server.tls.key
source_issues:
  - 56
  - 190
  - 541
  - 635
  - 681
  - 844
  - 863
  - 944
  - 954
  - 1020
  - 1393
  - 1497
  - 1589
  - 1772
  - 1790
  - 2195
  - 2315
  - 2498
  - 2541
  - 2617
  - 2828
  - 2925
  - 2955
  - 3035
  - 3220
  - 3270
  - 3405
  - 3732
  - 3743
  - 4019
  - 4483
  - 4807
  - 5314
  - 5972
  - 6060
  - 6323
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
translation_pending: false
---

# Operations

## Scope and limits

The practices on this page are checked only against configuration, routes, or commands that still exist in pinned commit `911f49cbd49f4fe2516979754a7488a3fd14fe64`. This page is not an official behavior promise. Keys, cookies, email addresses, authorization files, and user request bodies were not copied in.

## Short practices

- <a id="exp-operations-usage-stays-in-memory"></a>**Usage stays only in memory** (`exp.operations.usage-stays-in-memory`). Symptom: Usage returns to zero after a restart or upgrade, and the panel has no history. Action: First turn on usage-statistics-enabled. Counts can be viewed with GET /v8/management/observability/usage/api-keys. Records are taken out with GET /v8/management/observability/usage/queue. The proxy does not write them to disk, and there is no restore endpoint. Source issues: [#541](https://github.com/router-for-me/CLIProxyAPI/issues/541)、[#681](https://github.com/router-for-me/CLIProxyAPI/issues/681)、[#863](https://github.com/router-for-me/CLIProxyAPI/issues/863)、[#1497](https://github.com/router-for-me/CLIProxyAPI/issues/1497)、[#1589](https://github.com/router-for-me/CLIProxyAPI/issues/1589)、[#2828](https://github.com/router-for-me/CLIProxyAPI/issues/2828)、[#2955](https://github.com/router-for-me/CLIProxyAPI/issues/2955)、[#3035](https://github.com/router-for-me/CLIProxyAPI/issues/3035)、[#3220](https://github.com/router-for-me/CLIProxyAPI/issues/3220)。. Official pages: [Observability](/management/v8-observability)、[Logs and usage](/operations/observability).
- <a id="exp-operations-request-log-text"></a>**Use the request log to see the original text** (`exp.operations.request-log-text`). Symptom: Usage is zero, or you want to confirm whether the request was recorded. Action: request-log is a configuration switch. After it is on, the log is readable text, not a structured stream. When upstream omits usage, use it to see the raw body. When debug is also on, the log writes the selected credential file name. Source issues: [#1020](https://github.com/router-for-me/CLIProxyAPI/issues/1020)、[#1772](https://github.com/router-for-me/CLIProxyAPI/issues/1772)、[#3732](https://github.com/router-for-me/CLIProxyAPI/issues/3732)、[#4807](https://github.com/router-for-me/CLIProxyAPI/issues/4807)、[#5314](https://github.com/router-for-me/CLIProxyAPI/issues/5314)。. Official pages: [Logs and usage](/operations/observability).
- <a id="exp-operations-cap-request-logs"></a>**Limit the total size of request logs** (`exp.operations.cap-request-logs`). Symptom: After request-log is turned on, the disk or Docker volume keeps growing. Action: Set logs-max-total-size-mb to a positive number. Only after that limit is exceeded are the oldest logs deleted. 0 means no cleanup. Source issues: [#2498](https://github.com/router-for-me/CLIProxyAPI/issues/2498)、[#3405](https://github.com/router-for-me/CLIProxyAPI/issues/3405)。. Official pages: [Logs and usage](/operations/observability).
- <a id="exp-operations-disable-request-log"></a>**Turn off the request log to stop the flood** (`exp.operations.disable-request-log`). Symptom: Request logs surge after startup. Action: Set request-log to false, and have the client stop sending prompts that are too large. Source issues: [#635](https://github.com/router-for-me/CLIProxyAPI/issues/635)。. Official pages: [Logs and usage](/operations/observability).
- <a id="exp-operations-management-secret"></a>**Management login uses secret-key** (`exp.operations.management-secret`). Symptom: A remote or web session cannot open the management side, or the management password cannot be remembered. Action: The management key is secret-key in the configuration, and it must also match MANAGEMENT_PASSWORD. Remote access also requires allow-remote set to true. The server cannot recover an old password from a hash. Credentials generated by this project can be used by copying them into auth-dir. Source issues: [#56](https://github.com/router-for-me/CLIProxyAPI/issues/56)、[#844](https://github.com/router-for-me/CLIProxyAPI/issues/844)、[#2315](https://github.com/router-for-me/CLIProxyAPI/issues/2315)、[#2617](https://github.com/router-for-me/CLIProxyAPI/issues/2617)、[#2925](https://github.com/router-for-me/CLIProxyAPI/issues/2925)、[#3270](https://github.com/router-for-me/CLIProxyAPI/issues/3270)。. Official pages: [Command-line flags](/introduction/install)、[Management settings](/operations/management-settings)、[OAuth directory, aliases, and exclusions](/accounts/oauth)、[Other endpoints](/api/openai-other).
- <a id="exp-operations-bind-host-port"></a>**An empty host listens on every interface** (`exp.operations.bind-host-port`). Symptom: The service should bind only one address, or the meaning of an empty host is unclear. Action: When server.host is empty, it listens on every interface at server.port. Fill host only when a specific address is required. Source issues: [#190](https://github.com/router-for-me/CLIProxyAPI/issues/190)。. Official pages: [Listener and process](/operations/server).
- <a id="exp-operations-reduce-memory"></a>**Turn off expensive logs to lower memory** (`exp.operations.reduce-memory`). Symptom: Process memory rises with requests. Action: Turn off usage-statistics-enabled, request-log, and debug. To reduce per-request overhead further, set server.commercial-mode to true. The request-log middleware is then not attached. Source issues: [#944](https://github.com/router-for-me/CLIProxyAPI/issues/944)。. Official pages: [Logs and usage](/operations/observability)、[Listener and process](/operations/server).
- <a id="exp-operations-log-directory"></a>**Logs are written in a writable logs directory** (`exp.operations.log-directory`). Symptom: Logs cannot be found in the Home configuration directory. Action: Application logs and request-log are written first to logs under the writable base directory. When that directory does not exist, they use logs in the current directory. Only when the current directory is not writable do they fall through to auth-dir/logs. Source issues: [#954](https://github.com/router-for-me/CLIProxyAPI/issues/954)、[#5972](https://github.com/router-for-me/CLIProxyAPI/issues/5972)。. Official pages: [OAuth directory, aliases, and exclusions](/accounts/oauth)、[Logs and usage](/operations/observability).
- <a id="exp-operations-auth-unavailable-means-no-credential"></a>**auth_unavailable means no credential is available** (`exp.operations.auth-unavailable-means-no-credential`). Symptom: A request returns auth_unavailable and is treated as a rejected body. Action: It means that model has no credential that can be selected. It does not mean the request body is invalid. Turn on request-log to see why the model was hidden. A model name in the catalog also does not mean a usable Claude or Codex credential already exists. Source issues: [#1393](https://github.com/router-for-me/CLIProxyAPI/issues/1393)、[#6060](https://github.com/router-for-me/CLIProxyAPI/issues/6060)、[#6323](https://github.com/router-for-me/CLIProxyAPI/issues/6323)。. Official pages: [Claude login](/accounts/claude)、[Antigravity login](/accounts/antigravity)、[Codex login](/accounts/codex)、[Model catalogs](/introduction/models)、[Logs and usage](/operations/observability).
- <a id="exp-operations-tui-is-client"></a>**TUI is only a management client by default** (`exp.operations.tui-is-client`). Symptom: The proxy also stops after --tui exits, or the opposite assumption is that it will start the service. Action: --tui without --standalone only connects to a management API that is already running. It does not keep the proxy process alive by itself. Source issues: [#1790](https://github.com/router-for-me/CLIProxyAPI/issues/1790)。. Official pages: [Terminal interface](/operations/tui).
- <a id="exp-operations-tls-needs-cert"></a>**Enabling TLS requires a certificate** (`exp.operations.tls-needs-cert`). Symptom: HTTPS does not start after TLS is turned on. Action: When server.tls.enable is true, neither tls.cert nor tls.key can be empty. Source issues: [#2195](https://github.com/router-for-me/CLIProxyAPI/issues/2195)。. Official pages: [TLS](/operations/tls).
- <a id="exp-operations-panel-route-is-html"></a>**There is no hashed management address after the panel is turned off** (`exp.operations.panel-route-is-html`). Symptom: A management URL that contains a hash returns 404. Action: When disable-control-panel is true, the panel is not served. The panel route is only management.html. There is no other hashed address. Source issues: [#2541](https://github.com/router-for-me/CLIProxyAPI/issues/2541)。. Official pages: [Management settings](/operations/management-settings)、[Other endpoints](/api/openai-other).
- <a id="exp-operations-port-already-bound"></a>**Stop the old process first when the port is already bound** (`exp.operations.port-already-bound`). Symptom: Startup shows a development banner, or the port conflicts. Action: Another process has already bound server.port. Stop the old process, then start again. Source issues: [#3743](https://github.com/router-for-me/CLIProxyAPI/issues/3743)。. Official pages: [Listener and process](/operations/server).
- <a id="exp-operations-disconnect-drops-usage"></a>**There is no final usage after the client disconnects** (`exp.operations.disconnect-drops-usage`). Symptom: Usage statistics are missing the last chunk. Action: A client disconnect cancels the upstream call, so the final usage chunk never arrives. The statistics themselves still stay only in memory, and they can include cache-read and cache-creation counts. Source issues: [#4019](https://github.com/router-for-me/CLIProxyAPI/issues/4019)、[#4483](https://github.com/router-for-me/CLIProxyAPI/issues/4483)。. Official pages: [Logs and usage](/operations/observability).

## Standalone pages

This area has no practice that needs its own page.

