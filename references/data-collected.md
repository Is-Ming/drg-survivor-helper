# 《深岩银河幸存者》(Deep Rock Galactic: Survivor) 数据底稿

> 本文件为游戏助手的数据底稿，由主理人齐活林汇总自以下 Steam 社区指南：
> - 中文攻略（武器强度/职业配装）：https://steamcommunity.com/sharedfiles/filedetails/?id=3405193479
> - 中文综合指南（成就/装备）：https://steamcommunity.com/sharedfiles/filedetails/?id=3292540173
> - 英文全成就指南：https://steamcommunity.com/sharedfiles/filedetails/?id=3532467239
>
> 目标：工程师请阅读本文件，并将其整理为应用内的数据模块（TS/JSON），
> 再实现查询 UI。数据以"原文名 + 中文译名"双字段呈现，便于检索。
> 评级仅来源于攻略作者主观评价（S=最强 / A=好用 / B=堪用 / C=几乎用不了 / - = 未评级）。

---

## 一、成就（Achievements）

分类：职业解锁 / 属性统计(Stats) / 装备(Gear) / 生物群系(Biomes) / 生物(Creatures) /
资源(Resources) / 神器(Artifacts) / 商店(Shop) / 环境(Environment) / 伤害(Damage) /
护卫任务(Escort) / 异常/先锋/致命(Anomaly·Vanguard·Lethal) / 其他动作

### 1. 职业解锁与进阶 (Classes)
| 英文名 | 中文译名 | 解锁条件 | 分类 |
|---|---|---|---|
| Run for the hills | 跑向山丘 | 解锁 Scout（侦察兵），默认解锁 | 职业 |
| The journey begins | 旅程开始 | 用 Classic Scout 完成一次潜水 | 职业 |
| Grow fat from strength | 从力量中变胖 | 作为 Classic Scout 拥有 1000 最大生命值 | 职业 |
| Adventure awaits | 冒险在召唤 | 用 Recon（侦察兵进阶）完成一次潜水（需 Scout 9 级） | 职业 |
| You're locked in here with me | 你和我一起被锁在这里 | 作为 Recon 在单一阶段存活 10 分钟 | 职业 |
| Measure twice, shoot once | 量两次，射一次 | 用 Sharpshooter（神枪手）完成一次潜水（需 Scout 18 级） | 职业 |
| BOOM! Headshot | 砰！爆头 | 作为 Sharpshooter 单次潜水拥有 +250% 暴击几率 | 职业 |
| Lock and load | 上膛待发 | 解锁 Gunner（枪手，需玩家等级 3） | 职业 |
| 10,000 rounds per minute | 每分钟一万发 | 用 Weapons Specialist（武器专家）完成一次潜水 | 职业 |
| Count em! | 数一数！ | 单次潜水射击 150,000 发弹丸 | 职业 |
| Lord of war | 战争之王 | 作为 Weapons Specialist 单次发射 250,000 发子弹 | 职业 |
| Tough as nails | 硬如铁钉 | 用 Juggernaut（重装兵）完成一次潜水（需 Gunner 9 级） | 职业 |
| Know no fear | 不知恐惧 | 作为 Juggernaut 拥有 300 护甲 | 职业 |
| Ka-boom! | 咔 boom！ | 用 Heavy Gunner（重型枪手）完成一次潜水（需 Gunner 18 级） | 职业 |
| Walk without rhythm | 无节奏行走 | 作为 Heavy Gunner 同时部署 30 个震击排斥炮塔 | 职业 |
| Enjoy a relaxing stroll | 享受轻松漫步 | 解锁 Engineer（工程师，需玩家等级 5） | 职业 |
| I solve problems | 我解决问题 | 用 Maintenance Worker（维修工）完成一次潜水 | 职业 |
| Unreasonable uptime | 不合理的在线率 | 作为 Maintenance Worker 使一件武器寿命达 30 秒 | 职业 |
| Brainstorming | 头脑风暴 | 用 Tinkerer（修补匠）完成一次潜水（需 Engineer 9 级） | 职业 |
| Fully overclocked | 完全超频 | 作为 Tinkerer 将 4 件武器升至 21 级 | 职业 |
| A whiff of brimstone | 一缕硫磺味 | 用 Demolitionist（爆破手）完成一次潜水（需 Engineer 18 级） | 职业 |
| Going nuclear | 进入核时代 | 作为 Demolitionist 拥有 +250% 爆炸半径 | 职业 |
| Dig down deep | 向下深掘 | 解锁 Driller（钻探者，需玩家等级 7） | 职业 |
| Diggy diggy hole | 挖呀挖个坑 | 用 Foreman（工头）完成一次潜水 | 职业 |
| With fire and blood | 以火与血 | 作为 Foreman 单次造成 10,000,000 火焰伤害 | 职业 |
| Chemical burns | 化学灼伤 | 用 Interrogator（审讯者）完成一次潜水（需 Driller 9 级） | 职业 |
| Elemental avatar | 元素化身 | 作为 Interrogator 单次施加 5,000,000 状态叠层 | 职业 |
| And my axe | 还有我的斧 | 用 Strong Armed（壮臂者）完成一次潜水（需 Driller 18 级） | 职业 |
| Fastest hands on the rig | 钻机上最快的手 | 作为 Strong Armed 拥有 +500% 装填速度 | 职业 |

