# 《深岩银河幸存者》成就数据（结构化底稿）

> 数据版本：**1.0 正式版（即"2025 大更新"，Steam 于 2025-09-17 发布 1.0）**
> 数据来源：
> 1. Steam 全球成就统计页（global unlock %，用于"疑难高亮"）<https://steamcommunity.com/stats/2321470/achievements/>
> 2. TrueAchievements 全 300 成就清单（名称 + 解锁条件）<https://www.trueachievements.com/game/Deep-Rock-Galactic-Survivor/achievements>
> 3. Steam 英文全成就指南（Manxus，更新 2025-11-25）<https://steamcommunity.com/sharedfiles/filedetails/?id=3532467239>
> 4. Steam 中文综合指南（Whow，2024-11-10，仅作补充参考，部分旧描述已按 1.0 校订）
>
> 字段：**英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记**
> - **达成率**：Steam 全球解锁百分比（current 1.0 快照）。能抓到就填，抓不到留空。低于 50% 即"疑难成就"，应用内需高亮。
> - **中文名**：英文指南有官方中文译名的沿用；其余为参考译名（游戏内简中客户端命名可能略有差异）。武器 Overclock / Mastery / True Mastery / 耐力 系列中文名均为"英文名直译参考"，已在对应行标注。
> - **版本标记**：全部为 `当前`（1.0 版本）。无 `待核`（除非解锁条件存在指南冲突，已在行内注明）。

## 分类体系说明（沿用并扩展）

原 13 类基础上，因 1.0 版本新增大量成就，扩展如下（均在 App 中可作为筛选维度）：
- 沿用：职业解锁 / 属性统计 / 装备 / 生物群系 / 生物 / 资源 / 神器 / 商店 / 环境 / 伤害 / 护卫 / 异常·先锋·致命 / 其他动作
- 新增：职业进阶（子类职业潜水完成 + 子类挑战）、武器超频（Overclock Lv18）、武器精通（Mastery）、武器真精通（True Mastery，H5）、武器标签（Tag Team 组队）、耐力（Endurance）

---

## 一、职业解锁（4）

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| Run for the hills | 跑向山丘 | 职业解锁 | 解锁 Scout（默认解锁） | | 99.1% | 当前 |
| Lock and load | 上膛待发 | 职业解锁 | 解锁 Gunner（玩家等级 3） | | 83.0% | 当前 |
| Enjoy a relaxing stroll | 享受轻松漫步 | 职业解锁 | 解锁 Engineer（玩家等级 5） | | 76.0% | 当前 |
| Dig down deep | 向下深掘 | 职业解锁 | 解锁 Driller（玩家等级 7） | | 71.2% | 当前 |

## 二、职业进阶（24 = 12 子类潜水完成 + 12 子类挑战）

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| The journey begins | 旅程开始 | 职业进阶 | 用 Classic Scout 完成一次潜水 | | 25.7% | 当前 |
| Adventure awaits | 冒险在召唤 | 职业进阶 | 用 Recon 完成一次潜水（需 Scout 9 级） | | 18.0% | 当前 |
| Measure twice, shoot once | 量两次，射一次 | 职业进阶 | 用 Sharpshooter 完成一次潜水（需 Scout 18 级） | | 12.3% | 当前 |
| 10,000 rounds per minute | 每分钟一万发 | 职业进阶 | 用 Weapons Specialist 完成一次潜水 | | 22.7% | 当前 |
| Tough as nails | 硬如铁钉 | 职业进阶 | 用 Juggernaut 完成一次潜水（需 Gunner 9 级） | | 12.8% | 当前 |
| Ka-boom! | 咔 boom！ | 职业进阶 | 用 Heavy Gunner 完成一次潜水（需 Gunner 18 级） | | 9.5% | 当前 |
| I solve problems | 我解决问题 | 职业进阶 | 用 Maintenance Worker 完成一次潜水 | | 22.3% | 当前 |
| Brainstorming | 头脑风暴 | 职业进阶 | 用 Tinkerer 完成一次潜水（需 Engineer 9 级） | | 13.1% | 当前 |
| A whiff of brimstone | 一缕硫磺味 | 职业进阶 | 用 Demolitionist 完成一次潜水（需 Engineer 18 级） | | 8.8% | 当前 |
| Diggy diggy hole | 挖呀挖个坑 | 职业进阶 | 用 Foreman 完成一次潜水 | | 16.8% | 当前 |
| Chemical burns | 化学灼伤 | 职业进阶 | 用 Interrogator 完成一次潜水（需 Driller 9 级） | | 15.4% | 当前 |
| And my axe | 还有我的斧 | 职业进阶 | 用 Strong Armed 完成一次潜水（需 Driller 18 级） | | | 当前 |
| Grow fat from strength | 从力量中变胖 | 职业进阶 | 作为 Classic Scout 拥有 1000 最大生命值 | | | 当前 |
| BOOM! Headshot | 砰！爆头 | 职业进阶 | 作为 Sharpshooter 单次潜水拥有 +250% 暴击几率 | | | 当前 |
| You're locked in here with me | 你和我一起被锁在这里 | 职业进阶 | 作为 Recon 在单一阶段存活 10 分钟 | | | 当前 |
| Lord of war | 战争之王 | 职业进阶 | 作为 Weapons Specialist 单次发射 250,000 发子弹 | | | 当前 |
| Know no fear | 不知恐惧 | 职业进阶 | 作为 Juggernaut 拥有 300 护甲 | | 3.3% | 当前 |
| Walk without rhythm | 无节奏行走 | 职业进阶 | 作为 Heavy Gunner 同时部署 30 个震击排斥炮塔 | | | 当前 |
| Unreasonable uptime | 不合理的在线率 | 职业进阶 | 作为 Maintenance Worker 使一件武器寿命达 30 秒（指南称 60 秒，1.0 以游戏内为准） | | 3.8% | 当前 |
| Fully overclocked | 完全超频 | 职业进阶 | 作为 Tinkerer 将 4 件武器升至 21 级（英文指南）/ TrueAchievements：5 件武器达 18 级（数值待核） | | | 当前 |
| Going nuclear | 进入核时代 | 职业进阶 | 作为 Demolitionist 拥有 +250% 爆炸半径 | | 6.1% | 当前 |
| With fire and blood | 以火与血 | 职业进阶 | 作为 Foreman 单次造成 10,000,000 火焰伤害 | | 7.2% | 当前 |
| Elemental avatar | 元素化身 | 职业进阶 | 作为 Interrogator 单次施加 5,000,000 状态叠层 | | 3.3% | 当前 |
| Fastest hands on the rig | 钻机上最快的手 | 职业进阶 | 作为 Strong Armed 拥有 +500% 装填速度 | | 6.3% | 当前 |

