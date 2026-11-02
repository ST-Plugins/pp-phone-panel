/* ============================================================================
 * PP Phone Panel — 壁纸 (pp-wallpaper-v2) 独立源码
 * 版本: 3.0.0
 * 说明: 本文件是权威源码，改代码改这里，然后用 node build.js pp-wallpaper-v2 生成
 *       extension/apps/pp-wallpaper-v2.js。不要直接改打包文件。
 * ============================================================================ */

/* __META_BEGIN__ */
{
  "id": "pp-wallpaper-v2",
  "name": "壁纸",
  "version": "3.0.0",
  "description": "重构版壁纸：纯服务器文件管理，无本地存储压力，单图/多图轮播，遮罩暗度调节。",
  "icon": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><circle cx=\"8.5\" cy=\"8.5\" r=\"1.6\"/><path d=\"M21 15l-5-5L5 21\"/>",
  "enabled": true,
  "settingsTitle": "壁纸设置",
  "settingsFields": [],
  "settingsValues": {},
  "injectEnabled": true,
  "ppPlugin": true
}
/* __META_END__ */

/* __INJECT_BEGIN__ */
(function(ctx){
var LKEY='pp-wallpaper-v2';
var TOP=window.parent;

/* 内部状态 */
var bgLayer=null;      // #pp-wp2-bg 图片层
var overlayLayer=null; // #pp-wp2-overlay 黑色遮罩层
var tickTimer=null;    // 每 150ms 读配置的定时器
var rotateTimer=null;  // 多图轮播的独立定时器
var rotateIdx=0;       // 轮播当前索引
var lastShownKey='';   // 上次显示的图 key，避免重复渲染

function loadConfig(){
  try{
    var r=JSON.parse(TOP.localStorage.getItem(LKEY)||'{}');
    r.imgs=r.imgs||[];
    r.mode=r.mode||'single';
    r.interval=r.interval||15;
    r.currentId=r.currentId||'';
    r.shuffle=!!r.shuffle;
    r.wallpaperOn=r.wallpaperOn!==false;
    r.overlayOpacity=(r.overlayOpacity==null?55:r.overlayOpacity);
    return r;
  }catch(e){ return {imgs:[],mode:'single',interval:15,currentId:'',shuffle:false,wallpaperOn:true,overlayOpacity:55}; }
}

/* 创建 DOM 元素 */
function ensureLayers(){
  if(bgLayer && overlayLayer) return;

  bgLayer=TOP.document.getElementById('pp-wp2-bg');
  if(!bgLayer){
    bgLayer=TOP.document.createElement('div');
    bgLayer.id='pp-wp2-bg';
    bgLayer.style.cssText='position:fixed;top:0;left:0;width:100vw;height:100vh;display:none;z-index:999979;pointer-events:none;background-size:cover;background-position:center;background-repeat:no-repeat;';
    TOP.document.body.appendChild(bgLayer);
  }

  overlayLayer=TOP.document.getElementById('pp-wp2-overlay');
  if(!overlayLayer){
    overlayLayer=TOP.document.createElement('div');
    overlayLayer.id='pp-wp2-overlay';
    overlayLayer.style.cssText='position:fixed;top:0;left:0;width:100vw;height:100vh;background:#000;display:none;z-index:999980;pointer-events:none;';
    TOP.document.body.appendChild(overlayLayer);
  }
}

/* 停止轮播定时器 */
function stopRotate(){
  if(rotateTimer){ TOP.clearTimeout(rotateTimer); rotateTimer=null; }
}

/* 显示指定图片 */
function showImage(img, opacity){
  if(!bgLayer || !overlayLayer) return;
  if(!img){
    bgLayer.style.display='none';
    overlayLayer.style.display='none';
    return;
  }
  var key=img.src;
  bgLayer.style.display='block';
  bgLayer.style.backgroundImage='url("'+String(img.src).replace(/"/g,'\\"')+'")';
  overlayLayer.style.display='block';
  overlayLayer.style.opacity=(opacity==null?0.55:opacity/100);
  lastShownKey=key;
}

/* 调度下一次轮播 */
function scheduleNextRotate(cfg){
  stopRotate();
  if(cfg.mode!=='multi' || cfg.imgs.length<2 || !cfg.wallpaperOn) return;

  var sec=Math.max(3, cfg.interval||15);
  rotateTimer=TOP.setTimeout(function(){
    // 重新读一次最新配置，避免轮播中途用户改了设置
    var fresh=loadConfig();
    if(fresh.imgs.length<2){ stopRotate(); return; }

    if(fresh.shuffle){
      // 随机：选一个和当前不同的
      var newIdx;
      do{ newIdx=Math.floor(Math.random()*fresh.imgs.length); }while(newIdx===rotateIdx && fresh.imgs.length>1);
      rotateIdx=newIdx;
    }else{
      // 顺序：下一张
      rotateIdx=(rotateIdx+1)%fresh.imgs.length;
    }

    if(rotateIdx>=fresh.imgs.length) rotateIdx=0;
    showImage(fresh.imgs[rotateIdx], fresh.overlayOpacity);
    scheduleNextRotate(fresh);
  }, sec*1000);
}

/* 主 tick：每 150ms 跑一次，同步配置到壁纸 */
function tick(){
  // 面板没打开时，强制隐藏（和旧版行为一致）
  var pnl=TOP.document.getElementById('pp-panel');
  if(!pnl||pnl.style.display==='none'){
    stopRotate();
    if(bgLayer) bgLayer.style.display='none';
    if(overlayLayer) overlayLayer.style.display='none';
    lastShownKey='';
    return;
  }

  var cfg=loadConfig();

  // 壁纸关闭
  if(!cfg.wallpaperOn){
    stopRotate();
    if(bgLayer) bgLayer.style.display='none';
    if(overlayLayer) overlayLayer.style.display='none';
    lastShownKey='';
    return;
  }

  // 没有图片
  if(!cfg.imgs.length){
    stopRotate();
    if(bgLayer) bgLayer.style.display='none';
    if(overlayLayer) overlayLayer.style.display='none';
    lastShownKey='';
    return;
  }

  /* 单图模式 */
  if(cfg.mode==='single'){
    stopRotate();
    rotateIdx=-1; // 重置轮播索引

    var curImg=null;
    for(var i=0;i<cfg.imgs.length;i++){
      if(cfg.imgs[i].id===cfg.currentId){ curImg=cfg.imgs[i]; break; }
    }
    if(!curImg) curImg=cfg.imgs[0]; // 兜底用第一张

    if(curImg && curImg.src!==lastShownKey){
      showImage(curImg, cfg.overlayOpacity);
      // 记录当前索引，方便切多图时从这里开始
      rotateIdx=cfg.imgs.indexOf(curImg);
    }
    return;
  }

  /* 多图模式 */
  // 如果刚从单图切过来，rotateIdx 可能是 -1 或超出范围，先初始化
  if(rotateIdx<0 || rotateIdx>=cfg.imgs.length){
    // 优先从 currentId 对应的那张开始
    var startIdx=0;
    for(var j=0;j<cfg.imgs.length;j++){
      if(cfg.imgs[j].id===cfg.currentId){ startIdx=j; break; }
    }
    rotateIdx=startIdx;
    showImage(cfg.imgs[rotateIdx], cfg.overlayOpacity);
  }

  // 确保轮播定时器在跑
  if(!rotateTimer){
    scheduleNextRotate(cfg);
  }
}

/* ===== 启动 ===== */
ensureLayers();
if(tickTimer) TOP.clearInterval(tickTimer);
tickTimer=TOP.setInterval(tick, 150);
tick(); // 立即跑一次

/* 返回空字符串，不注入任何提示词 */
return '';

})
/* __INJECT_END__ */

/* __PAGECODE_BEGIN__ */
(function(ctx){
var LKEY='pp-wallpaper-v2';
function load(){
  try{
    var r=JSON.parse(localStorage.getItem(LKEY)||'{}');
    r.imgs=r.imgs||[];
    r.mode=r.mode||'single';
    r.interval=r.interval||15;
    r.currentId=r.currentId||'';
    r.shuffle=!!r.shuffle;
    r.wallpaperOn=r.wallpaperOn!==false;
    r.overlayOpacity=(r.overlayOpacity==null?55:r.overlayOpacity);
    return r;
  }catch(e){ return {imgs:[],mode:'single',interval:15,currentId:'',shuffle:false,wallpaperOn:true,overlayOpacity:55}; }
}
function save(d){ try{localStorage.setItem(LKEY,JSON.stringify(d));}catch(e){alert('存储空间不足');} }

var d=load(),root=ctx.el('div','');
root.style.cssText='padding:14px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;height:100%;';

function card(t,inner){
  var c=ctx.el('div','');
  c.style.cssText='background:rgba(255,255,255,.06);border-radius:14px;padding:12px;';
  var h=ctx.el('div','');
  h.style.cssText='font-size:10px;font-weight:600;letter-spacing:1.5px;color:rgba(255,126,179,.8);text-transform:uppercase;margin-bottom:8px;';
  h.textContent=t;c.appendChild(h);c.appendChild(inner);return c;
}

/* ===== 显示设置 ===== */
var dispRow=ctx.el('div','');
dispRow.style.cssText='display:flex;flex-direction:column;gap:8px;';

var onRow=ctx.el('div','');
onRow.style.cssText='display:flex;justify-content:space-between;align-items:center;font-size:12px;';
var onB=ctx.el('button','ppbtn');
onB.style.cssText='padding:4px 14px;font-size:11px;';
function paintOn(){ onB.textContent=d.wallpaperOn?'壁纸:开':'壁纸:关'; onB.style.background=d.wallpaperOn?'linear-gradient(135deg,#ff7eb3,#ff5c8a)':'rgba(255,255,255,.08)'; onB.style.color=d.wallpaperOn?'#fff':''; }
onB.onclick=function(){ d.wallpaperOn=!d.wallpaperOn; save(d); paintOn(); };
onRow.innerHTML='<span style="color:rgba(255,255,255,.7);">显示壁纸</span>';
onRow.appendChild(onB);

var opLbl=ctx.el('div','');
opLbl.style.cssText='display:flex;justify-content:space-between;font-size:12px;margin-top:4px;';
opLbl.innerHTML='<span style="color:rgba(255,255,255,.7);">遮罩暗度</span><span style="color:#ff9eb8;font-weight:600;" id="_op">'+d.overlayOpacity+'%</span>';
var op=ctx.el('input','');
op.type='range';op.min=0;op.max=100;op.value=d.overlayOpacity;
op.style.cssText='width:100%;accent-color:#ff7eb3;';
op.onchange=function(){ d.overlayOpacity=+this.value; save(d); root.querySelector('#_op').textContent=this.value+'%'; };
op.oninput=function(){ d.overlayOpacity=+this.value; save(d); root.querySelector('#_op').textContent=this.value+'%'; try{var ov=window.parent.document.getElementById('pp-wp2-overlay');if(ov)ov.style.opacity=(this.value/100).toFixed(2);}catch(e){} };

dispRow.appendChild(onRow);dispRow.appendChild(opLbl);dispRow.appendChild(op);
root.appendChild(card('显示设置',dispRow));

/* ===== 模式 ===== */
var modeRow=ctx.el('div','');
modeRow.style.cssText='display:flex;flex-direction:column;gap:8px;';
var btnWrap=ctx.el('div','');
btnWrap.style.cssText='display:flex;gap:6px;';
var bS=ctx.el('button','ppbtn');bS.textContent='单图';
var bM=ctx.el('button','ppbtn');bM.textContent='多图轮播';
var hint=ctx.el('div','');
hint.style.cssText='font-size:11px;color:rgba(255,158,184,.8);min-height:16px;';
function paintMode(){
  bS.style.background=d.mode==='single'?'linear-gradient(135deg,#ff7eb3,#ff5c8a)':'rgba(255,255,255,.08)';bS.style.color=d.mode==='single'?'#fff':'';
  bM.style.background=d.mode==='multi'?'linear-gradient(135deg,#ff7eb3,#ff5c8a)':'rgba(255,255,255,.08)';bM.style.color=d.mode==='multi'?'#fff':'';
  hint.textContent=d.mode==='multi'?('轮播中，每'+d.interval+'秒切换，共'+d.imgs.length+'张'):('单图模式，已添加'+d.imgs.length+'张');
}
bS.onclick=function(){ d.mode='single'; save(d); paintMode(); };
bM.onclick=function(){ if(d.imgs.length<2){ hint.textContent='⚠ 至少需要2张图，当前'+d.imgs.length+'张'; return; } d.mode='multi'; save(d); paintMode(); };
btnWrap.appendChild(bS);btnWrap.appendChild(bM);
modeRow.appendChild(btnWrap);modeRow.appendChild(hint);
root.appendChild(card('模式',modeRow));

/* ===== 轮播设置 ===== */
var rotRow=ctx.el('div','');
rotRow.style.cssText='display:flex;flex-direction:column;gap:8px;';
var ivLbl=ctx.el('div','');
ivLbl.style.cssText='display:flex;justify-content:space-between;font-size:12px;';
ivLbl.innerHTML='<span style="color:rgba(255,255,255,.7);">切换间隔</span><span style="color:#ff9eb8;font-weight:600;" id="_iv">'+d.interval+'秒</span>';
var iv=ctx.el('input','');
iv.type='range';iv.min=3;iv.max=120;iv.value=d.interval;
iv.style.cssText='width:100%;accent-color:#ff7eb3;';
iv.onchange=function(){ d.interval=+this.value; save(d); root.querySelector('#_iv').textContent=this.value+'秒'; paintMode(); };
iv.oninput=function(){ d.interval=+this.value; save(d); root.querySelector('#_iv').textContent=this.value+'秒'; paintMode(); };

var shRow=ctx.el('div','');
shRow.style.cssText='display:flex;justify-content:space-between;align-items:center;font-size:12px;';
var shB=ctx.el('button','ppbtn');
shB.style.cssText='padding:4px 12px;font-size:11px;';
function paintSh(){ shB.textContent=d.shuffle?'随机:开':'随机:关'; shB.style.background=d.shuffle?'linear-gradient(135deg,#ff7eb3,#ff5c8a)':'rgba(255,255,255,.08)'; shB.style.color=d.shuffle?'#fff':''; }
shB.onclick=function(){ d.shuffle=!d.shuffle; save(d); paintSh(); };
shRow.innerHTML='<span style="color:rgba(255,255,255,.7);">随机顺序</span>';
shRow.appendChild(shB);

rotRow.appendChild(ivLbl);rotRow.appendChild(iv);rotRow.appendChild(shRow);
root.appendChild(card('轮播设置',rotRow));

/* ===== 服务器壁纸 ===== */
var serverRow=ctx.el('div','');
serverRow.style.cssText='display:flex;flex-direction:column;gap:8px;';
var serverBtn=ctx.el('button','ppbtn');
serverBtn.textContent='刷新服务器壁纸';
serverBtn.style.cssText='width:100%;padding:8px;';
var serverHint=ctx.el('div','');
serverHint.style.cssText='font-size:11px;color:rgba(255,158,184,.8);min-height:16px;line-height:1.5;';
serverHint.innerHTML='把图片放进酒馆 <b>data/default-user/backgrounds/</b> 目录，<br>文件名以 <b>pp-</b> 开头即可自动同步';

function getHeaders(){
  var headers={};
  try{
    var c=window.parent.SillyTavern&&window.parent.SillyTavern.getContext&&window.parent.SillyTavern.getContext();
    if(c&&c.getRequestHeaders) headers=c.getRequestHeaders();
  }catch(e){}
  return headers;
}

function loadServerWallpapers(){
  serverHint.textContent='同步中...';
  fetch('/api/backgrounds/all',{method:'POST',headers:getHeaders(),body:JSON.stringify({})})
    .then(function(r){return r.json();})
    .then(function(data){
      var serverImgs=(data.images||[]).filter(function(img){return img.filename&&img.filename.indexOf('pp-')===0;});
      serverHint.innerHTML='✅ 服务器共 <b>'+serverImgs.length+'</b> 张壁纸<br>路径: data/default-user/backgrounds/ (pp- 开头)';

      var added=0;
      serverImgs.forEach(function(img){
        var src='/backgrounds/'+img.filename;
        var exists=d.imgs.some(function(x){return x.src===src;});
        if(!exists){
          d.imgs.push({
            id:'s_'+img.filename,
            src:src,
            name:img.filename.replace(/^pp-/,'').slice(0,20),
            isServer:true
          });
          added++;
        }
      });

      var removed=0;
      for(var i=d.imgs.length-1;i>=0;i--){
        if(d.imgs[i].isServer){
          var stillExists=serverImgs.some(function(img){return '/backgrounds/'+img.filename===d.imgs[i].src;});
          if(!stillExists){ d.imgs.splice(i,1); removed++; }
        }
      }

      if(!d.currentId && d.imgs.length>0) d.currentId=d.imgs[0].id;
      save(d); renderList(); paintMode();

      if(added>0||removed>0){
        serverHint.innerHTML+='<br>✓ 同步完成：新增 '+added+' 张，移除 '+removed+' 张';
      }
    })
    .catch(function(err){ serverHint.textContent='❌ 加载失败: '+err.message; });
}

function deleteServerWallpaper(filename,cb){
  fetch('/api/backgrounds/delete',{
    method:'POST',
    headers:getHeaders(),
    body:JSON.stringify({bg:filename})
  }).then(function(r){return r.ok;})
    .then(function(ok){cb(ok);})
    .catch(function(){cb(false);});
}

serverBtn.onclick=loadServerWallpapers;
serverRow.appendChild(serverBtn);serverRow.appendChild(serverHint);
root.appendChild(card('服务器壁纸（自动同步 backgrounds/pp-*）',serverRow));

/* ===== 添加本地图片（上传到服务器） ===== */
var addRow=ctx.el('div','');
addRow.style.cssText='display:flex;flex-direction:column;gap:8px;';
var pick=ctx.el('button','ppbtn');
pick.textContent='选择本地图片（上传到服务器）';
pick.style.cssText='width:100%;padding:10px;';
pick.onclick=function(){
  var fi=document.createElement('input');
  fi.type='file';fi.accept='image/*';fi.style.display='none';
  document.body.appendChild(fi);
  fi.onchange=function(){
    var f=fi.files[0];document.body.removeChild(fi);
    if(!f)return;

    // 先获取现有 pp-* 文件，算出下一个编号
    fetch('/api/backgrounds/all',{method:'POST',headers:getHeaders(),body:JSON.stringify({})})
      .then(function(r){return r.json();})
      .then(function(data){
        var maxNum=0;
        (data.images||[]).forEach(function(img){
          var m=(img.filename||'').match(/^pp-(\d+)/);
          if(m){ var n=parseInt(m[1],10); if(n>maxNum) maxNum=n; }
        });
        var nextNum=maxNum+1;
        var ext=(f.name.split('.').pop()||'png').toLowerCase();
        var newName='pp-'+nextNum+'.'+ext;

        // 包装成新文件，重命名后上传
        var newFile=new File([f],newName,{type:f.type});
        var fd=new FormData();
        fd.append('file',newFile);

        pick.textContent='上传中...';pick.disabled=true;
        fetch('/api/backgrounds/upload',{method:'POST',headers:getHeaders(),body:fd})
          .then(function(r){return r.text();})
          .then(function(filename){
            pick.textContent='选择本地图片（上传到服务器）';pick.disabled=false;
            if(filename){
              // 上传成功，刷新列表
              loadServerWallpapers();
            }
          })
          .catch(function(err){
            pick.textContent='选择本地图片（上传到服务器）';pick.disabled=false;
            alert('上传失败: '+err.message);
          });
      });
  };
  fi.click();
};
addRow.appendChild(pick);
root.appendChild(card('添加图片',addRow));

/* ===== 图片列表 ===== */
var listBox=ctx.el('div','');
listBox.style.cssText='display:flex;flex-direction:column;gap:6px;';
function renderList(){
  listBox.innerHTML='';
  if(!d.imgs.length){
    var e=ctx.el('div','');
    e.style.cssText='text-align:center;padding:16px;color:rgba(255,255,255,.25);font-size:12px;';
    e.textContent='还没有图片，先点「刷新服务器壁纸」';
    listBox.appendChild(e);return;
  }
  d.imgs.forEach(function(img,idx){
    var it=ctx.el('div','');var cur=img.id===d.currentId;
    it.style.cssText='display:flex;align-items:center;gap:10px;padding:6px;background:'+(cur?'rgba(255,126,179,.15)':'rgba(255,255,255,.05)')+';border:1px solid '+(cur?'rgba(255,126,179,.4)':'transparent')+';border-radius:10px;';
    it.draggable=true;

    var th=ctx.el('img','');th.src=img.src;
    th.style.cssText='width:44px;height:44px;border-radius:8px;object-fit:cover;cursor:pointer;flex-shrink:0;';
    th.onclick=function(){ d.currentId=img.id; save(d); renderList(); };

    var nm=ctx.el('div','');
    nm.style.cssText='flex:1;font-size:11px;color:rgba(255,255,255,.6);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
    nm.textContent=(img.name||'图'+(idx+1))+(cur?'  ✓':'');

    var dl=ctx.el('button','ppbtn');dl.textContent='×';
    dl.style.cssText='width:26px;height:26px;padding:0;font-size:14px;color:rgba(255,255,255,.5);';
    dl.onclick=function(){
      if(img.isServer && img.src){
        var filename=img.src.replace('/backgrounds/','');
        deleteServerWallpaper(filename,function(ok){
          if(!ok) alert('⚠ 从服务器删除失败，但已从列表移除');
        });
      }
      d.imgs.splice(idx,1);
      if(d.currentId===img.id)d.currentId='';
      save(d);renderList();paintMode();
    };

    it.appendChild(th);it.appendChild(nm);it.appendChild(dl);

    it.ondragstart=function(e){ e.dataTransfer.setData('text/plain',idx); };
    it.ondragover=function(e){ e.preventDefault(); };
    it.ondrop=function(e){
      e.preventDefault();
      var f=+e.dataTransfer.getData('text/plain');
      if(isNaN(f)||f===idx)return;
      var item=d.imgs.splice(f,1)[0];
      d.imgs.splice(idx,0,item);
      save(d);renderList();
    };

    listBox.appendChild(it);
  });
}
root.appendChild(card('图片列表（点缩略图设为当前，拖拽排序，×删除）',listBox));

renderList();paintMode();paintSh();paintOn();
return root;
})
/* __PAGECODE_END__ */

/* __POST_BEGIN__ */
{}
/* __POST_END__ */
