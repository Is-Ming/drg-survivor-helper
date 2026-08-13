// fix-weapon-fields.mjs — 武器字段数据校正（一次性）
// 1) 全部武器 yellowOverclock / redOverclock 文本改为超频【名称】(来自 overclocks[].chineseName)，
//    丢弃不在 overclocks 主表的无效 id（如 widened-sprinkler 误报），顺带修掉历史 id/text 错位。
// 2) 新增 tagLabels 中文字段（与 tags 一一对应），数据里中英都有，方便核对。
// 3) 按 wiki 把 the-favourite(心头之好) 作为红超频补到其适用武器，使这些武器达 2 红。
// 安全：不改 overclocks 主表、不改 weapons 的 englishName/chineseName/class/tags/rating/version；
//       baseline 保持 CRLF + 2 空格缩进；weapons.ts 整体重建以与 baseline 一致（消除既有漂移）。

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const BASELINE = path.join(ROOT, 'server/data/baseline.json');
const TS = path.join(ROOT, 'src/data/weapons.ts');
const WIKI = path.join(ROOT, 'scripts/ingest/wiki-data.json');

const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
const wiki = JSON.parse(fs.readFileSync(WIKI, 'utf8'));
const ocById = new Map(baseline.overclocks.map((o) => [o.id, o]));

// 中文标签映射（与 src/data/enums.ts WEAPON_TAG_LABEL.zh 保持一致）
const TAG_ZH = {
  KINETIC: '动能', FIRE: '燃烧', ELECTRIC: '电击', COLD: '急冻', ACID: '腐蚀', PLASMA: '电浆',
  LIGHT: '轻型', MEDIUM: '中型', HEAVY: '重型', THROWABLE: '投掷物', CONSTRUCT: '建造物',
  PROJECTILE: '发射物', EXPLOSIVE: '爆炸', DRONE: '无人机', TURRET: '哨戒炮',
  GROUNDZONE: '弥留区域', PRECISE: '精密', SPRAY: '散射', AREA: '范围', BEAM: '射线', LASTING: '长时',
};
const zhTag = (t) => TAG_ZH[t] || t;

// the-favourite 适用武器集合（解码 &quot; → "，再去引号、trim）
const tfTmpl = wiki.overclockTemplates.find((t) => t.proposedId === 'the-favourite');
const tfWeapons = new Set((tfTmpl?.availableOn || []).map((s) => s.replace(/&quot;/g, '"').replace(/"/g, '').trim().toLowerCase()));

// 从 ids 生成名称文本（丢弃不在 overclocks 主表的 id）
function textFromIds(ids) {
  return (ids || []).filter((id) => ocById.has(id)).map((id) => ocById.get(id).chineseName).join('；');
}
const cleanIds = (ids) => (ids || []).filter((id) => ocById.has(id));

const report = { droppedIds: [], addedFav: [] };
const newWeapons = baseline.weapons.map((w) => {
  // 1) 补 the-favourite 红超频
  let redIds = [...(w.redOverclockIds || [])];
  if (tfWeapons.has(w.englishName.toLowerCase()) && !redIds.includes('the-favourite')) {
    redIds.push('the-favourite');
    report.addedFav.push(w.englishName);
  }
  // 2) 清洗 ids（丢弃无效）并据名称重生成文本
  const yelIds = cleanIds(w.yellowOverclockIds);
  redIds = cleanIds(redIds);
  for (const id of [...(w.yellowOverclockIds || []), ...(w.redOverclockIds || [])]) {
    if (!ocById.has(id)) report.droppedIds.push({ weapon: w.englishName, id });
  }
  const obj = {
    englishName: w.englishName,
    chineseName: w.chineseName,
    class: w.class,
    tags: w.tags,
    tagLabels: (w.tags || []).map(zhTag),
    yellowOverclock: textFromIds(yelIds),
    redOverclock: textFromIds(redIds),
    yellowOverclockIds: yelIds,
    redOverclockIds: redIds,
    rating: w.rating,
    version: w.version,
  };
  if (w.dlc) obj.dlc = true;
  return obj;
});
baseline.weapons = newWeapons;
fs.writeFileSync(BASELINE, JSON.stringify(baseline, null, 2).replace(/\n/g, '\r\n') + '\r\n', 'utf8');
console.log('[baseline] 已重写。the-favourite 新增到:', report.addedFav.join(', ') || '无');
console.log('[baseline] 丢弃的无效超频 id:', JSON.stringify(report.droppedIds) === '[]' ? '无' : JSON.stringify(report.droppedIds));

// 重建 weapons.ts（与 baseline 一致）
const tsRaw = fs.readFileSync(TS, 'utf8');
const marker = 'export const weapons: Weapon[] = [';
const hIdx = tsRaw.indexOf(marker);
if (hIdx < 0) { console.error('[weapons.ts] 找不到数组声明，中止'); process.exit(1); }
const header = tsRaw.slice(0, hIdx + marker.length);
const closeIdx = tsRaw.lastIndexOf(']');
const suffix = tsRaw.slice(closeIdx + 1);
const blocks = newWeapons.map((w) => {
  const lines = [
    '  {',
    `    englishName: ${JSON.stringify(w.englishName)},`,
    `    chineseName: ${JSON.stringify(w.chineseName)},`,
    `    class: ${JSON.stringify(w.class)},`,
    `    tags: ${JSON.stringify(w.tags)},`,
    `    tagLabels: ${JSON.stringify(w.tagLabels)},`,
    `    yellowOverclock: ${JSON.stringify(w.yellowOverclock)},`,
    `    redOverclock: ${JSON.stringify(w.redOverclock)},`,
    `    yellowOverclockIds: ${JSON.stringify(w.yellowOverclockIds)},`,
    `    redOverclockIds: ${JSON.stringify(w.redOverclockIds)},`,
    `    rating: ${JSON.stringify(w.rating)},`,
    `    version: ${JSON.stringify(w.version)},`,
  ];
  if (w.dlc) lines.push('    dlc: true,');
  lines.push('  },');
  return lines.join('\n');
}).join('\n');
fs.writeFileSync(TS, header + '\n' + blocks + '\n]' + suffix, 'utf8');
console.log('[weapons.ts] 已重建（53 条，含 tagLabels + the-favourite 对齐）。');
