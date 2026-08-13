// emit-ts.mjs — 将 demolisher-patch.json 的 11 武器 / 9 超频追加进 weapons.ts / overclocks.ts
// 与 baseline.json 完全对齐；保留既有 2 空格缩进风格。
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PATCH = path.join(ROOT, 'scripts/ingest/demolisher-patch.json');
const WT = path.join(ROOT, 'src/data/weapons.ts');
const OT = path.join(ROOT, 'src/data/overclocks.ts');
const APPLY = process.argv.includes('--apply');

const { newWeapons, newOverclocks, deltas } = JSON.parse(fs.readFileSync(PATCH, 'utf8'));
const q = (s) => JSON.stringify(s); // 产出带双引号的合法 TS 字符串（weapons.ts 用，与原文一致）
// overclocks.ts 原文用单引号，故新条目也用单引号以保持风格一致
const q1 = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";

// 将 7 把现有武器的增量超频挂接写回 weapons.ts（保持与 baseline.json 一致，
// 因为 weapons.ts 是前端 fallback 且被 filter/editor 钩子直接 import）。
// 按武器块逐行处理，绝不影响其它武器。
function applyDeltasToTs(ts) {
  // 必须按实际换行符切分：weapons.ts 为 CRLF，若按 \n 切分会残留 \r，
  // 导致 `",$` / `],$` 替换失效（行尾实际是 ",\r）。按检测到的换行符切分并回拼，保 CRLF。
  const eol = ts.includes('\r\n') ? '\r\n' : '\n';
  const lines = ts.split(eol);
  for (const d of (deltas || [])) {
    const txtKey = d.color + 'Overclock';
    const idsKey = d.color + 'OverclockIds';
    const labels = d.added.map((a) => a.label).join('；');
    const idStr = d.added.map((a) => q(a.id)).join(', ');
    let inBlock = false;
    for (let i = 0; i < lines.length; i++) {
      if (!inBlock) {
        if (lines[i].includes(`englishName: ${q(d.weapon)},`)) inBlock = true;
        continue;
      }
      if (lines[i].trim() === '},') break; // 块结束
      // 行首锚定，避免 yellowOverclock 被 redOverclock 子串误匹配；
      // 正则字面量不支持 ${} 插值，必须用 new RegExp 构造
      if (new RegExp('^\\s*' + txtKey + ':').test(lines[i]) && labels) {
        // 行尾形如 `    redOverclock: "...",` —— 在结尾引号前追加
        lines[i] = lines[i].replace(/",$/, `；${labels}",`);
      }
      if (new RegExp('^\\s*' + idsKey + ':').test(lines[i]) && idStr) {
        // 行尾形如 `    redOverclockIds: [...],` —— 在结尾 ] 前追加
        lines[i] = lines[i].replace(/\],$/, `, ${idStr}],`);
      }
    }
  }
  return lines.join(eol);
}

const wText = newWeapons.map((w) => {
  const tags = '[' + w.tags.map(q).join(', ') + ']';
  const yIds = '[' + w.yellowOverclockIds.map(q).join(', ') + ']';
  const rIds = '[' + w.redOverclockIds.map(q).join(', ') + ']';
  return [
    '  {',
    `    englishName: ${q(w.englishName)},`,
    `    chineseName: ${q(w.chineseName)},`,
    `    class: ${q(w.class)},`,
    `    tags: ${tags},`,
    `    yellowOverclock: ${q(w.yellowOverclock)},`,
    `    redOverclock: ${q(w.redOverclock)},`,
    `    yellowOverclockIds: ${yIds},`,
    `    redOverclockIds: ${rIds},`,
    `    rating: ${q(w.rating)},`,
    `    version: ${q(w.version)},`,
    '    dlc: true,',
    '  },',
  ].join('\n');
}).join('\n');

const oText = newOverclocks.map((o) => {
  return `  { id: ${q1(o.id)}, englishName: ${q1(o.englishName)}, chineseName: ${q1(o.chineseName)}, type: ${q1(o.type)}, effect: ${q1(o.effect)}, enEffect: ${q1(o.enEffect)}, dlc: true },`;
}).join('\n');

console.log(`weapons 待追加: ${newWeapons.length}，overclocks 待追加: ${newOverclocks.length}`);

if (!APPLY) {
  console.log('\n--- weapons.ts 追加预览 ---\n' + wText);
  console.log('\n--- overclocks.ts 追加预览 ---\n' + oText);
  console.log('\n(dry-run 完成。加 --apply 写入)');
  process.exit(0);
}

// 在数组结尾的最后一个 `]` 之前插入新条目。
// weapons.ts 的 `]` 在文件结尾；overclocks.ts 的 `]` 后跟 ` as Record`/注释，
// 故不能用“匹配结尾”的正则，统一改用 lastIndexOf('\n]') 在数组闭合前插入。
function appendEntries(src, block) {
  const idx = src.lastIndexOf('\n]');
  if (idx === -1) throw new Error('找不到数组结尾 ]');
  const head = src.slice(0, idx).replace(/\s+$/, '');
  return head + '\n' + block + src.slice(idx);
}

// weapons.ts
let wt = fs.readFileSync(WT, 'utf8');
if (wt.includes('共 42 条')) wt = wt.replace('共 42 条', `共 ${42 + newWeapons.length} 条`);
wt = applyDeltasToTs(wt); // 先挂接 7 把现有武器的增量超频
wt = appendEntries(wt, wText); // 再追加 11 把新武器
fs.writeFileSync(WT, wt, 'utf8');

// overclocks.ts
let ot = fs.readFileSync(OT, 'utf8');
ot = appendEntries(ot, oText);
fs.writeFileSync(OT, ot, 'utf8');

console.log('已写入 weapons.ts / overclocks.ts');
