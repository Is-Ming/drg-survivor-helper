// 标签/分类编辑器：管理成就分类、武器标签、装备类型（localStorage 持久化）
import { useCallback, useState } from 'react'
import { ACHIEVEMENT_CATEGORIES } from '../data/enums'

const STORAGE_KEY = 'drg-tag-edits'
const ALL_RESET_PREFIXES = [
  'drg-helper-overclock-edit',
  'drg-wpn-oc-',
  'drg-ach-edit-',
  'drg-eqp-edit-',
  'drg-tag-edits',
  'drg-wpn-rating-',
]

interface TagData {
  /** 自定义成就分类列表（覆盖默认） */
  achievementCategories?: string[]
  /** 自定义武器标签列表（覆盖默认） */
  weaponTags?: string[]
  /** 自定义装备类型列表（覆盖默认） */
  equipmentTypes?: string[]
}

// 武器标签默认值（从 types.ts WeaponTag 提取）
const DEFAULT_WEAPON_TAGS = [
  'KINETIC', 'FIRE', 'ELECTRIC', 'COLD', 'ACID', 'PLASMA',
  'LIGHT', 'MEDIUM', 'HEAVY', 'THROWABLE', 'CONSTRUCT',
  'PROJECTILE', 'EXPLOSIVE', 'DRONE', 'TURRET', 'GROUNDZONE',
  'PRECISE', 'SPRAY', 'AREA', 'BEAM', 'LASTING',
]

// 装备类型默认值
const DEFAULT_EQUIPMENT_TYPES = [
  '发育', '拾取', '生存', '经验', '武器', '直伤/混伤',
  '战力', '生存/升级', '直伤核心', '闪避', '暴击', '召唤',
]

function loadData(): TagData {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch { return {} }
}

function saveData(data: TagData): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* ignore */ }
}

/** 获取自定义成就分类列表（回落默认） */
export function getAchievementCategories(): string[] {
  const data = loadData()
  return data.achievementCategories ?? ACHIEVEMENT_CATEGORIES
}

/** 获取自定义武器标签列表（回落默认） */
export function getWeaponTags(): string[] {
  const data = loadData()
  return data.weaponTags ?? DEFAULT_WEAPON_TAGS
}

/** 获取自定义装备类型列表（回落默认） */
export function getEquipmentTypes(): string[] {
  const data = loadData()
  return data.equipmentTypes ?? DEFAULT_EQUIPMENT_TYPES
}

/** 一键恢复所有自定义数据（清除所有 drg-* 前缀的 key） */
export function resetAllCustomData(): void {
  try {
    for (const prefix of ALL_RESET_PREFIXES) {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(prefix)) keysToRemove.push(key)
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k))
    }
  } catch { /* ignore */ }
}

export function useTagEditor() {
  const [version, setVersion] = useState(0)

  const getCategories = useCallback((): string[] => getAchievementCategories(), [version])
  const getTags = useCallback((): string[] => getWeaponTags(), [version])
  const getTypes = useCallback((): string[] => getEquipmentTypes(), [version])

  const setCategories = useCallback((list: string[]) => {
    const data = loadData()
    data.achievementCategories = list
    saveData(data)
    setVersion((v) => v + 1)
  }, [])

  const setTags = useCallback((list: string[]) => {
    const data = loadData()
    data.weaponTags = list
    saveData(data)
    setVersion((v) => v + 1)
  }, [])

  const setTypes = useCallback((list: string[]) => {
    const data = loadData()
    data.equipmentTypes = list
    saveData(data)
    setVersion((v) => v + 1)
  }, [])

  return {
    getCategories,
    getTags,
    getTypes,
    setCategories,
    setTags,
    setTypes,
  }
}
