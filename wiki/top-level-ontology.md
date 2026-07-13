---
tags: [ai, ontology, iso]
aliases: [顶层本体, Top-Level Ontology, TLO, BFO, DOLCE, ISO 21838]
updated: 2026-07-13
---

# 顶层本体（Top-Level Ontology）

顶层本体是"[本体](ontology.md)的本体"：与具体领域无关的最上层范畴框架（什么是物体、过程、性质、时间……）。建领域本体时对齐一个顶层本体，"手术该建模成过程还是物体"这类哲学问题就有了标准答案，不同机构的本体也因此可互操作。

## ISO/IEC 21838 系列

顶层本体的国际标准：

- **Part 1**（2021）: 定义什么算一个合格的顶层本体。
- **Part 2: BFO**（Basic Formal Ontology，2021）: 生物医学领域事实上的顶层本体，核心区分 **continuant**（持续存在的东西：物体、性质）和 **occurrent**（展开发生的东西：过程、事件）。OBO Foundry 数百个生物医学本体都挂在它下面。
- **Part 3: DOLCE**: 源自语言学/认知科学传统，强调"描述性"（建模人类常识范畴而非客观实在）。
- **Part 4: TUpper**: 基于 SUMO 派生。

## 怎么选

生物医学几乎默认 BFO；其他领域三选一，看社区生态和风格偏好。需要超出 [OWL](owl.md) 的完整一阶逻辑表达力时，还有 Common Logic（ISO/IEC 24707）。

## 深入阅读

- [本体标准全景 · ISO 体系一节](../topics/ai/notes/ontology-standards.md)
- BFO 官网: https://basic-formal-ontology.org/
