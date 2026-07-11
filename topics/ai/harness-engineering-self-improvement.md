# Harness Engineering for Self-Improvement 讲解笔记

原文: Lilian Weng, *Harness Engineering for Self-Improvement*（2026-07-04），中文剪藏见 [pandatalk8.com](https://pandatalk8.com/blog/harness-engineering-self-improvement/document)，英文原文见 [lilianweng.github.io](https://lilianweng.github.io/posts/2026-07-04-harness/)。本笔记为二次整理讲解，不做逐段全文翻译，核心概念、术语和逻辑结构如下，精确表述请点击链接核对原文。

## 1. 主题与背景

文章围绕**递归自我改进（RSI, recursive self-improvement）**展开——这个概念最早来自 I. J. Good（1965）"超智能机器"的设想，Yudkowsky（2008）把它收窄为"AI 用当前智能去改进产生自身智能的认知机器"这一反馈回路。

Weng 的核心论点是: 现代 AI 的 RSI 不太可能从模型直接重写自己权重开始，而是先经过**部署系统**这一层——即模型与真实世界之间的中间层。这一层她称为 **Harness**: 包裹在基础模型外面、负责编排执行的系统，决定模型如何思考规划、调用工具、管理上下文、存储产物和评估结果。Claude Code、Codex 这类编码 Agent 产品的成功，被作为 harness 重要性的例证。

## 2. 三种 Harness 设计模式

文章把 harness 与早期 "agent = LLM + memory + tools + planning + action" 的框架做区分，认为 harness engineering 还要包含工作流设计、评估、权限控制和持久状态管理，更接近运行时/系统设计而非提示词模板。三个反复出现的模式:

- **工作流自动化**: 定义一个"计划 → 执行 → 观察/测试 → 改进"的目标导向循环，让模型能在其中反复迭代，直到目标达成（举例 Karpathy 的 autoresearch 仓库、OpenAI Codex Agent 循环图）。
- **文件系统作为持久记忆**: 长周期 Agent 的日志、diff、trace 等产物远超上下文窗口长度，因此应存成文件而非塞进上下文；读写文件（通常经 `bash`）是 LLM 的基础技能，这个模式会随核心模型能力提升而自然受益。
- **子 Agent 与后台任务**: 主 Agent 需要一个轻量进程管理器，能启动子任务、查日志、取消失败运行、合并结果；关键设计是让并行性**显式且可检查**（落盘而非只存在于临时上下文里）。

案例研究部分给出了编码 Agent harness 的工具分类表: 文件系统类（glob/grep/ls、read、write/edit/multi_edit/apply_patch）、Shell 执行（bash/PowerShell）、IO（lsp、git 工具）、外部上下文（MCP、Skills）、Web 搜索、Artifacts、后台进程（Cron 系列）、Agent 委派（spawn/resume/wait/list/close/interrupt_agent）。

Weng 对 harness 与核心智能关系的预测: harness engineering 会走向"元方法论"（优化"获得更好答案的机器"而非答案本身），成熟 harness 反过来支撑模型自我改进循环；许多改进最终会被内化进模型行为，但"指定目标、约束、上下文和评估"的接口不会消失——类似提示词工程随模型变强而"手工技巧变弱、核心需求还在"的模式。

## 3. Harness 优化的演进路径

文章给出一条被优化对象的演进链: **指令提示词 → 结构化上下文 → 工作流 → harness 代码 → 优化器代码**。随模型变强，优化目标越来越通用、越来越不依赖人工启发式规则。

### 3.1 上下文工程三层递进

- **ACE（Agentic Context Engineering）**: 把上下文视为不断演化的"playbook"而非越写越长的提示词，由生成器（跑轨迹）、反思器（提炼成败洞见）、策展器（增量更新条目化 bullet）三部分组成，避免了"重写完整提示词导致坍塌"的问题。
- **MCE（Meta Context Engineering）**: 把"如何管理上下文的机制"与"上下文里具体内容"分离成双层优化——内层在给定"技能"下找最优上下文，外层（元层）搜索最优技能本身；技能数据库记录历史技能、上下文、训练/验证得分，供元层 Agent 做类似"交叉"的演化操作。实现上，上下文函数落地为目录里的 `skill.md`（静态）加动态 rollout 数据。
- **Meta-Harness**: 再下探一层，优化对象直接是决定"存储/检索/呈现给模型什么信息"的**代码**，用编码 Agent 作为 proposer 提出新 harness，执行历史全部落盘（通过 grep/cat 阅读而非塞进单一上下文），候选 harness 保留在 Pareto 前沿上，只留合格者。

### 3.2 工作流设计

既有手工设计的领域专用流水线（AI Scientist：提想法→写代码→跑实验→分析→写论文→同行评审；ScientistOne 把"可验证性"作为核心约束，每个 claim 要可溯源；Autodata 用挑战者/弱求解器/强求解器/验证器四角色生成难度适中的合成数据），也有把工作流设计本身当搜索问题的算法化方案:

- **ADAS（Automated Design of Agentic Systems）**: "元 Agent 搜索"——用一个元 Agent 参考已有工作流 archive，以代码形式提出新 Agent，经过两轮 self-refine 后评估、择优入库，循环迭代。
- **AFlow**: 把工作流表示成图（节点=调用 LLM 的动作，边=代码实现的逻辑操作），用 MCTS 做工作流优化，实验显示优于手工设计和 ADAS。

### 3.3 自我改进的 Harness

- **STOP（Self-Taught Optimizer）**: 定义"改进器" \(I\)，目标不是直接改进解而是改进改进器本身，通过元效用函数递归更新 \(I_t = I_{t-1}(\hat{u}, I_{t-1}; M)\)。实验发现的策略包括遗传算法、多臂老虎机、模拟退火等，但一个警示性结果是: 这套递归结构在 GPT-4 上能提升表现，在更弱模型（GPT-3.5、Mixtral）上反而下降——说明基础模型能力是必要前提，harness 改进不能替代智能本身。
- **Self-Harness**: 三阶段循环——弱点挖掘（把失败聚类为验证器支撑的失败模式，保留因果层面的 trace 而非只看表面错误）、Harness 提案（同一模型基于失败模式提出有边界、多样化的编辑）、提案验证（在 held-in/held-out 数据上做回归测试，只有两边都不退化才合并）。文章也直接点出风险: 允许程序编辑"操作系统"会打破抽象边界，权限控制和安全层必须留在这个循环之外，奖励黑客的老问题依然存在。

### 3.4 进化式搜索

进化式搜索适合"搜索空间大/形状奇特、难以梯度优化但易于评估解"的场景:

- **Promptbreeder / GEPA**: 提示词工程领域的进化搜索，前者连"变异指令"本身也参与进化，后者结合反思式轨迹分析。
- **AlphaEvolve**: 保存候选程序池，冻结 LLM 生成改进 diff，用 `# EVOLVE-BLOCK-START/END` 明确标记可演化代码区域，元提示词与解一起演化；消融实验证明流程设计、上下文、元提示词、全文件演化、更强 LLM 都有增益。
- **ShinkaEvolve**: 引入设计父代采样（平衡排名与后代数量）、代码新颖性拒绝采样（embedding 相似度去重）、元 scratchpad（提炼成功模式指导变异）三个新组件提升采样效率。
- **Darwin Gödel Machine（DGM）/ Hyperagents**: 直接演化**可编辑的 harness 代码仓库**本身，让编码 Agent 修改自己的 harness；固定基础模型（如 Claude 3.5 Sonnet）下，DGM 发现的 Agent 在 SWE-bench Verified、Polyglot 上追平甚至超过手工 Agent。这类方法对"能自动评估、适应度容易量化"的任务（矩阵乘法、GPU kernel、算法竞赛）效果好，对评估模糊/依赖启发式的领域较难。

### 3.5 与模型权重联合优化

**SIA（Self Improving AI with Harness & Weight Updates）**尝试把 harness 改进和权重更新统一进同一个循环: Meta-Agent 提出初始 harness，Task-Specific Agent 执行任务，Feedback-Agent 基于近期轨迹决定下一步是改 harness 还是改权重。文章评价其实验设计存在混杂因素（任务 Agent 明显弱于负责决策的模型），结论仍属初步。

## 4. 未来挑战（原文列了 7 条）

1. **弱而模糊的评估器**: 研究品味、新颖性等难以像 RL 奖励那样精确量化。
2. **上下文和记忆生命周期**: 长周期任务下记忆持续增长，上下文工程应被视为智能本身的一部分而非纯软件层问题。
3. **负结果**: 训练数据偏向"成功案例"，模型可能不擅长判断何时该放弃假设或承认失败。
4. **多样性坍塌**: 进化/RL 循环容易固化到已知高奖励模式，需要机制防止种群坍塌。
5. **奖励黑客**: 自我改进循环会优化任何给定信号，无论来自单测、judge model 还是 benchmark，都有被针对性利用的风险；评估器和权限控制应在演化循环之外，配合 held-out 测试和人工审查。
6. **长期成功**: 短期 rollout 奖励难以捕捉可维护性、所有权边界、迁移成本等长期健康指标（以编码 Agent 为例展开）。
7. **人类的角色**: 人类应"向栈的上层移动"而非被移出循环，需要在正确的抽象层级设计监督接触点。

文中引用 Trehan & Chopra（2026）的实证研究作为佐证: 在最小 scaffolding 下让 LLM 从研究想法走到论文，观察到六种反复出现的失败模式——偏向训练数据默认值、执行压力下的实现漂移、记忆/上下文退化、过度乐观（"p-hacking and eureka-ing"）、领域智能不足、科学品味薄弱。

## 5. 附录: 提到的 Benchmark

PaperBench、CORE-Bench、ScienceAgentBench、RE-Bench、MLE-bench、KernelBench——分别对应"复现论文"、"计算可复现性"、"数据驱动科学发现"、"ML 研究工程 vs 人类专家"、"Kaggle 竞赛"、"GPU kernel 正确性与速度"等评测方向，细节见原文附录表格。

## 6. 值得深入的问题

- Meta-Harness、Self-Harness 这类"允许 Agent 编辑自己 harness 代码"的方案，权限边界具体应该怎么设计才安全？
- ACE → MCE → Meta-Harness 这条"上下文工程"演进线，和"进化式搜索直接演化 harness 代码"（DGM/Hyperagents）两条路线，未来会不会收敛成同一套系统？
- SIA 这种"harness + 权重联合优化"路线，如果换成更均衡的模型配置（任务模型和决策模型能力相当），结论是否会不同？

## 来源

中文剪藏: [pandatalk8.com/blog/harness-engineering-self-improvement](https://pandatalk8.com/blog/harness-engineering-self-improvement/document)；英文原文: [lilianweng.github.io/posts/2026-07-04-harness](https://lilianweng.github.io/posts/2026-07-04-harness/)。本文为二次整理和讲解，非逐句翻译，如需精确表述请点击链接查看原文。整理于 2026-07-11。
