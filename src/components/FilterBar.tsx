// 筛选区容器：随当前 Tab 切换对应模块筛选器
import { Box, Divider } from '@mui/material'
import type {
  AchievementCategory, EquipmentSource, Lang, ModuleKey, Rating, SearchState, WeaponClass, WeaponTag,
} from '../data/types'
import { AchievementFilters } from './filters/AchievementFilters'
import { WeaponFilters } from './filters/WeaponFilters'
import { EquipmentFilters } from './filters/EquipmentFilters'

export function FilterBar({
  activeModule, state, setAchievementFilter, setAchievementSort,
  addAchievementCategory, removeAchievementCategory,
  setWeaponClass, setWeaponRating, addWeaponTag, removeWeaponTag, setWeaponSort,
  addEquipmentType, removeEquipmentType, setEquipmentSource, lang,
}: {
  activeModule: ModuleKey; state: SearchState
  setAchievementFilter: (patch: Partial<SearchState['achievement']>) => void
  setAchievementSort: (sort: SearchState['achievement']['sort']) => void
  addAchievementCategory: (c: AchievementCategory) => void
  removeAchievementCategory: (c: AchievementCategory) => void
  setWeaponClass: (c?: WeaponClass) => void; setWeaponRating: (r?: Rating) => void
  addWeaponTag: (tag: WeaponTag) => void; removeWeaponTag: (tag: WeaponTag) => void
  setWeaponSort: (sort: SearchState['weapon']['sort']) => void
  addEquipmentType: (t: string) => void; removeEquipmentType: (t: string) => void
  setEquipmentSource: (s?: EquipmentSource) => void; lang: Lang
}) {
  return (
    <Box sx={{ mt: 1.5 }}>
      <Divider sx={{ mb: 1.5 }} />
      {activeModule === 'achievements' && (
        <AchievementFilters
          state={state} setAchievementFilter={setAchievementFilter} setAchievementSort={setAchievementSort}
          addCategory={addAchievementCategory} removeCategory={removeAchievementCategory} lang={lang} />
      )}
      {activeModule === 'weapons' && (
        <WeaponFilters state={state} setWeaponClass={setWeaponClass} setWeaponRating={setWeaponRating}
          addWeaponTag={addWeaponTag} removeWeaponTag={removeWeaponTag} setWeaponSort={setWeaponSort} lang={lang} />
      )}
      {activeModule === 'equipments' && (
        <EquipmentFilters state={state} addType={addEquipmentType} removeType={removeEquipmentType}
          setEquipmentSource={setEquipmentSource} lang={lang} />
      )}
    </Box>
  )
}
