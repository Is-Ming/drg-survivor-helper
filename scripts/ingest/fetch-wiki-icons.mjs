// fetch-wiki-icons.mjs
//
// Phase 3 — 从 wiki.gg 抓取武器/装备/超频图标，替换卡片矢量占位。
// 数据源: scripts/ingest/wiki-raw/{Weapons,Equipment,Overclocks}.html
//         （由 fetch-wiki.mjs 从 https://deeprockgalactic.wiki.gg 抓取，仅本地解析，不重新联网）
// 产出:
//   - public/weapon-icons/*.png
//   - public/equipment-icons/*.png
//   - public/overclock-icons/*.png
//   - src/data/icon-map.ts  (WEAPON_ICON_MAP / EQUIPMENT_ICON_MAP / OVERCLOCK_ICON_MAP)
//
// 图标按英文名匹配：weapon.englishName / equipment.officialName / overclock.englishName
// （装备 wiki 名带 "Artifact " 前缀，匹配时自动剥离）。
// 未匹配到 wiki 图标的实体，卡片回落到现有文字/占位，绝不杜撰。
//
// 用法:
//   node scripts/ingest/fetch-wiki-icons.mjs --analyze   仅分析覆盖率，不下载
//   node scripts/ingest/fetch-wiki-icons.mjs             抓取 + 下载 + 生成 map

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const RAW_DIR = join(__dirname, 'wiki-raw')
const BASELINE = join(ROOT, 'server', 'data', 'baseline.json')
const OUT_ROOT = join(ROOT, 'public')
const MAP_FILE = join(ROOT, 'src', 'data', 'icon-map.ts')
const WIKI_HOST = 'https://deeprockgalactic.wiki.gg'
const CONCURRENCY = 6
const ANALYZE = process.argv.includes('--analyze')

/**
 * 显式别名表：基线英文名 -> wiki 图标名（alt 中的 Survivor <Name>.png 的 <Name>）。
 * 仅在「wiki 没有与我们全名完全/子串对应」且「该映射明确无误」时加入，绝不杜撰。
 * 来源：逐一核对 wiki.gg 武器/装备页图标名（短名/别名）。
 */
const WEAPON_ALIASES = {
  'LOK-1 Smart Rifle': 'LOK1',
  'DRAK-25 Plasma Carbine': 'DRAK Carbine',
  'Lead Storm Powered Minigun': 'Leadstorm',
  'ArmsKore Coil Gun': 'Coilgun',
  'Zhukov NUK17': 'Zhukovs',
  'TH-0R Bug Taser': 'THOR Bugzapper',
  'Plasma Burster': 'Plasmaburster',
  'Krakatoa Sentinel': 'Krakatoa Turret',
  'High Explosive Grenade': 'HE Grenade',
  'K1-P Viper Drone': 'Viper Drones',
  'Chimera Fragcannon': 'Chimera Frag Cannon',
  'Experimental Plasma Charger': 'EPC',
  'LMG Gun Platform': 'LMG Turret',
  'Hi-Volt Thunderbird': 'Voltaic Stun Sweeper',
  'Voltaic Shock Fence': 'Voltaic Fence',
  'Firefly Hunter Drone': 'Fire Drone',
  'Arc-Tek Cryo Guard': 'Cryo Cannon',
  'Proximity Mines': 'Proximity Mine',
}
const EQUIPMENT_ALIASES = {
  "Diver's Manual": "Diver's Manual",
  'Clipboard of Grudges': 'Clipboard Grudges',
  SquintEE5: 'Squintee',
  'Piercing Projectiles': 'Piercing Bullets',
  'Barley Bulb Juice': 'Barley Juice',
  '5 Leaf Clover': 'Lucky Clover',
  'Huuli Bait': 'Bait Bucket',
  'Diffractor prism': 'Shard Diffractor',
  'Corrosive Thunder': 'Corrosive Thunder',
}

