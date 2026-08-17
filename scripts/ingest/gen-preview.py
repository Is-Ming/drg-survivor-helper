#!/usr/bin/env python3
# 生成交互原型 dashboard-preview.html（自包含，数据为真实 baseline）
import json, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
BASE = "https://himing.xyz/game/drg"

b = json.loads((ROOT / "server/data/baseline.json").read_text(encoding="utf-8"))

# 武器 -> 图标 映射
im = (ROOT / "src/data/icon-map.ts").read_text(encoding="utf-8")
weapon_icon_map = dict(re.findall(r'"([^"]+)":\s*"(/weapon-icons/[^"]+)"', im))

weapons = [{
    "id": w.get("id") or w.get("englishName"),
    "chineseName": w.get("chineseName", ""),
    "englishName": w.get("englishName", ""),
    "class": w.get("class", ""),
    "rating": w.get("rating") or "C",
    "tags": w.get("tags") or w.get("tagLabels") or [],
    "yellowOverclockIds": w.get("yellowOverclockIds") or [],
    "redOverclockIds": w.get("redOverclockIds") or [],
} for w in b["weapons"]]

overclocks = [{
    "id": o["id"], "chineseName": o.get("chineseName", ""),
    "englishName": o.get("englishName", ""), "type": o.get("type", ""),
    "effect": o.get("effect", ""),
} for o in b["overclocks"]]

equipments = [{
    "chineseName": e.get("chineseName") or e.get("officialName", ""),
    "officialName": e.get("officialName", ""), "type": e.get("type", ""),
    "source": e.get("source", ""), "effect": e.get("effect", ""),
    "officialEffect": e.get("officialEffect", ""),
} for e in b.get("equipments", [])]

achievements = [{
    "chineseName": a.get("chineseName", ""), "englishName": a.get("englishName", ""),
    "category": a.get("category", ""), "rarity": a.get("rarity", ""),
    "completionRate": a.get("completionRate"), "icon": a.get("icon", ""),
    "unlockCondition": a.get("unlockCondition", ""),
} for a in b.get("achievements", [])]

data = {
    "weapons": weapons, "overclocks": overclocks,
    "equipments": equipments, "achievements": achievements,
    "weaponIconMap": weapon_icon_map,
}
DATA_JSON = json.dumps(data, ensure_ascii=False)

TEMPLATE = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>DRG Survivor 助手 · 交互原型预览</title>
<style>
:root{
  --amber:#ffb000; --amber-dim:#c98a00;
  --bg:#1b1a17; --panel:#26241f; --panel-2:#2f2c26;
  --text:#f2ede3; --muted:#b7ad99; --line:#3d3a32;
  --balanced:#ffcf4d; --unstable:#ff6a5a;
  --scout:#46c2ff; --engineer:#ffb000; --gunner:#ff6a3c; --driller:#7bdb4a;
  --radius:14px;
}
body.light{--bg:#f4f1ea;--panel:#fffdf8;--panel-2:#f6f2e9;--text:#2a2620;--muted:#6b6456;--line:#e3ddcf;}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--bg);color:var(--text);
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;
  -webkit-font-smoothing:antialiased;}
