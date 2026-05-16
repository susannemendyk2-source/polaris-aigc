"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const NL = "\n";
const AUTO = "AI_AUTO / AI 自动逐镜设计";
const DEEPSEEK_V4_MODELS = ["deepseek-v4-flash", "deepseek-v4-pro"];
const BUILD_VERSION = "V6.7 RITUAL CINEMA SYSTEM · 北极星AIGC电影级工业系统 V6.7.1 · 电影工业仪式感 · 43模块完整版";
const LOCAL_STORAGE_KEY = "polaris_aigc_cinema_v6_6_1_workspace_store";
const ENGINEER_NAME = "Haley黄衍衔";
const ENGINEER_ROLE = "Chief Engineer / 总工程师";
const AUTH_SEAL_ID = "POLARIS-HYX-V6-RITUAL-AUTHENTIC-ENGINEER-SEAL";
const RITUAL_STAGES = ["Reading Script / 读取剧本", "Building Director Bible / 建立导演母版", "Planning Coverage / 规划镜头覆盖", "Checking Continuity / 检查连续性", "Writing Video Prompts / 生成视频提示词", "Creating Scene Image Prompts / 生成场景图提示词", "Final Review / 导演终审", "Locked / 封版完成"];

const DIRECTOR_STYLES = [
  { id: "standard", name: "Standard Modern Commercial / 现代商业通用", desc: "Clean, high-end commercial look. 现代商业质感、构图平衡、标准电影逻辑。", tags: "cinematic, high-end commercial, professional lighting, premium texture, 8k" },
  { id: "wong", name: "Wong Kar-wai / 王家卫", desc: "Moody neon, melancholic romance. 霓虹暧昧、抽帧模糊、高饱和、文艺对白。", tags: "Wong Kar-wai inspired, neon practicals, step-printing, heavy bokeh, melancholic romance" },
  { id: "nolan", name: "Christopher Nolan / 克里斯托弗·诺兰", desc: "IMAX scale, cold realism, tactile shadows. 胶片大画幅、冷峻硬朗、真实物理质感。", tags: "Christopher Nolan inspired, IMAX 70mm, practical effects, cold blue contrast, epic scale" },
  { id: "anderson", name: "Wes Anderson / 韦斯·安德森", desc: "Symmetry, pastel, theatrical blocking. 绝对对称、马卡龙色彩、舞台式调度。", tags: "Wes Anderson inspired, symmetrical composition, pastel palette, flat theatrical staging" },
  { id: "snyder", name: "Zack Snyder / 扎克·施耐德", desc: "Epic slow motion, high contrast, mythic energy. 去饱和、史诗慢动作、英雄神话感。", tags: "Zack Snyder inspired, mythic slow motion, high contrast, desaturated metallic palette" },
  { id: "fincher", name: "David Fincher / 大卫·芬奇", desc: "Precise camera, controlled dread, digital darkness. 精密镜头、压迫构图、冷绿暗调。", tags: "David Fincher inspired, controlled camera, green shadows, forensic detail, psychological tension" },
  { id: "villeneuve", name: "Denis Villeneuve / 丹尼斯·维伦纽瓦", desc: "Monumental scale, silence, dust and awe. 宏大尺度、极简对白、沙尘与神秘感。", tags: "Denis Villeneuve inspired, monumental scale, atmospheric dust, minimalism, existential sci-fi" },
  { id: "kurosawa", name: "Akira Kurosawa / 黑泽明", desc: "Weather, movement, moral conflict. 风雨调度、群像运动、强烈戏剧冲突。", tags: "Akira Kurosawa inspired, weather-driven drama, telephoto compression, dynamic blocking" },
  { id: "kubrick", name: "Stanley Kubrick / 斯坦利·库布里克", desc: "One-point perspective, sterile tension. 单点透视、冷峻秩序、压迫式空间。", tags: "Stanley Kubrick inspired, one-point perspective, geometric composition, eerie symmetry" },
  { id: "scorsese", name: "Martin Scorsese / 马丁·斯科塞斯", desc: "Urban kinetic camera, guilt, violence, voice. 都市疾速镜头、罪感、旁白与爆发力。", tags: "Martin Scorsese inspired, kinetic tracking, urban grit, moral chaos, energetic editing" },
  { id: "cameron", name: "James Cameron / 詹姆斯·卡梅隆", desc: "Spectacle, clarity, technology and emotion. 奇观清晰、技术驱动、情绪直给。", tags: "James Cameron inspired, technically precise spectacle, clean action geography, emotional clarity" },
  { id: "spielberg", name: "Steven Spielberg / 史蒂文·斯皮尔伯格", desc: "Wonder, human warmth, motivated camera. 奇观感、温暖人性、动机明确的镜头。", tags: "Steven Spielberg inspired, wonder, warm backlight, motivated camera, emotional blocking" },
];

const OPT = {
  models: DEEPSEEK_V4_MODELS,
  thinkingModes: ["enabled", "disabled"],
  reasoningEfforts: ["high", "max"],
  platforms: ["Runway Gen-3 / Runway 第三代", "Kling AI / 可灵", "Dreamina / 即梦", "Pika Art / Pika", "Luma Dream Machine / Luma", "Sora / Sora", "Veo / Google Veo"],
  ratios: ["2.39:1 Cinematic Scope / 电影宽银幕", "1.85:1 Theatrical / 标准院线画幅", "16:9 Landscape / 横屏视频", "9:16 Vertical / 竖屏短视频", "1:1 Square / 方形社媒画幅"],
  genres: ["Drama / 剧情片", "Sci-Fi / 科幻", "Fantasy / 奇幻", "Crime Thriller / 犯罪惊悚", "Romance / 爱情", "Action / 动作", "Horror / 恐怖", "Documentary / 纪录片", "Commercial / 商业广告", "Music Video / 音乐影像"],
  pacing: ["Slow Burn / 缓慢积累", "Poetic Fragmented / 诗性碎片", "Classical Three-Act / 经典三幕", "High Tension / 高压紧张", "Fast Cutting / 快节奏剪辑", "Dreamlike Flow / 梦境流动"],
  dialogueStyles: ["Naturalistic / 生活化自然对白", "Poetic / 诗性对白", "Minimal / 极简克制对白", "Noir Monologue / 黑色电影独白", "Commercial Tagline / 广告金句式", "Epic Mythic / 史诗宣言式"],
  productionModes: ["Film Short / 电影短片", "Product Commercial / 产品广告", "Brand Film / 品牌形象片", "Drama Trailer / 短剧预告", "Game Trailer / 游戏 PV", "Film Trailer / 电影预告", "E-commerce Video / 电商短视频", "Tourism Promo / 文旅宣传片", "Character Intro / 角色介绍片", "Music Video / 音乐影像"],
  versionModes: ["Cinematic / 电影感版本", "Douyin Viral / 抖音爆款版本", "Luxury Commercial / 广告高级感版本", "Dark Suspense / 黑暗悬疑版本", "Epic Heroic / 热血燃向版本", "Poetic Arthouse / 诗意文艺版本"],
  shotCounts: ["4", "6", "8", "10", "12", "16", "24", "36"],
  shotCountModes: ["Fixed Count / 固定数量", "Auto Director Count / 导演自动判断", "Range Count / 范围数量", "Minimum Coverage / 最低覆盖", "Smart Range / 智能范围"],
  shotRanges: ["6-10", "8-12", "10-16", "16-24", "24-36", "36-60"],
  videoDurations: ["15s", "30s", "60s", "90s", "3min", "5min"],
  shotDensities: ["Minimal / 极简电影感", "Balanced / 标准电影节奏", "Detailed / 细腻实拍覆盖", "Trailer Fast Cut / 预告片快切", "Commercial Punchy / 广告强节奏"],
  shotOptimizeModes: ["Strengthen Cinematic Realism / 强化电影实拍感", "Improve Continuity / 加强镜头连续性", "Improve Performance / 加强表演细节", "Improve Visual Prompt / 强化视频提示词", "Improve Scene Image Prompt / 强化场景图提示词"],
  coverageChecklist: ["Establishing Shot / 建立镜头", "Master Shot / 主镜头", "Character Entrance / 人物入场", "Spatial Geography / 空间交代", "Medium Coverage / 中景覆盖", "Close-Up / 情绪特写", "Insert Shot / 道具插入", "Reaction Shot / 反应镜头", "Turning Point / 转折镜头", "Climax Shot / 高潮镜头", "Resolution Shot / 收尾镜头", "Transition Shot / 转场镜头"],
  shotSizes: [AUTO, "Extreme Wide Shot / 超远景 EWS", "Wide Shot / 远景 WS", "Full Shot / 全景 FS", "Medium Shot / 中景 MS", "Medium Close-Up / 中近景 MCU", "Close-Up / 特写 CU", "Extreme Close-Up / 大特写 ECU", "Insert Shot / 插入特写", "Over-the-Shoulder / 过肩镜头 OTS", "POV Shot / 主观镜头"],
  lensFocals: [AUTO, "14mm Ultra Wide / 14mm 超广角", "18mm Wide / 18mm 广角", "24mm Wide / 24mm 广角", "35mm Natural / 35mm 自然视角", "50mm Standard / 50mm 标准镜头", "65mm Intimate / 65mm 亲密人像", "85mm Portrait / 85mm 人像", "100mm Macro / 100mm 微距", "135mm Telephoto / 135mm 长焦", "Anamorphic 40mm / 40mm 变形宽银幕"],
  cameras: [AUTO, "ARRI Alexa 35 / 阿莱 Alexa 35", "ARRI Alexa Mini LF / 阿莱 Mini LF 大画幅", "ARRI Alexa 65 / 阿莱 65 巨幕", "RED V-Raptor 8K VV / RED 红龙 8K VV", "Sony Venice 2 / 索尼 Venice 2", "Blackmagic URSA Cine 12K / BMD URSA Cine 12K", "DJI Ronin 4D / 大疆 Ronin 4D", "Phantom Flex 4K / Phantom 高速摄影机", "Vintage 35mm Film Camera / 复古 35mm 胶片机", "Virtual Production Volume / LED 虚拟制片棚"],
  moves: [AUTO, "Locked-Off Static / 固定静态", "Slow Push-In / 缓慢推进", "Slow Pull-Out / 缓慢拉远", "Dolly In / 轨道推进", "Dolly Out / 轨道后退", "Lateral Tracking / 横向跟拍", "Handheld Drift / 手持漂移", "Steadicam Follow / 斯坦尼康跟随", "Crane Up / 摇臂升起", "Crane Down / 摇臂下降", "Orbit / 环绕运镜", "Whip Pan / 快速甩摇", "Tilt Reveal / 俯仰揭示", "Rack Focus / 焦点转移", "Drone Flyover / 航拍飞越"],
  stabilizers: [AUTO, "Tripod / 三脚架", "Dolly Track / 轨道车", "Steadicam / 斯坦尼康", "Gimbal / 稳定器", "Handheld / 手持", "Crane / 摇臂", "Drone / 无人机", "Motion Control Rig / 机械臂动控"],
  lights: [AUTO, "Soft Studio Light / 柔和棚拍光", "Hard Light / 硬光", "High Key / 高调光", "Low Key / 低调光", "Rembrandt / 伦勃朗光", "Chiaroscuro / 明暗对照光", "Backlight Rim / 逆光轮廓光", "Golden Hour / 黄金时刻", "Blue Hour / 蓝调时刻", "Neon Practical / 霓虹实景光", "Volumetric / 体积光", "Firelight / 火光", "Moonlit Noir / 月光黑色电影光"],
  colors: ["Teal and Orange / 青橙对比", "Desaturated Noir / 去饱和黑色电影", "Kodak 2383 Print / 柯达 2383 胶片印片", "Fuji Eterna / 富士 Eterna 胶片感", "Bleach Bypass / 银残留高反差", "Pastel Candy / 马卡龙柔彩", "Cold Cyan Steel / 冷青钢铁色", "Warm Sepia Memory / 暖褐色回忆"],
  compositions: ["AI_AUTO / AI 自动构图", "Rule of Thirds / 三分法", "Center Framing / 中心构图", "Symmetry / 对称构图", "Negative Space / 留白构图", "Frame within Frame / 框中框", "Leading Lines / 引导线", "Low Angle Power / 低角度压迫", "High Angle Vulnerability / 高角度脆弱"],
  edits: ["AI_AUTO / AI 自动剪辑", "Hard Cut / 硬切", "Match Cut / 匹配剪辑", "Smash Cut / 突然硬切", "Dissolve / 叠化", "J-Cut / 声音先入", "L-Cut / 声音延后", "Montage / 蒙太奇", "Invisible Cut / 隐形剪辑"],
  sounds: ["AI_AUTO / AI 自动声音设计", "Designed Silence / 设计性静默", "Sparse Piano / 稀疏钢琴", "Low Drone / 低频氛围", "Foley Detail / 拟音细节", "Industrial Ambience / 工业环境声", "Orchestral Rise / 管弦乐推进", "Breath and Cloth / 呼吸与衣料摩擦", "Urban Texture / 城市场景声"],
  sceneImageModes: ["Storyboard / 分镜板", "Cinematic Still / 电影剧照", "Scene Concept Art / 场景概念图"],
  sceneImageUses: ["Storyboard Keyframe / 分镜关键帧", "Image-to-Video First Frame / 图生视频首帧", "Scene Concept Art / 场景概念图", "Cinematic Still / 电影剧照"],
  sceneImageRatios: ["16:9 Landscape / 横屏", "9:16 Vertical / 竖屏", "2.39:1 Scope / 电影宽银幕", "1:1 Square / 方形"],
  sceneImageModels: ["Universal / 通用图像模型", "Midjourney V6 / MJ V6", "Flux / SDXL / Flux或SDXL", "DALL·E 3 / DALL·E 3", "Dreamina / 即梦", "Kling Image-to-Video / 可灵图生视频首帧"],
  sceneImageBatchFormats: ["TXT Prompt Pack / TXT提示词包", "JSON Data / JSON数据", "CSV Table / CSV表格"],
  referenceUseModes: ["Reference Content Structure / 参考内容结构", "Reference Viral Rhythm / 参考爆款节奏", "Reference Visual Style / 参考视觉风格", "Reference Character Info / 参考人物信息", "Reference Mood Only / 只参考情绪氛围"],
  douyinVideoTypes: ["人物介绍 / Character Profile", "校园宣传 / Campus Promo", "招生宣传 / Enrollment Promo", "个人IP / Personal IP", "励志故事 / Inspirational Story", "剧情短片 / Narrative Short", "采访混剪 / Interview Montage", "反差人设 / Contrast Persona", "情绪共鸣 / Emotional Resonance"],
  viralHookStyles: ["3秒反差钩子 / 3s Contrast Hook", "悬念问题钩子 / Suspense Question Hook", "人物标签钩子 / Character Label Hook", "情绪共鸣钩子 / Emotional Resonance Hook", "高光成就钩子 / Highlight Achievement Hook", "冲突反转钩子 / Conflict Reversal Hook"],
  viralIntensities: ["Light / 轻度爆款", "Balanced / 平衡爆款", "Aggressive / 强爆款"],
  shortVideoDurations: ["30s以内 / Under 30s", "45s以内 / Under 45s", "60s以内 / Under 60s", "90s以内 / Under 90s"],
};

const DEFAULT_SCRIPT = "";
const DEFAULT_NEGATIVE = "low quality, blurry, distorted face, extra fingers, bad anatomy, inconsistent character, text watermark, logo, overexposed, underexposed, jitter, flicker";

const DEFAULT_MODULES = {
  character: { title: "Character Continuity", zh: "角色连续性", fields: { name: "AUTO_FROM_CURRENT_SCRIPT / 从当前剧本自动提取角色姓名", age: "AUTO_FROM_CURRENT_SCRIPT / 从当前剧本自动推断年龄", appearance: "AUTO_FROM_CURRENT_SCRIPT / 从当前剧本自动建立外貌特征", costumeLock: "AUTO_FROM_CURRENT_SCRIPT / 从当前剧本自动锁定服装连续性", hair: "AUTO_FROM_CURRENT_SCRIPT / 从当前剧本自动提取发型", facialMood: "AUTO_FROM_CURRENT_SCRIPT / 根据当前剧本情绪自动设计面部基调", bodyLanguage: "AUTO_FROM_CURRENT_SCRIPT / 根据当前剧本自动设计动作习惯", doNotChange: "只锁定当前剧本明确出现的角色特征，不得套用任何预设人物 / Only lock traits explicitly derived from the current script; never use preset characters" } },
  location: { title: "Location Continuity", zh: "场景连续性", fields: { mainLocation: "AUTO_FROM_CURRENT_SCRIPT / 从当前剧本自动提取主场景", timeOfDay: "AUTO_FROM_CURRENT_SCRIPT / 从当前剧本自动提取时间", weather: "AUTO_FROM_CURRENT_SCRIPT / 从当前剧本自动提取天气或环境状态", materials: "AUTO_FROM_CURRENT_SCRIPT / 从当前剧本自动提取空间材质", props: "AUTO_FROM_CURRENT_SCRIPT / 从当前剧本自动提取关键道具", environmentDetails: "AUTO_FROM_CURRENT_SCRIPT / 从当前剧本自动补全合理环境细节", locationLock: "只保持当前剧本中的场景锚点，不得套用旧影院、导演、胶片盒等预设 / Preserve only scene anchors from the current script; do not apply old-cinema/director/film-canister presets" } },
  continuity: { title: "Continuity Check", zh: "连续性检查", fields: { target: "基于当前剧本检查角色、场景、服装、道具、光影、情绪是否连续 / Check continuity based on the current script only", scoring: "每个镜头输出连续性风险与修正建议 / Output continuity risk and correction notes for each shot" } },
  rhythm: { title: "Narrative Rhythm", zh: "分镜节奏图", fields: { structure: "根据当前剧本自动选择 Opening → Build-up → Turning Point → Climax → Resolution 或其他适合结构 / Choose rhythm structure from the current script", beatRule: "每个镜头必须承担不同叙事功能，不能只是重复描述 / Every shot must have a distinct narrative purpose" } },
  blocking: { title: "Blocking", zh: "人物调度", fields: { rule: "根据当前剧本明确角色入画方向、站位、视线、前中后景关系 / Specify entrance, position, eyeline and spatial layers from the current script", preference: "人物运动必须服务当前剧本的心理变化，而不是套用预设动作 / Actor movement must serve the current script psychology" } },
  composition: { title: "Composition", zh: "构图逻辑", fields: { defaultLogic: "根据当前剧本情绪选择三分法、中心构图、留白、框中框、引导线、高低角度 / Choose composition from current script emotion", allowed: OPT.compositions.join(" | ") } },
  editing: { title: "Editing Language", zh: "剪辑语言", fields: { rhythm: "根据当前剧本节奏选择慢切、硬切、J-Cut、L-Cut、匹配剪辑、蒙太奇 / Choose edit language from current script rhythm", allowed: OPT.edits.join(" | ") } },
  sound: { title: "Sound Design", zh: "声音工业", fields: { ambience: "AUTO_FROM_CURRENT_SCRIPT / 根据当前剧本自动设计环境声", music: "AUTO_FROM_CURRENT_SCRIPT / 根据当前剧本自动设计音乐情绪", foley: "AUTO_FROM_CURRENT_SCRIPT / 根据当前剧本自动设计拟音细节", silence: "AUTO_FROM_CURRENT_SCRIPT / 根据当前剧本自动设计静默点" } },
  platform: { title: "Platform Prompt", zh: "平台适配", fields: { templateRule: "根据当前平台与当前剧本自动适配提示词，不套用固定示例 / Adapt prompt to selected platform and current script", universalPrompt: "同时输出通用版与当前平台优化版 / Output universal and selected-platform optimized prompts" } },
  frames: { title: "Omni Multi-Parameter", zh: "全能多参", fields: { omniParamRule: "每个镜头输出全能多参建议 / Output universal multi-parameter controls for every shot", motionStrength: "根据当前镜头动作自动设计动作强度、镜头运动强度、主体运动幅度、节奏速度 / Derive motion controls from current shot", consistencyControl: "根据当前剧本建立角色、场景、服装、道具、时间连续性 / Derive consistency controls from current script", generationParams: "时长、分辨率、帧率、种子策略、创意强度、提示词权重、负面权重 / duration, resolution, fps, seed strategy, creativity, prompt weight, negative weight", modelAdaptation: "按可灵、Runway、即梦、Pika、Luma、Sora、Veo 输出可调参数建议 / adjustable parameters for video models" } },
  commercial: { title: "Production Mode", zh: "商业实用模式", fields: { mode: "Film Short / 电影短片", goal: "让当前剧本既有电影质感，也适合 AI 视频实际生成 / Make the current script cinematic and practical for AI video", audience: "AUTO_FROM_CURRENT_SCRIPT / 根据当前剧本自动推断目标观众" } },
  versions: { title: "Multi-Version", zh: "一键多版本", fields: { selected: "Cinematic / 电影感版本", note: "在每个镜头输出多版本改写方向，但主版本必须忠于当前剧本 / Multi-version notes must remain faithful to current script" } },
  directorBible: { title: "Director Bible", zh: "导演母版", fields: { theme: "AUTO_FROM_CURRENT_SCRIPT / 从当前剧本提炼影片主题", directorIntent: "每个镜头必须服务当前剧本人物心理和观众感受 / Every shot must serve current script psychology and audience experience", visualMotif: "AUTO_FROM_CURRENT_SCRIPT / 从当前剧本提炼视觉母题", doNotDeviate: "不要生成漂亮但无叙事功能的镜头，不要偏离当前剧本大纲 / No beautiful but narratively empty shots; never deviate from current script" } },
  storyState: { title: "Story State Engine", zh: "故事状态引擎", fields: { trackingRule: "每个镜头必须记录角色位置、情绪、动作、道具、光线状态 / Track position, emotion, action, props and lighting state", carryOver: "下一镜头必须承接上一镜头结束动作与空间方向 / Next shot inherits previous ending action and screen direction", stateFormat: "Start State → Action Change → End State → Next Hook / 开始状态 → 动作变化 → 结束状态 → 下一镜钩子" } },
  shotDependency: { title: "Shot Dependency", zh: "镜头承接关系", fields: { previousLink: "明确上一镜头如何接入本镜头 / State how previous shot connects", actionStartEnd: "写出本镜头开始动作与结束动作 / Write action start and end", cutMotivation: "解释剪辑动机，不允许无动机跳切 / Explain cut motivation", nextHook: "每镜都必须留下下一镜头钩子 / Every shot leaves a next-shot hook" } },
  spatialMap: { title: "Spatial Geography Map", zh: "场景空间地图", fields: { geography: "根据当前剧本建立空间俯视关系 / Build top-down geography from current script", cameraMap: "说明摄影机站位、角色运动方向、前中后景关系 / Specify camera position and spatial layers", continuityRule: "保持空间方向一致，不随机换场 / Keep spatial direction consistent" } },
  axisEyeline: { title: "Axis & Eyeline Control", zh: "轴线与视线控制", fields: { axisRule: "遵守180度轴线，说明摄影机位于轴线哪一侧 / Obey 180-degree rule", eyeline: "保持角色视线方向和被看对象屏幕方向一致 / Maintain eyeline and screen direction", screenDirection: "记录角色移动方向：画面左/右、朝向/背向目标 / Track movement direction" } },
  performance: { title: "Performance Direction", zh: "表演指导", fields: { facialActing: "根据当前剧本输出眼神、停顿、微表情等 / Derive facial acting from current script", bodyActing: "根据当前剧本输出肩膀、手指、呼吸、脚步、重心变化 / Derive body acting from current script", lineDelivery: "台词必须包含说法：轻声、停顿、犹豫、压住情绪等 / Include line delivery details" } },
  realismLayer: { title: "Realism Layer", zh: "实拍细腻层", fields: { cameraImperfection: "轻微手持呼吸感、自然对焦漂移、曝光细微变化 / subtle camera breathing, focus drift, exposure changes", physicalTexture: "皮肤纹理、衣服褶皱、灰尘、玻璃反光、空气颗粒 / skin texture, fabric wrinkles, dust, reflections, particles", motionPhysics: "人物和摄影机运动必须有真实惯性 / physical inertia for characters and camera" } },
  lensGrammar: { title: "Lens Grammar Curve", zh: "焦段语法曲线", fields: { progression: "根据当前剧本情绪递进安排焦段 / Lens progression follows current script emotion", emotionalDistance: "每个焦段必须解释情绪距离 / Explain emotional distance", depthRule: "用景深变化引导观众注意力 / Use depth of field to guide attention" } },
  coveragePlan: { title: "Coverage Plan", zh: "导演覆盖拍法", fields: { structure: "根据当前剧本安排建立镜头、主镜头、中景、特写、插入、反应、转场 / Plan coverage from current script", coveragePurpose: "说明每个镜头在覆盖体系中的职责 / State coverage role", avoidRepetition: "避免连续多个镜头承担同一职责 / Avoid repetitive coverage" } },
  continuityInspectorPro: { title: "Continuity Inspector", zh: "连续性审片员", fields: { inspection: "生成后逐镜检查角色、服装、空间方向、动作承接、光线、道具、台词和节奏 / Inspect continuity after generation", correction: "发现跳轴、动作断裂、镜头重复时给出修正建议 / Provide correction notes", riskScore: "每镜输出连续性风险：Low / Medium / High / 每个镜头输出风险等级" } },
  sceneImagePromptModule: { title: "Scene Image Prompt", zh: "每镜头场景图提示词", fields: { keyframeRule: "为每个镜头提炼最有代表性的定格关键帧 / Extract the best frozen keyframe for every shot", stillPromptRule: "场景图提示词必须来自当前镜头，不得使用预设场景 / Still-image prompt must come from current shot, never presets", continuityAnchors: "保持当前剧本的角色、场景、服装、道具、空间方向一致 / Keep current script continuity anchors" } },
  sceneImageStudio: { title: "Scene Image Studio", zh: "场景图工作室", fields: { modelAdaptation: "支持 Universal、MJ、Flux/SDXL、DALL·E、即梦、可灵图生视频首帧 / Supports image model variants", batchExport: "支持 TXT、JSON、CSV 批量导出 / Batch export TXT, JSON, CSV", enhancement: "可通过 API 增强全部场景图提示词 / API enhancement for all scene image prompts" } },
  restoredV4Tools: { title: "Restored V4 Tools", zh: "V4功能恢复", fields: { apiDebug: "API 测试、接口调试台、实际模型显示 / API test, debug console, actual model display", generationHistory: "保留生成历史版本与一键回看 / generation history and recall", timeline: "分镜总览时间线、质量评分、导出与复制功能全部保留 / timeline, quality score, export and copy preserved" } },
  shotCountSystem: { title: "Smart Shot Count System", zh: "智能分镜数量系统", fields: { mode: "支持 Fixed / Auto Director / Range / Minimum Coverage / Smart Range / Supports multiple shot count modes", density: "根据镜头密度、时长和覆盖需求自动判断镜头数量 / Estimate shot count from density, duration and coverage", addMissing: "允许 AI 自动补充缺失镜头，避免漏掉建立镜头、反应镜头、插入镜头和收尾镜头 / Allow AI to add missing coverage shots", checklist: "生成后自动用 Coverage Checklist 检查是否缺镜头 / Run coverage checklist after generation" } },
  shotPlanner: { title: "Shot Planner", zh: "分镜规划器", fields: { diagnosis: "先诊断建议镜头数，再正式生成 / Diagnose recommended shot count before generating", structure: "输出建立、推进、转折、高潮、收尾的规划 / Plan opening, build-up, turning point, climax and resolution", flexibility: "当剧情复杂时允许在范围内增加镜头，并说明原因 / Allow extra shots within range when necessary" } },
  coverageChecklistModule: { title: "Coverage Checklist", zh: "镜头覆盖检查表", fields: { mustHave: "检查是否包含建立镜头、主镜头、特写、插入、反应、转折、收尾 / Ensure must-have coverage exists", autoFix: "若关键镜头缺失，可自动补镜头 / Auto-add missing shots if key coverage is absent" } },
  shotDensityControl: { title: "Shot Density Control", zh: "镜头密度控制", fields: { minimal: "极简电影感：少镜头、长呼吸 / Minimal cinematic density", balanced: "标准电影节奏：稳妥均衡 / Balanced coverage", detailed: "细腻实拍覆盖：更丰富更细节 / Detailed live-action coverage" } },
  durationDrivenPlanning: { title: "Duration-Driven Planning", zh: "时长驱动规划", fields: { timeRule: "根据目标视频时长控制镜头总数与平均时长 / Control shot count by target duration", pacingRule: "根据时长与密度自动分配镜头节奏 / Allocate pacing from duration and density" } },
  preflightShotPlanner: { title: "Preflight Shot Planner", zh: "正式生成前分镜规划", fields: { planFirst: "先生成可审核的分镜规划表，再按规划生成镜头 / Generate a reviewable shot plan before final shots", planColumns: "每行包含镜头职责、叙事节点、情绪、景别建议、是否必须 / Each row contains role, beat, emotion, shot type and required flag" } },
  autoCoverageRepair: { title: "Auto Coverage Repair", zh: "自动补缺镜头", fields: { inspect: "生成后检查是否缺建立、反应、插入、转折、收尾等镜头 / Inspect missing establishing, reaction, insert, turning, resolution shots", repair: "必要时自动补 Shot 05A / Shot 08A 这类补充镜头 / Add Shot 05A/08A style repair shots when needed" } },
  contextShotRegenerator: { title: "Context Shot Regenerator", zh: "带上下文单镜头重生成", fields: { previousNext: "重生成单镜头时读取上一镜头结束与下一镜头开始 / Regenerate one shot using previous and next context", protectContinuity: "只替换当前镜头，不破坏其他镜头 / Replace only current shot and preserve the rest" } },
  oneClickShotOptimizer: { title: "One-Click Shot Optimizer", zh: "一键优化当前镜头", fields: { modes: "电影实拍感、连续性、表演、视频提示词、场景图提示词 / Realism, continuity, performance, video prompt and scene image prompt modes", versioning: "优化前保存当前镜头版本，方便回退 / Save previous version before optimization" } },
  promptVersionCompare: { title: "Prompt Version Compare", zh: "提示词版本对比", fields: { history: "保存单镜头优化前后的版本 / Save before-after prompt versions", compare: "支持回看、恢复、对比提示词变化 / Allow reviewing, restoring and comparing prompt changes" } },
  referenceLinkIngest: { title: "Reference Link Ingest", zh: "参考链接识别", fields: { url: "支持微信视频号、抖音、小红书、B站、公众号、网页链接 / Supports WeChat Channels, Douyin, Xiaohongshu, Bilibili, articles and webpages", fallback: "如果链接因登录、权限或CORS无法读取，提示用户粘贴文案/简介/截图文字 / If blocked, ask for pasted copy, description or screenshot text", proxy: "优先调用 /api/link-ingest 后端代理，前端失败时降级为手动内容理解 / Prefer backend proxy and gracefully fall back" } },
  referenceUnderstanding: { title: "Reference Understanding", zh: "参考内容理解", fields: { extraction: "提取标题、主题、人物、风格、关键词、叙事结构、爆点节奏 / Extract title, topic, people, style, keywords, narrative structure and viral rhythm", uncertainty: "明确可用信息与不确定信息，禁止把未读取到的真实人物履历编成事实 / Separate usable and uncertain info; never fabricate real-person facts", application: "将参考内容转化为脚本大纲、分镜、场景图和短视频策略 / Apply reference to outline, shots, still prompts and short-video strategy" } },
  douyinViralEngine: { title: "Douyin Viral Engine", zh: "抖音爆款短视频思维", fields: { hook: "3秒钩子、反差、人设标签、悬念问题 / 3-second hook, contrast, persona label, suspense question", retention: "完播率结构、节奏断点、信息密度、字幕金句 / retention structure, rhythm breaks, info density, subtitle punchlines", conversion: "封面标题、评论引导、转发理由、记忆点收尾 / cover title, comment trigger, share reason, memorable ending" } },
  oneMinuteShortVideo: { title: "1-Minute Short Video Structure", zh: "1分钟短视频结构", fields: { timeline: "0-3秒黄金钩子，3-10秒悬念，10-25秒故事推进，25-40秒反差高光，40-52秒情绪升华，52-60秒金句收尾 / 0-3s hook, 3-10s suspense, 10-25s story, 25-40s contrast, 40-52s emotion, 52-60s CTA", script: "输出逐秒脚本、画面、台词、字幕、音效和转场 / Output second-by-second script, visuals, dialogue, subtitles, sound and transitions", safety: "人物介绍必须基于提供资料，不编造身份、荣誉、经历 / Character profiles must be based on provided facts" } },
  oneClickProduction: { title: "One-Click Production", zh: "一键完整流程", fields: { flow: "自动执行参考链接识别、剧本大纲、分镜规划、正式分镜与质量检查 / Auto-run reference analysis, outline, shot plan, final shots and quality check", beginner: "降低新手操作成本 / Reduce beginner friction" } },
  profileFactSheet: { title: "Real Person Fact Sheet", zh: "人物介绍事实补充表", fields: { facts: "姓名、学校、专业、身份标签、真实经历、荣誉与禁编信息 / name, school, major, persona labels, verified experience, awards and do-not-invent facts", safety: "人物介绍必须基于用户确认资料，不得编造履历 / real-person profiles must be grounded in user-provided facts" } },
  qualityInspector: { title: "Quality Inspector Report", zh: "质量检查报告", fields: { check: "检查分镜数量、镜头覆盖、跳轴、重复、台词、钩子、时长和连续性 / inspect count, coverage, axis, repetition, dialogue, hook, duration and continuity", action: "给出可执行修复建议 / provide actionable fixes" } },
  proxyRoutePack: { title: "Proxy Route Pack", zh: "后端代理路由包", fields: { deepseek: "提供 /api/deepseek 路由模板保护 API Key / route template protects API key", linkIngest: "提供 /api/link-ingest 路由模板辅助读取链接 / route template assists link ingestion" } },
  uxModeControl: { title: "UX Mode Control", zh: "用户模式控制", fields: { modes: "Beginner / Pro / Director 三种体验提示 / three workflow modes", status: "每个流程节点显示完成状态 / each workflow step shows completion state" } },
};

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function safeName(s) { return String(s || "Polaris").replace(/[/:*?"<>|]/g, "_").slice(0, 80); }
function downloadTextFile(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function csvCell(value) { return `"${String(value ?? "").replaceAll('"', '""')}"`; }
function getBi(v, fallback = "") {
  if (!v) return { zh: fallback, en: fallback };
  if (typeof v === "string") return { zh: v, en: v };
  return { zh: v.zh || v.cn || v.chinese || fallback, en: v.en || v.english || fallback };
}
function cleanJsonText(text) {
  const t = String(text || "").replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  return a >= 0 && b > a ? t.slice(a, b + 1) : t;
}
function parseAIJson(text, fallback = null) {
  const cleaned = cleanJsonText(text);
  const attempts = [
    cleaned,
    cleaned.replace(/,\s*([}\]])/g, "$1"),
    cleaned.replace(/[\u0000-\u001F]+/g, " ").replace(/,\s*([}\]])/g, "$1"),
  ];
  for (const candidate of attempts) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object") return parsed;
    } catch (_) {}
  }
  if (fallback !== null) return fallback;
  throw new Error("AI returned invalid JSON / AI 返回的 JSON 格式不完整，请重试或降低一次生成数量");
}
async function safeCopyText(value) {
  const text = String(value || "");
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    throw new Error("Clipboard API unavailable");
  } catch (_) {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand("copy");
      return true;
    } catch (err) {
      window.prompt("Copy manually / 请手动复制", text);
      return false;
    } finally {
      document.body.removeChild(el);
    }
  }
}
function scriptFingerprint(script) {
  let hash = 0;
  const s = String(script || "");
  for (let i = 0; i < s.length; i += 1) hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
  return `${s.length}_${Math.abs(hash)}`;
}

