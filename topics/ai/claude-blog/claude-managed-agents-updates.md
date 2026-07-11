# Claude Managed Agents 新功能：自托管沙箱与 MCP 隧道

> 原文: https://claude.com/blog/claude-managed-agents-updates
> 日期: May 19, 2026
> 分类: Product announcements
> 产品: Claude Platform

---

## 文章在讲什么

这篇文章是 Anthropic 官方发布的产品公告，介绍了 Claude Managed Agents（托管代理）的两项新能力：**自托管沙箱（self-hosted sandboxes）** 和 **MCP 隧道（MCP tunnels）**。

核心解决的问题是：**如何让 AI 代理在保持强大能力的同时，完全运行在企业自己的基础设施和安全边界内？**

在此之前，Claude Managed Agents 依赖 Anthropic 提供的默认执行环境。这次更新允许用户把代理的「工具执行」部分放到自己控制的沙箱中，同时通过 MCP 隧道访问内网中的私有服务，而无需把这些服务暴露到公网。

---

## 原文结构地图

| 部分 | 作用 |
|------|------|
| 开篇概览 | 宣布两项新功能，点明核心价值：控制权 + 安全性 |
| Keep agent execution within your perimeter | 解释自托管沙箱的原理与优势 |
| Choose your sandbox client | 列举四家合作供应商，各自定位不同 |
| Connect to services within your private network | 讲解 MCP 隧道的机制与价值 |
| 用户案例引用 | 4 家企业负责人引言，佐证功能实用性 |
| Getting started | 给出上手指引和文档链接 |

---

## 核心概念讲解

### Claude Managed Agents 是什么？

Managed Agents 是 Anthropic 在 Claude Platform 上提供的云端代理服务。简单理解，它帮你在云端运行一个 AI 代理，能够自主执行多步骤任务（调用工具、读写文件、搜索信息等）。

之前这套系统的「工具执行」环节在 Anthropic 的基础设施上运行。现在有了**自托管沙箱**，用户可以把执行环境搬到自己的地盘。

### 什么是沙箱（Sandbox）？

沙箱是一种隔离执行环境——代理在沙箱里运行代码、操作文件、调用工具，但这些操作被限制在沙箱内部，不会直接影响你的生产系统。

**关键点**：Managed Agents 的架构分为两部分：
- **Agent Loop（代理循环）**：负责「思考→决策→调用工具」的编排逻辑，仍留在 Anthropic 端
- **工具执行（Tool Execution）**：实际运行代码、访问文件的环节，可以移到你控制的沙箱中

### 什么是 MCP（Model Context Protocol）？

MCP 是一个开放协议，定义了 AI 模型如何与外部工具、数据源交互。可以类比为「AI 世界的 USB 接口」——有了统一协议，不同的 AI 系统可以连接各种工具和服务，而不需要为每个组合单独开发。

### 什么是 MCP 隧道（MCP Tunnels）？

MCP 隧道的核心创新是：**让内网中的 MCP 服务器被外网代理访问，但不需要在防火墙上开放端口。**

实现方式是：你部署一个轻量网关（gateway），它建立**从内网到云端的单向出站连接**，代理通过这条隧道访问内网资源。流量全程加密，无需公网暴露。

---

## 文章主体讲解

### 开篇

这一节讲什么？

开门见山宣布两项新功能：自托管沙箱和 MCP 隧道。强调共同的核心价值——**代理运行在你控制的安全边界内**。

为什么重要？

企业级 AI 应用最大的顾虑之一就是数据安全。把执行环境放在自己基础设施上是刚需。

关键点：
- 沙箱可以跑在自己的服务器上，也可以用第三方托管服务商
- 两个功能的状态不同：自托管沙箱是公开 beta，MCP 隧道是研究预览（需申请访问）

---

### 自托管沙箱的价值

这一节讲什么？

解释为什么需要自托管沙箱，以及它解决了哪些具体问题。

为什么重要？

这是功能的核心卖点——把「控制权」还给企业，同时保留云端代理的可靠性。

关键点：
- **文件不离开你的环境**：代码仓库、敏感文件都在你的边界内
- **网络策略和审计已就位**：不需要重新搭建安全体系
- **计算资源可定制**：可以按任务需求分配 CPU、内存，支持长时间构建或图像生成等重计算任务
- **安全边界清晰**：Anthropic 负责「大脑」（编排逻辑），你负责「四肢」（工具执行）

---

### 四家沙箱供应商对比

这一节讲什么？

列出四个支持自托管沙箱的合作供应商，解释每家的技术特点和使用场景。

为什么重要？

不同供应商定位不同，用户需要了解差异才能选对方案。

关键点：

| 供应商 | 核心技术 | 适合场景 |
|--------|----------|----------|
| **Cloudflare** | microVM + isolates（轻量隔离）| 需要大规模扩展、精细控制出站流量的场景 |
| **Daytona** | 全功能可组合计算机，有状态、长生命周期 | 需要 SSH 访问、长时间运行、可暂停恢复的任务 |
| **Modal** | 共享 Modal 的函数/存储/网络原语，有自定义容器运行时 | 已有 Modal 工作流的团队，需要快速启动和 GPU 资源 |
| **Vercel** | VM 安全 + VPC 对等 + 毫秒级启动 | 已在 Vercel 生态、需要快速部署的企业 |

文中还有用户案例：
- **Amplitude** 用 Cloudflare + Managed Agents 做设计代理（Design Agent）
- **Clay** 用 Daytona 做 GTM 工程代理 Sculptor
- **Rogo**（金融 AI 平台）用 Vercel 处理专有数据
- **Modal** 自己的客户两天就上线了可用版本

