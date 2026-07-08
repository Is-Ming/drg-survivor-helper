// 一次性脚本：解析 references 下的三个底稿 markdown，生成 src/data/*.ts
// 约定（见架构决策 5/6）：空达成率 -> null；标签逗号 -> 数组；version 原样保留。
// 用法：node scripts/parse-data.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const refDir = resolve(root, 'references')
const outDir = resolve(root, 'src', 'data')
mkdirSync(outDir, { recursive: true })

function readMd(name) {
  return readFileSync(resolve(refDir, name), 'utf8')
}

// 解析 markdown 表格行，返回 cells（已 trim），跳过表头与分隔行。
function parseTableRows(md) {
  const rows = []
  for (const raw of md.split('\n')) {
    const line = raw.trim()
    if (!line.startsWith('|')) continue
    const cells = line.split('|').slice(1, -1).map((c) => c.trim())
    if (cells.length === 0) continue
    // 分隔行：所有单元格都是 - 或 :
    if (cells.every((c) => /^:?-+:?$/.test(c))) continue
    // 表头行：首个单元格是英文字段名
    if (cells[0] === '英文名' || cells[0] === '名称') continue
    rows.push(cells)
  }
  return rows
}

function s(v) {
  return JSON.stringify(v)
}

function numOrNull(v) {
  const t = v.trim().replace('%', '').trim()
  if (t === '') return null
  const n = Number(t)
  return Number.isFinite(n) ? n : null
}

// ---------- 成就 ----------
function buildAchievements() {
  const rows = parseTableRows(readMd('data-achievements.md'))
  const items = rows.map((c) => {
    // 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记
    const [englishName, chineseName, category, unlockCondition, biomeTier, completionRate, version] = c
    const obj = {
      englishName,
      chineseName,
      category,
      unlockCondition,
      completionRate: numOrNull(completionRate),
      version,
    }
    if (biomeTier && biomeTier.trim() !== '') obj.biomeTier = biomeTier.trim()
    return obj
  })
  return emit('achievements', 'Achievement', items, rows.length)
}

// ---------- 武器 ----------
function buildWeapons() {
  const rows = parseTableRows(readMd('data-weapons.md'))
  const seen = new Set()
  const items = []
  for (const c of rows) {
    // 英文名 | 中文名 | 职业 | 标签 | 黄色超频(6/12级) | 红色超频(18级) | 强度评级 | 版本标记
    const [englishName, chineseName, cls, tags, yellowOverclock, redOverclock, rating, version] = c
    // 跨职业武器去重：保留首条（含完整超频数据的那条），最终 42 把。
    if (seen.has(englishName)) continue
    seen.add(englishName)
    items.push({
      englishName,
      chineseName,
      class: cls,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      yellowOverclock,
      redOverclock,
      rating,
      version,
    })
  }
  return emit('weapons', 'Weapon', items, items.length, rows.length)
}

// ---------- 装备 ----------
function buildEquipments() {
  const rows = parseTableRows(readMd('data-equipment.md'))
  const items = rows.map((c) => {
    // 名称 | 类型 | 效果 | 来源 | 关联成就 | 版本标记
    const [name, type, effect, source, relatedAchievement, version] = c
    const obj = { name, type, effect, source, version }
    if (relatedAchievement && relatedAchievement.trim() !== '') obj.relatedAchievement = relatedAchievement.trim()
    return obj
  })
  return emit('equipments', 'Equipment', items, rows.length)
}

function emit(varName, typeName, items, count, rawCount) {
  const body = items
    .map((o) => {
      const parts = Object.entries(o).map(([k, v]) => {
        if (typeof v === 'string') return `    ${k}: ${s(v)}`
        if (v === null) return `    ${k}: null`
        if (Array.isArray(v)) return `    ${k}: ${JSON.stringify(v)}`
        return `    ${k}: ${v}`
      })
      return '  {\n' + parts.join(',\n') + ',\n  }'
    })
    .join(',\n')
  const ts = `import type { ${typeName} } from './types'\n\n// 自动生成自 references 底稿，请勿手工编辑。共 ${count} 条。\nexport const ${varName}: ${typeName}[] = [\n${body}\n]\n`
  const file = resolve(outDir, `${varName}.ts`)
  writeFileSync(file, ts, 'utf8')
  return { file, count, rawCount }
}

const a = buildAchievements()
const w = buildWeapons()
const e = buildEquipments()
console.log(`achievements: ${a.count} 条 (raw table rows 全部计入)`)
console.log(`weapons: ${w.count} 条 (去重后；原始表格行 ${w.rawCount})`)
console.log(`equipments: ${e.count} 条`)
console.log('数据文件已生成至', outDir)
