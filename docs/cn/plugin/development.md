---
outline: 'deep'
---

# 插件开发

CLIProxyAPI 的插件系统用于把模型、凭证、调度、转换、拦截、用量观察、命令行扩展和管理页面等能力接入到宿主流程中。插件以原生动态库形式运行在 CLIProxyAPI 进程内，宿主通过稳定的 C ABI 调用插件，插件也可以通过宿主回调复用 CLIProxyAPI 已有的 HTTP、模型执行、凭证文件和日志能力。

## 适用范围

插件适合做这些事情：

- 为新上游提供模型列表、凭证解析、登录刷新和请求执行能力。
- 在请求进入上游前做请求转换、请求规整、调度选择或请求拦截。
- 在响应返回给客户端前做响应转换、响应规整或流式 chunk 拦截。
- 接收用量记录，或为管理端增加只属于该插件的页面和诊断接口。
- 调用宿主已有模型执行链路，而不是在插件里复制密钥、代理、日志、用量统计和路由逻辑。

插件不适合用来承载不可信代码。标准动态库插件与服务二进制处在同一进程内，宿主可以恢复部分 panic，但不能阻止插件退出进程、破坏内存、修改进程全局状态或泄露敏感数据。

## 能力文档

每个能力都有独立说明页，内容按 `sdk/pluginapi/types.go`、`sdk/pluginabi/types.go`、`internal/pluginhost` 调用路径和 `examples/plugin` 示例整理。

| 分类 | 能力 | 文档 |
| --- | --- | --- |
| 入口能力 | `model_registrar` | [模型注册器](./model-registrar) |
| 入口能力 | `model_provider` | [模型提供方](./model-provider) |
| 入口能力 | `auth_provider` | [凭证提供方](./auth-provider) |
| 入口能力 | `frontend_auth_provider` | [前端认证提供方](./frontend-auth-provider) |
| 入口能力 | `frontend_auth_provider_exclusive` | [前端认证独占模式](./frontend-auth-exclusive) |
| 入口能力 | `scheduler` | [调度器](./scheduler) |
| 入口能力 | `model_router` | [模型路由](./model-router) |
| 入口能力 | `executor` | [执行器](./executor) |
| 请求处理 | `request_translator` | [请求转换](./request-translator) |
| 请求处理 | `request_normalizer` | [请求规整](./request-normalizer) |
| 请求处理 | `request_interceptor` | [请求拦截](./request-interceptor) |
| 响应处理 | `response_translator` | [响应转换](./response-translator) |
| 响应处理 | `response_before_translator` | [响应转换前规整](./response-before-translator) |
| 响应处理 | `response_after_translator` | [响应转换后规整](./response-after-translator) |
| 响应处理 | `response_interceptor` | [响应拦截](./response-interceptor) |
| 响应处理 | `response_stream_interceptor` | [流式响应拦截](./response-stream-interceptor) |
| 扩展能力 | `thinking_applier` | [Thinking 处理](./thinking-applier) |
| 扩展能力 | `usage_plugin` | [用量观察](./usage-plugin) |
| 扩展能力 | `command_line_plugin` | [命令行扩展](./command-line-plugin) |
| 扩展能力 | `management_api` | [Management API](./management-api) |
| 宿主能力 | `host.*` | [宿主回调](./host-callbacks) |

## 运行前提

插件能力依赖 CGO 构建。管理 API 响应会带有：

```http
X-CPA-SUPPORT-PLUGIN: 1
```

`1` 表示当前二进制支持动态库插件，`0` 表示该二进制不支持。这个头只表示构建能力，不表示插件已经启用，也不表示某个插件已经加载。

配置里还需要开启全局插件开关：

```yaml
plugins:
  enabled: true
  dir: "plugins"
  configs: {}
```

如果 `plugins.enabled` 为 `false`，插件文件和单个插件配置仍可存在，但不会变成有效启用状态。

## 插件文件发现

插件 ID 来自动态库文件名去掉扩展名。例如：

```text
plugins/darwin/arm64/example-provider.dylib
```

对应配置键：

```yaml
plugins:
  configs:
    example-provider:
      enabled: true
      priority: 1
```

插件 ID 必须匹配：

```text
[A-Za-z0-9][A-Za-z0-9._-]{0,127}
```

宿主按当前平台依次搜索：

```text
plugins/<GOOS>/<GOARCH>-<variant>
plugins/<GOOS>/<GOARCH>
plugins
```

其中 macOS 使用 `.dylib`，Linux 和 FreeBSD 使用 `.so`，Windows 使用 `.dll`。同一个插件 ID 如果在多个目录出现，优先级更高的目录先生效。

## ABI 基础

每个标准动态库插件必须导出：

```c
int cliproxy_plugin_init(const cliproxy_host_api* host, cliproxy_plugin_api* plugin);
```