function makeArchiveId(project = "POLARIS") {
  const ymd = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const fp = scriptFingerprint(project).split("_").pop().slice(0, 6).toUpperCase();
  return `POLARIS-HYX-${ymd}-${fp}`;
}
function getRitualStage(progress = 0) {
  const idx = Math.min(RITUAL_STAGES.length - 1, Math.max(0, Math.floor((Math.max(0, Math.min(100, Number(progress) || 0)) / 100) * RITUAL_STAGES.length)));
  return { idx, label: RITUAL_STAGES[idx] };
}
function parseRange(range) {
  const m = String(range || "").match(/(\d+)\s*-\s*(\d+)/);
  if (!m) return { min: 8, max: 16 };
  return { min: Number(m[1]), max: Number(m[2]) };
}
function estimateShotPlan(tech, script = "") {
  const mode = tech.shotCountMode || "Smart Range / 智能范围";
  const densityMap = {
    "Minimal / 极简电影感": 0.8,
    "Balanced / 标准电影节奏": 1,
    "Detailed / 细腻实拍覆盖": 1.25,
    "Trailer Fast Cut / 预告片快切": 1.5,
    "Commercial Punchy / 广告强节奏": 1.3,
  };
  const durationBase = { "15s": 4, "30s": 7, "60s": 11, "90s": 15, "3min": 24, "5min": 36 };
  const complexityBoost = Math.min(8, Math.floor(String(script || "").length / 180));
  const density = densityMap[tech.shotDensity] || 1;
  const durationBaseCount = Math.round((durationBase[tech.videoDuration] || 11) * density) + complexityBoost;
  const coverageNeed = Math.max(0, (tech.minimumCoverage || []).length - 6);
  let min = 0, max = 0, target = 0, modeKey = mode;
  if (modeKey.includes("Fixed Count")) {
    target = Number(tech.shotCount || 8);
    min = max = target;
  } else if (modeKey.includes("Range Count")) {
    const r = parseRange(tech.shotRange); min = r.min; max = r.max; target = Math.max(min, Math.min(max, Math.round((min + max) / 2 + complexityBoost / 2)));
  } else if (modeKey.includes("Minimum Coverage")) {
    min = Math.max(8, (tech.minimumCoverage || []).length);
    max = min + Math.max(4, Math.round(min * 0.6));
    target = Math.min(max, min + Math.ceil(coverageNeed / 2) + 2);
  } else if (modeKey.includes("Auto Director Count")) {
    target = Math.max(4, durationBaseCount);
    min = Math.max(4, target - 2);
    max = target + 4;
  } else {
    const r = parseRange(tech.shotRange || "8-16");
    min = r.min; max = r.max;
    target = Math.max(min, Math.min(max + (tech.allowAddMissingShots ? 4 : 0), durationBaseCount));
    if (target > max && !tech.allowAddMissingShots) target = max;
  }
  const allowExtra = Boolean(tech.allowAddMissingShots);
  const extraCap = allowExtra ? Math.max(max, target) : max;
  const finalMax = allowExtra && modeKey.includes("Smart Range") ? extraCap : max;
  const summaryZh = modeKey.includes("Fixed")
    ? `固定生成 ${target} 个镜头。`
    : modeKey.includes("Range") || modeKey.includes("Smart")
      ? `建议在 ${min}-${finalMax} 个镜头内生成，目标约 ${target} 个镜头；若覆盖不足可自动补镜头。`
      : modeKey.includes("Minimum")
        ? `基于最低覆盖清单，至少 ${min} 个镜头，建议约 ${target}-${max} 个镜头。`
        : `根据时长 ${tech.videoDuration} 与密度 ${tech.shotDensity}，建议约 ${target} 个镜头（范围 ${min}-${max}）。`;
  const summaryEn = modeKey.includes("Fixed")
    ? `Generate exactly ${target} shots.`
    : modeKey.includes("Range") || modeKey.includes("Smart")
      ? `Generate within ${min}-${finalMax} shots, targeting about ${target}; AI may add missing coverage shots if needed.`
      : modeKey.includes("Minimum")
        ? `Based on minimum coverage, use at least ${min} shots and preferably around ${target}-${max}.`
        : `From duration ${tech.videoDuration} and density ${tech.shotDensity}, recommend about ${target} shots (range ${min}-${max}).`;
  return { mode, min, max: finalMax, target, allowExtra, summaryZh, summaryEn };
}
function shotCountDirective(tech, script = "") {
  const plan = estimateShotPlan(tech, script);
  const coverage = (tech.minimumCoverage || []).join(" | ") || "None";
  if ((tech.shotCountMode || "").includes("Fixed Count")) return `SHOT COUNT MODE: Fixed Count. Generate exactly ${plan.target} shots.`;
  if ((tech.shotCountMode || "").includes("Range Count")) return `SHOT COUNT MODE: Range Count. Generate between ${plan.min} and ${plan.max} shots, target around ${plan.target}.`;
  if ((tech.shotCountMode || "").includes("Minimum Coverage")) return `SHOT COUNT MODE: Minimum Coverage. Ensure these coverage roles appear: ${coverage}. Use at least ${plan.min} shots and add more only if needed.`;
  if ((tech.shotCountMode || "").includes("Auto Director Count")) return `SHOT COUNT MODE: Auto Director Count. Based on duration ${tech.videoDuration} and density ${tech.shotDensity}, choose a director-appropriate count around ${plan.target} shots (acceptable range ${plan.min}-${plan.max}).`;
  return `SHOT COUNT MODE: Smart Range. Prefer ${plan.min}-${plan.max} shots, target around ${plan.target}. Coverage checklist: ${coverage}. ${tech.allowAddMissingShots ? "You may add necessary shots if key coverage is missing, but explain via narrativeFunction and coveragePlan." : "Do not exceed the range."}`;
}

function shotPlanRowsText(rows = []) {
  if (!Array.isArray(rows) || !rows.length) return "No preflight shot plan has been generated yet. / 尚未生成正式分镜规划表。";
  return rows.map((r, i) => [
    `#${r.shotNo || i + 1}`,
    `Role/职责: ${r.roleZh || r.role || ""} / ${r.roleEn || ""}`,
    `Beat/节点: ${r.beatZh || r.beat || ""} / ${r.beatEn || ""}`,
    `Emotion/情绪: ${r.emotionZh || r.emotion || ""} / ${r.emotionEn || ""}`,
    `Shot/镜头: ${r.shotType || r.shotSize || ""}`,
    `Required/必须: ${r.required === false ? "No" : "Yes"}`
  ].join(" | ")).join(NL);
}



function extractFirstUrl(text) {
  const m = String(text || "").match(/https?:\/\/[^\s，。；,;]+/i);
  return m ? m[0].trim() : "";
}
function summarizeReferenceForPrompt(ref) {
  if (!ref) return "No reference content supplied / 未提供参考内容";
  return [
    `Reference URL / 参考链接: ${ref.url || ""}`,
    `Status / 状态: ${ref.status || "manual"}`,
    `Use Mode / 参考用途: ${ref.useMode || ""}`,
    `Title / 标题: ${ref.title || ""}`,
    `Summary / 摘要: ${ref.summary || ""}`,
    `Keywords / 关键词: ${Array.isArray(ref.keywords) ? ref.keywords.join(", ") : (ref.keywords || "")}`,
    `Style / 风格: ${ref.style || ""}`,
    `Viral Rhythm / 爆款节奏: ${ref.viralRhythm || ""}`,
    `Usable Facts / 可用事实: ${ref.usableFacts || ""}`,
    `Uncertain Info / 不确定信息: ${ref.uncertainInfo || ""}`,
    `Manual Content / 手动补充内容: ${ref.manualContent || ""}`,
  ].join(NL);
}
function buildDouyinViralBrief(tech, viral) {
  if (!viral?.enabled) return "Douyin Viral Logic disabled / 未启用抖音爆款思维";
  return [
    "Douyin Viral Logic enabled / 已启用抖音爆款思维",
    `Video Type / 短视频类型: ${viral.videoType}`,
    `Hook Style / 钩子风格: ${viral.hookStyle}`,
    `Viral Intensity / 爆款强度: ${viral.intensity}`,
    `Target Duration / 目标时长: ${viral.duration}`,
    "Required structure / 必须结构: 0-3s golden hook, 3-10s suspense, 10-25s story progression, 25-40s contrast/highlight, 40-52s emotional lift, 52-60s punchline/CTA.",
    "Must include / 必须包含: cover title, 3s hook, subtitle punchlines, rhythm breaks, comment trigger, share reason and retention logic.",
    "Real-person rule / 真人规则: do not fabricate identity, awards, background, school role, achievements or personal history without supplied evidence.",
  ].join(NL);
}

function apiNeedsKey(apiMode, apiKey) {
  return apiMode === "direct" && !String(apiKey || "").trim();
}
function classifyApiError(error) {
  const raw = String(error?.message || error || "");
  const lower = raw.toLowerCase();
  if (lower.includes("401") || lower.includes("unauthorized") || lower.includes("invalid api key") || lower.includes("authentication")) {
    return {
      type: "API_KEY",
      title: "API Key 错误 / Invalid API Key",
      message: "密钥无效、过期或没有权限。请检查 DeepSeek API Key，或切换到 proxy 模式并确认 .env.local 已配置 DEEPSEEK_API_KEY。",
      fix: "Direct 模式：重新粘贴 sk- 开头的 Key；Proxy 模式：检查 app/api/deepseek/route.js 与 Vercel 环境变量。",
    };
  }
  if (lower.includes("402") || lower.includes("insufficient") || lower.includes("quota") || lower.includes("balance") || lower.includes("payment")) {
    return {
      type: "BALANCE",
      title: "余额或额度不足 / Insufficient Balance",
      message: "接口可能余额不足、额度用尽或账号受限。",
      fix: "请到 DeepSeek 控制台检查余额、用量限制和账单状态。",
    };
  }
  if (lower.includes("429") || lower.includes("rate limit") || lower.includes("too many")) {
    return {
      type: "RATE_LIMIT",
      title: "请求太频繁 / Rate Limited",
      message: "短时间内请求过多，模型正在限流。",
      fix: "等待 30-60 秒后重试，或减少一次生成的镜头数量。",
    };
  }
  if (lower.includes("json") || lower.includes("invalid") || lower.includes("unexpected token") || lower.includes("unterminated")) {
    return {
      type: "JSON",
      title: "JSON 解析失败 / JSON Parse Failed",
      message: "AI 返回内容不是完整 JSON，通常是一次生成字段太多或镜头数量太多导致。",
      fix: "减少镜头数量、切换 deepseek-v4-pro，或重新生成一次。",
    };
  }
  if (lower.includes("404") || lower.includes("not found")) {
    return {
      type: "ROUTE",
      title: "接口路径不存在 / API Route Not Found",
      message: "可能没有配置 app/api/deepseek/route.js 或 app/api/link-ingest/route.js。",
      fix: "确认 ZIP 里的 route 文件已改名为 route.js 并放到对应目录。",
    };
  }
  if (lower.includes("network") || lower.includes("failed to fetch") || lower.includes("cors")) {
    return {
      type: "NETWORK",
      title: "网络或跨域错误 / Network or CORS Error",
      message: "浏览器无法连接接口，可能是网络、CORS、代理或部署配置问题。",
      fix: "推荐使用 proxy 模式，并检查本地/线上部署是否成功。",
    };
  }
  return {
    type: "UNKNOWN",
    title: "请求失败 / Request Failed",
    message: raw || "未知错误。",
    fix: "请查看 API Debug Console，或稍后重试。",
  };
}

function inferShotRole(shot = {}) {
  const hay = String([
    shot.narrativeFunctionZh, shot.narrativeFunctionEn,
    shot.coveragePlanZh, shot.coveragePlanEn,
    shot.titleZh, shot.titleEn, shot.shotSize, shot.sceneZh, shot.sceneEn
  ].join(" ")).toLowerCase();
  const rules = [
    { terms: ["establishing", "建立", "空间交代", "环境"], zh: "建立镜头", en: "Establishing" },
    { terms: ["master", "主镜头", "全局"], zh: "主镜头", en: "Master" },
    { terms: ["entrance", "入场", "出现"], zh: "人物入场", en: "Entrance" },
    { terms: ["insert", "插入", "道具", "细节"], zh: "插入镜头", en: "Insert" },
    { terms: ["reaction", "反应", "回应"], zh: "反应镜头", en: "Reaction" },
    { terms: ["turning", "转折", "反转"], zh: "转折镜头", en: "Turning Point" },
    { terms: ["climax", "高潮", "爆发"], zh: "高潮镜头", en: "Climax" },
    { terms: ["resolution", "收尾", "余韵", "结尾"], zh: "收尾镜头", en: "Resolution" },
    { terms: ["close", "特写", "情绪"], zh: "情绪特写", en: "Close-up" },
  ];
  const found = rules.find(r => r.terms.some(t => hay.includes(t.toLowerCase())));
  return found || { zh: "叙事推进", en: "Narrative" };
}
function personFactsText(facts = {}) {
  const rows = [
    ["Name / 姓名", facts.name],
    ["School / 学校", facts.school],
    ["Major or Department / 专业或部门", facts.major],
    ["Identity Labels / 身份标签", facts.identity],
    ["Verified Experiences / 真实经历", facts.experience],
    ["Awards or Honors / 荣誉奖项", facts.awards],
    ["Highlights / 高光事件", facts.highlights],
    ["Do Not Invent / 禁止编造", facts.doNotInvent],
  ];
  return rows.map(([k, v]) => `${k}: ${v || ""}`).join(NL);
}
function localQualityReport(shots = [], tech = {}, douyinViral = {}) {
  const count = shots.length;
  const has = (terms) => shots.some(s => terms.some(t => String([s.narrativeFunctionZh, s.narrativeFunctionEn, s.coveragePlanZh, s.coveragePlanEn, s.shotSize, s.titleZh, s.titleEn].join(" ")).toLowerCase().includes(t.toLowerCase())));
  const checks = [
    { key: "count", ok: count > 0, zh: count ? `已生成 ${count} 个镜头。` : "尚未生成镜头。", en: count ? `${count} shots generated.` : "No shots generated yet." },
    { key: "establishing", ok: has(["establishing", "建立", "空间"]), zh: "建立镜头 / 空间交代", en: "Establishing coverage" },
    { key: "closeup", ok: has(["close", "特写", "情绪"]), zh: "情绪特写", en: "Emotional close-up" },
    { key: "insert", ok: has(["insert", "插入", "道具"]), zh: "道具插入镜头", en: "Insert shot" },
    { key: "reaction", ok: has(["reaction", "反应"]), zh: "角色反应镜头", en: "Reaction shot" },
    { key: "resolution", ok: has(["resolution", "收尾", "余韵"]), zh: "收尾 / 余韵镜头", en: "Resolution shot" },
    { key: "douyin", ok: !douyinViral.enabled || count <= 24, zh: "抖音节奏控制", en: "Douyin pacing control" },
  ];
  const missing = checks.filter(c => !c.ok).map(c => c.zh);
  return {
    score: Math.max(55, Math.min(98, 72 + checks.filter(c => c.ok).length * 4 + (count >= 6 ? 6 : 0))),
    summaryZh: missing.length ? `建议补强：${missing.join("、")}` : "基础覆盖完整，分镜结构较稳定。",
    summaryEn: missing.length ? `Recommended fixes: ${missing.join(", ")}` : "Basic coverage is complete and the storyboard structure is stable.",
    checks,
    missing,
  };
}

function resolveScriptOverride(scriptOverride, fallbackScript) {
  const isEventObject = scriptOverride && typeof scriptOverride === "object" && (
    "nativeEvent" in scriptOverride ||
    "preventDefault" in scriptOverride ||
    ("target" in scriptOverride && "currentTarget" in scriptOverride)
  );
  return String(isEventObject ? fallbackScript : (scriptOverride ?? fallbackScript)).trim();
}

