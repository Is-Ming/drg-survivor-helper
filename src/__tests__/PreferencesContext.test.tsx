import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, describe, it, expect } from 'vitest'
import { PreferencesProvider, usePreferences } from '../theme/PreferencesContext'

function Probe() {
  const { theme, lang, toggleTheme, toggleLang } = usePreferences()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="lang">{lang}</span>
      <button onClick={toggleTheme}>toggleTheme</button>
      <button onClick={toggleLang}>toggleLang</button>
    </div>
  )
}

afterEach(() => {
  localStorage.clear()
  cleanup()
})

describe('PreferencesContext', () => {
  it('默认 dark / zh 并记忆', () => {
    render(
      <PreferencesProvider>
        <Probe />
      </PreferencesProvider>,
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(screen.getByTestId('lang')).toHaveTextContent('zh')
  })
  it('切换并持久化主题', () => {
    render(
      <PreferencesProvider>
        <Probe />
      </PreferencesProvider>,
    )
    fireEvent.click(screen.getByText('toggleTheme'))
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(localStorage.getItem('drg-helper-preferences')).toContain('"light"')
  })
  it('切换并持久化语言', () => {
    render(
      <PreferencesProvider>
        <Probe />
      </PreferencesProvider>,
    )
    fireEvent.click(screen.getByText('toggleLang'))
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
    expect(localStorage.getItem('drg-helper-preferences')).toContain('"en"')
  })
  it('从 localStorage 恢复偏好', () => {
    localStorage.setItem('drg-helper-preferences', JSON.stringify({ theme: 'light', lang: 'en' }))
    render(
      <PreferencesProvider>
        <Probe />
      </PreferencesProvider>,
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
  })
})
