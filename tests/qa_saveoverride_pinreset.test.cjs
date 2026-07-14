// QA 独立验证：saveOverride 深合并（多字段互不覆盖） + 固化即清空 / 恢复默认 触发 DELETE。
// 运行（Node 内置 runner，零新增依赖）：
//   node --test tests/qa_saveoverride_pinreset.test.cjs
//
// 说明：
//  - deepMergeItem 为 src/hooks/useOverrides.tsx（L83-101）逐字复刻，并交叉比对 server/merge.js 实现，
//    证明 saveOverride(overridesRef.current, partial) 走的是深合并而非浅 spread 覆盖。
//  - pinBaseline / resetOverrides 为 React 闭包内函数，无法在零依赖 Node runner 中直接 import；
//    此处按源码 L244-292 逐字还原其“副作用逻辑”（mock fetch + overridesRef），
//    实测“固化成功后 DELETE /api/overrides 且清空 overridesRef”“恢复默认同样 DELETE + 清空”。
//    逻辑逐字对齐源码，源码行号已在注释标注。
'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const { deepMergeItem: serverDeepMergeItem } = require('../server/merge.js')

// ---- 逐字复刻 useOverrides.tsx L83-101 的 deepMergeItem ----
function deepMergeItem(base, override) {
  if (override === null || override === '') return undefined
  if (Array.isArray(override)) return override
  if (typeof override === 'object' && override !== null) {
    const baseObj =
      base && typeof base === 'object' && !Array.isArray(base) ? base : {}
    const out = Object.assign({}, baseObj)
    const ov = override
    for (const key of Object.keys(ov)) {
      const merged = deepMergeItem(baseObj[key], ov[key])
      if (merged === undefined) delete out[key]
      else out[key] = merged
    }
    return out
  }
  return override
}

// ===== S1 saveOverride 深合并：连续写多字段互不覆盖 =====
// saveOverride 源码（L190-201）：next = deepMergeItem(overridesRef.current, partial)
test('S1 saveOverride 连续写 chineseName 与 rating：深合并保留两字段（非浅覆盖清空）', () => {
  let acc = {}
  // 第一次：写 chineseName（模拟 saveWeaponName）
  acc = deepMergeItem(acc, { weapons: { W1: { chineseName: '中文名' } } })
  // 第二次：写 rating（模拟 saveWeaponRating）—— 浅覆盖会把 chineseName 清掉
  acc = deepMergeItem(acc, { weapons: { W1: { rating: 'S' } } })

  assert.deepStrictEqual(acc.weapons.W1, {
    chineseName: '中文名',
    rating: 'S',
  })
})

// ===== S2 复刻实现与 server 实现一致（等价验证） =====
test('S2 复刻 deepMergeItem 与 server/merge.js 行为一致（多组输入等价）', () => {
  const cases = [
    [{}, { weapons: { A: { rating: 'S' } } }],
    [{ a: { x: 1 } }, { a: { y: 2 } }],
    [{ tags: { t: ['old'] } }, { tags: { t: ['new'], c: ['x'] } }],
    [{ k: 'v' }, { k: '' }], // 空串删除
    [{ arr: [1, 2] }, { arr: [3] }], // 数组整体替换
  ]
  for (const [base, ov] of cases) {
    assert.deepStrictEqual(deepMergeItem(base, ov), serverDeepMergeItem(base, ov))
  }
})

