// apply-correct.mjs — Task 1.3 半自动回填名字校正（仅写 baseline.json）
// 安全边界：只动 weapons[].chineseName（13 条空格/引号对齐）+ 一条 englishName 拆分；
//           成就/效果字段/超频/装备 一律不动。
// 用法：
//   node scripts/ingest/apply-correct.mjs            # dry-run，仅打印 diff
//   node scripts/ingest/apply-correct.mjs --apply    # 写回 baseline.json（保持 CRLF + 2 空格缩进）

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const BASELINE = path.join(ROOT, 'server/data/baseline.json');
const REPORT = path.join(ROOT, 'scripts/ingest/match-report.json');
const APPLY = process.argv.includes('--apply');

const raw = fs.readFileSync(BASELINE, 'utf8');
const baseline = JSON.parse(raw);
const report = JSON.parse(fs.readFileSync(REPORT, 'utf8'));

const diffs = [];

// ---------- 1) 13 条武器 chineseName 空格/引号对齐 ----------
const weaponChanges = report.applied.filter(
  (x) => x.kind === 'weapon' && x.changed && typeof x.suggestedZh === 'string'
);
for (const c of weaponChanges) {
  const w = baseline.weapons.find((x) => x.englishName === c.englishName);
  if (!w) {
    console.error(`[WARN] 找不到武器 ${c.englishName}，跳过`);
    continue;
  }
  if (w.chineseName === c.suggestedZh) continue; // 已一致，跳过
  diffs.push({
    type: 'weapon.chineseName',
    englishName: c.englishName,
    from: w.chineseName,
    to: c.suggestedZh,
  });
  w.chineseName = c.suggestedZh;
}

// ---------- 2) Breach Cutter 合并项拆分 ----------
const MERGE_EN = 'Breach Cutter / ArmsKore Coil Gun';
const mergeItem = baseline.weapons.find((x) => x.englishName === MERGE_EN);
if (mergeItem) {
  if (mergeItem.englishName !== 'Breach Cutter') {
    diffs.push({
      type: 'weapon.englishName(split)',
      englishName: MERGE_EN,
      from: mergeItem.englishName,
      to: 'Breach Cutter',
    });
    mergeItem.englishName = 'Breach Cutter';
  }
} else {
  console.error(`[WARN] 未找到合并项 "${MERGE_EN}"，跳过拆分`);
}

// ---------- 输出 diff ----------
console.log(`=== ${APPLY ? 'APPLY' : 'DRY-RUN'} : ${diffs.length} 处变更 ===`);
for (const d of diffs) {
  console.log(`[${d.type}] ${d.englishName}`);
  console.log(`    现: ${JSON.stringify(d.from)}`);
  console.log(`    改: ${JSON.stringify(d.to)}`);
}

if (!APPLY) {
  console.log('\n(dry-run 完成，未写入文件。加 --apply 执行写回)');
  process.exit(0);
}

// ---------- 写回：保持 CRLF + 2 空格缩进 + 顶层键序 ----------
const out = JSON.stringify(baseline, null, 2).replace(/\n/g, '\r\n') + '\r\n';
fs.writeFileSync(BASELINE, out, 'utf8');
console.log(`\n已写入 ${BASELINE}（CRLF + 2 空格缩进，键序不变）`);
