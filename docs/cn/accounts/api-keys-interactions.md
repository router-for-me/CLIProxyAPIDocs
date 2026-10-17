---
title: Vertex Interactions
feature_ids:
  - api-keys.vertex.interactions
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# Vertex Interactions

## 1. 这段解决什么问题

让一把 Vertex API 密钥使用原生 Vertex Interactions API。

## 2. 适用条件与不做的事

只这一条。Gemini 的 interactions 密钥组是另一套密钥，不由这个布尔值开关。

## 3. 怎么配置或怎么调用

```yaml
api-keys:
  vertex:
    - name: vertex-1
      interactions: true
      keys:
        - api-key: "YOUR_API_KEY"
```

服务账号 JSON 要启用时，在文件根上写 `interactions: true`。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| api-keys.vertex.interactions | 是否让这把 Vertex 密钥走原生 Interactions API。 | nil | 省略或 false 不启用。true 让这把 Vertex 密钥走原生 Vertex Interactions API。服务账号文件则在根上写 interactions: true。 |

## 5. 常见错误与边界

省略按未启用处理。它不会改变普通 Gemini generateContent 密钥。

## 6. 相关功能

Interactions 密钥见 [上游 API 密钥](/cn/accounts/api-keys-api) 中的 interactions 条目。

## 7. 使用经验

暂无
