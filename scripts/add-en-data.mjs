import { readFileSync, writeFileSync } from 'fs'

// ======== 装备 English officialEffect 映射 ========
const equipEffectMap = {
  'DRG Coupon': 'Gives a 20% discount to all shop purchases.',
  'Company-issued Magnet': 'Spawns a magnet at the end of a stage that collects 50% of the XP.',
  'Red Sugar Cube': 'Collecting Red Sugar increases your Max HP by 3.',
  'Gold Scanner / Nitra Scanner / XP Scanner': 'Small chance to find Gold/Nitra/XP when mining rock.',
  'Clipboard of Grudges': '+10% XP Gain; Gain XP when you take damage.',
  'Weapon Box': 'Equip an additional random level 6 weapon with a random overclock.',
  'Ancient Knowledge': 'Gain 3 Levels.',
  'Squint-EE5': '+30% Critical Chance, +100% Critical Damage, -30% Damage.',
  'Pay2Win Console': '+2.5% damage whenever you reroll, stacks up to 100.',
  'Turbo Encabulator': '+3% Damage, +3% Reload Speed, -5% Mining Speed for every equipped Overclock.',
  'Salty Pretzel': '+1 Armor for every 2% of missing HP.',
  'Energy Bars': '+1% Damage, -3 Max HP for every player level.',
  'Pickled Nitra': '+2% Damage and -0.5% Move Speed for every Nitra you have.',
  'Reflex Calibrator': '+5% Armor; +5% Dodge for 10s when taking damage, stacks 5.',
  'Armor Grease': '+5% Move Speed; +2% Dodge while moving, stacks 5.',
  'Nitragenic Powder': '+0.5% Critical Chance for every Nitra, max 500 stacks.',
  'Huuli Bait': 'Lure out a bunch of Huuli Hoarders.',
  'Tactical Cookie': 'Heals 50% Max HP when entering the Drop Pod. (待核：官方无 exact 对应)',
  'Vita-miner Pills': '+5% Max HP; increases healing on level up. (待核：官方无 exact 对应)',
}

