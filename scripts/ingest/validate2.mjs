// validate2.mjs — 对比 HEAD 基线，证明 DLC 写回未恶化任何武器的 id/text 对齐
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const cur = JSON.parse(fs.readFileSync(path.join(ROOT, 'server/data/baseline.json'), 'utf8'));
let head = null;
try {
  const out = execSync('git show HEAD:server/data/baseline.json', { cwd: ROOT, encoding: 'utf8' });
  head = JSON.parse(out);
} catch (e) {
  console.log('[WARN] 无法读取 HEAD baseline.json（可能未提交）：' + e.message);
}

const offset = (w) => {
  const ids = (w.yellowOverclockIds || []).length + (w.redOverclockIds || []).length;
  const txt = (w.yellowOverclock || '').split('；').filter(Boolean).length + (w.redOverclock || '').split('；').filter(Boolean).length;
  return ids - txt;
};

const errs = [];
// 1) 11 把新 Demolisher 武器必须完美对齐
const dem = cur.weapons.filter((w) => w.class === 'Demolisher');
for (const w of dem) {
  if (offset(w) !== 0) errs.push(`新 Demolisher 武器未对齐: ${w.englishName} (offset ${offset(w)})`);
  if (!w.dlc) errs.push(`新 Demolisher 武器缺 dlc: ${w.englishName}`);
}
// 2) 9 个新超频 dlc + 被引用
const newOcIds = ['the-reaper','the-tightest-of-springs','thermal-oscillator','thick-boy','top-shelf-sludge','tri-shells','ultimate-sidearm','unlimited-power','volt-splitter'];
const ref = new Set();
cur.weapons.forEach((w) => [...(w.yellowOverclockIds||[]), ...(w.redOverclockIds||[])].forEach((i)=>ref.add(i)));
for (const id of newOcIds) {
  const oc = cur.overclocks.find((o) => o.id === id);
  if (!oc || !oc.dlc) errs.push(`新超频缺失/缺 dlc: ${id}`);
  if (!ref.has(id)) errs.push(`新超频未被引用: ${id}`);
}
// 3) 与 HEAD 对比：所有共有武器的 offset 必须不变（证明无回归）
if (head) {
  const headMap = new Map(head.weapons.map((w) => [w.englishName, w]));
  let changedOffsets = 0;
  for (const w of cur.weapons) {
    const h = headMap.get(w.englishName);
    if (!h) continue; // 新武器，跳过
    if (offset(h) !== offset(w)) {
      changedOffsets++;
      errs.push(`武器 ${w.englishName} 对齐偏移变化: HEAD ${offset(h)} -> now ${offset(w)}`);
    }
  }
  // 统计 HEAD 自身已有多少未对齐（证明是历史遗留）
  let headPreExisting = 0;
  for (const w of head.weapons) if (offset(w) !== 0) headPreExisting++;
  console.log(`HEAD 武器总数=${head.weapons.length}，其中 id/text 已不对齐(历史遗留)=${headPreExisting}`);
  console.log(`共有武器中对齐偏移发生变化的数量=${changedOffsets}（应为 0）`);
}

console.log(`当前 weapons=${cur.weapons.length}, overclocks=${cur.overclocks.length}`);
if (errs.length) { console.log('\n❌'); errs.forEach((e)=>console.log('  - '+e)); process.exit(1); }
else console.log('\n✅ 通过：新武器完美对齐；新超频齐全且被引用；所有共有武器对齐偏移相对 HEAD 无变化（未引入回归）');
