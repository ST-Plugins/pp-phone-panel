# PP Phone Panel（皮皮小手机）

SillyTavern 的「手机」扩展 —— 在电脑上给你一个拟物手机界面：电台、通讯录/聊天、天气、壁纸、任务、浏览器等。

A "phone" extension for SillyTavern — a desktop phone-style UI with radio (with language auto-fix), contacts/chat, weather, wallpaper, quests, browser, and more.

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
| 电台 Radio | 台本播放；语言检测自检修复（纯文本翻译方案，默认模型 `Pro/deepseek-ai/DeepSeek-V3.2`，60s 超时保护，人名读音规则） |
| 通讯录/聊天 Contacts / Chat | 与酒馆角色真实数据打通（头像、世界书、人设同步），聊天记录存酒馆 jsonl |
| 天气 Weather | 城市天气（需自填 API） |
| 壁纸 Wallpaper | 多图轮播、悬浮窗状态持久化 |
| 任务 Quests | 角色任务列表 |
| 浏览器 Browser | 内置网页浏览器 |

---

## 配置 Configuration

- **电台 / 聊天 AI**：在扩展设置页填写 API 地址、Key、模型。语言修复默认模型为 `Pro/deepseek-ai/DeepSeek-V3.2`（硅基流动 SiliconFlow）。
- **fish TTS**：默认 `http://127.0.0.1:8765`（代理随 ST 启动）。
- 需要联网的模块（天气等）请自行准备对应的 API Key。

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

Copyright (c) 2026 PP Phone Panel contributors
