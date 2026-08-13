// validate.mjs — 校验 baseline.json DLC 写回完整性（临时）
import fs from 'fs';
import path from 'path';

const BASELINE = path.join(process.cwd(), 'server/data/baseline.json');
const b = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
const errs = [];

const wNames = new Set();
for (const w of b.weapons) {
  if (wNames.has(w.englishName)) errs.push(`重复武器名: ${w.englishName}`);
  wNames.add(w.englishName);
  if (w.class === 'Demolisher' && !w.dlc) errs.push(`Demolisher 武器缺 dlc: ${w.englishName}`);
  // 标签合法性
  const okTags = w.tags.every((t) => /^[A-Z_]+$/.test(t));
  if (!okTags) errs.push(`武器标签非法: ${w.englishName} -> ${JSON.stringify(w.tags)}`);
  // id/text 对齐
  for (const color of ['yellow', 'red']) {
    const ids = w[color + 'OverclockIds'] || [];
    const txt = (w[color + 'Overclock'] || '').split('；').filter((s) => s.length);
    if (ids.length !== txt.length) errs.push(`武器 ${w.englishName} ${color} id/text 不对齐: ids=${ids.length} txt=${txt.length}`);
  }
}

const ocIds = new Set();
for (const o of b.overclocks) {
  if (ocIds.has(o.id)) errs.push(`重复超频 id: ${o.id}`);
  ocIds.add(o.id);
  if (!['balanced', 'unstable'].includes(o.type)) errs.push(`超频 type 非法: ${o.id} -> ${o.type}`);
}

const demoW = b.weapons.filter((w) => w.class === 'Demolisher');
const demoOc = b.overclocks.filter((o) => o.dlc);
console.log(`weapons=${b.weapons.length} (Demolisher ${demoW.length})`);
console.log(`overclocks=${b.overclocks.length} (dlc ${demoOc.length})`);
console.log(`Demolisher 中文名: ${demoW.map((w) => w.chineseName).join(' / ')}`);

// 校验新增 9 超频均被引用
const ref = new Set();
for (const w of b.weapons) {
  (w.yellowOverclockIds || []).forEach((i) => ref.add(i));
  (w.redOverclockIds || []).forEach((i) => ref.add(i));
}
const newOcIds = ['the-reaper', 'the-tightest-of-springs', 'thermal-oscillator', 'thick-boy', 'top-shelf-sludge', 'tri-shells', 'ultimate-sidearm', 'unlimited-power', 'volt-splitter'];
const orphanNew = newOcIds.filter((id) => !ref.has(id));
if (orphanNew.length) errs.push(`未引用新超频: ${orphanNew.join(', ')}`);

// 校验 7 把增量武器：red/yellow id 数组末位确为新增且 text 末位非空
const expectDelta = {
  'M1000': ['thick-boy'],
  'Jury-Rigged Boomstick': ['thick-boy'],
  'TH-0R Bug Taser': ['ultimate-sidearm', 'unlimited-power'],
  'BRT7 Burst Fire Gun': ['ultimate-sidearm'],
  'Colette Wave Cooker': ['thermal-oscillator'],
  'Corrosive Sludge Pump': ['top-shelf-sludge'],
  'Subata 120': ['ultimate-sidearm'],
};
for (const [en, ids] of Object.entries(expectDelta)) {
  const w = b.weapons.find((x) => x.englishName === en);
  if (!w) { errs.push(`增量武器缺失: ${en}`); continue; }
  const all = [...(w.yellowOverclockIds || []), ...(w.redOverclockIds || [])];
  for (const id of ids) if (!all.includes(id)) errs.push(`增量武器 ${en} 缺新超频 ${id}`);
}

if (errs.length) {
  console.log('\n❌ 校验失败:');
  errs.forEach((e) => console.log('  - ' + e));
  process.exit(1);
} else {
  console.log('\n✅ 校验通过：计数/标签/id-text 对齐/DLC 引用 全部正确');
}
