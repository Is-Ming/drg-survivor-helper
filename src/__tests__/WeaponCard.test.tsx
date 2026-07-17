import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { WeaponCard } from '../components/cards/WeaponCard'
import { OverridesProvider } from '../hooks/useOverrides'
import type { Weapon } from '../data/types'

const weapon: Weapon = {
  englishName: 'M1000',
  chineseName: 'M1000 狙击枪',
  class: 'Scout',
  tags: ['KINETIC', 'PRECISE'],
  yellowOverclock: '黄',
  redOverclock: '红',
  rating: 'S',
  version: '当前',
}

describe('WeaponCard', () => {
  it('渲染评级徽章与主观标注（决策 7）', () => {
    render(<OverridesProvider><WeaponCard weapon={weapon} selectedTags={[]} lang="zh" /></OverridesProvider>)
    expect(screen.getByText('S')).toBeInTheDocument()
    expect(screen.getByText('主观')).toBeInTheDocument()
  })

  it('职业 chip 显示中文(英文)', () => {
    render(<OverridesProvider><WeaponCard weapon={weapon} selectedTags={[]} lang="zh" /></OverridesProvider>)
    expect(screen.getByText('侦察兵(Scout)')).toBeInTheDocument()
  })

  it('标签 chip 显示官网中文标签', () => {
    render(<OverridesProvider><WeaponCard weapon={weapon} selectedTags={[]} lang="zh" /></OverridesProvider>)
    expect(screen.getByText('动能(KINETIC)')).toBeInTheDocument()
    expect(screen.getByText('精密(PRECISE)')).toBeInTheDocument()
  })

  it('点击标签回填筛选（官网枚举）', () => {
    const onClick = vi.fn()
    render(<OverridesProvider><WeaponCard weapon={weapon} selectedTags={[]} onTagClick={onClick} lang="zh" /></OverridesProvider>)
    fireEvent.click(screen.getByText('动能(KINETIC)'))
    expect(onClick).toHaveBeenCalledWith('KINETIC')
  })

  it('已选标签高亮', () => {
    const { container } = render(<OverridesProvider><WeaponCard weapon={weapon} selectedTags={['KINETIC']} lang="zh" /></OverridesProvider>)
    expect(container.querySelector('.MuiChip-filled')).not.toBeNull()
  })

  it('点击职业 chip 弹出小职业 Popover（含起始武器，不含暂译角标）', () => {
    render(<OverridesProvider><WeaponCard weapon={weapon} selectedTags={[]} lang="zh" /></OverridesProvider>)
    fireEvent.click(screen.getByText('侦察兵(Scout)'))
    expect(screen.getByText(/经典\(Classic\)/)).toBeInTheDocument()
    expect(screen.getAllByText(/起始武器/).length).toBeGreaterThan(0)
    expect(screen.queryByText(/暂译/)).toBeNull()
  })
})
