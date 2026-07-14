// 旧版 localStorage 自定义数据迁移到服务端 overrides（幂等）。
// 仅处理架构师实测确认的真实键名；无任何遗留键时返回原样（migrated: false）。
// 注意：本模块在浏览器环境运行（直接读写 localStorage），不可在服务端调用。
import type { Equipment, Rating } from '../data/types'
import type { OverridesData } from './useOverrides'

/**
 * 深合并单条目：对象递归、数组整体替换、""/null 视为删除（语义对齐 useOverrides.deepMergeItem）。
 * 返回 undefined 表示调用方应删除该 key（回落 baseline）。
 */
function deepMergeItem(base: unknown, override: unknown): unknown {
  if (override === null || override === '') return undefined
  if (Array.isArray(override)) return override
  if (typeof override === 'object' && override !== null) {
    const baseObj =
      base && typeof base === 'object' && !Array.isArray(base) ? (base as Record<string, unknown>) : {}
    const out: Record<string, unknown> = { ...baseObj }
    const ov = override as Record<string, unknown>
    for (const key of Object.keys(ov)) {
      const merged = deepMergeItem(baseObj[key], ov[key])
      if (merged === undefined) delete out[key]
      else out[key] = merged
    }
    return out
  }
  return override
}

// 架构师实测的真实键名（PRD 部分键名有误，以这些为准）
const SINGLE_KEYS = {
  tagEdits: 'drg-tag-edits',
  overclockEdits: 'drg-overclock-edits',
} as const

const PREFIXES = {
  wpnOc: 'drg-wpn-oc-', // 每武器超频引用 { yellow?, red? }
  achEdit: 'drg-ach-edit-', // 成就名/条件 + 分类(数组) { chineseName?, unlockCondition?, categories? }
  eqpEdit: 'drg-eqp-edit-', // 装备字段 + 类型(数组) { name?, officialName?, officialEffect?, effect?, types? }
  wpnRating: 'drg-wpn-rating-', // 武器评级（单值字符串）
  wpnCardTags: 'drg-wpn-cardtags-', // 武器卡片标签（string[]）
} as const

/** 读取并解析 localStorage JSON（失败/缺失返回 null） */
function readJson<T = unknown>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/** 删除遗留键（仅当存在时），并记录到 cleared 列表 */
function removeKey(key: string, cleared: string[]): void {
  try {
    if (localStorage.getItem(key) !== null) {
      localStorage.removeItem(key)
      cleared.push(key)
    }
  } catch {
    /* 忽略：隐私模式等无法访问 localStorage 的场景 */
  }
}

/** 取对象中存在的字段（跳过 undefined / null），用于构造紧凑 patch */
function pickDefined<T extends object>(
  obj: T | null | undefined,
  keys: (keyof T)[],
): Partial<Record<keyof T, unknown>> {
  const out: Partial<Record<keyof T, unknown>> = {}
  if (!obj) return out
  for (const k of keys) {
    const v = obj[k]
    if (v !== undefined && v !== null) out[k] = v
  }
  return out
}

export interface MigrateResult {
  overrides: OverridesData
  clearedKeys: string[]
  migrated: boolean
}

/**
 * 将旧版 localStorage 自定义数据迁移进现有 overrides（current）。
 * 幂等：若没有任何遗留键，返回 { overrides: current, clearedKeys: [], migrated: false }。
 * 映射关系（架构师实测确认）：
 *   drg-tag-edits            → tags.{weaponTags,achievementCategories,equipmentTypes}
 *   drg-wpn-oc-<en>          → weapons[en].{yellowOverclockIds,redOverclockIds}
 *   drg-ach-edit-<en>        → achievements[en].{chineseName,unlockCondition,category}
 *   drg-eqp-edit-<name>      → equipments[name].{name,officialName,officialEffect,effect,type}
 *   drg-wpn-rating-<en>      → weapons[en].rating
 *   drg-wpn-cardtags-<en>    → cardTags[en]
 *   drg-overclock-edits      → overclocks[id].{chineseName,effect}
 */
