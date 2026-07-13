#!/usr/bin/env node
"use strict";

/*
 * 把 topics/**\/*.md 和 wiki/*.md 渲染成同名的静态 .html 文件。
 *
 * 背景: doc.html 原来用 fetch() 在浏览器里现读 markdown, 双击本地文件(file://)
 * 打开时会被浏览器 CORS 策略挡住, 报 "Failed to fetch"。这个脚本把同样的渲染
 * 逻辑挪到构建期, 直接生成可以双击打开的静态 HTML, 不再依赖运行时 fetch。
 *
 * 用法:
 *   node scripts/render-topic-docs.js            渲染 topics/ 和 wiki/ 下所有 .md
 *   node scripts/render-topic-docs.js --file topics/ai/agent-ontology.md   只渲染单个文件
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TOPICS_DIR = path.join(ROOT, "topics");
const WIKI_DIR = path.join(ROOT, "wiki");

// 渲染过程中无法解析的 .md 链接, 汇总进输出 JSON 提醒人工处理
const WARNINGS = [];

function parseArgs(argv) {
  const args = { file: "" };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--file") args.file = argv[++i];
  }
  return args;
}

function walkMdFiles(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walkMdFiles(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) out.push(full);
  }
  return out;
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function rootRelative(absPath) {
  return toPosix(path.relative(ROOT, absPath));
}

function relFrom(fromDirAbs, toRootRel) {
  const rel = toPosix(path.relative(fromDirAbs, path.join(ROOT, toRootRel)));
  return rel || ".";
}

function escapeHtml(value) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value ?? "").replace(/[&<>"']/g, char => map[char]);
}

// ---------- Markdown → HTML (端口自 doc.html 的渲染逻辑, 增加了有序列表支持) ----------

function makeRenderer(outDirAbs, sourceRootRel) {
  function docLink(href, text) {
    // href/text 在这里已经是 escapeHtml() 处理过的文本(来自调用方), 不要再转义一次
    if (/^#/.test(href)) {
      // 页内锚点(比如手写目录跳转到标题), 不需要新开标签页
      return `<a href="${href}">${text}</a>`;
    }
    if (/^(https?:|mailto:)/i.test(href)) {
      return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
    }
    const clean = href.replace(/^\.\//, "");
    if (/\.md$/i.test(clean)) {
      // 双轨解析: 先按"相对当前文件目录"(wiki 同目录链接、../ 跨目录链接,
      // GitHub 网页也按这个语义渲染), 目标不存在时回退按仓库根相对(topics/ 存量写法)。
      const relCandidate = path.resolve(outDirAbs, clean);
      const rootCandidate = clean.includes("..") ? null : path.resolve(ROOT, clean);
      const targetAbs = fs.existsSync(relCandidate)
        ? relCandidate
        : rootCandidate && fs.existsSync(rootCandidate)
          ? rootCandidate
          : null;
      if (targetAbs) {
        const rel = toPosix(path.relative(outDirAbs, targetAbs)).replace(/\.md$/i, ".html");
        return `<a href="${escapeHtml(rel || ".")}">${text}</a>`;
      }
      WARNINGS.push(`unresolved md link "${href}" in ${sourceRootRel}`);
      return `<a href="${href}">${text}</a>`;
    }
    return `<a href="${href}">${text}</a>`;
  }

  function inlineMarkdown(value) {
    let html = escapeHtml(value);
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    // label 在这里已经是 escapeHtml(value) 处理过的文本, 不要再转义一次(否则 & 会变成 &amp;amp;)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => docLink(href, label));
    return html;
  }

  function isTableStart(lines, index) {
    return lines[index]?.trim().startsWith("|") && /^\s*\|?\s*:?-{3,}:?\s*\|/.test(lines[index + 1] || "");
  }

  function renderTable(lines, start) {
    const rows = [];
    let index = start;
    while (index < lines.length && lines[index].trim().startsWith("|")) {
      rows.push(lines[index].trim());
      index += 1;
    }
    const cells = row => row.replace(/^\||\|$/g, "").split("|").map(cell => inlineMarkdown(cell.trim()));
    const head = cells(rows[0]);
    const body = rows.slice(2).map(row => cells(row));
    const html = `<div class="doc-table-wrap"><table><thead><tr>${head.map(cell => `<th>${cell}</th>`).join("")}</tr></thead><tbody>${body.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    return { html, next: index };
  }

  function slugify(text) {
    return text
      .replace(/[`*]/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w一-龥-]/g, "");
  }

  function renderMarkdown(markdown) {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const blocks = [];
    const usedIds = new Map();
    let index = 0;
    let inCode = false;
    let code = [];
    let list = [];
    let listType = null; // 'ul' | 'ol'

    function flushList() {
      if (!list.length) return;
      const tag = listType === "ol" ? "ol" : "ul";
      blocks.push(`<${tag}>${list.map(item => `<li>${inlineMarkdown(item)}</li>`).join("")}</${tag}>`);
      list = [];
      listType = null;
    }

    while (index < lines.length) {
      const line = lines[index];
      const trimmed = line.trim();

      if (trimmed.startsWith("```")) {
        if (inCode) {
          blocks.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
          code = [];
          inCode = false;
        } else {
          flushList();
          inCode = true;
        }
        index += 1;
        continue;
      }

      if (inCode) {
        code.push(line);
        index += 1;
        continue;
      }

      if (!trimmed) {
        flushList();
        index += 1;
        continue;
      }

      if (isTableStart(lines, index)) {
        flushList();
        const table = renderTable(lines, index);
        blocks.push(table.html);
        index = table.next;
        continue;
      }

      const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (heading) {
        flushList();
        const level = heading[1].length;
        const text = heading[2];
        let id = slugify(text) || `section-${blocks.length}`;
        if (usedIds.has(id)) {
          const n = usedIds.get(id) + 1;
          usedIds.set(id, n);
          id = `${id}-${n}`;
        } else {
          usedIds.set(id, 0);
        }
        blocks.push(`<h${level} id="${escapeHtml(id)}">${inlineMarkdown(text)}</h${level}>`);
        index += 1;
        continue;
      }

      const orderedItem = trimmed.match(/^\d+\.\s+(.+)$/);
      if (orderedItem) {
        if (listType && listType !== "ol") flushList();
        listType = "ol";
        list.push(orderedItem[1]);
        index += 1;
        continue;
      }

      if (/^[-*]\s+/.test(trimmed)) {
        if (listType && listType !== "ul") flushList();
        listType = "ul";
        list.push(trimmed.replace(/^[-*]\s+/, ""));
        index += 1;
        continue;
      }

      if (trimmed.startsWith("> ")) {
        flushList();
        blocks.push(`<blockquote>${inlineMarkdown(trimmed.slice(2))}</blockquote>`);
        index += 1;
        continue;
      }

      flushList();
      blocks.push(`<p>${inlineMarkdown(trimmed)}</p>`);
      index += 1;
    }
    flushList();
    return blocks.join("\n");
  }

  return { renderMarkdown };
}

// ---------- frontmatter ----------

// 剥离并解析文件头部的 YAML frontmatter(只支持 "key: value" 平铺键值,
// 满足 wiki 卡片元数据即可, 不引入 YAML 依赖)。
function splitFrontmatter(markdown) {
  const match = markdown.match(/^---[ \t]*\n([\s\S]*?)\n---[ \t]*\n?/);
  if (!match) return { meta: {}, body: markdown };
  const meta = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: markdown.slice(match[0].length) };
}

// ---------- wiki 反向链接 ----------

// 扫描 wiki/ 全部卡片, 建 "文件名 → 入链来源" 映射。只统计同目录 .md 链接
// (wiki 平铺约定), index.md/log.md 是目录和日志, 不算内容入链。
function buildWikiBacklinks() {
  const backlinks = new Map(); // 文件名 → [{ file, title }]
  if (!fs.existsSync(WIKI_DIR)) return backlinks;
  const skip = new Set(["index.md", "log.md"]);
  for (const absPath of walkMdFiles(WIKI_DIR)) {
    const name = path.basename(absPath);
    if (skip.has(name)) continue;
    const { body } = splitFrontmatter(fs.readFileSync(absPath, "utf8"));
    const heading = body.match(/^#\s+(.+)$/m);
    const title = heading ? heading[1].replace(/[*_`]/g, "").trim() : name.replace(/\.md$/i, "");
    for (const link of body.matchAll(/\[[^\]]+\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
      const target = link[1].replace(/^\.\//, "");
      if (!/\.md$/i.test(target) || target.includes("/")) continue;
      if (target === name || skip.has(target)) continue;
      if (!backlinks.has(target)) backlinks.set(target, []);
      if (!backlinks.get(target).some(entry => entry.file === name)) {
        backlinks.get(target).push({ file: name, title });
      }
    }
  }
  return backlinks;
}

function backlinksHtml(sources) {
  const links = sources
    .map(entry => `<a href="${escapeHtml(entry.file.replace(/\.md$/i, ".html"))}">${escapeHtml(entry.title)}</a>`)
    .join(" · ");
  return `<hr>\n<p><strong>被引用于</strong>: ${links}</p>`;
}

// ---------- 页面模板 ----------

function navSection(mdRootRel) {
  if (mdRootRel.startsWith("wiki/")) return "wiki";
  if (mdRootRel.startsWith("topics/investment/")) return "investment";
  return "ai";
}

function pageTemplate({ title, sourcePath, updated, bodyHtml, outDirAbs, section }) {
  const cssRel = relFrom(outDirAbs, "_assets/style.css") + "?v=20260711-static";
  const homeRel = relFrom(outDirAbs, "index.html");
  const aiRel = relFrom(outDirAbs, "ai.html");
  const investmentRel = relFrom(outDirAbs, "investment.html");
  const wikiRel = relFrom(outDirAbs, "wiki/index.html");
  const navClass = key => (key === section ? ' class="active"' : "");
  const sourceLine = updated ? `${sourcePath} · 更新于 ${updated}` : sourcePath;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} · 个人学习工作台</title>
<link rel="stylesheet" href="${escapeHtml(cssRel)}">
</head>
<body>
<div class="page doc-page">
  <header class="site-header">
    <a class="site-brand" href="${escapeHtml(homeRel)}">
      <strong>个人学习工作台</strong>
      <span>AI 自动内容生成与学习沉淀</span>
    </a>
    <nav class="site-nav" aria-label="主导航">
      <a href="${escapeHtml(homeRel)}"${navClass("home")}>首页</a>
      <a href="${escapeHtml(aiRel)}"${navClass("ai")}>AI</a>
      <a href="${escapeHtml(investmentRel)}"${navClass("investment")}>投资</a>
      <a href="${escapeHtml(wikiRel)}"${navClass("wiki")}>Wiki</a>
    </nav>
  </header>

  <section class="page-intro doc-intro">
    <div>
      <span class="topic-kicker">Document</span>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(sourceLine)}</p>
    </div>
  </section>

  <main class="doc-shell">
    <article class="doc-content">
${bodyHtml}
    </article>
  </main>
</div>
</body>
</html>
`;
}

function renderOne(absMdPath, wikiBacklinks) {
  const rootRel = rootRelative(absMdPath);
  const outDirAbs = path.dirname(absMdPath);
  const { meta, body } = splitFrontmatter(fs.readFileSync(absMdPath, "utf8"));
  const { renderMarkdown } = makeRenderer(outDirAbs, rootRel);
  let bodyHtml = renderMarkdown(body);
  const isWikiPage = rootRel.startsWith("wiki/");
  if (isWikiPage) {
    const sources = wikiBacklinks.get(path.basename(absMdPath)) || [];
    if (sources.length) bodyHtml += `\n${backlinksHtml(sources)}`;
  }
  const firstHeading = body.match(/^#\s+(.+)$/m);
  const title = firstHeading
    ? firstHeading[1].replace(/[*_`]/g, "").trim()
    : path.basename(absMdPath, ".md").replace(/[-_]+/g, " ");
  const section = navSection(rootRel);
  const html = pageTemplate({
    title,
    sourcePath: rootRel,
    updated: meta.updated || "",
    bodyHtml,
    outDirAbs,
    section,
  });
  const outPath = absMdPath.replace(/\.md$/i, ".html");
  fs.writeFileSync(outPath, html);
  return rootRelative(outPath);
}

function main() {
  const args = parseArgs(process.argv);
  const targets = args.file
    ? [path.resolve(ROOT, args.file)]
    : [
        ...walkMdFiles(TOPICS_DIR),
        ...(fs.existsSync(WIKI_DIR) ? walkMdFiles(WIKI_DIR) : []),
      ];
  const wikiBacklinks = buildWikiBacklinks();
  const results = targets.map(target => renderOne(target, wikiBacklinks));
  const output = { ok: true, count: results.length, files: results };
  if (WARNINGS.length) output.warnings = WARNINGS;
  console.log(JSON.stringify(output, null, 2));
}

main();
