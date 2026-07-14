---
tags: [data-engineering, semantics]
aliases: [语义层, Semantic Layer, 指标层, Metrics Layer]
updated: 2026-07-14
---

# 语义层（Semantic Layer）

语义层是架在物理表和数据消费者之间的**统一业务定义层**：把"收入怎么算、活跃用户怎么数"这类口径集中定义一次，BI 报表、取数、AI 问答都从同一份定义出发，消灭"两个报表数字对不上"的经典问题。代表实现：dbt Semantic Layer、Cube、Looker 的 LookML。

一个语义层通常定义：**实体**（分析对象）、**维度**（切分视角）、**度量/指标**（聚合口径），以及指标之间的派生关系。这和[维度建模](dimensional-modeling.md)一脉相承，但把定义从"表结构"提升到了"业务概念"层面。

## 与本体的关系

语义层解决的正是[本体](ontology.md)要解决的核心问题——**共享的概念定义**——只是表达力更弱：没有类层次推理、没有开放世界语义，换来的是贴近 SQL、BI 工具即插即用。可以把它看作面向分析场景的轻量本体；当需要跨系统对齐、机器推理时，才升级到 [OWL](owl.md) + [知识图谱](knowledge-graph.md)的完整栈。业务词汇表这条平行线的标准化表达则是 [SKOS](skos.md)。

LLM 时代语义层重新升温：Text-to-SQL 要产出正确口径的查询，前提是有机器可读的指标定义——这也是 Agent 需要语义层的同一个理由（见[本体论与 AI Agent](../topics/ai/notes/agent-ontology.md)）。把"语义定义 + 动作 + 权限"整合到极致的商业形态是 [Palantir Ontology](palantir-ontology.md)。

## 深入阅读

- [数据工程学习路线 · 第 6 章](../topics/data-engineering/roadmap.md)（本站长文）
