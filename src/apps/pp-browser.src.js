/* ============================================================================
 * PP Phone Panel — 浏览器 (pp-browser) 独立源码
 * 版本: 1.0.1
 * 说明: 本文件是权威源码，改代码改这里，然后用 node build.js pp-browser 生成
 *       extension/apps/pp-browser.js。不要直接改打包文件。
 * ============================================================================ */

/* __META_BEGIN__ */
{
  "id": "pp-browser",
  "name": "浏览器",
  "version": "1.0.1",
  "description": "灰度液态玻璃风格的内置浏览器：地址栏搜索、多标签页、书签与历史记录",
  "icon": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/>",
  "enabled": true,
  "settingsTitle": "浏览器设置",
  "settingsFields": [
    {
      "group": "浏览器",
      "key": "searchEngine",
      "type": "select",
      "label": "搜索引擎",
      "default": "bing",
      "options": [
        {
          "v": "bing",
          "l": "Bing"
        },
        {
          "v": "baidu",
          "l": "百度"
        },
        {
          "v": "duckduckgo",
          "l": "DuckDuckGo"
        },
        {
          "v": "google",
          "l": "Google"
        }
      ]
    },
    {
      "group": "浏览器",
      "key": "homeUrl",
      "type": "text",
      "label": "主页地址（留空=空白新标签页）",
      "default": "",
      "placeholder": "https://www.bing.com"
    },
    {
      "group": "历史记录",
      "key": "histEnabled",
      "type": "toggle",
      "label": "记录浏览历史",
      "default": true
    },
    {
      "group": "历史记录",
      "key": "histLimit",
      "type": "number",
      "label": "历史保存上限（条）",
      "default": 200
    }
  ],
  "settingsValues": {}
}
/* __META_END__ */

/* __INJECT_BEGIN__ */
(function(ctx){ return ''; })
/* __INJECT_END__ */

