---
title: Приведение ответа до преобразования
feature_ids: []
pinned_commit: 911f49cbd49f4fe2516979754a7488a3fd14fe64
stub: true
translation_pending: false
---

# Приведение ответа до преобразования

У этого слота больше нет отдельного интерфейса. И до, и после преобразования реализуется один и тот же `ResponseNormalizer.NormalizeResponse`. См. [Приведение ответа](/ru/plugin/response-normalizer).

Переключатель регистрации по-прежнему `response_before_translator`. Соответствующее имя метода ABI — `response.normalize_before`.
