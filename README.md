# Study

AI 驱动的个人自动化内容生成与学习工作台。

这个项目不是普通博客，而是一个把 AI 搜索、结构化整理、静态网页展示、GitHub Pages 发布和飞书私有工作台串起来的个人学习系统，用来沉淀 AI、英语、学科等长期学习主题。内容会陆续增加。

完整背景见:

- `PROJECT_BACKGROUND.md`: 项目总纲。
- `DIRECTORY_STRUCTURE.md`: 目录结构说明。
- `AGENTS.md`: Agent 操作手册。

## 本地浏览

这是一个纯静态站点，可以直接打开 `index.html`，也可以用任意静态服务器预览：

```bash
python3 -m http.server 8080
```

然后访问 `http://localhost:8080/`。

## GitHub Pages

仓库推送到 GitHub 后，启用 Pages 并选择 GitHub Actions 作为发布源。`.github/workflows/pages.yml` 会构建 `.pages` 发布包，只把公开静态页面、公开文档、公开学习内容和必要前端资源发布为网站。

## GitHub 与飞书

- GitHub: 公开静态站点、版本管理、GitHub Pages 发布。
- 飞书: 私有知识库、任务队列、草稿审核、过程复盘和素材管理。

原则是公开稳定内容进 GitHub，私有过程和动态管理进飞书。

## 目录

- `index.html`: 个人学习工作台首页。
- `ai.html`: AI 学习主题入口。
- `english.html`: 英语学习主题入口。
- `k12.html`: 小学、初中和各学科学习主题入口。
- `investment.html`: 投资学习主题入口。
- `doc.html`: Markdown/JSON 文档浏览器。
- `PROJECT_BACKGROUND.md`: 项目背景与定位。
- `DIRECTORY_STRUCTURE.md`: 项目目录结构和 GitHub/飞书边界。
- `_assets/`: 样式。
- `_sources/`: AI 处理用的原始材料（本地保留，不进入 Git 历史）。
- `topics/`: AI、英语、学科等主题路线和笔记。
- `scripts/`: 自动化脚本。
