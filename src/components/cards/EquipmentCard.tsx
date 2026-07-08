// 装备卡片：类型/来源 chip + 关联成就（决策 6：装备仅中文展示）
import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import type { Equipment, Lang } from '../../data/types'

export function EquipmentCard({
  equip,
  onTypeClick,
  lang,
}: {
  equip: Equipment
  onTypeClick?: () => void
  lang: Lang
}) {
  const isUnlock = equip.source === '成就解锁'
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>
          {equip.name}
        </Typography>

        <Box mt={1} mb={1} display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
          <Chip
            size="small"
            label={equip.type}
            color="primary"
            variant="outlined"
            clickable={!!onTypeClick}
            onClick={onTypeClick}
          />
          <Chip
            size="small"
            label={isUnlock ? '成就解锁' : '局内附加'}
            color={isUnlock ? 'warning' : 'default'}
            variant="outlined"
          />
        </Box>

        {equip.officialName || equip.officialEffect ? (
          <Box sx={{ borderLeft: '3px solid', borderColor: 'info.main', pl: 1, mb: 1 }}>
            <Typography variant="caption" color="info.main" display="block" fontWeight={700}>
              {lang === 'zh' ? '官网' : 'Official'}
              {equip.officialName ? ` · ${equip.officialName}` : ''}
            </Typography>
            <Typography variant="body2">{equip.officialEffect ?? '—'}</Typography>
          </Box>
        ) : null}

        <Box sx={{ borderLeft: '3px solid', borderColor: 'warning.main', pl: 1, mb: 1 }}>
          <Typography variant="caption" color="warning.main" display="block" fontWeight={700}>
            {lang === 'zh' ? '攻略' : 'Guide'}
          </Typography>
          <Typography variant="body2">{equip.effect}</Typography>
        </Box>

        {equip.relatedAchievement && (
          <Typography variant="caption" color="text.secondary" display="block">
            关联成就：{equip.relatedAchievement}
          </Typography>
        )}

        {equip.version !== '当前' && (
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.6 }}>
            ⚠ {equip.version}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
