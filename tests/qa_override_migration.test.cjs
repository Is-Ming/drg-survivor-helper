// QA 独立验证：旧版 localStorage 自定义数据迁移到服务端 overrides（幂等 + 字段映射）。
// 运行（Node 22 内置 runner，零新增依赖）：
//   node --experimental-strip-types --test tests/qa_override_migration.test.cjs
//
// 说明：本测试直接 import 真实源码 src/hooks/useOverridesMigration.ts（仅含 type-only 运行时零依赖），
// 并用内存 KV 模拟 localStorage（实现 getItem/setItem/removeItem/length/key），
// 实测 migrateLegacyOverrides 的真实行为，而非等价复刻。
'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')
const { pathToFileURL } = require('node:url')

// 在导入被测模块前注入全局 localStorage（每个用例再按需重置）
globalThis.localStorage = (function makeLS(initial) {
  const store = new Map(Object.entries(initial || {}))
  return {
    get length() {
      return store.size
    },
    key(i) {
      const keys = Array.from(store.keys())
      return i >= 0 && i < keys.length ? keys[i] : null
    },
    getItem(k) {
      return store.has(k) ? store.get(k) : null
    },
    setItem(k, v) {
      store.set(k, String(v))
    },
    removeItem(k) {
      store.delete(k)
    },
    _store: store,
  }
})({})

// 动态导入真实 TS 模块（--experimental-strip-types 开启时支持），导出为可 await 的 Promise
const loaded = (async () => {
  const abs = path.resolve(__dirname, '..', 'src', 'hooks', 'useOverridesMigration.ts')
  return import(pathToFileURL(abs).href)
})()

async function getMigrate() {
  const mod = await loaded
  assert.ok(mod && typeof mod.migrateLegacyOverrides === 'function', 'migrateLegacyOverrides 未加载')
  return mod.migrateLegacyOverrides
}

// 每次用例前重置内存 localStorage，避免遗留键互相干扰
function resetLS(initial) {
  const ls = (function makeLS(init) {
    const store = new Map(Object.entries(init || {}))
    return {
      get length() {
        return store.size
      },
      key(i) {
        const keys = Array.from(store.keys())
        return i >= 0 && i < keys.length ? keys[i] : null
      },
      getItem(k) {
        return store.has(k) ? store.get(k) : null
      },
      setItem(k, v) {
        store.set(k, String(v))
      },
      removeItem(k) {
        store.delete(k)
      },
      _store: store,
    }
  })(initial)
  globalThis.localStorage = ls
  return ls
}

// ===== 1) 单一键：drg-tag-edits / drg-overclock-edits 字段映射 + 清除 =====
test('M1 单一键 tag-edits / overclock-edits 正确映射并清除遗留键', async () => {
  const migrateLegacyOverrides = await getMigrate()
  const ls = resetLS({
    'drg-tag-edits': JSON.stringify({
      weaponTags: ['KINETIC'],
      achievementCategories: ['新分类'],
      equipmentTypes: ['新类型'],
    }),
    'drg-overclock-edits': JSON.stringify({
      oc1: { chineseName: '超频中文', effect: '超频效果' },
    }),
  })

  const res = migrateLegacyOverrides({})

  assert.strictEqual(res.migrated, true)
  assert.deepStrictEqual(res.overrides.tags, {
    weaponTags: ['KINETIC'],
    achievementCategories: ['新分类'],
    equipmentTypes: ['新类型'],
  })
  assert.deepStrictEqual(res.overrides.overclocks, {
    oc1: { chineseName: '超频中文', effect: '超频效果' },
  })
  assert.ok(res.clearedKeys.includes('drg-tag-edits'))
  assert.ok(res.clearedKeys.includes('drg-overclock-edits'))
  assert.strictEqual(ls.getItem('drg-tag-edits'), null)
  assert.strictEqual(ls.getItem('drg-overclock-edits'), null)
})

