// AUTO-GENERATED from server/data/baseline.json (45 entries) — do not edit by hand.
// 运行时以 merged?.equipments (来自 /api/baseline) 为准；本文件仅作 /api/baseline 拉取失败时的兜底。
// 与 baseline.json 保持同步：改装备数据请改 baseline.json 后重新生成本文件。
import type { Equipment } from './types'

export const equipments: Equipment[] = [
  {
    name: "集团折扣券",
    type: "召唤",
    effect: "获得 20% 商店物品折扣。",
    source: "局内附加",
    officialName: "DRG Coupons",
    officialEffect: "Gives a 20% discount to all shop purchases.",
    version: "当前"
  },
  {
    name: "集团配发磁铁",
    type: "拾取",
    effect: "阶段结束时将生成一个仅吸取场上 50% 经验的磁铁。",
    source: "局内附加",
    officialName: "Company Issued Magnet",
    officialEffect: "Spawns a magnet at the end of a stage that collects 50% of the XP.",
    version: "当前"
  },
  {
    name: "红糖块",
    type: "生存",
    effect: "获取红糖时将获得：\n最大生命值 +3（非官方译）",
    source: "局内附加",
    officialName: "Red Sugar Cube",
    officialEffect: "Collecting Red Sugar increases your Max HP by 3.",
    version: "当前"
  },
  {
    name: "记仇名单",
    type: "经验",
    effect: "受到伤害将获得经验。",
    source: "局内附加",
    officialName: "Clipboard of Grudges",
    officialEffect: "+10% XP Gain; Gain XP when you take damage.",
    version: "当前"
  },
  {
    name: "武器补给箱",
    type: "武器",
    effect: "额外装备一把随机武器。武器初始等级为 6 级，并带有随机超频模组。",
    source: "局内附加",
    officialName: "Weapon Box",
    officialEffect: "Equip an additional random level 6 weapon with a random overclock.",
    version: "当前"
  },
  {
    name: "复古知识库",
    type: "发育",
    effect: "直接提升 3 级。",
    source: "局内附加",
    officialName: "Ancient Knowledge",
    officialEffect: "Gain 3 Levels.",
    version: "当前"
  },
  {
    name: "侧眼-EE5 目镜",
    type: "直伤/混伤",
    effect: "+30% Critical Chance, +100% Critical Damage, -30% Damage.",
    source: "局内附加",
    officialName: "Squint-EE5",
    officialEffect: "+30% Critical Chance, +100% Critical Damage, -30% Damage.",
    needsReview: true,
    version: "当前"
  },
  {
    name: "P2W 控制器",
    type: "战力",
    effect: "每进行一次（任意类型的）刷新将获得：",
    source: "局内附加",
    officialName: "Pay2Win Console",
    officialEffect: "+2.5% damage whenever you reroll, stacks up to 100.",
    version: "当前"
  },
  {
    name: "涡轮解码器",
    type: "战力",
    effect: "每拥有一个超频模组将获得：\n+3% 伤害、+3% 装填速度、-5% 挖速（非官方译）",
    source: "局内附加",
    officialName: "Turbo Encabulator",
    officialEffect: "+3% Damage, +3% Reload Speed, -5% Mining Speed for every equipped Overclock.",
    version: "当前"
  },
  {
    name: "战术小饼干",
    type: "生存",
    effect: "Tactical Cookie：进入逃生舱时回复 50% 最大生命值（待核：官方无 exact 对应）",
    source: "局内附加",
    officialName: "Tactical Cookie",
    officialEffect: "Tactical Cookie：进入逃生舱时回复 50% 最大生命值（待核：官方无 exact 对应）",
    needsReview: true,
    version: "待核"
  },
  {
    name: "椒盐卷饼",
    type: "生存",
    effect: "+1 Armor for every 2% of missing HP.",
    source: "局内附加",
    officialName: "Salty Pretzel",
    officialEffect: "+1 Armor for every 2% of missing HP.",
    needsReview: true,
    version: "当前"
  },
  {
    name: "能量棒",
    type: "生存",
    effect: "基于当前等级，每一级将获得：\n+1% 伤害、-3 最大生命值（非官方译）",
    source: "局内附加",
    officialName: "Energy Bars",
    officialEffect: "+1% Damage, -3 Max HP for every player level.",
    version: "当前"
  },
  {
    name: "“挖”他命药丸",
    type: "生存/升级",
    effect: "提升升级时的血量回复量。",
    source: "局内附加",
    officialName: "Vita-Miner Pills",
    officialEffect: "Vita-miner Pills：+5% 最大生命值；升级时提升治疗效果（待核：官方无 exact 对应）",
    version: "待核"
  },
  {
    name: "狂人头盔",
    type: "战力",
    effect: "低血量容错，配椒盐卷饼/三明治",
    source: "局内附加",
    officialName: "The MoCap",
    officialEffect: "—（待核）",
    needsReview: true,
    version: "待核"
  },
  {
    name: "腌制硝石",
    type: "直伤核心",
    effect: "每拥有 1 单位硝石将获得：\n+2% 伤害、-0.5% 移动速度（非官方译）",
    source: "局内附加",
    officialName: "Pickled Nitra",
    officialEffect: "+2% Damage and -0.5% Move Speed for every Nitra you have.",
    version: "当前"
  },
  {
    name: "反射调节仪",
    type: "闪避",
    effect: "+5% Armor; +5% Dodge for 10s when taking damage, stacks 5.",
    source: "局内附加",
    officialName: "Reflex Calibrator",
    officialEffect: "+5% Armor; +5% Dodge for 10s when taking damage, stacks 5.",
    needsReview: true,
    version: "当前"
  },
  {
    name: "护甲润滑油",
    type: "闪避",
    effect: "提升移动时的闪避几率。",
    source: "成就解锁",
    officialName: "Armor Grease",
    officialEffect: "+5% Move Speed; +2% Dodge while moving, stacks 5.",
    relatedAchievement: "油滑矮人（Slick, like butter / Greased Little Dwarf）",
    version: "当前"
  },
  {
    name: "硝基火药",
    type: "暴击",
    effect: "每拥有 1 单位硝石将提升 0.5% 暴击几率。",
    source: "成就解锁",
    officialName: "Nitragenic Powder",
    officialEffect: "+0.5% Critical Chance for every Nitra, max 500 stacks.",
    relatedAchievement: "硝石井喷（Sprinkle of Nitra，收集 2000 Nitra）",
    version: "当前"
  },
  {
    name: "嗜矿异虫用诱饵",
    type: "召唤",
    effect: "引出大量嗜矿异虫。\n不要放过任何一个！",
    source: "成就解锁",
    officialName: "Huuli Bait",
    officialEffect: "Lure out a bunch of Huuli Hoarders.",
    relatedAchievement: "永不空军（Got bait?，单次击杀 3 只 Huuli Hoarders）",
    version: "当前"
  },
  {
    name: "弹药背带",
    type: "",
    effect: "+50% 射速，-15% 移动速度",
    source: "",
    officialName: "Ammo Rig",
    officialEffect: "+50% Fire Rate, -15% Move Speed",
    needsReview: true,
    version: "当前"
  },
  {
    name: "黄金探测仪",
    type: "",
    effect: "挖掘任意岩体时，有很小几率挖到黄金！",
    source: "",
    officialName: "Gold Scanner",
    officialEffect: "You get a small chance to find Gold, when mining any kind of rock!",
    version: "当前"
  },
  {
    name: "硝石探测仪",
    type: "",
    effect: "挖掘任意岩体时，有很小几率挖到硝石！",
    source: "",
    officialName: "Nitra Scanner",
    officialEffect: "You get a small chance to find Nitra, when mining any kind of rock!",
    version: "当前"
  },
  {
    name: "经验探测仪",
    type: "",
    effect: "挖掘任意岩体时，有很小几率挖到经验！",
    source: "",
    officialName: "XP Scanner",
    officialEffect: "You get a small chance to find XP, when mining any kind of rock!",
    version: "当前"
  },
  {
    name: "FRZ 护盾腰带",
    type: "",
    effect: "在受到伤害时，对周围的敌人造成击退和减速。",
    source: "",
    officialName: "FRZ Shield Belt",
    officialEffect: "Knock back and slow nearby enemies when you take damage.",
    version: "当前"
  },
  {
    name: "BRN 护盾腰带",
    type: "",
    effect: "在受到伤害时向周围释放一圈火焰，对周围的敌人造成伤害并赋予燃烧。",
    source: "",
    officialName: "BRN Shield Belt",
    officialEffect: "Explode in a ring of fire dealing damage and burning nearby enemies when you take damage.",
    version: "当前"
  },
  {
    name: "喷气靴",
    type: "",
    effect: "在受到伤害时迅速逃离危险。\n冷却时间 {cooldown} 秒。",
    source: "",
    officialName: "Jet Boots",
    officialEffect: "Allows you to make a quick escape when taking damage. {cooldown}s cooldown.",
    needsReview: true,
    version: "当前"
  },
  {
    name: "便携脚架",
    type: "",
    effect: "站定不动时将提升射击速度和换弹速度。",
    source: "",
    officialName: "Popup Tripod",
    officialEffect: "Increase your fire rate and reload speed when standing still",
    version: "当前"
  },
  {
    name: "深潜宝典",
    type: "",
    effect: "即时反应",
    source: "",
    officialName: "Diver's Manual",
    officialEffect: "Lightning Reflexes",
    needsReview: true,
    version: "当前"
  },
  {
    name: "化学套件",
    type: "",
    effect: "穿深型发射物",
    source: "",
    officialName: "Chemist Kit",
    officialEffect: "Piercing Projectiles",
    version: "当前"
  },
  {
    name: "穿深型发射物",
    type: "",
    effect: "武器补给箱",
    source: "",
    officialName: "Piercing Projectiles",
    officialEffect: "Weapon Box",
    needsReview: true,
    version: "当前"
  },
  {
    name: "万能起子",
    type: "",
    effect: "持有的武器每包含一个非重复 [标签] 将获得：{stats}",
    source: "",
    officialName: "Multi Tool",
    officialEffect: "{stats} for every unique [Tag] equipped",
    needsReview: true,
    version: "当前"
  },
  {
    name: "延长镐身",
    type: "",
    effect: "提升挖掘的最远距离。",
    source: "",
    officialName: "Pick Axtender",
    officialEffect: "Increases your reach when mining",
    version: "当前"
  },
  {
    name: "老照片",
    type: "",
    effect: "基于当前损失的血量提升伤害。",
    source: "",
    officialName: "Old Memento",
    officialEffect: "Increases your damage for every point of missing HP",
    suspected: true,
    needsReview: true,
    version: "当前"
  },
  {
    name: "赤火冰心",
    type: "",
    effect: "燃烧伤害现在会附加减速效果。",
    source: "",
    officialName: "Frostburn",
    officialEffect: "Dealing fire damage now applies slow",
    suspected: true,
    needsReview: true,
    version: "当前"
  },
  {
    name: "灼热电浆",
    type: "",
    effect: "电浆伤害现在会附加燃烧效果。",
    source: "",
    officialName: "Hot Plasma",
    officialEffect: "Dealing plasma damage now applies burn",
    suspected: true,
    needsReview: true,
    version: "当前"
  },
  {
    name: "球果原汁",
    type: "",
    effect: "站定不动将获得短暂的移动速度提升。",
    source: "",
    officialName: "Barley Bulb Juice",
    officialEffect: "Gain a temporary movespeed buff when standing still",
    suspected: true,
    needsReview: true,
    version: "当前"
  },
  {
    name: "即时反应",
    type: "",
    effect: "惊人的好身法！",
    source: "",
    officialName: "Lightning Reflexes",
    officialEffect: "Shockingly good reflexes",
    suspected: true,
    needsReview: true,
    version: "当前"
  },
  {
    name: "风火前行",
    type: "",
    effect: "在受到伤害时将短暂提升移动速度，同时点燃经过的地面。冷却时间 30 秒。",
    source: "",
    officialName: "Hotstepper",
    officialEffect: "After taking damage you gain a boost of speed and leave fire puddle on the ground for a short period of time. 30 second cooldown.",
    suspected: true,
    needsReview: true,
    version: "当前"
  },
  {
    name: "五叶草",
    type: "",
    effect: "每当进行（任意类型的）刷新将获得：",
    source: "",
    officialName: "5 Leaf Clover",
    officialEffect: "Increases your Luck whenever you reroll anything",
    suspected: true,
    needsReview: true,
    version: "当前"
  },
  {
    name: "电栅行者",
    type: "",
    effect: "操作员",
    source: "",
    officialName: "Gridrunner",
    officialEffect: "Operator",
    suspected: true,
    needsReview: true,
    version: "当前"
  },
  {
    name: "载荷泛溢",
    type: "",
    effect: "酸蚀雷爆",
    source: "",
    officialName: "Overflow",
    officialEffect: "Corrosive Thunder",
    suspected: true,
    needsReview: true,
    version: "当前"
  },
  {
    name: "酸蚀雷爆",
    type: "",
    effect: "将感应地雷变为腐蚀电击地雷。",
    source: "",
    officialName: "Corrosive Thunder",
    officialEffect: "Change the proximity mines to Acid and Electrical mines",
    suspected: true,
    needsReview: true,
    version: "当前"
  },
  {
    name: "放电装填",
    type: "",
    effect: "武器开始换弹时将在自身位置留下大范围的弥留电场。",
    source: "",
    officialName: "Charged reload",
    officialEffect: "Release a large electrical groundzone when the weapon reloads",
    suspected: true,
    needsReview: true,
    version: "当前"
  },
  {
    name: "衍射棱镜",
    type: "",
    effect: "你知道该拿它干什么。",
    source: "",
    officialName: "Diffractor prism",
    officialEffect: "You know what do to with this",
    suspected: true,
    needsReview: true,
    version: "当前"
  },
  {
    name: "陀螺组件",
    type: "",
    effect: "已获得：{amount}",
    source: "",
    officialName: "Widget Spinner",
    officialEffect: "Collected {amount}",
    suspected: true,
    needsReview: true,
    version: "当前"
  },
]
