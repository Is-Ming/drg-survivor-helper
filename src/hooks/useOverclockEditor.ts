// 超频中文名 + 效果编辑器：可编辑 + localStorage 持久化
import { useState, useCallback } from 'react'
import { overclockMap } from '../data/overclocks'

const STORAGE_KEY = 'drg-overclock-edits'

interface OverclockEdit {
  chineseName?: string
  effect?: string
}

/** 从 localStorage 加载用户自定义名称/效果 */
function loadCustomEdits(): Record<string, OverclockEdit> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return {}
}

export function useOverclockEditor() {
  const [edits, setEdits] = useState<Record<string, OverclockEdit>>(loadCustomEdits)

  const getEntry = useCallback(
    (id: string): OverclockEdit & { chineseName: string; effect: string; englishName: string } => {
      const oc = overclockMap[id]
      const edit = edits[id]
      return {
        chineseName: edit?.chineseName ?? oc?.chineseName ?? id,
        effect: edit?.effect ?? oc?.effect ?? '',
        englishName: oc?.englishName ?? id,
      }
    },
    [edits],
  )

  /** 获取超频当前显示名称（优先用户自定义） */
  const getName = useCallback((id: string): string => getEntry(id).chineseName, [getEntry])

  /** 获取超频当前显示效果（优先用户自定义） */
  const getEffect = useCallback((id: string): string => getEntry(id).effect, [getEntry])

  /** 获取超频英文名 */
  const getEnglishName = useCallback((id: string): string => getEntry(id).englishName, [getEntry])

  /** 保存编辑（合并到现有 edits） */
  const saveEdit = useCallback((id: string, patch: OverclockEdit) => {
    setEdits((prev) => {
      const next = { ...prev, [id]: { ...prev[id], ...patch } }
      // 清理无效条目（没有自定义内容的）
      if (!next[id].chineseName && !next[id].effect) delete next[id]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  /** 重置所有编辑为默认值 */
  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setEdits({})
  }, [])

  return { getName, getEffect, getEnglishName, saveEdit, resetAll, edits }
}

export type OverclockEditor = ReturnType<typeof useOverclockEditor>
