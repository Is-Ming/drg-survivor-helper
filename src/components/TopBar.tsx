// 顶栏：标题 + 语言切换 + 主题切换 + 管理入口/退出 + 全局恢复默认（admin）
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, Typography, IconButton, Box, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText,
} from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import TranslateIcon from '@mui/icons-material/Translate'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import RestoreIcon from '@mui/icons-material/Restore'
import { useLang } from '../i18n/LangContext'
import { useTheme } from '../theme/ThemeContext'
import { checkAdminLoggedIn, adminLogout } from './AdminLogin'
import { resetAllCustomData } from '../hooks/useTagEditor'

export function TopBar() {
  const { lang, toggleLang, t } = useLang()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = location.pathname.startsWith('/admin')
  const isLoggedIn = checkAdminLoggedIn()
  const [resetOpen, setResetOpen] = useState(false)

  const handleReset = () => {
    resetAllCustomData()
    setResetOpen(false)
    window.location.reload()
  }

  return (
    <>
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
              <>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => { adminLogout(); navigate('/') }}
                  sx={{ textTransform: 'none' }}
                >
                  {lang === 'zh' ? '退出管理' : 'Logout'}
                </Button>
                <IconButton
                  onClick={() => setResetOpen(true)}
                  title={lang === 'zh' ? '恢复默认' : 'Reset all'}
                  aria-label="reset all data"
                  color="error"
                >
                  <RestoreIcon />
                </IconButton>
              </>
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

      {/* 恢复默认确认弹窗 */}
      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
        <DialogTitle>
          {lang === 'zh' ? '恢复全部默认数据？' : 'Reset all data?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {lang === 'zh'
              ? '将会清除所有自定义修改（超频名称/效果、武器超频引用、评级、成就编辑、装备编辑、标签分类等），恢复到初始数据。此操作不可撤销。'
              : 'This will clear all custom edits (overclock names/effects, weapon references, ratings, achievement edits, equipment edits, tags) and restore initial data. This action cannot be undone.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)}>
            {lang === 'zh' ? '取消' : 'Cancel'}
          </Button>
          <Button onClick={handleReset} variant="contained" color="error">
            {lang === 'zh' ? '确认恢复' : 'Reset'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
