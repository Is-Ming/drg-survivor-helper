# 数据核对清单（DRG 中文译名校正）

> 生成日期：2026-07-17 ｜ 来源：
> - 游戏提取表 `F:/workbuddy工作空间/日常/中文提取/drg_zh_en.json`
> - 项目基线 `server/data/baseline.json`
>
> **这是给你先核对的清单，确认无误后我才动手改 `baseline.json`。**
> 处理原则：成就（achievements）按你的要求**不动**；武器忽略引号/空格差异；超频以 json 为主。

## 一、附加装备（equipments）

### 1.1 现有 20 条 — 需修正项

| # | 当前 name | 改为 name | 当前 officialName | 改为 officialName | 说明 |
|---|---|---|---|---|---|
| 1 | 商店折扣券 | 集团折扣券 | DRG Coupon | DRG Coupons | 复数 |
| 2 | 集团配发磁铁 | （不变） | Company-issued Magnet | Company Issued Magnet | 仅英文空格 |
| 3 | 侧目目镜 / EE5 目镜 | 侧眼-EE5 目镜 | Squint-EE5 | （不变） | 中文名 |
| 4 | 三明治 | 战术小饼干 | 待核（疑似 Tactical Cookie） | Tactical Cookie | 中英均改，已经核对|
| 5 | 挖他命 | “挖”他命药丸 | 待核（疑似 Vita-miner Pills） | Vita-Miner Pills | 中英均改（m 大小写），已经核对 |
| 6 | 狂人头盔 | （不变） | 待核（无 exact 对应） | The MoCap | 仅补英文，已经核对 |
| 7 | 嗜矿异虫召唤装备 | 嗜矿异虫用诱饵 | Huuli Bait | （不变） | 中文名 |
| 8 | 挖矿概率得黄金/硝石/经验 | （删除此合并条） | Gold Scanner / Nitra Scanner / XP Scanner | （拆 3 条） | 见 1.2 拆分 |
| — | 其余 12 条（红糖块、记仇名单、武器补给箱、复古知识库、P2W 控制器、涡轮解码器、椒盐卷饼、能量棒、腌制硝石、反射调节仪、护甲润滑油、硝基火药） | — | — | — | 经核对中英文均准确，无需改 |

### 1.2 拟新增（json 有、baseline 缺的真实装备）

> 以下从 json `Artifacts_zh-CN` 甄别出的**真实装备**（非 perk/非效果文本/非垃圾）。新增条目 `name=中文`、`officialName=英文`，`type/effect/source` 暂留空（json 无这些字段），等你确认后一并补。

| # | officialName (英) | name (中) | 是否为真实装备|
|---|---|---|---|
| 1 | Ammo Rig | 弹药背带 | 是|
| 2 | Gold Scanner | 黄金探测仪 | 是|
| 3 | Nitra Scanner | 硝石探测仪 |是|
| 4 | XP Scanner | 经验探测仪 |是|
| 5 | FRZ Shield Belt | FRZ 护盾腰带 |是|
| 6 | BRN Shield Belt | BRN 护盾腰带 |是|
| 7 | Jet Boots | 喷气靴 |是|
| 8 | Old Memento | 老照片 |待定|
| 9 | Gold-Tipped Bullets | 镀金弹头 |否|
| 10 | Frostburn | 赤火冰心 |待定|
| 11 | Hot Plasma | 灼热电浆 |待定|
| 12 | Interrogator | 审问者 |否|
| 13 | Popup Tripod | 便携脚架 |是|
| 14 | Barley Bulb Juice | 球果原汁 |待定|
| 15 | Diver's Manual | 深潜宝典 |是|
| 16 | Lightning Reflexes | 即时反应 |待定|
| 17 | Hotstepper | 风火前行 |待定|
| 18 | Chemist Kit | 化学套件 |是|
| 19 | Piercing Projectiles | 穿深型发射物 |是|
| 20 | Multi Tool | 万能起子 |是|
| 21 | 5 Leaf Clover | 五叶草 |待定|
| 22 | Pick Axtender | 延长镐身 |是|
| 23 | Gridrunner | 电栅行者 |待定|
| 24 | Overflow | 载荷泛溢 |待定|
| 25 | Corrosive Thunder | 酸蚀雷爆 |待定|
| 26 | Charged reload | 放电装填 |待定|
| 27 | Diffractor prism | 衍射棱镜 |待定|
| 28 | Widget Spinner | 陀螺组件 |待定|

