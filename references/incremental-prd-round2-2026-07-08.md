# 增量 PRD — 超频名字 / 装备双描述 / 难度筛选 / 流程改造（Round 2）

> 日期 2026-07-08。基于本地化 Round 1 已上线（<server-ip>）。本次为增量改动。
> 注：原定由 PM 许清楚产出，因平台限流(HTTP 429)失败，由主理人齐活林接管官方调研与 PRD 编写。数据均来自官方 Wiki，查不到的标「待核」，绝不杜撰。

## 1. 产品目标
- **R1 流程**：本地开发但不本地构建；代码提交 GitHub，服务器 `git pull` + `npm run build` 后服务 dist。
- **R2 成就**：新增 极难 / 难 / 普通 三档筛选（按 completionRate 分档）。
- **R3 武器**：超频展示**正式名字**（官方为共享超频池，带创意名称）。
- **R4 装备**：新增「职业进深潜前装备池」类别 → **本轮跳过**（官方数据不足，用户已确认搜不到可跳）。
- **R5 装备**：每张装备卡同时展示**官网描述**与**攻略描述**，明确区分。

## 2. 用户故事
- 作为玩家，我想按难度筛成就，快速定位极难/难挑战。
- 作为玩家，我想在武器页看到超频的正式名字，而不是一串效果数字。
- 作为玩家，我想在装备卡同时看到官网原意和攻略解读。

## 3. 需求池
### P0
- R2 成就难度三档筛选（completionRate 分档）。
- R3 武器超频名字（建官方超频池主表 + 武器引用）。
- R5 装备官网/攻略双描述。

### P1
- R1 部署流程改造（本地不构建，服务器 pull+build）。

### P2 / 跳过
- R4 第二类装备：官方无清晰「每职业 6–7 栏装备池」清单，本轮跳过。

## 4. UI 设计要点
- **R2**：成就页筛选栏新增「难度」分段控件（极难/难/普通，建议多选）。与现有 category / onlyDifficult / 排序 **AND** 联动。61 条 `completionRate=null` 成就：默认归入「普通」档参与筛选（待确认是否更想要「未知」单独处理）。
- **R3**：武器卡超频区改为展示超频**名字**列表（黄 Balanced / 红 Unstable 分组），名字可展开看效果；效果文本保留为细节。数据来自官方超频池主表。
- **R5**：装备卡分两区块：「官网」(officialEffect) 与「攻略」(effect)，用标签 + 配色明确区分（如蓝=官网、橙=攻略）。

## 5. 待确认问题
1. null 成就的难度归属（当前建议：归入「普通」）。
2. R3 精度：部分武器官方页 truncated，少量红超频未完整收录 → 标「待核」。
3. R4 跳过是否认可。

## 6. 数据调研附录（官方来源，已实际访问）

### 6.1 R3 超频名字
- 来源：`https://deeprockgalactic.wiki.gg/wiki/Survivor:Overclocks`
- **关键结论**：DRG Survivor 超频为**共享池**机制，带正式创意名字（如 `A Little More Oomph!`、`Bigger Mags`、`More Beams`、`Even More Beams`、`Spliced Emitter`、`Tank Tracks`、`Sidearm`、`The Favourite`、`Storm E-Mag`、`Akimbo`、`Double Barrel!`、`Sawn-Off`、`Six Shooter`、`MK 11`、`Feedback Harness`、`Hallucinogenic` 等）。Balanced=黄(武器 6/12 级)，Unstable=红(18 级)。
- **设计**：建 `src/data/overclocks.ts` 主表（字段建议：`name`, `type: 'balanced'|'unstable'`, `effect`, `weapons: string[]` 适用武器英文名）。武器引用该池。
- **每武器可用超频名（摘要，工程师实现依据）**：

