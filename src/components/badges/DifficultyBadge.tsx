// 稀有度徽标：按 rarity 着色（普通=低调灰蓝，稀有=高亮橙红）。
// 不再使用「完成率动态分档（极难/难/普通）」——该分档逻辑保留在 enums.getDifficultyTier，
// 仍供成就筛选器（useAchievementFilter）使用；此处仅按用户决策改为 rarity 着色。
import { RARITY_LABEL } from '../../data/enums'
import type { Lang } from '../../data/types'

/** 稀有度配色：稀有高亮橙红，普通低调灰蓝。 */
const RARITY_COLOR: Record<'普通' | '稀有', string> = {
  '普通': '#90a4ae', // 普通：低调灰蓝
  '稀有': '#ff9100', // 稀有：高亮橙红（用户偏好强调色）
}

export function DifficultyBadge({
  rarity,
  show,
  lang,
}: {
  rarity: '普通' | '稀有' | undefined
  show: boolean
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
