---
tags: [ai, ontology, w3c]
aliases: [Shapes Constraint Language]
updated: 2026-07-13
---

# SHACL

**Shapes Constraint Language**，W3C 推荐标准（2017）。[RDF](rdf.md) 数据的**校验标准**：定义"形状（Shape）"约束数据长什么样，校验器输出合规报告。

## 为什么需要它

[OWL](owl.md) 是开放世界的逻辑推理，天生做不了"每条产品记录必须有且仅有一个价格字段"这种封闭世界的数据质量校验（缺字段只会被当成"未知"）。SHACL 补上这块。**工程分工的标准答案：OWL 管推理，SHACL 管校验**，现代[知识图谱](knowledge-graph.md)项目两者都用。

## 核心构件

- `sh:NodeShape` + `sh:targetClass`: 约束某类节点。
- `sh:property` + `sh:path`: 约束某属性。
- `sh:minCount` / `sh:maxCount`: 基数（必填/唯一）。
- `sh:datatype` / `sh:class` / `sh:pattern` / `sh:in`: 值类型、正则、枚举。
- `sh:sparql`: 嵌入 [SPARQL](sparql.md) 写复杂约束。
- 严重级别: Violation / Warning / Info。

## 替代方案

**ShEx**（Shape Expressions）：W3C 社区规范（非推荐标准），语法更紧凑，Wikidata 用它。工业界主流是 SHACL。

## 深入阅读

- [本体标准全景 · SHACL 一节](../topics/ai/notes/ontology-standards.md)
- 规范: https://www.w3.org/TR/shacl/
