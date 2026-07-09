// 装备卡片：类型/来源 chip + 关联成就 + 官网/攻略双区块 + 管理编辑
import { useState } from 'react'
import { Card, CardContent, Typography, Box, Chip, TextField, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import type { Equipment, Lang } from '../../data/types'
import { EQUIPMENT_SOURCE_LABEL } from '../../data/enums'
import { getEquipmentTypes } from '../../hooks/useTagEditor'
import { TagPickerDialog } from '../TagPickerDialog'

export function EquipmentCard({
  equip,
  onTypeClick,
  lang,
  editable,
}: {
  equip: Equipment
  onTypeClick?: () => void
  lang: Lang
  editable?: boolean
}) {
  const isUnlock = equip.source === '成就解锁'
  const [, forceUpdate] = useState(0)

  const sourceLabel = EQUIPMENT_SOURCE_LABEL[equip.source]?.[lang] ?? equip.source

  // 可编辑字段的状态
  const storageKey = `drg-eqp-edit-${equip.name}`

  const getSaved = (field: string, fallback: string): string => {
    try {
      const s = JSON.parse(localStorage.getItem(storageKey) || '{}')
      return s[field] ?? fallback
    } catch { return fallback }
  }

  const doSave = (field: string, value: string) => {
    try {
      const s = JSON.parse(localStorage.getItem(storageKey) || '{}')
      s[field] = value
      localStorage.setItem(storageKey, JSON.stringify(s))
      forceUpdate((n) => n + 1)
    } catch { /* ignore */ }
  }

  const [typePickerOpen, setTypePickerOpen] = useState(false)
  const allEqTypes = getEquipmentTypes()

  const eqTypeLabel = allEqTypes.includes(equip.type)
    ? (lang === 'zh' ? equip.type : ({
        '生存': 'Survival', '发育': 'Development', '战力': 'Combat Power',
        '拾取': 'Loot', '经验': 'XP', '武器': 'Weapon', '直伤/混伤': 'Raw/Hybrid',
        '生存/升级': 'Survival/Level', '直伤核心': 'Raw Core', '闪避': 'Dodge',
        '暴击': 'Crit', '召唤': 'Summon',
      }[equip.type] ?? equip.type))
    : equip.type

  const handleTypeChange = (newType: string) => {
    doSave('type', newType)
    forceUpdate((n) => n + 1)
  }

  return (
    <Card
      sx={{
        height: '100%',
        borderLeft: equip.officialName ? '4px solid' : undefined,
        borderLeftColor: 'info.main',
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <EditableField
            value={getSaved('name', equip.name)}
            onSave={(v) => doSave('name', v)}
            editable={editable}
            variant="subtitle1"
            fontWeight={700}
          />
          <Box display="flex" gap={0.5} alignItems="center">
            {editable ? (
              <>
                <Chip size="small" label={eqTypeLabel} clickable onClick={() => setTypePickerOpen(true)}
                  sx={{ cursor: 'pointer', '&:hover': { borderColor: 'primary.main' } }} />
                <IconButton size="small" color="primary" onClick={() => setTypePickerOpen(true)}
                  sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, width: 28, height: 28 }}>
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </>
            ) : (
              <Chip size="small" label={eqTypeLabel} clickable={!!onTypeClick} onClick={onTypeClick} />
            )}
            <Chip
              size="small"
              label={sourceLabel}
              variant="outlined"
            />
          </Box>
        </Box>

        {/* 官网描述区块（蓝色） */}
        {equip.officialName && (
          <Box
            sx={{
              mt: 1.5,
              p: 1,
              bgcolor: 'info.dark',
              borderRadius: 1,
              borderLeft: 3,
              borderColor: 'info.light',
            }}
          >
            <Typography variant="caption" color="info.light" fontWeight={700}>
              {lang === 'zh' ? '📖 官网' : '📖 Official'}
            </Typography>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 0.3 }}>
              <EditableField
                value={getSaved('officialName', equip.officialName)}
                onSave={(v) => doSave('officialName', v)}
                editable={editable}
                variant="subtitle2"
                fontWeight={600}
              />
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.3, opacity: 0.9 }}>
              <EditableField
                value={getSaved('officialEffect', equip.officialEffect ?? '')}
                onSave={(v) => doSave('officialEffect', v)}
                editable={editable}
                variant="body2"
              />
            </Typography>
            {equip.officialName?.includes('待核') && (
              <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.6 }}>
                ⚠ {lang === 'zh' ? '待核：官方无确切对应的 Artifact 名称' : 'Unverified: no exact Artifact match'}
              </Typography>
            )}
          </Box>
        )}

        {/* 攻略描述区块（橙色） */}
        <Box
          sx={{
            mt: 1,
            p: 1,
            bgcolor: 'warning.dark',
            borderRadius: 1,
            borderLeft: 3,
            borderColor: 'warning.light',
          }}
        >
          <Typography variant="caption" color="warning.light" fontWeight={700}>
            {lang === 'zh' ? '📝 攻略' : '📝 Guide'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.3, opacity: 0.9 }}>
            <EditableField
              value={getSaved('effect', equip.effect)}
              onSave={(v) => doSave('effect', v)}
              editable={editable}
              variant="body2"
            />
          </Typography>
        </Box>

        {isUnlock && equip.relatedAchievement && (
          <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.6 }}>
            {lang === 'zh' ? `关联成就：${equip.relatedAchievement}` : `Achievement: ${equip.relatedAchievement}`}
          </Typography>
        )}

        {equip.version !== '当前' && (
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.6 }}>
            ⚠ {equip.version}
          </Typography>
        )}
      </CardContent>

      <TagPickerDialog
        open={typePickerOpen}
        onClose={() => setTypePickerOpen(false)}
        title={lang === 'zh' ? '选择装备类型' : 'Select Type'}
        availableTags={allEqTypes}
        selectedTags={[equip.type]}
        onToggle={(tag) => {
          handleTypeChange(tag)
          setTypePickerOpen(false)
        }}
        getLabel={(tag) => tag}
        lang={lang}
      />
    </Card>
  )
}

/** 可编辑文本：点击切换为输入框，Enter保存 */
function EditableField({
  value,
  onSave,
  editable,
  variant,
  fontWeight,
}: {
  value: string
  onSave: (v: string) => void
  editable?: boolean
  variant: 'subtitle1' | 'subtitle2' | 'body2'
  fontWeight?: number
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  if (!editable) {
    return (
      <Typography variant={variant} fontWeight={fontWeight}>
        {value}
      </Typography>
    )
  }

  if (editing) {
    return (
      <TextField
        size="small"
        fullWidth
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { onSave(draft); setEditing(false) }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { onSave(draft); setEditing(false) }
          if (e.key === 'Escape') { setDraft(value); setEditing(false) }
        }}
        autoFocus
        variant="standard"
      />
    )
  }

  return (
    <Typography
      variant={variant}
      fontWeight={fontWeight}
      onClick={() => { setDraft(value); setEditing(true) }}
      sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline', textDecorationColor: 'primary.main' } }}
    >
      {value}
    </Typography>
  )
}
