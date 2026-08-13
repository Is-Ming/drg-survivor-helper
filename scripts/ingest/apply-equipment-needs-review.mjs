// 把"没对上"的装备用 wiki 英文效果兜底填入 effect，并打 needsReview 标记。
// 仅改 baseline.json（线上真源）；equipments.ts 不碰（线上只用 baseline）。
import fs from 'node:fs'

const root = process.cwd()
const baselinePath = `${root}/server/data/baseline.json`
const reportPath = `${root}/scripts/ingest/equipment-effect-report.json`

const b = JSON.parse(fs.readFileSync(baselinePath, 'utf8'))
const rep = JSON.parse(fs.readFileSync(reportPath, 'utf8'))

// 待处理：未配对 或 含未解占位符
const pending = rep.items.filter(
  (r) => !r.matched || (r.needsReview && r.unresolvedPlaceholders && r.unresolvedPlaceholders.length),
)
const pendingNames = new Set(pending.map((r) => r.name))

// 可填充：officialEffect 非空且不是 "—（待核）" 这类占位
const fillable = (en) => {
  if (!en) return false
  const t = String(en).trim()
  if (t === '') return false
  if (/^—/.test(t)) return false // dash 占位
  return true
}

let marked = 0
let filled = 0
const log = []
for (const eq of b.equipments) {
  if (!pendingNames.has(eq.name)) continue
  eq.needsReview = true
  marked++
  if (fillable(eq.officialEffect)) {
    eq.effect = eq.officialEffect
    filled++
    log.push(`✅ 填充英文: ${eq.name} <- ${JSON.stringify(eq.officialEffect)}`)
  } else {
    log.push(`⏳ 无英文源，保持原 effect: ${eq.name} (officialEffect=${JSON.stringify(eq.officialEffect)})`)
  }
}

// CRLF 写回，保持与现有 baseline 风格一致
const out = JSON.stringify(b, null, 2).replace(/\n/g, '\r\n') + '\r\n'
fs.writeFileSync(baselinePath, out)

console.log(`标记 needsReview: ${marked} 条`)
console.log(`填充 wiki 英文 effect: ${filled} 条`)
console.log('--- 明细 ---')
log.forEach((l) => console.log(l))