插件在初始化时填充自己的函数表：

```c
int call(char* method, uint8_t* request, size_t request_len, cliproxy_buffer* response);
void free_buffer(void* ptr, size_t len);
void shutdown(void);
```

宿主提供的函数表用于插件反向调用宿主：

```c
int call(void* host_ctx, char* method, uint8_t* request, size_t request_len, cliproxy_buffer* response);
void free_buffer(void* ptr, size_t len);
```

C ABI 只传递方法名、字节数组和长度，不传递 Go interface、Go slice、Go map、Go channel、`context.Context` 或 Go error。请求与响应使用 JSON 信封，原始字节字段在 JSON 中自动以 base64 表示。

成功响应：

```json
{
  "ok": true,
  "result": {}
}
```

错误响应：

```json
{
  "ok": false,
  "error": {
    "code": "invalid_request",
    "message": "request is invalid"
  }
}
```

## 生命周期

宿主会调用这些基础方法：

| 方法 | 方向 | 作用 |
| --- | --- | --- |
| `plugin.register` | 宿主调用插件 | 首次加载插件，读取元数据、配置字段和能力声明。 |
| `plugin.reconfigure` | 宿主调用插件 | 配置变更后重新传入该插件的配置。 |
| `plugin.shutdown` | 宿主调用插件 | 插件卸载或宿主关闭时释放资源。 |

`plugin.register` 和 `plugin.reconfigure` 的请求会包含 `config_yaml`。它来自 `plugins.configs.<pluginID>`，宿主会保留插件自己的 YAML 字段，只解析宿主拥有的 `enabled` 与 `priority`。

注册响应需要返回：

```json
{
  "schema_version": 1,
  "metadata": {
    "Name": "example-provider",
    "Version": "0.1.0",
    "Author": "router-for-me",
    "GitHubRepository": "https://github.com/router-for-me/example-provider",
    "Logo": "https://example.com/logo.png",
    "ConfigFields": [
      {
        "Name": "mode",
        "Type": "enum",
        "EnumValues": ["safe", "fast"],
        "Description": "Execution mode."
      }
    ]
  },
  "capabilities": {
    "request_normalizer": true,
    "management_api": true
  }
}
```

`ConfigFields` 供管理端渲染插件自有配置。它不替代插件自身的配置校验，插件仍应在 `plugin.register` / `plugin.reconfigure` 中验证自己关心的字段。

## 配置语义

推荐最小配置：

```yaml
plugins:
  enabled: true
  dir: "plugins"
  configs:
    example-provider:
      enabled: true
      priority: 1
      mode: "safe"
```

字段含义：

| 字段 | 说明 |
| --- | --- |
| `plugins.enabled` | 全局插件加载开关。 |
| `plugins.dir` | 插件发现目录，默认是 `plugins`。 |
| `plugins.store-sources` | 额外插件商店 registry URL 列表。 |
| `plugins.configs.<pluginID>.enabled` | 单个插件开关。未写时按启用处理。 |
| `plugins.configs.<pluginID>.priority` | 插件启动、注册和路由顺序。高优先级插件先处理。 |
| 其他字段 | 插件自有配置，宿主会原样保留并传给插件。 |

管理 API 更新配置时会尽量保留原有 YAML 树，只修改请求要求的字段。插件商店安装插件后，会写入动态库并把对应插件配置设为 `enabled: true`，但不会强行打开 `plugins.enabled`。

## 能力模型

插件通过 `capabilities` 声明自己实现的能力。常见能力如下：

| 能力 | 方法方向 | 用途 |
| --- | --- | --- |
| 模型注册器 | `model.register` | 向宿主注册静态模型元数据。 |
| 模型提供方 | `model.static` / `model.for_auth` | 提供静态模型或按凭证记录提供模型。 |
| 凭证提供方 | `auth.*` | 解析、登录、轮询和刷新插件提供方的凭证。 |
| 前端认证提供方 | `frontend_auth.*` | 在代理处理前认证客户端请求。 |
| 调度器 | `scheduler.pick` | 从候选凭证中选择一个凭证，或委托内置调度器。 |
| 模型路由 | `model.route` | 在 provider/auth 选择前，把匹配请求路由到插件执行器、当前路由插件自己的执行器或内置 provider。 |
| 执行器 | `executor.*` | 直接执行上游请求或流式请求。 |
| 请求转换 | `request.translate` | 把规范请求转换成上游协议。 |
| 请求规整 | `request.normalize` | 规整进入执行链路的请求。 |
| 请求拦截 | `request.intercept_before` / `request.intercept_after` | 在选凭证前后改写执行请求。 |
| 响应转换 | `response.translate` | 把规范响应转换成客户端协议。 |
| 响应规整 | `response.normalize_before` / `response.normalize_after` | 在原生转换前后规整响应。 |
| 响应拦截 | `response.intercept_after` | 改写非流式响应。 |
| 流式响应拦截 | `response.intercept_stream_chunk` | 改写流式响应 chunk。 |
| Thinking 处理 | `thinking.apply` | 应用已验证的 thinking 配置。 |
| 用量观察 | `usage.handle` | 接收完成后的用量记录。 |
| 命令行扩展 | `command_line.*` | 注册并处理插件自有命令行参数。 |
| Management API | `management.*` | 注册插件自己的管理路由或浏览器资源。 |

