// 武器卡片：评级 + 超频(名框+效果) + 职业 + 标签(可编辑框) + 超频增删
import { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Box, Chip, Popover, IconButton, Button, FormControl, Select, MenuItem } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import type { Lang, Rating, Weapon, WeaponTag } from '../../data/types'
import { WEAPON_CLASS_LABEL } from '../../data/enums'
import { getClassByEnglishName } from '../../data/classes'
import { weapons } from '../../data/weapons'
import { RatingBadge } from '../badges/RatingBadge'
import { TagChip } from '../badges/TagChip'
import { useWeaponOverclockEditor } from '../../hooks/useWeaponOverclockEditor'
import { useTagEditor } from '../../hooks/useTagEditor'
import { useOverrides } from '../../hooks/useOverrides'
import { bundledWeaponNameResolver, slugify, type WeaponNameResolver } from '../../utils/weaponName'
import { TagPickerDialog } from '../TagPickerDialog'
import { OverclockPickerDialog } from '../OverclockPickerDialog'
import { RemovableChip } from '../RemovableChip'
import { overclocks } from '../../data/overclocks'

export function WeaponCard({
  weapon, selectedTags, onTagClick, lang, getOverclockName, getOverclockEffect, getWeaponName, editable,
}: {
  weapon: Weapon; selectedTags: WeaponTag[]; onTagClick?: (tag: WeaponTag) => void;
  lang: Lang; getOverclockName?: (id: string) => string; getOverclockEffect?: (id: string) => string;
  getWeaponName?: WeaponNameResolver; editable?: boolean
}) {
  const { merged, saveWeaponRating, saveCardTags } = useOverrides()
  const editor = useTagEditor()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  // 评级：来自 merged.weapons[en].rating（override 优先），本地态仅用于即时渲染
  const [currentRating, setCurrentRating] = useState<Rating>(weapon.rating)
  // 卡片标签：来自 merged.cardTags[en]，回落武器默认标签
  const [cardTags, setCardTags] = useState<WeaponTag[]>(() => {
    const stored = merged?.cardTags?.[weapon.englishName]
    return (stored ?? weapon.tags) as WeaponTag[]
  })
  const open = Boolean(anchorEl)
  const gameClass = getClassByEnglishName(weapon.class)
  const ocEditor = useWeaponOverclockEditor()
  // 武器名解析：优先使用上层注入的运行时 resolver（服务端合并数据），无 Provider 时回落 bundled。
  const resolveName = getWeaponName ?? bundledWeaponNameResolver
  const weaponName = resolveName(slugify(weapon.englishName), lang)
  const yellowIds = ocEditor.getWeaponOverclockIds(weapon.englishName, 'yellow')
  const redIds = ocEditor.getWeaponOverclockIds(weapon.englishName, 'red')
  const [tagPickerOpen, setTagPickerOpen] = useState(false)
  const [ocPickerOpen, setOcPickerOpen] = useState(false)

  // 与服务端合并值保持同步（评级 / 卡片标签）
  useEffect(() => { setCurrentRating(weapon.rating) }, [weapon.rating])
  useEffect(() => {
    const stored = merged?.cardTags?.[weapon.englishName]
    if (Array.isArray(stored)) setCardTags(stored as WeaponTag[])
  }, [merged, weapon.englishName])

  const handleRatingChange = (r: Rating) => { setCurrentRating(r); saveWeaponRating(weapon.englishName, r) }

  const ocLabel = (id: string) => getOverclockName ? getOverclockName(id) : id

  const removeTag = (tag: WeaponTag) => {
    const next = cardTags.filter((t) => t !== tag)
    setCardTags(next); saveCardTags(weapon.englishName, next)
  }

  const addTag = (tag: WeaponTag) => {
    if (cardTags.includes(tag)) return
    const next = [...cardTags, tag]
    setCardTags(next); saveCardTags(weapon.englishName, next)
  }

  const classLabel = lang === 'zh'
    ? `${WEAPON_CLASS_LABEL[weapon.class].zh}(${WEAPON_CLASS_LABEL[weapon.class].en})`
    : WEAPON_CLASS_LABEL[weapon.class].en

  const resolveStartWeapon = (startWeapon?: string): string => {
    if (!startWeapon) return ''
    const w = weapons.find((item) => item.englishName === startWeapon)
    if (!w) return startWeapon
    return resolveName(slugify(startWeapon), lang)
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Box minWidth={0}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {weaponName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {lang === 'zh' ? weapon.englishName : resolveName(slugify(weapon.englishName), 'zh')}
            </Typography>
          </Box>
          {editable ? (
            <FormControl size="small" sx={{ minWidth: 60 }}>
              <Select value={currentRating} onChange={(e) => handleRatingChange(e.target.value as Rating)} variant="standard">
                {(['S', 'A', 'B', 'C', '-'] as Rating[]).map((r) => (<MenuItem key={r} value={r}>{r}</MenuItem>))}
              </Select>
            </FormControl>
          ) : (<RatingBadge rating={currentRating} lang={lang} />)}
        </Box>

        {/* 职业chip + 标签 [x tag] + [+] */}
        <Box mt={1} mb={1} display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
          <Chip size="small" label={classLabel} color="primary" variant="outlined" clickable
            onClick={(e) => setAnchorEl(e.currentTarget)} />
          {cardTags.map((tag) => (
            editable ? (
              <RemovableChip key={tag} label={editor.getTagLabel(tag, lang)} onRemove={() => removeTag(tag)} color="primary.light" />
            ) : (
              <TagChip key={tag} tag={tag} lang={lang} active={selectedTags.includes(tag)}
                onClick={onTagClick ? () => onTagClick(tag) : undefined} />
            )
          ))}
          {editable && (
            <IconButton size="small" color="primary" onClick={() => setTagPickerOpen(true)}
              sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, width: 28, height: 28 }}>
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>

        <Popover open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
          <Box sx={{ p: 1.5, maxWidth: 300 }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              {lang === 'zh' ? `${WEAPON_CLASS_LABEL[weapon.class].zh} · 小职业` : `${WEAPON_CLASS_LABEL[weapon.class].en} · Class Mods`}
            </Typography>
            {gameClass?.subclasses.map((sub) => (
              <Box key={sub.englishName} sx={{ mb: 1 }}>
                <Typography variant="body2" fontWeight={700}>
                  {lang === 'zh' ? `${sub.chineseName}(${sub.englishName})` : sub.englishName}
                </Typography>
                {sub.desc && <Typography variant="caption" color="text.secondary">{sub.desc}</Typography>}
                {sub.startWeapon && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    {lang === 'zh' ? '起始武器' : 'Start weapon'}：{resolveStartWeapon(sub.startWeapon)}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Popover>

        {/* 黄色超频 [x 名] + 效果 */}
        {yellowIds.length > 0 ? (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              {lang === 'zh' ? '黄色超频 · 平衡 (6/12级)' : 'Yellow OC · Balanced (Lv6/12)'}
            </Typography>
            {yellowIds.map((id, i) => {
              const effects = weapon.yellowOverclock.split('；')
              const eff = getOverclockEffect ? getOverclockEffect(id) : (effects[i] ?? '')
              return (
                <Typography key={id} variant="body2" sx={{ mb: 0.3, display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                  {editable ? (
                    <RemovableChip label={ocLabel(id)} onRemove={() => ocEditor.removeOverclock(weapon.englishName, 'yellow', id)} color="warning.main" />
                  ) : (
                    <Box component="span" fontWeight={600} color="warning.main" sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}>{ocLabel(id)}</Box>
                  )}
                  <Box component="span" sx={{ flexShrink: 0 }}>{lang === 'zh' ? '：' : ': '}</Box>
                  <Box component="span" sx={{ wordBreak: 'break-word' }}>{eff}</Box>
                </Typography>
              )
            })}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mt: 1, mb: 1, color: 'text.secondary' }}>{weapon.yellowOverclock}</Typography>
        )}

        {/* 红色超频 */}
        {redIds.length > 0 ? (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              {lang === 'zh' ? '红色超频 · 不稳定 (18级)' : 'Red OC · Unstable (Lv18)'}
            </Typography>
            {redIds.map((id, i) => {
              const effects = weapon.redOverclock.split('；')
              const eff = getOverclockEffect ? getOverclockEffect(id) : (effects[i] ?? '')
              return (
                <Typography key={id} variant="body2" sx={{ mb: 0.3, display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                  {editable ? (
                    <RemovableChip label={ocLabel(id)} onRemove={() => ocEditor.removeOverclock(weapon.englishName, 'red', id)} color="error.main" />
                  ) : (
                    <Box component="span" fontWeight={600} color="error.main" sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}>{ocLabel(id)}</Box>
                  )}
                  <Box component="span" sx={{ flexShrink: 0 }}>{lang === 'zh' ? '：' : ': '}</Box>
                  <Box component="span" sx={{ wordBreak: 'break-word' }}>{eff}</Box>
                </Typography>
              )
            })}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>{weapon.redOverclock}</Typography>
        )}

        {/* 超频 [+] 按钮 */}
        {editable && (
          <Box sx={{ mt: 1.5, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button size="small" variant="outlined" startIcon={<AddIcon />} color="warning"
              onClick={() => setOcPickerOpen(true)}>
              {lang === 'zh' ? '超频' : 'OC'}
            </Button>
          </Box>
        )}

        {weapon.version !== '当前' && (
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.6 }}>⚠ {weapon.version}</Typography>
        )}
      </CardContent>
      {/* 标签选择弹窗 */}
      <TagPickerDialog
        open={tagPickerOpen}
        onClose={() => setTagPickerOpen(false)}
        title={lang === 'zh' ? '选择标签添加到卡片' : 'Add Tags'}
        availableTags={editor.getTags()}
        selectedTags={cardTags}
        onToggle={(tag) => {
          if (cardTags.includes(tag as WeaponTag)) {
            removeTag(tag as WeaponTag)
          } else {
            addTag(tag as WeaponTag)
          }
        }}
        getLabel={(tag) => editor.getTagLabel(tag, lang)}
        lang={lang}
      />

      {/* 超频选取弹窗 */}
      <OverclockPickerDialog
        open={ocPickerOpen}
        onClose={() => setOcPickerOpen(false)}
        title={lang === 'zh' ? '选择超频添加到武器' : 'Add Overclock'}
        yellowOptions={overclocks.filter((oc) => oc.type === 'balanced' && !yellowIds.includes(oc.id)).map((oc) => ({
          id: oc.id, label: ocLabel(oc.id),
        }))}
        redOptions={overclocks.filter((oc) => oc.type === 'unstable' && !redIds.includes(oc.id)).map((oc) => ({
          id: oc.id, label: ocLabel(oc.id),
        }))}
        onSelect={(type, id) => ocEditor.addOverclock(weapon.englishName, type, id)}
        lang={lang}
      />
    </Card>
  )
}
