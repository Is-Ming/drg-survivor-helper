// 成就筛选：分类 + 全局 query（AND 组合）。疑难高亮为卡片渲染开关，不在此过滤。
import { useMemo } from 'react'
import { achievements } from '../data/achievements'
import { getDifficultyTier } from '../data/enums'
import type { Achievement, SearchState, DifficultyTier } from '../data/types'

/** 模糊匹配：query 按空白拆分为多 token，全部命中（AND）即匹配，大小写不敏感。 */
export function matchesQuery(haystack: string, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const hay = haystack.toLowerCase()
  return q.split(/\s+/).every((tok) => hay.includes(tok))
}

/**
 * 默认难度排序：completionRate 升序（越低越难排最前），null 视为 Infinity 排末尾。
 * 纯展示层重排，不改变分类筛选 / 疑难高亮行为。
 */
export function sortByDifficulty(list: Achievement[]): Achievement[] {
  return [...list].sort((a, b) => {
    const ra = a.completionRate ?? Infinity
    const rb = b.completionRate ?? Infinity
    return ra - rb
  })
}

/** 筛选用难度：空达成率按用户决策归入「普通」(moderate) */
export function tierForFilter(rate: number | null): DifficultyTier {
  return getDifficultyTier(rate) ?? 'moderate'
}

export function filterAchievements(data: Achievement[], state: SearchState): Achievement[] {
  const { query, achievement } = state
  const selected =
    achievement.difficulty && achievement.difficulty.length > 0 ? achievement.difficulty : null
  const filtered = data.filter((a) => {
    if (achievement.category && a.category !== achievement.category) return false
    if (selected && !selected.includes(tierForFilter(a.completionRate))) return false
    const hay = `${a.englishName} ${a.chineseName} ${a.unlockCondition} ${a.category}`
    return matchesQuery(hay, query)
  })
  return sortByDifficulty(filtered)
}

export function useAchievementFilter(state: SearchState): Achievement[] {
  return useMemo(() => filterAchievements(achievements, state), [state])
}
