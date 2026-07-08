// 强度评级徽章：S金 / A绿 / B蓝 / C灰 / -未评级，旁标“主观”（决策 7）
import type { Lang, Rating } from '../../data/types'

const RATING_COLOR: Record<Rating, string> = {
  S: '#FFD700',
  A: '#43a047',
  B: '#1e88e5',
  C: '#9e9e9e',
  '-': '#757575',
}

export function RatingBadge({ rating, lang }: { rating: Rating; lang: Lang }) {
  const isGold = rating === 'S'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 28,
          height: 28,
          padding: '0 8px',
          borderRadius: 8,
          background: RATING_COLOR[rating],
          color: isGold ? '#1a1a1a' : '#fff',
          fontWeight: 800,
          fontSize: 15,
        }}
      >
        {rating}
      </span>
      <span style={{ fontSize: 11, opacity: 0.7 }}>
        {lang === 'zh' ? '主观' : 'subj.'}
      </span>
    </span>
  )
}
