// 数据实体与 UI 状态类型定义（严格对应底稿表头 + 架构决策）

/** 成就分类：底稿 19 类（PRD 4.2） */
export type AchievementCategory =
  | '职业解锁'
  | '职业进阶'
  | '属性统计'
  | '装备'
  | '武器超频'
  | '武器专精'
  | '武器真专精'
  | '生物群系'
  | '武器标签'
  | '生物'
  | '资源'
  | '神器'
  | '商店'
  | '环境'
  | '伤害'
  | '护卫'
  | '异常·先锋·致命'
  | '耐力'
  | '其他动作'

/** 生物群系档位（仅“生物群系”类成就填，其余为空） */
export type BiomeTier = 'H5' | 'Mastery' | 'TrueMastery'

/**
 * 武器名模板引用：将硬编码武器名替换为 {weapon} 占位符，并标注 weaponRef（= 武器 englishName 的 slug）。
 * 渲染时由 getWeaponName(weaponRef, lang) 实时拼装，武器名变更后成就自动同步。
 * 仅承载中文名的字段用 name 键；仅承载解锁条件的字段用 unlockCondition 键；二者互斥。
 */
export interface WeaponRefTemplate {
  weaponRef: string
  name?: string
  unlockCondition?: string
}

export interface Achievement {
  englishName: string
  chineseName: string | WeaponRefTemplate
  /** 分类：单值（原 19 类）或主理人拍板的多值数组，均允许 */
  category: string | string[]
  unlockCondition: string | WeaponRefTemplate
  /** 英文解锁条件（TrueAchievements 来源） */
  enUnlockCondition?: string
  /** 仅生物群系类有值；其余为 undefined */
  biomeTier?: BiomeTier
  /** 关键：达成率。239/300 有值，61 条为空 → 用 number | null。
   *  空值 UI 一律不渲染徽标、不高亮（决策 5）。 */
  completionRate: number | null
  /** 版本标记：原样保留 '当前' / '待核' 等（决策 6，不杜撰）。 */
  version: string
}

/** 职业 */
export type WeaponClass = 'Scout' | 'Gunner' | 'Engineer' | 'Driller'

/** 武器官网标签（四类，源自官方 Wiki Survivor:Weapons）。
 *  存英文枚举，展示经 WEAPON_TAG_LABEL 映射为中文（中文(英文) / 英文）。 */
export type WeaponTag =
  // 伤害类型 Damage type
  | 'KINETIC' | 'FIRE' | 'ELECTRIC' | 'COLD' | 'ACID' | 'PLASMA'
  // 武器家族 Weapon family
  | 'LIGHT' | 'MEDIUM' | 'HEAVY' | 'THROWABLE' | 'CONSTRUCT'
  // 武器类型 Weapon type
  | 'PROJECTILE' | 'EXPLOSIVE' | 'DRONE' | 'TURRET' | 'GROUNDZONE'
  // 射击类型 Firing type
  | 'PRECISE' | 'SPRAY' | 'AREA' | 'BEAM' | 'LASTING'

/**
 * 武器标签展示名覆盖：中英独立，写入 overrides.tags.weaponTagLabels。
 * - 仅覆盖有值的维度；某维度写空串等同清除该维度（回落静态/ID）。
 * - 值为 null（仅 overrides 侧合法）表示该 tag 的覆盖被清除（回落静态）。
 */
export interface WeaponTagLabel {
  zh?: string
  en?: string
}

/** 小职业（Class Mod）—— 中文译名（4 职业 × 3 = 12） */
export interface ClassMod {
  /** 英文规范名，如 'Classic' / 'Recon' */
  englishName: string
  /** 中文译名，如 '经典' / '侦察' */
  chineseName: string
  /** 是否暂译标记（现统一为 false，译名已确认，UI 不再显示角标） */
  isTentative: boolean
  /** 小职业能力简述（来源于 Wiki，可选） */
  desc?: string
  /** 起始武器（英文规范名，与 weapons.ts 对齐；来源 Wiki Class_Mods） */
  startWeapon?: string
}

