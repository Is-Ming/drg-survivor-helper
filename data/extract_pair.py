#!/usr/bin/env python
# extract_pair.py  (v2)
# 从《深岩银河：幸存者》(Deep Rock Survivor) 的 Addressables 本地化包中
# 提取“中文(zh-cn) <-> 英文(en)”对照，并附带保加利亚语(bg)参考列。
#
# 配对键：每个 StringTable 条目用 m_Id (数字 keyId) 关联；
#         各语言包共享同一套 m_Id，因此无需 shared 包即可配对。
#
# 用法：python extract_pair.py
# 字段说明（本游戏实测）：
#   表对象 MonoBehaviour: m_Name(表名), m_LocaleId, m_TableData(条目列表)
#   条目 UnknownObject<TableEntryData>: m_Id(keyId) + m_Localized(译文)
#
# 依赖：UnityPy  (pip install UnityPy)

import os, json
from UnityPy import Environment

FOLDER = os.path.dirname(os.path.abspath(__file__))
FILES = {
    "zh-cn": os.path.join(FOLDER, "localization-string-tables-chinese(simplified)(zh-cn)_assets_all.bundle"),
    "en":    os.path.join(FOLDER, "localization-string-tables-english(en)_assets_all.bundle"),
    "bg":    os.path.join(FOLDER, "localization-string-tables-bulgarian(bg)_assets_all.bundle"),
}

OUT_TXT  = os.path.join(FOLDER, "drg_zh_en_pair.txt")
OUT_JSON = os.path.join(FOLDER, "drg_zh_en_pair.json")

def get_attr(obj, *names):
    for n in names:
        if hasattr(obj, n):
            return getattr(obj, n)
    return None

def extract_values(bundle_path):
    """返回 {m_Id(int): {"text": str, "table": str}} """
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

def stats_of(d):
    return {k: len(v) for k, v in d.items()}

zh = extract_values(FILES["zh-cn"])
en = extract_values(FILES["en"])
bg = extract_values(FILES["bg"])

print("[zh-cn]", len(zh), "| [en]", len(en), "| [bg]", len(bg))

# 以中文包为基线，核对英文是否对齐
en_in_zh = sum(1 for k in en if k in zh)
zh_in_en = sum(1 for k in zh if k in en)
print(f"[对齐] 英文∩中文 = {len(set(zh)&set(en))}；"
      f"英文里有 {len(en)-en_in_zh} 条不在中文包；"
      f"中文里有 {len(zh)-zh_in_en} 条不在英文包")

# 仅中文缺英文的条目，尝试用保语兜底展示
rows = []
all_ids = sorted(set(zh) | set(en) | set(bg))
for kid in all_ids:
    z = zh.get(kid)
    e = en.get(kid)
    b = bg.get(kid)
    rows.append({
        "keyId": kid,
        "table": (z or e or b)["table"],
        "zh_cn": z["text"] if z else None,
        "en": e["text"] if e else None,
        "bg": b["text"] if b else None,
    })

with open(OUT_JSON, "w", encoding="utf-8") as f:
    json.dump({"entries": rows, "stats": {
        "zh": len(zh), "en": len(en), "bg": len(bg),
        "zh_en_both": len(set(zh) & set(en)),
    }}, f, ensure_ascii=False, indent=2)

with open(OUT_TXT, "w", encoding="utf-8") as f:
    f.write("# Deep Rock Survivor - 本地化对照 (中文 / 英文 / 保加利亚语参考)\n")
    f.write(f"# 中文 {len(zh)} 条 / 英文 {len(en)} 条 / 保加利亚语 {len(bg)} 条\n")
    f.write(f"# 中英文共有 keyId: {len(set(zh)&set(en))}\n\n")
    f.write("TABLE\tZH-CN\tEN\tBG(参考)\n")
    for r in rows:
        f.write(f"{r['table']}\t{r['zh_cn']}\t{r['en']}\t{r['bg']}\n")

print("已写出:", OUT_TXT)
print("已写出:", OUT_JSON)
