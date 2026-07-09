// 成就卡片：中/英文名 + 分类 + 解锁条件 + 生物群系档位 + 疑难分档徽标（支持管理页编辑）
import { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Box, Chip, TextField } from '@mui/material'
import type { Achievement, Lang } from '../../data/types'
import { getDifficultyTier, ACHIEVEMENT_CATEGORY_LABEL } from '../../data/enums'
import { DifficultyBadge } from '../badges/DifficultyBadge'

export function AchievementCard({
  ach,
  highlight,
  lang,
  editable,
  onSave,
}: {
  ach: Achievement
  highlight: boolean
  lang: Lang
  editable?: boolean
  onSave?: (patch: Record<string, string>) => void
}) {
  const [editName, setEditName] = useState('')
  const [editCondition, setEditCondition] = useState('')
  const [editingField, setEditingField] = useState<string | null>(null)

  // 从 localStorage 加载已保存的编辑
  const storageKey = `drg-ach-edit-${ach.englishName}`

  const loadSaved = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}')
      if (saved.chineseName) setEditName(saved.chineseName)
      else setEditName(ach.chineseName)
      if (saved.unlockCondition) setEditCondition(saved.unlockCondition)
      else setEditCondition(ach.unlockCondition)
    } catch {
      setEditName(ach.chineseName)
      setEditCondition(ach.unlockCondition)
    }
  }

  useEffect(() => {
    if (editable) loadSaved()
  }, [editable, ach.englishName])

  const displayName = editable ? editName || ach.chineseName : ach.chineseName
  const displayCondition = editable ? editCondition || ach.unlockCondition : ach.unlockCondition
  const tier = getDifficultyTier(ach.completionRate)
  const borderColor =
    highlight && tier
      ? tier === 'extreme'
        ? 'rgba(255,23,68,0.9)'
        : tier === 'hard'
          ? 'rgba(255,145,0,0.7)'
          : 'rgba(144,164,174,0.5)'
      : undefined

  const commitEdit = (field: string, value: string) => {
    setEditingField(null)
    if (onSave) onSave({ [field]: value })
  }

  return (
    <Card sx={{ borderColor, borderWidth: highlight && tier ? 2 : 1, height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Box minWidth={0} flex={1}>
            {editable && editingField === 'name' ? (
              <TextField
                size="small"
                fullWidth
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => commitEdit('chineseName', editName)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitEdit('chineseName', editName)
                  if (e.key === 'Escape') { setEditName(ach.chineseName); setEditingField(null) }
                }}
                autoFocus
                sx={{ mb: 0.5 }}
              />
            ) : (
              <Typography
                variant="subtitle1"
                fontWeight={700}
                noWrap
                onClick={() => editable && setEditingField('name')}
                sx={editable ? { cursor: 'pointer', '&:hover': { textDecoration: 'underline', textDecorationColor: 'primary.main' } } : undefined}
                title={editable ? (lang === 'zh' ? '点击编辑名称' : 'Click to edit name') : undefined}
              >
                {lang === 'zh' ? displayName : ach.englishName}
              </Typography>
            )}
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

        {editable && editingField === 'condition' ? (
          <TextField
            size="small"
            fullWidth
            multiline
            maxRows={3}
            value={editCondition}
            onChange={(e) => setEditCondition(e.target.value)}
            onBlur={() => commitEdit('unlockCondition', editCondition)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) commitEdit('unlockCondition', editCondition)
              if (e.key === 'Escape') { setEditCondition(ach.unlockCondition); setEditingField(null) }
            }}
            autoFocus
          />
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            onClick={() => editable && setEditingField('condition')}
            sx={editable ? { cursor: 'pointer', '&:hover': { textDecoration: 'underline', textDecorationColor: 'primary.main' } } : undefined}
            title={editable ? (lang === 'zh' ? '点击编辑解锁条件' : 'Click to edit unlock condition') : undefined}
          >
            {displayCondition}
          </Typography>
        )}

        {ach.version !== '当前' && (
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.6 }}>
            ⚠ {ach.version}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
