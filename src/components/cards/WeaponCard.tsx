// 武器卡片：评级徽章 + 黄/红超频(名+可展开效果) + 职业 chip + 官网标签 chip
import { useState } from 'react'
import { Card, CardContent, Typography, Box, Chip, Popover, Collapse, IconButton } from '@mui/material'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
import type { Lang, Weapon, WeaponTag } from '../../data/types'
import { WEAPON_CLASS_LABEL } from '../../data/enums'
import { getClassByEnglishName } from '../../data/classes'
import { weapons } from '../../data/weapons'
import { RatingBadge } from '../badges/RatingBadge'
import { TagChip } from '../badges/TagChip'

export function WeaponCard({
  weapon,
  selectedTags,
  onTagClick,
  lang,
}: {
  weapon: Weapon
  selectedTags: WeaponTag[]
  onTagClick?: (tag: WeaponTag) => void
  lang: Lang
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [yellowOpen, setYellowOpen] = useState(false)
  const [redOpen, setRedOpen] = useState(false)
  const open = Boolean(anchorEl)
  const gameClass = getClassByEnglishName(weapon.class)

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
          <RatingBadge rating={weapon.rating} lang={lang} />
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

        {/* 黄色超频 · 平衡 */}
        <Box sx={{ mt: 1 }}>
          <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => setYellowOpen(!yellowOpen)}>
            <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
              {lang === 'zh' ? '黄色超频 · 平衡 (6/12级)' : 'Yellow OC · Balanced (Lv6/12)'}
            </Typography>
            {weapon.yellowOverclockNames && weapon.yellowOverclockNames.length > 0 && weapon.yellowOverclock ? (
              <IconButton size="small">
                {yellowOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </IconButton>
            ) : null}
          </Box>
          {weapon.yellowOverclockNames && weapon.yellowOverclockNames.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
              {weapon.yellowOverclockNames.map((n) => (
                <Chip key={n} size="small" label={n} color="warning" variant="outlined" />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              {weapon.yellowOverclock}
            </Typography>
          )}
          {weapon.yellowOverclockNames && weapon.yellowOverclockNames.length > 0 && (
            <Collapse in={yellowOpen}>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: 'text.secondary', whiteSpace: 'pre-line' }}
              >
                {weapon.yellowOverclock.split('；').join('\n')}
              </Typography>
            </Collapse>
          )}
        </Box>

        {/* 红色超频 · 不稳定 */}
        <Box sx={{ mt: 1 }}>
          <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => setRedOpen(!redOpen)}>
            <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
              {lang === 'zh' ? '红色超频 · 不稳定 (18级)' : 'Red OC · Unstable (Lv18)'}
            </Typography>
            {weapon.redOverclockNames && weapon.redOverclockNames.length > 0 && weapon.redOverclock ? (
              <IconButton size="small">
                {redOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </IconButton>
            ) : null}
          </Box>
          {weapon.redOverclockNames && weapon.redOverclockNames.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
              {weapon.redOverclockNames.map((n) => (
                <Chip key={n} size="small" label={n} color="error" variant="outlined" />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {weapon.redOverclock}
            </Typography>
          )}
          {weapon.redOverclockNames && weapon.redOverclockNames.length > 0 && (
            <Collapse in={redOpen}>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}
              >
                {weapon.redOverclock.split('；').join('\n')}
              </Typography>
            </Collapse>
          )}
        </Box>

        {weapon.version !== '当前' && (
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.6 }}>
            ⚠ {weapon.version}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
