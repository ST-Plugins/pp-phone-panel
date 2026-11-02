/* ============================================================================
 * PP Phone Panel — 电话 (pp-phone-call) 独立源码
 * 版本: 1.4.1-fish-proxy
 * 说明: 本文件是权威源码，改代码改这里，然后用 node build.js pp-phone-call 生成
 *       extension/apps/pp-phone-call.js。不要直接改打包文件。
 * ============================================================================ */

/* __META_BEGIN__ */
{
  "id": "pp-phone-call",
  "name": "电话",
  "version": "1.4.1-fish-proxy",
  "description": "iOS 风格语音通话 · 支持语音识别与 MiniMax TTS",
  "icon": "<path d=\"M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.69A2 2 0 012 .9h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z\"/>",
  "enabled": true,
  "settingsTitle": "电话设置",
  "settingsFields": [
    {
      "group": "提示词设置",
      "key": "promptTemplate",
      "type": "textarea",
      "label": "通话系统提示词<button onclick=\"typeof window._vnmPreviewPrompt==='function'&&window._vnmPreviewPrompt(this)\" style=\"padding:2px 9px;border-radius:10px;background:rgba(255,255,255,.07);border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.55);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">预览完整提示词</button><div style=\"display:flex;flex-wrap:wrap;gap:3px;margin:6px 0 2px;\"><button data-v=\"{{角色名称}}\" onclick=\"(function(b){var v=b.dataset.v;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');if(!ta)return;var p=ta.selectionStart||ta.value.length;ta.value=ta.value.slice(0,p)+v+ta.value.slice(p);ta.selectionStart=ta.selectionEnd=p+v.length;ta.dispatchEvent(new Event('input'));ta.focus();})(this)\" style=\"padding:2px 7px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.72);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">{{角色名称}}</button><button data-v=\"{{角色设定}}\" onclick=\"(function(b){var v=b.dataset.v;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');if(!ta)return;var p=ta.selectionStart||ta.value.length;ta.value=ta.value.slice(0,p)+v+ta.value.slice(p);ta.selectionStart=ta.selectionEnd=p+v.length;ta.dispatchEvent(new Event('input'));ta.focus();})(this)\" style=\"padding:2px 7px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.72);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">{{角色设定}}</button><button data-v=\"{{用户名称}}\" onclick=\"(function(b){var v=b.dataset.v;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');if(!ta)return;var p=ta.selectionStart||ta.value.length;ta.value=ta.value.slice(0,p)+v+ta.value.slice(p);ta.selectionStart=ta.selectionEnd=p+v.length;ta.dispatchEvent(new Event('input'));ta.focus();})(this)\" style=\"padding:2px 7px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.72);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">{{用户名称}}</button><button data-v=\"{{用户设定}}\" onclick=\"(function(b){var v=b.dataset.v;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');if(!ta)return;var p=ta.selectionStart||ta.value.length;ta.value=ta.value.slice(0,p)+v+ta.value.slice(p);ta.selectionStart=ta.selectionEnd=p+v.length;ta.dispatchEvent(new Event('input'));ta.focus();})(this)\" style=\"padding:2px 7px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.72);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">{{用户设定}}</button><button data-v=\"{{世界书}}\" onclick=\"(function(b){var v=b.dataset.v;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');if(!ta)return;var p=ta.selectionStart||ta.value.length;ta.value=ta.value.slice(0,p)+v+ta.value.slice(p);ta.selectionStart=ta.selectionEnd=p+v.length;ta.dispatchEvent(new Event('input'));ta.focus();})(this)\" style=\"padding:2px 7px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.72);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">{{世界书}}</button><button data-v=\"{{当前时间}}\" onclick=\"(function(b){var v=b.dataset.v;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');if(!ta)return;var p=ta.selectionStart||ta.value.length;ta.value=ta.value.slice(0,p)+v+ta.value.slice(p);ta.selectionStart=ta.selectionEnd=p+v.length;ta.dispatchEvent(new Event('input'));ta.focus();})(this)\" style=\"padding:2px 7px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.72);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">{{当前时间}}</button><button data-v=\"{{酒馆历史}}\" onclick=\"(function(b){var v=b.dataset.v;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');if(!ta)return;var p=ta.selectionStart||ta.value.length;ta.value=ta.value.slice(0,p)+v+ta.value.slice(p);ta.selectionStart=ta.selectionEnd=p+v.length;ta.dispatchEvent(new Event('input'));ta.focus();})(this)\" style=\"padding:2px 7px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.72);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">{{酒馆历史}}</button><button data-v=\"{{Horae总结}}\" onclick=\"(function(b){var v=b.dataset.v;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');if(!ta)return;var p=ta.selectionStart||ta.value.length;ta.value=ta.value.slice(0,p)+v+ta.value.slice(p);ta.selectionStart=ta.selectionEnd=p+v.length;ta.dispatchEvent(new Event('input'));ta.focus();})(this)\" style=\"padding:2px 7px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.72);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">{{Horae总结}}</button></div><div style=\"display:flex;gap:4px;margin-top:5px;align-items:center;\"><select data-k=\"__vnm_p_promptTemplate\" onfocus=\"(function(sel){var ps=JSON.parse(localStorage.getItem(sel.dataset.k)||'[]');sel.options.length=0;var _po=document.createElement('option');_po.value='';_po.textContent='— 选择预设 —';sel.appendChild(_po);ps.forEach(function(p,i){var o=document.createElement('option');o.value=i;o.textContent=p.name;sel.appendChild(o);});})(this)\" style=\"flex:1;min-width:60px;padding:3px 7px;background:rgba(255,255,255,.08);border:.5px solid rgba(255,255,255,.10);border-radius:8px;color:rgba(255,255,255,.70);font-size:11px;font-family:inherit;outline:none;\"><option value=\"\">— 选择预设 —</option></select><button data-k=\"__vnm_p_promptTemplate\" onclick=\"(function(b){var k=b.dataset.k;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');var sel=f&&f.querySelector('select[data-k]');if(!ta||!sel||sel.value==='')return;var ps=JSON.parse(localStorage.getItem(k)||'[]');var idx=parseInt(sel.value);if(ps[idx]){ta.value=ps[idx].content;ta.dispatchEvent(new Event('input'));}})(this)\" style=\"padding:2px 9px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.10);color:rgba(255,255,255,.62);font-size:11px;cursor:pointer;font-family:inherit;\">应用</button><button data-k=\"__vnm_p_promptTemplate\" onclick=\"(function(b){var k=b.dataset.k;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');var sel=f&&f.querySelector('select[data-k]');if(!ta)return;b.style.display='none';var row=document.createElement('span');row.style.cssText='display:inline-flex;gap:3px;align-items:center;vertical-align:middle;';var inp=document.createElement('input');inp.type='text';inp.placeholder='预设名称';inp.style.cssText='padding:2px 8px;border-radius:8px;background:rgba(255,255,255,.08);border:.5px solid rgba(255,255,255,.2);color:rgba(255,255,255,.9);font-size:12px;outline:none;font-family:inherit;width:88px;box-sizing:border-box;';var bOk=document.createElement('button');bOk.textContent='✓';bOk.style.cssText='padding:1px 8px;border-radius:8px;background:rgba(255,255,255,.12);border:none;color:rgba(255,255,255,.85);font-size:13px;cursor:pointer;line-height:1.6;';var bCc=document.createElement('button');bCc.textContent='✕';bCc.style.cssText='padding:1px 7px;border-radius:8px;background:none;border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.4);font-size:12px;cursor:pointer;line-height:1.6;';row.appendChild(inp);row.appendChild(bOk);row.appendChild(bCc);b.parentNode.insertBefore(row,b.nextSibling);function _restore(){b.style.display='';row.remove();}function _save(){var nm=inp.value.trim();if(!nm)return;var ps=JSON.parse(localStorage.getItem(k)||'[]');var idx=-1;for(var i=0;i<ps.length;i++){if(ps[i].name===nm){idx=i;break;}}if(idx>=0){ps[idx].content=ta.value;}else{ps.push({name:nm,content:ta.value});idx=ps.length-1;}localStorage.setItem(k,JSON.stringify(ps));if(sel){var already=false;for(var j=0;j<sel.options.length;j++){if(sel.options[j].textContent===nm){already=true;break;}}if(!already){var o=document.createElement('option');o.value=idx;o.textContent=nm;sel.appendChild(o);}}_restore();}bOk.onclick=function(e){e.stopPropagation();_save();};bCc.onclick=function(e){e.stopPropagation();_restore();};inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.stopPropagation();_save();}if(e.key==='Escape')_restore();});inp.addEventListener('click',function(e){e.stopPropagation();});setTimeout(function(){inp.focus();},20);})(this)\" style=\"padding:2px 9px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.10);color:rgba(255,255,255,.62);font-size:11px;cursor:pointer;font-family:inherit;\">保存预设</button><button data-k=\"__vnm_p_promptTemplate\" onclick=\"(function(b){var k=b.dataset.k;var f=b.closest('.ppfield');var sel=f&&f.querySelector('select[data-k]');if(!sel||sel.value==='')return;var idx=parseInt(sel.value);var ps=JSON.parse(localStorage.getItem(k)||'[]');ps.splice(idx,1);localStorage.setItem(k,JSON.stringify(ps));sel.remove(sel.options[sel.selectedIndex]);for(var i=0;i<sel.options.length;i++){if(sel.options[i].value!=='')sel.options[i].value=i;}})(this)\" style=\"padding:2px 9px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.10);color:rgba(255,255,255,.62);font-size:11px;cursor:pointer;font-family:inherit;\">删除</button></div>",
      "rows": 7,
      "variables": [
        "{{角色名称}}",
        "{{角色设定}}",
        "{{用户名称}}",
        "{{用户设定}}",
        "{{角色状态}}",
        "{{世界书}}",
        "{{当前时间}}",
        "{{酒馆历史}}"
      ],
      "placeholder": "你正在扮演{{角色名称}}与{{用户名称}}进行语音通话…",
      "default": "你正在扮演{{角色名称}}与{{用户名称}}进行对话。\n【角色设定】\n{{角色名称}}\n{{角色设定}}\n【用户设定】\n{{用户名称}}\n{{用户设定}}\n【世界背景信息】\n{{世界书}}\n【当前{{用户名称}}经历】\n{{酒馆历史}}\n请用简短自然的口语风格回复，20字以内，不使用任何 Markdown 格式，只说话不描述动作。"
    },
    {
      "group": "提示词设置",
      "key": "sumPrompt",
      "type": "textarea",
      "label": "通话总结提示词<button onclick=\"typeof window._vnmPreviewSum==='function'&&window._vnmPreviewSum(this)\" style=\"padding:2px 9px;border-radius:10px;background:rgba(255,255,255,.07);border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.55);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">预览总结提示词</button><div style=\"display:flex;flex-wrap:wrap;gap:3px;margin:6px 0 2px;\"><button data-v=\"{{用户名字}}\" onclick=\"(function(b){var v=b.dataset.v;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');if(!ta)return;var p=ta.selectionStart||ta.value.length;ta.value=ta.value.slice(0,p)+v+ta.value.slice(p);ta.selectionStart=ta.selectionEnd=p+v.length;ta.dispatchEvent(new Event('input'));ta.focus();})(this)\" style=\"padding:2px 7px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.72);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">{{用户名字}}</button><button data-v=\"{{对话内容}}\" onclick=\"(function(b){var v=b.dataset.v;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');if(!ta)return;var p=ta.selectionStart||ta.value.length;ta.value=ta.value.slice(0,p)+v+ta.value.slice(p);ta.selectionStart=ta.selectionEnd=p+v.length;ta.dispatchEvent(new Event('input'));ta.focus();})(this)\" style=\"padding:2px 7px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.72);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">{{对话内容}}</button></div><div style=\"display:flex;gap:4px;margin-top:5px;align-items:center;\"><select data-k=\"__vnm_p_sumPrompt\" onfocus=\"(function(sel){var ps=JSON.parse(localStorage.getItem(sel.dataset.k)||'[]');sel.options.length=0;var _po=document.createElement('option');_po.value='';_po.textContent='— 选择预设 —';sel.appendChild(_po);ps.forEach(function(p,i){var o=document.createElement('option');o.value=i;o.textContent=p.name;sel.appendChild(o);});})(this)\" style=\"flex:1;min-width:60px;padding:3px 7px;background:rgba(255,255,255,.08);border:.5px solid rgba(255,255,255,.10);border-radius:8px;color:rgba(255,255,255,.70);font-size:11px;font-family:inherit;outline:none;\"><option value=\"\">— 选择预设 —</option></select><button data-k=\"__vnm_p_sumPrompt\" onclick=\"(function(b){var k=b.dataset.k;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');var sel=f&&f.querySelector('select[data-k]');if(!ta||!sel||sel.value==='')return;var ps=JSON.parse(localStorage.getItem(k)||'[]');var idx=parseInt(sel.value);if(ps[idx]){ta.value=ps[idx].content;ta.dispatchEvent(new Event('input'));}})(this)\" style=\"padding:2px 9px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.10);color:rgba(255,255,255,.62);font-size:11px;cursor:pointer;font-family:inherit;\">应用</button><button data-k=\"__vnm_p_sumPrompt\" onclick=\"(function(b){var k=b.dataset.k;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');var sel=f&&f.querySelector('select[data-k]');if(!ta)return;b.style.display='none';var row=document.createElement('span');row.style.cssText='display:inline-flex;gap:3px;align-items:center;vertical-align:middle;';var inp=document.createElement('input');inp.type='text';inp.placeholder='预设名称';inp.style.cssText='padding:2px 8px;border-radius:8px;background:rgba(255,255,255,.08);border:.5px solid rgba(255,255,255,.2);color:rgba(255,255,255,.9);font-size:12px;outline:none;font-family:inherit;width:88px;box-sizing:border-box;';var bOk=document.createElement('button');bOk.textContent='✓';bOk.style.cssText='padding:1px 8px;border-radius:8px;background:rgba(255,255,255,.12);border:none;color:rgba(255,255,255,.85);font-size:13px;cursor:pointer;line-height:1.6;';var bCc=document.createElement('button');bCc.textContent='✕';bCc.style.cssText='padding:1px 7px;border-radius:8px;background:none;border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.4);font-size:12px;cursor:pointer;line-height:1.6;';row.appendChild(inp);row.appendChild(bOk);row.appendChild(bCc);b.parentNode.insertBefore(row,b.nextSibling);function _restore(){b.style.display='';row.remove();}function _save(){var nm=inp.value.trim();if(!nm)return;var ps=JSON.parse(localStorage.getItem(k)||'[]');var idx=-1;for(var i=0;i<ps.length;i++){if(ps[i].name===nm){idx=i;break;}}if(idx>=0){ps[idx].content=ta.value;}else{ps.push({name:nm,content:ta.value});idx=ps.length-1;}localStorage.setItem(k,JSON.stringify(ps));if(sel){var already=false;for(var j=0;j<sel.options.length;j++){if(sel.options[j].textContent===nm){already=true;break;}}if(!already){var o=document.createElement('option');o.value=idx;o.textContent=nm;sel.appendChild(o);}}_restore();}bOk.onclick=function(e){e.stopPropagation();_save();};bCc.onclick=function(e){e.stopPropagation();_restore();};inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.stopPropagation();_save();}if(e.key==='Escape')_restore();});inp.addEventListener('click',function(e){e.stopPropagation();});setTimeout(function(){inp.focus();},20);})(this)\" style=\"padding:2px 9px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.10);color:rgba(255,255,255,.62);font-size:11px;cursor:pointer;font-family:inherit;\">保存预设</button><button data-k=\"__vnm_p_sumPrompt\" onclick=\"(function(b){var k=b.dataset.k;var f=b.closest('.ppfield');var sel=f&&f.querySelector('select[data-k]');if(!sel||sel.value==='')return;var idx=parseInt(sel.value);var ps=JSON.parse(localStorage.getItem(k)||'[]');ps.splice(idx,1);localStorage.setItem(k,JSON.stringify(ps));sel.remove(sel.options[sel.selectedIndex]);for(var i=0;i<sel.options.length;i++){if(sel.options[i].value!=='')sel.options[i].value=i;}})(this)\" style=\"padding:2px 9px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.10);color:rgba(255,255,255,.62);font-size:11px;cursor:pointer;font-family:inherit;\">删除</button></div>",
      "rows": 5,
      "variables": [
        "{{用户名字}}",
        "{{对话内容}}"
      ],
      "placeholder": "请将下面的通话内容整理成摘要…",
      "default": "请将下面的通话对话内容整理成简洁的第三人称叙事摘要，100-200字，保留关键情节与情感走向，不使用列表格式。\n\n{{对话内容}}"
    },
    {
      "group": "提示词设置",
      "key": "injectPrompt",
      "type": "textarea",
      "label": "注入前缀提示词<button onclick=\"typeof window._vnmPreviewInj==='function'&&window._vnmPreviewInj(this)\" style=\"padding:2px 9px;border-radius:10px;background:rgba(255,255,255,.07);border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.55);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">预览注入前缀</button><div style=\"display:flex;flex-wrap:wrap;gap:3px;margin:6px 0 2px;\"><button data-v=\"{{角色名称}}\" onclick=\"(function(b){var v=b.dataset.v;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');if(!ta)return;var p=ta.selectionStart||ta.value.length;ta.value=ta.value.slice(0,p)+v+ta.value.slice(p);ta.selectionStart=ta.selectionEnd=p+v.length;ta.dispatchEvent(new Event('input'));ta.focus();})(this)\" style=\"padding:2px 7px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.72);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">{{角色名称}}</button><button data-v=\"{{用户名称}}\" onclick=\"(function(b){var v=b.dataset.v;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');if(!ta)return;var p=ta.selectionStart||ta.value.length;ta.value=ta.value.slice(0,p)+v+ta.value.slice(p);ta.selectionStart=ta.selectionEnd=p+v.length;ta.dispatchEvent(new Event('input'));ta.focus();})(this)\" style=\"padding:2px 7px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.72);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">{{用户名称}}</button><button data-v=\"{{已选注入内容}}\" onclick=\"(function(b){var v=b.dataset.v;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');if(!ta)return;var p=ta.selectionStart||ta.value.length;ta.value=ta.value.slice(0,p)+v+ta.value.slice(p);ta.selectionStart=ta.selectionEnd=p+v.length;ta.dispatchEvent(new Event('input'));ta.focus();})(this)\" style=\"padding:2px 7px;border-radius:10px;background:rgba(100,180,255,.14);border:.5px solid rgba(100,180,255,.28);color:rgba(140,200,255,.9);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">{{已选注入内容}}</button></div><div style=\"display:flex;gap:4px;margin-top:5px;align-items:center;\"><select data-k=\"__vnm_p_injectPrompt\" onfocus=\"(function(sel){var ps=JSON.parse(localStorage.getItem(sel.dataset.k)||'[]');sel.options.length=0;var _po=document.createElement('option');_po.value='';_po.textContent='— 选择预设 —';sel.appendChild(_po);ps.forEach(function(p,i){var o=document.createElement('option');o.value=i;o.textContent=p.name;sel.appendChild(o);});})(this)\" style=\"flex:1;min-width:60px;padding:3px 7px;background:rgba(255,255,255,.08);border:.5px solid rgba(255,255,255,.10);border-radius:8px;color:rgba(255,255,255,.70);font-size:11px;font-family:inherit;outline:none;\"><option value=\"\">— 选择预设 —</option></select><button data-k=\"__vnm_p_injectPrompt\" onclick=\"(function(b){var k=b.dataset.k;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');var sel=f&&f.querySelector('select[data-k]');if(!ta||!sel||sel.value==='')return;var ps=JSON.parse(localStorage.getItem(k)||'[]');var idx=parseInt(sel.value);if(ps[idx]){ta.value=ps[idx].content;ta.dispatchEvent(new Event('input'));}})(this)\" style=\"padding:2px 9px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.10);color:rgba(255,255,255,.62);font-size:11px;cursor:pointer;font-family:inherit;\">应用</button><button data-k=\"__vnm_p_injectPrompt\" onclick=\"(function(b){var k=b.dataset.k;var f=b.closest('.ppfield');var ta=f&&f.querySelector('textarea');var sel=f&&f.querySelector('select[data-k]');if(!ta)return;b.style.display='none';var row=document.createElement('span');row.style.cssText='display:inline-flex;gap:3px;align-items:center;vertical-align:middle;';var inp=document.createElement('input');inp.type='text';inp.placeholder='预设名称';inp.style.cssText='padding:2px 8px;border-radius:8px;background:rgba(255,255,255,.08);border:.5px solid rgba(255,255,255,.2);color:rgba(255,255,255,.9);font-size:12px;outline:none;font-family:inherit;width:88px;box-sizing:border-box;';var bOk=document.createElement('button');bOk.textContent='✓';bOk.style.cssText='padding:1px 8px;border-radius:8px;background:rgba(255,255,255,.12);border:none;color:rgba(255,255,255,.85);font-size:13px;cursor:pointer;line-height:1.6;';var bCc=document.createElement('button');bCc.textContent='✕';bCc.style.cssText='padding:1px 7px;border-radius:8px;background:none;border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.4);font-size:12px;cursor:pointer;line-height:1.6;';row.appendChild(inp);row.appendChild(bOk);row.appendChild(bCc);b.parentNode.insertBefore(row,b.nextSibling);function _restore(){b.style.display='';row.remove();}function _save(){var nm=inp.value.trim();if(!nm)return;var ps=JSON.parse(localStorage.getItem(k)||'[]');var idx=-1;for(var i=0;i<ps.length;i++){if(ps[i].name===nm){idx=i;break;}}if(idx>=0){ps[idx].content=ta.value;}else{ps.push({name:nm,content:ta.value});idx=ps.length-1;}localStorage.setItem(k,JSON.stringify(ps));if(sel){var already=false;for(var j=0;j<sel.options.length;j++){if(sel.options[j].textContent===nm){already=true;break;}}if(!already){var o=document.createElement('option');o.value=idx;o.textContent=nm;sel.appendChild(o);}}_restore();}bOk.onclick=function(e){e.stopPropagation();_save();};bCc.onclick=function(e){e.stopPropagation();_restore();};inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.stopPropagation();_save();}if(e.key==='Escape')_restore();});inp.addEventListener('click',function(e){e.stopPropagation();});setTimeout(function(){inp.focus();},20);})(this)\" style=\"padding:2px 9px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.10);color:rgba(255,255,255,.62);font-size:11px;cursor:pointer;font-family:inherit;\">保存预设</button><button data-k=\"__vnm_p_injectPrompt\" onclick=\"(function(b){var k=b.dataset.k;var f=b.closest('.ppfield');var sel=f&&f.querySelector('select[data-k]');if(!sel||sel.value==='')return;var idx=parseInt(sel.value);var ps=JSON.parse(localStorage.getItem(k)||'[]');ps.splice(idx,1);localStorage.setItem(k,JSON.stringify(ps));sel.remove(sel.options[sel.selectedIndex]);for(var i=0;i<sel.options.length;i++){if(sel.options[i].value!=='')sel.options[i].value=i;}})(this)\" style=\"padding:2px 9px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.10);color:rgba(255,255,255,.62);font-size:11px;cursor:pointer;font-family:inherit;\">删除</button></div>",
      "rows": 3,
      "variables": [
        "{{角色名称}}",
        "{{用户名称}}"
      ],
      "placeholder": "以下是已发生的历史对话，仅供参考：",
      "default": "以下是已发生的历史对话，仅供参考：\n\n{{已选注入内容}}"
    },
    {
      "group": "通话设置",
      "key": "callDepth",
      "type": "number",
      "label": "发给 AI 的最大对话轮数（每轮=用户+AI各1条）",
      "min": 2,
      "max": 60,
      "default": 10
    },
    {
      "key": "userMsgTemplate",
      "type": "textarea",
      "label": "用户消息模板（发给AI的用户消息格式，可用 {{用户输入}}）",
      "placeholder": "{{用户输入}}",
      "default": "{{用户输入}}"
    },
    {
      "group": "通话设置",
      "key": "stHistN",
      "type": "number",
      "label": "注入酒馆聊天历史条数（0=不注入）",
      "min": 0,
      "max": 100,
      "default": 0
    },
    {
      "group": "通话设置",
      "key": "defaultLang",
      "type": "select",
      "label": "语音识别语言",
      "options": [
        {
          "v": "zh-CN",
          "l": "中文"
        },
        {
          "v": "ja-JP",
          "l": "日语"
        },
        {
          "v": "en-US",
          "l": "英语"
        },
        {
          "v": "",
          "l": "浏览器自动"
        }
      ],
      "default": "zh-CN"
    },
    {
      "group": "通话设置",
      "key": "silenceMs",
      "type": "number",
      "label": "静音检测延迟（ms）",
      "min": 500,
      "max": 5000,
      "default": 1800
    },
    {
      "group": "覆盖通话 API",
      "key": "useOwnApi",
      "type": "toggle",
      "label": "启用自定义通话 API",
      "default": false
    },
    {
      "group": "覆盖通话 API",
      "key": "ownApiUrl",
      "type": "text",
      "label": "API 地址",
      "placeholder": "https://…",
      "default": ""
    },
    {
      "group": "覆盖通话 API",
      "key": "ownApiKey",
      "type": "password",
      "label": "API 密钥",
      "default": ""
    },
    {
      "group": "覆盖通话 API",
      "key": "useOwnModel",
      "type": "toggle",
      "label": "使用自定义模型名",
      "default": false
    },
    {
      "group": "覆盖通话 API",
      "key": "ownModel",
      "type": "text",
      "label": "模型名",
      "default": ""
    },
    {
      "group": "覆盖总结 API",
      "key": "useOwnSumApi",
      "type": "toggle",
      "label": "启用独立总结 API",
      "default": false
    },
    {
      "group": "覆盖总结 API",
      "key": "ownSumUrl",
      "type": "text",
      "label": "总结 API 地址",
      "placeholder": "https://…",
      "default": ""
    },
    {
      "group": "覆盖总结 API",
      "key": "ownSumApiKey",
      "type": "password",
      "label": "总结 API 密钥",
      "default": ""
    },
    {
      "group": "覆盖总结 API",
      "key": "ownSumModel",
      "type": "text",
      "label": "总结模型名",
      "default": ""
    },
    {
      "group": "覆盖 TTS",
      "key": "useOwnTts",
      "type": "toggle",
      "label": "使用自定义 MiniMax 凭证",
      "default": false
    },
    {
      "group": "覆盖 TTS",
      "key": "ownTtsKey",
      "type": "password",
      "label": "MiniMax API Key",
      "default": ""
    },
    {
      "group": "覆盖 TTS",
      "key": "ownTtsGid",
      "type": "text",
      "label": "MiniMax Group ID",
      "default": ""
    },
    {
      "group": "覆盖 TTS",
      "key": "ttsProviderOverride",
      "type": "select",
      "label": "语音来源(本App，留空则跟随全局)",
      "options": [
        {
          "v": "",
          "l": "跟随全局"
        },
        {
          "v": "minimax",
          "l": "MiniMax"
        },
        {
          "v": "fishaudio",
          "l": "Fish Audio"
        }
      ],
      "default": ""
    },
    {
      "group": "覆盖 TTS",
      "key": "ownFishKey",
      "type": "password",
      "label": "Fish Audio API Key",
      "default": ""
    },
    {
      "group": "语音缓存",
      "key": "ttsEnableCache",
      "type": "toggle",
      "label": "启用语音本地缓存（重新打开可复听）",
      "default": false
    },
    {
      "group": "语音缓存",
      "key": "ttsMaxCache",
      "type": "number",
      "label": "最多缓存条数（0=不限）",
      "min": 0,
      "max": 500,
      "default": 50
    }
  ],
  "settingsValues": {}
}
/* __META_END__ */