.hazard{height:6px;border-radius:3px;
  background:repeating-linear-gradient(45deg,#161512 0 12px,var(--amber) 12px 24px);}
.topbar{position:sticky;top:0;z-index:30;background:var(--panel);border-bottom:1px solid var(--line);
  display:flex;align-items:center;gap:12px;padding:10px 16px;flex-wrap:wrap;}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:.5px;white-space:nowrap;}
.brand .logo{width:30px;height:30px;border-radius:8px;background:var(--amber);color:#1a1a1a;
  display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;}
.search{flex:1;min-width:180px;display:flex;align-items:center;gap:8px;background:var(--panel-2);
  border:1px solid var(--line);border-radius:10px;padding:7px 10px;}
.search input{flex:1;background:transparent;border:0;outline:0;color:var(--text);font-size:14px;}
.search .count{font-size:12px;color:var(--muted);white-space:nowrap;}
.search .clear{cursor:pointer;color:var(--muted);font-weight:700;border:0;background:transparent;font-size:15px;line-height:1;}
.btn{cursor:pointer;border:1px solid var(--line);background:var(--panel-2);color:var(--text);
  border-radius:10px;padding:7px 12px;font-size:13px;font-weight:600;white-space:nowrap;}
.btn:hover{border-color:var(--amber);}
.btn.primary{background:var(--amber);color:#1a1a1a;border-color:var(--amber);}
.iconbtn{cursor:pointer;width:36px;height:36px;border-radius:10px;border:1px solid var(--line);
  background:var(--panel-2);color:var(--text);font-size:16px;display:flex;align-items:center;justify-content:center;}
.sortsel{cursor:pointer;border:1px solid var(--line);background:var(--panel-2);color:var(--text);
  border-radius:10px;padding:7px 8px;font-size:13px;font-weight:600;max-width:150px;}
.sortsel:hover{border-color:var(--amber);}
.tabs{display:flex;gap:6px;padding:12px 16px 0;flex-wrap:wrap;}
.tab{cursor:pointer;padding:8px 16px;border-radius:10px 10px 0 0;border:1px solid var(--line);
  border-bottom:0;background:var(--panel-2);color:var(--muted);font-weight:700;font-size:14px;}
.tab.active{background:var(--panel);color:var(--amber);}
.hint{font-size:12px;color:var(--muted);padding:8px 16px;display:flex;gap:14px;flex-wrap:wrap;align-items:center;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px;padding:14px 16px 40px;}
.section{ grid-column:1/-1; }
.section-head{display:flex;align-items:center;gap:10px;padding:8px 6px;margin:6px 0 2px;font-weight:800;cursor:pointer;
  position:sticky;top:56px;background:var(--panel);z-index:6;border-bottom:1px solid var(--line);}
.section-head .bar{width:6px;height:22px;border-radius:3px;}
.section-head .cnt{font-size:12px;color:var(--muted);font-weight:600;}
.subgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px;padding-top:8px;}
.card{background:var(--panel);border:2px solid var(--line);border-radius:var(--radius);
  clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,0 100%);
  overflow:hidden;transition:transform .15s ease,border-color .15s ease;}
