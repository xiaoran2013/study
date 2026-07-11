# Agent 操作手册

## 1. 项目定位

这是一个个人使用的 **AI 驱动自动化内容生成与学习沉淀系统**。

系统会用 AI 和本地脚本收集资料、整理内容, 再通过静态网站和 GitHub Pages 提供长期浏览与复习入口。当前主题是 AI、英语、学科, 内容会陆续增加。

更多背景见:

- `PROJECT_BACKGROUND.md`: 项目总纲。
- `DIRECTORY_STRUCTURE.md`: 目录结构说明。

## 2. Agent 的职责边界

Agent/Codex 在本项目里是开发协作者和自动化协调者, 不是不可追溯的数据源。

应该做:

- 修改页面、脚本、文档。
- 运行本地检查和必要的预览。
- 按项目规则提交并推送公开站点改动。
- 使用飞书 CLI 管理私有知识、任务、草稿和审核记录。
- 帮助把 AI/英语/学科等主题内容结构化。

不应该做:

- 把真实 API key、token、私钥或 `.env` 文件提交进仓库或写入飞书文档。
- 在没有来源的情况下声称内容可追溯。
- 未经用户明确要求回滚或删除用户已有内容。

## 3. GitHub 与飞书职责

本项目采用双平台架构:

```text
GitHub = 公开静态站点、版本管理、Pages 发布
飞书 = 私有知识库、任务队列、草稿审核、过程复盘
```

### 放到 GitHub

满足以下条件的内容优先放 GitHub:

- 可以公开访问。
- 适合长期浏览和复习。
- 需要进入 Git 历史。
- 是静态站点运行所需页面、资源或文档。
- 是脱敏后的专题笔记或路线材料。

### 放到飞书

满足以下条件的内容优先放飞书:

- 私有学习计划、个人复盘、过程记录。
- AI 生成草稿、待审核内容、修改意见。
- 原始资料、摘录、附件、PDF、截图和临时材料。
- 任务队列、复习计划、内容审核表、主题库。
- 需要频繁编辑、筛选、状态流转或协作的内容。

### 同步原则

- 飞书中的内容经过确认后, 可以生成 Markdown/HTML 进入 GitHub。
- GitHub 只接收公开稳定内容。
- 飞书可以保存更多过程信息, 但同样不能保存真实密钥。

## 4. 发布规则

- 主分支: `main`
- 远端: 尚未配置, 首次推送前需要先 `git remote add origin <仓库地址>`。
- 本地目录: `/Users/iris/Documents/my-study`
- 本地预览: `http://localhost:8080/`
- 飞书 CLI: `lark-cli`

默认流程:

1. 修改文件。
2. 做必要检查。
3. 扫描明显密钥/凭证。
4. `git add <公开站点需要的文件>`
5. `git commit -m "<清晰说明本次变化>"`
6. `git push`

只有用户明确说"只本地改"、"不要提交"或"不要推送"时, 才允许把完成的改动留在本地。

推送后, 如果配置了 GitHub Actions, Pages 会自动部署, 线上通常需要 1-3 分钟更新。

## 5. 提交范围

不要把"完成修改后提交推送"理解成无条件 `git add -A`。提交前要判断文件是否属于公开静态站点或必要源码。

### 默认应该提交

- 页面入口: `index.html`, `ai.html`, `english.html`, `k12.html`, `doc.html`。
- 前端资源: `_assets/style.css`。
- 可公开阅读的文档: `README.md`, `PROJECT_BACKGROUND.md`, `DIRECTORY_STRUCTURE.md`, `AGENTS.md`, `ITERATION_LOG.md`。
- 可公开学习内容: `topics/`。
- 网站运行需要的配置: `.github/workflows/pages.yml`, `.nojekyll`。
- 自动化源码: `scripts/`。

### 默认不应提交

