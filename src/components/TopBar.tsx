// 顶栏：标题 + 语言切换 + 主题切换 + 移动端筛选入口（公开站只读，管理入口已迁至个人控制台）
import { Box, AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import TranslateIcon from '@mui/icons-material/Translate'
import TuneIcon from '@mui/icons-material/Tune'
import { useLang } from '../i18n/LangContext'
import { useTheme } from '../theme/ThemeContext'
import { useMediaQuery, useTheme as useMuiTheme } from '@mui/material'
import { getDrgTokens } from '../theme/createAppTheme'

export function TopBar({ onOpenFilter }: { onOpenFilter?: () => void }) {
  const { lang, toggleLang, t } = useLang()
  const { theme, toggleTheme } = useTheme()
  const muiTheme = useMuiTheme()
  const c = muiTheme.drg ?? getDrgTokens(muiTheme.palette.mode)
  const isXs = useMediaQuery(muiTheme.breakpoints.down('sm'))

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: c.cardBg, color: c.text, borderBottom: `2px solid ${c.amber}` }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <Typography sx={{ flexGrow: 1, fontWeight: 800, fontSize: { xs: 16, sm: 20 }, letterSpacing: 1, color: c.text }}>
          🪨 {t('app.title')}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          {isXs && onOpenFilter && (
            <Button
              size="small"
              variant="contained"
              onClick={onOpenFilter}
              startIcon={<TuneIcon />}
              sx={{ bgcolor: c.amber, color: c.bg, textTransform: 'none', fontWeight: 700, mr: 0.5 }}
            >
              {lang === 'zh' ? '筛选' : 'Filter'}
            </Button>
          )}
          <IconButton onClick={toggleLang} title={t('lang.toggle')} aria-label="toggle language">
            <TranslateIcon />
            <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 700, color: c.text }}>
              {lang === 'zh' ? '中' : 'EN'}
            </Typography>
          </IconButton>
          <IconButton onClick={toggleTheme} title={t('theme.toggle')} aria-label="toggle theme">
            {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
