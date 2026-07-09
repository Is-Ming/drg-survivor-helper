// 标签管理页：成就分类 / 武器标签（中英双语） / 装备类型 CRUD
import { useState } from 'react'
import {
  Box, Typography, Card, CardContent, TextField, IconButton, Chip, Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { useLang } from '../i18n/LangContext'
import { useTagEditor, getWeaponTagLabel } from '../hooks/useTagEditor'

/** 通用标签编辑列表（单语，如成就分类/装备类型） */
function PlainTagList({
  title, items, onSave, addPlaceholder,
}: {
  title: string; items: string[]; onSave: (list: string[]) => void;   addPlaceholder: string
}) {
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [editVal, setEditVal] = useState('')
  const [newVal, setNewVal] = useState('')

  const saveEdit = () => {
    if (editIdx === null || !editVal.trim()) return
    const c = [...items]; c[editIdx] = editVal.trim(); onSave(c); setEditIdx(null)
  }

  const doAdd = () => {
    if (!newVal.trim()) return
    onSave([...items, newVal.trim()]); setNewVal('')
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>{title}</Typography>
      <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
        {items.map((item, i) => (
          <Box key={`${item}-${i}`}>
            {editIdx === i ? (
              <TextField size="small" value={editVal} onChange={(e) => setEditVal(e.target.value)}
                onBlur={saveEdit} onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditIdx(null) }}
                autoFocus sx={{ minWidth: 120 }} variant="standard" />
            ) : (
              <Chip label={item} onDelete={() => onSave(items.filter((_, idx) => idx !== i))}
                onClick={() => { setEditIdx(i); setEditVal(items[i]) }} icon={<EditIcon />} />
            )}
          </Box>
        ))}
        <Box display="flex" alignItems="center" gap={0.5}>
          <TextField size="small" placeholder={addPlaceholder} value={newVal}
            onChange={(e) => setNewVal(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') doAdd() }}
            sx={{ minWidth: 100 }} />
          <IconButton size="small" color="primary" onClick={doAdd} disabled={!newVal.trim()}><AddIcon /></IconButton>
        </Box>
      </Box>
    </Box>
  )
}

/** 武器标签编辑列表（中英双语显示） */
function WeaponTagList({
  items, onSave,
}: {
  items: string[]; onSave: (list: string[]) => void
}) {
  const { lang } = useLang()
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [editVal, setEditVal] = useState('')
  const [newVal, setNewVal] = useState('')

  const saveEdit = () => {
    if (editIdx === null || !editVal.trim()) return
    const c = [...items]; c[editIdx] = editVal.trim().toUpperCase(); onSave(c); setEditIdx(null)
  }

  const doAdd = () => {
    if (!newVal.trim()) return
    onSave([...items, newVal.trim().toUpperCase()]); setNewVal('')
  }

  const fmt = (tag: string) => {
    const label = getWeaponTagLabel(tag, lang)
    return lang === 'zh' && label !== tag ? `${label}(${tag})` : label
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
        {lang === 'zh' ? '🏷️ 武器标签' : '🏷️ Weapon Tags'}
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
        {items.map((item, i) => (
          <Box key={`${item}-${i}`}>
            {editIdx === i ? (
              <TextField size="small" value={editVal} onChange={(e) => setEditVal(e.target.value)}
                onBlur={saveEdit} onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditIdx(null) }}
                autoFocus sx={{ minWidth: 120 }} variant="standard" />
            ) : (
              <Chip label={fmt(item)}
                onDelete={() => onSave(items.filter((_, idx) => idx !== i))}
                onClick={() => { setEditIdx(i); setEditVal(item) }} icon={<EditIcon />} />
            )}
          </Box>
        ))}
        <Box display="flex" alignItems="center" gap={0.5}>
          <TextField size="small" placeholder={lang === 'zh' ? '新标签(英文ID)' : 'New tag (English ID)'}
            value={newVal} onChange={(e) => setNewVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') doAdd() }} sx={{ minWidth: 120 }} />
          <IconButton size="small" color="primary" onClick={doAdd} disabled={!newVal.trim()}><AddIcon /></IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export function TagManager() {
  const { lang } = useLang()
  const editor = useTagEditor()

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        {lang === 'zh' ? '标签管理' : 'Tag Management'}
      </Typography>
      <Card>
        <CardContent>
          <PlainTagList
            title={lang === 'zh' ? '📁 成就分类' : '📁 Achievement Categories'}
            items={editor.getCategories()}
            onSave={editor.setCategories}
            addPlaceholder={lang === 'zh' ? '新分类名' : 'New category'}
          />
          <Divider sx={{ my: 2 }} />
          <WeaponTagList items={editor.getTags()} onSave={editor.setTags} />
          <Divider sx={{ my: 2 }} />
          <PlainTagList
            title={lang === 'zh' ? '🔧 装备类型' : '🔧 Equipment Types'}
            items={editor.getTypes()}
            onSave={editor.setTypes}
            addPlaceholder={lang === 'zh' ? '新类型' : 'New type'}
          />
        </CardContent>
      </Card>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        {lang === 'zh'
          ? '武器标签输入英文大写 ID（如 MYTAG），内置标签自动显示中英双语。修改即时生效。'
          : 'Enter tag ID in uppercase English (e.g. MYTAG). Built-in tags show bilingual labels.'}
      </Typography>
    </Box>
  )
}
