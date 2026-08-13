// 把 match-equipment-effects.mjs 产出的已解析中文效果应用到基线
// 只读 equipment-effect-report.json：对 matched && !needsReview 的条目，覆盖 baseline effect 字段。
// 9 条待核（needsReview）保持原样不动。同时同步 src/data/equipments.ts 防止漂移。
// 不碰 officialEffect / officialName / 其余字段。CRLF 写回。
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.cwd())
const rep = JSON.parse(fs.readFileSync(path.join(root, 'scripts/ingest/equipment-effect-report.json'), 'utf8'))

// 待应用的 name -> effect
const applyMap = new Map()
for (const it of rep.items) {
  if (it.matched && !it.needsReview && it.zhEffect) {
    let eff = it.zhEffect
    if (it.fallback) eff = eff + '（非官方译）'
    applyMap.set(it.name, eff)
  }
}
console.log('待应用条目数:', applyMap.size)

// ---- 1. baseline.json ----
const basePath = path.join(root, 'server/data/baseline.json')
const base = JSON.parse(fs.readFileSync(basePath, 'utf8'))
let baseApplied = 0
for (const eq of base.equipments) {
  if (applyMap.has(eq.name)) {
    eq.effect = applyMap.get(eq.name)
    baseApplied++
  }
}
fs.writeFileSync(basePath, JSON.stringify(base, null, 2).replace(/\n/g, '\r\n') + '\r\n')
console.log('baseline.json 已应用:', baseApplied)

// ---- 2. src/data/equipments.ts ----
const tsPath = path.join(root, 'src/data/equipments.ts')
let ts = fs.readFileSync(tsPath, 'utf8')
let tsApplied = 0
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
for (const [name, eff] of applyMap) {
  const re = new RegExp(`(name:\\s*"${esc(name)}"[\\s\\S]*?(?<!official)effect:\\s*")([^"]*)(")`, 'm')
  if (re.test(ts)) {
    ts = ts.replace(re, `$1${eff.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}$3`)
    tsApplied++
  } else {
    console.log('  [warn] equipments.ts 未匹配到:', name)
  }
}
fs.writeFileSync(tsPath, ts)
console.log('equipments.ts 已应用:', tsApplied)
console.log('完成。建议：npm test && npm run build 后部署。')
