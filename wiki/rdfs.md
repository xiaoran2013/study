---
tags: [ai, ontology, w3c]
aliases: [RDF Schema]
updated: 2026-07-13
---

# RDFS

**RDF Schema**，W3C 推荐标准（2004，随 RDF 1.1 更新于 2014）。在 [RDF](rdf.md) 之上定义最基本的"词汇表"：有哪些类、哪些属性、它们的层次关系，是[语义网标准栈](semantic-web-stack.md)里最轻量的词汇层。

## 核心构件

- `rdfs:Class` / `rdf:type`: 声明类、声明实例属于某类。
- `rdfs:subClassOf`: 类层次（"狗 ⊑ 哺乳动物"），推理可自动传递。
- `rdfs:subPropertyOf`: 属性层次（"母亲是 ⊑ 父母是"）。
- `rdfs:domain` / `rdfs:range`: 属性的定义域和值域。
- `rdfs:label` / `rdfs:comment`: 人类可读的名字和注释。

## 最大的坑

domain/range 是**推断规则不是校验约束**——你说"石头出生于北京"，RDFS 不报错，而是推断出"石头是人"。想要"数据不合规就报错"，用 [SHACL](shacl.md)。

## 适用与局限

只需要"类目 + 层次 + 属性归属"的轻量场景够用，绝大多数 Web 词汇表（FOAF、Dublin Core）只到 RDFS 级别。表达不了基数、类不相交、逆关系、传递性——那些是 [OWL](owl.md) 的活。

## 深入阅读

- [本体标准全景 · RDFS 一节](../topics/ai/notes/ontology-standards.md)
- 规范: https://www.w3.org/TR/rdf-schema/
