// 装备卡片：双语展示（中英文切换）
import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import type { Equipment, Lang } from '../../data/types'

const TYPE_EN: Record<string, string> = {
  '发育': 'Development',
  '拾取': 'Pickup',
  '生存': 'Survival',
  '经验': 'Experience',
  '武器': 'Weapon',
  '直伤/混伤': 'Direct/Hybrid Dmg',
  '战力': 'Combat Power',
  '生存/升级': 'Survival/Level Up',
  '直伤核心': 'Direct Dmg Core',
  '闪避': 'Dodge',
  '暴击': 'Critical',
  '召唤': 'Summon',
}

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
  const displayName = lang === 'en' && equip.officialName ? equip.officialName : equip.name
  const displayType = lang === 'en' ? (TYPE_EN[equip.type] ?? equip.type) : equip.type
  const sourceLabel = isUnlock
    ? (lang === 'zh' ? '成就解锁' : 'Unlock')
    : (lang === 'zh' ? '局内附加' : 'In-run')
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>
          {displayName}
        </Typography>

        <Box mt={1} mb={1} display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
          <Chip
            size="small"
            label={displayType}
            color="primary"
            variant="outlined"
            clickable={!!onTypeClick}
            onClick={onTypeClick}
          />
          <Chip
            size="small"
            label={sourceLabel}
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
