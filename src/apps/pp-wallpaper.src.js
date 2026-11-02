/* ============================================================================
 * PP Phone Panel — 壁纸 (pp-wallpaper) 独立源码
 * 版本: 2.9.1
 * 说明: 本文件是权威源码，改代码改这里，然后用 node build.js pp-wallpaper 生成
 *       extension/apps/pp-wallpaper.js。不要直接改打包文件。
 * ============================================================================ */

/* __META_BEGIN__ */
{
  "id": "pp-wallpaper",
  "name": "壁纸",
  "version": "2.9.1",
  "description": "自定义背景壁纸 + 3D 立体。①预制图模式：上传图片/视频/网址，按预设轮播或随剧情标签切换。②3D 立体（深度感知视差，跟随鼠标/陀螺）：对智绘姬图与预制图均生效，浏览器内 Depth Anything V2 深度估计，无需本地服务。",
  "icon": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><circle cx=\"8.5\" cy=\"8.5\" r=\"1.6\"/><path d=\"M21 15l-5-5L5 21\"/>",
  "enabled": true,
  "settingsTitle": "壁纸设置",
  "settingsFields": [],
  "settingsValues": {}
}
/* __META_END__ */

/* __INJECT_BEGIN__ */
(function(ctx){
function _spStartNativeEngine(TOP) {
  var ENGINE_VER = '20260630-prestretch-v3';
  if (TOP.__spEngineVer === ENGINE_VER) return;
  TOP.__spEngine = true;
  TOP.__spEngineVer = ENGINE_VER;
  var engineToken = {};
  TOP.__spEngineToken = engineToken;
  var SKEY = 'pp-spatial';
  var store = { enabled: false, intensity: 60, cacheN: 8, heightAdjust: false, heightPercent: 100 };

  function readStore() {
    try {
      var s = JSON.parse(TOP.localStorage.getItem(SKEY) || 'null');
      if (s && typeof s === 'object') {
        store.enabled = !!s.enabled;
        if (s.intensity != null) store.intensity = s.intensity;
        if (s.cacheN != null) store.cacheN = s.cacheN;
        store.heightAdjust = !!s.heightAdjust;
        if (s.heightPercent != null) store.heightPercent = s.heightPercent;
      }
    } catch (e) {}
  }

  function findBg() {
    try {
      var d = TOP.document;
      var b = d.getElementById('pp-bg');
      if (b) return b;
      var ifr = d.querySelectorAll('iframe');
      for (var i = 0; i < ifr.length; i++) {
        try {
          var id = ifr[i].contentDocument;
          if (id) {
            var bb = id.getElementById('pp-bg');
            if (bb) return bb;
          }
        } catch (e) {}
      }
    } catch (e) {}
    return null;
  }

  function bgUrl(bg) {
    try {
      var bi = bg.style.backgroundImage || '';
      var m = bi.match(/url\((['"]?)(.*?)\1\)/);
      if (m && m[2]) return m[2];
      if (bg && bg.parentNode) {
        var wp = bg.parentNode.querySelector('#pp-wallpaper');
        if (wp) {
          var wbi = wp.style.backgroundImage || '';
          var wm = wbi.match(/url\((['"]?)(.*?)\1\)/);
          if (wm && wm[2]) return wm[2];
        }
      }
      return '';
    } catch (e) {
      return '';
    }
  }

  /* ---- 深度模型 (transformers.js, 懒加载) ---- */
  var depther = null, depthLoading = false, depthFailed = false;
  function loadDepth() {
    if (depther || depthLoading || depthFailed) return;
    depthLoading = true;
    import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3').then(function(mod) {
      var dev = 'webgpu';
      try {
        if (!TOP.navigator.gpu) dev = 'wasm';
      } catch (e) {
        dev = 'wasm';
      }
      return mod.pipeline('depth-estimation', 'onnx-community/depth-anything-v2-small', { device: dev }).then(function(p) {
        depther = p;
        depthLoading = false;
        console.info('[VNM-Spatial] 深度模型就绪 device=' + dev);
      });
    }).catch(function(err) {
      depthFailed = true;
      depthLoading = false;
      console.warn('[VNM-Spatial] 深度模型加载失败, 降级3D倾斜:', err);
    });
  }

  /* ---- 深度缓存 (LRU) ---- */
  var dcache = { order: [], map: {} };
  function cacheGet(u) { return dcache.map[u] || null; }
  function cachePut(u, v) {
    if (dcache.map[u]) return;
    dcache.map[u] = v;
    dcache.order.push(u);
    var n = parseInt(store.cacheN, 10) || 8;
    while (dcache.order.length > n) {
      var o = dcache.order.shift();
      try { delete dcache.map[o]; } catch (e) {}
    }
  }

  /* ---- ??????: ????????????????, ???????????? ---- */
  var _spStretchMap = {}, _spStretchBusy = {};
  function _spEffUrl(srcUrl) {
    if (!srcUrl) return '';
    var hp = store.heightAdjust ? ((parseFloat(store.heightPercent) || 100) / 100) : 1;
    if (!(hp > 0.1)) hp = 0.1;
    if (Math.abs(hp - 1) < 0.001) return srcUrl;
    var key = srcUrl + '@' + hp.toFixed(3);
    if (_spStretchMap[key]) return _spStretchMap[key];
    if (!_spStretchBusy[key]) {
      _spStretchBusy[key] = 1;
      var im = new TOP.Image();
      if (/^https?:\/\//i.test(srcUrl)) { im.crossOrigin = 'anonymous'; }
      im.onload = function () {
        try {
          var iw = im.naturalWidth || im.width || 0;
          var ih = im.naturalHeight || im.height || 0;
          if (!iw || !ih) { delete _spStretchBusy[key]; return; }
          var cv = TOP.document.createElement('canvas');
          cv.width = iw;
          cv.height = Math.max(1, Math.round(ih * hp));
          var c2 = cv.getContext('2d');
          c2.drawImage(im, 0, 0, iw, ih, 0, 0, cv.width, cv.height);
          _spStretchMap[key] = cv.toDataURL('image/png');
        } catch (e) {}
        delete _spStretchBusy[key];
      };
      im.onerror = function () { delete _spStretchBusy[key]; };
      im.src = srcUrl;
    }
    return srcUrl;
  }

  var inflight = {};
  function ensureDepth(url) {
    if (!url || cacheGet(url) || inflight[url]) return;
    if (!depther) { loadDepth(); return; }
    inflight[url] = 1;
    depther(url).then(function(out) {
      var d = out && out.depth;
      if (d && d.data) {
        var data = d.data, mn = 255, mx = 0;
        for (var i = 0; i < data.length; i++) {
          var v = data[i];
          if (v < mn) mn = v;
          if (v > mx) mx = v;
        }
        var rng = (mx - mn) || 1;
        var u8 = new Uint8Array(data.length);
        for (var j = 0; j < data.length; j++) {
          u8[j] = ((data[j] - mn) / rng * 255) | 0;
        }
        cachePut(url, { w: d.width, h: d.height, depth: u8 });
      }
    }).catch(function(e) {
      console.warn('[VNM-Spatial] 深度推理失败', e);
    }).then(function() {
      delete inflight[url];
    });
  }

  /* ---- WebGL 渲染层 ---- */
  var gl = null, prog = null, glc = null, texC = null, texD = null, uni = {}, curUrl = '', texReady = false, depthBound = '', colorW = 0, colorH = 0;
  var VS = 'attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,1.-(p.y*.5+.5));gl_Position=vec4(p,0.,1.);}';
  var FS = 'precision highp float;varying vec2 v;uniform sampler2D iC;uniform sampler2D iD;uniform vec2 off;uniform vec2 uvScale;uniform vec2 uvOffset;uniform float amt;uniform float hasD;vec2 mapUv(vec2 q){return q*uvScale+uvOffset;}void main(){ vec2 base=mapUv(v); if(hasD<0.5){ vec2 uv=base+off*0.4; uv=clamp(uv,0.001,0.999); gl_FragColor=texture2D(iC,uv); return; } vec2 step=vec2(0.0015,0.0015); float d0=texture2D(iD,base).r; float d1=texture2D(iD,base+vec2(step.x,0.0)).r; float d2=texture2D(iD,base+vec2(-step.x,0.0)).r; float d3=texture2D(iD,base+vec2(0.0,step.y)).r; float d4=texture2D(iD,base+vec2(0.0,-step.y)).r; float d=(d0*2.0+d1+d2+d3+d4)/6.0; d=smoothstep(0.02,0.98,d); vec2 shift=off*(d-0.5)*amt*0.55; vec2 uv=base+shift; float sd0=texture2D(iD,uv).r; float sd1=texture2D(iD,uv+vec2(step.x,0.0)).r; float sd2=texture2D(iD,uv+vec2(-step.x,0.0)).r; float sd3=texture2D(iD,uv+vec2(0.0,step.y)).r; float sd4=texture2D(iD,uv+vec2(0.0,-step.y)).r; float sd=(sd0*2.0+sd1+sd2+sd3+sd4)/6.0; sd=smoothstep(0.02,0.98,sd); float depth_diff=abs(d-sd); float edge_mask=smoothstep(0.28,0.08,depth_diff); vec2 final_shift=shift*edge_mask; vec2 final_uv=base+final_shift; final_uv=clamp(final_uv,0.001,0.999); gl_FragColor=texture2D(iC,final_uv); }';

  function sh(t, src) {
    var s = gl.createShader(t);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  function initGL(canvas) {
    glc = canvas;
    gl = glc.getContext('webgl') || glc.getContext('experimental-webgl');
    if (!gl) return false;
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    var b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var l = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(l);
    gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);
    ['iC', 'iD', 'off', 'uvScale', 'uvOffset', 'amt', 'hasD'].forEach(function(k) { uni[k] = gl.getUniformLocation(prog, k); });
    texC = gl.createTexture();
    texD = gl.createTexture();
    [texC, texD].forEach(function(t) {
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    });
    return true;
  }

  function setColorTex(url) {
    var img = new TOP.Image();
    if (/^https?:\/\//i.test(url)) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = function() {
      try {
        colorW = img.naturalWidth || img.width || 0;
        colorH = img.naturalHeight || img.height || 0;
        gl.bindTexture(gl.TEXTURE_2D, texC);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        texReady = true;
      } catch (e) {
        texReady = false;
      }
    };
    img.onerror = function() { texReady = false; };
    img.src = url;
  }

  function setDepthTex(rec) {
    try {
      gl.bindTexture(gl.TEXTURE_2D, texD);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, rec.w, rec.h, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, rec.depth);
    } catch (e) {}
  }

  function _spCssSize(v, total) {
    v = String(v || '').trim().toLowerCase();
    if (!v || v === 'auto') return null;
    if (v.slice(-1) === '%') return total * (parseFloat(v) || 0) / 100;
    if (v.slice(-2) === 'px') return parseFloat(v) || 0;
    var n = parseFloat(v);
    return isFinite(n) ? n : null;
  }

  function _spCssPos(v, total, size) {
    v = String(v || '50%').trim().toLowerCase();
    if (v === 'left' || v === 'top') return 0;
    if (v === 'right' || v === 'bottom') return total - size;
    if (v === 'center') return (total - size) * 0.5;
    if (v.slice(-1) === '%') return (total - size) * ((parseFloat(v) || 0) / 100);
    if (v.slice(-2) === 'px') return parseFloat(v) || 0;
    return (total - size) * 0.5;
  }

  function _spLayerRect(bg, bw, bh) {
    var iw = colorW || bw || 1, ih = colorH || bh || 1;
    var ia = iw / ih, va = (bw || 1) / (bh || 1);
    var dw = bw || 1, dh = bh || 1;
    var cs = null;
    try { cs = bg.ownerDocument.defaultView.getComputedStyle(bg); } catch (e) {}
    var bs = String((cs && cs.backgroundSize) || bg.style.backgroundSize || 'cover').split(',')[0].trim().toLowerCase();
    if (bs === 'contain') {
      if (ia > va) { dw = bw; dh = bw / ia; } else { dh = bh; dw = bh * ia; }
    } else if (bs === 'cover' || !bs) {
      if (ia > va) { dh = bh; dw = bh * ia; } else { dw = bw; dh = bw / ia; }
    } else {
      var p = bs.split(/s+/);
      var sw = _spCssSize(p[0], bw);
      var sh = _spCssSize(p.length > 1 ? p[1] : 'auto', bh);
      if (sw && sh) {
        var scale = Math.max(sw / iw, sh / ih);
        dw = iw * scale; dh = ih * scale;
      } else if (sw) { dw = sw; dh = sw / ia; }
      else if (sh) { dh = sh; dw = sh * ia; }
      else if (ia > va) { dh = bh; dw = bh * ia; }
      else { dw = bw; dh = bw / ia; }
    }
    var px = (cs && (cs.backgroundPositionX || '50%')) || '50%';
    var py = (cs && (cs.backgroundPositionY || '50%')) || '50%';
    return { x: _spCssPos(px, bw, dw), y: _spCssPos(py, bh, dh), w: dw, h: dh };
  }

  function fitLayerToImage(bg, L, bw, bh) {
    var r = _spLayerRect(bg, bw, bh);
    L.style.inset = 'auto';
    L.style.left = r.x + 'px';
    L.style.top = r.y + 'px';
    L.style.width = r.w + 'px';
    L.style.height = r.h + 'px';
    L.style.transformOrigin = 'center center';
    return { x: r.x, y: r.y, w: r.w, h: r.h };
  }

  function computeUvFit(w, h) {
    return { sx: 1, sy: 1, ox: 0, oy: 0 };
  }

  /* ---- 指针 (陀螺优先, 否则鼠标) ---- */
  var gyro = { active: false, b0: null, beta: 0, gamma: 0 }, mouse = { has: false, x: 0, y: 0 };
  TOP.addEventListener('deviceorientation', function(e) {
    if (e.beta == null && e.gamma == null) return;
    gyro.active = true;
    if (gyro.b0 === null) gyro.b0 = { b: e.beta, g: e.gamma };
    gyro.beta = e.beta - gyro.b0.b;
    gyro.gamma = e.gamma - gyro.b0.g;
  }, true);

  function bindPointer(doc) {
    if (doc.__vnmPointerBound) return;
    doc.__vnmPointerBound = true;
    doc.addEventListener('pointermove', function(e) {
      mouse.has = true;
      var w = doc.defaultView.innerWidth || 1;
      var h = doc.defaultView.innerHeight || 1;
      mouse.x = (e.clientX / w - .5) * 2;
      mouse.y = (e.clientY / h - .5) * 2;
    }, { passive: true });
  }

  // iOS 陀螺权限: 首次点击请求
  TOP.document.addEventListener('click', function() {
    try {
      if (TOP.DeviceOrientationEvent && typeof TOP.DeviceOrientationEvent.requestPermission === 'function') {
        TOP.DeviceOrientationEvent.requestPermission().catch(function() {});
      }
    } catch (e) {}
  }, { once: true });

  var ox = 0, oy = 0; // smoothed pointer
  function ensureLayer(bg) {
    var doc = bg.ownerDocument, par = bg.parentNode;
    var L = par.querySelector('#pp-spatial');
    if (!L) {
      L = doc.createElement('canvas');
      L.id = 'pp-spatial';
      L.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;width:100%;height:100%;will-change:transform;transform:scale(1.06);';
      par.insertBefore(L, bg.nextSibling);
    }
    return L;
  }

  var cssMode = false;
  function loop() {
    if (TOP.__spEngineToken !== engineToken) return;
    TOP.requestAnimationFrame(loop);
    readStore();
    var bg = findBg();
    
    // Direct Global Debug Object Expose!
    TOP.__vnmSpatialDebug = {
      bgFound: !!bg,
      storeEnabled: store.enabled,
      url: bg ? bgUrl(bg) : '',
      mouseHas: mouse.has,
      mouseX: mouse.x,
      mouseY: mouse.y,
      ox: ox,
      oy: oy,
      texReady: texReady,
      cssMode: cssMode,
      engineVer: ENGINE_VER,
      tokenActive: TOP.__spEngineToken === engineToken,
      colorW: colorW,
      colorH: colorH,
      heightAdjust: store.heightAdjust,
      heightPercent: store.heightPercent,
      effUrlHead: typeof url === 'string' ? url.slice(0, 32) : '',
      stretchCacheN: Object.keys(_spStretchMap || {}).length
    };

    if (!store.enabled || !bg) {
      var ol = bg && bg.parentNode && bg.parentNode.querySelector('#pp-spatial');
      if (ol) ol.style.display = 'none';
      if (bg) { bg.style.opacity = ''; bg.style.transform = ''; bg.style.filter = ''; }
      if (bg && bg.parentNode) {
        var wp = bg.parentNode.querySelector('#pp-wallpaper');
        if (wp && wp.style.opacity === '0.001') wp.style.opacity = '1';
      }
      return;
    }
    var srcUrl = bgUrl(bg);
    var url = _spEffUrl(srcUrl);
    var L = ensureLayer(bg);
    L.style.display = 'block';
    bindPointer(bg.ownerDocument);

    // 目标指针
    var tx, ty;
    if (gyro.active) {
      tx = Math.max(-1, Math.min(1, gyro.gamma / 22));
      ty = Math.max(-1, Math.min(1, gyro.beta / 22));
    } else if (mouse.has) {
      tx = mouse.x;
      ty = mouse.y;
    } else {
      tx = 0;
      ty = 0;
    }
    ox += (tx - ox) * .08;
    oy += (ty - oy) * .08;
    var amt = (parseFloat(store.intensity) || 60) / 100;
    if (!url) { L.style.display = 'none'; return; }
    ensureDepth(url);

    // 初始化GL
    if (glc !== L) {
      gl = null;
      prog = null;
      texC = null;
      texD = null;
      texReady = false;
      depthBound = '';
      curUrl = '';
    }
    if (gl === null && !cssMode) {
      if (!initGL(L)) { cssMode = true; }
    }
    if (cssMode) {
      L.style.display = 'none';
      bg.style.willChange = 'transform';
      bg.style.transform = 'perspective(1100px) scale(1.1) rotateY(' + (ox * 7 * amt) + 'deg) rotateX(' + (-oy * 7 * amt) + 'deg) translate(' + (-ox * 12 * amt) + 'px,' + (-oy * 12 * amt) + 'px)';
      return;
    }

    // 同步颜色纹理
    if (url !== curUrl) {
      curUrl = url;
      texReady = false;
      depthBound = '';
      setColorTex(url);
    }
    var rec = cacheGet(url);
    if (rec && depthBound !== url) {
      depthBound = url;
      setDepthTex(rec);
    }

    // 尺寸
    var bw = bg.clientWidth || 1, bh = bg.clientHeight || 1;
    var rect = fitLayerToImage(bg, L, bw, bh);
    var w = rect.w || L.clientWidth || bw || 1, h = rect.h || L.clientHeight || bh || 1;
    var dpr = Math.min(2, TOP.devicePixelRatio || 1);
    var pw = Math.round(w * dpr), ph = Math.round(h * dpr);
    if (L.width !== pw || L.height !== ph) {
      L.width = pw;
      L.height = ph;
      gl.viewport(0, 0, pw, ph);
    }
    if (!texReady) { return; }
    gl.useProgram(prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texC);
    gl.uniform1i(uni.iC, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texD);
    gl.uniform1i(uni.iD, 1);
    gl.uniform2f(uni.off, ox * 0.06 * amt, oy * 0.06 * amt);
    var fit = computeUvFit(w, h);
    gl.uniform2f(uni.uvScale, fit.sx, fit.sy);
    gl.uniform2f(uni.uvOffset, fit.ox, fit.oy);
    gl.uniform1f(uni.amt, 1.0);
    gl.uniform1f(uni.hasD, rec ? 1.0 : 0.0);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    // 盖住 bg 自身图 (避免双重)
    bg.style.opacity = '0.001';
    if (bg.parentNode) {
      var wp = bg.parentNode.querySelector('#pp-wallpaper');
      if (wp) wp.style.opacity = '0.001';
    }
  }
  TOP.requestAnimationFrame(loop);
}

var LKEY = 'pp-wallpaper';
function _wpLoadRaw(TOP){
  try{
    var o = JSON.parse(TOP.localStorage.getItem(LKEY) || 'null');
    if(!o) return { imgs:[] };
    if(!o.imgs) o.imgs = [];
    return o;
  }catch(e){ return { imgs:[] }; }
}
function _wpEffective(store){
  var out = [];
  (store.imgs||[]).forEach(function(it){ if(it.enabled !== false) out.push(it); });
  return out;
}
function _wpBuildCfg(ctx){
  var TOP = window.parent;
  var raw = _wpLoadRaw(TOP);
  var cfg = ctx.settings || {};
  return {
    enabled: raw.wallpaperOn !== false,
    mode: 'default',
    order: raw.shuffle ? 'random' : 'seq',
    interval: parseInt(raw.interval,10) || 15,
    currentId: raw.currentId || '',
    pageMode: raw.mode || 'single',
    imageCount: parseInt(cfg.apiImageCount,10) || 3,
    tpl: cfg.apiInjectTemplate || '',
    imgs: _wpEffective(raw),
    spatial: !!cfg.spatialEnabled,
    spatialIntensity: parseInt(cfg.spatialIntensity,10)||60
  };
}

/* ===== 媒体存储：大文件(图片/GIF/视频)存 IndexedDB（不受 localStorage ~5MB 限制） ===== */
function _wpDB(TOP, cb){
  try{
    var idb = TOP.indexedDB; if(!idb){ cb(null); return; }
    var rq = idb.open('pp-wallpaper-db', 1);
    rq.onupgradeneeded = function(){ var db=rq.result; if(!db.objectStoreNames.contains('media')) db.createObjectStore('media'); };
    rq.onsuccess = function(){ cb(rq.result); };
    rq.onerror = function(){ cb(null); };
  }catch(e){ cb(null); }
}
function _wpPut(TOP, key, blob, cb){
  _wpDB(TOP, function(db){
    if(!db){ cb && cb(false); return; }
    try{ var tx=db.transaction('media','readwrite'); tx.objectStore('media').put(blob,key);
      tx.oncomplete=function(){ cb && cb(true); }; tx.onerror=function(){ cb && cb(false); }; }
    catch(e){ cb && cb(false); }
  });
}
function _wpGet(TOP, key, cb){
  _wpDB(TOP, function(db){
    if(!db){ cb(null); return; }
    try{ var tx=db.transaction('media','readonly'); var r=tx.objectStore('media').get(key);
      r.onsuccess=function(){ cb(r.result||null); }; r.onerror=function(){ cb(null); }; }
    catch(e){ cb(null); }
  });
}
function _wpDel(TOP, key){
  if(!key) return;
  _wpDB(TOP, function(db){ if(!db) return; try{ db.transaction('media','readwrite').objectStore('media').delete(key); }catch(e){} });
  try{ if(TOP.__wpObj && TOP.__wpObj[key]){ (TOP.URL||URL).revokeObjectURL(TOP.__wpObj[key]); delete TOP.__wpObj[key]; } }catch(e){}
}
function _wpObjUrl(TOP, key, cb){
  TOP.__wpObj = TOP.__wpObj || {};
  if(TOP.__wpObj[key]){ cb(TOP.__wpObj[key]); return; }
  _wpGet(TOP, key, function(blob){
    if(!blob){ cb(null); return; }
    try{ var u=(TOP.URL||URL).createObjectURL(blob); TOP.__wpObj[key]=u; cb(u); }catch(e){ cb(null); }
  });
}
/* 直接可渲染的 url（http 链接或 dataURL）；IndexedDB 媒体走 _wpObjUrl */
function _wpDirect(it){ return (it && it.src && /^(https?:|data:)/i.test(it.src)) ? it.src : ''; }

/* ===== 壁纸 watcher 引导（pageCode 与 injectCode 共用，会被内联拼接） ===== */
function _wpInstall(TOP, cfg){
  TOP.__vnmWPCfg = cfg;
  if(!cfg || !cfg.enabled){
    if(TOP.__vnmWPTimer){ TOP.clearInterval(TOP.__vnmWPTimer); TOP.__vnmWPTimer=null; }
    _wpTeardown(TOP);
    _wpParallaxTeardown(TOP);
    _wpSyncInject(TOP, cfg);
    return;
  }
  _wpEnsureRegex(TOP);
  _wpSyncInject(TOP, cfg);
  _wpParallaxInstall(TOP,cfg);
  if(TOP.__vnmWPTimer) return;
  TOP.__vnmWPState = TOP.__vnmWPState || { idx:0, last:0, shownKey:null };
  TOP.__vnmWPTimer = TOP.setInterval(function(){ try{ _wpTick(TOP); }catch(e){} }, 600);
}

/* 在酒馆注册一条「仅改显示」的正则，把正文里的 [ImageTag:...] 隐藏掉 */
function _wpEnsureRegex(TOP){
  try{
    var c = TOP.SillyTavern && TOP.SillyTavern.getContext && TOP.SillyTavern.getContext();
    if(!c) return;
    var es = c.extensionSettings; if(!es) return;
    es.regex = es.regex || [];
    var ID = 'pp-wallpaper-hide-imagetag';
    for(var i=0;i<es.regex.length;i++){ if(es.regex[i] && es.regex[i].id===ID) return; }
    es.regex.push({
      id: ID, scriptName: '隐藏壁纸ImageTag',
      findRegex: '/\\[ImageTag:[^\\]]*\\]/g', replaceString: '', trimStrings: [],
      placement: [1,2], disabled: false, markdownOnly: true, promptOnly: false,
      runOnEdit: true, substituteRegex: 0, minDepth: null, maxDepth: null
    });
    if(c.saveSettingsDebounced) c.saveSettingsDebounced();
  }catch(e){}
}

/* ===== 把提示词注入酒馆：用 setExtensionPrompt（与电话App一致，随每次生成发送，
   不依赖VN对话框输入框，普通聊天框发送也会带上）。 ===== */
function _wpInjectText(cfg){
  if(!cfg || !cfg.enabled || cfg.mode !== 'api') return '';
  var imgs = cfg.imgs || []; if(!imgs.length) return '';
  var tags = imgs.map(function(it){
    return '[ImageTag:' + (it.name||'') + ':' + (it.scene||'') + ':' + (it.expr||'') + ':' + (it.action||'') + ']';
  }).join('');
  var n = cfg.imageCount || 3;
  var tpl = cfg.tpl || '';
  if(!tpl){
    tpl = '【壁纸图像系统】当前可用的预设图片标签：{{全部已设置图片信息}}。请你根据剧情内容，在正文中自然穿插与当前场景最接近的图片标签，输出内容必须严格从上述预设标签中原样挑选（一字不差），并在全文中根据剧情进展、贴合当前场景地穿插 {{图像数量}} 个标签。';
  }
  if(tpl.indexOf('{{全部已设置图片信息}}') < 0){ tpl = tpl + '\n可用标签：{{全部已设置图片信息}}'; }
  return tpl.replace(/\{\{全部已设置图片信息\}\}/g, tags).replace(/\{\{图像数量\}\}/g, String(n));
}
function _wpSyncInject(TOP, cfg){
  try{
    var c = TOP.SillyTavern && TOP.SillyTavern.getContext && TOP.SillyTavern.getContext();
    if(!c || !c.setExtensionPrompt) return;
    c.setExtensionPrompt('pp-wallpaper-inject', '', 1, 0); // 统一改走 user input 前缀注入, 不再用 setExtensionPrompt(避免双注入)
  }catch(e){}
}

function _wpFindBg(TOP){
  try{
    var d = TOP.document;
    var b = d.getElementById('pp-bg'); if(b) return b;
    var ifr = d.querySelectorAll('iframe');
    for(var i=0;i<ifr.length;i++){
      try{ var id=ifr[i].contentDocument; if(id){ var bb=id.getElementById('pp-bg'); if(bb) return bb; } }catch(e){}
    }
  }catch(e){}
  return null;
}

/* 壁纸层放在 #pp-bg 之上、#pp-click-layer 之下：
   - 没有智绘姬图时，它直接盖住主文件的渐变底（主文件每翻页重画渐变也看不到，
     不再有变亮/闪烁）；
   - 有智绘姬图时，把壁纸层淡出(opacity:0)，露出下面 bg 上的智绘姬图（优先级更高）。
   完全不再改动 bg 的 style，所以不会与主文件的淡入淡出冲突。 */
/* 修复：主文件对话框 #pp-dialog 用了 backdrop-filter 毛玻璃，翻页重绘时会对着
   后面的壁纸重新采样，Chromium 这种情况会闪一下（底部那条变亮）。给对话框加一个
   will-change 合成提示，让它单独稳定成一层、缓存住毛玻璃采样，不改任何外观。 */
function _wpEnsureFix(doc){
  try{
    if(!doc || doc.getElementById('pp-wp-fix')) return;
    var st = doc.createElement('style'); st.id = 'pp-wp-fix';
    st.textContent = '#pp-dialog{will-change:transform,opacity;}';
    (doc.head || doc.documentElement).appendChild(st);
  }catch(e){}
}

function _wpEnsureLayer(bg){
  var ov = bg.parentNode; if(!ov) return null;
  var doc = bg.ownerDocument;
  _wpEnsureFix(doc);
  var layer = ov.querySelector('#pp-wallpaper');
  if(!layer){
    layer = doc.createElement('div');
    layer.id = 'pp-wallpaper';
    layer.style.cssText = 'position:absolute;inset:0;background-position:center;background-size:cover;background-repeat:no-repeat;opacity:0;pointer-events:none;will-change:transform;';
    var vid = doc.createElement('video');
    vid.id = 'pp-wallpaper-vid';
    vid.loop = true; vid.muted = true; vid.setAttribute('playsinline','');
    vid.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none;';
    layer.appendChild(vid);
    var clickLayer = ov.querySelector('#pp-click-layer');
    if(clickLayer) ov.insertBefore(layer, clickLayer); else ov.appendChild(layer);
  }
  return layer;
}

function _wpHide(layer){
  if(!layer) return;
  layer.style.opacity = '0';
  var v = layer.querySelector('#pp-wallpaper-vid');
  if(v){ try{ v.pause(); }catch(e){} }
  try{var _o=layer.parentNode;if(_o){var _f=_o.querySelector('#pp-wallpaper-fg');if(_f)_f.style.opacity='0';}}catch(e){}
}

/* 返回 true=已显示；false=媒体(IndexedDB)还没加载好，下一帧再试 */
function _wpShow(TOP, layer, item){
  if(!layer || !item) return false;
  var url = _wpDirect(item);
  if(!url && item.media){
    var c = TOP.__wpObj || {};
    url = c[item.media] || '';
    if(!url){ _wpObjUrl(TOP, item.media, function(){}); return false; }
  }
  if(!url) return false;
  var v = layer.querySelector('#pp-wallpaper-vid');
  var key = (item.type||'image') + '|' + url;
  if(layer.__wpKey !== key){
    layer.__wpKey = key;
    if(item.type === 'video'){
      layer.style.backgroundImage = 'none';
      if(v){ v.style.display='block'; if(v.src!==url){ v.src=url; } var p=v.play(); if(p&&p.catch)p.catch(function(){}); }
    }else{
      if(v){ v.style.display='none'; try{v.pause();}catch(e){} v.removeAttribute('src'); }
      layer.style.backgroundImage = 'url("' + String(url).replace(/"/g,'\\"') + '")';
    }
  }else if(item.type==='video' && v){ var p2=v.play(); if(p2&&p2.catch)p2.catch(function(){}); }
  var cfg = TOP.__vnmWPCfg;
  var isSpatial = !!(cfg && cfg.spatial);
  layer.style.opacity = isSpatial ? '0.001' : '1';
  return true;
}

function _wpTeardown(TOP){
  var bg = _wpFindBg(TOP); if(!bg) return;
  var ov = bg.parentNode; if(!ov) return;
  var layer = ov.querySelector('#pp-wallpaper');
  if(layer && layer.parentNode) layer.parentNode.removeChild(layer);
  var _fgl=ov.querySelector('#pp-wallpaper-fg');
  if(_fgl&&_fgl.parentNode)_fgl.parentNode.removeChild(_fgl);
  try{ var fx = bg.ownerDocument.getElementById('pp-wp-fix'); if(fx && fx.parentNode) fx.parentNode.removeChild(fx); }catch(e){}
}

function _wpLatestRaw(TOP){
  try{
    var c = TOP.SillyTavern && TOP.SillyTavern.getContext && TOP.SillyTavern.getContext();
    var ch = c && c.chat; if(!ch) return '';
    for(var i=ch.length-1;i>=0;i--){ if(!ch[i].is_user && !ch[i].is_system) return ch[i].mes||''; }
  }catch(e){}
  return '';
}

function _wpMatchTag(imgs, tagInner){
  if(!imgs || !imgs.length) return null;
  var p = String(tagInner).split(':');
  var name=(p[0]||'').trim(), scene=(p[1]||'').trim(), expr=(p[2]||'').trim(), act=(p[3]||'').trim();
  for(var i=0;i<imgs.length;i++){
    var it=imgs[i];
    if((it.name||'').trim()===name && (it.scene||'').trim()===scene &&
       (it.expr||'').trim()===expr && (it.action||'').trim()===act){ return it; }
  }
  return null;
}

/* 找到「当前显示的这段文字」属于哪一条聊天消息（用户点开的是哪一段就用哪一段），
   返回该消息原文；找不到再回退到最新一条 AI 消息。 */
function _wpFindMsg(TOP, probe){
  try{
    var c = TOP.SillyTavern && TOP.SillyTavern.getContext && TOP.SillyTavern.getContext();
    var ch = c && c.chat; if(!ch) return '';
    if(probe){
      for(var i=ch.length-1;i>=0;i--){
        var m = ch[i]; if(m.is_system) continue;
        var t = (m.mes||'').replace(/\s+/g,'');
        if(t && t.indexOf(probe)>=0) return m.mes||'';
      }
    }
    for(var j=ch.length-1;j>=0;j--){ if(!ch[j].is_user && !ch[j].is_system) return ch[j].mes||''; }
  }catch(e){}
  return '';
}

/* API 模式：先定位当前显示文字所在的消息，再在「那条消息」里往后找最近的 [ImageTag:...]。
   没遇到新 tag 返回 'KEEP' 保持当前图不刷新。 */
function _wpApiItem(TOP, bg, cfg){
  var ov = bg.parentNode;
  var te = ov && ov.querySelector('#pp-text');
  var cur = te ? (te.textContent||'') : '';
  var probe = cur ? cur.replace(/\s+/g,'').slice(0,24) : '';
  var raw = _wpFindMsg(TOP, probe);
  if(!raw) return 'KEEP';
  var rawNoSp = raw.replace(/\s+/g,'');
  var re = /\[ImageTag:([^\]]*)\]/g, m, inner=null;
  var pos = probe ? rawNoSp.indexOf(probe) : -1;
  if(pos>=0){
    var after = rawNoSp.slice(pos);
    var m2 = /\[ImageTag:([^\]]*)\]/.exec(after);
    if(m2){ inner = m2[1]; }
  }
  if(inner===null){
    /* 该段后面没有 tag：取这条消息里最后一个 tag 作为兜底 */
    var last=null; while((m=re.exec(raw))){ last=m[1]; }
    inner = last;
  }
  if(inner===null) return 'KEEP';
  var hit = _wpMatchTag(cfg.imgs, inner);
  return hit || 'KEEP';
}

function _wpDefaultItem(TOP, cfg){
  var imgs = cfg.imgs||[]; if(!imgs.length) return null;
  var st = TOP.__vnmWPState;
  var now = Date.now();
  var ms = Math.max(2, (cfg.interval||15)) * 1000;
  if(!st.last || (now - st.last) >= ms || st.shownKey===null){
    st.last = now;
    if(cfg.order === 'random'){ st.idx = Math.floor(Math.random()*imgs.length); }
    else { st.idx = (st.idx==null?0:(st.idx+1)) % imgs.length; }
  }
  if(st.idx>=imgs.length) st.idx = 0;
  return imgs[st.idx];
}

/* 兜底：把已渲染聊天消息里的 [ImageTag:...] 从文本节点抹掉（仅改显示，不动存档/原文） */
var _WP_TAG_RE = /\[ImageTag:[^\]]*\]/g;
function _wpStripTags(TOP){
  try{
    var ms = TOP.document.querySelectorAll('.mes_text');
    for(var i=0;i<ms.length;i++){
      var el = ms[i]; if(!el.textContent || el.textContent.indexOf('[ImageTag')<0) continue;
      var w = TOP.document.createTreeWalker(el, 4, null);
      var tn, list = [];
      while((tn = w.nextNode())){ if(tn.nodeValue && tn.nodeValue.indexOf('[ImageTag')>=0) list.push(tn); }
      for(var j=0;j<list.length;j++){ list[j].nodeValue = list[j].nodeValue.replace(_WP_TAG_RE, ''); }
    }
  }catch(e){}
}

function _wpTick(TOP){
  var cfg = TOP.__vnmWPCfg;
  if(!cfg || !cfg.enabled){ return; }
  _wpSyncInject(TOP, cfg);
  _wpStripTags(TOP);
  var bg = _wpFindBg(TOP); if(!bg) return;
  var layer = _wpEnsureLayer(bg); if(!layer) return;

  /* 优先级：智绘姬有图 => 壁纸层淡出，露出 bg 上的智绘姬图 */
  var bgi = bg.style.backgroundImage || '';
  if(/url\(/i.test(bgi)){
    _wpHide(layer);
    TOP.__vnmWPState.shownKey = null;
    return;
  }

  var item = null;
  if(cfg.pageMode === 'single'){
    var imgs = cfg.imgs || [];
    for(var i=0;i<imgs.length;i++){
      if(imgs[i].id === cfg.currentId){ item = imgs[i]; break; }
    }
  }else{
    item = _wpDefaultItem(TOP, cfg);
  }

  if(item === 'KEEP'){ return; } /* 没遇到新 tag，保持现状不刷新 */
  if(!item){ _wpHide(layer); TOP.__vnmWPState.shownKey = null; return; }
  var ok = _wpShow(TOP, layer, item);
  if(!ok){ return; }
  _wpShowFg(TOP, layer, item);
  TOP.__vnmWPState.shownKey = layer.__wpKey;
}

/* 注入改用 setExtensionPrompt（在 _wpInstall→_wpSyncInject 里完成，随每次酒馆
   生成发送，不依赖 VN 对话框输入框）。这里只负责确保 watcher/注入是最新的，
   Method A 的前缀注入返回空字符串，避免重复注入。 */


function _wpEnsureFgLayer(ov,doc){
  var fg=ov.querySelector('#pp-wallpaper-fg');
  if(!fg){
    fg=doc.createElement('div');
    fg.id='pp-wallpaper-fg';
    fg.style.cssText='position:absolute;inset:0;background-position:center;background-size:cover;background-repeat:no-repeat;opacity:0;pointer-events:none;will-change:transform;';
    var cl=ov.querySelector('#pp-click-layer');
    if(cl) ov.insertBefore(fg,cl); else ov.appendChild(fg);
  }
  return fg;
}
function _wpShowFg(TOP,layer,item){
  if(!layer) return;
  var ov=layer.parentNode; if(!ov) return;
  var doc=layer.ownerDocument;
  if(!item||!item.hasFg||!item.fgMedia){
    var fg=ov.querySelector('#pp-wallpaper-fg');
    if(fg){fg.style.opacity='0';fg.style.backgroundImage='';}
    return;
  }
  var fgLayer=_wpEnsureFgLayer(ov,doc);
  var fgKey=item.fgMedia;
  function applyFg(u){
    if(!u||!fgLayer) return;
    if(fgLayer.__wpFgKey!==fgKey){
      fgLayer.__wpFgKey=fgKey;
      fgLayer.style.backgroundImage='url("'+String(u).replace(/"/g,'\\"')+'")';
    }
    fgLayer.style.opacity='1';
  }
  var cached=TOP.__wpObj&&TOP.__wpObj[fgKey];
  if(cached) applyFg(cached);
  else _wpObjUrl(TOP,fgKey,applyFg);
}
function _wpParallaxInstall(TOP,cfg){
  _wpParallaxTeardown(TOP);
  if(!cfg||!cfg.enabled||!cfg.spatial) return;
  var maxD=Math.max(1,cfg.spatialIntensity||60)*0.6;
  var par=TOP.__vnmWPPar={mx:0,my:0,cx:0,cy:0,vx:0,vy:0,raf:0};
  function onMouse(e){
    var w=TOP.innerWidth||1920,h=TOP.innerHeight||1080;
    par.mx=((e.clientX/w)-0.5)*2;
    par.my=((e.clientY/h)-0.5)*2;
  }
  function onGyro(e){
    par.mx=Math.max(-1,Math.min(1,(e.gamma||0)/35));
    par.my=Math.max(-1,Math.min(1,((e.beta||45)-45)/35));
  }
  TOP.document.addEventListener('mousemove',onMouse,{passive:true});
  par._mm=onMouse;
  if(typeof TOP.DeviceOrientationEvent!=='undefined'){
    TOP.addEventListener('deviceorientation',onGyro,{passive:true});
    par._go=onGyro;
  }
  var stiff=0.08,damp=0.82;
  function tick(){
    par.raf=TOP.requestAnimationFrame(tick);
    var tx=par.mx*maxD,ty=par.my*maxD;
    par.vx=par.vx*damp+(tx-par.cx)*stiff;
    par.vy=par.vy*damp+(ty-par.cy)*stiff;
    par.cx+=par.vx;par.cy+=par.vy;
    var bg=_wpFindBg(TOP);if(!bg)return;
    var ov=bg.parentNode;if(!ov)return;
    var layer=ov.querySelector('#pp-wallpaper');if(!layer)return;
    layer.style.transform='scale(1.1) translate('+(-par.cx).toFixed(2)+'px,'+(-par.cy).toFixed(2)+'px)';
    layer.style.filter='blur(0.8px)';
    var fgL=ov.querySelector('#pp-wallpaper-fg');
    if(fgL&&parseFloat(fgL.style.opacity)>0){
      fgL.style.transform='scale(1.02) translate('+(-par.cx*0.15).toFixed(2)+'px,'+(-par.cy*0.15).toFixed(2)+'px)';
      fgL.style.filter='';
    }
  }
  par.raf=TOP.requestAnimationFrame(tick);
}
function _wpParallaxTeardown(TOP){
  var par=TOP.__vnmWPPar;if(!par)return;
  if(par.raf)TOP.cancelAnimationFrame(par.raf);
  if(par._mm)TOP.document.removeEventListener('mousemove',par._mm);
  if(par._go)TOP.removeEventListener('deviceorientation',par._go);
  TOP.__vnmWPPar=null;
  try{
    var bg=_wpFindBg(TOP);if(!bg)return;
    var ov=bg.parentNode;if(!ov)return;
    var ly=ov.querySelector('#pp-wallpaper');
    if(ly){ly.style.transform='';ly.style.filter='';}
    var fl=ov.querySelector('#pp-wallpaper-fg');
    if(fl){fl.style.transform='';fl.style.filter='';}
  }catch(e){}
}

var TOP = window.parent;
var _wpCfg = _wpBuildCfg(ctx);
_wpInstall(TOP, _wpCfg);
try {
  var _spOn = !!(ctx.settings && ctx.settings.spatialEnabled);
  var _spCfg = {
    enabled: _spOn,
    intensity: (ctx.settings && ctx.settings.spatialIntensity) || 60,
    cacheN: (ctx.settings && ctx.settings.spatialCacheN) || 8,
    heightAdjust: !!(ctx.settings && ctx.settings.spatialHeightAdjustEnabled),
    heightPercent: (ctx.settings && ctx.settings.spatialHeightPercent) || 100
  };
  TOP.localStorage.setItem("pp-spatial", JSON.stringify(_spCfg));
  _spStartNativeEngine(TOP);
  if(!_spOn){
    var _spBg = _wpFindBg(TOP);
    if(_spBg){ _spBg.style.opacity = ''; _spBg.style.transform = ''; _spBg.style.filter = ''; }
    try{
      var _spDoc = TOP.document;
      var _spCanvas = _spDoc && _spDoc.getElementById('pp-spatial');
      if(_spCanvas && _spCanvas.style) _spCanvas.style.display = 'none';
    }catch(_e){}
  }
} catch(e) {}
return _wpInjectText(_wpCfg);

})
/* __INJECT_END__ */

/* __PAGECODE_BEGIN__ */
(function(ctx){
var LKEY='pp-wallpaper';
function load(){try{var r=JSON.parse(localStorage.getItem(LKEY)||'{}');r.imgs=r.imgs||[];r.mode=r.mode||'single';r.interval=r.interval||15;r.currentId=r.currentId||'';r.shuffle=!!r.shuffle;r.wallpaperOn=r.wallpaperOn!==false;r.overlayOpacity=(r.overlayOpacity==null?55:r.overlayOpacity);return r;}catch(e){return {imgs:[],mode:'single',interval:15,currentId:'',shuffle:false,wallpaperOn:true,overlayOpacity:55};}}
function save(d){try{localStorage.setItem(LKEY,JSON.stringify(d));}catch(e){alert('存储空间不足，请删除一些图片');}applyBg(d);}
function applyBg(d){if(window._ppSyncOverlay)window._ppSyncOverlay();}
function compress(file,cb){
  var img=new Image();
  img.onload=function(){
    var w=img.width,h=img.height;var maxW=1920;
    if(w>maxW){h=h*maxW/w;w=maxW;}
    var c=document.createElement('canvas');c.width=w;c.height=h;
    c.getContext('2d').drawImage(img,0,0,w,h);
    cb(c.toDataURL('image/jpeg',0.85));
  };
  img.src=URL.createObjectURL(file);
}

var d=load(),root=ctx.el('div','');
root.style.cssText='padding:14px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;height:100%;';
function card(t,inner){var c=ctx.el('div','');c.style.cssText='background:rgba(255,255,255,.06);border-radius:14px;padding:12px;';var h=ctx.el('div','');h.style.cssText='font-size:10px;font-weight:600;letter-spacing:1.5px;color:rgba(255,126,179,.8);text-transform:uppercase;margin-bottom:8px;';h.textContent=t;c.appendChild(h);c.appendChild(inner);return c;}

/* 显示设置 */
var dispRow=ctx.el('div','');dispRow.style.cssText='display:flex;flex-direction:column;gap:8px;';
var onRow=ctx.el('div','');onRow.style.cssText='display:flex;justify-content:space-between;align-items:center;font-size:12px;';
var onB=ctx.el('button','ppbtn');onB.style.cssText='padding:4px 14px;font-size:11px;';
function paintOn(){onB.textContent=d.wallpaperOn?'壁纸:开':'壁纸:关';onB.style.background=d.wallpaperOn?'linear-gradient(135deg,#ff7eb3,#ff5c8a)':'rgba(255,255,255,.08)';onB.style.color=d.wallpaperOn?'#fff':'';}
onB.onclick=function(){d.wallpaperOn=!d.wallpaperOn;save(d);paintOn();};
onRow.innerHTML='<span style="color:rgba(255,255,255,.7);">显示壁纸</span>';onRow.appendChild(onB);
var opLbl=ctx.el('div','');opLbl.style.cssText='display:flex;justify-content:space-between;font-size:12px;margin-top:4px;';
opLbl.innerHTML='<span style="color:rgba(255,255,255,.7);">遮罩暗度</span><span style="color:#ff9eb8;font-weight:600;" id="_op">'+d.overlayOpacity+'%</span>';
var op=ctx.el('input','');op.type='range';op.min=0;op.max=100;op.value=d.overlayOpacity;op.style.cssText='width:100%;accent-color:#ff7eb3;';
op.onchange=function(){d.overlayOpacity=+this.value;save(d);root.querySelector('#_op').textContent=this.value+'%';};
op.oninput=function(){root.querySelector('#_op').textContent=this.value+'%';};
dispRow.appendChild(onRow);dispRow.appendChild(opLbl);dispRow.appendChild(op);
root.appendChild(card('显示设置',dispRow));

/* 模式 */
var modeRow=ctx.el('div','');modeRow.style.cssText='display:flex;flex-direction:column;gap:8px;';
var btnWrap=ctx.el('div','');btnWrap.style.cssText='display:flex;gap:6px;';
var bS=ctx.el('button','ppbtn');bS.textContent='单图';
var bM=ctx.el('button','ppbtn');bM.textContent='多图轮播';
var hint=ctx.el('div','');hint.style.cssText='font-size:11px;color:rgba(255,158,184,.8);min-height:16px;';
function paintMode(){
  bS.style.background=d.mode==='single'?'linear-gradient(135deg,#ff7eb3,#ff5c8a)':'rgba(255,255,255,.08)';bS.style.color=d.mode==='single'?'#fff':'';
  bM.style.background=d.mode==='multi'?'linear-gradient(135deg,#ff7eb3,#ff5c8a)':'rgba(255,255,255,.08)';bM.style.color=d.mode==='multi'?'#fff':'';
  hint.textContent=d.mode==='multi'?('轮播中，每'+d.interval+'秒切换，共'+d.imgs.length+'张 (v3-多图修复验证版)'):('单图模式，已添加'+d.imgs.length+'张 (v3-多图修复验证版)');
}
bS.onclick=function(){d.mode='single';save(d);paintMode();};
bM.onclick=function(){if(d.imgs.length<2){hint.textContent='⚠ 至少需要2张图，当前'+d.imgs.length+'张';return;}d.mode='multi';save(d);paintMode();};
btnWrap.appendChild(bS);btnWrap.appendChild(bM);modeRow.appendChild(btnWrap);modeRow.appendChild(hint);
root.appendChild(card('模式',modeRow));

/* 轮播设置 */
var rotRow=ctx.el('div','');rotRow.style.cssText='display:flex;flex-direction:column;gap:8px;';
var ivLbl=ctx.el('div','');ivLbl.style.cssText='display:flex;justify-content:space-between;font-size:12px;';
ivLbl.innerHTML='<span style="color:rgba(255,255,255,.7);">切换间隔</span><span style="color:#ff9eb8;font-weight:600;" id="_iv">'+d.interval+'秒</span>';
var iv=ctx.el('input','');iv.type='range';iv.min=3;iv.max=120;iv.value=d.interval;iv.style.cssText='width:100%;accent-color:#ff7eb3;';
iv.onchange=function(){d.interval=+this.value;save(d);root.querySelector('#_iv').textContent=this.value+'秒';paintMode();};
iv.oninput=function(){root.querySelector('#_iv').textContent=this.value+'秒';paintMode();};
var shRow=ctx.el('div','');shRow.style.cssText='display:flex;justify-content:space-between;align-items:center;font-size:12px;';
var shB=ctx.el('button','ppbtn');shB.style.cssText='padding:4px 12px;font-size:11px;';
function paintSh(){shB.textContent=d.shuffle?'随机:开':'随机:关';shB.style.background=d.shuffle?'linear-gradient(135deg,#ff7eb3,#ff5c8a)':'rgba(255,255,255,.08)';shB.style.color=d.shuffle?'#fff':'';}
shB.onclick=function(){d.shuffle=!d.shuffle;save(d);paintSh();};
shRow.innerHTML='<span style="color:rgba(255,255,255,.7);">随机顺序</span>';shRow.appendChild(shB);
rotRow.appendChild(ivLbl);rotRow.appendChild(iv);rotRow.appendChild(shRow);
root.appendChild(card('轮播设置',rotRow));

/* 添加 */
var addRow=ctx.el('div','');addRow.style.cssText='display:flex;flex-direction:column;gap:8px;';
var pick=ctx.el('button','ppbtn');pick.textContent='选择本地图片';pick.style.cssText='width:100%;padding:10px;';
pick.onclick=function(){
  var fi=document.createElement('input');fi.type='file';fi.accept='image/*';fi.style.display='none';
  document.body.appendChild(fi);
  fi.onchange=function(){
    var f=fi.files[0];document.body.removeChild(fi);
    if(!f)return;
    compress(f,function(src){
      d.imgs.push({id:'i'+Date.now()+Math.random().toString(36).slice(2,6),src:src,name:f.name.slice(0,20),enabled:true});
      if(!d.currentId)d.currentId=d.imgs[d.imgs.length-1].id;
      save(d);renderList();paintMode();
    });
  };
  fi.click();
};
var urlRow=ctx.el('div','');urlRow.style.cssText='display:flex;gap:6px;';
var urlIn=ctx.el('input','');urlIn.placeholder='粘贴图片直链';
urlIn.style.cssText='flex:1;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:8px;color:#fff;font-size:12px;outline:none;';
var urlAdd=ctx.el('button','ppbtn');urlAdd.textContent='添加';urlAdd.style.cssText='padding:8px 14px;';
urlAdd.onclick=function(){
  var u=urlIn.value.trim();if(!u)return;
  d.imgs.push({id:'i'+Date.now(),src:u,name:u.split('/').pop().slice(0,20),enabled:true});
  if(!d.currentId)d.currentId=d.imgs[d.imgs.length-1].id;
  urlIn.value='';save(d);renderList();paintMode();
};
urlRow.appendChild(urlIn);urlRow.appendChild(urlAdd);
addRow.appendChild(pick);addRow.appendChild(urlRow);
root.appendChild(card('添加图片',addRow));

/* 服务器壁纸（自动同步 backgrounds/pp-*） */
var serverRow=ctx.el('div','');serverRow.style.cssText='display:flex;flex-direction:column;gap:8px;';
var serverBtn=ctx.el('button','ppbtn');serverBtn.textContent='刷新服务器壁纸';serverBtn.style.cssText='width:100%;padding:8px;';
var serverHint=ctx.el('div','');serverHint.style.cssText='font-size:11px;color:rgba(255,158,184,.8);min-height:16px;line-height:1.5;';
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
            enabled:true,
            isServer:true
          });
          added++;
        }
      });
      
      var removed=0;
      for(var i=d.imgs.length-1;i>=0;i--){
        if(d.imgs[i].isServer){
          var stillExists=serverImgs.some(function(img){return '/backgrounds/'+img.filename===d.imgs[i].src;});
          if(!stillExists){
            d.imgs.splice(i,1);
            removed++;
          }
        }
      }
      
      if(!d.currentId && d.imgs.length>0) d.currentId=d.imgs[0].id;
      save(d);
      renderList();
      paintMode();
      
      if(added>0||removed>0){
        serverHint.innerHTML+='<br>✓ 同步完成：新增 '+added+' 张，移除 '+removed+' 张';
      }
    })
    .catch(function(err){serverHint.textContent='❌ 加载失败: '+err.message;});
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

/* 列表 */
var listBox=ctx.el('div','');listBox.style.cssText='display:flex;flex-direction:column;gap:6px;';
function renderList(){
  listBox.innerHTML='';
  if(!d.imgs.length){var e=ctx.el('div','');e.style.cssText='text-align:center;padding:16px;color:rgba(255,255,255,.25);font-size:12px;';e.textContent='还没有图片';listBox.appendChild(e);return;}
  d.imgs.forEach(function(img,idx){
    var it=ctx.el('div','');var cur=img.id===d.currentId;
    it.style.cssText='display:flex;align-items:center;gap:10px;padding:6px;background:'+(cur?'rgba(255,126,179,.15)':'rgba(255,255,255,.05)')+';border:1px solid '+(cur?'rgba(255,126,179,.4)':'transparent')+';border-radius:10px;';
    it.draggable=true;
    var th=ctx.el('img','');th.src=img.src;th.style.cssText='width:44px;height:44px;border-radius:8px;object-fit:cover;cursor:pointer;flex-shrink:0;';
    th.onclick=function(){d.currentId=img.id;save(d);renderList();};
    var nm=ctx.el('div','');nm.style.cssText='flex:1;font-size:11px;color:rgba(255,255,255,.6);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
    nm.textContent=(img.name||'图'+(idx+1))+(cur?'  ✓':'');
    var dl=ctx.el('button','ppbtn');dl.textContent='×';dl.style.cssText='width:26px;height:26px;padding:0;font-size:14px;color:rgba(255,255,255,.5);';
    dl.onclick=function(){
      if(img.isServer && img.src){
        var filename=img.src.replace('/backgrounds/','');
        deleteServerWallpaper(filename,function(ok){
          if(!ok) alert('⚠ 从服务器删除失败，但已从列表移除');
        });
      }
      d.imgs.splice(idx,1);if(d.currentId===img.id)d.currentId='';save(d);renderList();paintMode();
    };
    it.appendChild(th);it.appendChild(nm);it.appendChild(dl);
    it.ondragstart=function(e){e.dataTransfer.setData('text/plain',idx);};
    it.ondragover=function(e){e.preventDefault();};
    it.ondrop=function(e){e.preventDefault();var f=+e.dataTransfer.getData('text/plain');if(isNaN(f)||f===idx)return;var item=d.imgs.splice(f,1)[0];d.imgs.splice(idx,0,item);save(d);renderList();};
    listBox.appendChild(it);
  });
}
root.appendChild(card('图片列表（点缩略图设为当前，拖拽排序，×删除）',listBox));
renderList();paintMode();paintSh();paintOn();applyBg(d);
return root;
})
/* __PAGECODE_END__ */

/* __POST_BEGIN__ */
{
  "injectEnabled": true,
  "ppPlugin": true
}
/* __POST_END__ */
