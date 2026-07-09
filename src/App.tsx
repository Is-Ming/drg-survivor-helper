// 顶层布局：HashRouter 路由分流
//   /        → PublicPage（只读，无超频 TAB）
//   /admin   → AdminPage（密码登录，全部可编辑）
import { useMemo } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { useTheme } from './theme/ThemeContext'
import { createAppTheme } from './theme/createAppTheme'
import { TopBar } from './components/TopBar'
import { PublicPage } from './pages/PublicPage'
import { AdminPage } from './pages/AdminPage'

export function App() {
  const { theme } = useTheme()
  const muiTheme = useMemo(() => createAppTheme(theme), [theme])

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <HashRouter>
        <TopBar />
        <Routes>
          <Route path="/" element={<PublicPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}
