#!/usr/bin/env python3
"""
合成完整超频图标。

输入（已放在 public/overclock-icons/）：
  - 48 个缺失特性图标 + 41 个已有特性图标（共 87 个 Survivor_Icon_* 效果层）
  - background-balanced.png / background-unstable.png（类型背景框）

依赖数据：
  - src/data/icon-map.ts 里的 OVERCLOCK_ICON_MAP（超频英文名 -> 效果图标路径）
  - server/data/baseline.json 里的 oc.type（balanced / unstable）

输出：
  - public/overclock-icons/ 下 135 张完整超频图标（背景框 + 效果图标）
  - src/data/icon-map.ts 的 OVERCLOCK_ICON_MAP 更新为每个超频指向自己的合成图

用法：
  1. 先运行 node scripts/ingest/regen-overclock-icon-map.mjs 确保 OVERCLOCK_ICON_MAP 覆盖 135 个超频
  2. 然后运行：
       C:/Users/zhuym/.workbuddy/binaries/python/envs/drg-img/Scripts/python scripts/ingest/composite-overclock-icons.py
"""

import json
import os
import re
import shutil
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError as e:
    print("错误：需要 Pillow。请运行：")
    print(r"  C:\Users\zhuym\.workbuddy\binaries\python\envs\drg-img\Scripts\pip install Pillow")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent.parent
ICONS_DIR = ROOT / "public" / "overclock-icons"
SOURCE_DIR = ROOT / "scripts" / "ingest" / "overclock-sources"
ICON_MAP_PATH = ROOT / "src" / "data" / "icon-map.ts"
BASELINE_PATH = ROOT / "server" / "data" / "baseline.json"
TMP_DIR = ROOT / "public" / "overclock-icons-tmp"

BACKGROUNDS = {
    "balanced": SOURCE_DIR / "background-balanced.png",
    "unstable": SOURCE_DIR / "background-unstable.png",
}


def kebab(s: str) -> str:
    """与 scripts/ingest/fetch-wiki-icons.mjs 的 kebab() 保持一致。"""
    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", s.lower()))


def parse_icon_map(content: str) -> dict[str, str]:
    """从 icon-map.ts 中解析 OVERCLOCK_ICON_MAP。"""
    m = re.search(
        r"export const OVERCLOCK_ICON_MAP\s*:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\n\}",
        content,
    )
    if not m:
        raise ValueError(f"在 {ICON_MAP_PATH} 中未找到 OVERCLOCK_ICON_MAP")
    result: dict[str, str] = {}
    for line in m.group(1).splitlines():
        line = line.strip().rstrip(",")
        if not line or line.startswith("//"):
            continue
        mm = re.match(r'"([^"]+)"\s*:\s*"([^"]+)"', line)
        if mm:
            result[mm.group(1)] = mm.group(2)
    return result


def load_backgrounds() -> dict[str, Image.Image]:
    imgs: dict[str, Image.Image] = {}
    for oc_type, path in BACKGROUNDS.items():
        if not path.exists():
            raise FileNotFoundError(
                f"缺少背景框：{path}\n"
                f"请把 background-balanced.png 和 background-unstable.png 放进 {ICONS_DIR}"
            )
        imgs[oc_type] = Image.open(path).convert("RGBA")
        print(f"背景框 {oc_type}: {imgs[oc_type].size}")
    return imgs


def composite_icon(background: Image.Image, effect: Image.Image) -> Image.Image:
    """以背景框原生尺寸为画布，把效果图标居中叠到背景中心（不缩放、不溢出）。"""
    canvas = background.copy()
    # 保护：若效果比画布大则等比缩小适配，避免溢出边界
    if effect.width > canvas.width or effect.height > canvas.height:
        scale = min(canvas.width / effect.width, canvas.height / effect.height)
        effect = effect.resize(
            (int(effect.width * scale), int(effect.height * scale)),
            Image.Resampling.LANCZOS,
        )
    x = (canvas.width - effect.width) // 2
    y = (canvas.height - effect.height) // 2
    canvas.paste(effect, (x, y), effect)
    return canvas


