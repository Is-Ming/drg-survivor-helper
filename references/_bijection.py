import json, re

API = json.load(open('F:/workbuddy工作空间/drg-survivor-helper/references/_steam_ach_raw.json', encoding='utf-8'))['achievementpercentages']['achievements']
api_pct = {a['name']: float(a['percent']) for a in API}
api_names = set(api_pct)

# ---------- maps ----------
WEAPON = {
 'DeepCore GK2':'deepcoregk2','Zhukov NUK17':'zhukovnuk17','Cryo Grenade':'cryogrenade',
 'Jury-Rigged Boomstick':'juryriggedboomstick','M1000':'m1000','Stun Sweeper':'voltaicstunsweeper',
 'TH-0R Bug Taser':'th0rbugtaser','Cryo Guard':'arctekcryoguard','Plasma Carbine':'drak25plasmacarbine',
 'Nishanka Boltshark':'nishankaboltshark','Heavy Revolver':'bulldogheavyrevolver','Incendiary Grenade':'incendiarygrenade',
 'Powered Minigun':'leadstormpoweredminigun','Burst Fire Gun':'brt7burstfiregun','Tactical Leadburster':'tacticalleadburster',
 'Heavy Autocannon':'thunderheadheavyautocannon','Firefly Hunter Drone':'fireflyhunterdrone','Hurricane':'hurricanguidedrocketsystem',
 'Seismic Repulsor':'seismicrepulsor','Coil Gun':'armskorecoilgun','Warthog Auto':'warthogauto210',
 'Voltaic SMG':'stubbyvoltaicsmg','Hi-Volt Thunderbird':'hivoltthunderbird','LMG Gun Platform':'lmggunplatform',
 'Voltaic Shock Fence':'voltaicshockfence','LOK-1 Smart Rifle':'lok1smartrifle','DeepCore PGL':'deepcorepgl',
 'Breach Cutter':'breachcutter','Shard Diffractor':'sharddiffractor','Plasma Burster':'plasmaburster',
 'Swarm Grenade':'shredderswarmgrenade','Subata 120':'subata120','Krakatoa Sentinel':'krakatoasentinel',
 'HE Grenade':'highexplosivegrenade','CRSPR Flamethrower':'crsprflamethrower','Sludge Pump':'corrosivesludgepump',
 'Wave Cooker':'colettewavecooker','Impact Axe':'impactaxe','Neurotoxin Grenade':'neurotoxingrenade',
 'Cryo Cannon':'cryocannon','K1-P Viper Drone':'k1pviperdrone','Plasma Charger':'experimentalplasmacharger',
}
TAG = {
 'Feeling a bit sour':'acid','Zone of control':'area','Cross the beams':'beam','Dwarven architecture':'construct',
 'Deep freeze':'cold','Modern warfare':'drone','Stormbringer':'electrical','Bomberman':'explosive',
 'Keeper of the flame':'fire','Who touched my gun!?':'heavy','Blunt force trauma':'kinetic','Delayed gratification':'lasting',
 'Fleet of foot':'light','Tried and tested':'medium','Light show':'plasma','Professionals have standards':'precise',
 'Weight of fire':'projectile','Spray \'n pray':'spray','It\'s all in the wrist':'throwable','Sentry goin\' up':'turret',
}
BIOME = {'Crystalline Caverns':('CC','crystallinecaverns'),'Magma Core':('MC','magmacore'),
         'Hollow Bough':('HB','hollowbough'),'Salt Pits':('SP','saltpits'),'Azure Weald':('AW','azureweald')}
ROMAN = {'I':1,'II':2,'III':3,'IV':4,'V':5}
ENDTYPE = {'Dives':'dives','Kills':'kills','Damage':'damage','Mine':'mine','Run':'walk'}
SUBCLASS = {'Classic Scout':'classic','Recon':'recon','Sharpshooter':'sharpshooter','Weapons Specialist':'weaponsspecialist',
 'Juggernaut':'juggernaut','Heavy Gunner':'heavygunner','Maintenance Worker':'maintenanceworker','Tinkerer':'tinkerer',
 'Demolitionist':'demolitionist','Foreman':'foreman','Interrogator':'interrogator','Strong Armed':'strongarmed'}
GEAR = {'Custom rig':'ach-gear-6uncommon','Professional setup':'ach-gear-6rare','Truly epic':'ach-gear-equipepic',
 'Expertly tuned':'ach-gear-6epic','Legendary!':'ach-gear-equiplegendary','Fabled fittings':'ach-gear-6legendary',
 'We\'re keeping this one':'ach-gear-fullupgrade','Master artificer':'ach-gear-fullupgradelegendary',
 'Karl, is that you?':'ach-gear-fullupgradelegendary6','Mind over matter':'ach-gear-haz4none','Just like the old days':'ach-gear-haz5none'}

