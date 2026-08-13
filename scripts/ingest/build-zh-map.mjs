#!/usr/bin/env node
/**
 * build-zh-map.mjs  (Phase 1 · Task 1.1)
 *
 * 把游戏官方简中包（由 data/ 下的 .bundle 源文件抽取而来）构建成「翻译记忆库」
 * dict/zh-map.json，供后续 apply-zh.mjs 按英文名自动挂载中文权威。
 *
 * 输入（工作区根目录，已由 UnityPy 抽取）:
 *   - drg_zh_en_pair.json       主源：en / zh_cn / bg
 *   - drg_zh_en.json            en 兜底（部分条目主源 en 为空时补）
 *   - drg_localization_pair.json bg 交叉校验源（zh_cn + bg）
 *
 * 输出:
 *   - dict/zh-map.json
 *       {
 *         meta,
 *         nameMap: { weapon_overclock, equipment, enemy },  // 实体「名字」权威，按 kind 分桶
 *         termMap: { stat_tag, milestone },                // 效果/标签/里程碑文本，供 Task 1.4 用
 *       }
 *
 *  ⚠️ 分桶设计（修复跨表同名假阳性）：
 *     同一英文名在不同语义角色下可能有不同中文，例如 sidearm 在「超频名」=指定副手，
 *     在「标签」=副手；piercing projectiles 在「超频名」=穿深铅弹，在「装备效果」=穿深型发射物。
 *     若把整张表压平成 { norm(en): zh }，后写会覆盖先写，导致名字匹配取错值。
 *     因此 nameMap 严格按实体 kind 分桶（武器/超频共用 weapon_overclock 桶、装备用 equipment、
 *     敌人用 enemy），apply-zh 匹配时只查对应桶；标签/里程碑表单独进 termMap，不参与名字匹配。
 *
 * 硬约束：本脚本只「读」游戏包 + 「写」dict/zh-map.json，绝不读写 baseline、
 *        绝不触碰 achievements。
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.join(ROOT, 'dict');
const OUT_FILE = path.join(OUT_DIR, 'zh-map.json');

// ---------- 规范化：去英文引号/撇号 + 转小写 + 压缩内部空白 ----------
// 数据核查发现：包内 en 与 baseline englishName 多数仅差大小写
// （如 "A Little More Oomph!" vs "A little more oomph!"）或引号包裹
// （如 "Thunderhead" Heavy Autocannon）。统一小写 + 去引号后精准命中率显著提升。
// baseline 的 englishName/officialName 在 apply-zh 中施加同一 norm 即可对齐。
function norm(s) {
  if (typeof s !== 'string') return '';
  return s
    .replace(/["'`]/g, '')      // 去掉英文引号/撇号（武器名常被 "" 包裹）
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

// ---------- 表名 → 桶映射 ----------
// 实体「命名」表：进 nameMap，按 kind 分桶（武器/超频共用 weapon_overclock）
const NAME_TABLES = {
  'Weapons_Overclocks_Skills_zh-CN': 'weapon_overclock',
  'Artifacts_zh-CN': 'equipment',
  'Gear_zh-CN': 'equipment',
  'Enemies_zh-CN': 'enemy',
};
// 效果/标签/里程碑「文本」表：进 termMap，供 Task 1.4 效果渲染，不参与名字匹配
const TERM_TABLES = {
  'Tags_Stats_zh-CN': 'stat_tag',
  'Milestones_BiomeGoals_zh-CN': 'milestone',
};
const IGNORE_TABLES = new Set([
  'UI_zh-CN', 'UI_en',
  'Mutators_zh-CN',
  'Challenges_zh-CN',
  'Tips_zh-CN',
  'Maps_Missions_Objectives_Classes_zh-CN',
  'Tags_Stats_en',
]);

function loadJSON(name) {
  const p = path.join(ROOT, name);
  if (!fs.existsSync(p)) {
    console.warn(`[warn] 缺少输入文件: ${name}，跳过`);
    return null;
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

// ---------- 读取三个源 ----------
const pair = loadJSON('drg_zh_en_pair.json');        // 主源
const zhEn = loadJSON('drg_zh_en.json');             // en 兜底
const locPair = loadJSON('drg_localization_pair.json'); // bg 交叉校验

if (!pair) {
  console.error('[error] 主源 drg_zh_en_pair.json 缺失，无法继续');
  process.exit(1);
}

// drg_zh_en.json: keyId -> en（兜底）
const enFallback = new Map();
if (zhEn && Array.isArray(zhEn.entries)) {
  for (const e of zhEn.entries) {
    if (e && e.keyId != null && e.en) enFallback.set(Number(e.keyId), e.en);
  }
}

// drg_localization_pair.json: keyId -> { zh_cn, bg }（交叉校验）
const locByKey = new Map();
if (locPair && Array.isArray(locPair.entries)) {
  for (const e of locPair.entries) {
    if (e && e.keyId != null) {
      locByKey.set(Number(e.keyId), { zh_cn: e.zh_cn ?? null, bg: e.bg ?? null });
    }
  }
}

// ---------- 初始化分桶容器 ----------
const nameMap = { weapon_overclock: {}, equipment: {}, enemy: {} };
const termMap = { stat_tag: {}, milestone: {} };
const ignoredTables = {};
const stats = {
  totalInSource: pair.entries?.length ?? 0,
  nameIncluded: 0,
  termIncluded: 0,
  droppedEmpty: 0,
  ignored: 0,
  conflicts: 0,
  bgMismatch: 0,
  enFallbackUsed: 0,
};

// 把一条记录写入指定桶（按 norm(en) 为键；同名冲突记录 note 并后写覆盖）
function putInto(bucket, kind, e, en, zh) {
  const key = norm(en);
  if (!key) { stats.droppedEmpty++; return; }

  // bg 交叉校验
  let note = '';
  const loc = locByKey.get(Number(e.keyId));
  if (loc && loc.bg && e.bg && loc.bg !== e.bg) {
    note = `bg-source mismatch(localPair=${JSON.stringify(loc.bg)})`;
    stats.bgMismatch++;
  }

  const rec = { en, zh, kind, source: 'game-pkg', verified: true };
  if (note) rec.note = note;

  // 同桶内重复 en 不同 zh（变体）→ 冲突记 note，后写覆盖
  if (bucket[key]) {
    const prev = bucket[key];
    if (prev.zh !== zh) {
      rec.note = [note, `conflict(${JSON.stringify(prev.zh)}|${JSON.stringify(zh)})`]
        .filter(Boolean).join('; ');
      stats.conflicts++;
    }
  }
  bucket[key] = rec;
}

// ---------- 主循环 ----------
for (const e of pair.entries || []) {
  const table = e.table;
  if (IGNORE_TABLES.has(table)) {
    ignoredTables[table] = (ignoredTables[table] || 0) + 1;
    stats.ignored++;
    continue;
  }
  const nameKind = NAME_TABLES[table];
  const termKind = TERM_TABLES[table];
  if (!nameKind && !termKind) {
    ignoredTables[table] = (ignoredTables[table] || 0) + 1;
    stats.ignored++;
    continue;
  }

  // en：主源为空时用 zhEn 兜底
  let en = e.en;
  if (!en && enFallback.has(Number(e.keyId))) {
    en = enFallback.get(Number(e.keyId));
    stats.enFallbackUsed++;
  }
  const zh = e.zh_cn;
  if (!en || !zh) {
    stats.droppedEmpty++;
    continue;
  }

  if (nameKind) {
    putInto(nameMap[nameKind], nameKind, e, en, zh);
    stats.nameIncluded++;
  } else {
    putInto(termMap[termKind], termKind, e, en, zh);
    stats.termIncluded++;
  }
}

// ---------- 写出 ----------
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const nameMapCounts = {
  weapon_overclock: Object.keys(nameMap.weapon_overclock).length,
  equipment: Object.keys(nameMap.equipment).length,
  enemy: Object.keys(nameMap.enemy).length,
};
const termMapCounts = {
  stat_tag: Object.keys(termMap.stat_tag).length,
  milestone: Object.keys(termMap.milestone).length,
};

const out = {
  meta: {
    version: '2026-08-12',
    generatedBy: 'scripts/ingest/build-zh-map.mjs',
    sources: [
      'drg_zh_en_pair.json (primary: en/zh_cn/bg)',
      'drg_zh_en.json (en fallback)',
      'drg_localization_pair.json (bg cross-check)',
    ],
    norm: 'strip ASCII quotes/apostrophes + lowercase + collapse internal whitespace',
    nameMapCounts,
    termMapCounts,
    ignoredTables,
    stats,
  },
  nameMap,
  termMap,
};

fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2), 'utf8');

// ---------- 验收样例 ----------
const accept = ['DRG Coupons', 'Glass Shirt', 'Squint-EE5', 'Sidearm', 'Piercing Projectiles'];
console.log('=== build-zh-map 完成（分桶：nameMap 名字 / termMap 效果）===');
console.log(`输出: ${OUT_FILE}`);
console.log(`nameMap 条目: ${JSON.stringify(nameMapCounts)}`);
console.log(`termMap 条目: ${JSON.stringify(termMapCounts)}`);
console.log(`丢弃(空值): ${stats.droppedEmpty} | 忽略(非目标表): ${stats.ignored} | 同桶冲突: ${stats.conflicts} | bg不一致: ${stats.bgMismatch} | en兜底: ${stats.enFallbackUsed}`);
console.log('--- 验收样例（均取自 nameMap.weapon_overclock，即「名字」权威）---');
for (const a of accept) {
  const k = norm(a);
  const r = nameMap.weapon_overclock[k] || nameMap.equipment[k];
  console.log(`  ${a} → ${r ? r.zh + '  [' + r.kind + ']' : '❌ 未命中'}`);
}

export { norm, NAME_TABLES, TERM_TABLES };
