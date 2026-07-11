# 驾驭 Claude Code：CLAUDE.md、skills、hooks 与子代理的使用时机

> 原文: https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more
> 日期: Jun 18, 2026
> 分类: Claude Code
> 产品: Claude Code

---

## 文章在讲什么

这篇文章解决的问题很实际：当你想要定制 Claude Code 的行为时，应该把指令放在哪里？

作者指出 Claude Code 提供了七种定制方法，但这七种方法在"何时加载""是否会因为对话压缩而丢失""消耗多少上下文成本"这三个维度上各不相同。如果把指令放在错误的位置，可能导致：无关的上下文不断累积消耗 token、关键指令在长对话中被遗忘、或者本该确定执行的自动化变成了"看心情"的概率行为。

文章的核心框架是**上下文成本（context cost）与指令权威性（authority）的权衡**。不同方法在这个权衡谱上占据不同位置，理解这一点，就能为你的每条指令找到正确的归属地。

---

## 原文结构地图

| 主要章节 | 作用 |
|---------|------|
| 开篇与对比表格 | 建立七种方法的整体印象，用表格快速对比关键维度差异 |
| CLAUDE.md files | 讲解项目级"常驻"指令的两个变体（根目录 vs 子目录）及其适用场景 |
| Rules | 讲解"硬约束"式的指令，以及 path-scoped 规则如何降低无关上下文 |
| Skills | 讲解"按需加载"的过程性工作流，以及与压缩行为的交互 |
| Subagents | 讲解"隔离执行"模式——子代理在独立上下文运行，只返回摘要 |
| Hooks | 讲解"确定性自动化"——通过生命周期事件触发，执行结果不一定回到主对话 |
| Output styles | 讲解"系统级角色改变"——替换默认的编程助手身份 |
| Appending the system prompt | 讲解"追加式系统提示"——只叠加、不覆盖，适合单次调整 |
| When to use each method | 反面案例：五种常见的错误放法，以及为什么应该迁移到其他方法 |
| Getting started | 总结建议：可以打包成插件分享给团队 |

---

## 核心概念讲解

### 上下文成本（Context Cost）

每次对话中，能放进 Claude 上下文窗口的 token 数量是有限的，token 越多，成本越高、推理质量可能下降。把指令放在哪里，决定了它多久被加载一次、占用多少空间。

- **高成本**：整段内容在每个会话开始就进入上下文，且在压缩后重新加载
- **低成本**：只有在相关场景下才加载，或者完全在主上下文之外运行

### 压缩行为（Compaction Behavior）

Claude Code 的"压缩"机制会在长对话中将早期上下文移出，以腾出空间给新内容。不同方法对压缩的处理不同：

- **重新注入（Re-injected）**：压缩后会被重新读入，不会永久丢失
- **丢失（Lost）**：压缩后不会自动恢复，除非再次触发加载条件
- **不参与压缩（Never compacted）**：始终在上下文中

### 生命周期事件（Lifecycle Events）

Claude Code 运行过程中会触发特定事件，如：会话启动（SessionStart）、文件读取（FileRead）、工具调用（PreToolUse）、压缩前（PreCompact）、会话结束（On杀戮）。Hooks 就是通过监听这些事件来实现确定性自动化的。

### 子代理隔离（Subagent Isolation）

子代理运行在一个全新的、独立的上下文窗口中，父会话看不到它的中间过程，只有最终摘要会返回。这与 Skills 的"在主线程展开"形成对比。

---

## 文章主体讲解

### 第一部分：开篇对比表

**这一节讲什么：** 作者先给出一张总览表格，从"何时加载""压缩行为""上下文成本""何时使用"四个维度对比七种方法。

**为什么重要：** 这张表是全文的"索引"，读者可以先建立整体印象，再深入各章节了解细节。

**关键点：** 表格的核心信息是——没有一种方法在所有维度上都是最优的，必须根据具体指令的特点做取舍。

---

### 第二部分：CLAUDE.md 文件

**这一节讲什么：** CLAUDE.md 是放在项目根目录或子目录的 Markdown 文件，内容在会话开始时加载。全文详细解释了它的两种变体。

**为什么重要：** 这是最直觉的定制方式，但也是最容易"膨胀"并导致 token 浪费的地方。

