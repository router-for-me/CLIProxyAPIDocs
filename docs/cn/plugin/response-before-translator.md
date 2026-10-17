---
title: 响应转换前规整
feature_ids: []
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: true
---

# 响应转换前规整

这一槽位不再单独分配接口。转换前与转换后都实现同一个 `ResponseNormalizer.NormalizeResponse`，说明见 [响应规整](/cn/plugin/response-normalizer)。

登记开关仍是 `response_before_translator`。对应 ABI 方法名是 `response.normalize_before`。
