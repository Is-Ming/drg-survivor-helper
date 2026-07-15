// 成就筛选：分类 + 稀有度 + 全局 query（AND 组合）。默认按完成率升序（sortByDifficulty）。
// 疑难高亮为卡片渲染开关（现已移除），难度筛选维度已移除，改为稀有度筛选。
import { useMemo } from 'react'
import { achievements } from '../data/achievements'
import type { Achievement, SearchState } from '../data/types'

/** 模糊匹配：query 按空白拆分为多 token，全部命中（AND）即匹配，大小写不敏感。 */
export function matchesQuery(haystack: string, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const hay = haystack.toLowerCase()
  return q.split(/\s+/).every((tok) => hay.includes(tok))
}

/**
 * 默认排序：completionRate 升序（越低越难排最前），null 视为 Infinity 排末尾。
 * 纯展示层重排，不改变分类 / 稀有度筛选行为。
 */
export function sortByDifficulty(list: Achievement[]): Achievement[] {
  return [...list].sort((a, b) => {
    const ra = a.completionRate ?? Infinity
    const rb = b.completionRate ?? Infinity
    return ra - rb
  })
}

/** 取可排序名称键：模板字段回落英文名，避免对 WeaponRefTemplate 对象直接比较 */
function nameKey(a: Achievement): string {
  return typeof a.chineseName === 'string' ? a.chineseName : a.englishName
}

/**
 * 自定义排序：by='name' 按 chineseName 本地化比较；by='completionRate' 按数值，null 排末尾。
 * dir 控制升/降序。
 */
export function sortAchievements(
  list: Achievement[],
  by: 'name' | 'completionRate',
  dir: 'asc' | 'desc',
): Achievement[] {
  const factor = dir === 'asc' ? 1 : -1
  return [...list].sort((a, b) => {
    let cmp: number
    if (by === 'name') {
      cmp = nameKey(a).localeCompare(nameKey(b), 'zh-CN')
    } else {
      const ra = a.completionRate ?? Infinity
      const rb = b.completionRate ?? Infinity
      cmp = ra - rb
    }
    return cmp * factor
  })
}

export function filterAchievements(data: Achievement[], state: SearchState): Achievement[] {
  const { query, achievement } = state
  const filtered = data.filter((a) => {
    const achCats = Array.isArray(a.category) ? a.category : [a.category]
    if (achievement.categories.length > 0 && !achievement.categories.some((c) => achCats.includes(c)))
      return false
    // 稀有度筛选（undefined=全部）
    if (achievement.rarity && a.rarity !== achievement.rarity) return false
    const hay = `${a.englishName} ${a.chineseName} ${a.unlockCondition} ${a.category}`
    return matchesQuery(hay, query)
  })
  // 应用自定义排序；未指定则回落默认（按完成率升序）
  if (achievement.sort) {
    return sortAchievements(filtered, achievement.sort.by, achievement.sort.dir)
  }
  return sortByDifficulty(filtered)
}

export function useAchievementFilter(state: SearchState): Achievement[] {
  return useMemo(() => filterAchievements(achievements, state), [state])
}
