// 超频反查卡片（只读）：图标 + 中/英文名 + 类型 + 效果 + 拥有该超频的武器列表
import { useState } from 'react'
import { CardContent, Typography, Box, Chip, Collapse, IconButton } from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { Overclock } from '../../data/types'
import { OVERCLOCK_ICON_MAP } from '../../data/icon-map'
import { useLang } from '../../i18n/LangContext'
import { CutCard } from '../ui/CutCard'
import { Highlight } from '../ui/Highlight'

export function OverclockLookupCard({
  oc,
  owningWeapons,
  query,
}: {
  oc: Overclock
  owningWeapons: string[]
  query?: string
}) {
  const { lang, t } = useLang()
  const [expanded, setExpanded] = useState(false)
  const iconPath = oc.englishName ? OVERCLOCK_ICON_MAP[oc.englishName] : undefined
  const iconUrl = iconPath ? import.meta.env.BASE_URL.replace(/\/$/, '') + iconPath : undefined

  return (
    <CutCard accent={oc.type === 'balanced' ? '#ffcf4d' : '#ff6a5a'}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Box display="flex" gap={1} minWidth={0} flexGrow={1} alignItems="center">
            {iconUrl && (
              <Box
                component="img"
                src={iconUrl}
                alt={oc.englishName}
                sx={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }}
              />
            )}
            <Box minWidth={0} flexGrow={1}>
              <Typography variant="subtitle2" fontWeight={700} noWrap>
                <Highlight text={oc.chineseName} query={query} />
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                <Highlight text={oc.englishName} query={query} />
              </Typography>
            </Box>
          </Box>
          <Chip
            size="small"
            label={oc.type === 'balanced' ? (lang === 'zh' ? '平衡' : 'Balanced') : (lang === 'zh' ? '不稳定' : 'Unstable')}
            color={oc.type === 'balanced' ? 'warning' : 'error'}
            variant="outlined"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <Highlight text={oc.effect} query={query} />
        </Typography>

        <Box mt={1} mb={0.5} display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            {t('overclock.owningWeapons')}（{owningWeapons.length}）
          </Typography>
          {owningWeapons.length > 0 && (
            <IconButton size="small" onClick={() => setExpanded((e) => !e)} sx={{ p: 0.25 }}>
              {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
          )}
        </Box>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
            {owningWeapons.map((w) => (
              <Chip key={w} size="small" label={w} variant="outlined" />
            ))}
          </Box>
        </Collapse>
        {owningWeapons.length === 0 && (
          <Typography variant="caption" color="text.secondary">
            {t('overclock.none')}
          </Typography>
        )}
      </CardContent>
    </CutCard>
  )
}
