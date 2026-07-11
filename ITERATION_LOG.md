# Study Workspace · 迭代日志

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
