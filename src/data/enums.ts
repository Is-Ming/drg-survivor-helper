// 分类枚举与常量集合 + 共享计算逻辑（疑难分档等）
import type {
  AchievementCategory,
  BiomeTier,
  DifficultyTier,
  EquipmentSource,
  Rating,
  WeaponClass,
  WeaponTag,
} from './types'

/** 成就 19 类（按底稿章节顺序，作为筛选枚举） */
export const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [
  '职业解锁',
  '职业进阶',
  '属性统计',
  '装备',
  '武器超频',
  '武器专精',
  '武器真专精',
  '生物群系',
  '武器标签',
  '生物',
  '资源',
  '神器',
  '商店',
  '环境',
  '伤害',
  '护卫',
  '异常·先锋·致命',
  '耐力',
  '其他动作',
]

/** 成就分类中英双存映射（用于筛选下拉与卡片展示） */
export const ACHIEVEMENT_CATEGORY_LABEL: Record<AchievementCategory, { zh: string; en: string }> = {
  '职业解锁': { zh: '职业解锁', en: 'Class Unlock' },
  '职业进阶': { zh: '职业进阶', en: 'Class Mastery' },
  '属性统计': { zh: '属性统计', en: 'Stats' },
  '装备': { zh: '装备', en: 'Equipment' },
  '武器超频': { zh: '完全超频', en: 'Weapon OC' },
  '武器专精': { zh: '武器专精', en: 'Weapon Mastery' },
  '武器真专精': { zh: '深得精髓', en: 'Weapon True Mastery' },
  '生物群系': { zh: '生物群系', en: 'Biomes' },
  '武器标签': { zh: '武器标签', en: 'Weapon Tags' },
  '生物': { zh: '生物', en: 'Enemies' },
  '资源': { zh: '资源', en: 'Resources' },
  '神器': { zh: '神器', en: 'Artifacts' },
  '商店': { zh: '商店', en: 'Shop' },
  '环境': { zh: '环境', en: 'Environment' },
  '伤害': { zh: '伤害', en: 'Damage' },
  '护卫': { zh: '护卫', en: 'Escort' },
  '异常·先锋·致命': { zh: '异常·先锋·致命', en: 'Anomaly·Vanguard·Lethal' },
  '耐力': { zh: '持之以恒', en: 'Endurance' },
  '其他动作': { zh: '其他动作', en: 'Other Actions' },
}

/** 生物群系档位 */
export const BIOME_TIERS: BiomeTier[] = ['H5', 'Mastery', 'TrueMastery']

/** 职业 */
export const WEAPON_CLASSES: WeaponClass[] = ['Scout', 'Gunner', 'Engineer', 'Driller']

/** 强度评级（顺序：S→-） */
export const RATINGS: Rating[] = ['S', 'A', 'B', 'C', '-']

/** 装备来源 */
export const EQUIPMENT_SOURCES: EquipmentSource[] = ['局内附加', '成就解锁']

export const EQUIPMENT_SOURCE_LABEL: Record<EquipmentSource, { zh: string; en: string }> = {
  '局内附加': { zh: '局内附加', en: 'In-run' },
  '成就解锁': { zh: '成就解锁', en: 'Unlock' },
}

/** 装备类型中英映射 */
export const EQUIPMENT_TYPE_LABEL: Record<string, { zh: string; en: string }> = {
  '发育': { zh: '发育', en: 'Development' },
  '拾取': { zh: '拾取', en: 'Pickup' },
  '生存': { zh: '生存', en: 'Survival' },
  '经验': { zh: '经验', en: 'Experience' },
  '武器': { zh: '武器', en: 'Weapon' },
  '直伤/混伤': { zh: '直伤/混伤', en: 'Direct/Hybrid' },
  '战力': { zh: '战力', en: 'Combat Power' },
  '生存/升级': { zh: '生存/升级', en: 'Survival/Lv Up' },
  '直伤核心': { zh: '直伤核心', en: 'Direct Core' },
  '闪避': { zh: '闪避', en: 'Dodge' },
  '暴击': { zh: '暴击', en: 'Critical' },
  '召唤': { zh: '召唤', en: 'Summon' },
}