### 2. 属性统计 (Stats)
| 英文名 | 中文译名 | 解锁条件 | 分类 |
|---|---|---|---|
| Delicious BLT | 美味的 BLT | 达到 300 最大生命值 | 属性 |
| It's got electrolytes | 含电解质 | 达到 50% 移动速度 | 属性 |
| Swift guns for swift hands | 快手配快枪 | 达到 75% 装填速度 | 属性 |
| Squint and squeeze the trigger | 眯眼扣扳机 | 达到 75% 暴击几率 | 属性 |
| Why so Salty? | 为何如此咸？ | 达到 50 护甲 | 属性 |
| Book of Experience | 经验之书 | 潜水期间达到等级 50 | 属性 |
| Feeling lucky punk? | 觉得幸运吗，混蛋？ | 单次潜水获得 5 个幸运升级 | 属性 |
| Hangry? | 饿怒？ | 累计获得 1,000 次等级提升 | 属性 |
| Survivor squad | 幸存者小队 | 全部 4 个职业均达到等级 30 | 属性 |
| Fully armed and operational | 全副武装且可运作 | 购买每一个 meta 升级 | 属性 |

### 3. 装备 (Gear)
| 英文名 | 中文译名 | 解锁条件 | 分类 |
|---|---|---|---|
| Custom rig | 定制装备 | 装备 6 件 uncommon（ uncommon）物品 | 装备 |
| Professional setup | 专业配置 | 装备 6 件 rare（稀有）物品 | 装备 |
| Truly epic | 真正史诗 | 装备一件 epic（史诗）物品 | 装备 |
| Expertly tuned | 专家调校 | 装备 6 件 epic 物品 | 装备 |
| Legendary! | 传奇！ | 装备一件 legendary（传奇）物品 | 装备 |
| Fabled fittings | 传说配件 | 装备 6 件 legendary 物品 | 装备 |
| Karl, is that you? | 卡尔，是你吗？ | 装备 6 件完全升级的 legendary 装备 | 装备 |
| We're keeping this one | 这个我们留着 | 完全升级一件装备 | 装备 |
| Master artificer | 大师工匠 | 完全升级一件 legendary 装备 | 装备 |
| Mind over matter | 精神胜于物质 | 无任何装备完成 Hazard 4 潜水 | 装备 |
| Just like the old days | 如同旧日 | 无任何装备完成 Hazard 5 潜水 | 装备 |

