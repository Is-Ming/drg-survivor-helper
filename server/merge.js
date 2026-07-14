// 服务端合并工具（零依赖，CommonJS）。
// 语义与前端 src/hooks/useOverrides.tsx 完全一致：
//   merged = mergeDatasets(baseline, overrides)
//   - 对象递归深合并；数组整体替换；
//   - override 为 "" / null 视为删除（深层 delete 对应 key，回落 baseline）；
//   - 数组条目按主键（englishName / id / name）定位后逐条合并。
'use strict'

/**
 * 深合并单条目。
 * @param {*} base 基线值
 * @param {*} override 覆盖值（增量）
 * @returns {*} 合并结果；返回 undefined 表示调用方应删除该 key
 */
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

/**
 * 按主键合并数组条目：baseline 数组 + 以主键索引的 override 记录。
 * @param {Array<Object>} baseArr 基线数组
 * @param {Object|undefined} overrideMap 主键 -> 增量对象；为空/undefined 则原样返回 baseArr
 * @param {string} idKey 主键字段名
 * @returns {Array<Object>}
 */
function mergeByIdKey(baseArr, overrideMap, idKey) {
  if (!Array.isArray(baseArr)) return baseArr
  if (!overrideMap) return baseArr
  return baseArr.map((item) => {
    const ov = overrideMap[item[idKey]]
    if (!ov) return item
    return deepMergeItem(item, ov)
  })
}

/**
 * 合并两个数据集。
 * @param {Object} baseline 全量基线数据
 * @param {Object} overrides 用户增量覆盖数据
 * @returns {Object} 合并后的数据集（结构完整，绝不丢失 baseline 原有数据）
 */
function mergeDatasets(baseline, overrides) {
  baseline = baseline || {}
  overrides = overrides || {}
  return {
    weapons: mergeByIdKey(baseline.weapons || [], overrides.weapons || {}, 'englishName'),
    achievements: mergeByIdKey(baseline.achievements || [], overrides.achievements || {}, 'englishName'),
    equipments: mergeByIdKey(baseline.equipments || [], overrides.equipments || {}, 'name'),
    overclocks: mergeByIdKey(baseline.overclocks || [], overrides.overclocks || {}, 'id'),
    tags: deepMergeItem(baseline.tags, overrides.tags) ?? baseline.tags,
    cardTags: deepMergeItem(baseline.cardTags, overrides.cardTags) ?? baseline.cardTags,
  }
}

module.exports = {
  deepMergeItem,
  mergeByIdKey,
  mergeDatasets,
}