.card:hover{transform:translateY(-3px);border-color:var(--amber);}
.card .head{display:flex;align-items:center;gap:10px;padding:12px 14px 10px;}
.clsbar{width:5px;align-self:stretch;border-radius:3px;}
.cls-Scout{background:var(--scout)} .cls-Engineer{background:var(--engineer)}
.cls-Gunner{background:var(--gunner)} .cls-Driller{background:var(--driller)}
.wicon{width:40px;height:40px;border-radius:9px;background:#161512;border:1px solid var(--line);object-fit:contain;flex:none;}
.titlewrap{flex:1;min-width:0;}
.title{font-weight:800;font-size:15px;}
.title mark{background:var(--amber);color:#1a1a1a;border-radius:3px;padding:0 2px;}
.sub{font-size:12px;color:var(--muted);margin-top:2px;}
.badge{font-size:11px;font-weight:800;padding:3px 8px;border-radius:6px;color:#1a1a1a;}
.rating-S{background:#ffd34d} .rating-A{background:#9be36b} .rating-B{background:#7ec8ff} .rating-C{background:#c9c2b3}
.tags{display:flex;gap:6px;flex-wrap:wrap;padding:0 14px 10px;}
.tag{font-size:11px;padding:2px 8px;border-radius:20px;background:var(--panel-2);border:1px solid var(--line);color:var(--muted);}
.oclist{padding:0 14px 14px;display:none;}
.card.open .oclist{display:block;}
.ocrow{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-top:1px dashed var(--line);}
.ocicon{width:34px;height:34px;border-radius:8px;flex:none;background:#161512;border:1px solid var(--line);object-fit:contain;}
.ocmeta{flex:1;min-width:0;}
.ocname{font-weight:700;font-size:13px;}
.ocname .en{color:var(--muted);font-weight:500;font-size:11px;margin-left:6px;}
.ocfx{font-size:12px;color:var(--muted);margin-top:2px;}
.ocdot{width:8px;height:8px;border-radius:50%;margin-top:5px;flex:none;}
.ocdot.balanced{background:var(--balanced)} .ocdot.unstable{background:var(--unstable)}
.toggle{cursor:pointer;font-size:12px;color:var(--amber);padding:4px 14px 10px;font-weight:700;user-select:none;}
.empty{grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);}
.empty .big{font-size:42px;margin-bottom:10px;}
.empty .btn{margin-top:16px;}
.kbd{font-family:ui-monospace,monospace;background:var(--panel-2);border:1px solid var(--line);border-radius:5px;padding:1px 6px;font-size:11px;}
.drawer-mask{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:40;display:none;}
.drawer-mask.open{display:block;}
.drawer{position:fixed;left:0;right:0;bottom:0;z-index:50;background:var(--panel);
  border-top:3px solid var(--amber);border-radius:18px 18px 0 0;padding:18px 18px 28px;
  transform:translateY(100%);transition:transform .22s ease;max-height:78vh;overflow:auto;}
.drawer.open{transform:translateY(0);}
.drawer h3{margin:0 0 12px;font-size:15px;}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;}
.chip{cursor:pointer;padding:7px 14px;border-radius:20px;border:1px solid var(--line);
  background:var(--panel-2);color:var(--muted);font-weight:600;font-size:13px;}
.chip.on{background:var(--amber);color:#1a1a1a;border-color:var(--amber);}
.drawer .actions{display:flex;gap:10px;margin-top:8px;}
.legend{font-size:11px;color:var(--muted);padding:0 16px 24px;line-height:1.7;}
.legend code{background:var(--panel-2);padding:1px 5px;border-radius:4px;}
.ach .completion{height:6px;border-radius:3px;background:var(--panel-2);margin:6px 14px 10px;overflow:hidden;}
.ach .completion > i{display:block;height:100%;background:var(--amber);}
.ach .rar{font-size:11px;color:var(--muted);}
@media(min-width:860px){.drawer{left:auto;right:16px;bottom:16px;width:340px;border-radius:18px;
  border:2px solid var(--amber);transform:translateY(20px);opacity:0;pointer-events:none;}
  .drawer.open{transform:translateY(0);opacity:1;pointer-events:auto;}}
</style>
</head>
<body>
<div class="hazard"></div>
<div class="topbar">
  <div class="brand"><div class="logo">DRG</div><span>Survivor 助手</span></div>
  <div class="search">
    <span>🔍</span>
    <input id="q" placeholder="搜索当前页…  (按 / 聚焦)" />
    <span class="count" id="count"></span>
    <button class="clear" id="clear" title="清除" style="display:none">✕</button>
  </div>
  <button class="btn" id="filterBtn">⚙ 筛选</button>
  <select id="sortSel" class="sortsel" title="排序"></select>
  <button class="iconbtn" id="themeBtn" title="切换主题">🌙</button>
</div>

<div class="tabs" id="tabs">
  <div class="tab active" data-tab="weapons">武器</div>
  <div class="tab" data-tab="overclocks">超频 · 反查</div>
  <div class="tab" data-tab="equipments">装备</div>
  <div class="tab" data-tab="achievements">成就</div>
</div>
<div class="hint">
  <span>原型演示：移动端筛选已修复（右上「⚙ 筛选」随时可开）</span>
  <span>右上「排序」随页签切换：武器按 <b>评级 S→C</b> · 成就默认 <b>分类分组</b></span>
  <span><span class="kbd">/</span> 聚焦搜索</span>
  <span><span class="kbd">Esc</span> 清空</span>
  <span class="badge" style="background:var(--panel-2);color:var(--muted)">数据为真实 baseline</span>
</div>

<div class="grid" id="grid"></div>

<div class="legend">
  <b>本次原型涵盖</b><br>
  ① <b>武器图标</b>：接入真实 <code>/weapon-icons/</code>（52/53 已覆盖）。<br>
  ② <b>成就页</b>：300 条真实数据，含图标（远程图床）、稀有度、全球完成度（Steam 官方）、解锁条件、分类筛选。<br>
  ③ <b>移动端筛选修复</b>：筛选按钮无条件渲染，底部抽屉 / 桌面右侧浮层。<br>
  ④ <b>搜索增强</b>：清除 + 实时计数 + 高亮；<b>空结果引导</b>一键清除。<br>
  ⑤ <b>超频反查</b>：点超频看「哪些武器拥有它」。<br>
  ⑥ <b>视觉</b>：危险条纹、CutCard 切角、职业色条、评级徽章。<br>
  <i>武器/超频图标引用线上（需联网）；成就图标为远程图床 URL。</i><br>
  <b>本次新增 · 排序</b><br>
  · 武器：默认「评级 S→C」，可选 名称 / 职业。<br>
  · 成就：默认「分类分组」（18 类，组内 稀有→普通→名称），可选 稀有度 / <b>全球完成度</b> / 名称。<br>
  · 超频：默认「类型分组」（稳定/不稳定），可选 名称。<br>
  · 装备：名称 / 类型。<br>
  <i>「全球完成度」为 Steam 官方全球统计（越低越稀有），是稀有度参考指标之一，<b>非个人进度</b>，不记录用户解锁状态。</i>
</div>

<div class="drawer-mask" id="mask"></div>
<div class="drawer" id="drawer">
  <h3 id="drawerTitle">筛选</h3>
  <div id="drawerBody"></div>
  <div class="actions">
    <button class="btn" id="resetBtn" style="flex:1">重置筛选</button>
  </div>
</div>

<script>
const DATA = /*__DATA__*/ {};
const WICON = "https://himing.xyz/game/drg";
const ICON = "https://himing.xyz/game/drg/overclock-icons/";
const state = { tab:"weapons", q:"", classes:new Set(), ratings:new Set(), ocTypes:new Set(),
  equipTypes:new Set(), achCats:new Set(), openSet:new Set(), collapsed:new Set(), sort:null };
const $ = s => document.querySelector(s);
const grid = $("#grid");
const CLASSES = ["Scout","Engineer","Gunner","Driller"];

const RATING_RANK={"S":0,"A":1,"B":2,"C":3,"-":9,"":9};
const RARITY_RANK={"稀有":0,"普通":1,"":2};
const SORT_OPTS={
  weapons:[{v:"rating",t:"评级 S→C"},{v:"name",t:"名称"},{v:"class",t:"职业"}],
  achievements:[{v:"category",t:"分类分组"},{v:"rarity",t:"稀有度"},{v:"completion",t:"全球完成度"},{v:"name",t:"名称"}],
  overclocks:[{v:"type",t:"类型分组"},{v:"name",t:"名称"}],
  equipments:[{v:"name",t:"名称"},{v:"type",t:"类型"}]
};

function classColor(c){return c==="Scout"?"--scout":c==="Engineer"?"--engineer":c==="Gunner"?"--gunner":"--driller";}
function populateSort(){
  const sel=$("#sortSel");
  const opts=SORT_OPTS[state.tab]||[];
  sel.innerHTML=opts.map(o=>`<option value="${o.v}">${o.t}</option>`).join("");
  if(!opts.some(o=>o.v===state.sort)) state.sort=opts.length?opts[0].v:null;
  sel.value=state.sort;
  sel.style.display=opts.length?"":"none";
}
function updateSearchHint(){
  const hint={weapons:"搜索武器（名称 / 英文 / 标签）",overclocks:"搜索超频（名称 / 英文 / 效果）",
    equipments:"搜索装备（名称 / 效果）",achievements:"搜索成就（名称 / 英文 / 解锁条件）"};
  $("#q").placeholder = (hint[state.tab]||"搜索当前页…")+"  (按 / 聚焦)";
}
function hl(text){
  if(!state.q) return text;
  const i = text.toLowerCase().indexOf(state.q.toLowerCase());
  if(i<0) return text;
  return text.slice(0,i)+"<mark>"+text.slice(i,i+state.q.length)+"</mark>"+text.slice(i+state.q.length);
}
function ocById(id){ return DATA.overclocks.find(o=>o.id===id); }
function weaponIcon(w){ const p = DATA.weaponIconMap[w.englishName]; return p? WICON+p : ""; }

function weaponCardHTML(w){
  const ocs=[...(w.yellowOverclockIds||[]),...(w.redOverclockIds||[])];
  const open = state.openSet.has(w.id);
  const wi = weaponIcon(w);
  const ocHtml = ocs.map(id=>{
    const o=ocById(id); if(!o) return "";
    return `<div class="ocrow"><span class="ocdot ${o.type}"></span>
      <img class="ocicon" src="${ICON}${id}.png" onerror="this.style.visibility='hidden'"/>
      <div class="ocmeta"><div class="ocname">${hl(o.chineseName)}<span class="en">${o.englishName}</span></div>
      <div class="ocfx">${o.effect}</div></div></div>`;
  }).join("");
  return `<div class="card ${open?'open':''}" data-id="${w.id}">
    <div class="head"><div class="clsbar cls-${w.class}"></div>
      ${wi?`<img class="wicon" src="${wi}" onerror="this.style.visibility='hidden'"/>`:''}
      <div class="titlewrap"><div class="title">${hl(w.chineseName)}</div>
      <div class="sub">${w.englishName} · ${w.class}</div></div>
      <span class="badge rating-${w.rating}">${w.rating==='-'?'未评级':w.rating}</span></div>
    <div class="tags">${(w.tags||[]).map(t=>`<span class="tag">${t}</span>`).join("")}</div>
    <div class="toggle">${open?'▾ 收起超频 ('+ocs.length+')':'▸ 展开超频 ('+ocs.length+')'}</div>
    <div class="oclist">${ocHtml}</div></div>`;
}

function weaponMatches(w){
  if(state.classes.size && !state.classes.has(w.class)) return false;
  if(state.ratings.size && !state.ratings.has(w.rating)) return false;
  if(state.q){ const hay=(w.chineseName+" "+w.englishName+" "+(w.tags||[]).join(" ")).toLowerCase();
    if(!hay.includes(state.q.toLowerCase())) return false; }
  return true;
}
function renderWeapons(){
  const raw = DATA.weapons.filter(weaponMatches);
  const s=state.sort||"rating";
  const list=[...raw].sort((a,b)=>{
    if(s==="name") return a.chineseName.localeCompare(b.chineseName,"zh");
    if(s==="class") return CLASSES.indexOf(a.class)-CLASSES.indexOf(b.class);
    return (RATING_RANK[a.rating]??9)-(RATING_RANK[b.rating]??9);
  });
  $("#count").textContent = list.length+" 件";
  if(!list.length) return emptyState();
  grid.innerHTML = list.map(weaponCardHTML).join("");
  bindWeaponCards();
}
function bindWeaponCards(){
  grid.querySelectorAll(".card[data-id]").forEach(c=>{
    c.querySelector(".toggle").onclick=()=>{
      const id=c.dataset.id;
      state.openSet.has(id)?state.openSet.delete(id):state.openSet.add(id);
      render();
    };
  });
}
function ocMatches(o){
  if(state.ocTypes.size && !state.ocTypes.has(o.type)) return false;
  if(state.q){ const hay=(o.chineseName+" "+o.englishName+" "+o.effect).toLowerCase();
    if(!hay.includes(state.q.toLowerCase())) return false; }
  return true;
}
function weaponsOfOc(id){
  return DATA.weapons.filter(w=>(w.yellowOverclockIds||[]).includes(id)||(w.redOverclockIds||[]).includes(id))
    .map(w=>w.chineseName);
}
function ocCardHTML(o){
  const open = state.openSet.has("oc:"+o.id);
  const ws = weaponsOfOc(o.id);
  const wsHtml = ws.map(n=>`<span class="tag" style="border-color:var(--amber);color:var(--amber)">${n}</span>`).join("");
  return `<div class="card ach ${open?'open':''}" data-oc="${o.id}">
    <div class="head"><span class="ocdot ${o.type}" style="margin:6px"></span>
      <img class="ocicon" src="${ICON}${o.id}.png" onerror="this.style.visibility='hidden'" style="margin-right:8px"/>
      <div class="titlewrap"><div class="title">${hl(o.chineseName)}</div>
      <div class="sub">${o.englishName} · ${o.type==='balanced'?'稳定':'不稳定'}</div></div>
      <span class="badge" style="background:var(--panel-2);color:var(--amber)">${ws.length} 武器</span></div>
    <div class="ocfx" style="padding:0 14px 6px">${o.effect}</div>
    <div class="toggle">${open?'▾ 收起拥有武器':'▸ 查看拥有武器 ('+ws.length+')'}</div>
    <div class="oclist"><div style="padding-top:6px">${wsHtml||'<span class="sub">无关联武器</span>'}</div></div></div>`;
}
function renderOverclocks(){
  const list = DATA.overclocks.filter(ocMatches);
  $("#count").textContent = list.length+" 个";
  if(!list.length) return emptyState();
  const s=state.sort||"type";
  const arr=[...list].sort((a,b)=> s==="name"
    ? a.chineseName.localeCompare(b.chineseName,"zh")
    : (a.type==="balanced"?0:1)-(b.type==="balanced"?0:1) || a.chineseName.localeCompare(b.chineseName,"zh"));
  if(s!=="type"){ grid.innerHTML = arr.map(ocCardHTML).join(""); }
  else {
    const types=[["balanced","稳定超频"],["unstable","不稳定超频"]];
    let html="";
    types.forEach(([t,label])=>{
      const items=arr.filter(o=>o.type===t);
      if(!items.length) return;
      html+=`<div class="section"><div class="section-head"><span class="bar" style="background:${t==='balanced'?'var(--balanced)':'var(--unstable)'}"></span>
        <span style="color:${t==='balanced'?'var(--balanced)':'var(--unstable)'}">${label}</span><span class="cnt">${items.length} 个</span></div>
        <div class="subgrid">${items.map(ocCardHTML).join("")}</div></div>`;
    });
    grid.innerHTML=html;
  }
  grid.querySelectorAll(".card").forEach(c=>{
    c.querySelector(".toggle").onclick=()=>{
      const k="oc:"+c.dataset.oc;
      state.openSet.has(k)?state.openSet.delete(k):state.openSet.add(k); render();
    };
  });
}

function equipMatches(e){
  if(state.equipTypes.size && !state.equipTypes.has(e.source)) return false;
  if(state.q){ const hay=(e.chineseName+" "+(e.officialName||"")+" "+(e.effect||"")).toLowerCase();
    if(!hay.includes(state.q.toLowerCase())) return false; }
  return true;
}
function renderEquipments(){
  const raw = DATA.equipments.filter(equipMatches);
  const s=state.sort||"name";
  const list=[...raw].sort((a,b)=> s==="type"
    ? (a.source||"").localeCompare(b.source||"","zh")
    : (a.chineseName||"").localeCompare(b.chineseName||"","zh"));
  $("#count").textContent = list.length+" 件";
  if(!list.length) return emptyState();
  grid.innerHTML = list.map(e=>`
    <div class="card"><div class="head"><div class="clsbar" style="background:var(--amber)"></div>
      <div class="titlewrap"><div class="title">${hl(e.chineseName||e.officialName||'')}</div>
      <div class="sub">${e.type||''} · ${e.source||''}</div></div></div>
    <div class="ocfx" style="padding:0 14px 12px">${e.effect||e.officialEffect||''}</div></div>`).join("");
}

function achMatches(a){
  if(state.achCats.size && !state.achCats.has(a.category)) return false;
  if(state.q){ const hay=(a.chineseName+" "+a.englishName+" "+(a.unlockCondition||"")).toLowerCase();
    if(!hay.includes(state.q.toLowerCase())) return false; }
  return true;
}
function achCardHTML(a){
  const cr = (a.completionRate!=null)? a.completionRate : 0;
  const ic = a.icon? `<img class="wicon" src="${a.icon}" onerror="this.style.visibility='hidden'"/>` : `<div class="wicon"></div>`;
  return `<div class="card ach"><div class="head">${ic}
    <div class="titlewrap"><div class="title">${hl(a.chineseName)}</div>
    <div class="sub">${a.englishName} · ${a.category}</div></div>
    <span class="badge" style="background:var(--panel-2);color:var(--muted)">${a.rarity||''}</span></div>
    <div class="ocfx" style="padding:0 14px 4px">${a.unlockCondition||''}</div>
    <div class="completion"><i style="width:${cr}%"></i></div>
    <div class="rar" style="padding:0 14px 12px">全球完成度 ${cr}%</div></div>`;
}
function sortAchFlat(list){
  const s=state.sort||"category";
  const arr=[...list];
  if(s==="name") arr.sort((a,b)=>a.chineseName.localeCompare(b.chineseName,"zh"));
  else if(s==="completion") arr.sort((a,b)=>(a.completionRate??999)-(b.completionRate??999));
  else arr.sort((a,b)=>(RARITY_RANK[a.rarity]??2)-(RARITY_RANK[b.rarity]??2)||a.chineseName.localeCompare(b.chineseName,"zh"));
  return arr;
}
function renderAchievements(){
  const list = DATA.achievements.filter(achMatches);
  $("#count").textContent = list.length+" 条";
  if(!list.length) return emptyState();
  const s=state.sort||"category";
  if(s!=="category"){ grid.innerHTML = sortAchFlat(list).map(achCardHTML).join(""); return; }
  const groups={};
  list.forEach(a=>{ const k=a.category||"其他"; (groups[k]=groups[k]||[]).push(a); });
  const keys=Object.keys(groups).sort((x,y)=>groups[y].length-groups[x].length);
  let html="";
  keys.forEach(k=>{
    const isCol=state.collapsed.has("ach:"+k);
    const items=groups[k].sort((a,b)=>(RARITY_RANK[a.rarity]??2)-(RARITY_RANK[b.rarity]??2)||a.chineseName.localeCompare(b.chineseName,"zh"));
    html+=`<div class="section"><div class="section-head" data-achcat="${k}"><span class="bar" style="background:var(--amber)"></span>
      <span>${hl(k)}</span><span class="cnt">${items.length} 条 ${isCol?'▸':'▾'}</span></div>
      ${isCol?'':`<div class="subgrid">${items.map(achCardHTML).join("")}</div>`}</div>`;
  });
  grid.innerHTML=html;
  grid.querySelectorAll(".section-head[data-achcat]").forEach(h=>h.onclick=()=>{
    const key="ach:"+h.dataset.achcat;
    state.collapsed.has(key)?state.collapsed.delete(key):state.collapsed.add(key); render();
  });
}

function emptyState(){
  grid.innerHTML = `<div class="empty"><div class="big">🔍</div>
    <div>没有匹配的结果</div>
    <button class="btn primary" id="emptyClear">清除筛选 / 搜索</button></div>`;
  $("#emptyClear").onclick = ()=>{ state.q=""; state.classes.clear(); state.ratings.clear();
    state.ocTypes.clear(); state.equipTypes.clear(); state.achCats.clear(); $("#q").value=""; syncClear(); render(); };
}
function render(){
  if(state.tab==="weapons") renderWeapons();
  else if(state.tab==="overclocks") renderOverclocks();
  else if(state.tab==="equipments") renderEquipments();
  else renderAchievements();
}

function openDrawer(){
  const body=$("#drawerBody");
  if(state.tab==="weapons"){
    const ratings=["S","A","B","C"];
    let html=`<div style="margin-bottom:6px;color:var(--muted);font-size:12px">职业</div><div class="chips" id="clsChips">`
      +CLASSES.map(c=>`<div class="chip ${state.classes.has(c)?'on':''}" data-c="${c}">${c}</div>`).join("")
      +`</div><div style="margin:10px 0 6px;color:var(--muted);font-size:12px">评级</div><div class="chips" id="rateChips">`
      +ratings.map(r=>`<div class="chip ${state.ratings.has(r)?'on':''}" data-r="${r}">${r}</div>`).join("")+`</div>`;
    body.innerHTML=html;
    body.querySelectorAll("#clsChips .chip").forEach(ch=>ch.onclick=()=>{ch.classList.toggle("on");
      ch.classList.contains("on")?state.classes.add(ch.dataset.c):state.classes.delete(ch.dataset.c); render();});
    body.querySelectorAll("#rateChips .chip").forEach(ch=>ch.onclick=()=>{ch.classList.toggle("on");
      ch.classList.contains("on")?state.ratings.add(ch.dataset.r):state.ratings.delete(ch.dataset.r); render();});
  } else if(state.tab==="equipments"){
    const srcs=[...new Set(DATA.equipments.map(e=>e.source).filter(Boolean))];
    body.innerHTML=`<div style="margin-bottom:6px;color:var(--muted);font-size:12px">来源</div><div class="chips" id="srcChips">`
      +srcs.map(s=>`<div class="chip ${state.equipTypes.has(s)?'on':''}" data-s="${s}">${s}</div>`).join("")+`</div>`;
    body.querySelectorAll("#srcChips .chip").forEach(ch=>ch.onclick=()=>{ch.classList.toggle("on");
      ch.classList.contains("on")?state.equipTypes.add(ch.dataset.s):state.equipTypes.delete(ch.dataset.s); render();});
  } else if(state.tab==="overclocks"){
    const types=["balanced","unstable"];
    body.innerHTML=`<div style="margin-bottom:6px;color:var(--muted);font-size:12px">超频类型</div><div class="chips" id="ocChips">`
      +types.map(t=>`<div class="chip ${state.ocTypes.has(t)?'on':''}" data-t="${t}">${t==='balanced'?'稳定':'不稳定'}</div>`).join("")+`</div>`;
    body.querySelectorAll("#ocChips .chip").forEach(ch=>ch.onclick=()=>{ch.classList.toggle("on");
      ch.classList.contains("on")?state.ocTypes.add(ch.dataset.t):state.ocTypes.delete(ch.dataset.t); render();});
  } else {
    const cats=[...new Set(DATA.achievements.map(a=>a.category).filter(Boolean))];
    body.innerHTML=`<div style="margin-bottom:6px;color:var(--muted);font-size:12px">成就分类</div><div class="chips" id="catChips">`
      +cats.map(c=>`<div class="chip ${state.achCats.has(c)?'on':''}" data-cat="${c}">${c}</div>`).join("")+`</div>`;
    body.querySelectorAll("#catChips .chip").forEach(ch=>ch.onclick=()=>{ch.classList.toggle("on");
      ch.classList.contains("on")?state.achCats.add(ch.dataset.cat):state.achCats.delete(ch.dataset.cat); render();});
  }
  $("#mask").classList.add("open"); $("#drawer").classList.add("open");
}
function closeDrawer(){ $("#mask").classList.remove("open"); $("#drawer").classList.remove("open"); }

$("#tabs").querySelectorAll(".tab").forEach(t=>t.onclick=()=>{
  $("#tabs").querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  t.classList.add("active"); state.tab=t.dataset.tab; state.openSet.clear();
  populateSort(); updateSearchHint(); window.scrollTo({top:0}); render();
});
$("#sortSel").onchange=e=>{ state.sort=e.target.value; window.scrollTo({top:0}); render(); };
let _qTimer=null;
$("#q").oninput=e=>{ state.q=e.target.value; syncClear();
  clearTimeout(_qTimer); _qTimer=setTimeout(render,160); };
function syncClear(){ $("#clear").style.display = state.q? "block":"none"; }
$("#clear").onclick=()=>{ state.q=""; $("#q").value=""; syncClear(); render(); };
$("#filterBtn").onclick=openDrawer;
$("#mask").onclick=closeDrawer;
$("#resetBtn").onclick=()=>{ state.classes.clear();state.ratings.clear();state.ocTypes.clear();
  state.equipTypes.clear();state.achCats.clear(); render(); openDrawer(); };
$("#themeBtn").onclick=()=>{ document.body.classList.toggle("light");
  $("#themeBtn").textContent = document.body.classList.contains("light")?"☀️":"🌙"; };
document.addEventListener("keydown",e=>{
  if(e.key==="/" && document.activeElement!==$("#q")){ e.preventDefault(); $("#q").focus(); }
  if(e.key==="Escape"){ if($("#drawer").classList.contains("open")) closeDrawer();
    else if(state.q){ state.q=""; $("#q").value=""; syncClear(); render(); } }
});
populateSort();
updateSearchHint();
render();
</script>
</body>
</html>"""

out = TEMPLATE.replace("/*__DATA__*/ {}", DATA_JSON)
dest = ROOT / "dashboard-preview.html"
dest.write_text(out, encoding="utf-8")
print("weapons:", len(weapons), "| overclocks:", len(overclocks),
      "| equipments:", len(equipments), "| achievements:", len(achievements),
      "| weaponIconMap:", len(weapon_icon_map))
print("written:", dest, "bytes:", len(out))
