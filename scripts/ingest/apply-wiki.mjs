// apply-wiki.mjs — Phase 3 写回 + DLC 标记（仅数据标记方案）
// 作用：
//   1) 向 baseline.json 追加 11 把 Demolisher 武器（class:"Demolisher", dlc:true, 官方中文名, wiki 标签, 超频关联+文本）
//   2) 向 baseline.json 追加 9 个 DLC 超频（dlc:true，含官方中文名/英文效果）
//   3) 将这 9 个新超频【增量】挂接到其 applicable 的现有 42 武器（仅追加 id + 文本段，不动既有数据）
// 安全边界：不删不改任何既有武器/超频的其它字段；保持 CRLF + 2 空格缩进 + 顶层键序。
// 用法：
//   node scripts/ingest/apply-wiki.mjs          # dry-run，打印变更摘要 + 写 demolisher-patch.json
//   node scripts/ingest/apply-wiki.mjs --apply  # 写回 baseline.json

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const BASELINE = path.join(ROOT, 'server/data/baseline.json');
const WIKI = path.join(ROOT, 'scripts/ingest/wiki-data.json');
const PAIR = path.join(ROOT, 'drg_zh_en_pair.json');
const PATCH = path.join(ROOT, 'scripts/ingest/demolisher-patch.json');
const APPLY = process.argv.includes('--apply');

const raw = fs.readFileSync(BASELINE, 'utf8');
const baseline = JSON.parse(raw);
const wiki = JSON.parse(fs.readFileSync(WIKI, 'utf8'));
const pairEntries = JSON.parse(fs.readFileSync(PAIR, 'utf8')).entries || [];
// 官方包 en 字段大小写与 wiki 模板 t.name 不完全一致（如 "Tri-shells" vs "Tri-Shells"、
// "Volt splitter" vs "Volt Splitter"、"The Tightest of Springs" vs "The Tightest Of Springs"），
// 故用大小写不敏感查找，避免漏掉真实官方译名而错误回退英文（曾经漏过 tri-shells/volt-splitter）。
const zhByEn = new Map();
for (const e of pairEntries) if (e && e.en) zhByEn.set(e.en.toLowerCase(), e.zh_cn);

// ---------- 配置 ----------
const DEMOLISHER = [
  'Dragonstorm Incinerator', 'Twincoil Arc Burster', 'Proximity Mines',
  'Chimera Fragcannon', 'Voltaic Field Generator', 'Slither Drones',
  'E1M1 Caustic Scattergun', 'Toxic Sludge Spreader', 'Springloaded Ripper',
  'Kaisong Scissor Ray', 'Carrier Drone',
];
// 标签来自 wiki-raw HTML 的 infobox damageTag（已与 probe 输出核对一致）
const WEAPON_TAGS = {
  'Dragonstorm Incinerator': ['FIRE', 'MEDIUM', 'LASTING', 'BEAM', 'GROUNDZONE'],
  'Twincoil Arc Burster': ['ELECTRIC', 'LIGHT', 'SPRAY', 'PROJECTILE'],
  'Proximity Mines': ['KINETIC', 'THROWABLE', 'CONSTRUCT', 'AREA', 'EXPLOSIVE'],
  'Chimera Fragcannon': ['KINETIC', 'HEAVY', 'PRECISE', 'PROJECTILE'],
  'Voltaic Field Generator': ['ELECTRIC', 'MEDIUM', 'LASTING', 'GROUNDZONE'],
  'Slither Drones': ['KINETIC', 'CONSTRUCT', 'LASTING', 'DRONE'],
  'E1M1 Caustic Scattergun': ['ACID', 'MEDIUM', 'SPRAY', 'PROJECTILE'],
  'Toxic Sludge Spreader': ['ACID', 'HEAVY', 'BEAM', 'LASTING', 'GROUNDZONE'],
  'Springloaded Ripper': ['KINETIC', 'LIGHT', 'THROWABLE', 'SPRAY', 'PROJECTILE'],
  'Kaisong Scissor Ray': ['KINETIC', 'MEDIUM', 'BEAM', 'LASTING'],
  'Carrier Drone': ['ELECTRIC', 'ACID', 'COLD', 'FIRE', 'CONSTRUCT', 'LASTING', 'DRONE'],
};
// 9 个真实新增超频（剔除 widened-sprinkler 误报）
const NEW_OC_IDS = [
  'the-reaper', 'the-tightest-of-springs', 'thermal-oscillator', 'thick-boy',
  'top-shelf-sludge', 'tri-shells', 'ultimate-sidearm', 'unlimited-power', 'volt-splitter',
];

// ---------- 工具 ----------
const decodeEnt = (s) => (s || '')
  .replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  .replace(/&lt;?/g, '<').replace(/&gt;?/g, '>');
const baselineOcById = new Map(baseline.overclocks.map((o) => [o.id, o]));
const existingWeaponNames = new Set(baseline.weapons.map((w) => w.englishName));

