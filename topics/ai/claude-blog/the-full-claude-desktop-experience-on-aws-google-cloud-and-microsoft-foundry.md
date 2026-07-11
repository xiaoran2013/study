# 完整 Claude Desktop 体验：在 AWS、Google Cloud 和 Microsoft Foundry 上部署

> 原文: https://claude.com/blog/the-full-claude-desktop-experience-on-aws-google-cloud-and-microsoft-foundry
> 日期: 2025-06-22
> 分类: Enterprise AI
> 产品: Claude Enterprise

---

## 文章在讲什么

这篇文章是 Anthropic 官方发布的企业级产品公告，面向 IT 管理员和决策者。

**背景问题**：过去，企业客户通过 AWS、Google Cloud 或 Microsoft Foundry 使用 Claude Desktop 时，只能访问 Claude Cowork 和 Claude Code 两个功能，缺少完整的桌面体验。同时，企业在部署 AI 工具时面临数据安全、合规要求和统一管理的挑战。

**作者想解决的核心问题**：如何让企业 IT 团队能够在自己的云环境中，一站式部署完整的 Claude Desktop（聊天、Cowork、Code 三个功能），同时满足企业的安全策略、身份认证和数据管控需求。

**整体思路**：文章先介绍完整功能集的可用性，再详细说明企业级部署的各项控制能力，最后提供上手指南，形成"功能介绍→能力说明→行动指引"的逻辑闭环。

---

## 原文结构地图

| 章节 | 标题 | 作用 |
|------|------|------|
| 1 | 引言段落 | 说明现在三大云平台都支持完整 Claude Desktop 功能，点明核心价值：推理在自有环境、数据本地存储 |
| 2 | One surface for the entire organization | 介绍三个功能（Chat、Cowork、Code）的定位差异，以及按角色分配权限的机制 |
| 3 | Deployment controls | 核心章节，详细说明企业部署的各项控制能力：身份认证、应用分发、预验证、数据连接器 |
| 4 | 客户证言 | 用 Hanwha Solutions 的实际案例增强可信度 |
| 5 | Getting started | 提供管理员的行动入口（部署指南、联系销售团队） |

---

## 核心概念讲解

### Claude Desktop 的三个功能界面

文章首次明确区分了 Claude Desktop 中的三个独立功能：

| 功能 | 定位 | 适用角色 | 核心用途 |
|------|------|----------|----------|
| **Chat** | 快速问答 | 所有员工 | 即时获得答案、梳理问题思路 |
| **Claude Cowork** | 委托型工作 | 非技术团队 | 让 AI 研究资料、处理文件、生成交付物，人工接管结果 |
| **Claude Code** | 智能编码 | 工程师 | 在非终端环境中进行 agentic 编程 |

**理解关键**：这三个功能并非层层递进，而是并列的不同"界面"。企业可以根据角色分发不同功能的访问权限。

### 企业部署的核心安全模型

文章反复强调一个设计理念：**推理和数据的控制权留在企业侧**。具体表现为：

1. **推理位置**：模型推理运行在企业选择的云区域（如 AWS us-east-1），不经过第三方数据中心
2. **对话历史**：存储在用户本地设备，而非云端
3. **数据连接器**：Claude 访问 Microsoft 365 等数据源时，通过企业自己的 Entra 应用建立连接
4. **遥测数据**：Anthropic 只接收聚合后的遥测信息，不接触原始对话内容

### 策略密钥（Policy Key）

这是管理多个功能界面的核心机制。每个功能（Chat、Cowork、Code）拥有独立的策略密钥，企业可以：

- 为不同部门配置不同功能权限
- 先小范围试点，再逐步扩大
- 统一配置"硬拒绝"规则（如禁止访问特定内容），该规则对所有界面生效

---

## 文章主体讲解

### 引言段落：完整功能集现已可用

**这一节讲什么**：开篇直接告知读者重大更新——通过三大云平台，现在可以使用完整的 Claude Desktop 功能集。同时点出企业最关心的三个卖点：推理在自有环境、统一部署能力、数据本地存储。

**为什么重要**：企业决策者最关心的是"能不能用"和"安不安全"。这句话用最简洁的方式同时回答了两个问题。

**关键点**：
- 三大云平台（AWS、GCP、Azure Foundry）现已对等支持完整功能
- 推理发生在企业配置的云区域
- 对话历史本地存储，主动声明数据主权

