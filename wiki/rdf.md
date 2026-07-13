---
tags: [ai, ontology, w3c]
aliases: [Resource Description Framework, 三元组]
updated: 2026-07-13
---

# RDF

**Resource Description Framework**，W3C 推荐标准（1999/2004 → 1.1 于 2014 → 1.2 引入 RDF-star），是[语义网标准栈](semantic-web-stack.md)的数据模型基座。

核心思想：把一切知识拆成**三元组（triple）**——主语–谓语–宾语，如 `<张三> <出生于> <北京>`。大量三元组自然连成一张有向图，这就是[知识图谱](knowledge-graph.md)的数据底座。

## 核心构件

- **IRI**: 全局唯一标识符，任何资源（实体、关系、概念）都用 IRI 命名，跨系统不撞名。
- **字面量（Literal）**: 字符串、数字、日期等值，可带语言标签（`"北京"@zh`）或数据类型（`^^xsd:date`）。
- **空白节点（Blank Node）**: 局部匿名节点，表示"存在某个东西"但不给全局名字。
- **命名图（Named Graph）**: 1.1 引入，给一组三元组打包命名，管理来源和上下文。

## 序列化格式

同一数据模型的不同写法：**Turtle**（人最易读，教学和手写首选）、**JSON-LD**（Web 开发者友好，schema.org 主推）、**N-Triples**（一行一条，批处理）、**RDF/XML**（历史格式）、**TriG / N-Quads**（带命名图）。

## 局限

RDF 只提供"陈述事实"的语法，不带语义——它不知道"出生于"意味着什么，也表达不了"人不能同时出生于两个城市"。语义靠上层的 [RDFS](rdfs.md) 和 [OWL](owl.md)；查询用 [SPARQL](sparql.md)。

## 深入阅读

- [本体标准全景 · RDF 一节](../topics/ai/notes/ontology-standards.md)
- 规范: https://www.w3.org/TR/rdf11-primer/
