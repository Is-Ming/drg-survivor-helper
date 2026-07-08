// 语言 Context 薄封装：从合并偏好中暴露 lang 相关能力，并附带 t()
import { t as translate } from './dict'
import { usePreferences } from '../theme/PreferencesContext'

export function useLang() {
  const { lang, setLang, toggleLang } = usePreferences()
  return {
    lang,
    setLang,
    toggleLang,
    /** 外壳文案翻译辅助 */
    t: (key: string) => translate(key, lang),
  }
}
