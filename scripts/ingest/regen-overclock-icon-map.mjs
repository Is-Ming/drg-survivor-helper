// 临时脚本：解析本地 wiki 快照 + 现有 41 张 PNG，按「效果图标」复用重算 OVERCLOCK_ICON_MAP
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'

const html = readFileSync('scripts/ingest/wiki-raw/Overclocks.html', 'utf8')
const base = JSON.parse(readFileSync('server/data/baseline.json', 'utf8'))
const ocs = base.overclocks || []

// 1) 解析 HTML：超频名 -> 效果图标名 (Survivor Icon X.png -> "X")
const rowRe = /<td class="field_Icon">([\s\S]*?)<\/td>\s*<td class="field_Name">([\s\S]*?)<\/td>/g
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ')
const htmlOC = {} // normName -> effectIcon
let m
while ((m = rowRe.exec(html))) {
  const iconBlock = m[1]
  const name = m[2].replace(/<[^>]+>/g, '').trim()
  const im = /alt="Survivor (Icon [^"]+?)\.png"/.exec(iconBlock)
  const eff = im ? im[1].replace(/^Icon /, '') : null
  if (name && eff) {
    const k = norm(name)
    if (!htmlOC[k]) htmlOC[k] = eff
  }
}

// 2) 现有 41 张 PNG：文件名(超频名) -> 效果图标 -> 收集「效果图标 -> 文件」
//    一个效果图标可能对应多张图（共享机制），只取一张即可。
const files = readdirSync('public/overclock-icons').filter((f) => f.endsWith('.png'))
const effectIconToFile = {} // effectIcon -> filename
for (const f of files) {
  const ocName = f.replace(/\.png$/, '').replace(/-/g, ' ')
  const eff = htmlOC[norm(ocName)]
  if (eff && !effectIconToFile[eff]) effectIconToFile[eff] = f
}

// 3) 为每个超频按效果图标配图
const map = {}
let covered = 0
const missing = []
for (const oc of ocs) {
  const eff = htmlOC[norm(oc.englishName)]
  if (eff && effectIconToFile[eff]) {
    map[oc.englishName] = '/overclock-icons/' + effectIconToFile[eff]
    covered++
  } else {
    missing.push({ name: oc.englishName, eff })
  }
}

const sortedKeys = Object.keys(map).sort((a, b) => a.localeCompare(b))
const body = sortedKeys.map((k) => `  "${k}": "${map[k]}"`).join(',\n')
const header = `// 超频图标：wiki.gg Survivor:Overclocks 本地快照 (scripts/ingest/wiki-raw/Overclocks.html)
// 解析每个超频行 -> 其效果图标 (Survivor_Icon_*.png)；按「效果图标」复用现有 public/overclock-icons/*.png（wiki 本就按机制复用图标）。
// 键为基线英文名。覆盖 ${covered}/${ocs.length}（其余无对应效果图标 PNG，回落文字）。`
const block = `${header}\nexport const OVERCLOCK_ICON_MAP: Record<string, string> = {\n${body}\n}`

const path = 'src/data/icon-map.ts'
let src = readFileSync(path, 'utf8')
src = src.replace(/export const OVERCLOCK_ICON_MAP: Record<string, string> = \{[\s\S]*?\n\}/, block)
writeFileSync(path, src)

console.log('distinct effect icons (HTML):', Object.keys(htmlOC).length)
console.log('files:', files.length, '| effectIconToFile distinct:', Object.keys(effectIconToFile).length)
console.log('OVERCLOCK_ICON_MAP coverage:', covered, '/', ocs.length)
console.log('missing count:', missing.length)
// 统计缺的效果图标种类
const missEff = new Set(missing.map((x) => x.eff).filter(Boolean))
console.log('distinct missing effect icons (need new PNGs):', missEff.size)
