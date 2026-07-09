// 为 equipments.ts 添加英文字段（按 name 匹配）
import { readFileSync, writeFileSync } from 'fs'

const content = readFileSync('src/data/equipments.ts', 'utf8')

const patches = {
  '商店折扣券':        { enName: 'DRG Coupon', enType: 'Development', enEffect: 'Shop discount, useful early with Ecology spec.', enOfficialEffect: 'Gives a 20% discount to all shop purchases' },
  '集团配发磁铁':      { enName: 'Company-issued Magnet', enType: 'Pickup', enEffect: 'Improves pickup range when weak.', enOfficialEffect: 'Spawns a magnet at end of stage that collects 50% of the XP' },
  '红糖块':           { enName: 'Red Sugar Cube', enType: 'Survival', enEffect: 'Collecting Red Sugar increases Max HP.', enOfficialEffect: 'Collecting Red Sugar increases your Max HP by 3' },
  '挖矿概率得黄金/硝石/经验': { enName: 'Gold Scanner / Nitra Scanner / XP Scanner', enType: 'Development', enEffect: 'Chance for extra resources when mining.', enOfficialEffect: 'Small chance to find Gold/Nitra/XP when mining rock' },
  '记仇名单':          { enName: 'Clipboard of Grudges', enType: 'Experience', enEffect: 'Gain XP when taking damage.', enOfficialEffect: '+10% XP Gain; Gain XP when you take damage' },
  '武器补给箱':        { enName: 'Weapon Box', enType: 'Weapon', enEffect: 'Get a random weapon from another class.', enOfficialEffect: 'Equip an additional random level 6 weapon with a random overclock' },
  '复古知识库':        { enName: 'Ancient Knowledge', enType: 'Development', enEffect: 'Gain 3 levels instantly.', enOfficialEffect: 'Gain 3 Levels' },
  '侧目目镜 / EE5 目镜': { enName: 'Squint-EE5', enType: 'Direct/Hybrid Damage', enEffect: '-30% Dmg, +30% Crit, +100% Crit Dmg.', enOfficialEffect: '+30% Critical Chance, +100% Critical Damage, -30% Damage' },
  'P2W 控制器':       { enName: 'Pay2Win Console', enType: 'Combat Power', enEffect: 'Stacks damage on reroll.', enOfficialEffect: 'Increases damage (+2.5%) whenever you reroll, stacks up to 100' },
  '涡轮解码器':        { enName: 'Turbo Encabulator', enType: 'Combat Power', enEffect: '-Mining Speed, +Dmg & Reload per OC.', enOfficialEffect: '+3% Damage, +3% Reload Speed, -5% Mining Speed for every equipped Overclock' },
  '三明治':           { enName: '待核（疑似 Tactical Cookie）', enType: 'Survival', enEffect: 'Heals, pair with Energy Bars.', enOfficialEffect: 'Tactical Cookie: Heals 50% Max HP when entering Drop Pod (pending verification)' },
  '椒盐卷饼':          { enName: 'Salty Pretzel', enType: 'Survival', enEffect: 'Heals, pair with Berserker Helm.', enOfficialEffect: '+1 Armor for every 2% of missing HP' },
  '能量棒':           { enName: 'Energy Bars', enType: 'Survival', enEffect: 'Pairs with Sandwich.', enOfficialEffect: '+1% Damage, -3 Max HP for every player level' },
  '挖他命':           { enName: '待核（疑似 Vita-miner Pills）', enType: 'Survival/Level Up', enEffect: 'More healing on level up.', enOfficialEffect: 'Vita-miner Pills: +5% Max HP; increases healing on level up (pending verification)' },
  '狂人头盔':          { enName: '待核（无 exact 对应）', enType: 'Combat Power', enEffect: 'Low HP buffer.', enOfficialEffect: '— (pending verification)' },
  '腌制硝石':          { enName: 'Pickled Nitra', enType: 'Direct Dmg Core', enEffect: 'Dmg boost per Nitra, core for direct dmg builds.', enOfficialEffect: '+2% Damage and -0.5% Move Speed for every Nitra you have' },
  '反射调节仪':        { enName: 'Reflex Calibrator', enType: 'Dodge', enEffect: '+5% Dodge on hit, max 5 stacks.', enOfficialEffect: '+5% Armor; +5% Dodge for 10s when taking damage, stacks 5' },
  '护甲润滑油':        { enName: 'Armor Grease', enType: 'Dodge', enEffect: '+10% Dodge bonus.', enOfficialEffect: '+5% Move Speed; +2% Dodge while moving, stacks 5' },
  '硝基火药':          { enName: 'Nitragenic Powder', enType: 'Critical', enEffect: '+Crit Chance per Nitra.', enOfficialEffect: '+0.5% Critical Chance for every Nitra, max 500 stacks' },
  '嗜矿异虫召唤装备':    { enName: 'Huuli Bait', enType: 'Summon', enEffect: 'Summon 4 Huuli Hoarders at once.', enOfficialEffect: 'Lure out a bunch of Huuli Hoarders' },
}

const sourceEn = {
  '局内附加': 'In-run Pickup',
  '成就解锁': 'Achievement Unlock',
}

let result = content

for (const [cnName, p] of Object.entries(patches)) {
  // Find the equipment entry by name and inject English fields
  const pattern = new RegExp(
    `(name:\\s*"${cnName}"[\\s\\S]*?source:\\s*"([^"]+)")([\\s\\S]*?)(\\n\\s*\\})`,
  )
  result = result.replace(pattern, (match, header, sourceCn, middle, closing) => {
    const sourceEnVal = sourceEn[sourceCn] ?? sourceCn
    return `${header},${middle}
    englishName: "${p.enName}",
    englishType: "${p.enType}",
    englishEffect: "${p.enEffect}",
    officialEffectEn: "${p.enOfficialEffect}",${closing}`
  })
}

writeFileSync('src/data/equipments.ts', result)
console.log('✅ equipments.ts updated')
