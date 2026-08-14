// 模块 Tab 导航：普通页面隐藏超频/标签Tab；窄屏可横向滚动 + DRG 琥珀下划线
import { Tabs, Tab, useMediaQuery, useTheme } from '@mui/material'
import { getDrgTokens } from '../theme/createAppTheme'
import { useLang } from '../i18n/LangContext'
import type { ModuleKey } from '../data/types'

export function ModuleTabs({
  active,
  onChange,
  showOverclocks = false,
  showTags = false,
}: {
  active: ModuleKey
  onChange: (m: ModuleKey) => void
  showOverclocks?: boolean
  showTags?: boolean
}) {
  const { t } = useLang()
  const muiTheme = useTheme()
  const isXs = useMediaQuery(muiTheme.breakpoints.down('sm'))
  const c = muiTheme.drg ?? getDrgTokens(muiTheme.palette.mode)
  return (
    <Tabs
      value={active}
      onChange={(_, v) => onChange(v as ModuleKey)}
      variant={isXs ? 'scrollable' : 'fullWidth'}
      scrollButtons={isXs ? 'auto' : false}
      allowScrollButtonsMobile
      textColor="primary"
      indicatorColor="primary"
      sx={{
        mt: 1,
        borderBottom: `2px solid ${c.borderSoft}`,
        '& .MuiTab-root': { fontWeight: 700, letterSpacing: 0.5, textTransform: 'none' },
        '& .Mui-selected': { color: `${c.amber} !important` },
        '& .MuiTabs-indicator': { backgroundColor: c.amber, height: 3 },
      }}
    >
      <Tab value="achievements" label={t('tab.achievements')} />
      <Tab value="weapons" label={t('tab.weapons')} />
      <Tab value="equipments" label={t('tab.equipments')} />
      {showOverclocks && <Tab value="overclocks" label={t('tab.overclocks')} />}
      {showTags && <Tab value="tags" label={t('tab.tags')} />}
    </Tabs>
  )
}
