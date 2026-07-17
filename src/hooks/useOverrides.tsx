// 运行时数据层：拉取服务端 baseline/overrides 并合并，提供武器名解析与持久化动作。
// - 有服务端：GET /api/baseline + GET /api/overrides 合并渲染；写操作带 X-Admin-Token。
// - 无服务端（本地 / 构建静态托管）：降级读取 public/baseline.json；overrides 视为空 {}。
// 合并语义：merged = deepMerge(baseline, overrides)，overrides 优先；
//          数组整体替换；""/null 视为删除（回落 baseline）；记录按主键（englishName/id/name）合并。
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type {
  Achievement,
  Equipment,
  Lang,
  Overclock,
  Rating,
  Weapon,
  WeaponRefTemplate,
  WeaponTagLabel,
} from '../data/types'
import { buildSlugMap, type WeaponNameResolver, type WeaponRef } from '../utils/weaponName'
import { migrateLegacyOverrides } from './useOverridesMigration'

const API_BASE = '/api'
const PUBLIC_BASELINE = '/baseline.json'
const ADMIN_TOKEN_KEY = 'drg-helper-admin-token'
const EMPTY_OVERRIDES: OverridesData = {}

export interface BaselineData {
  weapons: Weapon[]
  achievements: Achievement[]
  equipments: Equipment[]
  overclocks: Overclock[]
  tags: {
    weaponTags?: string[]
    achievementCategories?: string[]
    equipmentTypes?: string[]
    equipmentSources?: string[]
    weaponTagLabels?: Record<string, WeaponTagLabel>
  }
  cardTags: Record<string, string[]>
}

export interface AchievementOverride {
  chineseName?: string | WeaponRefTemplate
  unlockCondition?: string | WeaponRefTemplate
  /** 分类：单值（原 19 类）或主理人拍板的多值数组，均允许 */
  category?: string | string[]
  [key: string]: unknown
}

export interface OverridesData {
  weapons?: Record<string, { chineseName?: string; rating?: Rating; yellowOverclockIds?: string[]; redOverclockIds?: string[] }>
  achievements?: Record<string, AchievementOverride>
  equipments?: Record<string, Partial<Equipment> & Record<string, unknown>>
  overclocks?: Record<string, Partial<Overclock> & Record<string, unknown>>
  tags?: {
    weaponTags?: string[]
    achievementCategories?: string[]
    equipmentTypes?: string[]
    equipmentSources?: string[]
    weaponTagLabels?: Record<string, WeaponTagLabel | null>
  }
  cardTags?: Record<string, string[]>
}

export type MergedData = BaselineData

export interface OverridesContextValue {
  baseline: BaselineData | null
  overrides: OverridesData
  merged: MergedData | null
  getWeaponName: WeaponNameResolver
  saveOverride: (partial: Partial<OverridesData>) => void
  saveTags: (patch: {
    weaponTags?: string[]
    achievementCategories?: string[]
    equipmentTypes?: string[]
    equipmentSources?: string[]
    weaponTagLabels?: Record<string, WeaponTagLabel | null>
  }) => void
  saveWeaponRating: (englishName: string, rating: Rating | '') => void
  saveWeaponOverclockIds: (englishName: string, type: 'yellow' | 'red', ids: string[]) => void
  saveCardTags: (key: string, tags: string[]) => void
  saveOverclockEdit: (id: string, patch: { chineseName?: string; effect?: string }) => void
  saveAchievementEdit: (englishName: string, patch: { chineseName?: string; unlockCondition?: string; category?: string | string[] }) => void
  saveEquipmentEdit: (name: string, patch: Partial<Equipment>) => void
  deleteEquipment: (name: string) => Promise<{ ok: boolean }>
  resetOverrides: () => Promise<void>
  pinBaseline: () => Promise<{ ok: boolean; version?: number }>
  ready: boolean
  serverAvailable: boolean
}

const OverridesContext = createContext<OverridesContextValue | null>(null)

