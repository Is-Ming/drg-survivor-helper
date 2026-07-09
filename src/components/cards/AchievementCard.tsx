// 成就卡片：中/英文名 + 分类 + 解锁条件 + 生物群系档位 + 疑难分档徽标
import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import type { Achievement, Lang } from '../../data/types'
import { getDifficultyTier, ACHIEVEMENT_CATEGORY_LABEL } from '../../data/enums'
import { DifficultyBadge } from '../badges/DifficultyBadge'

export function AchievementCard({
  ach,
  highlight,
  lang,
}: {
  ach: Achievement
  highlight: boolean
  lang: Lang
}) {
  const tier = getDifficultyTier(ach.completionRate)
  const borderColor =
    highlight && tier
      ? tier === 'extreme'
        ? 'rgba(255,23,68,0.9)'
        : tier === 'hard'
          ? 'rgba(255,145,0,0.7)'
          : 'rgba(144,164,174,0.5)'
      : undefined

  return (
    <Card sx={{ borderColor, borderWidth: highlight && tier ? 2 : 1, height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Box minWidth={0}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {lang === 'zh' ? ach.chineseName : ach.englishName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {lang === 'zh' ? ach.englishName : ach.chineseName}
            </Typography>
          </Box>
          <Box flexShrink={0}>
            <DifficultyBadge rate={ach.completionRate} show={highlight} lang={lang} />
          </Box>
        </Box>

        <Box mt={1} mb={1}>
          <Chip size="small" label={ACHIEVEMENT_CATEGORY_LABEL[ach.category]?.[lang] ?? ach.category} variant="outlined" />
          {ach.biomeTier && (
            <Chip
              size="small"
              label={ach.biomeTier}
              color="secondary"
              variant="outlined"
              sx={{ ml: 0.5 }}
            />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary">
          {ach.unlockCondition}
        </Typography>

        {ach.version !== '当前' && (
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.6 }}>
            ⚠ {ach.version}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