## 三、属性统计（16）

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| Delicious BLT | 美味的 BLT | 属性统计 | 达到 300 最大生命值 | | 65.6% | 当前 |
| It's got electrolytes | 含电解质 | 属性统计 | 达到 50% 移动速度 | | 54.3% | 当前 |
| Swift guns for swift hands | 快手配快枪 | 属性统计 | 达到 75% 装填速度 | | 42.0% | 当前 |
| Squint and squeeze the trigger | 眯眼扣扳机 | 属性统计 | 达到 75% 暴击几率 | | 40.3% | 当前 |
| Why so Salty? | 为何如此咸 | 属性统计 | 达到 50 护甲 | | 39.0% | 当前 |
| Book of Experience | 经验之书 | 属性统计 | 潜水期间达到等级 50 | | 52.3% | 当前 |
| Feeling lucky punk? | 觉得幸运吗，朋克 | 属性统计 | 单次潜水获得 5 个幸运升级 | | 15.1% | 当前 |
| Hangry? | 饿怒？ | 属性统计 | 累计获得 1,000 次等级提升 | | 31.0% | 当前 |
| Survivor squad | 幸存者小队 | 属性统计 | 全部 4 个职业均达到等级 30 | | 6.0% | 当前 |
| Fully armed and operational | 全副武装且可运作 | 属性统计 | 购买每一个 meta 升级 | | 8.9% | 当前 |
| Slick, like butter | 油滑矮人（闪避） | 属性统计 | 单次潜水闪避 100 次（英文指南旧名 Greased Little Dwarf） | | 7.1% | 当前 |
| No pain, no gain | 不挨打，不成器 | 属性统计 | 单次潜水承受 2,000 伤害（英文指南旧名 Without Pain No Gain） | | 34.9% | 当前 |
| That's how the cookie crumbles | 甜食慰藉 | 属性统计 | 单次潜水累计回复 500 血量（英文指南旧名 Sweet Comfort） | | 31.4% | 当前 |
| Pillar of society | 不动如山 | 属性统计 | 站立不动时击杀 15,000 敌人 | | 64.6% | 当前 |
| Back from the brink! | 起死回生 | 属性统计 | 低于 5 HP 后回满生命 | | 11.9% | 当前 |
| Hoxxes Manual | 霍克斯手册 | 属性统计 | 死亡 3 次 | | 61.3% | 当前 |

## 四、装备（11）

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| Custom rig | 定制装备 | 装备 | 装备 6 件 uncommon 物品 | | 13.7% | 当前 |
| Professional setup | 专业配置 | 装备 | 装备 6 件 rare 物品 | | 11.8% | 当前 |
| Truly epic | 真正史诗 | 装备 | 装备 1 件 epic 物品 | | 27.0% | 当前 |
| Expertly tuned | 专家调校 | 装备 | 装备 6 件 epic 物品 | | | 当前 |
| Legendary! | 传奇！ | 装备 | 装备 1 件 legendary 物品 | | 17.5% | 当前 |
| Fabled fittings | 传说配件 | 装备 | 装备 6 件 legendary 物品 | | 3.5% | 当前 |
| We're keeping this one | 这个我们留着 | 装备 | 完全升级一件装备 | | | 当前 |
| Master artificer | 大师工匠 | 装备 | 完全升级一件 legendary 装备 | | 5.7% | 当前 |
| Karl, is that you? | 卡尔，是你吗？ | 装备 | 装备 6 件完全升级的 legendary 装备 | | 2.4% | 当前 |
| Mind over matter | 精神胜于物质 | 装备 | 无任何装备完成 Hazard 4 潜水 | | | 当前 |
| Just like the old days | 如同旧日 | 装备 | 无任何装备完成 Hazard 5 潜水 | | | 当前 |

## 五、武器超频 Overclock（Lv18，42）