// 从 wiki overclockTemplates 构造新超频对象
const tmplById = new Map(wiki.overclockTemplates.map((t) => [t.proposedId, t]));
const newOverclocks = [];
const newOcById = new Map();
for (const id of NEW_OC_IDS) {
  const t = tmplById.get(id);
  if (!t) { console.error(`[WARN] 找不到超频模板 ${id}`); continue; }
  const enName = t.name;
  const zh = zhByEn.get(enName.toLowerCase()) || null; // 无官方翻译则为 null → 用英文名
  const effect = zh || enName; // 无官方中文效果 → 用中文名(或英文名)占位，绝不杜撰
  const enEffect = decodeEnt((t.effects || []).join('; '));
  const oc = {
    id,
    englishName: enName,
    chineseName: zh || enName,
    type: t.type,
    effect,
    enEffect,
    dlc: true,
  };
  newOverclocks.push(oc);
  newOcById.set(id, oc);
}

// 标签解析：每个超频的 availableOn（解码后）匹配武器名
// 注意：必须用 chineseName（短名，不含 `；`）作为武器超频文本段，
// 否则 effect 句子中的 `；` 会与分隔符冲突导致 id/text 错位。
function ocClean(id) {
  const b = baselineOcById.get(id);
  if (b && b.chineseName) return b.chineseName;
  const n = newOcById.get(id);
  if (n) return n.chineseName || n.englishName;
  return id;
}

// ---------- 1) 11 把 Demolisher 武器 ----------
const newWeapons = [];
for (const en of DEMOLISHER) {
  if (existingWeaponNames.has(en)) { console.error(`[WARN] 武器已存在，跳过 ${en}`); continue; }
  const zh = zhByEn.get(en.toLowerCase());
  if (!zh) { console.error(`[WARN] 武器无官方中文名，跳过 ${en}`); continue; }
  const tags = WEAPON_TAGS[en];
  if (!tags) { console.error(`[WARN] 武器无标签，跳过 ${en}`); continue; }
  const yellowIds = [], redIds = [];
  for (const t of wiki.overclockTemplates) {
    const applies = (t.availableOn || []).map(decodeEnt).includes(en);
    if (!applies) continue;
    if (t.type === 'balanced') yellowIds.push(t.proposedId);
    else redIds.push(t.proposedId);
  }
  const w = {
    englishName: en,
    chineseName: zh,
    class: 'Demolisher',
    tags,
    yellowOverclock: yellowIds.map(ocClean).join('；'),
    redOverclock: redIds.map(ocClean).join('；'),
    yellowOverclockIds: yellowIds,
    redOverclockIds: redIds,
    rating: '-',
    version: '当前',
    dlc: true,
  };
  newWeapons.push(w);
}

// ---------- 2) 9 个新超频挂接到现有 42 武器（仅增量追加） ----------
const deltas = []; // {weapon, color, added:[{id,label}]}
for (const w of baseline.weapons) {
  const map = wiki.weaponOverclockIds[w.englishName];
  if (!map) continue; // Demolisher 等新武器不在 weaponOverclockIds（其关联已在上一步计算）
  for (const color of ['yellow', 'red']) {
    const idsKey = color + 'OverclockIds';
    const txtKey = color + 'Overclock';
    const desired = map[color] || [];
    const cur = w[idsKey] || (w[idsKey] = []);
    const added = [];
    for (const id of desired) {
      if (!NEW_OC_IDS.includes(id)) continue; // 仅处理 9 个新超频；孤儿不在此挂接
      if (cur.includes(id)) continue;
      cur.push(id);
      const label = ocClean(id);
      // 必须用最新 w[txtKey]（而非循环外捕获的副本），否则同一武器同色追加多个超频时后者会覆盖前者
      w[txtKey] = (typeof w[txtKey] === 'string' && w[txtKey]) ? w[txtKey] + '；' + label : label;
      added.push({ id, label });
    }
    if (added.length) deltas.push({ weapon: w.englishName, color, added });
  }
}

// ---------- 摘要 / 写回 ----------
console.log(`=== ${APPLY ? 'APPLY' : 'DRY-RUN'} ===`);
console.log(`新增 Demolisher 武器: ${newWeapons.length} / 预期 11`);
console.log(`新增 DLC 超频: ${newOverclocks.length} / 预期 9`);
console.log(`现有武器增量挂接新超频: ${deltas.length} 把`);
for (const d of deltas) {
  console.log(`  [${d.color}] ${d.weapon}: +${d.added.map((a) => a.id).join(', ')}`);
}
// 校验：9 个新超频是否都被引用
const referenced = new Set();
for (const w of newWeapons) { (w.yellowOverclockIds || []).forEach((i) => referenced.add(i)); (w.redOverclockIds || []).forEach((i) => referenced.add(i)); }
for (const d of deltas) d.added.forEach((a) => referenced.add(a.id));
const orphanNew = NEW_OC_IDS.filter((id) => !referenced.has(id));
console.log(`未被引用的新超频: ${orphanNew.length ? orphanNew.join(', ') : '无'}`);

const patch = { newWeapons, newOverclocks, deltas };
fs.writeFileSync(PATCH, JSON.stringify(patch, null, 2) + '\n', 'utf8');
console.log(`\n已写出 sidecar: ${PATCH}`);

if (!APPLY) {
  console.log('(dry-run 完成，未写回 baseline.json。加 --apply 执行)');
  process.exit(0);
}

baseline.weapons.push(...newWeapons);
baseline.overclocks.push(...newOverclocks);
const out = JSON.stringify(baseline, null, 2).replace(/\n/g, '\r\n') + '\r\n';
fs.writeFileSync(BASELINE, out, 'utf8');
console.log(`\n已写回 ${BASELINE}（CRLF + 2 空格缩进；weapons=${baseline.weapons.length}, overclocks=${baseline.overclocks.length}）`);
