# Agent 操作手册

## 1. 项目定位

这是一个**用 Claude 持续学习和沉淀的个人工作台**：内容来自与 Claude 的对话和定时任务，学到什么就沉淀什么，**范围不预设、随积累自然生长**。产出是纯静态站点，通过 GitHub Pages 发布。

- 站点: https://xiaoran2013.github.io/study/
- 仓库: `git@github.com:xiaoran2013/study.git`，主分支 `main`
- 本地目录: `/Users/iris/Documents/my-study`

相关文档: `PROJECT_BACKGROUND.md`(总纲)、`DIRECTORY_STRUCTURE.md`(目录结构)、`ITERATION_LOG.md`(迭代记录)。

## 2. 内容存放决策(核心规则)

新内容由 AI 自行判断存放位置, 按下面的决策树走, **不要平铺、不要临时堆在根目录**:

1. **是学习内容吗?**
   - 不是(站点页面/脚本/项目文档) → 按第 3 节目录职责放。
   - 是 → 继续。
2. **属于哪个主题?** `ai` / `investment` / `data-engineering` → 放 `topics/<主题>/`。
   - 没有合适主题时, 先和用户确认再新建 `topics/<新主题>/` + 根目录入口页 + 全局导航项。不轻易新增主题。
3. **主题内放哪里?**
   - 学习路线 → `topics/<主题>/roadmap.md`(每主题一份)。
   - 属于已有系列(如 `ai/claude-blog/` 译读、`ai/claude-blog-zh/` 全译、`k12/math/`) → 放对应系列子目录。
   - 散篇笔记 → `topics/<主题>/notes/`。
   - 同类散篇积累到 3 篇以上, 提升为系列子目录并建 `index.md`。
4. **原始材料**(抓取结果、书籍文件、模型中间产物) → `_sources/<主题>/`, 已被 gitignore, 只留本地。

命名: 文件和目录用小写 kebab-case 英文名(如 `etf-strategies.md`); 中文标题写在 Markdown 一级标题里。

## 3. 目录职责

| 路径 | 职责 |
| --- | --- |
| `index.html` | 首页(沉淀流: 最近沉淀 + 生长方式 + 主题现状) |
| `ai.html` / `investment.html` / `data-engineering.html` | 主题入口页 |
| `_assets/` | 样式等前端资源, 不放脚本 |
| `topics/<主题>/` | 学习内容长文(md 源 + 生成的同名 html) |
| `wiki/` | 概念卡片网络(平铺, LLM 维护, 见第 5 节) |
| `scripts/` | 自动化脚本源码 |
| `scripts/templates/` | 内容生成模板(如 claude-blog-zh 页面风格) |
| `_sources/` | 原始材料, 本地保留不进 Git |
| `.github/workflows/pages.yml` | Pages 发布工作流(白名单式复制) |

已废弃: `doc.html`(运行时 fetch 阅读器)。所有学习内容都生成静态 HTML 直链, 不要再引用 `doc.html?src=...`。

## 4. 新增内容的标准流程

每次沉淀一篇新内容, 完整走完这五步:

1. 按第 2 节决策树把 `.md`(或手写 `.html`)放到正确位置。
2. 运行 `node scripts/render-topic-docs.js`(或 `--file <path>` 单渲染), 生成同名 `.html`, md 和 html 一起提交。
3. 在对应主题入口页(如 `ai.html`)加卡片入口。
4. 在 `index.html` 的"最近沉淀"区块加一条(格式: 标题 + `MM-DD · 一句话描述`, 新的在前, 保留最近 8 条左右)。
5. 在 `ITERATION_LOG.md` 记一条, 然后提交推送。

Markdown 内部链接写法: 链接其他 `.md` 用**根相对路径**(如 `topics/ai/notes/xxx.md`), 渲染脚本会自动换算成正确的相对 `.html` 链接; 链接纯 `.html` 页面用相对当前文件的路径。(`wiki/` 内链接规则不同, 见第 5 节。)

## 5. Wiki 维护(概念卡片网络)

`wiki/` 是卡帕西 LLM Wiki 模式的概念卡片层: 每张卡片一个概念, 互相链接, 由 AI 随沉淀持续维护。`topics/` 放长文, wiki 卡片从长文提炼并链回原文。目录 `wiki/index.md`, 操作日志 `wiki/log.md`(追加式, 格式 `## [YYYY-MM-DD] ingest|lint|refactor · 摘要`)。

**格式三规则**(保证 GitHub 网页渲染 / Obsidian / Pages 站点三方兼容):

1. `wiki/` 保持**平铺**; 卡片互链一律用标准 Markdown 链接 + 同目录文件名(如 `[SHACL](shacl.md)`), **不用 `[[wikilink]]`**(GitHub 不渲染); 链出 wiki 用相对路径(如 `../topics/ai/notes/xxx.md`)。
2. 卡片头部用 YAML frontmatter 存元数据(`tags`、`aliases`、`updated`), 正文只用标准 Markdown, 不用 callout/嵌入/`#标签` 等 Obsidian 专有语法。
3. 反向链接不手工维护: 渲染脚本自动在 HTML 里生成"被引用于"区块, Obsidian 用原生反链面板。