### 4. 生物群系 (Biomes)
每个生物群系有 普通(H5) / 精通(Mastery) / 真精通(True Mastery, H5) 三种成就。
生物群系：Crystalline Caverns(水晶洞穴) / Magma Core(岩浆核心) / Hollow Bough(空洞枝桠) /
Salt Pits(盐坑) / Azure Weald(蔚蓝荒野)
| 英文名 | 中文译名 | 分类 |
|---|---|---|
| Crystalline Caverns | 水晶洞穴 | 生物群系 |
| Mastery - Crystalline Caverns | 精通 - 水晶洞穴 | 生物群系 |
| True Mastery - Crystalline Caverns | 真精通 - 水晶洞穴 | 生物群系 |
| Magma Core | 岩浆核心 | 生物群系 |
| Mastery - Magma Core | 精通 - 岩浆核心 | 生物群系 |
| True Mastery - Magma Core | 真精通 - 岩浆核心 | 生物群系 |
| Hollow Bough | 空洞枝桠 | 生物群系 |
| Mastery - Hollow Bough | 精通 - 空洞枝桠 | 生物群系 |
| True Mastery - Hollow Bough | 真精通 - 空洞枝桠 | 生物群系 |
| Salt Pits | 盐坑 | 生物群系 |
| Mastery - Salt Pits | 精通 - 盐坑 | 生物群系 |
| True Mastery - Salt Pits | 真精通 - 盐坑 | 生物群系 |
| Azure Weald | 蔚蓝荒野 | 生物群系 |
| Mastery - Azure Weald | 精通 - 蔚蓝荒野 | 生物群系 |
| True Mastery - Azure Weald | 真精通 - 蔚蓝荒野 | 生物群系 |

### 5. 护卫任务 (Escort Duty)
| 英文名 | 中文译名 | 解锁条件 | 分类 |
|---|---|---|---|
| Drill baby, drill | 钻吧宝贝，钻 | 单一阶段收集所有油页岩后完成潜水 | 护卫 |
| Fully fuel B0b-33 | 给 B0b-33 加满油 | 为 B0b-33 完全加注燃料 | 护卫 |
| Roadkill | 辗毙 | 用 B0b-33 钻穿一只 lootbug | 护卫 |
| The only drilldozer here is me | 这里唯一的钻机是我 | 移动 B0b-33 前挖空整个阶段后完成潜水 | 护卫 |
| Now, where did I put my keys? | 我把钥匙放哪了？ | 移动 B0b-33 前使外星威胁达等级 2 后完成潜水 | 护卫 |

### 6. 异常 / 先锋 / 致命 (Anomaly · Vanguard · Lethal)
| 英文名 | 中文译名 | 分类 |
|---|---|---|
| Anomaly - Hazard 1 | 异常 - 危险 1 | 模式 |
| Anomaly - Hazard 2 | 异常 - 危险 2 | 模式 |
| Anomaly - Hazard 3 | 异常 - 危险 3 | 模式 |
| Anomaly - Hazard 4 | 异常 - 危险 4 | 模式 |
| Anomaly - Hazard 5 | 异常 - 危险 5 | 模式 |
| Vanguard - Hazard 3 | 先锋 - 危险 3 | 模式 |
| Vanguard - Hazard 4 | 先锋 - 危险 4 | 模式 |
| Vanguard - Hazard 5 | 先锋 - 危险 5 | 模式 |
| Employee of the Day | 今日员工 | 模式 |
| Employee of the Month | 本月员工 | 模式 |
| Employee of the Year | 年度员工 | 模式 |

### 7. 生物 (Creatures)
| 英文名 | 中文译名 | 解锁条件 | 分类 |
|---|---|---|---|
| Got bait? | 有诱饵吗？ | 单次击杀 3 只 Huuli Hoarders（胡利囤积者） | 生物 |
| This hurts me more | 这更伤我 | 单次击杀所有 lootbugs（补货虫） | 生物 |
| The dwarf with the golden bug | 带金虫的矮人 | 击杀一只金色 lootbug（稀有变种） | 生物 |
| Close call | 千钧一发 | 以低于 30 HP 击杀 Dreadnought（无畏舰） | 生物 |
| Still only counts as one! | 仍只算一个！ | 不受任何伤害击杀 Dreadnought | 生物 |
| Denied | 拒绝 | 在 Dreadnought Twins 治疗前击杀它们 | 生物 |
| Bullseye | 靶心 | 用补给舱击杀 Q'ronar Shellback | 生物 |

### 8. 资源 (Resources)
| 英文名 | 中文译名 | 解锁条件 | 分类 |
|---|---|---|---|
| Get that Midas touch | 获得迈达斯之触 | 收集 250 金 | 资源 |
| Au-fully rich | 极其富有 | 收集 2,000 金 | 资源 |
| Gotta stay Nitrated | 必须保持硝化 | 收集 250 Nitra | 资源 |
| Sprinkle of Nitra | 少许 Nitra | 收集 2,000 Nitra | 资源 |

