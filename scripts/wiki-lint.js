#!/usr/bin/env node
"use strict";

/*
 * wiki/ 机械健康检查, 输出 JSON 报告:
 *   - deadLinks: 卡片里指向不存在文件的 .md/.html 相对链接
 *   - orphans:   没有任何入链、也没被 index.md 收录的卡片
 *   - missingFromIndex: 存在于 wiki/ 但 index.md 没列出的卡片
 *
 * 语义层面的 lint(卡片之间矛盾、结论过期)属于 LLM 工作流, 见 AGENTS.md。
 *
 * 用法: node scripts/wiki-lint.js   (有问题时退出码 1)
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const WIKI_DIR = path.join(ROOT, "wiki");
const META_FILES = new Set(["index.md", "log.md"]);

function extractLinks(markdown) {
  const body = markdown.replace(/^---[ \t]*\n[\s\S]*?\n---[ \t]*\n?/, "");
  const links = [];
  for (const match of body.matchAll(/\[[^\]]+\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
    const href = match[1].trim();
    if (/^(https?:|mailto:)/i.test(href)) continue;
    links.push(href.replace(/^\.\//, ""));
  }
  return links;
}

function main() {
  if (!fs.existsSync(WIKI_DIR)) {
    console.log(JSON.stringify({ ok: false, error: "wiki/ 目录不存在" }));
    process.exit(1);
  }

  const pages = fs
    .readdirSync(WIKI_DIR)
    .filter(name => name.toLowerCase().endsWith(".md"));
  const cards = pages.filter(name => !META_FILES.has(name));

  const deadLinks = [];
  const inbound = new Map(cards.map(name => [name, 0]));
  const indexedCards = new Set();

  for (const name of pages) {
    const markdown = fs.readFileSync(path.join(WIKI_DIR, name), "utf8");
    for (const href of extractLinks(markdown)) {
      // 死链: 相对当前文件解析后文件必须存在(.md 链接同时接受已生成的同名 .html 目标)
      const targetAbs = path.resolve(WIKI_DIR, href);
      if (!fs.existsSync(targetAbs)) {
        deadLinks.push({ file: `wiki/${name}`, href });
        continue;
      }
      // 入链统计与 index 收录: 只看 wiki 内同目录 .md 链接
      if (!href.includes("/") && /\.md$/i.test(href)) {
        if (name === "index.md") indexedCards.add(href);
        else if (!META_FILES.has(name) && inbound.has(href)) {
          inbound.set(href, inbound.get(href) + 1);
        }
      }
    }
  }

  const orphans = cards.filter(name => inbound.get(name) === 0 && !indexedCards.has(name));
  const missingFromIndex = cards.filter(name => !indexedCards.has(name));

  const ok = !deadLinks.length && !orphans.length && !missingFromIndex.length;
  console.log(
    JSON.stringify(
      { ok, cardCount: cards.length, deadLinks, orphans, missingFromIndex },
      null,
      2
    )
  );
  process.exit(ok ? 0 : 1);
}

main();
