# 本体（Ontology）标准全景

本体工程不是"想怎么建就怎么建"，几十年积累下来已经形成了一套分层的标准体系：底层是数据模型标准（怎么表示事实），中间是本体语言标准（怎么定义概念和约束），上面还有查询、校验、规则等配套标准，以及 ISO 体系和各领域的事实标准。这篇笔记把主要标准逐个讲清楚：它是什么、解决什么问题、核心构件、适用场景和局限。

配套阅读: [本体论与 AI Agent](topics/ai/notes/agent-ontology.md)（为什么 Agent 时代本体重要）、[本体开发 101](ontology-101.html)（怎么动手建一个本体）。

## 0. 一张分层图

W3C 的语义网标准栈（Semantic Web Stack）是理解这些标准关系的最好框架，自下而上：

```
┌─────────────────────────────────────────────┐
│  规则层     SWRL / RIF                       │
│  校验层     SHACL / ShEx                     │
│  查询层     SPARQL                           │
│  本体层     OWL 2          ← 重语义、可推理   │
│  概念体系层  SKOS           ← 轻语义、词表    │
│  词汇层     RDFS           ← 最基础的类/属性  │
│  数据模型层  RDF（三元组）                    │
│  序列化     Turtle / JSON-LD / RDF/XML / NT  │
│  标识层     IRI / Unicode                    │
└─────────────────────────────────────────────┘
```

一句话版本：**RDF 说"怎么陈述事实"，RDFS 说"怎么定义基本词汇"，OWL 说"怎么定义严格的概念和逻辑约束"，SKOS 说"怎么组织松散的概念词表"，SPARQL 说"怎么查"，SHACL 说"怎么校验数据合规"**。它们不是竞争关系，而是同一栈里不同层的分工。

## 1. RDF —— 数据模型基座

**Resource Description Framework**，W3C 推荐标准（RDF 1.0 于 1999/2004，RDF 1.1 于 2014，RDF 1.2 引入 RDF-star 支持"对陈述做陈述"）。

- **解决什么**: 用统一的图模型表示任何事实。一切知识被拆成**三元组（triple）**: 主语–谓语–宾语，如 `<张三> <出生于> <北京>`。大量三元组自然连成一张有向图，这就是知识图谱的数据底座。
- **核心构件**:
  - **IRI**: 全局唯一标识符，任何资源（实体、关系、概念）都用 IRI 命名，保证跨系统不撞名。
  - **字面量（Literal）**: 字符串、数字、日期等值，可带语言标签（`"北京"@zh`）或数据类型（`"1990-01-01"^^xsd:date`）。
  - **空白节点（Blank Node）**: 局部匿名节点，表示"存在某个东西"但不给全局名字。
  - **命名图（Named Graph）**: RDF 1.1 引入，给一组三元组打包命名，便于管理来源和上下文。
- **序列化格式**（同一数据模型的不同写法）: **Turtle**（人类最易读，教学和手写首选）、**JSON-LD**（对 Web 开发者最友好，schema.org 主推）、**N-Triples**（一行一条，适合大批量处理）、**RDF/XML**（最早的格式，现已少手写）、**TriG / N-Quads**（带命名图版本）。
- **局限**: RDF 本身只提供"陈述事实"的语法，不带任何语义——它不知道"出生于"意味着什么，也不能表达"人不可能同时出生于两个城市"。语义要靠上面的 RDFS/OWL。

## 2. RDFS —— 最轻量的词汇语言

**RDF Schema**，W3C 推荐标准（2004，随 RDF 1.1 更新于 2014）。

- **解决什么**: 在 RDF 之上定义最基本的"词汇表"——有哪些类、哪些属性、它们的层次关系。
- **核心构件**:
  - `rdfs:Class` / `rdf:type`: 声明类，声明实例属于某类。
  - `rdfs:subClassOf`: 类的层次，如"狗 ⊑ 哺乳动物"，推理机可自动传递（狗的实例自动是哺乳动物的实例）。
  - `rdfs:subPropertyOf`: 属性层次，如"母亲是 ⊑ 父母是"。
  - `rdfs:domain` / `rdfs:range`: 属性的定义域和值域，如"出生于"的 domain 是人、range 是地点。注意 RDFS 里这是**推断规则**而非校验约束——如果说"石头出生于北京"，RDFS 不报错，而是推断出"石头是人"。这是新手最常踩的坑。
  - `rdfs:label` / `rdfs:comment`: 人类可读的名字和注释。
- **适用**: 只需要"类目 + 层次 + 属性归属"的轻量场景。绝大多数 Web 词汇表（如 FOAF、Dublin Core）只用到 RDFS 级别的表达力。
- **局限**: 表达不了基数（一个人恰好有一个生日）、不相交（男性和女性不相交）、逆关系、传递性等，这些是 OWL 的活。

