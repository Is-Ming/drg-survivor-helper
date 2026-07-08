// 主题 Context 薄封装：从合并偏好中暴露 theme 相关能力
import { usePreferences } from './PreferencesContext'

export function useTheme() {
  const { theme, setTheme, toggleTheme } = usePreferences()
  return { theme, setTheme, toggleTheme }
}
