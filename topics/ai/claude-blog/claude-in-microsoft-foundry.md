# Claude in Microsoft Foundry 正式发布

> 原文: https://claude.com/blog/claude-in-microsoft-foundry
> 日期: 2025-06-29
> 分类: 产品发布
> 产品: Claude Platform

---

## 文章在讲什么

这是一篇**产品发布公告**，宣布 Anthropic 的 Claude 模型正式在 Microsoft Foundry（微软的企业 AI 平台，托管在 Azure 云上）上线。

文章的核心信息是：**企业用户现在可以直接通过自己的 Azure 账户使用 Claude 模型**，而不需要单独注册 Anthropic 账号或管理另一套计费体系。这对于已经深度使用微软生态的企业来说，降低了采用 Claude 的门槛。

文章还通过四家企业的真实使用案例（NVIDIA、Bolt、Momentic、核能领域公司）来展示 Claude 在生产环境中的实际价值——从 AI 代理、代码生成到软件测试验证。

---

## 原文结构地图

| 文章主要部分 | 作用 |
|-------------|------|
| 开场公告 | 直接宣告 Claude in Foundry 正式发布，点明核心价值：Azure 环境内的企业级访问 |
| 客户证言（4 家企业） | 用真实用户的声音（而非官方宣传语气）展示 Claude 在不同场景下的表现，增加可信度 |
| "Build with Claude through your Azure account" | 具体说明可用的模型、API 功能、与 Azure 的集成方式 |
| "Run Claude in Azure, operated by Anthropic" | 解释两种托管方式的区别，帮企业根据需求选型 |
| "Get started" | 行动指引，告知用户如何上手 |

---

## 核心概念讲解

### 什么是 Microsoft Foundry

Microsoft Foundry 是微软推出的企业级 AI 平台（类似 Azure AI Studio 的升级版），它让企业可以在 Azure 云环境中访问、部署和管理各种 AI 模型。Foundry 提供了统一的身份认证、网络配置、计费系统和治理工具。

### Azure-native（Azure 原生）的含义

文章反复强调 Claude in Foundry 是"Azure-native"的。这指的是 Claude 与 Azure 平台深度集成：

- **身份集成**：使用你已有的 Azure AD / Entra ID 账号登录
- **网络集成**：受你现有的 Azure 虚拟网络、防火墙规则约束
- **计费集成**：统一在 Azure 账单中显示
- **治理集成**：受你配置的 Azure Policy 管控

对于 IT 部门来说，这意味着**不需要为 AI 单独维护一套权限体系**。

### 两种托管方式

文章指出了两种运行 Claude 的方式：

| 托管方式 | 特点 | 适用场景 |
|---------|------|---------|
| **Hosted on Azure** | Claude 运行在你的 Azure 订阅中，使用 Azure 认证和计费，有美国数据区域选项 | 已有 Azure 投资、重视数据主权、需要统一账单的企业 |
| **Hosted on Anthropic**（原 Foundry Preview） | Claude 运行在 Anthropic 基础架构上，可使用完整的 API 功能 | 需要最新功能、模型尚未在 Azure 上线的情况 |

这是**同一套 API 接口，两种后端部署方式**的架构设计。长期目标是让两种方式的**功能和模型保持一致**。

### Anthropic 作为数据处理者

文章明确指出：**Anthropic 是数据处理者（Data Processor）**。这意味着当你在 Azure 上运行 Claude 时：

- 推理计算由 Anthropic 负责执行
- 但 Anthropic 受 Azure 的合同条款约束
- 你仍然在 Azure 的治理框架下

这是一个"联合运营"模式——既利用了 Anthropic 的模型能力，又保留了 Azure 的企业治理框架。

---

## 文章主体讲解

### 第一部分：开场公告

**这一节讲什么**：文章开门见山宣布 Claude in Microsoft Foundry 正式可用，并简要说明核心价值——在 Azure 环境中运行 Claude，使用现有的企业控制体系。

**为什么重要**：对于企业决策者来说，最关心的不是"模型有多强"，而是"能不能安全、合规、低摩擦地使用"。开篇就强调 Azure 环境内的托管，直接回应了这个顾虑。

