// probe.mjs — 临时探查：从本地化包取 11 武器/9 超频官方中文名；从 wiki-raw HTML 取武器标签
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PAIR = path.join(ROOT, 'drg_zh_en_pair.json');
const RAW = path.join(ROOT, 'scripts/ingest/wiki-raw');

const pair = JSON.parse(fs.readFileSync(PAIR, 'utf8'));
// 为加速，只扫 entries 数组
const entries = Array.isArray(pair) ? pair : (pair.entries || []);
const byEn = new Map();
for (const e of entries) {
  if (e && e.en) byEn.set(e.en, e);
}

const WEAPONS = [
  'Dragonstorm Incinerator', 'Twincoil Arc Burster', 'Proximity Mines',
  'Chimera Fragcannon', 'Voltaic Field Generator', 'Slither Drones',
  'E1M1 Caustic Scattergun', 'Toxic Sludge Spreader', 'Springloaded Ripper',
  'Kaisong Scissor Ray', 'Carrier Drone',
];
console.log('=== 武器官方中文名 (drg_zh_en_pair.json) ===');
for (const w of WEAPONS) {
  const e = byEn.get(w);
  console.log(`${w}\t=>\t${e ? e.zh_cn : '!!! 未找到'}`);
}

const OC_EN = [
  'The Reaper', 'The Tightest of Springs', 'Thermal Oscillator', 'Thick Boy',
  'Top-Shelf Sludge', 'Tri-Shells', 'Ultimate Sidearm', 'Unlimited Power', 'Volt Splitter',
];
console.log('\n=== 超频官方中文名 (drg_zh_en_pair.json) ===');
for (const o of OC_EN) {
  const e = byEn.get(o);
  console.log(`${o}\t=>\t${e ? e.zh_cn : '!!! 未找到'}`);
}

console.log('\n=== 各武器 wiki 标签原始数据 ===');
for (const w of WEAPONS) {
  const file = path.join(RAW, w.replace(/[^A-Za-z0-9]+/g, '_') + '.html');
  if (!fs.existsSync(file)) { console.log(`${w}: 文件缺失`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  // wgCategories
  let cats = [];
  const m = html.match(/wgCategories"\s*:\s*(\[[\s\S]*?\])\s*\]/);
  if (m) {
    try { cats = JSON.parse(m[1] + ']').map((c) => (typeof c === 'string' ? c : c.catname)); } catch {}
  }
  // infobox data-source 在 Tags section 内的值
  const tagBlock = html.match(/<h2[^>]*>Tags<\/h2>([\s\S]*?)<\/section>/);
  const sources = [];
  if (tagBlock) {
    const re = /data-source="([^"]+)"[^>]*>([\s\S]*?)<\/div>/g;
    let mm;
    while ((mm = re.exec(tagBlock[1]))) {
      const val = mm[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      sources.push(`${mm[1]}=[${val}]`);
    }
  }
  console.log(`\n## ${w}`);
  console.log('  wgCategories:', JSON.stringify(cats));
  console.log('  infobox Tags:', JSON.stringify(sources));
}
