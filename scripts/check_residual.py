#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""核查 achievements.ts 的 chineseName/unlockCondition 字段中是否仍有 A-Za-z 字母
（排除主理人保留的“英文指南旧名/旧称”括号注释）。"""
import re

SRC = r"F:\workbuddy工作空间\drg-survivor-helper\src\data\achievements.ts"

field_re = re.compile(
    r'^\s*(?:chineseName|unlockCondition):\s*("(?:\\.|[^"\\])*")'
)
preserve_re = re.compile(r"（英文指南旧[名称][^）]*）")


def main() -> None:
    rows = []
    with open(SRC, encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            m = field_re.match(line.rstrip("\n"))
            if not m:
                continue
            v = m.group(1)[1:-1]  # strip quotes
            stripped = preserve_re.sub("", v)
            letters = re.findall(r"[A-Za-z]", stripped)
            if letters:
                rows.append((i, v, "".join(sorted(set(letters)))))

    print("残留英文行数:", len(rows))
    for i, v, ls in rows:
        print(f"L{i} [{ls}] {v}")


if __name__ == "__main__":
    main()