**关键点：**

- **根目录 CLAUDE.md**：会话开始时加载，压缩后重新读入。整个会话期内都有效，高上下文成本。适合放"始终要知道的事实"：构建命令、目录结构、团队编码规范。
- **子目录 CLAUDE.md**：只在 Claude 读取该子目录下文件时才加载，压缩后丢失，直到再次访问该子目录才恢复。适合放"仅在特定区域有效的约定"。
- **膨胀问题**：在多人共享的仓库中，CLAUDE.md 容易被团队成员不断追加内容，每一行都会在每个工程师的每个会话中加载，无论他们是否在做相关工作。
- **建议**：保持 CLAUDE.md 在 200 行以内，指定负责人，像代码一样审查变更。

---

### 第三部分：Rules

**这一节讲什么：** Rules 放在 `.claude/rules/` 目录下，是针对特定约束或约定的指令文件。

**为什么重要：** Rules 提供了一种比 CLAUDE.md 更细粒度的控制方式，特别是 path-scoped 规则。

**关键点：**

- **无作用域规则（Unscoped rules）**：会话开始加载，压缩后重新注入，行为与根目录 CLAUDE.md 相同，可能浪费 token。
- **路径作用域规则（Path-scoped rules）**：通过 frontmatter 中的 `paths` 字段指定，只有当 Claude 读取匹配路径的文件时，规则才加载。
- **示例**：`src/api/**` 和 `**/*.handler.ts` 下的所有 API 处理器必须用 Zod 验证输入。这样的规则在只做文档工作时不会进入上下文。
- **使用时机**：当约束是"跨多个角落存在但不是全局适用"的横切关注点时，优先选 path-scoped 规则而非嵌套 CLAUDE.md。

---

### 第四部分：Skills

**这一节讲什么：** Skills 放在 `.claude/skills/` 目录下，是包含指令、脚本和资源的文件夹。只有名称和描述在会话开始时加载，完整内容在技能被调用时才加载。

**为什么重要：** 这是存放"过程性工作流"的正确位置——它们不需要一直占据上下文，只在需要时按需激活。

**关键点：**

- **加载机制**：会话开始只加载名称和描述；完整内容通过斜杠命令（如 `/code-review`）或自动匹配任务时加载。
- **内置技能示例**：`/code-review` 可以审查当前差异并报告结果，但不编辑文件。
- **压缩行为**：会话中被调用的技能会重新注入，总量有上限（budget），超出后最早调用的技能被丢弃。
- **使用时机**：部署工作流、发布检查清单、安全审查流程等过程性内容适合放在 skills 中。

---

### 第五部分：Subagents

**这一节讲什么：** Subagents 放在 `.claude/agents/` 目录下，通过 YAML frontmatter 定义独立的助手，可以在完全隔离的上下文窗口中运行，只返回最终摘要。

**为什么重要：** 当任务需要"旁路执行"——产生大量中间结果但主对话不需要关心这些时——子代理是最佳选择。

**关键点：**

- **隔离运行**：子代理在全新的上下文窗口中运行，中间过程和结果永远不进入父会话。
- **返回方式**：只有最终消息（通常是聚合后的摘要）和元数据返回给主会话。
- **嵌套能力**：子代理可以嵌套最多五层，可以动态编排数十到数百个后台代理。
- **与 Skills 的区别**：子代理适合"隔离运行"；Skills 适合"在主线程展开以便你看到和把控每一步"。
- **使用场景**：深度搜索、日志分析、依赖审计等。

---

### 第六部分：Hooks

**这一节讲什么：** Hooks 是用户定义的命令、HTTP 端点或 LLM 提示，通过监听 Claude 生命周期事件触发确定性自动化。

**为什么重要：** 这是唯一能实现"强制执行"而非"建议遵守"的方法类型。

**关键点：**

- **事件类型**：Command hook、HTTP hook、MCP tool hook（确定性执行）；Prompt hook、Agent hook（使用 Claude 判断）。
- **上下文成本低**：配置不在主上下文中，由 harness 在独立环境中执行。
- **结果不一定回传**：大多数 hook 的输出不会自动保存到主上下文，除非显式配置。
- **典型用法**：编辑后自动运行 linter、完成时发 Slack 通知、用 PreToolUse hook 检查工具调用并用 exit code 2 拒绝。
- **PreCompact 事件**：可以在压缩前备份聊天历史——但 Claude 不会知道历史保存到了哪个文件。

