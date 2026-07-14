// 生成 server/data/baseline.json 与 public/baseline.json
//   1) 从浏览器缓存.txt 读取用户的全部 localStorage 覆盖
//   2) 用 esbuild 打包 src/data/*.ts 拿到原始数组
//   3) 把缓存修改【烘焙进 baseline 默认值】（用户修改不再是 overrides，而是 baseline 本身）：
//        - drg-wpn-names          → weapons[].chineseName
//        - drg-ach-edit-*         → achievements[].chineseName / unlockCondition / category（按 englishName 覆盖）
//        - drg-eqp-edit-*         → equipments[].name / type（按 name 覆盖）
//        - drg-overclock-names    → overclocks[].chineseName（按 id 覆盖）
//        - drg-tag-edits          → tags.weaponTags
//        - drg-wpn-cardtags-*     → cardTags[weaponEnglishName]（按 englishName 覆盖，缺省回落武器默认 tags）
//   4) 把 achievements 中硬编码武器名改写为 weaponRef + {weapon} 模板（保留一致性）
//   5) 写出两份 baseline.json；overrides.json 保持/初始化为 {}
import { build } from 'esbuild'
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const ROOT = process.cwd()
const CACHE_FILE = 'F:/workbuddy工作空间/浏览器缓存.txt'
const TMP = path.join(ROOT, 'scripts', '.gentmp')
const SERVER_DATA = path.join(ROOT, 'server', 'data')
const PUBLIC_DIR = path.join(ROOT, 'public')

const WEAPON_TAGS = [
  'KINETIC', 'FIRE', 'ELECTRIC', 'COLD', 'ACID', 'PLASMA',
  'LIGHT', 'MEDIUM', 'HEAVY', 'THROWABLE', 'CONSTRUCT',
  'PROJECTILE', 'EXPLOSIVE', 'DRONE', 'TURRET', 'GROUNDZONE',
  'PRECISE', 'SPRAY', 'AREA', 'BEAM', 'LASTING',
]

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_')

async function loadTsData(file, exportName) {
  const outfile = path.join(TMP, file.replace(/\.ts$/, '.mjs'))
  await build({
    entryPoints: [path.join(ROOT, 'src', 'data', file)],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile,
    logLevel: 'silent',
  })
  const mod = await import(pathToFileURL(outfile).href + '?t=' + Date.now())
  return mod[exportName]
}

/**
 * 解析浏览器缓存文件，按键前缀分类收集用户的全部修改。
 * 文件每行格式：`key<TAB>json`。忽略 drg-helper-admin-token / drg-helper-preferences（密钥/偏好，不烘焙）。
 */
function parseCache() {
  const raw = readFileSync(CACHE_FILE, 'utf8')
  const out = {
    wpnNames: {}, // englishName -> chineseName
    achEdits: {}, // achievement englishName -> { chineseName?, unlockCondition?, category?, categories? }
    eqpEdits: {}, // equipment name -> { name?, type? }
    overclockNames: {}, // overclock id -> chineseName
    tagEdits: null, // { weaponTags?: string[] }
    cardTags: {}, // weapon englishName -> string[]
  }
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim()
    if (!t) continue
    // 值可能是对象 {...}（多数）或数组 [...]（drg-wpn-cardtags-* 的标签数组）
    let jsonStart = t.indexOf('{')
    let jsonEnd = t.lastIndexOf('}')
    if (jsonStart < 0) {
      jsonStart = t.indexOf('[')
      jsonEnd = t.lastIndexOf(']')
    }
    if (jsonStart < 0 || jsonEnd < 0 || jsonEnd < jsonStart) continue
    const key = t.slice(0, jsonStart).replace(/\t+$/, '')
    let val
    try {
      val = JSON.parse(t.slice(jsonStart, jsonEnd + 1))
    } catch {
      continue
    }
    if (key.startsWith('drg-ach-edit-')) {
      out.achEdits[key.slice('drg-ach-edit-'.length)] = val
    } else if (key.startsWith('drg-eqp-edit-')) {
      out.eqpEdits[key.slice('drg-eqp-edit-'.length)] = val
    } else if (key.startsWith('drg-wpn-cardtags-')) {
      out.cardTags[key.slice('drg-wpn-cardtags-'.length)] = val
    } else if (key === 'drg-wpn-names') {
      out.wpnNames = val
    } else if (key === 'drg-tag-edits') {
      out.tagEdits = val
    } else if (key === 'drg-overclock-names') {
      out.overclockNames = val
    }
    // 忽略：drg-helper-admin-token（密钥）、drg-helper-preferences（偏好）
  }
  return out
}

// 将字段中的武器名替换为 {weapon}，并标注 weaponRef。
// 模板仅支持单个 weaponRef：首个命中的武器模板化；其余武器名替换为烘焙后的正确中文名（字面量）。
function refField(field, key, weapons, wpnNames, slugMap) {
  if (typeof field !== 'string') return field
  let result = field
  let weaponRef = null
  let firstDone = false
  for (const w of weapons) {
    const baked = wpnNames[w.englishName] || w.chineseName
    const cands = [
      ...new Set([w.chineseName, w.englishName, baked].filter(Boolean)),
    ].sort((a, b) => b.length - a.length)
    for (const cand of cands) {
      if (result.includes(cand)) {
        if (!firstDone) {
          result = result.split(cand).join('{weapon}')
          weaponRef = slugMap[w.englishName]
          firstDone = true
        } else {
          result = result.split(cand).join(baked)
        }
        break
      }
    }
  }
  if (!weaponRef) return field
  return { weaponRef, [key]: result }
}

