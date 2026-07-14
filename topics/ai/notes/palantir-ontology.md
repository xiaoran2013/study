# Palantir Ontology: 技术架构与企业实践

Palantir(NYSE: PLTR)是把"本体驱动企业运营"做得最系统化的公司, 其 Foundry 平台的 Ontology 层也是 AIP(AI Platform)所有 Agent 能力的地基。本文整理官方文档和公开资料, 讲清三件事: Ontology 的设计哲学、技术架构、以及企业落地实践。

配套阅读: [本体标准全景](topics/ai/notes/ontology-standards.md)(W3C/ISO 标准体系)、[本体论与 AI Agent](topics/ai/notes/agent-ontology.md)(为什么 Agent 需要本体)。注意: Palantir 的 Ontology 是**私有工程体系**, 不基于 RDF/OWL 标准栈, 两者是同一思想的不同实现路线。

## 1. 设计哲学: 建模决策, 而不是数据

官方文档反复强调的一句话: Ontology 表示的是"企业中复杂、互相关联的**决策**, 而不只是数据"。这是它与传统语义层/数据目录最大的区别——传统语义层回答"数据是什么意思", Palantir Ontology 还要回答"基于这些数据可以做什么动作、谁有权做、做了之后写回哪里"。

由此形成**四位一体**的集成模型:

- **Data**: 把 ERP、CRM、传感器、文档库等碎片化数据源统一成有语义的业务对象;
- **Logic**: 从简单业务规则到 LLM 驱动函数的模块化推理逻辑;
- **Action**: 从基础事务到复杂多步更新, 最终**写回**到操作系统(SAP 等);
- **Security**: 细粒度、基于策略的访问控制, 贯穿以上三层。