## 3. OWL 2 —— 本体语言的核心标准

**Web Ontology Language**，W3C 推荐标准（OWL 1 于 2004，OWL 2 于 2009，第二版 2012）。这是"本体标准"里最重要的一个，理论基础是**描述逻辑（Description Logic）**。

- **解决什么**: 用有形式语义、可机器推理的语言精确定义概念。你不只是说"有个类叫父亲"，而是**定义**"父亲 ≡ 男性 ⊓ 至少有一个孩子"，推理机能据此自动分类实例、发现隐含事实、检查逻辑矛盾。
- **核心构件**:
  - **类表达式**: 交（`intersectionOf`）、并（`unionOf`）、补（`complementOf`）、枚举（`oneOf`）、存在/全称限定（`someValuesFrom` / `allValuesFrom`）、基数限制（`minCardinality` 等）。
  - **属性特征**: 传递（祖先）、对称（配偶）、反自反、函数性（每人恰好一个生父）、逆属性（`hasParent` 与 `hasChild` 互逆）、属性链（"父母的兄弟"⊑"叔伯"）。
  - **公理**: 类等价、类不相交（`disjointWith`）、个体相同/不同（`sameAs` / `differentFrom`）、键（`hasKey`）。
- **两个语义**: **OWL DL**（描述逻辑子集，推理可判定，工具支持完善，实际工程默认用它）和 **OWL Full**（与 RDF 完全兼容但推理不可判定，基本只有理论意义）。
- **三个 Profile**（OWL 2 为不同性能需求裁剪的子集）:
  - **OWL 2 EL**: 面向超大规模类层次（如生物医学本体 SNOMED CT，30 多万个类），推理多项式时间。
  - **OWL 2 QL**: 面向"本体查数据库"场景（OBDA），查询可改写成标准 SQL。
  - **OWL 2 RL**: 面向规则引擎实现，可用产生式规则在三元组上直接跑，大型三元组库（如 GraphDB、Jena）普遍支持。
- **一个关键世界观**: OWL 采用**开放世界假设（OWA）**——没陈述的事实只是"未知"，不是"假"；也没有唯一名字假设——两个不同 IRI 可能指同一个体，除非显式声明不同。这和数据库/编程的封闭世界直觉相反，是 OWL 建模第二大坑（第一大坑是 domain/range 当校验用）。
- **常用工具**: Protégé（编辑器）、HermiT / ELK / Pellet（推理机）、OWL API / owlready2（编程库）。
- **局限**: 表达力强的代价是推理开销大、学习曲线陡；且它做的是逻辑推理不是数据校验——"必填字段检查"这类需求要用 SHACL。

## 4. SKOS —— 概念词表的标准

**Simple Knowledge Organization System**，W3C 推荐标准（2009）。

- **解决什么**: 图书馆学里积累了大量叙词表（thesaurus）、分类法（taxonomy）、主题词表，它们的"概念层次"是松散的（"宽于/窄于"），不适合硬翻译成 OWL 的严格逻辑类。SKOS 给这类**知识组织系统**提供了标准表示。
- **核心构件**:
  - `skos:Concept`: 概念（注意是"概念"不是"类"——"经济学"是一个概念，但没有"经济学的实例"）。
  - `skos:broader` / `skos:narrower`: 宽窄关系（不承诺是 subClassOf 那种逻辑蕴含）。
  - `skos:related`: 相关关系。
  - `skos:prefLabel` / `skos:altLabel` / `skos:hiddenLabel`: 首选词、同义词、隐藏词（拼写错误等），天然支持多语言。
  - `skos:exactMatch` / `skos:closeMatch` 等: 跨词表映射。
  - `skos:ConceptScheme`: 词表本身的容器。
- **适用**: 标签体系、内容分类、企业术语表、搜索同义词扩展。**判断标准**: 如果你的"层次"经不起"每个 X 都必然是 Y"的推敲（如"猫粮"宽于"宠物用品"是导航关系不是逻辑关系），用 SKOS 而不是 OWL。
- **相关 ISO 标准**: ISO 25964（叙词表标准，两部分，2011/2013）与 SKOS 互相对齐，有官方映射。

## 5. SPARQL —— 查询标准

**SPARQL Protocol and RDF Query Language**，W3C 推荐标准（1.0 于 2008，1.1 于 2013；1.2 随 RDF 1.2 演进）。

