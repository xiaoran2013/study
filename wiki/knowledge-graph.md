---
tags: [ai, ontology]
aliases: [知识图谱, Knowledge Graph, KG]
updated: 2026-07-13
---

# 知识图谱（Knowledge Graph）

知识图谱是**以图结构组织的事实库**：实体是节点，关系是边。数据底座通常是 [RDF](rdf.md) 三元组，查询用 [SPARQL](sparql.md)。公开的代表有 Wikidata、DBpedia；企业内则是数据目录、客户 360、风控图谱等。

## 与本体的关系

知识图谱存"实体和关系"，[本体](ontology.md)定义这些实体和关系**意味着什么**、遵循什么约束——本体是图谱的 schema 层/语义骨架。"本体做骨架、事实做填充、原文做溯源"是 Agent 长期记忆系统（如 GraphRAG 系）的代表性三层设计。

## 标准全家桶

2026 年知识图谱项目的典型组合（详见[语义网标准栈](semantic-web-stack.md)）：RDF 做数据模型 + [OWL](owl.md)（常取 RL profile）做领域语义 + [SKOS](skos.md) 做词表 + [SHACL](shacl.md) 做数据校验 + SPARQL 做查询 + JSON-LD 做对外交换。

## 在 AI Agent 里的价值

生产环境对比数据显示，结构化知识图谱记忆相比纯向量检索，多跳任务准确率提升 36%-46%，幻觉率降低 40% 以上。详见[本体论与 AI Agent](../topics/ai/notes/agent-ontology.md)。

## 深入阅读

- [本体标准全景](../topics/ai/notes/ontology-standards.md)
