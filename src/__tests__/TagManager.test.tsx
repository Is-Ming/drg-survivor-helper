// 标签管理页「武器标签可编辑中/英显示名 + 全站联动 + 布局改造」独立验证测试
// 覆盖任务 A：读写覆盖、实时联动、布局顺序/网格、生命周期。
// 测试栈：vitest + @testing-library/react + jsdom，组件统一包 <OverridesProvider> 拿 merged 上下文。
import { useEffect } from 'react'
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { OverridesProvider, useOverrides } from '../hooks/useOverrides'
import { PreferencesProvider } from '../theme/PreferencesContext'
import { useTagEditor, getWeaponTagLabel } from '../hooks/useTagEditor'
import { TagManager } from '../components/TagManager'
import { TagChip } from '../components/badges/TagChip'
import { filterWeapons } from '../hooks/useWeaponFilter'
import { weapons } from '../data/weapons'
import type { SearchState, Weapon } from '../data/types'

// ---- 基线 mock：强制走降级分支（无服务端），注入可控 baseline，便于断言 merged 覆盖 ----
const BASELINE = {
  weapons: [
    { englishName: 'M1000', chineseName: 'M1000 狙击枪' },
    { englishName: 'GUNNER_PRIMARY', chineseName: '机枪手主武器' },
    { englishName: 'DRILLER_PRIMARY', chineseName: '钻机手主武器' },
    { englishName: 'ENGINEER_PRIMARY', chineseName: '工程师主武器' },
  ] as unknown as Weapon[],
  achievements: [],
  equipments: [],
  overclocks: [],
  tags: {
    weaponTags: [
      'KINETIC', 'FIRE', 'ELECTRIC', 'COLD', 'ACID', 'PLASMA',
      'LIGHT', 'MEDIUM', 'HEAVY', 'THROWABLE', 'CONSTRUCT',
      'PROJECTILE', 'EXPLOSIVE', 'DRONE', 'TURRET', 'GROUNDZONE',
      'PRECISE', 'SPRAY', 'AREA', 'BEAM', 'LASTING',
    ],
    achievementCategories: ['职业解锁', '职业进阶'],
    equipmentTypes: ['发育', '拾取'],
    weaponTagLabels: {},
  },
  cardTags: {},
}

beforeEach(() => {
  // 主路径 /api/* 直接抛错 → 强制降级到 /baseline.json（返回可控 baseline）。
  // 降级分支 serverAvailable=false，不会产生 PUT 防抖定时器，测试更干净。
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : ((input as { url?: string })?.url ?? '')
      if (url.includes('/api/baseline') || url.includes('/api/overrides')) {
        throw new Error('no server in test env')
      }
      if (url.includes('/baseline.json')) {
        return { ok: true, json: async () => BASELINE }
      }
      return { ok: false, json: async () => ({}) }
    }),
  )
})
afterEach(() => {
  vi.unstubAllGlobals()
})

/** 仅在 OverridesProvider 加载完成（ready=true，baseline 已合并）后才渲染子组件 */
function ReadyGate({ children }: { children: React.ReactNode }) {
  const { ready } = useOverrides()
  return ready ? <>{children}</> : <div>loading</div>
}

// ============================ A.1 读写武器标签名覆盖 ============================
function EditorHarness() {
  const editor = useTagEditor()
  return (
    <div>
      <div data-testid="zh-label">{editor.getTagLabel('KINETIC', 'zh')}</div>
      <div data-testid="en-label">{editor.getTagLabel('KINETIC', 'en')}</div>
      <button data-testid="save-zh" onClick={() => editor.saveTagLabel('KINETIC', 'zh', '动能X')}>
        save-zh
      </button>
      <button data-testid="reset" onClick={() => editor.resetTagLabel('KINETIC')}>
        reset
      </button>
    </div>
  )
}