| 武器(英文) | 黄/Balanced 可用名 | 红/Unstable 可用名 |
|---|---|---|
| M1000 Classic | A Little More Oomph! / Bigger Mags / Gas Rerouting / Pan Fried Shells / Rubber Tip | Sawn-Off |
| Deepcore GK2 | A Little More Oomph! / Battery Bullets / Big Game Hunter / High Caliber Rounds / Refrigerated Gunpowder | Lead Wrapped Ammo (+150% Damage) |
| DRAK-25 Plasma Carbine | A Little More Oomph! / Bigger Mags / Cold Plasma / Gas Rerouting / Hot Plasma | Sawn-Off / Storm E-Mag |
| Nishanka Boltshark X-80 | Cryo Bolt / Fire Bolt / Gas Rerouting / Rubber Tip | Bolt Volley / Payload / Storm E-Mag |
| Cryo Grenade | Cluster Grenades / Compact Explosives / True TNT / … | Gravitational Core / The Favourite |
| Arc-Tek Cryo Guard | Aggro Behaviour Chip / Disposable Tech / More Drones | Crisis Protocol / More Drones (+3) |
| Jury-Rigged Boomstick | Battery Bullets / Bigger Mags / High Velocity Bullets / Mini Pellets / Refrigerated Gunpowder | Mini Pellets (红版同名) / Double Barrel! |
| Voltaic Stun Sweeper | Kinda Looks Like a Magnet / Knuckle Grip / Lightweight Alloy / Potent Juice | Disposable Tech / One-Handed |
| TH-0R Bug Taser | A Little More Oomph! / Explosive Reload / More Beams / Sidearm | Even More Beams |
| Zhukov NUK17 | Battery Bullets / Bigger Mags / Explosive Reload / Gas Rerouting / Refrigerated Gunpowder | Death Spiral / Omni Barrel |
| Thunderhead Heavy Autocannon | A Little More Oomph! / Bigger Mags / Gas Rerouting / High Caliber Rounds / Rubber Tip | Storm E-Mag |
| Seismic Repulsor | Coolant Leak / Disposable Tech (+Reload) / Extra Capacity (+Dmg) / Tank Tracks | Extra Capacity (+3 Turrets) / Rapid Deployment |
| Tactical Leadburster | Cluster Grenades / Fire Bullets / Fusion Turbines / Piercing Projectiles | Lead Wrapped Ammo (+150% Damage) |
| Lead Storm Powered Minigun | Bigger Mags / Gas Rerouting / High Caliber Rounds / Pan Fried Shells / Reload Shield | Lead Wrapped Ammo (+150% Damage) |
| Bulldog Heavy Revolver | Bigger Mags / High Caliber Rounds / Pan Fried Shells / Reload Shield | Double Barrel! / Super Reload Shield |
| ArmsKore Coil Gun | A Little More Oomph! / Coilgun Mining Damage / Explosive Reload / More Beams | Even More Beams / Spliced Emitter (+75% Lifetime) |
| Hurricane Guided Rocket System | A Little More Oomph! / Incendiary Payload / Runic Warhead / Spare Rockets | Extra Rocket Drum |
| BRT7 Burst Fire Gun | Bigger Mags / Gas Rerouting / High Caliber Rounds / Pan Fried Shells / Sidearm | Bullet Helix / Omni Barrel |
| Firefly Hunter Drone | Defensive Behaviour Chip / Disposable Tech / Drone Mining Damage / More Drones | Fuel Leak / More Drones (+3) |
| Incendiary Grenade | Cluster Grenades / Compact Explosives / Tape Some Nails to It | Feedback Harness / Gravitational Core |
| Warthog Auto 210 | Battery Bullets / Gas Rerouting / High Velocity Bullets / Plasma Coating | Akimbo / Mini Pellets |
| Shard Diffractor | A Little More Oomph! / Cold Plasma / Hot Plasma / Ionized Plasma / More Beams / Overheat | Even More Beams / Overcharged Fuelcells |
| Plasma Burster | A Little More Oomph! / Cold Plasma / Ionized Plasma / Tape Some Nails to It | More Bounce! |
| Breach Cutter | A Little More Oomph! / Hot Plasma / Ionized Plasma / More Beams | Even More Beams / Experimental Cluster Projectiles |
| LMG Gun Platform | Battery Bullets / Extra Capacity (+Dmg) / Mining Directive / Plasma Coating | Extra Capacity (+4 Turrets) / LMG Overload |
| Krakatoa Sentinel | Extra Capacity (+Range) / Mining Directive / More Beams / Tank Tracks | Extra Capacity (+3 Turrets) / Krakatoa Protocol |
| Voltaic Shock Fence | Coolant Leak / Disposable Tech (+20% Reload) / Extra Capacity (-Range) / Magnetic Alloy | Conduit / Extra Capacity (+3 Turrets, -30% Range) / Rapid Deployment |
| Deepcore PGL | A Little More Oomph! / Cluster Grenades / Compact Explosives / Gas Rerouting | Bigger Mags (+100% Clip, +100% Fire Rate) |
| Hi-Volt Thunderbird | Aggro Behaviour Chip / Disposable Tech / Potent Juice | Conduit / Electrical Tether / More Drones (+3) |
| LOK-1 Smart Rifle | Battery Bullets / Bigger Mags / Gas Rerouting / High Caliber Rounds | Lead Wrapped Ammo (+150% Damage) |
| Shredder Swarm Grenade | Cluster Grenades / More Drones / Tape Some Ice to It! | Electrified Dispenser / More Drones (+3) |
| Stubby Voltaic SMG | Explosive Reload / Gas Rerouting / Potent Juice / Secret Sauce / Sidearm | EM Discharge / MK 11 / Storm E-Mag |
| Colette Wave Cooker | Better Ball Bearings / Crowd Cooker / Focused Lens / Nano Waves | Centralized Reflector |
| Corrosive Sludge Pump | A Little More Oomph! / Bigger Tanks / Impact Punch / More Beams | Even More Beams / Spliced Emitter |
| Cryo Cannon | Bigger Tanks / Frostburn / Impact Punch / More Beams | Even More Beams / Spliced Emitter |
| Impact Axe | Corrosive Coating / Diesel Soaked / Lightweight Alloy | Colossal Twinblade / Fan of Axes |
| K1-P Viper Drone | Defensive Behaviour Chip / Disposable Tech / More Drones / Potent Juice | Crisis Protocol / More Drones (+3) |
| CRSPR Flamethrower | A Little More Oomph! / Bigger Tanks / More Beams / Overheat | Even More Beams / Spliced Emitter / Sticky Fuel |
| Subata 120 | Acid Dipped Tips / Bigger Mags (+Piercing) / Gas Rerouting / Pan Fried Shells / Sidearm | Akimbo (+25% Fire/Potency) / Double Barrel! |
| Experimental Plasma Charger | Cold Plasma / Hot Plasma / Vortex Core | Drippin Balls / Experimental Cluster Projectiles |
| High Explosive Grenade | Cluster Grenades / Compact Explosives | Feedback Harness / Hallucinogenic |
| Neurotoxin Grenade | Cluster Grenades / Compact Explosives / Potent Juice / Tape Some Nails to It | Feedback Harness / Hallucinogenic |
| (Demolisher 系: Twincoil Arc Burster / Dragonstorm Incinerator / Chimera Fragcannon / Proximity Mines / Springloaded Ripper / E1M1 Caustic Scattergun / Carrier Drone / Slither Drones / Toxic Sludge Spreader / Voltaic Field Generator) | 参见官方页对应条目 | 参见官方页对应条目 |

