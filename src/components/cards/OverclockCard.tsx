// 超频卡片：名称 + 效果可内联编辑，支持中英切换
import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, Typography, Box, Chip, TextField } from '@mui/material'
import type { Overclock, Lang } from '../../data/types'

export function OverclockCard({
  oc,
  currentName,
  currentEffect,
  onSave,
  lang,
}: {
  oc: Overclock
  currentName: string
  currentEffect: string
  onSave: (id: string, patch: { chineseName?: string; effect?: string }) => void
  lang: Lang
}) {
  const [editingName, setEditingName] = useState(false)
  const [editingEffect, setEditingEffect] = useState(false)
  const [nameDraft, setNameDraft] = useState(currentName)
  const [effectDraft, setEffectDraft] = useState(currentEffect)
  const nameInput = useRef<HTMLInputElement>(null)
  const effectInput = useRef<HTMLInputElement>(null)

  useEffect(() => { setNameDraft(currentName) }, [currentName])
  useEffect(() => { setEffectDraft(currentEffect) }, [currentEffect])
  useEffect(() => { if (editingName && nameInput.current) nameInput.current.focus() }, [editingName])
  useEffect(() => { if (editingEffect && effectInput.current) effectInput.current.focus() }, [editingEffect])

  const saveName = () => {
    const v = nameDraft.trim()
    if (v && v !== currentName) onSave(oc.id, { chineseName: v })
    else setNameDraft(currentName)
    setEditingName(false)
  }

  const saveEffect = () => {
    const v = effectDraft.trim()
    if (v && v !== currentEffect) onSave(oc.id, { effect: v })
    else setEffectDraft(currentEffect)
    setEditingEffect(false)
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1} mb={1}>
          <Box minWidth={0} flexGrow={1}>
            {editingName ? (
              <TextField
                inputRef={nameInput}
                size="small"
                fullWidth
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveName()
                  if (e.key === 'Escape') { setNameDraft(currentName); setEditingName(false) }
                }}
                sx={{ '& input': { fontWeight: 700, fontSize: '0.875rem' } }}
              />
            ) : (
              <Typography
                variant="subtitle2"
                fontWeight={700}
                noWrap
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => setEditingName(true)}
                title={lang === 'zh' ? '点击编辑名称' : 'Click to edit name'}
              >
                {currentName}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" noWrap>
              {oc.englishName}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={
              oc.type === 'balanced'
                ? (lang === 'zh' ? '平衡' : 'Balanced')
                : (lang === 'zh' ? '不稳定' : 'Unstable')
            }
            color={oc.type === 'balanced' ? 'warning' : 'error'}
            variant="outlined"
          />
        </Box>

        {editingEffect ? (
          <TextField
            inputRef={effectInput}
            size="small"
            fullWidth
            multiline
            maxRows={3}
            value={effectDraft}
            onChange={(e) => setEffectDraft(e.target.value)}
            onBlur={saveEffect}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) saveEffect()
              if (e.key === 'Escape') { setEffectDraft(currentEffect); setEditingEffect(false) }
            }}
          />
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => setEditingEffect(true)}
            title={lang === 'zh' ? '点击编辑效果' : 'Click to edit effect'}
          >
            {currentEffect}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
