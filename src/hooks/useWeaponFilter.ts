// 武器筛选：职业 + 评级 + 已选标签（标签为 AND）+ 全局 query + 名称排序
import { useMemo } from 'react'
import { weapons } from '../data/weapons'
import type { Lang, SearchState, Weapon, WeaponTag } from '../data/types'
import { WEAPON_TAG_LABEL } from '../data/enums'
import { matchesQuery } from './useAchievementFilter'
import { useTagEditor } from './useTagEditor'

/**
 * 默认标签展示名解析（向后兼容）：读静态 WEAPON_TAG_LABEL → 回落原始 ID。
 * 供无 context 的纯函数调用；带 context 的 useWeaponFilter 会注入 editor.getTagLabel。
 */
const defaultGetTagLabel = (tg: string, l: Lang): string =>
  WEAPON_TAG_LABEL[tg as WeaponTag]?.[l] ?? tg

/**
 * 武器排序：仅按 chineseName 本地化比较（zh-CN）。
 * sort='name-asc' 升序 / 'name-desc' 降序 / undefined 保持原序（返回原引用）。
 */
export function sortWeapons(data: Weapon[], sort?: 'name-asc' | 'name-desc'): Weapon[] {
  if (!sort) return data
  const factor = sort === 'name-asc' ? 1 : -1
  return [...data].sort((a, b) => a.chineseName.localeCompare(b.chineseName, 'zh-CN') * factor)
}

export function filterWeapons(
  data: Weapon[],
  state: SearchState,
  getTagLabel: (tg: string, l: Lang) => string = defaultGetTagLabel,
): Weapon[] {
  const { query, weapon } = state
  const filtered = data.filter((w) => {
    if (weapon.class && w.class !== weapon.class) return false
    if (weapon.rating && w.rating !== weapon.rating) return false
    if (weapon.tags.length > 0 && !weapon.tags.every((t) => w.tags.includes(t))) return false
    // 搜索匹配：武器名 + 标签展示名（中/英）+ 英文枚举值（去混杂后仍可搜中英文）
    const tagText = w.tags
      .map((tg: WeaponTag) => {
        const zh = getTagLabel(tg, 'zh')
        const en = getTagLabel(tg, 'en')
        return `${tg} ${zh} ${en}`
      })
      .join(' ')
    const hay = `${w.englishName} ${w.chineseName} ${tagText} ${w.class}`
    return matchesQuery(hay, query)
  })
  return sortWeapons(filtered, weapon.sort)
}

export function useWeaponFilter(state: SearchState): Weapon[] {
  const editor = useTagEditor()
  return useMemo(
    () => filterWeapons(weapons, state, editor.getTagLabel),
    [state, editor.getTagLabel],
  )
}
