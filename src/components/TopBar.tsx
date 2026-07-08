// 顶栏：标题 + 语言切换 + 主题切换
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import TranslateIcon from '@mui/icons-material/Translate'
import { useLang } from '../i18n/LangContext'
import { useTheme } from '../theme/ThemeContext'

export function TopBar() {
  const { lang, toggleLang, t } = useLang()
  const { theme, toggleTheme } = useTheme()
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
          🪨 {t('app.title')}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={toggleLang} title={t('lang.toggle')} aria-label="toggle language">
            <TranslateIcon />
            <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 700 }}>
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