def decode(en, cat, cond):
    if cat == '武器超频' and en.startswith('Overclock: '):
        return 'ach-wep18-'+WEAPON.get(en[11:].strip())
    if cat == '武器精通' and en.startswith('Mastery: '):
        return 'ach-wepmaster-'+WEAPON.get(en[8:].strip())
    if cat == '武器真精通' and en.startswith('True Mastery: '):
        return 'ach-wepmaster5-'+WEAPON.get(en[13:].strip())
    if cat == '耐力' and en.startswith('Endurance: '):
        rest=en[11:].strip(); typ,rom=rest.rsplit(' ',1)
        return f'ach-endurance-{ENDTYPE.get(typ)}-{ROMAN.get(rom)}'
    if cat == '生物群系':
        if en.startswith('Mastery - '):
            b=BIOME.get(en[10:].strip()); return 'ach-biomemaster-'+b[1] if b else None
        if en.startswith('True Mastery - '):
            b=BIOME.get(en[15:].strip()); return 'ach-biomemaster5-'+b[1] if b else None
        b=BIOME.get(en)
        return f'ach-{b[0]}_4_MSDataWinRun' if b else None
    if cat == '武器标签':
        return 'ach-tagcollect-'+TAG.get(en)
    if cat == '异常·先锋·致命':
        if en.startswith('Anomaly - Hazard '): return f'ach-anom-winhaz{en.split()[-1]}'
        if en.startswith('Vanguard - Hazard '): return f'ach-vang-winhaz{en.split()[-1]}'
        if en=='Employee of the Week': return 'ach-lethal-win1'
        if en=='Employee of the Month': return 'ach-lethal-win5'
        if en=='Employee of the Year': return 'ach-lethal-win10'
    if cat == '职业进阶':
        if '完成一次潜水' in cond:
            for k,v in SUBCLASS.items():
                if k in cond: return 'ach-subclasswin-'+v
        else:
            for k,v in SUBCLASS.items():
                if k in cond: return 'ach-subclasswinspecial-'+v
    if cat == '装备':
        return GEAR.get(en)
    return None  # plain achievements handled by nearest-percent

# ---------- parse file ----------
rows=[]
with open('F:/workbuddy工作空间/drg-survivor-helper/references/data-achievements.md', encoding='utf-8') as f:
    for line in f:
        if not line.startswith('|'): continue
        c=[x.strip() for x in line.split('|')]
        if len(c)<8: continue
        if c[1] in ('英文名',) or set(c[1])<=set('-: '): continue
        rows.append((c[1],c[3],c[4],c[6]))  # en, cat, cond, rate

used=set()
mapping={}   # en -> internal
unmatched_decode=[]
for en,cat,cond,rate in rows:
    inner=decode(en,cat,cond)
    if inner and inner in api_names and inner not in used:
        mapping[en]=inner; used.add(inner)
    elif inner and inner not in api_names:
        unmatched_decode.append((en,cat,inner,'NOT_IN_API'))
    elif inner and inner in used:
        unmatched_decode.append((en,cat,inner,'ALREADY_USED'))
    else:
        unmatched_decode.append((en,cat,None,'NO_DECODE'))

# ---------- nearest-percent for plain rows ----------
def nearest_unused(p, used, tol=0.6):
    cands=[(abs(v-p),k) for k,v in api_pct.items() if k not in used]
    cands.sort()
    return [k for d,k in cands[:3] if d<=tol], (cands[0][0] if cands else 9)

plain_report=[]
for en,cat,inner,reason in unmatched_decode:
    if reason=='NO_DECODE':
        cands,dist=nearest_unused(float(rows_rate(en)), used) if False else (None,9)
        p=None
        # find rate
        for r in rows:
            if r[0]==en: p=float(r[3].rstrip('%')) if r[3] else None
        if p is None:
            cands,dist=nearest_unused(0,used)  # shouldn't happen for empty; use 0
        else:
            cands,dist=nearest_unused(p,used)
        if len(cands)==1:
            mapping[en]=cands[0]; used.add(cands[0])
            plain_report.append((en,cat,cands[0],api_pct[cands[0]],'ok'))
        else:
            plain_report.append((en,cat,cands,dist,'AMBIGUOUS/MISS'))

def rows_rate(en):
    for r in rows:
        if r[0]==en: return r[3]
    return ''

# redo nearest using helper properly
used2=set(mapping.values())
plain_report=[]
for en,cat,inner,reason in unmatched_decode:
    if reason!='NO_DECODE': 
        plain_report.append((en,cat,inner,reason,'DECODE_FAIL'))
        continue
    p=None
    for r in rows:
        if r[0]==en: p=float(r[3].rstrip('%')) if r[3] else None
    if p is None:
        cands=sorted([(9,k) for k in api_pct if k not in used2])[:3]; dist=9
    else:
        cands=sorted([(abs(v-p),k) for k,v in api_pct.items() if k not in used2])[:3]; dist=cands[0][0]
    good=[k for d,k in cands if d<=0.6]
    if len(good)==1:
        mapping[en]=good[0]; used2.add(good[0])
        plain_report.append((en,cat,good[0],api_pct[good[0]],'ok'))
    else:
        plain_report.append((en,cat,[k for _,k in cands],dist,'AMBIG'))

print("=== DECODE FAILURES (structured rows not matched) ===")
for x in plain_report:
    if x[4] in ('DECODE_FAIL',):
        print("  ",x)
print("=== PLAIN ROWS nearest-percent result ===")
for x in plain_report:
    if x[4]!='DECODE_FAIL':
        print(f"  {x[0]} | {x[1]} -> {x[2]} ({x[3]}) [{x[4]}]")

print("\n=== BIJECTION ===")
print("file rows:",len(rows)," mapped:",len(mapping))
print("API internals used:",len(used2))
unused=sorted(api_names - used2)
unmapped=[en for en in [r[0] for r in rows] if en not in mapping]
print("STEAM-ONLY (in API, not in file):",len(unused))
for u in unused: print("   ",u,api_pct[u])
print("FILE-ONLY (in file, not mapped):",len(unmapped))
for u in unmapped: print("   ",u)
