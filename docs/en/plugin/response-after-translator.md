---
title: After-translation response cleanup
feature_ids: []
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: true
translation_pending: false
---

# After-translation response cleanup

This slot no longer has its own interface. Both before and after translation implement the same `ResponseNormalizer.NormalizeResponse`. See [Response normalization](/plugin/response-normalizer).

The registration switch is still `response_after_translator`. The matching ABI method name is `response.normalize_after`.
