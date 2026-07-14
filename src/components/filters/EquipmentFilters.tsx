// 装备筛选：类型多选（来源标签管理）+ 来源
import { Box, Autocomplete, TextField, Chip, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { EQUIPMENT_SOURCES, EQUIPMENT_SOURCE_LABEL } from '../../data/enums'
import type { EquipmentSource, Lang, SearchState } from '../../data/types'
import { useTagEditor } from '../../hooks/useTagEditor'

export function EquipmentFilters({
  state, addType, removeType, setEquipmentSource, lang,
}: {
  state: SearchState; addType: (t: string) => void; removeType: (t: string) => void
  setEquipmentSource: (s?: EquipmentSource) => void; lang: Lang
}) {
  const editor = useTagEditor()
  const eqTypes = editor.getTypes()

  return (
    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
      <Autocomplete
        multiple size="small"
        options={eqTypes}
        value={state.equipment.types}
        getOptionLabel={(o) => o}
        isOptionEqualToValue={(opt, val) => opt === val}
        onChange={(_e, value) => {
          const added = value.filter((t) => !state.equipment.types.includes(t))
          const removed = state.equipment.types.filter((t) => !value.includes(t))
          added.forEach((t) => addType(t))
          removed.forEach((t) => removeType(t))
        }}
        renderInput={(params) => (
          <TextField {...params} label={lang === 'zh' ? '类型' : 'Type'} sx={{ minWidth: 200 }} />
        )}
        sx={{ minWidth: 200 }}
      />

      <Box display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
        {state.equipment.types.map((t) => (
          <Chip key={t} size="small" label={t} color="primary" onDelete={() => removeType(t)} />
        ))}
      </Box>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="eq-src-label">{lang === 'zh' ? '来源' : 'Source'}</InputLabel>
        <Select labelId="eq-src-label" label={lang === 'zh' ? '来源' : 'Source'}
          value={state.equipment.source ?? ''}
          onChange={(e) => setEquipmentSource((e.target.value || undefined) as EquipmentSource | undefined)}>
          <MenuItem value="">{lang === 'zh' ? '全部' : 'All'}</MenuItem>
          {EQUIPMENT_SOURCES.map((s) => (
            <MenuItem key={s} value={s}>{EQUIPMENT_SOURCE_LABEL[s]?.[lang] ?? s}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