- **解决什么**: RDF 图的标准查询语言，地位相当于关系数据库的 SQL。
- **核心构件**: 基本图模式匹配（写一个带变量的三元组模式去匹配图）、`FILTER` 过滤、`OPTIONAL` 可选匹配、`UNION`、聚合（`GROUP BY` / `COUNT`）、子查询、**属性路径**（`foaf:knows+` 一跳到多跳的传递查询，这是图查询相对 SQL 的杀手锏）、四种查询形式（`SELECT` / `CONSTRUCT` / `ASK` / `DESCRIBE`）、`SPARQL Update`（增删改）、**联邦查询**（`SERVICE` 关键字跨端点查询，比如一条查询同时问本地库和 Wikidata）。
- **配套协议**: SPARQL 还规定了 HTTP 协议层（endpoint 怎么接收查询、返回 JSON/XML 结果），所以公开知识库（Wikidata、DBpedia）都能提供标准 endpoint。
- **实践注意**: SPARQL 查的是"图里有什么"，配合推理机（entailment regime）才能查到 OWL 推出来的隐含事实，不同三元组库对此支持程度不一。

## 6. SHACL —— 数据校验标准

**Shapes Constraint Language**，W3C 推荐标准（2017）。

- **解决什么**: OWL 是开放世界的逻辑推理，天生做不了"每条产品记录必须有且仅有一个价格字段"这种**封闭世界的数据质量校验**。SHACL 补上这块：定义"形状（Shape）"来约束数据长什么样，校验器输出合规报告。
- **核心构件**: `sh:NodeShape`（约束某类节点）、`sh:property` + `sh:path`（约束某属性）、`sh:minCount` / `sh:maxCount`（基数，即"必填/唯一"）、`sh:datatype` / `sh:class`（值类型）、`sh:pattern`（正则）、`sh:in`（枚举）、`sh:sparql`（直接嵌 SPARQL 写复杂约束）、严重级别（Violation / Warning / Info）。
- **与 OWL 的分工**（工程上的标准答案）: **OWL 负责"世界上什么是真的"（推理），SHACL 负责"我的数据合不合格"（校验）**。现代知识图谱项目通常两者都用: OWL 定义领域语义，SHACL 把关数据入库质量。
- **替代方案**: **ShEx**（Shape Expressions），W3C 社区规范（非推荐标准），语法更紧凑，Wikidata 用它做实体模式校验。工业界主流是 SHACL。

## 7. 规则层 —— SWRL 与 RIF

- **SWRL**（Semantic Web Rule Language，2004 W3C member submission，未成为推荐标准）: 在 OWL 之上写 Horn 规则，如 `hasParent(?x,?y) ∧ hasBrother(?y,?z) → hasUncle(?x,?z)`。表达 OWL 公理写不出的多变量关联规则。Protégé 和部分推理机（Pellet）支持，但全量 SWRL 不可判定，工程上常用其 DL-safe 子集。
- **RIF**（Rule Interchange Format，2010 W3C 推荐标准）: 目标是各家规则引擎之间**交换**规则的中间格式（分 Core / BLD / PRD 等方言）。设计得很全面，但实际采用率低，了解即可。
- **实践现状**: 生产系统里"规则"更多用 OWL 2 RL + 三元组库自带规则引擎、SPARQL CONSTRUCT（用查询产生新三元组）、或 Datalog 系产品（如 RDFox）实现，SWRL/RIF 本身用得不多。

## 8. ISO 体系的本体标准

W3C 之外，ISO 也有一支本体标准线，偏"顶层框架"和"逻辑基础"：

- **ISO/IEC 24707 Common Logic**（2007，第二版 2018）: 标准化的一阶逻辑框架，比 OWL DL 表达力更强（OWL 可看作它的可判定子集），提供 CLIF 等具体语法。用于需要完整一阶逻辑表达力的场景（如制造业本体 PSL 即 ISO 18629 基于它），但没有可判定推理保证。
- **ISO/IEC 21838 顶层本体（Top-Level Ontology, TLO）系列**: 这是"本体的本体"标准——
  - **Part 1**（2021）: 定义什么算一个合格的顶层本体、必须满足什么要求。
  - **Part 2: BFO**（Basic Formal Ontology，2021）: 把 BFO 2020 定为国际标准。BFO 是生物医学领域事实上的顶层本体，核心区分 **continuant**（持续存在的东西：物体、性质）和 **occurrent**(展开发生的东西: 过程、事件)，OBO Foundry 数百个生物医学本体都挂在它下面。
  - **Part 3: DOLCE**（2023 前后发布）: 另一个风格的顶层本体，源自语言学和认知科学传统，强调"描述性"（建模人类常识范畴而非客观实在）。
  - **Part 4: TUpper**（2023 前后发布）: 基于 SUMO 派生的顶层本体。
  - **用法**: 建领域本体时选一个顶层本体对齐（生物医学几乎默认 BFO），你的"手术"该是过程还是物体这类哲学问题就有了标准答案，不同机构的本体也因此可互操作。
