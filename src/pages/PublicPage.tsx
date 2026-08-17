// 普通页面：无编辑功能，只读展示
// 数据来源：运行时合并 baseline/overrides（useOverrides），无服务端时回落 TS 数据。
import { useMemo, useState, type ReactNode } from 'react'
import { Box, Typography, useMediaQuery, useTheme, SwipeableDrawer, Button } from '@mui/material'
import { getDrgTokens } from '../theme/createAppTheme'
import { useLang } from '../i18n/LangContext'
import { useFilter } from '../hooks/useFilter'
import { useOverrides } from '../hooks/useOverrides'
import { resolveField } from '../utils/weaponName'
import { filterAchievements } from '../hooks/useAchievementFilter'
import { filterWeapons } from '../hooks/useWeaponFilter'
import { filterEquipments } from '../hooks/useEquipmentFilter'
import { useOverclockEditor } from '../hooks/useOverclockEditor'
import { ModuleTabs } from '../components/ModuleTabs'
import { GlobalSearch } from '../components/GlobalSearch'
import { FilterBar } from '../components/FilterBar'
import { TopBar } from '../components/TopBar'
import { CardGrid } from '../components/cards/CardGrid'
import { AchievementCard } from '../components/cards/AchievementCard'
import { WeaponCard } from '../components/cards/WeaponCard'
import { EquipmentCard } from '../components/cards/EquipmentCard'
import { OverclockLookupCard } from '../components/cards/OverclockLookupCard'
import { Footer } from '../components/Footer'
import { achievements as tsAchievements } from '../data/achievements'
import { weapons as tsWeapons } from '../data/weapons'
import { equipments as tsEquipments } from '../data/equipments'
import { ACHIEVEMENT_CATEGORY_LABEL } from '../data/enums'
import type { Achievement, ModuleKey } from '../data/types'

const RARITY_RANK: Record<string, number> = { 稀有: 0, 普通: 1, '': 2 }
function achNameKey(a: Achievement): string {
  return typeof a.chineseName === 'string' ? a.chineseName : a.englishName
}

