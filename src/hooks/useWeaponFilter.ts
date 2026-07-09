// 武器筛选：职业 + 评级 + 已选标签（标签为 AND）+ 全局 query
import { useMemo } from 'react'
import { weapons } from '../data/weapons'
import type { SearchState, Weapon, WeaponTag } from '../data/types'
import { WEAPON_TAG_LABEL } from '../data/enums'
import { matchesQuery } from './useAchievementFilter'

export function filterWeapons(data: Weapon[], state: SearchState): Weapon[] {
  const { query, weapon } = state
  return data.filter((w) => {
    if (weapon.class && w.class !== weapon.class) return false
    if (weapon.rating && w.rating !== weapon.rating) return false
    if (weapon.tags.length > 0 && !weapon.tags.every((t) => w.tags.includes(t))) return false
    // 搜索匹配：武器名 + 官网标签枚举值（英）/中文标签参与（去混杂后仍可搜中英文）
    const tagText = w.tags
      .map((tg: WeaponTag) => {
        const label = WEAPON_TAG_LABEL[tg]
        return label ? `${tg} ${label.zh} ${label.en}` : tg
      })
      .join(' ')
    const hay = `${w.englishName} ${w.chineseName} ${tagText} ${w.class}`
    return matchesQuery(hay, query)
  })
}

export function useWeaponFilter(state: SearchState): Weapon[] {
  return useMemo(() => filterWeapons(weapons, state), [state])
}
