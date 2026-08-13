// 给武器对象加 classLabels（职业中文标签，自包含），写入 baseline.json + weapons.ts。
// 仅补充字段，不改其余数据；保留原文件换行风格。
import fs from 'node:fs'

const root = process.cwd()
const baselinePath = `${root}/server/data/baseline.json`
const weaponsTsPath = `${root}/src/data/weapons.ts`

// 与 enums.ts WEAPON_CLASS_LABEL 保持一致（此处内联避免依赖 TS 编译）
const WEAPON_CLASS_LABEL = {
  Scout: { zh: '侦察兵', en: 'Scout' },
  Gunner: { zh: '机枪手', en: 'Gunner' },
  Engineer: { zh: '工程师', en: 'Engineer' },
  Driller: { zh: '钻机手', en: 'Driller' },
  Demolisher: { zh: '破拆员', en: 'Demolisher' },
}

// ---------- baseline.json ----------
const b = JSON.parse(fs.readFileSync(baselinePath, 'utf8'))
let baseCount = 0
for (const w of b.weapons) {
  const L = WEAPON_CLASS_LABEL[w.class]
  if (!L) {
    console.warn(`⚠ 未知 class: ${w.class} (${w.englishName})`)
    continue
  }
  w.classLabels = { zh: L.zh, en: L.en }
  baseCount++
}
const baseOut = JSON.stringify(b, null, 2).replace(/\n/g, '\r\n') + '\r\n'
fs.writeFileSync(baselinePath, baseOut)
console.log(`baseline.json: 写入 classLabels ${baseCount} 把`)

// ---------- weapons.ts ----------
let ts = fs.readFileSync(weaponsTsPath, 'utf8')
if (ts.includes('classLabels')) {
  console.log('weapons.ts: 已含 classLabels，跳过')
} else {
  const eol = ts.includes('\r\n') ? '\r\n' : '\n'
  ts = ts.replace(/class: "([^"]+)",/g, (m, c) => {
    const L = WEAPON_CLASS_LABEL[c]
    if (!L) return m
    return `class: "${c}",${eol}    classLabels: { zh: "${L.zh}", en: "${L.en}" },`
  })
  fs.writeFileSync(weaponsTsPath, ts)
  const cnt = (ts.match(/classLabels:/g) || []).length
  console.log(`weapons.ts: 写入 classLabels ${cnt} 把`)
}
