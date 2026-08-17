// 顶层布局：公开站只读，单一 PublicPage 路由（编辑已迁至个人控制台）
import { useMemo } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { useTheme } from './theme/ThemeContext'
import { createAppTheme } from './theme/createAppTheme'
import { OverridesProvider } from './hooks/useOverrides'
import { PublicPage } from './pages/PublicPage'

export function App() {
  const { theme } = useTheme()
  const muiTheme = useMemo(() => createAppTheme(theme), [theme])

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <OverridesProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<PublicPage />} />
          </Routes>
        </HashRouter>
      </OverridesProvider>
    </ThemeProvider>
  )
}