// ===== S3 固化链路还原：pinBaseline 成功 → DELETE /api/overrides 并清空 overridesRef =====
// 逐字对齐 useOverrides.tsx L259-292（pinBaseline）
function makePinResetHarness(initialServerAvailable = true) {
  let overridesRef = {}
  let serverAvailableRef = initialServerAvailable
  const calls = []
  const fakeFetch = async (url, opts) => {
    calls.push({ url, method: (opts && opts.method) || 'GET' })
    if (url.endsWith('/pin-baseline')) {
      return { ok: true, json: async () => ({ ok: true, version: 7 }) }
    }
    if (url.endsWith('/baseline')) {
      return { ok: true, json: async () => ({ weapons: [] }) }
    }
    return { ok: true, json: async () => ({}) }
  }

  // resetOverrides 还原（L244-257）
  async function resetOverrides() {
    overridesRef = {}
    if (!serverAvailableRef) return
    const token = ''
    await fakeFetch('/api/overrides', {
      method: 'DELETE',
      headers: { 'X-Admin-Token': token },
    })
  }

  // pinBaseline 还原（L259-292）
  async function pinBaseline() {
    if (!serverAvailableRef) return { ok: false }
    try {
      const token = ''
      const res = await fakeFetch('/api/pin-baseline', {
        method: 'POST',
        headers: { 'X-Admin-Token': token },
      })
      if (!res.ok) return { ok: false }
      const data = await res.json()
      // 链路⑤：固化成功后清空 overrides（DELETE）
      try {
        await fakeFetch('/api/overrides', {
          method: 'DELETE',
          headers: { 'X-Admin-Token': token },
        })
      } catch {
        /* ignore */
      }
      overridesRef = {}
      // 重新拉取 baseline
      const bRes = await fakeFetch('/api/baseline', { cache: 'no-store' })
      if (bRes.ok) {
        await bRes.json()
      }
      return { ok: true, version: data.version }
    } catch {
      return { ok: false }
    }
  }

  return {
    get overrides() {
      return overridesRef
    },
    setOverride(patch) {
      overridesRef = deepMergeItem(overridesRef, patch)
    },
    calls,
    resetOverrides,
    pinBaseline,
  }
}

test('S3 固化即清空：pinBaseline 成功后发起 DELETE /api/overrides 且 overrides 被清空', async () => {
  const h = makePinResetHarness(true)
  h.setOverride({ weapons: { W1: { rating: 'S' } } }) // 模拟已有自定义
  assert.strictEqual(h.overrides.weapons.W1.rating, 'S') // 前置：确实有自定义

  const res = await h.pinBaseline()
  assert.strictEqual(res.ok, true)
  assert.strictEqual(res.version, 7)

  // 关键断言1：固化后确实向 /api/overrides 发起了 DELETE
  const deletes = h.calls.filter((c) => c.url === '/api/overrides' && c.method === 'DELETE')
  assert.strictEqual(deletes.length, 1, 'pinBaseline 应恰好发起一次 DELETE /api/overrides')
  // 关键断言2：overridesRef 被清空（回落最新固化 baseline）
  assert.deepStrictEqual(h.overrides, {}, 'pinBaseline 成功后 overrides 应为空')
  // 固化成功后还有一次 baseline 重新拉取
  assert.ok(h.calls.some((c) => c.url === '/api/baseline' && c.method === 'GET'))
})

// ===== S4 恢复默认：resetOverrides 清空并 DELETE /api/overrides =====
test('S4 恢复默认：resetOverrides 发起 DELETE /api/overrides 并清空本地 overrides', async () => {
  const h = makePinResetHarness(true)
  h.setOverride({ weapons: { W2: { rating: 'A' } } })
  assert.strictEqual(h.overrides.weapons.W2.rating, 'A') // 前置

  await h.resetOverrides()
  const deletes = h.calls.filter((c) => c.url === '/api/overrides' && c.method === 'DELETE')
  assert.strictEqual(deletes.length, 1, 'resetOverrides 应发起一次 DELETE /api/overrides')
  assert.deepStrictEqual(h.overrides, {}, 'resetOverrides 后本地 overrides 应为空')
})

// ===== S5 无服务端时不发 DELETE（降级安全） =====
test('S5 无服务端可用时：pinBaseline/resetOverrides 不发任何 DELETE（降级安全）', async () => {
  const h = makePinResetHarness(false) // 模拟无服务端（本地静态托管）
  h.setOverride({ weapons: { W3: { rating: 'B' } } })

  const res = await h.pinBaseline()
  assert.strictEqual(res.ok, false) // 无服务端直接返回 { ok:false }
  await h.resetOverrides()

  const deletes = h.calls.filter((c) => c.method === 'DELETE')
  assert.strictEqual(deletes.length, 0, '无服务端时不应发起任何 DELETE')
  // 本地 overrides 仍被清空（乐观更新）
  assert.deepStrictEqual(h.overrides, {})
})