- `_sources/`: 原始搜索结果、抓取内容、模型消息。
- `__pycache__/`, `*.pyc`, 临时脚本和临时文件。
- `.env`, token, API key, 私钥或任何 credential 文件。

如果需要保留可追溯性, 可以把中间产物保存在本地, 或生成一份脱敏后的公开摘要再提交。

### 静态站点发布方式

GitHub Actions 会生成 `.pages/` 发布目录, 只复制公开页面、公开文档、公开内容和必要前端资源。私有目录不应进入发布包。

## 6. 飞书操作规则

飞书 CLI 已安装为 `lark-cli`。使用前先检查授权:

```bash
lark-cli auth status
lark-cli doctor
```

常用方向:

- `lark-cli docs --help`: 飞书文档。
- `lark-cli wiki --help`: 飞书知识库。
- `lark-cli base --help`: 多维表格。
- `lark-cli drive --help`: 云盘文件。
- `lark-cli task --help`: 任务。
- `lark-cli markdown --help`: Markdown 文件。

操作风险:

- 读操作可以直接执行。
- 写操作要确认目标文档、表格或知识库节点。
- 高风险写操作必须遵守 CLI 的 `--yes` 要求, 且用户必须明确确认。
- 不把 token、API key、私钥、`.env` 内容写入飞书。
- 飞书内容如果要进入 GitHub, 先转成脱敏后的 Markdown/HTML/JSON。

## 7. 提交前检查

### 页面改动

至少检查相关页面能返回 200:

```bash
python3 -m http.server 8080
```

```bash
python3 - <<'PY'
from urllib.request import urlopen
for p in ['/', '/ai.html', '/english.html', '/k12.html']:
    with urlopen('http://localhost:8080' + p, timeout=5) as r:
        print(p, r.status)
PY
```

如果改了文档阅读器或根目录 Markdown 文档, 也检查:

```bash
python3 - <<'PY'
from urllib.request import urlopen
for p in ['/doc.html?src=PROJECT_BACKGROUND.md', '/doc.html?src=AGENTS.md']:
    with urlopen('http://localhost:8080' + p, timeout=5) as r:
        print(p, r.status)
PY
```

如果新增或修改了 `topics/**/*.md`, 先跑 `node scripts/render-topic-docs.js` 生成对应 `.html`, 再抽查生成的页面能直接返回 200(不经过 `doc.html`):

```bash
python3 - <<'PY'
from urllib.request import urlopen
for p in ['/topics/ai-roadmap.html', '/topics/ai/agent-ontology.html']:
    with urlopen('http://localhost:8080' + p, timeout=5) as r:
        print(p, r.status)
PY
```

如果只是文档或纯页面文案改动, 可以不跑完整检查, 但要在最终回复里说明做了哪些检查。

### 密钥扫描

提交前扫描明显密钥:

```bash
rg -n --hidden --glob '!.git/**' '(sk-[A-Za-z0-9_-]{20,}|API_KEY\s*=\s*[^\s]+|GITHUB_TOKEN\s*=\s*[^\s]+|ghp_[A-Za-z0-9_]+|BEGIN (RSA|OPENSSH|EC|DSA) PRIVATE KEY)' .
```

同时确认没有 `.env` 或 secret 文件:

```bash
find . -maxdepth 3 -type f \( -name '.env' -o -name '.env.*' -o -name '*secret*' -o -name '*token*' -o -name '*credential*' \) -print
```

## 8. 目录职责

| 路径 | 职责 |
| --- | --- |
| `index.html` | 个人学习首页 |
| `ai.html` | AI 学习主题入口 |
| `english.html` | 英语学习主题入口 |
| `k12.html` | 小学、初中和各学科学习主题入口 |
| `doc.html` | Markdown/JSON 文档阅读器 |
| `_assets/` | 样式 |
| `_sources/` | AI 搜索、抓取、翻译的原始材料(本地) |
| `topics/` | AI、英语、学科等专题学习材料 |
| `scripts/` | 自动化脚本 |

