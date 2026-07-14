# CLAUDE.md

个人学习沉淀工作台: 对话和定时任务里学到的内容 → Markdown → 静态 HTML → GitHub Pages。范围不预设, 随积累生长。

完整操作手册(存放决策树、目录职责、发布流程、检查清单):

@AGENTS.md

## 最常用的三件事

1. **沉淀一篇新内容**: 按 AGENTS.md 第 2 节决策树选位置(主题目录 → 系列子目录或 `notes/`), 同步提炼/更新 `wiki/` 概念卡片(AGENTS.md 第 5 节 ingest 流程), 渲染 `node scripts/render-topic-docs.js`, 更新主题入口页卡片 + 首页"最近沉淀", 记 `ITERATION_LOG.md`, 提交推送。
2. **改站点页面**: 复用 `_assets/style.css` 已有类, 尽量不加新样式; 本地 `python3 -m http.server 8080` 抽查 200 后提交。
3. **验证上线**: 推送后 1-3 分钟, `curl -s https://xiaoran2013.github.io/study/<路径>` 确认生效。

## 硬约束

- 新文件不平铺: 学习内容一律进 `topics/<主题>/` 的正确子目录, 原始材料进 `_sources/`(不进 Git), 根目录只放入口页和项目文档。
- 当前主题是 AI、投资、数据工程(英语/K12 已移除); 新主题先和用户确认再开。首页保持"沉淀流"形态, 不做预设计划仪表盘。
- `doc.html` 已废弃, 链接一律用静态 `.html` 直链。
- 提交前扫描密钥; `_sources/`、`.env` 类文件不进仓库。
