// 稀有度徽标：按 rarity 着色（普通=低调灰蓝，稀有=高亮橙红），常显（无开关）。
// 着色常量统一来自 enums.RARITY_COLOR（单一来源）。
import { RARITY_COLOR, RARITY_LABEL } from '../../data/enums'
import type { Lang } from '../../data/types'

export function DifficultyBadge({
  rarity,
  show = true,
  lang,
}: {
  rarity: '普通' | '稀有' | undefined
  /** 是否渲染徽标；默认 true（常显，移除「⚠ 疑难高亮」开关后无需外部控制） */
  show?: boolean
  lang: Lang
}) {
  // 未开启高亮、或成就无稀有度（理论不应发生）→ 不渲染徽标
  if (!show || !rarity) return null
  const isRare = rarity === '稀有'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 999,
        background: RARITY_COLOR[rarity],
        color: '#fff',
        fontWeight: 700,
        fontSize: 12,
        lineHeight: 1.4,
        boxShadow: isRare ? '0 0 0 2px rgba(255,145,0,0.35)' : 'none',
      }}
    >
      {isRare ? '★ ' : ''}
      {RARITY_LABEL[rarity][lang]}
    </span>
  )
}