/** 从 wiki HTML 抽取 alt="Survivor <Name>.png" -> 相对/绝对图标 url（去重，保留首个） */
function extractIcons(html) {
  const map = {}
  const re = /alt="Survivor ([^"]+?)(?: \(cropped\))?\.png"[^>]*src="([^"]+)"/g
  let m
  while ((m = re.exec(html)) !== null) {
    const name = m[1].replace(/ \(cropped\)$/, '')
    const url = m[2]
    if (!(name in map)) map[name] = url
  }
  return map
}

/** 解析绝对图标 url（缩略图相对路径补全 host） */
function absUrl(u) {
  if (u.startsWith('http')) return u
  if (u.startsWith('//')) return 'https:' + u
  return WIKI_HOST + u
}

/**
 * 把 wiki 图标表映射到基线实体，返回 { matched: {key: url}, misses: string[] }
 * @param {Array} items 基线实体数组
 * @param {(it:any)=>string} keyFn 取英文名
 * @param {Record<string,string>} iconMap wikiName -> url
 * @param {(wikiName:string)=>string} wikiTransform 比对前对 wiki 名做变换（去前缀等）
 */
/**
 * 模糊匹配：把名称拆成小写词元（去标点），两两比较词元重合度。
 * - 完全命中（词元集合相等）或一方词元全部被另一方包含 → 视为匹配；
 * - 部分重叠时用 Jaccard 相似度，>= 阈值（0.6）才接受，避免误配。
 * 这样既能覆盖 wiki 短名⊂我们全名（lok 1 ⊂ lok 1 smart rifle），
 * 也能覆盖有共同核心词元但各带修饰（drak carbine ↔ drak 25 plasma carbine）。
 */
function tokens(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}
function fuzzyMatch(n, wikiTokensArr) {
  const a = tokens(n)
  const aSet = new Set(a)
  let best = -1
  let bestScore = 0
  for (const b of wikiTokensArr) {
    const bSet = new Set(b)
    if (aSet.size && bSet.size) {
      const inter = [...aSet].filter((x) => bSet.has(x)).length
      const union = new Set([...aSet, ...bSet]).size
      const jac = inter / union
      // 完全包含关系
      const contained = [...bSet].every((x) => aSet.has(x)) || [...aSet].every((x) => bSet.has(x))
      const score = contained ? 1 : jac
      if (score > bestScore) {
        bestScore = score
        best = wikiTokensArr.indexOf(b)
      }
    }
  }
  return bestScore >= 0.6 ? best : -1
}

function matchEntities(items, keyFn, iconMap, wikiTransform = (k) => k, { fuzzy = true } = {}) {
  const matched = {}
  const misses = []
  const wikiEntries = Object.entries(iconMap).map(([name, url]) => [wikiTransform(name), url, name])
  const wikiTok = wikiEntries.map(([t]) => tokens(t))
  for (const it of items) {
    const en = keyFn(it)
    let idx = -1
    if (fuzzy) idx = fuzzyMatch(en, wikiTok)
    if (idx !== -1) matched[en] = wikiEntries[idx][1]
    else misses.push(en)
  }
  return { matched, misses }
}

function kebab(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function downloadOne(relPath, url) {
  const fpath = join(OUT_ROOT, relPath)
  if (existsSync(fpath)) return true
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(absUrl(url), {
        headers: { 'User-Agent': 'drg-survivor-helper/ingest' },
        redirect: 'follow',
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      if (!buf.length) throw new Error('empty')
      mkdirSync(dirname(fpath), { recursive: true })
      writeFileSync(fpath, buf)
      return true
    } catch (err) {
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 300))
        continue
      }
      console.error(`  FAIL ${relPath} <- ${url}: ${err.message}`)
      return false
    }
  }
  return false
}

async function main() {
  const baseline = JSON.parse(readFileSync(BASELINE, 'utf8'))
  const W = {
    ...extractIcons(readFileSync(join(RAW_DIR, 'Weapons.html'), 'utf8')),
    // 部分武器有独立 wiki 页（如 Chimera Fragcannon），其图标名与总表一致，合并即可
    ...extractIcons(readFileSync(join(RAW_DIR, 'Chimera_Fragcannon.html'), 'utf8')),
  }
  const E = extractIcons(readFileSync(join(RAW_DIR, 'Equipment.html'), 'utf8'))
  const O = extractIcons(readFileSync(join(RAW_DIR, 'Overclocks.html'), 'utf8'))

  const wm = matchEntities(
    baseline.weapons,
    (w) => WEAPON_ALIASES[w.englishName] || w.englishName,
    W
  )
  const em = matchEntities(
    baseline.equipments,
    (e) => EQUIPMENT_ALIASES[e.officialName] || e.officialName,
    E,
    (k) => k.replace(/^artifact\s+/i, '')
  )
  const om = matchEntities(
    baseline.overclocks,
    (o) => o.englishName,
    O,
    (k) => k.replace(/^icon\s+/i, ''),
    // wiki 超频图标实为「特性图标」(Icon Damage Acid 等)，非按超频名命名；
    // 关闭模糊匹配，仅保留「英文名精确命中」(实际为 0)，避免把特性图标错配到超频卡。
    { fuzzy: false }
  )

  console.log(
    `覆盖率: 武器 ${wm.matched.size ?? Object.keys(wm.matched).length}/${baseline.weapons.length}` +
      ` | 装备 ${Object.keys(em.matched).length}/${baseline.equipments.length}` +
      ` | 超频 ${Object.keys(om.matched).length}/${baseline.overclocks.length}`
  )
  if (ANALYZE) {
    console.log('武器 miss:', wm.misses)
    console.log('装备 miss:', em.misses)
    console.log('超频 miss:', om.misses.slice(0, 20))
    return
  }

  // 下载
  const cats = [
    ['weapon', wm.matched],
    ['equipment', em.matched],
    ['overclock', om.matched],
  ]
  const finalMap = { weapon: {}, equipment: {}, overclock: {} }
  let ok = 0
  let fail = 0
  for (const [cat, matched] of cats) {
    const entries = Object.entries(matched)
    let cursor = 0
    async function worker() {
      while (cursor < entries.length) {
        const [en, url] = entries[cursor++]
        const ext = extname(new URL(absUrl(url)).pathname) || '.png'
        const fname = `${kebab(en)}${ext}`
        const rel = join(`${cat}-icons`, fname)
        const good = await downloadOne(rel, url)
        if (good) {
          ok++
          finalMap[cat][en] = `/${rel.replace(/\\/g, '/')}`
        } else fail++
      }
    }
    const pool = Array.from({ length: Math.min(CONCURRENCY, entries.length) }, () => worker())
    await Promise.all(pool)
  }
  console.log(`下载完成: ok=${ok} fail=${fail}`)

  const header =
    '// AUTO-GENERATED by scripts/ingest/fetch-wiki-icons.mjs — do not edit by hand.\n' +
    '// 图标来源 wiki.gg (Deep Rock Galactic: Survivor)。键为基线英文名/官方名。\n'
  const block = (name, obj) => {
    const lines = Object.keys(obj).map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(obj[k])},`)
    return `export const ${name}: Record<string, string> = {\n${lines.join('\n')}\n}\n`
  }
  writeFileSync(
    MAP_FILE,
    header + block('WEAPON_ICON_MAP', finalMap.weapon) + block('EQUIPMENT_ICON_MAP', finalMap.equipment) + block('OVERCLOCK_ICON_MAP', finalMap.overclock)
  )
  console.log(`Map 写出: ${MAP_FILE}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
