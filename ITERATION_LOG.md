# Study Workspace · 迭代日志

## 2026-07-14 · 新增笔记: Palantir Ontology 架构与实践

- 新增 `topics/ai/notes/palantir-ontology.md`: 设计哲学(建模决策而非数据)、语义/动能双层元素、Language-Engine-Toolchain 与后端微服务(OMS/Funnel/OSS)、AIP Agent 治理模型、企业案例(Airbus/NHS/医疗/供应链)与自建借鉴点。
- Wiki ingest: 新卡片 `palantir-ontology`, ontology/semantic-layer 两卡补链(本体系与数据工程系卡片经此打通); ai.html 加卡片, 首页最近沉淀更新。

## 2026-07-14 · v4.7 新开数据工程主题

- 应用户要求新开 `topics/data-engineering/` 主题(第三个主题): `roadmap.md` 九章学习路线, 双主线设计——管道工程(SQL/建模/数仓/存储/流处理/编排质量)+ 语义工程(Ontology 支线挂在第 1 章建模和第 6 章治理), 与既有本体系 wiki 卡片互相引用。
- Wiki ingest: 新增 3 张接点卡片 `dimensional-modeling`/`semantic-layer`/`data-fabric`, index 加"数据工程"分区, log 追加记录。
- 站点接入: 新增入口页 `data-engineering.html`; 渲染脚本导航加"数据工程"项并全量重渲染; 首页/AI/投资三页导航同步, 首页加主题入口卡、"最近沉淀"条目和"主题现状"项; `pages.yml` 发布清单加入口页。
- 文档同步: AGENTS.md(决策树主题清单/目录职责/主题现状/边界)、CLAUDE.md、DIRECTORY_STRUCTURE.md。

## 2026-07-13 · v4.6 知识 Wiki 上线(卡帕西 LLM Wiki 模式)

- 新增顶层 `wiki/`: LLM 维护的概念卡片网络, 平铺存放, 与 `topics/` 长文互补(卡片从长文提炼并链回)。首批 10 张本体标准卡片 + `index.md` 目录 + `log.md` 操作日志。
- 三方兼容约定(GitHub 网页渲染 / Obsidian vault / Pages 站点): 标准 Markdown 链接 + 同目录文件名(不用 wikilink), YAML frontmatter 元数据, 反链由渲染脚本生成。写入 AGENTS.md 新第 5 节(原 5-10 节顺延为 6-11)。
- `render-topic-docs.js` 改造: 扫描 `wiki/`; `.md` 链接按文件存在性双轨解析(先相对当前文件, 再根相对, 存量写法不受影响); 剥离 frontmatter 并显示 `updated`; wiki 页注入"被引用于"反链区块; 全局导航加 Wiki 项(存量 HTML 全量重渲染)。
- 新增 `scripts/wiki-lint.js`(死链/孤儿页/index 缺漏检查); `.gitignore` 加 `.obsidian/`; `pages.yml` 发布 `wiki/`; 三个静态入口页导航加 Wiki。

## 2026-07-13 · 新增笔记: 本体标准全景

- 新增 `topics/ai/notes/ontology-standards.md`: 系统梳理本体标准体系——W3C 栈(RDF/RDFS/OWL 2/SKOS/SPARQL/SHACL/SWRL/RIF)、ISO 体系(Common Logic 24707、顶层本体 21838 含 BFO/DOLCE/TUpper、叙词表 25964)、事实标准(schema.org、Dublin Core、PROV-O、OBO Foundry)、方法论(101/OntoClean/能力问题), 附选型速查表。
- 与已有的 `agent-ontology.md`(为什么)、`ontology-101.md`(怎么建)构成本体论三篇互补; `ai.html` 加卡片, 首页"最近沉淀"加条目(超 8 条, 移除最旧的"AI 学习路线"一条)。

## 2026-07-13 · v4.5 移除英语和 K12 主题

- 按用户决定整体删除英语、K12 主题: `english.html`、`k12.html`、`topics/english/`、`topics/k12/`(含初中数学系列); 内容在 Git 历史 v4.4 之前可找回。
- 全局导航收敛为: 首页、AI、投资。首页主题入口和"主题现状"同步更新, 新增"新主题随需生长"说明。
- `render-topic-docs.js` 移除 english/k12 导航分支; 发布清单同步收敛。
- `AGENTS.md`/`CLAUDE.md`/`README.md`/`DIRECTORY_STRUCTURE.md`/`PROJECT_BACKGROUND.md` 移除英语/学科相关描述。

## 2026-07-13 · v4.4 目录分层重构 + 文档重写

