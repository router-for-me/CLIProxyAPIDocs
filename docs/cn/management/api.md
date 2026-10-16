---
title: 管理 API
feature_ids:
  - management.v0.deprecated
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 管理 API

## 1. 这段解决什么问题

说明 `/v0/management` 已停止维护。新的调用不要再以这组接口为准。

## 2. 适用条件与不做的事

本页不登记各条旧路由，也不给出调用步骤。现行管理接口是 [管理 API v8](/cn/management/apiv8)。密钥和远程开关仍见 [管理端设置](/cn/operations/management-settings)，那些设置同时作用于仍存在的进程行为，但不是 v0 的使用说明。

## 3. 怎么配置或怎么调用

没有现行调用方式。请改用 `/v8/management`，从 [管理 API v8](/cn/management/apiv8) 进入。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| management.v0.deprecated | `/v0/management` 已停止维护，不按路由编写说明。 |  | 归属页只保留弃用说明。 |

## 5. 常见错误与边界

Home 模式，或管理密钥、`MANAGEMENT_PASSWORD` 和本地密码都未设置时，该前缀返回 404。不要把旧客户端曾经得到的响应写成现行契约。

## 6. 相关功能

现行配置与运维路由见 [管理 API v8](/cn/management/apiv8)。

## 7. 使用经验

暂无