/** 职业大类（武器归属维度，与 Weapon.class 一一对应） */
export interface GameClass {
  /** 与 WeaponClass 完全一致，如 'Scout' */
  englishName: WeaponClass
  /** 社区通用译名，非暂译，如 '侦察兵' */
  chineseName: string
  subclasses: ClassMod[]
}

/** 强度评级（攻略作者主观，UI 须标注仅供参考，决策 7） */
export type Rating = 'S' | 'A' | 'B' | 'C' | '-'

/** 超频主表条目（用于超频管理标签页与武器引用） */
export interface Overclock {
  /** 唯一标识，kebab-case */
  id: string
  /** 英文官方名 */
  englishName: string
  /** 用户可选中文名（可在超频管理页编辑，持久化 localStorage） */
  chineseName: string
  /** 平衡型(黄) / 不稳定型(红) */
  type: 'balanced' | 'unstable'
  /** 效果描述（中文） */
  effect: string
  /** 效果描述（英文，原始 Wiki） */
  enEffect?: string
}

export interface Weapon {
  englishName: string
  chineseName: string
  class: WeaponClass
  /** 官网四类标签枚举（英存中显），供 chip 渲染与标签筛选 */
  tags: WeaponTag[]
  /** 黄色超频（6/12 级），整列文本展示 */
  yellowOverclock: string
  /** 红色超频（18 级），整列文本展示 */
  redOverclock: string
  /** 黄色超频 ID 列表（引用 overclocks 主表） */
  yellowOverclockIds?: string[]
  /** 红色超频 ID 列表（引用 overclocks 主表） */
  redOverclockIds?: string[]
  rating: Rating
  /** 版本标记；允许 '待核(规范名映射)'（决策 6） */
  version: string
  /** 可选：待核备注（当前底稿已并入 version 字段，预留扩展） */
  note?: string
}

/** 装备来源 */
export type EquipmentSource = '局内附加' | '成就解锁'

export interface Equipment {
  name: string
  /** 类型：单值（原默认值）或主理人拍板的多值数组，均允许 */
  type: string | string[]
  effect: string
  source: EquipmentSource
  /** 成就解锁类填对应成就（含英文名/旧名注释）；局内附加为空 */
  relatedAchievement?: string
  /** 官网名（官方 Artifacts 表，R5）；查不到标「待核」 */
  officialName?: string
  /** 官网效果原文（英文，R5）；待核项注明 */
  officialEffect?: string
  /** 版本标记；允许 '待核'（1.0 可能新增，决策 6） */
  version: string
}

// ---------- UI 偏好 / 检索态 ----------

export type ThemeMode = 'light' | 'dark'
export type Lang = 'zh' | 'en'

/** UI 偏好（持久化到 localStorage） */
export interface UiPreferences {
  theme: ThemeMode
  lang: Lang
}

/** 当前激活模块 */
export type ModuleKey = 'achievements' | 'weapons' | 'equipments' | 'overclocks' | 'tags'

/** 疑难分档 */
export type DifficultyTier = 'extreme' | 'hard' | 'moderate'

/** 全局检索态：搜索词 + 当前 Tab + 各模块筛选（AND 组合） */
export interface SearchState {
  query: string
  activeModule: ModuleKey
  achievement: {
    categories: AchievementCategory[]
    /** 疑难高亮开关（默认开，决策 7 默认开） */
    onlyDifficult: boolean
    /** 难度三档多选筛选（R2）；空/未定义=不过滤 */
    difficulty?: DifficultyTier[]
  }
  weapon: {
    class?: WeaponClass
    rating?: Rating
    tags: WeaponTag[]
  }
  equipment: {
    types: string[]
    source?: EquipmentSource
  }
}
