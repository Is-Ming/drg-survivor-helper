#!/usr/bin/env node
/**
 * apply-zh.mjs  (Phase 1 · Task 1.2)
 *
 * 只读 server/data/baseline.json + dict/zh-map.json，
 * 把「官方简中权威」与 baseline 当前中文名逐条比对，产出可审核报告。
 *
 * 硬约束：
 *   - 绝不读写 achievements（🧊 成就硬冻结）。
 *   - 本脚本只「读」baseline + 「写」报告文件，绝不修改 baseline。
 *   - 模糊匹配结果仅进审核队列供人工确认，绝不自动发布。
 *
 * 输出：
 *   - scripts/ingest/match-report.json  结构化报告（matched / review 列表）
 *   - scripts/ingest/review-queue.md    仅含待核项（人工可读）
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const BASELINE = path.join(ROOT, 'server', 'data', 'baseline.json');
const ZHMAP = path.join(ROOT, 'dict', 'zh-map.json');
const OUT_JSON = path.join(__dirname, 'match-report.json');
const OUT_MD = path.join(__dirname, 'review-queue.md');

// 与 build-zh-map.mjs 保持一致的规范化（去引号+小写+压缩空白）
const norm = (s) =>
  typeof s === 'string' ? s.replace(/["'`]/g, '').trim().toLowerCase().replace(/\s+/g, ' ') : '';

// ---------- 模糊匹配 ----------
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

const tokenize = (s) => norm(s).split(/[^a-z0-9]+/).filter(Boolean);

function score(a, b) {
  const d = levenshtein(a, b);
  const m = Math.max(a.length, b.length) || 1;
  const levSim = (m - d) / m;
  const ta = new Set(tokenize(a));
  const tb = new Set(tokenize(b));
  let inter = 0;
  ta.forEach((t) => { if (tb.has(t)) inter++; });
  const union = ta.size + tb.size - inter;
  const tokSim = union ? inter / union : 0;
  return { score: Math.max(levSim, tokSim), dist: d };
}

// 在 zh-map 键集里找 top-K 模糊候选（score≥0.5）
function fuzzyTop(query, mapKeys, mapEntries, k = 3) {
  const q = norm(query);
  if (!q) return [];
  const cands = [];
  for (const key of mapKeys) {
    const { score: sc, dist } = score(q, key);
    if (sc >= 0.5) {
      cands.push({ key, zh: mapEntries[key].zh, score: Number(sc.toFixed(3)), dist });
    }
  }
  cands.sort((a, b) => b.score - a.score);
  return cands.slice(0, k);
}

// ---------- 加载 ----------
const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
const zhMapRaw = JSON.parse(fs.readFileSync(ZHMAP, 'utf8'));
// 分桶：nameMap 按 kind 分（weapon_overclock/equipment/enemy），termMap 留给 Task 1.4
const nameMap = zhMapRaw.nameMap;
const termMap = zhMapRaw.termMap;
// 实体 kind → 名字匹配桶：武器/超频共用 weapon_overclock 桶，装备用 equipment 桶
function bucketFor(kind) {
  return kind === 'equipment' ? nameMap.equipment : nameMap.weapon_overclock;
}

// ---------- 主流程 ----------
const report = {
  meta: {
    generatedBy: 'scripts/ingest/apply-zh.mjs',
    generatedAt: new Date().toISOString(),
    baseline: 'server/data/baseline.json',
    zhMap: 'dict/zh-map.json',
    nameMapEntries: Object.keys(nameMap.weapon_overclock).length
      + Object.keys(nameMap.equipment).length
      + Object.keys(nameMap.enemy).length,
    norm: 'strip ASCII quotes/apostrophes + lowercase + collapse internal whitespace',
    achievementsFrozen: true,
  },
  summary: {},
  applied: [],   // 精确命中（verified），含 changed 标记
  review: [],    // 精确未命中，附模糊建议
};

// 统一处理函数：key 取自英文名，cur 为 baseline 当前中文
// 名字匹配只查对应 kind 的 nameMap 桶，避免标签/里程碑表的同名中文污染
function processEntity(kind, item, enField, curField, idField) {
  const bucket = bucketFor(kind);
  const mapKeys = Object.keys(bucket);
  const en = item[enField];
  const key = norm(en);
  const cur = item[curField] ?? '';
  const rec = {
    kind,
    id: idField ? (item[idField] ?? null) : null,
    englishName: en,
    currentZh: cur || null,
  };
  const hit = key && bucket[key];
  if (hit && hit.verified) {
    const zh = hit.zh;
    rec.suggestedZh = zh;
    rec.changed = zh !== cur;          // 是否需 Task 1.3 改写
    rec.note = hit.note || undefined;
    report.applied.push(rec);
    return 'matched';
  }
  // 未命中 → 进审核队列
  rec.reason = hit ? 'zh-map entry exists but not verified' : 'no exact match in zh-map';
  rec.suggestions = fuzzyTop(en, mapKeys, bucket).map((c) => ({
    zh: c.zh, key: c.key, score: c.score, dist: c.dist, autoApply: false,
  }));
  report.review.push(rec);
  return 'review';
}

function summarize(summaryKey, entityKind, total, matched, review) {
  report.summary[summaryKey] = {
    total, matched, review,
    changed: report.applied.filter((r) => r.kind === entityKind && r.changed).length,
  };
}

// equipment: 键=officialName，当前中文=name
let em = 0, er = 0;
for (const e of baseline.equipments || []) {
  (processEntity('equipment', e, 'officialName', 'name', 'id') === 'matched' ? em++ : er++);
}
summarize('equipments', 'equipment', (baseline.equipments || []).length, em, er);

// weapon: 键=englishName，当前中文=chineseName
let wm = 0, wr = 0;
for (const w of baseline.weapons || []) {
  (processEntity('weapon', w, 'englishName', 'chineseName', 'id') === 'matched' ? wm++ : wr++);
}
summarize('weapons', 'weapon', (baseline.weapons || []).length, wm, wr);

// overclock: 键=englishName，当前中文=chineseName
let om = 0, orr = 0;
for (const o of baseline.overclocks || []) {
  (processEntity('overclock', o, 'englishName', 'chineseName', 'id') === 'matched' ? om++ : orr++);
}
summarize('overclocks', 'overclock', (baseline.overclocks || []).length, om, orr);

// achievements：硬冻结，仅计数，绝不读写
const achTotal = (baseline.achievements || []).length;
report.summary.achievements = { total: achTotal, frozen: true, touched: 0 };

// ---------- 写出 JSON ----------
fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), 'utf8');

// ---------- 写出 review-queue.md ----------
const lines = [];
lines.push('# 中文匹配审核队列（apply-zh review）');
lines.push('');
lines.push(`生成时间: ${report.meta.generatedAt}`);
lines.push(`基线: ${report.meta.baseline} | 记忆库: ${report.meta.zhMap} (名字桶 ${report.meta.nameMapEntries} 条)`);
lines.push('');
lines.push('> 🧊 成就 300 条已硬冻结，本流程未读写。');
lines.push('> 模糊建议仅供参考（置信度 score），**绝不自动发布**，需人工确认。');
lines.push('');
lines.push(`## 待人工确认项：共 ${report.review.length} 条`);
lines.push('');

const byKind = {};
for (const r of report.review) (byKind[r.kind] = byKind[r.kind] || []).push(r);
const kindLabel = { weapon: '武器', overclock: '超频', equipment: '装备' };

for (const kind of ['weapon', 'overclock', 'equipment']) {
  const items = byKind[kind];
  if (!items || !items.length) continue;
  lines.push(`### ${kindLabel[kind]} (${items.length})`);
  lines.push('');
  for (const r of items) {
    lines.push(`- **${r.englishName}**${r.id ? ` (id: ${r.id})` : ''}`);
    lines.push(`  - 当前中文: ${r.currentZh || '（空）'}`);
    lines.push(`  - 原因: ${r.reason}`);
    if (r.suggestions.length) {
      for (const s of r.suggestions) {
        lines.push(`  - 模糊建议: ${s.zh} ｜ score ${s.score} ｜ key \`${s.key}\` ｜ 自动发布: 否`);
      }
    } else {
      lines.push('  - 模糊建议: 无（游戏包可能确实缺失，待主理人确认或 Phase 3 wiki 补充）');
    }
    lines.push('');
  }
}

if (report.review.length === 0) {
  lines.push('（无待核项，全部精确命中）');
  lines.push('');
}

fs.writeFileSync(OUT_MD, lines.join('\n'), 'utf8');

// ---------- 控制台摘要 ----------
console.log('=== apply-zh 完成（只读，未写 baseline）===');
console.log(`输出: ${OUT_JSON}`);
console.log(`      ${OUT_MD}`);
for (const k of ['equipments', 'weapons', 'overclocks']) {
  const s = report.summary[k];
  console.log(`  ${k}: 共${s.total} | 命中${s.matched} | 待核${s.review} | 其中需改写(changed)${s.changed}`);
}
console.log(`  achievements: 冻结 ${report.summary.achievements.total} 条，未触碰`);
console.log(`  审核队列待核项: ${report.review.length}`);
