// 装备筛选：类型 + 来源（AND）+ 全局 query
import { useMemo } from 'react'
import { equipments } from '../data/equipments'
import type { Equipment, SearchState } from '../data/types'
import { matchesQuery } from './useAchievementFilter'

export function filterEquipments(data: Equipment[], state: SearchState): Equipment[] {
  const { query, equipment } = state
  return data.filter((e) => {
    if (equipment.type && e.type !== equipment.type) return false
    if (equipment.source && e.source !== equipment.source) return false
    const hay = `${e.name} ${e.type} ${e.effect} ${e.source} ${e.relatedAchievement ?? ''}`
    return matchesQuery(hay, query)
  })
}

export function useEquipmentFilter(state: SearchState): Equipment[] {
  return useMemo(() => filterEquipments(equipments, state), [state])
}