### 9. 神器 (Artifacts)
| 英文名 | 中文译名 | 解锁条件 | 分类 |
|---|---|---|---|
| They belong in a museum | 它们属于博物馆 | 不使用任何神器完成潜水 | 神器 |
| Deep scan | 深度扫描 | 单次拥有 5 个 scanner 神器 | 神器 |

### 10. 商店 (Shop)
| 英文名 | 中文译名 | 解锁条件 | 分类 |
|---|---|---|---|
| Corporate discount | 公司折扣 | 花费 2,500 金 | 商店 |
| Big spender | 大买家 | 花费 20,000 金 | 商店 |
| I ain't buying it | 我才不买 | Hazard 3 不购买任何商店物品完成潜水 | 商店 |
| Cheapskate | 小气鬼 | 不花费任何金或 Nitra 完成潜水 | 商店 |
| Extreme indecision | 极度犹豫 | 单次执行 50 次重摇 | 商店 |

### 11. 环境 / 动作 (Environment)
| 英文名 | 中文译名 | 解锁条件 | 分类 |
|---|---|---|---|
| Jetty boots | 喷射靴 | 单次落在岩石上 200 次 | 环境 |
| They fly now? | 它们现在会飞了？ | 单一阶段弹跳 100 次 | 环境 |
| Axe in face! | 斧头面对面！ | 主任务阶段破坏所有岩石 | 环境 |
| Early access | 提前进入 | 剩余超过 30 秒进入降落舱 | 环境 |
| Mission Possible | 可能任务 | 用喷射靴在降落舱坡道着陆 3 次 | 环境 |

### 12. 伤害 (Damage)
| 英文名 | 中文译名 | 解锁条件 | 分类 |
|---|---|---|---|
| A freeze is coming | 寒霜将至 | 造成 250,000 低温伤害 | 伤害 |
| Hot, hot, hot! | 热，热，热！ | 造成 250,000 火焰伤害 | 伤害 |
| Relish the pain | 享受痛苦 | 单次攻击造成超过 1337 伤害 | 伤害 |
| Freezing hot acid | 冰火酸 | 单次造成 2,500,000 状态效果伤害 | 伤害 |
| Multitool | 多功能工具 | 单次使用 5 种伤害类型 | 伤害 |
| Perfect run | 完美跑图 | 不受任何伤害完成潜水 | 伤害 |

> 注：中文综合指南另提及若干"疑难成就"（全球达成率<50%），可作为补充参考：
> 油滑矮人（单次闪避100次）、硝石井喷（累计2000硝石，解锁装备"硝基火药"）、
> 瞄准再往死里打（暴击75%）、不挨打成器（单次承受2000伤害）、
> 吃过的盐挨过的打（护盾50）、甜食慰藉（单次回复500血）、
> 冰火酸三重天（250万持续伤害）、万用集一身（5种伤害类型）、
> 数不胜防（15万发射物）、永不空军（杀3只嗜矿异虫，解锁召唤装备）、
> 勤恳过度（摧毁单阶段所有岩体）、好运傍身（单次5个运气升级）。

---

## 二、武器（Weapons）

> 数据主源：中文攻略(3405193479)。字段：英文名 / 中文名 / 职业(class) /
> 标签(tags) / 黄色超频模块(6/12 级) / 红色超频模块(18 级) / 强度评级(rating)
> 标签含元素与流派：动能/火焰(Fire)/冰冻(Cryo)/腐蚀(Acid)/电击(Electric)/电浆(Plasma)/
> 射线(Beam)/霰弹/无人机/炮塔/手雷/控制/输出 等。

