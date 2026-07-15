// 成就筛选：分类多选 + 稀有度三选一 + 排序（名称/完成率 + 升/降）
import {
  Box, Autocomplete, TextField, Chip, FormControl, InputLabel, Select, MenuItem, ToggleButton, ToggleButtonGroup,
} from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { ACHIEVEMENT_CATEGORY_LABEL } from '../../data/enums'
import type { AchievementCategory, Lang, SearchState } from '../../data/types'
import { useTagEditor } from '../../hooks/useTagEditor'

export function AchievementFilters({
  state,
  addCategory,
  removeCategory,
  setAchievementFilter,
  setAchievementSort,
  lang,
}: {
  state: SearchState
  addCategory: (cat: AchievementCategory) => void
  removeCategory: (cat: AchievementCategory) => void
  setAchievementFilter: (patch: Partial<SearchState['achievement']>) => void
  setAchievementSort: (sort: SearchState['achievement']['sort']) => void
  lang: Lang
}) {
  const editor = useTagEditor()
  const categories = editor.getCategories() as AchievementCategory[]

  // 稀有度（全部 / 普通 / 稀有）
  const rarityVal = state.achievement.rarity ?? 'all'
  // 排序：默认按完成率升序（与 filterAchievements 默认行为一致）
  const sortBy: 'name' | 'completionRate' = state.achievement.sort?.by ?? 'completionRate'
  const sortDir: 'asc' | 'desc' = state.achievement.sort?.dir ?? 'asc'

  const onRarityChange = (val: string) => {
    setAchievementFilter({ rarity: val === 'all' ? undefined : (val as '普通' | '稀有') })
  }
  const onSortByChange = (by: 'name' | 'completionRate') => {
    setAchievementSort({ by, dir: sortDir })
  }
  const onDirChange = (dir: 'asc' | 'desc' | null) => {
    // ToggleButtonGroup 取消选中时回落默认（升序）
    setAchievementSort({ by: sortBy, dir: dir ?? 'asc' })
  }

  return (
    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
      <Autocomplete
        multiple
        size="small"
        options={categories}
        value={state.achievement.categories}
        getOptionLabel={(option) => ACHIEVEMENT_CATEGORY_LABEL[option]?.[lang] ?? option}
        isOptionEqualToValue={(opt, val) => opt === val}
        onChange={(_e, value) => {
          const added = value.filter((c) => !state.achievement.categories.includes(c))
          const removed = state.achievement.categories.filter((c) => !value.includes(c))
          added.forEach((c) => addCategory(c))
          removed.forEach((c) => removeCategory(c))
        }}
        renderInput={(params) => (
          <TextField {...params} label={lang === 'zh' ? '分类' : 'Category'} sx={{ minWidth: 200 }} />
        )}
        sx={{ minWidth: 200 }}
      />

      <Box display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
        {state.achievement.categories.map((cat) => (
          <Chip key={cat} size="small" label={ACHIEVEMENT_CATEGORY_LABEL[cat]?.[lang] ?? cat}
            color="primary" onDelete={() => removeCategory(cat)} />
        ))}
      </Box>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="ach-rarity-label">{lang === 'zh' ? '稀有度' : 'Rarity'}</InputLabel>
        <Select
          labelId="ach-rarity-label"
          label={lang === 'zh' ? '稀有度' : 'Rarity'}
          value={rarityVal}
          onChange={(e) => onRarityChange(e.target.value)}
        >
          <MenuItem value="all">{lang === 'zh' ? '全部' : 'All'}</MenuItem>
          <MenuItem value="普通">{lang === 'zh' ? '普通' : 'Common'}</MenuItem>
          <MenuItem value="稀有">{lang === 'zh' ? '稀有' : 'Rare'}</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 130 }}>
        <InputLabel id="ach-sort-by-label">{lang === 'zh' ? '排序' : 'Sort by'}</InputLabel>
        <Select
          labelId="ach-sort-by-label"
          label={lang === 'zh' ? '排序' : 'Sort by'}
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as 'name' | 'completionRate')}
        >
          <MenuItem value="name">{lang === 'zh' ? '名称' : 'Name'}</MenuItem>
          <MenuItem value="completionRate">{lang === 'zh' ? '完成率' : 'Completion'}</MenuItem>
        </Select>
      </FormControl>

      <ToggleButtonGroup
        size="small"
        color="primary"
        exclusive
        value={sortDir}
        onChange={(_, val) => onDirChange(val as 'asc' | 'desc' | null)}
      >
        <ToggleButton value="asc" aria-label="asc">
          <ArrowUpwardIcon fontSize="small" />
          {lang === 'zh' ? '升序' : 'Asc'}
        </ToggleButton>
        <ToggleButton value="desc" aria-label="desc">
          <ArrowDownwardIcon fontSize="small" />
          {lang === 'zh' ? '降序' : 'Desc'}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}
