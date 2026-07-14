import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AchievementCard } from '../components/cards/AchievementCard'
import { OverridesProvider } from '../hooks/useOverrides'
import type { Achievement } from '../data/types'

function mk(over: Partial<Achievement>): Achievement {
  return {
    englishName: 'Test',
    chineseName: '测试成就',
    category: '其他动作',
    unlockCondition: 'do something',
    completionRate: 5,
    rarity: '普通',
    version: '当前',
    ...over,
  }
}

// AchievementCard 内部使用 useOverrides，须在 OverridesProvider 内渲染
function renderCard(ach: Achievement, highlight: boolean, lang: 'zh' | 'en' = 'zh') {
  return render(
    <OverridesProvider>
      <AchievementCard ach={ach} highlight={highlight} lang={lang} />
    </OverridesProvider>,
  )
}

describe('AchievementCard', () => {
  it('无 rarity 不渲染徽标', () => {
    const noRarity = { ...mk({}), rarity: undefined } as unknown as Achievement
    renderCard(noRarity, true)
    expect(screen.queryByText(/普通|稀有/)).toBeNull()
  })
  it('稀有渲染高亮徽标', () => {
    renderCard(mk({ rarity: '稀有' }), true)
    expect(screen.getByText(/稀有/)).toBeInTheDocument()
  })
  it('高亮关闭时不渲染徽标', () => {
    renderCard(mk({ rarity: '稀有' }), false)
    expect(screen.queryByText(/普通|稀有/)).toBeNull()
  })
  it('显示分类与解锁条件', () => {
    renderCard(mk({}), true)
    expect(screen.getByText('其他动作')).toBeInTheDocument()
    expect(screen.getByText('do something')).toBeInTheDocument()
  })
})
