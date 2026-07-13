---
tags: [ai, ontology, w3c]
aliases: [语义网标准栈, Semantic Web Stack]
updated: 2026-07-13
---

# 语义网标准栈（Semantic Web Stack）

W3C 的语义网标准栈是理解[本体](ontology.md)相关标准之间关系的最好框架。各标准不是竞争关系，而是同一栈里**不同层的分工**，自下而上：

```
规则层     SWRL / RIF
校验层     SHACL / ShEx
查询层     SPARQL
本体层     OWL 2          ← 重语义、可推理
概念体系层  SKOS           ← 轻语义、词表
词汇层     RDFS           ← 最基础的类/属性
数据模型层  RDF（三元组）
序列化     Turtle / JSON-LD / RDF/XML / N-Triples
标识层     IRI / Unicode
```

一句话分工：[RDF](rdf.md) 说"怎么陈述事实"，[RDFS](rdfs.md) 说"怎么定义基本词汇"，[OWL](owl.md) 说"怎么定义严格概念和逻辑约束"，[SKOS](skos.md) 说"怎么组织松散的概念词表"，[SPARQL](sparql.md) 说"怎么查"，[SHACL](shacl.md) 说"怎么校验数据合规"。

2026 年[知识图谱](knowledge-graph.md)项目的典型组合：RDF + OWL 2（常取 RL profile）+ SKOS + SHACL + SPARQL + JSON-LD，需要行业互操作时再对齐一个[顶层本体](top-level-ontology.md)。

## 深入阅读

- [本体标准全景](../topics/ai/notes/ontology-standards.md)（本站长文，含 ISO 体系和事实标准）