---

### 第七部分：Output Styles

**这一节讲什么：** Output styles 放在 `.claude/output-styles/` 目录下，直接注入系统提示符（system prompt），永不压缩，会话开始时加载。

**为什么重要：** 这是权威性最高的方法，直接改变 Claude 的默认角色定位。

**关键点：**

- **覆盖默认行为**：自定义 output style 会替换掉默认的软件工程师助手身份，包括：如何界定变更范围、何时添加注释、如何处理安全问题、验证习惯（如提交前运行测试）。
- **上下文成本高**：因为永不压缩，始终占据上下文空间。
- **内置样式**：在创建自定义样式前，先检查内置的 Proactive、Explanatory、Learning 样式——它们覆盖了最常见的需求（自主模式、教学模式、协作编码），无需维护额外文件。
- **保留默认设置**：如果想保留默认编程助手的核心指令，可以在 frontmatter 中设置 `keep-coding-instructions: true`。

---

### 第八部分：Appending the System Prompt

**这一节讲什么：** 通过 CLI 的 `--append-system-prompt` 标志在调用时追加指令，与 Output styles 的"覆盖"不同，这是"叠加"。

**为什么重要：** 提供了一种不影响默认角色的临时调整方式。

**关键点：**

- **仅追加、不覆盖**：不影响默认角色，只添加额外指令。
- **单次生效**：通过 CLI 标志传递，只在该次调用中生效，不持久化为文件。
- **上下文成本**：首次请求后会被缓存，但指令越多、越长，输出 token 也会增加。
- **递减效应**：作者提示，这个方法的指令遵循度会随数量增加而递减，尤其是存在相互矛盾的指令时。
- **适用场景**：添加特定编码标准、输出格式偏好或领域特定知识。

---

### 第九部分：反面案例（When to Use Each Method）

**这一节讲什么：** 作者列出了五种常见的错误放置方式，并解释了为什么应该迁移。

**为什么重要：** 这部分将前面各节的抽象概念落到具体场景，帮助读者"反查"自己的配置是否合理。

**关键点：**

| 错误做法 | 正确做法 |
|---------|---------|
| "每次 X 都 Y"写在 CLAUDE.md | 用 Hook（确定性执行 vs 模型选择执行） |
| "永远不要做这个"写在 CLAUDE.md | 用 Hook 或权限设置（强制 vs 建议） |
| 30行流程写在 CLAUDE.md | 迁移到 Skills（按需加载 vs 常驻） |
| API 相关规则没有 paths 作用域 | 添加 paths 字段（只在相关目录加载） |
| 个人偏好写在项目级 CLAUDE.md | 用用户级配置文件（个人 vs 团队） |

---

### 第十部分：Getting Started

**这一节讲什么：** 作者建议读者从最基础的方法开始，逐步尝试，然后可以将多种配置打包成插件分享。

**为什么重要：** 这是全文的收尾，从"理解方法"过渡到"开始行动"。

---

## 关键对比表

| 方法 | 何时加载 | 压缩行为 | 上下文成本 | 适用场景 |
|-----|---------|---------|-----------|---------|
| **CLAUDE.md（根目录）** | 会话开始，整个会话期 | 重新注入 | 高 | 构建命令、目录结构、团队编码规范 |
| **CLAUDE.md（子目录）** | 读取该子目录下文件时 | 丢失直到再次访问 | 低 | 仅在特定子目录有效的约定 |
| **Rules（无作用域）** | 会话开始 | 重新注入 | 中 | 全局硬约束 |
| **Rules（路径作用域）** | 匹配路径时 | 重新注入 | 低 | 特定文件/目录的约束 |
| **Skills** | 名称描述在开始；完整内容在调用时 | 调用后重新注入，有总量上限 | 低 | 过程性工作流（部署、检查清单） |
| **Subagents** | 名称描述在开始；完整内容在调用时 | 完全隔离，只返回摘要 | 极低（主上下文零成本直到调用） | 并行/隔离任务（搜索、分析、审计） |
| **Hooks** | 生命周期事件触发 | 完全不参与主上下文 | 极低 | 确定性自动化（linter、通知、阻止命令） |
| **Output styles** | 会话开始 | 永不压缩 | 高 | 角色改变（编程助手→通用助手） |
| **System prompt 追加** | 调用时传入 | 永不压缩（仅该次） | 中 | 语气、长度、格式偏好 |

