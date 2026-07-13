---
tags: [ai, ontology, w3c]
aliases: [Web Ontology Language, OWL 2]
updated: 2026-07-13
---

# OWL

**Web Ontology Language**，W3C 推荐标准（2004 → OWL 2 于 2009/2012），[本体](ontology.md)语言的核心标准，理论基础是**描述逻辑（Description Logic）**。

与 [RDFS](rdfs.md) 的本质区别：你不只是声明"有个类叫父亲"，而是**定义**"父亲 ≡ 男性 ⊓ 至少有一个孩子"。推理机据此自动分类实例、发现隐含事实、检查逻辑矛盾。

## 核心构件

- **类表达式**: 交、并、补、枚举、存在/全称限定、基数限制。
- **属性特征**: 传递（祖先）、对称（配偶）、函数性（每人恰好一个生父）、逆属性、属性链（"父母的兄弟 ⊑ 叔伯"）。
- **公理**: 类等价、类不相交、个体相同/不同（`sameAs`）、键。

## 两个语义与三个 Profile

**OWL DL**（可判定，工程默认）vs **OWL Full**（与 RDF 完全兼容但不可判定，理论意义为主）。OWL 2 另裁剪三个性能子集：**EL**（超大类层次，如 30 多万类的 SNOMED CT）、**QL**（本体查数据库/OBDA，可改写成 SQL）、**RL**（规则引擎实现，三元组库普遍支持）。

## 两大坑

1. **开放世界假设（OWA）**: 没陈述的事实是"未知"不是"假"；两个不同 IRI 可能指同一个体。与数据库直觉相反。
2. **OWL 做推理不做校验**: "必填字段检查"要用 [SHACL](shacl.md)。工程分工：OWL 管"世界上什么是真的"，SHACL 管"我的数据合不合格"。

工具：Protégé（编辑）、HermiT/ELK/Pellet（推理）、owlready2（编程）。

## 深入阅读

- [本体标准全景 · OWL 一节](../topics/ai/notes/ontology-standards.md)
- 规范: https://www.w3.org/TR/owl2-primer/
