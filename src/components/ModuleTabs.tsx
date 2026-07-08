// 三大模块 Tab（当前态）
import { Tabs, Tab } from '@mui/material'
import { useLang } from '../i18n/LangContext'
import type { ModuleKey } from '../data/types'

export function ModuleTabs({
  active,
  onChange,
}: {
  active: ModuleKey
  onChange: (m: ModuleKey) => void
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
    </Tabs>
  )
}