async function main() {
  mkdirSync(TMP, { recursive: true })
  mkdirSync(SERVER_DATA, { recursive: true })
  mkdirSync(PUBLIC_DIR, { recursive: true })

  const tsWeapons = await loadTsData('weapons.ts', 'weapons')
  const tsAchievements = await loadTsData('achievements.ts', 'achievements')
  const tsEquipments = await loadTsData('equipments.ts', 'equipments')
  const tsOverclocks = await loadTsData('overclocks.ts', 'overclocks')

  const cache = parseCache()
  const wpnNames = cache.wpnNames

  // englishName -> slug
  const slugMap = {}
  for (const w of tsWeapons) slugMap[w.englishName] = slug(w.englishName)

  // 1) 烘焙正确武器中文名（用户缓存优先）
  let wpnUpdated = 0
  const outWeapons = tsWeapons.map((w) => {
    const cn = wpnNames[w.englishName]
    if (cn && cn !== w.chineseName) {
      wpnUpdated++
      return { ...w, chineseName: cn }
    }
    return w
  })

  // 2) achievements：先模板化武器名，再用用户的 drg-ach-edit-* 覆盖 name/category/unlockCondition
  let achUpdated = 0
  const outAchievements = tsAchievements.map((a) => {
    const item = {
      ...a,
      chineseName: refField(a.chineseName, 'name', tsWeapons, wpnNames, slugMap),
      unlockCondition: refField(a.unlockCondition, 'unlockCondition', tsWeapons, wpnNames, slugMap),
    }
    const ov = cache.achEdits[a.englishName]
    if (ov) {
      if (typeof ov.chineseName === 'string') {
        item.chineseName = ov.chineseName
        achUpdated++
      }
      if (typeof ov.unlockCondition === 'string') {
        item.unlockCondition = ov.unlockCondition
        achUpdated++
      }
      if (typeof ov.category === 'string' && ov.category) {
        item.category = ov.category
        achUpdated++
      }
      if (Array.isArray(ov.categories) && ov.categories.length > 0 && ov.categories[0]) {
        item.category = ov.categories[0]
        achUpdated++
      }
    }
    return item
  })

  // 3) equipments：用 drg-eqp-edit-* 覆盖 name / type（按 name 主键）
  let eqpUpdated = 0
  const outEquipments = tsEquipments.map((e) => {
    const ov = cache.eqpEdits[e.name]
    if (!ov) return e
    const item = { ...e }
    if (typeof ov.name === 'string' && ov.name) {
      item.name = ov.name
      eqpUpdated++
    }
    if (typeof ov.type === 'string' && ov.type) {
      item.type = ov.type
      eqpUpdated++
    }
    return item
  })

  // 4) overclocks：用 drg-overclock-names 覆盖 chineseName（按 id 主键）
  let ocUpdated = 0
  const outOverclocks = tsOverclocks.map((o) => {
    const cn = cache.overclockNames[o.id]
    if (cn && cn !== o.chineseName) {
      ocUpdated++
      return { ...o, chineseName: cn }
    }
    return o
  })

  // 5) tags.weaponTags：优先用用户 drg-tag-edits，缺省回落内置枚举
  const weaponTags =
    cache.tagEdits && Array.isArray(cache.tagEdits.weaponTags) && cache.tagEdits.weaponTags.length > 0
      ? cache.tagEdits.weaponTags
      : WEAPON_TAGS

  // 6) cardTags：默认取武器自身 tags；用户 drg-wpn-cardtags-* 覆盖优先
  let cardUpdated = 0
  const cardTags = {}
  for (const w of outWeapons) {
    const custom = cache.cardTags[w.englishName]
    if (Array.isArray(custom) && custom.length > 0) {
      cardTags[w.englishName] = custom
      cardUpdated++
    } else {
      cardTags[w.englishName] = w.tags
    }
  }

  const baseline = {
    weapons: outWeapons,
    achievements: outAchievements,
    equipments: outEquipments,
    overclocks: outOverclocks,
    tags: { weaponTags },
    cardTags,
  }

  const json = JSON.stringify(baseline, null, 2)
  writeFileSync(path.join(SERVER_DATA, 'baseline.json'), json + '\n')
  writeFileSync(path.join(PUBLIC_DIR, 'baseline.json'), json + '\n')

  // 初始 / 固化后的 overrides 始终为空对象（用户修改已全部烘焙进 baseline）
  const ovPath = path.join(SERVER_DATA, 'overrides.json')
  if (!existsSync(ovPath)) writeFileSync(ovPath, '{}\n')
  else {
    const cur = JSON.parse(readFileSync(ovPath, 'utf8'))
    if (Object.keys(cur).length !== 0) writeFileSync(ovPath, '{}\n')
  }

  // 清理残留的 baseline-vN.json（本脚本只生成当前 baseline）
  const fs = await import('node:fs')
  for (const f of fs.readdirSync(SERVER_DATA)) {
    if (/^baseline-v\d+\.json$/.test(f)) {
      fs.rmSync(path.join(SERVER_DATA, f), { force: true })
    }
  }

  // 统计
  const refCount = (json.match(/\{weapon\}/g) || []).length
  console.log(`weapons: ${outWeapons.length} (中文名更新 ${wpnUpdated})`)
  console.log(`achievements: ${outAchievements.length} (缓存编辑应用 ${achUpdated})`)
  console.log(`equipments: ${outEquipments.length} (缓存编辑应用 ${eqpUpdated})`)
  console.log(`overclocks: ${outOverclocks.length} (缓存编辑应用 ${ocUpdated})`)
  console.log(`weaponTags: ${weaponTags.length} | cardTags 覆盖 ${cardUpdated}/${outWeapons.length}`)
  console.log(`weaponRef 模板占位符 {weapon} 出现次数: ${refCount}`)
  console.log(`已写出: server/data/baseline.json 与 public/baseline.json；overrides.json 保持 {}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
