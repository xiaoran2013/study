# 目录结构说明

## 1. 设计原则

项目目录按职责分层, 不按"临时方便"堆文件。

核心原则:

- 根目录只放站点入口、项目文档和必要配置。
- `_assets/` 只放前端静态资源。
- `scripts/` 只放自动化源码。
- 公开内容和私有过程分离。
- GitHub Pages 只发布 `.pages/` 清洁包。
- 飞书承载私有草稿、任务、审核和复盘。

## 2. 顶层结构

```text
.
├── index.html                 # 首页
├── ai.html                    # AI 学习页
├── english.html                # 英语学习页
├── k12.html                   # 学科学习页
├── investment.html            # 投资学习页
├── doc.html                   # Markdown/JSON 阅读器
├── README.md                  # 项目入口说明
├── PROJECT_BACKGROUND.md      # 项目总纲
├── DIRECTORY_STRUCTURE.md     # 目录结构说明
├── AGENTS.md                  # Agent 操作手册
├── ITERATION_LOG.md           # 迭代记录
├── _assets/                   # 前端资源
├── topics/                    # 主题学习路线和专题笔记
│   ├── ai-roadmap.md/.html    # AI 学习路线
│   ├── english-roadmap.md/.html    # 英语学习路线
│   ├── k12-roadmap.md/.html   # 学科学习路线
│   ├── investment-roadmap.md/.html # 投资学习路线
│   ├── ai/                    # AI 专题笔记
│   │   ├── claude-blog/       # Claude Blog 讲解式译读(md+html)
│   │   ├── claude-blog-zh/    # Claude Blog 中文全文翻译(html)
│   │   ├── agent-ontology.html     # 本体论与 AI Agent
│   │   ├── ontology-101.html  # 本体开发 101
│   │   └── harness-engineering-self-improvement.html
│   ├── investment/            # 投资专题笔记(ETF 策略等)
│   └── k12/                   # 学科专题笔记
├── scripts/                   # 自动化脚本
├── _sources/                  # AI 处理用的原始材料(本地, 不进 Git)
├── .github/workflows/         # GitHub Pages 发布工作流
└── .nojekyll                  # GitHub Pages 静态站点标记
```

## 3. 公开站点目录

这些目录和文件可以进入 GitHub, 也可以进入 GitHub Pages 发布包。

| 路径 | 内容 | 说明 |
| --- | --- | --- |
| `index.html` | 首页 | 个人学习工作台入口 |
| `ai.html` | AI 页 | AI 学习主题入口 |
| `english.html` | 英语页 | 英语学习主题入口 |
| `k12.html` | 学科页 | 小学、初中和学科学习入口 |
| `investment.html` | 投资页 | 投资学习主题入口 |
| `doc.html` | 文档阅读器 | 读取公开 Markdown/JSON |
| `_assets/*.css` | 样式 | 页面样式 |
| `topics/` | 专题路线 | AI、英语、学科、投资等主题, 用 `.md` 撰写, 用 `scripts/render-topic-docs.js` 生成同名 `.html` 供直接浏览 |

## 4. 本地自动化目录

这些目录可以提交源码, 但不能混入密钥或未脱敏材料。

| 路径 | 内容 | 说明 |
| --- | --- | --- |
| `scripts/` | 自动化源码 | 资料收集、翻译、`topics/**/*.md → .html` 渲染等脚本 |

规则:

- 新增主流程脚本放 `scripts/`。
- `_assets/` 不放 Python、Node 或 shell 脚本。

## 5. 本地私有过程目录

这些目录默认不进入 GitHub, 也不进入 GitHub Pages。

| 路径 | 内容 | 说明 |
| --- | --- | --- |
| `_sources/` | 原始资料 | 搜索结果、抓取内容、模型输入输出 |

这些内容如果要公开, 必须先生成脱敏后的摘要或正式材料, 放进 `topics/`。

## 6. 飞书承接内容

飞书不替代目录结构, 它承接不适合放 GitHub 的动态工作台内容。

推荐飞书结构:

```text
个人学习系统
├── 00-每日工作台
├── 01-内容审核
├── 02-AI 学习
├── 03-英语学习
├── 04-学科学习
├── 90-素材库
└── 99-复盘归档
```

飞书适合放:

- 今日任务、学习计划和复习队列。
- AI 草稿、审核意见和发布前修改记录。
- 私有素材、附件、PDF、截图和长文摘录。
- 多维表格形式的主题库、文章池、候选池。
- 每日/每周复盘。

## 7. 发布包规则

GitHub Actions 构建 `.pages/` 后再发布。`.pages/` 只应该包含:

- 根目录 HTML 页面。
- 公开 Markdown 文档。
- `_assets/*.css`。
- `topics/`。
- `.nojekyll`。

`.pages/` 不应包含:

- `_sources/`。
- `.env`, token, key, credential 文件。
- Python 缓存、临时脚本、调试输出。

## 8. 新增目录规则

新增目录前先判断:

1. 是否公开展示? 放公开站点目录。
2. 是否自动化源码? 放 `scripts/`。
3. 是否原始资料或过程产物? 放 `_sources/`。
4. 是否任务、审核、复盘或素材管理? 放飞书。

不能判断时, 先不要新增顶层目录。
