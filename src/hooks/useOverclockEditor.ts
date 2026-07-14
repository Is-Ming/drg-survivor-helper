// 超频中文名 + 效果编辑器：可编辑 + 持久化经 useOverrides（overrides.overclocks）
import { useCallback } from 'react'
import { overclockMap } from '../data/overclocks'
import type { Lang } from '../data/types'
import { useOverrides } from './useOverrides'

interface OverclockEdit {
  chineseName?: string
  effect?: string
}

export function useOverclockEditor() {
  const { merged, overrides, saveOverclockEdit, resetOverrides } = useOverrides()
  // 派生自 overrides.overclocks（不再本地 localStorage）
  const edits = overrides?.overclocks ?? {}

  const getEntry = useCallback(
    (id: string): OverclockEdit & { chineseName: string; effect: string; englishName: string } => {
      const mergedOc = merged?.overclocks?.find((o) => o.id === id)
      const staticOc = overclockMap[id]
      return {
        chineseName: mergedOc?.chineseName ?? staticOc?.chineseName ?? id,
        effect: mergedOc?.effect ?? staticOc?.effect ?? '',
        englishName: mergedOc?.englishName ?? staticOc?.englishName ?? id,
      }
    },
    [merged],
  )

  /** 获取超频当前显示名称（lang-aware：en 时显示英文名） */
  const getName = useCallback(
    (id: string, lang?: Lang): string => {
      if (lang === 'en') return getEntry(id).englishName
      return getEntry(id).chineseName
    },
    [getEntry],
  )

  /** 获取超频当前显示效果（lang-aware：en 时显示英文效果） */
  const getEffect = useCallback(
    (id: string, lang?: Lang): string => {
      if (lang === 'en') return overclockMap[id]?.enEffect ?? getEntry(id).effect
      return getEntry(id).effect
    },
    [getEntry],
  )

  /** 获取超频英文名 */
  const getEnglishName = useCallback((id: string): string => getEntry(id).englishName, [getEntry])

  /** 保存编辑（合并进 overrides.overclocks，由 useOverrides 深合并并回写服务端） */
  const saveEdit = useCallback(
    (id: string, patch: OverclockEdit) => {
      saveOverclockEdit(id, patch)
    },
    [saveOverclockEdit],
  )

  /** 重置所有编辑（委托 useOverrides 清空全部 overrides） */
  const resetAll = useCallback(() => {
    resetOverrides()
  }, [resetOverrides])

  return { getName, getEffect, getEnglishName, saveEdit, resetAll, edits }
}

export type OverclockEditor = ReturnType<typeof useOverclockEditor>