def main() -> int:
    if not ICON_MAP_PATH.exists():
        print(f"错误：找不到 {ICON_MAP_PATH}")
        return 1
    if not BASELINE_PATH.exists():
        print(f"错误：找不到 {BASELINE_PATH}")
        return 1

    # 1. 读取映射与基线
    icon_map_content = ICON_MAP_PATH.read_text(encoding="utf-8")
    icon_map = parse_icon_map(icon_map_content)
    baseline = json.loads(BASELINE_PATH.read_text(encoding="utf-8"))
    overclocks = baseline.get("overclocks", [])
    print(f"基线超频数：{len(overclocks)}")
    print(f"OVERCLOCK_ICON_MAP 条目数：{len(icon_map)}")

    if len(icon_map) < len(overclocks):
        print(
            "警告：OVERCLOCK_ICON_MAP 条目少于基线超频数。"
            "请先运行：node scripts/ingest/regen-overclock-icon-map.mjs"
        )

    # 2. 加载背景框
    backgrounds = load_backgrounds()

    # 3. 清空临时输出目录
    if TMP_DIR.exists():
        shutil.rmtree(TMP_DIR)
    TMP_DIR.mkdir(parents=True)

    # 4. 合成每个超频的完整图标
    generated: dict[str, str] = {}
    missing: list[str] = []
    skipped: list[str] = []

    for oc in overclocks:
        name = oc.get("englishName", "")
        if not name:
            skipped.append(str(oc.get("id", "?")))
            continue

        oc_type = oc.get("type", "balanced").lower()
        if oc_type not in backgrounds:
            print(f"警告：超频 '{name}' 的 type='{oc_type}' 未知，使用 balanced")
            oc_type = "balanced"

        effect_path = icon_map.get(name)
        if not effect_path:
            missing.append(name)
            print(f"跳过：{name}（无效果图标映射）")
            continue

        kebab_name = kebab(name)
        effect_file = SOURCE_DIR / f"{kebab_name}.png"
        if not effect_file.exists():
            # 缺纯源：退回用已上线的合成图作效果层。
            # 该合成图结构为「效果图标(不透明) + 透明处为背景」，
            # 透明处贴到新背景后即为新背景，因此作效果层是干净的。
            fb = ICONS_DIR / f"{kebab_name}.png"
            if fb.exists():
                effect_file = fb
                print(f"近似源：{name}（缺纯效果源，用现有合成图作效果层）")
            else:
                missing.append(name)
                print(f"跳过：{name}（既缺纯源也无现有合成图）")
                continue

        effect = Image.open(effect_file).convert("RGBA")
        result = composite_icon(backgrounds[oc_type], effect)
        out_name = f"{kebab(name)}.png"
        out_path = TMP_DIR / out_name
        result.save(out_path, "PNG")
        generated[name] = f"/overclock-icons/{out_name}"

    print(f"\n合成完成：{len(generated)}/{len(overclocks)} 张")
    if missing:
        print(f"缺失/跳过：{len(missing)} 张")
    if skipped:
        print(f"无英文名跳过：{len(skipped)} 张")

    # 5. 替换 public/overclock-icons/ 为合成结果
    print(f"\n清理旧图标：{ICONS_DIR}")
    for f in ICONS_DIR.glob("*.png"):
        f.unlink()

    for f in TMP_DIR.glob("*.png"):
        shutil.move(str(f), str(ICONS_DIR / f.name))
    TMP_DIR.rmdir()

    # 6. 重写 OVERCLOCK_ICON_MAP
    sorted_items = sorted(generated.items(), key=lambda x: x[0])
    lines = ['  "{}": "{}",'.format(k, v) for k, v in sorted_items]
    new_block = (
        "// 超频图标：由 scripts/ingest/composite-overclock-icons.py 合成。\n"
        "// 完整图标 = 类型背景框（Balanced/Unstable）+ 效果图标（Survivor_Icon_*.png）。\n"
        "// 键为基线英文名，每个超频对应一张独立合成图。\n"
        "export const OVERCLOCK_ICON_MAP: Record<string, string> = {\n"
        + "\n".join(lines)
        + "\n}"
    )

    start_idx = icon_map_content.find("// 超频图标：")
    if start_idx == -1:
        start_idx = icon_map_content.find("export const OVERCLOCK_ICON_MAP")
    map_declare_idx = icon_map_content.find("export const OVERCLOCK_ICON_MAP", start_idx)
    open_brace_idx = icon_map_content.find("{", map_declare_idx)
    close_brace_idx = icon_map_content.find("\n}", open_brace_idx)
    end_idx = close_brace_idx + 2 if close_brace_idx != -1 else len(icon_map_content)
    new_content = icon_map_content[:start_idx] + new_block + icon_map_content[end_idx:]

    ICON_MAP_PATH.write_text(new_content.rstrip("\n") + "\n", encoding="utf-8")
    print(f"已更新：{ICON_MAP_PATH}（{len(generated)} 条映射）")

    # 7. 控制台汇总
    print(f"\n汇总：生成 {len(generated)} 张，缺失 {len(missing)} 张")
    if missing:
        print("缺失项：", ", ".join(missing[:10]) + ("…" if len(missing) > 10 else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
