/* ============================================================================
 * PP Phone Panel — 电台 (pp-radio) 独立源码
 * 版本: 3.10.11-langfix
 * 说明: 本文件是权威源码，改代码改这里，然后用 node build.js pp-radio 生成
 *       extension/apps/pp-radio.js。不要直接改打包文件。
 * ============================================================================ */

/* __META_BEGIN__ */
{
  "id": "pp-radio",
  "name": "电台",
  "version": "3.10.13-callfix",
  "description": "多主持人私人电台 · 陪伴模式自动起播 · 歌单耗尽整表循环 · 全局本地台本与歌曲台本版本管理",
  "icon": "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M5.64 18.36a9 9 0 0 1 0-12.72\"/><path d=\"M18.36 5.64a9 9 0 0 1 0 12.72\"/><path d=\"M8.46 15.54a5 5 0 0 1 0-7.08\"/><path d=\"M15.54 8.46a5 5 0 0 1 0 7.08\"/>",
  "enabled": true,
  "settingsTitle": "电台设置",
  "settingsFields": [
    {
      "group": "电台",
      "key": "radioEnabled",
      "type": "toggle",
      "label": "启用电台（其余设置在电台内 Made for You 页）",
      "default": true
    }
  ],
  "settingsValues": {
    "promptTemplate": "你是专业的电台台本写作者，接下来你要为用户选择的角色进行台本的创作。台本的内容不是正式广播节目，而是角色本人陪 {{用户名称}} 一起听歌、聊天、换歌前后自然聊天。\n\n【主持人】\n{{主持人列表}}\n\n如果有多个主持人，就把他们视为正在同一个私人电台空间里陪用户听歌。他们可以轮流说话、互相接话，也可以回应用户；不要受主线剧情中是否在场的限制。\n\n{{用户信息}}\n\n【角色与世界背景】\n{{角色设定}}\n{{世界书}}\n\n【电台专用世界书】\n{{电台世界书}}\n\n{{剧情上下文}}\n\n【用户音乐偏好】\n{{音乐偏好}}\n\n【近期已播放曲目禁止重复】\n{{近期已播放曲目禁止重复}}\n\n{{最近主播对话}}\n\n【用户本次要求】\n{{用户输入}}\n\n请选择 {{请求曲数}} 首真实存在的歌曲，并为每首歌曲写一段角色对用户说的台本。\n\n选歌要求：\n1. 歌曲必须真实存在，歌名和艺术家必须准确。\n2. 除非用户明确要求，否则不要推荐 Live、Remix、Cover、伴奏或同名翻唱版本。\n3. 结合用户要求、音乐偏好、最近对话、剧情氛围和角色性格选歌。\n4. 不要编造音频地址、歌曲 ID、平台来源或搜索链接。播放器会根据歌名和艺术家自行搜索音源。\n\n台本要求：\n1. 台本重点是角色本人和 {{用户名称}} 的相处感，像角色陪用户一起听歌时自然说的话。\n2. 不要写成主持人报幕、正式广播、歌曲百科、音乐史或专业乐评。\n3. 可以回应最近对话、用户心情和剧情氛围，也可以让多个主持人自然接话。\n4. host 必须使用【主持人】中出现的角色名字。\n5. VoiceTag 内的发送文本必须只使用 {{朗读语言}}；中文弯引号中的显示文本必须只使用 {{显示语言}}。\n\n最终只返回一个合法 JSON 对象。不要 Markdown，不要代码块，不要解释，不要标题，也不要输出 JSON 之外的文字。\n\n返回格式必须严格如下：\n{\"items\":[{\"host\":\"主持人名字\",\"say\":\"[VoiceTag:主持人名字:{{朗读语言}}:发送文本]“显示文本”\",\"song\":{\"title\":\"真实歌名\",\"artist\":\"真实艺术家\"},\"reason\":\"简短的内部选歌备注\"}]}\n\n字段规则：\n- items 数量必须等于 {{请求曲数}}。\n- song 对象只能包含 title 和 artist 两个字段。\n- 不要输出 url、query、id、source、platform 或其他歌曲字段。\n- JSON 中所有字符串必须正确转义并完整闭合。\n\n【动态任务模块】\n{{当前任务要求}}\n{{随机播放要求}}\n{{歌词检索要求}}\n{{输出格式要求}}",
    "__radioPromptV3": true,
    "__radioPromptV4": true,
    "batchSize": 10,
    "leadSeconds": 0,
    "backgroundPlayback": true,
    "autoRequest": true,
    "loopPlaylist": false,
    "recentDedupeCount": 30,
    "playHistoryLimit": 30,
    "scriptHistoryMax": 3,
    "updateScripts": false,
    "musicVolume": 100,
    "speechDuck": true,
    "duckVolume": 20,
    "captionOnFloat": true,
    "captionTopRight": false,
    "popupFontSize": 13,
    "voiceLanguage": "中文",
    "displayLanguage": "中文",
    "chatBilingual": false,
    "chatRecentMessages": 10,
    "chatSummaryBatch": 40,
    "recommendChatMessages": 6,
    "contextSource": [
      "st",
      "horae"
    ],
    "stHistN": 1,
    "radioWbIds": "",
    "musicLibrary": "{\"title\":\"示例歌曲\",\"artist\":\"可替换歌手\",\"url\":\"https://example.com/song.mp3\",\"tags\":\"安静,夜晚\",\"note\":\"把这一行换成真实可播放 mp3/flac/ogg 直链\"}\n歌名 | 歌手 | https://example.com/song.mp3 | 标签或备注",
    "tasteDistillPrompt": "请根据用户输入、收藏曲目和最近播放记录，蒸馏出一个可以长期用于私人电台推荐的音乐偏好提示词。\n\n要求：\n1. 输出中文，80-220字。\n2. 不要写成列表，不要解释你的过程。\n3. 保留用户明确喜欢/不喜欢的曲风、语言、年代、情绪、节奏、歌手/作品倾向。\n4. 如果信息不足，就谨慎概括，不要编造。\n\n【用户输入】\n{{用户输入}}\n\n【已有偏好】\n{{音乐偏好}}\n\n【收藏曲目】\n{{收藏曲目}}\n\n【最近播放】\n{{最近播放}}",
    "scriptRewritePrompt": "你正在为已经确定要播放的曲目补写角色台词。不要推荐新歌，不要改变曲目，只给每首给定曲目写一段角色说给用户听的话。\n\n【主持人】\n{{主持人列表}}\n\n如果有多个主持人，就默认他们都在这个“陪你听歌”的小空间里。可以互相对话、一起跟用户聊天。不要受主线剧情在场逻辑限制。\n\n{{用户信息}}\n\n【角色与世界背景】\n{{角色设定}}\n{{世界书}}\n\n{{剧情上下文}}\n\n【用户音乐偏好】\n{{音乐偏好}}\n\n【最近聊天】\n{{最近主播对话}}\n\n【需要补台词的曲目】\n{{曲目列表}}\n\n写作方向：\n- 像角色陪 user 一起听这首歌，不要写成正式节目串场。\n- 不要主动讲音乐史、发行背景、榜单、专业乐评，除非用户明确要求。\n- 可以回应最近聊天、剧情气氛、用户偏好，但语气要自然。\n\n最终回复只能是一个 JSON 对象，从 { 开始，到 } 结束。不要 Markdown，不要解释，不要标题，不要说“下面是”。\n\n输出格式例子如下，例子里的 {{变量}} 是占位符，实际返回时请替换成真实内容：\n{\"scripts\":[{\"key\":\"{{曲目key}}\",\"host\":\"{{主持人名字}}\",\"say\":\"[VoiceTag:{{主持人名字}}:{{朗读语言}}:{{发送文本}}]“{{显示文本}}”\"}]}\n\n填写要求：\n- 每个 scripts 对象必须对应【需要补台词的曲目】里的一首歌，key 必须原样使用给定的曲目 key。\n- host 必须来自【主持人】。\n- {{发送文本}} 必须只使用 {{朗读语言}}，这是发给 MiniMax TTS 的内容。\n- {{显示文本}} 必须只使用 {{显示语言}}，这是给用户看的字幕。\n- say 内部字幕必须用中文弯引号 “ ”，不要用英文直引号 \" \" 包字幕。\n- JSON 字符串外层仍然必须使用英文双引号。\n\n【动态任务模块】\n{{当前任务要求}}\n{{随机播放要求}}\n{{歌词检索要求}}\n{{输出格式要求}}",
    "radioChatPrompt": "你正在扮演被用户选中的角色，和 {{用户名称}} 一边听歌一边聊天。这里只回复聊天内容，不推荐新曲目，不输出歌曲。\n\n【主持人】\n{{主持人列表}}\n\n如果有多个主持人，就默认他们都在聊天现场。可以一人回答，也可以多人接话互动；不要受主线剧情在场逻辑限制。\n\n{{用户信息}}\n\n【角色与世界背景】\n{{角色设定}}\n{{世界书}}\n\n{{剧情上下文}}\n\n【用户音乐偏好】\n{{音乐偏好}}\n\n【最近播放曲目】\n{{最近播放曲目}}\n\n【已总结的聊天】\n{{聊天总结}}\n\n【最近聊天】\n{{最近主播对话}}\n\n【用户刚说】\n{{用户输入}}\n\n写作方向：\n- 像角色本人直接回应 user，不要写成主持人连线、节目采访或正式播音。\n- 可以顺着正在听歌的氛围说，但重点是和 user 说话。\n- 不要主动讲音乐史、发行背景、榜单、专业乐评，除非用户明确要求。\n\n最终回复只能是一个 JSON 对象，从 { 开始，到 } 结束。不要 Markdown，不要解释，不要标题，不要说“下面是”。\n\n输出格式例子如下，例子里的 {{变量}} 是占位符，实际返回时请替换成真实内容：\n{\"replies\":[{\"host\":\"{{主持人名字}}\",\"say\":\"[VoiceTag:{{主持人名字}}:{{朗读语言}}:{{发送文本}}]“{{显示文本}}”\"}]}\n\n主持人存在多人的情况请让角色按场景自然参加。不要只一个人讲话。根据用户这句话和最近聊天，自然判断哪些主持人该说话：可以一个人说，也可以多人接话，也可以有人不发言；不要固定顺序，不要重复上一轮发言模式。用户 @ 到的主持人必须发言。\n\n填写要求：\n- replies 数量按场景自然决定，通常 1-3 条；每条 host 必须来自【主持人】。\n- {{发送文本}} 必须只使用 {{朗读语言}}，这是发给 MiniMax TTS 的内容。\n- {{显示文本}} 必须只使用 {{显示语言}}，这是给用户看的字幕。\n- say 内部字幕必须用中文弯引号 “ ”，不要用英文直引号 \" \" 包字幕。\n- JSON 字符串外层仍然必须使用英文双引号。",
    "radioChatSummaryPrompt": "请把私人电台主播与用户的旧对话整理成连续记忆摘要，保留用户偏好、情绪、承诺、重要剧情联系、刚才聊到的歌和主播表达过的态度。不要列表，不要解释，120-260字。\n\n【旧总结】\n{{旧总结}}\n\n【新增对话】\n{{对话内容}}",
    "gdMusicApiBase": "https://music-api.gdstudio.xyz/api.php",
    "useOwnApi": false,
    "ownApiUrl": "",
    "ownApiKey": "",
    "useOwnModel": false,
    "ownModel": "",
    "temperature": 0.9,
    "maxTokens": 20000,
    "ttsProviderOverride": "",
    "ttsJpNameMap": "五条悟=ゴジョウサトル\n夏油杰=ゲトウスグル\n夏油傑=ゲトウスグル\n五条=ゴジョウ\n杰=スグル\n傑=スグル\n悟=サトル\n悟り=さとり\n悟る=さとる\n悟った=さとった\n夏油=ゲトウ",
    "useOwnTts": false,
    "ownTtsKey": "",
    "ownTtsGid": "",
    "ownFishKey": "",
    "barAlbumGlass": true,
    "barLyrics": true,
    "orbLyrics": true,
    "lyricsStyle": "fume",
    "keepModeOnVnExit": false,
    "autoRetry": true,
    "retryCount": 2,
    "radioTtsEnabled": true,
    "tasteEnabled": true,
    "leftCardImage": "",
    "artistChatPrompt": "你正在扮演{{角色名称}}与{{用户名称}}进行对话。\n【角色设定】\n{{角色名称}}\n{{角色设定}}\n{{用户信息}}\n【世界背景信息】\n{{世界书}}\n【当前{{用户名称}}经历】\n{{酒馆历史}}\n【最近对话】\n{{对话内容}}\n请用简短自然的口语风格回复，20字以内，不使用任何 Markdown 格式，只说话不描述动作。",
    "artistDepth": 10,
    "artistInjectN": 8,
    "__radioDefaults_v2_5_5": true,
    "v3IncludeUserInfo": true,
    "v3IncludeStoryContext": true,
    "v3ShortPersonaEnabled": false,
    "v3OmitRecentHostTalk": false,
    "v3CompanionAutoRequest": true,
    "v3ScriptRetryCount": 1,
    "v3CompanionWords": 3000,
    "v3PauseMinCount": 3,
    "v3PauseMaxCount": 8,
    "v3PauseMinSeconds": 5,
    "v3PauseMaxSeconds": 30,
    "v3TtsPrefetch": 2,
    "v3TaskModulePrompt": "请严格执行当前请求模式定义的任务；不要额外推荐用户没有要求的内容。",
    "v3RandomModulePrompt": "当前曲目将以随机顺序播放。每首歌曲的台本必须能够独立成立，不得引用上一首或下一首，不得使用“刚才那首”“接下来”“延续前面的话题”等依赖固定顺序的表达。不同歌曲之间不得形成必须按顺序理解的情节、对话或情绪递进。",
    "v3LyricsModulePrompt": "你可以根据准确的歌名和歌手自行尝试回忆或查找歌词来理解歌曲；如果无法可靠找到，就忽略歌词。禁止编造歌词、伪造歌词内容或假装已经找到。",
    "v3CompanionPrompt": "你是专业的私人电台陪伴台本写作者。请为 {{主持人列表}} 写一份专业的电台陪伴类主持台本，让这些角色共同主持一段可以持续播放的长篇陪伴节目。\n这里是一个独立、假设性的私人电台世界。主持人 {{主持人列表}} 正在面向所有听众主持节目、分享话题；当【用户信息】存在时，他们知道其中的用户也是听众之一，但专业主持人不会直呼其名、持续单独对话或把节目变成一对一聊天，而会在面向全体听众的播报中，以不点名的关照、含蓄回应、只有对方可能听懂的暗线或留白自然地增加互动。\n\n【曲目不可知原则｜必须严格遵守】\n本台本与播放器中的实际曲目完全解耦。音乐由用户在外部独立、随机播放，模型既不知道当前曲目，也不负责选歌或排歌。主持人不得报幕、报歌名或歌手，不得说“刚才这首”“接下来这首”，不得猜测当前或下一首音乐的语言、国家、风格、歌词、主题、节奏、年代、情绪或演唱者，不得承诺播放任何歌曲，也不得把话题转折建立在某首歌已经或即将播放的假设上。可以把音乐仅视为不可描述的环境背景，但所有台词即使覆盖到任意随机曲目上也必须成立。\n\n【主持人】\n{{主持人列表}}\n\n【主持人角色设定】\n{{角色设定}}\n\n{{用户信息}}\n\n【角色与世界背景】\n{{世界书}}\n\n【电台专用世界书】\n{{电台世界书}}\n\n{{剧情上下文}}\n\n{{聊天总结}}\n\n{{最近主播对话}}\n\n【用户本次要求】\n{{用户输入}}\n\n【本次任务】\n写一段真正面向电台听众的连续节目。主持人可以从一个具体而有趣的观察、故事、疑问或生活片段进入，逐渐展开联想、观点、讲述与共同主持人的交流；在合适处向所有听众提出无需立即回答的问题并留下停顿。节目应有清晰但不刻板的起承转合，内容连贯、耐听，有事实、有细节、有感受，避免机械报幕、空洞寒暄、廉价鸡汤、反复安慰和持续强调“陪伴”。角色可以保留原本的口癖、知识范围、幽默与价值观，但必须具备专业主持人的倾听感、节奏感和公共表达意识。\n当【用户信息】、【剧情上下文】、聊天总结或最近主动聊天存在时，只把它们作为暗线素材：不得复述隐私、不得暴露“我读过资料”、不得让其他听众察觉节目专为某个人定制。若这些区块为空，直接写普适节目，不猜测缺失信息。\n\n【篇幅要求】\n成稿约 {{目标字数}} 字。字数统计必须严格以所有 speech.ttsText 中实际会被主持人口播的正文合计为准，并使该口播正文达到约 {{目标字数}} 字。JSON 键名与结构、host、displayText 中与口播重复的内容、VoiceTag、pause 标记、秒数、转义符、空白及任何元数据均不计入此字数要求；不得用增加标签或结构字符来凑字数。\n\n【共同主持规则】\n如果有多名主持人，他们是共同主持这段节目：可以轮流说话、互相接话、讨论、打趣、补充或回应对方，也可以由一位主导、其他人自然加入。不要固定轮流顺序，不要求每段所有人都发言，但整篇应让适合参与的主持人真正参与交流。每个 speech.host 必须使用【主持人】中出现的名字。\n\n【停顿规则】\n{{停顿数量要求}}\n{{停顿秒数要求}}\n停顿是主持人说完一段内容后留给听众的独立安静时段，不是语气停顿。需要停顿时，必须在 nodes 数组中插入独立字符串标记 [pause=Ns]，例如停顿 24 秒就输出 \"[pause=24s]\"。标记不得放进 speech.ttsText 或 speech.displayText，也不得让主持人念出。播放停顿标记时，系统会停止请求语音并恢复背景声音，倒计时结束后再继续后面的 speech。\n\n【语言与节点规则】\n1. speech.ttsText 是发送给 TTS 的文本，只能使用 {{朗读语言}}。\n2. speech.displayText 是显示给用户看的文本，只能使用 {{显示语言}}；当显示语言与朗读语言相同时，两者内容可以相同。\n3. speech.host 必须与当前这段话的说话者一致。\n4. 每个 speech 应是一段适合单独请求语音的完整话语，不要把一句话无意义地拆成许多极短节点。\n5. 停顿只能使用独立的 \"[pause=Ns]\" 字符串标记；N 必须是允许区间内的秒数。\n6. 主持人之间互相称呼时，必须严格使用符合其人物关系与角色设定的称呼，禁止用全名、姓氏或错误的称呼互称；关系亲近的挚友用名字简称（示例：五条悟对夏油杰称“杰”，夏油杰对五条悟称“悟”）；称呼与说话者身份及台词语言一致。\n6. 主持人之间互相称呼时，必须严格使用符合其人物关系与角色设定的称呼，禁止用全名、姓氏或错误的称呼互称；关系亲近的挚友用名字简称（示例：五条悟对夏油杰称“杰”，夏油杰对五条悟称“悟”）；称呼与说话者身份及台词语言一致。\n\n【输出要求】\n{{输出格式要求}}\n不要输出 Markdown、代码块、标题、解释或 JSON 之外的任何文字。JSON 中所有字符串必须正确转义并完整闭合。",
    "v3RecommendOnlyPrompt": "只推荐真实存在的歌曲，不写台本、不写主持人对白。只返回歌曲 title 与 artist，不要编造 URL。",
    "v3CompanionPromptSuiteV1": true,
    "v3CompanionAutoRequestDefaultV2": true
  }
}
/* __META_END__ */

/* __INJECT_BEGIN__ */
(function(ctx){try{var TOP=window.parent;var s=JSON.parse(TOP.localStorage.getItem('pp-config')||'{}');var t=s.pendingRadioInject||'';if(t){s.pendingRadioInject='';TOP.localStorage.setItem('pp-config',JSON.stringify(s));}return t;}catch(e){return '';}})
/* __INJECT_END__ */

/* __PAGECODE_BEGIN__ */
(function pageCode(ctx) {

    var TOP = window.parent,

        TOPDOC = TOP.document,

        sbS = ctx.sbS || {},

        cfg = ctx.settings || {},

        _W = ctx.save;

    var APP_KEY = 'pp-radio-state-v2';

    var CFG_KEY = 'pp-radio-settings-v1';

    /* Made for You settings use the app settings object and an independent

       local mirror. The mirror survives app re-renders/plugin setting races. */

    (function _restoreRadioCfg() {

        try {

            var snap = JSON.parse(TOP.localStorage.getItem(CFG_KEY) || 'null');

            var saved = snap && snap.settings;

            if (!saved || typeof saved !== 'object') return;

            for (var k in saved) if (Object.prototype.hasOwnProperty.call(saved, k)) { if (k === 'radioEnabled') continue; cfg[k] = saved[k]; }

        } catch (e) {}

    })();



    function _esc(s) {

        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    }



    function _toast(s) {

        try {

            ctx.toast && ctx.toast(s);

        } catch (e) {}

    }



    function _load() {

        try {

            return JSON.parse(TOP.localStorage.getItem(APP_KEY) || '{}') || {};

        } catch (e) {

            return {};

        }

    }



    function _saveStore(st) {

        try {

            TOP.localStorage.setItem(APP_KEY, JSON.stringify(st));

        } catch (e) {}

    }



    function _uuid() {

        return 'r' + Date.now() + Math.floor(Math.random() * 100000);

    }



    function _clamp(n, a, b) {

        n = parseFloat(n);

        if (isNaN(n)) n = a;

        return Math.max(a, Math.min(b, n));

    }



    function _num(v, d) {

        v = parseInt(v, 10);

        return isNaN(v) ? d : v;

    }



    function _chars() {

        try {

            return ctx.getChars ? ctx.getChars() : (sbS.characters || []);

        } catch (e) {

            return sbS.characters || [];

        }

    }



    function _charId(c) {

        return String((c && (c.id || c.name || c.avatar)) || '');

    }



    function _user() {

        try {

            return ctx.getUser ? ctx.getUser() : (sbS.user || {});

        } catch (e) {

            return sbS.user || {};

        }

    }



    function _stCtx() {

        try {

            return TOP.SillyTavern && TOP.SillyTavern.getContext && TOP.SillyTavern.getContext();

        } catch (e) {

            return null;

        }

    }



    function _getWbText(char) {

        try {

            var ids = char && char.wbIds || [];

            var all = sbS.wbEntries || [];

            if (!ids.length) return '';

            return all.filter(function(e) {

                return ids.indexOf(e.id) >= 0 && e.content;

            }).map(function(e) {

                return '《' + (e.name || '世界书') + '》\n' + e.content;

            }).join('\n\n');

        } catch (e) {

            return '';

        }

    }



    function _radioWbSplit(raw) {

        try {

            if (Object.prototype.toString.call(raw) === '[object Array]') return raw.map(function(x) {

                return String(x || '').trim();

            }).filter(Boolean);

            raw = String(raw || '').trim();

            if (!raw) return [];

            return raw.split(/[\n,，、;；]+/).map(function(x) {

                return String(x || '').trim();

            }).filter(Boolean);

        } catch (e) {

            return [];

        }

    }



    function _getRadioWbIds() {

        return _radioWbSplit(cfg.radioWbIds);

    }



    function _setRadioWbIds(arr) {

        cfg.radioWbIds = (arr || []).map(function(x) {

            return String(x || '').trim();

        }).filter(Boolean).join('\n');

        _saveCfg();

    }



    function _getRadioWbText() {

        try {

            var ids = _getRadioWbIds();

            if (!ids.length) return '';

            var set = {};

            ids.forEach(function(x) {

                set[x] = 1;

            });

            return (sbS.wbEntries || []).filter(function(e) {

                return e && e.content && (set[e.id] || set[e.name]);

            }).map(function(e) {

                return '《' + (e.name || '世界书') + '》\n' + e.content;

            }).join('\n\n');

        } catch (e) {

            return '';

        }

    }



    function _joinTextParts(arr) {

        return arr.filter(Boolean).join('\n\n');

    }



    function _getActiveWb() {

        try {

            return (ctx.getWbActive ? ctx.getWbActive() : []).map(function(e) {

                return '《' + (e.name || '世界书') + '》\n' + (e.content || '');

            }).join('\n\n');

        } catch (e) {

            return '';

        }

    }



    function _vnRegexEsc(x) {

        return String(x || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    }



    function _vnReadPref(key, fallback) {

        try {

            var raw = TOP.localStorage.getItem(key);

            return raw == null ? fallback : JSON.parse(raw);

        } catch (e) {

            return fallback;

        }

    }



    function _vnApplyHiddenTags(src) {

        src = String(src || '');

        try { src = src.replace(/\[ImageTag:[^\]]*\]/gi, ''); } catch (e) {}

        var list = _vnReadPref('pp-ext-hidetags', []);

        if (Object.prototype.toString.call(list) !== '[object Array]') list = [];

        for (var i = 0; i < list.length; i++) {

            var from = list[i] && list[i].from,

                to = list[i] && list[i].to;

            if (!from || !to) continue;

            try { src = src.replace(new RegExp(_vnRegexEsc(from) + '[\\s\\S]*?' + _vnRegexEsc(to), 'gi'), ''); } catch (e) {}

        }

        return src;

    }



    function _vnExtractStory(raw, isUser) {

        raw = String(raw || '');

        var tag = _vnReadPref('pp-ext-tag', null) || { start: '<content>', end: '</content>' };

        var start = tag.start || '<content>', end = tag.end || '</content>';

        var startPat = _vnRegexEsc(start);

        if (start.charAt(start.length - 1) === '>') startPat = _vnRegexEsc(start.slice(0, -1)) + '[^>]*>';

        var re, parts = [], m;

        try { re = new RegExp(startPat + '([\\s\\S]*?)' + _vnRegexEsc(end), 'gi'); }

        catch (e) { re = /<content[^>]*>([\s\S]*?)<\/content>/gi; }

        while ((m = re.exec(raw)) !== null) parts.push(m[1]);

        var text = parts.length ? parts.join('\n\n') : (isUser ? raw : '');

        text = _vnApplyHiddenTags(text);

        return text.replace(/<[^>]+>/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

    }



    function _getSTHistory(n) {

        try {

            n = _num(n, 0);

            if (n <= 0) return '';

            var st = _stCtx(), chat = st && st.chat;

            if (!chat || !chat.length) return '';

            var uname = (_user().name) || (st && st.name1) || '用户';

            var cname = (st && st.name2) || '角色';

            return chat.filter(function(m) { return !m.is_system; }).map(function(m) {

                var txt = _vnExtractStory(m.mes || '', !!m.is_user);

                return txt ? ((m.is_user ? uname : cname) + ': ' + txt) : null;

            }).filter(Boolean).slice(-n).join('\n');

        } catch (e) {

            return '';

        }

    }



    function _getHorae() {

        try {

            if (!TOP.Horae) return '';

            var s = TOP.Horae.getLatestState && TOP.Horae.getLatestState();

            var out = [];

            if (s && s.timestamp) out.push('时间: ' + [s.timestamp.story_date, s.timestamp.story_time].filter(Boolean).join(' '));

            if (s && s.scene) out.push('场景: ' + [s.scene.location, s.scene.atmosphere].filter(Boolean).join(' / '));

            if (s && s.scene && s.scene.characters_present) out.push('在场角色: ' + s.scene.characters_present.join('、'));

            if (s && s.affection) out.push('好感: ' + JSON.stringify(s.affection));

            var evs = TOP.Horae.getEvents && TOP.Horae.getEvents(0, 'all');

            if (evs && evs.length) out.push('近期事件:\n' + evs.slice(-8).map(function(x) {

                return '- ' + ((x.event && x.event.summary) || '');

            }).join('\n'));

            return out.join('\n');

        } catch (e) {

            return '';

        }

    }



    function _getBaiBaiSummary() {

        try {

            var api = TOP.STBaiBaiBook || (TOP.parent && TOP.parent.STBaiBaiBook);

            if (!api || typeof api.getInjectedHistory !== 'function') return '';

            var out = api.getInjectedHistory() || {};

            return String(out.relativeText || out.text || '').trim();

        } catch (e) {

            return '';

        }

    }



    function _contextSources() {

        var raw = cfg.contextSource;

        if (raw === undefined || raw === null || raw === '') raw = 'both';

        var arr = Object.prototype.toString.call(raw) === '[object Array]' ? raw.slice() : String(raw).split(/[\s,，、;；|+]+/);

        if (arr.indexOf('both') >= 0) arr = ['st', 'horae'];

        if (arr.indexOf('none') >= 0) arr = [];

        var ok = { st: 1, horae: 1, baibai: 1 }, seen = {}, out = [];

        arr.forEach(function(x) { x = String(x || '').trim(); if (ok[x] && !seen[x]) { seen[x] = 1; out.push(x); } });

        return out;

    }



    function _setContextSources(arr) {

        cfg.contextSource = (arr || []).join(',');

        _saveCfg();

    }



    function _contextText() {

        var modes = _contextSources(), parts = [];

        if (modes.indexOf('st') >= 0) {

            var st = _getSTHistory(cfg.stHistN);

            if (st) parts.push('【酒馆历史】\n' + st);

        }

        if (modes.indexOf('horae') >= 0) {

            var hs = _getHorae();

            if (hs) parts.push('【Horae总结】\n' + hs);

        }

        if (modes.indexOf('baibai') >= 0) {

            var bs = _getBaiBaiSummary();

            if (bs) parts.push('【柏宝书总结】\n' + bs);

        }

        return parts.join('\n\n');

    }



    function _parseLibrary() {

        var raw = cfg.musicLibrary || '';

        var lines = raw.split(/\n+/),

            out = [];

        for (var i = 0; i < lines.length; i++) {

            var ln = lines[i].trim();

            if (!ln) continue;

            if (ln.charAt(0) === '[') {

                try {

                    var arr = JSON.parse(ln);

                    if (arr && arr.forEach) arr.forEach(function(x) {

                        if (x) out.push(x);

                    });

                } catch (e) {}

                continue;

            }

            if (ln.charAt(0) === '{') {

                try {

                    out.push(JSON.parse(ln));

                } catch (e) {}

                continue;

            }

            var p = ln.split('|');

            if (p.length >= 3) out.push({

                title: p[0].trim(),

                artist: p[1].trim(),

                url: p[2].trim(),

                tags: (p[3] || '').trim()

            });

        }

        return out.filter(function(x) {

            return x && (x.url || x.query || x.title);

        });

    }



    function _libText(list) {

        if (!list.length) return '（当前没有本地曲库。电台会优先使用 AI 给出的歌名/歌手，通过 GD音乐台自动搜索可播放音源。）';

        return list.slice(0, 80).map(function(x, i) {

            return (i + 1) + '. ' + (x.title || '未知歌名') + ' - ' + (x.artist || '未知歌手') + (x.url ? ' | url:' + x.url : '') + (x.tags ? ' | tags:' + x.tags : '') + (x.note ? ' | note:' + x.note : '');

        }).join('\n');

    }



    function _normMusic(s) {

        return String(s || '').toLowerCase().replace(/[\(（\[【].*?[\)）\]】]/g, ' ').replace(/[\s\-_·.]+/g, ' ').trim();

    }



    function _songKey(song) {

        song = song || {};

        return _normMusic((song.title || song.query || '') + ' ' + (song.artist || ''));

    }



    function _songTitleKey(song) {

        song = song || {};

        return _normMusic(song.title || song.query || '');

    }



    function _songLine(song, i) {

        song = song || {};

        return (i + 1) + '. ' + (song.title || song.query || '未命名歌曲') + (song.artist ? ' - ' + song.artist : '') + (song.tags ? ' | ' + song.tags : '');

    }



    function _favList(store) {

        store = store || {};

        if (!store.favoriteSongs) store.favoriteSongs = [];

        return store.favoriteSongs;

    }



    function _favByKey(key) {

        var fs = _favList(eng.store || {});

        for (var i = 0; i < fs.length; i++) {

            if (_songKey(fs[i]) === key) return fs[i];

        }

        return null;

    }



    function _isFav(song) {

        return !!_favByKey(_songKey(song));

    }



    function _favText() {

        var fs = _favList(eng.store || {});

        if (!fs.length) return '（暂无收藏曲目）';

        return fs.slice(0, 80).map(function(s, i) {

            var n = (s.scriptVersions && s.scriptVersions.length) || 0;

            return _songLine(s, i) + ' | 台词版本:' + n;

        }).join('\n');

    }



    function _recentLimit() {

        return Math.max(0, _num(cfg.recentDedupeCount === undefined ? 30 : cfg.recentDedupeCount, 30));

    }



    function _recentRawStore() {

        try {

            if (!eng.store) eng.store = {};

            if (Object.prototype.toString.call(eng.store.recentPlayedSongs) !== '[object Array]') eng.store.recentPlayedSongs = [];

            return eng.store.recentPlayedSongs;

        } catch (e) {

            return [];

        }

    }



    function _recentEntries(limit) {

        limit = _num(limit, _recentLimit());

        var seen = {},

            out = [],

            arr = [];

        try {

            arr = arr.concat(_recentRawStore());

        } catch (e) {}

        try {

            var lg = (eng && eng.log) || [];

            for (var i = 0; i < lg.length; i++) {

                var song = (lg[i].item && lg[i].item.song) || {};

                arr.push({

                    t: lg[i].t || 0,

                    title: song.title || song.query || '',

                    artist: song.artist || '',

                    query: song.query || '',

                    key: _songTitleKey(song)

                });

            }

        } catch (e) {}

        for (var j = 0; j < arr.length && out.length < limit; j++) {

            var x = arr[j] || {};

            var k = x.key || _songTitleKey(x);

            if (k && !seen[k]) {

                seen[k] = 1;

                out.push(x);

            }

        }

        return out;

    }



    function _recordRecentSong(song) {

        try {

            song = song || {};

            var k = _songTitleKey(song);

            if (!k) return;

            var arr = _recentRawStore(),

                next = [],

                seen = {};

            next.push({

                t: Date.now(),

                title: song.title || song.query || '',

                artist: song.artist || '',

                query: song.query || '',

                key: k

            });

            seen[k] = 1;

            for (var i = 0; i < arr.length && next.length < 300; i++) {

                var x = arr[i] || {},

                    xk = x.key || _songTitleKey(x);

                if (xk && !seen[xk]) {

                    x.key = xk;

                    next.push(x);

                    seen[xk] = 1;

                }

            }

            eng.store.recentPlayedSongs = next;

            if (eng.saveStore) eng.saveStore();

            else _saveStore(eng.store || {});

        } catch (e) {}

    }



    function _recordHistoryItem(item) {

        try {

            if (!item || !item.song) return;

            if (!eng.store) eng.store = {};

            var arr = Array.isArray(eng.store.playHistory) ? eng.store.playHistory : [];

            var lim = Math.max(1, _num(cfg.playHistoryLimit === undefined ? 30 : cfg.playHistoryLimit, 30));

            var key = _songKey(item.song);

            arr = arr.filter(function(x){ return _songKey((x && x.item && x.item.song) || {}) !== key; });

            arr.unshift({ t: Date.now(), item: _cloneItem(item) });

            eng.store.playHistory = arr.slice(0, lim);

            eng.saveStore();

        } catch (e) {}

    }



    function _prunePlayHistory() {

        try {

            if (!eng.store) eng.store = {};

            var arr = Array.isArray(eng.store.playHistory) ? eng.store.playHistory : [];

            var lim = Math.max(1, _num(cfg.playHistoryLimit === undefined ? 30 : cfg.playHistoryLimit, 30));

            if (arr.length > lim) {

                eng.store.playHistory = arr.slice(0, lim);

                eng.saveStore();

            }

        } catch (e) {}

    }



    function _isRecentSong(song, limit) {

        var k = _songTitleKey(song);

        if (!k) return false;

        var arr = _recentEntries(limit || _recentLimit());

        for (var i = 0; i < arr.length; i++) {

            var xk = arr[i].key || _songTitleKey(arr[i]);

            if (xk && xk === k) return true;

        }

        return false;

    }



    function _filterRecentItems(items) {

        var out = [],

            drop = [],

            seen = {};

        for (var i = 0; i < (items || []).length; i++) {

            var it = items[i] || {},

                song = it.song || {},

                k = _songTitleKey(song);

            if (k && (seen[k] || _isRecentSong(song, _recentLimit()))) {

                drop.push(song.title || song.query || k);

                continue;

            }

            if (k) seen[k] = 1;

            out.push(it);

        }

        return {

            items: out,

            dropped: drop

        };

    }



    function _recentText(limit) {

        var arr = _recentEntries(limit);

        if (!arr.length) return '（暂无最近播放）';

        return arr.map(function(x, i) {

            return (i + 1) + '. ' + (x.title || x.query || '未命名歌曲') + (x.artist ? ' - ' + x.artist : '');

        }).join('\n');

    }



    function _recentNoRepeatText(limit) {

        var arr = _recentEntries(limit), titles = [], seen = {};

        arr.forEach(function(x) {

            var title = String(x && x.title || '').trim();

            var key = _normMusic(title);

            if (title && key && !seen[key]) { seen[key] = 1; titles.push(title); }

        });

        var body = titles.length ? titles.map(function(title, i) { return (i + 1) + '. ' + title; }).join('\n') : '（暂无可列出的近期已播放曲名）';

        return '以下曲名仅用于“不要再次推荐同名歌曲”的去重约束。\n' +

            '不要参考这些曲子的任何信息、类型、风格、情绪、歌手或相似性，也不要据此推断用户喜欢或不喜欢这类音乐。\n' +

            '近期已播放曲名（只看曲名，不代表用户偏好）：\n' + body;

    }

    function _recentRadioTalk(limit) {

        limit = _num(limit, cfg.recommendChatMessages === undefined ? 6 : cfg.recommendChatMessages);

        var h = (eng.store && eng.store.chatHistory) || [];

        if (!h.length || limit <= 0) return '（暂无主播对话）';

        return h.slice(-limit).map(function(m) {

            return (m.role === 'user' ? '用户' : '主播') + ': ' + (m.display || m.content || '');

        }).join('\n');

    }



    function _tasteText(store) {

        if (cfg.tasteEnabled === false || cfg.tasteEnabled === 'false') return '';

        return (store && store.musicTasteProfile) || '（暂无蒸馏后的偏好；可以根据用户临时要求、收藏曲目和上下文自由推荐。）';

    }



    function _voiceLang() {

        return cfg.voiceLanguage || sbS.voiceTagLang || '中文';

    }



    function _displayLang() {

        return cfg.displayLanguage || '中文';

    }



    function _detectTextLang(t) {

        t = String(t || '');

        if (!t) return '';

        var ja = (t.match(/[\u3040-\u30FF\u31F0-\u31FF]/g) || []).length;

        var ko = (t.match(/[\uAC00-\uD7AF]/g) || []).length;

        var han = (t.match(/[\u4E00-\u9FFF]/g) || []).length;

        var lat = (t.match(/[A-Za-z]/g) || []).length;

        if (ko > 0) return 'ko';

        if (ja > 0) return 'ja';

        if (lat > 0 && lat > han) return 'en';

        return han > 0 ? 'zh' : '';

    }



    function _hostIds(store) {

        var ids = store && store.hostIds;

        if (Object.prototype.toString.call(ids) !== '[object Array]') ids = [];

        return ids;

    }



    function _selectedHosts(store) {

        var cs = _chars();

        var ids = _hostIds(store);

        var hs = cs.filter(function(c) {

            return ids.indexOf(_charId(c)) >= 0;

        });

        if (!hs.length) {

            var ac = ctx.getActiveChars && ctx.getActiveChars();

            hs = (ac && ac.length ? ac : cs).slice(0, 1);

        }

        return hs;

    }



    function _hostText(hs) {

        var multi = hs && hs.length > 1 ? '\n\n【共同主持说明】\n这些角色被用户选为同一档私人电台的主持人。请把他们视为正在共同主持，可以互相接话、轮流主持、一起对用户说话，不受主线剧情在场与行动限制。' : '';

        return hs.map(function(c) {

            var _prov = _ttsProviderFor(c);

            var _vidTxt = _prov === 'fishaudio' ? ('Fish VoiceID: ' + (c.fishVoiceId || '(未设置)')) : ('MiniMax VoiceID: ' + (c.ttsVoiceId || 'female-shaonv'));

            return '【主持人】' + (c.name || '未命名') + '\n' + _vidTxt + '；TTS ' + (c.ttsEnabled ? '已开启' : '未开启');

        }).join('\n\n') + multi;

    }



    function _hostRoleText(hs) {

        return (hs || []).map(function(c) {

            return '【角色名称】\n' + (c.name || '未命名') + '\n【角色设定】\n' + (c.persona || '（暂无角色设定）');

        }).join('\n\n');

    }



    function _apiUrl() {

        return (cfg.useOwnApi && cfg.ownApiUrl) || sbS.apiUrl || '';

    }



    function _apiKey() {

        return (cfg.useOwnApi && cfg.ownApiKey) || sbS.apiKey || '';

    }



    function _model() {

        return (cfg.useOwnApi && cfg.useOwnModel && cfg.ownModel) || sbS.model || '';

    }



    function _fixModel() {

        var m = cfg.fixModel;

        if (m && String(m).trim()) return String(m).trim();

        return 'Pro/deepseek-ai/DeepSeek-V3.2';

    }



    function _recordApiDebug(data) {

        data = data || {};

        eng.lastApiDebug = data;

        TOP.__vnmRadioLastApi = data;

        try {

            TOP.localStorage.setItem('pp-radio-last-api-debug', JSON.stringify(data));

        } catch (e) {}

    }



    TOP._vnmRadioShowLastApi = function() {

        var data = TOP.__vnmRadioLastApi;

        if (!data) {

            try {

                data = JSON.parse(TOP.localStorage.getItem('pp-radio-last-api-debug') || 'null');

            } catch (e) {}

        }

        if (!data) {

            _toast('还没有 API 请求记录');

            return null;

        }

        try {

            var old = TOPDOC.getElementById('pp-radio-api-debug-viewer');

            if (old) old.remove();

            var mask = TOPDOC.createElement('div');

            mask.id = 'pp-radio-api-debug-viewer';

            mask.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';

            var card = TOPDOC.createElement('div');

            card.style.cssText = 'width:min(920px,96vw);height:min(720px,92vh);background:#171719;border:1px solid rgba(255,255,255,.16);border-radius:18px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.55);';

            var head = TOPDOC.createElement('div');

            head.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:14px 16px;color:#fff;font:600 14px system-ui;border-bottom:1px solid rgba(255,255,255,.1);';

            head.textContent = 'Radio 上次 API 请求 / 返回';

            var actions = TOPDOC.createElement('span');

            actions.style.cssText = 'display:flex;gap:8px;';

            function action(label, fn) {

                var b = TOPDOC.createElement('button');

                b.type = 'button';

                b.textContent = label;

                b.style.cssText = 'border:0;border-radius:10px;padding:7px 11px;background:rgba(255,255,255,.12);color:#fff;cursor:pointer;';

                b.onclick = fn;

                actions.appendChild(b);

            }

            var text = JSON.stringify(data, null, 2);

            action('复制', function() {

                try {

                    TOP.navigator.clipboard.writeText(text);

                    _toast('API 返回详情已复制');

                } catch (e) {

                    _toast('复制失败，请在文本框中全选复制');

                }

            });

            action('下载 JSON', function() {

                var blob = new TOP.Blob([text], { type: 'application/json;charset=utf-8' });

                var a = TOPDOC.createElement('a');

                a.href = TOP.URL.createObjectURL(blob);

                a.download = 'pp-radio-api-debug-' + Date.now() + '.json';

                a.click();

                TOP.setTimeout(function() { TOP.URL.revokeObjectURL(a.href); }, 1000);

            });

            action('关闭', function() { mask.remove(); });

            head.appendChild(actions);

            var body = TOPDOC.createElement('textarea');

            body.readOnly = true;

            body.value = text;

            body.style.cssText = 'flex:1;resize:none;border:0;outline:0;background:#0d0d0f;color:#d8d8dc;padding:16px;font:12px/1.55 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre;overflow:auto;';

            card.appendChild(head);

            card.appendChild(body);

            mask.appendChild(card);

            mask.onclick = function(e) { if (e.target === mask) mask.remove(); };

            TOPDOC.body.appendChild(mask);

        } catch (e) {

            try { TOP.console.log('[VNM Radio API]', data); } catch (_) {}

        }

        return data;

    };



    function _chat(messages, ok, err, modelOverride) {

        var tries = (cfg.autoRetry === false || cfg.autoRetry === 'false') ? 0 : _num(cfg.retryCount, 2);

        (function attempt(left) {

            _chatOnce(messages, ok, function(e) {

                var em = (e && e.message) || String(e);

                /* 超时是网络问题，重试只会再等一遍，直接失败提示 */
                if (left > 0 && em.indexOf('请求超时') < 0) attempt(left - 1);

                else err && err(e);

            }, modelOverride);

        })(tries);

    }



    function _chatOnce(messages, ok, err, modelOverride) {

        var url = (_apiUrl() || '').replace(/\/chat\/completions\/?$/, '').replace(/\/+$/, '');

        if (!url) {

            err('API地址未设置');

            return;

        }

        var hdr = {

            'Content-Type': 'application/json'

        };

        var key = _apiKey();

        if (key) hdr.Authorization = 'Bearer ' + key;

        var maxTokens = Math.max(256, Math.min(50000, _num(cfg.maxTokens, 20000)));

        var payload = {

            model: modelOverride || _model(),

            messages: messages,

            max_tokens: maxTokens,

            temperature: cfg.temperature === undefined ? 0.9 : parseFloat(cfg.temperature)

        };

        var startedAt = Date.now();

        var debug = {

            startedAt: new Date(startedAt).toISOString(),

            url: url + '/chat/completions',

            request: {

                model: payload.model,

                max_tokens: payload.max_tokens,

                temperature: payload.temperature,

                messageCount: messages.length,

                messageChars: messages.map(function(m) { return String(m && m.content || '').length; }),

                systemContent: String((messages && messages[0] && messages[0].content) || '').slice(0, 6000)

            },

            state: 'loading'

        };

        _recordApiDebug(debug);

        var ctl = (typeof AbortController !== 'undefined') ? new AbortController() : null;

        var TIMEOUT_MS = Math.max(15000, Math.min(600000, _num(cfg.aiTimeoutMs, 300) * 1000));

        var timer = ctl ? setTimeout(function() { ctl.abort(); }, TIMEOUT_MS) : null;

        var fetchOpts = { method: 'POST', headers: hdr, body: JSON.stringify(payload) };

        if (ctl) fetchOpts.signal = ctl.signal;

        TOP.fetch(debug.url, fetchOpts).then(function(r) {

            return r.text().then(function(raw) {

                debug.finishedAt = new Date().toISOString();

                debug.durationMs = Date.now() - startedAt;

                debug.httpStatus = r.status;

                debug.httpStatusText = r.statusText || '';

                debug.responseText = raw;

                debug.state = r.ok ? 'success' : 'error';

                _recordApiDebug(debug);

                var d = null;

                try {

                    d = raw ? JSON.parse(raw) : null;

                } catch (parseError) {

                    if (r.ok) throw new Error('返回不是合法 JSON: ' + (parseError.message || parseError));

                }

                if (!r.ok) {

                    var detail = d && d.error && (d.error.message || d.error) || d && (d.message || d.detail) || raw || '';

                    detail = typeof detail === 'string' ? detail : JSON.stringify(detail);

                    throw new Error('HTTP ' + r.status + (detail ? ': ' + detail.slice(0, 600) : ''));

                }

                var t = d && d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content;

                if (!t) throw new Error('返回空内容');

                ok(t.trim());

            });

        }).catch(function(e) {

            if (ctl && timer) clearTimeout(timer);

            if (debug.state === 'loading') {

                debug.finishedAt = new Date().toISOString();

                debug.durationMs = Date.now() - startedAt;

                debug.state = 'network-error';

                debug.error = (e && e.message) || String(e);

                _recordApiDebug(debug);

            }

            if (ctl && ctl.signal && ctl.signal.aborted) {

                err('请求超时（' + Math.round(TIMEOUT_MS / 1000) + ' 秒），请检查网络或代理后重试（可点“查看上次 API 返回”查看详情）');

            } else {

                err(((e && e.message) || String(e)) + '（可点“查看上次 API 返回”查看详情）');

            }

        });

    }



    function _looseSayEnd(s, start) {

        var sub = s.slice(start),

            best = -1,

            m, i;



        function pick(pos) {

            if (pos >= 0) {

                pos = start + pos;

                if (best < 0 || pos < best) best = pos;

            }

        }

        var fields = ['song', 'reason', 'key', 'host', 'title', 'artist', 'url', 'query', 'items', 'scripts', 'data'];

        for (i = 0; i < fields.length; i++) {

            var re = new RegExp(',\\s*\"' + fields[i] + '\"\\s*:', 'g');

            m = re.exec(sub);

            if (m) pick(m.index);

        }

        var close = /}\s*(?:,|\]|})/g;

        m = close.exec(sub);

        if (m) pick(m.index);

        return best;

    }



    function _jsonEscValue(v) {

        return String(v || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r/g, '\\r').replace(/\n/g, '\\n');

    }



    function _repairLooseSayJson(t) {

        t = String(t || '');

        var re = /"say"\s*:\s*"/g,

            out = '',

            last = 0,

            m, end, raw;

        while ((m = re.exec(t))) {

            end = _looseSayEnd(t, re.lastIndex);

            if (end < 0) break;

            raw = t.slice(re.lastIndex, end);

            raw = raw.replace(/"\s*$/, '');

            out += t.slice(last, re.lastIndex) + _jsonEscValue(raw) + '"';

            last = end;

            re.lastIndex = end;

        }

        return out ? out + t.slice(last) : t;

    }



    function _tryJson(t) {

        try {

            return JSON.parse(t);

        } catch (e) {

            return null;

        }

    }



    function _jsonFromText(t) {

        t = String(t || '').trim();

        t = t.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();

        var o = _tryJson(t);

        if (o) return o;

        var rt = _repairLooseSayJson(t);

        if (rt !== t) {

            o = _tryJson(rt);

            if (o) return o;

        }

        var a = t.indexOf('{'),

            b = t.lastIndexOf('}'),

            seg;

        if (a >= 0 && b > a) {

            seg = t.slice(a, b + 1);

            o = _tryJson(seg);

            if (o) return o;

            rt = _repairLooseSayJson(seg);

            if (rt !== seg) {

                o = _tryJson(rt);

                if (o) return o;

            }

        }

        var c = t.indexOf('['),

            d = t.lastIndexOf(']');

        if (c >= 0 && d > c) {

            seg = t.slice(c, d + 1);

            o = _tryJson(seg);

            if (o) return o;

            rt = _repairLooseSayJson(seg);

            if (rt !== seg) {

                o = _tryJson(rt);

                if (o) return o;

            }

        }

        return null;

    }



    /* ===== 台词语言检测修复公共逻辑（自动自检与人工修复共用） ===== */

    function _stripPauseMark(s) {

        return String(s || '').replace(/【pause=\d*\.?\d+s】/gi, '').replace(/\[pause=\d*\.?\d+s\]/gi, '').trim();

    }



    function _scanLangNeed(nodes, hosts) {

        var dispWant = _radioLangCode(_displayLang());

        var need = [], i, n, ch, want, gotTts, gotDisp, badTts, badDisp, badName, tTxt, dTxt, whyParts, pi, nmPairs;

        for (i = 0; i < nodes.length; i++) {

            n = nodes[i];

            if (!n || n.type !== 'speech') continue;

            ch = _charByName(n.host, hosts);

            want = _radioLangCode((ch && ch.ttsSpeakLang) || _voiceLang());

            /* 剥离纯停顿标记后再检测语言；剥离后为空（纯停顿节点）不送修 */
            tTxt = _stripPauseMark(n.ttsText);

            dTxt = _stripPauseMark(n.displayText);

            if (!tTxt && !dTxt) continue;

            gotTts = _detectTextLang(tTxt);

            gotDisp = _detectTextLang(dTxt);

            badTts = !!(gotTts && want && gotTts !== want);

            badDisp = !!(gotDisp && dispWant && gotDisp !== dispWant);

            /* 人名读音检查（朗读语言为日文时）：朗读文本含映射表中的汉字人名（独立成词，非"杰出"类词组）→ 需修正为假名/罗马音。
             * 语言已不符（badTts）的节点不在此检查——先修语言，AI 重写时按规则 7 直接写假名。
             * 触发条件同 _jpNameSpeechText：want=ja 或文本本身含日文假名（角色配置可能不准）。
             * 词保护行（如"悟り"）匹配不算人名，避免 AI 白跑改写正常日文词。 */
            badName = false;

            if (!badTts && (want === 'ja' || /[ぁ-んァ-ヶー]/.test(tTxt))) {

                nmPairs = _jpNameMapPairs();

                if (nmPairs.length && _jpNameScanNeed(tTxt, nmPairs)) badName = true;

            }

            if (badTts || badDisp || badName) {

                whyParts = [];

                if (badTts) whyParts.push('朗读');

                if (badDisp) whyParts.push('显示');

                if (badName) whyParts.push('人名读音');

                need.push({ idx: i, host: n.host, want: want, dispWant: dispWant, oldTts: n.ttsText, oldDisp: n.displayText, why: whyParts.join('+') });

            }

        }

        return need;

    }



    function _stripLineNum(l) {

        /* 剥离行首编号/项目符号（"1. / 1、/ 1) / 1） / - / * / •"），防止 AI 输出带编号干扰逐行对应 */
        var m = /^\s*(?:(\d+)[.、)）:：]\s*|[-*•]\s*)/.exec(String(l || ''));

        return m ? String(l).slice(m[0].length).trim() : String(l || '').trim();

    }



    function _buildLangFixMessages(need, hosts) {

        /* 人名读音对照表：AI 逐条对照校对，避免"假名写错/汉字残留"。
         * 片假名为朗读文本的正确写法（TTS 直接读片假名最稳）。 */
        var nameRef = '【人名读音对照表（必须严格使用）】\n' +
            '五条悟 → ゴジョウサトル（全名连读）\n' +
            '夏油杰/夏油傑 → ゲトウスグル（全名连读）\n' +
            '五条（姓）→ ゴジョウ\n' +
            '夏油（姓）→ ゲトウ\n' +
            '悟（名/称呼）→ サトル\n' +
            '杰/傑（名/称呼）→ スグル\n' +
            '注意：禁止写汉字（傑/杰/悟/五条/夏油）；禁止用错片假名（如 ケツ、ケ、ごとう 等错误读音）；词保护：悟る=さとる、悟り=さとり、悟った=さとった（这些是动词，不是人名）。\n';

        var sysMsg = '你是台词语言与人名读音校对器。用户会给出若干条台词，每条标注主持人、期望朗读语言、期望显示语言。请逐条检查并重写：\n【任务】\n1. 语言：朗读文本整句用指定朗读语言，显示文本整句用指定显示语言。\n2. 人名读音：即使语言已正确，也要逐条检查所有人名是否按上方对照表写对——错假名、汉字残留、称呼错误都要改。\n【强制规则】\n1. 朗读文本与显示文本含义一一对应，语气口吻不变。\n2. 不得添加解释、注释、原文对照或多余内容。\n3. 原样保留停顿标记（[pause=Ns]），不得删改。\n4. 不要 JSON、不要代码块、不要编号、不要标题。\n5. 五条悟对夏油杰称「スグル」，夏油杰对五条悟称「サトル」；禁止用错称呼或姓氏/全名互称。\n6. 词保护行（悟る/悟り/悟った）是动词，不要改成人名。\n输出格式：按原顺序每条一行，格式为"新朗读文本 | 新显示文本"（半角竖线分隔）。某条无需修改时也原样返回该行。\n' + nameRef;

        var userMsg = '请逐条检查以下台词的语言与人名读音，有问题就改写，没问题就原样返回：\n' + need.map(function(f) {

            return 's' + f.idx + '：主持人「' + f.host + '」，朗读语言=' + (f.want === 'ja' ? '日文' : f.want === 'zh' ? '中文' : f.want === 'en' ? '英文' : f.want) + '，显示语言=' + (f.dispWant === 'ja' ? '日文' : f.dispWant === 'zh' ? '中文' : f.dispWant === 'en' ? '英文' : f.dispWant) + (f.why ? '【预检：' + f.why + '】' : '') + '\n原朗读文本：' + (f.oldTts || '') + '\n原显示文本：' + (f.oldDisp || '') + '\n';

        }).join('\n');

        var names = [];

        (hosts || []).forEach(function(c) {

            var nn = (c && c.name || '').trim();

            if (nn && names.indexOf(nn) < 0) names.push(nn);

        });

        if (names.length) userMsg += '主持人名单：' + names.join('、') + '\n';

        return [{ role: 'system', content: sysMsg }, { role: 'user', content: userMsg }];

    }



    function _normalizeLangItems(arr) {

        /* 兼容 GLM 拆字段返回：[{"key":"s5"},{"tts":"..."},{"display":"..."}]
         * key 前导时，把后续无 key 的 tts/display 挂到当前 key，合并成完整台词。
         * 完整对象（{key,tts,display}）不受影响。 */
        if (!arr || Object.prototype.toString.call(arr) !== '[object Array]') return arr;

        var out = [], cur = null, i, it;

        for (i = 0; i < arr.length; i++) {

            it = arr[i];

            if (!it || typeof it !== 'object') continue;

            if (typeof it.key === 'string' && it.key) {

                cur = { key: it.key, tts: (typeof it.tts === 'string') ? it.tts : '', display: (typeof it.display === 'string') ? it.display : '' };

                out.push(cur);

            } else if (cur) {

                if (typeof it.tts === 'string' && it.tts && !cur.tts) cur.tts = it.tts;

                if (typeof it.display === 'string' && it.display && !cur.display) cur.display = it.display;

            }

        }

        return out.length ? out : arr;

    }



    function _parseLangArr(txt) {

        /* 宽容解析：先按合法 JSON 数组解析；失败再逐条用正则抽 key/tts/display 三元组，
         * 兼容字段换行分隔、key 未闭合、缺少数组包裹等常见伪 JSON 输出。 */
        txt = String(txt || '').trim();

        txt = txt.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();

        var arr = null;

        var a = txt.indexOf('['), b = txt.lastIndexOf(']');

        if (a >= 0 && b > a) {

            try { arr = JSON.parse(txt.slice(a, b + 1)); } catch (e) {}

        }

        if (!arr || Object.prototype.toString.call(arr) !== '[object Array]') {

            try { arr = JSON.parse(txt); } catch (e) {}

        }

        /* 兼容对象包裹返回：{"items":[...]} / {"result":[...]} / {"data":[...]} 等 */
        if (!arr || Object.prototype.toString.call(arr) !== '[object Array]') {

            try {

                var wrapObj = JSON.parse(txt);

                if (wrapObj && typeof wrapObj === 'object' && Object.prototype.toString.call(wrapObj) !== '[object Array]') {

                    var innerArr = wrapObj.items || wrapObj.result || wrapObj.data || wrapObj.scripts || wrapObj.replies || wrapObj.array || wrapObj.list;

                    if (Object.prototype.toString.call(innerArr) === '[object Array]') arr = innerArr;

                }

            } catch (e) {}

        }

        if (!arr || Object.prototype.toString.call(arr) !== '[object Array]') {

            var out = [], re = /"key"\s*:\s*"([^"\r\n]*)"/g, m;

            while ((m = re.exec(txt))) {

                var key = m[1], rest = txt.slice(m.index + m[0].length), tt = null, dd = null;

                var mt = /"tts"\s*:\s*"((?:[^"\\]|\\.)*)"/.exec(rest);

                var md = /"display"\s*:\s*"((?:[^"\\]|\\.)*)"/.exec(rest);

                if (mt) tt = mt[1];

                if (md) dd = md[1];

                if (tt !== null || dd !== null) out.push({ key: key, tts: tt, display: dd });

            }

            if (out.length) arr = out;

        }

        return _normalizeLangItems(arr);

    }



    function _fixLangNodes(nodes, hosts, opts, done) {

        opts = opts || {};

        done = done || function() {};

        var need = _scanLangNeed(nodes, hosts);

        if (!need.length) {

            done({ status: 'ok', need: 0, fixed: 0 });

            return;

        }

        var messages = _buildLangFixMessages(need, hosts);

        var started = Date.now();

        _chat(messages, function(resp) {

            /* _chatOnce 回调传的是字符串（t.trim()）；兼容历史对象形态 */
            var txt = typeof resp === 'string' ? resp.trim() : String(resp && (resp.content || resp.message && resp.message.content) || '').trim();

            txt = txt.replace(/^```(?:json|text)?\s*/i, '').replace(/```$/, '').trim();

            /* 纯文本逐行解析：AI 只返回翻译文本，本地按顺序定位写回（用户方案） */
            var lines = txt.split(/\r?\n/).map(function(l) { return _stripLineNum(l); }).filter(Boolean);

            if (!lines.length) {

                done({ status: 'failed', fixed: 0, error: 'AI 返回为空' });

                return;

            }

            var fixed = 0, missed = [], li;

            for (li = 0; li < lines.length && li < need.length; li++) {

                var f = need[li], nd = nodes[f.idx];

                if (!nd) { missed.push(f.idx); continue; }

                var pi = lines[li].indexOf('|');

                var tts = pi >= 0 ? lines[li].slice(0, pi).trim() : lines[li].trim();

                var disp = pi >= 0 ? lines[li].slice(pi + 1).trim() : '';

                if (!tts && !disp) { missed.push(f.idx); continue; }

                if (tts) nd.ttsText = tts;

                if (disp) nd.displayText = disp;

                fixed++;

            }

            while (li < need.length) { missed.push(need[li].idx); li++; }

            if (!fixed) {

                done({ status: 'failed', fixed: 0, error: 'AI 已返回但没有段被实际更新' });

                return;

            }

            done({ status: 'done', need: need.length, fixed: fixed, missed: missed, elapsedMs: Date.now() - started });

        }, function(e) {

            done({ status: 'failed', fixed: 0, error: (e && e.message) || String(e || '') });

        }, _fixModel() || undefined);

    }



    /* 手动「语言检测修复」公共入口：编辑页与台本库顶部 ops 行共用。
     * 纯 AI 整体校对：本地扫描只做预检摘要，实际调 AI 校对所有 speech 节点（语言+人名读音）。 */
    function _manualLangFix(version, hosts) {

        var nodes = version.nodes || [];

        var speechCount = nodes.filter(function(n) { return n && n.type === 'speech'; }).length;

        if (!speechCount) { _toast('该台本没有可校对的台词'); return; }

        var need = _scanLangNeed(nodes, hosts);

        var brief = need.length ? ('本地预检发现 ' + need.length + ' 处问题：' + need.map(function(f) { return f.idx + 1 + '.' + f.host + '（' + f.why + '）'; }).join(' ')) : '本地预检未发现明显问题';

        if (TOP.confirm && !TOP.confirm('将对 ' + speechCount + ' 段台词做 AI 语言+人名读音整体校对：\n' + brief + '\n\n确认执行？（会调用大模型，稍等片刻）')) return;

        _toast('正在 AI 整体校对 ' + speechCount + ' 段台词…');

        _aiProofreadAllSpeech(nodes, hosts, function(res) {

            if (res.status === 'done') {

                version.edited = true;

                v3.save();

                refreshContinuous();

                var _doneMsg = 'AI 校对完成：共 ' + res.total + ' 段，更新 ' + res.changed + ' 段朗读/显示文本' + ((res.missed && res.missed.length) ? '（' + res.missed.length + ' 段未匹配，可再点一次重试）' : '') + '，台本已保存';

                if (TOP.confirm) TOP.confirm(_doneMsg);

                else _toast(_doneMsg);

            } else if (res.status === 'failed') {

                _setApiStatus('error', 'langFix', 'AI 校对失败', res.error || '', '可点"查看上次 API 返回"查看详情');

                if (TOP.confirm) TOP.confirm('AI 校对失败：' + (res.error || '未知错误') + '\n\n可点设置里「查看上次 API 返回」查看请求详情。');

                else _toast('AI 校对失败：' + (res.error || ''));

            }

        });

    }


    /* 纯 AI 整体校对：把所有 speech 节点（不只本地发现问题的）送给校对模型，
     * 让 AI 同时做语言修复+人名读音校对。本地静态扫描只用来给预检摘要，
     * 不再作为"要不要调 AI"的门槛——用户接受烧 token 换人名彻底正确。 */
    function _aiProofreadAllSpeech(nodes, hosts, done) {

        nodes = nodes || [];

        var speechIdx = [];

        nodes.forEach(function(n, i) { if (n && n.type === 'speech') speechIdx.push(i); });

        if (!speechIdx.length) { done({ status: 'ok', fixed: 0, total: 0 }); return; }

        var dispWant = _radioLangCode(_displayLang());

        var need = speechIdx.map(function(gi) {

            var n = nodes[gi];

            var ch = _charByName(n.host, hosts);

            var want = _radioLangCode((ch && ch.ttsSpeakLang) || _voiceLang());

            return { idx: gi, host: n.host || '', want: want, dispWant: dispWant, oldTts: n.ttsText || '', oldDisp: n.displayText || '', why: '整体校对' };

        });

        var messages = _buildLangFixMessages(need, hosts);

        var started = Date.now();

        _chat(messages, function(resp) {

            var txt = typeof resp === 'string' ? resp.trim() : String(resp && (resp.content || resp.message && resp.message.content) || '').trim();

            txt = txt.replace(/^```(?:json|text)?\s*/i, '').replace(/```$/, '').trim();

            var lines = txt.split(/\r?\n/).map(function(l) { return _stripLineNum(l); }).filter(Boolean);

            if (!lines.length) { done({ status: 'failed', fixed: 0, total: need.length, error: 'AI 返回为空' }); return; }

            var fixed = 0, changed = 0, missed = [], li;

            for (li = 0; li < lines.length && li < need.length; li++) {

                var f = need[li], nd = nodes[f.idx];

                if (!nd) { missed.push(f.idx); continue; }

                var pi = lines[li].indexOf('|');

                var tts = pi >= 0 ? lines[li].slice(0, pi).trim() : lines[li].trim();

                var disp = pi >= 0 ? lines[li].slice(pi + 1).trim() : '';

                if (!tts && !disp) { missed.push(f.idx); continue; }

                if (tts && tts !== nd.ttsText) { nd.ttsText = tts; changed++; }

                if (disp && disp !== nd.displayText) { nd.displayText = disp; changed++; }

                fixed++;

            }

            while (li < need.length) { missed.push(need[li].idx); li++; }

            if (!fixed) { done({ status: 'failed', fixed: 0, total: need.length, error: 'AI 已返回但没有段被实际更新' }); return; }

            done({ status: 'done', fixed: fixed, changed: changed, total: need.length, missed: missed, elapsedMs: Date.now() - started });

        }, function(e) {

            done({ status: 'failed', fixed: 0, total: need.length, error: (e && e.message) || String(e || '') });

        }, _fixModel() || undefined);

    }


    /* 歌曲台本（say 单字符串）语言检测修复适配：
     * 长台本的 _manualLangFix/_scanLangNeed/_fixLangNodes 都基于 nodes 数组，
     * 歌曲台本版本是 {host, say} 单段结构。这里把 say 解析成 speech 节点（复用
     * 双形态 VoiceTag 解析），修复后重建为统一的三字段标准 VoiceTag 并写回版本。 */
    function _songVersionNodes(version) {

        var segs = _parseSaySegments((version && version.say) || '');

        var nodes = [], i, s;

        for (i = 0; i < segs.length; i++) {

            s = segs[i];

            nodes.push({ type: 'speech', host: (s.tag && s.tag.name) || (version && version.host) || '', ttsText: s.tts, displayText: s.display });

        }

        return nodes;

    }



    function _nodesToSongSay(nodes, hosts) {

        var parts = [], i, n, ch, lang, host;

        for (i = 0; i < nodes.length; i++) {

            n = nodes[i];

            if (!n.ttsText && !n.displayText) continue;

            host = (n.host || '').trim();

            ch = _charByName(host, hosts);

            lang = _radioLangCode((ch && ch.ttsSpeakLang) || _voiceLang());

            parts.push('[VoiceTag:' + host + ':' + lang + ':' + n.ttsText + ']“' + (n.displayText || n.ttsText) + '”');

        }

        return parts.join('\n');

    }



    function _manualLangFixSong(item, version, hosts, done) {

        var nodes = _songVersionNodes(version);

        var need = _scanLangNeed(nodes, hosts);

        if (!need.length) {

            if (TOP.confirm) TOP.confirm('语言检查完成：该台本全部台词语言符合角色设置，无需修复。');

            else _toast('语言检查通过，无需修复');

            return;

        }

        var brief = need.map(function(f) { return f.idx + 1 + '.' + f.host + '（' + f.why + '）'; }).join(' ');

        if (TOP.confirm && !TOP.confirm('检测到 ' + need.length + ' 处语言不符，将按角色语言重写：\n' + brief + '\n\n确认执行？')) return;

        _toast('正在按角色语言重写 ' + need.length + ' 处…');

        _fixLangNodes(nodes, hosts, { auto: false }, function(res) {

            if (res.status === 'done') {

                var rebuilt = _nodesToSongSay(nodes, hosts);

                v3.saveSongScript(item, {

                    id: version && version.id || '',

                    host: (nodes[0] && nodes[0].host) || (version && version.host) || '',

                    say: rebuilt,

                    favorite: !!(version && version.favorite),

                    label: (version && version.label) || '语言修复'

                });

                if (done) done();

                var _doneMsg = '语言修复完成：更新 ' + res.fixed + ' 段朗读文本，台本已保存' + ((res.missed && res.missed.length) ? '（' + res.missed.length + ' 段未匹配，可再点一次重试）' : '');

                if (TOP.confirm) TOP.confirm(_doneMsg);

                else _toast(_doneMsg);

            } else if (res.status === 'failed') {

                _setApiStatus('error', 'langFix', '语言修复失败', res.error || '', '可点“查看上次 API 返回”查看详情');

                if (TOP.confirm) TOP.confirm('语言修复失败：' + (res.error || '未知错误') + '\n\n可点设置里「查看上次 API 返回」查看请求详情。');

                else _toast('语言修复失败：' + (res.error || ''));

            }

        });

    }



    /* 整组（当前播放列表全部歌曲台本）语言检测修复：
     * 逐首检测，汇总需要修复的版本后一次确认，然后串行逐首修复写回。 */
    function _manualLangFixAllSongs(items, hosts, done) {

        var todo = [], i, item, versions, selected, nodes;

        for (i = 0; i < items.length; i++) {

            item = items[i];

            if (!item || !item.song) continue;

            versions = v3.scriptVersionsForItem(item);

            selected = versions[0] || null;

            if (!selected || !selected.say) continue;

            nodes = _songVersionNodes(selected);

            if (!nodes.length) continue;

            todo.push({ item: item, version: selected, nodes: nodes });

        }

        if (!todo.length) {

            if (TOP.confirm) TOP.confirm('没有可校对的歌曲台本。');

            else _toast('没有可校对的歌曲台本');

            if (done) done();

            return;

        }

        var brief = todo.map(function(t) { return (t.version.label || t.item.song.title || '歌曲台本'); }).join('、');

        if (TOP.confirm && !TOP.confirm('将对 ' + todo.length + ' 首歌曲台本逐首做 AI 语言+人名读音整体校对：\n' + brief + '\n\n确认执行？（会逐首调用大模型，稍等片刻）')) return;

        var idx = 0, fixedCount = 0, failedCount = 0;

        function next() {

            if (idx >= todo.length) {

                var msg = 'AI 校对完成：' + fixedCount + ' 首已更新' + (failedCount ? ('，' + failedCount + ' 首失败') : '');

                if (TOP.confirm) TOP.confirm(msg);

                else _toast(msg);

                if (done) done();

                return;

            }

            var t = todo[idx++];

            _toast('正在校对 ' + (t.version.label || t.item.song.title || '歌曲台本') + '…');

            _aiProofreadAllSpeech(t.nodes, hosts, function(res) {

                if (res.status === 'done' && res.changed > 0) {

                    var rebuilt = _nodesToSongSay(t.nodes, hosts);

                    if (rebuilt) {

                        v3.saveSongScript(t.item, {

                            id: t.version.id && String(t.version.id).indexOf('current-') !== 0 ? t.version.id : '',

                            host: (t.nodes[0] && t.nodes[0].host) || t.item.host || '',

                            say: rebuilt,

                            favorite: !!t.version.favorite,

                            label: t.version.label || 'AI 校对'

                        });

                        fixedCount++;

                    }

                } else if (res.status === 'done') {

                    fixedCount++; /* AI 说没问题，也算处理了 */

                } else {

                    failedCount++;

                }

                next();

            });

        }

        next();

    }

        next();

    }



    function _returnBrief(t) {

        t = String(t || '').replace(/```(?:json)?/gi, '').replace(/```/g, '').replace(/\r/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

        return t.length > 1000 ? t.slice(0, 1000) + '...' : t;

    }



    function _arrFromObj(o, names) {

        if (!o) return null;

        if (Object.prototype.toString.call(o) === '[object Array]') return o;

        for (var i = 0; i < names.length; i++) {

            var v = o[names[i]];

            if (v && Object.prototype.toString.call(v) === '[object Array]') return v;

        }

        return null;

    }



    function _normalizeRadioItem(it) {

        it = it || {};

        var src = it.song || it.music || it.track || it.audio || {};

        var title = src.title || it.title || it.name || '';

        var artist = src.artist || it.artist || it.singer || it.author || '';

        it.song = { title: title, artist: artist, query: [title, artist].filter(Boolean).join(' '), url: '' };

        it.say = it.say || it.script || it.line || it.text || it.voiceTag || it.voice || '';

        it.host = it.host || it.speaker || it.character || it.role || '';

        return it;

    }



    function _itemsFromReturn(t) {

        var o = _jsonFromText(t);

        var arr = _arrFromObj(o, ['items', 'songs', 'tracks', 'queue', 'list', 'results', 'data']);

        if (!arr) return null;

        var out = [];

        for (var i = 0; i < arr.length; i++) out.push(_normalizeRadioItem(arr[i]));

        return out;

    }



    function _scriptsFromReturn(t) {

        var o = _jsonFromText(t);

        return _arrFromObj(o, ['scripts', 'items', 'results', 'data']);

    }



    function _formatReturnError(t) {

        var b = _returnBrief(t);

        return b ? '返回格式不可用；API已返回文本，开头：' + b : '返回格式不可用；API返回为空';

    }



    function _charByName(n, hosts) {

        n = (n || '').trim().toLowerCase();

        var all = hosts.concat(_chars());

        var exact = [], sub = [];

        for (var i = 0; i < all.length; i++) {

            var cn = (all[i].name || '').trim().toLowerCase();

            if (!cn) continue;

            if (cn === n) exact.push(all[i]);

            else if (n.indexOf(cn) >= 0 || cn.indexOf(n) >= 0) sub.push(all[i]);

        }

        function pick(list) {

            for (var k = 0; k < list.length; k++) if (list[k].ttsEnabled) return list[k];

            return list[0];

        }

        if (exact.length) return pick(exact);

        if (sub.length) return pick(sub);

        return hosts[0] || _chars()[0] || {};

    }



        function _charByCid(cid) {

            var cs = _chars();

            for (var i = 0; i < cs.length; i++) {

                if (_charId(cs[i]) === cid) return cs[i];

            }

            return null;

        }



    function _hexToBytes(hex) {

        var arr = (hex || '').match(/.{1,2}/g);

        if (!arr) return new Uint8Array(0);

        var u = new Uint8Array(arr.length);

        for (var i = 0; i < arr.length; i++) u[i] = parseInt(arr[i], 16);

        return u;

    }



    function _jpNameMapPairs() {

        /* 解析「日文朗读人名读音替换」映射表为 [{k,v}]，先长后短排序（长 key 优先，避免"五"先命中"五条"） */
        var mapSrc = (cfg.ttsJpNameMap && String(cfg.ttsJpNameMap).trim()) || '';

        /* 旧默认映射（平假名+拆词）→ 新默认映射（片假名+整体三字名）：仅当用户从未手动修改（等于旧默认）时迁移，
         * 让 TTS 把名字按专名连读，避免把"すぐる/さとる"当动词分词导致名字中间停顿、名字感读不出来。 */
        if (mapSrc === '五条=ごじょう\n杰=すぐる\n傑=すぐる\n悟=さとる\n悟り=さとり\n悟る=さとる\n悟った=さとった\n夏油=げとう') {

            mapSrc = '五条悟=ゴジョウサトル\n夏油杰=ゲトウスグル\n夏油傑=ゲトウスグル\n五条=ゴジョウ\n杰=スグル\n傑=スグル\n悟=サトル\n悟り=さとり\n悟る=さとる\n悟った=さとった\n夏油=ゲトウ';

        }

        var pairs = [];

        if (!mapSrc) return pairs;

        String(mapSrc).split(/[\r\n]+/).forEach(function(line) {

            line = String(line || '').trim();

            if (!line) return;

            var eq = line.indexOf('=');

            if (eq <= 0) return;

            var k = line.slice(0, eq).trim(), v = line.slice(eq + 1).trim();

            if (k && v && v !== k) pairs.push({ k: k, v: v });

        });

        pairs.sort(function(a, b) { return b.k.length - a.k.length; });

        return pairs;

    }



    function _jpNameIsHan(c) {

        /* CJK 统一表意文字（汉字）判断：U+4E00–U+9FFF；人名独立成词判定的边界用 */
        return !isNaN(c) && c >= 0x4E00 && c <= 0x9FFF;

    }



    function _jpNameIsKeyStart(txt, idx, pairs) {

        /* 位置 idx 的字符是否「某映射 key 的开头」（如"五条悟"中"悟"是 key 开头）→ 连续人名的一部分 */
        if (!_jpNameIsHan(txt.charCodeAt(idx))) return false;

        for (var p = 0; p < pairs.length; p++) {

            if (txt.slice(idx, idx + pairs[p].k.length) === pairs[p].k) return true;

        }

        return false;

    }



    function _jpNameIsDetectKey(k, oneKeys) {

        /* 检测用：判断 key 是否「人名 key」（需标记修复）。单字 key（杰/悟/傑）是人名；
         * 长 key 若含单字 key 子串（悟り/悟る/悟った）视为「词保护行」——只保证运行时读音正确，
         * 不是人名场景，检测不标记（避免 AI 白跑改写正常日文词）。长 key 不含单字 key（五条/夏油）→ 人名。 */
        if (k.length === 1) return true;

        for (var o = 0; o < oneKeys.length; o++) {

            if (k.indexOf(oneKeys[o]) >= 0) return false;

        }

        return true;

    }



    function _jpNameScanNeed(txt, pairs) {

        /* 检测人名是否需要修复：与 _jpNameReplaceText 相同边界扫描，但只统计「人名 key」的替换发生；
         * 词保护行（含单字 key 的长 key，如"悟り"）的匹配不算人名。 */
        if (!txt) return false;

        var oneKeys = [];

        pairs.forEach(function(p) { if (p.k.length === 1) oneKeys.push(p.k); });

        var i = 0, pi, k, matched, lastEnd = -1, prevOk, nextOk;

        while (i < txt.length) {

            matched = false;

            for (pi = 0; pi < pairs.length; pi++) {

                k = pairs[pi].k;

                if (txt.slice(i, i + k.length) === k) {

                    prevOk = (i === lastEnd) || !_jpNameIsHan(txt.charCodeAt(i - 1)) || _jpNameIsKeyStart(txt, i - 1, pairs);

                    nextOk = !_jpNameIsHan(txt.charCodeAt(i + k.length)) || _jpNameIsKeyStart(txt, i + k.length, pairs);

                    if (prevOk && nextOk) {

                        if (_jpNameIsDetectKey(k, oneKeys)) return true;

                        i += k.length;

                        lastEnd = i;

                        matched = true;

                        break;

                    }

                }

            }

            if (!matched) i++;

        }

        return false;

    }



    function _jpNameReplaceText(txt, pairs) {

        /* 人名读音替换：仅当 key「独立成词」时替换。
         * 前边界 OK = 紧接上次替换（连续人名，如"夏油杰"中"杰"前是"夏油"结尾）/ 前非汉字 / 前是某 key 开头；
         * 后边界 OK = 后非汉字 / 后是某 key 开头（如"五条悟"中"悟"）。
         * 前后是含同字的词组汉字（"杰出"的"出"）→ 不替换，避免误伤。
         * pairs 已先长后短排序，每个位置优先匹配最长 key。 */
        if (!txt) return txt;

        var out = '', i = 0, pi, k, matched, lastEnd = -1, prevOk, nextOk;

        while (i < txt.length) {

            matched = false;

            for (pi = 0; pi < pairs.length; pi++) {

                k = pairs[pi].k;

                if (txt.slice(i, i + k.length) === k) {

                    prevOk = (i === lastEnd) || !_jpNameIsHan(txt.charCodeAt(i - 1)) || _jpNameIsKeyStart(txt, i - 1, pairs);

                    nextOk = !_jpNameIsHan(txt.charCodeAt(i + k.length)) || _jpNameIsKeyStart(txt, i + k.length, pairs);

                    if (prevOk && nextOk) {

                        out += pairs[pi].v;

                        i += k.length;

                        lastEnd = i;

                        matched = true;

                        break;

                    }

                }

            }

            if (!matched) { out += txt.charAt(i); i++; }

        }

        return out;

    }



    function _jpNameSpeechText(text, ch) {

        text = String(text || '');

        if (!text) return text;

        /* 触发条件：角色配了日文 OR 文本本身含日文假名（ひらがな/カタカナ）。
         * 不依赖角色 ttsSpeakLang——TTS 本身按文本内容判断语言，角色配置可能不准，
         * 导致"明明在读日文却没做人名替换"（如"傑"被音读成 ケツ）。 */
        var lg = _radioLangCode((ch && ch.ttsSpeakLang) || (ch && ch.ttsLanguage) || '');

        var hasKana = /[ぁ-んァ-ヶー]/.test(text);

        if (lg !== 'ja' && !hasKana) return text;

        var pairs = _jpNameMapPairs();

        if (!pairs.length) return text;

        return _jpNameReplaceText(text, pairs);

    }



    function _tts(text, ch, ok, err, langHint) {

        if (cfg.radioTtsEnabled === false || cfg.radioTtsEnabled === 'false') {

            err && err('TTS 已在设置中关闭');

            return;

        }

        var tries = (cfg.autoRetry === false || cfg.autoRetry === 'false') ? 0 : _num(cfg.retryCount, 2);

        (function attempt(left) {

            _ttsOnce(text, ch, ok, function(e) {

                if (left > 0) attempt(left - 1);

                else err && err(e);

            }, langHint);

        })(tries);

    }



    function _ttsProviderFor(ch) {

        return (ch && ch.ttsProvider) || cfg.ttsProviderOverride || sbS.ttsProvider || 'minimax';

    }



    function _ttsOnce(text, ch, ok, err, langHint) {

        text = (text || '').trim();

        if (!text) {

            err('空文本');

            return;

        }

        if (!ch || !ch.ttsEnabled) {

            err('角色未开启TTS');

            return;

        }

        var provider = _ttsProviderFor(ch);

        if (provider === 'fishaudio') {

            _ttsOnceFish(text, ch, ok, err);

        } else {

            _ttsOnceMiniMax(text, ch, ok, err, langHint);

        }

    }



    function _radioLangCode(s) {

        s = String(s || '').trim().toLowerCase();

        if (/^(ja|jp|japanese|日文|日语)$/.test(s)) return 'ja';

        if (/^(zh|zh-cn|zh_cn|zh-hans|chinese|中文|汉语|普通话)$/.test(s)) return 'zh';

        if (/^(en|english|英文|英语)$/.test(s)) return 'en';

        if (/^(ko|korean|韩文|韩语)$/.test(s)) return 'ko';

        if (/^(yue|cantonese|粤语)$/.test(s)) return 'yue';

        return '';

    }



    function _ttsOnceMiniMax(text, ch, ok, err, langHint) {

        var key = (cfg.useOwnTts && cfg.ownTtsKey) || sbS.ttsApiKey || '';

        var gid = (cfg.useOwnTts && cfg.ownTtsGid) || sbS.ttsGroupId || '';

        if (!key || !gid) {

            err('未配置 MiniMax Key/GroupId');

            return;

        }

        var host = (sbS.ttsApiHost || 'https://api.minimax.chat').replace(/\/+$/, '');

        var vs = {

            voice_id: (ch && ch.ttsVoiceId) || 'female-shaonv',

            speed: parseFloat(ch && ch.ttsSpeed) || 1,

            vol: 1,

            pitch: 0

        };

        if (ch && ch.ttsLanguage) vs.language = ch.ttsLanguage;

        var _lang = _radioLangCode(langHint || (ch && ch.ttsSpeakLang) || (ch && ch.ttsLanguage) || _voiceLang());

        if (_lang) vs.language = _lang;

        var body = {

            model: sbS.ttsModel || 'speech-02-hd',

            text: text,

            stream: false,

            voice_setting: vs,

            audio_setting: {

                sample_rate: 32000,

                bitrate: 128000,

                format: 'mp3',

                channel: 1

            }

        };

        TOP.fetch(host + '/v1/t2a_v2?GroupId=' + gid, {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json',

                'Authorization': 'Bearer ' + key

            },

            body: JSON.stringify(body)

        }).then(function(r) {

            if (!r.ok) throw new Error('TTS HTTP ' + r.status);

            return r.json();

        }).then(function(d) {

            if (d.base_resp && d.base_resp.status_code !== 0) throw new Error(d.base_resp.status_msg || 'TTS错误');

            var hex = d.data && d.data.audio;

            if (!hex) throw new Error('TTS 返回无音频');

            var bytes = _hexToBytes(hex);

            var blob = new TOP.Blob([bytes], {

                type: 'audio/mpeg'

            });

            ok((TOP.URL || URL).createObjectURL(blob));

        }).catch(function(e) {

            err(e.message || String(e));

        });

    }



    function _ttsOnceFish(text, ch, ok, err) {

        var key = (cfg.useOwnTts && cfg.ownFishKey) || sbS.fishApiKey || '';

        if (!key) {

            err('未配置 Fish Audio API Key');

            return;

        }

        var model = sbS.fishModel || 's2.1-pro';

        var body = {

            text: text,

            format: 'mp3',

            mp3_bitrate: 64,

            prosody: {

                speed: parseFloat(ch && ch.ttsSpeed) || 1,

                volume: 0

            },

            latency: sbS.fishLatency || 'balanced'

        };

        var vid = (ch && ch.fishVoiceId) || '';

        if (vid) body.reference_id = vid;

        if (sbS.fishTemperature !== undefined && sbS.fishTemperature !== null && sbS.fishTemperature !== '') {

            body.temperature = parseFloat(sbS.fishTemperature);

        }

        if (sbS.fishTopP !== undefined && sbS.fishTopP !== null && sbS.fishTopP !== '') {

            body.top_p = parseFloat(sbS.fishTopP);

        }

        var proxyPort = sbS.fishProxyPort || '8765';

        var proxyHost = (sbS.fishProxyHost || '').trim(); if (!proxyHost) { try { proxyHost = TOP.location.hostname || '127.0.0.1'; } catch (e) { proxyHost = '127.0.0.1'; } } var proxyUrlHost = (proxyHost.indexOf(':') >= 0 && proxyHost.charAt(0) !== '[') ? ('[' + proxyHost + ']') : proxyHost; var proxyUrl = 'http://' + proxyUrlHost + ':' + proxyPort + '/tts';

        TOP.fetch(proxyUrl, {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json'

            },

            body: JSON.stringify({ apiKey: key, model: model, payload: body })

        }).then(function(r) {

            if (!r.ok) {

                return r.text().then(function(t) {

                    var msg = 'Fish Audio HTTP ' + r.status;

                    try {

                        var j = JSON.parse(t);

                        if (j && j.message) msg = j.message;

                        else if (j && j.error) msg = j.error;

                    } catch (e2) {}

                    throw new Error(msg);

                });

            }

            return r.arrayBuffer();

        }).then(function(buf) {

            var blob = new TOP.Blob([buf], { type: 'audio/mpeg' });

            ok((TOP.URL || URL).createObjectURL(blob));

        }).catch(function(e) {

            var msg = (e && e.message) || String(e);

            if (/Failed to fetch|NetworkError|Load failed/i.test(msg)) {

                msg = '未连接到本地 Fish Audio 代理(127.0.0.1:' + proxyPort + ')，请先双击运行 fish-tts-proxy 里的 启动.bat';

            }

            err(msg);

        });

    }



    function _parseSaySegments(s) {

        s = String(s || '').trim();

        var out = [], matches = [], m, i, start, end, body, plain;

        /* VoiceTag 支持两种形态：
         * 形态 A（标准三字段）：[VoiceTag:主持人:朗读语言:发送文本]“显示文本”
         * 形态 B（两字段 + 「」/引号）：[VoiceTag:主持人:语言标注]「发送文本」“显示文本”
         * 形态 B 兼容台本库旧版/手动编辑的歌曲台本（如 [VoiceTag:夏油杰:夏油杰（日文）]「…」"…"），
         * 避免整段（含中文翻译）被当作朗读文本混念。 */
        var re3 = /\[VoiceTag\s*[:：]\s*([^:：\]]+)\s*[:：]\s*([^:：\]]+)\s*[:：]\s*([\s\S]*?)\]/ig, re2 = /\[VoiceTag\s*[:：]\s*([^:：\]]+)\s*[:：]\s*([^:：\]]+)\]\s*[「]([\s\S]*?)[」]/ig;

        while ((m = re3.exec(s))) matches.push({ index: m.index, end: re3.lastIndex, name: m[1], lang: m[2], text: m[3], two: false });

        while ((m = re2.exec(s))) {

            var overlap = matches.some(function(x) { return (m.index >= x.index && m.index < x.end) || (x.index >= m.index && x.index < re2.lastIndex); });

            if (!overlap) matches.push({ index: m.index, end: re2.lastIndex, name: m[1], lang: m[2], text: m[3], two: true });

        }

        matches.sort(function(a, b) { return a.index - b.index; });

        if (!matches.length) return [_parseSaySingle(s)];

        if (matches[0].index > 0) { plain = s.slice(0, matches[0].index).trim().replace(/^[“\"]|[”\"]$/g, '').trim(); if (plain) out.push({tag:null,tts:plain.replace(/[“”\"]/g,'').trim(),display:plain}); }

        for (i=0; i<matches.length; i++) {

            start = matches[i].end; end = i + 1 < matches.length ? matches[i + 1].index : s.length;

            body = s.slice(start, end).trim().replace(/^[“\"]|[”\"]$/g, '').trim();

            if (body || matches[i].text.trim()) out.push({tag:{name:matches[i].name.trim(),lang:matches[i].lang.trim(),text:matches[i].text.trim()},tts:matches[i].text.trim(),display:body});

        }

        return out.length ? out : [_parseSaySingle(s)];

    }



    function _parseSaySingle(s) {

        s = String(s || '');

        var tag = null,

            display = '',

            tts = '';

        var m = s.match(/\[VoiceTag\s*[:：]\s*([^:：\]]+)\s*[:：]\s*([^:：\]]+)\s*[:：]\s*([\s\S]*?)\]/i);

        if (m) {

            tag = {

                name: m[1].trim(),

                lang: m[2].trim(),

                text: m[3].trim()

            };

            tts = tag.text;

            display = s.replace(m[0], '').trim();

        } else {

            /* 形态 B（两字段 + 「」/引号）：[VoiceTag:主持人:语言标注]「发送文本」"显示文本" */
            var m2 = s.match(/\[VoiceTag\s*[:：]\s*([^:：\]]+)\s*[:：]\s*([^:：\]]+)\]\s*[「]([\s\S]*?)[」]\s*[“"]([\s\S]*?)[”"]?\s*$/);

            if (m2) {

                tag = {

                    name: m2[1].trim(),

                    lang: m2[2].trim(),

                    text: m2[3].trim()

                };

                tts = tag.text;

                display = m2[4] ? m2[4].trim() : '';

            } else {

                tts = s.replace(/[“”"]/g, '').trim();

                display = s;

            }

        }

        var q = display.match(/[“"]([\s\S]*?)[”"]\s*$/);

        if (q) display = q[1].trim();

        display = display.replace(/^[“"]|[”"]$/g, '').trim();

        if (!display) display = tts;

        return {

            tag: tag,

            tts: tts,

            display: display

        };

    }



    function _parseSay(s) {

        var all = _parseSaySegments(s);

        return all[0] || { tag: null, tts: '', display: '' };

    }



    function _splitCaption(text) {

        text = String(text || '').replace(/\r/g, '\n').trim();

        if (!text) return [];

        var out = [],

            buf = '',

            lastHost = '';

        for (var i = 0; i < text.length; i++) {

            var m = text.slice(i).match(/^\s*([^\n：:]{1,24})\s*[：:]\s*/);

            if (m && (i === 0 || text.charAt(i - 1) === '\n')) {

                var t0 = buf.replace(/\n+/g, ' ').trim();

                if (t0) out.push(lastHost ? (lastHost + '：' + t0) : t0);

                buf = '';

                lastHost = m[1].trim();

                i += m[0].length - 1;

                continue;

            }

            var c = text.charAt(i);

            buf += c;

            if (c === '\n' || /[。！？!?；;.]/.test(c)) {

                var t = buf.replace(/\n+/g, ' ').trim();

                if (t) out.push(lastHost ? (lastHost + '：' + t) : t);

                buf = '';

            }

        }

        var rest = buf.trim();

        if (rest) out.push(lastHost ? (lastHost + '：' + rest) : rest);

        return out.length ? out : [text];

    }



    function _captionEnabled(key, legacy) {

        if (cfg[key] !== undefined) return cfg[key] !== false && cfg[key] !== 'false';

        return key === 'captionOnFloat';

    }



    function _captionTargets() {

        var a = [];

        if (_captionEnabled('captionOnFloat', 'float')) a.push('float');

        if (_captionEnabled('captionTopRight', 'top-right')) a.push('top-right');

        return a;

    }



    function _captionHost(kind) {

        try {

            if (kind === 'top-right') return TOPDOC.body;

            if (kind === 'dialog') {

                var d = _vnDialogBox();

                return d ? (d.parentElement || TOPDOC.body) : TOPDOC.body;

            }

            return TOPDOC.fullscreenElement || TOPDOC.webkitFullscreenElement || TOPDOC.querySelector('#pp-reader,#pp-stage,#pp-overlay,#pp-viewer,.pp-reader,.pp-stage,.pp-overlay,.pp-viewer,.pp-fullscreen') || TOPDOC.body;

        } catch (e) {

            return TOPDOC.body;

        }

    }



    function _vnRoot() {

        try {

            return TOPDOC.querySelector('#pp-reader,#pp-stage,#pp-overlay,#pp-viewer,.pp-reader,.pp-stage,.pp-overlay,.pp-viewer,.pp-fullscreen,[data-vn-root],[data-pp-root]');

        } catch (e) {

            return null;

        }

    }



    function _vnDialogBox() {

        try {

            var root = _vnRoot();

            if (!root) return null;

            var sels = ['.pp-dialog', '#pp-dialog', '.pp-dialogue', '.pp-textbox', '.pp-text-box', '.vn-dialog', '.vn-dialogue', '.vn-textbox', '.vn-text-box', '.visual-novel-dialog', '.visual-novel-textbox', '[data-vn-dialog]', '[data-pp-dialog]'];

            for (var i = 0; i < sels.length; i++) {

                var d = root.matches && root.matches(sels[i]) ? root : root.querySelector(sels[i]);

                if (d) {

                    var r = d.getBoundingClientRect();

                    if (r.width > 120 && r.height > 40) return d;

                }

            }

            var kids = [].slice.call(root.querySelectorAll('div,section,article')).filter(function(x) {

                var r = x.getBoundingClientRect(),

                    cs = TOP.getComputedStyle(x);

                return r.width > 260 && r.height > 70 && r.top > (TOP.innerHeight || 768) * .45 && cs.display !== 'none' && cs.visibility !== 'hidden';

            }).sort(function(a, b) {

                var ra = a.getBoundingClientRect(),

                    rb = b.getBoundingClientRect();

                return (rb.width * rb.height) - (ra.width * ra.height);

            });

            return kids[0] || null;

        } catch (e) {

            return null;

        }

    }



    function _captionStyle(p, fs, kind) {

        p.className = 'vnr-float-caption ' + (kind ? 'is-' + kind : '');

        p.style.cssText = 'position:fixed;z-index:2147483647!important;max-width:min(440px,calc(100vw - 28px));padding:8px 16px;border-radius:100px;background:transparent;border:none;box-shadow:0 10px 28px rgba(0,0,0,.22);color:#fff;font-size:' + fs + 'px;line-height:1.45;letter-spacing:-.2px;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;opacity:0;left:0;top:0;right:auto;bottom:auto;transform:translate3d(-9999px,-9999px,0) scale(.985);transition:opacity .18s ease,transform .12s ease,max-width .12s ease;font-family:-apple-system,BlinkMacSystemFont,"SF Pro","PingFang SC","Segoe UI",sans-serif;pointer-events:none;';

        try {

            applyGlass(p, 'caption');

            p.classList.add('vnr2-lg-nc');

        } catch (e) {}

        var txt = TOPDOC.createElement('span');

        txt.className = 'vnr-cap-text';

        txt.style.cssText = 'position:relative;z-index:20;display:inline-block;filter:none!important;-webkit-filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;transform:translateZ(0);';

        p.appendChild(txt);

        var tail = TOPDOC.createElement('i');

        tail.className = 'vnr-cap-tail';

        tail.style.cssText = 'display:none!important;pointer-events:none;';

        p.appendChild(tail);

        p.__txt = txt;

        p.__tail = tail;

    }



    function _capSetText(p, t) {

        if (p.__txt) p.__txt.textContent = t;

        else p.textContent = t;

    }



    function _moveCaption(p, x, y, w) {

        p.style.left = '0px';

        p.style.top = '0px';

        p.style.right = 'auto';

        p.style.bottom = 'auto';

        if (w) p.style.maxWidth = w + 'px';

        p.style.transform = 'translate3d(' + Math.round(x) + 'px,' + Math.round(y) + 'px,0) scale(1)';

        if (p.__vnmGlassKey) _refreshGlassSize(p, p.__vnmGlassKey);

    }



    function _capTail(p, show, x) {

        if (!p.__tail) return;

        p.__tail.style.display = 'none';

    }



    function _placeCaption(p, kind) {

        var sw = TOP.innerWidth || TOPDOC.documentElement.clientWidth || 1024,

            sh = TOP.innerHeight || TOPDOC.documentElement.clientHeight || 768,

            pr = p.getBoundingClientRect(),

            pw = Math.max(190, pr.width || 260),

            ph = Math.max(36, pr.height || 60);

        if (kind === 'top-right') {

            try {

                if (p.parentNode !== TOPDOC.body) TOPDOC.body.appendChild(p);

            } catch (e) {}

            _capTail(p, false);

            _moveCaption(p, Math.max(12, sw - Math.min(560, sw - 28) - 18), 18, Math.min(560, sw - 28));

            return true;

        }

        if (kind === 'dialog') {

            var d = _vnDialogBox();

            if (!d) {

                p.style.opacity = '0';

                p.style.transform = 'translate3d(-9999px,-9999px,0) scale(.985)';

                return false;

            }

            try {

                if (p.parentNode !== TOPDOC.body) TOPDOC.body.appendChild(p);

            } catch (e) {}

            var r = d.getBoundingClientRect(),

                mw = Math.min(Math.max(260, r.width - 24), Math.max(260, sw - 28));

            var x = Math.max(14, Math.min(r.left + 12, sw - mw - 14));

            var y = Math.max(14, r.top + 10);

            _capTail(p, false);

            _moveCaption(p, x, y, mw);

            return true;

        }

        var shell = TOP.__vnmRadioShellEl;

        if (shell && shell.isConnected) {

            var isBar = shell.classList && shell.classList.contains('is-bar'),

                isStudio = shell.classList && shell.classList.contains('is-studio'),

                anchor = isBar ? shell.querySelector('.vnr2-bar') : shell.querySelector('.vnr2-orb'),

                rr = (anchor || shell).getBoundingClientRect(),

                mw;

            if (isBar) {

                mw = Math.max(220, Math.min(rr.width - 20, 520, sw - 24));

                var bx = Math.max(12, Math.min(rr.left + 10, sw - mw - 12));

                var by = Math.max(12, rr.top - ph - 14);

                _moveCaption(p, bx, by, mw);

                var q = shell.querySelector('.vnr2-quote-btn');

                if (q) {

                    var qr = q.getBoundingClientRect();

                    var tx = qr.left + qr.width / 2 - bx - 7;

                    _capTail(p, true, _clamp(tx, 14, Math.max(14, (pr.width || mw) - 28)));

                } else _capTail(p, true, 24);

                return true;

            }

            if (isStudio) {

                p.style.opacity = '0';

                p.style.transform = 'translate3d(-9999px,-9999px,0) scale(.985)';

                return false;

            }

            var leftSpace = rr.left - 18,

                rightSpace = sw - rr.right - 18,

                preferLeft = leftSpace > rightSpace;

            _capTail(p, false);

            if (preferLeft && leftSpace > 190) {

                mw = Math.min(360, leftSpace - 8);

                _moveCaption(p, Math.max(12, rr.left - mw - 10), Math.max(12, Math.min(rr.top + 4, sh - ph - 12)), mw);

            } else {

                mw = Math.min(360, Math.max(200, rightSpace - 8));

                _moveCaption(p, Math.min(sw - mw - 12, rr.right + 10), Math.max(12, Math.min(rr.top + 4, sh - ph - 12)), mw);

            }

            return true;

        }

        _capTail(p, false);

        _moveCaption(p, Math.max(12, sw - Math.min(440, sw - 28) - 16), 16, Math.min(440, sw - 28));

        return true;

    }



    function _popup(text) {

        var targets = _captionTargets();

        if (!targets.length) return {

            close: function() {},

            setText: function() {}

        };

        var fs = _clamp(cfg.popupFontSize || 13, 10, 22),

            nodes = [],

            dead = false,

            raf = 0;



        function tick() {

            if (dead) return;

            for (var j = 0; j < nodes.length; j++) {

                var ok = _placeCaption(nodes[j].el, nodes[j].kind);

                nodes[j].el.style.display = ok ? 'block' : 'none';

                if (ok) nodes[j].el.style.opacity = '1';

            }

            raf = TOP.requestAnimationFrame(tick);

        }

        for (var i = 0; i < targets.length; i++) {

            var old = TOPDOC.getElementById('pp-radio-caption-' + targets[i]);

            if (old) old.remove();

            var p = TOPDOC.createElement('div');

            p.id = 'pp-radio-caption-' + targets[i];

            _captionStyle(p, fs, targets[i]);

            _capSetText(p, text);

            _captionHost(targets[i]).appendChild(p);

            _refreshGlassSize(p, 'caption');

            nodes.push({

                el: p,

                kind: targets[i]

            });

            _placeCaption(p, targets[i]);

        }

        raf = TOP.requestAnimationFrame(tick);

        TOP.setTimeout(function() {

            for (var j = 0; j < nodes.length; j++) {

                if (nodes[j].kind !== 'dialog' || nodes[j].el.style.display !== 'none') nodes[j].el.style.opacity = '1';

                _placeCaption(nodes[j].el, nodes[j].kind);

            }

        }, 20);

        return {

            setText: function(t) {

                for (var j = 0; j < nodes.length; j++) {

                    _capSetText(nodes[j].el, t);

                    _refreshGlassSize(nodes[j].el, 'caption');

                    _placeCaption(nodes[j].el, nodes[j].kind);

                }

            },

            close: function() {

                dead = true;

                try {

                    TOP.cancelAnimationFrame(raf);

                } catch (e) {}

                for (var j = 0; j < nodes.length; j++) {

                    (function(n) {

                        n.el.style.opacity = '0';

                        TOP.setTimeout(function() {

                            try {

                                n.el.remove();

                            } catch (e) {}

                        }, 260);

                    })(nodes[j]);

                }

            }

        };

    }





    function _artistText(a) {

        if (!a) return '';

        if (Object.prototype.toString.call(a) === '[object Array]') return a.map(function(x) {

            return typeof x === 'object' ? (x.name || '') : String(x || '');

        }).filter(Boolean).join(' / ');

        return String(a || '');

    }



    function _gdUrl(params) {

        var base = (cfg.gdMusicApiBase || 'https://music-api.gdstudio.xyz/api.php').replace(/\s+/g, '').replace(/\?+$/, '');

        if (base.slice(-1) === '/') base = base + 'api.php';

        var qs = [];

        for (var k in params) {

            if (params.hasOwnProperty(k)) qs.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));

        }

        return base + (base.indexOf('?') >= 0 ? '&' : '?') + qs.join('&');

    }



    function _fetchJson(url) {

        return TOP.fetch(url).then(function(r) {

            if (!r.ok) throw new Error('HTTP ' + r.status);

            return r.json();

        }).catch(function() {

            return TOP.fetch('https://corsproxy.io/?' + encodeURIComponent(url)).then(function(r) {

                if (!r.ok) throw new Error('HTTP ' + r.status);

                return r.json();

            });

        });

    }



    function _scoreTrack(track, title, artist) {

        var tn = _normMusic(track && track.name);

        var ta = _normMusic(_artistText(track && track.artist));

        var tt = _normMusic(title);

        var at = _normMusic(artist);

        var sc = 100;

        if (tt) {

            if (tn === tt) sc += 60;

            else if (tn.indexOf(tt) >= 0 || tt.indexOf(tn) >= 0) sc += 25;

            else sc -= 35;

        }

        if (at) {

            if (ta === at) sc += 50;

            else if (ta.indexOf(at) >= 0 || at.indexOf(ta) >= 0) sc += 20;

            else sc -= 10;

        }

        return sc;

    }



    function _fillMeta(song, cb) {

        song = song || {};

        var haveLyric = !!song._lyricId, havePic = !!(song._picId || song.coverUrl);

        if (song.source && haveLyric && havePic) { cb && cb(song); return; }

        var q = song.query || [song.title, song.artist].filter(Boolean).join(' ');

        if (!q) { cb && cb(song); return; }

        var srcs = ['netease', 'kuwo', 'kugou', 'tencent'], i = 0;

        (function tryS() {

            if (i >= srcs.length) { cb && cb(song); return; }

            var src = srcs[i++];

            _fetchJson(_gdUrl({ types: 'search', source: src, name: q, count: 8, pages: 1 })).then(function(data) {

                var best = null;

                if (data && data.length) {

                    for (var j = 0; j < data.length; j++) {

                        var tr = data[j] || {};

                        tr._score = _scoreTrack(tr, song.title || q, song.artist || '');

                        if (!best || tr._score > best._score) best = tr;

                    }

                }

                if (best && best.id) {

                    song.source = song.source || src;

                    if (best.lyric_id) song._lyricId = song._lyricId || best.lyric_id;

                    if (best.pic_id) song._picId = song._picId || best.pic_id;

                    song._trackId = song._trackId || best.id;

                    cb && cb(song);

                } else tryS();

            }).catch(function() { tryS(); });

        })();

    }



    function _resolveSong(song, ok, fail) {

        song = song || {};

        if (song.url && song._urlVerified === true) {

            if (!song.source || !song._lyricId || (!song._picId && !song.coverUrl)) {

                _fillMeta(song, function() { ok(song); });

            } else ok(song);

            return;

        }

        var q = song.query || [song.title, song.artist].filter(Boolean).join(' ');

        if (!q) {

            fail('\u6CA1\u6709\u53EF\u641C\u7D22\u7684\u6B4C\u66F2\u4FE1\u606F');

            return;

        }

        var srcs = ['netease', 'kuwo', 'kugou', 'tencent'].filter(function(x){ return !((song._badSources || []).indexOf(x) >= 0); }),

            tried = 0,

            lastErr = '';



        function trySource(i) {

            if (i >= srcs.length || tried >= 4) {

                fail(lastErr || '\u6CA1\u6709\u53EF\u7528\u97F3\u6E90');

                return;

            }

            var src = srcs[i];

            tried++;

            var searchUrl = _gdUrl({

                types: 'search',

                source: src,

                name: q,

                count: 8,

                pages: 1

            });

            _fetchJson(searchUrl).then(function(data) {

                var best = null;

                if (data && data.length) {

                    for (var j = 0; j < data.length; j++) {

                        var tr = data[j] || {};

                        tr.source = src;

                        tr._score = _scoreTrack(tr, song.title || q, song.artist || '');

                        if (!best || tr._score > best._score) best = tr;

                    }

                }

                if (!best || !best.id) {

                    lastErr = '\u6CA1\u6709\u53EF\u7528\u641C\u7D22\u7ED3\u679C';

                    trySource(i + 1);

                    return;

                }

                var url = _gdUrl({

                    types: 'url',

                    source: src,

                    id: best.id,

                    br: 320

                });

                _fetchJson(url).then(function(d) {

                    var playUrl = d && d.url;

                    if (!playUrl) {

                        lastErr = '\u6CA1\u6709\u64AD\u653E\u5730\u5740';

                        trySource(i + 1);

                        return;

                    }

                    song.url = playUrl;

                    song._urlVerified = true;

                    song.title = song.title || best.name;

                    song.artist = song.artist || _artistText(best.artist);

                    song.source = src;

                    song._trackId = best.id;

                    if (best.lyric_id) song._lyricId = best.lyric_id;

                    if (best.pic_id) song._picId = best.pic_id;

                    ok(song);

                }).catch(function(e) {

                    lastErr = (e && e.message) || '\u83B7\u53D6\u64AD\u653E\u5730\u5740\u5931\u8D25';

                    trySource(i + 1);

                });

            }).catch(function(e) {

                lastErr = (e && e.message) || '\u641C\u7D22\u5931\u8D25';

                trySource(i + 1);

            });

        }

        trySource(0);

    }



    function _searchSongs(q, ok, fail) {

        q = (q || '').trim();

        if (!q) {

            fail('请输入歌名或歌手');

            return;

        }

        var srcs = ['netease', 'kuwo', 'kugou', 'tencent'],

            all = [];



        function go(i) {

            if (i >= srcs.length) {

                all.sort(function(a, b) {

                    return (b._score || 0) - (a._score || 0);

                });

                var seen = {},

                    out = [];

                for (var k = 0; k < all.length && out.length < 16; k++) {

                    var tr = all[k];

                    var song = {

                        title: tr.name || q,

                        artist: _artistText(tr.artist),

                        query: (tr.name || q) + ' ' + _artistText(tr.artist),

                        source: tr.source,

                        _trackId: tr.id,

                        _picId: tr.pic_id,

                        _lyricId: tr.lyric_id

                    };

                    var key = _songKey(song);

                    if (key && !seen[key]) {

                        seen[key] = 1;

                        out.push(song);

                    }

                }

                ok(out);

                return;

            }

            var s = srcs[i];

            _fetchJson(_gdUrl({

                types: 'search',

                source: s,

                name: q,

                count: 8,

                pages: 1

            })).then(function(data) {

                if (data && data.length) {

                    for (var j = 0; j < data.length; j++) {

                        var tr = data[j] || {};

                        tr.source = s;

                        tr._score = _scoreTrack(tr, q, '');

                        all.push(tr);

                    }

                }

                go(i + 1);

            }).catch(function() {

                go(i + 1);

            });

        }

        go(0);

    }



    function _hostLangText() {

        var store = eng.store || {};

        var hosts = _selectedHosts(store);

        if (!hosts.length) return _voiceLang();

        var parts = hosts.map(function(c) {

            var nm = c.name || '主持人';

            var lg = c.ttsSpeakLang;

            var label = lg === 'ja' ? '日文' : lg === 'zh' ? '中文' : lg === 'en' ? '英文' : _voiceLang();

            return nm + '（' + label + '）';

        });

        return parts.join('；');

    }



    function _buildCommon(tpl, extra) {

        var store = eng.store || {};

        var hosts = _selectedHosts(store);

        var u = _user();

        var charWb = hosts.map(_getWbText).filter(Boolean).join('\n\n');

        var radioWb = _getRadioWbText();

        var wb = _joinTextParts([charWb, radioWb]);

        var s = String(tpl || '');

        var map = {

            主持人列表: _hostText(hosts),

            角色设定: _hostRoleText(hosts),

            用户名称: u.name || '用户',

            用户设定: u.persona || '',

            世界书: wb,

            电台世界书: radioWb,

            剧情上下文: _contextText(),

            酒馆历史: _getSTHistory(cfg.stHistN),

            Horae总结: _getHorae(),

            柏宝书总结: _getBaiBaiSummary(),

            曲库: _libText(_parseLibrary()),

            请求曲数: String(_num(cfg.batchSize, 1)),

            用户输入: (extra && extra.userInput) || store.userNote || '',

            朗读语言: _hostLangText(),

            显示语言: _displayLang(),

            音乐偏好: _tasteText(store),

            收藏曲目: _favText(),

            最近播放曲目: _recentText(cfg.recentDedupeCount),

            近期已播放曲目禁止重复: _recentNoRepeatText(cfg.recentDedupeCount),

            最近播放: _recentText(30),

            最近主播对话: _recentRadioTalk(cfg.recommendChatMessages),

            聊天总结: store.chatSummary || '（暂无总结）',

            曲目列表: (extra && extra.songList) || ''

        };

        for (var k in map) {

            if (map.hasOwnProperty(k)) s = s.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), map[k]);

        }

        return s;

    }

    var eng = TOP.__vnmRadioEngine || TOP._vnmRadioEngine;

    if (!eng || !eng.__vnmRadio) {

        eng = {

            __vnmRadio: true,

            running: false,

            paused: false,

            busy: false,

            scriptBusy: false,

            chatBusy: false,

            queue: [],

            log: [],

            current: null,

            music: null,

            voice: null,

            timer: null,

            ui: [],

            store: _load(),

            searchResults: []

        };

        TOP.__vnmRadioEngine = eng;

        TOP._vnmRadioEngine = eng;

    }

    eng.ctx = ctx;

    eng.cfg = cfg;

    eng.sbS = sbS;

    eng.backgroundPlayback = (cfg.backgroundPlayback !== false);

    if (!eng.store.chatHistory) eng.store.chatHistory = [];

    if (Object.prototype.toString.call(eng.store.recentPlayedSongs) !== '[object Array]') eng.store.recentPlayedSongs = [];

    if (Object.prototype.toString.call(eng.store.pendingQueue) !== '[object Array]') eng.store.pendingQueue = [];

    if ((!eng.queue || !eng.queue.length) && eng.store.pendingQueue.length) {

        eng.queue = eng.store.pendingQueue.map(function(it) {

            return _cloneItem(it);

        });

    }

    eng.saveStore = function() {

        _saveStore(eng.store || {});

    };

    eng.refreshChatUi = function() {

        try {

            TOP.dispatchEvent(new TOP.CustomEvent('pp-radio-chat-refresh'));

        } catch (e) {}

    };

    eng.saveQueue = function() {

        try {

            eng.store.pendingQueue = (eng.queue || []).map(function(it) {

                return _cloneItem(it);

            }).slice(0, 200);

            eng.saveStore();

        } catch (e) {}

    };

    if (!eng.apiStatus) eng.apiStatus = {

        state: 'idle',

        type: '',

        label: '',

        error: '',

        note: ''

    };



    function _saveCfg() {

        try {

            TOP.localStorage.setItem(CFG_KEY, JSON.stringify({ version: 1, savedAt: Date.now(), settings: cfg }));

        } catch (e) {}

        try {

            _W && _W();

        } catch (e) {}

    }



    function _escHtml(s) {

        return String(s || '').replace(/[&<>"]/g, function(c) {

            return {

                '&': '&amp;',

                '<': '&lt;',

                '>': '&gt;',

                '"': '&quot;'

            } [c] || c;

        });

    }

    TOP._vnmRadioToggleWbSettings = function(btn) {

        try {

            var field = btn && btn.closest && btn.closest('.ppfield');

            if (!field) {

                var el = btn;

                while (el && !field) {

                    if (el.classList && el.classList.contains('ppfield')) field = el;

                    el = el.parentElement;

                }

            }

            if (!field) return;

            var old = field.querySelector('.pp-radio-wb-picker');

            if (old) {

                old.remove();

                btn.textContent = '选择世界书';

                return;

            }

            btn.textContent = '收起世界书';

            var box = TOPDOC.createElement('div');

            box.className = 'pp-radio-wb-picker';

            box.style.cssText = 'margin-top:8px;padding:10px;border-radius:16px;background:rgba(255,255,255,.055);border:.5px solid rgba(255,255,255,.12);display:flex;flex-direction:column;gap:7px;';

            field.appendChild(box);

            var openGroups = {};



            function selected() {

                var ta = field.querySelector('textarea');

                return _radioWbSplit(ta ? ta.value : cfg.radioWbIds);

            }



            function write(arr) {

                _setRadioWbIds(arr);

                var ta = field.querySelector('textarea');

                if (ta) {

                    ta.value = cfg.radioWbIds || '';

                    try {

                        ta.dispatchEvent(new TOP.Event('input', {

                            bubbles: true

                        }));

                    } catch (e) {

                        ta.dispatchEvent(new Event('input', {

                            bubbles: true

                        }));

                    }

                }

            }



            function render() {

                box.innerHTML = '';

                var entries = (sbS.wbEntries || []).filter(function(e) {

                    return e;

                });

                var sel = selected(),

                    set = {};

                sel.forEach(function(id) {

                    set[id] = 1;

                });

                var top = TOPDOC.createElement('div');

                top.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11px;color:rgba(255,255,255,.48);';

                top.innerHTML = '<span>已绑定 ' + sel.length + ' 项</span><span>点击分组展开</span>';

                box.appendChild(top);

                if (!entries.length) {

                    var emp = TOPDOC.createElement('div');

                    emp.textContent = '暂无世界书条目。请先在【设置】-【世界书】中拉取。';

                    emp.style.cssText = 'font-size:12px;color:rgba(255,255,255,.46);line-height:1.5;';

                    box.appendChild(emp);

                    return;

                }

                var groups = {},

                    order = [];

                entries.forEach(function(e) {

                    var g = e.group || e._stWbName || '未分组';

                    if (!groups[g]) {

                        groups[g] = [];

                        order.push(g);

                    }

                    groups[g].push(e);

                });

                order.forEach(function(g) {

                    var list = groups[g];

                    var head = TOPDOC.createElement('button');

                    head.type = 'button';

                    head.style.cssText = 'width:100%;min-height:34px;border:none;border-radius:12px;background:rgba(255,255,255,.065);color:rgba(255,255,255,.78);font-size:12px;font-family:inherit;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 10px;cursor:pointer;text-align:left;';

                    var chosen = list.filter(function(e) {

                        return set[e.id] || set[e.name];

                    }).length;

                    head.innerHTML = '<span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + _escHtml(g) + ' (' + chosen + '/' + list.length + ')</span><span style="color:rgba(255,255,255,.42);">' + (openGroups[g] ? '收起' : '展开') + '</span>';

                    head.onclick = function(ev) {

                        ev.preventDefault();

                        ev.stopPropagation();

                        openGroups[g] = !openGroups[g];

                        render();

                    };

                    box.appendChild(head);

                    if (openGroups[g]) {

                        var body = TOPDOC.createElement('div');

                        body.style.cssText = 'display:grid;grid-template-columns:1fr;gap:5px;padding:2px 0 5px;';

                        list.forEach(function(e) {

                            var id = e.id || e.name || '';

                            var on = set[id] || set[e.name];

                            var row = TOPDOC.createElement('button');

                            row.type = 'button';

                            row.style.cssText = 'width:100%;min-height:32px;border:none;border-radius:11px;background:' + (on ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.045)') + ';border:.5px solid ' + (on ? 'rgba(255,255,255,.28)' : 'rgba(255,255,255,.08)') + ';color:rgba(255,255,255,' + (on ? '.94' : '.62') + ');font-size:12px;font-family:inherit;display:flex;align-items:center;gap:8px;padding:7px 10px;cursor:pointer;text-align:left;';

                            row.innerHTML = '<span style="width:16px;height:16px;border-radius:5px;display:inline-flex;align-items:center;justify-content:center;background:' + (on ? 'rgba(255,255,255,.90)' : 'rgba(255,255,255,.08)') + ';color:rgba(20,20,22,.9);font-size:12px;flex:0 0 auto;">' + (on ? '✓' : '') + '</span><span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + _escHtml(e.name || id || '未命名') + '</span>';

                            row.onclick = function(ev) {

                                ev.preventDefault();

                                ev.stopPropagation();

                                var cur = selected();

                                var k = cur.indexOf(id);

                                if (k >= 0) cur.splice(k, 1);

                                else cur.push(id);

                                write(cur);

                                render();

                            };

                            body.appendChild(row);

                        });

                        box.appendChild(body);

                    }

                });

            }

            render();

        } catch (e) {

            try {

                ctx.toast && ctx.toast('世界书选择器打开失败: ' + (e.message || e));

            } catch (_) {}

        }

    };



    



    



    



    function _setApiStatus(state, type, label, error, note) {

        eng.apiStatus = {

            state: state || 'idle',

            type: type || '',

            label: label || '',

            error: error || '',

            note: note || ''

        };

        eng.emit();

    }



    function _clearApiStatus(type) {

        if (!eng.apiStatus) return;

        if (!type || eng.apiStatus.type === type) _setApiStatus('idle', '', '', '', '');

    }



    function _retryApiStatus() {

        var st = eng.apiStatus || {};

        if (st.state !== 'error') return;

        if (st.type === 'resetRequest') {

            eng.resetRequest(st.note || '');

            return;

        }

        if (st.type === 'scripts') {

            eng.requestScripts(true);

            return;

        }

        if (st.type === 'chat') {

            eng.sendChat(st.note || '', true);

            return;

        }

        if (st.type === 'taste') {

            eng.distillTaste(st.note || '');

            return;

        }

        if (st.type === 'search') {

            eng.searchSongs(st.note || '');

            return;

        }

        eng.request(st.note || '');

    }



    function _cloneItem(it) {

        var n = JSON.parse(JSON.stringify(it || {}));

        n.id = _uuid();

        return n;

    }



    function _randomScript(fav) {

        var arr = (fav && fav.scriptVersions) || [];

        if (!arr.length) return '';

        return arr[Math.floor(Math.random() * arr.length)].say || '';

    }



    function _trimScripts(fav) {

        var max = _num(cfg.scriptHistoryMax, 3);

        if (!fav.scriptVersions) fav.scriptVersions = [];

        fav.scriptVersions = fav.scriptVersions.slice(0, max);

    }



    function _saveScriptToFav(key, say, label) {

        var fav = _favByKey(key);

        if (!fav || !say) return;

        fav.scriptVersions = fav.scriptVersions || [];

        fav.scriptVersions.unshift({

            id: _uuid(),

            t: Date.now(),

            say: say,

            label: label || '更新台本'

        });

        _trimScripts(fav);

        eng.saveStore();

    }



    function _itemFromSong(song, mode) {

        song = song || {};

        var key = _songKey(song),

            fav = _favByKey(key),

            say = '',

            needs = false,

            source = mode || 'manual';

        if (fav) {

            source = 'favorite';

            say = _randomScript(fav);

            needs = !say;

        } else {

            needs = true;

        }

        return {

            id: _uuid(),

            host: '',

            say: say,

            song: {

                title: song.title || '',

                artist: song.artist || '',

                query: song.query || '',

                url: song.url || '',

                source: song.source || '',

                _trackId: song._trackId || ''

            },

            sourceType: source,

            favKey: key,

            needsScript: needs,

            scriptFresh: false,

            spoken: false

        };

    }

    eng.loopFromHistory = function() {

        if (cfg.loopPlaylist !== true) return false;

        var lg = eng.log || [];

        if (!lg.length) return false;

        var arr = [];

        for (var i = lg.length - 1; i >= 0; i--) {

            if (lg[i] && lg[i].item) arr.push(_cloneItem(lg[i].item));

        }

        if (!arr.length) return false;

        eng.queue = arr;

        eng.emit();

        eng.next();

        return true;

    };

    eng.emit = function() {

        for (var i = 0; i < eng.ui.length; i++) {

            try {

                eng.ui[i]();

            } catch (e) {}

        }

    };

    eng.stop = function() {

        eng.running = false;

        eng.paused = false;

        eng.busy = false;

        if (eng.timer) {

            TOP.clearTimeout(eng.timer);

            eng.timer = null;

        }

        try {

            if (eng.music) {

                eng.music.pause();

                eng.music.src = '';

            }

        } catch (e) {}

        try {

            if (eng.voice) {

                eng.voice.pause();

                eng.voice.src = '';

            }

        } catch (e) {}

        eng.current = null;

        eng.emit();

    };

    eng.pause = function() {

        eng.paused = true;

        try {

            if (eng.music) eng.music.pause();

        } catch (e) {}

        try {

            if (eng.voice) eng.voice.pause();

        } catch (e) {}

        eng.emit();

    };

    eng.resume = function() {

        eng.paused = false;

        try {

            if (eng.music && eng.music.src) eng.music.play();

        } catch (e) {}

        try {

            if (eng.voice && eng.voice.src && eng.voice.paused) eng.voice.play();

        } catch (e) {}

        eng.emit();

    };

    eng.playPause = function(note) {

        if (!eng.running) {

            eng.running = true;

            eng.paused = false;

            eng.emit();

            if (!eng.current && !eng.queue.length) eng.request(note);

            else if (!eng.current) eng.next();

            else eng.resume();

            return;

        }

        if (eng.paused) eng.resume();

        else eng.pause();

    };

    eng.setMusicVol = function(v) {

        try {

            if (eng.music) eng.music.volume = _clamp(v, 0, 1);

        } catch (e) {}

    };

    eng.fadeMusicVol = function(v, ms) {

        try {

            v = _clamp(v, 0, 1);

            ms = Math.max(80, _num(ms, 450));

            if (eng.volFadeTimer) {

                TOP.clearInterval(eng.volFadeTimer);

                eng.volFadeTimer = null;

            }

            if (!eng.music) {

                eng._targetMusicVol = v;

                return;

            }

            var start = _clamp(eng.music.volume, 0, 1),

                t0 = Date.now();

            eng._targetMusicVol = v;

            if (Math.abs(start - v) < 0.01) {

                eng.setMusicVol(v);

                return;

            }

            eng.volFadeTimer = TOP.setInterval(function() {

                var p = Math.min(1, (Date.now() - t0) / ms);

                eng.setMusicVol(start + (v - start) * p);

                if (p >= 1) {

                    TOP.clearInterval(eng.volFadeTimer);

                    eng.volFadeTimer = null;

                    eng.setMusicVol(v);

                }

            }, 30);

        } catch (e) {

            eng.setMusicVol(v);

        }

    };

    eng.duck = function(on) {

        /* 2026-11-02 用户决定：人声/音乐改为两个独立滑块，不再自动压低音乐。
         * 音乐音量恒为 musicVolume，duck 调用保留签名但为空操作。 */

    };



    function _setLiveHost(name) {

        try {

            var box = main && main.querySelector('.loader-wrapper');

            if (!box) return;

            box.querySelectorAll('.loader-letter').forEach(function(x){ x.remove(); });

            String(name || '主持人').slice(0, 10).split('').forEach(function(ch){ box.appendChild(E('span','loader-letter',ch)); });

        } catch(e) {}

    }

    function _syncScriptLine(text, host) { try { var box=main&&main.querySelector('.vnr2-script-list'); if(!box)return; var rows=box.querySelectorAll('.vnr2-radio6-line'); var t=String(text||'').trim(); var hit=-1; for(var i=0;i<rows.length;i++){var rt=(rows[i].textContent||'').trim(); if(rt===t||rt.indexOf(t)>=0||t.indexOf(rt)>=0){hit=i;break;}} if(hit<0)hit=0; for(var j=0;j<rows.length;j++)rows[j].classList.toggle('current',j===hit); var nm=box.parentNode&&box.parentNode.parentNode&&box.parentNode.parentNode.querySelector('.loader-letter'); } catch(e){} }

    function _speakParsed(parsed, ch, after) {

        if (!parsed || !parsed.display) {

            if (after) after(false);

            return;

        }

        var segs = _splitCaption(parsed.display);

        var _nm = (ch && ch.name) || (parsed.tag && parsed.tag.name) || '';

        _setLiveHost(_nm || '主持人');

        var cap = _popup(_nm ? _nm + '：' + (segs[0] || parsed.display) : (segs[0] || parsed.display)); _syncScriptLine(segs[0] || parsed.display, _nm);

        var segTimer = null;



        function clearSeg() {

            if (segTimer) {

                TOP.clearInterval(segTimer);

                segTimer = null;

            }

        }



        function beginSeg(audio) {

            clearSeg();

            if (segs.length <= 1) return;

            var n = 1,

                total = 0;

            try {

                total = audio && isFinite(audio.duration) ? audio.duration : 0;

            } catch (e) {}

            var gap = total > 0 ? Math.max(1200, Math.floor(total * 1000 / segs.length)) : Math.max(1500, Math.min(3300, Math.floor((parsed.tts || parsed.display).length * 80 / segs.length)));

            segTimer = TOP.setInterval(function() {

                if (n >= segs.length) {

                    clearSeg();

                    return;

                }

                var _sg = segs[n++];

                cap.setText(_nm ? _nm + '：' + _sg : _sg); _setLiveHost(_nm || '主持人'); _syncScriptLine(_sg, _nm);

            }, gap);

        }

        if (!ch || !ch.ttsEnabled || cfg.radioTtsEnabled === false || cfg.radioTtsEnabled === 'false') {

            TOP.setTimeout(function() {

                cap.close();

                if (after) after(false);

            }, Math.max(1800, segs.length * 1700));

            return;

        }

        eng.duck(true);

        _tts(_jpNameSpeechText(parsed.tts, ch), ch, function(url) {

            try {

                if (eng.voice) eng.voice.pause();

                eng.voice = new TOP.Audio(url);

                eng.voice.volume = _clamp((cfg.voiceVolume === undefined ? 100 : cfg.voiceVolume) / 100, 0, 1);

                eng.voice.onloadedmetadata = function() {

                    beginSeg(eng.voice);

                };

                eng.voice.onplay = function() {

                    beginSeg(eng.voice);

                };

                eng.voice.onended = function() {

                    clearSeg();

                    eng.duck(false);

                    cap.close();

                    if (after) after(true, url);

                };

                eng.voice.onerror = function() {

                    clearSeg();

                    eng.duck(false);

                    cap.close();

                    if (after) after(false);

                };

                eng.voice.play();

            } catch (e) {

                clearSeg();

                eng.duck(false);

                cap.close();

                if (after) after(false);

            }

        }, function(e) {

            clearSeg();

            if (e !== '角色未开启TTS') _toast('TTS: ' + e);

            eng.duck(false);

            TOP.setTimeout(function() {

                cap.close();

                if (after) after(false);

            }, Math.max(1800, segs.length * 1700));

        }, parsed.tag && parsed.tag.lang);

    }



    function _chatVoiceEnsure() {

        if (!eng._chatVoiceQ) eng._chatVoiceQ = {

            q: [],

            active: 0,

            playing: false

        };

        return eng._chatVoiceQ;

    }



    function _chatVoiceRequestMore() {

        var q = _chatVoiceEnsure();

        var max = 1;

        for (var i = 0; i < q.q.length && q.active < max; i++) {

            (function(job) {

                if (!job || job.requested || job.ready || job.error || job.noTts) return;

                job.requested = true;

                q.active++;

                if (!job.ch || !job.ch.ttsEnabled || cfg.radioTtsEnabled === false || cfg.radioTtsEnabled === 'false') {

                    q.active--;

                    job.noTts = true;

                    job.ready = true;

                    _chatVoiceRequestMore();

                    _chatVoicePlayNext();

                    return;

                }

                _tts(job.parsed.tts || job.parsed.display, job.ch, function(url) {

                    q.active--;

                    job.url = url || '';

                    job.msg.audioUrl = job.url;

                    job.ready = true;

                    eng.saveStore();

                    eng.emit();

                    _chatVoiceRequestMore();

                    _chatVoicePlayNext();

                }, function(e) {

                    q.active--;

                    job.error = e || 'TTS失败';

                    job.ready = true;

                    if (e !== '角色未开启TTS') _toast('TTS: ' + e);

                    _chatVoiceRequestMore();

                    _chatVoicePlayNext();

                }, job.parsed.tag && job.parsed.tag.lang);

            })(q.q[i]);

        }

    }



    function _chatVoicePlayNext() {

        var q = _chatVoiceEnsure();

        if (q.playing) return;

        while (q.q.length && q.q[0].done) q.q.shift();

        if (!q.q.length) {

            eng.duck(false);

            return;

        }

        var job = q.q[0];

        if (!job.ready) return;

        q.playing = true;

        var parsed = job.parsed || {};

        var segs = _splitCaption(parsed.display || '');

        var nm = (job.ch && job.ch.name) || (parsed.tag && parsed.tag.name) || job.msg.host || '';

        var cap = _popup(nm ? nm + '：' + (segs[0] || parsed.display) : (segs[0] || parsed.display));

        var segTimer = null;



        function clearSeg() {

            if (segTimer) {

                TOP.clearInterval(segTimer);

                segTimer = null;

            }

        }



        function done(ok) {

            clearSeg();

            try {

                cap.close();

            } catch (e) {}

            job.done = true;

            q.playing = false;

            eng.duck(false);

            if (ok && job.url) {

                job.msg.audioUrl = job.url;

                eng.saveStore();

                eng.emit();

            }

            _chatVoiceRequestMore();

            _chatVoicePlayNext();

        }



        function beginSeg(audio) {

            clearSeg();

            if (segs.length <= 1) return;

            var n = 1,

                total = 0;

            try {

                total = audio && isFinite(audio.duration) ? audio.duration : 0;

            } catch (e) {}

            var gap = total > 0 ? Math.max(1200, Math.floor(total * 1000 / segs.length)) : Math.max(1500, Math.min(3300, Math.floor((parsed.tts || parsed.display || '').length * 80 / segs.length)));

            segTimer = TOP.setInterval(function() {

                if (n >= segs.length) {

                    clearSeg();

                    return;

                }

                var sg = segs[n++];

                cap.setText(nm ? nm + '：' + sg : sg);

            }, gap);

        }

        if (!job.url) {

            TOP.setTimeout(function() {

                done(false);

            }, Math.max(1800, segs.length * 1700));

            return;

        }

        try {

            eng.duck(true);

            var a = new TOP.Audio(job.url);

            eng.voice = a;

            eng._chatAudio = a;

            a.volume = _clamp((cfg.voiceVolume === undefined ? 100 : cfg.voiceVolume) / 100, 0, 1);

            try {

                a.muted = !!(eng.store && eng.store.muted);

            } catch (e) {}

            a.onloadedmetadata = function() {

                beginSeg(a);

            };

            a.onplay = function() {

                beginSeg(a);

            };

            a.onended = function() {

                done(true);

            };

            a.onerror = function() {

                done(false);

            };

            a.play();

        } catch (e) {

            done(false);

        }

    }



    function _enqueueChatVoices(jobs) {

        if (!jobs || !jobs.length) return;

        /* 朗读前语言自检修复（主播连线聊天）：入队前本地检测，不符则批量调修复模型改写（每条消息仅首次检测，避免反复等待；失败降级原样入队） */
        if (!(eng.cfg && eng.cfg.autoFixLang === false)) {

            var _hostsL = _selectedHosts(eng.store || {});

            var _fixArr = [], _fixIdx = [];

            for (var fi = 0; fi < jobs.length; fi++) {

                var mj = jobs[fi] && jobs[fi].msg;

                if (!mj || mj._langFixed) continue;

                mj._langFixed = true;

                _fixArr.push({ type: 'speech', host: mj.host || '', ttsText: mj.tts || '', displayText: mj.display || '' });

                _fixIdx.push(fi);

            }

            if (_fixArr.length && _scanLangNeed(_fixArr, _hostsL).length) {

                _fixLangNodes(_fixArr, _hostsL, { auto: true }, function(res) {

                    if (res && res.status === 'done' && res.fixed > 0) {

                        for (var fi2 = 0; fi2 < _fixArr.length; fi2++) {

                            var fn2 = _fixArr[fi2], mj2 = jobs[_fixIdx[fi2]] && jobs[_fixIdx[fi2]].msg;

                            if (mj2 && fn2) {

                                if (fn2.ttsText !== undefined) mj2.tts = fn2.ttsText;

                                if (fn2.displayText !== undefined) {

                                    mj2.display = fn2.displayText;

                                    mj2.content = fn2.displayText;

                                }

                            }

                        }

                    }

                    _doEnqueue(jobs);

                });

                return;

            }

        }

        _doEnqueue(jobs);

        function _doEnqueue(jobs2) {

            var q = _chatVoiceEnsure();

            for (var i = 0; i < jobs2.length; i++) q.q.push(jobs2[i]);

            _chatVoiceRequestMore();

            _chatVoicePlayNext();

        }

    }



    function _speakItem(item, force, after) {

        if (!item || item.spoken && !force) {

            if (after) after(false);

            return;

        }

        var hosts = _selectedHosts(eng.store || {});

        /* 朗读前语言自检修复（其他语音输出）：单曲/收藏/连续台本当前项等所有走 _speakItem 的朗读，
         * 朗读前本地检测语言，不符则调修复模型改写（每条仅首次检测，避免反复等待；失败降级继续朗读）。 */
        if ((eng.cfg && eng.cfg.autoFixLang !== false) && !item._langFixed && item.say) {

            item._langFixed = true;

            var _segs0 = _parseSaySegments(item.say);

            var _fixArr = [];

            _segs0.forEach(function(p) {

                _fixArr.push({ type: 'speech', host: (p.tag && p.tag.name) || item.host || '', ttsText: p.tts || '', displayText: p.display || '' });

            });

            if (_scanLangNeed(_fixArr, hosts).length) {

                _fixLangNodes(_fixArr, hosts, { auto: true }, function(res) {

                    if (res && res.status === 'done' && res.fixed > 0) {

                        var _newSay = _segs0.map(function(p, i2) {

                            var fn = _fixArr[i2], nm = (p.tag && p.tag.name) || item.host || '', lg = (p.tag && p.tag.lang) || '';

                            if (fn) {

                                if (fn.ttsText !== undefined) p.tts = fn.ttsText;

                                if (fn.displayText !== undefined) p.display = fn.displayText;

                            }

                            return p.tag ? '[VoiceTag:' + nm + ':' + lg + ':' + (p.tts || '') + ']“' + (p.display || '') + '”' : (p.display || '');

                        }).join('');

                        if (_newSay && _newSay !== item.say) item.say = _newSay;

                    }

                    _speakItem(item, force, after);

                });

                return;

            }

        }

        var parsedList = _parseSaySegments(item.say || '');

        parsedList = parsedList.filter(function(p){ return p && p.display; });

        if (!parsedList.length) { if (after) after(false); return; }

        item.spoken = true;

        try {

            var _sh = eng.store.chatHistory = eng.store.chatHistory || [];

            var _hasScript = _sh.some(function(x){ return x && x.kind === 'script' && x.scriptId === item.id; });

            if (!_hasScript) {

                parsedList.forEach(function(p, idx){

                    var hostName = (p.tag && p.tag.name) || item.host || '';

                    var hostCh = _charByName(hostName, hosts);

                    var hostCid = (hosts || []).indexOf(hostCh) >= 0 ? _charId(hostCh) : '';

                    _sh.push({ id:_uuid(), scriptId:item.id, segmentIndex:idx, segmentsTotal:parsedList.length, role:'assistant', kind:'script', host:hostName, _cid:hostCid, song:(item.song && (item.song.title || item.song.query)) || '', content:p.display, display:p.display, tts:p.tts, t:Date.now() });

                });

                if (_sh.length > 400) _sh.splice(0, _sh.length - 400);

                eng.saveStore(); eng.emit(); try { renderChat(); } catch(e) {}

            }

        } catch (e) {}

        function playAt(idx, lastOk) {

            if (idx >= parsedList.length) { if (after) after(!!lastOk); return; }

            var p = parsedList[idx], hostName = (p.tag && p.tag.name) || item.host || '';

            var ch = _charByName(hostName, hosts);

            _speakParsed(p, ch, function(ok, url){ playAt(idx + 1, ok || lastOk); });

        }

        playAt(0, false);

    }

    eng.request = function(note, done, label, type) {

        if (eng.busy) return;

        note = note || eng.store.userNote || '';

        var reqLabel = label || '请求曲目+台本';

        var reqType = type || 'request';

        eng.busy = true;

        _setApiStatus('loading', reqType, reqLabel, '', note);

        var tpl = cfg.promptTemplate || '';

        var prompt = _buildCommon(tpl, {

            userInput: note

        });

        var msgs = [{

            role: 'system',

            content: prompt

        }, {

            role: 'user',

            content: '请按 JSON 格式给出下一批电台内容。'

        }];

        _chat(msgs, function(t) {

            eng.busy = false;

            var items = _itemsFromReturn(t);

            if (!items || !items.length) {

                var ferr = _formatReturnError(t);

                _setApiStatus('error', reqType, reqLabel, ferr, note);

                _toast(reqLabel + '失败: ' + ferr);

                if (done) done(false);

                return;

            }

            var fr = _filterRecentItems(items);

            items = fr.items;

            if (fr.dropped && fr.dropped.length) _toast('已过滤最近播放重复曲目: ' + fr.dropped.slice(0, 4).join('、'));

            if (!items.length) {

                var ferr2 = 'AI 返回的曲目都在最近 ' + _recentLimit() + ' 首播放记录内，已拦截重复推荐。请重试或调低去重数量。';

                _setApiStatus('error', reqType, reqLabel, ferr2, note);

                _toast(reqLabel + '失败: ' + ferr2);

                if (done) done(false);

                return;

            }

            for (var i = 0; i < items.length; i++) {

                var it = items[i] || {};

                it.id = _uuid();

                it.sourceType = 'ai';

                it.needsScript = false;

                it.scriptFresh = true;

                it.spoken = false;

                eng.queue.push(it);

            }

            eng.saveQueue();

            _clearApiStatus(reqType);

            eng.emit();

            if (done) done(true);

            if (eng.running && !eng.paused && !eng.current) eng.next();

        }, function(e) {

            eng.busy = false;

            _setApiStatus('error', reqType, reqLabel, e, note);

            _toast(reqLabel + '失败: ' + e);

            if (done) done(false);

        });

    };

    eng.resetRequest = function(note) {

        eng.queue = [];

        eng.saveQueue();

        eng.current = null;

        eng.request(note || eng.store.userNote || '', null, '重置队列并请求', 'resetRequest');

    };

    eng.distillTaste = function(input) {

        input = (input || '').trim();

        if (!input && !_favList(eng.store || {}).length && !((eng.log || []).length)) {

            _toast('先输入一点偏好，或收藏几首歌');

            return;

        }

        eng.busy = true;

        _setApiStatus('loading', 'taste', '音乐偏好蒸馏', '', input);

        var tpl = cfg.tasteDistillPrompt || '';

        var prompt = _buildCommon(tpl, {

            userInput: input

        });

        var msgs = [{

            role: 'system',

            content: prompt

        }, {

            role: 'user',

            content: '请蒸馏并输出可直接注入电台提示词的音乐偏好。'

        }];

        _chat(msgs, function(t) {

            eng.busy = false;

            eng.store.musicTasteProfile = String(t || '').trim();

            eng.saveStore();

            _clearApiStatus('taste');

            _toast('音乐偏好已更新');

            eng.emit();

        }, function(e) {

            eng.busy = false;

            _setApiStatus('error', 'taste', '音乐偏好蒸馏', e, input);

            _toast('音乐偏好蒸馏失败: ' + e);

        });

    };

    eng.toggleFav = function(song, say) {

        song = song || {};

        var key = _songKey(song);

        if (!key) {

            _toast('这首歌信息不足，无法收藏');

            return;

        }

        var fs = _favList(eng.store || {});

        for (var i = 0; i < fs.length; i++) {

            if (_songKey(fs[i]) === key) {

                fs.splice(i, 1);

                eng.saveStore();

                eng.emit();

                return;

            }

        }

        var fav = {

            title: song.title || '',

            artist: song.artist || '',

            query: song.query || '',

            url: song.url || '',

            tags: song.tags || '收藏',

            scriptVersions: []

        };

        if (say) fav.scriptVersions.push({

            id: _uuid(),

            t: Date.now(),

            say: say,

            label: '收藏时台词'

        });

        fs.unshift(fav);

        eng.store.favoriteSongs = fs.slice(0, 160);

        eng.saveStore();

        eng.emit();

    };

    eng.addFav = function(song, say) {

        song = song || {};

        var key = _songKey(song);

        if (!key) return;

        var fav = _favByKey(key);

        if (fav) {

            if (say) _saveScriptToFav(key, say, '手动保存');

            _toast('已在收藏');

            return;

        }

        var fs = _favList(eng.store || {});

        fs.unshift({

            title: song.title || '',

            artist: song.artist || '',

            query: song.query || '',

            url: song.url || '',

            tags: song.tags || '收藏',

            scriptVersions: say ? [{

                id: _uuid(),

                t: Date.now(),

                say: say,

                label: '手动保存'

            }] : []

        });

        eng.store.favoriteSongs = fs.slice(0, 160);

        eng.saveStore();

        eng.emit();

    };

    eng.removeFav = function(song) {

        var key = _songKey(song),

            fs = _favList(eng.store || {});

        for (var i = 0; i < fs.length; i++) {

            if (_songKey(fs[i]) === key) {

                fs.splice(i, 1);

                break;

            }

        }

        eng.saveStore();

        eng.emit();

    };

    eng.removeScriptVersion = function(song, vid) {

        var fav = _favByKey(_songKey(song));

        if (!fav || !fav.scriptVersions) return;

        for (var i = 0; i < fav.scriptVersions.length; i++) {

            if (fav.scriptVersions[i].id === vid) {

                fav.scriptVersions.splice(i, 1);

                break;

            }

        }

        eng.saveStore();

        eng.emit();

    };

    eng.queueSong = function(song, playNow) {

        var item = _itemFromSong(song, _isFav(song) ? 'favorite' : 'manual');

        if (playNow) {

            eng.queue.unshift(item);

            eng.saveQueue();

            eng.running = true;

            eng.paused = false;

            eng.next();

        } else {

            eng.queue.push(item);

            eng.saveQueue();

            eng.emit();

        }

    }

    eng.queueHistoryItem = function(entry, withScript, playNow) { var base=(entry&&entry.item)||entry||{}; var song=base.song||base; var it=_itemFromSong(song,'history'); if(withScript && base.say){it.say=base.say;it.host=base.host||'';it.needsScript=false;it.scriptFresh=true;} if(playNow){eng.queue.unshift(it);eng.saveQueue();eng.running=true;eng.paused=false;eng.next();}else{eng.queue.push(it);eng.saveQueue();eng.emit();} };

    eng.queueSearchSong=function(song,playNow){var it=_itemFromSong(song,'search');it.sourceType='search';it.favKey='';it.say='';it.host='';it.needsScript=true;it.scriptFresh=false;if(playNow){eng.queue.unshift(it);eng.saveQueue();eng.running=true;eng.paused=false;eng.next();}else{eng.queue.push(it);eng.saveQueue();eng.emit();}};

    eng.removeItem = function(it) {

        if (!it) return;

        if (eng.current && it.id === eng.current.id) {

            eng.next();

            return;

        }

        for (var i = 0; i < eng.queue.length; i++) {

            if (eng.queue[i].id === it.id) {

                eng.queue.splice(i, 1);

                break;

            }

        }

        eng.saveQueue();

        eng.emit();

    };

    eng.searchSongs = function(q) {

        q = (q || '').trim();

        eng.searchBusy = true;

        _setApiStatus('loading', 'search', '点歌搜索', '', q);

        _searchSongs(q, function(list) {

            eng.searchBusy = false;

            eng.searchResults = list;

            _clearApiStatus('search');

            eng.emit();

        }, function(e) {

            eng.searchBusy = false;

            _setApiStatus('error', 'search', '点歌搜索', e, q);

            _toast('点歌搜索失败: ' + e);

        });

    };

    eng.requestScripts = function(manual) {

        if (eng.scriptBusy) return;

        var all = (eng.current ? [eng.current] : []).concat(eng.queue);

        var targets = [];

        for (var i = 0; i < all.length; i++) {

            var it = all[i];

            if (it && (it.sourceType === 'favorite' || it.sourceType === 'manual' || it.sourceType === 'history' || it.sourceType === 'search') && (it.needsScript || (it.say && it.scriptFresh === false)) && !it.scriptPending) {

                it.scriptPending = true;

                targets.push(it);

            }

        }

        if (!targets.length) {

            if (manual) _toast('没有需要更新台本的曲目');

            return;

        }

        eng.scriptBusy = true;

        _setApiStatus('loading', 'scripts', '更新台本', '', manual ? 'manual' : 'auto');

        var lines = targets.map(function(it, i) {

            it.scriptKey = 's' + (i + 1) + '_' + it.id;

            var s = it.song || {};

            return it.scriptKey + '. ' + (s.title || s.query || '未定歌曲') + (s.artist ? ' - ' + s.artist : '') + ' | 来源:' + (it.sourceType || '');

        }).join('\\n');

        var prompt = _buildCommon(cfg.scriptRewritePrompt || '', {

            songList: lines

        });

        var msgs = [{

            role: 'system',

            content: prompt

        }, {

            role: 'user',

            content: '请只为给定曲目补写台词，按 JSON 返回。'

        }];

        _chat(msgs, function(t) {

            eng.scriptBusy = false;

            var arr = _scriptsFromReturn(t);

            if (!arr || !arr.length) {

                for (var z = 0; z < targets.length; z++) targets[z].scriptPending = false;

                var ferr = _formatReturnError(t);

                _setApiStatus('error', 'scripts', '更新台本', ferr, manual ? 'manual' : 'auto');

                _toast('更新台本失败: ' + ferr);

                return;

            }

            for (var a = 0; a < arr.length; a++) {

                var sc = arr[a] || {};

                for (var b = 0; b < targets.length; b++) {

                    var it = targets[b];

                    if (sc.key === it.scriptKey || String(sc.key || '').indexOf(it.scriptKey) >= 0) {

                        it.say = sc.say || it.say || '';

                        it.host = sc.host || it.host || '';

                        it.needsScript = false;

                        it.scriptPending = false;

                        it.scriptFresh = true;

                        if (it.favKey) _saveScriptToFav(it.favKey, it.say, '更新台本');

                        if (eng.current && eng.current.id === it.id && !it.spoken) _speakItem(it, true);

                    }

                }

            }

            for (var c = 0; c < targets.length; c++) {

                targets[c].scriptPending = false;

            }

            eng.saveStore();

            _clearApiStatus('scripts');

            eng.emit();

        }, function(e) {

            eng.scriptBusy = false;

            for (var z2 = 0; z2 < targets.length; z2++) targets[z2].scriptPending = false;

            _setApiStatus('error', 'scripts', '更新台本', e, manual ? 'manual' : 'auto');

            _toast('更新台本失败，先继续播放音乐: ' + e);

        });

    };



    function _maybeScript(item) { /* 台本只由用户手动批量更新，不在播放时隐式请求 */ }

    eng.next = function() {

        if (!eng.running) return;

        if (eng.timer) {

            TOP.clearTimeout(eng.timer);

            eng.timer = null;

        }

        try {

            if (eng.voice) {

                eng.voice.onended = null;

                eng.voice.onerror = null;

                eng.voice.pause();

                eng.voice.src = '';

            }

        } catch (e) {}

        try {

            if (eng.music) {

                eng.music.onended = null;

                eng.music.onerror = null;

                eng.music.ontimeupdate = null;

                eng.music.oncanplay = null;

                eng.music.onloadedmetadata = null;

                eng.music.pause();

                eng.music.src = '';

            }

        } catch (e) {}

        var item = eng.queue.shift();

        eng.saveQueue();

        if (!item) {

            eng.current = null;

            eng.emit();

            if (cfg.autoRequest !== false) {

                eng.request('', function(ok) {

                    if (!ok && !eng.queue.length) eng.loopFromHistory();

                });

                return;

            }

            if (eng.loopFromHistory()) return;

            return;

        }

        eng.current = item;

        eng.paused = false;

        eng.log.unshift({

            t: Date.now(),

            item: _cloneItem(item)

        });

        eng.log = eng.log.slice(0, 120);

        eng.emit();

        var startedMusic = false,

            recorded = false;



        function isCurrent() {

            return eng.current && eng.current.id === item.id;

        }



        function nextCurrent() {

            if (isCurrent()) eng.next();

        }



        function markPlayed(song) {

            if (recorded) return;

            recorded = true;

            _recordRecentSong(song || item.song || {});

            _recordHistoryItem(item);

        }



        function schedule() {

            var lead = _num(cfg.leadSeconds, 10);

            try {

                if (eng.music) {

                    eng.music.ontimeupdate = function() {

                        try {

                            if (!isCurrent()) return;

                            if (eng.music.duration && eng.music.duration - eng.music.currentTime <= lead) {

                                eng.music.ontimeupdate = null;

                                nextCurrent();

                            }

                        } catch (e) {}

                    };

                    eng.music.onended = function() {

                        nextCurrent();

                    };

                }

            } catch (e) {}

        }



        function requestMoreIfNeeded() {

            if (eng.queue.length < 1 && !eng.busy && cfg.autoRequest !== false) eng.request();

        }



        function startMusic(song) {

            if (startedMusic || !isCurrent()) return;

            startedMusic = true;

            try {

                if (eng.music) {

                    eng.music.pause();

                    eng.music.src = '';

                }

            } catch (e) {}

            try {

                eng.music = new TOP.Audio(song.url);

                eng.music.preload = 'auto';

                eng.music.volume = (eng._targetMusicVol !== undefined) ? _clamp(eng._targetMusicVol, 0, 1) : _clamp((cfg.musicVolume === undefined ? 100 : cfg.musicVolume) / 100, 0, 1);

                function retryMusicSource() {

                    if (!isCurrent()) return;

                    item._musicRetry = (item._musicRetry || 0) + 1;

                    if (item._musicRetry > 4) { _toast('音源全部失败，已切到下一首'); nextCurrent(); return; }

                    song._badSources = song._badSources || [];

                    if (song.source && song._badSources.indexOf(song.source) < 0) song._badSources.push(song.source);

                    song.url = '';

                    song.source = '';

                    startedMusic = false;

                    _resolveSong(song, function(nextSong) { if (isCurrent()) { item.song = nextSong; startMusic(nextSong); } }, function() { if (isCurrent()) nextCurrent(); });

                }

                eng.music.onerror = function() { retryMusicSource(); };

                eng.music.onended = function() {

                    nextCurrent();

                };

                markPlayed(song);

                var p = eng.music.play();

                if (p && p.catch) p.catch(function(e) {

                    if (!isCurrent()) return;

                    _toast('\u64AD\u653E\u5931\u8D25\uFF0C\u5DF2\u5207\u5230\u4E0B\u4E00\u9996');

                    nextCurrent();

                });

                schedule();

                eng.emit();

            } catch (e) {

                if (!isCurrent()) return;

                _toast('\u64AD\u653E\u521D\u59CB\u5316\u5931\u8D25\uFF0C\u5DF2\u5207\u5230\u4E0B\u4E00\u9996');

                nextCurrent();

            }

        }



        function speakThenPlay(song) {

            if (!isCurrent()) return;

            _maybeScript(item);

            // 音乐与台本并行：先启动歌曲，TTS 只负责叠加播报，不再阻塞音乐播放。

            startMusic(song);

            if (!item.needsScript && item.say) _speakItem(item, false);

            else eng.duck(false);

            eng.emit();

            requestMoreIfNeeded();

        }

        _resolveSong(item.song || {}, function(song) {

            if (!isCurrent()) return;

            item.song = song;

            speakThenPlay(song);

        }, function(e) {

            if (!isCurrent()) return;

            _toast('\u672A\u627E\u5230\u97F3\u6E90\uFF0C\u5DF2\u5207\u5230\u4E0B\u4E00\u9996: ' + (e || '\u6CA1\u6709\u53EF\u7528\u97F3\u6E90'));

            nextCurrent();

        });

    };



    function _chatFullText(n) {

        var h = (eng.store && eng.store.chatHistory) || [];

        n = _num(n, cfg.chatRecentMessages === undefined ? 10 : cfg.chatRecentMessages);

        return h.slice(-n).map(function(m) {

            return (m.role === 'user' ? '用户' : '主播') + ': ' + (m.display || m.content || '');

        }).join('\n') || '（暂无）';

    }



    function _maybeSummarizeChat() {

        var n = _num(cfg.chatRecentMessages, 10),

            x = _num(cfg.chatSummaryBatch, 40);

        var h = eng.store.chatHistory || [];

        if (h.length <= n + x) return;

        var old = h.slice(0, h.length - n);

        var keep = h.slice(-n);

        var text = old.map(function(m) {

            return (m.role === 'user' ? '用户' : '主播') + ': ' + (m.display || m.content || '');

        }).join('\n');

        var tpl = cfg.radioChatSummaryPrompt || '';

        var prompt = tpl.replace(/\{\{旧总结\}\}/g, eng.store.chatSummary || '').replace(/\{\{对话内容\}\}/g, text);

        _chat([{

            role: 'system',

            content: prompt

        }, {

            role: 'user',

            content: '请更新主播对话记忆摘要。'

        }], function(t) {

            eng.store.chatSummary = String(t || '').trim();

            eng.store.chatHistory = keep;

            eng.saveStore();

            eng.emit();

        }, function() {

            eng.store.chatHistory = keep;

            eng.saveStore();

            eng.emit();

        });

    }

    eng.sendChat = function(text, retry) {

        text = (text || '').trim();

        if (!text || eng.chatBusy) return;

        eng.chatBusy = true;

        eng.store.chatHistory = eng.store.chatHistory || [];

        if (!retry) {

            eng.store.chatHistory.push({

                role: 'user',

                content: text,

                display: text,

                t: Date.now()

            });

            eng.saveStore();

        }

        eng.refreshChatUi();

        _setApiStatus('loading', 'chat', '主播连线', '', text);

        var prompt = _buildCommon(cfg.radioChatPrompt || '', {

            userInput: text

        });

        var msgs = [{

            role: 'system',

            content: prompt

        }, {

            role: 'user',

            content: '请回复这次电台连线聊天。'

        }];

        _chat(msgs, function(t) {

            eng.chatBusy = false;

            var o = _jsonFromText(t);

            var replies = [];

            if (o && Object.prototype.toString.call(o.replies) === '[object Array]') replies = o.replies;

            else replies = [{

                host: (o && o.host) || '',

                say: (o && o.say) || String(t || '').trim()

            }];

            var hosts = _selectedHosts(eng.store || {});

            var voiceJobs = [];

            for (var ri = 0; ri < replies.length; ri++) {

                var r = replies[ri] || {};

                var say = r.say || '';

                if (!say) continue;

                var host = r.host || '';

                var segs = _parseSaySegments(say);

                for (var si = 0; si < segs.length; si++) {

                    var p = segs[si] || {};

                    var segHost = (p.tag && p.tag.name) || host || '';

                    var segCh = _charByName(segHost, hosts);

                    var segCid = (hosts || []).indexOf(segCh) >= 0 ? _charId(segCh) : '';

                    var msg = {

                        id: _uuid(), groupId: r.id || '', segmentIndex: si, segmentsTotal: segs.length,

                        role: 'assistant', host: segHost, _cid: segCid, content: p.display || say, display: p.display || say,

                        tts: p.tts || p.display || say, t: Date.now()

                    };

                    eng.store.chatHistory.push(msg);

                    voiceJobs.push({ msg: msg, parsed: p, ch: segCh });

                }

            }

            eng.saveStore();

            _enqueueChatVoices(voiceJobs);

            _clearApiStatus('chat');

            eng.emit();

            eng.refreshChatUi();

            _maybeSummarizeChat();

        }, function(e) {

            eng.chatBusy = false;

            _setApiStatus('error', 'chat', '主播连线', e, text);

            _toast('主播连线失败: ' + e);

            eng.refreshChatUi();

        });

    };

    eng.rerollChat = function() {

        var h = eng.store.chatHistory || [];

        for (var i = h.length - 1; i >= 0; i--) {

            if (h[i].role === 'assistant') {

                h.splice(i, 1);

                break;

            }

        }

        var last = '';

        for (var j = h.length - 1; j >= 0; j--) {

            if (h[j].role === 'user') {

                last = h[j].content;

                break;

            }

        }

        eng.saveStore();

        eng.emit();

        if (last) eng.sendChat(last);

    };

    eng.replayChat = function(msg, regen) {

        if (!msg) return;

        var p = _parseSay(msg.content || msg.say || '');

        var ch = _charByName((p.tag && p.tag.name) || msg.host, _selectedHosts(eng.store || {}));

        if (!regen && msg.audioUrl) {

            try {

                eng.duck(true);

                var a = new TOP.Audio(msg.audioUrl);

                a.volume = _clamp((cfg.voiceVolume === undefined ? 100 : cfg.voiceVolume) / 100, 0, 1);

                a.onended = function() {

                    eng.duck(false);

                };

                a.onerror = function() {

                    eng.duck(false);

                };

                a.play();

                return;

            } catch (e) {}

        }

        _speakParsed(p, ch, function(ok, url) {

            if (url) {

                msg.audioUrl = url;

                eng.saveStore();

                eng.emit();

            }

        });

    };

    eng.editChat = function(msg, text) {

        if (!msg) return;

        msg.content = text;

        var p = _parseSay(text);

        msg.display = p.display;

        msg.tts = p.tts;

        msg.audioUrl = '';

        eng.saveStore();

        eng.emit();

    };

    var root = ctx.div('pp-radio-root', '');

    root.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box;color:rgba(255,255,255,.72);font-size:13px;line-height:1.6;text-align:center;';

    root.textContent = '电台已在外部悬浮运行。';



    function E(tag, cls, text) {

        var e = TOPDOC.createElement(tag);

        if (cls) e.className = cls;

        if (text !== undefined) e.textContent = text;

        return e;

    }



    function icon(name) {

        var m = {

            play: '<path d="M9 7.5v9l7-4.5-7-4.5Z" fill="currentColor"/>',

            pause: '<path d="M8 6.8h2.8v10.4H8zM13.2 6.8H16v10.4h-2.8z" fill="currentColor"/>',

            next: '<path d="M7.5 7.2v9.6l6.2-4.8-6.2-4.8Z" fill="currentColor"/><path d="M15.2 7.4v9.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',

            spark: '<path d="M12 3.8l1.05 4.15L17.2 9l-4.15 1.05L12 14.2l-1.05-4.15L6.8 9l4.15-1.05L12 3.8Z" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round" fill="none"/><path d="M18.2 13.5l.45 1.65 1.65.45-1.65.45-.45 1.65-.45-1.65-1.65-.45 1.65-.45.45-1.65ZM5.4 14.4l.55 1.95 1.95.55-1.95.55-.55 1.95-.55-1.95-1.95-.55 1.95-.55.55-1.95Z" fill="currentColor"/>',

            heart: '<path d="M12 18.8s-6.7-3.9-6.7-8.2A3.55 3.55 0 0 1 12 8.9a3.55 3.55 0 0 1 6.7 1.7c0 4.3-6.7 8.2-6.7 8.2Z" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round" fill="none"/>',

            heartFill: '<path d="M12 19s-6.9-4-6.9-8.35A3.7 3.7 0 0 1 12 8.75a3.7 3.7 0 0 1 6.9 1.9C18.9 15 12 19 12 19Z" fill="currentColor"/>',

            list: '<path d="M7.2 8h9.6M7.2 12h9.6M7.2 16h6.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',

            expand: '<path d="M8.2 5.8H5.8v2.4M15.8 5.8h2.4v2.4M18.2 15.8v2.4h-2.4M5.8 15.8v2.4h2.4" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>',

            pin: '<path d="M9.5 4.8h5l-.65 5.2 2.25 2.25v1.25H7.9v-1.25L10.15 10 9.5 4.8Z" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round" fill="none"/><path d="M12 13.5v5" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/>',

            pinFill: '<path d="M9.35 4.8h5.3L14 10l2.25 2.25v1.3H7.75v-1.3L10 10l-.65-5.2Z" fill="currentColor"/><path d="M12 13.5v5" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/>',

            close: '<path d="M7.2 7.2l9.6 9.6M16.8 7.2l-9.6 9.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',

            collapse: '<path d="M7 12h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',

            search: '<path d="M10.8 16.1a5.3 5.3 0 1 1 0-10.6 5.3 5.3 0 0 1 0 10.6ZM14.7 14.7l3.3 3.3" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" fill="none"/>',

            send: '<path d="M5.2 12.4 18.8 5.5l-3.3 13.2-3.2-5.1-7.1-1.2Z" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round" fill="none"/><path d="m12.2 13.5 3.1-3.4" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>',

            refresh: '<path d="M17.2 8.6A5.8 5.8 0 0 0 7 7.4L5.8 9.2M6.8 15.4A5.8 5.8 0 0 0 17 16.6l1.2-1.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5.8 5.8v3.4h3.4M18.2 18.2v-3.4h-3.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',

            plus: '<path d="M12 6.5v11M6.5 12h11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',

            trash: '<path d="M8.2 8.7h7.6M10 8.7l.45 9h3.1l.45-9M10.6 6.3h2.8" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"/>',

            speaker: '<path d="M5.6 10.2h3.1l3.4-2.9v9.4l-3.4-2.9H5.6v-3.6Z" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round" fill="none"/><path d="M15.2 9.3a4.3 4.3 0 0 1 0 5.4" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>',

            wave: '<path d="M4.5 13.5c2.2 0 2.2-3 4.4-3s2.2 3 4.4 3 2.2-3 4.4-3" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" fill="none"/>'

        };

        return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (m[name] || m.wave) + '</svg>';

    }



    function svgBtn(cls, name, title, fn, on) {

        var b = E('button', cls + (on ? ' on' : ''));

        b.type = 'button';

        b.title = title || '';

        b.setAttribute('aria-label', title || name);

        b.innerHTML = icon(name);

        b.onclick = function(ev) {

            ev.preventDefault();

            ev.stopPropagation();

            fn && fn(ev);

        };

        return b;

    }



    function smallBtn(name, title, fn, on) {

        return svgBtn('vnrfx-btn', name, title, fn, on);

    }



    function panel(title, sub) {

        var p = E('section', 'vnrfx-panel');

        var h = E('div', 'vnrfx-panel-head');

        h.appendChild(E('div', 'vnrfx-panel-title', title));

        if (sub) h.appendChild(E('div', 'vnrfx-panel-sub', sub));

        p.appendChild(h);

        return p;

    }



    function fmtTime(v) {

        v = Math.max(0, Math.floor(_num(v, 0)));

        var m = Math.floor(v / 60),

            s = v % 60;

        return m + ':' + (s < 10 ? '0' : '') + s;

    }



    function curSong() {

        return eng.current && eng.current.song ? eng.current.song : null;

    }



    function songTitle(s) {

        return (s && (s.title || s.query)) || '未定歌曲';

    }



    function songArtist(s) {

        return (s && s.artist) || '私人电台';

    }



    function statusText() {

        var api = eng.apiStatus || {},

            st = [];

        if (api.state === 'loading') st.push('请求中');

        else if (api.state === 'error') st.push('请求失败');

        if (eng.busy) st.push('选曲');

        if (eng.scriptBusy) st.push('补台本');

        if (eng.chatBusy) st.push('连线中');

        if (eng.running && !eng.paused) st.push('播放中');

        if (eng.paused) st.push('已暂停');

        if (!st.length) st.push('待机');

        return st.join(' / ');

    }



    function hostsText() {

        return _selectedHosts(eng.store || {}).map(function(c) {

            return c.name || '未命名';

        }).join('、') || '未选择主持人';

    }



    function shellHost() {

        try {

            return TOPDOC.fullscreenElement || TOPDOC.webkitFullscreenElement || TOPDOC.querySelector('#pp-reader,#pp-stage,#pp-overlay,#pp-viewer,.pp-reader,.pp-stage,.pp-overlay,.pp-viewer,.pp-fullscreen') || TOPDOC.body;

        } catch (e) {

            return TOPDOC.body;

        }

    }



    function ensureShellHost(shell) {

        var h = shellHost();

        try {

            if (shell.parentNode !== h) h.appendChild(shell);

        } catch (e) {

            try {

                TOPDOC.body.appendChild(shell);

            } catch (_) {}

        }

    }



    function _cleanupOrbLyrics(keep) {

        try {

            var nodes = TOPDOC.querySelectorAll('.vnr2-orb-lyr');

            for (var i = 0; i < nodes.length; i++) {

                if (!keep || nodes[i] !== keep) nodes[i].remove();

            }

        } catch (e) {}

    }



    var BAR_W = 544,

        BAR_H = 61,

        ORB = 50,

        SNAP_GAP = 24;

    var FIELDS = [{"group":"电台","key":"batchSize","type":"number","label":"每次 API 请求准备曲数","default":10,"min":1,"max":12},{"group":"电台","key":"leadSeconds","type":"number","label":"歌曲剩余多少秒时准备/切到下一首","default":0,"min":0,"max":60},{"group":"电台","key":"backgroundPlayback","type":"toggle","label":"关闭功能系统后继续后台播放","default":true},{"group":"电台","key":"autoRequest","type":"toggle","label":"队列为空时自动请求下一批","default":true},{"group":"电台","key":"loopPlaylist","type":"toggle","label":"没有新曲时循环最近播放","default":false},{"group":"电台","key":"recentDedupeCount","type":"number","label":"请求时避免最近 N 首同名重复","default":30,"min":0,"max":200,"step":1},{"group":"电台","key":"playHistoryLimit","type":"number","label":"播放历史保存数量","default":30,"min":1,"max":200,"step":1},{"group":"电台","key":"scriptHistoryMax","type":"number","label":"收藏曲目台词历史版本上限","default":3,"min":1,"max":20,"step":1},{"group":"电台","key":"updateScripts","type":"toggle","label":"播放前自动更新台本（建议关闭，使用底部批量更新）","default":false},{"group":"电台","key":"musicVolume","type":"number","label":"音乐正常音量（0-100）","default":100,"min":0,"max":100},{"group":"电台","key":"voiceVolume","type":"number","label":"主持人语音音量（0-100）","default":100,"min":0,"max":100},{"group":"电台","key":"autoFixLang","type":"toggle","label":"朗读前自动检测修复台词语言","default":true},{"group":"电台","key":"fixModel","type":"text","label":"语言修复专用模型（留空=跟随全局）","default":"Pro/deepseek-ai/DeepSeek-V3.2","placeholder":"Pro/deepseek-ai/DeepSeek-V3.2"},{"group":"电台","key":"captionOnFloat","type":"toggle","label":"字幕显示在电台悬浮球/播放条旁","default":true},{"group":"电台","key":"captionTopRight","type":"toggle","label":"字幕显示在屏幕右上角","default":false},{"group":"电台","key":"popupFontSize","type":"number","label":"字幕弹窗字体大小","default":13,"min":10,"max":22,"step":1},{"group":"电台","key":"voiceLanguage","type":"select","label":"VoiceTag 朗读语言","default":"中文","options":[{"v":"中文","l":"中文"},{"v":"英语","l":"英语"},{"v":"日语","l":"日语"},{"v":"韩语","l":"韩语"},{"v":"法语","l":"法语"},{"v":"德语","l":"德语"},{"v":"西班牙语","l":"西班牙语"}]},{"group":"电台","key":"displayLanguage","type":"select","label":"字幕显示语言","default":"中文","options":[{"v":"中文","l":"中文"},{"v":"英语","l":"英语"},{"v":"日语","l":"日语"},{"v":"韩语","l":"韩语"},{"v":"法语","l":"法语"},{"v":"德语","l":"德语"},{"v":"西班牙语","l":"西班牙语"}]},{"group":"电台","key":"chatBilingual","type":"toggle","label":"主播对话双语显示","default":false},{"group":"电台","key":"chatRecentMessages","type":"number","label":"主播对话完整记忆条数","default":10,"min":0,"max":100,"step":1},{"group":"电台","key":"chatSummaryBatch","type":"number","label":"主播对话每多少条旧消息总结一次","default":40,"min":5,"max":200,"step":1},{"group":"电台","key":"recommendChatMessages","type":"number","label":"推荐歌曲时带入最近对话条数","default":6,"min":0,"max":60,"step":1},{"group":"上下文","key":"contextSource","type":"multiselect","label":"剧情上下文来源（可多选）","default":["st","horae"],"options":[{"v":"st","l":"酒馆历史（同步 Visual Novel 标签过滤）"},{"v":"horae","l":"Horae 总结"},{"v":"baibai","l":"柏宝书总结（正常记忆注入口径）"}]},{"group":"上下文","key":"stHistN","type":"number","label":"酒馆聊天历史条数（0=不注入）","default":1,"min":0,"max":80},{"group":"上下文","key":"radioWbIds","type":"textarea","label":"电台绑定世界书 <button type=\"button\" onclick=\"typeof window._vnmRadioToggleWbSettings==='function'&&window._vnmRadioToggleWbSettings(this)\" style=\"margin-left:8px;padding:2px 9px;border-radius:10px;background:rgba(255,255,255,.08);border:.5px solid rgba(255,255,255,.14);color:rgba(255,255,255,.68);font-size:11px;cursor:pointer;font-family:inherit;line-height:1.7;\">选择世界书</button>","rows":2,"default":"","placeholder":"点击上方按钮勾选世界书；也可手动输入世界书ID或名称，每行一个"},{"group":"提示词","key":"promptTemplate","type":"textarea-presets","label":"电台编排提示词","rows":13,"variables":["{{主持人列表}}","{{用户名称}}","{{用户设定}}","{{角色设定}}","{{世界书}}","{{电台世界书}}","{{剧情上下文}}","{{酒馆历史}}","{{Horae总结}}","{{音乐偏好}}","{{收藏曲目}}","{{最近播放曲目}}","{{近期已播放曲目禁止重复}}","{{最近主播对话}}","{{用户输入}}","{{请求曲数}}","{{朗读语言}}","{{显示语言}}"],"default":"你是专业的电台台本写作者，接下来你要为用户选择的角色进行台本的创作。台本的内容不是正式广播节目，而是角色本人陪 {{用户名称}} 一起听歌、聊天、换歌前后自然聊天。\n\n【主持人】\n{{主持人列表}}\n\n如果有多个主持人，就把他们视为正在同一个私人电台空间里陪用户听歌。他们可以轮流说话、互相接话，也可以回应用户；不要受主线剧情中是否在场的限制。\n\n【用户】\n{{用户名称}}\n{{用户设定}}\n\n【角色与世界背景】\n{{角色设定}}\n{{世界书}}\n\n【电台专用世界书】\n{{电台世界书}}\n\n【当前剧情上下文】\n{{剧情上下文}}\n\n【用户音乐偏好】\n{{音乐偏好}}\n\n【近期已播放曲目禁止重复】\n{{近期已播放曲目禁止重复}}\n\n【最近主播对话】\n{{最近主播对话}}\n\n【用户本次要求】\n{{用户输入}}\n\n请选择 {{请求曲数}} 首真实存在的歌曲，并为每首歌曲写一段角色对用户说的台本。\n\n选歌要求：\n1. 歌曲必须真实存在，歌名和艺术家必须准确。\n2. 除非用户明确要求，否则不要推荐 Live、Remix、Cover、伴奏或同名翻唱版本。\n3. 结合用户要求、音乐偏好、最近对话、剧情氛围和角色性格选歌。\n4. 不要编造音频地址、歌曲 ID、平台来源或搜索链接。播放器会根据歌名和艺术家自行搜索音源。\n\n台本要求：\n1. 台本重点是角色本人和 {{用户名称}} 的相处感，像角色陪用户一起听歌时自然说的话。\n2. 不要写成主持人报幕、正式广播、歌曲百科、音乐史或专业乐评。\n3. 可以回应最近对话、用户心情和剧情氛围，也可以让多个主持人自然接话。\n4. host 必须使用【主持人】中出现的角色名字。\n5. VoiceTag 内的发送文本必须只使用 {{朗读语言}}；中文弯引号中的显示文本必须只使用 {{显示语言}}。\n\n最终只返回一个合法 JSON 对象。不要 Markdown，不要代码块，不要解释，不要标题，也不要输出 JSON 之外的文字。\n\n返回格式必须严格如下：\n{\"items\":[{\"host\":\"主持人名字\",\"say\":\"[VoiceTag:主持人名字:{{朗读语言}}:发送文本]“显示文本”\",\"song\":{\"title\":\"真实歌名\",\"artist\":\"真实艺术家\"},\"reason\":\"简短的内部选歌备注\"}]}\n\n字段规则：\n- items 数量必须等于 {{请求曲数}}。\n- song 对象只能包含 title 和 artist 两个字段。\n- 不要输出 url、query、id、source、platform 或其他歌曲字段。\n- JSON 中所有字符串必须正确转义并完整闭合。"},{"group":"音乐源","key":"musicLibrary","type":"textarea-presets","label":"本地曲库（每行 JSON 或 歌名 | 歌手 | url | 标签）","rows":8,"variables":["{\"title\":\"歌名\",\"artist\":\"歌手\",\"url\":\"https://...mp3\",\"tags\":\"标签\"}"],"default":"{\"title\":\"示例歌曲\",\"artist\":\"可替换歌手\",\"url\":\"https://example.com/song.mp3\",\"tags\":\"安静,夜晚\",\"note\":\"把这一行换成真实可播放 mp3/flac/ogg 直链\"}\n歌名 | 歌手 | https://example.com/song.mp3 | 标签或备注"},{"group":"音乐偏好","key":"tasteDistillPrompt","type":"textarea-presets","label":"音乐偏好蒸馏提示词","rows":10,"variables":["{{用户输入}}","{{音乐偏好}}","{{收藏曲目}}","{{最近播放}}"],"default":"请根据用户输入、收藏曲目和最近播放记录，蒸馏出一个可以长期用于私人电台推荐的音乐偏好提示词。\n\n要求：\n1. 输出中文，80-220字。\n2. 不要写成列表，不要解释你的过程。\n3. 保留用户明确喜欢/不喜欢的曲风、语言、年代、情绪、节奏、歌手/作品倾向。\n4. 如果信息不足，就谨慎概括，不要编造。\n\n【用户输入】\n{{用户输入}}\n\n【已有偏好】\n{{音乐偏好}}\n\n【收藏曲目】\n{{收藏曲目}}\n\n【最近播放】\n{{最近播放}}"},{"group":"提示词","key":"scriptRewritePrompt","type":"textarea-presets","label":"收藏/手动曲目更新台本提示词","rows":8,"variables":["{{主持人列表}}","{{用户名称}}","{{用户设定}}","{{角色设定}}","{{世界书}}","{{电台世界书}}","{{剧情上下文}}","{{音乐偏好}}","{{最近主播对话}}","{{曲目列表}}","{{朗读语言}}","{{显示语言}}"],"default":"你正在为已经确定要播放的曲目补写角色台词。不要推荐新歌，不要改变曲目，只给每首给定曲目写一段角色说给用户听的话。\n\n【主持人】\n{{主持人列表}}\n\n如果有多个主持人，就默认他们都在这个“陪你听歌”的小空间里。可以互相对话、一起跟用户聊天。不要受主线剧情在场逻辑限制。\n\n【用户】\n{{用户名称}}\n{{用户设定}}\n\n【角色与世界背景】\n{{角色设定}}\n{{世界书}}\n\n【当前剧情上下文】\n{{剧情上下文}}\n\n【用户音乐偏好】\n{{音乐偏好}}\n\n【最近聊天】\n{{最近主播对话}}\n\n【需要补台词的曲目】\n{{曲目列表}}\n\n写作方向：\n- 像角色陪 user 一起听这首歌，不要写成正式节目串场。\n- 不要主动讲音乐史、发行背景、榜单、专业乐评，除非用户明确要求。\n- 可以回应最近聊天、剧情气氛、用户偏好，但语气要自然。\n\n最终回复只能是一个 JSON 对象，从 { 开始，到 } 结束。不要 Markdown，不要解释，不要标题，不要说“下面是”。\n\n输出格式例子如下，例子里的 {{变量}} 是占位符，实际返回时请替换成真实内容：\n{\"scripts\":[{\"key\":\"{{曲目key}}\",\"host\":\"{{主持人名字}}\",\"say\":\"[VoiceTag:{{主持人名字}}:{{朗读语言}}:{{发送文本}}]“{{显示文本}}”\"}]}\n\n填写要求：\n- 每个 scripts 对象必须对应【需要补台词的曲目】里的一首歌，key 必须原样使用给定的曲目 key。\n- host 必须来自【主持人】。\n- {{发送文本}} 必须只使用 {{朗读语言}}，这是发给 MiniMax TTS 的内容。\n- {{显示文本}} 必须只使用 {{显示语言}}，这是给用户看的字幕。\n- say 内部字幕必须用中文弯引号 “ ”，不要用英文直引号 \" \" 包字幕。\n- JSON 字符串外层仍然必须使用英文双引号。"},{"group":"提示词","key":"radioChatPrompt","type":"textarea-presets","label":"主播连线聊天提示词","rows":8,"variables":["{{主持人列表}}","{{用户名称}}","{{用户设定}}","{{角色设定}}","{{世界书}}","{{电台世界书}}","{{剧情上下文}}","{{音乐偏好}}","{{最近播放曲目}}","{{聊天总结}}","{{最近主播对话}}","{{用户输入}}","{{朗读语言}}","{{显示语言}}"],"default":"你正在扮演被用户选中的角色，和 {{用户名称}} 一边听歌一边聊天。这里只回复聊天内容，不推荐新曲目，不输出歌曲。\n\n【主持人】\n{{主持人列表}}\n\n如果有多个主持人，就默认他们都在聊天现场。可以一人回答，也可以多人接话互动；不要受主线剧情在场逻辑限制。\n\n【用户】\n{{用户名称}}\n{{用户设定}}\n\n【角色与世界背景】\n{{角色设定}}\n{{世界书}}\n\n【当前剧情上下文】\n{{剧情上下文}}\n\n【用户音乐偏好】\n{{音乐偏好}}\n\n【最近播放曲目】\n{{最近播放曲目}}\n\n【已总结的聊天】\n{{聊天总结}}\n\n【最近聊天】\n{{最近主播对话}}\n\n【用户刚说】\n{{用户输入}}\n\n写作方向：\n- 像角色本人直接回应 user，不要写成主持人连线、节目采访或正式播音。\n- 可以顺着正在听歌的氛围说，但重点是和 user 说话。\n- 不要主动讲音乐史、发行背景、榜单、专业乐评，除非用户明确要求。\n\n最终回复只能是一个 JSON 对象，从 { 开始，到 } 结束。不要 Markdown，不要解释，不要标题，不要说“下面是”。\n\n输出格式例子如下，例子里的 {{变量}} 是占位符，实际返回时请替换成真实内容：\n{\"replies\":[{\"host\":\"{{主持人名字}}\",\"say\":\"[VoiceTag:{{主持人名字}}:{{朗读语言}}:{{发送文本}}]“{{显示文本}}”\"}]}\n\n主持人存在多人的情况请让角色按场景自然参加。不要只一个人讲话。根据用户这句话和最近聊天，自然判断哪些主持人该说话：可以一个人说，也可以多人接话，也可以有人不发言；不要固定顺序，不要重复上一轮发言模式。用户 @ 到的主持人必须发言。\n\n填写要求：\n- replies 数量按场景自然决定，通常 1-3 条；每条 host 必须来自【主持人】。\n- {{发送文本}} 必须只使用 {{朗读语言}}，这是发给 MiniMax TTS 的内容。\n- {{显示文本}} 必须只使用 {{显示语言}}，这是给用户看的字幕。\n- say 内部字幕必须用中文弯引号 “ ”，不要用英文直引号 \" \" 包字幕。\n- JSON 字符串外层仍然必须使用英文双引号。"},{"group":"提示词","key":"radioChatSummaryPrompt","type":"textarea-presets","label":"主播对话记忆总结提示词","rows":5,"variables":["{{旧总结}}","{{对话内容}}"],"default":"请把私人电台主播与用户的旧对话整理成连续记忆摘要，保留用户偏好、情绪、承诺、重要剧情联系、刚才聊到的歌和主播表达过的态度。不要列表，不要解释，120-260字。\n\n【旧总结】\n{{旧总结}}\n\n【新增对话】\n{{对话内容}}"},{"group":"音乐源","key":"gdMusicApiBase","type":"text","label":"GD音乐台接口地址","default":"https://music-api.gdstudio.xyz/api.php","placeholder":"https://music-api.gdstudio.xyz/api.php"},{"group":"覆盖 API","key":"useOwnApi","type":"toggle","label":"启用自定义电台 API","default":false},{"group":"覆盖 API","key":"ownApiUrl","type":"text","label":"API 地址","default":"","placeholder":"https://api.example.com/v1"},{"group":"覆盖 API","key":"ownApiKey","type":"password","label":"API 密钥","default":""},{"group":"覆盖 API","key":"useOwnModel","type":"toggle","label":"使用自定义模型名","default":false},{"group":"覆盖 API","key":"ownModel","type":"text","label":"模型名","default":""},{"group":"生成参数","key":"temperature","type":"number","label":"Temperature","default":0.9,"min":0,"max":2},{"group":"生成参数","key":"maxTokens","type":"number","label":"最大输出 tokens <button type=\"button\" onclick=\"window._vnmRadioShowLastApi&&window._vnmRadioShowLastApi()\" style=\"margin-left:8px;padding:2px 9px;border-radius:10px;background:rgba(255,255,255,.09);border:.5px solid rgba(255,255,255,.12);color:rgba(255,255,255,.72);font-size:11px;cursor:pointer;font-family:inherit;\">查看上次 API 返回</button>","default":20000,"min":256,"max":50000},{"group":"生成参数","key":"aiTimeoutMs","type":"number","label":"请求超时（秒）","default":300,"min":15,"max":600},{"group":"覆盖 TTS","key":"ttsProviderOverride","type":"select","label":"语音来源(本电台，留空则跟随全局)","options":[{"value":"","label":"跟随全局"},{"value":"minimax","label":"MiniMax"},{"value":"fishaudio","label":"Fish Audio"}],"default":""},{"group":"覆盖 TTS","key":"ttsJpNameMap","type":"textarea","label":"日文朗读人名读音替换（仅朗读语言为日文时生效）","rows":4,"default":"五条悟=ゴジョウサトル\n夏油杰=ゲトウスグル\n夏油傑=ゲトウスグル\n五条=ゴジョウ\n杰=スグル\n傑=スグル\n悟=サトル\n悟り=さとり\n悟る=さとる\n悟った=さとった\n夏油=ゲトウ","placeholder":"每行一个：原文=读音（假名或罗马音），如 五条=ゴジョウ；人名独立成词才替换，单字/姓氏称呼照常；三字名建议写整体一行（长词优先匹配）；若台词含日文常用词（如悟り/悟る），加一行整词替换可防误伤"},{"group":"覆盖 TTS","key":"useOwnTts","type":"toggle","label":"使用自定义凭证(而非全局Key)","default":false},{"group":"覆盖 TTS","key":"ownTtsKey","type":"password","label":"MiniMax API Key","default":""},{"group":"覆盖 TTS","key":"ownTtsGid","type":"text","label":"MiniMax Group ID","default":""},{"group":"覆盖 TTS","key":"ownFishKey","type":"password","label":"Fish Audio API Key","default":""},{"group":"电台","key":"barAlbumGlass","type":"toggle","label":"第二形态专辑图液态玻璃遮罩","default":true},{"group":"歌词","key":"barLyrics","type":"toggle","label":"第二形态流动歌词显示","default":true},{"group":"歌词","key":"orbLyrics","type":"toggle","label":"第一形态侧边歌词显示","default":true},{"group":"歌词","key":"lyricsStyle","type":"select","label":"歌词动画样式","default":"fume","options":[{"v":"fume","l":"浮名（模糊聚焦）"},{"v":"lumi","l":"流光（逐行点亮）"},{"v":"stack","l":"云阶（层叠上升）"},{"v":"scroll","l":"简约滚动"}]},{"group":"电台","key":"keepModeOnVnExit","type":"toggle","label":"退出VN模式时保持当前形态（关=收回第一形态）","default":false},{"group":"电台","key":"autoRetry","type":"toggle","label":"请求失败自动重试","default":true},{"group":"电台","key":"retryCount","type":"number","label":"自动重试次数","default":2,"min":0,"max":10},{"group":"电台","key":"radioTtsEnabled","type":"toggle","label":"启用 TTS 语音（关闭后仅显示台本/字幕不请求语音）","default":true},{"group":"音乐偏好","key":"tasteEnabled","type":"toggle","label":"启用蒸馏结果（{{音乐偏好}}）","default":true},{"group":"电台","key":"leftCardImage","type":"text","label":"第三形态左侧播放栏背景图 URL（留空=当前专辑封面）","default":"","placeholder":"https://..."},{"group":"提示词","key":"artistChatPrompt","type":"textarea-presets","label":"Artist 私聊提示词（同电话 App）","default":"【回复格式（最高优先级，违反即不合格）】\n你的每条回复必须且只能使用下面这一种格式（需要多说几条就分成多行，每行一条）：\n[VoiceTag:{{角色名称}}:{{朗读语言}}:语音文本]“字幕文本”\n- 方括号内的“语音文本”必须整句使用 {{朗读语言}} 书写，这是发送给 TTS 朗读的内容。\n- 中文弯引号“ ”内的“字幕文本”必须整句使用 {{显示语言}} 书写，这是显示给用户看的字幕。\n- 语音文本与字幕文本是同一句话的两种语言版本，内容含义必须一一对应。\n- VoiceTag 格式不是 Markdown、不是 JSON、不是代码块；禁止输出 JSON 对象、```代码块、**加粗**、列表或任何解释。\n\n你正在扮演{{角色名称}}与{{用户名称}}进行对话。\n【角色设定】\n{{角色名称}}\n{{角色设定}}\n【用户设定】\n{{用户名称}}\n{{用户设定}}\n【世界背景信息】\n{{世界书}}\n【当前{{用户名称}}经历】\n{{酒馆历史}}\n【最近对话】\n{{对话内容}}\n请用简短自然的口语风格回复，20字以内，只说话不描述动作，不要输出任何额外内容。","rows":12,"variables":["{{角色名称}}","{{角色设定}}","{{用户名称}}","{{用户设定}}","{{世界书}}","{{酒馆历史}}","{{Horae总结}}","{{对话内容}}","{{用户输入}}","{{当前时间}}","{{朗读语言}}","{{显示语言}}"]},{"group":"电台","key":"artistDepth","type":"number","label":"Artist 私聊携带最大轮数","default":10,"min":0,"max":50},{"group":"电台","key":"artistInjectN","type":"number","label":"Artist 注入酒馆的最近条数","default":8,"min":1,"max":50}];

    FIELDS.forEach(function(f) {

        if (f.type !== 'textarea-presets') return;

        if (Object.prototype.toString.call(f.variables) !== '[object Array]') f.variables = [];

        if (f.variables.indexOf('{{柏宝书总结}}') < 0) f.variables.push('{{柏宝书总结}}');

    });

    if (!cfg.__radioPromptV3 && (!cfg.promptTemplate || cfg.promptTemplate.indexOf('你正在扮演被用户选中的角色') >= 0 || cfg.promptTemplate.indexOf('song.url') >= 0 || cfg.promptTemplate.indexOf('播放直链') >= 0)) { cfg.promptTemplate = "你是专业的电台台本写作者，接下来你要为用户选择的角色进行台本的创作。台本的内容不是正式广播节目，而是角色本人陪 {{用户名称}} 一起听歌、聊天、换歌前后自然聊天。\n\n【主持人】\n{{主持人列表}}\n\n如果有多个主持人，就把他们视为正在同一个私人电台空间里陪用户听歌。他们可以轮流说话、互相接话，也可以回应用户；不要受主线剧情中是否在场的限制。\n\n【用户】\n{{用户名称}}\n{{用户设定}}\n\n【角色与世界背景】\n{{角色设定}}\n{{世界书}}\n\n【电台专用世界书】\n{{电台世界书}}\n\n【当前剧情上下文】\n{{剧情上下文}}\n\n【用户音乐偏好】\n{{音乐偏好}}\n\n【近期已播放曲目禁止重复】\n{{近期已播放曲目禁止重复}}\n\n【最近主播对话】\n{{最近主播对话}}\n\n【用户本次要求】\n{{用户输入}}\n\n请选择 {{请求曲数}} 首真实存在的歌曲，并为每首歌曲写一段角色对用户说的台本。\n\n选歌要求：\n1. 歌曲必须真实存在，歌名和艺术家必须准确。\n2. 除非用户明确要求，否则不要推荐 Live、Remix、Cover、伴奏或同名翻唱版本。\n3. 结合用户要求、音乐偏好、最近对话、剧情氛围和角色性格选歌。\n4. 不要编造音频地址、歌曲 ID、平台来源或搜索链接。播放器会根据歌名和艺术家自行搜索音源。\n\n台本要求：\n1. 台本重点是角色本人和 {{用户名称}} 的相处感，像角色陪用户一起听歌时自然说的话。\n2. 不要写成主持人报幕、正式广播、歌曲百科、音乐史或专业乐评。\n3. 可以回应最近对话、用户心情和剧情氛围，也可以让多个主持人自然接话。\n4. host 必须使用【主持人】中出现的角色名字。\n5. VoiceTag 内的发送文本必须只使用 {{朗读语言}}；中文弯引号中的显示文本必须只使用 {{显示语言}}。\n\n最终只返回一个合法 JSON 对象。不要 Markdown，不要代码块，不要解释，不要标题，也不要输出 JSON 之外的文字。\n\n返回格式必须严格如下：\n{\"items\":[{\"host\":\"主持人名字\",\"say\":\"[VoiceTag:主持人名字:{{朗读语言}}:发送文本]“显示文本”\",\"song\":{\"title\":\"真实歌名\",\"artist\":\"真实艺术家\"},\"reason\":\"简短的内部选歌备注\"}]}\n\n字段规则：\n- items 数量必须等于 {{请求曲数}}。\n- song 对象只能包含 title 和 artist 两个字段。\n- 不要输出 url、query、id、source、platform 或其他歌曲字段。\n- JSON 中所有字符串必须正确转义并完整闭合。"; cfg.__radioPromptV3 = true; try { _saveCfg(); } catch(e) {} }

    if (!cfg.__radioPromptV4) {

        cfg.__radioPromptV4 = true;

        var oldFavoriteBlock = '\n\n【收藏曲目】\n{{收藏曲目}}';

        if (cfg.promptTemplate && cfg.promptTemplate.indexOf('你是专业的电台台本写作者') === 0 && cfg.promptTemplate.indexOf(oldFavoriteBlock) >= 0) {

            cfg.promptTemplate = cfg.promptTemplate.replace(oldFavoriteBlock, '');

        }

        try { _saveCfg(); } catch(e) {}

    }



    (function() {

        var ch = false;

        for (var i = 0; i < FIELDS.length; i++) {

            var f = FIELDS[i];

            if (f["default"] !== undefined && cfg[f.key] === undefined) {

                cfg[f.key] = f["default"];

                ch = true;

            }

        }

        var defRevKey = '__radioDefaults_v2_5_5';

        if (cfg[defRevKey] !== true) {

            cfg[defRevKey] = true;

            if (cfg.batchSize === undefined || cfg.batchSize === 5 || cfg.batchSize === '5') cfg.batchSize = 10;

            if (cfg.barLyrics === undefined || cfg.barLyrics === false || cfg.barLyrics === 'false') cfg.barLyrics = true;

            if (cfg.orbLyrics === undefined || cfg.orbLyrics === false || cfg.orbLyrics === 'false') cfg.orbLyrics = true;

            ch = true;

        }

        if (ch) {

            try {

                _saveCfg();

            } catch (e) {}

        }

    })();



    function icon2(name) {

        var m = {

            search: '<circle cx="10.5" cy="10.5" r="5.7" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M14.8 14.8 19 19" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',

            backF: '<path d="M11.8 6.6v10.8L4.6 12l7.2-5.4Zm7.6 0v10.8L12.2 12l7.2-5.4Z" fill="currentColor"/>',

            fwdF: '<path d="M12.2 6.6v10.8L19.4 12l-7.2-5.4Zm-7.6 0v10.8L11.8 12 4.6 6.6Z" fill="currentColor"/>',

            pauseF: '<path d="M7.6 5.6h3.2v12.8H7.6zM13.2 5.6h3.2v12.8h-3.2z" fill="currentColor"/>',

            playF: '<path d="M8 5.4v13.2L19 12 8 5.4Z" fill="currentColor"/>',

            heart: '<path d="M12 19s-7-4.1-7-8.5A3.7 3.7 0 0 1 12 8.6a3.7 3.7 0 0 1 7 1.9C19 14.9 12 19 12 19Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/>',

            heartF: '<path d="M12 19.2s-7.2-4.2-7.2-8.7A3.8 3.8 0 0 1 12 8.5a3.8 3.8 0 0 1 7.2 2C19.2 15 12 19.2 12 19.2Z" fill="currentColor"/>',

            vol: '<path d="M4.8 9.8h2.9l3.5-3v10.4l-3.5-3H4.8V9.8Z" fill="currentColor"/><path d="M14.2 9.2a4 4 0 0 1 0 5.6M16.6 7.3a7 7 0 0 1 0 9.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/>',

            volMute: '<path d="M4.8 9.8h2.9l3.5-3v10.4l-3.5-3H4.8V9.8Z" fill="currentColor"/><path d="M14.6 9.6l4.8 4.8M19.4 9.6l-4.8 4.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',

            quote: '<path d="M12 4.8c4.4 0 8 2.9 8 6.6 0 3.6-3.6 6.5-8 6.5-.9 0-1.8-.1-2.6-.4L6 19l.9-3.2c-1.8-1.2-2.9-3-2.9-4.4 0-3.7 3.6-6.6 8-6.6Z" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round" fill="none"/>',

            listB: '<path d="M4.8 7h14.4M4.8 12h14.4M4.8 17h14.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',

            more: '<circle cx="5.6" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="18.4" cy="12" r="1.5" fill="currentColor"/>',

            mic: '<rect x="9.4" y="4.4" width="5.2" height="9.4" rx="2.6" stroke="currentColor" stroke-width="1.55" fill="none"/><path d="M6.4 11.6a5.6 5.6 0 0 0 11.2 0M12 17.4v2.4" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" fill="none"/>',

            chevD: '<path d="M6.5 9.5 12 15l5.5-5.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',

            chevL: '<path d="M14.5 6 9 11.5l5.5 5.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',

            bkm: '<path d="M7.4 4.8h9.2v14.6L12 15.9l-4.6 3.5V4.8Z" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round" fill="none"/>',

            bkmF: '<path d="M7.2 4.6h9.6v15L12 16l-4.8 3.6v-15Z" fill="currentColor"/>',

            filter: '<path d="M5 7.5h14M7.5 12h9M10 16.5h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',

            minus: '<path d="M7 12h10" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',

            plus2: '<path d="M12 6.4v11.2M6.4 12h11.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',

            sendP: '<path d="M4.6 12.5 19.4 5l-3.6 14.4-3.5-5.6-7.7-1.3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>',

            edit: '<path d="M14.9 5.7l3.4 3.4L9 18.4l-4 0.6.6-4 9.3-9.3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>',

            redo: '<path d="M17.4 8.4A6 6 0 1 0 18 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/><path d="M17.8 4.6v3.9h-3.9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',

            del: '<path d="M8 8.6h8M10 8.6l.4 8.6h3.2l.4-8.6M10.5 6.4h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',

            x: '<path d="M7 7l10 10M17 7 7 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',

            note: '<path d="M9.6 17.2V6.6l8-1.8v10.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/><ellipse cx="7.6" cy="17.4" rx="2.1" ry="1.7" fill="currentColor"/><ellipse cx="15.6" cy="15.4" rx="2.1" ry="1.7" fill="currentColor"/>',

            clock2: '<circle cx="12" cy="12" r="7.2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 8.2V12l2.6 1.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',

            person: '<circle cx="12" cy="12" r="7.6" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="12" cy="10" r="2.4" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M7.4 16.6c.9-2 2.6-3 4.6-3s3.7 1 4.6 3" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/>',

            grid2: '<rect x="5" y="5" width="6" height="6" rx="1.4" fill="currentColor"/><rect x="13.4" y="5" width="5.6" height="5.6" rx="1.3" stroke="currentColor" stroke-width="1.3" fill="none"/><rect x="5" y="13.4" width="5.6" height="5.6" rx="1.3" stroke="currentColor" stroke-width="1.3" fill="none"/><rect x="13.4" y="13.4" width="5.6" height="5.6" rx="1.3" stroke="currentColor" stroke-width="1.3" fill="none"/>',

            spark2: '<path d="M12 4.2l1 4L17 9.2l-4 1-1 4-1-4-4-1 4-1 1-4Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="none"/><path d="M17.8 13.8l.5 1.7 1.7.5-1.7.5-.5 1.7-.5-1.7-1.7-.5 1.7-.5.5-1.7Z" fill="currentColor"/>',

            speaker2: '<rect x="7.4" y="4.8" width="9.2" height="14.4" rx="2.2" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="14" r="2.6" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="12" cy="8.2" r="1.1" fill="currentColor"/>',

            listRect: '<rect x="6.4" y="4.6" width="11.2" height="14.8" rx="2.4" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M9 9h6M9 12h6M9 15h3.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'

        };

        return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (m[name] || m.note) + '</svg>';

    }



    function ib(cls, name, title, fn) {

        var b = E('button', cls);

        b.type = 'button';

        b.title = title || '';

        b.innerHTML = icon2(name);

        b.onclick = function(ev) {

            ev.preventDefault();

            ev.stopPropagation();

            fn && fn(ev);

        };

        return b;

    }



    function ui2() {

        if (!eng.store.ui2) eng.store.ui2 = {};

        var u = eng.store.ui2;

        if (!u.mode) {

            var legacy = eng.store.floatingMode;

            u.mode = legacy === 'full' ? 'studio' : (legacy === 'mini' ? 'bar' : 'orb');

        }

        if (u.mode !== 'orb' && u.mode !== 'bar' && u.mode !== 'studio') u.mode = 'orb';

        if (!u.view) u.view = 'songs';

        return u;

    }



    function _defsSvg() {

        var d = TOPDOC.getElementById('vnr2-defs');

        if (!d) {

            d = TOPDOC.createElementNS('http://www.w3.org/2000/svg', 'svg');

            d.setAttribute('id', 'vnr2-defs');

            d.setAttribute('width', '0');

            d.setAttribute('height', '0');

            d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';

            d.innerHTML = '<defs></defs>';

            TOPDOC.body.appendChild(d);

        }

        return d.querySelector('defs') || d;

    }



    function makeLiquid(id, w, h, zone, scale) {

        var defs = _defsSvg();

        var old = TOPDOC.getElementById(id);

        if (old) old.remove();

        var NS = 'http://www.w3.org/2000/svg';

        var f = TOPDOC.createElementNS(NS, 'filter');

        f.setAttribute('id', id);

        f.setAttribute('x', '-20%');

        f.setAttribute('y', '-20%');

        f.setAttribute('width', '140%');

        f.setAttribute('height', '140%');

        f.setAttribute('primitiveUnits', 'userSpaceOnUse');

        var maskSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><defs><radialGradient id="g" cx="50%" cy="50%" r="72%"><stop offset="0%" stop-color="black"/><stop offset="' + zone + '%" stop-color="black"/><stop offset="100%" stop-color="white"/></radialGradient></defs><rect width="' + w + '" height="' + h + '" fill="url(#g)"/></svg>';

        f.innerHTML = '<feTurbulence type="fractalNoise" baseFrequency="0.012 0.012" numOctaves="2" seed="7" result="noise"/>' +

            '<feGaussianBlur in="noise" stdDeviation="2" result="soft"/>' +

            '<feImage x="0" y="0" width="' + w + '" height="' + h + '" result="mask" href="data:image/svg+xml,' + encodeURIComponent(maskSvg) + '"/>' +

            '<feComposite in="soft" in2="mask" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="noiseMasked"/>' +

            '<feFlood flood-color="rgb(128,128,128)" result="gray"/>' +

            '<feComposite in="gray" in2="mask" operator="arithmetic" k1="-1" k2="1" k3="0" k4="0" result="grayMasked"/>' +

            '<feComposite in="noiseMasked" in2="grayMasked" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="dispMap"/>' +

            '<feDisplacementMap in="SourceGraphic" in2="dispMap" scale="' + (scale || 60) + '" xChannelSelector="R" yChannelSelector="G"/>' +

            '<feGaussianBlur stdDeviation="2"/>';

        defs.appendChild(f);

        return id;

    }



    /* ============ 第一/第二形态 + logo + 字幕 专用液态玻璃数值（来自 liquid-glass-new.html 测试台调参） ============ */

    var GLASS_PRESETS = {

        orb: { scale: 84, bezel: 52, feather: 1, aber: 3, radius: 20, blur: 1, sat: 150, bright: 105, contrast: 100, hl: 103, shadow: 60, tintA: 0, tintC: '#ffffff', previewW: 50, previewH: 50 },

        logo: { scale: 84, bezel: 18, feather: 1, aber: 3, radius: 12, blur: 1, sat: 150, bright: 105, contrast: 100, hl: 100, shadow: 0, tintA: 0, tintC: '#ffffff', previewW: 34, previewH: 34 },

        bar: { scale: 22, bezel: 150, feather: 10, aber: 3, radius: 50, blur: 1.5, sat: 150, bright: 105, contrast: 100, hl: 72, shadow: 17, tintA: 0, tintC: '#ffffff', previewW: 544, previewH: 61 },

        caption: { scale: 71, bezel: 10, feather: 15, aber: 3, radius: 100, blur: 2.5, sat: 150, bright: 105, contrast: 100, hl: 65, shadow: 0, tintA: 0, tintC: '#ffffff', previewW: 220, previewH: 40 }

    };

    var _glassUid = 0;



    function _glassFilterId(el, key) {

        try {

            if (!el.__vnmGlassFilterId) el.__vnmGlassFilterId = 'pp-lg-' + key + '-' + (++_glassUid);

            return el.__vnmGlassFilterId;

        } catch (e) {

            return 'pp-lg-' + key + '-fallback';

        }

    }



    /* Same structure as liquid-glass-3shapes.html: canvas SDF displacement map + RGB channel offsets. */

    function _buildGlassFilter(id, w, h, p) {

        try {

            var defs = _defsSvg();

            var old = TOPDOC.getElementById(id);

            if (old) old.remove();

            w = Math.max(2, Math.round(w));

            h = Math.max(2, Math.round(h));

            var r = Math.min(p.radius, w / 2, h / 2);

            var bezel = Math.max(1, p.bezel);

            var canvas = TOPDOC.createElement('canvas');

            canvas.width = w;

            canvas.height = h;

            var ctx = canvas.getContext('2d');

            var img = ctx.createImageData(w, h);

            var d = img.data;

            var hw = w / 2,

                hh = h / 2,

                eps = 1;



            function sdfR(px, py, rr) {

                var qx = Math.abs(px) - (hw - rr),

                    qy = Math.abs(py) - (hh - rr);

                return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - rr;

            }

            var rn = Math.max(r, Math.min(bezel * 1.2, hw, hh));

            var fx = new Float32Array(w * h),

                fy = new Float32Array(w * h);

            for (var y = 0; y < h; y++) {

                for (var x = 0; x < w; x++) {

                    var px = x - hw + .5,

                        py = y - hh + .5;

                    var dist = sdfR(px, py, r);

                    if (dist > -bezel && dist <= 0) {

                        var t = 1 + dist / bezel;

                        var edge = t * t * (3 - 2 * t);

                        var nx = (sdfR(px + eps, py, rn) - sdfR(px - eps, py, rn)) / (2 * eps);

                        var ny = (sdfR(px, py + eps, rn) - sdfR(px, py - eps, rn)) / (2 * eps);

                        var len = Math.hypot(nx, ny) || 1;

                        var j = y * w + x;

                        fx[j] = nx / len * edge;

                        fy[j] = ny / len * edge;

                    }

                }

            }

            var R = Math.max(1, Math.min(Math.round(p.feather), 90));



            function blurPass(src) {

                var out = new Float32Array(src.length);

                for (var yy1 = 0; yy1 < h; yy1++)

                    for (var xx1 = 0; xx1 < w; xx1++) {

                        var sum = 0,

                            n = 0;

                        for (var k = -R; k <= R; k++) {

                            var xx = xx1 + k;

                            if (xx >= 0 && xx < w) {

                                sum += src[yy1 * w + xx];

                                n++;

                            }

                        }

                        out[yy1 * w + xx1] = sum / n;

                    }

                var out2 = new Float32Array(src.length);

                for (var yy2 = 0; yy2 < h; yy2++)

                    for (var xx2 = 0; xx2 < w; xx2++) {

                        var sum2 = 0,

                            n2 = 0;

                        for (var k2 = -R; k2 <= R; k2++) {

                            var yy = yy2 + k2;

                            if (yy >= 0 && yy < h) {

                                sum2 += out[yy * w + xx2];

                                n2++;

                            }

                        }

                        out2[yy2 * w + xx2] = sum2 / n2;

                    }

                return out2;

            }

            var sx = blurPass(fx),

                sy = blurPass(fy);

            for (var j2 = 0; j2 < w * h; j2++) {

                var i2 = j2 * 4;

                d[i2] = Math.round(128 + sx[j2] * 127);

                d[i2 + 1] = Math.round(128 + sy[j2] * 127);

                d[i2 + 2] = 128;

                d[i2 + 3] = 255;

            }

            ctx.putImageData(img, 0, 0);

            var mapUrl = canvas.toDataURL();

            var NS2 = 'http://www.w3.org/2000/svg';

            var f = TOPDOC.createElementNS(NS2, 'filter');

            f.setAttribute('id', id);

            f.setAttribute('x', '-30%');

            f.setAttribute('y', '-30%');

            f.setAttribute('width', '160%');

            f.setAttribute('height', '160%');

            f.setAttribute('color-interpolation-filters', 'sRGB');

            f.innerHTML = '<feImage href="' + mapUrl + '" x="0" y="0" width="' + w + '" height="' + h + '" preserveAspectRatio="none" result="MAP"/>' +

                '<feDisplacementMap in="SourceGraphic" in2="MAP" scale="' + (p.scale + p.aber) + '" xChannelSelector="R" yChannelSelector="G" result="dR"/>' +

                '<feColorMatrix in="dR" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="cR"/>' +

                '<feDisplacementMap in="SourceGraphic" in2="MAP" scale="' + p.scale + '" xChannelSelector="R" yChannelSelector="G" result="dG"/>' +

                '<feColorMatrix in="dG" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="cG"/>' +

                '<feDisplacementMap in="SourceGraphic" in2="MAP" scale="' + Math.max(0, p.scale - p.aber) + '" xChannelSelector="R" yChannelSelector="G" result="dB"/>' +

                '<feColorMatrix in="dB" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="cB"/>' +

                '<feBlend in="cR" in2="cG" mode="screen" result="RG"/>' +

                '<feBlend in="RG" in2="cB" mode="screen"/>';

            defs.appendChild(f);

            return id;

        } catch (e) {

            return null;

        }

    }



    function _ensurePresetFilter(el, key, w, h) {

        var p = GLASS_PRESETS[key];

        if (!p) return null;

        var id = _glassFilterId(el, key);

        var sizeKey = key + ':' + Math.round(w) + 'x' + Math.round(h) + ':' + p.scale + ':' + p.bezel + ':' + p.feather + ':' + p.aber + ':' + p.radius;

        if (el.__vnmGlassSizeKey === sizeKey && TOPDOC.getElementById(id)) return id;

        el.__vnmGlassSizeKey = sizeKey;

        return _buildGlassFilter(id, w, h, p);

    }



    function _refreshGlassSize(el, key) {

        try {

            key = key || el.__vnmGlassKey;

            var preset = key && GLASS_PRESETS[key];

            if (!preset) return;

            var r = el.getBoundingClientRect();

            var w = Math.round(r.width) || preset.previewW || 60,

                h = Math.round(r.height) || preset.previewH || 40;

            var bw = Math.max(20, Math.round(w / 4) * 4),

                bh = Math.max(16, Math.round(h / 4) * 4);

            var fid = _ensurePresetFilter(el, key, bw, bh);

            if (fid) {

                el.style.setProperty('--lg-bf', 'blur(' + preset.blur + 'px) saturate(' + preset.sat + '%) brightness(' + preset.bright + '%) contrast(' + preset.contrast + '%) url(#' + fid + ')');

                el.style.setProperty('--ge-filter', 'url(#' + fid + ')');

            } else {

                el.style.setProperty('--lg-bf', 'blur(' + preset.blur + 'px) saturate(' + preset.sat + '%) brightness(' + preset.bright + '%) contrast(' + preset.contrast + '%)');

                el.style.removeProperty('--ge-filter');

            }

        } catch (e) {}

    }



    function _lgVars(el, preset) {

        try {

            var st = el.style;

            if (preset) {

                var tintA = (preset.tintA || 0) / 100;

                var tint = tintA > 0 ? (preset.tintC || '#ffffff') + Math.round(tintA * 255).toString(16).padStart(2, '0') : 'transparent';

                st.setProperty('--lg-tint', tint);

                st.setProperty('--g-hl', String(preset.hl / 100));

                st.setProperty('--g-shadow', String(preset.shadow || 0));

                st.setProperty('--ge-blur', preset.blur + 'px');

                st.setProperty('--ge-tint', tint);

                st.setProperty('--ge-sat', preset.sat + '%');

                st.setProperty('--ge-contrast', preset.contrast + '%');

                st.setProperty('--g-bright', String(preset.bright / 100));

                st.setProperty('--lg-bf', 'blur(' + preset.blur + 'px) saturate(' + preset.sat + '%) brightness(' + preset.bright + '%) contrast(' + preset.contrast + '%)');

                return;

            }

            var g = (sbS && sbS.glassUI) || {};



            function gv(k, d) {

                return (g[k] === undefined || g[k] === null) ? d : g[k];

            }

            st.setProperty('--lg-tint', 'rgba(255,255,255,' + (gv('elTint', 1) / 100) + ')');

            st.setProperty('--lg-bf', 'blur(' + gv('elBlur', 1.5) + 'px) saturate(' + gv('elSat', 160) + '%) brightness(' + gv('bright', 90) + '%)');

            st.setProperty('--ge-blur', gv('elBlur', 1.5) + 'px');

            st.setProperty('--ge-tint', 'rgba(255,255,255,' + (gv('elTint', 1) / 100) + ')');

            st.setProperty('--ge-sat', gv('elSat', 160) + '%');

            if (gv('refract', 1)) { st.setProperty('--ge-filter', 'url(#pp-lg-el)'); } else { st.removeProperty('--ge-filter'); }

            st.setProperty('--g-bright', String(gv('bright', 90) / 100));

            st.setProperty('--g-hl', String(gv('hl', 10) / 100));

            st.setProperty('--g-shadow', '20');

        } catch (e) {}

    }



    function _ensureLgFilter() {

        try {

            if (TOPDOC.getElementById('pp-lg-el')) return;

            var defs = _defsSvg();

            var tmp = TOPDOC.createElementNS('http://www.w3.org/2000/svg', 'g');

            tmp.innerHTML = '<filter id="pp-lg-el" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB"><feImage href="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Cdefs%3E%3CradialGradient%20id%3D%22g%22%20cx%3D%2250%25%22%20cy%3D%2250%25%22%20r%3D%2272%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22black%22/%3E%3Cstop%20offset%3D%2295%25%22%20stop-color%3D%22black%22/%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22white%22/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22url%28%23g%29%22/%3E%3C/svg%3E" preserveAspectRatio="none" result="mask"/><feTurbulence type="fractalNoise" baseFrequency="0.012 0.012" numOctaves="2" seed="7" result="noise"/><feGaussianBlur in="noise" stdDeviation="2" result="soft"/><feComposite in="soft" in2="mask" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="nm"/><feFlood flood-color="rgb(128,128,128)" result="gray"/><feComposite in="gray" in2="mask" operator="arithmetic" k1="-1" k2="1" k3="0" k4="0" result="gm"/><feComposite in="nm" in2="gm" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="dmap"/><feDisplacementMap in="SourceGraphic" in2="dmap" scale="60" xChannelSelector="R" yChannelSelector="G"/></filter>';

            while (tmp.firstChild) defs.appendChild(tmp.firstChild);

        } catch (e) {}

    }



    function applyGlass(el, presetKey, w, h) {

        try {

            el.classList.add('vnr2-lg');

            el.__vnmGlassKey = presetKey || '';

        } catch (e) {}

        try {

            el.style.backdropFilter = '';

            el.style.webkitBackdropFilter = '';

            el.style.setProperty('background', 'transparent', 'important');

        } catch (e) {}

        var preset = presetKey && GLASS_PRESETS[presetKey];

        if (preset) {

            _lgVars(el, preset);

            if (w && h) {

                var fid = _ensurePresetFilter(el, presetKey, w, h);

                if (fid) {

                    el.style.setProperty('--lg-bf', 'blur(' + preset.blur + 'px) saturate(' + preset.sat + '%) brightness(' + preset.bright + '%) contrast(' + preset.contrast + '%) url(#' + fid + ')');

                    el.style.setProperty('--ge-filter', 'url(#' + fid + ')');

                } else {

                    el.style.removeProperty('--ge-filter');

                }

            }

        } else {

            _lgVars(el);

        }

    }



    var _lrcCache = {};



    function _fetchLyric(song, cb) {

        if (!song || !song._lyricId || !song.source) {

            cb(null);

            return;

        }

        var key = song.source + ':' + song._lyricId;

        if (_lrcCache[key]) {

            cb(_lrcCache[key]);

            return;

        }

        _fetchJson(_gdUrl({

            types: 'lyric',

            source: song.source,

            id: song._lyricId

        })).then(function(d) {

            var l = _parseLrc((d && d.lyric) || ''),

                tl = _parseLrc((d && d.tlyric) || '');

            var out = {

                lines: l,

                tlines: tl

            };

            _lrcCache[key] = out;

            cb(out);

        }).catch(function() {

            _lrcCache[key] = {

                lines: [],

                tlines: []

            };

            cb(null);

        });

    }



    function _parseLrc(text) {

        var out = [];

        String(text || '').split('\n').forEach(function(ln) {

            var m = ln.match(/^((?:\[\d+:\d+(?:\.\d+)?\])+)(.*)$/);

            if (!m) return;

            var t = m[2].trim();

            if (!t) return;

            var tags = m[1].match(/\[\d+:\d+(?:\.\d+)?\]/g) || [];

            tags.forEach(function(tag) {

                var mm = tag.match(/\[(\d+):(\d+(?:\.\d+)?)\]/);

                if (mm) out.push({

                    t: parseInt(mm[1], 10) * 60 + parseFloat(mm[2]),

                    text: t

                });

            });

        });

        out.sort(function(a, b) {

            return a.t - b.t;

        });

        return out;

    }



    function _lrcLineAt(lines, t) {

        if (!lines || !lines.length) return -1;

        var idx = -1;

        for (var i = 0; i < lines.length; i++) {

            if (lines[i].t <= t) idx = i;

            else break;

        }

        return idx;

    }



    var _picCache = {};



    function _fetchPic(song, cb) {

        if (!song) {

            cb('');

            return;

        }

        if (song.coverUrl) {

            cb(song.coverUrl);

            return;

        }

        if (!song._picId || !song.source) {

            cb('');

            return;

        }

        var key = song.source + ':' + song._picId;

        if (_picCache[key] !== undefined) {

            cb(_picCache[key]);

            return;

        }

        _fetchJson(_gdUrl({

            types: 'pic',

            source: song.source,

            id: song._picId,

            size: 300

        })).then(function(d) {

            var u = (d && d.url) || '';

            _picCache[key] = u;

            song.coverUrl = u;

            cb(u);

        }).catch(function() {

            _picCache[key] = '';

            cb('');

        });

    }



    function _applyMute() {

        var u = ui2();

        try {

            if (eng.music) eng.music.muted = !!u.muted;

        } catch (e) {}

        try {

            if (eng.voice) eng.voice.muted = !!u.muted;

        } catch (e) {}

    }



    function _startRec(onFinal, onState) {

        var SR = ctx.SpeechRecognition || TOP.SpeechRecognition || TOP.webkitSpeechRecognition;

        if (!SR) {

            _toast('当前浏览器不支持语音识别');

            return null;

        }

        var r;

        try {

            r = new SR();

        } catch (e) {

            _toast('语音识别启动失败');

            return null;

        }

        r.lang = (_voiceLang() === 'en' ? 'en-US' : 'zh-CN');

        r.interimResults = true;

        r.continuous = true;

        var finalTxt = '';

        r.onresult = function(ev) {

            var interim = '';

            for (var i = ev.resultIndex; i < ev.results.length; i++) {

                var res = ev.results[i];

                if (res.isFinal) finalTxt += res[0].transcript;

                else interim += res[0].transcript;

            }

            onState && onState('rec', finalTxt + interim);

        };

        r.onerror = function() {

            onState && onState('err');

        };

        r.onend = function() {

            onState && onState('end');

            onFinal && onFinal(finalTxt.trim());

        };

        try {

            r.start();

        } catch (e) {}

        onState && onState('start');

        return r;

    }



    var CSS2 = ".vnr2-history-view{height:100%;;overflow:auto;padding:12px 4px}.vnr2-history-view-head{padding:6px 4px 16px}.vnr2-history-view .vnr2-history-list{display:flex;flex-direction:column;gap:9px}.vnr2-history-view .vnr2-history-row{display:flex;align-items:center;gap:8px;padding:12px 14px;border-radius:18px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.08);box-shadow:inset 0 1px 0 rgba(255,255,255,.07)}.vnr2-history-view .vnr2-history-main{flex:1;min-width:0}.vnr2-history-view .vnr2-history-btn{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.08);color:rgba(255,255,255,.72);border-radius:999px;padding:6px 9px;font-size:10px;cursor:pointer;white-space:nowrap}.vnr2-history-view .vnr2-history-btn:hover{background:rgba(255,255,255,.16);color:#fff}" + ".vnr2-history-panel{margin-top:18px;padding:14px;border:1px solid rgba(255,255,255,.10);border-radius:22px;background:rgba(255,255,255,.045);box-shadow:inset 0 1px 0 rgba(255,255,255,.10)}.vnr2-history-hint{font-size:11px;color:rgba(255,255,255,.42);line-height:1.6;margin:6px 0 10px}.vnr2-history-list{display:flex;flex-direction:column;gap:7px}.vnr2-history-row{display:flex;align-items:center;gap:7px;padding:9px 10px;border-radius:15px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.07)}.vnr2-history-main{flex:1;min-width:0}.vnr2-history-btn{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.08);color:rgba(255,255,255,.72);border-radius:999px;padding:5px 8px;font-size:10px;cursor:pointer;white-space:nowrap}.vnr2-history-btn:hover{background:rgba(255,255,255,.15);color:#fff}" + ".vnr2-chat-fm{height:34%;min-height:170px;display:flex;align-items:center;gap:30px;padding:18px 30px;border-bottom:0;overflow:hidden;background:linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,0) 78%);position:relative}.vnr2-chat-orb{position:relative;width:176px;height:176px;flex:0 0 176px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 32% 25%,#fff 0%,rgba(235,240,248,.72) 9%,rgba(130,140,155,.32) 27%,rgba(35,39,48,.92) 63%,#08090c 100%);box-shadow:0 0 0 1px rgba(255,255,255,.2),0 0 34px rgba(220,225,235,.16),inset 0 0 26px rgba(255,255,255,.12);animation:vnr2-chat-breathe 2.4s ease-in-out infinite;filter:contrast(1.12);isolation:isolate}.vnr2-chat-orb:before{content:'';position:absolute;inset:10%;border-radius:50%;background:conic-gradient(from 0deg,transparent,rgba(255,255,255,.55),transparent 28%,rgba(255,255,255,.18),transparent 68%);filter:blur(7px);animation:vnr2-chat-spin 6s linear infinite;z-index:-1}.vnr2-chat-orb i,.vnr2-chat-orb b,.vnr2-chat-orb em{position:absolute;inset:-10px;border:1px solid rgba(235,240,250,.3);border-radius:50%;animation:vnr2-chat-ring 2.6s ease-out infinite}.vnr2-chat-orb b{inset:-25px;animation-delay:.8s;opacity:.45}.vnr2-chat-orb em{inset:-40px;animation-delay:1.5s;opacity:.22}.vnr2-chat-orb span{font:600 18px -apple-system,BlinkMacSystemFont,sans-serif;letter-spacing:3px;color:rgba(255,255,255,.8)}.vnr2-host-script{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:12px;color:rgba(255,255,255,.62);font-size:14px;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,rgba(255,255,255,.045),transparent 70%)}.vnr2-host-script p{margin:0;white-space:nowrap;animation:vnr2-chat-lyric 9s linear infinite}.vnr2-host-script p:nth-child(3){animation-delay:2s}.vnr2-host-script p:nth-child(4){animation-delay:4s}.vnr2-host-live{font-size:11px;letter-spacing:1px;color:rgba(255,255,255,.9)}.vnr2-chatwrap{height:66%!important;min-height:0!important;background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,.018) 16%,transparent 100%)}@keyframes vnr2-chat-spin{to{transform:rotate(360deg)}}@keyframes vnr2-chat-ring{0%{transform:scale(.82);opacity:.72}100%{transform:scale(1.12);opacity:0}}@keyframes vnr2-chat-breathe{0%,100%{transform:scale(.98)}50%{transform:scale(1.045)}}@keyframes vnr2-chat-lyric{0%,18%{transform:translateY(5px);opacity:.25}35%,68%{transform:translateY(0);opacity:.9}85%,100%{transform:translateY(-8px);opacity:.2}}" +

        '.vnr2-shell,.vnr2-shell *{box-sizing:border-box;letter-spacing:0;font-family:-apple-system,BlinkMacSystemFont,"SF Pro","SF Pro Display","PingFang SC","Segoe UI",sans-serif;-webkit-tap-highlight-color:transparent}' +

        '.vnr2-shell{position:fixed;left:0;top:0;width:0;height:0;z-index:2147483645;color:#fff;user-select:none}' +

        '.vnr2-orb{position:fixed;width:' + ORB + 'px;height:' + ORB + 'px;border-radius:20px;cursor:pointer;background:rgba(255,255,255,.10);border:.5px solid rgba(255,255,255,.28);box-shadow:0 10px 26px rgba(0,0,0,.25),inset 1.5px 2px 4px rgba(255,255,255,.34),inset -2px -3px 6px rgba(0,0,0,.14);display:flex;align-items:center;justify-content:center;transition:transform .2s cubic-bezier(.34,1.4,.5,1),opacity .18s;isolation:isolate}' +

        '.vnr2-orb:active{transform:scale(.93)}' +

        '.vnr2-orb svg{width:26px;height:26px;color:rgba(255,255,255,.92);filter:drop-shadow(0 1px 2px rgba(0,0,0,.25))}' +

        '.vnr2-bar{position:fixed;width:' + BAR_W + 'px;height:' + BAR_H + 'px;border-radius:50px;background:rgba(255,255,255,.10);border:.5px solid rgba(255,255,255,.24);box-shadow:0 16px 40px rgba(0,0,0,.28),inset 1.5px 2px 4px rgba(255,255,255,.20),inset -2px -4px 8px rgba(0,0,0,.12);overflow:visible;isolation:isolate;transition:opacity .2s,transform .26s cubic-bezier(.2,.9,.25,1)}' +

        '.vnr2-bar.snapped{box-shadow:0 10px 30px rgba(0,0,0,.24),inset 1.5px 2px 4px rgba(255,255,255,.20),inset -2px -4px 8px rgba(0,0,0,.12),0 0 0 1px rgba(255,255,255,.12)}' +

        '.vnr2-bbtn{position:absolute;z-index:6;box-sizing:border-box;border:none;background:transparent;color:rgba(255,255,255,.92);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;line-height:1;overflow:visible;transition:transform .12s,opacity .15s}' +

        '.vnr2-bbtn:active{transform:scale(.88)}' +

        '.vnr2-bbtn svg{filter:drop-shadow(0 1px 2px rgba(0,0,0,.28))}' +

        '.vnr2-alb{position:absolute;left:180px;top:12px;width:35px;height:34px;border-radius:6px;overflow:hidden;background:rgba(255,255,255,.12);box-shadow:0 2px 8px rgba(0,0,0,.25)}' +

        '.vnr2-alb img{width:100%;height:100%;object-fit:cover;display:block}' +

        '.vnr2-alb .glz{position:absolute;inset:0;border-radius:6px;pointer-events:none;background:rgba(255,255,255,.08);box-shadow:inset 1px 1px 2px rgba(255,255,255,.35),inset -1px -1.5px 3px rgba(0,0,0,.18)}' +

        '.vnr2-t1{position:absolute;left:225px;top:11px;width:112px;height:18px;font-size:14.4px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:18px;text-shadow:0 1px 2px rgba(0,0,0,.3)}' +

        '.vnr2-t2{position:absolute;left:225px;top:30px;width:112px;height:16px;font-size:11.9px;color:#c9c9c9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:15px;text-shadow:0 1px 2px rgba(0,0,0,.3)}' +

        '.vnr2-t1.marq span,.vnr2-t2.marq span{display:inline-block;padding-right:36px;animation:vnr2marq 9s linear infinite}' +

        '@keyframes vnr2marq{0%{transform:translateX(0)}12%{transform:translateX(0)}100%{transform:translateX(-100%)}}' +

        '.vnr2-drag{position:absolute;left:172px;top:6px;width:164px;height:49px;border-radius:12px;cursor:pointer}' +

        '.vnr2-drag.holding{background:rgba(255,255,255,.06)}' +

        '.vnr2-rec-ring{position:absolute;inset:-4px;border-radius:inherit;border:1.5px solid rgba(255,120,120,.85);animation:vnr2pulse 1s ease-in-out infinite;pointer-events:none}' +

        '@keyframes vnr2pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.06)}}' +

        '.vnr2-pop{position:fixed;min-width:250px;max-width:320px;max-height:330px;border-radius:22px;background:rgba(255,255,255,.10);border:.5px solid rgba(255,255,255,.24);box-shadow:0 18px 46px rgba(0,0,0,.30),inset 1px 1.5px 3px rgba(255,255,255,.28);padding:12px;z-index:2147483646;overflow:auto;scrollbar-width:thin;backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%)}' +

        '.vnr2-pop-title{font-size:12px;font-weight:700;color:rgba(255,255,255,.78);margin:2px 4px 8px}' +

        '.vnr2-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;min-height:38px;padding:5px 4px;border-top:.5px solid rgba(255,255,255,.08)}' +

        '.vnr2-row:first-of-type{border-top:none}' +

        '.vnr2-rt{font-size:12.5px;color:rgba(255,255,255,.92);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 2px rgba(0,0,0,.25)}' +

        '.vnr2-rs{margin-top:2px;font-size:11px;color:rgba(255,255,255,.48);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +

        '.vnr2-ops{display:flex;gap:4px;align-items:center}' +

        '.vnr2-ic{width:26px;height:26px;min-width:26px;border:none;background:none;color:rgba(255,255,255,.62);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .12s}' +

        '.vnr2-ic svg{width:16px;height:16px}.vnr2-ic:active{transform:scale(.9)}.vnr2-ic:hover{color:rgba(255,255,255,.9)}.vnr2-ic.on{background:none;color:#fff}' +

        '.vnr2-empty{font-size:12px;color:rgba(255,255,255,.42);padding:10px 4px;line-height:1.6}';



    function _lyrStyle() {

        var v = cfg.lyricsStyle || 'fume';

        return (v === 'scroll' || v === 'lumi' || v === 'stack' || v === 'fume') ? v : 'fume';

    }

    /* 渲染歌词行（folia 风格动画：fume 浮名 / lumi 流光 / stack 云阶 / scroll 滚动） */

    function renderLyrLines(host, lrc, t, opts) {

        opts = opts || {};

        var style = opts.style || _lyrStyle();

        var count = opts.count || 6;

        host.className = (opts.baseCls || '') + ' ly-' + style;

        var lines = (lrc && lrc.lines) || [];

        if (!lines.length) {

            if (host.__lyKey !== 'empty') {

                host.__lyKey = 'empty';

                host.innerHTML = '';

                if (opts.fallback) {

                    var d0 = TOPDOC.createElement('div');

                    d0.className = 'vnr2-ly cur';

                    d0.textContent = opts.fallback;

                    host.appendChild(d0);

                }

            }

            return;

        }

        var idx = _lrcLineAt(lines, t);

        var start = Math.max(0, (idx < 0 ? 0 : idx) - 1);

        var key = style + ':' + start + ':' + idx + ':' + lines.length;

        if (host.__lyKey !== key) {

            host.__lyKey = key;

            host.innerHTML = '';

            for (var i = start; i < Math.min(lines.length, start + count); i++) {

                var d = TOPDOC.createElement('div');

                d.className = 'vnr2-ly' + (i === idx ? ' cur' : (Math.abs(i - idx) === 1 ? ' near' : ''));

                d.textContent = lines[i].text;

                host.appendChild(d);

            }

        }

        if (style === 'lumi' && idx >= 0) {

            var cur = host.querySelector('.vnr2-ly.cur');

            if (cur) {

                var t0 = lines[idx].t,

                    t1 = (lines[idx + 1] ? lines[idx + 1].t : t0 + 6);

                var p = Math.round(_clamp((t - t0) / Math.max(.5, t1 - t0), 0, 1) * 100);

                cur.style.backgroundImage = 'linear-gradient(90deg,#fff ' + p + '%,rgba(255,255,255,.38) ' + p + '%)';

            }

        }

    }

    /* 主线（外部）语音检测：hook TOP.Audio + 扫描 DOM 音频 */

    function _installAudioHook() {

        try {

            if (TOP.__vnrAudioHookV2) return;

            var OA = TOP.__vnrAudioNative || TOP.Audio;

            if (!OA) return;

            var list = TOP.__vnrAudioList = TOP.__vnrAudioList || [];

            var W = function(src) {

                var a = (src === undefined) ? new OA() : new OA(src);

                try {

                    list.push(a);

                    if (list.length > 50) list.shift();

                    a.addEventListener('play', function() {

                        try {

                            TOP.__vnrOnAnyPlay && TOP.__vnrOnAnyPlay(a);

                        } catch (e) {}

                    });

                } catch (e) {}

                return a;

            };

            W.prototype = OA.prototype;

            TOP.__vnrAudioNative = OA;

            TOP.Audio = W;

            TOP.__vnrAudioHooked = true;

            TOP.__vnrAudioHookV2 = true;

            try {

                TOPDOC.addEventListener('play', function(ev) {

                    try {

                        TOP.__vnrOnAnyPlay && TOP.__vnrOnAnyPlay(ev.target);

                    } catch (e) {}

                }, true);

            } catch (e) {}

        } catch (e) {}

    }



    function _isOurAudio(a) {

        if (a === eng.music || a === eng.voice || a === eng._chatAudio) return true;

        try { var vz=eng._orbViz&&eng._orbViz.cap||{}; for(var k in vz) if(vz[k]&&vz[k].clone===a) return true; } catch(e) {}

        return false;

    }



    function _audioPlaying(a) {

        try {

            return !!(a && !a.paused && !a.ended && !a.muted && a.volume > 0.01 && (a.duration === undefined || isNaN(a.duration) || a.currentTime < a.duration));

        } catch (e) {

            return false;

        }

    }



    function _extVoiceActive() {

        var list = TOP.__vnrAudioList || [];

        for (var i = 0; i < list.length; i++) {

            if (!_isOurAudio(list[i]) && _audioPlaying(list[i])) return true;

        }

        try {

            var doms = TOPDOC.querySelectorAll('audio,video');

            for (var j = 0; j < doms.length; j++) {

                if (!_isOurAudio(doms[j]) && _audioPlaying(doms[j])) return true;

            }

        } catch (e) {}

        return false;

    }



var CSS_FIX = '.vnr2-chat-fm{overflow:visible!important;border-bottom:0!important;margin-bottom:-1px!important;padding-bottom:0!important;background:linear-gradient(180deg,rgba(255,255,255,.025),rgba(255,255,255,0) 100%)!important}.vnr2-chatwrap{margin-top:-24px!important;padding-top:28px!important;background:linear-gradient(180deg,rgba(20,23,30,0),rgba(20,23,30,.5) 28%,rgba(20,23,30,.78) 100%)!important;position:relative;z-index:2}.loader-wrapper{position:relative;display:flex;align-items:center;justify-content:center;width:180px;height:180px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:1.05em;font-weight:500;color:rgba(255,255,255,.86);border-radius:50%;background:transparent;user-select:none;z-index:2}.loader{position:absolute;inset:0;width:100%;aspect-ratio:1/1;border-radius:50%;background:transparent;animation:loader-rotate 2s linear infinite;z-index:0;box-shadow:0 10px 20px 0 rgba(255,255,255,.78) inset,0 20px 30px 0 rgba(176,190,214,.42) inset,0 60px 60px 0 rgba(21,27,40,.96) inset}.loader-letter{display:inline-block;opacity:.56;transform:translateY(0);animation:loader-letter-anim 2s infinite;z-index:1;border-radius:50ch;border:0;text-shadow:0 1px 7px rgba(0,0,0,.8)}.loader-letter:nth-child(2){animation-delay:.1s}.loader-letter:nth-child(3){animation-delay:.2s}.loader-letter:nth-child(4){animation-delay:.3s}.loader-letter:nth-child(5){animation-delay:.4s}.loader-letter:nth-child(6){animation-delay:.5s}.loader-letter:nth-child(7){animation-delay:.6s}.loader-letter:nth-child(8){animation-delay:.7s}.loader-letter:nth-child(9){animation-delay:.8s}.loader-letter:nth-child(10){animation-delay:.9s}@keyframes loader-rotate{0%{transform:rotate(90deg);filter:brightness(.9)}50%{transform:rotate(270deg);filter:brightness(1.18)}100%{transform:rotate(450deg);filter:brightness(.9)}}@keyframes loader-letter-anim{0%,100%{opacity:.42;transform:translateY(0)}20%{opacity:1;transform:scale(1.15)}40%{opacity:.7;transform:translateY(0)}}.vnr2-orb-core{display:none!important}.vnr2-chat-orb{overflow:visible!important;z-index:3}.vnr2-script-line.current{background:linear-gradient(100deg,rgba(109,125,151,.24),rgba(255,255,255,.06))!important;color:rgba(255,255,255,.96)!important}.vnr2-chat-orb{width:250px!important;height:250px!important;flex:0 0 250px!important;overflow:visible!important;background:transparent!important;box-shadow:none!important}.vnr2-orb-spectrum{position:absolute;inset:-35px;width:320px;height:320px;pointer-events:none;z-index:0}.loader-wrapper{z-index:2}.vnr2-script-list{position:relative;display:flex;flex:1;min-height:0;overflow:auto;flex-direction:column;justify-content:center;gap:5px;padding:4px 8px 6px 22px;mask-image:linear-gradient(180deg,transparent,#000 12%,#000 86%,transparent)}.vnr2-script-list:before{content:"";position:absolute;left:10px;top:8px;bottom:8px;width:1px;background:linear-gradient(transparent,rgba(255,255,255,.12),transparent)}.vnr2-script-line{position:relative;width:100%;border:0;background:transparent;color:rgba(255,255,255,.28);font:400 13px/1.55 -apple-system,BlinkMacSystemFont,sans-serif;cursor:pointer;text-align:left;padding:7px 13px;border-radius:14px}.vnr2-script-line.current{color:rgba(255,255,255,.96);font-size:15px;background:linear-gradient(100deg,rgba(109,125,151,.24),rgba(255,255,255,.06));border:1px solid rgba(255,255,255,.11)}'

    var CSS3 = '' +

        '.vnr2-studio{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:2147483645}' +

        '.vnr2-stage{position:relative;width:1720px;height:800px;pointer-events:none;transform-origin:center center}' +

        '.vnr2-center{position:absolute;left:358px;top:75px;width:1004px;height:650px;pointer-events:auto;z-index:5}' +

        '.vnr2-sidebar{position:absolute;left:0;top:0;width:237px;height:650px;border-radius:24px 0 0 24px;background:rgba(0,0,0,.10);box-shadow:0 8px 6px rgba(0,0,0,.05),inset 1px -1px 1px rgba(255,255,255,.15);backdrop-filter:blur(50px);-webkit-backdrop-filter:blur(50px);padding:20px 0;display:flex;flex-direction:column;gap:26px;overflow:hidden}' +

        '.vnr2-main{position:absolute;left:237px;top:0;right:0;height:650px;border-radius:0 24px 24px 0;background:rgba(255,255,255,.04);box-shadow:0 8px 6px rgba(0,0,0,.05),inset -1px 0 4px rgba(255,255,255,.15);backdrop-filter:blur(50px);-webkit-backdrop-filter:blur(50px);padding:20px 30px 34px 20px;display:flex;flex-direction:column;gap:16px;overflow:hidden}' +

        '.vnr2-sb-head{display:flex;align-items:flex-start;justify-content:space-between;padding:0 20px}' +

        '.vnr2-h1{font-size:24px;font-weight:700;color:#fff;line-height:1.15}' +

        '.vnr2-h1s{margin-top:4px;font-size:14px;color:rgba(255,255,255,.64)}' +

        '.vnr2-mini30{width:30px;height:30px;min-width:30px;border:none;border-radius:15px;background:rgba(255,255,255,.10);color:rgba(255,255,255,.9);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .12s}' +

        '.vnr2-mini30 svg{width:16px;height:16px}.vnr2-mini30:active{transform:scale(.9)}.vnr2-mini30.on{background:rgba(255,255,255,.26)}' +

        '.vnr2-nav{display:flex;flex-direction:column;gap:4px;padding:0 10px}' +

        '.vnr2-nav-it{position:relative;display:flex;gap:16px;align-items:center;height:44px;padding:0 10px;border-radius:12px;cursor:pointer;color:#fff;font-size:14px;transition:background .15s}' +

        '.vnr2-nav-it svg{width:22px;height:22px;color:rgba(255,255,255,.88)}' +

        '.vnr2-nav-it.on{background:rgba(255,255,255,.10)}' +

        '.vnr2-nav-it:hover{background:rgba(255,255,255,.06)}' +

        '.vnr2-sec{font-size:18px;font-weight:600;color:#fff;padding:0 20px;display:flex;align-items:center;justify-content:space-between}' +

        '.vnr2-main-head{display:flex;align-items:flex-start;justify-content:space-between}' +

        '.vnr2-status-row{height:36px;border-radius:10px;background:rgba(0,0,0,.14);box-shadow:inset 0 -1px 2px rgba(255,255,255,.14);display:flex;align-items:center;gap:6px;padding:0 10px;font-size:14px;color:rgba(255,255,255,.74);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:none}' +

        '.vnr2-chatwrap{flex:1;min-height:0;display:flex;flex-direction:column;gap:12px}' +

        '.vnr2-chat{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:14px;padding:6px 8px 6px 2px;scrollbar-width:thin}' +

        '.vnr2-mrow{display:flex;flex-direction:column;gap:5px;max-width:82%}' +

        '.vnr2-mrow.user{align-self:flex-end;align-items:flex-end}' +

        '.vnr2-mrow.ai{align-self:flex-start;align-items:flex-start}' +

        '.vnr2-mhead{display:flex;gap:8px;align-items:center;font-size:11px;color:rgba(255,255,255,.45);padding:0 4px}' +

        '.vnr2-ava{width:26px;height:26px;border-radius:50%;object-fit:cover;background:rgba(255,255,255,.12);box-shadow:0 1px 4px rgba(0,0,0,.3)}' +

        '.vnr2-ava-l{display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:rgba(255,255,255,.88);border:.5px solid rgba(255,255,255,.22);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);text-shadow:0 1px 2px rgba(0,0,0,.3)}' +

        '.vnr2-chat .vnr2-empty{margin:auto;text-align:center;max-width:340px}' +

        '.vnr2-bub{padding:9px 13px;border-radius:17px;background:rgba(255,255,255,.08);border:.5px solid rgba(255,255,255,.13);box-shadow:inset 0 1px 0 rgba(255,255,255,.12);font-size:13px;line-height:1.55;color:rgba(255,255,255,.92);white-space:pre-wrap;word-break:break-word}' +

        '.vnr2-mrow.user .vnr2-bub{background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.2)}' +

        '.vnr2-trc{margin-top:4px;font-size:11px;color:rgba(255,255,255,.5);cursor:pointer;display:inline-block;padding:2px 8px;border-radius:8px;background:rgba(255,255,255,.06)}' +

        '.vnr2-trx{margin-top:5px;font-size:12px;color:rgba(255,255,255,.6);border-top:.5px dashed rgba(255,255,255,.15);padding-top:5px;display:none}' +

        '.vnr2-bub.tr-open .vnr2-trx{display:block}' +

        '.vnr2-vbar{display:flex;gap:3px;align-items:center;height:24px;padding:0 12px;border-radius:12px;background:rgba(118,118,128,.22);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);cursor:pointer;min-width:58px;justify-content:center;transition:background .15s}' +

        '.vnr2-vbar:hover{background:rgba(118,118,128,.34)}' +

        '.vnr2-vbar i{width:2.5px;border-radius:2px;background:rgba(255,255,255,.85)}' +

        '.vnr2-vbar i:nth-child(1){height:7px}.vnr2-vbar i:nth-child(2){height:12px}.vnr2-vbar i:nth-child(3){height:16px}.vnr2-vbar i:nth-child(4){height:10px}.vnr2-vbar i:nth-child(5){height:13px}' +

        '.vnr2-vbar.live i{animation:vnr2eq .8s ease-in-out infinite alternate}' +

        '.vnr2-vbar.live i:nth-child(2){animation-delay:.15s}.vnr2-vbar.live i:nth-child(3){animation-delay:.3s}.vnr2-vbar.live i:nth-child(4){animation-delay:.45s}.vnr2-vbar.live i:nth-child(5){animation-delay:.6s}' +

        '@keyframes vnr2eq{from{height:4px}to{height:15px}}' +

        '.vnr2-mops{display:flex;gap:4px;opacity:0;transition:opacity .15s}' +

        '.vnr2-memhost{flex:none;display:flex;flex-direction:column;gap:8px}.vnr2-memtop{flex:none;display:flex;justify-content:flex-end;align-items:center;margin:-2px 4px -2px 0}.vnr2-memgear{width:28px;height:28px;border:none;border-radius:14px;background:rgba(118,118,128,.16);color:rgba(255,255,255,.46);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .15s,color .15s,transform .12s}.vnr2-memgear:hover{background:rgba(118,118,128,.24);color:rgba(255,255,255,.72)}.vnr2-memgear:active{transform:scale(.92)}.vnr2-memgear svg{width:15px;height:15px}.vnr2-mempanel{flex:none;border-radius:18px;background:rgba(118,118,128,.18);border:.5px solid rgba(255,255,255,.10);box-shadow:inset 0 1px 0 rgba(255,255,255,.08);padding:10px 12px;display:flex;flex-direction:column;gap:8px}.vnr2-memrow{display:flex;align-items:center;justify-content:space-between;gap:8px}.vnr2-memttl{font-size:12px;font-weight:700;color:rgba(255,255,255,.76)}.vnr2-memhint{font-size:11px;color:rgba(255,255,255,.40)}.vnr2-memta{width:100%;min-height:86px;border-radius:12px;border:.5px solid rgba(255,255,255,.12);background:rgba(0,0,0,.18);color:rgba(255,255,255,.88);font-size:12px;line-height:1.55;padding:9px 10px;outline:none;resize:vertical;font-family:inherit}.vnr2-membtns{display:flex;justify-content:flex-end;gap:6px}.vnr2-membtn{border:none;border-radius:14px;background:rgba(255,255,255,.10);color:rgba(255,255,255,.72);font-size:11px;padding:6px 10px;cursor:pointer}.vnr2-membtn.strong{background:rgba(255,255,255,.18);color:rgba(255,255,255,.9)}' +

        '.vnr2-mrow:hover .vnr2-mops{opacity:1}' +

        '.vnr2-input-row{flex:none;display:flex;gap:10px;align-items:flex-end}' +

        '.vnr2-inp{flex:1;min-height:44px;max-height:120px;border-radius:22px;border:.5px solid rgba(255,255,255,.09);background:rgba(118,118,128,.20);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);color:#fff;font-size:14px;line-height:1.45;padding:12px 16px;outline:none;resize:none;font-family:inherit;transition:border-color .15s}' +

        '.vnr2-inp:focus{border-color:rgba(255,255,255,.25)}' +

        '.vnr2-inp::placeholder{color:rgba(255,255,255,.34)}' +

        '.vnr2-cbtn{width:44px;height:44px;min-width:44px;border:none;border-radius:22px;background:rgba(118,118,128,.20);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);color:rgba(255,255,255,.92);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .12s,background .15s}' +

        '.vnr2-cbtn svg{width:20px;height:20px}.vnr2-cbtn:active{transform:scale(.9)}.vnr2-cbtn.rec{background:rgba(255,90,90,.35)}' +

        '.vnr2-cbtn.send{background:rgba(255,255,255,.92);color:#1c1c1e}' +

        '.vnr2-ed{width:100%;min-height:60px;border-radius:12px;border:.5px solid rgba(255,255,255,.2);background:rgba(0,0,0,.25);color:#fff;font-size:13px;line-height:1.5;padding:8px 10px;outline:none;resize:vertical;font-family:inherit}' +

        '.vnr2-bbar{position:absolute;left:250px;top:632px;width:730px;height:76px;border-radius:38px;background:rgba(255,255,255,.14);box-shadow:0 8px 6px rgba(0,0,0,.05),inset 0 -1px 1px rgba(255,255,255,.25),inset 0 1px 1px rgba(255,255,255,.25);backdrop-filter:blur(50px);-webkit-backdrop-filter:blur(50px);display:flex;align-items:center;gap:24px;padding:0 20px;pointer-events:auto}' +

        '.vnr2-bb48{width:48px;height:48px;min-width:48px;border:none;border-radius:24px;background:transparent;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .12s,background .15s}' +

        '.vnr2-bb48 svg{width:26px;height:26px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.25))}.vnr2-bb48:active{transform:scale(.88)}.vnr2-bb48:hover{background:rgba(255,255,255,.08)}.vnr2-bb48.ghost{opacity:.55;cursor:default}' +

        '.vnr2-songcard{position:relative;height:58px;border-radius:10px;background:rgba(0,0,0,.14);display:flex;align-items:center;gap:12px;padding:6px 12px 8px 6px;flex:1;min-width:0;overflow:hidden}' +

        '.vnr2-songcard img{width:44px;height:44px;border-radius:6px;object-fit:cover;background:rgba(255,255,255,.1)}' +

        '.vnr2-sc-t{font-size:16px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +

        '.vnr2-sc-s{margin-top:2px;font-size:13px;color:rgba(255,255,255,.44);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +

        '.vnr2-sc-prog{position:absolute;left:0;bottom:0;height:2px;width:100%;background:rgba(0,0,0,.2)}' +

        '.vnr2-sc-prog i{display:block;height:100%;width:0;background:rgba(255,255,255,.6)}' +

        '.vnr2-card{position:absolute;top:75px;width:300px;height:650px;border-radius:24px;pointer-events:auto;overflow:hidden;background:rgba(15,16,20,.94);border:.5px solid rgba(255,255,255,.14);box-shadow:0 30px 36px -26px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.12);transition:opacity .3s,transform .38s cubic-bezier(.2,.9,.25,1);z-index:1;backface-visibility:hidden;-webkit-backface-visibility:hidden;transform-style:flat}' +

        '.vnr2-card.left{left:12px;transform:perspective(700px) rotateY(20deg);transform-origin:right center}' +

        '.vnr2-card.right{left:1408px;transform:perspective(700px) rotateY(-20deg);transform-origin:left center}' +

        '.vnr2-card.hidden{opacity:0;pointer-events:none}' +

        '.vnr2-card.left.hidden{transform:perspective(700px) rotateY(20deg) translateX(-60px)}' +

        '.vnr2-card.right.hidden{transform:perspective(700px) rotateY(-20deg) translateX(60px)}' +

        '.vnr2-card:after{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:linear-gradient(180deg,rgba(255,255,255,.07),transparent 22%,transparent 62%,rgba(0,0,0,.42) 96%)}' +

        '.vnr2-lc-fog{position:absolute;left:0;right:0;bottom:0;height:54%;pointer-events:none;z-index:1;-webkit-mask-image:linear-gradient(180deg,transparent,#000 46%);mask-image:linear-gradient(180deg,transparent,#000 46%);background:linear-gradient(180deg,transparent,rgba(8,9,12,.55) 48%,rgba(8,9,12,.86))}' +

        '.vnr2-pl-head{position:absolute;top:0;left:0;right:0;z-index:4;display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px}' +

        '.vnr2-pl-title{font-size:16px;font-weight:600;color:#fff}' +

        '.vnr2-pl-cover{position:relative;width:100%;height:346px;overflow:hidden}' +

        '.vnr2-pl-cover img{width:100%;height:100%;object-fit:cover;display:block}' +

        '.vnr2-pl-cover .fade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,9,12,.34) 0%,rgba(8,9,12,.04) 15%,transparent 42%,rgba(15,16,20,.20) 62%,rgba(15,16,20,.70) 84%,rgba(15,16,20,.97) 100%)}' +

        '.vnr2-pl-info{padding:0 20px;margin-top:-70px;position:relative;z-index:2;display:flex;align-items:flex-end;justify-content:space-between;gap:10px}' +

        '.vnr2-pl-alb{font-size:24px;font-weight:700;line-height:1.2;color:#fff;max-width:200px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}' +

        '.vnr2-pl-sub{margin-top:6px;font-size:12px;color:rgba(255,255,255,.55);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px}' +

        '.vnr2-pl-play{width:56px;height:56px;min-width:56px;border:none;border-radius:28px;background:rgba(255,255,255,.14);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 0 rgba(255,255,255,.2)}' +

        '.vnr2-pl-play svg{width:24px;height:24px}' +

        '.vnr2-pl-list{margin-top:14px;padding:6px 16px 16px;overflow:auto;scrollbar-width:thin;position:absolute;top:392px;bottom:0;left:0;right:0}' +

        '.vnr2-pl-it{display:flex;align-items:center;gap:12px;padding:9px 4px;border-radius:10px}' +

        '.vnr2-pl-it:hover{background:rgba(255,255,255,.05)}' +

        '.vnr2-pl-num{width:20px;height:20px;min-width:20px;border-radius:10px;border:1px solid rgba(255,255,255,.35);color:rgba(255,255,255,.8);font-size:10px;display:flex;align-items:center;justify-content:center}' +

        '.vnr2-pl-tx{flex:1;min-width:0}' +

        '.vnr2-pl-t{font-size:13px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +

        '.vnr2-pl-s{margin-top:2px;font-size:11px;color:rgba(255,255,255,.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +

        '.vnr2-lc-bg{position:absolute;inset:0}' +

        '.vnr2-lc-bg img{width:100%;height:100%;object-fit:cover;display:block}' +

        '.vnr2-lc-bg .fade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.32) 0%,transparent 24%,rgba(8,9,12,.30) 52%,rgba(8,9,12,.78) 80%,rgba(8,9,12,.97) 100%)}' +

        '.vnr2-lc-top{position:absolute;top:14px;left:14px;right:14px;display:flex;justify-content:space-between;z-index:2}' +

        '.vnr2-lc-lyr{position:absolute;left:20px;right:20px;bottom:96px;max-height:200px;overflow:hidden;z-index:2;display:flex;flex-direction:column;gap:8px;font-size:14px;font-weight:600;line-height:1.5;color:rgba(255,255,255,.55);text-shadow:0 1px 3px rgba(0,0,0,.5)}' +

        '.vnr2-lc-lyr .cur{color:#fff;font-size:15px}' +

        '.vnr2-lc-foot{position:absolute;left:16px;right:16px;bottom:16px;z-index:2;display:flex;align-items:center;gap:10px}' +

        '.vnr2-lc-foot img{width:40px;height:40px;border-radius:8px;object-fit:cover;background:rgba(255,255,255,.15)}' +

        '.vnr2-next{border:none;border-radius:18px;background:rgba(255,255,255,.16);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:#fff;font-size:12px;font-weight:700;padding:9px 14px;cursor:pointer;display:flex;gap:6px;align-items:center}' +

        '.vnr2-next svg{width:16px;height:16px}' +

        '.vnr2-set{flex:1;min-height:0;overflow:auto;scrollbar-width:thin;display:flex;flex-direction:column;gap:14px;padding-right:6px}' +

        '.vnr2-set-g{border-radius:16px;background:rgba(255,255,255,.05);border:.5px solid rgba(255,255,255,.10);box-shadow:inset 0 1px 0 rgba(255,255,255,.08);padding:4px 14px}' +

        '.vnr2-set-gt{font-size:12px;font-weight:700;color:rgba(255,255,255,.55);padding:10px 2px 4px;text-transform:uppercase;letter-spacing:.6px}' +

        '.vnr2-set-r{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:44px;padding:6px 2px;border-top:.5px solid rgba(255,255,255,.07)}' +

        '.vnr2-set-r:first-of-type,.vnr2-set-gt+.vnr2-set-r{border-top:none}' +

        '.vnr2-set-l{font-size:13px;color:rgba(255,255,255,.9);flex:1;min-width:0;line-height:1.4}' +

        '.vnr2-sw{position:relative;width:46px;height:28px;min-width:46px;border-radius:14px;background:rgba(120,120,128,.32);border:none;cursor:pointer;transition:background .2s;padding:0}' +

        '.vnr2-sw i{position:absolute;top:2px;left:2px;width:24px;height:24px;border-radius:12px;background:#fff;box-shadow:0 2px 5px rgba(0,0,0,.3);transition:left .2s}' +

        '.vnr2-sw.on{background:rgba(255,255,255,.65)}.vnr2-sw.on i{left:20px}' +

        '.vnr2-set-inp{width:120px;border-radius:10px;border:.5px solid rgba(255,255,255,.16);background:rgba(0,0,0,.2);color:#fff;font-size:13px;padding:7px 10px;outline:none;font-family:inherit}' +

        '.vnr2-set-inp.wide{width:100%}' +

        'select.vnr2-set-inp{-webkit-appearance:none;appearance:none}' +

        'select.vnr2-set-inp option{color:#111;background:#fff}' +

        '.vnr2-set-ta{width:100%;min-height:90px;border-radius:12px;border:.5px solid rgba(255,255,255,.14);background:rgba(0,0,0,.22);color:#fff;font-size:12px;line-height:1.55;padding:9px 11px;outline:none;resize:vertical;font-family:inherit;margin:4px 0 10px}' +

        '.vnr2-danger{width:100%;border:none;border-radius:14px;background:rgba(255,70,70,.22);border:.5px solid rgba(255,120,120,.35);color:#ffb4b4;font-size:13px;font-weight:600;padding:12px;cursor:pointer;margin:4px 0 20px}' +

        '.vnr2-host-script{min-width:0!important;max-width:100%!important;overflow:hidden!important;padding:8px 0!important}.vnr2-host-live{position:relative!important;z-index:2!important;margin:0 0 4px!important}.vnr2-script-list{width:100%!important;box-sizing:border-box!important;overflow-x:hidden!important;overflow-y:auto!important;scrollbar-width:thin!important;justify-content:flex-start!important;padding:42px 8px 42px 14px!important}.vnr2-script-line{box-sizing:border-box!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:break-word!important;text-align:center!important;flex:0 0 auto!important;max-width:100%!important;opacity:.34;transition:opacity .25s,transform .25s,background .25s!important}.vnr2-script-line.current{opacity:1!important;transform:scale(1.02)!important}.vnr2-chat-fm{min-width:0!important;overflow:hidden!important}.vnr2-chatwrap{min-width:0!important;overflow:hidden!important}.vnr2-host-script{flex:1!important;width:0!important;min-width:0!important;max-width:calc(100% - 280px)!important;box-sizing:border-box!important;overflow:hidden!important;padding:10px 12px!important}.vnr2-host-live{width:100%!important;box-sizing:border-box!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;text-align:center!important}.vnr2-script-list{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow-x:hidden!important}.vnr2-script-line{display:block!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;white-space:normal!important;overflow:hidden!important;overflow-wrap:anywhere!important;word-break:break-word!important;line-height:1.45!important;max-height:4.35em!important;text-overflow:ellipsis!important}.vnr2-search-view{height:100%;overflow:auto;padding:6px 4px 22px}.vnr2-search-hero{position:relative;padding:24px 24px 22px;border:1px solid rgba(255,255,255,.10);border-radius:26px;background:radial-gradient(circle at 85% 10%,rgba(150,175,220,.16),transparent 42%),linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.025));box-shadow:inset 0 1px rgba(255,255,255,.10),0 16px 36px rgba(0,0,0,.18)}.vnr2-search-eyebrow{font-size:10px;letter-spacing:2.4px;color:rgba(205,220,245,.48);margin-bottom:5px}.vnr2-search-title{font-size:28px;font-weight:700;letter-spacing:-.6px;color:#fff}.vnr2-search-sub{font-size:12px;color:rgba(255,255,255,.45);margin-top:4px}.vnr2-search-row{display:flex;align-items:center;margin-top:20px;padding:5px 5px 5px 17px;border:1px solid rgba(255,255,255,.13);border-radius:18px;background:rgba(8,11,18,.34);box-shadow:inset 0 1px rgba(255,255,255,.06)}.vnr2-search-input{flex:1;min-width:0;border:0!important;outline:0!important;background:transparent!important;color:#fff!important;font:500 14px -apple-system,BlinkMacSystemFont,sans-serif;padding:9px 0!important}.vnr2-search-input::placeholder{color:rgba(255,255,255,.30)}.vnr2-search-submit{display:grid;place-items:center;width:42px;height:42px;border:0;border-radius:14px;background:rgba(238,242,250,.94);color:#171a20;cursor:pointer;box-shadow:0 8px 20px rgba(0,0,0,.22)}.vnr2-search-submit svg{width:18px;height:18px}.vnr2-search-results{display:flex;flex-direction:column;gap:8px;margin-top:14px}.vnr2-search-card{display:flex;align-items:center;gap:13px;min-width:0;padding:11px 12px;border:1px solid rgba(255,255,255,.075);border-radius:18px;background:rgba(255,255,255,.035);transition:.18s ease}.vnr2-search-card:hover{background:rgba(255,255,255,.07);transform:translateY(-1px)}.vnr2-search-num{width:27px;color:rgba(255,255,255,.24);font:600 10px/1 ui-monospace,monospace;letter-spacing:1px}.vnr2-search-main{flex:1;min-width:0}.vnr2-search-song{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(255,255,255,.91);font-size:13px;font-weight:600}.vnr2-search-artist{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(255,255,255,.38);font-size:10px;margin-top:3px}.vnr2-search-actions{display:flex;gap:7px}.vnr2-search-iconbtn{display:grid;place-items:center;width:34px;height:34px;border:1px solid rgba(255,255,255,.11);border-radius:50%;background:rgba(255,255,255,.055);color:rgba(255,255,255,.7);cursor:pointer}.vnr2-search-iconbtn.primary{background:rgba(235,240,249,.92);color:#171a20}.vnr2-search-iconbtn svg{width:14px;height:14px}.vnr2-search-state{padding:48px 20px;text-align:center;color:rgba(255,255,255,.34);font-size:12px}@media(max-width:900px){.vnr2-host-script{max-width:calc(100% - 220px)!important}.vnr2-chat-orb{width:190px!important;height:190px!important;flex-basis:190px!important}.vnr2-orb-spectrum{width:250px!important;height:250px!important;inset:-30px!important}}.vnr2-history-view{box-sizing:border-box!important;padding:6px 4px 22px!important}.vnr2-history-view-head{position:relative!important;padding:22px 22px 18px!important;margin-bottom:14px!important;border:1px solid rgba(255,255,255,.10)!important;border-radius:25px!important;background:radial-gradient(circle at 88% 0,rgba(150,175,220,.14),transparent 42%),linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.025))!important;box-shadow:inset 0 1px rgba(255,255,255,.10),0 14px 32px rgba(0,0,0,.16)!important}.vnr2-history-view-head>.vnr2-h1{font-size:27px!important;letter-spacing:-.5px!important}.vnr2-history-view-head>.vnr2-h1s{color:rgba(255,255,255,.42)!important;margin-top:4px!important}.vnr2-history-tools{display:flex!important;align-items:center!important;gap:8px!important;margin-top:17px!important}.vnr2-history-limit-label{display:flex!important;align-items:center!important;gap:8px!important;color:rgba(255,255,255,.42)!important;font-size:10px!important}.vnr2-history-limit{width:58px!important;box-sizing:border-box!important;border:1px solid rgba(255,255,255,.11)!important;border-radius:12px!important;background:rgba(7,10,16,.28)!important;color:#fff!important;padding:7px 8px!important;outline:none!important}.vnr2-history-clear{margin-left:auto!important;border:1px solid rgba(255,255,255,.11)!important;border-radius:13px!important;background:rgba(255,255,255,.055)!important;color:rgba(255,255,255,.62)!important;padding:8px 12px!important;cursor:pointer!important}.vnr2-history-view .vnr2-history-list{gap:8px!important}.vnr2-history-view .vnr2-history-row{min-width:0!important;padding:11px 12px!important;border-radius:18px!important;background:rgba(255,255,255,.035)!important;border-color:rgba(255,255,255,.075)!important;transition:.18s ease!important}.vnr2-history-view .vnr2-history-row:hover{background:rgba(255,255,255,.07)!important;transform:translateY(-1px)!important}.vnr2-history-view .vnr2-history-btn{display:grid!important;place-items:center!important;min-width:34px!important;height:34px!important;box-sizing:border-box!important;border-radius:17px!important;padding:0 10px!important;background:rgba(255,255,255,.06)!important}.vnr2-history-view .vnr2-history-btn:last-child{background:rgba(235,240,249,.92)!important;color:#171a20!important}.vnr2-search-hero{padding:18px!important}.vnr2-search-row{margin-top:0!important}.vnr2-history-view-head{padding:16px 18px!important}.vnr2-history-tools{margin-top:0!important}.vnr2-script-list{display:contents!important}.vnr2-script-line{width:auto!important;max-width:100%!important;margin:0!important;padding:0!important;border:0!important;background:transparent!important;border-radius:0!important;white-space:normal!important;overflow:hidden!important;text-overflow:ellipsis!important;word-break:break-word!important;cursor:pointer!important;font:400 14px/1.55 -apple-system,BlinkMacSystemFont,sans-serif!important;color:rgba(255,255,255,.62)!important;animation:vnr2-chat-lyric 9s linear infinite!important;transform:none!important;opacity:inherit!important}.vnr2-script-line:nth-child(2){animation-delay:2s!important}.vnr2-script-line:nth-child(3){animation-delay:4s!important}.vnr2-script-line.current{color:rgba(255,255,255,.92)!important;font-weight:500!important;background:transparent!important;border:0!important;transform:none!important;opacity:inherit!important}.vnr2-host-script{gap:12px!important;justify-content:center!important;align-items:center!important}.vnr2-host-live{font-size:11px!important;letter-spacing:1px!important;color:rgba(255,255,255,.9)!important}.vnr2-script-list{display:contents!important}.vnr2-script-line{animation:vnr2-chat-lyric 9s linear infinite!important}.vnr2-host-script>.vnr2-script-list>.vnr2-script-line:nth-child(1){animation-delay:0s!important}.vnr2-host-script>.vnr2-script-list>.vnr2-script-line:nth-child(2){animation-delay:2s!important}.vnr2-host-script>.vnr2-script-list>.vnr2-script-line:nth-child(3){animation-delay:4s!important}.vnr2-host-script>.vnr2-script-list>.vnr2-script-line:nth-child(4){animation-delay:6s!important}.vnr2-host-script>.vnr2-script-line{animation-delay:0s!important}.vnr2-host-script{gap:12px!important}.vnr2-script-line.current{font-weight:500!important;color:rgba(255,255,255,.92)!important}.vnr2-host-script>.vnr2-script-line{display:block!important;width:auto!important;max-width:100%!important}.vnr2-host-script>.vnr2-script-list{display:contents!important}.vnr2-host-script{overflow:hidden!important}.vnr2-host-script>.vnr2-script-line.current{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important}@media(max-width:760px){.vnr2-bar{width:min(' + BAR_W + 'px,calc(100vw - 16px))}}';



    var CSSX = '.vnr2-pop{z-index:2147483647!important}.vnr2-chatpop{width:340px;max-height:440px;display:flex;flex-direction:column;gap:8px}.vnr2-chatpop .cp-list{max-height:310px;overflow:auto;display:flex;flex-direction:column;gap:8px;padding:2px;scrollbar-width:thin}.vnr2-chatpop .vnr2-bub{font-size:12px;padding:7px 10px;border-radius:14px}.vnr2-chatpop .cp-row{display:flex;gap:6px;align-items:flex-end}.vnr2-chatpop .cp-inp{flex:1;min-height:34px;max-height:80px;border-radius:17px;border:.5px solid rgba(255,255,255,.09);background:rgba(118,118,128,.22);color:#fff;font-size:12px;line-height:1.4;padding:8px 12px;outline:none;resize:none;font-family:inherit}.vnr2-chatpop .cp-btn{width:34px;height:34px;min-width:34px;border:none;border-radius:17px;background:rgba(118,118,128,.22);color:rgba(255,255,255,.9);cursor:pointer;display:flex;align-items:center;justify-content:center}.vnr2-chatpop .cp-btn svg{width:15px;height:15px}.vnr2-chatpop .cp-btn.send{background:rgba(255,255,255,.92);color:#1c1c1e}.vnr2-chatpop .cp-btn.rec{background:rgba(255,90,90,.35)}.vnr2-orb-lyr{position:fixed;z-index:2147483646;width:250px;pointer-events:none;display:flex;flex-direction:column;gap:6px;font-size:14px;font-weight:600;line-height:1.5;color:rgba(255,255,255,.55);text-shadow:0 1px 4px rgba(0,0,0,.7)}.vnr2-ly{transition:opacity .45s ease,filter .45s ease,transform .45s cubic-bezier(.25,.9,.3,1);will-change:transform,opacity}.ly-fume .vnr2-ly{opacity:.34;filter:blur(1.6px);transform:scale(.97);transform-origin:left center}.ly-fume .vnr2-ly.cur{opacity:1;filter:none;transform:scale(1.04);color:#fff}.ly-stack .vnr2-ly{opacity:.25;transform:translateY(6px)}.ly-stack .vnr2-ly.near{opacity:.55;transform:translateY(3px)}.ly-stack .vnr2-ly.cur{opacity:1;transform:translateY(0);color:#fff}.ly-scroll .vnr2-ly{opacity:.5}.ly-scroll .vnr2-ly.cur{opacity:1;color:#fff;font-weight:700}.ly-lumi .vnr2-ly{opacity:.4}.ly-lumi .vnr2-ly.cur{opacity:1;-webkit-background-clip:text;background-clip:text;color:transparent}.vnr2-chat-status{font-size:11px;color:rgba(255,255,255,.45);padding:2px 4px;display:flex;align-items:center;gap:6px}.vnr2-chat-status.loading:before{content:\'\';width:8px;height:8px;border-radius:50%;border:1.5px solid rgba(255,255,255,.3);border-top-color:rgba(255,255,255,.85);animation:vnr2-chat-spin .8s linear infinite;display:inline-block}.vnr2-chat-status.error{color:rgba(255,120,120,.95)}.vnr2-danger{width:100%;border:none;border-radius:14px;background:rgba(255,255,255,.10);border:.5px solid rgba(255,255,255,.22);color:rgba(255,255,255,.85);font-size:13px;font-weight:600;padding:12px;cursor:pointer;margin:4px 0 20px}.vnr2-preset{display:flex;gap:6px;align-items:center;margin:2px 0 10px;flex-wrap:wrap}.vnr2-preset select{flex:1;min-width:110px}.vnr2-pbtn{border:none;border-radius:10px;background:rgba(255,255,255,.10);border:.5px solid rgba(255,255,255,.16);color:rgba(255,255,255,.85);font-size:11px;padding:6px 10px;cursor:pointer;font-family:inherit}.vnr2-pbtn:active{transform:scale(.95)}.vnr2-wbl{display:flex;flex-direction:column;gap:4px;margin:4px 0 10px;max-height:200px;overflow:auto;scrollbar-width:thin}.vnr2-wbi{display:flex;gap:10px;align-items:center;padding:7px 10px;border-radius:10px;background:rgba(255,255,255,.05);cursor:pointer;font-size:12px;color:rgba(255,255,255,.88)}.vnr2-wbi .bx{width:16px;height:16px;min-width:16px;border-radius:5px;border:1.5px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;font-size:10px}.vnr2-wbi.on .bx{background:rgba(255,255,255,.88);color:#111;border-color:transparent}.vnr2-status-row.err{cursor:pointer;color:rgba(255,255,255,.95)}.vnr2-lg{position:relative;isolation:isolate;overflow:hidden;border:none!important;background:var(--lg-tint,transparent)!important;box-shadow:0 calc(8px + var(--g-shadow,0)*.3px) calc(10px + var(--g-shadow,0)*.6px) rgba(0,0,0,calc(var(--g-shadow,0)/200))!important}'+

        '.vnr2-lg::before{content:\'\';position:absolute;inset:0;border-radius:inherit;-webkit-backdrop-filter:var(--lg-bf,blur(1px) saturate(150%) brightness(105%) contrast(100%));backdrop-filter:var(--lg-bf,blur(1px) saturate(150%) brightness(105%) contrast(100%));z-index:0;pointer-events:none}'+

        '.vnr2-lg::after{content:\'\';position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:3;box-shadow:inset 1.5px 1.5px 1px -1px rgba(255,255,255,var(--g-hl,.65)),inset -1px -1px 1px -.5px rgba(255,255,255,calc(var(--g-hl,.65)*.6)),inset 0 0 6px rgba(255,255,255,calc(var(--g-hl,.65)*.25))}'+

        '.vnr2-lg>*{z-index:2}.vnr2-lg.vnr2-lg-nc{overflow:visible}.vnr2-lg.vnr2-lg-nc::before,.vnr2-lg.vnr2-lg-nc::after{border-radius:inherit}' +

        '.vnr2-orb svg{width:34px;height:34px;color:rgba(255,255,255,.38);filter:drop-shadow(0 1.5px 1px rgba(255,255,255,.6)) drop-shadow(0 -1px 2px rgba(0,0,0,.4))}.vnr2-orb-logo{position:relative;width:34px;height:34px;isolation:isolate;flex:none;background:rgba(255,255,255,.001)!important;filter:drop-shadow(0 1px 2px rgba(0,0,0,.30));-webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22%3E%3Cpath d=%22M9.6 17.2V6.6l8-1.8v10.4%22 stroke=%22%23fff%22 stroke-width=%221.7%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 fill=%22none%22/%3E%3Cellipse cx=%227.6%22 cy=%2217.4%22 rx=%222.2%22 ry=%221.8%22 fill=%22%23fff%22/%3E%3Cellipse cx=%2215.6%22 cy=%2215.4%22 rx=%222.2%22 ry=%221.8%22 fill=%22%23fff%22/%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22%3E%3Cpath d=%22M9.6 17.2V6.6l8-1.8v10.4%22 stroke=%22%23fff%22 stroke-width=%221.7%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 fill=%22none%22/%3E%3Cellipse cx=%227.6%22 cy=%2217.4%22 rx=%222.2%22 ry=%221.8%22 fill=%22%23fff%22/%3E%3Cellipse cx=%2215.6%22 cy=%2215.4%22 rx=%222.2%22 ry=%221.8%22 fill=%22%23fff%22/%3E%3C/svg%3E");-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;-webkit-mask-size:contain;mask-size:contain}.vnr2-orb-logo::before{opacity:1!important;background:rgba(255,255,255,.001)!important}.vnr2-orb-logo::after{opacity:1!important;box-shadow:inset 1.5px 2px calc(2.2px + var(--g-hl, .85)*3.8px) rgba(255,255,255,.9),inset -2px -3px 5px rgba(0,0,0,.18)!important}.ly-plain .vnr2-ly{filter:none!important;transform:none!important;opacity:.45}.ly-plain .vnr2-ly.cur{opacity:1;color:#fff;filter:none!important;transform:none!important}.vnr2-sc-icons{display:flex;gap:10px;align-items:center;padding-right:6px;opacity:.65}.vnr2-sc-icons svg{width:16px;height:16px;display:block}';



    /*__VNR3_CORE_BEGIN__*/

/* pp-radio v3 core augmentation.

 * This file is inserted into pp-radio.json by app/scripts/build-radio-v3.js.

 * It deliberately uses ES5 syntax because the radio runs inside SillyTavern webviews.

 */

(function vnr3InstallCore() {

    if (eng.v3 && eng.v3.version >= 3.99) return;



    var v3 = eng.v3 = {

        version: 3.99,

        audio: {},

        continuousRuntime: null,

        sleepTimer: null,

        uiRefresh: function(detail) {

            try {

                /* 高频播放进度不能调用 eng.emit()：它会让整个 studio 重新绘制，

                   造成封面、进度条、hover 与展开面板持续闪烁。 */

                TOP.dispatchEvent(new TOP.CustomEvent('pp-radio-v3-refresh', {

                    detail: detail || null

                }));

            } catch (e) {}

        }

    };



    function bool(v, d) {

        if (v === undefined || v === null) return !!d;

        return v !== false && v !== 'false' && v !== 0 && v !== '0';

    }



    function clone(v) {

        try {

            return JSON.parse(JSON.stringify(v));

        } catch (e) {

            return v;

        }

    }



    function uid(prefix) {

        return (prefix || 'v3') + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1679616).toString(36);

    }



    function cleanSong(song) {

        song = song || {};

        return {

            id: song.id || uid('song'),

            title: String(song.title || song.name || song.query || '').trim(),

            artist: String(song.artist || song.author || '').trim(),

            url: String(song.url || '').trim(),

            cover: String(song.cover || song.coverUrl || song.pic || song.picture || '').trim(),

            album: String(song.album || '').trim(),

            source: String(song.source || '').trim(),

            sourceId: String(song.sourceId || song._trackId || '').trim(),

            pendingMatch: !!song.pendingMatch,

            matchError: String(song.matchError || '').trim(),

            advanced: song.advanced ? clone(song.advanced) : null,

            scriptVersions: Object.prototype.toString.call(song.scriptVersions) === '[object Array]' ? clone(song.scriptVersions) : [],

            selectedScriptId: String(song.selectedScriptId || ''),

            selectedScriptIds: Object.prototype.toString.call(song.selectedScriptIds) === '[object Array]' ? clone(song.selectedScriptIds) : [],

            scriptSelectionMode: song.scriptSelectionMode === 'random' ? 'random' : 'single'

        };

    }



    function songKey(song) {

        song = song || {};

        return _normMusic((song.title || song.name || song.query || '') + ' ' + (song.artist || song.author || ''));

    }



    function defaultPlaylist() {

        return {

            id: 'now-playing',

            system: true,

            name: '正在播放',

            description: '当前电台播放队列',

            cover: '',

            coverMode: 'latest',

            songs: [],

            order: 0,

            updatedAt: Date.now(),

            playMode: 'sequence',

            autoScripts: false,

            scriptBatchSize: 30

        };

    }



    function ensureState() {

        var st = eng.store.v3Radio;

        if (!st || typeof st !== 'object') st = eng.store.v3Radio = {};

        if (Object.prototype.toString.call(st.playlists) !== '[object Array]') st.playlists = [];

        var sys = null;

        for (var i = 0; i < st.playlists.length; i++) {

            if (st.playlists[i] && st.playlists[i].id === 'now-playing') sys = st.playlists[i];

        }

        if (!sys) {

            sys = defaultPlaylist();

            st.playlists.unshift(sys);

        }

        sys.system = true;

        sys.name = sys.name || '正在播放';

        if (Object.prototype.toString.call(sys.songs) !== '[object Array]') sys.songs = [];

        var favorites = null;

        for (var j = 0; j < st.playlists.length; j++) {

            if (st.playlists[j] && st.playlists[j].id === 'my-favorites') favorites = st.playlists[j];

        }

        if (!favorites) {

            favorites = {

                id: 'my-favorites',

                system: true,

                favoriteSystem: true,

                name: 'Favorites',

                description: '在电台中点击爱心收藏的歌曲',

                cover: '',

                coverMode: 'latest',

                songs: [],

                order: 1,

                updatedAt: Date.now(),

                playMode: 'sequence',

                autoScripts: false,

                scriptBatchSize: 30

            };

            st.playlists.splice(Math.min(1, st.playlists.length), 0, favorites);

        }

        favorites.system = true;

        favorites.favoriteSystem = true;

        favorites.name = 'Favorites';

        var knownCovers = {};

        st.playlists.forEach(function(pl) {

            if (!pl || pl.id === 'my-favorites') return;

            (pl.songs || []).forEach(function(song) {

                var key = songKey(song);

                var cover = song && (song.cover || song.coverUrl || song.pic || song.picture);

                if (key && cover) knownCovers[key] = cover;

            });

        });

        favorites.songs = ((eng.store && eng.store.favoriteSongs) || []).map(function(song) {

            if (!song.id) song.id = uid('fav');

            var clean = cleanSong(song);

            if (!clean.cover) clean.cover = knownCovers[songKey(clean)] || '';

            return clean;

        });

        favorites.updatedAt = Date.now();

        st.mode = /^(recommend|playlist|companion)$/.test(st.mode || '') ? st.mode : 'recommend';

        st.activePlaylistId = st.activePlaylistId || 'now-playing';

        st.shortPersonas = st.shortPersonas || {};

        st.continuousVersions = Object.prototype.toString.call(st.continuousVersions) === '[object Array]' ? st.continuousVersions : [];

        st.songScriptArchive = Object.prototype.toString.call(st.songScriptArchive) === '[object Array]' ? st.songScriptArchive : [];

        st.activeContinuousIds = st.activeContinuousIds || {};

        st.continuousVersions.forEach(function(version) {

            if (!version) return;

            if (!version.playlistId) version.playlistId = 'now-playing';

            version.favorite = !!version.favorite;

            version.audioCacheKeys = Object.prototype.toString.call(version.audioCacheKeys) === '[object Array]' ? version.audioCacheKeys : [];

            version.audioFiles = version.audioFiles && typeof version.audioFiles === 'object' ? version.audioFiles : {};

            version.audioAssets = Object.prototype.toString.call(version.audioAssets) === '[object Array]' ? version.audioAssets : [];

            version.segmentAudioMap = version.segmentAudioMap && typeof version.segmentAudioMap === 'object' ? version.segmentAudioMap : {};

        });

        if (st.activeContinuousId && !st.activeContinuousIds['now-playing']) {

            st.activeContinuousIds['now-playing'] = st.activeContinuousId;

        }

        st.favoriteContinuousIds = Object.prototype.toString.call(st.favoriteContinuousIds) === '[object Array]' ? st.favoriteContinuousIds : [];

        st.backgroundSelection = st.backgroundSelection || {};

        st.backgroundChecked = st.backgroundChecked || {};

        st.pendingImport = null;

        st.sleep = st.sleep || null;

        st.scriptPlaylistSelection = st.scriptPlaylistSelection && typeof st.scriptPlaylistSelection === 'object' ? st.scriptPlaylistSelection : {};

        st.scriptPlaybackQueues = st.scriptPlaybackQueues && typeof st.scriptPlaybackQueues === 'object' ? st.scriptPlaybackQueues : {};

        if (Object.prototype.toString.call(st.localScriptQueue) !== '[object Array]') {

            st.localScriptQueue = [];

            Object.keys(st.scriptPlaybackQueues).forEach(function(playlistId) {

                (st.scriptPlaybackQueues[playlistId] || []).forEach(function(id) {

                    if (st.localScriptQueue.indexOf(id) < 0) st.localScriptQueue.push(id);

                });

            });

        }

        var availableContinuousIds = {};

        st.continuousVersions.forEach(function(version) { if (version && version.id) availableContinuousIds[version.id] = true; });

        var seenLocalIds = {};

        st.localScriptQueue = st.localScriptQueue.filter(function(id) {

            if (!availableContinuousIds[id] || seenLocalIds[id]) return false;

            seenLocalIds[id] = true;

            return true;

        });

        st.localScriptPlayMode = /^(once|repeat|shuffle)$/.test(st.localScriptPlayMode || '') ? st.localScriptPlayMode : 'once';

        st.localScriptMode = !!st.localScriptMode;

        st.schema = 6;

        return st;

    }



    v3.state = ensureState();



    v3.save = function() {

        ensureState();

        eng.saveStore();

    };



    v3.playlists = function() {

        return ensureState().playlists;

    };



    v3.playlist = function(id) {

        var arr = v3.playlists();

        for (var i = 0; i < arr.length; i++) if (arr[i] && arr[i].id === id) return arr[i];

        return null;

    };



    v3.currentPlaylist = function() {

        return v3.playlist(v3.state.activePlaylistId) || v3.playlist('now-playing');

    };



    v3.nowSongs = function() {

        var out = [];

        if (eng.current && eng.current.song) {

            var a = cleanSong(eng.current.song);

            a.queueItemId = eng.current.id;

            a.needsScript = !!eng.current.needsScript;

            a.scriptFresh = eng.current.scriptFresh !== false;

            a.say = eng.current.say || '';

            out.push(a);

        }

        (eng.queue || []).forEach(function(it) {

            if (!it || !it.song) return;

            var s = cleanSong(it.song);

            s.queueItemId = it.id;

            s.needsScript = !!it.needsScript;

            s.scriptFresh = it.scriptFresh !== false;

            s.say = it.say || '';

            out.push(s);

        });

        return out;

    };



    v3.syncNow = function() {

        var pl = v3.playlist('now-playing');

        if (!pl) return;

        pl.songs = v3.nowSongs().map(cleanSong);

        pl.updatedAt = Date.now();

        v3.save();

    };



    v3.createPlaylist = function(data) {

        data = data || {};

        var pl = {

            id: uid('pl'),

            system: false,

            name: String(data.name || '未命名歌单').trim() || '未命名歌单',

            description: String(data.description || '').trim(),

            cover: String(data.cover || '').trim(),

            coverMode: data.cover ? 'custom' : 'latest',

            songs: [],

            order: v3.playlists().length,

            createdAt: Date.now(),

            updatedAt: Date.now(),

            playMode: data.playMode || 'sequence',

            autoScripts: !!data.autoScripts,

            scriptBatchSize: Math.max(1, Math.min(200, _num(data.scriptBatchSize, 30)))

        };

        v3.playlists().push(pl);

        v3.state.activePlaylistId = pl.id;

        v3.save();

        v3.uiRefresh();

        return pl;

    };



    v3.updatePlaylist = function(id, patch) {

        var pl = v3.playlist(id);

        if (!pl) return null;

        patch = patch || {};

        ['name', 'description', 'cover', 'playMode'].forEach(function(k) {

            if (patch[k] !== undefined) pl[k] = String(patch[k] || '').trim();

        });

        if (patch.autoScripts !== undefined) pl.autoScripts = !!patch.autoScripts;

        if (patch.scriptBatchSize !== undefined) pl.scriptBatchSize = Math.max(1, Math.min(200, _num(patch.scriptBatchSize, 30)));

        if (patch.cover !== undefined) pl.coverMode = patch.cover ? 'custom' : 'latest';

        pl.updatedAt = Date.now();

        v3.save();

        v3.uiRefresh();

        return pl;

    };



    v3.deletePlaylist = function(id) {

        if (!id || id === 'now-playing' || id === 'my-favorites') return false;

        var arr = v3.playlists();

        for (var i = 0; i < arr.length; i++) {

            if (arr[i] && arr[i].id === id) {

                arr.splice(i, 1);

                if (v3.state.activePlaylistId === id) v3.state.activePlaylistId = 'now-playing';

                v3.save();

                v3.uiRefresh();

                return true;

            }

        }

        return false;

    };



    v3.addSongs = function(id, songs, replace) {

        var pl = v3.playlist(id);

        if (!pl) return { added: 0, duplicate: 0 };

        var base = replace ? [] : (pl.songs || []).map(cleanSong);

        var seen = {};

        base.forEach(function(s) {

            var k = songKey(s);

            if (k) seen[k] = 1;

        });

        var added = 0, duplicate = 0;

        (songs || []).forEach(function(raw) {

            var s = cleanSong(raw);

            if (!s.title) return;

            var k = songKey(s);

            if (k && seen[k]) {

                duplicate++;

                return;

            }

            if (k) seen[k] = 1;

            base.push(s);

            added++;

        });

        pl.songs = base;

        pl.updatedAt = Date.now();

        v3.save();

        v3.uiRefresh();

        return { added: added, duplicate: duplicate };

    };



    v3.removeSongs = function(id, ids) {

        var pl = v3.playlist(id);

        if (!pl || id === 'now-playing') return;

        var set = {};

        (ids || []).forEach(function(x) { set[x] = 1; });

        pl.songs = (pl.songs || []).filter(function(s) { return !set[s.id]; });

        pl.updatedAt = Date.now();

        v3.save();

        v3.uiRefresh();

    };



    v3.copySongs = function(fromId, songIds, toId, move) {

        var from = v3.playlist(fromId), to = v3.playlist(toId);

        if (!from || !to || from === to) return { added: 0, duplicate: 0 };

        var set = {};

        (songIds || []).forEach(function(id) { set[id] = 1; });

        var selected = (from.songs || []).filter(function(s) { return set[s.id]; });

        var result = v3.addSongs(toId, selected, false);

        if (move) v3.removeSongs(fromId, selected.map(function(s) { return s.id; }));

        return result;

    };



    v3.mergePlaylists = function(fromId, toId, move) {

        var from = v3.playlist(fromId);

        if (!from) return { added: 0, duplicate: 0 };

        var ids = (from.songs || []).map(function(s) { return s.id; });

        return v3.copySongs(fromId, ids, toId, !!move);

    };



    v3.manualSongs = function(text) {

        var out = [];

        String(text || '').split(/\r?\n/).forEach(function(line) {

            line = line.trim();

            if (!line) return;

            var p = line.split(/\s+-\s+/);

            var title = String(p.shift() || '').trim();

            if (!title) return;

            out.push(cleanSong({

                title: title,

                artist: String(p.shift() || '').trim(),

                url: String(p.shift() || '').trim(),

                cover: p.join(' - ').trim()

            }));

        });

        return out;

    };



    function neteasePlaylistId(text) {

        var source = String(text || '').replace(/&amp;/gi, '&');

        try { source += '\n' + decodeURIComponent(source); } catch (_) {}

        var patterns = [

            /(?:music\.163\.com|y\.music\.163\.com)[^\s"'<>]*?[?&#]id=(\d+)/i,

            /(?:music\.163\.com|y\.music\.163\.com)[^\s"'<>]*?\/playlist\/(\d+)/i,

            /(?:playlistId|playlist_id|resourceId|resource_id)["'\s:=]+(\d{5,})/i

        ];

        for (var i = 0; i < patterns.length; i++) {

            var match = source.match(patterns[i]);

            if (match) return match[1];

        }

        return '';

    }



    function neteaseShareUrl(text) {

        var match = String(text || '').match(/https?:\/\/(?:163cn\.tv|(?:y\.)?music\.163\.com)\/[^\s<>"']+/i);

        return match ? match[0].replace(/[)\]}>，。！？、；;]+$/g, '') : '';

    }



    function resolveNeteasePlaylistId(input) {

        var directId = neteasePlaylistId(input);

        if (directId) return Promise.resolve(directId);



        var shortUrl = neteaseShareUrl(input);

        if (!shortUrl || !/https?:\/\/163cn\.tv\//i.test(shortUrl)) {

            return Promise.reject(new Error('无法从分享内容中识别歌单 ID，请粘贴网易云歌单分享链接'));

        }



        // 浏览器不能直接读取跨域 302 的 Location。先尝试直接请求（部分宿主会代转），

        // 再使用支持 CORS 的短链展开接口，确保手机端不依赖 Bridge 扩展。

        return TOP.fetch(shortUrl, { redirect: 'follow' }).then(function(r) {

            var id = neteasePlaylistId(r && r.url);

            if (id) return id;

            return r.text().then(function(body) {

                id = neteasePlaylistId(body);

                if (!id) throw new Error('短链接直连未返回歌单 ID');

                return id;

            });

        }).catch(function() {

            return TOP.fetch('https://unshorten.me/json/' + encodeURIComponent(shortUrl))

                .then(function(r) {

                    if (!r.ok) throw new Error('短链接展开 HTTP ' + r.status);

                    return r.json();

                })

                .then(function(result) {

                    var id = neteasePlaylistId(result && (result.resolved_url || result.resolvedUrl || result.url));

                    if (!id) throw new Error('短链接展开结果中没有歌单 ID');

                    return id;

                });

        }).catch(function(e) {

            throw new Error('网易云短链接展开失败：' + ((e && e.message) || String(e)) + '。也可以在网易云浏览器页面复制带 id=数字 的长链接');

        });

    }



    v3.importNetease = function(url, done) {

        resolveNeteasePlaylistId(url).then(function(id) {

        var sources = [

            function() {

                return TOP.fetch('https://api.injahow.cn/meting/?server=netease&type=playlist&id=' + encodeURIComponent(id))

                    .then(function(r) { if (!r.ok) throw new Error('Meting HTTP ' + r.status); return r.json(); })

                    .then(function(d) {

                        if (!d || !d.length) throw new Error('Meting 返回为空');

                        return {

                            id: id,

                            name: '导入歌单',

                            cover: (d[0] && (d[0].pic || d[0].picture)) || '',

                            songs: d.map(function(t) {

                                return cleanSong({

                                    title: t.name,

                                    artist: t.artist || t.author,

                                    cover: t.pic || t.picture || '',

                                    source: 'netease',

                                    sourceId: t.id || ''

                                });

                            })

                        };

                    });

            },

            function() {

                var api = 'https://music.163.com/api/playlist/detail?id=' + encodeURIComponent(id);

                return TOP.fetch('https://corsproxy.io/?' + encodeURIComponent(api))

                    .then(function(r) { if (!r.ok) throw new Error('网易云歌单 HTTP ' + r.status); return r.json(); })

                    .then(function(d) {

                        var pl = d && (d.playlist || d.result), tracks = pl && pl.tracks;

                        if (!tracks || !tracks.length) throw new Error('网易云歌单返回为空');

                        return {

                            id: id,

                            name: pl.name || '导入歌单',

                            cover: pl.coverImgUrl || '',

                            songs: tracks.map(function(t) {

                                return cleanSong({

                                    title: t.name,

                                    artist: (t.artists || t.ar || []).map(function(a) { return a.name; }).join(' / '),

                                    cover: (t.album && t.album.picUrl) || (t.al && t.al.picUrl) || '',

                                    source: 'netease',

                                    sourceId: t.id || ''

                                });

                            })

                        };

                    });

            }

        ];

        (function attempt(i, errors) {

            if (i >= sources.length) {

                done && done('歌单解析失败：' + errors.join('；'));

                return;

            }

            sources[i]().then(function(result) {

                done && done(null, result);

            }).catch(function(e) {

                errors.push((e && e.message) || String(e));

                attempt(i + 1, errors);

            });

        })(0, []);

        }).catch(function(e) {

            done && done((e && e.message) || String(e));

        });

    };



    function queueItemFromSong(song, playlistId) {

        song = cleanSong(song);

        var it = _itemFromSong(song, 'manual');

        it.song.cover = song.cover || '';

        it.song.coverUrl = song.cover || '';

        it.song.album = song.album || '';

        it.song.sourceId = song.sourceId || '';

        if (!it.song._trackId && song.sourceId) it.song._trackId = song.sourceId;

        var versions = song.scriptVersions || [];

        var selected = null;

        if (song.scriptSelectionMode === 'random' && song.selectedScriptIds && song.selectedScriptIds.length) {

            var candidates = versions.filter(function(version) {

                return version && song.selectedScriptIds.indexOf(version.id) >= 0 && version.say;

            });

            if (candidates.length) selected = candidates[Math.floor(Math.random() * candidates.length)];

        }

        if (!selected && song.selectedScriptId) {

            for (var i = 0; i < versions.length; i++) if (versions[i].id === song.selectedScriptId) selected = versions[i];

        }

        if (!selected && versions.length) selected = versions[0];

        if (selected && selected.say) {

            it.say = selected.say;

            it.host = selected.host || '';

            it.needsScript = false;

            it.scriptFresh = true;

        } else {

            it.say = '';

            it.needsScript = true;

            it.scriptFresh = false;

        }

        it.librarySongId = song.id;

        it.sourcePlaylistId = playlistId || '';

        return it;

    }



    v3.loadPlaylist = function(id, append) {

        var pl = v3.playlist(id);

        if (!pl) return false;

        var songs = (pl.songs || []).map(cleanSong);

        if (pl.playMode === 'shuffle') {

            for (var i = songs.length - 1; i > 0; i--) {

                var j = Math.floor(Math.random() * (i + 1)), tmp = songs[i];

                songs[i] = songs[j];

                songs[j] = tmp;

            }

        }

        var items = songs.map(function(song) { return queueItemFromSong(song, pl.id); });

        if (append) eng.queue = (eng.queue || []).concat(items);

        else {

            eng.queue = items;

            if (!eng.current || !eng.running) eng.current = null;

        }

        eng.saveQueue();

        /* Loading a playlist must preserve the mode explicitly chosen by the user. */

        v3.state.activePlaylistId = id;

        if (!append) v3.state.playbackPlaylistId = id;

        v3.save();

        if (!eng.running) {

            eng.running = true;

            eng.paused = false;

        }

        if (!eng.current) eng.next();

        if (pl.autoScripts) TOP.setTimeout(function() { v3.requestCurrentMode(false); }, 60);

        v3.uiRefresh();

        return true;

    };



    v3.playlistForQueueItem = function(item) {

        item = item || {};

        var direct = v3.playlist(item.sourcePlaylistId || '');

        if (direct && direct.id !== 'now-playing' && (direct.songs || []).length) return direct;

        var remembered = v3.playlist(v3.state.playbackPlaylistId || '');

        if (remembered && remembered.id !== 'now-playing' && (remembered.songs || []).length) return remembered;

        var key = songKey(item.song || {});

        var found = null;

        v3.playlists().some(function(playlist) {

            if (!playlist || playlist.id === 'now-playing' || !(playlist.songs || []).length) return false;

            var matched = (playlist.songs || []).some(function(song) {

                return item.librarySongId && song.id === item.librarySongId || key && songKey(song) === key;

            });

            if (matched) found = playlist;

            return matched;

        });

        return found;

    };



    v3.setMode = function(mode) {

        if (!/^(recommend|playlist|companion)$/.test(mode || '')) return;

        if (mode !== 'companion' && v3.continuousRuntime) v3.stopContinuous();

        if (mode === 'companion' && !v3.continuousRuntime) {

            try {

                if (eng.voice) {

                    eng.voice.onended = null;

                    eng.voice.onerror = null;

                    eng.voice.pause();

                    eng.voice.src = '';

                }

            } catch (e) {}

            eng.duck(false);

        }

        v3.state.mode = mode;

        v3.save();

        v3.uiRefresh();

        if (mode === 'companion') TOP.setTimeout(function() {

            if (v3.ensureCompanionAutoStart) v3.ensureCompanionAutoStart(true);

        }, 80);

    };



    v3.songScriptsSuppressed = function() {

        return v3.state.mode === 'companion' || !!v3.continuousRuntime;

    };



    v3.modeLabel = function(mode) {

        mode = mode || v3.state.mode;

        return mode === 'playlist' ? '歌单模式' : (mode === 'companion' ? '陪伴模式' : '推荐模式');

    };



    function trimScriptVersions(list, maxNormal) {

        list = Object.prototype.toString.call(list) === '[object Array]' ? list : [];

        maxNormal = Math.max(1, _num(maxNormal, 5));

        var favorite = [], normal = [];

        list.forEach(function(version) {

            if (!version || !version.say) return;

            if (version.favorite) favorite.push(version);

            else if (normal.length < maxNormal) normal.push(version);

        });

        return favorite.concat(normal);

    }



    function itemSongRefs(item) {

        item = item || {};

        var song = item.song || {};

        var key = songKey(song), refs = [], seen = [];

        v3.playlists().forEach(function(pl) {

            (pl.songs || []).forEach(function(saved) {

                if (!saved) return;

                if (item.librarySongId && saved.id === item.librarySongId || key && songKey(saved) === key) {

                    if (seen.indexOf(saved) < 0) {

                        seen.push(saved);

                        refs.push(saved);

                    }

                }

            });

        });

        var favorite = _favByKey(key);

        if (favorite && seen.indexOf(favorite) < 0) refs.push(favorite);

        var archived = null;

        (v3.state.songScriptArchive || []).some(function(entry) {

            if (entry && entry.key === key) {

                archived = entry;

                return true;

            }

            return false;

        });

        if (archived) refs.forEach(function(song) {

            song.scriptVersions = mergeScriptVersionLists(song.scriptVersions, archived.scriptVersions || []);

            if (!song.selectedScriptId) song.selectedScriptId = archived.selectedScriptId || '';

            if (!song.selectedScriptIds || !song.selectedScriptIds.length) song.selectedScriptIds = clone(archived.selectedScriptIds || []);

            if (!song.scriptSelectionMode) song.scriptSelectionMode = archived.scriptSelectionMode || 'single';

        });

        return refs;

    }



    function _scriptSelectedFavorite(song) {

        /* 歌曲对象当前选中版本是否收藏（收藏=锁定：重新生成/导入均跳过，保持收藏版为当前台本） */
        var id = ((song && song.selectedScriptIds) && song.selectedScriptIds[0]) || (song && song.selectedScriptId) || '';

        if (!id) return false;

        var vs = (song && song.scriptVersions) || [];

        for (var i = 0; i < vs.length; i++) if (vs[i] && vs[i].id === id) return !!vs[i].favorite;

        return false;

    }



    function _itemCurrentScriptFavorite(item) {

        var refs = itemSongRefs(item || {});

        for (var i = 0; i < refs.length; i++) if (_scriptSelectedFavorite(refs[i])) return true;

        return false;

    }



    v3.scriptVersionsForItem = function(item) {

        var refs = itemSongRefs(item), out = [], ids = {};

        refs.forEach(function(song) {

            (song.scriptVersions || []).forEach(function(version) {

                if (!version || !version.say) return;

                var id = version.id || ('script-' + songKey(song) + '-' + (version.t || 0));

                if (ids[id]) return;

                ids[id] = 1;

                out.push(version);

            });

        });

        out.sort(function(a, b) { return _num(b.t, 0) - _num(a.t, 0); });

        if (!out.length && item && item.say) {

            out.push({

                id: 'current-' + item.id,

                t: 0,

                host: item.host || '',

                say: item.say,

                favorite: false,

                ephemeral: true,

                label: '当前队列台本'

            });

        }

        return out;

    };



    v3.saveSongScript = function(item, data) {

        item = item || {};

        data = data || {};

        var say = String(data.say || '').trim();

        if (!say) return null;

        var id = data.id && String(data.id).indexOf('current-') !== 0 ? data.id : uid('script');

        var refs = itemSongRefs(item);

        if (!refs.length) {

            var now = v3.playlist('now-playing');

            if (now) {

                var saved = cleanSong(item.song || {});

                saved.id = item.librarySongId || saved.id || uid('song');

                now.songs.push(saved);

                item.librarySongId = saved.id;

                refs.push(saved);

            }

        }

        var savedVersion = null;

        refs.forEach(function(song) {

            song.scriptVersions = song.scriptVersions || [];

            var version = null;

            for (var i = 0; i < song.scriptVersions.length; i++) {

                if (song.scriptVersions[i] && song.scriptVersions[i].id === id) version = song.scriptVersions[i];

            }

            if (!version) {

                version = { id: id, t: Date.now() };

                song.scriptVersions.unshift(version);

            }

            version.t = Date.now();

            version.host = String(data.host || item.host || '');

            version.say = say;

            version.favorite = !!data.favorite;

            version.label = data.label || version.label || '手动保存';

            song.scriptVersions = trimScriptVersions(song.scriptVersions, 5);

            song.selectedScriptId = id;

            song.selectedScriptIds = [id];

            song.scriptSelectionMode = 'single';

            savedVersion = version;

        });

        item.say = say;

        item.host = String(data.host || item.host || '');

        item.needsScript = false;

        item.scriptFresh = true;

        item.spoken = false;

        eng.saveQueue();

        v3.save();

        v3.uiRefresh();

        return savedVersion;

    };



    v3.selectSongScript = function(item, id) {

        var versions = v3.scriptVersionsForItem(item), selected = null;

        for (var i = 0; i < versions.length; i++) if (versions[i].id === id) selected = versions[i];

        if (!selected) return false;

        itemSongRefs(item).forEach(function(song) {

            song.selectedScriptId = id;

            song.selectedScriptIds = [id];

            song.scriptSelectionMode = 'single';

        });

        item.say = selected.say || '';

        item.host = selected.host || '';

        item.needsScript = !item.say;

        item.scriptFresh = !!item.say;

        item.spoken = false;

        eng.saveQueue();

        v3.save();

        v3.uiRefresh();

        return true;

    };



    v3.toggleSongScriptFavorite = function(item, id) {

        var next = null;

        itemSongRefs(item).forEach(function(song) {

            (song.scriptVersions || []).forEach(function(version) {

                if (version && version.id === id) {

                    if (next === null) next = !version.favorite;

                    version.favorite = next;

                    version.favoritedAt = next ? Date.now() : 0;

                }

            });

            song.scriptVersions = trimScriptVersions(song.scriptVersions, 5);

        });

        v3.save();

        v3.uiRefresh();

        return next;

    };



    var COMPANION_TECHNICAL_TAIL = [

        '',

        '【篇幅要求】',

        '成稿约 {{目标字数}} 字。字数统计必须严格以所有 speech.ttsText 中实际会被主持人口播的正文合计为准，并使该口播正文达到约 {{目标字数}} 字。JSON 键名与结构、host、displayText 中与口播重复的内容、VoiceTag、pause 标记、秒数、转义符、空白及任何元数据均不计入此字数要求；不得用增加标签或结构字符来凑字数。',

        '',

        '【共同主持规则】',

        '如果有多名主持人，他们是共同主持这段节目：可以轮流说话、互相接话、讨论、打趣、补充或回应对方，也可以由一位主导、其他人自然加入。不要固定轮流顺序，不要求每段所有人都发言，但整篇应让适合参与的主持人真正参与交流。每个 speech.host 必须使用【主持人】中出现的名字。',

        '',

        '【停顿规则】',

        '{{停顿数量要求}}',

        '{{停顿秒数要求}}',

        '停顿是主持人说完一段内容后留给听众的独立安静时段，不是语气停顿。需要停顿时，必须在 nodes 数组中插入独立字符串标记 [pause=Ns]，例如停顿 24 秒就输出 "[pause=24s]"。标记不得放进 speech.ttsText 或 speech.displayText，也不得让主持人念出。播放停顿标记时，系统会停止请求语音并恢复背景声音，倒计时结束后再继续后面的 speech。',

        '',

        '【语言与节点规则（最高优先级，必须严格遵守）】',

        '1. 主持人的朗读语言以其在 {{朗读语言}} 中名字后的标注为准：例如“五条悟（日文）”表示五条悟的台词必须用日文书写；“夏油杰（日文）”同理。',

        '2. speech.ttsText 是发送给 TTS 的文本，必须严格使用该 speech.host 在 {{朗读语言}} 中标注的朗读语言书写，禁止混入其他语言、禁止中英日混排。',

        '3. speech.displayText 是显示给用户看的文本，必须只使用 {{显示语言}} 书写；显示文本是朗读文本的对应翻译或相同内容，不要添加朗读文本之外的内容。',

        '4. 禁止把同一句话写成两种语言，禁止在朗读文本中添加翻译、注释或双语对照。',

        '5. speech.host 必须与当前这段话的说话者一致。',

        '6. 每个 speech 应是一段适合单独请求语音的完整话语，不要把一句话无意义地拆成许多极短节点。',

        '7. 停顿只能使用独立的 "[pause=Ns]" 字符串标记；N 必须是允许区间内的秒数。',

        '',

        '【人物与称呼规则（最高优先级，必须严格遵守）】',

        '1. 主持人之间互相称呼时，必须严格使用符合其人物关系与角色设定的称呼，禁止用全名、姓氏或错误的称呼互称。',

        '2. 依据角色卡与世界书中的关系确定称呼；若关系为亲近挚友，用对方名字的简称（示例：五条悟对夏油杰称“杰”，夏油杰对五条悟称“悟”），不得反过来或混用。',

        '3. 台词中的称呼必须与说话者（speech.host）的身份一致，不得出现说话者视角错位的称呼。',

        '4. 称呼的语言必须与整句台词语言一致：日文台词使用日文称呼（如“傑”“悟”），中文台词使用中文称呼（如“杰”“悟”）。',

        '',

        '【输出要求】',

        '{{输出格式要求}}',

        '不要输出 Markdown、代码块、标题、解释或 JSON 之外的任何文字。JSON 中所有字符串必须正确转义并完整闭合。'

    ];



    var COMPANION_PROMPT_DEFAULT = [

        '你是专业的私人电台陪伴台本写作者。请为 {{主持人列表}} 写一份专业的电台陪伴类主持台本，让这些角色共同主持一段可以持续播放的长篇陪伴节目。',

        '这里是一个独立、假设性的私人电台世界。主持人 {{主持人列表}} 正在面向所有听众主持节目、分享话题；当【用户信息】存在时，他们知道其中的用户也是听众之一，但专业主持人不会直呼其名、持续单独对话或把节目变成一对一聊天，而会在面向全体听众的播报中，以不点名的关照、含蓄回应、只有对方可能听懂的暗线或留白自然地增加互动。',

        '',

        '【曲目不可知原则｜必须严格遵守】',

        '本台本与播放器中的实际曲目完全解耦。音乐由用户在外部独立、随机播放，模型既不知道当前曲目，也不负责选歌或排歌。主持人不得报幕、报歌名或歌手，不得说“刚才这首”“接下来这首”，不得猜测当前或下一首音乐的语言、国家、风格、歌词、主题、节奏、年代、情绪或演唱者，不得承诺播放任何歌曲，也不得把话题转折建立在某首歌已经或即将播放的假设上。可以把音乐仅视为不可描述的环境背景，但所有台词即使覆盖到任意随机曲目上也必须成立。',

        '',

        '【主持人】',

        '{{主持人列表}}',

        '',

        '【主持人角色设定】',

        '{{角色设定}}',

        '',

        '{{用户信息}}',

        '',

        '【角色与世界背景】',

        '{{世界书}}',

        '',

        '【电台专用世界书】',

        '{{电台世界书}}',

        '',

        '{{剧情上下文}}',

        '',

        '{{聊天总结}}',

        '',

        '{{最近主播对话}}',

        '',

        '【用户本次要求】',

        '{{用户输入}}',

        '',

        '【本次任务】',

        '写一段真正面向电台听众的连续节目。主持人可以从一个具体而有趣的观察、故事、疑问或生活片段进入，逐渐展开联想、观点、讲述与共同主持人的交流；在合适处向所有听众提出无需立即回答的问题并留下停顿。节目应有清晰但不刻板的起承转合，内容连贯、耐听，有事实、有细节、有感受，避免机械报幕、空洞寒暄、廉价鸡汤、反复安慰和持续强调“陪伴”。角色可以保留原本的口癖、知识范围、幽默与价值观，但必须具备专业主持人的倾听感、节奏感和公共表达意识。',

        '当【用户信息】、【剧情上下文】、聊天总结或最近主动聊天存在时，只把它们作为暗线素材：不得复述隐私、不得暴露“我读过资料”、不得让其他听众察觉节目专为某个人定制。若这些区块为空，直接写普适节目，不猜测缺失信息。',

    ].concat(COMPANION_TECHNICAL_TAIL).join('\n');



    var COMPANION_PROMPT_EMOTIONAL = [

        '你是资深的深夜情感与人文电台主笔。请只依据主持人角色设定，为 {{主持人列表}} 创作一份具有文学质感、思想深度和生活温度的长篇电台台本。这个预设不使用用户信息、不使用剧情上下文，也不把节目写给某个特定的人；主持人面对的是一群彼此陌生、正在各自生活里收听节目的普通听众。',

        '',

        '【曲目不可知原则｜必须严格遵守】',

        '台本与实际播放曲目完全解耦，音乐由用户在外部随机播放。主持人不知道任何正在播放或将要播放的曲目。禁止报幕、点歌、猜歌、评价“这首歌”，禁止提及具体歌曲的语言、歌词、风格、情绪、年代或歌手，也禁止用“听完这首”“下一首”组织节目。每一句话都必须能够覆盖在任意音乐或无音乐环境中独立成立。',

        '',

        '【主持人】',

        '{{主持人列表}}',

        '',

        '【主持人角色设定｜唯一人物依据】',

        '{{角色设定}}',

        '',

        '【创作定位】',

        '写一档真正可收听的情感人文节目，而不是励志语录合集、散文辞藻堆砌或心理咨询。每次从下列素材疆域中选择少量彼此能够自然生长的方向，形成一个中心命题；不要把清单逐项讲完，也不要在台词中说“今天我们来讨论第几点”。主持人的表达应从具体经验进入抽象思考，再回到可触摸的生活。',

        '',

        '【可选择的话题疆域】',

        '1. 时间与记忆：旧物为什么保存气味；某个季节、房间、街角如何成为记忆的容器；遗忘是否也是温柔；成长后如何重新理解童年；迟到的理解、没有寄出的信、未完成的告别。',

        '2. 关系与边界：亲密和自由如何共存；喜欢、依赖、习惯与责任的区别；友情中的沉默和疏远；家人之间笨拙的爱；错过、和解、失望、嫉妒、体面地离开；如何承认关系已经改变。',

        '3. 自我与选择：成为自己究竟意味着什么；理想自我与现实生活的距离；羞耻、脆弱、勇气、后悔和重新开始；普通人的尊严；不被看见的努力；允许自己改变答案。',

        '4. 孤独与共同生活：城市里擦肩而过的人；深夜仍亮着的窗；陌生人的微小善意；独处与被遗弃感的区别；人与人短暂相遇却彼此留下痕迹。',

        '5. 日常烟火：清晨市场、末班公交、便利店、厨房水汽、晾晒的衣服、雨后的鞋印、修补旧物、排队、搬家、归途、灯下的一顿饭。用动作、声音、温度、气味和空间细节承载情绪，不把日常只当抒情背景。',

        '6. 文学与叙事：人物为何做出某种选择；神话、民间故事、诗歌意象、书信、日记和小说结构如何照见生活。可以准确转述公共文化知识，但不得伪造名言、杜撰作者经历或大段复述受版权保护的作品。',

        '7. 视觉艺术与审美：一幅画的留白、光线和视线；摄影如何保存偶然；建筑如何塑造人的距离；电影镜头、舞台、舞蹈、手工艺与旧城空间如何表达难以直说的感受。重点是观察和思考，不卖弄术语。',

        '8. 哲学与存在：时间、自由、命运、偶然、身份、意义、有限性、死亡意识、幸福、真实与责任。必须用生活例子把抽象概念讲清，不冒充学术讲座，不用玄虚结论压过人的真实处境。',

        '9. 自然与尺度：潮汐、植物生长、候鸟、岩石、月相、天气和季节如何改变人理解时间的方式。不得把自然现象强行神秘化，也不要捏造科学事实。',

        '10. 工作与现代生活：疲惫、重复劳动、绩效、等待回复、社交表演、信息过载、消费欲望、租住空间、通勤和休息的内疚。既理解现实压力，也不提供轻率万能答案。',

        '',

        '【文学与角色要求】',

        '语言要有文化与文艺气质，但“文艺”来自准确观察、节制比喻、叙事结构和思想，而不是密集形容词。主持人的学识、词汇和举例方式必须符合角色设定：博学者可以旁征博引；阅历少、文化程度低或表达粗粝的角色，也可以从身体经验、劳动、家常记忆和直觉出发抵达真诚的感性时刻，不能突然使用不属于他的学术腔。允许观点有棱角、有犹豫、有未解之处，不强迫每个话题得出积极结论。',

        '整篇至少包含若干具体场景或微型故事，并在段落之间保留可呼吸的转场。不要直接诊断听众，不要假定听众经历过某种创伤，不要以“你一定”“所有人都”替听众下结论；可以用开放而克制的方式邀请听众自己理解。',

    ].concat(COMPANION_TECHNICAL_TAIL).join('\n');



    var COMPANION_PROMPT_SLEEP = [

        '你是专业的成人睡前电台与舒缓叙事台本写作者。请为 {{主持人列表}} 创作一份可以长时间聆听的低刺激哄睡节目。目标不是反复命令听众睡觉，而是用安全、缓慢、具体、无压力的内容逐步降低注意强度，让清醒也被允许，让困意有机会自然出现。',

        '',

        '【曲目不可知原则｜必须严格遵守】',

        '台本与播放器中的实际曲目完全解耦，音乐由用户在外部随机播放。主持人不知道当前或下一首曲目。禁止报幕、点歌、猜测或描述“这首歌”的语言、歌词、风格、节奏、情绪、年代或歌手；禁止使用“随着这首音乐”“下一首会更安静”等表述。引导只能依靠主持人的语言本身，并且在任意随机曲目、环境声或无音乐时都成立。',

        '',

        '【主持人】',

        '{{主持人列表}}',

        '',

        '【主持人角色设定】',

        '{{角色设定}}',

        '',

        '{{用户信息}}',

        '',

        '【角色与世界背景】',

        '{{世界书}}',

        '',

        '【电台专用世界书】',

        '{{电台世界书}}',

        '',

        '{{剧情上下文}}',

        '',

        '{{聊天总结}}',

        '',

        '{{最近主播对话}}',

        '',

        '【用户本次要求】',

        '{{用户输入}}',

        '',

        '【创作方法】',

        '每次选择一至三种彼此兼容的方法，形成自然节目，不要把所有方法做成清单，也不要像治疗师宣读训练步骤。可用方向如下：',

        '1. 缓慢呼吸关注：用不强迫、不憋气的语言邀请听众感受腹部起伏、呼气后的松开、空气温度或床铺承托；不追求精确成绩，不制造“做错了”的压力。',

        '2. 温和身体扫描：从额头、下颌、肩颈、手指、背部、腿脚等部位依次注意重量、温度和接触面，只邀请放松，不要求疼痛或不适部位用力。',

        '3. 渐进式松弛：可以轻柔描述“觉察紧张—松开—停留”的差别；不得要求疼痛、受伤或行动不便的听众强行绷紧肌肉，可改为想象该部位逐渐松开。',

        '4. 多感官安全场景想象：安静花园、雨夜屋檐、山间木屋、海边清晨、夜行列车、图书馆闭馆后、窗边咖啡馆、柔和旅店等。循序描写光线、材质、温度、远近声音、气味与身体触感，让场景安全、可退出、没有威胁。',

        '5. 低冲突漫游叙事：散步、乘船、慢车旅行、整理书架、照料植物、准备热饮、烘焙、缝补、逛清晨市场、观察小镇入夜。事件应可预测、低风险、没有悬念追逐、谜题、争吵、危险或必须等到结局的信息。',

        '6. 平静的知识与物件故事：讲一件普通器物的制作过程、一座房屋一天里的光、植物缓慢生长、纸张与书页、织物、陶器、邮局、灯塔值守等。事实不确定时宁可不讲，不捏造历史或科学知识。',

        '7. 放下白天的仪式：把未完成事项想象为暂存进抽屉、篮子、车站寄存柜或明天的信封；承认事情尚未解决，但今晚不必继续处理。不得许诺所有问题醒来就会消失。',

        '8. 无评价的日常回顾：只拾取一天里中性或微小的细节，如喝过的水、走过的路、见过的光，不做绩效总结，不追问遗憾，不诱发强烈反省。',

        '9. 重复与递减：使用轻微重复的句式、稳定意象和逐渐拉长的停顿；后半段减少新人物、新信息、问题和转折，使语言从叙事慢慢过渡到简单感官与留白。',

        '',

        '【哄睡语气与安全边界】',

        '语速感要慢，句法清楚，音量想象稳定，避免突然兴奋、密集笑点、恐怖意象、强冲突、倒计时压力和频繁提问。不要反复说“快睡”“必须睡着”“别想了”，也不要因听众仍清醒而责备；可以明确告诉听众无需努力证明自己睡着，走神、调整姿势或暂时清醒都没有关系。',

        '这是一段舒缓节目，不是医疗治疗。不得诊断失眠、创伤、焦虑或身体疾病，不承诺治愈，不指导停药，不使用催眠控制暗示。涉及呼吸、身体或想象练习时始终给予跳过、停止或只听故事的自由。',

        '若【用户信息】或【剧情上下文】存在，只选取安全、低唤醒度的细节做极轻的个性化，不复述冲突、危险、创伤、任务压力或隐私；若为空，直接写普适的成人睡前节目。角色可以保留个性，但尖锐、吵闹或攻击性的特征要转译为较低刺激、仍可辨认的夜间表达。',

    ].concat(COMPANION_TECHNICAL_TAIL).join('\n');



    function addFields() {

        var existing = {};

        FIELDS.forEach(function(f) {

            existing[f.key] = 1;

            if (f.key === 'autoRequest') f.label = '自动请求下一批（推荐模式）';

            if (f.key === 'contextSource' || f.key === 'stHistN') f.dependsOn = 'v3IncludeStoryContext';

        });

        var list = [

            { group: '上下文', key: 'v3IncludeUserInfo', type: 'toggle', label: '发送用户名称与用户设定（总开关）', default: true },

            { group: '上下文', key: 'v3IncludeStoryContext', type: 'toggle', label: '发送剧情上下文（总开关）', default: true },

            { group: '请求模式', key: 'v3ShortPersonaEnabled', type: 'toggle', label: '使用 Artist 中设置的电台简短人设', default: false },

            { group: '请求模式', key: 'v3OmitRecentHostTalk', type: 'toggle', label: '不发送历史台本（保留主动聊天）', default: false },

            { group: '请求模式', key: 'v3CompanionAutoRequest', type: 'toggle', label: '自动请求新台本（陪伴模式）', default: true },

            { group: '请求模式', key: 'v3ScriptRetryCount', type: 'number', label: '请求台本失败后自动重试次数', default: 1, min: 0, max: 10, step: 1 },

            { group: '请求模式', key: 'v3CompanionWords', type: 'number', label: '陪伴模式目标字数', default: 3000, min: 300, max: 20000, step: 100 },

            { group: '请求模式', key: 'v3PauseMinCount', type: 'number', label: '连续台本最少停顿节点', default: 3, min: 0, max: 100 },

            { group: '请求模式', key: 'v3PauseMaxCount', type: 'number', label: '连续台本最多停顿节点', default: 8, min: 0, max: 100 },

            { group: '请求模式', key: 'v3PauseMinSeconds', type: 'number', label: '单次停顿最少秒数', default: 5, min: 0, max: 3600 },

            { group: '请求模式', key: 'v3PauseMaxSeconds', type: 'number', label: '单次停顿最多秒数', default: 30, min: 0, max: 3600 },

            { group: '请求模式', key: 'v3TtsPrefetch', type: 'number', label: '连续台本提前准备语音块数', default: 2, min: 1, max: 8 },

            { group: '提示词', key: 'v3TaskModulePrompt', type: 'textarea-presets', label: '当前任务要求模块', rows: 6, variables: ['{{当前任务要求}}'], default: '请严格执行当前请求模式定义的任务；不要额外推荐用户没有要求的内容。' },

            { group: '提示词', key: 'v3RandomModulePrompt', type: 'textarea-presets', label: '随机播放独立台本模块', rows: 7, variables: ['{{随机播放要求}}'], default: '当前曲目将以随机顺序播放。每首歌曲的台本必须能够独立成立，不得引用上一首或下一首，不得使用“刚才那首”“接下来”“延续前面的话题”等依赖固定顺序的表达。不同歌曲之间不得形成必须按顺序理解的情节、对话或情绪递进。' },

            { group: '提示词', key: 'v3LyricsModulePrompt', type: 'textarea-presets', label: '模型自行检索歌词模块', rows: 6, variables: ['{{歌词检索要求}}'], default: '你可以根据准确的歌名和歌手自行尝试回忆或查找歌词来理解歌曲；如果无法可靠找到，就忽略歌词。禁止编造歌词、伪造歌词内容或假装已经找到。' },

            { group: '提示词', key: 'v3CompanionPrompt', type: 'textarea-presets', label: '陪伴模式完整提示词', rows: 20, variables: ['{{主持人列表}}', '{{用户信息}}', '{{用户名称}}', '{{用户设定}}', '{{角色设定}}', '{{世界书}}', '{{电台世界书}}', '{{剧情上下文}}', '{{聊天总结}}', '{{最近主播对话}}', '{{用户输入}}', '{{目标字数}}', '{{停顿数量要求}}', '{{停顿秒数要求}}', '{{朗读语言}}', '{{显示语言}}', '{{输出格式要求}}'], default: COMPANION_PROMPT_DEFAULT },

            { group: '提示词', key: 'v3RecommendOnlyPrompt', type: 'textarea-presets', label: '只推荐歌曲模块', rows: 8, variables: ['{{只推荐歌曲要求}}'], default: '只推荐真实存在的歌曲，不写台本、不写主持人对白。只返回歌曲 title 与 artist，不要编造 URL。' }

        ];

        list.forEach(function(f) {

            if (!existing[f.key]) {

                FIELDS.push(f);

                if (cfg[f.key] === undefined) cfg[f.key] = f["default"];

            }

        });

        var contextInsertAt = -1;

        for (var contextIndex = 0; contextIndex < FIELDS.length; contextIndex++) {

            if (FIELDS[contextIndex].key === 'contextSource') {

                contextInsertAt = contextIndex;

                break;

            }

        }

        if (contextInsertAt >= 0) {

            ['v3IncludeUserInfo', 'v3IncludeStoryContext'].forEach(function(masterKey) {

                for (var masterIndex = 0; masterIndex < FIELDS.length; masterIndex++) {

                    if (FIELDS[masterIndex].key !== masterKey) continue;

                    var masterField = FIELDS.splice(masterIndex, 1)[0];

                    if (masterIndex < contextInsertAt) contextInsertAt--;

                    FIELDS.splice(contextInsertAt++, 0, masterField);

                    break;

                }

            });

        }

        for (var promptFieldIndex = 0; promptFieldIndex < FIELDS.length; promptFieldIndex++) {

            if (FIELDS[promptFieldIndex].key === 'v3CompanionPrompt') {

                FIELDS[promptFieldIndex]["default"] = COMPANION_PROMPT_DEFAULT;

                break;

            }

        }

        if (!cfg.v3CompanionPromptSuiteV1) {

            var oldCompanionOpening = '你是专业的私人电台陪伴台本写作者。请让用户选择的主持人以角色本人的身份，共同主持一段可以持续播放的长篇陪伴节目。';

            if (!cfg.v3CompanionPrompt || String(cfg.v3CompanionPrompt).indexOf(oldCompanionOpening) === 0) {

                cfg.v3CompanionPrompt = COMPANION_PROMPT_DEFAULT;

            }

            if (!eng.store.promptPresets) eng.store.promptPresets = {};

            if (!eng.store.promptPresets.v3CompanionPrompt) eng.store.promptPresets.v3CompanionPrompt = [];

            var companionPresets = eng.store.promptPresets.v3CompanionPrompt;

            function addCompanionPreset(name, text) {

                var exists = companionPresets.some(function(preset) { return preset && preset.n === name; });

                if (!exists) companionPresets.push({ n: name, t: text, builtin: true });

            }

            addCompanionPreset('情感人文电台', COMPANION_PROMPT_EMOTIONAL);

            addCompanionPreset('舒缓哄睡电台', COMPANION_PROMPT_SLEEP);

            eng.saveStore();

            cfg.v3CompanionPromptSuiteV1 = true;

        }

        var moduleBlock = '\n\n【动态任务模块】\n{{当前任务要求}}\n{{随机播放要求}}\n{{歌词检索要求}}\n{{输出格式要求}}';

        ['promptTemplate', 'scriptRewritePrompt'].forEach(function(k) {

            if (cfg[k]) {

                cfg[k] = cfg[k].replace(/\n?\{\{人设注入要求\}\}/g, '').replace(/\n?\{\{连续台本要求\}\}/g, '');

            }

            if (cfg[k] && cfg[k].indexOf('{{当前任务要求}}') < 0) cfg[k] += moduleBlock;

        });

        if (cfg.v3CompanionPrompt) {

            cfg.v3CompanionPrompt = cfg.v3CompanionPrompt

                .replace(/\n*【酒馆历史】\n\{\{酒馆历史\}\}/g, '')

                .replace(/\n*【Horae 总结】\n\{\{Horae总结\}\}/g, '')

                .replace(/\n*【柏宝书总结】\n\{\{柏宝书总结\}\}/g, '')

                .replace('pause 是主持人说完一段内容后留给用户的独立安静时段，不是语气停顿。pause 前后应在内容上自然衔接；播放 pause 时系统会停止请求语音并恢复背景声音，倒计时结束后再继续后面的 speech。', '停顿是主持人说完一段内容后留给用户的独立安静时段，不是语气停顿。需要停顿时，必须在 nodes 数组中插入独立字符串标记 [pause=Ns]，例如停顿 24 秒就输出 "[pause=24s]"。标记不得放进 speech.ttsText 或 speech.displayText，也不得让主持人念出。播放停顿标记时，系统会停止请求语音并恢复背景声音，倒计时结束后再继续后面的 speech。')

                .replace('5. pause 节点只能包含 type 与 seconds，不要给 pause 添加主持人或文本。', '5. 停顿只能使用独立的 "[pause=Ns]" 字符串标记；N 必须是允许区间内的秒数。');

        }

        var wordRule = '字数统计必须严格以所有 speech.ttsText 中实际会被主持人口播的正文合计为准，并使该口播正文达到约 {{目标字数}} 字。JSON 键名与结构、host、displayText 中与口播重复的内容、VoiceTag、pause 标记、秒数、转义符、空白及任何元数据均不计入此字数要求；不得用增加标签或结构字符来凑字数。';

        if (cfg.v3CompanionPrompt && cfg.v3CompanionPrompt.indexOf('speech.ttsText 中实际会被主持人口播') < 0) {

            cfg.v3CompanionPrompt += '\n\n【口播正文的字数口径】\n' + wordRule;

        }

        var langRule = '\n\n【语言规则（最高优先级，必须严格遵守）】\n1. 主持人的朗读语言以其在 {{朗读语言}} 中名字后的标注为准：例如“五条悟（日文）”表示五条悟的台词必须用日文书写。\n2. speech.ttsText 与 VoiceTag 的发送文本必须严格使用对应 host 在 {{朗读语言}} 中标注的朗读语言书写，禁止混入其他语言、禁止中英日混排。\n3. 禁止把同一句话写成两种语言，禁止在朗读文本中添加翻译、注释或双语对照。\n4. speech.displayText 与弯引号“ ”内的显示文本必须只使用 {{显示语言}} 书写，是朗读文本的对应翻译或相同内容。';

        ['promptTemplate', 'scriptRewritePrompt', 'radioChatPrompt', 'v3CompanionPrompt'].forEach(function(k) {

            if (cfg[k] && cfg[k].indexOf('主持人的朗读语言以其在 {{朗读语言}} 中名字后的标注为准') < 0) cfg[k] += langRule;

            if (cfg[k] && cfg[k].indexOf('人物与称呼规则') < 0) cfg[k] += callRule;

        });

        var callRule = '\n\n【人物与称呼规则（最高优先级，必须严格遵守）】\n1. 主持人之间互相称呼时，必须严格使用符合其人物关系与角色设定的称呼，禁止用全名、姓氏或错误的称呼互称。\n2. 依据角色卡与世界书中的关系确定称呼；若关系为亲近挚友，用对方名字的简称（示例：五条悟对夏油杰称“杰”，夏油杰对五条悟称“悟”），不得反过来或混用。\n3. 台词中的称呼必须与说话者（speech.host）的身份一致，不得出现说话者视角错位的称呼。\n4. 称呼的语言必须与整句台词语言一致：日文台词使用日文称呼（如“傑”“悟”），中文台词使用中文称呼（如“杰”“悟”）。';

        if (!cfg.v3CompanionAutoRequestDefaultV2) {

            cfg.v3CompanionAutoRequest = true;

            cfg.v3CompanionAutoRequestDefaultV2 = true;

        }

        function normalizeRecentTalkSlot(text) {

            return String(text || '').replace(/【最近主播对话】\s*\{\{最近主播对话\}\}/g, '{{最近主播对话}}');

        }

        function normalizeChatSummarySlot(text) {

            return String(text || '').replace(/【电台聊天总结】\s*\{\{聊天总结\}\}/g, '{{聊天总结}}');

        }

        function normalizeStoryContextSlot(text) {

            return String(text || '').replace(/【(?:当前)?剧情上下文】\s*\{\{剧情上下文\}\}/g, '{{剧情上下文}}');

        }

        function normalizeUserInfoSlot(text) {

            return String(text || '')

                .replace(/【用户】\s*\{\{用户名称\}\}\s*\{\{用户设定\}\}/g, '{{用户信息}}')

                .replace(/【用户设定】\s*\{\{用户名称\}\}\s*\{\{用户设定\}\}/g, '{{用户信息}}');

        }

        FIELDS.forEach(function(fieldDef) {

            if (!fieldDef) return;

            if (typeof fieldDef["default"] === 'string') {

                if (fieldDef["default"].indexOf('{{最近主播对话}}') >= 0) fieldDef["default"] = normalizeRecentTalkSlot(fieldDef["default"]);

                if (fieldDef["default"].indexOf('{{聊天总结}}') >= 0) fieldDef["default"] = normalizeChatSummarySlot(fieldDef["default"]);

                if (fieldDef["default"].indexOf('{{剧情上下文}}') >= 0) fieldDef["default"] = normalizeStoryContextSlot(fieldDef["default"]);

                if (fieldDef["default"].indexOf('{{用户设定}}') >= 0) fieldDef["default"] = normalizeUserInfoSlot(fieldDef["default"]);

            }

            if (fieldDef.key && typeof cfg[fieldDef.key] === 'string') {

                if (cfg[fieldDef.key].indexOf('{{最近主播对话}}') >= 0) cfg[fieldDef.key] = normalizeRecentTalkSlot(cfg[fieldDef.key]);

                if (cfg[fieldDef.key].indexOf('{{聊天总结}}') >= 0) cfg[fieldDef.key] = normalizeChatSummarySlot(cfg[fieldDef.key]);

                if (cfg[fieldDef.key].indexOf('{{剧情上下文}}') >= 0) cfg[fieldDef.key] = normalizeStoryContextSlot(cfg[fieldDef.key]);

                if (cfg[fieldDef.key].indexOf('{{用户设定}}') >= 0) cfg[fieldDef.key] = normalizeUserInfoSlot(cfg[fieldDef.key]);

            }

        });

        _saveCfg();

    }

    addFields();



    var v3ContextTextSource = _contextText;

    _contextText = function() {

        if (!bool(cfg.v3IncludeStoryContext, true)) return '';

        var body = String(v3ContextTextSource() || '').trim();

        return body ? '【剧情上下文】\n' + body : '';

    };



    function radioUserInfoBlock() {

        if (!bool(cfg.v3IncludeUserInfo, true)) return '';

        var user = _user() || {};

        var lines = [];

        if (String(user.name || '').trim()) lines.push('用户名称：' + String(user.name).trim());

        if (String(user.persona || '').trim()) lines.push('用户设定：\n' + String(user.persona).trim());

        return lines.length ? '【用户信息】\n' + lines.join('\n') : '';

    }



    function isAutomaticScriptHistory(message) {

        return !!(message && (message.kind === 'script' || message.scriptId));

    }



    function radioHistoryContextStats() {

        var history = (eng.store && eng.store.chatHistory) || [];

        var scriptCount = 0, proactiveCount = 0;

        history.forEach(function(message) {

            if (isAutomaticScriptHistory(message)) scriptCount++;

            else proactiveCount++;

        });

        return {

            totalMessages: history.length,

            automaticScriptMessages: scriptCount,

            proactiveChatMessages: proactiveCount,

            filterAutomaticScripts: bool(cfg.v3OmitRecentHostTalk, false),

            mixedSummaryOmitted: bool(cfg.v3OmitRecentHostTalk, false) && !!(eng.store && eng.store.chatSummary)

        };

    }



    _recentRadioTalk = function(limit) {

        limit = _num(limit, cfg.recommendChatMessages === undefined ? 6 : cfg.recommendChatMessages);

        var history = (eng.store && eng.store.chatHistory) || [];

        if (bool(cfg.v3OmitRecentHostTalk, false)) {

            history = history.filter(function(message) {

                return !isAutomaticScriptHistory(message);

            });

        }

        if (!history.length || limit <= 0) return '';

        var body = history.slice(-limit).map(function(message) {

            return (message.role === 'user' ? '用户' : '主播') + ': ' + (message.display || message.content || '');

        }).filter(function(line) { return !!String(line || '').trim(); }).join('\n');

        return body ? '【最近主播对话】\n' + body : '';

    };



    function radioChatSummaryBlock() {

        /* 旧 chatSummary 是由全部 chatHistory 混合生成，无法可靠区分台本与主动聊天。

           严格过滤打开时只允许使用独立维护的主动聊天记录。 */

        var strict = bool(cfg.v3OmitRecentHostTalk, false);

        var summary = String(eng.store && (strict ? eng.store.proactiveChatSummary : eng.store.chatSummary) || '').trim();

        return summary ? '【电台聊天总结】\n' + summary : '';

    }



    /* 基础版会在聊天过长时压缩并删除旧消息。压缩前，把其中尚未记录过的

       用户主动消息及对应 API 回复单独保存，自动播放台本永远不进入这里。 */

    var maybeSummarizeChatWithMixedHistory = _maybeSummarizeChat;

    _maybeSummarizeChat = function() {

        try {

            var recentCount = _num(cfg.chatRecentMessages, 10);

            var summaryBatch = _num(cfg.chatSummaryBatch, 40);

            var history = (eng.store && eng.store.chatHistory) || [];

            if (history.length > recentCount + summaryBatch) {

                var old = history.slice(0, history.length - recentCount);

                var captured = old.filter(function(message) {

                    return !isAutomaticScriptHistory(message) && !message.v3ProactiveSummaryCaptured;

                });

                if (captured.length) {

                    var added = captured.map(function(message) {

                        message.v3ProactiveSummaryCaptured = true;

                        return (message.role === 'user' ? '用户' : '主播') + ': ' + (message.display || message.content || '');

                    }).filter(function(line) {

                        return !!String(line || '').trim();

                    }).join('\n');

                    var previous = String(eng.store.proactiveChatSummary || '').trim();

                    var combined = [previous, added].filter(Boolean).join('\n');

                    eng.store.proactiveChatSummary = combined.slice(-12000);

                    eng.saveStore();

                }

            }

        } catch (captureError) {}

        return maybeSummarizeChatWithMixedHistory.apply(this, arguments);

    };



    if (eng.request && !eng.request.__vnrRouteDebugWrapped) {

        var requestWithRouteSource = eng.request;

        var requestWithRoute = function(note, done, label, type) {

            var routeDebug = {

                route: 'eng.request',

                mode: v3.state.mode,

                requestType: type || 'request',

                label: label || '请求曲目+台本',

                omitRecentHostTalk: bool(cfg.v3OmitRecentHostTalk, false),

                recentHostTalkChars: _recentRadioTalk(cfg.recommendChatMessages).length,

                startedAt: new Date().toISOString()

            };

            eng.lastApiRoute = routeDebug;

            try { TOP.__vnmRadioLastRoute = routeDebug; } catch (e) {}

            try { TOP.localStorage.setItem('pp-radio-last-route-debug', JSON.stringify(routeDebug)); } catch (e2) {}

            return requestWithRouteSource.apply(eng, arguments);

        };

        requestWithRoute.__vnrRouteDebugWrapped = true;

        eng.request = requestWithRoute;

    }

    if (eng.sendChat && !eng.sendChat.__vnrRouteDebugWrapped) {

        var sendChatWithRouteSource = eng.sendChat;

        var sendChatWithRoute = function(text, retry) {

            var routeDebug = {

                route: 'eng.sendChat',

                mode: v3.state.mode,

                retry: !!retry,

                label: '主播连线聊天',

                omitRecentHostTalk: bool(cfg.v3OmitRecentHostTalk, false),

                recentHostTalkChars: _recentRadioTalk(cfg.recommendChatMessages).length,

                startedAt: new Date().toISOString()

            };

            eng.lastApiRoute = routeDebug;

            try { TOP.__vnmRadioLastRoute = routeDebug; } catch (e) {}

            try { TOP.localStorage.setItem('pp-radio-last-route-debug', JSON.stringify(routeDebug)); } catch (e2) {}

            return sendChatWithRouteSource.apply(eng, arguments);

        };

        sendChatWithRoute.__vnrRouteDebugWrapped = true;

        eng.sendChat = sendChatWithRoute;

    }



    var oldBuildCommon = _buildCommon;

    _buildCommon = function(tpl, extra) {

        extra = extra || {};

        var summarySlot = '__VNM_RADIO_CHAT_SUMMARY_BLOCK__';

        var preparedTpl = String(tpl || '').replace(/\{\{聊天总结\}\}/g, summarySlot);

        var includeUserInfo = bool(cfg.v3IncludeUserInfo, true);

        var includeStoryContext = bool(cfg.v3IncludeStoryContext, true);

        var userSource = _user;

        var stHistorySource = _getSTHistory;

        var horaeSource = _getHorae;

        var baiBaiSource = _getBaiBaiSummary;

        if (!includeUserInfo) {

            _user = function() {

                return { name: '__VNM_DISABLED_USER_NAME__', persona: '__VNM_DISABLED_USER_PERSONA__' };

            };

        }

        if (!includeStoryContext) {

            _getSTHistory = function() { return ''; };

            _getHorae = function() { return ''; };

            _getBaiBaiSummary = function() { return ''; };

        }

        var out;

        try {

            out = oldBuildCommon(preparedTpl, extra);

        } finally {

            _user = userSource;

            _getSTHistory = stHistorySource;

            _getHorae = horaeSource;

            _getBaiBaiSummary = baiBaiSource;

        }

        out = out

            .split('__VNM_DISABLED_USER_NAME__').join('')

            .split('__VNM_DISABLED_USER_PERSONA__').join('')

            .replace(/\{\{用户信息\}\}/g, radioUserInfoBlock());

        out = out.split(summarySlot).join(radioChatSummaryBlock());

        var pl = v3.currentPlaylist() || {};

        var random = v3.state.mode === 'playlist' && pl.playMode === 'shuffle' ? (cfg.v3RandomModulePrompt || '') : '';

        var task = extra.taskRequirement || (cfg.v3TaskModulePrompt || '');

        var lyrics = v3.state.mode === 'playlist' ? (cfg.v3LyricsModulePrompt || '') : '';

        var map = {

            '当前任务要求': task,

            '随机播放要求': random,

            '歌词检索要求': lyrics,

            '输出格式要求': extra.outputRequirement || '',

            '只推荐歌曲要求': extra.recommendOnly ? (cfg.v3RecommendOnlyPrompt || '') : '',

            '目标字数': extra.targetWords || '',

            '停顿数量要求': extra.pauseCountRequirement || '',

            '停顿秒数要求': extra.pauseSecondsRequirement || ''

        };

        for (var k in map) if (map.hasOwnProperty(k)) out = out.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), map[k]);

        return out;

    };



    var oldHostRoleText = _hostRoleText;

    _hostRoleText = function(hosts) {

        if (!bool(cfg.v3ShortPersonaEnabled, false)) return oldHostRoleText(hosts);

        return (hosts || []).map(function(ch) {

            var id = _charId(ch);

            var shortText = String(v3.state.shortPersonas[id] || '').trim();

            return '【' + (ch.name || '未命名') + '】\n' + (shortText || ch.persona || '');

        }).join('\n\n');

    };



    function pickedQueueItems(limit) {

        var all = (eng.current ? [eng.current] : []).concat(eng.queue || []);

        var targets = all.filter(function(it) { return it && (it.needsScript || !it.say || it.scriptFresh === false); });

        limit = Math.max(1, _num(limit, 30));

        var pl = v3.currentPlaylist() || {};

        if (pl.playMode === 'shuffle' && targets.length > limit) {

            targets = targets.slice();

            for (var i = targets.length - 1; i > 0; i--) {

                var j = Math.floor(Math.random() * (i + 1)), tmp = targets[i];

                targets[i] = targets[j]; targets[j] = tmp;

            }

        }

        return targets.slice(0, limit);

    }



    function requestScriptChat(messages, label, statusType, onResponse, onFinalError) {

        var retryLimit = Math.max(0, Math.min(10, _num(cfg.v3ScriptRetryCount, 1)));

        var retriesUsed = 0;

        function fail(error) {

            if (retriesUsed < retryLimit) {

                retriesUsed++;

                _setApiStatus('loading', statusType, label + ' · 自动重试 ' + retriesUsed + '/' + retryLimit, '', '');

                _toast(label + '失败，正在自动重试（' + retriesUsed + '/' + retryLimit + '）');

                TOP.setTimeout(run, 650);

                return;

            }

            onFinalError(error);

        }

        function run() {

            _chatOnce(messages, function(text) {

                try {

                    if (onResponse(text, retriesUsed) === false) fail('模型返回的台本格式无法解析');

                } catch (responseError) {

                    fail(responseError && responseError.message || String(responseError));

                }

            }, fail);

        }

        run();

    }



    v3.requestLinkedScripts = function(manual, selectedIds) {

        if (v3.songScriptsSuppressed()) {

            if (manual) _toast('陪伴模式正在使用长台本，不请求歌曲台本');

            return;

        }

        if (eng.scriptBusy) return;

        if (!manual && !v3.consumeAutoRequest()) {

            _toast('睡眠模式的自动请求次数已用完');

            return;

        }

        var pl = v3.currentPlaylist() || {};

        var targets = pickedQueueItems(pl.scriptBatchSize || 30);

        if (selectedIds && selectedIds.length) {

            var set = {};

            selectedIds.forEach(function(id) { set[id] = 1; });

            targets = ((eng.current ? [eng.current] : []).concat(eng.queue || [])).filter(function(it) { return it && set[it.id]; });

        }

        /* 收藏=锁定：当前选中版本已收藏的歌曲不参与重新生成（保持收藏版为当前台本，AI 不覆盖） */
        var favSkipped = 0, unlocked = [];

        targets.forEach(function(it) {

            if (_itemCurrentScriptFavorite(it)) favSkipped++;

            else unlocked.push(it);

        });

        targets = unlocked;

        if (!targets.length) {

            _toast(favSkipped ? '所选歌曲台本均已收藏锁定，无需重新生成' : '当前播放列表没有需要补写的台本');

            return;

        }

        eng.scriptBusy = true;

        targets.forEach(function(it, i) { it.v3ScriptKey = 'track_' + (i + 1) + '_' + it.id; });

        var lines = targets.map(function(it) {

            var s = it.song || {};

            return it.v3ScriptKey + '. ' + (s.title || s.query || '未命名歌曲') + (s.artist ? ' - ' + s.artist : '');

        }).join('\n');

        var output = '{"scripts":[{"key":"原样曲目key","host":"主持人名字","say":"[VoiceTag:主持人名字:朗读语言:发送给TTS的文本]“显示文本”"}]}';

        var prompt = _buildCommon(cfg.scriptRewritePrompt || cfg.promptTemplate || '', {

            songList: lines,

            taskRequirement: '不要推荐歌曲。请只为给定曲目逐首编写对应台本。',

            outputRequirement: '最终只返回合法 JSON：' + output

        });

        _setApiStatus('loading', 'v3-linked', '请求曲目关联台本', '', '');

        requestScriptChat([{ role: 'system', content: prompt }, { role: 'user', content: '请为这些曲目补写对应台本，并严格保留每个 key。' }],

        '请求曲目关联台本', 'v3-linked', function(text) {

            var scripts = _scriptsFromReturn(text) || [];

            var byKey = {};

            scripts.forEach(function(s) { byKey[s.key] = s; });

            var hasUsableScript = targets.some(function(it) {

                return byKey[it.v3ScriptKey] && byKey[it.v3ScriptKey].say;

            });

            if (!hasUsableScript) return false;

            eng.scriptBusy = false;

            var count = 0;

            targets.forEach(function(it) {

                var sc = byKey[it.v3ScriptKey];

                delete it.v3ScriptKey;

                if (!sc || !sc.say) return;

                it.say = sc.say;

                it.host = sc.host || '';

                it.needsScript = false;

                it.scriptFresh = true;

                it.spoken = false;

                count++;

                v3.saveSongScript(it, {

                    host: it.host,

                    say: it.say,

                    favorite: false,

                    label: '关联台本'

                });

            });

            eng.saveQueue();

            v3.save();

            _clearApiStatus('v3-linked');

            _toast('已更新 ' + count + ' 首歌曲的台本' + (favSkipped ? '（跳过 ' + favSkipped + ' 首已收藏锁定）' : ''));

            v3.uiRefresh();

            if (eng.current && eng.current.say && !eng.current.spoken) _speakItem(eng.current, false);

            return true;

        }, function(e) {

            eng.scriptBusy = false;

            targets.forEach(function(it) { delete it.v3ScriptKey; });

            _setApiStatus('error', 'v3-linked', '请求曲目关联台本', e, '');

            _toast('关联台本请求失败: ' + e);

        });

    };



    function companionPauseRules() {

        var minC = Math.max(0, _num(cfg.v3PauseMinCount, 3));

        var maxC = Math.max(0, _num(cfg.v3PauseMaxCount, 8));

        var count;

        if (minC && maxC) count = '停顿节点数量不少于 ' + Math.min(minC, maxC) + ' 个且不多于 ' + Math.max(minC, maxC) + ' 个。';

        else if (minC) count = '停顿节点数量不少于 ' + minC + ' 个。';

        else if (maxC) count = '停顿节点数量不多于 ' + maxC + ' 个。';

        else count = '停顿节点数量由内容自然决定。';

        var minSeconds = Math.max(0, _num(cfg.v3PauseMinSeconds, 5));

        var maxSeconds = Math.max(0, _num(cfg.v3PauseMaxSeconds, 30));

        return {

            count: count,

            seconds: '每个停顿必须作为 nodes 数组中的独立字符串输出，严格使用 "[pause=Ns]" 格式；N 必须在 ' + Math.min(minSeconds, maxSeconds) + ' 到 ' + Math.max(minSeconds, maxSeconds) + ' 之间。例如 24 秒写成 "[pause=24s]"。不得把标记写进主持人的朗读文本。'

        };

    }



    function companionRawNodes(obj) {

        if (Object.prototype.toString.call(obj) === '[object Array]') return { key: '$', value: obj };

        obj = obj || {};

        var candidates = [

            ['nodes', obj.nodes], ['segments', obj.segments], ['items', obj.items],

            ['script', obj.script],

            ['script.nodes', obj.script && obj.script.nodes],

            ['script.segments', obj.script && obj.script.segments],

            ['data.nodes', obj.data && obj.data.nodes],

            ['data.segments', obj.data && obj.data.segments],

            ['radioScript.nodes', obj.radioScript && obj.radioScript.nodes],

            ['radio_script.nodes', obj.radio_script && obj.radio_script.nodes]

        ];

        for (var i = 0; i < candidates.length; i++) {

            if (Object.prototype.toString.call(candidates[i][1]) === '[object Array]') {

                return { key: candidates[i][0], value: candidates[i][1] };

            }

        }

        function findNested(value, path, depth) {

            if (!value || typeof value !== 'object' || depth > 3) return null;

            var keys = Object.keys(value);

            for (var j = 0; j < keys.length; j++) {

                var child = value[keys[j]], childPath = path ? path + '.' + keys[j] : keys[j];

                if (Object.prototype.toString.call(child) === '[object Array]' && /nodes|segments|items|script/i.test(keys[j])) {

                    return { key: childPath, value: child };

                }

            }

            for (var k = 0; k < keys.length; k++) {

                var nested = findNested(value[keys[k]], path ? path + '.' + keys[k] : keys[k], depth + 1);

                if (nested) return nested;

            }

            return null;

        }

        var nestedResult = findNested(obj, '', 0);

        if (nestedResult) return nestedResult;

        return { key: '', value: [] };

    }



    function recordCompanionDebug(debug) {

        debug = debug || {};

        if (!debug.route) debug.route = eng.lastApiRoute || null;

        if (debug.source !== 'request-start' && !debug.apiSnapshot && eng.lastApiDebug) {

            try { debug.apiSnapshot = JSON.parse(JSON.stringify(eng.lastApiDebug)); } catch (eApi) {}

        }

        debug.recordedAt = new Date().toISOString();

        try { TOP.__vnmRadioLastCompanionDebug = debug; } catch (e) {}

        try { TOP.localStorage.setItem('pp-radio-last-companion-debug', JSON.stringify(debug)); } catch (e2) {}

        try {

            TOP.localStorage.setItem('pp-radio-last-companion-bundle', JSON.stringify({

                route: debug.route || null,

                api: debug.apiSnapshot || null,

                parser: debug

            }));

        } catch (e3) {}

        return debug;

    }



    function parseCompanion(text, debug) {

        var obj = _jsonFromText(text);

        var picked = companionRawNodes(obj);

        var raw = picked.value;

        if (Object.prototype.toString.call(raw) !== '[object Array]') raw = [];

        var hosts = _selectedHosts(eng.store || {});

        var fallback = hosts[0] && hosts[0].name || '主持人';

        var out = [];



        function pauseValue(seconds) {

            var min = Math.max(0, _num(cfg.v3PauseMinSeconds, 5));

            var max = Math.max(0, _num(cfg.v3PauseMaxSeconds, 30));

            return _clamp(_num(seconds, min || 5), Math.min(min, max), Math.max(min, max));

        }



        function pushPause(seconds) {

            out.push({ id: uid('pause'), type: 'pause', seconds: pauseValue(seconds) });

        }



        function markedParts(value) {

            value = String(value || '');

            var parts = [], re = /\[pause\s*=\s*(\d+(?:\.\d+)?)\s*s\]/ig, at = 0, m;

            while ((m = re.exec(value))) {

                if (m.index > at) parts.push({ type: 'speech', text: value.slice(at, m.index) });

                parts.push({ type: 'pause', seconds: m[1] });

                at = re.lastIndex;

            }

            if (at < value.length) parts.push({ type: 'speech', text: value.slice(at) });

            return parts;

        }



        function pushMarkedSpeech(host, tts, display) {

            var ttsParts = markedParts(tts);

            var displayParts = markedParts(display);

            var displaySpeech = displayParts.filter(function(p) { return p.type === 'speech'; });

            var displayIndex = 0;

            ttsParts.forEach(function(part) {

                if (part.type === 'pause') {

                    pushPause(part.seconds);

                    return;

                }

                var spoken = String(part.text || '').trim();

                var shown = displaySpeech[displayIndex] ? String(displaySpeech[displayIndex].text || '').trim() : spoken;

                displayIndex++;

                if (!spoken && !shown) return;

                out.push({ id: uid('speech'), type: 'speech', host: host, ttsText: spoken || shown, displayText: shown || spoken });

            });

        }



        var ignored = [];

        raw.forEach(function(n, rawIndex) {

            if (!n) return;

            if (typeof n === 'string') {

                var marker = /^\s*\[pause\s*=\s*(\d+(?:\.\d+)?)\s*s\]\s*$/i.exec(n);

                if (marker) pushPause(marker[1]);

                else pushMarkedSpeech(fallback, n, n);

                return;

            }

            if (n.type === 'pause' || n.pauseSeconds !== undefined || n.seconds !== undefined && !n.ttsText && !n.text) {

                pushPause(n.seconds !== undefined ? n.seconds : (n.pauseSeconds !== undefined ? n.pauseSeconds : n.duration));

                return;

            }

            var host = String(n.host || n.speaker || n.character || fallback).trim();

            var tts = String(n.ttsText || n.tts || n.speech || n.text || n.content || '').trim();

            var display = String(n.displayText || n.display || n.translation || tts).trim();

            if (!tts && !display) {

                ignored.push({ index: rawIndex, reason: '对象没有可识别的 ttsText/tts/speech/text/displayText 字段', value: n });

                return;

            }

            pushMarkedSpeech(host, tts || display, display || tts);

        });

        if (debug) {

            debug.contentJsonValid = !!obj;

            debug.parsedTopLevelType = Object.prototype.toString.call(obj);

            debug.parsedTopLevelKeys = obj && typeof obj === 'object' && Object.prototype.toString.call(obj) !== '[object Array]' ? Object.keys(obj) : [];

            debug.nodesSourceKey = picked.key;

            debug.rawNodeCount = raw.length;

            debug.rawFirstNode = raw.length ? raw[0] : null;

            debug.rawLastNode = raw.length ? raw[raw.length - 1] : null;

            debug.playableNodeCount = out.length;

            debug.speechCount = out.filter(function(n) { return n.type === 'speech'; }).length;

            debug.pauseCount = out.filter(function(n) { return n.type === 'pause'; }).length;

            debug.playableFirstNode = out.length ? out[0] : null;

            debug.playableLastNode = out.length ? out[out.length - 1] : null;

            debug.ignoredNodes = ignored;

            debug.failureReason = !obj ? '返回内容不是可解析的 JSON' : (!picked.key ? 'JSON 中未找到支持的 nodes/segments/items 数组' : (!out.length ? '节点数组存在，但没有节点能转换为 speech 或 pause' : ''));

        }

        return out;

    }



    v3.debugParseCompanion = function(text) {

        var debug = { source: 'manual-console', content: String(text || ''), contentChars: String(text || '').length };

        debug.nodes = parseCompanion(text, debug);

        return recordCompanionDebug(debug);

    };



    TOP._vnmRadioDiagnoseCompanion = function() {

        var api = TOP.__vnmRadioLastApi || null;

        var parser = TOP.__vnmRadioLastCompanionDebug || null;

        var route = TOP.__vnmRadioLastRoute || null;

        var bundle = null;

        try { bundle = JSON.parse(TOP.localStorage.getItem('pp-radio-last-companion-bundle') || 'null'); } catch (eBundle) {}

        try { if (!api) api = JSON.parse(TOP.localStorage.getItem('pp-radio-last-api-debug') || 'null'); } catch (e) {}

        try { if (!parser) parser = JSON.parse(TOP.localStorage.getItem('pp-radio-last-companion-debug') || 'null'); } catch (e2) {}

        try { if (!route) route = JSON.parse(TOP.localStorage.getItem('pp-radio-last-route-debug') || 'null'); } catch (eRoute) {}

        if (bundle && bundle.parser) parser = bundle.parser;

        if (bundle && bundle.api) api = bundle.api;

        else if (!api && parser && parser.apiSnapshot) api = parser.apiSnapshot;

        if (bundle && bundle.route) route = bundle.route;

        else if (!route && parser && parser.route) route = parser.route;

        var response = null, content = parser && parser.content || '';

        try {

            response = api && api.responseText ? JSON.parse(api.responseText) : null;

            if (!content) content = response && response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content || '';

        } catch (e3) {}

        var responseContent = response && response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content || '';

        var parserWasMissingOrStale = !parser || (responseContent && String(parser.content || '') !== String(responseContent));

        if (parserWasMissingOrStale && responseContent) {

            parser = { source: 'diagnostic-reparse', content: String(responseContent), contentChars: String(responseContent).length };

            try {

                parser.nodes = parseCompanion(responseContent, parser);

            } catch (reparseError) {

                parser.nodes = [];

                parser.failureReason = '诊断重新解析抛出异常：' + (reparseError && reparseError.message || String(reparseError));

            }

            parser.originalParserWasMissingOrStale = true;

            recordCompanionDebug(parser);

            content = responseContent;

        }

        var choice = response && response.choices && response.choices[0] || {};

        var parsedContent = _jsonFromText(responseContent);

        var firstReturnedItem = Object.prototype.toString.call(parsedContent) === '[object Array]' ? parsedContent[0] :

            parsedContent && (parsedContent.nodes || parsedContent.items || parsedContent.scripts || parsedContent.songs || [])[0];

        var formatDiagnosis = '';

        if (route && route.route === 'eng.request' && firstReturnedItem && firstReturnedItem.type === 'speech' &&

            !(firstReturnedItem.title || firstReturnedItem.song || firstReturnedItem.music || firstReturnedItem.track)) {

            formatDiagnosis = '请求实际走的是推荐模式 eng.request，但模型返回了陪伴模式 speech 数组；推荐模式需要歌曲 items/title/artist，所以应用会判定格式不符合。';

        } else if (route && route.route === 'eng.sendChat') {

            formatDiagnosis = '请求实际走的是 Songs 主页的“主播连线聊天”，这条入口只增加聊天消息，不会创建新的连续台本。要生成历史台本，请使用陪伴模式的请求按钮或台本库里的“请求完整台本”。';

        } else if (parser && parser.originalParserWasMissingOrStale && parser.playableNodeCount > 0) {

            formatDiagnosis = '原诊断缺少或错配了解析记录；本次已用同一份完整 content 重新解析成功。请刷新/重载新版 Radio 后再请求一次。';

        } else if (parser && parser.failureReason) {

            formatDiagnosis = parser.failureReason;

        }

        var historyStats = radioHistoryContextStats();

        var noStoredRequest = !api && !route && (!parser || parser.source === 'request-start');

        var conclusion = noStoredRequest ?

            '当前页面没有找到已完成的陪伴请求诊断记录。请刷新到新版后重新请求一次；新版会把路由、HTTP 原文和解析结果绑定保存。' :

            (api && api.httpStatus === 200 && choice.finish_reason === 'stop' ?

                ('API 正常完整返回。' + (formatDiagnosis ? ' ' + formatDiagnosis : '若应用仍报失败，请重点看 parser.failureReason / ignoredNodes。')) :

                '请结合 HTTP 状态、finish_reason、providerError 与 parser.failureReason 判断。');

        var report = {

            conclusion: conclusion,

            requestRoute: route && route.route,

            mode: route && route.mode,

            omitRecentHostTalk: bool(cfg.v3OmitRecentHostTalk, false),

            recentHostTalkChars: _recentRadioTalk(cfg.recommendChatMessages).length,

            historyContext: historyStats,

            diagnosis: formatDiagnosis || parser && parser.failureReason || conclusion,

            nodesSource: parser && parser.nodesSourceKey,

            playableNodes: parser && parser.playableNodeCount,

            speechCount: parser && parser.speechCount,

            pauseCount: parser && parser.pauseCount,

            failureReason: parser && parser.failureReason || '',

            api: {

                state: api && api.state,

                httpStatus: api && api.httpStatus,

                httpStatusText: api && api.httpStatusText,

                durationMs: api && api.durationMs,

                model: response && response.model || api && api.request && api.request.model,

                requestedMaxTokens: api && api.request && api.request.max_tokens,

                finishReason: choice.finish_reason || '',

                usage: response && response.usage || null,

                providerError: response && response.error || api && api.error || ''

            },

            route: route,

            formatDiagnosis: formatDiagnosis,

            parser: parser,

            fullContent: String(content || ''),

            rawResponseText: api && api.responseText || ''

        };

        try {

            TOP.console.group('VNM Radio 陪伴台本完整诊断');

            TOP.console.log('结论：' + report.conclusion);

            TOP.console.log('API / 解析摘要：', report);

            TOP.console.log('完整模型 content（字符串，不会折叠）：\n' + report.fullContent);

            TOP.console.log('完整 HTTP responseText（字符串，不会折叠）：\n' + report.rawResponseText);

            TOP.console.log('复制全部报告：copy(JSON.stringify(_vnmRadioDiagnoseCompanion(), null, 2))');

            TOP.console.groupEnd();

        } catch (e4) {}

        return report;

    };



    v3.requestCompanion = function(manual, options) {

        options = options || {};

        if (v3.state.localScriptMode) {

            if (manual) _toast('本地台本播放模式已开启，不会请求新的陪伴台本');

            return false;

        }

        if (eng.busy) return false;

        if (!manual && !v3.consumeAutoRequest()) return false;

        eng.busy = true;

        var words = Math.max(300, _num(cfg.v3CompanionWords, 3000));

        var pauseRules = companionPauseRules();

        var output = '{"nodes":[{"type":"speech","host":"主持人名字","ttsText":"发送给TTS的文本","displayText":"显示文本"},"[pause=15s]",{"type":"speech","host":"主持人名字","ttsText":"停顿后继续发送给TTS的文本","displayText":"停顿后继续显示的文本"}]}';

        var prompt = _buildCommon(cfg.v3CompanionPrompt || COMPANION_PROMPT_DEFAULT, {

            targetWords: String(words),

            pauseCountRequirement: pauseRules.count,

            pauseSecondsRequirement: pauseRules.seconds,

            outputRequirement: '最终只返回合法 JSON：' + output

        });

        var routeDebug = {

            route: 'v3.requestCompanion',

            mode: v3.state.mode,

            manual: !!manual,

            playImmediately: options.play !== false,

            playlistId: options.playlistId || (v3.currentPlaylist() || {}).id || 'now-playing',

            omitRecentHostTalk: bool(cfg.v3OmitRecentHostTalk, false),

            recentHostTalkChars: _recentRadioTalk(cfg.recommendChatMessages).length,

            historyContext: radioHistoryContextStats(),

            startedAt: new Date().toISOString()

        };

        eng.lastApiRoute = routeDebug;

        try { TOP.__vnmRadioLastRoute = routeDebug; } catch (eRoute) {}

        try { TOP.localStorage.setItem('pp-radio-last-route-debug', JSON.stringify(routeDebug)); } catch (eRouteStore) {}

        recordCompanionDebug({

            source: 'request-start',

            route: routeDebug,

            request: { targetWords: words, systemPromptChars: prompt.length, userPromptChars: 10 }

        });

        _setApiStatus('loading', 'v3-companion', '请求连续台本', '', '');

        requestScriptChat([{ role: 'system', content: prompt }, { role: 'user', content: '请生成连续陪伴台本。' }],

        '请求连续台本', 'v3-companion', function(text, retryAttempt) {

            var companionDebug = {

                source: 'request-success',

                route: routeDebug,

                request: { targetWords: words, systemPromptChars: prompt.length, userPromptChars: 10 },

                content: String(text || ''),

                contentChars: String(text || '').length,

                retryAttempt: retryAttempt

            };

            var nodes = [];

            try {

                nodes = parseCompanion(text, companionDebug);

            } catch (parseError) {

                companionDebug.failureReason = '陪伴台本解析抛出异常：' + (parseError && parseError.message || String(parseError));

                companionDebug.parseException = parseError && parseError.stack || String(parseError);

            }

            if (!nodes.length) {

                if (!companionDebug.failureReason) companionDebug.failureReason = '陪伴台本返回成功，但没有解析出可播放的台本节点';

                recordCompanionDebug(companionDebug);

                eng.busy = false;

                var parseFailure = new Error(companionDebug.failureReason);

                _setApiStatus('error', 'v3-companion', '解析连续台本', parseFailure, '');

                _toast('连续台本解析失败，请重试');

                if (options.onError) options.onError(parseFailure.message);

                v3.uiRefresh();

                return false;

            }

            recordCompanionDebug(companionDebug);

            eng.busy = false;

            var version = {

                id: uid('continuous'),

                playlistId: options.playlistId || (v3.currentPlaylist() || {}).id || 'now-playing',

                createdAt: Date.now(),

                title: '陪伴台本 ' + new Date().toLocaleString(),

                nodes: nodes,

                raw: text,

                favorite: false,

                edited: false

            };

            v3.state.continuousVersions.unshift(version);

            var favorites = v3.state.continuousVersions.filter(function(x) { return x.favorite; });

            var normalByPlaylist = {}, normal = [];

            v3.state.continuousVersions.filter(function(x) { return !x.favorite; }).forEach(function(x) {

                var pid = x.playlistId || 'now-playing';

                normalByPlaylist[pid] = normalByPlaylist[pid] || 0;

                if (normalByPlaylist[pid] < 5) {

                    normalByPlaylist[pid]++;

                    normal.push(x);

                }

            });

            v3.state.continuousVersions = favorites.concat(normal);

            v3.save();

            _clearApiStatus('v3-companion');

            if (options.play === false) {

                _toast('下一份陪伴台本已准备好');

                if (options.onReady) options.onReady(version);

            } else {

                v3.state.activeContinuousIds[version.playlistId] = version.id;

                v3.state.activeContinuousId = version.id;

                v3.save();

                _toast('连续台本已生成');

                v3.playContinuous(version.id);

            }

            v3.uiRefresh({

                scriptLibrary: true,

                playlistId: version.playlistId,

                focusPlaylist: !!manual,

                versionId: version.id

            });

            return true;

        }, function(e) {

            eng.busy = false;

            recordCompanionDebug({

                source: 'request-error',

                route: routeDebug,

                request: { targetWords: words, systemPromptChars: prompt.length, userPromptChars: 10 },

                providerError: e && e.message || String(e || '未知错误')

            });

            _setApiStatus('error', 'v3-companion', '请求连续台本', e, '');

            _toast('连续台本请求失败: ' + e);

            if (options.onError) options.onError(e);

        });

        return true;

    };



    v3.activeContinuous = function(playlistId) {

        playlistId = playlistId || (v3.currentPlaylist() || {}).id || 'now-playing';

        var arr = v3.state.continuousVersions || [];

        var activeId = v3.state.activeContinuousIds[playlistId] || '';

        for (var i = 0; i < arr.length; i++) if (arr[i].playlistId === playlistId && arr[i].id === activeId) return arr[i];

        for (var j = 0; j < arr.length; j++) if ((arr[j].playlistId || 'now-playing') === playlistId) return arr[j];

        return null;

    };



    v3.toggleContinuousFavorite = function(id) {

        var version = v3.continuousById(id);

        if (!version) return false;

        version.favorite = !version.favorite;

        version.favoritedAt = version.favorite ? Date.now() : 0;

        v3.save();

        v3.uiRefresh();

        return version.favorite;

    };



    v3.deleteContinuousVersion = function(id) {

        var version = v3.continuousById(id);

        if (!version || version.favorite) return false;

        if (v3.continuousRuntime && v3.continuousRuntime.versionId === id) v3.stopContinuous();

        var next = [];

        (v3.state.continuousVersions || []).forEach(function(item) {

            if (item && item.id !== id) next.push(item);

        });

        v3.state.continuousVersions = next;

        var playlistId = version.playlistId || 'now-playing';

        if (v3.state.activeContinuousIds[playlistId] === id) {

            var replacement = null;

            for (var i = 0; i < next.length; i++) {

                if ((next[i].playlistId || 'now-playing') === playlistId) {

                    replacement = next[i];

                    break;

                }

            }

            v3.state.activeContinuousIds[playlistId] = replacement ? replacement.id : '';

        }

        if (v3.state.activeContinuousId === id) v3.state.activeContinuousId = '';

        v3.state.localScriptQueue = (v3.state.localScriptQueue || []).filter(function(itemId) { return itemId !== id; });

        (version.audioCacheKeys || []).forEach(function(key) { cacheRecordDelete('audio', key).catch(function() {}); });

        (version.audioAssets || []).forEach(function(asset) {

            if (asset && asset.blobKey) cacheRecordDelete('audio', asset.blobKey).catch(function() {});

        });

        v3.save();

        v3.uiRefresh();

        return true;

    };



    function hostForName(name) {

        return _charByName(name || '', _selectedHosts(eng.store || {})) || _selectedHosts(eng.store || {})[0] || null;

    }



    v3.continuousById = function(id) {

        var found = null;

        (v3.state.continuousVersions || []).forEach(function(version) {

            if (version && version.id === id) found = version;

        });

        return found;

    };



    var audioCacheDbPromise = null;



    function openAudioCacheDb() {

        if (audioCacheDbPromise) return audioCacheDbPromise;

        audioCacheDbPromise = new TOP.Promise(function(resolve, reject) {

            if (!TOP.indexedDB) {

                reject(new Error('当前浏览器不支持本地语音缓存'));

                return;

            }

            var req = TOP.indexedDB.open('pp-radio-audio-cache-v1', 1);

            req.onupgradeneeded = function() {

                var db = req.result;

                if (!db.objectStoreNames.contains('audio')) db.createObjectStore('audio', { keyPath: 'key' });

                if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' });

            };

            req.onsuccess = function() { resolve(req.result); };

            req.onerror = function() { reject(req.error || new Error('本地语音缓存打开失败')); };

        });

        return audioCacheDbPromise;

    }



    function cacheRecordGet(storeName, key) {

        return openAudioCacheDb().then(function(db) {

            return new TOP.Promise(function(resolve, reject) {

                var req = db.transaction(storeName, 'readonly').objectStore(storeName).get(key);

                req.onsuccess = function() { resolve(req.result || null); };

                req.onerror = function() { reject(req.error || new Error('读取本地缓存失败')); };

            });

        });

    }



    function cacheRecordPut(storeName, value) {

        return openAudioCacheDb().then(function(db) {

            return new TOP.Promise(function(resolve, reject) {

                var req = db.transaction(storeName, 'readwrite').objectStore(storeName).put(value);

                req.onsuccess = function() { resolve(value); };

                req.onerror = function() { reject(req.error || new Error('写入本地缓存失败')); };

            });

        });

    }



    function cacheRecordDelete(storeName, key) {

        return openAudioCacheDb().then(function(db) {

            return new TOP.Promise(function(resolve, reject) {

                var req = db.transaction(storeName, 'readwrite').objectStore(storeName)["delete"](key);

                req.onsuccess = function() { resolve(); };

                req.onerror = function() { reject(req.error || new Error('删除本地缓存失败')); };

            });

        });

    }



    function speechNodes(version) {

        return (version && version.nodes || []).filter(function(node) { return node && node.type !== 'pause'; });

    }



    function audioAssetBlobKey(versionId, assetId) {

        return 'asset|' + versionId + '|' + assetId;

    }



    function autoMatchAsset(version, name) {

        var nodes = speechNodes(version);

        if (!nodes.length) return [];

        var lower = String(name || '').toLowerCase();

        var numberMatch = lower.match(/(?:^|[^\d])0*(\d{1,4})(?:[^\d]|$)/);

        if (numberMatch) {

            var index = _num(numberMatch[1], 0) - 1;

            if (nodes[index]) return [nodes[index].id];

        }

        var normalized = lower.replace(/\.[a-z0-9]{2,5}$/i, '').replace(/[\s_\-.[\]()（）【】]+/g, '');

        for (var i = 0; i < nodes.length; i++) {

            var text = String(nodes[i].displayText || nodes[i].ttsText || '').toLowerCase().replace(/[\s_\-.,，。！？!?；;:：'"“”‘’]+/g, '');

            if (normalized.length >= 6 && text.indexOf(normalized.slice(0, Math.min(18, normalized.length))) >= 0) return [nodes[i].id];

        }

        return [];

    }



    function mapAsset(version, assetId, nodeIds) {

        version.segmentAudioMap = version.segmentAudioMap || {};

        speechNodes(version).forEach(function(node) {

            var list = Object.prototype.toString.call(version.segmentAudioMap[node.id]) === '[object Array]' ? version.segmentAudioMap[node.id] : [];

            version.segmentAudioMap[node.id] = list.filter(function(id) { return id !== assetId; });

        });

        (nodeIds || []).forEach(function(nodeId) {

            var list = version.segmentAudioMap[nodeId] || (version.segmentAudioMap[nodeId] = []);

            if (list.indexOf(assetId) < 0) list.push(assetId);

        });

    }



    v3.setAudioAssetSegments = function(versionId, assetId, nodeIds) {

        var version = v3.continuousById(versionId);

        if (!version) return false;

        mapAsset(version, assetId, nodeIds || []);

        v3.save();

        v3.uiRefresh();

        return true;

    };



    v3.addAudioFiles = function(versionId, files, done) {

        var version = v3.continuousById(versionId);

        files = Array.prototype.slice.call(files || []);

        if (!version || !files.length) {

            done && done('没有选择音频文件');

            return;

        }

        version.audioAssets = version.audioAssets || [];

        var index = 0, added = [];

        function next() {

            if (index >= files.length) {

                v3.save();

                v3.uiRefresh();

                done && done(null, added);

                return;

            }

            var file = files[index++];

            var asset = {

                id: uid('audio'),

                name: file.name || ('音频 ' + index),

                kind: 'file',

                blobKey: '',

                createdAt: Date.now()

            };

            asset.blobKey = audioAssetBlobKey(version.id, asset.id);

            cacheRecordPut('audio', {

                key: asset.blobKey,

                versionId: version.id,

                assetId: asset.id,

                createdAt: Date.now(),

                type: file.type || 'audio/mpeg',

                blob: file

            }).then(function() {

                version.audioAssets.push(asset);

                mapAsset(version, asset.id, autoMatchAsset(version, asset.name));

                added.push(asset);

                next();

            }).catch(function(e) { done && done((e && e.message) || String(e)); });

        }

        next();

    };



    v3.addAudioUrls = function(versionId, urls, done) {

        var version = v3.continuousById(versionId);

        urls = (urls || []).map(function(url) { return String(url || '').trim(); }).filter(Boolean);

        if (!version || !urls.length) {

            done && done('没有可添加的音频 URL');

            return;

        }

        version.audioAssets = version.audioAssets || [];

        var added = [];

        urls.forEach(function(url, index) {

            var pathname = url.split(/[?#]/)[0];

            var decodedName = '';

            try { decodedName = decodeURIComponent(pathname.slice(pathname.lastIndexOf('/') + 1)); } catch (e) { decodedName = pathname.slice(pathname.lastIndexOf('/') + 1); }

            var asset = {

                id: uid('audio'),

                name: decodedName || ('URL 音频 ' + (index + 1)),

                kind: 'url',

                url: url,

                createdAt: Date.now()

            };

            version.audioAssets.push(asset);

            mapAsset(version, asset.id, autoMatchAsset(version, asset.name));

            added.push(asset);

        });

        v3.save();

        v3.uiRefresh();

        done && done(null, added);

    };



    v3.deleteAudioAsset = function(versionId, assetId, done) {

        var version = v3.continuousById(versionId);

        if (!version) return;

        var asset = null;

        version.audioAssets = (version.audioAssets || []).filter(function(item) {

            if (item.id === assetId) asset = item;

            return item.id !== assetId;

        });

        mapAsset(version, assetId, []);

        var finish = asset && asset.blobKey ? cacheRecordDelete('audio', asset.blobKey) : TOP.Promise.resolve();

        finish.catch(function() {}).then(function() {

            v3.save();

            v3.uiRefresh();

            done && done(null);

        });

    };



    function simpleHash(text) {

        text = String(text || '');

        var hash = 2166136261;

        for (var i = 0; i < text.length; i++) {

            hash ^= text.charCodeAt(i);

            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);

        }

        return (hash >>> 0).toString(36);

    }



    function voiceSignature(host) {

        var ch = hostForName(host) || {};

        return [

            _ttsProviderFor(ch),

            ch.ttsVoiceId || ch.fishVoiceId || '',

            ch.ttsSpeed || 1,

            ch.ttsLanguage || ''

        ].join('|');

    }



    function audioCacheKey(version, item) {

        // 用日文读音归一后的实际朗读文本作为缓存键：旧缓存（汉字人名念错音的音频）自动失效，
        // 新缓存为正确发音且文本固定时稳定命中，中文角色/无映射时文本不变不影响既有缓存。
        var _jt = _jpNameSpeechText(item.ttsText || '', hostForName(item.host));

        return [

            'continuous',

            version.id,

            item.id,

            simpleHash((item.host || '') + '\n' + _jt + '\n' + voiceSignature(item.host))

        ].join('|');

    }



    function safeFilePart(text) {

        return String(text || '').replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').replace(/[.\s]+$/g, '').slice(0, 80) || 'radio-script';

    }



    function ensureDirectoryPermission(handle, request) {

        if (!handle) return TOP.Promise.resolve(false);

        var options = { mode: 'readwrite' };

        if (!handle.queryPermission) return TOP.Promise.resolve(true);

        return handle.queryPermission(options).then(function(state) {

            if (state === 'granted') return true;

            if (request && handle.requestPermission) return handle.requestPermission(options).then(function(next) { return next === 'granted'; });

            return false;

        });

    }



    function getCacheDirectory(requestPermission) {

        return cacheRecordGet('meta', 'directory-handle').then(function(record) {

            var handle = record && record.handle;

            if (!handle) return null;

            return ensureDirectoryPermission(handle, requestPermission).then(function(ok) { return ok ? handle : null; });

        }).catch(function() { return null; });

    }



    v3.chooseCacheDirectory = function(done) {

        var picker = TOP.showDirectoryPicker;

        if (typeof picker !== 'function') {

            done && done('当前浏览器不支持选择电脑目录；仍可使用浏览器本地缓存');

            return;

        }

        picker.call(TOP, { mode: 'readwrite', id: 'pp-radio-audio-cache' }).then(function(handle) {

            return cacheRecordPut('meta', { key: 'directory-handle', handle: handle }).then(function() {

                v3.state.cacheDirectoryName = handle.name || '已选择目录';

                v3.save();

                done && done(null, v3.state.cacheDirectoryName);

            });

        }).catch(function(e) {

            if (e && e.name === 'AbortError') return;

            done && done((e && e.message) || String(e));

        });

    };



    function blobFromUrl(url) {

        return TOP.fetch(url).then(function(response) {

            if (!response.ok) throw new Error('读取语音片段失败 HTTP ' + response.status);

            return response.blob();

        });

    }



    function getDirectoryCachedBlob(version, item) {

        var fileName = version.audioFiles && version.audioFiles[item.cacheKey];

        if (!fileName || !version.audioDirectoryFolder) return TOP.Promise.resolve(null);

        return getCacheDirectory(false).then(function(root) {

            if (!root) return null;

            return root.getDirectoryHandle(version.audioDirectoryFolder).then(function(dir) {

                return dir.getFileHandle(fileName).then(function(fileHandle) { return fileHandle.getFile(); });

            });

        }).catch(function() { return null; });

    }



    function getCachedAudioBlob(version, item) {

        return cacheRecordGet('audio', item.cacheKey).then(function(record) {

            if (record && record.blob) return record.blob;

            return getDirectoryCachedBlob(version, item);

        }).catch(function() {

            return getDirectoryCachedBlob(version, item);

        });

    }



    function putCachedAudioBlob(version, item, blob) {

        version.audioCacheKeys = version.audioCacheKeys || [];

        if (version.audioCacheKeys.indexOf(item.cacheKey) < 0) version.audioCacheKeys.push(item.cacheKey);

        version.audioCachedAt = Date.now();

        return cacheRecordPut('audio', {

            key: item.cacheKey,

            versionId: version.id,

            itemId: item.id,

            createdAt: Date.now(),

            type: blob.type || 'audio/mpeg',

            blob: blob

        }).then(function() {

            // 已选本地缓存目录时，额外落一份 mp3 文件到本地文件夹，方便反复品鉴；未选目录静默跳过

            return writeDirectoryAudioFile(version, item, blob);

        });

    }



    function writeDirectoryAudioFile(version, item, blob) {

        return getCacheDirectory(false).then(function(root) {

            if (!root) return;

            if (!version.audioDirectoryFolder) {

                version.audioDirectoryFolder = safeFilePart((version.title || 'radio') + '-' + String(version.id || Date.now()).slice(-6));

            }

            version.audioFiles = version.audioFiles || {};

            var safeKey = safeFilePart(String(item.id || 'seg') + '-' + (item.host || 'host'));

            var ext = (blob.type || 'audio/mpeg').indexOf('wav') >= 0 ? 'wav' : 'mp3';

            var fileName = safeKey + '.' + ext;

            return root.getDirectoryHandle(version.audioDirectoryFolder, { create: true }).then(function(dir) {

                return writeBlobFile(dir, fileName, blob);

            }).then(function() {

                version.audioFiles[item.cacheKey] = fileName;

            });

        }).catch(function() {});

    }



    function writeBlobFile(dir, name, blob) {

        return dir.getFileHandle(name, { create: true }).then(function(handle) {

            return handle.createWritable();

        }).then(function(writer) {

            return writer.write(blob).then(function() { return writer.close(); });

        });

    }



    function splitSpeechSentences(text) {

        text = String(text || '').trim();

        if (!text) return [];

        var matches = text.match(/[^。！？!?；;\n]+[。！？!?；;]?/g) || [text];

        return matches.map(function(part) { return String(part || '').trim(); }).filter(Boolean);

    }



    function runtimeItems(version) {

        var out = [];

        var source = version.nodes || [];

        var segmentMap = version.segmentAudioMap || {};



        function appendSpeech(n) {

            var ttsText = String(n.ttsText || n.displayText || '').trim();

            if (!ttsText) return;

            var displayText = String(n.displayText || n.ttsText || '').trim();

            out.push({

                id: n.id,

                nodeId: n.id,

                nodeIds: n.nodeIds || [n.id],

                type: 'speech',

                host: n.host,

                ttsText: ttsText,

                displayText: displayText || ttsText,

                captionSentences: splitSpeechSentences(displayText || ttsText),

                firstPart: true,

                url: '',

                requesting: false,

                error: ''

            });

        }



        function finalize() {

            out.forEach(function(item) {

                if (item.type === 'speech') item.cacheKey = audioCacheKey(version, item);

            });

            var sourceOrder = {};

            speechNodes(version).forEach(function(node, index) { sourceOrder[node.id] = index; });

            var mapping = version.segmentAudioMap || {};

            var firstNodeByAsset = {};

            Object.keys(mapping).forEach(function(nodeId) {

                (mapping[nodeId] || []).forEach(function(assetId) {

                    if (!firstNodeByAsset[assetId] || sourceOrder[nodeId] < sourceOrder[firstNodeByAsset[assetId]]) firstNodeByAsset[assetId] = nodeId;

                });

            });

            out.forEach(function(item) {

                if (item.type !== 'speech') return;

                var mapped = [];

                (item.nodeIds || [item.nodeId]).forEach(function(nodeId) {

                    (mapping[nodeId] || []).forEach(function(assetId) {

                        if (mapped.indexOf(assetId) < 0) mapped.push(assetId);

                    });

                });

                item.mappedCovered = mapped.length > 0;

                item.mappedAssetIds = item.firstPart ? mapped.filter(function(assetId) {

                    return (item.nodeIds || [item.nodeId]).indexOf(firstNodeByAsset[assetId]) >= 0;

                }) : [];

                item.skipMapped = item.mappedCovered && !item.mappedAssetIds.length;

            });

            return out;

        }



        var pending = null;

        function flushPending() {

            if (!pending) return;

            appendSpeech(pending);

            pending = null;

        }

        source.forEach(function(n) {

            if (n.type === 'pause') {

                flushPending();

                out.push({ id: n.id, type: 'pause', seconds: n.seconds });

                return;

            }

            var hasMappedAudio = !!(segmentMap[n.id] && segmentMap[n.id].length);

            if (hasMappedAudio) {

                flushPending();

                appendSpeech(n);

                return;

            }

            if (!pending || pending.host !== n.host) {

                flushPending();

                pending = {

                    id: n.id,

                    nodeIds: [n.id],

                    host: n.host,

                    ttsText: String(n.ttsText || '').trim(),

                    displayText: String(n.displayText || n.ttsText || '').trim()

                };

                return;

            }

            pending.nodeIds.push(n.id);

            pending.ttsText += (pending.ttsText ? '\n' : '') + String(n.ttsText || '').trim();

            pending.displayText += (pending.displayText ? '\n' : '') + String(n.displayText || n.ttsText || '').trim();

        });

        flushPending();

        return finalize();

    }



    function companionAutoRequestEnabled() {

        return !v3.state.localScriptMode && bool(cfg.v3CompanionAutoRequest, true) && v3.state.mode === 'companion';

    }



    v3.ensureCompanionAutoStart = function(force) {

        if (!companionAutoRequestEnabled() || eng.busy) return false;

        var rt = v3.continuousRuntime;

        if (rt && !rt.stopped && !rt.finished) return false;

        var playlist = v3.currentPlaylist() || v3.playlist('now-playing');

        /* 历史库里有旧版本不代表当前已有台本在播放。只要陪伴模式

           没有活动运行时，就生成一份新的；旧版本仅供用户手动播放。 */

        var now = Date.now();

        if (!force && now - _num(v3.companionAutoStartAt, 0) < 30000) return false;

        v3.companionAutoStartAt = now;

        return !!v3.requestCompanion(false, {

            playlistId: playlist && playlist.id || 'now-playing'

        });

    };



    try { if (eng.__v3CompanionAutoWatch) TOP.clearInterval(eng.__v3CompanionAutoWatch); } catch (eWatch) {}

    eng.__v3CompanionAutoWatch = v3.companionAutoWatch = TOP.setInterval(function() {

        try { v3.ensureCompanionAutoStart(false); } catch (e) {}

    }, 1500);



    function nextCompanionTriggerIndex(items) {

        items = items || [];

        var lastSpeech = -1, i;

        /* 末尾 pause 仍会播放，但不参与“何时请求下一台本”的计算。 */

        for (i = items.length - 1; i >= 0; i--) {

            if (items[i] && items[i].type === 'speech') {

                lastSpeech = i;

                break;

            }

        }

        if (lastSpeech < 0) return -1;

        /* 最后一个有效 pause 后面的整组朗读，是最后一组有效台本。 */

        for (i = lastSpeech - 1; i >= 0; i--) {

            if (items[i] && items[i].type === 'pause') return i + 1;

        }

        return 0;

    }

    v3.nextCompanionTriggerIndex = nextCompanionTriggerIndex;



    function requestNextCompanion(rt) {

        if (!rt || rt.stopped || rt.nextRequested || !companionAutoRequestEnabled()) return false;

        if (v3.continuousSequence) return false;

        rt.nextRequested = true;

        rt.nextPending = true;

        rt.nextError = '';

        var started = v3.requestCompanion(false, {

            play: false,

            playlistId: rt.version && rt.version.playlistId || 'now-playing',

            onReady: function(version) {

                rt.nextPending = false;

                rt.nextVersionId = version.id;

                if (rt.stopped || v3.continuousRuntime !== rt) return;

                if (rt.waitingForNext) v3.playContinuous(version.id);

                else v3.uiRefresh();

            },

            onError: function(error) {

                rt.nextPending = false;

                rt.nextRequested = false;

                rt.nextError = error || '下一份台本请求失败';

                if (rt.waitingForNext) {

                    rt.finished = true;

                    rt.waitingForNext = false;

                }

                v3.uiRefresh();

            }

        });

        if (!started) {

            rt.nextRequested = false;

            rt.nextPending = false;

            return false;

        }

        v3.uiRefresh();

        return true;

    }



    function mappedAssetById(version, id) {

        var found = null;

        (version.audioAssets || []).forEach(function(asset) { if (asset && asset.id === id) found = asset; });

        return found;

    }



    function loadMappedAssetUrls(version, item) {

        var ids = item.mappedAssetIds || [];

        var jobs = ids.map(function(id) {

            var asset = mappedAssetById(version, id);

            if (!asset) return TOP.Promise.resolve(null);

            if (asset.kind === 'url' && asset.url) return TOP.Promise.resolve({ url: asset.url, assetId: asset.id, objectUrl: false });

            if (!asset.blobKey) return TOP.Promise.resolve(null);

            return cacheRecordGet('audio', asset.blobKey).then(function(record) {

                if (!record || !record.blob) return null;

                var url = (TOP.URL || URL).createObjectURL(record.blob);

                return { url: url, assetId: asset.id, objectUrl: true };

            });

        });

        return TOP.Promise.all(jobs).then(function(rows) { return rows.filter(Boolean); });

    }



    function prefetchContinuous(rt) {

        if (!rt || rt.stopped) return;

        var wanted = Math.max(1, _num(cfg.v3TtsPrefetch, 2)), active = 0;

        for (var i = rt.index; i < rt.items.length && active < wanted; i++) {

            var item = rt.items[i];

            if (item.type === 'pause') break;

            if (item.type !== 'speech' || item.url || item.urls || item.skipMapped || item.requesting || item.error) continue;

            if (i === rt.nextTriggerIndex) requestNextCompanion(rt);

            item.requesting = true;

            active++;

            (function(job) {

                if (job.mappedAssetIds && job.mappedAssetIds.length) {

                    loadMappedAssetUrls(rt.version, job).then(function(rows) {

                        job.requesting = false;

                        if (rows.length) {

                            job.urls = rows;

                            job.url = rows[0].url;

                            job.mappedIndex = 0;

                        } else {

                            job.error = '匹配的本地/URL 音频不可用';

                        }

                        v3.uiRefresh();

                        if (rt.waitingFor === job.id) playContinuousNext(rt);

                        prefetchContinuous(rt);

                    }).catch(function(e) {

                        job.requesting = false;

                        job.error = (e && e.message) || String(e);

                        if (rt.waitingFor === job.id) playContinuousNext(rt);

                    });

                    return;

                }

                getCachedAudioBlob(rt.version, job).then(function(blob) {

                    if (rt.stopped) return;

                    if (blob) {

                        job.requesting = false;

                        job.cached = true;

                        job.url = (TOP.URL || URL).createObjectURL(blob);

                        job.cachedObjectUrl = job.url;

                        v3.uiRefresh();

                        if (rt.waitingFor === job.id) playContinuousNext(rt);

                        prefetchContinuous(rt);

                        return;

                    }

                    var _ttsChN = hostForName(job.host);

                    _tts(_jpNameSpeechText(job.ttsText, _ttsChN), _ttsChN, function(url) {

                        job.requesting = false;

                        job.url = url;
                        blobFromUrl(url).then(function(generatedBlob) {
                            return putCachedAudioBlob(rt.version, job, generatedBlob);
                        }).then(function() {
                            rt.version.audioCacheEnabled = true;
                            v3.save();
                        }).catch(function() {});

                        v3.uiRefresh();

                        if (rt.waitingFor === job.id) playContinuousNext(rt);

                        prefetchContinuous(rt);

                    }, function(e) {

                        job.requesting = false;

                        job.error = e || 'TTS失败';

                        v3.uiRefresh();

                        if (rt.waitingFor === job.id) playContinuousNext(rt);

                        prefetchContinuous(rt);

                    });

                }).catch(function(e) {

                    job.requesting = false;

                    job.error = (e && e.message) || String(e);

                    v3.uiRefresh();

                });

            })(item);

        }

    }



    function clearCaptionTimer(rt) {

        if (!rt || !rt.captionTimer) return;

        try { TOP.clearInterval(rt.captionTimer); } catch (e) {}

        rt.captionTimer = null;

    }



    function recordContinuousSentence(rt, item, index, text) {

        text = String(text || '').trim();

        if (!rt || !item || !text) return;

        var key = String(item.id || rt.index) + ':' + index;

        rt.recordedCaptionKeys = rt.recordedCaptionKeys || {};

        if (rt.recordedCaptionKeys[key]) return;

        rt.recordedCaptionKeys[key] = true;

        var playlist = v3.playlist(rt.version && rt.version.playlistId || 'now-playing');

        var history = eng.store.chatHistory = eng.store.chatHistory || [];

        history.push({

            id: uid('continuous-message'),

            scriptId: rt.versionId,

            segmentIndex: index,

            role: 'assistant',

            kind: 'script',

            scriptKind: 'companion',

            host: item.host || '',

            song: playlist && playlist.name || '当前播放列表',

            content: text,

            display: text,

            tts: text,

            t: Date.now()

        });

        if (history.length > 400) history.splice(0, history.length - 400);

        eng.saveStore();

        try { TOP.dispatchEvent(new TOP.CustomEvent('pp-radio-chat-refresh')); } catch (e) {}

    }



    function startCaptionTracking(rt, item, audio) {

        clearCaptionTimer(rt);

        var sentences = item.captionSentences || [];

        if (!sentences.length) sentences = [item.displayText || item.ttsText || ''];

        rt.currentText = sentences[0] || '';

        rt.currentCaptionIndex = 0;

        recordContinuousSentence(rt, item, 0, rt.currentText);

        if (rt.captionPopup && rt.captionPopup.setText) {

            rt.captionPopup.setText((item.host ? item.host + '：' : '') + rt.currentText);

        }

        if (sentences.length < 2) return;

        var weights = [], total = 0;

        sentences.forEach(function(sentence) {

            var weight = Math.max(1, String(sentence || '').replace(/\s+/g, '').length);

            weights.push(weight);

            total += weight;

        });

        rt.captionTimer = TOP.setInterval(function() {

            if (rt.stopped || rt.audio !== audio) {

                clearCaptionTimer(rt);

                return;

            }

            var duration = Number(audio.duration) || 0;

            if (!duration || !isFinite(duration)) return;

            var target = Math.max(0, Math.min(1, (Number(audio.currentTime) || 0) / duration)) * total;

            var sum = 0, index = 0;

            for (var i = 0; i < weights.length; i++) {

                sum += weights[i];

                index = i;

                if (target <= sum) break;

            }

            rt.currentText = sentences[index] || sentences[sentences.length - 1] || '';

            if (rt.currentCaptionIndex !== index) {

                rt.currentCaptionIndex = index;

                recordContinuousSentence(rt, item, index, rt.currentText);

            }

            if (rt.captionPopup && rt.captionPopup.setText) {

                rt.captionPopup.setText((item.host ? item.host + '：' : '') + rt.currentText);

            }

        }, 180);

    }



    function startHostGap(rt) {

        var delay = 1000 + Math.floor(Math.random() * 1501);

        rt.hostGapDoneIndex = rt.index;

        rt.hostGapUntil = Date.now() + delay;

        rt.hostGapRemainingMs = delay;

        rt.currentItem = { type: 'host-gap' };

        rt.currentHost = '';

        rt.currentText = '主持人切换，稍停 ' + (delay / 1000).toFixed(1) + ' 秒';

        eng.duck(false);

        rt.hostGapTimer = TOP.setInterval(function() {

            if (rt.stopped) {

                TOP.clearInterval(rt.hostGapTimer);

                rt.hostGapTimer = null;

                return;

            }

            if (rt.paused) return;

            rt.hostGapRemainingMs = Math.max(0, rt.hostGapUntil - Date.now());

            if (rt.hostGapRemainingMs <= 0) {

                TOP.clearInterval(rt.hostGapTimer);

                rt.hostGapTimer = null;

                rt.currentItem = null;

                playContinuousNext(rt);

            }

        }, 100);

        prefetchContinuous(rt);

    }



    function playContinuousNext(rt) {

        if (!rt || rt.stopped || rt.paused || v3.continuousRuntime !== rt) return;

        if (rt.index >= rt.items.length) {

            eng.duck(false);

            rt.currentItem = null;

            rt.currentText = '';

            rt.currentHost = '';

            if (v3.continuousSequence && v3.continuousSequence.mode === 'shuffle' && v3.continuousSequence.ids.length) {

                var previousIndex = v3.continuousSequence.index;

                var randomIndex = Math.floor(Math.random() * v3.continuousSequence.ids.length);

                if (v3.continuousSequence.ids.length > 1 && randomIndex === previousIndex) {

                    randomIndex = (randomIndex + 1) % v3.continuousSequence.ids.length;

                }

                v3.continuousSequence.index = randomIndex;

                v3.playContinuous(v3.continuousSequence.ids[randomIndex], { preserveSequence: true });

                return;

            }

            if (v3.continuousSequence && v3.continuousSequence.index < v3.continuousSequence.ids.length - 1) {

                v3.continuousSequence.index++;

                v3.playContinuous(v3.continuousSequence.ids[v3.continuousSequence.index], { preserveSequence: true });

                return;

            }

            if (v3.continuousSequence) {

                if (v3.continuousSequence.mode === 'repeat' && v3.continuousSequence.ids.length) {

                    v3.continuousSequence.index = 0;

                    v3.playContinuous(v3.continuousSequence.ids[0], { preserveSequence: true });

                    return;

                }

                v3.continuousSequence = null;

                rt.finished = true;

                v3.uiRefresh();

                return;

            }

            if (companionAutoRequestEnabled()) {

                if (rt.nextVersionId) {

                    v3.playContinuous(rt.nextVersionId);

                    return;

                }

                if (rt.nextPending) {

                    rt.waitingForNext = true;

                    v3.uiRefresh();

                    return;

                }

                if (!rt.nextRequested && requestNextCompanion(rt)) {

                    rt.waitingForNext = true;

                    v3.uiRefresh();

                    return;

                }

            }

            rt.finished = true;

            if (v3.state.sleep && v3.state.sleep.loopExisting && !v3.state.sleep.expired) {

                rt.index = 0;

                rt.lastSpokenHost = '';

                rt.hostGapDoneIndex = -1;

                rt.items.forEach(function(x) { if (x.type === 'speech') { x.error = ''; } });

                playContinuousNext(rt);

                return;

            }

            v3.uiRefresh();

            return;

        }

        var item = rt.items[rt.index];

        if (item.type === 'pause') {

            eng.duck(false);

            rt.lastSpokenHost = '';

            rt.currentItem = item;

            rt.currentText = '停顿 ' + Math.max(0, _num(item.seconds, 0)) + ' 秒';

            rt.currentHost = '';

            var seconds = Math.max(0, _num(item.seconds, 0));

            rt.pauseUntil = Date.now() + seconds * 1000;

            rt.pauseTimer = TOP.setInterval(function() {

                if (rt.stopped) {

                    TOP.clearInterval(rt.pauseTimer);

                    rt.pauseTimer = null;

                    return;

                }

                rt.pauseRemaining = Math.max(0, Math.ceil((rt.pauseUntil - Date.now()) / 1000));

                v3.uiRefresh();

                if (Date.now() >= rt.pauseUntil) {

                    TOP.clearInterval(rt.pauseTimer);

                    rt.pauseTimer = null;

                    rt.pauseRemaining = 0;

                    rt.index++;

                    playContinuousNext(rt);

                }

            }, 250);

            prefetchContinuous(rt);

            return;

        }

        if (item.skipMapped) {

            rt.index++;

            playContinuousNext(rt);

            return;

        }

        if (rt.lastSpokenHost && item.host && rt.lastSpokenHost !== item.host && rt.hostGapDoneIndex !== rt.index) {

            startHostGap(rt);

            return;

        }

        prefetchContinuous(rt);

        if (!item.url && !item.error) {

            rt.waitingFor = item.id;

            return;

        }

        rt.waitingFor = '';

        if (item.error || !item.url) {

            rt.index++;

            playContinuousNext(rt);

            return;

        }

        try {

            var firstCaption = item.captionSentences && item.captionSentences.length ?

                item.captionSentences[0] : (item.displayText || item.ttsText);

            var cap = item.firstPart ? _popup((item.host ? item.host + '：' : '') + firstCaption) : null;

            rt.currentItem = item;

            rt.currentText = item.displayText || item.ttsText || '';

            rt.currentHost = item.host || '';

            rt.captionPopup = cap;

            eng.duck(true);

            var audio = new TOP.Audio(item.url);

            audio.volume = _clamp((cfg.voiceVolume === undefined ? 100 : cfg.voiceVolume) / 100, 0, 1);

            audio.__vnmContinuous = true;

            rt.audio = audio;

            eng.voice = audio;

            audio.muted = !!(eng.store && eng.store.muted);

            startCaptionTracking(rt, item, audio);

            audio.onended = function() {

                eng.duck(false);

                if (cap) cap.close();

                if (rt.captionPopup === cap) rt.captionPopup = null;

                clearCaptionTimer(rt);

                if (eng.voice === audio) eng.voice = null;

                rt.audio = null;

                if (item.urls && item.mappedIndex + 1 < item.urls.length) {

                    item.mappedIndex++;

                    item.url = item.urls[item.mappedIndex].url;

                    playContinuousNext(rt);

                    return;

                }

                rt.lastSpokenHost = item.host || rt.lastSpokenHost || '';

                if (rt.stopAfterCurrent) {

                    rt.stopped = true;

                    v3.continuousRuntime = null;

                    v3.uiRefresh();

                    return;

                }

                rt.index++;

                playContinuousNext(rt);

            };

            audio.onerror = function() {

                eng.duck(false);

                if (cap) cap.close();

                if (rt.captionPopup === cap) rt.captionPopup = null;

                clearCaptionTimer(rt);

                if (eng.voice === audio) eng.voice = null;

                rt.audio = null;

                rt.index++;

                playContinuousNext(rt);

            };

            audio.play();

        } catch (e) {

            eng.duck(false);

            clearCaptionTimer(rt);

            rt.index++;

            playContinuousNext(rt);

        }

    }



    v3.playContinuous = function(id, options) {

        options = options || {};

        var version = v3.continuousById(id);

        if (!version) return;

        function startPlay() {

        v3.stopContinuous(!!options.preserveSequence);

        v3.state.mode = 'companion';

        try {

            if (eng.voice) {

                eng.voice.onended = null;

                eng.voice.onerror = null;

                eng.voice.pause();

                eng.voice.src = '';

            }

        } catch (e) {}

        v3.state.activeContinuousId = version.id;

        v3.state.activeContinuousIds[version.playlistId || 'now-playing'] = version.id;

        var runtimeList = runtimeItems(version);

        var rt = v3.continuousRuntime = {

            versionId: id,

            version: version,

            items: runtimeList,

            index: 0,

            stopped: false,

            finished: false,

            waitingFor: '',

            paused: false,

            currentItem: null,

            currentText: '',

            currentHost: '',

            lastSpokenHost: '',

            hostGapDoneIndex: -1,

            nextTriggerIndex: nextCompanionTriggerIndex(runtimeList),

            nextRequested: false,

            nextPending: false,

            nextVersionId: '',

            waitingForNext: false,

            nextError: '',

            recordedCaptionKeys: {}

        };

        v3.save();

        prefetchContinuous(rt);

        playContinuousNext(rt);

        v3.uiRefresh();

        }

        /* 朗读前语言自检修复：设置项「朗读前自动检测修复台词语言」（默认开）。
         * 检测为本地正则毫秒级；仅当检测到语言不符才调修复专用模型（默认 GLM-5.3-Flash），
         * 失败降级继续朗读；修复期间状态显示在电台状态栏。 */
        if (cfg.autoFixLang !== false && version.nodes && version.nodes.length) {

            var _hosts = _selectedHosts(eng.store || {});

            var _need = _scanLangNeed(version.nodes, _hosts);

            if (_need.length) {

                if (v3._langFixBusy) {

                    startPlay();

                } else {

                    v3._langFixBusy = true;

                    _setApiStatus('loading', 'langFix', '台本语言自检修复中…', '', '');

                    _fixLangNodes(version.nodes, _hosts, { auto: true }, function(res) {

                        v3._langFixBusy = false;

                        _clearApiStatus('langFix');

                        if (res && res.status === 'done' && res.fixed > 0) {

                            version.edited = true;

                            v3.save();

                            _toast('朗读前已自动修复 ' + res.fixed + ' 段台词语言');

                        } else if (res && res.status === 'failed') {

                            _setApiStatus('error', 'langFix', '语言自动修复失败（已降级继续朗读）', res.error || '', '可点“查看上次 API 返回”查看原始返回');

                            _toast('语言自动修复失败，已继续朗读：' + (res.error || ''));

                        }

                        startPlay();

                    });

                    return;

                }

            }

        }

        startPlay();

    };



    v3.playContinuousSequence = function(ids) {

        ids = (ids || []).filter(function(id) { return !!v3.continuousById(id); });

        if (!ids.length) return false;

        v3.continuousSequence = { ids: ids.slice(), index: 0, mode: 'once' };

        v3.playContinuous(ids[0], { preserveSequence: true });

        return true;

    };



    v3.playLocalScriptQueue = function() {

        var ids = (v3.state.localScriptQueue || []).filter(function(id) { return !!v3.continuousById(id); });

        if (!ids.length) return false;

        var mode = v3.state.localScriptPlayMode || 'once';

        var index = mode === 'shuffle' && ids.length > 1 ? Math.floor(Math.random() * ids.length) : 0;

        v3.continuousSequence = { ids: ids.slice(), index: index, mode: mode, local: true };

        v3.playContinuous(ids[index], { preserveSequence: true });

        return true;

    };



    v3.setLocalScriptMode = function(on) {

        v3.state.localScriptMode = !!on;

        v3.save();

        v3.uiRefresh();

    };



    v3.pauseContinuous = function() {

        var rt = v3.continuousRuntime;

        if (!rt || rt.stopped || rt.paused) return false;

        rt.paused = true;

        if (rt.pauseTimer) {

            TOP.clearInterval(rt.pauseTimer);

            rt.pauseTimer = null;

            rt.pauseRemainingMs = Math.max(0, rt.pauseUntil - Date.now());

        }

        if (rt.hostGapTimer) {

            TOP.clearInterval(rt.hostGapTimer);

            rt.hostGapTimer = null;

            rt.hostGapRemainingMs = Math.max(0, rt.hostGapUntil - Date.now());

        }

        try { if (rt.audio) rt.audio.pause(); } catch (e) {}

        eng.duck(false);

        v3.uiRefresh();

        return true;

    };



    v3.resumeContinuous = function() {

        var rt = v3.continuousRuntime;

        if (!rt || rt.stopped || !rt.paused) return false;

        rt.paused = false;

        if (rt.currentItem && rt.currentItem.type === 'host-gap') {

            rt.hostGapUntil = Date.now() + Math.max(0, rt.hostGapRemainingMs || 0);

            rt.hostGapTimer = TOP.setInterval(function() {

                if (rt.stopped || rt.paused) return;

                rt.hostGapRemainingMs = Math.max(0, rt.hostGapUntil - Date.now());

                if (rt.hostGapRemainingMs <= 0) {

                    TOP.clearInterval(rt.hostGapTimer);

                    rt.hostGapTimer = null;

                    rt.currentItem = null;

                    playContinuousNext(rt);

                }

            }, 100);

        } else if (rt.currentItem && rt.currentItem.type === 'pause') {

            rt.pauseUntil = Date.now() + Math.max(0, rt.pauseRemainingMs || rt.pauseRemaining * 1000 || 0);

            rt.pauseTimer = TOP.setInterval(function() {

                if (rt.stopped || rt.paused) return;

                rt.pauseRemaining = Math.max(0, Math.ceil((rt.pauseUntil - Date.now()) / 1000));

                v3.uiRefresh();

                if (Date.now() >= rt.pauseUntil) {

                    TOP.clearInterval(rt.pauseTimer);

                    rt.pauseTimer = null;

                    rt.pauseRemaining = 0;

                    rt.index++;

                    playContinuousNext(rt);

                }

            }, 250);

        } else if (rt.audio) {

            eng.duck(true);

            try { rt.audio.play(); } catch (e) {}

        } else {

            playContinuousNext(rt);

        }

        v3.uiRefresh();

        return true;

    };



    v3.currentContinuousLine = function() {

        var rt = v3.continuousRuntime;

        if (!rt || rt.stopped) return null;

        var playlist = v3.playlist(rt.version && rt.version.playlistId || 'now-playing');

        return {

            versionId: rt.versionId,

            versionTitle: rt.version && rt.version.title || '',

            playlistId: rt.version && rt.version.playlistId || 'now-playing',

            playlistName: playlist && playlist.name || '当前播放列表',

            host: rt.currentHost || '',

            text: rt.currentText || '',

            paused: !!rt.paused,

            finished: !!rt.finished,

            waiting: !!rt.waitingForNext

        };

    };



    v3.stopContinuous = function(preserveSequence) {

        var rt = v3.continuousRuntime;

        if (!preserveSequence) v3.continuousSequence = null;

        if (!rt) return;

        rt.stopped = true;

        try { if (rt.pauseTimer) TOP.clearInterval(rt.pauseTimer); } catch (e) {}

        try { if (rt.hostGapTimer) TOP.clearInterval(rt.hostGapTimer); } catch (e1) {}

        clearCaptionTimer(rt);

        try { if (rt.captionPopup) rt.captionPopup.close(); } catch (eCaption) {}

        rt.captionPopup = null;

        try { if (rt.audio) rt.audio.pause(); } catch (e2) {}

        if (eng.voice === rt.audio) eng.voice = null;

        (rt.items || []).forEach(function(item) {

            if (!item) return;

            if (item.cachedObjectUrl) {

                try { (TOP.URL || URL).revokeObjectURL(item.cachedObjectUrl); } catch (e3) {}

                item.cachedObjectUrl = '';

            }

            (item.urls || []).forEach(function(row) {

                if (row && row.objectUrl) {

                    try { (TOP.URL || URL).revokeObjectURL(row.url); } catch (e4) {}

                }

            });

        });

        eng.duck(false);

        v3.continuousRuntime = null;

        v3.uiRefresh();

    };



    v3.requestCurrentMode = function(manual) {

        var mode = v3.state.mode;

        if (mode === 'playlist') v3.requestLinkedScripts(manual);

        else if (mode === 'companion') v3.requestCompanion(manual);

        else eng.request(eng.store.userNote || '');

    };



    v3.manualRequest = function() {

        v3.manualApiBypass = true;

        try { v3.requestCurrentMode(true); }

        finally { v3.manualApiBypass = false; }

    };



    v3.recommendSongsOnly = function(songs, note, done) {

        if (eng.busy) return;

        eng.busy = true;

        var list = (songs || []).map(function(s, i) {

            return (i + 1) + '. ' + (s.title || '') + (s.artist ? ' - ' + s.artist : '');

        }).join('\n');

        var prompt = _buildCommon((cfg.promptTemplate || '') + '\n\n{{只推荐歌曲要求}}', {

            songList: list,

            userInput: note || '',

            recommendOnly: true,

            taskRequirement: '参考给定歌曲和临时要求，推荐一批真实存在的新歌曲，不写台本。',

            outputRequirement: '只返回 {"songs":[{"title":"真实歌名","artist":"真实歌手"}]}'

        });

        _chat([{ role: 'system', content: prompt }, { role: 'user', content: '参考曲目：\n' + list + '\n\n临时要求：\n' + (note || '无') }], function(text) {

            eng.busy = false;

            var obj = _tryJson(text) || {}, arr = obj.songs || obj.items || [];

            var out = [];

            (arr || []).forEach(function(x) {

                var s = x.song || x;

                if (s && (s.title || s.name)) out.push(cleanSong(s));

            });

            done && done(null, out);

            v3.uiRefresh();

        }, function(e) {

            eng.busy = false;

            done && done(e || '推荐失败');

        });

    };



    v3.startSleep = function(minutes, requestLimit, loopExisting, stopBehavior) {

        v3.cancelSleep(false);

        minutes = Math.max(0.05, parseFloat(minutes) || 30);

        var sleep = v3.state.sleep = {

            active: true,

            startedAt: Date.now(),

            endsAt: Date.now() + minutes * 60000,

            durationMinutes: minutes,

            requestLimit: Math.max(0, _num(requestLimit, 5)),

            remainingRequests: Math.max(0, _num(requestLimit, 5)),

            limitEnabled: true,

            loopExisting: !!loopExisting,

            stopBehavior: stopBehavior || 'current',

            expired: false

        };

        v3.save();

        v3.sleepTimer = TOP.setInterval(function() {

            var s = v3.state.sleep;

            if (!s || !s.active) return;

            s.remainingMs = Math.max(0, s.endsAt - Date.now());

            if (s.remainingMs <= 0 && !s.expired) v3.expireSleep();

            v3.uiRefresh();

        }, 500);

        v3.uiRefresh();

    };



    v3.consumeAutoRequest = function() {

        var s = v3.state.sleep;

        if (!s || !s.active || !s.limitEnabled) return true;

        if (s.expired || s.remainingRequests <= 0) return false;

        s.remainingRequests--;

        v3.save();

        v3.uiRefresh();

        return true;

    };



    v3.expireSleep = function() {

        var s = v3.state.sleep;

        if (!s) return;

        s.expired = true;

        s.remainingMs = 0;

        /* 倒计时只禁止续播；当前歌曲自然播完后，再一次性停止所有声道。 */

        v3.sleepStopPending = true;

        v3.save();

        var check = TOP.setInterval(function() {

            if (!s.active || !s.expired) {

                TOP.clearInterval(check);

                return;

            }

            var musicDone = true;

            try {

                var music = eng.music;

                var hasTrack = !!(music && (music.currentSrc || music.src));

                var duration = music && Number(music.duration) || 0;

                musicDone = !hasTrack || !!music.ended ||

                    (duration > 0 && isFinite(duration) && Number(music.currentTime || 0) >= duration - 0.12);

            } catch (e) {}

            if (!musicDone) return;

            TOP.clearInterval(check);

            try { if (eng.music) eng.music.pause(); } catch (e1) {}

            try {

                if (eng.voice && (!v3.continuousRuntime || eng.voice !== v3.continuousRuntime.audio)) {

                    eng.voice.pause();

                    eng.voice.src = '';

                    eng.voice = null;

                }

            } catch (e2) {}

            v3.stopContinuous();

            v3.stopAllBackgrounds();

            v3.sleepStopPending = false;

            eng.running = false;

            eng.paused = true;

            s.active = false;

            try { if (v3.sleepTimer) TOP.clearInterval(v3.sleepTimer); } catch (e3) {}

            v3.sleepTimer = null;

            v3.save();

            v3.uiRefresh();

        }, 400);

        v3.uiRefresh();

    };



    v3.cancelSleep = function(save) {

        try { if (v3.sleepTimer) TOP.clearInterval(v3.sleepTimer); } catch (e) {}

        v3.sleepTimer = null;

        v3.sleepStopPending = false;

        if (v3.state.sleep) v3.state.sleep.active = false;

        if (save !== false) v3.save();

        v3.uiRefresh();

    };



    v3.sleepLabel = function() {

        var s = v3.state.sleep;

        if (!s || !s.active) return '';

        var ms = Math.max(0, s.endsAt - Date.now()), total = Math.ceil(ms / 1000);

        var h = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), sec = total % 60;

        function two(n) { return n < 10 ? '0' + n : String(n); }

        return (h ? h + ':' : '') + (h ? two(m) : m) + ':' + two(sec);

    };



    function advancedKey(song) {

        return song && (song.id || songKey(song));

    }

    v3.backgroundKey = advancedKey;



    function backgroundBaseVolume(adv) {

        adv = adv || {};

        if ((adv.volumeMode || 'global') === 'custom') return _clamp(_num(adv.volume, 55) / 100, 0, 1);

        return _clamp(_num(v3.state.backgroundMasterVolume, 100) / 100, 0, 1);

    }



    function backgroundTargetVolume(adv, ducked) {

        adv = adv || {};

        var base = backgroundBaseVolume(adv);

        if (!ducked) return base;

        var mode = adv.duckMode;

        if (!mode) mode = adv.duck === true ? 'custom' : (adv.duck === false ? 'none' : 'follow');

        if (mode === 'none') return base;

        if (mode === 'custom') return _clamp(_num(adv.duckVolume, 20) / 100, 0, 1);

        if (cfg.speechDuck === false) return base;

        return _clamp(_num(cfg.duckVolume, 20) / 100, 0, 1);

    }



    v3.refreshBackgroundVolumes = function() {

        Object.keys(v3.audio).forEach(function(k) {

            var rec = v3.audio[k], adv = rec.song.advanced || {};

            if (rec.audio) rec.audio.volume = backgroundTargetVolume(adv, !!v3.backgroundDucked);

        });

    };



    v3.advancedSongs = function() {

        var out = [], seen = {};

        v3.playlists().forEach(function(pl) {

            (pl.songs || []).forEach(function(song) {

                if (!song.advanced || !song.url) return;

                var k = advancedKey(song);

                if (!seen[k]) { seen[k] = 1; out.push(song); }

            });

        });

        return out;

    };



    v3.playBackground = function(song) {

        song = song || {};

        var k = advancedKey(song);

        if (!k || !song.url) return;

        var existing = v3.audio[k];

        if (existing && existing.audio) {

            try {

                existing.audio.play();

                existing.paused = false;

                existing.masterPaused = false;

                v3.state.backgroundSelection[k] = true;

                v3.save();

                v3.uiRefresh();

                return;

            } catch (resumeError) {}

        }

        v3.stopBackground(k);

        try {

            var a = new TOP.Audio(song.url);

            var adv = song.advanced || {};

            a.loop = adv.loop !== false;

            a.volume = backgroundTargetVolume(adv, !!v3.backgroundDucked);

            a.muted = !!(eng.store && eng.store.muted);

            a.onerror = function() {

                v3.state.backgroundSelection[k] = false;

                adv.error = '播放失败';

                v3.save();

                v3.uiRefresh();

            };

            a.play();

            v3.audio[k] = { audio: a, song: song, paused: false, masterPaused: false };

            v3.state.backgroundSelection[k] = true;

            v3.state.backgroundChecked[k] = true;

            adv.error = '';

            v3.save();

            v3.uiRefresh();

        } catch (e) {

            song.advanced.error = (e && e.message) || '播放失败';

            v3.uiRefresh();

        }

    };



    v3.backgroundIsPlaying = function(key) {

        var rec = v3.audio[key];

        return !!(rec && rec.audio && !rec.audio.paused && !rec.paused);

    };



    v3.pauseBackground = function(key, master, silent) {

        var rec = v3.audio[key];

        if (!rec || !rec.audio) return false;

        try { rec.audio.pause(); } catch (e) {}

        rec.paused = true;

        rec.masterPaused = !!master;

        v3.state.backgroundSelection[key] = false;

        if (!silent) {

            v3.save();

            v3.uiRefresh();

        }

        return true;

    };



    v3.resumeBackground = function(key, master, silent) {

        var rec = v3.audio[key];

        if (!rec || !rec.audio) return false;

        try { rec.audio.play(); } catch (e) { return false; }

        rec.paused = false;

        rec.masterPaused = false;

        v3.state.backgroundSelection[key] = true;

        if (!silent) {

            v3.save();

            v3.uiRefresh();

        }

        return true;

    };



    v3.stopBackground = function(key) {

        var rec = v3.audio[key];

        if (rec && rec.audio) {

            try { rec.audio.pause(); rec.audio.src = ''; } catch (e) {}

        }

        delete v3.audio[key];

        v3.state.backgroundSelection[key] = false;

        v3.save();

        v3.uiRefresh();

    };



    v3.playSelectedBackgrounds = function() {

        v3.advancedSongs().forEach(function(song) {

            if (v3.state.backgroundChecked[advancedKey(song)]) v3.playBackground(song);

        });

    };



    v3.stopAllBackgrounds = function() {

        Object.keys(v3.audio).forEach(function(k) { v3.stopBackground(k); });

    };



    /* 主播放键的图标始终由歌曲状态决定。辅助声道只跟随总暂停/继续，

       各自单独开启或暂停不会反向改变歌曲按钮。 */

    v3.masterPauseSnapshot = v3.masterPauseSnapshot || { continuous: null, backgrounds: {} };

    var playPauseMusicOnly = eng.playPause;

    eng.playPause = function(note) {

        var pausing = !!(eng.running && !eng.paused);

        var rt = v3.continuousRuntime;

        if (pausing) {

            v3.masterPauseSnapshot = { continuous: null, backgrounds: {} };

            if (rt && !rt.stopped && !rt.paused) {

                v3.masterPauseSnapshot.continuous = rt;

            }

            Object.keys(v3.audio).forEach(function(key) {

                if (v3.backgroundIsPlaying(key)) v3.masterPauseSnapshot.backgrounds[key] = true;

            });

            playPauseMusicOnly.apply(eng, arguments);

            if (v3.masterPauseSnapshot.continuous === rt) v3.pauseContinuous();

            Object.keys(v3.masterPauseSnapshot.backgrounds).forEach(function(key) {

                v3.pauseBackground(key, true, true);

            });

            v3.save();

            v3.uiRefresh();

            return;

        }



        var continuousAudio = rt && rt.audio && eng.voice === rt.audio ? rt.audio : null;

        if (continuousAudio) eng.voice = null;

        try {

            playPauseMusicOnly.apply(eng, arguments);

        } finally {

            if (continuousAudio && v3.continuousRuntime === rt && !rt.stopped) eng.voice = continuousAudio;

        }

        var snapshot = v3.masterPauseSnapshot || { continuous: null, backgrounds: {} };

        if (snapshot.continuous && snapshot.continuous === v3.continuousRuntime && snapshot.continuous.paused) {

            v3.resumeContinuous();

        }

        Object.keys(snapshot.backgrounds || {}).forEach(function(key) {

            var rec = v3.audio[key];

            if (rec && rec.masterPaused) v3.resumeBackground(key, true, true);

        });

        v3.masterPauseSnapshot = { continuous: null, backgrounds: {} };

        v3.save();

        v3.uiRefresh();

    };



    v3.toggleContinuousFromHostOrb = function() {

        if (v3.state.mode !== 'companion') return false;

        var rt = v3.continuousRuntime;

        if (!rt || rt.stopped || rt.finished) return false;

        if (rt.paused) {

            v3.resumeContinuous();

            if (v3.masterPauseSnapshot && v3.masterPauseSnapshot.continuous === rt) {

                v3.masterPauseSnapshot.continuous = null;

            }

        } else {

            v3.pauseContinuous();

            if (v3.masterPauseSnapshot) v3.masterPauseSnapshot.continuous = null;

        }

        return true;

    };



    var oldDuck = eng.duck;

    eng.duck = function(on) {

        oldDuck(on);

        v3.backgroundDucked = !!on;

        v3.refreshBackgroundVolumes();

    };



    v3.fadeStopAll = function(ms) {

        ms = Math.max(250, _num(ms, 8000));

        var audios = [];

        if (eng.music) audios.push(eng.music);

        if (eng.voice) audios.push(eng.voice);

        Object.keys(v3.audio).forEach(function(k) { if (v3.audio[k].audio) audios.push(v3.audio[k].audio); });

        var starts = audios.map(function(a) { return Number(a.volume) || 0; }), start = Date.now();

        var timer = TOP.setInterval(function() {

            var p = Math.min(1, (Date.now() - start) / ms);

            audios.forEach(function(a, i) { try { a.volume = starts[i] * (1 - p); } catch (e) {} });

            if (p >= 1) {

                TOP.clearInterval(timer);

                audios.forEach(function(a) { try { a.pause(); } catch (e) {} });

                v3.stopAllBackgrounds();

                v3.stopContinuous();

            }

        }, 80);

    };



    function downloadBlob(blob, name) {

        var url = (TOP.URL || URL).createObjectURL(blob);

        var a = TOPDOC.createElement('a');

        a.href = url;

        a.download = name;

        a.style.display = 'none';

        (TOPDOC.body || TOPDOC.documentElement).appendChild(a);

        a.click();

        TOP.setTimeout(function() {

            try { a.remove(); (TOP.URL || URL).revokeObjectURL(url); } catch (e) {}

        }, 3000);

    }



    v3.cacheContinuous = function(versionId, progress, done) {

        var version = v3.continuousById(versionId);

        if (!version) {

            done && done('没有台本');

            return;

        }

        var allItems = runtimeItems(version);

        var speechItems = allItems.filter(function(item) { return item.type === 'speech'; });

        if (!speechItems.length) {

            done && done('台本中没有可生成的朗读段');

            return;

        }

        version.audioCacheEnabled = true;

        TOP.Promise.resolve().then(function() {

            var index = 0;

            function next() {

                if (index >= speechItems.length) {

                    var validKeys = speechItems.map(function(item) { return item.cacheKey; });

                    (version.audioCacheKeys || []).forEach(function(key) {

                        if (validKeys.indexOf(key) < 0) cacheRecordDelete('audio', key).catch(function() {});

                    });

                    version.audioCacheKeys = validKeys;

                    version.audioCacheComplete = true;

                    version.audioCacheCount = speechItems.length;

                    version.audioCachedAt = Date.now();

                    version.audioCacheLayout = 'host-turn-v1';

                    // 保留 audioDirectoryFolder / audioFiles：本地目录缓存映射，不要删除

                    v3.save();

                    v3.uiRefresh();

                    done && done(null, { count: speechItems.length });

                    return;

                }

                var item = speechItems[index];

                progress && progress(index + 1, speechItems.length, item);

                function persist(blob) {

                    return putCachedAudioBlob(version, item, blob);

                }

                getCachedAudioBlob(version, item).then(function(blob) {

                    if (blob) return persist(blob);

                    return new TOP.Promise(function(resolve, reject) {

                        _tts(item.ttsText, hostForName(item.host), function(url) {

                            blobFromUrl(url).then(resolve).catch(reject);

                        }, reject);

                    }).then(persist);

                }).then(function() {

                    index++;

                    v3.save();

                    next();

                }).catch(function(e) {

                    done && done((e && e.message) || String(e));

                });

            }

            next();

        }).catch(function(e) {

            done && done((e && e.message) || String(e));

        });

    };



    v3.clearContinuousCache = function(versionId, done) {

        var version = v3.continuousById(versionId);

        if (!version) {

            done && done('没有台本');

            return;

        }

        var keys = (version.audioCacheKeys || []).slice();

        var index = 0;

        function next() {

            if (index >= keys.length) {

                version.audioCacheKeys = [];

                version.audioCacheComplete = false;

                version.audioCacheCount = 0;

                version.audioCachedAt = 0;

                version.audioCacheEnabled = false;

                v3.save();

                v3.uiRefresh();

                /* 同时删除本地缓存目录里该台本的 mp3 文件，否则清除后播放仍会从本地目录读回旧语音 */

                var files = version.audioFiles || {};

                var names = Object.keys(files);

                if (!names.length || !version.audioDirectoryFolder) { done && done(null); return; }

                getCacheDirectory(false).then(function(root) {

                    if (!root) { done && done(null); return; }

                    return root.getDirectoryHandle(version.audioDirectoryFolder).then(function(dir) {

                        var p = TOP.Promise.resolve();

                        names.forEach(function(k) {

                            var fn = files[k];

                            if (!fn) return;

                            p = p.then(function() { return dir.getFileHandle(fn).then(function(h) { return h.remove(); }).catch(function() {}); });

                        });

                        return p;

                    }).catch(function() {});

                }).then(function() {

                    version.audioFiles = {};

                    v3.save();

                    done && done(null);

                });

                return;

            }

            cacheRecordDelete('audio', keys[index++]).then(next).catch(next);

        }

        next();

    };



    v3.exportContinuous = function(versionId, progress, done) {

        var version = null;

        (v3.state.continuousVersions || []).forEach(function(v) { if (v.id === versionId) version = v; });

        if (!version) { done && done('没有台本'); return; }

        var items = runtimeItems(version).filter(function(x) { return x.type === 'speech'; });

        if (!items.length) { done && done('台本中没有可导出的朗读语音'); return; }

        var chunks = [], index = 0;

        function next() {

            if (index >= items.length) {

                var blob = new TOP.Blob(chunks, { type: 'audio/mpeg' });

                downloadBlob(blob, safeFilePart(version.title || '连续台本') + '-完整语音.mp3');

                version.audioCacheComplete = true;

                version.audioCacheCount = items.length;

                version.audioCachedAt = Date.now();

                version.audioCacheEnabled = true;

                v3.save();

                done && done(null, { count: items.length, size: blob.size });

                return;

            }

            var item = items[index++];

            progress && progress(index, items.length);

            getCachedAudioBlob(version, item).then(function(cached) {

                if (cached) return cached;

                return new TOP.Promise(function(resolve, reject) {

                    _tts(item.ttsText, hostForName(item.host), function(url) {

                        blobFromUrl(url).then(function(blob) {

                            putCachedAudioBlob(version, item, blob).then(function() { resolve(blob); }).catch(reject);

                        }).catch(reject);

                    }, reject);

                });

            }).then(function(blobPart) {

                return blobPart.arrayBuffer();

            }).then(function(buf) {

                    chunks.push(buf);

                    next();

            }).catch(function(e) { done && done((e && e.message) || String(e)); });

        }

        next();

    };



    function scriptFileContinuous(version) {

        var copy = clone(version || {});

        delete copy.audioCacheKeys;

        delete copy.audioCacheComplete;

        delete copy.audioCacheCount;

        delete copy.audioCachedAt;

        delete copy.audioCacheEnabled;

        delete copy.audioFiles;

        delete copy.audioDirectoryFolder;

        delete copy.audioAssets;

        delete copy.segmentAudioMap;

        return copy;

    }



    function mergeScriptVersionLists(current, incoming) {

        var byId = {}, out = [];

        (current || []).concat(incoming || []).forEach(function(version) {

            if (!version || !String(version.say || '').trim()) return;

            var id = String(version.id || uid('script'));

            var copy = clone(version);

            copy.id = id;

            if (byId[id] !== undefined) {

                var previous = out[byId[id]];

                copy.favorite = !!(copy.favorite || previous.favorite);

                out[byId[id]] = copy;

            } else {

                byId[id] = out.length;

                out.push(copy);

            }

        });

        out.sort(function(a, b) {

            if (!!a.favorite !== !!b.favorite) return a.favorite ? -1 : 1;

            return _num(b.t, 0) - _num(a.t, 0);

        });

        return out;

    }



    function collectSongScriptEntries() {

        var entries = {}, order = [];

        function add(song) {

            var key = songKey(song);

            var versions = song && song.scriptVersions || [];

            if (!key || !versions.length) return;

            if (!entries[key]) {

                entries[key] = {

                    key: key,

                    title: song.title || song.name || song.query || '',

                    artist: song.artist || song.author || '',

                    scriptVersions: [],

                    selectedScriptId: song.selectedScriptId || '',

                    selectedScriptIds: clone(song.selectedScriptIds || []),

                    scriptSelectionMode: song.scriptSelectionMode || 'single'

                };

                order.push(key);

            }

            entries[key].scriptVersions = mergeScriptVersionLists(entries[key].scriptVersions, versions);

        }

        v3.playlists().forEach(function(pl) { (pl.songs || []).forEach(add); });

        ((eng.store && eng.store.favoriteSongs) || []).forEach(add);

        (v3.state.songScriptArchive || []).forEach(function(entry) {

            if (!entry || !entry.key) return;

            if (!entries[entry.key]) {

                entries[entry.key] = clone(entry);

                entries[entry.key].scriptVersions = [];

                order.push(entry.key);

            }

            entries[entry.key].scriptVersions = mergeScriptVersionLists(entries[entry.key].scriptVersions, entry.scriptVersions || []);

        });

        return order.map(function(key) { return entries[key]; });

    }



    v3.exportScripts = function() {

        var payload = {

            format: 'pp-radio-scripts',

            version: 1,

            exportedAt: new Date().toISOString(),

            continuousVersions: (v3.state.continuousVersions || []).map(scriptFileContinuous),

            songScripts: collectSongScriptEntries()

        };

        var stamp = new Date().toISOString().slice(0, 10);

        downloadBlob(new TOP.Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), 'pp-radio-scripts-' + stamp + '.json');

        return {

            continuous: payload.continuousVersions.length,

            songs: payload.songScripts.length

        };

    };



    v3.importScripts = function(text) {

        var obj = typeof text === 'string' ? JSON.parse(text) : text;

        if (!obj || obj.format !== 'pp-radio-scripts' || _num(obj.version, 0) < 1) {

            throw new Error('不是有效的 VNM 电台台本文件');

        }

        var existingContinuous = {};

        (v3.state.continuousVersions || []).forEach(function(version, index) {

            if (version && version.id) existingContinuous[version.id] = index;

        });

        var continuousAdded = 0, continuousUpdated = 0;

        (obj.continuousVersions || []).forEach(function(raw) {

            if (!raw || Object.prototype.toString.call(raw.nodes) !== '[object Array]') return;

            var version = scriptFileContinuous(raw);

            version.id = String(version.id || uid('continuous'));

            version.favorite = !!version.favorite;

            if (!v3.playlist(version.playlistId || '')) version.playlistId = 'now-playing';

            if (existingContinuous[version.id] !== undefined) {

                var previous = v3.state.continuousVersions[existingContinuous[version.id]];

                version.favorite = !!(version.favorite || previous.favorite);

                v3.state.continuousVersions[existingContinuous[version.id]] = version;

                continuousUpdated++;

            } else {

                existingContinuous[version.id] = v3.state.continuousVersions.length;

                v3.state.continuousVersions.push(version);

                continuousAdded++;

            }

        });



        var archive = {}, archiveOrder = [];

        (v3.state.songScriptArchive || []).forEach(function(entry) {

            if (!entry || !entry.key) return;

            archive[entry.key] = clone(entry);

            archiveOrder.push(entry.key);

        });

        (obj.songScripts || []).forEach(function(entry) {

            if (!entry || !entry.key) return;

            if (!archive[entry.key]) {

                archive[entry.key] = clone(entry);

                archive[entry.key].scriptVersions = [];

                archiveOrder.push(entry.key);

            }

            archive[entry.key].scriptVersions = mergeScriptVersionLists(archive[entry.key].scriptVersions, entry.scriptVersions || []);

            archive[entry.key].selectedScriptId = entry.selectedScriptId || archive[entry.key].selectedScriptId || '';

            archive[entry.key].selectedScriptIds = clone(entry.selectedScriptIds || archive[entry.key].selectedScriptIds || []);

            archive[entry.key].scriptSelectionMode = entry.scriptSelectionMode || archive[entry.key].scriptSelectionMode || 'single';

        });

        v3.state.songScriptArchive = archiveOrder.map(function(key) { return archive[key]; });



        var matched = {}, songMatched = 0;

        function applyEntry(song) {

            var key = songKey(song), entry = archive[key];

            if (!entry) return;

            /* 收藏=锁定：当前选中版本已收藏的歌曲不参与导入合并（保持收藏版原样） */
            if (_scriptSelectedFavorite(song)) return;

            song.scriptVersions = mergeScriptVersionLists(song.scriptVersions, entry.scriptVersions);

            song.selectedScriptId = entry.selectedScriptId || song.selectedScriptId || '';

            song.selectedScriptIds = clone(entry.selectedScriptIds || song.selectedScriptIds || []);

            song.scriptSelectionMode = entry.scriptSelectionMode || song.scriptSelectionMode || 'single';

            if (!matched[key]) {

                matched[key] = true;

                songMatched++;

            }

        }

        v3.playlists().forEach(function(pl) { (pl.songs || []).forEach(applyEntry); });

        ((eng.store && eng.store.favoriteSongs) || []).forEach(applyEntry);

        v3.save();

        try { eng.saveStore(); } catch (e) {}

        v3.uiRefresh();

        return {

            continuousAdded: continuousAdded,

            continuousUpdated: continuousUpdated,

            songEntries: (obj.songScripts || []).length,

            songMatched: songMatched

        };

    };



    v3.exportData = function() {

        var payload = {

            version: 3,

            exportedAt: new Date().toISOString(),

            radio: clone(v3.state)

        };

        downloadBlob(new TOP.Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), 'pp-radio-backup.json');

    };



    v3.importData = function(text) {

        var obj = typeof text === 'string' ? JSON.parse(text) : text;

        if (!obj || !obj.radio || !obj.version) throw new Error('不是有效的电台备份');

        eng.store.v3Radio = clone(obj.radio);

        v3.state = ensureState();

        v3.save();

        v3.uiRefresh();

    };



    var oldSpeakItem = _speakItem;

    _speakItem = function(item, force, after) {

        if (v3.songScriptsSuppressed()) {

            if (item) item.spoken = false;

            var rt = v3.continuousRuntime;

            eng.duck(!!(rt && rt.audio && !rt.paused && !rt.stopped));

            if (after) after(false);

            return;

        }

        return oldSpeakItem(item, force, after);

    };



    var oldRequestScripts = eng.requestScripts;

    eng.requestScripts = function() {

        if (v3.songScriptsSuppressed()) {

            _toast('陪伴模式正在使用长台本，不请求歌曲台本');

            return;

        }

        return oldRequestScripts.apply(eng, arguments);

    };



    var oldNextForContinuous = eng.next;

    eng.next = function() {

        var rt = v3.continuousRuntime;

        var continuousVoice = rt && rt.audio ? rt.audio : null;

        var shouldKeepPlaying = !!(continuousVoice && !rt.paused && !rt.stopped);

        if (continuousVoice && eng.voice === continuousVoice) eng.voice = null;

        try {

            return oldNextForContinuous.apply(eng, arguments);

        } finally {

            if (continuousVoice && v3.continuousRuntime === rt && !rt.stopped) {

                eng.voice = continuousVoice;

                if (shouldKeepPlaying && continuousVoice.paused && continuousVoice.play) {

                    try {

                        var resumed = continuousVoice.play();

                        if (resumed && resumed.catch) resumed.catch(function() {});

                    } catch (e) {}

                }

                eng.duck(!!(rt.audio && !rt.paused));

            }

        }

    };



    _trimScripts = function(favoriteSong) {

        if (!favoriteSong) return;

        favoriteSong.scriptVersions = trimScriptVersions(favoriteSong.scriptVersions, _num(cfg.scriptHistoryMax, 3));

    };



    var oldRemoveScriptVersion = eng.removeScriptVersion;

    eng.removeScriptVersion = function(song, versionId) {

        var versions = (_favByKey(_songKey(song)) || {}).scriptVersions || [];

        for (var i = 0; i < versions.length; i++) {

            if (versions[i] && versions[i].id === versionId && versions[i].favorite) {

                _toast('已收藏的台本版本受保护，请先取消收藏');

                return;

            }

        }

        return oldRemoveScriptVersion.apply(eng, arguments);

    };



    var oldSaveQueue = eng.saveQueue;

    eng.saveQueue = function() {

        oldSaveQueue();

        try { v3.syncNow(); } catch (e) {}

    };

})();

    /*__VNR3_CORE_END__*/



    function ensureShell() {

        _cleanupOrbLyrics();

        var old = TOPDOC.getElementById('pp-radio-floating-shell') || TOP.__vnmRadioShellEl;

        if (old) {

            try {

                if (old.__viewportCleanup) old.__viewportCleanup();

                old.remove();

            } catch (e) {}

            TOP.__vnmRadioShellEl = null;

        }

        var st = TOPDOC.getElementById('pp-radio-floating-style');

        if (st) st.remove();

        st = TOPDOC.createElement('style');

        st.id = 'pp-radio-floating-style';

        st.textContent = CSS2 + CSS3 + CSSX + CSS_FIX;

        st.textContent += '.vnr2-search-submit,.vnr2-search-iconbtn.primary,.vnr2-history-view .vnr2-history-btn:last-child{background:linear-gradient(145deg,rgba(128,151,197,.78),rgba(78,101,145,.72))!important;color:rgba(244,247,255,.95)!important;border:1px solid rgba(176,198,238,.38)!important;box-shadow:inset 0 1px rgba(255,255,255,.22),0 6px 16px rgba(20,31,55,.28)!important}.vnr2-search-iconbtn,.vnr2-history-view .vnr2-history-btn{background:rgba(83,108,153,.34)!important;color:rgba(232,239,255,.86)!important;border:1px solid rgba(160,184,228,.30)!important;box-shadow:inset 0 1px rgba(255,255,255,.12)!important}.vnr2-search-submit:hover,.vnr2-search-iconbtn:hover,.vnr2-history-view .vnr2-history-btn:hover{filter:brightness(1.12)!important;transform:translateY(-1px)!important}';

        st.textContent += ".vnr2-host-script{flex:1!important;min-width:0!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;text-align:center!important;gap:12px!important;color:rgba(255,255,255,.62)!important;font-size:14px!important;overflow:hidden!important;background:radial-gradient(ellipse at 50% 50%,rgba(255,255,255,.045),transparent 70%)!important}.vnr2-host-script>.vnr2-script-line{display:block!important;width:auto!important;max-width:100%!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;white-space:nowrap!important;overflow:visible!important;text-overflow:clip!important;word-break:normal!important;cursor:pointer!important;color:rgba(255,255,255,.62)!important;font:400 14px/normal -apple-system,BlinkMacSystemFont,sans-serif!important;animation:vnr2-chat-lyric 9s linear infinite!important;transform:none!important}.vnr2-host-script>.vnr2-script-line:nth-child(2){animation-delay:0s!important}.vnr2-host-script>.vnr2-script-line:nth-child(3){animation-delay:2s!important}.vnr2-host-script>.vnr2-script-line:nth-child(4){animation-delay:4s!important}.vnr2-host-script>.vnr2-script-line.current{color:rgba(255,255,255,.62)!important;font-size:14px!important;font-weight:400!important;opacity:initial!important;transform:none!important;background:transparent!important;border:0!important}.vnr2-host-script>.vnr2-host-live{font-size:11px!important;letter-spacing:1px!important;color:rgba(255,255,255,.9)!important}@keyframes vnr2-chat-lyric{0%,18%{transform:translateY(5px);opacity:.25}35%,68%{transform:translateY(0);opacity:.9}85%,100%{transform:translateY(-8px);opacity:.2}}";

        st.textContent += ".vnr2-host-script{flex:1!important;min-width:0!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;text-align:center!important;gap:12px!important;color:rgba(255,255,255,.62)!important;font-size:14px!important;overflow:hidden!important;background:radial-gradient(ellipse at 50% 50%,rgba(255,255,255,.045),transparent 70%)!important}.vnr2-host-script>p.vnr2-radio6-line{margin:0!important;white-space:nowrap!important;color:inherit!important;font:inherit!important;padding:0!important;border:0!important;border-radius:0!important;background:none!important;box-shadow:none!important;animation:vnr2-chat-lyric 9s linear infinite!important}.vnr2-host-script>p.vnr2-radio6-line:nth-child(3){animation-delay:2s!important}.vnr2-host-script>p.vnr2-radio6-line:nth-child(4){animation-delay:4s!important}.vnr2-host-live{font-size:11px!important;letter-spacing:1px!important;color:rgba(255,255,255,.9)!important}@keyframes vnr2-chat-lyric{0%,18%{transform:translateY(5px);opacity:.25}35%,68%{transform:translateY(0);opacity:.9}85%,100%{transform:translateY(-8px);opacity:.2}}.vnr2-search-submit,.vnr2-search-iconbtn.primary,.vnr2-history-view .vnr2-history-btn:last-child{background:linear-gradient(145deg,rgba(255,255,255,.16),rgba(255,255,255,.07))!important;color:rgba(255,255,255,.88)!important;border:1px solid rgba(255,255,255,.20)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.24),inset 0 -1px 0 rgba(0,0,0,.12),0 8px 20px rgba(0,0,0,.18)!important;backdrop-filter:blur(18px) saturate(110%)!important;-webkit-backdrop-filter:blur(18px) saturate(110%)!important}.vnr2-search-iconbtn,.vnr2-history-view .vnr2-history-btn{background:linear-gradient(145deg,rgba(255,255,255,.10),rgba(255,255,255,.035))!important;color:rgba(255,255,255,.72)!important;border:1px solid rgba(255,255,255,.14)!important;box-shadow:inset 0 1px rgba(255,255,255,.15),0 5px 14px rgba(0,0,0,.14)!important;backdrop-filter:blur(16px)!important;-webkit-backdrop-filter:blur(16px)!important}.vnr2-search-submit:hover,.vnr2-search-iconbtn:hover,.vnr2-history-view .vnr2-history-btn:hover{background:linear-gradient(145deg,rgba(255,255,255,.22),rgba(255,255,255,.10))!important;filter:none!important}";

        st.textContent += "\n.vnr2-search-hero,.vnr2-history-view-head{background:linear-gradient(100deg,rgba(255,255,255,.035),rgba(7,9,13,.42) 64%,rgba(0,0,0,.50))!important;border:1px solid rgba(255,255,255,.045)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.055),inset 0 -1px 0 rgba(0,0,0,.32),0 10px 28px rgba(0,0,0,.10)!important;backdrop-filter:blur(22px) saturate(105%)!important;-webkit-backdrop-filter:blur(22px) saturate(105%)!important}\n.vnr2-search-row{background:linear-gradient(100deg,rgba(255,255,255,.022),rgba(0,0,0,.30))!important;border:1px solid rgba(255,255,255,.04)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.045),inset 0 -1px 0 rgba(0,0,0,.30)!important}\n.vnr2-search-card,.vnr2-history-view .vnr2-history-row{background:linear-gradient(105deg,rgba(255,255,255,.032),rgba(255,255,255,.012) 52%,rgba(0,0,0,.17))!important;border:1px solid rgba(255,255,255,.042)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.042),inset 0 -1px 0 rgba(0,0,0,.18),0 7px 20px rgba(0,0,0,.07)!important}\n.vnr2-search-card:hover,.vnr2-history-view .vnr2-history-row:hover{background:linear-gradient(105deg,rgba(255,255,255,.052),rgba(255,255,255,.022) 52%,rgba(0,0,0,.15))!important;border-color:rgba(255,255,255,.065)!important;transform:translateY(-1px)!important}\n.vnr2-search-submit,.vnr2-search-iconbtn,.vnr2-search-iconbtn.primary,.vnr2-history-view .vnr2-history-btn,.vnr2-history-view .vnr2-history-btn:last-child,.vnr2-history-clear{background:linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.025) 48%,rgba(0,0,0,.16))!important;color:rgba(255,255,255,.78)!important;border:1px solid rgba(255,255,255,.075)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.105),inset 0 -1px 0 rgba(0,0,0,.24),0 5px 14px rgba(0,0,0,.12)!important;backdrop-filter:blur(18px) saturate(100%)!important;-webkit-backdrop-filter:blur(18px) saturate(100%)!important;text-shadow:0 1px 2px rgba(0,0,0,.34)!important}\n.vnr2-search-submit:hover,.vnr2-search-iconbtn:hover,.vnr2-history-view .vnr2-history-btn:hover,.vnr2-history-clear:hover{background:linear-gradient(145deg,rgba(255,255,255,.105),rgba(255,255,255,.038) 48%,rgba(0,0,0,.13))!important;border-color:rgba(255,255,255,.105)!important;filter:none!important}\n.vnr2-search-submit:active,.vnr2-search-iconbtn:active,.vnr2-history-view .vnr2-history-btn:active,.vnr2-history-clear:active{transform:scale(.96)!important;box-shadow:inset 0 2px 5px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.055)!important}\n.vnr2-history-limit{background:linear-gradient(110deg,rgba(255,255,255,.03),rgba(0,0,0,.22))!important;border:1px solid rgba(255,255,255,.045)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.04),inset 0 -1px 0 rgba(0,0,0,.25)!important}\n.vnr2-search-song,.vnr2-pl-t{color:rgba(255,255,255,.88)!important}.vnr2-search-artist,.vnr2-pl-s{color:rgba(255,255,255,.38)!important}\n";

        st.textContent += ".vnr2-chat-fm .vnr2-chat-orb{width:220px!important;height:220px!important;flex:0 0 220px!important}.vnr2-chat-fm .vnr2-orb-spectrum{width:282px!important;height:282px!important;inset:-31px!important}.vnr2-chat-fm .loader-wrapper{width:158px!important;height:158px!important}.vnr2-chat-fm{gap:22px!important;padding-left:22px!important;padding-right:22px!important}";

        st.textContent += "\n.vnr2-chat-fm .vnr2-chat-orb{width:198px!important;height:198px!important;flex:0 0 198px!important}\n.vnr2-chat-fm .vnr2-orb-spectrum{width:254px!important;height:254px!important;inset:-28px!important}\n.vnr2-chat-fm .loader-wrapper{width:142px!important;height:142px!important}\n.vnr2-chat-fm{gap:16px!important;padding:14px 16px!important}\n.vnr2-search-view,.vnr2-history-view{background:rgba(13,14,17,.22)!important;color:rgba(255,255,255,.78)!important}\n.vnr2-search-hero,.vnr2-history-view-head{background:linear-gradient(145deg,rgba(255,255,255,.042),rgba(13,14,17,.34) 58%,rgba(0,0,0,.46))!important;border-color:rgba(255,255,255,.065)!important;box-shadow:inset 0 1px rgba(255,255,255,.075),inset 0 -1px rgba(0,0,0,.30),0 14px 30px rgba(0,0,0,.15)!important}\n.vnr2-search-row,.vnr2-search-card,.vnr2-history-view .vnr2-history-row{background:linear-gradient(145deg,rgba(255,255,255,.032),rgba(0,0,0,.25))!important;border-color:rgba(255,255,255,.052)!important;box-shadow:inset 0 1px rgba(255,255,255,.05),inset 0 -1px rgba(0,0,0,.22),0 8px 20px rgba(0,0,0,.10)!important}\n.vnr2-search-submit,.vnr2-search-iconbtn,.vnr2-search-iconbtn.primary,.vnr2-history-view .vnr2-history-btn,.vnr2-history-view .vnr2-history-btn:last-child,.vnr2-history-clear{background:linear-gradient(145deg,rgba(255,255,255,.105),rgba(255,255,255,.028) 55%,rgba(0,0,0,.22))!important;color:rgba(255,255,255,.80)!important;border:1px solid rgba(255,255,255,.105)!important;box-shadow:inset 0 1px rgba(255,255,255,.13),inset 0 -1px rgba(0,0,0,.28),0 5px 15px rgba(0,0,0,.16)!important}\n.vnr2-search-submit:hover,.vnr2-search-iconbtn:hover,.vnr2-history-view .vnr2-history-btn:hover,.vnr2-history-clear:hover{background:linear-gradient(145deg,rgba(255,255,255,.15),rgba(255,255,255,.05) 55%,rgba(0,0,0,.18))!important;border-color:rgba(255,255,255,.16)!important}\n";

        st.textContent += ".vnr2-chat-fm .vnr2-chat-orb{width:250px!important;height:250px!important;flex:0 0 250px!important}.vnr2-chat-fm .vnr2-orb-spectrum{width:320px!important;height:320px!important;inset:-35px!important}.vnr2-chat-fm .loader-wrapper{width:180px!important;height:180px!important}.vnr2-chat-fm{gap:30px!important;padding:18px 30px!important}";

        st.textContent += ".vnr2-center{border-radius:30px!important;overflow:hidden!important;isolation:isolate!important}.vnr2-sidebar{border-radius:30px 0 0 30px!important;overflow:hidden!important}.vnr2-main{border-radius:0 30px 30px 0!important;overflow:hidden!important}.vnr2-search-view,.vnr2-history-view{border-radius:28px!important;overflow:auto!important;clip-path:inset(0 round 28px)!important}.vnr2-search-view::-webkit-scrollbar,.vnr2-history-view::-webkit-scrollbar{border-radius:10px!important}";

        st.textContent += ".vnr2-center{overflow:visible!important;clip-path:none!important}.vnr2-center>.vnr2-main{overflow:hidden!important}.vnr2-center>.vnr2-sidebar{overflow:hidden!important}";

        st.textContent += ".vnr2-stage{border-radius:32px!important;overflow:visible!important}.vnr2-center{border-radius:32px!important;z-index:1!important;box-shadow:0 18px 42px rgba(0,0,0,.18),inset 0 1px rgba(255,255,255,.08)!important}.vnr2-main{border-radius:0 32px 32px 0!important}.vnr2-sidebar{border-radius:32px 0 0 32px!important}.vnr2-bottom-bar,.vnr2-input-row,.vnr2-chatwrap{position:relative!important;z-index:8!important}.vnr2-center:after{content:\"\";position:absolute;left:0;right:0;bottom:-22px;height:22px;pointer-events:none;background:linear-gradient(180deg,rgba(10,11,14,.18),transparent);border-radius:0 0 32px 32px}";

        st.textContent += ".vnr2-main{padding-bottom:58px!important}.vnr2-input-row{position:relative!important;z-index:12!important;margin:0 8px 20px 0!important;transform:translateY(-2px)!important}.vnr2-inp{margin-bottom:0!important}.vnr2-cbtn{margin-bottom:0!important}";

        st.textContent += ".vnr2-main{padding-bottom:34px!important}.vnr2-input-row{margin:0!important;transform:none!important}.vnr2-center{overflow:visible!important;border-radius:30px!important}.vnr2-sidebar{border-radius:30px!important}.vnr2-main{border-radius:30px!important;margin:0 0 16px 0!important}.vnr2-search-view,.vnr2-history-view{border-radius:28px!important;overflow:auto!important}";

        st.textContent += ".vnr2-input-row{height:44px!important;min-height:44px!important;max-height:44px!important;box-sizing:border-box!important;align-items:center!important;gap:12px!important;margin:0 12px 14px 12px!important}.vnr2-inp{height:44px!important;min-height:44px!important;max-height:44px!important;box-sizing:border-box!important;overflow:hidden!important;resize:none!important;padding:10px 16px!important;line-height:22px!important;border-radius:22px!important}.vnr2-cbtn{width:44px!important;height:44px!important;min-width:44px!important;max-width:44px!important;flex:0 0 44px!important;margin:0!important;border-radius:22px!important}.vnr2-main{padding-bottom:34px!important}";

        st.textContent += ".vnr2-chat{padding-left:22px!important;padding-right:8px!important}.vnr2-bub,.vnr2-mrow.user .vnr2-bub{background:rgba(43,45,53,.82)!important;border:.5px solid rgba(255,255,255,.075)!important;box-shadow:none!important;color:rgba(255,255,255,.88)!important;border-radius:17px!important}.vnr2-inp{background:rgba(43,45,53,.82)!important;border:.5px solid rgba(255,255,255,.075)!important;box-shadow:none!important}.vnr2-inp:focus{border-color:rgba(255,255,255,.14)!important}";

        st.textContent += ".vnr2-main{border-radius:30px!important;overflow:hidden!important;clip-path:inset(0 round 30px)!important;background-clip:padding-box!important}.vnr2-main .vnr2-input-row{position:relative!important;z-index:20!important}";

        st.textContent += ".vnr2-main>.vnr2-chatwrap{border-radius:0 0 30px 30px!important;overflow:hidden!important;background-clip:padding-box!important}.vnr2-main>.vnr2-input-row{position:relative!important;z-index:30!important}";

        (TOPDOC.head || TOPDOC.body).appendChild(st);

        _ensureLgFilter();

        var shell = E('div', 'vnr2-shell');

        shell.id = 'pp-radio-floating-shell';

        _lgVars(shell);

        TOP.__vnmRadioShellEl = shell;

        ensureShellHost(shell);

        var u = ui2();



        function savePos() {

            eng.saveStore();

        }



        var _lastViewport = null;



        function _mapViewportPos(value, oldStart, oldSize, newStart, newSize, oldItemSize, newItemSize) {

            if (!isFinite(value)) return value;

            if (!isFinite(newItemSize)) newItemSize = oldItemSize;

            var oldSpan = Math.max(0, oldSize - oldItemSize - 16);

            var newSpan = Math.max(0, newSize - newItemSize - 16);

            var ratio = oldSpan > 0 ? (value - oldStart - 8) / oldSpan : .5;

            return Math.round(newStart + 8 + _clamp(ratio, 0, 1) * newSpan);

        }



        function scr() {

            var vv = null;

            try { vv = TOP.visualViewport || null; } catch (e) {}

            var next = {

                x: vv && isFinite(vv.offsetLeft) ? vv.offsetLeft : 0,

                y: vv && isFinite(vv.offsetTop) ? vv.offsetTop : 0,

                w: vv && vv.width ? vv.width : (TOP.innerWidth || 1024),

                h: vv && vv.height ? vv.height : (TOP.innerHeight || 768),

                scale: vv && vv.scale ? vv.scale : 1

            };

            var old = _lastViewport;

            if (old && !orbDrag && !bd && (Math.abs(old.x - next.x) > .5 || Math.abs(old.y - next.y) > .5 || Math.abs(old.w - next.w) > .5 || Math.abs(old.h - next.h) > .5)) {

                if (!u.orbSnap && isFinite(u.orbX) && isFinite(u.orbY)) {

                    u.orbX = _mapViewportPos(u.orbX, old.x, old.w, next.x, next.w, ORB);

                    u.orbY = _mapViewportPos(u.orbY, old.y, old.h, next.y, next.h, ORB);

                }

                if (!u.snap && isFinite(u.barX) && isFinite(u.barY)) {

                    var oldBs = _barScale(old), newBs = _barScale(next);

                    u.barX = _mapViewportPos(u.barX, old.x, old.w, next.x, next.w, BAR_W * oldBs, BAR_W * newBs);

                    u.barY = _mapViewportPos(u.barY, old.y, old.h, next.y, next.h, BAR_H * oldBs, BAR_H * newBs);

                    if (newBs !== oldBs) {

                        u.barX = _clamp(u.barX, next.x + 8, next.x + Math.max(8, next.w - BAR_W * newBs - 8));

                        u.barY = _clamp(u.barY, next.y + 8, next.y + Math.max(8, next.h - BAR_H * newBs - 8));

                    }

                }

            }

            _lastViewport = next;

            return next;

        }



        function orbPos() {

            var s = scr();

            if (u.orbX === undefined) {

                u.orbX = s.x + s.w - ORB - 26;

                u.orbY = s.y + s.h - ORB - 110;

            }

            u.orbX = _clamp(u.orbX, s.x + 8, s.x + s.w - ORB - 8);

            u.orbY = _clamp(u.orbY, s.y + 8, s.y + s.h - ORB - 8);

            return u;

        }



        function _barScale(s) {

            return s.w < 700 ? _clamp((s.w - 20) / BAR_W, 0.62, 1) : 1;

        }



        function barPos() {

            var s = scr(), bs = _barScale(s), bw = BAR_W * bs, bh = BAR_H * bs;

            bar.style.transformOrigin = 'left top';

            bar.style.transform = 'scale(' + bs + ')';

            if (u.barX === undefined) {

                u.barX = Math.round(s.x + (s.w - bw) / 2);

                u.barY = s.y + s.h - bh - (s.w < 700 ? 24 : 130);

            }

            u.barX = _clamp(u.barX, s.x + 8, s.x + Math.max(8, s.w - bw - 8));

            u.barY = _clamp(u.barY, s.y + 8, s.y + Math.max(8, s.h - bh - 8));

            return u;

        }

        /* ============ 第一形态 orb ============ */

        var orb = E('div', 'vnr2-orb');

        applyGlass(orb, 'orb', ORB, ORB);

        orb.style.setProperty('background', 'transparent', 'important');

        var orbLogo = E('i', 'vnr2-orb-logo');

        applyGlass(orbLogo, 'logo', 34, 34);

        orb.appendChild(orbLogo);

        shell.appendChild(orb);

        var orbDrag = null;

        orb.addEventListener('pointerdown', function(ev) {

            if (ev.button !== undefined && ev.button !== 0) return;

            orbDrag = {

                sx: ev.clientX,

                sy: ev.clientY,

                ox: u.orbX,

                oy: u.orbY,

                moved: false

            };

            try {

                orb.setPointerCapture(ev.pointerId);

            } catch (e) {}

        });

        orb.addEventListener('pointermove', function(ev) {

            if (!orbDrag) return;

            var dx = ev.clientX - orbDrag.sx,

                dy = ev.clientY - orbDrag.sy;

            if (Math.abs(dx) + Math.abs(dy) > 6) orbDrag.moved = true;

            if (orbDrag.moved) {

                u.orbX = orbDrag.ox + dx;

                u.orbY = orbDrag.oy + dy;

                u.orbSnap = false;

                var so = _snapTargetOrb();

                if (so && Math.abs(u.orbX - so.x) < 90 && Math.abs(u.orbY - so.y) < 90) {

                    u.orbX = so.x;

                    u.orbY = so.y;

                    u.orbSnap = true;

                }

                orbPos();

                orb.style.left = u.orbX + 'px';

                orb.style.top = u.orbY + 'px';

            }

        });

        orb.addEventListener('pointerup', function(ev) {

            var wasDrag = orbDrag && orbDrag.moved;

            orbDrag = null;

            if (wasDrag) {

                savePos();

                return;

            }

            u.mode = 'bar';

            u.snap = false;

            var sv = scr();

            u.barX = _clamp(ev.clientX - 49, sv.x + 8, sv.x + sv.w - BAR_W - 8);

            u.barY = _clamp(ev.clientY - Math.round(BAR_H / 2), sv.y + 8, sv.y + sv.h - BAR_H - 8);

            savePos();

            drawShell();

        });

        /* ============ 第二形态 bar ============ */

        var bar = E('div', 'vnr2-bar');

        applyGlass(bar, 'bar', BAR_W, BAR_H);

        bar.style.setProperty('background', 'transparent', 'important');

        shell.appendChild(bar);



        function bbtn(x, y, w, h, name, title, fn, extraCls) {

            var b = ib('vnr2-bbtn' + (extraCls ? ' ' + extraCls : ''), name, title, fn);

            b.style.left = x + 'px';

            b.style.top = y + 'px';

            b.style.width = w + 'px';

            b.style.height = h + 'px';

            var sz = Math.min(w, h) - 10;

            var svg = b.querySelector('svg');

            if (svg) {

                svg.style.width = sz + 'px';

                svg.style.height = sz + 'px';

            }

            bar.appendChild(b);

            return b;

        }

        var backB = bbtn(25, 11, 48, 35, 'backF', '返回第一形态', function(ev) {

            u.mode = 'orb';

            u.orbSnap = !!u.snap;

            if (u.orbSnap) {

                var so = _snapTargetOrb();

                if (so) {

                    u.orbX = so.x;

                    u.orbY = so.y;

                }

            } else {

                var r = bar.getBoundingClientRect(), sv2 = scr();

                u.orbX = _clamp(r.left + 49 - ORB / 2, sv2.x + 8, sv2.x + sv2.w - ORB - 8);

                u.orbY = _clamp(r.top + 30 - ORB / 2, sv2.y + 8, sv2.y + sv2.h - ORB - 8);

            }

            savePos();

            drawShell();

        });

        var playB2 = bbtn(80, 11, 38, 35, 'pauseF', '播放/暂停', function() {

            eng.playPause(eng.store.userNote || '');

        });

        var nextB2 = bbtn(125, 11, 48, 35, 'fwdF', '下一首', function() {

            if (!eng.running) eng.running = true;

            eng.next();

        });

        var alb = E('div', 'vnr2-alb');

        var albImg = E('img', '');

        albImg.alt = '';

        alb.appendChild(albImg);

        var albGlz = E('i', 'glz');

        applyGlass(albGlz, null, 2, 160);

        albGlz.style.background = 'rgba(255,255,255,.08)';

        alb.appendChild(albGlz);

        bar.appendChild(alb);

        var t1 = E('div', 'vnr2-t1', '私人电台');

        var t2 = E('div', 'vnr2-t2', '待机');

        bar.appendChild(t1);

        bar.appendChild(t2);

        var dragZone = E('div', 'vnr2-drag');

        dragZone.title = '按住拖拽 · 点击打开完整电台';

        bar.appendChild(dragZone);

        var heartB = bbtn(336, 15, 28, 28, 'heart', '收藏当前曲目', function() {

            var s = curSong();

            if (s) eng.toggleFav(s, eng.current && eng.current.say);

        });

        var volB = bbtn(366, 15, 28, 28, 'vol', '静音/恢复', function() {

            u.muted = !u.muted;

            _applyMute();

            savePos();

            drawShell();

        });

        var quoteB = bbtn(402, 15, 28, 28, 'quote', '打开对话小窗（按住录音）', function() {

            u.chatOpen = !u.chatOpen;

            if (u.chatOpen) u.listOpen = false;

            savePos();

            drawShell();

        }, 'vnr2-quote-btn');

        var listB2 = bbtn(448, 15, 28, 28, 'listB', '播放列表', function() {

            u.listOpen = !u.listOpen;

            if (u.listOpen) u.chatOpen = false;

            savePos();

            drawShell();

        });

        var moreB = bbtn(494, 15, 28, 28, 'more', '打开第三形态', function() {

            u.mode = 'studio';

            if (u.sidesOpen === undefined || u.sidesOpen === false) u.sidesOpen = true;

            savePos();

            drawShell();

        });

        var recObj = null,

            recTimer = null;

        quoteB.addEventListener('pointerdown', function(ev) {

            recTimer = TOP.setTimeout(function() {

                recTimer = null;

                quoteB.classList.add('rec');

                var ring = E('i', 'vnr2-rec-ring');

                quoteB.appendChild(ring);

                recObj = _startRec(function(txt) {

                    quoteB.classList.remove('rec');

                    try {

                        ring.remove();

                    } catch (e) {}

                    if (txt) eng.sendChat(txt);

                }, function(state, live) {

                    if (state === 'rec' && live) t2.textContent = '录音: ' + live.slice(-24);

                });

            }, 320);

        });



        function stopRec() {

            if (recTimer) {

                TOP.clearTimeout(recTimer);

                recTimer = null;

            }

            if (recObj) {

                try {

                    recObj.stop();

                } catch (e) {}

                recObj = null;

            }

        }

        quoteB.addEventListener('pointerup', stopRec);

        quoteB.addEventListener('pointerleave', stopRec);

        /* drag / click on dragZone */

        var bd = null;

        dragZone.addEventListener('pointerdown', function(ev) {

            if (ev.button !== undefined && ev.button !== 0) return;

            ev.preventDefault();

            bd = {

                sx: ev.clientX,

                sy: ev.clientY,

                ox: u.barX,

                oy: u.barY,

                t: Date.now(),

                held: false,

                moved: false

            };

            bd.holdT = TOP.setTimeout(function() {

                if (bd) {

                    bd.held = true;

                    dragZone.classList.add('holding');

                }

            }, 330);

            try {

                dragZone.setPointerCapture(ev.pointerId);

            } catch (e) {}

        });

        dragZone.addEventListener('pointermove', function(ev) {

            if (!bd) return;

            var dx = ev.clientX - bd.sx,

                dy = ev.clientY - bd.sy;

            if (Math.abs(dx) + Math.abs(dy) > 7) bd.moved = true;

            if (bd.held || bd.moved) {

                bd.held = true;

                u.barX = bd.ox + dx;

                u.barY = bd.oy + dy;

                u.snap = false;

                var sn = _snapTarget();

                if (sn && Math.abs(u.barX - sn.x) < 70 && Math.abs(u.barY - sn.y) < 70) {

                    u.barX = sn.x;

                    u.barY = sn.y;

                    u.snap = true;

                }

                barPos();

                bar.classList.toggle('snapped', !!u.snap);

                bar.style.left = u.barX + 'px';

                bar.style.top = u.barY + 'px';

            }

        });

        dragZone.addEventListener('pointerup', function() {

            if (!bd) return;

            var wasClick = !bd.held && !bd.moved && (Date.now() - bd.t) < 330;

            if (bd.holdT) TOP.clearTimeout(bd.holdT);

            dragZone.classList.remove('holding');

            bd = null;

            savePos();

            if (wasClick) {

                u.mode = 'studio';

                if (u.sidesOpen === undefined || u.sidesOpen === false) u.sidesOpen = true;

                savePos();

                drawShell();

            }

        });



        function _snapTarget() {

            var d = _vnDialogBox();

            if (!d) return null;

            var r = d.getBoundingClientRect(), s = scr(), bs = _barScale(s);

            return {

                x: Math.round(_clamp(r.left, s.x + 8, s.x + Math.max(8, s.w - BAR_W * bs - 8))),

                y: Math.round(_clamp(r.top - SNAP_GAP - BAR_H * bs, s.y + 8, s.y + Math.max(8, s.h - BAR_H * bs - 8)))

            };

        }



        function _snapTargetOrb() {

            var d = _vnDialogBox();

            if (!d) return null;

            var r = d.getBoundingClientRect(), s = scr();

            return {

                x: Math.round(_clamp(r.left, s.x + 8, s.x + s.w - ORB - 8)),

                y: Math.round(_clamp(r.top - SNAP_GAP - ORB, s.y + 8, s.y + s.h - ORB - 8))

            };

        }

        /* playlist popover (第二形态 列表) */

        var listPop = null;



        function renderListPop() {

            if (listPop) {

                try {

                    listPop.remove();

                } catch (e) {}

                listPop = null;

            }

            if (!u.listOpen || u.mode !== 'bar') return;

            listPop = E('div', 'vnr2-pop');

            listPop.appendChild(E('div', 'vnr2-pop-title', '播放列表 · ' + ((eng.current ? 1 : 0) + eng.queue.length) + ' 首'));

            var items = (eng.current ? [eng.current] : []).concat(eng.queue);

            if (!items.length) listPop.appendChild(E('div', 'vnr2-empty', '队列为空。'));

            items.slice(0, 30).forEach(function(it, i) {

                var s = it.song || it;

                var row = E('div', 'vnr2-row');

                var tx = E('div', '');

                tx.appendChild(E('div', 'vnr2-rt', (i === 0 && eng.current && it.id === eng.current.id ? '▶ ' : '') + songTitle(s)));

                tx.appendChild(E('div', 'vnr2-rs', songArtist(s) + (it.needsScript ? ' · 待台本' : '')));

                var ops = E('div', 'vnr2-ops');

                var fb = ib('vnr2-ic' + (_isFav(s) ? ' on' : ''), _isFav(s) ? 'heartF' : 'heart', '收藏', function() {

                    eng.toggleFav(s, it.say);

                });

                ops.appendChild(fb);

                if (it.id && !(eng.current && it.id === eng.current.id)) ops.appendChild(ib('vnr2-ic', 'del', '移除', function() {

                    eng.removeItem(it);

                }));

                row.appendChild(tx);

                row.appendChild(ops);

                listPop.appendChild(row);

            });

            var r = bar.getBoundingClientRect(),

                s = scr();

            listPop.style.visibility = 'hidden';

            shellHost().appendChild(listPop);

            var pr = listPop.getBoundingClientRect();

            var lx = _clamp(r.left + 448 - pr.width / 2, 8, s.w - pr.width - 8);

            var ly = r.top - pr.height - 12;

            if (ly < 8) ly = r.bottom + 12;

            listPop.style.left = lx + 'px';

            listPop.style.top = ly + 'px';

            listPop.style.visibility = 'visible';

        }

        /* mini chat pop (第二形态发言框) */

        var chatPop = null;



        function renderChatPop() {

            var keepVal = '';

            if (chatPop) {

                var oi = chatPop.querySelector('.cp-inp');

                if (oi) keepVal = oi.value;

                try {

                    chatPop.remove();

                } catch (e) {}

                chatPop = null;

            }

            if (!u.chatOpen || u.mode !== 'bar') return;

            chatPop = E('div', 'vnr2-pop vnr2-chatpop');

            chatPop.appendChild(E('div', 'vnr2-pop-title', '主播连线 · ' + hostsText()));

            var list = E('div', 'cp-list');

            var h = eng.store.chatHistory || [];

            if (!h.length) list.appendChild(E('div', 'vnr2-empty', '还没有对话。Enter 发出消息，纸飞机请求回复。'));

            h.slice(-30).forEach(function(m) {

                if (m.role === 'user') {

                    var ub = E('div', 'vnr2-bub', m.display || m.content || '');

                    ub.style.cssText = 'background:rgba(255,255,255,.15);align-self:flex-end;max-width:86%';

                    list.appendChild(ub);

                    return;

                }

                var hd = E('div', '', m.host || '主播');

                hd.style.cssText = 'font-size:10px;color:rgba(255,255,255,.45);padding:0 4px;';

                list.appendChild(hd);

                _pairBilingual(_splitCaption(m.display || m.content || '')).forEach(function(pp) {

                    var b = E('div', 'vnr2-bub', pp.main + (pp.tr ? '\n' + pp.tr : ''));

                    b.style.cssText = 'align-self:flex-start;max-width:86%';

                    b.title = '双击播放语音';

                    b.ondblclick = function() {

                        eng.replayChat(m, false);

                    };

                    list.appendChild(b);

                });

            });

            if (eng.chatBusy) {

                list.appendChild(E('div', 'vnr2-chat-status loading', '主播正在回复…'));

            } else if (eng.apiStatus && eng.apiStatus.state === 'error' && eng.apiStatus.type === 'chat' && eng.apiStatus.error) {

                list.appendChild(E('div', 'vnr2-chat-status error', '回复失败：' + eng.apiStatus.error));

            }

            chatPop.appendChild(list);

            var row = E('div', 'cp-row');

            var mic = ib('cp-btn', 'mic', '按住说话', function() {});

            var inp = E('textarea', 'cp-inp');

            inp.placeholder = 'Enter 发出 · 纸飞机请求回复';

            inp.value = keepVal;

            inp.onkeydown = function(ev) {

                if (ev.key === 'Enter' && !ev.shiftKey) {

                    ev.preventDefault();

                    var v = (inp.value || '').trim();

                    if (!v) return;

                    eng.store.chatHistory.push({

                        id: _uuid(),

                        role: 'user',

                        content: v,

                        display: v,

                        t: Date.now()

                    });

                    inp.value = '';

                    eng.saveStore();

                    renderChatPop();

                }

            };

            var send = ib('cp-btn send', 'sendP', '请求回复', function() {

                var v = (inp.value || '').trim();

                if (v) {

                    eng.store.chatHistory.push({

                        id: _uuid(),

                        role: 'user',

                        content: v,

                        display: v,

                        t: Date.now()

                    });

                    inp.value = '';

                    eng.saveStore();

                }

                var arr = eng.store.chatHistory || [],

                    pend = [];

                for (var i = arr.length - 1; i >= 0; i--) {

                    if (arr[i].role === 'user') pend.unshift(arr[i].content);

                    else break;

                }

                if (!pend.length) {

                    _toast('先发一条消息再请求回复');

                    return;

                }

                eng.sendChat(pend.join('\n'), true);

                renderChatPop();

            });

            var micRec2 = null;

            mic.addEventListener('pointerdown', function() {

                mic.classList.add('rec');

                micRec2 = _startRec(function(txt) {

                    mic.classList.remove('rec');

                    if (txt) eng.sendChat(txt);

                }, function() {});

            });



            function micStop2() {

                if (micRec2) {

                    try {

                        micRec2.stop();

                    } catch (e) {}

                    micRec2 = null;

                }

                mic.classList.remove('rec');

            }

            mic.addEventListener('pointerup', micStop2);

            mic.addEventListener('pointerleave', micStop2);

            row.appendChild(mic);

            row.appendChild(inp);

            row.appendChild(send);

            chatPop.appendChild(row);

            var r = bar.getBoundingClientRect(),

                s = scr();

            chatPop.style.visibility = 'hidden';

            shellHost().appendChild(chatPop);

            var pr = chatPop.getBoundingClientRect();

            var lx = _clamp(r.left + 402 - pr.width / 2, 8, s.w - pr.width - 8);

            var ly = r.top - pr.height - 12;

            if (ly < 8) ly = r.bottom + 12;

            chatPop.style.left = lx + 'px';

            chatPop.style.top = ly + 'px';

            chatPop.style.visibility = 'visible';

            list.scrollTop = list.scrollHeight;

        }



        /* ============ 第三形态 studio ============ */

        var studio = E('div', 'vnr2-studio');

        shell.appendChild(studio);

        var stage = E('div', 'vnr2-stage');

        studio.appendChild(stage);

        var leftCard = E('div', 'vnr2-card left hidden');

        var center = E('div', 'vnr2-center');

        var rightCard = E('div', 'vnr2-card right hidden');

        stage.appendChild(leftCard);

        stage.appendChild(center);

        stage.appendChild(rightCard);

        var sidebar = E('div', 'vnr2-sidebar');

        var main = E('div', 'vnr2-main');

        var bbar = E('div', 'vnr2-bbar');

        center.appendChild(sidebar);

        center.appendChild(main);

        center.appendChild(bbar);

        var stDrag = null;

        center.addEventListener('pointerdown', function(ev) {

            if (ev.button !== undefined && ev.button !== 0) return;

            var r = center.getBoundingClientRect();

            if (ev.clientY - r.top > 64 * (eng._stScale || 1)) return;

            var t = ev.target;

            if (t && t.closest && t.closest('button,input,textarea,select')) return;

            ev.preventDefault();

            stDrag = {

                sx: ev.clientX,

                sy: ev.clientY,

                ox: u.stX || 0,

                oy: u.stY || 0

            };

            try {

                center.setPointerCapture(ev.pointerId);

            } catch (e) {}

        });

        center.addEventListener('pointermove', function(ev) {

            if (!stDrag) return;

            u.stX = stDrag.ox + (ev.clientX - stDrag.sx);

            u.stY = stDrag.oy + (ev.clientY - stDrag.sy);

            stage.style.transform = 'translate(' + Math.round(u.stX) + 'px,' + Math.round(u.stY) + 'px) scale(' + (eng._stScale || 1) + ')';

        });

        center.addEventListener('pointerup', function() {

            if (stDrag) {

                stDrag = null;

                savePos();

            }

        });



        function navIt(name, label, key) {

            var it = E('div', 'vnr2-nav-it' + (u.view === key ? ' on' : ''));

            it.innerHTML = icon2(name) + '<span>' + _esc(label) + '</span>';

            it.onclick = function() {

                u.view = key;

                savePos();

                renderSidebar();

                renderMain();

            };

            return it;

        }



        function renderSidebar() {

            sidebar.innerHTML = '';

            var head = E('div', 'vnr2-sb-head');

            var tt = E('div', '');

            tt.appendChild(E('div', 'vnr2-h1', 'Library'));

            tt.appendChild(E('div', 'vnr2-h1s', 'All Music'));

            head.appendChild(tt);

            head.appendChild(ib('vnr2-mini30' + (u.sidesOpen ? ' on' : ''), 'filter', '展开/收起两侧播放栏', function() {

                u.sidesOpen = !u.sidesOpen;

                savePos();

                drawShell();

            }));

            sidebar.appendChild(head);

            var nav = E('div', 'vnr2-nav');

            nav.appendChild(navIt('note', 'Songs', 'songs'));

            nav.appendChild(navIt('mic', 'Artist', 'artist'));

            nav.appendChild(navIt('spark2', 'Albums', 'albums'));

            nav.appendChild(navIt('person', 'Made for You', 'made'));

            sidebar.appendChild(nav);

            var sec = E('div', 'vnr2-sec');

            sec.appendChild(E('span', '', 'Playlist'));

            var chev = E('span', '');

            chev.innerHTML = icon2('chevD');

            chev.style.cssText = 'width:20px;height:20px;opacity:.7';

            sec.appendChild(chev);

            sidebar.appendChild(sec);

            var nav2 = E('div', 'vnr2-nav');

            var allPl = E('div', 'vnr2-nav-it' + (u.view === 'queue' ? ' on' : ''));

            allPl.innerHTML = icon2('grid2') + '<span>All Playlists</span>'; 

            allPl.onclick = function() {

                u.sidesOpen = true;

                u.plFav = false;

                u.view = 'songs';

                savePos();

                drawShell();

            };

            nav2.appendChild(allPl);

            var favPl = E('div', 'vnr2-nav-it');

            favPl.innerHTML = icon2('heartF') + '<span>Favorites · ' + _favList(eng.store || {}).length + '</span>'; 

            favPl.onclick = function() {

                u.sidesOpen = true;

                u.plFav = true;

                u.view = 'songs';

                savePos();

                drawShell();

            };

            nav2.appendChild(favPl);

            var histPl = E('div', 'vnr2-nav-it' + (u.view === 'history' ? ' on' : ''));

            histPl.innerHTML = icon2('listB') + '<span>History</span>';

            histPl.onclick = function(){ u.sidesOpen=true; u.view='history'; savePos(); renderSidebar(); renderMain(); };

            nav2.appendChild(histPl);

            var searchPl=E('div','vnr2-nav-it'+(u.view==='search'?' on':''));searchPl.innerHTML=icon2('search')+'<span>Search</span>';searchPl.onclick=function(){u.sidesOpen=true;u.view='search';savePos();renderSidebar();renderMain();};nav2.appendChild(searchPl);sidebar.appendChild(nav2);

        }

        try {

            if (!eng.__chatRefreshHooked) {

                eng.__chatRefreshHooked = true;

                TOP.addEventListener('pp-radio-chat-refresh', function() {

                    try {

                        renderChatPop();

                    } catch (e) {}

                });

            }

        } catch (e) {}



        /* ---- chat helpers ---- */

        function _cjk(s) {

            return (String(s).match(/[一-鿿぀-ヿ]/g) || []).length;

        }



        function _pairBilingual(sents) {

            if (cfg.chatBilingual === false && cfg.chatBilingual !== undefined) return sents.map(function(s) {

                return {

                    main: s

                };

            });

            var out = [],

                i = 0;

            while (i < sents.length) {

                var a = sents[i],

                    b = sents[i + 1];

                if (b !== undefined) {

                    var ca = _cjk(a) / Math.max(1, a.length),

                        cb = _cjk(b) / Math.max(1, b.length);

                    if ((ca > .3 && cb < .12) || (ca < .12 && cb > .3)) {

                        out.push({

                            main: a,

                            tr: b

                        });

                        i += 2;

                        continue;

                    }

                }

                out.push({

                    main: a

                });

                i++;

            }

            return out;

        }

        var _msgAudio = null,

            _msgPlayingId = '';

        eng._chatAudio = null;



        function _playMsg(msg) {

            if (!msg.id) msg.id = _uuid();

            var wasPlaying = _msgPlayingId && _msgPlayingId === msg.id;

            try {

                if (_msgAudio) {

                    _msgAudio.pause();

                    _msgAudio = null;

                    eng.duck(false);

                }

            } catch (e) {}

            if (wasPlaying) {

                _msgPlayingId = '';

                renderChat();

                return;

            }

            var ttsOk = (cfg.radioTtsEnabled !== false && cfg.radioTtsEnabled !== 'false') && !!((cfg.useOwnTts && cfg.ownTtsKey) || (sbS && sbS.ttsApiKey));

            if (!msg.audioUrl && !ttsOk) {

                _toast('该消息没有语音，且未配置 TTS');

                _msgPlayingId = '';

                renderChat();

                return;

            }

            _msgPlayingId = msg.id || '';

            renderChat();

            if (msg.audioUrl) {

                try {

                    eng.duck(true);

                    _msgAudio = new TOP.Audio(msg.audioUrl);

                    _msgAudio.volume = _clamp((cfg.voiceVolume === undefined ? 100 : cfg.voiceVolume) / 100, 0, 1);

                    eng._chatAudio = _msgAudio;

                    _msgAudio.muted = !!u.muted;

                    _msgAudio.onended = _msgAudio.onerror = function() {

                        eng.duck(false);

                        _msgPlayingId = '';

                        renderChat();

                    };

                    _msgAudio.play();

                    return;

                } catch (e) {}

            }

            var _pp = _parseSay(msg.content || msg.display || '');

            var _pc = _hostChar(msg);

            eng.duck(true);

            _tts(_pp.tts || _pp.display, _pc, function(url) {

                msg.audioUrl = url;

                eng.saveStore();

                try {

                    _msgAudio = new TOP.Audio(url);

                    _msgAudio.volume = _clamp((cfg.voiceVolume === undefined ? 100 : cfg.voiceVolume) / 100, 0, 1);

                    eng._chatAudio = _msgAudio;

                    _msgAudio.muted = !!u.muted;

                    _msgAudio.onended = _msgAudio.onerror = function() {

                        eng.duck(false);

                        _msgPlayingId = '';

                        renderChat();

                    };

                    _msgAudio.play();

                } catch (e) {

                    eng.duck(false);

                    _msgPlayingId = '';

                    renderChat();

                }

            }, function(e2) {

                eng.duck(false);

                _toast('TTS: ' + e2);

                _msgPlayingId = '';

                renderChat();

            }, _pp.tag && _pp.tag.lang);

        }



        function _hostChar(msg) {

            return _charByName(msg.host || '', _selectedHosts(eng.store || {})) || _selectedHosts(eng.store || {})[0] || null;

        }



        function avaEl(msg) {

            var ch = null;

            if (msg && msg._cid) ch = _charByCid(msg._cid);

            if (!ch) ch = _hostChar(msg);

            var name = (ch && ch.name) || msg.host || '主';

            var url = (ch && ch.avatar) || '';



            function letter() {

                var d = E('div', 'vnr2-ava vnr2-ava-l', name.charAt(0));

                return d;

            }

            if (!url) return letter();

            var av = E('img', 'vnr2-ava');

            av.src = url;

            av.onerror = function() {

                try {

                    var l = letter();

                    av.parentNode && av.parentNode.replaceChild(l, av);

                } catch (e) {}

            };

            return av;

        }

        var chatBox = null,

            chatInput = null,

            memHost = null;



        function clearChatMemory() {

            if (!TOP.confirm || TOP.confirm('清空主播连线聊天记录？历史总结会保留。')) {

                eng.store.chatHistory = [];

                eng.saveStore();

                renderChat();

                _toast('已清空聊天记录');

            }

        }



        function renderMemoryTools() {

            var top = E('div', 'vnr2-memtop');

            top.appendChild(ib('vnr2-memgear', 'filter', '记忆管理', function() {

                eng.store.memoryPanelOpen = !eng.store.memoryPanelOpen;

                eng.saveStore();

                renderChat();

            }));

            (memHost || chatBox).appendChild(top);

            if (!eng.store.memoryPanelOpen) return;

            var panel = E('div', 'vnr2-mempanel');

            var row = E('div', 'vnr2-memrow');

            var title = E('div', '');

            title.appendChild(E('div', 'vnr2-memttl', '主播记忆'));

            title.appendChild(E('div', 'vnr2-memhint', '当前历史总结，可编辑保存'));

            row.appendChild(title);

            row.appendChild(E('div', 'vnr2-memhint', (eng.store.chatHistory || []).length + ' 条记录'));

            panel.appendChild(row);

            var ta = E('textarea', 'vnr2-memta');

            ta.value = eng.store.chatSummary || '';

            ta.placeholder = '暂无历史总结。';

            panel.appendChild(ta);

            var ops = E('div', 'vnr2-membtns');

            ops.appendChild(E('button', 'vnr2-membtn', '删除总结'));

            ops.lastChild.type = 'button';

            ops.lastChild.onclick = function() {

                ta.value = '';

                eng.store.chatSummary = '';

                eng.saveStore();

                _toast('已删除总结');

            };

            ops.appendChild(E('button', 'vnr2-membtn', '清空记录'));

            ops.lastChild.type = 'button';

            ops.lastChild.onclick = clearChatMemory;

            ops.appendChild(E('button', 'vnr2-membtn strong', '保存'));

            ops.lastChild.type = 'button';

            ops.lastChild.onclick = function() {

                eng.store.chatSummary = ta.value.trim();

                eng.saveStore();

                eng.store.memoryPanelOpen = false;

                eng.saveStore();

                renderChat();

                _toast('已保存记忆');

            };

            panel.appendChild(ops);

            (memHost || chatBox).appendChild(panel);

        }



        function renderChat() {

            if (!chatBox) return;

            if (memHost) {

                memHost.innerHTML = '';

                renderMemoryTools();

            } else {

                renderMemoryTools();

            }

            chatBox.innerHTML = '';

            var h = eng.store.chatHistory || [];

            if (!h.length) {

                chatBox.appendChild(E('div', 'vnr2-empty', '还没有连线记录。Enter 只发出消息，右侧按钮才请求回复；按住麦克风说话。'));

                return;

            }

            h.slice(-60).forEach(function(m) {

                var row = E('div', 'vnr2-mrow ' + (m.role === 'user' ? 'user' : 'ai'));

                var head = E('div', 'vnr2-mhead');

                if (m.role !== 'user') {

                    head.appendChild(avaEl(m));

                    head.appendChild(E('span', '', (m.kind === 'script' ? '♪ ' + (m.song || '台本') + ' · ' : '') + (((_charByCid(m._cid)||{}).name) || ((_hostChar(m)||{}).name) || m.host || '主播')));

                    var vb = E('div', 'vnr2-vbar' + ((_msgPlayingId && _msgPlayingId === m.id) ? ' live' : ''));

                    vb.innerHTML = '<i></i><i></i><i></i><i></i><i></i>';

                    vb.title = '播放语音';

                    vb.onclick = function() {

                        _playMsg(m);

                    };

                    head.appendChild(vb);

                } else head.appendChild(E('span', '', '我'));

                var ops = E('div', 'vnr2-mops');

                ops.appendChild(ib('vnr2-ic', 'edit', '编辑', function() {

                    startEdit(row, m);

                }));

                if (m.role !== 'user') ops.appendChild(ib('vnr2-ic', 'redo', '重新生成', function() {

                    rerollMsg(m);

                }));

                ops.appendChild(ib('vnr2-ic', 'del', '删除', function() {

                    var arr = eng.store.chatHistory,

                        k = arr.indexOf(m);

                    if (k >= 0) arr.splice(k, 1);

                    eng.saveStore();

                    renderChat();

                }));

                head.appendChild(ops);

                row.appendChild(head);

                var disp = m.display || m.content || '';

                if (m.role === 'user') {

                    row.appendChild(E('div', 'vnr2-bub', disp));

                } else {

                    var pairs = _pairBilingual(_splitCaption(disp));

                    pairs.forEach(function(p) {

                        var b = E('div', 'vnr2-bub');

                        b.appendChild(E('span', '', p.main));

                        if (p.tr) {

                            var chip = E('span', 'vnr2-trc', '译');

                            var tr = E('div', 'vnr2-trx', p.tr);

                            chip.onclick = function() {

                                b.classList.toggle('tr-open');

                            };

                            b.appendChild(chip);

                            b.appendChild(tr);

                        }

                        row.appendChild(b);

                    });

                }

                chatBox.appendChild(row);

            });

            if (eng.chatBusy) {

                chatBox.appendChild(E('div', 'vnr2-chat-status loading', '主播正在回复…'));

            } else if (eng.apiStatus && eng.apiStatus.state === 'error' && eng.apiStatus.type === 'chat' && eng.apiStatus.error) {

                chatBox.appendChild(E('div', 'vnr2-chat-status error', '回复失败：' + eng.apiStatus.error));

            }

            chatBox.scrollTop = chatBox.scrollHeight;

        }



        try {

            if (!eng.__studioChatRefreshHooked) {

                eng.__studioChatRefreshHooked = true;

                TOP.addEventListener('pp-radio-chat-refresh', function() {

                    try {

                        if (u.mode === 'studio' && (u.view === 'made' || u.view === 'songs')) renderChat();

                    } catch (e) {}

                });

            }

        } catch (e) {}



        function startEdit(row, m) {

            var ta = E('textarea', 'vnr2-ed');

            ta.value = m.content || '';

            var save = ib('vnr2-ic', 'sendP', '保存', function() {

                if (m.role === 'user') {

                    m.content = ta.value;

                    m.display = ta.value;

                    eng.saveStore();

                } else eng.editChat(m, ta.value);

                renderChat();

            });

            var cancel = ib('vnr2-ic', 'x', '取消', function() {

                renderChat();

            });

            row.innerHTML = '';

            row.appendChild(ta);

            var opr = E('div', 'vnr2-ops');

            opr.appendChild(save);

            opr.appendChild(cancel);

            row.appendChild(opr);

            ta.focus();

        }



        function rerollMsg(m) {

            var arr = eng.store.chatHistory || [];

            var k = arr.indexOf(m);

            if (k < 0) return;

            var prevUser = '';

            for (var i = k - 1; i >= 0; i--) {

                if (arr[i].role === 'user') {

                    prevUser = arr[i].content;

                    break;

                }

            }

            arr.splice(k, 1);

            eng.saveStore();

            renderChat();

            if (prevUser) eng.sendChat(prevUser, true);

        }



        function pendingUserText() {

            var arr = eng.store.chatHistory || [];

            var out = [];

            for (var i = arr.length - 1; i >= 0; i--) {

                if (arr[i].role === 'user') out.unshift(arr[i].content);

                else break;

            }

            return out.join('\n');

        }

        /* ---- settings (Made for You) ---- */

        /* settings rendered from FIELDS */



        function _stripHtml(s) {

            return String(s || '').replace(/<[^>]*>/g, '').trim();

        }



        function _presets(key) {

            if (!eng.store.promptPresets) eng.store.promptPresets = {};

            if (!eng.store.promptPresets[key]) eng.store.promptPresets[key] = [];

            return eng.store.promptPresets[key];

        }

        /* 预设条：默认预设 + 保存/应用/删除 用户预设 */

        function presetBar(parent, key, getVal, setVal, dflt) {

            var bar = E('div', 'vnr2-preset');

            var se = E('select', 'vnr2-set-inp');



            function fill() {

                se.innerHTML = '';

                var o0 = E('option', '', '默认预设');

                o0.value = '__default__';

                se.appendChild(o0);

                _presets(key).forEach(function(p, i) {

                    var op = E('option', '', p.n);

                    op.value = String(i);

                    se.appendChild(op);

                });

            }

            fill();

            var apply = E('button', 'vnr2-pbtn', '应用');

            apply.type = 'button';

            apply.onclick = function() {

                if (se.value === '__default__') setVal(dflt === undefined ? '' : dflt);

                else {

                    var p = _presets(key)[parseInt(se.value, 10)];

                    if (p) setVal(p.t);

                }

                _saveCfg();

            };

            var save = E('button', 'vnr2-pbtn', '存为预设');

            save.type = 'button';

            save.onclick = function() {

                var name = 'P' + (_presets(key).length + 1) + ' · ' + new Date().toLocaleDateString();

                _presets(key).push({

                    n: name,

                    t: getVal()

                });

                eng.saveStore();

                fill();

                se.value = String(_presets(key).length - 1);

                _toast('已保存预设');

            };

            var del = E('button', 'vnr2-pbtn', '删除');

            del.type = 'button';

            del.onclick = function() {

                if (se.value === '__default__') {

                    _toast('默认预设不可删除');

                    return;

                }

                _presets(key).splice(parseInt(se.value, 10), 1);

                eng.saveStore();

                fill();

            };

            bar.appendChild(se);

            bar.appendChild(apply);

            bar.appendChild(save);

            bar.appendChild(del);

            parent.appendChild(bar);

            return bar;

        }



        function _promptFieldDefault(key) {

            for (var i = 0; i < FIELDS.length; i++) {

                if (FIELDS[i].key === key) return FIELDS[i]['default'] || '';

            }

            return '';

        }



        function _promptPreviewText(key) {

            var tpl = cfg[key];

            if (tpl === undefined || tpl === null || tpl === '') tpl = _promptFieldDefault(key);

            if (key === 'radioChatSummaryPrompt') {

                var h = (eng.store && eng.store.chatHistory) || [];

                var n = Math.max(1, _num(cfg.chatSummaryBatch, 40));

                var old = h.length > n ? h.slice(0, h.length - n) : [];

                var keep = h.length > n ? h.slice(-n) : h;

                var text = old.map(function(m) { return (m.role === 'user' ? '用户' : '主播') + ': ' + (m.display || m.content || ''); }).join('\n');

                return String(tpl || '').replace(/\{\{旧总结\}\}/g, (eng.store && eng.store.chatSummary) || '').replace(/\{\{对话内容\}\}/g, text);

            }

            if (key === 'artistChatPrompt') {

                var ch = null, chars = _chars(), aid = u && u.artistId;

                for (var ci = 0; ci < chars.length; ci++) if (_charId(chars[ci]) === aid) ch = chars[ci];

                if (!ch) ch = (_selectedHosts(eng.store || {}) || [])[0] || {};

                var ac = _aChats()[_charId(ch)] || [], last = '';

                for (var li = ac.length - 1; li >= 0; li--) if (ac[li].role === 'user') { last = ac[li].display || ac[li].content || ''; break; }

                return _aBuildPrompt(ch, last);

            }

            if (key === 'scriptRewritePrompt') {

                var all = (eng.current ? [eng.current] : []).concat(eng.queue || []), lines = [], idx = 0;

                for (var si = 0; si < all.length; si++) {

                    var it = all[si], song = it && it.song || {};

                    if (it && (it.sourceType === 'favorite' || it.sourceType === 'manual' || it.sourceType === 'history' || it.sourceType === 'search') && (it.needsScript || (it.say && it.scriptFresh === false))) {

                        idx++;

                        lines.push('s' + idx + '_preview. ' + (song.title || song.query || '未定歌曲') + (song.artist ? ' - ' + song.artist : '') + ' | 来源:' + (it.sourceType || ''));

                    }

                }

                if (!lines.length) lines.push('（当前没有待更新台本的曲目）');

                return _buildCommon(tpl, { songList: lines.join('\n') });

            }

            var lastChat = '';

            if (key === 'radioChatPrompt') {

                var chh = (eng.store && eng.store.chatHistory) || [];

                for (var hi = chh.length - 1; hi >= 0; hi--) if (chh[hi].role === 'user') { lastChat = chh[hi].display || chh[hi].content || ''; break; }

            }

            return _buildCommon(tpl, { userInput: key === 'tasteDistillPrompt' ? ((eng.store && eng.store.tasteInput) || '') : lastChat || ((eng.store && eng.store.userNote) || '') });

        }



        function promptPreviewButton(bar, key) {

            if (!bar) return;

            var btn = E('button', 'vnr2-pbtn', '预览完整提示词');

            btn.type = 'button';

            var box = E('div', 'vnr2-prompt-preview-box');

            box.style.display = 'none';

            box.style.width = '100%';

            box.style.marginTop = '8px';

            box.style.flexBasis = '100%';

            box.style.padding = '10px';

            box.style.borderRadius = '16px';

            box.style.border = '1px solid rgba(255,255,255,.10)';

            box.style.background = 'rgba(255,255,255,.035)';

            box.style.boxSizing = 'border-box';

            var select = E('select', 'vnr2-set-inp');

            select.style.width = '100%';

            var fields = FIELDS.filter(function(f) { return f.type === 'textarea-presets'; });

            fields.forEach(function(f) {

                var op = E('option', '', _stripHtml(f.label) || f.key);

                op.value = f.key;

                select.appendChild(op);

            });

            select.value = key;

            var out = E('textarea', 'vnr2-set-ta');

            out.readOnly = true;

            out.style.width = '100%';

            out.style.minHeight = '230px';

            out.style.maxHeight = '460px';

            out.style.resize = 'vertical';

            out.style.marginTop = '8px';

            out.style.whiteSpace = 'pre-wrap';

            function refresh() { out.value = _promptPreviewText(select.value); }

            select.onchange = refresh;

            btn.onclick = function() {

                var open = box.style.display !== 'none';

                if (open) {

                    box.style.display = 'none';

                    btn.textContent = '预览完整提示词';

                } else {

                    refresh();

                    box.style.display = 'block';

                    btn.textContent = '收起完整提示词';

                }

            };

            box.appendChild(select);

            box.appendChild(out);

            bar.appendChild(btn);

            bar.parentNode.appendChild(box);

        }

        /* 世界书勾选绑定 */

        function wbPicker(parent) {

            var list = E('div', 'vnr2-wbl');

            var entries = (sbS && sbS.wbEntries) || [];

            if (!entries.length) {

                list.appendChild(E('div', 'vnr2-empty', '主文件里还没有世界书条目。'));

                parent.appendChild(list);

                return;

            }

            var ids = _getRadioWbIds();

            entries.forEach(function(e2) {

                var on = ids.indexOf(e2.id) >= 0;

                var row = E('div', 'vnr2-wbi' + (on ? ' on' : ''));

                var bx = E('span', 'bx', on ? '✓' : '');

                row.appendChild(bx);

                row.appendChild(E('span', '', (e2.name || '未命名') + (e2.group ? ' · ' + e2.group : '')));

                row.onclick = function() {

                    var arr = _getRadioWbIds(),

                        k = arr.indexOf(e2.id);

                    if (k >= 0) arr.splice(k, 1);

                    else arr.push(e2.id);

                    _setRadioWbIds(arr);

                    _saveCfg();

                    var now = arr.indexOf(e2.id) >= 0;

                    row.classList.toggle('on', now);

                    bx.textContent = now ? '✓' : '';

                };

                list.appendChild(row);

            });

            parent.appendChild(list);

        }



        function renderMade(box) {

            var wrap = E('div', 'vnr2-set');

            var groups = [],

                byG = {};

            FIELDS.forEach(function(f) {

                if (f.key === 'radioEnabled') return;

                var g = f.group || '其他';

                if (!byG[g]) {

                    byG[g] = [];

                    groups.push(g);

                }

                byG[g].push(f);

            });

            groups.forEach(function(g) {

                var gEl = E('div', 'vnr2-set-g');

                gEl.appendChild(E('div', 'vnr2-set-gt', g));

                byG[g].forEach(function(f) {

                    var key = f.key,

                        type = f.type,

                        label = _stripHtml(f.label) || key,

                        dflt = f["default"];

                    if (type === 'textarea' || type === 'textarea-presets') {

                        var rr0 = E('div', 'vnr2-set-r');

                        rr0.appendChild(E('div', 'vnr2-set-l', label));

                        gEl.appendChild(rr0);

                        if (key === 'radioWbIds') {

                            wbPicker(gEl);

                            return;

                        }

                        var ta = E('textarea', 'vnr2-set-ta');

                        if (f.rows) ta.style.minHeight = (f.rows * 22) + 'px';

                        if (f.placeholder) ta.placeholder = f.placeholder;

                        ta.value = cfg[key] === undefined ? (dflt || '') : cfg[key];

                        ta.onchange = function() {

                            cfg[key] = ta.value;

                            _saveCfg();

                        };

                        gEl.appendChild(ta);

                        var _promptPresetBar = presetBar(gEl, key, function() {

                            return ta.value;

                        }, function(v) {

                            ta.value = v;

                            cfg[key] = v;

                        }, dflt);

                        promptPreviewButton(_promptPresetBar, key);

                        return;

                    }

                    var rr = E('div', 'vnr2-set-r');

                    rr.appendChild(E('div', 'vnr2-set-l', label));

                    if (type === 'multiselect') {

                        gEl.appendChild(rr);

                        var ml = E('div', 'vnr2-wbl');

                        (f.options || []).forEach(function(o) {

                            var row = E('div', 'vnr2-wbi');

                            var bx = E('span', 'bx', '');

                            row.appendChild(bx);

                            row.appendChild(E('span', '', o.l !== undefined ? o.l : o.v));

                            function paint() {

                                var on = _contextSources().indexOf(o.v) >= 0;

                                row.classList.toggle('on', on);

                                bx.textContent = on ? '✓' : '';

                            }

                            row.onclick = function() {

                                var arr = _contextSources(), at = arr.indexOf(o.v);

                                if (at >= 0) arr.splice(at, 1); else arr.push(o.v);

                                _setContextSources(arr);

                                paint();

                            };

                            paint();

                            ml.appendChild(row);

                        });

                        gEl.appendChild(ml);

                        return;

                    } else if (type === 'toggle') {

                        var cur = cfg[key] === undefined ? !!dflt : (cfg[key] !== false && cfg[key] !== 'false');

                        var sw = E('button', 'vnr2-sw' + (cur ? ' on' : ''));

                        sw.type = 'button';

                        sw.appendChild(E('i', ''));

                        sw.onclick = function() {

                            var now = !sw.classList.contains('on');

                            sw.classList.toggle('on', now);

                            cfg[key] = now;

                            _saveCfg();

                            if (key === 'backgroundPlayback') eng.backgroundPlayback = now;

                        };

                        rr.appendChild(sw);

                    } else if (type === 'select') {

                        var se = E('select', 'vnr2-set-inp');

                        (f.options || []).forEach(function(o) {

                            var op = E('option', '', o.l !== undefined ? o.l : o.v);

                            op.value = o.v;

                            se.appendChild(op);

                        });

                        se.value = cfg[key] === undefined ? (dflt === undefined ? '' : dflt) : cfg[key];

                        se.onchange = function() {

                            cfg[key] = se.value;

                            _saveCfg();

                        };

                        rr.appendChild(se);

                    } else {

                        var inp = E('input', 'vnr2-set-inp');

                        inp.type = type === 'password' ? 'password' : (type === 'number' ? 'number' : 'text');

                        if (type === 'number') {

                            inp.inputMode = 'numeric';

                            if (f.min !== undefined) inp.min = f.min;

                            if (f.max !== undefined) inp.max = f.max;

                            if (f.step !== undefined) inp.step = f.step;

                        }

                        if (f.placeholder) inp.placeholder = f.placeholder;

                        inp.value = cfg[key] === undefined ? (dflt === undefined ? '' : dflt) : cfg[key];

                        function commitInput() {

                            if (type === 'number') {

                                if (inp.value === '') return;

                                var nv = _num(inp.value, dflt || 0);

                                if (f.min !== undefined) nv = Math.max(Number(f.min), nv);

                                if (f.max !== undefined) nv = Math.min(Number(f.max), nv);

                                cfg[key] = nv;

                            } else cfg[key] = inp.value;

                            _saveCfg();

                            if (key === 'musicVolume') eng.setMusicVol(_num(cfg.musicVolume, 100) / 100);

                        }

                        inp.oninput = commitInput;

                        inp.onchange = commitInput;

                        rr.appendChild(inp);

                    }

                    gEl.appendChild(rr);

                });

                wrap.appendChild(gEl);

            });

            var exitB = E('button', 'vnr2-danger', '退出电台（停止播放并关闭）');

            exitB.onclick = function() {

                exitRadio();

            };

            wrap.appendChild(exitB);

            box.appendChild(wrap);

        }



        function renderAlbums(box) {

            var wrap = E('div', 'vnr2-set');



            function card(title) {

                var g = E('div', 'vnr2-set-g');

                g.appendChild(E('div', 'vnr2-set-gt', title));

                return g;

            }

            /* 临时要求 {{用户输入}} */

            var g1 = card('临时要求（随下一次点歌以 {{用户输入}} 发送）');

            var noteTa = E('textarea', 'vnr2-set-ta');

            noteTa.placeholder = '想听什么、想让谁多说话、当前心情...';

            noteTa.value = eng.store.userNote || '';

            noteTa.onchange = function() {

                eng.store.userNote = noteTa.value;

                eng.saveStore();

            };

            g1.appendChild(noteTa);

            var g1r = E('div', 'vnr2-preset');

            var reqB = E('button', 'vnr2-pbtn', '立即按要求点歌');

            reqB.type = 'button';

            reqB.onclick = function() {

                eng.store.userNote = noteTa.value;

                eng.saveStore();

                eng.request(noteTa.value);

            };

            var clrB = E('button', 'vnr2-pbtn', '清空要求');

            clrB.type = 'button';

            clrB.onclick = function() {

                noteTa.value = '';

                eng.store.userNote = '';

                eng.saveStore();

            };

            g1r.appendChild(reqB);

            g1r.appendChild(clrB);

            g1.appendChild(g1r);

            wrap.appendChild(g1);

            /* 蒸馏输入 */

            var g2 = card('音乐偏好蒸馏');

            var inTa = E('textarea', 'vnr2-set-ta');

            inTa.placeholder = '把你想蒸馏的素材放进来：喜欢的歌、歌手、风格、心情碎碎念...（收藏与最近播放会自动带入）';

            inTa.value = eng.store.tasteInput || '';

            inTa.onchange = function() {

                eng.store.tasteInput = inTa.value;

                eng.saveStore();

            };

            g2.appendChild(inTa);

            var g2r = E('div', 'vnr2-preset');

            var disB = E('button', 'vnr2-pbtn', '请求蒸馏');

            disB.type = 'button';

            disB.onclick = function() {

                eng.store.tasteInput = inTa.value;

                eng.saveStore();

                eng.distillTaste(inTa.value);

            };

            g2r.appendChild(disB);

            g2.appendChild(g2r);

            wrap.appendChild(g2);

            /* 蒸馏结果 {{音乐偏好}} */

            var g3 = card('蒸馏结果（注入 {{音乐偏好}}）');

            var enR = E('div', 'vnr2-set-r');

            enR.appendChild(E('div', 'vnr2-set-l', '启用蒸馏结果（关闭则 {{音乐偏好}} 为空）'));

            var enOn = cfg.tasteEnabled !== false && cfg.tasteEnabled !== 'false';

            var sw = E('button', 'vnr2-sw' + (enOn ? ' on' : ''));

            sw.type = 'button';

            sw.appendChild(E('i', ''));

            sw.onclick = function() {

                var now = !sw.classList.contains('on');

                sw.classList.toggle('on', now);

                cfg.tasteEnabled = now;

                _saveCfg();

            };

            enR.appendChild(sw);

            g3.appendChild(enR);

            var resTa = E('textarea', 'vnr2-set-ta');

            resTa.style.minHeight = '120px';

            resTa.placeholder = '（暂无蒸馏结果）';

            resTa.value = eng.store.musicTasteProfile || '';

            resTa.onchange = function() {

                eng.store.musicTasteProfile = resTa.value;

                eng.saveStore();

            };

            g3.appendChild(resTa);

            presetBar(g3, '__tasteResult__', function() {

                return resTa.value;

            }, function(v) {

                resTa.value = v;

                eng.store.musicTasteProfile = v;

                eng.saveStore();

            }, '');

            wrap.appendChild(g3);

            /* 蒸馏提示词（与设置同源） */

            var g4 = card('蒸馏提示词（与 Made for You 同一份）');

            var pTa = E('textarea', 'vnr2-set-ta');

            pTa.style.minHeight = '110px';

            pTa.value = cfg.tasteDistillPrompt || '';

            pTa.onchange = function() {

                cfg.tasteDistillPrompt = pTa.value;

                _saveCfg();

            };

            g4.appendChild(pTa);

            var _fd = '';

            for (var fi = 0; fi < FIELDS.length; fi++) {

                if (FIELDS[fi].key === 'tasteDistillPrompt') _fd = FIELDS[fi]['default'] || '';

            }

            presetBar(g4, 'tasteDistillPrompt', function() {

                return pTa.value;

            }, function(v) {

                pTa.value = v;

                cfg.tasteDistillPrompt = v;

            }, _fd);

            wrap.appendChild(g4);

            box.appendChild(wrap);

        }



        function renderSearch(box){

            var w=E('div','vnr2-search-view'),hero=E('div','vnr2-search-hero');

            var r=E('div','vnr2-search-row'),i=E('input','vnr2-search-input'),b=E('button','vnr2-search-submit');

            b.innerHTML=icon2('search');b.title='搜索';b.setAttribute('aria-label','搜索');i.type='search';i.placeholder='想听什么？';i.value=eng.searchQuery||'';b.type='button';

            b.onclick=function(){eng.searchQuery=i.value.trim();eng.searchSongs(eng.searchQuery);};

            i.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();b.click();}};

            r.appendChild(i);r.appendChild(b);hero.appendChild(r);w.appendChild(hero);

            var l=E('div','vnr2-search-results'),a=eng.searchResults||[];

            if(eng.searchBusy)l.appendChild(E('div','vnr2-search-state','正在搜索…'));

            else if(!a.length)l.appendChild(E('div','vnr2-search-state',eng.searchQuery?'没有找到相关歌曲':'输入关键词开始发现音乐'));

            a.forEach(function(song,idx){var x=E('div','vnr2-search-card'),num=E('div','vnr2-search-num',String(idx+1).padStart(2,'0')),m=E('div','vnr2-search-main');m.appendChild(E('div','vnr2-search-song',songTitle(song)));m.appendChild(E('div','vnr2-search-artist',songArtist(song)));x.appendChild(num);x.appendChild(m);var acts=E('div','vnr2-search-actions'),q=E('button','vnr2-search-iconbtn'),p=E('button','vnr2-search-iconbtn primary');q.innerHTML=icon2('plus2');q.title='加入播放列表';p.innerHTML=icon2('playF');p.title='立即播放';q.onclick=function(){eng.queueSearchSong(song,false);_toast('已加入播放列表');};p.onclick=function(){eng.queueSearchSong(song,true);};acts.appendChild(q);acts.appendChild(p);x.appendChild(acts);l.appendChild(x);});

            w.appendChild(l);box.appendChild(w);

        }

        function renderHistory(box) {

            _prunePlayHistory();

            var wrap = E('div', 'vnr2-history-view');

            var head = E('div', 'vnr2-history-view-head');

            var tools = E('div', 'vnr2-history-tools');

            var limLabel = E('label', 'vnr2-history-limit-label', '保存数量');

            var lim = E('input', 'vnr2-history-limit');

            lim.type = 'number';

            lim.min = '1';

            lim.max = '200';

            lim.step = '1';

            lim.value = _num(cfg.playHistoryLimit === undefined ? 30 : cfg.playHistoryLimit, 30);

            lim.title = '超出数量后自动删除最旧记录';

            lim.onchange = function() {

                cfg.playHistoryLimit = Math.max(1, Math.min(200, _num(lim.value, 30)));

                lim.value = cfg.playHistoryLimit;

                _saveCfg();

                _prunePlayHistory();

                renderMain();

            };

            limLabel.appendChild(lim);

            tools.appendChild(limLabel);

            var clear = E('button', 'vnr2-history-clear', 'Clear History');

            clear.type = 'button';

            clear.onclick = function() {

                if (!confirm('Clear all playback history?')) return;

                if (!eng.store) eng.store = {};

                eng.store.playHistory = [];

                eng.saveStore();

                _toast('Playback history cleared');

                renderMain();

            };

            tools.appendChild(clear);

            head.appendChild(tools);

            wrap.appendChild(head);

            var list = E('div', 'vnr2-history-list');

            var hs = (eng.store && eng.store.playHistory) || [];

            if (!hs.length) list.appendChild(E('div', 'vnr2-empty', 'No playback history yet.'));

            hs.slice(0, _num(cfg.playHistoryLimit, 30)).forEach(function(en) {

                var it = en.item || {}, so = it.song || {};

                var row = E('div', 'vnr2-history-row');

                var main = E('div', 'vnr2-history-main');

                main.appendChild(E('div', 'vnr2-pl-t', songTitle(so)));

                main.appendChild(E('div', 'vnr2-pl-s', songArtist(so) + (it.say ? ' · Script saved' : ' · No script')));

                row.appendChild(main);

                var q1 = E('button', 'vnr2-history-btn', 'Song');

                q1.onclick = function() { eng.queueHistoryItem(en, false, false); _toast('Added song to playlist'); };

                var q2 = E('button', 'vnr2-history-btn', 'Song + Script');

                q2.onclick = function() { eng.queueHistoryItem(en, true, false); _toast('Added song and script'); };

                row.appendChild(q1); row.appendChild(q2); list.appendChild(row);

            });

            wrap.appendChild(list); box.appendChild(wrap);

        }

        function _drawOrbSpectrum(el,level,data){var c=el&&el.querySelector('.vnr2-orb-spectrum');if(!c)return;var dpr=Math.min(2,TOP.devicePixelRatio||1),size=320;if(c.width!==size*dpr){c.width=size*dpr;c.height=size*dpr;}var x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,size,size);x.save();x.translate(size/2,size/2);var t=Date.now()*.001;x.strokeStyle='rgba(218,226,238,.16)';x.lineWidth=.8;x.beginPath();x.ellipse(0,0,125,70,-.22,0,Math.PI*2);x.stroke();x.strokeStyle='rgba(218,226,238,.08)';x.beginPath();x.arc(0,0,132,0,Math.PI*2);x.stroke();var n=104,r=133;for(var i=0;i<n;i++){var ang=i/n*Math.PI*2-Math.PI/2,bin=data&&data.length?i%data.length:0,v=data&&data.length?data[bin]/255:0,noise=data&&data.length?0:.01*Math.sin(t*1.3+i*.17),amp=Math.max(noise,v*(.45+level*.9)),len=2+amp*20,alpha=.12+amp*.78;x.strokeStyle='rgba(224,231,241,'+Math.min(.95,alpha).toFixed(3)+')';x.lineWidth=i%5===0?1.35:.75;x.beginPath();x.moveTo(Math.cos(ang)*r,Math.sin(ang)*r);x.lineTo(Math.cos(ang)*(r+len),Math.sin(ang)*(r+len));x.stroke();}x.restore();}

        function _orbAudioList(){var out=[],seen=[];function add(a){if(a&&seen.indexOf(a)<0){seen.push(a);out.push(a);}}try{add(eng.voice);add(eng._chatAudio);add(eng.music);TOPDOC.querySelectorAll('audio').forEach(add);}catch(e){}return out.filter(function(a){return a&&!a.paused&&!a.ended&&a.src;});}

        function _orbPcmData(audio){try{var url=String(audio.currentSrc||audio.src||'');if(!url)return null;eng._orbViz=eng._orbViz||{pcm:{},cap:{}};var rec=eng._orbViz.pcm[url];if(!rec){rec=eng._orbViz.pcm[url]={loading:true,buffer:null};TOP.fetch(url).then(function(r){if(!r.ok)throw Error('audio fetch');return r.arrayBuffer();}).then(function(ab){var AC=TOP.AudioContext||TOP.webkitAudioContext,ac=TOP.__vnrRadioAudioContext||(TOP.__vnrRadioAudioContext=AC?new AC():null);if(!ac)throw Error('no context');return ac.decodeAudioData(ab.slice(0));}).then(function(buf){rec.buffer=buf;rec.loading=false;}).catch(function(){rec.loading=false;});}if(!rec.buffer)return null;var ch=rec.buffer.getChannelData(0),sr=rec.buffer.sampleRate,N=128,at=Math.max(0,Math.min(ch.length-N-1,Math.floor((Number(audio.currentTime)||0)*sr))),data=new Uint8Array(64),rms=0,peak=0;for(var k=0;k<N;k++){var z=ch[at+k]||0;rms+=z*z;if(Math.abs(z)>peak)peak=Math.abs(z);}for(var f=0;f<64;f++){var re=0,im=0;for(var q=0;q<N;q++){var z2=ch[at+q]||0,w=.5-.5*Math.cos(2*Math.PI*q/(N-1)),ph=2*Math.PI*f*q/N;re+=z2*w*Math.cos(ph);im-=z2*w*Math.sin(ph);}data[f]=Math.min(255,Math.round(Math.sqrt(re*re+im*im)/N*5200));}return{data:data,level:Math.min(1,Math.sqrt(rms/N)*7+peak*1.1)};}catch(e){return null;}}

        function _orbCaptureData(audio){try{if(!eng._orbViz||eng._orbViz.version!==3){try{var old=eng._orbViz&&eng._orbViz.cap||{};Object.keys(old).forEach(function(k){if(old[k].clone)old[k].clone.pause();});}catch(e){}eng._orbViz={version:3,pcm:{},cap:{}};}var isMusic=audio===eng.music,url=String(audio.currentSrc||audio.src||''),key=(isMusic?'music:':'voice:')+url,rec=eng._orbViz.cap[key],AC=TOP.AudioContext||TOP.webkitAudioContext,ac=TOP.__vnrRadioAudioContext||(TOP.__vnrRadioAudioContext=AC?new AC():null);if(!ac||!url)return null;if(!rec){var target=audio,clone=null,src=null;if(isMusic){clone=new TOP.Audio();clone.preload='auto';try{if(!/^blob:|^data:/i.test(url))clone.crossOrigin='anonymous';}catch(e){}clone.src=url;clone.volume=1;clone.muted=false;target=clone;}try{src=ac.createMediaElementSource(target);}catch(e){if(!isMusic){try{var cap=audio.captureStream||audio.mozCaptureStream,stream=cap&&cap.call(audio);if(stream&&stream.getAudioTracks&&stream.getAudioTracks().length)src=ac.createMediaStreamSource(stream);}catch(e2){}}}if(!src)return null;var an=ac.createAnalyser();an.fftSize=128;an.smoothingTimeConstant=.72;src.connect(an);if(isMusic){var silent=ac.createGain();silent.gain.value=0;an.connect(silent);silent.connect(ac.destination);}else{an.connect(ac.destination);}rec=eng._orbViz.cap[key]={analyser:an,data:new Uint8Array(an.frequencyBinCount),context:ac,clone:clone,zeroFrames:0};if(clone){try{clone.currentTime=Number(audio.currentTime)||0;}catch(e){}var pr=clone.play();if(pr&&pr.catch)pr.catch(function(){});}ac.resume&&ac.resume();}if(rec.clone){var drift=Math.abs((Number(rec.clone.currentTime)||0)-(Number(audio.currentTime)||0));if(drift>.18){try{rec.clone.currentTime=Number(audio.currentTime)||0;}catch(e){}}if(audio.paused){if(!rec.clone.paused)rec.clone.pause();}else if(rec.clone.paused){var pp=rec.clone.play();if(pp&&pp.catch)pp.catch(function(){});}}rec.analyser.getByteFrequencyData(rec.data);var sum=0,peak=0;for(var i=0;i<rec.data.length;i++){sum+=rec.data[i];if(rec.data[i]>peak)peak=rec.data[i];}var level=Math.min(1,(sum/rec.data.length*.7+peak*.3)/128);rec.zeroFrames=level<.004?rec.zeroFrames+1:0;return{data:rec.data,level:level,valid:rec.zeroFrames<12};}catch(e){return null;}}

        function _updateChatOrb(){try{var list=_orbAudioList(),best=null,voice=null,music=null;for(var i=0;i<list.length;i++){if(list[i]===eng.voice||list[i]===eng._chatAudio)voice=voice||list[i];if(list[i]===eng.music)music=music||list[i];}best=voice||music||list[0]||null;var sample=best&&_orbCaptureData(best);if((!sample||sample.valid===false)&&best)sample=_orbPcmData(best);var level=sample?sample.level:0,data=sample?sample.data:null,lv=level.toFixed(3),el=main&&main.querySelector('.vnr2-chat-orb');if(el){el.style.setProperty('--orb-level',lv);el.classList.toggle('is-speaking',level>.025);el.style.boxShadow='0 0 '+Math.round(34+level*70)+'px rgba(220,225,235,'+(0.16+level*.34).toFixed(3)+'),0 0 0 '+Math.round(1+level*7)+'px rgba(190,210,245,'+(0.16+level*.42).toFixed(3)+'),inset 0 0 '+Math.round(26+level*28)+'px rgba(255,255,255,'+(0.12+level*.22).toFixed(3)+')';_drawOrbSpectrum(el,level,data);}var outer=TOPDOC.querySelector('.vnr2-orb');if(outer){outer.classList.toggle('is-speaking',level>.025);outer.style.boxShadow='0 10px '+Math.round(26+level*40)+'px rgba(0,0,0,.25),0 0 '+Math.round(12+level*40)+'px rgba(150,185,240,'+(0.12+level*.3).toFixed(3)+'),inset 1.5px 2px 4px rgba(255,255,255,.34),inset -2px -3px 6px rgba(0,0,0,.14)';}}catch(e){}}

        function _startOrbLoop(){if(eng._orbVizLoop)return;eng._orbVizLoop=true;(function loop(){var sh=TOP.__vnmRadioShellEl;if(!sh||!sh.isConnected){eng._orbVizLoop=false;return;}_updateChatOrb();eng._orbVizVizRaf=TOP.requestAnimationFrame(loop);})();}

        



        



        



        /*__VNR3_UI_BEGIN__*/

/* pp-radio v3 UI augmentation.

 * Inserted inside ensureShell(), where E/ib/icon2/renderMain helpers exist.

 */

(function vnr3InstallUi() {

    if (!eng.v3 || shell.__v3UiInstalled) return;

    shell.__v3UiInstalled = true;

    var v3 = eng.v3;



    st.textContent += [

        '.vnr3-btn{appearance:none;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);color:inherit;border-radius:14px;padding:10px 14px;font:inherit;cursor:pointer;transition:.18s ease}',

        '.vnr3-btn:hover{background:rgba(255,255,255,.12)}',

        '.vnr3-btn.primary{background:rgba(255,255,255,.17);border-color:rgba(255,255,255,.2)}',

        '.vnr3-btn.danger{background:rgba(0,0,0,.18)}',

        '.vnr3-btn.icon{width:36px;height:36px;padding:0;border-radius:50%;font-size:20px}',

        '.vnr3-btn.choice{width:100%;display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-align:left}',

        '.vnr3-choice-note,.vnr3-hint,.vnr3-sub,.vnr3-card-sub,.vnr3-detail-sub{opacity:.58;font-size:12px}',

        '.vnr3-shade{position:fixed;inset:0;z-index:2147483647;background:rgba(8,9,12,.62);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;padding:20px;pointer-events:auto}',

        '.vnr3-modal{position:relative;z-index:1;width:min(560px,94vw);max-height:min(760px,88vh);overflow:auto;border:1px solid rgba(255,255,255,.12);border-radius:26px;background:rgba(40,43,50,.98);box-shadow:0 28px 90px rgba(0,0,0,.5);padding:18px;color:#f2f2f3}',

        '.vnr3-modal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}.vnr3-modal-title{font-size:18px;font-weight:650}',

        '.vnr3-choice-list,.vnr3-advanced{display:grid;gap:9px}.vnr3-field{display:grid;gap:7px;margin:11px 0}.vnr3-label{font-size:12px;opacity:.65}',

        '.vnr3-input,.vnr3-search,.vnr3-node-text{box-sizing:border-box;width:100%;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:rgba(0,0,0,.16);color:inherit;padding:11px 13px;outline:none;font:inherit}',

        '.vnr3-input:focus,.vnr3-search:focus,.vnr3-node-text:focus{border-color:rgba(255,255,255,.3);background:rgba(0,0,0,.22)}',

        'textarea.vnr3-input,.vnr3-node-text{min-height:92px;resize:vertical;line-height:1.55}',

        '.vnr3-ops,.vnr3-inline-ops{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;margin-top:15px}.vnr3-inline-ops{justify-content:flex-start}',

        '.vnr3-toggle-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 0}',

        '.vnr3-toolbar{display:flex;align-items:end;justify-content:space-between;gap:14px;margin:8px 0 18px}.vnr3-title{font-size:20px;font-weight:650}.vnr3-search{max-width:240px}',

        '.vnr3-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(142px,1fr));grid-auto-rows:max-content;gap:18px;align-items:start;flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch;padding-right:7px}',

        '.vnr3-pl-card{box-sizing:border-box;width:100%;min-width:0;cursor:pointer;border-radius:20px;padding:10px;background:rgba(255,255,255,.035);transition:.18s ease;align-self:start}',

        '.vnr3-pl-card:hover{background:rgba(255,255,255,.08)}',

        '.vnr3-pl-cover,.vnr3-add-cover,.vnr3-detail-cover{position:relative;aspect-ratio:1/1;overflow:hidden;border-radius:17px;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(0,0,0,.15));box-shadow:0 12px 30px rgba(0,0,0,.18)}',

        '.vnr3-pl-cover img,.vnr3-detail-cover img{width:100%;height:100%;object-fit:cover}.vnr3-default-cover{height:100%;display:grid;place-items:center;color:rgba(255,255,255,.52);font-size:34px}',

        '.vnr3-current-chip{position:absolute;left:8px;bottom:8px;padding:4px 7px;border-radius:9px;background:rgba(20,20,22,.7);backdrop-filter:blur(8px);font-size:10px}',

        '.vnr3-card-name{font-weight:620;margin-top:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',

        '.vnr3-add-cover{width:100%;height:auto;aspect-ratio:1/1;border:1px dashed rgba(255,255,255,.2);box-shadow:none;font-size:38px;display:grid;place-items:center;color:rgba(255,255,255,.52)}.vnr3-add-card{min-height:0}',

        '.vnr3-detail-nav{display:flex;align-items:center;min-height:38px;margin:0 0 12px}.vnr3-back{appearance:none;border:0;background:transparent;color:inherit;display:inline-flex;align-items:center;gap:7px;padding:7px 10px 7px 5px;border-radius:12px;font:inherit;font-size:13px;cursor:pointer;opacity:.76}.vnr3-back:hover{background:rgba(255,255,255,.075);opacity:1}.vnr3-back-chevron{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.085);font-size:22px;font-weight:300;line-height:1}',

        '.vnr3-detail-head{display:grid;grid-template-columns:138px minmax(0,1fr);gap:24px;align-items:center;margin:0 0 22px;padding:18px;border:1px solid rgba(255,255,255,.075);border-radius:25px;background:rgba(255,255,255,.032);box-shadow:inset 0 1px 0 rgba(255,255,255,.055)}.vnr3-detail-title{font-size:27px;font-weight:680;margin:5px 0}.vnr3-kicker{font-size:10px;letter-spacing:.16em;opacity:.52}.vnr3-detail-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:16px}.vnr3-detail-actions .vnr3-btn{min-height:38px;padding:8px 13px;border-radius:13px;border-color:rgba(255,255,255,.11);background:rgba(0,0,0,.14);font-size:13px}.vnr3-detail-actions .vnr3-btn:hover,.vnr3-detail-actions .vnr3-btn.primary:hover{background:rgba(255,255,255,.095)}.vnr3-detail-actions .vnr3-btn.primary{background:rgba(0,0,0,.14);border-color:rgba(255,255,255,.11);color:inherit;font-weight:inherit}.vnr3-play-action{display:inline-flex;align-items:center;gap:8px;padding-left:7px!important}.vnr3-play-glyph{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.105);font-size:10px;line-height:1;padding-left:1px}',

        '.vnr3-detail-scroll{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch;padding-right:7px;scrollbar-width:thin}.vnr3-detail-scroll::-webkit-scrollbar{width:6px}.vnr3-detail-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:999px}.vnr3-bulk{margin:0 0 14px;padding:14px 15px;border:1px solid rgba(255,255,255,.075);border-radius:20px;background:rgba(255,255,255,.026)}.vnr3-select-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.vnr3-select-count{font-size:14px;font-weight:620}.vnr3-select-actions{display:flex;gap:2px;padding:3px;border-radius:12px;background:rgba(0,0,0,.15)}.vnr3-select-actions .vnr3-btn{border:0;background:transparent;padding:6px 10px;border-radius:9px;font-size:12px;opacity:.7}.vnr3-select-actions .vnr3-btn:hover{background:rgba(255,255,255,.075);opacity:1}.vnr3-bulk-actions{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:12px;padding-top:11px;border-top:1px solid rgba(255,255,255,.065)}.vnr3-bulk-actions .vnr3-btn,.vnr3-bulk-actions .vnr3-btn.primary,.vnr3-bulk-actions .vnr3-btn.danger{min-height:34px;padding:7px 11px;border-radius:11px;border-color:rgba(255,255,255,.1);background:rgba(0,0,0,.14);color:inherit;font-size:12px;font-weight:inherit}.vnr3-bulk-actions .vnr3-btn:hover,.vnr3-bulk-actions .vnr3-btn.primary:hover,.vnr3-bulk-actions .vnr3-btn.danger:hover{background:rgba(255,255,255,.085)}',

        '.vnr3-song-list,.vnr3-node-list{display:grid;gap:7px}.vnr3-song-row,.vnr3-node,.vnr3-persona{border:1px solid rgba(255,255,255,.08);border-radius:17px;background:rgba(255,255,255,.035);padding:12px}',

        '.vnr3-song-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px}.vnr3-song-title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',

        '.vnr3-track-list{display:grid;gap:7px;align-content:start;overflow:visible;margin-top:10px}.vnr3-script-body::-webkit-scrollbar{width:5px}.vnr3-script-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.16);border-radius:999px}.vnr3-track{display:grid;grid-template-columns:26px 42px minmax(0,1fr) auto auto auto;align-items:center;gap:10px;border-radius:16px;padding:8px;background:rgba(255,255,255,.035)}',

        '.vnr3-check{position:relative;width:22px;height:22px;padding:0;border:1px solid rgba(255,255,255,.28);border-radius:50%;background:rgba(255,255,255,.045);box-shadow:inset 0 1px 0 rgba(255,255,255,.09);transition:background .14s,border-color .14s,box-shadow .14s;cursor:pointer}.vnr3-check:hover{border-color:rgba(255,255,255,.52);background:rgba(255,255,255,.09)}.vnr3-check.on{border-color:rgba(255,255,255,.94);background:rgba(255,255,255,.94);box-shadow:0 0 0 3px rgba(255,255,255,.1),inset 0 1px 0 rgba(255,255,255,.34)}.vnr3-check.on:after{content:"";position:absolute;left:7px;top:3px;width:5px;height:10px;border:solid rgba(20,20,22,.96);border-width:0 2px 2px 0;transform:rotate(45deg)}.vnr3-track-pic{width:42px;height:42px;border-radius:11px;overflow:hidden;display:grid;place-items:center;background:rgba(255,255,255,.08)}.vnr3-track-pic img{width:100%;height:100%;object-fit:cover}.vnr3-track-title,.vnr3-track-sub{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vnr3-track-sub{opacity:.55;font-size:11px}',

        '.vnr3-speech-node,.vnr3-pause-node{border:1px solid rgba(255,255,255,.08);border-radius:17px;background:rgba(255,255,255,.035);padding:12px}.vnr3-speech-node{display:grid;gap:9px}.vnr3-pause-node{display:flex;align-items:center;justify-content:center;gap:10px;border-style:dashed}.vnr3-pause-input{width:70px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(0,0,0,.15);color:inherit;padding:8px}.vnr3-node-ops{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px}',

        '.vnr3-node-head,.vnr3-persona-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px}',

        '.vnr3-segment{display:flex;gap:6px;flex-wrap:wrap}.vnr3-segment .vnr3-btn.on{background:rgba(255,255,255,.18)}',

        '.vnr3-sc-action{appearance:none;border:0;background:transparent;color:inherit;display:inline-flex;align-items:center;gap:4px;padding:4px;border-radius:9px;cursor:pointer}.vnr3-sc-action:hover{background:rgba(255,255,255,.1)}.vnr3-sc-action svg{width:16px;height:16px}.vnr3-timer-label{font-size:9px;white-space:nowrap;opacity:.72}',

        '.vnr3-bg-row{display:grid;grid-template-columns:22px minmax(0,1fr) auto auto;gap:9px;align-items:center;padding:10px;border-radius:15px;background:rgba(255,255,255,.035)}.vnr3-bg-settings{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:8px;padding-top:8px}.vnr3-bg-settings .vnr3-field{margin:0}.vnr3-bg-row.error{opacity:.48}',

        '.vnr2-set{overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch;pointer-events:auto}',

        '.vnr3-status-error{opacity:.55;text-decoration:line-through}.vnr3-persona{margin:12px 0}.vnr3-persona textarea{min-height:110px}',

        '.vnr3-script-layer{position:absolute;inset:34px 330px 82px;z-index:40;pointer-events:auto;display:flex;align-items:stretch;justify-content:center}.vnr3-script-window{width:100%;min-width:0;display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.16);border-radius:30px;background:linear-gradient(145deg,rgba(77,84,101,.78),rgba(34,38,48,.82));box-shadow:0 28px 90px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.13);backdrop-filter:blur(38px) saturate(130%);-webkit-backdrop-filter:blur(38px) saturate(130%)}',

        '.vnr3-script-window-head{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:18px 20px 14px;border-bottom:1px solid rgba(255,255,255,.08)}.vnr3-script-window-title{font-size:20px;font-weight:680}.vnr3-script-window-sub{font-size:11px;opacity:.5;margin-top:3px}.vnr3-script-close{width:38px;height:38px;flex:0 0 38px;border:1px solid rgba(255,255,255,.12);border-radius:50%;background:rgba(255,255,255,.07);color:inherit;font-size:23px;cursor:pointer}.vnr3-script-body{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch;padding:18px 20px 24px;user-select:text}.vnr3-script-body .vnr3-cont-head{padding:0 0 12px}.vnr3-script-body .vnr3-speech-node{background:rgba(255,255,255,.045);box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}',

        '.vnr3-library-toolbar{display:grid;grid-template-columns:auto minmax(180px,320px) auto;gap:12px;align-items:end;margin-bottom:18px;padding:10px;border:1px solid rgba(255,255,255,.09);border-radius:20px;background:rgba(255,255,255,.045)}.vnr3-library-toolbar .vnr3-field{margin:0}.vnr3-library-toolbar .vnr3-inline-ops{margin:0;align-self:center;justify-content:flex-end}.vnr3-library-cache{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:12px 14px;border:1px solid rgba(255,255,255,.09);border-radius:18px;background:rgba(255,255,255,.04);margin-bottom:14px}.vnr3-queue-script{display:grid;gap:9px;margin-bottom:12px}.vnr3-focus{outline:2px solid rgba(255,200,90,.6);background:rgba(255,200,90,.07)!important;border-radius:18px}.vnr3-queue-script-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.vnr3-cache-badge{font-size:11px;opacity:.62}',

        '.vnr3-library-dashboard{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(250px,.75fr);gap:14px;margin:14px 0 18px}.vnr3-library-pane{min-width:0;border:1px solid rgba(255,255,255,.1);border-radius:22px;background:rgba(14,17,24,.2);box-shadow:inset 0 1px 0 rgba(255,255,255,.06);padding:14px}.vnr3-library-pane-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:11px}.vnr3-library-pane-title{font-size:14px;font-weight:650}.vnr3-version-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;max-height:224px;overflow:auto;padding-right:3px}.vnr3-version-card{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center;border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(255,255,255,.045);padding:11px;cursor:pointer}.vnr3-version-card:hover{background:rgba(255,255,255,.08)}.vnr3-version-card.on{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.19)}.vnr3-version-name{font-size:13px;font-weight:620;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vnr3-version-meta{font-size:10px;opacity:.5;margin-top:3px}.vnr3-queue-list{display:grid;gap:7px;max-height:174px;overflow:auto}.vnr3-queue-row{display:grid;grid-template-columns:22px minmax(0,1fr) auto;gap:7px;align-items:center;border-radius:14px;background:rgba(255,255,255,.05);padding:8px 9px}.vnr3-queue-index{width:20px;height:20px;border-radius:7px;background:rgba(255,255,255,.09);display:grid;place-items:center;font-size:10px}.vnr3-mini-action{appearance:none;border:0;background:rgba(255,255,255,.07);color:inherit;width:27px;height:27px;border-radius:50%;cursor:pointer}.vnr3-mini-action:hover{background:rgba(255,255,255,.14)}.vnr3-mini-action.on{background:rgba(255,255,255,.2);color:#fff}.vnr3-editor-surface{border-top:1px solid rgba(255,255,255,.08);padding-top:17px}.vnr3-track-action{width:34px!important;height:34px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.13)!important;background:rgba(255,255,255,.055)!important;padding:0!important;display:grid!important;place-items:center!important;font-size:15px!important;line-height:1!important}.vnr3-track-action:hover{background:rgba(255,255,255,.12)!important}.vnr3-track-action svg{width:16px!important;height:16px!important;stroke-width:1.7}',

        '.vnr3-song-scripts{margin-top:14px;border:1px solid rgba(255,255,255,.1);border-radius:20px;background:rgba(255,255,255,.035);overflow:hidden}.vnr3-song-scripts>summary{cursor:pointer;list-style:none;padding:14px 16px;font-size:14px;font-weight:650;display:flex;justify-content:space-between}.vnr3-song-scripts>summary::-webkit-details-marker{display:none}.vnr3-song-script-workspace{padding:0 14px 14px;border-top:1px solid rgba(255,255,255,.07)}.vnr3-song-script-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:12px 0}.vnr3-song-script-list{display:grid;gap:7px;max-height:210px;overflow:auto}.vnr3-song-script-row{display:grid;grid-template-columns:30px minmax(0,1fr) auto auto auto;align-items:center;gap:8px;padding:9px;border-radius:15px;background:rgba(255,255,255,.05);border:1px solid transparent}.vnr3-song-script-row.on{border-color:rgba(255,255,255,.2);background:rgba(255,255,255,.1)}.vnr3-song-script-editor{margin-top:10px;padding:12px;border-radius:16px;background:rgba(0,0,0,.14);border:1px solid rgba(255,255,255,.08)}',

        '@media(max-width:720px){.vnr3-shade{align-items:flex-end;padding:0}.vnr3-modal{width:100%;max-height:88vh;border-radius:26px 26px 0 0;padding:18px 16px 24px}.vnr3-toolbar{align-items:stretch;flex-direction:column}.vnr3-search{max-width:none}.vnr3-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.vnr3-detail-head{grid-template-columns:88px minmax(0,1fr);gap:14px;padding:13px}.vnr3-detail-title{font-size:20px}.vnr3-detail-actions{grid-column:1/-1;margin-top:10px}.vnr3-detail-actions .vnr3-btn{flex:1 1 auto}.vnr3-inline-ops{grid-column:1/-1}.vnr3-song-row{grid-template-columns:minmax(0,1fr)}.vnr3-track{grid-template-columns:24px 38px minmax(0,1fr) auto auto}.vnr3-track>.vnr3-state{display:none}.vnr3-script-layer{inset:26px 358px 76px}.vnr3-script-window{border-radius:24px}.vnr3-library-toolbar{grid-template-columns:1fr}.vnr3-library-toolbar .vnr3-inline-ops{justify-content:flex-start}.vnr3-library-dashboard{grid-template-columns:1fr}.vnr3-version-grid{grid-template-columns:1fr}}'

    ].join('');



    var renderMadeWithoutDependencies = renderMade;

    renderMade = function(box) {

        renderMadeWithoutDependencies(box);

        var fieldByLabel = {};

        FIELDS.forEach(function(field) {

            fieldByLabel[_stripHtml(field.label) || field.key] = field;

        });

        var rows = [].slice.call(box.querySelectorAll('.vnr2-set-r'));

        function attachedNodes(row, field) {

            var nodes = [row];

            if (field && field.type === 'multiselect' && row.nextElementSibling &&

                row.nextElementSibling.classList.contains('vnr2-wbl')) {

                nodes.push(row.nextElementSibling);

            }

            return nodes;

        }

        function paintDependencies() {

            // 本地 bool 兜底：外层 bool 在本作用域链不可见（ensureShell 内部），避免 ReferenceError

            function bool(v, d) {

                if (v === undefined || v === null) return !!d;

                return v !== false && v !== 'false' && v !== 0 && v !== '0';

            }

            rows.forEach(function(row) {

                var label = row.querySelector('.vnr2-set-l');

                var field = label && fieldByLabel[String(label.textContent || '').trim()];

                if (!field || !field.dependsOn) return;

                var enabled = bool(cfg[field.dependsOn], true);

                attachedNodes(row, field).forEach(function(node) {

                    node.style.opacity = enabled ? '' : '.34';

                    node.style.pointerEvents = enabled ? '' : 'none';

                    node.setAttribute('aria-disabled', enabled ? 'false' : 'true');

                    [].slice.call(node.querySelectorAll('input,select,textarea,button')).forEach(function(control) {

                        control.disabled = !enabled;

                    });

                });

            });

        }

        rows.forEach(function(row) {

            var label = row.querySelector('.vnr2-set-l');

            var field = label && fieldByLabel[String(label.textContent || '').trim()];

            if (!field || (field.key !== 'v3IncludeUserInfo' && field.key !== 'v3IncludeStoryContext')) return;

            var sw = row.querySelector('.vnr2-sw');

            if (!sw || sw.__vnr3DependencyWrapped) return;

            sw.__vnr3DependencyWrapped = true;

            var originalClick = sw.onclick;

            sw.onclick = function(event) {

                if (originalClick) originalClick.call(sw, event);

                paintDependencies();

            };

        });

        paintDependencies();

    };



    if (!eng.__v3RequestWrapped) {

        eng.__v3RequestWrapped = true;

        var vnr3OldRequest = eng.request;

        eng.request = function() {

            if (v3.state.mode !== 'recommend' && !v3.manualApiBypass) return;

            if (!v3.manualApiBypass && !v3.consumeAutoRequest()) {

                _toast('睡眠模式的自动请求次数已用完');

                return;

            }

            return vnr3OldRequest.apply(eng, arguments);

        };

        var vnr3OldNext = eng.next;

        eng.next = function() {

            if (v3.sleepStopPending) return;

            if (eng.running && v3.state.mode === 'playlist' && !(eng.queue || []).length) {

                var replayPlaylist = v3.playlistForQueueItem(eng.current);

                if (replayPlaylist && (replayPlaylist.songs || []).length) {

                    v3.loadPlaylist(replayPlaylist.id, false);

                    return vnr3OldNext.apply(eng, arguments);

                }

                /* 找不到来源歌单时宁可结束，也不回退到旧的最近历史补队列。 */

                eng.current = null;

                eng.running = false;

                eng.paused = true;

                eng.saveQueue();

                v3.uiRefresh();

                return;

            }

            var pl = v3.currentPlaylist();

            var sleep = v3.state.sleep;

            if (eng.running && v3.state.mode !== 'playlist' && !(eng.queue || []).length && pl && (!pl.system || pl.favoriteSystem)) {

                var shouldLoop = pl.playMode === 'repeat' || pl.playMode === 'repeat-one' ||

                    (sleep && sleep.active && sleep.loopExisting && !sleep.expired);

                if (pl.playMode === 'repeat-one' && eng.current && shouldLoop) {

                    var again = JSON.parse(JSON.stringify(eng.current));

                    again.id = 'repeat-' + Date.now();

                    again.spoken = false;

                    eng.queue = [again];

                } else if (shouldLoop) v3.loadPlaylist(pl.id, false);

                else {

                    var oldAuto = cfg.autoRequest;

                    cfg.autoRequest = false;

                    try { return vnr3OldNext.apply(eng, arguments); }

                    finally { cfg.autoRequest = oldAuto; }

                }

            }

            return vnr3OldNext.apply(eng, arguments);

        };

    }



    function V(cls, text) { return E('div', cls || '', text === undefined ? '' : text); }



    function songCover(song) {

        return String(song && (song.cover || song.coverUrl || song.pic || song.picture) || '').trim();

    }



    /*

     * Every radio surface shares one resolved cover per song. The base player,

     * bottom bar and playlist grid used to start independent picture lookups

     * before the first one had completed, which made the now-playing card lag.

     */

    var vnr3CoverCache = {};

    var vnr3CoverPending = {};

    var vnr3BaseFetchPic = _fetchPic;



    function rememberSongCover(song, url) {

        url = String(url || '').trim();

        if (!song || !url) return false;

        var key = _songKey(song);

        if (key) vnr3CoverCache[key] = url;

        var changed = false;

        function apply(target) {

            if (!target || key && _songKey(target) !== key) return;

            if (target.cover !== url || target.coverUrl !== url) changed = true;

            target.cover = url;

            target.coverUrl = url;

        }

        apply(song);

        if (!key) return changed;

        if (eng.current && eng.current.song) apply(eng.current.song);

        (eng.queue || []).forEach(function(item) { apply(item && item.song); });

        v3.playlists().forEach(function(pl) {

            (pl.songs || []).forEach(apply);

        });

        ((eng.store && eng.store.favoriteSongs) || []).forEach(apply);

        return changed;

    }



    function knownSongCover(song) {

        if (!song) return '';

        var direct = songCover(song);

        var key = _songKey(song);

        if (!direct && key) direct = vnr3CoverCache[key] || '';

        if (!direct && key) {

            v3.playlists().some(function(pl) {

                return (pl.songs || []).some(function(savedSong) {

                    if (_songKey(savedSong) !== key) return false;

                    direct = songCover(savedSong);

                    return !!direct;

                });

            });

        }

        if (direct) rememberSongCover(song, direct);

        return direct;

    }



    _fetchPic = function(song, cb) {

        cb = cb || function() {};

        var direct = knownSongCover(song);

        if (direct) {

            cb(direct);

            return;

        }

        if (!song) {

            cb('');

            return;

        }

        var key = _songKey(song);

        if (!key) return vnr3BaseFetchPic(song, cb);

        if (vnr3CoverPending[key]) {

            vnr3CoverPending[key].push(cb);

            return;

        }

        vnr3CoverPending[key] = [cb];

        return vnr3BaseFetchPic(song, function(url) {

            var callbacks = vnr3CoverPending[key] || [];

            delete vnr3CoverPending[key];

            var changed = url ? rememberSongCover(song, url) : false;

            callbacks.forEach(function(done) {

                try { done(url || ''); } catch (e) {}

            });

            if (changed) {

                try { eng.saveQueue(); } catch (e2) {}

                try { eng.saveStore(); } catch (e3) {}

                v3.uiRefresh();

            }

        });

    };

    if (!eng.__v3FavoriteMediaWrapped) {

        eng.__v3FavoriteMediaWrapped = true;

        function keepFavoriteMedia(song) {

            var favorite = _favByKey(_songKey(song));

            if (!favorite) return;

            favorite.cover = song.cover || song.coverUrl || song.pic || song.picture || favorite.cover || '';

            favorite.coverUrl = favorite.cover;

            favorite.album = song.album || favorite.album || '';

            favorite.source = song.source || favorite.source || '';

            favorite._trackId = song._trackId || song.sourceId || favorite._trackId || '';

            favorite.id = favorite.id || song.id || ('fav-' + Date.now() + '-' + Math.floor(Math.random() * 100000));

        }

        var vnr3BaseToggleFav = eng.toggleFav;

        eng.toggleFav = function(song, say) {

            vnr3BaseToggleFav.call(eng, song, say);

            keepFavoriteMedia(song || {});

            eng.saveStore();

            v3.uiRefresh();

        };

        var vnr3BaseAddFav = eng.addFav;

        eng.addFav = function(song, say) {

            vnr3BaseAddFav.call(eng, song, say);

            keepFavoriteMedia(song || {});

            eng.saveStore();

            v3.uiRefresh();

        };

        var vnr3BaseRemoveFav = eng.removeFav;

        eng.removeFav = function(song) {

            vnr3BaseRemoveFav.call(eng, song);

            v3.uiRefresh();

        };

    }

    function button(text, fn, cls) {

        var b = E('button', 'vnr3-btn' + (cls ? ' ' + cls : ''), text);

        b.type = 'button';

        b.onclick = fn || function() {};

        return b;

    }

    function field(label, value, type) {

        var w = V('vnr3-field');

        w.appendChild(V('vnr3-label', label));

        var inp = E(type === 'textarea' ? 'textarea' : 'input', 'vnr3-input');

        if (type && type !== 'textarea') inp.type = type;

        inp.value = value === undefined ? '' : value;

        w.appendChild(inp);

        w.input = inp;

        return w;

    }

    function selectField(label, value, options) {

        var w = V('vnr3-field');

        w.appendChild(V('vnr3-label', label));

        var sel = E('select', 'vnr3-input');

        (options || []).forEach(function(option) {

            var op = E('option', '', option.label);

            op.value = option.value;

            if (option.value === value) op.selected = true;

            sel.appendChild(op);

        });

        w.appendChild(sel);

        w.input = sel;

        return w;

    }

    function imagePicker(targetField) {

        var pick = field('或从设备选择图片', '', 'file');

        pick.input.accept = 'image/*';

        pick.input.onchange = function() {

            var file = pick.input.files && pick.input.files[0];

            if (!file) return;

            var reader = new TOP.FileReader();

            reader.onload = function() { targetField.input.value = String(reader.result || ''); };

            reader.readAsDataURL(file);

        };

        return pick;

    }

    function modal(title) {

        var previous = shell.querySelector('.vnr3-shade');

        if (previous) previous.remove();

        var shade = V('vnr3-shade'), card = V('vnr3-modal');

        var head = V('vnr3-modal-head');

        head.appendChild(V('vnr3-modal-title', title));

        head.appendChild(button('×', function() { shade.remove(); }, 'icon'));

        card.appendChild(head);

        shade.appendChild(card);

        shell.appendChild(shade);

        shade.card = card;

        var backdropArmed = false;

        shade.onpointerdown = function(ev) { backdropArmed = ev.target === shade; };

        shade.onclick = function(ev) {

            if (ev.target === shade && backdropArmed) shade.remove();

            backdropArmed = false;

        };

        return shade;

    }

    function choice(title, options) {

        var m = modal(title);

        var list = V('vnr3-choice-list');

        options.forEach(function(o) {

            var row = button(o.label, function() {

                m.remove();

                o.action && o.action();

            }, 'choice');

            if (o.note) row.appendChild(V('vnr3-choice-note', o.note));

            list.appendChild(row);

        });

        m.card.appendChild(list);

    }

    function confirmAction(title, note, action) {

        var m = modal(title);

        m.card.appendChild(V('vnr3-hint', note || '此操作无法自动撤销。'));

        var ops = V('vnr3-ops');

        ops.appendChild(button('取消', function() { m.remove(); }));

        ops.appendChild(button('确认', function() {

            m.remove();

            action && action();

        }, 'danger'));

        m.card.appendChild(ops);

    }



    function playlistCover(pl) {

        if (pl.id === 'now-playing') {

            var now = curSong();

            return knownSongCover(now);

        }

        var songs = pl.songs || [];

        for (var i = songs.length - 1; i >= 0; i--) {

            var cover = knownSongCover(songs[i]);

            if (cover) return cover;

        }

        return String(pl.cover || '').trim();

    }



    function openCreatePlaylist() {

        var m = modal('新建歌单');

        var name = field('歌单名称', '', 'text');

        var desc = field('简介（可选）', '', 'textarea');

        var cover = field('封面图片 URL（可选）', '', 'text');

        var auto = V('vnr3-toggle-row');

        auto.appendChild(V('', '播放时自动请求台本'));

        var sw = E('button', 'vnr2-sw');

        sw.appendChild(E('i', ''));

        sw.onclick = function() { sw.classList.toggle('on'); };

        auto.appendChild(sw);

        m.card.appendChild(name); m.card.appendChild(desc); m.card.appendChild(cover); m.card.appendChild(imagePicker(cover)); m.card.appendChild(auto);

        var ops = V('vnr3-ops');

        ops.appendChild(button('取消', function() { m.remove(); }));

        ops.appendChild(button('创建', function() {

            var pl = v3.createPlaylist({

                name: name.input.value,

                description: desc.input.value,

                cover: cover.input.value,

                autoScripts: sw.classList.contains('on')

            });

            m.remove();

            u.v3PlaylistId = pl.id;

            u.view = 'playlist-detail';

            savePos();

            renderMain();

        }, 'primary'));

        m.card.appendChild(ops);

        name.input.focus();

    }



    function openPlaylistSettings(pl) {

        var m = modal('歌单设置');

        var name = field('名称', pl.name, 'text');

        var desc = field('简介', pl.description || '', 'textarea');

        var cover = field('自定义封面 URL（留空则使用最新歌曲封面）', pl.cover || '', 'text');

        var batch = field('每次请求关联台本的歌曲数', pl.scriptBatchSize || 30, 'number');

        var play = V('vnr3-segment');

        ['sequence', 'repeat', 'repeat-one', 'shuffle'].forEach(function(mode) {

            var labels = { sequence: '顺序', repeat: '列表循环', 'repeat-one': '单曲循环', shuffle: '随机' };

            var b = button(labels[mode], function() {

                [].slice.call(play.children).forEach(function(x) { x.classList.remove('on'); });

                b.classList.add('on');

                play.dataset.mode = mode;

            });

            if ((pl.playMode || 'sequence') === mode) b.classList.add('on');

            play.appendChild(b);

        });

        play.dataset.mode = pl.playMode || 'sequence';

        var auto = V('vnr3-toggle-row');

        auto.appendChild(V('', '播放时自动请求台本'));

        var sw = E('button', 'vnr2-sw' + (pl.autoScripts ? ' on' : ''));

        sw.appendChild(E('i', ''));

        sw.onclick = function() { sw.classList.toggle('on'); };

        auto.appendChild(sw);

        m.card.appendChild(name); m.card.appendChild(desc); m.card.appendChild(cover); m.card.appendChild(imagePicker(cover)); m.card.appendChild(batch);

        m.card.appendChild(V('vnr3-label', '播放方式')); m.card.appendChild(play); m.card.appendChild(auto);

        var ops = V('vnr3-ops');

        if (!pl.system) {

            ops.appendChild(button('合并到其他歌单', function() {

                var targets = v3.playlists().filter(function(x) { return !x.system && x.id !== pl.id; });

                if (!targets.length) { _toast('还没有其他可合并的歌单'); return; }

                choice('选择合并目标', targets.map(function(target) {

                    return { label: target.name, note: (target.songs || []).length + ' 首', action: function() {

                        var r = v3.mergePlaylists(pl.id, target.id, false);

                        _toast('已合并 ' + r.added + ' 首，跳过重复 ' + r.duplicate + ' 首');

                    } };

                }));

            }));

            ops.appendChild(button('删除歌单', function() {

                confirmAction('删除“' + pl.name + '”？', '歌单及其中的本地歌曲记录会被删除。', function() {

                    v3.deletePlaylist(pl.id);

                    m.remove(); u.view = 'playlists'; renderMain(); renderSidebar();

                });

            }, 'danger'));

        }

        ops.appendChild(button('取消', function() { m.remove(); }));

        ops.appendChild(button('保存', function() {

            v3.updatePlaylist(pl.id, {

                name: name.input.value,

                description: desc.input.value,

                cover: cover.input.value,

                scriptBatchSize: batch.input.value,

                playMode: play.dataset.mode,

                autoScripts: sw.classList.contains('on')

            });

            m.remove();

            renderMain();

        }, 'primary'));

        m.card.appendChild(ops);

    }



    function openManualAdd(pl) {

        var m = modal('添加歌曲');

        var input = field('每行一首：歌名 - 歌手 - 音频URL - 封面URL', '', 'textarea');

        input.input.style.minHeight = '180px';

        m.card.appendChild(input);

        var ops = V('vnr3-ops');

        ops.appendChild(button('取消', function() { m.remove(); }));

        ops.appendChild(button('添加', function() {

            var songs = v3.manualSongs(input.input.value);

            var r = v3.addSongs(pl.id, songs, false);

            _toast('已添加 ' + r.added + ' 首，跳过重复 ' + r.duplicate + ' 首');

            m.remove(); renderMain();

        }, 'primary'));

        m.card.appendChild(ops);

    }



    function openImport(pl) {

        var m = modal('导入网易云歌单');

        var url = field('网易云歌单分享链接', '', 'text');

        var status = V('vnr3-hint', '只解析公开歌单资料，不登录网易云账号。');

        m.card.appendChild(url); m.card.appendChild(status);

        var ops = V('vnr3-ops');

        ops.appendChild(button('取消', function() { m.remove(); }));

        ops.appendChild(button('解析预览', function() {

            status.textContent = '正在解析…';

            v3.importNetease(url.input.value, function(err, result) {

                if (err) { status.textContent = err; return; }

                [].slice.call(m.card.querySelectorAll('.vnr3-import-preview')).forEach(function(x) { x.remove(); });

                var preview = V('vnr3-import-preview');

                preview.appendChild(V('vnr3-preview-title', (result.name || '歌单') + ' · ' + result.songs.length + ' 首'));

                var list = V('vnr3-preview-list');

                result.songs.slice(0, 100).forEach(function(s, i) {

                    list.appendChild(V('vnr3-preview-row', (i + 1) + '. ' + s.title + (s.artist ? ' — ' + s.artist : '')));

                });

                preview.appendChild(list);

                var io = V('vnr3-ops');

                io.appendChild(button('新增缺少歌曲', function() {

                    var r = v3.addSongs(pl.id, result.songs, false);

                    _toast('导入 ' + r.added + ' 首，跳过重复 ' + r.duplicate + ' 首');

                    m.remove(); renderMain();

                }, 'primary'));

                io.appendChild(button('完全覆盖', function() {

                    confirmAction('完全覆盖当前歌单？', '现有歌曲会被本次解析结果替换。', function() {

                        var r = v3.addSongs(pl.id, result.songs, true);

                        _toast('已覆盖并导入 ' + r.added + ' 首');

                        m.remove(); renderMain();

                    });

                }));

                preview.appendChild(io);

                m.card.insertBefore(preview, ops);

                status.textContent = '解析完成，请确认导入方式。';

            });

        }, 'primary'));

        m.card.appendChild(ops);

        url.input.focus();

    }



    function playPlaylist(pl) {

        if (pl.id === 'now-playing') {

            eng.playPause();

            return;

        }

        choice('播放“' + pl.name + '”', [

            { label: '替换正在播放', note: '使用该歌单替换后续队列', action: function() { v3.loadPlaylist(pl.id, false); drawShell(); } },

            { label: '追加到正在播放', note: '保留当前队列并追加到末尾', action: function() { v3.loadPlaylist(pl.id, true); drawShell(); } }

        ]);

    }



    function renderPlaylists(box) {

        var toolbar = V('vnr3-toolbar');

        var title = V('');

        title.appendChild(V('vnr3-title', 'All Playlists'));

        title.appendChild(V('vnr3-sub', '本地歌单与当前播放队列'));

        toolbar.appendChild(title);

        var search = E('input', 'vnr3-search');

        search.placeholder = '搜索歌单';

        toolbar.appendChild(search);

        box.appendChild(toolbar);

        var grid = V('vnr3-grid');

        function paint() {

            grid.innerHTML = '';

            var q = String(search.value || '').toLowerCase();

            function playlistRank(pl) {

                if (pl.id === 'now-playing') return 0;

                if (pl.id === 'my-favorites') return 1;

                return 2;

            }

            var list = v3.playlists().slice().sort(function(a, b) {

                var ar = playlistRank(a), br = playlistRank(b);

                if (ar !== br) return ar - br;

                return (a.order || 0) - (b.order || 0);

            });

            list.forEach(function(pl) {

                if (q && String(pl.name || '').toLowerCase().indexOf(q) < 0) return;

                var card = V('vnr3-pl-card' + (pl.system ? ' system' : ''));

                card.dataset.playlistId = pl.id;

                var cover = V('vnr3-pl-cover');

                var src = playlistCover(pl);

                if (src) {

                    var img = E('img', ''); img.src = src; cover.appendChild(img);

                } else cover.appendChild(V('vnr3-default-cover', '♫'));

                if (pl.id === 'now-playing') cover.appendChild(V('vnr3-current-chip', '当前'));

                if (pl.id === 'my-favorites') cover.appendChild(V('vnr3-current-chip', '收藏'));

                card.appendChild(cover);

                card.appendChild(V('vnr3-card-name', pl.name || '未命名歌单'));

                var count = pl.id === 'now-playing' ? v3.nowSongs().length : (pl.songs || []).length;

                card.appendChild(V('vnr3-card-sub', count + ' 首歌曲'));

                card.onclick = function() {

                    u.v3PlaylistId = pl.id; v3.state.activePlaylistId = pl.id;

                    u.plFav = false;

                    u.v3ShowScript = false;

                    u.view = 'playlist-detail'; v3.save(); savePos(); renderMain();

                };

                grid.appendChild(card);

            });

            var add = V('vnr3-pl-card vnr3-add-card');

            add.appendChild(V('vnr3-pl-cover vnr3-add-cover', '+'));

            add.appendChild(V('vnr3-card-name', '新建歌单'));

            add.appendChild(V('vnr3-card-sub', '添加一个本地歌单'));

            add.onclick = openCreatePlaylist;

            grid.appendChild(add);

        }

        search.oninput = paint;

        box.appendChild(grid);

        paint();

    }



    function openSongEditor(pl, song) {

        song = song || { id: '', title: '', artist: '', url: '', cover: '' };

        var m = modal(song.id ? '编辑歌曲' : '新增歌曲');

        m.card.style.width = 'min(680px,94vw)';

        var title = field('歌名（必填）', song.title || '', 'text');

        var artist = field('歌手（可选）', song.artist || '', 'text');

        var url = field('音频 URL（可选）', song.url || '', 'text');

        var cover = field('封面 URL（可选）', song.cover || '', 'text');

        m.card.appendChild(title); m.card.appendChild(artist); m.card.appendChild(url); m.card.appendChild(cover);



        var workingScripts = JSON.parse(JSON.stringify(song.scriptVersions || []));

        workingScripts.forEach(function(version, index) {

            if (!version.id) version.id = 'script-edit-' + Date.now() + '-' + index;

            if (!version.label) version.label = '台本版本 ' + (index + 1);

        });

        var selectionMode = song.scriptSelectionMode === 'random' ? 'random' : 'single';

        var selectedScriptId = song.selectedScriptId || (workingScripts[0] && workingScripts[0].id) || '';

        var selectedScriptIds = Object.prototype.toString.call(song.selectedScriptIds) === '[object Array]' ?

            song.selectedScriptIds.slice() : (selectedScriptId ? [selectedScriptId] : []);

        var editingScriptId = '';

        var scriptDetails = E('details', 'vnr3-song-scripts');

        var scriptSummary = E('summary', '');

        scriptDetails.appendChild(scriptSummary);

        var scriptWorkspace = V('vnr3-song-script-workspace');

        scriptDetails.appendChild(scriptWorkspace);



        function setSingleScript(id) {

            selectedScriptId = id;

            selectedScriptIds = id ? [id] : [];

        }

        function scriptSelected(id) {

            return selectionMode === 'random' ? selectedScriptIds.indexOf(id) >= 0 : selectedScriptId === id;

        }

        function paintScriptWorkspace() {

            scriptSummary.textContent = '内置台本 · ' + workingScripts.length + ' 个版本';

            scriptWorkspace.innerHTML = '';

            var toolbar = V('vnr3-song-script-toolbar');

            var modes = V('vnr3-segment');

            modes.appendChild(button('指定一个生效', function() {

                selectionMode = 'single';

                if (!selectedScriptId && selectedScriptIds.length) selectedScriptId = selectedScriptIds[0];

                if (!selectedScriptId && workingScripts[0]) setSingleScript(workingScripts[0].id);

                paintScriptWorkspace();

            }, selectionMode === 'single' ? 'on' : ''));

            modes.appendChild(button('勾选后随机', function() {

                selectionMode = 'random';

                if (!selectedScriptIds.length && selectedScriptId) selectedScriptIds = [selectedScriptId];

                paintScriptWorkspace();

            }, selectionMode === 'random' ? 'on' : ''));

            toolbar.appendChild(modes);

            var tools = V('vnr3-segment');

            if (selectionMode === 'random' && workingScripts.length) {

                tools.appendChild(button('全选', function() {

                    selectedScriptIds = workingScripts.map(function(version) { return version.id; });

                    paintScriptWorkspace();

                }));

            }

            tools.appendChild(button('＋ 新台本', function() {

                var fresh = {

                    id: 'script-' + Date.now() + '-' + Math.floor(Math.random() * 10000),

                    t: Date.now(),

                    label: '自定义台本',

                    host: '',

                    say: '',

                    favorite: false

                };

                workingScripts.unshift(fresh);

                editingScriptId = fresh.id;

                if (selectionMode === 'single') setSingleScript(fresh.id);

                else selectedScriptIds.push(fresh.id);

                paintScriptWorkspace();

            }, 'primary'));

            toolbar.appendChild(tools);

            scriptWorkspace.appendChild(toolbar);

            scriptWorkspace.appendChild(V('vnr3-hint', selectionMode === 'random' ?

                '每次把歌曲加入播放队列时，会从勾选版本中随机选择一个台本。' :

                '播放这首歌曲时固定使用当前选中的台本版本。'));



            var list = V('vnr3-song-script-list');

            if (!workingScripts.length) list.appendChild(V('vnr3-hint', '还没有保存过台本。点击“新台本”即可添加。'));

            workingScripts.forEach(function(version, index) {

                var row = V('vnr3-song-script-row' + (scriptSelected(version.id) ? ' on' : ''));

                var pick = E('button', 'vnr3-mini-action',

                    selectionMode === 'random' ? (scriptSelected(version.id) ? '✓' : '') : (scriptSelected(version.id) ? '●' : ''));

                pick.title = selectionMode === 'random' ? '加入/移出随机候选' : '设为生效台本';

                pick.onclick = function() {

                    if (selectionMode === 'random') {

                        var at = selectedScriptIds.indexOf(version.id);

                        if (at >= 0) selectedScriptIds.splice(at, 1);

                        else selectedScriptIds.push(version.id);

                    } else setSingleScript(version.id);

                    paintScriptWorkspace();

                };

                row.appendChild(pick);

                var copy = V('');

                copy.appendChild(V('vnr3-version-name', version.label || ('台本版本 ' + (index + 1))));

                copy.appendChild(V('vnr3-version-meta',

                    (version.favorite ? '已收藏 · ' : '') +

                    (version.host || '未指定主持人') + ' · ' + String(version.say || '').length + ' 字'));

                row.appendChild(copy);

                var favorite = E('button', 'vnr3-mini-action' + (version.favorite ? ' on' : ''), version.favorite ? '★' : '☆');

                favorite.title = version.favorite ? '取消收藏；之后可被普通历史清理' : '收藏并永久保留';

                favorite.onclick = function() {

                    var persisted = false;

                    if (song.id && (song.scriptVersions || []).some(function(saved) { return saved && saved.id === version.id; })) {

                        var next = v3.toggleSongScriptFavorite({ song: song, librarySongId: song.id }, version.id);

                        version.favorite = !!next;

                        persisted = true;

                    } else {

                        version.favorite = !version.favorite;

                        version.favoritedAt = version.favorite ? Date.now() : 0;

                    }

                    _toast(version.favorite ?

                        (persisted ? '台本已收藏，将永久保留' : '已标记收藏，保存歌曲后将永久保留') :

                        '已取消收藏');

                    paintScriptWorkspace();

                };

                row.appendChild(favorite);

                var edit = E('button', 'vnr3-mini-action', '✎');

                edit.title = '展开编辑';

                edit.onclick = function() {

                    editingScriptId = editingScriptId === version.id ? '' : version.id;

                    paintScriptWorkspace();

                };

                row.appendChild(edit);

                var del = E('button', 'vnr3-mini-action', '×');

                del.title = version.favorite ? '收藏台本受保护，请先取消收藏' : '删除版本';

                del.onclick = function() {

                    if (version.favorite) {

                        _toast('已收藏的台本会永久保留，请先取消收藏');

                        return;

                    }

                    workingScripts.splice(index, 1);

                    selectedScriptIds = selectedScriptIds.filter(function(id) { return id !== version.id; });

                    if (selectedScriptId === version.id) {

                        selectedScriptId = workingScripts[0] && workingScripts[0].id || '';

                    }

                    if (editingScriptId === version.id) editingScriptId = '';

                    paintScriptWorkspace();

                };

                row.appendChild(del);

                list.appendChild(row);

            });

            scriptWorkspace.appendChild(list);



            var editing = null;

            workingScripts.forEach(function(version) { if (version.id === editingScriptId) editing = version; });

            if (editing) {

                var editor = V('vnr3-song-script-editor');

                var labelField = field('版本名称', editing.label || '', 'text');

                var hostField = field('主持人', editing.host || '', 'text');

                var sayField = field('台本内容', editing.say || '', 'textarea');

                sayField.input.style.minHeight = '150px';

                labelField.input.oninput = function() { editing.label = labelField.input.value; editing.t = Date.now(); };

                hostField.input.oninput = function() { editing.host = hostField.input.value; editing.t = Date.now(); };

                sayField.input.oninput = function() { editing.say = sayField.input.value; editing.t = Date.now(); };

                editor.appendChild(labelField); editor.appendChild(hostField); editor.appendChild(sayField);

                var editorOps = V('vnr3-inline-ops');

                editorOps.appendChild(button('收起', function() {

                    editingScriptId = '';

                    paintScriptWorkspace();

                }));

                editorOps.appendChild(button('应用到当前版本', function() {

                    editing.label = labelField.input.value.trim() || '未命名台本';

                    editing.host = hostField.input.value.trim();

                    editing.say = sayField.input.value.trim();

                    editing.t = Date.now();

                    editingScriptId = '';

                    paintScriptWorkspace();

                }, 'primary'));

                editor.appendChild(editorOps);

                scriptWorkspace.appendChild(editor);

            }

        }

        paintScriptWorkspace();

        m.card.appendChild(scriptDetails);



        var advToggle = V('vnr3-toggle-row');

        advToggle.appendChild(V('', '高级播放参数'));

        var sw = E('button', 'vnr2-sw' + (song.advanced ? ' on' : '')); sw.appendChild(E('i', ''));

        advToggle.appendChild(sw); m.card.appendChild(advToggle);

        var adv = V('vnr3-advanced');

        var oldAdv = song.advanced || {};

        var volumeMode = oldAdv.volumeMode || (song.advanced ? 'custom' : 'global');

        var duckMode = oldAdv.duckMode || (oldAdv.duck === true ? 'custom' : (oldAdv.duck === false ? 'none' : 'follow'));

        var volMode = selectField('背景音量', volumeMode, [

            { value: 'global', label: '跟随背景音总音量' },

            { value: 'custom', label: '使用自定义音量' }

        ]);

        var vol = field('自定义音量 0-100', oldAdv.volume !== undefined ? oldAdv.volume : 55, 'number');

        var duckModeField = selectField('主持人说话时', duckMode, [

            { value: 'follow', label: '跟随普通音乐压低设置' },

            { value: 'none', label: '保持原音量，不压低' },

            { value: 'custom', label: '压低到自定义音量' }

        ]);

        var duck = field('说话时自定义音量 0-100', oldAdv.duckVolume !== undefined ? oldAdv.duckVolume : 20, 'number');

        adv.appendChild(volMode); adv.appendChild(vol); adv.appendChild(duckModeField); adv.appendChild(duck);

        var loop = V('vnr3-toggle-row'); loop.appendChild(V('', '单曲循环'));

        var loopSw = E('button', 'vnr2-sw' + (!song.advanced || song.advanced.loop !== false ? ' on' : '')); loopSw.appendChild(E('i', '')); loop.appendChild(loopSw); adv.appendChild(loop);

        m.card.appendChild(adv);

        function paintAdv() {

            adv.style.display = sw.classList.contains('on') ? 'grid' : 'none';

            vol.style.display = volMode.input.value === 'custom' ? 'grid' : 'none';

            duck.style.display = duckModeField.input.value === 'custom' ? 'grid' : 'none';

        }

        sw.onclick = function() { sw.classList.toggle('on'); paintAdv(); };

        volMode.input.onchange = paintAdv;

        duckModeField.input.onchange = paintAdv;

        loopSw.onclick = function() { loopSw.classList.toggle('on'); };

        paintAdv();

        var ops = V('vnr3-ops');

        ops.appendChild(button('取消', function() { m.remove(); }));

        ops.appendChild(button('保存', function() {

            if (!title.input.value.trim()) { _toast('歌名不能为空'); return; }

            var data = {

                id: song.id || undefined, title: title.input.value, artist: artist.input.value,

                url: url.input.value, cover: cover.input.value,

                advanced: sw.classList.contains('on') ? {

                    volumeMode: volMode.input.value,

                    volume: Number(vol.input.value) || 55,

                    duckMode: duckModeField.input.value,

                    duckVolume: Number(duck.input.value) || 20,

                    loop: loopSw.classList.contains('on')

                } : null,

                scriptVersions: workingScripts.filter(function(version) { return !!String(version.say || '').trim(); }),

                selectedScriptId: selectedScriptId,

                selectedScriptIds: selectedScriptIds.filter(function(id) {

                    return workingScripts.some(function(version) { return version.id === id && !!String(version.say || '').trim(); });

                }),

                scriptSelectionMode: selectionMode

            };

            if (data.scriptSelectionMode === 'single' &&

                !data.scriptVersions.some(function(version) { return version.id === data.selectedScriptId; })) {

                data.selectedScriptId = data.scriptVersions[0] && data.scriptVersions[0].id || '';

                data.selectedScriptIds = data.selectedScriptId ? [data.selectedScriptId] : [];

            }

            if (song.id) {

                var originalKey = _songKey(song);

                for (var i = 0; i < pl.songs.length; i++) if (pl.songs[i].id === song.id) pl.songs[i] = data;

                /* 台本版本按歌曲同步到其他本地歌单副本，避免同一首歌在不同入口显示不同。 */

                v3.playlists().forEach(function(playlist) {

                    (playlist.songs || []).forEach(function(savedSong) {

                        if (_songKey(savedSong) !== originalKey || savedSong.id === song.id && playlist === pl) return;

                        savedSong.scriptVersions = JSON.parse(JSON.stringify(data.scriptVersions));

                        savedSong.selectedScriptId = data.selectedScriptId;

                        savedSong.selectedScriptIds = data.selectedScriptIds.slice();

                        savedSong.scriptSelectionMode = data.scriptSelectionMode;

                    });

                });

                var favorites = eng.store.favoriteSongs || (eng.store.favoriteSongs = []);

                var favoriteChanged = false;

                favorites.forEach(function(favoriteSong, index) {

                    if (_songKey(favoriteSong) === originalKey) {

                        if (pl.id === 'my-favorites') {

                            favorites[index] = JSON.parse(JSON.stringify(data));

                        } else {

                            favoriteSong.scriptVersions = JSON.parse(JSON.stringify(data.scriptVersions));

                            favoriteSong.selectedScriptId = data.selectedScriptId;

                            favoriteSong.selectedScriptIds = data.selectedScriptIds.slice();

                            favoriteSong.scriptSelectionMode = data.scriptSelectionMode;

                        }

                        favoriteChanged = true;

                    }

                });

                if (pl.id === 'my-favorites' && !favoriteChanged) favorites.push(JSON.parse(JSON.stringify(data)));

                if (favoriteChanged || pl.id === 'my-favorites') eng.saveStore();

                v3.save();

                v3.uiRefresh();

            } else v3.addSongs(pl.id, [data], false);

            m.remove(); renderMain();

        }, 'primary'));

        m.card.appendChild(ops);

    }



    function renderPlaylistDetail(box) {

        var pl = v3.playlist(u.v3PlaylistId || v3.state.activePlaylistId) || v3.playlist('now-playing');

        v3.state.activePlaylistId = pl.id;

        var isNowPlaying = pl.id === 'now-playing';

        var isFavorites = pl.id === 'my-favorites';

        var songs = isNowPlaying ? v3.nowSongs() : (pl.songs || []);

        var nav = V('vnr3-detail-nav');

        var back = E('button', 'vnr3-back');

        back.type = 'button';

        back.title = '返回所有歌单';

        back.appendChild(V('vnr3-back-chevron', '‹'));

        back.appendChild(V('', '所有歌单'));

        back.onclick = function() {

            u.view = 'playlists';

            renderMain();

        };

        nav.appendChild(back);

        box.appendChild(nav);

        var head = V('vnr3-detail-head');

        var cover = V('vnr3-detail-cover');

        var src = playlistCover(pl);

        if (src) { var img = E('img', ''); img.src = src; cover.appendChild(img); }

        else cover.appendChild(V('vnr3-default-cover', '♫'));

        head.appendChild(cover);

        var info = V('vnr3-detail-info');

        info.appendChild(V('vnr3-kicker', isNowPlaying ? 'CURRENT PLAYLIST' : (isFavorites ? 'FAVORITES' : 'PLAYLIST')));

        info.appendChild(V('vnr3-detail-title', pl.name));

        info.appendChild(V('vnr3-detail-sub', songs.length + ' 首歌曲' + (pl.description ? ' · ' + pl.description : '')));

        var ops = V('vnr3-detail-actions');

        var playAction = button('', function() { playPlaylist(pl); }, 'primary');

        playAction.classList.add('vnr3-play-action');

        playAction.appendChild(V('vnr3-play-glyph', '▶'));

        playAction.appendChild(V('', '播放'));

        ops.appendChild(playAction);

        if (!isNowPlaying && !isFavorites) {

            ops.appendChild(button('导入歌单', function() { openImport(pl); }));

            ops.appendChild(button('添加歌曲', function() { openManualAdd(pl); }));

        }

        if (!isFavorites) ops.appendChild(button('设置', function() { openPlaylistSettings(pl); }));

        ops.appendChild(button('台本', function() { openContinuousPanel(pl); }));

        info.appendChild(ops); head.appendChild(info); box.appendChild(head);

        var bulk = V('vnr3-bulk');

        var selected = {};

        var list = V('vnr3-track-list');

        var selectionHead = V('vnr3-select-head');

        var selectionHint = V('vnr3-select-count', '已选择 0 / ' + songs.length + ' 首');

        var selectionActions = V('vnr3-select-actions');

        selectionActions.appendChild(button('全选', function() {

            songs.forEach(function(song) { selected[song.id] = true; });

            paintChecks();

        }));

        selectionActions.appendChild(button('取消全选', function() {

            selected = {};

            paintChecks();

        }));

        selectionHead.appendChild(selectionHint);

        selectionHead.appendChild(selectionActions);

        bulk.appendChild(selectionHead);

        bulk.appendChild(V('vnr3-hint', '勾选后可复制、移动、删除或请求台本'));

        var bulkOps = V('vnr3-bulk-actions');

        function selectedSongs() {

            return songs.filter(function(s) { return selected[s.id]; });

        }

        function paintChecks() {

            [].slice.call(list.querySelectorAll('.vnr3-check[data-song-id]')).forEach(function(check) {

                check.classList.toggle('on', !!selected[check.dataset.songId]);

            });

            selectionHint.textContent = '已选择 ' + selectedSongs().length + ' / ' + songs.length + ' 首';

        }

        function chooseTarget(move) {

            var picked = selectedSongs();

            if (!picked.length) { _toast('请先勾选歌曲'); return; }

            var targets = v3.playlists().filter(function(x) { return !x.system && x.id !== pl.id; });

            if (!targets.length) { _toast('还没有可用的目标歌单'); return; }

            choice(move ? '移动到歌单' : '复制到歌单', targets.map(function(target) {

                return { label: target.name, note: (target.songs || []).length + ' 首', action: function() {

                    var r;

                    if (isNowPlaying) {

                        r = v3.addSongs(target.id, picked, false);

                        if (move) picked.forEach(function(song) {

                            var items = (eng.current ? [eng.current] : []).concat(eng.queue || []);

                            items.forEach(function(it) { if (it.id === song.queueItemId) eng.removeItem(it); });

                        });

                    } else if (isFavorites) {

                        r = v3.addSongs(target.id, picked, false);

                        if (move) picked.forEach(function(song) { eng.removeFav(song); });

                    } else r = v3.copySongs(pl.id, picked.map(function(s) { return s.id; }), target.id, move);

                    _toast((move ? '已移动 ' : '已复制 ') + r.added + ' 首，跳过重复 ' + r.duplicate + ' 首');

                    renderMain();

                } };

            }));

        }

        bulkOps.appendChild(button('复制到…', function() { chooseTarget(false); }));

        bulkOps.appendChild(button('移动到…', function() { chooseTarget(true); }));

        bulkOps.appendChild(button('删除', function() {

            var picked = selectedSongs();

            if (!picked.length) { _toast('请先勾选歌曲'); return; }

            var deleteNote = isNowPlaying ? '只会从当前播放队列移除已选歌曲。' :

                (isFavorites ? '会将已选歌曲移出 Favorites，不会删除其他歌单中的歌曲。' : '只会从这个歌单移除已选歌曲，不影响其他歌单中的同名歌曲。');

            confirmAction('删除已选的 ' + picked.length + ' 首歌曲？', deleteNote, function() {

                if (isNowPlaying) picked.forEach(function(song) {

                    var items = (eng.current ? [eng.current] : []).concat(eng.queue || []);

                    items.forEach(function(it) { if (it.id === song.queueItemId) eng.removeItem(it); });

                });

                else if (isFavorites) picked.forEach(function(song) { eng.removeFav(song); });

                else v3.removeSongs(pl.id, picked.map(function(s) { return s.id; }));

                renderMain();

            });

        }, 'danger'));

        if (isNowPlaying) bulkOps.appendChild(button('请求勾选台本', function() {

            var ids = selectedSongs().map(function(s) { return s.queueItemId; });

            if (!ids.length) { _toast('请先勾选歌曲'); return; }

            v3.requestLinkedScripts(true, ids);

        }, 'primary'));

        var recommend = button('AI 推荐相似歌曲', function() {

            var ref = songs.filter(function(s) { return !Object.keys(selected).length || selected[s.id]; });

            openRecommend(ref, pl);

        });

        bulkOps.appendChild(recommend);

        if (!isNowPlaying && !isFavorites) bulkOps.appendChild(button('清空歌单', function() {

            confirmAction('清空“' + pl.name + '”？', '歌单会保留，但其中歌曲将全部移除。', function() {

                pl.songs = []; v3.save(); renderMain();

            });

        }, 'danger'));

        bulk.appendChild(bulkOps); box.appendChild(bulk);

        if (!songs.length) list.appendChild(V('vnr2-empty', '这个歌单还没有歌曲。'));

        songs.forEach(function(song, index) {

            var row = V('vnr3-track');

            var ck = E('button', 'vnr3-check'); ck.type = 'button'; ck.textContent = '';

            ck.dataset.songId = song.id;

            ck.title = '选择“' + (song.title || '这首歌曲') + '”';

            ck.onclick = function() { selected[song.id] = !selected[song.id]; paintChecks(); };

            row.appendChild(ck);

            var pic = V('vnr3-track-pic');

            if (song.cover) { var im = E('img', ''); im.src = song.cover; pic.appendChild(im); } else pic.textContent = '♫';

            row.appendChild(pic);

            var tx = V('vnr3-track-text');

            tx.appendChild(V('vnr3-track-title', song.title || '未命名歌曲'));

            tx.appendChild(V('vnr3-track-sub', song.artist || '未填写歌手'));

            row.appendChild(tx);

            if (song.pendingMatch || song.matchError) row.appendChild(V('vnr3-state', '待匹配'));

            var favoriteButton = button('', function() {

                eng.toggleFav(song, song.say || '');

                renderMain();

            }, 'icon');

            favoriteButton.classList.add('vnr3-track-action');

            favoriteButton.title = _isFav(song) ? '移出 Favorites' : '收入 Favorites';

            favoriteButton.innerHTML = icon2(_isFav(song) ? 'heartF' : 'heart');

            row.appendChild(favoriteButton);

            var moreButton = button('···', function() {

                choice(song.title || '歌曲操作', [

                    { label: '编辑歌曲与台本', action: function() {

                        if (isNowPlaying) { _toast('请从歌曲所属歌单或 Favorites 中编辑保存信息'); return; }

                        openSongEditor(pl, song);

                    } },

                    { label: '立即播放', action: function() { eng.queueSong(song, true); } },

                    { label: '加入正在播放', action: function() { eng.queueSong(song, false); } },

                    { label: '删除', action: function() {

                        if (isNowPlaying) {

                            var items = (eng.current ? [eng.current] : []).concat(eng.queue || []);

                            items.forEach(function(it) { if (it.id === song.queueItemId) eng.removeItem(it); });

                        } else if (isFavorites) eng.removeFav(song);

                        else v3.removeSongs(pl.id, [song.id]);

                        renderMain();

                    } }

                ]);

            }, 'icon');

            moreButton.classList.add('vnr3-track-action');

            moreButton.title = '更多';

            row.appendChild(moreButton);

            list.appendChild(row);

        });

        box.appendChild(list);

        if (!isNowPlaying && !isFavorites) box.appendChild(button('＋ 添加一首歌曲', function() { openSongEditor(pl, null); }, 'vnr3-wide-add'));

    }



    function openRecommend(refSongs, targetPl) {

        var m = modal('AI 只推荐歌曲');

        var note = field('临时推荐要求', '', 'textarea');

        var count = field('推荐数量', 30, 'number');

        m.card.appendChild(V('vnr3-hint', '参考 ' + refSongs.length + ' 首歌曲，只推荐歌曲，不生成台本。'));

        m.card.appendChild(note); m.card.appendChild(count);

        var status = V('vnr3-hint', ''); m.card.appendChild(status);

        var ops = V('vnr3-ops');

        ops.appendChild(button('取消', function() { m.remove(); }));

        ops.appendChild(button('开始推荐', function() {

            status.textContent = '正在请求推荐…';

            v3.recommendSongsOnly(refSongs, note.input.value + '\n请推荐 ' + (Number(count.input.value) || 30) + ' 首。', function(err, songs) {

                if (err) { status.textContent = String(err); return; }

                m.remove();

                openRecommendResult(songs, targetPl);

            });

        }, 'primary'));

        m.card.appendChild(ops);

    }



    function openRecommendResult(songs, targetPl) {

        var m = modal('推荐结果 · ' + songs.length + ' 首');

        var selected = {};

        var list = V('vnr3-preview-list');

        songs.forEach(function(s) {

            selected[s.id] = true;

            var row = V('vnr3-preview-row selectable on', s.title + (s.artist ? ' — ' + s.artist : ''));

            row.onclick = function() { selected[s.id] = !selected[s.id]; row.classList.toggle('on', !!selected[s.id]); };

            list.appendChild(row);

        });

        m.card.appendChild(list);

        var ops = V('vnr3-ops');

        ops.appendChild(button('加入当前歌单', function() {

            v3.addSongs(targetPl.id, songs.filter(function(s) { return selected[s.id]; }), false);

            m.remove(); renderMain();

        }, 'primary'));

        ops.appendChild(button('创建新歌单', function() {

            var pl = v3.createPlaylist({ name: 'AI 推荐歌单' });

            v3.addSongs(pl.id, songs.filter(function(s) { return selected[s.id]; }), false);

            m.remove(); u.v3PlaylistId = pl.id; u.view = 'playlist-detail'; renderMain();

        }));

        m.card.appendChild(ops);

    }



    function openModeMenu() {

        var modes = [

            { mode: 'recommend', label: '推荐模式', note: 'AI 推荐歌曲并写关联台本' },

            { mode: 'playlist', label: '歌单模式', note: '只为当前曲目补写关联台本' },

            { mode: 'companion', label: '陪伴模式', note: '生成与歌曲无关的连续长台本' }

        ];

        choice('请求模式', modes.map(function(x) {

            return { label: (v3.state.mode === x.mode ? '✓ ' : '') + x.label, note: x.note, action: function() { v3.setMode(x.mode); renderBottomBar(); renderMain(); } };

        }));

    }



    function openPendingScripts() {

        var m = modal('待处理台本');

        var items = (eng.current ? [eng.current] : []).concat(eng.queue || []).filter(function(it) {

            return it && (it.needsScript || !it.say || it.scriptFresh === false);

        });

        var selected = {};

        if (!items.length) m.card.appendChild(V('vnr2-empty', '当前播放列表没有需要补写或更新的台本。'));

        var list = V('vnr3-preview-list');

        items.forEach(function(it) {

            selected[it.id] = true;

            var s = it.song || {};

            var row = V('vnr3-preview-row selectable on', (s.title || '未命名歌曲') + (s.artist ? ' — ' + s.artist : ''));

            row.onclick = function() { selected[it.id] = !selected[it.id]; row.classList.toggle('on', !!selected[it.id]); };

            list.appendChild(row);

        });

        m.card.appendChild(list);

        if (items.length) {

            var ops = V('vnr3-ops');

            ops.appendChild(button('取消', function() { m.remove(); }));

            ops.appendChild(button('请求勾选台本', function() {

                var ids = items.filter(function(it) { return selected[it.id]; }).map(function(it) { return it.id; });

                m.remove(); v3.requestLinkedScripts(true, ids);

            }, 'primary'));

            m.card.appendChild(ops);

        }

    }



    function openSleep() {

        var m = modal('睡眠倒计时');

        var currentSleep = v3.state.sleep && v3.state.sleep.active ? v3.state.sleep : null;

        var minutes = field('自定义时长（分钟，可直接输入）', currentSleep ? currentSleep.durationMinutes : '', 'number');

        minutes.input.min = '0.05';

        minutes.input.step = '0.05';

        minutes.input.inputMode = 'decimal';

        minutes.input.placeholder = '例如 12、37.5 或 120';

        var limit = field('最多自动请求次数', 5, 'number');

        m.card.appendChild(V('vnr3-segment', ''));

        var presets = m.card.lastChild;

        [15, 30, 45, 60, 90].forEach(function(n) {

            presets.appendChild(button(n + ' 分钟', function() { minutes.input.value = n; }));

        });

        m.card.appendChild(minutes);

        m.card.appendChild(V('vnr3-hint', '倒计时结束后会让当前歌曲自然播完，再统一停止音乐、台本语音和所有背景音。'));

        m.card.appendChild(limit);

        var loop = V('vnr3-toggle-row'); loop.appendChild(V('', '次数耗尽后循环已有内容'));

        var sw = E('button', 'vnr2-sw'); sw.appendChild(E('i', '')); sw.onclick = function() { sw.classList.toggle('on'); }; loop.appendChild(sw);

        m.card.appendChild(loop);

        if (v3.state.sleep && v3.state.sleep.active) {

            m.card.appendChild(button('取消当前倒计时', function() { v3.cancelSleep(); m.remove(); renderBottomBar(); }, 'danger'));

        }

        var ops = V('vnr3-ops');

        ops.appendChild(button('关闭', function() { m.remove(); }));

        ops.appendChild(button('开始', function() {

            var value = parseFloat(minutes.input.value);

            if (!isFinite(value) || value <= 0) { _toast('请输入大于 0 的倒计时时长'); minutes.input.focus(); return; }

            v3.startSleep(value, limit.input.value, sw.classList.contains('on'), 'current');

            m.remove(); renderBottomBar();

        }, 'primary'));

        m.card.appendChild(ops);

    }



    function openBackgrounds() {

        var m = modal('高级背景音');

        var songs = v3.advancedSongs();

        var master = field('背景音总音量 0-100', v3.state.backgroundMasterVolume === undefined ? 100 : v3.state.backgroundMasterVolume, 'number');

        master.input.onchange = function() {

            v3.state.backgroundMasterVolume = Number(master.input.value) || 0;

            v3.save();

            v3.refreshBackgroundVolumes();

        };

        m.card.appendChild(master);

        if (!songs.length) m.card.appendChild(V('vnr2-empty', '暂无开启高级播放参数的音频。请在歌单中编辑歌曲并展开高级参数。'));

        var list = V('vnr3-preview-list');

        songs.forEach(function(song) {

            var key = v3.backgroundKey ? v3.backgroundKey(song) : (song.id || song.title);

            var adv = song.advanced || {};

            var row = V('vnr3-bg-row' + (adv.error ? ' error' : ''));

            var ck = E('button', 'vnr3-check' + (v3.state.backgroundChecked[key] ? ' on' : ''));

            ck.type = 'button';

            ck.onclick = function() {

                v3.state.backgroundChecked[key] = !v3.state.backgroundChecked[key];

                ck.classList.toggle('on', !!v3.state.backgroundChecked[key]);

                v3.save();

            };

            row.appendChild(ck);

            var info = V('');

            info.appendChild(V('vnr3-track-title', song.title));

            info.appendChild(V('vnr3-track-sub', adv.error ? adv.error : (song.artist || '独立音频')));

            row.appendChild(info);

            row.setAttribute('data-vnr3-background-key', key);

            var play = button('播放', function() {

                v3.playBackground(song);

                syncBackgroundRow();

            });

            row.appendChild(play);

            var pause = button('暂停', function() {

                v3.pauseBackground(key, false);

                if (v3.masterPauseSnapshot) delete v3.masterPauseSnapshot.backgrounds[key];

                syncBackgroundRow();

            });

            row.appendChild(pause);

            function syncBackgroundRow() {

                var isPlaying = v3.backgroundIsPlaying(key);

                play.classList.toggle('primary', !isPlaying);

                pause.classList.toggle('primary', isPlaying);

                play.disabled = isPlaying;

                pause.disabled = !isPlaying;

                ck.classList.toggle('on', !!v3.state.backgroundChecked[key]);

            }

            row.__vnr3SyncBackground = syncBackgroundRow;

            syncBackgroundRow();

            var settings = V('vnr3-bg-settings');

            var legacyVolumeMode = adv.volumeMode || 'custom';

            var vm = selectField('背景音量', legacyVolumeMode, [

                { value: 'global', label: '跟随总音量' },

                { value: 'custom', label: '自定义音量' }

            ]);

            var vv = field('自定义音量 0-100', adv.volume !== undefined ? adv.volume : 55, 'number');

            var legacyDuckMode = adv.duckMode || (adv.duck === true ? 'custom' : (adv.duck === false ? 'none' : 'follow'));

            var dm = selectField('主持人说话时', legacyDuckMode, [

                { value: 'follow', label: '跟随普通音乐' },

                { value: 'none', label: '保持音量' },

                { value: 'custom', label: '自定义压低音量' }

            ]);

            var dv = field('说话时音量 0-100', adv.duckVolume !== undefined ? adv.duckVolume : 20, 'number');

            var loop = V('vnr3-toggle-row');

            loop.appendChild(V('', '单曲循环'));

            var loopSw = E('button', 'vnr2-sw' + (adv.loop !== false ? ' on' : ''));

            loopSw.appendChild(E('i', ''));

            loop.appendChild(loopSw);

            settings.appendChild(vm); settings.appendChild(vv); settings.appendChild(dm); settings.appendChild(dv); settings.appendChild(loop);

            row.appendChild(settings);

            function saveAdvanced() {

                adv.volumeMode = vm.input.value;

                adv.volume = Number(vv.input.value) || 55;

                adv.duckMode = dm.input.value;

                adv.duckVolume = Number(dv.input.value) || 20;

                adv.loop = loopSw.classList.contains('on');

                song.advanced = adv;

                vv.style.display = adv.volumeMode === 'custom' ? 'grid' : 'none';

                dv.style.display = adv.duckMode === 'custom' ? 'grid' : 'none';

                if (v3.audio[key] && v3.audio[key].audio) v3.audio[key].audio.loop = adv.loop;

                v3.save();

                v3.refreshBackgroundVolumes();

            }

            vm.input.onchange = saveAdvanced;

            vv.input.onchange = saveAdvanced;

            dm.input.onchange = saveAdvanced;

            dv.input.onchange = saveAdvanced;

            loopSw.onclick = function() { loopSw.classList.toggle('on'); saveAdvanced(); };

            saveAdvanced();

            list.appendChild(row);

        });

        m.card.appendChild(list);

        var ops = V('vnr3-ops');

        ops.appendChild(button('停止全部', function() { v3.stopAllBackgrounds(); m.remove(); }));

        ops.appendChild(button('开始播放勾选项', function() { v3.playSelectedBackgrounds(); m.remove(); }, 'primary'));

        m.card.appendChild(ops);

    }



    function openScriptLibraryForSong(item) {

        u.v3ScriptLibraryTab = 'songs';

        u.v3ScriptLibraryFocusId = (item && item.id) || '';

        savePos();

        openScriptLibrary();

    }



    function openScriptLibrary() {

        var old = stage.querySelector('.vnr3-script-layer');

        if (old) old.remove();

        var layer = V('vnr3-script-layer');

        var panel = V('vnr3-script-window');

        var head = V('vnr3-script-window-head');

        var title = V('');

        title.appendChild(V('vnr3-script-window-title', '台本库'));

        title.appendChild(V('vnr3-script-window-sub', '跨歌单管理长台本与当前播放列表的歌曲台本'));

        head.appendChild(title);

        var close = E('button', 'vnr3-script-close', '×');

        close.type = 'button';

        close.title = '关闭台本库';

        close.onclick = function() { layer.remove(); };

        head.appendChild(close);

        panel.appendChild(head);

        var body = V('vnr3-script-body');

        panel.appendChild(body);

        layer.appendChild(panel);

        stage.appendChild(layer);

        function paint() {

            var y = body.scrollTop || 0;

            body.innerHTML = '';

            body.__vnr3Refresh = paint;

            var toolbar = V('vnr3-library-toolbar');

            var tabs = V('vnr3-segment');

            var tab = u.v3ScriptLibraryTab === 'songs' ? 'songs' : 'continuous';

            tabs.appendChild(button('长篇陪伴台本', function() { u.v3ScriptLibraryTab = 'continuous'; savePos(); paint(); }, tab === 'continuous' ? 'on' : ''));

            tabs.appendChild(button('当前歌曲台本', function() { u.v3ScriptLibraryTab = 'songs'; savePos(); paint(); }, tab === 'songs' ? 'on' : ''));

            toolbar.appendChild(tabs);

            var scriptIo = V('vnr3-inline-ops');

            scriptIo.appendChild(button('导出台本', function() {

                var summary = v3.exportScripts();

                _toast('已导出 ' + summary.continuous + ' 份长台本、' + summary.songs + ' 首歌曲台本');

            }));

            var importInput = E('input', '');

            importInput.type = 'file';

            importInput.accept = 'application/json,.json';

            importInput.style.display = 'none';

            importInput.onchange = function() {

                var file = importInput.files && importInput.files[0];

                if (!file) return;

                var reader = new TOP.FileReader();

                reader.onload = function() {

                    try {

                        var result = v3.importScripts(String(reader.result || ''));

                        _toast('导入完成：新增 ' + result.continuousAdded + ' 份长台本，更新 ' +

                            result.continuousUpdated + ' 份；歌曲台本匹配 ' + result.songMatched + ' 首');

                        paint();

                    } catch (e) {

                        _toast('台本导入失败：' + ((e && e.message) || String(e)));

                    }

                    importInput.value = '';

                };

                reader.readAsText(file);

            };

            scriptIo.appendChild(button('导入台本', function() { importInput.click(); }));

            scriptIo.appendChild(importInput);

            if (tab === 'continuous') {

                var playlists = v3.playlists();

                var selectedId = u.v3ScriptLibraryPlaylistId || v3.state.activePlaylistId || 'now-playing';

                var selectedPlaylist = v3.playlist(selectedId) || v3.currentPlaylist() || playlists[0];

                u.v3ScriptLibraryPlaylistId = selectedPlaylist && selectedPlaylist.id || 'now-playing';

                var picker = selectField('查看歌单', u.v3ScriptLibraryPlaylistId, playlists.map(function(item) {

                    var count = (v3.state.continuousVersions || []).filter(function(version) {

                        return (version.playlistId || 'now-playing') === item.id;

                    }).length;

                    return { value: item.id, label: (item.name || '未命名歌单') + ' · ' + count + ' 份' };

                }));

                picker.input.onchange = function() {

                    u.v3ScriptLibraryPlaylistId = picker.input.value;

                    savePos();

                    paint();

                };

                toolbar.appendChild(picker);

                toolbar.appendChild(scriptIo);

                body.appendChild(toolbar);

                var continuousBox = V('');

                continuousBox.__vnr3Refresh = paint;

                body.appendChild(continuousBox);

                renderContinuous(continuousBox, selectedPlaylist);

            } else {

                toolbar.appendChild(V('vnr3-hint', '整组操作：重新生成/语言检测针对当前播放列表全部歌曲。'));

                var groupOps = V('vnr3-inline-ops');

                groupOps.appendChild(button('重新生成台本', function() {

                    v3.requestLinkedScripts(true);

                    var t = 0;

                    var iv = TOP.setInterval(function() {

                        t += 500;

                        if (t >= 15000 || !eng.scriptBusy) { TOP.clearInterval(iv); paint(); }

                    }, 500);

                }, 'primary'));

                groupOps.appendChild(button('语言检测修复', function() {

                    var allItems = (eng.current ? [eng.current] : []).concat(eng.queue || []);

                    _manualLangFixAllSongs(allItems, _selectedHosts(eng.store || {}), function() { paint(); });

                }));

                toolbar.appendChild(groupOps);

                toolbar.appendChild(scriptIo);

                body.appendChild(toolbar);

                renderQueueScripts(body, paint);

            }

            body.scrollTop = y;

            if (u.v3ScriptLibraryFocusId) {

                var fc = body.querySelector('[data-item-id="' + String(u.v3ScriptLibraryFocusId).replace(/"/g, '\\"') + '"]');

                if (fc) { fc.scrollIntoView({ block: 'center' }); fc.classList.add('vnr3-focus'); }

                u.v3ScriptLibraryFocusId = '';

            }

        }

        paint();

    }



    function openContinuousPanel(pl) {

        u.v3ScriptLibraryTab = 'continuous';

        u.v3ScriptLibraryPlaylistId = pl && pl.id || v3.state.activePlaylistId || 'now-playing';

        savePos();

        openScriptLibrary();

    }



    function renderQueueScripts(box, refresh) {

        var items = (eng.current ? [eng.current] : []).concat(eng.queue || []);

        if (!items.length) {

            box.appendChild(V('vnr2-empty', '当前播放列表为空。'));

            return;

        }

        items.forEach(function(item, itemIndex) {

            if (!item || !item.song) return;

            var versions = v3.scriptVersionsForItem(item);

            var selected = versions[0] || null;

            var card = V('vnr3-speech-node vnr3-queue-script');

            card.dataset.itemId = item.id;

            var head = V('vnr3-queue-script-head');

            var name = V('');

            name.appendChild(V('vnr3-title', (itemIndex === 0 && eng.current === item ? '正在播放 · ' : '') + (item.song.title || item.song.query || '未命名歌曲')));

            name.appendChild(V('vnr3-sub', (item.song.artist || '') + ' · ' + versions.length + ' 个已存版本'));

            head.appendChild(name);

            head.appendChild(V('vnr3-cache-badge', item.say ? '播放时会朗读' : '暂无台本'));

            card.appendChild(head);

            /* 一首歌一份当前台本：不做多版本切换下拉，selected 即当前台本（最新已存版本或临时版本） */

            var hosts = _selectedHosts(eng.store || {});

            var versionLabel = E('input', 'vnr3-input');

            versionLabel.value = (selected && selected.label) || '';

            versionLabel.placeholder = '版本名称（保存时生效）';

            card.appendChild(versionLabel);

            var nodes = _songVersionNodes(selected || item);

            var nodeList = V('vnr3-node-list');

            card.appendChild(nodeList);

            function paintNodes() {

                nodeList.innerHTML = '';

                nodes.forEach(function(node, nodeIndex) {

                    var nodeCard = V('vnr3-speech-node');

                    var sel = E('select', 'vnr3-input');

                    hosts.forEach(function(ch) {

                        var op = E('option', '', ch.name || '主持人'); op.value = ch.name || '';

                        if (op.value === node.host) op.selected = true;

                        sel.appendChild(op);

                    });

                    if (!node.host && hosts.length) { node.host = hosts[0].name || ''; }

                    sel.value = node.host || '';

                    sel.onchange = function() { node.host = sel.value; };

                    nodeCard.appendChild(sel);

                    var tts = E('textarea', 'vnr3-node-text'); tts.value = node.ttsText || ''; tts.placeholder = '发送给 TTS 的文本（朗读语言）';

                    var disp = E('textarea', 'vnr3-node-text'); disp.value = node.displayText || ''; disp.placeholder = '显示文本 / 翻译（字幕）';

                    tts.onchange = function() { node.ttsText = tts.value; };

                    disp.onchange = function() { node.displayText = disp.value; };

                    nodeCard.appendChild(tts);

                    nodeCard.appendChild(disp);

                    var nodeOps = V('vnr3-node-ops');

                    nodeOps.appendChild(button('删除一段', function() { nodes.splice(nodeIndex, 1); paintNodes(); }));

                    nodeCard.appendChild(nodeOps);

                    nodeList.appendChild(nodeCard);

                });

            }

            paintNodes();

            var addOps = V('vnr3-node-ops');

            addOps.appendChild(button('添加一段', function() {

                nodes.push({ type: 'speech', host: ((hosts[0] && hosts[0].name) || (nodes[0] && nodes[0].host) || item.host || ''), ttsText: '', displayText: '' });

                paintNodes();

            }));

            card.appendChild(addOps);

            function rebuildSay() {

                var clean = nodes.filter(function(n) { return (n.ttsText || '').trim() || (n.displayText || '').trim(); });

                if (!clean.length) return '';

                clean.forEach(function(n) { if (!(n.host || '').trim()) n.host = ((hosts[0] && hosts[0].name) || item.host || ''); });

                return _nodesToSongSay(clean, hosts);

            }

            var ops = V('vnr3-node-ops');

            ops.appendChild(button('保存编辑', function() {

                var currentId = (selected && selected.id && String(selected.id).indexOf('current-') !== 0) ? selected.id : '';

                var favorite = !!(selected && selected.favorite);

                var rebuilt = rebuildSay();

                if (!rebuilt) { _toast('请先填写台本内容'); return; }

                v3.saveSongScript(item, {

                    id: currentId,

                    host: (nodes[0] && nodes[0].host) || item.host || '',

                    say: rebuilt,

                    favorite: favorite,

                    label: versionLabel.value.trim() || (selected && selected.label) || '手动编辑'

                });

                _toast('歌曲台本已保存');

                refresh();

            }, 'primary'));

            ops.appendChild(button(selected && selected.favorite ? '取消收藏（解锁）' : '收藏（锁定保护）', function() {

                var sid = (selected && selected.id && String(selected.id).indexOf('current-') !== 0) ? selected.id : '';

                if (!sid) {

                    var rebuilt = rebuildSay();

                    if (!rebuilt) { _toast('请先填写台本内容'); return; }

                    var created = v3.saveSongScript(item, {

                        host: (nodes[0] && nodes[0].host) || item.host || '',

                        say: rebuilt,

                        favorite: true,

                        label: versionLabel.value.trim() || '收藏台本'

                    });

                    if (!created) _toast('请先填写台本内容');

                } else {

                    v3.toggleSongScriptFavorite(item, sid);

                }

                refresh();

            }));

            ops.appendChild(button('立即朗读', function() {

                if (item.say) { _speakItem(item, true); _toast('正在朗读当前台本'); }

                else _toast('该曲目暂无台本');

            }));

            ops.appendChild(button('台本原文', function() {

                var rawModal = modal('台本原文（VoiceTag 原始格式）');

                var raw = field('内容', (selected && selected.say) || item.say || '', 'textarea');

                raw.input.style.minHeight = '240px';

                raw.input.readOnly = true;

                rawModal.card.appendChild(raw);

                var rawOps = V('vnr3-ops');

                rawOps.appendChild(button('关闭', function() { rawModal.remove(); }));

                rawModal.card.appendChild(rawOps);

            }));

            card.appendChild(ops);

            box.appendChild(card);

        });

    }



    function renderContinuous(box, pl) {

        function refreshContinuous() {

            if (box && typeof box.__vnr3Refresh === 'function') box.__vnr3Refresh();

            else renderMain();

        }

        pl = pl || v3.currentPlaylist() || v3.playlist('now-playing');

        var head = V('vnr3-cont-head');

        var version = v3.activeContinuous(pl.id);

        var title = V('');

        title.appendChild(V('vnr3-title', pl.name + ' · 完整台本'));

        var runtime = v3.continuousRuntime;

        var playingThis = !!(version && runtime && runtime.versionId === version.id && !runtime.stopped);

        title.appendChild(V('vnr3-sub', version ? ((playingThis ? '正在播放 · ' : '') + version.title) : '这个歌单还没有完整台本'));

        if (version) {

            var rename = E('input', 'vnr3-input');

            rename.value = version.title || '';

            rename.placeholder = '台本名称';

            rename.onchange = function() {

                version.title = rename.value.trim() || '未命名台本';

                version.edited = true;

                v3.save();

                refreshContinuous();

            };

            title.appendChild(rename);

        }

        head.appendChild(title);

        var ops = V('vnr3-inline-ops');

        ops.appendChild(button('请求完整台本', function() {

            v3.state.activePlaylistId = pl.id;

            v3.setMode('companion');

            v3.requestCompanion(true);

        }, 'primary'));

        ops.appendChild(button('新建空白台本', function() {

            var fresh = { id: 'continuous-' + Date.now(), playlistId: pl.id, title: '自定义完整台本', createdAt: Date.now(), favorite: false, edited: true, nodes: [] };

            v3.state.continuousVersions.unshift(fresh);

            v3.state.activeContinuousIds[pl.id] = fresh.id;

            v3.state.activeContinuousId = fresh.id;

            v3.save();

            refreshContinuous();

        }));

        if (version) {

            ops.appendChild(button('语言检测修复', function() { _manualLangFix(version, _selectedHosts(eng.store || {})); }));

            ops.appendChild(button(playingThis ? '重新播放' : '整体播放', function() { v3.playContinuous(version.id); }));

            ops.appendChild(button(version.favorite ? '★ 已收藏' : '☆ 收藏台本', function() {

                var on = v3.toggleContinuousFavorite(version.id);

                _toast(on ? '台本已收藏，将永久保留' : '已取消收藏，之后会按普通历史版本清理');

                refreshContinuous();

            }, version.favorite ? 'primary' : ''));

            if (playingThis) {

                ops.appendChild(button(runtime.paused ? '继续播放台本' : '暂停台本', function() {

                    if (runtime.paused) v3.resumeContinuous();

                    else v3.pauseContinuous();

                    refreshContinuous();

                }, 'primary'));

            }

            ops.appendChild(button('停止', function() { v3.stopContinuous(); }));

            ops.appendChild(button('原始数据', function() {

                var rawModal = modal('台本原始数据');

                var raw = field('JSON', JSON.stringify(version.nodes || [], null, 2), 'textarea');

                raw.input.style.minHeight = '360px';

                rawModal.card.appendChild(raw);

                var rawOps = V('vnr3-ops');

                rawOps.appendChild(button('取消', function() { rawModal.remove(); }));

                rawOps.appendChild(button('应用', function() {

                    try {

                        var parsed = JSON.parse(raw.input.value);

                        if (Object.prototype.toString.call(parsed) !== '[object Array]') throw new Error('根节点必须是数组');

                        version.nodes = parsed;

                        version.edited = true;

                        v3.save();

                        rawModal.remove();

                        refreshContinuous();

                    } catch (e) { _toast('JSON 无效：' + e.message); }

                }, 'primary'));

                rawModal.card.appendChild(rawOps);

            }));

            if (!version.favorite) {

                ops.appendChild(button('删除版本', function() {

                    if (TOP.confirm && !TOP.confirm('删除这个未收藏的长台本版本？')) return;

                    v3.deleteContinuousVersion(version.id);

                    refreshContinuous();

                }, 'danger'));

            }

        }

        head.appendChild(ops); box.appendChild(head);

        if (version) {

            var cacheBar = V('vnr3-library-cache');

            var cacheLabel = version.audioCacheComplete ?

                ('已在浏览器本地缓存 ' + _num(version.audioCacheCount, 0) + ' 段语音') :

                '尚未完整缓存语音';

            cacheBar.appendChild(V('vnr3-cache-badge', cacheLabel));

            cacheBar.appendChild(button(version.audioCacheComplete ? '重新检查并补全缓存' : '缓存完整语音', function() {

                var p = modal('缓存完整语音');

                var status = V('vnr3-hint', '准备分段请求并写入本地缓存…');

                p.card.appendChild(status);

                p.card.appendChild(V('vnr3-hint', '台本会按连续主持人话轮合并缓存，不再按句切割；主持人切换时会随机停顿 1–2.5 秒，原台本中的 pause 秒数仍会照常执行。'));

                v3.cacheContinuous(version.id, function(i, n) {

                    status.textContent = '正在缓存 ' + i + ' / ' + n;

                }, function(err, result) {

                    status.textContent = err ? ('失败：' + err) :

                        ('缓存完成，共 ' + result.count + ' 段，已保存在浏览器本地');

                    refreshContinuous();

                });

            }, 'primary'));

            cacheBar.appendChild(button('导出完整语音（单个 MP3）', function() {

                var p = modal('导出完整语音');

                var status = V('vnr3-hint', '正在读取缓存；缺失的语音会自动补齐，最后只下载一个完整 MP3 文件…');

                p.card.appendChild(status);

                v3.exportContinuous(version.id, function(i, n) {

                    status.textContent = '正在合并语音 ' + i + ' / ' + n;

                }, function(err, result) {

                    status.textContent = err ? ('导出失败：' + err) :

                        ('导出完成：' + result.count + ' 段已合并为一个 MP3 文件');

                    refreshContinuous();

                });

            }));

            if (version.audioCacheKeys && version.audioCacheKeys.length) {

                cacheBar.appendChild(button('清除应用内缓存', function() {

                    v3.clearContinuousCache(version.id, function(err) {

                        _toast(err || '本地语音缓存已清除');

                        refreshContinuous();

                    });

                }));

            }

            cacheBar.appendChild(button(v3.state.cacheDirectoryName ? ('缓存目录：' + v3.state.cacheDirectoryName) : '选择缓存目录（语音落本地文件夹）', function() {

                v3.chooseCacheDirectory(function(err, name) {

                    _toast(err || ('语音已设置缓存目录：' + name));

                    refreshContinuous();

                });

            }));

            cacheBar.appendChild(button('清理旧版残留数据', function() {

                var removed = [];

                ['vnm-statusbar-v2', 'vnm-weather', 'vnm-settings-v6-pc', 'vnm-spatial'].forEach(function(k) {

                    try { if (TOP.localStorage.getItem(k) != null) { TOP.localStorage.removeItem(k); removed.push(k); } } catch (e) {}

                });

                _toast(removed.length ? ('已清理旧键 ' + removed.length + ' 个：' + removed.join('、')) : '没有可清理的旧版数据');

            }));

            box.appendChild(cacheBar);

        }

        var versions = (v3.state.continuousVersions || []).filter(function(item) {

            return (item.playlistId || 'now-playing') === pl.id;

        });

        var globalQueue = v3.state.localScriptQueue || (v3.state.localScriptQueue = []);

        {

            var queue = globalQueue;



            var dashboard = V('vnr3-library-dashboard');

            var libraryPane = V('vnr3-library-pane');

            var libraryHead = V('vnr3-library-pane-head');

            var libraryTitle = V('');

            libraryTitle.appendChild(V('vnr3-library-pane-title', '已存台本'));

            libraryTitle.appendChild(V('vnr3-hint', versions.length + ' 份 · 点击卡片查看和编辑'));

            libraryHead.appendChild(libraryTitle);

            if (versions.length) libraryHead.appendChild(button('全部播放', function() {

                v3.playContinuousSequence(versions.map(function(item) { return item.id; }));

                refreshContinuous();

            }));

            libraryPane.appendChild(libraryHead);

            var versionGrid = V('vnr3-version-grid');

            if (!versions.length) versionGrid.appendChild(V('vnr3-hint', '这个歌单还没有已存台本。右侧仍会保留其他歌单加入的播放列表。'));

            versions.forEach(function(item, index) {

                var card = V('vnr3-version-card' + (version && version.id === item.id ? ' on' : ''));

                var copy = V('');

                copy.appendChild(V('vnr3-version-name', item.title || ('台本 ' + (index + 1))));

                copy.appendChild(V('vnr3-version-meta',

                    (item.favorite ? '已收藏 · ' : '') +

                    (item.audioCacheComplete ? '语音已缓存' : '需要时请求 TTS')));

                card.appendChild(copy);

                var favorite = E('button', 'vnr3-mini-action' + (item.favorite ? ' on' : ''), item.favorite ? '★' : '☆');

                favorite.type = 'button';

                favorite.title = item.favorite ? '取消收藏；之后可按普通历史版本清理' : '收藏并永久保留';

                favorite.onclick = function(ev) {

                    ev.stopPropagation();

                    var on = v3.toggleContinuousFavorite(item.id);

                    _toast(on ? '台本已收藏，将永久保留' : '已取消收藏');

                    refreshContinuous();

                };

                card.appendChild(favorite);

                var add = E('button', 'vnr3-mini-action' + (queue.indexOf(item.id) >= 0 ? ' on' : ''), queue.indexOf(item.id) >= 0 ? '✓' : '+');

                add.type = 'button';

                add.title = queue.indexOf(item.id) >= 0 ? '已加入播放列表' : '加入播放列表';

                add.onclick = function(ev) {

                    ev.stopPropagation();

                    var q = v3.state.localScriptQueue || (v3.state.localScriptQueue = []);

                    if (q.indexOf(item.id) < 0) {

                        q.push(item.id);

                        v3.save();

                        refreshContinuous();

                        _toast('已加入播放列表：' + (item.title || ('台本 ' + (index + 1))));

                    } else {

                        _toast('这份台本已在播放列表中');

                    }

                };

                card.appendChild(add);

                card.onclick = function() {

                    v3.state.activeContinuousIds[pl.id] = item.id;

                    v3.state.activeContinuousId = item.id;

                    v3.save();

                    refreshContinuous();

                };

                versionGrid.appendChild(card);

            });

            libraryPane.appendChild(versionGrid);

            dashboard.appendChild(libraryPane);



            var queuePane = V('vnr3-library-pane');

            var queueHead = V('vnr3-library-pane-head');

            var queueTitle = V('');

            queueTitle.appendChild(V('vnr3-library-pane-title', '本地播放列表'));

            queueTitle.appendChild(V('vnr3-hint', '跨歌单保留 · 手动清空前不会丢失'));

            queueHead.appendChild(queueTitle);

            if (queue.length) queueHead.appendChild(button('清空', function() {

                v3.state.localScriptQueue = [];

                v3.save();

                refreshContinuous();

            }));

            queuePane.appendChild(queueHead);

            var localModeRow = V('vnr3-toggle-row');

            var localModeCopy = V('');

            localModeCopy.appendChild(V('vnr3-library-pane-title', '本地台本播放模式'));

            localModeCopy.appendChild(V('vnr3-hint', '开启后禁止请求新的陪伴台本，包括自动请求'));

            localModeRow.appendChild(localModeCopy);

            var localModeSwitch = E('button', 'vnr2-sw' + (v3.state.localScriptMode ? ' on' : ''));

            localModeSwitch.appendChild(E('i', ''));

            localModeSwitch.onclick = function() {

                v3.setLocalScriptMode(!localModeSwitch.classList.contains('on'));

                refreshContinuous();

            };

            localModeRow.appendChild(localModeSwitch);

            queuePane.appendChild(localModeRow);

            var modeSegment = V('vnr3-segment');

            [

                { id: 'once', label: '播放一次' },

                { id: 'repeat', label: '循环播放' },

                { id: 'shuffle', label: '随机循环' }

            ].forEach(function(modeItem) {

                modeSegment.appendChild(button(modeItem.label, function() {

                    v3.state.localScriptPlayMode = modeItem.id;

                    v3.save();

                    refreshContinuous();

                }, v3.state.localScriptPlayMode === modeItem.id ? 'on' : ''));

            });

            queuePane.appendChild(modeSegment);

            var queueList = V('vnr3-queue-list');

            if (!queue.length) {

                queueList.appendChild(V('vnr3-hint', '从左侧已存台本点“＋”加入。'));

            }

            queue.forEach(function(id, queueIndex) {

                var item = v3.continuousById(id);

                if (!item) return;

                var row = V('vnr3-queue-row');

                row.appendChild(V('vnr3-queue-index', String(queueIndex + 1)));

                var queueCopy = V('');

                queueCopy.appendChild(V('vnr3-version-name', item.title || '未命名台本'));

                var originPlaylist = v3.playlist(item.playlistId || 'now-playing');

                queueCopy.appendChild(V('vnr3-version-meta', originPlaylist && originPlaylist.name || '未知歌单'));

                row.appendChild(queueCopy);

                var rowOps = V('vnr3-segment');

                if (queueIndex > 0) {

                    var up = E('button', 'vnr3-mini-action', '↑');

                    up.onclick = function() {

                        var q = v3.state.localScriptQueue || (v3.state.localScriptQueue = []);

                        var x = q[queueIndex - 1]; q[queueIndex - 1] = q[queueIndex]; q[queueIndex] = x;

                        v3.save(); refreshContinuous();

                    };

                    rowOps.appendChild(up);

                }

                var remove = E('button', 'vnr3-mini-action', '×');

                remove.title = '从播放列表移除';

                remove.onclick = function() {

                    var q = v3.state.localScriptQueue || (v3.state.localScriptQueue = []);

                    q.splice(queueIndex, 1);

                    v3.save();

                    refreshContinuous();

                };

                rowOps.appendChild(remove);

                row.appendChild(rowOps);

                queueList.appendChild(row);

            });

            queuePane.appendChild(queueList);

            var queueOps = V('vnr3-inline-ops');

            queueOps.appendChild(button('播放这个列表', function() {

                if (!queue.length) { _toast('请先从左侧加入台本'); return; }

                v3.playLocalScriptQueue();

                refreshContinuous();

            }, 'primary'));

            queuePane.appendChild(queueOps);

            dashboard.appendChild(queuePane);

            box.appendChild(dashboard);

        }

        if (!version) {

            box.appendChild(V('vnr2-empty', '这个歌单还没有完整台本。可以请求 AI 生成，也可以新建空白台本后自己编辑。'));

            return;

        }

        var editorSurface = V('vnr3-editor-surface');

        box.appendChild(editorSurface);

        var nodes = version.nodes || [];

        var audioDetails = E('details', 'vnr3-speech-node');

        var audioSummary = E('summary', 'vnr3-title', '音频匹配设置 · ' + ((version.audioAssets || []).length) + ' 个音频');

        audioDetails.appendChild(audioSummary);

        audioDetails.appendChild(V('vnr3-hint', '支持一次上传多个文件或粘贴多个音频 URL。文件名中的段落序号会自动匹配；改台本名称不会破坏已有匹配。一个音频可勾选多个段落，每段也可关联多个音频。'));

        var fileInput = E('input', 'vnr3-input');

        fileInput.type = 'file';

        fileInput.accept = 'audio/*';

        fileInput.multiple = true;

        fileInput.onchange = function() {

            v3.addAudioFiles(version.id, fileInput.files, function(err, added) {

                _toast(err || ('已添加 ' + added.length + ' 个音频'));

                refreshContinuous();

            });

        };

        audioDetails.appendChild(fileInput);

        var urlInput = E('textarea', 'vnr3-node-text');

        urlInput.placeholder = '每行一个音频 URL';

        audioDetails.appendChild(urlInput);

        audioDetails.appendChild(button('添加音频 URL', function() {

            v3.addAudioUrls(version.id, urlInput.value.split(/\n+/), function(err, added) {

                _toast(err || ('已添加 ' + added.length + ' 个 URL 音频'));

                refreshContinuous();

            });

        }));

        var speechOnly = nodes.filter(function(node) { return node.type !== 'pause'; });

        (version.audioAssets || []).forEach(function(asset) {

            var assetCard = V('vnr3-speech-node');

            assetCard.appendChild(V('vnr3-sub', (asset.kind === 'url' ? 'URL · ' : '本地文件 · ') + asset.name));

            speechOnly.forEach(function(node, nodeIndex) {

                var row = V('vnr3-node-ops');

                var check = E('input', ''); check.type = 'checkbox';

                check.checked = !!(version.segmentAudioMap[node.id] || []).some(function(id) { return id === asset.id; });

                check.onchange = function() {

                    var ids = speechOnly.filter(function(candidate) {

                        return candidate === node ? check.checked : !!(version.segmentAudioMap[candidate.id] || []).some(function(id) { return id === asset.id; });

                    }).map(function(candidate) { return candidate.id; });

                    v3.setAudioAssetSegments(version.id, asset.id, ids);

                };

                row.appendChild(check);

                row.appendChild(V('', '第 ' + (nodeIndex + 1) + ' 段 · ' + String(node.displayText || node.ttsText || '').slice(0, 48)));

                assetCard.appendChild(row);

            });

            assetCard.appendChild(button('删除这个音频', function() {

                v3.deleteAudioAsset(version.id, asset.id, function() { refreshContinuous(); });

            }, 'danger'));

            audioDetails.appendChild(assetCard);

        });

        editorSurface.appendChild(audioDetails);

        var list = V('vnr3-node-list');

        nodes.forEach(function(node, index) {

            if (node.type === 'pause') {

                var pause = V('vnr3-pause-node');

                pause.appendChild(V('', '停顿'));

                var sec = E('input', 'vnr3-pause-input'); sec.type = 'number'; sec.value = node.seconds || 0;

                sec.onchange = function() { node.seconds = Number(sec.value) || 0; version.edited = true; };

                pause.appendChild(sec); pause.appendChild(V('', '秒'));

                pause.appendChild(button('删除', function() { nodes.splice(index, 1); version.edited = true; refreshContinuous(); }, 'icon'));

                list.appendChild(pause);

                return;

            }

            var card = V('vnr3-speech-node');

            var hosts = _selectedHosts(eng.store || {});

            var sel = E('select', 'vnr3-input');

            hosts.forEach(function(ch) {

                var op = E('option', '', ch.name || '主持人'); op.value = ch.name || '';

                if (op.value === node.host) op.selected = true; sel.appendChild(op);

            });

            sel.onchange = function() { node.host = sel.value; version.edited = true; };

            card.appendChild(sel);

            var tts = E('textarea', 'vnr3-node-text'); tts.value = node.ttsText || ''; tts.placeholder = '发送给 TTS 的文本';

            var display = E('textarea', 'vnr3-node-text'); display.value = node.displayText || ''; display.placeholder = '显示文本 / 翻译';

            tts.onchange = function() { node.ttsText = tts.value; version.edited = true; };

            display.onchange = function() { node.displayText = display.value; version.edited = true; };

            card.appendChild(tts); card.appendChild(display);

            var no = V('vnr3-node-ops');

            no.appendChild(button('试听', function() {

                _tts(node.ttsText, _charByName(node.host, hosts), function(url) { var _pv = new TOP.Audio(url); _pv.volume = _clamp((cfg.voiceVolume === undefined ? 100 : cfg.voiceVolume) / 100, 0, 1); _pv.play(); }, function(e) { _toast(e); });

            }));

            no.appendChild(button('复制', function() { nodes.splice(index + 1, 0, JSON.parse(JSON.stringify(node))); nodes[index + 1].id = 'speech-' + Date.now(); refreshContinuous(); }));

            no.appendChild(button('在后面插入停顿', function() { nodes.splice(index + 1, 0, { id: 'pause-' + Date.now(), type: 'pause', seconds: 15 }); refreshContinuous(); }));

            no.appendChild(button('删除', function() { nodes.splice(index, 1); refreshContinuous(); }, 'danger'));

            card.appendChild(no); list.appendChild(card);

        });

        editorSurface.appendChild(list);

        var save = V('vnr3-sticky-save');

        save.appendChild(button('添加朗读段', function() {

            var hosts = _selectedHosts(eng.store || {});

            nodes.push({

                id: 'speech-' + Date.now(),

                type: 'speech',

                host: hosts[0] && hosts[0].name || '主持人',

                ttsText: '',

                displayText: ''

            });

            version.edited = true;

            refreshContinuous();

        }));

        save.appendChild(button('添加停顿', function() {

            nodes.push({ id: 'pause-' + Date.now(), type: 'pause', seconds: 15 });

            version.edited = true;

            refreshContinuous();

        }));

        save.appendChild(button('保存当前编辑', function() { version.edited = true; v3.save(); _toast('台本已保存'); }, 'primary'));

        save.appendChild(button('语言检测修复', function() {

            _manualLangFix(version, _selectedHosts(eng.store || {}));

        }, 'primary'));

        save.appendChild(button(version.favorite ? '★ 已收藏' : '☆ 收藏台本', function() {

            v3.toggleContinuousFavorite(version.id);

            refreshContinuous();

        }));

        editorSurface.appendChild(save);

    }



    function augmentArtistShortPersona(box) {

        var ch = null, chars = _chars();

        for (var i = 0; i < chars.length; i++) if (_charId(chars[i]) === u.artistId) ch = chars[i];

        if (!ch || box.querySelector('.vnr3-persona')) return;

        var panel = V('vnr3-persona');

        var head = V('vnr3-persona-head');

        head.appendChild(V('', '电台简短人设'));

        var count = V('vnr3-hint', '0 字'); head.appendChild(count); panel.appendChild(head);

        var ta = E('textarea', 'vnr3-node-text');

        var id = _charId(ch);

        ta.value = v3.state.shortPersonas[id] || '';

        function update() { count.textContent = ta.value.length + ' 字'; }

        ta.oninput = update; update(); panel.appendChild(ta);

        var ops = V('vnr3-ops');

        ops.appendChild(button('恢复完整人设', function() { ta.value = ch.persona || ''; update(); }));

        ops.appendChild(button('保存简短人设', function() { v3.state.shortPersonas[id] = ta.value.trim(); v3.save(); _toast('简短人设已保存'); }, 'primary'));

        panel.appendChild(ops);

        box.insertBefore(panel, box.children[1] || null);

    }



    var oldRenderSidebar = renderSidebar;

    renderSidebar = function() {

        oldRenderSidebar();

        var links = sidebar.querySelectorAll('.vnr2-nav-it');

        for (var i = 0; i < links.length; i++) {

            if ((links[i].textContent || '').indexOf('All Playlists') >= 0) {

                links[i].classList.toggle('on', u.view === 'playlists' ||

                    (u.view === 'playlist-detail' && u.v3PlaylistId !== 'my-favorites'));

                links[i].onclick = function() {

                    u.view = 'playlists';

                    u.sidesOpen = true;

                    u.plFav = false;

                    savePos();

                    drawShell();

                };

            }

            if ((links[i].textContent || '').indexOf('Favorites') >= 0 || (links[i].textContent || '').indexOf('我的收藏') >= 0) {

                var favoriteLink = links[i];

                var favoriteLabel = favoriteLink.querySelector('span');

                if (favoriteLabel) favoriteLabel.textContent = 'Favorites · ' + ((eng.store.favoriteSongs || []).length);

                favoriteLink.classList.toggle('on', u.view === 'playlist-detail' && u.v3PlaylistId === 'my-favorites');

                favoriteLink.onclick = function() {

                    u.sidesOpen = true;

                    u.plFav = false;

                    u.v3PlaylistId = 'my-favorites';

                    v3.state.activePlaylistId = 'my-favorites';

                    u.view = 'playlist-detail';

                    v3.save();

                    savePos();

                    drawShell();

                };

            }

        }

    };



    var oldRenderMain = renderMain;

    var vnr3ViewScroll = u.vnr3ViewScroll || (u.vnr3ViewScroll = {});

    var vnr3RenderedView = u.view;

    function rememberV3Scroll(view) {

        var scroller = main.querySelector('.vnr2-set,.vnr3-detail-scroll,.vnr3-grid');

        if (scroller) vnr3ViewScroll[view] = scroller.scrollTop || 0;

    }

    function restoreV3Scroll(view) {

        var scroller = main.querySelector('.vnr2-set,.vnr3-detail-scroll,.vnr3-grid');

        if (!scroller) return;

        scroller.scrollTop = vnr3ViewScroll[view] || 0;

        scroller.onscroll = function() { vnr3ViewScroll[view] = scroller.scrollTop || 0; };

        TOP.requestAnimationFrame(function() {

            if (scroller.isConnected) scroller.scrollTop = vnr3ViewScroll[view] || 0;

        });

    }

    renderMain = function() {

        rememberV3Scroll(vnr3RenderedView);

        if (u.view === 'continuous') u.view = 'playlists';

        if (u.view !== 'playlists' && u.view !== 'playlist-detail') {

            oldRenderMain();

            if (u.view === 'artist') augmentArtistShortPersona(main);

            if (u.view === 'made') {

                var madeScroller = main.querySelector('.vnr2-set');

                if (madeScroller) {

                    madeScroller.addEventListener('wheel', function(e) { e.stopPropagation(); }, { passive: true });

                    madeScroller.addEventListener('touchmove', function(e) { e.stopPropagation(); }, { passive: true });

                    madeScroller.addEventListener('pointerdown', function(e) { e.stopPropagation(); });

                }

            }

            restoreV3Scroll(u.view);

            vnr3RenderedView = u.view;

            return;

        }

        main.innerHTML = '';

        var head = V('vnr2-main-head');

        var tt = V('');

        tt.appendChild(V('vnr2-h1', u.view === 'playlist-detail' ? 'Playlist' : 'All Playlists'));

        tt.appendChild(V('vnr2-h1s', eng.apiStatus && eng.apiStatus.state === 'loading' ? '正在请求' + (eng.apiStatus.label || '') : statusText()));

        head.appendChild(tt);

        head.appendChild(ib('vnr2-mini30', 'minus', '收起到播放条', function() { u.mode = 'bar'; savePos(); drawShell(); }));

        main.appendChild(head);

        var status = V('vnr2-status-row', statusText() + ' · ' + songTitle(curSong()));

        main.appendChild(status); main.__status = status;

        if (u.view === 'playlists') renderPlaylists(main);

        else {

            var detailScroll = V('vnr3-detail-scroll');

            detailScroll.addEventListener('wheel', function(e) { e.stopPropagation(); }, { passive: true });

            detailScroll.addEventListener('touchmove', function(e) { e.stopPropagation(); }, { passive: true });

            main.appendChild(detailScroll);

            renderPlaylistDetail(detailScroll);

        }

        restoreV3Scroll(u.view);

        vnr3RenderedView = u.view;

    };



    var oldRenderBottomBar = renderBottomBar;

    renderBottomBar = function() {

        var oldAlbumImage = bbar.querySelector('.vnr2-songcard img');

        var oldAlbumKey = oldAlbumImage && oldAlbumImage.__vnrSongKey || '';

        var oldAlbumSrc = oldAlbumImage && (oldAlbumImage.currentSrc || oldAlbumImage.src) || '';

        oldRenderBottomBar();

        var currentAlbumKey = _songKey(curSong()) || '';

        if (bbImg) {

            bbImg.__k = currentAlbumKey;

            bbImg.__vnrSongKey = currentAlbumKey;

            if (oldAlbumSrc && oldAlbumKey === currentAlbumKey) {

                bbImg.src = oldAlbumSrc;

            } else {

                _fetchPic(curSong(), function(url) {

                    if (bbImg && bbImg.__vnrSongKey === currentAlbumKey && url && bbImg.src !== url) bbImg.src = url;

                });

            }

        }

        var buttons = bbar.querySelectorAll('.vnr2-bb48');

        if (buttons[0]) {

            buttons[0].title = '按当前模式请求';

            buttons[0].onclick = function() { v3.manualRequest(); };

        }

        var ghosts = bbar.querySelectorAll('.vnr2-bb48.ghost');

        if (ghosts[0]) {

            ghosts[0].classList.remove('ghost');

            ghosts[0].title = '请求模式 · ' + v3.modeLabel();

            ghosts[0].innerHTML = icon2(v3.state.mode === 'recommend' ? 'spark2' : (v3.state.mode === 'playlist' ? 'listB' : 'quote'));

            ghosts[0].onclick = openModeMenu;

        }

        if (ghosts[1]) {

            ghosts[1].classList.remove('ghost');

            ghosts[1].title = '台本库';

            ghosts[1].innerHTML = icon2('listRect');

            ghosts[1].onclick = openScriptLibrary;

        }

        if (ghosts[2]) {

            ghosts[2].classList.remove('ghost');

            ghosts[2].title = '待处理台本';

            ghosts[2].onclick = openPendingScripts;

        }

        var card = bbar.querySelector('.vnr2-songcard');

        if (card) {

            var icons = card.querySelector('.vnr2-sc-icons');

            if (icons) {

                icons.innerHTML = '';

                var timerButton = E('button', 'vnr3-sc-action');

                timerButton.classList.add('vnr3-sleep-action');

                timerButton.type = 'button';

                timerButton.title = '睡眠倒计时';

                timerButton.innerHTML = (v3.sleepLabel() ? '<span class="vnr3-timer-label">' + v3.sleepLabel() + '</span>' : '') + icon2('speaker2');

                timerButton.onclick = openSleep;

                var backgroundsButton = E('button', 'vnr3-sc-action');

                backgroundsButton.type = 'button';

                backgroundsButton.title = '高级背景音管理';

                backgroundsButton.innerHTML = icon2('more');

                backgroundsButton.onclick = openBackgrounds;

                icons.appendChild(timerButton);

                icons.appendChild(backgroundsButton);

            }

        }

        syncBottomV3();

    };



    function syncBottomV3() {

        var timerButton = bbar.querySelector('.vnr3-sleep-action');

        if (!timerButton) return;

        var label = v3.sleepLabel();

        var labelNode = timerButton.querySelector('.vnr3-timer-label');

        if (label) {

            if (!labelNode) {

                labelNode = E('span', 'vnr3-timer-label');

                timerButton.insertBefore(labelNode, timerButton.firstChild || null);

            }

            labelNode.textContent = label;

        } else if (labelNode) {

            labelNode.remove();

        }

    }



    /*

     * Old saved UI states may contain null/0 instead of a strict boolean.

     * Open both side cards once whenever the shell enters studio mode, while

     * still allowing the user to close them manually after the studio is open.

     */

    var vnr3DrawShellWithSideSync = drawShell;

    var vnr3LastShellMode = null;

    drawShell = function() {

        var enteringStudio = u.mode === 'studio' && vnr3LastShellMode !== 'studio';

        if (enteringStudio) u.sidesOpen = true;

        var result = vnr3DrawShellWithSideSync.apply(this, arguments);

        vnr3LastShellMode = u.mode;

        if (enteringStudio) {

            TOP.requestAnimationFrame(function() {

                if (u.mode !== 'studio' || !u.sidesOpen) return;

                leftCard.classList.remove('hidden');

                rightCard.classList.remove('hidden');

            });

        }

        return result;

    };



    try {

        TOP.addEventListener('pp-radio-v3-refresh', function(event) {

            try {

                stage.querySelectorAll('.vnr3-bg-row').forEach(function(row) {

                    if (row && typeof row.__vnr3SyncBackground === 'function') row.__vnr3SyncBackground();

                });

                var detail = event && event.detail;

                if (detail && detail.scriptLibrary) {

                    if (detail.focusPlaylist && detail.playlistId) {

                        u.v3ScriptLibraryPlaylistId = detail.playlistId;

                        savePos();

                    }

                    var scriptBody = stage.querySelector('.vnr3-script-layer .vnr3-script-body');

                    if (scriptBody && typeof scriptBody.__vnr3Refresh === 'function') {

                        scriptBody.__vnr3Refresh();

                    }

                }

                if (u.mode === 'studio') {

                    /* 计时、TTS 进度等高频状态只原位更新。整块重绘会让进度条、

                       hover 和打开的 details 在每次 refresh 时闪烁或复位。 */

                    syncBottomV3();

                }

            } catch (e) {}

        });

    } catch (e) {}

})();

        /*__VNR3_UI_END__*/



        function renderMain() {

            main.innerHTML = '';

            chatBox = null;

            var head = E('div', 'vnr2-main-head');

            var tt = E('div', '');

            var _ttl = u.view === 'made' ? 'Made for You' : (u.view === 'albums' ? 'Albums' : (u.view === 'artist' ? 'Artist' : (u.view === 'history' ? 'History' : (u.view === 'search' ? 'Search' : 'Songs'))));

            var _sub = u.view === 'made' ? '电台的一切设置' : (u.view === 'albums' ? '音乐偏好 · 蒸馏与临时要求' : (u.view === 'artist' ? '主持人与私聊' : 'FM 私人电台 · ' + hostsText()));

            tt.appendChild(E('div', 'vnr2-h1', _ttl));

            tt.appendChild(E('div', 'vnr2-h1s', _sub));

            head.appendChild(tt);

            head.appendChild(ib('vnr2-mini30', 'minus', '收起到播放条', function() {

                u.mode = 'bar';

                savePos();

                drawShell();

            }));

            main.appendChild(head);

            var srow = E('div', 'vnr2-status-row');

            srow.textContent = statusText() + ' · ' + songTitle(curSong());

            srow.title = '请求失败时点击此处重试';

            srow.onclick = function() {

                var st = eng.apiStatus || {};

                if (st.state === 'error') _retryApiStatus();

            };

            main.appendChild(srow);

            main.__status = srow;

            if (u.view === 'history') { renderHistory(main); return; }

            if (u.view === 'search') { renderSearch(main); return; }

            if (u.view === 'made') {

                renderMade(main);

                return;

            }

            if (u.view === 'albums') {

                renderAlbums(main);

                return;

            }

            if (u.view === 'artist') {

                renderArtist(main);

                return;

            }

            var fm=E('div','vnr2-chat-fm');var orb=E('div','vnr2-chat-orb');var oc=E('canvas','vnr2-orb-spectrum');orb.appendChild(oc);var cp=_parseSay((eng.current&&eng.current.say)||'');var cpSegs=_parseSaySegments((eng.current&&eng.current.say)||'');var hostName=(cp.tag&&cp.tag.name)||(eng.current&&eng.current.host)||'主持人';var core=E('div','loader-wrapper');core.appendChild(E('div','loader'));String(hostName).slice(0,10).split('').forEach(function(ch){core.appendChild(E('span','loader-letter',ch));});orb.appendChild(core);fm.appendChild(orb);orb.onclick=function(){if(eng.v3&&eng.v3.toggleContinuousFromHostOrb)eng.v3.toggleContinuousFromHostOrb();};var script=E('div','vnr2-host-script');var companionLine=eng.v3&&eng.v3.currentContinuousLine?eng.v3.currentContinuousLine():null;script.appendChild(E('div','vnr2-host-live',companionLine?('陪伴台本 · '+(companionLine.playlistName||'当前播放列表')+' · 正在播出'):'主持人台本 · 正在播出'));var scriptList=script;var rows=[],seen={};if(companionLine&&companionLine.text){hostName=companionLine.host||hostName;core.querySelectorAll('.loader-letter').forEach(function(letter){letter.remove();});String(hostName||'主持人').slice(0,10).split('').forEach(function(ch){core.appendChild(E('span','loader-letter',ch));});var companionSentences=String(companionLine.text||'').match(/[^。！？!?；;\n]+[。！？!?；;]?/g)||[companionLine.text];companionSentences.forEach(function(line){line=String(line||'').trim();if(line)rows.push({item:null,text:(companionLine.host?companionLine.host+'：':'')+line});});}else if(eng.current&&eng.current.say){var psList=_parseSaySegments(eng.current.say||'');var ls=[];psList.forEach(function(psx){var _h=(psx.tag&&psx.tag.name)||hostName;var _ls=String(psx.display||'').match(/[^。！？!?；;\n]+[。！？!?；;]?/g)||[];_ls.forEach(function(line){line=(_h?_h+'：':'')+line.trim();var key=line.replace(/\s+/g,'');if(line&&!seen[key]){seen[key]=1;rows.push({item:eng.current,text:line});}});});}if(!rows.length)scriptList.appendChild(E('div','vnr2-script-empty',companionLine?(companionLine.waiting?'正在准备下一份陪伴台本…':(companionLine.finished?'陪伴台本已播放完毕':'正在准备当前朗读句…')):'等待当前歌曲的台本…'));var visibleRows=[];for(var vi=0;vi<Math.min(3,rows.length);vi++)visibleRows.push(E('p','vnr2-radio6-line'));visibleRows.forEach(function(pp,vi){pp.title='点击重新播放台本';pp.onclick=function(){var row=rows[Number(pp.dataset.rowIndex)||0];if(row)_speakItem(row.item,true);};scriptList.appendChild(pp);});function paintScriptWindow(){if(!visibleRows.length)return;var base=rows.length>3?Math.floor((Date.now()/5200))%rows.length:0;for(var wi=0;wi<visibleRows.length;wi++){var ri=(base+wi)%rows.length,row=rows[ri],pp=visibleRows[wi];if(!row)continue;pp.textContent=row.text;pp.dataset.rowIndex=String(ri);}}paintScriptWindow();if(rows.length>3){script.__scriptRotate=TOP.setInterval(function(){if(!script.isConnected){TOP.clearInterval(script.__scriptRotate);return;}paintScriptWindow();},5200);};fm.appendChild(script);main.appendChild(fm);_startOrbLoop();

            var wrap = E('div', 'vnr2-chatwrap');

            memHost = E('div', 'vnr2-memhost');

            wrap.appendChild(memHost);

            chatBox = E('div', 'vnr2-chat');

            wrap.appendChild(chatBox);

            var irow = E('div', 'vnr2-input-row');

            var micB = ib('vnr2-cbtn', 'mic', '按住说话', function() {});

            var inp = E('textarea', 'vnr2-inp');

            inp.placeholder = 'Enter 发出消息（不请求），右侧按钮请求回复...';

            chatInput = inp;



            function appendUser(text) {

                text = (text || '').trim();

                if (!text) return;

                eng.store.chatHistory.push({

                    id: _uuid(),

                    role: 'user',

                    content: text,

                    display: text,

                    t: Date.now()

                });

                eng.saveStore();

                renderChat();

            }

            inp.onkeydown = function(ev) {

                if (ev.key === 'Enter' && !ev.shiftKey) {

                    ev.preventDefault();

                    appendUser(inp.value);

                    inp.value = '';

                }

            };

            var sendB = ib('vnr2-cbtn send', 'sendP', '请求 AI 回复', function() {

                if ((inp.value || '').trim()) {

                    appendUser(inp.value);

                    inp.value = '';

                }

                var pend = pendingUserText();

                if (!pend) {

                    _toast('先发一条消息再请求回复');

                    return;

                }

                eng.sendChat(pend, true);

            });

            var micRec = null;

            micB.addEventListener('pointerdown', function() {

                micB.classList.add('rec');

                micRec = _startRec(function(txt) {

                    micB.classList.remove('rec');

                    if (txt) appendUser(txt);

                }, function(state, live) {

                    if (state === 'rec' && live) inp.placeholder = live;

                    if (state === 'end') inp.placeholder = 'Enter 发出消息（不请求），右侧按钮请求回复...';

                });

            });



            function micStop() {

                if (micRec) {

                    try {

                        micRec.stop();

                    } catch (e) {}

                    micRec = null;

                }

                micB.classList.remove('rec');

            }

            micB.addEventListener('pointerup', micStop);

            micB.addEventListener('pointerleave', micStop);

            irow.appendChild(micB);

            irow.appendChild(inp);

            irow.appendChild(sendB);

            wrap.appendChild(irow);

            main.appendChild(wrap);

            renderChat();

        }

        /* ---- bottom mini player ---- */

        var bbProg = null,

            bbTitle = null,

            bbArt = null,

            bbImg = null,

            bbPlay = null;



        function renderBottomBar() {

            bbar.innerHTML = '';

            bbar.appendChild(ib('vnr2-bb48', 'backF', '请求台本+曲目', function() {

                eng.request(eng.store.userNote || '');

            }));

            bbPlay = ib('vnr2-bb48', eng.running && !eng.paused ? 'pauseF' : 'playF', '播放/暂停', function() {

                eng.playPause(eng.store.userNote || '');

            });

            bbar.appendChild(bbPlay);

            bbar.appendChild(ib('vnr2-bb48', 'fwdF', '下一首', function() {

                if (!eng.running) eng.running = true;

                eng.next();

            }));

            var sc = E('div', 'vnr2-songcard');

            bbImg = E('img', '');

            sc.appendChild(bbImg);

            var tx = E('div', '');

            tx.style.cssText = 'flex:1;min-width:0';

            bbTitle = E('div', 'vnr2-sc-t', songTitle(curSong()));

            bbArt = E('div', 'vnr2-sc-s', songArtist(curSong()));

            tx.appendChild(bbTitle);

            tx.appendChild(bbArt);

            sc.appendChild(tx);

            var ics = E('span', 'vnr2-sc-icons');

            ics.innerHTML = icon2('speaker2') + icon2('more');

            sc.appendChild(ics);

            var prog = E('div', 'vnr2-sc-prog');

            bbProg = E('i', '');

            prog.appendChild(bbProg);

            sc.appendChild(prog);

            bbar.appendChild(sc);

            bbar.appendChild(ib('vnr2-bb48 ghost', 'quote', '（预留）', function() {}));

            bbar.appendChild(ib('vnr2-bb48 ghost', 'listRect', '（预留）', function() {}));

            bbar.appendChild(ib('vnr2-bb48 ghost', 'speaker2', '更新播放列表旧台本', function() { eng.requestScripts(true); }));

        }

        /* ---- right card: playlist ---- */

        function renderRightCard() {

            rightCard.innerHTML = '';

            var head = E('div', 'vnr2-pl-head');

            head.appendChild(ib('vnr2-mini30', 'chevD', '关闭播放列表', function() {

                u.sidesOpen = false;

                savePos();

                drawShell();

            }));

            head.appendChild(E('div', 'vnr2-pl-title', 'Playlist'));

            head.appendChild(ib('vnr2-mini30' + (u.plFav ? ' on' : ''), u.plFav ? 'bkmF' : 'bkm', u.plFav ? '收藏歌单' : '普通播放列表', function() {

                u.plFav = !u.plFav;

                savePos();

                renderRightCard();

            }));

            rightCard.appendChild(head);

            var cov = E('div', 'vnr2-pl-cover');

            var ci = E('img', '');

            cov.appendChild(ci);

            cov.appendChild(E('i', 'fade'));

            rightCard.appendChild(cov);

            _fetchPic(curSong(), function(url) {

                if (url) ci.src = url;

                else ci.style.display = 'none';

            });

            var info = E('div', 'vnr2-pl-info');

            var it = E('div', '');

            it.appendChild(E('div', 'vnr2-pl-alb', u.plFav ? '收藏歌单' : (songTitle(curSong()) || 'Playlist')));

            var items = u.plFav ? _favList(eng.store || {}) : (eng.current ? [eng.current] : []).concat(eng.queue);

            it.appendChild(E('div', 'vnr2-pl-sub', hostsText() + ' – ' + items.length + ' songs'));

            info.appendChild(it);

            var pb = ib('vnr2-pl-play', eng.running && !eng.paused ? 'pauseF' : 'playF', '播放/暂停', function() {

                eng.playPause(eng.store.userNote || '');

            });

            info.appendChild(pb);

            rightCard.appendChild(info);

            var list = E('div', 'vnr2-pl-list');

            if (!items.length) list.appendChild(E('div', 'vnr2-empty', u.plFav ? '暂无收藏。' : '队列为空。'));

            items.slice(0, 40).forEach(function(itm, i) {

                var s = itm.song || itm;

                var row = E('div', 'vnr2-pl-it');

                row.appendChild(E('div', 'vnr2-pl-num', String(i + 1)));

                var tx = E('div', 'vnr2-pl-tx');

                tx.appendChild(E('div', 'vnr2-pl-t', songTitle(s)));

                tx.appendChild(E('div', 'vnr2-pl-s', songArtist(s)));

                row.appendChild(tx);

                var fav = _isFav(s);

                row.appendChild(ib('vnr2-ic' + (fav ? ' on' : ''), fav ? 'bkmF' : 'bkm', '收藏', function() {

                    eng.toggleFav(s, itm.say);

                    renderRightCard();

                }));

                row.appendChild(ib('vnr2-ic', 'more', '更多操作', function(ev) {

                    showSongMenu(ev, itm, s);

                }));

                list.appendChild(row);

            });

            rightCard.appendChild(list);

        }



        function showSongMenu(ev, itm, s) {

            var old = TOPDOC.getElementById('vnr2-song-menu');

            if (old) old.remove();

            var pop = E('div', 'vnr2-pop');

            pop.id = 'vnr2-song-menu';

            pop.style.zIndex = 2147483647;

            pop.appendChild(E('div', 'vnr2-pop-title', songTitle(s)));



            function act(label, fn) {

                var r = E('div', 'vnr2-row');

                r.style.cursor = 'pointer';

                r.appendChild(E('div', 'vnr2-rt', label));

                r.onclick = function() {

                    pop.remove();

                    fn();

                };

                pop.appendChild(r);

            }

            act('立即播放', function() {

                eng.queueSong(s, true);

            });

            act('加入队列', function() {

                eng.queueSong(s, false);

            });

            act('编辑台本', function() {

                openScriptLibraryForSong(item);

            });

            act('更新台本', function() {

                v3.requestLinkedScripts(true, [item.id]);

            });

            act('保存台本到收藏', function() {

                var key = _songKey(s);

                if (key && itm.say) {

                    _saveScriptToFav(key, itm.say, '手动保存');

                    _toast('已保存台本');

                } else _toast('该曲目暂无台本');

            });

            if (itm.id && !(eng.current && itm.id === eng.current.id)) act('从队列移除', function() {

                eng.removeItem(itm);

                renderRightCard();

            });

            if (u.plFav) act('从收藏删除', function() {

                eng.removeFav(s);

                renderRightCard();

            });

            shellHost().appendChild(pop);

            var pr = pop.getBoundingClientRect(),

                s2 = scr();

            pop.style.left = _clamp(ev.clientX - pr.width + 10, 8, s2.w - pr.width - 8) + 'px';

            pop.style.top = _clamp(ev.clientY + 8, 8, s2.h - pr.height - 8) + 'px';

            TOP.setTimeout(function() {

                var closer = function(e2) {

                    if (!pop.contains(e2.target)) {

                        pop.remove();

                        TOPDOC.removeEventListener('pointerdown', closer, true);

                    }

                };

                TOPDOC.addEventListener('pointerdown', closer, true);

            }, 30);

        }

        /* ---- left card: now playing / lyrics ---- */

        var lcLyr = null,

            lcLrc = null,

            lcSongKey = '';



        function renderLeftCard() {

            leftCard.innerHTML = '';

            var bg = E('div', 'vnr2-lc-bg');

            var bi = E('img', '');

            bg.appendChild(bi);

            bg.appendChild(E('i', 'fade'));

            leftCard.appendChild(bg);

            leftCard.appendChild(E('i', 'vnr2-lc-fog'));

            var custom = (cfg.leftCardImage || '').trim();

            if (custom) bi.src = custom;

            else _fetchPic(curSong(), function(url) {

                if (url) bi.src = url;

                else bi.style.display = 'none';

            });

            var top = E('div', 'vnr2-lc-top');

            top.appendChild(ib('vnr2-mini30', 'chevL', '隐藏', function() {

                u.sidesOpen = false;

                savePos();

                drawShell();

            }));

            var s = curSong();

            top.appendChild(ib('vnr2-mini30' + (_isFav(s) ? ' on' : ''), _isFav(s) ? 'heartF' : 'heart', '收藏当前曲目', function() {

                if (s) eng.toggleFav(s, eng.current && eng.current.say);

                renderLeftCard();

            }));

            leftCard.appendChild(top);

            lcLyr = E('div', 'vnr2-lc-lyr');

            lcLyr.appendChild(E('div', 'cur', songTitle(s)));

            leftCard.appendChild(lcLyr);

            var foot = E('div', 'vnr2-lc-foot');

            var fi = E('img', '');

            _fetchPic(s, function(url) {

                if (url) fi.src = url;

            });

            foot.appendChild(fi);

            var tx = E('div', '');

            tx.style.cssText = 'flex:1;min-width:0';

            var ft = E('div', 'vnr2-pl-t', songTitle(s));

            var fs2 = E('div', 'vnr2-pl-s', songArtist(s));

            tx.appendChild(ft);

            tx.appendChild(fs2);

            foot.appendChild(tx);

            var nx = E('button', 'vnr2-next');

            nx.innerHTML = icon2('fwdF') + '<span>Next</span>';

            nx.onclick = function() {

                if (!eng.running) eng.running = true;

                eng.next();

            };

            foot.appendChild(nx);

            leftCard.appendChild(foot);

            lcLrc = null;

            lcSongKey = _songKey(s) || '';

            _fetchLyric(s, function(l) {

                if (l && _songKey(curSong()) === lcSongKey) lcLrc = l;

            });

        }



        function updateLyrics() {

            if (!lcLyr || u.mode !== 'studio' || !u.sidesOpen) return;

            var s = curSong();

            var k = _songKey(s) || '';

            if (k !== lcSongKey) {

                renderLeftCard();

                return;

            }

            var t = 0;

            try {

                t = eng.music ? eng.music.currentTime : 0;

            } catch (e) {}

            renderLyrLines(lcLyr, lcLrc, t, {

                baseCls: 'vnr2-lc-lyr',

                count: 5,

                fallback: songTitle(s)

            });

        }

        /* end seg_ui_c */

        /* ═══ Artist：主持人选择 + 私聊（电话 app 同款逻辑，电台 UI）═══ */

        function _aChats() {

            if (!eng.store.artistChats) eng.store.artistChats = {};

            return eng.store.artistChats;

        }



        function _aBuildPrompt(ch, userInput) {

            var tpl = cfg.artistChatPrompt || '';

            var cid = _charId(ch);

            var hist = (_aChats()[cid] || []).slice(0, -0);

            var depth = _num(cfg.artistDepth, 10);

            var past = hist.slice(0, -1);

            var sl = depth > 0 ? past.slice(-depth * 2) : past;

            var convo = sl.map(function(m) {

                return (m.role === 'user' ? (_user().name || '用户') : (ch.name || '角色')) + ': ' + (m.display || m.content || '');

            }).join('\n');

            var u2 = _user();

            var map = {

                '角色名称': ch.name || '',

                '角色设定': ch.persona || '',

                '用户名称': u2.name || '用户',

                '用户设定': u2.persona || '',

                '世界书': _joinTextParts([_getWbText(ch), _getRadioWbText()]),

                '电台世界书': _getRadioWbText(),

                '当前时间': new Date().toLocaleString(),

                '酒馆历史': _getSTHistory(cfg.stHistN),

                'Horae总结': _getHorae(),

                '柏宝书总结': _getBaiBaiSummary(),

                '对话内容': convo,

                '用户输入': userInput || ''

            };

            var out = String(tpl || '');

            for (var k in map) {

                if (map.hasOwnProperty(k)) out = out.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), map[k]);

            }

            /* 私聊语言修复：无论存储的提示词是否带语言指令，都强制前置双语 VoiceTag 格式要求（最高优先级） */

            var lg0 = ch && ch.ttsSpeakLang;

            var label0 = lg0 === 'ja' ? '日文' : lg0 === 'zh' ? '中文' : lg0 === 'en' ? '英文' : _voiceLang();

            var disp0 = _displayLang();

            var map2 = { '朗读语言': label0, '显示语言': disp0 };

            var exJa = '示例（用户说“你好”）：[VoiceTag:' + (ch && ch.name || '角色名字') + ':' + label0 + ':こんにちは、今日はどんな気分？]“你好呀，今天心情怎么样？”';

            var exOther = '示例：[VoiceTag:' + (ch && ch.name || '角色名字') + ':' + label0 + ':语音文本]“字幕文本”';

            var fmt = '【回复格式（最高优先级，违反即不合格）】\n' +

                '你的每条回复必须且只能使用下面这一种格式（需要多说几条就分成多行，每行一条）：\n' +

                '[VoiceTag:角色名字:' + label0 + ':语音文本]“字幕文本”\n' +

                '- 方括号内的“语音文本”必须整句使用 ' + label0 + ' 书写，这是发送给 TTS 朗读的内容。\n' +

                '- 中文弯引号“ ”内的“字幕文本”必须整句使用 ' + disp0 + ' 书写，这是显示给用户看的字幕。\n' +

                '- 语音文本与字幕文本是同一句话的两种语言版本，内容含义必须一一对应。\n' +

                '- VoiceTag 格式不是 Markdown、不是 JSON、不是代码块；禁止输出 JSON 对象、```代码块、**加粗**、列表或任何解释。\n' +

                (label0 === '日文' ? exJa : exOther) + '\n\n';

            out = fmt + out;

            for (var k2 in map2) {

                if (map2.hasOwnProperty(k2)) out = out.replace(new RegExp('\\{\\{' + k2 + '\\}\\}', 'g'), map2[k2]);

            }

            return out;

        }



        function _aSend(ch, text) {

            text = (text || '').trim();

            if (!text || eng._artistBusy) return;

            var cid = _charId(ch);

            var arr = _aChats()[cid] = _aChats()[cid] || [];

            arr.push({

                id: _uuid(),

                role: 'user',

                content: text,

                display: text,

                t: Date.now()

            });

            eng.saveStore();

            renderMain();

            eng._artistBusy = true;

            _setApiStatus('loading', 'artist', '私聊 · ' + (ch.name || ''), '', text);

            var prompt = _aBuildPrompt(ch, text);

            _chat([{

                role: 'system',

                content: prompt

            }, {

                role: 'user',

                content: text

            }], function(t) {

                eng._artistBusy = false;

                _clearApiStatus('artist');

                var p = _parseSay(String(t || '').trim());

                var msg = {

                    id: _uuid(),

                    role: 'assistant',

                    content: String(t || '').trim(),

                    display: p.display,

                    tts: p.tts,

                    t: Date.now()

                };

                arr.push(msg);

                if (arr.length > 500) arr.splice(0, arr.length - 500);

                eng.saveStore();

                renderMain();

                if (cfg.radioTtsEnabled !== false && cfg.radioTtsEnabled !== 'false' && ch.ttsEnabled) {

                    eng.duck(true);

                    _tts(p.tts || p.display, ch, function(url) {

                        msg.audioUrl = url;

                        eng.saveStore();

                        try {

                            var a = new TOP.Audio(url);

                            a.volume = _clamp((cfg.voiceVolume === undefined ? 100 : cfg.voiceVolume) / 100, 0, 1);

                            eng._chatAudio = a;

                            a.muted = !!u.muted;

                            a.onended = a.onerror = function() {

                                eng.duck(false);

                            };

                            a.play();

                        } catch (e) {

                            eng.duck(false);

                        }

                    }, function() {

                        eng.duck(false);

                    }, p.tag && p.tag.lang);

                }

            }, function(e) {

                eng._artistBusy = false;

                _setApiStatus('error', 'artist', '私聊 · ' + (ch.name || ''), e, text);

                _toast('私聊请求失败: ' + e);

                renderMain();

            });

        }



        function renderArtist(box) {

            var chars = _chars();

            var cid = u.artistId;

            var ch = null;

            for (var i = 0; i < chars.length; i++) {

                if (_charId(chars[i]) === cid) ch = chars[i];

            }

            if (!ch) {

                /* —— 角色列表：选主持人 / 进私聊 —— */

                var wrap = E('div', 'vnr2-set');

                var g = E('div', 'vnr2-set-g');

                g.appendChild(E('div', 'vnr2-set-gt', '通讯录 · 点击进入私聊 · 右侧开关设为电台主持人'));

                if (!chars.length) g.appendChild(E('div', 'vnr2-empty', '通讯录暂无角色。'));

                chars.forEach(function(c) {

                    var ccid = _charId(c);

                    var row = E('div', 'vnr2-set-r');

                    row.style.cursor = 'pointer';

                    var left = E('div', 'vnr2-set-l');

                    left.style.cssText += ';display:flex;gap:12px;align-items:center';

                    var av = avaEl({

                        host: c.name,

                        _cid: ccid

                    });

                    av.style.width = '34px';

                    av.style.height = '34px';

                    left.appendChild(av);

                    var tx = E('div', '');

                    tx.appendChild(E('div', '', c.name || '未命名'));

                    var cnt = (_aChats()[ccid] || []).length;

                    var sub = E('div', '', (cnt ? cnt + ' 条私聊' : '暂无私聊'));

                    sub.style.cssText = 'font-size:11px;color:rgba(255,255,255,.4);margin-top:2px';

                    tx.appendChild(sub);

                    left.appendChild(tx);

                    left.onclick = function() {

                        u.artistId = ccid;

                        savePos();

                        renderMain();

                    };

                    row.appendChild(left);

                    var hostOn = _hostIds(eng.store).indexOf(ccid) >= 0;

                    var sw = E('button', 'vnr2-sw' + (hostOn ? ' on' : ''));

                    sw.type = 'button';

                    sw.title = '设为电台主持人';

                    sw.appendChild(E('i', ''));

                    sw.onclick = function(ev) {

                        ev.stopPropagation();

                        var arr = _hostIds(eng.store),

                            k = arr.indexOf(ccid);

                        if (k >= 0) arr.splice(k, 1);

                        else arr.push(ccid);

                        eng.store.hostIds = arr;

                        eng.saveStore();

                        sw.classList.toggle('on', arr.indexOf(ccid) >= 0);

                        eng.emit();

                    };

                    row.appendChild(sw);

                    g.appendChild(row);

                });

                wrap.appendChild(g);

                box.appendChild(wrap);

                return;

            }

            /* —— 私聊界面 —— */

            var bar2 = E('div', 'vnr2-preset');

            var backB2 = E('button', 'vnr2-pbtn', '← 返回列表');

            backB2.onclick = function() {

                u.artistId = null;

                savePos();

                renderMain();

            };

            var injB = E('button', 'vnr2-pbtn', '注入酒馆（下次发送生效）');

            injB.onclick = function() {

                var arr = _aChats()[cid] || [];

                var n = _num(cfg.artistInjectN, 8);

                var lines = arr.slice(-n).map(function(m) {

                    return (m.role === 'user' ? (_user().name || '用户') : (ch.name || '角色')) + ': ' + (m.display || m.content || '');

                }).join('\n');

                if (!lines) {

                    _toast('没有可注入的内容');

                    return;

                }

                var txt2 = '【电台私聊 · ' + (ch.name || '') + '】以下是已发生的私聊记录，仅供参考：\n' + lines;

                sbS.pendingRadioInject = (sbS.pendingRadioInject ? sbS.pendingRadioInject + '\n\n' : '') + txt2;

                _saveCfg();

                _toast('已加入注入队列，下次发送随消息注入');

            };

            var delB = E('button', 'vnr2-pbtn', '一键删除全部');

            delB.onclick = function() {

                _aChats()[cid] = [];

                eng.saveStore();

                renderMain();

            };

            bar2.appendChild(backB2);

            bar2.appendChild(injB);

            bar2.appendChild(delB);

            box.appendChild(bar2);

            var wrap2 = E('div', 'vnr2-chatwrap');

            var cbox = E('div', 'vnr2-chat');

            var arrA = _aChats()[cid] || [];

            if (!arrA.length) cbox.appendChild(E('div', 'vnr2-empty', '和 ' + (ch.name || '') + ' 的私聊。Enter 直接发送请求，按住麦克风说话。'));

            arrA.slice(-80).forEach(function(m) {

                var row = E('div', 'vnr2-mrow ' + (m.role === 'user' ? 'user' : 'ai'));

                var head = E('div', 'vnr2-mhead');

                if (m.role !== 'user') {

                    head.appendChild(avaEl({

                        host: ch.name,

                        _cid: cid

                    }));

                    head.appendChild(E('span', '', ch.name || ''));

                    var vb = E('div', 'vnr2-vbar' + ((_msgPlayingId && _msgPlayingId === m.id) ? ' live' : ''));

                    vb.innerHTML = '<i></i><i></i><i></i><i></i><i></i>';

                    vb.title = '播放语音';

                    vb.onclick = function() {

                        m.host = ch.name;

                        _playMsg(m);

                    };

                    head.appendChild(vb);

                } else head.appendChild(E('span', '', '我'));

                var ops = E('div', 'vnr2-mops');

                ops.appendChild(ib('vnr2-ic', 'edit', '编辑', function() {

                    startEdit(row, m);

                }));

                ops.appendChild(ib('vnr2-ic', 'del', '删除', function() {

                    var k = arrA.indexOf(m);

                    if (k >= 0) arrA.splice(k, 1);

                    eng.saveStore();

                    renderMain();

                }));

                head.appendChild(ops);

                row.appendChild(head);

                _pairBilingual(_splitCaption(m.display || m.content || '')).forEach(function(pp) {

                    var b = E('div', 'vnr2-bub');

                    b.appendChild(E('span', '', pp.main));

                    if (pp.tr) {

                        var chip = E('span', 'vnr2-trc', '译');

                        var tr = E('div', 'vnr2-trx', pp.tr);

                        chip.onclick = function() {

                            b.classList.toggle('tr-open');

                        };

                        b.appendChild(chip);

                        b.appendChild(tr);

                    }

                    row.appendChild(b);

                });

                cbox.appendChild(row);

            });

            wrap2.appendChild(cbox);

            var irow = E('div', 'vnr2-input-row');

            var micB2 = ib('vnr2-cbtn', 'mic', '按住说话', function() {});

            var inp2 = E('textarea', 'vnr2-inp');

            inp2.placeholder = (eng._artistBusy ? ch.name + ' 正在回复…' : '和 ' + (ch.name || '') + ' 说点什么（Enter 发送）');

            inp2.onkeydown = function(ev) {

                if (ev.key === 'Enter' && !ev.shiftKey) {

                    ev.preventDefault();

                    var v = inp2.value;

                    inp2.value = '';

                    _aSend(ch, v);

                }

            };

            var sendB2 = ib('vnr2-cbtn send', 'sendP', '发送', function() {

                var v = inp2.value;

                inp2.value = '';

                _aSend(ch, v);

            });

            var micR = null;

            micB2.addEventListener('pointerdown', function() {

                micB2.classList.add('rec');

                micR = _startRec(function(txt) {

                    micB2.classList.remove('rec');

                    if (txt) _aSend(ch, txt);

                }, function() {});

            });



            function micS() {

                if (micR) {

                    try {

                        micR.stop();

                    } catch (e) {}

                    micR = null;

                }

                micB2.classList.remove('rec');

            }

            micB2.addEventListener('pointerup', micS);

            micB2.addEventListener('pointerleave', micS);

            irow.appendChild(micB2);

            irow.appendChild(inp2);

            irow.appendChild(sendB2);

            wrap2.appendChild(irow);

            box.appendChild(wrap2);

            cbox.scrollTop = cbox.scrollHeight;

        }



        /* ---- bar dynamic update ---- */

        var barLrc = null,

            barLrcKey = '',

            barPicKey = '';



        function setMarq(el, text) {

            if (el.__last === text) return;

            el.__last = text;

            el.innerHTML = '';

            var sp = E('span', '', text);

            el.appendChild(sp);

            el.classList.remove('marq');

            TOP.setTimeout(function() {

                try {

                    if (sp.scrollWidth > el.clientWidth + 2) el.classList.add('marq');

                } catch (e) {}

            }, 30);

        }



        function updateBar() {

            var s = curSong();

            var api = eng.apiStatus || {};

            var busyLine = '';

            if (api.state === 'loading') busyLine = '正在请求' + (api.label || '') + '...';

            else if (api.state === 'error') busyLine = (api.label || '请求') + '失败';

            else if (eng.busy) busyLine = '正在选曲...';

            else if (eng.scriptBusy) busyLine = '正在补台本...';

            else if (eng.chatBusy) busyLine = '主播连线中...';

            var k = _songKey(s) || '';

            if (cfg.barLyrics === true || cfg.barLyrics === 'true') {

                if (k !== barLrcKey) {

                    barLrcKey = k;

                    barLrc = null;

                    _fetchLyric(s, function(l) {

                        if (_songKey(curSong()) === barLrcKey) barLrc = l;

                    });

                }

                var line = '';

                if (barLrc && barLrc.lines.length) {

                    var t = 0;

                    try {

                        t = eng.music ? eng.music.currentTime : 0;

                    } catch (e) {}

                    var idx = _lrcLineAt(barLrc.lines, t);

                    if (idx >= 0) line = barLrc.lines[idx].text;

                }

                setMarq(t1, line || songTitle(s));

                if (_lyrStyle() === 'lumi' && line && barLrc && barLrc.lines.length) {

                    var _i2 = _lrcLineAt(barLrc.lines, (eng.music && eng.music.currentTime) || 0);

                    if (_i2 >= 0) {

                        var _t0 = barLrc.lines[_i2].t,

                            _t1 = barLrc.lines[_i2 + 1] ? barLrc.lines[_i2 + 1].t : _t0 + 6;

                        var _p = Math.round(_clamp((((eng.music && eng.music.currentTime) || 0) - _t0) / Math.max(.5, _t1 - _t0), 0, 1) * 100);

                        t1.style.backgroundImage = 'linear-gradient(90deg,#fff ' + _p + '%,rgba(255,255,255,.4) ' + _p + '%)';

                        t1.style.webkitBackgroundClip = 'text';

                        t1.style.backgroundClip = 'text';

                        t1.style.color = 'transparent';

                    }

                } else {

                    t1.style.backgroundImage = '';

                    t1.style.color = '';

                }

                setMarq(t2, busyLine || (songTitle(s) + '、' + songArtist(s)));

            } else {

                setMarq(t1, songTitle(s));

                setMarq(t2, busyLine || songArtist(s));

            }

            playB2.innerHTML = icon2(eng.running && !eng.paused ? 'pauseF' : 'playF');

            var sv = playB2.querySelector('svg');

            if (sv) {

                sv.style.width = '22px';

                sv.style.height = '22px';

            }

            heartB.innerHTML = icon2(_isFav(s) ? 'heartF' : 'heart');

            heartB.style.color = _isFav(s) ? '#fff' : 'rgba(255,255,255,.92)';

            var hv = heartB.querySelector('svg');

            if (hv) {

                hv.style.width = '18px';

                hv.style.height = '18px';

            }

            volB.innerHTML = icon2(u.muted ? 'volMute' : 'vol');

            var vv = volB.querySelector('svg');

            if (vv) {

                vv.style.width = '18px';

                vv.style.height = '18px';

            }

            ['quote', 'listB', 'more'].forEach(function(n, i) {

                var el = [quoteB, listB2, moreB][i];

                var e2 = el.querySelector('svg');

                if (e2) {

                    e2.style.width = '18px';

                    e2.style.height = '18px';

                }

            });

            albGlz.style.display = (cfg.barAlbumGlass === false || cfg.barAlbumGlass === 'false') ? 'none' : 'block';

            if (k !== barPicKey) {

                barPicKey = k;

                albImg.style.display = 'none';

                _fetchPic(s, function(url) {

                    if (_songKey(curSong()) === barPicKey && url) {

                        albImg.src = url;

                        albImg.style.display = 'block';

                    }

                });

            }

        }



        var _studioViewKey = '', _studioPlaylistKey = '', _studioChatKey = '';



        function _studioCurrentKey() {

            var it = eng.current || {}, song = it.song || {};

            var companionLine=eng.v3&&eng.v3.currentContinuousLine?eng.v3.currentContinuousLine():null;return [it.id || '', song.title || '', song.artist || '', it.say || '', it.needsScript ? 'pending' : '', it.scriptFresh ? 'fresh' : '', companionLine?JSON.stringify(companionLine):''].join('|');

        }



        function _studioPlaylistStateKey() {

            var arr = (eng.current ? [eng.current] : []).concat(eng.queue || []);

            return arr.map(function(it) {

                var song = (it && it.song) || {};

                return [it && it.id || '', song.title || '', song.artist || '', it && it.say || '', it && it.needsScript ? 'pending' : ''].join('|');

            }).join('\n');

        }



        function _studioChatStateKey() {

            var h = (eng.store && eng.store.chatHistory) || [];

            return h.slice(-60).map(function(m) {

                return [m && m.id || '', m && m.t || '', m && m.role || '', m && (m.display || m.content || '')].join('|');

            }).join('\n');

        }



        function updateStudioTick() {

            _updateChatOrb();

            try {

                if (u.mode === 'studio') {

                    var liveViewKey = _studioCurrentKey();

                    if (u.view === 'songs' && liveViewKey !== _studioViewKey) {

                        _studioViewKey = liveViewKey;

                        renderMain();

                    }

                    if (u.sidesOpen) {

                        var livePlaylistKey = _studioPlaylistStateKey();

                        if (livePlaylistKey !== _studioPlaylistKey) {

                            _studioPlaylistKey = livePlaylistKey;

                            renderRightCard();

                        }

                    }

                    if (u.view === 'songs' && chatBox) {

                        var liveChatKey = _studioChatStateKey();

                        if (liveChatKey !== _studioChatKey) {

                            _studioChatKey = liveChatKey;

                            renderChat();

                        }

                    }

                }

            } catch (e) {}

            if (u.mode !== 'studio') return;

            if (bbProg) {

                var cur = 0,

                    dur = 0;

                try {

                    if (eng.music) {

                        cur = eng.music.currentTime || 0;

                        dur = eng.music.duration || 0;

                    }

                } catch (e) {}

                bbProg.style.width = (dur ? _clamp(cur / dur * 100, 0, 100) : 0) + '%';

            }

            if (bbTitle) bbTitle.textContent = songTitle(curSong());

            if (bbArt) bbArt.textContent = songArtist(curSong());

            if (bbPlay) bbPlay.innerHTML = icon2(eng.running && !eng.paused ? 'pauseF' : 'playF');

            if (bbImg) {

                var k = _songKey(curSong()) || '';

                if (bbImg.__k !== k) {

                    bbImg.__k = k;

                    _fetchPic(curSong(), function(url) {

                        if (bbImg.__k === k && url) bbImg.src = url;

                    });

                }

            }

            if (main.__status) {

                var _ast = eng.apiStatus || {};

                main.__status.textContent = (_ast.state === 'error' ? '⟳ 点击重试 · ' : '') + statusText() + ' · ' + songTitle(curSong());

                main.__status.classList.toggle('err', _ast.state === 'error');

            }

            updateLyrics();

        }



        function exitRadio() {

            _cleanupOrbLyrics();

            orbLyrEl = null;

            try {

                u.mode = 'orb';

                u.listOpen = false;

                u.sidesOpen = false;

                eng.saveStore();

            } catch (e) {}

            try {

                eng.stop();

            } catch (e) {}

            try {

                if (listPop) listPop.remove();

            } catch (e) {}

            try {

                shell.remove();

            } catch (e) {}

            try {

                if (eng._floatingProgressTimer) {

                    TOP.clearInterval(eng._floatingProgressTimer);

                    eng._floatingProgressTimer = null;

                }

                if (eng._duckTimer) {

                    TOP.clearInterval(eng._duckTimer);

                    eng._duckTimer = null;

                }

            } catch (e) {}

            TOP.__vnmRadioShellEl = null;

        }



        function drawShell() {

            ensureShellHost(shell);

            var mode = u.mode;

            shell.className = 'vnr2-shell is-' + mode;

            /* orb */

            if (mode === 'orb') {

                if (u.orbSnap) {

                    var so2 = _snapTargetOrb();

                    if (so2) {

                        u.orbX = so2.x;

                        u.orbY = so2.y;

                    }

                }

                orbPos();

                orb.style.display = 'flex';

                orb.style.left = u.orbX + 'px';

                orb.style.top = u.orbY + 'px';

            } else orb.style.display = 'none';

            updateOrbLyr();

            /* bar */

            if (mode === 'bar') {

                if (u.snap) {

                    var sn = _snapTarget();

                    if (sn) {

                        u.barX = sn.x;

                        u.barY = sn.y;

                    }

                }

                barPos();

                bar.style.display = 'block';

                bar.style.left = u.barX + 'px';

                bar.style.top = u.barY + 'px';

                bar.classList.toggle('snapped', !!u.snap);

                updateBar();

            } else bar.style.display = 'none';

            renderListPop();

            renderChatPop();

            /* studio */

            if (mode === 'studio') {

                studio.style.display = 'flex';

                var s = scr();

                var mobileStudio = s.w < 700 || s.h < 600;

                var sc2 = mobileStudio ? Math.min((s.w * 0.94) / 1004, (s.h * 0.84) / 650, 1.15) : Math.min((s.w * 0.94) / 1720, (s.h * 0.92) / 800, 1.15);

                eng._stScale = sc2;

                var stX2 = mobileStudio ? 0 : (u.stX || 0), stY2 = mobileStudio ? 0 : (u.stY || 0);

                stage.style.position = 'absolute';

                stage.style.margin = '0';

                if (mobileStudio) {

                    stage.style.left = Math.round(s.x + s.w / 2 - 860 * sc2) + 'px';

                    stage.style.top = Math.round(s.y + s.h / 2 - 400 * sc2) + 'px';

                    stage.style.transformOrigin = 'left top';

                } else {

                    stage.style.left = Math.round(s.x + s.w / 2 - 860) + 'px';

                    stage.style.top = Math.round(s.y + s.h / 2 - 400) + 'px';

                    stage.style.transformOrigin = 'center center';

                }

                stage.style.transform = 'translate(' + Math.round(stX2) + 'px,' + Math.round(stY2) + 'px) scale(' + sc2 + ')';

                renderSidebar();

                renderMain();

                _studioViewKey = _studioCurrentKey();

                _studioPlaylistKey = _studioPlaylistStateKey();

                _studioChatKey = _studioChatStateKey();

                renderBottomBar();

                leftCard.classList.toggle('hidden', !u.sidesOpen);

                rightCard.classList.toggle('hidden', !u.sidesOpen);

                if (u.sidesOpen) {

                    renderLeftCard();

                    renderRightCard();

                }

                updateStudioTick();

            } else {

                studio.style.display = 'none';

                var m2 = TOPDOC.getElementById('vnr2-song-menu');

                if (m2) m2.remove();

            }

            _applyMute();

        }

        var orbLyrEl = null,

            orbLrc = null,

            orbLrcKey = '';



        function updateOrbLyr() {

            var want = (u.mode === 'orb') && (cfg.orbLyrics === true || cfg.orbLyrics === 'true');

            if (!want) {

                _cleanupOrbLyrics();

                orbLyrEl = null;

                orbLrc = null;

                orbLrcKey = '';

                return;

            }

            if (!orbLyrEl || !orbLyrEl.isConnected || orbLyrEl.parentNode !== shell) {

                _cleanupOrbLyrics();

                orbLyrEl = E('div', 'vnr2-orb-lyr');

                orbLyrEl.setAttribute('data-vnr-owner', shell.id || 'pp-radio-floating-shell');

                shell.appendChild(orbLyrEl);

            } else {

                _cleanupOrbLyrics(orbLyrEl);

            }

            var s2 = curSong();

            var k2 = _songKey(s2) || '';

            if (k2 !== orbLrcKey) {

                orbLrcKey = k2;

                orbLrc = null;

                _fetchLyric(s2, function(l) {

                    if ((_songKey(curSong()) || '') === orbLrcKey) orbLrc = l;

                });

            }

            var t2v = 0;

            try {

                t2v = eng.music ? eng.music.currentTime : 0;

            } catch (e) {}

            renderLyrLines(orbLyrEl, orbLrc, t2v, {

                baseCls: 'vnr2-orb-lyr',

                style: 'plain',

                count: 3

            });

            var sw2 = scr().w;

            var leftSpace = u.orbX - 18,

                rightSpace = sw2 - (u.orbX + ORB) - 18;

            if (leftSpace > rightSpace) {

                orbLyrEl.style.left = Math.max(8, u.orbX - 260) + 'px';

                orbLyrEl.style.textAlign = 'right';

            } else {

                orbLyrEl.style.left = Math.min(sw2 - 258, u.orbX + ORB + 12) + 'px';

                orbLyrEl.style.textAlign = 'left';

            }

            orbLyrEl.style.top = Math.max(8, u.orbY + Math.round(ORB / 2) - 42) + 'px';

        }

        /* 低延迟吸附跟随（rAF） */

        (function snapLoop() {

            try {

                if (!shell.isConnected) return;

                if (u.mode === 'bar' && u.snap && !bd) {

                    var sn = _snapTarget();

                    if (sn && (sn.x !== u.barX || sn.y !== u.barY)) {

                        u.barX = sn.x;

                        u.barY = sn.y;

                        bar.style.left = u.barX + 'px';

                        bar.style.top = u.barY + 'px';

                    }

                }

                if (u.mode === 'orb' && u.orbSnap && !orbDrag) {

                    var so = _snapTargetOrb();

                    if (so && (so.x !== u.orbX || so.y !== u.orbY)) {

                        u.orbX = so.x;

                        u.orbY = so.y;

                        orb.style.left = u.orbX + 'px';

                        orb.style.top = u.orbY + 'px';

                        if (orbLyrEl) updateOrbLyr();

                    }

                }

            } catch (e) {}

            TOP.requestAnimationFrame(snapLoop);

        })();

        function _duckCheck() {

            try {

                var ext = _extVoiceActive();

                if (ext && !eng._extDucked) {

                    eng._extDucked = true;

                    eng.duck(true);

                } else if (!ext && eng._extDucked) {

                    eng._extDucked = false;

                    var voiceBusy = false;

                    try {

                        voiceBusy = eng.voice && !eng.voice.paused;

                    } catch (e) {}

                    if (!voiceBusy) eng.duck(false);

                }

            } catch (e) {}

        }

        TOP.__vnrOnAnyPlay = function(a) {

            try {

                if (!_isOurAudio(a)) {

                    if (!eng._extDucked) {

                        eng._extDucked = true;

                        eng.duck(true);

                    }

                }

            } catch (e) {}

        };

        if (eng._duckTimer) {

            try {

                TOP.clearInterval(eng._duckTimer);

            } catch (e) {}

        }

        eng._duckTimer = TOP.setInterval(_duckCheck, 150);

        shell.__draw = drawShell;

        shell.__tick = function() {

            try {

                ensureShellHost(shell);

                var vnNow = !!_vnRoot();

                if (shell.__vnWas === undefined) shell.__vnWas = vnNow;

                if (shell.__vnWas && !vnNow && u.mode !== 'orb' && cfg.keepModeOnVnExit !== true && cfg.keepModeOnVnExit !== 'true') {

                    u.mode = 'orb';

                    u.listOpen = false;

                    u.chatOpen = false;

                    savePos();

                    drawShell();

                }

                shell.__vnWas = vnNow;

                _duckCheck();

                if (u.mode === 'bar') {

                    if (u.snap) {

                        var sn = _snapTarget();

                        if (sn && (sn.x !== u.barX || sn.y !== u.barY)) {

                            u.barX = sn.x;

                            u.barY = sn.y;

                            bar.style.left = u.barX + 'px';

                            bar.style.top = u.barY + 'px';

                        }

                    }

                    updateBar();

                }

                if (u.mode === 'orb' && u.orbSnap) {

                    var so3 = _snapTargetOrb();

                    if (so3 && (so3.x !== u.orbX || so3.y !== u.orbY)) {

                        u.orbX = so3.x;

                        u.orbY = so3.y;

                        orb.style.left = u.orbX + 'px';

                        orb.style.top = u.orbY + 'px';

                    }

                }

                updateStudioTick();

                updateOrbLyr();

                _applyMute();

            } catch (e) {}

        };

        var _viewportFrame = 0;

        function _queueViewportDraw() {

            if (_viewportFrame) return;

            _viewportFrame = TOP.requestAnimationFrame(function() {

                _viewportFrame = 0;

                if (shell.isConnected) drawShell();

            });

        }

        var _vv = null;

        try { _vv = TOP.visualViewport || null; } catch (e) {}

        TOP.addEventListener('resize', _queueViewportDraw, { passive: true });

        if (_vv) {

            _vv.addEventListener('resize', _queueViewportDraw, { passive: true });

            _vv.addEventListener('scroll', _queueViewportDraw, { passive: true });

        }

        shell.__viewportCleanup = function() {

            TOP.removeEventListener('resize', _queueViewportDraw);

            if (_vv) {

                _vv.removeEventListener('resize', _queueViewportDraw);

                _vv.removeEventListener('scroll', _queueViewportDraw);

            }

            if (_viewportFrame) TOP.cancelAnimationFrame(_viewportFrame);

            _viewportFrame = 0;

        };

        _installAudioHook();

        eng.ui.push(drawShell);

        drawShell();

        if (eng._floatingProgressTimer) {

            try {

                TOP.clearInterval(eng._floatingProgressTimer);

            } catch (e) {}

        }

        eng._floatingProgressTimer = TOP.setInterval(function() {

            try {

                var sh = TOP.__vnmRadioShellEl;

                if (sh && sh.__tick) sh.__tick();

            } catch (e) {}

        }, 600);

        return shell;

    }

    if (cfg.radioEnabled === false || cfg.radioEnabled === 'false') {

        root.textContent = '电台已停用。请在设置 → 电台设置 里打开「启用电台」。';

        return root;

    }

    var shell = ensureShell();



    function _detachCleanup() {

        _cleanupOrbLyrics();

        try { if (shell && shell.__viewportCleanup) shell.__viewportCleanup(); } catch (e) {}

        var a = eng.ui.indexOf(shell.__draw);

        if (a >= 0) eng.ui.splice(a, 1);

        if (eng.backgroundPlayback === false) {

            try {

                if (shell && shell.parentNode) shell.parentNode.removeChild(shell);

            } catch (e) {}

            try {

                if (TOP.__vnmRadioShellEl === shell) TOP.__vnmRadioShellEl = null;

                if (eng._floatingProgressTimer) {

                    TOP.clearInterval(eng._floatingProgressTimer);

                    eng._floatingProgressTimer = null;

                }

            } catch (e) {}

            eng.stop();

        }

    }

    var detachTimer = TOP.setInterval(function() {

        if (!root.isConnected) {

            TOP.clearInterval(detachTimer);

            _detachCleanup();

        }

    }, 1000);

    root.addEventListener('pp-app-detach', function() {

        TOP.clearInterval(detachTimer);

        _detachCleanup();

    });

    return root;

})


/* __PAGECODE_END__ */

/* __POST_BEGIN__ */
{
  "injectEnabled": true
}
/* __POST_END__ */
