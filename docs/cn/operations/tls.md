---
title: TLS
feature_ids:
  - server.tls.cert
  - server.tls.enable
  - server.tls.key
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# TLS

## 1. 这段解决什么问题

决定 API 服务器是否以 HTTPS 监听，以及使用哪一份证书和私钥。

## 2. 适用条件与不做的事

只作用于本进程的监听。它不配置 Home 控制面的客户端 mTLS，也不代替上游 `base-url` 的 TLS。绑定地址和端口见 [监听与进程](/cn/operations/server)。

## 3. 怎么配置或怎么调用

```yaml
server:
  tls:
    enable: false
    cert: ""
    key: ""
```

启用时把 `cert` 和 `key` 写成证书文件与私钥文件的路径。不要把私钥内容贴进配置说明或日志。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| server.tls.cert | TLS 证书文件路径。 | empty string | `enable` 为 true 时不能为空，且必须能与私钥组成可用的证书对。 |
| server.tls.enable | 是否以 HTTPS 监听。 | false | false 时按普通 HTTP 启动。true 时在已绑定的地址上使用该证书对，并尝试启用 HTTP/2 与 HTTP/1.1。 |
| server.tls.key | TLS 私钥文件路径。 | empty string | `enable` 为 true 时不能为空。 |

## 5. 常见错误与边界

`enable` 为 true 但证书或私钥路径为空时，启动失败，错误为 `tls.cert or tls.key is empty`。路径有值但无法加载证书对时，启动同样失败。只填其中一个路径不够。

## 6. 相关功能

监听地址见 [监听与进程](/cn/operations/server)。发现记录里的 TLS 标记见 [局域网发现](/cn/operations/discovery)。

## 7. 使用经验

- [启用 TLS 时必须提供证书](/cn/experience/operations#exp-operations-tls-needs-cert)
