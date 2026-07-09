// 管理页面：完整 5 个 TAB + 全部编辑权限 + 登录门控
import { useState, type ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { useLang } from '../i18n/LangContext'
import { useFilter } from '../hooks/useFilter'
import { useOverclockEditor } from '../hooks/useOverclockEditor'
import { useOverclockFilter } from '../hooks/useOverclockFilter'
import { ModuleTabs } from '../components/ModuleTabs'
import { GlobalSearch } from '../components/GlobalSearch'
import { FilterBar } from '../components/FilterBar'
import { CardGrid } from '../components/cards/CardGrid'
import { AchievementCard } from '../components/cards/AchievementCard'
import { WeaponCard } from '../components/cards/WeaponCard'
import { EquipmentCard } from '../components/cards/EquipmentCard'
import { OverclockCard } from '../components/cards/OverclockCard'
import { OverclockFilters } from '../components/filters/OverclockFilters'
import { TagManager } from '../components/TagManager'
import { Footer } from '../components/Footer'
import { AdminLogin, checkAdminLoggedIn } from '../components/AdminLogin'
import type { ModuleKey } from '../data/types'

export function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(checkAdminLoggedIn)

  if (!isLoggedIn) {
    return <AdminLogin open={!isLoggedIn} onLogin={() => setIsLoggedIn(true)} />
  }

  return <AdminPageInner />
}

function AdminPageInner() {
  const { lang, t } = useLang()
  const f = useFilter()
  const { state } = f

  // 超频编辑器
  const ocEditor = useOverclockEditor()
  // 超频标签页独立的筛选状态
  const [ocFilterState, setOcFilterState] = useState<{ type?: 'balanced' | 'unstable' }>({})
  const query = state.query

  // 超频筛选结果
  const filteredOverclocks = useOverclockFilter({ ...ocFilterState, query })

  // 标签管理页（独立渲染，不经过卡片网格）
  if (state.activeModule === 'tags') {
    return (
      <Box component="main" sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 1.5, sm: 3 }, py: 2 }}>
        <ModuleTabs
          active={state.activeModule}
          onChange={(m: ModuleKey) => f.setActiveModule(m)}
          showOverclocks
          showTags
        />
        <TagManager />
        <Footer />
      </Box>
    )
  }

  let cards: ReactNode = null
  if (state.activeModule === 'achievements') {
    cards = f.filteredAchievements.map((a) => (
      <AchievementCard
        key={a.englishName}
        ach={a}
        highlight={state.achievement.onlyDifficult}
        lang={lang}
        editable
        onSave={(patch) => {
          try {
            const key = `drg-ach-edit-${a.englishName}`
            const existing = JSON.parse(localStorage.getItem(key) || '{}')
            localStorage.setItem(key, JSON.stringify({ ...existing, ...patch }))
          } catch { /* ignore */ }
        }}
      />
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
        editable
      />
    ))
  } else if (state.activeModule === 'equipments') {
    cards = f.filteredEquipments.map((e) => (
      <EquipmentCard
        key={e.name}
        equip={e}
        lang={lang}
        onTypeClick={() => f.setEquipmentType(e.type)}
        editable
      />
    ))
  } else if (state.activeModule === 'overclocks') {
    cards = filteredOverclocks.map((oc) => (
      <OverclockCard
        key={oc.id}
        oc={oc}
        currentName={ocEditor.getName(oc.id, lang)}
        currentEffect={ocEditor.getEffect(oc.id, lang)}
        onSave={ocEditor.saveEdit}
        lang={lang}
      />
    ))
  }

  return (
    <Box component="main" sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 1.5, sm: 3 }, py: 2 }}>
      <GlobalSearch value={state.query} onChange={f.setQuery} />
      <ModuleTabs
        active={state.activeModule}
        onChange={(m: ModuleKey) => f.setActiveModule(m)}
        showOverclocks
        showTags
      />
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
  )
}
