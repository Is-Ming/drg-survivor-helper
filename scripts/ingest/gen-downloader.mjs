// gen-downloader.mjs
// 重新生成 scripts/ingest/download-overclock-icons.html
// 目标：拉取缺失的 48 个超频特性图标 + 2 个超频类型背景框（Balanced/Unstable），
//       供后续 scripts/ingest/composite-overclock-icons.py 合成完整超频图标。
//
// 关键约束（已实测验证）：
//   1. Cloudflare 只放行真人浏览器；本机沙箱/服务器均无法直连 wiki.gg（HTTPS 被出口代理 TLS 阻断，
//      且 Cloudflare JS 质询挡死所有自动化客户端）。
//   2. file:// 页面对 wiki.gg 的 fetch 是跨域，不会携带 cf_clearance cookie → 必被 Cloudflare 拦截
//      （所以「本页一键/跨域」按钮基本必败，仅作最后尝试）。
//   3. 唯一可靠路径：在 wiki.gg 页面内执行脚本（与 wiki.gg 同源，cookie 自动携带，Cloudflare 放行）。
//      两种落地方式：
//        A. 控制台粘贴（最可靠，不依赖书签）：在 wiki.gg 页按 F12 → Console → 粘贴运行。
//        B. 书签脚本：手动「添加网页」粘贴 javascript: 代码（拖拽在 Chrome 常失效，不推荐）。

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const WIKI_HOST = 'https://deeprockgalactic.wiki.gg'
const NEEDS = 'C:/Users/zhuym/AppData/Local/Temp/needs.json'
const OUT = join(__dirname, 'download-overclock-icons.html')

const d = JSON.parse(readFileSync(NEEDS, 'utf8'))
const existing = new Set(
  readdirSync(join(ROOT, 'public', 'overclock-icons'))
    .filter(f => f.endsWith('.png'))
)
const missing = d.needs.filter(n => !existing.has(n.fileName + '.png'))

// ITEMS: [fileName(kebab), absoluteUrl]
const ITEMS = missing.map(n => [n.fileName, WIKI_HOST + n.src])

// 超频类型背景框（64px，合成时会按效果图标尺寸缩放）
const BACKGROUNDS = [
  ['background-balanced', 'https://deeprockgalactic.wiki.gg/images/thumb/Survivor_OC_Balanced.png/64px-Survivor_OC_Balanced.png?7ed2fe'],
  ['background-unstable', 'https://deeprockgalactic.wiki.gg/images/thumb/Survivor_OC_Unstable.png/64px-Survivor_OC_Unstable.png?f9de19'],
]

const ALL_ITEMS = [...ITEMS, ...BACKGROUNDS]
const itemsJson = JSON.stringify(ALL_ITEMS)

// 在 wiki.gg 页面内执行的脚本（控制台粘贴 / 书签均可）。
// 带页面内进度浮层 + console 日志，fetch 同源携带 cf_clearance cookie。
const bookmarkletBoilerplate = `(function(){
 var P=__ITEMS__;
 if(location.hostname!=='deeprockgalactic.wiki.gg'){alert('请先打开一个 wiki.gg 页面（如 Survivor:Overclocks），再运行本脚本');return;}
 var ov=document.createElement('div');
 ov.style.cssText='position:fixed;left:12px;top:12px;z-index:99999;background:#11151c;color:#cfe;padding:12px 16px;border:2px solid #FF7A1A;border-radius:10px;font:13px/1.5 system-ui,sans-serif;max-width:380px';
 ov.textContent='DRG 图标下载：准备中…';
 document.body.appendChild(ov);
 function set(t){ ov.textContent='DRG 图标下载：'+t; console.log('[DRG]',t); }
 var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
 s.onload=function(){
  set('JSZip 已加载，开始下载 '+P.length+' 个');
  var zip=new JSZip(),n=P.length,d=0,fail=[];
  function step(i){ if(i>=n){ finish(); return; }
   var p=P[i];
   fetch(p[1],{cache:'no-store'}).then(function(r){return r.arrayBuffer();}).then(function(b){
     if(b&&b.byteLength)zip.file(p[0]+'.png',b);else fail.push(p[1]);
   }).catch(function(e){fail.push(p[1]);}).then(function(){d++;set('进度 '+(d)+'/'+n+(fail.length?(' 失败'+fail.length):''));step(i+1);});
  }
  function finish(){
   if(fail.length){ set('完成（失败 '+fail.length+'，见控制台）'); console.warn('[DRG] 失败项:',fail); }
   else set('全部完成，正在下载 ZIP…');
   zip.generateAsync({type:'blob'}).then(function(blob){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='drg-overclock-icons.zip';a.click();set('已触发下载 drg-overclock-icons.zip');});
  }
  step(0);
 };
 s.onerror=function(){ set('JSZip 加载失败，请检查网络'); alert('JSZip 加载失败，请检查网络后重试'); };
 document.head.appendChild(s);
})();`