**关键点**：
- "Claude runs in your Azure environment"——不是新建一个系统，而是接入已有体系
- "US data zone for teams with data residency requirements"——数据主权选项，满足受监管行业（如金融、医疗、政府）的合规需求

---

### 第二部分：客户证言

**这一节讲什么**：通过四家真实客户的评价，展示 Claude + Azure 的实际应用效果。每条证言都暗示了特定的行业场景和使用价值。

**为什么重要**：产品发布公告如果只有官方宣传，容易让人觉得是自卖自夸。引入真实用户的声音，可以快速建立可信度。NVIDIA、Enterprise 客户 Bolt、核能领域、Momentic——这四个案例覆盖了科技巨头、中型企业、高度监管行业、SaaS 创业公司，说明方案的适用范围。

**关键点解析**：

| 企业 | 场景 | 证言中的关键词 |
|-----|------|--------------|
| **NVIDIA** | AI 代理自动化 | "autonomous AI agents"、"think bigger"、"GB300 GPUs" |
| **Bolt** | 企业级可靠性 | "sustained throughput and reliability"、"Fortune 500" |
| **核能领域公司** | 高安全要求 | "best security in the world"、"200 human days → 1 day" |
| **Momentic** | 软件测试自动化 | "plain English test descriptions"、"millions of tokens per minute" |

这些证言的共同主题是：**性能 + 可靠性 + 安全性 = 生产级可用**。

---

### 第三部分：Build with Claude through your Azure account

**这一节讲什么**：具体说明最初上线的模型、功能和与 Azure 的集成细节。

**为什么重要**：这是给技术决策者和开发者看的部分——他们需要知道具体能用什么、怎么用、和现有系统怎么对接。

**关键点**：
- **可用模型**：Claude Opus 4.8 和 Claude Haiku 4.5（通过 Messages API 访问）
- **核心功能**：Prompt Caching（减少重复输入的成本）、Extended Thinking（扩展思考能力）
- **适用场景**：Coding（代码生成）、Agentic Work（代理任务）、Complex Reasoning（复杂推理）
- **计费方式**：单一统一发票；已签署 Microsoft Enterprise Agreement 的客户可以直接用 Azure 承诺额抵扣 Claude 使用费用

---

### 第四部分：Run Claude in Azure, operated by Anthropic

**这一节讲什么**：解释两种托管方式的区别，帮企业在"Azure 环境托管"和"Anthropic 托管"之间做选择。

**为什么重要**：企业级产品必须考虑灵活性。不同企业的合规要求、安全策略、预算结构不同，不可能用一刀切的方案。

**关键点**：
- "Hosted on Azure"：适合重视 Azure 环境、需要数据区域选项的企业
- "Hosted on Anthropic"（原 Foundry Preview）：适合需要完整 API 功能或尚未在 Azure 上线的模型的场景
- 长期目标：Feature and model parity（功能和模型对齐），最终让两种方式体验一致

---

### 第五部分：Get started

**这一节讲什么**：行动指引，告诉读者下一步该做什么。

**为什么重要**：公告类文章如果停在"发布"而没有"如何使用"，读者会感到悬而未决。这里提供了直接入口。

**关键点**：
- 提供两个链接："Open Claude in Microsoft Foundry"（直接访问）和"Explore the documentation"（文档入口）

---

## 关键对比表

| 维度 | Hosted on Azure | Hosted on Anthropic |
|------|----------------|---------------------|
| **基础设施** | 你的 Azure 订阅 | Anthropic 基础设施 |
| **认证方式** | Azure AD / Entra ID | Anthropic API Key |
| **计费方式** | Azure 账单（含 Enterprise Agreement） | Anthropic 账单 |
| **数据区域** | 支持美国数据区域 | 标准区域 |
| **功能完整度** | 部分功能（逐步增加） | 完整功能 |
| **适用人群** | 已有 Azure 投资的企业 | 需要最新功能或特定模型的企业 |

---

## 关键句短摘译

