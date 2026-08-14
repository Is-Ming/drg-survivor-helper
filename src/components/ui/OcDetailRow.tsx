// 超频详情行：左侧类型色条 + 图标 + 中/英名(等宽) + 中/英效果，展开详情区复用
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { getDrgTokens } from '../../theme/createAppTheme'

export function OcDetailRow({
  nameZh,
  nameEn,
  effectZh,
  effectEn,
  type,
  icon,
}: {
  nameZh: string
  nameEn: string
  effectZh: string
  effectEn: string
  type: 'yellow' | 'red'
  icon?: string
}) {
  const mui = useTheme()
  const c = mui.drg ?? getDrgTokens(mui.palette.mode)
  const bar = type === 'yellow' ? c.ocYellow : c.ocRed
  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'stretch' }}>
      <Box sx={{ width: 3, bgcolor: bar, flexShrink: 0, borderRadius: 1 }} />
      {icon && (
        <Box
          component="img"
          src={import.meta.env.BASE_URL.replace(/\/$/, '') + icon}
          alt={nameEn}
          sx={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0, alignSelf: 'center', imageRendering: 'pixelated' }}
        />
      )}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, flexWrap: 'wrap' }}>
          <Typography
            component="span"
            sx={{ fontWeight: 700, color: bar, fontFamily: 'monospace', fontSize: 13 }}
          >
            {nameZh}
          </Typography>
          <Typography
            component="span"
            variant="caption"
            sx={{ color: c.textDim, fontFamily: 'monospace' }}
          >
            {nameEn}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: c.text, mt: 0.2, wordBreak: 'break-word' }}>
          {effectZh}
        </Typography>
        {effectEn && effectEn !== effectZh && (
          <Typography
            variant="caption"
            sx={{ color: c.textDim, display: 'block', wordBreak: 'break-word' }}
          >
            {effectEn}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