export function migrateLegacyOverrides(current: OverridesData): MigrateResult {
  const clearedKeys: string[] = []

  const weaponsPatch: Record<string, { chineseName?: string; rating?: Rating; yellowOverclockIds?: string[]; redOverclockIds?: string[] }> = {}
  const achievementsPatch: Record<string, { chineseName?: string; unlockCondition?: string; category?: string | string[] }> = {}
  const equipmentsPatch: Record<string, Partial<Equipment>> = {}
  const overclocksPatch: Record<string, { chineseName?: string; effect?: string }> = {}
  let tagsPatch: { weaponTags?: string[]; achievementCategories?: string[]; equipmentTypes?: string[] } = {}
  const cardTagsPatch: Record<string, string[]> = {}

  let found = false

  // 1) drg-tag-edits（单一键）
  const tagEdits = readJson<{ weaponTags?: string[]; achievementCategories?: string[]; equipmentTypes?: string[] }>(
    SINGLE_KEYS.tagEdits,
  )
  if (tagEdits !== null) {
    const picked = pickDefined(tagEdits, ['weaponTags', 'achievementCategories', 'equipmentTypes'])
    if (Object.keys(picked).length > 0) {
      tagsPatch = { ...tagsPatch, ...(picked as typeof tagsPatch) }
      found = true
    }
    removeKey(SINGLE_KEYS.tagEdits, clearedKeys)
  }

  // 2) drg-overclock-edits（单一键，Record<id, {chineseName?, effect?}>）
  const ocEdits = readJson<Record<string, { chineseName?: string; effect?: string }>>(SINGLE_KEYS.overclockEdits)
  if (ocEdits !== null) {
    for (const [id, v] of Object.entries(ocEdits)) {
      if (v && (typeof v.chineseName === 'string' || typeof v.effect === 'string')) {
        overclocksPatch[id] = {
          ...(typeof v.chineseName === 'string' ? { chineseName: v.chineseName } : {}),
          ...(typeof v.effect === 'string' ? { effect: v.effect } : {}),
        }
        found = true
      }
    }
    removeKey(SINGLE_KEYS.overclockEdits, clearedKeys)
  }

  // 3) 扫描带前缀的动态键（一次性读取所有 key，避免遍历时删除导致索引漂移）
  const dynKeys: string[] = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k) dynKeys.push(k)
    }
  } catch {
    /* 忽略 */
  }

  for (const key of dynKeys) {
    if (key.startsWith(PREFIXES.wpnOc)) {
      const en = key.slice(PREFIXES.wpnOc.length)
      const v = readJson<{ yellow?: string[]; red?: string[] }>(key)
      if (v) {
        if (!weaponsPatch[en]) weaponsPatch[en] = {}
        const wp = weaponsPatch[en]
        if (Array.isArray(v.yellow) && v.yellow.length > 0) wp.yellowOverclockIds = v.yellow
        if (Array.isArray(v.red) && v.red.length > 0) wp.redOverclockIds = v.red
        if (wp.yellowOverclockIds || wp.redOverclockIds) found = true
      }
      removeKey(key, clearedKeys)
    } else if (key.startsWith(PREFIXES.achEdit)) {
      const en = key.slice(PREFIXES.achEdit.length)
      const v = readJson<{ chineseName?: string; unlockCondition?: string; categories?: string[] }>(key)
      if (v) {
        if (!achievementsPatch[en]) achievementsPatch[en] = {}
        const ap = achievementsPatch[en]
        if (typeof v.chineseName === 'string' && v.chineseName) ap.chineseName = v.chineseName
        if (typeof v.unlockCondition === 'string' && v.unlockCondition) ap.unlockCondition = v.unlockCondition
        if (Array.isArray(v.categories) && v.categories.length > 0) ap.category = v.categories
        if (Object.keys(ap).length > 0) found = true
      }
      removeKey(key, clearedKeys)
    } else if (key.startsWith(PREFIXES.eqpEdit)) {
      const name = key.slice(PREFIXES.eqpEdit.length)
      const v = readJson<{ name?: string; officialName?: string; officialEffect?: string; effect?: string; types?: string[] }>(key)
      if (v) {
        if (!equipmentsPatch[name]) equipmentsPatch[name] = {}
        const ep = equipmentsPatch[name]
        if (typeof v.name === 'string' && v.name) ep.name = v.name
        if (typeof v.officialName === 'string' && v.officialName) ep.officialName = v.officialName
        if (typeof v.officialEffect === 'string' && v.officialEffect) ep.officialEffect = v.officialEffect
        if (typeof v.effect === 'string' && v.effect) ep.effect = v.effect
        if (Array.isArray(v.types) && v.types.length > 0) ep.type = v.types
        if (Object.keys(ep).length > 0) found = true
      }
      removeKey(key, clearedKeys)
    } else if (key.startsWith(PREFIXES.wpnRating)) {
      const en = key.slice(PREFIXES.wpnRating.length)
      const raw = localStorage.getItem(key)
      if (raw !== null && raw !== '') {
        if (!weaponsPatch[en]) weaponsPatch[en] = {}
        weaponsPatch[en].rating = raw as Rating
        found = true
      }
      removeKey(key, clearedKeys)
    } else if (key.startsWith(PREFIXES.wpnCardTags)) {
      const en = key.slice(PREFIXES.wpnCardTags.length)
      const v = readJson<string[]>(key)
      if (Array.isArray(v)) {
        cardTagsPatch[en] = v
        found = true
      }
      removeKey(key, clearedKeys)
    }
  }

  // 无任何遗留数据：原样返回（幂等，不污染 current）
  if (!found) {
    return { overrides: current, clearedKeys: [], migrated: false }
  }

  // 组装增量 patch 并深合并进 current（patch 优先；数组整体替换；''/null 删除）
  const patch: OverridesData = {}
  if (Object.keys(weaponsPatch).length > 0) patch.weapons = weaponsPatch
  if (Object.keys(achievementsPatch).length > 0) patch.achievements = achievementsPatch
  if (Object.keys(equipmentsPatch).length > 0) patch.equipments = equipmentsPatch
  if (Object.keys(overclocksPatch).length > 0) patch.overclocks = overclocksPatch
  if (Object.keys(tagsPatch).length > 0) patch.tags = tagsPatch
  if (Object.keys(cardTagsPatch).length > 0) patch.cardTags = cardTagsPatch

  const overrides = deepMergeItem(current, patch) as OverridesData
  return { overrides, clearedKeys, migrated: true }
}
