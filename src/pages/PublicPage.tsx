// 普通页面：无超频 TAB，无编辑功能，只读展示
// 数据来源：运行时合并 baseline/overrides（useOverrides），无服务端时回落 TS 数据。
import { useMemo, type ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { useLang } from '../i18n/LangContext'
import { useFilter } from '../hooks/useFilter'
import { useOverrides } from '../hooks/useOverrides'
import { resolveField } from '../utils/weaponName'
import { filterAchievements } from '../hooks/useAchievementFilter'
import { filterWeapons } from '../hooks/useWeaponFilter'
import { filterEquipments } from '../hooks/useEquipmentFilter'
import { ModuleTabs } from '../components/ModuleTabs'
import { GlobalSearch } from '../components/GlobalSearch'
import { FilterBar } from '../components/FilterBar'
import { CardGrid } from '../components/cards/CardGrid'
import { AchievementCard } from '../components/cards/AchievementCard'
import { WeaponCard } from '../components/cards/WeaponCard'
import { EquipmentCard } from '../components/cards/EquipmentCard'
import { Footer } from '../components/Footer'
import { useOverclockEditor } from '../hooks/useOverclockEditor'
import { achievements as tsAchievements } from '../data/achievements'
import { weapons as tsWeapons } from '../data/weapons'
import { equipments as tsEquipments } from '../data/equipments'
import type { Achievement, Equipment, ModuleKey, Weapon } from '../data/types'

export function PublicPage() {
  const { lang, t } = useLang()
  const f = useFilter()
  const { state } = f
  const { merged, getWeaponName } = useOverrides()

  // 超频编辑器（仅供武器卡名称/效果显示，不提供编辑入口）
  const ocEditor = useOverclockEditor()

  // 合并数据源（无 merged 时回落 TS 数据）
  const baseAchievements: Achievement[] = merged?.achievements ?? tsAchievements
  const baseWeapons: Weapon[] = merged?.weapons ?? tsWeapons
  const baseEquipments: Equipment[] = merged?.equipments ?? tsEquipments

  // 成就模板字段（{weapon}）解析为可搜索/可渲染的纯字符串
  const resolvedAchievements = useMemo(
    () =>
      merged
        ? baseAchievements.map((a) => ({
            ...a,
            chineseName: resolveField(a.chineseName, getWeaponName, lang),
            unlockCondition: resolveField(a.unlockCondition, getWeaponName, lang),
          }))
        : baseAchievements,
    [merged, baseAchievements, getWeaponName, lang],
  )

  const filteredAchievements = useMemo(() => filterAchievements(resolvedAchievements, state), [resolvedAchievements, state])
  const filteredWeapons = useMemo(() => filterWeapons(baseWeapons, state), [baseWeapons, state])
  const filteredEquipments = useMemo(() => filterEquipments(baseEquipments, state), [baseEquipments, state])

  const resultCount = useMemo(() => {
    switch (state.activeModule) {
      case 'achievements':
        return filteredAchievements.length
      case 'weapons':
        return filteredWeapons.length
      case 'equipments':
        return filteredEquipments.length
    }
  }, [state.activeModule, filteredAchievements, filteredWeapons, filteredEquipments])

  let cards: ReactNode = null
  if (state.activeModule === 'achievements') {
    cards = filteredAchievements.map((a) => (
      <AchievementCard key={a.englishName} ach={a} lang={lang} getWeaponName={getWeaponName} />
    ))
  } else if (state.activeModule === 'weapons') {
    cards = filteredWeapons.map((w) => (
      <WeaponCard
        key={w.englishName}
        weapon={w}
        selectedTags={state.weapon.tags}
        onTagClick={f.addWeaponTag}
        lang={lang}
        getWeaponName={getWeaponName}
        getOverclockName={(id) => ocEditor.getName(id, lang)}
        getOverclockEffect={(id) => ocEditor.getEffect(id, lang)}
      />
    ))
  } else if (state.activeModule === 'equipments') {
    cards = filteredEquipments.map((e) => (
      <EquipmentCard key={e.name} equip={e} lang={lang} onTypeClick={(tp) => {
        if (f.state.equipment.types.includes(tp)) f.removeEquipmentType(tp)
        else f.addEquipmentType(tp)
      }} />
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
        setAchievementSort={f.setAchievementSort}
        addAchievementCategory={f.addAchievementCategory}
        removeAchievementCategory={f.removeAchievementCategory}
        setWeaponClass={f.setWeaponClass}
        setWeaponRating={f.setWeaponRating}
        addWeaponTag={f.addWeaponTag}
        removeWeaponTag={f.removeWeaponTag}
        setWeaponSort={f.setWeaponSort}
        addEquipmentType={f.addEquipmentType}
        removeEquipmentType={f.removeEquipmentType}
        setEquipmentSource={f.setEquipmentSource}
        lang={lang}
      />
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {resultCount} {t('result.count')}
        </Typography>
      </Box>
      {resultCount === 0 ? (
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