宿主的总体规则是：原生逻辑优先，插件补齐缺口；多个插件都能处理同一阶段时，高优先级插件先执行。

## 宿主回调

宿主回调是插件调用宿主，不是宿主调用插件。它适合复用宿主已经处理好的代理、凭证、模型路由、日志、用量统计和资源管理。

常用回调：

| 回调 | 用途 |
| --- | --- |
| `host.http.do` | 由宿主执行一次普通 HTTP 请求。 |
| `host.http.do_stream` / `host.http.stream_read` / `host.http.stream_close` | 由宿主执行流式 HTTP 请求并读取/关闭流。 |
| `host.model.execute` | 通过宿主模型执行链路发起非流式模型请求。 |
| `host.model.execute_stream` / `host.model.stream_read` / `host.model.stream_close` | 通过宿主模型执行链路发起流式模型请求并读取/关闭流。 |
| `host.stream.emit` / `host.stream.close` | 执行器插件向宿主流桥发送 chunk 或关闭流。 |
| `host.log` | 通过宿主日志输出。 |
| `host.auth.list` | 列出宿主凭证记录。 |
| `host.auth.get` | 读取物理凭证 JSON 文件。 |
| `host.auth.get_runtime` | 读取运行时凭证信息。 |
| `host.auth.save` | 写入凭证 JSON 并更新运行时凭证记录。 |

如果插件从 `management.handle` 或其他宿主调用上下文里再调用 `host.model.execute` / `host.model.execute_stream`，应转发请求中的 `host_callback_id`。宿主会据此识别发起回调的插件，并在嵌套模型执行中跳过同一个插件的请求、响应和流式拦截器，避免插件递归调用自己。其他已启用插件仍可处理这次嵌套请求。

流式回调建议显式调用对应的 `*_close` 方法。宿主可以在 RPC 作用域结束时清理一部分资源，但插件主动关闭能更快释放流资源，也更容易定位错误。

## Management API 与插件资源

插件可以声明两类管理能力：

1. 需要管理凭证的插件自有 API。
2. 可由浏览器直接打开的插件资源页面。

它们的路由边界不同：

| 类型 | 注册字段 | 暴露路径 | 认证 |
| --- | --- | --- | --- |
| 插件自有 Management API | `routes` | `/v0/management/...` | 需要管理密钥。 |
| 插件资源页面 | `resources` | `/v0/resource/plugins/<pluginID>/...` | 作为资源路由访问。 |

示例：插件 ID 是 `example-provider`，资源路径是 `/status`，最终访问地址是：

```text
http://localhost:8317/v0/resource/plugins/example-provider/status
```

插件通过 `management.register` 返回路由和资源：

```json
{
  "resources": [
    {
      "Path": "/status",
      "Menu": "Example Provider",
      "Description": "Show plugin status."
    }
  ],
  "routes": [
    {
      "Method": "POST",
      "Path": "/plugins/example-provider/run"
    }
  ]
}
```

宿主会把匹配请求转给 `management.handle`。请求包含 method、path、headers、query 和 body；响应包含 status code、headers 和 body。

注意：

- 插件自有 Management API 会与宿主已有 `/v0/management` 路由做冲突检查，冲突时跳过插件路由。
- 插件资源路径会固定挂在 `/v0/resource/plugins/<pluginID>/` 下。
- 带 `Menu` 的旧式 GET management 路由会作为浏览器资源处理，不再作为管理 API 暴露。
- 资源路径不能包含空白、`:`、`*` 或 `..`。

## 管理接口

以下接口都在 `/v0/management` 下，并且需要管理密钥。

| 方法与路径 | 作用 |
| --- | --- |
| `GET /plugins` | 列出已发现、已配置、已注册插件，并返回 `plugins_enabled`、`effective_enabled`、菜单、元数据和配置字段。 |
| `PATCH /plugins/{pluginID}/enabled` | 只更新 `plugins.configs.<pluginID>.enabled`，不修改全局 `plugins.enabled`。 |
| `GET /plugins/{pluginID}/config` | 获取该插件保留后的配置对象。 |
| `PUT /plugins/{pluginID}/config` | 整体替换该插件配置对象。 |
| `PATCH /plugins/{pluginID}/config` | 浅合并配置对象；字段值为 `null` 时删除该字段。 |
| `DELETE /plugins/{pluginID}` | 定向卸载目标插件，删除本地动态库并移除保存的配置。 |
| `GET /plugin-store` | 列出插件商店中的插件和本地安装状态。 |
| `POST /plugin-store/{pluginID}/install` | 从插件商店安装或更新插件；多来源同 ID 时使用 `?source=<sourceID>`。 |

