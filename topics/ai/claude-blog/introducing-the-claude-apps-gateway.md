# Claude Apps Gateway 简介：为 Amazon Bedrock 和 Google Cloud 打造的企业级控制平面

> 原文: https://claude.com/blog/introducing-the-claude-apps-gateway  
> 日期: Jun 29, 2026  
> 分类: Product announcements  
> 产品: Claude Code

---

## 文章在讲什么

这是一篇 **Anthropic 的产品发布公告**，宣布推出 **Claude Apps Gateway**——一个面向企业的自托管控制平面。

**背景问题**：在 Claude Apps Gateway 出现之前，如果企业想在自己的云基础设施（Amazon Bedrock 或 Google Cloud）上运行 Claude Code，通常面临以下困扰：

- 需要为每个开发者单独配置云凭证（credential）
- 每次政策调整都要手动推送到每台开发者的电脑
- 想看每个开发者的使用成本，需要额外搭建统计工具
- 登录方式难以与企业已有的身份系统集成

**作者想解决的核问题**：把这些分散的、难以管理的配置工作，**统一收拢到一个中心化的网关**里。企业只需要维护这一个网关，所有开发者都通过它来使用 Claude Code。

---

## 原文结构地图

| 章节 | 作用 |
|------|------|
| 开篇介绍 | 用一句话说明网关是什么 + 核心价值主张（SSO、策略管控、成本分摊等） |
| Deploying the gateway | 介绍网关的部署方式和技术架构——单容器 + PostgreSQL |
| How the gateway works | 详细拆解网关处理的五大功能模块 |
| Getting started | 给出实操步骤，帮助读者快速落地 |
| （无正式结语） | 公告类文章以"立即可用"收尾，逻辑闭合点是"你现在就可以部署" |

---

## 核心概念讲解

### 1. Gateway（网关）是什么？

**Gateway 在这里不是一个抽象概念**，而是一个实实在在运行的软件。它是一个"中间层"，夹在开发者的 Claude Code 客户端和企业使用的 AI 推理服务（如 Claude API、亚马逊 Bedrock、谷歌 Cloud）之间。

它的核心角色是：**所有请求和认证先经过网关，网关再转发到后端服务。**

这样的设计带来的直接好处是：企业只需要管好这一个"门"，就能控制所有人的访问。

### 2. 为什么叫"stateless container"（无状态容器）？

传统的企业软件需要复杂的安装和状态管理。这里的 gateway 被设计成 **stateless**（无状态），意思是：

- 网关本身**不存储业务数据**（会话信息、用户数据等）
- 它只负责处理请求的路由和转发
- 真正的数据（如用户会话、策略配置）存储在**独立的 PostgreSQL 数据库**里

这样设计的好处是：**部署简单、扩展容易、故障恢复快**——容器可以随时重启或水平扩展，不用担心状态丢失。

### 3. OIDC（OpenID Connect）是什么？

**OIDC 是一种身份认证协议**。它的作用是让网关能够"认得"企业里已经存在的用户系统。

常见的 OIDC 提供商包括：

- Google Workspace
- Microsoft Entra ID（原 Azure AD）
- Okta

**工作原理简化理解**：

1. 开发者打开 Claude Code，尝试登录
2. 网关把开发者重定向到企业的 IdP（身份提供商）
3. 开发者用公司账号密码登录（SSO）
4. IdP 返回一个**短期的令牌（short-lived token）**给网关
5. 网关验证令牌后，允许开发者使用 Claude Code

**关键点**：开发者电脑上不再需要存储长期的密钥或凭证，只有这个临时的会话令牌。

### 4. Managed Settings（托管设置）

这是网关实现**集中管控**的核心机制。

- 管理员在网关服务器上**统一配置策略**（比如允许使用哪些模型、默认的参数设置等）
- 开发者每次登录 Claude Code 时，网关把策略**下发**给客户端
- 客户端在每次请求时，网关**强制执行**这些策略

这样，企业不需要手动去每台电脑上改配置，策略变更是即时、全局生效的。

### 5. Per-user Cost Attribution（按用户成本归属）

这是企业最关心的功能之一：如何知道**谁用了多少资源、花了多少钱**？

- 每次 Claude Code 发起请求时，客户端会给请求打上**用户标识**
- 网关收集这些使用数据，通过 **OTLP 协议** 发送给企业自己运行的收集器
- 企业可以在自己的监控系统里，按用户、按团队查看和分析成本

