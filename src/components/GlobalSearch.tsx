// 常驻全局搜索框（跨模块即时过滤，无查询按钮）；DRG 游戏风
import { Box, InputBase, InputAdornment } from '@mui/material'
import { useTheme } from '@mui/material'
import { getDrgTokens } from '../theme/createAppTheme'
import SearchIcon from '@mui/icons-material/Search'
import { useLang } from '../i18n/LangContext'

export function GlobalSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const { t } = useLang()
  const muiTheme = useTheme()
  const c = muiTheme.drg ?? getDrgTokens(muiTheme.palette.mode)
  return (
    <Box
      sx={{
        mt: 1,
        p: 1,
        border: `1px solid ${c.borderSoft}`,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        bgcolor: c.cardBg,
      }}
    >
      <InputBase
        fullWidth
        placeholder={t('search.placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ color: c.text, '& ::placeholder': { color: c.textDim, opacity: 1 } }}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        }
      />
    </Box>
  )
}
