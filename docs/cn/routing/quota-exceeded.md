---
title: 配额兼容开关
feature_ids:
  - quota-exceeded.switch-preview-model.value
  - quota-exceeded.switch-project.value
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 配额兼容开关

## 1. 这段解决什么问题

旧配置用两个布尔值表示配额耗尽后是否切换项目或预览模型。当前钉住的代码仍保存这两个值，但选择器和执行器都不读取它们来做切换。

## 2. 适用条件与不做的事

它们没有新的 v8 对应字段，活动的 v8 示例模板也不写它们。旧文件和 v8 迁移会保留已有值。Antigravity credits 已移到 `oauth.providers.antigravity.antigravity-credits`，不属于本页。本页不改变冷却时间或重试轮次。

## 3. 怎么配置或怎么调用

```yaml
quota-exceeded:
  switch-project: false
  switch-preview-model: false
```

旧管理路由仍然登记：

- `GET`、`PUT`、`PATCH` `/v0/management/quota-exceeded/switch-project`
- `GET`、`PUT`、`PATCH` `/v0/management/quota-exceeded/switch-preview-model`

`GET` 返回对应布尔字段。`PUT` 和 `PATCH` 读取 JSON 对象里的 `value` 布尔值。

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| quota-exceeded.switch-preview-model | 保存是否标记为在配额耗尽时切换预览模型。 | false | 选择器和执行器不读取该值，因此它不会改变项目或模型。旧文件与 v8 迁移保留它。活动 v8 示例模板省略它。 |
| quota-exceeded.switch-project | 保存是否标记为在配额耗尽时切换项目。 | false | 选择器和执行器不读取该值，因此它不会改变项目或模型。旧文件与 v8 迁移保留它。活动 v8 示例模板省略它。 |

## 5. 常见错误与边界

旧管理接口的 `PUT` 或 `PATCH` 如果没有布尔 `value`，返回 400，正文为 `invalid body`。只把这两个键写成 true 不会让当前选择器切换项目或预览模型。

## 6. 相关功能

实际冷却见 [冷却](/cn/routing/cooldown)。Antigravity credits 不在本页。

## 7. 使用经验

暂无