**三个工作流**:

- **Ingest**: 沉淀长文进 `topics/` 时, 同步提炼/更新相关卡片(新概念建页、老概念补充), 维护互链, 更新 `wiki/index.md`, `wiki/log.md` 追加一行, 跑渲染脚本。
- **Query**: 回答知识问题时优先查 wiki(index → 卡片 → 链回长文); 有沉淀价值的答案回填成新卡片。
- **Lint**: 跑 `node scripts/wiki-lint.js`(死链/孤儿页/index 缺漏, 提交前应零告警); 语义矛盾和过期结论由 AI 定期检查。

**Obsidian 使用**(用户侧一次性设置): 直接把仓库根目录作为 vault 打开; 设置里关闭"使用 Wikilinks"、新链接格式选"相对路径"; `.obsidian/` 已 gitignore 不入库。

## 6. 主题现状

- **AI**: 持续更新。Claude Blog 译读(`claude-blog/`)与全译(`claude-blog-zh/`)、本体论、Harness 工程等笔记。
- **投资**: 持续更新。只做投资产品和策略的结构化读书笔记, 不做行情、评级或组合追踪(股票投研在独立的 `codex-stock/trade` 项目)。
- **数据工程**: 2026-07-14 新开。管道工程(建模/数仓/流处理/编排)与语义工程(本体/语义层/治理)双主线, 与 AI 主题的本体系 wiki 卡片互相打通。
- 英语、K12 主题已于 2026-07-13 整体移除(内容在 Git 历史 v4.4 之前可找回); 新主题等实际学到时再开。

## 7. 发布规则

默认流程: 修改 → 检查(第 8 节) → 密钥扫描 → `git add <相关文件>` → 提交 → 推送。推送后 Actions 自动构建 `.pages/` 发布包部署, 线上 1-3 分钟更新。只有用户明确说"只本地改/不要提交/不要推送"时才留在本地。

默认应提交: 入口 HTML、`_assets/*.css`、根目录项目文档、`topics/`、`wiki/`、`scripts/`、`.github/workflows/`、`.nojekyll`。
默认不提交: `_sources/`、`.env`/token/key/credential、缓存和临时文件。`git add -A` 前先确认所有变更都适合公开。

## 8. 提交前检查

页面或内容改动后, 起本地服务抽查相关页面返回 200:

```bash
python3 -m http.server 8080
```

```bash
python3 - <<'PY'
from urllib.request import urlopen
for p in ['/', '/ai.html', '/investment.html', '/wiki/index.html',
          '/topics/ai/roadmap.html', '/topics/investment/notes/etf-strategies.html']:
    with urlopen('http://localhost:8080' + p, timeout=5) as r:
        print(p, r.status)
PY
```

密钥扫描:

```bash
rg -n --hidden --glob '!.git/**' '(sk-[A-Za-z0-9_-]{20,}|API_KEY\s*=\s*[^\s]+|GITHUB_TOKEN\s*=\s*[^\s]+|ghp_[A-Za-z0-9_]+|BEGIN (RSA|OPENSSH|EC|DSA) PRIVATE KEY)' .
```

纯文案改动可不跑完整检查, 但要在回复里说明做了哪些检查。

## 9. 关键脚本

| 脚本 | 用途 |
| --- | --- |
| `scripts/render-topic-docs.js` | 把 `topics/**/*.md` 和 `wiki/*.md` 渲染成带站点导航的同名 `.html` |
| `scripts/wiki-lint.js` | wiki 健康检查(死链/孤儿页/index 缺漏), 有问题退出码 1 |
| `scripts/translate-claude-blog-one.js` | Claude Blog 文章翻译(单篇) |
| `scripts/translate-claude-blog-batch.js` | Claude Blog 文章翻译(批量, `--limit N --skip-existing`) |
| `scripts/templates/claude-blog-zh-style.txt` | claude-blog-zh 全译页面的风格模板 |

## 10. 飞书(可选)

飞书 CLI `lark-cli` 已接入, 承接私有内容: 草稿、任务队列、复盘、素材。读操作可直接执行; 写操作先确认目标; 不把密钥写入飞书; 飞书内容进 GitHub 前先脱敏成 Markdown/HTML。检查: `lark-cli auth status`。

## 11. 边界

不应该做:

- 把 API key、token、私钥或 `.env` 提交进仓库或写入飞书。
- 未经用户明确要求回滚或删除已有内容。
- 未经用户确认新建主题(当前是 AI、投资、数据工程)。
- 把首页改回预设计划/打卡式仪表盘(项目形态是沉淀流, 见 `ITERATION_LOG.md` v4.3)。
