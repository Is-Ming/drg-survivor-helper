import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AchievementCard } from '../components/cards/AchievementCard'
import type { Achievement } from '../data/types'

function mk(over: Partial<Achievement>): Achievement {
  return {
    englishName: 'Test',
    chineseName: '测试成就',
    category: '其他动作',
    unlockCondition: 'do something',
    completionRate: 5,
    version: '当前',
    ...over,
  }
}

describe('AchievementCard', () => {
  it('空达成率不渲染疑难徽标（决策 5）', () => {
    render(<AchievementCard ach={mk({ completionRate: null })} highlight={true} lang="zh" />)
    expect(screen.queryByText(/极难|难|普通/)).toBeNull()
  })
  it('低达成率渲染极难徽标', () => {
    render(<AchievementCard ach={mk({ completionRate: 3 })} highlight={true} lang="zh" />)
    expect(screen.getByText(/极难 3%/)).toBeInTheDocument()
  })
  it('高亮关闭时不渲染徽标', () => {
    render(<AchievementCard ach={mk({ completionRate: 5 })} highlight={false} lang="zh" />)
    expect(screen.queryByText(/极难|难|普通/)).toBeNull()
  })
  it('显示分类与解锁条件', () => {
    render(<AchievementCard ach={mk({})} highlight={true} lang="zh" />)
    expect(screen.getByText('其他动作')).toBeInTheDocument()
    expect(screen.getByText('do something')).toBeInTheDocument()
  })
})
