const fs = require('fs');
const path = require('path');
const WIKI = require('./wiki_data.cjs');

// ---- 1. 对照表：名称映射 + 效果碎片映射 ----
const zhPath = 'F:/workbuddy工作空间/日常/中文提取/drg_zh_en.json';
const zh = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
const art = zh.entries.filter(e => e.table === 'Artifacts_zh-CN');
const GARB = '""""""';
const nameEn2Zh = {}, nameZh2En = {};
const effMap = {}; // enNorm(lower,noPH) -> zh
art.forEach(e => {
  const en = String(e.en || '').trim();
  const z = String(e.zh_cn || '').trim();
  if (!en || !z || en === GARB || z === GARB) return;
  if (/[一-鿿]/.test(z) && !/\{/.test(en) && !nameEn2Zh[en]) {
    nameEn2Zh[en] = z; nameZh2En[z] = en;
  }
});
art.forEach(e => {
  const en = String(e.en || '').trim();
  const z = String(e.zh_cn || '').trim();
  if (!en || !z || en === GARB || z === GARB) return;
  if (/[一-鿿]/.test(z) && !nameEn2Zh[en]) {
    const k = norm(en);
    if (k.length > 8) effMap[k] = z;
  }
});

// ---- 2. 术语表（按长度降序，长优先，避免子串误替）----
const TERM = [
  ['Status Effect Damage', '状态效果伤害'],
  ['Critical Damage', '暴击伤害'],
  ['Critical Chance', '暴击几率'],
  ['Move Speed', '移动速度'],
  ['Reload Speed', '换弹速度'],
  ['Mining Speed', '挖掘速度'],
  ['Fire Rate', '射速'],
  ['Max HP', '最大血量'],
  ['Missing HP', '损失血量'],
  ['Life Regen', '生命再生'],
  ['Rock and Stone', '岩石'],
  ['Drop Pod', '撤离舱'],
  ['Projectiles', '发射物'],
  ['Projectile', '发射物'],
  ['Overclock', '超频'],
  ['Knock back', '击退'],
  ['Standing still', '静止站立'],
  ['Cooldown', '冷却'],
  ['Freeze', '急冻'],
  ['Cryo', '急冻'],
  ['Burn', '燃烧'],
  ['Slow', '减速'],
  ['Heals', '治疗'],
  ['Heal', '治疗'],
  ['Buff', '增益'],
  ['Temporary', '临时'],
  ['Unique', '独特'],
  ['Reroll', '重随'],
  ['Discount', '折扣'],
  ['Magnet', '磁铁'],
  ['Weapon', '武器'],
  ['Tag', '标签'],
  ['Levels', '等级'],
  ['Level', '等级'],
  ['Gold', '黄金'],
  ['Nitra', '硝石'],
  ['Minerals', '矿物'],
  ['Alien', '异虫'],
  ['Enemy', '敌人'],
  ['Shop', '商店'],
  ['Stage', '关卡'],
  ['Dive', '潜入'],
  ['Mastery Points', '精通点数'],
  ['Milestone', '里程碑'],
  ['Damage', '伤害'],
  ['Armor', '护甲'],
  ['Dodge', '闪避'],
  ['Luck', '幸运'],
  ['Potency', '效力'],
  ['Piercing', '穿透'],
  ['Stacks', '层'],
  ['Stack', '层'],
  ['Speed', '速度'],
  ['FIRE', '燃烧'],
  ['COLD', '急冻'],
  ['Gain', '获得'],
  ['Increases', '提升'],
  ['Increase', '提升'],
  ['Decreases', '降低'],
  ['Decrease', '降低'],
  ['Gives', '给予'],
  ['Spawns', '生成'],
  ['Collecting', '收集'],
  ['Collect', '收集'],
  ['Lure', '引诱'],
  ['Equip', '装备'],
  ['nearby enemies', '周围敌人'],
  ['taking damage', '受到伤害'],
  ['take damage', '受到伤害'],
  ['when', '当'],
  ['while', '当'],
  ['seconds', '秒'],
  ['times', '次'],
  ['points', '点'],
  ['chance', '几率'],
  ['Burning', '燃烧'],
  ['Explode', '爆炸'],
  ['movespeed', '移动速度'],
  ['Lasts', '持续'],
  ['moving', '移动'],
  ['dealing', '造成'],
  ['deals', '造成'],
  ['mining any kind of rock', '挖掘任意岩体时'],
  ['for every', '每'],
  ['whenever', '每当'],
  ['entering', '进入'],
  ['granted on', '获得时'],
  ['healing', '治疗'],
  ['additional', '额外'],
  ['random', '随机'],
  ['bunch', '一群'],
  ['anything', '任何'],
  ['kind of', '种类的'],
  ['quick escape', '快速逃离'],
  ['of', '的'],
  ['your', '你的'],
  ['you', '你'],
  ['XP Gain', '经验获取'],
  ['XP', '经验'],
  ['HP', '血量'],
].sort((a, b) => b[0].length - a[0].length);

function norm(s) {
  return String(s || '').toLowerCase()
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}
function tr(en) {
  let s = en;
  for (const [k, v] of TERM) {
    const esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = /^[A-Z]{2,3}$/.test(k) ? new RegExp('\\b' + esc + '\\b', 'gi') : new RegExp(esc, 'gi');
    try { s = s.replace(re, v); } catch (e) {}
  }
  return s;
}
function normM(s) { return norm(s).replace(/\d+/g, ' ').replace(/cooldown|seconds/g, ' '); }
function matchEff(enEff) {
  if (!enEff) return null;
  const wn = normM(enEff);
  let best = null, bestLen = 0;
  for (const k in effMap) {
    if (k.length <= 8) continue;
    const kn = normM(k);
    if (kn.replace(/\s+/g, '').length < 4) continue;
    if (wn.includes(kn) || kn.includes(wn)) {
      if (k.length > bestLen) { bestLen = k.length; best = effMap[k]; }
    }
  }
  return best;
}

// ---- 3. baseline 装备 ----
const base = JSON.parse(fs.readFileSync('server/data/baseline.json', 'utf8'));
const eqs = base.equipments || [];

const groups = { '局内附加': [], '成就解锁': [], '其他/待定': [] };
eqs.forEach(eq => {
  const src = eq.source || '';
  if (src === '局内附加') groups['局内附加'].push(eq);
  else if (src === '成就解锁') groups['成就解锁'].push(eq);
  else groups['其他/待定'].push(eq);
});

let cnt = { '对照表': 0, '译': 0, '待补': 0 };
let md = '# 附加装备描述对齐清单 v2\n\n';
md += '> **ZH 来源标注**：`对照表` = 官方中文碎片（含 `{xxx}` 占位符，数值由你后续补）；`译` = 术语表翻译 wiki 英文草稿；`待补` = wiki 无此条。\n';
md += '> EN 全部来自 wiki.gg 官方 wiki 逐字描述。\n\n';

for (const g of ['局内附加', '成就解锁', '其他/待定']) {
  md += `## ${g} —— ${groups[g].length} 个\n\n`;
  groups[g].forEach(eq => {
    const zhName = eq.name;
    const enName = nameZh2En[zhName] || zhName;
    const w = WIKI.find(x => x.en.toLowerCase() === String(enName).toLowerCase());
    let enDesc = '', zhPrim = '', zhEff = '', srcZh = '待补', enLine = '';
    if (w) {
      enLine = [w.primary, w.effect].filter(Boolean).join(' ').trim();
      enDesc = enLine;
      zhPrim = w.primary ? tr(w.primary) : '';
      const mf = matchEff(w.effect);
      if (mf) {
        zhEff = mf;
        const cd = (w.effect.match(/(\d+)\s*seconds?\s*cooldown/i) || [])[1];
        if (cd && !/冷却/.test(zhEff)) zhEff += `（${cd} 秒冷却）`;
        srcZh = '对照表'; cnt['对照表']++;
      }
      else if (w.effect) { zhEff = tr(w.effect); srcZh = '译'; cnt['译']++; }
      else if (w.primary) { srcZh = '译'; cnt['译']++; }
    } else {
      cnt['待补']++;
    }
    const suspect = eq.suspected ? ' `⚠️待定`' : '';
    md += `### ${zhName}${suspect} ／ ${enName}\n`;
    md += `- **EN**： ${enDesc || '（wiki 无此条）'}\n`;
    md += `- **ZH（${srcZh}）**： ${[zhPrim, zhEff].filter(Boolean).join(' ') || '（待补）'}\n`;
    md += `- 来源字段：\`${eq.source || '空'}\`\n\n`;
  });
}

md += `---\n\n## 覆盖统计\n`;
md += `- 对照表碎片命中：**${cnt['对照表']}** 个\n`;
md += `- 术语表翻译草稿：**${cnt['译']}** 个\n`;
md += `- 待补（wiki 无）：**${cnt['待补']}** 个\n`;
md += `- 合计：**${eqs.length}** 个\n`;

fs.writeFileSync('artifact-desc-align.md', md, 'utf8');
console.log('done. 对照表=', cnt['对照表'], ' 译=', cnt['译'], ' 待补=', cnt['待补']);