describe('A.1 武器标签名覆盖：读写 + 回落静态 + zh/en 独立', () => {
  it('未覆盖时回落静态 WEAPON_TAG_LABEL，覆盖后读取新值，reset 后回落', async () => {
    render(
      <OverridesProvider>
        <ReadyGate>
          <EditorHarness />
        </ReadyGate>
      </OverridesProvider>,
    )
    await waitFor(() => expect(screen.queryByText('loading')).toBeNull())

    // 初始：未覆盖 → 回落静态 '动能' / 'KINETIC'
    expect(screen.getByTestId('zh-label').textContent).toBe('动能')
    expect(screen.getByTestId('en-label').textContent).toBe('KINETIC')

    // 写入 zh 覆盖
    await act(async () => {
      fireEvent.click(screen.getByTestId('save-zh'))
    })
    await waitFor(() => expect(screen.getByTestId('zh-label').textContent).toBe('动能X'))

    // zh/en 维度独立：只改 zh，en 仍取静态
    expect(screen.getByTestId('en-label').textContent).toBe('KINETIC')

    // reset 清除覆盖 → 回落静态
    await act(async () => {
      fireEvent.click(screen.getByTestId('reset'))
    })
    await waitFor(() => expect(screen.getByTestId('zh-label').textContent).toBe('动能'))
    expect(screen.getByTestId('en-label').textContent).toBe('KINETIC')
  })

  it('getWeaponTagLabel 静态兜底：已知标签中英，未知标签回落 ID', () => {
    expect(getWeaponTagLabel('KINETIC', 'zh')).toBe('动能')
    expect(getWeaponTagLabel('KINETIC', 'en')).toBe('KINETIC')
    expect(getWeaponTagLabel('UNKNOWN_TAG', 'zh')).toBe('UNKNOWN_TAG')
    expect(getWeaponTagLabel('UNKNOWN_TAG', 'en')).toBe('UNKNOWN_TAG')
  })
})

// ============================ A.2 实时联动（关键） ============================
function LinkageHarness() {
  return (
    <OverridesProvider>
      <PreferencesProvider>
        <ReadyGate>
          {/* TagManager 含 WeaponTagList；consumer 为独立 TagChip，证明跨组件经共享 merged 联动 */}
          <div data-testid="manager">
            <TagManager />
          </div>
          <div data-testid="consumer">
            <TagChip tag="KINETIC" lang="zh" />
          </div>
        </ReadyGate>
      </PreferencesProvider>
    </OverridesProvider>
  )
}

describe('A.2 实时联动：TagManager 写覆盖 → WeaponCard/TagChip 同周期更新', () => {
  it('同一 OverridesProvider 下，TagManager 触发 saveTagLabel 后 consumer 标签即时更新', async () => {
    render(<LinkageHarness />)
    await waitFor(() => expect(screen.queryByText('loading')).toBeNull())

    const manager = screen.getByTestId('manager')
    const consumer = screen.getByTestId('consumer')

    // 初始：两者均显示静态名
    expect(within(manager).getByText('动能(KINETIC)')).toBeInTheDocument()
    expect(within(consumer).getByText('动能(KINETIC)')).toBeInTheDocument()

    // 在 TagManager 的 WeaponTagList 点击 KINETIC chip 进入编辑态
    fireEvent.click(within(manager).getByText('动能(KINETIC)'))
    // 编辑态出现「中文名」输入框，键入新名并回车保存（saveEdit 内部调用 editor.saveTagLabel）
    const zhInput = within(manager).getByPlaceholderText('中文名')
    fireEvent.change(zhInput, { target: { value: '动能X' } })
    fireEvent.keyDown(zhInput, { key: 'Enter' })

    // 同一渲染周期：consumer 的 TagChip 文本更新为新名（跨组件经共享 merged 联动，而非各自静态映射）
    await waitFor(() =>
      expect(within(consumer).getByText('动能X(KINETIC)')).toBeInTheDocument(),
    )
    // TagManager 自身 chip 也更新
    expect(within(manager).getByText('动能X(KINETIC)')).toBeInTheDocument()
  })
})

// ============================ A.3 布局 ============================
function LayoutHarness() {
  return (
    <OverridesProvider>
      <PreferencesProvider>
        <ReadyGate>
          <TagManager />
        </ReadyGate>
      </PreferencesProvider>
    </OverridesProvider>
  )
}

