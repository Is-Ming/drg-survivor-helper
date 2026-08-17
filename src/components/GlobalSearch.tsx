// 常驻全局搜索框（跨模块即时过滤，无查询按钮）；DRG 游戏风
import { Box, InputBase, InputAdornment, IconButton } from '@mui/material'
import { useTheme } from '@mui/material'
import { getDrgTokens } from '../theme/createAppTheme'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { useLang } from '../i18n/LangContext'

export function GlobalSearch({
  value,
  onChange,
  onClear,
}: {
  value: string
  onChange: (v: string) => void
  onClear?: () => void
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
        endAdornment={
          value ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={onClear} aria-label="clear search" title={t('search.clearAll')}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null
        }
      />
    </Box>
  )
}
