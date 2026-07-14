// 装备卡片：类型/来源 chip + 关联成就 + 官网/攻略双区块 + 管理编辑 + 卡片标签
import { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Box, Chip, TextField, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import type { Equipment, Lang } from '../../data/types'
import { EQUIPMENT_SOURCE_LABEL } from '../../data/enums'
import { useTagEditor } from '../../hooks/useTagEditor'
import { useOverrides } from '../../hooks/useOverrides'
import { TagPickerDialog } from '../TagPickerDialog'
import { RemovableChip } from '../RemovableChip'

function eqTypeLabel(type: string, lang: Lang): string {
  if (lang === 'zh') return type
  const map: Record<string, string> = {
    '生存': 'Survival', '发育': 'Development', '战力': 'Combat Power',
    '拾取': 'Loot', '经验': 'XP', '武器': 'Weapon', '直伤/混伤': 'Raw/Hybrid',
    '生存/升级': 'Survival/Level', '直伤核心': 'Raw Core', '闪避': 'Dodge',
    '暴击': 'Crit', '召唤': 'Summon',
  }
  return map[type] ?? type
}

/** 归一化装备类型为字符串数组（单值/多值/空均兼容） */
function normalizeType(t: string | string[] | undefined, fallback: string): string[] {
  if (Array.isArray(t)) {
    const filtered = t.filter((x): x is string => typeof x === 'string' && x.length > 0)
    if (filtered.length > 0) return filtered
  } else if (typeof t === 'string' && t) {
    return [t]
  }
  return fallback ? [fallback] : []
}

export function EquipmentCard({
  equip,
  onTypeClick,
  lang,
  editable,
}: {
  equip: Equipment
  onTypeClick?: (type: string) => void
  lang: Lang
  editable?: boolean
}) {
  const isUnlock = equip.source === '成就解锁'
  const { merged, saveEquipmentEdit, saveCardTags } = useOverrides()
  const editor = useTagEditor()

  const sourceLabel = EQUIPMENT_SOURCE_LABEL[equip.source]?.[lang] ?? equip.source

  // 已合并的装备记录（override 优先），用于读取字段/类型
  const mergedEquip = merged?.equipments?.find((e) => e.name === equip.name)

  // 字段读取：merged 优先，回落 equip（已合并）字段
  const getSaved = (field: 'name' | 'officialName' | 'officialEffect' | 'effect'): string => {
    const v = mergedEquip?.[field]
    return typeof v === 'string' && v ? v : ((equip[field] as string) ?? '')
  }

  const doSave = (field: 'name' | 'officialName' | 'officialEffect' | 'effect', value: string) => {
    const patch: Partial<Equipment> = {}
    patch[field] = value
    saveEquipmentEdit(equip.name, patch)
  }

  const [typePickerOpen, setTypePickerOpen] = useState(false)
  const allEqTypes = editor.getTypes()
  // 类型显示：优先读取 merged.equipments[name].type（多值数组），回落硬编码单值
  const [currentTypes, setCurrentTypes] = useState<string[]>(() => {
    const t = mergedEquip?.type
    const fb = Array.isArray(equip.type) ? (equip.type[0] ?? '') : equip.type
    return normalizeType(t, fb)
  })

  // 与服务端合并值保持同步
  useEffect(() => {
    const t = mergedEquip?.type
    if (t !== undefined) setCurrentTypes(normalizeType(t, ''))
  }, [mergedEquip])

  const toggleType = (type: string) => {
    const next = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type]
    setCurrentTypes(next)
    // 类型多值写入 overrides.equipments[name].type
    saveEquipmentEdit(equip.name, { type: next })
  }

  // —— T9.5 装备卡片标签（对称武器卡片标签，经 overrides.cardTags[name] 持久化）——
  const [cardTagPickerOpen, setCardTagPickerOpen] = useState(false)
  const [currentCardTags, setCurrentCardTags] = useState<string[]>(() => merged?.cardTags?.[equip.name] ?? [])
  useEffect(() => {
    const stored = merged?.cardTags?.[equip.name]
    if (Array.isArray(stored)) setCurrentCardTags(stored)
  }, [merged, equip.name])

  const removeCardTag = (tag: string) => {
    const next = currentCardTags.filter((t) => t !== tag)
    setCurrentCardTags(next)
    saveCardTags(equip.name, next)
  }
  const addCardTag = (tag: string) => {
    if (currentCardTags.includes(tag)) return
    const next = [...currentCardTags, tag]
    setCurrentCardTags(next)
    saveCardTags(equip.name, next)
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
            value={getSaved('name')}
            onSave={(v) => doSave('name', v)}
            editable={editable}
            variant="subtitle1"
            fontWeight={700}
          />
          <Box display="flex" gap={0.5} alignItems="center">
            {editable ? (
              <>
                {currentTypes.map((type) => (
                  <RemovableChip key={type} label={eqTypeLabel(type, lang)} onRemove={() => toggleType(type)} color="primary.light" />
                ))}
                <IconButton size="small" color="primary" onClick={() => setTypePickerOpen(true)}
                  sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, width: 28, height: 28 }}>
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </>
            ) : (
              currentTypes.map((type) => (
                <Chip key={type} size="small" label={eqTypeLabel(type, lang)} clickable={!!onTypeClick}
                  onClick={() => onTypeClick?.(type)} />
              ))
            )}
            <Chip
              size="small"
              label={sourceLabel}
              variant="outlined"
            />
          </Box>
        </Box>

        {/* 装备卡片标签（可编辑） —— 对称武器卡片标签 */}
        {editable ? (
          <Box mt={1} mb={1} display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
            {currentCardTags.map((tag) => (
              <RemovableChip key={tag} label={tag} onRemove={() => removeCardTag(tag)} color="secondary.light" />
            ))}
            <IconButton size="small" color="secondary" onClick={() => setCardTagPickerOpen(true)}
              sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, width: 28, height: 28 }}>
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        ) : (
          currentCardTags.length > 0 && (
            <Box mt={1} mb={1} display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
              {currentCardTags.map((tag) => (
                <Chip key={tag} size="small" label={tag} variant="outlined" />
              ))}
            </Box>
          )
        )}

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
                value={getSaved('officialName')}
                onSave={(v) => doSave('officialName', v)}
                editable={editable}
                variant="subtitle2"
                fontWeight={600}
              />
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.3, opacity: 0.9 }}>
              <EditableField
                value={getSaved('officialEffect')}
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
              value={getSaved('effect')}
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
        title={lang === 'zh' ? '选择装备类型（可多选）' : 'Select Types (multi)'}
        availableTags={allEqTypes}
        selectedTags={currentTypes}
        onToggle={(tag) => toggleType(tag)}
        getLabel={(tag) => eqTypeLabel(tag, lang)}
        lang={lang}
      />

      <TagPickerDialog
        open={cardTagPickerOpen}
        onClose={() => setCardTagPickerOpen(false)}
        title={lang === 'zh' ? '选择卡片标签' : 'Card Tags'}
        availableTags={allEqTypes}
        selectedTags={currentCardTags}
        onToggle={(tag) => {
          if (currentCardTags.includes(tag)) removeCardTag(tag)
          else addCardTag(tag)
        }}
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