> 中文名为"超频：<武器名>"直译参考；达成率=该武器达 18 级的全球%。

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| Overclock: DeepCore GK2 | 超频：GK2 | 武器超频 | GK2 达 18 级 | | 25.6% | 当前 |
| Overclock: Zhukov NUK17 | 超频：朱可夫 | 武器超频 | Zhukov NUK17 达 18 级 | | 20.0% | 当前 |
| Overclock: Cryo Grenade | 超频：冰冻手雷 | 武器超频 | Cryo Grenade 达 18 级 | | 12.1% | 当前 |
| Overclock: Jury-Rigged Boomstick | 超频：双管霰弹枪 | 武器超频 | Jury-Rigged Boomstick 达 18 级 | | 15.4% | 当前 |
| Overclock: M1000 | 超频：M1000 | 武器超频 | M1000 达 18 级 | | 22.0% | 当前 |
| Overclock: Stun Sweeper | 超频：雷神手枪 | 武器超频 | Voltaic Stun Sweeper 达 18 级 | | 12.8% | 当前 |
| Overclock: TH-0R Bug Taser | 超频：雷电回旋镖 | 武器超频 | TH-0R Bug Taser 达 18 级 | | 9.8% | 当前 |
| Overclock: Cryo Guard | 超频：冰冻无人机 | 武器超频 | Arc-Tek Cryo Guard 达 18 级 | | 9.8% | 当前 |
| Overclock: Plasma Carbine | 超频：电浆卡宾枪 | 武器超频 | DRAK-25 Plasma Carbine 达 18 级 | | 10.2% | 当前 |
| Overclock: Nishanka Boltshark | 超频：战术弩 | 武器超频 | Nishanka Boltshark 达 18 级 | | 8.3% | 当前 |
| Overclock: Heavy Revolver | 超频：斗牛犬手枪 | 武器超频 | Bulldog Heavy Revolver 达 18 级 | | 13.2% | 当前 |
| Overclock: Incendiary Grenade | 超频：燃烧手雷 | 武器超频 | Incendiary Grenade 达 18 级 | | 10.8% | 当前 |
| Overclock: Powered Minigun | 超频：铅爆机枪 | 武器超频 | Lead Storm Powered Minigun 达 18 级 | | 24.4% | 当前 |
| Overclock: Burst Fire Gun | 超频：BRT7 | 武器超频 | BRT7 Burst Fire Gun 达 18 级 | | 11.8% | 当前 |
| Overclock: Tactical Leadburster | 超频：战术铅爆雷 | 武器超频 | Tactical Leadburster 达 18 级 | | 10.7% | 当前 |
| Overclock: Heavy Autocannon | 超频：双管机炮 | 武器超频 | Thunderhead Heavy Autocannon 达 18 级 | | 13.7% | 当前 |
| Overclock: Firefly Hunter Drone | 超频：火焰无人机 | 武器超频 | Firefly Hunter Drone 达 18 级 | | 9.4% | 当前 |
| Overclock: Hurricane | 超频：火箭弹 | 武器超频 | Hurricane Guided Rocket System 达 18 级 | | 8.3% | 当前 |
| Overclock: Seismic Repulsor | 超频：地震哨戒炮 | 武器超频 | Seismic Repulsor 达 18 级 | | 5.9% | 当前 |
| Overclock: Coil Gun | 超频：等离子切割器 | 武器超频 | ArmsKore Coil Gun 达 18 级 | | 5.8% | 当前 |
| Overclock: Warthog Auto | 超频：210 霰弹枪 | 武器超频 | Warthog Auto 210 达 18 级 | | 16.1% | 当前 |
| Overclock: Voltaic SMG | 超频：百万伏特冲锋枪 | 武器超频 | Stubby Voltaic SMG 达 18 级 | | 13.0% | 当前 |
| Overclock: Hi-Volt Thunderbird | 超频：雷电无人机 | 武器超频 | Hi-Volt Thunderbird 达 18 级 | | 11.7% | 当前 |
| Overclock: LMG Gun Platform | 超频：机枪哨戒炮 | 武器超频 | LMG Gun Platform 达 18 级 | | 25.1% | 当前 |
| Overclock: Voltaic Shock Fence | 超频：电网 | 武器超频 | Voltaic Shock Fence 达 18 级 | | 10.7% | 当前 |
| Overclock: LOK-1 Smart Rifle | 超频：智能步枪 | 武器超频 | LOK-1 Smart Rifle 达 18 级 | | 12.9% | 当前 |
| Overclock: DeepCore PGL | 超频：PGL 榴弹发射器 | 武器超频 | DeepCore PGL 达 18 级 | | 11.5% | 当前 |
| Overclock: Breach Cutter | 超频：等离子切割器II | 武器超频 | Breach Cutter 达 18 级 | | 10.1% | 当前 |
| Overclock: Shard Diffractor | 超频：激光笔 | 武器超频 | Shard Diffractor 达 18 级 | | 7.9% | 当前 |
| Overclock: Plasma Burster | 超频：电浆手雷 | 武器超频 | Plasma Burster 达 18 级 | | 7.1% | 当前 |
| Overclock: Swarm Grenade | 超频：群蜂手雷 | 武器超频 | Shredder Swarm Grenade 达 18 级 | | 6.4% | 当前 |
| Overclock: Subata 120 | 超频：苏巴塔120 | 武器超频 | Subata 120 达 18 级 | | 15.4% | 当前 |
| Overclock: Krakatoa Sentinel | 超频：火焰哨戒炮 | 武器超频 | Krakatoa Sentinel 达 18 级 | | 15.1% | 当前 |
| Overclock: HE Grenade | 超频：高爆手榴弹 | 武器超频 | High Explosive Grenade 达 18 级 | | | 当前 |
| Overclock: CRSPR Flamethrower | 超频：火焰喷射器 | 武器超频 | CRSPR Flamethrower 达 18 级 | | 18.8% | 当前 |
| Overclock: Sludge Pump | 超频：污泥泵 | 武器超频 | Corrosive Sludge Pump 达 18 级 | | 13.3% | 当前 |
| Overclock: Wave Cooker | 超频：微波枪 | 武器超频 | Colette Wave Cooker 达 18 级 | | 13.2% | 当前 |
| Overclock: Impact Axe | 超频：冲击斧 | 武器超频 | Impact Axe 达 18 级 | | 10.7% | 当前 |
| Overclock: Neurotoxin Grenade | 超频：酸液手雷 | 武器超频 | Neurotoxin Grenade 达 18 级 | | 8.8% | 当前 |
| Overclock: Cryo Cannon | 超频：急冻加农炮 | 武器超频 | Cryo Cannon 达 18 级 | | | 当前 |
| Overclock: K1-P Viper Drone | 超频：酸液无人机 | 武器超频 | K1-P Viper Drone 达 18 级 | | 7.4% | 当前 |
| Overclock: Plasma Charger | 超频：等离子手枪 | 武器超频 | Experimental Plasma Charger 达 18 级 | | 5.6% | 当前 |

## 六、武器精通 Mastery（42）

