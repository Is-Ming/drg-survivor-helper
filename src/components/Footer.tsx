// 页脚：数据来源 + 数据版本 + 评级主观声明（决策 7 统一再声明）
import { Box, Typography, Divider } from '@mui/material'
import { useLang } from '../i18n/LangContext'

export function Footer() {
  const { t } = useLang()
  return (
    <Box component="footer" sx={{ mt: 4, mb: 2 }}>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="caption" color="text.secondary" display="block">
        📌 {t('footer.sources')}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
        {t('footer.version')} · {t('footer.disclaimer')}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
        ⚠ {t('footer.classModTentative')}
      </Typography>
    </Box>
  )
}
