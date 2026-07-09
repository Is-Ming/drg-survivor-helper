// 成就筛选：分类下拉（支持自定义）+ 难度三档 + 疑难高亮开关
import { Box, FormControl, InputLabel, MenuItem, Select, Switch, FormControlLabel, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { ACHIEVEMENT_CATEGORY_LABEL, DIFFICULTY_LABEL } from '../../data/enums'
import type { Lang, SearchState, DifficultyTier } from '../../data/types'
import { getAchievementCategories } from '../../hooks/useTagEditor'

export function AchievementFilters({
  state,
  setAchievementFilter,
  lang,
}: {
  state: SearchState
  setAchievementFilter: (patch: Partial<SearchState['achievement']>) => void
  lang: Lang
}) {
  // 从标签管理读取自定义分类（实时生效）
  const categories = getAchievementCategories()

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
          {categories.map((c) => (
            <MenuItem key={c} value={c}>
              {ACHIEVEMENT_CATEGORY_LABEL[c as keyof typeof ACHIEVEMENT_CATEGORY_LABEL]?.[lang] ?? c}
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
