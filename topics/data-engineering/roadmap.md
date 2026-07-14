---
updated: 2026-07-14
---

# 数据工程学习路线

这份路线把数据工程拆成两条主线：**管道工程**（把数据可靠地移动、转换、供给出去）和**语义工程**（让数据的含义被人和机器统一理解，即本体/Ontology 这条支线）。主流教材只讲第一条，第二条传统上归入知识工程，但在语义层、Data Fabric、GraphRAG 兴起之后，两条线正在合流——所以本路线把 Ontology 明确挂在第 1 章（建模）和第 6 章（治理）两个节点上，并与本站已有的[本体](wiki/ontology.md)知识网络互相引用。

全路线共 9 章：第 0 章是地基，第 1-4 章是核心技能（建模、数仓、存储、流），第 5-7 章是工程化和架构视野，第 8 章是资料总表和学习顺序建议。

## 第 0 章 · 基础工具：SQL、Python 与命令行

**学什么**：数据工程师 80% 的日常产出是 SQL 和 Python，这一章的目标不是"会用"，而是"熟到不构成思考负担"。

- **SQL 进阶**：窗口函数（`ROW_NUMBER`/`LAG`/滑动聚合）、CTE 与递归查询、`GROUP BY` 的扩展（`ROLLUP`/`GROUPING SETS`）、执行计划阅读（扫描方式、join 算法、谓词下推）。窗口函数和执行计划是面试和实战双重高频点。
- **Python**：超出脚本水平——虚拟环境与依赖管理、类型标注、日志、异常处理、包组织；数据侧掌握 pandas 的同时了解它的内存局限（为第 2 章的 Spark 埋伏笔）。
- **Linux/Shell 与 Git**：管道命令组合（`grep`/`awk`/`sort`/`uniq`）处理文本文件、cron、SSH；Git 分支协作流程。

**资料**：SQL 推荐 Mode SQL Tutorial（免费、直接在浏览器练）+《SQL Cookbook》查阅；Python 推荐《Fluent Python》选读前半；命令行推荐 MIT 公开课 The Missing Semester。

**过关标准**：能不查文档写出"每个用户最近一次订单"（窗口函数），能解释一条慢查询为什么慢。

## 第 1 章 · 数据建模：从 ER 图到本体

**学什么**：建模是数据工程里最不会过时的技能——工具十年换一轮，建模思想五十年只加不减。这一章也是 **Ontology 的第一个接口**。

- **关系建模**：ER 图、三范式、主外键约束。目标是 OLTP 场景下"一个事实只存一处"。
- **维度建模（重点）**：Kimball 方法论——事实表与维度表、星型/雪花模型、粒度声明、缓慢变化维（SCD Type 1/2）、一致性维度与总线矩阵。这是分析型数仓的通用语言，dbt 社区的默认心智模型。
- **Data Vault**：了解即可——Hub/Link/Satellite 三件套，适合源系统多且频繁变化的大企业，中小场景不必用。
- **宽表与反范式**：大数据场景下为读性能牺牲规范性的常见做法，理解取舍即可。

**本体视角**：概念建模和本体建模本质是同一件事的两种严格程度。ER 图里的实体/关系/属性，对应 [RDFS](wiki/rdfs.md) 的类/属性；业务术语表对应 [SKOS](wiki/skos.md) 的概念词表；需要机器自动推理和跨系统对齐时才升级到 [OWL](wiki/owl.md)。学完维度建模后回头看本站的[本体](wiki/ontology.md)卡片，会发现"总线矩阵里的一致性维度"就是朴素的共享本体。

**资料**：Kimball《The Data Warehouse Toolkit》（第 3 版，精读前 6 章 + 按行业查后面的案例章）；dbt 官方博客的 dimensional modeling 系列作现代化补充。

**过关标准**：给一个电商业务，能独立画出订单事实表 + 用户/商品/时间维度表，并说清每张表的粒度和 SCD 策略。

## 第 2 章 · 数据仓库与批处理

**学什么**：把建模落到引擎上——数仓怎么分层、大规模数据怎么算。

- **数仓架构**：分层思想（staging → 中间层 → marts，国内习惯叫 ODS/DWD/DWS/ADS），每层职责和命名规范；MPP 数仓（Snowflake/BigQuery/Redshift）与 Lakehouse 的架构差异。
- **Spark（重点）**：RDD → DataFrame → Spark SQL 的演进、宽窄依赖与 shuffle、分区与数据倾斜调优、Catalyst 优化器概念。Spark 是批处理事实标准，值得深入到原理层。
- **dbt（重点）**：用 SQL + Jinja 管理转换逻辑，模型依赖 DAG、增量模型、测试、文档生成。dbt 把软件工程实践（版本控制、测试、CI）带进了 SQL 开发，是"Analytics Engineering"岗位的核心工具。

**资料**：《Fundamentals of Data Engineering》（Reis & Housley，全路线主线教材，先通读一遍建立地图）；Spark 推荐《Learning Spark》第 2 版（免费电子版）+ 官方文档；dbt 官方 Fundamentals 课程（免费，约 5 小时）。

