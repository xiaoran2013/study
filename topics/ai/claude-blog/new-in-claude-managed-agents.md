# Claude Managed Agents 新功能讲解

> 原文: https://claude.com/blog/new-in-claude-managed-agents
> 日期: May 19, 2026
> 分类: Product announcements
> 产品: Claude Platform

---

## 文章在讲什么

这是一篇产品发布公告，介绍 Claude Managed Agents 平台新增的三个核心功能：**Dreaming**（做梦）、**Outcomes**（结果导向）和 **Multiagent Orchestration**（多智能体编排）。

作者想解决的问题是：如何让 AI Agent 在处理复杂任务时能够**自我改进**、**达到质量标准**、**并行高效工作**。

传统的 AI Agent 通常是"一次性"执行——做完就结束，不积累经验，也不知道自己做得够不够好。这篇文章介绍的功能正是为了解决这三个痛点：让 Agent 能从过去的工作中学习（Dreaming）、能自我评估并修正（Outcomes）、能把大任务分解给多个专门 Agent 同时处理（Multiagent Orchestration）。

---

## 原文结构地图

| 主要章节 | 作用 |
|---------|------|
| **Build self-improving agents with dreaming** | 介绍 Dreaming 功能，解释它如何让 Agent 跨会话学习和自我改进 |
| **Deliver better outcomes** | 介绍 Outcomes 功能，说明如何用评分标准让 Agent 自我检验并达标 |
| **Handle complex tasks with multiple agents** | 介绍 Multiagent Orchestration，展示如何用多个 Agent 并行处理复杂任务 |
| **What teams are building** | 用四个真实案例说明这三个功能在实际中的应用效果 |
| **Getting started** | 收尾，提供访问和使用指引 |

---

## 核心概念讲解

在进入具体功能之前，我们需要理解几个核心概念及其关系：

### 1. Memory（记忆系统）

Memory 是 Managed Agents 的基础能力——让每个 Agent 能够**在工作时捕获和保存它学到的内容**。比如一个 Agent 处理了某个文件格式的兼容性问题，下次遇到类似情况，它可以直接查阅记忆，而不需要重新摸索。

### 2. Dreaming（做梦）

Dreaming 是**在两次工作之间运行的"反思"机制**。它不是让 Agent 在工作时思考，而是**在 Agent 空闲时（如深夜）回顾之前的会话和记忆存储，提取模式，发现问题，并主动更新记忆**。

**为什么叫"Dreaming"？** 作者用这个比喻说明：Agent 在"睡眠"时回顾经历、整理经验、形成更深层的理解——就像人类的做梦/反思过程。

### 3. Outcomes（结果导向）

Outcomes 是**一种质量控制机制**。你定义"成功是什么样子的"（一个 rubric，即评分标准），然后 Agent 执行任务，另一个独立的"grader"（评判者）会对照标准评估输出。如果不达标，Agent 重新尝试，直到通过。

关键设计点：**grader 有自己的 context window，不受 Agent 推理过程的影响**，保证了评估的客观性。

### 4. Multiagent Orchestration（多智能体编排）

当任务太复杂、一个 Agent 难以胜任时，可以让**一个 lead agent（主导 Agent）** 将任务拆分成多个子任务，分别交给**专门的 subagent（子 Agent）** 处理。这些 subagent 可以**并行运行**，各自使用不同的模型、不同的提示词、不同的工具。

### 概念之间的关系

```
Memory ←—— Dreaming（定期优化记忆）
              ↓
        Agent 执行工作
              ↓
         Outcomes（评估质量）
              ↓
    如果复杂 → Multiagent Orchestration（分工并行）
```

这三个功能**不是孤立的**，它们共同构成了一个完整的"自我改进闭环"：

- Agent 通过 **Memory** 积累经验
- 通过 **Dreaming** 提炼和优化这些经验
- 通过 **Outcomes** 确保工作质量达标
- 通过 **Multiagent Orchestration** 扩大处理能力

---

## 文章主体讲解

### 第一部分：Build self-improving agents with dreaming

**这一节讲什么：**

作者介绍了 Dreaming 功能——一个在后台定期运行的研究预览功能。

**为什么重要：**

传统 AI 应用是"无状态"的，每次对话都是全新的。但现实中的工作往往是**持续的、跨会话的**。一个 Agent 上午处理了某类问题，下午又遇到类似问题，却"忘记"了上午的经验。Dreaming 要解决的就是这个"遗忘"问题，让 Agent 具备**跨会话学习和改进**的能力。

