// 装备卡片：类型/来源 chip + 关联成就 + 官网/攻略双区块 + 管理编辑
import { useState, useEffect } from 'react'
import {
  Card, CardContent, Typography, Box, Chip, TextField, IconButton,
  FormControl, Select, MenuItem,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import type { Equipment, EquipmentSource, Lang } from '../../data/types'
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
  const { merged, saveEquipmentEdit } = useOverrides()
  const editor = useTagEditor()

  // 已合并的装备记录（override 优先），用于读取字段/类型
  const mergedEquip = merged?.equipments?.find((e) => e.name === equip.name)

  // 待定徽标：优先读取装备记录自身 suspected，回落 merged 合并值
  const suspected = Boolean(equip.suspected ?? mergedEquip?.suspected)

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

  /** 清除待定标记：仅把该装备 suspected 置为 false（装备本身保留，区别于硬删 deleteEquipment） */
  const clearSuspected = (name: string) => {
    saveEquipmentEdit(name, { suspected: false })
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

  // —— 来源：可编辑选择器，写入 overrides.equipments[name].source（单选，池子来自动态管理）——
  const handleSourceChange = (value: string) => {
    const next = (value || '') as EquipmentSource | ''
    saveEquipmentEdit(equip.name, { source: next })
  }

  // —— 待定徽标内置清除：点击胶囊 ✕ 只清 suspected，装备保留（不调 deleteEquipment）——
  const handleClearSuspected = () => {
    const msg =
      lang === 'zh'
        ? `确认将「${equip.name}」移出待定列表？装备本身保留，仅清除「待定」标记。`
        : `Mark "${equip.name}" as verified? The equipment is kept; only the "unverified" flag is cleared.`
    if (typeof window !== 'undefined' && !window.confirm(msg)) return
    clearSuspected(equip.name)
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
        {/* 第 1 行：名称独占整行（可编辑保持）；右侧为「待定」徽标（内置 ✕ 清除） */}
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
          <Box minWidth={0} flex={1}>
            <EditableField
              value={getSaved('name')}
              onSave={(v) => doSave('name', v)}
              editable={editable}
              variant="subtitle1"
              fontWeight={700}
            />
          </Box>
          <Box display="flex" gap={0.5} alignItems="center">
            {suspected && (
              <Chip
                size="small"
                color="warning"
                variant="outlined"
                label={lang === 'zh' ? '待定' : 'Unverified'}
                onDelete={handleClearSuspected}
                deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
                title={lang === 'zh' ? '点击 ✕ 移出待定（装备保留）' : 'Click ✕ to mark verified (equipment kept)'}
                aria-label={lang === 'zh' ? '移出待定' : 'Clear unverified'}
              />
            )}
          </Box>
        </Box>

        {/* 第 2 行：分类类型 + 来源选择器，同一行 flex wrap */}
        <Box mt={1} display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
          {/* 装备类型 chips + 添加 */}
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

          {/* 来源选择器：可编辑态为 Select（池子来自动态管理页），只读态为只读 Chip（source 为空则不显示） */}
          {editable ? (
            <FormControl size="small" sx={{ minWidth: 110 }}>
              <Select
                displayEmpty
                size="small"
                value={equip.source || ''}
                onChange={(e) => handleSourceChange(e.target.value)}
              >
                <MenuItem value="">{lang === 'zh' ? '未设置' : 'Unset'}</MenuItem>
                {editor.getSources().map((s) => (
                  <MenuItem key={s} value={s}>{EQUIPMENT_SOURCE_LABEL[s as EquipmentSource]?.[lang] ?? s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            equip.source && (
              <Chip
                size="small"
                variant="outlined"
                label={EQUIPMENT_SOURCE_LABEL[equip.source]?.[lang] ?? equip.source}
              />
            )
          )}
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
