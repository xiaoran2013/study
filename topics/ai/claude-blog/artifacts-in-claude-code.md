# Claude Code 新增 Artifacts 功能

> 原文: https://claude.com/blog/artifacts-in-claude-code
> 日期: Jun 18, 2026
> 分类: Product announcements
> 产品: Claude Code

---

## 文章在讲什么

这是一篇**产品发布公告**，介绍 Claude Code 新增的 **Artifacts（产物）功能**。

作者想解决的核心问题是：在使用 Claude Code 执行复杂任务（如调查事故、重构服务、分析数据）的过程中，**工作进展和结果很难与团队成员实时共享**。传统做法需要大量沟通来同步状态，而 Artifacts 功能让 Claude Code 可以把工作成果自动转换成**可分享、可更新的网页**，团队成员打开同一个链接就能看到最新进展，省去了反复"汇报 agent 发现了什么"的沟通成本。

文章的核心逻辑是：**先讲功能是什么，再讲它为什么有用，然后介绍使用场景，最后说明如何开始**。

---

## 原文结构地图

| 章节 | 作用 |
|------|------|
| 开头导语 | 用一句话概括功能：用 session 上下文构建实时可分享的页面 |
| Built on the context from your session | 解释技术原理——Artifacts 依赖什么数据 |
| Live pages that update in place | 讲核心体验——实时更新、版本历史、画廊管理 |
| 用法举例段落 | 用"事故调查"场景展示实际工作流 |
| Private to your organization | 说明隐私和安全机制 |
| Getting started | 按角色给出具体提示词示例 |
| Availability | 说明可用范围和入口 |

---

## 核心概念讲解

### 什么是 Artifact

**Artifact（产物）**是 Claude Code 把 session 工作自动生成的**网页**。这个网页不是静态截图，而是包含可交互元素（如下拉筛选、排序功能）的动态页面，可以是 PR 走查、仪表板、检查清单等不同形式。

关键理解：**Artifact 不是你手动创建的，而是 Claude Code 根据你的 session 上下文"生成"的**。你只需要说"给我建一个页面"，它就会从代码、连接器、对话历史中提取内容组装成网页。

### Session 上下文是什么

Claude Code 的 session（会话）包含三部分核心数据：

- **你的代码库**（codebase）
- **你连接的外部工具**（connectors），如监控工具、基础设施代码
- **对话本身**（conversation），即你与 Claude 的交互历史

Artifacts 的独特之处在于，它**不需要你额外配置数据源或搭建基础设施**，而是直接利用 session 中已经存在的信息。

### 分享机制

Artifacts 默认**仅对创建者可见**，需要主动分享才能让队友和组织内成员查看。发布后所有更新都在同一链接上自动同步，队友打开页面就能看到最新版本。

---

## 文章主体讲解

### 开头导语

**这一节讲什么：** 用一句话介绍 Artifacts 功能的核心价值。

**为什么重要：** 读者扫一眼就能知道这个功能是做什么的——把 Claude Code 的工作变成可分享的网页。

**关键点：** "live, shareable visual pages" 和 "update themselves as your session works" 这两个定语揭示了功能的两个本质特征：**实时更新** 和 **可分享**。

---

### Built on the context from your session

**这一节讲什么：** 解释 Artifacts 的数据来源和技术基础。

**为什么重要：** 这是 Artifacts 与普通截图或文档的根本区别——它能自动聚合来自多个来源的信息，不需要用户手动拼接。

**关键点：**

- Artifacts 聚合的是**代码、连接器数据、对话**三方面的信息
- 例子：一页事故报告可以同时包含"失败的测试"、"相关函数"、"监控数据中的错误峰值"、"调查推理过程"
- 核心理念：**你只管问"给我一个页面"，Claude Code 负责从现有上下文里拼出来**

---

### Live pages that update in place

**这一节讲什么：** 描述 Artifact 的使用体验——实时更新、版本管理、画廊视图。

**为什么重要：** 这一节回答了"分享之后怎么保持同步"的问题，是功能实用性的关键。

**关键点：**

- **原地刷新**：在浏览器中打开的页面会自动刷新，队友能看到你刚发布的内容
- **同一链接的版本迭代**：每次发布都是新版本，支持回溯
- **画廊**：集中管理和浏览所有 Artifact

---

### 用法举例段落（事故调查场景）

**这一节讲什么：** 用一个具体场景展示 Artifacts 的完整工作流。

**为什么重要：** 把抽象功能具象化，让读者"看见"它怎么用。**这是文章最生动的段落**。

**关键点：**

工程师在站会前启动事故调查 → Claude Code 分析日志后发布 Artifact（时间线、可疑提交、错误率图表）→ 工程师把链接分享给团队 → 站会期间 Claude Code 又发布了两个更新版本 → 所有人看的是**同一个视图、同样的上下文**，不需要工程师再做口头汇报。

**这句话点出了功能的核心价值：** "With artifacts, team members and stakeholders don't have to 'walk us through what the agent found' because they're all looking at the same view, with the same context."

---

### Private to your organization