// ======== 成就 English unlockCondition 映射（TrueAchievements） ========
const achConditionMap = {
  'Run for the hills': 'Unlock the Scout',
  'Lock and load': 'Unlock the Gunner',
  'Enjoy a relaxing stroll': 'Unlock the Engineer',
  'Dig down deep': 'Unlock the Driller',
  'The journey begins': 'Complete a dive with the Classic',
  'Measure twice, shoot once': 'Complete a dive with the Sharpshooter',
  'Adventure awaits': 'Complete a dive with the Recon',
  '10,000 rounds per minute': 'Complete a dive with the Weapons Specialist',
  'Tough as nails': 'Complete a dive with the Juggernaut',
  'Ka-boom!': 'Complete a dive with the Heavy Gunner',
  'I solve problems': 'Complete a dive with the Maintenance Worker',
  'Brainstorming': 'Complete a dive with the Tinkerer',
  'A whiff of brimstone': 'Complete a dive with the Demolitionist',
  'Diggy diggy hole': 'Complete a dive with the Foreman',
  'Chemical burns': 'Complete a dive with the Interrogator',
  'And my axe': 'Complete a dive with the Strong Armed',
  'Squint and squeeze the trigger': 'Reach 75% crit chance',
  'Delicious BLT': 'Reach 300 Max HP',
  "It's got electrolytes": 'Reach 50% move speed',
  'Swift guns for swift hands': 'Reach 75% reload speed',
  'Get that Midas touch': 'Collect 250 Gold in a single dive',
  'Sprinkle of Nitra': 'Collect 2,000 Nitra',
  'A freeze is coming': 'Deal 250,000 Cryo damage',
  'Hot, hot, hot!': 'Deal 250,000 Fire damage',
  'Slick, like butter': 'Dodge 100 times during a run',
  'Pillar of society': 'Kill 15,000 enemies while standing still',
  'Big spender': 'Spend 20,000 Gold',
  'No pain, no gain': 'Took 2,000 damage during a dive',
  'Gotta stay Nitrated': 'Collect 250 Nitra',
  'Relish the pain': 'Deal over 1337 damage in one attack',
  'Au-fully rich': 'Collect 2,000 Gold',
  'Close call': 'Kill the dreadnaught while you have less than 30 HP',
  'Hoxxes Manual': 'Die 3 times',
  'Why so Salty?': 'Reach 50 armor',
  'Book of Experience': 'Reach level 50 during a dive',
  'Corporate Discount': 'Spend 2,500 Gold',
  'Pro side wobble compensator': 'Equip 10 Overclocks in a single dive',
  'Hangry?': 'Gain 1,000 level ups',
  "Count em!": 'Fire 150,000 projectiles in a single dive',
  'Multitool': 'Do damage with 5 types in one dive',
  "What's in the box!?": 'Gain 10 weapon mastery levels',
  'Works 100% of the time': 'Collect 25 magnets',
  'Freezing hot acid': 'Deal 2,500,000 Status Effect Damage in a single dive',
  'Grow fat from strength': 'Have 1000 max HP as the Classic Scout',
  'BOOM! Headshot': 'Have +250% Crit Chance with the Sharpshooter in a single dive',
  "You're locked in here with me": 'Survive in 1 stage for 10 minutes as the Recon',
  'Lord of war': 'Fire 250,000 bullets as the Weapons Specialist in a single dive',
  'Know no fear': 'Have 300 armor as the Juggernaut',
  'Walk without rhythm': 'Deploy 30 seismic repulsor turrets at the same time with the Heavy Gunner',
  'Unreasonable uptime': 'Have a 60 second lifetime on one weapon with the Maintenance Worker',
  'Fully overclocked': 'Get 5 weapons to level 18 as the Tinkerer',
  'Going nuclear': 'Have +250% explosion radius as the Demolitionist',
  'With fire and blood': 'Deal 10,000,000 fire damage as the Foreman in a single dive',
  'Elemental avatar': 'Apply 5,000,000 status effect stacks as the Interrogator in a single dive',
  'Fastest hands on the rig': 'Have +500% reload speed as the Strong Armed',
  'Feeling a bit sour': 'Complete a dive with 3 [ACID] weapons equipped',
  'Zone of control': 'Complete a dive with 3 [AREA] weapons equipped',
  'Cross the beams': 'Complete a dive with 4 [BEAM] weapons equipped',
  'Dwarven architecture': 'Complete a dive with 4 [CONSTRUCT] weapons equipped',
  'Deep freeze': 'Complete a dive with 4 [COLD] weapons equipped',
  'Modern warfare': 'Complete a dive with 3 [DRONE] weapons equipped',
  'Stormbringer': 'Complete a dive with 4 [ELECTRICAL] weapons equipped',
  'Bomberman': 'Complete a dive with 4 [EXPLOSIVE] weapons equipped',
  'Keeper of the flame': 'Complete a dive with 4 [FIRE] weapons equipped',
  'Who touched my gun!?': 'Complete a dive with 4 [HEAVY] weapons equipped',
  'Blunt force trauma': 'Complete a dive with 4 [KINETIC] weapons equipped',
  'Delayed gratification': 'Complete a dive with 4 [LASTING] weapons equipped',
  'Fleet of foot': 'Complete a dive with 4 [LIGHT] weapons equipped',
  'Tried and tested': 'Complete a dive with 4 [MEDIUM] weapons equipped',
  'Light show': 'Complete a dive with 4 [PLASMA] weapons equipped',
  'Professionals have standards': 'Complete a dive with 4 [PRECISE] weapons equipped',
  'Weight of fire': 'Complete a dive with 4 [PROJECTILE] weapons equipped',
  "Spray 'n pray": 'Complete a dive with 4 [SPRAY] weapons equipped',
  "It's all in the wrist": 'Complete a dive with 4 [THROWABLE] weapons equipped',
  "Sentry goin' up": 'Complete a dive with 4 [TURRET] weapons equipped',
  'Just like the old days': 'Complete a Hazard 5 dive without any gear equipped',
  'Mind over matter': 'Complete a Hazard 4 dive without any gear equipped',
  'Legendary!': 'Equip a legendary item',
  'Truly epic': 'Equip an epic item',
  'Fabled fittings': 'Have 6 legendary items equipped',
  'Expertly tuned': 'Have 6 epic items equipped',
  'Professional setup': 'Have 6 rare items equipped',
  'Custom rig': 'Have 6 uncommon items equipped',
  "We're keeping this one": 'Fully upgrade a piece of gear',
  'Master artificer': 'Fully upgrade a legendary piece of gear',
  'Karl, is that you?': 'Have 6 fully upgraded legendary pieces of gear equipped',
  'Employee of the Week': 'Complete a lethal operation dive',
  'Employee of the Month': 'Complete 5 lethal operation dives',
  'Employee of the Year': 'Complete 10 lethal operation dives',
  'They belong in a museum': 'Complete a dive without any artifacts',
  "I ain't buying it": 'Complete a dive without buying anything in the shop at Hazard 3',
  'Extreme indecision': 'Perform 50 rerolls during a single dive',
  'Underclocked': 'Complete a dive without any overclocks',
  'The dwarf with the golden bug': 'Kill a golden lootbug',
  'Still only counts as one!': "Kill the Dreadnought without taking any damage",
  'Denied': 'Kill the Dreadnought Twins before they can heal',
  'Bullseye': "Kill a Q'ronar Shellback with the Supply Pod",
  'This hurts me more': 'Kill all the lootbugs in a single dive',
  'Perfect run': 'Complete a dive without taking any damage',
  'Cheapskate': 'Complete a dive without spending any gold or nitra',
  'Underpromise, overdeliver': 'Complete a dive with all of your weapons at level 1',
  'Eye of the storm': 'Complete a dive with unstable overclocks on both the NUK17 and the BRT7',
  'Roadkill': 'Drill through a lootbug with B0b-33',
  'Fully armed and operational': 'Purchase every single meta upgrade',
  'Early access': 'Enter the drop pod with more than 30 seconds remaining',
  'Salvage operation': 'Salvage 10 overclocks in a single dive',
  'They fly now?': 'Bounce 100 times in one stage',
  "They see 'em rollin', they hatin'": "Have 3 'Tank Tracks' overclocks in a single dive",
  'Tower defense': 'Have 50 turrets alive at the same time',
  'Perfectly balanced': 'Complete a dive with 4 (or more) of your weapons at the same level',
  'Deep scan': 'Have 5 scanner artifacts in a single dive',
  'All sides': "Have 3 'Sidearm' overclocks in a single dive",
  'Back from the brink!': 'Reach max HP after having dropped below 5 HP',
  'Survivor squad': 'Reach level 30 with all 4 classes',
  'This is brilliant, but I like this': "Have 2 'The Favourite' overclocks in a single dive",
  "Fill 'er up": 'Fully fuel B0b-33',
  'Drill baby, drill': 'Collect all the oil shale on one stage, then complete the dive',
  'The only drilldozer here is me': "Mine an entire stage before moving B0b-33, then complete the dive",
  'Mission Possible': 'Land on the drop pod ramp 3 times using jet boots',
  'Now, where did I put my keys?': 'Have the alien threat reach level 2 before moving B0b-33, then complete the dive',
  'Rock and Stone!': 'Remember to Rock and Stone!',
  // Biome wins
  'Crystalline Caverns': 'Win a Crystalline Caverns Hazard 5 dive',
  'Hollow Bough': 'Win a Hollow Bough Hazard 5 dive',
  'Magma Core': 'Win a Magma Core Hazard 5 dive',
  'Salt Pits': 'Win a Salt Pits Hazard 5 dive',
  'Azure Weald': 'Win an Azure Weald Hazard 5 dive',
  'Got bait?': 'Kill 3 Huuli Hoarders in one dive',
  'Feeling lucky punk?': 'Get 5 luck upgrades in one dive',
  'Jetty boots': 'Land on 200 blocks in one dive',
  "That's how the cookie crumbles": 'Heal 500 HP during one dive',
  'Axe in face!': 'Destroy all rocks in one main mission stage',
  // Endurance
  'Endurance: Dives I': 'Complete 5 dives',
  'Endurance: Dives II': 'Complete 25 dives',
  'Endurance: Dives III': 'Complete 50 dives',
  'Endurance: Dives IV': 'Complete 75 dives',
  'Endurance: Dives V': 'Complete 100 dives',
  'Endurance: Kills I': 'Kill 50,000 enemies',
  'Endurance: Kills II': 'Kill 100,000 enemies',
  'Endurance: Kills III': 'Kill 250,000 enemies',
  'Endurance: Kills IV': 'Kill 500,000 enemies',
  'Endurance: Kills V': 'Kill 1,000,000 enemies',
  'Endurance: Damage I': 'Deal 100,000,000 damage',
  'Endurance: Damage II': 'Deal 250,000,000 damage',
  'Endurance: Damage III': 'Deal 500,000,000 damage',
  'Endurance: Damage IV': 'Deal 1,000,000,000 damage',
  'Endurance: Damage V': 'Deal 2,000,000,000 damage',
  'Endurance: Mine I': 'Mine 15,000 blocks',
  'Endurance: Mine II': 'Mine 50,000 blocks',
  'Endurance: Mine III': 'Mine 100,000 blocks',
  'Endurance: Mine IV': 'Mine 150,000 blocks',
  'Endurance: Mine V': 'Mine 250,000 blocks',
  'Endurance: Run I': 'Run 10,000 steps',
  'Endurance: Run II': 'Run 50,000 steps',
  'Endurance: Run III': 'Run 100,000 steps',
  'Endurance: Run IV': 'Run 250,000 steps',
  'Endurance: Run V': 'Run 500,000 steps',
  // Biome Mastery (data format uses dash)
  'Mastery - Crystalline Caverns': 'Complete a Crystalline Caverns mastery dive',
  'Mastery - Magma Core': 'Complete a Magma Core mastery dive',
  'Mastery - Hollow Bough': 'Complete a Hollow Bough mastery dive',
  'Mastery - Salt Pits': 'Complete a Salt Pits mastery dive',
  'Mastery - Azure Weald': 'Complete an Azure Weald mastery dive',
  'True Mastery - Crystalline Caverns': 'Complete a Crystalline Caverns mastery dive at Hazard 5',
  'True Mastery - Magma Core': 'Complete a Magma Core mastery dive at Hazard 5',
  'True Mastery - Hollow Bough': 'Complete a Hollow Bough mastery dive at Hazard 5',
  'True Mastery - Salt Pits': 'Complete a Salt Pits mastery dive at Hazard 5',
  'True Mastery - Azure Weald': 'Complete an Azure Weald mastery dive at Hazard 5',
  'Anomaly - Hazard 1': 'Complete an anomaly dive at Hazard 1',
  'Anomaly - Hazard 2': 'Complete an anomaly dive at Hazard 2',
  'Anomaly - Hazard 3': 'Complete an anomaly dive at Hazard 3',
  'Anomaly - Hazard 4': 'Complete an anomaly dive at Hazard 4',
  'Anomaly - Hazard 5': 'Complete an anomaly dive at Hazard 5',
  'Vanguard - Hazard 3': 'Complete a vanguard contract dive at Hazard 3',
  'Vanguard - Hazard 4': 'Complete a vanguard contract dive at Hazard 4',
  'Vanguard - Hazard 5': 'Complete a vanguard contract dive at Hazard 5',
}

