// 筛选区容器：随当前 Tab 切换对应模块筛选器
import { Box, Divider } from '@mui/material'
import type {
  Lang,
  ModuleKey,
  Rating,
  SearchState,
  WeaponClass,
  WeaponTag,
  EquipmentSource,
} from '../data/types'
import { AchievementFilters } from './filters/AchievementFilters'
import { WeaponFilters } from './filters/WeaponFilters'
import { EquipmentFilters } from './filters/EquipmentFilters'

export function FilterBar({
  activeModule,
  state,
  setAchievementFilter,
  setWeaponClass,
  setWeaponRating,
  addWeaponTag,
  removeWeaponTag,
  setEquipmentType,
  setEquipmentSource,
  lang,
}: {
  activeModule: ModuleKey
  state: SearchState
  setAchievementFilter: (patch: Partial<SearchState['achievement']>) => void
  setWeaponClass: (c?: WeaponClass) => void
  setWeaponRating: (r?: Rating) => void
  addWeaponTag: (tag: WeaponTag) => void
  removeWeaponTag: (tag: WeaponTag) => void
  setEquipmentType: (t?: string) => void
  setEquipmentSource: (s?: EquipmentSource) => void
  lang: Lang
}) {
  return (
    <Box sx={{ mt: 1.5 }}>
      <Divider sx={{ mb: 1.5 }} />
      {activeModule === 'achievements' && (
        <AchievementFilters state={state} setAchievementFilter={setAchievementFilter} lang={lang} />
      )}
      {activeModule === 'weapons' && (
        <WeaponFilters
          state={state}
          setWeaponClass={setWeaponClass}
          setWeaponRating={setWeaponRating}
          addWeaponTag={addWeaponTag}
          removeWeaponTag={removeWeaponTag}
          lang={lang}
        />
      )}
      {activeModule === 'equipments' && (
        <EquipmentFilters
          state={state}
          setEquipmentType={setEquipmentType}
          setEquipmentSource={setEquipmentSource}
          lang={lang}
        />
      )}
    </Box>
  )
}
