import { describe, it, expect } from 'vitest'
import { matchesQuery, filterAchievements, sortAchievements } from '../hooks/useAchievementFilter'
import { filterWeapons, sortWeapons } from '../hooks/useWeaponFilter'
import { filterEquipments } from '../hooks/useEquipmentFilter'
import { achievements } from '../data/achievements'
import { weapons } from '../data/weapons'
import { equipments } from '../data/equipments'
import type { SearchState } from '../data/types'

function baseState(over: Partial<SearchState> = {}): SearchState {
  return {
    query: '',
    activeModule: 'achievements',
    achievement: { categories: [] },
    weapon: { tags: [] },
    equipment: { types: [] },
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
      baseState({ achievement: { categories: ['生物群系' as any] } }),
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
      baseState({ query: 'grenade', achievement: { categories: ['武器超频' as any] } }),
    )
    expect(r.every((a) => a.category === '武器超频')).toBe(true)
  })
  it('稀有度筛选：仅保留稀有', () => {
    const r = filterAchievements(achievements, baseState({ achievement: { categories: [], rarity: '稀有' } }))
    expect(r.length).toBeGreaterThan(0)
    expect(r.every((a) => a.rarity === '稀有')).toBe(true)
  })
  it('稀有度筛选：仅保留普通', () => {
    const r = filterAchievements(achievements, baseState({ achievement: { categories: [], rarity: '普通' } }))
    expect(r.length).toBeGreaterThan(0)
    expect(r.every((a) => a.rarity === '普通')).toBe(true)
  })
})

describe('成就排序（filterAchievements 应用点）', () => {
  it('按名称升序', () => {
    const r = filterAchievements(
      achievements,
      baseState({ achievement: { categories: [], sort: { by: 'name', dir: 'asc' } } }),
    )
    const names = r.map((a) => (typeof a.chineseName === 'string' ? a.chineseName : a.englishName))
    const sorted = [...names].sort((x, y) => x.localeCompare(y, 'zh-CN'))
    expect(names).toEqual(sorted)
  })
  it('按完成率排序：desc 是 asc 的精确反序（null 在两端对称）', () => {
    const asc = filterAchievements(
      achievements,
      baseState({ achievement: { categories: [], sort: { by: 'completionRate', dir: 'asc' } } }),
    )
    const desc = filterAchievements(
      achievements,
      baseState({ achievement: { categories: [], sort: { by: 'completionRate', dir: 'desc' } } }),
    )
    const ascRates = asc.map((a) => a.completionRate)
    const descRates = desc.map((a) => a.completionRate)
    // 取负比较器 = 反转顺序：升序排末尾的 null 在降序排最前，二者互为反序。
    expect(descRates).toEqual([...ascRates].reverse())
  })
  it('sortAchievements 纯函数不修改原数组', () => {
    const list = [...achievements]
    sortAchievements(list, 'name', 'asc')
    expect(list).toEqual(achievements)
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
  it('名称升序排序生效', () => {
    const r = filterWeapons(weapons, baseState({ weapon: { tags: [], sort: 'name-asc' } }))
    const names = r.map((w) => w.chineseName)
    const sorted = [...names].sort((x, y) => x.localeCompare(y, 'zh-CN'))
    expect(names).toEqual(sorted)
  })
})

describe('filterEquipments', () => {
  it('返回 20 件', () => {
    expect(filterEquipments(equipments, baseState()).length).toBe(20)
  })
  it('来源筛选', () => {
    const r = filterEquipments(equipments, baseState({ equipment: { types: [], source: '成就解锁' } }))
    expect(r.every((e) => e.source === '成就解锁')).toBe(true)
    expect(r.length).toBe(3)
  })
})

describe('sortWeapons 纯函数', () => {
  it('undefined 保持原序（返回原引用）', () => {
    expect(sortWeapons(weapons, undefined)).toEqual(weapons)
  })
})
