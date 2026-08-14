// 页脚：数据来源 + 数据版本 + 评级主观声明（决策 7 统一再声明）；DRG 游戏风
import { Box, Typography, Divider } from '@mui/material'
import { useTheme } from '@mui/material'
import { getDrgTokens } from '../theme/createAppTheme'
import { useLang } from '../i18n/LangContext'

export function Footer() {
  const { t } = useLang()
  const muiTheme = useTheme()
  const c = muiTheme.drg ?? getDrgTokens(muiTheme.palette.mode)
  return (
    <Box component="footer" sx={{ mt: 4, mb: 2 }}>
      <Divider sx={{ mb: 2, borderColor: c.borderSoft }} />
      <Typography variant="caption" sx={{ color: c.textDim, display: 'block' }}>
        📌 {t('footer.sources')}
      </Typography>
      <Typography variant="caption" sx={{ color: c.textDim, display: 'block', mt: 0.5 }}>
        {t('footer.version')} · {t('footer.disclaimer')}
      </Typography>
      <Typography variant="caption" sx={{ color: c.textDim, display: 'block', mt: 0.5 }}>
        ⚠ {t('footer.classModTentative')}
      </Typography>
    </Box>
  )
}
