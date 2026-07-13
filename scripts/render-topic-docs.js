#!/usr/bin/env node
"use strict";

/*
 * 把 topics/**\/*.md 渲染成同名的静态 .html 文件。
 *
 * 背景: doc.html 原来用 fetch() 在浏览器里现读 markdown, 双击本地文件(file://)
 * 打开时会被浏览器 CORS 策略挡住, 报 "Failed to fetch"。这个脚本把同样的渲染
 * 逻辑挪到构建期, 直接生成可以双击打开的静态 HTML, 不再依赖运行时 fetch。
 *
 * 用法:
 *   node scripts/render-topic-docs.js            渲染 topics/ 下所有 .md
 *   node scripts/render-topic-docs.js --file topics/ai/agent-ontology.md   只渲染单个文件
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TOPICS_DIR = path.join(ROOT, "topics");

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

function makeRenderer(outDirAbs) {
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
    if (/\.md$/i.test(clean) && !clean.includes("..")) {
      const htmlTarget = clean.replace(/\.md$/i, ".html");
      const rel = relFrom(outDirAbs, htmlTarget); // 全新计算出的相对路径, 未转义过, 需要转义
      return `<a href="${escapeHtml(rel)}">${text}</a>`;
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

// ---------- 页面模板 ----------

function navSection(mdRootRel) {
  if (mdRootRel === "topics/english-roadmap.md" || mdRootRel.startsWith("topics/english/")) return "english";
  if (mdRootRel === "topics/k12-roadmap.md" || mdRootRel.startsWith("topics/k12/")) return "k12";
  if (mdRootRel === "topics/investment-roadmap.md" || mdRootRel.startsWith("topics/investment/")) return "investment";
  return "ai";
}

function pageTemplate({ title, sourcePath, bodyHtml, outDirAbs, section }) {
  const cssRel = relFrom(outDirAbs, "_assets/style.css") + "?v=20260711-static";
  const homeRel = relFrom(outDirAbs, "index.html");
  const aiRel = relFrom(outDirAbs, "ai.html");
  const englishRel = relFrom(outDirAbs, "english.html");
  const k12Rel = relFrom(outDirAbs, "k12.html");
  const investmentRel = relFrom(outDirAbs, "investment.html");
  const navClass = key => (key === section ? ' class="active"' : "");

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
      <a href="${escapeHtml(englishRel)}"${navClass("english")}>英语</a>
      <a href="${escapeHtml(k12Rel)}"${navClass("k12")}>学科</a>
      <a href="${escapeHtml(investmentRel)}"${navClass("investment")}>投资</a>
    </nav>
  </header>

  <section class="page-intro doc-intro">
    <div>
      <span class="topic-kicker">Document</span>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(sourcePath)}</p>
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

function renderOne(absMdPath) {
  const rootRel = rootRelative(absMdPath);
  const outDirAbs = path.dirname(absMdPath);
  const markdown = fs.readFileSync(absMdPath, "utf8");
  const { renderMarkdown } = makeRenderer(outDirAbs);
  const bodyHtml = renderMarkdown(markdown);
  const firstHeading = markdown.match(/^#\s+(.+)$/m);
  const title = firstHeading
    ? firstHeading[1].replace(/[*_`]/g, "").trim()
    : path.basename(absMdPath, ".md").replace(/[-_]+/g, " ");
  const section = navSection(rootRel);
  const html = pageTemplate({ title, sourcePath: rootRel, bodyHtml, outDirAbs, section });
  const outPath = absMdPath.replace(/\.md$/i, ".html");
  fs.writeFileSync(outPath, html);
  return rootRelative(outPath);
}

function main() {
  const args = parseArgs(process.argv);
  const targets = args.file ? [path.resolve(ROOT, args.file)] : walkMdFiles(TOPICS_DIR);
  const results = targets.map(renderOne);
  console.log(JSON.stringify({ ok: true, count: results.length, files: results }, null, 2));
}

main();