---

### One surface for the entire organization：按角色分发不同功能

**这一节讲什么**：详细说明三个功能的差异化定位，以及如何通过策略密钥实现"千人千面"的企业部署——不同角色看到不同功能。

**为什么重要**：企业不希望所有员工都能做所有事。文章给出了清晰的功能定位，让 IT 管理员能够理性地做权限规划，而不是一刀切地"全员开放"或"全员限制"。

**关键点**：
- Chat 是"快速问答"，面向日常信息检索
- Cowork 是"委托型助手"，人告诉 AI 要什么，AI 完成工作后交回结果，适合需要处理文档、汇总信息的业务人员
- Code 是"非终端编程环境"，让工程师在桌面应用中完成 agentic 编码任务
- 每个功能独立密钥，支持灰度发布和渐进式推广

---

### Deployment controls：企业级部署能力的全景展示

这是文章最核心的章节，从四个维度展开：

#### 身份认证：像普通工作应用一样登录

**讲什么**：员工使用企业现有账号体系登录 Claude Desktop，无需单独创建账户或管理共享密钥。

**关键点**：
- 支持的 Identity Provider：AWS IAM Identity Center、Google Workforce Identity Federation、Microsoft Entra ID、Okta 等标准 OIDC 提供商
- 消除"共享密钥"模式：每个用户用自己的企业账号，密钥轮转不涉及终端用户
- 终端设备上不存储云凭证

#### 应用分发：融入现有 MDM 体系

**讲什么**：Claude Desktop 可以通过企业现有的移动设备管理（MDM）工具进行分发和策略管理。

**关键点**：
- 提供策略模板导出功能
- 支持 Intune（微软）、GPO（组策略）、Jamf（苹果设备）
- 提供离线安装包，适用于物理隔离（air-gapped）环境

#### 预验证：上线前的安全门禁

**讲什么**：在向全员推送之前，IT 团队可以测试每个连接器、验证模型可用性、确认网络连通性。

**关键点**：
- 内置"模型守卫"（Model Guard）机制：即使配置错误，也确保流量路由到 Claude，不会意外走其他模型
- 支持 GovCloud 环境

#### 数据连接器：让 AI 访问工作数据

**讲什么**：Claude Desktop 可以通过 Microsoft 365 连接器访问企业邮箱和文档。

**关键点**：
- 通过企业自己的 Entra 应用建立连接，而非共享第三方凭证
- 支持租户白名单配置
- Beta 阶段支持 GCC High/DoD 端点（美国政府高安全级别云环境）
- 提供本地连接器选项，数据流仅在设备和 Microsoft 之间发生，满足最严格的数据驻留要求

---

### 客户证言：Hanwha Solutions 的实践

**这一节讲什么**：引用一家韩国企业（Hanwha Solutions）的 Analytics/AI 团队负责人证言，佐证产品价值。

**为什么重要**：企业采购决策需要同行业参考。Hanwha 强调的核心价值是"快速部署"和"利用现有基础设施"，正是文章一直在传递的信息。

**关键引用点**：
- "通过现有云环境快速推出 Claude Desktop，无需单独签订供应商合同"
- "借助自己的 LLM Gateway，一个团队就能部署给全球数百名用户"
- "无需大规模基础设施搭建"

---

### Getting started：行动指引

**这一节讲什么**：为管理员提供两条上手路径：自助部署指南，或联系客户团队获取规划支持。

**为什么重要**：文章结尾需要将读者从"了解"导向"行动"。两条路径覆盖了不同决策风格的管理员——喜欢自助的走文档路线，需要协助的有人对接。

---

## 关键对比表

### 三种数据连接器模式对比

| 模式 | 数据流向 | 适用场景 | 合规等级 |
|------|----------|----------|----------|
| 标准 M365 连接器 | 设备 → 企业 Entra 应用 → Microsoft 365 | 常规企业使用 | 标准企业合规 |
| GCC High/DoD 连接器 | 同上，但使用政府云端点 | 美国联邦机构 | FedRAMP High |
| 本地连接器 | 设备 ↔ Microsoft（不经过第三方） | 严格数据驻留要求 | 最高数据主权 |

### 三大云平台能力对照