// ===== 2) 带前缀动态键：全部 5 类前缀映射正确 =====
test('M2 前缀键 wpn-oc / ach-edit / eqp-edit / wpn-rating / wpn-cardtags 映射正确', async () => {
  const migrateLegacyOverrides = await getMigrate()
  const ls = resetLS({
    'drg-wpn-oc-W1': JSON.stringify({ yellow: ['Y1', 'Y2'], red: ['R1'] }),
    'drg-ach-edit-A1': JSON.stringify({
      chineseName: '成就名',
      unlockCondition: '解锁条件',
      categories: ['分类一', '分类二'],
    }),
    'drg-eqp-edit-E1': JSON.stringify({
      name: '装备名',
      officialName: '官方名',
      officialEffect: '官方效果',
      effect: '效果',
      types: ['类型一'],
    }),
    'drg-wpn-rating-W2': 'S', // 原始字符串（非 JSON）
    'drg-wpn-cardtags-W3': JSON.stringify(['卡片标签1', '卡片标签2']),
  })

  const res = migrateLegacyOverrides({})

  assert.strictEqual(res.migrated, true)
  assert.deepStrictEqual(res.overrides.weapons.W1, {
    yellowOverclockIds: ['Y1', 'Y2'],
    redOverclockIds: ['R1'],
  })
  assert.deepStrictEqual(res.overrides.achievements.A1, {
    chineseName: '成就名',
    unlockCondition: '解锁条件',
    category: ['分类一', '分类二'],
  })
  assert.deepStrictEqual(res.overrides.equipments.E1, {
    name: '装备名',
    officialName: '官方名',
    officialEffect: '官方效果',
    effect: '效果',
    type: ['类型一'],
  })
  assert.strictEqual(res.overrides.weapons.W2.rating, 'S')
  assert.deepStrictEqual(res.overrides.cardTags.W3, ['卡片标签1', '卡片标签2'])

  for (const k of [
    'drg-wpn-oc-W1',
    'drg-ach-edit-A1',
    'drg-eqp-edit-E1',
    'drg-wpn-rating-W2',
    'drg-wpn-cardtags-W3',
  ]) {
    assert.ok(res.clearedKeys.includes(k), `应清除 ${k}`)
    assert.strictEqual(ls.getItem(k), null, `${k} 应已移除`)
  }
})

// ===== 3) 幂等：无遗留键时返回原样（migrated:false、不写入、不报错） =====
test('M3 幂等：无遗留键返回原样 migrated:false、overrides 不变、clearedKeys 空', async () => {
  const migrateLegacyOverrides = await getMigrate()
  const ls = resetLS({})
  const current = { weapons: { A: { rating: 'S' } } }

  const res = migrateLegacyOverrides(current)

  assert.strictEqual(res.migrated, false)
  assert.deepStrictEqual(res.clearedKeys, [])
  assert.deepStrictEqual(res.overrides, current)
  assert.strictEqual(ls._store.size, 0)
})

// ===== 4) 二次调用（首轮已清除）无键可迁 → 幂等、overrides 不变 =====
test('M4 二次调用：遗留键已清，再次迁移为幂等 no-op', async () => {
  const migrateLegacyOverrides = await getMigrate()
  const ls = resetLS({
    'drg-wpn-oc-W9': JSON.stringify({ yellow: ['Y9'] }),
  })
  const first = migrateLegacyOverrides({})
  assert.strictEqual(first.migrated, true)
  assert.strictEqual(ls.getItem('drg-wpn-oc-W9'), null)

  const second = migrateLegacyOverrides(first.overrides)
  assert.strictEqual(second.migrated, false)
  assert.deepStrictEqual(second.clearedKeys, [])
  assert.deepStrictEqual(second.overrides, first.overrides)
})

// ===== 5) 与现存 overrides 深合并（不互相覆盖） =====
test('M5 迁移与现存 overrides 深合并：保留已有 rating 并补入超频引用', async () => {
  const migrateLegacyOverrides = await getMigrate()
  const ls = resetLS({
    'drg-wpn-oc-W1': JSON.stringify({ yellow: ['Y1'] }),
  })
  const current = { weapons: { W1: { rating: 'S' } } }

  const res = migrateLegacyOverrides(current)

  assert.deepStrictEqual(res.overrides.weapons.W1, {
    rating: 'S',
    yellowOverclockIds: ['Y1'],
  })
  assert.strictEqual(res.migrated, true)
})