`GET /plugins` 中几个状态字段不要混用：

- `plugins_enabled`：全局插件开关。
- `enabled`：单个插件配置开关。
- `registered`：插件动态库已加载并完成注册。
- `effective_enabled`：全局开关、单插件开关和注册状态同时满足后的实际启用状态。

安装或更新插件时，宿主会先下载 release 资产并校验 `checksums.txt`，然后在覆盖动态库前定向卸载目标插件，再写入新文件并触发配置热重载。如果平台或文件锁导致已加载动态库无法覆盖，接口会返回需要重启的冲突响应。

## 插件商店发布格式

默认插件商店 registry：

```text
https://raw.githubusercontent.com/router-for-me/CLIProxyAPI-Plugins-Store/main/registry.json
```

可以通过配置追加第三方来源：

```yaml
plugins:
  store-sources:
    - "https://example.com/cliproxyapi-plugins/registry.json"
```

registry 格式：

```json
{
  "schema_version": 1,
  "plugins": [
    {
      "id": "example-provider",
      "name": "Example Provider",
      "description": "Example plugin provider.",
      "author": "router-for-me",
      "version": "0.1.0",
      "repository": "https://github.com/router-for-me/example-provider",
      "logo": "https://example.com/logo.png",
      "homepage": "https://example.com",
      "license": "MIT",
      "tags": ["provider"]
    }
  ]
}
```

要求：

- `schema_version` 必须是 `1`。
- `id`、`name`、`description`、`author`、`repository` 必填。
- `repository` 必须是 `https://github.com/{owner}/{repo}`。
- `version` 是展示兜底值；真正安装版本来自 GitHub latest release tag。tag 可以带 `v`，宿主会去掉前导 `v` 后校验版本。

插件 release 需要提供当前平台对应的 zip 资产和 `checksums.txt`：

```text
<pluginID>_<version>_<goos>_<goarch>.zip
checksums.txt
```

zip 根目录必须直接包含目标动态库：

```text
example-provider.dylib
```

不能把动态库放在子目录里。`checksums.txt` 使用常见 sha256 格式：

```text
<sha256>  example-provider_0.1.0_darwin_arm64.zip
```

## 开发建议

推荐从仓库中的示例开始：

```bash
make -C examples/plugin list
make -C examples/plugin build
```

常用示例：

| 示例 | 重点 |
| --- | --- |
| `examples/plugin/simple` | Go、C、Rust 三种语言的完整 ABI 骨架。 |
| `examples/plugin/codex-service-tier` | 请求规整插件。 |
| `examples/plugin/scheduler` | 调度插件。 |
| `examples/plugin/claude-web-search-router` | ModelRouter 插件，把 Claude Code `web_search` 请求路由到内置 provider 或自身执行器。 |
| `examples/plugin/management-api` | 插件自有管理路由和资源页面。 |
| `examples/plugin/host-callback-auth-files` | 调用宿主凭证文件回调。 |
| `examples/plugin/host-model-callback` | 调用宿主模型执行回调，并演示递归保护。 |

开发时建议遵守：

- 插件只声明自己真正实现的能力。
- 插件自己的 HTTP 请求优先走 `host.http.*`，避免绕过宿主代理、日志和传输策略。
- 需要发起模型请求时优先走 `host.model.*`，不要把宿主凭证复制进插件。
- 流式资源使用后显式关闭。
- 插件自有配置字段保持向后兼容，删除字段时同时兼容旧配置。
- 日志不要输出密钥、token、原始凭证 JSON 或用户敏感请求体。
- 修改动态库后，使用插件管理接口或重启服务确保旧插件实例已经卸载。

## 最小验证流程

本地开发一个插件后，可以按下面流程验证：

1. 构建当前平台动态库，并放入 `plugins/<GOOS>/<GOARCH>/` 或 `plugins/`。
2. 在 `config.yaml` 中开启 `plugins.enabled`，并添加 `plugins.configs.<pluginID>`。
3. 启动 CLIProxyAPI。
4. 请求 `GET /v0/management/plugins`，确认 `registered: true` 和 `effective_enabled: true`。
5. 如果插件有资源页面，打开 `/v0/resource/plugins/<pluginID>/<path>`。
6. 如果插件有 Management API，使用管理密钥请求对应 `/v0/management/...` 路由。
7. 修改插件后，通过管理接口安装/删除，或重启服务，确认旧动态库没有继续被使用。
