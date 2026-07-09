// 超频选取弹窗
import { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Box, ToggleButtonGroup, ToggleButton, Typography,
} from '@mui/material'
import type { Lang } from '../data/types'

interface OcOption { id: string; label: string }

export function OverclockPickerDialog({
  open, onClose, title, yellowOptions, redOptions, onSelect, lang,
}: {
  open: boolean; onClose: () => void; title: string
  yellowOptions: OcOption[]; redOptions: OcOption[]
  onSelect: (type: 'yellow' | 'red', id: string) => void
  lang: Lang
}) {
  const [ocType, setOcType] = useState<'yellow' | 'red'>('yellow')
  const options = ocType === 'yellow' ? yellowOptions : redOptions

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <ToggleButtonGroup size="small" color="primary" value={ocType} exclusive
            onChange={(_, v) => v && setOcType(v)}>
            <ToggleButton value="yellow">{lang === 'zh' ? '黄色超频 · 平衡' : 'Balanced'}</ToggleButton>
            <ToggleButton value="red">{lang === 'zh' ? '红色超频 · 不稳定' : 'Unstable'}</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {options.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              {lang === 'zh' ? '该类型暂无可用超频' : 'No available overclocks'}
            </Typography>
          )}
          {options.map((oc) => (
            <Chip key={oc.id} label={oc.label} variant="outlined" clickable
              onClick={() => { onSelect(ocType, oc.id); onClose() }} />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{lang === 'zh' ? '取消' : 'Cancel'}</Button>
      </DialogActions>
    </Dialog>
  )
}