**关键点**：数据保存在企业自己的网络里，按照企业自己的数据保留策略存储。

### 6. Spend Caps（消费上限）

网关允许设置**每日、每周、每月的费用上限**，并且可以按组织、团队或个人级别来配置。

这是一种**预防性控制**：避免某个用户或团队在某个周期内消耗超出预算的资源。

---

## 文章主体讲解

### 第一节：Deploying the gateway（网关的部署）

**这一节讲什么**：介绍 Claude Apps Gateway 的技术架构和部署方式。

**为什么重要**：企业在采用一个新工具之前，必须了解它如何与现有基础设施集成。这一节回答了"这东西装在哪里""谁来维护"的问题。

**关键点**：

1. **单容器部署**：整个网关打包成一个 Docker 容器，运行在 Linux 系统上
2. **依赖外部 PostgreSQL**：网关本身不管理数据，所有持久化数据存在 PostgreSQL 里
3. **开发者侧零额外安装**：开发者电脑上安装的 **claude binary**（即 Claude Code CLI）本身就包含了网关客户端功能，不需要单独再装什么
4. **运维简单**：加入新开发者 = 在 IdP 里添加用户；移除开发者 = 在 IdP 里删除用户

这节的逻辑是：**降低企业的运维负担，让管理员只维护一个组件。**

---

### 第二节：How the gateway works（网关的工作原理）

**这一节讲什么**：详细拆解网关处理的五个核心功能模块。

**为什么重要**：这一节是整篇文章的**技术核心**。作者需要让读者相信这个网关能真正满足企业需求，而不是一个简单的代理工具。

**关键点（五个功能模块）**：

| 功能 | 作用 | 技术细节 |
|------|------|----------|
| **Identity（身份）** | 让开发者用公司账号登录 | 作为 OIDC Relying Party，签发短期会话令牌，无长期密钥在开发者机器上 |
| **Policy（策略）** | 集中管控客户端行为 | 服务器端定义一次，客户端签入时接收，每次请求时网关强制执行 |
| **Telemetry（遥测）** | 收集使用数据 | 客户端给每次请求打标签，网关通过 OTLP 转发到企业自己的收集器 |
| **Routing（路由）** | 决定请求发往哪里 | 网关持有上游凭证，可路由到 Claude API、Bedrock 或 Google Cloud，支持故障转移 |
| **Spend Caps（消费上限）** | 控制成本 | 支持日/周/月三级上限，可按组织/组/用户粒度配置 |

**一个值得注意的细节**：网关**默认不向 Anthropic 发送任何推理流量或使用数据**（除非你配置使用 Claude API）。这解决了企业最大的隐私顾虑——**数据主权**掌握在企业自己手里。

---

### 第三节：Getting started（快速上手）

**这一节讲什么**：给出两个实操步骤，帮助读者立即行动。

**为什么重要**：公告类文章的结尾通常要么是愿景，要么是行动号召。这里选择的是**行动号召**，因为产品已经可用。

**关键点**：

1. **部署网关**：下载 CLI → 配置 gateway.yaml → 在 IdP 里注册一个 OIDC 应用
2. **推送到客户端**：在客户端的 managed-settings.json 里配置 forceLoginMethod 和 forceLoginGatewayUrl

这节的逻辑是：给你一条**最短路径**，让你今天就能跑起来。

---

## 关键对比表

本文中没有系统性的对比表（这不是一篇评测文章），但有一个**隐含的对比**值得整理出来：

### 企业使用 Claude Code 的两种方式对比

| 维度 | 无网关（传统方式） | 有网关（Claude Apps Gateway） |
|------|-------------------|------------------------------|
| 凭证管理 | 每个开发者一个云凭证 | 一个上游凭证存在网关 |
| 政策配置 | 手动推送到每台电脑 | 服务器端一次配置，即时生效 |
| 身份认证 | 各用各的账号 | 企业 SSO，统一身份管理 |
| 成本统计 | 需额外搭建工具 | 网关内置，按用户自动归属 |
| 数据隐私 | 流量可能经过多方 | 流量留在企业网络（除非用 Claude API） |
| 运维复杂度 | 高（分散管理） | 低（集中管理） |

这个对比的隐含意思是：**网关把所有分散的运维痛点一次性解决了。**

---

## 关键句短摘译

1. **"Previously, running Claude Code on these platforms has meant provisioning a cloud credential per developer..."**

   - 原文意思：在过去，在这些平台上运行 Claude Code 意味着要为每个开发者单独配置云凭证……
   - 重要性：这句话直接点出企业面临的**核心痛点**，是整篇文章的问题起点。

