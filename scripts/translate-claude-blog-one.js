#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const args = {
    url: "",
    slug: "",
    outDir: "topics/ai/claude-blog",
    sourceDir: "_sources/ai/claude-blog"
  };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--url") args.url = argv[++i];
    else if (token === "--slug") args.slug = argv[++i];
    else if (token === "--out-dir") args.outDir = argv[++i];
    else if (token === "--source-dir") args.sourceDir = argv[++i];
    else if (token === "--help") {
      console.log("Usage: node scripts/translate-claude-blog-one.js --url https://claude.com/blog/getting-started-with-loops");
      process.exit(0);
    }
  }
  if (!args.url) {
    console.error("Missing required flag: --url");
    process.exit(2);
  }
  return args;
}

function safeName(value) {
  return String(value || "")
    .replace(/^https?:\/\//, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

async function fetchHtml(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "codex-stock-ai-workbench/1.0"
      }
    });
    if (!response.ok) throw new Error(`Fetch failed: HTTP ${response.status}`);
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
  return decodeEntities(String(value || "").replace(/<[^>]+>/g, ""))
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
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

function extractMeta(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i"));
  return match ? decodeEntities(match[1]).trim() : "";
}

function htmlToMarkdown(html) {
  let value = html;
  value = value.replace(/<script[\s\S]*?<\/script>/gi, "");
  value = value.replace(/<style[\s\S]*?<\/style>/gi, "");
  value = value.replace(/<figure[\s\S]*?<table([\s\S]*?)<\/table>[\s\S]*?<\/figure>/gi, (_, table) => {
    const rows = [];
    const rowMatches = table.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    for (const row of rowMatches) {
      const cells = [];
      const cellMatches = row.match(/<t[hd][\s\S]*?<\/t[hd]>/gi) || [];
      for (const cell of cellMatches) cells.push(stripTags(cell).replace(/\s+/g, " "));
      rows.push(cells);
    }
    if (!rows.length) return "";
    const width = rows[0].length;
    const header = `| ${rows[0].join(" | ")} |`;
    const sep = `| ${Array.from({ length: width }, () => "---").join(" | ")} |`;
    const body = rows.slice(1).map(row => `| ${row.join(" | ")} |`).join("\n");
    return `\n\n${header}\n${sep}\n${body}\n\n`;
  });
  value = value.replace(/<pre[\s\S]*?<code[^>]*>([\s\S]*?)<\/code>[\s\S]*?<\/pre>/gi, (_, code) => `\n\n\`\`\`\n${stripTags(code)}\n\`\`\`\n\n`);
  value = value.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, text) => `\n\n## ${stripTags(text)}\n\n`);
  value = value.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, text) => `\n\n### ${stripTags(text)}\n\n`);
  value = value.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, text) => `\n- ${stripTags(text).replace(/\n+/g, " ")}`);
  value = value.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, text) => `\n\n${stripTags(text)}\n\n`);
  value = value.replace(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => `[${stripTags(text)}](${decodeEntities(href)})`);
  value = value.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**");
  value = value.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*");
  value = value.replace(/<figure[\s\S]*?<\/figure>/gi, "");
  return stripTags(value)
    .replace(/^-\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractArticle(html) {
  const ld = extractJsonLd(html);
  const title = ld.headline || extractMeta(html, "og:title").replace(/\s+\|\s+Claude by Anthropic$/, "");
  const description = ld.description || extractMeta(html, "description") || extractMeta(html, "og:description");
  const date = ld.datePublished || "";
  const categoryMatch = html.match(/Category[\s\S]{0,500}?href=["'][^"']*\/category\/[^"']+["'][^>]*>([\s\S]*?)<\/a>/i);
  const productMatch = html.match(/Product[\s\S]{0,500}?<div class=["'][^"']*u-text-style-body-3[^"']*["']>([\s\S]*?)<\/div>/i);
  const bodyMatch = html.match(/<div class=["']u-rich-text-blog[^"']*["'][^>]*>([\s\S]*?)<div class=["']faq_section_wrap/i);
  if (!bodyMatch) throw new Error("Could not find article body");
  return {
    title: stripTags(title),
    description: stripTags(description),
    date: stripTags(date),
    category: categoryMatch ? stripTags(categoryMatch[1]) : "",
    product: productMatch ? stripTags(productMatch[1]) : "",
    body: htmlToMarkdown(bodyMatch[1])
  };
}

function writeText(relativePath, value) {
  const fullPath = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, value);
}

function runMmx(messagesPath) {
  const authArgs = process.env.MMX_API_KEY ? ["--api-key", process.env.MMX_API_KEY] : [];
  const result = spawnSync("mmx", [
    ...authArgs,
    "text", "chat",
    "--messages-file", path.join(ROOT, messagesPath),
    "--model", "MiniMax-M2.7",
    "--max-tokens", "7000",
    "--non-interactive",
    "--quiet",
    "--output", "json"
  ], {
    cwd: ROOT,
    encoding: "utf8"
  });
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || "mmx command failed").trim());
  }
  return result.stdout.trim();
}

function responseText(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") return parsed;
    if (typeof parsed.content === "string") return parsed.content;
    if (Array.isArray(parsed.content)) {
      return parsed.content.map(item => item.text || item.content || "").join("\n").trim();
    }
    if (parsed.message?.content) return responseText(JSON.stringify(parsed.message));
    if (parsed.choices?.[0]?.message?.content) return parsed.choices[0].message.content;
    if (parsed.data?.choices?.[0]?.message?.content) return parsed.data.choices[0].message.content;
    return JSON.stringify(parsed, null, 2);
  } catch {
    return raw;
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const slug = args.slug || safeName(new URL(args.url).pathname.split("/").filter(Boolean).pop() || "claude-blog");
  const sourceBase = `${args.sourceDir}/${slug}`;
  const outPath = `${args.outDir}/${slug}.md`;

  const html = await fetchHtml(args.url);
  const article = extractArticle(html);
  writeText(`${sourceBase}/source.md`, `# ${article.title}\n\n${article.description}\n\n${article.body}\n`);
  writeText(`${sourceBase}/meta.json`, `${JSON.stringify({
    url: args.url,
    title: article.title,
    description: article.description,
    date: article.date,
    category: article.category,
    product: article.product
  }, null, 2)}\n`);

  const messages = [
    {
      role: "system",
      content: [
        "你是英文 AI 技术文章的中文讲解编辑。",
        "根据给定英文博客内容，生成一篇中文讲解稿，不要输出原文全文翻译。",
        "目标读者: 想理解文章本身的人。只讲文章内容，不做个人项目映射，不布置练习，不写自测题。",
        "写法要求: 像老师逐段讲文章，说明作者在讲什么、为什么这么讲、概念之间怎么连接。",
        "格式要求: 使用 Markdown；层级清楚；保留必要英文术语；可以用少量表格帮助理解。",
        "内容边界: 只解释原文内容本身，不要加入“我的 AI 工作台”“自动投研”“实践模板”“检查清单”“自测题”等内容。",
        "版权要求: 不连续翻译原文长段落，不复刻全文结构为逐段译文；可以做结构化讲解、概念解释、短句级摘译和个人实践转化。"
      ].join("\n")
    },
    {
      role: "user",
      content: JSON.stringify({
        task: "create_chinese_reading_note",
        source: {
          url: args.url,
          title: article.title,
          description: article.description,
          date: article.date,
          category: article.category,
          product: article.product
        },
        output_format: [
          "# 中文标题",
          "",
          "> 原文: URL",
          "> 日期: YYYY-MM-DD 或原日期",
          "> 分类: ...",
          "> 产品: ...",
          "",
          "## 文章在讲什么",
          "用几段中文说明这篇文章的主题、背景和作者想解决的问题。",
          "",
          "## 原文结构地图",
          "用表格列出文章主要部分和每部分的作用。",
          "",
          "## 核心概念讲解",
          "讲清楚文中的核心概念、概念之间的关系和必要背景。",
          "",
          "## 文章主体讲解",
          "按原文主要章节讲解，每节包含: 这一节讲什么 / 为什么重要 / 关键点。",
          "",
          "## 关键对比表",
          "只在原文确实有分类或对比时使用表格，帮助读者看懂区别。",
          "",
          "## 关键句短摘译",
          "选 5-8 个短句或短语，每条包含英文短摘、中文意思、为什么重要。每条英文摘录要短。",
          "",
          "## 术语表",
          "解释文中重要英文术语。",
          "",
          "## 文章结尾怎么收束",
          "说明作者最后给出的建议和全文逻辑如何闭合。"
        ].join("\n"),
        article_markdown: `# ${article.title}\n\n${article.description}\n\n${article.body}`
      })
    }
  ];
  writeText(`${sourceBase}/messages.json`, `${JSON.stringify(messages, null, 2)}\n`);
  const raw = runMmx(`${sourceBase}/messages.json`);
  writeText(`${sourceBase}/mmx-output.json`, `${raw}\n`);
  const note = responseText(raw)
    .replace(/^```(?:markdown|md)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  writeText(outPath, `${note}\n`);
  console.log(JSON.stringify({ ok: true, url: args.url, out: outPath, source: sourceBase }, null, 2));
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