> 中文名为"精通：<武器名>"直译参考；达成率=完成该武器精通潜水的全球%。

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| Mastery: DeepCore GK2 | 精通：GK2 | 武器精通 | 完成 GK2 武器精通潜水 | | 14.6% | 当前 |
| Mastery: Zhukov NUK17 | 精通：朱可夫 | 武器精通 | 完成 Zhukov NUK17 武器精通潜水 | | 12.0% | 当前 |
| Mastery: Cryo Grenade | 精通：冰冻手雷 | 武器精通 | 完成 Cryo Grenade 武器精通潜水 | | 8.1% | 当前 |
| Mastery: Jury-Rigged Boomstick | 精通：双管霰弹枪 | 武器精通 | 完成 Jury-Rigged Boomstick 武器精通潜水 | | 10.7% | 当前 |
| Mastery: M1000 | 精通：M1000 | 武器精通 | 完成 M1000 武器精通潜水 | | 11.4% | 当前 |
| Mastery: Stun Sweeper | 精通：雷神手枪 | 武器精通 | 完成 Voltaic Stun Sweeper 武器精通潜水 | | 8.3% | 当前 |
| Mastery: TH-0R Bug Taser | 精通：雷电回旋镖 | 武器精通 | 完成 TH-0R Bug Taser 武器精通潜水 | | 7.3% | 当前 |
| Mastery: Cryo Guard | 精通：冰冻无人机 | 武器精通 | 完成 Arc-Tek Cryo Guard 武器精通潜水 | | 7.5% | 当前 |
| Mastery: Plasma Carbine | 精通：电浆卡宾枪 | 武器精通 | 完成 DRAK-25 Plasma Carbine 武器精通潜水 | | 7.6% | 当前 |
| Mastery: Nishanka Boltshark | 精通：战术弩 | 武器精通 | 完成 Nishanka Boltshark 武器精通潜水 | | 6.1% | 当前 |
| Mastery: Heavy Revolver | 精通：斗牛犬手枪 | 武器精通 | 完成 Bulldog Heavy Revolver 武器精通潜水 | | 8.1% | 当前 |
| Mastery: Incendiary Grenade | 精通：燃烧手雷 | 武器精通 | 完成 Incendiary Grenade 武器精通潜水 | | 8.0% | 当前 |
| Mastery: Powered Minigun | 精通：铅爆机枪 | 武器精通 | 完成 Lead Storm Powered Minigun 武器精通潜水 | | 13.8% | 当前 |
| Mastery: Burst Fire Gun | 精通：BRT7 | 武器精通 | 完成 BRT7 武器精通潜水 | | 7.9% | 当前 |
| Mastery: Tactical Leadburster | 精通：战术铅爆雷 | 武器精通 | 完成 Tactical Leadburster 武器精通潜水 | | 7.9% | 当前 |
| Mastery: Heavy Autocannon | 精通：双管机炮 | 武器精通 | 完成 Thunderhead Heavy Autocannon 武器精通潜水 | | 9.2% | 当前 |
| Mastery: Firefly Hunter Drone | 精通：火焰无人机 | 武器精通 | 完成 Firefly Hunter Drone 武器精通潜水 | | 7.0% | 当前 |
| Mastery: Hurricane | 精通：火箭弹 | 武器精通 | 完成 Hurricane 武器精通潜水 | | 7.0% | 当前 |
| Mastery: Seismic Repulsor | 精通：地震哨戒炮 | 武器精通 | 完成 Seismic Repulsor 武器精通潜水 | | 4.9% | 当前 |
| Mastery: Coil Gun | 精通：等离子切割器 | 武器精通 | 完成 ArmsKore Coil Gun 武器精通潜水 | | 4.8% | 当前 |
| Mastery: Warthog Auto | 精通：210 霰弹枪 | 武器精通 | 完成 Warthog Auto 210 武器精通潜水 | | 10.6% | 当前 |
| Mastery: Voltaic SMG | 精通：百万伏特冲锋枪 | 武器精通 | 完成 Stubby Voltaic SMG 武器精通潜水 | | 8.1% | 当前 |
| Mastery: Hi-Volt Thunderbird | 精通：雷电无人机 | 武器精通 | 完成 Hi-Volt Thunderbird 武器精通潜水 | | | 当前 |
| Mastery: LMG Gun Platform | 精通：机枪哨戒炮 | 武器精通 | 完成 LMG Gun Platform 武器精通潜水 | | 17.4% | 当前 |
| Mastery: Voltaic Shock Fence | 精通：电网 | 武器精通 | 完成 Voltaic Shock Fence 武器精通潜水 | | 7.1% | 当前 |
| Mastery: LOK-1 Smart Rifle | 精通：智能步枪 | 武器精通 | 完成 LOK-1 Smart Rifle 武器精通潜水 | | 8.6% | 当前 |
| Mastery: DeepCore PGL | 精通：PGL 榴弹发射器 | 武器精通 | 完成 DeepCore PGL 武器精通潜水 | | 8.0% | 当前 |
| Mastery: Breach Cutter | 精通：等离子切割器II | 武器精通 | 完成 Breach Cutter 武器精通潜水 | | 7.3% | 当前 |
| Mastery: Shard Diffractor | 精通：激光笔 | 武器精通 | 完成 Shard Diffractor 武器精通潜水 | | 5.5% | 当前 |
| Mastery: Plasma Burster | 精通：电浆手雷 | 武器精通 | 完成 Plasma Burster 武器精通潜水 | | 5.1% | 当前 |
| Mastery: Swarm Grenade | 精通：群蜂手雷 | 武器精通 | 完成 Shredder Swarm Grenade 武器精通潜水 | | 4.7% | 当前 |
| Mastery: Subata 120 | 精通：苏巴塔120 | 武器精通 | 完成 Subata 120 武器精通潜水 | | | 当前 |
| Mastery: Krakatoa Sentinel | 精通：火焰哨戒炮 | 武器精通 | 完成 Krakatoa Sentinel 武器精通潜水 | | 10.7% | 当前 |
| Mastery: HE Grenade | 精通：高爆手榴弹 | 武器精通 | 完成 High Explosive Grenade 武器精通潜水 | | 6.6% | 当前 |
| Mastery: CRSPR Flamethrower | 精通：火焰喷射器 | 武器精通 | 完成 CRSPR Flamethrower 武器精通潜水 | | 12.9% | 当前 |
| Mastery: Sludge Pump | 精通：污泥泵 | 武器精通 | 完成 Corrosive Sludge Pump 武器精通潜水 | | 8.7% | 当前 |
| Mastery: Wave Cooker | 精通：微波枪 | 武器精通 | 完成 Colette Wave Cooker 武器精通潜水 | | | 当前 |
| Mastery: Impact Axe | 精通：冲击斧 | 武器精通 | 完成 Impact Axe 武器精通潜水 | | 7.8% | 当前 |
| Mastery: Neurotoxin Grenade | 精通：酸液手雷 | 武器精通 | 完成 Neurotoxin Grenade 武器精通潜水 | | 6.4% | 当前 |
| Mastery: Cryo Cannon | 精通：急冻加农炮 | 武器精通 | 完成 Cryo Cannon 武器精通潜水 | | 5.6% | 当前 |
| Mastery: K1-P Viper Drone | 精通：酸液无人机 | 武器精通 | 完成 K1-P Viper Drone 武器精通潜水 | | 5.5% | 当前 |
| Mastery: Plasma Charger | 精通：等离子手枪 | 武器精通 | 完成 Experimental Plasma Charger 武器精通潜水 | | 4.5% | 当前 |

## 七、武器真精通 True Mastery（H5，42）

