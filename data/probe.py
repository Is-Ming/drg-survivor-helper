from UnityPy import Environment
import os

BASE = r"D:\Program Files (x86)\Steam\steamapps\common\Deep Rock Survivor\DRG Survivor_Data\StreamingAssets\aa\StandaloneWindows64"

for name in [
    "localization-string-tables-chinese(simplified)(zh-cn)_assets_all.bundle",
    "localization-assets-shared_assets_all.bundle",
]:
    p = os.path.join(BASE, name)
    print("========================================")
    print("FILE:", name)
    env = Environment(p)
    tc = {}
    for o in env.objects:
        tc[o.type] = tc.get(o.type, 0) + 1
    print("TYPES:", tc)
    seen = set()
    for o in env.objects:
        if o.type in seen:
            continue
        seen.add(o.type)
        try:
            d = o.read()
            nm = getattr(d, "name", "?")
            attrs = [a for a in dir(d) if not a.startswith("_")][:50]
            print("--- type:", o.type, "| name:", nm)
            print("    attrs:", attrs)
        except Exception as e:
            print("    read err:", repr(e))