- **待核**：官方页内容在少数武器（尤其末尾 Unstable 变体）有截断；Demolisher 职业部分武器需工程师按官方页补全。所有标「待核」项不杜撰，留空或标版本「待核」。

### 6.2 R5 装备官网描述
- 来源：`https://deeprockgalactic.wiki.gg/wiki/Survivor:Equipment`（Artifacts 表，38 种，官方名 + 官方 Effect）
- **关键结论**：运行内拾取装备官方称 **Artifacts**，各有官方名与官方 Effect。可映射到本App 20 件装备。
- **映射（攻略名 → 官方名 + 官方 Effect）**：

| 本App装备(攻略名) | 官方名 | 官方 Effect（英文，待译中） |
|---|---|---|
| 商店折扣券 | DRG Coupon | Gives a 20% discount to all shop purchases |
| 集团配发磁铁 | Company-issued Magnet | Spawns a magnet at end of stage that collects 50% of the XP |
| 红糖块 | Red Sugar Cube | Collecting Red Sugar increases your Max HP by 3 |
| 复古知识库 | Ancient Knowledge | Gain 3 Levels |
| 侧目目镜 / EE5 目镜 | Squint-EE5 | +30% Critical Chance, +100% Critical Damage, -30% Damage |
| P2W 控制器 | Pay2Win Console | Increases damage (+2.5%) whenever you reroll, stacks up to 100 |
| 涡轮解码器 | Turbo Encabulator | +3% Damage, +3% Reload Speed, -5% Mining Speed for every equipped Overclock |
| 椒盐卷饼 | Salty Pretzel | +1 Armor for every 2% of missing HP |
| 能量棒 | Energy Bars | +1% Damage, -3 Max HP for every player level |
| 腌制硝石 | Pickled Nitra | +2% Damage and -0.5% Move Speed for every Nitra you have |
| 反射调节仪 | Reflex Calibrator | +5% Armor; +5% Dodge for 10s when taking damage, stacks 5 |
| 武器补给箱 | Weapon Box | Equip an additional random level 6 weapon with a random overclock |
| 记仇名单 | Clipboard of Grudges | +10% XP Gain; Gain XP when you take damage |
| 挖矿概率得黄金/硝石/经验 | Gold Scanner / Nitra Scanner / XP Scanner | small chance to find Gold/Nitra/XP when mining rock |
| 护甲润滑油 | Armor Grease | +5% Move Speed; +2% Dodge while moving, stacks 5 |
| 硝基火药 | Nitragenic Powder | +0.5% Critical Chance for every Nitra, max 500 stacks |
| 嗜矿异虫召唤装备 | Huuli Bait | Lure out a bunch of Huuli Hoarders |
| 三明治 | （待核：官方无 exact "三明治"；Tactical Cookie 进舱回血 50% 可能对应） | Tactical Cookie: Heals 50% Max HP when entering Drop Pod |
| 狂人头盔 | （待核：官方无 exact；Reflex Calibrator 受击闪避 +5% 可能） | — |
| 挖他命 | （待核：官方无 exact；Vita-miner Pills 升级治疗提升可能） | Vita-miner Pills: +5% Max HP; increases healing on level up |

- **待核**：三明治 / 狂人头盔 / 挖他命 三项官方无一一对应 exact 名，标「待核」，不杜撰；官方 Effect 英文原文保留，UI 译中时再处理（或保留英文附注）。

### 6.3 R4 跳过说明
- 用户描述：「进深潜前的装备池，一般包括芯片、燃料等，每个职业都有 6–7 个装备栏」。
- 官方 Wiki 仅提及 `Gear`（局间元进度物品，定制 Class Mod，预潜水装备）与 Bosco 可装 Chip，未给出「每职业 6–7 栏装备池」的具体列表。
- 数据不足，按用户「搜不到可以跳过」，**本轮跳过 R4**。
