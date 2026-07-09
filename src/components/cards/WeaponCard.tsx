// 武器卡片：评级徽章 + 黄/红超频(名+效果1:1配对) + 职业 chip + 官网标签 chip
// editable 模式：可增删超频引用 + 编辑评级
import { useState } from 'react'
import { Card, CardContent, Typography, Box, Chip, Popover, IconButton, Select, MenuItem, Button, FormControl } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { Lang, Rating, Weapon, WeaponTag } from '../../data/types'
import { WEAPON_CLASS_LABEL } from '../../data/enums'
import { getClassByEnglishName } from '../../data/classes'
import { weapons } from '../../data/weapons'
import { overclocks } from '../../data/overclocks'
import { RatingBadge } from '../badges/RatingBadge'
import { TagChip } from '../badges/TagChip'
import { useWeaponOverclockEditor } from '../../hooks/useWeaponOverclockEditor'

const RATING_STORAGE_PREFIX = 'drg-wpn-rating-'

function getRating(englishName: string, defaultRating: Rating): Rating {
  try {
    return (localStorage.getItem(RATING_STORAGE_PREFIX + englishName) as Rating) || defaultRating
  } catch { return defaultRating }
}

function setRating(englishName: string, rating: Rating): void {
  try { localStorage.setItem(RATING_STORAGE_PREFIX + englishName, rating) } catch { /* ignore */ }
}

