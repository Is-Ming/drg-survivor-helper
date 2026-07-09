// 普通页面：无超频 TAB，无编辑功能，只读展示
import { type ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { useLang } from '../i18n/LangContext'
import { useFilter } from '../hooks/useFilter'
import { ModuleTabs } from '../components/ModuleTabs'
import { GlobalSearch } from '../components/GlobalSearch'
import { FilterBar } from '../components/FilterBar'
import { CardGrid } from '../components/cards/CardGrid'
import { AchievementCard } from '../components/cards/AchievementCard'
import { WeaponCard } from '../components/cards/WeaponCard'
import { EquipmentCard } from '../components/cards/EquipmentCard'
import { Footer } from '../components/Footer'
import { useOverclockEditor } from '../hooks/useOverclockEditor'
import type { ModuleKey } from '../data/types'

export function PublicPage() {
  const { lang, t } = useLang()
  const f = useFilter()
  const { state } = f

  // 超频编辑器（仅供武器卡名称/效果显示，不提供编辑入口）
  const ocEditor = useOverclockEditor()

  let cards: ReactNode = null
  if (state.activeModule === 'achievements') {
    cards = f.filteredAchievements.map((a) => (
      <AchievementCard key={a.englishName} ach={a} highlight={state.achievement.onlyDifficult} lang={lang} />
    ))
  } else if (state.activeModule === 'weapons') {
    cards = f.filteredWeapons.map((w) => (
      <WeaponCard
        key={w.englishName}
        weapon={w}
        selectedTags={state.weapon.tags}
        onTagClick={f.addWeaponTag}
        lang={lang}
        getOverclockName={(id) => ocEditor.getName(id, lang)}
        getOverclockEffect={(id) => ocEditor.getEffect(id, lang)}
      />
    ))
  } else if (state.activeModule === 'equipments') {
    cards = f.filteredEquipments.map((e) => (
      <EquipmentCard key={e.name} equip={e} lang={lang} onTypeClick={() => f.setEquipmentType(e.type)} />
    ))
  }

  return (
    <Box component="main" sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 1.5, sm: 3 }, py: 2 }}>
      <GlobalSearch value={state.query} onChange={f.setQuery} />
      <ModuleTabs
        active={state.activeModule}
        onChange={(m: ModuleKey) => f.setActiveModule(m)}
        showOverclocks={false}
      />
      <FilterBar
        activeModule={state.activeModule}
        state={state}
        setAchievementFilter={f.setAchievementFilter}
        setWeaponClass={f.setWeaponClass}
        setWeaponRating={f.setWeaponRating}
        addWeaponTag={f.addWeaponTag}
        removeWeaponTag={f.removeWeaponTag}
        setEquipmentType={f.setEquipmentType}
        setEquipmentSource={f.setEquipmentSource}
        lang={lang}
      />
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {f.resultCount} {t('result.count')}
        </Typography>
      </Box>
      {f.resultCount === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          {t('search.empty')}
        </Typography>
      ) : (
        <CardGrid>{cards}</CardGrid>
      )}
      <Footer />
    </Box>
  )
}