**关键点：**

1. **模式发现**：Dreaming 能发现单个 Agent 在单次会话中无法看到的模式——比如反复犯的错误、团队共享的偏好、工作流程的收敛方向。

2. **记忆重构**：随着时间推移，记忆会变得冗余和混乱。Dreaming 会**重构记忆结构**，保持高信噪比。

3. **可控性**：用户可以选择全自动更新记忆，或者先审查 Dreaming 提出的修改建议，再决定是否采纳。

4. **适用场景**：对**长期运行的任务**和**多智能体协作**特别有价值——多个 Agent 之间可以通过 Dreaming 共享学习成果。

---

### 第二部分：Deliver better outcomes

**这一节讲什么：**

作者介绍了 Outcomes 功能——通过定义明确的成功标准，让 Agent 自我评估输出质量，不达标就重试。

**为什么重要：**

很多任务的质量标准是**模糊的、主观的**，比如"这份文案是否符合品牌调性""这个设计是否符合视觉规范"。传统的做法是让人工审核每一步输出，但这样效率低且不可扩展。Outcomes 让 Agent 能够**自行判断"够不够好"，直到达到标准**。

**关键点：**

1. **Rubric（评分标准）**：用户定义"成功的样子"，比如结构框架、演示标准、需求清单等。

2. **独立 Grader**：评判者有自己独立的上下文窗口，不会被 Agent 的推理过程"污染"，保证了评估的客观性。

3. **自我修正循环**：不达标 → Grader 指出问题 → Agent 修正 → 再次评估，直到通过。

4. **性能数据**：作者给出了内部测试结果——
   - 整体任务成功率提升**最高 10 个百分点**
   - Word 文档生成质量提升 **+8.4%**
   - PowerPoint 生成质量提升 **+10.1%**
   
   这说明 Outcomes 对**细节要求高、覆盖要全面的任务**效果最明显。

5. **主观质量也适用**：不仅能评估客观标准（如"是否包含所有章节"），也能评估主观标准（如"是否符合品牌调性"）。

---

### 第三部分：Handle complex tasks with multiple agents

**这一节讲什么：**

作者介绍了 Multiagent Orchestration——用多个 Agent 分工协作处理复杂任务。

**为什么重要：**

当任务规模太大或类型太多样时，单个 Agent 会"力不从心"。比如一个故障排查任务，需要同时查看部署历史、错误日志、监控指标、工单系统——这些并行的工作让一个 Agent 来做效率太低。Multiagent Orchestration 让**专业化分工 + 并行执行**成为可能。

**关键点：**

1. **Lead Agent（主导 Agent）**：负责任务分解、调度和整合结果。

2. **Subagent（子 Agent）**：各自拥有独立的模型配置、提示词和工具，专门处理某一类任务。

3. **并行执行**：子 Agent 可以**同时运行**，大大提升效率。

4. **共享上下文**：所有 Agent 共享一个文件系统，可以互相传递信息。

5. **状态持久化**：事件是持久化的，每个 Agent 都能记住自己做过什么，支持**工作流中途的"回访"**。

6. **完整可追溯**：在 Claude Console 中可以看到完整的执行链路——哪个 Agent 做了什么、按什么顺序、为什么这样做。

---

### 第四部分：What teams are building

**这一节讲什么：**

作者用四个真实案例展示这三个功能如何落地应用。

**为什么重要：**

功能介绍容易抽象，案例能帮助读者理解"这能解决什么实际问题"。这四个案例覆盖了不同场景——法律文档、平台工程、写作工具、文档审查。

**关键案例：**

| 公司 | 用什么功能 | 解决什么问题 | 效果 |
|------|-----------|-------------|------|
| **Harvey**（法律科技） | Dreaming | Agent 记住文件类型处理技巧、工具特定模式 | 完成率提升 **~6 倍** |
| **Netflix 平台团队** | Multiagent Orchestration | 并行分析数百个构建来源的日志，找出跨应用的重复问题 | 批量并行分析，快速定位关键问题 |
| **Spiral by Every**（写作工具） | Multiagent + Outcomes | Haiku 接待请求，Opus 生成草稿； Outcomes 评分确保写作质量 | 多草稿并行 + 质量把控 |
| **Wisedocs** | Outcomes | 按内部标准评估文档审查质量 | 审查速度提升 **50%**，同时保持标准一致性 |