**过关标准**：能用 dbt 搭一个三层结构的小型数仓项目；能解释一个 Spark 任务的 shuffle 发生在哪、为什么倾斜。

## 第 3 章 · 存储与文件格式

**学什么**：理解数据在磁盘上长什么样，是排查性能问题和做架构选型的底气。

- **行存 vs 列存**：为什么分析查询用列存快一个数量级；编码与压缩（字典编码、RLE、Delta 编码）。
- **Parquet（重点）**：Row Group / Column Chunk / Page 三级结构，统计信息如何支撑谓词下推。
- **开放表格式**：Iceberg / Delta Lake / Hudi 三选一深入（推荐 Iceberg，社区势头最强）——它们在 Parquet 之上补齐了 ACID 事务、schema 演进、时间旅行、隐藏分区，是 Lakehouse 架构的基石。
- **对象存储**：S3 的一致性模型、分区键设计对吞吐的影响。

**资料**：《Designing Data-Intensive Applications》（Kleppmann，DDIA）第 2-3 章讲存储引擎的本质，是这一章的理论底座——这本书值得整本精读，全路线按章拆到各处；Iceberg 官方文档 + Tabular 博客。

**过关标准**：能解释同一份数据存 CSV、Parquet、Iceberg 表的差别，以及各自适合的查询模式。

## 第 4 章 · 流处理与消息系统

**学什么**：从"每天跑一次"到"数据到达即处理"。

- **Kafka（重点）**：主题/分区/消费组模型、offset 管理、副本与 ISR、消息投递语义（at-least-once vs exactly-once 的真实含义与代价）。
- **流处理语义**：事件时间 vs 处理时间、乱序与 watermark、窗口（滚动/滑动/会话）、状态管理与 checkpoint。这些概念比具体框架更重要。
- **Flink**：流处理事实标准，理解它如何实现有状态的 exactly-once；对比 Spark Structured Streaming 的微批模型。
- **CDC**：用 Debezium 类工具把数据库变更流式同步到下游，是打通 OLTP 与分析系统的主流方案。

**资料**：DDIA 第 11 章"流处理"（先读，建立概念框架）；《Kafka 权威指南》第 2 版；Flink 官方文档的 Learn Flink 路径。

**过关标准**：能说清一条消息从生产到消费经过哪些环节、哪里可能丢/重，watermark 怎么解决乱序聚合。

## 第 5 章 · 编排、测试与数据质量

**学什么**：让管道从"能跑"到"可运维"。这是初级和资深数据工程师的分水岭。

- **编排**：Airflow（存量最大）或 Dagster（更现代，资产导向）。核心不是工具而是原则：**幂等性**（重跑不产生副作用）、**回填**（backfill）设计、依赖管理、失败重试与告警。
- **数据测试**：dbt tests（唯一性/非空/引用完整性/接受值域）、Great Expectations 做更复杂的分布和统计断言。
- **数据可观测性**：新鲜度、数据量、schema 变更、分布漂移四类监控；数据事故（data downtime）的响应流程。

**本体视角**：数据质量约束的表达在图数据世界有个平行标准——[SHACL](wiki/shacl.md) 之于 RDF，就是 Great Expectations 之于表格数据：都是"封闭世界假设下的数据校验"。对照着看能加深对两边的理解。

**资料**：Dagster 官方 Dagster University（免费）；Airflow 官方文档 + 《Data Pipelines with Apache Airflow》；Great Expectations 官方教程。

**过关标准**：能设计一条支持任意日期回填、失败自动重试、关键表带质量断言的日级管道。

## 第 6 章 · 治理、元数据与语义层（Ontology 核心章）

**学什么**：当数据规模超过"几个人都认识所有表"的程度，"数据意味着什么"就成了瓶颈。这一章是 **Ontology 在数据工程里的核心位置**。

- **数据目录与血缘**：DataHub / Amundsen / OpenMetadata，让人能搜到数据、看到上下游。注意它们的底层元数据模型就是**图**——DataHub 的实体-切面（entity-aspect）模型本质上是一个知识图谱。
- **语义层（Semantic Layer）**：在物理表之上定义统一的业务指标（"收入"到底怎么算），dbt Semantic Layer / Cube / Looker 的 LookML 都是这个思路。语义层解决的正是本体要解决的问题——共享的概念定义——只是表达力更弱、更贴近 BI 场景。
- **业务词汇表与主数据管理（MDM）**：业务术语的规范化管理。词汇表的标准化表达就是 [SKOS](wiki/skos.md)；主数据的跨系统对齐，严肃做法是引入共享本体。
- **本体工程实操**：到这里正式接入语义技术栈——[RDF](wiki/rdf.md) 表达事实、[OWL](wiki/owl.md) 定义领域概念、[SPARQL](wiki/sparql.md) 查询、[SHACL](wiki/shacl.md) 校验，构建企业[知识图谱](wiki/knowledge-graph.md)。本站的[语义网标准栈](wiki/semantic-web-stack.md)卡片是这套标准的一图流索引，[本体标准全景](topics/ai/notes/ontology-standards.md)长文有各标准的详解和选型表。
- **合规基础**：GDPR/个保法的最小必要原则、PII 识别与脱敏、数据分级。

