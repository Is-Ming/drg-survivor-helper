// 补全 26 条空 officialEffect 装备的 officialEffect(英文) 与 effect(中文)。
// 来源：官方简中包 drg_zh_en_pair.json 的 Artifacts 表（名条目紧邻效果条目）；
//       弹药背带(Ammo Rig) 官方包为乱码，改取联网交叉确认的社区权威描述。
// 不动 type / source（用户自填）。含占位符({cooldown}/{stats}/{amount})或截断/非官方包源的标 needsReview。
import fs from 'fs'

const BASE = 'server/data/baseline.json'
const raw = fs.readFileSync(BASE, 'utf8')
const b = JSON.parse(raw)

// officialName -> { officialEffect, effect, needsReview }
const MAP = {
  'Ammo Rig': { officialEffect: '+50% Fire Rate, -15% Move Speed', effect: '+50% 射速，-15% 移动速度', needsReview: true },
  'Gold Scanner': { officialEffect: 'You get a small chance to find Gold, when mining any kind of rock!', effect: '挖掘任意岩体时，有很小几率挖到黄金！' },
  'Nitra Scanner': { officialEffect: 'You get a small chance to find Nitra, when mining any kind of rock!', effect: '挖掘任意岩体时，有很小几率挖到硝石！' },
  'XP Scanner': { officialEffect: 'You get a small chance to find XP, when mining any kind of rock!', effect: '挖掘任意岩体时，有很小几率挖到经验！' },
  'FRZ Shield Belt': { officialEffect: 'Knock back and slow nearby enemies when you take damage.', effect: '在受到伤害时，对周围的敌人造成击退和减速。' },
  'BRN Shield Belt': { officialEffect: 'Explode in a ring of fire dealing damage and burning nearby enemies when you take damage.', effect: '在受到伤害时向周围释放一圈火焰，对周围的敌人造成伤害并赋予燃烧。' },
  'Jet Boots': { officialEffect: 'Allows you to make a quick escape when taking damage. {cooldown}s cooldown.', effect: '在受到伤害时迅速逃离危险。\n冷却时间 {cooldown} 秒。', needsReview: true },
  'Popup Tripod': { officialEffect: 'Increase your fire rate and reload speed when standing still', effect: '站定不动时将提升射击速度和换弹速度。' },
  "Diver's Manual": { officialEffect: 'Lightning Reflexes', effect: '即时反应' },
  'Chemist Kit': { officialEffect: 'Piercing Projectiles', effect: '穿深型发射物' },
  'Piercing Projectiles': { officialEffect: 'Weapon Box', effect: '武器补给箱' },
  'Multi Tool': { officialEffect: '{stats} for every unique [Tag] equipped', effect: '持有的武器每包含一个非重复 [标签] 将获得：{stats}', needsReview: true },
  'Pick Axtender': { officialEffect: 'Increases your reach when mining', effect: '提升挖掘的最远距离。' },
  'Old Memento': { officialEffect: 'Increases your damage for every point of missing HP', effect: '基于当前损失的血量提升伤害。' },
  'Frostburn': { officialEffect: 'Dealing fire damage now applies slow', effect: '燃烧伤害现在会附加减速效果。' },
  'Hot Plasma': { officialEffect: 'Dealing plasma damage now applies burn', effect: '电浆伤害现在会附加燃烧效果。' },
  'Barley Bulb Juice': { officialEffect: 'Gain a temporary movespeed buff when standing still', effect: '站定不动将获得短暂的移动速度提升。' },
  'Lightning Reflexes': { officialEffect: 'Shockingly good reflexes', effect: '惊人的好身法！' },
  'Hotstepper': { officialEffect: 'After taking damage you gain a boost of speed and leave fire puddle on the ground for a short period of time. 30 second cooldown.', effect: '在受到伤害时将短暂提升移动速度，同时点燃经过的地面。冷却时间 30 秒。' },
  '5 Leaf Clover': { officialEffect: 'Increases your Luck whenever you reroll anything', effect: '每当进行（任意类型的）刷新将获得：', needsReview: true },
  'Gridrunner': { officialEffect: 'Operator', effect: '操作员' },
  'Overflow': { officialEffect: 'Corrosive Thunder', effect: '酸蚀雷爆' },
  'Corrosive Thunder': { officialEffect: 'Change the proximity mines to Acid and Electrical mines', effect: '将感应地雷变为腐蚀电击地雷。' },
  'Charged reload': { officialEffect: 'Release a large electrical groundzone when the weapon reloads', effect: '武器开始换弹时将在自身位置留下大范围的弥留电场。' },
  'Diffractor prism': { officialEffect: 'You know what do to with this', effect: '你知道该拿它干什么。' },
  'Widget Spinner': { officialEffect: 'Collected {amount}', effect: '已获得：{amount}', needsReview: true },
}

let filled = 0
let flagged = 0
for (const e of b.equipments) {
  if ((e.officialEffect || '').trim() !== '') continue // 仅处理空 officialEffect
  const d = MAP[e.officialName]
  if (!d) { console.log('  ⚠ 无数据映射，跳过:', e.name, '/', e.officialName); continue }
  e.officialEffect = d.officialEffect
  e.effect = d.effect
  // 保留既有 needsReview（之前 13 条已标记的 8 条），新标占位符/非官方包源
  if (d.needsReview) e.needsReview = true
  filled++
  if (e.needsReview) flagged++
}

const out = JSON.stringify(b, null, 2).replace(/\n/g, '\r\n') + '\r\n'
fs.writeFileSync(BASE, out)
console.log(`\n✅ 已写入 ${filled} 条 officialEffect+effect；其中 needsReview 标记 ${flagged} 条`)
console.log('剩余空 officialEffect:', b.equipments.filter(e => (e.officialEffect || '').trim() === '').length)
console.log('剩余空 effect:', b.equipments.filter(e => (e.effect || '').trim() === '').length)
