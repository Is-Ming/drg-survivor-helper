// 疑难分档徽标：极难<5% / 难5–20% / 普通>20%（用户决策 Round 2）
// 硬约定（决策 5）：rate 为 null 或 show=false 时，不渲染任何徽标、不高亮、不回退 0%。
import { getDifficultyTier, DIFFICULTY_LABEL } from '../../data/enums'
import type { Lang } from '../../data/types'

const TIER_COLOR: Record<'extreme' | 'hard' | 'moderate', string> = {
  extreme: '#ff1744', // 极难：最强视觉权重（红）
  hard: '#ff9100', // 难：橙
  moderate: '#90a4ae', // 较难：灰蓝
}

export function DifficultyBadge({
  rate,
  show,
  lang,
}: {
  rate: number | null
  show: boolean
  lang: Lang
}) {
  if (!show) return null
  const tier = getDifficultyTier(rate)
  if (!tier) return null // 空达成率或 ≥50%：不渲染
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 999,
        background: TIER_COLOR[tier],
        color: '#fff',
        fontWeight: 700,
        fontSize: 12,
        lineHeight: 1.4,
        boxShadow: tier === 'extreme' ? '0 0 0 2px rgba(255,23,68,0.35)' : 'none',
      }}
    >
      {tier === 'extreme' ? '★ ' : ''}
      {DIFFICULTY_LABEL[tier][lang]} {rate}%
    </span>
  )
}
