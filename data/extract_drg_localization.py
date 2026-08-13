#!/usr/bin/env python
# extract_drg_localization.py
# 从《深岩银河：幸存者》(Deep Rock Survivor) 的 Addressables 资源包中
# 提取“简体中文 (zh-cn)”的翻译文本。
#
# 用法：
#   1) 安装依赖:  pip install UnityPy
#   2) 把本脚本和下面提到的 .bundle 文件放在同一台电脑上（路径见 BASE）
#   3) 运行:      python extract_drg_localization.py
#   生成: zh-cn_translations.txt  (key = 中文翻译) 和 zh-cn_translations.json
#
# 说明：本脚本会先读取 shared 包拿到“键名/源文本”，
#       再读取 zh-cn 包拿到对应的中文翻译，按 key 配对输出。
#       若结构化配对失败，也会把包里所有中文串作为兜底输出。

import os, re, json
from UnityPy import Environment

# ===== 路径（按你 Steam 实际安装位置修改） =====
BASE = r"D:\Program Files (x86)\Steam\steamapps\common\Deep Rock Survivor\DRG Survivor_Data\StreamingAssets\aa\StandaloneWindows64"
SHARED = os.path.join(BASE, "localization-assets-shared_assets_all.bundle")
ZHCN   = os.path.join(BASE, "localization-string-tables-chinese(simplified)(zh-cn)_assets_all.bundle")

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_TXT = os.path.join(OUT_DIR, "zh-cn_translations.txt")
OUT_JSON = os.path.join(OUT_DIR, "zh-cn_translations.json")

CJK = re.compile(r'[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]')

def get_attr(obj, *names):
    for n in names:
        if hasattr(obj, n):
            return getattr(obj, n)
    return None

# 1) 从 shared 包构建  keyId -> 键名/源文本
key_map = {}
env = Environment(SHARED)
for o in env.objects:
    try:
        d = o.read()
    except Exception:
        continue
    keys = get_attr(d, "m_Keys", "keys", "TableKeys")
    if not keys:
        continue
    for k in keys:
        kid = get_attr(k, "m_Id", "Id", "id")
        ktxt = get_attr(k, "m_Key", "Key", "key")
        if kid is not None and ktxt:
            key_map[int(kid)] = ktxt
print(f"[shared] 收集到 {len(key_map)} 个键")

# 2) 提取 zh-cn 字符串表
results = []
raw_cjk = []

def collect_cjk(val, acc):
    if isinstance(val, str):
        if CJK.search(val):
            acc.append(val)
    elif isinstance(val, (list, tuple, set)):
        for x in val:
            collect_cjk(x, acc)
    elif isinstance(val, dict):
        for v in val.values():
            collect_cjk(v, acc)
    else:
        for a in dir(val):
            if a.startswith("_"):
                continue
            try:
                v = getattr(val, a)
            except Exception:
                continue
            if callable(v):
                continue
            collect_cjk(v, acc)

env2 = Environment(ZHCN)
table_count = 0
for o in env2.objects:
    try:
        d = o.read()
    except Exception:
        continue
    tdata = get_attr(d, "m_TableData", "TableData", "tableData")
    if not tdata:
        collect_cjk(d, raw_cjk)
        continue
    table_count += 1
    table_name = getattr(d, "name", o.name) or f"table_{table_count}"
    for entry in tdata:
        kid = get_attr(entry, "m_KeyId", "KeyId", "keyId")
        val = get_attr(entry, "m_Value", "Value", "value")
        text = None
        if val is not None:
            text = get_attr(val, "m_LocalizedString", "LocalizedString", "localizedString")
            if text is None and isinstance(val, str):
                text = val
        keytext = key_map.get(int(kid), "") if kid is not None else ""
        results.append({
            "table": table_name,
            "key": keytext,
            "keyId": int(kid) if kid is not None else None,
            "value": text,
        })

print(f"[zh-cn] 处理 {table_count} 个字符串表，共 {len(results)} 条")

raw_cjk = sorted(set(raw_cjk))

with open(OUT_JSON, "w", encoding="utf-8") as f:
    json.dump({"entries": results, "raw_chinese_strings": raw_cjk},
              f, ensure_ascii=False, indent=2)

with open(OUT_TXT, "w", encoding="utf-8") as f:
    f.write("# Deep Rock Survivor - 简体中文 (zh-cn) 翻译\n")
    f.write(f"# 带键名条目: {sum(1 for r in results if r['key'])}\n")
    f.write(f"# 总条目: {len(results)}\n\n")
    for r in results:
        if r["key"]:
            f.write(f"{r['key']} = {r['value']}\n")
        else:
            f.write(f"[{r['keyId']}] = {r['value']}\n")
    if not results or all(not r["key"] for r in results):
        f.write("\n# --- 兜底：包内发现的中文串 ---\n")
        for s in raw_cjk:
            f.write(s + "\n")

print("已写出:", OUT_TXT)
print("已写出:", OUT_JSON)
