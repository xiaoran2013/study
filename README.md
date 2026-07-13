# Study

用 Claude 持续学习和沉淀的个人工作台。

这个项目不是普通博客：内容来自与 Claude 的对话和定时任务，学到什么就沉淀什么，范围不预设、随积累自然生长。沉淀物是 Markdown + 静态 HTML，通过 GitHub Pages 发布长期可浏览的学习站点。

在线访问: https://xiaoran2013.github.io/study/

完整背景见:

- `PROJECT_BACKGROUND.md`: 项目总纲。
- `DIRECTORY_STRUCTURE.md`: 目录结构说明。
- `AGENTS.md`: Agent 操作手册（含内容存放决策树）。
- `CLAUDE.md`: Claude Code 项目记忆。

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

- `index.html`: 首页（沉淀流：最近沉淀 + 生长方式 + 主题现状）。
- `ai.html` / `english.html` / `k12.html` / `investment.html`: 主题入口页。
- `topics/<主题>/`: 学习内容，主题内按 `roadmap.md` + 系列子目录 + `notes/` 分层。
- `_assets/`: 样式。
- `_sources/`: AI 处理用的原始材料（本地保留，不进入 Git 历史）。
- `scripts/`: 自动化脚本（Markdown 渲染、博客翻译等）。
