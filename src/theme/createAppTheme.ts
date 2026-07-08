// MUI 主题工厂：light / dark 两态，注入 DRG 琥珀色调
import { createTheme, type Theme } from '@mui/material/styles'
import type { ThemeMode } from '../data/types'

const DRG_AMBER = '#F5A623'
const DRG_BG_DARK = '#0d0d0d'

export function createAppTheme(mode: ThemeMode): Theme {
  const isDark = mode === 'dark'
  return createTheme({
    palette: {
      mode,
      primary: { main: DRG_AMBER, contrastText: isDark ? '#0d0d0d' : '#ffffff' },
      background: {
        default: isDark ? DRG_BG_DARK : '#f4f5f7',
        paper: isDark ? '#161616' : '#ffffff',
      },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily:
        '"Inter", "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", system-ui, sans-serif',
      h6: { fontWeight: 700 },
    },
    components: {
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          },
        },
      },
    },
  })
}
