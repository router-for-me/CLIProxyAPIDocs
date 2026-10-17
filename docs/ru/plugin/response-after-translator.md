---
title: Приведение ответа после преобразования
feature_ids: []
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: true
translation_pending: false
---

# Приведение ответа после преобразования

У этого слота больше нет отдельного интерфейса. И до, и после преобразования реализуется один и тот же `ResponseNormalizer.NormalizeResponse`. См. [Приведение ответа](/ru/plugin/response-normalizer).

Переключатель регистрации по-прежнему `response_after_translator`. Соответствующее имя метода ABI — `response.normalize_after`.