describe('A.3 布局：渲染顺序 + 网格 + 每单元含英名与中文输入', () => {
  it('DOM 顺序「装备类型」在「武器中文名」之前，且武器中文名为响应式网格（每单元含英文名+中文名输入）', async () => {
    render(<LayoutHarness />)
    // 用「精确等于标题」的函数匹配，避免与底部说明文案（也含“武器中文名”）撞车
    await waitFor(() => {
      expect(
        screen.getByText((_, el) => el?.textContent?.trim() === '🔧 装备类型'),
      ).toBeInTheDocument()
      expect(
        screen.getByText((_, el) => el?.textContent?.trim() === '🔫 武器中文名'),
      ).toBeInTheDocument()
    })

    const equip = screen.getByText((_, el) => el?.textContent?.trim() === '🔧 装备类型')
    const names = screen.getByText((_, el) => el?.textContent?.trim() === '🔫 武器中文名')

    // DOM 顺序：装备类型区块在武器中文名区块之前
    expect(equip.compareDocumentPosition(names) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    // 网格布局：emotion 注入的样式表含 grid-template-columns（响应式 2~3 列）
    const styleText = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent || '')
      .join('\n')
    expect(styleText).toMatch(/grid-template-columns/)

    // 每武器单元含英文名 + 中文名输入（>=2 个单元，证明多列网格而非一行一个）
    const zhInputs = screen.getAllByLabelText('中文名')
    expect(zhInputs.length).toBeGreaterThanOrEqual(2)
  })
})

// ============================ A.4 生命周期 ============================
function LifecycleHarness() {
  const editor = useTagEditor()
  const { resetOverrides } = useOverrides()
  return (
    <div>
      <div data-testid="zh">{editor.getTagLabel('KINETIC', 'zh')}</div>
      <button data-testid="save" onClick={() => editor.saveTagLabel('KINETIC', 'zh', '动能X')}>
        save
      </button>
      <button data-testid="reset" onClick={() => resetOverrides()}>
        resetOverrides
      </button>
    </div>
  )
}

function PinProbe({ onResult }: { onResult: (r: { ok: boolean; version?: number }) => void }) {
  const { pinBaseline } = useOverrides()
  useEffect(() => {
    let alive = true
    pinBaseline().then((r) => {
      if (alive) onResult(r)
    })
    return () => {
      alive = false
    }
  }, [pinBaseline])
  return null
}

describe('A.4 生命周期：resetOverrides 清空覆盖 / pinBaseline 无服务端降级', () => {
  it('resetOverrides 清空 overrides 后 getTagLabel 回落静态', async () => {
    render(
      <OverridesProvider>
        <ReadyGate>
          <LifecycleHarness />
        </ReadyGate>
      </OverridesProvider>,
    )
    await waitFor(() => expect(screen.queryByText('loading')).toBeNull())

    expect(screen.getByTestId('zh').textContent).toBe('动能')

    await act(async () => {
      fireEvent.click(screen.getByTestId('save'))
    })
    await waitFor(() => expect(screen.getByTestId('zh').textContent).toBe('动能X'))

    // resetOverrides（异步）清空 overrides → 回落静态
    await act(async () => {
      fireEvent.click(screen.getByTestId('reset'))
    })
    await waitFor(() => expect(screen.getByTestId('zh').textContent).toBe('动能'))
  })

  it('pinBaseline 在无服务端环境下返回 { ok: false }（不崩溃）', async () => {
    const holder: { value: { ok: boolean; version?: number } | null } = { value: null }
    render(
      <OverridesProvider>
        <PinProbe onResult={(r) => { holder.value = r }} />
      </OverridesProvider>,
    )
    await waitFor(() => expect(holder.value).not.toBeNull())
    expect(holder.value!.ok).toBe(false)
  })
})

// ============================ 向后兼容：filterWeapons 默认第三参回落静态 ============================
describe('向后兼容：filterWeapons 省略第三参时回落静态标签映射', () => {
  it('默认 getTagLabel 仍能用静态中文标签命中搜索', () => {
    const state = {
      query: '动能',
      activeModule: 'weapons',
      achievement: { categories: [] },
      weapon: { tags: [] },
      equipment: { types: [] },
    } as SearchState
    const r = filterWeapons(weapons, state) // 无第三参 → 默认静态
    expect(r.length).toBeGreaterThan(0)
  })
})
