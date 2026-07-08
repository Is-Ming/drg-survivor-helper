// 职业 / 小职业数据层（4 职业 × 3 小职业 = 12）
// 数据权威来源：官方 Wiki deeprockgalactic.wiki.gg Survivor:Class_Mods
// 职业大类中文为社区通用译名（非暂译）；小职业中文为基于英文含义的译名，isTentative: false。
import type { GameClass } from './types'

export const classes: GameClass[] = [
  {
    englishName: 'Scout',
    chineseName: '侦察兵',
    subclasses: [
      {
        englishName: 'Classic',
        chineseName: '经典',
        isTentative: false,
        desc: '默认职业，提升移速与生命',
        startWeapon: 'DeepCore GK2',
      },
      {
        englishName: 'Recon',
        chineseName: '侦察',
        isTentative: false,
        desc: '擅长近距脱险，闪避后获得移速与装填加成',
        startWeapon: 'Zhukov NUK17',
      },
      {
        englishName: 'Sharp Shooter',
        chineseName: '神射手',
        isTentative: false,
        desc: '专精暴击，击杀溢出伤害释放弹片爆炸',
        startWeapon: 'M1000',
      },
    ],
  },
  {
    englishName: 'Gunner',
    chineseName: '机枪手',
    subclasses: [
      {
        englishName: 'Weapons Specialist',
        chineseName: '武器专家',
        isTentative: false,
        desc: '每发射100发额外射出8发高能弹，可用 PROJECTILE 武器',
        startWeapon: 'Lead Storm Powered Minigun',
      },
      {
        englishName: 'Juggernaut',
        chineseName: '重装兵',
        isTentative: false,
        desc: '高抗伤，受击叠加减伤增伤(最高5层)',
        startWeapon: 'Bulldog Heavy Revolver',
      },
      {
        englishName: 'Heavy Gunner',
        chineseName: '重机枪手',
        isTentative: false,
        desc: '强化 HEAVY 射程与装填，但移速降低',
        startWeapon: 'Thunderhead Heavy Autocannon',
      },
    ],
  },
  {
    englishName: 'Engineer',
    chineseName: '工程师',
    subclasses: [
      {
        englishName: 'Maintenance Worker',
        chineseName: '维修工',
        isTentative: false,
        desc: '强化 CONSTRUCT 伤害与装填',
        startWeapon: 'LMG Gun Platform',
      },
      {
        englishName: 'Tinkerer',
        chineseName: '工匠',
        isTentative: false,
        desc: '武器起始等级3且 XP+10%',
        startWeapon: 'Warthog Auto 210',
      },
      {
        englishName: 'Demolitionist',
        chineseName: '爆破手',
        isTentative: false,
        desc: '专精爆炸，提升爆炸范围与装填',
        startWeapon: 'DeepCore PGL',
      },
    ],
  },
  {
    englishName: 'Driller',
    chineseName: '钻机手',
    subclasses: [
      {
        englishName: 'Foreman',
        chineseName: '工头',
        isTentative: false,
        desc: '挖掘叠采矿速度(最高25层)',
        startWeapon: 'Subata 120',
      },
      {
        englishName: 'Interrogator',
        chineseName: '审讯者',
        isTentative: false,
        desc: '状态伤害+100%但伤害-30%，可用 FIRE/ACID',
        startWeapon: 'CRSPR Flamethrower',
      },
      {
        englishName: 'Strong Armed',
        chineseName: '强臂',
        isTentative: false,
        desc: '武器射程+20%，可用 THROWABLE',
        startWeapon: 'Impact Axe',
      },
    ],
  },
]

/** 按 WeaponClass 取职业（含小职业） */
export function getClassByEnglishName(englishName: string): GameClass | undefined {
  return classes.find((c) => c.englishName === englishName)
}