const bookmarkletJs = bookmarkletBoilerplate.replace('__ITEMS__', itemsJson)
const bookmarkletHref = 'javascript:' + encodeURIComponent(bookmarkletJs)

const html = `<!doctype html>
<html lang="zh">
<head>
<meta charset="utf-8" />
<title>DRG Survivor 超频图标下载器</title>
<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:860px;margin:24px;line-height:1.75}
h2{color:#FF7A1A}h3{margin-top:28px;border-left:4px solid #FF7A1A;padding-left:10px}
button{font-size:15px;padding:10px 18px;cursor:pointer;border:0;border-radius:8px;background:#FF7A1A;color:#1a1300;font-weight:700;margin-right:8px}
button:disabled{opacity:.5;cursor:default}
.bm{display:inline-block;padding:12px 18px;background:#1f6feb;color:#fff;border-radius:8px;font-weight:700;text-decoration:none;font-size:15px}
#log{background:#11151c;color:#cfe;padding:12px;border-radius:8px;height:200px;overflow:auto;font:12px/1.5 ui-monospace,Consolas,monospace;white-space:pre-wrap;margin-top:12px}
.ok{color:#7CFC9A}.bad{color:#FF6B6B}.mut{color:#8aa}
progress{width:100%;height:14px;margin-top:10px}
code{background:#222;padding:2px 6px;border-radius:4px;color:#ffd9a8}
.hl{background:#fff7e6;border:1px solid #ffd591;padding:12px 14px;border-radius:8px}
.warn{background:#fff1f0;border:1px solid #ffa39e;padding:12px 14px;border-radius:8px}
</style>
</head>
<body>
<h2>DRG Survivor · 超频图标下载器</h2>
<p>本次下载包含两部分：
<strong>${missing.length}</strong> 个缺失的<strong>超频特性图标</strong>（内容层）+ <strong>${BACKGROUNDS.length}</strong> 个<strong>类型背景框</strong>（Balanced / Unstable）。
<br>wiki.gg 的完整超频图标 = 背景框 + 特性图标，Agent 拿到 ZIP 后会自动合成 135 张完整图标。
由于 wiki.gg 有 Cloudflare 防护、且本机沙箱无法直连，需要一个<strong>真人浏览器</strong>在能访问 wiki.gg 的网络下获取。
下方<strong>方法一（控制台）最可靠</strong>。</p>

<div class="warn"><b>为什么之前拖书签会跳回本页？</b> Chrome 拖拽 <code>javascript:</code> 链接到书签栏经常不可靠，会把「当前页面」存成书签而非执行代码。
所以这里改用「复制代码 → 粘贴运行」，不再依赖拖拽。</div>

<h3>方法一（推荐）：在 wiki.gg 页面按 F12 控制台粘贴运行</h3>
<div class="hl">
<ol>
<li>浏览器<strong>新标签</strong>打开 <strong>幸存者</strong>页面（通过 Cloudflare 验证）：<br>
  <code>https://deeprockgalactic.wiki.gg/wiki/Survivor:Overclocks</code><br>
  （<code>Survivor:Equipment</code> 等任意 wiki.gg 页面均可，只要同域拿到 cf_clearance cookie。<b>不要开本体的 /wiki/Overclock。</b>）</li>
<li>在本页点下面按钮，<strong>复制执行代码</strong>：<br><br>
  <button id="copyConsole">复制执行代码（控制台用）</button></li>
<li>切到刚才的 <strong>wiki.gg 标签</strong>，按 <code>F12</code> 打开开发者工具 → <strong>Console（控制台）</strong>标签页。</li>
<li>把复制的代码<strong>粘贴到控制台</strong>，按 <code>Enter</code> 运行。</li>
<li>页面左上角会出现进度浮层，约 10–20 秒后自动下载 <code>drg-overclock-icons.zip</code>。
    ZIP 里包含 48 个特性图标和 2 个背景框 <code>background-balanced.png</code> / <code>background-unstable.png</code>。</li>
<li>把 ZIP 解压，<strong>所有 <code>*.png</code></strong> 放进项目目录 <code>public/overclock-icons/</code>，然后告诉 Agent，由 Agent 运行合成脚本生成最终完整图标。</li>
</ol>
</div>

<h3>方法二（备用）：手动建书签</h3>
<p>若你更想用书签，请<strong>手动添加</strong>（不要拖拽，拖拽在 Chrome 会失效）：</p>
<ol>
<li>点下面按钮<strong>复制书签代码</strong>： <button id="copyBm">复制书签代码</button></li>
<li>在书签栏<strong>右键 → 添加网页 / Add page</strong>。</li>
<li>名称填 <code>DRG 图标下载</code>，网址栏<strong>粘贴</strong>刚才复制的内容（以 <code>javascript:</code> 开头）。</li>
<li>打开 wiki.gg 幸存者页面后，点击该书签即可。</li>
</ol>

<h3>方法三（可能失效）：拖拽链接（不推荐）</h3>
<p>部分浏览器拖拽可用，但 Chrome 常失效（会把本页存成书签）。仅当上面两种方式都不行时尝试：</p>
<p><a class="bm" href="${bookmarkletHref}">DRG 图标下载</a></p>

<h3>方法四（几乎必败）：本页跨域一键</h3>
<p class="mut">file:// 页面跨域 fetch 不会携带 cf_clearance cookie，Cloudflare 必拦，通常会 CORS/403 失败。仅作最后尝试，失败请用方法一。</p>
<button id="go">跨域一键下载（尝试）</button> <span id="status" class="mut"></span>
<progress id="bar" value="0" max="${ALL_ITEMS.length}"></progress>
<div id="log"></div>

<script>
const CODE = ${JSON.stringify(bookmarkletJs)};
const BM = ${JSON.stringify(bookmarkletHref)};
const ITEMS = ${itemsJson};

function copyText(t, btn, okMsg){
  const done=()=>{ const o=btn.textContent; btn.textContent=okMsg; setTimeout(()=>btn.textContent=o,1500); };
  if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(done).catch(()=>fallback()); }
  else fallback();
  function fallback(){ const ta=document.createElement('textarea'); ta.value=t; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy');done();}catch(e){alert('复制失败，请手动选中代码复制');} document.body.removeChild(ta); }
}
document.getElementById('copyConsole').addEventListener('click', e=>copyText(CODE, e.target, '已复制，去控制台粘贴'));
document.getElementById('copyBm').addEventListener('click', e=>copyText(BM, e.target, '已复制书签代码'));

const log = (m,c='')=>{const d=document.getElementById('log');const s=document.createElement('div');if(c)s.className=c;s.textContent=m;d.appendChild(s);d.scrollTop=d.scrollHeight;};
const setStatus=t=>document.getElementById('status').textContent=t;

async function grab(url){
  try{ const r=await fetch(url,{cache:'no-store'}); if(r.ok){const b=await r.arrayBuffer(); if(b&&b.byteLength) return b;} }catch(e){}
  try{
    const blob=await new Promise((res,rej)=>{const i=new Image();i.crossOrigin='anonymous';
      i.onload=()=>{try{const c=document.createElement('canvas');c.width=i.naturalWidth;c.height=i.naturalHeight;c.getContext('2d').drawImage(i,0,0);c.toBlob(x=>x?res(x):rej(new Error('tainted')),'image/png');}catch(e){rej(e);}};
      i.onerror=()=>rej(new Error('img')); i.src=url;});
    const b=await blob.arrayBuffer(); if(b&&b.byteLength) return b;
  }catch(e){}
  return null;
}

document.getElementById('go').addEventListener('click', async ()=>{
  if(typeof JSZip==='undefined'){
    const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    s.onload=run; s.onerror=()=>log('JSZip 加载失败','bad'); document.head.appendChild(s);
  } else run();
});

async function run(){
  const btn=document.getElementById('go'); btn.disabled=true; setStatus('准备中…');
  log('开始，共 '+ITEMS.length+' 个（跨域基本会失败，失败请用方法一）','mut');
  const zip=new JSZip(); let ok=0, fail=0; const fails=[];
  for(let i=0;i<ITEMS.length;i++){
    const [name,url]=ITEMS[i];
    const buf=await grab(url);
    if(buf){ zip.file(name+'.png', buf); ok++; log('OK  '+name,'ok'); }
    else { fail++; fails.push(url); log('FAIL '+name,'bad'); }
    document.getElementById('bar').value=i+1;
    setStatus('进度 '+(i+1)+'/'+ITEMS.length+' (成功 '+ok+' 失败 '+fail+')');
  }
  if(fails.length){ zip.file('FAILED_URLS.txt', fails.join('\\n')); log('已把失败项写入 FAILED_URLS.txt','bad'); }
  try{
    const blob=await zip.generateAsync({type:'blob'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='drg-overclock-icons.zip'; a.click();
    log('ZIP 已下载：drg-overclock-icons.zip (成功 '+ok+' / 失败 '+fail+')', ok===ITEMS.length?'ok':'bad');
  }catch(e){ log('打包失败: '+e.message,'bad'); }
  btn.disabled=false;
}
</script>
</body></html>`

writeFileSync(OUT, html)
console.log('items:', ITEMS.length)
console.log('written', OUT)
