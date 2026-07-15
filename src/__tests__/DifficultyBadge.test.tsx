import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DifficultyBadge } from '../components/badges/DifficultyBadge'

describe('DifficultyBadge (rarity)', () => {
  it('show=false 时不渲染', () => {
    const { container } = render(<DifficultyBadge rarity="稀有" show={false} lang="zh" />)
    expect(container).toBeEmptyDOMElement()
  })
  it('show 默认 true（常显，移除疑难高亮开关后无需外部控制）', () => {
    render(<DifficultyBadge rarity="稀有" lang="zh" />)
    expect(screen.getByText(/稀有/)).toBeInTheDocument()
  })
  it('rarity 为空不渲染', () => {
    const { container } = render(<DifficultyBadge rarity={undefined} show={true} lang="zh" />)
    expect(container).toBeEmptyDOMElement()
  })
  it('普通：低调着色 + 文案', () => {
    render(<DifficultyBadge rarity="普通" show={true} lang="zh" />)
    expect(screen.getByText(/普通/)).toBeInTheDocument()
  })
  it('稀有：高亮着色 + 文案', () => {
    render(<DifficultyBadge rarity="稀有" show={true} lang="zh" />)
    expect(screen.getByText(/稀有/)).toBeInTheDocument()
  })
  it('英文文案', () => {
    render(<DifficultyBadge rarity="稀有" show={true} lang="en" />)
    expect(screen.getByText(/Rare/)).toBeInTheDocument()
  })
})
