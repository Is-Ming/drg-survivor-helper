// 合并偏好 Context：主题 + 语言，持久化到 localStorage（决策 3 默认开）
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Lang, ThemeMode, UiPreferences } from '../data/types'

const STORAGE_KEY = 'drg-helper-preferences'

export interface PreferencesValue {
  theme: ThemeMode
  lang: Lang
  setTheme: (t: ThemeMode) => void
  setLang: (l: Lang) => void
  toggleTheme: () => void
  toggleLang: () => void
}

const PreferencesContext = createContext<PreferencesValue | null>(null)

function loadPreferences(): UiPreferences {
  const fallback: UiPreferences = { theme: 'dark', lang: 'zh' }
  if (typeof localStorage === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<UiPreferences>
    return {
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      lang: parsed.lang === 'en' ? 'en' : 'zh',
    }
  } catch {
    return fallback
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<UiPreferences>(loadPreferences)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {
      /* localStorage 不可用时静默降级 */
    }
  }, [prefs])

  const value = useMemo<PreferencesValue>(
    () => ({
      theme: prefs.theme,
      lang: prefs.lang,
      setTheme: (theme) => setPrefs((p) => ({ ...p, theme })),
      setLang: (lang) => setPrefs((p) => ({ ...p, lang })),
      toggleTheme: () =>
        setPrefs((p) => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' })),
      toggleLang: () => setPrefs((p) => ({ ...p, lang: p.lang === 'en' ? 'zh' : 'en' })),
    }),
    [prefs],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences(): PreferencesValue {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences must be used within <PreferencesProvider>')
  return ctx
}
