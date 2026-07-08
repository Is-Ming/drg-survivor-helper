// 常驻全局搜索框（跨模块即时过滤，无查询按钮）
import { Box, InputBase, InputAdornment } from '@mui/material'
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
  return (
    <Box
      sx={{
        mt: 1,
        p: 1,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.paper',
      }}
    >
      <InputBase
        fullWidth
        placeholder={t('search.placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        }
      />
    </Box>
  )
}