这些案例说明：这三个功能**可以单独使用，也可以组合使用**，关键看场景需求。

---

## 文章结尾怎么收束

文章最后一段是典型的"Getting Started"（入门指引）：

1. **明确状态**：Dreaming 是研究预览（research preview），其余功能是公开 beta。
2. **提供入口**：给 Dreaming 的访问申请链接，指向文档和 Claude Console。
3. **降低门槛**：邀请读者立刻尝试——"deploy your first agent"。

**逻辑闭合**：

全文从"为什么需要"（痛点）→ "我们提供了什么"（三个功能）→ "别人用得怎么样"（案例验证）→ "你现在可以开始"（行动召唤），形成了一个完整的**价值叙事闭环**：发现问题 → 提出方案 → 证明有效 → 邀请行动。

---

## 关键句短摘译

| 英文短摘 | 中文意思 | 为什么重要 |
|---------|---------|-----------|
| "Dreaming extends memory by reviewing past sessions to find patterns and help agents self-improve." | Dreaming 通过回顾过去的会话来发现模式、帮助 Agent 自我改进，从而扩展了记忆能力。 | 点明了 Dreaming 的核心价值——让 Agent 在空闲时"反思"并成长。 |
| "A separate grader evaluates the output against your criteria in its own context window, so it isn't influenced by the agent's reasoning." | 一个独立的评判者用自己的上下文窗口对照你的标准评估输出，不受 Agent 推理的影响。 | 这是 Outcomes 设计的核心——评估必须客观，不能"自己评自己"。 |
| "Agents do their best work when they know what 'good' looks like." | 当 Agent 知道"好"是什么样的时候，它能发挥最佳表现。 | 一句话点明了质量标准的重要性——模糊的目标导致模糊的结果。 |
| "When there is too much work for a single agent to do well, multiagent orchestration lets a lead agent break the job into pieces." | 当单个 Agent 难以胜任工作时，多智能体编排让主导 Agent 把任务拆解成多个部分。 | 说明了 Multiagent Orchestration 的适用边界——复杂、大量、多样化的任务。 |
| "These specialists work in parallel on a shared filesystem and contribute to the lead agent's overall context." | 这些专家 Agent 在共享文件系统上并行工作，并将结果贡献给主导 Agent 的整体上下文。 | 解释了并行如何实现、结果如何汇总——分工但不割裂。 |
| "Completion rates went up ~6x in their tests." | 在他们的测试中，完成率提升了约 6 倍。 | 提供了 Dreaming 功能的具体效果数据，有说服力。 |

---

## 术语表

| 英文术语 | 解释 |
|---------|------|
| **Dreaming** | "做梦"，一种定期运行的 Agent 反思机制，在工作间隙回顾会话、提取模式、优化记忆。 |
| **Outcomes** | "结果导向"，通过定义质量标准（rubric）和独立评判者（grader），让 Agent 自我检验输出并持续修正直到达标。 |
| **Multiagent Orchestration** | "多智能体编排"，用多个 Agent 分工协作处理复杂任务，主导 Agent 负责任务分解和结果整合。 |
| **Memory** | "记忆系统"，让 Agent 能够保存和检索在工作中积累的经验和知识。 |
| **Lead Agent** | "主导 Agent"，在多智能体架构中负责分解任务、调度子 Agent、整合结果的核心角色。 |
| **Subagent** | "子 Agent"，在多智能体架构中专门负责某类子任务的 Agent，可独立配置模型和工具。 |
| **Grader** | "评判者"，在 Outcomes 机制中独立评估 Agent 输出是否符合标准的组件。 |
| **Rubric** | "评分标准"，用户定义的任务成功标准，grader 据此判断输出是否达标。 |
| **Research Preview** | "研究预览"，功能尚在早期阶段，向部分用户开放测试。 |
| **Public Beta** | "公开测试版"，功能基本成熟，向所有用户开放。 |

---

**总结**：这篇文章的核心信息是——Claude Managed Agents 的三项新功能（Dreaming、Outcomes、Multiagent Orchestration）共同实现了 Agent 从"被动执行"到"主动改进"的跨越。它们让 Agent 能够**学习**（Dreaming）、**自律**（Outcomes）、**协作**（Multiagent），从而在复杂任务面前更加可靠和高效。
