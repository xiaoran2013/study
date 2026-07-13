---
tags: [ai, ontology, w3c]
aliases: [Simple Knowledge Organization System, 叙词表]
updated: 2026-07-13
---

# SKOS

**Simple Knowledge Organization System**，W3C 推荐标准（2009）。给叙词表、分类法、主题词表这类**松散概念体系**提供标准表示——它们的层次经不起严格逻辑推敲，硬翻译成 [OWL](owl.md) 的逻辑类是常见的建模错误。

## 核心构件

- `skos:Concept`: 概念（不是类——"经济学"是概念，没有"经济学的实例"）。
- `skos:broader` / `skos:narrower`: 宽窄关系，**不承诺** subClassOf 那种逻辑蕴含。
- `skos:related`: 相关关系。
- `skos:prefLabel` / `altLabel` / `hiddenLabel`: 首选词、同义词、隐藏词，天然多语言。
- `skos:exactMatch` / `closeMatch`: 跨词表映射。

## 判断标准：SKOS 还是 OWL？

如果层次经不起"每个 X 都必然是 Y"的推敲（"猫粮"宽于"宠物用品"只是导航关系不是逻辑关系），用 SKOS。典型场景：标签体系、内容分类、企业术语表、搜索同义词扩展。

相关 ISO 标准：ISO 25964（叙词表，2011/2013）与 SKOS 有官方映射。

## 深入阅读

- [本体标准全景 · SKOS 一节](../topics/ai/notes/ontology-standards.md)
- 规范: https://www.w3.org/TR/skos-primer/
