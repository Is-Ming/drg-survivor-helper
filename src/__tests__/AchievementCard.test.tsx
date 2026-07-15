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
function renderCard(ach: Achievement, lang: 'zh' | 'en' = 'zh') {
  return render(
    <OverridesProvider>
      <AchievementCard ach={ach} lang={lang} />
    </OverridesProvider>,
  )
}

describe('AchievementCard', () => {
  it('无 rarity 不渲染徽标', () => {
    const noRarity = { ...mk({}), rarity: undefined } as unknown as Achievement
    renderCard(noRarity)
    expect(screen.queryByText(/普通|稀有/)).toBeNull()
  })
  it('稀有渲染高亮徽标（常显，无 highlight 开关）', () => {
    renderCard(mk({ rarity: '稀有' }))
    expect(screen.getByText(/稀有/)).toBeInTheDocument()
  })
  it('普通渲染徽标（常显）', () => {
    renderCard(mk({ rarity: '普通' }))
    expect(screen.getByText(/普通/)).toBeInTheDocument()
  })
  it('显示分类与解锁条件', () => {
    renderCard(mk({}))
    expect(screen.getByText('其他动作')).toBeInTheDocument()
    expect(screen.getByText('do something')).toBeInTheDocument()
  })

  // ---- 图标：本地映射渲染 / 兜底 ----
  it('图标：本地路径渲染（/achievement-icons/）', () => {
    renderCard(mk({ englishName: 'Run for the hills' }))
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', expect.stringContaining('/achievement-icons/'))
  })
  it('图标：映射缺失时兜底灰色圆 + 首字（无 img）', () => {
    renderCard(mk({ englishName: 'No-Such-Achievement-Name' }))
    expect(screen.queryByRole('img')).toBeNull()
    // 首字：中文名「测试成就」首字「测」
    expect(screen.getByLabelText('achievement-icon-fallback')).toHaveTextContent('测')
  })

  // ---- 完成率：位数保留 + 进度条 ----
  it('完成率整数保留位数（27%，不补 .0）并渲染进度条', () => {
    renderCard(mk({ completionRate: 27 }))
    expect(screen.getByText(/完成率 27%/)).toBeInTheDocument()
    expect(screen.queryByText(/完成率 27\.0%/)).toBeNull()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
  it('完成率小数原样保留（86.7%）', () => {
    renderCard(mk({ completionRate: 86.7 }))
    expect(screen.getByText(/完成率 86\.7%/)).toBeInTheDocument()
  })
  it('完成率 null 显示暂无数据且不画进度条', () => {
    renderCard(mk({ completionRate: null }))
    expect(screen.getByText('完成率 暂无数据')).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).toBeNull()
  })
})
