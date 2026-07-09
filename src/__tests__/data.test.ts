// 数据完整性测试（验收点 1：三大模块数据完整；验收点 7：待核/版本标记不杜撰）
import { describe, it, expect } from 'vitest'
import { achievements } from '../data/achievements'
import { weapons } from '../data/weapons'
import { equipments } from '../data/equipments'

const VALID_RATINGS: ReadonlySet<string> = new Set(['S', 'A', 'B', 'C', '-'])

describe('三大模块数据完整（验收点 1）', () => {
  it('achievements 长度 = 300', () => {
    expect(achievements).toHaveLength(300)
  })
  it('weapons 长度 = 42', () => {
    expect(weapons).toHaveLength(42)
  })
  it('equipments 长度 = 20', () => {
    expect(equipments).toHaveLength(20)
  })
})

describe('空达成率约定（验收点 2：决策 5）', () => {
  it('恰好 61 条成就 completionRate 为 null', () => {
    const nullCount = achievements.filter((a) => a.completionRate === null).length
    expect(nullCount).toBe(61)
  })
  it('每条成就 completionRate 均为 number | null（无 undefined）', () => {
    for (const a of achievements) {
      expect(
        a.completionRate === null || typeof a.completionRate === 'number',
      ).toBe(true)
    }
  })
  it('有值的 239 条达成率均为 0–100 的百分比', () => {
    const valued = achievements.filter((a) => a.completionRate !== null)
    expect(valued).toHaveLength(239)
    for (const a of valued) {
      const r = a.completionRate as number
      expect(r).toBeGreaterThanOrEqual(0)
      expect(r).toBeLessThanOrEqual(100)
    }
  })
})

describe('待核/版本标记原样保留（验收点 7：决策 6，不杜撰）', () => {
  it('武器恰好 2 处保留 "待核" 标记', () => {
    const pending = weapons.filter((w) => w.version.includes('待核'))
    expect(pending).toHaveLength(2)
  })
  it('每件装备 version 字段均非空（原样保留，不杜撰）', () => {
    for (const e of equipments) {
      expect(typeof e.version).toBe('string')
      expect(e.version.length).toBeGreaterThan(0)
    }
  })
  it('每条成就均带 version 字段（原样保留）', () => {
    for (const a of achievements) {
      expect(typeof a.version).toBe('string')
      expect(a.version.length).toBeGreaterThan(0)
    }
  })
})

describe('数据字段合法性', () => {
  it('每件武器评级均为合法 Rating（S/A/B/C/-）', () => {
    for (const w of weapons) {
      expect(VALID_RATINGS.has(w.rating)).toBe(true)
    }
  })
  it('每件武器 tags 为数组', () => {
    for (const w of weapons) {
      expect(Array.isArray(w.tags)).toBe(true)
    }
  })
  it('成就解锁类装备均带 relatedAchievement', () => {
    const unlock = equipments.filter((e) => e.source === '成就解锁')
    expect(unlock.length).toBe(3)
    for (const e of unlock) {
      expect(e.relatedAchievement).toBeTruthy()
    }
  })
})

describe('R3 超频名字 / R5 官网数据（Round 2 增量）', () => {
  it('每件武器均带超频 ID 数组（R3）', () => {
    for (const w of weapons) {
      expect(Array.isArray(w.yellowOverclockIds)).toBe(true)
      expect(Array.isArray(w.redOverclockIds)).toBe(true)
      expect(w.yellowOverclockIds!.length).toBeGreaterThan(0)
      expect(w.redOverclockIds!.length).toBeGreaterThan(0)
    }
  })
  it('每件装备均带官网名与官网效果（R5）', () => {
    for (const e of equipments) {
      expect(typeof e.officialName).toBe('string')
      expect(e.officialName!.length).toBeGreaterThan(0)
      expect(typeof e.officialEffect).toBe('string')
      expect(e.officialEffect!.length).toBeGreaterThan(0)
    }
  })
  it('3 件装备官方待核（三明治/狂人头盔/挖他命）', () => {
    const pending = equipments.filter((e) => e.officialName!.includes('待核'))
    expect(pending).toHaveLength(3)
  })
})
