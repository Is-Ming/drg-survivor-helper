// 成就筛选：分类多选（来源标签管理）+ 难度三档 + 疑难高亮开关
import { Box, Autocomplete, TextField, Chip, ToggleButton, ToggleButtonGroup, FormControlLabel, Switch } from '@mui/material'
import { ACHIEVEMENT_CATEGORY_LABEL, DIFFICULTY_LABEL } from '../../data/enums'
import type { AchievementCategory, Lang, SearchState, DifficultyTier } from '../../data/types'
import { useTagEditor } from '../../hooks/useTagEditor'

export function AchievementFilters({
  state,
  addCategory,
  removeCategory,
  setAchievementFilter,
  lang,
}: {
  state: SearchState
  addCategory: (cat: AchievementCategory) => void
  removeCategory: (cat: AchievementCategory) => void
  setAchievementFilter: (patch: Partial<SearchState['achievement']>) => void
  lang: Lang
}) {
  const editor = useTagEditor()
  const categories = editor.getCategories() as AchievementCategory[]

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

      <ToggleButtonGroup size="small" color="primary"
        value={state.achievement.difficulty ?? []}
        onChange={(_, val) => setAchievementFilter({ difficulty: val as DifficultyTier[] })}>
        {(['extreme', 'hard', 'moderate'] as DifficultyTier[]).map((t) => (
          <ToggleButton key={t} value={t}>{DIFFICULTY_LABEL[t][lang]}</ToggleButton>
        ))}
      </ToggleButtonGroup>

      <FormControlLabel
        control={<Switch checked={state.achievement.onlyDifficult}
          onChange={(e) => setAchievementFilter({ onlyDifficult: e.target.checked })} />}
        label={lang === 'zh' ? '⚠ 疑难高亮' : '⚠ Hard only'}
      />
    </Box>
  )
}