## 9. 关键脚本

| 脚本 | 用途 |
| --- | --- |
| `scripts/translate-claude-blog-one.js` | AI 主题文章翻译/处理(单篇) |
| `scripts/translate-claude-blog-batch.js` | AI 主题文章翻译/处理(批量) |
| `scripts/render-topic-docs.js` | 把 `topics/**/*.md` 渲染成同名 `.html`, 供双击直接打开(见第 9.1 节) |

### 9.1 topics/ 下 Markdown 的发布方式

`topics/` 里的学习内容用 Markdown 撰写(方便编辑和飞书同步), 但发布时会额外生成同名的静态 `.html`:

- 原因: `doc.html` 用浏览器 `fetch()` 现读 `.md`, 双击本地文件(`file://`)会被 CORS 挡住, 报 "Failed to fetch"; 静态 `.html` 不依赖 `fetch`, 双击就能看。
- 规则: 新增或修改 `topics/**/*.md` 后, 运行一次 `node scripts/render-topic-docs.js`(或加 `--file <path>` 只渲染单个文件), 把生成的 `.html` 和 `.md` 一起提交。
- 站点入口(`index.html`/`ai.html`/`english.html`/`k12.html`/`topics/**/index.html`)应直接链接到 `topics/xxx.html`, 不再使用 `doc.html?src=...`。
- `doc.html` 仍然保留, 作为通用 fallback: 浏览 JSON/日志文件, 或预览还没跑生成脚本的新 Markdown 草稿时使用; 根目录的项目文档(`PROJECT_BACKGROUND.md`、`AGENTS.md`、`DIRECTORY_STRUCTURE.md`、`ITERATION_LOG.md`、`README.md`)目前仍只通过 `doc.html` 浏览, 没有生成静态 `.html`。

## 10. 自动化原则

1. **可追溯**: 原始资料要落盘。
2. **可回滚**: 有效修改必须进入 Git 历史。
3. **规则先于模型**: AI 负责搜索、抽取和草稿; 结构和发布护栏由脚本控制。
4. **低人工成本**: 能脚本化的步骤优先脚本化。
5. **公私分离**: 公开稳定内容进 GitHub, 私有过程和任务进飞书。

## 11. 网站导航原则

全局导航只保留:

- 首页
- AI
- 英语
- 学科

页面内动作放在内容区, 不混进顶栏。例如:

- AI/英语/学科的学习路线放在主题页内容区。
- 文档页显示 Markdown 一级标题, 文件名只作为路径信息。

## 12. 常用命令

本地预览:

```bash
python3 -m http.server 8080
```

批量翻译 Claude Blog 文章:

```bash
node scripts/translate-claude-blog-batch.js --limit 20 --skip-existing
```

提交并推送:

```bash
git add <公开站点需要的文件>
git commit -m "Update study workspace"
git push
```

只有确认当前所有变更都适合公开发布时, 才使用 `git add -A`。

飞书状态检查:

```bash
lark-cli auth status
lark-cli doctor
```

## 13. 当前状态速览

- v4.0: 从零重构的个人学习工作台, 去掉了原有的股票投研部分, 专注 AI/英语/学科。
- AI 主题: 已有 Claude Blog 中文译读专题目录。
- 英语主题: 当前仍以路线和素材池为主。
- 学科主题: 已有小学、初中和各学科入口, 初中数学已有互动练习页。
- 飞书 CLI: 已接入, 可用于 Docs/Wiki/Base/Drive/Task 等私有工作台能力。

## 14. 下一步方向

- 为 AI、英语、学科建立统一内容模板。
- 建立飞书知识库、任务表、内容审核表和每日复盘页。
- 增强 AI 主题的文章处理、Prompt 和 Agent 工作流沉淀。
- 增强英语主题的表达卡片和复习队列。
- 增加全站搜索、标签和最近更新。
- 内容会陆续增加, 后续可能扩展到更多学习主题。
