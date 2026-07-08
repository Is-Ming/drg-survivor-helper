import { describe, it, expect } from 'vitest'
import { matchesQuery, filterAchievements } from '../hooks/useAchievementFilter'
import { filterWeapons } from '../hooks/useWeaponFilter'
import { filterEquipments } from '../hooks/useEquipmentFilter'
import { achievements } from '../data/achievements'
import { weapons } from '../data/weapons'
import { equipments } from '../data/equipments'
import type { SearchState } from '../data/types'

function baseState(over: Partial<SearchState> = {}): SearchState {
  return {
    query: '',
    activeModule: 'achievements',
    achievement: { onlyDifficult: true },
    weapon: { tags: [] },
    equipment: {},
    ...over,
  }
}

describe('matchesQuery', () => {
  it('空查询匹配所有', () => {
    expect(matchesQuery('anything', '')).toBe(true)
  })
  it('大小写不敏感子串', () => {
    expect(matchesQuery('Collect 2000 Nitra', 'nitra')).toBe(true)
  })
  it('多 token 为 AND 关系', () => {
    expect(matchesQuery('Cryo Grenade', 'cryo grenade')).toBe(true)
    expect(matchesQuery('Cryo Grenade', 'cryo foo')).toBe(false)
  })
})

describe('filterAchievements', () => {
  it('无过滤返回全部 300 条', () => {
    expect(filterAchievements(achievements, baseState()).length).toBe(300)
  })
  it('分类筛选', () => {
    const r = filterAchievements(
      achievements,
      baseState({ achievement: { onlyDifficult: true, category: '生物群系' } }),
    )
    expect(r.length).toBe(15)
    expect(r.every((a) => a.category === '生物群系')).toBe(true)
  })
  it('query 跨字段模糊匹配', () => {
    const r = filterAchievements(achievements, baseState({ query: 'Nitra' }))
    expect(r.length).toBeGreaterThan(0)
    expect(
      r.every((a) =>
        `${a.englishName}${a.chineseName}${a.unlockCondition}${a.category}`
          .toLowerCase()
          .includes('nitra'),
      ),
    ).toBe(true)
  })
  it('query 与分类 AND 组合', () => {
    const r = filterAchievements(
      achievements,
      baseState({ query: 'grenade', achievement: { onlyDifficult: true, category: '武器超频' } }),
    )
    expect(r.every((a) => a.category === '武器超频')).toBe(true)
  })
  it('难度筛选：极难+难 仅保留 ≤20%', () => {
    const r = filterAchievements(
      achievements,
      baseState({ achievement: { onlyDifficult: true, difficulty: ['extreme', 'hard'] } }),
    )
    expect(r.every((a) => a.completionRate !== null && a.completionRate <= 20)).toBe(true)
  })
  it('难度筛选：普通 含空达成率与 >20%', () => {
    const r = filterAchievements(
      achievements,
      baseState({ achievement: { onlyDifficult: true, difficulty: ['moderate'] } }),
    )
    expect(r.every((a) => a.completionRate === null || (a.completionRate as number) > 20)).toBe(true)
    expect(r.some((a) => a.completionRate === null)).toBe(true)
  })
})

describe('filterWeapons', () => {
  it('返回 42 把', () => {
    expect(filterWeapons(weapons, baseState()).length).toBe(42)
  })
  it('职业筛选', () => {
    const r = filterWeapons(weapons, baseState({ weapon: { class: 'Scout', tags: [] } }))
    expect(r.every((w) => w.class === 'Scout')).toBe(true)
    expect(r.length).toBe(10)
  })
  it('评级筛选', () => {
    const r = filterWeapons(weapons, baseState({ weapon: { rating: 'S', tags: [] } }))
    expect(r.every((w) => w.rating === 'S')).toBe(true)
  })
  it('标签 AND 筛选（官网枚举）', () => {
    const r = filterWeapons(weapons, baseState({ weapon: { tags: ['PLASMA'] } }))
    expect(r.every((w) => w.tags.includes('PLASMA'))).toBe(true)
  })
})

describe('filterEquipments', () => {
  it('返回 20 件', () => {
    expect(filterEquipments(equipments, baseState()).length).toBe(20)
  })
  it('来源筛选', () => {
    const r = filterEquipments(equipments, baseState({ equipment: { source: '成就解锁' } }))
    expect(r.every((e) => e.source === '成就解锁')).toBe(true)
    expect(r.length).toBe(3)
  })
})