> 中文名为"真精通：<武器名>"直译参考；达成率=在 Hazard 5 完成该武器精通潜水的全球%（普遍 2.0%~2.6%，均属极疑难）。

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| True Mastery: DeepCore GK2 | 真精通：GK2 | 武器真精通 | Hazard 5 完成 GK2 精通潜水 | | 2.4% | 当前 |
| True Mastery: Zhukov NUK17 | 真精通：朱可夫 | 武器真精通 | Hazard 5 完成 Zhukov NUK17 精通潜水 | | 2.1% | 当前 |
| True Mastery: Cryo Grenade | 真精通：冰冻手雷 | 武器真精通 | Hazard 5 完成 Cryo Grenade 精通潜水 | | 2.0% | 当前 |
| True Mastery: Jury-Rigged Boomstick | 真精通：双管霰弹枪 | 武器真精通 | Hazard 5 完成 Jury-Rigged Boomstick 精通潜水 | | 2.2% | 当前 |
| True Mastery: M1000 | 真精通：M1000 | 武器真精通 | Hazard 5 完成 M1000 精通潜水 | | 2.6% | 当前 |
| True Mastery: Stun Sweeper | 真精通：雷神手枪 | 武器真精通 | Hazard 5 完成 Voltaic Stun Sweeper 精通潜水 | | | 当前 |
| True Mastery: TH-0R Bug Taser | 真精通：雷电回旋镖 | 武器真精通 | Hazard 5 完成 TH-0R Bug Taser 精通潜水 | | | 当前 |
| True Mastery: Cryo Guard | 真精通：冰冻无人机 | 武器真精通 | Hazard 5 完成 Arc-Tek Cryo Guard 精通潜水 | | | 当前 |
| True Mastery: Plasma Carbine | 真精通：电浆卡宾枪 | 武器真精通 | Hazard 5 完成 DRAK-25 Plasma Carbine 精通潜水 | | 2.5% | 当前 |
| True Mastery: Nishanka Boltshark | 真精通：战术弩 | 武器真精通 | Hazard 5 完成 Nishanka Boltshark 精通潜水 | | 2.1% | 当前 |
| True Mastery: Heavy Revolver | 真精通：斗牛犬手枪 | 武器真精通 | Hazard 5 完成 Bulldog Heavy Revolver 精通潜水 | | | 当前 |
| True Mastery: Incendiary Grenade | 真精通：燃烧手雷 | 武器真精通 | Hazard 5 完成 Incendiary Grenade 精通潜水 | | 2.0% | 当前 |
| True Mastery: Powered Minigun | 真精通：铅爆机枪 | 武器真精通 | Hazard 5 完成 Lead Storm Powered Minigun 精通潜水 | | | 当前 |
| True Mastery: Burst Fire Gun | 真精通：BRT7 | 武器真精通 | Hazard 5 完成 BRT7 精通潜水 | | | 当前 |
| True Mastery: Tactical Leadburster | 真精通：战术铅爆雷 | 武器真精通 | Hazard 5 完成 Tactical Leadburster 精通潜水 | | 2.1% | 当前 |
| True Mastery: Heavy Autocannon | 真精通：双管机炮 | 武器真精通 | Hazard 5 完成 Thunderhead Heavy Autocannon 精通潜水 | | 2.2% | 当前 |
| True Mastery: Firefly Hunter Drone | 真精通：火焰无人机 | 武器真精通 | Hazard 5 完成 Firefly Hunter Drone 精通潜水 | | 2.0% | 当前 |
| True Mastery: Hurricane | 真精通：火箭弹 | 武器真精通 | Hazard 5 完成 Hurricane 精通潜水 | | 2.5% | 当前 |
| True Mastery: Seismic Repulsor | 真精通：地震哨戒炮 | 武器真精通 | Hazard 5 完成 Seismic Repulsor 精通潜水 | | 2.0% | 当前 |
| True Mastery: Coil Gun | 真精通：等离子切割器 | 武器真精通 | Hazard 5 完成 ArmsKore Coil Gun 精通潜水 | | 2.1% | 当前 |
| True Mastery: Warthog Auto | 真精通：210 霰弹枪 | 武器真精通 | Hazard 5 完成 Warthog Auto 210 精通潜水 | | 2.2% | 当前 |
| True Mastery: Voltaic SMG | 真精通：百万伏特冲锋枪 | 武器真精通 | Hazard 5 完成 Stubby Voltaic SMG 精通潜水 | | | 当前 |
| True Mastery: Hi-Volt Thunderbird | 真精通：雷电无人机 | 武器真精通 | Hazard 5 完成 Hi-Volt Thunderbird 精通潜水 | | | 当前 |
| True Mastery: LMG Gun Platform | 真精通：机枪哨戒炮 | 武器真精通 | Hazard 5 完成 LMG Gun Platform 精通潜水 | | 2.6% | 当前 |
| True Mastery: Voltaic Shock Fence | 真精通：电网 | 武器真精通 | Hazard 5 完成 Voltaic Shock Fence 精通潜水 | | | 当前 |
| True Mastery: LOK-1 Smart Rifle | 真精通：智能步枪 | 武器真精通 | Hazard 5 完成 LOK-1 Smart Rifle 精通潜水 | | | 当前 |
| True Mastery: DeepCore PGL | 真精通：PGL 榴弹发射器 | 武器真精通 | Hazard 5 完成 DeepCore PGL 精通潜水 | | 2.0% | 当前 |
| True Mastery: Breach Cutter | 真精通：等离子切割器II | 武器真精通 | Hazard 5 完成 Breach Cutter 精通潜水 | | | 当前 |
| True Mastery: Shard Diffractor | 真精通：激光笔 | 武器真精通 | Hazard 5 完成 Shard Diffractor 精通潜水 | | | 当前 |
| True Mastery: Plasma Burster | 真精通：电浆手雷 | 武器真精通 | Hazard 5 完成 Plasma Burster 精通潜水 | | | 当前 |
| True Mastery: Swarm Grenade | 真精通：群蜂手雷 | 武器真精通 | Hazard 5 完成 Shredder Swarm Grenade 精通潜水 | | | 当前 |
| True Mastery: Subata 120 | 真精通：苏巴塔120 | 武器真精通 | Hazard 5 完成 Subata 120 精通潜水 | | | 当前 |
| True Mastery: Krakatoa Sentinel | 真精通：火焰哨戒炮 | 武器真精通 | Hazard 5 完成 Krakatoa Sentinel 精通潜水 | | 2.2% | 当前 |
| True Mastery: HE Grenade | 真精通：高爆手榴弹 | 武器真精通 | Hazard 5 完成 High Explosive Grenade 精通潜水 | | | 当前 |
| True Mastery: CRSPR Flamethrower | 真精通：火焰喷射器 | 武器真精通 | Hazard 5 完成 CRSPR Flamethrower 精通潜水 | | 2.1% | 当前 |
| True Mastery: Sludge Pump | 真精通：污泥泵 | 武器真精通 | Hazard 5 完成 Corrosive Sludge Pump 精通潜水 | | 2.1% | 当前 |
| True Mastery: Wave Cooker | 真精通：微波枪 | 武器真精通 | Hazard 5 完成 Colette Wave Cooker 精通潜水 | | 2.0% | 当前 |
| True Mastery: Impact Axe | 真精通：冲击斧 | 武器真精通 | Hazard 5 完成 Impact Axe 精通潜水 | | 2.1% | 当前 |
| True Mastery: Neurotoxin Grenade | 真精通：酸液手雷 | 武器真精通 | Hazard 5 完成 Neurotoxin Grenade 精通潜水 | | 2.1% | 当前 |
| True Mastery: Cryo Cannon | 真精通：急冻加农炮 | 武器真精通 | Hazard 5 完成 Cryo Cannon 精通潜水 | | | 当前 |
| True Mastery: K1-P Viper Drone | 真精通：酸液无人机 | 武器真精通 | Hazard 5 完成 K1-P Viper Drone 精通潜水 | | 2.0% | 当前 |
| True Mastery: Plasma Charger | 真精通：等离子手枪 | 武器真精通 | Hazard 5 完成 Experimental Plasma Charger 精通潜水 | | | 当前 |