- `topics/` 不再平铺: 路线图移入各主题目录(`topics/<主题>/roadmap.md`), AI/投资散篇笔记归入 `notes/` 子目录, 主题内形态统一为 "roadmap + 系列子目录 + notes"。
- 确立"AI 自动判断存放位置"的决策树, 写入 `AGENTS.md` 第 2 节; 新建 `CLAUDE.md` 作为 Claude Code 项目记忆(引用 AGENTS.md)。
- 废弃 `doc.html`(运行时 fetch 阅读器, 所有内容已有静态 HTML 直链), 从仓库和发布清单移除。
- 翻译风格模板移到 `scripts/templates/claude-blog-zh-style.txt`; 清理 `.DS_Store`。
- 重写 `AGENTS.md`(去掉"远端未配置"等过期内容, 补充站点地址、标准沉淀流程、主题现状)、`DIRECTORY_STRUCTURE.md`、`README.md`。
- `render-topic-docs.js` 导航判断适配新路径; 修复 k12 路线中三个失效的 `.html` 直链。

## 2026-07-13 · v4.3 首页改为沉淀流

- 首页从"今日计划仪表盘"(今日入口/学习状态/今日清单)改为"沉淀流"视角, 反映项目真实形态: 范围不预设, 内容随与 Claude 的对话和定时任务持续积累。
- 新区块: "最近沉淀"(按日期倒序的内容时间线)、"这个站怎么生长"(对话沉淀/定时任务/自动发布)、"主题现状"(AI/投资持续更新, 英语/学科占位)。
- 主题入口卡片如实标注活跃与占位状态; 页脚去掉版本号。
- 复用现有 style.css 类, 未改样式表。

## 2026-07-13 · v4.2 目录整理与首次发布

- 根目录散落文件归位: `ontology101_zh.html` 移入 `topics/ai/ontology-101.html` 并在 `ai.html` 增加入口卡片; ETF 学习源文档移入 `_sources/investment/`(本地保留, 不进 Git); 删除测试文件。
- 纳入 `topics/ai/claude-blog-zh/`(Claude Blog 中文全文翻译, 22 个页面), 与 `claude-blog/`(讲解式译读)互补, `ai.html` 增加"Claude Blog 中文全译"入口。
- `pages.yml` 修复: 发布清单补上 `investment.html`; `configure-pages` 开启 `enablement: true`, 首次部署自动启用 Pages。
- `DIRECTORY_STRUCTURE.md` 补充 `topics/` 子目录结构说明。
- 推送到 GitHub (`xiaoran2013/study`) 并通过 GitHub Actions 部署 Pages。
- 英语、K12 主题暂不扩充, 保持现有占位, 后续逐步补充。

## 2026-07-12 · v4.1 新增投资主题

- 新增全局导航第五项"投资"及入口页 `investment.html`。
- 新增 `topics/investment-roadmap.md` 和 `topics/investment/etf-strategies.md`(ETF投资策略详解, 整理自《ETF投资策略从入门到精通》/《All About Exchange-Traded Funds》, Scott Paul Frush 著)。
- 与 v4.0 移除的股票投研部分不同: 不做行情、评级或组合追踪, 只做投资产品和策略的结构化读书笔记; 原股票投研系统仍独立保留在 `codex-stock/trade` 项目中。
- `scripts/render-topic-docs.js` 增强: 导航加入"投资"入口、标题自动生成锚点 id、页内 `#anchor` 链接不再新开标签页, 支持给专题文档手写可跳转目录。
- `index.html`/`ai.html`/`english.html`/`k12.html`/`doc.html` 导航栏同步加入"投资"入口; 首页今日入口、学习状态、今日清单、最近材料区块同步补充投资条目。

## 2026-07-11 · v4.0 重构

- 从 `codex-stock/trade` 项目中拆分出非股票部分, 独立为 `my-study` 个人学习工作台。
- 移除股票自动投研相关的全部页面、脚本、数据和文档(原项目 `codex-stock/trade` 保持不变, 继续作为独立的股票投研系统)。
- 保留并整理: `index.html`, `ai.html`, `english.html`, `k12.html`, `doc.html`, AI/英语/学科专题材料 (`topics/`), Claude Blog 翻译脚本和原始材料。
- 重写 `README.md`, `PROJECT_BACKGROUND.md`, `DIRECTORY_STRUCTURE.md`, `AGENTS.md`, 去掉股票框架描述, 聚焦 AI/英语/学科长期学习。
- 简化 GitHub Pages 发布工作流, 移除股票相关文件的构建步骤。
- 重新初始化 Git 仓库, 从干净的第一次提交开始。

## 后续

- 内容会陆续增加, 逐步扩充 AI、英语、学科主题材料。
- 视需要建立飞书私有工作台承接草稿、任务和复盘。
- 后续如需推送到 GitHub, 需要先配置远端仓库地址。
