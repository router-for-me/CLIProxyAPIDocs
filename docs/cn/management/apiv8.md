---
title: 管理 API v8
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
---

# 管理 API v8

## 1. 这段解决什么问题

用 `/v8/management` 读取或修改已经持久化的 v8 配置树。路径与 YAML 键一致。成功的修改会写回文件并热重载。

## 2. 适用条件与不做的事

这里只覆盖配置读写。凭证、OAuth、日志、插件、路由操作、版本查询和代发请求在同目录的其他页。`/v0/management` 已停止维护，见 [管理 API](/cn/management/api)。字段含义见各功能页，不在这里重复整份配置。

Home 模式返回 404。`management.secret-key`、`MANAGEMENT_PASSWORD` 和本地密码都为空时也是 404。

## 3. 怎么配置或怎么调用

基址使用 `https://example.invalid`。除另有说明的 OAuth 回调外，请求都要带管理密钥：

```http
GET /v8/management/config HTTP/1.1
Host: example.invalid
Authorization: Bearer YOUR_API_KEY
```

也可以把明文密钥放在 `X-Management-Key`。非本机还需要 `management.allow-remote: true`，除非设置了 `MANAGEMENT_PASSWORD`。

| 方法与路径 | 作用 |
| --- | --- |
| GET /v8/management/config | 把整份配置的 v8 视图返回为 JSON。 |
| PUT /v8/management/config | 用 JSON 对象替换整份配置。 |
| PATCH /v8/management/config | 把 JSON 对象深度合并进整份配置。 |
| GET /v8/management/config.yaml | 返回规范化后的 YAML 正文，类型为 `application/yaml`。 |
| PUT /v8/management/config.yaml | 用 YAML 正文替换整份配置。 |
| GET /v8/management/config/\<path\> | 返回该 YAML 节点的 JSON。 |
| PUT /v8/management/config/\<path\> | 替换该节点。 |
| PATCH /v8/management/config/\<path\> | 对象做深度合并，其他类型直接替换。 |
| DELETE /v8/management/config/\<path\> | 删除该节点。 |

路径段是 YAML 映射键，不是数组下标。列表要整段替换。请求体就是值本身，不要再包一层旧的 `value` 或 `items`。成功的写入返回 `{"status":"ok","config-version":8}`。

可选请求头 `If-Match` 与当前文件内容的强 ETag 比较。不带该头则无条件写入。值为 `*` 时匹配当前任何版本。不匹配返回 412，错误为 `precondition_failed`，并带回当前 ETag。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。这些路由没有单独的配置默认值。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| DELETE /v8/management/config/\*path | 删除所选配置节点。 |  | 不能删除根：400 `cannot_delete_config`。路径不存在：404 `not_found`。 |
| GET /v8/management/config | 读取整份配置的 JSON 视图。 |  | 不改写磁盘。响应带 `Cache-Control: no-store` 和 ETag。读文件失败：500 `read_failed`。 |
| GET /v8/management/config/\*path | 读取一个 YAML 节点的 JSON。 |  | 路径不存在：404 `not_found`。父节点不是映射或出现空段：写入时为 400 `invalid_path`；读取缺失为 404。 |
| GET /v8/management/config.yaml | 读取规范化 YAML 字节。 |  | 成功时不是 JSON。GET 不会单独把旧文件迁移成 v8。 |
| PATCH /v8/management/config | 深度合并根对象。 |  | 根必须是 JSON 对象，否则 400 `config_must_be_object`。`null` 会保存，不会删除字段。 |
| PATCH /v8/management/config/\*path | 合并或替换所选节点。 |  | 非 JSON 正文（YAML 端点除外）返回 400 `invalid_json`。无法解析的正文返回 400 `invalid_body`。 |
| PUT /v8/management/config | 替换整份配置。 |  | 校验失败为 400 `invalid_config`。解析通过但配置字节仍无效时可能是 422 `invalid_config`。 |
| PUT /v8/management/config/\*path | 替换所选节点。 |  | 尚不存在的中间映射键会被创建。成功后热重载已保存的文件。 |
| PUT /v8/management/config.yaml | 用 YAML 正文替换整份配置。 |  | 与 JSON 写入一样接受可选 `If-Match`。写失败：500 `write_failed`。 |

## 5. 常见错误与边界

下面三个字段属于 Home。写入若改变它们，返回 400，错误为 `read_only_field`，`field` 为对应路径：

- `credentials/concurrency/lifecycle-config-revision`
- `credentials/concurrency/observation-barrier-revision`
- `plugins/auth-revision`

JSON 读取会从响应里去掉实时 ICE 服务器的 `username` 和 `credential`，并可能在 `api-keys` 视图中带上运行时 auth index。这些 index 在写回时被去掉，不会当作配置保存。YAML 读取返回的是规范化字节，不套用那次 JSON 删字段。无 `If-Match` 的写入会覆盖他人刚保存的内容。弱 ETag 或格式错误的标签不会匹配。

## 6. 相关功能

密钥与远程开关见 [管理端设置](/cn/operations/management-settings)。凭证文件见 [管理凭证](/cn/management/v8-credentials)。

## 7. 使用经验

暂无
