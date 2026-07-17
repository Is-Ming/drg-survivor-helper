// 装备卡片 v5 增量改动回归测试：A 卡片标签组移除 / B 待定徽标安全 / D 来源动态池
// 对数据钩子 useOverrides / useTagEditor 做模块级 mock，从而能精确 spy 持久化动作，
// 并断言 B 的“只清 suspected、绝不硬删装备”语义严格分离。
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EquipmentCard } from '../components/cards/EquipmentCard'
import type { Equipment } from '../data/types'

const mockSaveEquipmentEdit = vi.fn()
const mockDeleteEquipment = vi.fn()
const mockGetTypes = vi.fn(() => ['生存', '战力'])
const mockGetSources = vi.fn(() => ['局内附加', '成就解锁'])

vi.mock('../hooks/useOverrides', () => ({
  useOverrides: vi.fn(),
}))
vi.mock('../hooks/useTagEditor', () => ({
  useTagEditor: vi.fn(),
}))

import { useOverrides } from '../hooks/useOverrides'
import { useTagEditor } from '../hooks/useTagEditor'

const baseEquip: Equipment = {
  name: '测试装备',
  type: ['生存'],
  effect: '测试效果',
  source: '成就解锁',
  version: '当前',
  suspected: true,
}

beforeEach(() => {
  mockSaveEquipmentEdit.mockReset()
  mockDeleteEquipment.mockReset()
  mockGetSources.mockReturnValue(['局内附加', '成就解锁'])
  mockGetTypes.mockReturnValue(['生存', '战力'])
  ;(useOverrides as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    merged: { equipments: [] },
    saveEquipmentEdit: mockSaveEquipmentEdit,
    deleteEquipment: mockDeleteEquipment,
  })
  ;(useTagEditor as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    getTypes: mockGetTypes,
    getSources: mockGetSources,
  })
})

describe('A. 卡片标签组已彻底移除', () => {
  it('渲染不崩溃；保留「类型组」与「来源组」，且无旧「卡片标签」UI 残留', () => {
    render(<EquipmentCard equip={baseEquip} lang="zh" editable />)
    // 保留：装备类型 chips（蓝）
    expect(screen.getByText('生存')).toBeInTheDocument()
    // 保留：来源 Select（可编辑态显示当前值）
    expect(screen.getByText('成就解锁')).toBeInTheDocument()
    // 移除：旧「卡片标签」相关 UI 不再出现
    expect(screen.queryByText(/卡片标签/i)).toBeNull()
  })
})

describe('B. 待定徽标安全（仅清 suspected，不删装备）', () => {
  it('点击 ✕（确认后）仅调用 saveEquipmentEdit({suspected:false})，绝不调用 deleteEquipment', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<EquipmentCard equip={baseEquip} lang="zh" editable />)
    expect(screen.getByText('待定')).toBeInTheDocument()
    const delIcon = document.querySelector('.MuiChip-deleteIcon') as HTMLElement
    expect(delIcon).not.toBeNull()
    fireEvent.click(delIcon)
    expect(mockSaveEquipmentEdit).toHaveBeenCalledWith('测试装备', { suspected: false })
    expect(mockDeleteEquipment).not.toHaveBeenCalled()
  })

  it('点击 ✕ 后“取消”确认：不写入、不删除', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<EquipmentCard equip={baseEquip} lang="zh" editable />)
    fireEvent.click(document.querySelector('.MuiChip-deleteIcon')!)
    expect(mockSaveEquipmentEdit).not.toHaveBeenCalled()
    expect(mockDeleteEquipment).not.toHaveBeenCalled()
  })

  it('非 suspected 装备不渲染待定徽标', () => {
    const eq = { ...baseEquip, suspected: false }
    render(<EquipmentCard equip={eq} lang="zh" editable />)
    expect(screen.queryByText('待定')).toBeNull()
  })
})

describe('D. 来源 Select 读动态池 + 单选写入', () => {
  it('可选项来自 getSources 动态池（自定义池生效），单选写入 saveEquipmentEdit({source})', () => {
    mockGetSources.mockReturnValue(['自定义A', '自定义B'])
    const { container } = render(<EquipmentCard equip={{ ...baseEquip, source: '' }} lang="zh" editable />)
    const selectRoot = container.querySelector('.MuiSelect-select') as HTMLElement
    expect(selectRoot).not.toBeNull()
    fireEvent.mouseDown(selectRoot)
    // 自定义池生效
    expect(screen.getByText('自定义A')).toBeInTheDocument()
    expect(screen.getByText('自定义B')).toBeInTheDocument()
    // 旧硬编码默认池不再出现
    expect(screen.queryByText('局内附加')).toBeNull()
    // 单选写入 overrides.equipments[name].source
    fireEvent.click(screen.getByText('自定义A'))
    expect(mockSaveEquipmentEdit).toHaveBeenCalledWith('测试装备', { source: '自定义A' })
  })

  it('默认池为「局内附加 / 成就解锁」', () => {
    const { container } = render(<EquipmentCard equip={{ ...baseEquip, source: '' }} lang="zh" editable />)
    const selectRoot = container.querySelector('.MuiSelect-select') as HTMLElement
    fireEvent.mouseDown(selectRoot)
    expect(screen.getByText('局内附加')).toBeInTheDocument()
    expect(screen.getByText('成就解锁')).toBeInTheDocument()
  })
})