**这一节讲什么：** 安全和权限控制。

**为什么重要：** 企业用户最关心数据能不能安全分享，这节打消顾虑。

**关键点：**

- 默认仅创建者可见，发布需主动操作
- 仅组织内认证成员可查看，**无法设为公开**
- 管理员可控制开关、设置角色权限、配置保留策略、通过合规 API 获取全组织可见性

---

### Getting started

**这一节讲什么：** 按不同角色给出提示词示例，帮助读者快速上手。

**为什么重要：** 这节是整篇文章的**实践转化部分**——作者知道读者看完功能介绍后最想知道"我能怎么用"，所以直接给出 8 个角色的具体请求方式。

**关键点：** 提示词模板的共同结构是：**"Build an artifact of [具体内容], [附加要求]"**。例如：
- 安全审计："Build an artifact of the auth findings from this review, each linked to the code."
- 工程经理："Build an artifact of what merged on my team this week from the PRs, grouped by project."

---

### Availability

**这一节讲什么：** 说明功能可用范围。

**为什么重要：** 读者需要知道自己能不能用。

**关键点：** 目前是 Beta 阶段，仅对 **Claude Team 和 Enterprise** 组织开放，通过 CLI 或桌面应用创建，浏览器可查看。

---

## 关键对比表

文章本身没有明确的分类表格，但可以把**使用 Artifact 前后**的工作方式做个对比，帮助理解价值：

| 维度 | 没有 Artifact | 有 Artifact |
|------|--------------|-------------|
| 共享进展 | 需要截图、写文档、口头汇报 | 生成链接直接分享 |
| 信息同步 | 每次更新都要重新发送 | 同一链接自动更新 |
| 信息来源 | 需要手动从多处拼凑 | 自动从 session 上下文聚合 |
| 查看体验 | 静态文档，需想象上下文 | 交互式页面，实时同步视图 |
| 版本管理 | 多个文档版本，难以追踪 | 同一链接有版本历史可回溯 |

---

## 关键句短摘译

1. **"Artifacts translate the work into a web page anyone can open and explore."**
   - 中文：Artifacts 把工作成果"翻译"成任何人都能打开和探索的网页。
   - 为什么重要：点明功能本质——不是输出报告文档，而是生成可交互的网页。

2. **"With artifacts, you don't need to wire up data sources or stand up infrastructure."**
   - 中文：有了 Artifacts，你不需要自己接线数据源或搭建基础设施。
   - 为什么重要：说明门槛低——数据已经在 session 里，你只管用。

3. **"The open page refreshes in place and teammates see the updates the moment they're published."**
   - 中文：打开的页面原地刷新，队友在发布瞬间就能看到更新。
   - 为什么重要：这是"实时协作"体验的技术保障。

4. **"They don't have to 'walk us through what the agent found' because they're all looking at the same view, with the same context."**
   - 中文：他们不需要"听我们讲 agent 发现了什么"，因为大家看的是同一个视图、同样的上下文。
   - 为什么重要：这是功能解决的核心痛点——减少沟通成本，保证信息一致。

5. **"Artifacts are viewable only by authenticated members of your org and cannot be made public."**
   - 中文：Artifact 仅对组织内已认证成员可见，且无法设为公开。
   - 为什么重要：明确了安全边界，企业用户可以放心使用。

6. **"You ask for a page, and Claude Code builds it from what already exists."**
   - 中文：你只要请求一个页面，Claude Code 就会从现有内容中构建它。
   - 为什么重要：一句话总结操作方式和使用哲学——零配置，按需生成。

---

## 术语表

| 英文术语 | 中文解释 |
|----------|----------|
| Artifact | 产物，本文中指 Claude Code 根据 session 上下文自动生成的交互式网页 |
| Session | 会话，指在 Claude Code 中进行的一次完整工作过程，包含代码、连接器和对话历史 |
| Connectors | 连接器，Claude Code 连接的外部数据源（如监控工具、IaC 配置） |
| Live pages | 实时页面，指会自动同步更新的网页 |
| Beta | 公测版，功能尚未正式发布，用户可以提前试用并反馈 |
| Claude Team / Enterprise | Claude 的团队版和企业版订阅计划 |
| On-call | 值班，指 SRE 或运维人员在非工作时间处理生产环境故障 |
| Postmortem | 事后分析报告，通常在事故处理完后撰写，分析根因和改进措施 |
| PR walkthrough | PR 走查，指带领团队通读代码变更评审的过程 |

---

## 文章结尾怎么收束

文章以 **"Get started today with Claude Code."** 和 **"Claude Code builds the page and gives you a link."** 收尾。

从结构上看，结尾是**闭合的**：

1. **开头承诺**：Claude Code 可以把工作变成可分享的实时网页
2. **中间论证**：从技术原理、使用体验、安全机制、使用场景逐一展开
3. **结尾行动**：直接告诉读者怎么开始——用 Claude Code，提请求，拿链接

全文的逻辑是**"介绍 → 解释 → 示范 → 收尾"**，没有拖沓的总结，直接引导行动。
