// MUI 主题工厂：light / dark 两态，注入深岩银河(D事故)游戏风色板
import { createTheme, type Theme, type ThemeOptions } from '@mui/material/styles'
import type { ThemeMode, WeaponClass } from '../data/types'

// 深岩银河职业专属色（社区通用）
export const CLASS_COLORS: Record<WeaponClass, string> = {
  Gunner: '#E2533B',
  Scout: '#37B6C9',
  Driller: '#F2C12E',
  Engineer: '#E8853A',
  Demolisher: '#B063D8',
}

export interface DrgTokens {
  amber: string
  amberDim: string
  bg: string
  cardBg: string
  cardBgAlt: string
  text: string
  textDim: string
  /** 厚黑描边（切角卡外层） */
  border: string
  /** 琥珀柔描边 */
  borderSoft: string
  ocYellow: string
  ocRed: string
  /** 切角 clip-path（右上 14px） */
  cut: string
  classColors: Record<WeaponClass, string>
}

declare module '@mui/material/styles' {
  interface Theme {
    drg: DrgTokens
  }
  interface ThemeOptions {
    drg?: DrgTokens
  }
}

const CUT = 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)'

function buildTokens(mode: ThemeMode): DrgTokens {
  const isDark = mode === 'dark'
  return isDark
    ? {
        amber: '#FFB000',
        amberDim: 'rgba(255,176,0,0.16)',
        bg: '#14110C',
        cardBg: '#1E1810',
        cardBgAlt: '#251C12',
        text: '#ECE3CF',
        textDim: '#9C9180',
        border: '#0A0805',
        borderSoft: 'rgba(255,176,0,0.22)',
        ocYellow: '#F5C518',
        ocRed: '#D6453B',
        cut: CUT,
        classColors: CLASS_COLORS,
      }
    : {
        amber: '#C8870A',
        amberDim: 'rgba(200,135,10,0.14)',
        bg: '#EAE3D5',
        cardBg: '#FBF6EC',
        cardBgAlt: '#F3EAD9',
        text: '#2A2418',
        textDim: '#6B6253',
        border: '#1A140A',
        borderSoft: 'rgba(200,135,10,0.32)',
        ocYellow: '#B58900',
        ocRed: '#C0392B',
        cut: CUT,
        classColors: CLASS_COLORS,
      }
}

/** 直接按 mode 取 DRG 色板（组件在 MUI theme 无 drg 字段时回退用，如测试环境） */
export function getDrgTokens(mode: ThemeMode): DrgTokens {
  return buildTokens(mode)
}

export function createAppTheme(mode: ThemeMode): Theme {
  const isDark = mode === 'dark'
  const c = buildTokens(mode)
  const opts: ThemeOptions = {
    palette: {
      mode,
      primary: { main: c.amber, contrastText: isDark ? '#14110C' : '#FFFFFF' },
      background: { default: c.bg, paper: c.cardBg },
      text: { primary: c.text, secondary: c.textDim },
      divider: c.borderSoft,
    },
    shape: { borderRadius: 8 },
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
            border: `1px solid ${c.borderSoft}`,
            backgroundImage: 'none',
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          },
        },
      },
    },
    drg: c,
  }
  return createTheme(opts)
}
