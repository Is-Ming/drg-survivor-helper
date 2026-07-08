#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DRG Survivor 成就数据 —— 第二轮「靶向」清洗（不重跑整脚本，避免二次拼接）。

仅对 achievements.ts 的 chineseName 与 unlockCondition 字段的字符串值做替换；
绝不改动 englishName，也不动“（英文指南旧名/旧称 …）”括号注释，以及
TrueAchievements / Q'ronar Shellback / meta（三项本次保留）。

替换顺序严格按主理人列表；第 2 条（Dreadnought（无畏舰）->无畏舰）必须在
第 3 条（Dreadnought->无畏舰）之前，以消除重复括号。
"""
import re

SRC = r"F:\workbuddy工作空间\drg-survivor-helper\src\data\achievements.ts"

# 仅命中 chineseName / unlockCondition 两字段；保留引号与尾部逗号
FIELD_RE = re.compile(
    r'^(\s*(?:chineseName|unlockCondition):\s*)'  # group1 前缀
    r'("(?:\\.|[^"\\])*")'                          # group2 整段引号字符串
    r'(.*)$'                                        # group3 余部（如 ,）
)

# 第二轮靶向替换（顺序即应用顺序）
ROUND2 = [
    ("Rock and Stone", "岩石与矿石"),
    ("Dreadnought（无畏舰）", "无畏舰"),   # 必须早于下一条
    ("Dreadnought", "无畏舰"),
    ("Twins", "双子"),
    ("NUK17", "朱可夫 SMG"),
    ("Scanner", "扫描器"),
    ("scanner", "扫描器"),
    ("Gold", "黄金"),
    ("XP", "经验"),
    ("boom", "轰"),
    ("BLT", "培根三明治"),
    ("uncommon", "普通"),
    ("rare", "稀有"),
    ("epic", "史诗"),
    ("legendary", "传说"),
    ("HP", "生命值"),
]


def transform(s: str) -> str:
    for k, v in ROUND2:
        s = s.replace(k, v)
    return s


def main() -> int:
    with open(SRC, encoding="utf-8") as f:
        lines = f.readlines()

    out = []
    changed = 0
    for line in lines:
        m = FIELD_RE.match(line.rstrip("\n"))
        if not m:
            out.append(line.rstrip("\n"))
            continue
        prefix, quoted, rest = m.group(1), m.group(2), m.group(3)
        inner = quoted[1:-1]
        new_inner = transform(inner)
        if new_inner != inner:
            changed += 1
            out.append(prefix + '"' + new_inner + '"' + rest)
        else:
            out.append(prefix + quoted + rest)

    with open(SRC, "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")

    print(f"OK: 第二轮改写 {changed} 行")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
