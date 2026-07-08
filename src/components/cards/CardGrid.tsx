// 响应式卡片网格：flex-wrap，移动单列 / 桌面多列（T12 响应式）
import { Box } from '@mui/material'
import { Children, type ReactNode } from 'react'

export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
      {Children.map(children, (child, idx) => (
        <Box
          key={idx}
          sx={{
            flex: '1 1 280px',
            minWidth: 0,
            width: {
              xs: '100%',
              sm: 'calc(50% - 8px)',
              md: 'calc(33.333% - 11px)',
              lg: 'calc(25% - 12px)',
            },
          }}
        >
          {child}
        </Box>
      ))}
    </Box>
  )
}