整体效果是组织的"数字孪生"(digital twin): 平台上的数字资产与现实世界的工厂、设备、订单、交易一一对应, 人和 AI 在同一套语义上协作。([Ontology 系统架构文档](https://www.palantir.com/docs/foundry/architecture-center/ontology-system)、[Ontology 概览](https://www.palantir.com/docs/foundry/ontology/overview))

## 2. 语义层与动能层: 名词 + 动词

Ontology 的元素分两类, 官方叫法是 semantic(语义)和 kinetic(动能), 可以直白地理解为**名词和动词**:

**语义元素(名词)**:

- **Object Type**: 业务实体的类, 如 Supplier、Order、Aircraft、Incident, 带属性(Properties: ID、名称、交期、风险分……);
- **Link Type**: 对象间的有类型关系, 如 Supplier —supplies→ Part —installedOn→ Aircraft;
- **Interface**: 对象类型的"形状"抽象, 让共享同一形状的对象类型可以被一致地建模和交互(类似编程里的接口多态)。

**动能元素(动词)**:

- **Action Type**: 结构化的写操作——受治理、可审计地修改对象状态, 并可写回源系统。每个 Action 像一份**契约**: 它做什么、谁能触发、什么条件下允许、留下什么日志;
- **Function**: 代码形式的业务逻辑, 对象进、结果出, 复杂度不限(可以调用 LLM)。

这个"语义+动能"配对是 Palantir 与 W3C 本体标准栈(见[本体标准全景](topics/ai/notes/ontology-standards.md))最大的分野: OWL 只定义"世界上什么是真的", 不管"可以对世界做什么"; Palantir 把动作、权限、写回全部纳入本体, 代价是完全私有、不与 RDF/OWL 互操作。

## 3. 系统架构: Language / Engine / Toolchain

官方把几十个组件概念化为三层:

- **Language**: 建模语言层——语义的对象/链接/属性 + 动能的动作/自动化;
- **Engine**: 读写引擎——模块化读架构(SQL 查询、实时订阅)和可扩展写架构(原子事务、批量变更、流、CDC);
- **Toolchain**: 工具链——**OSDK**(Ontology SDK, 把本体生成为类型安全的 TypeScript/Python SDK, 应用直接把本体当后端用)和 DevOps 工具。

后端是微服务架构, 关键组件:

| 组件 | 职责 |
| --- | --- |
| **OMS**(Ontology Metadata Service) | 定义本体元数据: 有哪些对象类型、链接类型、动作类型 |
| **Object Data Funnel** | 编排数据写入: 从 Foundry 数据源和用户编辑(Actions)读取并索引进对象数据库 |
| **Object Databases** | 存储索引后的对象数据, 支撑快速查询, 负责索引/查询/编辑编排 |
| **OSS**(Object Set Service) | 服务读请求: 搜索、过滤、聚合、加载对象 |

数据流: 源系统 → Foundry 数据集成(管道/HyperAuto 自动建模)→ Funnel 索引 → 对象数据库 → OSS 对外服务; 用户或 Agent 通过 Action 产生的编辑走同一条 Funnel 通道写回。([Ontology 后端架构](https://www.palantir.com/docs/foundry/object-backend/overview))

## 4. AIP: Agent 怎么用这个本体

AIP(2023 年发布)把 LLM 架在 Ontology 之上, 架构上的核心主张是: **Ontology 而不是 LLM 位于中心**。

- **模型接入**: 统一网关接入商业模型(GPT/Gemini/Claude/Grok)和开源模型, 承诺第三方不留存、不用于训练;
- **AIP Logic**: 低代码编排 Agent 工作流; 复杂逻辑用 Code Workspaces(pro-code);
- **AIP Chatbot Studio**(原 Agent Studio): 构建对话式 Agent;
- **AIP Evals**: 内置评测框架——建测试用例、对比模型表现、分析执行方差, 把"Agent 靠不靠谱"变成可度量的工程问题。

Agent 与本体的交互被严格约束: **Agent 不直接访问底层数据库表, 也不能自由扫描全部 schema**, 只能在授权边界内通过本体暴露的对象、关系、Function 和 Action 操作。权限模型对人和 Agent 一视同仁——角色/标记(marking)/目的(purpose)三种策略动态组合, Agent 继承并受制于与人类员工相同的安全治理, 全程审计。Agent 发起的写操作可以先暂存为"场景"(scenario), 走审批后再真正写回企业系统——这是"从增强(augmentation)平滑走向自动化(automation)"路径的关键设计。([AIP 架构文档](https://www.palantir.com/docs/foundry/architecture-center/aip-architecture)、[Connecting Agents to Decisions](https://blog.palantir.com/connecting-agents-to-decisions-277dee8ddb40))

## 5. 企业实践

公开报道较多的案例(时间跨度大, 早期是 Foundry, 2023 后叠加 AIP):

- **空客 Airbus**: 最经典的 Foundry 案例。Skywise 平台把 A350 生产数据(供应链、工艺、质量)统一成本体对象, 用于产能爬坡瓶颈分析, 后来扩展为整个航空业的数据平台;
- **英国 NHS / 美国 HHS**: 疫情期间的疫苗分发与医疗物资调度(美方系统代号 Tiberius), 本体建模"疫苗批次—冷链—接种点—人群"网络;
- **美国陆军 Vantage**: 军队人员/装备/战备状态的统一运营视图;
- **医疗系统(HCA Healthcare、Tampa General、Cleveland Clinic 等)**: 护士排班、病床/患者流转优化——本体对象是床位、患者、护士、手术, Agent 在其上做调度建议;
- **供应链与制造(Wendy's 供应链合作社、Panasonic 电池工厂等)**: 需求预测、断供预警、库存再平衡。典型模式: 外部信号(如供应商断供 API)触发 Agent → 查询本体对象 → 调用优化求解器 → LLM 把数学结果写成自然语言摘要 → 人审批 Action 写回 ERP。

**落地方法论**也值得注意: 2023 年起 Palantir 用 **AIP Bootcamp** 模式获客——不做长周期 PoC, 而是几天内在客户真实数据上把本体和第一个 Agent 用例跑起来, 这直接反映其"本体建一次, 上面所有应用和 Agent 共享同一语义地基"的架构优势: 边际用例的交付成本递减。

**争议与借鉴**: 批评主要集中在私有体系锁定(不兼容开放标准, 迁出成本高)和价格。对自建者的可借鉴点: (1) ontology-first——先建业务对象和动作契约, 再谈 Agent; (2) Action 即契约——Agent 的每个写操作都应该有明确的权限、条件、审计; (3) Agent 权限与人同轨——不给 Agent 单独的旁路权限体系; (4) 评测内置——Evals 是平台组件而不是事后补丁。

## 6. 参考

- [The Ontology System(架构中心)](https://www.palantir.com/docs/foundry/architecture-center/ontology-system)
- [Ontology Overview(产品文档)](https://www.palantir.com/docs/foundry/ontology/overview)
- [Ontology 后端微服务](https://www.palantir.com/docs/foundry/object-backend/overview)
- [AIP Architecture](https://www.palantir.com/docs/foundry/architecture-center/aip-architecture)
- [Palantir Blog: Connecting Agents to Decisions](https://blog.palantir.com/connecting-agents-to-decisions-277dee8ddb40)