## 八、生物群系 Biomes（15 = 5 图 × H5/Mastery/TrueMastery）

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| Crystalline Caverns | 水晶洞穴 | 生物群系 | 赢取 Crystalline Caverns Hazard 5 潜水 | H5 | 6.2% | 当前 |
| Mastery - Crystalline Caverns | 精通 - 水晶洞穴 | 生物群系 | 完成 Crystalline Caverns 精通潜水 | Mastery | 11.3% | 当前 |
| True Mastery - Crystalline Caverns | 真精通 - 水晶洞穴 | 生物群系 | Hazard 5 完成 Crystalline Caverns 精通潜水 | TrueMastery | 3.0% | 当前 |
| Magma Core | 岩浆核心 | 生物群系 | 赢取 Magma Core Hazard 5 潜水 | H5 | 5.4% | 当前 |
| Mastery - Magma Core | 精通 - 岩浆核心 | 生物群系 | 完成 Magma Core 精通潜水 | Mastery | 8.7% | 当前 |
| True Mastery - Magma Core | 真精通 - 岩浆核心 | 生物群系 | Hazard 5 完成 Magma Core 精通潜水 | TrueMastery | 2.5% | 当前 |
| Hollow Bough | 空洞枝桠 | 生物群系 | 赢取 Hollow Bough Hazard 5 潜水 | H5 | 4.7% | 当前 |
| Mastery - Hollow Bough | 精通 - 空洞枝桠 | 生物群系 | 完成 Hollow Bough 精通潜水 | Mastery | 7.9% | 当前 |
| True Mastery - Hollow Bough | 真精通 - 空洞枝桠 | 生物群系 | Hazard 5 完成 Hollow Bough 精通潜水 | TrueMastery | 2.5% | 当前 |
| Salt Pits | 盐坑 | 生物群系 | 赢取 Salt Pits Hazard 5 潜水 | H5 | 5.2% | 当前 |
| Mastery - Salt Pits | 精通 - 盐坑 | 生物群系 | 完成 Salt Pits 精通潜水 | Mastery | 7.8% | 当前 |
| True Mastery - Salt Pits | 真精通 - 盐坑 | 生物群系 | Hazard 5 完成 Salt Pits 精通潜水 | TrueMastery | 2.4% | 当前 |
| Azure Weald | 蔚蓝荒野 | 生物群系 | 赢取 Azure Weald Hazard 5 潜水 | H5 | 4.1% | 当前 |
| Mastery - Azure Weald | 精通 - 蔚蓝荒野 | 生物群系 | 完成 Azure Weald 精通潜水 | Mastery | 6.7% | 当前 |
| True Mastery - Azure Weald | 真精通 - 蔚蓝荒野 | 生物群系 | Hazard 5 完成 Azure Weald 精通潜水 | TrueMastery | 2.2% | 当前 |

## 九、武器标签 Tag Team（20，装备指定标签武器组合完成潜水）

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| Feeling a bit sour | 酸意盎然 | 武器标签 | 装备 3 把 [ACID] 武器完成潜水 | | 3.8% | 当前 |
| Zone of control | 控制区 | 武器标签 | 装备 3 把 [AREA] 武器完成潜水 | | 3.9% | 当前 |
| Cross the beams | 光束交错 | 武器标签 | 装备 4 把 [BEAM] 武器完成潜水 | | 8.2% | 当前 |
| Dwarven architecture | 矮人建筑学 | 武器标签 | 装备 4 把 [CONSTRUCT] 武器完成潜水 | | 11.5% | 当前 |
| Deep freeze | 深度冰冻 | 武器标签 | 装备 4 把 [COLD] 武器完成潜水 | | | 当前 |
| Modern warfare | 现代战争 | 武器标签 | 装备 3 把 [DRONE] 武器完成潜水 | | 4.5% | 当前 |
| Stormbringer | 风暴使者 | 武器标签 | 装备 4 把 [ELECTRICAL] 武器完成潜水 | | 7.8% | 当前 |
| Bomberman | 炸弹人 | 武器标签 | 装备 4 把 [EXPLOSIVE] 武器完成潜水 | | 6.2% | 当前 |
| Keeper of the flame | 火焰守护者 | 武器标签 | 装备 4 把 [FIRE] 武器完成潜水 | | | 当前 |
| Who touched my gun!? | 谁动我枪了 | 武器标签 | 装备 4 把 [HEAVY] 武器完成潜水 | | 4.9% | 当前 |
| Blunt force trauma | 钝器创伤 | 武器标签 | 装备 4 把 [KINETIC] 武器完成潜水 | | 17.2% | 当前 |
| Delayed gratification | 延迟满足 | 武器标签 | 装备 4 把 [LASTING] 武器完成潜水 | | 17.3% | 当前 |
| Fleet of foot | 健步如飞 | 武器标签 | 装备 4 把 [LIGHT] 武器完成潜水 | | 4.8% | 当前 |
| Tried and tested | 久经考验 | 武器标签 | 装备 4 把 [MEDIUM] 武器完成潜水 | | 5.8% | 当前 |
| Light show | 光影秀 | 武器标签 | 装备 4 把 [PLASMA] 武器完成潜水 | | 2.4% | 当前 |
| Professionals have standards | 专业有标准 | 武器标签 | 装备 4 把 [PRECISE] 武器完成潜水 | | | 当前 |
| Weight of fire | 火力权重 | 武器标签 | 装备 4 把 [PROJECTILE] 武器完成潜水 | | 25.2% | 当前 |
| Spray 'n pray | 喷了就求 | 武器标签 | 装备 4 把 [SPRAY] 武器完成潜水 | | 10.3% | 当前 |
| It's all in the wrist | 全凭手腕 | 武器标签 | 装备 4 把 [THROWABLE] 武器完成潜水 | | 5.5% | 当前 |
| Sentry goin' up | 炮塔立起 | 武器标签 | 装备 4 把 [TURRET] 武器完成潜水 | | | 当前 |

## 十、生物 Creatures（6）

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| Got bait? | 有诱饵吗？ | 生物 | 单次潜水击杀 3 只 Huuli Hoarders（胡利囤积者） | | 20.0% | 当前 |
| The dwarf with the golden bug | 带金虫的矮人 | 生物 | 击杀一只金色 lootbug（稀有变种） | | 17.4% | 当前 |
| Still only counts as one! | 仍只算一个！ | 生物 | 不受任何伤害击杀 Dreadnought（无畏舰） | | 13.7% | 当前 |
| Denied | 拒绝 | 生物 | 在 Dreadnought Twins 互相治疗前击杀它们 | | 13.3% | 当前 |
| Bullseye | 靶心 | 生物 | 用补给舱击杀 Q'ronar Shellback | | 7.8% | 当前 |
| This hurts me more | 这更伤我 | 生物 | 单次潜水击杀所有 lootbugs（补货虫） | | 7.5% | 当前 |

