// 全局检索态管理：搜索词 + 当前 Tab + 各模块筛选（AND 组合）
import { useCallback, useMemo, useState } from 'react'
import type {
  AchievementCategory,
  ModuleKey,
  Rating,
  SearchState,
  WeaponClass,
  WeaponTag,
} from '../data/types'
import { filterAchievements, useAchievementFilter } from './useAchievementFilter'
import { filterWeapons, useWeaponFilter } from './useWeaponFilter'
import { filterEquipments, useEquipmentFilter } from './useEquipmentFilter'
import { achievements } from '../data/achievements'
import { weapons } from '../data/weapons'
import { equipments } from '../data/equipments'

const initialState: SearchState = {
  query: '',
  activeModule: 'achievements',
  achievement: { categories: [] },
  weapon: { tags: [] },
  equipment: { types: [] },
}

export function useFilter() {
  const [state, setState] = useState<SearchState>(initialState)

  const setQuery = useCallback((query: string) => {
    setState((s) => ({ ...s, query }))
  }, [])

  const setActiveModule = useCallback((activeModule: ModuleKey) => {
    setState((s) => ({ ...s, activeModule }))
  }, [])

  const setAchievementFilter = useCallback(
    (patch: Partial<SearchState['achievement']>) => {
      setState((s) => ({ ...s, achievement: { ...s.achievement, ...patch } }))
    },
    [],
  )

  const setAchievementSort = useCallback(
    (sort: SearchState['achievement']['sort']) => {
      setState((s) => ({ ...s, achievement: { ...s.achievement, sort } }))
    },
    [],
  )

  const setWeaponSort = useCallback(
    (sort: SearchState['weapon']['sort']) => {
      setState((s) => ({ ...s, weapon: { ...s.weapon, sort } }))
    },
    [],
  )

  const addAchievementCategory = useCallback((cat: AchievementCategory) => {
    setState((s) => {
      if (s.achievement.categories.includes(cat)) return s
      return { ...s, achievement: { ...s.achievement, categories: [...s.achievement.categories, cat] } }
    })
  }, [])

  const removeAchievementCategory = useCallback((cat: AchievementCategory) => {
    setState((s) => ({
      ...s,
      achievement: {
        ...s.achievement,
        categories: s.achievement.categories.filter((c) => c !== cat),
      },
    }))
  }, [])

  const addEquipmentType = useCallback((type: string) => {
    setState((s) => {
      if (s.equipment.types.includes(type)) return s
      return { ...s, equipment: { ...s.equipment, types: [...s.equipment.types, type] } }
    })
  }, [])

  const removeEquipmentType = useCallback((type: string) => {
    setState((s) => ({
      ...s,
      equipment: { ...s.equipment, types: s.equipment.types.filter((t) => t !== type) },
    }))
  }, [])

  const setWeaponClass = useCallback((classVal?: WeaponClass) => {
    setState((s) => ({ ...s, weapon: { ...s.weapon, class: classVal } }))
  }, [])

  const setWeaponRating = useCallback((rating?: Rating) => {
    setState((s) => ({ ...s, weapon: { ...s.weapon, rating } }))
  }, [])

  const addWeaponTag = useCallback((tag: WeaponTag) => {
    setState((s) => {
      if (s.weapon.tags.includes(tag)) return s
      return { ...s, weapon: { ...s.weapon, tags: [...s.weapon.tags, tag] } }
    })
  }, [])

  const removeWeaponTag = useCallback((tag: WeaponTag) => {
    setState((s) => ({
      ...s,
      weapon: { ...s.weapon, tags: s.weapon.tags.filter((t) => t !== tag) },
    }))
  }, [])

  const setEquipmentSource = useCallback(
    (source?: SearchState['equipment']['source']) => {
      setState((s) => ({ ...s, equipment: { ...s.equipment, source } }))
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setState((s) => ({
      ...s,
      achievement: { ...s.achievement, categories: [], rarity: undefined, sort: undefined },
      weapon: { ...s.weapon, class: undefined, rating: undefined, tags: [], sort: undefined },
      equipment: { types: [] },
    }))
  }, [])

  const filteredAchievements = useAchievementFilter(state)
  const filteredWeapons = useWeaponFilter(state)
  const filteredEquipments = useEquipmentFilter(state)

  // 当前模块的结果数（用于顶栏/页脚展示）
  const resultCount = useMemo(() => {
    switch (state.activeModule) {
      case 'achievements':
        return filteredAchievements.length
      case 'weapons':
        return filteredWeapons.length
      case 'equipments':
        return filteredEquipments.length
    }
  }, [state.activeModule, filteredAchievements, filteredWeapons, filteredEquipments])

  return {
    state,
    setQuery,
    setActiveModule,
    setAchievementFilter,
    setAchievementSort,
    setWeaponSort,
    addAchievementCategory,
    removeAchievementCategory,
    setWeaponClass,
    setWeaponRating,
    addWeaponTag,
    removeWeaponTag,
    addEquipmentType,
    removeEquipmentType,
    setEquipmentSource,
    clearFilters,
    filteredAchievements,
    filteredWeapons,
    filteredEquipments,
    resultCount,
    // 暴露纯函数便于测试
    _filterAchievements: filterAchievements,
    _filterWeapons: filterWeapons,
    _filterEquipments: filterEquipments,
    _raw: { achievements, weapons, equipments },
  }
}

export type FilterController = ReturnType<typeof useFilter>
