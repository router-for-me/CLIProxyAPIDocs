---
title: 冷却
feature_ids:
  - routing.cooldown.disable-cooling
  - routing.cooldown.save-cooldown-status
  - routing.cooldown.transient-error-cooldown-seconds
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: false
---

# 冷却

## 1. 这段解决什么问题

上游失败后，代理可以把凭证或模型暂时移出选择。这里控制是否调度这种冷却、冷却状态是否写入磁盘，以及临时上游错误冷却多久。

## 2. 适用条件与不做的事

这是全局冷却政策。凭证或提供商上出现 `disable-cooling` 时，以那个显式值为准，包括显式 false。本页不定义配额耗尽后的指数退避，也不切换项目或预览模型。Home 模式不在本进程调度本地冷却。

## 3. 怎么配置或怎么调用

```yaml
routing:
  cooldown:
    disable-cooling: false
    save-cooldown-status: false
    transient-error-cooldown-seconds: 0
```

## 4. 细项说明

「默认值」与台账 defaults 逐字相同。

| 字段 | 含义 | 默认值 | 约束 |
| --- | --- | --- | --- |
| routing.cooldown.disable-cooling | 为 true 时不调度凭证和模型冷却。 | false | 凭证或提供商的显式值覆盖它。Home 模式不调度本地冷却。 |
| routing.cooldown.save-cooldown-status | 是否把运行时冷却状态写到凭证旁边。 | false | true 时每个凭证旁边写一个 .cds 文件。false 时只留在内存。 |
| routing.cooldown.transient-error-cooldown-seconds | 临时上游错误的冷却秒数。 | 0 keeps the legacy default cooldown. | 适用于 408、500、502、503、504 和 520 到 526。0 使用旧的 60 秒。负数关闭这类冷却。存在正的 Retry-After 时使用该提示。 |

## 5. 常见错误与边界

把临时冷却秒数设为 0 不会关闭冷却，也不会被拒绝；它保持 60 秒。负数才会关闭这类冷却。`disable-cooling: false` 是有效值，不能用来表示“省略”。

## 6. 相关功能

重试轮次见 [路由策略](/cn/routing/strategy)。旧的项目和预览模型开关见 [配额兼容开关](/cn/routing/quota-exceeded)。

## 7. 使用经验

- [用管理接口暂停凭证](/cn/experience/management#exp-management-disable-credential)
- [用管理路由清除冷却](/cn/experience/management#exp-management-reset-cooldown)
- [429 后按恢复时间跳过该模型](/cn/experience/routing#exp-routing-cooldown-until-reset)
- [关闭冷却以保持凭证可选](/cn/experience/routing#exp-routing-disable-cooling)
- [429 重试用现有重试和冷却](/cn/experience/routing#exp-routing-tune-retry-and-cooling)