**待你确认是否算装备（疑似 perk，未纳入新增）：**  都不是
- `Classic` / 经典装备    
- `Contractor` / 合同工
- `Operator` / 操作员

### 1.3 json 中已剔除（非装备，不新增）

- **Perk / 性格技能名（10 条）**：Strong Armed 投掷手、Demolitionist 爆破手、Maintenance Worker 维护员、Foreman 矿队工头、Heavy Gunner 重型枪手、Juggernaut 突进手、Recon 侦查员、Sharp Shooter 精准射手、Tinkerer 枪匠、Weapons Specialist 武器专家
- **装备效果描述文本（大量带 {placeholder} 的句子）**：如 “You get a small chance to find Gold...”、“{stats} when collecting Red Sugar” 等 —— 这些是装备效果说明，不是装备名
- **垃圾占位（约 18 条）**：`"""""""""""` 及若干孤立引号 —— 提取残留，直接丢弃

## 二、武器（weapons，42 条全列）

> 引号/空格差异已忽略。标记「需改」为真实错译或电击双枪名互换；「无需改」为中文已正确。

| # | englishName | 当前中文 | json 中文 | 需改? | 说明 |
|---|---|---|---|---|---|
| 1 | M1000 | M1000 经典型步枪 | M1000 经典型步枪 | 无需改 | 已经核对 |
| 2 | DeepCore GK2 | 深核 GK2 突击步枪 | 深核 GK2 突击步枪 | 无需改 | 已经核对 |
| 3 | DRAK-25 Plasma Carbine | DRAK-25 电浆卡宾枪 | DRAK-25 电浆卡宾枪 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 4 | Nishanka Boltshark | 尼桑卡 X-80 "闪电鲨" 战术弩 | 尼桑卡 X-80 "闪电鲨" 战术弩 | 无需改 | 合并/特殊条目，json 无直接对应 |
| 5 | Cryo Grenade | 急冻手雷 | 急冻手雷 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 6 | Arc-Tek Cryo Guard | Arc-Tek 急冻无人护卫机 | Arc-Tek 急冻护卫无人机 | ⚠ 需改 | 真实差异 |
| 7 | Jury-Rigged Boomstick | 应急霰弹枪 | 应急霰弹枪 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 8 | Voltaic Stun Sweeper | “雷神之罚”电击枪 | 强电震击镖 | ⚠ 需改 | 真实差异 |
| 9 | TH-0R Bug Taser | 强电震击镖 | “雷神之罚” 电击枪 | ⚠ 需改 | 真实差异 |
| 10 | Zhukov NUK17 | 朱可夫 NUK17双持冲锋枪 | 朱可夫 NUK17 双持冲锋枪 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 11 | Thunderhead Heavy Autocannon | “雷暴云砧”重型双管机炮 | “雷暴云砧” 重型双管机炮 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 12 | Seismic Repulsor | “地震冲击”重锤哨戒炮 | “地震冲击” 重锤哨戒炮 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 13 | Tactical Leadburster | 战术铅爆雷 | 战术铅暴雷 | ⚠ 需改 | 真实差异 |
| 14 | Lead Storm Powered Minigun | “铅暴”转管机枪 | “铅暴” 转管机枪 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 15 | Bulldog Heavy Revolver | “斗牛犬”重型左轮手枪 | “斗牛犬” 重型左轮手枪 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 16 | ArmsKore Coil Gun | “武装核心”电磁手炮 | “武装核心” 电磁手炮 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 17 | Hurricane Guided Rocket System | “飓风”制导火箭系统 | “飓风” 制导火箭系统 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 18 | BRT7 Burst Fire Gun | BRT7 连发手枪 | BRT7 连发手枪 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 19 | Firefly Hunter Drone | “萤火虫”燃烧狩猎无人机 | “萤火虫” 燃烧狩猎无人机 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 20 | Incendiary Grenade | 燃烧手雷 | 燃烧手雷 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 21 | Warthog Auto 210 | “疣猪”210 自动霰弹枪 | “疣猪” 210 自动霰弹枪 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 22 | Shard Diffractor | 心石聚能炮 | 心石聚能炮 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 23 | Plasma Burster | 电浆连爆雷 | 电浆连爆雷 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 24 | Breach Cutter / ArmsKore Coil Gun | 等离子切割机 | 等离子切割器 | 需要修改 | 已经核对需要修改 |
| 25 | LMG Gun Platform | 轻机枪哨戒炮 | 轻机枪哨戒炮 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 26 | Krakatoa Sentinel | “喀拉喀托”单兵喷火哨戒炮 | “喀拉喀托” 单兵喷火哨戒炮 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 27 | Voltaic Shock Fence | 强电防护网 | 强电防护网 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 28 | DeepCore PGL | 深核 40mm 便携式榴弹发射器 | 深核 40mm 便携式榴弹发射器 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 29 | Hi-Volt Thunderbird | Hi-Volt 雷鸟无人机 | Hi-Volt “雷鸟” 电击护卫无人机 | ⚠ 需改 | 真实差异 |
| 30 | LOK-1 Smart Rifle | LOK-1 智能步枪 | LOK-1 智能步枪 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 31 | Shredder Swarm Grenade | 群蜂手雷 | 蜂群手雷 | ⚠ 需改 | 真实差异 |
| 32 | Stubby Voltaic SMG | “百万”伏特微型冲锋枪 | “百万” 伏特微型冲锋枪 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 33 | Colette Wave Cooker | 柯莱特微波烹调者 | 柯莱特 微波烹调者 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 34 | Corrosive Sludge Pump | 蚀泥喷射泵 | 蚀泥喷射泵 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 35 | Cryo Cannon | 急冻喷射炮 | 急冻喷射炮 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 36 | Impact Axe | 冲击战斧 | 冲击战斧 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 37 | K1-P Viper Drone | K1-P "毒蟒" 腐蚀毒素无人机 | K1-P “毒蟒” 腐蚀毒素无人机 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 38 | CRSPR Flamethrower | CRSPR 火焰喷射器 | CRSPR 火焰喷射器 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 39 | Subata 120 | 苏巴塔120半自动手枪 | 苏巴特 120 半自动手枪 | ⚠ 需改 | 真实差异 |
| 40 | Experimental Plasma Charger | 实验性等离子聚能手枪 | 实验性等离子蓄能手枪 | ⚠ 需改 | 真实差异 |
| 41 | High Explosive Grenade | 高爆手雷 | 高爆手雷 | 无需改 | 中文已与 json 一致（引号/空格忽略） |
| 42 | Neurotoxin Grenade | 神经毒素手雷 | 神经毒素手雷 | 无需改 | 中文已与 json 一致（引号/空格忽略） |

