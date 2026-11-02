#!/usr/bin/env node
/* ============================================================================
 * PP Phone Panel — App 构建脚本（方向 A：独立源码 → 打包）
 * 用法:
 *   node build.js pp-radio          # 构建指定 App（写入酒馆运行目录 extension/apps/）
 *   node build.js --all             # 构建全部（src/apps/*.src.js）
 *   node build.js pp-radio --verify # 构建并逐字节对比运行版（一致才通过）
 *
 * 源码目录: src/apps/<id>.src.js（四块标记，见 _scratch/gen_src.js 头注释）
 * 产物目录: 酒馆运行目录 extension/apps/<id>.js
 * 转义: 全文件统一中文原样（JSON.stringify 原生；2026-11-02 重构起统一此风格，
 *       历史 radio 的 \uXXXX 风格已废弃，解码结果等价）
 * ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC_DIR = path.join(ROOT, 'src', 'apps');
// 产物写到酒馆运行目录（加载生效的位置；源码唯一权威在工作区 src/apps/）
const RUN_EXT_APPS = 'E:\\ST\\SillyTavern-1.19.0\\public\\scripts\\extensions\\third-party\\phone-panel\\extension\\apps';
const OUT_DIR = process.env.PP_OUT_DIR || RUN_EXT_APPS;

function parseSrc(src) {
  const markers = {
    meta: ['/* __META_BEGIN__ */', '/* __META_END__ */'],
    inject: ['/* __INJECT_BEGIN__ */', '/* __INJECT_END__ */'],
    pc: ['/* __PAGECODE_BEGIN__ */', '/* __PAGECODE_END__ */'],
    post: ['/* __POST_BEGIN__ */', '/* __POST_END__ */']
  };
  const parts = {};
  for (const k of Object.keys(markers)) {
    const [b, e] = markers[k];
    const bi = src.indexOf(b);
    const ei = src.indexOf(e);
    if (bi < 0 || ei < 0 || ei <= bi) throw new Error('marker not found: ' + k);
    // 标记前/后各有一个 join('\n') 的换行，去掉这 2 个分隔换行，保留块内容本身
    parts[k] = src.slice(bi + b.length, ei).replace(/^\r?\n/, '').replace(/\r?\n$/, '');
  }
  const meta = JSON.parse(parts.meta.trim());
  if (typeof meta !== 'object' || !meta.id) throw new Error('meta invalid');
  let post = {};
  if (parts.post.trim()) post = JSON.parse(parts.post.trim());
  return { meta, injectCode: parts.inject, pageCode: parts.pc, post };
}

// 对象/数组字段：JSON.stringify(v, null, 2) 后每行加 2 空格（对齐顶层字段 2 空格缩进）
function pretty(v) {
  return JSON.stringify(v, null, 2).split('\n').map((l, i) => (i === 0 ? l : '  ' + l)).join('\n');
}

// 按 meta 键原顺序输出字段行（与运行版打包文件字段顺序一致）
function emitFields(obj) {
  const lines = [];
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (Array.isArray(v) || (v !== null && typeof v === 'object')) {
      lines.push('  "' + k + '": ' + pretty(v));
    } else {
      lines.push('  "' + k + '": ' + JSON.stringify(v));
    }
  }
  return lines;
}

function buildOne(id) {
  const srcPath = path.join(SRC_DIR, id + '.src.js');
  if (!fs.existsSync(srcPath)) throw new Error('src not found: ' + srcPath);
  const src = fs.readFileSync(srcPath, 'utf8');
  const { meta, injectCode, pageCode, post } = parseSrc(src);

  const lines = [];
  lines.push('window._builtinApps = window._builtinApps || [];');
  lines.push('window._builtinApps.push({');
  const fieldLines = [];
  fieldLines.push.apply(fieldLines, emitFields(meta));
  fieldLines.push('  "pageCode": ' + JSON.stringify(pageCode));
  if (injectCode) fieldLines.push('  "injectCode": ' + JSON.stringify(injectCode));
  if (post && Object.keys(post).length) fieldLines.push.apply(fieldLines, emitFields(post));
  // 除最后一个字段行外补逗号（JSON 字段分隔）
  fieldLines.forEach((l, i) => lines.push(i === fieldLines.length - 1 ? l : l + ','));
  lines.push('});');
  return lines.join('\n') + '\n';
}

function main() {
  const args = process.argv.slice(2);
  const verify = args.includes('--verify');
  let ids = [];
  if (args[0] === '--all') {
    ids = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.src.js')).map(f => f.replace(/\.src\.js$/, ''));
  } else {
    ids = args.filter(a => !a.startsWith('--'));
  }
  if (!ids.length) { console.error('usage: node build.js <appId> [--verify] | --all'); process.exit(1); }

  let allOk = true;
  for (const id of ids) {
    try {
      const out = buildOne(id);
      const outPath = path.join(OUT_DIR, id + '.js');
      if (verify) {
        const cur = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8') : null;
        if (cur === out) {
          console.log('OK (byte-identical) ' + id + ' → ' + outPath);
        } else {
          console.log('DIFF ' + id + ': build differs from current run file (' + (cur ? cur.length : 'N/A') + ' vs ' + out.length + ')');
          allOk = false;
        }
      } else {
        fs.writeFileSync(outPath, out, 'utf8');
        console.log('BUILT ' + id + ' → ' + outPath + ' (' + out.length + ' chars)');
      }
    } catch (e) {
      console.error('FAIL ' + id + ': ' + e.message);
      allOk = false;
    }
  }
  if (!allOk) process.exit(2);
}

main();
