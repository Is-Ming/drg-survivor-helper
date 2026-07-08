import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DifficultyBadge } from '../components/badges/DifficultyBadge'

describe('DifficultyBadge', () => {
  it('空达成率不渲染（决策 5：不高亮、不回退 0%）', () => {
    const { container } = render(<DifficultyBadge rate={null} show={true} lang="zh" />)
    expect(container).toBeEmptyDOMElement()
  })
  it('show=false 时不渲染', () => {
    const { container } = render(<DifficultyBadge rate={5} show={false} lang="zh" />)
    expect(container).toBeEmptyDOMElement()
  })
  it('极难 <5% 最强视觉权重', () => {
    render(<DifficultyBadge rate={4} show={true} lang="zh" />)
    expect(screen.getByText(/极难 4%/)).toBeInTheDocument()
  })
  it('难 5–20%', () => {
    render(<DifficultyBadge rate={10} show={true} lang="zh" />)
    expect(screen.getByText(/难 10%/)).toBeInTheDocument()
  })
  it('普通 >20%', () => {
    render(<DifficultyBadge rate={40} show={true} lang="zh" />)
    expect(screen.getByText(/普通 40%/)).toBeInTheDocument()
  })
  it('≥20% 渲染 普通（不再隐藏）', () => {
    render(<DifficultyBadge rate={60} show={true} lang="zh" />)
    expect(screen.getByText(/普通 60%/)).toBeInTheDocument()
  })
  it('英文文案', () => {
    render(<DifficultyBadge rate={4} show={true} lang="en" />)
    expect(screen.getByText(/Extreme 4%/)).toBeInTheDocument()
  })
})
