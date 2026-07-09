// 模块 Tab 导航：普通页面隐藏超频Tab
import { Tabs, Tab } from '@mui/material'
import { useLang } from '../i18n/LangContext'
import type { ModuleKey } from '../data/types'

export function ModuleTabs({
  active,
  onChange,
  showOverclocks = false,
}: {
  active: ModuleKey
  onChange: (m: ModuleKey) => void
  showOverclocks?: boolean
}) {
  const { t } = useLang()
  return (
    <Tabs
      value={active}
      onChange={(_, v) => onChange(v as ModuleKey)}
      variant="fullWidth"
      textColor="primary"
      indicatorColor="primary"
      sx={{ mt: 1 }}
    >
      <Tab value="achievements" label={t('tab.achievements')} />
      <Tab value="weapons" label={t('tab.weapons')} />
      <Tab value="equipments" label={t('tab.equipments')} />
      {showOverclocks && <Tab value="overclocks" label={t('tab.overclocks')} />}
    </Tabs>
  )
}
