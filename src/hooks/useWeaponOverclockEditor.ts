// 武器超频引用编辑器：管理每把武器关联的超频ID列表，持久化经 useOverrides（overrides.weapons[en]）
import { useCallback, useState } from 'react'
import { weapons } from '../data/weapons'
import { useOverrides } from './useOverrides'

/** 从静态 weapons 表取某武器默认超频引用（回落值） */
function getDefaultIds(englishName: string, type: 'yellow' | 'red'): string[] {
  const w = weapons.find((x) => x.englishName === englishName)
  if (!w) return []
  const field: 'yellowOverclockIds' | 'redOverclockIds' = type === 'yellow' ? 'yellowOverclockIds' : 'redOverclockIds'
  return w[field] ?? []
}

export function useWeaponOverclockEditor() {
  const { merged, saveWeaponOverclockIds } = useOverrides()
  // forceUpdate 计数器，每次增删递增，触发消费组件重渲染
  const [version, setVersion] = useState(0)

  /** 获取武器某类型超频ID列表（优先 overrides 合并值，回落默认静态表） */
  const getWeaponOverclockIds = useCallback(
    (englishName: string, type: 'yellow' | 'red'): string[] => {
      const field: 'yellowOverclockIds' | 'redOverclockIds' =
        type === 'yellow' ? 'yellowOverclockIds' : 'redOverclockIds'
      const w = merged?.weapons?.find((x) => x.englishName === englishName)
      const fromMerged = w?.[field]
      if (fromMerged && fromMerged.length > 0) return fromMerged
      return getDefaultIds(englishName, type)
    },
    [merged],
  )

  const removeOverclock = useCallback(
    (englishName: string, type: 'yellow' | 'red', id: string) => {
      const current = getWeaponOverclockIds(englishName, type)
      const next = current.filter((x) => x !== id)
      saveWeaponOverclockIds(englishName, type, next)
      setVersion((v) => v + 1)
    },
    [getWeaponOverclockIds, saveWeaponOverclockIds],
  )

  const addOverclock = useCallback(
    (englishName: string, type: 'yellow' | 'red', id: string) => {
      const current = getWeaponOverclockIds(englishName, type)
      if (!current.includes(id)) {
        saveWeaponOverclockIds(englishName, type, [...current, id])
        setVersion((v) => v + 1)
      }
    },
    [getWeaponOverclockIds, saveWeaponOverclockIds],
  )

  const resetOverclocks = useCallback(
    (englishName: string) => {
      // 清空该武器黄/红超频引用（空数组经 deepMergeItem 后回落默认）
      saveWeaponOverclockIds(englishName, 'yellow', [])
      saveWeaponOverclockIds(englishName, 'red', [])
      setVersion((v) => v + 1)
    },
    [saveWeaponOverclockIds],
  )

  return { getWeaponOverclockIds, removeOverclock, addOverclock, resetOverclocks, version }
}
