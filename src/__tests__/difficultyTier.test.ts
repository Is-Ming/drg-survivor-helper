// 疑难分档单元测试（R2，用户决策 Round 2）
// 分档：极难 <5% / 难 5–20% / 普通 >20%；空达成率返回 null（决策 5）
import { describe, it, expect } from 'vitest'
import { getDifficultyTier } from '../data/enums'

describe('getDifficultyTier 分档（R2）', () => {
  it('null 不高亮（决策 5）', () => {
    expect(getDifficultyTier(null)).toBeNull()
  })

  it('<5% 归为 极难', () => {
    expect(getDifficultyTier(0)).toBe('extreme')
    expect(getDifficultyTier(4)).toBe('extreme')
  })

  it('边界 5% 归为 难', () => {
    expect(getDifficultyTier(5)).toBe('hard')
  })

  it('5–20% 归为 难', () => {
    expect(getDifficultyTier(5)).toBe('hard')
    expect(getDifficultyTier(10)).toBe('hard')
    expect(getDifficultyTier(20)).toBe('hard')
  })

  it('>20% 一律归为 普通（含 50%–100%）', () => {
    expect(getDifficultyTier(21)).toBe('moderate')
    expect(getDifficultyTier(40)).toBe('moderate')
    expect(getDifficultyTier(60)).toBe('moderate')
    expect(getDifficultyTier(100)).toBe('moderate')
  })
})
