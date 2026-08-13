// fetch-wiki.mjs — Phase 3 Task 3.1
// 只读抓取 wiki.gg (Deep Rock Galactic: Survivor) 原始页面，缓存到 scripts/ingest/wiki-raw/。
// 不解析、不写 baseline；仅落盘原始 HTML 供后续 normalize 使用。
// 用法: node scripts/ingest/fetch-wiki.mjs            (抓取默认清单)
//       node scripts/ingest/fetch-wiki.mjs --page Weapons   (单页, 页面名不含 Survivor: 前缀也可)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'wiki-raw');
const BASE = 'https://deeprockgalactic.wiki.gg/wiki/Survivor:';
const UA = 'drg-survivor-helper/ingest (personal non-commercial data fetch; contact: local)';
const DELAY_MS = 800; // 限速，避免给 wiki 造成压力

// 默认抓取的页面（Survivor: 前缀后的名字）
const DEFAULT_PAGES = [
  'Weapons',
  'Overclocks',
  'Equipment',
  'Demolisher',
  'Driller',
  'Engineer',
  'Gunner',
  'Scout',
];

function sanitize(name) {
  return name.replace(/[^A-Za-z0-9_-]/g, '_');
}

async function fetchPage(page) {
  const url = page.includes('://') ? page : BASE + page;
  const fileName = sanitize(page.includes('://') ? page.split('/wiki/').pop() : page) + '.html';
  const outPath = path.join(OUT_DIR, fileName);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'text/html' } });
    if (!res.ok) {
      console.log(`  ✗ ${page} -> HTTP ${res.status}`);
      return false;
    }
    const html = await res.text();
    fs.writeFileSync(outPath, html, 'utf8');
    console.log(`  ✓ ${page} -> ${fileName} (${html.length} bytes)`);
    return true;
  } catch (e) {
    console.log(`  ✗ ${page} -> 错误: ${e.message}`);
    return false;
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const args = process.argv.slice(2);
  let pages = DEFAULT_PAGES;
  const single = args.find((a) => !a.startsWith('--'));
  if (single) pages = [single.replace(/^Survivor:/, '')];

  console.log(`Phase 3 Task 3.1 — 抓取 wiki.gg (${pages.length} 页)`);
  console.log(`输出目录: ${OUT_DIR}\n`);
  let ok = 0;
  for (const p of pages) {
    const success = await fetchPage(p);
    if (success) ok++;
    if (p !== pages[pages.length - 1]) await new Promise((r) => setTimeout(r, DELAY_MS));
  }
  console.log(`\n完成: ${ok}/${pages.length} 页成功。`);
}

main();
