# 目录结构说明

## 1. 设计原则

- 根目录只放站点入口页、项目文档和必要配置, 不堆内容文件。
- 学习内容一律进 `topics/<主题>/`, 主题内再按"路线 / 系列 / 散篇"分层, **不平铺**。
- 新内容的存放位置由 AI 按 `AGENTS.md` 第 2 节的决策树自动判断。
- 公开内容和私有材料分离: 公开进 GitHub/Pages, 原始材料留 `_sources/`(本地)。
- GitHub Pages 只发布 `.pages/` 白名单包。

## 2. 顶层结构

```text
.
├── index.html                 # 首页(沉淀流)
├── ai.html                    # AI 主题入口
├── investment.html            # 投资主题入口
├── data-engineering.html      # 数据工程主题入口
├── README.md                  # 项目入口说明
├── PROJECT_BACKGROUND.md      # 项目总纲
├── DIRECTORY_STRUCTURE.md     # 本文档
├── AGENTS.md                  # Agent 操作手册(含存放决策树)
├── CLAUDE.md                  # Claude Code 项目记忆(引用 AGENTS.md)
├── ITERATION_LOG.md           # 迭代记录
├── _assets/                   # 样式等前端资源
├── topics/                    # 学习内容(见第 3 节)
├── scripts/                   # 自动化脚本
├── _sources/                  # 原始材料(本地, 不进 Git)
├── .github/workflows/         # Pages 发布工作流
└── .nojekyll                  # Pages 静态站点标记
```

## 3. topics/ 内部分层

每个主题目录的固定形态: `roadmap.md`(路线) + 系列子目录 + `notes/`(散篇)。

```text
topics/
├── ai/
│   ├── roadmap.md/.html                 # AI 学习路线
│   ├── claude-blog/                     # 系列: Claude Blog 讲解式译读(md+html)
│   ├── claude-blog-zh/                  # 系列: Claude Blog 中文全文翻译(html)
│   └── notes/                           # 散篇笔记
│       ├── agent-ontology.md/.html
│       ├── ontology-101.html
│       └── harness-engineering-self-improvement.md/.html
├── investment/
│   ├── roadmap.md/.html                 # 投资学习路线
│   └── notes/
│       └── etf-strategies.md/.html      # ETF 投资策略详解
└── data-engineering/
    └── roadmap.md/.html                 # 数据工程学习路线(九章, 含 Ontology 支线)
```

规则:

- `.md` 是源文件, 同名 `.html` 由 `scripts/render-topic-docs.js` 生成, 两者一起提交。
- 散篇同类内容满 3 篇, 提升为系列子目录并建 `index.md`。
- 手写的独立 HTML(如 `ontology-101.html`)同样按主题归入 `notes/` 或系列目录。

## 4. 其他目录

| 路径 | 内容 | 规则 |
| --- | --- | --- |
| `scripts/` | 自动化源码 | 新脚本放这里; `_assets/` 不放脚本 |
| `scripts/templates/` | 内容生成模板 | 如 claude-blog-zh 页面风格模板 |
| `_sources/<主题>/` | 原始资料 | 抓取结果、书籍文件、中间产物; 已 gitignore |
| `_assets/` | 前端资源 | 目前只有 `style.css`, 优先复用已有类 |

## 5. 发布包规则

GitHub Actions 构建 `.pages/` 后发布, 只包含: 根目录入口 HTML、公开项目文档(md)、`_assets/*.css`、`topics/`、`.nojekyll`。

不包含: `_sources/`、`.env`/token/key、缓存和临时文件。

## 6. 新增位置速查

1. 学习内容 → `topics/<主题>/`(按 AGENTS.md 决策树选子目录)。
2. 自动化源码 → `scripts/`。
3. 原始资料 → `_sources/<主题>/`。
4. 私有任务/草稿/复盘 → 飞书。
5. 不能判断 → 先问用户, 不新增顶层目录。