// ======== Weapon Overclock achievements (42 weapons * 3 = 126) ========
// Overclock achievements pattern: "Overclock: {WeaponName}" → "Reach level 18 with the {Weapon}"
// Mastery pattern: "Mastery: {WeaponName}" → "Complete a {Weapon} weapon mastery dive"
// True Mastery: "True Mastery: {WeaponName}" → "Complete a {Weapon} weapon mastery dive at Hazard 5"

// These follow predictable patterns so we generate them
const weaponMap = {
  'DeepCore GK2': 'the DeepCore GK2',
  'Zhukov NUK17': 'the Zhukov NUK17',
  'Cryo Grenade': 'the Cryo Grenade',
  'Jury-Rigged Boomstick': 'the Jury-Rigged Boomstick',
  'M1000': 'the M1000',
  'Stun Sweeper': 'the Voltaic Stun Sweeper',
  'TH-0R Bug Taser': 'the TH-0R Bug Taser',
  'Cryo Guard': 'the Arc-Tek Cryo Guard',
  'Plasma Carbine': 'the DRAK-25 Plasma Carbine',
  'Nishanka Boltshark': 'the Nishanka Boltshark',
  'Heavy Revolver': 'the Bulldog Heavy Revolver',
  'Incendiary Grenade': 'the Incendiary Grenade',
  'Powered Minigun': 'the Lead Storm Powered Minigun',
  'Burst Fire Gun': 'the BRT7 Burst Fire Gun',
  'Tactical Leadburster': 'the Tactical Leadburster',
  'Heavy Autocannon': 'the Thunderhead Heavy Autocannon',
  'Firefly Hunter Drone': 'the Firefly Hunter Drone',
  'Hurricane': 'the Hurricane Guided Rocket System',
  'Seismic Repulsor': 'the Seismic Repulsor',
  'Coil Gun': 'the ArmsKore Coil Gun',
  'Warthog Auto': 'the Warthog Auto 210',
  'Voltaic SMG': 'the Stubby Voltaic SMG',
  'Hi-Volt Thunderbird': 'the Hi-Volt Thunderbird',
  'LMG Gun Platform': 'the LMG Gun Platform',
  'Voltaic Shock Fence': 'the Voltaic Shock Fence',
  'LOK-1 Smart Rifle': 'the LOK-1 Smart Rifle',
  'DeepCore PGL': 'the DeepCore PGL',
  'Breach Cutter': 'the Breach Cutter',
  'Shard Diffractor': 'the Shard Diffractor',
  'Plasma Burster': 'the Plasma Burster',
  'Swarm Grenade': 'the Shredder Swarm Grenade',
  'Subata 120': 'the Subata 120',
  'Krakatoa Sentinel': 'the Krakatoa Sentinel',
  'HE Grenade': 'the High Explosive Grenade',
  'CRSPR Flamethrower': 'the CRSPR Flamethrower',
  'Sludge Pump': 'the Corrosive Sludge Pump',
  'Wave Cooker': 'the Colette Wave Cooker',
  'Impact Axe': 'the Impact Axe',
  'Neurotoxin Grenade': 'the Neurotoxin Grenade',
  'Cryo Cannon': 'the Cryo Cannon',
  'K1-P Viper Drone': 'the K1-P Viper Drone',
  'Plasma Charger': 'the Experimental Plasma Charger',
}

