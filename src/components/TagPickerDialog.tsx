// 通用标签/分类选取弹窗：数据源自标签管理页
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Box, Typography,
} from '@mui/material'
import { useLang } from '../i18n/LangContext'

export function TagPickerDialog({
  open,
  onClose,
  title,
  availableTags,
  selectedTags,
  onToggle,
  getLabel,
}: {
  open: boolean
  onClose: () => void
  title: string
  availableTags: string[]
  selectedTags: string[]
  onToggle: (tag: string) => void
  getLabel?: (tag: string) => string
}) {
  const { lang } = useLang()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {availableTags.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              {lang === 'zh' ? '暂无可用标签，请先在标签管理页添加' : 'No tags available. Add some in Tag Management.'}
            </Typography>
          )}
          {availableTags.map((t) => {
            const selected = selectedTags.includes(t)
            return (
              <Chip
                key={t}
                label={getLabel ? getLabel(t) : t}
                color={selected ? 'primary' : 'default'}
                variant={selected ? 'filled' : 'outlined'}
                onClick={() => onToggle(t)}
                sx={{ cursor: 'pointer' }}
              />
            )
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {lang === 'zh' ? '完成' : 'Done'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