### Scout（侦察兵）
| 英文名 | 中文名 | 标签 | 黄色超频(部分) | 红色超频(部分) | 评级 |
|---|---|---|---|---|---|
| M1000 | M1000 狙击枪 | 狙击, 壮男孩流派 | +15%伤+25%装填；+100%弹匣-20%装填；+25%射速+25%装填；火焰伤害；+15%伤+击退 | 更多子弹更小射程；壮男孩(组合投射物大伤降装填) | S |
| GK2 | GK2 步枪 | 步枪, 优先高血敌 | +15%伤+25%装填；电击；冰冻；目标高HP；+100%穿透+30%伤-30%射速 | +150%伤-20%射速装填；+100%伤+100%射速(他枪-30%) | A |
| Plasma Carbine | 电浆卡宾枪 | 最强, 冰冻 | +15%伤+25%装填；+100%弹匣-20%装填；过冷减速；+25%射速装填；燃烧 | 更多子弹小射程；最后子弹四散 | S |
| Tactical Crossbow | 战术弩 | 控制, 冰/火弩 | 冰冻弩箭；火焰弩箭；+25%射速装填；+15%伤击退 | 全类型弩箭齐射；大敌留电场 | A |
| Frozen Grenade | 冰冻手雷 | 控场 | +15%伤+25%装填；分裂3弱；+30%范围；地形伤害 | +25%范围拉拢；+75%伤强(他枪-30%持效) | A |
| Frost Drone | 冰冻无人机 | 无人机, 控场 | 主动寻敌；+30%装填-20%生命爆裂；+1无人机；-50%射程盘旋 | +20%伤+50%装填保护；+3无人机 | - |
| Dual Shotgun | 双管霰弹枪 | 霰弹 | 电击；+100%弹匣-20%装填；+50%射程+10%伤；冰冻 | 双倍弹丸少伤；粗壮男孩(大伤降装填) | - |
| Thunderhead Pistol | 雷神手枪 | 手枪, 射线 | +15%伤装填；装填爆炸；+1射线；-25%伤他枪+25% | +3射线；射线分裂 | - |
| Boomerang | 雷电回旋镖 | 回旋, 电击 | 高HP目标；+50%射程+10%伤；拾取经验；+350%射程-40%装填螺旋 | 不返回爆裂；反向投掷 | - |
| Zhukov | 朱可夫 SMG | SMG, 冰/电 | +100%弹匣-20%装填；电击；冰冻；装填爆炸；+25%射速装填 | 射速+200%弹匣+100%螺旋；+200%装填+30%伤八方向 | - |

### Gunner（枪手）
| 英文名 | 中文名 | 标签 | 黄色超频(部分) | 红色超频(部分) | 评级 |
|---|---|---|---|---|---|
| Plasma Carbine | 电浆卡宾枪 | 最强 | (同 Scout) | (同 Scout) | S |
| Twin Minigun | 双管机炮 | 输出, 削弱仍强 | +15%伤装填；+100%弹匣-20%装填；+25%射速装填；+100%穿透+30%伤-30%射速；+15%伤击退 | 最后子弹四散；+150%射速-15命中 | S |
| Earthquake Cannon | 地震炮 | 跟随, 控场 | 减慢敌人；+30%装填-20%生命爆；+1容量；跟随 | +3容量；+100%伤+50%寿命(他枪-30%) | S |
| Tactical Leadburster | 战术铅爆雷 | 分裂, 燃烧 | 分裂3弱；燃烧；+200%穿透-30%寿命 | +150%伤-20%射速装填；+100%伤+100%射速(他枪-30%) | S |
| Leadstorm PMC | 铅爆机枪 | 机枪 | +100%弹匣-20%装填；+25%射速装填；+100%穿透+30%伤-30%射速；火焰；装填护甲翻倍 | +150%伤-20%射速装填；+100%伤+100%射速(他枪-30%) | - |
| Bulldog | 斗牛犬手枪 | 初始弱 | +100%弹匣-20%装填；+100%穿透+30%伤-30%射速；燃烧；装填护甲翻倍；+15%伤击退 | 双平行弹；+150%伤-20%射速装填 | - |
| Electro Cannon | 电磁手炮 | 岩体伤害 | +15%伤装填；地形伤；装填爆炸；+50%射程+10%伤 | +1射线；+3射线 | A |
| Rocket | 火箭弹 | 范围, 燃烧 | +15%伤装填；点燃地面；+50%范围；+3火箭 | +100%弹匣；+75%伤+30%范围(他枪-25%) | A |
| BRT7 | BRT7 步枪 | 步枪 | +100%弹匣-20%装填；+25%射速装填；+100%穿透+30%伤-30%射速；燃烧；-25%伤他枪+25% | 射速+200%弹匣+100%螺旋；+200%装填+30%伤八方向 | - |
| Flame Drone | 火焰无人机 | 无人机, 火 | 盘旋；+30%装填-20%寿命爆；地形破坏；+1无人机 | 火迹；+3无人机 | - |
| Incendiary Grenade | 燃烧手雷 | 手雷, 火 | 分裂3弱；+30%范围；+35%强-10%伤；额外动能爆 | 受伤投雷；+25%范围拉拢 | - |
| Earthquake Sentry | 地震哨戒炮 | 炮塔 | (同地震炮) | (同地震炮) | S |