// Generate weapon achievements
for (const [weapon, article] of Object.entries(weaponMap)) {
  achConditionMap[`Overclock: ${weapon}`] = `Reach level 18 with ${article}`
  achConditionMap[`Mastery: ${weapon}`] = `Complete a${weapon.startsWith('Experimental') ? 'n' : ''} ${article.replace('the ', '')} weapon mastery dive`
  achConditionMap[`True Mastery: ${weapon}`] = `Complete a${weapon.startsWith('Experimental') ? 'n' : ''} ${article.replace('the ', '')} weapon mastery dive at Hazard 5`
}

// Fix specific overrides for proper English
achConditionMap['Mastery: Cryo Grenade'] = 'Complete a Cryo Grenade weapon mastery dive'
achConditionMap['Mastery: Jury-Rigged Boomstick'] = 'Complete a Jury-Rigged Boomstick weapon mastery dive'
achConditionMap['Mastery: Impact Axe'] = 'Complete an Impact Axe weapon mastery dive'
achConditionMap['Mastery: Swarm Grenade'] = 'Complete a Shredder Swarm Grenade weapon mastery dive'
achConditionMap['Mastery: HE Grenade'] = 'Complete a High Explosive Grenade weapon mastery dive'
achConditionMap['Mastery: Neurotoxin Grenade'] = 'Complete a Neurotoxin Grenade weapon mastery dive'
achConditionMap['Mastery: Cryo Cannon'] = 'Complete a Cryo Cannon weapon mastery dive'
achConditionMap['Mastery: M1000'] = 'Complete a M1000 weapon mastery dive'
achConditionMap['Mastery: Hurricane'] = 'Complete a Hurricane Guided Rocket System weapon mastery dive'

