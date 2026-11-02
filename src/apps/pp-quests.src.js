/* ============================================================================
 * PP Phone Panel — 中介所 (pp-quests) 独立源码
 * 版本: 1.1.0
 * 说明: 本文件是权威源码，改代码改这里，然后用 node build.js pp-quests 生成
 *       extension/apps/pp-quests.js。不要直接改打包文件。
 * ============================================================================ */

/* __META_BEGIN__ */
{
  "id": "pp-quests",
  "name": "中介所",
  "version": "1.1.0",
  "description": "根据当前剧情生成NPC委托任务与世界新闻：接受/拒绝、地图坐标、提交AI审核结算 only 报酬（共享钱包），可勾选注入酒馆",
  "icon": "<path d=\"M9 11l3 3 8-8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>",
  "enabled": true,
  "settingsTitle": "中介所设置",
  "settingsFields": [
    {
      "group": "生成",
      "key": "genCount",
      "type": "number",
      "label": "一次生成任务数（{{生成数量}}）",
      "default": 4
    },
    {
      "group": "生成",
      "key": "newsCount",
      "type": "number",
      "label": "一次生成新闻数（{{新闻数量}}）",
      "default": 3
    },
    {
      "group": "生成",
      "key": "histN",
      "type": "number",
      "label": "生成时注入酒馆历史条数（0=不注入）",
      "default": 20
    },
    {
      "group": "生成",
      "key": "genPrompt",
      "type": "textarea-presets",
      "rows": 10,
      "label": "任务生成提示词 <button onclick=\"typeof window._vnmqPreview==='function'?window._vnmqPreview('genPrompt'):void 0\" style=\"margin-left:6px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07);color:inherit;border-radius:8px;padding:2px 10px;font-size:11px;cursor:pointer;\">预览</button><button onclick=\"typeof window._vnmqPresets==='function'?window._vnmqPresets('genPrompt'):void 0\" style=\"margin-left:4px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07);color:inherit;border-radius:8px;padding:2px 10px;font-size:11px;cursor:pointer;\">预设</button><span style=\"display:block;font-size:10px;opacity:.45;font-weight:400;\">（预览/预设需先打开过一次本App）</span>",
      "default": "你是一个名为「中介所」的第三方任务发布平台的幕后系统。平台向市民发布NPC委托任务，并播报世界新闻。请基于以下世界观与当前剧情生成内容。\n\n【世界书】\n{{世界书}}\n\n【主要角色】{{角色名称}}：{{角色设定}}\n【用户】{{用户名称}}：{{用户设定}}\n【当前时间】{{当前时间}}\n\n【最近剧情】\n{{酒馆历史}}\n\n【Horae总结】\n{{Horae总结}}\n\n要求：\n1. 生成{{生成数量}}个任务。任务必须与主线剧情或世界观相关、有趣、让人有探索欲，每个任务都埋一个钩子（hook），可能引出意外的故事线。不是所有任务都需要见到委托人，很多是发布后自行完成再提交的第三方委托。\n2. 生成{{新闻数量}}条符合世界观、能勾起兴趣的世界新闻短讯。\n3. 报酬货币为 only。base为基础工资，extra为额外报酬，数额与任务难度匹配。\n4. 每个任务给一个地图位置 x,y（0~100 的整数，代表城市地图上的百分比坐标，请分散开）和该区域的名称。\n5. 只输出严格 JSON，不要输出任何其他文字，格式：\n{\"news\":[{\"t\":\"标题\",\"d\":\"一句话内容\"}],\"quests\":[{\"title\":\"任务名\",\"npc\":\"委托人\",\"desc\":\"任务描述\",\"hook\":\"隐藏钩子/可能的意外发展\",\"base\":100,\"extra\":150,\"x\":62,\"y\":35,\"region\":\"区域名\"}]}",
      "variables": [
        "{{角色名称}}",
        "{{角色设定}}",
        "{{用户名称}}",
        "{{用户设定}}",
        "{{世界书}}",
        "{{当前时间}}",
        "{{酒馆历史}}",
        "{{Horae总结}}",
        "{{生成数量}}",
        "{{新闻数量}}"
      ]
    },
    {
      "group": "审核",
      "key": "reviewHistN",
      "type": "number",
      "label": "审核时读取酒馆历史条数",
      "default": 30
    },
    {
      "group": "审核",
      "key": "reviewPrompt",
      "type": "textarea-presets",
      "rows": 8,
      "label": "任务审核提示词 <button onclick=\"typeof window._vnmqPreview==='function'?window._vnmqPreview('reviewPrompt'):void 0\" style=\"margin-left:6px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07);color:inherit;border-radius:8px;padding:2px 10px;font-size:11px;cursor:pointer;\">预览</button><button onclick=\"typeof window._vnmqPresets==='function'?window._vnmqPresets('reviewPrompt'):void 0\" style=\"margin-left:4px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07);color:inherit;border-radius:8px;padding:2px 10px;font-size:11px;cursor:pointer;\">预设</button><span style=\"display:block;font-size:10px;opacity:.45;font-weight:400;\">（预览/预设需先打开过一次本App）</span>",
      "default": "你是任务平台「中介所」的审核系统。以下是用户提交审核的任务列表，以及最近的剧情记录。请逐一判断每个任务在剧情中是否已实际完成（done为true或false），并给一句话审核意见。如果剧情中没有明确证据，判定为未完成。\n\n【待审任务】\n{{待审任务列表}}\n\n【最近剧情】\n{{酒馆历史}}\n\n只输出严格 JSON，不要输出任何其他文字：\n{\"results\":[{\"i\":1,\"done\":true,\"comment\":\"一句话审核意见\"}]}\ni 为任务序号（从1开始），与待审任务列表一一对应。",
      "variables": [
        "{{待审任务列表}}",
        "{{酒馆历史}}",
        "{{当前时间}}",
        "{{用户名称}}",
        "{{用户设定}}"
      ]
    },
    {
      "group": "注入",
      "key": "injectTemplate",
      "type": "textarea",
      "rows": 4,
      "label": "注入前缀模板（含 {{已选注入内容}} 占位符）",
      "default": "以下是用户通过「中介所」平台获取的信息，剧情中的角色与世界应当对这些事实有认知：\n{{已选注入内容}}"
    },
    {
      "group": "钱包",
      "key": "startBalance",
      "type": "number",
      "label": "初始余额（only，仅首次安装生效）",
      "default": 0
    },
    {
      "group": "覆盖 API",
      "key": "useOwnApi",
      "type": "toggle",
      "label": "使用独立 API（默认用主设置 API）",
      "default": false
    },
    {
      "group": "覆盖 API",
      "key": "ownApiUrl",
      "type": "text",
      "label": "独立 API 地址",
      "default": "",
      "placeholder": "https://.../v1"
    },
    {
      "group": "覆盖 API",
      "key": "ownApiKey",
      "type": "password",
      "label": "独立 API Key",
      "default": ""
    },
    {
      "group": "覆盖 API",
      "key": "useOwnModel",
      "type": "toggle",
      "label": "使用独立模型名",
      "default": false
    },
    {
      "group": "覆盖 API",
      "key": "ownModel",
      "type": "text",
      "label": "独立模型名",
      "default": ""
    }
  ],
  "settingsValues": {}
}
/* __META_END__ */

