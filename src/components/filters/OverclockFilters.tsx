// 超频筛选：类型 ToggleButton
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material'
import type { Lang } from '../../data/types'
import type { OverclockFilterState } from '../../hooks/useOverclockFilter'

export function OverclockFilters({
  state,
  setFilter,
  lang,
}: {
  state: OverclockFilterState
  setFilter: (patch: Partial<OverclockFilterState>) => void
  lang: Lang
}) {
  return (
    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
      <ToggleButtonGroup
        size="small"
        color="primary"
        value={state.type ?? ''}
        exclusive
        onChange={(_, val) => setFilter({ type: val || undefined })}
      >
        <ToggleButton value="">{lang === 'zh' ? '全部' : 'All'}</ToggleButton>
        <ToggleButton value="balanced">{lang === 'zh' ? '平衡型' : 'Balanced'}</ToggleButton>
        <ToggleButton value="unstable">{lang === 'zh' ? '不稳定型' : 'Unstable'}</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}
