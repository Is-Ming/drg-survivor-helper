// 武器排序单元测试（铁律 1：武器仅按名称升/降，undefined=保持原序）
import { describe, it, expect } from 'vitest'
import { sortWeapons } from '../hooks/useWeaponFilter'
import { weapons } from '../data/weapons'

describe('sortWeapons（武器名称排序）', () => {
  it('name-asc 升序（zh-CN 本地化比较）', () => {
    const asc = sortWeapons(weapons, 'name-asc').map((w) => w.chineseName)
    const expected = [...weapons]
      .sort((a, b) => a.chineseName.localeCompare(b.chineseName, 'zh-CN'))
      .map((w) => w.chineseName)
    expect(asc).toEqual(expected)
  })

  it('name-desc 降序（为升序的反序）', () => {
    const asc = sortWeapons(weapons, 'name-asc').map((w) => w.chineseName)
    const desc = sortWeapons(weapons, 'name-desc').map((w) => w.chineseName)
    expect(desc).toEqual([...asc].reverse())
  })

  it("undefined 保持原序（返回原引用，不重排）", () => {
    expect(sortWeapons(weapons, undefined)).toEqual(weapons)
  })

  it('纯函数不修改原数组', () => {
    const copy = [...weapons]
    sortWeapons(weapons, 'name-asc')
    expect(weapons).toEqual(copy)
  })
})