/** 深合并单条目：对象递归、数组整体替换、""/null 视为删除（回落 baseline） */
function deepMergeItem(base: unknown, override: unknown): unknown {
  if (override === null || override === '') return undefined
  if (Array.isArray(override)) return override
  if (typeof override === 'object' && override !== null) {
    const baseObj = (base && typeof base === 'object' && !Array.isArray(base) ? base : {}) as Record<string, unknown>
    const out: Record<string, unknown> = { ...baseObj }
    const ov = override as Record<string, unknown>
    for (const key of Object.keys(ov)) {
      const merged = deepMergeItem(baseObj[key], ov[key])
      if (merged === undefined) {
        delete out[key]
      } else {
        out[key] = merged
      }
    }
    return out
  }
  return override
}

/** 按主键（englishName/id/name）合并数组条目（baseline 数组 + override 记录） */
function mergeByIdKey<T extends Record<string, unknown>>(
  baseArr: T[],
  overrideMap: Record<string, Partial<T>> | undefined,
  idKey: string,
): T[] {
  if (!overrideMap) return baseArr
  return baseArr.map((item) => {
    const ov = overrideMap[item[idKey] as string]
    if (!ov) return item
    return deepMergeItem(item, ov) as T
  })
}

function mergeDatasets(baseline: BaselineData, overrides: OverridesData): MergedData {
  return {
    weapons: mergeByIdKey(
      baseline.weapons as unknown as Record<string, unknown>[],
      overrides.weapons,
      'englishName',
    ) as unknown as Weapon[],
    achievements: mergeByIdKey(
      baseline.achievements as unknown as Record<string, unknown>[],
      overrides.achievements,
      'englishName',
    ) as unknown as Achievement[],
    equipments: mergeByIdKey(
      baseline.equipments as unknown as Record<string, unknown>[],
      overrides.equipments,
      'name',
    ) as unknown as Equipment[],
    overclocks: mergeByIdKey(
      baseline.overclocks as unknown as Record<string, unknown>[],
      overrides.overclocks,
      'id',
    ) as unknown as Overclock[],
    tags: (deepMergeItem(baseline.tags, overrides.tags) as BaselineData['tags']) ?? baseline.tags,
    cardTags:
      (deepMergeItem(baseline.cardTags, overrides.cardTags) as Record<string, string[]>) ?? baseline.cardTags,
  }
}

