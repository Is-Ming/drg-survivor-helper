// 一次性脚本：将 weapons.ts 中的超频名称数组转换为 ID 数组
import { readFileSync, writeFileSync } from 'fs'

const idMap = {}

// 读取 overclocks.ts 构建英文名 → ID 映射
const ocRaw = readFileSync('src/data/overclocks.ts', 'utf8')
const nameRe = /id:\s*'([^']+)'[\s\S]*?englishName:\s*'([^']+)'/g
for (const [, id, name] of ocRaw.matchAll(nameRe)) {
  idMap[name] = id
}

// 补充含特殊字符的条目（手动确认）
const manual = {
  'A Little More Oomph!': 'a-little-more-oomph',
  'Tape Some Ice to It!': 'tape-some-ice-to-it',
  'Tape Some Nails to It': 'tape-some-nails-to-it',
  'Double Barrel!': 'double-barrel',
  'More Bounce!': 'more-bounce',
  'Mini Pellets (红版同名)': 'mini-pellets',
  // PRD 表中有括号标注的超频名 → 基础超频 ID
  'Lead Wrapped Ammo (+150% Damage)': 'lead-wrapped-ammo',
  'Aggro Behaviour Chip': 'behaviour-chip-aggro',
  'More Drones (+3)': 'more-drones-unstable',
  'Disposable Tech (+Reload)': 'disposable-tech-balanced',
  'Extra Capacity (+Dmg)': 'extra-capacity-balanced',
  'Extra Capacity (+3 Turrets)': 'extra-capacity-unstable',
  'Spliced Emitter (+75% Lifetime)': 'spliced-emitter',
  'Defensive Behaviour Chip': 'behaviour-chip-defensive',
  'Extra Capacity (+4 Turrets)': 'extra-capacity-unstable',
  'Extra Capacity (+Range)': 'extra-capacity-balanced',
  'Disposable Tech (+20% Reload)': 'disposable-tech-balanced',
  'Extra Capacity (-Range)': 'extra-capacity-balanced',
  'Extra Capacity (+3 Turrets, -30% Range)': 'extra-capacity-unstable',
  'Bigger Mags (+100% Clip, +100% Fire Rate)': 'bigger-mags-unstable',
  'Bigger Mags (+Piercing)': 'bigger-mags-balanced',
  'Akimbo (+25% Fire/Potency)': 'akimbo-unstable',
}
Object.assign(idMap, manual)

let content = readFileSync('src/data/weapons.ts', 'utf8')
let changed = false
const unmatched = new Set()

// 替换 yellowOverclockIds / redOverclockIds 数组中的每个名字为 ID
content = content.replace(
  /(yellowOverclockIds|redOverclockIds):\s*(\[[^\]]*\])/g,
  (match, key, arrStr) => {
    const ids = arrStr.replace(/"([^"]+)"/g, (_, name) => {
      const id = idMap[name]
      if (id) {
        changed = true
        return `"${id}"`
      } else {
        unmatched.add(name)
        return `"${name}"` // 保留原值
      }
    })
    return `${key}: ${ids}`
  },
)

if (changed) {
  writeFileSync('src/data/weapons.ts', content)
  console.log('✅ weapons.ts 已更新')
} else {
  console.log('⚠️ 无变更')
}

if (unmatched.size > 0) {
  console.log('⚠️ 以下超频名未找到对应 ID：')
  for (const n of unmatched) console.log(`  - ${n}`)
}