export function PublicPage() {
  const { lang, t } = useLang()
  const f = useFilter()
  const { state } = f
  const { merged, getWeaponName } = useOverrides()
  const muiTheme = useTheme()
  const c = muiTheme.drg ?? getDrgTokens(muiTheme.palette.mode)
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsedAchCats, setCollapsedAchCats] = useState<Set<string>>(new Set())

  // 超频编辑器（仅供武器卡名称/效果显示，不提供编辑入口）
  const ocEditor = useOverclockEditor()

  // 合并数据源（无 merged 时回落 TS 数据）
  const baseAchievements: Achievement[] = merged?.achievements ?? tsAchievements
  const baseWeapons = merged?.weapons ?? tsWeapons
  const baseEquipments = merged?.equipments ?? tsEquipments

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

  // 本地过滤（基于合并/解析后的数据，确保搜索命中武器模板字段解析后的纯文本）
  const achList = useMemo(() => filterAchievements(resolvedAchievements, state), [resolvedAchievements, state])
  const weaponList = useMemo(() => filterWeapons(baseWeapons, state), [baseWeapons, state])
  const equipList = useMemo(() => filterEquipments(baseEquipments, state), [baseEquipments, state])
  const ocList = f.filteredOverclocks

  // 成就按分类分组（仅当排序维度为「分类分组」时）
  const achGroups = useMemo(() => {
    if (state.achievement.sort?.by !== 'category') return null
    const map = new Map<string, Achievement[]>()
    for (const a of achList) {
      const cats = Array.isArray(a.category) ? a.category : [a.category]
      const key = (cats[0] as string) || '其他'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(a)
    }
    return [...map.entries()]
      .sort((x, y) => y[1].length - x[1].length)
      .map(([cat, items]) => ({
        cat,
        items: [...items].sort(
          (a, b) =>
            (RARITY_RANK[a.rarity] ?? 2) - (RARITY_RANK[b.rarity] ?? 2) ||
            achNameKey(a).localeCompare(achNameKey(b), 'zh-CN'),
        ),
      }))
  }, [achList, state.achievement.sort?.by])

  // 超频 → 拥有武器（反查）
  const ocOwners = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const w of baseWeapons) {
      const ids = [...(w.yellowOverclockIds ?? []), ...(w.redOverclockIds ?? [])]
      const name = w.chineseName || w.englishName
      for (const id of ids) {
        if (!map.has(id)) map.set(id, [])
        if (!map.get(id)!.includes(name)) map.get(id)!.push(name)
      }
    }
    return map
  }, [baseWeapons])

  const query = state.query

  const filterBar = (
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
      setEquipmentSort={f.setEquipmentSort}
      toggleOverclockType={f.toggleOverclockType}
      lang={lang}
    />
  )

  const emptyState = (
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="body1" color="text.secondary">
        {t('search.empty')}
      </Typography>
      <Button variant="contained" sx={{ mt: 2, bgcolor: c.amber, color: c.bg }} onClick={() => { f.clearFilters(); f.setQuery('') }}>
        {t('search.clearAll')}
      </Button>
    </Box>
  )

  let body: ReactNode = null
  if (f.resultCount === 0) {
    body = emptyState
  } else if (state.activeModule === 'achievements') {
    if (achGroups) {
      body = (
        <Box sx={{ mt: 1 }}>
          {achGroups.map((g) => {
            const collapsed = collapsedAchCats.has(g.cat)
            const label = ACHIEVEMENT_CATEGORY_LABEL[g.cat as keyof typeof ACHIEVEMENT_CATEGORY_LABEL]?.[lang] ?? g.cat
            return (
              <Box key={g.cat} sx={{ mb: 1 }}>
                <Box
                  onClick={() =>
                    setCollapsedAchCats((prev) => {
                      const next = new Set(prev)
                      next.has(g.cat) ? next.delete(g.cat) : next.add(g.cat)
                      return next
                    })
                  }
                  sx={{
                    position: 'sticky',
                    top: 57,
                    zIndex: 5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 0.75,
                    px: 0.5,
                    cursor: 'pointer',
                    bgcolor: c.bg,
                    borderBottom: `1px solid ${c.borderSoft}`,
                    fontWeight: 800,
                  }}
                >
                  <Box sx={{ width: 6, height: 20, borderRadius: 3, background: c.amber }} />
                  <span style={{ color: c.text }}>{label}</span>
                  <span style={{ color: c.textDim, fontSize: 12, fontWeight: 600 }}>
                    {g.items.length} 条 {collapsed ? '▸' : '▾'}
                  </span>
                </Box>
                {!collapsed && (
                  <CardGrid>
                    {g.items.map((a) => (
                      <AchievementCard key={a.englishName} ach={a} lang={lang} getWeaponName={getWeaponName} query={query} />
                    ))}
                  </CardGrid>
                )}
              </Box>
            )
          })}
        </Box>
      )
    } else {
      body = (
        <CardGrid>
          {achList.map((a) => (
            <AchievementCard key={a.englishName} ach={a} lang={lang} getWeaponName={getWeaponName} query={query} />
          ))}
        </CardGrid>
      )
    }
  } else if (state.activeModule === 'weapons') {
    body = (
      <CardGrid>
        {weaponList.map((w) => (
          <WeaponCard
            key={w.englishName}
            weapon={w}
            selectedTags={state.weapon.tags}
            onTagClick={f.addWeaponTag}
            lang={lang}
            getWeaponName={getWeaponName}
            getOverclockName={(id) => ocEditor.getName(id, lang)}
            getOverclockEffect={(id) => ocEditor.getEffect(id, lang)}
            query={query}
          />
        ))}
      </CardGrid>
    )
  } else if (state.activeModule === 'equipments') {
    body = (
      <CardGrid>
        {equipList.map((e) => (
          <EquipmentCard
            key={e.name}
            equip={e}
            lang={lang}
            onTypeClick={(tp) => {
              if (f.state.equipment.types.includes(tp)) f.removeEquipmentType(tp)
              else f.addEquipmentType(tp)
            }}
          />
        ))}
      </CardGrid>
    )
  } else if (state.activeModule === 'overclocks') {
    const types: Array<{ type: 'balanced' | 'unstable'; label: string }> = [
      { type: 'balanced', label: lang === 'zh' ? '平衡型' : 'Balanced' },
      { type: 'unstable', label: lang === 'zh' ? '不稳定型' : 'Unstable' },
    ]
    body = (
      <Box sx={{ mt: 1 }}>
        {types.map(({ type, label }) => {
          const items = ocList.filter((o) => o.type === type)
          if (!items.length) return null
          return (
            <Box key={type} sx={{ mb: 1 }}>
              <Box
                sx={{
                  position: 'sticky',
                  top: 57,
                  zIndex: 5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 0.75,
                  px: 0.5,
                  bgcolor: c.bg,
                  borderBottom: `1px solid ${c.borderSoft}`,
                  fontWeight: 800,
                }}
              >
                <Box sx={{ width: 6, height: 20, borderRadius: 3, background: type === 'balanced' ? '#ffcf4d' : '#ff6a5a' }} />
                <span style={{ color: c.text }}>{label}</span>
                <span style={{ color: c.textDim, fontSize: 12, fontWeight: 600 }}>{items.length} 个</span>
              </Box>
              <CardGrid>
                {items.map((o) => (
                  <OverclockLookupCard key={o.id} oc={o} owningWeapons={ocOwners.get(o.id) ?? []} query={query} />
                ))}
              </CardGrid>
            </Box>
          )
        })}
      </Box>
    )
  }

  return (
    <Box component="main" sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 1.5, sm: 3 }, py: 2 }}>
      <TopBar onOpenFilter={() => setDrawerOpen(true)} />
      <GlobalSearch value={state.query} onChange={f.setQuery} onClear={() => f.setQuery('')} />
      <ModuleTabs
        active={state.activeModule}
        onChange={(m: ModuleKey) => f.setActiveModule(m)}
        showOverclocks
      />
      {isMobile ? (
        <SwipeableDrawer
          anchor="bottom"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpen={() => setDrawerOpen(true)}
          PaperProps={{ sx: { bgcolor: c.cardBg, color: c.text } }}
        >
          <Box sx={{ p: 2, pb: 4, maxHeight: '70vh', overflowY: 'auto' }}>
            {filterBar}
          </Box>
        </SwipeableDrawer>
      ) : (
        filterBar
      )}
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {f.resultCount} {t('result.count')}
        </Typography>
      </Box>
      {body}
      <Footer />
    </Box>
  )
}
