// 武器超频引用编辑器：管理每把武器关联的超频ID列表，持久化 localStorage
import { useCallback } from 'react'
import { weapons } from '../data/weapons'

const STORAGE_PREFIX = 'drg-wpn-oc-'

function getIds(englishName: string, type: 'yellow' | 'red'): string[] {
  const w = weapons.find((x) => x.englishName === englishName)
  if (!w) return []
  const field = type === 'yellow' ? 'yellowOverclockIds' : 'redOverclockIds'
  return (w as any)[field] ?? []
}

function saveIds(englishName: string, type: 'yellow' | 'red', ids: string[]): void {
  try {
    const key = STORAGE_PREFIX + englishName
    const existing = JSON.parse(localStorage.getItem(key) || '{}')
    existing[type] = ids
    localStorage.setItem(key, JSON.stringify(existing))
  } catch { /* ignore */ }
}

function loadIds(englishName: string, type: 'yellow' | 'red'): string[] | null {
  try {
    const key = STORAGE_PREFIX + englishName
    const saved = JSON.parse(localStorage.getItem(key) || '{}')
    if (saved[type] !== undefined) return saved[type]
  } catch { /* ignore */ }
  return null
}

/** 获取武器某类型超频ID列表（优先自定义，回落默认） */
export function getWeaponOverclockIds(englishName: string, type: 'yellow' | 'red'): string[] {
  const custom = loadIds(englishName, type)
  return custom ?? getIds(englishName, type)
}

export function useWeaponOverclockEditor() {
  /** 从武器移除一个超频 */
  const removeOverclock = useCallback((englishName: string, type: 'yellow' | 'red', id: string) => {
    const current = getWeaponOverclockIds(englishName, type)
    saveIds(englishName, type, current.filter((x) => x !== id))
  }, [])

  /** 向武器添加一个超频 */
  const addOverclock = useCallback((englishName: string, type: 'yellow' | 'red', id: string) => {
    const current = getWeaponOverclockIds(englishName, type)
    if (!current.includes(id)) {
      saveIds(englishName, type, [...current, id])
    }
  }, [])

  /** 重置武器超频引用（回到默认） */
  const resetOverclocks = useCallback((englishName: string) => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + englishName)
    } catch { /* ignore */ }
  }, [])

  return { getWeaponOverclockIds, removeOverclock, addOverclock, resetOverclocks }
}