## 十一、资源 Resources（5）

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| Get that Midas touch | 获得迈达斯之触 | 资源 | 收集 250 金 | | 91.2% | 当前 |
| Au-fully rich | 极其富有 | 资源 | 收集 2,000 金（解锁 Gold Scanner） | | 73.4% | 当前 |
| Gotta stay Nitrated | 必须保持硝化 | 资源 | 收集 250 Nitra | | 87.3% | 当前 |
| Sprinkle of Nitra | 硝石井喷（少许 Nitra） | 资源 | 收集 2,000 Nitra（解锁 Nitra Scanner；中文指南称"硝石井喷"） | | 58.7% | 当前 |
| Works 100% of the time | 百发百中（磁铁） | 资源 | 单次潜水收集 25 个磁铁 | | 34.2% | 当前 |

## 十二、神器 Artifacts（2）

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| They belong in a museum | 它们属于博物馆 | 神器 | 不使用任何神器完成潜水 | | | 当前 |
| Deep scan | 深度扫描 | 神器 | 单次拥有 5 个 scanner 神器（XP/Gold/Nitra scanner） | | | 当前 |

## 十三、商店 Shop（5）

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| Corporate Discount | 公司折扣 | 商店 | 花费 2,500 金 | | 41.5% | 当前 |
| Big spender | 大买家 | 商店 | 花费 20,000 金 | | 23.3% | 当前 |
| I ain't buying it | 我才不买 | 商店 | Hazard 3 不购买任何商店物品完成潜水 | | | 当前 |
| Cheapskate | 小气鬼 | 商店 | 不花费任何金或 Nitra 完成潜水 | | | 当前 |
| Extreme indecision | 极度犹豫 | 商店 | 单次执行 50 次重摇 | | 2.1% | 当前 |

## 十四、环境 Environment（7）

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| Jetty boots | 喷射靴 | 环境 | 单次落在岩石上 200 次 | | 23.9% | 当前 |
| They fly now? | 它们现在会飞了？ | 环境 | 单一阶段弹跳 100 次 | | | 当前 |
| Axe in face! | 斧头面对面！ | 环境 | 主任务阶段破坏所有岩石 | | 7.5% | 当前 |
| Early access | 提前进入 | 环境 | 剩余超过 30 秒进入降落舱 | | 7.6% | 当前 |
| Mission Possible | 可能任务 | 环境 | 用喷射靴在降落舱坡道着陆 3 次 | | | 当前 |
| Salvage operation | 打捞行动 | 环境 | 单次潜水回收 10 个 Overclock | | | 当前 |
| Tower defense | 塔防 | 环境 | 同时存活 50 个炮塔 | | 2.7% | 当前 |

## 十五、伤害 Damage（6）

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| A freeze is coming | 寒霜将至 | 伤害 | 造成 250,000 冰冻伤害 | | 86.7% | 当前 |
| Hot, hot, hot! | 热，热，热！ | 伤害 | 造成 250,000 火焰伤害 | | 79.6% | 当前 |
| Relish the pain | 享受痛苦 | 伤害 | 单次攻击造成超过 1337 伤害 | | 65.0% | 当前 |
| Freezing hot acid | 冰火酸 | 伤害 | 单次造成 2,500,000 状态效果伤害 | | 41.0% | 当前 |
| Multitool | 多功能工具 | 伤害 | 单次使用 5 种伤害类型造成伤害 | | 28.7% | 当前 |
| Perfect run | 完美跑图 | 伤害 | 不受任何伤害完成潜水 | | | 当前 |

## 十六、护卫 Escort（5）

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| Drill baby, drill | 钻吧宝贝，钻 | 护卫 | 单一阶段收集所有油页岩后完成潜水 | | 16.2% | 当前 |
| Fill 'er up | 给 B0b-33 加满油 | 护卫 | 为 B0b-33 完全加注燃料 | | 7.0% | 当前 |
| Roadkill | 辗毙 | 护卫 | 用 B0b-33 钻穿一只 lootbug | | 19.8% | 当前 |
| The only drilldozer here is me | 这里唯一的钻机是我 | 护卫 | 移动 B0b-33 前挖空整个阶段后完成潜水 | | | 当前 |
| Now, where did I put my keys? | 我把钥匙放哪了？ | 护卫 | 移动 B0b-33 前使外星威胁达等级 2 后完成潜水 | | | 当前 |

## 十七、异常·先锋·致命（11）

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| Anomaly - Hazard 1 | 异常 - 危险 1 | 异常·先锋·致命 | 完成 Hazard 1 Anomaly 潜水 | | 4.2% | 当前 |
| Anomaly - Hazard 2 | 异常 - 危险 2 | 异常·先锋·致命 | 完成 Hazard 2 Anomaly 潜水 | | 3.2% | 当前 |
| Anomaly - Hazard 3 | 异常 - 危险 3 | 异常·先锋·致命 | 完成 Hazard 3 Anomaly 潜水 | | 2.3% | 当前 |
| Anomaly - Hazard 4 | 异常 - 危险 4 | 异常·先锋·致命 | 完成 Hazard 4 Anomaly 潜水 | | | 当前 |
| Anomaly - Hazard 5 | 异常 - 危险 5 | 异常·先锋·致命 | 完成 Hazard 5 Anomaly 潜水 | | | 当前 |
| Vanguard - Hazard 3 | 先锋 - 危险 3 | 异常·先锋·致命 | 完成 Hazard 3 Vanguard 契约潜水 | | 7.4% | 当前 |
| Vanguard - Hazard 4 | 先锋 - 危险 4 | 异常·先锋·致命 | 完成 Hazard 4 Vanguard 契约潜水 | | 2.9% | 当前 |
| Vanguard - Hazard 5 | 先锋 - 危险 5 | 异常·先锋·致命 | 完成 Hazard 5 Vanguard 契约潜水 | | | 当前 |
| Employee of the Week | 本周员工 | 异常·先锋·致命 | 完成 1 次 Lethal 致命行动潜水（英文指南旧称 Employee of the Day） | | 2.8% | 当前 |
| Employee of the Month | 本月员工 | 异常·先锋·致命 | 完成 5 次 Lethal 致命行动潜水 | | | 当前 |
| Employee of the Year | 年度员工 | 异常·先锋·致命 | 完成 10 次 Lethal 致命行动潜水 | | | 当前 |

## 十八、耐力 Endurance（25）

