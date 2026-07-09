// 装备筛选：类型 + 来源
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { EQUIPMENT_SOURCES, EQUIPMENT_SOURCE_LABEL, EQUIPMENT_TYPE_LABEL } from '../../data/enums'
import { equipments } from '../../data/equipments'
import type { EquipmentSource, Lang, SearchState } from '../../data/types'

const EQUIPMENT_TYPES = Array.from(new Set(equipments.map((e) => e.type)))

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
          {EQUIPMENT_TYPES.map((t) => (
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
