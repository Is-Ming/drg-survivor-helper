// 武器名解析工具：slug 互转、模板字段解析、bundled 兜底 resolver。
// 设计：成就中文名/解锁条件可由 WeaponRefTemplate（{weaponRef, name?/unlockCondition?}）承载，
//      渲染时经 getWeaponName(ref, lang) 实时把 {weapon} 占位符替换为对应武器显示名，
//      武器名变更后所有引用该武器的成就自动同步。
import type { Lang, Weapon, WeaponRefTemplate } from '../data/types'
import { weapons as bundledWeapons } from '../data/weapons'

/** 武器引用：slug 字符串，或 { weaponRef, fallbackEn? } 对象 */
export type WeaponRef = string | { weaponRef: string; fallbackEn?: string }

/** 武器名解析器：给定武器引用 + 语言，返回显示名 */
export type WeaponNameResolver = (ref: WeaponRef, lang: Lang) => string

/** 武器 englishName -> slug（与服务端生成脚本、baseline.json 中的 weaponRef 完全一致） */
export function slugify(englishName: string): string {
  return englishName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
}

/** 由武器数组构建 slug -> Weapon 映射 */
export function buildSlugMap(weapons: Weapon[]): Map<string, Weapon> {
  const map = new Map<string, Weapon>()
  for (const w of weapons) {
    map.set(slugify(w.englishName), w)
  }
  return map
}

const bundledSlugMap = buildSlugMap(bundledWeapons)

/**
 * bundled 兜底 resolver：无 Provider 时（如单元测试、SSR 初态）使用 TS 数据解析 slug。
 * 仅支持 slug 字符串形式；对象形式回落 fallbackEn 或 weaponRef。
 */
export const bundledWeaponNameResolver: WeaponNameResolver = (ref, lang) => {
  const slug = typeof ref === 'string' ? ref : ref.weaponRef
  const w = bundledSlugMap.get(slug)
  if (!w) return typeof ref === 'string' ? ref : (ref.fallbackEn ?? ref.weaponRef)
  return lang === 'zh' ? (w.chineseName || w.englishName) : w.englishName
}

/**
 * 将 string | WeaponRefTemplate 字段解析为最终显示字符串。
 * - 字符串：原样返回
 * - 模板：用 getWeaponName(weaponRef, lang) 解析出的武器名替换所有 {weapon} 占位符
 */
export function resolveField(
  field: string | WeaponRefTemplate,
  getWeaponName: WeaponNameResolver,
  lang: Lang,
): string {
  if (typeof field === 'string') return field
  const weaponName = getWeaponName(field.weaponRef, lang)
  if (typeof field.name === 'string') return field.name.replace(/\{weapon\}/g, weaponName)
  if (typeof field.unlockCondition === 'string') {
    return field.unlockCondition.replace(/\{weapon\}/g, weaponName)
  }
  return weaponName
}
