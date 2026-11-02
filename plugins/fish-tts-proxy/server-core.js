/**
 * 共用逻辑：创建一个只做 Fish Audio TTS 转发的原始 http.Server。
 * 被两个入口复用：
 *   - fish-tts-proxy.js（手动双击 启动.bat 运行的独立进程）
 *   - index.js（作为酒馆服务端插件，随酒馆自动启动）
 *
 * 两种用法跑的是完全一样的这段代码、监听同一个端口，性能没有任何区别，
 * 区别只在于"谁来启动这个进程"。
 */

const http = require('http');
const { execFile } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

/* 上游代理：Fish Audio 是海外服务，国内直连通常不通（实测直连 15s 超时）。
 * Node 全局 fetch 既不走系统代理，也无法在进程内临时设置环境变量让 undici
 * 生效（undici 启动时即缓存代理配置，实测无效），因此上游请求改用 curl.exe
 * 显式带 --proxy 转发，最稳，不依赖任何第三方 npm 包。
 *
 * 代理地址优先级：VNM_FISH_UPSTREAM_PROXY 环境变量 > 启动时探测常见本地代理
 * 端口（7890/1080/10808）> 直连（探测不到时，按用户未开代理处理）。 */
let _proxyUrl = null;
let _proxyProbedAt = 0;
function probeUpstreamProxy(cb) {
  if (_proxyUrl) { if (cb) cb(); return; }
  const now = Date.now();
  if (_proxyProbedAt && now - _proxyProbedAt < 30000) { if (cb) cb(); return; }
  _proxyProbedAt = now;
  const forced = process.env.VNM_FISH_UPSTREAM_PROXY;
  if (forced) {
    _proxyUrl = forced;
    if (cb) cb();
    return;
  }
  const net = require('net');
  const candidates = ['http://127.0.0.1:7890', 'http://127.0.0.1:1080', 'http://127.0.0.1:10808'];
  let idx = 0;
  function tryNext() {
    if (idx >= candidates.length) {
      if (cb) cb();
      return;
    }
    const c = candidates[idx++];
    const m = c.match(/^http:\/\/([\d.]+):(\d+)$/);
    if (!m) { tryNext(); return; }
    const sock = net.connect({ host: m[1], port: parseInt(m[2], 10), timeout: 400 });
    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      sock.destroy();
      if (ok) {
        _proxyUrl = c;
        console.log('[vnm-fish-tts-proxy] 检测到本地代理 ' + c + '，Fish 上游将走该代理。');
        if (cb) cb();
        return;
      }
      tryNext();
    };
    sock.once('connect', () => finish(true));
    sock.once('timeout', () => finish(false));
    sock.once('error', () => finish(false));
  }
  tryNext();
}

/**
 * 通过 curl.exe 转发一次 Fish Audio TTS 请求。
 * 返回 Promise<{ status:number, body:Buffer }>，body 为完整响应体。
 */
function fishTTSRequest(apiKey, model, payloadJson) {
  return new Promise((resolve, reject) => {
    const stamp = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    const tmpIn = path.join(os.tmpdir(), 'fish-tts-in-' + stamp + '.json');
    const tmpOut = path.join(os.tmpdir(), 'fish-tts-out-' + stamp + '.bin');
    fs.writeFile(tmpIn, payloadJson, (werr) => {
      if (werr) return reject(werr);
      const args = [
        '-s', '--max-time', '90',
        '-X', 'POST', 'https://api.fish.audio/v1/tts',
        '-H', 'Content-Type: application/json',
        '-H', 'Authorization: Bearer ' + apiKey,
        '-H', 'model: ' + (model || 's2.1-pro'),
        '--data-binary', '@' + tmpIn,
        '-o', tmpOut,
        '-w', '%{http_code}',
      ];
      if (_proxyUrl) args.push('--proxy', _proxyUrl);
      execFile('curl.exe', args, (cerr, stdout) => {
        fs.unlink(tmpIn, () => {});
        if (cerr) {
          fs.unlink(tmpOut, () => {});
          return reject(new Error('curl 调用失败: ' + (cerr.message || String(cerr))));
        }
        const status = parseInt((stdout || '').trim(), 10) || 500;
        fs.readFile(tmpOut, (rerr, body) => {
          fs.unlink(tmpOut, () => {});
          if (rerr) return reject(rerr);
          resolve({ status, body });
        });
      });
    });
  });
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function requestHandler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, proxy: 'vnm-fish-tts-proxy', upstreamProxy: _proxyUrl || '' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/tts') {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', async () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '请求体不是合法 JSON' }));
          return;
        }
        const { apiKey, model, payload } = parsed || {};
        if (!apiKey) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '缺少 Fish Audio API Key' }));
          return;
        }
        if (!payload || typeof payload !== 'object') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '缺少请求体 payload' }));
          return;
        }

        /* 每次 TTS 请求前确保代理可用：启动时探测可能早于梯子就绪而失败，
         * 这里请求时再探测（30 秒冷却防高频），梯子后来开了也能自动接上。 */
        await new Promise((resolve) => probeUpstreamProxy(resolve));

        const upstream = await fishTTSRequest(apiKey, model, JSON.stringify(payload));

        if (upstream.status !== 200) {
          let msg = upstream.body.toString('utf8') || ('Fish Audio HTTP ' + upstream.status);
          try {
            const j = JSON.parse(msg);
            if (j && j.message) msg = j.message;
            else if (j && j.error) msg = j.error;
          } catch (e2) { /* not json */ }
          res.writeHead(upstream.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: msg }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'audio/mpeg' });
        res.end(upstream.body);
      } catch (e) {
        console.error('[vnm-fish-tts-proxy]', e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: (e && e.message) || String(e) }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
}

/**
 * 启动服务器。返回 http.Server 实例（可以自己 .close() 掉）。
 * 端口被占用（比如手动开了一份，插件又想再开一份）时不会报错崩掉整个进程，
 * 只是打一行日志说明已经有一个在跑了。
 */
function startServer(port, host) {
  host = host || '0.0.0.0';
  probeUpstreamProxy();
  const server = http.createServer(requestHandler);
  server.on('error', (e) => {
    if (e && e.code === 'EADDRINUSE') {
      console.log('[vnm-fish-tts-proxy] 端口 ' + port + ' 已经有进程在监听了（可能你手动开了一份），跳过，不重复启动。');
    } else {
      console.error('[vnm-fish-tts-proxy] 启动失败:', e);
    }
  });
  server.listen(port, host, () => {
    const address = server.address();
    const listenPort = address && address.port ? address.port : port;
    console.log('[vnm-fish-tts-proxy] 已启动，监听 ' + host + ':' + listenPort);
    if (host === '0.0.0.0' || host === '::') {
      console.log('[vnm-fish-tts-proxy] 局域网设备请使用 http://<这台电脑的局域网IP>:' + listenPort);
    }
  });
  return server;
}

module.exports = { startServer };
