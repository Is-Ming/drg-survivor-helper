// 成就筛选：19 类下拉 + 疑难高亮开关
import { Box, FormControl, InputLabel, MenuItem, Select, Switch, FormControlLabel, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_CATEGORY_LABEL, DIFFICULTY_LABEL } from '../../data/enums'
import type { Lang, SearchState, DifficultyTier } from '../../data/types'

export function AchievementFilters({
  state,
  setAchievementFilter,
  lang,
}: {
  state: SearchState
  setAchievementFilter: (patch: Partial<SearchState['achievement']>) => void
  lang: Lang
}) {
  return (
    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="ach-cat-label">{lang === 'zh' ? '分类' : 'Category'}</InputLabel>
        <Select
          labelId="ach-cat-label"
          label={lang === 'zh' ? '分类' : 'Category'}
          value={state.achievement.category ?? ''}
          onChange={(e) =>
            setAchievementFilter({ category: (e.target.value || undefined) as SearchState['achievement']['category'] })
          }
        >
          <MenuItem value="">{lang === 'zh' ? '全部' : 'All'}</MenuItem>
          {ACHIEVEMENT_CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>
              {ACHIEVEMENT_CATEGORY_LABEL[c][lang]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ToggleButtonGroup
        size="small"
        color="primary"
        value={state.achievement.difficulty ?? []}
        onChange={(_, val) => setAchievementFilter({ difficulty: val as DifficultyTier[] })}
        aria-label="difficulty-filter"
      >
        {(['extreme', 'hard', 'moderate'] as DifficultyTier[]).map((t) => (
          <ToggleButton key={t} value={t}>
            {DIFFICULTY_LABEL[t][lang]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <FormControlLabel
        control={
          <Switch
            checked={state.achievement.onlyDifficult}
            onChange={(e) => setAchievementFilter({ onlyDifficult: e.target.checked })}
          />
        }
        label={lang === 'zh' ? '⚠ 疑难高亮' : '⚠ Hard only'}
      />
    </Box>
  )
}
