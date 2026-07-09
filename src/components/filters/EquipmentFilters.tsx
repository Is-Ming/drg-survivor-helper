// 装备筛选：类型 + 来源（类型来自标签管理，实时生效）
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { EQUIPMENT_SOURCES, EQUIPMENT_SOURCE_LABEL, EQUIPMENT_TYPE_LABEL } from '../../data/enums'
import type { EquipmentSource, Lang, SearchState } from '../../data/types'
import { getEquipmentTypes } from '../../hooks/useTagEditor'

export function EquipmentFilters({
  state,
  setEquipmentType,
  setEquipmentSource,
  lang,
}: {
  state: SearchState
  setEquipmentType: (t?: string) => void
  setEquipmentSource: (s?: EquipmentSource) => void
  lang: Lang
}) {
  // 从标签管理读取自定义装备类型（实时生效）
  const eqTypes = getEquipmentTypes()

  return (
    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="eq-type-label">{lang === 'zh' ? '类型' : 'Type'}</InputLabel>
        <Select
          labelId="eq-type-label"
          label={lang === 'zh' ? '类型' : 'Type'}
          value={state.equipment.type ?? ''}
          onChange={(e) => setEquipmentType(e.target.value || undefined)}
        >
          <MenuItem value="">{lang === 'zh' ? '全部' : 'All'}</MenuItem>
          {eqTypes.map((t) => (
            <MenuItem key={t} value={t}>
              {EQUIPMENT_TYPE_LABEL[t]?.[lang] ?? t}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="eq-src-label">{lang === 'zh' ? '来源' : 'Source'}</InputLabel>
        <Select
          labelId="eq-src-label"
          label={lang === 'zh' ? '来源' : 'Source'}
          value={state.equipment.source ?? ''}
          onChange={(e) => setEquipmentSource((e.target.value || undefined) as EquipmentSource | undefined)}
        >
          <MenuItem value="">{lang === 'zh' ? '全部' : 'All'}</MenuItem>
          {EQUIPMENT_SOURCES.map((s) => (
            <MenuItem key={s} value={s}>
              {EQUIPMENT_SOURCE_LABEL[s]?.[lang] ?? s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
