// 强度评级徽章测试（验收点 6：评级主观声明）
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RatingBadge } from '../components/badges/RatingBadge'
import type { Rating } from '../data/types'

const RATINGS: Rating[] = ['S', 'A', 'B', 'C']

describe('RatingBadge（验收点 6）', () => {
  it('渲染全部评级 S / A / B / C', () => {
    for (const r of RATINGS) {
      const { unmount } = render(<RatingBadge rating={r} lang="zh" />)
      expect(screen.getByText(r)).toBeInTheDocument()
      unmount()
    }
  })

  it('中文下固定标注 "主观"', () => {
    render(<RatingBadge rating="S" lang="zh" />)
    expect(screen.getByText('主观')).toBeInTheDocument()
  })

  it('英文下标注 "subj."', () => {
    render(<RatingBadge rating="A" lang="en" />)
    expect(screen.getByText('subj.')).toBeInTheDocument()
  })

  it('"-" 占位渲染为 "未评级"(zh) / "NR"(en) 且带主观标注', () => {
    const { rerender } = render(<RatingBadge rating="-" lang="zh" />)
    expect(screen.getByText('未评级')).toBeInTheDocument()
    expect(screen.getByText('主观')).toBeInTheDocument()
    rerender(<RatingBadge rating="-" lang="en" />)
    expect(screen.getByText('NR')).toBeInTheDocument()
    expect(screen.getByText('subj.')).toBeInTheDocument()
  })
})