**资料**：DAMA-DMBOK（治理框架全书，工具书查阅式读，不必通读）；《Semantic Web for the Working Ontologist》（Allemang & Hendler，Ontology 实操最好的一本）；《Building Knowledge Graphs: A Practitioner's Guide》（Barrasa 等，O'Reilly 免费领，偏工程落地）；本站[本体开发 101](topics/ai/notes/ontology-101.html) 可作动手入门。

**过关标准**：能给一个多系统企业设计"数据目录 + 业务词汇表 + 指标语义层"的三层语义方案，并说清哪一层用轻量约定、哪一层值得上 OWL 本体。

## 第 7 章 · 架构范式与前沿

**学什么**：把前面的组件拼成组织级架构，并看清正在发生的合流。

- **Lambda / Kappa**：批流分治与批流一体的历史演进，理解为什么业界在向流批一体收敛。
- **Data Mesh**：四原则——领域所有权、数据即产品、自助平台、联邦治理。它是组织架构层面的方案，不是技术栈。
- **Data Fabric**：与 Data Mesh 相对的技术路线，核心主张是**用元数据知识图谱自动化数据集成与发现**——这是 Ontology 从"学术支线"回到数据工程主线的最明确信号：Fabric 的定义里显式依赖本体和[知识图谱](wiki/knowledge-graph.md)。
- **LLM 与数据工程的交汇**：GraphRAG（用知识图谱增强检索问答）、Text-to-SQL 依赖语义层提供业务口径、LLM 辅助元数据生成。这是本站 AI 主题与数据工程主题的交汇点，背景见长文[本体论与 AI Agent](topics/ai/notes/agent-ontology.md)。

**资料**：Zhamak Dehghani《Data Mesh》（或先读她在 martinfowler.com 的两篇原始文章）；Gartner 的 Data Fabric 综述类文章；微软 GraphRAG 论文与开源实现。

**过关标准**：能对比 Data Mesh 和 Data Fabric 各自解决什么问题、对团队的要求差异，并判断一个给定组织更适合哪条路。

## 第 8 章 · 学习顺序与资料总表

### 建议顺序

1. **打地基**（第 0 章）：SQL 和 Python 练到不假思索，贯穿始终不单独占期。
2. **建模 + 数仓**（第 1-2 章）：先 Kimball 后 dbt，这是就业和实战的最短路径，做一个端到端 dbt 项目收尾。
3. **底层原理**（第 3 章 + DDIA 通读）：有了实践再读原理，收获翻倍。
4. **流处理**（第 4 章）：Kafka 概念 → Flink 上手。
5. **工程化**（第 5 章）：给自己的项目补编排、测试、质量监控。
6. **语义与治理**（第 6 章）：接上已有的本体知识储备，做一个"数据目录 + 词汇表"小实验。
7. **架构视野**（第 7 章）：读架构范式，回头重构自己项目的叙事。

### 书目总表

| 书/资源 | 对应章节 | 读法 |
| --- | --- | --- |
| 《Fundamentals of Data Engineering》 | 全局地图 | 先通读，建立框架 |
| 《Designing Data-Intensive Applications》 | 3、4 章理论底座 | 整本精读，最重要的一本 |
| 《The Data Warehouse Toolkit》(Kimball) | 第 1 章 | 精读前 6 章 |
| dbt Fundamentals（官方免费课） | 第 2 章 | 动手跟做 |
| 《Learning Spark》第 2 版 | 第 2 章 | 通读 + 查阅 |
| 《Kafka 权威指南》第 2 版 | 第 4 章 | 通读前半 |
| 《Data Pipelines with Apache Airflow》 | 第 5 章 | 选读 |
| DAMA-DMBOK | 第 6 章 | 工具书查阅 |
| 《Semantic Web for the Working Ontologist》 | 第 6 章 | 精读，Ontology 实操主教材 |
| 《Building Knowledge Graphs》(O'Reilly) | 第 6 章 | 通读，工程落地视角 |
| 《Data Mesh》(Dehghani) | 第 7 章 | 先读作者博客文，需要再读书 |

### 与本站知识网络的联动

Ontology 支线的概念地基已在 wiki 就位：[本体](wiki/ontology.md)、[语义网标准栈](wiki/semantic-web-stack.md)、[知识图谱](wiki/knowledge-graph.md)及各标准卡片。数据工程侧新增[维度建模](wiki/dimensional-modeling.md)、[语义层](wiki/semantic-layer.md)、[数据编织](wiki/data-fabric.md)三张卡片，作为两条主线的接点。学到对应章节时从卡片跳回长文即可。
