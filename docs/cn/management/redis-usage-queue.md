---
outline: 'deep'
---

# Redis 用量队列（RESP）

CLIProxyAPI 会在与 HTTP API 相同的 TCP 端口（默认 `8317`）上提供一个最小化的 Redis RESP 接口，用于以 JSON 的形式拉取**最近的单次请求用量记录**，便于外部采集程序消费统计信息而无需解析日志。

## 可用性

- RESP 接口仅在**启用 Management**（与 `/v0/management` 相同的启用条件）时可用；若 Management 未启用，RESP 连接会被立即关闭。
- 与 HTTP/HTTPS 复用同一个监听器；如果服务端启用了 TLS，RESP 也使用相同的 TLS 监听器。

## 认证

- 使用 **Management key** 进行认证（与 `/v0/management` 相同的密钥）。
- 支持形式：
  - `AUTH <password>`
  - `AUTH <username> <password>`（会忽略 username，仅用于兼容）
- 与 Management API 共享 IP-ban 策略：**连续 5 次失败**会触发临时封禁。

## 启用用量发布

队列只有在启用用量发布时才会写入记录：

- 配置文件：设置 `usage-statistics-enabled: true` 并重启/热加载
- 或通过 Management API：`PUT /usage-statistics-enabled`，请求体 `{ "value": true }`

## 支持的命令

这**不是**完整的 Redis 服务，仅实现了以下命令：

- `AUTH`
- `LPOP <key> [count]`
- `RPOP <key> [count]`

说明：

- `<key>` 目前会被忽略；建议统一使用 `queue` 便于阅读。
- 不带 `count` 时，`LPOP`/`RPOP` 返回单个 Bulk String（JSON），队列为空时返回 `nil`。
- 带 `count` 时返回 Bulk String 数组；队列为空时返回空数组。
- 数据在内存中的保留时间由 `redis-usage-queue-retention-seconds` 控制（单位秒，默认 `60`，最大 `3600`），如需尽量不丢数据请高频轮询。

## 示例

使用 `redis-cli`：

```bash
# 弹出一条（直接输出 JSON）
redis-cli -h 127.0.0.1 -p 8317 -a "<MANAGEMENT_KEY>" --no-auth-warning --raw LPOP queue

# 最多弹出 50 条
redis-cli -h 127.0.0.1 -p 8317 -a "<MANAGEMENT_KEY>" --no-auth-warning --raw RPOP queue 50
```

## Payload 结构

每条队列元素为一个 JSON 对象，字段如下：

- `timestamp`（RFC 3339 时间字符串）
- `latency_ms`（整数）
- `source`（字符串）
- `auth_index`（字符串）
- `tokens`：
  - `input_tokens`（整数）
  - `output_tokens`（整数）
  - `reasoning_tokens`（整数）
  - `cached_tokens`（整数）
  - `total_tokens`（整数）
- `failed`（布尔值）
- `provider`（字符串）
- `model`（字符串）
- `endpoint`（字符串，例如 `POST /v1/chat/completions`）
- `auth_type`（字符串）
- `api_key`（字符串）
- `request_id`（字符串）

示例：

```json
{
  "timestamp": "2026-04-25T00:00:00Z",
  "latency_ms": 1500,
  "source": "user@example.com",
  "auth_index": "0",
  "tokens": {
    "input_tokens": 10,
    "output_tokens": 20,
    "reasoning_tokens": 0,
    "cached_tokens": 0,
    "total_tokens": 30
  },
  "failed": false,
  "provider": "openai",
  "model": "gpt-5.4",
  "endpoint": "POST /v1/chat/completions",
  "auth_type": "apikey",
  "api_key": "test-key",
  "request_id": "ctx-request-id"
}
```
