// 顶层布局：Provider 组合 + 顶栏 + 搜索 + Tab + 筛选 + 结果 + 页脚
import { useMemo, useState, type ReactNode } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { Box, Typography } from '@mui/material'
import { useTheme } from './theme/ThemeContext'
import { useLang } from './i18n/LangContext'
import { createAppTheme } from './theme/createAppTheme'
import { useFilter } from './hooks/useFilter'
import { useOverclockEditor } from './hooks/useOverclockEditor'
import { useOverclockFilter } from './hooks/useOverclockFilter'
import { TopBar } from './components/TopBar'
import { GlobalSearch } from './components/GlobalSearch'
import { ModuleTabs } from './components/ModuleTabs'
import { FilterBar } from './components/FilterBar'
import { CardGrid } from './components/cards/CardGrid'
import { AchievementCard } from './components/cards/AchievementCard'
import { WeaponCard } from './components/cards/WeaponCard'
import { EquipmentCard } from './components/cards/EquipmentCard'
import { OverclockCard } from './components/cards/OverclockCard'
import { OverclockFilters } from './components/filters/OverclockFilters'
import { Footer } from './components/Footer'

export function App() {
  const { theme } = useTheme()
  const { lang, t } = useLang()
  const muiTheme = useMemo(() => createAppTheme(theme), [theme])
  const f = useFilter()
  const { state } = f
  const highlight = state.achievement.onlyDifficult

  // 超频编辑器（可编辑中文名，localStorage 持久化）
  const ocEditor = useOverclockEditor()
  // 超频标签页独立的筛选状态
  const [ocFilterState, setOcFilterState] = useState<{ type?: 'balanced' | 'unstable' }>({})
  const query = state.query

  // 超频筛选结果
  const filteredOverclocks = useOverclockFilter({ ...ocFilterState, query })

  let cards: ReactNode = null
  if (state.activeModule === 'achievements') {
    cards = f.filteredAchievements.map((a) => (
      <AchievementCard key={a.englishName} ach={a} highlight={highlight} lang={lang} />
    ))
  } else if (state.activeModule === 'weapons') {
    cards = f.filteredWeapons.map((w) => (
      <WeaponCard
        key={w.englishName}
        weapon={w}
        selectedTags={state.weapon.tags}
        onTagClick={f.addWeaponTag}
        lang={lang}
        getOverclockName={ocEditor.getName}
        getOverclockEffect={ocEditor.getEffect}
      />
    ))
  } else if (state.activeModule === 'equipments') {
    cards = f.filteredEquipments.map((e) => (
      <EquipmentCard key={e.name} equip={e} onTypeClick={() => f.setEquipmentType(e.type)} lang={lang} />
    ))
  } else if (state.activeModule === 'overclocks') {
    cards = filteredOverclocks.map((oc) => (
      <OverclockCard
          key={oc.id}
          oc={oc}
          currentName={ocEditor.getName(oc.id)}
          currentEffect={ocEditor.getEffect(oc.id)}
          onSave={ocEditor.saveEdit}
          lang={lang}
        />
    ))
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <TopBar />
      <Box component="main" sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 1.5, sm: 3 }, py: 2 }}>
        <GlobalSearch value={state.query} onChange={f.setQuery} />
        <ModuleTabs active={state.activeModule} onChange={f.setActiveModule} />
        {state.activeModule === 'overclocks' ? (
          <OverclockFilters state={ocFilterState} setFilter={(p) => setOcFilterState((s) => ({ ...s, ...p }))} lang={lang} />
        ) : (
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
        )}
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {state.activeModule === 'overclocks' ? filteredOverclocks.length : f.resultCount} {t('result.count')}
          </Typography>
        </Box>
        {(state.activeModule === 'overclocks' ? filteredOverclocks.length : f.resultCount) === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
            {t('search.empty')}
          </Typography>
        ) : (
          <CardGrid>{cards}</CardGrid>
        )}
        <Footer />
      </Box>
    </ThemeProvider>
  )
}
