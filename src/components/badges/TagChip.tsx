// 可点击标签 chip：点击回填搜索/筛选（P1）
// 展示名经 useTagEditor().getTagLabel 实时解析（覆盖 → 静态 → ID），保证全站联动、无中英混杂。
// zh → 中文(英文)，en → 英文。
import { Chip } from '@mui/material'
import type { Lang, WeaponTag } from '../../data/types'
import { useTagEditor } from '../../hooks/useTagEditor'

export function TagChip({
  tag,
  lang,
  onClick,
  active = false,
}: {
  tag: WeaponTag
  lang: Lang
  onClick?: () => void
  active?: boolean
}) {
  const { getTagLabel } = useTagEditor()
  const label =
    lang === 'zh'
      ? `${getTagLabel(tag, 'zh')}(${getTagLabel(tag, 'en')})`
      : getTagLabel(tag, 'en')
  return (
    <Chip
      size="small"
      label={label}
      clickable={!!onClick}
      onClick={onClick}
      color={active ? 'primary' : 'default'}
      variant={active ? 'filled' : 'outlined'}
      sx={{ m: 0.25, fontWeight: active ? 700 : 400 }}
    />
  )
}
