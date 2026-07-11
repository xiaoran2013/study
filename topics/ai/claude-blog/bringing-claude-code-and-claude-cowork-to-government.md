# 将 Claude Code 和 Claude Cowork 引入政府领域

> 原文: https://claude.com/blog/bringing-claude-code-and-claude-cowork-to-government
> 日期: 2026-07-07
> 分类: Product announcements
> 产品: Claude Code

## 文章在讲什么

这是一篇**产品发布公告**，宣布 Anthropic 将其商业版 AI 开发工具（Claude Code 和 Claude Cowork）引入政府领域，通过"Claude for Government Desktop"产品提供给公共部门使用。

作者想解决的核心问题是：**政府机构如何安全、合规地获取和使用企业级 AI 工具**。文章强调了这款产品具备 FedRAMP High 认证、本地化数据存储、符合政府预算体制的计费模式，以及完整的审计和治理功能——这些都是政府采用新技术时的刚性需求。

---

## 原文结构地图

| 主要章节 | 作用 |
|---------|------|
| **开头概览** | 用一句话说明产品发布，给出核心价值定位 |
| **What's new** | 详细列举四个新能力维度：工具功能、计费模式、管理机制、安全审计 |
| **Security and oversight** | 专门面向安全团队，列出合规文档和支持材料 |
| **Getting started** | 收尾部分，说明如何申请和接入 |

---

## 核心概念讲解

### 1. Claude Code vs Claude Cowork

这是两个互补的工具，定位不同：

- **Claude Code**：面向开发团队，用于**构建和现代化改造公共服务背后的软件系统**。它的使用场景是编写代码、调试程序、自动化脚本开发。
- **Claude Cowork**：面向行政和业务人员，直接在**桌面上与文件交互**，完成撰写备忘录、审阅 RFP、处理 casework、制作演示文稿等任务。

两者共享同一个底层应用，但面向不同角色的工作流程。

### 2. FedRAMP High 认证

这是美国联邦政府云安全的最高等级认证。**"High"级别**意味着该系统可以处理敏感但非机密（sensitive but unclassified）的政府数据，包括个人身份信息、健康数据、财务数据等。对政府客户来说，FedRAMP 认证是采购云服务的必要条件，而非加分项。

文章强调产品"built on the same application our commercial customers use"——商业版和政府版底层相同，这意味着政府用户能以与商业用户**相同的更新节奏**获得新功能，不会因为合规要求而被锁定在旧版本上。

### 3. 本地存储 + 云端推理的混合架构

文章指出：**对话历史存储在机构管理的设备本地**，而**推理（模型运算）运行在 FedRAMP High 授权环境内**。

这个设计的逻辑是：用户输入的prompt和上下文可能包含敏感信息，这些不离开本地设备；而真正消耗算力的模型推理在Anthropic的云端完成，保证响应质量和速度。这种架构在政府云产品中很常见，兼顾了数据主权和性能。

### 4. 政府预算适配的计费模式

政府机构使用纳税人的钱，有严格的预算管理要求（appropriations）。文章描述了几层适配：

- **标准席位（Standard seats）**：固定费用，可绑定特定拨款项目
- **自定义席位层级**：可定义消费上限和模型限制
- **固定增量购买 + 硬性上限（hard not-to-exceed cap）**：防止超支
- **自动消耗预警**：余额不足前自动提醒

这与商业版按实际用量计费的方式有显著区别，体现了对政府财务合规性的理解。

---

## 文章主体讲解

### 开头概览段落

**这一节讲什么**：文章开篇用三个功能点（Claude Code、Claude Cowork、治理能力）快速说明产品是什么，然后用一句话总结价值——让政府机构更容易获取、授权和分配 AI 以完成使命。

**为什么重要**：产品公告的读者往往是决策者，他们需要在30秒内判断"这和我有没有关系"。作者用了"easier for agencies to acquire, authorize, and allocate"三个动词，直接对应政府机构采购流程中的三个痛点。

**关键点**：
- 底层与商业版一致，不是专门为政府重写的"阉割版"
- 通过 FedRAMP High 授权环境交付，这是政府云的入场券
- 治理能力（配置默认值、消费控制）是专门为多层级行政结构设计的