| 能力 | AWS | Google Cloud | Microsoft Foundry |
|------|-----|--------------|-------------------|
| 推理环境 | ✅ 自己的云区域 | ✅ 自己的云区域 | ✅ 自己的云区域 |
| 身份认证 | IAM Identity Center | Workforce Identity Federation | Entra ID / Okta |
| 应用分发 | Intune / MDM | Intune / MDM | Intune / GPO / Jamf |
| GovCloud 支持 | ✅ | ✅ | ✅（含 GCC High/DoD） |

---

## 关键句短摘译

1. **"Inference runs on your cloud in the regions you configure"**
   - 译文：推理在你配置的云区域中运行
   - 重要性：明确数据处理位置，回应企业数据主权关切

2. **"Conversation history is stored locally"**
   - 译文：对话历史存储在本地
   - 重要性：强调隐私保护设计，对敏感行业尤为关键

3. **"One deployment covers every role, and each surface has its own policy key"**
   - 译文：一次部署覆盖所有角色，每个界面有独立策略密钥
   - 重要性：概括了产品的核心管理架构

4. **"No shared keys to rotate, no cloud credentials on end-user machines"**
   - 译文：无需轮转共享密钥，终端设备上不存云凭证
   - 重要性：点出与传统方案相比的安全优势

5. **"A model guard keeps routing on Claude, including in GovCloud, even if a setting is misconfigured"**
   - 译文：模型守卫确保即使配置错误，流量仍路由到 Claude
   - 重要性：说明内置的防误配置机制，降低运维风险

6. **"Claude researches across approved sources, works with the files already on the device and builds the deliverable"**
   - 译文：Claude 在批准的数据源中研究、处理设备上已有文件并构建交付物
   - 重要性：清晰定义 Cowork 功能的行为模式

7. **"An offline installer covers air-gapped environments"**
   - 译文：离线安装包覆盖物理隔离环境
   - 重要性：覆盖最高安全等级企业的部署需求

8. **"Your hard-deny rules apply across every tab"**
   - 译文：硬拒绝规则在所有标签页生效
   - 重要性：说明策略的一致性 enforcement

---

## 术语表

| 英文术语 | 中文含义 | 文中语境 |
|----------|----------|----------|
| **Inference** | 推理 | AI 模型处理输入并生成输出的计算过程 |
| **Claude Cowork** | Claude 协作者 | 一种委托型 AI 功能，AI 自主完成多步骤任务后交回结果 |
| **Claude Code** | Claude 代码助手 | 面向工程师的 agentic 编程功能，可在非终端环境运行 |
| **SSO (Single Sign-On)** | 单点登录 | 使用一套凭证访问多个应用 |
| **MDM (Mobile Device Management)** | 移动设备管理 | 企业统一管理终端设备的系统 |
| **Policy Key** | 策略密钥 | 控制不同功能界面访问权限的配置单元 |
| **Air-gapped** | 物理隔离 | 不连接互联网的封闭网络环境 |
| **OIDC (OpenID Connect)** | 开放身份连接协议 | 基于 OAuth 2.0 的身份认证标准 |
| **Model Guard** | 模型守卫 | 防止流量意外路由到非预期模型的保护机制 |
| **GovCloud** | 政府云 | 面向美国政府机构的专属云环境（含 FedRAMP 合规要求） |
| **GCC High/DoD** | 政府云高区/国防部端点 | 美国联邦政府最高安全级别的云部署 |
| **Entra ID** | 微软身份服务 | 原 Azure Active Directory，现名 Microsoft Entra ID |
| **Tenant allowlisting** | 租户白名单 | 只允许特定租户访问的配置 |

---

## 文章结尾怎么收束

文章以"Getting started"作为结尾，提供两条清晰的行动路径：

1. **自助路线**：访问部署指南，学习 SSO 配置、策略模板使用和预发布验证流程
2. **协助路线**：联系客户团队，获得个性化的部署规划支持

**逻辑闭合**：全文开头承诺"在自有云环境中部署完整 Claude Desktop"，结尾则告诉管理员"如何开始"。首尾呼应，形成完整的信息闭环。

**隐性信息**：文章没有使用总结性的"综上所述"，而是用行动指引收束，传递出一种"我们已经准备好了，你随时可以开始"的务实姿态，符合企业级产品公告的惯常风格。
