// 标签管理页：成就分类 / 武器标签 / 装备类型 CRUD
import { useState } from 'react'
import {
  Box, Typography, Card, CardContent, TextField, IconButton, Chip, Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { useLang } from '../i18n/LangContext'
import { useTagEditor } from '../hooks/useTagEditor'

interface EditableTagListProps {
  title: string
  items: string[]
  onSave: (items: string[]) => void
  editable: boolean
  addPlaceholder?: string
}

function EditableTagList({ title, items, onSave, editable, addPlaceholder }: EditableTagListProps) {
  const { lang } = useLang()
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [newItem, setNewItem] = useState('')

  const handleDelete = (i: number) => {
    onSave(items.filter((_, idx) => idx !== i))
  }

  const handleEdit = (i: number) => {
    setEditIndex(i)
    setEditValue(items[i])
  }

  const handleSaveEdit = () => {
    if (editIndex === null || !editValue.trim()) return
    const copy = [...items]
    copy[editIndex] = editValue.trim()
    onSave(copy)
    setEditIndex(null)
  }

  const handleAdd = () => {
    if (!newItem.trim()) return
    onSave([...items, newItem.trim()])
    setNewItem('')
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
        {items.map((item, i) => (
          <Box key={`${item}-${i}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {editable && editIndex === i ? (
              <TextField
                size="small"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit()
                  if (e.key === 'Escape') setEditIndex(null)
                }}
                autoFocus
                sx={{ minWidth: 120 }}
                variant="standard"
              />
            ) : (
              <Chip
                label={item}
                onDelete={editable ? () => handleDelete(i) : undefined}
                onClick={editable ? () => handleEdit(i) : undefined}
                icon={editable ? <EditIcon /> : undefined}
              />
            )}
          </Box>
        ))}
        {editable && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <TextField
              size="small"
              placeholder={addPlaceholder ?? (lang === 'zh' ? '新增' : 'Add new')}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
              sx={{ minWidth: 100 }}
            />
            <IconButton size="small" color="primary" onClick={handleAdd} disabled={!newItem.trim()}>
              <AddIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export function TagManager() {
  const { lang } = useLang()
  const editor = useTagEditor()
  const categories = editor.getCategories()
  const tags = editor.getTags()
  const types = editor.getTypes()

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        {lang === 'zh' ? '标签管理' : 'Tag Management'}
      </Typography>

      <Card>
        <CardContent>
          <EditableTagList
            title={lang === 'zh' ? '📁 成就分类' : '📁 Achievement Categories'}
            items={categories}
            onSave={editor.setCategories}
            editable
            addPlaceholder={lang === 'zh' ? '新分类名' : 'New category'}
          />

          <Divider sx={{ my: 2 }} />

          <EditableTagList
            title={lang === 'zh' ? '🏷️ 武器标签' : '🏷️ Weapon Tags'}
            items={tags}
            onSave={editor.setTags}
            editable
            addPlaceholder={lang === 'zh' ? '新标签' : 'New tag'}
          />

          <Divider sx={{ my: 2 }} />

          <EditableTagList
            title={lang === 'zh' ? '🔧 装备类型' : '🔧 Equipment Types'}
            items={types}
            onSave={editor.setTypes}
            editable
            addPlaceholder={lang === 'zh' ? '新类型' : 'New type'}
          />
        </CardContent>
      </Card>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        {lang === 'zh'
          ? '修改即时生效。要恢复到原始数据请点击右上角「恢复默认」。'
          : 'Changes take effect immediately. Use the reset button in the top-right corner to restore original data.'}
      </Typography>
    </Box>
  )
}
