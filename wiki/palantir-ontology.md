---
tags: [ai, ontology, enterprise]
aliases: [Palantir Ontology, Foundry Ontology, PLTR]
updated: 2026-07-14
---

# Palantir Ontology

Palantir Foundry 平台的核心层, 目前企业界把"[本体](ontology.md)驱动运营"做得最系统化的**私有实现**——不基于 RDF/[OWL](owl.md) 标准栈, 与 W3C [语义网标准栈](semantic-web-stack.md)是同一思想的两条路线。

## 核心主张: 建模决策而非数据

传统[语义层](semantic-layer.md)回答"数据是什么意思", Palantir Ontology 还回答"能做什么动作、谁有权做、写回哪里"。元素分两类:

- **语义元素(名词)**: Object Type(业务实体类)、Property、Link Type(有类型关系)、Interface(形状抽象);
- **动能元素(动词)**: Action Type(受治理、可审计、可写回源系统的结构化写操作, 每个都是"权限+条件+审计"的契约)、Function(代码业务逻辑)。

整体构成组织的"数字孪生"。后端为微服务架构(OMS 元数据、Funnel 写入编排、对象数据库、OSS 读服务), 应用通过 OSDK 把本体当类型安全的后端使用。

## 对 Agent 的意义

AIP 把 LLM 架在本体之上: Agent 不直接碰数据库表, 只能在授权边界内通过本体暴露的对象/关系/Function/Action 操作; 权限模型对人和 Agent 一视同仁; 写操作可暂存为场景走审批。这是"[知识图谱](knowledge-graph.md)+本体做 Agent 语义地基"的完整生产级范本, 详见[本体论与 AI Agent](../topics/ai/notes/agent-ontology.md)。

## 深入阅读

- [Palantir Ontology: 技术架构与企业实践](../topics/ai/notes/palantir-ontology.md)(本站长文, 含 Airbus/NHS/医疗/供应链案例与自建借鉴点)
