// 超频筛选
import { useMemo } from 'react'
import { overclocks } from '../data/overclocks'
import type { Overclock } from '../data/types'

export interface OverclockFilterState {
  /** 按类型筛选，空=全部 */
  type?: 'balanced' | 'unstable'
  /** 搜索词 */
  query?: string
}

export function filterOverclocks(
  data: Overclock[],
  state: OverclockFilterState,
): Overclock[] {
  return data.filter((oc) => {
    if (state.type && oc.type !== state.type) return false
    if (state.query) {
      const q = state.query.toLowerCase()
      const hay = `${oc.englishName} ${oc.chineseName} ${oc.effect}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

export function useOverclockFilter(state: OverclockFilterState): Overclock[] {
  return useMemo(() => filterOverclocks(overclocks, state), [state.type, state.query])
}
