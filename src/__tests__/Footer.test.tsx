// 页脚评级主观声明测试（验收点 6：Footer 含评级主观声明文案）
import { render, cleanup } from '@testing-library/react'
import { afterEach, describe, it, expect } from 'vitest'
import { Footer } from '../components/Footer'
import { PreferencesProvider } from '../theme/PreferencesContext'

afterEach(() => {
  localStorage.clear()
  cleanup()
})

describe('Footer 评级主观声明（验收点 6）', () => {
  it('中文页脚含评级主观声明文案', () => {
    const { container } = render(
      <PreferencesProvider>
        <Footer />
      </PreferencesProvider>,
    )
    expect(container.textContent).toMatch(/武器评级为攻略作者主观评价/)
    expect(container.textContent).toMatch(/仅供参考/)
  })

  it('英文页脚含评级主观声明文案', () => {
    localStorage.setItem(
      'drg-helper-preferences',
      JSON.stringify({ theme: 'dark', lang: 'en' }),
    )
    const { container } = render(
      <PreferencesProvider>
        <Footer />
      </PreferencesProvider>,
    )
    expect(container.textContent).toMatch(/ratings are subjective/i)
    expect(container.textContent).toMatch(/for reference only/i)
  })

  it('页脚含数据来源声明（Steam 等）', () => {
    const { container } = render(
      <PreferencesProvider>
        <Footer />
      </PreferencesProvider>,
    )
    expect(container.textContent).toContain('Steam')
  })
})
