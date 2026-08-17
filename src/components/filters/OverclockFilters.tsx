// 超频筛选：类型 ToggleButton（多语言）。接入 SearchState.overclock.types（多选）
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material'
import type { Lang, OverclockType } from '../../data/types'

export function OverclockFilters({
  types,
  toggleType,
  lang,
}: {
  types: OverclockType[]
  toggleType: (t: OverclockType) => void
  lang: Lang
}) {
  return (
    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
      <ToggleButtonGroup
        size="small"
        color="primary"
        value={types}
        onChange={(_, val: OverclockType[]) => {
          const next = new Set(val)
          ;(['balanced', 'unstable'] as OverclockType[]).forEach((t) => {
            const on = next.has(t)
            const cur = types.includes(t)
            if (on !== cur) toggleType(t)
          })
        }}
      >
        <ToggleButton value="balanced">{lang === 'zh' ? '平衡型' : 'Balanced'}</ToggleButton>
        <ToggleButton value="unstable">{lang === 'zh' ? '不稳定型' : 'Unstable'}</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}