---

### What's new 部分

**这一节讲什么**：从四个维度展开新产品能力，每个维度对应一类读者关心的问题。

**为什么重要**：政府采购决策涉及多个利益相关方——项目办公室关心功能、预算部门关心计费、IT 管理员关心部署方式、安全团队关心合规。作者用这四个维度逐一回应，不遗漏任何一个决策链条上的角色。

**关键点**：

**工具层面**：
- Claude Code 和 Claude Cowork 与商业用户同步更新
- 推理在云端完成，符合 FedRAMP High 要求

**计费层面**：
- 可绑定拨款项目，支持固定增量购买
- 有硬性消费上限，防止超支
- 管理员可按用户、按模型追踪使用量

**管理层面**：
- 支持多级管理架构（部门→子机构→用户）
- SCIM 组映射可以批量设置席位限制
- 分层配置可设置默认值，包括允许连接的外部服务、可用功能、与用户交互时的引导指令

**安全层面**：
- 所有管理操作记录在哈希链式审计日志中，不可篡改
- Anthropic 端的敏感操作需要双人审批（two-person approval）
- 导出的使用数据仅含计量信息（metering data），不含敏感内容，避免数据在流转中泄露

---

### Security and oversight 部分

**这一节讲什么**：专门面向安全团队和合规官员，说明 Anthropic 提供的安全文档和证明材料。

**为什么重要**：政府机构的 ATO（Authority to Operate）审批过程需要大量文档支持，包括安全配置指南、变更通知、渗透测试报告。这些材料不是"有了更好"，而是审批流程中的必需品。

**关键点**：
- **FedRAMP Secure Configuration Guide**：公开发布的配置指南，客户可用它以安全方式配置产品
- **Formal change notification**：FedRAMP 要求提供的正式变更通知，记录本次更新的安全相关内容
- **Penetration-test summary**：桌面客户端的渗透测试摘要，后续测试结果也会陆续提供
- 这些敏感材料通过 Anthropic 的信任中心在 NDA 下提供
- 应用通过标准机构 MDM（移动设备管理）平台部署，不需要额外的特殊渠道

---

### Getting started 部分

**这一节讲什么**：收尾说明接入方式和联系方式。

**为什么重要**：文章特别指出"**Anthropic remains the contracted and billing party**"——机构不需要与云服务商（如 AWS、Azure）建立单独关系。这降低了采购复杂度，政府机构只需与 Anthropic 一家签约即可。

**关键点**：
- 新客户通过 claude.com/solutions/government 申请
- 安全团队可下载渗透测试材料
- 简化的合同关系是降低采购门槛的重要举措

---

## 关键对比表

| 对比维度 | 商业版 Claude Code | 政府版 Claude for Government Desktop |
|---------|-------------------|-------------------------------------|
| **底层应用** | 相同 | 相同 |
| **更新节奏** | 正常节奏 | 与商业用户同步 |
| **数据存储** | 云端 | 本地设备（对话历史） |
| **推理** | 云端 | 云端（FedRAMP High 环境） |
| **认证** | 无特殊要求 | FedRAMP High 授权 |
| **计费模式** | 按量付费 | 固定增量 + 硬性上限，可绑定拨款 |
| **管理架构** | 扁平 | 多级（部门→子机构→用户） |
| **审计日志** | 基础 | 哈希链式、防篡改 |
| **合同方** | Anthropic | Anthropic（无需额外云服务商关系） |

---

## 关键句短摘译

1. **"Claude Code and Claude Cowork are now available in public beta in Claude for Government Desktop, built on the same application our commercial customers use"**
   - 中文：Claude Code 和 Claude Cowork 现已在 Claude for Government Desktop 中公开测试，基于商业客户使用的同一应用构建。
   - 重要性：强调政府版不是"特供版"，底层与商业版一致，保证功能同步。

2. **"Inference runs inside a FedRAMP High authorized environment"**
   - 中文：推理运行在 FedRAMP High 授权环境内。
   - 重要性：说明模型运算仍在云端，但该云端已通过政府最高安全等级认证，解决合规顾虑。

