// 装备筛选：类型 + 来源（AND）+ 全局 query
import { useMemo } from 'react'
import { equipments } from '../data/equipments'
import type { Equipment, SearchState } from '../data/types'
import { matchesQuery } from './useAchievementFilter'

export function filterEquipments(data: Equipment[], state: SearchState): Equipment[] {
  const { query, equipment } = state
  const filtered = data.filter((e) => {
    const eqTypes = Array.isArray(e.type) ? e.type : [e.type]
    if (equipment.types.length > 0 && !equipment.types.some((t) => eqTypes.includes(t))) return false
    if (equipment.source && e.source !== equipment.source) return false
    const hay = `${e.name} ${e.type} ${e.effect} ${e.source} ${e.relatedAchievement ?? ''}`
    return matchesQuery(hay, query)
  })
  if (!equipment.sort) return filtered
  const typeKey = (e: Equipment) => (Array.isArray(e.type) ? e.type[0] ?? '' : e.type)
  const list = [...filtered]
  if (equipment.sort === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
  } else {
    list.sort((a, b) => typeKey(a).localeCompare(typeKey(b), 'zh-CN') || a.name.localeCompare(b.name, 'zh-CN'))
  }
  return list
}

export function useEquipmentFilter(state: SearchState): Equipment[] {
  return useMemo(() => filterEquipments(equipments, state), [state])
}
