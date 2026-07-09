// 超频卡片：名称可内联编辑 + 效果展示
import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, Typography, Box, Chip, TextField } from '@mui/material'
import type { Overclock } from '../../data/types'

export function OverclockCard({
  oc,
  currentName,
  onNameChange,
}: {
  oc: Overclock
  currentName: string
  onNameChange: (id: string, name: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(currentName)
  const inputRef = useRef<HTMLInputElement>(null)

  // 当外部 currentName 变化时同步 draft
  useEffect(() => {
    setDraft(currentName)
  }, [currentName])

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  const handleSave = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== currentName) onNameChange(oc.id, trimmed)
    setEditing(false)
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Box minWidth={0} flexGrow={1}>
            {editing ? (
              <TextField
                inputRef={inputRef}
                size="small"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') {
                    setDraft(currentName)
                    setEditing(false)
                  }
                }}
                sx={{ '& input': { fontWeight: 700, fontSize: '0.875rem' } }}
              />
            ) : (
              <Typography
                variant="subtitle2"
                fontWeight={700}
                noWrap
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => setEditing(true)}
                title="点击编辑名称"
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
            label={oc.type === 'balanced' ? '平衡' : '不稳定'}
            color={oc.type === 'balanced' ? 'warning' : 'error'}
            variant="outlined"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {oc.effect}
        </Typography>
      </CardContent>
    </Card>
  )
}