function getAdminToken(): string {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

export function OverridesProvider({ children }: { children: ReactNode }) {
  const [baseline, setBaseline] = useState<BaselineData | null>(null)
  const [overrides, setOverrides] = useState<OverridesData>(EMPTY_OVERRIDES)
  const [ready, setReady] = useState(false)
  const [serverAvailable, setServerAvailable] = useState(false)

  const serverAvailableRef = useRef(false)
  const overridesRef = useRef<OverridesData>(EMPTY_OVERRIDES)
  const putTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const merged = useMemo<MergedData | null>(
    () => (baseline ? mergeDatasets(baseline, overrides) : null),
    [baseline, overrides],
  )

  const slugMap = useMemo(() => buildSlugMap(merged?.weapons ?? []), [merged])

  const getWeaponName = useCallback<WeaponNameResolver>((ref: WeaponRef, lang: Lang) => {
    const slug = typeof ref === 'string' ? ref : ref.weaponRef
    const w = slugMap.get(slug)
    if (!w) return typeof ref === 'string' ? ref : (ref.fallbackEn ?? ref.weaponRef)
    return lang === 'zh' ? (w.chineseName || w.englishName) : w.englishName
  }, [slugMap])

  // ---- 持久化写操作 ----
  const putOverrides = useCallback((data: OverridesData) => {
    const token = getAdminToken()
    fetch(`${API_BASE}/overrides`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token },
      body: JSON.stringify(data),
    }).catch(() => {
      /* 忽略网络错误，前端状态已乐观更新 */
    })
  }, [])

  // 深合并写：复用 deepMergeItem，保证同一 weapons[en] 上多个字段（chineseName/rating/超频引用）互不覆盖
  const saveOverride = useCallback(
    (partial: Partial<OverridesData>) => {
      const next = deepMergeItem(overridesRef.current, partial) as OverridesData
      overridesRef.current = next
      setOverrides(next)
      if (!serverAvailableRef.current) return
      if (putTimer.current) clearTimeout(putTimer.current)
      // 防抖 400ms 后整体 PUT
      putTimer.current = setTimeout(() => putOverrides(next), 400)
    },
    [putOverrides],
  )

  // —— 7 个语义化 setter（全部经 saveOverride 深合并，避免浅覆盖互相清空）——
  const saveTags = useCallback<OverridesContextValue['saveTags']>(
    (patch) => saveOverride({ tags: patch }),
    [saveOverride],
  )

  const saveWeaponRating = useCallback<OverridesContextValue['saveWeaponRating']>(
    (englishName, rating) => saveOverride({ weapons: { [englishName]: { rating: rating as Rating } } }),
    [saveOverride],
  )

  const saveWeaponOverclockIds = useCallback<OverridesContextValue['saveWeaponOverclockIds']>(
    (englishName, type, ids) => {
      const weaponOverride: { yellowOverclockIds?: string[]; redOverclockIds?: string[] } = {}
      if (type === 'yellow') weaponOverride.yellowOverclockIds = ids
      else weaponOverride.redOverclockIds = ids
      saveOverride({ weapons: { [englishName]: weaponOverride } })
    },
    [saveOverride],
  )

  const saveCardTags = useCallback<OverridesContextValue['saveCardTags']>(
    (key, tags) => saveOverride({ cardTags: { [key]: tags } }),
    [saveOverride],
  )

  const saveOverclockEdit = useCallback<OverridesContextValue['saveOverclockEdit']>(
    (id, patch) => saveOverride({ overclocks: { [id]: patch } }),
    [saveOverride],
  )

  const saveAchievementEdit = useCallback<OverridesContextValue['saveAchievementEdit']>(
    (englishName, patch) => saveOverride({ achievements: { [englishName]: patch } }),
    [saveOverride],
  )

  const saveEquipmentEdit = useCallback<OverridesContextValue['saveEquipmentEdit']>(
    (name, patch) => saveOverride({ equipments: { [name]: patch } }),
    [saveOverride],
  )

  // 永久删除某装备：DELETE /api/equipment/:name（需 X-Admin-Token）；成功后重拉 baseline 同步状态。
  const deleteEquipment = useCallback(async (name: string): Promise<{ ok: boolean }> => {
    if (!serverAvailableRef.current) return { ok: false }
    try {
      const token = getAdminToken()
      const res = await fetch(`${API_BASE}/equipment/${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Token': token },
      })
      // 404：未找到该装备；其余非 2xx：失败
      if (!res.ok) return { ok: false }
      const data = (await res.json()) as { ok: boolean }
      // 链路：删除成功后重新拉取 baseline，使 merged 重算、对应卡片消失
      const bRes = await fetch(`${API_BASE}/baseline`, { cache: 'no-store' })
      if (bRes.ok) {
        const base = (await bRes.json()) as BaselineData
        setBaseline(base)
      }
      return data
    } catch {
      return { ok: false }
    }
  }, [])

  const resetOverrides = useCallback(async () => {
    overridesRef.current = EMPTY_OVERRIDES
    setOverrides(EMPTY_OVERRIDES)
    if (!serverAvailableRef.current) return
    try {
      const token = getAdminToken()
      await fetch(`${API_BASE}/overrides`, {
        method: 'DELETE',
        headers: { 'X-Admin-Token': token },
      })
    } catch {
      /* 忽略网络错误 */
    }
  }, [])

  const pinBaseline = useCallback(async (): Promise<{ ok: boolean; version?: number }> => {
    if (!serverAvailableRef.current) return { ok: false }
    // 先取消可能未发出的防抖 PUT（避免固化后又被旧 overrides 覆盖）
    if (putTimer.current) clearTimeout(putTimer.current)
    try {
      const token = getAdminToken()
      const res = await fetch(`${API_BASE}/pin-baseline`, {
        method: 'POST',
        headers: { 'X-Admin-Token': token },
      })
      if (!res.ok) return { ok: false }
      const data = (await res.json()) as { ok: boolean; version?: number }
      // 链路⑤：固化成功后清空 overrides（DELETE），回落最新固化 baseline
      try {
        await fetch(`${API_BASE}/overrides`, {
          method: 'DELETE',
          headers: { 'X-Admin-Token': token },
        })
      } catch {
        /* 忽略网络错误 */
      }
      overridesRef.current = EMPTY_OVERRIDES
      setOverrides(EMPTY_OVERRIDES)
      // 重新拉取 baseline 以同步状态
      const bRes = await fetch(`${API_BASE}/baseline`, { cache: 'no-store' })
      if (bRes.ok) {
        const base = (await bRes.json()) as BaselineData
        setBaseline(base)
      }
      return { ok: true, version: data.version }
    } catch {
      return { ok: false }
    }
  }, [])

  // ---- 启动时加载（无缓存，实时读盘）；并幂等迁移旧版 localStorage 自定义数据 ----
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [bRes, oRes] = await Promise.all([
          fetch(`${API_BASE}/baseline`, { cache: 'no-store' }),
          fetch(`${API_BASE}/overrides`, { cache: 'no-store' }),
        ])
        if (!bRes.ok) throw new Error('baseline fetch failed')
        const base = (await bRes.json()) as BaselineData
        let ov: OverridesData = EMPTY_OVERRIDES
        if (oRes.ok) ov = (await oRes.json()) as OverridesData
        // 幂等迁移：把遗留 localStorage 合并进服务端 overrides，并清旧键
        const migrated = migrateLegacyOverrides(ov)
        if (cancelled) return
        serverAvailableRef.current = true
        setServerAvailable(true)
        overridesRef.current = migrated.overrides
        setOverrides(migrated.overrides)
        setBaseline(base)
        setReady(true)
        // 端到端闭环：迁移产生的数据防抖回写服务端，确保旧键清理后不丢数据
        if (migrated.migrated) {
          if (putTimer.current) clearTimeout(putTimer.current)
          const toWrite = migrated.overrides
          putTimer.current = setTimeout(() => putOverrides(toWrite), 400)
        }
      } catch {
        // 降级：读取 public/baseline.json（无服务端）
        try {
          const res = await fetch(PUBLIC_BASELINE, { cache: 'no-store' })
          const base = (await res.json()) as BaselineData
          if (cancelled) return
          const migrated = migrateLegacyOverrides(EMPTY_OVERRIDES)
          serverAvailableRef.current = false
          setServerAvailable(false)
          overridesRef.current = migrated.overrides
          setOverrides(migrated.overrides)
          setBaseline(base)
          setReady(true)
        } catch {
          if (cancelled) return
          // 连 public/baseline 都没拿到：仍执行迁移（至少清掉遗留键，避免反复迁移）
          const migrated = migrateLegacyOverrides(EMPTY_OVERRIDES)
          serverAvailableRef.current = false
          setServerAvailable(false)
          overridesRef.current = migrated.overrides
          setOverrides(migrated.overrides)
          setReady(true)
        }
      }
    }
    load()
    return () => {
      cancelled = true
      if (putTimer.current) clearTimeout(putTimer.current)
    }
  }, [])

  const value = useMemo<OverridesContextValue>(
    () => ({
      baseline,
      overrides,
      merged,
      getWeaponName,
      saveOverride,
      saveTags,
      saveWeaponRating,
      saveWeaponOverclockIds,
      saveCardTags,
      saveOverclockEdit,
      saveAchievementEdit,
      saveEquipmentEdit,
      deleteEquipment,
      resetOverrides,
      pinBaseline,
      ready,
      serverAvailable,
    }),
    [
      baseline,
      overrides,
      merged,
      getWeaponName,
      saveOverride,
      saveTags,
      saveWeaponRating,
      saveWeaponOverclockIds,
      saveCardTags,
      saveOverclockEdit,
      saveAchievementEdit,
      saveEquipmentEdit,
      deleteEquipment,
      resetOverrides,
      pinBaseline,
      ready,
      serverAvailable,
    ],
  )

  return <OverridesContext.Provider value={value}>{children}</OverridesContext.Provider>
}

export function useOverrides(): OverridesContextValue {
  const ctx = useContext(OverridesContext)
  if (!ctx) {
    throw new Error('useOverrides must be used within an OverridesProvider')
  }
  return ctx
}
