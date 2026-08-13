// 装备效果中文补全匹配管线
// 输入：drg_zh_en_pair.json（官方简中包，Artifacts 表含 名条目 + 紧邻效果条目，效果带占位符）
//       server/data/baseline.json（equipments[].officialName + officialEffect 英文权威）
// 输出：scripts/ingest/equipment-effect-report.json（每条建议中文效果 + 是否需人工核对）
// 不写基线，仅产出待审报告（遵循"模糊绝不自动发布"）。
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.cwd())
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'drg_zh_en_pair.json'), 'utf8'))
const base = JSON.parse(fs.readFileSync(path.join(root, 'server/data/baseline.json'), 'utf8'))

const norm = (s) => String(s || '').toLowerCase().replace(/[\s_\-]+/g, '').replace(/[^a-z0-9]/g, '')

// 装备相关表：Artifacts（主）+ Gear + Milestones（部分装备在这两个表）
const TABLES = ['Artifacts_zh-CN', 'Gear_zh-CN', 'Milestones_BiomeGoals_zh-CN']
const arts = pkg.entries.filter((e) => e.table && TABLES.includes(e.table))
// 名条目：短 en（<30）视为名字；其余长条目视为效果
const nameIdx = new Map()
arts.forEach((e, i) => {
  if ((e.en || '').length < 30) nameIdx.set(norm(e.en), i)
})
const isEffectish = (e) => (e.en || '').length >= 20

// {stats} 统计块：官方包无中文，用英文 officialEffect 由人工核定中文兜底（标"非官方译"）
// 仅收录确有官方英文原文可译的条目；无来源（待核/空）的不在此列，留待核。
const STATS_FALLBACK = {
  'Red Sugar Cube': '最大生命值 +3',
  'Turbo Encabulator': '+3% 伤害、+3% 装填速度、-5% 挖速',
  'Energy Bars': '+1% 伤害、-3 最大生命值',
  'Pickled Nitra': '+2% 伤害、-0.5% 移动速度',
}

// 占位符 → 从英文 officialEffect / 包 en 提取具体值的函数表
function resolvePlaceholders(zh, enPkg, enWiki, officialName) {
  let out = zh
  const phs = [...new Set((zh.match(/\{[^}]+\}/g) || []))]
  const missing = []
  let fallback = false
  const hasSource = enWiki && !/待核|^\s*—\s*$/.test(enWiki)
  for (const ph of phs) {
    let val = null
    const hay = [enWiki, enPkg].filter(Boolean).join(' | ')
    if (ph === '{stats}') {
      // 仅当有官方英文来源且已核定中文兜底时才填，否则留占位符待核
      if (hasSource && STATS_FALLBACK[officialName]) {
        val = STATS_FALLBACK[officialName]
        fallback = true
      } else {
        missing.push(ph)
        continue
      }
    } else {
      switch (ph) {
      case '{cooldown}': {
        const m = hay.match(/(\d+(?:\.\d+)?)\s*(?:sec|seconds?)/i)
        if (m) val = m[1]
        break
      }
      case '{target}': {
        const m = hay.match(/(?:weapon\s+)?level\s+(\d+)/i) || hay.match(/level\s*\{?target\}?\s*(\d+)/i)
        if (m) val = m[1]
        break
      }
      case '{hpCount}': {
        const m = hay.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of\s+missing\s+hp|missing)/i)
        if (m) val = m[1]
        break
      }
      case '{levels_to_gain_number}': {
        const m = hay.match(/gain\s+(\d+)\s+levels?/i)
        if (m) val = m[1]
        break
      }
      case '{maxStacks}':
      case '{maxstacks_number}':
      case '{maxbuffstack_number}':
      case '{maxbuffstacks_number}': {
        const m = hay.match(/max(?:imum)?\s+(\d+)\s+stacks?/i)
        if (m) val = m[1]
        break
      }
      case '{currencyCount}': {
        const m = hay.match(/every\s+(\d+)\s*(?:gold|nitra)/i)
        if (m) val = m[1]
        break
      }
      case '{stats}': {
        // 统计块无法直接解析，标记待人工
        val = null
        break
      }
      default:
        val = null
      }
    }
    if (val != null) out = out.replace(new RegExp(ph.replace(/[{}]/g, '\\$&'), 'g'), val)
    else missing.push(ph)
  }
  return { text: out, missing, fallback }
}

