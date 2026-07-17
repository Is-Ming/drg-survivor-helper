// 标签管理页：成就分类 / 武器标签（中英双语） / 装备类型 CRUD
import { useState } from 'react'
import {
  Box, Typography, Card, CardContent, TextField, IconButton, Chip, Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { useLang } from '../i18n/LangContext'
import { useTagEditor } from '../hooks/useTagEditor'
import { useOverrides } from '../hooks/useOverrides'
import { slugify } from '../utils/weaponName'
import { weapons } from '../data/weapons'

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

/** 武器标签编辑列表（中英双语显示 + 单标签展示名覆盖） */
function WeaponTagList({
  items, onSave,
}: {
  items: string[]; onSave: (list: string[]) => void
}) {
  const { lang } = useLang()
  const editor = useTagEditor()
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [zhVal, setZhVal] = useState('')
  const [enVal, setEnVal] = useState('')
  const [newVal, setNewVal] = useState('')

  const startEdit = (i: number, tag: string) => {
    setEditIdx(i)
    setZhVal(editor.getTagLabel(tag, 'zh'))
    setEnVal(editor.getTagLabel(tag, 'en'))
  }

  const saveEdit = () => {
    if (editIdx === null) return
    const tag = items[editIdx]
    // 分别写中/英维度（空串等同清除该维度，回落静态/ID）
    editor.saveTagLabel(tag, 'zh', zhVal.trim())
    editor.saveTagLabel(tag, 'en', enVal.trim())
    setEditIdx(null)
  }

  const doAdd = () => {
    if (!newVal.trim()) return
    onSave([...items, newVal.trim().toUpperCase()])
    setNewVal('')
  }

  const display = (tag: string) => {
    const zh = editor.getTagLabel(tag, 'zh')
    const en = editor.getTagLabel(tag, 'en')
    return lang === 'zh' ? `${zh}(${en})` : en
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
              <Box display="flex" alignItems="center" gap={0.5}>
                <TextField size="small" placeholder={lang === 'zh' ? '中文名' : 'Chinese'}
                  value={zhVal} onChange={(e) => setZhVal(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditIdx(null) }}
                  autoFocus sx={{ minWidth: 92 }} variant="standard" />
                <TextField size="small" placeholder={lang === 'zh' ? '英文名' : 'English'}
                  value={enVal} onChange={(e) => setEnVal(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditIdx(null) }}
                  sx={{ minWidth: 92 }} variant="standard" />
                <IconButton size="small" color="primary" onClick={saveEdit}><CheckIcon /></IconButton>
                <IconButton size="small" onClick={() => { editor.resetTagLabel(item); setEditIdx(null) }}
                  title={lang === 'zh' ? '恢复官方名' : 'Reset to official'}>
                  <RestartAltIcon />
                </IconButton>
                <IconButton size="small" onClick={() => setEditIdx(null)}><CloseIcon /></IconButton>
              </Box>
            ) : (
              <Chip label={display(item)}
                onDelete={() => onSave(items.filter((_, idx) => idx !== i))}
                onClick={() => startEdit(i, item)} icon={<EditIcon />} />
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

/** 武器中文名编辑区（中英双语显示，即时持久化到服务端 overrides，全局生效） */
function WeaponNameSection() {
  const { lang } = useLang()
  const { merged, getWeaponName, saveOverride } = useOverrides()
  const weaponsList = merged?.weapons ?? weapons

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
        {lang === 'zh' ? '🔫 武器中文名' : '🔫 Weapon Chinese Names'}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1 }}>
        {weaponsList.map((w) => (
          <Box key={w.englishName} display="flex" alignItems="center" gap={1}>
            <Typography
              variant="body2"
              noWrap
              title={w.englishName}
              sx={{ minWidth: 120, maxWidth: 120, flexShrink: 0, color: 'text.secondary' }}
            >
              {w.englishName}
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={getWeaponName(slugify(w.englishName), 'zh')}
              onChange={(e) => saveOverride({ weapons: { [w.englishName]: { chineseName: e.target.value } } })}
              placeholder={w.chineseName}
              label={lang === 'zh' ? '中文名' : 'Chinese name'}
            />
          </Box>
        ))}
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
            key="cat-list"
            title={lang === 'zh' ? '📁 成就分类' : '📁 Achievement Categories'}
            items={editor.getCategories()}
            onSave={editor.setCategories}
            addPlaceholder={lang === 'zh' ? '新分类名' : 'New category'}
          />
          <Divider sx={{ my: 2 }} />
          <WeaponTagList items={editor.getTags()} onSave={editor.setTags} />
          <Divider sx={{ my: 2 }} />
          <PlainTagList
            key="type-list"
            title={lang === 'zh' ? '🔧 装备类型' : '🔧 Equipment Types'}
            items={editor.getTypes()}
            onSave={editor.setTypes}
            addPlaceholder={lang === 'zh' ? '新类型' : 'New type'}
          />
          <Divider sx={{ my: 2 }} />
          <PlainTagList
            key="source-list"
            title={lang === 'zh' ? '⚙ 装备来源' : '⚙ Equipment Sources'}
            items={editor.getSources()}
            onSave={editor.setSources}
            addPlaceholder={lang === 'zh' ? '新来源' : 'New source'}
          />
          <Divider sx={{ my: 2 }} />
          <WeaponNameSection />
        </CardContent>
      </Card>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        {lang === 'zh'
          ? '武器标签输入英文大写 ID（如 MYTAG），内置标签自动显示中英双语。修改即时生效。武器中文名编辑即时保存到服务端（overrides），可由「恢复默认」或「固化基准」管理。'
          : 'Enter tag ID in uppercase English (e.g. MYTAG). Built-in tags show bilingual labels. Weapon name edits are saved to the server instantly and managed via "Reset Overrides" / "Pin Baseline".'}
      </Typography>
    </Box>
  )
}
