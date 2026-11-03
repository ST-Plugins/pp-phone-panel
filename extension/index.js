/* ============================================================================
 * PP Phone Panel - SillyTavern Extension
 * ========================================================================== */
(function () {
  // 注意：不使用 'use strict'，因为 H5 代码中有未声明变量赋值
  const STORAGE_KEY = 'pp-statusbar';
  const SETTINGS_ID = 'pp-settings';

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }
  function $(id) { return document.getElementById(id); }
  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveSettings(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // 同步 enabled 到服务器端
    if (typeof setServerEnabled === 'function' && data && data.enabled !== undefined) {
      setServerEnabled(data.enabled);
    }
  }
  /* 服务器端持久化：让无痕模式也能记住开关状态 */
  function getCtx() { try { return (window.SillyTavern && SillyTavern.getContext) ? SillyTavern.getContext() : null; } catch (e) { return null; } }
  function getServerEnabled() {
    try {
      var ctx = getCtx();
      if (ctx && ctx.extensionSettings && ctx.extensionSettings.phonePanel) {
        var v = ctx.extensionSettings.phonePanel.enabled;
        if (v === true || v === false || v === '1' || v === '0') return v;
      }
    } catch (e) {}
    return null;
  }
  function setServerEnabled(v) {
    try {
      var ctx = getCtx();
      if (ctx && ctx.extensionSettings) {
        if (!ctx.extensionSettings.phonePanel) ctx.extensionSettings.phonePanel = {};
        ctx.extensionSettings.phonePanel.enabled = !!v;
        if (ctx.saveSettingsDebounced) ctx.saveSettingsDebounced();
      }
    } catch (e) {}
  }
  let settings = loadSettings();
  if (settings.enabled === undefined) settings.enabled = false; // 默认关闭
  if (settings.showFab === undefined) settings.showFab = true;

  function injectSettingsUI() {
    const container = $('extensions_settings') || $('extensions_settings2');
    if (!container) return;
    if ($(SETTINGS_ID)) return;
    const drawer = document.createElement('div');
    drawer.id = SETTINGS_ID;
    drawer.className = 'inline-drawer';
    drawer.innerHTML =
      '<div class="inline-drawer-toggle inline-drawer-header">' +
      '<b>PP-小手机</b>' +
      '<div class="inline-drawer-icon fa fa-chevron-down"></div>' +
      '</div>' +
      '<div class="inline-drawer-content">' +
      '<label class="checkbox_label">' +
      '<input type="checkbox" id="' + SETTINGS_ID + '-enabled">' +
      '<span><b>启用扩展</b>（关闭后悬浮按钮隐藏）</span>' +
      '</label>' +
      '<label class="checkbox_label" style="margin-top:6px">' +
      '<input type="checkbox" id="' + SETTINGS_ID + '-showFab">' +
      '<span>显示悬浮按钮</span>' +
      '</label>' +
      '<div class="menu_button menu_button_icon interactable" id="' + SETTINGS_ID + '-open" style="width:100%;justify-content:center;margin-top:8px">' +
      '<span>💗 打开小手机</span>' +
      '</div>' +
      '</div>';
    container.appendChild(drawer);

    const enabledToggle = $(SETTINGS_ID + '-enabled');
    enabledToggle.checked = settings.enabled;
    enabledToggle.addEventListener('change', function () {
      settings.enabled = this.checked;
      saveSettings(settings);
      if (!settings.enabled) {
        const fab = document.getElementById('pp-fab');
        if (fab) fab.style.display = 'none';
        const panel = document.getElementById('pp-panel');
        if (panel) panel.style.display = 'none';
      } else {
        location.reload();
      }
    });

    const showFabToggle = $(SETTINGS_ID + '-showFab');
    showFabToggle.checked = settings.showFab;
    showFabToggle.addEventListener('change', function () {
      settings.showFab = this.checked;
      saveSettings(settings);
      const fab = document.getElementById('pp-fab');
      if (fab) fab.style.display = this.checked ? 'flex' : 'none';
    });

    const openBtn = $(SETTINGS_ID + '-open');
    openBtn.addEventListener('click', function () {
      const fab = document.getElementById('pp-fab');
      if (fab) fab.click();
    });
  }

  function loadBuiltinApps(cb) {
    if (window._builtinApps && window._builtinApps.length > 0) { cb(); return; }
    window._builtinApps = window._builtinApps || [];
    var appFiles = [
      'pp-browser.js',
      'pp-phone-call.js',
      'pp-quests.js',
      'pp-radio.js',
      'pp-wallpaper-v2.js',
      'pp-weather.js'
    ];
    var baseUrl = '/scripts/extensions/third-party/phone-panel/extension/apps/';
    var idx = 0;
    function loadNext() {
      if (idx >= appFiles.length) { cb(); return; }
      var s = document.createElement('script');
      s.src = baseUrl + appFiles[idx] + '?v=' + Date.now();
      s.onload = function(){ idx++; loadNext(); };
      s.onerror = function(){ console.warn('[PP] app load failed: ' + appFiles[idx]); idx++; loadNext(); };
      document.head.appendChild(s);
    }
    loadNext();
  }

  onReady(function () {
    try {
      // 只有第一次安装（localStorage 里没存过）才从服务器读默认值
      // 平时用 localStorage 的值，避免服务器保存时序问题
      if (settings.enabled === undefined) {
        var srvEnabled = getServerEnabled();
        if (srvEnabled !== null) {
          settings.enabled = srvEnabled === true || srvEnabled === '1';
        }
      }
      injectSettingsUI();
      if (settings.enabled === false) {
        console.log('[PP] disabled');
        return;
      }

      // ═══ Mock 环境（DOM ready 后才能访问 body）═══
      var TOP = window;
      var TOPDOC = document;
      var overlay = document.body;
      /* 天气引擎需要 #pp-bg 作为纹理底图 */
      if(!TOPDOC.getElementById('pp-bg')){
        var _ppbg = TOPDOC.createElement('div');
        _ppbg.id = 'pp-bg';
        _ppbg.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:0;pointer-events:none;';
        TOPDOC.body.appendChild(_ppbg);
      }
      var state = { sentences: [], idx: 0, imageCount: 0, myImgs: [] };
      function getRawSource() { return ''; }
      function _buildInject() { return ''; }

      loadBuiltinApps(function() {
        console.log('[PP] init...');
        /* 内置 app 脚本为异步加载，此刻才全部执行完：再同步一次，确保 pageCode 更新能落盘 */
        try { window.__ppSyncBuiltinApps && window.__ppSyncBuiltinApps(); } catch (e) { console.warn('[PP] app sync error:', e); }

  (function setupStatusBar(){
    try {

    /* ── Guard: prevent double-init on every ST message ── */
    var _existing=TOPDOC.getElementById('pp-panel');
    if(_existing&&_existing.getAttribute('data-lgv')!=='2'){try{_existing.parentNode.removeChild(_existing);}catch(e){}_existing=null;}
    if(_existing){
      /* Panel already exists — just re-sync toggle button */
      (function(){
        var t=overlay.querySelector('#pp-btn-toggle');
        if(!t)return;
        var vis=_existing.style.display!=='none';
        t.style.color=vis?'rgba(255,255,255,.92)':'rgba(255,255,255,.38)';
        t.style.background=vis?'rgba(255,255,255,.12)':'transparent';
        t.style.borderColor=vis?'rgba(255,255,255,.18)':'transparent';
        /* Ensure only one click listener via flag */
        if(!t._ppbound){
          t._ppbound=true;
          t.addEventListener('click',function(e){
            e.stopPropagation();
            var show=_existing.style.display==='none';
            _existing.style.display=show?'flex':'none';
            var SB_KEY2='pp-config';
            try{var d2=JSON.parse(TOP.localStorage.getItem(SB_KEY2)||'{}');d2.visible=show;TOP.localStorage.setItem(SB_KEY2,JSON.stringify(d2));}catch(ex){}
            t.style.color=show?'rgba(255,255,255,.92)':'rgba(255,255,255,.38)';
            t.style.background=show?'rgba(255,255,255,.12)':'transparent';
            t.style.borderColor=show?'rgba(255,255,255,.18)':'transparent';
          });
        }
      })();
      return;
    }

    var SB_KEY='pp-config';
    function _L(){try{return JSON.parse(TOP.localStorage.getItem(SB_KEY)||'{}');}catch(e){return{};}}
    function _W(){
      try{TOP.localStorage.setItem(SB_KEY,JSON.stringify(_sbS));}catch(e){console.warn('[PP] pp-config 保存失败(可能 localStorage 配额满):',e);}
      /* 同步插件独立 localStorage key：设置页改了 settingsValues 后自动写入 */
      try{
        (function(){
          var apps=_sbS.ppApps||[];
          /* 天气：settingsValues.enabled → pp-weather.enabled */
          var w=apps.find(function(a){return a.id==='pp-weather';});
          if(w){
            var wd=JSON.parse(TOP.localStorage.getItem('pp-weather')||'{}');
            var en=!!(w.settingsValues&&w.settingsValues.enabled);
            if(wd.enabled!==en){wd.enabled=en;TOP.localStorage.setItem('pp-weather',JSON.stringify(wd));}
          }
          /* 电台：radioEnabled=false 时主动清理悬浮窗和音频 */
          var r=apps.find(function(a){return a.id==='pp-radio';});
          if(r && r.settingsValues && r.settingsValues.radioEnabled === false){
            try{
              if(TOP.__vnmRadioShellEl && TOP.__vnmRadioShellEl.parentNode){
                TOP.__vnmRadioShellEl.parentNode.removeChild(TOP.__vnmRadioShellEl);
              }
              TOP.__vnmRadioShellEl = null;
              /* 暂停所有 audio 元素 */
              var audios=TOPDOC.querySelectorAll('audio');
              for(var i=0;i<audios.length;i++){
                try{audios[i].pause();}catch(e){}
              }
            }catch(e){}
          }
        })();
      }catch(e){}
    }
    function _applyGlass(el){
      var sh=el||TOPDOC.getElementById('pp-shell');if(!sh)return;
      var _w=TOPDOC.getElementById('pp-panel');var _tg=[sh];if(_w&&_w!==sh)_tg.push(_w);
      _tg=_tg.filter(Boolean);var _set=function(k,v){for(var i=0;i<_tg.length;i++)_tg[i].style.setProperty(k,v);};
      var g=function(k,d){var o=_sbS.glassUI||{};return(o[k]===undefined||o[k]===null)?d:o[k];};
      /* 背景面板组 */
      _set('--g-blur',g('bgBlur',0)+'px');
      _set('--g-tint','rgba(255,255,255,'+(g('bgTint',0)/100)+')');
      _set('--g-sat',g('bgSat',160)+'%');
      _set('--g-filter',g('refract',1)?'url(#pp-lg-bg)':'none');
      /* 按钮与组件组 */
      _set('--ge-blur',g('elBlur',1.5)+'px');
      _set('--ge-tint','rgba(255,255,255,'+(g('elTint',1)/100)+')');
      _set('--ge-sat',g('elSat',160)+'%');
      _set('--ge-filter',g('refract',1)?'url(#pp-lg-el)':'none');
      /* 通用 */
      _set('--g-bright',(g('bright',90)/100));
      _set('--g-hl',(g('hl',10)/100));
      _set('--g-rad',g('radius',32)+'px');
      _set('--g-bg','rgba(8,8,14,'+(g('dim',23)/100)+')');
      /* 更新两组液态玻璃滤镜：折射强度 + 中心清晰区 */
      function _msk(z){
        TOP._lgMaskCache=TOP._lgMaskCache||{};
        if(TOP._lgMaskCache[z])return TOP._lgMaskCache[z];
        var cv=TOPDOC.createElement('canvas');cv.width=256;cv.height=256;
        var cx=cv.getContext('2d');
        var half=128,corner=half*Math.SQRT2;
        var r0=Math.min(z/100*half,corner-1);
        var gr=cx.createRadialGradient(half,half,r0,half,half,corner);
        gr.addColorStop(0,'#000');gr.addColorStop(1,'#fff');
        cx.fillStyle='#000';cx.fillRect(0,0,256,256);
        cx.fillStyle=gr;cx.fillRect(0,0,256,256);
        var u=cv.toDataURL('image/png');TOP._lgMaskCache[z]=u;return u;
      }
      function _upd(fid,refr,zone){try{var f=TOPDOC.getElementById(fid);if(!f)return;var im=f.querySelector('feImage');if(im){var u=_msk(zone);im.setAttribute('href',u);try{im.setAttributeNS('http://www.w3.org/1999/xlink','href',u);}catch(e2){}}var dm=f.querySelector('feDisplacementMap');if(dm)dm.setAttribute('scale',String(refr));}catch(e){}}
      _upd('pp-lg-bg',g('bgRefr',60),g('bgZone',95));
      _upd('pp-lg-el',g('elRefr',60),g('elZone',95));
    }
    var _d=_L();
    var _sbS={
      apiUrl:        _d.apiUrl        ||'',
      apiPresets:    _d.apiPresets    ||[],
      userPresets:   _d.userPresets   ||[],
      apiKey:        _d.apiKey        ||'',
      model:         _d.model         ||'',
      turnCount:     (_d.turnCount     !==undefined)?_d.turnCount    :6,
      pos:           _d.pos           ||{x:Math.max(20,TOP.innerWidth-380),y:60},
      size:          _d.size          ||{w:370,h:580},
      fabPos:        _d.fabPos        ||null,
      visible:       (_d.visible !== undefined) ? _d.visible : false,
      presets:       _d.presets       ||[],
      activePresetId:_d.activePresetId||null,
      user:          (function(){
        var u=_d.user||{};
        return {
          name:u.name||'',
          persona:u.persona||'',
          avatar:u.avatar||'',
          activePersona:(u.activePersona!==undefined?u.activePersona:0),
          personas:u.personas&&u.personas.length?u.personas:[{name:'',persona:''}]
        };
      })(),
      characters:    _d.characters || [],
      activeCharIds: _d.activeCharIds ||[],
      history:       _d.history       ||{},
      wbEntries:     _d.wbEntries     ||[],
      wbBooks:       _d.wbBooks       ||[],
      wbBookToggles: _d.wbBookToggles ||{},
      wbActive:      _d.wbActive      ||[],
      wbGroupDisabled:_d.wbGroupDisabled||{},
      injectCharIds: _d.injectCharIds ||[],
      ttsEnabled:    (_d.ttsEnabled    !==undefined)?_d.ttsEnabled   :false,
      ttsGroupId:    _d.ttsGroupId    ||'',
      ttsApiKey:     _d.ttsApiKey     ||'',
      ttsApiHost:    _d.ttsApiHost    ||'https://api.minimax.chat',
      ttsModel:      _d.ttsModel      ||'speech-02-hd',
      ttsProvider:   _d.ttsProvider   ||'',
      fishApiKey:    _d.fishApiKey    ||'',
      fishModel:     _d.fishModel     ||'',
      ppApps:      _d.ppApps       ||[],
      callHistory:  _d.callHistory   ||[],
      vcSystemPrompt:_d.vcSystemPrompt||null,
      vcContextDepth:(_d.vcContextDepth!==undefined)?_d.vcContextDepth:6,
      glassUI:      _d.glassUI       ||{},
      /* 聊天：全局默认文风/保底字数 + 每角色覆盖 + 每角色上次打开的 chat */
      defaultChatStyle:   (typeof _d.defaultChatStyle==='string')?_d.defaultChatStyle:'',
      chatStyleByChar:    _d.chatStyleByChar    ||{},
      defaultChatMinLen:  (_d.defaultChatMinLen!==undefined)?_d.defaultChatMinLen:500,
      chatMinLenByChar:   _d.chatMinLenByChar   ||{},
      lastChatByChar:     _d.lastChatByChar     ||{}
    };
    // 内置 app 同步：与最新内置代码对比，pageCode 变了就更新代码字段，保留用户设置
    function _syncBuiltinApps() {
      if (typeof window._builtinApps === 'undefined' || !window._builtinApps.length) return 0;
      if (!_sbS.ppApps) _sbS.ppApps = [];
      var updatedCount = 0;
      window._builtinApps.forEach(function(ba){
        var existing = _sbS.ppApps.find(function(a){return a.id===ba.id;});
        if (!existing) {
          // 新 app，直接加进去
          _sbS.ppApps.push(JSON.parse(JSON.stringify(ba)));
          updatedCount++;
        } else if (existing.pageCode !== ba.pageCode || existing.version !== ba.version) {
          // 代码或版本不一致：更新代码字段，保留用户的 settingsValues / enabled
          existing.pageCode = ba.pageCode;
          existing.settingsFields = ba.settingsFields;
          existing.settingsTitle = ba.settingsTitle;
          existing.icon = ba.icon;
          existing.version = ba.version;
          existing.description = ba.description;
          existing.injectCode = ba.injectCode;
          updatedCount++;
        }
      });
      if (updatedCount > 0) {
        // 注意：不能用 setupStatusBar 内部的 _W()（作用域不可见），这里直接写 pp-config
        try { TOP.localStorage.setItem('pp-config', JSON.stringify(_sbS)); } catch (e) { console.warn('[PhonePanel] pp-config 保存失败:', e); }
        console.log('[PhonePanel] 内置 app 已同步，更新了 ' + updatedCount + ' 个，共 ' + _sbS.ppApps.length + ' 个');
      }
      return updatedCount;
    }
    _syncBuiltinApps();
    window.__ppSyncBuiltinApps = _syncBuiltinApps;
    var _ui={settingsOpen:false,tab:'api',loading:false,charIdx:0,histIdx:{},editPresetId:null,editCharId:null,wbCollapsed:{}};
    function _uuid(){return Date.now().toString(36)+Math.random().toString(36).substr(2);}
    function _esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    function _ap(){return _sbS.presets.find(function(p){return p.id===_sbS.activePresetId;})||null;}
    function _ac(){return _sbS.activeCharIds.map(function(id){return _sbS.characters.find(function(c){return c.id===id;});}).filter(Boolean);}

    // ── iOS color tokens ──────────────────────────────────
    /* ── DOM helpers (used by all _render* tabs) ── */
    function _el(tag,cls,html){var e=TOPDOC.createElement(tag);if(cls)e.className=cls;if(html)e.innerHTML=html;return e;}
    function _div(cls,html){return _el('div',cls,html);}
    function _svg(path,sz){sz=sz||18;return '<svg width="'+sz+'" height="'+sz+'" viewBox="0 0 24 24">'+path+'</svg>';}

        var C={
      bg:       'rgba(12,12,18,0.12)',
      surface:  'rgba(255,255,255,0.055)',
      surface2: 'rgba(255,255,255,0.09)',
      border:   'rgba(255,255,255,0.07)',
      border2:  'rgba(255,255,255,0.13)',
      text:     'rgba(255,255,255,0.88)',
      text2:    'rgba(255,255,255,0.50)',
      text3:    'rgba(255,255,255,0.28)',
      blue:     'rgba(255,255,255,0.92)',
      blueB:    'rgba(255,255,255,0.13)',
      blueB2:   'rgba(255,255,255,0.22)',
      green:    'rgba(255,255,255,0.75)',
      greenB:   'rgba(255,255,255,0.09)',
      red:      'rgba(255,255,255,0.45)',
      redB:     'rgba(255,255,255,0.06)',
    };

    // ── Root panel ────────────────────────────────────────
    function _addPress(el){el.addEventListener('mousedown',function(){el.style.transform='scale(0.88)';el.style.opacity='0.7';});el.addEventListener('mouseup',function(){el.style.transform='';el.style.opacity='';});el.addEventListener('mouseleave',function(){el.style.transform='';el.style.opacity='';});}
    var _sb=TOPDOC.createElement('div');
    _sb.id='pp-panel';
    _sb.setAttribute('data-lgv','2');
    _sb.style.cssText=
      'position:absolute;z-index:2147483620;'
      +'left:'+_sbS.pos.x+'px;top:'+_sbS.pos.y+'px;'
      +'width:'+_sbS.size.w+'px;height:'+_sbS.size.h+'px;'
      +'background:transparent;'
      +'border:.5px solid rgba(255,255,255,0.22);'
      +'border-radius:30px;'
      +'box-shadow:0 24px 80px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.28),inset 0 0 0 .5px rgba(255,255,255,0.10);'
      +'display:flex;flex-direction:column;overflow:hidden;'
      +'font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Segoe UI",sans-serif;'
      +'color:'+C.text+';user-select:none;-webkit-user-select:none;';
    var _sbGlass=TOPDOC.createElement('div');
    _sbGlass.id='pp-glass';
    _sbGlass.style.cssText='position:absolute;inset:0;border-radius:30px;z-index:-1;pointer-events:none;'
      +'background:var(--g-tint,rgba(255,255,255,0));'
      +'backdrop-filter:blur(var(--g-blur,0px)) saturate(var(--g-sat,160%)) brightness(var(--g-bright,1));'
      +'-webkit-backdrop-filter:blur(var(--g-blur,0px)) saturate(var(--g-sat,160%)) brightness(var(--g-bright,1));'
      +'filter:var(--g-filter,url(#pp-lg-bg));';
    _sb.appendChild(_sbGlass);

    // ── FAB 悬浮球 ──────────────────────────────────────
    var _fab=TOPDOC.createElement('div');
    _fab.id='pp-fab';
    var _fabStyle='position:fixed;width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#ff7eb3,#ff5c8a);box-shadow:0 4px 16px rgba(255,92,138,.4);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:999990;transition:transform .15s;';
    if(_sbS.fabPos){
      _fabStyle+='left:'+_sbS.fabPos.x+'px;top:'+_sbS.fabPos.y+'px;right:auto;bottom:auto;';
    }else{
      _fabStyle+='bottom:24px;right:24px;';
    }
    _fab.style.cssText=_fabStyle;
    _fab.innerHTML='<svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    _fab.addEventListener('mouseenter',function(){this.style.transform='scale(1.08)';});
    _fab.addEventListener('mouseleave',function(){this.style.transform='scale(1)';});
    overlay.appendChild(_fab);
    if (!settings.showFab) _fab.style.display = 'none';

    function _recenter(){
      var pw=_sbS.size.w||370, ph=_sbS.size.h||580;
      var nw=(TOP.innerWidth-pw)/2, nh=(TOP.innerHeight-ph)/2;
      _sb.style.left=nw+'px';_sb.style.top=nh+'px';
    }
    function _openPanel(){
      _fab.style.display='none';
      /* 仅当面板位置在屏幕外时才重新居中，否则保持用户保存的位置 */
      var pw=_sbS.size.w||370, ph=_sbS.size.h||580;
      var curL=parseInt(_sb.style.left)||0, curT=parseInt(_sb.style.top)||0;
      if(curL<0||curT<0||curL+pw>TOP.innerWidth||curT+ph>TOP.innerHeight){
        _recenter();
        _sbS.pos={x:Math.round(parseInt(_sb.style.left)),y:Math.round(parseInt(_sb.style.top))};
      }
      _sb.style.display='flex';
      _sbS.visible=true;_W();
      /* 遮罩由 watcher 统一管理，这里只触发一次同步 */
      if(window._ppSyncOverlay)window._ppSyncOverlay();
      /* 打开面板时若停在通讯录/世界书页面，立即静默拉取最新数据，避免显示改动前的旧内容 */
      try{
        if(_nav.page==='contacts'){ _pullSTUser(true); _pullSTAllChars(true); }
        else if(_nav.page==='worldbook'){ _pullAllWorldBooks(true); }
      }catch(e){}
    }
    function _closePanel(){
      _sb.style.display='none';
      _fab.style.display='flex';
      _sbS.visible=false;_W();
      /* 遮罩由 watcher 检测到面板关闭后自动隐藏 */
      if(window._ppSyncOverlay)window._ppSyncOverlay();
    }
    _fab.addEventListener('click',function(e){
      if(_fabDragMoved){_fabDragMoved=false;return;}
      _openPanel();
    });
    TOP.addEventListener('resize',function(){
      if(!_sbS.visible)return;
      /* 窗口大小变化时，如果面板出屏了才居中，否则保持原位 */
      var pw=_sbS.size.w||370, ph=_sbS.size.h||580;
      var curL=parseInt(_sb.style.left)||0, curT=parseInt(_sb.style.top)||0;
      if(curL<0||curT<0||curL+pw>TOP.innerWidth||curT+ph>TOP.innerHeight){
        _recenter();
        _sbS.pos={x:Math.round(parseInt(_sb.style.left)),y:Math.round(parseInt(_sb.style.top))};
        _W();
      }
    });

    /* 关闭面板只由右上角 × 控制，不监听外部点击 */

    // 初始状态：根据 visible 决定显示面板还是 FAB；遮罩由 watcher 接管
    if(!_sbS.visible){
      _sb.style.display='none';
      _fab.style.display='flex';
    } else {
      _fab.style.display='none';
      _sb.style.display='flex';
      /* 初始化时面板位置已经从 _sbS.pos 设置好，只在出屏时居中 */
      var pw=_sbS.size.w||370, ph=_sbS.size.h||580;
      var curL=parseInt(_sb.style.left)||0, curT=parseInt(_sb.style.top)||0;
      if(curL<0||curT<0||curL+pw>TOP.innerWidth||curT+ph>TOP.innerHeight){
        _recenter();
        _sbS.pos={x:Math.round(parseInt(_sb.style.left)),y:Math.round(parseInt(_sb.style.top))};
        _W();
      }
    }

    // FAB 拖动
    var _fabDragMoved=false,_fabDown=false,_fabSX=0,_fabSY=0,_fabOX=0,_fabOY=0;
    _fab.addEventListener('pointerdown',function(e){
      _fabDown=true;
      _fabDragMoved=false;
      _fabSX=e.clientX;_fabSY=e.clientY;
      var r=_fab.getBoundingClientRect();
      _fabOX=r.left;_fabOY=r.top;
      _fab.setPointerCapture(e.pointerId);
    });
    _fab.addEventListener('pointermove',function(e){
      if(!_fabDown)return;
      var dx=e.clientX-_fabSX, dy=e.clientY-_fabSY;
      if(Math.abs(dx)>10||Math.abs(dy)>10)_fabDragMoved=true;
      if(_fabDragMoved){
        var nx=_fabOX+dx, ny=_fabOY+dy;
        nx=Math.max(0,Math.min(TOP.innerWidth-52,nx));
        ny=Math.max(0,Math.min(TOP.innerHeight-52,ny));
        _fab.style.left=nx+'px';_fab.style.top=ny+'px';
        _fab.style.right='auto';_fab.style.bottom='auto';
      }
    });
    _fab.addEventListener('pointerup',function(){
      _fabDown=false;
      if(_fabDragMoved){
        var r=_fab.getBoundingClientRect();
        _sbS.fabPos={x:Math.round(r.left),y:Math.round(r.top)};
        _W();
      }
    });
    _fab.addEventListener('pointercancel',function(){_fabDown=false;});



    // ── Widget factories (iOS-style) ───────────────────────
    function _inp(ph,tp,val){
      var i=TOPDOC.createElement('input');
      i.type=tp||'text';i.placeholder=ph||'';if(val!==undefined)i.value=val;
      i.style.cssText=
        'width:100%;box-sizing:border-box;padding:9px 12px;'
        +'background:'+C.surface+';border:none;border-radius:10px;'
        +'color:'+C.text+';font-size:13px;outline:none;font-family:inherit;'
        +'transition:background .15s;';
      i.addEventListener('focus',function(){this.style.background=C.surface2;});
      i.addEventListener('blur', function(){this.style.background=C.surface;});
      i.addEventListener('mousedown',function(e){e.stopPropagation();});
      i.addEventListener('keydown',  function(e){e.stopPropagation();});
      i.addEventListener('click',    function(e){e.stopPropagation();});
      return i;
    }
    function _ta(ph,val,rows){
      var t=TOPDOC.createElement('textarea');
      t.placeholder=ph||'';if(val!==undefined)t.value=val;t.rows=rows||4;
      t.style.cssText=
        'width:100%;box-sizing:border-box;padding:9px 12px;'
        +'background:'+C.surface+';border:none;border-radius:10px;'
        +'color:'+C.text+';font-size:12px;outline:none;font-family:inherit;'
        +'resize:vertical;min-height:60px;line-height:1.55;transition:background .15s;';
      t.addEventListener('focus',function(){this.style.background=C.surface2;});
      t.addEventListener('blur', function(){this.style.background=C.surface;});
      t.addEventListener('mousedown',function(e){e.stopPropagation();});
      t.addEventListener('keydown',  function(e){e.stopPropagation();});
      t.addEventListener('click',    function(e){e.stopPropagation();});
      return t;
    }
    function _lbl(text){
      var l=TOPDOC.createElement('div');
      l.style.cssText=
        'font-size:11px;font-weight:500;color:'+C.text2+';'
        +'margin-top:12px;margin-bottom:5px;letter-spacing:.2px;';
      l.textContent=text;return l;
    }
    // iOS-style grouped list card (wraps multiple rows)
    function _card(){
      var d=TOPDOC.createElement('div');
      d.style.cssText=
        'background:'+C.surface+';border-radius:14px;overflow:hidden;margin-top:8px;';
      return d;
    }
    function _cardRow(leftEl,rightEl,sep){
      var r=TOPDOC.createElement('div');
      r.style.cssText='display:flex;align-items:center;gap:8px;padding:10px 12px;';
      if(sep){
        var s=TOPDOC.createElement('div');
        s.style.cssText='height:0.5px;background:'+C.border+';margin:0 12px;';
        r._sep=s;
      }
      if(leftEl)r.appendChild(leftEl);
      if(rightEl)r.appendChild(rightEl);
      return r;
    }
    // Pill action button
    function _pbtn(text,variant){
      // variant: 'default'|'blue'|'green'|'red'
      var b=TOPDOC.createElement('button');b.textContent=text;
      var styles={
        'default': 'background:'+C.surface2+';color:'+C.text2+';border:0.5px solid '+C.border2+';',
        'blue':    'background:'+C.blueB+';color:'+C.blue+';border:0.5px solid '+C.blueB2+';',
        'green':   'background:'+C.greenB+';color:'+C.green+';border:0.5px solid '+C.border2+';',
        'red':     'background:transparent;color:'+C.red+';border:none;',
      };
      b.style.cssText=
        'padding:5px 14px;border-radius:20px;font-size:12px;font-weight:500;cursor:pointer;'
        +'font-family:inherit;border:none;transition:opacity .13s;white-space:nowrap;flex-shrink:0;'
        +(styles[variant||'default']||styles['default']);
      b.addEventListener('mouseenter',function(){this.style.opacity='.78';});
      b.addEventListener('mouseleave',function(){this.style.opacity='1';});
      b.addEventListener('mousedown',function(e){e.stopPropagation();});
      b.addEventListener('click',    function(e){e.stopPropagation();});
      return b;
    }
    function _row(){var d=TOPDOC.createElement('div');d.style.cssText='display:flex;gap:7px;align-items:center;';return d;}
    function _numinp(val,mn,mx){
      var i=TOPDOC.createElement('input');i.type='number';i.min=mn||0;i.max=mx||999;i.value=val||0;
      i.style.cssText=
        'width:62px;padding:6px 8px;background:'+C.surface+';border:none;'
        +'border-radius:8px;color:'+C.text+';font-size:13px;outline:none;font-family:inherit;text-align:center;';
      i.addEventListener('mousedown',function(e){e.stopPropagation();});
      i.addEventListener('keydown',  function(e){e.stopPropagation();});
      i.addEventListener('click',    function(e){e.stopPropagation();});
      return i;
    }
    function _unit(t){
      var s=TOPDOC.createElement('span');
      s.style.cssText='font-size:12px;color:'+C.text3+';';
      s.textContent=t;return s;
    }

    // ── Tab: API ─────────────────────────────────────────





    // ══════════════════════════════════════════════════════
    // ── 功能系统 pp – Plugin-based iOS UI ─────────────────
    // ══════════════════════════════════════════════════════

    /* ─── Plugin injection aggregator ──────────────────── */

    /* ─── Plugin context factory ─────────────────────────── */
    function _makePluginCtx(app){
      var TDOC=TOPDOC;
      function _d2(tag,cls,html){var e=TDOC.createElement(tag);if(cls)e.className=cls;if(html)e.innerHTML=html;return e;}
      return{
        sbS:_sbS, settings:app.settingsValues||{}, save:_W, toast:_toast,
        div:function(cls,html){return _d2('div',cls,html);},
        el:function(tag,cls,html){return _d2(tag,cls,html);},
        fetch:TOP.fetch, Audio:TOP.Audio, atob:TOP.atob,
        SpeechRecognition:TOP.SpeechRecognition||TOP.webkitSpeechRecognition,
        getChars:function(){return _sbS.characters||[];},
        getActiveChars:function(){var ids=_sbS.activeCharIds||[];return(_sbS.characters||[]).filter(function(c){return ids.indexOf(c.id)>=0;});},
        getActivePreset:function(){return _ap?_ap():null;},
        getUser:function(){return _sbS.user||{name:'',persona:''};},
        getWbActive:function(){var ac=_sbS.wbActive||[];return(_sbS.wbEntries||[]).filter(function(e){return ac.indexOf(e.id)>=0;});},
        renderTemplate:function(tpl,ch){
          var c=ch||(((_sbS.activeCharIds||[]).length&&_sbS.characters||[]).find?(_sbS.characters||[]).find(function(x){return(_sbS.activeCharIds||[]).indexOf(x.id)>=0;}):null)||{name:'',persona:''};
          return(tpl||'')
            .replace(/\{\{角色名称\}\}/g,c.name||'')
            .replace(/\{\{角色设定\}\}/g,c.persona||'')
            .replace(/\{\{用户名称\}\}/g,(_sbS.user&&_sbS.user.name)||'用户')
            .replace(/\{\{用户设定\}\}/g,(_sbS.user&&_sbS.user.persona)||'')
            .replace(/\{\{当前时间\}\}/g,new Date().toLocaleString('zh-CN'));
        }
      };
    }

    /* ─── Main phone tab render ──────────────────────────── */
    function _renderPhoneTab(){

      /* CSS (once) */
      var _oldSt=TOPDOC.getElementById('pp-css');if(_oldSt)_oldSt.remove();if(true){
        var _s=TOPDOC.createElement('style');_s.id='pp-css';
        _s.textContent=
          '#pp-shell{display:flex;flex-direction:column;height:100%;overflow:hidden;background:var(--g-bg,transparent);}'
          +'#pp-screen{flex:1;overflow:hidden;position:relative;min-height:0;}'
          +'.pppg{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;background:transparent;}'
          +'@keyframes ppin{from{transform:translateX(100%)}to{transform:translateX(0)}}@keyframes ppback{from{transform:translateX(0)}to{transform:translateX(100%)}}@keyframes ppfade{from{opacity:0}to{opacity:1}}'
          +'.ppsl{animation:ppin .22s cubic-bezier(.4,0,.2,1);}'
          +'.ppslideout{animation:ppback .22s cubic-bezier(.4,0,.2,1);}'
          /* nav */
          +''
          +'.ppnav-title{font-size:20px;font-weight:700;color:rgba(255,255,255,.92);flex:1;}'
          +'.ppback{font-size:13px;color:rgba(255,255,255,.5);cursor:pointer;display:flex;align-items:center;gap:2px;line-height:1;}'
          +'.ppback svg{flex-shrink:0;}'
          +'.ppback:hover{color:rgba(255,255,255,.85);}'
          /* section */
          +''
          /* card */
          +''
          /* row */
          +'.pprow{display:flex;align-items:center;padding:11px 14px;min-height:44px;border-bottom:.5px solid rgba(255,255,255,.055);}'
          +'.pprow:last-child{border-bottom:none;}'
          +'.pprow.tap{cursor:pointer;transition:background .12s;}'
          +'.pprow.tap:active{background:rgba(255,255,255,.07);transform:scale(0.985);transition:background .05s,transform .05s;}'
          +'.ppic{width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,.10);backdrop-filter:blur(var(--ge-blur,0px)) saturate(var(--ge-sat,160%));-webkit-backdrop-filter:blur(var(--ge-blur,0px)) saturate(var(--ge-sat,160%));border:.5px solid rgba(255,255,255,.18);box-shadow:inset 0 1px 0 rgba(255,255,255,.28);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-right:11px;}'
          +'.ppic svg{stroke:rgba(255,255,255,.72);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;}'
          +'.pprb{flex:1;min-width:0;}'
          +'.pprt{font-size:15px;color:rgba(255,255,255,.88);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}'
          +'.pprs{font-size:11px;color:rgba(255,255,255,.35);margin-top:1px;}'
          +'.ppchev{color:rgba(255,255,255,.2);font-size:16px;margin-left:6px;flex-shrink:0;}'
          /* app grid */
          +'.ppgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:6px 14px 14px;}'
          +'.pphome{display:grid;grid-template-columns:repeat(4,1fr);gap:20px 8px;padding:8px 16px 18px;}'
          +'.pphi{display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;-webkit-tap-highlight-color:transparent;}'
          +'.pphi:active .pphic{transform:scale(.9);}'
          +'.pphic{position:relative;width:60px;height:60px;border-radius:19px;overflow:hidden;isolation:isolate;display:flex;align-items:center;justify-content:center;transition:transform .12s;z-index:0;box-shadow:inset 0 0 0 .5px rgba(255,255,255,calc(.45*var(--g-hl,1))),inset 0 1.5px 0 rgba(255,255,255,calc(.60*var(--g-hl,1))),inset 0 -1px 0 rgba(255,255,255,calc(.18*var(--g-hl,1))),0 8px 22px rgba(0,0,0,.28);}'
          +'.pphic::before{content:"";position:absolute;inset:0;border-radius:19px;background:var(--ge-tint,rgba(255,255,255,0));backdrop-filter:blur(var(--ge-blur,0px)) saturate(var(--ge-sat,160%)) brightness(var(--g-bright,1));-webkit-backdrop-filter:blur(var(--ge-blur,0px)) saturate(var(--ge-sat,160%)) brightness(var(--g-bright,1));filter:var(--ge-filter,url(#pp-lg-el));z-index:0;pointer-events:none;}'
          +'.pphic>*{position:relative;z-index:2;}'
          +'.pphic svg{stroke:rgba(255,255,255,.90);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 1px 3px rgba(0,0,0,.35));}'
          +'.pphl{font-size:11px;font-weight:500;color:rgba(255,255,255,.88);text-shadow:0 1px 4px rgba(0,0,0,.45);max-width:66px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center;}'
          +'.ppapp{position:relative;border-radius:var(--g-rad,20px);overflow:hidden;aspect-ratio:1.18/1;padding:14px 12px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:11px;cursor:pointer;background:transparent;border:none;z-index:0;isolation:isolate;box-shadow:inset 0 0 0 .5px rgba(255,255,255,calc(.40*var(--g-hl,1))),inset 0 1px 0 rgba(255,255,255,calc(.55*var(--g-hl,1))),0 4px 24px rgba(0,0,0,.20);}'+'.ppapp::before{content:"";position:absolute;inset:0;border-radius:var(--g-rad,20px);background:var(--ge-tint,rgba(255,255,255,0));backdrop-filter:blur(var(--ge-blur,0px)) saturate(var(--ge-sat,160%)) brightness(var(--g-bright,1));-webkit-backdrop-filter:blur(var(--ge-blur,0px)) saturate(var(--ge-sat,160%)) brightness(var(--g-bright,1));filter:var(--ge-filter,url(#pp-lg-el));z-index:0;pointer-events:none;}'+'.ppapp::after{content:"";position:absolute;inset:0;padding:.8px;border-radius:var(--g-rad,20px);pointer-events:none;z-index:3;background:linear-gradient(135deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.35) 35%,rgba(255,255,255,.70) 65%,rgba(255,255,255,0) 100%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;mix-blend-mode:screen;opacity:var(--g-hl,1);}'+'.ppapp>*{position:relative;z-index:1;}'+'.ppgrid .ppad{display:none;}'
          +'.ppapp:active{background:rgba(255,255,255,.09);transform:scale(0.97);}'+'.ppapp{transition:background .12s,transform .1s;}'+'.ppfi{width:100%;box-sizing:border-box;padding:9px 12px;background:rgba(255,255,255,.07);border:.5px solid rgba(255,255,255,.1);border-radius:10px;color:rgba(255,255,255,.88);font-size:14px;font-family:inherit;outline:none;-webkit-appearance:none;appearance:none;}.ppfi:focus{border-color:rgba(255,255,255,.22);background:rgba(255,255,255,.1);}.ppfi::placeholder{color:rgba(255,255,255,.22);}.pptog{position:relative;width:42px;height:26px;flex-shrink:0;cursor:pointer;}.pptog input{opacity:0;width:0;height:0;position:absolute;}.ppnav{display:flex;align-items:center;padding:14px 14px 8px;gap:8px;flex-shrink:0;border-bottom:.5px solid rgba(255,255,255,.06);margin-bottom:2px;}.ppsec{font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.25);padding:16px 14px 5px;}.ppcard{position:relative;border-radius:var(--g-rad,20px);overflow:hidden;margin:0 14px 10px;background:transparent;border:none;z-index:0;isolation:isolate;box-shadow:inset 0 0 0 .5px rgba(255,255,255,calc(.40*var(--g-hl,1))),inset 0 1px 0 rgba(255,255,255,calc(.55*var(--g-hl,1))),0 4px 24px rgba(0,0,0,.20);}.ppcard::before{content:"";position:absolute;inset:0;border-radius:var(--g-rad,20px);background:var(--ge-tint,rgba(255,255,255,0));backdrop-filter:blur(var(--ge-blur,0px)) saturate(var(--ge-sat,160%)) brightness(var(--g-bright,1));-webkit-backdrop-filter:blur(var(--ge-blur,0px)) saturate(var(--ge-sat,160%)) brightness(var(--g-bright,1));filter:var(--ge-filter,url(#pp-lg-el));z-index:0;pointer-events:none;box-shadow:none;}.ppcard::after{content:"";position:absolute;inset:0;padding:.8px;border-radius:var(--g-rad,20px);pointer-events:none;z-index:3;background:linear-gradient(var(--lg-rot,135deg),rgba(255,255,255,0) 0%,rgba(255,255,255,.35) 35%,rgba(255,255,255,.70) 65%,rgba(255,255,255,0) 100%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;mix-blend-mode:screen;opacity:var(--g-hl,1);}.ppcard>*{position:relative;z-index:2;}'
          +'.ppapp.off{opacity:.35;pointer-events:none;}'
          +'.ppaic{width:58px;height:58px;border-radius:17px;background:rgba(255,255,255,.10);border:.5px solid rgba(255,255,255,.18);box-shadow:inset 0 1px 0 rgba(255,255,255,.28);backdrop-filter:blur(var(--ge-blur,0px)) saturate(var(--ge-sat,160%));-webkit-backdrop-filter:blur(var(--ge-blur,0px)) saturate(var(--ge-sat,160%));display:flex;align-items:center;justify-content:center;}'
          +'.ppaic svg{stroke:rgba(255,255,255,.75);fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;}'
          +'.ppan{font-size:14px;font-weight:600;color:rgba(255,255,255,.92);letter-spacing:.2px;}'
          +'.ppad{font-size:11px;color:rgba(255,255,255,.35);line-height:1.4;}'
          /* button */
          +'.ppbtn{display:flex;align-items:center;justify-content:center;gap:6px;padding:10px 16px;border-radius:12px;background:rgba(255,255,255,.14);backdrop-filter:blur(var(--ge-blur,0px)) saturate(var(--ge-sat,160%));-webkit-backdrop-filter:blur(var(--ge-blur,0px)) saturate(var(--ge-sat,160%));border:.5px solid rgba(255,255,255,.30);box-shadow:inset 0 1.5px 0 rgba(255,255,255,.50),0 2px 8px rgba(0,0,0,.15);color:rgba(255,255,255,.92);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:background .15s,transform .1s;}'
          +'.ppbtn:hover{background:rgba(255,255,255,.22);}' +'.ppbtn:active{background:rgba(255,255,255,.26);transform:scale(.97);}'
          +'.ppbtn svg{stroke:rgba(255,255,255,.65);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;}'
          +'.ppbtn.del{color:rgba(255,255,255,.75);border-color:rgba(255,255,255,.18);background:rgba(255,255,255,.06);}'
          +'.ppbtn.del svg{stroke:rgba(255,255,255,.65);}'
          /* toggle */
          +'.pptog{width:40px;height:23px;border-radius:12px;background:rgba(255,255,255,.16);backdrop-filter:blur(var(--ge-blur,0px)) saturate(var(--ge-sat,160%));-webkit-backdrop-filter:blur(var(--ge-blur,0px)) saturate(var(--ge-sat,160%));border:.5px solid rgba(255,255,255,.22);cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;box-shadow:inset 0 1px 0 rgba(255,255,255,.30);}'
          +'.pptog.on{background:rgba(255,255,255,.52);box-shadow:inset 0 1px 0 rgba(255,255,255,.70);}'
          +'.pptog::after{content:"";position:absolute;top:2px;left:2px;width:19px;height:19px;background:#fff;border-radius:10px;transition:transform .2s;box-shadow:0 1px 4px rgba(0,0,0,.3);}'
          +'.pptog.on::after{transform:translateX(17px);}'
          /* field input */
          +'.ppfield{padding:7px 12px;border-bottom:.5px solid rgba(255,255,255,.055);}'
          +'.ppfield:last-child{border-bottom:none;}'
          +'.ppflb{font-size:10px;color:rgba(255,255,255,.32);letter-spacing:.3px;margin-bottom:3px;}'
          +'.ppinp{width:100%;box-sizing:border-box;background:rgba(255,255,255,.07);border:.5px solid rgba(255,255,255,.1);border-radius:9px;color:rgba(255,255,255,.88);padding:7px 10px;font-size:13px;outline:none;font-family:inherit;}'
          +'.ppinp:focus{border-color:rgba(255,255,255,.32);}'
          +'.ppta{width:100%;box-sizing:border-box;background:rgba(255,255,255,.07);border:.5px solid rgba(255,255,255,.1);border-radius:9px;color:rgba(255,255,255,.88);padding:7px 10px;font-size:12px;line-height:1.6;resize:none;outline:none;font-family:inherit;}'
          +'.ppta:focus{border-color:rgba(255,255,255,.32);}'
          /* override for v9.25 content */
          +'#pp-screen input:not([type=range]),#pp-screen textarea,#pp-screen select{background:rgba(255,255,255,.07)!important;border:.5px solid rgba(255,255,255,.1)!important;color:rgba(255,255,255,.88)!important;border-radius:9px!important;outline:none!important;}'
          +'#pp-screen input:focus,#pp-screen textarea:focus,#pp-screen select:focus{border-color:rgba(255,255,255,.32)!important;}'
          +'#pp-screen button{background:rgba(255,255,255,.08)!important;border:.5px solid rgba(255,255,255,.13)!important;color:rgba(255,255,255,.82)!important;border-radius:9px!important;}'
          +'#pp-screen button:hover{background:rgba(255,255,255,.13)!important;}'
          +'#pp-screen input[type=range]{-webkit-appearance:none!important;appearance:none!important;background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important;margin:0!important;accent-color:rgba(255,255,255,.9);}'
          +'#pp-screen input[type=range]::-webkit-slider-runnable-track{height:4px;border-radius:2px;background:rgba(255,255,255,.20);box-shadow:inset 0 1px 1px rgba(0,0,0,.25);}'
          +'#pp-screen input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:#fff;margin-top:-7px;border:none;box-shadow:0 1px 5px rgba(0,0,0,.45),inset 0 -1px 1px rgba(0,0,0,.08);cursor:pointer;}'
          +'#pp-screen input[type=range]::-moz-range-track{height:4px;border-radius:2px;background:rgba(255,255,255,.20);}'
          +'#pp-screen input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#fff;border:none;box-shadow:0 1px 5px rgba(0,0,0,.45);cursor:pointer;}'
          /* 移动端适配：窄屏下面板自适应尺寸并居中（参考酒馆 mobile-styles 断点 1000px/450px） */
          +'@media screen and (max-width:1000px) and (min-width:451px){#pp-panel{max-width:calc(100vw - 16px)!important;max-height:calc(100vh - 16px)!important;max-height:calc(100dvh - 16px)!important;}}'
          +'@media screen and (max-width:450px){#pp-panel{width:calc(100vw - 10px)!important;height:calc(100vh - 10px)!important;height:calc(100dvh - 10px)!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;border-radius:22px!important;}#pp-glass{border-radius:22px!important;}#pp-fab{width:46px!important;height:46px!important;}.ppgrid{gap:10px!important;padding:6px 10px 12px!important;}.pphome{gap:16px 6px!important;padding:8px 10px 14px!important;}.ppcard{margin-left:10px!important;margin-right:10px!important;}.ppnav{padding-left:10px!important;padding-right:10px!important;}.ppnav-title{font-size:18px!important;}.pprow{padding-left:12px!important;padding-right:12px!important;}}';
        TOPDOC.head.appendChild(_s);
      }
      /* Liquid Glass SVG Filter (once) */
      var _lgOld=TOPDOC.getElementById('pp-lg-svg');
      if(_lgOld&&_lgOld.innerHTML.indexOf('pp-lg-bg')===-1){try{_lgOld.parentNode.removeChild(_lgOld);}catch(e){}_lgOld=null;}
      if(!_lgOld){
        var _lgEl=TOPDOC.createElement('div');
        _lgEl.id='pp-lg-svg';
        _lgEl.style.cssText='position:fixed;width:0;height:0;overflow:hidden;pointer-events:none;opacity:0;top:0;left:0;';
        _lgEl.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;" aria-hidden="true"><defs><filter id="pp-lg-bg" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB"><feImage href="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Cdefs%3E%3CradialGradient%20id%3D%22g%22%20cx%3D%2250%25%22%20cy%3D%2250%25%22%20r%3D%2272%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22black%22/%3E%3Cstop%20offset%3D%2295%25%22%20stop-color%3D%22black%22/%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22white%22/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22url%28%23g%29%22/%3E%3C/svg%3E" preserveAspectRatio="none" result="mask"/><feTurbulence type="fractalNoise" baseFrequency="0.012 0.012" numOctaves="2" seed="7" result="noise"/><feGaussianBlur in="noise" stdDeviation="2" result="soft"/><feComposite in="soft" in2="mask" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="nm"/><feFlood flood-color="rgb(128,128,128)" result="gray"/><feComposite in="gray" in2="mask" operator="arithmetic" k1="-1" k2="1" k3="0" k4="0" result="gm"/><feComposite in="nm" in2="gm" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="dmap"/><feDisplacementMap in="SourceGraphic" in2="dmap" scale="60" xChannelSelector="R" yChannelSelector="G"/></filter><filter id="pp-lg-el" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB"><feImage href="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Cdefs%3E%3CradialGradient%20id%3D%22g%22%20cx%3D%2250%25%22%20cy%3D%2250%25%22%20r%3D%2272%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22black%22/%3E%3Cstop%20offset%3D%2295%25%22%20stop-color%3D%22black%22/%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22white%22/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22url%28%23g%29%22/%3E%3C/svg%3E" preserveAspectRatio="none" result="mask"/><feTurbulence type="fractalNoise" baseFrequency="0.012 0.012" numOctaves="2" seed="7" result="noise"/><feGaussianBlur in="noise" stdDeviation="2" result="soft"/><feComposite in="soft" in2="mask" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="nm"/><feFlood flood-color="rgb(128,128,128)" result="gray"/><feComposite in="gray" in2="mask" operator="arithmetic" k1="-1" k2="1" k3="0" k4="0" result="gm"/><feComposite in="nm" in2="gm" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="dmap"/><feDisplacementMap in="SourceGraphic" in2="dmap" scale="60" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>';
        TOPDOC.body.appendChild(_lgEl);
      }


      /* Shell */
      var shell=TOPDOC.createElement('div');shell.id='pp-shell';_applyGlass(shell);
      var scr=TOPDOC.createElement('div');scr.id='pp-screen';shell.appendChild(scr);TOP._ppscr=scr;
      /* Liquid Glass 鼠标追踪 — 驱动 --lg-rot 变量 */
      scr.addEventListener('mousemove',function(e){
        var r=scr.getBoundingClientRect();
        var ox=(e.clientX-r.left-r.width/2)/(r.width/2);
        scr.style.setProperty('--lg-rot',(135+ox*60)+'deg');
      });
      scr.addEventListener('mouseleave',function(){
        scr.style.setProperty('--lg-rot','135deg');
      });

      /* Nav state */
      if(!TOP._ppnav)TOP._ppnav={page:'home',data:{}};
      var _nav=TOP._ppnav;

      /* iOS home bar */
      var _homeBar=TOPDOC.createElement('div');
      _homeBar.className='pp-homebar';
      _homeBar.style.cssText='flex-shrink:0;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;overflow:hidden;background:transparent;border-top:.5px solid rgba(255,255,255,.16);box-shadow:inset 0 1px 0 rgba(255,255,255,.12);';
      var _homeBarGlass=TOPDOC.createElement('div');
      _homeBarGlass.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:0;background:var(--ge-tint,rgba(255,255,255,0));backdrop-filter:blur(var(--ge-blur,0px)) saturate(var(--ge-sat,160%));-webkit-backdrop-filter:blur(var(--ge-blur,0px)) saturate(var(--ge-sat,160%));filter:var(--ge-filter,url(#pp-lg-el));';
      _homeBar.appendChild(_homeBarGlass);
      var _homeBarPill=TOPDOC.createElement('div');
      _homeBarPill.className='pp-homebar-pill';
      _homeBarPill.style.cssText='position:relative;z-index:1;width:130px;height:5px;background:rgba(255,255,255,0.28);border-radius:3px;transition:background .15s;';
      _homeBar.appendChild(_homeBarPill);
      shell.appendChild(_homeBar);
      /* Floating close button */
      var _floatClose=TOPDOC.createElement('button');
      _floatClose.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      _floatClose.style.cssText='position:absolute;top:10px;right:10px;z-index:100;width:28px;height:28px;border-radius:50%;border:none;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;transition:background .15s;';
      _floatClose.addEventListener('mouseenter',function(){this.style.background='rgba(255,255,255,.2)';});
      _floatClose.addEventListener('mouseleave',function(){this.style.background='rgba(255,255,255,.1)';});
      _floatClose.addEventListener('click',function(e){e.stopPropagation();_closePanel();var tb=overlay.querySelector('#pp-btn-toggle');if(tb){tb.style.color='rgba(255,255,255,.38)';tb.style.background='transparent';tb.style.borderColor='transparent';}});
      shell.style.position='relative';
      shell.appendChild(_floatClose);
      var _lastTap=0;
      _homeBar.addEventListener('click',function(){
        var now=Date.now();
        if(now-_lastTap<320){
          /* double tap → home */
          _homeBarPill.style.background='rgba(255,255,255,0.6)';
          TOP.setTimeout(function(){_homeBarPill.style.background='rgba(255,255,255,0.28)';},300);
          _nav.page='home';_nav.data={};_isBack=true;_render();
        } else {
          /* single tap → back (pop one level) */
          /* 世界书管理模式：回主屏 */
          if(_nav.page==='worldbook' && _ui.wbMgmtMode){
            _ui.wbMgmtMode=false;
            if(TOP._ppwbRedraw)TOP._ppwbRedraw();
            _lastTap=now;return;
          }
          var _backMap={'s-api':'settings','s-chars':'settings','s-presets':'settings',
            's-wb':'settings','s-tts':'settings','s-vc':'settings',
            's-plugin':'settings','s-apps':'settings','s-glass':'settings',
            'settings':'home','app-run':'home',
            'phone-contacts':'home','call':'phone-contacts',
            'phone-recents':'home','phone-recents-detail':'phone-recents',
            'contacts':'home','contact-detail':'contacts','contact-new':'contacts','contact-add':'contacts',
            'worldbook':'home',
            'chats':'home','chat-detail':'chats',
            'chat-archives':'chat-detail','chat-style':'chat-detail'};
          var dest=_backMap[_nav.page]||'home';
          _nav.page=dest;_nav.data={};_isBack=true;_render();
        }
        _lastTap=now;
      });
      _homeBar.addEventListener('mouseenter',function(){_homeBarPill.style.background='rgba(255,255,255,0.45)';});
      _homeBar.addEventListener('mouseleave',function(){_homeBarPill.style.background='rgba(255,255,255,0.28)';});


      /* Helpers */
      function _el(tag,cls,html){var e=TOPDOC.createElement(tag);if(cls)e.className=cls;if(html)e.innerHTML=html;return e;}
      function _div(cls,html){return _el('div',cls,html);}
      function _svg(d,sz){sz=sz||18;return '<svg width="'+sz+'" height="'+sz+'" viewBox="0 0 24 24">'+d+'</svg>';}
      function _go(page,data){
        _nav.page=page;_nav.data=data||{};
        // 跳转到通讯录时，拉最新persona
        if(page === 'contacts'){
          setTimeout(function(){
            _pullSTUser(true);
          }, 50);
        }
        // 跳转到世界书页面时，拉最新世界书列表和启用状态
        if(page === 'worldbook'){
          setTimeout(function(){
            _pullAllWorldBooks(true);
          }, 50);
        }
        _render();
      }
      TOP._ppgo=_go;
      function _navbar(title,backPage){
        var nb=_div('ppnav');
        /* Live clock element */
        var clkEl=TOPDOC.createElement('span');
        clkEl.style.cssText='font-size:17px;font-weight:700;color:rgba(255,255,255,.92);letter-spacing:.4px;font-variant-numeric:tabular-nums;cursor:'+(backPage?'pointer':'default')+';user-select:none;flex-shrink:0;';
        function _uc(){var n=new Date();clkEl.textContent=(n.getHours()<10?'0':'')+n.getHours()+':'+(n.getMinutes()<10?'0':'')+n.getMinutes();}
        _uc();
        var _ci=setInterval(_uc,1000);
        /* Clean up interval when el detaches */
        var _mo=new TOP.MutationObserver(function(){if(!TOPDOC.body.contains(clkEl)){clearInterval(_ci);_mo.disconnect();}});
        _mo.observe(TOPDOC.body,{childList:true,subtree:true});
        if(backPage){clkEl.addEventListener('click',function(){_isBack=true;_go(backPage);});}
        nb.appendChild(clkEl);
        return nb;
      }
      function _tog(val,cb){
        var t=_div('pptog'+(val?' on':''));
        t.addEventListener('click',function(e){e.stopPropagation();val=!val;t.className='pptog'+(val?' on':'');cb(val);});
        return t;
      }
      /* Wrap a v9.25 fragment in a scrollable page with auto re-render on interaction */
      function _wrapLegacy(title,backPage,renderFn){
        var pg=_div('pppg ppsl');pg.appendChild(_navbar(title,backPage));
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:4px 0 20px;';
        var wrap=_div('');
        var _busy=false;
        function _draw(){
          if(_busy)return;_busy=true;
          try{var f=renderFn();while(wrap.firstChild)wrap.removeChild(wrap.firstChild);if(f){f.childNodes&&f.childNodes[0]&&(f.childNodes[0].style||(f.childNodes[0].style={}));wrap.appendChild(f);if(wrap.firstChild&&wrap.firstChild.style)wrap.firstChild.style.animation='ppfade .18s ease';}}catch(e){wrap.innerHTML='<div style="padding:16px;font-size:12px;color:rgba(255,255,255,.65)">渲染错误: '+e.message+'</div>';}
          _busy=false;
        }
        TOP._ppdraw=_draw;
        _draw();
        /* Re-render after any click/change so toggles update visually */
        body.addEventListener('click',function(){TOP.setTimeout(_draw,80);});
        body.addEventListener('change',function(){TOP.setTimeout(_draw,60);});
        body.appendChild(wrap);pg.appendChild(body);scr.appendChild(pg);
      }
      /* Settings field row */
      function _fieldRow(field,values){
        var r=_div('ppfield');
        r.appendChild(_div('ppflb',field.label));
        if(field.type==='toggle'){
          var row=_div('');row.style.cssText='display:flex;align-items:center;justify-content:space-between;';
          row.appendChild(_div('','<span style="font-size:14px;color:rgba(255,255,255,.82);">'+field.label+'</span>'));
          var tv=!!(values[field.key]!==undefined?values[field.key]:field.default);
          row.appendChild(_tog(tv,function(v){values[field.key]=v;_W();}));
          r.innerHTML='';r.appendChild(row);
        } else if(field.type==='select'){
          var sel=TOPDOC.createElement('select');sel.className='ppinp';
          (field.options||[]).forEach(function(o){
            var opt=TOPDOC.createElement('option');opt.value=o.v||o.value;opt.textContent=o.l||o.label;
            if(opt.value===(values[field.key]||field.default))opt.selected=true;
            sel.appendChild(opt);
          });
          sel.addEventListener('mousedown',function(e){e.stopPropagation();});
          sel.addEventListener('change',function(){values[field.key]=this.value;_W();});
          r.appendChild(sel);
        } else if(field.type==='textarea'){
          var ta=TOPDOC.createElement('textarea');ta.className='ppta';
          ta.rows=field.rows||4;ta.value=values[field.key]||field.default||'';
          if(field.placeholder)ta.placeholder=field.placeholder;
          ta.addEventListener('mousedown',function(e){e.stopPropagation();});
          ta.addEventListener('input',function(){values[field.key]=this.value;_W();});
          r.appendChild(ta);
        } else if(field.type==='textarea-presets'){
          /* ── variable insertion buttons ── */
          if(field.variables&&field.variables.length){
            var vWrap=TOPDOC.createElement('div');
            vWrap.style.cssText='display:flex;flex-wrap:wrap;gap:4px;margin-bottom:7px;';
            (function(vWrap){
              field.variables.forEach(function(vv){
                (function(vv){
                  var vb=TOPDOC.createElement('button');
                  vb.textContent=vv;
                  vb.style.cssText='padding:2px 8px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.14);color:rgba(255,255,255,.70);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.6;';
                  vb.addEventListener('click',function(e){
                    e.stopPropagation();
                    var pos=ta2.selectionStart||ta2.value.length;
                    ta2.value=ta2.value.slice(0,pos)+vv+ta2.value.slice(pos);
                    ta2.selectionStart=ta2.selectionEnd=pos+vv.length;
                    values[field.key]=ta2.value;_W();ta2.focus();
                  });
                  vWrap.appendChild(vb);
                })(vv);
              });
            })(vWrap);
            r.appendChild(vWrap);
          }
          /* ── textarea ── */
          var ta2=TOPDOC.createElement('textarea');ta2.className='ppta';
          ta2.rows=field.rows||5;
          ta2.value=values[field.key]!==undefined?values[field.key]:(field.default||'');
          if(field.placeholder)ta2.placeholder=field.placeholder;
          ta2.addEventListener('mousedown',function(e){e.stopPropagation();});
          ta2.addEventListener('input',function(){values[field.key]=this.value;_W();});
          r.appendChild(ta2);
          /* ── preset controls ── */
          (function(ta2){
            var _pk='__p_'+field.key;
            var _getP=function(){return values[_pk]||[];};
            var pRow=TOPDOC.createElement('div');
            pRow.style.cssText='display:flex;gap:5px;margin-top:6px;align-items:center;flex-wrap:wrap;';
            var pSel=TOPDOC.createElement('select');pSel.className='ppinp';
            pSel.style.cssText='flex:1;min-width:80px;font-size:11px;padding:3px 6px;';
            var _fillSel=function(){
              pSel.innerHTML='';
              var dflt=TOPDOC.createElement('option');dflt.value='';dflt.textContent='— 选择预设 —';pSel.appendChild(dflt);
              _getP().forEach(function(p,i){var o=TOPDOC.createElement('option');o.value=String(i);o.textContent=p.name;pSel.appendChild(o);});
            };
            _fillSel();
            pSel.addEventListener('mousedown',function(e){e.stopPropagation();});
            var _pbtn=function(txt){
              var b=TOPDOC.createElement('button');b.textContent=txt;
              b.style.cssText='padding:3px 10px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.13);color:rgba(255,255,255,.68);font-size:11px;cursor:pointer;font-family:inherit;white-space:nowrap;';
              b.addEventListener('mouseenter',function(){b.style.background='rgba(255,255,255,.15)';});
              b.addEventListener('mouseleave',function(){b.style.background='rgba(255,255,255,.09)';});
              return b;
            };
            var bApply=_pbtn('应用');
            bApply.addEventListener('click',function(e){
              e.stopPropagation();
              var idx=parseInt(pSel.value);if(isNaN(idx))return;
              var p=_getP()[idx];if(!p)return;
              ta2.value=p.content;values[field.key]=ta2.value;_W();
            });
            var bSave=_pbtn('保存预设');
            bSave.addEventListener('click',function(e){
              e.stopPropagation();
              var nm=TOP.prompt('预设名称：');if(!nm||!nm.trim())return;
              var ps=_getP();ps.push({name:nm.trim(),content:ta2.value});
              values[_pk]=ps;_W();_fillSel();pSel.value=String(ps.length-1);
            });
            var bDel=_pbtn('删除');
            bDel.style.color='rgba(255,255,255,.42)';
            bDel.addEventListener('click',function(e){
              e.stopPropagation();
              var idx=parseInt(pSel.value);if(isNaN(idx))return;
              var ps=_getP();ps.splice(idx,1);values[_pk]=ps;_W();_fillSel();
            });
            pRow.appendChild(pSel);pRow.appendChild(bApply);pRow.appendChild(bSave);pRow.appendChild(bDel);
            r.appendChild(pRow);
          })(ta2);
        } else {
          var inp=TOPDOC.createElement('input');inp.className='ppinp';
          inp.type=field.type==='password'?'password':(field.type==='number'?'number':'text');
          inp.value=values[field.key]!==undefined?values[field.key]:(field.default||'');
          if(field.placeholder)inp.placeholder=field.placeholder;
          if(field.min!==undefined)inp.min=field.min;if(field.max!==undefined)inp.max=field.max;
          inp.addEventListener('mousedown',function(e){e.stopPropagation();});
          inp.addEventListener('change',function(){values[field.key]=(inp.type==='number'?parseFloat(this.value):this.value);_W();});
          r.appendChild(inp);
        }
        return r;
      }

      /* ════════════════════════════════════════════════════
         HOME SCREEN
      ════════════════════════════════════════════════════ */
      function _pgHome(){
        var pg=_div('pppg ppsl');
        var hdr=_div('');hdr.style.cssText='padding:26px 20px 18px;flex-shrink:0;';
        hdr.innerHTML='<div style="font-size:10px;font-weight:600;letter-spacing:3px;color:rgba(255,255,255,.35);text-transform:uppercase;margin-bottom:10px;">功能系统</div>'
          +'<div id="ppclk" style="font-size:58px;font-weight:200;line-height:1;color:rgba(255,255,255,.96);letter-spacing:1px;font-variant-numeric:tabular-nums;text-shadow:0 2px 12px rgba(0,0,0,.35);"></div>'
          +'<div id="ppdate" style="font-size:13px;font-weight:500;color:rgba(255,255,255,.45);letter-spacing:1px;margin-top:8px;"></div>';
        pg.appendChild(hdr);
        (function(){
          var ck=hdr.querySelector('#ppclk'),dt=hdr.querySelector('#ppdate');
          function _u(){var n=new Date();ck.textContent=(n.getHours()<10?'0':'')+n.getHours()+':'+(n.getMinutes()<10?'0':'')+n.getMinutes();
            dt.textContent=(n.getMonth()+1)+'月'+n.getDate()+'日 '+['周日','周一','周二','周三','周四','周五','周六'][n.getDay()];}
          _u();var _t=TOP.setInterval(function(){if(!TOPDOC.body.contains(ck)){TOP.clearInterval(_t);return;}_u();},1000);
        })();
        /* iOS springboard icon grid */
        var icons=[];
        function _appCard(name,desc,svgD,onclick,extra){
          var c=_div('pphi'+(extra?' '+extra:''));
          c.appendChild(_div('pphic',_svg(svgD,26)));
          c.appendChild(_div('pphl',name));
          if(onclick)c.addEventListener('click',onclick);
          return c;
        }
        icons.push(_appCard('设置','功能配置 · API · 角色',
          '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>',
          function(){_go('settings');}));
        /* Built-in: 通讯录 */
        icons.push(_appCard('通讯录','联系人 · 角色 · 用户',
          '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
          function(){_go('contacts');}));
        /* Built-in: 聊天 */
        icons.push(_appCard('聊天','消息 · 对话 · 好友',
          '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
          function(){_go('chats');}));
        /* Built-in: 世界书 */
        icons.push(_appCard('世界书','世界观 · 条目 · 设定',
          '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>',
          function(){_go('worldbook');}));
        /* Plugin apps */
        (_sbS.ppApps||[]).filter(function(a){return a.enabled;}).forEach(function(app){
          var c=_div('pphi');
          var ic=_div('pphic');ic.innerHTML='<svg width="26" height="26" viewBox="0 0 24 24" style="stroke:rgba(255,255,255,.88);fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;position:relative;z-index:2;">'+app.icon+'</svg>';
          c.appendChild(ic);c.appendChild(_div('pphl',app.name));
          c.addEventListener('click',function(){_go('app-run',{app:app});});
          icons.push(c);
        });
        /* 应用商城 card – 跳转到应用管理页 */
        icons.push(_appCard('应用商城','导入 · 管理插件 App',
          '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>',
          function(){_go('store');}));
        /* iOS 分页: 每页8个, 左右滑切换, 仅 app 网格滑动 */
        var PER=8;
        var pageCount=Math.max(1,Math.ceil(icons.length/PER));
        var viewport=_div('');viewport.style.cssText='flex:1;min-height:0;overflow:hidden;position:relative;touch-action:pan-y;';
        var track=_div('');track.style.cssText='display:flex;height:100%;transition:transform .32s cubic-bezier(.22,.61,.36,1);will-change:transform;';
        for(var _pi=0;_pi<pageCount;_pi++){
          var _page=_div('');_page.style.cssText='flex:0 0 100%;box-sizing:border-box;display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:min-content;gap:20px 8px;padding:8px 16px 18px;align-content:start;';
          for(var _ii=_pi*PER;_ii<Math.min((_pi+1)*PER,icons.length);_ii++)_page.appendChild(icons[_ii]);
          track.appendChild(_page);
        }
        viewport.appendChild(track);
        var dots=_div('');dots.style.cssText='display:flex;justify-content:center;gap:7px;padding:6px 0 14px;flex-shrink:0;';
        var _dotEls=[];
        for(var _di=0;_di<pageCount;_di++){(function(d){var dot=_div('');dot.style.cssText='width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.25);transition:all .2s;cursor:pointer;';dot.addEventListener('click',function(){_goPage(d);});dots.appendChild(dot);_dotEls.push(dot);})(_di);}
        if(pageCount<=1)dots.style.display='none';
        var _cur=0;
        function _updDots(){_dotEls.forEach(function(d,i){d.style.background=i===_cur?'rgba(255,255,255,.92)':'rgba(255,255,255,.25)';d.style.transform=i===_cur?'scale(1.18)':'scale(1)';});}
        function _goPage(pp){_cur=Math.max(0,Math.min(pageCount-1,pp));track.style.transition='transform .32s cubic-bezier(.22,.61,.36,1)';track.style.transform='translateX('+(-_cur*100)+'%)';_updDots();}
        _updDots();
        var _drag=false,_sx=0,_vw=0,_base=0,_moved=false;
        viewport.addEventListener('pointerdown',function(e){_drag=true;_moved=false;_sx=e.clientX;_vw=viewport.clientWidth||1;_base=-_cur*_vw;track.style.transition='none';try{e.stopPropagation();}catch(_e){}});
        viewport.addEventListener('pointermove',function(e){if(!_drag)return;try{e.stopPropagation();}catch(_e){}var dx=e.clientX-_sx;if(Math.abs(dx)>6)_moved=true;var x=_base+dx;var mn=-(pageCount-1)*_vw;if(x>0)x=x*0.35;if(x<mn)x=mn+(x-mn)*0.35;track.style.transform='translateX('+x+'px)';});
        function _endDrag(e){if(!_drag)return;_drag=false;var ex=(e&&e.clientX!=null)?e.clientX:_sx;var dx=ex-_sx;var th=_vw*0.18;if(dx<-th)_goPage(_cur+1);else if(dx>th)_goPage(_cur-1);else _goPage(_cur);}
        viewport.addEventListener('pointerup',_endDrag);viewport.addEventListener('pointercancel',_endDrag);
        viewport.addEventListener('click',function(e){if(_moved){e.preventDefault();e.stopPropagation();_moved=false;}},true);
        pg.appendChild(viewport);pg.appendChild(dots);scr.appendChild(pg);
      }


      /* ════════════════════════════════════════════════════
         通讯录 – iOS Contacts Style
      ════════════════════════════════════════════════════ */
      /* 全局：按首字母分组（英文按首字母，中文按拼音首字母） */
      /* 全局：按首字母分组（英文按首字母，中文按拼音首字母，未命中/数字归 #） */
      var PINYIN_MAP={阿:'A',安:'A',艾:'A',爱:'A',奥:'A',敖:'A',白:'B',柏:'B',班:'B',毕:'B',冰:'B',波:'B',博:'B',彬:'B',斌:'B',宝:'B',北:'B',碧:'B',本:'B',伯:'B',邦:'B',八:'B',蔡:'C',曹:'C',陈:'C',程:'C',成:'C',崔:'C',超:'C',晨:'C',春:'C',纯:'C',聪:'C',川:'C',传:'C',灿:'C',采:'C',慈:'C',池:'C',常:'C',昌:'C',辰:'C',楚:'C',城:'C',诚:'C',戴:'D',邓:'D',丁:'D',董:'D',杜:'D',段:'D',东:'D',德:'D',丹:'D',典:'D',蝶:'D',鼎:'D',栋:'D',达:'D',大:'D',道:'D',樊:'F',范:'F',方:'F',冯:'F',傅:'F',飞:'F',峰:'F',锋:'F',芳:'F',菲:'F',芬:'F',凤:'F',福:'F',甫:'F',枫:'F',凡:'F',发:'F',富:'F',高:'G',郭:'G',顾:'G',龚:'G',国:'G',刚:'G',光:'G',广:'G',桂:'G',冠:'G',功:'G',观:'G',果:'G',歌:'G',格:'G',韩:'H',何:'H',胡:'H',黄:'H',侯:'H',华:'H',贺:'H',郝:'H',洪:'H',霍:'H',惠:'H',海:'H',浩:'H',涵:'H',航:'H',豪:'H',鸿:'H',红:'H',辉:'H',慧:'H',会:'H',虹:'H',河:'H',和:'H',虎:'H',瀚:'H',怀:'H',欢:'H',环:'H',焕:'H',纪:'J',江:'J',姜:'J',蒋:'J',金:'J',景:'J',贾:'J',焦:'J',杰:'J',佳:'J',家:'J',嘉:'J',建:'J',剑:'J',健:'J',军:'J',君:'J',俊:'J',静:'J',晶:'J',锦:'J',津:'J',娟:'J',洁:'J',进:'J',京:'J',经:'J',精:'J',九:'J',居:'J',菊:'J',吉:'J',季:'J',坚:'J',康:'K',孔:'K',柯:'K',凯:'K',可:'K',科:'K',坤:'K',昆:'K',楷:'K',赖:'L',雷:'L',李:'L',梁:'L',廖:'L',林:'L',刘:'L',柳:'L',龙:'L',卢:'L',陆:'L',罗:'L',吕:'L',凌:'L',黎:'L',丽:'L',磊:'L',兰:'L',蓝:'L',朗:'L',乐:'L',琳:'L',麟:'L',灵:'L',露:'L',路:'L',洛:'L',澜:'L',莲:'L',霖:'L',亮:'L',良:'L',立:'L',力:'L',里:'L',礼:'L',临:'L',伦:'L',绿:'L',鹿:'L',连:'L',零:'L',马:'M',毛:'M',孟:'M',莫:'M',牟:'M',穆:'M',美:'M',梦:'M',明:'M',敏:'M',名:'M',民:'M',慕:'M',梅:'M',曼:'M',漫:'M',苗:'M',妙:'M',木:'M',沐:'M',默:'M',墨:'M',鸣:'M',萌:'M',倪:'N',牛:'N',聂:'N',宁:'N',娜:'N',南:'N',念:'N',凝:'N',欧:'O',区:'O',潘:'P',彭:'P',皮:'P',平:'P',庞:'P',裴:'P',鹏:'P',萍:'P',品:'P',普:'P',浦:'P',谱:'P',齐:'Q',秦:'Q',邱:'Q',钱:'Q',强:'Q',乔:'Q',清:'Q',青:'Q',晴:'Q',庆:'Q',启:'Q',琪:'Q',茜:'Q',倩:'Q',全:'Q',群:'Q',秋:'Q',曲:'Q',屈:'Q',勤:'Q',琴:'Q',琼:'Q',泉:'Q',乾:'Q',巧:'Q',前:'Q',千:'Q',桥:'Q',任:'R',荣:'R',阮:'R',然:'R',日:'R',瑞:'R',睿:'R',润:'R',若:'R',柔:'R',融:'R',仁:'R',人:'R',容:'R',孙:'S',沈:'S',宋:'S',苏:'S',邵:'S',施:'S',石:'S',史:'S',舒:'S',帅:'S',司:'S',盛:'S',尚:'S',申:'S',沙:'S',山:'S',珊:'S',森:'S',诗:'S',世:'S',士:'S',树:'S',书:'S',霜:'S',双:'S',水:'S',顺:'S',思:'S',松:'S',素:'S',硕:'S',所:'S',述:'S',胜:'S',圣:'S',生:'S',声:'S',深:'S',神:'S',萨:'S',谭:'T',唐:'T',汤:'T',陶:'T',田:'T',童:'T',涂:'T',滕:'T',天:'T',婷:'T',涛:'T',泰:'T',同:'T',桐:'T',通:'T',挺:'T',铁:'T',图:'T',途:'T',团:'T',万:'W',汪:'W',王:'W',韦:'W',魏:'W',温:'W',文:'W',吴:'W',伍:'W',武:'W',卫:'W',伟:'W',维:'W',威:'W',旺:'W',望:'W',为:'W',唯:'W',薇:'W',婉:'W',晚:'W',蔚:'W',吾:'W',五:'W',午:'W',无:'W',舞:'W',悟:'W',夏:'X',肖:'X',谢:'X',徐:'X',许:'X',熊:'X',薛:'X',辛:'X',邢:'X',向:'X',项:'X',席:'X',奚:'X',习:'X',喜:'X',西:'X',希:'X',溪:'X',熙:'X',霞:'X',仙:'X',贤:'X',显:'X',现:'X',相:'X',香:'X',祥:'X',翔:'X',晓:'X',孝:'X',笑:'X',心:'X',欣:'X',新:'X',信:'X',星:'X',行:'X',醒:'X',秀:'X',修:'X',虚:'X',雪:'X',学:'X',宣:'X',玄:'X',选:'X',绚:'X',勋:'X',寻:'X',讯:'X',迅:'X',严:'Y',杨:'Y',姚:'Y',叶:'Y',易:'Y',殷:'Y',尹:'Y',袁:'Y',岳:'Y',云:'Y',俞:'Y',余:'Y',于:'Y',尤:'Y',游:'Y',颜:'Y',阎:'Y',晏:'Y',阳:'Y',洋:'Y',扬:'Y',燕:'Y',艳:'Y',雁:'Y',耀:'Y',业:'Y',野:'Y',夜:'Y',一:'Y',伊:'Y',依:'Y',仪:'Y',宜:'Y',义:'Y',艺:'Y',忆:'Y',译:'Y',益:'Y',毅:'Y',音:'Y',银:'Y',英:'Y',迎:'Y',盈:'Y',影:'Y',勇:'Y',永:'Y',咏:'Y',友:'Y',有:'Y',右:'Y',宇:'Y',雨:'Y',语:'Y',玉:'Y',育:'Y',悦:'Y',月:'Y',越:'Y',跃:'Y',源:'Y',远:'Y',元:'Y',园:'Y',愿:'Y',韵:'Y',蕴:'Y',允:'Y',运:'Y',亚:'Y',臧:'Z',曾:'Z',翟:'Z',詹:'Z',张:'Z',章:'Z',赵:'Z',郑:'Z',钟:'Z',周:'Z',朱:'Z',庄:'Z',邹:'Z',卓:'Z',祝:'Z',诸:'Z',祖:'Z',左:'Z',宗:'Z',志:'Z',智:'Z',哲:'Z',泽:'Z',珍:'Z',真:'Z',振:'Z',震:'Z',正:'Z',政:'Z',之:'Z',芝:'Z',知:'Z',直:'Z',植:'Z',至:'Z',制:'Z',中:'Z',忠:'Z',众:'Z',舟:'Z',洲:'Z',竹:'Z',主:'Z',柱:'Z',著:'Z',追:'Z',准:'Z',子:'Z',紫:'Z',自:'Z',字:'Z',综:'Z',总:'Z',足:'Z',族:'Z',组:'Z',最:'Z',尊:'Z',昨:'Z',作:'Z',坐:'Z',座:'Z'};
      function _firstLetter(s){
        s=(s||'').trim();if(!s)return '#';
        var c=s.charAt(0);var cu=c.toUpperCase();
        if(cu>='A'&&cu<='Z')return cu;
        var cc=c.charCodeAt(0);
        if(cc>=48&&cc<=57)return '#';
        return PINYIN_MAP[c]||'#';
      }
      /* Avatar helper: colored circle with initial or image */
      function _mkAvatar(name,avatarUrl,size){
        size=size||44;
        var av=TOPDOC.createElement('div');
        av.style.cssText='width:'+size+'px;height:'+size+'px;border-radius:50%;flex-shrink:0;overflow:hidden;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:'+(size*0.38)+'px;color:#fff;';
        if(avatarUrl){
          av.style.backgroundImage='url('+avatarUrl+')';
          av.style.backgroundSize='cover';av.style.backgroundPosition='center';
          av.style.backgroundRepeat='no-repeat';
        } else {
          /* iOS 顺色头像：扁平毛玻璃，无凸起感 */
          av.style.background='linear-gradient(145deg,rgba(255,255,255,0.18) 0%,rgba(255,255,255,0.07) 100%)';
          av.style.backdropFilter='blur(16px)';
          av.style.webkitBackdropFilter='blur(16px)';
          av.style.color='rgba(255,255,255,0.82)';
          av.style.letterSpacing='-0.5px';
          av.textContent=(name||'?').charAt(0).toUpperCase();
        }
        return av;
      }

      function _pgContacts(){
        var pg=_div('pppg ppsl');pg.appendChild(_navbar('通讯录','home'));
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:4px 0 24px;';

        // 打开页面自动静默同步一次，加标记避免死循环
        if(!_ui._charsSyncedOnce){
          _ui._charsSyncedOnce=true;
          setTimeout(function(){
            _pullSTAllChars(true);
          }, 100);
        }

        /* 顶部全量同步 */
        var syncCard=_div('ppcard');
        var syncRow=_div('pprow tap');syncRow.style.padding='10px 14px';syncRow.style.gap='10px';
        syncRow.appendChild(_div('ppic',_svg('<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>')));
        syncRow.appendChild(_div('pprb','<div class="pprt">从酒馆同步全部联系人</div><div class="pprs">拉取所有角色卡</div>'));
        syncRow.appendChild(_div('ppchev','›'));
        syncRow.addEventListener('click',function(){_pullSTAllChars();});
        syncCard.appendChild(syncRow);body.appendChild(syncCard);

        /* 我的信息 */
        body.appendChild(_div('ppsec','我的信息'));
        var uCard=_div('ppcard');
        var uRow=_div('pprow tap');uRow.style.padding='10px 14px';uRow.style.gap='12px';
        var uName='未设置';
        if(_sbS.user && _sbS.user.personaList){
          var curP = _sbS.user.personaList.find(p => p.id === _sbS.user.currentAvatarId) || _sbS.user.personaList[0];
          if(curP) uName = curP.name;
        }
        uRow.appendChild(_mkAvatar(uName,_sbS.user&&_sbS.user.avatar,40));
        var uRb=_div('pprb');uRb.innerHTML='<div class="pprt">'+uName+'</div><div class="pprs">我的名片</div>';
        uRow.appendChild(uRb);uRow.appendChild(_div('ppchev','›'));
        uRow.addEventListener('click',function(){_go('contact-detail',{isUser:true});});
        uCard.appendChild(uRow);body.appendChild(uCard);

        /* 操作入口：添加联系人 + 新建联系人 */
        var opCard=_div('ppcard');
        /* 添加联系人（从已有角色添加好友） */
        var addExistRow=_div('pprow tap');addExistRow.style.padding='10px 14px';addExistRow.style.gap='10px';
        addExistRow.appendChild(_div('ppic',_svg('<path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>')));
        var notFriendCount=(_sbS.characters||[]).filter(function(c){return !c.isFriend;}).length;
        addExistRow.appendChild(_div('pprb','<div class="pprt">添加联系人</div><div class="pprs">'+(notFriendCount?notFriendCount+' 个待添加':'暂无待添加')+'</div>'));
        addExistRow.appendChild(_div('ppchev','›'));
        addExistRow.addEventListener('click',function(){_go('contact-add');});
        opCard.appendChild(addExistRow);
        var sepOp=_div('');sepOp.style.cssText='height:.5px;background:rgba(255,255,255,.055);margin:0 14px;';opCard.appendChild(sepOp);
        /* 新建联系人（手动创建） */
        var addNewRow=_div('pprow tap');addNewRow.style.padding='10px 14px';addNewRow.style.gap='10px';
        addNewRow.appendChild(_div('ppic',_svg('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>')));
        addNewRow.appendChild(_div('pprb','<div class="pprt">新建联系人</div><div class="pprs">手动创建新角色</div>'));
        addNewRow.appendChild(_div('ppchev','›'));
        addNewRow.addEventListener('click',function(){_go('contact-new');});
        opCard.appendChild(addNewRow);
        body.appendChild(opCard);

        /* 已添加好友，按首字母分组 */
        var allChars=_sbS.characters||[];
        var friendChars=allChars.filter(function(c){return c.isFriend;});
        var groups={};
        friendChars.forEach(function(ch){
          var g=_firstLetter(ch.name);
          if(!groups[g])groups[g]=[];
          groups[g].push(ch);
        });
        var groupKeys=Object.keys(groups).sort();
        body.appendChild(_div('ppsec','我的联系人（'+friendChars.length+'）'));
        if(!friendChars.length){
          var empty=_div('ppcard');
          var er=_div('pprow');er.style.padding='20px 14px';er.style.cursor='default';
          er.innerHTML='<span style="font-size:13px;color:rgba(255,255,255,.28);width:100%;text-align:center;">暂无联系人，点击上方添加</span>';
          empty.appendChild(er);body.appendChild(empty);
        }
        groupKeys.forEach(function(g){
          body.appendChild(_div('ppsec',g));
          var gCard=_div('ppcard');
          groups[g].forEach(function(ch,gi){
            if(gi>0){var sep=_div('');sep.style.cssText='height:.5px;background:rgba(255,255,255,.055);margin:0 14px;';gCard.appendChild(sep);}
            var row=_div('pprow tap');row.style.padding='10px 14px';row.style.gap='12px';
            row.appendChild(_mkAvatar(ch.name,ch.avatar,40));
            var rb=_div('pprb');rb.innerHTML='<div class="pprt">'+(ch.name||'未命名')+'</div>'+(_sbS.ttsEnabled&&ch.ttsEnabled?'<div class="pprs">TTS 已启用</div>':'');
            row.appendChild(rb);row.appendChild(_div('ppchev','›'));
            row.addEventListener('click',(function(id){return function(){_go('contact-detail',{isUser:false,charId:id});};})(ch.id));
            gCard.appendChild(row);
          });
          body.appendChild(gCard);
        });

        pg.appendChild(body);scr.appendChild(pg);
      }

      function _pgContactDetail(){
        var isUser=_nav.data&&_nav.data.isUser;
        var charId=_nav.data&&_nav.data.charId;
        var char=null;
        if(!isUser){
          char=(_sbS.characters||[]).filter(function(c){return c.id===charId;})[0];
          if(!char){_go('contacts');return;}
        }
        // 打开我的信息页时，如果persona还没拉到，先拉一遍，拉完自动重渲染
        if(isUser && (!_sbS.user || !_sbS.user.personaList || !_sbS.user.personaList.length)){
          _pullSTUser(true);
        }
        var title=isUser?'我的信息':(char.name||'联系人');
        var pg=_div('pppg ppsl');pg.appendChild(_navbar(title,'contacts'));
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:4px 0 32px;';

        /* ── Avatar header ── */
        var avHdr=_div('');avHdr.style.cssText='display:flex;flex-direction:column;align-items:center;padding:20px 0 16px;gap:10px;';
        var curPersona = null;
        if(isUser){
          if(!_sbS.user) _sbS.user = {};
          if(!_sbS.user.personaList)_sbS.user.personaList=[];
          curPersona = _sbS.user.personaList.find(p => p.id === _sbS.user.currentAvatarId) 
                    || _sbS.user.personaList[0] 
                    || {id:'default', name:'用户', persona:''};
        }
        var curName=isUser?((curPersona&&curPersona.name)||'用户'):(char.name||'?');
        var curAv=isUser?(_sbS.user&&_sbS.user.avatar):(char.avatar);
        var bigAv=_mkAvatar(curName,curAv,72);bigAv.style.cursor='pointer';
        bigAv.title='点击更换头像';
        var avFile=TOPDOC.createElement('input');avFile.type='file';avFile.accept='image/*';avFile.style.display='none';
        avFile.addEventListener('change',function(){
          var f=this.files&&this.files[0];if(!f)return;
          var r=new TOP.FileReader();
          r.onload=function(e){
            if(isUser){if(!_sbS.user)_sbS.user={};_sbS.user.avatar=e.target.result;}
            else{char.avatar=e.target.result;}
            _W();_go('contact-detail',_nav.data);
          };r.readAsDataURL(f);
        });
        bigAv.addEventListener('click',function(e){e.stopPropagation();avFile.click();});
        var avHint=_div('');avHint.style.cssText='font-size:11px;color:rgba(255,255,255,.28);';avHint.textContent='点击头像更换图片';
        avHdr.appendChild(bigAv);avHdr.appendChild(avHint);avHdr.appendChild(avFile);
        body.appendChild(avHdr);

        /* ── Info fields ── */
        body.appendChild(_div('ppsec','基本信息'));
        var infoCard=_div('ppcard');

        function _fieldRow2(label,valGet,valSet,type){
          var row=_div('pprow');row.style.flexDirection='column';row.style.alignItems='stretch';row.style.padding='12px 14px';row.style.gap='5px';row.style.cursor='default';
          var lbl=_div('');lbl.style.cssText='font-size:11px;color:rgba(255,255,255,.35);font-weight:500;';lbl.textContent=label;
          if(type==='textarea'){
            var ta=TOPDOC.createElement('textarea');ta.className='ppfi';ta.rows=4;ta.value=valGet()||'';ta.placeholder='点击输入…';
            ta.style.resize='none';ta.style.lineHeight='1.5';
            ta.addEventListener('mousedown',function(e){e.stopPropagation();});
            ta.addEventListener('change',function(){valSet(this.value);_W();});
            row.appendChild(lbl);row.appendChild(ta);
          } else {
            var inp=TOPDOC.createElement('input');inp.className='ppfi';inp.type=type||'text';inp.value=valGet()||'';inp.placeholder='点击输入…';
            inp.addEventListener('mousedown',function(e){e.stopPropagation();});
            inp.addEventListener('change',function(){valSet(this.value.trim());_W();});
            row.appendChild(lbl);row.appendChild(inp);
          }
          return row;
        }

        if(isUser){
          infoCard.appendChild(_fieldRow2('名字',function(){return curPersona.name;},function(v){curPersona.name=v;}));
          var sep0=_div('');sep0.style.cssText='height:.5px;background:rgba(255,255,255,.055);margin:0 14px;';infoCard.appendChild(sep0);
          infoCard.appendChild(_fieldRow2('用户人设',function(){return curPersona.persona;},function(v){curPersona.persona=v;},'textarea'));
        } else {
          infoCard.appendChild(_fieldRow2('角色名字',function(){return char.name;},function(v){char.name=v;}));
          var sep1=_div('');sep1.style.cssText='height:.5px;background:rgba(255,255,255,.055);margin:0 14px;';infoCard.appendChild(sep1);
          infoCard.appendChild(_fieldRow2('角色人设',function(){return char.persona;},function(v){char.persona=v;},'textarea'));
        }
        body.appendChild(infoCard);

        /* 用户 persona 列表（单选），唯一选中状态是currentAvatarId */
        if(isUser){
          body.appendChild(_div('ppsec','我的设定（选择当前使用的名片）'));
          var pCard=_div('ppcard');
          var personaList = _sbS.user.personaList || [];
          personaList.forEach(function(p, idx){
            if(idx>0){var ps=_div('');ps.style.cssText='height:.5px;background:rgba(255,255,255,.055);margin:0 14px;';pCard.appendChild(ps);}
            var pr=_div('pprow tap');pr.style.padding='10px 14px';pr.style.gap='10px';
            var rb=_div('pprb');rb.innerHTML='<div class="pprt">'+p.name+'</div>';
            pr.appendChild(rb);
            var isCur = p.id === _sbS.user.currentAvatarId;
            var check=_div('');check.style.cssText='width:20px;height:20px;border-radius:50%;border:1.5px solid '+(isCur?'rgba(255,120,170,.9)':'rgba(255,255,255,.2)')+';display:flex;align-items:center;justify-content:center;';
            if(isCur)check.innerHTML='<div style="width:10px;height:10px;border-radius:50%;background:rgba(255,120,170,.9);"></div>';
            pr.appendChild(check);
            pr.addEventListener('click', function(e){
              e.stopPropagation();
              if(p.id === _sbS.user.currentAvatarId) return;
              
              // 1. 本地先局部更新UI，无过场动画
              _sbS.user.currentAvatarId = p.id;
              _sbS.user.avatar = '/thumbnail?type=persona&file=' + encodeURIComponent(p.id);
              curPersona = p;
              // 更新上面输入框
              var inputs = infoCard.querySelectorAll('input, textarea');
              if(inputs.length >= 2){
                inputs[0].value = p.name;
                inputs[1].value = p.persona;
              }
              // 更新下面选中圆圈
              pCard.querySelectorAll('.pprow').forEach(function(row, rowIdx){
                var circle = row.lastElementChild;
                if(personaList[rowIdx].id === p.id){
                  circle.style.borderColor = 'rgba(255,120,170,.9)';
                  circle.innerHTML = '<div style="width:10px;height:10px;border-radius:50%;background:rgba(255,120,170,.9);"></div>';
                }else{
                  circle.style.borderColor = 'rgba(255,255,255,.2)';
                  circle.innerHTML = '';
                }
              });
              
              // 2. 调用酒馆官方setUserAvatar函数，完整切换人设
              if(_sbS.user._setUserAvatar){
                _sbS.user._setUserAvatar(p.id);
              }
            });
            pCard.appendChild(pr);
          });
          body.appendChild(pCard);
        }

        /* ── TTS (角色only) ── */
        if(!isUser && _sbS.ttsEnabled){
          body.appendChild(_div('ppsec','语音合成 TTS'));
          var ttsCard=_div('ppcard');
          var ttsTogRow=_div('pprow');ttsTogRow.style.padding='12px 14px';ttsTogRow.style.cursor='default';
          ttsTogRow.appendChild(_div('pprb','<div class="pprt">启用 TTS</div>'));
          ttsTogRow.appendChild(_tog(char.ttsEnabled,function(v){char.ttsEnabled=v;_W();if(TOP._pprefresh)TOP._pprefresh();}));
          ttsCard.appendChild(ttsTogRow);
          if(char.ttsEnabled){
            var _chProv=char.ttsProvider||'';
            var _fishMode=_chProv==='fishaudio';
            /* ── 引擎选择行 ── */
            var _sep0=_div('');_sep0.style.cssText='height:.5px;background:rgba(255,255,255,.055);margin:0 14px;';ttsCard.appendChild(_sep0);
            var engRow=_div('pprow');engRow.style.padding='12px 14px';engRow.style.cursor='default';
            engRow.appendChild(_div('pprb','<div class="pprt" style="font-size:14px;">TTS 引擎</div><div class="pprs">留空=跟随全局设置</div>'));
            var engSel=TOPDOC.createElement('select');
            engSel.className='ppfi';engSel.style.cssText='max-width:150px;font-size:13px;';
            [['','跟随全局'],['minimax','MiniMax'],['fishaudio','Fish Audio']].forEach(function(o){
              var opt=TOPDOC.createElement('option');opt.value=o[0];opt.textContent=o[1];
              if((char.ttsProvider||'')===o[0])opt.selected=true;
              engSel.appendChild(opt);
            });
            engSel.addEventListener('mousedown',function(e){e.stopPropagation();});
            engSel.addEventListener('change',function(){char.ttsProvider=this.value;_W();if(TOP._pprefresh)TOP._pprefresh();});
            engRow.appendChild(engSel);ttsCard.appendChild(engRow);
            /* ── Fish Voice ID 行（fishaudio 时显示） ── */
            if(_fishMode){
              var _sepF=_div('');_sepF.style.cssText='height:.5px;background:rgba(255,255,255,.055);margin:0 14px;';ttsCard.appendChild(_sepF);
              var fishVidRow=_div('pprow');fishVidRow.style.flexDirection='column';fishVidRow.style.alignItems='stretch';fishVidRow.style.padding='12px 14px';fishVidRow.style.gap='6px';fishVidRow.style.cursor='default';
              fishVidRow.appendChild(_div('','<span style="font-size:11px;color:rgba(255,255,255,.35);font-weight:500;">Fish Voice ID（参考音色 ID，可选）</span>'));
              var fishVidInp=TOPDOC.createElement('input');fishVidInp.className='ppfi';fishVidInp.type='text';
              fishVidInp.placeholder='输入 Fish Audio 音色 ID';
              fishVidInp.value=char.fishVoiceId||'';
              fishVidInp.addEventListener('mousedown',function(e){e.stopPropagation();});
              fishVidInp.addEventListener('change',function(){char.fishVoiceId=this.value.trim();_W();});
              fishVidRow.appendChild(fishVidInp);ttsCard.appendChild(fishVidRow);
            }
            /* ── 朗读语言行 ── */
            var _sepL=_div('');_sepL.style.cssText='height:.5px;background:rgba(255,255,255,.055);margin:0 14px;';ttsCard.appendChild(_sepL);
            var langRow=_div('pprow');langRow.style.padding='12px 14px';langRow.style.cursor='default';
            langRow.appendChild(_div('pprb','<div class="pprt" style="font-size:14px;">朗读语言</div><div class="pprs">日文=字幕中文、念日文</div>'));
            var langSel=TOPDOC.createElement('select');
            langSel.className='ppfi';langSel.style.cssText='max-width:150px;font-size:13px;';
            [['','跟随文本'],['zh','中文'],['ja','日文'],['en','英文']].forEach(function(o){
              var opt=TOPDOC.createElement('option');opt.value=o[0];opt.textContent=o[1];
              if((char.ttsSpeakLang||'')===o[0])opt.selected=true;
              langSel.appendChild(opt);
            });
            langSel.addEventListener('mousedown',function(e){e.stopPropagation();});
            langSel.addEventListener('change',function(){char.ttsSpeakLang=this.value;_W();if(TOP._pprefresh)TOP._pprefresh();});
            langRow.appendChild(langSel);ttsCard.appendChild(langRow);
            if(!_fishMode){
            /* MiniMax 预置音色 */
            var MM_VOICES=[
              {v:'female-shaonv',       l:'少女 female-shaonv'},
              {v:'female-yujie',        l:'御姐 female-yujie'},
              {v:'female-chengshu',     l:'成熟女声 female-chengshu'},
              {v:'female-tianmei',      l:'甜美 female-tianmei'},
              {v:'male-qn-qingse',      l:'青涩青年 male-qn-qingse'},
              {v:'male-qn-jingying',    l:'精英青年 male-qn-jingying'},
              {v:'male-qn-badao',       l:'霸道青年 male-qn-badao'},
              {v:'male-qn-daxuesheng',  l:'大学生 male-qn-daxuesheng'},
              {v:'presenter_male',      l:'男主播 presenter_male'},
              {v:'presenter_female',    l:'女主播 presenter_female'},
              {v:'audiobook_male_1',    l:'有声书男1 audiobook_male_1'},
              {v:'audiobook_male_2',    l:'有声书男2 audiobook_male_2'},
              {v:'audiobook_female_1',  l:'有声书女1 audiobook_female_1'},
              {v:'audiobook_female_2',  l:'有声书女2 audiobook_female_2'},
              {v:'clever_boy',          l:'聪明男孩 clever_boy'},
              {v:'cute_boy',            l:'可爱男孩 cute_boy'},
              {v:'lovely_girl',         l:'可爱女孩 lovely_girl'},
              {v:'cartoon_pig',         l:'卡通小猪 cartoon_pig'},
              {v:'bingjiao_didi',       l:'病娇弟弟 bingjiao_didi'},
              {v:'sweet_girl',          l:'甜美女声2 sweet_girl'},
              {v:'male-qn-qingse-jingpin',   l:'青涩青年·精品'},
              {v:'male-qn-jingying-jingpin', l:'精英青年·精品'},
              {v:'female-shaonv-jingpin',    l:'少女·精品'},
              {v:'female-yujie-jingpin',     l:'御姐·精品'},
              {v:'custom',              l:'自定义 Voice ID…'}
            ];
            /* ── Voice ID 行 ── */
            var _sep1=_div('');_sep1.style.cssText='height:.5px;background:rgba(255,255,255,.055);margin:0 14px;';ttsCard.appendChild(_sep1);
            var vidRow=_div('pprow');vidRow.style.flexDirection='column';vidRow.style.alignItems='stretch';vidRow.style.padding='12px 14px';vidRow.style.gap='6px';vidRow.style.cursor='default';
            vidRow.appendChild(_div('','<span style="font-size:11px;color:rgba(255,255,255,.35);font-weight:500;">音色 Voice ID</span>'));
            var vidSel=TOPDOC.createElement('select');
            vidSel.className='ppfi';vidSel.style.fontSize='13px';
            var curVid=char.ttsVoiceId||'female-shaonv';
            var hasCustom=!MM_VOICES.slice(0,-1).some(function(o){return o.v===curVid;});
            MM_VOICES.forEach(function(o){
              var opt=TOPDOC.createElement('option');opt.value=o.v;opt.textContent=o.l;
              if((hasCustom&&o.v==='custom')||(!hasCustom&&o.v===curVid))opt.selected=true;
              vidSel.appendChild(opt);
            });
            /* 自定义输入框（仅 custom 时显示） */
            var customInp=TOPDOC.createElement('input');customInp.className='ppfi';customInp.type='text';
            customInp.placeholder='输入自定义 Voice ID';
            customInp.value=hasCustom?curVid:'';
            customInp.style.display=hasCustom?'block':'none';
            customInp.addEventListener('mousedown',function(e){e.stopPropagation();});
            customInp.addEventListener('change',function(){char.ttsVoiceId=this.value.trim();_W();});
            vidSel.addEventListener('mousedown',function(e){e.stopPropagation();});
            vidSel.addEventListener('change',function(){
              if(this.value==='custom'){customInp.style.display='block';customInp.focus();}
              else{customInp.style.display='none';char.ttsVoiceId=this.value;_W();}
            });
            vidRow.appendChild(vidSel);vidRow.appendChild(customInp);
            ttsCard.appendChild(vidRow);
            /* ── 语言 行 ── */
            var _sep2=_div('');_sep2.style.cssText='height:.5px;background:rgba(255,255,255,.055);margin:0 14px;';ttsCard.appendChild(_sep2);
            var langRow=_div('pprow');langRow.style.padding='12px 14px';langRow.style.cursor='default';
            langRow.appendChild(_div('pprb','<div class="pprt" style="font-size:14px;">语言</div><div class="pprs">影响发音和语调</div>'));
            var langSel=TOPDOC.createElement('select');
            langSel.style.cssText='padding:6px 10px;background:rgba(255,255,255,.08);border:.5px solid rgba(255,255,255,.12);border-radius:9px;color:rgba(255,255,255,.8);font-size:12px;font-family:inherit;outline:none;-webkit-appearance:none;max-width:140px;';
            [
              {v:'',     l:'自动检测'},
              {v:'zh',   l:'中文'},
              {v:'en',   l:'英语'},
              {v:'ja',   l:'日语'},
              {v:'zh,en',l:'中英混合'},
              {v:'zh,ja',l:'中日混合'}
            ].forEach(function(o){
              var opt=TOPDOC.createElement('option');opt.value=o.v;opt.textContent=o.l;
              if((char.ttsLanguage||'')===o.v)opt.selected=true;
              langSel.appendChild(opt);
            });
            langSel.addEventListener('mousedown',function(e){e.stopPropagation();});
            langSel.addEventListener('change',function(){char.ttsLanguage=this.value;_W();});
            langRow.appendChild(langSel);ttsCard.appendChild(langRow);
            }
            /* ── 语速 行 ── */
            var _sep3=_div('');_sep3.style.cssText='height:.5px;background:rgba(255,255,255,.055);margin:0 14px;';ttsCard.appendChild(_sep3);
            var speedRow=_div('pprow');speedRow.style.padding='12px 14px';speedRow.style.cursor='default';
            speedRow.appendChild(_div('pprb','<div class="pprt" style="font-size:14px;">语速</div><div class="pprs">0.5（慢）~ 2.0（快），默认 1.0</div>'));
            var speedWrap=_div('');speedWrap.style.cssText='display:flex;align-items:center;gap:6px;flex-shrink:0;';
            var speedInp=TOPDOC.createElement('input');speedInp.type='number';speedInp.min='0.5';speedInp.max='2.0';speedInp.step='0.1';
            speedInp.value=parseFloat(char.ttsSpeed)||1.0;
            speedInp.style.cssText='width:60px;padding:5px 8px;background:rgba(255,255,255,.08);border:.5px solid rgba(255,255,255,.12);border-radius:8px;color:rgba(255,255,255,.8);font-size:13px;text-align:center;font-family:inherit;outline:none;';
            speedInp.addEventListener('mousedown',function(e){e.stopPropagation();});
            speedInp.addEventListener('change',function(){char.ttsSpeed=Math.max(0.5,Math.min(2.0,parseFloat(this.value)||1.0));_W();});
            speedWrap.appendChild(speedInp);
            speedWrap.appendChild(_div('','<span style="font-size:12px;color:rgba(255,255,255,.35);">x</span>'));
            speedRow.appendChild(speedWrap);ttsCard.appendChild(speedRow);
          }
          body.appendChild(ttsCard);
        }

        /* ── 世界书绑定 (角色only) ── */
        if(!isUser){
          var wbEntries=_sbS.wbEntries||[];
          if(wbEntries.length){
            body.appendChild(_div('ppsec','绑定世界书'));
            var wbCard=_div('ppcard');
            if(!char.wbIds)char.wbIds=[];
            wbEntries.forEach(function(e,ei){
              if(ei>0){var s=_div('');s.style.cssText='height:.5px;background:rgba(255,255,255,.055);margin:0 14px;';wbCard.appendChild(s);}
              var wbRow=_div('pprow');wbRow.style.padding='11px 14px';wbRow.style.cursor='default';
              var wbLbl=_div('pprb');
              var nm=_div('pprt');nm.style.fontSize='14px';nm.textContent=e.name||(e._stWbName||'条目');
              var hint=_div('pprs');hint.style.fontSize='10px';hint.textContent=e._stWbName?('来自: '+e._stWbName):'手动条目';
              wbLbl.appendChild(nm);wbLbl.appendChild(hint);wbRow.appendChild(wbLbl);
              var isOn=char.wbIds.indexOf(e.id)>=0;
              var tog=_tog(isOn,function(eId){return function(v){
                if(v){if(char.wbIds.indexOf(eId)<0)char.wbIds.push(eId);}
                else{char.wbIds=char.wbIds.filter(function(x){return x!==eId;});}
                _W();
              };}(e.id));
              wbRow.appendChild(tog);wbCard.appendChild(wbRow);
            });
            body.appendChild(wbCard);
          }
        }

        /* ── 从我的列表移除（角色only，不删卡） ── */
        if(!isUser){
          body.appendChild(_div('ppsec',''));
          var dangerCard=_div('ppcard');
          var delRow=_div('pprow tap');delRow.style.padding='12px 14px';
          delRow.appendChild(_div('ppic','<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1.8" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>'));
          delRow.appendChild(_div('pprb','<div class="pprt" style="color:rgba(255,255,255,.85)">从我的列表移除</div><div class="pprs" style="font-size:11px;">不会删除角色卡，可在添加联系人里重新加回</div>'));
          delRow.addEventListener('click',function(e){
            e.stopPropagation();
            char.isFriend=false;
            _W();_go('contacts');
          });
          dangerCard.appendChild(delRow);body.appendChild(dangerCard);
        }

        pg.appendChild(body);scr.appendChild(pg);
      }

      /* ── 新建联系人 ── */
      function _pgContactNew(){
        var pg=_div('pppg ppsl');pg.appendChild(_navbar('新建联系人','contacts'));
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:4px 0 32px;';

        /* 头像 */
        var avBox=_div('');avBox.style.cssText='display:flex;flex-direction:column;align-items:center;padding:20px 0 16px;gap:8px;';
        var prevAv=_mkAvatar('新','',72);prevAv.style.cursor='pointer';
        var avHint=_div('');avHint.style.cssText='font-size:11px;color:rgba(255,255,255,.28);';avHint.textContent='点击上传头像';
        var avFile=TOPDOC.createElement('input');avFile.type='file';avFile.accept='image/*';avFile.style.display='none';
        var newAv='';
        avFile.addEventListener('change',function(){
          var f=this.files&&this.files[0];if(!f)return;
          var r=new TOP.FileReader();
          r.onload=function(e){
            newAv=e.target.result;
            var av=_mkAvatar('新',newAv,72);
            avBox.replaceChild(av,prevAv);prevAv=av;prevAv.style.cursor='pointer';
            prevAv.addEventListener('click',function(e){e.stopPropagation();avFile.click();});
          };
          r.readAsDataURL(f);
        });
        prevAv.addEventListener('click',function(e){e.stopPropagation();avFile.click();});
        avBox.appendChild(prevAv);avBox.appendChild(avHint);avBox.appendChild(avFile);
        body.appendChild(avBox);

        /* 表单 */
        body.appendChild(_div('ppsec','基本信息'));
        var formCard=_div('ppcard');
        var nameRow=_div('pprow');nameRow.style.flexDirection='column';nameRow.style.alignItems='stretch';nameRow.style.padding='12px 14px';nameRow.style.gap='5px';nameRow.style.cursor='default';
        var nameLbl=_div('');nameLbl.style.cssText='font-size:11px;color:rgba(255,255,255,.35);font-weight:500;';nameLbl.textContent='角色名字';
        var nameIn=TOPDOC.createElement('input');nameIn.className='ppfi';nameIn.type='text';nameIn.placeholder='输入名字…';
        nameIn.addEventListener('mousedown',function(e){e.stopPropagation();});
        nameRow.appendChild(nameLbl);nameRow.appendChild(nameIn);formCard.appendChild(nameRow);

        var sepN=_div('');sepN.style.cssText='height:.5px;background:rgba(255,255,255,.055);margin:0 14px;';formCard.appendChild(sepN);
        var pRow=_div('pprow');pRow.style.flexDirection='column';pRow.style.alignItems='stretch';pRow.style.padding='12px 14px';pRow.style.gap='5px';pRow.style.cursor='default';
        var pLbl=_div('');pLbl.style.cssText='font-size:11px;color:rgba(255,255,255,.35);font-weight:500;';pLbl.textContent='角色人设';
        var pIn=TOPDOC.createElement('textarea');pIn.className='ppfi';pIn.rows=5;pIn.placeholder='输入人设、简介…';
        pIn.style.resize='none';pIn.style.lineHeight='1.5';
        pIn.addEventListener('mousedown',function(e){e.stopPropagation();});
        pRow.appendChild(pLbl);pRow.appendChild(pIn);formCard.appendChild(pRow);
        body.appendChild(formCard);

        /* 保存按钮 */
        var saveCard=_div('ppcard');
        saveCard.style.background='transparent';saveCard.style.boxShadow='none';
        var saveWrap=_div('');saveWrap.style.cssText='display:flex;justify-content:center;padding:4px 0;';
        var saveRow=_div('ppbtn','保存联系人');
        saveRow.style.padding='10px 32px';
        saveRow.addEventListener('click',function(){
          var nm=nameIn.value.trim();if(!nm){_toast('请输入名字');return;}
          var nc={id:_uuid(),name:nm,persona:pIn.value.trim(),avatar:newAv,ttsEnabled:false,ttsVoiceId:'',ttsLanguage:'zh-CN',ttsSpeed:1.0,ttsSpeakLang:''};
          if(!_sbS.characters)_sbS.characters=[];
          _sbS.characters.push(nc);
          /* 同步创建到酒馆角色卡（json 注入，走 ST 官方 /api/characters/create） */
          _createSTCharacter(nc, function(avatarKey){
            // 记录酒馆侧唯一键（角色头像文件名），避免下次拉取角色卡时重复出现
            var key=(avatarKey&&avatarKey!=='none'&&avatarKey!=='')?avatarKey:nc.name;
            nc._stUniqueKey=key;
            // 头像改用酒馆 URL（小体积），避免 base64 大头像撑爆 localStorage 配额导致落盘失败
            if(avatarKey&&avatarKey!=='none'&&avatarKey!==''){nc.avatar='/characters/'+encodeURI(avatarKey);}
            else{nc.avatar='';}
            _W();
            /* 头像从 base64 换成酒馆 URL，重绘当前详情页让大头像立即更新 */
            if(TOP._pprender)TOP._pprender(); else try{_refreshNoAnim();}catch(e){}
            _toast('✓ 已同步创建酒馆角色卡「'+nm+'」');
          }, function(err){
            // 酒馆创建失败：本地联系人仍保留，头像清掉避免 quota 写入失败导致刷新后丢失
            nc.avatar='';
            nc._stUniqueKey=nm;
            _W();
            _toast('✗ 酒馆角色卡创建失败：'+(err&&err.message||err));
          });
          if(TOP._pprender)TOP._pprender();
          _go('contact-detail',{isUser:false,charId:nc.id});
        });
        saveWrap.appendChild(saveRow);saveCard.appendChild(saveWrap);body.appendChild(saveCard);

        pg.appendChild(body);scr.appendChild(pg);
      }

      /* ── 添加联系人子页面 ── */
      function _pgContactAdd(){
        var pg=_div('pppg ppsl');pg.appendChild(_navbar('添加联系人','contacts'));
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:4px 0 24px;';

        var allChars=_sbS.characters||[];
        /* 当前筛选分组，'all' 表示全部 */
        var filterGroup='all';
        if(!_ui.contactAddFilter)_ui.contactAddFilter='all';
        filterGroup=_ui.contactAddFilter;

        /* 收集所有角色分组名 */
        var groupNames=[];
        allChars.forEach(function(c){
          var gn=c.group||'未分组';
          if(groupNames.indexOf(gn)<0)groupNames.push(gn);
        });
        groupNames.sort();

        /* 顶部筛选标签栏 */
        var filterBar=_div('');filterBar.style.cssText='display:flex;flex-wrap:wrap;gap:8px;padding:12px 16px;flex-shrink:0;';
        function _mkFilterPill(label,val){
          var pill=_div('pprow tap');pill.style.cssText='padding:6px 16px;min-height:32px;border-radius:16px;font-size:13px;white-space:nowrap;flex-shrink:0;transition:all .2s;'
            +(filterGroup===val?'background:rgba(255,126,179,.9);color:#fff;font-weight:500;':'background:rgba(255,255,255,.08);color:rgba(255,255,255,.65);');
          pill.textContent=label;
          pill.addEventListener('click',function(){
            _ui.contactAddFilter=val;_drawAdd();
          });
          return pill;
        }
        filterBar.appendChild(_mkFilterPill('全部','all'));
        groupNames.forEach(function(gn){filterBar.appendChild(_mkFilterPill(gn,gn));});
        body.appendChild(filterBar);

        /* 统计 + 全部添加 */
        var topCard=_div('ppcard');
        var topRow=_div('pprow');topRow.style.padding='10px 14px';topRow.style.gap='8px';
        var topRb=_div('pprb');
        var availCount=allChars.filter(function(c){return !c.isFriend;}).length;
        topRb.innerHTML='<div class="pprt">待添加（'+availCount+'）</div><div class="pprs">开关单个添加，或整组添加</div>';
        topRow.appendChild(topRb);
        var addAllBtn=TOPDOC.createElement('button');addAllBtn.textContent='全部添加';
        addAllBtn.style.cssText='background:rgba(255,120,170,.8);color:#fff;border:none;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:600;cursor:pointer;flex-shrink:0;';
        addAllBtn.addEventListener('click',function(e){
          e.stopPropagation();
          var toAdd=allChars.filter(function(c){
            if(c.isFriend)return false;
            if(filterGroup!=='all'&&(c.group||'未分组')!==filterGroup)return false;
            return true;
          });
          toAdd.forEach(function(c){c.isFriend=true;});
          _W();_drawAdd();
        });
        topRow.appendChild(addAllBtn);
        topCard.appendChild(topRow);body.appendChild(topCard);

        function _drawAdd(){
          /* 重新渲染整个页面（保留筛选状态） */
          var savedFilter=_ui.contactAddFilter;
          while(body.firstChild)body.removeChild(body.firstChild);
          /* 重新加筛选栏 */
          var fb2=_div('');fb2.style.cssText='display:flex;flex-wrap:wrap;gap:8px;padding:12px 16px;flex-shrink:0;';
          function _mp2(label,val){
            var p=_div('pprow tap');p.style.cssText='padding:6px 16px;min-height:32px;border-radius:16px;font-size:13px;white-space:nowrap;flex-shrink:0;transition:all .2s;'
              +(savedFilter===val?'background:rgba(255,126,179,.9);color:#fff;font-weight:500;':'background:rgba(255,255,255,.08);color:rgba(255,255,255,.65);');
            p.textContent=label;
            p.addEventListener('click',function(){_ui.contactAddFilter=val;_drawAdd();});
            return p;
          }
          fb2.appendChild(_mp2('全部','all'));
          groupNames.forEach(function(gn){fb2.appendChild(_mp2(gn,gn));});
          body.appendChild(fb2);

          /* 筛选待添加角色 */
          var av=allChars.filter(function(c){
            if(c.isFriend)return false;
            if(savedFilter!=='all'&&(c.group||'未分组')!==savedFilter)return false;
            return true;
          });
          /* 顶部统计 */
          var tc2=_div('ppcard');
          var tr2=_div('pprow');tr2.style.padding='10px 14px';tr2.style.gap='8px';
          var rb2=_div('pprb');rb2.innerHTML='<div class="pprt">待添加（'+av.length+'）</div><div class="pprs">开关单个添加，或整组添加</div>';
          tr2.appendChild(rb2);
          var ab2=TOPDOC.createElement('button');ab2.textContent=savedFilter==='all'?'全部添加':'添加当前筛选';
          ab2.style.cssText='background:rgba(255,120,170,.8);color:#fff;border:none;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:600;cursor:pointer;flex-shrink:0;';
          ab2.addEventListener('click',function(){av.forEach(function(c){c.isFriend=true;});_W();_drawAdd();});
          tr2.appendChild(ab2);
          tc2.appendChild(tr2);body.appendChild(tc2);

          if(!av.length){
            var done=_div('ppcard');
            var dr=_div('pprow');dr.style.padding='20px 14px';dr.style.cursor='default';
            dr.innerHTML='<span style="font-size:13px;color:rgba(255,255,255,.35);width:100%;text-align:center;">当前筛选下没有待添加角色</span>';
            done.appendChild(dr);body.appendChild(done);return;
          }

          /* 按角色分组（group字段）展示，每个分组带整组添加按钮 */
          var byGroup={},gOrder=[];
          av.forEach(function(ch){
            var gn=ch.group||'未分组';
            if(!byGroup[gn]){byGroup[gn]=[];gOrder.push(gn);}
            byGroup[gn].push(ch);
          });
          gOrder.sort();
          gOrder.forEach(function(gn){
            body.appendChild(_div('ppsec',gn+'（'+byGroup[gn].length+'）'));
            /* 分组操作行：整组添加 */
            var gOpCard=_div('ppcard');
            var gOpRow=_div('pprow tap');gOpRow.style.padding='8px 14px';gOpRow.style.gap='8px';
            var gOpRb=_div('pprb');gOpRb.innerHTML='<div class="pprt" style="font-size:12px;color:rgba(255,255,255,.75);">添加此分组全部角色</div>';
            gOpRow.appendChild(gOpRb);
            var gAddBtn=TOPDOC.createElement('button');gAddBtn.textContent='整组添加';
            gAddBtn.style.cssText='background:rgba(255,255,255,.14);color:#fff;border:.5px solid rgba(255,255,255,.25);border-radius:8px;padding:4px 10px;font-size:11px;cursor:pointer;flex-shrink:0;';
            gAddBtn.addEventListener('click',function(e){
              e.stopPropagation();
              byGroup[gn].forEach(function(c){c.isFriend=true;});
              _W();_drawAdd();
            });
            gOpRow.appendChild(gAddBtn);
            gOpCard.appendChild(gOpRow);body.appendChild(gOpCard);

            /* 角色卡片 */
            var card=_div('ppcard');
            byGroup[gn].forEach(function(ch,gi){
              if(gi>0){var sep=_div('');sep.style.cssText='height:.5px;background:rgba(255,255,255,.055);margin:0 14px;';card.appendChild(sep);}
              var row=_div('pprow');row.style.padding='10px 14px';row.style.gap='10px';
              row.appendChild(_mkAvatar(ch.name,ch.avatar,38));
              var rb=_div('pprb');rb.innerHTML='<div class="pprt" style="font-size:13px;">'+ch.name+'</div>';
              row.appendChild(rb);
              row.appendChild(_tog(false,function(v){ch.isFriend=v;_W();_drawAdd();}));
              card.appendChild(row);
            });
            body.appendChild(card);
          });
        }
        _drawAdd();

        pg.appendChild(body);scr.appendChild(pg);
      }

      /* ── 聊天列表 ── */
      function _pgChats(){
        var pg=_div('pppg ppsl');pg.appendChild(_navbar('聊天','home'));
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:4px 0 24px;';

        /* 只显示已添加为好友的角色 */
        var friends=(_sbS.characters||[]).filter(function(c){return c.isFriend;});
        if(!friends.length){
          var empty=_div('ppcard');
          var er=_div('pprow');er.style.padding='28px 14px';er.style.flexDirection='column';er.style.gap='6px';er.style.cursor='default';
          er.innerHTML='<div style="font-size:13px;color:rgba(255,255,255,.35);text-align:center;width:100%;">暂无聊天</div><div style="font-size:11px;color:rgba(255,255,255,.22);text-align:center;width:100%;">去通讯录添加好友开始聊天</div>';
          empty.appendChild(er);body.appendChild(empty);
        } else {
          body.appendChild(_div('ppsec','消息（'+friends.length+'）'));
          var card=_div('ppcard');
          friends.forEach(function(ch,fi){
            if(fi>0){var sep=_div('');sep.style.cssText='height:.5px;background:rgba(255,255,255,.055);margin:0 14px;';card.appendChild(sep);}
            var row=_div('pprow tap');row.style.padding='10px 14px';row.style.gap='12px';
            row.appendChild(_mkAvatar(ch.name,ch.avatar,42));
            var hist=_sbS.history&&_sbS.history[ch.id];
            var lastMsg='';
            if(hist&&hist.length){
              for(var hi=hist.length-1;hi>=0;hi--){if(hist[hi].type!=='status'&&hist[hi].text){lastMsg=hist[hi].text;break;}}
            }
            var rb=_div('pprb');rb.innerHTML='<div class="pprt">'+ch.name+'</div><div class="pprs">'+(lastMsg||'开始聊天吧')+'</div>';
            row.appendChild(rb);row.appendChild(_div('ppchev','›'));
            row.addEventListener('click',function(){_go('chat-detail',{charId:ch.id});});
            card.appendChild(row);
          });
          body.appendChild(card);
        }
        pg.appendChild(body);scr.appendChild(pg);
      }

      /* ── 酒馆 chats API 封装（小手机聊天与酒馆聊天存档打通） ── */
      var _ppSmCache=null;
      function _ppGetSm(cb){
        if(_ppSmCache){cb(_ppSmCache);return;}
        import('/script.js').then(function(sm){_ppSmCache=sm;cb(sm);}).catch(function(){cb(null);});
      }
      function _ppChatHdrs(cb){
        _ppGetSm(function(sm){
          try{cb(sm&&sm.getRequestHeaders?sm.getRequestHeaders():{});}catch(e){cb({});}
        });
      }
      /* 列出某角色所有聊天存档。cb(list)，list 项: {file_name, message_count, last_mes, preview_message} */
      function _ppListChats(avatarPng, cb){
        if(!avatarPng){cb([]);return;}
        _ppChatHdrs(function(hdrs){
          fetch('/api/chats/search',{method:'POST',headers:hdrs,cache:'no-cache',
            body:JSON.stringify({avatar_url:avatarPng,query:""})
          }).then(function(r){return r.json();}).then(function(list){
            cb(Array.isArray(list)?list:[]);
          }).catch(function(){cb([]);});
        });
      }
      /* 加载某角色某 chat（fileId 不带 .jsonl）。cb(arr)，arr 是酒馆消息数组（含 header） */
      function _ppLoadChat(avatarPng, fileId, cb){
        if(!avatarPng||!fileId){cb([]);return;}
        _ppChatHdrs(function(hdrs){
          fetch('/api/chats/get',{method:'POST',headers:hdrs,cache:'no-cache',
            body:JSON.stringify({avatar_url:avatarPng,file_name:fileId})
          }).then(function(r){return r.json();}).then(function(arr){
            cb(Array.isArray(arr)?arr:[]);
          }).catch(function(){cb([]);});
        });
      }
      /* 全量保存 chat。cb(ok:bool) */
      function _ppSaveChat(avatarPng, fileId, chatArr, cb){
        if(!avatarPng||!fileId){cb&&cb(false);return;}
        _ppChatHdrs(function(hdrs){
          fetch('/api/chats/save',{method:'POST',headers:hdrs,cache:'no-cache',
            body:JSON.stringify({avatar_url:avatarPng,file_name:fileId,chat:chatArr,force:true})
          }).then(function(r){cb&&cb(r.ok);}).catch(function(){cb&&cb(false);});
        });
      }
      /* 删除 chat。cb(ok:bool) */
      function _ppDeleteChat(avatarPng, fileId, cb){
        if(!avatarPng||!fileId){cb&&cb(false);return;}
        _ppChatHdrs(function(hdrs){
          fetch('/api/chats/delete',{method:'POST',headers:hdrs,cache:'no-cache',
            body:JSON.stringify({avatar_url:avatarPng,chatfile:fileId+'.jsonl'})
          }).then(function(r){cb&&cb(r.ok);}).catch(function(){cb&&cb(false);});
        });
      }
      /* 新建空 chat。cb(ok, fileId) */
      function _ppNewChat(avatarPng, charName, userName, cb){
        var d=new Date();
        function p(n){return String(n).padStart(2,'0');}
        var fileId=charName+' - '+d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+'.'+p(d.getMinutes());
        var header={chat_metadata:{},user_name:userName,character_name:charName};
        _ppSaveChat(avatarPng,fileId,[header],function(ok){cb(ok,fileId);});
      }

      /* 默认文风（全局）：用户没改时用这段 */
      var _PP_DEFAULT_STYLE='请用细腻自然的文风回复：多用动作、神态、环境描写来营造氛围，对话口语化、贴合角色性格，不要机械地报流水账；旁白要有画面感，推动剧情自然向前发展。';

      /* 取当前角色实际生效的文风（覆盖>全局>内置默认） */
      function _ppCharStyle(charId){
        var ov=(_sbS.chatStyleByChar||{})[charId];
        if(typeof ov==='string'&&ov.trim())return ov;
        var gl=_sbS.defaultChatStyle;
        if(typeof gl==='string'&&gl.trim())return gl;
        return _PP_DEFAULT_STYLE;
      }
      /* 取当前角色实际生效的保底字数 */
      function _ppCharMinLen(charId){
        var ov=(_sbS.chatMinLenByChar||{})[charId];
        if(typeof ov==='number'&&ov>0)return ov;
        var gl=_sbS.defaultChatMinLen;
        return (typeof gl==='number'&&gl>0)?gl:500;
      }

      /* 自定义确认弹窗（仿 iOS 样式，不用浏览器 confirm） */
      function _ppConfirmDlg(title,msg,onOk){
        var scr=TOP._ppscr;if(!scr)return;
        var mask=_div('');mask.style.cssText='position:absolute;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center;';
        var card=_div('');card.style.cssText='width:260px;background:rgba(40,40,48,.96);border-radius:14px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.5);';
        var hd=_div('');hd.style.cssText='padding:18px 16px 8px;text-align:center;font-size:15px;font-weight:700;color:rgba(255,255,255,.92);';hd.textContent=title;
        var bd=_div('');bd.style.cssText='padding:0 16px 16px;text-align:center;font-size:13px;line-height:1.5;color:rgba(255,255,255,.65);';bd.textContent=msg;
        card.appendChild(hd);card.appendChild(bd);
        var sep=_div('');sep.style.cssText='height:.5px;background:rgba(255,255,255,.12);';card.appendChild(sep);
        var row=_div('');row.style.cssText='display:flex;';
        function mkBtn(tx,color,cbr){
          var b=TOPDOC.createElement('div');b.textContent=tx;
          b.style.cssText='flex:1;padding:12px;text-align:center;font-size:15px;color:'+color+';cursor:pointer;border-right:.5px solid rgba(255,255,255,.12);';
          b.addEventListener('click',function(){mask.remove();cbr&&cbr();});
          return b;
        }
        row.appendChild(mkBtn('取消','rgba(255,255,255,.55)',function(){}));
        row.appendChild(mkBtn('确认','#ff5c8a',function(){onOk&&onOk();}));
        card.appendChild(row);
        mask.appendChild(card);
        scr.appendChild(mask);
      }

      /* ── 聊天详情页 ── */
      /* ── AI 输出解析器：把原始文本按标签解析成结构化消息 ── */
      function _parseAiOutput(rawText, charName){
        var msgs=[];
        var text=rawText||'';

        /* 1. 提取状态栏 <STATUS>...</STATUS> */
        var statusMatch=text.match(/<STATUS>([\s\S]*?)<\/STATUS>/);
        if(statusMatch){
          var statusText=statusMatch[1];
          var dateM=statusText.match(/日期:\s*([^\n]*)/);
          var locM=statusText.match(/地点:\s*([^\n]*)/);
          var poseM=statusText.match(/姿势:\s*([^\n]*)/);
          msgs.push({
            type:'status',
            date:dateM?dateM[1].trim():'',
            location:locM?locM[1].trim():'',
            pose:poseM?poseM[1].trim():''
          });
          /* 从原文里删掉状态栏部分 */
          text=text.replace(statusMatch[0],'');
        }

        /* 2. 按标签切分对话和 OS */
        /* <DIALOGUE name="xxx" status="xxx">对话内容</DIALOGUE> */
        /* <OS name="xxx">内心独白</OS> */
        var parts=text.split(/(<DIALOGUE[\s\S]*?<\/DIALOGUE>|<OS[\s\S]*?<\/OS>)/g);
        parts.forEach(function(part){
          if(!part||!part.trim())return;
          var dm=part.match(/<DIALOGUE\s+name="([^"]*)"(?:\s+status="([^"]*)")?>([\s\S]*?)<\/DIALOGUE>/);
          if(dm){
            msgs.push({type:'dialogue',name:dm[1],status:dm[2]||'',text:dm[3].trim()});
            return;
          }
          var om=part.match(/<OS\s+name="([^"]*)">([\s\S]*?)<\/OS>/);
          if(om){
            msgs.push({type:'os',name:om[1],text:om[2].trim()});
            return;
          }
          /* 剩下的普通文本按段落切成旁白 */
          part.trim().split(/\n\s*\n/).forEach(function(p){
            p=p.trim();
            if(p)msgs.push({type:'narration',text:p});
          });
        });
        return msgs;
      }

      function _pgChatDetail(){
        var charId=_nav.data&&_nav.data.charId;
        var ch=(_sbS.characters||[]).find(function(c){return c.id===charId;});
        if(!ch){_go('chats');return;}
        var avatarPng=ch._stUniqueKey||'';
        var charName=ch.name;
        var userName=(_sbS.user&&_sbS.user.name)||'用户';
        var pg=_div('pppg ppsl');pg.appendChild(_navbar(ch.name,'chats'));
        var body=_div('');body.style.cssText='flex:1;display:flex;flex-direction:column;overflow:hidden;';

        /* 顶部用户信息卡（玩家 persona） */
        var mePersona=(_sbS.user&&_sbS.user.personas&&_sbS.user.personas[_sbS.user.activePersona])||{name:'我',persona:''};
        var meCard=_div('');meCard.style.cssText='flex-shrink:0;margin:6px 12px 8px;padding:8px 12px;display:flex;gap:10px;align-items:center;background:rgba(255,255,255,.08);border-radius:14px;border:.5px solid rgba(255,255,255,.1);';
        meCard.appendChild(_mkAvatar(mePersona.name,(_sbS.user&&_sbS.user.avatar)||'',48));
        var meInfo=_div('');meInfo.style.cssText='flex:1;min-width:0;';
        meInfo.innerHTML='<div style="font-size:14px;font-weight:700;color:rgba(255,255,255,.9);margin-bottom:1px;">'+mePersona.name+'</div>';
        /* 右侧操作按钮：存档列表 / 聊天设置 */
        var acts=_div('');acts.style.cssText='display:flex;gap:6px;flex-shrink:0;';
        function _mkActBtn(icon,cb){
          var b=_div('');b.textContent=icon;
          b.style.cssText='width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:15px;cursor:pointer;';
          b.addEventListener('click',function(e){e.stopPropagation();cb();});
          return b;
        }
        acts.appendChild(_mkActBtn('📁',function(){_go('chat-archives',{charId:ch.id});}));
        acts.appendChild(_mkActBtn('⚙',function(){_go('chat-style',{charId:ch.id});}));
        meCard.appendChild(meInfo);meCard.appendChild(acts);
        body.appendChild(meCard);

        /* 消息区域 */
        var msgBox=_div('');msgBox.style.cssText='flex:1;overflow-y:auto;padding:4px 14px 12px;display:flex;flex-direction:column;gap:4px;';
        body.appendChild(msgBox);

        /* 当前 chatArr（酒馆 jsonl 原始数组）与解析后的 msgs */
        var chatArr=[];
        var msgs=[];
        var curFileId=_nav.data.fileId||_sbS.lastChatByChar[ch.id]||'';
        var _sending=false;

        /* 从最新一条 status 消息里取时间地点，更新顶部角色卡 */
        function _updateStatusCard(){
          var oldTags=meInfo.querySelectorAll('.ppstatus-tag');
          for(var oi=0;oi<oldTags.length;oi++){oldTags[oi].remove();}
          var latestStatus=null;
          for(var si=msgs.length-1;si>=0;si--){if(msgs[si].type==='status'){latestStatus=msgs[si];break;}}
          if(!latestStatus)return;
          if(latestStatus.date){
            var d=_div('');d.className='ppstatus-tag';d.style.cssText='display:inline-block;font-size:10px;color:rgba(255,150,180,.8);background:rgba(255,126,179,.12);padding:2px 8px;border-radius:10px;margin-bottom:3px;';
            d.textContent='🕐 '+latestStatus.date;
            meInfo.appendChild(d);
            meInfo.appendChild(TOPDOC.createElement('div'));
          }
          if(latestStatus.location){
            var l=_div('');l.className='ppstatus-tag';l.style.cssText='display:inline-block;font-size:10px;color:rgba(255,150,180,.8);background:rgba(255,126,179,.12);padding:2px 8px;border-radius:10px;';
            l.textContent='📍 '+latestStatus.location;
            meInfo.appendChild(l);
          }
        }

        function _renderMsg(m){
          if(m.type==='status'){return;}
          if(m.type==='narration'){
            var n=_div('');n.style.cssText='font-size:14px;line-height:1.75;color:rgba(255,255,255,.65);margin:10px 2px;text-align:justify;white-space:pre-wrap;';
            n.textContent=m.text;msgBox.appendChild(n);return;
          }
          if(m.type==='me'||m.from==='me'){
            var me=_div('');me.style.cssText='max-width:75%;align-self:flex-end;background:linear-gradient(135deg,rgba(255,126,179,.85),rgba(255,92,138,.85));padding:9px 14px;border-radius:18px 18px 5px 18px;font-size:14px;line-height:1.6;color:#fff;margin:6px 0;white-space:pre-wrap;word-break:break-word;';
            me.textContent=m.text;msgBox.appendChild(me);return;
          }
          var row=_div('');row.style.cssText='display:flex;gap:10px;margin:16px 0;align-items:flex-start;';
          row.appendChild(_mkAvatar(ch.name,ch.avatar,40));
          var rb=_div('');rb.style.cssText='flex:1;min-width:0;';
          var head=_div('');head.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:6px;padding-left:2px;';
          head.innerHTML='<span style="font-size:14px;font-weight:700;color:rgba(255,150,180,.9);">'+ch.name+'</span>';
          if(m.type==='os'){
            var osTag=_div('');osTag.style.cssText='font-size:11px;color:rgba(255,126,165,.95);background:rgba(255,126,179,.15);padding:3px 10px;border-radius:12px;font-style:italic;';
            osTag.textContent='OS';head.appendChild(osTag);
          }
          if(m.status){
            var st=_div('');st.style.cssText='font-size:11px;color:rgba(255,126,165,.95);background:rgba(255,126,179,.15);padding:3px 10px;border-radius:12px;';
            st.textContent=m.status;head.appendChild(st);
          }
          rb.appendChild(head);
          var bub=_div('');
          var isOs=m.type==='os';
          bub.style.cssText='display:inline-block;max-width:100%;padding:11px 15px;font-size:14px;line-height:1.7;white-space:pre-wrap;word-break:break-word;'
            +(isOs
              ?'background:rgba(255,150,180,.2);color:rgba(255,200,215,.95);border-radius:4px 18px 18px 18px;font-style:italic;'
              :'background:rgba(255,255,255,.95);color:#333;border-radius:4px 18px 18px 18px;');
          bub.textContent=m.text;rb.appendChild(bub);
          row.appendChild(rb);msgBox.appendChild(row);
        }

        var _hintRef=null;
        function _appendMsg(m){
          if(_hintRef){_hintRef.remove();_hintRef=null;}
          _renderMsg(m);
          msgBox.scrollTop=msgBox.scrollHeight;
        }

        /* ── 酒馆 chatArr → 小手机 msgs ── */
        function _chatArrToMsgs(arr){
          var out=[];
          arr.forEach(function(raw,idx){
            if(!raw)return;
            if(idx===0&&(raw.chat_metadata!==undefined||raw.user_name!==undefined))return;
            if(raw.is_system)return;
            if(raw.is_user){out.push({type:'me',text:raw.mes||''});}
            else{_parseAiOutput(raw.mes||'',charName).forEach(function(p){out.push(p);});}
          });
          return out;
        }

        /* 启动：确定当前 fileId 并加载 */
        function _reallyLoad(){
          _ppLoadChat(avatarPng,curFileId,function(arr){
            chatArr=arr||[];
            msgs=_chatArrToMsgs(chatArr);
            msgs.forEach(function(m){_renderMsg(m);});
            _updateStatusCard();
            msgBox.scrollTop=msgBox.scrollHeight;
          });
        }
        function _bootChat(){
          if(curFileId){
            _sbS.lastChatByChar[ch.id]=curFileId;_W();
            _reallyLoad();return;
          }
          _ppListChats(avatarPng,function(list){
            if(list&&list.length){
              list.sort(function(a,b){return new Date(b.last_mes)-new Date(a.last_mes);});
              curFileId=list[0].file_name;
            }else{
              _ppNewChat(avatarPng,charName,userName,function(ok,fid){
                curFileId=fid;
                _sbS.lastChatByChar[ch.id]=curFileId;_W();
                _reallyLoad();
              });
              return;
            }
            _sbS.lastChatByChar[ch.id]=curFileId;_W();
            _reallyLoad();
          });
        }

        /* ── 聊天 AI 接入 ── */
        function _chatApiUrl(){return _sbS.apiUrl||'';}
        function _chatApiKey(){return _sbS.apiKey||'';}
        function _chatModel(){return _sbS.model||'';}

        function _chatWbEntryContent(book,entryKey,cb){
          try{
            var cached=_ui.wbContentMap&&_ui.wbContentMap[book.id]&&_ui.wbContentMap[book.id][entryKey];
            if(typeof cached==='string'){cb&&cb(cached);return;}
            var stCtx=_getSTCtx();
            if(!stCtx||!stCtx.loadWorldInfo){cb&&cb('');return;}
            stCtx.loadWorldInfo(book._stBookFileName||book.name).then(function(live){
              var c=(live&&live.entries&&live.entries[entryKey]&&live.entries[entryKey].content)||'';
              if(!_ui.wbContentMap)_ui.wbContentMap={};
              if(!_ui.wbContentMap[book.id])_ui.wbContentMap[book.id]={};
              _ui.wbContentMap[book.id][entryKey]=c;
              cb&&cb(c);
            }).catch(function(){cb&&cb('');});
          }catch(e){cb&&cb('');}
        }

        function _buildChatPrompt(cb){
          var stCtx=_getSTCtx();
          var charDesc=(ch&&ch.persona)||'';
          var userDesc=(_sbS.user&&_sbS.user.persona)||'';
          var now=new Date();
          var timeStr=now.getFullYear()+'年'+(now.getMonth()+1)+'月'+now.getDate()+'日 '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
          var styleTxt=_ppCharStyle(ch.id);
          var minLen=_ppCharMinLen(ch.id);
          var books=(_sbS.wbBooks||[]).filter(function(b){return b._stEnabled;});
          var wbParts=[],pending=0;
          var wbTimer=null,wbDone=false;
          books.forEach(function(book){
            (book.entries||[]).forEach(function(en){
              var key=en._stEntryKey||en.uid||'';
              if(!key)return;
              pending++;
              _chatWbEntryContent(book,key,function(c){
                if(c)wbParts.push('《'+(en.name||book.name||'')+'》\n'+c);
                if(--pending===0)_done(wbParts.join('\n\n'));
              });
            });
          });
          if(!pending)_done('');
          else wbTimer=TOP.setTimeout(function(){if(pending>0){pending=0;_done(wbParts.join('\n\n'));}},8000);
          function _done(wbStr){
            if(wbDone)return;wbDone=true;
            if(wbTimer){TOP.clearTimeout(wbTimer);wbTimer=null;}
            var tpl='你正在扮演{{角色名称}}，以手机聊天的方式与{{用户名称}}对话。\n'
              +'【角色设定】\n{{角色名称}}：{{角色设定}}\n'
              +'【用户设定】\n{{用户名称}}：{{用户设定}}\n'
              +'【世界背景信息】\n{{世界书}}\n'
              +'【当前时间】\n{{当前时间}}\n'
              +'【文风要求】\n'+styleTxt+'\n'
              +'【回复格式规范（最重要，必须严格遵守）】\n'
              +'无论{{用户名称}}的消息是长是短、是否带动作描写，你每次回复都必须按以下顺序完整输出三个部分，任何一部分都不得省略：\n'
              +'第一步【状态栏】以 <STATUS> 标签开头，三行都要填：\n'
              +'<STATUS>\n日期: 具体的日期时间\n地点: 当前所在的地点\n姿势: 角色当前的姿势或动作状态\n</STATUS>\n'
              +'第二步【旁白】紧接着用一段纯文本描写动作、神态或环境，不要用标签：\n'
              +'（例：他缓缓抬起头，目光扫过房间，指尖轻轻敲了敲桌面。）\n'
              +'第三步【对话】用 <DIALOGUE> 标签说话，status 属性必须填写说话时的动作或神态：\n'
              +'<DIALOGUE name="{{角色名称}}" status="动作或神态">要说的话</DIALOGUE>\n'
              +'第四步【内心】（可选）有内心活动时用：<OS name="{{角色名称}}">内心独白</OS>\n'
              +'【回复长度】\n每次回复正文（不含标签）至少'+minLen+'字，内容要充实有细节，不要敷衍、不要短于要求。\n'
              +'附加规则：\n'
              +'1. 保持{{角色名称}}的人设，口语化、自然。\n'
              +'2. 旁白与对话要衔接剧情，推动对话向前发展，不要重复{{用户名称}}的话。\n'
              +'3. 直接输出回复内容本身，不要任何解释、标题或 Markdown，不要输出示例。';
            var sysPr=tpl
              .replace(/\{\{角色名称\}\}/g,charName)
              .replace(/\{\{角色设定\}\}/g,charDesc)
              .replace(/\{\{用户名称\}\}/g,userName)
              .replace(/\{\{用户设定\}\}/g,userDesc)
              .replace(/\{\{世界书\}\}/g,wbStr)
              .replace(/\{\{当前时间\}\}/g,timeStr);
            cb&&cb(sysPr);
          }
        }

        function _chatWith(messages,onText,onErr){
          var base=(_chatApiUrl()||'').replace(/\/chat\/completions\/?$/,'').replace(/\/+$/,'');
          if(!base){onErr('API 地址未设置，请到设置页配置');return;}
          var model=_chatModel();
          if(!model){onErr('模型未设置，请到设置页配置');return;}
          var hdrs={'Content-Type':'application/json'};
          var key=_chatApiKey();if(key)hdrs['Authorization']='Bearer '+key;
          var ctl=(typeof AbortController!=='undefined')?new AbortController():null;
          var TIMEOUT_MS=60000;
          var timer=ctl?setTimeout(function(){ctl.abort();},TIMEOUT_MS):null;
          var startedAt=Date.now();
          var debug={startedAt:new Date(startedAt).toISOString(),url:base+'/chat/completions',request:{model:model,messages:messages.length},state:'loading'};
          try{window.__vnmChatLastApi=debug;}catch(e){}
          var fetchOpts={method:'POST',headers:hdrs,
            body:JSON.stringify({model:model,messages:messages,max_tokens:4000,temperature:0.9})};
          if(ctl)fetchOpts.signal=ctl.signal;
          TOP.fetch(base+'/chat/completions',fetchOpts).then(function(r){
            debug.httpStatus=r.status;debug.state=r.ok?'success':'error';
            try{window.__vnmChatLastApi=debug;}catch(e){}
            if(!r.ok){onErr('API HTTP '+r.status);return Promise.reject(null);}
            return r.json();
          }).then(function(data){
            if(!data)return;
            var txt=data.choices&&data.choices[0]&&data.choices[0].message&&data.choices[0].message.content;
            debug.responseText=String(txt||'').slice(0,2000);
            try{window.__vnmChatLastApi=debug;}catch(e){}
            if(!txt)onErr('API 返回空内容');else onText(txt.trim());
          }).catch(function(e){
            if(ctl&&timer)clearTimeout(timer);
            if(ctl&&ctl.signal&&ctl.signal.aborted){
              debug.state='error';debug.error='请求超时（'+Math.round(TIMEOUT_MS/1000)+' 秒）';
              try{window.__vnmChatLastApi=debug;}catch(e2){}
              onErr('请求超时（'+Math.round(TIMEOUT_MS/1000)+' 秒），请检查网络或代理后重试');
            }else if(e){onErr('API: '+e.message);}
          });
        }

        /* 聊天历史转 messages[]（从酒馆 chatArr，只取最近14条） */
        function _chatHistoryMsgs(){
          if(!chatArr||!chatArr.length)return[];
          var conv=[];
          chatArr.forEach(function(raw,idx){
            if(idx===0&&raw&&raw.chat_metadata!==undefined)return;
            if(!raw||raw.is_system)return;
            if(raw.is_user)conv.push({role:'user',content:raw.mes||''});
            else conv.push({role:'assistant',content:raw.mes||''});
          });
          var merged=[];
          conv.forEach(function(m){
            var last=merged[merged.length-1];
            if(last&&last.role===m.role){last.content+='\n'+m.content;}
            else merged.push({role:m.role,content:m.content});
          });
          return merged.slice(-14);
        }

        function _setSending(on){
          if(on){
            if(_hintRef)return;
            var h=_div('');h.style.cssText='display:flex;align-items:center;gap:6px;color:rgba(255,255,255,.45);font-size:12px;padding:6px 4px;';
            h.textContent=charName+' 正在输入…';
            msgBox.appendChild(h);msgBox.scrollTop=msgBox.scrollHeight;
            _hintRef=h;
            inp.disabled=true;sendBtn.disabled=true;
          }else{
            if(_hintRef){_hintRef.remove();_hintRef=null;}
            if(inp){inp.disabled=false;inp.focus();}
            if(sendBtn)sendBtn.disabled=false;
          }
        }

        /* 输入区域 */
        var inBar=_div('');inBar.style.cssText='flex-shrink:0;display:flex;gap:8px;padding:10px 12px;border-top:.5px solid rgba(255,255,255,.08);background:rgba(0,0,0,.15);';
        var inp=TOPDOC.createElement('input');inp.className='ppfi';inp.type='text';inp.placeholder='行动 / 对话…';
        inp.style.cssText='flex:1;padding:10px 14px;font-size:13px;background:rgba(255,255,255,.08);border-radius:20px;border:.5px solid rgba(255,255,255,.12);color:#fff;';
        inp.addEventListener('mousedown',function(e){e.stopPropagation();});
        var sendBtn=TOPDOC.createElement('button');sendBtn.textContent='➤';
        sendBtn.style.cssText='flex-shrink:0;width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#ff7eb3,#ff5c8a);color:#fff;border:none;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;';
        function sendMsg(){
          var t=inp.value.trim();if(!t||_sending)return;
          _sending=true;
          inp.value='';
          /* push 用户消息到酒馆 chatArr 并保存 */
          chatArr.push({name:userName,is_user:true,is_system:false,mes:t,send_date:new Date().toISOString()});
          _ppSaveChat(avatarPng,curFileId,chatArr,function(){});
          msgs.push({type:'me',text:t});
          _appendMsg({type:'me',text:t});
          _setSending(true);
          _buildChatPrompt(function(sysPr){
            var msgsList=[{role:'system',content:sysPr}]
              .concat(_chatHistoryMsgs())
              .concat([{role:'user',content:t}]);
            _chatWith(msgsList,function(raw){
              /* push AI 原始回复到酒馆 chatArr 并保存（标签原样保留，方便在酒馆里调试） */
              chatArr.push({name:charName,is_user:false,is_system:false,mes:raw,send_date:new Date().toISOString()});
              _ppSaveChat(avatarPng,curFileId,chatArr,function(){});
              var parsed=_parseAiOutput(raw,charName);
              if(!parsed.length)parsed=[{type:'narration',text:raw}];
              parsed.forEach(function(pm){
                msgs.push(pm);
                if(pm.type!=='status')_appendMsg(pm);
              });
              _updateStatusCard();
              _setSending(false);
              _sending=false;
              msgBox.scrollTop=msgBox.scrollHeight;
            },function(err){
              _setSending(false);_sending=false;
              _toast('回复失败: '+err);
            });
          });
        }
        inp.addEventListener('keydown',function(e){if(e.key==='Enter')sendMsg();});
        sendBtn.addEventListener('click',sendMsg);
        inBar.appendChild(inp);inBar.appendChild(sendBtn);
        body.appendChild(inBar);

        pg.appendChild(body);scr.appendChild(pg);
        _bootChat();
      }

      /* ── 聊天存档列表子页面 ── */
      function _pgChatArchives(){
        var charId=_nav.data&&_nav.data.charId;
        var ch=(_sbS.characters||[]).find(function(c){return c.id===charId;});
        if(!ch){_go('chats');return;}
        var avatarPng=ch._stUniqueKey||'';
        var pg=_div('pppg ppsl');pg.appendChild(_navbar('聊天存档','chat-detail'));
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:8px 0 24px;';

        /* 新建聊天按钮 */
        var newBtn=_div('');newBtn.textContent='＋ 新建聊天';
        newBtn.style.cssText='margin:8px 14px;padding:12px;background:linear-gradient(135deg,rgba(255,126,179,.85),rgba(255,92,138,.85));border-radius:12px;text-align:center;font-size:14px;font-weight:600;color:#fff;cursor:pointer;';
        newBtn.addEventListener('click',function(){
          newBtn.textContent='新建中…';newBtn.style.pointerEvents='none';
          _ppNewChat(avatarPng,ch.name,(_sbS.user&&_sbS.user.name)||'用户',function(ok,fid){
            newBtn.textContent='＋ 新建聊天';newBtn.style.pointerEvents='';
            if(!ok){_toast('新建失败');return;}
            _sbS.lastChatByChar[ch.id]=fid;_W();
            _go('chat-detail',{charId:ch.id,fileId:fid});
          });
        });
        body.appendChild(newBtn);

        var listBox=_div('');listBox.style.cssText='padding:4px 14px;';
        body.appendChild(listBox);
        _toast('加载存档…');
        _ppListChats(avatarPng,function(list){
          listBox.innerHTML='';
          if(!list||!list.length){
            var empty=_div('');empty.style.cssText='text-align:center;color:rgba(255,255,255,.35);font-size:13px;padding:30px 0;';
            empty.textContent='暂无聊天存档';
            listBox.appendChild(empty);
            return;
          }
          list.sort(function(a,b){return new Date(b.last_mes)-new Date(a.last_mes);});
          var curId=_sbS.lastChatByChar[ch.id]||'';
          list.forEach(function(it){
            var row=_div('');row.style.cssText='display:flex;align-items:center;gap:10px;padding:12px 10px;border-bottom:.5px solid rgba(255,255,255,.06);cursor:pointer;';
            var main=_div('');main.style.cssText='flex:1;min-width:0;';
            var title=_div('');title.style.cssText='font-size:14px;font-weight:600;color:rgba(255,255,255,.9);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
            title.textContent=(it.file_name||'未命名')+(it.file_name===curId?'  · 当前':'');
            var sub=_div('');sub.style.cssText='font-size:11px;color:rgba(255,255,255,.4);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
            sub.textContent=(it.preview_message||'[空聊天]').slice(0,40);
            main.appendChild(title);main.appendChild(sub);
            row.appendChild(main);
            /* 删除按钮 */
            var del=_div('');del.textContent='🗑';
            del.style.cssText='flex-shrink:0;width:32px;height:32px;border-radius:50%;background:rgba(255,80,80,.15);display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;';
            del.addEventListener('click',function(e){
              e.stopPropagation();
              _ppConfirmDlg('删除聊天存档','确定删除「'+(it.file_name||'')+'」吗？此操作不可恢复。',function(){
                _ppDeleteChat(avatarPng,it.file_name,function(ok){
                  if(!ok){_toast('删除失败');return;}
                  if(_sbS.lastChatByChar[ch.id]===it.file_name){
                    delete _sbS.lastChatByChar[ch.id];_W();
                  }
                  _toast('已删除');
                  _pprefresh&&_pprefresh();
                });
              });
            });
            row.appendChild(del);
            row.addEventListener('click',function(){
              _sbS.lastChatByChar[ch.id]=it.file_name;_W();
              _go('chat-detail',{charId:ch.id,fileId:it.file_name});
            });
            listBox.appendChild(row);
          });
        });
        pg.appendChild(body);scr.appendChild(pg);
      }

      /* ── 聊天设置子页面（文风 + 保底字数，全局默认 + 当前角色覆盖） ── */
      function _pgChatStyle(){
        var charId=_nav.data&&_nav.data.charId;
        var ch=(_sbS.characters||[]).find(function(c){return c.id===charId;});
        if(!ch){_go('chats');return;}
        var pg=_div('pppg ppsl');pg.appendChild(_navbar('聊天设置','chat-detail'));
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:10px 14px 30px;display:flex;flex-direction:column;gap:14px;';

        function _lbl(t){var d=_div('');d.style.cssText='font-size:12px;color:rgba(255,255,255,.5);margin-bottom:6px;';d.textContent=t;return d;}
        function _area(ph,val){
          var ta=TOPDOC.createElement('textarea');
          ta.style.cssText='width:100%;min-height:90px;padding:10px 12px;font-size:13px;line-height:1.5;background:rgba(255,255,255,.08);border:.5px solid rgba(255,255,255,.12);border-radius:10px;color:#fff;resize:vertical;font-family:inherit;';
          ta.placeholder=ph;ta.value=val||'';
          return ta;
        }
        function _num(val){
          var i=TOPDOC.createElement('input');i.type='number';i.min='0';i.style.cssText='width:100%;padding:10px 12px;font-size:13px;background:rgba(255,255,255,.08);border:.5px solid rgba(255,255,255,.12);border-radius:10px;color:#fff;';i.value=val;
          return i;
        }

        /* 当前角色标识 */
        var head=_div('');head.style.cssText='font-size:15px;font-weight:700;color:rgba(255,150,180,.9);';
        head.textContent='正在设置：'+ch.name;
        body.appendChild(head);

        /* 全局默认文风 */
        body.appendChild(_lbl('全局默认文风（所有角色共用，留空用内置默认）'));
        var glStyle=_area(_PP_DEFAULT_STYLE, _sbS.defaultChatStyle||'');
        body.appendChild(glStyle);

        /* 当前角色覆盖文风 */
        body.appendChild(_lbl('此角色单独覆盖文风（留空=用上面的全局默认）'));
        var ovStyle=_area('留空则使用全局默认', (_sbS.chatStyleByChar||{})[ch.id]||'');
        body.appendChild(ovStyle);

        /* 全局默认保底字数 */
        body.appendChild(_lbl('全局默认保底回复字数'));
        var glLen=_num(_sbS.defaultChatMinLen||500);
        body.appendChild(glLen);

        /* 当前角色覆盖保底字数 */
        body.appendChild(_lbl('此角色单独保底字数（留空=用全局默认）'));
        var ovLen=_num((_sbS.chatMinLenByChar||{})[ch.id]||'');
        body.appendChild(ovLen);

        /* 保存按钮 */
        var saveBtn=_div('');saveBtn.textContent='保存';
        saveBtn.style.cssText='margin-top:8px;padding:12px;background:linear-gradient(135deg,#ff7eb3,#ff5c8a);border-radius:12px;text-align:center;font-size:14px;font-weight:600;color:#fff;cursor:pointer;';
        saveBtn.addEventListener('click',function(){
          _sbS.defaultChatStyle=glStyle.value;
          var ovS=ovStyle.value.trim();
          if(ovS){_sbS.chatStyleByChar[ch.id]=ovS;}else{delete _sbS.chatStyleByChar[ch.id];}
          var glN=parseInt(glLen.value,10);if(!isNaN(glN)&&glN>0)_sbS.defaultChatMinLen=glN;
          var ovN=parseInt(ovLen.value,10);
          if(!isNaN(ovN)&&ovN>0){_sbS.chatMinLenByChar[ch.id]=ovN;}else{delete _sbS.chatMinLenByChar[ch.id];}
          _W();
          _toast('已保存');
          _go('chat-detail',{charId:ch.id});
        });
        body.appendChild(saveBtn);

        pg.appendChild(body);scr.appendChild(pg);
      }

      function _pgSettings(){
        var pg=_div('pppg ppsl');pg.appendChild(_navbar('设置','home'));
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:4px 0 20px;';
        /* Core settings */
        var coreItems=[
          {l:'API 设置',s:'URL · 密钥 · 模型',pg:'s-api',ic:'<path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>'},
          {l:'TTS 语音合成',s:'MiniMax / Fish Audio 引擎配置',pg:'s-tts',ic:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>'},
                  ];
        body.appendChild(_div('ppsec','功能配置'));
        var c1=_div('ppcard');
        coreItems.forEach(function(item){
          var r=_div('pprow tap');
          r.appendChild(_div('ppic',_svg(item.ic)));
          r.appendChild(_div('pprb','<div class="pprt">'+item.l+'</div><div class="pprs">'+item.s+'</div>'));
          r.appendChild(_div('ppchev','›'));
          r.addEventListener('click',function(){_go(item.pg);});
          c1.appendChild(r);
        });
        body.appendChild(c1);
        /* Appearance */
        body.appendChild(_div('ppsec','外观'));
        var cG=_div('ppcard');
        var gr=_div('pprow tap');
        gr.appendChild(_div('ppic',_svg('<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 010 18"/><path d="M3.5 9h17"/><path d="M3.5 15h17"/>')));
        gr.appendChild(_div('pprb','<div class="pprt">液态玻璃</div><div class="pprs">背景与按钮分组 · 折射 · 中心清晰区</div>'));
        gr.appendChild(_div('ppchev','›'));
        gr.addEventListener('click',function(){_go('s-glass');});
        cG.appendChild(gr);body.appendChild(cG);
        /* Plugin settings sections */
        var pluginsWithSettings=(_sbS.ppApps||[]).filter(function(a){return a.enabled&&a.settingsFields&&a.settingsFields.length;});
        if(pluginsWithSettings.length){
          body.appendChild(_div('ppsec','插件配置'));
          var c2=_div('ppcard');
          pluginsWithSettings.forEach(function(app){
            var r=_div('pprow tap');
            r.appendChild(_div('ppic','<svg width="16" height="16" viewBox="0 0 24 24" style="stroke:rgba(255,255,255,.7);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;">'+app.icon+'</svg>'));
            r.appendChild(_div('pprb','<div class="pprt">'+app.name+'</div><div class="pprs">'+(app.settingsTitle||app.name)+'</div>'));
            r.appendChild(_div('ppchev','›'));
            r.addEventListener('click',(function(a){return function(){_go('s-plugin',{app:a});};})(app));
            c2.appendChild(r);
          });
          body.appendChild(c2);
        }
        /* App management */
        body.appendChild(_div('ppsec','应用管理'));
        var c3=_div('ppcard');
        var mr=_div('pprow tap');
        mr.appendChild(_div('ppic',_svg('<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>')));
        mr.appendChild(_div('pprb','<div class="pprt">已安装应用</div><div class="pprs">'+((_sbS.ppApps||[]).length)+'个应用</div>'));
        mr.appendChild(_div('ppchev','›'));
        mr.addEventListener('click',function(){_go('s-apps');});
        c3.appendChild(mr);body.appendChild(c3);
        pg.appendChild(body);scr.appendChild(pg);
      }

      /* ════════ 液态玻璃外观设置 ════════ */
      function _pgSGlass(){
        var pg=_div('pppg ppsl');pg.appendChild(_navbar('液态玻璃','settings'));
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:4px 0 20px;';
        function _sl(card,label,key,min,max,step,dflt,unit){
          var f=_div('ppfield');
          var top=_div('');top.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;';
          top.appendChild(_div('','<span style="font-size:13px;color:rgba(255,255,255,.82)">'+label+'</span>'));
          var val=_div('');val.style.cssText='font-size:12px;color:rgba(255,255,255,.45);font-variant-numeric:tabular-nums;';
          var cur=(_sbS.glassUI&&_sbS.glassUI[key]!==undefined&&_sbS.glassUI[key]!==null)?_sbS.glassUI[key]:dflt;
          val.textContent=cur+unit;
          top.appendChild(val);f.appendChild(top);
          var r=TOPDOC.createElement('input');r.type='range';r.min=min;r.max=max;r.step=step;r.value=cur;
          r.style.cssText='width:100%;height:22px;cursor:pointer;accent-color:rgba(255,255,255,.9);background:transparent;border:none;display:block;';
          r.addEventListener('input',function(){_sbS.glassUI=_sbS.glassUI||{};_sbS.glassUI[key]=parseFloat(r.value);val.textContent=r.value+unit;_applyGlass();});
          r.addEventListener('change',function(){_W();});
          f.appendChild(r);card.appendChild(f);
        }
        function _grp(title,pre){
          body.appendChild(_div('ppsec',title));
          var card=_div('ppcard');
          _sl(card,'模糊（清晰度）',pre+'Blur',0,40,0.5,pre==='el'?1.5:0,'px');
          _sl(card,'雾感（白膜不透明度）',pre+'Tint',0,40,1,pre==='el'?1:0,'%');
          _sl(card,'折射强度',pre+'Refr',0,150,5,60,'');
          _sl(card,'中心清晰区',pre+'Zone',0,100,1,95,'%');
          _sl(card,'饱和度',pre+'Sat',50,300,10,160,'%');
          body.appendChild(card);
        }
        _grp('背景面板','bg');
        _grp('按钮与组件','el');
        body.appendChild(_div('ppsec','通用'));
        var cardC=_div('ppcard');
        _sl(cardC,'边缘高光','hl',0,100,5,10,'%');
        _sl(cardC,'圆角','radius',8,32,1,32,'px');
        _sl(cardC,'提亮','bright',90,140,1,90,'%');
        _sl(cardC,'背景遮罩深度','dim',0,80,1,23,'%');
        body.appendChild(cardC);
        var c2=_div('ppcard');var r2=_div('pprow');
        r2.appendChild(_div('pprb','<div class="pprt">边缘折射效果</div><div class="pprs">仿 iOS 液态玻璃边缘扭曲</div>'));
        var refOn=(_sbS.glassUI&&_sbS.glassUI.refract!==undefined&&_sbS.glassUI.refract!==null)?!!_sbS.glassUI.refract:true;
        r2.appendChild(_tog(refOn,function(v){_sbS.glassUI=_sbS.glassUI||{};_sbS.glassUI.refract=v?1:0;_W();_applyGlass();}));
        c2.appendChild(r2);body.appendChild(c2);
        var rb=_el('button','ppbtn');rb.textContent='↻ 恢复默认';rb.style.margin='14px';
        rb.addEventListener('click',function(){_sbS.glassUI={};_W();_applyGlass();_render();_toast('已恢复默认外观');});
        body.appendChild(rb);
        pg.appendChild(body);scr.appendChild(pg);
      }

      /* Core settings pages via v9.25 render fns */
      function _pgSApi(){
        var pg=_div('pppg');pg.appendChild(_navbar('API 设置','settings'));
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:4px 0 20px;';

        /* ── API 连接 ── */
        body.appendChild(_div('ppsec','API 连接'));
        var cardConn=_div('ppcard');
        var urlRow=_div('pprow');urlRow.style.cssText='flex-direction:column;align-items:stretch;padding:12px 14px;gap:6px;';
        var urlLbl=_div('');urlLbl.style.cssText='font-size:11px;color:rgba(255,255,255,.38);font-weight:500;';urlLbl.textContent='API 地址';
        var urlI=TOPDOC.createElement('input');urlI.className='ppfi';urlI.type='url';urlI.placeholder='https://api.example.com/v1';urlI.value=_sbS.apiUrl||'';
        urlI.addEventListener('mousedown',function(e){e.stopPropagation();});
        urlI.addEventListener('change',function(){_sbS.apiUrl=this.value.trim();_W();});
        urlRow.appendChild(urlLbl);urlRow.appendChild(urlI);cardConn.appendChild(urlRow);
        var _s1=_div('');_s1.style.cssText='height:.5px;background:rgba(255,255,255,.06);margin:0 14px;';cardConn.appendChild(_s1);
        var keyRow=_div('pprow');keyRow.style.cssText='flex-direction:column;align-items:stretch;padding:12px 14px;gap:6px;';
        var keyLbl=_div('');keyLbl.style.cssText='font-size:11px;color:rgba(255,255,255,.38);font-weight:500;';keyLbl.textContent='API 密钥';
        var keyI=TOPDOC.createElement('input');keyI.className='ppfi';keyI.type='password';keyI.placeholder='sk-…';keyI.value=_sbS.apiKey||'';
        keyI.addEventListener('mousedown',function(e){e.stopPropagation();});
        keyI.addEventListener('change',function(){_sbS.apiKey=this.value.trim();_W();});
        keyRow.appendChild(keyLbl);keyRow.appendChild(keyI);cardConn.appendChild(keyRow);
        body.appendChild(cardConn);

        /* ── 模型 ── */
        body.appendChild(_div('ppsec','模型'));
        var cardModel=_div('ppcard');
        var modelRow=_div('pprow');modelRow.style.cssText='flex-direction:column;align-items:stretch;padding:12px 14px;gap:6px;';
        var modelLbl=_div('');modelLbl.style.cssText='font-size:11px;color:rgba(255,255,255,.38);font-weight:500;';modelLbl.textContent='模型名称';
        var modelInputRow=_div('');modelInputRow.style.cssText='display:flex;gap:8px;align-items:center;';
        var modelI=TOPDOC.createElement('input');modelI.className='ppfi';modelI.style.flex='1';modelI.placeholder='gpt-4o / claude-3-5-sonnet…';modelI.value=_sbS.model||'';
        modelI.addEventListener('mousedown',function(e){e.stopPropagation();});
        modelI.addEventListener('change',function(){_sbS.model=this.value.trim();_W();});
        var fetchMdBtn=TOPDOC.createElement('button');
        fetchMdBtn.textContent='拉取';
        fetchMdBtn.style.cssText='padding:4px 12px;font-size:11px;font-weight:500;background:rgba(255,255,255,.10);color:rgba(255,255,255,.75);border:.5px solid rgba(255,255,255,.22);border-radius:10px;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;transition:background .12s;';
        fetchMdBtn.addEventListener('mouseenter',function(){fetchMdBtn.style.background='rgba(255,255,255,.18)';});
        fetchMdBtn.addEventListener('mouseleave',function(){fetchMdBtn.style.background='rgba(255,255,255,.10)';});
        fetchMdBtn.addEventListener('click',function(e){
          e.stopPropagation();
          var u=(_sbS.apiUrl||'').replace(/\/+$/,'');
          var k=_sbS.apiKey||'';
          if(!u){TOP.alert('请先填写 API 地址');return;}
          fetchMdBtn.textContent='获取中…';fetchMdBtn.disabled=true;
          TOP.fetch(u+'/models',{method:'GET',headers:{'Authorization':'Bearer '+k,'Content-Type':'application/json'}})
          .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
          .then(function(data){
            var list=data.data||data.models||[];
            var models=list.map(function(m){return typeof m==='string'?m:(m.id||m.name||'');}).filter(Boolean);
            if(!models.length){fetchMdBtn.textContent='拉取';fetchMdBtn.disabled=false;TOP.alert('未获取到模型列表');return;}
            var mdSel=TOPDOC.getElementById('pp-model-fetch-sel');
            if(!mdSel){
              mdSel=TOPDOC.createElement('select');mdSel.id='pp-model-fetch-sel';mdSel.className='ppfi';
              mdSel.style.cssText='width:100%;margin-top:6px;';
              mdSel.addEventListener('mousedown',function(e){e.stopPropagation();});
              mdSel.addEventListener('change',function(){_sbS.model=this.value;modelI.value=this.value;_W();});
              modelRow.appendChild(mdSel);
            }
            mdSel.innerHTML='';
            models.forEach(function(m){var o=TOPDOC.createElement('option');o.value=m;o.textContent=m;if((_sbS.model||'')===m)o.selected=true;mdSel.appendChild(o);});
            fetchMdBtn.textContent='✓ '+models.length+'个';fetchMdBtn.disabled=false;
          })
          .catch(function(err){fetchMdBtn.textContent='拉取';fetchMdBtn.disabled=false;TOP.alert('拉取失败: '+err.message);});
        });
        modelInputRow.appendChild(modelI);modelInputRow.appendChild(fetchMdBtn);
        modelRow.appendChild(modelLbl);modelRow.appendChild(modelInputRow);cardModel.appendChild(modelRow);
        body.appendChild(cardModel);

        /* ── API 预设 ── */
        body.appendChild(_div('ppsec','API 预设'));
        var cardApiPr=_div('ppcard');
        var apiPrBar=_div('');apiPrBar.style.cssText='display:flex;flex-wrap:wrap;gap:6px;padding:10px 14px;align-items:center;';
        var saveApiPrBtn=TOPDOC.createElement('button');
        saveApiPrBtn.textContent='保存预设';
        saveApiPrBtn.style.cssText='padding:4px 12px;font-size:11px;font-weight:500;background:rgba(255,255,255,.10);color:rgba(255,255,255,.70);border:.5px solid rgba(255,255,255,.20);border-radius:10px;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;transition:background .12s;';
        saveApiPrBtn.addEventListener('mouseenter',function(){saveApiPrBtn.style.background='rgba(255,255,255,.18)';});
        saveApiPrBtn.addEventListener('mouseleave',function(){saveApiPrBtn.style.background='rgba(255,255,255,.10)';});
        function _renderApiPresets(){
          while(apiPrBar.children.length>1)apiPrBar.removeChild(apiPrBar.lastChild);
          var presets=_sbS.apiPresets||[];
          presets.forEach(function(p,pi){
            var pill=TOPDOC.createElement('span');
            pill.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:3px 10px;font-size:11px;background:rgba(255,255,255,.09);color:rgba(255,255,255,.72);border:.5px solid rgba(255,255,255,.18);border-radius:20px;cursor:pointer;max-width:160px;transition:background .12s;';
            pill.addEventListener('mouseenter',function(){pill.style.background='rgba(255,255,255,.16)';});
            pill.addEventListener('mouseleave',function(){pill.style.background='rgba(255,255,255,.09)';});
            var lbl=TOPDOC.createElement('span');lbl.style.cssText='overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';lbl.textContent=p.name;
            var x=TOPDOC.createElement('span');x.textContent='×';x.style.cssText='flex-shrink:0;font-size:13px;line-height:1;color:rgba(255,255,255,.40);margin-left:2px;';
            pill.appendChild(lbl);pill.appendChild(x);
            lbl.addEventListener('click',function(ev){ev.stopPropagation();
              _sbS.apiUrl=p.url||'';_sbS.apiKey=p.key||'';_sbS.model=p.model||'';_W();
              urlI.value=_sbS.apiUrl;keyI.value=_sbS.apiKey;modelI.value=_sbS.model;
              _toast('已应用预设「'+p.name+'」');
            });
            x.addEventListener('click',function(ev){ev.stopPropagation();
              if(!_sbS.apiPresets)return;_sbS.apiPresets.splice(pi,1);_W();_renderApiPresets();
            });
            apiPrBar.appendChild(pill);
          });
        }
        saveApiPrBtn.addEventListener('click',function(e){e.stopPropagation();
          var nm=TOP.prompt('预设名称：');if(!nm||!nm.trim())return;
          if(!_sbS.apiPresets)_sbS.apiPresets=[];
          _sbS.apiPresets.push({id:_uuid(),name:nm.trim(),url:_sbS.apiUrl||'',key:_sbS.apiKey||'',model:_sbS.model||''});
          _W();_renderApiPresets();
        });
        apiPrBar.appendChild(saveApiPrBtn);
        _renderApiPresets();
        cardApiPr.appendChild(apiPrBar);
        body.appendChild(cardApiPr);

        /* ── 数据缓存 ── */
        body.appendChild(_div('ppsec','数据'));
        var cardData=_div('ppcard');
        var clrRow=_div('pprow tap');clrRow.style.borderBottom='none';
        clrRow.appendChild(_div('pprb','<div class="pprt" style="color:rgba(255,255,255,.7)">清空所有缓存数据</div>'));
        clrRow.addEventListener('click',function(e){
          e.stopPropagation();
          if(!TOP.confirm('确定清空所有缓存？'))return;
          _sbS.history={};_sbS.injectCharIds=[];
          _W();_toast('已清空所有缓存');
        });
        cardData.appendChild(clrRow);body.appendChild(cardData);

        pg.appendChild(body);scr.appendChild(pg);
      }
      function _pgSChars()  {_wrapLegacy('角色管理',   'settings',_renderCharsTab);}
      function _pgSPresets(){_wrapLegacy('对话预设',   'settings',_renderPresetsTab);}
      function _pgSWb(){
        var pg=_div('pppg ppsl');
        if(!_ui.wbMgmtMode)_ui.wbMgmtMode=false;
        var nb=_navbar(_ui.wbMgmtMode?'全部世界书':'世界书','home');
        /* 管理模式下点时间回主屏 */
        if(_ui.wbMgmtMode){
          var clk=nb.querySelector('span');
          if(clk){clk.style.cursor='pointer';
            clk.onclick=function(){_ui.wbMgmtMode=false;_drawWb();};
          }
        }
        pg.appendChild(nb);
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:4px 0 24px;';
        pg.appendChild(body);

        function _isBookOn(bookId){
          var t=_sbS.wbBookToggles||{};
          return t[bookId]!==false;
        }
        function _setBook(bookId,on){
          if(!_sbS.wbBookToggles)_sbS.wbBookToggles={};
          _sbS.wbBookToggles[bookId]=on;
          _W();
        }

        function _drawWb(){
          while(body.firstChild)body.removeChild(body.firstChild);
          var books=_sbS.wbBooks||[];
          
          // 如果还没加载过世界书，自动静默拉取
          if(!books.length && !_ui.wbLoadedOnce){
            _ui.wbLoadedOnce=true;
            _pullAllWorldBooks(true);
          }

          if(_ui.wbMgmtMode){
            /* ── 管理子页：全部书带开关 ── */
            body.appendChild(_div('ppsec','全部世界书（'+books.length+'）'));
            books.forEach(function(book,bi){
              var card=_div('ppcard');
              var row=_div('pprow');row.style.padding='12px 14px';row.style.gap='10px';
              var on=_isBookOn(book.id);
              var rb=_div('pprb');rb.innerHTML='<div class="pprt">'+book.name+'</div><div class="pprs">'+(book.entries||[]).length+' 条条目 · '+(on?'已启用':'已关闭')+'</div>';
              row.appendChild(rb);
              var tog=_tog(on,function(v){_setBook(book.id,v);_saveWorldBookEnabled(book,v);_drawWb();});
              row.appendChild(tog);
              card.appendChild(row);
              body.appendChild(card);
            });
          } else {
            /* ── 主屏：刷新按钮 + 管理入口 + 已启用书 ── */
            var syncCard=_div('ppcard');
            var syncRow=_div('pprow tap');syncRow.style.padding='10px 14px';syncRow.style.gap='10px';
            syncRow.appendChild(_div('ppic',_svg('<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>')));
            syncRow.appendChild(_div('pprb','<div class="pprt">刷新世界书</div><div class="pprs">从酒馆同步最新世界书</div>'));
            syncRow.appendChild(_div('ppchev','›'));
            syncRow.addEventListener('click',function(){_pullAllWorldBooks(false);});
            syncCard.appendChild(syncRow);body.appendChild(syncCard);

            var mgmtCard=_div('ppcard');
            var mgmtRow=_div('pprow tap');mgmtRow.style.padding='10px 14px';mgmtRow.style.gap='10px';
            mgmtRow.appendChild(_div('ppic',_svg('<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>')));
            mgmtRow.appendChild(_div('pprb','<div class="pprt">全部世界书管理</div><div class="pprs">启用/关闭世界书</div>'));
            mgmtRow.appendChild(_div('ppchev','›'));
            mgmtRow.addEventListener('click',function(){_ui.wbMgmtMode=true;_drawWb();});
            mgmtCard.appendChild(mgmtRow);body.appendChild(mgmtCard);

            var onBooks=books.filter(function(b){return _isBookOn(b.id);});
            body.appendChild(_div('ppsec','已启用世界书（'+onBooks.length+'）'));
            if(!onBooks.length){
              var empty=_div('ppcard');
              var er=_div('pprow');er.style.padding='20px 14px';er.style.cursor='default';
              er.innerHTML='<span style="font-size:13px;color:rgba(255,255,255,.28);width:100%;text-align:center;">暂无启用的世界书</span>';
              empty.appendChild(er);body.appendChild(empty);
            }
            onBooks.forEach(function(book){
              var card=_div('ppcard');
              if(!_ui.wbBookOpen)_ui.wbBookOpen={};
              if(!_ui.wbEntryOpen)_ui.wbEntryOpen={};
              var bookOpen=!!_ui.wbBookOpen[book.id];
              /* 书标题行：点击展开/收起条目 */
              var hr=_div('pprow tap');hr.style.padding='10px 14px';hr.style.gap='8px';
              var bchev=_div('');bchev.style.cssText='font-size:14px;color:rgba(255,255,255,.4);transition:transform .15s;transform:'+(bookOpen?'rotate(90deg)':'rotate(0deg)')+';flex-shrink:0;width:12px;';
              bchev.textContent='›';
              hr.appendChild(bchev);
              var rb=_div('pprb');rb.innerHTML='<div class="pprt">'+book.name+'</div><div class="pprs">'+(book.entries||[]).length+' 条条目</div>';
              hr.appendChild(rb);
              /* 书总开关 */
              var bTog=_tog(true,function(v){_setBook(book.id,v);_saveWorldBookEnabled(book,v);_drawWb();});
              hr.appendChild(bTog);
              hr.addEventListener('click',function(e){
                if(e.target.closest('.pptog'))return;
                _ui.wbBookOpen[book.id]=!bookOpen;_drawWb();
              });
              card.appendChild(hr);

              /* 展开后显示条目 */
              if(bookOpen){
                var bsep=_div('');bsep.style.cssText='height:.5px;background:rgba(255,255,255,.055);margin:0 14px;';card.appendChild(bsep);
                (book.entries||[]).forEach(function(en,ei){
                  if(ei>0){var es=_div('');es.style.cssText='height:.5px;background:rgba(255,255,255,.04);margin:0 14px;';card.appendChild(es);}
                  var entryOpen=!!_ui.wbEntryOpen[en.id];
                  /* 条目行：开关+名字+展开 */
                  var er2=_div('pprow');er2.style.cssText+='flex-direction:column;align-items:stretch;gap:6px;padding:10px 14px;';
                  var etop=_div('');etop.style.cssText='display:flex;align-items:center;gap:8px;width:100%;';
                  var eTog=_tog(!!en.enabled,function(v){en.enabled=v;_W();_saveWorldBook(book);});
                  etop.appendChild(eTog);
                  var eName=_div('');eName.style.cssText='flex:1;font-size:13px;color:rgba(255,255,255,.85);';eName.textContent=en.name||'未命名';
                  etop.appendChild(eName);
                  var eBtn=TOPDOC.createElement('button');eBtn.textContent=entryOpen?'收起':'编辑';
                  eBtn.style.cssText='background:rgba(255,126,179,.2);color:#ffb6c9;border:.5px solid rgba(255,126,179,.3);border-radius:6px;height:24px;padding:0 8px;font-size:11px;cursor:pointer;flex-shrink:0;';
                  eBtn.onclick=function(e){e.stopPropagation();_ui.wbEntryOpen[en.id]=!entryOpen;_drawWb();};
                  etop.appendChild(eBtn);
                  er2.appendChild(etop);
                  if(entryOpen){
                    // 可编辑的条目名称
                    var nameRow=_div('');nameRow.style.cssText='display:flex;gap:6px;align-items:center;margin-bottom:6px;';
                    var nameLbl=_div('');nameLbl.style.cssText='font-size:11px;color:rgba(255,255,255,.38);flex-shrink:0;';nameLbl.textContent='标题';
                    var nameInp=TOPDOC.createElement('input');nameInp.className='ppfi';nameInp.value=en.name||'';nameInp.style.cssText='flex:1;font-size:12px;';
                    nameInp.addEventListener('change',function(){
                      en.name=this.value.trim()||'未命名';
                      _W();_saveWorldBook(book);
                    });
                    nameRow.appendChild(nameLbl);nameRow.appendChild(nameInp);
                    er2.appendChild(nameRow);
                    
                    // 可编辑的内容
                    var taLbl=_div('');taLbl.style.cssText='font-size:11px;color:rgba(255,255,255,.38);margin-bottom:4px;';taLbl.textContent='内容';
                    er2.appendChild(taLbl);
                    var eTa=TOPDOC.createElement('textarea');eTa.className='ppfi';eTa.rows=6;
                    // 正文优先会话缓存（内容已瘦身不落盘），缓存缺失则异步从酒馆补拉填充
                    var cachedContent=(_ui.wbContentMap&&_ui.wbContentMap[book.id]&&_ui.wbContentMap[book.id][en._stEntryKey]);
                    eTa.value=(typeof cachedContent==='string')?cachedContent:(en.content||'');
                    if(typeof cachedContent!=='string'){
                      _getWbEntryContent(book.id, en._stEntryKey, function(c){
                        if(eTa.isConnected){eTa.value=c;}
                      });
                    }
                    eTa.style.cssText='font-size:12px;line-height:1.5;resize:none;';
                    eTa.addEventListener('change',function(){
                      en.content=this.value;
                      _W();_saveWorldBook(book);
                    });
                    er2.appendChild(eTa);
                    
                    // 删除按钮
                    var delBtn=TOPDOC.createElement('button');delBtn.textContent='删除此条目';
                    delBtn.style.cssText='margin-top:8px;width:100%;padding:6px;background:rgba(255,82,82,.15);color:#ff8a8a;border:.5px solid rgba(255,82,82,.3);border-radius:8px;font-size:11px;cursor:pointer;';
                    delBtn.onclick=function(e){
                      e.stopPropagation();
                      if(!confirm('确定删除这条世界书条目吗？'))return;
                      book.entries=book.entries.filter(x=>x.id!==en.id);
                      _W();_saveWorldBook(book);_drawWb();
                    };
                    er2.appendChild(delBtn);
                  }
                  card.appendChild(er2);
                });
                
                // 每本书最后加新增条目按钮
                var addRow=_div('pprow');addRow.style.cssText='padding:10px 14px;justify-content:center;cursor:pointer;color:rgba(255,126,179,.7);font-size:12px;';
                addRow.textContent='+ 新增条目';
                addRow.onclick=function(e){
                  e.stopPropagation();
                  var newKey = String(Date.now());
                  book.entries.push({
                    id:'wb_' + book.name + '_' + newKey,
                    _stEntryKey:newKey,
                    name:'新条目',
                    content:'',
                    enabled:true,
                    keys:[],
                    insertion_order:100,
                    _stBookName:book.name
                  });
                  _W();_saveWorldBook(book);
                  // 自动展开新书
                  if(!_ui.wbEntryOpen)_ui.wbEntryOpen={};
                  _ui.wbEntryOpen['wb_'+book.name+'_'+newKey]=true;
                  _drawWb();
                };
                card.appendChild(addRow);
              }
              body.appendChild(card);
            });
          }
        }
        TOP._ppwbRedraw=_drawWb;
        _drawWb();
        scr.appendChild(pg);
      }

      /* ════════ SETTINGS: TTS ════════ */
      function _pgSTts(){
        var pg=_div('pppg ppsl');pg.appendChild(_navbar('TTS 语音合成','settings'));
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:4px 0 20px;';
        body.appendChild(_div('ppsec','全局开关'));
        var c1=_div('ppcard');
        var togRow=_div('pprow');togRow.style.cursor='default';
        togRow.appendChild(_div('pprb','<div class="pprt">启用 TTS 语音合成</div>'));
        togRow.appendChild(_tog(_sbS.ttsEnabled,function(v){_sbS.ttsEnabled=v;_W();}));
        c1.appendChild(togRow);
        /* 默认引擎选择 */
        var engRow=_div('pprow');engRow.style.padding='12px 14px';engRow.style.cursor='default';
        engRow.appendChild(_div('pprb','<div class="pprt" style="font-size:14px;">默认引擎</div><div class="pprs">角色未单独指定时使用的引擎</div>'));
        var engSel=TOPDOC.createElement('select');
        engSel.className='ppfi';engSel.style.cssText='max-width:150px;font-size:13px;';
        [['minimax','MiniMax'],['fishaudio','Fish Audio']].forEach(function(o){
          var opt=TOPDOC.createElement('option');opt.value=o[0];opt.textContent=o[1];
          if((_sbS.ttsProvider||'minimax')===o[0])opt.selected=true;
          engSel.appendChild(opt);
        });
        engSel.addEventListener('mousedown',function(e){e.stopPropagation();});
        engSel.addEventListener('change',function(){_sbS.ttsProvider=this.value;_W();});
        engRow.appendChild(engSel);c1.appendChild(engRow);
        body.appendChild(c1);
        body.appendChild(_div('ppsec','MiniMax API'));
        var c2=_div('ppcard');
        /* Group ID */
        var _tGRow=_div('pprow');_tGRow.style.cssText='flex-direction:column;align-items:stretch;padding:12px 14px;gap:6px;';
        var _tGLbl=_div('');_tGLbl.style.cssText='font-size:11px;color:rgba(255,255,255,.38);font-weight:500;';_tGLbl.textContent='Group ID';
        var _tGInp=TOPDOC.createElement('input');_tGInp.className='ppfi';_tGInp.type='text';_tGInp.placeholder='xxxxxxxxxx';_tGInp.value=_sbS.ttsGroupId||'';
        _tGInp.addEventListener('mousedown',function(e){e.stopPropagation();});
        _tGInp.addEventListener('change',function(){_sbS.ttsGroupId=this.value.trim();_W();});
        _tGRow.appendChild(_tGLbl);_tGRow.appendChild(_tGInp);c2.appendChild(_tGRow);
        c2.appendChild((function(){var s=_div('');s.style.cssText='height:.5px;background:rgba(255,255,255,.06);margin:0 14px;';return s;})());
        /* API Key */
        var _tKRow=_div('pprow');_tKRow.style.cssText='flex-direction:column;align-items:stretch;padding:12px 14px;gap:6px;';
        var _tKLbl=_div('');_tKLbl.style.cssText='font-size:11px;color:rgba(255,255,255,.38);font-weight:500;';_tKLbl.textContent='API Key';
        var _tKInp=TOPDOC.createElement('input');_tKInp.className='ppfi';_tKInp.type='password';_tKInp.placeholder='MiniMax API Key';_tKInp.value=_sbS.ttsApiKey||'';
        _tKInp.addEventListener('mousedown',function(e){e.stopPropagation();});
        _tKInp.addEventListener('change',function(){_sbS.ttsApiKey=this.value.trim();_W();});
        _tKRow.appendChild(_tKLbl);_tKRow.appendChild(_tKInp);c2.appendChild(_tKRow);
        c2.appendChild((function(){var s=_div('');s.style.cssText='height:.5px;background:rgba(255,255,255,.06);margin:0 14px;';return s;})());
        /* API Host */
        var _tHRow=_div('pprow');_tHRow.style.cssText='flex-direction:column;align-items:stretch;padding:12px 14px;gap:6px;';
        var _tHLbl=_div('');_tHLbl.style.cssText='font-size:11px;color:rgba(255,255,255,.38);font-weight:500;';_tHLbl.textContent='API Host';
        var _tHInp=TOPDOC.createElement('input');_tHInp.className='ppfi';_tHInp.type='url';_tHInp.placeholder='https://api.minimax.chat';_tHInp.value=_sbS.ttsApiHost||'';
        _tHInp.addEventListener('mousedown',function(e){e.stopPropagation();});
        _tHInp.addEventListener('change',function(){_sbS.ttsApiHost=this.value.trim();_W();});
        _tHRow.appendChild(_tHLbl);_tHRow.appendChild(_tHInp);c2.appendChild(_tHRow);
        c2.appendChild((function(){var s=_div('');s.style.cssText='height:.5px;background:rgba(255,255,255,.06);margin:0 14px;';return s;})());
        /* TTS 模型 + 拉取 */
        var _tMRow=_div('pprow');_tMRow.style.cssText='padding:12px 14px;flex-wrap:wrap;gap:8px;align-items:center;';
        _tMRow.appendChild(_div('pprb','<div class="pprt">语音模型</div>'));
        var _tMSel=TOPDOC.createElement('select');_tMSel.className='ppfi';_tMSel.style.cssText='max-width:180px;font-size:13px;flex:1;';
        var _defTtsMdl=['speech-2.8-hd','speech-2.8-turbo','speech-2.6-hd','speech-2.6-turbo','speech-2.5-hd-preview','speech-2.5-turbo-preview','speech-02-hd','speech-02-turbo','speech-02','speech-01-hd','speech-01','speech-01-turbo'];
        function _fillTtsMdl(list){
          _tMSel.innerHTML='';
          list.forEach(function(m){var o=TOPDOC.createElement('option');o.value=m;o.textContent=m;if((_sbS.ttsModel||'speech-02-hd')===m)o.selected=true;_tMSel.appendChild(o);});
        }
        _fillTtsMdl(_defTtsMdl);
        _tMSel.addEventListener('mousedown',function(e){e.stopPropagation();});
        _tMSel.addEventListener('change',function(){_sbS.ttsModel=this.value;_W();});
        var _tFBtn=TOPDOC.createElement('button');
        _tFBtn.textContent='拉取';
        _tFBtn.style.cssText='padding:4px 12px;font-size:11px;font-weight:500;background:rgba(255,255,255,.10);color:rgba(255,255,255,.75);border:.5px solid rgba(255,255,255,.22);border-radius:10px;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;transition:background .12s;';
        _tFBtn.addEventListener('mouseenter',function(){_tFBtn.style.background='rgba(255,255,255,.18)';});
        _tFBtn.addEventListener('mouseleave',function(){_tFBtn.style.background='rgba(255,255,255,.10)';});
        _tFBtn.addEventListener('click',function(e){
          e.stopPropagation();
          var host=(_sbS.ttsApiHost||'https://api.minimax.chat').replace(/\/+$/,'');
          var key=_sbS.ttsApiKey||'';
          var gid=_sbS.ttsGroupId||'';
          if(!key){TOP.alert('请先填写 API Key');return;}
          _tFBtn.textContent='获取中…';_tFBtn.disabled=true;
          var url=host+'/v1/models'+(gid?'?GroupId='+gid:'');
          TOP.fetch(url,{method:'GET',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'}})
          .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
          .then(function(data){
            var models=[];
            var list=data.data||data.models||data.result||[];
            list.forEach(function(m){
              var id=typeof m==='string'?m:(m.id||m.model_id||m.name||'');
              if(id&&(id.indexOf('speech')>=0||id.indexOf('tts')>=0||id.indexOf('t2a')>=0))models.push(id);
            });
            _defTtsMdl.forEach(function(m){if(models.indexOf(m)<0)models.push(m);});
            models=models.filter(function(v,i,a){return a.indexOf(v)===i;});
            _fillTtsMdl(models);
            _tFBtn.textContent='✓ 已拉取('+models.length+')';_tFBtn.disabled=false;
          })
          .catch(function(err){
            _fillTtsMdl(_defTtsMdl);
            _tFBtn.textContent='拉取';_tFBtn.disabled=false;
            TOP.alert('拉取失败('+err.message+'\n已恢复默认列表');
          });
        });
        _tMRow.appendChild(_tMSel);_tMRow.appendChild(_tFBtn);c2.appendChild(_tMRow);
        body.appendChild(c2);
        /* ── Fish Audio ── */
        body.appendChild(_div('ppsec','Fish Audio（经本地代理 8765）'));
        var c3=_div('ppcard');
        function _fRow(lbl,ph,val){
          var r=_div('pprow');r.style.cssText='flex-direction:column;align-items:stretch;padding:12px 14px;gap:6px;';
          var l=_div('');l.style.cssText='font-size:11px;color:rgba(255,255,255,.38);font-weight:500;';l.textContent=lbl;
          var i=TOPDOC.createElement('input');i.className='ppfi';i.type='text';i.placeholder=ph;i.value=val||'';
          i.addEventListener('mousedown',function(e){e.stopPropagation();});
          r.appendChild(l);r.appendChild(i);c3.appendChild(r);
          c3.appendChild((function(){var s=_div('');s.style.cssText='height:.5px;background:rgba(255,255,255,.06);margin:0 14px;';return s;})());
          return i;
        }
        function _fSelect(lbl,opts,cur,onCh){
          var r=_div('pprow');r.style.padding='12px 14px';r.style.cursor='default';
          r.appendChild(_div('pprb','<div class="pprt" style="font-size:14px;">'+lbl+'</div>'));
          var s=TOPDOC.createElement('select');s.className='ppfi';s.style.cssText='max-width:170px;font-size:13px;';
          opts.forEach(function(o){
            var opt=TOPDOC.createElement('option');opt.value=o[0];opt.textContent=o[1];
            if((cur||'')===o[0])opt.selected=true;
            s.appendChild(opt);
          });
          s.addEventListener('mousedown',function(e){e.stopPropagation();});
          s.addEventListener('change',function(){onCh(this.value);});
          r.appendChild(s);c3.appendChild(r);
          return s;
        }
        var _fKInp=_fRow('API Key','Fish Audio API Key（api.fish.audio 获取）',_sbS.fishApiKey);
        _fKInp.type='password';
        _fKInp.addEventListener('change',function(){_sbS.fishApiKey=this.value.trim();_W();});
        var _fM=_fSelect('模型',[['s2.1-pro-free','s2.1-pro-free（免费）'],['s2.1-pro','s2.1-pro'],['s2.2-pro','s2.2-pro'],['s1.5-pro','s1.5-pro'],['s1.5-flash','s1.5-flash']],_sbS.fishModel||'s2.1-pro-free',function(v){_sbS.fishModel=v;_W();});
        var _fL=_fSelect('延迟',[['balanced','balanced（均衡）'],['low','low（低延迟）'],['high','high（高音质）']],_sbS.fishLatency,function(v){_sbS.fishLatency=v;_W();});
        var _fTRow=_fRow('温度（可选）','0~1，留空不传',_sbS.fishTemperature);
        _fTRow.type='number';_fTRow.step='0.1';_fTRow.min='0';_fTRow.max='1';
        _fTRow.addEventListener('change',function(){_sbS.fishTemperature=this.value.trim();_W();});
        var _fPRow=_fRow('Top P（可选）','0~1，留空不传',_sbS.fishTopP);
        _fPRow.type='number';_fPRow.step='0.1';_fPRow.min='0';_fPRow.max='1';
        _fPRow.addEventListener('change',function(){_sbS.fishTopP=this.value.trim();_W();});
        var _fPortRow=_fRow('代理端口','默认 8765',_sbS.fishProxyPort||'8765');
        _fPortRow.type='number';
        _fPortRow.addEventListener('change',function(){_sbS.fishProxyPort=this.value.trim()||'8765';_W();});
        var _fHostRow=_fRow('代理主机 / IP（可选）','留空自动使用酒馆页面地址',_sbS.fishProxyHost);
        _fHostRow.addEventListener('change',function(){_sbS.fishProxyHost=this.value.trim();_W();});
        body.appendChild(c3);
        pg.appendChild(body);scr.appendChild(pg);
      }

      /* ════════ SETTINGS: VOICE CALL PRESET ════════ */
      function _defaultVcPrompt(){return'你正在扮演{{角色名称}}与{{用户名称}}进行对话。\n【角色设定】\n{{角色设定}}\n【用户设定】\n{{用户设定}}\n【世界背景信息】\n{{世界书}}\n【当前{{用户名称}}经历信息】\n{{酒馆历史}}\n请用简短自然的口语风格回复，30字以内，不使用任何 Markdown 格式，只说话不描述动作。';}
      function _pgSVc(){
        var pg=_div('pppg ppsl');pg.appendChild(_navbar('语音通话预设','settings'));
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:4px 12px 20px;';
        body.appendChild(_div('ppsec','可用变量（点击插入光标处）'));
        var vw=_div('');vw.style.cssText='display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;';
        [['{{角色名称}}','角色名字'],['{{角色设定}}','角色人设'],['{{用户名称}}','用户名字'],
         ['{{用户设定}}','用户人设'],['{{角色状态}}','最新状态'],['{{世界书}}','激活条目'],['{{当前时间}}','日期时间']
        ].forEach(function(v){
          var b=_div('');b.style.cssText='padding:3px 9px;background:rgba(255,255,255,.07);border:.5px solid rgba(255,255,255,.12);border-radius:20px;font-size:11px;color:rgba(255,255,255,.6);cursor:pointer;';
          b.textContent=v[0];b.title=v[1];
          b.addEventListener('mousedown',function(e){e.stopPropagation();});
          b.addEventListener('click',function(){
            var ta=TOPDOC.getElementById('ppvc-ta');if(!ta)return;
            var s=ta.selectionStart,e2=ta.selectionEnd;
            ta.value=ta.value.slice(0,s)+v[0]+ta.value.slice(e2);
            ta.selectionStart=ta.selectionEnd=s+v[0].length;ta.focus();
            _sbS.vcSystemPrompt=ta.value;_W();
          });vw.appendChild(b);
        });
        body.appendChild(vw);
        body.appendChild(_div('ppsec','系统提示词'));
        var ta=TOPDOC.createElement('textarea');ta.id='ppvc-ta';ta.className='ppta';
        ta.style.height='165px';ta.value=_sbS.vcSystemPrompt||_defaultVcPrompt();
        ta.addEventListener('mousedown',function(e){e.stopPropagation();});
        ta.addEventListener('input',function(){_sbS.vcSystemPrompt=this.value;_W();});
        body.appendChild(ta);
        /* ── 提示词预设栏 ── */
        var presetBar=_div('');presetBar.style.cssText='display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:6px 0 2px;';
        var savePBtn=TOPDOC.createElement('button');
        savePBtn.textContent='保存预设';
        savePBtn.style.cssText='padding:4px 12px;font-size:11px;background:rgba(255,255,255,.10);color:rgba(255,255,255,.70);border:.5px solid rgba(255,255,255,.20);border-radius:10px;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;transition:background .12s;';
        savePBtn.addEventListener('mouseenter',function(){savePBtn.style.background='rgba(255,255,255,.18)';});
        savePBtn.addEventListener('mouseleave',function(){savePBtn.style.background='rgba(255,255,255,.10)';});
        function _renderPresetPills(){
          while(presetBar.children.length>1)presetBar.removeChild(presetBar.lastChild);
          var presets=_sbS.vcPromptPresets||[];
          presets.forEach(function(p,pi){
            var pill=TOPDOC.createElement('span');
            pill.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:3px 10px;font-size:11px;background:rgba(255,255,255,.09);color:rgba(255,255,255,.72);border:.5px solid rgba(255,255,255,.18);border-radius:20px;cursor:pointer;max-width:140px;';
            var lbl=TOPDOC.createElement('span');lbl.style.cssText='overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';lbl.textContent=p.name;
            var x=TOPDOC.createElement('span');x.textContent='×';x.style.cssText='flex-shrink:0;font-size:13px;line-height:1;color:rgba(255,255,255,.40);margin-left:2px;';
            pill.appendChild(lbl);pill.appendChild(x);
            lbl.addEventListener('click',function(ev){ev.stopPropagation();
              var t=TOPDOC.getElementById('ppvc-ta');if(t){t.value=p.content;_sbS.vcSystemPrompt=p.content;_W();}
            });
            x.addEventListener('click',function(ev){ev.stopPropagation();
              (_sbS.vcPromptPresets||[]).splice(pi,1);_W();_renderPresetPills();
            });
            presetBar.appendChild(pill);
          });
        }
        savePBtn.addEventListener('click',function(e){e.stopPropagation();
          var nm=TOP.prompt('预设名称：');if(!nm||!nm.trim())return;
          var cur=TOPDOC.getElementById('ppvc-ta');var val=cur?cur.value:(_sbS.vcSystemPrompt||'');
          if(!_sbS.vcPromptPresets)_sbS.vcPromptPresets=[];
          _sbS.vcPromptPresets.push({name:nm.trim(),content:val});_W();
          _renderPresetPills();
        });
        presetBar.appendChild(savePBtn);
        _renderPresetPills();
        body.appendChild(presetBar);
        body.appendChild(_div('ppsec','上下文轮数'));
        var dRow=_div('');dRow.style.cssText='display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.055);border:.5px solid rgba(255,255,255,.08);border-radius:12px;padding:10px 14px;margin-bottom:10px;';
        dRow.appendChild(_div('','<span style="font-size:14px;color:rgba(255,255,255,.85)">注入最近轮数</span>'));
        var di=TOPDOC.createElement('input');di.type='number';di.min='1';di.max='20';di.value=_sbS.vcContextDepth||6;
        di.style.cssText='width:44px;text-align:center;background:rgba(255,255,255,.1);border:.5px solid rgba(255,255,255,.12);border-radius:8px;color:rgba(255,255,255,.88);padding:4px;font-size:14px;font-family:inherit;outline:none;';
        di.addEventListener('mousedown',function(e){e.stopPropagation();});
        di.addEventListener('change',function(){_sbS.vcContextDepth=parseInt(this.value)||6;_W();});
        dRow.appendChild(di);body.appendChild(dRow);
        var rst=_div('ppbtn del','');rst.innerHTML='恢复默认提示词';rst.style.width='100%';rst.style.boxSizing='border-box';
        rst.addEventListener('click',function(){_sbS.vcSystemPrompt=_defaultVcPrompt();_W();var t=TOPDOC.getElementById('ppvc-ta');if(t)t.value=_sbS.vcSystemPrompt;});
        body.appendChild(rst);pg.appendChild(body);scr.appendChild(pg);
      }

      /* ════════ SETTINGS: PLUGIN FIELDS ════════ */
      function _pgSPlugin(){
        var app=_nav.data&&_nav.data.app;if(!app){_go('settings');return;}
        var pg=_div('pppg ppsl');pg.appendChild(_navbar(app.settingsTitle||app.name,'settings'));
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:4px 0 20px;';
        if(!app.settingsFields||!app.settingsFields.length){
          body.appendChild(_div('','<div style="padding:30px;text-align:center;font-size:13px;color:rgba(255,255,255,.3)">该应用无设置项</div>'));
        } else {
          var groups={};var order=[];
          (app.settingsFields||[]).forEach(function(f){
            var g=f.group||'配置';if(!groups[g]){groups[g]=[];order.push(g);}groups[g].push(f);
          });
          if(!app.settingsValues)app.settingsValues={};
          order.forEach(function(g){
            var hdr=_div('ppsec');
            hdr.style.cssText+='cursor:pointer;user-select:none;-webkit-user-select:none;display:flex;align-items:center;gap:4px;';
            var arr=TOPDOC.createElement('span');arr.style.cssText='display:inline-block;font-size:10px;transition:transform .18s;flex-shrink:0;';arr.textContent='▾';
            hdr.appendChild(arr);hdr.appendChild(TOPDOC.createTextNode(g));
            var c=_div('ppcard');
            groups[g].forEach(function(f){c.appendChild(_fieldRow(f,app.settingsValues));});
            var _collapsed=false;
            hdr.addEventListener('click',function(){
              _collapsed=!_collapsed;
              c.style.display=_collapsed?'none':'';
              arr.style.transform=_collapsed?'rotate(-90deg)':'rotate(0deg)';
            });
            body.appendChild(hdr);
            body.appendChild(c);
          });
        }
        pg.appendChild(body);scr.appendChild(pg);
      }

      /* ════════ SETTINGS: APP MANAGEMENT ════════ */
      function _pgSApps(){
        var pg=_div('pppg ppsl');pg.appendChild(_navbar('已安装应用','settings'));
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:4px 0 20px;';
        var apps=_sbS.ppApps||[];
        if(!apps.length){
          body.appendChild(_div('','<div style="padding:40px;text-align:center;font-size:13px;color:rgba(255,255,255,.3)">暂无已安装应用<br><span style="font-size:11px;color:rgba(255,255,255,.2)">在主屏点击「应用商城」添加</span></div>'));
        } else {
          body.appendChild(_div('ppsec','应用列表'));
          var c=_div('ppcard');
          apps.forEach(function(app,i){
            var r=_div('pprow');r.style.cursor='default';
            r.appendChild(_div('ppic','<svg width="16" height="16" viewBox="0 0 24 24" style="stroke:rgba(255,255,255,.65);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;">'+app.icon+'</svg>'));
            var bd=_div('pprb');
            bd.appendChild(_div('pprt',app.name));
            bd.appendChild(_div('pprs','v'+app.version+' · '+(app.injectEnabled?'注入已开':'')+(app.injectEnabled&&app.settingsFields&&app.settingsFields.length?' · ':'')+((app.settingsFields&&app.settingsFields.length)?'有设置项':'')));
            r.appendChild(bd);
            var tog=_tog(app.enabled,function(v){
              app.enabled=v;_W();
              _render();
            });
            r.appendChild(tog);
            c.appendChild(r);
          });
          body.appendChild(c);
        }
        pg.appendChild(body);scr.appendChild(pg);
      }

      /* ════════ APP STORE / MANAGER ════════ */
      function _pgStore(){
        var pg=_div('pppg ppsl');pg.appendChild(_navbar('应用商城','home'));
        var body=_div('');body.style.cssText='flex:1;overflow-y:auto;padding:4px 0 20px;';

        /* 导入按钮 */
        var fileInput=TOPDOC.createElement('input');fileInput.type='file';fileInput.accept='.json';fileInput.style.display='none';
        fileInput.addEventListener('change',function(){
          var f=this.files&&this.files[0];if(!f)return;
          var reader=new TOP.FileReader();
          reader.onload=function(e){
            try{
              var p=JSON.parse(e.target.result);
              if(!p.ppPlugin)throw new Error('不是有效的 Phone Panel 插件文件');
              if(!p.id||!p.name)throw new Error('缺少 id 或 name 字段');
              var apps=_sbS.ppApps||[];
              var idx=apps.findIndex?apps.findIndex(function(a){return a.id===p.id;}):
                (function(){for(var i=0;i<apps.length;i++)if(apps[i].id===p.id)return i;return -1;})();
              var entry={id:p.id,name:p.name,version:p.version||'1.0',description:p.description||'',
                icon:p.icon||'<circle cx="12" cy="12" r="5"/>',enabled:true,
                settingsTitle:p.settingsTitle||p.name,settingsFields:p.settingsFields||[],
                settingsValues:idx>=0?apps[idx].settingsValues:{},
                pageCode:p.pageCode||'',injectCode:p.injectCode||'',injectEnabled:!!(p.injectEnabled)};
              (p.settingsFields||[]).forEach(function(f){if(entry.settingsValues[f.key]===undefined&&f.default!==undefined)entry.settingsValues[f.key]=f.default;});
              if(idx>=0)apps[idx]=entry;else apps.push(entry);
              _sbS.ppApps=apps;_W();_render();
              _toast('已导入: '+p.name);
            }catch(err){_toast('导入失败: '+err.message);}
          };reader.readAsText(f);
        });
        pg.appendChild(fileInput);

        var importBtn=_div('');importBtn.style.cssText='margin:12px 16px;padding:14px;border-radius:12px;background:linear-gradient(135deg,#ff7eb3,#ff5c8a);color:#fff;text-align:center;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 2px 8px rgba(255,92,138,.3);';
        importBtn.textContent='导入插件 App (.json)';
        importBtn.addEventListener('click',function(){fileInput.click();});
        body.appendChild(importBtn);

        /* 已安装应用列表（带删除） */
        var apps=_sbS.ppApps||[];
        body.appendChild(_div('ppsec','已安装 ('+apps.length+')'));
        var c=_div('ppcard');
        if(!apps.length){
          c.appendChild(_div('','<div style="padding:30px;text-align:center;font-size:12px;color:rgba(255,255,255,.3)">还没有安装任何应用</div>'));
        } else {
          apps.forEach(function(app,i){
            var r=_div('pprow');r.style.cursor='default';
            r.appendChild(_div('ppic','<svg width="16" height="16" viewBox="0 0 24 24" style="stroke:rgba(255,255,255,.65);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;">'+app.icon+'</svg>'));
            var bd=_div('pprb');
            bd.appendChild(_div('pprt',app.name));
            bd.appendChild(_div('pprs','v'+app.version+(app.description?' · '+app.description:'')));
            r.appendChild(bd);
            var del=_div('');del.style.cssText='width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,100,100,.6);margin-left:6px;flex-shrink:0;';
            del.innerHTML=_svg('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>',15);
            del.addEventListener('click',function(){
              if(!confirm('确定删除「'+app.name+'」？'))return;
              apps.splice(i,1);_sbS.ppApps=apps;_W();_render();
              _toast('已删除: '+app.name);
            });
            r.appendChild(del);
            c.appendChild(r);
          });
        }
        body.appendChild(c);
        pg.appendChild(body);scr.appendChild(pg);
      }

      /* ════════ PLUGIN APP PAGE ════════ */
      function _pgAppRun(){
        var app=_nav.data&&_nav.data.app;if(!app||!app.pageCode){_go('home');return;}
        var pg=_div('pppg ppsl');
        try{
          var ctx=_makePluginCtx(app);
          ctx.back=function(){_go('home');};
          ctx.go=_go;
          ctx.div=function(cls,html){return _div(cls,html);};
          ctx.el=function(tag,cls,html){return _el(tag,cls,html);};
          ctx.svg=_svg;
          var fn=new TOP.Function('ctx','return('+app.pageCode+')(ctx);');
          var content=fn(ctx);
          pg.appendChild(_navbar(app.name,'home'));
          if(content)pg.appendChild(content);
        }catch(e){
          pg.appendChild(_navbar(app.name,'home'));
          pg.appendChild(_div('','<div style="padding:20px;font-size:12px;color:rgba(255,255,255,.75)">App 运行错误:<br>'+e.message+'</div>'));
        }
        scr.appendChild(pg);
      }

      /* ════════ ROUTER ════════ */
      var _pages={
        home:_pgHome, settings:_pgSettings,
        contacts:_pgContacts,'contact-detail':_pgContactDetail,'contact-new':_pgContactNew,'contact-add':_pgContactAdd,
        's-api':_pgSApi,'s-chars':_pgSChars,'s-presets':_pgSPresets,'s-wb':_pgSWb,
        'worldbook':_pgSWb,
        'chats':_pgChats,'chat-detail':_pgChatDetail,'chat-archives':_pgChatArchives,'chat-style':_pgChatStyle,
        's-tts':_pgSTts,'s-vc':_pgSVc,'s-plugin':_pgSPlugin,'s-apps':_pgSApps,'s-glass':_pgSGlass,
        'app-run':_pgAppRun,
        'store':_pgStore,
      };
      var _firstRender=true;
      var _isBack=false;
      // 无动画刷新当前页面：后台数据更新后调用，直接重绘当前页，不做页面滑动
      function _refreshNoAnim(){
        var _s = TOP._ppscr;
        if(!_s) return;
        var oldEl = _s.lastElementChild;
        /* 记录滚动位置：无动画刷新后恢复，避免 TTS 设置等场景改完跳回页面顶部 */
        var _scrollTop = 0;
        if(oldEl){
          var _scOld = oldEl.querySelector('div[style*="overflow-y:auto"]');
          if(_scOld) _scrollTop = _scOld.scrollTop;
        }
        try{
          (_pages[_nav.page] || _pgHome)();
        }catch(e){
          console.error('[PhonePanel] refresh error:', e);
          return;
        }
        var newEl = _s.lastElementChild;
        // 无动画刷新：移除新页的滑入动画 class，避免重建后 .ppsl 自动播放（TTS 设置改动/世界书拉取完成等场景的“弹动画”）
        if(newEl) newEl.classList.remove('ppsl');
        // 直接删掉旧元素，不做任何动画
        if(oldEl && oldEl !== newEl && oldEl.parentNode){
          oldEl.parentNode.removeChild(oldEl);
        }
        /* 恢复滚动位置 */
        if(_scrollTop > 0 && newEl){
          var _scNew = newEl.querySelector('div[style*="overflow-y:auto"]');
          if(_scNew) _scNew.scrollTop = _scrollTop;
        }
      }
      // 暴露给外层（_pullSTUser/_pullAllWorldBooks 等在更外层作用域，访问不到本层函数）
      TOP._pprefresh = function(){ _refreshNoAnim(); };
      function _render(){
        var _s=TOP._ppscr||scr;
        var oldEl=_s.lastElementChild;
        var goingBack=_isBack;_isBack=false;
        try{(_pages[_nav.page]||_pgHome)();}catch(e){console.error('[PhonePanel]',_nav.page,e);return;}
        var newEl=_s.lastElementChild;
        /* 首次渲染不播动画，直接清掉旧页和新页的动画class */
        if(_firstRender){_firstRender=false;if(oldEl&&oldEl.parentNode)oldEl.parentNode.removeChild(oldEl);if(newEl)newEl.classList.remove('ppsl');return;}
        if(!oldEl||oldEl===newEl){return;}
        if(goingBack){
          /* 返回：旧页向右滑出，新页从左滑入 */
          if(newEl){
            newEl.classList.remove('ppsl');
            newEl.style.cssText+='transform:translateX(-30%);opacity:0.5;transition:none;';
          }
          requestAnimationFrame(function(){requestAnimationFrame(function(){
            if(newEl){
              newEl.style.transition='transform .24s cubic-bezier(.4,0,.2,1),opacity .2s';
              newEl.style.transform='translateX(0)';
              newEl.style.opacity='1';
            }
            oldEl.style.transition='transform .24s cubic-bezier(.4,0,.2,1),opacity .2s';
            oldEl.style.transform='translateX(100%)';
            oldEl.style.opacity='0';
            TOP.setTimeout(function(){if(oldEl&&oldEl.parentNode)oldEl.parentNode.removeChild(oldEl);},260);
          });});
        } else {
          /* 进入：新页从右滑入，旧页向左淡出 */
          if(newEl){
            newEl.classList.remove('ppsl');
            newEl.style.cssText+='transform:translateX(100%);transition:none;will-change:transform;';
          }
          requestAnimationFrame(function(){requestAnimationFrame(function(){
            if(newEl){
              newEl.style.transition='transform .24s cubic-bezier(.4,0,.2,1)';
              newEl.style.transform='translateX(0)';
            }
            oldEl.style.transition='transform .24s cubic-bezier(.4,0,.2,1),opacity .2s';
            oldEl.style.transform='translateX(-30%)';
            oldEl.style.opacity='0';
            TOP.setTimeout(function(){
              if(oldEl.parentNode)oldEl.parentNode.removeChild(oldEl);
              if(newEl){newEl.style.transition='';newEl.style.willChange='';}
            },260);
          });});
        }
      }
      TOP._pprender=_render;

      /* 一次性清理：聊天数据源已切到酒馆 jsonl，本地 _sbS.history 整个废弃（含假数据和测试消息） */
      try{
        if(_sbS.history&&Object.keys(_sbS.history).length){
          _sbS.history={};_W();
        }
      }catch(e){}

      /* 执行所有 enabled 插件的 injectCode */
      try{
        (_sbS.ppApps||[]).filter(function(a){return a.enabled;}).forEach(function(app){
          if(!app.injectCode) return;
          try{
            var ctx=_makePluginCtx(app);
            /* injectCode 是 (function(ctx){...}) 形式，需要调用它 */
            (new Function('ctx', '(' + app.injectCode + ')(ctx);'))(ctx);
          }catch(e){ console.warn('插件执行失败:', app.name, e); }
        });
      }catch(e){}

      _render();

      var wrap=TOPDOC.createElement('div');wrap.style.cssText='flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;';
      wrap.appendChild(shell);return wrap;
    }


    // ── Tab: Presets ─────────────────────────────────────
    function _renderPresetsTab(){
      var f=TOPDOC.createDocumentFragment();
      var irow=_row();irow.style.gap='6px;flex-wrap:wrap';
      // 新建预设
      var newPBtn=_pbtn('+ 新建','blue');
      newPBtn.addEventListener('click',function(e){
        e.stopPropagation();
        var np={id:_uuid(),name:'新预设',promptSuffix:'',regexPattern:'',replacePattern:''};
        _sbS.presets.push(np);_sbS.activePresetId=np.id;
        _ui.editPresetId=np.id;_W();_renderTab();
      });
      // 导出当前预设
      var expPBtn=_pbtn('导出预设','default');
      expPBtn.addEventListener('click',function(e){
        e.stopPropagation();
        var ap=_ap();if(!ap){_toast('无激活预设');return;}
        try{
          var blob=new TOP.Blob([JSON.stringify(ap,null,2)],{type:'application/json'});
          var url=TOP.URL.createObjectURL(blob);
          var a=TOPDOC.createElement('a');
          a.href=url;a.download=(ap.name||'preset')+'.json';
          TOPDOC.body.appendChild(a);a.click();TOPDOC.body.removeChild(a);
          TOP.URL.revokeObjectURL(url);_toast('预设已导出');
        }catch(err){_toast('导出失败');}
      });
      var impBtn=_pbtn('导入 JSON','blue');
      var impFile=TOPDOC.createElement('input');impFile.type='file';impFile.accept='.json';impFile.style.display='none';
      impBtn.addEventListener('click',function(e){e.stopPropagation();impFile.click();});
      impFile.addEventListener('change',function(){
        var file=this.files[0];if(!file)return;
        var reader=new TOP.FileReader();
        reader.onload=function(ev){
          try{
            var p=JSON.parse(ev.target.result);
            if(!p.replacePattern)throw new Error('缺少 replacePattern');
            var preset={id:_uuid(),name:p.name||file.name.replace(/\.json$/i,''),promptSuffix:p.promptSuffix||'',regexPattern:p.regexPattern||'',replacePattern:p.replacePattern};
            _sbS.presets.push(preset);
            if(!_sbS.activePresetId)_sbS.activePresetId=preset.id;
            _W();_renderTab();_toast('预设 "'+preset.name+'" 已导入');
          }catch(err){_toast('格式错误: '+err.message);}
        };
        reader.readAsText(file);this.value='';
      });
      irow.appendChild(newPBtn);irow.appendChild(expPBtn);irow.appendChild(impBtn);irow.appendChild(impFile);
      f.appendChild(irow);

      if(!_sbS.presets.length){
        var em=TOPDOC.createElement('div');
        em.style.cssText='font-size:12px;color:'+C.text3+';padding:16px 0;text-align:center;';
        em.textContent='暂无预设，点击「导入 JSON」';f.appendChild(em);
      } else {
        _sbS.presets.forEach(function(preset){
          var isActive=preset.id===_sbS.activePresetId;
          var isEdit=_ui.editPresetId===preset.id;
          var card=TOPDOC.createElement('div');
          card.style.cssText=
            'background:'+(isActive?'rgba(255,255,255,0.10)':C.surface)+';'
            +'border-radius:14px;overflow:hidden;margin-top:8px;'
            +'border:0.5px solid '+(isActive?'rgba(255,255,255,0.20)':C.border)+';';
          // Header row
          var hr=TOPDOC.createElement('div');
          hr.style.cssText='display:flex;align-items:center;gap:8px;padding:10px 12px;';
          var ns=TOPDOC.createElement('span');
          ns.style.cssText='flex:1;font-size:13px;font-weight:'+(isActive?'600':'400')+';color:'+(isActive?C.blue:C.text2)+';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
          ns.textContent=preset.name;
          var actB=_pbtn(isActive?'✓ 已激活':'激活',isActive?'blue':'default');
          actB.addEventListener('click',function(e){e.stopPropagation();_sbS.activePresetId=preset.id;_W();_renderTab();});
          var edB=_pbtn(isEdit?'收起':'编辑','default');
          edB.addEventListener('click',function(e){e.stopPropagation();_ui.editPresetId=isEdit?null:preset.id;_renderTab();});
          var delB=_pbtn('删除','red');
          delB.addEventListener('click',function(e){
            e.stopPropagation();
            if(!TOP.confirm('删除预设 "'+preset.name+'"？'))return;
            _sbS.presets=_sbS.presets.filter(function(p){return p.id!==preset.id;});
            if(_sbS.activePresetId===preset.id)_sbS.activePresetId=_sbS.presets.length?_sbS.presets[0].id:null;
            _W();_renderTab();
          });
          hr.appendChild(ns);hr.appendChild(actB);hr.appendChild(edB);hr.appendChild(delB);
          card.appendChild(hr);
          if(isEdit){
            var sep=TOPDOC.createElement('div');sep.style.cssText='height:0.5px;background:'+C.border+';margin:0 12px;';
            card.appendChild(sep);
            var ep=TOPDOC.createElement('div');ep.style.cssText='padding:4px 12px 12px;display:flex;flex-direction:column;gap:4px;';
            var nI=_inp('预设名称','text',preset.name);
            var psT=_ta('System Prompt (promptSuffix)',preset.promptSuffix,5);
            var rpT=_ta('提取正则 (regexPattern)',preset.regexPattern,3);
            var htT=_ta('HTML 模板 (replacePattern)',preset.replacePattern,5);
            var sB=_pbtn('保存','green');
            sB.addEventListener('click',function(e){
              e.stopPropagation();
              preset.name=nI.value.trim()||preset.name;
              preset.promptSuffix=psT.value;preset.regexPattern=rpT.value;preset.replacePattern=htT.value;
              _ui.editPresetId=null;_W();_renderTab();_toast('预设已保存');
            });
            var sr=_row();sr.appendChild(sB);
            [_lbl('名称'),nI,_lbl('System Prompt'),psT,_lbl('提取正则'),rpT,_lbl('HTML 模板'),htT,sr]
              .forEach(function(el){ep.appendChild(el);});
            card.appendChild(ep);
          }
          f.appendChild(card);
        });
      }
      var wrap=TOPDOC.createElement('div');wrap.appendChild(f);return wrap;
    }

    // ── Tab: Characters ───────────────────────────────────
    
    // ── 世界书 Tab ───────────────────────────────────────────

    // ── ST Pull helpers ──────────────────────────────────
    function _getSTCtx(){
      try{ return TOP.SillyTavern&&TOP.SillyTavern.getContext?TOP.SillyTavern.getContext():null; }catch(e){ return null; }
    }
    // 自动从酒馆读取 API 配置（仅当本地未配置时）
    function _autoReadSTApi(){
      try{
        var ctx=_getSTCtx();if(!ctx)return;
        if(!_sbS.apiUrl){
          var url='';
          if(ctx.chatCompletionSource==='custom'&&ctx.oai_settings&&ctx.oai_settings.custom_url)
            url=ctx.oai_settings.custom_url;
          else if(ctx.apiServer)
            url=ctx.apiServer;
          if(url){
            if(!/^https?:\/\//.test(url))url='http://'+url;
            url=url.replace(/\/+$/,'');
            _sbS.apiUrl=url;
          }
        }
        if(!_sbS.apiKey){
          var key='';
          if(ctx.apiKey)key=ctx.apiKey;
          else if(ctx.oai_settings&&ctx.oai_settings.custom_key)key=ctx.oai_settings.custom_key;
          if(key)_sbS.apiKey=key;
        }
        if(!_sbS.model){
          var md='';
          if(ctx.oai_settings&&ctx.oai_settings.custom_model)md=ctx.oai_settings.custom_model;
          else if(ctx.oai_settings&&ctx.oai_settings.chat_model)md=ctx.oai_settings.chat_model;
          if(md)_sbS.model=md;
        }
      }catch(e){console.warn('[PhonePanel] auto read api:',e.message);}
    }
    // 拉取用户persona：personaList带id，currentAvatarId是当前真正生效的人设
    function _pullSTUser(onDone){
      Promise.all([
        import('/scripts/power-user.js'),
        import('/scripts/personas.js')
      ]).then(function([puModule, personasModule]){
        var pu = puModule.power_user;
        var stPersonas = pu.personas || {};
        var stPersonaDescs = pu.persona_descriptions || {};
        // 从personas模块里拿当前真正生效的user_avatar（模块导出的变量，不在window上）
        var activeAvatarId = personasModule.user_avatar || pu.default_persona;

        var personaList = [];
        Object.keys(stPersonas).forEach(function(id){
          var name = String(stPersonas[id] || '未命名');
          var d = stPersonaDescs[id] || {};
          var desc = typeof d === 'string' ? d : (d.description || '');
          personaList.push({id: id, name: name, persona: desc});
        });

        var ctx = _getSTCtx();
        if(!personaList.length){
          personaList = [{id:'default', name: (ctx&&ctx.name1) || '用户', persona: ''}];
          activeAvatarId = 'default';
        }

        _sbS.user = _sbS.user || {};
        _sbS.user.name = (ctx&&ctx.name1) || '';
        _sbS.user.personaList = personaList;
        _sbS.user.currentAvatarId = activeAvatarId;
        // 同步 user 头像：persona id 就是头像文件名，URL 与酒馆自己的缩略图规则一致
        _sbS.user.avatar = activeAvatarId ? ('/thumbnail?type=persona&file=' + encodeURIComponent(activeAvatarId)) : '';
        _sbS.user._setUserAvatar = personasModule.setUserAvatar;

        // 拉完数据后：保存配置，然后无动画刷新当前页面，所有persona相关的显示自动更新
        _W();
        if(TOP._pprefresh)TOP._pprefresh(); else try{_refreshNoAnim();}catch(e){}
        if(typeof onDone === 'function') onDone(); 
        else { _renderTab(); _toast('✓ 用户人设已从酒馆拉取'); }
      }).catch(function(e){
        console.warn('拉取人设失败:', e);
        if(!onDone) _toast('拉取人设失败: '+e.message);
      });
    }
    /**
     * 把手机端联系人同步创建为酒馆角色卡。
     * 方式：json 注入 POST /api/characters/create（与 ST /createcharacter 命令同一套协议），
     * 返回的角色头像文件名再通过 /api/characters/edit-avatar 上传头像（dataURL → blob）。
     * @param {Object} nc 本地联系人（name/persona/avatar dataURL）
     * @param {Function} onOk 成功回调(avatarKey)
     * @param {Function} onErr 失败回调(err)
     */
    function _createSTCharacter(nc, onOk, onErr){
      try{
        import('/script.js').then(function(sm){
          var data={
            ch_name: nc.name,
            description: nc.persona||'',
            first_mes: '',
            personality: '',
            scenario: '',
            mes_example: '',
            creator_notes: '',
            system_prompt: '',
            post_history_instructions: '',
            creator: '',
            character_version: '',
            tags: [],
            talkativeness: '0.5',
            world: '',
            depth_prompt_prompt: '',
            depth_prompt_depth: '4',
            depth_prompt_role: 'system',
            fav: 'false',
            alternate_greetings: [],
            extensions: '{}'
          };
          var hdrs=sm.getRequestHeaders?sm.getRequestHeaders():undefined;
          return fetch('/api/characters/create',{method:'POST',headers:hdrs,body:JSON.stringify(data),cache:'no-cache'}).then(function(r){
            if(!r.ok)throw new Error('HTTP '+r.status);
            return r.text();
          }).then(function(avatarKey){
            /* 有本地头像（dataURL）→ 上传到酒馆，让角色卡带头像 */
            if(nc.avatar&&nc.avatar.indexOf('data:')===0){
              return fetch(nc.avatar).then(function(ar){return ar.blob();}).then(function(blob){
                var fd=new TOP.FormData();
                fd.append('avatar',blob,'avatar.png');
                fd.append('avatar_url',avatarKey);
                return fetch('/api/characters/edit-avatar',{method:'POST',headers:sm.getRequestHeaders?sm.getRequestHeaders({omitContentType:true}):undefined,body:fd});
              }).then(function(ur){
                if(!ur.ok)throw new Error('头像上传失败 HTTP '+ur.status);
                return avatarKey;
              });
            }
            return avatarKey;
          }).then(function(avatarKey){
            /* 刷新酒馆角色列表，让新角色出现在 /getcharacters 里 */
            if(sm.getCharacters)return sm.getCharacters().then(function(){return avatarKey;});
            return avatarKey;
          }).then(function(avatarKey){
            if(typeof onOk==='function')onOk(avatarKey);
          }).catch(function(e){
            if(typeof onErr==='function')onErr(e);
          });
        }).catch(function(e){
          if(typeof onErr==='function')onErr(e);
        });
      }catch(e){
        if(typeof onErr==='function')onErr(e);
      }
    }
    /**
     * 把手机端联系人的人设/名字回写同步到酒馆角色卡（双向同步）。
     * 方式：json 注入 POST /api/characters/edit，全量回传原卡字段（json_data 保留扩展字段），
     * 只更新 ch_name 与 description。找不到对应酒馆卡时跳过（onOk(false)）。
     * @param {Object} c 本地联系人（name/persona/_stUniqueKey）
     * @param {Function} onOk 成功回调(ok:Boolean)
     * @param {Function} onErr 失败回调(err)
     */
    function _updateSTCharacter(c, onOk, onErr){
      try{
        import('/script.js').then(function(sm){
          var ctx=_getSTCtx(); if(!ctx) throw new Error('无法访问 SillyTavern');
          var stChars=ctx.characters||[];
          var stC=null, target=null, key=c._stUniqueKey||'';
          for(var i=0;i<stChars.length;i++){
            var sc=stChars[i]; if(!sc)continue;
            var d=sc.data||sc;
            var av=d.avatar||sc.avatar||'';
            if(key && av && av===key){ stC=sc; target=d; break; }
            if(!key && (d.name||sc.name||'')===(c.name||'')){ stC=sc; target=d; break; }
          }
          if(!stC||!target){ if(typeof onOk==='function')onOk(false); return; }
          var avKey=key||(target.avatar||stC.avatar||'');
          var ext=target.extensions||{};
          var dp=ext.depth_prompt||{};
          var data={
            ch_name: c.name||'',
            description: c.persona||'',
            personality: target.personality||'',
            scenario: target.scenario||'',
            first_mes: target.first_mes||'',
            mes_example: target.mes_example||'',
            creator_notes: target.creator_notes||'',
            system_prompt: target.system_prompt||'',
            post_history_instructions: target.post_history_instructions||'',
            creator: target.creator||'',
            character_version: target.character_version||'',
            alternate_greetings: Array.isArray(target.alternate_greetings)?target.alternate_greetings:(target.alternate_greetings?[target.alternate_greetings]:[]),
            tags: Array.isArray(target.tags)?target.tags:(typeof target.tags==='string'?target.tags.split(',').map(function(x){return x.trim();}).filter(Boolean):[]),
            talkativeness: target.talkativeness!==undefined?target.talkativeness:'0.5',
            fav: target.fav?'true':'false',
            world: ext.world||'',
            depth_prompt_prompt: dp.prompt||'',
            depth_prompt_depth: dp.depth!==undefined?dp.depth:4,
            depth_prompt_role: dp.role||'system',
            avatar_url: avKey,
            json_data: JSON.stringify(target)
          };
          var hdrs=sm.getRequestHeaders?sm.getRequestHeaders():undefined;
          return fetch('/api/characters/edit',{method:'POST',headers:hdrs,body:JSON.stringify(data),cache:'no-cache'}).then(function(r){
            if(!r.ok)throw new Error('HTTP '+r.status);
            return r.text();
          }).then(function(){
            if(sm.getCharacters)return sm.getCharacters().then(function(){return true;});
            return true;
          }).then(function(res){ if(typeof onOk==='function')onOk(res); });
        }).catch(function(e){ if(typeof onErr==='function')onErr(e); });
      }catch(e){ if(typeof onErr==='function')onErr(e); }
    }
    /**
     * 获取角色的标签列表（和微信插件逻辑一致）
     * 酒馆标签存在全局 tagMap(头像文件名->标签id数组) 和 tags(标签列表, id->名字) 里
     */
    function _getCharTags(stC, rawAvatar){
      try{
        var ctx = _getSTCtx(); if(!ctx) return [];
        var tags = ctx.tags || [];
        var tagMap = ctx.tag_map || ctx.tagMap || {};
        if(!tags.length || !Object.keys(tagMap).length) return [];

        var ids = [];
        var candidates = [];
        if(rawAvatar) candidates.push(rawAvatar);
        var base = String(rawAvatar||'').split(/[\\/]/).pop();
        if(base && base !== rawAvatar) candidates.push(base);
        if(stC.name) candidates.push(stC.name);

        candidates.forEach(function(k){
          if(!k) return;
          var raw = tagMap[k];
          var arr = Array.isArray(raw) ? raw : (raw ? [raw] : []);
          arr.forEach(function(id){
            var s = String(id);
            if(ids.indexOf(s) < 0) ids.push(s);
          });
        });

        var names = [];
        tags.forEach(function(t){
          ids.forEach(function(id){
            if(String(t.id) === String(id)) names.push(String(t.name));
          });
        });
        return names;
      }catch(e){ return []; }
    }

    // 全量同步：拉取酒馆所有角色
    function _pullSTAllChars(silent){
      try{
        var ctx=_getSTCtx(); if(!ctx) throw new Error('无法访问 SillyTavern');
        var stChars=ctx.characters;
        if(!stChars||!stChars.length) throw new Error('酒馆里没有角色');

        // 先把旧的角色按唯一键（头像文件名）建个索引，重名也能区分，保留用户设置的好友状态和自定义字段
        var oldByKey={};
        (_sbS.characters||[]).forEach(function(c){
          var key = c._stUniqueKey || c.name;
          oldByKey[key]=c;
        });

        var newList=[];
        var added=0, updated=0;
        for(var i=0;i<stChars.length;i++){
          var stC=stChars[i];
          if(!stC)continue;

          // 角色数据在 stC.data 里，兼容新旧格式
          var d = stC.data || stC;
          var charName = d.name || stC.name || '';
          if(!charName)continue;

          var parts=[];
          if(d.description&&d.description.trim())parts.push(d.description.trim());
          if(d.personality&&d.personality.trim())parts.push('[性格]\n'+d.personality.trim());
          if(d.scenario&&d.scenario.trim())parts.push('[场景]\n'+d.scenario.trim());

          var rawAvatar = d.avatar || stC.avatar || '';
          var uniqueKey = (rawAvatar || charName).trim();
          var avatar = rawAvatar;
          if(avatar && avatar !== 'none' && avatar !== 'chat化' && avatar.indexOf('/')!==0 && avatar.indexOf('data:')!==0){
            avatar = '/characters/' + encodeURI(avatar.trim());
          }
          // 处理角色名前面带空格的情况
          charName = charName.trim();

          // 读角色自定义彩色标签作为分组
          var charTags = _getCharTags(stC, rawAvatar);
          var group = charTags.length ? charTags[0] : '未分组';

          var old = oldByKey[uniqueKey];
          if(old){
            // 已存在：更新信息，保留用户设置的字段
            // 人设保护：酒馆卡有简介才覆盖；酒馆为空时保留本地已有简介（防刷新清空本地填写）
            var newPersona = parts.join('\n\n');
            if(newPersona) old.persona = newPersona;
            old.avatar = avatar;
            old.group = group;
            old.tags = charTags;
            old._stUniqueKey = uniqueKey;
            newList.push(old);
            updated++;
          }else{
            // 新角色：默认未好友
            newList.push({
              id:_uuid(),
              _stUniqueKey:uniqueKey,
              name:charName,
              persona:parts.join('\n\n'),
              avatar:avatar,
              group:group,
              tags:charTags,
              ttsEnabled:false,
              ttsVoiceId:'',ttsLanguage:'zh-CN',ttsSpeed:1.0,ttsSpeakLang:'',
              _stChar:true,
              isFriend:false
            });
            added++;
          }
        }
        
        // 按唯一key去重，避免重复添加
        var seen={};
        var deduped=[];
        newList.forEach(function(c){
          var key=c._stUniqueKey||c.name;
          if(!seen[key]){seen[key]=true;deduped.push(c);}
        });
        _sbS.characters=deduped;_W();
        if(TOP._pprender)TOP._pprender();
        if(!silent) _toast('✓ 同步完成：新增 '+added+'，更新 '+updated+'，共 '+newList.length+' 个角色');
      }catch(e){
        console.error('[PP] 同步角色失败:', e);
        if(!silent) _toast('同步失败: '+e.message);
      }
    }
    // Pull current ST character into _sbS.characters (updates existing ST entry or adds new)
    function _pullSTChar(){
      try{
        var ctx=_getSTCtx(); if(!ctx) throw new Error('无法访问 SillyTavern');
        var stChars=ctx.characters; var cid=ctx.characterId;
        if(stChars===undefined||cid===undefined||!stChars[cid]) throw new Error('未找到当前角色');
        var stC=stChars[cid];
        var fields=ctx.getCharacterCardFields?ctx.getCharacterCardFields():{};
        var charName=stC.name||'';
        var parts=[];
        if(fields.description&&fields.description.trim()) parts.push(fields.description.trim());
        if(fields.personality&&fields.personality.trim()) parts.push('[性格]\n'+fields.personality.trim());
        if(fields.scenario&&fields.scenario.trim()) parts.push('[场景]\n'+fields.scenario.trim());
        var charPersona=parts.join('\n\n');
        // Find existing ST-pulled char entry or create new
        var existing=null;
        for(var i=0;i<_sbS.characters.length;i++){
          if(_sbS.characters[i]._stChar && _sbS.characters[i].name===charName){ existing=_sbS.characters[i]; break; }
        }
        if(existing){ existing.name=charName; if(charPersona) existing.persona=charPersona; }
        else{
          var nc={id:_uuid(),name:charName,persona:charPersona,_stChar:true,ttsEnabled:false,ttsVoiceId:'',ttsLanguage:'',ttsSpeed:1.0,ttsSpeakLang:''};
          _sbS.characters.push(nc);
          if(_sbS.activeCharIds.indexOf(nc.id)<0) _sbS.activeCharIds.push(nc.id);
        }
        _W(); _renderTab();
        _toast('✓ 角色「'+charName+'」已从酒馆拉取');
      }catch(e){ _toast('拉取失败: '+e.message); }
    }
    // 拉取所有世界书
    function _pullAllWorldBooks(silent){
      if(_ui.wbLoading) return; // 拉取中忽略重复请求（世界书首次打开会被多处同时触发，避免连刷重绘）
      _ui.wbLoading=true;
      try{
        var ctx=_getSTCtx(); if(!ctx) throw new Error('无法访问 SillyTavern');
        
        // 从世界书下拉框拿所有书：value只是列表索引，text才是真实文件名
        // 注意：必须用 textContent 读文件名——new Option() 的 .text 属性会裁剪尾随空格，
        // 而带尾随空格的文件（如 V1.2 咒术回战）用 .text 会加载失败
        var sel=TOPDOC.querySelector('#world_info');
        if(!sel) throw new Error('找不到世界书下拉框');
        
        var allBooks=Array.from(sel.options)
          .filter(o=>o.value && o.value!=='None' && o.value!=='无' && o.value!=='选择世界书')
          .map(o=>({
            fileName: o.textContent!=null?o.textContent:o.text, // 真实文件名（原样保留，可能含尾随空格）
            displayName: ((o.textContent!=null?o.textContent:o.text)||'').trim() // 显示用的名字
          }));
        
        if(!allBooks.length){
          _sbS.wbBooks=[];
          _W();
          if(!silent)_toast('酒馆里没有世界书');
          _ui.wbLoading=false;
          return;
        }
        
        if(!silent)_toast('正在拉取 '+allBooks.length+' 本世界书…');
        
        // 先拉取每本书的数据，用真实文件名加载
        var promises=allBooks.map(function(bookInfo){
          return Promise.resolve().then(function(){
            return ctx.loadWorldInfo(bookInfo.fileName);
          }).then(function(wb){ return {displayName:bookInfo.displayName, fileName:bookInfo.fileName, wb:wb}; });
        });
        
        Promise.all(promises).then(function(results){
          var books=[];
          var totalEntries=0;
          // 先拿到酒馆里真实的启用世界书列表
          var ctx=_getSTCtx();
          var pu = (typeof power_user !== 'undefined') ? power_user : (ctx && ctx.power_user) || {};
          var enabledBooks = new Set();
          // 全局启用的世界书（存的是文件名）
          (pu.global_world_info || []).forEach(name => {
            enabledBooks.add(name);
            enabledBooks.add(name.replace(/\.json$/, '')); // 去掉后缀也存一份
          });
          // 当前角色绑定的世界书
          if(ctx && ctx.character && ctx.character.world_info && ctx.character.world_info.pages){
            Object.keys(ctx.character.world_info.pages).forEach(bookName => {
              enabledBooks.add(bookName);
              enabledBooks.add(bookName.replace(/\.json$/, ''));
            });
          }
          // 当前选中的世界书，同时存文件名和显示名
          var sel=TOPDOC.querySelector('#world_info');
          if(sel && sel.value && sel.value !== 'None'){
            enabledBooks.add(sel.value.trim());
            enabledBooks.add((sel.options[sel.selectedIndex].textContent!=null?sel.options[sel.selectedIndex].textContent:sel.options[sel.selectedIndex].text).trim());
          }

          results.forEach(function(r){
            if(!r||!r.wb) return;
            var entries=[];
            // 用显示名（trim后）做稳定id，避免尾随空格导致同一本书出现两个id
            var bookId = 'book_' + r.displayName;
            var bookName = r.displayName; // 显示用的名字
            
            // 转换条目格式，保留原始 key 方便写回
            Object.keys(r.wb.entries||{}).sort(function(a,b){return parseInt(a)-parseInt(b);}).forEach(function(k){
              var e=r.wb.entries[k];
              // 条目正文只进会话级缓存（_ui 不落盘），避免 localStorage 被全量内容撑爆配额
              if(!_ui.wbContentMap)_ui.wbContentMap={};
              if(!_ui.wbContentMap[bookId])_ui.wbContentMap[bookId]={};
              _ui.wbContentMap[bookId][k]=e.content||'';
              entries.push({
                id:'wb_' + bookName + '_' + k, // 生成稳定 id
                _stEntryKey:k, // 保存酒馆里的原始 key
                uid:e.uid??k, // 保留酒馆条目的 uid（写回时依赖，缺了会导致酒馆渲染跳过条目）
                name:e.comment&&e.comment.trim()?e.comment.trim():(('条目'+(totalEntries+1))),
                content:'', // 正文不落盘（内容在 _ui.wbContentMap 会话缓存，需要时实时拉）
                enabled:!e.disable,
                keys:e.keys||[],
                insertion_order:e.insertion_order||100,
                _stBookFileName:r.fileName, // 真实磁盘文件名（可能带尾随空格，写回时用）
                _stBookName:bookName
              });
              totalEntries++;
            });
            
            // 读酒馆里这本书的真实启用状态（用真实文件名匹配）
            var isEnabled = enabledBooks.has(r.fileName) || enabledBooks.has(bookName);
            books.push({
              id: bookId, // 用真实文件名当稳定 id
              name: bookName,
              entries: entries,
              _stBookFileName: r.fileName,
              _stBookName: bookName,
              _stEnabled: isEnabled // 保存酒馆真实启用状态
            });
          });
          
          // 同步启用状态到本地开关，和酒馆一致
          if(!_sbS.wbBookToggles)_sbS.wbBookToggles={};
          books.forEach(book => {
            _sbS.wbBookToggles[book.id] = book._stEnabled;
          });

          _sbS.wbBooks=books;
          _W();
          // 无动画刷新当前世界书页面
          if(TOP._pprefresh)TOP._pprefresh(); else if(typeof _refreshNoAnim === 'function') _refreshNoAnim();
          _ui.wbLoading=false;
          if(!silent)_toast('✓ 已加载 '+books.length+' 本世界书，共 '+totalEntries+' 条条目');
        }).catch(function(err){
          _ui.wbLoading=false;
          console.error('[PP] 拉取世界书失败:', err);
          if(!silent)_toast('拉取失败: '+(err&&err.message?err.message:String(err)));
        });
        
      }catch(e){
        _ui.wbLoading=false;
        console.error('[PP] 拉取世界书失败:', e);
        if(!silent)_toast('拉取失败: '+e.message);
      }
    }
    
    // 按需补拉单条世界书正文（优先会话缓存 _ui.wbContentMap，缺失时从酒馆实时拉）
    function _getWbEntryContent(bookId, entryKey, cb){
      try{
        var cached=(_ui.wbContentMap&&_ui.wbContentMap[bookId]&&_ui.wbContentMap[bookId][entryKey]);
        if(typeof cached==='string'){cb&&cb(cached);return;}
        var book=(_sbS.wbBooks||[]).filter(function(b){return b.id===bookId;})[0];
        if(!book){cb&&cb('');return;}
        var ctx=_getSTCtx();
        if(!ctx||!ctx.loadWorldInfo){cb&&cb('');return;}
        ctx.loadWorldInfo(book._stBookFileName||book.name).then(function(live){
          var c=(live&&live.entries&&live.entries[entryKey]&&live.entries[entryKey].content)||'';
          if(!_ui.wbContentMap)_ui.wbContentMap={};
          if(!_ui.wbContentMap[bookId])_ui.wbContentMap[bookId]={};
          _ui.wbContentMap[bookId][entryKey]=c;
          cb&&cb(c);
        }).catch(function(){cb&&cb('');});
      }catch(e){cb&&cb('');}
    }

    // 保存单本世界书到服务器
    function _saveWorldBook(book){
      try{
        var ctx=_getSTCtx(); if(!ctx) throw new Error('无法访问 SillyTavern');
        
        // 把我们的格式转回酒馆的格式
        function buildEntries(contentFromLive){
          var entries={};
          book.entries.forEach(function(en){
            var key = en._stEntryKey || String(Date.now());
            // 正文：本地改过的优先；其次会话缓存；再退到酒馆现存内容（未编辑条目不能因为瘦身丢内容）
            var content = en.content || ((_ui.wbContentMap&&_ui.wbContentMap[book.id]&&_ui.wbContentMap[book.id][key]) || '');
            if(!content && contentFromLive && contentFromLive[key]) content = contentFromLive[key].content || '';
            entries[key]={
              key:key,
              uid:en.uid||en._stEntryKey||key, // 保留 uid（酒馆渲染 getWorldEntry 依赖 data.entries[entry.uid]，缺了条目不显示）
              comment:en.name,
              content:content,
              disable:!en.enabled,
              keys:en.keys||[],
              insertion_order:en.insertion_order||100,
              enabled:true,
              position:0,
              vectorDepth:0,
              depth:4,
              role:0,
              probability:100,
              useProbability:true,
              preventRecursion:true,
              delayUntilRecursive:false,
              displayIndex:parseInt(key)||0
            };
          });
          return entries;
        }
        
        // 写回必须用磁盘上的真实文件名（可能带尾随空格），否则会另存一份名字相同但无空格的重复文件
        var saveName = book._stBookFileName || book.name;
        function doSave(liveEntries){
          var entries=buildEntries(liveEntries);
          var wbData={
            entries:entries,
            originalBookName:book.name,
            entriesOrder:Object.keys(entries)
          };
          // 调用酒馆的保存 API
          if(ctx.saveWorldInfo){
            ctx.saveWorldInfo(saveName, wbData);
          }else{
            console.warn('[PP] ctx.saveWorldInfo 不存在，无法写回');
          }
        }
        // 内容已瘦身：写回前先拉酒馆现存内容做合并，避免未编辑条目的正文被清空
        if(ctx.loadWorldInfo){
          ctx.loadWorldInfo(saveName).then(function(live){
            doSave((live&&live.entries)||null);
          }).catch(function(){
            doSave(null);
          });
        }else{
          doSave(null);
        }
      }catch(e){
        console.error('[PP] 保存世界书失败:', e);
        _toast('保存失败: '+e.message);
      }
    }

    // 同步世界书启用状态回酒馆：手机端开关 → 酒馆 selected_world_info（全局世界书激活列表）
    // 酒馆的"启用/关闭"语义 = selected_world_info 数组（存世界书文件名），改完由 ST 自己持久化
    function _saveWorldBookEnabled(book,on){
      try{
        var ctx=_getSTCtx();
        if(!ctx||!ctx.eventSource) throw new Error('无法访问 SillyTavern');
        var fileName=book._stBookFileName||book.name;  // 真实磁盘文件名（可能带尾随空格）
        var displayName=book.name;                     // trim 后的显示名（兜底匹配）
        import('/scripts/world-info.js').then(function(wi){
          // 读当前启用列表（live binding，读到的永远是最新值）
          var sel=(wi.selected_world_info||[]).slice();
          var idx=sel.indexOf(fileName);
          if(idx<0)idx=sel.indexOf(displayName);
          if(on&&idx<0)sel.push(fileName);
          if(!on&&idx>=0)sel.splice(idx,1);
          // 一次调用完成：整体替换启用列表 + ST 内部 saveSettingsDebounced() 持久化
          if(wi.updateWorldInfoSettings){
            wi.updateWorldInfoSettings({}, sel);
          }else{
            // 兜底：直接改数组 + 手动保存设置
            var live=wi.selected_world_info;
            live.length=0;
            sel.forEach(function(n){live.push(n);});
            import('/script.js').then(function(sm){
              if(sm.saveSettingsDebounced)sm.saveSettingsDebounced();
            }).catch(function(){});
          }
          // 刷新酒馆的世界书下拉框 UI，让选中状态可见
          try{ wi.updateWorldInfoList && wi.updateWorldInfoList(); }catch(e){}
          // 通知手机端：本插件监听 WORLDINFO_UPDATED，在世界书页时自动重拉对齐
          try{ ctx.eventSource.emit(ctx.eventTypes.WORLDINFO_SETTINGS_UPDATED, fileName); }catch(e){}
          try{ ctx.eventSource.emit(ctx.eventTypes.WORLDINFO_UPDATED, fileName); }catch(e){}
        }).catch(function(e){
          console.error('[PP] 保存世界书启用状态失败:', e);
          _toast('保存失败: '+(e&&e.message?e.message:String(e)));
        });
      }catch(e){
        console.error('[PP] 保存世界书启用状态失败:', e);
        _toast('保存失败: '+e.message);
      }
    }
    
    // 保留旧函数兼容
    function _pullSTWb(){
      _pullAllWorldBooks(false);
    }

    function _renderCharsTab(){
      function _makeAvatarWidget(getAv,setAv){
        var wrap=TOPDOC.createElement('div');
        wrap.style.cssText='display:flex;align-items:center;gap:10px;padding:8px 12px 4px;';
        var img=TOPDOC.createElement('div');
        img.style.cssText='width:52px;height:52px;border-radius:50%;flex-shrink:0;overflow:hidden;'
          +'background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;'
          +'cursor:pointer;border:1.5px solid rgba(255,255,255,.15);transition:border-color .15s;';
        function _upd(){
          var av=getAv();
          if(av){img.style.backgroundImage='url('+av+')';img.style.backgroundSize='cover';img.style.backgroundPosition='center';img.innerHTML='';}
          else{img.style.backgroundImage='none';img.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.8" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';}
        }
        _upd();
        var info=TOPDOC.createElement('div');
        var lbl=TOPDOC.createElement('div');lbl.style.cssText='font-size:12px;color:rgba(255,255,255,.55);';lbl.textContent='头像';
        var hint=TOPDOC.createElement('div');hint.style.cssText='font-size:11px;color:rgba(255,255,255,.3);margin-top:2px;';hint.textContent='点击更换 · 仅本地存储';
        var fi=TOPDOC.createElement('input');fi.type='file';fi.accept='image/*';fi.style.display='none';
        fi.addEventListener('change',function(){
          var f=this.files&&this.files[0];if(!f)return;
          var r=new TOP.FileReader();
          r.onload=function(e){setAv(e.target.result);_W();_upd();};
          r.readAsDataURL(f);
        });
        img.addEventListener('mouseenter',function(){this.style.borderColor='rgba(255,255,255,.4)';});
        img.addEventListener('mouseleave',function(){this.style.borderColor='rgba(255,255,255,.15)';});
        img.addEventListener('click',function(e){e.stopPropagation();fi.click();});
        info.appendChild(lbl);info.appendChild(hint);
        wrap.appendChild(img);wrap.appendChild(info);wrap.appendChild(fi);
        return wrap;
      }

      var f=TOPDOC.createDocumentFragment();
      // User card
      var uc=TOPDOC.createElement('div');
      uc.style.cssText='background:'+C.surface+';border-radius:14px;overflow:hidden;';
      var uhr=TOPDOC.createElement('div');uhr.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:10px 12px 6px;';
      var _uHdAv=TOPDOC.createElement('div');
      _uHdAv.style.cssText='width:26px;height:26px;border-radius:50%;flex-shrink:0;margin-right:7px;background:rgba(255,255,255,.1);background-size:cover;background-position:center;';
      if(_sbS.user&&_sbS.user.avatar)_uHdAv.style.backgroundImage='url('+_sbS.user.avatar+')';
      else _uHdAv.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2" stroke-linecap="round" style="margin:6px auto;display:block;"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
      var ulbl=TOPDOC.createElement('span');ulbl.style.cssText='font-size:12px;font-weight:600;color:'+C.text2+';display:flex;align-items:center;';
      ulbl.insertBefore&&ulbl.insertBefore(_uHdAv,ulbl.firstChild);
      ulbl.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:5px;opacity:.7;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>用户';
      var usB=_pbtn('保存','blue');
      var uPullB=_pbtn('从酒馆拉取','default');
      uPullB.title='从 SillyTavern 拉取当前用户人设';
      uPullB.addEventListener('click',function(e){
        e.stopPropagation();
        _pullSTUser(function(){
          // After pull, update the visible inputs in-place
          uNameI.value=_sbS.user.name;
          uPersT.value=_sbS.user.persona;
          _toast('✓ 用户人设已从酒馆拉取');
        });
      });
      var uBtns=TOPDOC.createElement('div');uBtns.style.cssText='display:flex;gap:5px;align-items:center;';
      uBtns.appendChild(uPullB);uBtns.appendChild(usB);
      uhr.appendChild(ulbl);uhr.appendChild(uBtns);uc.appendChild(uhr);
      /* User avatar */
      if(!_sbS.user)_sbS.user={name:'',persona:''};
      uc.appendChild(_makeAvatarWidget(function(){return _sbS.user.avatar;},function(v){_sbS.user.avatar=v;}));
      var _uavSep=TOPDOC.createElement('div');_uavSep.style.cssText='height:0.5px;background:rgba(255,255,255,.07);margin:0 12px;';uc.appendChild(_uavSep);
      var uep=TOPDOC.createElement('div');uep.style.cssText='padding:0 12px 10px;display:flex;flex-direction:column;gap:4px;';
      var uNameI=_inp('用户名','text',_sbS.user.name);
      var uPersT=_ta('用户人设',_sbS.user.persona,3);
      [_lbl('名字'),uNameI,_lbl('人设'),uPersT].forEach(function(el){uep.appendChild(el);});
      uc.appendChild(uep);
      usB.addEventListener('click',function(e){
        e.stopPropagation();_sbS.user.name=uNameI.value.trim();_sbS.user.persona=uPersT.value.trim();_W();_toast('用户信息已保存');
      });
      // User preset section
      var upSep=TOPDOC.createElement('div');upSep.style.cssText='height:0.5px;background:'+C.border+';margin:4px 12px 0;';uc.appendChild(upSep);
      var uph=TOPDOC.createElement('div');uph.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:8px 12px 4px;';
      var uplbl=TOPDOC.createElement('span');uplbl.style.cssText='font-size:11px;color:'+C.text3+';letter-spacing:.4px;';uplbl.textContent='用户预设';
      var upnameI=_inp('预设名称','text','');upnameI.style.cssText+='padding:4px 8px;font-size:11px;border-radius:7px;';
      var upSaveB=_pbtn('保存','blue');
      upSaveB.addEventListener('click',function(e){
        e.stopPropagation();
        _sbS.user.name=uNameI.value.trim();_sbS.user.persona=uPersT.value.trim();
        var nm=upnameI.value.trim()||'预设'+((_sbS.userPresets.length)+1);
        _sbS.userPresets.push({id:_uuid(),name:nm,uname:_sbS.user.name,persona:_sbS.user.persona});
        _W();upnameI.value='';_renderTab();_toast('"'+nm+'" 已保存');
      });
      var uphR=TOPDOC.createElement('div');uphR.style.cssText='display:flex;gap:5px;align-items:center;';
      uphR.appendChild(upnameI);uphR.appendChild(upSaveB);
      uph.appendChild(uplbl);uph.appendChild(uphR);uc.appendChild(uph);
      if(_sbS.userPresets.length){
        var uplist=TOPDOC.createElement('div');uplist.style.cssText='padding:0 12px 10px;display:flex;flex-direction:column;gap:5px;';
        _sbS.userPresets.forEach(function(p,pi){
          var pr2=TOPDOC.createElement('div');pr2.style.cssText='display:flex;align-items:center;gap:5px;';
          var pn2=TOPDOC.createElement('span');pn2.style.cssText='flex:1;font-size:12px;color:'+C.text+';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';pn2.textContent=p.name;
          var apB2=_pbtn('应用','default');
          apB2.addEventListener('click',function(e){
            e.stopPropagation();
            _sbS.user.name=p.uname;_sbS.user.persona=p.persona;
            uNameI.value=p.uname;uPersT.value=p.persona;
            _W();_toast('"'+p.name+'" 已应用');
          });
          var dlB2=_pbtn('删除','red');
          dlB2.addEventListener('click',function(e){
            e.stopPropagation();
            _sbS.userPresets.splice(pi,1);_W();_renderTab();_toast('已删除');
          });
          pr2.appendChild(pn2);pr2.appendChild(apB2);pr2.appendChild(dlB2);uplist.appendChild(pr2);
        });
        uc.appendChild(uplist);
      } else {
        var upe=TOPDOC.createElement('div');upe.style.cssText='font-size:11px;color:'+C.text3+';padding:2px 12px 10px;';upe.textContent='暂无预设';uc.appendChild(upe);
      }
      f.appendChild(_lbl('用户'));f.appendChild(uc);

      // Characters
      var chrHdr=_row();
      var chlbl=TOPDOC.createElement('span');chlbl.style.cssText='flex:1;font-size:11px;font-weight:600;color:'+C.text2+';letter-spacing:.5px;text-transform:uppercase;';chlbl.textContent='角色';
      var addB=_pbtn('+ 添加','blue');
      addB.addEventListener('click',function(e){
        e.stopPropagation();
        var nc={id:_uuid(),name:'',persona:'',ttsEnabled:false,ttsVoiceId:'',ttsLanguage:'',ttsSpeed:1.0,ttsSpeakLang:''};_sbS.characters.push(nc);
        _ui.editCharId=nc.id;_W();_renderTab();
      });
      chrHdr.appendChild(chlbl);chrHdr.appendChild(addB);

      var chrLbl=TOPDOC.createElement('div');chrLbl.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-top:12px;margin-bottom:5px;';
      var chPullB=_pbtn('从ST拉取','default');
      chPullB.title='从 SillyTavern 拉取当前角色卡';
      chPullB.addEventListener('click',function(e){ e.stopPropagation(); _pullSTChar(); });
      var chBtns=TOPDOC.createElement('div');chBtns.style.cssText='display:flex;gap:5px;';
      chBtns.appendChild(chPullB);chBtns.appendChild(addB);
      chrLbl.appendChild(chlbl);chrLbl.appendChild(chBtns);
      f.appendChild(chrLbl);

      if(!_sbS.characters.length){
        var em=TOPDOC.createElement('div');em.style.cssText='font-size:12px;color:'+C.text3+';padding:12px 0;text-align:center;';em.textContent='点击「+ 添加」创建角色';f.appendChild(em);
      }
      _sbS.characters.forEach(function(char){
        var isEdit=_ui.editCharId===char.id;
        var card=TOPDOC.createElement('div');
        card.style.cssText=
          'background:'+C.surface+';'
          +'border-radius:14px;overflow:hidden;margin-top:6px;'
          +'border:0.5px solid '+C.border+';';
        var ch=TOPDOC.createElement('div');ch.style.cssText='display:flex;align-items:center;gap:8px;padding:10px 12px;';
        var cn=TOPDOC.createElement('span');cn.style.cssText='flex:1;font-size:13px;color:'+C.text2+';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';cn.textContent=char.name||'(未命名)';
        var ceB=_pbtn(isEdit?'收起':'编辑','default');
        ceB.addEventListener('click',function(e){e.stopPropagation();_ui.editCharId=isEdit?null:char.id;_renderTab();});
        var cdB=_pbtn('删除','red');
        cdB.addEventListener('click',function(e){
          e.stopPropagation();
          if(!TOP.confirm('删除角色 "'+char.name+'"？'))return;
          _sbS.characters=_sbS.characters.filter(function(c){return c.id!==char.id;});
          delete _sbS.history[char.id];_W();_renderTab();
        });
        var _chAv=TOPDOC.createElement('div');
        _chAv.style.cssText='width:32px;height:32px;border-radius:50%;flex-shrink:0;overflow:hidden;background:rgba(255,255,255,.08);background-size:cover;background-position:center;';
        if(char.avatar)_chAv.style.backgroundImage='url('+char.avatar+')';
        else _chAv.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
        ch.insertBefore(_chAv,cn);
        ch.appendChild(cn);ch.appendChild(ceB);ch.appendChild(cdB);card.appendChild(ch);
        if(isEdit){
          var sep=TOPDOC.createElement('div');sep.style.cssText='height:0.5px;background:'+C.border+';margin:0 12px;';
          card.appendChild(sep);
          var ep=TOPDOC.createElement('div');ep.style.cssText='padding:4px 12px 12px;display:flex;flex-direction:column;gap:4px;';
          var cnI=_inp('角色名','text',char.name);
          var cpT=_ta('角色人设',char.persona,4);
          // ── TTS 设置 ──
          var ttsTogRow=TOPDOC.createElement('div');ttsTogRow.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:4px 0;';
          var ttsTogLbl=TOPDOC.createElement('span');ttsTogLbl.style.cssText='font-size:12px;color:'+C.text+';';ttsTogLbl.textContent='启用 TTS 语音';
          var ttsTogBtn=TOPDOC.createElement('button');
          ttsTogBtn.style.cssText='width:38px;height:20px;border-radius:10px;border:none;cursor:pointer;transition:background .2s;font-size:10px;font-weight:600;font-family:inherit;'
            +(char.ttsEnabled?'background:'+C.blue+';color:#fff;':'background:rgba(120,120,128,.25);color:'+C.text3+';');
          ttsTogBtn.textContent=char.ttsEnabled?'ON':'OFF';
          ttsTogBtn.addEventListener('click',function(e){
            e.stopPropagation();char.ttsEnabled=!char.ttsEnabled;
            ttsTogBtn.style.background=char.ttsEnabled?C.blue:'rgba(120,120,128,.25)';
            ttsTogBtn.style.color=char.ttsEnabled?'#fff':C.text3;
            ttsTogBtn.textContent=char.ttsEnabled?'ON':'OFF';
            ttsFields.style.display=char.ttsEnabled?'flex':'none';
            _W();
          });
          ttsTogRow.appendChild(ttsTogLbl);ttsTogRow.appendChild(ttsTogBtn);
          var ttsFields=TOPDOC.createElement('div');
          ttsFields.style.cssText='display:'+(char.ttsEnabled?'flex':'none')+';flex-direction:column;gap:4px;padding:4px 0 0;';
          var ttsProvSel=TOPDOC.createElement('select');
          ttsProvSel.style.cssText='flex:1;padding:6px 10px;background:rgba(118,118,128,.18);border:none;border-radius:9px;color:'+C.text+';font-size:12px;outline:none;font-family:inherit;-webkit-appearance:none;';
          [['','跟随全局'],['minimax','MiniMax'],['fishaudio','Fish Audio']].forEach(function(o){
            var opt=TOPDOC.createElement('option');opt.value=o[0];opt.textContent=o[1];
            if((char.ttsProvider||'')===o[0])opt.selected=true;
            ttsProvSel.appendChild(opt);
          });
          ttsProvSel.addEventListener('mousedown',function(e){e.stopPropagation();});
          var ttsFishVoiceI=_inp('Fish Voice ID (可选)','text',char.fishVoiceId||'');
          var ttsVoiceI=_inp('自定义 Voice ID','text',char.ttsVoiceId||'');
          var ttsLangI=_inp('语言 (如 zh/en/ja, 留空自动)','text',char.ttsLanguage||'');
          function _syncEditTtsFields(){
            var fishMode=ttsProvSel.value==='fishaudio';
            ttsFishVoiceI.style.display=fishMode?'block':'none';
            ttsVoiceI.style.display=fishMode?'none':'block';
            ttsLangI.style.display=fishMode?'none':'block';
          }
          ttsProvSel.addEventListener('change',function(){_syncEditTtsFields();});
          var ttsSpeedRow=TOPDOC.createElement('div');ttsSpeedRow.style.cssText='display:flex;align-items:center;gap:6px;';
          var ttsSpeakSel=TOPDOC.createElement('select');
          ttsSpeakSel.style.cssText='flex:1;padding:6px 10px;background:rgba(118,118,128,.18);border:none;border-radius:9px;color:'+C.text+';font-size:12px;outline:none;font-family:inherit;-webkit-appearance:none;';
          [['','跟随文本'],['zh','中文'],['ja','日文'],['en','英文']].forEach(function(o){
            var opt=TOPDOC.createElement('option');opt.value=o[0];opt.textContent=o[1];
            if((char.ttsSpeakLang||'')===o[0])opt.selected=true;
            ttsSpeakSel.appendChild(opt);
          });
          ttsSpeakSel.addEventListener('mousedown',function(e){e.stopPropagation();});
          var ttsSpeedLbl=TOPDOC.createElement('span');ttsSpeedLbl.style.cssText='font-size:12px;color:'+C.text2+';white-space:nowrap;';ttsSpeedLbl.textContent='语速';
          var ttsSpeedI=TOPDOC.createElement('input');ttsSpeedI.type='number';ttsSpeedI.step='0.1';ttsSpeedI.min='0.5';ttsSpeedI.max='2';
          ttsSpeedI.value=char.ttsSpeed!==undefined?char.ttsSpeed:1.0;
          ttsSpeedI.style.cssText='flex:1;padding:6px 10px;background:rgba(118,118,128,.18);border:none;border-radius:9px;color:'+C.text+';font-size:12px;outline:none;font-family:inherit;';
          ttsSpeedI.addEventListener('mousedown',function(e){e.stopPropagation();});
          ttsFields.appendChild(_lbl('引擎'));ttsFields.appendChild(ttsProvSel);
          ttsFields.appendChild(_lbl('Fish Voice ID'));ttsFields.appendChild(ttsFishVoiceI);
          ttsFields.appendChild(_lbl('Voice ID'));ttsFields.appendChild(ttsVoiceI);
          ttsFields.appendChild(_lbl('语言'));ttsFields.appendChild(ttsLangI);
          ttsSpeedRow.appendChild(ttsSpeedLbl);ttsSpeedRow.appendChild(ttsSpeedI);
          ttsFields.appendChild(_lbl('朗读语言'));ttsFields.appendChild(ttsSpeakSel);
          ttsFields.appendChild(ttsSpeedRow);
          _syncEditTtsFields();
          var csB=_pbtn('保存','green');
          csB.addEventListener('click',function(e){
            e.stopPropagation();char.name=cnI.value.trim()||char.name;char.persona=cpT.value.trim();
            char.ttsProvider=ttsProvSel.value;char.fishVoiceId=ttsFishVoiceI.value.trim();
            char.ttsVoiceId=ttsVoiceI.value.trim();char.ttsLanguage=ttsLangI.value.trim();
            char.ttsSpeakLang=ttsSpeakSel.value;
            char.ttsSpeed=parseFloat(ttsSpeedI.value)||1.0;
            _ui.editCharId=null;_W();_renderTab();_toast('角色已保存');
            /* 双向同步：编辑保存后，若有对应酒馆角色卡则回写简介/名字 */
            if(char._stUniqueKey || char._stChar){
              _updateSTCharacter(char,function(ok){
                if(ok) _toast('✓ 已同步到酒馆角色卡');
              },function(err){ console.warn('[PP] 同步到酒馆角色卡失败:',err); });
            }
          });
          var csr=_row();csr.appendChild(csB);
          var charAvWrap=_makeAvatarWidget(function(){return char.avatar;},function(v){char.avatar=v;});
          [charAvWrap,_lbl('名字'),cnI,_lbl('人设'),cpT,_lbl('TTS'),ttsTogRow,ttsFields,csr].forEach(function(el){ep.appendChild(el);});
          card.appendChild(ep);
        }
        f.appendChild(card);
      });
      var wrap=TOPDOC.createElement('div');wrap.appendChild(f);return wrap;
    }


    // ── Character tab pills ───────────────────────────────

    // ── Resize handle ─────────────────────────────────────
    var _resH=TOPDOC.createElement('div');
    _resH.title='拖动调整大小';
    _resH.style.cssText='position:absolute;bottom:0;right:0;width:24px;height:24px;cursor:se-resize;z-index:10;display:flex;align-items:flex-end;justify-content:flex-end;padding:5px;opacity:0.22;';
    _resH.innerHTML='<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M8.5 0.5L0.5 8.5M8.5 4.5L4.5 8.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>';

    // ── Assemble ──────────────────────────────────────────
    var _phonePanel=_renderPhoneTab();
    var _homeBar=_phonePanel.querySelector('.pp-homebar')||_phonePanel;
    var _homeBarPill=_phonePanel.querySelector('.pp-homebar-pill');
    var _ppInner=_phonePanel.querySelector('#pp-header');
    if(_ppInner){_ppInner.style.cssText='flex:1;display:flex;flex-direction:column;height:100%;border-radius:0;overflow:hidden;';}
    _phonePanel.style.cssText='flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;';
    [_phonePanel,_resH].forEach(function(el){_sb.appendChild(el);});
    overlay.appendChild(_sb);
        // Clamp SB position inside overlay (prevents off-screen in inline mode)
    TOP.setTimeout(function(){
      var _ow=overlay.offsetWidth||900;
      var _oh=overlay.offsetHeight||540;
      var _sw=_sb.offsetWidth||_sbS.size.w||350;
      var _sh=_sb.offsetHeight||_sbS.size.h||540;
      var _cx=Math.min(Math.max(10,_sbS.pos.x),Math.max(10,_ow-_sw-10));
      var _cy=Math.min(Math.max(10,_sbS.pos.y),Math.max(10,_oh-_sh-10));
      _sb.style.left=_cx+'px';
      _sb.style.top=_cy+'px';
    },80);
    _sb.addEventListener('click',    function(e){e.stopPropagation();});
    _sb.addEventListener('mousedown',function(e){e.stopPropagation();});
    _sb.addEventListener('mouseup',  function(e){e.stopPropagation();_onUp();});

    // ── Drag ─────────────────────────────────────────────
    var _dr=false,_dsx,_dsy,_dox,_doy;
    /* 拖动：点击面板顶部 40px 区域可拖拽 */
    _sb.addEventListener('mousedown',function(e){
      var rect=_sb.getBoundingClientRect();
      if(e.clientY-rect.top>40)return; /* 只响应顶部 40px */
      e.preventDefault();e.stopPropagation();
      _dr=true;_dsx=e.clientX;_dsy=e.clientY;
      _dox=parseInt(_sb.style.left)||0;_doy=parseInt(_sb.style.top)||0;
      _sb.style.cursor='grabbing';
    });
    var _rs=false,_rsx,_rsy,_row0,_roh;
    _resH.addEventListener('mousedown',function(e){
      e.preventDefault();e.stopPropagation();
      _rs=true;_rsx=e.clientX;_rsy=e.clientY;_row0=_sb.offsetWidth;_roh=_sb.offsetHeight;
    });
    function _onMove(e){
      if(_dr){
        var nx=Math.max(0,Math.min(TOP.innerWidth-_sb.offsetWidth,_dox+e.clientX-_dsx));
        var ny=Math.max(0,Math.min(TOP.innerHeight-_sb.offsetHeight,_doy+e.clientY-_dsy));
        _sb.style.left=nx+'px';_sb.style.top=ny+'px';
      }
      if(_rs){_sb.style.width=Math.max(280,_row0+e.clientX-_rsx)+'px';_sb.style.height=Math.max(200,_roh+e.clientY-_rsy)+'px';}
    }
    function _onUp(){
      if(_dr){_dr=false;_sbS.pos={x:parseInt(_sb.style.left),y:parseInt(_sb.style.top)};_W();
        _sb.style.cursor='';}
      if(_rs){_rs=false;_sbS.size={w:_sb.offsetWidth,h:_sb.offsetHeight};_W();}
    }
    TOPDOC.addEventListener('mousemove',_onMove);
    TOPDOC.addEventListener('mouseup',_onUp);

    // ── Toast ─────────────────────────────────────────────
    function _toast(msg,dur){
      dur=dur||2400;
      var t=TOPDOC.createElement('div');
      t.style.cssText=
        'position:absolute;bottom:calc(100% + 10px);left:50%;transform:translateX(-50%);'
        +'white-space:nowrap;padding:8px 20px;'
        +'background:rgba(28,28,32,0.96);border:0.5px solid rgba(255,255,255,0.12);'
        +'border-radius:22px;font-size:12px;font-weight:500;color:rgba(255,255,255,0.90);'
        +'pointer-events:none;z-index:9999;opacity:0;transition:opacity .20s;'
        +'box-shadow:0 8px 24px rgba(0,0,0,0.4);'
        +'font-family:-apple-system,BlinkMacSystemFont,sans-serif;';
      t.textContent=msg;_sb.appendChild(t);
      setTimeout(function(){t.style.opacity='1';},16);
      setTimeout(function(){t.style.opacity='0';setTimeout(function(){if(t.parentNode)t.remove();},220);},dur);
    }

    // ── Render helpers ────────────────────────────────────
    /* 方向C清理：_saveHist / _updateTitle / _updatePluginInjection /
       _renderCharTabs / _renderInjectBar / _getTurns 为历史遗留 stub，
       已确认零有效依赖（调用点已同步删除），此处一并移除。
       _renderTab 仍被旧式 tab 按钮调用，保留。 */
    function _renderTab(){ if(TOP._ppdraw)TOP._ppdraw(); }

    // ── Toolbar toggle button (bind to static HTML element) ───
    (function(){
      var t=overlay.querySelector('#pp-btn-toggle');
      if(!t)return;
      function _sync(){
        t.style.color=_sbS.visible?'rgba(255,255,255,.92)':'rgba(255,255,255,.38)';
        t.style.background=_sbS.visible?'rgba(255,255,255,.12)':'transparent';
        t.style.borderColor=_sbS.visible?'rgba(255,255,255,.18)':'transparent';
      }
      t.addEventListener('click',function(e){e.stopPropagation();_sbS.visible=!_sbS.visible;_sb.style.display=_sbS.visible?'flex':'none';_sync();_W();});
      _sync();
    })();

    /* ── 刷新后自动恢复电台悬浮窗 ── */
    (function autoRestoreRadio(){
      try{
        var apps=_sbS.ppApps||[];
        var radio=apps.find(function(a){return a.id==='pp-radio';});
        if(!radio||!radio.pageCode)return;
        if(radio.settingsValues&&radio.settingsValues.radioEnabled===false)return;
        var holder=TOPDOC.createElement('div');
        holder.id='pp-radio-autorestore';
        holder.style.cssText='position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;';
        TOPDOC.body.appendChild(holder);
        var ctx=_makePluginCtx(radio);
        ctx.back=function(){};
        ctx.go=function(){};
        ctx.div=function(cls,html){return _div(cls,html);};
        ctx.el=function(tag,cls,html){return _el(tag,cls,html);};
        ctx.svg=_svg;
        var fn=new TOP.Function('ctx','return('+radio.pageCode+')(ctx);');
        var root=fn(ctx);
        if(root)holder.appendChild(root);
      }catch(e){
        console.warn('[PhonePanel] 电台自动恢复失败:',e.message);
      }
    })();

    /* ── 监听酒馆人设/世界书变更，实时刷新手机端（防抖） ── */
    (function watchSTEvents(){
      try{
        var ctx=_getSTCtx();
        if(!ctx||!ctx.eventSource||!ctx.eventTypes)return;
        var et=ctx.eventTypes;
        var _pt=null,_wt=null;
        // 人设相关事件（切换/编辑描述/改名/新建/删除）→ 拉取用户人设并刷新当前页
        var personaEvents=[et.PERSONA_CHANGED,et.PERSONA_UPDATED,et.PERSONA_RENAMED,et.PERSONA_CREATED,et.PERSONA_DELETED].filter(Boolean);
        personaEvents.forEach(function(ev){
          ctx.eventSource.on(ev,function(){
            if(!_sbS.visible)return;
            if(_pt)clearTimeout(_pt);
            _pt=setTimeout(function(){ _pullSTUser(true); },250);
          });
        });
        // 世界书内容/启用状态变更 → 停在世界书页时静默重拉
        var wbEvents=[et.WORLDINFO_UPDATED,et.WORLD_INFO_ACTIVATED].filter(Boolean);
        wbEvents.forEach(function(ev){
          ctx.eventSource.on(ev,function(){
            if(!_sbS.visible||_nav.page!=='worldbook')return;
            if(_wt)clearTimeout(_wt);
            _wt=setTimeout(function(){ _pullAllWorldBooks(true); },400);
          });
        });
      }catch(e){console.warn('[PhonePanel] 监听酒馆事件失败:',e);}
    })();

    // ── Init ─────────────────────────────────────────────

    }catch(sbErr){console.warn('[PhonePanel] statusbar init error:',sbErr.message,sbErr);}

    var _hintEl=document.getElementById('hint');
    if(_hintEl)_hintEl.style.display='none';

  })();
        console.log('[PP] ready');
      });
    } catch (err) {
      console.error('[PP] init error:', err);
    }
  });
})();
