// 切角厚黑描边卡片容器：右上 14px 切角 + 2px 黑边 + 顶部矿层色带，深岩银河风
import { Box, Card } from '@mui/material'
import type { ReactNode } from 'react'
import { useTheme } from '@mui/material/styles'
import { getDrgTokens } from '../../theme/createAppTheme'

export function CutCard({
  accent,
  children,
  className,
}: {
  /** 顶部矿层色带颜色；undefined 则不显示色带 */
  accent?: string
  children: ReactNode
  className?: string
}) {
  const mui = useTheme()
  const c = mui.drg ?? getDrgTokens(mui.palette.mode)
  return (
    <Box
      className={className}
      sx={{
        clipPath: c.cut,
        bgcolor: c.border,
        p: '2px',
        borderRadius: 3,
        height: '100%',
      }}
    >
      <Card
        sx={{
          clipPath: c.cut,
          border: 'none',
          bgcolor: c.cardBg,
          color: c.text,
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {accent !== undefined && (
          <Box sx={{ height: 3, bgcolor: accent, flexShrink: 0 }} />
        )}
        {children}
      </Card>
    </Box>
  )
}
