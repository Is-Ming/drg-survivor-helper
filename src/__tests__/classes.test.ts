// classes.ts 数据结构校验（验收点 1）：4 职业 × 3 小职业 = 12，小职业 isTentative
import { describe, it, expect } from 'vitest'
import { classes } from '../data/classes'
import { weapons } from '../data/weapons'
import type { WeaponClass } from '../data/types'

describe('classes 职业 / 小职业数据结构（验收点 1）', () => {
  it('共 4 职业，每职业 3 小职业，合计 12', () => {
    expect(classes.length).toBe(4)
    classes.forEach((c) => expect(c.subclasses.length).toBe(3))
    const total = classes.reduce((n, c) => n + c.subclasses.length, 0)
    expect(total).toBe(12)
  })

  it('所有小职业 isTentative 均为 false（译名已确认）', () => {
    classes.forEach((c) =>
      c.subclasses.forEach((s) => expect(s.isTentative).toBe(false)),
    )
  })

  it('职业大类中文为社区通用译名（非暂译）', () => {
    const expected: Record<WeaponClass, string> = {
      Scout: '侦察兵',
      Gunner: '机枪手',
      Engineer: '工程师',
      Driller: '钻机手',
    }
    classes.forEach((c) => expect(c.chineseName).toBe(expected[c.englishName]))
  })

  it('所有小职业 startWeapon 均能在 weapons.ts 中找到对应武器', () => {
    const names = new Set(weapons.map((w) => w.englishName))
    classes.forEach((c) =>
      c.subclasses.forEach((s) => {
        if (s.startWeapon) {
          expect(names.has(s.startWeapon), `${s.englishName} -> ${s.startWeapon}`).toBe(true)
        }
      }),
    )
  })

  it('抽查：Scout/Classic 起始武器为 DeepCore GK2', () => {
    const scout = classes.find((c) => c.englishName === 'Scout')
    const classic = scout?.subclasses.find((s) => s.englishName === 'Classic')
    expect(classic?.startWeapon).toBe('DeepCore GK2')
  })
})
