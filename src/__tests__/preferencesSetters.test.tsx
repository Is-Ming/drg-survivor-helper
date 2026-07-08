// PreferencesContext set/update 持久化测试（验收点 5：中英 UI 切换 + 明暗主题切换写入 localStorage）
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, describe, it, expect } from 'vitest'
import { PreferencesProvider, usePreferences } from '../theme/PreferencesContext'

function Probe() {
  const { theme, lang, setTheme, setLang } = usePreferences()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="lang">{lang}</span>
      <button onClick={() => setTheme('light')}>setLight</button>
      <button onClick={() => setTheme('dark')}>setDark</button>
      <button onClick={() => setLang('en')}>setEn</button>
      <button onClick={() => setLang('zh')}>setZh</button>
    </div>
  )
}

afterEach(() => {
  localStorage.clear()
  cleanup()
})

describe('PreferencesContext set/update（验收点 5）', () => {
  it('setTheme 更新并写入 localStorage', () => {
    render(
      <PreferencesProvider>
        <Probe />
      </PreferencesProvider>,
    )
    fireEvent.click(screen.getByText('setLight'))
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    const stored = JSON.parse(localStorage.getItem('drg-helper-preferences')!)
    expect(stored.theme).toBe('light')
  })

  it('setLang 更新并写入 localStorage', () => {
    render(
      <PreferencesProvider>
        <Probe />
      </PreferencesProvider>,
    )
    fireEvent.click(screen.getByText('setEn'))
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
    const stored = JSON.parse(localStorage.getItem('drg-helper-preferences')!)
    expect(stored.lang).toBe('en')
  })

  it('setTheme 后再切回 dark 正确', () => {
    render(
      <PreferencesProvider>
        <Probe />
      </PreferencesProvider>,
    )
    fireEvent.click(screen.getByText('setLight'))
    fireEvent.click(screen.getByText('setDark'))
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('setLang 后再切回 zh 正确', () => {
    render(
      <PreferencesProvider>
        <Probe />
      </PreferencesProvider>,
    )
    fireEvent.click(screen.getByText('setEn'))
    fireEvent.click(screen.getByText('setZh'))
    expect(screen.getByTestId('lang')).toHaveTextContent('zh')
  })
})
