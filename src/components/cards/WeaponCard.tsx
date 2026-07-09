// 武器卡片：评级徽章 + 黄/红超频(名+效果1:1配对) + 职业 chip + 官网标签 chip
import { useState } from 'react'
import { Card, CardContent, Typography, Box, Chip, Popover } from '@mui/material'
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
  getOverclockName,
  getOverclockEffect,
}: {
  weapon: Weapon
  selectedTags: WeaponTag[]
  onTagClick?: (tag: WeaponTag) => void
  lang: Lang
  getOverclockName?: (id: string) => string
  getOverclockEffect?: (id: string) => string
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
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

        {/* 黄色超频 · 平衡 — 1:1 显示 */}
        {weapon.yellowOverclockIds && weapon.yellowOverclockIds.length > 0 ? (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              {lang === 'zh' ? '黄色超频 · 平衡 (6/12级)' : 'Yellow OC · Balanced (Lv6/12)'}
            </Typography>
            {weapon.yellowOverclockIds.map((id, i) => {
              const name = getOverclockName ? getOverclockName(id) : id
              const effects = weapon.yellowOverclock.split('；')
              const eff = getOverclockEffect ? getOverclockEffect(id) : (effects[i] ?? '')
              return (
                <Typography key={id} variant="body2" sx={{ mb: 0.3 }}>
                  <Box component="span" fontWeight={600} color="warning.main">{name}</Box>
                  {lang === 'zh' ? '：' : ': '}{eff}
                </Typography>
              )
            })}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mt: 1, mb: 1, color: 'text.secondary' }}>
            {weapon.yellowOverclock}
          </Typography>
        )}

        {/* 红色超频 · 不稳定 — 1:1 显示 */}
        {weapon.redOverclockIds && weapon.redOverclockIds.length > 0 ? (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              {lang === 'zh' ? '红色超频 · 不稳定 (18级)' : 'Red OC · Unstable (Lv18)'}
            </Typography>
            {weapon.redOverclockIds.map((id, i) => {
              const name = getOverclockName ? getOverclockName(id) : id
              const effects = weapon.redOverclock.split('；')
              const eff = getOverclockEffect ? getOverclockEffect(id) : (effects[i] ?? '')
              return (
                <Typography key={id} variant="body2" sx={{ mb: 0.3 }}>
                  <Box component="span" fontWeight={600} color="error.main">{name}</Box>
                  {lang === 'zh' ? '：' : ': '}{eff}
                </Typography>
              )
            })}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            {weapon.redOverclock}
          </Typography>
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