function moduleText(modules, script = "") {
  const authority = [
    "## CURRENT SCRIPT AUTHORITY / 当前剧本最高优先级",
    `SCRIPT_FINGERPRINT: ${scriptFingerprint(script)}`,
    "All modules below are RULES and CHECKLISTS only. They are NOT story content. / 以下模块只是规则与检查表，不是故事内容。",
    "If any module field conflicts with the current script, ignore that field and follow the current script. / 如果模块字段与当前剧本冲突，必须忽略模块字段并以当前剧本为准。",
  ].join(NL);
  return [authority, ...Object.entries(modules).map(([_, m]) => `## ${m.title} / ${m.zh}${NL}${Object.entries(m.fields).map(([fk, fv]) => `${fk}: ${fv}`).join(NL)}`)].join(`${NL}${NL}`);
}
function pick(raw, keys, fallback = "") { for (const k of keys) if (raw?.[k]) return raw[k]; return fallback; }
function normalizeShot(raw, i) {
  const bi = (keys, fallback = "") => getBi(pick(raw, keys), fallback);
  const scene = bi(["scene", "visual", "visualContent"]);
  const dialogue = bi(["dialogue", "lines"], "（无对白）");
  const av = bi(["avLogic", "logic"]);
  const sound = bi(["soundDesign", "sound"]);
  const trans = bi(["transition", "editingTransition"]);
  const blocking = bi(["blocking", "actorBlocking"]);
  const comp = bi(["composition", "compositionLogic"]);
  const omni = bi(["omniParamPrompt", "omniParams", "multiParameterPrompt", "universalParams"]);
  const platform = bi(["platformPrompt", "platformOptimizedPrompt"]);
  const cont = bi(["continuityCheck", "continuityRisk"]);
  const ver = bi(["versionNotes", "multiVersionNotes"]);
  const storyState = bi(["storyState", "storyStateEngine", "stateEngine"]);
  const previousShotLink = bi(["previousShotLink", "prevShotLink", "previousLink"]);
  const actionStart = bi(["actionStart", "startAction"]);
  const actionEnd = bi(["actionEnd", "endAction"]);
  const nextShotHook = bi(["nextShotHook", "nextHook"]);
  const cutMotivation = bi(["cutMotivation", "editMotivation"]);
  const spatialGeography = bi(["spatialGeography", "spatialMap", "geographyMap"]);
  const axisEyeline = bi(["axisEyeline", "axisAndEyeline", "eyelineControl"]);
  const performanceDirection = bi(["performanceDirection", "performance", "actingDirection"]);
  const realismLayer = bi(["realismLayer", "realisticDetails", "liveActionLayer"]);
  const lensGrammar = bi(["lensGrammar", "lensGrammarCurve", "lensProgression"]);
  const coveragePlan = bi(["coveragePlan", "coverage", "coverageRole"]);
  const continuityInspector = bi(["continuityInspector", "continuityInspectorPro", "directorReview"]);
  const keyframeMoment = bi(["keyframeMoment", "keyFrameMoment", "sceneKeyframe"]);
  const sceneImagePrompt = bi(["sceneImagePrompt", "sceneStillPrompt", "sceneVisualPrompt"]);
  const sceneImageNegative = bi(["sceneImageNegative", "sceneNegativePrompt", "imageNegativePrompt"]);
  const sceneImageContinuityNotes = bi(["sceneImageContinuityNotes", "sceneContinuityNotes", "imageContinuityNotes"]);
  const coverageRole = bi(["coverageRole", "shotRole", "coverageFunction"]);
  const shotPlanReason = bi(["shotPlanReason", "shotPlanningReason", "planningReason"]);
  const missingCoverageFix = bi(["missingCoverageFix", "coverageRepairNote", "repairNote"]);
  const prompt = bi(["prompt", "videoPrompt", "aiPrompt"]);

  return {
    id: Number(raw.id) || i + 1,
    titleZh: raw.titleZh || raw.title?.zh || `镜头 ${i + 1}`,
    titleEn: raw.titleEn || raw.title?.en || `Shot ${i + 1}`,
    emotionalBeatZh: raw.emotionalBeatZh || raw.emotionalBeat?.zh || "情绪推进",
    emotionalBeatEn: raw.emotionalBeatEn || raw.emotionalBeat?.en || "Emotional progression",
    narrativeFunctionZh: raw.narrativeFunctionZh || raw.narrativeFunction?.zh || "推动叙事",
    narrativeFunctionEn: raw.narrativeFunctionEn || raw.narrativeFunction?.en || "Advance the narrative",
    sceneZh: raw.sceneZh || scene.zh,
    sceneEn: raw.sceneEn || scene.en,
    dialogueZh: raw.dialogueZh || dialogue.zh,
    dialogueEn: raw.dialogueEn || dialogue.en,
    avLogicZh: raw.avLogicZh || av.zh,
    avLogicEn: raw.avLogicEn || av.en,
    blockingZh: raw.blockingZh || blocking.zh,
    blockingEn: raw.blockingEn || blocking.en,
    compositionZh: raw.compositionZh || comp.zh,
    compositionEn: raw.compositionEn || comp.en,
    soundDesignZh: raw.soundDesignZh || sound.zh,
    soundDesignEn: raw.soundDesignEn || sound.en,
    transitionZh: raw.transitionZh || trans.zh,
    transitionEn: raw.transitionEn || trans.en,
    continuityCheckZh: raw.continuityCheckZh || cont.zh,
    continuityCheckEn: raw.continuityCheckEn || cont.en,
    omniParamPromptZh: raw.omniParamPromptZh || omni.zh,
    omniParamPromptEn: raw.omniParamPromptEn || omni.en,
    platformPromptZh: raw.platformPromptZh || platform.zh,
    platformPromptEn: raw.platformPromptEn || platform.en,
    versionNotesZh: raw.versionNotesZh || ver.zh,
    versionNotesEn: raw.versionNotesEn || ver.en,
    storyStateZh: raw.storyStateZh || storyState.zh,
    storyStateEn: raw.storyStateEn || storyState.en,
    previousShotLinkZh: raw.previousShotLinkZh || previousShotLink.zh,
    previousShotLinkEn: raw.previousShotLinkEn || previousShotLink.en,
    actionStartZh: raw.actionStartZh || actionStart.zh,
    actionStartEn: raw.actionStartEn || actionStart.en,
    actionEndZh: raw.actionEndZh || actionEnd.zh,
    actionEndEn: raw.actionEndEn || actionEnd.en,
    nextShotHookZh: raw.nextShotHookZh || nextShotHook.zh,
    nextShotHookEn: raw.nextShotHookEn || nextShotHook.en,
    cutMotivationZh: raw.cutMotivationZh || cutMotivation.zh,
    cutMotivationEn: raw.cutMotivationEn || cutMotivation.en,
    spatialGeographyZh: raw.spatialGeographyZh || spatialGeography.zh,
    spatialGeographyEn: raw.spatialGeographyEn || spatialGeography.en,
    axisEyelineZh: raw.axisEyelineZh || axisEyeline.zh,
    axisEyelineEn: raw.axisEyelineEn || axisEyeline.en,
    performanceDirectionZh: raw.performanceDirectionZh || performanceDirection.zh,
    performanceDirectionEn: raw.performanceDirectionEn || performanceDirection.en,
    realismLayerZh: raw.realismLayerZh || realismLayer.zh,
    realismLayerEn: raw.realismLayerEn || realismLayer.en,
    lensGrammarZh: raw.lensGrammarZh || lensGrammar.zh,
    lensGrammarEn: raw.lensGrammarEn || lensGrammar.en,
    coveragePlanZh: raw.coveragePlanZh || coveragePlan.zh,
    coveragePlanEn: raw.coveragePlanEn || coveragePlan.en,
    continuityInspectorZh: raw.continuityInspectorZh || continuityInspector.zh,
    continuityInspectorEn: raw.continuityInspectorEn || continuityInspector.en,
    keyframeMomentZh: raw.keyframeMomentZh || keyframeMoment.zh,
    keyframeMomentEn: raw.keyframeMomentEn || keyframeMoment.en,
    sceneImagePromptZh: raw.sceneImagePromptZh || sceneImagePrompt.zh,
    sceneImagePromptEn: raw.sceneImagePromptEn || sceneImagePrompt.en,
    sceneImageNegativeZh: raw.sceneImageNegativeZh || sceneImageNegative.zh,
    sceneImageNegativeEn: raw.sceneImageNegativeEn || sceneImageNegative.en,
    sceneImageContinuityNotesZh: raw.sceneImageContinuityNotesZh || sceneImageContinuityNotes.zh,
    sceneImageContinuityNotesEn: raw.sceneImageContinuityNotesEn || sceneImageContinuityNotes.en,
    coverageRoleZh: raw.coverageRoleZh || coverageRole.zh,
    coverageRoleEn: raw.coverageRoleEn || coverageRole.en,
    shotPlanReasonZh: raw.shotPlanReasonZh || shotPlanReason.zh,
    shotPlanReasonEn: raw.shotPlanReasonEn || shotPlanReason.en,
    missingCoverageFixZh: raw.missingCoverageFixZh || missingCoverageFix.zh,
    missingCoverageFixEn: raw.missingCoverageFixEn || missingCoverageFix.en,
    promptZh: raw.promptZh || prompt.zh,
    promptEn: raw.promptEn || prompt.en,
    shotSize: raw.shotSize || AUTO,
    camera: raw.camera || AUTO,
    lens: raw.lens || raw.lensFocal || AUTO,
    move: raw.move || raw.movement || AUTO,
    stabilizer: raw.stabilizer || AUTO,
    light: raw.light || raw.lighting || AUTO,
    colorScience: raw.colorScience || "Kodak 2383 Print / 柯达 2383 胶片印片",
    compositionType: raw.compositionType || "AI_AUTO / AI 自动构图",
    editType: raw.editType || "AI_AUTO / AI 自动剪辑",
    soundMode: raw.soundMode || "AI_AUTO / AI 自动声音设计",
    duration: raw.duration || "4-6s / 4-6 秒",
    status: "Ready / 就绪",
  };
}
function buildSceneImagePrompt(s, project, style, tech, negativePrompt) {
  const zhCore = s.sceneImagePromptZh || [
    `用途：${tech.sceneImageUse}`,
    `模式：${tech.sceneImageMode}`,
    `关键帧瞬间：${s.keyframeMomentZh || s.actionEndZh || s.sceneZh}`,
    `主体与场景：${s.sceneZh}`,
    `人物调度：${s.blockingZh}`,
    `构图逻辑：${s.compositionZh || s.compositionType}`,
    `光影：${s.light}`,
    `表演细节：${s.performanceDirectionZh}`,
    `实拍质感：${s.realismLayerZh}`,
    `连续性锚点：${s.sceneImageContinuityNotesZh || s.continuityCheckZh || s.storyStateZh}`,
    `导演风格：${style.name}`
  ].join("；");
  const enCore = s.sceneImagePromptEn || [
    `Use: ${tech.sceneImageUse}`,
    `Mode: ${tech.sceneImageMode}`,
    `Keyframe moment: ${s.keyframeMomentEn || s.actionEndEn || s.sceneEn}`,
    `Subject and environment: ${s.sceneEn}`,
    `Blocking: ${s.blockingEn}`,
    `Composition logic: ${s.compositionEn || s.compositionType}`,
    `Lighting: ${s.light}`,
    `Performance detail: ${s.performanceDirectionEn}`,
    `Live-action realism: ${s.realismLayerEn}`,
    `Continuity anchors: ${s.sceneImageContinuityNotesEn || s.continuityCheckEn || s.storyStateEn}`,
    `Director style: ${style.name}`
  ].join("; ");
  const zhNegative = s.sceneImageNegativeZh || `避免：${negativePrompt}`;
  const enNegative = s.sceneImageNegativeEn || `Avoid: ${negativePrompt}`;
  return [
    "【中文场景图提示词】",
    `项目：${project}`,
    `镜头：${s.titleZh}`,
    `用途：${tech.sceneImageUse}`,
    `模式：${tech.sceneImageMode}`,
    `画幅比例：${tech.sceneImageAspectRatio}`,
    `关键帧瞬间：${s.keyframeMomentZh || s.actionEndZh || s.sceneZh}`,
    `场景图提示词：${zhCore}`,
    `连续性说明：${s.sceneImageContinuityNotesZh || s.continuityCheckZh || s.storyStateZh}`,
    `负面提示词：${zhNegative}`,
    "",
    "[English Scene Image Prompt]",
    `Project: ${project}`,
    `Shot: ${s.titleEn}`,
    `Use: ${tech.sceneImageUse}`,
    `Mode: ${tech.sceneImageMode}`,
    `Aspect ratio: ${tech.sceneImageAspectRatio}`,
    `Keyframe moment: ${s.keyframeMomentEn || s.actionEndEn || s.sceneEn}`,
    `Scene image prompt: ${enCore}`,
    `Continuity notes: ${s.sceneImageContinuityNotesEn || s.continuityCheckEn || s.storyStateEn}`,
    `Negative prompt: ${enNegative}`,
  ].join(NL);
}


function buildSceneImageModelVariant(s, project, style, tech, negativePrompt) {
  const base = buildSceneImagePrompt(s, project, style, tech, negativePrompt);
  const model = tech.sceneImageModel || "Universal / 通用图像模型";
  const ratio = tech.sceneImageAspectRatio || "16:9 Landscape / 横屏";
  const stillCore = s.sceneImagePromptEn || s.sceneEn || "cinematic storyboard keyframe";
  if (model.includes("Midjourney")) {
    return `${base}${NL}${NL}[Midjourney V6 Optimized]${NL}${stillCore}, cinematic still, film grain, realistic lighting, strong composition, ${style.tags} --ar ${ratio.includes("9:16") ? "9:16" : ratio.includes("2.39") ? "239:100" : ratio.includes("1:1") ? "1:1" : "16:9"} --style raw --v 6${NL}--no ${negativePrompt}`;
  }
  if (model.includes("Flux") || model.includes("SDXL")) {
    return `${base}${NL}${NL}[Flux / SDXL Optimized]${NL}Positive prompt: ${stillCore}, cinematic realism, detailed skin texture, natural film lighting, realistic fabric, dust particles, consistent character, consistent scene, ${style.tags}${NL}Negative prompt: ${s.sceneImageNegativeEn || negativePrompt}${NL}Suggested settings: aspect ratio ${ratio}, CFG 4.5-7, steps 25-40, seed locked per character continuity.`;
  }
  if (model.includes("DALL")) {
    return `${base}${NL}${NL}[DALL·E 3 Optimized]${NL}Create a cinematic storyboard keyframe for ${project}. The image should show: ${stillCore}. Preserve character costume, props, lighting direction, spatial continuity and emotional tone. Avoid text, logos, watermarks and distorted anatomy.`;
  }
  if (model.includes("Dreamina") || model.includes("即梦")) {
    return `${base}${NL}${NL}[Dreamina / 即梦 Optimized]${NL}${s.sceneImagePromptZh || s.sceneZh}，电影剧照，真实光影，角色一致，场景一致，构图清晰，适合作为图生视频首帧。负面：${s.sceneImageNegativeZh || negativePrompt}`;
  }
  if (model.includes("Kling") || model.includes("可灵")) {
    return `${base}${NL}${NL}[Kling Image-to-Video First Frame Optimized]${NL}Use this as the first frame reference for image-to-video. Freeze the moment: ${s.keyframeMomentEn || s.actionStartEn || s.sceneEn}. Preserve screen direction, costume, props, eyeline and lighting. Leave visual room for the next action: ${s.actionEndEn || s.nextShotHookEn}.`;
  }
  return `${base}${NL}${NL}[Universal Image Model Variant]${NL}${stillCore}${NL}Negative: ${s.sceneImageNegativeEn || negativePrompt}`;
}
function buildSceneImagePromptPack(shots, project, style, tech, negativePrompt, format = "TXT Prompt Pack / TXT提示词包") {
  const prepared = shots.map((s, i) => ({ ...s, finalSceneImagePrompt: buildSceneImageModelVariant(s, project, style, tech, negativePrompt), index: i + 1 }));
  if (format.includes("JSON")) {
    return JSON.stringify(prepared.map(s => ({ shot: s.index, titleZh: s.titleZh, titleEn: s.titleEn, keyframeMomentZh: s.keyframeMomentZh, keyframeMomentEn: s.keyframeMomentEn, sceneImagePromptZh: s.sceneImagePromptZh, sceneImagePromptEn: s.sceneImagePromptEn, sceneImageNegativeZh: s.sceneImageNegativeZh, sceneImageNegativeEn: s.sceneImageNegativeEn, continuityZh: s.sceneImageContinuityNotesZh, continuityEn: s.sceneImageContinuityNotesEn, fullPrompt: s.finalSceneImagePrompt })), null, 2);
  }
  if (format.includes("CSV")) {
    const header = ["shot","titleZh","titleEn","keyframeMomentZh","keyframeMomentEn","sceneImagePromptZh","sceneImagePromptEn","negativeZh","negativeEn","continuityZh","continuityEn","fullPrompt"].map(csvCell).join(",");
    const rows = prepared.map(s => [s.index, s.titleZh, s.titleEn, s.keyframeMomentZh, s.keyframeMomentEn, s.sceneImagePromptZh, s.sceneImagePromptEn, s.sceneImageNegativeZh, s.sceneImageNegativeEn, s.sceneImageContinuityNotesZh, s.sceneImageContinuityNotesEn, s.finalSceneImagePrompt].map(csvCell).join(","));
    return [header, ...rows].join(NL);
  }
  return prepared.map(s => [`# Shot ${s.index} / ${s.titleZh} / ${s.titleEn}`, s.finalSceneImagePrompt].join(NL)).join(`${NL}${NL}---${NL}${NL}`);
}

function buildFinalPrompt(s, project, style, tech, modules, negativePrompt) {
  return [
    "【中文视频生成提示词】",
    `项目：${project}`,
    `制作模式：${modules.commercial.fields.mode}`,
    `镜头：${s.titleZh}`,
    `叙事功能：${s.narrativeFunctionZh}`,
    `情绪节点：${s.emotionalBeatZh}`,
    `画面内容：${s.sceneZh}`,
    `人物调度：${s.blockingZh}`,
    `构图逻辑：${s.compositionZh}`,
    `角色台词：${s.dialogueZh || "（无对白）"}`,
    `景别：${s.shotSize}`,
    `摄影机：${s.camera}`,
    `焦段：${s.lens}`,
    `运镜：${s.move}`,
    `稳定方式：${s.stabilizer}`,
    `光影：${s.light}`,
    `色彩科学：${s.colorScience}`,
    `声音设计：${s.soundDesignZh}`,
    `剪辑转场：${s.transitionZh}`,
    `故事状态引擎：${s.storyStateZh}`,
    `上一镜头承接：${s.previousShotLinkZh}`,
    `本镜头开始动作：${s.actionStartZh}`,
    `本镜头结束动作：${s.actionEndZh}`,
    `下一镜头钩子：${s.nextShotHookZh}`,
    `剪辑动机：${s.cutMotivationZh}`,
    `空间地图：${s.spatialGeographyZh}`,
    `轴线与视线：${s.axisEyelineZh}`,
    `表演指导：${s.performanceDirectionZh}`,
    `实拍细腻层：${s.realismLayerZh}`,
    `焦段语法曲线：${s.lensGrammarZh}`,
    `导演覆盖拍法：${s.coveragePlanZh}`,
    `连续性审片员：${s.continuityInspectorZh}`,
    `镜头覆盖职责：${s.coverageRoleZh}`,
    `分镜规划理由：${s.shotPlanReasonZh}`,
    `补镜头说明：${s.missingCoverageFixZh}`,
    `平台优化：${s.platformPromptZh}`,
    `全能多参：${s.omniParamPromptZh}`,
    `连续性检查：${s.continuityCheckZh}`,
    `多版本方向：${s.versionNotesZh}`,
    `关键帧瞬间：${s.keyframeMomentZh}`,
    `场景图提示词：${s.sceneImagePromptZh}`,
    `场景图连续性：${s.sceneImageContinuityNotesZh}`,
    `导演风格：${style.name}`,
    `输出平台：${tech.platform}`,
    `画幅比例：${tech.ratio}`,
    `负面提示词：${negativePrompt}`,
    "",
    "【English Video Generation Prompt】",
    `Project: ${project}`,
    `Production mode: ${modules.commercial.fields.mode}`,
    `Shot: ${s.titleEn}`,
    `Narrative function: ${s.narrativeFunctionEn}`,
    `Emotional beat: ${s.emotionalBeatEn}`,
    `Visual content: ${s.sceneEn}`,
    `Actor blocking: ${s.blockingEn}`,
    `Composition logic: ${s.compositionEn}`,
    `Dialogue: ${s.dialogueEn || "No dialogue"}`,
    `Shot size: ${s.shotSize}`,
    `Camera: ${s.camera}`,
    `Lens: ${s.lens}`,
    `Camera movement: ${s.move}`,
    `Stabilization: ${s.stabilizer}`,
    `Lighting: ${s.light}`,
    `Color science: ${s.colorScience}`,
    `Sound design: ${s.soundDesignEn}`,
    `Editing transition: ${s.transitionEn}`,
    `Story state engine: ${s.storyStateEn}`,
    `Previous shot link: ${s.previousShotLinkEn}`,
    `Action start: ${s.actionStartEn}`,
    `Action end: ${s.actionEndEn}`,
    `Next shot hook: ${s.nextShotHookEn}`,
    `Cut motivation: ${s.cutMotivationEn}`,
    `Spatial geography map: ${s.spatialGeographyEn}`,
    `Axis and eyeline control: ${s.axisEyelineEn}`,
    `Performance direction: ${s.performanceDirectionEn}`,
    `Realism layer: ${s.realismLayerEn}`,
    `Lens grammar curve: ${s.lensGrammarEn}`,
    `Coverage plan: ${s.coveragePlanEn}`,
    `Continuity inspector: ${s.continuityInspectorEn}`,
    `Coverage role: ${s.coverageRoleEn}`,
    `Shot planning reason: ${s.shotPlanReasonEn}`,
    `Missing coverage fix: ${s.missingCoverageFixEn}`,
    `Platform optimization: ${s.platformPromptEn}`,
    `Omni multi-parameter controls: ${s.omniParamPromptEn}`,
    `Continuity check: ${s.continuityCheckEn}`,
    `Multi-version notes: ${s.versionNotesEn}`,
    `Keyframe moment: ${s.keyframeMomentEn}`,
    `Scene image prompt: ${s.sceneImagePromptEn}`,
    `Scene image continuity: ${s.sceneImageContinuityNotesEn}`,
    `Director style: ${style.name}`,
    `Platform: ${tech.platform}`,
    `Aspect ratio: ${tech.ratio}`,
    `Negative prompt: ${negativePrompt}`,
    `Style tags: ${style.tags}`,
  ].join(NL);
}
function makeWord(shots, project, script, style, tech, modules) {
  const rows = shots.map(s => `<tr><td style="border:1px solid #ddd;padding:8px;font-weight:bold;">Shot ${s.id}<br/>${escapeHtml(s.titleZh)}<br/>${escapeHtml(s.titleEn)}</td><td style="border:1px solid #ddd;padding:8px;font-size:10px;"><b>景别:</b><br/>${escapeHtml(s.shotSize)}<br/><br/><b>摄影机:</b><br/>${escapeHtml(s.camera)}<br/><br/><b>焦段:</b><br/>${escapeHtml(s.lens)}<br/><br/><b>运镜:</b><br/>${escapeHtml(s.move)}<br/><br/><b>光影:</b><br/>${escapeHtml(s.light)}<br/><br/><b>时长:</b><br/>${escapeHtml(s.duration)}</td><td style="border:1px solid #ddd;padding:8px;"><b>画面 / Visual</b><br/>${escapeHtml(s.sceneZh)}<br/>${escapeHtml(s.sceneEn)}<br/><br/><b>调度 / Blocking</b><br/>${escapeHtml(s.blockingZh)}<br/>${escapeHtml(s.blockingEn)}<br/><br/><b>台词 / Dialogue</b><br/>${escapeHtml(s.dialogueZh)}<br/>${escapeHtml(s.dialogueEn)}</td><td style="border:1px solid #ddd;padding:8px;font-size:11px;"><b>视听逻辑 / AV Logic</b><br/>${escapeHtml(s.avLogicZh)}<br/>${escapeHtml(s.avLogicEn)}<br/><br/><b>全能多参 / Omni Multi-Parameter</b><br/>${escapeHtml(s.omniParamPromptZh)}<br/>${escapeHtml(s.omniParamPromptEn)}<br/><br/><b>导演连续性 / Director Continuity</b><br/>${escapeHtml(s.storyStateZh)}<br/>${escapeHtml(s.previousShotLinkZh)}<br/>${escapeHtml(s.actionStartZh)} → ${escapeHtml(s.actionEndZh)}<br/>${escapeHtml(s.nextShotHookZh)}<br/>${escapeHtml(s.spatialGeographyZh)}<br/>${escapeHtml(s.axisEyelineZh)}<br/>${escapeHtml(s.performanceDirectionZh)}<br/>${escapeHtml(s.realismLayerZh)}<br/>${escapeHtml(s.continuityInspectorZh)}<br/><br/><b>场景图提示词 / Scene Image Prompt</b><br/>${escapeHtml(s.keyframeMomentZh || "")}<br/>${escapeHtml(s.sceneImagePromptZh || "")}<br/>${escapeHtml(s.sceneImageNegativeZh || "")}<br/><br/><b>完整提示词 / Prompt</b><br/><div style="white-space:pre-wrap;color:#444;">${escapeHtml(s.finalPrompt || "")}</div><br/><br/><b>场景图完整提示词 / Full Scene Image Prompt</b><br/><div style="white-space:pre-wrap;color:#444;">${escapeHtml(s.finalSceneImagePrompt || "")}</div></td></tr>`).join("");
  const content = `<!doctype html><html><head><meta charset="UTF-8" /></head><body><h1 style="text-align:center;">${escapeHtml(project)} - 北极星AIGC电影级工业系统 V6.7.1 双语工业分镜表</h1><p><b>导演风格:</b> ${escapeHtml(style.name)} | <b>制作模式:</b> ${escapeHtml(modules.commercial.fields.mode)} | <b>平台:</b> ${escapeHtml(tech.platform)}</p><p><b>剧本大纲:</b> ${escapeHtml(script)}</p><table style="border-collapse:collapse;width:100%;font-size:11px;"><thead><tr style="background:#eee;"><th>镜头</th><th>技术参数</th><th>内容/调度/台词</th><th>逻辑/全能多参/提示词</th></tr></thead><tbody>${rows}</tbody></table><div style="margin-top:32px;padding:16px;border-top:2px solid #111;text-align:center;font-size:12px;"><b>Powered by 北极星AIGC电影级工业系统 V6.7.1.1</b><br/>Chief Engineer / 总工程师：${escapeHtml(ENGINEER_NAME)}<br/>Authentic Seal：${escapeHtml(AUTH_SEAL_ID)}</div></body></html>`;
  const blob = new Blob([content], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeName(project)}_Polaris_V6_Cinema_Industrial_Shooting_Script.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const GlassPanel = ({ children, title, subTitle, className = "", defaultOpen = false }) => {
  const titleText = String(title || "");
  const shouldOpen = defaultOpen || titleText.startsWith("01");
  if (!title) {
    return <div className={`rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl p-6 shadow-2xl ${className}`}>{children}</div>;
  }
  return (
    <details open={shouldOpen} className={`group rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden ${className}`}>
      <summary className="list-none cursor-pointer select-none px-6 py-5 border-b border-white/5 flex items-center justify-between gap-4 hover:bg-white/[0.03]">
        <div className="min-w-0">
          <h3 className="text-[12px] font-black uppercase tracking-[0.22em] text-amber-300">
            {title} <span className="text-stone-500 ml-2 text-[11px]">{subTitle}</span>
          </h3>
          <div className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-600">
            Click to expand / 点击展开或收起
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block h-1 w-8 rounded-full bg-amber-400/20" />
          <div className="h-9 w-9 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-amber-300 transition-transform duration-300 group-open:rotate-180">⌄</div>
        </div>
      </summary>
      <div className="p-6">
        {children}
      </div>
    </details>
  );
};
const FormField = ({ label, zh, children }) => <div className="space-y-2"><label className="text-[11px] font-black uppercase tracking-widest text-stone-500">{label} <span className="text-[13px] opacity-80 ml-1">{zh}</span></label>{children}</div>;
const normalizeControlValue = (value) => {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return value;
  return String(value);
};
const isEditableTarget = (target) => {
  const tag = String(target?.tagName || "").toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || Boolean(target?.isContentEditable) || Boolean(target?.closest?.("input, textarea, select, [contenteditable='true']"));
};
const Input = ({ className = "", value = "", onChange, onKeyDown, onInput, ...props }) => (
  <input
    {...props}
    value={normalizeControlValue(value)}
    onChange={e => onChange?.(e)}
    onInput={e => onInput?.(e)}
    onKeyDown={e => onKeyDown?.(e)}
    className={`w-full bg-black/70 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-stone-700 outline-none focus:border-amber-300/50 ${className}`}
  />
);
const TextArea = ({ className = "", value = "", onChange, onKeyDown, onInput, ...props }) => (
  <textarea
    {...props}
    value={normalizeControlValue(value)}
    onChange={e => onChange?.(e)}
    onInput={e => onInput?.(e)}
    onKeyDown={e => onKeyDown?.(e)}
    className={`w-full bg-black/70 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-stone-700 outline-none focus:border-amber-300/50 min-h-[100px] leading-relaxed ${className}`}
  />
);
const Select = ({ items = [], value, onChange }) => {
  const safeItems = Array.isArray(items) ? items : [];
  const safeValue = safeItems.includes(value) ? value : (value ?? safeItems[0] ?? "");
  return (
    <select
      value={safeValue}
      onChange={e => onChange?.(e.target.value)}
      disabled={!safeItems.length}
      className="w-full bg-black text-white border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none appearance-none cursor-pointer focus:border-amber-300/50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {safeItems.length ? safeItems.map(x => <option key={x} value={x} className="bg-black text-white">{x}</option>) : <option value="">No options / 暂无选项</option>}
    </select>
  );
};
const Toggle = ({ checked, onChange, label, zh }) => <button type="button" onClick={() => onChange(!checked)} className={`w-full rounded-2xl border px-5 py-3 text-left ${checked ? "bg-amber-400 border-amber-400 text-black" : "bg-black/70 border-white/10 text-stone-300"}`}><div className="text-[11px] font-black uppercase tracking-widest">{label}</div><div className="text-[11px] opacity-70 mt-1">{zh}</div></button>;
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return <button type="button" onClick={async () => {
    const value = text || "";
    try {
      if (navigator?.clipboard?.writeText) await navigator.clipboard.writeText(value);
      else throw new Error("Clipboard API unavailable");
      setCopied(true);
    } catch (_) {
      const el = document.createElement("textarea");
      el.value = value;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      try { document.execCommand("copy"); setCopied(true); } catch (err) { window.prompt("Copy manually / 请手动复制", value); }
      document.body.removeChild(el);
    }
    setTimeout(() => setCopied(false), 1200);
  }} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">{copied ? "Copied / 已复制" : "Copy / 复制"}</button>;
};

