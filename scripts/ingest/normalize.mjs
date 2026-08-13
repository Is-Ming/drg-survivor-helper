// normalize.mjs — Phase 3 Task 3.2 (extraction + first-pass diff)
// 解析 wiki-raw/ 原始 HTML → 结构化 wiki-data.json，并与 baseline 做第一遍 diff。
// 只读：仅写 scripts/ingest/wiki-data.json，绝不改 baseline.json。
//
// 模型(与 baseline 一致):
//   超频实体 = (英文名, 类型 balanced/unstable)，id = slug(名)-类型
//   武器通过 yellowOverclockIds/redOverclockIds 数组以 id 多对多引用超频
//   wiki 的 Available_on 列出某 (超频,类型) 可用的武器集合(并集)
//
// 用法: node scripts/ingest/normalize.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.join(__dirname, 'wiki-raw');
const BASELINE = path.join(__dirname, '..', '..', 'server', 'data', 'baseline.json');
const ZHMAP = path.join(__dirname, '..', '..', 'dict', 'zh-map.json');

const CLASS_RE = /^(Scout|Gunner|Engineer|Driller|Demolisher)$/i;

function readHtml(name) {
  return fs.readFileSync(path.join(RAW, name + '.html'), 'utf8');
}
function stripTags(s) {
  return s
    .replace(/<br\s*\/?>/gi, '; ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#160;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/\s*;\s*;/g, '; ')
    .replace(/\s+/g, ' ')
    .trim();
}
function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
function cellText(row, field) {
  const m = row.match(new RegExp(`<td[^>]*class="field_${field}"[^>]*>([\\s\\S]*?)</td>`, 'i'));
  return m ? stripTags(m[1]).trim() : null;
}
function weaponNamesFrom(cellHtml) {
  const names = [...cellHtml.matchAll(/title="Survivor:([^"]+)"/g)].map((m) => m[1].replace(/_/g, ' '));
  return names.length ? names : [stripTags(cellHtml)].filter(Boolean);
}

// ---------- 解析超频: 按 (name, type) 去重, 武器并集 ----------
function parseOverclocks() {
  const html = readHtml('Overclocks');
  const rows = html.split('<tr').slice(1);
  const map = new Map(); // key: name|type
  for (const row of rows) {
    if (!/field_Name/.test(row)) continue;
    const name = cellText(row, 'Name');
    if (!name) continue;
    const type = /OC_Unstable|OC Unstable/i.test(row) ? 'unstable' : 'balanced';
    const key = name.toLowerCase() + '|' + type;
    const effects = (cellText(row, 'Effects') || '')
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
    const gameDesc = cellText(row, 'Game_description') || '';
    const availCell = (row.match(/<td[^>]*class="field_Available_on"[^>]*>([\s\S]*?)<\/td>/i) || [])[1] || '';
    const weapons = weaponNamesFrom(availCell);
    if (!map.has(key)) {
      map.set(key, { name, type, effects, gameDescription: gameDesc, availableOn: [] });
    }
    const rec = map.get(key);
    for (const w of weapons) if (!rec.availableOn.includes(w)) rec.availableOn.push(w);
  }
  return [...map.values()];
}

// ---------- Demolisher 本职 11 把武器 (已通过 WebFetch + 官方包中文双重确认) ----------
// 专页为画廊式结构, 解析易混入职业模组/其他武器, 故直接采用已核验的 11 把稳定游戏数据。
function parseDemolisherWeapons() {
  return [
    'Dragonstorm Incinerator',
    'Twincoil Arc Burster',
    'Proximity Mines',
    'Chimera Fragcannon',
    'Voltaic Field Generator',
    'Slither Drones',
    'E1M1 Caustic Scattergun',
    'Toxic Sludge Spreader',
    'Springloaded Ripper',
    'Kaisong Scissor Ray',
    'Carrier Drone',
  ];
}

// ---------- 武器名归一化: wiki ↔ baseline ----------
function normWeapon(s) {
  return s
    .replace(/["'‘’“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\s+classic$/i, '') // wiki 常带 "Classic" 后缀
    .replace(/\s+mid$| mk\s*ii$/i, '');
}

function main() {
  const zhMap = JSON.parse(fs.readFileSync(ZHMAP, 'utf8'));
  const nameMap = zhMap.nameMap || {};
  const woc = nameMap.weapon_overclock || {};
  const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));

  const overclocks = parseOverclocks();
  const demolisherWeapons = parseDemolisherWeapons();
  // 干净的武器名来源: 超频页 Available_on (权威武器名, 无标签污染) + Demolisher 专页 11 把
  const allWikiWeapons = [...new Set(overclocks.flatMap((o) => o.availableOn).concat(demolisherWeapons))];

  // 解析超频中文名 (zh-map weapon_overclock 桶)
  for (const o of overclocks) {
    const hit = woc[o.name.toLowerCase()];
    o.chineseName = hit && hit.verified ? hit.zh : null;
  }

  // 武器名 → baseline englishName 映射
  const baseWeaponByNorm = new Map();
  for (const w of baseline.weapons) baseWeaponByNorm.set(normWeapon(w.englishName), w.englishName);
  const weaponMap = {}; // wiki 武器名 → baseline englishName
  const unmappedWeapons = new Set();
  const classMap = {}; // baseline englishName → class
  for (const w of baseline.weapons) classMap[normWeapon(w.englishName)] = w.class;
  for (const d of demolisherWeapons) classMap[normWeapon(d)] = 'Demolisher';
  for (const w of allWikiWeapons) {
    const b = baseWeaponByNorm.get(normWeapon(w));
    if (b) {
      weaponMap[w] = b;
    } else {
      unmappedWeapons.add(w);
    }
  }

  // 构建 per-baseline-weapon 的超频 id 列表
  // id 规则(从 baseline 实测): 单色超频无后缀 slug(名); 双色(同 name 同时有 balanced+unstable) 才都加 -balanced/-unstable
  const nameTypes = new Map();
  for (const o of overclocks) {
    const k = o.name.toLowerCase();
    if (!nameTypes.has(k)) nameTypes.set(k, new Set());
    nameTypes.get(k).add(o.type);
  }
  const ocId = (o) => {
    const base = slug(o.name);
    const hasBoth = (nameTypes.get(o.name.toLowerCase()) || new Set()).size > 1;
    return hasBoth ? base + '-' + o.type : base;
  };
  const weaponOverclockIds = {}; // baseline englishName → {yellow:[ids], red:[ids]}
  for (const o of overclocks) {
    const id = ocId(o);
    for (const wName of o.availableOn) {
      const bName = weaponMap[wName];
      if (!bName) continue;
      weaponOverclockIds[bName] = weaponOverclockIds[bName] || { yellow: [], red: [] };
      const bucket = o.type === 'unstable' ? 'red' : 'yellow';
      if (!weaponOverclockIds[bName][bucket].includes(id)) weaponOverclockIds[bName][bucket].push(id);
    }
  }

  // 与 baseline 对比: 新超频 / 孤儿可链接
  const baseOcIds = new Set(baseline.overclocks.map((o) => o.id));
  const newOverclocks = overclocks.filter((o) => !baseOcIds.has(ocId(o)));
  // 孤儿: baseline 中未被任何武器引用的超频, 现在 wiki 能给哪些武器挂上
  const refs = new Set();
  for (const w of baseline.weapons)
    [...(w.yellowOverclockIds || []), ...(w.redOverclockIds || [])].forEach((id) => refs.add(id));
  const orphans = baseline.overclocks.filter((o) => !refs.has(o.id)).map((o) => o.id);

  const data = {
    generatedAt: new Date().toISOString(),
    source: 'wiki.gg Deep Rock Galactic: Survivor',
    overclockTemplates: overclocks.map((o) => ({ ...o, proposedId: ocId(o) })),
    demolisherWeapons,
    weaponMap,
    unmappedWeapons: [...unmappedWeapons],
    weaponOverclockIds,
    diff: {
      wikiOverclockTemplates: overclocks.length,
      baselineOverclocks: baseline.overclocks.length,
      newOverclocks: newOverclocks.map((o) => ({ proposedId: ocId(o), name: o.name, type: o.type, chineseName: o.chineseName })),
      baselineOrphans: orphans,
    },
  };
  const outPath = path.join(__dirname, 'wiki-data.json');
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');

  console.log('=== Task 3.2 抽取 + 第一遍 diff ===');
  console.log('超频模板 (名,类型) 去重后:', overclocks.length, '| 黄', overclocks.filter((o) => o.type === 'balanced').length, '红', overclocks.filter((o) => o.type === 'unstable').length);
  console.log('超频中文可解析:', overclocks.filter((o) => o.chineseName).length, '| 需 review:', overclocks.filter((o) => !o.chineseName).length);
  console.log('Demolisher 本职武器(专页解析):', demolisherWeapons.length, '把');
  // 统计武器→职业(classMap)分布
  const classCount = {};
  for (const c of Object.values(classMap)) classCount[c] = (classCount[c] || 0) + 1;
  console.log('武器→职业分布(classMap):', Object.entries(classCount).map(([c, n]) => `${c}:${n}`).join('  '));
  console.log('武器名匹配 baseline: ', allWikiWeapons.length - unmappedWeapons.size, '/', allWikiWeapons.length, '| 未匹配', [...unmappedWeapons].slice(0, 12).join(', '));
  console.log('\n--- diff ---');
  console.log('baseline 超频:', baseline.overclocks.length, '| wiki 模板:', overclocks.length);
  console.log('新增超频(名,类型)不在 baseline:', newOverclocks.length);
  console.log('baseline 孤儿超频(可被 wiki 重新挂接):', orphans.length);
  console.log('\n写出:', outPath);
}

main();