/* __INJECT_BEGIN__ */
(function(ctx){
try{
var TOP=window.parent;
var st=JSON.parse(TOP.localStorage.getItem('pp-quests-state')||'{}');
var parts=[];
(st.quests||[]).forEach(function(q){if(q.inj&&q.status==='active')parts.push('【'+( (ctx.settings&&ctx.settings.platformName)||'中介所')+'已接任务】'+q.title+(q.npc?'（委托人:'+q.npc+'）':'')+'：'+q.desc);});
(st.news||[]).forEach(function(n){if(n.inj)parts.push('【世界新闻】'+n.t+'：'+n.d);});
if(!parts.length)return '';
var tpl=(ctx.settings&&ctx.settings.injectTemplate)||'';
var body=parts.join('\n');
if(tpl&&tpl.indexOf('{{已选注入内容}}')>=0)return tpl.split('{{已选注入内容}}').join(body);
return (tpl?tpl+'\n':'')+body;
}catch(e){return '';}
})
/* __INJECT_END__ */

/* __PAGECODE_BEGIN__ */
(function(ctx){
var TOP=window.parent,TOPDOC=TOP.document,sbS=ctx.sbS,cfg=ctx.settings,_W=ctx.save;
var KS='pp-quests-state',KP='pp-quests-presets',KW='pp-currency-only';

/* ---------- storage ----------
   st.quests: [{id,title,npc,desc,hook,base,extra,x,y,region,status,inj,payText,comment}]
     status: 'offered'(大厅未处理,持续保存) | 'active'(已接受) | 'done'(已结算)
     拒绝/放弃/删除 = 从数组移除
   st.news:  [{t,d,inj}] 最新在前，上限12条
   st.lastRaw: 最近一次AI原始返回（生成）
   st.lastReview: {total, lines:[], time} 最近一次审核结果（渲染在"已完成"页顶部）
*/
function _load(k,d){try{var v=TOP.localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
function _store(k,v){try{TOP.localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
var st=_load(KS,{quests:[],news:[],seq:1});
if(!st.quests)st.quests=[];if(!st.news)st.news=[];if(!st.seq)st.seq=1;
function _save(){_store(KS,st);}

/* ---------- shared wallet ---------- */
function _getBal(){var v=parseFloat(TOP.localStorage.getItem(KW));return isNaN(v)?0:v;}
function _setBal(n){try{TOP.localStorage.setItem(KW,String(Math.round(n*100)/100));}catch(e){}}
if(TOP.localStorage.getItem(KW)===null){_setBal(parseFloat(cfg.startBalance)||0);}

/* ---------- data helpers ---------- */
function _stCtx(){try{return TOP.SillyTavern&&TOP.SillyTavern.getContext&&TOP.SillyTavern.getContext();}catch(e){return null;}}
function _mainChar(){var ids=sbS.activeCharIds||[];var cs=sbS.characters||[];for(var i=0;i<cs.length;i++){if(ids.indexOf(cs[i].id)>=0)return cs[i];}return cs[0]||{name:'',persona:''};}
function _wbText(){try{var ac=sbS.wbActive||[];return (sbS.wbEntries||[]).filter(function(e){return ac.indexOf(e.id)>=0&&e.content;}).map(function(e){return '《'+e.name+'》\n'+e.content;}).join('\n\n');}catch(e){return'';}}
function _stHistory(n){try{if(!n||n<=0)return'';var c=_stCtx();var chat=c&&c.chat;if(!chat||!chat.length)return'';var uN=(sbS.user&&sbS.user.name)||(c&&c.name1)||'用户';var cN=(c&&c.name2)||_mainChar().name||'角色';
var recent=chat.filter(function(m){return !m.is_system;}).slice(-n);
return recent.map(function(m){var t=(m.mes||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();return t?((m.is_user?uN:cN)+': '+t):null;}).filter(Boolean).join('\n');}catch(e){return'';}}
function _horae(){try{var H=TOP.Horae;if(!H||!H.getLatestState)return'';var s=H.getLatestState();if(!s)return'';var p=[];
if(s.timestamp)p.push('时间:'+(s.timestamp.story_date||'')+' '+(s.timestamp.story_time||''));
if(s.scene)p.push('地点:'+(s.scene.location||'')+' 氛围:'+(s.scene.atmosphere||'')+' 在场:'+((s.scene.characters_present||[]).join(',')));
try{var ev=H.getEvents&&H.getEvents(0,'all');if(ev&&ev.length)p.push('事件:'+ev.slice(-8).map(function(x){return x.event&&x.event.summary;}).filter(Boolean).join('；'));}catch(e2){}
return p.join('\n');}catch(e){return'';}}
function _vars(){var ch=_mainChar();var c=_stCtx();
return{'角色名称':ch.name||'','角色设定':ch.persona||'','用户名称':(sbS.user&&sbS.user.name)||(c&&c.name1)||'用户','用户设定':(sbS.user&&sbS.user.persona)||'','世界书':_wbText(),'当前时间':new Date().toLocaleString('zh-CN'),'酒馆历史':_stHistory(parseInt(cfg.histN,10)||20),'Horae总结':_horae(),'生成数量':String(parseInt(cfg.genCount,10)||4),'新闻数量':String(parseInt(cfg.newsCount,10)||3)};}
function _fill(tpl,extra){var m=_vars();var k;if(extra)for(k in extra)m[k]=extra[k];var out=tpl||'';for(k in m){out=out.split('{{'+k+'}}').join(m[k]);}return out;}

/* ---------- API ---------- */
function _apiUrl(){return (cfg.useOwnApi&&cfg.ownApiUrl)||sbS.apiUrl||'';}
function _apiKey(){return (cfg.useOwnApi&&cfg.ownApiKey)||sbS.apiKey||'';}
function _model(){return (cfg.useOwnApi&&cfg.useOwnModel&&cfg.ownModel)||sbS.model||'';}
function _chat(prompt,onText,onErr){var base=(_apiUrl()||'').replace(/\/chat\/completions\/?$/,'').replace(/\/+$/,'');
if(!base){onErr('API地址未设置（主设置或本App覆盖API）');return;}
var hdrs={'Content-Type':'application/json'};var k=_apiKey();if(k)hdrs['Authorization']='Bearer '+k;
TOP.fetch(base+'/chat/completions',{method:'POST',headers:hdrs,body:JSON.stringify({model:_model(),messages:[{role:'user',content:prompt}],max_tokens:2000,temperature:0.9})})
.then(function(r){if(!r.ok){onErr('HTTP '+r.status);return Promise.reject(null);}return r.json();})
.then(function(d){if(!d)return;var t=d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content;t?onText(t.trim()):onErr('返回空内容');})
.catch(function(e){if(e)onErr(e.message||'请求失败');});}
function _parseJSON(t){try{t=(t||'').replace(/```json/gi,'').replace(/```/g,'');var a=t.indexOf('{'),b=t.lastIndexOf('}');if(a<0||b<=a)return null;return JSON.parse(t.slice(a,b+1));}catch(e){return null;}}

/* ---------- css ---------- */
(function(){var old=TOPDOC.getElementById('vnmq-css');if(old)old.remove();var s=TOPDOC.createElement('style');s.id='vnmq-css';
s.textContent='@keyframes vnmqPulse{0%,100%{box-shadow:0 0 3px rgba(255,255,255,.4),0 0 8px rgba(255,255,255,.18);}50%{box-shadow:0 0 6px rgba(255,255,255,.8),0 0 18px rgba(255,255,255,.4);}}'
+'.vnmq-seg{display:flex;gap:4px;padding:4px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);backdrop-filter:blur(14px);flex:0 0 auto;}'
+'.vnmq-seg button{flex:1;border:0;background:transparent;color:rgba(255,255,255,.55);font-size:12px;padding:6px 2px;border-radius:10px;cursor:pointer;transition:all .2s;white-space:nowrap;}'
+'.vnmq-seg button.on{background:rgba(255,255,255,.13);color:rgba(255,255,255,.95);box-shadow:0 1px 6px rgba(0,0,0,.25);}'
+'.vnmq-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:999px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);font-size:12px;color:rgba(255,255,255,.85);backdrop-filter:blur(10px);}'
+'.vnmq-widget{position:relative;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,.10);background:linear-gradient(160deg,rgba(255,255,255,.06),rgba(255,255,255,.02));backdrop-filter:blur(18px);box-shadow:inset 0 1px 0 rgba(255,255,255,.10),0 8px 24px rgba(0,0,0,.25);}'
+'.vnmq-field{position:relative;height:148px;background:repeating-linear-gradient(0deg,transparent,transparent 23px,rgba(255,255,255,.045) 24px),repeating-linear-gradient(90deg,transparent,transparent 23px,rgba(255,255,255,.045) 24px);}'
+'.vnmq-field:after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,transparent 40%,rgba(0,0,0,.22) 100%);pointer-events:none;}'
+'.vnmq-dot{position:absolute;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:rgba(255,255,255,.85);cursor:pointer;animation:vnmqPulse 2.2s ease-in-out infinite;z-index:2;transition:transform .2s;}'
+'.vnmq-dot:hover{transform:scale(1.35);}'
+'.vnmq-dot.dim{background:rgba(255,255,255,.4);animation:none;box-shadow:0 0 5px rgba(255,255,255,.2);}'
+'.vnmq-dot.sel{transform:scale(1.5);outline:4px solid rgba(255,255,255,.18);outline-offset:2px;}'
+'.vnmq-winfo{padding:10px 14px;border-top:1px solid rgba(255,255,255,.08);font-size:12px;color:rgba(255,255,255,.85);min-height:38px;display:flex;align-items:center;gap:10px;}'
+'.vnmq-rlabel{position:absolute;transform:translate(-50%,8px);font-size:9px;color:rgba(255,255,255,.65);letter-spacing:.5px;white-space:nowrap;pointer-events:none;z-index:1;text-shadow:0 1px 4px rgba(0,0,0,.6);}'
+'.vnmq-ticker{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:11px;opacity:.7;padding:5px 12px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);cursor:pointer;flex:0 0 auto;}'
+'.vnmq-modal{position:absolute;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.45);backdrop-filter:blur(6px);}'
+'.vnmq-mcard{width:min(560px,92%);max-height:80%;display:flex;flex-direction:column;border-radius:18px;background:rgba(28,28,34,.85);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(24px);box-shadow:0 18px 50px rgba(0,0,0,.5);color:rgba(255,255,255,.9);overflow:hidden;}'
+'.vnmq-mhead{padding:13px 16px;font-size:14px;font-weight:600;border-bottom:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center;}'
+'.vnmq-mbody{padding:12px 16px;overflow-y:auto;font-size:12px;line-height:1.7;white-space:pre-wrap;word-break:break-all;}'
+'.vnmq-mbtn{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:rgba(255,255,255,.9);border-radius:10px;padding:5px 14px;font-size:12px;cursor:pointer;}';
TOPDOC.head.appendChild(s);})();

/* ---------- in-panel modal：仅用于设置页的"预览/预设"。
   挂载到全屏元素内部（fullscreenElement），不会把用户弹出全屏。
   App 页面流程一律不使用弹窗，AI 返回全部渲染进界面。 ---------- */
function _host(){return TOPDOC.fullscreenElement||TOPDOC.body;}
function _modal(title,bodyEl){var ov=TOPDOC.createElement('div');ov.className='vnmq-modal';
var card=TOPDOC.createElement('div');card.className='vnmq-mcard';
var head=TOPDOC.createElement('div');head.className='vnmq-mhead';head.textContent=title;
var x=TOPDOC.createElement('button');x.className='vnmq-mbtn';x.textContent='关闭';x.onclick=function(){ov.remove();};
head.appendChild(x);card.appendChild(head);
var body=TOPDOC.createElement('div');body.className='vnmq-mbody';
if(typeof bodyEl==='string'){body.textContent=bodyEl;}else if(bodyEl){body.appendChild(bodyEl);}
card.appendChild(body);
ov.onclick=function(e){if(e.target===ov)ov.remove();};
card.onclick=function(e){e.stopPropagation();};
ov.appendChild(card);_host().appendChild(ov);return ov;}

/* ---------- settings-page helpers ---------- */
TOP._vnmqPreview=function(key){var tpl=cfg[key]||'';var extra=null;
if(key==='reviewPrompt'){extra={'待审任务列表':'1. 示例任务（运行时替换为你勾选提交的任务）','酒馆历史':_stHistory(parseInt(cfg.reviewHistN,10)||30)};}
_modal('提示词预览（实际发送内容）',_fill(tpl,extra));};
TOP._vnmqPresets=function(key){var ps=_load(KP,{});ps[key]=ps[key]||{};
var box=TOPDOC.createElement('div');
var row=TOPDOC.createElement('div');row.style.cssText='display:flex;gap:8px;margin-bottom:12px;';
var inp=TOPDOC.createElement('input');inp.placeholder='预设名称';inp.style.cssText='flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:10px;color:rgba(255,255,255,.9);padding:6px 10px;font-size:12px;outline:none;';
var sv=TOPDOC.createElement('button');sv.className='vnmq-mbtn';sv.textContent='保存当前为预设';
row.appendChild(inp);row.appendChild(sv);box.appendChild(row);
var list=TOPDOC.createElement('div');box.appendChild(list);
function draw(){list.innerHTML='';var names=Object.keys(ps[key]);
if(!names.length){var e=TOPDOC.createElement('div');e.textContent='暂无预设';e.style.cssText='opacity:.5;text-align:center;padding:10px;';list.appendChild(e);}
names.forEach(function(n){var r=TOPDOC.createElement('div');r.style.cssText='display:flex;align-items:center;gap:8px;padding:7px 4px;border-bottom:1px solid rgba(255,255,255,.06);';
var lb=TOPDOC.createElement('div');lb.textContent=n;lb.style.cssText='flex:1;font-size:13px;';r.appendChild(lb);
var ap=TOPDOC.createElement('button');ap.className='vnmq-mbtn';ap.textContent='应用';
ap.onclick=function(){cfg[key]=ps[key][n];_W();ctx.toast('已应用预设「'+n+'」（重新打开设置页可见）');};
var dl=TOPDOC.createElement('button');dl.className='vnmq-mbtn';dl.textContent='删除';
dl.onclick=function(){delete ps[key][n];_store(KP,ps);draw();};
r.appendChild(ap);r.appendChild(dl);list.appendChild(r);});}
sv.onclick=function(){var n=(inp.value||'').trim();if(!n){ctx.toast('请输入预设名称');return;}ps[key][n]=cfg[key]||'';_store(KP,ps);inp.value='';draw();ctx.toast('已保存');};
draw();_modal('提示词预设管理',box);};

/* ---------- root ---------- */
var root=ctx.div('','');
root.style.cssText='display:flex;flex-direction:column;flex:1;min-height:0;gap:8px;padding:8px 10px 10px;';
var head=ctx.div('','');head.style.cssText='display:flex;align-items:center;gap:8px;flex:0 0 auto;';
var balChip=ctx.div('vnmq-chip','');
var genBtn=ctx.el('button','ppbtn');genBtn.style.cssText='flex:0 0 auto;width:auto;padding:6px 14px;font-size:12px;';
genBtn.textContent='⟳ 刷新委托';
head.appendChild(balChip);
var spc=ctx.div('','');spc.style.cssText='flex:1;';head.appendChild(spc);
head.appendChild(genBtn);
var ticker=ctx.div('vnmq-ticker','');
var seg=ctx.div('vnmq-seg','');
var body=ctx.div('','');body.style.cssText='flex:1;min-height:0;overflow-y:auto;';
root.appendChild(head);root.appendChild(ticker);root.appendChild(seg);root.appendChild(body);

var TABS=[['hall','大厅'],['active','进行中'],['done','已完成'],['news','新闻']];
var tab='hall',selQid=null,showRaw=false;
TABS.forEach(function(t){var b=ctx.el('button','',t[1]);b.onclick=function(){tab=t[0];render();};seg.appendChild(b);b._k=t[0];});

function _count(s){return st.quests.filter(function(q){return q.status===s;}).length;}
function _badge(){var i;for(i=0;i<seg.children.length;i++){var b=seg.children[i];var k=b._k;
var lbl={hall:'大厅',active:'进行中',done:'已完成',news:'新闻'}[k];
if(k==='hall'&&_count('offered'))lbl+=' '+_count('offered');
if(k==='active'&&_count('active'))lbl+=' '+_count('active');
b.textContent=lbl;b.className=(k===tab)?'on':'';}}

/* ---------- 地图小组件（iOS widget 风格，嵌在大厅顶部） ----------
   光点位置 = AI 给的 x,y（0~100 百分比）。点光点 → 组件下方信息条
   显示 区域·任务·状态，再点"查看"滚动到对应任务卡。 */
function _mapWidget(){
var live=st.quests.filter(function(q){return q.status==='offered'||q.status==='active';});
var w=ctx.div('vnmq-widget','');
var field=ctx.div('vnmq-field','');
live.forEach(function(q){
var px=Math.max(6,Math.min(94,(typeof q.x==='number'?q.x:50)));
var py=Math.max(8,Math.min(88,(typeof q.y==='number'?q.y:50)));
var dot=ctx.div('vnmq-dot'+(q.status==='active'?' dim':'')+(selQid===q.id?' sel':''),'');
dot.style.left=px+'%';dot.style.top=py+'%';
dot.title=q.region||'';
dot.onclick=function(){selQid=(selQid===q.id)?null:q.id;render();};
field.appendChild(dot);
if(selQid===q.id&&q.region){var lab=ctx.div('vnmq-rlabel',q.region);lab.style.left=px+'%';lab.style.top=py+'%';field.appendChild(lab);}});
if(!live.length){var hint=ctx.div('','　');hint.style.cssText='position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:11px;color:rgba(255,255,255,.35);';hint.textContent='暂无活动信号 — 刷新委托后这里会亮起光点';field.appendChild(hint);}
w.appendChild(field);
var info=ctx.div('vnmq-winfo','');
var sq=null,i;for(i=0;i<live.length;i++){if(live[i].id===selQid){sq=live[i];break;}}
if(sq){
var tx=ctx.div('','');tx.style.cssText='flex:1;min-width:0;overflow:hidden;';
tx.innerHTML='<b>'+(sq.region||'未知区域')+'</b> · '+sq.title+' <span style="opacity:.5;font-size:10px;">'+(sq.status==='active'?'进行中':'可接取')+(sq.npc?' · 委托人 '+sq.npc:'')+'</span>';
info.appendChild(tx);
var go2=ctx.el('button','vnmq-mbtn','查看');
go2.onclick=function(){tab=(sq.status==='offered')?'hall':'active';render();
TOP.setTimeout(function(){var el=body.querySelector('[data-qid="'+sq.id+'"]');if(el)el.scrollIntoView({behavior:'smooth',block:'center'});},60);};
info.appendChild(go2);}
else{var ph=ctx.div('',live.length?('侦测到 '+live.length+' 个活动信号 — 点击光点查看'):'城市网格 · 信号监测');
ph.style.cssText='opacity:.5;';info.appendChild(ph);}
w.appendChild(info);
return w;}

/* ---------- 卡片 ---------- */
function _rewardLine(q){return '基础工资 '+(q.base||0)+' only ＋ 额外报酬 '+(q.extra||0)+' only';}
function _check(label,val,fn){var w=ctx.el('label','');w.style.cssText='display:inline-flex;align-items:center;gap:5px;font-size:11px;opacity:.85;cursor:pointer;';
var i=TOPDOC.createElement('input');i.type='checkbox';i.checked=!!val;i.style.cssText='accent-color:#ddd;';
i.onchange=function(){fn(i.checked);};w.appendChild(i);w.appendChild(TOPDOC.createTextNode(label));return w;}
function _empty(t){var e=ctx.div('ppcard','');e.style.cssText='padding:26px;text-align:center;opacity:.5;font-size:12px;';e.textContent=t;return e;}
function _qCard(q,mode){
var c=ctx.div('ppcard','');c.style.cssText='padding:11px 13px;';c.setAttribute('data-qid',q.id);
var top=ctx.div('','');top.style.cssText='display:flex;align-items:center;gap:8px;';
var ti=ctx.div('',q.title||'');ti.style.cssText='font-size:14px;font-weight:600;flex:1;';
top.appendChild(ti);
if(q.region){var chip=ctx.div('vnmq-chip',q.region);chip.style.cssText+='font-size:10px;padding:2px 8px;cursor:pointer;';
chip.onclick=function(){selQid=q.id;tab='hall';render();
TOP.setTimeout(function(){body.scrollTop=0;},30);};
top.appendChild(chip);}
c.appendChild(top);
if(q.npc){var np=ctx.div('','委托人：'+q.npc);np.style.cssText='font-size:11px;opacity:.6;margin-top:3px;';c.appendChild(np);}
var de=ctx.div('',q.desc||'');de.style.cssText='font-size:12px;opacity:.85;line-height:1.6;margin-top:6px;';c.appendChild(de);
var rw=ctx.div('',_rewardLine(q));rw.style.cssText='font-size:11px;opacity:.7;margin-top:6px;letter-spacing:.3px;';c.appendChild(rw);
var btns=ctx.div('','');btns.style.cssText='display:flex;gap:8px;margin-top:9px;align-items:center;flex-wrap:wrap;';
function mk(l,fn,danger){var b=ctx.el('button','ppbtn'+(danger?' del':''));b.textContent=l;b.style.cssText='flex:0 0 auto;width:auto;padding:5px 14px;font-size:12px;';b.onclick=fn;return b;}
if(mode==='offered'){
btns.appendChild(mk('接受',function(){q.status='active';_save();render();ctx.toast('已接受「'+q.title+'」');}));
btns.appendChild(mk('拒绝',function(){st.quests=st.quests.filter(function(x){return x!==q;});if(selQid===q.id)selQid=null;_save();render();},true));}
if(mode==='active'){
btns.appendChild(_check('提交审核',q._sel,function(v){q._sel=v;}));
btns.appendChild(_check('注入酒馆',q.inj,function(v){q.inj=v;_save();ctx.toast(v?'下次发送将携带此任务信息':'已取消注入');}));
var sp2=ctx.div('','');sp2.style.cssText='flex:1;';btns.appendChild(sp2);
btns.appendChild(mk('放弃',function(){st.quests=st.quests.filter(function(x){return x!==q;});if(selQid===q.id)selQid=null;_save();render();},true));}
if(mode==='done'){
var pay=ctx.div('',q.payText||'');pay.style.cssText='font-size:12px;flex:1;';btns.appendChild(pay);
btns.appendChild(mk('删除',function(){st.quests=st.quests.filter(function(x){return x!==q;});_save();render();},true));}
c.appendChild(btns);
if(mode==='done'&&q.comment){var cm=ctx.div('','审核意见：'+q.comment);cm.style.cssText='font-size:11px;opacity:.5;margin-top:5px;';c.appendChild(cm);}
return c;}

/* ---------- 生成：追加新委托，未处理的保留；解析失败渲染在大厅 ---------- */
function generate(){
genBtn.disabled=true;genBtn.textContent='生成中…';
st.lastErr='';_save();
var prompt=_fill(cfg.genPrompt||'');
_chat(prompt,function(t){
genBtn.disabled=false;genBtn.textContent='⟳ 刷新委托';
st.lastRaw=t;
var d=_parseJSON(t);
if(!d||(!d.quests&&!d.news)){st.lastErr='AI返回无法解析为JSON，原文见下方';_save();render();ctx.toast('解析失败');return;}
var titles={};st.quests.forEach(function(q){titles[q.title]=1;});
var added=0;
(d.quests||[]).forEach(function(q){
if(titles[q.title])return;
st.quests.push({id:st.seq++,title:q.title||'未命名委托',npc:q.npc||'',desc:q.desc||'',hook:q.hook||'',
base:parseInt(q.base,10)||0,extra:parseInt(q.extra,10)||0,
x:Math.max(0,Math.min(100,parseInt(q.x,10)||50)),y:Math.max(0,Math.min(100,parseInt(q.y,10)||50)),
region:q.region||'',status:'offered',inj:false});added++;});
if(d.news&&d.news.length){
var nn=d.news.map(function(n){return{t:n.t||'',d:n.d||'',inj:false};});
st.news=nn.concat(st.news).slice(0,12);}
_save();tab='hall';render();ctx.toast('新增 '+added+' 个委托'+(d.news?('，'+d.news.length+' 条新闻'):''));
},function(err){genBtn.disabled=false;genBtn.textContent='⟳ 刷新委托';st.lastErr=err;_save();render();ctx.toast('生成失败：'+err);});}
genBtn.onclick=generate;

/* ---------- 审核：结果写入任务+st.lastReview，渲染在"已完成"页 ---------- */
function submitReview(){
var sel=st.quests.filter(function(q){return q.status==='active'&&q._sel;});
if(!sel.length){ctx.toast('先勾选要提交审核的任务');return;}
var listTxt=sel.map(function(q,i){return (i+1)+'. '+q.title+'：'+q.desc;}).join('\n');
var prompt=_fill(cfg.reviewPrompt||'',{'待审任务列表':listTxt,'酒馆历史':_stHistory(parseInt(cfg.reviewHistN,10)||30)});
ctx.toast('已提交审核，等待平台回复…');
_chat(prompt,function(t){
var d=_parseJSON(t);var results=(d&&d.results)||[];
var paidTotal=0,lines=[];
sel.forEach(function(q,i){
var r=null,j;for(j=0;j<results.length;j++){if(parseInt(results[j].i,10)===i+1){r=results[j];break;}}
var done=r?!!r.done:false;
var pay=done?((q.base||0)+(q.extra||0)):(q.base||0);
paidTotal+=pay;
q.status='done';q._sel=false;q.inj=false;
q.payText=done?('✓ 审核通过 ＋'+pay+' only（基础+额外）'):('✓ 已发放基础工资 ＋'+pay+' only');
q.comment=(r&&r.comment)||'';
lines.push(q.title+'　＋'+pay+' only');});
_setBal(_getBal()+paidTotal);
st.lastReview={total:paidTotal,lines:lines,time:new Date().toLocaleString('zh-CN')};
_save();tab='done';render();ctx.toast('审核完成，入账 '+paidTotal+' only');
},function(err){ctx.toast('审核请求失败：'+err);});}

/* ---------- render ---------- */
function render(){
balChip.innerHTML='<span style="opacity:.55;">余额</span> <b>'+_getBal()+'</b> <span style="opacity:.55;">only</span>';
ticker.textContent=st.news.length?('📰 '+st.news[0].t+' — '+st.news[0].d):'暂无世界新闻，点「刷新委托」获取';
ticker.onclick=function(){tab='news';render();};
_badge();
body.innerHTML='';
if(tab==='hall'){
body.appendChild(_mapWidget());
if(st.lastErr){
var ec=ctx.div('ppcard','');ec.style.cssText='padding:11px 13px;margin-top:8px;';
var et=ctx.div('','⚠ '+st.lastErr);et.style.cssText='font-size:12px;opacity:.8;';ec.appendChild(et);
if(st.lastRaw){
var tg=ctx.el('button','ppbtn',showRaw?'收起AI原文':'查看AI原文');
tg.style.cssText='width:auto;padding:4px 12px;font-size:11px;margin-top:7px;';
tg.onclick=function(){showRaw=!showRaw;render();};ec.appendChild(tg);
if(showRaw){var pre=ctx.div('',''); pre.textContent=st.lastRaw;
pre.style.cssText='font-size:11px;opacity:.6;white-space:pre-wrap;word-break:break-all;margin-top:7px;max-height:200px;overflow-y:auto;line-height:1.6;';ec.appendChild(pre);}}
body.appendChild(ec);}
var off=st.quests.filter(function(q){return q.status==='offered';});
var gap=ctx.div('','');gap.style.cssText='height:8px;';body.appendChild(gap);
if(!off.length)body.appendChild(_empty('暂无可接委托 — 点右上「刷新委托」让中介所根据当前剧情发布任务；未处理的委托会一直留在这里'));
off.forEach(function(q){body.appendChild(_qCard(q,'offered'));});}
if(tab==='active'){
var act=st.quests.filter(function(q){return q.status==='active';});
if(!act.length)body.appendChild(_empty('没有进行中的任务'));
else{
var bar=ctx.div('','');bar.style.cssText='display:flex;gap:8px;margin-bottom:4px;align-items:center;flex-wrap:wrap;';
var sub=ctx.el('button','ppbtn');sub.textContent='提交所选任务至审核';sub.style.cssText='flex:0 0 auto;width:auto;padding:6px 16px;font-size:12px;';
sub.onclick=submitReview;bar.appendChild(sub);
var hint=ctx.div('','勾「注入酒馆」的任务会随你下次发送的消息告知酒馆AI');hint.style.cssText='font-size:10px;opacity:.45;';bar.appendChild(hint);
body.appendChild(bar);
act.forEach(function(q){body.appendChild(_qCard(q,'active'));});}}
if(tab==='done'){
if(st.lastReview){
var rv=ctx.div('ppcard','');rv.style.cssText='padding:11px 13px;';
var rt=ctx.div('','最近一次审核 · '+st.lastReview.time+' · 共入账 '+st.lastReview.total+' only');
rt.style.cssText='font-size:12px;font-weight:600;';rv.appendChild(rt);
var rl=ctx.div('',(st.lastReview.lines||[]).join('\n'));
rl.style.cssText='font-size:11px;opacity:.65;white-space:pre-wrap;margin-top:6px;line-height:1.7;';rv.appendChild(rl);
var rx=ctx.el('button','ppbtn','知道了');rx.style.cssText='width:auto;padding:4px 12px;font-size:11px;margin-top:7px;';
rx.onclick=function(){st.lastReview=null;_save();render();};rv.appendChild(rx);
body.appendChild(rv);}
var dn=st.quests.filter(function(q){return q.status==='done';});
if(!dn.length&&!st.lastReview)body.appendChild(_empty('还没有已完成的任务'));
if(dn.length){
var cl=ctx.el('button','ppbtn del');cl.textContent='清空记录';cl.style.cssText='width:auto;padding:5px 14px;font-size:12px;margin:4px 0;';
cl.onclick=function(){st.quests=st.quests.filter(function(q){return q.status!=='done';});_save();render();};
body.appendChild(cl);
dn.forEach(function(q){body.appendChild(_qCard(q,'done'));});}}
if(tab==='news'){
if(!st.news.length)body.appendChild(_empty('暂无新闻'));
st.news.forEach(function(n,idx){
var c=ctx.div('ppcard','');c.style.cssText='padding:11px 13px;';
var t=ctx.div('',n.t);t.style.cssText='font-size:13px;font-weight:600;';c.appendChild(t);
var d=ctx.div('',n.d);d.style.cssText='font-size:12px;opacity:.75;margin-top:4px;line-height:1.6;';c.appendChild(d);
var row=ctx.div('','');row.style.cssText='margin-top:7px;display:flex;align-items:center;gap:10px;';
row.appendChild(_check('注入酒馆',n.inj,function(v){n.inj=v;_save();}));
var sp3=ctx.div('','');sp3.style.cssText='flex:1;';row.appendChild(sp3);
var dl=ctx.el('button','ppbtn del','删除');dl.style.cssText='width:auto;padding:4px 12px;font-size:11px;';
dl.onclick=function(){st.news.splice(idx,1);_save();render();};row.appendChild(dl);
c.appendChild(row);body.appendChild(c);});}}

render();
return root;
})
/* __PAGECODE_END__ */

/* __POST_BEGIN__ */
{
  "injectEnabled": true,
  "ppPlugin": true
}
/* __POST_END__ */