const ShotRoleBadge = ({ shot, active = false }) => {
  const role = inferShotRole(shot);
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${active ? "border-black/20 bg-black/15 text-black" : "border-amber-300/20 bg-amber-300/10 text-amber-200"}`}>{role.zh} · {role.en}</span>;
};

const BrandMark = ({ active = false, progress = 0 }) => {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, progress)) / 100) * circumference;
  return (
    <div className="relative h-16 w-16 shrink-0">
      <div className="absolute inset-0 rounded-[1.35rem] bg-gradient-to-br from-amber-200 via-yellow-500 to-stone-950 shadow-[0_0_38px_rgba(251,191,36,0.28)]" />
      <div className="absolute inset-[2px] rounded-[1.25rem] bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.38),rgba(255,255,255,0)_34%),linear-gradient(145deg,#1c1917,#050505_58%,#f59e0b)] border border-white/15 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 64 64" className="h-10 w-10 drop-shadow-[0_0_12px_rgba(251,191,36,0.45)]" aria-hidden="true">
          <path d="M32 5l5.9 20.1L58 32l-20.1 6.9L32 59l-5.9-20.1L6 32l20.1-6.9L32 5z" fill="url(#polarisGold)" />
          <path d="M32 18l2.8 9.2L44 32l-9.2 4.8L32 46l-2.8-9.2L20 32l9.2-4.8L32 18z" fill="#050505" opacity="0.88" />
          <circle cx="32" cy="32" r="3.6" fill="#fef3c7" />
          <defs>
            <linearGradient id="polarisGold" x1="10" y1="8" x2="54" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff7cc" />
              <stop offset="0.42" stopColor="#fbbf24" />
              <stop offset="1" stopColor="#92400e" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <svg className="absolute -inset-1 h-[72px] w-[72px] -rotate-90" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="none" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="rgba(251,191,36,0.95)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={active ? offset : circumference}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {active && <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.95)] animate-pulse" />}
    </div>
  );
};

const EngineerSeal = ({ compact = false }) => (
  <div className={compact ? "rounded-3xl border border-amber-300/25 bg-black/45 p-4 shadow-[0_0_50px_rgba(251,191,36,0.12)]" : "pointer-events-none fixed bottom-4 right-4 z-[80] hidden max-w-[280px] rounded-3xl border border-amber-300/25 bg-black/70 p-4 shadow-[0_0_60px_rgba(251,191,36,0.18)] backdrop-blur-2xl lg:block"}>
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-200 via-yellow-500 to-stone-950 text-black shadow-[0_0_28px_rgba(251,191,36,0.25)]">
        <span className="text-lg font-black">H</span>
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.8)]" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-200">Authentic Engineer Seal</div>
        <div className="mt-1 text-sm font-black text-white">Haley黄衍衔</div>
        <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">Chief Engineer / 总工程师</div>
      </div>
    </div>
    <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
      <div className="text-[9px] font-black uppercase tracking-[0.22em] text-stone-500">{AUTH_SEAL_ID}</div>
      <div className="mt-1 text-[10px] leading-5 text-stone-400">本网页由 {ENGINEER_NAME} 设计与总工程架构署名。</div>
    </div>
  </div>
);


const RitualOverlay = ({ ritual, onClose }) => {
  if (!ritual) return null;
  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/80 px-5 backdrop-blur-2xl">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-amber-300/25 bg-[#090807] p-8 shadow-[0_0_120px_rgba(251,191,36,0.22)]">
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="flex items-center gap-4">
          <BrandMark active progress={ritual.progress || 100} />
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.35em] text-amber-300">{ritual.kicker || "POLARIS RITUAL"}</div>
            <h3 className="mt-2 text-3xl font-black tracking-[0.04em] text-white">{ritual.title}</h3>
            <p className="mt-3 text-sm leading-7 text-stone-400">{ritual.message}</p>
          </div>
        </div>
        <div className="mt-7 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-200">Chief Engineer Seal / 总工程师认证</div>
          <div className="mt-2 text-xl font-black text-white">{ENGINEER_NAME}</div>
          <div className="mt-1 text-[11px] text-stone-500">{ENGINEER_ROLE} · {AUTH_SEAL_ID}</div>
        </div>
        <div className="mt-7 flex justify-end">
          <button onClick={onClose} className="rounded-2xl bg-amber-400 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-black hover:bg-amber-300">Continue / 继续</button>
        </div>
      </div>
    </div>
  );
};

const DigitalClapperboard = ({ open, project, workspaceMode, selectedModel, tech, style, onCancel, onAction }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[145] flex items-center justify-center bg-black/80 px-5 backdrop-blur-2xl">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-white/15 bg-[#080808] shadow-[0_0_120px_rgba(251,191,36,0.2)]">
        <div className="grid grid-cols-8 border-b border-white/15 bg-amber-400 text-black">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className={`h-10 ${i % 2 ? "bg-black/90" : "bg-amber-300"}`} />)}
        </div>
        <div className="p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.35em] text-amber-300">Digital Clapperboard / 数字场记板</div>
          <h3 className="mt-3 text-3xl font-black text-white">Ready to Roll / 准备开机</h3>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ["PROJECT", project || "Untitled Project"],
              ["MODE", workspaceMode || "director"],
              ["DURATION", tech?.videoDuration || tech?.shotCount || "-"],
              ["STYLE", style?.name || "-"],
              ["MODEL", selectedModel],
              ["CHIEF ENGINEER", ENGINEER_NAME],
            ].map(([k, v]) => <div key={k} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">{k}</div><div className="mt-2 text-sm font-black text-white">{v}</div></div>)}
          </div>
          <div className="mt-7 flex flex-wrap justify-end gap-3">
            <button onClick={onCancel} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10">Cancel / 取消</button>
            <button onClick={onAction} className="rounded-2xl bg-amber-400 px-7 py-3 text-[11px] font-black uppercase tracking-widest text-black hover:bg-amber-300">Clap & Generate / 打板生成</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DirectorCutReadyModal = ({ summary, onClose, onExport }) => {
  if (!summary) return null;
  return (
    <div className="fixed inset-0 z-[145] flex items-center justify-center bg-black/75 px-5 backdrop-blur-2xl">
      <div className="w-full max-w-xl rounded-[2.5rem] border border-emerald-300/25 bg-[#080908] p-8 shadow-[0_0_120px_rgba(16,185,129,0.18)]">
        <div className="text-[11px] font-black uppercase tracking-[0.35em] text-emerald-300">Director's Cut Ready / 导演剪辑版完成</div>
        <h3 className="mt-3 text-3xl font-black text-white">工业分镜方案已封版</h3>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            ["Shots / 镜头", summary.shotCount],
            ["Scene Prompts / 场景图", summary.scenePromptCount],
            ["Quality / 质量评分", summary.qualityScore],
            ["Risk / 连续性风险", summary.risk],
          ].map(([k, v]) => <div key={k} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">{k}</div><div className="mt-2 text-xl font-black text-white">{v}</div></div>)}
        </div>
        <div className="mt-5 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4">
          <div className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-200">Archive ID / 封存编号</div>
          <div className="mt-2 select-all text-sm font-black text-white">{summary.archiveId}</div>
          <div className="mt-1 text-[11px] text-stone-500">Chief Engineer: {ENGINEER_NAME}</div>
        </div>
        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10">View Shot Deck / 查看分镜台</button>
          <button onClick={onExport} className="rounded-2xl bg-emerald-400 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black hover:bg-emerald-300">Export Production Pack / 导出工业包</button>
        </div>
      </div>
    </div>
  );
};

const RitualStageBar = ({ progress = 0 }) => {
  const { idx } = getRitualStage(progress);
  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-black/45 p-4">
      <div className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-amber-200">Production Stages / 电影工业流程</div>
      <div className="grid grid-cols-1 gap-2">
        {RITUAL_STAGES.map((stage, i) => <div key={stage} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[11px] ${i <= idx ? "bg-amber-400/15 text-amber-100" : "bg-white/5 text-stone-600"}`}><span className={`h-2.5 w-2.5 rounded-full ${i <= idx ? "bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.8)]" : "bg-stone-700"}`} />{String(i + 1).padStart(2, "0")} · {stage}</div>)}
      </div>
    </div>
  );
};

const ProgressRing = ({ progress, size = 120, stroke = 9, label = "Generating" }) => {
  const pct = Math.max(0, Math.min(100, Math.round(progress || 0)));
  const center = size / 2;
  const radius = center - stroke - 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={center} cy={center} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#sidebarProgressGold)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
        <defs>
          <linearGradient id="sidebarProgressGold" x1="0" y1="0" x2={size} y2={size} gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff7cc" />
            <stop offset="0.5" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-[12%] rounded-full border border-white/10 bg-black/75 flex flex-col items-center justify-center shadow-[inset_0_0_28px_rgba(0,0,0,0.45)]">
        <div className="text-2xl font-black text-amber-300 tabular-nums">{pct}%</div>
        <div className="mt-1 text-[10px] font-black uppercase tracking-[0.24em] text-stone-500">{label}</div>
      </div>
    </div>
  );
};

