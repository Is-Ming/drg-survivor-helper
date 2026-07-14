// 成就卡片：中/英文名 + 分类 + 解锁条件 + 生物群系档位 + 疑难分档徽标（支持管理页编辑）
import { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Box, Chip, TextField, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import type { Achievement, Lang } from '../../data/types'
import { getDifficultyTier, ACHIEVEMENT_CATEGORY_LABEL } from '../../data/enums'
import { DifficultyBadge } from '../badges/DifficultyBadge'
import { useTagEditor } from '../../hooks/useTagEditor'
import { useOverrides } from '../../hooks/useOverrides'
import { bundledWeaponNameResolver, resolveField, type WeaponNameResolver } from '../../utils/weaponName'
import { TagPickerDialog } from '../TagPickerDialog'
import { RemovableChip } from '../RemovableChip'

/** 归一化分类为字符串数组（单值/多值/空均兼容） */
function normalizeCategories(c: string | string[] | undefined, fallback: string): string[] {
  if (Array.isArray(c)) {
    const filtered = c.filter((x): x is string => typeof x === 'string' && x.length > 0)
    if (filtered.length > 0) return filtered
  } else if (typeof c === 'string' && c) {
    return [c]
  }
  return fallback ? [fallback] : []
}

function catLabel(cat: string, lang: Lang): string {
  return ACHIEVEMENT_CATEGORY_LABEL[cat as keyof typeof ACHIEVEMENT_CATEGORY_LABEL]?.[lang] ?? cat
}

export function AchievementCard({
  ach,
  highlight,
  lang,
  editable,
  getWeaponName,
  onSave,
}: {
  ach: Achievement
  highlight: boolean
  lang: Lang
  editable?: boolean
  getWeaponName?: WeaponNameResolver
  onSave?: (patch: Record<string, string>) => void
}) {
  const [editName, setEditName] = useState('')
  const [editCondition, setEditCondition] = useState('')
  const [editingField, setEditingField] = useState<string | null>(null)

  // 武器名解析：优先使用上层注入的运行时 resolver（服务端合并数据），无 Provider 时回落 bundled。
  const resolveName = getWeaponName ?? bundledWeaponNameResolver
  const resolvedName = resolveField(ach.chineseName, resolveName, lang)
  const resolvedCondition = resolveField(ach.unlockCondition, resolveName, lang)

  const { merged, saveAchievementEdit } = useOverrides()
  const editor = useTagEditor()

  const loadSaved = () => {
    setEditName(resolvedName)
    setEditCondition(resolvedCondition)
  }

  useEffect(() => {
    if (editable) loadSaved()
  }, [editable, ach.englishName])

  const displayName = editable ? editName || resolvedName : resolvedName
  const displayCondition = editable
    ? editCondition || resolvedCondition
    : lang === 'zh' ? resolvedCondition : (ach.enUnlockCondition || resolvedCondition)
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

  const [catPickerOpen, setCatPickerOpen] = useState(false)
  const allCategories = editor.getCategories()
  // 分类显示：优先读取 merged.achievements[en].category（多值数组，override 优先），回落硬编码单值
  const [currentCategories, setCurrentCategories] = useState<string[]>(() => {
    const ov = merged?.achievements?.find((a) => a.englishName === ach.englishName)?.category
    const fb = Array.isArray(ach.category) ? (ach.category[0] ?? '') : ach.category
    return normalizeCategories(ov, fb)
  })

  // 与服务端合并值保持同步（异步加载 / 其它编辑触发）
  useEffect(() => {
    const ov = merged?.achievements?.find((a) => a.englishName === ach.englishName)?.category
    if (ov !== undefined) setCurrentCategories(normalizeCategories(ov, ''))
  }, [merged, ach.englishName])

  const toggleCategory = (cat: string) => {
    const next = currentCategories.includes(cat)
      ? currentCategories.filter((c) => c !== cat)
      : [...currentCategories, cat]
    setCurrentCategories(next)
    // 卡片标签并入成就迁移：分类写入 overrides.achievements[en].category（多值）
    saveAchievementEdit(ach.englishName, { category: next })
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
                  if (e.key === 'Escape') { setEditName(resolvedName); setEditingField(null) }
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
              {lang === 'zh' ? ach.englishName : resolvedName}
            </Typography>
          </Box>
          <Box flexShrink={0}>
            <DifficultyBadge rate={ach.completionRate} show={highlight} lang={lang} />
          </Box>
        </Box>

        <Box mt={1} mb={1} display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
          {editable ? (
            <>
              {currentCategories.map((cat) => (
                <RemovableChip key={cat} label={catLabel(cat, lang)} onRemove={() => toggleCategory(cat)} color="primary.light" />
              ))}
              <IconButton size="small" color="primary" onClick={() => setCatPickerOpen(true)}
                sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, width: 28, height: 28 }}>
                <AddIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </>
          ) : (
            currentCategories.map((cat) => (
              <Chip key={cat} size="small" label={catLabel(cat, lang)} variant="outlined" />
            ))
          )}
          {ach.biomeTier && (
            <Chip size="small" label={ach.biomeTier} color="secondary" variant="outlined" />
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
              if (e.key === 'Escape') { setEditCondition(resolvedCondition); setEditingField(null) }
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

      <TagPickerDialog
        open={catPickerOpen}
        onClose={() => setCatPickerOpen(false)}
        title={lang === 'zh' ? '选择分类（可多选）' : 'Select Categories (multi)'}
        availableTags={allCategories}
        selectedTags={currentCategories}
        onToggle={(tag) => toggleCategory(tag)}
        getLabel={(tag) => catLabel(tag, lang)}
        lang={lang}
      />
    </Card>
  )
}
