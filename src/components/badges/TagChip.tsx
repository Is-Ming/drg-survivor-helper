// 可点击标签 chip：点击回填搜索/筛选（P1）
// label 改为接收官网标签英文枚举，组件内按当前 lang 经 WEAPON_TAG_LABEL 渲染
// zh → 中文(英文)，en → 英文，保证全站去中英混杂。
import { Chip } from '@mui/material'
import type { Lang, WeaponTag } from '../../data/types'
import { WEAPON_TAG_LABEL } from '../../data/enums'

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
  const label = lang === 'zh' ? `${WEAPON_TAG_LABEL[tag].zh}(${WEAPON_TAG_LABEL[tag].en})` : WEAPON_TAG_LABEL[tag].en
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
