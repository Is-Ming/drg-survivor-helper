import json

api = json.load(open('F:/workbuddy工作空间/drg-survivor-helper/references/_steam_ach_raw.json', encoding='utf-8'))['achievementpercentages']['achievements']
api_by_internal = {a['name']: float(a['percent']) for a in api}
api_sorted = sorted(api, key=lambda a: -float(a['percent']))

print("=== ALL 300 API INTERNAL NAMES (sorted by percent desc) ===")
for a in api_sorted:
    print(f"{float(a['percent']):6.1f}  {a['name']}")