**电击双枪名互换说明**：`Voltaic Stun Sweeper` 当前中文是“雷神之罚”电击枪（实为 TH-0R 的名），`TH-0R Bug Taser` 当前中文是“强电震击镖”（实为 Voltaic 的名）。两者**互换**即可修正。

## 三、超频（overclocks，126 条全列）

> 以 json 为主：凡与 json 中文不符的一律改为 json 译法。

### 3.1 需改（与 json 不符）

| # | englishName | 当前中文 | json 中文 |
|---|---|---|---|
| 1 | A Little More Oomph! | 威力提升 | 活力四射 |
| 2 | Acid Blades | 酸蚀利刃 | 腐蚀利刃 |
| 3 | Acid Dipped Tips | 酸浸箭尖 | 淬毒弹头 |
| 4 | Afterburner | 加力燃烧 | 后燃加力 |
| 5 | Akimbo | 双持 | 武器双持 |
| 6 | Battery Bullets | 电击弹匣 | 蓄电子弹 |
| 7 | Behaviour Chip: Defensive | 防御芯片 | 行为逻辑芯片：护卫 |
| 8 | Behaviour Chip: Aggro | 主动寻敌 | 行为逻辑芯片：激进 |
| 9 | Better Ball Bearings | 顺滑轴承 | 高端轴承 |
| 10 | Big Game Hunter | 狩猎大型猎物 | 巨兽猎人 |
| 11 | Bigger Mags | 扩容弹匣 | 更大弹匣 |
| 12 | Bigger Tanks | 扩容储罐 | 更大储罐 |
| 13 | Charged Reload | 充能装填 | 放电装填 |
| 14 | Chemical Reload | 化学装填 | 化工装填 |
| 15 | Coilgun Mining Damage | 线圈炮挖矿 | 手炮地形破坏 |
| 16 | Cold Blades | 寒冰刀片 | 急冻利刃 |
| 17 | Cold Plasma | 低温等离子体 | 寒冷电浆 |
| 18 | Compact Explosives | 紧凑炸药 | 小而精悍 |
| 19 | Coolant Leak | 冷却液泄漏 | 冷剂泄露 |
| 20 | Corrosive Coating | 腐蚀涂层 | 涂毒毒刃 |
| 21 | Corrosive Thunder | 腐蚀雷霆 | 酸蚀雷爆 |
| 22 | Crowd Cooker | 群体灼烧 | 群虫鼎沸 |
| 23 | Cryo Bolt | 冰冻箭矢 | 冰冻弩箭 |
| 24 | Diesel Soaked | 浸油 | 柴油浸润 |
| 25 | Disposable Tech | 一次性技术 | 即弃即炸 |
| 26 | Drone Mining Damage | 无人机挖矿 | 无人机地形破坏 |
| 27 | Electrified Rounds | 电击弹 | 带电子弹 |
| 28 | Explosive Reload | 爆炸装填 | 爆破装填 |
| 29 | Extra Capacity | 额外容量 | 额外警戒 |
| 30 | Fire Bolt | 火焰箭矢 | 火焰弩箭 |
| 31 | Fire Bullets | 燃烧弹 | 火焰铅弹 |
| 32 | Focused Lens | 聚焦透镜 | 聚焦镜头 |
| 33 | Frequency Amp | 频率放大器 | 同频增强 |
| 34 | Frostburn | 霜燃 | 低温灼烧 |
| 35 | Fusion Turbines | 聚变涡轮 | 热核轮机 |
| 36 | Gold Sniffer | 黄金嗅探器 | 黄金嗅探 |
| 37 | High Caliber Rounds | 大口径弹药 | 大口径弹 |
| 38 | High Velocity Bullets | 高速弹头 | 高速子弹 |
| 39 | Hot Plasma | 高温等离子体 | 灼热电浆 |
| 40 | Impact Punch | 冲击拳 | 化学冲击 |
| 41 | Incendiary Payload | 燃烧弹头 | 燃剂载荷 |
| 42 | Ionized Plasma | 电离等离子体 | 电离电浆 |
| 43 | Kinda Looks Like a Magnet | 看着像磁铁 | “有点形似磁铁...” |
| 44 | Knuckle Grip | 关节握把 | 指虎握把 |
| 45 | Lightweight Alloy | 轻量化合金 | 轻量合金 |
| 46 | Marker Lights | 标记灯 | 航行灯 |
| 47 | Mining Directive | 挖矿指令 | 挖掘指令 |
| 48 | More Beams | 更多光束 | 更多射线 |
| 49 | Nano Waves | 纳米波 | 纳米微波 |
| 50 | Overheat | 过热 | 暴力超频 |
| 51 | Pan Fried Shells | 煎烤弹壳 | 油爆弹头 |
| 52 | Personal Space Invaders | 私人空间入侵者 | 过度保护 |
| 53 | Piercing Projectiles | 穿透弹 | 穿深铅弹 |
| 54 | Plasma Coating | 等离子涂层 | 电浆覆盖 |
| 55 | Plasmatic Rounds | 等离子弹 | 电浆子弹 |
| 56 | Potent Juice | 强力药剂 | 强力化学 |
| 57 | Refrigerated Gunpowder | 冷藏火药 | 低温火药 |
| 58 | Reload Shield | 换弹护盾 | 换弹庇护 |
| 59 | Rubber Tip | 橡胶弹头 | 橡胶弹尖 |
| 60 | Secret Sauce | 秘制酱料 | 传奇秘方 |
| 61 | Spare Rockets | 备用火箭 | 额外火箭 |
| 62 | Tape Some Ice to It! | 绑点冰块！ | 土制降温 |
| 63 | Tape Some Nails to It | 绑点钉子 | 土制增伤 |
| 64 | Thermal Overload | 热力过载 | 铝热过载 |
| 65 | True TNT | 真·烈性炸药 | 矿山炸药 |
| 66 | Widened Sprinkler | 加宽喷头 | 拓宽喷口 |
| 67 | Widget Spinner | 旋转装置 | 陀螺组件 |
| 68 | Akimbo | 双持 | 武器双持 |
| 69 | Bigger Mags | 超大弹匣 | 更大弹匣 |
| 70 | Bolt Volley | 箭矢齐射 | 万箭齐发 |
| 71 | Bullet Helix | 螺旋弹道 | 子弹漩涡 |
| 72 | Centralized Reflector | 集束反射器 | 中心反射 |
| 73 | Colossal Twinblade | 巨型双刃斧 | 巨型双头斧 |
| 74 | Conduit | 导电管道 | 电流疏导 |
| 75 | Death Spiral | 死亡螺旋 | 死亡回旋 |
| 76 | Disposable Tech | 一次性技术 | 即弃即炸 |
| 77 | Double Barrel! | 双管齐下！ | 双重枪管 |
| 78 | Drippin Balls | 滴落火球 | 热得流油 |
| 79 | Electrical Tether | 电弧连接 | 电流缰绳 |
| 80 | Electrified Dispenser | 通电散布器 | 电力分流 |
| 81 | EM Discharge | 电磁放电 | 电磁爆炸 |
| 82 | Even More Beams | 更多更多光束 | 超多射线 |
| 83 | Experimental Cluster Projectiles | 实验性集束弹 | 电浆离散 |
| 84 | Extra Capacity | 额外容量 | 额外警戒 |
| 85 | Extra Rocket Drum | 额外火箭弹鼓 | 额外弹鼓 |
| 86 | Fan of Axes | 扇形飞斧 | 英勇扇战 |
| 87 | Feedback Harness | 反馈背带 | 触发背带 |
| 88 | Fuel Leak | 燃料泄漏 | 油料泄露 |
| 89 | Hallucinogenic | 致幻剂 | 致幻药物 |
| 90 | Hot Plasma | 高温等离子体 | 灼热电浆 |
| 91 | Ionized Plasma | 电离等离子体 | 电离电浆 |
| 92 | Krakatoa Protocol | 喀拉喀托协议 | 喷发协议 |
| 93 | Lead Wrapped Ammo | 铅包弹药 | 镀铅弹药 |
| 94 | Mini Pellets | 微型弹丸 | 迷你弹丸 |
| 95 | MK 11 | MK 11 | 型号 11 |
| 96 | More Bounce! | 更多弹跳！ | 好事多弹 |
| 97 | Network Mines | 网络地雷 | 地雷链络 |
| 98 | Omni Barrel | 全能枪管 | 威震八方 |
| 99 | One-Handed | 单手操作 | 单手技巧 |
| 100 | Overcharged Fuelcells | 过载燃料棒 | 燃料过充 |
| 101 | Payload | 爆破载荷 | 电磁负荷 |
| 102 | Sawn-Off | 截断枪管 | 枪管截短 |
| 103 | Six Shooter | 六发左轮 | 枪射六路 |
| 104 | Spliced Emitter | 拼接发射器 | 复合发射口 |
| 105 | Sticky Fuel | 黏性燃料 | 黏性燃油 |
| 106 | Storm E-Mag | 风暴电磁弹匣 | 暴风退匣 |
| 107 | Super Reload Shield | 超级换弹护盾 | 强效换弹庇护 |
| 108 | Widened Sprinkler | 加宽喷头 | 拓宽喷口 |

**共 108 条需改。**

### 3.2 已一致（无需改，17 条）

`Cluster Grenades` 、 `Diffractor Prism` 、 `Gas Rerouting` 、 `Magnetic Alloy` 、 `More Drones` 、 `More Mines` 、 `Sidearm` 、 `Tank Tracks` 、 `Vortex Core` 、 `Cataclysm Core` 、 `Crisis Protocol` 、 `Gravitational Core` 、 `LMG Overload` 、 `More Drones` 、 `Rapid Deployment` 、 `Superconductor` 、 `The Favourite`

### 3.3 无 json 对应（需你确认） 已经确认就用

| englishName | 当前中文 | json 中文 |
|---|---|---|
| Runic Warhead | 符文弹头 | 附魔导弹 |

---
**下一步**：你核对以上三类清单，回复「OK 动手」或指出要调整的项，我再改 `baseline.json`（按你之前的固化/overrides 流程）。