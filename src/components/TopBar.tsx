// 顶栏：标题 + 语言切换 + 主题切换 + 管理入口/退出
import { useLocation, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import TranslateIcon from '@mui/icons-material/Translate'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { useLang } from '../i18n/LangContext'
import { useTheme } from '../theme/ThemeContext'
import { checkAdminLoggedIn, adminLogout } from './AdminLogin'

export function TopBar() {
  const { lang, toggleLang, t } = useLang()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = location.pathname.startsWith('/admin')
  const isLoggedIn = checkAdminLoggedIn()

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
          {isAdmin && isLoggedIn ? (
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => { adminLogout(); navigate('/') }}
              sx={{ textTransform: 'none' }}
            >
              {lang === 'zh' ? '退出管理' : 'Logout'}
            </Button>
          ) : null}
          <IconButton
            onClick={() => navigate(isAdmin ? '/' : '/admin')}
            title={isAdmin ? (lang === 'zh' ? '返回首页' : 'Home') : (lang === 'zh' ? '管理' : 'Admin')}
            aria-label="admin"
            color={isLoggedIn ? 'warning' : 'default'}
          >
            <AdminPanelSettingsIcon />
          </IconButton>
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
