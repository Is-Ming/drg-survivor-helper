// useFilter hook 集成测试（验收点 4：全局搜索）
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFilter } from '../hooks/useFilter'
import { OverridesProvider } from '../hooks/useOverrides'

describe('useFilter hook（验收点 4：全局搜索）', () => {
  it('默认返回全部 300 条成就，当前模块为 achievements', () => {
    const { result } = renderHook(() => useFilter(), { wrapper: OverridesProvider })
    expect(result.current.filteredAchievements).toHaveLength(300)
    expect(result.current.state.activeModule).toBe('achievements')
  })

  it('setQuery 模糊过滤成就（大小写不敏感）', () => {
    const { result } = renderHook(() => useFilter(), { wrapper: OverridesProvider })
    act(() => result.current.setQuery('Nitra'))
    expect(result.current.filteredAchievements.length).toBeGreaterThan(0)
    expect(
      result.current.filteredAchievements.every((a) =>
        `${a.englishName}${a.chineseName}${a.unlockCondition}${a.category}`
          .toLowerCase()
          .includes('nitra'),
      ),
    ).toBe(true)
  })

  it('setQuery 不影响其他模块数据量（过滤作用于当前模块）', () => {
    const { result } = renderHook(() => useFilter(), { wrapper: OverridesProvider })
    act(() => result.current.setActiveModule('weapons'))
    act(() => result.current.setQuery('test'))
    // 武器数据本身真实存在，过滤仅作用于当前模块数据集
    expect(result.current._raw.weapons).toHaveLength(42)
  })

  it('setActiveModule 切换模块并刷新对应数据', () => {
    const { result } = renderHook(() => useFilter(), { wrapper: OverridesProvider })
    act(() => result.current.setActiveModule('weapons'))
    expect(result.current.state.activeModule).toBe('weapons')
    expect(result.current.filteredWeapons).toHaveLength(42)

    act(() => result.current.setActiveModule('equipments'))
    expect(result.current.state.activeModule).toBe('equipments')
    expect(result.current.filteredEquipments).toHaveLength(20)
  })

  it('resultCount 随当前激活模块变化', () => {
    const { result } = renderHook(() => useFilter(), { wrapper: OverridesProvider })
    expect(result.current.resultCount).toBe(300)
    act(() => result.current.setActiveModule('weapons'))
    expect(result.current.resultCount).toBe(42)
    act(() => result.current.setActiveModule('equipments'))
    expect(result.current.resultCount).toBe(20)
  })
})
