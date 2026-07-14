// useWeaponNameEditor 测试（子任务 B：管理页武器中文名可编辑）
// 覆盖：自定义中文名读写、en 回落英文名、恢复默认/清空移除条目、
//       resetWeaponNames 全清、version 递增、localStorage 键 drg-wpn-names 格式。
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWeaponNameEditor, resetWeaponNames, WEAPON_NAME_STORAGE_KEY } from '../hooks/useWeaponNameEditor'
import { weapons } from '../data/weapons'

// 取一把真实武器用于断言（M1000 / M1000 狙击枪）
const TEST_WPN = weapons.find((w) => w.englishName === 'M1000')!
const TEST_EN = TEST_WPN.englishName // 'M1000'
const TEST_ZH_DEFAULT = TEST_WPN.chineseName // 'M1000 狙击枪'

beforeEach(() => {
  localStorage.clear()
})

describe('getWeaponName 回落逻辑', () => {
  it('未自定义时 zh 返回武器默认中文名', () => {
    const { result } = renderHook(() => useWeaponNameEditor())
    expect(result.current.getWeaponName(TEST_EN, 'zh')).toBe(TEST_ZH_DEFAULT)
  })

  it('en 始终返回武器英文名（忽略自定义）', () => {
    const { result } = renderHook(() => useWeaponNameEditor())
    act(() => result.current.setWeaponName(TEST_EN, '我的改名'))
    expect(result.current.getWeaponName(TEST_EN, 'en')).toBe(TEST_EN)
  })

  it('未找到武器时 zh 回落英文名', () => {
    const { result } = renderHook(() => useWeaponNameEditor())
    expect(result.current.getWeaponName('不存在的武器', 'zh')).toBe('不存在的武器')
  })
})

describe('setWeaponName 写入与持久化', () => {
  it('setWeaponName 后 getWeaponName(zh) 返回自定义值', () => {
    const { result } = renderHook(() => useWeaponNameEditor())
    act(() => result.current.setWeaponName(TEST_EN, '我的改名'))
    expect(result.current.getWeaponName(TEST_EN, 'zh')).toBe('我的改名')
  })

  it('localStorage 键 drg-wpn-names 写入正确 JSON map 格式', () => {
    const { result } = renderHook(() => useWeaponNameEditor())
    act(() => result.current.setWeaponName(TEST_EN, '我的改名'))
    const raw = localStorage.getItem(WEAPON_NAME_STORAGE_KEY)
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw!)).toEqual({ [TEST_EN]: '我的改名' })
  })

  it('trim 后的值生效（前后空格被去除）', () => {
    const { result } = renderHook(() => useWeaponNameEditor())
    act(() => result.current.setWeaponName(TEST_EN, '  我的改名  '))
    expect(result.current.getWeaponName(TEST_EN, 'zh')).toBe('我的改名')
  })
})

describe('清空 / 恢复默认移除条目', () => {
  it('设回默认值后该项从 localStorage 移除', () => {
    const { result } = renderHook(() => useWeaponNameEditor())
    act(() => result.current.setWeaponName(TEST_EN, '我的改名'))
    expect(localStorage.getItem(WEAPON_NAME_STORAGE_KEY)).not.toBeNull()
    act(() => result.current.setWeaponName(TEST_EN, TEST_ZH_DEFAULT))
    const raw = localStorage.getItem(WEAPON_NAME_STORAGE_KEY)
    expect(raw).toBeNull()
    expect(result.current.getWeaponName(TEST_EN, 'zh')).toBe(TEST_ZH_DEFAULT)
  })

  it('清空为空字符串后该项从 localStorage 移除', () => {
    const { result } = renderHook(() => useWeaponNameEditor())
    act(() => result.current.setWeaponName(TEST_EN, '我的改名'))
    act(() => result.current.setWeaponName(TEST_EN, '   '))
    const raw = localStorage.getItem(WEAPON_NAME_STORAGE_KEY)
    expect(raw).toBeNull()
    expect(result.current.getWeaponName(TEST_EN, 'zh')).toBe(TEST_ZH_DEFAULT)
  })
})

describe('resetWeaponNames（Hook 返回）清空所有自定义', () => {
  it('reset 后所有自定义名清空且 localStorage 键被移除', () => {
    const { result } = renderHook(() => useWeaponNameEditor())
    act(() => result.current.setWeaponName(TEST_EN, '改名A'))
    act(() => result.current.setWeaponName('DeepCore GK2', '改名B'))
    expect(Object.keys(JSON.parse(localStorage.getItem(WEAPON_NAME_STORAGE_KEY)!)).length).toBe(2)
    act(() => result.current.resetWeaponNames())
    expect(localStorage.getItem(WEAPON_NAME_STORAGE_KEY)).toBeNull()
    expect(result.current.getWeaponName(TEST_EN, 'zh')).toBe(TEST_ZH_DEFAULT)
    expect(result.current.getWeaponName('DeepCore GK2', 'zh')).toBe('GK2 步枪')
  })
})

describe('独立导出 resetWeaponNames 清除 localStorage', () => {
  it('独立 resetWeaponNames() 清空 drg-wpn-names 键', () => {
    const { result } = renderHook(() => useWeaponNameEditor())
    act(() => result.current.setWeaponName(TEST_EN, '改名A'))
    expect(localStorage.getItem(WEAPON_NAME_STORAGE_KEY)).not.toBeNull()
    resetWeaponNames()
    expect(localStorage.getItem(WEAPON_NAME_STORAGE_KEY)).toBeNull()
  })
})

describe('version 递增', () => {
  it('每次 setWeaponName 与 reset 均使 version +1', () => {
    const { result } = renderHook(() => useWeaponNameEditor())
    const v0 = result.current.version
    act(() => result.current.setWeaponName(TEST_EN, '改名A'))
    expect(result.current.version).toBe(v0 + 1)
    act(() => result.current.setWeaponName(TEST_EN, '改名B'))
    expect(result.current.version).toBe(v0 + 2)
    act(() => result.current.resetWeaponNames())
    expect(result.current.version).toBe(v0 + 3)
  })
})

describe('跨渲染持久化', () => {
  it('已写入 localStorage 后重新挂载 Hook 仍能读到自定义名', () => {
    const first = renderHook(() => useWeaponNameEditor())
    act(() => first.result.current.setWeaponName(TEST_EN, '持久改名'))
    first.unmount()

    const second = renderHook(() => useWeaponNameEditor())
    expect(second.result.current.getWeaponName(TEST_EN, 'zh')).toBe('持久改名')
  })
})
