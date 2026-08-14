// 响应式卡片网格：CSS Grid auto-fill，切角卡最小宽度 280px（含 2px 描边包裹层）
// 移动端（容器 < ~600px）自动单列；平板 2 列；桌面 3~4 列。
import { Box } from '@mui/material'
import { Children, type ReactNode } from 'react'

export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(280px, 1fr))' },
        gap: 2,
        mt: 2,
        alignItems: 'stretch',
      }}
    >
      {Children.map(children, (child, idx) => (
        <Box key={idx} sx={{ minWidth: 0, height: '100%' }}>
          {child}
        </Box>
      ))}
    </Box>
  )
}