/* __INJECT_BEGIN__ */
(function(ctx){
  try{
    var TOP=window.parent;
    var s=JSON.parse(TOP.localStorage.getItem('pp-config')||'{}');
    return s.pendingPhoneInject||'';
  }catch(e){return '';}
})
/* __INJECT_END__ */

/* __PAGECODE_BEGIN__ */
(function(ctx){
var TOP=window.parent,TOPDOC=TOP.document,sbS=ctx.sbS,cfg=ctx.settings,_W=ctx.save;

/* ── utils ── */
function _el(t,c,h){var e=TOPDOC.createElement(t);if(c){if(c.indexOf(':')>=0||c.indexOf(';')>=0)e.style.cssText=c;else e.className=c;}if(h)e.innerHTML=h;return e;}
function _div(c,h){return _el('div',c,h);}
function _uuid(){return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0;return(c==='x'?r:r&3|8).toString(16);});}
function _fmt(ms){var s=Math.floor(ms/1000),m=Math.floor(s/60);s=s%60;return(m<10?'0':'')+m+':'+(s<10?'0':'')+s;}
/* strip 「翻译」 before TTS */
function _stripTrans(t){return t.replace(/「[\s\S]*?」/g,'').replace(/「[\s\S]*$/,'').replace(/[\n\r]+$/,'').trim();}