export function WeaponCard({
  weapon,
  selectedTags,
  onTagClick,
  lang,
  getOverclockName,
  getOverclockEffect,
  editable,
}: {
  weapon: Weapon
  selectedTags: WeaponTag[]
  onTagClick?: (tag: WeaponTag) => void
  lang: Lang
  getOverclockName?: (id: string) => string
  getOverclockEffect?: (id: string) => string
  editable?: boolean
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [addType, setAddType] = useState<'yellow' | 'red' | null>(null)
  const [selectedOcId, setSelectedOcId] = useState('')
  const [currentRating, setCurrentRating] = useState<Rating>(getRating(weapon.englishName, weapon.rating))
  const open = Boolean(anchorEl)
  const gameClass = getClassByEnglishName(weapon.class)
  const ocEditor = useWeaponOverclockEditor()

  // 使用自定义或默认超频ID列表
  const yellowIds = ocEditor.getWeaponOverclockIds(weapon.englishName, 'yellow')
  const redIds = ocEditor.getWeaponOverclockIds(weapon.englishName, 'red')

  // 可用超频（未被当前武器使用的）
  const availableYellow = overclocks
    .filter((oc) => oc.type === 'balanced' && !yellowIds.includes(oc.id))
    .map((oc) => ({ id: oc.id, name: getOverclockName ? getOverclockName(oc.id) : oc.id }))
  const availableRed = overclocks
    .filter((oc) => oc.type === 'unstable' && !redIds.includes(oc.id))
    .map((oc) => ({ id: oc.id, name: getOverclockName ? getOverclockName(oc.id) : oc.id }))

  const handleAdd = () => {
    if (!addType || !selectedOcId) return
    ocEditor.addOverclock(weapon.englishName, addType, selectedOcId)
    setAddType(null)
    setSelectedOcId('')
  }

  const handleRatingChange = (r: Rating) => {
    setRating(weapon.englishName, r)
    setCurrentRating(r)
  }

  const classLabel =
    lang === 'zh'
      ? `${WEAPON_CLASS_LABEL[weapon.class].zh}(${WEAPON_CLASS_LABEL[weapon.class].en})`
      : WEAPON_CLASS_LABEL[weapon.class].en

  const resolveStartWeapon = (startWeapon?: string): string => {
    if (!startWeapon) return ''
    const w = weapons.find((item) => item.englishName === startWeapon)
    if (!w) return startWeapon
    return lang === 'zh' ? w.chineseName : w.englishName
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Box minWidth={0}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {lang === 'zh' ? weapon.chineseName : weapon.englishName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {lang === 'zh' ? weapon.englishName : weapon.chineseName}
            </Typography>
          </Box>
          {editable ? (
            <FormControl size="small" sx={{ minWidth: 60 }}>
              <Select
                value={currentRating}
                onChange={(e) => handleRatingChange(e.target.value as Rating)}
                variant="standard"
              >
                {(['S', 'A', 'B', 'C', '-'] as Rating[]).map((r) => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <RatingBadge rating={currentRating} lang={lang} />
          )}
        </Box>

        <Box mt={1} mb={1} display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
          <Chip
            size="small"
            label={classLabel}
            color="primary"
            variant="outlined"
            clickable
            onClick={(e) => setAnchorEl(e.currentTarget)}
            aria-label="class-mod-popover-trigger"
          />
          {weapon.tags.map((tag) => (
            <TagChip
              key={tag}
              tag={tag}
              lang={lang}
              active={selectedTags.includes(tag)}
              onClick={onTagClick ? () => onTagClick(tag) : undefined}
            />
          ))}
        </Box>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Box sx={{ p: 1.5, maxWidth: 300 }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              {lang === 'zh'
                ? `${WEAPON_CLASS_LABEL[weapon.class].zh} · 小职业`
                : `${WEAPON_CLASS_LABEL[weapon.class].en} · Class Mods`}
            </Typography>
            {gameClass?.subclasses.map((sub) => (
              <Box key={sub.englishName} sx={{ mb: 1 }}>
                <Typography variant="body2" fontWeight={700}>
                  {lang === 'zh'
                    ? `${sub.chineseName}(${sub.englishName})`
                    : `${sub.englishName}`}
                </Typography>
                {sub.desc && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    {sub.desc}
                  </Typography>
                )}
                {sub.startWeapon && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    {lang === 'zh' ? '起始武器' : 'Start weapon'}：{resolveStartWeapon(sub.startWeapon)}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Popover>

        {/* 黄色超频 · 平衡 — 名字不换行，效果正常换行 */}
        {yellowIds.length > 0 ? (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              {lang === 'zh' ? '黄色超频 · 平衡 (6/12级)' : 'Yellow OC · Balanced (Lv6/12)'}
            </Typography>
            {yellowIds.map((id, i) => {
              const name = getOverclockName ? getOverclockName(id) : id
              const effects = weapon.yellowOverclock.split('；')
              const eff = getOverclockEffect ? getOverclockEffect(id) : (effects[i] ?? '')
              return (
                <Typography key={id} variant="body2" sx={{ mb: 0.3, display: 'flex', alignItems: 'flex-start' }}>
                  {editable && (
                    <IconButton
                      size="small"
                      sx={{ mr: 0.5, mt: '-2px', color: 'error.light' }}
                      onClick={() => ocEditor.removeOverclock(weapon.englishName, 'yellow', id)}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  )}
                  <Box component="span" fontWeight={600} color="warning.main" sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}>{name}</Box>
                  <Box component="span" sx={{ mx: 0.5, flexShrink: 0 }}>{lang === 'zh' ? '：' : ': '}</Box>
                  <Box component="span" sx={{ wordBreak: 'break-word' }}>{eff}</Box>
                </Typography>
              )
            })}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mt: 1, mb: 1, color: 'text.secondary' }}>
            {weapon.yellowOverclock}
          </Typography>
        )}

        {/* 红色超频 · 不稳定 */}
        {redIds.length > 0 ? (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              {lang === 'zh' ? '红色超频 · 不稳定 (18级)' : 'Red OC · Unstable (Lv18)'}
            </Typography>
            {redIds.map((id, i) => {
              const name = getOverclockName ? getOverclockName(id) : id
              const effects = weapon.redOverclock.split('；')
              const eff = getOverclockEffect ? getOverclockEffect(id) : (effects[i] ?? '')
              return (
                <Typography key={id} variant="body2" sx={{ mb: 0.3, display: 'flex', alignItems: 'flex-start' }}>
                  {editable && (
                    <IconButton
                      size="small"
                      sx={{ mr: 0.5, mt: '-2px', color: 'error.light' }}
                      onClick={() => ocEditor.removeOverclock(weapon.englishName, 'red', id)}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  )}
                  <Box component="span" fontWeight={600} color="error.main" sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}>{name}</Box>
                  <Box component="span" sx={{ mx: 0.5, flexShrink: 0 }}>{lang === 'zh' ? '：' : ': '}</Box>
                  <Box component="span" sx={{ wordBreak: 'break-word' }}>{eff}</Box>
                </Typography>
              )
            })}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            {weapon.redOverclock}
          </Typography>
        )}

        {/* 管理模式下：增删超频 */}
        {editable && (
          <Box sx={{ mt: 1.5, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={addType ?? ''}
                displayEmpty
                onChange={(e) => { setAddType(e.target.value as 'yellow' | 'red'); setSelectedOcId('') }}
              >
                <MenuItem value="" disabled>
                  {lang === 'zh' ? '选择类型' : 'Select type'}
                </MenuItem>
                <MenuItem value="yellow">
                  {lang === 'zh' ? '+ 黄色超频' : '+ Yellow OC'}
                </MenuItem>
                <MenuItem value="red">
                  {lang === 'zh' ? '+ 红色超频' : '+ Red OC'}
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select
                value={selectedOcId}
                displayEmpty
                onChange={(e) => setSelectedOcId(e.target.value)}
                disabled={!addType}
              >
                <MenuItem value="" disabled>
                  {lang === 'zh' ? '选择超频' : 'Select overclock'}
                </MenuItem>
                {(addType === 'yellow' ? availableYellow : addType === 'red' ? availableRed : []).map((oc) => (
                  <MenuItem key={oc.id} value={oc.id}>
                    {oc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              size="small"
              variant="contained"
              disabled={!addType || !selectedOcId}
              onClick={handleAdd}
            >
              {lang === 'zh' ? '添加' : 'Add'}
            </Button>
          </Box>
        )}

        {weapon.version !== '当前' && (
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.6 }}>
            ⚠ {weapon.version}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