> 中文名为"耐力：<类型> <级数>"直译参考；达成率=全球%。

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| Endurance: Dives I | 耐力：潜水 I | 耐力 | 完成 5 次潜水 | | 23.5% | 当前 |
| Endurance: Dives II | 耐力：潜水 II | 耐力 | 完成 25 次潜水 | | 8.8% | 当前 |
| Endurance: Dives III | 耐力：潜水 III | 耐力 | 完成 50 次潜水 | | 4.7% | 当前 |
| Endurance: Dives IV | 耐力：潜水 IV | 耐力 | 完成 75 次潜水 | | 2.9% | 当前 |
| Endurance: Dives V | 耐力：潜水 V | 耐力 | 完成 100 次潜水 | | | 当前 |
| Endurance: Kills I | 耐力：击杀 I | 耐力 | 击杀 50,000 敌人 | | 22.4% | 当前 |
| Endurance: Kills II | 耐力：击杀 II | 耐力 | 击杀 100,000 敌人 | | 16.0% | 当前 |
| Endurance: Kills III | 耐力：击杀 III | 耐力 | 击杀 250,000 敌人 | | 8.5% | 当前 |
| Endurance: Kills IV | 耐力：击杀 IV | 耐力 | 击杀 500,000 敌人 | | 4.6% | 当前 |
| Endurance: Kills V | 耐力：击杀 V | 耐力 | 击杀 1,000,000 敌人 | | | 当前 |
| Endurance: Damage I | 耐力：伤害 I | 耐力 | 造成 100,000,000 伤害 | | 18.7% | 当前 |
| Endurance: Damage II | 耐力：伤害 II | 耐力 | 造成 250,000,000 伤害 | | 12.5% | 当前 |
| Endurance: Damage III | 耐力：伤害 III | 耐力 | 造成 500,000,000 伤害 | | 9.4% | 当前 |
| Endurance: Damage IV | 耐力：伤害 IV | 耐力 | 造成 1,000,000,000 伤害 | | 6.8% | 当前 |
| Endurance: Damage V | 耐力：伤害 V | 耐力 | 造成 2,000,000,000 伤害 | | 4.5% | 当前 |
| Endurance: Mine I | 耐力：挖掘 I | 耐力 | 挖掘 15,000 方块 | | 21.8% | 当前 |
| Endurance: Mine II | 耐力：挖掘 II | 耐力 | 挖掘 50,000 方块 | | 12.0% | 当前 |
| Endurance: Mine III | 耐力：挖掘 III | 耐力 | 挖掘 100,000 方块 | | 7.6% | 当前 |
| Endurance: Mine IV | 耐力：挖掘 IV | 耐力 | 挖掘 150,000 方块 | | 5.4% | 当前 |
| Endurance: Mine V | 耐力：挖掘 V | 耐力 | 挖掘 250,000 方块 | | 3.2% | 当前 |
| Endurance: Run I | 耐力：奔跑 I | 耐力 | 跑 10,000 步 | | 32.6% | 当前 |
| Endurance: Run II | 耐力：奔跑 II | 耐力 | 跑 50,000 步 | | 21.9% | 当前 |
| Endurance: Run III | 耐力：奔跑 III | 耐力 | 跑 100,000 步 | | 14.9% | 当前 |
| Endurance: Run IV | 耐力：奔跑 IV | 耐力 | 跑 250,000 步 | | 7.6% | 当前 |
| Endurance: Run V | 耐力：奔跑 V | 耐力 | 跑 500,000 步 | | 3.6% | 当前 |

## 十九、其他动作 Other（12）

| 英文名 | 中文名 | 分类 | 解锁条件 | 生物群系档位 | 达成率 | 版本标记 |
|---|---|---|---|---|---|---|
| Rock and Stone! | 岩石与矿石！ | 其他动作 | 记得 Rock and Stone！（致敬彩蛋成就） | | 10.0% | 当前 |
| Underclocked | 降频运行 | 其他动作 | 不装备任何 Overclock 完成潜水 | | | 当前 |
| Pro side wobble compensator | 专业侧摆补偿器 | 其他动作 | 单次潜水装备 10 个 Overclock | | 24.1% | 当前 |
| Eye of the storm | 风暴之眼 | 其他动作 | NUK17 与 BRT7 均装不稳定 OC 完成潜水 | | 3.0% | 当前 |
| They see 'em rollin', they hatin' | 他们看它滚，他们恨 | 其他动作 | 单次潜水有 3 个 Tank Tracks OC | | | 当前 |
| All sides | 全副武装（副武器） | 其他动作 | 单次潜水有 3 个 Sidearm OC | | | 当前 |
| This is brilliant, but I like this | 这绝妙，但我喜欢这个 | 其他动作 | 单次潜水有 2 个 The Favourite OC | | | 当前 |
| Perfectly balanced | 完美平衡 | 其他动作 | 4 把及以上武器同级完成潜水 | | | 当前 |
| Underpromise, overdeliver | 低承诺，高交付 | 其他动作 | 所有武器 1 级完成潜水 | | | 当前 |
| What's in the box!? | 盒子里是什么！ | 其他动作 | 获得 10 个武器精通等级 | | 20.1% | 当前 |
| Count em! | 数一数！ | 其他动作 | 单次潜水发射 150,000 发弹丸 | | 11.4% | 当前 |
| Close call | 千钧一发 | 其他动作 | 以低于 30 HP 击杀 Dreadnought | | 34.2% | 当前 |

---

## 统计 & 缺口说明

- 本文件共收录 **300** 条成就（与 Steam / TrueAchievements 当前版本完全一致）。
- 达成率已填 **约 200+** 条（Steam 全球统计可抓取的）；其余（多为成就解锁类、部分 Overclock/True Mastery、少数隐藏项）留空，待工程师接入 Steam Web API 或后续补抓。
- **疑难成就（全球达成率 < 50%）约 280+ 条**——应用内"疑难高亮"应默认高亮绝大多数，建议改用"达成率分档"（如 <10% 极难、10–30% 难、30–50% 较难的二级/三级视觉权重）以避免全屏高亮。
- 中文名：职业/属性/装备/生物群系/生物/资源/神器/商店/环境/伤害/护卫/异常 等类别沿用英文指南译名；**武器 Overclock / Mastery / True Mastery / 耐力 系列为"英文名直译参考"**，游戏内简中客户端命名可能不同，上线前建议以游戏内文本校对（标注为待核风险）。
- 数值冲突已行内标注：Fully overclocked（4 武器 21 级 vs 5 武器 18 级）、Unreasonable uptime（30 秒 vs 60 秒）、Employee of the Day→Week、Greased Little Dwarf→Slick like butter 等，均因 1.0 版本重命名/调参，以 Steam 当前数据为准。