- **ISO 25964 叙词表**（2011/2013）: 信息检索用叙词表的结构与互操作标准，与 SKOS 对齐（见第 4 节）。
- **ISO/IEC 13250 Topic Maps**（2003）: 与 RDF 同期竞争的另一套知识表示标准（主题–关联–出现三要素），后来生态基本被 RDF 系吞并，作为历史了解即可。
- **ISO 15926**（流程工业数据集成）、**ISO 18629 PSL**（制造过程规范语言）: 行业专用本体标准的代表。

## 9. 事实标准与治理规范

严格说不是"标准化组织标准"，但工程选型绕不开：

- **schema.org**: Google/Microsoft/Yahoo/Yandex 共建的 Web 结构化数据词汇表（800+ 类型），网页 SEO 结构化标注的事实标准，通常以 JSON-LD 内嵌网页。语义故意松散（无严格 OWL 公理），好用优先。
- **Dublin Core**（DCMI Terms，同时是 ISO 15836）: 15 个核心元数据词（title、creator、date……）加扩展词汇，任何"描述一份资源"的场景默认复用它而不是自造词。
- **FOAF、PROV-O、Time Ontology、GeoSPARQL** 等 W3C 系可复用词汇: 分别覆盖人和社交关系、数据溯源（PROV-O 是 W3C 推荐标准，数据 lineage 建模的标准答案）、时间、地理空间。
- **OBO Foundry 原则**: 生物医学本体社区的治理规范（开放、单一 IRI 命名规范、对齐 BFO、每个术语有定义、协作不重复建设），是"本体生态治理"的最佳实践范本。
- **FAIR 原则**: 数据/本体应 Findable、Accessible、Interoperable、Reusable，欧盟科研数据管理普遍要求，本体发布时的元规范。

## 10. 方法论与质量标准

怎么建、建得好不好，也有公认方法（详见[本体开发 101](ontology-101.html)）：

- **Ontology Development 101**（Noy & McGuinness, 2001）: 最经典的入门方法论——确定范围、考虑复用、列术语、定类层次、定属性、定约束、填实例，七步迭代。
- **METHONTOLOGY / NeOn**: 更重的工程化方法论，NeOn 强调基于场景的网络化本体构建（复用、重构、对齐现有本体）。
- **OntoClean**（Guarino & Welty）: 用元属性（rigidity 刚性、identity 同一性、unity 统一性）检查类层次是否哲学上站得住——比如"学生"是非刚性角色不该做"人"的刚性子类的建模依据就来自它。
- **能力问题（Competency Questions）**: 用"本体建成后必须能回答哪些问题"来界定范围和验收，是各方法论共同推荐的实践。

## 11. 怎么选：一个速查表

| 你的需求 | 用什么 |
| --- | --- |
| 表示和交换事实数据 | RDF + Turtle/JSON-LD |
| 简单类目和属性层次 | RDFS |
| 标签体系 / 术语表 / 分类导航 | SKOS |
| 严格概念定义 + 自动推理 | OWL 2 DL（按规模/场景选 EL/QL/RL profile） |
| 数据入库质量校验 | SHACL |
| 查询 | SPARQL 1.1 |
| 网页结构化标注（SEO） | schema.org + JSON-LD |
| 描述文档/资源元数据 | Dublin Core |
| 数据溯源 | PROV-O |
| 生物医学领域本体 | BFO（ISO 21838-2）+ OBO Foundry 规范 |
| 顶层框架对齐 | ISO/IEC 21838（BFO / DOLCE / TUpper 三选一） |
| 超出 OWL 的一阶逻辑表达 | Common Logic（ISO/IEC 24707） |

**典型组合**（2026 年知识图谱项目的"标准全家桶"）: RDF 做数据模型 + OWL 2（常取 RL profile）做领域语义 + SKOS 做词表 + SHACL 做校验 + SPARQL 做查询 + JSON-LD 做对外交换，需要行业互操作时再对齐一个 ISO 21838 顶层本体。

## 12. 规范原文入口

- RDF 1.1 Primer: https://www.w3.org/TR/rdf11-primer/
- RDF Schema 1.1: https://www.w3.org/TR/rdf-schema/
- OWL 2 Primer: https://www.w3.org/TR/owl2-primer/
- OWL 2 Profiles: https://www.w3.org/TR/owl2-profiles/
- SKOS Primer: https://www.w3.org/TR/skos-primer/
- SPARQL 1.1 Overview: https://www.w3.org/TR/sparql11-overview/
- SHACL: https://www.w3.org/TR/shacl/
- ISO/IEC 21838 系列: https://www.iso.org/standard/71954.html （Part 1 入口）
- BFO 官网: https://basic-formal-ontology.org/
- OBO Foundry 原则: https://obofoundry.org/principles/fp-000-summary.html
- schema.org: https://schema.org/