---

### MCP 隧道的机制

这一节讲什么？

解释 MCP 隧道如何实现「访问内网服务但不暴露公网」。

为什么重要？

这是安全敏感型企业最关心的能力——代理可以调用内网数据库、私有 API、知识库，但攻击面没有扩大。

关键点：
- **单向出站连接**：网关从内网主动连接云端，不需要防火墙开放入站端口
- **无需公网端点**：私有服务完全在内网
- **端到端加密**：传输过程安全
- **统一入口**：通过一个轻量网关连接多个内部 MCP 服务器

管理方式：通过 Claude Console 的工作区设置，由组织管理员配置。

---

### 用户案例（引用）

这一节讲什么？

四位企业负责人（Ryan Chang、Sai Yandapalli、Will Newton、Andy Fang）讲述实际使用体验。

为什么重要？

真实用户的反馈比功能列表更有说服力。几个值得注意的共同点：
- 上手快（两天、一周内出成果）
- 控制感强（文件系统、凭证、运行时都可配置）
- 不用自己造轮子（避免 hand-rolling extra complexity）

---

### Getting Started

这一节讲什么？

给出上手路径：文档、cookbook（配置指南）、Claude Console。

为什么重要？

功能再好，不会用就白搭。这里提供了明确的下一步行动指引。

关键点：
- 自托管沙箱 → 公开 beta，直接可用
- MCP 隧道 → 研究预览，需申请访问

---

## 关键对比表

| 维度 | 默认 Managed Agents | 自托管沙箱 |
|------|---------------------|------------|
| 执行环境 | Anthropic 基础设施 | 你选择的基础设施（自有或托管商） |
| 文件位置 | 可能离开你的边界 | 不离开你的边界 |
| 网络控制 | 受限于平台策略 | 完全在你控制下 |
| 资源定制 | 固定配置 | 按需配置 CPU/内存/GPU |
| 安全审计 | 依赖平台日志 | 可复用现有审计体系 |

---

## 关键句短摘译

1. **"Both the sandbox where an agent executes tools and the services it reaches run within the established boundaries of your enterprise."**

   *代理执行工具的沙箱和它访问的服务都运行在你企业的既定边界内。*

   为什么重要？这是整篇文章的核心承诺——安全边界不突破。

2. **"The agent loop that handles orchestration, context management, and error recovery stays on Anthropic's infrastructure, while tool execution moves to your own configured environment."**

   *负责编排、上下文管理和错误恢复的代理循环留在 Anthropic 基础设施上，而工具执行移到你配置的环境中。*

   为什么重要？澄清了架构划分——Anthropic 做「大脑」，你做「四肢」。

3. **"A lightweight gateway you deploy makes a single outbound connection, no inbound firewall rules, no public endpoints, and traffic encrypted end to end."**

   *你部署的轻量网关建立一条出站连接，无需入站防火墙规则、无公网端点、流量端到端加密。*

   为什么重要？这是 MCP 隧道的安全设计精髓——只出不进。

4. **"Managed Agents handles the model, tools, and session state, while the Vercel Sandbox firewall injects credentials at the network boundary so they never enter the sandbox."**

   *Managed Agents 负责模型、工具和会话状态，而 Vercel Sandbox 防火墙在网络边界注入凭证，使凭证永不进入沙箱。*

   为什么重要？说明了凭证管理的最佳实践。

5. **"We had a working version up in under a week, raising reliability for our customers."**

   *不到一周就上线了可用版本，提升了客户的可靠性。*

   为什么重要？说明这套方案不是玩具，企业级可用。

6. **"This gives us the option to leverage best-in-class infrastructure while we focus on what compounds for a financial AI platform."**

   *这让我们能够利用最佳基础设施，同时专注于金融 AI 平台真正有复利效应的事情。*

   为什么重要？点出企业选择这类方案的战略考量——把基础设施交给专业方，自己聚焦核心产品。

---

## 术语表

| 英文术语 | 中文解释 |
|----------|----------|
| Managed Agents | Anthropic 提供的云端 AI 代理托管服务 |
| Sandbox | 隔离执行环境，限制代码/工具操作的影响范围 |
| Self-hosted sandboxes | 用户自行配置或选择的沙箱环境，非平台默认 |
| MCP (Model Context Protocol) | 连接 AI 模型与外部工具/数据源的开放协议 |
| MCP tunnels | 通过单向加密隧道让外网代理访问内网 MCP 服务器的技术 |
| Agent Loop | 代理的「思考→决策→执行」循环，负责编排和上下文管理 |
| Tool Execution | 代理实际执行代码、调用 API 等工具操作的环节 |
| VPC peering | 虚拟私有云对等连接，让不同云账户的网络互通 |
| Isolates | 轻量级隔离技术，比完整虚拟机启动更快、资源占用更少 |

---

## 文章结尾怎么收束

文章在结尾处从「功能介绍」回到了「行动指引」，形成了一个完整的闭合：

- **起点**：企业需要 AI 代理能力，但无法接受数据离开自己的边界
- **承接**：Managed Agents 提供了「分而治之」的架构——编排留在云端，执行放在你的地盘
- **落点**：自托管沙箱和 MCP 隧道已经可用/可申请，详细文档和配置指南已就绪

作者没有在这里展开技术细节或未来路线图，而是用一句务实的收尾告诉读者：**你现在就可以开始**。这种「问题→方案→行动」的线性结构，是产品公告类文章的标准范式，逻辑自洽，信息密度适中。
