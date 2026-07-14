---
tags: [ai, ontology]
aliases: [本体, 本体论, Ontology]
updated: 2026-07-13
---

# 本体（Ontology）

本体是**形式化的知识表示方法**：定义一个领域里有哪些概念、概念之间有什么关系、遵循什么规则，让人和机器在同一套语义下推理。它源自哲学（存在论），在数据/知识工程领域被借用后成为[知识图谱](knowledge-graph.md)的语义骨架。

一个本体通常包含：**类**（概念，如"交通工具"）、**类层次**（"汽车是交通工具的子类"）、**属性**（类之间的关系和字面值特征）、**约束**（基数、不相交等）、**实例**。定义好"汽车 ⊑ 交通工具"后，推理机能自动推导汽车具备交通工具的属性，而不需要硬编码规则。

## 标准体系

本体不是想怎么建就怎么建，工程上有一套分层标准（见[语义网标准栈](semantic-web-stack.md)）：[RDF](rdf.md) 陈述事实、[RDFS](rdfs.md) 定义基本词汇、[OWL](owl.md) 定义严格概念并支持推理、[SKOS](skos.md) 组织松散词表、[SPARQL](sparql.md) 查询、[SHACL](shacl.md) 校验数据。跨领域互操作时对齐一个[顶层本体](top-level-ontology.md)。

## 为什么 Agent 时代重新重要

Agent 大量失败的地方恰恰是"理解业务语义"这一层（什么算一个已完成的订单），而不是语言生成。本体作为语义层给数据赋予含义、支持自动推理、充当多 Agent 协作的公共契约。详见长文[本体论与 AI Agent](../topics/ai/notes/agent-ontology.md)；生产级范本见 [Palantir Ontology](palantir-ontology.md)。

## 深入阅读

- [本体标准全景](../topics/ai/notes/ontology-standards.md)（本站长文，各标准详解）
- [本体开发 101](../topics/ai/notes/ontology-101.html)（怎么动手建一个本体）
