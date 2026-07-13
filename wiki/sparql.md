---
tags: [ai, ontology, w3c]
aliases: [SPARQL Protocol and RDF Query Language]
updated: 2026-07-13
---

# SPARQL

**SPARQL Protocol and RDF Query Language**，W3C 推荐标准（1.0 于 2008，1.1 于 2013）。[RDF](rdf.md) 图的标准查询语言，地位相当于关系数据库的 SQL。

## 核心构件

- **基本图模式匹配**: 写带变量的三元组模式去匹配图。
- `FILTER` / `OPTIONAL` / `UNION` / 聚合 / 子查询。
- **属性路径**: `foaf:knows+` 一跳到多跳的传递查询，图查询相对 SQL 的杀手锏。
- 四种查询形式: `SELECT` / `CONSTRUCT`（查询结果生成新三元组）/ `ASK` / `DESCRIBE`。
- **SPARQL Update**: 增删改。
- **联邦查询**: `SERVICE` 关键字一条查询同时问本地库和 Wikidata。

## 配套协议

SPARQL 还规定了 HTTP 协议层（endpoint 怎么收查询、返回 JSON/XML），所以 Wikidata、DBpedia 等公开[知识图谱](knowledge-graph.md)都提供标准 endpoint。

## 实践注意

SPARQL 查的是"图里有什么"，要查到 [OWL](owl.md) 推理出的隐含事实需配合推理机（entailment regime），各三元组库支持程度不一。

## 深入阅读

- [本体标准全景 · SPARQL 一节](../topics/ai/notes/ontology-standards.md)
- 规范: https://www.w3.org/TR/sparql11-overview/
