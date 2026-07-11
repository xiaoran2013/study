#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const BLOG_URL = "https://claude.com/blog";

function parseArgs(argv) {
  const args = { limit: 20, skipExisting: false };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--limit") args.limit = Number(argv[++i] || 20);
    else if (token === "--skip-existing") args.skipExisting = true;
    else if (token === "--help") {
      console.log("Usage: node scripts/translate-claude-blog-batch.js [--limit 20] [--skip-existing]");
      process.exit(0);
    }
  }
  return args;
}

async function fetchText(url) {
  try {
    const response = await fetch(url, {
      headers: { "user-agent": "codex-stock-ai-workbench/1.0" }
    });
    if (!response.ok) throw new Error(`Fetch failed: ${url} HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
    const result = spawnSync("curl", ["-L", "--max-time", "45", "-s", url], {
      cwd: ROOT,
      encoding: "utf8"
    });
    if (result.status !== 0 || !result.stdout) {
      throw new Error(`Fetch failed: ${error.message}; curl: ${(result.stderr || result.stdout || "").trim()}`);
    }
    return result.stdout;
  }
}

function linksFromBlog(html) {
  const seen = new Set();
  const links = [];
  const regex = /href=["']\/blog\/([^"'/#?]+)["']/g;
  let match;
  while ((match = regex.exec(html))) {
    const slug = match[1];
    if (seen.has(slug)) continue;
    seen.add(slug);
    links.push({ slug, url: `https://claude.com/blog/${slug}` });
  }
  return links;
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&mdash;/g, "-")
    .replace(/&ndash;/g, "-");
}

function stripTags(value) {
  return decodeEntities(String(value || "").replace(/<[^>]+>/g, "")).trim();
}

function extractJsonLd(html) {
  const match = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!match) return {};
  try {
    return JSON.parse(stripTags(match[1]));
  } catch {
    return {};
  }
}

async function enrichWithMeta(item) {
  const html = await fetchText(item.url);
  const ld = extractJsonLd(html);
  const date = stripTags(ld.datePublished || "");
  const title = stripTags(ld.headline || item.slug);
  return {
    ...item,
    title,
    date,
    dateMs: date ? Date.parse(date) : 0
  };
}

function runArticle(item) {
  const result = spawnSync("node", [
    "scripts/translate-claude-blog-one.js",
    "--url", item.url,
    "--slug", item.slug
  ], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: String(result.stdout || "").trim(),
    stderr: String(result.stderr || "").trim()
  };
}

function readJson(relativePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
  } catch {
    return fallback;
  }
}

function firstHeading(relativePath, fallback) {
  try {
    const text = fs.readFileSync(path.join(ROOT, relativePath), "utf8");
    const match = text.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : fallback;
  } catch {
    return fallback;
  }
}

function writeIndex(items) {
  const lines = [
    "# Claude Blog 中文讲解",
    "",
    "这里收集 Claude Blog 最近文章的中文讲解稿。每篇聚焦原文内容本身: 主题、结构、核心概念、主体讲解、关键术语和文章逻辑。",
    "",
    `更新范围: 最近 ${items.length} 篇文章`,
    "",
    "## 文章列表",
    ""
  ];

  for (const item of items) {
    const meta = readJson(`_sources/ai/claude-blog/${item.slug}/meta.json`, {});
    const notePath = `topics/ai/claude-blog/${item.slug}.md`;
    const title = firstHeading(notePath, meta.title || item.slug);
    const originalTitle = meta.title && meta.title !== title ? ` / ${meta.title}` : "";
    const date = meta.date ? ` · ${meta.date}` : "";
    const category = meta.category ? ` · ${meta.category}` : "";
    lines.push(`- [${title}](${notePath})${originalTitle}${date}${category}`);
  }

  lines.push(
    "",
    "## 整理原则",
    "",
    "- 不做逐段全文翻译。",
    "- 不加入个人项目映射、实践模板、检查清单或自测题。",
    "- 只围绕原文内容做中文讲解，并保留原文链接方便核对。"
  );

  const outPath = path.join(ROOT, "topics/ai/claude-blog/index.md");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${lines.join("\n")}\n`);
}

async function main() {
  const args = parseArgs(process.argv);
  const html = await fetchText(BLOG_URL);
  const links = linksFromBlog(html);
  if (!links.length) throw new Error("No Claude Blog links found");
  const enriched = [];
  for (const [index, item] of links.entries()) {
    console.log(`[meta ${index + 1}/${links.length}] ${item.slug}`);
    enriched.push(await enrichWithMeta(item));
  }
  const items = enriched
    .sort((a, b) => (b.dateMs || 0) - (a.dateMs || 0))
    .slice(0, args.limit);

  const results = [];
  for (const [index, item] of items.entries()) {
    const notePath = path.join(ROOT, "topics/ai/claude-blog", `${item.slug}.md`);
    if (args.skipExisting && fs.existsSync(notePath)) {
      results.push({ ...item, ok: true, skipped: true });
      console.log(`[${index + 1}/${items.length}] skipped ${item.slug}`);
      continue;
    }
    console.log(`[${index + 1}/${items.length}] generating ${item.slug}`);
    const result = runArticle(item);
    results.push({ ...item, ...result });
    if (!result.ok) {
      console.error(result.stderr || result.stdout || `failed: ${item.slug}`);
      process.exit(result.status || 1);
    }
  }

  writeIndex(items);
  console.log(JSON.stringify({
    ok: true,
    count: items.length,
    articles: results.map(item => ({ slug: item.slug, ok: item.ok, skipped: Boolean(item.skipped) }))
  }, null, 2));
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
