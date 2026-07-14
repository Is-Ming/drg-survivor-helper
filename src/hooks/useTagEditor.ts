// 标签/分类编辑器：管理成就分类、武器标签（中英双语）、装备类型
// 数据统一经 useOverrides 持久化到服务端 overrides（tags 字段），不再本地 localStorage。
import { useCallback } from 'react'
import { ACHIEVEMENT_CATEGORIES, WEAPON_TAG_LABEL } from '../data/enums'
import type { Lang, WeaponTagLabel } from '../data/types'
import { useOverrides } from './useOverrides'

// 武器标签默认值（从 types.ts WeaponTag 提取）
const DEFAULT_WEAPON_TAGS = [
  'KINETIC', 'FIRE', 'ELECTRIC', 'COLD', 'ACID', 'PLASMA',
  'LIGHT', 'MEDIUM', 'HEAVY', 'THROWABLE', 'CONSTRUCT',
  'PROJECTILE', 'EXPLOSIVE', 'DRONE', 'TURRET', 'GROUNDZONE',
  'PRECISE', 'SPRAY', 'AREA', 'BEAM', 'LASTING',
]

// 装备类型默认值
const DEFAULT_EQUIPMENT_TYPES = [
  '发育', '拾取', '生存', '经验', '武器', '直伤/混伤',
  '战力', '生存/升级', '直伤核心', '闪避', '暴击', '召唤',
]

export function useTagEditor() {
  const { merged, saveTags } = useOverrides()
  const tags = merged?.tags

  /** 获取成就分类列表（回落默认 19 类） */
  const getCategories = useCallback((): string[] => tags?.achievementCategories ?? ACHIEVEMENT_CATEGORIES, [tags])

  /** 获取武器标签ID列表（回落默认） */
  const getTags = useCallback((): string[] => tags?.weaponTags ?? DEFAULT_WEAPON_TAGS, [tags])

  /** 获取装备类型列表（回落默认） */
  const getTypes = useCallback((): string[] => tags?.equipmentTypes ?? DEFAULT_EQUIPMENT_TYPES, [tags])

  const setCategories = useCallback((list: string[]) => {
    saveTags({ achievementCategories: list })
  }, [saveTags])

  const setTags = useCallback((list: string[]) => {
    saveTags({ weaponTags: list })
  }, [saveTags])

  const setTypes = useCallback((list: string[]) => {
    saveTags({ equipmentTypes: list })
  }, [saveTags])

  /**
   * 获取武器标签展示名：读 merged 覆盖 → 回落静态 WEAPON_TAG_LABEL → 回落 ID。
   * zh/en 独立回落：某维度覆盖为空串/未设置时，仅该维度回落，不影响另一维度。
   */
  const getTagLabel = useCallback((tag: string, lang: Lang): string => {
    const ov = merged?.tags?.weaponTagLabels?.[tag]
    if (ov?.[lang]) return ov[lang] as string
    return getWeaponTagLabel(tag, lang)
  }, [merged])

  /** 写入某维度展示名覆盖（空串等同清除该维度） */
  const saveTagLabel = useCallback((tag: string, lang: Lang, value: string) => {
    saveTags({ weaponTagLabels: { [tag]: { [lang]: value } as WeaponTagLabel } })
  }, [saveTags])

  /** 清除某 tag 的全部覆盖（回落静态/ID）：写入 null 经 deepMergeItem 删除该键 */
  const resetTagLabel = useCallback((tag: string) => {
    saveTags({ weaponTagLabels: { [tag]: null } })
  }, [saveTags])

  return {
    getCategories, getTags, getTypes, setCategories, setTags, setTypes,
    getTagLabel, saveTagLabel, resetTagLabel,
  }
}

/**
 * 获取武器标签的显示名称（优先内置中英映射，回落原始ID）。
 * 作为 getTagLabel 的静态兜底，也供无 context 的纯函数（如 filterWeapons 默认回落）使用。
 * 用法: getWeaponTagLabel('KINETIC', 'zh') → '动能'
 */
export function getWeaponTagLabel(tag: string, lang: Lang): string {
  if (WEAPON_TAG_LABEL[tag as keyof typeof WEAPON_TAG_LABEL]) {
    return WEAPON_TAG_LABEL[tag as keyof typeof WEAPON_TAG_LABEL][lang]
  }
  return tag
}