### 1

> **英文**: "Claude runs in your Azure environment with the authentication, billing, and governance controls your teams already use."

**中文**: Claude 运行在你的 Azure 环境中，使用你的团队已经在用的认证、计费和治理控制。

**为什么重要**: 这句话直接回答了企业最关心的问题——**不需要学新东西，现有体系直接能用**。

---

### 2

> **英文**: "You can choose where inference is processed, including a US data zone for teams with data residency requirements."

**中文**: 你可以选择推理处理的位置，包括满足数据主权要求的美国数据区域。

**为什么重要**: 这是对受监管行业的明确信号——**合规需求被认真对待了**。

---

### 3

> **English**: "Anthropic operates the inference and is the data processor."

**中文**: Anthropic 运营推理服务，是数据处理者。

**为什么重要**: 明确了**责任划分**——Azure 提供平台，Anthropic 提供模型能力，双方各司其职。

---

### 4

> **English**: "We compressed a safety analysis that would have taken 200 human days into a single day."

**中文**: 我们把一个原本需要 200 人天的安全分析压缩到了一天。

**为什么重要**: 用具体的量化数字展示 Claude 在专业领域的**生产力提升**，不是泛泛的"效率提高"。

---

### 5

> **English**: "Over time, we aim to have feature and model parity between the hosted on Azure offering and the Anthropic-hosted one."

**中文**: 我们长期目标是让 Azure 托管方案和 Anthropic 托管方案在功能和模型上保持一致。

**为什么重要**: 这是一个**路线图承诺**，让企业知道现在的差异是暂时的，未来会消除。

---

### 6

> **English**: "For eligible customers with a Microsoft Enterprise Agreement, Claude usage draws down a Microsoft Azure commitment."

**中文**: 对于符合条件且签署 Microsoft Enterprise Agreement 的客户，Claude 使用费用可以消耗其 Azure 承诺额。

**为什么重要**: 对于大企业，这意味着**不需要单独谈判新的采购合同**，直接用已有预算。

---

## 术语表

| 英文术语 | 中文解释 |
|---------|---------|
| **Generally Available (GA)** | 正式发布，表示产品已成熟，可用于生产环境。区别于 Preview（预览）和 Beta（测试） |
| **Microsoft Foundry** | 微软的企业 AI 平台，提供在 Azure 上访问和管理 AI 模型的能力 |
| **Azure-native** | 深度集成到 Azure 平台的产品形态，与 Azure 的身份、网络、计费、治理系统无缝对接 |
| **Data Processor** | 数据处理者。在数据保护法规（如 GDPR）下，指处理个人数据的主体，需承担相应法律责任 |
| **Data Residency** | 数据驻留，指数据物理存储的地理位置，满足特定国家/地区的法规要求 |
| **Prompt Caching** | 一种 API 功能，允许模型复用之前请求中相同的提示前缀，减少重复输入的成本 |
| **Extended Thinking** | Claude 的扩展思考能力，允许模型在给出最终答案前进行更深入的推理 |
| **Enterprise Agreement** | 微软大客户协议，企业与微软签署的多年期采购合同，通常包含承诺消费额和折扣 |
| **Messages API** | Anthropic 提供的 API 接口格式，用于与 Claude 模型交互 |

---

## 文章结尾怎么收束

文章以简洁的 "Get started" 收尾，提供直接入口链接，逻辑闭合清晰：

**从问题到答案的完整链条**：

1. **开篇提出痛点**：企业想用 Claude，但担心与现有 Azure 体系的集成、计费、合规问题
2. **中间展示验证**：通过四家真实客户（覆盖科技、金融、监管、创业等场景）证明方案的可行性
3. **具体说明方案**：两种托管方式、可用的模型和功能、计费细节
4. **结尾给出行动**：直接点击开始

这个收束方式属于**行动号召型**——文章的目的不仅是"告知"，更是"促动"。作者没有做复杂的总结，而是用最少的文字告诉你：**现在可以用，去试试吧**。

对于一篇产品发布公告来说，这是一个干净利落的结尾方式。
