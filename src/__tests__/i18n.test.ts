// 轻量 i18n 字典切换测试（验收点 5：中英 UI 切换）
import { describe, it, expect } from 'vitest'
import { t, ui } from '../i18n/dict'

describe('i18n 字典 t()（验收点 5）', () => {
  it('中文键返回 zh 文案', () => {
    expect(t('tab.achievements', 'zh')).toBe('成就')
    expect(t('tab.weapons', 'zh')).toBe('武器')
  })
  it('英文键返回 en 文案', () => {
    expect(t('tab.achievements', 'en')).toBe('Achievements')
    expect(t('tab.weapons', 'en')).toBe('Weapons')
  })
  it('未知键回退为原 key（不崩溃）', () => {
    expect(t('unknown.key', 'zh')).toBe('unknown.key')
    expect(t('unknown.key', 'en')).toBe('unknown.key')
  })
  it('全部外壳文案均具备 zh / en 双语', () => {
    for (const key of Object.keys(ui)) {
      expect(ui[key].zh, `缺少 ${key} 的 zh`).toBeTruthy()
      expect(ui[key].en, `缺少 ${key} 的 en`).toBeTruthy()
    }
  })
})