/**
 * 武器官网标签中英双存映射（源自官方 Wiki Survivor:Weapons，四类）。
 * 存储值用 en（英文枚举）；展示按当前 lang 取 zh / en。
 */
export const WEAPON_TAG_LABEL: Record<WeaponTag, { zh: string; en: string }> = {
  KINETIC: { zh: '动能', en: 'KINETIC' },
  FIRE: { zh: '火焰', en: 'FIRE' },
  ELECTRIC: { zh: '电击', en: 'ELECTRIC' },
  COLD: { zh: '冰冻', en: 'COLD' },
  ACID: { zh: '腐蚀', en: 'ACID' },
  PLASMA: { zh: '等离子', en: 'PLASMA' },
  LIGHT: { zh: '轻型', en: 'LIGHT' },
  MEDIUM: { zh: '中型', en: 'MEDIUM' },
  HEAVY: { zh: '重型', en: 'HEAVY' },
  THROWABLE: { zh: '投掷', en: 'THROWABLE' },
  CONSTRUCT: { zh: '建造', en: 'CONSTRUCT' },
  PROJECTILE: { zh: '弹道', en: 'PROJECTILE' },
  EXPLOSIVE: { zh: '爆炸', en: 'EXPLOSIVE' },
  DRONE: { zh: '无人机', en: 'DRONE' },
  TURRET: { zh: '炮塔', en: 'TURRET' },
  GROUNDZONE: { zh: '地面区域', en: 'GROUNDZONE' },
  PRECISE: { zh: '精准', en: 'PRECISE' },
  SPRAY: { zh: '散射', en: 'SPRAY' },
  AREA: { zh: '范围', en: 'AREA' },
  BEAM: { zh: '光束', en: 'BEAM' },
  LASTING: { zh: '持续', en: 'LASTING' },
}

/** 标签下拉分组（按四类），组名与 dict 的 tag.group.* 保持一致（单一来源，避免双写漂移） */
export const WEAPON_TAG_GROUPS: { group: { zh: string; en: string }; tags: WeaponTag[] }[] = [
  { group: { zh: '伤害类型', en: 'Damage type' }, tags: ['KINETIC', 'FIRE', 'ELECTRIC', 'COLD', 'ACID', 'PLASMA'] },
  { group: { zh: '武器家族', en: 'Weapon family' }, tags: ['LIGHT', 'MEDIUM', 'HEAVY', 'THROWABLE', 'CONSTRUCT'] },
  { group: { zh: '武器类型', en: 'Weapon type' }, tags: ['PROJECTILE', 'EXPLOSIVE', 'DRONE', 'TURRET', 'GROUNDZONE'] },
  { group: { zh: '射击类型', en: 'Firing type' }, tags: ['PRECISE', 'SPRAY', 'AREA', 'BEAM', 'LASTING'] },
]

/** 职业大类中英双存映射（社区通用译名，非暂译） */
export const WEAPON_CLASS_LABEL: Record<WeaponClass, { zh: string; en: string }> = {
  Scout: { zh: '侦察兵', en: 'Scout' },
  Gunner: { zh: '机枪手', en: 'Gunner' },
  Engineer: { zh: '工程师', en: 'Engineer' },
  Driller: { zh: '钻机手', en: 'Driller' },
}

/**
 * 疑难分档（用户决策 Round 2，R2）：
 *   极难 <5% / 难 5–20% / 普通 >20%
 * 空达成率返回 null（决策 5：不高亮、不渲染徽标）。
 * 注意：>20% 一律归「普通」，含 50%–100%；徽标仍渲染但为普通档。
 */
export function getDifficultyTier(rate: number | null): DifficultyTier | null {
  if (rate === null) return null
  if (rate < 5) return 'extreme'
  if (rate <= 20) return 'hard'
  return 'moderate'
}

export const DIFFICULTY_LABEL: Record<DifficultyTier, { zh: string; en: string }> = {
  extreme: { zh: '极难', en: 'Extreme' },
  hard: { zh: '难', en: 'Hard' },
  moderate: { zh: '普通', en: 'Moderate' },
}

export const RATING_LABEL: Record<Rating, string> = {
  S: 'S',
  A: 'A',
  B: 'B',
  C: 'C',
  '-': '-',
}

