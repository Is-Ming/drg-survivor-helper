// 武器筛选：职业 + 评级 + 标签多选（标签来自标签管理，实时联动）
import { Box, FormControl, InputLabel, MenuItem, Select, Chip, Autocomplete, TextField } from '@mui/material'
import { RATINGS, WEAPON_CLASSES, WEAPON_CLASS_LABEL, WEAPON_TAG_LABEL, WEAPON_TAG_GROUPS } from '../../data/enums'
import type { Lang, Rating, SearchState, WeaponClass, WeaponTag } from '../../data/types'
import { getWeaponTags, getWeaponTagLabel } from '../../hooks/useTagEditor'

export function WeaponFilters({
  state,
  setWeaponClass,
  setWeaponRating,
  addWeaponTag,
  removeWeaponTag,
  lang,
}: {
  state: SearchState
  setWeaponClass: (c?: WeaponClass) => void
  setWeaponRating: (r?: Rating) => void
  addWeaponTag: (tag: WeaponTag) => void
  removeWeaponTag: (tag: WeaponTag) => void
  lang: Lang
}) {
  // 从标签管理读取自定义武器标签列表（实时联动）
  const customTags = getWeaponTags()
  // 对自定义标签按已有分组归类（未匹配的归入其他）
  const groupedTags = WEAPON_TAG_GROUPS.map((g) => ({
    group: g.group,
    tags: g.tags.filter((t) => customTags.includes(t)),
  }))
  const otherTags = customTags.filter(
    (t) => !WEAPON_TAG_GROUPS.some((g) => g.tags.includes(t as WeaponTag))
  )
  if (otherTags.length > 0) {
    groupedTags.push({
      group: lang === 'zh' ? { zh: '其他', en: 'Other' } : { zh: '其他', en: 'Other' },
      tags: otherTags as WeaponTag[],
    })
  }

  const groupLabelOf = (tag: WeaponTag): string => {
    const g = groupedTags.find((grp) => grp.tags.includes(tag))
    return g ? g.group[lang] : ''
  }

  return (
    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="wp-cls-label">{lang === 'zh' ? '职业' : 'Class'}</InputLabel>
        <Select
          labelId="wp-cls-label"
          label={lang === 'zh' ? '职业' : 'Class'}
          value={state.weapon.class ?? ''}
          onChange={(e) => setWeaponClass((e.target.value || undefined) as WeaponClass | undefined)}
        >
          <MenuItem value="">{lang === 'zh' ? '全部' : 'All'}</MenuItem>
          {WEAPON_CLASSES.map((c) => (
            <MenuItem key={c} value={c}>
              {lang === 'zh' ? `${WEAPON_CLASS_LABEL[c].zh}(${WEAPON_CLASS_LABEL[c].en})` : WEAPON_CLASS_LABEL[c].en}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="wp-rate-label">{lang === 'zh' ? '评级' : 'Rating'}</InputLabel>
        <Select
          labelId="wp-rate-label"
          label={lang === 'zh' ? '评级' : 'Rating'}
          value={state.weapon.rating ?? ''}
          onChange={(e) => setWeaponRating((e.target.value || undefined) as Rating | undefined)}
        >
          <MenuItem value="">{lang === 'zh' ? '全部' : 'All'}</MenuItem>
          {RATINGS.map((r) => (
            <MenuItem key={r} value={r}>{r}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 标签多选（从标签管理读取） */}
      <Autocomplete
        multiple
        size="small"
        options={customTags as WeaponTag[]}
        value={state.weapon.tags}
        groupBy={(option) => groupLabelOf(option)}
        getOptionLabel={(option) => {
          const en = WEAPON_TAG_LABEL[option]?.en ?? option
          const zh = WEAPON_TAG_LABEL[option]?.zh ?? option
          return lang === 'zh' ? `${zh}(${en})` : en
        }}
        isOptionEqualToValue={(opt, val) => opt === val}
        onChange={(_e, value) => {
          const added = value.filter((t) => !state.weapon.tags.includes(t))
          const removed = state.weapon.tags.filter((t) => !value.includes(t))
          added.forEach((t) => addWeaponTag(t))
          removed.forEach((t) => removeWeaponTag(t))
        }}
        renderInput={(params) => (
          <TextField {...params} label={lang === 'zh' ? '标签' : 'Tags'} sx={{ minWidth: 220 }} />
        )}
        sx={{ minWidth: 220 }}
      />

      <Box display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
        {state.weapon.tags.map((tag) => (
          <Chip
            key={tag}
            size="small"
            label={getWeaponTagLabel(tag, lang)}
            color="primary"
            onDelete={() => removeWeaponTag(tag)}
          />
        ))}
      </Box>
    </Box>
  )
}
