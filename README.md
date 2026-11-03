# PP Phone Panel（皮皮小手机）

SillyTavern 的「手机」扩展 —— 在电脑上给你一个拟物手机界面：电台、通讯录/聊天、天气、壁纸、任务、浏览器等。

A "phone" extension for SillyTavern — a desktop phone-style UI with radio (language auto-fix & cache), contacts/chat, weather, wallpaper, quests, browser, and more.

---

## 来源与致谢 Source & Credits

本项目基于 **白桃（LAWLEITLIGHT）的 [VisualNoval](https://github.com/LAWLEITLIGHT/VisualNoval)**（MIT License）二次开发而来，在保留原有"拟物手机 + 视觉小说"核心体验的基础上，重构为独立的 SillyTavern 第三方扩展，并新增电台、AI 聊天、语音缓存、语言自检修复等能力。

This project is a derivative work of [VisualNoval](https://github.com/LAWLEITLIGHT/VisualNoval) by 白桃 (LAWLEITLIGHT), licensed under MIT. See `LICENSE`.

---

## 安装 Installation

### 方式一：手动安装（推荐 / Recommended）

1. 下载本仓库 ZIP 并解压，得到 `phone-panel/` 目录。
2. 把 `manifest.json` 和 `extension/` 整个目录复制到：

   ```
   SillyTavern/public/scripts/extensions/third-party/phone-panel/
   ```

3. （可选，使用电台语音时需要）启用 fish TTS 代理：

   - 把 `plugins/fish-tts-proxy/` 整个目录复制到：

     ```
     SillyTavern/plugins/
     ```

   - 编辑 `SillyTavern/config.yaml`，确保：

     ```yaml
     enableServerPlugins: true
     ```

   - 重启 SillyTavern。代理默认运行在 `http://127.0.0.1:8765`。

4. 刷新 SillyTavern，在扩展面板中启用 **PP Phone Panel**。

### Installation steps (EN)

1. Download & unzip this repo ZIP → you get a `phone-panel/` folder.
2. Copy `manifest.json` + the whole `extension/` folder into:

   ```
   SillyTavern/public/scripts/extensions/third-party/phone-panel/
   ```

3. (Optional, needed for radio voice) Enable the fish TTS proxy:

   - Copy the whole `plugins/fish-tts-proxy/` folder into:

     ```
     SillyTavern/plugins/
     ```

   - Edit `SillyTavern/config.yaml` and make sure:

     ```yaml
     enableServerPlugins: true
     ```

   - Restart SillyTavern. The proxy runs at `http://127.0.0.1:8765` by default.

4. Refresh SillyTavern and enable **PP Phone Panel** in the extension panel.

---

## 功能 Features

| 模块 Module | 说明 Description |
| --- | --- |
| 电台 Radio | 多主持人台本/连线/单曲；**朗读语言自动检测修复**（播放前自检 + 台本库「语言检测修复」按钮）；**日文朗读人名读音归一**（如"杰"→すぐる/Suguru，可自定义映射，独立成词才替换防误伤）；**语音缓存**（IndexedDB + 可选本地目录落盘，播放自动缓存、第二次命中）；**请求超时可配置**（默认 300s，适配 250s+ 大台本） |
| 通讯录/聊天 Contacts / Chat | 与酒馆角色真实数据打通（头像、世界书、人设同步）；**真实 AI 回复**（状态栏/旁白/对话结构化渲染，含"正在输入…"反馈）；聊天记录存酒馆 jsonl |
| 天气 Weather | 城市天气（需自填 API） |
| 壁纸 Wallpaper | 多图轮播、悬浮窗状态持久化 |
| 任务 Quests | 角色任务列表 |
| 浏览器 Browser | 内置网页浏览器 |

---

## 配置 Configuration

- **电台 / 聊天 AI**：在扩展设置页填写 API 地址、Key、模型（兼容 OpenAI 格式，如硅基流动 SiliconFlow）。
- **电台请求超时**：设置 → 生成参数 →「请求超时（秒）」，默认 300，范围 15~600（**单位是秒**，代码按秒转毫秒计算）。
- **电台朗读语言**：设置 → 语言与节点规则；角色详情可单独设「朗读语言」（日文/中文/英文等）；台本生成前自动按角色语言约束。
- **日文朗读人名读音替换**：设置 → 覆盖 TTS →「日文朗读人名读音替换」。默认已配 `五条=ごじょう / 杰=すぐる / 傑=すぐる / 悟=さとる / 悟り=さとり / 悟る=さとる / 悟った=さとった / 夏油=げとう`，可自行增删或改用罗马音。**仅朗读语言为日文时生效；人名独立成词才替换**（"杰……""杰は"替换，"杰出"等含同字的词组不误伤）；若台词含日文常用词（如"悟り"），加一行整词替换即可（长词优先匹配）。「语言检测修复」同样会检测日文台词中的汉字人名并重写为假名（写回台本库，播一次永久修正）。
- **fish TTS**：默认 `http://127.0.0.1:8765`（代理随 ST 启动），支持 MiniMax / Fish Audio。
- 需要联网的模块（天气等）请自行准备对应的 API Key。

---

## 版本记录 Changelog

### v1.2.1（2026-11-04）

- **长台本本地播放列表修复**：已存台本可连续「加入播放列表」多个；单条 × 可正常移除（修复因保存时列表引用重建、按钮点击写入旧数组导致"只能加一个/删不掉"的问题）
- **人名读音增强**：默认映射升级为片假名专名 + 整体三字名键（五条悟→ゴジョウサトル、夏油杰→ゲトウスグル、杰→スグル、悟→サトル）；修复"杰"被拆走、三字名（夏油杰/五条悟）朗读中间停顿的问题；旧默认配置自动迁移，含同字普通词（杰出/悟り等）仍不误伤
- **纯 AI 语言校对**：「语言检测修复」升级为整体 AI 校对（语言 + 人名读音双校对，含校对前预检摘要）
- **收藏=锁定保护**：收藏的台本重新生成/导入时跳过、保持当前台本内容不变；歌曲/台本页顶部统一「重新生成整组 / 语言检测修复整组」
- **UI 修复**：台本编辑区字重叠（grid 排版）、歌曲卡片「删除一段」按钮折行显示等
- **index.js 稳定性**：修复内置应用同步函数的作用域告警

### v1.2.0（2026-11-04）

- **人物称呼规则（运行时框架）**：提示词新增「人物与称呼规则（最高优先级）」——禁止全名/姓氏/错误称呼互称，依人物关系用名字简称（示例：五条悟对夏油杰称"杰"、夏油杰对五条悟称"悟"）；旧配置自动迁移；语言修复提示词同步强化
- **日文朗读人名读音归一**：日文台词汉字人名（"杰"被 TTS 念成中文"杰"）在播放时自动按映射表替换为假名/罗马音（杰→すぐる、悟→さとる、五条→ごじょう、夏油→げとう）；设置项可自定义映射
- **替换防误伤（独立成词边界 + 词保护行）**：人名前后是汉字词组（"杰出"）不替换，连续人名（"五条悟"→ごじょうさとる）照常分步替换；"悟り/悟る/悟った"等日文常用词默认保护；繁体"傑"默认支持
- **「语言检测修复」扩展**：除语言外新增「人名读音」检测维度——日文台词含汉字人名即标记，一键重写为假名并写回台本库；播放旧台本自动整版修复落库（播一次永久修正）；词保护行不算人名不误报
- **缓存键基于归一后读音文本**：旧错误缓存自动作废，新缓存为正确发音且稳定命中，不重复烧语音 API

### v1.1.0（2026-11-03）

- **电台请求超时单位换算修复**：设置里填 300 秒不再被当 300ms 而恒 15 秒掐断；秒→毫秒正确换算，适配 250s+ 大台本/连线
- 朗读前语言自检扩展到单曲/收藏播放、连线聊天朗读（本地毫秒级检测，失败降级继续）
- 「清除应用内缓存」彻底化：同时清除浏览器 IndexedDB 与本地目录落盘 mp3
- 语音缓存：播放自动写入 IndexedDB + 可选本地目录；读取优先级 IndexedDB → 本地目录 → 重新生成
- 台本库「+」稳健化（重复提示/已加入高亮）；连线聊天状态反馈（正在回复/失败）
- 电话通讯录仅显示已添加好友 + 中文拼音分组；TTS 设置/世界书首开动画优化；移动端窄屏适配

### v1.0.0（2026-11-03）

- 首版发布：7 个 App 源码化（`src/apps/*.src.js` + `build.js` 构建），统一 AI 调用层，清理过渡代码
- 语言修复链路落地（纯文本翻译 + 人名读音 + 回调根因修复）
- 聊天接入真实 AI 回复、删除全部假数据、聊天记录同步酒馆 jsonl

---

## 开发者 Developer

- 权威源码在 `src/apps/*.src.js`（唯一改代码入口），构建脚本：

  ```bash
  node build.js pp-radio     # 构建单个 App 到运行目录
  node build.js --all        # 构建全部
  node build.js --verify     # 验证构建产物与运行版一致
  ```

- 在你的机器上构建时（源码不在默认路径下），用环境变量指定输出目录：

  ```bash
  set PP_OUT_DIR=D:\path\to\SillyTavern\public\scripts\extensions\third-party\phone-panel\extension\apps
  node build.js --all
  ```

- 语言修复算法单测：`_scratch/test_lang_fix.js`（20/20 PASS）。
- 内部迭代记录：`backups/备份说明.md`。

---

## 许可 License

MIT License — see `LICENSE` file.

- Copyright (c) 2026 PP Phone Panel contributors
- Copyright (c) 2026 LAWLEITLIGHT (白桃) — original VisualNoval, MIT

**二次开发说明**：本项目基于 VisualNoval（MIT）二改；遵循 MIT 许可，允许修改与再分发，分发时需保留上述版权声明与许可文本。
