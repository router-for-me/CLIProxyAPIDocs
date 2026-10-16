---
title: 上游额外请求头
feature_ids:
  - api-keys.claude.headers
  - api-keys.codex.headers
  - api-keys.gemini.headers
  - api-keys.interactions.headers
  - api-keys.meta.headers
  - api-keys.openai-compatibility.headers
  - api-keys.vertex.headers
  - api-keys.xai.headers
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 上游额外请求头

## 1. 这段解决什么问题

给某一上游组或密钥加上额外 HTTP 头。

## 2. 适用条件与不做的事

这些头发给上游，不是本代理要求客户端提供的头。OpenAI 兼容提供商的头写在提供商上，不写在单把密钥上。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  gemini:
    - name: gemini-1
      headers:
        X-Custom-Header: "custom-value"
      keys:
        - api-key: "YOUR_API_KEY"
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.claude.headers | 发给该上游的额外 HTTP 头。 | nil | 映射里的头会加到该上游请求。省略时不添加。 |
| api-keys.codex.headers | 发给该上游的额外 HTTP 头。 | nil | 映射里的头会加到该上游请求。省略时不添加。 |
| api-keys.gemini.headers | 发给该上游的额外 HTTP 头。 | nil | 映射里的头会加到该上游请求。省略时不添加。 |
| api-keys.interactions.headers | 发给该上游的额外 HTTP 头。 | nil | 映射里的头会加到该上游请求。省略时不添加。 |
| api-keys.meta.headers | 发给该上游的额外 HTTP 头。 | nil | 映射里的头会加到该上游请求。省略时不添加。 |
| api-keys.openai-compatibility.headers | 发给该上游的额外 HTTP 头。 | nil | 映射里的头会加到该上游请求。省略时不添加。 |
| api-keys.vertex.headers | 发给该上游的额外 HTTP 头。 | nil | 映射里的头会加到该上游请求。省略时不添加。 |
| api-keys.xai.headers | 发给该上游的额外 HTTP 头。 | nil | 映射里的头会加到该上游请求。省略时不添加。 |

## 5. 常见错误与边界

头的值没有单独的格式拒绝。密钥上显式给出的映射会整份替换组上的映射。

## 6. 相关功能

Claude 指纹基线里的头见 [Claude 上游行为](/cn/accounts/upstream)，那是另一组键。

## 7. 使用经验

暂无