### Engineer（工程师）
| 英文名 | 中文名 | 标签 | 黄色超频(部分) | 红色超频(部分) | 评级 |
|---|---|---|---|---|---|
| 210 Shotgun | 210 霰弹枪 | 电浆流 | 电击；电浆；+25%射速装填；+50%射程+10%伤 | 反向射；双倍弹丸少伤 | A |
| Laser Pointer | 激光笔 | 射线, 冰/火 | +15%伤装填；减速；燃烧；感电；+1射线；+100%伤-35%寿命 | +3射线；+150%伤-50%寿命 | A |
| Plasma Grenade | 电浆手雷 | 最强手雷, 控/伤 | +15%伤装填；减速；感电；额外动能爆 | 更多弹跳；+75%伤+30%范围(他枪-25%) | A |
| Plasma Cutter | 等离子切割器 | 切割, 射线 | +15%伤装填；燃烧；感电；+1射线 | +3射线 | - |
| MG Turret | 机枪哨戒炮 | 炮塔, 电浆 | 电击；电浆；+1容量；墙伤；跟随 | +3容量；+150%射速-15命中 | - |
| Flame Turret | 火焰哨戒炮 | 炮塔, 火 | +30%装填-20%寿命爆；+1容量；采墙；+1射线；跟随 | +3容量；死爆火滩 | A |
| TESLA | 电网 | 电塔, 减速 | 减慢；+1容量；拾经验；+30%装填-20%寿命爆 | 射结构光束；+3容量 | - |
| PGL | PGL 榴弹发射器 | 爆炸 | +100%弹匣-20%装填；分裂3弱；+30%范围；+25%射速装填 | 反向射；+75%伤+30%范围(他枪-25%) | - |
| Thunder Drone | 雷电无人机 | 无人机, 电 | 寻敌；+30%装填-20%寿命爆；+1无人机 | 射建造物；缰绳；+20%伤+50%装填保护 | - |
| Smart Rifle | 智能步枪 | 步枪 | 电击；+100%弹匣-20%装填；+25%射速装填；+100%穿透+30%伤-30%射速 | +150%伤-20%射速装填；+100%伤+100%射速(他枪-30%) | - |
| Swarm Grenade | 群蜂手雷 | 无人机雷 | +15%伤装填；分裂3弱；+1无人机 | +3无人机 | - |
| Mega Volt SMG | 百万伏特冲锋枪 | 冲锋, 电 | 装填爆；+25%射速装填；-25%伤他枪+25% | +25%射速装填+100%强+30弹匣-50精；射哨戒炮 | - |

### Driller（钻机手）
| 英文名 | 中文名 | 标签 | 黄色超频(部分) | 红色超频(部分) | 评级 |
|---|---|---|---|---|---|
| Microwave Gun | 微波枪 | 最强, 减速 | 旋转速；射线宽；射线长少宽优先高血；+100%强-30%伤 | +50%伤加减速 | S |
| Sludge Pump | 污泥泵 | 短射程输出 | +15%伤装填；+100%持续；+35%伤-10%强；+1射线 | +3射线 | A |
| Cryo Cannon | 急冻加农炮 | 冷冻, 射线 | +100%持续；+1射线；+35%强-10%伤；+15%伤燃烧 | +3射线；+50%寿命射程伤 | A |
| Axes | 冲击斧 | DOT, 酸/火 | +15%伤装填；酸痕；火迹；+50%射程 | +100%弹匣 | A |
| Poison Drone | 毒液无人机 | 无人机, 毒 | 盘旋；+30%装填-20%寿命爆；+1无人机 | +20%伤+50%装填保护；+3无人机 | A |
| Flamethrower | 火焰喷射器 | DOT, 火 | +15%伤装填；+100%持续；+1射线；+35%伤-10%强 | +3射线；火墙；+50%寿命射程伤 | - |
| Subata120 | 苏巴塔120 | 初始, 酸/火 | 酸液；+100%弹匣-20%装填；+25%射速装填；火焰；-25%伤他枪+25% | 反向射；双平行弹 | - |
| Plasma Pistol | 等离子手枪 | 手枪, 等离子 | +15%伤装填；减速；燃烧；拉敌 | 地面火；分裂 | - |
| Hi-Explosive Grenade | 高爆手榴弹 | 手雷 | +15%伤装填；分裂3弱；+30%范围；地形伤 | 受伤投雷；恐惧逃跑 | - |
| Acid Grenade | 酸液手雷 | 手雷, 酸 | 分裂3弱；+30%范围；+35%强-10%伤；额外动能爆 | 受伤投雷；恐惧逃跑 | - |
| Flame Sentry | 火焰哨戒炮 | 炮塔, 火 | (同工程师火焰哨戒炮) | (同工程师火焰哨戒炮) | A |

