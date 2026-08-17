// 关键词高亮：在文本中标记命中的子串（大小写不敏感，仅首个命中）。
import { useTheme } from '@mui/material/styles'
import { getDrgTokens } from '../../theme/createAppTheme'

export function Highlight({ text, query }: { text: string; query?: string }) {
  const muiTheme = useTheme()
  const c = muiTheme.drg ?? getDrgTokens(muiTheme.palette.mode)
  const q = (query ?? '').trim()
  if (!q) return <>{text}</>
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark
        style={{
          background: c.amber,
          color: '#1a1a1a',
          borderRadius: 3,
          padding: '0 2px',
        }}
      >
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  )
}