// True mastery overrides
const trueMasteryWeapons = ['Cryo Grenade', 'Jury-Rigged Boomstick', 'Impact Axe', 'Swarm Grenade', 'HE Grenade', 'Neurotoxin Grenade', 'Cryo Cannon', 'M1000']
for (const w of trueMasteryWeapons) {
  achConditionMap[`True Mastery: ${w}`] = achConditionMap[`Mastery: ${w}`]?.replace('weapon mastery dive', 'weapon mastery dive at Hazard 5') ?? ''
}

console.log(`Generated ${Object.keys(achConditionMap).length} achievement mappings`)

// ======== Process equipment.ts ========
let equipContent = readFileSync('src/data/equipments.ts', 'utf8')

// Replace officialEffect for each known equipment
for (const [officialName, enEffect] of Object.entries(equipEffectMap)) {
  // Find the equipment entry with this officialName and replace its officialEffect
  const regex = new RegExp(
    `(officialName:\\s*"${escapeRegex(officialName)}"[^}]*?officialEffect:\\s*)"[^"]*"`,
    'g'
  )
  equipContent = equipContent.replace(regex, `$1"${enEffect}"`)
}

writeFileSync('src/data/equipments.ts', equipContent)
console.log('Equipment file updated')

// Update comment
equipContent = equipContent.replace(
  '// 官网效果已译为中文（2026-07-09 用户要求）。',
  '// 官网效果保持英文原文（来自官方 Wiki Survivor:Equipment Artifacts 表）。'
)
writeFileSync('src/data/equipments.ts', equipContent)

// ======== Process achievements.ts ========
let achContent = readFileSync('src/data/achievements.ts', 'utf8')

// For each achievement entry, add enUnlockCondition after unlockCondition
for (const [engName, enCondition] of Object.entries(achConditionMap)) {
  // Find the exact unlockCondition line for this achievement
  // Pattern: after "englishName: "xxx"", find "unlockCondition: "..." line
  const escapedName = escapeRegex(engName)
  // Match: englishName: "xxx", ... unlockCondition: "yyy",
  const regex = new RegExp(
    `(englishName:\\s*"${escapedName}"[^;]*?unlockCondition:\\s*"[^"]*")`,
    'g'
  )
  if (regex.test(achContent)) {
    regex.lastIndex = 0
    achContent = achContent.replace(
      regex,
      `$1,\n    enUnlockCondition: "${enCondition}"`
    )
  } else {
    // Try fuzzy match (some names might have slight differences)
    console.log(`WARNING: Could not find achievement: "${engName}"`)
  }
}

writeFileSync('src/data/achievements.ts', achContent)
console.log('Achievement file updated')

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

console.log('Done!')