/* __PAGECODE_BEGIN__ */
(function(ctx){
var TOP=window.parent,TOPDOC=TOP.document,sbS=ctx.sbS,cfg=ctx.settings,_W=ctx.save;
var KB='pp-browser-bm',KH='pp-browser-hist';
function _load(k,d){try{var v=TOP.localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
function _store(k,v){try{TOP.localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
var bookmarks=_load(KB,[]),hist=_load(KH,[]);
var ENG={bing:'https://www.bing.com/search?q=',duckduckgo:'https://duckduckgo.com/?q=',baidu:'https://www.baidu.com/s?wd=',google:'https://www.google.com/search?q='};
function _searchUrl(q){return (ENG[cfg.searchEngine]||ENG.bing)+TOP.encodeURIComponent(q);}
function _normUrl(s){s=(s||'').trim();if(!s)return'';if(/^https?:\/\//i.test(s))return s;if(/^[\w\-]+(\.[\w\-]+)+(\/|:|$)/.test(s))return 'https://'+s;return _searchUrl(s);}
function _host(u){try{return u.replace(/^https?:\/\//i,'').split('/')[0];}catch(e){return u;}}
function _now(){var d=new Date();function p(n){return n<10?'0'+n:''+n;}return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes());}
function _addHist(u){if(cfg.histEnabled===false||!u)return;hist.push({u:u,t:_host(u),d:_now()});var lim=parseInt(cfg.histLimit,10);if(!lim||lim<=0)lim=200;if(hist.length>lim)hist=hist.slice(-lim);_store(KH,hist);}

/* ---------- root layout ---------- */
var root=ctx.div('','');
root.style.cssText='display:flex;flex-direction:column;flex:1;min-height:0;gap:6px;padding:8px 10px 10px;';

function mkBtn(svgPath,title,fn){var b=ctx.el('button','ppbtn');b.title=title;b.innerHTML=ctx.svg(svgPath,16);b.style.cssText='flex:0 0 auto;width:auto;padding:6px 9px;display:flex;align-items:center;justify-content:center;';b.onclick=fn;return b;}
var I={back:'<polyline points="15 18 9 12 15 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
fwd:'<polyline points="9 18 15 12 9 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
reload:'<path d="M21 12a9 9 0 1 1-2.6-6.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="21 3 21 9 15 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
home:'<path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
star:'<polygon points="12 2 15 9 22 9.3 16.5 14 18.2 21.2 12 17.3 5.8 21.2 7.5 14 2 9.3 9 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
book:'<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
clock:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="12 7 12 12 15.5 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
plus:'<line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
go:'<line x1="4" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="13 6 19 12 13 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
x:'<line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
trash:'<polyline points="3 6 5 6 21 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'};

/* ---------- tab strip ---------- */
var tabBar=ctx.div('','');
tabBar.style.cssText='display:flex;align-items:center;gap:6px;flex:0 0 auto;overflow-x:auto;padding:2px 0;';
/* ---------- toolbar ---------- */
var bar=ctx.div('','');
bar.style.cssText='display:flex;align-items:center;gap:6px;flex:0 0 auto;';
var addr=ctx.el('input','ppinp');
addr.placeholder='输入网址或搜索…';
addr.style.cssText='flex:1;min-width:0;';
addr.onkeydown=function(e){if(e.key==='Enter'){go(addr.value);}};
/* ---------- content ---------- */
var content=ctx.div('','');
content.style.cssText='flex:1;min-height:0;position:relative;border-radius:14px;overflow:hidden;';

var tabs=[],cur=-1,view='web';

function _startPage(){
var sp=ctx.div('','');
sp.style.cssText='position:absolute;inset:0;overflow-y:auto;padding:10px;';
var card=ctx.div('ppcard','');
var h=ctx.div('ppsec','新标签页');card.appendChild(h);
var tip=ctx.div('','在上方地址栏输入网址或关键词开始浏览。部分网站（如 Google、X）禁止被内嵌，无法在此打开，属网站自身限制。');
tip.style.cssText='font-size:12px;opacity:.65;padding:4px 10px 10px;line-height:1.6;';
card.appendChild(tip);sp.appendChild(card);
if(bookmarks.length){var bc=ctx.div('ppcard','');bc.appendChild(ctx.div('ppsec','书签'));
bookmarks.forEach(function(bm){var r=ctx.div('pprow tap','');r.appendChild(ctx.div('pprt',bm.t||_host(bm.u)));r.appendChild(ctx.div('pprs',bm.u));r.onclick=function(){go(bm.u);};bc.appendChild(r);});
sp.appendChild(bc);}
return sp;}

function newTab(url){var t={url:'',title:'新标签页',back:[],fwd:[],frame:null,start:null};tabs.push(t);cur=tabs.length-1;if(url)_navigate(t,url,false);render();}
function closeTab(i){var t=tabs[i];if(t.frame&&t.frame.parentNode)t.frame.parentNode.removeChild(t.frame);if(t.start&&t.start.parentNode)t.start.parentNode.removeChild(t.start);tabs.splice(i,1);if(!tabs.length){newTab('');return;}if(cur>=tabs.length)cur=tabs.length-1;render();}

function _ensureFrame(t){if(t.frame)return t.frame;var f=TOPDOC.createElement('iframe');f.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff;display:none;';f.setAttribute('allow','fullscreen');content.appendChild(f);t.frame=f;return f;}
function _navigate(t,url,isHist){if(!url)return;if(t.url&&!isHist){t.back.push(t.url);t.fwd=[];}t.url=url;t.title=_host(url);_ensureFrame(t).src=url;if(!isHist)_addHist(url);render();}
function go(input){var u=_normUrl(input);if(!u)return;view='web';if(cur<0)newTab('');_navigate(tabs[cur],u,false);}

function _goBack(){var t=tabs[cur];if(!t||!t.back.length)return;t.fwd.push(t.url);var u=t.back.pop();t.url=u;t.title=_host(u);_ensureFrame(t).src=u;render();}
function _goFwd(){var t=tabs[cur];if(!t||!t.fwd.length)return;t.back.push(t.url);var u=t.fwd.pop();t.url=u;t.title=_host(u);_ensureFrame(t).src=u;render();}
function _reload(){var t=tabs[cur];if(t&&t.url&&t.frame){try{t.frame.src=t.url;}catch(e){}}}
function _goHome(){var h=(cfg.homeUrl||'').trim();if(h){go(h);}else{var t=tabs[cur];if(t){if(t.frame)t.frame.style.display='none';t.url='';t.title='新标签页';t.back=[];t.fwd=[];render();}}}
function _addBm(){var t=tabs[cur];if(!t||!t.url){ctx.toast('当前没有可收藏的页面');return;}
for(var i=0;i<bookmarks.length;i++){if(bookmarks[i].u===t.url){ctx.toast('已在书签中');return;}}
bookmarks.push({u:t.url,t:t.title,d:_now()});_store(KB,bookmarks);ctx.toast('已加入书签');}

/* ---------- bookmark / history pages ---------- */
var pageWrap=ctx.div('','');
pageWrap.style.cssText='position:absolute;inset:0;overflow-y:auto;padding:10px;display:none;';
content.appendChild(pageWrap);

function _renderList(){
pageWrap.innerHTML='';
var isBm=(view==='bm');
var card=ctx.div('ppcard','');
var head=ctx.div('','');head.style.cssText='display:flex;align-items:center;justify-content:space-between;padding-right:8px;';
head.appendChild(ctx.div('ppsec',isBm?'书签':'历史记录'));
var clr=ctx.el('button','ppbtn del');clr.innerHTML=ctx.svg(I.trash,14);clr.style.cssText='width:auto;padding:4px 10px;flex:0 0 auto;';
clr.onclick=function(){if(isBm){bookmarks=[];_store(KB,bookmarks);}else{hist=[];_store(KH,hist);}ctx.toast('已清空');_renderList();};
head.appendChild(clr);card.appendChild(head);
var list=isBm?bookmarks.slice():hist.slice().reverse();
if(!list.length){var e=ctx.div('','暂无内容');e.style.cssText='padding:14px;text-align:center;opacity:.5;font-size:13px;';card.appendChild(e);}
list.forEach(function(it,idx){
var r=ctx.div('pprow tap','');
var main=ctx.div('','');main.style.cssText='flex:1;min-width:0;overflow:hidden;';
main.appendChild(ctx.div('pprt',(it.t||_host(it.u))+(it.d?' <span style="opacity:.45;font-size:11px;font-weight:400;">'+it.d+'</span>':'')));
var sub=ctx.div('pprs',it.u);sub.style.cssText='white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
main.appendChild(sub);r.appendChild(main);
var del=ctx.el('button','');del.innerHTML=ctx.svg(I.x,13);
del.style.cssText='flex:0 0 auto;background:none;border:0;color:inherit;opacity:.5;cursor:pointer;padding:6px;';
del.onclick=function(ev){ev.stopPropagation();if(isBm){bookmarks=bookmarks.filter(function(b){return b!==it;});_store(KB,bookmarks);}else{hist=hist.filter(function(h){return h!==it;});_store(KH,hist);}_renderList();};
r.appendChild(del);
r.onclick=function(){go(it.u);};
card.appendChild(r);});
pageWrap.appendChild(card);}

/* ---------- render ---------- */
function render(){
tabBar.innerHTML='';
tabs.forEach(function(t,i){
var tb=ctx.div('ppcard','');
tb.style.cssText='flex:0 0 auto;display:flex;align-items:center;gap:6px;padding:5px 8px 5px 12px;margin:0;cursor:pointer;font-size:12px;max-width:160px;'+(i===cur?'':'opacity:.55;');
var lbl=ctx.el('span','',t.title||'新标签页');lbl.style.cssText='overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
tb.appendChild(lbl);
var xb=ctx.el('button','');xb.innerHTML=ctx.svg(I.x,11);xb.style.cssText='background:none;border:0;color:inherit;opacity:.6;cursor:pointer;padding:2px;flex:0 0 auto;';
xb.onclick=function(ev){ev.stopPropagation();closeTab(i);};
tb.appendChild(xb);
tb.onclick=function(){cur=i;view='web';render();};
tabBar.appendChild(tb);});
var nt=mkBtn(I.plus,'新标签页',function(){view='web';newTab('');});
tabBar.appendChild(nt);
var t=tabs[cur];
addr.value=t?t.url:'';
tabs.forEach(function(tt,i){
if(tt.frame)tt.frame.style.display=(view==='web'&&i===cur&&tt.url)?'block':'none';
if(tt.start&&tt.start.parentNode)tt.start.parentNode.removeChild(tt.start);tt.start=null;});
if(view==='web'){pageWrap.style.display='none';
if(t&&!t.url){t.start=_startPage();content.appendChild(t.start);}}
else{pageWrap.style.display='block';_renderList();}}

bar.appendChild(mkBtn(I.back,'后退',_goBack));
bar.appendChild(mkBtn(I.fwd,'前进',_goFwd));
bar.appendChild(mkBtn(I.reload,'刷新',_reload));
bar.appendChild(mkBtn(I.home,'主页',_goHome));
bar.appendChild(addr);
bar.appendChild(mkBtn(I.go,'前往',function(){go(addr.value);}));
bar.appendChild(mkBtn(I.star,'加入书签',_addBm));
bar.appendChild(mkBtn(I.book,'书签',function(){view=(view==='bm')?'web':'bm';render();}));
bar.appendChild(mkBtn(I.clock,'历史记录',function(){view=(view==='hist')?'web':'hist';render();}));

root.appendChild(tabBar);
root.appendChild(bar);
root.appendChild(content);
newTab((cfg.homeUrl||'').trim()||'');
return root;
})
/* __PAGECODE_END__ */

/* __POST_BEGIN__ */
{
  "injectEnabled": false,
  "ppPlugin": true
}
/* __POST_END__ */