function _dateStr(ts){var d=new Date(ts);return(d.getMonth()+1)+'/'+d.getDate()+' '+d.getHours()+':'+(d.getMinutes()<10?'0':'')+d.getMinutes();}
function _esc(s){return String(s||'').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function _toast(msg){if(ctx.toast)ctx.toast(msg);}

/* ── settings helpers (cfg = ctx.settings = settingsFields values) ── */
/* 通话 API：优先 cfg 覆盖，否则回落主设置 sbS */
function _phoneApiUrl(){return(cfg.useOwnApi&&cfg.ownApiUrl)||sbS.apiUrl||'';}
function _phoneApiKey(){return(cfg.useOwnApi&&cfg.ownApiKey)||sbS.apiKey||'';}
function _phoneModel() {return(cfg.useOwnApi&&cfg.useOwnModel&&cfg.ownModel)||sbS.model||'';}
/* 总结 API：优先 cfg 总结覆盖，否则回落通话 API */
function _sumApiUrl()  {return(cfg.useOwnSumApi&&cfg.ownSumUrl)||_phoneApiUrl();}
function _sumApiKey()  {return(cfg.useOwnSumApi&&cfg.ownSumApiKey)||_phoneApiKey();}
function _sumModel()   {return(cfg.useOwnSumApi&&cfg.ownSumModel)||_phoneModel();}
/* TTS：优先 cfg 覆盖，否则回落主设置 sbS */
function _ttsKey(){return(cfg.useOwnTts&&cfg.ownTtsKey)||sbS.ttsApiKey||'';}
function _ttsGid(){return(cfg.useOwnTts&&cfg.ownTtsGid)||sbS.ttsGroupId||'';}
function _ttsHost(){return(sbS.ttsApiHost||'https://api.minimax.chat').replace(/\/+$/,'');}
function _ttsModelV(){return sbS.ttsModel||'speech-02-hd';}
function _fishKey(){return(cfg.useOwnTts&&cfg.ownFishKey)||sbS.fishApiKey||'';}
function _fishModel(){return sbS.fishModel||'s2.1-pro-free';}
function _fishLatency(){return sbS.fishLatency||'balanced';}
function _fishTemp(){return sbS.fishTemperature;}
function _fishTopP(){return sbS.fishTopP;}
function _fishProxyPort(){return sbS.fishProxyPort||'8765';}
function _ttsProviderFor(ch){return(ch&&ch.ttsProvider)||sbS.ttsProvider||'minimax';}
function _ttsHasCreds(ch){var p=_ttsProviderFor(ch);return p==='fishaudio'?!!_fishKey():!!(_ttsKey()&&_ttsGid());}
function _ttsVoiceIdFor(ch){var p=_ttsProviderFor(ch);return p==='fishaudio'?((ch&&ch.fishVoiceId)||''):((ch&&ch.ttsVoiceId)||'');}
function _ttsSpeakLangFor(ch){return(ch&&ch.ttsSpeakLang)||'auto';}
/* 其他插件专属设置 */
function _callDepth(){return parseInt(cfg.callDepth)||10;}
function _stHistN(){return parseInt(cfg.stHistN)||0;}
function _sttLang(){return cfg.defaultLang||'zh-CN';}
function _sumPrompt(){return cfg.sumPrompt||'';}
function _callPrompt(){return cfg.promptTemplate||null;}
function _defaultVcPrompt(){return'你正在扮演{{角色名称}}与{{用户名称}}进行对话。\n【角色设定】\n{{角色设定}}\n【用户设定】\n{{用户设定}}\n【世界背景信息】\n{{世界书}}\n【当前{{用户名称}}经历信息】\n{{酒馆历史}}\n请用简短自然的口语风格回复，30字以内，不使用任何 Markdown 格式，只说话不描述动作。';}

/* ── storage ── */
function _loadLogs(){try{return JSON.parse(TOP.localStorage.getItem('pp-phone-logs')||'[]');}catch(e){return[];}}
function _saveLogs(l){try{TOP.localStorage.setItem('pp-phone-logs',JSON.stringify(l.slice(-300)));}catch(e){}}

/* ── world book ── */
function _getWbText(char){
  var ids=char.wbIds||[];if(!ids.length)return'';
  var entries=(sbS.wbEntries||[]).filter(function(e){return ids.indexOf(e.id)>=0&&e.content;});
  return entries.map(function(e){return'《'+e.name+'》\n'+e.content;}).join('\n\n');
}

/* ── ST chat history ── */
function _getSTHistory(n){
  if(!n||n<=0)return'';
  try{
    var stCtx=TOP.SillyTavern&&TOP.SillyTavern.getContext&&TOP.SillyTavern.getContext();
    var chat=stCtx&&stCtx.chat;
    if(!chat||!chat.length)return'';
    var msgs=chat.filter(function(m){return!m.is_system;});
    var recent=msgs.slice(-n);
    if(!recent.length)return'';
    var userName=(sbS.user&&sbS.user.name)||stCtx.name1||'用户';
    var charName=stCtx.name2||'角色';
    return recent.map(function(m){
      var txt=(m.mes||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
      if(!txt)return null;
      return(m.is_user?userName:charName)+': '+txt;
    }).filter(Boolean).join('\n');
  }catch(e){return'';}
}

/* ── TTS ── */
function _tts(text,voiceId,speed,lang,provider,onBlob,onErr){
  if(provider==='fishaudio'){_ttsFish(text,voiceId,speed,onBlob,onErr);}
  else{_ttsMiniMax(text,voiceId,speed,lang,onBlob,onErr);}
}
function _ttsMiniMax(text,voiceId,speed,lang,onBlob,onErr){
  var host=_ttsHost(),gid=_ttsGid(),key=_ttsKey();
  if(!key){onErr('未设置 MiniMax API Key');return;}
  if(!gid){onErr('未设置 MiniMax Group ID');return;}
  var body={model:_ttsModelV(),text:text,stream:false,
    voice_setting:{voice_id:voiceId||'female-shaonv',speed:parseFloat(speed)||1,vol:1,pitch:0},
    audio_setting:{sample_rate:32000,bitrate:128000,format:'mp3',channel:1}};
  TOP.fetch(host+'/v1/t2a_v2?GroupId='+gid,{method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
    body:JSON.stringify(body)
  }).then(function(r){
    if(!r.ok){onErr('TTS HTTP '+r.status);return Promise.reject(null);}
    return r.json();
  }).then(function(data){
    if(!data)return;
    if(data.base_resp&&data.base_resp.status_code!==0){onErr('TTS: '+data.base_resp.status_msg);return;}
    var hex=data.data&&data.data.audio;
    if(!hex){onErr('TTS 返回无音频数据 (extra_info: '+(data.extra_info&&data.extra_info.audio_size||'?')+')');return;}
    var arr=hex.match(/.{1,2}/g);
    if(!arr||!arr.length){onErr('TTS 音频解码失败');return;}
    var bytes=new Uint8Array(arr.map(function(b){return parseInt(b,16);}));
    onBlob(new TOP.Blob([bytes],{type:'audio/mpeg'}));
  }).catch(function(e){if(e)onErr('TTS fetch: '+e.message);});
}
function _ttsFish(text,voiceId,speed,onBlob,onErr){
  var key=_fishKey();
  if(!key){onErr('未设置 Fish Audio API Key');return;}
  var body={text:text,format:'mp3',mp3_bitrate:64,
    prosody:{speed:parseFloat(speed)||1,volume:0},
    latency:_fishLatency()};
  if(voiceId)body.reference_id=voiceId;
  var t=_fishTemp(),p=_fishTopP();
  if(t!==undefined&&t!==null&&t!=='')body.temperature=parseFloat(t);
  if(p!==undefined&&p!==null&&p!=='')body.top_p=parseFloat(p);
  var proxyHost=(sbS.fishProxyHost||'').trim();if(!proxyHost){try{proxyHost=TOP.location.hostname||'127.0.0.1';}catch(e){proxyHost='127.0.0.1';}}var proxyUrlHost=(proxyHost.indexOf(':')>=0&&proxyHost.charAt(0)!=='[')?('['+proxyHost+']'):proxyHost;var proxyUrl='http://'+proxyUrlHost+':'+_fishProxyPort()+'/tts';
  TOP.fetch(proxyUrl,{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({apiKey:key,model:_fishModel(),payload:body})
  }).then(function(r){
    if(!r.ok){
      return r.text().then(function(t2){
        var msg='Fish Audio HTTP '+r.status;
        try{var j=JSON.parse(t2);if(j&&j.message)msg=j.message;else if(j&&j.error)msg=j.error;}catch(e2){}
        onErr(msg);
      });
    }
    return r.arrayBuffer().then(function(buf){
      onBlob(new TOP.Blob([buf],{type:'audio/mpeg'}));
    });
  }).catch(function(e){
    var msg=(e&&e.message)||String(e);
    if(/Failed to fetch|NetworkError|Load failed/i.test(msg)){
      msg='未连接到本地 Fish Audio 代理(127.0.0.1:'+_fishProxyPort()+')，请先运行 fish-tts-proxy';
    }
    onErr(msg);
  });
}

/* ── LLM ── */
function _chatWith(url,key,model,messages,onText,onErr){
  var base=(url||'').replace(/\/chat\/completions\/?$/,'').replace(/\/+$/,'');
  if(!base){onErr('API地址未设置');return;}
  if(!model){onErr('模型未设置');return;}
  var hdrs={'Content-Type':'application/json'};if(key)hdrs['Authorization']='Bearer '+key;
  TOP.fetch(base+'/chat/completions',{method:'POST',headers:hdrs,
    body:JSON.stringify({model:model,messages:messages,max_tokens:10000,temperature:0.9})
  }).then(function(r){
    if(!r.ok){onErr('API HTTP '+r.status);return Promise.reject(null);}
    return r.json();
  }).then(function(data){
    if(!data)return;
    console.log('[phone-call] LLM raw response:',data);
    var fr=data.choices&&data.choices[0]&&data.choices[0].finish_reason;
    if(fr&&fr!=='stop')console.warn('[phone-call] finish_reason='+fr+' → 回复在API侧被截断（多半是max_tokens被思考token吃掉）');
    var txt=data.choices&&data.choices[0]&&data.choices[0].message&&data.choices[0].message.content;
    if(!txt)onErr('API返回空内容');else onText(txt.trim());
  }).catch(function(e){if(e)onErr('API: '+e.message);});
}
function _phoneChat(m,ok,err){_chatWith(_phoneApiUrl(),_phoneApiKey(),_phoneModel(),m,ok,err);}
function _sumChat(m,ok,err){_chatWith(_sumApiUrl(),_sumApiKey(),_sumModel(),m,ok,err);}
function _translateJa(text,ok,err){
  _phoneChat([{role:'system',content:'你是专业日文翻译。把用户输入翻译成自然流畅的口语化日文，只输出译文本身，不加引号、不加注释、不加说明。'},{role:'user',content:text}],ok,err);
}

/* ── avatar (monochrome) ── */
function _mkAv(name,url,sz){
  sz=sz||44;
  var av=_div('');av.style.cssText='width:'+sz+'px;height:'+sz+'px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:'+(sz*.38|0)+'px;color:rgba(255,255,255,.7);overflow:hidden;background-size:cover;background-position:center;';
  if(url)av.style.backgroundImage='url('+url+')';
  else{av.style.background='rgba(255,255,255,.1)';av.style.border='.5px solid rgba(255,255,255,.16)';}
  if(!url)av.textContent=(name||'?').charAt(0).toUpperCase();
  return av;
}


/* ── CSS ── */
if(!TOPDOC.getElementById('pp-ph4-css')){
  var _stel=TOPDOC.createElement('style');_stel.id='pp-ph4-css';
  _stel.textContent=
    '@keyframes phWave{0%,100%{transform:scaleY(1)}50%{transform:scaleY(2.1)}}'
   +'@keyframes phPulse{0%,100%{opacity:.35}50%{opacity:.9}}'
   /* ── whole-app glass layer ── */
   +'.ph4-glass{background:rgba(255,255,255,.042);-webkit-backdrop-filter:blur(52px) saturate(180%);backdrop-filter:blur(52px) saturate(180%);border-radius:22px;overflow:hidden;}'
   /* ── tab bar ── */
   +'.ph4-tab{flex:1;text-align:center;font-size:13px;padding:8px 0 11px;cursor:pointer;color:rgba(255,255,255,.26);border-bottom:.5px solid transparent;transition:color .18s,border-color .18s;letter-spacing:.1px;}'
   +'.ph4-tab.on{color:rgba(255,255,255,.88);font-weight:600;border-bottom:.5px solid rgba(255,255,255,.45);}'
   /* ── pill action buttons ── */
   +'.ph4-btn{display:inline-flex;align-items:center;justify-content:center;padding:5px 14px;border-radius:20px;background:rgba(255,255,255,.07);color:rgba(255,255,255,.62);font-size:12px;cursor:pointer;font-family:inherit;transition:background .15s;white-space:nowrap;border:none;outline:none;}'
   +'.ph4-btn:hover{background:rgba(255,255,255,.12);color:rgba(255,255,255,.85);}'
   +'.ph4-btn:active{opacity:.65;}'
   +'.ph4-btn.cancel{background:rgba(255,255,255,.12);color:rgba(255,255,255,.88);}'
   +'.ph4-btn.dim{opacity:.18;pointer-events:none;}'
   /* ── bubble action buttons ── */
   +'.ph4-ebtn{display:inline-flex;align-items:center;justify-content:center;padding:4px 12px;border-radius:14px;background:rgba(255,255,255,.10);color:rgba(255,255,255,.78);font-size:11px;cursor:pointer;-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);transition:background .12s;white-space:nowrap;border:none;outline:none;}'
   +'.ph4-ebtn:hover{background:rgba(255,255,255,.17);}'
   +'.ph4-ebtn:active{opacity:.65;}'
   /* ── list rows — no card wrapper needed ── */
   +'.ph4-row{display:flex;align-items:center;padding:12px 18px;gap:12px;transition:background .12s;}'
   +'.ph4-row:hover{background:rgba(255,255,255,.04);}'
   +'.ph4-row+.ph4-row{border-top:.5px solid rgba(255,255,255,.055);}'
   +'.ph4-sec{font-size:10px;font-weight:600;letter-spacing:.9px;text-transform:uppercase;color:rgba(255,255,255,.20);padding:16px 18px 6px;}'
   /* ── inputs ── */
   +'.ph4-inp{width:100%;box-sizing:border-box;padding:8px 12px;background:rgba(255,255,255,.07);border:.5px solid rgba(255,255,255,.10);border-radius:12px;color:rgba(255,255,255,.88);font-size:13px;font-family:inherit;outline:none;}'
   +'.ph4-inp:focus{border-color:rgba(255,255,255,.30);}'
   +'.ph4-ta{width:100%;box-sizing:border-box;min-height:110px;padding:8px 12px;background:rgba(255,255,255,.07);border:.5px solid rgba(255,255,255,.10);border-radius:12px;color:rgba(255,255,255,.88);font-size:13px;font-family:inherit;outline:none;resize:vertical;line-height:1.5;}'
   +'.ph4-ta:focus{border-color:rgba(255,255,255,.30);}'
   /* ── listening pulse ── */
   +'.ph4-listening{animation:phPulse 1.6s ease-in-out infinite;}';
  TOPDOC.head.appendChild(_stel);
}

/* ── state ── */
var _vc={state:'idle',char:null,history:[],_timerIv:null,timerMs:0,_callStart:0,_stopMic:null};

/* ── root ── */
var root=_div('');
root.style.cssText='display:flex;flex-direction:column;height:100%;background:transparent;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Segoe UI",sans-serif;color:rgba(255,255,255,.9);user-select:none;-webkit-user-select:none;overflow:hidden;position:relative;';

/* tab bar — flex-row 确保并排 */
var tabBar=_div('');
tabBar.style.cssText='display:flex;flex-direction:row;align-items:stretch;padding:0 20px;flex-shrink:0;border-bottom:.5px solid rgba(255,255,255,.06);';
function _mkTab(lbl){var t=_div('ph4-tab');t.textContent=lbl;return t;}
var tC=_mkTab('联系人'),tL=_mkTab('通话记录');
tabBar.appendChild(tC);tabBar.appendChild(tL);
root.appendChild(tabBar);

var _tabSep=_div('');
_tabSep.style.cssText='height:.5px;background:rgba(255,255,255,.10);flex-shrink:0;margin:0 14px;';
root.appendChild(_tabSep);

var content=_div('');
content.style.cssText='flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;';
root.appendChild(content);

/* ══ AUDIO CACHE ══ */
var _memAudio={};
function _ttsHash(text,vid,spd,prov){var s=(prov||'minimax')+'|'+(text||'')+'|'+(vid||'')+'|'+(spd||1),h=0;for(var i=0;i<s.length;i++)h=((h<<5)-h+s.charCodeAt(i))|0;return 'v'+(h>>>0).toString(36);}
function _loadAStore(){try{return JSON.parse(TOP.localStorage.getItem('pp-tts-cache')||'[]');}catch(e){return[];}}
function _saveAStore(a){try{TOP.localStorage.setItem('pp-tts-cache',JSON.stringify(a));}catch(e){}}
function _getCachedUrl(hash){
  if(_memAudio[hash])return _memAudio[hash];
  var st=_loadAStore(),e=null;
  for(var i=0;i<st.length;i++)if(st[i].k===hash){e=st[i];break;}
  if(!e)return null;
  try{
    var bin=TOP.atob(e.b64),bytes=new Uint8Array(bin.length);
    for(var j=0;j<bin.length;j++)bytes[j]=bin.charCodeAt(j);
    var url=TOP.URL.createObjectURL(new TOP.Blob([bytes],{type:'audio/mpeg'}));
    _memAudio[hash]=url;return url;
  }catch(ex){return null;}
}
function _cacheAudio(hash,blob){
  if(!cfg.ttsEnableCache)return;
  var maxN=parseInt(cfg.ttsMaxCache)||0;
  var reader=new TOP.FileReader();
  reader.onloadend=function(){
    var b64=reader.result.split(',')[1];
    var st=_loadAStore().filter(function(x){return x.k!==hash;});
    st.push({k:hash,b64:b64,ts:Date.now()});
    if(maxN>0&&st.length>maxN){st.sort(function(a,b){return b.ts-a.ts;});st=st.slice(0,maxN);}
    _saveAStore(st);
    if(!_memAudio[hash]){var url=TOP.URL.createObjectURL(blob);_memAudio[hash]=url;}
  };
  reader.readAsDataURL(blob);
}
function _playTtsCached(text,voiceId,speed,provider,onUrl,onErr){
  var hash=_ttsHash(text,voiceId,speed,provider);
  var cached=_getCachedUrl(hash);
  if(cached){onUrl(cached,hash);return;}
  _tts(text,voiceId,speed,_sttLang(),provider,function(blob){
    _cacheAudio(hash,blob);
    var url=TOP.URL.createObjectURL(blob);_memAudio[hash]=url;
    onUrl(url,hash);
  },onErr);
}
function _regenTts(text,voiceId,speed,provider,onUrl,onErr){
  _tts(text,voiceId,speed,_sttLang(),provider,function(blob){
    var hash=_ttsHash(text,voiceId,speed,provider);
    _cacheAudio(hash,blob);
    var url=TOP.URL.createObjectURL(blob);_memAudio[hash]=url;
    onUrl(url,hash);
  },onErr);
}

/* ══ CONFIRM DIALOG ══ */
function _showConfirm(msg,onYes){
  var mask=_div('');
  mask.style.cssText='position:absolute;inset:0;background:rgba(0,0,0,.48);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:center;justify-content:center;';
  var dlg=_div('');
  dlg.style.cssText='background:rgba(26,26,28,.92);-webkit-backdrop-filter:blur(28px) saturate(1.5);backdrop-filter:blur(28px) saturate(1.5);border:.5px solid rgba(255,255,255,.16);border-radius:18px;padding:20px 18px 16px;width:224px;display:flex;flex-direction:column;gap:14px;box-shadow:0 12px 40px rgba(0,0,0,.60);';
  dlg.appendChild(_div('font-size:14px;color:rgba(255,255,255,.88);text-align:center;line-height:1.55;',msg));
  var btns=_div('display:flex;gap:8px;');
  var bNo=_div('ph4-btn','取消');bNo.style.flex='1';bNo.style.justifyContent='center';
  var bYes=_div('ph4-btn','确认');bYes.style.flex='1';bYes.style.justifyContent='center';
  bNo.addEventListener('click',function(){mask.remove();});
  bYes.addEventListener('click',function(){mask.remove();onYes&&onYes();});
  btns.appendChild(bNo);btns.appendChild(bYes);dlg.appendChild(btns);mask.appendChild(dlg);
  root.appendChild(mask);
}

/* ══ CONTACTS ══ */

function _viewContacts(){
  var wrap=_div('');wrap.style.cssText='flex:1;min-height:0;overflow-y:auto;padding:0 0 16px;';
  var chars=sbS.characters||[];
  if(!chars.length){
    wrap.appendChild(_div('padding:48px 20px;text-align:center;font-size:13px;color:rgba(255,255,255,.25);','请先在「通讯录」App 中添加角色'));
    return wrap;
  }
  var card=_div('');
  chars.forEach(function(ch,ci){
    var row=_div('ph4-row');row.style.cursor='pointer';
    row.appendChild(_mkAv(ch.name,ch.avatar,40));
    var rb=_div('flex:1;min-width:0;');
    /* 在线/离线：顺色，不用绿色 */
    var onlineTxt=ch.ttsEnabled?'在线':'离线';
    var onlineAlpha=ch.ttsEnabled?'rgba(255,255,255,.65)':'rgba(255,255,255,.28)';
    rb.innerHTML='<div style="font-size:15px;color:rgba(255,255,255,.9);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+_esc(ch.name)+'</div>'
      +'<div style="font-size:11px;color:'+onlineAlpha+';margin-top:1px;">'+onlineTxt+'</div>'
      +((ch.wbIds&&ch.wbIds.length)?'<div style="font-size:10px;color:rgba(255,255,255,.38);margin-top:1px;">已绑定世界书</div>':'');
    var cb=_div('');
    cb.style.cssText='width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:background .15s;-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);';
    var svgPhone='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.70)" stroke-width="2.2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.69A2 2 0 012 .9h3a2 2 0 012 1.72 13 13 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 13 13 0 002.81.7A2 2 0 0122 16.92z"/></svg>';
    cb.innerHTML=svgPhone;
    cb.addEventListener('mouseenter',function(){cb.style.background='rgba(255,255,255,.16)';});
    cb.addEventListener('mouseleave',function(){cb.style.background='rgba(255,255,255,.08)';});
    cb.addEventListener('click',function(e){e.stopPropagation();_startCall(ch,[]);});
    row.addEventListener('click',function(){_startCall(ch,[]);});
    row.appendChild(rb);row.appendChild(cb);card.appendChild(row);
  });
  wrap.appendChild(card);return wrap;
}


/* ══ LOGS ══ */
function _viewLogs(){
  var wrap=_div('');wrap.style.cssText='flex:1;min-height:0;overflow-y:auto;padding:4px 0 16px;';
  var logs=_loadLogs().slice();

  if(!logs.length){
    wrap.appendChild(_div('padding:40px 20px;text-align:center;font-size:13px;color:rgba(255,255,255,.25);','暂无通话记录'));
    return wrap;
  }

  /* ══ 注入工具栏 ══
   * 逻辑：
   *  - tap 记录行 = 切换选中（高亮）
   *  - [清除]    = 取消全部选中
   *  - [注入]    = 将选中记录准备为下次发送时注入；已有 pending 时显示"取消注入"，点击清除
   *  - [总结]    = 对选中记录调用总结 API 生成摘要条目
   */
  var selSet={};  /* id -> bool */

  function _anySelected(){return Object.keys(selSet).some(function(k){return selSet[k];});}

  /* toolbar */
  var tb=_div('');
  tb.style.cssText='padding:8px 14px 6px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;';

  var bClear=_div('ph4-btn','清除');
  var bInj=_div('ph4-btn','注入');
  var bSum=_div('ph4-btn','总结');
  var bDelSel=_div('ph4-btn dim','删除');
  var statusEl=_div('');
  statusEl.style.cssText='font-size:11px;color:rgba(255,255,255,.35);flex-shrink:0;margin-left:auto;';

  function _refreshBtns(){
    var hasSel=_anySelected();
    var hasPending=!!sbS.pendingPhoneInject;
    /* 清除：有选中才能用 */
    bClear.className=hasSel?'ph4-btn':'ph4-btn dim';
    /* 注入按钮：pending 时显示"取消注入"（always clickable）；无 pending 时"注入"需有选中 */
    if(hasPending){
      bInj.className='ph4-btn cancel';
      bInj.textContent='取消注入';
    }else{
      bInj.className=hasSel?'ph4-btn':'ph4-btn dim';
      bInj.textContent='注入';
    }
    /* 总结：需要有选中 */
    bSum.className=hasSel?'ph4-btn':'ph4-btn dim';
    bDelSel.className=hasSel?'ph4-btn':'ph4-btn dim';
  }
  _refreshBtns();

  /* 删除选中 */
  bDelSel.addEventListener('click',function(){
    var sel=logs.filter(function(l){return selSet[l.id];});
    if(!sel.length)return;
    _showConfirm('删除选中的 '+sel.length+' 条记录？',function(){
      var ids=sel.map(function(l){return l.id;});
      _saveLogs(_loadLogs().filter(function(l){return ids.indexOf(l.id)<0;}));
      setView('logs');
    });
  });

  /* 清除选中 */
  bClear.addEventListener('click',function(){
    Object.keys(selSet).forEach(function(id){
      selSet[id]=false;
      var r=logsCard.querySelector('[data-lid="'+id+'"]');
      if(r)r.style.background='';
    });
    _refreshBtns();
  });

  /* 注入 / 取消注入 */
  bInj.addEventListener('click',function(){
    if(sbS.pendingPhoneInject){
      /* 取消已有注入 */
      sbS.pendingPhoneInject=null;sbS.pendingPhoneInjectRaw=null;_W();
      try{
        var _cCtx=TOP.SillyTavern&&TOP.SillyTavern.getContext&&TOP.SillyTavern.getContext();
        if(_cCtx&&_cCtx.setExtensionPrompt)_cCtx.setExtensionPrompt('pp-phone-inject','',1,0);
      }catch(e){}
      statusEl.textContent='注入已取消';
      _refreshBtns();
      return;
    }
    var sel=logs.filter(function(l){return selSet[l.id];});
    if(!sel.length){_toast('请先选择记录');return;}
    var _injCtx=TOP.SillyTavern&&TOP.SillyTavern.getContext&&TOP.SillyTavern.getContext();
    var _injChar=(_injCtx&&_injCtx.name2)||'角色';
    var _injUser=(_injCtx&&_injCtx.name1)||'用户';
    var _dialogsStr=_fmtDialogs(sel);
    var _tpl=(cfg.injectPrompt||'以下是已发生的历史对话，仅供参考：\n\n{{已选注入内容}}');
    var _finalInject=_tpl
      .replace(/\{\{角色名称\}\}/g,_injChar)
      .replace(/\{\{用户名称\}\}/g,_injUser)
      .replace(/\{\{已选注入内容\}\}/g,_dialogsStr);
    /* 如果模板里没有{{已选注入内容}}，自动追加 */
    if(_finalInject.indexOf(_dialogsStr)<0)_finalInject=_finalInject+'\n\n'+_dialogsStr;
    sbS.pendingPhoneInjectRaw=_dialogsStr;  /* 纯对话，用于预览 */
    sbS.pendingPhoneInject=_finalInject;_W();
    /* 立即注入到 ST */
    try{
      if(_injCtx&&typeof _injCtx.setExtensionPrompt==='function'){
        /* position 0 = in system prompt (AT_SCENARIO) */
        if(_injCtx&&_injCtx.setExtensionPrompt)_injCtx.setExtensionPrompt('pp-phone-inject','',1,0);/* 改走用户消息前缀注入(injectCode), 不再注入系统提示词 */
        statusEl.textContent='已注入到SillyTavern';
        _toast('注入成功');
      }else{
        console.warn('[pp-phone] setExtensionPrompt not available on context:', _injCtx&&Object.keys(_injCtx).join(','));
        statusEl.textContent='注入已准备（ST接口不可用）';
        _toast('注入已准备，ST接口不可用');
      }
    }catch(e){
      console.error('[pp-phone] inject error:',e);
      statusEl.textContent='注入失败: '+e.message;
      _toast('注入失败: '+e.message);
    }
    _refreshBtns();
  });

  /* 总结 */
  var _sumBusy=false;
  bSum.addEventListener('click',function(){
    if(_sumBusy)return;
    var sel=logs.filter(function(l){return selSet[l.id];});
    if(!sel.length){_toast('请先选择记录');return;}
    _sumBusy=true;bSum.textContent='思考中…';bSum.className='ph4-btn dim';
    statusEl.textContent='正在总结…';
    _doSummarize(sel,statusEl,function(){
      _sumBusy=false;
      _refreshBtns();
      setView('logs');/* 刷新列表，显示新总结条目 */
    });
  });

  tb.appendChild(bClear);tb.appendChild(bInj);tb.appendChild(bSum);tb.appendChild(bDelSel);tb.appendChild(statusEl);
  wrap.appendChild(tb);

  /* logs list */
  var logsCard=_div('ph4-glass');logsCard.style.overflow='visible';

  logs.forEach(function(log,li){
    if(li>0)logsCard.appendChild(_div('height:.5px;background:rgba(255,255,255,.07);margin:0 14px;'));
    var chars=sbS.characters||[];
    var charObj=null;
    for(var ci=0;ci<chars.length;ci++)if(chars[ci].id===log.charId){charObj=chars[ci];break;}

    var row=_div('display:flex;align-items:center;padding:11px 14px;gap:10px;cursor:pointer;transition:background .12s;border-radius:0;');
    row.setAttribute('data-lid',log.id);

    /* tap = 切换选中 */
    row.addEventListener('click',function(){
      selSet[log.id]=!selSet[log.id];
      row.style.background=selSet[log.id]?'rgba(255,255,255,.08)':'';
      _refreshBtns();
    });

    var av=_mkAv(log.isSummary?'总':log.charName,charObj&&charObj.avatar,38);
    var rb=_div('flex:1;min-width:0;');
    /* 总结标签：顺色，不用橙色 */
    rb.innerHTML='<div style="font-size:15px;color:rgba(255,255,255,.9);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'
      +(log.isSummary?'<span style="font-size:10px;color:rgba(255,255,255,.45);margin-right:5px;border:.5px solid rgba(255,255,255,.25);border-radius:4px;padding:1px 5px;">总结</span>':'')
      +_esc(log.charName)+'</div>'
      +'<div style="font-size:11px;color:rgba(255,255,255,.30);margin-top:2px;">'+_dateStr(log.startTime)
      +(log.duration&&!log.isSummary?' · '+_fmt(log.duration):'')+(log.turns&&!log.isSummary?' · '+log.turns+'轮':'')+'</div>';
    var detBtn=_div('');
    detBtn.style.cssText='width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.08);border:.5px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);transition:background .1s;';
    detBtn.innerHTML='<svg width="8" height="13" viewBox="0 0 7 12" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 1 6 6 1 11"/></svg>';
    detBtn.addEventListener('mouseenter',function(){detBtn.style.background='rgba(255,255,255,.15)';});
    detBtn.addEventListener('mouseleave',function(){detBtn.style.background='rgba(255,255,255,.08)';});
    detBtn.addEventListener('click',function(e){e.stopPropagation();setView('log-detail',log);});
    row.appendChild(av);row.appendChild(rb);row.appendChild(detBtn);
    logsCard.appendChild(row);
  });
  wrap.appendChild(logsCard);

  return wrap;
}

/* ── 格式化对话 ── */
function _fmtDialogs(sel){
  return sel.map(function(log,idx){
    var lines=['[第'+(idx+1)+'段，对象：'+log.charName+']'];
    (log.history||[]).forEach(function(m){
      lines.push((m.role==='user'?((sbS.user&&sbS.user.name)||'用户'):log.charName)+': '+m.content);
    });
    lines.push('[结束]');return lines.join('\n');
  }).join('\n\n---\n\n');
}

/* ── 总结 ── */
function _defSumPrompt(){
  return'请对以下对话记录进行总结，使用第三人称客观描述，提炼关键信息、情感变化和重要事件。控制在300字以内。\n\n{{对话内容}}';
}
function _doSummarize(sel,statusEl,onDone){
  var tpl=_sumPrompt()||_defSumPrompt();
  var dialogText=_fmtDialogs(sel);
  var prompt=tpl.replace(/\{\{用户名字\}\}/g,(sbS.user&&sbS.user.name)||'用户')
               .replace(/\{\{对话内容\}\}/g,dialogText);
  _sumChat([{role:'user',content:prompt}],function(summary){
    var charNames=sel.length===1?sel[0].charName:sel.map(function(l){return l.charName;}).join('、');
    var sumLog={id:_uuid(),isSummary:true,charName:charNames,summaryOf:sel.map(function(l){return l.id;}),
      startTime:Date.now(),duration:0,turns:0,history:[{role:'assistant',content:summary}]};
    var all=_loadLogs();all.push(sumLog);_saveLogs(all);
    if(statusEl)statusEl.textContent='总结完成';
    _toast('总结已保存，可选中后点击注入');
    onDone&&onDone();
  },function(err){
    if(statusEl)statusEl.textContent='总结失败: '+err;
    _toast('总结失败: '+err);
    onDone&&onDone();
  });
}


/* ══ LOG DETAIL ══ */
function _viewLogDetail(log){
  var wrap=_div('');wrap.style.cssText='flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden;';
  var chars=sbS.characters||[];
  var charObj=null;
  for(var ci=0;ci<chars.length;ci++)if(chars[ci].id===log.charId){charObj=chars[ci];break;}

  /* header */
  var hdr=_div('display:flex;align-items:center;padding:12px 14px;gap:10px;flex-shrink:0;border-bottom:.5px solid rgba(255,255,255,.07);');
  var backBtn=_div('font-size:13px;color:rgba(255,255,255,.70);cursor:pointer;display:flex;align-items:center;gap:3px;flex-shrink:0;');
  backBtn.innerHTML='<svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="rgba(255,255,255,.70)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 1 1 6 6 11"/></svg><span>返回</span>';
  backBtn.addEventListener('click',function(){setView('logs');});
  var titleEl=_div('flex:1;text-align:center;font-size:16px;font-weight:600;color:rgba(255,255,255,.88);',_esc(log.isSummary?'总结 · '+log.charName:log.charName));
  var infoEl=_div('font-size:11px;color:rgba(255,255,255,.28);flex-shrink:0;text-align:right;',_dateStr(log.startTime)+(log.duration?' · '+_fmt(log.duration):''));
  hdr.appendChild(backBtn);hdr.appendChild(titleEl);hdr.appendChild(infoEl);
  wrap.appendChild(hdr);

  /* bubbles */
  var bubbles=_div('');bubbles.style.cssText='flex:1;min-height:0;overflow-y:auto;padding:10px 14px;display:flex;flex-direction:column;gap:6px;';
  var hist=JSON.parse(JSON.stringify(log.history||[]));

  /* TTS status text shown in infoEl during playback */
  function _setState_det(s){infoEl.textContent=s?s:(_dateStr(log.startTime)+(log.duration?' · '+_fmt(log.duration):''));}
  function _renderBubbles(){
    bubbles.innerHTML='';
    hist.forEach(function(m,idx){
      var isU=(m.role==='user');
      var row=_div('display:flex;align-items:flex-end;gap:6px;'+(isU?'flex-direction:row-reverse;':''));
      var uname=(sbS.user&&sbS.user.name)||'我';
      var av=_mkAv(isU?uname:(log.charName),isU?(sbS.user&&sbS.user.avatar||null):(charObj&&charObj.avatar||null),22);
      var bWrap=_div('display:flex;flex-direction:column;align-items:'+(isU?'flex-end':'flex-start')+';max-width:76%;gap:3px;');
      var b=_div('');
      b.style.cssText='padding:7px 11px;word-break:break-word;font-size:13px;line-height:1.5;cursor:pointer;'
        +'border-radius:'+(isU?'14px 14px 4px 14px':'14px 14px 14px 4px')
        +';background:'+(isU?'rgba(255,255,255,.12)':'rgba(255,255,255,.08)')
        +';-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);'
        +'border:.5px solid rgba(255,255,255,.10);color:rgba(255,255,255,.88);transition:background .1s;';
      b.textContent=m.content;
      var editBar=null;
      b.addEventListener('click',function(e){
        e.stopPropagation();
        if(editBar){editBar.parentNode&&editBar.parentNode.removeChild(editBar);editBar=null;return;}
        editBar=_div('display:flex;gap:5px;margin-top:4px;'+(isU?'justify-content:flex-end;':''));
        var bEdit=_div('ph4-ebtn','编辑');
        var bDel=_div('ph4-ebtn','删除');
        bEdit.addEventListener('click',function(ev){
          ev.stopPropagation();
          var ta=TOPDOC.createElement('textarea');
          ta.style.cssText='width:100%;box-sizing:border-box;min-height:60px;padding:6px 9px;background:rgba(255,255,255,.10);border:.5px solid rgba(255,255,255,.35);border-radius:9px;color:rgba(255,255,255,.9);font-size:13px;font-family:inherit;outline:none;resize:vertical;line-height:1.5;';
          ta.value=b.textContent;ta.addEventListener('mousedown',function(e2){e2.stopPropagation();});
          bWrap.insertBefore(ta,b);b.style.display='none';
          var bOk=_div('ph4-ebtn','保存');bOk.style.marginTop='4px';
          bOk.addEventListener('click',function(ev2){
            ev2.stopPropagation();
            var nv=ta.value.trim();if(!nv)return;
            hist[idx].content=nv;
            var allLogs=_loadLogs();
            for(var i=0;i<allLogs.length;i++){if(allLogs[i].id===log.id){allLogs[i].history=hist;break;}}
            _saveLogs(allLogs);log.history=hist;
            _renderBubbles();
          });
          editBar.appendChild(bOk);
        });
        bDel.addEventListener('click',function(ev){
          ev.stopPropagation();
          hist.splice(idx,1);
          var allLogs=_loadLogs();
          for(var i=0;i<allLogs.length;i++){if(allLogs[i].id===log.id){allLogs[i].history=hist;break;}}
          _saveLogs(allLogs);log.history=hist;
          _renderBubbles();
        });
        editBar.appendChild(bEdit);editBar.appendChild(bDel);
        if(m.role==='assistant'&&charObj){
          var bPl=_div('ph4-ebtn','播放');
          bPl.addEventListener('click',function(ev){
            ev.stopPropagation();
            editBar.remove();editBar=null;
            _setState_det('speaking');
            _playTtsCached(m.content,_ttsVoiceIdFor(charObj),charObj.ttsSpeed||1.0,_ttsProviderFor(charObj),function(url){
              var a=new TOP.Audio(url);a.play();a.onended=function(){_setState_det('');};
            },function(err){_toast('TTS: '+err);_setState_det('');});
          });
          var bRg=_div('ph4-ebtn','重新生成');
          bRg.addEventListener('click',function(ev){
            ev.stopPropagation();
            editBar.remove();editBar=null;
            _setState_det('生成中…');
            _regenTts(m.content,_ttsVoiceIdFor(charObj),charObj.ttsSpeed||1.0,_ttsProviderFor(charObj),function(url){
              var a=new TOP.Audio(url);a.play();a.onended=function(){_setState_det('');};
            },function(err){_toast('TTS: '+err);_setState_det('');});
          });
          editBar.appendChild(bPl);editBar.appendChild(bRg);
        }
        bWrap.appendChild(editBar);
      });
      bWrap.appendChild(b);row.appendChild(av);row.appendChild(bWrap);
      bubbles.appendChild(row);
    });
    if(!hist.length)bubbles.appendChild(_div('padding:30px;text-align:center;font-size:13px;color:rgba(255,255,255,.25);','暂无消息'));
    TOP.setTimeout(function(){bubbles.scrollTop=bubbles.scrollHeight;},30);
  }
  _renderBubbles();
  wrap.appendChild(bubbles);

  /* action bar */
  var actBar=_div('flex-shrink:0;padding:10px 14px 14px;display:flex;gap:8px;border-top:.5px solid rgba(255,255,255,.07);');
  if(charObj&&!log.isSummary){
    var contBtn=_div('ph4-btn','继续通话');contBtn.style.flex='1';contBtn.style.justifyContent='center';
    contBtn.addEventListener('click',function(){_startCall(charObj,hist);});
    actBar.appendChild(contBtn);
  }
  var delLogBtn=_div('ph4-btn','删除记录');
  delLogBtn.addEventListener('click',function(){
    _showConfirm('删除此条记录？',function(){
      _saveLogs(_loadLogs().filter(function(l){return l.id!==log.id;}));
      setView('logs');
    });
  });
  actBar.appendChild(delLogBtn);
  wrap.appendChild(actBar);
  return wrap;
}

/* ══ BUILD PROMPT ══ */
function _buildPrompt(char){
  var stCtx=TOP.SillyTavern&&TOP.SillyTavern.getContext&&TOP.SillyTavern.getContext();
  var tpl=_callPrompt()||_defaultVcPrompt();
  var charName=(char&&char.name)||'';
  var charDesc=(char&&char.persona)||'';
  var userName=(sbS.user&&sbS.user.name)||(stCtx&&stCtx.name1)||'用户';
  var userDesc=(sbS.user&&sbS.user.persona)||'';
  var now=new Date();
  var timeStr=now.getFullYear()+'年'+(now.getMonth()+1)+'月'+now.getDate()+'日 '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
  var wbStr=_getWbText(char);
  var stHist=_getSTHistory(_stHistN());
  /* ── 对话内容（历史，不含当前输入）& 用户输入 ── */
  var dialogueStr='';
  var userInputStr='';
  try{
    var _dh=(_vc&&_vc.history)||[];
    /* last item is current user input (already pushed before _buildPrompt) */
    var _dhPast=_dh.length>0&&_dh[_dh.length-1].role==='user'?_dh.slice(0,-1):_dh;
    var _dn=_callDepth();
    var _dhSlice=_dn>0?_dhPast.slice(-_dn*2):_dhPast;
    if(_dhSlice.length){
      dialogueStr=_dhSlice.map(function(m){
        var name=m.role==='user'?(userName||'用户'):charName;
        return name+': '+m.content;
      }).join('\n');
    }
    if(_dh.length>0&&_dh[_dh.length-1].role==='user'){
      userInputStr=_dh[_dh.length-1].content;
    }
  }catch(_de){}
  /* ── Horae总结 ── */
  var horaeStr='';
  try{
    var _hs=TOP.Horae&&TOP.Horae.getLatestState&&TOP.Horae.getLatestState();
    if(_hs){
      var _hl=['[Horae 状态]'];
      if(_hs.timestamp&&_hs.timestamp.story_date)_hl.push('时间：'+_hs.timestamp.story_date+' '+(_hs.timestamp.story_time||''));
      if(_hs.scene&&_hs.scene.location){var _sc='场景：'+_hs.scene.location;if(_hs.scene.atmosphere)_sc+=' | '+_hs.scene.atmosphere;_hl.push(_sc);}
      if(_hs.scene&&_hs.scene.characters_present&&_hs.scene.characters_present.length){
        _hl.push('在场：'+_hs.scene.characters_present.map(function(c){var co=_hs.costumes&&_hs.costumes[c];return co?c+'('+co+')':c;}).join('、'));
      }
      if(_hs.affection&&Object.keys(_hs.affection).length)_hl.push('好感度：'+Object.entries(_hs.affection).map(function(e){return e[0]+':'+e[1];}).join(' | '));
      if(_hs.items&&Object.keys(_hs.items).length)_hl.push('物品：'+Object.keys(_hs.items).join('、'));
      var _hevts=[];
      try{
        /* 使用 Horae API 获取全部事件（含非重要，排除_skipHorae楼层） */
        var _hevtRaw=TOP.Horae.getEvents&&TOP.Horae.getEvents(0,'all')||[];
        _hevtRaw.forEach(function(item){if(item&&item.event)_hevts.push(item.event);});
      }catch(_){}
      if(_hevts.length){_hl.push('\n[事件记录]');_hevts.forEach(function(e){_hl.push('· ['+(e.level||'普通')+'] '+(e.summary||''));});}
      horaeStr=_hl.join('\n');
    }
  }catch(_he){}
  return tpl
    .replace(/\{\{角色名称\}\}/g,charName)
    .replace(/\{\{角色设定\}\}/g,charDesc)
    .replace(/\{\{用户名称\}\}/g,userName)
    .replace(/\{\{用户设定\}\}/g,userDesc?'【用户设定】\n'+userDesc:'')
    .replace(/\{\{世界书\}\}/g,wbStr?'【世界书】\n'+wbStr:'')
    .replace(/\{\{当前时间\}\}/g,timeStr)
    .replace(/\{\{酒馆历史\}\}/g,stHist?'【聊天历史】\n'+stHist:'')
    .replace(/\{\{Horae总结\}\}/g,horaeStr)
    .replace(/\{\{对话内容\}\}/g,dialogueStr)
    .replace(/\{\{用户输入\}\}/g,userInputStr);
}



/* ── 页内弹窗（替代浏览器 alert/prompt，不退出全屏） ── */
function _vnmOverlayBase(content,onDone){
  var od=TOPDOC.createElement('div');
  od.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.62);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';
  var box=TOPDOC.createElement('div');
  box.style.cssText='background:#1c1c28;border-radius:16px;padding:22px 24px;min-width:280px;max-width:420px;width:100%;display:flex;flex-direction:column;gap:14px;box-shadow:0 8px 40px rgba(0,0,0,.6);';
  box.appendChild(content);
  od.appendChild(box);
  TOPDOC.body.appendChild(od);
  od.addEventListener('click',function(e){if(e.target===od){onDone(null);od.remove();}});
  return {od:od,box:box};
}
function _vnmAlert(msg){
  var lbl=TOPDOC.createElement('div');lbl.style.cssText='color:rgba(255,255,255,.85);font-size:14px;line-height:1.6;white-space:pre-wrap;';lbl.textContent=msg;
  var btn=TOPDOC.createElement('button');btn.textContent='确定';
  btn.style.cssText='align-self:flex-end;padding:7px 22px;border-radius:20px;background:rgba(255,255,255,.1);border:none;color:rgba(255,255,255,.8);font-size:13px;cursor:pointer;font-family:inherit;';
  var wrap=TOPDOC.createElement('div');wrap.appendChild(lbl);wrap.appendChild(btn);
  var ov=_vnmOverlayBase(wrap,function(){});
  btn.onclick=function(){ov.od.remove();};
}
function _vnmPrompt(msg,def,cb){
  var lbl=TOPDOC.createElement('div');lbl.style.cssText='color:rgba(255,255,255,.75);font-size:13px;line-height:1.5;white-space:pre-wrap;';lbl.textContent=msg;
  var inp=TOPDOC.createElement('input');inp.type='text';inp.value=def||'';
  inp.style.cssText='padding:8px 12px;background:rgba(255,255,255,.07);border:.5px solid rgba(255,255,255,.15);border-radius:10px;color:rgba(255,255,255,.9);font-size:14px;outline:none;font-family:inherit;width:100%;box-sizing:border-box;';
  var row=TOPDOC.createElement('div');row.style.cssText='display:flex;gap:8px;justify-content:flex-end;';
  var bOk=TOPDOC.createElement('button');bOk.textContent='确定';
  bOk.style.cssText='padding:7px 22px;border-radius:20px;background:rgba(255,255,255,.12);border:none;color:rgba(255,255,255,.85);font-size:13px;cursor:pointer;font-family:inherit;';
  var bCc=TOPDOC.createElement('button');bCc.textContent='取消';
  bCc.style.cssText='padding:7px 18px;border-radius:20px;background:none;border:.5px solid rgba(255,255,255,.1);color:rgba(255,255,255,.4);font-size:13px;cursor:pointer;font-family:inherit;';
  row.appendChild(bCc);row.appendChild(bOk);
  var wrap=TOPDOC.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;gap:10px;';
  wrap.appendChild(lbl);wrap.appendChild(inp);wrap.appendChild(row);
  var ov=_vnmOverlayBase(wrap,function(){cb(null);});
  var done=false;
  function _ok(){if(done)return;done=true;ov.od.remove();cb(inp.value);}
  function _cc(){if(done)return;done=true;ov.od.remove();cb(null);}
  bOk.onclick=_ok;bCc.onclick=_cc;
  inp.addEventListener('keydown',function(e){if(e.key==='Enter')_ok();if(e.key==='Escape')_cc();});
  TOP.setTimeout(function(){inp.focus();inp.select();},50);
}
TOP._vnmAlert=_vnmAlert;
TOP._vnmPrompt=_vnmPrompt;

/* ── Preview full prompt (called from settings label button) ── */
TOP._vnmPreviewPrompt=function(btn){
  var chars=sbS.characters||[];
  var field=(btn&&btn.closest&&btn.closest('.ppfield'))||
            (btn&&btn.parentElement&&(function(el){while(el){if(el.classList&&(el.classList.contains('ppfield')||el.tagName==='LABEL'))return el;el=el.parentElement;}return null;})(btn));
  if(!field&&btn)field=btn.parentElement;
  if(!field){_vnmAlert('请先在通讯录中添加角色');return;}
  var existing=field.querySelector('.pp-ipv');
  if(existing){
    existing.remove();
    if(btn){btn.textContent='预览完整提示词';delete btn._pvOpen;}
    return;
  }
  if(!chars.length){
    var errDiv=TOPDOC.createElement('div');
    errDiv.className='pp-ipv';
    errDiv.style.cssText='margin-top:6px;padding:8px 10px;border-radius:8px;background:rgba(255,255,255,.05);color:rgba(255,255,255,.45);font-size:12px;';
    errDiv.textContent='请先在通讯录中添加角色';
    field.appendChild(errDiv);return;
  }
  var wrap=TOPDOC.createElement('div');
  wrap.className='pp-ipv';
  wrap.style.cssText='margin-top:6px;border:.5px solid rgba(255,255,255,.10);border-radius:10px;overflow:hidden;';
  var ta=TOPDOC.createElement('textarea');
  ta.readOnly=true;
  ta.style.cssText='width:100%;box-sizing:border-box;min-height:140px;max-height:300px;padding:10px 12px;background:rgba(255,255,255,.04);border:none;color:rgba(255,255,255,.68);font-size:11px;font-family:monospace;resize:vertical;outline:none;line-height:1.6;display:block;';
  function _show(pidx){
    ta.value=_buildPrompt(chars[pidx]);
    if(charRow){
      for(var i=0;i<charRow.children.length;i++)
        charRow.children[i].style.background=i===pidx?'rgba(255,255,255,.16)':'rgba(255,255,255,.05)';
    }
  }
  var charRow=null;
  if(chars.length>1){
    charRow=TOPDOC.createElement('div');
    charRow.style.cssText='display:flex;flex-wrap:wrap;gap:3px;padding:6px 8px;border-bottom:.5px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);';
    chars.forEach(function(c,i){
      var cb=TOPDOC.createElement('button');
      cb.textContent=c.name;
      cb.style.cssText='padding:2px 8px;border-radius:8px;font-size:11px;cursor:pointer;font-family:inherit;border:.5px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:rgba(255,255,255,.6);';
      cb.onclick=function(){_show(i);};
      charRow.appendChild(cb);
    });
    wrap.appendChild(charRow);
  }
  wrap.appendChild(ta);
  field.appendChild(wrap);
  _show(0);
  if(btn){btn.textContent='收起预览';}
};
TOP._vnmPreviewSum=function(btn){
  var field=btn&&btn.closest&&btn.closest('.ppfield');
  if(!field)return;
  var existing=field.querySelector('.pp-ipv');
  if(existing){existing.remove();if(btn)btn.textContent='预览总结提示词';return;}
  var tplText=cfg.sumPrompt||'';
  var fields=TOPDOC.querySelectorAll&&TOPDOC.querySelectorAll('.ppfield');
  if(fields)fields.forEach(function(fEl){var h=fEl.querySelector('.ppflb');if(h&&h.textContent.indexOf('总结')>=0){var ta2=fEl.querySelector('textarea');if(ta2)tplText=ta2.value;}});
  var preview=tplText.replace(/\{\{用户名字\}\}/g,(sbS.user&&sbS.user.name)||'用户').replace(/\{\{对话内容\}\}/g,'[通话对话内容将在此处插入]');
  var wrap=TOPDOC.createElement('div');wrap.className='pp-ipv';
  wrap.style.cssText='margin-top:6px;border:.5px solid rgba(255,255,255,.10);border-radius:10px;overflow:hidden;';
  var ta=TOPDOC.createElement('textarea');ta.readOnly=true;ta.value=preview;
  ta.style.cssText='width:100%;box-sizing:border-box;min-height:120px;max-height:280px;padding:10px 12px;background:rgba(255,255,255,.04);border:none;color:rgba(255,255,255,.68);font-size:11px;font-family:monospace;resize:vertical;outline:none;line-height:1.6;display:block;';
  wrap.appendChild(ta);field.appendChild(wrap);
  if(btn)btn.textContent='收起预览';
};
TOP._vnmPreviewInj=function(btn){
  var field=btn&&btn.closest&&btn.closest('.ppfield');
  if(!field)return;
  var existing=field.querySelector('.pp-ipv');
  if(existing){existing.remove();if(btn)btn.textContent='预览注入前缀';return;}
  var stCtx=TOP.SillyTavern&&TOP.SillyTavern.getContext&&TOP.SillyTavern.getContext();
  var charNm=(stCtx&&stCtx.name2)||'[当前ST角色]';
  var userNm=(stCtx&&stCtx.name1)||'[当前用户]';
  var tplText=cfg.injectPrompt||'以下是已发生的历史对话，仅供参考：';
  var fields=TOPDOC.querySelectorAll&&TOPDOC.querySelectorAll('.ppfield');
  if(fields)fields.forEach(function(fEl){var h=fEl.querySelector('.ppflb');if(h&&h.textContent.indexOf('注入')>=0){var ta2=fEl.querySelector('textarea');if(ta2)tplText=ta2.value;}});
  var _rawDialogs=sbS.pendingPhoneInjectRaw||'';
  var preview=_rawDialogs
    ?tplText.replace(/\{\{角色名称\}\}/g,charNm).replace(/\{\{用户名称\}\}/g,userNm).replace(/\{\{已选注入内容\}\}/g,_rawDialogs)
    :'（尚无注入内容，请先在通话记录中选择并点击注入）';
  var wrap=TOPDOC.createElement('div');wrap.className='pp-ipv';
  wrap.style.cssText='margin-top:6px;border:.5px solid rgba(255,255,255,.10);border-radius:10px;overflow:hidden;';
  var ta=TOPDOC.createElement('textarea');ta.readOnly=true;ta.value=preview;
  ta.style.cssText='width:100%;box-sizing:border-box;min-height:100px;max-height:240px;padding:10px 12px;background:rgba(255,255,255,.04);border:none;color:rgba(255,255,255,.68);font-size:11px;font-family:monospace;resize:vertical;outline:none;line-height:1.6;display:block;';
  wrap.appendChild(ta);field.appendChild(wrap);
  if(btn)btn.textContent='收起预览';
};

/* ══ CALL VIEW ══ */
function _viewCalling(char,initialHistory){
  var wrap=_div('');wrap.style.cssText='flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden;position:relative;';

  /* top: avatar + name + timer + state */
  var topSec=_div('flex-shrink:0;display:flex;flex-direction:column;align-items:center;padding:28px 16px 6px;gap:5px;');
  topSec.appendChild(_mkAv(char.name,char.avatar||null,72));
  topSec.appendChild(_div('font-size:20px;font-weight:600;color:rgba(255,255,255,.92);',_esc(char.name)));
  var timerEl=_div('font-size:14px;color:rgba(255,255,255,.45);letter-spacing:1.5px;font-variant-numeric:tabular-nums;','00:00');
  topSec.appendChild(timerEl);
  var stateEl=_div('font-size:12px;color:rgba(255,255,255,.35);min-height:16px;','');
  topSec.appendChild(stateEl);
  wrap.appendChild(topSec);

  /* bubble area */
  var bubblesWrap=_div('');bubblesWrap.style.cssText='flex:1;min-height:0;overflow-y:auto;padding:6px 14px;display:flex;flex-direction:column;gap:5px;';
  wrap.appendChild(bubblesWrap);

  /* interim */
  var interimBar=_div('flex-shrink:0;min-height:18px;padding:2px 18px;font-size:12px;color:rgba(255,255,255,.38);font-style:italic;letter-spacing:.1px;');
  wrap.appendChild(interimBar);

  /* iOS bottom controls */
  var botBar=_div('flex-shrink:0;padding:12px 0 32px;display:flex;align-items:flex-end;justify-content:space-evenly;');
  var SVG_REROLL='<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.82)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>';
  var SVG_END='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.90)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.68 5.26A10 10 0 0121 15.34"/><path d="M3 8.68A10 10 0 008.66 21"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
  var SVG_MIC='<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.82)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v3a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
  var SVG_MUTE='<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.82)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/><path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';

  function _mkCBtn(svg,label,sz,alpha){
    var col=_div('display:flex;flex-direction:column;align-items:center;gap:7px;');
    var btn=_div('');
    btn.style.cssText='width:'+sz+'px;height:'+sz+'px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;'
      +'background:rgba(255,255,255,'+alpha+');'
      +'-webkit-backdrop-filter:blur(32px) saturate(180%);backdrop-filter:blur(32px) saturate(180%);'
      +'transition:background .14s,transform .1s,opacity .12s;user-select:none;-webkit-user-select:none;';
    btn.innerHTML=svg;
    var lbl=_div('font-size:10px;color:rgba(255,255,255,.38);letter-spacing:.4px;text-align:center;',label);
    col.appendChild(btn);col.appendChild(lbl);
    function _p(){btn.style.transform='scale(.90)';}function _r(){btn.style.transform='';}
    btn.addEventListener('mousedown',_p);btn.addEventListener('touchstart',_p);
    btn.addEventListener('mouseup',_r);btn.addEventListener('touchend',_r);btn.addEventListener('mouseleave',_r);
    return {col:col,btn:btn,lbl:lbl};
  }

  var rerollO=_mkCBtn(SVG_REROLL,'重新Roll',52,0.11);
  var endO=_mkCBtn(SVG_END,'挂断',64,0.18);
  var micO=_mkCBtn(SVG_MIC,'说话',52,0.11);
  botBar.appendChild(rerollO.col);botBar.appendChild(endO.col);botBar.appendChild(micO.col);
  wrap.appendChild(botBar);
  var rerollBtn=rerollO.btn,endBtn=endO.btn,micBtn=micO.btn,micLbl=micO.lbl;

  /* timer */
  var timerIv=TOP.setInterval(function(){_vc.timerMs+=1000;timerEl.textContent=_fmt(_vc.timerMs);},1000);
  _vc._timerIv=timerIv;

  function _setState(s){
    _vc.state=s;
    stateEl.textContent={idle:'',listening:'聆听中',thinking:'思考中…',speaking:'说话中…'}[s]||'';
    stateEl.className=(s==='listening')?'ph4-listening':'';
  }

  /* per-bubble audio map */
  var _bAudio={};
  var _ttsTextByBidx={};
  var _bidxC=0;
  var _activePopup=null;
  function _closePopup(){if(_activePopup){_activePopup.remove();_activePopup=null;}}
  wrap.addEventListener('click',function(){_closePopup();});

  function _addBubble(role,text){
    var isU=(role==='user');
    var myIdx=_bidxC++;

    /* parse bilingual: main text + 「translation」 */
    function _parseBi(t){
      var m=t.match(/^([\s\S]*?)「([\s\S]+?)」\s*$/);
      if(!m)m=t.match(/^([\s\S]*?)「([\s\S]+)$/); /* 容错：「未闭合也视为翻译 */
      if(!m)return{main:t,trans:null};
      var mn=(m[1]||'').replace(/[\n\r]+$/,'').trim();
      return{main:mn||t,trans:(m[2]||'').trim()};
    }
    var bi=_parseBi(text);

    var row=_div('display:flex;align-items:flex-end;gap:6px;'+(isU?'flex-direction:row-reverse;':''));
    var uname=(sbS.user&&sbS.user.name)||'我';
    var av=_mkAv(isU?uname:char.name,isU?(sbS.user&&sbS.user.avatar||null):(char.avatar||null),20);

    /* bubble shell */
    var b=_div('');
    b.dataset.full=text;
    b.style.cssText='padding:8px 12px;box-sizing:border-box;'
      +'max-width:min(340px,calc(100vw - 96px));min-width:64px;'
      +'word-break:break-word;white-space:pre-wrap;'
      +'font-size:13px;line-height:1.55;cursor:pointer;'
      +'border-radius:'+(isU?'16px 16px 5px 16px':'16px 16px 16px 5px')
      +';background:'+(isU?'rgba(255,255,255,.10)':'rgba(255,255,255,.065)')
      +';-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);'
      +'color:rgba(255,255,255,.88);transition:background .1s;';

    /* main text node */
    var mainSpan=TOPDOC.createElement('span');
    mainSpan.textContent=bi.main;
    b.appendChild(mainSpan);

    /* translation fold section */
    if(bi.trans){
      var tBtn=_div('');
      tBtn.style.cssText='margin-top:5px;font-size:11px;color:rgba(255,255,255,.38);cursor:pointer;'
        +'display:inline-flex;align-items:center;gap:2px;padding:1px 6px 1px 0;user-select:none;';
      tBtn.textContent='译 ▾';
      var tDiv=_div('');
      tDiv.style.cssText='display:none;margin-top:5px;padding-top:6px;'
        +'border-top:.5px solid rgba(255,255,255,.10);'
        +'font-size:12px;line-height:1.5;color:rgba(255,255,255,.52);white-space:pre-wrap;';
      tDiv.textContent=bi.trans;
      var _tOpen=false;
      tBtn.addEventListener('click',function(e){
        e.stopPropagation();_tOpen=!_tOpen;
        tDiv.style.display=_tOpen?'block':'none';
        tBtn.textContent=_tOpen?'译 ▴':'译 ▾';
      });
      b.appendChild(TOPDOC.createElement('br'));
      b.appendChild(tBtn);
      b.appendChild(tDiv);
    }

    var bCol=_div('display:flex;flex-direction:column;align-items:'+(isU?'flex-end':'flex-start')+';gap:2px;');
    bCol.appendChild(b);

    /* bubble click → action popup */
    b.addEventListener('click',function(e){
      e.stopPropagation();_closePopup();
      var pop=_div('display:flex;flex-wrap:wrap;gap:4px;margin-top:3px;'+(isU?'justify-content:flex-end;':''));
      _activePopup=pop;

      /* edit */
      var bEd=_div('ph4-ebtn','编辑');
      bEd.addEventListener('click',function(ev){
        ev.stopPropagation();_closePopup();
        var ta2=TOPDOC.createElement('textarea');
        ta2.style.cssText='width:200px;max-width:78vw;box-sizing:border-box;min-height:52px;padding:6px 9px;background:rgba(255,255,255,.10);border:.5px solid rgba(255,255,255,.28);border-radius:10px;color:rgba(255,255,255,.9);font-size:13px;font-family:inherit;outline:none;resize:vertical;line-height:1.5;';
        ta2.value=b.dataset.full;
        ta2.addEventListener('mousedown',function(e2){e2.stopPropagation();});
        bCol.insertBefore(ta2,b);b.style.display='none';
        var bSv=_div('ph4-ebtn','保存');bSv.style.marginTop='2px';
        bSv.addEventListener('click',function(ev2){
          ev2.stopPropagation();var nv=ta2.value.trim();if(!nv)return;
          b.dataset.full=nv;
          var nb=_parseBi(nv);
          mainSpan.textContent=nb.main;
          b.style.display='';ta2.remove();bSv.remove();
          for(var fi=_vc.history.length-1;fi>=0;fi--){if(_vc.history[fi].role===role){_vc.history[fi].content=nv;break;}}
        });
        bCol.appendChild(bSv);
      });

      /* delete */
      var bDl=_div('ph4-ebtn','删除');
      bDl.addEventListener('click',function(ev){
        ev.stopPropagation();_closePopup();row.remove();
        for(var di=_vc.history.length-1;di>=0;di--){if(_vc.history[di].role===role){_vc.history.splice(di,1);break;}}
      });
      pop.appendChild(bEd);pop.appendChild(bDl);

      if(!isU){
        /* play */
        var bPl=_div('ph4-ebtn','播放');
        bPl.addEventListener('click',function(ev){
          ev.stopPropagation();_closePopup();
          var ad=_bAudio[myIdx];
          if(ad){var a=new TOP.Audio(ad);a.play();}
          else{_setState('speaking');_playTtsCached(_stripTrans(_ttsTextByBidx[myIdx]||text),_ttsVoiceIdFor(char),char.ttsSpeed||1.0,_ttsProviderFor(char),function(url){_bAudio[myIdx]=url;var a=new TOP.Audio(url);a.play();a.onended=function(){_setState('idle');};},function(err){_toast('TTS:'+err);_setState('idle');});}
        });
        /* regen */
        var bRg=_div('ph4-ebtn','重新生成语音');
        bRg.addEventListener('click',function(ev){
          ev.stopPropagation();_closePopup();_setState('speaking');
          _regenTts(_stripTrans(_ttsTextByBidx[myIdx]||text),_ttsVoiceIdFor(char),char.ttsSpeed||1.0,_ttsProviderFor(char),function(url){_bAudio[myIdx]=url;var a=new TOP.Audio(url);a.play();a.onended=function(){_setState('idle');};},function(err){_toast('TTS:'+err);_setState('idle');});
        });
        pop.appendChild(bPl);pop.appendChild(bRg);
      }
      bCol.appendChild(pop);
    });

    row.appendChild(av);row.appendChild(bCol);
    bubblesWrap.appendChild(row);
    TOP.setTimeout(function(){bubblesWrap.scrollTop=bubblesWrap.scrollHeight;},30);
    return myIdx;
  }
  /* populate history */
  if(initialHistory&&initialHistory.length){
    for(var hi=0;hi<initialHistory.length;hi++)_addBubble(initialHistory[hi].role,initialHistory[hi].content);
  }

  /* LLM reply: buffer until TTS ready, then show+play simultaneously */
  var listenLoop=false;

  // ── init sample presets ──
  (function(){
    var k='__vnm_p_promptTemplate';
    try{
      var ps=JSON.parse(localStorage.getItem(k)||'[]');
      if(!ps.some(function(p){return p.name==='双语对话（日语）';})){
        ps.push({name:'双语对话（日语）',content:"你正在扮演{{角色名称}}与{{用户名称}}进行对话。\n【角色设定】\n{{角色名称}}\n{{角色设定}}\n【用户设定】\n{{用户名称}}\n{{用户设定}}\n【世界背景信息】\n{{世界书}}\n【当前{{用户名称}}经历】\n{{酒馆历史}}\n请用简短自然的口语风格回复，30字以内，不使用任何 Markdown 格式，只说话不描述动作。\n输出内容为：日语\\n「中文翻译」"});
        localStorage.setItem(k,JSON.stringify(ps));
      }
    }catch(e){}
  })();

  function _doReply(){
    if(!_vc.callActive||_vc.state==='thinking'||_vc.state==='speaking')return;
    _setState('thinking');
    var sysPr=_buildPrompt(char);
    /* user message: formatted by userMsgTemplate */
    var _curInput=_vc.history.length>0&&_vc.history[_vc.history.length-1].role==='user'
      ?_vc.history[_vc.history.length-1].content:'';
    var _uTpl=(cfg.userMsgTemplate||'{{用户输入}}');
    var _uMsg=_uTpl.replace(/\{\{用户输入\}\}/g,_curInput);
    /* past history as messages[] (role:user/assistant) */
    var _histPast=_vc.history.length>0&&_vc.history[_vc.history.length-1].role==='user'
      ?_vc.history.slice(0,-1):_vc.history;
    var _dn=_callDepth();
    var _histSlice=_dn>0?_histPast.slice(-_dn*2):[];
    var msgs=[{role:'system',content:sysPr}].concat(_histSlice).concat([{role:'user',content:_uMsg}]);
    _phoneChat(msgs,function(reply){
      if(!reply||!reply.trim()){_setState('idle');if(listenLoop)_startListening();return;}
      _vc.history.push({role:'assistant',content:reply});
      if(char.ttsEnabled&&_ttsHasCreds(char)){
        /* TTS enabled + 对应语音源凭证已配置 → request audio */
        function _playReply(ttsText){
          _playTtsCached(_stripTrans(ttsText),_ttsVoiceIdFor(char),char.ttsSpeed||1.0,_ttsProviderFor(char),function(url){
            var bidx=_addBubble('assistant',reply);
            _bAudio[bidx]=url;_ttsTextByBidx[bidx]=ttsText;
            _setState('speaking');
            var aud=new TOP.Audio(url);aud.play();
            aud.onended=function(){_setState('idle');if(listenLoop)_startListening();};
          },function(err){
            console.warn('TTS:',err);_addBubble('assistant',reply);
            _setState('idle');if(listenLoop)_startListening();
          });
        }
        if(_ttsSpeakLangFor(char)==='ja'){
          _translateJa(reply,function(jaText){_playReply(jaText);},function(){_playReply(reply);});
        }else{
          _playReply(reply);
        }
      }else{
        _addBubble('assistant',reply);
        _setState('idle');if(listenLoop)_startListening();
      }
    },function(err){console.warn('LLM:',err);_toast('API错误: '+err);_setState('idle');if(listenLoop)_startListening();});
  }

  /* reroll */
  rerollBtn.addEventListener('click',function(){
    if(_vc.state==='thinking'||_vc.state==='speaking')return;
    if(recog){try{recog.abort();}catch(e){}recog=null;}
    _setState('idle');
    for(var ri=_vc.history.length-1;ri>=0;ri--){if(_vc.history[ri].role==='assistant'){_vc.history.splice(ri,1);break;}}
    var rows=bubblesWrap.children;
    for(var rj=rows.length-1;rj>=0;rj--){if(rows[rj].style.flexDirection!=='row-reverse'){bubblesWrap.removeChild(rows[rj]);break;}}
    _doReply();
  });

  /* STT: single-shot, restarts automatically in _doReply callback */
  var recog=null;

  function _setMicActive(on){
    listenLoop=on;
    if(on){
      micBtn.style.background='rgba(255,255,255,.26)';
      micBtn.innerHTML=SVG_MUTE;micLbl.textContent='静音';
    }else{
      micBtn.style.background='rgba(255,255,255,.11)';
      micBtn.innerHTML=SVG_MIC;micLbl.textContent='说话';
    }
  }

  function _startListening(){
    if(!listenLoop||_vc.state==='thinking'||_vc.state==='speaking')return;
    if(recog)return;
    var SR=TOP.SpeechRecognition||TOP.webkitSpeechRecognition;
    if(!SR){stateEl.textContent='不支持麦克风';return;}
    var r=new SR();
    recog=r;
    r.continuous=false;r.interimResults=true;
    r.lang=_sttLang()||'zh-CN';
    r.onstart=function(){if(recog===r)_setState('listening');};
    r.onresult=function(ev){
      if(recog!==r)return;
      var interim='',fin='';
      for(var ri2=ev.resultIndex;ri2<ev.results.length;ri2++){
        if(ev.results[ri2].isFinal)fin+=ev.results[ri2][0].transcript;
        else interim+=ev.results[ri2][0].transcript;
      }
      interimBar.textContent=interim||fin;
      if(fin){
        interimBar.textContent='';
        recog=null;
        _vc.history.push({role:'user',content:fin.trim()});
        _addBubble('user',fin.trim());
        _doReply();
      }
    };
    r.onerror=function(e){
      if(recog!==r)return;
      recog=null;
      console.warn('STT:',e.error);
      if(e.error==='not-allowed'||e.error==='service-not-allowed'){_setState('idle');stateEl.textContent='麦克风权限被拒绝，请在浏览器地址栏允许后重试';return;}
      if(listenLoop&&(e.error==='no-speech'||e.error==='audio-capture'))TOP.setTimeout(_startListening,600);
    };
    r.onend=function(){
      if(recog!==r)return;
      recog=null;
      if(listenLoop&&(_vc.state==='idle'||_vc.state==='listening'))TOP.setTimeout(_startListening,400);
    };
    try{r.start();}catch(ex){console.warn('STT start err:',ex);}
  }

  micBtn.addEventListener('click',function(){
    if(listenLoop){
      _setMicActive(false);
      if(recog)try{recog.abort();}catch(e){}
      _setState('idle');
    }else{
      _setMicActive(true);_startListening();
    }
  });

  endBtn.addEventListener('click',function(){_endCall();setView('logs');});
  _vc._stopMic=function(){_setMicActive(false);if(recog)try{recog.abort();}catch(e){}};

  /* auto-start */
  TOP.setTimeout(function(){if(_vc.state==='idle'){_setMicActive(true);_startListening();}},500);

  return wrap;
}


function _startCall(char,initialHistory){
  if(_vc._timerIv){TOP.clearInterval(_vc._timerIv);_vc._timerIv=null;}
  _vc.char=char;
  _vc.history=(initialHistory&&initialHistory.length)?JSON.parse(JSON.stringify(initialHistory)):[];
  _vc.timerMs=0;_vc.state='idle';_vc._callStart=Date.now();
  setView('calling');
  _vc.callActive=true;
}

function _endCall(){
  if(_vc._stopMic)_vc._stopMic();
  _vc.callActive=false;
  if(_vc._timerIv){TOP.clearInterval(_vc._timerIv);_vc._timerIv=null;}
  if(_vc.history&&_vc.history.length&&_vc.char){
    var dur=Math.max(0,Math.floor((Date.now()-(_vc._callStart||Date.now()))/1000));
    var newLog={id:_uuid(),charId:_vc.char.id,charName:_vc.char.name,
      startTime:_vc._callStart||Date.now(),duration:dur,turns:Math.floor(_vc.history.length/2),
      history:JSON.parse(JSON.stringify(_vc.history))};
    var logs=_loadLogs();logs.unshift(newLog);_saveLogs(logs);
  }
  _vc.char=null;_vc.history=[];_vc.state='idle';_vc.timerMs=0;
}

/* ══ ROUTING — 全部用闭包变量，不用 getElementById ══ */
function _setTab(name){
  tC.className='ph4-tab'+(name==='logs'?'':' on');
  tL.className='ph4-tab'+(name==='logs'?' on':'');
  content.innerHTML='';
  if(name==='logs')content.appendChild(_viewLogs());
  else content.appendChild(_viewContacts());
}

function setView(name,arg){
  content.innerHTML='';
  if(name==='calling'){
    tabBar.style.display='none';
    _tabSep.style.display='none';
    content.appendChild(_viewCalling(_vc.char,_vc.history));
  }else if(name==='log-detail'){
    tabBar.style.display='none';
    _tabSep.style.display='none';
    content.appendChild(_viewLogDetail(arg));
  }else if(name==='logs'){
    tabBar.style.display='flex';
    _tabSep.style.display='';
    _setTab('logs');
  }else{
    tabBar.style.display='flex';
    _tabSep.style.display='';
    _setTab('contacts');
  }
}

tC.addEventListener('click',function(){if(_vc.state!=='idle')return;_setTab('contacts');});
tL.addEventListener('click',function(){if(_vc.state!=='idle')return;_setTab('logs');});
/* ══ INIT ══ */
_setTab('contacts');
return root;
})
/* __PAGECODE_END__ */

/* __POST_BEGIN__ */
{
  "injectEnabled": true,
  "ppPlugin": true
}
/* __POST_END__ */
