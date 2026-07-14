---
tags: [data-engineering, architecture]
aliases: [数据编织, Data Fabric]
updated: 2026-07-14
---

# 数据编织（Data Fabric）

Data Fabric 是一种数据架构范式，核心主张：**用主动元数据和知识图谱自动化数据的集成、发现与治理**。数据留在原地（不强求物理集中），由一层持续更新的元数据图谱描述"有哪些数据、什么含义、谁在用、怎么连"，再基于这层图谱自动推荐集成路径、编排管道。

它常与 Data Mesh 对举：Mesh 是**组织**方案（领域团队各自对数据负责，联邦治理），Fabric 是**技术**方案（中心化的智能元数据层）；两者不互斥，实践中常混合。

## 与本体的关系

Data Fabric 是[本体](ontology.md)回流数据工程主线的最明确信号——它的定义显式依赖[知识图谱](knowledge-graph.md)作为元数据底座：数据资产、业务概念、血缘关系都建成图，语义对齐靠本体完成。主流数据目录（DataHub 的 entity-aspect 模型）底层已经是图结构，Fabric 把这个思路推到自动化集成层面。相关标准：[RDF](rdf.md)/[OWL](owl.md) 表达元数据语义，[SPARQL](sparql.md) 查询，[SHACL](shacl.md) 校验。

## 深入阅读

- [数据工程学习路线 · 第 7 章](../topics/data-engineering/roadmap.md)（本站长文）