---

## 关键句短摘译

1. **"The model choosing to run a formatter is different from the formatter running automatically."**
   模型选择运行格式化工具 ≠ 格式化工具自动运行。
   → 解释了为什么"每次编辑后运行 prettier"应该用 Hook 而非写在 CLAUDE.md 里。

2. **"Claude will follow the instruction most of the time, but when under pressure, in a long session or an ambiguous situation, or due to a prompt injection, the model can fail to follow a prompted rule."**
   Claude 大多数时候会遵守指令，但在压力下、长对话中、模糊情境中，或遭遇 prompt injection 时，可能失效。
   → 说明"强制禁止"不能靠指令，必须靠 Hook 和权限设置。

3. **"That isolation is one of the main reasons to reach for a subagent instead of a skill."**
   隔离是选择子代理而非技能的主要原因之一。
   → 精确定位了两种方法的核心区别。

4. **"The orchestration plan and intermediate results live in script variables rather than in Claude's context window, which enables scale without losing instructional fidelity."**
   编排计划和中间结果存在脚本变量中而非 Claude 上下文窗口中，这使得规模化成为可能而不损失指令保真度。
   → 解释了为什么子代理可以嵌套几十上百个而不崩溃。

5. **"Because they sit in the system prompt, output styles carry the highest instruction-following weight of any method."**
   因为 output styles 位于系统提示符中，所以拥有所有方法中最高的指令遵循权重。
   → 解释了为什么修改 output styles 影响最深远。

6. **"Generally, the more instructions you provide using this method, the less strictly Claude will follow them."**
   一般来说，用这个方法提供的指令越多，Claude 遵循得越不严格。
   → 针对 system prompt 追加方法的递减效应提醒。

7. **"Keep CLAUDE.md under 200 lines, give it an owner, and review changes to it like code."**
   保持 CLAUDE.md 在 200 行以内，指定负责人，像审查代码一样审查变更。
   → 实用的 CLAUDE.md 维护建议。

---

## 术语表

| 英文术语 | 中文解释 |
|---------|---------|
| **Context cost** | 上下文成本。指令占据上下文窗口的空间，用 token 计量。 |
| **Compaction** | 压缩。Claude Code 在长对话中清理早期上下文以腾出空间的机制。 |
| **Authority** | 权威性。指令被 Claude 遵守的确定程度。 |
| **Re-injected** | 重新注入。压缩后自动恢复加载的机制。 |
| **Path-scoped** | 路径作用域。通过文件路径匹配控制指令何时加载。 |
| **Lifecycle events** | 生命周期事件。Claude Code 运行过程中触发的事件节点（如 PreToolUse、PreCompact）。 |
| **Isolation** | 隔离。子代理在独立上下文窗口中运行，与主会话完全分离。 |
| **System prompt** | 系统提示符。定义 Claude 角色和核心行为的高优先级指令集。 |
| **Instruction-following weight** | 指令遵循权重。不同位置的指令被 Claude 执行的优先级。 |
| **Token budget** | Token 预算。对技能调用总量的限制，超出后最早调用的技能被丢弃。 |

---

## 文章结尾怎么收束

文章的收束逻辑很清晰：从"工具介绍"回到"使用者决策"。

作者没有简单地列举七种方法就结束，而是专门用一节"反面案例"告诉读者：**如果你的指令放错了位置，会有什么后果，以及应该迁移到哪里**。这让整篇文章从"这是什么"过渡到了"我怎么用它"。

最后，作者给出了一个递进式的行动建议：**先从基础方法开始尝试 → 有几个运行稳定后 → 打包成插件分享**。这个节奏暗示：定制 Claude Code 是一个渐进过程，不需要一次性搞定所有配置。

整体而言，文章的核心框架是**"权衡"**：上下文成本越低，指令的确定性或权威性往往也越低；想要强制执行，就必须放弃灵活的解释空间。理解这个权衡，就能为每一条指令找到它最合适的归宿。
