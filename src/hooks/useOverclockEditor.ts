// 超频中文名编辑器：可编辑 + localStorage 持久化
import { useState, useCallback } from 'react'
import { overclocks } from '../data/overclocks'

const STORAGE_KEY = 'drg-overclock-names'

/** 从 localStorage 加载用户自定义名称，回退到 data 默认值 */
function loadCustomNames(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return {}
}

export function useOverclockEditor() {
  const [customNames, setCustomNames] = useState<Record<string, string>>(loadCustomNames)

  /** 获取超频当前显示名称（优先用户自定义） */
  const getName = useCallback(
    (id: string): string => {
      if (customNames[id]) return customNames[id]
      const oc = overclocks.find((o) => o.id === id)
      return oc?.chineseName ?? id
    },
    [customNames],
  )

  /** 用户修改超频中文名 */
  const setName = useCallback((id: string, name: string) => {
    setCustomNames((prev) => {
      const next = { ...prev, [id]: name }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  /** 重置所有自定义名称为默认值 */
  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setCustomNames({})
  }, [])

  return { getName, setName, resetAll, customNames }
}

export type OverclockEditor = ReturnType<typeof useOverclockEditor>