3. **"Program offices can tie AI spend to appropriated funds with standard seats or they can define their own seat tiers with spend and model limits"**
   - 中文：项目办公室可以通过标准席位将 AI 消费与拨款绑定，也可以自定义席位层级并设置消费和模型限制。
   - 重要性：展示计费模式的灵活性，直接回应政府财务合规需求。

4. **"Department-level administrators can allocate seats and prepaid usage to sub-agencies while allowing each to manage its own users"**
   - 中文：部门级管理员可以将席位和预付费用量分配给子机构，同时允许各自管理自己的用户。
   - 重要性：体现对政府多层級组织结构的适配，不是简单的一刀切管理。

5. **"Every administrative action is recorded in a hash-chained audit log"**
   - 中文：每项管理操作都记录在哈希链式审计日志中。
   - 重要性：哈希链式结构保证日志不可事后篡改，满足政府审计的严格要求。

6. **"Usage exports are metering data only so agencies can answer ATO and IG requests without moving sensitive material"**
   - 中文：使用数据导出仅含计量信息，使机构能够响应 ATO 和 IG 请求，而无需搬运敏感材料。
   - 重要性：说明导出的数据不包含用户内容，避免数据二次泄露风险。

7. **"Anthropic remains the contracted and billing party—agencies don't need a separate cloud-provider relationship to get started"**
   - 中文：Anthropic 仍是合同方和账单方——机构无需与云服务商建立单独关系即可开始使用。
   - 重要性：简化采购流程，政府只需与 Anthropic 一家签约，降低采购复杂度。

---

## 术语表

| 英文术语 | 中文解释 |
|---------|---------|
| **FedRAMP** | Federal Risk and Authorization Management Program，美国联邦政府的云安全认证项目，所有政府云服务必须获得其授权才能使用 |
| **FedRAMP High** | FedRAMP 认证的最高等级，适用于处理敏感非机密数据的系统，包括 PII、健康信息、财务数据等 |
| **Claude Code** | Anthropic 的 AI 编程助手，面向开发者，用于编写、调试、重构代码 |
| **Claude Cowork** | Anthropic 的桌面协作工具，面向行政和业务人员，直接处理本地文件（备忘录、RFP 审阅、演示文稿等） |
| **ATO (Authority to Operate)** | 运营授权，美国政府机构在新 IT 系统上线前必须获得的正式批准 |
| **IG (Inspector General)** | 监察长，美国政府机构内的独立审计机构，有权审查任何业务活动 |
| **SCIM (System for Cross-domain Identity Management)** | 跨域身份管理标准，允许自动化用户和组信息的同步 |
| **MDM (Mobile Device Management)** | 移动设备管理，企业/政府用于统一管理员工设备的平台 |
| **Appropriations** | 拨款，美国政府的法定预算分配，机构只能在拨款范围内支出 |
| **Metering data** | 计量数据，仅记录使用量（次数、时长等），不含具体内容的数据 |
| **Two-person approval** | 双人审批，敏感操作需要两人同时批准才能执行的安全机制 |
| **Hash-chained audit log** | 哈希链式审计日志，每条日志包含前一条的哈希值，篡改任一条会导致链条断裂，可被发现 |

---

## 文章结尾怎么收束

文章以**行动号召**收尾，提供两个具体的接入入口（产品申请页面和渗透测试材料下载链接），并用一句关键表述完成逻辑闭合：

> **"Anthropic remains the contracted and billing party—agencies don't need a separate cloud-provider relationship to get started."**

这句话的逻辑是：全文一直在说明产品如何合规、如何安全、如何适配政府流程，但读者最后会有一个实际问题——"我买了这个产品，还需要签多少合同、走多少流程？"作者直接回答：**只需和 Anthropic 一家打交道**。这句话把之前分散的四个维度（功能、计费、管理、安全）都收拢到一个简单的结论上，让决策者感到"这件事没那么复杂"。

全文的逻辑线是：**痛点（政府需要 AI 但采购合规难）→ 解决方案（基于商业版的合规产品）→ 为什么可信（FedRAMP High、审计机制、双人审批）→ 如何落地（简化合同关系、直接申请接入）**。结尾的回答消除了最后一个顾虑——采购复杂度，从而完成从"这东西好吗"到"我可以开始了吗"的转化。