> 说明：中文综合指南(3292540173)另列出数把跨职业武器供配装参考：
> 冰枪(Ice Gun，钻机近身防守核心)、火雷(Fire Grenade，分裂必拿)、
> 火箭(Rocket，点燃地面必选)、机炮(Cannon/Minigun，T0初始)、
> 榴弹(Grenade，爆破手)、电浆枪(Plasma Gun，工程电浆流)。

---

## 三、装备（Equipment）

> 数据主源：中文综合指南(3292540173)。分"局内附加装备"与"成就解锁装备"两类。
> 字段：名称 / 类型 / 效果 / 来源(source)

### 局内附加装备（Additional / In-run）
| 名称 | 类型 | 效果 |
|---|---|---|
| 商店折扣券 | 发育 | 省货币，生态专精初期值得刷 |
| 集团配发磁铁 | 拾取 | 自身拾取弱时拿 |
| 红糖块 | 生存 | 吃红糖加血量上限，多碰瓷吃红糖 |
| 挖矿概率得黄金/硝石/经验 | 发育 | 适合钻机/高挖速 |
| 记仇名单 | 经验 | 受伤获得经验，熔岩之心碰瓷岩浆好用 |
| 武器补给箱 | 武器 | 抽别的职业武器，上下限大，勿轻易开 |
| 三明治 | 生存 | 回血，配能量棒抵消扣血 |
| 椒盐卷饼 | 生存 | 回血，配狂人头盔提低血脉容错 |
| 挖他命 | 生存/升级 | 提升升级回复血量，后期收益低 |
| 能量棒 | 生存 | 配三明治 |
| 狂人头盔 | 战力 | 低血量容错，配椒盐卷饼/三明治 |
| 腌制硝石 | 直伤核心 | 加伤，直伤流关键 |
| 侧目目镜 / EE5目镜 | 直伤/混伤 | -30%伤害 +30%暴击 +100%暴伤，后期 T0.5 |
| P2W控制器 | 战力 | 原版每分钟-50黄金+100%伤；新版本改永久叠伤 |
| 涡轮解码器 | 战力 | 降挖速，加伤和装填；小心被地刺困 |
| 复古知识库 | 发育 | 直升3级，后期 T2 |
| 护甲润滑油 | 闪避 | +10%闪避（油滑矮人解锁，作者评鸡肋） |
| 反射调节仪 | 闪避 | 每次受伤+5%闪避，最高5层 |
| 硝基火药 | 暴击 | 硝石井喷成就解锁，加暴击率 |

### 成就解锁装备（Achievement-unlocked）
| 名称 | 解锁成就 | 效果 |
|---|---|---|
| 护甲润滑油 | 油滑矮人 | +10%闪避加成（装备池可能污染） |
| 硝基火药 | 硝石井喷 | 加暴击率 |
| 嗜矿异虫召唤装备 | 永不空军 | 一次性召4只嗜矿异虫，全杀收益高 |

---

## 四、给工程师的实现建议（非数据，仅建议）
- 技术栈：Vite + React + MUI + Tailwind CSS（默认）
- 三大模块 Tab：成就 / 武器 / 装备
- 全局搜索框（按中英文名/标签匹配）+ 分类筛选（成就按分类、武器按职业/评级、装备按类型/来源）
- 武器卡片展示：名称(中英)、职业、标签 chips、黄/红超频模块、评级徽章
- 数据量大，建议拆成独立数据模块文件（achievements.ts / weapons.ts / equipment.ts）便于维护
- 纯前端、数据内嵌、无需后端
