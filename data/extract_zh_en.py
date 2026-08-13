#!/usr/bin/env python
# extract_zh_en.py
# 提取《深岩银河：幸存者》(Deep Rock Survivor) 的“中文(zh-cn) <-> 英文(en)”对照，纯 JSON。
# 配对键：每个 StringTable 条目用 m_Id (数字 keyId) 关联；各语言包共享同一套 m_Id。
#
# 用法：python extract_zh_en.py
# 字段（本游戏实测）：表对象 MonoBehaviour: m_Name(表名), m_TableData(条目列表)
#                     条目 UnknownObject<TableEntryData>: m_Id(keyId) + m_Localized(译文)
# 依赖：UnityPy  (pip install UnityPy)

import os, json
from UnityPy import Environment

FOLDER = os.path.dirname(os.path.abspath(__file__))
FILES = {
    "zh-cn": os.path.join(FOLDER, "localization-string-tables-chinese(simplified)(zh-cn)_assets_all.bundle"),
    "en":    os.path.join(FOLDER, "localization-string-tables-english(en)_assets_all.bundle"),
}
OUT_JSON = os.path.join(FOLDER, "drg_zh_en.json")

def get_attr(obj, *names):
    for n in names:
        if hasattr(obj, n):
            return getattr(obj, n)
    return None

def extract_values(bundle_path):
    out = {}
    if not os.path.exists(bundle_path):
        return out
    env = Environment(bundle_path)
    for o in env.objects:
        if o.type.name != "MonoBehaviour":
            continue
        try:
            d = o.read()
        except Exception:
            continue
        tdata = get_attr(d, "m_TableData", "TableData", "tableData")
        if not tdata:
            continue
        table_name = get_attr(d, "m_Name") or "?"
        for entry in tdata:
            eid = get_attr(entry, "m_Id", "Id", "id")
            text = get_attr(entry, "m_Localized", "Localized", "localized")
            if eid is not None:
                out[int(eid)] = {"text": text, "table": table_name}
    return out

zh = extract_values(FILES["zh-cn"])
en = extract_values(FILES["en"])
print("[zh-cn]", len(zh), "| [en]", len(en))

rows = []
# 以 m_Id 为键，中文包为基线，英文对齐；互缺的也保留（对应列为 null）
all_ids = sorted(set(zh) | set(en))
for kid in all_ids:
    z = zh.get(kid)
    e = en.get(kid)
    rows.append({
        "keyId": kid,
        "table": (z or e)["table"],
        "zh_cn": z["text"] if z else None,
        "en": e["text"] if e else None,
    })

with open(OUT_JSON, "w", encoding="utf-8") as f:
    json.dump({
        "stats": {
            "zh": len(zh),
            "en": len(en),
            "zh_en_both": len(set(zh) & set(en)),
            "zh_only": len(set(zh) - set(en)),
            "en_only": len(set(en) - set(zh)),
        },
        "entries": rows,
    }, f, ensure_ascii=False, indent=2)

print("已写出:", OUT_JSON)
