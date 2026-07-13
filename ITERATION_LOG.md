# Study Workspace · 迭代日志

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
