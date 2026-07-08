// 成就难度排序校验（验收点 3）：completionRate 升序，null 视为 Infinity 排末尾
import { describe, it, expect } from 'vitest'
import { sortByDifficulty } from '../hooks/useAchievementFilter'
import type { Achievement } from '../data/types'

function mk(name: string, rate: number | null): Achievement {
  return {
    englishName: name,
    chineseName: name,
    category: '其他动作',
    unlockCondition: '',
    completionRate: rate,
    version: '当前',
  }
}

describe('成就难度排序 sortByDifficulty（验收点 3）', () => {
  it('completionRate 升序，null 排末尾', () => {
    const list = [
      mk('A', null),
      mk('B', 30),
      mk('C', 5),
      mk('D', null),
      mk('E', 12),
    ]
    const sorted = sortByDifficulty(list)
    expect(sorted.map((a) => a.englishName)).toEqual(['C', 'E', 'B', 'A', 'D'])
  })

  it('纯数值升序', () => {
    const list = [mk('X', 50), mk('Y', 10), mk('Z', 1)]
    expect(sortByDifficulty(list).map((a) => a.englishName)).toEqual(['Z', 'Y', 'X'])
  })

  it('不修改原数组（纯函数）', () => {
    const list = [mk('A', 10), mk('B', 5)]
    const copy = [...list]
    sortByDifficulty(list)
    expect(list).toEqual(copy)
  })
})
