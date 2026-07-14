// 武器中文名编辑器：可编辑 + localStorage 持久化
// 设计对齐 useOverclockEditor / useTagEditor：
//   - 单一 JSON map 键 `drg-wpn-names` 保存全部自定义中文名
//   - zh 优先返回自定义名，回落武器数据默认 chineseName；en 返回 englishName
import { useState, useCallback } from 'react'
import { weapons } from '../data/weapons'
import type { Lang } from '../data/types'

/** localStorage 键（统一 JSON map，便于一键恢复） */
export const WEAPON_NAME_STORAGE_KEY = 'drg-wpn-names'

type WeaponNameMap = Record<string, string>

/** 从 localStorage 加载用户自定义武器中文名 */
function loadCustomNames(): WeaponNameMap {
  try {
    const raw = localStorage.getItem(WEAPON_NAME_STORAGE_KEY)
    if (raw) return JSON.parse(raw) as WeaponNameMap
  } catch { /* ignore */ }
  return {}
}

/** 取武器默认中文名（回落英文名） */
function getDefaultZh(englishName: string): string {
  const w = weapons.find((item) => item.englishName === englishName)
  return w?.chineseName ?? englishName
}

export function useWeaponNameEditor() {
  const [customNames, setCustomNames] = useState<WeaponNameMap>(loadCustomNames)
  const [version, setVersion] = useState(0)

  /** 获取武器当前显示名（lang-aware）。
   *  - zh：优先自定义中文名，回落武器数据默认 chineseName
   *  - en：返回武器英文名（englishName） */
  const getWeaponName = useCallback(
    (englishName: string, lang: Lang): string => {
      if (lang === 'en') return englishName
      return customNames[englishName] ?? getDefaultZh(englishName)
    },
    [customNames],
  )

  /** 保存武器自定义中文名（即时写入 localStorage）。
   *  若清空或与默认值相同则移除该项，保持存储精简。 */
  const setWeaponName = useCallback((englishName: string, zhName: string): void => {
    const trimmed = zhName.trim()
    setCustomNames((prev) => {
      const next: WeaponNameMap = { ...prev }
      if (trimmed === '' || trimmed === getDefaultZh(englishName).trim()) {
        delete next[englishName]
      } else {
        next[englishName] = trimmed
      }
      try {
        if (Object.keys(next).length === 0) {
          localStorage.removeItem(WEAPON_NAME_STORAGE_KEY)
        } else {
          localStorage.setItem(WEAPON_NAME_STORAGE_KEY, JSON.stringify(next))
        }
      } catch { /* ignore */ }
      return next
    })
    setVersion((v) => v + 1)
  }, [])

  /** 清除所有自定义武器名对应的 localStorage（供「一键恢复默认数据」复用）。
   *  纯函数形态，不触碰 React 状态，可被 resetAllCustomData 直接调用。 */
  const resetStorage = useCallback((): void => {
    try { localStorage.removeItem(WEAPON_NAME_STORAGE_KEY) } catch { /* ignore */ }
  }, [])

  /** 清除所有自定义武器名（状态 + 存储） */
  const reset = useCallback((): void => {
    resetStorage()
    setCustomNames({})
    setVersion((v) => v + 1)
  }, [resetStorage])

  return { getWeaponName, setWeaponName, resetWeaponNames: reset, version }
}

/** 独立导出：仅清除 localStorage 中的自定义武器名（供全局一键恢复调用，不依赖 React 状态） */
export function resetWeaponNames(): void {
  try { localStorage.removeItem(WEAPON_NAME_STORAGE_KEY) } catch { /* ignore */ }
}

export type WeaponNameEditor = ReturnType<typeof useWeaponNameEditor>