const GenerationProgressSidebar = ({ progress, status, visible, onShow, onHide }) => {
  const pct = Math.max(0, Math.min(100, Math.round(progress || 0)));
  if (!visible) {
    return (
      <button
        type="button"
        onClick={onShow}
        className="fixed right-0 top-1/2 z-[100] -translate-y-1/2 rounded-l-3xl border border-amber-300/20 bg-[#090909]/95 px-3 py-4 shadow-[0_0_40px_rgba(251,191,36,0.16)] backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-300/20 bg-black/70 text-amber-300 font-black text-xs">{pct}%</div>
          <div className="text-left pr-1">
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200">Show Progress</div>
            <div className="mt-1 text-[11px] text-stone-400">显示进度环</div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <aside className="fixed right-4 top-1/2 z-[100] w-[320px] -translate-y-1/2 rounded-[2rem] border border-amber-300/20 bg-[#080807]/95 p-6 shadow-[0_0_80px_rgba(251,191,36,0.18)] backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-200">Generation Monitor</div>
          <div className="mt-1 text-sm font-bold text-white">AI 生成进度环</div>
        </div>
        <button
          type="button"
          onClick={onHide}
          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-stone-300 hover:bg-white/10"
        >
          Hide / 隐藏
        </button>
      </div>
      <div className="flex items-center gap-4">
        <ProgressRing progress={pct} size={118} stroke={9} />
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-black uppercase tracking-[0.18em] text-white">AI Directing</div>
          <div className="mt-2 text-sm leading-relaxed text-stone-400">{status}</div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 text-[11px] font-bold text-amber-300">{pct}% / 正在处理中</div>
        </div>
      </div>
      <RitualStageBar progress={pct} />
    </aside>
  );
};

export default function PolarisMasterOS() {
  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [project, setProject] = useState("追梦人之影 Shadow of Dreams");
  const [style, setStyle] = useState(DIRECTOR_STYLES[0]);
  const [shots, setShots] = useState([]);
  const [activeShot, setActiveShot] = useState(0);
  const [activeModule, setActiveModule] = useState("character");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [progressSidebarVisible, setProgressSidebarVisible] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [apiMode, setApiMode] = useState("direct");
  const [apiLog, setApiLog] = useState({ status: "idle", message: "No request yet / 暂无请求", lastModel: "", lastEndpoint: "", latencyMs: null, scriptFingerprint: "" });
  const [uiMode, setUiMode] = useState("Pro / 专业模式");
  const [apiConnected, setApiConnected] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState("");
  const [returnModeAfterApi, setReturnModeAfterApi] = useState("");
  const [proStep, setProStep] = useState("reference");
  const [directorView, setDirectorView] = useState("brief");
  const [directorInspectorTab, setDirectorInspectorTab] = useState("setup");
  const [isOneClickRunning, setIsOneClickRunning] = useState(false);
  const [qualityReport, setQualityReport] = useState(null);
  const [isCheckingQuality, setIsCheckingQuality] = useState(false);
  const [generationHistory, setGenerationHistory] = useState([]);
  const [shotPlanRows, setShotPlanRows] = useState([]);
  const [shotPlanDiagnosis, setShotPlanDiagnosis] = useState({ zh: "", en: "", recommendedCount: 0 });
  const [isPlanningShots, setIsPlanningShots] = useState(false);
  const [isRepairingCoverage, setIsRepairingCoverage] = useState(false);
  const [isRegeneratingShot, setIsRegeneratingShot] = useState(false);
  const [isOptimizingShot, setIsOptimizingShot] = useState(false);
  const [shotOptimizationMode, setShotOptimizationMode] = useState(OPT.shotOptimizeModes[0]);
  const [promptVersions, setPromptVersions] = useState([]);
  const [selectedModel, setSelectedModel] = useState(OPT.models[0]);
  const [thinkingMode, setThinkingMode] = useState(OPT.thinkingModes[0]);
  const [reasoningEffort, setReasoningEffort] = useState(OPT.reasoningEfforts[0]);
  const [status, setStatus] = useState("System Standby / 系统就绪 · Reference + Douyin Engine Ready");
  const [negativePrompt, setNegativePrompt] = useState(DEFAULT_NEGATIVE);
  const [ideaInput, setIdeaInput] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [referenceManualContent, setReferenceManualContent] = useState("");
  const [referenceIngest, setReferenceIngest] = useState({ status: "idle", title: "", summary: "", keywords: [], style: "", viralRhythm: "", usableFacts: "", uncertainInfo: "" });
  const [isIngestingReference, setIsIngestingReference] = useState(false);
  const [referenceUseMode, setReferenceUseMode] = useState(OPT.referenceUseModes[1]);
  const [douyinViral, setDouyinViral] = useState({ enabled: true, videoType: OPT.douyinVideoTypes[0], hookStyle: OPT.viralHookStyles[0], intensity: OPT.viralIntensities[1], duration: OPT.shortVideoDurations[2] });
  const [personFacts, setPersonFacts] = useState({ name: "", school: "", major: "", identity: "", experience: "", awards: "", highlights: "", doNotInvent: "" });
  const [outlineDraft, setOutlineDraft] = useState("");
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [sceneImageBatchFormat, setSceneImageBatchFormat] = useState(OPT.sceneImageBatchFormats[0]);
  const [isEnhancingSceneImages, setIsEnhancingSceneImages] = useState(false);
  const [creativeBrief, setCreativeBrief] = useState({ genre: OPT.genres[0], pacing: OPT.pacing[0], dialogueStyle: OPT.dialogueStyles[0], mood: "孤独、怀旧、热爱电影、深夜奇迹 / lonely, nostalgic, devoted to cinema, midnight miracle" });
  const [modules, setModules] = useState(DEFAULT_MODULES);
  const [tech, setTech] = useState({ platform: OPT.platforms[0], ratio: OPT.ratios[0], shotCount: "8", shotCountMode: OPT.shotCountModes[4], shotRange: OPT.shotRanges[1], videoDuration: OPT.videoDurations[2], shotDensity: OPT.shotDensities[1], minimumCoverage: OPT.coverageChecklist.slice(0, 10), allowAddMissingShots: true, shotSizeLock: AUTO, cameraLock: AUTO, lensLock: AUTO, movementLock: AUTO, stabilizerLock: AUTO, lightingLock: AUTO, compositionLock: OPT.compositions[0], editLock: OPT.edits[0], soundLock: OPT.sounds[0], colorScience: OPT.colors[2], bilingualDialogue: true, professionalAV: true, includeSound: true, generateSceneImagePrompt: true, sceneImageMode: OPT.sceneImageModes[1], sceneImageUse: OPT.sceneImageUses[0], sceneImageAspectRatio: OPT.sceneImageRatios[0], sceneImageModel: OPT.sceneImageModels[0] });
  const workspaceStoreRef = useRef({});
  const autosaveHydratedRef = useRef(false);
  const autosaveTimerRef = useRef(null);
  const [workspaceStoreVersion, setWorkspaceStoreVersion] = useState(0);
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [apiErrorModal, setApiErrorModal] = useState(null);
  const [ritualOverlay, setRitualOverlay] = useState(null);
  const [showClapperboard, setShowClapperboard] = useState(false);
  const [directorCutSummary, setDirectorCutSummary] = useState(null);
  const [lastArchiveId, setLastArchiveId] = useState("");


  function createWorkspacePreset(mode = "pro") {
    const modeLabel = mode === "beginner" ? "新手快速项目 / Beginner Quick Project" : mode === "director" ? "导演工程 / Director Project" : "专业流程项目 / Pro Workflow Project";
    return {
      script: DEFAULT_SCRIPT,
      project: modeLabel,
      style: DIRECTOR_STYLES[0],
      shots: [],
      activeShot: 0,
      activeModule: "character",
      proStep: "reference",
      generationHistory: [],
      shotPlanRows: [],
      shotPlanDiagnosis: { zh: "", en: "", recommendedCount: 0 },
      qualityReport: null,
      promptVersions: [],
      negativePrompt: DEFAULT_NEGATIVE,
      ideaInput: "",
      referenceUrl: "",
      referenceManualContent: "",
      referenceIngest: { status: "idle", title: "", summary: "", keywords: [], style: "", viralRhythm: "", usableFacts: "", uncertainInfo: "" },
      referenceUseMode: OPT.referenceUseModes[1],
      douyinViral: { enabled: true, videoType: OPT.douyinVideoTypes[0], hookStyle: OPT.viralHookStyles[0], intensity: OPT.viralIntensities[1], duration: OPT.shortVideoDurations[2] },
      personFacts: { name: "", school: "", major: "", identity: "", experience: "", awards: "", highlights: "", doNotInvent: "" },
      outlineDraft: "",
      sceneImageBatchFormat: OPT.sceneImageBatchFormats[0],
      creativeBrief: { genre: OPT.genres[0], pacing: OPT.pacing[0], dialogueStyle: OPT.dialogueStyles[0], mood: "" },
      modules: DEFAULT_MODULES,
      tech: { platform: OPT.platforms[0], ratio: OPT.ratios[0], shotCount: "8", shotCountMode: OPT.shotCountModes[4], shotRange: OPT.shotRanges[1], videoDuration: OPT.videoDurations[2], shotDensity: OPT.shotDensities[1], minimumCoverage: OPT.coverageChecklist.slice(0, 10), allowAddMissingShots: true, shotSizeLock: AUTO, cameraLock: AUTO, lensLock: AUTO, movementLock: AUTO, stabilizerLock: AUTO, lightingLock: AUTO, compositionLock: OPT.compositions[0], editLock: OPT.edits[0], soundLock: OPT.sounds[0], colorScience: OPT.colors[2], bilingualDialogue: true, professionalAV: true, includeSound: true, generateSceneImagePrompt: true, sceneImageMode: OPT.sceneImageModes[1], sceneImageUse: OPT.sceneImageUses[0], sceneImageAspectRatio: OPT.sceneImageRatios[0], sceneImageModel: OPT.sceneImageModels[0] },
    };
  }

  function cloneWorkspace(value) {
    if (typeof structuredClone === "function") return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function captureWorkspace() {
    return cloneWorkspace({
      script, project, style, shots, activeShot, activeModule, proStep,
      generationHistory, shotPlanRows, shotPlanDiagnosis, qualityReport, promptVersions,
      negativePrompt, ideaInput, referenceUrl, referenceManualContent, referenceIngest,
      referenceUseMode, douyinViral, personFacts, outlineDraft, sceneImageBatchFormat,
      creativeBrief, modules, tech,
    });
  }

  function loadWorkspace(ws, mode = "pro") {
    const preset = createWorkspacePreset(mode);
    const next = { ...preset, ...(ws || {}) };
    setScript(next.script ?? preset.script);
    setProject(next.project ?? preset.project);
    setStyle(next.style || preset.style);
    setShots(Array.isArray(next.shots) ? next.shots : []);
    setActiveShot(Number.isFinite(Number(next.activeShot)) ? Number(next.activeShot) : 0);
    setActiveModule(next.activeModule || "character");
    setProStep(next.proStep || "reference");
    setGenerationHistory(Array.isArray(next.generationHistory) ? next.generationHistory : []);
    setShotPlanRows(Array.isArray(next.shotPlanRows) ? next.shotPlanRows : []);
    setShotPlanDiagnosis(next.shotPlanDiagnosis || preset.shotPlanDiagnosis);
    setQualityReport(next.qualityReport || null);
    setPromptVersions(Array.isArray(next.promptVersions) ? next.promptVersions : []);
    setNegativePrompt(next.negativePrompt ?? DEFAULT_NEGATIVE);
    setIdeaInput(next.ideaInput ?? "");
    setReferenceUrl(next.referenceUrl ?? "");
    setReferenceManualContent(next.referenceManualContent ?? "");
    setReferenceIngest(next.referenceIngest || preset.referenceIngest);
    setReferenceUseMode(next.referenceUseMode || preset.referenceUseMode);
    setDouyinViral(next.douyinViral || preset.douyinViral);
    setPersonFacts(next.personFacts || preset.personFacts);
    setOutlineDraft(next.outlineDraft ?? "");
    setSceneImageBatchFormat(next.sceneImageBatchFormat || preset.sceneImageBatchFormat);
    setCreativeBrief(next.creativeBrief || preset.creativeBrief);
    setModules(next.modules || DEFAULT_MODULES);
    setTech(next.tech || preset.tech);
  }

  function switchWorkspaceMode(nextMode) {
    const normalizedMode = nextMode || "pro";
    if (workspaceMode) workspaceStoreRef.current[workspaceMode] = captureWorkspace();
    const nextWorkspace = workspaceStoreRef.current[normalizedMode] || createWorkspacePreset(normalizedMode);
    loadWorkspace(nextWorkspace, normalizedMode);
    setWorkspaceMode(normalizedMode);
    const ritualModeName = normalizedMode === "beginner" ? "Quick Creator Studio / 快速创作棚" : normalizedMode === "director" ? "Director Command Deck / 导演指挥舱" : "AIGC Production Studio / 专业制作棚";
    showRitual("ENTER STUDIO / 进入工作室", ritualModeName, `正在进入 ${ritualModeName} · 三模式独立工作区已加载`, 100);
    setStatus(`Workspace switched / 已切换到独立工作区：${normalizedMode}`);
    setWorkspaceStoreVersion(v => v + 1);
  }

  function importCurrentWorkspaceTo(targetMode) {
    const normalizedMode = targetMode || "pro";
    const snapshot = captureWorkspace();
    workspaceStoreRef.current[workspaceMode || "pro"] = snapshot;
    workspaceStoreRef.current[normalizedMode] = cloneWorkspace({
      ...snapshot,
      project: `${snapshot.project || "Polaris Project"} · imported to ${normalizedMode}`,
    });
    loadWorkspace(workspaceStoreRef.current[normalizedMode], normalizedMode);
    setWorkspaceMode(normalizedMode);
    setStatus(`Workspace imported / 当前项目已手动导入到 ${normalizedMode} 独立工作区`);
    setWorkspaceStoreVersion(v => v + 1);
  }

  function resetCurrentWorkspace() {
    const mode = workspaceMode || "pro";
    const fresh = createWorkspacePreset(mode);
    workspaceStoreRef.current[mode] = fresh;
    loadWorkspace(fresh, mode);
    setStatus(`Workspace reset / 已重置当前独立工作区：${mode}`);
    setWorkspaceStoreVersion(v => v + 1);
  }

  function clearLocalWorkspaceCache() {
    try {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      workspaceStoreRef.current = {};
      setLastSavedAt("");
      setStatus("Local autosave cache cleared / 已清空本地自动保存缓存");
      setWorkspaceStoreVersion(v => v + 1);
    } catch (e) {
      setStatus("Failed to clear local cache / 清空本地缓存失败");
    }
  }

  function showApiError(error, fallbackStatus = "API request failed / 接口请求失败") {
    const info = classifyApiError(error);
    setApiErrorModal({ ...info, raw: String(error?.message || error || ""), time: new Date().toLocaleTimeString() });
    setStatus(`${fallbackStatus}: ${info.title}`);
    return info;
  }

  function showRitual(kicker, title, message, progress = 100) {
    setRitualOverlay({ kicker, title, message, progress });
  }

  function lockProductionVersion() {
    const archiveId = makeArchiveId(project || script || "Polaris");
    setLastArchiveId(archiveId);
    setStatus(`Production Version Locked / 制作版本已封存：${archiveId}`);
    showRitual("PROJECT LOCK / 项目封版", "Production Version Locked / 制作版本已封存", `Archive ID: ${archiveId} · Chief Engineer: ${ENGINEER_NAME}`, 100);
    return archiveId;
  }


  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        workspaceStoreRef.current = saved.workspaces || {};
        if (saved.apiConfig) {
          setApiMode(saved.apiConfig.apiMode || "direct");
          setSelectedModel(DEEPSEEK_V4_MODELS.includes(saved.apiConfig.selectedModel) ? saved.apiConfig.selectedModel : DEEPSEEK_V4_MODELS[0]);
          setThinkingMode(saved.apiConfig.thinkingMode || OPT.thinkingModes[0]);
          setReasoningEffort(saved.apiConfig.reasoningEffort || OPT.reasoningEfforts[0]);
        }
        if (saved.currentMode && workspaceStoreRef.current[saved.currentMode]) {
          loadWorkspace(workspaceStoreRef.current[saved.currentMode], saved.currentMode);
          setWorkspaceMode(saved.currentMode);
        }
        setLastSavedAt(saved.savedAt ? new Date(saved.savedAt).toLocaleTimeString() : "");
        setStatus("Local workspace restored / 已恢复本地自动保存工作区");
      }
    } catch (e) {
      console.warn("Failed to restore Polaris workspace", e);
    } finally {
      autosaveHydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!autosaveHydratedRef.current) return;
    if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = window.setTimeout(() => {
      try {
        const mode = workspaceMode || "pro";
        workspaceStoreRef.current[mode] = captureWorkspace();
        const payload = {
          version: BUILD_VERSION,
          savedAt: new Date().toISOString(),
          currentMode: mode,
          apiConfig: { apiMode, selectedModel, thinkingMode, reasoningEffort },
          workspaces: workspaceStoreRef.current,
        };
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
        setLastSavedAt(new Date(payload.savedAt).toLocaleTimeString());
      } catch (e) {
        console.warn("Failed to autosave Polaris workspace", e);
      }
    }, 1200);
    return () => {
      if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    };
  }, [
    workspaceMode, script, project, style, shots, activeShot, activeModule, proStep,
    generationHistory, shotPlanRows, shotPlanDiagnosis, qualityReport, promptVersions,
    negativePrompt, ideaInput, referenceUrl, referenceManualContent, referenceIngest,
    referenceUseMode, douyinViral, personFacts, outlineDraft, sceneImageBatchFormat,
    creativeBrief, modules, tech, apiMode, selectedModel, thinkingMode, reasoningEffort,
    workspaceStoreVersion
  ]);

  useEffect(() => {
    if (!DEEPSEEK_V4_MODELS.includes(selectedModel)) {
      setSelectedModel(DEEPSEEK_V4_MODELS[0]);
      setStatus(`Model migrated to ${DEEPSEEK_V4_MODELS[0]} / 已自动切换到 DeepSeek V4 模型`);
    }
  }, [selectedModel]);

  useEffect(() => {
    if (!isGenerating) return;
    setGenerateProgress(prev => (prev > 0 ? prev : 6));
    const timer = window.setInterval(() => {
      setGenerateProgress(prev => Math.min(92, prev + Math.max(1, Math.round((92 - prev) * 0.08))));
    }, 420);
    return () => window.clearInterval(timer);
  }, [isGenerating]);

  useEffect(() => {
    const handler = async (event) => {
      if (workspaceMode !== "director") return;
      const target = event.target;
      if (event.isComposing || isEditableTarget(target)) return;
      const key = String(event.key || "").toLowerCase();
      const meta = event.ctrlKey || event.metaKey;
      if (key === "arrowleft" || key === "[") {
        event.preventDefault();
        setActiveShot(prev => Math.max(0, prev - 1));
        setStatus("Shortcut: previous shot / 快捷键：上一个镜头");
      }
      if (key === "arrowright" || key === "]") {
        event.preventDefault();
        setActiveShot(prev => Math.min(Math.max(0, shots.length - 1), prev + 1));
        setStatus("Shortcut: next shot / 快捷键：下一个镜头");
      }
      if (meta && key === "c") {
        event.preventDefault();
        const activeNow = shots[activeShot] || null;
        const prompt = activeNow ? buildFinalPrompt(activeNow, project, style, tech, modules, negativePrompt) : "";
        if (prompt && navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(prompt);
          setStatus("Shortcut: prompt copied / 快捷键：已复制当前镜头提示词");
        }
      }
      if (meta && key === "r") {
        event.preventDefault();
        if (!isRegeneratingShot && shots[activeShot]) {
          setStatus("Shortcut: regenerating current shot / 快捷键：正在重生成当前镜头");
          handleRegenerateCurrentShot();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [workspaceMode, shots, activeShot, project, style, tech, modules, negativePrompt, isRegeneratingShot]);

  const moduleKeys = Object.keys(modules);
  const safeActiveModuleKey = modules[activeModule] ? activeModule : (moduleKeys[0] || "character");
  const safeActiveModule = modules[safeActiveModuleKey] || { title: "Module", zh: "模块", fields: {} };
  const active = shots[activeShot] || null;
  const livePrompt = active ? buildFinalPrompt(active, project, style, tech, modules, negativePrompt) : "";
  const liveSceneImagePrompt = active ? buildSceneImageModelVariant(active, project, style, tech, negativePrompt) : "";
  const shotPlan = useMemo(() => estimateShotPlan(tech, script), [tech, script]);
  const activeReferenceUrl = referenceUrl.trim() || extractFirstUrl(ideaInput);
  const referencePromptContext = useMemo(() => summarizeReferenceForPrompt({ url: activeReferenceUrl, useMode: referenceUseMode, manualContent: referenceManualContent, ...referenceIngest }), [activeReferenceUrl, referenceUseMode, referenceManualContent, referenceIngest]);
  const douyinViralBrief = useMemo(() => buildDouyinViralBrief(tech, douyinViral), [tech, douyinViral]);
  const qualityScore = useMemo(() => Math.min(99, 62 + (script.length > 80 ? 6 : 0) + (shots.length ? 8 : 0) + moduleKeys.length * 2 + (tech.professionalAV ? 5 : 0)), [script, shots, tech.professionalAV, moduleKeys.length]);
  const workflowStatus = [
    { id: "01", label: "API", done: apiLog.status === "success" || apiMode === "proxy" },
    { id: "02", label: "Reference / 参考", done: referenceIngest.status && referenceIngest.status !== "idle" },
    { id: "03", label: "Outline / 大纲", done: Boolean(outlineDraft.trim() || script.trim()) },
    { id: "04", label: "Plan / 规划", done: shotPlanRows.length > 0 },
    { id: "05", label: "Shots / 分镜", done: shots.length > 0 },
    { id: "06", label: "Quality / 质检", done: Boolean(qualityReport) },
  ];
  const updateModuleField = (key, field, value) => setModules(p => ({ ...p, [key]: { ...p[key], fields: { ...p[key].fields, [field]: value } } }));
  const updateActiveShot = patch => { if (!active) return; setShots(prev => prev.map((s, i) => i === activeShot ? { ...s, ...patch } : s)); };
  const rebuildFinalPrompts = arr => arr.map(s => ({ ...s, finalPrompt: buildFinalPrompt(s, project, style, tech, modules, negativePrompt), finalSceneImagePrompt: tech.generateSceneImagePrompt ? buildSceneImageModelVariant(s, project, style, tech, negativePrompt) : "" }));

  function getSceneImagePack(format = sceneImageBatchFormat) {
    return buildSceneImagePromptPack(rebuildFinalPrompts(shots), project, style, tech, negativePrompt, format);
  }

  async function handleCopySceneImagePack() {
    if (!shots.length) return setStatus("No shots to export / 还没有可导出的镜头");
    await safeCopyText(getSceneImagePack(sceneImageBatchFormat));
    setStatus("Scene image prompt pack copied / 已复制全部场景图提示词包");
  }

  function handleDownloadSceneImagePack() {
    if (!shots.length) return setStatus("No shots to export / 还没有可导出的镜头");
    const isJson = sceneImageBatchFormat.includes("JSON");
    const isCsv = sceneImageBatchFormat.includes("CSV");
    const ext = isJson ? "json" : isCsv ? "csv" : "txt";
    const mime = isJson ? "application/json;charset=utf-8" : isCsv ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8";
    downloadTextFile(`${safeName(project)}_Scene_Image_Prompts.${ext}`, getSceneImagePack(sceneImageBatchFormat), mime);
    setStatus("Scene image prompt pack downloaded / 已下载全部场景图提示词包");
  }

  const deepSeekEndpoint = apiMode === "proxy" ? "/api/deepseek" : "https://api.deepseek.com/v1/chat/completions";
  const apiHeaders = () => {
    const headers = { "Content-Type": "application/json" };
    if (apiMode === "direct") headers.Authorization = `Bearer ${apiKey.trim().replace(/[^\u0000-\u007F]/g, "")}`;
    return headers;
  };

  async function handleTestApi() {
    if (apiMode === "direct" && !apiKey.trim()) return setStatus("API Key Required / 请输入 DeepSeek API Key");
    const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
    const started = Date.now();
    setApiLog({ status: "testing", message: "Testing DeepSeek API... / 正在测试接口", lastModel: apiModel, lastEndpoint: deepSeekEndpoint, latencyMs: null, scriptFingerprint: scriptFingerprint(script) });
    try {
      const body = { model: apiModel, messages: [{ role: "user", content: "Return exactly this JSON: {\"pong\":true}" }], response_format: { type: "json_object" }, temperature: 0 };
      const headers = { "Content-Type": "application/json" };
      if (apiMode === "direct") headers.Authorization = `Bearer ${apiKey.trim().replace(/[^\x00-\x7F]/g, "")}`;
      const res = await fetch(deepSeekEndpoint, { method: "POST", headers, body: JSON.stringify(body) });
      const txt = await res.text();
      const latencyMs = Date.now() - started;
      if (!res.ok) throw new Error(`API Error ${res.status}: ${txt.slice(0, 180)}`);
      setApiLog({ status: "success", message: `API Connected / 接口连接成功 · ${latencyMs}ms`, lastModel: apiModel, lastEndpoint: deepSeekEndpoint, latencyMs, scriptFingerprint: scriptFingerprint(script), raw: txt.slice(0, 600) });
      setApiConnected(true);
      showRitual("AI ENGINE IGNITED", "北极星电影工业引擎已点火", `DeepSeek V4 已接入 · Model: ${apiModel} · Latency: ${latencyMs}ms · 总工程师认证：${ENGINEER_NAME}`, 100);
      const modeToReturn = returnModeAfterApi;
      if (modeToReturn) {
        switchWorkspaceMode(modeToReturn);
        setReturnModeAfterApi("");
        setStatus(`API Switched with ${apiModel} / 接口已切换，并返回 ${modeToReturn} 工作区`);
      } else {
        setStatus(`API Connected with ${apiModel} / 接口连接成功`);
      }
    } catch (e) {
      const info = showApiError(e, "API Test Failed / 接口测试失败");
      setApiLog({ status: "error", message: `${info.title}: ${info.message}`, lastModel: apiModel, lastEndpoint: deepSeekEndpoint, latencyMs: Date.now() - started, scriptFingerprint: scriptFingerprint(script), raw: String(e.message || e) });
      setApiConnected(false);
    }
  }


  async function handleIngestReference() {
    const url = (referenceUrl.trim() || extractFirstUrl(ideaInput)).trim();
    if (!url && !referenceManualContent.trim()) { setStatus("Reference Required / 请输入参考链接或粘贴参考内容"); return null; }
    setIsIngestingReference(true);
    setStatus("Reading reference link / 正在识别参考链接内容");
    const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
    let proxyPayload = null;
    try {
      if (url) {
        try {
          const proxyRes = await fetch(`/api/link-ingest?url=${encodeURIComponent(url)}`, { method: "GET" });
          if (proxyRes.ok) proxyPayload = await proxyRes.json();
        } catch (_) {
          proxyPayload = null;
        }
      }
      const rawReferenceText = [
        proxyPayload?.title ? `Proxy Title: ${proxyPayload.title}` : "",
        proxyPayload?.text ? `Proxy Text: ${String(proxyPayload.text).slice(0, 6000)}` : "",
        proxyPayload?.description ? `Proxy Description: ${proxyPayload.description}` : "",
        referenceManualContent ? `Manual Reference Content: ${referenceManualContent}` : "",
      ].filter(Boolean).join(NL);

      if (apiMode === "direct" && !apiKey.trim()) {
        const fallbackIngest = {
          status: proxyPayload ? "proxy_success_no_ai_summary" : "needs_manual_or_api_key",
          title: proxyPayload?.title || "",
          summary: proxyPayload?.text ? String(proxyPayload.text).slice(0, 500) : "链接可能需要登录或后端代理，未能完成 AI 摘要。请粘贴视频文案、标题、简介或评论区重点。",
          keywords: [],
          style: "",
          viralRhythm: "",
          usableFacts: proxyPayload?.text ? String(proxyPayload.text).slice(0, 1200) : "",
          uncertainInfo: "未完成 AI 解析；不要把未确认的人物信息当事实。",
        };
        setReferenceIngest(fallbackIngest);
        setStatus("Reference captured but API key missing / 已捕获参考信息，但需要 API Key 进行摘要");
        return fallbackIngest;
      }

      const res = await fetch(deepSeekEndpoint, {
        method: "POST",
        headers: (() => { const h = { "Content-Type": "application/json" }; if (apiMode === "direct") h.Authorization = `Bearer ${apiKey.trim().replace(/[^\x00-\x7F]/g, "")}`; return h; })(),
        body: JSON.stringify({
          model: apiModel,
          messages: [
            { role: "system", content: "You are a reference link analyst for short video production. Analyze the supplied URL, proxy text, and manual content. If the link text is unavailable, clearly say it is unavailable and ask for manual content. Do not fabricate facts about real people. Return only JSON with fields: title, summary, keywords, style, viralRhythm, usableFacts, uncertainInfo, suggestedShortVideoAngle." },
            { role: "user", content: [`Reference URL: ${url}`, `Reference Use Mode: ${referenceUseMode}`, `Reference Raw Text: ${rawReferenceText || "No readable page text. The URL may require login, app access, permission, or backend scraping."}`, `User Idea: ${ideaInput}`, `Douyin Viral Brief: ${douyinViralBrief}`].join(NL) }
          ],
          thinking: { type: String(thinkingMode).split(" /")[0] },
          temperature: 0.35,
          response_format: { type: "json_object" }
        })
      });
      if (!res.ok) throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 180)}`);
      const data = await res.json();
      const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
      const nextIngest = {
        status: proxyPayload ? "success_with_proxy" : (rawReferenceText ? "success_manual" : "link_unreadable_needs_manual"),
        title: parsed.title || proxyPayload?.title || "",
        summary: parsed.summary || "",
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : String(parsed.keywords || "").split(/[，,]/).filter(Boolean),
        style: parsed.style || "",
        viralRhythm: parsed.viralRhythm || "",
        usableFacts: parsed.usableFacts || "",
        uncertainInfo: parsed.uncertainInfo || "If reference content was not readable, ask user for verified facts.",
        suggestedShortVideoAngle: parsed.suggestedShortVideoAngle || "",
      };
      setReferenceIngest(nextIngest);
      setStatus("Reference analyzed / 参考链接理解完成");
      return nextIngest;
    } catch (e) {
      const failedIngest = { ...referenceIngest, status: "failed_needs_manual", uncertainInfo: String(e.message || e), summary: "链接读取失败。请粘贴视频文案、标题、简介、评论区重点或截图文字后再分析。" };
      setReferenceIngest(failedIngest);
      setStatus(`Reference Error: ${e.message} / 链接识别失败，请粘贴参考内容`);
      return failedIngest;
    } finally {
      setIsIngestingReference(false);
    }
  }

  async function handleGenerateScriptOutline() {
    if (apiMode === "direct" && !apiKey.trim()) return setStatus("API Key Required / 请输入 DeepSeek API Key");
    if (!ideaInput.trim()) return setStatus("Idea Required / 请先输入想法需求");
    let referenceContextForRequest = referencePromptContext;
    if ((referenceUrl.trim() || extractFirstUrl(ideaInput)) && referenceIngest.status === "idle") {
      setStatus("Auto analyzing reference before outline / 生成大纲前自动识别参考链接");
      const nextRef = await handleIngestReference();
      if (nextRef) referenceContextForRequest = summarizeReferenceForPrompt({ url: activeReferenceUrl, useMode: referenceUseMode, manualContent: referenceManualContent, ...nextRef });
    }
    const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
    setIsGeneratingOutline(true);
    setStatus(`Generating script outline with ${apiModel} / 正在根据想法生成剧本大纲`);
    try {
      const res = await fetch(deepSeekEndpoint, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({
          model: apiModel,
          messages: [
            { role: "system", content: "You are a bilingual film development writer and Douyin viral short-video strategist. Turn the user's raw idea plus reference-link analysis into a professional Chinese script outline for an AI video director system. Return only JSON: {\"scriptOutline\":\"...\",\"mood\":\"...\",\"viralStrategy\":\"...\",\"coverTitle\":\"...\",\"threeSecondHook\":\"...\"}. The outline must be specific, visual, cinematic, coherent, ready for shot generation, and if Douyin mode is enabled it must include a 1-minute retention structure. For real-person introductions, do not invent identity, awards, experiences or achievements unless provided in the reference content or user text." },
            { role: "user", content: [`Idea / 想法: ${ideaInput}`, `Reference Context / 参考链接理解:\n${referencePromptContext}`, `Douyin Viral Brief / 抖音爆款策略:\n${douyinViralBrief}`, `Short Video Type / 短视频类型: ${douyinViral.videoType}`, `Target Duration / 目标时长: ${douyinViral.duration}`, `Genre / 类型: ${creativeBrief.genre}`, `Pacing / 节奏: ${creativeBrief.pacing}`, `Dialogue Style / 台词风格: ${creativeBrief.dialogueStyle}`, `Project / 项目: ${project}`, `Important / 重要: If reference link content is unreadable, mark missing facts and build only around the user-provided verified details.`].join(NL) }
          ],
          thinking: { type: String(thinkingMode).split(" /")[0] },
          temperature: 0.75,
          response_format: { type: "json_object" }
        })
      });
      if (!res.ok) throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 160)}`);
      const data = await res.json();
      const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
      const outline = parsed.scriptOutline || parsed.outline || "";
      if (!outline.trim()) throw new Error("No script outline returned / 没有返回剧本大纲");
      setOutlineDraft(outline);
      if (parsed.mood) setCreativeBrief(p => ({ ...p, mood: parsed.mood }));
      if (parsed.viralStrategy || parsed.coverTitle || parsed.threeSecondHook) {
        setReferenceIngest(p => ({ ...p, viralRhythm: parsed.viralStrategy || p.viralRhythm, suggestedShortVideoAngle: [parsed.coverTitle, parsed.threeSecondHook].filter(Boolean).join(" / ") }));
      }
      setStatus("Script outline generated with reference + Douyin logic / 已按参考链接与抖音爆款逻辑生成剧本大纲，请确认后再生成提示词");
      return outline;
    } catch (e) {
      showApiError(e, "Outline Error / 剧本大纲生成失败");
      return null;
    } finally {
      setIsGeneratingOutline(false);
    }
  }

  function handleGenerateOutline() {
    return handleGenerateScriptOutline();
  }

  function handleConfirmOutline() {
    const outline = String(outlineDraft || "").trim();
    if (!outline) {
      setStatus("Outline Required / 请先生成或填写剧本大纲");
      return;
    }
    setScript(outline);
    setStatus("Outline confirmed / 已确认剧本大纲");
  }

  async function handleEnhanceSceneImagePrompts() {
    if (apiMode === "direct" && !apiKey.trim()) return setStatus("API Key Required / 请输入 DeepSeek API Key");
    if (!shots.length) return setStatus("No shots to enhance / 还没有镜头可增强");
    const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
    setIsEnhancingSceneImages(true);
    setStatus(`Enhancing scene image prompts with ${apiModel} / 正在增强全部场景图提示词`);
    try {
      const compactShots = shots.map((s, i) => ({ id: s.id || i + 1, titleZh: s.titleZh, titleEn: s.titleEn, sceneZh: s.sceneZh, sceneEn: s.sceneEn, blockingZh: s.blockingZh, blockingEn: s.blockingEn, light: s.light, compositionZh: s.compositionZh, compositionEn: s.compositionEn, storyStateZh: s.storyStateZh, storyStateEn: s.storyStateEn, previousShotLinkZh: s.previousShotLinkZh, actionStartZh: s.actionStartZh, actionEndZh: s.actionEndZh, nextShotHookZh: s.nextShotHookZh, performanceDirectionZh: s.performanceDirectionZh, realismLayerZh: s.realismLayerZh }));
      const res = await fetch(deepSeekEndpoint, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({
          model: apiModel,
          messages: [
            { role: "system", content: "You are a storyboard keyframe prompt specialist. Rewrite scene image prompts for every shot. Return only JSON: {\"shots\":[{\"id\":1,\"keyframeMomentZh\":\"...\",\"keyframeMomentEn\":\"...\",\"sceneImagePromptZh\":\"...\",\"sceneImagePromptEn\":\"...\",\"sceneImageNegativeZh\":\"...\",\"sceneImageNegativeEn\":\"...\",\"sceneImageContinuityNotesZh\":\"...\",\"sceneImageContinuityNotesEn\":\"...\"}]}. Preserve shot order, continuity, costume, props, screen direction, lighting and mood." },
            { role: "user", content: JSON.stringify({ project, style: style.name, sceneImageMode: tech.sceneImageMode, sceneImageUse: tech.sceneImageUse, sceneImageRatio: tech.sceneImageAspectRatio, negativePrompt, shots: compactShots }) }
          ],
          thinking: { type: String(thinkingMode).split(" /")[0] },
          temperature: 0.65,
          response_format: { type: "json_object" }
        })
      });
      if (!res.ok) throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 160)}`);
      const data = await res.json();
      const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
      const returned = Array.isArray(parsed.shots) ? parsed.shots : [];
      if (!returned.length) throw new Error("No enhanced scene image prompts returned / 没有返回增强场景图提示词");
      const merged = shots.map((s, i) => {
        const r = returned.find(x => Number(x.id) === Number(s.id)) || returned[i] || {};
        return { ...s, ...r };
      });
      setShots(rebuildFinalPrompts(merged));
      setStatus("Scene image prompts enhanced / 全部场景图提示词已增强");
    } catch (e) {
      showApiError(e, "Scene Image Enhance Error / 场景图提示词增强失败");
    } finally {
      setIsEnhancingSceneImages(false);
    }
  }


  async function handleGenerateShotPlan(scriptOverride = null) {
    const effectiveScript = resolveScriptOverride(scriptOverride, script);
    if (apiMode === "direct" && !apiKey.trim()) return setStatus("API Key Required / 请输入 DeepSeek API Key");
    if (!effectiveScript) return setStatus("Script Required / 请输入剧本大纲");
    const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
    setIsPlanningShots(true);
    setStatus(`Generating preflight shot plan with ${apiModel} / 正在生成正式分镜规划表`);
    try {
      const body = {
        model: apiModel,
        messages: [
          { role: "system", content: `You are a Hollywood script supervisor and shot planner. Return ONLY valid JSON. Generate a bilingual preflight shot plan before final storyboard generation. Respect this shot count directive: ${shotCountDirective(tech, effectiveScript)}. Output schema: {"recommendedCount":12,"diagnosisZh":"中文诊断","diagnosisEn":"English diagnosis","plan":[{"shotNo":1,"roleZh":"中文镜头职责","roleEn":"English role","beatZh":"中文叙事节点","beatEn":"English beat","emotionZh":"中文情绪","emotionEn":"English emotion","shotType":"bilingual shot type","required":true}]}` },
          { role: "user", content: [`Project: ${project}`, `SCRIPT_FINGERPRINT: ${scriptFingerprint(effectiveScript)}`, `Current Script / 当前剧本:\n${effectiveScript}`, `Shot Count Directive:\n${shotCountDirective(tech, effectiveScript)}`, `Coverage Checklist:\n${(tech.minimumCoverage || []).join(" | ")}`, `Genre: ${creativeBrief.genre}`, `Pacing: ${creativeBrief.pacing}`].join(NL) }
        ],
        temperature: 0.45,
        response_format: { type: "json_object" }
      };
      const headers = { "Content-Type": "application/json" };
      if (apiMode === "direct") headers.Authorization = `Bearer ${apiKey.trim().replace(/[^\x00-\x7F]/g, "")}`;
      const res = await fetch(deepSeekEndpoint, { method: "POST", headers, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 180)}`);
      const data = await res.json();
      const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
      const plan = Array.isArray(parsed.plan) ? parsed.plan : [];
      if (!plan.length) throw new Error("Shot plan is empty / 分镜规划为空");
      setShotPlanRows(plan);
      setShotPlanDiagnosis({ zh: parsed.diagnosisZh || "", en: parsed.diagnosisEn || "", recommendedCount: parsed.recommendedCount || plan.length });
      setStatus(`Shot plan ready / 分镜规划已生成：建议 ${parsed.recommendedCount || plan.length} 个镜头`);
      return plan;
    } catch (e) {
      showApiError(e, "Shot Plan Error / 分镜规划失败");
      return null;
    } finally {
      setIsPlanningShots(false);
    }
  }

  async function handleGenerateFromShotPlan() {
    if (!shotPlanRows.length) {
      setStatus("No shot plan yet, generating with Smart Shot Count rules / 尚无分镜规划，将按智能分镜规则生成");
    }
    return handleGenerate(script);
  }

  async function handleRepairMissingCoverage() {
    if (apiMode === "direct" && !apiKey.trim()) return setStatus("API Key Required / 请输入 DeepSeek API Key");
    if (!shots.length) return setStatus("No shots to repair / 还没有镜头可检查补齐");
    const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
    setIsRepairingCoverage(true);
    setStatus(`Inspecting and repairing coverage with ${apiModel} / 正在检查并自动补缺镜头`);
    try {
      const current = rebuildFinalPrompts(shots).map(({ finalPrompt, finalSceneImagePrompt, ...s }) => s);
      const body = {
        model: apiModel,
        messages: [
          { role: "system", content: `You are a continuity inspector and coverage repair editor. Return ONLY valid JSON with {"shots":[...]} containing the full repaired shot list. Preserve all existing good shots, add missing shots only if necessary. New repair shots may be numbered with decimals or sequential IDs but must be normalized by the app. Every field must be bilingual. Must follow current script only.` },
          { role: "user", content: [`Project: ${project}`, `Current Script / 当前剧本:\n${script}`, `Coverage Checklist:\n${(tech.minimumCoverage || []).join(" | ")}`, `Shot Count Directive:\n${shotCountDirective(tech, script)}`, `Existing Shots JSON:\n${JSON.stringify(current).slice(0, 60000)}`, `Task: inspect for missing establishing/master/insert/reaction/turning/climax/resolution shots, action gaps, jump cuts and missing continuity. Return the complete repaired shots array. Mark added shots in missingCoverageFixZh/En.`].join(NL) }
        ],
        temperature: 0.55,
        response_format: { type: "json_object" }
      };
      const headers = { "Content-Type": "application/json" };
      if (apiMode === "direct") headers.Authorization = `Bearer ${apiKey.trim().replace(/[^\x00-\x7F]/g, "")}`;
      const res = await fetch(deepSeekEndpoint, { method: "POST", headers, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 180)}`);
      const data = await res.json();
      const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
      const repaired = Array.isArray(parsed.shots) ? parsed.shots.map(normalizeShot) : [];
      if (!repaired.length) throw new Error("No repaired shots returned / 没有返回修复镜头");
      setPromptVersions(prev => [{ id: Date.now(), type: "coverage_repair_before", time: new Date().toLocaleString(), shots }, ...prev].slice(0, 12));
      setShots(rebuildFinalPrompts(repaired));
      setActiveShot(0);
      setStatus(`Coverage repaired / 覆盖检查完成，当前 ${repaired.length} 个镜头`);
    } catch (e) {
      showApiError(e, "Coverage Repair Error / 自动补镜头失败");
    } finally {
      setIsRepairingCoverage(false);
    }
  }

  async function handleRegenerateCurrentShot() {
    if (apiMode === "direct" && !apiKey.trim()) return setStatus("API Key Required / 请输入 DeepSeek API Key");
    if (!active) return setStatus("No active shot / 没有当前镜头");
    const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
    const prevShot = shots[activeShot - 1] || null;
    const nextShot = shots[activeShot + 1] || null;
    setIsRegeneratingShot(true);
    setStatus(`Regenerating current shot with context / 正在带上下文重生成当前镜头`);
    try {
      const body = {
        model: apiModel,
        messages: [
          { role: "system", content: `You are a context-aware shot regenerator. Return ONLY valid JSON: {"shot":{...}}. Regenerate ONLY the current shot. Preserve project, script, continuity, previous shot end and next shot start. Every creative field must be bilingual.` },
          { role: "user", content: [`Project: ${project}`, `Current Script / 当前剧本:\n${script}`, `Previous Shot / 上一镜头:\n${prevShot ? JSON.stringify(prevShot).slice(0, 20000) : "None"}`, `Current Shot To Regenerate / 需要重生成的当前镜头:\n${JSON.stringify(active).slice(0, 20000)}`, `Next Shot / 下一镜头:\n${nextShot ? JSON.stringify(nextShot).slice(0, 20000) : "None"}`, `Rules: keep continuity; improve narrative purpose, coverage role, performance detail, video prompt and scene image prompt.`].join(NL) }
        ],
        temperature: 0.65,
        response_format: { type: "json_object" }
      };
      const headers = { "Content-Type": "application/json" };
      if (apiMode === "direct") headers.Authorization = `Bearer ${apiKey.trim().replace(/[^\x00-\x7F]/g, "")}`;
      const res = await fetch(deepSeekEndpoint, { method: "POST", headers, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 180)}`);
      const data = await res.json();
      const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
      const newShot = normalizeShot({ ...active, ...(parsed.shot || parsed) }, activeShot);
      setPromptVersions(prev => [{ id: Date.now(), type: "regenerate_before", time: new Date().toLocaleString(), shotIndex: activeShot, shot: active }, ...prev].slice(0, 12));
      setShots(prev => rebuildFinalPrompts(prev.map((s, i) => i === activeShot ? newShot : s)));
      setStatus(`Shot ${activeShot + 1} regenerated with context / 当前镜头已带上下文重生成`);
    } catch (e) {
      showApiError(e, "Regenerate Shot Error / 单镜头重生成失败");
    } finally {
      setIsRegeneratingShot(false);
    }
  }

  async function handleOptimizeCurrentShot() {
    if (apiMode === "direct" && !apiKey.trim()) return setStatus("API Key Required / 请输入 DeepSeek API Key");
    if (!active) return setStatus("No active shot / 没有当前镜头");
    const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
    setIsOptimizingShot(true);
    setStatus(`Optimizing current shot: ${shotOptimizationMode} / 正在优化当前镜头`);
    try {
      const body = {
        model: apiModel,
        messages: [
          { role: "system", content: `You are a film prompt doctor. Return ONLY valid JSON: {"shot":{...}}. Optimize ONLY the current shot according to the selected mode. Do not change the story. Preserve continuity and bilingual fields.` },
          { role: "user", content: [`Optimization Mode / 优化模式: ${shotOptimizationMode}`, `Project: ${project}`, `Current Script / 当前剧本:\n${script}`, `Current Shot JSON:\n${JSON.stringify(active).slice(0, 30000)}`, `Improve professional cinematic quality, continuity, performance details, prompt usability and scene image prompt while keeping the same narrative function.`].join(NL) }
        ],
        temperature: 0.5,
        response_format: { type: "json_object" }
      };
      const headers = { "Content-Type": "application/json" };
      if (apiMode === "direct") headers.Authorization = `Bearer ${apiKey.trim().replace(/[^\x00-\x7F]/g, "")}`;
      const res = await fetch(deepSeekEndpoint, { method: "POST", headers, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 180)}`);
      const data = await res.json();
      const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
      const newShot = normalizeShot({ ...active, ...(parsed.shot || parsed) }, activeShot);
      setPromptVersions(prev => [{ id: Date.now(), type: "optimize_before", mode: shotOptimizationMode, time: new Date().toLocaleString(), shotIndex: activeShot, shot: active }, ...prev].slice(0, 12));
      setShots(prev => rebuildFinalPrompts(prev.map((s, i) => i === activeShot ? newShot : s)));
      setStatus(`Shot ${activeShot + 1} optimized / 当前镜头已优化`);
    } catch (e) {
      showApiError(e, "Optimize Shot Error / 当前镜头优化失败");
    } finally {
      setIsOptimizingShot(false);
    }
  }

  async function handleRunQualityCheck() {
    if (!shots.length) {
      const local = localQualityReport(shots, tech, douyinViral);
      setQualityReport(local);
      return setStatus("No shots yet / 暂无镜头，已生成基础检查提示");
    }
    if (apiMode === "direct" && !apiKey.trim()) {
      const local = localQualityReport(shots, tech, douyinViral);
      setQualityReport(local);
      return setStatus("Quality report generated locally / 未填写 API Key，已生成本地质量检查报告");
    }
    const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
    setIsCheckingQuality(true);
    setStatus("Running quality inspector / 正在生成质量检查报告");
    try {
      const body = {
        model: apiModel,
        messages: [
          { role: "system", content: "You are a senior film script supervisor, Douyin retention strategist and AI video quality inspector. Return only JSON: {score, summaryZh, summaryEn, problems:[{level,shot,zh,en,fixZh,fixEn}], missingCoverage:[...], nextActionsZh:[...], nextActionsEn:[...]}. Inspect shot count, coverage, continuity, axis, repeated shots, dialogue, hook strength, one-minute pacing, prompt usability and scene image prompts." },
          { role: "user", content: JSON.stringify({ project, script, douyinViral, shotPlan: shotPlanRows, coverageChecklist: tech.minimumCoverage, shots: shots.map(({ finalPrompt, finalSceneImagePrompt, ...s }) => s).slice(0, 80) }).slice(0, 70000) }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      };
      const res = await fetch(deepSeekEndpoint, { method: "POST", headers: apiHeaders(), body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 180)}`);
      const data = await res.json();
      const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
      setQualityReport(parsed);
      setStatus(`Quality report ready / 质量检查完成：${parsed.score || "-"}分`);
    } catch (e) {
      const local = localQualityReport(shots, tech, douyinViral);
      setQualityReport({ ...local, error: String(e.message || e) });
      setStatus(`Quality Check Error, local fallback used / 质量检查失败，已使用本地兜底：${e.message}`);
    } finally {
      setIsCheckingQuality(false);
    }
  }

  async function handleOneClickProduction() {
    if (isOneClickRunning || isGenerating) return;
    const hasIdeaOrScript = ideaInput.trim() || outlineDraft.trim() || script.trim();
    if (!hasIdeaOrScript) return setStatus("Please enter an idea or script first / 请先输入想法或剧本");
    if (apiMode === "direct" && !apiKey.trim()) return setStatus("API Key Required / 请输入 DeepSeek API Key");
    setIsOneClickRunning(true);
    try {
      setStatus("One-click production started / 一键完整流程开始");
      if ((referenceUrl.trim() || extractFirstUrl(ideaInput)) && referenceIngest.status === "idle") await handleIngestReference();
      let localOutline = outlineDraft.trim();
      if (!script.trim() && !localOutline && ideaInput.trim()) {
        const generatedOutline = await handleGenerateScriptOutline();
        localOutline = String(generatedOutline || "").trim();
      }
      const effective = (localOutline || script || ideaInput).trim();
      if (effective && !script.trim()) setScript(effective);
      if (!shotPlanRows.length && effective) await handleGenerateShotPlan(effective);
      const generatedShots = await handleGenerate(effective || script);
      if (generatedShots?.length) setTimeout(() => handleRunQualityCheck(), 900);
    } finally {
      setIsOneClickRunning(false);
    }
  }

  async function handleGenerate(scriptOverride = null) {
    const effectiveScript = resolveScriptOverride(scriptOverride, script);
    if (apiMode === "direct" && !apiKey.trim()) return setStatus("API Key Required / 请输入 DeepSeek API Key");
    let referenceContextForRequest = referencePromptContext;
    if ((referenceUrl.trim() || extractFirstUrl(ideaInput)) && referenceIngest.status === "idle") {
      setStatus("Auto analyzing reference before final generation / 正式生成前自动识别参考链接");
      const nextRef = await handleIngestReference();
      if (nextRef) referenceContextForRequest = summarizeReferenceForPrompt({ url: activeReferenceUrl, useMode: referenceUseMode, manualContent: referenceManualContent, ...nextRef });
    }
    if (!effectiveScript) return setStatus("Script Required / 请输入剧本大纲");
    const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
    if (apiModel !== selectedModel) setSelectedModel(apiModel);
    setIsGenerating(true);
    setProgressSidebarVisible(true);
    setGenerateProgress(6);
    setStatus(`AI Directing V6.7 with ${apiModel} / 正在使用 ${apiModel} 执行电影工业仪式化流程：读取剧本 → 导演母版 → 镜头覆盖 → 连续性 → 终审封版`);

    const lockRules = [
      tech.shotSizeLock !== AUTO ? `Locked shot size: ${tech.shotSizeLock}` : "Shot size is dynamic, choose per narrative beat.",
      tech.cameraLock !== AUTO ? `Locked camera: ${tech.cameraLock}` : "Camera is dynamic, choose per shot purpose.",
      tech.lensLock !== AUTO ? `Locked lens: ${tech.lensLock}` : "Lens is dynamic, choose per emotional distance.",
      tech.movementLock !== AUTO ? `Locked movement: ${tech.movementLock}` : "Movement is dynamic, choose per psychological state.",
      tech.stabilizerLock !== AUTO ? `Locked stabilizer: ${tech.stabilizerLock}` : "Stabilizer is dynamic, choose only when motivated.",
      tech.lightingLock !== AUTO ? `Locked lighting: ${tech.lightingLock}` : "Lighting is dynamic, choose per mood and story arc.",
      tech.compositionLock !== OPT.compositions[0] ? `Locked composition: ${tech.compositionLock}` : "Composition is dynamic.",
      tech.editLock !== OPT.edits[0] ? `Locked editing: ${tech.editLock}` : "Editing is dynamic.",
      tech.soundLock !== OPT.sounds[0] ? `Locked sound mode: ${tech.soundLock}` : "Sound design is dynamic.",
      tech.bilingualDialogue ? "Dialogue must be bilingual Chinese and English." : "Dialogue may be bilingual but Chinese and English output fields are still required.",
      tech.professionalAV ? "Professional audiovisual logic is required for every shot." : "Keep AV logic concise but still useful.",
      tech.includeSound ? "Sound design and transition fields are required for every shot." : "Sound fields may be minimal but must exist.",
    ].join(NL);
    const shotPlanRule = shotCountDirective(tech, effectiveScript);

    setGenerateProgress(22);

    const systemPrompt = `You are Polaris Cinema OS V5.2, a bilingual Hollywood-grade AI video director, storyboard artist, script supervisor, cinematographer, continuity director, shot planner and prompt doctor.
Return ONLY one valid JSON object. Every creative field must be bilingual Chinese and English. Dialogue must also be bilingual. Before writing shots, silently verify that the SCRIPT_FINGERPRINT and CURRENT SCRIPT OUTLINE control all content.

CRITICAL PRIORITY / 最高优先级:
1. The CURRENT Script Outline supplied by the user is the ONLY story source of truth. If any module default, old preset, UI memory, or previous generation conflicts with the current script, ignore it and follow the current script. Never reuse the old default story about a struggling director, cinema, projector, screen, film canister, rain, or empty theater unless the current script explicitly says so.
2. Shots must be generated as a connected directed scene, not isolated pretty images.
3. Every shot must inherit the previous shot's story state, action end, screen direction, prop state and emotional state.
4. Each shot must include previous shot link, action start, action end, next shot hook and cut motivation.
5. Keep spatial geography, 180-degree axis, eyeline and screen direction consistent unless the script explicitly motivates a break.
6. Add live-action realism: micro-expression, breath rhythm, slight focus drift, imperfect camera breathing, physical inertia, dust, texture and natural exposure variation.
7. Avoid repetitive shot size, lens, movement and lighting unless intentionally motivated.
8. Think like a director shooting coverage: establishing, master shot, medium coverage, close-up, insert, reaction, cutaway and emotional release.
9. For every shot, also generate a scene image prompt that captures the single best frozen cinematic keyframe for storyboard, concept art or image-to-video use.
10. If reference-link context exists, use it as style/structure/verified-content guidance according to the selected Reference Use Mode.
11. If Douyin Viral Logic is enabled, strengthen the first 3 seconds, retention rhythm, subtitle punchlines, cover title logic, comment trigger, and one-minute short-video structure.
12. For real-person or school introductions, never fabricate unprovided facts; mark uncertain information and write around verified details.
13. Respect the smart shot count plan: fixed counts must be exact; auto or range modes must produce a justified amount of shots without missing critical coverage.
14. If Smart Range or Minimum Coverage mode is used, you may add missing shots only when necessary for continuity, coverage or emotional clarity.

INTEGRATE ALL 43 MODULES:
12 existing film industry modules: Character Continuity, Location Continuity, Continuity Check, Narrative Rhythm, Blocking, Composition, Editing Language, Sound Design, Platform Prompt Adaptation, Omni Multi-Parameter Control, Production Mode, Multi-Version Notes.
10 Director Continuity Pro modules: Director Bible, Story State Engine, Shot Dependency, Spatial Geography Map, Axis & Eyeline Control, Performance Direction, Realism Layer, Lens Grammar Curve, Coverage Plan, Continuity Inspector.
1 Scene Image Prompt module: each shot must include a keyframe moment and a dedicated scene image prompt for still-image generation.
1 Scene Image Studio module: output should be suitable for batch export and image model variants such as Midjourney, Flux/SDXL, DALL·E, Dreamina and Kling image-to-video first frames.
5 Smart Shot Count modules: Smart Shot Count System, Shot Planner, Coverage Checklist, Shot Density Control, Duration-Driven Planning.
5 Pro Skills modules: Preflight Shot Planner, Auto Coverage Repair, Context Shot Regenerator, One-Click Shot Optimizer, Prompt Version Compare.
5 UX Quality modules: One-Click Production, Real Person Fact Sheet, Quality Inspector Report, Proxy Route Pack, UX Mode Control.
4 Reference + Viral modules: Reference Link Ingest, Reference Understanding, Douyin Viral Engine, 1-Minute Short Video Structure.

SHOT COUNT PLANNING RULE:
${shotPlanRule}

LOCK RULES:
${lockRules}

DIRECTOR STYLE:
${style.name}
${style.desc}
${style.tags}

OUTPUT JSON SCHEMA:
{"shots":[{"id":1,"titleZh":"中文镜头标题","titleEn":"English shot title","emotionalBeatZh":"中文情绪节点","emotionalBeatEn":"English emotional beat","narrativeFunctionZh":"中文叙事功能","narrativeFunctionEn":"English narrative function","sceneZh":"中文电影化画面内容，必须严格来自当前剧本","sceneEn":"English cinematic visual content, strictly based on current script","dialogueZh":"中文台词或有意义的沉默","dialogueEn":"English dialogue or meaningful silence","avLogicZh":"中文视听语言逻辑","avLogicEn":"English AV logic","blockingZh":"中文人物调度","blockingEn":"English actor blocking","compositionZh":"中文构图逻辑","compositionEn":"English composition logic","soundDesignZh":"中文声音设计","soundDesignEn":"English sound design","transitionZh":"中文剪辑/转场","transitionEn":"English editing/transition","continuityCheckZh":"中文连续性风险与修正","continuityCheckEn":"English continuity risk and fix","omniParamPromptZh":"中文全能多参","omniParamPromptEn":"English omni multi-parameter controls","platformPromptZh":"中文平台适配提示词","platformPromptEn":"English platform-adapted prompt","versionNotesZh":"中文多版本改写方向","versionNotesEn":"English multi-version notes","storyStateZh":"中文故事状态引擎：角色位置、情绪、动作、道具、光线状态","storyStateEn":"English story state engine: position, emotion, action, props, lighting state","previousShotLinkZh":"中文上一镜头承接","previousShotLinkEn":"English previous shot link","actionStartZh":"中文本镜头开始动作","actionStartEn":"English action start","actionEndZh":"中文本镜头结束动作","actionEndEn":"English action end","nextShotHookZh":"中文下一镜头钩子","nextShotHookEn":"English next shot hook","cutMotivationZh":"中文剪辑动机","cutMotivationEn":"English cut motivation","spatialGeographyZh":"中文场景空间地图与摄影机位置","spatialGeographyEn":"English spatial geography map and camera position","axisEyelineZh":"中文轴线、视线、画面方向控制","axisEyelineEn":"English axis, eyeline and screen direction control","performanceDirectionZh":"中文表演指导：面部、身体、呼吸、台词说法","performanceDirectionEn":"English performance direction: face, body, breath, line delivery","realismLayerZh":"中文实拍细腻层：对焦、曝光、灰尘、皮肤、衣服、物理惯性","realismLayerEn":"English live-action realism layer: focus, exposure, dust, skin, fabric, physical inertia","lensGrammarZh":"中文焦段语法曲线与情绪距离","lensGrammarEn":"English lens grammar curve and emotional distance","coveragePlanZh":"中文导演覆盖拍法职责","coveragePlanEn":"English coverage plan role","continuityInspectorZh":"中文连续性审片员检查与修正","continuityInspectorEn":"English continuity inspector review and fix","coverageRoleZh":"中文镜头覆盖职责，如建立镜头/主镜头/特写/插入/反应/转折/收尾","coverageRoleEn":"English coverage role, such as establishing/master/close-up/insert/reaction/turning/resolution","shotPlanReasonZh":"中文为什么这个镜头数量和职责必要","shotPlanReasonEn":"English reason why this shot role/count is needed","missingCoverageFixZh":"中文若为补充镜头，说明补了什么缺口，否则写无","missingCoverageFixEn":"English missing coverage fix note or none","keyframeMomentZh":"中文关键帧瞬间","keyframeMomentEn":"English keyframe moment","sceneImagePromptZh":"中文场景图提示词","sceneImagePromptEn":"English scene image prompt","sceneImageNegativeZh":"中文场景图负面提示词","sceneImageNegativeEn":"English scene image negative prompt","sceneImageContinuityNotesZh":"中文场景图连续性锚点与说明","sceneImageContinuityNotesEn":"English scene image continuity anchors and notes","shotSize":"bilingual shot size","camera":"bilingual camera","lens":"bilingual lens","move":"bilingual movement","stabilizer":"bilingual support","light":"bilingual lighting","colorScience":"bilingual color look","compositionType":"bilingual composition type","editType":"bilingual edit type","soundMode":"bilingual sound mode","duration":"4-6s / 4-6 秒","promptZh":"中文完整视频提示词","promptEn":"English complete video prompt"}]}`;
    const userPrompt = [`Project / 项目: ${project}`, `SCRIPT_FINGERPRINT / 剧本指纹: ${scriptFingerprint(effectiveScript)}`, `CURRENT SCRIPT OUTLINE - HIGHEST PRIORITY / 当前剧本大纲，最高优先级:
${effectiveScript}`, `Reference Context / 参考链接理解:
${referenceContextForRequest}`, `Real Person Fact Sheet / 人物介绍事实表:
${personFactsText(personFacts)}`, `Douyin Viral Brief / 抖音爆款策略:
${douyinViralBrief}`, `Reference Use Mode / 参考用途: ${referenceUseMode}`, `Scene Image Prompt Enabled / 开启场景图提示词: ${tech.generateSceneImagePrompt ? "Yes" : "No"}`, `Scene Image Mode / 场景图模式: ${tech.sceneImageMode}`, `Scene Image Use / 场景图用途: ${tech.sceneImageUse}`, `Scene Image Ratio / 场景图画幅: ${tech.sceneImageAspectRatio}`, `Platform / 平台: ${tech.platform}`, `Aspect Ratio / 画幅: ${tech.ratio}`, `Shot Count Mode / 分镜数量模式: ${tech.shotCountMode}`, `Fixed Shot Count / 固定镜头数: ${tech.shotCount}`, `Shot Range / 镜头范围: ${tech.shotRange}`, `Estimated Video Duration / 预计视频时长: ${tech.videoDuration}`, `Shot Density / 镜头密度: ${tech.shotDensity}`, `Minimum Coverage / 最低覆盖清单: ${(tech.minimumCoverage || []).join(" | ")}`, `Allow AI Add Missing Shots / 允许 AI 自动补镜头: ${tech.allowAddMissingShots ? "Yes" : "No"}`, `Shot Count Diagnosis / 分镜数量诊断: ${shotCountDirective(tech, effectiveScript)}`, `Preflight Shot Plan / 正式生成前分镜规划表:\n${shotPlanRowsText(shotPlanRows)}`, `Preflight Diagnosis / 分镜规划诊断: ${shotPlanDiagnosis.zh || ""} / ${shotPlanDiagnosis.en || ""}`, `Genre / 类型: ${creativeBrief.genre}`, `Pacing / 节奏: ${creativeBrief.pacing}`, `Dialogue Style / 台词风格: ${creativeBrief.dialogueStyle}`, `Mood / 情绪: ${creativeBrief.mood}`, `Color Science / 色彩科学: ${tech.colorScience}`, `Negative Prompt / 负面提示词: ${negativePrompt}`, `43 Modules as RULES ONLY / 43模块仅作为规则，不是故事内容:
${moduleText(modules, effectiveScript)}`, `FINAL REMINDER / 最终提醒: All shots, dialogue, locations, props and scene image prompts must visibly come from CURRENT SCRIPT OUTLINE only. Do not reuse old default story content.`].join(NL);

    try {
      setGenerateProgress(38);
      const apiThinkingMode = String(thinkingMode).split(" /")[0];
      const requestBody = {
        model: apiModel,
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        thinking: { type: apiThinkingMode },
        temperature: apiThinkingMode === "enabled" ? 0.55 : 0.85,
        response_format: { type: "json_object" }
      };
      if (apiThinkingMode === "enabled") requestBody.reasoning_effort = reasoningEffort;
      setApiLog({ status: "requesting", message: "Generating with current script / 正在按当前剧本生成", lastModel: apiModel, lastEndpoint: deepSeekEndpoint, latencyMs: null, scriptFingerprint: scriptFingerprint(effectiveScript), requestPreview: userPrompt.slice(0, 1200) });
      const res = await fetch(deepSeekEndpoint, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify(requestBody)
      });
      if (!res.ok) throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 160)}`);
      setGenerateProgress(64);
      const data = await res.json();
      const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
      setGenerateProgress(78);
      const normalized = Array.isArray(parsed.shots) ? parsed.shots.map(normalizeShot) : [];
      if (!normalized.length) throw new Error("JSON parsed but shots array is empty / JSON 已解析但没有镜头数组");
      const withPrompts = rebuildFinalPrompts(normalized);
      setGenerateProgress(94);
      setShots(withPrompts);
      setActiveShot(0);
      setProgressSidebarVisible(true);
      setGenerateProgress(100);
      setGenerationHistory(prev => [{ id: Date.now(), time: new Date().toLocaleString(), project, model: apiModel, scriptFingerprint: scriptFingerprint(effectiveScript), shotCount: withPrompts.length, scriptPreview: effectiveScript.slice(0, 120), shots: withPrompts }, ...prev].slice(0, 8));
      setApiLog({ status: "success", message: `Generated ${withPrompts.length} shots / 已生成 ${withPrompts.length} 个镜头`, lastModel: apiModel, lastEndpoint: deepSeekEndpoint, latencyMs: null, scriptFingerprint: scriptFingerprint(effectiveScript), responsePreview: JSON.stringify({ shotCount: withPrompts.length, firstShot: withPrompts[0]?.titleZh }, null, 2) });
      const archiveId = makeArchiveId(project || effectiveScript || "Polaris");
      setLastArchiveId(archiveId);
      setDirectorCutSummary({ shotCount: withPrompts.length, scenePromptCount: withPrompts.filter(s => s.finalSceneImagePrompt || s.sceneImagePromptZh || s.sceneImagePromptEn).length, qualityScore: qualityReport?.score || `${qualityScore}/100`, risk: qualityReport?.risk || "Low", archiveId });
      setStatus(`Director's Cut Ready with ${apiModel} / 导演剪辑版已完成：${withPrompts.length} 个镜头，封存编号 ${archiveId}`);
      return withPrompts;
    } catch (e) {
      setGenerateProgress(0);
      showApiError(e, "Generate Error / 生成失败");
      return null;
    } finally {
      window.setTimeout(() => setIsGenerating(false), 450);
    }
  }

  function openApiConnectionCenter() {
    const currentMode = workspaceMode || "";
    if (currentMode) {
      workspaceStoreRef.current[currentMode] = captureWorkspace();
      setReturnModeAfterApi(currentMode);
    }
    setApiConnected(false);
    setWorkspaceMode("");
    setApiLog(prev => ({
      ...prev,
      status: "idle",
      message: currentMode
        ? `API switch center opened / 已进入 API 切换中心，连接成功后将返回 ${currentMode} 工作区`
        : "API switch center opened / 已进入 API 切换中心",
      lastModel: selectedModel,
      lastEndpoint: deepSeekEndpoint,
      latencyMs: null,
      scriptFingerprint: scriptFingerprint(script),
    }));
    setStatus(currentMode
      ? `API Switch Center / 正在切换 API，当前 ${currentMode} 工作区已自动保存`
      : "API Switch Center / 已进入 API 连接中心");
  }

  const apiIsReady = apiConnected || apiLog.status === "success";
  const v6ModeCards = [
    { id: "beginner", title: "新手模式", en: "Beginner", desc: "一句话需求 + 参考链接 + 爆款短视频思维，一键生成完整方案。", cta: "进入快速生成" },
    { id: "pro", title: "专业模式", en: "Pro Workflow", desc: "按视频生产流程分步操作：参考、剧本、规划、分镜、场景图、导出。", cta: "进入专业流程" },
    { id: "director", title: "导演模式", en: "Director Console", desc: "保留全部 43 模块、镜头编辑、单镜优化、补镜头、历史版本与检查器。", cta: "进入导演控制台" },
  ];
  const v6StepTabs = [
    { id: "reference", label: "01 参考资料" },
    { id: "script", label: "02 剧本大纲" },
    { id: "planning", label: "03 分镜规划" },
    { id: "shots", label: "04 分镜生成" },
    { id: "scene", label: "05 场景图" },
    { id: "export", label: "06 导出中心" },
  ];
  const directorViews = [
    { id: "brief", label: "Creative Core / 创作中枢" },
    { id: "scene", label: "Scene / 画面" },
    { id: "continuity", label: "Continuity / 连续性" },
    { id: "prompts", label: "Prompts / 提示词" },
  ];
  const directorInspectorTabs = [
    { id: "setup", label: "Setup / 项目" },
    { id: "look", label: "Look / 风格" },
    { id: "planning", label: "Plan / 规划" },
    { id: "tools", label: "Tools / 工具" },
    { id: "modules", label: "Modules / 模块" },
    { id: "review", label: "Review / 审片" },
  ];
  const V6Shell = ({ children, compact = false }) => <div className="min-h-screen bg-[#070707] text-stone-300 font-sans">
    {isGenerating && <GenerationProgressSidebar progress={generateProgress} status={status} visible={progressSidebarVisible} onShow={() => setProgressSidebarVisible(true)} onHide={() => setProgressSidebarVisible(false)} />}
    <RitualOverlay ritual={ritualOverlay} onClose={() => setRitualOverlay(null)} />
    <DigitalClapperboard open={showClapperboard} project={project} workspaceMode={workspaceMode} selectedModel={selectedModel} tech={tech} style={style} onCancel={() => setShowClapperboard(false)} onAction={() => { setShowClapperboard(false); handleGenerate(); }} />
    <DirectorCutReadyModal summary={directorCutSummary} onClose={() => setDirectorCutSummary(null)} onExport={() => { setDirectorCutSummary(null); makeWord(rebuildFinalPrompts(shots), project, script, style, tech, modules); }} />
    {apiErrorModal && <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 px-5 backdrop-blur-xl">
      <div className="w-full max-w-lg rounded-[2rem] border border-red-400/25 bg-[#0b0b0a] p-7 shadow-[0_0_80px_rgba(248,113,113,0.18)]">
        <div className="text-[11px] font-black uppercase tracking-[0.3em] text-red-300">API Error Assistant / 接口错误助手</div>
        <h3 className="mt-3 text-2xl font-black text-white">{apiErrorModal.title}</h3>
        <p className="mt-4 text-sm leading-7 text-stone-300">{apiErrorModal.message}</p>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-[12px] leading-6 text-stone-400">
          <b className="text-amber-200">建议处理 / Fix:</b><br />{apiErrorModal.fix}
        </div>
        {apiErrorModal.raw && <pre className="mt-4 max-h-32 overflow-auto rounded-2xl bg-black/60 p-4 text-[11px] text-red-200/70 whitespace-pre-wrap">{apiErrorModal.raw}</pre>}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setApiErrorModal(null)} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10">Close / 关闭</button>
        </div>
      </div>
    </div>}
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-3xl px-6 py-4">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4"><BrandMark active={isGenerating} progress={generateProgress} /><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-base font-black uppercase tracking-[0.18em] text-white">北极星AIGC电影级工业系统 V6.7.1</h1><span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">总工程师 · Haley黄衍衔</span></div><div className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300/80">API-FIRST · RITUAL CINEMA · DIGITAL CLAPPERBOARD · DIRECTOR CUT · ENGINEER SEAL</div><div className="mt-1 text-[11px] text-stone-500">{status}</div><div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300/70">Auto Save / 自动保存：{lastSavedAt || "waiting"}</div></div></div>
        {apiIsReady && <div className="flex flex-wrap items-center gap-2">
          {v6ModeCards.map(m => <button key={m.id} onClick={() => switchWorkspaceMode(m.id)} className={`rounded-2xl border px-4 py-2 text-[11px] font-black uppercase tracking-widest ${workspaceMode === m.id ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"}`}>{m.title}</button>)}
          {workspaceMode && <button onClick={resetCurrentWorkspace} className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-red-200 hover:bg-red-400/20">Reset Workspace / 重置当前</button>}
          <button onClick={clearLocalWorkspaceCache} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-stone-300 hover:bg-white/10">Clear Cache / 清空缓存</button>
          <button onClick={() => setShowClapperboard(true)} className="rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-amber-200 hover:bg-amber-400/20">Clapperboard / 打板</button>
          <button onClick={lockProductionVersion} className="rounded-2xl border border-purple-400/25 bg-purple-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-purple-200 hover:bg-purple-400/20">Lock Version / 封存版本</button>
          <button onClick={openApiConnectionCenter} className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-emerald-200 hover:bg-emerald-400/20">API Center / 切换 API</button>
        </div>}
      </div>
    </header>
    {apiIsReady && workspaceMode === "director" && <div className="border-b border-white/5 bg-black/45 px-6 py-3">
      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.18em]">
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-300">Director Command Deck Online</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-stone-400">Script: {script?.trim() ? "Locked" : "Draft"}</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-stone-400">Shot Plan: {shotPlanRows.length ? "Ready" : "Pending"}</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-stone-400">Prompts: {shots.length ? "Live" : "Waiting"}</span>
        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-amber-200">Chief Engineer: {ENGINEER_NAME}</span>
        {lastArchiveId && <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-purple-200">Archive: {lastArchiveId}</span>}
      </div>
    </div>}
    <main className={`mx-auto max-w-[1800px] ${compact ? "px-5 py-6" : "px-6 py-8"}`}>{children}</main>
    <footer className="mx-auto max-w-[1800px] px-6 pb-8 text-center text-[10px] font-black uppercase tracking-[0.22em] text-stone-700">Powered by 北极星AIGC电影级工业系统 V6.7.1.1 · Chief Engineer: {ENGINEER_NAME} · {AUTH_SEAL_ID}</footer>
    {/* Fixed bottom-right engineer seal removed to avoid occupying workspace. / 已取消右下角固定防伪水印，保留顶部与首屏认证标识。 */}
  </div>;

  if (!apiIsReady) {
    return V6Shell({ compact: true, children: <>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
        <div className="rounded-[2.5rem] border border-amber-300/15 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),rgba(0,0,0,0.55)_45%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(0,0,0,0.35))] p-8 shadow-2xl">
          <div className="text-[11px] font-black uppercase tracking-[0.35em] text-amber-300">Step 01 / 第一步</div>
          <h2 className="mt-4 text-4xl font-black tracking-[0.04em] text-white">先连接 API，再进入创作系统</h2>
          <p className="mt-5 text-sm leading-7 text-stone-400">V6 采用 API First 架构。参考链接理解、想法生成大纲、分镜规划、正式分镜、场景图提示词、单镜优化和质量检查都依赖 AI 引擎。连接成功后再选择新手 / 专业 / 导演三个不同页面。之后可随时点击顶部“API Center / 切换 API”返回此页更换模型、Key 或 direct/proxy 模式，无需重启。</p>
          <div className="mt-6"><EngineerSeal compact /></div>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {v6ModeCards.map(m => <div key={m.id} className="rounded-3xl border border-white/10 bg-black/35 p-4"><div className="text-sm font-black text-white">{m.title}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest text-amber-300">{m.en}</div><div className="mt-2 text-[11px] leading-5 text-stone-500">{m.desc}</div></div>)}
          </div>
        </div>
        <GlassPanel title="API Connection Center" subTitle="AI 引擎连接中心" defaultOpen className="!p-7">
          <div className="space-y-5">
            <FormField label="API Mode" zh="接口模式"><div className="grid grid-cols-2 gap-3">{["direct", "proxy"].map(m => <button key={m} onClick={() => setApiMode(m)} className={`rounded-2xl border px-4 py-3 text-left ${apiMode === m ? "border-emerald-400 bg-emerald-400 text-black" : "border-white/10 bg-white/5 text-stone-300"}`}><div className="text-[12px] font-black uppercase">{m}</div><div className="mt-1 text-[10px] opacity-70">{m === "direct" ? "前端输入 Key" : "后端 route 代理"}</div></button>)}</div></FormField>
            {apiMode === "direct" && <FormField label="DeepSeek API Key" zh="智算令牌"><Input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-..." /></FormField>}
            <FormField label="AI Model" zh="模型选择"><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{DEEPSEEK_V4_MODELS.map(m => <button key={m} onClick={() => setSelectedModel(m)} className={`rounded-2xl border px-4 py-3 text-left ${selectedModel === m ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300"}`}><div className="text-[12px] font-black">{m}</div><div className="mt-1 text-[10px] opacity-70">DeepSeek V4</div></button>)}</div></FormField>
            <button onClick={handleTestApi} className="w-full rounded-2xl bg-emerald-400 px-6 py-4 text-[12px] font-black uppercase tracking-widest text-black hover:bg-emerald-500">Test Connection / 测试连接</button>
            <div className="rounded-2xl border border-white/10 bg-black/50 p-4"><div className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">API Debug Console / 接口调试台</div><div className="mt-2 whitespace-pre-wrap text-[11px] text-stone-300">Status: {apiLog.status}{NL}Model: {apiLog.lastModel || selectedModel}{NL}Endpoint: {apiLog.lastEndpoint || deepSeekEndpoint}{NL}Latency: {apiLog.latencyMs ?? "-"}ms{NL}{apiLog.message}</div></div>
            {returnModeAfterApi && <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-[11px] leading-6 text-emerald-100"><b>Return Mode / 返回模式：</b>{returnModeAfterApi}<br />连接测试成功后会自动回到刚才的工作区，内容已自动保存。</div>}
          </div>
        </GlassPanel>
      </div>
    </> });
  }

  if (!workspaceMode) {
    return V6Shell({ compact: true, children: <>
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2.5rem] border border-white/10 bg-black/40 p-7 text-center shadow-2xl">
          <div className="text-[11px] font-black uppercase tracking-[0.35em] text-emerald-300">API Connected / 接口已连接</div>
          <h2 className="mt-3 text-3xl font-black text-white">选择你的工作页面</h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-stone-400">三个模式是真正不同的页面：新手模式只保留一键生成；专业模式按视频生产流程分步；导演模式保留全部高级控制台与所有原有功能。</p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {v6ModeCards.map((m, i) => <button key={m.id} onClick={() => switchWorkspaceMode(m.id)} className="group rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(0,0,0,0.45))] p-7 text-left shadow-2xl hover:border-amber-300/35 hover:bg-white/10">
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-300">Mode 0{i + 1}</div>
            <h3 className="mt-4 text-2xl font-black text-white">{m.title}</h3>
            <div className="mt-1 text-[12px] font-black uppercase tracking-widest text-stone-500">{m.en}</div>
            <p className="mt-5 min-h-[72px] text-sm leading-7 text-stone-400">{m.desc}</p>
            <div className="mt-6 inline-flex rounded-2xl bg-amber-400 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black">{m.cta}</div>
          </button>)}
        </div>
      </div>
    </> });
  }

  if (workspaceMode === "beginner") {
    return V6Shell({ children: <>
      <div className="grid grid-cols-1 gap-7 xl:grid-cols-12">
        <section className="xl:col-span-7 space-y-6">
          <GlassPanel title="Beginner Quick Create" subTitle="新手一键生成" defaultOpen>
            <div className="space-y-5">
              <FormField label="Reference URL" zh="参考链接"><Input value={referenceUrl} onChange={e => setReferenceUrl(e.target.value)} placeholder="粘贴视频号 / 抖音 / 小红书 / B站 / 公众号 / 网页链接" /></FormField>
              <FormField label="Idea Requirement" zh="一句话创作需求"><TextArea value={ideaInput} onChange={e => setIdeaInput(e.target.value)} className="min-h-[180px] text-base font-bold" placeholder="例如：写一个关于香港文化的短视频，要有剧情，要有爆款思维，1分钟内的短视频脚本。" /></FormField>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {OPT.douyinVideoTypes.slice(0, 6).map(t => <button key={t} onClick={() => setDouyinViral(p => ({ ...p, videoType: t }))} className={`rounded-2xl border px-4 py-3 text-left text-[11px] font-black ${douyinViral.videoType === t ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300"}`}>{t}</button>)}
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {OPT.shortVideoDurations.map(t => <button key={t} onClick={() => setDouyinViral(p => ({ ...p, duration: t }))} className={`rounded-2xl border px-4 py-3 text-center text-[11px] font-black ${douyinViral.duration === t ? "border-emerald-400 bg-emerald-400 text-black" : "border-white/10 bg-white/5 text-stone-300"}`}>{t}</button>)}
              </div>
              <Toggle checked={douyinViral.enabled} onChange={v => setDouyinViral(p => ({ ...p, enabled: v }))} label="Douyin Viral Logic" zh="启用抖音爆款短视频思维" />
              <button onClick={handleOneClickProduction} disabled={isOneClickRunning || isGenerating} className="w-full rounded-3xl bg-emerald-400 px-8 py-5 text-[13px] font-black uppercase tracking-widest text-black hover:bg-emerald-500 disabled:opacity-50">{isOneClickRunning ? "One-Click Running / 一键流程中" : "One-Click Production / 一键完整生成"}</button>
            </div>
          </GlassPanel>
          {outlineDraft && <GlassPanel title="Script Outline" subTitle="剧本大纲" defaultOpen><TextArea value={outlineDraft} onChange={e => setOutlineDraft(e.target.value)} className="min-h-[220px]" /><div className="mt-4 flex flex-wrap gap-3"><button onClick={handleConfirmOutline} className="rounded-2xl bg-amber-400 px-5 py-3 text-[11px] font-black uppercase text-black">Confirm Outline / 确认大纲</button><button onClick={() => handleGenerate(outlineDraft)} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase text-white">Generate Shots / 生成分镜</button></div></GlassPanel>}
        </section>
        <section className="xl:col-span-5 space-y-6">
          <GlassPanel title="Workspace Isolation" subTitle="独立工作区" defaultOpen><div className="space-y-3"><div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-[12px] leading-6 text-stone-300">新手、专业、导演三个模式的数据互不影响。需要继续深度制作时，请手动导入到其他模式。</div><div className="grid grid-cols-1 gap-3"><button onClick={() => importCurrentWorkspaceTo("pro")} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase text-white hover:bg-white/10">Import to Pro / 导入专业模式</button><button onClick={() => importCurrentWorkspaceTo("director")} className="rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-[11px] font-black uppercase text-amber-200 hover:bg-amber-400/20">Import to Director / 导入导演模式</button></div></div></GlassPanel><GlassPanel title="Workflow Status" subTitle="流程状态" defaultOpen><div className="space-y-3">{workflowStatus.map((s, i) => <div key={s.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3"><div><div className="text-[10px] font-black uppercase tracking-widest text-stone-500">0{i + 1} · {s.id}</div><div className="text-sm font-bold text-white">{s.label}</div></div><div className={`h-3 w-3 rounded-full ${s.done ? "bg-emerald-400" : "bg-stone-700"}`} /></div>)}</div></GlassPanel>
          <GlassPanel title="Storyboard Result" subTitle="分镜结果" defaultOpen><div className="space-y-3 max-h-[520px] overflow-y-auto">{shots.length ? shots.map((s, i) => <button key={i} onClick={() => { importCurrentWorkspaceTo("director"); setActiveShot(i); }} className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10"><div className="flex items-center justify-between gap-2"><div className="text-[10px] font-black text-amber-300">Shot {i + 1} · {s.duration}</div><ShotRoleBadge shot={s} /></div><div className="mt-2 text-sm font-black text-white">{s.titleZh}</div><div className="mt-2 line-clamp-2 text-[11px] text-stone-400">{s.sceneZh}</div></button>) : <div className="text-sm text-stone-500">生成后这里显示分镜卡片。</div>}</div></GlassPanel>
        </section>
      </div>
    </> });
  }

  if (workspaceMode === "pro") {
    return V6Shell({ children: <>
      <div className="grid grid-cols-1 gap-7 xl:grid-cols-12">
        <aside className="xl:col-span-3 space-y-3">{v6StepTabs.map(t => <button key={t.id} onClick={() => setProStep(t.id)} className={`w-full rounded-2xl border px-4 py-4 text-left text-[12px] font-black uppercase tracking-widest ${proStep === t.id ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"}`}>{t.label}</button>)}<div className="rounded-3xl border border-white/10 bg-black/35 p-4"><div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">Independent Workspace / 独立工作区</div><div className="mt-2 text-[11px] leading-5 text-stone-500">专业模式不会自动影响新手或导演模式。</div><button onClick={() => importCurrentWorkspaceTo("director")} className="mt-3 w-full rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-[11px] font-black uppercase text-amber-200 hover:bg-amber-400/20">Import to Director / 导入导演模式</button></div></aside>
        <section className="xl:col-span-9 space-y-6">
          {proStep === "reference" && <GlassPanel title="01 Reference Understanding" subTitle="参考链接理解" defaultOpen><div className="space-y-5"><FormField label="Reference URL" zh="参考链接"><Input value={referenceUrl} onChange={e => setReferenceUrl(e.target.value)} placeholder="https://..." /></FormField><FormField label="Manual Reference Content" zh="备用粘贴内容"><TextArea value={referenceManualContent} onChange={e => setReferenceManualContent(e.target.value)} /></FormField><FormField label="Reference Use Mode" zh="参考用途"><div className="grid grid-cols-1 gap-3 md:grid-cols-2">{OPT.referenceUseModes.map(x => <button key={x} onClick={() => setReferenceUseMode(x)} className={`rounded-2xl border px-4 py-3 text-left text-[11px] font-black ${referenceUseMode === x ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300"}`}>{x}</button>)}</div></FormField><button onClick={handleIngestReference} disabled={isIngestingReference} className="rounded-2xl bg-emerald-400 px-6 py-3 text-[12px] font-black uppercase text-black">Ingest Reference / 识别参考链接</button><div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-[12px] leading-6 text-stone-300">{referenceIngest.summary || referenceIngest.usableFacts || "链接解析结果会显示在这里。"}</div></div></GlassPanel>}
          {proStep === "script" && <GlassPanel title="02 Idea & Script Bible" subTitle="想法与剧本创作圣经" defaultOpen><div className="space-y-5"><FormField label="Idea Requirement" zh="想法需求"><TextArea value={ideaInput} onChange={e => setIdeaInput(e.target.value)} className="min-h-[140px]" /></FormField><button onClick={handleGenerateOutline} disabled={isGeneratingOutline} className="rounded-2xl bg-amber-400 px-6 py-3 text-[12px] font-black uppercase text-black">Generate Script Outline / 生成脚本大纲</button><FormField label="Script & Creative Bible" zh="剧本与创作圣经"><TextArea value={script} onChange={e => setScript(e.target.value)} className="min-h-[220px] text-base font-bold" /></FormField></div></GlassPanel>}
          {proStep === "planning" && <GlassPanel title="03 Smart Shot Planning" subTitle="智能分镜规划" defaultOpen><div className="space-y-5"><div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4"><div className="text-[11px] text-stone-300">{shotPlan.summaryZh}{NL}{shotPlan.summaryEn}</div></div><button onClick={handleGenerateShotPlan} disabled={isPlanningShots} className="rounded-2xl bg-amber-400 px-6 py-3 text-[12px] font-black uppercase text-black">Generate Shot Plan / 生成分镜规划表</button><div className="space-y-2 max-h-[420px] overflow-y-auto">{shotPlanRows.length ? shotPlanRows.map((r, i) => <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-[10px] font-black text-amber-300">#{r.shotNo || i + 1} · {r.roleZh || r.role}</div><div className="mt-1 text-sm text-white">{r.beatZh || r.beat}</div></div>) : <div className="text-sm text-stone-500">还没有分镜规划表。</div>}</div></div></GlassPanel>}
          {proStep === "shots" && <GlassPanel title="04 Generate & Review Shots" subTitle="正式分镜生成" defaultOpen><div className="space-y-5"><div className="flex flex-wrap gap-3"><button onClick={handleGenerateFromShotPlan} disabled={isGenerating} className="rounded-2xl bg-amber-400 px-6 py-3 text-[12px] font-black uppercase text-black">Generate From Plan / 按规划生成</button><button onClick={handleGenerate} disabled={isGenerating} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-[12px] font-black uppercase text-white">Smart Generate / 智能生成</button><button onClick={handleRepairMissingCoverage} disabled={!shots.length || isRepairingCoverage} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-[12px] font-black uppercase text-white">Inspect & Add Missing / 检查补镜头</button></div><div className="grid grid-cols-1 gap-3 md:grid-cols-2">{shots.length ? shots.map((s, i) => <button key={i} onClick={() => { importCurrentWorkspaceTo("director"); setActiveShot(i); }} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10"><div className="flex items-center justify-between gap-2"><div className="text-[10px] font-black text-amber-300">Shot {i + 1} · {s.duration}</div><ShotRoleBadge shot={s} /></div><div className="mt-2 text-sm font-black text-white">{s.titleZh}</div><div className="mt-2 line-clamp-2 text-[11px] text-stone-400">{s.sceneZh}</div></button>) : <div className="text-sm text-stone-500">还没有分镜。</div>}</div></div></GlassPanel>}
          {proStep === "scene" && <GlassPanel title="05 Scene Image Studio" subTitle="场景图工作室" defaultOpen><div className="space-y-5"><FormField label="Image Model Variant" zh="图像模型适配"><div className="grid grid-cols-1 gap-3 md:grid-cols-2">{OPT.sceneImageModels.map(m => <button key={m} onClick={() => setTech(p => ({ ...p, sceneImageModel: m }))} className={`rounded-2xl border px-4 py-3 text-left text-[11px] font-black ${tech.sceneImageModel === m ? "border-emerald-400 bg-emerald-400 text-black" : "border-white/10 bg-white/5 text-stone-300"}`}>{m}</button>)}</div></FormField><button onClick={handleEnhanceSceneImagePrompts} disabled={!shots.length || isEnhancingSceneImages} className="rounded-2xl bg-emerald-400 px-6 py-3 text-[12px] font-black uppercase text-black">Enhance All Scene Prompts / 增强场景图提示词</button><button onClick={handleDownloadSceneImagePack} disabled={!shots.length} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-[12px] font-black uppercase text-white">Download Prompt Pack / 下载提示词包</button></div></GlassPanel>}
          {proStep === "export" && <GlassPanel title="06 Export Center" subTitle="导出中心" defaultOpen><div className="grid grid-cols-1 gap-4 md:grid-cols-3"><button onClick={() => makeWord(rebuildFinalPrompts(shots), project, script, style, tech, modules)} disabled={!shots.length} className="rounded-2xl bg-amber-400 px-6 py-4 text-[12px] font-black uppercase text-black disabled:opacity-40">Export Word / 导出 Word</button><button onClick={handleCopySceneImagePack} disabled={!shots.length} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-[12px] font-black uppercase text-white disabled:opacity-40">Copy Scene Pack / 复制场景图包</button><button onClick={handleRunQualityCheck} disabled={!shots.length || isCheckingQuality} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-[12px] font-black uppercase text-white disabled:opacity-40">Quality Check / 质量检查</button></div>{qualityReport && <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4 text-[12px] text-stone-300">{qualityReport.summaryZh || qualityReport.summaryEn}</div>}</GlassPanel>}
        </section>
      </div>
    </> });
  }

  return V6Shell({ compact: true, children: <>
    <div className="fixed bottom-4 left-4 z-[120] rounded-2xl border border-emerald-400/30 bg-black/90 px-4 py-3 shadow-[0_0_40px_rgba(16,185,129,0.18)] backdrop-blur-xl">
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">V6.7.1 INPUT FOCUS STABLE / 输入框焦点稳定修复已生效</div>
      <div className="mt-1 select-all text-xs font-black text-white">API model = {DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0]}</div>
    </div>

    <section className="mb-5 overflow-hidden rounded-[2.2rem] border border-amber-300/15 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),rgba(0,0,0,0.6)_38%),linear-gradient(135deg,rgba(255,255,255,0.07),rgba(0,0,0,0.5))] p-5 shadow-2xl">
      <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-amber-200">Hollywood Director Flow Deck</span>
            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300">Mode-Isolated Workspace</span>
            <span className="rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">总工程师 · Haley黄衍衔 · Authentic Seal</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-[0.04em] text-white md:text-4xl">导演模式 · 好莱坞级镜头控制台</h2>
          <p className="mt-3 max-w-5xl text-sm leading-7 text-stone-400">重新设计为“左侧镜头资产库 + 中央创作中枢/当前镜头台 + 右侧标签式检查器”。导演模式的核心输入、剧本圣经、分镜规划和镜头编辑都集中在中间，右侧只作为专业检查器。</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/45 p-4 text-center"><div className="text-2xl font-black text-amber-300">{shots.length || 0}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-500">Shots</div></div>
          <div className="rounded-2xl border border-white/10 bg-black/45 p-4 text-center"><div className="text-2xl font-black text-emerald-300">{shotPlanRows.length || 0}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-500">Plan</div></div>
          <div className="rounded-2xl border border-white/10 bg-black/45 p-4 text-center"><div className="text-2xl font-black text-cyan-300">{qualityReport?.score || qualityScore}%</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-500">Quality</div></div>
          <div className="rounded-2xl border border-white/10 bg-black/45 p-4 text-center"><div className="text-2xl font-black text-white">43</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-500">Modules</div></div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-6">
        <button onClick={handleOneClickProduction} disabled={isOneClickRunning || isGenerating} className="rounded-2xl bg-emerald-400 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-black hover:bg-emerald-500 disabled:opacity-50">One-Click Production<br/><span className="opacity-70">一键完整流程</span></button>
        <button onClick={handleGenerateShotPlan} disabled={isPlanningShots} className="rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-amber-200 hover:bg-amber-400/20 disabled:opacity-40">Shot Plan<br/><span className="opacity-70">分镜规划</span></button>
        <button onClick={handleGenerateFromShotPlan} disabled={isGenerating || !shotPlanRows.length} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 disabled:opacity-40">Generate From Plan<br/><span className="opacity-70">按规划生成</span></button>
        <button onClick={handleGenerate} disabled={isGenerating} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 disabled:opacity-40">Smart Generate<br/><span className="opacity-70">智能生成</span></button>
        <button onClick={handleRepairMissingCoverage} disabled={!shots.length || isRepairingCoverage} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 disabled:opacity-40">Add Missing<br/><span className="opacity-70">检查补镜头</span></button>
        <button onClick={() => makeWord(rebuildFinalPrompts(shots), project, script, style, tech, modules)} disabled={!shots.length} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 disabled:opacity-40">Export Word<br/><span className="opacity-70">导出脚本</span></button>
      </div>
    </section>

    <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[310px_minmax(0,1fr)_420px]">
      <aside className="space-y-5 2xl:sticky 2xl:top-28 2xl:self-start">
        <GlassPanel title="Shot Library" subTitle="镜头资产库" defaultOpen>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => importCurrentWorkspaceTo("pro")} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase text-white hover:bg-white/10">Import to Pro<br/><span className="opacity-60">导入专业</span></button>
              <button onClick={resetCurrentWorkspace} className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-[10px] font-black uppercase text-red-200 hover:bg-red-400/20">Reset<br/><span className="opacity-60">重置</span></button>
            </div>
            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-4 text-[10px] leading-5 text-emerald-100/80">
              <div className="font-black uppercase tracking-[0.22em] text-emerald-300">Director Shortcuts / 导演快捷键</div>
              <div className="mt-2">← / [ 上一个镜头 · → / ] 下一个镜头</div>
              <div>Ctrl/⌘ + C 复制当前视频提示词 · Ctrl/⌘ + R 重生成当前镜头</div>
            </div>
            <div className="max-h-[48vh] space-y-3 overflow-y-auto pr-1">
              {shots.length ? shots.map((s, i) => <button key={i} onClick={() => setActiveShot(i)} className={`w-full rounded-2xl border p-4 text-left transition ${activeShot === i ? "border-amber-400 bg-amber-400 text-black shadow-[0_0_35px_rgba(251,191,36,0.18)]" : "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"}`}>
                <div className="flex items-center justify-between gap-3"><div className="text-[10px] font-black uppercase tracking-widest">Shot {i + 1}</div><div className="text-[10px] font-black opacity-70">{s.duration}</div></div>
                <div className="mt-2"><ShotRoleBadge shot={s} active={activeShot === i} /></div>
                <div className="mt-2 text-sm font-black leading-5">{s.titleZh || s.titleEn}</div>
                <div className="mt-2 line-clamp-2 text-[11px] leading-5 opacity-70">{s.sceneZh || s.sceneEn}</div>
                <div className="mt-3 flex flex-wrap gap-2 text-[9px] font-black uppercase opacity-70"><span>{s.shotSize}</span><span>·</span><span>{s.move}</span></div>
              </button>) : <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center text-sm text-stone-500">暂无镜头。先生成分镜或导入项目。</div>}
            </div>
          </div>
        </GlassPanel>

        <GlassPanel title="Plan + Versions" subTitle="规划与版本" defaultOpen>
          <div className="space-y-4">
            <details open className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer list-none text-[11px] font-black uppercase tracking-[0.18em] text-amber-200">Shot Plan / 分镜规划表</summary>
              <div className="mt-3 max-h-[260px] space-y-2 overflow-y-auto">
                {shotPlanRows.length ? shotPlanRows.map((r, i) => <div key={i} className="rounded-xl border border-white/10 bg-black/35 p-3"><div className="text-[10px] font-black text-amber-300">#{r.shotNo || i + 1} · {r.roleZh || r.role || "Role"}</div><div className="mt-1 text-[11px] leading-5 text-stone-300">{r.beatZh || r.beat || r.beatEn}</div></div>) : <div className="text-[11px] text-stone-500">还没有分镜规划表。</div>}
              </div>
            </details>
            <details className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer list-none text-[11px] font-black uppercase tracking-[0.18em] text-amber-200">History / 生成历史</summary>
              <div className="mt-3 max-h-[220px] space-y-2 overflow-y-auto">
                {generationHistory.length ? generationHistory.map(h => <button key={h.id} onClick={() => { setShots(h.shots); setActiveShot(0); setStatus(`Restored history / 已恢复历史版本 ${h.time}`); }} className="w-full rounded-xl border border-white/10 bg-black/35 p-3 text-left hover:bg-white/10"><div className="text-[10px] font-black text-amber-300">{h.time}</div><div className="mt-1 text-[11px] text-white">{h.shotCount} shots · {h.model}</div><div className="mt-1 line-clamp-2 text-[10px] text-stone-500">{h.scriptPreview}</div></button>) : <div className="text-[11px] text-stone-500">暂无历史版本。</div>}
              </div>
            </details>
            <details className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer list-none text-[11px] font-black uppercase tracking-[0.18em] text-amber-200">Prompt Versions / 提示词版本</summary>
              <div className="mt-3 max-h-[220px] space-y-2 overflow-y-auto">
                {promptVersions.length ? promptVersions.map(v => <button key={v.id} onClick={() => { if (v.shots) setShots(v.shots); setStatus(`Prompt version restored / 已恢复提示词版本 ${v.time}`); }} className="w-full rounded-xl border border-white/10 bg-black/35 p-3 text-left hover:bg-white/10"><div className="text-[10px] font-black text-cyan-300">{v.time || "Version"}</div><div className="mt-1 text-[11px] text-stone-300">{v.reason || v.label || "Prompt snapshot"}</div></button>) : <div className="text-[11px] text-stone-500">暂无提示词版本。</div>}
              </div>
            </details>
          </div>
        </GlassPanel>
      </aside>

      <section className="min-w-0 space-y-5">
        <div className="rounded-[2rem] border border-white/10 bg-black/45 p-4 backdrop-blur-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-stone-500">Director Center Desk / 导演中间工作台</div>
              <div className="mt-1 truncate text-xl font-black text-white">{directorView === "brief" ? "一句话创作需求 · 剧本圣经 · 分镜启动" : active ? `${active.titleZh || "当前镜头"} / ${active.titleEn || "Current Shot"}` : "等待分镜生成"}</div>
            </div>
            <div className="flex flex-wrap gap-2">{directorViews.map(tab => <button key={tab.id} onClick={() => setDirectorView(tab.id)} className={`rounded-2xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${directorView === tab.id ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"}`}>{tab.label}</button>)}</div>
          </div>
        </div>

        <GlassPanel title={directorView === "brief" ? "Director Creative Core" : "Current Shot Editor"} subTitle={directorView === "brief" ? "导演模式重点输入区" : "当前镜头专业编辑区"} defaultOpen>
          {directorView === "brief" ? <div className="space-y-6">
            <div className="rounded-[2rem] border border-amber-300/15 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.14),rgba(0,0,0,0.55)_42%)] p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black uppercase tracking-[0.26em] text-amber-200">One-Line Creative Brief / 导演模式一句话创作需求</div>
                  <p className="mt-2 text-sm leading-7 text-stone-400">这里是导演模式的核心入口。先把创作需求、参考链接、人物信息和剧本圣经集中在中间，再进入分镜规划与镜头编辑。</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={handleIngestReference} disabled={isIngestingReference} className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-200 disabled:opacity-50">Analyze Ref / 识别参考</button>
                  <button onClick={handleGenerateOutline} disabled={isGeneratingOutline} className="rounded-2xl bg-amber-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black disabled:opacity-50">Generate Outline / 生成大纲</button>
                  <button onClick={handleOneClickProduction} disabled={isOneClickRunning || isGenerating} className="rounded-2xl bg-emerald-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black disabled:opacity-50">One-Click / 一键流程</button>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                <FormField label="Director Creative Requirement" zh="一句话创作需求"><TextArea value={ideaInput} onChange={e => setIdeaInput(e.target.value)} rows={7} className="min-h-[190px] text-base font-bold" placeholder="例如：写一个关于香港文化的短视频，要有剧情，要有爆款思维，1分钟内的短视频脚本。" /></FormField>
                <div className="grid grid-cols-1 gap-4">
                  <FormField label="Project" zh="项目名称"><Input value={project} onChange={e => setProject(e.target.value)} /></FormField>
                  <FormField label="Reference URL" zh="参考链接"><Input value={referenceUrl} onChange={e => setReferenceUrl(e.target.value)} placeholder="https://..." /></FormField>
                  <div className="grid grid-cols-2 gap-3">
                    <Toggle checked={douyinViral.enabled} onChange={v => setDouyinViral(p => ({ ...p, enabled: v }))} label="Douyin Viral" zh="抖音爆款" />
                    <Toggle checked={tech.generateSceneImagePrompt} onChange={v => setTech(p => ({ ...p, generateSceneImagePrompt: v }))} label="Scene Image" zh="场景图" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                  <div className="mb-4 flex items-center justify-between gap-3"><div><div className="text-[12px] font-black uppercase tracking-[0.24em] text-amber-200">Script & Creative Bible / 剧本圣经</div><div className="mt-1 text-[11px] text-stone-500">导演模式主文本，正式分镜会以这里为最高优先级。</div></div>{outlineDraft && <button onClick={handleConfirmOutline} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase text-white">Confirm Outline / 确认大纲</button>}</div>
                  <TextArea value={script} onChange={e => setScript(e.target.value)} rows={10} className="min-h-[300px] text-base font-bold" placeholder="生成大纲后确认到这里，或直接输入完整剧本/创作圣经。" />
                </div>
                {outlineDraft && <div className="rounded-3xl border border-amber-300/15 bg-amber-400/5 p-5"><div className="mb-3 text-[12px] font-black uppercase tracking-[0.24em] text-amber-200">Outline Draft / 待确认大纲</div><TextArea value={outlineDraft} onChange={e => setOutlineDraft(e.target.value)} rows={7} className="min-h-[210px]" /></div>}
              </div>
              <div className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                  <div className="mb-4 text-[12px] font-black uppercase tracking-[0.24em] text-emerald-200">Reference + Viral Strategy / 参考与爆款策略</div>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField label="Manual Reference" zh="备用参考内容"><TextArea value={referenceManualContent} onChange={e => setReferenceManualContent(e.target.value)} rows={4} placeholder="如果链接无法读取，粘贴视频文案、标题、评论区重点或人物资料。" /></FormField>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField label="Reference Use" zh="参考用途"><Select items={OPT.referenceUseModes} value={referenceUseMode} onChange={setReferenceUseMode} /></FormField>
                      <FormField label="Viral Type" zh="短视频类型"><Select items={OPT.douyinVideoTypes} value={douyinViral.videoType} onChange={v => setDouyinViral(p => ({ ...p, videoType: v }))} /></FormField>
                      <FormField label="Hook Style" zh="3秒钩子"><Select items={OPT.viralHookStyles} value={douyinViral.hookStyle} onChange={v => setDouyinViral(p => ({ ...p, hookStyle: v }))} /></FormField>
                      <FormField label="Duration" zh="短视频时长"><Select items={OPT.shortVideoDurations} value={douyinViral.duration} onChange={v => setDouyinViral(p => ({ ...p, duration: v }))} /></FormField>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-[11px] leading-6 text-stone-300">
                      <div className="font-black text-emerald-300">Reference Status / 参考识别状态：{referenceIngest.status}</div>
                      <div className="mt-2 whitespace-pre-wrap">{referenceIngest.summary || referenceIngest.usableFacts || "暂无参考解析。可输入链接后点击识别，或粘贴备用参考内容。"}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                  <div className="mb-4 text-[12px] font-black uppercase tracking-[0.24em] text-cyan-200">Shot Launch Console / 分镜启动台</div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField label="Shot Count Mode" zh="分镜模式"><Select items={OPT.shotCountModes} value={tech.shotCountMode} onChange={v => setTech(p => ({ ...p, shotCountMode: v }))} /></FormField>
                    <FormField label="Smart Range" zh="智能范围"><Select items={OPT.shotRanges} value={tech.shotRange} onChange={v => setTech(p => ({ ...p, shotRange: v }))} /></FormField>
                    <FormField label="Shot Density" zh="镜头密度"><Select items={OPT.shotDensities} value={tech.shotDensity} onChange={v => setTech(p => ({ ...p, shotDensity: v }))} /></FormField>
                    <FormField label="Director Style" zh="导演风格"><Select items={DIRECTOR_STYLES.map(s => s.name)} value={style.name} onChange={v => setStyle(DIRECTOR_STYLES.find(s => s.name === v) || DIRECTOR_STYLES[0])} /></FormField>
                  </div>
                  <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-[11px] leading-6 text-stone-300">{shotPlan.summaryZh}{NL}{shotPlan.summaryEn}</div>
                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <button onClick={handleGenerateShotPlan} disabled={isPlanningShots} className="rounded-2xl bg-amber-400 px-4 py-3 text-[10px] font-black uppercase text-black disabled:opacity-50">Shot Plan / 分镜规划</button>
                    <button onClick={handleGenerateFromShotPlan} disabled={isGenerating || !shotPlanRows.length} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase text-white disabled:opacity-40">From Plan / 按规划生成</button>
                    <button onClick={handleGenerate} disabled={isGenerating} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase text-white disabled:opacity-40">Smart Generate / 智能生成</button>
                  </div>
                </div>
              </div>
            </div>
          </div> : active ? <div className="space-y-6">
            {directorView === "scene" && <div className="space-y-6">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <FormField label="Visual ZH" zh="中文画面"><TextArea value={active.sceneZh} rows={6} onChange={e => updateActiveShot({ sceneZh: e.target.value })} /></FormField>
                <FormField label="Visual EN" zh="英文画面"><TextArea value={active.sceneEn} rows={6} onChange={e => updateActiveShot({ sceneEn: e.target.value })} /></FormField>
                <FormField label="Dialogue ZH" zh="中文台词"><TextArea value={active.dialogueZh} rows={3} onChange={e => updateActiveShot({ dialogueZh: e.target.value })} /></FormField>
                <FormField label="Dialogue EN" zh="英文台词"><TextArea value={active.dialogueEn} rows={3} onChange={e => updateActiveShot({ dialogueEn: e.target.value })} /></FormField>
                <FormField label="AV Logic ZH" zh="中文视听逻辑"><TextArea value={active.avLogicZh} rows={4} onChange={e => updateActiveShot({ avLogicZh: e.target.value })} /></FormField>
                <FormField label="AV Logic EN" zh="英文视听逻辑"><TextArea value={active.avLogicEn} rows={4} onChange={e => updateActiveShot({ avLogicEn: e.target.value })} /></FormField>
                <FormField label="Blocking ZH" zh="中文调度"><TextArea value={active.blockingZh} rows={4} onChange={e => updateActiveShot({ blockingZh: e.target.value })} /></FormField>
                <FormField label="Blocking EN" zh="英文调度"><TextArea value={active.blockingEn} rows={4} onChange={e => updateActiveShot({ blockingEn: e.target.value })} /></FormField>
              </div>
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <FormField label="Shot Size" zh="景别"><Select items={OPT.shotSizes} value={active.shotSize} onChange={v => updateActiveShot({ shotSize: v })} /></FormField>
                <FormField label="Camera" zh="摄影机"><Select items={OPT.cameras} value={active.camera} onChange={v => updateActiveShot({ camera: v })} /></FormField>
                <FormField label="Lens" zh="焦段"><Select items={OPT.lensFocals} value={active.lens} onChange={v => updateActiveShot({ lens: v })} /></FormField>
                <FormField label="Movement" zh="运镜"><Select items={OPT.moves} value={active.move} onChange={v => updateActiveShot({ move: v })} /></FormField>
                <FormField label="Stabilizer" zh="稳定"><Select items={OPT.stabilizers} value={active.stabilizer} onChange={v => updateActiveShot({ stabilizer: v })} /></FormField>
                <FormField label="Lighting" zh="光影"><Select items={OPT.lights} value={active.light} onChange={v => updateActiveShot({ light: v })} /></FormField>
                <FormField label="Composition" zh="构图"><Select items={OPT.compositions} value={active.compositionType} onChange={v => updateActiveShot({ compositionType: v })} /></FormField>
                <FormField label="Edit" zh="剪辑"><Select items={OPT.edits} value={active.editType} onChange={v => updateActiveShot({ editType: v })} /></FormField>
              </div>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <FormField label="Omni Multi-Parameter" zh="全能多参"><TextArea value={`${active.omniParamPromptZh}${NL}${active.omniParamPromptEn}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ omniParamPromptZh: zh, omniParamPromptEn: en.join(NL) }); }} /></FormField>
                <FormField label="Platform Params" zh="平台参数"><TextArea value={`${active.platformPromptZh}${NL}${active.platformPromptEn}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ platformPromptZh: zh, platformPromptEn: en.join(NL) }); }} /></FormField>
                <FormField label="Sound" zh="声音设计"><TextArea value={`${active.soundDesignZh}${NL}${active.soundDesignEn}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ soundDesignZh: zh, soundDesignEn: en.join(NL) }); }} /></FormField>
                <FormField label="Continuity Check" zh="连续性检查"><TextArea value={`${active.continuityCheckZh}${NL}${active.continuityCheckEn}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ continuityCheckZh: zh, continuityCheckEn: en.join(NL) }); }} /></FormField>
              </div>
            </div>}

            {directorView === "continuity" && <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <FormField label="Story State" zh="故事状态引擎"><TextArea value={`${active.storyStateZh || ""}${NL}${active.storyStateEn || ""}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ storyStateZh: zh, storyStateEn: en.join(NL) }); }} /></FormField>
              <FormField label="Shot Dependency" zh="镜头承接关系"><TextArea value={`上一镜头：${active.previousShotLinkZh || ""}${NL}开始：${active.actionStartZh || ""}${NL}结束：${active.actionEndZh || ""}${NL}下一钩子：${active.nextShotHookZh || ""}${NL}Cut: ${active.cutMotivationZh || ""}`} rows={5} onChange={e => updateActiveShot({ previousShotLinkZh: e.target.value })} /></FormField>
              <FormField label="Spatial Geography" zh="场景空间地图"><TextArea value={`${active.spatialGeographyZh || ""}${NL}${active.spatialGeographyEn || ""}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ spatialGeographyZh: zh, spatialGeographyEn: en.join(NL) }); }} /></FormField>
              <FormField label="Axis & Eyeline" zh="轴线与视线"><TextArea value={`${active.axisEyelineZh || ""}${NL}${active.axisEyelineEn || ""}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ axisEyelineZh: zh, axisEyelineEn: en.join(NL) }); }} /></FormField>
              <FormField label="Performance Direction" zh="表演指导"><TextArea value={`${active.performanceDirectionZh || ""}${NL}${active.performanceDirectionEn || ""}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ performanceDirectionZh: zh, performanceDirectionEn: en.join(NL) }); }} /></FormField>
              <FormField label="Realism Layer" zh="实拍细腻层"><TextArea value={`${active.realismLayerZh || ""}${NL}${active.realismLayerEn || ""}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ realismLayerZh: zh, realismLayerEn: en.join(NL) }); }} /></FormField>
              <FormField label="Lens Grammar" zh="焦段语法曲线"><TextArea value={`${active.lensGrammarZh || ""}${NL}${active.lensGrammarEn || ""}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ lensGrammarZh: zh, lensGrammarEn: en.join(NL) }); }} /></FormField>
              <FormField label="Coverage & Inspector" zh="覆盖拍法与审片"><TextArea value={`覆盖：${active.coveragePlanZh || ""}${NL}审片：${active.continuityInspectorZh || ""}${NL}${active.coveragePlanEn || ""}${NL}${active.continuityInspectorEn || ""}`} rows={5} onChange={e => { const [coverageZh = "", inspectorZh = "", coverageEn = "", ...rest] = e.target.value.split(NL); updateActiveShot({ coveragePlanZh: coverageZh.replace(/^覆盖：/, ""), continuityInspectorZh: inspectorZh.replace(/^审片：/, ""), coveragePlanEn: coverageEn, continuityInspectorEn: rest.join(NL) }); }} /></FormField>
            </div>}

            {directorView === "prompts" && <div className="space-y-6">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <FormField label="Keyframe Moment" zh="关键帧瞬间"><TextArea value={`${active.keyframeMomentZh || ""}${NL}${active.keyframeMomentEn || ""}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ keyframeMomentZh: zh, keyframeMomentEn: en.join(NL) }); }} /></FormField>
                <FormField label="Scene Image Prompt" zh="场景图提示词"><TextArea value={`${active.sceneImagePromptZh || ""}${NL}${active.sceneImagePromptEn || ""}`} rows={5} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ sceneImagePromptZh: zh, sceneImagePromptEn: en.join(NL) }); }} /></FormField>
                <FormField label="Scene Image Negative" zh="场景图负面"><TextArea value={`${active.sceneImageNegativeZh || ""}${NL}${active.sceneImageNegativeEn || ""}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ sceneImageNegativeZh: zh, sceneImageNegativeEn: en.join(NL) }); }} /></FormField>
                <FormField label="Scene Image Continuity" zh="场景图连续性"><TextArea value={`${active.sceneImageContinuityNotesZh || ""}${NL}${active.sceneImageContinuityNotesEn || ""}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ sceneImageContinuityNotesZh: zh, sceneImageContinuityNotesEn: en.join(NL) }); }} /></FormField>
              </div>
              <div className="rounded-3xl border border-emerald-500/10 bg-emerald-500/5 p-5"><div className="flex items-center justify-between gap-3"><div><div className="text-[12px] font-black uppercase tracking-[0.25em] text-emerald-200">Scene Image Prompt / 场景图提示词</div><div className="mt-1 text-[11px] text-stone-500">图生视频首帧 / 分镜板 / 概念图</div></div><CopyButton text={liveSceneImagePrompt} /></div><pre className="mt-4 max-h-[340px] overflow-y-auto whitespace-pre-wrap break-words rounded-2xl bg-black/45 p-5 font-mono text-[12px] leading-relaxed text-emerald-100/75">{liveSceneImagePrompt}</pre></div>
              <div className="rounded-3xl border border-cyan-500/10 bg-cyan-500/5 p-5"><div className="flex items-center justify-between gap-3"><div><div className="text-[12px] font-black uppercase tracking-[0.25em] text-cyan-200">AI Video Prompt / 视频生成提示词</div><div className="mt-1 text-[11px] text-stone-500">最终视频模型提示词</div></div><CopyButton text={livePrompt} /></div><pre className="mt-4 max-h-[420px] overflow-y-auto whitespace-pre-wrap break-words rounded-2xl bg-black/45 p-5 font-mono text-[12px] leading-relaxed text-cyan-100/75">{livePrompt}</pre></div>
            </div>}
          </div> : <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center"><div className="text-lg font-black text-white">还没有可编辑镜头</div><p className="mt-2 text-sm text-stone-500">先生成分镜规划，再按规划生成镜头。导演模式数据独立，不会影响新手和专业模式。</p><div className="mt-6 flex flex-wrap justify-center gap-3"><button onClick={handleGenerateShotPlan} className="rounded-2xl bg-amber-400 px-5 py-3 text-[11px] font-black uppercase text-black">Generate Shot Plan / 生成规划</button><button onClick={handleGenerate} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase text-white">Smart Generate / 智能生成</button></div></div>}
        </GlassPanel>
      </section>

      <aside className="space-y-5 2xl:sticky 2xl:top-28 2xl:self-start">
        <GlassPanel title="Director Inspector" subTitle="标签式导演检查器" defaultOpen>
          <div className="mb-4 grid grid-cols-2 gap-2">{directorInspectorTabs.map(tab => <button key={tab.id} onClick={() => setDirectorInspectorTab(tab.id)} className={`rounded-2xl border px-3 py-2 text-[10px] font-black uppercase tracking-widest ${directorInspectorTab === tab.id ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"}`}>{tab.label}</button>)}</div>
          <div className="max-h-[72vh] overflow-y-auto pr-1">
            {directorInspectorTab === "setup" && <div className="space-y-4">
              <FormField label="Project" zh="项目名称"><Input value={project} onChange={e => setProject(e.target.value)} /></FormField>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-[11px] leading-6 text-stone-300">Status: {apiLog.status}{NL}Model: {apiLog.lastModel || selectedModel}{NL}Endpoint: {apiLog.lastEndpoint || deepSeekEndpoint}{NL}Script FP: {apiLog.scriptFingerprint || scriptFingerprint(script)}{NL}{apiLog.message}</div>
              <FormField label="Thinking Mode" zh="思考模式"><Select items={OPT.thinkingModes} value={thinkingMode} onChange={setThinkingMode} /></FormField>
              <FormField label="Reasoning Effort" zh="推理强度"><Select items={OPT.reasoningEfforts} value={reasoningEffort} onChange={setReasoningEffort} /></FormField>
              <FormField label="Reference URL" zh="参考链接"><Input value={referenceUrl} onChange={e => setReferenceUrl(e.target.value)} placeholder="https://..." /></FormField>
              <FormField label="Reference Use" zh="参考用途"><Select items={OPT.referenceUseModes} value={referenceUseMode} onChange={setReferenceUseMode} /></FormField>
              <FormField label="Manual Reference" zh="备用内容"><TextArea value={referenceManualContent} onChange={e => setReferenceManualContent(e.target.value)} rows={3} /></FormField>
              <button onClick={handleIngestReference} disabled={isIngestingReference} className="w-full rounded-2xl bg-emerald-400 px-4 py-3 text-[11px] font-black uppercase text-black disabled:opacity-50">{isIngestingReference ? "Reading... / 识别中" : "Analyze Reference / 识别参考"}</button>
              <Toggle checked={douyinViral.enabled} onChange={v => setDouyinViral(p => ({ ...p, enabled: v }))} label="Douyin Viral Logic" zh="抖音爆款思维" />
              <FormField label="Viral Type" zh="短视频类型"><Select items={OPT.douyinVideoTypes} value={douyinViral.videoType} onChange={v => setDouyinViral(p => ({ ...p, videoType: v }))} /></FormField>
              <FormField label="Hook Style" zh="3秒钩子"><Select items={OPT.viralHookStyles} value={douyinViral.hookStyle} onChange={v => setDouyinViral(p => ({ ...p, hookStyle: v }))} /></FormField>
            </div>}

            {directorInspectorTab === "look" && <div className="space-y-4">
              <FormField label="Idea Backup" zh="想法需求备份"><TextArea value={ideaInput} onChange={e => setIdeaInput(e.target.value)} rows={4} /></FormField>
              <button onClick={handleGenerateOutline} disabled={isGeneratingOutline} className="w-full rounded-2xl bg-amber-400 px-4 py-3 text-[11px] font-black uppercase text-black disabled:opacity-50">{isGeneratingOutline ? "Writing... / 生成中" : "Generate Outline / 生成大纲"}</button>
              {outlineDraft && <button onClick={handleConfirmOutline} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase text-white">Confirm Outline / 确认大纲</button>}
              <FormField label="Script & Creative Bible" zh="剧本圣经"><TextArea value={script} onChange={e => setScript(e.target.value)} rows={6} /></FormField>
              <FormField label="Negative Prompt" zh="负面提示词"><TextArea value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} rows={3} /></FormField>
              <FormField label="Director Style" zh="导演风格"><Select items={DIRECTOR_STYLES.map(s => s.name)} value={style.name} onChange={v => setStyle(DIRECTOR_STYLES.find(s => s.name === v) || DIRECTOR_STYLES[0])} /></FormField>
              <FormField label="Platform" zh="输出平台"><Select items={OPT.platforms} value={tech.platform} onChange={v => setTech(p => ({ ...p, platform: v }))} /></FormField>
              <FormField label="Aspect Ratio" zh="画幅比例"><Select items={OPT.ratios} value={tech.ratio} onChange={v => setTech(p => ({ ...p, ratio: v }))} /></FormField>
              <div className="grid grid-cols-1 gap-3"><FormField label="Shot Size Lock" zh="景别锁"><Select items={OPT.shotSizes} value={tech.shotSizeLock} onChange={v => setTech(p => ({ ...p, shotSizeLock: v }))} /></FormField><FormField label="Camera Lock" zh="摄影机锁"><Select items={OPT.cameras} value={tech.cameraLock} onChange={v => setTech(p => ({ ...p, cameraLock: v }))} /></FormField><FormField label="Lens Lock" zh="焦段锁"><Select items={OPT.lensFocals} value={tech.lensLock} onChange={v => setTech(p => ({ ...p, lensLock: v }))} /></FormField><FormField label="Movement Lock" zh="运镜锁"><Select items={OPT.moves} value={tech.movementLock} onChange={v => setTech(p => ({ ...p, movementLock: v }))} /></FormField><FormField label="Lighting Lock" zh="光影锁"><Select items={OPT.lights} value={tech.lightingLock} onChange={v => setTech(p => ({ ...p, lightingLock: v }))} /></FormField></div>
            </div>}

            {directorInspectorTab === "planning" && <div className="space-y-4">
              <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-[11px] leading-6 text-stone-300">{shotPlan.summaryZh}{NL}{shotPlan.summaryEn}</div>
              <FormField label="Shot Count Mode" zh="分镜数量模式"><Select items={OPT.shotCountModes} value={tech.shotCountMode} onChange={v => setTech(p => ({ ...p, shotCountMode: v }))} /></FormField>
              <FormField label="Smart Range" zh="智能范围"><Select items={OPT.shotRanges} value={tech.shotRange} onChange={v => setTech(p => ({ ...p, shotRange: v }))} /></FormField>
              <FormField label="Duration" zh="预计时长"><Select items={OPT.videoDurations} value={tech.videoDuration} onChange={v => setTech(p => ({ ...p, videoDuration: v }))} /></FormField>
              <FormField label="Density" zh="镜头密度"><Select items={OPT.shotDensities} value={tech.shotDensity} onChange={v => setTech(p => ({ ...p, shotDensity: v }))} /></FormField>
              <Toggle checked={tech.allowAddMissingShots} onChange={v => setTech(p => ({ ...p, allowAddMissingShots: v }))} label="Allow Add Missing" zh="允许自动补镜头" />
              <button onClick={handleGenerateShotPlan} disabled={isPlanningShots} className="w-full rounded-2xl bg-amber-400 px-4 py-3 text-[11px] font-black uppercase text-black disabled:opacity-50">Generate Shot Plan / 生成分镜规划</button>
              <button onClick={handleGenerateFromShotPlan} disabled={isGenerating || !shotPlanRows.length} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase text-white disabled:opacity-40">Generate From Plan / 按规划生成</button>
            </div>}

            {directorInspectorTab === "tools" && <div className="space-y-4">
              <FormField label="Optimization Mode" zh="优化模式"><Select items={OPT.shotOptimizeModes} value={shotOptimizationMode} onChange={setShotOptimizationMode} /></FormField>
              <button onClick={handleOptimizeCurrentShot} disabled={!active || isOptimizingShot} className="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-[11px] font-black uppercase text-black disabled:opacity-50">{isOptimizingShot ? "Optimizing... / 优化中" : "Optimize Current Shot / 优化当前镜头"}</button>
              <button onClick={handleRegenerateCurrentShot} disabled={!active || isRegeneratingShot} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase text-white disabled:opacity-40">{isRegeneratingShot ? "Regenerating... / 重生成中" : "Regenerate With Context / 上下文重生成"}</button>
              <button onClick={handleRepairMissingCoverage} disabled={!shots.length || isRepairingCoverage} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase text-white disabled:opacity-40">Inspect & Add Missing / 检查补镜头</button>
              <Toggle checked={tech.bilingualDialogue} onChange={v => setTech(p => ({ ...p, bilingualDialogue: v }))} label="Bilingual Dialogue" zh="中英文双语台词" />
              <Toggle checked={tech.professionalAV} onChange={v => setTech(p => ({ ...p, professionalAV: v }))} label="Professional AV Logic" zh="专业视听语言逻辑" />
              <Toggle checked={tech.includeSound} onChange={v => setTech(p => ({ ...p, includeSound: v }))} label="Sound & Transition" zh="声音与转场" />
              <Toggle checked={tech.generateSceneImagePrompt} onChange={v => setTech(p => ({ ...p, generateSceneImagePrompt: v }))} label="Scene Image Prompt" zh="场景图提示词" />
              <FormField label="Image Model" zh="图像模型"><Select items={OPT.sceneImageModels} value={tech.sceneImageModel} onChange={v => setTech(p => ({ ...p, sceneImageModel: v }))} /></FormField>
              <FormField label="Scene Mode" zh="场景图模式"><Select items={OPT.sceneImageModes} value={tech.sceneImageMode} onChange={v => setTech(p => ({ ...p, sceneImageMode: v }))} /></FormField>
              <button onClick={handleEnhanceSceneImagePrompts} disabled={!shots.length || isEnhancingSceneImages} className="w-full rounded-2xl bg-emerald-400 px-4 py-3 text-[11px] font-black uppercase text-black disabled:opacity-50">{isEnhancingSceneImages ? "Enhancing... / 增强中" : "Enhance All Scene Prompts / 增强全部场景图"}</button>
              <button onClick={handleCopySceneImagePack} disabled={!shots.length} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase text-white disabled:opacity-40">Copy Scene Prompt Pack / 复制场景图包</button>
              <button onClick={handleDownloadSceneImagePack} disabled={!shots.length} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase text-white disabled:opacity-40">Download Prompt Pack / 下载提示词包</button>
            </div>}

            {directorInspectorTab === "modules" && <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">{moduleKeys.map(k => <button key={k} onClick={() => setActiveModule(k)} className={`rounded-xl border px-3 py-2 text-left text-[10px] font-black ${activeModule === k ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-black/35 text-stone-400 hover:bg-white/10"}`}><div className="uppercase">{modules[k].title}</div><div className="mt-1 opacity-70">{modules[k].zh}</div></button>)}</div>
              <div className="rounded-2xl border border-white/10 bg-black/35 p-4"><div className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-200">{safeActiveModule.title} / {safeActiveModule.zh}</div><div className="mt-4 space-y-3 max-h-[430px] overflow-y-auto">{activeModule === "commercial" && <FormField label="Production Mode" zh="制作模式"><Select items={OPT.productionModes} value={modules.commercial.fields.mode} onChange={v => updateModuleField("commercial", "mode", v)} /></FormField>}{activeModule === "versions" && <FormField label="Version Preset" zh="版本预设"><Select items={OPT.versionModes} value={modules.versions.fields.selected.split(",")[0] || OPT.versionModes[0]} onChange={v => updateModuleField("versions", "selected", v)} /></FormField>}{Object.entries(safeActiveModule.fields || {}).filter(([key]) => !(activeModule === "commercial" && key === "mode")).map(([key, value]) => <FormField key={key} label={key} zh="模块参数"><TextArea value={value} onChange={e => updateModuleField(safeActiveModuleKey, key, e.target.value)} rows={3} /></FormField>)}</div></div>
            </div>}

            {directorInspectorTab === "review" && <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/35 p-5 text-center"><div className="text-5xl font-black text-amber-400">{qualityReport?.score || qualityScore}%</div><div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">Quality Stability</div><button onClick={handleRunQualityCheck} disabled={isCheckingQuality} className="mt-4 w-full rounded-2xl bg-amber-400 px-4 py-3 text-[11px] font-black uppercase text-black disabled:opacity-50">{isCheckingQuality ? "Checking... / 检查中" : "Run Quality Check / 生成质量报告"}</button></div>
              {qualityReport && <div className="rounded-2xl border border-white/10 bg-black/40 p-4"><div className="whitespace-pre-wrap text-[11px] leading-6 text-stone-300">{qualityReport.summaryZh || qualityReport.summaryEn}</div>{Array.isArray(qualityReport.problems) && <div className="mt-3 space-y-2 max-h-[240px] overflow-y-auto">{qualityReport.problems.slice(0, 8).map((p, i) => <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3"><div className="text-[10px] font-black text-red-300">{p.level || "Note"} · Shot {p.shot || "-"}</div><div className="mt-1 text-[11px] text-stone-300">{p.zh || p.en}</div><div className="mt-1 text-[10px] text-stone-500">{p.fixZh || p.fixEn}</div></div>)}</div>}</div>}
            </div>}
          </div>
        </GlassPanel>
      </aside>
    </div>
  </> });

}