function fuzzyFind(eq) {
  const oeff = norm(eq.officialEffect || '')
  const oname = norm(eq.officialName || '')
  let best = null
  let bestScore = 0
  for (const e of arts) {
    if (!isEffectish(e)) continue
    const en = norm(e.en)
    let score = 0
    if (oeff && en && (oeff.includes(en) || en.includes(oeff))) score = 100
    else {
      const toks = en.split(/[^a-z0-9]+/).filter((t) => t.length >= 4)
      for (const t of toks) if (oeff.includes(t) || oname.includes(t)) score += 1
    }
    if (score > bestScore) {
      bestScore = score
      best = e
    }
  }
  return bestScore >= 2 ? best : null
}

const report = []
let paired = 0
let resolved = 0
let statsFlag = 0
let unmatched = 0

for (const eq of base.equipments) {
  let effEntry = null
  let method = ''
  const i = nameIdx.get(norm(eq.officialName))
  if (i !== undefined && isEffectish(arts[i + 1])) {
    effEntry = arts[i + 1]
    method = 'name+adjacent'
  } else {
    const f = fuzzyFind(eq)
    if (f) {
      effEntry = f
      method = 'fuzzy'
    }
  }

  if (!effEntry) {
    unmatched++
    report.push({
      name: eq.name,
      officialName: eq.officialName,
      matched: false,
      method: '',
      zhEffect: null,
      needsReview: true,
      note: '未配对：官方包无对应效果条目',
    })
    continue
  }

  paired++
  const { text, missing, fallback } = resolvePlaceholders(effEntry.zh_cn, effEntry.en, eq.officialEffect, eq.officialName)
  const hasStats = missing.includes('{stats}')
  if (missing.length === 0) resolved++
  if (hasStats) statsFlag++
  report.push({
    name: eq.name,
    officialName: eq.officialName,
    matched: true,
    method,
    zhEffect: text,
    needsReview: missing.length > 0,
    fallback,
    unresolvedPlaceholders: missing,
    note: fallback ? 'stats 机翻兜底(非官方译)' : hasStats ? '含 {stats} 统计块待人工核对' : missing.length ? '占位符未解析' : '已解析',
  })
}

const out = {
  summary: {
    total: base.equipments.length,
    paired,
    resolvedFully: resolved,
    withStatsFlag: statsFlag,
    unmatched,
  },
  items: report,
}
fs.writeFileSync(
  path.join(root, 'scripts/ingest/equipment-effect-report.json'),
  JSON.stringify(out, null, 2) + '\n'
)
console.log('装备总数:', out.summary.total)
console.log('配对成功:', out.summary.paired)
console.log('完全解析(无占位符残留):', out.summary.resolvedFully)
console.log('含 {stats} 待人工:', out.summary.withStatsFlag)
console.log('未配对:', out.summary.unmatched)
console.log('报告已写 scripts/ingest/equipment-effect-report.json')
console.log('\n--- 已解析示例(前5) ---')
report.filter((r) => r.matched && !r.needsReview).slice(0, 5).forEach((r) => console.log(`[${r.name}] ${r.zhEffect}`))
console.log('\n--- 含 {stats} 示例(前5) ---')
report.filter((r) => r.unresolvedPlaceholders?.includes('{stats}')).slice(0, 5).forEach((r) => console.log(`[${r.name}] ${r.zhEffect}`))
console.log('\n--- 未配对(全部) ---')
report.filter((r) => !r.matched).forEach((r) => console.log(`[${r.name}] ${r.officialName}`))