2. **"The gateway is a self-hosted control plane that gives you corporate SSO login, centrally enforced policy, role-based access, and per-user cost attribution."**

   - 原文意思：网关是一个自托管的控制平面，提供企业 SSO 登录、集中执行的策略、基于角色的访问和按用户计费。
   - 重要性：这是整篇文章的**价值主张概括**，四个功能点覆盖了企业最关心的身份、安全、成本、控制。

3. **"No long-lived secrets sit on developer machines."**

   - 原文意思：开发者机器上不存放任何长期密钥。
   - 重要性：这是安全设计的核心原则——**减少攻击面**，即使开发者的电脑被入侵，也没有长期凭证可以被窃取。

4. **"The gateway enforces it on every request."**

   - 原文意思：网关在每次请求时强制执行策略。
   - 重要性：说明策略管控是**实时且无处不在的**，不是只在登录时检查一次。

5. **"The gateway does not send inference traffic or usage data to Anthropic unless you configure it to use the Claude API."**

   - 原文意思：除非你配置使用 Claude API，否则网关不会向 Anthropic 发送推理流量或使用数据。
   - 重要性：这句话直接回应了**企业级客户最大的数据主权顾虑**。

6. **"Offboarding means removing them."**

   - 原文意思：移除开发者只需要在 IdP 里删除他们。
   - 重要性：强调运维的**简洁性**——人员变动的处理和入职一样简单。

7. **"We're also publishing the protocol the gateway uses, so other gateway developers can implement the same features."**

   - 原文意思：我们会公开网关使用的协议，这样其他网关开发者也可以实现相同的功能。
   - 重要性：这是一个**生态友好的设计决策**，让第三方可以基于这个协议开发兼容实现。

---

## 术语表

| 英文术语 | 解释 |
|----------|------|
| **Claude Apps Gateway** | 企业自托管的控制平面，连接 Claude Code 与 Amazon Bedrock 或 Google Cloud，提供身份认证、策略管控、成本统计等功能 |
| **Stateless Container** | 无状态容器——容器本身不存储业务数据，处理完请求后不保留状态，便于扩展和恢复 |
| **SSO (Single Sign-On)** | 单点登录——用户用一组凭证登录后，可以访问多个系统，无需重复认证 |
| **OIDC (OpenID Connect)** | 基于 OAuth 2.0 的身份认证协议，允许一个服务验证用户的身份 |
| **IdP (Identity Provider)** | 身份提供商——负责管理用户账号和认证的服务（如 Okta、Microsoft Entra ID） |
| **Relying Party** | OIDC 中的依赖方，即使用 IdP 进行身份验证的应用（这里是网关） |
| **Managed Settings** | 托管设置——由管理员在服务器端统一定义，推送给所有客户端的策略配置 |
| **OTLP (OpenTelemetry Protocol)** | OpenTelemetry 的传输协议，用于将遥测数据（指标、日志、追踪）从客户端发送到收集器 |
| **Per-user Cost Attribution** | 按用户成本归属——将 AI 资源消耗的费用精确归属到具体的使用者 |
| **Spend Caps** | 消费上限——对每日/每周/每月的费用设置硬性限制 |
| **Upstream Credential** | 上游凭证——存储在网关中的，用于访问实际 AI 推理服务（Claude API、Bedrock 等）的密钥 |
| **Failover** | 故障转移——当主服务不可用时，自动切换到备用服务 |

---

## 文章结尾怎么收束

这篇文章**没有传统的结尾段落**。作为一篇产品发布公告（Product announcements），它在"Getting started"一节给出了具体的部署步骤和文档链接后，就自然结束了。

这种结尾方式在产品发布类文章中很常见——**逻辑闭合点是"现在就可以用"**。作者不试图在这里做升华或展望，而是把读者直接引导到行动层面：

> "The gateway is available now."

简短有力，把决策权交给读者：你现在就可以开始部署了。

全文的逻辑线索是：

```
问题：企业在多云环境下管理 Claude Code 很麻烦
       ↓
解决方案：用一个中心化的网关统一管理
       ↓
技术实现：单容器 + PostgreSQL + OIDC 集成
       ↓
具体功能：身份、策略、遥测、路由、消费上限
       ↓
行动号召：现在就部署
```

这个结构非常清晰：**提出问题 → 给出方案 → 证明可行 → 引导行动**。
