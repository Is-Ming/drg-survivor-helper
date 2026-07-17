// 装备来源（C）与 卡片来源池一致（D）回归测试：真实 OverridesProvider + 降级 baseline。
// 覆盖：C 管理页新增独立的「⚙ 装备来源」行（默认池、与类型行并列独立）；
//      C/D 一致：来源行增删 → editor.getSources() 同步；
//      B 端到端：clearSuspected 持久化 suspected:false 且装备条目不被移除（deepMerge 不把 false 当删除）。
import { useEffect } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { OverridesProvider, useOverrides } from '../hooks/useOverrides'
import { useTagEditor } from '../hooks/useTagEditor'
import { TagManager } from '../components/TagManager'
import { EquipmentCard } from '../components/cards/EquipmentCard'
import { PreferencesProvider } from '../theme/PreferencesContext'
import type { Weapon } from '../data/types'

const BASELINE = {
  weapons: [] as unknown as Weapon[],
  achievements: [],
  equipments: [
    { name: '测试装备', type: ['生存'], effect: 'x', source: '', version: '当前', suspected: true },
  ],
  overclocks: [],
  tags: {
    equipmentTypes: ['发育', '拾取'],
    weaponTags: [],
    achievementCategories: [],
    weaponTagLabels: {},
  },
  cardTags: {},
}

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : ((input as { url?: string })?.url ?? '')
      if (url.includes('/api/')) throw new Error('no server in test env')
      if (url.includes('/baseline.json')) return { ok: true, json: async () => BASELINE }
      return { ok: false, json: async () => ({}) }
    }),
  )
})
afterEach(() => vi.unstubAllGlobals())

function ReadyGate({ children }: { children: React.ReactNode }) {
  const { ready } = useOverrides()
  return ready ? <>{children}</> : <div>loading</div>
}

describe('C. 管理页「⚙ 装备来源」独立行', () => {
  it('存在独立的来源行，显示默认池，且位于「装备类型」行之后（并列独立、互不隶属）', async () => {
    render(
      <PreferencesProvider>
        <OverridesProvider>
          <ReadyGate>
            <TagManager />
          </ReadyGate>
        </OverridesProvider>
      </PreferencesProvider>,
    )
    await waitFor(() => expect(screen.queryByText('loading')).toBeNull())

    // 新增的独立来源行标题存在
    expect(
      screen.getByText((_, el) => el?.textContent?.trim() === '⚙ 装备来源'),
    ).toBeInTheDocument()
    // 默认池来源作为 chips 出现
    expect(screen.getByText('局内附加')).toBeInTheDocument()
    expect(screen.getByText('成就解锁')).toBeInTheDocument()

    // DOM 顺序：装备类型行在来源行之前 → 来源行是并列独立的一行
    const types = screen.getByText((_, el) => el?.textContent?.trim() === '🔧 装备类型')
    const sources = screen.getByText((_, el) => el?.textContent?.trim() === '⚙ 装备来源')
    expect(types.compareDocumentPosition(sources) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    // 装备类型池内容未变（仍是原类型，未被来源覆盖）
    expect(screen.getByText('发育')).toBeInTheDocument()
    expect(screen.getByText('拾取')).toBeInTheDocument()
  })

  it('C/D 一致：来源行新增来源后，editor.getSources() 同步反映（管理页↔卡片同池）', async () => {
    function SourcesProbe() {
      const editor = useTagEditor()
      return <div data-testid="pool">{editor.getSources().join('|')}</div>
    }
    function Harness() {
      return (
        <PreferencesProvider>
          <OverridesProvider>
            <ReadyGate>
              <TagManager />
              <SourcesProbe />
            </ReadyGate>
          </OverridesProvider>
        </PreferencesProvider>
      )
    }
    render(<Harness />)
    await waitFor(() => expect(screen.queryByText('loading')).toBeNull())

    // 默认池
    expect(screen.getByTestId('pool').textContent).toBe('局内附加|成就解锁')

    // 在来源行新增一个来源
    const addInput = screen.getByPlaceholderText('新来源') as HTMLInputElement
    fireEvent.change(addInput, { target: { value: '新来源X' } })
    fireEvent.keyDown(addInput, { key: 'Enter' })

    // 同池读取同步更新（卡片 Select 将读到新来源）
    await waitFor(() => expect(screen.getByTestId('pool').textContent).toContain('新来源X'))
  })
})

describe('B 端到端：clearSuspected 持久化 suspected:false 且装备保留', () => {
  it('点击 ✕ 后 overrides 写入 suspected:false；deepMerge 不把 false 当删除；装备条目仍在 equipments', async () => {
    const snap: { overrides?: unknown; merged?: unknown } = {}
    function Probe({ setSnap }: { setSnap: (s: typeof snap) => void }) {
      const { overrides, merged } = useOverrides()
      useEffect(() => setSnap({ overrides, merged }), [overrides, merged])
      return null
    }
    function BHarness() {
      return (
        <PreferencesProvider>
          <OverridesProvider>
            <ReadyGate>
              <EquipmentCard equip={BASELINE.equipments[0] as unknown as import('../data/types').Equipment} lang="zh" editable />
              <Probe setSnap={(s) => { snap.overrides = s.overrides; snap.merged = s.merged }} />
            </ReadyGate>
          </OverridesProvider>
        </PreferencesProvider>
      )
    }
    render(<BHarness />)
    await waitFor(() => expect(screen.queryByText('loading')).toBeNull())
    expect(screen.getByText('待定')).toBeInTheDocument()

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    fireEvent.click(document.querySelector('.MuiChip-deleteIcon')!)

    // overrides.equipments['测试装备'].suspected 被持久化为 false（不是被删除/清空）
    await waitFor(() => {
      expect((snap.overrides as any)?.equipments?.['测试装备']?.suspected).toBe(false)
    })
    // 装备条目本身仍保留在 equipments（未被硬删）
    expect((snap.merged as any)?.equipments?.some((e: { name: string }) => e.name === '测试装备')).toBe(true)
  })
})
