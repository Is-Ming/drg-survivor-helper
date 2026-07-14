// 通用 [x 名称] 可删除标签框（武器标签 / 成就分类 / 装备类型 复用）
import { Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export function RemovableChip({ label, onRemove, color }: { label: string; onRemove: () => void; color?: string }) {
  return (
    <Box component="span" sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.3,
      border: 1, borderColor: color ?? 'divider', borderRadius: 1.5,
      px: 0.8, py: 0.2, fontSize: '0.8125rem', whiteSpace: 'nowrap',
    }}>
      <CloseIcon sx={{ fontSize: 14, cursor: 'pointer', color: 'error.light', '&:hover': { color: 'error.main' } }}
        onClick={onRemove} />
      {label}
    </Box>
  )
}
