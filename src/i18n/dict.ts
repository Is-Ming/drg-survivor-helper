// 轻量自研 i18n：仅界面外壳文案（数据字段自带中英双字段，不走 i18n）
import type { Lang } from '../data/types'

export type UiDict = Record<string, { zh: string; en: string }>

export const ui: UiDict = {
  'app.title': { zh: 'DRG: Survivor 助手', en: 'DRG: Survivor Helper' },
  'app.tagline': { zh: '深岩银河幸存者 · 速查', en: 'Deep Rock Galactic: Survivor · Quick Ref' },

  'tab.achievements': { zh: '成就', en: 'Achievements' },
  'tab.weapons': { zh: '武器', en: 'Weapons' },
  'tab.equipments': { zh: '装备', en: 'Equipment' },
  'tab.overclocks': { zh: '超频管理', en: 'Overclocks' },
  'tab.tags': { zh: '标签管理', en: 'Tags' },

  'search.placeholder': { zh: '搜索中/英文名、标签、条件…', en: 'Search name / tag / condition…' },
  'search.label': { zh: '全局搜索', en: 'Global Search' },
  'search.empty': { zh: '没有匹配的结果', en: 'No matching results' },
  'result.count': { zh: '条结果', en: 'results' },

  'filter.title': { zh: '筛选', en: 'Filter' },
  'filter.category': { zh: '分类', en: 'Category' },
  'filter.class': { zh: '职业', en: 'Class' },
  'filter.rating': { zh: '评级', en: 'Rating' },
  'filter.tags': { zh: '标签', en: 'Tags' },
  'filter.type': { zh: '类型', en: 'Type' },
  'filter.source': { zh: '来源', en: 'Source' },
  'filter.all': { zh: '全部', en: 'All' },
  'filter.clear': { zh: '清除筛选', en: 'Clear filters' },
  'filter.onlyDifficult': { zh: '⚠ 疑难高亮', en: '⚠ Hard only' },

  'theme.toggle': { zh: '切换主题', en: 'Toggle theme' },
  'theme.light': { zh: '浅色', en: 'Light' },
  'theme.dark': { zh: '深色', en: 'Dark' },
  'lang.toggle': { zh: '切换语言', en: 'Toggle language' },

  'achievement.unlockCondition': { zh: '解锁条件', en: 'Unlock condition' },
  'achievement.biomeTier': { zh: '档位', en: 'Tier' },
  'achievement.completion': { zh: '达成率', en: 'Completion' },

  'weapon.yellowOverclock': { zh: '黄色超频 (6/12级)', en: 'Yellow Overclock (Lv6/12)' },
  'weapon.redOverclock': { zh: '红色超频 (18级)', en: 'Red Overclock (Lv18)' },
  'weapon.class': { zh: '职业', en: 'Class' },

  'equipment.effect': { zh: '效果', en: 'Effect' },
  'equipment.relatedAchievement': { zh: '关联成就', en: 'Related achievement' },
  'equipment.source.inrun': { zh: '局内附加', en: 'In-run' },
  'equipment.source.unlock': { zh: '成就解锁', en: 'Achievement unlock' },

  'rating.disclaimer': { zh: '评级为玩家主观评价，仅供参考', en: 'Ratings are subjective, for reference only' },
  'version.pending': { zh: '待核', en: 'Unverified' },

  'footer.sources': { zh: '数据来源：Steam 社区攻略 · TrueAchievements · Steam 全球统计', en: 'Sources: Steam Community Guides · TrueAchievements · Steam Global Stats' },
  'footer.version': { zh: '数据版本 1.0（2025-09-17）', en: 'Data v1.0 (2025-09-17)' },
  'footer.disclaimer': { zh: '武器评级为攻略作者主观评价，仅供参考', en: 'Weapon ratings are subjective author opinions, for reference only' },
  'footer.classModTentative': { zh: '小职业中文译名来源于官方 Wiki', en: 'Class Mod Chinese names are translated from the official Wiki' },

  'admin.login': { zh: '管理员登录', en: 'Admin Login' },
  'admin.password': { zh: '请输入管理密码', en: 'Enter admin password' },
  'admin.logout': { zh: '退出管理', en: 'Logout' },
  'admin.loginBtn': { zh: '登录', en: 'Login' },
  'admin.verifying': { zh: '验证中…', en: 'Verifying…' },
  'admin.wrongPassword': { zh: '密码错误', en: 'Incorrect password' },
  'admin.verifyFailed': { zh: '验证失败，请重试', en: 'Verification failed, please retry' },
  'admin.passwordField': { zh: '密码', en: 'Password' },
  'admin.addOverclock': { zh: '添加超频', en: 'Add Overclock' },

  'class.subtitle': { zh: '职业', en: 'Class' },
  'class.mod': { zh: '小职业', en: 'Class Mod' },
  'weapon.startWeapon': { zh: '起始武器', en: 'Start weapon' },
  'tag.group.damage': { zh: '伤害类型', en: 'Damage type' },
  'tag.group.family': { zh: '武器家族', en: 'Weapon family' },
  'tag.group.type': { zh: '武器类型', en: 'Weapon type' },
  'tag.group.firing': { zh: '射击类型', en: 'Firing type' },
}

export function t(key: string, lang: Lang): string {
  return ui[key]?.[lang] ?? key
}
