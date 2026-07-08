#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DRG Survivor 成就数据 i18n 清洗脚本（一次性增量）。

仅改写 achievements.ts 中 chineseName / unlockCondition / category 三个字段的
字符串值；绝不改动 englishName 及其它字段。

替换顺序（长串/多词优先，防部分匹配）：
  a. 武器全名 + 简写别名
  b. 职业 / 小职业
  c. 生物群系
  d. 生物
  e. 方括号标签 [TAG] -> [中文]（正则，含旧写法 ELECTRICAL）
  f. 系统术语
  g. 术语统一：精通->专精；潜水->深潜；B0b-33/lootbug 已在 d 处理
  h. 后处理清理（重复译法）
  i. category 字段的 武器精通/武器真精通 已由 g 的 精通->专精 覆盖
"""
import re
import sys

SRC = r"F:\workbuddy工作空间\drg-survivor-helper\src\data\achievements.ts"

# ---------- a. 武器全名 + 简写别名（长串优先）----------
WEAPON_MAP = [
    ("DeepCore GK2", "GK2 步枪"),
    ("DRAK-25 Plasma Carbine", "电浆卡宾枪"),
    ("Nishanka Boltshark", "战术弩"),
    ("Cryo Grenade", "冰冻手雷"),
    ("Arc-Tek Cryo Guard", "冰冻无人机"),
    ("Jury-Rigged Boomstick", "双管霰弹枪"),
    ("Voltaic Stun Sweeper", "雷神手枪"),
    ("TH-0R Bug Taser", "雷电回旋镖"),
    ("Zhukov NUK17", "朱可夫 SMG"),
    ("Thunderhead Heavy Autocannon", "双管机炮"),
    ("Seismic Repulsor", "地震炮/地震哨戒炮"),
    ("Tactical Leadburster", "战术铅爆雷"),
    ("Lead Storm Powered Minigun", "铅爆机枪"),
    ("Bulldog Heavy Revolver", "斗牛犬手枪"),
    ("ArmsKore Coil Gun", "电磁手炮"),
    ("Hurricane Guided Rocket System", "火箭弹"),
    ("Hurricane", "火箭弹"),
    ("BRT7 Burst Fire Gun", "BRT7 步枪"),
    ("Firefly Hunter Drone", "火焰无人机"),
    ("Incendiary Grenade", "燃烧手雷"),
    ("Warthog Auto 210", "210 霰弹枪"),
    ("Shard Diffractor", "激光笔"),
    ("Plasma Burster", "电浆手雷"),
    ("Breach Cutter / ArmsKore Coil Gun", "等离子切割器"),
    ("Breach Cutter", "等离子切割器"),
    ("LMG Gun Platform", "机枪哨戒炮"),
    ("Krakatoa Sentinel", "火焰哨戒炮"),
    ("Voltaic Shock Fence", "电网"),
    ("DeepCore PGL", "PGL 榴弹发射器"),
    ("Hi-Volt Thunderbird", "雷电无人机"),
    ("LOK-1 Smart Rifle", "智能步枪"),
    ("Shredder Swarm Grenade", "群蜂手雷"),
    ("Stubby Voltaic SMG", "百万伏特冲锋枪"),
    ("Colette Wave Cooker", "微波枪"),
    ("Corrosive Sludge Pump", "污泥泵"),
    ("Cryo Cannon", "急冻加农炮"),
    ("Impact Axe", "冲击斧"),
    ("K1-P Viper Drone", "毒液无人机"),
    ("CRSPR Flamethrower", "火焰喷射器"),
    ("Subata 120", "苏巴塔120"),
    ("Experimental Plasma Charger", "等离子手枪"),
    ("High Explosive Grenade", "高爆手榴弹"),
    ("Neurotoxin Grenade", "酸液手雷"),
]
# 短名含自身结果子串（M1000 ⊂ “M1000 狙击枪”）需用负向先行断言防二次拼接
ALIAS_RE = [
    (r"GK2(?! 步枪)", "GK2 步枪"),
    (r"BRT7(?! 步枪)", "BRT7 步枪"),
    (r"朱可夫(?! SMG)", "朱可夫 SMG"),
    (r"M1000(?! 狙击枪)", "M1000 狙击枪"),
]

# ---------- b. 职业 / 小职业（长串优先）----------
CLASS_MAP = [
    ("Weapons Specialist", "武器专家"),
    ("Maintenance Worker", "维修工"),
    ("Heavy Gunner", "重机枪手"),
    ("Sharp Shooter", "神射手"),
    ("Sharpshooter", "神射手"),
    ("Demolitionist", "爆破手"),
    ("Interrogator", "审讯者"),
    ("Tinkerer", "工匠"),
    ("Strong Armed", "强臂"),
    ("Juggernaut", "重装兵"),
    ("Classic", "经典"),
    ("Recon", "侦察"),
    ("Foreman", "工头"),
    ("Engineer", "工程师"),
    ("Scout", "侦察兵"),
    ("Gunner", "机枪手"),
    ("Driller", "钻机手"),
]

# ---------- c. 生物群系 ----------
BIOME_MAP = [
    ("Crystalline Caverns", "水晶洞穴"),
    ("Magma Core", "岩浆核心"),
    ("Hollow Bough", "空洞枝桠"),
    ("Salt Pits", "盐坑"),
    ("Azure Weald", "蔚蓝荒野"),
]

# ---------- d. 生物 ----------
CREATURE_MAP = [
    ("lootbugs", "掠夺虫"),
    ("lootbug", "掠夺虫"),
    ("Huuli Hoarders", "胡利囤积者"),
    ("B0b-33", "小鲍勃33号"),
]

# ---------- e. 方括号标签 ----------
TAG_MAP = {
    "KINETIC": "动能", "FIRE": "火焰", "ELECTRIC": "电击", "COLD": "冰冻",
    "ACID": "腐蚀", "PLASMA": "等离子",
    "LIGHT": "轻型", "MEDIUM": "中型", "HEAVY": "重型", "THROWABLE": "投掷",
    "CONSTRUCT": "建造",
    "PROJECTILE": "弹道", "EXPLOSIVE": "爆炸", "DRONE": "无人机",
    "TURRET": "炮塔", "GROUNDZONE": "地面区域",
    "PRECISE": "精准", "SPRAY": "散射", "AREA": "范围", "BEAM": "光束",
    "LASTING": "持续",
    "ELECTRICAL": "电击",
}

# ---------- f. 系统术语（长串优先）----------
SYSTEM_MAP = [
    ("The Favourite", "最爱"),
    ("Tank Tracks", "坦克履带"),
    ("Overclock", "超频"),
    ("Sidearm", "副武器"),
    ("Vanguard", "先锋"),
    ("Anomaly", "异常"),
    ("Lethal", "致命"),
    ("Nitra", "硝化铁"),
    ("Hazard", "危险等级"),
]

# ---------- h. 后处理清理 ----------
POST_MAP = [
    ("致命 致命行动", "致命行动"),
    ("致命 致命", "致命"),
    ("胡利囤积者（胡利囤积者）", "胡利囤积者"),
]


def transform(s: str) -> str:
    # a
    for k, v in WEAPON_MAP:
        s = s.replace(k, v)
    for pat, v in ALIAS_RE:
        s = re.sub(pat, v, s)
    # b
    for k, v in CLASS_MAP:
        s = s.replace(k, v)
    # c
    for k, v in BIOME_MAP:
        s = s.replace(k, v)
    # d
    for k, v in CREATURE_MAP:
        s = s.replace(k, v)
    # e
    s = re.sub(
        r"\[(" + "|".join(TAG_MAP.keys()) + r")\]",
        lambda m: "[" + TAG_MAP[m.group(1)] + "]",
        s,
    )
    # f
    for k, v in SYSTEM_MAP:
        s = s.replace(k, v)
    s = re.sub(r"\bOC\b", "超频", s)
    # g 术语统一
    s = s.replace("精通", "专精")
    s = s.replace("潜水", "深潜")
    # h
    for k, v in POST_MAP:
        s = s.replace(k, v)
    return s


def main() -> int:
    with open(SRC, "r", encoding="utf-8") as f:
        lines = f.readlines()

    field_re = re.compile(
        r'^(\s*(?:chineseName|unlockCondition|category):\s*)'
        r'("(?:\\.|[^"\\])*")'
        r'(.*)$'
    )

    out = []
    changed = 0
    for line in lines:
        m = field_re.match(line.rstrip("\n"))
        if m:
            prefix, quoted, rest = m.group(1), m.group(2), m.group(3)
            inner = quoted[1:-1]
            new_inner = transform(inner)
            if new_inner != inner:
                changed += 1
                new_line = prefix + '"' + new_inner + '"' + rest
            else:
                new_line = prefix + quoted + rest
            out.append(new_line)
        else:
            out.append(line.rstrip("\n"))

    # 备份原文件
    with open(SRC + ".bak", "w", encoding="utf-8") as f:
        f.write("".join(lines))

    with open(SRC, "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")

    print(f"OK: 改写 {changed} 行（已备份至 achievements.ts.bak）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
