"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const NL = "\n";
const AUTO = "AI_AUTO / AI 自动逐镜设计";
const DEEPSEEK_V4_MODELS = ["deepseek-v4-flash", "deepseek-v4-pro"];
const BUILD_VERSION = "V8.5 NEOWOW VISUAL CANVAS · 北极星AIGC电影级工业系统 · 图像/视频生产画布 · Light Pro UI";
const LOCAL_STORAGE_KEY = "polaris_aigc_cinema_v8_director_canvas_workspace_store";
const ENGINEER_NAME = "Haley黄衍衔";
const ENGINEER_ROLE = "Chief Engineer / 总工程师";
const AUTH_SEAL_ID = "POLARIS-HYX-V8-AUTHENTIC-CHIEF-ENGINEER-SEAL";
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
  imageApiProviders: ["Volcengine Seedream / 火山即梦 Seedream", "OpenAI Images / OpenAI 生图", "Tencent Hunyuan / 腾讯混元", "Replicate Flux / Replicate Flux", "Custom Image API / 自定义图片接口"],
  imageApiModels: ["doubao-seedream-5-0-260128", "doubao-seedream-5-0-lite", "doubao-seedream-4-5-251128", "doubao-seedream-4-0-250828", "gpt-image-1", "hunyuan-image", "flux-1.1-pro", "custom-image-model"],
  keyframeBatchModes: ["One per shot / 每镜一张", "Four candidates / 每镜四张候选", "Hero frame only / 只生成主视觉", "Selected shots only / 只生成选中镜头"],
  visualLockTypes: ["Character Lock / 角色锁定", "Location Lock / 场景锁定", "Style Lock / 风格锁定", "Prop Lock / 道具锁定", "First Frame Lock / 首帧构图锁定"],
  videoRouteTargets: ["Auto Route / 自动路由", "Kling / 可灵", "Runway", "Luma", "Pika", "Sora / Veo", "Image-to-Video First / 优先图生视频"],
  sceneImageBatchFormats: ["TXT Prompt Pack / TXT提示词包", "JSON Data / JSON数据", "CSV Table / CSV表格"],
  referenceUseModes: ["Reference Content Structure / 参考内容结构", "Reference Viral Rhythm / 参考爆款节奏", "Reference Visual Style / 参考视觉风格", "Reference Character Info / 参考人物信息", "Reference Mood Only / 只参考情绪氛围"],
  douyinVideoTypes: ["人物介绍 / Character Profile", "校园宣传 / Campus Promo", "招生宣传 / Enrollment Promo", "个人IP / Personal IP", "励志故事 / Inspirational Story", "剧情短片 / Narrative Short", "采访混剪 / Interview Montage", "反差人设 / Contrast Persona", "情绪共鸣 / Emotional Resonance"],
  viralHookStyles: ["3秒反差钩子 / 3s Contrast Hook", "悬念问题钩子 / Suspense Question Hook", "人物标签钩子 / Character Label Hook", "情绪共鸣钩子 / Emotional Resonance Hook", "高光成就钩子 / Highlight Achievement Hook", "冲突反转钩子 / Conflict Reversal Hook"],
  viralIntensities: ["Light / 轻度爆款", "Balanced / 平衡爆款", "Aggressive / 强爆款"],
  shortVideoDurations: ["30s以内 / Under 30s", "45s以内 / Under 45s", "60s以内 / Under 60s", "90s以内 / Under 90s"],
  contentEngineModes: ["Cinematic Drama / 电影剧情感", "Mini Drama Hook / 短剧强钩子", "Douyin Viral / 抖音爆款", "Premium Brand Film / 高级宣传片", "Character Documentary / 人物纪录片", "Commercial Ad / 商业广告", "Poetic Cultural Travel / 文旅诗意", "Campus Youth / 校园青春", "Black Humor / 黑色幽默", "Twist Suspense / 反转悬疑"],
  promptStrengthLevels: ["Light / 轻提示", "Balanced / 平衡", "Detailed / 细节增强", "Director-Level / 导演级", "Hyper-Controlled / 强控制"],
  promptLengthModes: ["Short / 短版", "Standard / 标准版", "Detailed / 详细版", "Director Full / 导演完整版"],
  promptRewriteModes: ["More Cinematic / 更电影感", "More Realistic / 更真实", "Premium Commercial / 高级广告感", "Douyin Viral / 爆款短视频", "Kling Optimized / 更适合可灵", "Jimeng Optimized / 更适合即梦", "Runway Optimized / 更适合Runway", "Image-to-Video / 更适合图生视频", "Shorter Direct / 更短更直接", "Director Full / 更导演级"],
  promptRefineModes: ["Cinematic Realism / 强化电影实拍感", "Action Stability / 强化动作稳定性", "Character Performance / 强化人物表演", "Continuity Control / 强化连续性", "Kling Practical / 强化可灵适配", "Jimeng Practical / 强化即梦适配", "Image-to-Video Control / 强化图生视频", "Short Direct Prompt / 压缩成短提示词"],
  outlineRewriteModes: ["Stronger Conflict / 加强冲突", "Stronger Twist / 加强反转", "Stronger Character Memory / 加强人物记忆点", "Stronger 3s Hook / 加强3秒钩子", "Stronger Ending Line / 加强结尾金句", "Mini Drama Tension / 加强短剧爽感", "Cinematic Emotion / 加强电影情绪", "Commercial Spread / 加强商业传播"],
};

const PROJECT_TEMPLATES = [
  { id: "hk-culture", title: "香港文化短视频", type: "文化短视频", idea: "写一个关于香港文化的短视频，要有剧情，要有爆款思维，1分钟内的短视频脚本。", genre: "Documentary / 纪录片", duration: "60s", density: "Detailed / 细腻实拍覆盖", tone: "港风、烟火气、霓虹、怀旧与现代交织 / Hong Kong street culture, neon nostalgia and modern rhythm" },
  { id: "person-intro", title: "人物介绍短视频", type: "人物介绍", idea: "写一个真实人物介绍短视频，要有剧情、有记忆点、有爆款开头，1分钟内。", genre: "Drama / 剧情片", duration: "60s", density: "Balanced / 标准电影节奏", tone: "真实、克制、青春、人物高光 / authentic, restrained, youthful, character highlight" },
  { id: "campus-promo", title: "校园宣传片", type: "校园宣传", idea: "写一个校园宣传短视频，要有故事线、青春感和招生传播点，1分钟内。", genre: "Commercial / 商业广告", duration: "60s", density: "Balanced / 标准电影节奏", tone: "阳光、青春、希望、校园氛围 / bright, youthful, hopeful campus mood" },
  { id: "brand-film", title: "品牌故事片", type: "品牌宣传", idea: "写一个品牌故事短视频，要有情绪共鸣、高级广告片质感和清晰转化点，60秒内。", genre: "Commercial / 商业广告", duration: "60s", density: "Commercial Punchy / 广告强节奏", tone: "高级、克制、商业质感、品牌记忆 / premium, refined, commercial, brand memory" },
  { id: "product-seeding", title: "产品种草短视频", type: "产品种草", idea: "写一个产品种草短视频，要有痛点、反差、使用场景和强记忆点，30秒内。", genre: "Commercial / 商业广告", duration: "30s", density: "Commercial Punchy / 广告强节奏", tone: "快节奏、痛点明确、强转化 / fast-paced, pain-point driven, conversion oriented" },
  { id: "tourism", title: "文旅宣传短片", type: "文旅宣传", idea: "写一个城市文旅宣传短视频，要有电影感、路线感、文化记忆点和爆款标题，1分钟内。", genre: "Documentary / 纪录片", duration: "60s", density: "Detailed / 细腻实拍覆盖", tone: "城市、人文、旅行、诗意 / city culture, travel, humanistic, poetic" },
  { id: "trailer", title: "短剧预告片", type: "短剧预告", idea: "写一个短剧预告片脚本，要有冲突、反转、强钩子和追更欲望，45秒内。", genre: "Crime Thriller / 犯罪惊悚", duration: "45s", density: "Trailer Fast Cut / 预告片快切", tone: "高压、悬念、反转、快切 / tension, suspense, twist, fast cut" },
  { id: "coffee", title: "咖啡车宣传片", type: "品牌短片", idea: "写一个咖啡车宣传短视频，要有治愈感、年轻人共鸣和高级街头广告片质感，30秒内。", genre: "Commercial / 商业广告", duration: "30s", density: "Balanced / 标准电影节奏", tone: "治愈、街头、咖啡香气、城市生活 / healing, street, coffee aroma, urban life" },
];


const PROJECT_TYPE_OPTIONS = [
  { id: "person", zh: "人物介绍", en: "Character Profile", idea: "写一个真实人物介绍短视频，要有剧情、有记忆点、有爆款开头，1分钟内。", genre: "Drama / 剧情片", mood: "真实人物感、成长高光、情绪共鸣 / authentic character highlight, growth and emotional resonance" },
  { id: "campus", zh: "校园宣传", en: "Campus Promo", idea: "写一个校园宣传短视频，要有故事线、青春感和招生传播点，1分钟内。", genre: "Commercial / 商业广告", mood: "青春、阳光、校园氛围、希望感 / youthful, bright, hopeful campus atmosphere" },
  { id: "brand", zh: "品牌广告", en: "Brand Commercial", idea: "写一个品牌广告短视频，要有高级质感、情绪共鸣和清晰转化点，60秒内。", genre: "Commercial / 商业广告", mood: "高级广告片质感、品牌记忆、商业转化 / premium commercial texture and brand memory" },
  { id: "tourism", zh: "文旅短片", en: "Tourism Short", idea: "写一个文旅宣传短片，要有城市记忆点、路线感、电影感和爆款标题，1分钟内。", genre: "Documentary / 纪录片", mood: "城市、人文、旅行、诗意与烟火气 / city culture, travel, poetic human atmosphere" },
  { id: "narrative", zh: "剧情短片", en: "Narrative Short", idea: "写一个剧情短片脚本，要有人物冲突、情绪转折和电影感分镜，1分钟内。", genre: "Drama / 剧情片", mood: "剧情冲突、人物动机、情绪转折 / narrative conflict, character motivation and emotional turn" },
  { id: "custom", zh: "自定义", en: "Custom", idea: "", genre: "Drama / 剧情片", mood: "按用户自定义项目类型设计 / designed from user custom project type" },
];
const PROJECT_USE_CASES = ["抖音 / Douyin", "视频号 / WeChat Channels", "小红书 / Xiaohongshu", "B站 / Bilibili", "宣传片 / Promo Film", "商业提案 / Commercial Pitch", "课堂作业 / Course Project", "自定义 / Custom"];

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
  scriptImportLab: { title: "Script Import Lab", zh: "剧本文档导入分析室", fields: { fileTypes: "支持 .docx / .txt / .md 剧本导入 / Supports docx, txt and md script import", analysis: "提取标题、人物、场景、对白、情绪曲线、分场结构和分镜化难点 / Extract title, characters, scenes, dialogue, emotional curve and adaptation risks", bible: "将真实文档转成剧本与创作圣经，后续分镜以此为最高优先级 / Convert document to script bible as source of truth", sceneSplit: "支持长剧本分场分析，选择全片或某一场生成分镜 / Scene-by-scene analysis for long scripts" } },
  storyCoreEngine: { title: "Story Core Engine", zh: "故事核心引擎", fields: { theme: "先提炼主题、主角欲望、人物障碍、情绪转折和结尾记忆点 / Extract theme, desire, obstacle, emotional turn and memorable ending before outlining", conflict: "每个大纲必须有目标、冲突、反转和情绪推进 / Every outline must include goal, conflict, reversal and emotional progression", visual: "故事核必须能被分镜化，避免只写说明文 / Story core must be visually filmable" } },
  miniDramaEngine: { title: "Mini Drama Engine", zh: "短剧叙事引擎", fields: { hook: "3秒内有事发生，人物关系立刻清楚 / Something must happen in the first 3 seconds", reversal: "中段至少一次反差或反转 / Include at least one mid-point contrast or reversal", cliffhanger: "结尾必须有记忆点、金句或追看钩子 / Ending must include a memorable line or follow-up hook" } },
  outlineQualityCheck: { title: "Script Outline Quality Check", zh: "大纲质量检查", fields: { checklist: "检查主角、目标、冲突、反转、爆点、金句、时长和分镜可执行性 / Check protagonist, goal, conflict, twist, viral point, quote, duration and shotability", score: "给出故事吸引力、人物记忆点、冲突强度、爆款传播力、分镜可执行性评分 / Score story pull, character memorability, conflict, virality and shotability" } },
  promptMasterEngine: { title: "Prompt Master Engine", zh: "提示词大师引擎", fields: { layers: "每个镜头输出核心画面、导演意图、主体控制、动作逻辑、摄影语言、光影质感、表演、连续性、模型适配、负面提示 / Ten-layer prompt structure", delivery: "提示词必须可直接交付给AI视频模型 / Prompts must be executable by AI video models" } },
  promptCompiler: { title: "Prompt Compiler", zh: "提示词编译器", fields: { cleanup: "去重、压缩无效形容词、强化主体、明确开始与结束动作 / remove repetition, compress fluff, strengthen subject, define start and end", adapters: "编译成通用版、可灵版、即梦版、Runway版、Sora/Veo版 / compile universal and model-specific variants" } },
  negativePromptStudio: { title: "Negative Prompt Studio", zh: "负面提示词工作室", fields: { adaptive: "根据人物、城市、产品、文化、校园等镜头类型自动生成负面提示 / adaptive negatives by shot type", risk: "重点规避文字乱码、人物变形、手部错误、场景漂移、过度风格化 / avoid text gibberish, anatomy issues, drifting scenes and over-stylization" } },
  promptDebugger: { title: "Prompt Debugger", zh: "提示词诊断器", fields: { metrics: "主体明确度、动作清晰度、镜头语言、连续性、模型可执行性、AI风险 / subject clarity, action clarity, camera language, continuity, feasibility and AI risk", fixes: "给出每个镜头的可执行修复建议 / actionable prompt fixes per shot" } },
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
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("File read failed"));
    reader.readAsText(file, "utf-8");
  });
}
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("File read failed"));
    reader.readAsArrayBuffer(file);
  });
}
async function loadMammothBrowser() {
  if (typeof window === "undefined") throw new Error("Browser environment required / 需要浏览器环境");
  if (window.mammoth?.extractRawText) return window.mammoth;
  await new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-polaris-mammoth="true"]');
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/mammoth@1.8.0/mammoth.browser.min.js";
    script.async = true;
    script.dataset.polarisMammoth = "true";
    script.onload = resolve;
    script.onerror = () => reject(new Error("DOCX parser load failed / DOCX解析器加载失败，请检查网络，或先转成TXT粘贴"));
    document.head.appendChild(script);
  });
  if (!window.mammoth?.extractRawText) throw new Error("DOCX parser unavailable / DOCX解析器不可用，请转成TXT粘贴");
  return window.mammoth;
}
async function extractScriptDocumentText(file) {
  if (!file) throw new Error("No file selected / 未选择文件");
  const name = file.name || "script-document";
  const ext = name.split(".").pop().toLowerCase();
  if (["txt", "md", "markdown"].includes(ext)) {
    const text = await readFileAsText(file);
    return { text, meta: { name, type: ext.toUpperCase(), size: file.size, parser: "Browser TextReader" } };
  }
  if (ext === "docx") {
    const mammoth = await loadMammothBrowser();
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const result = await mammoth.extractRawText({ arrayBuffer });
    return { text: String(result?.value || "").trim(), meta: { name, type: "DOCX", size: file.size, parser: "mammoth.js", warnings: result?.messages || [] } };
  }
  if (ext === "doc") throw new Error("暂不支持旧版 .doc，请另存为 .docx 或复制为 TXT 再导入 / .doc is not supported; please convert to .docx or paste TXT");
  throw new Error("Unsupported file type / 仅支持 .docx、.txt、.md");
}
function summarizeImportedScriptAnalysis(analysis = {}) {
  if (!analysis || typeof analysis !== "object") return "";
  return [
    analysis.logline ? `一句话故事 / Logline：${analysis.logline}` : "",
    analysis.analysisReport ? `剧本分析报告：${analysis.analysisReport}` : "",
    analysis.theme ? `主题：${analysis.theme}` : "",
    analysis.characters ? `人物：${Array.isArray(analysis.characters) ? analysis.characters.join("、") : analysis.characters}` : "",
    analysis.locations ? `场景：${Array.isArray(analysis.locations) ? analysis.locations.join("、") : analysis.locations}` : "",
    analysis.emotionalCurve ? `情绪曲线：${analysis.emotionalCurve}` : "",
    analysis.qualityDiagnosis ? `质量诊断：${analysis.qualityDiagnosis}` : "",
  ].filter(Boolean).join("\n");
}

function scriptFingerprint(script) {
  let hash = 0;
  const s = String(script || "");
  for (let i = 0; i < s.length; i += 1) hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
  return `${s.length}_${Math.abs(hash)}`;
}

function cleanUserText(value = "") {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}
function buildClientAuthorityBlock({ idea = "", script = "", outline = "", imported = "", reference = "" } = {}) {
  const ideaText = String(idea || "").trim();
  const scriptText = String(script || "").trim();
  const outlineText = String(outline || "").trim();
  const importedText = String(imported || "").trim();
  const referenceText = String(reference || "").trim();
  const hasAnyInput = Boolean(ideaText || scriptText || outlineText || importedText || referenceText);
  if (!hasAnyInput) return "";
  const authorityLines = [
    "## CLIENT INPUT AUTHORITY / 客户输入最高优先级",
    `CLIENT_INPUT_FINGERPRINT: ${scriptFingerprint(ideaText || scriptText || outlineText || importedText || referenceText)}`,
    ideaText ? `客户原始需求（逐字遵守）/ Client request verbatim:\n${ideaText}` : "客户原始需求为空 / No one-line client request provided.",
    "强制规则 / Mandatory rule:",
    "1. 本次生成必须围绕客户本轮输入展开；客户说什么主题，就生成什么主题。",
    "2. 不允许使用示例、模板、历史缓存、旧项目、默认故事、默认人物、默认场景来替代客户输入。",
    "3. 如果脚本圣经、模块、历史项目、参考链接与客户输入冲突，必须以客户输入为准。",
    "4. 如果客户输入是“香港文化”，所有脚本、分镜、提示词、场景图都必须服务于香港文化，不得生成无关默认脚本。",
    "5. 如果客户输入只有一句话，也必须先从这句话提炼故事核，再生成大纲/分镜；不得编造与输入无关的固定故事。"
  ];
  if (outlineText) authorityLines.push(`已生成/待确认大纲（只能作为客户输入的派生内容）/ Derived outline:\n${outlineText}`);
  if (scriptText) authorityLines.push(`当前剧本圣经（若与客户输入冲突则忽略冲突部分）/ Current script bible, subordinate to client input:\n${scriptText}`);
  if (importedText) authorityLines.push(`导入文档上下文（若与客户输入冲突则以客户输入为准）/ Imported document context, subordinate to client input:\n${importedText.slice(0, 6000)}`);
  if (referenceText) authorityLines.push(`参考链接/手动参考内容（按参考用途使用，不可覆盖客户输入）/ Reference context:\n${referenceText.slice(0, 5000)}`);
  return authorityLines.join(NL);
}
function resolveAuthoritativeScript({ scriptOverride = null, script = "", ideaInput = "", outlineDraft = "", importedScriptContext = "", referenceContext = "" } = {}) {
  const overrideText = (typeof scriptOverride === "string") ? scriptOverride.trim() : "";
  const ideaText = String(ideaInput || "").trim();
  const scriptText = String(script || "").trim();
  const outlineText = String(outlineDraft || "").trim();
  const importedText = String(importedScriptContext || "").trim();
  const referenceText = String(referenceContext || "").trim();
  if (!overrideText && !ideaText && !scriptText && !outlineText && !importedText && !referenceText) return "";
  if (overrideText) return buildClientAuthorityBlock({ idea: ideaText, script: overrideText, outline: outlineText, imported: importedText, reference: referenceText });
  if (ideaText) return buildClientAuthorityBlock({ idea: ideaText, script: scriptText, outline: outlineText, imported: importedText, reference: referenceText });
  return buildClientAuthorityBlock({ idea: "", script: scriptText || outlineText, outline: outlineText, imported: importedText, reference: referenceText });
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
  const directorIntent = bi(["directorIntent", "directorPurpose", "shotIntent"]);
  const executionNotes = bi(["executionNotes", "executionInstruction", "shootingExecution"]);
  const aiRisk = bi(["aiRisk", "generationRisk", "modelRisk"]);
  const klingPrompt = bi(["klingPrompt", "klingVideoPrompt"]);
  const runwayPrompt = bi(["runwayPrompt", "runwayVideoPrompt"]);
  const jimengPrompt = bi(["jimengPrompt", "dreaminaPrompt", "jimengVideoPrompt"]);
  const soraVeoPrompt = bi(["soraVeoPrompt", "soraPrompt", "veoPrompt"]);
  const coreVisualPrompt = bi(["coreVisualPrompt", "coreVisual", "visualCore"]);
  const subjectControl = bi(["subjectControl", "characterControl", "mainSubjectControl"]);
  const actionLogic = bi(["actionLogic", "motionLogic", "movementLogic"]);
  const cameraLanguagePrompt = bi(["cameraLanguagePrompt", "cameraLanguage", "cameraGrammar"]);
  const lightingTexturePrompt = bi(["lightingTexturePrompt", "lightingTexture", "texturePrompt"]);
  const continuityAnchorPrompt = bi(["continuityAnchorPrompt", "continuityAnchor", "continuityPrompt"]);
  const openingFrame = bi(["openingFrame", "startFrame", "firstFrame"]);
  const endingFrame = bi(["endingFrame", "endFrame", "finalFrame"]);
  const motionBridge = bi(["motionBridge", "actionBridge", "frameBridge"]);
  const negativePromptStudio = bi(["negativePromptStudio", "adaptiveNegativePrompt", "shotNegativePrompt"]);
  const promptCompilerNotes = bi(["promptCompilerNotes", "compilerNotes", "promptCompileNotes"]);
  const promptDebuggerNotes = bi(["promptDebuggerNotes", "debuggerNotes", "promptDebugNotes"]);
  const storyHook = bi(["storyHook", "hook", "threeSecondHook"]);
  const conflictTurn = bi(["conflictTurn", "reversal", "turningPoint"]);
  const contentValue = bi(["contentValue", "storyValue", "audienceValue"]);
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
    directorIntentZh: raw.directorIntentZh || directorIntent.zh,
    directorIntentEn: raw.directorIntentEn || directorIntent.en,
    executionNotesZh: raw.executionNotesZh || executionNotes.zh,
    executionNotesEn: raw.executionNotesEn || executionNotes.en,
    aiRiskZh: raw.aiRiskZh || aiRisk.zh,
    aiRiskEn: raw.aiRiskEn || aiRisk.en,
    klingPromptZh: raw.klingPromptZh || klingPrompt.zh,
    klingPromptEn: raw.klingPromptEn || klingPrompt.en,
    runwayPromptZh: raw.runwayPromptZh || runwayPrompt.zh,
    runwayPromptEn: raw.runwayPromptEn || runwayPrompt.en,
    jimengPromptZh: raw.jimengPromptZh || jimengPrompt.zh,
    jimengPromptEn: raw.jimengPromptEn || jimengPrompt.en,
    soraVeoPromptZh: raw.soraVeoPromptZh || soraVeoPrompt.zh,
    soraVeoPromptEn: raw.soraVeoPromptEn || soraVeoPrompt.en,
    coreVisualPromptZh: raw.coreVisualPromptZh || coreVisualPrompt.zh,
    coreVisualPromptEn: raw.coreVisualPromptEn || coreVisualPrompt.en,
    subjectControlZh: raw.subjectControlZh || subjectControl.zh,
    subjectControlEn: raw.subjectControlEn || subjectControl.en,
    actionLogicZh: raw.actionLogicZh || actionLogic.zh,
    actionLogicEn: raw.actionLogicEn || actionLogic.en,
    cameraLanguagePromptZh: raw.cameraLanguagePromptZh || cameraLanguagePrompt.zh,
    cameraLanguagePromptEn: raw.cameraLanguagePromptEn || cameraLanguagePrompt.en,
    lightingTexturePromptZh: raw.lightingTexturePromptZh || lightingTexturePrompt.zh,
    lightingTexturePromptEn: raw.lightingTexturePromptEn || lightingTexturePrompt.en,
    continuityAnchorPromptZh: raw.continuityAnchorPromptZh || continuityAnchorPrompt.zh,
    continuityAnchorPromptEn: raw.continuityAnchorPromptEn || continuityAnchorPrompt.en,
    openingFrameZh: raw.openingFrameZh || openingFrame.zh,
    openingFrameEn: raw.openingFrameEn || openingFrame.en,
    endingFrameZh: raw.endingFrameZh || endingFrame.zh,
    endingFrameEn: raw.endingFrameEn || endingFrame.en,
    motionBridgeZh: raw.motionBridgeZh || motionBridge.zh,
    motionBridgeEn: raw.motionBridgeEn || motionBridge.en,
    negativePromptStudioZh: raw.negativePromptStudioZh || negativePromptStudio.zh,
    negativePromptStudioEn: raw.negativePromptStudioEn || negativePromptStudio.en,
    promptCompilerNotesZh: raw.promptCompilerNotesZh || promptCompilerNotes.zh,
    promptCompilerNotesEn: raw.promptCompilerNotesEn || promptCompilerNotes.en,
    promptDebuggerNotesZh: raw.promptDebuggerNotesZh || promptDebuggerNotes.zh,
    promptDebuggerNotesEn: raw.promptDebuggerNotesEn || promptDebuggerNotes.en,
    storyHookZh: raw.storyHookZh || storyHook.zh,
    storyHookEn: raw.storyHookEn || storyHook.en,
    conflictTurnZh: raw.conflictTurnZh || conflictTurn.zh,
    conflictTurnEn: raw.conflictTurnEn || conflictTurn.en,
    contentValueZh: raw.contentValueZh || contentValue.zh,
    contentValueEn: raw.contentValueEn || contentValue.en,
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


function promptLengthLimit(text, mode = "Detailed / 详细版") {
  const t = String(text || "").replace(/\n{3,}/g, "\n\n").trim();
  if (mode.includes("Short")) return t.slice(0, 900);
  if (mode.includes("Standard")) return t.slice(0, 1800);
  if (mode.includes("Detailed")) return t.slice(0, 3200);
  return t;
}
function buildAdaptiveNegativePrompt(s, globalNegative = "") {
  const all = `${s.sceneZh || ""} ${s.sceneEn || ""} ${s.narrativeFunctionZh || ""} ${s.coverageRoleZh || ""}`.toLowerCase();
  const zh = [];
  const en = [];
  if (/人物|人像|学生|主角|角色|face|portrait|character|person/.test(all)) {
    zh.push("避免脸部变形、眼神漂移、手指错误、皮肤塑料感、表情僵硬、身份特征漂移");
    en.push("avoid distorted faces, drifting eyes, bad fingers, plastic skin, stiff expression, identity drift");
  }
  if (/香港|城市|街|霓虹|招牌|建筑|city|street|neon|sign|building/.test(all)) {
    zh.push("避免文字乱码、招牌可读文字错误、建筑扭曲、人群鬼影、车辆穿模、过度赛博朋克化");
    en.push("avoid gibberish text, readable sign errors, warped buildings, ghost crowds, vehicle clipping, over-cyberpunk look");
  }
  if (/产品|品牌|logo|包装|咖啡|product|brand|package|coffee/.test(all)) {
    zh.push("避免logo变形、包装文字错误、产品比例错误、反光异常、商业主体不清晰");
    en.push("avoid logo distortion, packaging text errors, wrong product proportions, unnatural reflections, unclear hero product");
  }
  if (/文化|校园|文旅|传统|非遗|culture|campus|travel|heritage/.test(all)) {
    zh.push("避免符号堆砌、地域刻板印象、过度滤镜、假纪录片质感、文化元素漂移");
    en.push("avoid symbol piling, regional stereotypes, over-filtering, fake documentary look, drifting cultural elements");
  }
  zh.push(globalNegative || "低质量、模糊、变形、闪烁、跳帧、过曝、欠曝、无意义文字、水印");
  en.push(globalNegative || "low quality, blurry, distorted, flicker, jitter, overexposed, underexposed, meaningless text, watermark");
  return { zh: Array.from(new Set(zh)).join("；"), en: Array.from(new Set(en)).join("; ") };
}
function buildFrameControl(s) {
  return {
    openingZh: s.openingFrameZh || s.actionStartZh || `从${s.sceneZh || "当前场景"}的清晰状态开始，主体和空间方向稳定。`,
    openingEn: s.openingFrameEn || s.actionStartEn || `Start from a clear state of ${s.sceneEn || "the scene"}, with stable subject and screen direction.`,
    keyZh: s.keyframeMomentZh || s.sceneImagePromptZh || s.sceneZh || "保留最有叙事价值的一帧。",
    keyEn: s.keyframeMomentEn || s.sceneImagePromptEn || s.sceneEn || "Hold the most narratively valuable frame.",
    endingZh: s.endingFrameZh || s.actionEndZh || s.nextShotHookZh || "以可接入下一镜头的动作或视线结束。",
    endingEn: s.endingFrameEn || s.actionEndEn || s.nextShotHookEn || "End on an action or eyeline that connects to the next shot.",
    bridgeZh: s.motionBridgeZh || `动作桥接：${s.actionStartZh || "开始动作"} → ${s.actionEndZh || "结束动作"}，保持物理惯性和情绪连续。`,
    bridgeEn: s.motionBridgeEn || `Motion bridge: ${s.actionStartEn || "start action"} → ${s.actionEndEn || "end action"}, maintaining physical inertia and emotional continuity.`,
  };
}
function buildCompiledPrompt(s, project, style, tech, negativePrompt) {
  const neg = buildAdaptiveNegativePrompt(s, negativePrompt);
  const frame = buildFrameControl(s);
  const strength = tech.promptStrength || "Director-Level / 导演级";
  const lengthMode = tech.promptLength || "Detailed / 详细版";
  const layersZh = [
    `【核心画面】${s.coreVisualPromptZh || s.sceneZh}`,
    `【导演意图】${s.directorIntentZh || s.narrativeFunctionZh}`,
    `【主体控制】${s.subjectControlZh || "锁定主角、服装、道具、空间方向，不随机增减人物。"}`,
    `【动作逻辑】${s.actionLogicZh || `${s.actionStartZh || "开始动作"} → ${s.actionEndZh || "结束动作"}`}`,
    `【摄影机语言】${s.cameraLanguagePromptZh || `${s.shotSize}，${s.lens}，${s.move}，动机必须服务情绪。`}`,
    `【光影质感】${s.lightingTexturePromptZh || `${s.light}，${s.colorScience}，真实材质、空气颗粒、自然曝光。`}`,
    `【表演细节】${s.performanceDirectionZh || "表情克制自然，呼吸、眼神、手部和重心变化真实。"}`,
    `【连续性锚点】${s.continuityAnchorPromptZh || `${s.previousShotLinkZh || "承接上一镜头"}；${s.nextShotHookZh || "为下一镜头留下钩子"}`}`,
    `【帧控制】开始：${frame.openingZh}；关键帧：${frame.keyZh}；结束：${frame.endingZh}；桥接：${frame.bridgeZh}`,
    `【负面提示】${s.negativePromptStudioZh || neg.zh}`,
    `【提示词强度】${strength}；【长度模式】${lengthMode}`,
    `【编译器说明】${s.promptCompilerNotesZh || "删除空泛形容词，保留主体、动作、镜头、光影、表演、连续性和风险控制。"}`,
  ].join(NL);
  const layersEn = [
    `[Core Visual] ${s.coreVisualPromptEn || s.sceneEn}`,
    `[Director Intent] ${s.directorIntentEn || s.narrativeFunctionEn}`,
    `[Subject Control] ${s.subjectControlEn || "Lock protagonist, costume, props and screen direction; do not add or remove people randomly."}`,
    `[Action Logic] ${s.actionLogicEn || `${s.actionStartEn || "start action"} → ${s.actionEndEn || "end action"}`}`,
    `[Camera Language] ${s.cameraLanguagePromptEn || `${s.shotSize}, ${s.lens}, ${s.move}; motion must be emotionally motivated.`}`,
    `[Lighting & Texture] ${s.lightingTexturePromptEn || `${s.light}, ${s.colorScience}, realistic materials, air particles and natural exposure.`}`,
    `[Performance Detail] ${s.performanceDirectionEn || "Restrained natural acting, realistic breathing, eyeline, hands and weight shift."}`,
    `[Continuity Anchor] ${s.continuityAnchorPromptEn || `${s.previousShotLinkEn || "connect from previous shot"}; ${s.nextShotHookEn || "leave a hook for next shot"}`}`,
    `[Frame Control] Opening: ${frame.openingEn}; Keyframe: ${frame.keyEn}; Ending: ${frame.endingEn}; Bridge: ${frame.bridgeEn}`,
    `[Negative Prompt] ${s.negativePromptStudioEn || neg.en}`,
    `[Prompt Strength] ${strength}; [Length Mode] ${lengthMode}`,
    `[Compiler Notes] ${s.promptCompilerNotesEn || "Remove vague adjectives and keep subject, action, camera, lighting, performance, continuity and risk controls."}`,
  ].join(NL);
  return { zh: promptLengthLimit(layersZh, lengthMode), en: promptLengthLimit(layersEn, lengthMode), negativeZh: neg.zh, negativeEn: neg.en, frame };
}

function buildModelPromptAdapter(s, project, style, tech, negativePrompt) {
  const baseZh = [
    `项目：${project}`,
    `镜头：${s.titleZh}`,
    `导演意图：${s.directorIntentZh || s.narrativeFunctionZh}`,
    `画面：${s.sceneZh}`,
    `动作：${s.actionStartZh} → ${s.actionEndZh}`,
    `表演：${s.performanceDirectionZh}`,
    `运镜：${s.move}`,
    `光影：${s.light}`,
    `连续性：${s.previousShotLinkZh} / ${s.nextShotHookZh}`,
    `风险控制：${s.aiRiskZh || s.continuityCheckZh}`,
    `负面：${negativePrompt}`,
  ].join("；");
  const baseEn = [
    `Project: ${project}`,
    `Shot: ${s.titleEn}`,
    `Director intent: ${s.directorIntentEn || s.narrativeFunctionEn}`,
    `Visual: ${s.sceneEn}`,
    `Action: ${s.actionStartEn} → ${s.actionEndEn}`,
    `Performance: ${s.performanceDirectionEn}`,
    `Camera movement: ${s.move}`,
    `Lighting: ${s.light}`,
    `Continuity: ${s.previousShotLinkEn} / ${s.nextShotHookEn}`,
    `Risk control: ${s.aiRiskEn || s.continuityCheckEn}`,
    `Negative: ${negativePrompt}`,
  ].join("; ");
  return {
    klingZh: s.klingPromptZh || `【可灵 Kling 适配】强调首尾状态、主体动作和镜头运动。${baseZh}`,
    klingEn: s.klingPromptEn || `[Kling adapted] Emphasize first frame, final frame, subject action and camera motion. ${baseEn}`,
    runwayZh: s.runwayPromptZh || `【Runway 适配】强调电影氛围、镜头质感、光影和真实运动惯性。${baseZh}`,
    runwayEn: s.runwayPromptEn || `[Runway adapted] Emphasize cinematic atmosphere, texture, lighting and physical motion inertia. ${baseEn}`,
    jimengZh: s.jimengPromptZh || `【即梦 / Dreamina 适配】中文语义清晰，主体、场景、动作、风格分层描述。${baseZh}`,
    jimengEn: s.jimengPromptEn || `[Dreamina adapted] Clear semantic layers for subject, setting, action and style. ${baseEn}`,
    pikaLumaZh: s.pikaLumaPromptZh || `【Pika / Luma 适配】强调单一核心动作、清晰主体、稳定镜头、真实运动节奏。${baseZh}`,
    pikaLumaEn: s.pikaLumaPromptEn || `[Pika/Luma adapted] Emphasize one core action, clear subject, stable camera and realistic motion rhythm. ${baseEn}`,
    soraVeoZh: s.soraVeoPromptZh || `【Sora / Veo 高级模型适配】强调导演调度、空间连续性、表演微细节和镜头动机。${baseZh}`,
    soraVeoEn: s.soraVeoPromptEn || `[Sora/Veo adapted] Emphasize direction, spatial continuity, micro-performance and motivated camera grammar. ${baseEn}`,
  };
}

function assessPromptQuality(s) {
  const checks = [
    ["导演意图", s.directorIntentZh || s.directorIntentEn || s.narrativeFunctionZh],
    ["明确主体", s.sceneZh || s.sceneEn],
    ["场景空间", s.spatialGeographyZh || s.sceneZh],
    ["开始动作", s.actionStartZh],
    ["结束动作", s.actionEndZh],
    ["运镜", s.move && !String(s.move).includes("AI_AUTO")],
    ["光影", s.light && !String(s.light).includes("AI_AUTO")],
    ["表演细节", s.performanceDirectionZh],
    ["连续性锚点", s.previousShotLinkZh || s.nextShotHookZh || s.continuityCheckZh],
    ["负面提示词", s.sceneImageNegativeZh || s.sceneImageNegativeEn],
    ["模型适配", s.klingPromptZh || s.runwayPromptZh || s.jimengPromptZh || s.soraVeoPromptZh],
    ["主体控制", s.subjectControlZh || s.subjectControlEn],
    ["动作逻辑", s.actionLogicZh || s.actionLogicEn],
    ["帧控制", s.openingFrameZh || s.endingFrameZh || s.motionBridgeZh || s.keyframeMomentZh],
    ["自适应负面", s.negativePromptStudioZh || s.negativePromptStudioEn || s.sceneImageNegativeZh],
    ["生成风险", s.aiRiskZh || s.aiRiskEn],
  ];
  const passed = checks.filter(([, ok]) => Boolean(ok)).length;
  const missing = checks.filter(([, ok]) => !ok).map(([name]) => name);
  const score = Math.round((passed / checks.length) * 100);
  return {
    score,
    missing,
    zh: missing.length ? `缺少：${missing.join("、")}` : "提示词结构完整，可直接交付。",
    en: missing.length ? `Missing: ${missing.join(", ")}` : "Prompt structure is complete and delivery-ready.",
  };
}
const evaluatePromptQuality = assessPromptQuality;

function buildPromptQualityReport(shots = [], tech = {}, douyinViral = {}) {
  const items = shots.map((s, i) => ({ index: i + 1, titleZh: s.titleZh, titleEn: s.titleEn, ...assessPromptQuality(s) }));
  const avg = items.length ? Math.round(items.reduce((sum, x) => sum + x.score, 0) / items.length) : 0;
  const risks = items.filter(x => x.score < 80);
  return {
    score: avg,
    risk: avg >= 90 ? "Low" : avg >= 75 ? "Medium" : "High",
    summaryZh: `提示词质量引擎完成：平均 ${avg}/100。${risks.length ? `有 ${risks.length} 个镜头需要补强。` : "整体结构完整，适合导出交付。"}`,
    summaryEn: `Prompt Quality Engine completed: average ${avg}/100. ${risks.length ? `${risks.length} shots need reinforcement.` : "Overall structure is complete and delivery-ready."}`,
    problems: risks.map(x => ({ level: x.score < 60 ? "High" : "Medium", shot: x.index, zh: x.zh, en: x.en, fixZh: "补充导演意图、执行说明、AI风险与模型适配提示词。", fixEn: "Add director intent, execution notes, AI risks and model-specific prompt variants." })),
    promptQualityItems: items,
    nextActionsZh: ["优先补强低于80分的镜头", "检查连续性承接与镜头职责", "导出前运行工业交付包"],
    nextActionsEn: ["Prioritize shots below 80", "Check continuity links and coverage roles", "Run production export before delivery"],
  };
}


function buildShotSimilarityReport(shots = []) {
  const safeShots = Array.isArray(shots) ? shots : [];
  const groups = { shotSize: {}, movement: {}, role: {}, emotion: {} };
  safeShots.forEach((s, i) => {
    const role = inferShotRole(s).zh;
    const keys = {
      shotSize: s.shotSize || "未设置景别",
      movement: s.move || "未设置运镜",
      role,
      emotion: s.emotionalBeatZh || "未设置情绪",
    };
    Object.entries(keys).forEach(([type, value]) => {
      groups[type][value] = groups[type][value] || [];
      groups[type][value].push(i + 1);
    });
  });
  const issues = [];
  Object.entries(groups).forEach(([type, map]) => {
    Object.entries(map).forEach(([value, indexes]) => {
      if (indexes.length >= 3) issues.push({ type, value, shots: indexes, zh: `${type}「${value}」连续/高频出现 ${indexes.length} 次，建议增加插入、反应、静态特写或空镜变化。`, en: `${type} "${value}" appears ${indexes.length} times; vary coverage with inserts, reactions, locked-off close-ups or cutaways.` });
    });
  });
  for (let i = 1; i < safeShots.length; i += 1) {
    const a = safeShots[i - 1], b = safeShots[i];
    if ((a.move && b.move && a.move === b.move) || (a.shotSize && b.shotSize && a.shotSize === b.shotSize && inferShotRole(a).zh === inferShotRole(b).zh)) {
      issues.push({ type: "adjacent", value: "连续镜头相似", shots: [i, i + 1], zh: `Shot ${i} 与 Shot ${i + 1} 的景别/运镜/职责接近，建议让其中一个改为反应镜头、插入镜头或静态情绪特写。`, en: `Shot ${i} and Shot ${i + 1} are similar; change one to a reaction, insert or locked emotional close-up.` });
    }
  }
  const score = Math.max(40, 100 - issues.length * 8);
  return { score, risk: score >= 88 ? "Low" : score >= 70 ? "Medium" : "High", issues, summaryZh: issues.length ? `发现 ${issues.length} 个镜头重复/相似风险。` : "镜头景别、运镜和职责变化健康。", summaryEn: issues.length ? `${issues.length} repetition/similarity risks found.` : "Shot size, movement and coverage variation look healthy." };
}

function buildFilmRiskReport(shots = []) {
  const safeShots = Array.isArray(shots) ? shots : [];
  const risks = [];
  safeShots.forEach((s, idx) => {
    const text = [s.sceneZh, s.sceneEn, s.finalPrompt, s.sceneImagePromptZh, s.platformPromptZh].filter(Boolean).join(" ");
    const index = idx + 1;
    if (/文字|招牌|字幕|logo|标志|neon sign|signboard|text|logo/i.test(text)) risks.push({ shot: index, level: "Medium", zh: "画面含文字/招牌/Logo，AI 视频容易生成乱码或变形，建议描述为“模糊色块/不可读标识”。", en: "Readable text/signage/logo may become garbled; describe as blurred color blocks or unreadable signage." });
    if (/人群|crowd|街头|market|traffic|车辆|车流/i.test(text)) risks.push({ shot: index, level: "Medium", zh: "复杂人群/车流容易出现穿模、鬼影和物理错误，建议降低人数并明确主体。", en: "Crowds/traffic can create ghosts and physics errors; reduce extras and clarify the subject." });
    if (/手|手指|拿|握|递|hand|finger|hold/i.test(text)) risks.push({ shot: index, level: "Medium", zh: "手部动作风险较高，建议用简单动作、避免多次递交或复杂抓握。", en: "Hand actions are risky; keep simple and avoid complex handoffs or grips." });
    if (/旋转|奔跑|跳跃|打斗|爆炸|快速|whip|fight|run|jump|explosion/i.test(text)) risks.push({ shot: index, level: "High", zh: "高速运动/动作戏风险较高，建议拆成多个短镜头并降低运动幅度。", en: "Fast action is high-risk; split into shorter shots and reduce motion amplitude." });
    if (!s.actionStartZh || !s.actionEndZh) risks.push({ shot: index, level: "Medium", zh: "缺少明确开始/结束动作，视频模型容易漂移。", en: "Missing start/end action; video model may drift." });
  });
  const high = risks.filter(r => r.level === "High").length;
  const score = Math.max(35, 100 - high * 15 - (risks.length - high) * 6);
  return { score, risk: high ? "High" : risks.length ? "Medium" : "Low", risks, summaryZh: risks.length ? `成片预估发现 ${risks.length} 个生成风险，建议先处理高风险镜头。` : "成片预估风险较低，适合进入生成测试。", summaryEn: risks.length ? `${risks.length} generation risks found; fix high-risk shots first.` : "Estimated production risk is low." };
}

function buildLockText(lock = {}, type = "character") {
  const entries = Object.entries(lock || {}).filter(([, v]) => String(v || "").trim());
  if (!entries.length) return "";
  const label = type === "location" ? "场景一致性锁 / Location Lock" : "角色一致性锁 / Character Lock";
  return `${label}: ${entries.map(([k, v]) => `${k}=${v}`).join("；")}`;
}

function applyConsistencyLocksToShot(shot = {}, characterLock = {}, locationLock = {}) {
  const c = buildLockText(characterLock, "character");
  const l = buildLockText(locationLock, "location");
  const locks = [c, l].filter(Boolean).join("\n");
  if (!locks) return shot;
  return {
    ...shot,
    characterLockNotesZh: c,
    locationLockNotesZh: l,
    subjectControlZh: [shot.subjectControlZh, c].filter(Boolean).join("；"),
    continuityAnchorPromptZh: [shot.continuityAnchorPromptZh, l].filter(Boolean).join("；"),
    promptCompilerNotesZh: [shot.promptCompilerNotesZh, "强制保留角色/场景一致性锁，不得在镜头之间改变外貌、服装、空间方向、主光源和关键道具。"].filter(Boolean).join("；"),
    promptCompilerNotesEn: [shot.promptCompilerNotesEn, "Preserve character/location locks across shots; do not change appearance, wardrobe, screen direction, key light or key props."].filter(Boolean).join("; "),
  };
}

function locallyRefineShotPrompt(shot = {}, mode = "Cinematic Realism / 强化电影实拍感") {
  const m = String(mode || "");
  const add = {
    "Action Stability": "每个镜头只保留一个核心动作，明确开始姿态、动作过程和结束姿态，避免复杂连续动作。",
    "Character Performance": "强化眼神、呼吸、停顿、手部微动作和重心变化，表演克制真实。",
    "Continuity Control": "强化上一镜头承接、道具状态、视线方向、空间轴线和下一镜头钩子。",
    "Kling Practical": "增加首帧、尾帧、主体动作、镜头运动、时长和运动幅度，适合可灵图生视频。",
    "Jimeng Practical": "中文语义短句化，主体清楚，动作单一，避免抽象形容词堆叠。",
    "Image-to-Video Control": "强调关键帧、首帧稳定、尾帧落点和动作桥接，便于图生视频。",
    "Short Direct Prompt": "压缩提示词，只保留主体、场景、动作、运镜、光影、负面提示。",
  };
  const hit = Object.keys(add).find(k => m.includes(k));
  const zh = add[hit] || "强化真实摄影细节、自然光影、物理惯性、轻微对焦漂移、皮肤和衣料质感，避免塑料感和过度AI感。";
  return {
    ...shot,
    executionNotesZh: [shot.executionNotesZh, zh].filter(Boolean).join("；"),
    promptCompilerNotesZh: [shot.promptCompilerNotesZh, `一键提示词精修：${mode}。${zh}`].filter(Boolean).join("；"),
    aiRiskZh: [shot.aiRiskZh, "精修后仍需检查：主体是否清楚、动作是否过多、文字/手部/人群是否有生成风险。"].filter(Boolean).join("；"),
    negativePromptStudioZh: [shot.negativePromptStudioZh, "避免AI塑料感、动作漂移、人物变脸、手指错误、文字乱码、建筑扭曲、过度锐化、过度滤镜。"].filter(Boolean).join("；"),
  };
}

function buildFinalPrompt(s, project, style, tech, modules, negativePrompt) {
  const modelPrompts = buildModelPromptAdapter(s, project, style, tech, negativePrompt);
  const compiled = buildCompiledPrompt(s, project, style, tech, negativePrompt);
  return [
    "【提示词大师引擎｜Prompt Master Engine】",
    "【中文十层编译提示词】",
    compiled.zh,
    "",
    "[English Ten-Layer Compiled Prompt]",
    compiled.en,
    "",
    "【中文视频生成提示词｜Production Prompt】",
    `项目：${project}`,
    `制作模式：${modules.commercial.fields.mode}`,
    `镜头：${s.titleZh}`,
    `镜头职责：${s.coverageRoleZh}`,
    `导演意图：${s.directorIntentZh || s.narrativeFunctionZh}`,
    `执行说明：${s.executionNotesZh || "保持主体、动作、空间、光影和情绪连续；不要生成无叙事功能的漂亮空镜。"}`,
    `AI生成风险：${s.aiRiskZh || s.continuityCheckZh || "注意角色、场景、文字、手部、动作连续性和过度风格化风险。"}`,
    `角色一致性锁：${s.characterLockNotesZh || "按当前剧本自动锁定"}`,
    `场景一致性锁：${s.locationLockNotesZh || "按当前剧本自动锁定"}`,
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
    `平台优化：${s.platformPromptZh}`,
    `全能多参：${s.omniParamPromptZh}`,
    `关键帧瞬间：${s.keyframeMomentZh}`,
    `场景图提示词：${s.sceneImagePromptZh}`,
    `主体控制：${s.subjectControlZh || compiled.zh}`,
    `动作逻辑：${s.actionLogicZh || s.actionStartZh}`,
    `帧控制：开始 ${compiled.frame.openingZh} / 关键帧 ${compiled.frame.keyZh} / 结束 ${compiled.frame.endingZh}`,
    `自适应负面：${s.negativePromptStudioZh || compiled.negativeZh}`,
    `提示词诊断：${s.promptDebuggerNotesZh || s.promptQualityNotesZh || "已通过基础结构检查"}`,
    `输出平台：${tech.platform}`,
    `画幅比例：${tech.ratio}`,
    `负面提示词：${negativePrompt}`,
    "",
    "【模型适配提示词】",
    modelPrompts.klingZh,
    modelPrompts.runwayZh,
    modelPrompts.jimengZh,
    modelPrompts.pikaLumaZh,
    modelPrompts.soraVeoZh,
    "",
    "【English Video Generation Prompt | Production Prompt】",
    `Project: ${project}`,
    `Production mode: ${modules.commercial.fields.mode}`,
    `Shot: ${s.titleEn}`,
    `Coverage role: ${s.coverageRoleEn}`,
    `Director intent: ${s.directorIntentEn || s.narrativeFunctionEn}`,
    `Execution notes: ${s.executionNotesEn || "Maintain continuity of subject, action, space, lighting and emotion; avoid beautiful but narratively empty shots."}`,
    `AI generation risk: ${s.aiRiskEn || s.continuityCheckEn || "Watch for character, location, text, hands, motion continuity and over-stylization risks."}`,
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
    `Coverage plan: ${s.coveragePlanEn}`,
    `Continuity inspector: ${s.continuityInspectorEn}`,
    `Platform optimization: ${s.platformPromptEn}`,
    `Omni multi-parameter controls: ${s.omniParamPromptEn}`,
    `Keyframe moment: ${s.keyframeMomentEn}`,
    `Scene image prompt: ${s.sceneImagePromptEn}`,
    `Subject control: ${s.subjectControlEn || compiled.en}`,
    `Action logic: ${s.actionLogicEn || s.actionStartEn}`,
    `Frame control: opening ${compiled.frame.openingEn} / keyframe ${compiled.frame.keyEn} / ending ${compiled.frame.endingEn}`,
    `Adaptive negative: ${s.negativePromptStudioEn || compiled.negativeEn}`,
    `Prompt debugger: ${s.promptDebuggerNotesEn || s.promptQualityNotesEn || "Basic structure passed"}`,
    `Platform: ${tech.platform}`,
    `Aspect ratio: ${tech.ratio}`,
    `Negative prompt: ${negativePrompt}`,
    `Style tags: ${style.tags}`,
    "",
    "[Model-Specific Prompt Variants]",
    modelPrompts.klingEn,
    modelPrompts.runwayEn,
    modelPrompts.jimengEn,
    modelPrompts.pikaLumaEn,
    modelPrompts.soraVeoEn,
  ].join(NL);
}

function buildPurePromptPack(shots, project) {
  return shots.map((s, i) => [
    `# Shot ${i + 1} / ${s.titleZh} / ${s.titleEn}`,
    "",
    "## Video Prompt / 视频提示词",
    s.finalPrompt || "",
    "",
    "## Scene Image Prompt / 场景图提示词",
    s.finalSceneImagePrompt || s.sceneImagePromptZh || s.sceneImagePromptEn || "",
    "",
    "## Model Adapters / 模型适配",
    [s.klingPromptZh, s.jimengPromptZh, s.runwayPromptEn, s.soraVeoPromptEn].filter(Boolean).join(NL),
  ].join(NL)).join(`${NL}${NL}---${NL}${NL}`);
}

function frameImageSrc(img) {
  if (!img) return "";
  if (img.url) return img.url;
  if (img.b64_json) return `data:${img.mime || "image/png"};base64,${img.b64_json}`;
  if (img.b64) return `data:${img.mime || "image/png"};base64,${img.b64}`;
  return "";
}
function buildShotKeyframePrompt(shot, project, style, tech, visualLocks = {}) {
  const scenePrompt = shot.finalSceneImagePrompt || shot.sceneImagePromptZh || shot.sceneImagePromptEn || shot.sceneZh || shot.sceneEn || "cinematic keyframe";
  const character = [visualLocks.character?.description, visualLocks.character?.fixedTraits].filter(Boolean).join("；");
  const location = [visualLocks.location?.description, visualLocks.location?.spatialDirection].filter(Boolean).join("；");
  const styleLock = [visualLocks.style?.color, visualLocks.style?.lighting, visualLocks.style?.texture].filter(Boolean).join("；");
  return [
    `Project / 项目：${project}`,
    `Shot / 镜头：${shot.titleZh || shot.titleEn || "Untitled"}`,
    `Use / 用途：Storyboard keyframe, image-to-video first frame, visual lock reference / 分镜关键帧、图生视频首帧、视觉锁定参考`,
    `Keyframe Moment / 关键帧瞬间：${shot.keyframeMomentZh || shot.keyframeMomentEn || shot.actionStartZh || shot.sceneZh || ""}`,
    `Director Intent / 导演意图：${shot.directorIntentZh || shot.narrativeFunctionZh || ""}`,
    `Core Scene / 核心画面：${scenePrompt}`,
    `Composition / 构图：${shot.compositionZh || shot.compositionType || "cinematic composition"}`,
    `Lighting / 光影：${shot.light || tech.lightingLock || "motivated cinematic light"}`,
    `Continuity Anchor / 连续性锚点：${shot.sceneImageContinuityNotesZh || shot.continuityCheckZh || shot.storyStateZh || ""}`,
    character ? `Character Visual Lock / 角色视觉锁：${character}` : "",
    location ? `Location Visual Lock / 场景视觉锁：${location}` : "",
    styleLock ? `Style Visual Lock / 风格视觉锁：${styleLock}` : "",
    `Style Tags / 风格标签：${style?.tags || "cinematic realism, premium film still"}`,
    `Negative / 负面：${shot.sceneImageNegativeZh || shot.negativePromptStudioZh || "避免文字乱码、脸部变形、手指错误、过度赛博朋克、塑料皮肤、建筑扭曲、构图混乱"}`,
  ].filter(Boolean).join(NL);
}
function buildVideoRouteForShot(s, heroFrame = null) {
  const text = `${s.sceneZh || ""} ${s.sceneEn || ""} ${s.actionStartZh || ""} ${s.actionEndZh || ""} ${s.move || ""} ${s.coverageRoleZh || ""}`.toLowerCase();
  let model = "Kling / 可灵";
  let modeZh = "图生视频优先";
  let risk = "Medium";
  let reasonZh = "人物动作与镜头运动需要首帧锁定，推荐图生视频。";
  if (/城市|街|风景|航拍|建筑|city|street|landscape|drone/.test(text)) { model = "Runway / Luma / Sora-Veo"; modeZh = "文生视频或图生视频均可"; risk = "Medium"; reasonZh = "场景建立镜头更依赖氛围、光影和空间运动，适合高质量视频模型。"; }
  if (/特写|close-up|portrait|脸|眼睛|表情|reaction/.test(text)) { model = "Image-to-Video First / 图生视频优先"; modeZh = "必须先锁定关键帧"; risk = "High"; reasonZh = "人物脸部、表情和眼神一致性风险高，建议先生成关键帧再图生视频。"; }
  if (/产品|logo|包装|咖啡|商品|product|packaging/.test(text)) { model = "Jimeng / 可灵 / 图生视频"; modeZh = "图生视频优先"; risk = "High"; reasonZh = "产品比例、包装和反光容易漂移，必须用关键帧和负面提示锁定。"; }
  if (/群像|人群|crowd|battle|dance|fight|动作/.test(text)) { model = "Kling / Sora-Veo"; modeZh = "拆分动作后生成"; risk = "High"; reasonZh = "多人动作容易穿模和鬼影，建议拆成更短镜头或先生成首帧。"; }
  return { shotIndex: Number(s.id) || 0, model, modeZh, risk, reasonZh, hasHeroFrame: Boolean(heroFrame) };
}
function buildVisualLockSummaryFromShot(shot, image = null) {
  return { description: [shot.sceneZh || shot.sceneEn, shot.keyframeMomentZh || shot.keyframeMomentEn].filter(Boolean).join("；").slice(0, 500), fixedTraits: [shot.characterContinuityZh, shot.continuityCheckZh, shot.sceneImageContinuityNotesZh].filter(Boolean).join("；").slice(0, 500), image: frameImageSrc(image), updatedAt: new Date().toLocaleString() };
}
function createImageToVideoPromptPack(shots, keyframes = {}, visualLocks = {}, routing = []) {
  const rows = shots.map((s, i) => {
    const k = keyframes[String(s.id || i + 1)] || keyframes[String(i)] || {};
    const hero = (k.images || [])[k.selectedIndex || 0];
    const route = routing.find(r => Number(r.shotIndex) === i + 1) || buildVideoRouteForShot(s, hero);
    return [`# Shot ${i + 1} / ${s.titleZh || s.titleEn || "Untitled"}`, `Generation Mode / 生成方式：${route.modeZh || route.mode || "图生视频优先"}`, `Recommended Model / 推荐模型：${route.model || "Auto Route"}`, `Why / 原因：${route.reasonZh || route.reason || "根据镜头动作、角色一致性、场景复杂度自动判断"}`, `Hero Frame / 主关键帧：${frameImageSrc(hero) || "未生成，请先生成 Shot Keyframe"}`, "", "## Image-to-Video Instruction / 图生视频执行指令", "Opening frame: use the selected keyframe as first frame. / 使用选中的关键帧作为首帧。", `Action start: ${s.actionStartZh || s.actionStartEn || "保持首帧构图，主体自然开始动作"}`, `Motion bridge: ${s.motionBridgeZh || s.motionBridgeEn || s.cutMotivationZh || "动作保持自然物理惯性，避免突然跳变"}`, `Action end: ${s.actionEndZh || s.actionEndEn || "动作在尾帧自然停住或接入下一镜头"}`, `Continuity: ${s.sceneImageContinuityNotesZh || s.continuityCheckZh || "保持角色、服装、场景、光线方向一致"}`, `Video Prompt: ${s.finalPrompt || s.promptZh || ""}`, `Negative Prompt: ${s.sceneImageNegativeZh || s.negativePromptStudioZh || "避免画面跳变、脸部变形、手指错误、文字乱码、建筑扭曲、人物漂移"}`, ""].join(NL);
  });
  return ["北极星AIGC电影级工业系统 V8.4 · Image-to-Video Production Pack", `Chief Engineer / 总工程师：${ENGINEER_NAME}`, `Generated At / 生成时间：${new Date().toLocaleString()}`, "", "## Visual Locks / 视觉锁定", JSON.stringify(visualLocks, null, 2), "", "## Shot Packs / 镜头包", rows.join(`${NL}${NL}---${NL}${NL}`)].join(NL);
}

function makeWord(shots, project, script, style, tech, modules) {
  const prepared = shots.map((s, i) => ({ ...s, index: i + 1, promptQuality: assessPromptQuality(s) }));
  const avgScore = prepared.length ? Math.round(prepared.reduce((sum, s) => sum + s.promptQuality.score, 0) / prepared.length) : 0;
  const archiveId = makeArchiveId(project || "Polaris");
  const overviewRows = prepared.map(s => `<tr>
    <td>${s.index}</td><td>${escapeHtml(s.coverageRoleZh || s.narrativeFunctionZh)}</td><td>${escapeHtml(s.duration)}</td><td>${escapeHtml(s.shotSize)}</td><td>${escapeHtml(s.emotionalBeatZh)}</td><td>${escapeHtml((s.sceneZh || "").slice(0, 120))}</td><td>${s.promptQuality.score}</td>
  </tr>`).join("");
  const shotPages = prepared.map(s => `<section style="page-break-before:always;padding:24px 0;">
    <h2>Shot ${s.index}｜${escapeHtml(s.titleZh)} / ${escapeHtml(s.titleEn)}</h2>
    <p><b>镜头职责 / Coverage Role：</b>${escapeHtml(s.coverageRoleZh || "")}<br/>
    <b>导演意图 / Director Intent：</b>${escapeHtml(s.directorIntentZh || s.narrativeFunctionZh || "")}<br/>
    <b>执行说明 / Execution Notes：</b>${escapeHtml(s.executionNotesZh || "保持主体、动作、空间、光影和情绪连续。")}<br/>
    <b>AI生成风险 / AI Risk：</b>${escapeHtml(s.aiRiskZh || s.continuityCheckZh || "")}<br/>
    <b>提示词质量评分 / Prompt Score：</b>${s.promptQuality.score}/100 · ${escapeHtml(s.promptQuality.zh)}</p>
    <h3>1. 画面内容 / Visual</h3><p>${escapeHtml(s.sceneZh)}<br/>${escapeHtml(s.sceneEn)}</p>
    <h3>2. 人物表演 / Performance</h3><p>${escapeHtml(s.performanceDirectionZh)}<br/>${escapeHtml(s.performanceDirectionEn)}</p>
    <h3>3. 摄影技术 / Cinematography</h3><p>景别：${escapeHtml(s.shotSize)}｜摄影机：${escapeHtml(s.camera)}｜焦段：${escapeHtml(s.lens)}｜运镜：${escapeHtml(s.move)}｜光影：${escapeHtml(s.light)}｜色彩：${escapeHtml(s.colorScience)}</p>
    <h3>4. 连续性承接 / Continuity</h3><p>${escapeHtml(s.previousShotLinkZh)}<br/>开始：${escapeHtml(s.actionStartZh)}<br/>结束：${escapeHtml(s.actionEndZh)}<br/>下一镜头钩子：${escapeHtml(s.nextShotHookZh)}<br/>${escapeHtml(s.spatialGeographyZh)}<br/>${escapeHtml(s.axisEyelineZh)}</p>
    <h3>5. 视频生成提示词 / Video Prompt</h3><pre>${escapeHtml(s.finalPrompt || "")}</pre>
    <h3>6. 场景图提示词 / Scene Image Prompt</h3><pre>${escapeHtml(s.finalSceneImagePrompt || s.sceneImagePromptZh || "")}</pre>
    <h3>7. 负面提示词 / Negative Prompt</h3><p>${escapeHtml(s.sceneImageNegativeZh || "")}</p>
  </section>`).join("");
  const appendix = `<section style="page-break-before:always;"><h2>附录｜纯提示词包 Prompt Pack</h2><pre>${escapeHtml(buildPurePromptPack(prepared, project))}</pre></section>`;
  const content = `<!doctype html><html><head><meta charset="UTF-8" />
  <style>
    body{font-family:Arial,"Microsoft YaHei",sans-serif;color:#111;line-height:1.6;}
    .cover{height:780px;display:flex;flex-direction:column;justify-content:center;text-align:center;border:4px solid #111;padding:48px;}
    h1{font-size:32px;letter-spacing:1px;} h2{border-bottom:2px solid #111;padding-bottom:8px;} h3{margin-top:18px;color:#222;}
    table{border-collapse:collapse;width:100%;font-size:11px;} th,td{border:1px solid #bbb;padding:8px;vertical-align:top;} th{background:#eee;}
    pre{white-space:pre-wrap;background:#f6f6f6;border:1px solid #ddd;padding:12px;font-size:10.5px;line-height:1.55;}
    .footer{margin-top:36px;padding-top:16px;border-top:2px solid #111;text-align:center;font-size:12px;}
  </style></head><body>
    <section class="cover">
      <div style="font-size:12px;letter-spacing:4px;font-weight:bold;">PRODUCTION PACKAGE SEALED</div>
      <h1>${escapeHtml(project)}<br/>北极星AIGC电影级工业系统 V8.4</h1>
      <p><b>Prompt Quality & Production Export Suite</b><br/>提示词质量引擎 + 工业交付包</p>
      <p>导演风格：${escapeHtml(style.name)}<br/>平台：${escapeHtml(tech.platform)}<br/>模型交付评分：${avgScore}/100<br/>封存编号：${escapeHtml(archiveId)}</p>
      <p><b>Chief Engineer / 总工程师</b><br/>${escapeHtml(ENGINEER_NAME)}<br/>${escapeHtml(AUTH_SEAL_ID)}</p>
    </section>
    <section style="page-break-before:always;">
      <h2>项目总览 / Project Overview</h2>
      <p><b>剧本与创作圣经：</b>${escapeHtml(script)}</p>
      <p><b>制作模式：</b>${escapeHtml(modules.commercial.fields.mode)}<br/><b>画幅：</b>${escapeHtml(tech.ratio)}<br/><b>镜头数量：</b>${prepared.length}<br/><b>提示词平均评分：</b>${avgScore}/100</p>
    </section>
    <section style="page-break-before:always;">
      <h2>分镜总览表 / Shot Overview</h2>
      <table><thead><tr><th>Shot</th><th>职责</th><th>时长</th><th>景别</th><th>情绪</th><th>画面摘要</th><th>Prompt Score</th></tr></thead><tbody>${overviewRows}</tbody></table>
    </section>
    ${shotPages}
    ${appendix}
    <div class="footer"><b>Powered by 北极星AIGC电影级工业系统 V8.4</b><br/>Chief Engineer / 总工程师：${escapeHtml(ENGINEER_NAME)}<br/>Authentic Seal：${escapeHtml(AUTH_SEAL_ID)}<br/>Production Package Archive ID：${escapeHtml(archiveId)}</div>
  </body></html>`;
  const blob = new Blob([content], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeName(project)}_Polaris_V8_Production_Package.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadPromptPack(shots, project) {
  const content = buildPurePromptPack(shots, project);
  downloadTextFile(`${safeName(project)}_Polaris_V8_Prompt_Pack.txt`, content, "text/plain;charset=utf-8");
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

const ProjectTemplateCard = ({ template, onApply }) => (
  <button type="button" onClick={() => onApply(template)} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left hover:border-amber-300/40 hover:bg-white/10">
    <div className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Template / 模板</div>
    <div className="mt-3 text-lg font-black text-white">{template.title}</div>
    <div className="mt-1 text-[11px] font-bold text-stone-500">{template.type} · {template.duration}</div>
    <div className="mt-3 line-clamp-3 text-[12px] leading-6 text-stone-400">{template.idea}</div>
  </button>
);


const MiniStat = ({ label, value, tone = "cyan" }) => (
  <div className={`rounded-2xl border p-4 ${tone === "amber" ? "border-amber-300/20 bg-amber-400/10" : tone === "emerald" ? "border-emerald-300/20 bg-emerald-400/10" : "border-cyan-300/20 bg-cyan-400/10"}`}>
    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">{label}</div>
    <div className="mt-2 text-lg font-black text-white">{value}</div>
  </div>
);

const ShotResultCard = ({ shot, index, active, onSelect, onCopyVideo, onCopyScene, onCopyPlatform }) => {
  const role = inferShotRole(shot);
  const score = evaluatePromptQuality(shot)?.score || "--";
  return (
    <button type="button" onClick={onSelect} className={`w-full rounded-3xl border p-5 text-left transition ${active ? "border-amber-300 bg-amber-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Shot {index + 1} · {role.zh}</div>
          <div className="mt-2 text-base font-black text-white">{shot.titleZh || `镜头 ${index + 1}`}</div>
          <div className="mt-2 line-clamp-2 text-[12px] leading-6 text-stone-400">{shot.sceneZh || shot.narrativeFunctionZh || shot.emotionalBeatZh}</div>
        </div>
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-center">
          <div className="text-lg font-black text-emerald-200">{score}</div>
          <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400/70">Score</div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] text-stone-300">{shot.duration || "4-6s"}</span>
        <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] text-stone-300">{shot.shotSize || "AI Shot Size"}</span>
        <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] text-stone-300">{shot.move || "AI Movement"}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
        <button onClick={onCopyVideo} className="rounded-xl bg-cyan-300 px-3 py-2 text-[10px] font-black text-black">Copy Video</button>
        <button onClick={onCopyScene} className="rounded-xl bg-emerald-300 px-3 py-2 text-[10px] font-black text-black">Copy Scene</button>
        <button onClick={() => onCopyPlatform("kling")} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white">可灵</button>
        <button onClick={() => onCopyPlatform("runway")} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white">Runway</button>
        <button onClick={() => onCopyPlatform("soraVeo")} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white">Sora/Veo</button>
      </div>
    </button>
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
          <h3 className="mt-1 text-xl font-black text-white">Ready to Roll / 准备开机</h3>
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
  const [scriptImportText, setScriptImportText] = useState("");
  const [scriptImportMeta, setScriptImportMeta] = useState({ name: "", type: "", size: 0, parser: "" });
  const [scriptImportAnalysis, setScriptImportAnalysis] = useState(null);
  const [scriptImportScenes, setScriptImportScenes] = useState([]);
  const [selectedImportScene, setSelectedImportScene] = useState("all");
  const [isImportingScript, setIsImportingScript] = useState(false);
  const [isAnalyzingImportedScript, setIsAnalyzingImportedScript] = useState(false);
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
  const [tech, setTech] = useState({ platform: OPT.platforms[0], ratio: OPT.ratios[0], shotCount: "8", shotCountMode: OPT.shotCountModes[4], shotRange: OPT.shotRanges[1], videoDuration: OPT.videoDurations[2], shotDensity: OPT.shotDensities[1], minimumCoverage: OPT.coverageChecklist.slice(0, 10), allowAddMissingShots: true, shotSizeLock: AUTO, cameraLock: AUTO, lensLock: AUTO, movementLock: AUTO, stabilizerLock: AUTO, lightingLock: AUTO, compositionLock: OPT.compositions[0], editLock: OPT.edits[0], soundLock: OPT.sounds[0], colorScience: OPT.colors[2], bilingualDialogue: true, professionalAV: true, includeSound: true, generateSceneImagePrompt: true, sceneImageMode: OPT.sceneImageModes[1], sceneImageUse: OPT.sceneImageUses[0], sceneImageAspectRatio: OPT.sceneImageRatios[0], sceneImageModel: OPT.sceneImageModels[0], contentEngineMode: OPT.contentEngineModes[0], promptStrength: OPT.promptStrengthLevels[3], promptLength: OPT.promptLengthModes[2], promptRewriteMode: OPT.promptRewriteModes[0] });
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
  const [projectStudioOpen, setProjectStudioOpen] = useState(false);
  const [projectStudioTab, setProjectStudioTab] = useState("workflow");
  const [canvasLeftCollapsed, setCanvasLeftCollapsed] = useState(false);
  const [canvasRightCollapsed, setCanvasRightCollapsed] = useState(false);
  const canvasStageRef = useRef(null);
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!(projectStudioOpen && projectStudioTab === "canvas")) return;
    const html = document.documentElement;
    const body = document.body;
    const oldHtmlOverflow = html.style.overflow;
    const oldBodyOverflow = body.style.overflow;
    const oldBodyMargin = body.style.margin;
    const oldBodyPadding = body.style.padding;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.margin = "0";
    body.style.padding = "0";
    return () => {
      html.style.overflow = oldHtmlOverflow;
      body.style.overflow = oldBodyOverflow;
      body.style.margin = oldBodyMargin;
      body.style.padding = oldBodyPadding;
    };
  }, [projectStudioOpen, projectStudioTab]);
  const [projectWizard, setProjectWizard] = useState({ projectType: "person", customType: "", duration: "60s", useCase: "抖音 / Douyin", creationMethod: "一句话生成 / One-line idea" });
  const [clientViewMode, setClientViewMode] = useState("overview");
  const [projectLibrary, setProjectLibrary] = useState([]);
  const [preflightReport, setPreflightReport] = useState(null);
  const [rhythmTable, setRhythmTable] = useState([]);
  const [captionStudio, setCaptionStudio] = useState({ voiceover: "", subtitles: "", titles: "", hashtags: "", publishCopy: "" });
  const [modelAdapterTarget, setModelAdapterTarget] = useState("Kling AI / 可灵");
  const [outlineRewriteMode, setOutlineRewriteMode] = useState(OPT.outlineRewriteModes[0]);
  const [promptRefineMode, setPromptRefineMode] = useState(OPT.promptRefineModes[0]);
  const [characterLock, setCharacterLock] = useState({ name: "", appearance: "", wardrobe: "", hair: "", fixedTraits: "" });
  const [locationLock, setLocationLock] = useState({ mainLocation: "", time: "", color: "", props: "", screenDirection: "", lightSource: "" });
  const [shotSimilarityReport, setShotSimilarityReport] = useState(null);
  const [filmRiskReport, setFilmRiskReport] = useState(null);
  const [imageApiSettings, setImageApiSettings] = useState({ provider: OPT.imageApiProviders[0], model: OPT.imageApiModels[0], endpoint: "/api/image-generate", size: "2K", candidates: "1", quality: "high" });
  const [productionFlowMode, setProductionFlowMode] = useState("prompt-only");
  const [isGeneratingKeyframes, setIsGeneratingKeyframes] = useState(false);
  const [shotKeyframes, setShotKeyframes] = useState({});
  const [visualLocks, setVisualLocks] = useState({ character: {}, location: {}, style: {}, props: {}, firstFrame: {} });
  const [characterAssets, setCharacterAssets] = useState([]);
  const [locationAssets, setLocationAssets] = useState([]);
  const [videoModelRouting, setVideoModelRouting] = useState([]);
  const [canvasViewMode, setCanvasViewMode] = useState("story");
  const [canvasZoom, setCanvasZoom] = useState(0.82);
  const [canvasSelectedNode, setCanvasSelectedNode] = useState("story-core");
  const [canvasNodePositions, setCanvasNodePositions] = useState({});
  const [canvasRitualMode, setCanvasRitualMode] = useState("premiere");
  const [workflowNodes, setWorkflowNodes] = useState([]);
  const [workflowEdges, setWorkflowEdges] = useState([]);
  const [workflowConnectSource, setWorkflowConnectSource] = useState("");
  const [workflowRunLog, setWorkflowRunLog] = useState([]);
  const [workflowActiveNode, setWorkflowActiveNode] = useState("");
  const [workflowRunMode, setWorkflowRunMode] = useState("prompt-only");
  const [workflowLibraryOpen, setWorkflowLibraryOpen] = useState(true);


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
      scriptImportText: "",
      scriptImportMeta: { name: "", type: "", size: 0, parser: "" },
      scriptImportAnalysis: null,
      scriptImportScenes: [],
      selectedImportScene: "all",
      referenceIngest: { status: "idle", title: "", summary: "", keywords: [], style: "", viralRhythm: "", usableFacts: "", uncertainInfo: "" },
      referenceUseMode: OPT.referenceUseModes[1],
      douyinViral: { enabled: true, videoType: OPT.douyinVideoTypes[0], hookStyle: OPT.viralHookStyles[0], intensity: OPT.viralIntensities[1], duration: OPT.shortVideoDurations[2] },
      personFacts: { name: "", school: "", major: "", identity: "", experience: "", awards: "", highlights: "", doNotInvent: "" },
      outlineDraft: "",
      sceneImageBatchFormat: OPT.sceneImageBatchFormats[0],
      creativeBrief: { genre: OPT.genres[0], pacing: OPT.pacing[0], dialogueStyle: OPT.dialogueStyles[0], mood: "" },
      modules: DEFAULT_MODULES,
      tech: { platform: OPT.platforms[0], ratio: OPT.ratios[0], shotCount: "8", shotCountMode: OPT.shotCountModes[4], shotRange: OPT.shotRanges[1], videoDuration: OPT.videoDurations[2], shotDensity: OPT.shotDensities[1], minimumCoverage: OPT.coverageChecklist.slice(0, 10), allowAddMissingShots: true, shotSizeLock: AUTO, cameraLock: AUTO, lensLock: AUTO, movementLock: AUTO, stabilizerLock: AUTO, lightingLock: AUTO, compositionLock: OPT.compositions[0], editLock: OPT.edits[0], soundLock: OPT.sounds[0], colorScience: OPT.colors[2], bilingualDialogue: true, professionalAV: true, includeSound: true, generateSceneImagePrompt: true, sceneImageMode: OPT.sceneImageModes[1], sceneImageUse: OPT.sceneImageUses[0], sceneImageAspectRatio: OPT.sceneImageRatios[0], sceneImageModel: OPT.sceneImageModels[0], contentEngineMode: OPT.contentEngineModes[0], promptStrength: OPT.promptStrengthLevels[3], promptLength: OPT.promptLengthModes[2], promptRewriteMode: OPT.promptRewriteModes[0] },
      preflightReport: null,
      rhythmTable: [],
      captionStudio: { voiceover: "", subtitles: "", titles: "", hashtags: "", publishCopy: "" },
      modelAdapterTarget: "Kling AI / 可灵",
      outlineRewriteMode: OPT.outlineRewriteModes[0],
      promptRefineMode: OPT.promptRefineModes[0],
      characterLock: { name: "", appearance: "", wardrobe: "", hair: "", fixedTraits: "" },
      locationLock: { mainLocation: "", time: "", color: "", props: "", screenDirection: "", lightSource: "" },
      shotSimilarityReport: null,
      filmRiskReport: null,
      imageApiSettings: { provider: OPT.imageApiProviders[0], model: OPT.imageApiModels[0], endpoint: "/api/image-generate", size: "2K", candidates: "1", quality: "high" },
      productionFlowMode: "prompt-only",
      shotKeyframes: {},
      visualLocks: { character: {}, location: {}, style: {}, props: {}, firstFrame: {} },
      characterAssets: [],
      locationAssets: [],
      videoModelRouting: [],
      canvasViewMode: "story",
      canvasZoom: 0.82,
      canvasSelectedNode: "story-core",
      canvasNodePositions: {},
      canvasRitualMode: "premiere",
      workflowNodes: [],
      workflowEdges: [],
      workflowRunLog: [],
      workflowRunMode: "prompt-only",
      projectWizard: { projectType: "person", customType: "", duration: "60s", useCase: "抖音 / Douyin", creationMethod: "一句话生成 / One-line idea" },
      clientViewMode: "overview",
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
      negativePrompt, ideaInput, referenceUrl, referenceManualContent, scriptImportText, scriptImportMeta, scriptImportAnalysis, scriptImportScenes, selectedImportScene, referenceIngest,
      referenceUseMode, douyinViral, personFacts, outlineDraft, sceneImageBatchFormat,
      creativeBrief, modules, tech, preflightReport, rhythmTable, captionStudio, modelAdapterTarget, outlineRewriteMode, promptRefineMode, characterLock, locationLock, shotSimilarityReport, filmRiskReport, imageApiSettings, productionFlowMode, shotKeyframes, visualLocks, characterAssets, locationAssets, videoModelRouting, canvasViewMode, canvasZoom, canvasSelectedNode, canvasNodePositions, canvasRitualMode, workflowNodes, workflowEdges, workflowRunLog, workflowRunMode, projectWizard, clientViewMode,
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
    setScriptImportText(next.scriptImportText ?? "");
    setScriptImportMeta(next.scriptImportMeta || preset.scriptImportMeta);
    setScriptImportAnalysis(next.scriptImportAnalysis || null);
    setScriptImportScenes(Array.isArray(next.scriptImportScenes) ? next.scriptImportScenes : []);
    setSelectedImportScene(next.selectedImportScene || "all");
    setReferenceIngest(next.referenceIngest || preset.referenceIngest);
    setReferenceUseMode(next.referenceUseMode || preset.referenceUseMode);
    setDouyinViral(next.douyinViral || preset.douyinViral);
    setPersonFacts(next.personFacts || preset.personFacts);
    setOutlineDraft(next.outlineDraft ?? "");
    setSceneImageBatchFormat(next.sceneImageBatchFormat || preset.sceneImageBatchFormat);
    setCreativeBrief(next.creativeBrief || preset.creativeBrief);
    setModules(next.modules || DEFAULT_MODULES);
    setTech(next.tech || preset.tech);
    setPreflightReport(next.preflightReport || null);
    setRhythmTable(Array.isArray(next.rhythmTable) ? next.rhythmTable : []);
    setCaptionStudio(next.captionStudio || preset.captionStudio);
    setModelAdapterTarget(next.modelAdapterTarget || "Kling AI / 可灵");
    setOutlineRewriteMode(next.outlineRewriteMode || OPT.outlineRewriteModes[0]);
    setPromptRefineMode(next.promptRefineMode || OPT.promptRefineModes[0]);
    setCharacterLock(next.characterLock || preset.characterLock);
    setLocationLock(next.locationLock || preset.locationLock);
    setShotSimilarityReport(next.shotSimilarityReport || null);
    setFilmRiskReport(next.filmRiskReport || null);
    setImageApiSettings(next.imageApiSettings || preset.imageApiSettings);
    setProductionFlowMode(next.productionFlowMode || "prompt-only");
    setShotKeyframes(next.shotKeyframes || {});
    setVisualLocks(next.visualLocks || preset.visualLocks);
    setCharacterAssets(Array.isArray(next.characterAssets) ? next.characterAssets : []);
    setLocationAssets(Array.isArray(next.locationAssets) ? next.locationAssets : []);
    setVideoModelRouting(Array.isArray(next.videoModelRouting) ? next.videoModelRouting : []);
    setCanvasViewMode(next.canvasViewMode || "story");
    setCanvasZoom(Number.isFinite(Number(next.canvasZoom)) ? Number(next.canvasZoom) : 0.82);
    setCanvasSelectedNode(next.canvasSelectedNode || "story-core");
    setCanvasNodePositions(next.canvasNodePositions || {});
    setCanvasRitualMode(next.canvasRitualMode || "premiere");
    setWorkflowNodes(Array.isArray(next.workflowNodes) ? next.workflowNodes : []);
    setWorkflowEdges(Array.isArray(next.workflowEdges) ? next.workflowEdges : []);
    setWorkflowRunLog(Array.isArray(next.workflowRunLog) ? next.workflowRunLog : []);
    setWorkflowRunMode(next.workflowRunMode || "prompt-only");
    setProjectWizard(next.projectWizard || preset.projectWizard);
    setClientViewMode(next.clientViewMode || "overview");
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
      setStatus("Local autosave cache cleared / 已清空本地自动保存缓存，旧默认脚本已移除");
      setWorkspaceStoreVersion(v => v + 1);
    } catch (e) {
      setStatus("Failed to clear local cache / 清空本地缓存失败");
    }
  }

  function applyProjectTemplate(template) {
    if (!template) return;
    setProject(template.title || project);
    setIdeaInput(template.idea || "");
    setCreativeBrief(p => ({ ...p, genre: template.genre || p.genre, mood: template.tone || p.mood }));
    setDouyinViral(p => ({ ...p, enabled: true, videoType: template.type || p.videoType, duration: template.duration || p.duration }));
    setTech(p => ({ ...p, videoDuration: template.duration || p.videoDuration, shotDensity: template.density || p.shotDensity, shotCountMode: "Smart Range / 智能范围", allowAddMissingShots: true }));
    setStatus(`Template applied / 已套用项目模板：${template.title}`);
    showRitual("PROJECT TEMPLATE / 项目模板", template.title, "模板已写入当前工作区，可继续生成剧本大纲或一键完整流程。", 100);
    setProjectStudioOpen(false);
  }


  function applyProjectWizard() {
    const selected = PROJECT_TYPE_OPTIONS.find(x => x.id === projectWizard.projectType) || PROJECT_TYPE_OPTIONS[0];
    const typeLabel = selected.id === "custom" ? (projectWizard.customType || "自定义项目") : selected.zh;
    const idea = selected.id === "custom"
      ? `写一个关于${typeLabel}的短视频，要有剧情、爆款思维和电影感，${projectWizard.duration || "60s"}内。`
      : selected.idea;
    setProject(`${typeLabel} · 北极星项目`);
    setIdeaInput(idea);
    setCreativeBrief(p => ({ ...p, genre: selected.genre || p.genre, mood: selected.mood || p.mood }));
    setDouyinViral(p => ({ ...p, enabled: true, videoType: `${typeLabel} / ${selected.en || "Custom"}`, duration: `${projectWizard.duration || "60s"}以内 / Under ${projectWizard.duration || "60s"}` }));
    setTech(p => ({ ...p, videoDuration: projectWizard.duration || p.videoDuration, shotCountMode: "Smart Range / 智能范围", shotRange: projectWizard.duration === "30s" ? "6-10" : "8-12", allowAddMissingShots: true }));
    setProjectStudioTab("preflight");
    setStatus(`Project wizard applied / 新建项目向导已应用：${typeLabel}`);
    showRitual("NEW PROJECT / 新建项目", `${typeLabel} Studio Ready / 项目已就绪`, `Use Case: ${projectWizard.useCase} · Duration: ${projectWizard.duration}`, 100);
  }

  function getProjectHealthScore() {
    const promptScores = shots.map(s => evaluatePromptQuality(s).score).filter(Boolean);
    const promptAvg = promptScores.length ? Math.round(promptScores.reduce((a, b) => a + b, 0) / promptScores.length) : 0;
    const scriptScore = String(script || outlineDraft || ideaInput || "").length > 80 ? 88 : 62;
    const continuityScore = shots.length > 0 ? Math.min(96, 70 + Math.min(20, shots.length)) : 40;
    const viralScore = douyinViral.enabled ? 86 : 72;
    const deliveryScore = (captionStudio.voiceover || rhythmTable.length || preflightReport) ? 90 : 60;
    const total = Math.round((scriptScore + continuityScore + (promptAvg || 70) + viralScore + deliveryScore) / 5);
    return { total, scriptScore, continuityScore, promptScore: promptAvg || "--", viralScore, deliveryScore };
  }

  function buildClientPreviewText() {
    const health = getProjectHealthScore();
    const shotOverview = shots.map((s, i) => `Shot ${i + 1}｜${inferShotRole(s).zh}｜${s.duration || "4-6s"}｜${s.titleZh || "镜头"}\n${s.sceneZh || ""}`).join("\n\n");
    return [`# Client Preview / 客户预览`, `Project: ${project}`, `Chief Engineer: ${ENGINEER_NAME}`, `Health Score: ${health.total}/100`, "", "## Story / 故事大纲", script || outlineDraft || ideaInput || "未填写", "", "## Visual Style / 视觉风格", creativeBrief.mood || style.name, "", "## Shot Overview / 分镜总览", shotOverview || "尚未生成分镜", "", "## Delivery / 交付内容", "导演分镜 Word、视频提示词包、场景图提示词包、字幕旁白、成片节奏表、质量检查报告"].join(NL);
  }

  function exportProjectFile() {
    const payload = { format: "polaris-project", version: "V8.1", exportedAt: new Date().toISOString(), engineer: ENGINEER_NAME, workspaceMode: workspaceMode || "pro", workspace: captureWorkspace() };
    downloadTextFile(`${safeName(project)}.polaris.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
    setStatus("Project file exported / 工程文件已导出");
  }

  async function importProjectFileFromUpload(e) {
    const file = e?.target?.files?.[0];
    if (!file) return;
    try {
      const txt = await readFileAsText(file);
      const parsed = JSON.parse(txt);
      const ws = parsed.workspace || parsed;
      loadWorkspace(ws, parsed.workspaceMode || workspaceMode || "pro");
      setWorkspaceMode(parsed.workspaceMode || workspaceMode || "pro");
      setProjectStudioOpen(false);
      setStatus(`Project file imported / 已导入工程文件：${file.name}`);
      showRitual("PROJECT FILE / 工程文件", "Project Imported / 项目已导入", file.name, 100);
    } catch (err) {
      showApiError(err, "Project file import failed / 工程文件导入失败");
    } finally {
      if (e?.target) e.target.value = "";
    }
  }

  function copyPlatformPromptForShot(s, platformKey) {
    const variants = buildVideoModelPrompts(s, project, style, tech, negativePrompt);
    const map = { kling: variants.kling, runway: variants.runway, jimeng: variants.jimeng, soraVeo: variants.soraVeo };
    safeCopyText(map[platformKey] || s.finalPrompt || buildFinalPrompt(s, project, style, tech, modules, negativePrompt));
    setStatus(`Copied platform prompt / 已复制平台提示词：${platformKey}`);
  }

  function saveCurrentProjectToLibrary() {
    const item = { id: Date.now(), savedAt: new Date().toLocaleString(), mode: workspaceMode || "pro", title: project || "Untitled Polaris Project", status: shots.length ? (lastArchiveId ? "已封版 / Locked" : "已生成 / Generated") : (script?.trim() ? "草稿 / Draft" : "待开始 / Empty"), shotCount: shots.length, scriptPreview: String(script || ideaInput || "").slice(0, 160), workspace: captureWorkspace() };
    setProjectLibrary(prev => [item, ...prev].slice(0, 30));
    setStatus(`Project saved / 项目已保存到项目中心：${item.title}`);
    showRitual("PROJECT CENTER / 项目中心", "Project Saved / 项目已保存", `${item.title} · ${item.status}`, 100);
  }

  function openProjectFromLibrary(item) {
    if (!item?.workspace) return;
    if (workspaceMode) workspaceStoreRef.current[workspaceMode] = captureWorkspace();
    workspaceStoreRef.current[item.mode || "pro"] = cloneWorkspace(item.workspace);
    loadWorkspace(item.workspace, item.mode || "pro");
    setWorkspaceMode(item.mode || "pro");
    setProjectStudioOpen(false);
    setStatus(`Project opened / 已打开项目：${item.title}`);
  }

  function deleteProjectFromLibrary(id) {
    setProjectLibrary(prev => prev.filter(x => x.id !== id));
    setStatus("Project removed / 已从项目中心移除项目");
  }

  function runPreflightCheck() {
    const issues = [];
    const add = (level, zh, fix) => issues.push({ level, zh, fix });
    if (!apiIsReady) add("High", "API 尚未连接。", "先回到 API Center 点火 AI 引擎。");
    if (!String(ideaInput || script).trim()) add("High", "缺少一句话创作需求或剧本圣经。", "填写主题、时长、风格和用途。");
    if (referenceUrl && referenceIngest.status !== "success" && !referenceManualContent.trim()) add("Medium", "检测到参考链接，但尚未完成解析或手动补充。", "点击识别参考链接，或粘贴标题、字幕、简介。");
    if ((douyinViral.videoType || "").includes("人物") && !personFacts.name) add("Medium", "人物介绍缺少事实补充。", "填写人物姓名、身份、真实经历和不可编造项。");
    if (!tech.videoDuration) add("Low", "缺少预计时长。", "选择 15s/30s/60s 等目标时长。");
    if (!creativeBrief.mood) add("Low", "缺少情绪与视觉基调。", "填写整体情绪、色彩和风格定位。");
    const score = Math.max(55, 100 - issues.reduce((sum, x) => sum + (x.level === "High" ? 18 : x.level === "Medium" ? 10 : 5), 0));
    const report = { score, issues, checkedAt: new Date().toLocaleString(), summary: issues.length ? `发现 ${issues.length} 个可优化项，建议生成前修复。` : "输入完整，可以进入生成流程。" };
    setPreflightReport(report);
    setStatus(`Preflight complete / 生成前体检完成：${score}/100`);
    return report;
  }

  function autoCompleteMissingInfo() {
    if (!ideaInput.trim()) setIdeaInput("写一个关于香港文化的短视频，要有剧情，要有爆款思维，1分钟内的短视频脚本。");
    setCreativeBrief(p => ({ ...p, mood: p.mood || "电影感、真实质感、情绪共鸣、爆款短视频节奏 / cinematic realism, emotional resonance, viral short-video rhythm" }));
    setTech(p => ({ ...p, videoDuration: p.videoDuration || "60s", shotDensity: p.shotDensity || "Balanced / 标准电影节奏", shotRange: p.shotRange || "8-12", allowAddMissingShots: true }));
    setDouyinViral(p => ({ ...p, enabled: true, duration: p.duration || "60s", intensity: p.intensity || OPT.viralIntensities[1] }));
    setStatus("Missing info auto-completed / 已自动补全基础创作信息");
    window.setTimeout(runPreflightCheck, 80);
  }

  function buildRhythmTimeline() {
    const timeline = shots.map((s, i) => ({ id: i + 1, time: `${Math.round(i * 5)}-${Math.round(i * 5 + 5)}s`, role: inferShotRole(s).zh, beat: s.emotionalBeatZh || s.narrativeFunctionZh || "情绪推进", title: s.titleZh || `Shot ${i + 1}`, edit: s.editType || s.transitionZh || "AI_AUTO" }));
    if (!timeline.length) {
      const defaultBeats = ["0-3s｜黄金钩子", "3-10s｜主题悬念", "10-25s｜故事推进", "25-40s｜反差高光", "40-52s｜情绪升华", "52-60s｜金句收尾"];
      setRhythmTable(defaultBeats.map((x, i) => ({ id: i + 1, time: x.split("｜")[0], role: x.split("｜")[1], beat: "待生成", title: "待分镜", edit: "待规划" })));
    } else setRhythmTable(timeline);
    setStatus("Editing rhythm table built / 成片节奏表已生成");
  }

  function buildCaptionVoiceoverStudio() {
    const source = shots.length ? shots.map((s, i) => `Shot ${i + 1}: ${s.sceneZh || s.titleZh}`).join(NL) : (script || outlineDraft || ideaInput || "");
    const hook = douyinViral.enabled ? "前3秒必须制造悬念、反差或情绪钩子。" : "开头建立主题与氛围。";
    const titles = [`${project || "北极星项目"}｜一分钟看懂`, `原来这才是${String(project || "这个故事").replace(/\s+/g, "")}的真正记忆点`, `如果只用60秒，你会怎样讲这个故事？`].join(NL);
    const voiceover = [`【旁白方向】`, hook, `主题：${project}`, `内容依据：${source.slice(0, 900)}`, `结尾：用一句有记忆点的金句收束，避免空泛口号。`].join(NL);
    const subtitles = [`0-3s：一句强钩子字幕`, `3-10s：建立人物/主题悬念`, `10-25s：推进故事与反差`, `25-40s：展示高光或冲突`, `40-52s：情绪升华`, `52-60s：金句收尾 + 评论引导`].join(NL);
    const publishCopy = `发布文案：${project}｜用电影级分镜重新讲述这个故事。你最有共鸣的是哪一幕？`;
    const hashtags = "#北极星AIGC #电影级分镜 #AI视频 #短视频脚本 #导演工作台";
    setCaptionStudio({ voiceover, subtitles, titles, hashtags, publishCopy });
    setStatus("Caption & Voiceover Studio built / 字幕与旁白工作室已生成");
  }

  function exportFullProductionKit() {
    const kit = [`北极星AIGC电影级工业系统 V8.4 · Full Production Kit`, `Project: ${project}`, `Chief Engineer: ${ENGINEER_NAME}`, `Archive ID: ${lastArchiveId || makeArchiveId(project || "Polaris")}`, `Generated At: ${new Date().toLocaleString()}`, "", "## 01 Project Overview / 项目总览", script || outlineDraft || ideaInput || "", "", "## 02 Preflight Report / 生成前体检", preflightReport ? JSON.stringify(preflightReport, null, 2) : "未生成体检报告", "", "## 02B Shot Similarity / 镜头重复检测", shotSimilarityReport ? JSON.stringify(shotSimilarityReport, null, 2) : "未生成镜头重复检测", "", "## 02C Final Video Risk / 成片风险预估", filmRiskReport ? JSON.stringify(filmRiskReport, null, 2) : "未生成成片风险预估", "", "## 03 Editing Rhythm / 成片节奏表", rhythmTable.map(r => `${r.time} · ${r.role} · ${r.title} · ${r.beat}`).join(NL) || "未生成节奏表", "", "## 04 Caption & Voiceover / 字幕旁白", captionStudio.voiceover, captionStudio.subtitles, captionStudio.titles, captionStudio.publishCopy, captionStudio.hashtags, "", "## 05 Prompt Pack / 提示词包", buildPurePromptPack(rebuildFinalPrompts(shots), project), "", "## 05B Image-to-Video Production Pack / 图生视频制作包", createImageToVideoPromptPack(rebuildFinalPrompts(shots), shotKeyframes, visualLocks, videoModelRouting), "", "## 06 Project Data JSON / 项目数据", JSON.stringify(captureWorkspace(), null, 2)].join(NL);
    downloadTextFile(`${safeName(project)}_Polaris_V8_Full_Production_Kit.txt`, kit, "text/plain;charset=utf-8");
    showRitual("PRODUCTION PACKAGE SEALED / 工业交付包封存", "Full Production Kit Exported / 完整制作包已导出", `Chief Engineer: ${ENGINEER_NAME}`, 100);
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
  const importedScriptContext = useMemo(() => {
    const scene = selectedImportScene !== "all" ? scriptImportScenes.find(s => String(s.sceneId || s.id || s.index) === String(selectedImportScene)) : null;
    return [
      scriptImportMeta?.name ? `Imported File / 导入文件: ${scriptImportMeta.name}` : "",
      scriptImportText ? `Imported Script Text / 导入剧本文本:
${scene?.rawText || scene?.summary || scriptImportText.slice(0, 9000)}` : "",
      scriptImportAnalysis ? `Script Analysis / 剧本分析:
${summarizeImportedScriptAnalysis(scriptImportAnalysis)}` : "",
      scene ? `Selected Scene / 选中分场:
${JSON.stringify(scene, null, 2)}` : "",
    ].filter(Boolean).join(NL + NL);
  }, [scriptImportText, scriptImportMeta, scriptImportAnalysis, scriptImportScenes, selectedImportScene]);
  const douyinViralBrief = useMemo(() => buildDouyinViralBrief(tech, douyinViral), [tech, douyinViral]);
  const qualityScore = useMemo(() => Math.min(99, 62 + (script.length > 80 ? 6 : 0) + (shots.length ? 8 : 0) + moduleKeys.length * 2 + (tech.professionalAV ? 5 : 0)), [script, shots, tech.professionalAV, moduleKeys.length]);
  const workflowStatus = [
    { id: "01", label: "API", done: apiLog.status === "success" || apiMode === "proxy" },
    { id: "02", label: "Reference / 参考", done: referenceIngest.status && referenceIngest.status !== "idle" },
    { id: "02B", label: "Import / 文档", done: Boolean(scriptImportText.trim() || scriptImportAnalysis) },
    { id: "03", label: "Outline / 大纲", done: Boolean(outlineDraft.trim() || script.trim()) },
    { id: "04", label: "Plan / 规划", done: shotPlanRows.length > 0 },
    { id: "05", label: "Shots / 分镜", done: shots.length > 0 },
    { id: "06", label: "Quality / 质检", done: Boolean(qualityReport) },
  ];
  const updateModuleField = (key, field, value) => setModules(p => ({ ...p, [key]: { ...p[key], fields: { ...p[key].fields, [field]: value } } }));
  const updateActiveShot = patch => { if (!active) return; setShots(prev => prev.map((s, i) => i === activeShot ? { ...s, ...patch } : s)); };
  const rebuildFinalPrompts = arr => arr.map(s => {
    const enriched = applyConsistencyLocksToShot({ ...s }, characterLock, locationLock);
    const promptQuality = assessPromptQuality(enriched);
    return { ...enriched, promptQualityScore: promptQuality.score, promptQualityNotesZh: promptQuality.zh, promptQualityNotesEn: promptQuality.en, finalPrompt: buildFinalPrompt(enriched, project, style, tech, modules, negativePrompt), finalSceneImagePrompt: tech.generateSceneImagePrompt ? buildSceneImageModelVariant(enriched, project, style, tech, negativePrompt) : "" };
  });

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


  async function handleScriptDocumentUpload(event) {
    const file = event?.target?.files?.[0];
    if (!file) return;
    setIsImportingScript(true);
    setStatus("Importing script document / 正在导入剧本文档");
    try {
      const { text, meta } = await extractScriptDocumentText(file);
      if (!String(text || "").trim()) throw new Error("No readable text found / 文档中没有读取到可用文本");
      setScriptImportText(text);
      setScriptImportMeta(meta);
      setScriptImportAnalysis(null);
      setScriptImportScenes([]);
      setSelectedImportScene("all");
      setStatus(`Script imported / 剧本文档已导入：${meta.name} · ${text.length} chars`);
    } catch (e) {
      showApiError(e, "Script Import Error / 剧本文档导入失败");
      setStatus(`Script import failed / 剧本文档导入失败：${e.message}`);
    } finally {
      setIsImportingScript(false);
      if (event?.target) event.target.value = "";
    }
  }

  async function handleAnalyzeImportedScript() {
    if (apiMode === "direct" && !apiKey.trim()) return setStatus("API Key Required / 请输入 DeepSeek API Key");
    if (!scriptImportText.trim()) return setStatus("Import Required / 请先导入 Word、TXT 或 MD 剧本文档");
    const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
    setIsAnalyzingImportedScript(true);
    setStatus(`Analyzing imported script with ${apiModel} / 正在分析导入剧本`);
    try {
      const res = await fetch(deepSeekEndpoint, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({
          model: apiModel,
          messages: [
            { role: "system", content: "You are Script Import Lab for Polaris AIGC Cinema Industrial System. Analyze imported screenplay/doc text and return ONLY JSON with fields: title, logline, analysisReport, creativeBible, theme, characters, relationships, locations, props, emotionalCurve, narrativeRhythm, conflictPoints, climax, ending, qualityDiagnosis, adaptationRisks, recommendedShotRange, scenes. scenes must be an array of objects with sceneId, titleZh, titleEn, location, characters, storyFunction, emotionalBeat, keyActions, dialogueFocus, suggestedShotCount, rawTextSummary. Do not invent facts not present in the document." },
            { role: "user", content: [`Imported File / 导入文件: ${scriptImportMeta?.name || "Untitled"}`, `Parse Goal / 解析目标: turn this document into a director-ready script bible and scene breakdown for shot generation.`, `Document Text / 文档正文:\n${scriptImportText.slice(0, 28000)}`].join(NL) }
          ],
          thinking: { type: String(thinkingMode).split(" /")[0] },
          temperature: 0.35,
          response_format: { type: "json_object" }
        })
      });
      if (!res.ok) throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 180)}`);
      const data = await res.json();
      const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
      const scenes = Array.isArray(parsed.scenes) ? parsed.scenes : [];
      setScriptImportAnalysis(parsed);
      setScriptImportScenes(scenes);
      setSelectedImportScene("all");
      if (parsed.title && (!project || project.includes("Project") || project.includes("项目"))) setProject(parsed.title);
      setStatus(`Script analysis complete / 剧本文档分析完成：${scenes.length} scenes`);
      return parsed;
    } catch (e) {
      showApiError(e, "Script Analysis Error / 剧本分析失败");
      setStatus(`Script analysis failed / 剧本分析失败：${e.message}`);
      return null;
    } finally {
      setIsAnalyzingImportedScript(false);
    }
  }

  function buildImportedScriptBible() {
    const scene = selectedImportScene !== "all" ? scriptImportScenes.find(s => String(s.sceneId || s.id || s.index) === String(selectedImportScene)) : null;
    const analysisText = summarizeImportedScriptAnalysis(scriptImportAnalysis);
    const sceneText = scene ? [
      `选中分场 / Selected Scene: ${scene.titleZh || scene.titleEn || scene.sceneId || "Scene"}`,
      `场景地点 / Location: ${scene.location || ""}`,
      `出场人物 / Characters: ${Array.isArray(scene.characters) ? scene.characters.join("、") : (scene.characters || "")}`,
      `剧情功能 / Story Function: ${scene.storyFunction || ""}`,
      `情绪节点 / Emotional Beat: ${scene.emotionalBeat || ""}`,
      `关键动作 / Key Actions: ${scene.keyActions || ""}`,
      `对白重点 / Dialogue Focus: ${scene.dialogueFocus || ""}`,
      `建议镜头数 / Suggested Shot Count: ${scene.suggestedShotCount || ""}`,
      `分场摘要 / Scene Summary: ${scene.rawTextSummary || scene.summary || ""}`,
      scene.rawText ? `分场原文 / Raw Text:\n${scene.rawText}` : "",
    ].filter(Boolean).join(NL) : `全文导入剧本 / Full Imported Script:\n${scriptImportText.slice(0, 16000)}`;
    return [
      "【Imported Script Bible / 导入剧本创作圣经】",
      scriptImportMeta?.name ? `文件 / File: ${scriptImportMeta.name}` : "",
      scriptImportAnalysis?.title ? `标题 / Title: ${scriptImportAnalysis.title}` : "",
      analysisText,
      scriptImportAnalysis?.creativeBible ? `\n【Director Creative Bible / 导演创作圣经】\n${scriptImportAnalysis.creativeBible}` : "",
      scriptImportAnalysis?.qualityDiagnosis ? `\n【Script Quality Diagnosis / 剧本质量诊断】\n${scriptImportAnalysis.qualityDiagnosis}` : "",
      scriptImportAnalysis?.adaptationRisks ? `\n【Adaptation Risks / 分镜化难点】\n${scriptImportAnalysis.adaptationRisks}` : "",
      "\n【Source Scope / 分镜生成范围】",
      sceneText,
      "\n【Important / 重要】后续分镜必须严格来自以上导入剧本文档，不得虚构未出现的人物、场景、经历或剧情。",
    ].filter(Boolean).join(NL);
  }

  function handleApplyImportedScriptToBible() {
    if (!scriptImportText.trim() && !scriptImportAnalysis) return setStatus("No imported script / 还没有导入剧本文档");
    const bible = buildImportedScriptBible();
    setScript(bible);
    setOutlineDraft(bible);
    setStatus("Imported script applied to Script Bible / 已写入剧本与创作圣经");
  }

  function handleGenerateShotPlanFromImport() {
    const bible = buildImportedScriptBible();
    setScript(bible);
    setOutlineDraft(bible);
    return handleGenerateShotPlan(bible);
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
            { role: "system", content: "You are a bilingual film development writer, mini-drama showrunner, Douyin viral strategist and AI-video prompt architect. CLIENT INPUT IS ABSOLUTE. The user's current Idea / 想法 is the only creative source of truth. Do NOT use examples, templates, old localStorage projects, previous scripts, default stories, old characters, old places, or any preset content unless the current user input explicitly asks for them. If the user asks for Hong Kong culture, every outline beat must be about Hong Kong culture. If the user asks for a school/person/product, every beat must serve that exact subject. First build a STORY CORE from the client input, then write the outline. Return ONLY valid JSON: {\"storyCore\":\"...\",\"miniDramaStructure\":\"...\",\"scriptOutline\":\"...\",\"outlineQuality\":\"...\",\"mood\":\"...\",\"viralStrategy\":\"...\",\"coverTitle\":\"...\",\"threeSecondHook\":\"...\",\"promptSeed\":\"...\"}. The storyCore must include theme, protagonist, desire, obstacle, conflict, reversal, emotional turn and memorable ending. The miniDramaStructure must include 0-3s hook, 3-10s goal/suspense, 10-25s conflict, 25-40s reversal/highlight, 40-52s emotional lift, 52-60s golden-line ending. outlineQuality must score story appeal, character memory, conflict strength, viral potential and shotability, with fixes. The outline must be cinematic, visual, coherent, suitable for AI video generation and platform retention. For real-person introductions, do not invent identity, awards, experiences or achievements unless provided in the reference content or user text." },
            { role: "user", content: [buildClientAuthorityBlock({ idea: ideaInput, script, outline: outlineDraft, imported: importedScriptContext, reference: referenceContextForRequest }), `Reference Context / 参考链接理解:\n${referenceContextForRequest}`, `Douyin Viral Brief / 抖音爆款策略:\n${douyinViralBrief}`, `Short Video Type / 短视频类型: ${douyinViral.videoType}`, `Target Duration / 目标时长: ${douyinViral.duration}`, `Content Engine Mode / 内容增强模式: ${tech.contentEngineMode}`, `Prompt Strength / 提示词强度: ${tech.promptStrength}`, `Genre / 类型: ${creativeBrief.genre}`, `Pacing / 节奏: ${creativeBrief.pacing}`, `Dialogue Style / 台词风格: ${creativeBrief.dialogueStyle}`, `Project / 项目: ${project}`, `Hard negative examples / 禁止：不要生成与本轮客户输入无关的默认脚本、旧项目脚本、模板脚本、系统示例脚本。`, `Important / 重要: If reference link content is unreadable, mark missing facts and build only around the user-provided verified details.`].join(NL) }
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
      const enhancedOutline = [
        parsed.storyCore ? `## Story Core Engine / 故事核心
${parsed.storyCore}` : "",
        parsed.miniDramaStructure ? `## Mini Drama Structure / 短剧电影结构
${parsed.miniDramaStructure}` : "",
        `## Script Outline / 剧本大纲
${outline}`,
        parsed.outlineQuality ? `## Outline Quality Check / 大纲质量检查
${parsed.outlineQuality}` : "",
        parsed.promptSeed ? `## Prompt Seed / 提示词种子
${parsed.promptSeed}` : "",
      ].filter(Boolean).join(`${NL}${NL}`);
      setOutlineDraft(enhancedOutline);
      if (parsed.mood) setCreativeBrief(p => ({ ...p, mood: parsed.mood }));
      if (parsed.viralStrategy || parsed.coverTitle || parsed.threeSecondHook) {
        setReferenceIngest(p => ({ ...p, viralRhythm: parsed.viralStrategy || p.viralRhythm, suggestedShortVideoAngle: [parsed.coverTitle, parsed.threeSecondHook].filter(Boolean).join(" / ") }));
      }
      setStatus("Script outline generated with reference + Douyin logic / 已按参考链接与抖音爆款逻辑生成剧本大纲，请确认后再生成提示词");
      return enhancedOutline;
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
    setStatus(`Outline confirmed / 已确认剧本大纲 · FP ${scriptFingerprint(outline)}`);
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
    const referenceContextForPlan = referencePromptContext;
    const effectiveScript = resolveAuthoritativeScript({ scriptOverride, script, ideaInput, outlineDraft, importedScriptContext, referenceContext: referenceContextForPlan });
    if (apiMode === "direct" && !apiKey.trim()) return setStatus("API Key Required / 请输入 DeepSeek API Key");
    if (!cleanUserText(effectiveScript)) return setStatus("Script Required / 请输入剧本大纲或一句话创作需求");
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


  function handleQuickRefineCurrentPrompt(mode = promptRefineMode) {
    if (!active) return setStatus("No active shot / 没有当前镜头可精修");
    setPromptVersions(prev => [{ id: Date.now(), time: new Date().toLocaleString(), shot: activeShot + 1, reason: `Quick refine: ${mode}`, shotData: active }, ...prev].slice(0, 12));
    setShots(prev => rebuildFinalPrompts(prev.map((s, i) => i === activeShot ? locallyRefineShotPrompt(s, mode) : s)));
    setStatus(`Prompt refined locally / 已精修当前镜头提示词：${mode}`);
  }

  async function handleRewriteOutline() {
    const base = String(outlineDraft || script || ideaInput || "").trim();
    if (!base) return setStatus("Outline Required / 请先生成或输入剧本大纲");
    if (apiMode === "direct" && !apiKey.trim()) return setStatus("API Key Required / 请输入 DeepSeek API Key");
    const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
    setIsGeneratingOutline(true);
    setStatus(`Rewriting outline / 正在打磨大纲：${outlineRewriteMode}`);
    try {
      const body = {
        model: apiModel,
        messages: [
          { role: "system", content: "You are a bilingual film and short-drama story editor. Return JSON only." },
          { role: "user", content: [`Rewrite and strengthen this script outline without changing the project name.`, `Mode: ${outlineRewriteMode}`, `Content Engine: ${tech.contentEngineMode}`, `Douyin Viral: ${douyinViral.enabled ? "enabled" : "disabled"}`, `Requirements: stronger story core, protagonist desire, conflict, twist, 3-second hook, emotional turn, ending line, shot-friendly structure.`, `Return JSON: {\"outlineZh\":\"...\",\"outlineEn\":\"...\",\"storyScore\":{\"attraction\":90,\"conflict\":90,\"viral\":90,\"shotable\":90},\"fixNotesZh\":[\"...\"]}`, `Current outline/script:`, base].join(NL) }
        ],
        temperature: 0.75,
        response_format: { type: "json_object" }
      };
      if (String(thinkingMode).split(" /")[0] === "enabled") body.thinking = { type: "enabled" };
      const headers = apiHeaders();
      const res = await fetch(deepSeekEndpoint, { method: "POST", headers, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 220)}`);
      const data = await res.json();
      const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "", {});
      const nextOutline = [parsed.outlineZh, parsed.outlineEn ? `${NL}${NL}${parsed.outlineEn}` : "", Array.isArray(parsed.fixNotesZh) ? `${NL}${NL}【打磨建议】${NL}${parsed.fixNotesZh.join(NL)}` : ""].join("").trim() || base;
      setOutlineDraft(nextOutline);
      setStatus(`Outline rewritten / 大纲已打磨：${outlineRewriteMode}`);
    } catch (e) {
      const info = friendlyApiError(e);
      setApiErrorModal(info);
      setStatus(`${info.title}: ${info.message}`);
    } finally {
      setIsGeneratingOutline(false);
    }
  }

  function handleRunShotSimilarityCheck() {
    const report = buildShotSimilarityReport(rebuildFinalPrompts(shots));
    setShotSimilarityReport(report);
    setStatus(`Shot similarity checked / 镜头重复检测完成：${report.score}/100 · ${report.risk}`);
  }

  function handleRunFilmRiskEstimate() {
    const report = buildFilmRiskReport(rebuildFinalPrompts(shots));
    setFilmRiskReport(report);
    setStatus(`Film risk estimated / 成片风险预估完成：${report.score}/100 · ${report.risk}`);
  }


  async function generateImageForShot(shot, index = 0) {
    const prompt = buildShotKeyframePrompt(shot, project, style, tech, visualLocks);
    const id = String(shot.id || index + 1);
    setShotKeyframes(prev => ({ ...prev, [id]: { ...(prev[id] || {}), status: "generating", prompt, shotTitle: shot.titleZh || shot.titleEn, images: prev[id]?.images || [] } }));
    const body = { provider: imageApiSettings.provider, model: imageApiSettings.model, prompt, size: imageApiSettings.size, quality: imageApiSettings.quality, n: Math.max(1, Math.min(4, Number(imageApiSettings.candidates || 1))), shot: { id, titleZh: shot.titleZh, titleEn: shot.titleEn } };
    const res = await fetch(imageApiSettings.endpoint || "/api/image-generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`Image API Error ${res.status}: ${(await res.text()).slice(0, 240)}`);
    const data = await res.json();
    const images = Array.isArray(data.images) ? data.images : Array.isArray(data.data) ? data.data : [];
    const normalizedImages = images.map((img, i) => ({ ...img, id: `${id}-${Date.now()}-${i}`, prompt, provider: imageApiSettings.provider, model: imageApiSettings.model, createdAt: new Date().toLocaleString() }));
    setShotKeyframes(prev => ({ ...prev, [id]: { status: "done", prompt, shotTitle: shot.titleZh || shot.titleEn, selectedIndex: 0, images: normalizedImages, updatedAt: new Date().toLocaleString() } }));
    return normalizedImages;
  }

  async function handleGenerateShotKeyframe(index = activeShot) {
    const prepared = rebuildFinalPrompts(shots);
    const shot = prepared[index];
    if (!shot) return setStatus("No active shot / 当前没有可生成关键帧的镜头");
    setIsGeneratingKeyframes(true);
    setStatus(`Generating keyframe for Shot ${index + 1} / 正在生成第 ${index + 1} 镜关键帧`);
    try {
      await generateImageForShot(shot, index);
      setStatus(`Shot ${index + 1} keyframe generated / 第 ${index + 1} 镜关键帧已生成`);
    } catch (e) {
      showApiError(e, "Image generation failed / 图片生成失败");
    } finally {
      setIsGeneratingKeyframes(false);
    }
  }

  async function handleGenerateAllShotKeyframes(sourceShots = null, options = {}) {
    const prepared = rebuildFinalPrompts(Array.isArray(sourceShots) && sourceShots.length ? sourceShots : shots);
    if (!prepared.length) return setStatus("No shots to generate keyframes / 还没有分镜，无法生成关键帧");
    if (!options.skipConfirm && !confirmVisualGeneration("Generate All Shot Keyframes / 生成全部分镜关键帧", prepared)) return setStatus("Keyframe generation cancelled / 已取消关键帧生成，未调用图片接口");
    setIsGeneratingKeyframes(true);
    showRitual("SHOT KEYFRAME STUDIO / 分镜关键帧工作室", "Generating Shot Keyframes / 正在生成分镜关键帧", `共 ${prepared.length} 个镜头 · ${imageApiSettings.provider}`, 38);
    try {
      for (let i = 0; i < prepared.length; i += 1) {
        setStatus(`Generating keyframe ${i + 1}/${prepared.length} / 正在生成关键帧 ${i + 1}/${prepared.length}`);
        await generateImageForShot(prepared[i], i);
      }
      showRitual("KEYFRAMES READY / 关键帧完成", "Visual Pre-production Deck Ready / 视觉前期板已生成", `已生成 ${prepared.length} 个镜头关键帧，可进入视觉锁定与视频模型路由。`, 100);
      setStatus("All shot keyframes generated / 全部分镜关键帧已生成");
    } catch (e) {
      showApiError(e, "Batch keyframe generation failed / 批量关键帧生成失败");
    } finally {
      setIsGeneratingKeyframes(false);
    }
  }

  function selectShotKeyframe(shotId, imageIndex = 0) {
    setShotKeyframes(prev => ({ ...prev, [String(shotId)]: { ...(prev[String(shotId)] || {}), selectedIndex: imageIndex } }));
  }

  function lockVisualFromKeyframe(type = "firstFrame", shotId = null) {
    const prepared = rebuildFinalPrompts(shots);
    const id = String(shotId || prepared[activeShot]?.id || activeShot + 1);
    const frame = shotKeyframes[id];
    const shot = prepared.find(s => String(s.id) === id) || prepared[activeShot];
    if (!shot) return setStatus("No shot selected / 没有选中的镜头");
    const hero = frame?.images?.[frame.selectedIndex || 0];
    const summary = buildVisualLockSummaryFromShot(shot, hero);
    setVisualLocks(prev => ({ ...prev, [type]: { ...(prev[type] || {}), ...summary } }));
    if (type === "character") setCharacterAssets(prev => [{ id: Date.now(), title: shot.titleZh || "角色资产", ...summary }, ...prev].slice(0, 24));
    if (type === "location") setLocationAssets(prev => [{ id: Date.now(), title: shot.titleZh || "场景资产", ...summary }, ...prev].slice(0, 24));
    setStatus(`Visual lock saved / 已保存视觉锁定：${type}`);
  }

  function handleBuildVideoModelRouter() {
    const prepared = rebuildFinalPrompts(shots);
    const rows = prepared.map((s, i) => {
      const frame = shotKeyframes[String(s.id || i + 1)];
      const hero = frame?.images?.[frame.selectedIndex || 0];
      return { ...buildVideoRouteForShot(s, hero), shotIndex: i + 1, title: s.titleZh || s.titleEn, hasHeroFrame: Boolean(hero) };
    });
    setVideoModelRouting(rows);
    setStatus("Video model routing built / 视频模型路由建议已生成");
  }

  function getVisualGenerationEstimate(sourceShots = null) {
    const prepared = rebuildFinalPrompts(Array.isArray(sourceShots) && sourceShots.length ? sourceShots : shots);
    const shotCount = prepared.length || Math.max(1, Number(tech.shotCount || 8));
    const candidates = Math.max(1, Math.min(4, Number(imageApiSettings.candidates || 1)));
    const totalImages = shotCount * candidates;
    return { shotCount, candidates, totalImages, provider: imageApiSettings.provider, model: imageApiSettings.model, size: imageApiSettings.size };
  }

  function confirmVisualGeneration(actionLabel = "Generate keyframes / 生成关键帧", sourceShots = null) {
    if (typeof window === "undefined") return true;
    const e = getVisualGenerationEstimate(sourceShots);
    const msg = [
      `${actionLabel}`,
      "",
      `即将调用图片生成接口 / Image API will be called`,
      `Provider: ${e.provider}`,
      `Model: ${e.model}`,
      `Shots: ${e.shotCount}`,
      `Candidates per shot: ${e.candidates}`,
      `Estimated images: ${e.totalImages}`,
      "",
      "这可能产生 API 费用。只需要提示词的用户请选择 Prompt Only。",
      "确认继续生成图片吗？"
    ].join("\n");
    return window.confirm(msg);
  }

  function handleExportImageToVideoPack() {
    const prepared = rebuildFinalPrompts(shots);
    const pack = createImageToVideoPromptPack(prepared, shotKeyframes, visualLocks, videoModelRouting);
    downloadTextFile(`${safeName(project)}_Polaris_V8_Image_to_Video_Pack.txt`, pack, "text/plain;charset=utf-8");
    showRitual("I2V PACKAGE SEALED / 图生视频包封存", "Image-to-Video Production Pack Exported / 图生视频制作包已导出", `Shot keyframes + visual locks + model routing · Chief Engineer ${ENGINEER_NAME}`, 100);
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
      const promptReport = buildPromptQualityReport(shots, tech, douyinViral);
      setQualityReport({ ...parsed, promptQuality: promptReport, score: parsed.score || promptReport.score });
      setStatus(`Quality report ready / 质量检查完成：${parsed.score || promptReport.score || "-"}分`);
    } catch (e) {
      const local = localQualityReport(shots, tech, douyinViral);
      const promptReport = buildPromptQualityReport(shots, tech, douyinViral);
      setQualityReport({ ...local, ...promptReport, error: String(e.message || e) });
      setStatus(`Quality Check Error, local fallback used / 质量检查失败，已使用本地兜底：${e.message}`);
    } finally {
      setIsCheckingQuality(false);
    }
  }

  async function handleOneClickProduction(options = {}) {
    if (isOneClickRunning || isGenerating) return;
    const includeImages = options?.includeImages ?? productionFlowMode === "full-visual";
    const hasIdeaOrScript = ideaInput.trim() || outlineDraft.trim() || script.trim();
    if (!hasIdeaOrScript) return setStatus("Please enter an idea or script first / 请先输入想法或剧本");
    if (apiMode === "direct" && !apiKey.trim()) return setStatus("API Key Required / 请输入 DeepSeek API Key");
    setIsOneClickRunning(true);
    try {
      setStatus(includeImages ? "Full visual production started / 完整视觉流程开始：提示词 + 关键帧" : "Prompt-only production started / 只生成提示词流程开始");
      if ((referenceUrl.trim() || extractFirstUrl(ideaInput)) && referenceIngest.status === "idle") await handleIngestReference();
      let localOutline = "";
      if (ideaInput.trim()) {
        // 客户输入一旦存在，必须以本轮输入重新生成大纲，避免旧剧本/默认脚本污染。
        setScript("");
        setShots([]);
        setShotPlanRows([]);
        const generatedOutline = await handleGenerateScriptOutline();
        localOutline = String(generatedOutline || "").trim();
      } else {
        localOutline = outlineDraft.trim();
        if (!script.trim() && !localOutline) {
          const generatedOutline = await handleGenerateScriptOutline();
          localOutline = String(generatedOutline || "").trim();
        }
      }
      const effective = (localOutline || (ideaInput.trim() ? ideaInput : script)).trim();
      if (effective) setScript(effective);
      if (!shotPlanRows.length && effective) await handleGenerateShotPlan(effective);
      const generatedShots = await handleGenerate(effective || script);
      if (generatedShots?.length) {
        setTimeout(() => handleRunQualityCheck(), 900);
        if (includeImages) {
          setStatus("Prompt package complete, entering keyframe generation / 提示词包已完成，进入关键帧生成");
          await handleGenerateAllShotKeyframes(generatedShots, { skipConfirm: true });
          handleBuildVideoModelRouter(generatedShots);
          setProjectStudioOpen(true);
          setProjectStudioTab("visual");
        } else {
          setStatus("Prompt-only package complete / 只生成提示词流程完成，未自动调用图片生成接口");
          setProjectStudioOpen(true);
          setProjectStudioTab("prompt");
        }
      }
    } finally {
      setIsOneClickRunning(false);
    }
  }

  async function handlePromptOnlyProduction() {
    setProductionFlowMode("prompt-only");
    return handleOneClickProduction({ includeImages: false });
  }

  async function handleFullVisualProduction() {
    setProductionFlowMode("full-visual");
    if (!confirmVisualGeneration("Full Visual Production / 完整视觉流程", shots.length ? shots : null)) {
      setProductionFlowMode("prompt-only");
      return setStatus("Full visual flow cancelled / 已取消完整视觉流程，切回只生成提示词");
    }
    return handleOneClickProduction({ includeImages: true });
  }

  function openPromptOnlyWorkspace() {
    setProductionFlowMode("prompt-only");
    setProjectStudioOpen(true);
    setProjectStudioTab("prompt");
    setStatus("Prompt-only mode selected / 已选择只生成提示词模式，不会自动调用图片生成接口");
  }

  function openFullVisualWorkspace() {
    setProductionFlowMode("full-visual");
    setProjectStudioOpen(true);
    setProjectStudioTab("visual");
    setStatus("Full visual flow selected / 已选择完整视觉流程，可在分镜后生成关键帧");
  }


  function openDirectorCanvas() {
    setProjectStudioOpen(true);
    setProjectStudioTab("canvas");
    setCanvasSelectedNode(canvasSelectedNode || "idea-input");
    setCanvasRitualMode("premiere");
    if (!workflowNodes.length) setWorkflowNodes(buildDefaultWorkflowNodes());
    if (!workflowEdges.length) setWorkflowEdges(buildDefaultWorkflowEdges());
    showRitual("NODE CANVAS IGNITION / 节点画布点火", "V8.1 Workflow Canvas Online / 节点式工作流上线", "所有节点都可连接、可运行：Prompt Only 到提示词包，Full Visual 到关键帧与图生视频包。", 100);
    setStatus("Node-based Director Canvas opened / 节点式导演工作流画布已打开");
  }

  function getNodePosition(id, fallbackX, fallbackY) {
    const saved = canvasNodePositions?.[id];
    return {
      x: Number.isFinite(Number(saved?.x)) ? Number(saved.x) : fallbackX,
      y: Number.isFinite(Number(saved?.y)) ? Number(saved.y) : fallbackY,
    };
  }

  function buildDefaultWorkflowNodes() {
    return [
      { id: "engine-ignition", type: "ritual", group: "ritual", title: "Engine Ignition / 引擎点火", action: "engine", x: 70, y: 80 },
      { id: "idea-input", type: "input", group: "input", title: "Idea Input / 一句话需求", action: "input", x: 350, y: 80 },
      { id: "reference-ingest", type: "input", group: "input", title: "Reference URL / 参考链接解析", action: "reference", x: 630, y: 80 },
      { id: "word-script", type: "input", group: "input", title: "Word Script / 文档剧本", action: "word", x: 910, y: 80 },
      { id: "story-core", type: "story", group: "story", title: "Story Core / 故事核心", action: "story", x: 350, y: 340 },
      { id: "outline-writer", type: "story", group: "story", title: "Outline Writer / 大纲生成", action: "outline", x: 630, y: 520 },
      { id: "outline-polish", type: "story", group: "story", title: "Script Polish / 大纲打磨", action: "outline-polish", x: 910, y: 700 },
      { id: "shot-planner", type: "shot", group: "shot", title: "Shot Planner / 分镜规划", action: "shot-plan", x: 350, y: 940 },
      { id: "shot-generator", type: "shot", group: "shot", title: "Shot Generator / 分镜生成", action: "shots", x: 630, y: 1120 },
      { id: "continuity-check", type: "shot", group: "shot", title: "Continuity Check / 连续性检查", action: "continuity", x: 910, y: 1300 },
      { id: "prompt-compiler", type: "prompt", group: "prompt", title: "Prompt Compiler / 提示词编译", action: "prompt-compile", x: 350, y: 1540 },
      { id: "prompt-debugger", type: "prompt", group: "prompt", title: "Prompt Debugger / 提示词诊断", action: "prompt-debug", x: 630, y: 1720 },
      { id: "prompt-pack", type: "output", group: "output", title: "Prompt Pack Export / 提示词包", action: "prompt-pack", x: 910, y: 1900 },
      { id: "scene-prompt", type: "image", group: "image", title: "Scene Image Prompt / 场景图提示词", action: "scene-prompt", x: 350, y: 2140 },
      { id: "seedream-keyframe", type: "image", group: "image", title: "Seedream Keyframes / 即梦关键帧", action: "seedream", x: 630, y: 2320 },
      { id: "visual-lock", type: "image", group: "image", title: "Visual Lock / 视觉锁定", action: "visual-lock", x: 910, y: 2500 },
      { id: "model-router", type: "video", group: "video", title: "Video Model Router / 视频模型路由", action: "router", x: 350, y: 2740 },
      { id: "i2v-pack", type: "video", group: "video", title: "I2V Production Pack / 图生视频包", action: "i2v-pack", x: 630, y: 2920 },
      { id: "chief-seal", type: "ritual", group: "ritual", title: "Chief Engineer Seal / 总工程师封存", action: "seal", x: 910, y: 3100 },
      { id: "delivery-pack", type: "output", group: "output", title: "Full Production Kit / 完整交付包", action: "delivery", x: 1190, y: 3100 },
    ];
  }

  function buildDefaultWorkflowEdges() {
    return [
      ["engine-ignition", "idea-input", "gold"], ["idea-input", "story-core", "text"], ["reference-ingest", "story-core", "text"], ["word-script", "story-core", "text"],
      ["story-core", "outline-writer", "text"], ["outline-writer", "outline-polish", "text"], ["outline-polish", "shot-planner", "text"], ["shot-planner", "shot-generator", "text"], ["shot-generator", "continuity-check", "text"],
      ["continuity-check", "prompt-compiler", "purple"], ["prompt-compiler", "prompt-debugger", "purple"], ["prompt-debugger", "prompt-pack", "green"],
      ["prompt-compiler", "scene-prompt", "purple"], ["scene-prompt", "seedream-keyframe", "blue"], ["seedream-keyframe", "visual-lock", "blue"], ["visual-lock", "model-router", "gold"], ["model-router", "i2v-pack", "green"], ["i2v-pack", "chief-seal", "gold"], ["chief-seal", "delivery-pack", "green"],
    ].map(([source, target, kind], i) => ({ id: `edge-${i + 1}`, source, target, kind }));
  }

  function getWorkflowNodes() {
    const base = workflowNodes.length ? workflowNodes : buildDefaultWorkflowNodes();
    return base.map((n, index) => {
      const pos = getNodePosition(n.id, n.x ?? (80 + (index % 4) * 280), n.y ?? (80 + Math.floor(index / 4) * 210));
      return enrichWorkflowNode({ ...n, ...pos });
    });
  }

  function getWorkflowEdges() {
    return workflowEdges.length ? workflowEdges : buildDefaultWorkflowEdges();
  }

  function workflowNodeStatus(node) {
    const countKeyframes = Object.values(shotKeyframes || {}).filter(x => x?.images?.length).length;
    switch (node.action) {
      case "engine": return apiIsReady ? "ready" : "warning";
      case "input": return String(ideaInput || script || outlineDraft || scriptImportText).trim() ? "ready" : "warning";
      case "reference": return referenceIngest.status === "success" ? "ready" : referenceUrl ? "warning" : "idle";
      case "word": return scriptImportText.trim() ? "ready" : "idle";
      case "story": return String(script || outlineDraft || ideaInput).trim() ? "ready" : "warning";
      case "outline": return outlineDraft || script ? "ready" : "idle";
      case "outline-polish": return outlineDraft ? "ready" : "idle";
      case "shot-plan": return shotPlanRows.length ? "ready" : "idle";
      case "shots": return shots.length ? "ready" : "idle";
      case "continuity": return qualityReport || shotSimilarityReport ? "ready" : shots.length ? "idle" : "warning";
      case "prompt-compile": return shots.length ? "ready" : "warning";
      case "prompt-debug": return qualityReport ? "ready" : shots.length ? "idle" : "warning";
      case "prompt-pack": return shots.length ? "ready" : "warning";
      case "scene-prompt": return shots.length ? "ready" : "warning";
      case "seedream": return countKeyframes ? "ready" : shots.length ? "idle" : "warning";
      case "visual-lock": return Object.values(visualLocks || {}).some(v => v?.description || v?.image) ? "ready" : countKeyframes ? "idle" : "warning";
      case "router": return videoModelRouting.length ? "ready" : shots.length ? "idle" : "warning";
      case "i2v-pack": return shots.length ? "ready" : "warning";
      case "seal": return lastArchiveId ? "ready" : "idle";
      case "delivery": return shots.length ? "ready" : "warning";
      case "single-shot": return "ready";
      default: return "idle";
    }
  }

  function enrichWorkflowNode(node) {
    const status = workflowNodeStatus(node);
    const shotCount = shots.length;
    const keyframeCount = Object.values(shotKeyframes || {}).filter(x => x?.images?.length).length;
    const textSource = script || outlineDraft || ideaInput || scriptImportText || "等待用户输入 / Waiting for user input";
    const bodyMap = {
      engine: apiIsReady ? `API connected · ${selectedModel}` : "需要先连接 DeepSeek API / Connect API first",
      input: String(ideaInput || textSource).slice(0, 220),
      reference: referenceIngest.status === "success" ? `${referenceIngest.title || "Reference"}\n${referenceIngest.summary || ""}` : (referenceUrl || "可选：输入参考链接后运行 / Optional reference URL"),
      word: scriptImportMeta?.name ? `${scriptImportMeta.name}\n${String(scriptImportText).slice(0, 180)}` : "可选：导入 Word/TXT/MD 剧本 / Optional script import",
      story: String(textSource).slice(0, 260),
      outline: String(outlineDraft || script || "运行后生成故事大纲 / Run to generate outline").slice(0, 260),
      "outline-polish": `大纲打磨方向：${outlineRewriteMode}`,
      "shot-plan": shotPlanRows.length ? `${shotPlanRows.length} rows · ${shotPlanDiagnosis.zh || "分镜规划已生成"}` : "运行后生成镜头覆盖规划 / Run to plan coverage",
      shots: shotCount ? `${shotCount} shots ready / 分镜已生成` : "运行后生成正式分镜 / Run to generate shots",
      continuity: qualityReport ? `${qualityReport.score || "--"}/100 · ${qualityReport.summaryZh || "已检查"}` : "检查连续性、重复镜头与风险 / Check continuity and risks",
      "prompt-compile": shotCount ? "编译视频提示词、场景图提示词、负面提示词、多模型适配 / Compile executable prompts" : "需要先生成分镜 / Shots required",
      "prompt-debug": qualityReport?.promptQuality ? `${qualityReport.promptQuality.score}/100 · ${qualityReport.promptQuality.summaryZh}` : "运行提示词诊断 / Run prompt debugger",
      "prompt-pack": shotCount ? `${shotCount} video prompts + scene image prompts` : "需要先生成分镜 / Shots required",
      "scene-prompt": shotCount ? `${shotCount} scene image prompts ready` : "需要先生成分镜 / Shots required",
      seedream: `${keyframeCount}/${shotCount || 0} keyframes · Full Visual 才会调用图片 API`,
      "visual-lock": Object.values(visualLocks || {}).filter(v => v?.description || v?.image).length + " locks / 视觉锁定数量",
      router: videoModelRouting.length ? `${videoModelRouting.length} routes ready` : "运行后推荐可灵/Runway/Luma/Sora/Veo",
      "i2v-pack": "导出图生视频制作包 / Export image-to-video pack",
      seal: lastArchiveId || "运行后封存版本并生成认证编号",
      delivery: "Word / Prompt Pack / Full Kit / Client Preview / Project JSON",
    };
    return { ...node, status, body: bodyMap[node.action] || node.title, meta: `${node.group} · ${status}`, prompt: selectedWorkflowOutput(node.id, node.action) };
  }

  function selectedWorkflowOutput(id, action) {
    if (id?.startsWith("shot-")) {
      const idx = Number(id.replace("shot-", "")) - 1;
      const s = rebuildFinalPrompts(shots || [])[idx];
      return s ? (s.finalPrompt || buildFinalPrompt(s, project, style, tech, modules, negativePrompt)) : "";
    }
    if (action === "prompt-pack") return rebuildFinalPrompts(shots || []).map((s, i) => `Shot ${i + 1}\n${s.finalPrompt || ""}`).join("\n\n");
    if (action === "scene-prompt") return rebuildFinalPrompts(shots || []).map((s, i) => `Shot ${i + 1}\n${s.finalSceneImagePrompt || buildSceneImageModelVariant(s, project, style, tech, negativePrompt)}`).join("\n\n");
    return "";
  }

  function buildDirectorCanvasNodes() {
    const baseNodes = getWorkflowNodes();
    const finalShots = rebuildFinalPrompts(shots || []);
    const shotNodes = finalShots.map((shot, index) => {
      const id = `shot-${index + 1}`;
      const keyId = String(shot.id || index + 1);
      const k = shotKeyframes?.[keyId] || {};
      const hero = (k.images || [])[Number(k.selectedIndex || 0)] || null;
      const pos = getNodePosition(id, 1190 + (index % 2) * 280, 940 + Math.floor(index / 2) * 190);
      return enrichWorkflowNode({ id, type: "shot", group: "shot", title: `Shot ${index + 1} · ${(shot.titleZh || shot.titleEn || "镜头").slice(0, 28)}`, action: "single-shot", shotIndex: index, image: hero ? frameImageSrc(hero) : "", x: pos.x, y: pos.y });
    });
    return [...baseNodes, ...shotNodes];
  }

  function getCanvasSelectedNodeData(nodes = []) {
    return nodes.find(n => n.id === canvasSelectedNode) || nodes[0] || null;
  }

  function addWorkflowLog(message) {
    const item = { id: Date.now() + Math.random(), time: new Date().toLocaleTimeString(), message };
    setWorkflowRunLog(prev => [item, ...prev].slice(0, 80));
  }

  function handleCanvasDragStart(event, id) {
    try { event.dataTransfer.setData("text/plain", id); event.dataTransfer.effectAllowed = "move"; } catch (e) {}
    setCanvasSelectedNode(id);
  }

  function handleCanvasDrop(event) {
    event.preventDefault();
    let id = "";
    try { id = event.dataTransfer.getData("text/plain"); } catch (e) {}
    if (!id) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(20, Math.round((event.clientX - rect.left + event.currentTarget.scrollLeft) / Math.max(canvasZoom || 1, 0.1) - 140));
    const y = Math.max(20, Math.round((event.clientY - rect.top + event.currentTarget.scrollTop) / Math.max(canvasZoom || 1, 0.1) - 55));
    setCanvasNodePositions(prev => ({ ...prev, [id]: { x, y } }));
    setCanvasSelectedNode(id);
    addWorkflowLog(`Moved node / 移动节点：${id}`);
  }

  function resetDirectorCanvasLayout() {
    setCanvasNodePositions({});
    setWorkflowNodes(buildDefaultWorkflowNodes());
    setWorkflowEdges(buildDefaultWorkflowEdges());
    setCanvasSelectedNode("idea-input");
    addWorkflowLog("Workflow canvas reset / 工作流画布已重排");
    setStatus("Node workflow layout reset / 节点工作流画布已重置");
  }

  function runCanvasRitual(mode = canvasRitualMode) {
    const map = {
      premiere: ["NODE CANVAS PREMIERE / 节点画布首映", "Workflow Online / 工作流上线", "文本、分镜、提示词、图片、交付节点已进入同一张可运行导演画布。"],
      clap: ["DIRECTOR CLAP / 导演打板", "Run Downstream / 下游流程启动", "从当前节点开始执行下游节点，保持客户输入最高优先级。"],
      prompt: ["PROMPT ONLY CEREMONY / 提示词封装仪式", "Prompt Pack Before Image / 先交付提示词", "本轮不会调用图片 API，只生成脚本、分镜、视频提示词与场景图提示词。"],
      visual: ["FULL VISUAL CEREMONY / 全流程视觉仪式", "Seedream Keyframes Armed / 即梦关键帧已武装", "确认后才会调用图片生成接口，生成关键帧、视觉锁定和 I2V 包。"],
      lock: ["VISUAL LOCK CEREMONY / 视觉锁定仪式", "Assets Sealed / 资产封存", "角色、场景、风格、道具与首帧将被写入视觉连续性。"],
      rebuild: ["CONTINUITY REBUILD / 连续性重建仪式", "Canvas Order Applied / 画布顺序已应用", "按照节点顺序重建镜头承接、剪辑动机与提示词上下文。"],
      seal: ["CHIEF ENGINEER SEAL / 总工程师封存", "Project Version Locked / 项目版本已封存", `${ENGINEER_NAME} · ${AUTH_SEAL_ID}`],
    };
    const [title, subtitle, body] = map[mode] || map.premiere;
    showRitual(title, subtitle, body, 100);
  }

  function startConnectFromNode(id) {
    if (!workflowConnectSource) {
      setWorkflowConnectSource(id);
      setCanvasSelectedNode(id);
      addWorkflowLog(`Connect source selected / 已选择连线起点：${id}`);
      return;
    }
    if (workflowConnectSource === id) { setWorkflowConnectSource(""); return; }
    const edge = { id: `edge-custom-${Date.now()}`, source: workflowConnectSource, target: id, kind: "custom" };
    setWorkflowEdges(prev => [...(prev.length ? prev : buildDefaultWorkflowEdges()), edge]);
    addWorkflowLog(`Connected / 已连接：${workflowConnectSource} → ${id}`);
    setWorkflowConnectSource("");
  }

  function addWorkflowNodeFromLibrary(action) {
    const catalog = {
      viral: { type: "story", group: "story", title: "Viral A/B Lab / 爆款实验室", action: "outline-polish" },
      negative: { type: "prompt", group: "prompt", title: "Negative Prompt Studio / 负面提示词", action: "prompt-compile" },
      title: { type: "output", group: "output", title: "Title Lab / 标题封面", action: "publish" },
      client: { type: "output", group: "output", title: "Client Preview / 客户预览", action: "client" },
      risk: { type: "video", group: "video", title: "Risk Inspector / 翻车风险", action: "risk" },
    };
    const spec = catalog[action] || catalog.risk;
    const id = `${action}-${Date.now()}`;
    const base = workflowNodes.length ? workflowNodes : buildDefaultWorkflowNodes();
    setWorkflowNodes([...base, { ...spec, id, x: 120 + (base.length % 4) * 260, y: 1450 + Math.floor(base.length / 4) * 160 }]);
    setCanvasSelectedNode(id);
    addWorkflowLog(`Added node / 新增节点：${spec.title}`);
  }

  async function runWorkflowNode(idOrNode, options = {}) {
    const node = typeof idOrNode === "string" ? getWorkflowNodes().find(n => n.id === idOrNode) : idOrNode;
    if (!node) return;
    setCanvasSelectedNode(node.id);
    setWorkflowActiveNode(node.id);
    addWorkflowLog(`▶ Running / 运行节点：${node.title}`);
    try {
      switch (node.action) {
        case "engine": if (!apiIsReady) throw new Error("API not connected. 请先在 API Center 点火 AI 引擎。"); runCanvasRitual("premiere"); break;
        case "input": if (!String(ideaInput || script || outlineDraft || scriptImportText).trim()) throw new Error("缺少输入：请填写一句话创作需求、剧本或导入文档。"); break;
        case "reference": if (referenceUrl.trim() || extractFirstUrl(ideaInput)) await handleIngestReference(); break;
        case "word": if (scriptImportText.trim()) await handleAnalyzeImportedScript(); break;
        case "story": if (!String(script || outlineDraft || ideaInput || scriptImportText).trim()) throw new Error("缺少故事源文本。"); break;
        case "outline": await handleGenerateScriptOutline(); break;
        case "outline-polish": await handleRewriteOutline(); break;
        case "shot-plan": await handleGenerateShotPlan(); break;
        case "shots": if (shotPlanRows.length) await handleGenerateFromShotPlan(); else await handleGenerate(); break;
        case "continuity": await handleRunShotSimilarityCheck(); await handleRunFilmRiskEstimate(); break;
        case "prompt-compile": if (!shots.length) throw new Error("需要先生成分镜。"); setShots(prev => rebuildFinalPrompts(prev || [])); break;
        case "prompt-debug": await handleRunQualityCheck(); break;
        case "prompt-pack": if (!shots.length) throw new Error("需要先生成分镜。"); downloadPromptPack(rebuildFinalPrompts(shots), project); break;
        case "scene-prompt": if (!shots.length) throw new Error("需要先生成分镜。"); await handleEnhanceSceneImagePrompts(); break;
        case "seedream": if (!shots.length) throw new Error("需要先生成分镜。"); if (!options.skipConfirm && !confirmVisualGeneration("Seedream Keyframe Node / 即梦关键帧节点", shots)) throw new Error("用户取消图片生成。"); await handleGenerateAllShotKeyframes(shots, { skipConfirm: true }); break;
        case "visual-lock": lockVisualFromKeyframe("firstFrame"); lockVisualFromKeyframe("style"); break;
        case "router": handleBuildVideoModelRouter(); break;
        case "i2v-pack": handleExportImageToVideoPack(); break;
        case "seal": lockProductionVersion(); runCanvasRitual("seal"); break;
        case "delivery": exportFullProductionKit(); break;
        case "single-shot": setActiveShot(Number(node.shotIndex || 0)); await handleRegenerateCurrentShot(); break;
        case "publish": buildRhythmTimeline(); break;
        case "client": setProjectStudioTab("client"); break;
        case "risk": await handleRunFilmRiskEstimate(); break;
        default: addWorkflowLog(`No operation / 无操作节点：${node.title}`);
      }
      addWorkflowLog(`✓ Complete / 完成节点：${node.title}`);
    } catch (err) {
      addWorkflowLog(`✕ Failed / 节点失败：${node.title} · ${err?.message || err}`);
      showApiError(err, `Workflow node failed / 工作流节点运行失败：${node.title}`);
    } finally { setWorkflowActiveNode(""); }
  }

  function getDownstreamNodeIds(startId) {
    const edges = getWorkflowEdges();
    const seen = new Set();
    const queue = [startId];
    while (queue.length) {
      const cur = queue.shift();
      edges.filter(e => e.source === cur).forEach(e => {
        if (!seen.has(e.target)) { seen.add(e.target); queue.push(e.target); }
      });
    }
    return [...seen];
  }

  async function runDownstreamFromNode(id, options = {}) {
    runCanvasRitual("clap");
    const ids = [id, ...getDownstreamNodeIds(id)];
    for (const nodeId of ids) {
      const n = getWorkflowNodes().find(x => x.id === nodeId);
      if (!n) continue;
      if (options.stopBeforeImage && ["scene-prompt", "seedream", "visual-lock", "router", "i2v-pack"].includes(n.action)) break;
      await runWorkflowNode(n, options);
    }
  }

  async function runPromptOnlyWorkflow() {
    setWorkflowRunMode("prompt-only");
    setProductionFlowMode("prompt-only");
    runCanvasRitual("prompt");
    const ids = ["engine-ignition", "idea-input", "reference-ingest", "word-script", "story-core", "outline-writer", "outline-polish", "shot-planner", "shot-generator", "continuity-check", "prompt-compiler", "prompt-debugger", "prompt-pack"];
    for (const id of ids) await runWorkflowNode(id, { stopBeforeImage: true });
    setProjectStudioTab("prompt");
    setStatus("Prompt-only workflow complete / 只生成提示词工作流完成，未调用图片接口");
  }

  async function runFullVisualWorkflow() {
    setWorkflowRunMode("full-visual");
    setProductionFlowMode("full-visual");
    if (!confirmVisualGeneration("Full Visual Workflow / 完整视觉节点工作流", shots.length ? shots : null)) return setStatus("Full visual workflow cancelled / 已取消完整视觉节点工作流");
    runCanvasRitual("visual");
    const ids = ["engine-ignition", "idea-input", "reference-ingest", "word-script", "story-core", "outline-writer", "outline-polish", "shot-planner", "shot-generator", "continuity-check", "prompt-compiler", "prompt-debugger", "scene-prompt", "seedream-keyframe", "visual-lock", "model-router", "i2v-pack", "chief-seal", "delivery-pack"];
    for (const id of ids) await runWorkflowNode(id, { skipConfirm: true });
    setProjectStudioTab("canvas");
    setStatus("Full visual node workflow complete / 完整视觉节点工作流完成");
  }

  function rebuildContinuityFromCanvas() {
    const nodes = buildDirectorCanvasNodes();
    const shotNodes = nodes.filter(n => n.id?.startsWith("shot-")).sort((a, b) => (a.y - b.y) || (a.x - b.x));
    if (!shotNodes.length) return setStatus("No shot nodes to rebuild / 画布中没有可重建的镜头节点");
    const orderedShots = shotNodes.map(n => shots[n.shotIndex]).filter(Boolean);
    if (!orderedShots.length) return;
    const rebuilt = orderedShots.map((s, i, arr) => ({
      ...s,
      id: i + 1,
      previousContinuityZh: i === 0 ? "开场镜头，建立故事空间与观众注意力。" : `承接 Shot ${i} 的结束状态、角色位置与情绪方向。`,
      nextHookZh: i === arr.length - 1 ? "收束主题，形成记忆点或行动引导。" : `为 Shot ${i + 2} 保留动作、视线或情绪钩子。`,
      continuityAnchorZh: `节点画布顺序重建：Shot ${i + 1} / ${arr.length}。保持角色、场景、道具、光源和运动方向连续。`,
    }));
    setShots(rebuilt);
    setCanvasSelectedNode("shot-1");
    runCanvasRitual("rebuild");
    addWorkflowLog(`Continuity rebuilt / 连续性已重建：${rebuilt.length} shots`);
  }

  function exportDirectorCanvasJson() {
    const payload = { format: "polaris-node-workflow-canvas", version: "V8.1", exportedAt: new Date().toISOString(), engineer: ENGINEER_NAME, project, workspaceMode, productionFlowMode, workflowRunMode, canvasZoom, canvasNodePositions, nodes: getWorkflowNodes(), edges: getWorkflowEdges(), runLog: workflowRunLog };
    downloadTextFile(`${safeName(project)}_node_workflow_canvas_v8_1.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
    setStatus("Node workflow canvas JSON exported / 节点式工作流画布 JSON 已导出");
  }


  async function handleGenerate(scriptOverride = null) {
    let referenceContextForRequest = referencePromptContext;
    // 客户输入最高优先级：即使存在旧剧本/缓存/模板，也必须围绕本轮客户输入生成。
    if ((referenceUrl.trim() || extractFirstUrl(ideaInput)) && referenceIngest.status === "idle") {
      setStatus("Auto analyzing reference before final generation / 正式生成前自动识别参考链接");
      const nextRef = await handleIngestReference();
      if (nextRef) referenceContextForRequest = summarizeReferenceForPrompt({ url: activeReferenceUrl, useMode: referenceUseMode, manualContent: referenceManualContent, ...nextRef });
    }
    const effectiveScript = resolveAuthoritativeScript({ scriptOverride, script, ideaInput, outlineDraft, importedScriptContext, referenceContext: referenceContextForRequest });
    if (!cleanUserText(effectiveScript)) return setStatus("Script Required / 请输入剧本大纲或一句话创作需求");
    const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
    if (apiModel !== selectedModel) setSelectedModel(apiModel);
    setIsGenerating(true);
    setProgressSidebarVisible(true);
    setGenerateProgress(6);
    setStatus(`AI Directing V7 with ${apiModel} / 正在使用 ${apiModel} 执行电影工业流程：读取剧本 → 导演母版 → 镜头覆盖 → 连续性 → 终审封版`);

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

    const systemPrompt = `You are Polaris Cinema OS V7, a bilingual Hollywood-grade AI video director, mini-drama showrunner, story editor, storyboard artist, cinematographer, continuity director, shot planner and prompt master.
Return ONLY one valid JSON object. Every creative field must be bilingual Chinese and English. Dialogue must also be bilingual. Before writing shots, silently verify that the SCRIPT_FINGERPRINT and CURRENT SCRIPT OUTLINE control all content.

CRITICAL PRIORITY / 最高优先级:
0. CLIENT INPUT AUTHORITY: The user's current one-line creative request / imported script / confirmed outline is the ONLY creative source of truth. Generate exactly what the client requested. Do not substitute examples, templates, old cache, previous projects, default storylines, old characters or unrelated module content.
1. The CURRENT Script Outline supplied by the user is the ONLY story source of truth. If any module default, old preset, UI memory, previous generation, project template or localStorage content conflicts with the current client input, ignore it and follow the client input. Never reuse any old/default story unless the current client input explicitly says so.
2. Shots must be generated as a connected directed scene, not isolated pretty images.
3. Every shot must inherit the previous shot's story state, action end, screen direction, prop state and emotional state.
4. Each shot must include previous shot link, action start, action end, next shot hook and cut motivation.
5. Keep spatial geography, 180-degree axis, eyeline and screen direction consistent unless the script explicitly motivates a break.
6. Add live-action realism: micro-expression, breath rhythm, slight focus drift, imperfect camera breathing, physical inertia, dust, texture and natural exposure variation.
7. Avoid repetitive shot size, lens, movement and lighting unless intentionally motivated.
8. Think like a director shooting coverage: establishing, master shot, medium coverage, close-up, insert, reaction, cutaway and emotional release.
9. For every shot, also generate a scene image prompt that captures the single best frozen cinematic keyframe for storyboard, concept art or image-to-video use.
10. Every shot must include Director Intent, Execution Notes, AI Generation Risk and model-adapted prompt variants for Kling, Runway, Dreamina/Jimeng and Sora/Veo.
11. Prompts must be delivery-ready: clear subject, space, action start/end, camera movement, light, performance, continuity anchors, negative prompts and risk notes.
10. If reference-link context exists, use it as style/structure/verified-content guidance according to the selected Reference Use Mode.
11. If Douyin Viral Logic is enabled, strengthen the first 3 seconds, retention rhythm, subtitle punchlines, cover title logic, comment trigger, and one-minute short-video structure.
12. For real-person or school introductions, never fabricate unprovided facts; mark uncertain information and write around verified details.
13. Respect the smart shot count plan: fixed counts must be exact; auto or range modes must produce a justified amount of shots without missing critical coverage.
14. If Smart Range or Minimum Coverage mode is used, you may add missing shots only when necessary for continuity, coverage or emotional clarity.
15. Before writing shots, use Story Core Engine: protagonist desire, obstacle, conflict, reversal, emotional turn, memorable ending.
16. Treat AI video prompts as execution instructions, not prose. Every shot must have ten-layer prompt control: core visual, director intent, subject control, action logic, camera language, lighting/texture, performance, continuity anchor, model adapter, negative prompt.
17. Every prompt must include Frame Control: opening frame, keyframe moment, ending frame and motion bridge.
18. Every prompt must include adaptive negative prompts based on shot type, especially text/signage, faces, hands, product logos, cultural stereotypes and scene drift.

INTEGRATE ALL 51 INTERNAL CAPABILITIES:
12 existing film industry modules: Character Continuity, Location Continuity, Continuity Check, Narrative Rhythm, Blocking, Composition, Editing Language, Sound Design, Platform Prompt Adaptation, Omni Multi-Parameter Control, Production Mode, Multi-Version Notes.
10 Director Continuity Pro modules: Director Bible, Story State Engine, Shot Dependency, Spatial Geography Map, Axis & Eyeline Control, Performance Direction, Realism Layer, Lens Grammar Curve, Coverage Plan, Continuity Inspector.
1 Scene Image Prompt module: each shot must include a keyframe moment and a dedicated scene image prompt for still-image generation.
1 Scene Image Studio module: output should be suitable for batch export and image model variants such as Midjourney, Flux/SDXL, DALL·E, Dreamina and Kling image-to-video first frames.
5 Smart Shot Count modules: Smart Shot Count System, Shot Planner, Coverage Checklist, Shot Density Control, Duration-Driven Planning.
5 Pro Skills modules: Preflight Shot Planner, Auto Coverage Repair, Context Shot Regenerator, One-Click Shot Optimizer, Prompt Version Compare.
5 UX Quality modules: One-Click Production, Real Person Fact Sheet, Quality Inspector Report, Proxy Route Pack, UX Mode Control.
4 Reference + Viral modules: Reference Link Ingest, Reference Understanding, Douyin Viral Engine, 1-Minute Short Video Structure.
8 Story + Prompt Master capabilities: Story Core Engine, Mini Drama Engine, Outline Quality Check, Prompt Master Engine, Prompt Compiler, Model Adapter Center, Negative Prompt Studio, Prompt Debugger.

SHOT COUNT PLANNING RULE:
${shotPlanRule}

LOCK RULES:
${lockRules}

DIRECTOR STYLE:
${style.name}
${style.desc}
${style.tags}

OUTPUT JSON SCHEMA:
{"shots":[{"id":1,"titleZh":"中文镜头标题","titleEn":"English shot title","emotionalBeatZh":"中文情绪节点","emotionalBeatEn":"English emotional beat","narrativeFunctionZh":"中文叙事功能","narrativeFunctionEn":"English narrative function","sceneZh":"中文电影化画面内容，必须严格来自当前剧本","sceneEn":"English cinematic visual content, strictly based on current script","dialogueZh":"中文台词或有意义的沉默","dialogueEn":"English dialogue or meaningful silence","avLogicZh":"中文视听语言逻辑","avLogicEn":"English AV logic","blockingZh":"中文人物调度","blockingEn":"English actor blocking","compositionZh":"中文构图逻辑","compositionEn":"English composition logic","soundDesignZh":"中文声音设计","soundDesignEn":"English sound design","transitionZh":"中文剪辑/转场","transitionEn":"English editing/transition","continuityCheckZh":"中文连续性风险与修正","continuityCheckEn":"English continuity risk and fix","omniParamPromptZh":"中文全能多参","omniParamPromptEn":"English omni multi-parameter controls","platformPromptZh":"中文平台适配提示词","platformPromptEn":"English platform-adapted prompt","versionNotesZh":"中文多版本改写方向","versionNotesEn":"English multi-version notes","storyStateZh":"中文故事状态引擎：角色位置、情绪、动作、道具、光线状态","storyStateEn":"English story state engine: position, emotion, action, props, lighting state","previousShotLinkZh":"中文上一镜头承接","previousShotLinkEn":"English previous shot link","actionStartZh":"中文本镜头开始动作","actionStartEn":"English action start","actionEndZh":"中文本镜头结束动作","actionEndEn":"English action end","nextShotHookZh":"中文下一镜头钩子","nextShotHookEn":"English next shot hook","cutMotivationZh":"中文剪辑动机","cutMotivationEn":"English cut motivation","spatialGeographyZh":"中文场景空间地图与摄影机位置","spatialGeographyEn":"English spatial geography map and camera position","axisEyelineZh":"中文轴线、视线、画面方向控制","axisEyelineEn":"English axis, eyeline and screen direction control","performanceDirectionZh":"中文表演指导：面部、身体、呼吸、台词说法","performanceDirectionEn":"English performance direction: face, body, breath, line delivery","realismLayerZh":"中文实拍细腻层：对焦、曝光、灰尘、皮肤、衣服、物理惯性","realismLayerEn":"English live-action realism layer: focus, exposure, dust, skin, fabric, physical inertia","lensGrammarZh":"中文焦段语法曲线与情绪距离","lensGrammarEn":"English lens grammar curve and emotional distance","coveragePlanZh":"中文导演覆盖拍法职责","coveragePlanEn":"English coverage plan role","continuityInspectorZh":"中文连续性审片员检查与修正","continuityInspectorEn":"English continuity inspector review and fix","coverageRoleZh":"中文镜头覆盖职责，如建立镜头/主镜头/特写/插入/反应/转折/收尾","coverageRoleEn":"English coverage role, such as establishing/master/close-up/insert/reaction/turning/resolution","shotPlanReasonZh":"中文为什么这个镜头数量和职责必要","shotPlanReasonEn":"English reason why this shot role/count is needed","missingCoverageFixZh":"中文若为补充镜头，说明补了什么缺口，否则写无","missingCoverageFixEn":"English missing coverage fix note or none","keyframeMomentZh":"中文关键帧瞬间","keyframeMomentEn":"English keyframe moment","sceneImagePromptZh":"中文场景图提示词","sceneImagePromptEn":"English scene image prompt","sceneImageNegativeZh":"中文场景图负面提示词","sceneImageNegativeEn":"English scene image negative prompt","sceneImageContinuityNotesZh":"中文场景图连续性锚点与说明","sceneImageContinuityNotesEn":"English scene image continuity anchors and notes","directorIntentZh":"中文导演意图","directorIntentEn":"English director intent","executionNotesZh":"中文执行说明","executionNotesEn":"English execution notes","aiRiskZh":"中文AI生成风险","aiRiskEn":"English AI generation risk","coreVisualPromptZh":"中文核心画面提示词","coreVisualPromptEn":"English core visual prompt","subjectControlZh":"中文主体控制","subjectControlEn":"English subject control","actionLogicZh":"中文动作逻辑","actionLogicEn":"English action logic","cameraLanguagePromptZh":"中文摄影机语言提示词","cameraLanguagePromptEn":"English camera language prompt","lightingTexturePromptZh":"中文光影质感提示词","lightingTexturePromptEn":"English lighting and texture prompt","continuityAnchorPromptZh":"中文连续性锚点提示词","continuityAnchorPromptEn":"English continuity anchor prompt","openingFrameZh":"中文开始画面","openingFrameEn":"English opening frame","endingFrameZh":"中文结束画面","endingFrameEn":"English ending frame","motionBridgeZh":"中文动作桥接","motionBridgeEn":"English motion bridge","negativePromptStudioZh":"中文自适应负面提示词","negativePromptStudioEn":"English adaptive negative prompt","promptCompilerNotesZh":"中文提示词编译说明","promptCompilerNotesEn":"English prompt compiler notes","promptDebuggerNotesZh":"中文提示词诊断建议","promptDebuggerNotesEn":"English prompt debugger notes","klingPromptZh":"中文可灵适配提示词","klingPromptEn":"English Kling adapted prompt","runwayPromptZh":"中文Runway适配提示词","runwayPromptEn":"English Runway adapted prompt","jimengPromptZh":"中文即梦适配提示词","jimengPromptEn":"English Jimeng adapted prompt","soraVeoPromptZh":"中文Sora/Veo适配提示词","soraVeoPromptEn":"English Sora/Veo adapted prompt","storyHookZh":"中文故事钩子","storyHookEn":"English story hook","conflictTurnZh":"中文冲突反转","conflictTurnEn":"English conflict turn","contentValueZh":"中文内容价值","contentValueEn":"English content value","shotSize":"bilingual shot size","camera":"bilingual camera","lens":"bilingual lens","move":"bilingual movement","stabilizer":"bilingual support","light":"bilingual lighting","colorScience":"bilingual color look","compositionType":"bilingual composition type","editType":"bilingual edit type","soundMode":"bilingual sound mode","duration":"4-6s / 4-6 秒","promptZh":"中文完整视频提示词","promptEn":"English complete video prompt"}]}`;
    const userPrompt = [`Project / 项目: ${project}`, `CLIENT_INPUT_VERBATIM / 客户本轮原始输入:\n${ideaInput || "(empty / 未填写一句话需求)"}`, `CLIENT_INPUT_FINGERPRINT / 客户输入指纹: ${scriptFingerprint(ideaInput || effectiveScript)}`, `SCRIPT_FINGERPRINT / 剧本指纹: ${scriptFingerprint(effectiveScript)}`, `CURRENT SCRIPT OUTLINE - HIGHEST PRIORITY / 当前剧本大纲，最高优先级:\n${effectiveScript}`, `IMPORTED SCRIPT DOCUMENT CONTEXT / 导入剧本文档上下文:
${importedScriptContext || "No imported script document."}`, `Reference Context / 参考链接理解:
${referenceContextForRequest}`, `Real Person Fact Sheet / 人物介绍事实表:
${personFactsText(personFacts)}`, `Douyin Viral Brief / 抖音爆款策略:
${douyinViralBrief}`, `Reference Use Mode / 参考用途: ${referenceUseMode}`, `Scene Image Prompt Enabled / 开启场景图提示词: ${tech.generateSceneImagePrompt ? "Yes" : "No"}`, `Scene Image Mode / 场景图模式: ${tech.sceneImageMode}`, `Scene Image Use / 场景图用途: ${tech.sceneImageUse}`, `Scene Image Ratio / 场景图画幅: ${tech.sceneImageAspectRatio}`, `Platform / 平台: ${tech.platform}`, `Aspect Ratio / 画幅: ${tech.ratio}`, `Shot Count Mode / 分镜数量模式: ${tech.shotCountMode}`, `Fixed Shot Count / 固定镜头数: ${tech.shotCount}`, `Shot Range / 镜头范围: ${tech.shotRange}`, `Estimated Video Duration / 预计视频时长: ${tech.videoDuration}`, `Shot Density / 镜头密度: ${tech.shotDensity}`, `Minimum Coverage / 最低覆盖清单: ${(tech.minimumCoverage || []).join(" | ")}`, `Allow AI Add Missing Shots / 允许 AI 自动补镜头: ${tech.allowAddMissingShots ? "Yes" : "No"}`, `Shot Count Diagnosis / 分镜数量诊断: ${shotCountDirective(tech, effectiveScript)}`, `Preflight Shot Plan / 正式生成前分镜规划表:\n${shotPlanRowsText(shotPlanRows)}`, `Preflight Diagnosis / 分镜规划诊断: ${shotPlanDiagnosis.zh || ""} / ${shotPlanDiagnosis.en || ""}`, `Genre / 类型: ${creativeBrief.genre}`, `Pacing / 节奏: ${creativeBrief.pacing}`, `Dialogue Style / 台词风格: ${creativeBrief.dialogueStyle}`, `Mood / 情绪: ${creativeBrief.mood}`, `Color Science / 色彩科学: ${tech.colorScience}`, `Content Engine Mode / 内容增强模式: ${tech.contentEngineMode}`, `Prompt Strength / 提示词强度: ${tech.promptStrength}`, `Prompt Length / 提示词长度: ${tech.promptLength}`, `Prompt Rewrite Mode / 提示词改写方向: ${tech.promptRewriteMode}`, `Negative Prompt / 负面提示词: ${negativePrompt}`, `51 Capabilities as RULES ONLY / 51能力仅作为规则，不是故事内容:
${moduleText(modules, effectiveScript)}`, `FINAL REMINDER / 最终提醒: All shots, dialogue, locations, props, scene image prompts and keyframes must visibly come from CLIENT_INPUT_VERBATIM and CURRENT SCRIPT OUTLINE only. If the client input says Hong Kong culture, never output any other default script. Do not reuse old default story content, templates, examples, cache, old projects or unrelated preset content.`].join(NL);

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
      const autoPromptReport = buildPromptQualityReport(withPrompts, tech, douyinViral);
      setQualityReport(prev => prev || autoPromptReport);
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
    { id: "director", title: "导演模式", en: "Director Console", desc: "保留全部 43 模块与 8 个内容/提示词增强能力、镜头编辑、单镜优化、补镜头、历史版本与检查器。", cta: "进入导演控制台" },
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
  const PolarisShell = ({ children, compact = false }) => <div className="polaris-v85-shell min-h-screen bg-[#f6f7fb] text-slate-900 font-sans">
    <style>{`.polaris-v85-shell{background:radial-gradient(circle at 20% 0%,rgba(125,92,255,.10),transparent 32%),radial-gradient(circle at 90% 10%,rgba(0,211,255,.12),transparent 34%),#f6f7fb;color:#0f172a}.polaris-v85-shell header{background:rgba(255,255,255,.86)!important;border-color:rgba(15,23,42,.08)!important;box-shadow:0 10px 40px rgba(15,23,42,.06)}.polaris-v85-shell .text-white{color:#0f172a!important}.polaris-v85-shell .text-stone-300,.polaris-v85-shell .text-stone-400,.polaris-v85-shell .text-stone-500{color:#475569!important}.polaris-v85-shell [class*="bg-black"]{background:rgba(255,255,255,.82)!important}.polaris-v85-shell [class*="border-white"]{border-color:rgba(15,23,42,.09)!important}.polaris-v85-shell button,.polaris-v85-shell input,.polaris-v85-shell textarea,.polaris-v85-shell select{font-size:14px}.polaris-v85-shell .text-\[10px\]{font-size:12px!important}.polaris-v85-shell .text-\[11px\]{font-size:13px!important}.polaris-v85-shell .text-\[12px\]{font-size:14px!important}.polaris-v85-soft-scroll{scrollbar-width:thin;scrollbar-color:rgba(99,102,241,.55) rgba(226,232,240,.75)}.polaris-v85-soft-scroll::-webkit-scrollbar{width:10px;height:10px}.polaris-v85-soft-scroll::-webkit-scrollbar-track{background:rgba(226,232,240,.75);border-radius:999px}.polaris-v85-soft-scroll::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#8b5cf6,#06b6d4);border-radius:999px;border:2px solid rgba(255,255,255,.9)}`}</style>
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
    {projectStudioOpen && typeof document !== "undefined" && createPortal(<div style={projectStudioTab === "canvas" ? { position: "fixed", inset: 0, zIndex: 999999, width: "100vw", height: "100dvh", maxWidth: "100vw", maxHeight: "100dvh", margin: 0, padding: 0, overflow: "hidden", borderRadius: 0, background: "#030303" } : undefined} className={projectStudioTab === "canvas" ? "fixed inset-0 z-[999999] m-0 h-[100dvh] w-[100vw] max-w-none overflow-hidden rounded-none bg-[#030303] p-0 text-stone-300" : "fixed inset-0 z-[125] overflow-y-auto bg-black/75 px-5 py-8 backdrop-blur-xl"}>
      <div style={projectStudioTab === "canvas" ? { width: "100vw", height: "100dvh", maxWidth: "100vw", maxHeight: "100dvh", margin: 0, padding: 0, overflow: "hidden", borderRadius: 0, background: "#030303" } : undefined} className={projectStudioTab === "canvas" ? "m-0 h-[100dvh] w-[100vw] max-w-none overflow-hidden rounded-none bg-[#030303] p-0" : "mx-auto max-w-7xl rounded-[2.5rem] border border-cyan-300/20 bg-[#090909] p-6 shadow-[0_0_90px_rgba(34,211,238,0.16)]"}>
        <div className={projectStudioTab === "canvas" ? "hidden" : "flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between"}>
          <div><div className="text-[11px] font-black uppercase tracking-[0.32em] text-cyan-300">V7 Project Studio / 项目中心</div><h2 className="mt-2 text-3xl font-black text-white">项目中心 · 模板库 · 交付工作台</h2><p className="mt-2 text-sm text-stone-500">把零散生成升级成可保存、可复用、可交付的 AIGC 视频项目流程。</p></div>
          <button onClick={() => setProjectStudioOpen(false)} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10">Close / 关闭</button>
        </div>
        <div className={projectStudioTab === "canvas" ? "hidden" : "mt-5 rounded-3xl border border-cyan-300/15 bg-cyan-400/5 p-4"}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">Workflow Navigation / 流程导航</div>
              <p className="mt-1 text-[12px] leading-6 text-stone-400">按照真实工作流使用：先立项 → 写大纲 → 分镜 → 提示词 → 关键帧 → 导出交付。高级功能仍全部保留，但不再打散。</p>
            </div>
            <button onClick={() => setProjectStudioTab("workflow")} className="rounded-2xl border border-cyan-300/25 bg-cyan-300/15 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-cyan-100 hover:bg-cyan-300/25">Back to Workflow / 返回流程总览</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">{[["workflow", "00 Workflow / 流程总览"], ["wizard", "01 Start / 立项"], ["preflight", "02 Input / 需求体检"], ["shots", "03 Storyboard / 分镜"], ["prompt", "04 Prompt / 提示词"], ["visual", "05 Keyframe / 关键帧"], ["canvas", "06 Canvas / 导演画布"], ["rhythm", "07 Rhythm / 节奏"], ["caption", "07 Publish / 发布"], ["delivery", "09 Delivery / 交付"], ["center", "Project Center / 项目中心"], ["templates", "Templates / 模板库"], ["client", "Client View / 客户视图"], ["files", "Project File / 工程文件"]].map(([id, label]) => <button key={id} onClick={() => setProjectStudioTab(id)} className={`rounded-2xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${projectStudioTab === id ? "border-cyan-300 bg-cyan-300 text-black" : "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"}`}>{label}</button>)}</div>
        </div>
        <div style={projectStudioTab === "canvas" ? { width: "100vw", height: "100dvh", margin: 0, padding: 0, overflow: "hidden" } : undefined} className={projectStudioTab === "canvas" ? "m-0 h-[100dvh] w-[100vw] overflow-hidden p-0" : "mt-6"}>
          {projectStudioTab === "workflow" && <div className="space-y-6">
            <div className="rounded-[2rem] border border-amber-300/20 bg-gradient-to-r from-amber-400/10 via-cyan-400/5 to-purple-400/10 p-6">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-200">Workflow Overview / 页面按流程编排</div>
              <h3 className="mt-3 text-3xl font-black text-white">推荐使用顺序：先内容，后提示词，再关键帧，最后交付</h3>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-stone-300">你现在看到的是按真实创作流程重编排后的导航。这样用户不用猜每个模块在哪一步用，直接跟着流程走即可。原有所有高级功能仍保留在各步骤页面中。</p>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <button onClick={openPromptOnlyWorkspace} className={`rounded-[2rem] border p-6 text-left transition ${productionFlowMode === "prompt-only" ? "border-emerald-300 bg-emerald-400/15" : "border-white/10 bg-black/30 hover:bg-white/10"}`}>
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">Option A · Default / 默认流程</div>
                <div className="mt-2 text-2xl font-black text-white">Prompt Only / 只生成提示词</div>
                <p className="mt-3 text-[12px] leading-6 text-stone-300">只生成剧本、大纲、分镜、视频提示词、场景图提示词和 Prompt Pack。不会自动调用火山即梦 / Seedream 图片生成接口，适合只要提示词的用户。</p>
                <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-[11px] text-emerald-100">低成本 / 不生图 / 默认推荐</div>
              </button>
              <button onClick={openFullVisualWorkspace} className={`rounded-[2rem] border p-6 text-left transition ${productionFlowMode === "full-visual" ? "border-cyan-300 bg-cyan-400/15" : "border-white/10 bg-black/30 hover:bg-white/10"}`}>
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">Option B · Optional / 主动选择</div>
                <div className="mt-2 text-2xl font-black text-white">Full Visual / 完整流程含图片</div>
                <p className="mt-3 text-[12px] leading-6 text-stone-300">在提示词完成后，继续生成分镜关键帧、视觉锁定、视频模型路由和图生视频交付包。只有选择这个流程才会自动调用图片 API。</p>
                <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-[11px] text-cyan-100">会调用 Seedream 图片接口 / 已启用成本保护</div>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 md:grid-cols-2">{[
              { id: "wizard", step: "STEP 01", title: "Project Setup / 立项", desc: "确定项目类型、时长、平台、创作方式，先把项目立起来。" },
              { id: "preflight", step: "STEP 02", title: "Creative Input / 需求体检", desc: "检查一句话创意、剧本、参考链接、人物资料，避免默认内容污染。" },
              { id: "shots", step: "STEP 03", title: "Storyboard / 分镜流程", desc: "从大纲到分镜规划，再到正式分镜生成与镜头卡片。" },
              { id: "prompt", step: "STEP 04", title: "Prompt Engine / 提示词引擎", desc: "精修视频提示词、平台适配、诊断提示词质量。" },
              { id: "visual", step: "STEP 05", title: "Keyframe Studio / 关键帧", desc: "先生成分镜关键帧，再做角色/场景/首帧锁定。" },
              { id: "canvas", step: "STEP 06", title: "Director Canvas / 导演画布", desc: "把故事、分镜、提示词、关键帧和风险铺成可视化导演墙。" },
              { id: "rhythm", step: "STEP 07", title: "Editing Rhythm / 节奏", desc: "生成成片节奏表，检查每个 Shot 的叙事位置。" },
              { id: "caption", step: "STEP 08", title: "Publish Studio / 发布", desc: "生成旁白、字幕、标题、标签和发布文案。" },
              { id: "delivery", step: "STEP 09", title: "Delivery / 交付", desc: "导出 Word、Prompt Pack、完整交付包与图生视频包。" },
            ].map(card => <button key={card.id} onClick={() => setProjectStudioTab(card.id)} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/10"><div className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">{card.step}</div><div className="mt-2 text-xl font-black text-white">{card.title}</div><p className="mt-3 text-[12px] leading-6 text-stone-400">{card.desc}</p><div className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">Click to open / 点击进入</div></button>)}
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/35 p-5"><div className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-200">Current Status / 当前进度</div><div className="mt-3 text-sm leading-7 text-stone-300">项目：<b className="text-white">{project}</b><br/>一句话需求：{ideaInput ? "已填写" : "未填写"}<br/>大纲：{outlineDraft || script ? "已准备" : "未生成"}<br/>分镜：{shots.length ? `${shots.length} 个镜头` : "未生成"}<br/>关键帧：{Object.values(shotKeyframes).filter(x => x?.images?.length).length}/{shots.length || 0}</div></div>
              <div className="rounded-3xl border border-white/10 bg-black/35 p-5"><div className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">Best Practice / 最佳使用方式</div><p className="mt-3 text-sm leading-7 text-stone-300">先在 <b className="text-white">立项</b> 填一句话创意，再跑 <b className="text-white">体检</b>，确认无误后去 <b className="text-white">分镜</b>，分镜稳定后再进 <b className="text-white">提示词</b> 和 <b className="text-white">关键帧</b>。不要一开始就直接生成图片。</p></div>
              <div className="rounded-3xl border border-white/10 bg-black/35 p-5"><div className="text-[10px] font-black uppercase tracking-[0.24em] text-purple-200">Advanced Tools / 高级工具</div><div className="mt-3 flex flex-wrap gap-2"><button onClick={() => setProjectStudioTab("center")} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white">项目中心</button><button onClick={() => setProjectStudioTab("templates")} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white">模板库</button><button onClick={() => setProjectStudioTab("client")} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white">客户预览</button><button onClick={() => setProjectStudioTab("files")} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white">工程文件</button></div></div>
            </div>
          </div>}
          {projectStudioTab === "center" && <div className="grid grid-cols-1 gap-5 lg:grid-cols-3"><div className="rounded-3xl border border-white/10 bg-white/5 p-5"><div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">Current Project / 当前项目</div><div className="mt-3 text-xl font-black text-white">{project}</div><div className="mt-2 text-[12px] leading-6 text-stone-400">模式：{workspaceMode || "未选择"}<br/>镜头：{shots.length}<br/>状态：{lastArchiveId ? "已封版" : shots.length ? "已生成" : script ? "草稿" : "待开始"}</div><button onClick={saveCurrentProjectToLibrary} className="mt-5 w-full rounded-2xl bg-cyan-300 px-4 py-3 text-[11px] font-black uppercase text-black">Save Project / 保存项目</button></div><div className="lg:col-span-2 rounded-3xl border border-white/10 bg-black/35 p-5"><div className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-amber-200">Project Library / 项目库</div><div className="grid grid-cols-1 gap-3 md:grid-cols-2">{projectLibrary.length ? projectLibrary.map(item => <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-sm font-black text-white">{item.title}</div><div className="mt-1 text-[10px] text-stone-500">{item.savedAt} · {item.mode} · {item.shotCount} shots</div><div className="mt-2 line-clamp-2 text-[11px] text-stone-400">{item.scriptPreview}</div><div className="mt-3 flex gap-2"><button onClick={() => openProjectFromLibrary(item)} className="rounded-xl bg-amber-400 px-3 py-2 text-[10px] font-black text-black">Open</button><button onClick={() => deleteProjectFromLibrary(item.id)} className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-[10px] font-black text-red-200">Delete</button></div></div>) : <div className="text-sm text-stone-500">暂无保存项目，点击左侧 Save Project 保存当前工作区。</div>}</div></div></div>}
          {projectStudioTab === "wizard" && <div className="space-y-6"><div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-6"><div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">New Project Wizard / 新建项目向导</div><h3 className="mt-3 text-2xl font-black text-white">你要做什么类型？</h3><p className="mt-2 text-sm text-stone-400">选择项目类型，或使用自定义类型，系统会自动配置一句话需求、时长、爆款逻辑和基础参数。</p></div><div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{PROJECT_TYPE_OPTIONS.map(item => <button key={item.id} type="button" onClick={() => setProjectWizard(p => ({ ...p, projectType: item.id }))} className={`rounded-3xl border p-5 text-left transition ${projectWizard.projectType === item.id ? "border-amber-300 bg-amber-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}><div className="text-lg font-black text-white">{item.zh}</div><div className="mt-1 text-[11px] font-black uppercase tracking-widest text-stone-500">{item.en}</div><div className="mt-3 line-clamp-3 text-[12px] leading-6 text-stone-400">{item.id === "custom" ? "输入自己的项目类型，不被固定模板限制。" : item.idea}</div></button>)}</div>{projectWizard.projectType === "custom" && <FormField label="Custom Project Type" zh="自定义项目类型"><Input value={projectWizard.customType} onChange={e => setProjectWizard(p => ({ ...p, customType: e.target.value }))} placeholder="例如：美食探店、非遗人物、毕业季短片、AI课程宣传..." /></FormField>}<div className="grid grid-cols-1 gap-5 md:grid-cols-3"><FormField label="Video Duration" zh="视频时长"><Select items={OPT.videoDurations} value={projectWizard.duration} onChange={v => setProjectWizard(p => ({ ...p, duration: v }))} /></FormField><FormField label="Use Case" zh="使用场景"><Select items={PROJECT_USE_CASES} value={projectWizard.useCase} onChange={v => setProjectWizard(p => ({ ...p, useCase: v }))} /></FormField><FormField label="Creation Method" zh="创作方式"><Select items={["一句话生成 / One-line idea", "参考链接 / Reference link", "Word剧本导入 / Word script import", "从模板开始 / Start from template", "自定义 / Custom"]} value={projectWizard.creationMethod} onChange={v => setProjectWizard(p => ({ ...p, creationMethod: v }))} /></FormField></div><button onClick={applyProjectWizard} className="rounded-2xl bg-amber-400 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-black">Create Project / 创建项目</button></div>}
          {projectStudioTab === "templates" && <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">{PROJECT_TEMPLATES.map(t => <ProjectTemplateCard key={t.id} template={t} onApply={applyProjectTemplate} />)}</div>}
          {projectStudioTab === "preflight" && <div className="grid grid-cols-1 gap-5 lg:grid-cols-2"><div className="rounded-3xl border border-white/10 bg-white/5 p-5"><div className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-200">Preflight Check / 生成前体检</div><p className="mt-3 text-sm leading-7 text-stone-400">检查 API、创作需求、参考资料、人物事实、时长和风格是否完整。</p><div className="mt-5 flex gap-3"><button onClick={runPreflightCheck} className="rounded-2xl bg-amber-400 px-5 py-3 text-[11px] font-black uppercase text-black">Run Check / 开始体检</button><button onClick={autoCompleteMissingInfo} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase text-white">Auto Complete / 自动补全</button></div></div><div className="rounded-3xl border border-white/10 bg-black/35 p-5"><div className="text-5xl font-black text-amber-300">{preflightReport?.score || "--"}</div><div className="mt-2 text-[11px] font-black uppercase tracking-widest text-stone-500">Preflight Score</div><div className="mt-4 text-sm text-stone-300">{preflightReport?.summary || "尚未体检"}</div><div className="mt-4 space-y-2">{(preflightReport?.issues || []).map((x, i) => <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3 text-[11px]"><b className="text-red-300">{x.level}</b> · {x.zh}<div className="mt-1 text-stone-500">{x.fix}</div></div>)}</div></div></div>}
          {projectStudioTab === "shots" && <div className="space-y-5"><div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{shots.length ? rebuildFinalPrompts(shots).map((s, i) => <ShotResultCard key={i} shot={s} index={i} active={activeShot === i} onSelect={() => { setActiveShot(i); setProjectStudioOpen(false); if (workspaceMode !== "director") setWorkspaceMode("director"); }} onCopyVideo={() => safeCopyText(s.finalPrompt || buildFinalPrompt(s, project, style, tech, modules, negativePrompt))} onCopyScene={() => safeCopyText(s.finalSceneImagePrompt || buildSceneImageModelVariant(s, project, style, tech, negativePrompt))} onCopyPlatform={(key) => copyPlatformPromptForShot(s, key)} />) : <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-stone-500">尚未生成分镜。先进入 Preflight 或专业/导演模式生成分镜。</div>}</div></div>}
          {projectStudioTab === "visual" && <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <button onClick={() => setProductionFlowMode("prompt-only")} className={`rounded-3xl border p-5 text-left transition ${productionFlowMode === "prompt-only" ? "border-emerald-300 bg-emerald-400/15" : "border-white/10 bg-black/30 hover:bg-white/10"}`}>
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">Prompt Only / 只生成提示词</div>
                <div className="mt-2 text-xl font-black text-white">不自动生成参考图片</div>
                <p className="mt-2 text-[12px] leading-6 text-stone-300">停留在提示词、场景图提示词和 Prompt Pack。用户仍可手动生成单张关键帧。</p>
              </button>
              <button onClick={() => setProductionFlowMode("full-visual")} className={`rounded-3xl border p-5 text-left transition ${productionFlowMode === "full-visual" ? "border-cyan-300 bg-cyan-400/15" : "border-white/10 bg-black/30 hover:bg-white/10"}`}>
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">Full Visual / 完整流程含图片</div>
                <div className="mt-2 text-xl font-black text-white">主动生成分镜关键帧</div>
                <p className="mt-2 text-[12px] leading-6 text-stone-300">调用火山即梦 / Seedream 图片 API，生成关键帧、视觉锁定和图生视频包。</p>
              </button>
            </div>
            <div className="rounded-3xl border border-purple-300/20 bg-purple-400/10 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-purple-200">Keyframe Workflow / 关键帧流程</div>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">{[
                ["01", "设置图片接口", "先确认 Seedream 模型、尺寸和候选图数量。"],
                ["02", "生成关键帧", "优先从分镜生成关键帧，不要一上来直接批量乱生。"],
                ["03", "锁定视觉资产", "从满意关键帧里锁定角色、场景、风格和首帧。"],
                ["04", "导出 I2V 包", "最后再生成视频模型路由和图生视频交付包。"],
              ].map(([n, t, d]) => <div key={n} className="rounded-2xl border border-white/10 bg-black/30 p-4"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">Step {n}</div><div className="mt-2 text-sm font-black text-white">{t}</div><div className="mt-2 text-[11px] leading-6 text-stone-400">{d}</div></div>)}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
              <div className="space-y-5">
                <div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">Image API Gateway / 图片生成接口中心</div>
                  <p className="mt-3 text-sm leading-7 text-stone-400">先不做昂贵的视频生成，先用分镜提示词生成关键帧，形成 Prompt → Image → Video 的前期工业包。已接入火山引擎 / 即梦 Seedream：后端 route 使用 ARK_API_KEY 或 VOLCENGINE_ARK_API_KEY 调用方舟图片生成接口。</p>
                  <div className="mt-5 space-y-4">
                    <FormField label="Image Provider" zh="图片模型接口"><Select items={OPT.imageApiProviders} value={imageApiSettings.provider} onChange={v => setImageApiSettings(p => ({ ...p, provider: v, model: v.includes("Seedream") || v.includes("即梦") ? "doubao-seedream-5-0-260128" : v.includes("OpenAI") ? "gpt-image-1" : p.model }))} /></FormField>
                    <FormField label="Model" zh="模型名称"><Input value={imageApiSettings.model} onChange={e => setImageApiSettings(p => ({ ...p, model: e.target.value }))} /></FormField>
                    <FormField label="Endpoint" zh="接口地址"><Input value={imageApiSettings.endpoint} onChange={e => setImageApiSettings(p => ({ ...p, endpoint: e.target.value }))} placeholder="/api/image-generate" /></FormField>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Size" zh="尺寸"><Input value={imageApiSettings.size} onChange={e => setImageApiSettings(p => ({ ...p, size: e.target.value }))} /></FormField>
                      <FormField label="Candidates" zh="候选数"><Select items={["1", "2", "4"]} value={imageApiSettings.candidates} onChange={v => setImageApiSettings(p => ({ ...p, candidates: v }))} /></FormField>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <button onClick={handleGenerateAllShotKeyframes} disabled={!shots.length || isGeneratingKeyframes} className="rounded-2xl bg-cyan-300 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black disabled:opacity-50">Generate All Shot Keyframes / 生成全部分镜关键帧</button>
                  <button onClick={() => handleGenerateShotKeyframe(activeShot)} disabled={!shots.length || isGeneratingKeyframes} className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-cyan-200 disabled:opacity-40">Generate Current Keyframe / 生成当前镜头关键帧</button>
                  <button onClick={handleBuildVideoModelRouter} disabled={!shots.length} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white disabled:opacity-40">Build Video Model Router / 生成视频模型路由</button>
                  <button onClick={handleExportImageToVideoPack} disabled={!shots.length} className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-emerald-200 disabled:opacity-40">Export I2V Pack / 导出图生视频包</button>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-200">Visual Lock System / 视觉锁定系统</div>
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    {[ ["character", "Lock Character / 锁定角色"], ["location", "Lock Location / 锁定场景"], ["style", "Lock Style / 锁定风格"], ["props", "Lock Props / 锁定道具"], ["firstFrame", "Lock First Frame / 锁定首帧"] ].map(([key, label]) => <button key={key} onClick={() => lockVisualFromKeyframe(key)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-[11px] font-black uppercase text-stone-200 hover:bg-white/10">{label}<div className="mt-1 line-clamp-1 text-[10px] font-normal text-stone-500">{visualLocks[key]?.description || "未锁定 / Not locked"}</div></button>)}
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">Shot Keyframe Wall / 分镜关键帧墙</div><p className="mt-2 text-sm text-stone-500">每个 Shot 的关键帧可作为图生视频首帧、视觉锁定参考和客户预览图。</p></div>
                    <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-[11px] text-stone-400">已生成 {Object.values(shotKeyframes).filter(x => x?.images?.length).length}/{shots.length}</div>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {shots.length ? rebuildFinalPrompts(shots).map((s, i) => {
                      const id = String(s.id || i + 1);
                      const k = shotKeyframes[id] || {};
                      const hero = (k.images || [])[k.selectedIndex || 0];
                      return <div key={id} className="rounded-3xl border border-white/10 bg-black/35 p-4">
                        <div className="flex items-start justify-between gap-3"><div><div className="text-[10px] font-black text-amber-300">Shot {i + 1}</div><div className="mt-1 line-clamp-2 text-sm font-black text-white">{s.titleZh || s.titleEn}</div></div><button onClick={() => handleGenerateShotKeyframe(i)} className="rounded-xl bg-cyan-300 px-3 py-2 text-[10px] font-black text-black">Gen</button></div>
                        <div className="mt-3 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-[11px] text-stone-500">
                          {hero ? <img src={frameImageSrc(hero)} alt="shot keyframe" className="h-full w-full object-cover" /> : k.status === "generating" ? "Generating... / 生成中" : "No keyframe yet / 未生成"}
                        </div>
                        {k.images?.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto">{k.images.map((img, idx) => <button key={img.id || idx} onClick={() => selectShotKeyframe(id, idx)} className={`h-12 w-16 shrink-0 overflow-hidden rounded-xl border ${Number(k.selectedIndex || 0) === idx ? "border-cyan-300" : "border-white/10"}`}><img src={frameImageSrc(img)} className="h-full w-full object-cover" /></button>)}</div>}
                        <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => { setActiveShot(i); lockVisualFromKeyframe("firstFrame", id); }} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white">Use as First Frame</button><button onClick={() => safeCopyText(k.prompt || buildShotKeyframePrompt(s, project, style, tech, visualLocks))} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white">Copy Prompt</button></div>
                      </div>;
                    }) : <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-stone-500">先生成分镜，再生成关键帧。</div>}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-black/35 p-5"><div className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">Character Assets / 角色资产库</div><div className="mt-3 space-y-2 max-h-64 overflow-y-auto">{characterAssets.length ? characterAssets.map(a => <div key={a.id} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[11px] text-stone-300">{a.image && <img src={a.image} className="mb-2 aspect-video w-full rounded-xl object-cover" />}<b className="text-white">{a.title}</b><br/>{a.description}</div>) : <div className="text-sm text-stone-500">暂无角色资产。用关键帧锁定角色后会出现在这里。</div>}</div></div>
                  <div className="rounded-3xl border border-white/10 bg-black/35 p-5"><div className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">Location Assets / 场景资产库</div><div className="mt-3 space-y-2 max-h-64 overflow-y-auto">{locationAssets.length ? locationAssets.map(a => <div key={a.id} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[11px] text-stone-300">{a.image && <img src={a.image} className="mb-2 aspect-video w-full rounded-xl object-cover" />}<b className="text-white">{a.title}</b><br/>{a.description}</div>) : <div className="text-sm text-stone-500">暂无场景资产。用关键帧锁定场景后会出现在这里。</div>}</div></div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/35 p-5"><div className="text-[10px] font-black uppercase tracking-[0.24em] text-purple-200">Video Model Router / 视频模型路由器</div><div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">{videoModelRouting.length ? videoModelRouting.map(r => <div key={r.shotIndex} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-[11px] text-stone-300"><div className="text-[10px] font-black text-purple-200">Shot {r.shotIndex} · {r.risk}</div><div className="mt-1 text-sm font-black text-white">{r.model}</div><div className="mt-2 leading-5">{r.reasonZh}</div><div className="mt-2 text-stone-500">Hero Frame: {r.hasHeroFrame ? "Ready / 已有" : "Missing / 未生成"}</div></div>) : <div className="text-sm text-stone-500">点击 Build Video Model Router 生成每个镜头的模型推荐。</div>}</div></div>
              </div>
            </div>
          </div>}
          {projectStudioTab === "canvas" && (() => {
            const preparedShots = rebuildFinalPrompts(shots || []);
            const keyframeReadyCount = Object.values(shotKeyframes || {}).filter(x => x?.images?.length).length;
            const selectedShot = preparedShots[activeShot] || preparedShots[0] || null;
            const selectedKey = selectedShot ? String(selectedShot.id || activeShot + 1) : "";
            const selectedFramePack = selectedKey ? (shotKeyframes?.[selectedKey] || {}) : {};
            const selectedHero = (selectedFramePack.images || [])[Number(selectedFramePack.selectedIndex || 0)] || null;
            const visualNodes = [
              { id: "prep", title: "01 提示词准备", en: "Prompt Prep", desc: "需求、参考、剧本、分镜、提示词都在这里作为前置准备。", ready: Boolean(script || outlineDraft || ideaInput), action: () => { setProjectStudioOpen(true); setProjectStudioTab("prompt"); } },
              { id: "image", title: "02 图像生成", en: "AI Image", desc: "调用 Seedream 生成每个镜头关键帧，建立角色/场景/风格资产。", ready: keyframeReadyCount > 0, action: () => handleGenerateAllShotKeyframes(preparedShots, { skipConfirm: false }) },
              { id: "video", title: "03 视频生成", en: "AI Video", desc: "根据关键帧建立图生视频制作包，并为可灵/Runway/Luma/Sora/Veo 路由。", ready: videoModelRouting.length > 0, action: handleBuildVideoModelRouter },
              { id: "delivery", title: "04 交付导出", en: "Delivery", desc: "导出 Word、Prompt Pack、I2V Pack、客户预览和工程文件。", ready: Boolean(lastArchiveId), action: exportFullProductionKit },
            ];
            return <div className="flex h-[100dvh] w-[100vw] flex-col overflow-hidden bg-[#f6f7fb] text-slate-900">
              <style>{`.visual-canvas-scroll{scrollbar-width:thin;scrollbar-color:rgba(99,102,241,.58) rgba(226,232,240,.85)}.visual-canvas-scroll::-webkit-scrollbar{width:10px;height:10px}.visual-canvas-scroll::-webkit-scrollbar-track{background:rgba(226,232,240,.85);border-radius:999px}.visual-canvas-scroll::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#8b5cf6,#06b6d4);border-radius:999px;border:2px solid #fff}.visual-canvas-grid{background-image:radial-gradient(circle at 1px 1px,rgba(99,102,241,.18) 1px,transparent 0);background-size:28px 28px}`}</style>
              <header className="shrink-0 border-b border-slate-200/80 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-2xl">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400 text-lg font-black text-white shadow-lg shadow-violet-200">P</div>
                    <div>
                      <div className="text-[12px] font-black uppercase tracking-[0.28em] text-violet-600">V8.5 Visual Infinite Canvas / 图像视频生产画布</div>
                      <h3 className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950">画布是主战场：在这里生成图像、组织镜头、进入视频制作</h3>
                      <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500">提示词、分镜、连续性是前置准备；画布负责把镜头变成关键帧资产、视频路由和交付包。</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={runPromptOnlyWorkflow} disabled={!!workflowActiveNode} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40">Prompt Prep / 前置准备</button>
                    <button onClick={runFullVisualWorkflow} disabled={!!workflowActiveNode} className="rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 disabled:opacity-40">Full Visual / 图像视频流程</button>
                    <button onClick={() => { if (typeof document !== "undefined") { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); } }} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm">Browser Fullscreen</button>
                    <button onClick={() => setProjectStudioOpen(false)} className="rounded-2xl border border-slate-200 bg-slate-950 px-4 py-3 text-sm font-black text-white">Exit / 退出</button>
                  </div>
                </div>
              </header>
              <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden p-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
                <aside className="visual-canvas-scroll min-h-0 overflow-y-auto rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-[12px] font-black uppercase tracking-[0.26em] text-violet-600">Production Steps / 制作步骤</div>
                  <div className="mt-4 space-y-3">
                    {visualNodes.map((n, idx) => <button key={n.id} onClick={n.action} disabled={n.id !== "prep" && !preparedShots.length} className={`w-full rounded-3xl border p-4 text-left transition ${n.ready ? "border-violet-200 bg-violet-50" : "border-slate-200 bg-slate-50 hover:bg-white"} disabled:opacity-45`}>
                      <div className="flex items-center justify-between gap-3"><div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Step {String(idx + 1).padStart(2, "0")} · {n.en}</div><span className={`h-3 w-3 rounded-full ${n.ready ? "bg-emerald-400" : "bg-slate-300"}`} /></div>
                      <div className="mt-2 text-lg font-black text-slate-950">{n.title}</div>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{n.desc}</p>
                    </button>)}
                  </div>
                  <div className="mt-5 rounded-3xl border border-cyan-200 bg-cyan-50 p-4">
                    <div className="text-[12px] font-black text-cyan-700">Seedream Image API / 即梦生图</div>
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      <FormField label="Provider" zh="图像接口"><Select items={OPT.imageApiProviders} value={imageApiSettings.provider} onChange={v => setImageApiSettings(p => ({ ...p, provider: v }))} /></FormField>
                      <FormField label="Model" zh="模型"><Select items={OPT.imageApiModels} value={imageApiSettings.model} onChange={v => setImageApiSettings(p => ({ ...p, model: v }))} /></FormField>
                      <FormField label="Size" zh="尺寸"><Input value={imageApiSettings.size} onChange={e => setImageApiSettings(p => ({ ...p, size: e.target.value }))} placeholder="2K / 1024x1024" /></FormField>
                    </div>
                  </div>
                </aside>
                <main className="visual-canvas-scroll visual-canvas-grid min-h-0 overflow-y-auto rounded-[2.4rem] border border-slate-200 bg-white/85 p-5 shadow-sm">
                  <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="text-[12px] font-black uppercase tracking-[0.28em] text-fuchsia-600">NeoWOW-like Workspace / 清爽产品化工作台</div>
                        <h2 className="mt-2 text-4xl font-black tracking-[-0.05em] text-slate-950">AI 图像与视频创作画布</h2>
                        <p className="mt-3 max-w-4xl text-base leading-8 text-slate-500">用产品卡片组织功能：漫剧制作、无限画布、AI 图像、AI 视频。复杂参数不消失，只收进左侧准备区、右侧检查器和 Project Studio。</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <MiniStat label="Shots" value={preparedShots.length} tone="cyan" />
                        <MiniStat label="Images" value={`${keyframeReadyCount}/${preparedShots.length || 0}`} tone="purple" />
                        <MiniStat label="Video Routes" value={videoModelRouting.length || 0} tone="emerald" />
                        <MiniStat label="Mode" value={productionFlowMode === "full-visual" ? "Visual" : "Prep"} tone="amber" />
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
                      {[
                        ["漫剧制作", "Story / Comic", "从故事核心到连续分镜"],
                        ["无限画布", "Canvas", "自由组织节点和资产"],
                        ["AI图像创作", "Image", "Seedream 关键帧生成"],
                        ["AI视频生成", "Video", "图生视频路由与交付包"],
                      ].map(([a,b,c]) => <div key={a} className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm"><div className="text-xl font-black text-slate-950">{a}</div><div className="mt-1 text-[12px] font-black uppercase tracking-widest text-violet-500">{b}</div><div className="mt-3 text-sm leading-6 text-slate-500">{c}</div></div>)}
                    </div>
                  </div>
                  <div className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div><div className="text-[12px] font-black uppercase tracking-[0.26em] text-cyan-600">Image Generation Board / 图像生成看板</div><h3 className="mt-2 text-2xl font-black text-slate-950">每个镜头就是一张可生成、可锁定、可进入视频的画布卡片</h3></div>
                      <div className="flex flex-wrap gap-2"><button onClick={handleGenerate} disabled={isGenerating || !apiIsReady} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm disabled:opacity-40">Generate Shots / 生成分镜</button><button onClick={() => handleGenerateAllShotKeyframes(preparedShots, { skipConfirm: false })} disabled={!preparedShots.length || isGeneratingKeyframes} className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-cyan-100 disabled:opacity-40">Generate Images / 生成全部图片</button><button onClick={handleBuildVideoModelRouter} disabled={!preparedShots.length} className="rounded-2xl bg-violet-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-violet-100 disabled:opacity-40">Build Video / 生成视频路线</button></div>
                    </div>
                    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                      {preparedShots.length ? preparedShots.map((s, i) => {
                        const key = String(s.id || i + 1);
                        const pack = shotKeyframes?.[key] || {};
                        const hero = (pack.images || [])[Number(pack.selectedIndex || 0)] || null;
                        const route = videoModelRouting.find(r => Number(r.shotIndex) === i + 1) || null;
                        return <button key={key} onClick={() => setActiveShot(i)} className={`group rounded-[2rem] border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl ${activeShot === i ? "border-violet-300 ring-4 ring-violet-100" : "border-slate-200"}`}>
                          <div className="aspect-video overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                            {hero ? <img src={frameImageSrc(hero)} className="h-full w-full object-cover transition group-hover:scale-[1.03]" /> : <div className="grid h-full place-items-center p-5 text-center text-sm font-black text-slate-400">No Keyframe<br/>点击生成图片</div>}
                          </div>
                          <div className="mt-4 flex items-start justify-between gap-3"><div><div className="text-[12px] font-black uppercase tracking-widest text-violet-500">Shot {i + 1}</div><div className="mt-1 line-clamp-2 text-lg font-black text-slate-950">{s.titleZh || s.titleEn || "Untitled Shot"}</div></div><span className={`rounded-full px-3 py-1 text-[11px] font-black ${hero ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{hero ? "Image Ready" : "Draft"}</span></div>
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{s.sceneZh || s.sceneEn || s.keyframeMomentZh}</p>
                          <div className="mt-4 grid grid-cols-2 gap-2"><span onClick={(e) => { e.stopPropagation(); handleGenerateShotKeyframe(i); }} className="rounded-2xl bg-cyan-500 px-3 py-3 text-center text-sm font-black text-white">生图</span><span onClick={(e) => { e.stopPropagation(); setActiveShot(i); handleBuildVideoModelRouter(); }} className="rounded-2xl bg-violet-600 px-3 py-3 text-center text-sm font-black text-white">视频</span></div>
                          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-500">{route ? `推荐模型：${route.model} · ${route.reasonZh || route.reason || "已生成视频路线"}` : "等待生成视频模型路由"}</div>
                        </button>;
                      }) : <div className="col-span-full rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center"><div className="text-3xl font-black text-slate-950">还没有分镜卡片</div><p className="mt-3 text-base text-slate-500">先在左侧填写创作需求，运行 Prompt Prep 或 Generate Shots；生成后这里会变成图像/视频生产看板。</p><button onClick={handleGenerate} disabled={isGenerating || !apiIsReady} className="mt-6 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white disabled:opacity-40">Generate Storyboard / 生成分镜</button></div>}
                    </div>
                  </div>
                </main>
                <aside className="visual-canvas-scroll min-h-0 overflow-y-auto rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-[12px] font-black uppercase tracking-[0.26em] text-fuchsia-600">Inspector / 生成检查器</div>
                  <h4 className="mt-2 text-2xl font-black text-slate-950">{selectedShot ? `Shot ${activeShot + 1}` : "准备开始"}</h4>
                  {selectedHero && <img src={frameImageSrc(selectedHero)} className="mt-4 aspect-video w-full rounded-3xl object-cover" />}
                  <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600 whitespace-pre-wrap">{selectedShot ? (selectedShot.finalSceneImagePrompt || selectedShot.sceneImagePromptZh || selectedShot.sceneZh || "当前镜头暂无场景图提示词") : "选择镜头后，这里会显示图像提示词、视频动作、连续性和生成风险。"}</div>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <button onClick={() => selectedShot && handleGenerateShotKeyframe(activeShot)} disabled={!selectedShot || isGeneratingKeyframes} className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-black text-white disabled:opacity-40">Generate Current Image / 生成当前图像</button>
                    <button onClick={handleExportImageToVideoPack} disabled={!preparedShots.length} className="rounded-2xl bg-violet-600 px-4 py-3 text-sm font-black text-white disabled:opacity-40">Export I2V Video Pack / 导出图生视频包</button>
                    <button onClick={() => safeCopyText(selectedShot?.finalPrompt || selectedShot?.promptZh || "")} disabled={!selectedShot} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 disabled:opacity-40">Copy Video Prompt / 复制视频提示词</button>
                    <button onClick={() => { setProjectStudioOpen(true); setProjectStudioTab("visual"); }} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">Open Advanced Visual Studio</button>
                  </div>
                  <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-4"><div className="text-[12px] font-black text-emerald-700">Run Log / 运行日志</div><div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">{workflowRunLog.length ? workflowRunLog.slice(0, 8).map(log => <div key={log.id} className="rounded-2xl border border-emerald-100 bg-white p-3 text-xs leading-5 text-slate-500"><span className="font-black text-slate-400">{log.time}</span> · {log.message}</div>) : <div className="text-sm text-slate-400">暂无画布运行日志。</div>}</div></div>
                </aside>
              </div>
            </div>;
          })()}
          {projectStudioTab === "client" && <div className="space-y-5"><div className="grid grid-cols-1 gap-4 md:grid-cols-5"><button onClick={() => setClientViewMode("overview")} className={`rounded-2xl border px-4 py-3 text-[11px] font-black uppercase ${clientViewMode === "overview" ? "border-amber-300 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-white"}`}>Overview</button><button onClick={() => setClientViewMode("shots")} className={`rounded-2xl border px-4 py-3 text-[11px] font-black uppercase ${clientViewMode === "shots" ? "border-amber-300 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-white"}`}>Shots</button><button onClick={() => setClientViewMode("style")} className={`rounded-2xl border px-4 py-3 text-[11px] font-black uppercase ${clientViewMode === "style" ? "border-amber-300 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-white"}`}>Style</button><button onClick={() => setClientViewMode("delivery")} className={`rounded-2xl border px-4 py-3 text-[11px] font-black uppercase ${clientViewMode === "delivery" ? "border-amber-300 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-white"}`}>Delivery</button><button onClick={() => safeCopyText(buildClientPreviewText())} className="rounded-2xl bg-cyan-300 px-4 py-3 text-[11px] font-black uppercase text-black">Copy Client View</button></div><div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7"><div className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">Client Preview / 客户预览</div><h3 className="mt-3 text-3xl font-black text-white">{project}</h3><div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5"><MiniStat label="Health" value={`${getProjectHealthScore().total}/100`} tone="emerald" /><MiniStat label="Shots" value={shots.length} /><MiniStat label="Mode" value={workspaceMode || "-"} tone="amber" /><MiniStat label="Duration" value={tech.videoDuration || "-"} /><MiniStat label="Archive" value={lastArchiveId ? "Locked" : "Draft"} /></div><pre className="mt-6 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-3xl bg-black/40 p-5 text-[12px] leading-7 text-stone-300">{buildClientPreviewText()}</pre></div></div>}
          {projectStudioTab === "files" && <div className="grid grid-cols-1 gap-5 md:grid-cols-2"><div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-6"><div className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">Export Project File / 导出工程文件</div><p className="mt-3 text-sm leading-7 text-stone-300">导出 .polaris.json 工程文件，方便备份、迁移或团队协作。</p><button onClick={exportProjectFile} className="mt-5 rounded-2xl bg-emerald-400 px-5 py-3 text-[11px] font-black uppercase text-black">Export .polaris.json</button></div><div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-6"><div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">Import Project File / 导入工程文件</div><p className="mt-3 text-sm leading-7 text-stone-300">导入他人或历史导出的 .polaris.json，继续编辑完整项目。</p><label className="mt-5 inline-flex cursor-pointer rounded-2xl bg-cyan-300 px-5 py-3 text-[11px] font-black uppercase text-black">Import File<input type="file" accept=".json,.polaris.json,application/json" onChange={importProjectFileFromUpload} className="hidden" /></label></div></div>}
          {projectStudioTab === "prompt" && <div className="grid grid-cols-1 gap-5 lg:grid-cols-2"><div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-6"><div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">Prompt Master Engine / 提示词大师引擎</div><p className="mt-3 text-sm leading-7 text-stone-300">把脚本内容和分镜编译成可执行、可诊断、可适配不同AI视频模型的工业级提示词。</p><div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2"><FormField label="Content Mode" zh="内容增强模式"><Select items={OPT.contentEngineModes} value={tech.contentEngineMode} onChange={v => setTech(p => ({ ...p, contentEngineMode: v }))} /></FormField><FormField label="Prompt Strength" zh="提示词强度"><Select items={OPT.promptStrengthLevels} value={tech.promptStrength} onChange={v => setTech(p => ({ ...p, promptStrength: v }))} /></FormField><FormField label="Prompt Length" zh="提示词长度"><Select items={OPT.promptLengthModes} value={tech.promptLength} onChange={v => setTech(p => ({ ...p, promptLength: v }))} /></FormField><FormField label="Rewrite Mode" zh="提示词改写方向"><Select items={OPT.promptRewriteModes} value={tech.promptRewriteMode} onChange={v => setTech(p => ({ ...p, promptRewriteMode: v }))} /></FormField><FormField label="Prompt Refine Mode" zh="提示词精修模式"><Select items={OPT.promptRefineModes} value={promptRefineMode} onChange={setPromptRefineMode} /></FormField><FormField label="Outline Rewrite Mode" zh="大纲打磨方向"><Select items={OPT.outlineRewriteModes} value={outlineRewriteMode} onChange={setOutlineRewriteMode} /></FormField></div><div className="mt-5 flex flex-wrap gap-3"><button onClick={() => handleQuickRefineCurrentPrompt()} disabled={!active} className="rounded-2xl bg-cyan-300 px-5 py-3 text-[11px] font-black uppercase text-black disabled:opacity-40">Refine Active Prompt / 精修当前提示词</button><button onClick={handleRewriteOutline} disabled={isGeneratingOutline || !(outlineDraft || script || ideaInput)} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase text-white disabled:opacity-40">Rewrite Outline / 打磨大纲</button></div></div><div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-6"><div className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">Prompt Debugger / 提示词诊断器</div><div className="mt-4 text-5xl font-black text-emerald-200">{buildPromptQualityReport(rebuildFinalPrompts(shots), tech, douyinViral).score || "--"}</div><p className="mt-3 text-sm leading-7 text-stone-300">{buildPromptQualityReport(rebuildFinalPrompts(shots), tech, douyinViral).summaryZh}</p><button onClick={handleRunQualityCheck} disabled={!shots.length || isCheckingQuality} className="mt-5 rounded-2xl bg-emerald-400 px-5 py-3 text-[11px] font-black uppercase text-black disabled:opacity-40">Run Prompt Debug / 运行提示词诊断</button></div></div>}
          {projectStudioTab === "delivery" && <div className="grid grid-cols-1 gap-4 lg:grid-cols-3"><button onClick={() => makeWord(rebuildFinalPrompts(shots), project, script, style, tech, modules)} disabled={!shots.length} className="rounded-3xl border border-amber-300/20 bg-amber-400/10 p-6 text-left text-amber-100 disabled:opacity-40"><div className="text-[10px] font-black uppercase tracking-[0.24em]">Director Script / 导演分镜</div><div className="mt-3 text-lg font-black">Export Word</div></button><button onClick={() => downloadPromptPack(rebuildFinalPrompts(shots), project)} disabled={!shots.length} className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-6 text-left text-cyan-100 disabled:opacity-40"><div className="text-[10px] font-black uppercase tracking-[0.24em]">Prompt Pack / 提示词包</div><div className="mt-3 text-lg font-black">Export TXT</div></button><button onClick={exportFullProductionKit} className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-6 text-left text-emerald-100"><div className="text-[10px] font-black uppercase tracking-[0.24em]">Full Production Kit / 完整交付包</div><div className="mt-3 text-lg font-black">Export All</div></button></div>}
        </div>
      </div>
    </div>, document.body)}
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-3xl px-6 py-4">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4"><BrandMark active={isGenerating} progress={generateProgress} /><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-base font-black uppercase tracking-[0.18em] text-white">北极星AIGC电影级工业系统 V8.4</h1><span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">总工程师 · Haley黄衍衔</span></div><div className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300/80">PROJECT STUDIO V8.4 · WIZARD · SHOT CARDS · CLIENT VIEW · PUBLISH · FULL KIT</div><div className="mt-1 text-[11px] text-stone-500">{status}</div><div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300/70">Auto Save / 自动保存：{lastSavedAt || "waiting"}</div></div></div>
        {apiIsReady && <div className="flex flex-wrap items-center gap-2">
          {v6ModeCards.map(m => <button key={m.id} onClick={() => switchWorkspaceMode(m.id)} className={`rounded-2xl border px-4 py-2 text-[11px] font-black uppercase tracking-widest ${workspaceMode === m.id ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"}`}>{m.title}</button>)}
          {workspaceMode && <button onClick={resetCurrentWorkspace} className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-red-200 hover:bg-red-400/20">Reset Workspace / 重置当前</button>}
          <button onClick={clearLocalWorkspaceCache} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-stone-300 hover:bg-white/10">Clear Cache / 清空缓存</button>
          <button onClick={() => setShowClapperboard(true)} className="rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-amber-200 hover:bg-amber-400/20">Clapperboard / 打板</button>
          <button onClick={lockProductionVersion} className="rounded-2xl border border-purple-400/25 bg-purple-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-purple-200 hover:bg-purple-400/20">Lock Version / 封存版本</button>
          <button onClick={() => setProjectStudioOpen(true)} className="rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-cyan-200 hover:bg-cyan-400/20">Project Studio / 项目中心</button><button onClick={() => { setProjectStudioOpen(true); setProjectStudioTab("visual"); }} className="rounded-2xl border border-purple-400/25 bg-purple-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-purple-200 hover:bg-purple-400/20">Visual Studio / 视觉前期</button><button onClick={openDirectorCanvas} className="rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-amber-200 hover:bg-amber-400/20">Director Canvas / 导演画布</button>
          <button onClick={openApiConnectionCenter} className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-emerald-200 hover:bg-emerald-400/20">API Center / 切换 API</button>
        </div>}
      </div>
    </header>
    {apiIsReady && <section className="border-b border-amber-300/10 bg-[linear-gradient(90deg,rgba(251,191,36,0.08),rgba(34,211,238,0.04),rgba(0,0,0,0.2))] px-6 py-5">
      <div className="mx-auto max-w-[1800px]">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-amber-300/15 bg-black/45 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-300">Mode Entry After API / API 接入后三模式入口</div>
            <h3 className="mt-2 text-xl font-black text-white">选择或切换工作模式</h3>
            <p className="mt-1 text-[12px] leading-6 text-stone-400">API 连接成功后，用户可以随时进入新手、专业、导演三个独立工作区；切换前会自动保存当前内容，不需要重启。</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[720px]">{v6ModeCards.map((m, i) => <button key={m.id} onClick={() => switchWorkspaceMode(m.id)} className={`rounded-2xl border p-4 text-left transition ${workspaceMode === m.id ? "border-amber-300 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300 hover:border-amber-300/40 hover:bg-white/10"}`}>
            <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70">Mode 0{i + 1}</div>
            <div className="mt-1 text-sm font-black">{m.title}</div>
            <div className="mt-1 text-[10px] font-bold uppercase opacity-70">{m.en}</div>
          </button>)}</div>
        </div>
      </div>
    </section>}
    {apiIsReady && <section className="border-b border-white/5 bg-[#050505] px-6 py-5">
      <div className="mx-auto max-w-[1800px]">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          <div className="rounded-[2rem] border border-amber-300/15 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.14),rgba(0,0,0,0.25)_42%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 shadow-[0_0_60px_rgba(251,191,36,0.08)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-200">Operation Path / 操作路径</div>
                <h2 className="mt-2 text-2xl font-black text-white">先选择：只要提示词，还是完整视觉流程</h2>
                <p className="mt-2 max-w-3xl text-[12px] leading-6 text-stone-400">Prompt Only 是默认低成本流程，不会自动调用图片接口；Full Visual 需要主动选择，才会生成关键帧并调用 Seedream 图片 API。</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setProjectStudioOpen(true); setProjectStudioTab("workflow"); }} className="rounded-2xl bg-amber-400 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-black">Open Workflow / 打开流程总览</button>
                <button onClick={() => { setProjectStudioOpen(true); setProjectStudioTab("wizard"); }} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10">New Project / 新建项目</button>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <button onClick={handlePromptOnlyProduction} disabled={isOneClickRunning || isGenerating} className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5 text-left transition hover:bg-emerald-400/15 disabled:opacity-50">
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200">Path A · Default / 默认</div>
                <div className="mt-2 text-xl font-black text-white">Prompt Only / 只生成提示词</div>
                <p className="mt-2 text-[12px] leading-6 text-stone-400">生成剧本、大纲、分镜、视频提示词、场景图提示词和 Prompt Pack，不调用图片 API。</p>
                <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-emerald-200">Lowest Cost / 成本最低</div>
              </button>
              <button onClick={handleFullVisualProduction} disabled={isOneClickRunning || isGenerating} className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5 text-left transition hover:bg-cyan-400/15 disabled:opacity-50">
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">Path B · Optional / 可选</div>
                <div className="mt-2 text-xl font-black text-white">Full Visual / 完整流程含图片</div>
                <p className="mt-2 text-[12px] leading-6 text-stone-400">在提示词完成后，再生成 Seedream 分镜关键帧、视觉锁定和图生视频交付包。</p>
                <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-cyan-200">Cost Shield Enabled / 图片成本保护</div>
              </button>
              <button onClick={() => { switchWorkspaceMode("director"); setDirectorView("brief"); setDirectorInspectorTab("setup"); }} className="rounded-3xl border border-purple-300/20 bg-purple-400/10 p-5 text-left transition hover:bg-purple-400/15">
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-purple-200">Path C · Pro Control / 深度控制</div>
                <div className="mt-2 text-xl font-black text-white">Director Flow / 导演流程</div>
                <p className="mt-2 text-[12px] leading-6 text-stone-400">进入导演中枢，逐镜头精修、做连续性、提示词编译、审片和交付。</p>
                <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-purple-200">Hollywood Deck / 导演指挥台</div>
              </button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center justify-between gap-3">
              <div><div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">Project Snapshot / 项目快照</div><div className="mt-2 text-lg font-black text-white">{project}</div></div>
              <div className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${productionFlowMode === "full-visual" ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-200" : "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"}`}>{productionFlowMode === "full-visual" ? "Full Visual" : "Prompt Only"}</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniStat label="Mode" value={workspaceMode || "-"} tone="amber" />
              <MiniStat label="API" value={apiConnected ? "Ready" : "Off"} tone={apiConnected ? "emerald" : "red"} />
              <MiniStat label="Shots" value={shots.length} tone="cyan" />
              <MiniStat label="Keyframes" value={`${Object.values(shotKeyframes).filter(x => x?.images?.length).length}/${shots.length || 0}`} tone="purple" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => { setProjectStudioOpen(true); setProjectStudioTab("preflight"); }} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white">需求体检</button>
              <button onClick={() => { setProjectStudioOpen(true); setProjectStudioTab("shots"); }} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white">分镜卡片</button>
              <button onClick={() => { setProjectStudioOpen(true); setProjectStudioTab("prompt"); }} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white">提示词引擎</button>
              <button onClick={() => { setProjectStudioOpen(true); setProjectStudioTab("delivery"); }} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white">交付中心</button>
            </div>
          </div>
        </div>
      </div>
    </section>}
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
    <footer className="mx-auto max-w-[1800px] px-6 pb-8 text-center text-[10px] font-black uppercase tracking-[0.22em] text-stone-700">Powered by 北极星AIGC电影级工业系统 V8.4 Clean Home · Chief Engineer: {ENGINEER_NAME} · {AUTH_SEAL_ID}</footer>
    {/* Fixed bottom-right engineer seal removed to avoid occupying workspace. / 已取消右下角固定防伪水印，保留顶部与首屏认证标识。 */}
  </div>;


  // V8.5：统一进入 NeoWOW-like 视觉生产首页。旧版所有高级功能仍保留在 Project Studio 各个 Tab 中。
  return PolarisShell({ compact: true, children: <>
    <section className="overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[radial-gradient(circle_at_20%_10%,rgba(124,58,237,.18),transparent_34%),radial-gradient(circle_at_90%_20%,rgba(6,182,212,.18),transparent_32%),linear-gradient(135deg,#ffffff,#f8fafc)] p-6 md:p-10">
        <div className="absolute right-6 top-6 hidden rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-black text-slate-600 shadow-sm backdrop-blur-xl md:block">NeoWOW-like · Visual Canvas</div>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-black text-violet-700">北极星 AIGC · 图像 / 视频生产画布版</div>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.96] tracking-[-0.07em] text-slate-950 md:text-7xl">前面做准备，画布做成片。</h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-600">这版不再把“画布”当提示词节点板，而是把它改成 AI 图像与视频生产中心：分镜准备在前，Seedream 关键帧、视觉锁定、图生视频路由和交付包都进入画布。</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {!apiIsReady ? <button onClick={handleTestApi} className="rounded-2xl bg-slate-950 px-6 py-4 text-base font-black text-white shadow-xl shadow-slate-300">Connect API / 连接引擎</button> : <button onClick={openFullVisualWorkspace} className="rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-4 text-base font-black text-white shadow-xl shadow-violet-200">Start Full Visual / 开始图像视频流程</button>}
              <button onClick={openDirectorCanvas} disabled={!apiIsReady} className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-base font-black text-slate-800 shadow-sm disabled:opacity-45">Open Visual Canvas / 打开画布</button>
              <button onClick={() => { setProjectStudioOpen(true); setProjectStudioTab("workflow"); }} className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-base font-black text-slate-800 shadow-sm">Project Studio / 全功能工作台</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["漫剧制作", "Comic Story", "故事、分镜、连续性"],
              ["无限画布", "Infinite Canvas", "图像视频生产主画布"],
              ["AI图像创作", "AI Image", "Seedream 关键帧"],
              ["AI视频生成", "AI Video", "图生视频包与模型路由"],
            ].map(([title,en,body]) => <button key={title} onClick={title === "无限画布" ? openDirectorCanvas : openFullVisualWorkspace} disabled={!apiIsReady && title !== "AI图像创作"} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 text-left shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl disabled:opacity-50"><div className="text-2xl font-black text-slate-950">{title}</div><div className="mt-2 text-sm font-black uppercase tracking-widest text-violet-500">{en}</div><p className="mt-4 text-base leading-7 text-slate-500">{body}</p></button>)}
          </div>
        </div>
      </div>
    </section>

    <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
      <aside className="space-y-5">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-black uppercase tracking-[0.24em] text-violet-600">01 Prompt Prep / 前置准备</div>
          <h2 className="mt-2 text-3xl font-black text-slate-950">提示词不是终点，只是进入画布前的准备。</h2>
          <div className="mt-5 space-y-4">
            <FormField label="Project" zh="项目名"><Input value={project} onChange={e => setProject(e.target.value)} placeholder="输入项目名称" /></FormField>
            <FormField label="Creative Brief" zh="一句话需求"><TextArea value={ideaInput} onChange={e => setIdeaInput(e.target.value)} rows={5} placeholder="例如：做一个咖啡车 30 秒高级感短视频，要治愈、城市街头、适合小红书传播..." /></FormField>
            <FormField label="Reference URL" zh="参考链接"><Input value={referenceUrl} onChange={e => setReferenceUrl(e.target.value)} placeholder="可粘贴抖音/小红书/B站/网页链接" /></FormField>
            <div className="grid grid-cols-2 gap-3"><FormField label="Duration" zh="时长"><Select items={OPT.videoDurations} value={tech.videoDuration} onChange={v => setTech(p => ({ ...p, videoDuration: v }))} /></FormField><FormField label="Ratio" zh="画幅"><Select items={OPT.ratios} value={tech.ratio} onChange={v => setTech(p => ({ ...p, ratio: v }))} /></FormField></div>
          </div>
          {!apiIsReady && <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4"><div className="text-sm font-black text-amber-700">API 还没连接</div><div className="mt-3 grid grid-cols-1 gap-3"><FormField label="Mode" zh="接口模式"><Select items={["direct", "proxy"]} value={apiMode} onChange={setApiMode} /></FormField>{apiMode === "direct" && <FormField label="DeepSeek Key" zh="密钥"><Input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-..." /></FormField>}<button onClick={handleTestApi} className="rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white">Test & Enter / 测试进入</button></div></div>}
          <div className="mt-5 grid grid-cols-2 gap-3"><button onClick={handleGenerateOutline} disabled={!apiIsReady || isGeneratingOutline} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 disabled:opacity-40">生成大纲</button><button onClick={handleGenerateShotPlan} disabled={!apiIsReady || isPlanningShots} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 disabled:opacity-40">分镜规划</button><button onClick={handleGenerate} disabled={!apiIsReady || isGenerating} className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-black text-white disabled:opacity-40">生成分镜</button><button onClick={handleFullVisualProduction} disabled={!apiIsReady || isOneClickRunning || isGenerating} className="rounded-2xl bg-violet-600 px-4 py-3 text-sm font-black text-white disabled:opacity-40">全流程视觉</button></div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-black uppercase tracking-[0.24em] text-cyan-600">System Status / 系统状态</div>
          <div className="mt-4 grid grid-cols-2 gap-3"><MiniStat label="API" value={apiIsReady ? "Ready" : "Off"} tone={apiIsReady ? "emerald" : "red"} /><MiniStat label="Shots" value={shots.length} tone="cyan" /><MiniStat label="Images" value={`${Object.values(shotKeyframes).filter(x => x?.images?.length).length}/${shots.length || 0}`} tone="purple" /><MiniStat label="Routes" value={videoModelRouting.length} tone="amber" /></div>
        </div>
      </aside>
      <main className="rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><div className="text-sm font-black uppercase tracking-[0.24em] text-fuchsia-600">02 Visual Production Canvas / 图像视频画布预览</div><h2 className="mt-2 text-4xl font-black tracking-[-0.05em] text-slate-950">生成图片，组织镜头，再进入视频。</h2><p className="mt-3 max-w-4xl text-base leading-8 text-slate-500">这里是主页面的简化画布；真正的全屏画布点击右上角进入，所有旧功能仍在 Project Studio。</p></div><div className="flex flex-wrap gap-2"><button onClick={() => handleGenerateAllShotKeyframes(rebuildFinalPrompts(shots || []), { skipConfirm: false })} disabled={!shots.length || isGeneratingKeyframes} className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-black text-white disabled:opacity-40">Generate Images</button><button onClick={handleBuildVideoModelRouter} disabled={!shots.length} className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40">Build Video Routes</button><button onClick={openDirectorCanvas} disabled={!apiIsReady} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 disabled:opacity-40">Open Fullscreen Canvas</button></div></div>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {rebuildFinalPrompts(shots || []).length ? rebuildFinalPrompts(shots || []).map((s, i) => { const key = String(s.id || i + 1); const k = shotKeyframes?.[key] || {}; const hero = (k.images || [])[Number(k.selectedIndex || 0)] || null; const route = videoModelRouting.find(r => Number(r.shotIndex) === i + 1); return <div key={key} className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm"><div className="aspect-video overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">{hero ? <img src={frameImageSrc(hero)} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-center text-sm font-black text-slate-400">No Image Yet</div>}</div><div className="mt-4 text-sm font-black uppercase tracking-widest text-violet-500">Shot {i + 1}</div><div className="mt-1 line-clamp-2 text-xl font-black text-slate-950">{s.titleZh || s.titleEn}</div><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{s.sceneZh || s.sceneEn}</p><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => { setActiveShot(i); handleGenerateShotKeyframe(i); }} className="rounded-2xl bg-cyan-500 px-3 py-3 text-sm font-black text-white">生图</button><button onClick={() => { setActiveShot(i); handleBuildVideoModelRouter(); }} className="rounded-2xl bg-violet-600 px-3 py-3 text-sm font-black text-white">视频</button></div><div className="mt-3 rounded-2xl bg-slate-100 p-3 text-xs leading-5 text-slate-500">{route ? `Video: ${route.model} · ${route.reasonZh || route.reason}` : "Video route pending / 待生成视频路线"}</div></div> }) : <div className="col-span-full rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-12 text-center"><div className="text-3xl font-black text-slate-950">等待创作内容</div><p className="mt-3 text-base text-slate-500">左侧填写需求后生成分镜，这里会出现可生图、可转视频的镜头卡片。</p></div>}
        </div>
      </main>
    </section>
  </> });

  if (!apiIsReady) {
    return PolarisShell({ compact: true, children: <>
      <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-[#050505] p-5 shadow-[0_0_100px_rgba(34,211,238,0.10)]">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-[90px]" />
        <div className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-purple-500/20 blur-[110px]" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-amber-400/10 blur-[90px]" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/[0.035] px-5 py-4 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <BrandMark active={false} progress={0} />
            <div>
              <div className="text-sm font-black uppercase tracking-[0.24em] text-white">POLARIS AIGC STUDIO</div>
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">Clean Home · Infinite Canvas · Image / Video AI</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <button onClick={() => document.getElementById("polaris-api-card")?.scrollIntoView({ behavior: "smooth", block: "center" })} className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-cyan-100 hover:bg-cyan-300/20">Connect API</button>
            <button onClick={() => document.getElementById("polaris-flow-card")?.scrollIntoView({ behavior: "smooth", block: "center" })} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-stone-200 hover:bg-white/10">View Flow</button>
          </div>
        </div>
        <div className="relative z-10 grid gap-8 px-3 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <div className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">一站式 AI 影视创作工作台</div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl">
              把系统收回来，做成一个干净的创作首页。
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-400">
              不再把所有高级功能堆在第一屏。首页只负责三件事：选择创作类型、进入工作流、连接 AI 引擎。复杂能力放进项目内页和无限画布里。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => document.getElementById("polaris-api-card")?.scrollIntoView({ behavior: "smooth", block: "center" })} className="rounded-2xl bg-white px-6 py-4 text-[12px] font-black uppercase tracking-widest text-black hover:bg-cyan-100">Start Creating / 开始创作</button>
              <button onClick={() => setProjectStudioOpen(true)} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-[12px] font-black uppercase tracking-widest text-white hover:bg-white/10">Preview Studio / 预览工作台</button>
            </div>
            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
              {[['43+', 'Film Modules', '电影工业模块'], ['Seedream', 'Image API', '即梦生图'], ['Canvas', 'Node Flow', '无限画布']].map(([a,b,c]) => <div key={a} className="rounded-3xl border border-white/10 bg-black/35 p-4"><div className="text-xl font-black text-white">{a}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest text-cyan-200">{b}</div><div className="mt-1 text-[11px] text-stone-500">{c}</div></div>)}
            </div>
          </div>
          <div className="rounded-[2.5rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5 shadow-2xl backdrop-blur-2xl">
            <div className="rounded-[2rem] border border-cyan-300/15 bg-black/50 p-5">
              <div className="flex items-center justify-between gap-3"><div><div className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">Product Map</div><div className="mt-1 text-xl font-black text-white">创作产品入口</div></div><div className="rounded-full bg-emerald-300 px-3 py-1 text-[10px] font-black text-black">Clean</div></div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ['AI 漫剧制作', 'Comic / Story', '从剧情到分镜'],
                  ['无限画布', 'Canvas', '节点式工作流'],
                  ['AI 图像创作', 'Image', '关键帧与角色锁定'],
                  ['AI 视频生成', 'Video', '模型路由与交付'],
                ].map(([title, en, sub]) => <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 hover:border-cyan-300/30"><div className="text-sm font-black text-white">{title}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest text-cyan-200">{en}</div><div className="mt-3 text-[11px] leading-5 text-stone-500">{sub}</div></div>)}
              </div>
            </div>
            <div className="mt-4 rounded-[2rem] border border-purple-300/15 bg-purple-400/10 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-purple-200">Why it feels cleaner / 为什么会更干净</div>
              <div className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                <div className="rounded-2xl bg-black/35 p-3">01 · 首页只做导航和决策，不塞满参数。</div>
                <div className="rounded-2xl bg-black/35 p-3">02 · 高级参数进入项目后再展开。</div>
                <div className="rounded-2xl bg-black/35 p-3">03 · 无限画布作为 Pro 工具，而不是所有人的第一入口。</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="polaris-flow-card" className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-4">
        {[
          ['01', 'Start', '立项', '一句话需求、参考链接、项目类型'],
          ['02', 'Write', '剧本', '大纲、人物、节奏、爆款钩子'],
          ['03', 'Produce', '制作', '分镜、提示词、关键帧、Seedream'],
          ['04', 'Deliver', '交付', 'Word、TXT、JSON、客户预览'],
        ].map(([no,en,zh,body]) => <div key={no} className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5"><div className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-200">{no}</div><div className="mt-3 text-xl font-black text-white">{en} / {zh}</div><p className="mt-3 text-sm leading-7 text-stone-500">{body}</p></div>)}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-7">
          <div className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-200">Design Decision / 这次的方向</div>
          <h2 className="mt-3 text-3xl font-black text-white">少就是专业。</h2>
          <p className="mt-4 text-sm leading-8 text-stone-400">现在不要继续加按钮。先建立清晰信息架构：用户先看到产品入口，再进入具体流程。节点、参数、模型、检查器全部收进二级页面。</p>
          <div className="mt-6 space-y-3 text-[12px] leading-6 text-stone-300">
            {['首页：产品入口 + 快速开始', '项目页：按生产流程分步骤', '画布页：只给高级用户做流程编排', '交付页：把结果打包给客户'].map(x => <div key={x} className="rounded-2xl border border-white/10 bg-black/30 p-3">{x}</div>)}
          </div>
        </div>
        <div id="polaris-api-card" className="rounded-[2.5rem] border border-cyan-300/20 bg-cyan-400/[0.06] p-7">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">Engine Connection / 引擎连接</div><h2 className="mt-3 text-3xl font-black text-white">连接 API 后进入创作</h2><p className="mt-2 text-sm leading-7 text-stone-400">保留原有 direct / proxy 两种模式，但放在首页底部，不再抢占视觉中心。</p></div><div className="rounded-full border border-red-300/20 bg-red-300/10 px-3 py-1 text-[10px] font-black text-red-200">Offline</div></div>
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <FormField label="API Mode" zh="接口模式"><div className="grid grid-cols-2 gap-3">{['direct', 'proxy'].map(m => <button key={m} onClick={() => setApiMode(m)} className={`rounded-2xl border px-4 py-3 text-left ${apiMode === m ? 'border-emerald-400 bg-emerald-400 text-black' : 'border-white/10 bg-white/5 text-stone-300'}`}><div className="text-[12px] font-black uppercase">{m}</div><div className="mt-1 text-[10px] opacity-70">{m === 'direct' ? '前端输入 Key' : '后端 route 代理'}</div></button>)}</div></FormField>
            <FormField label="AI Model" zh="模型选择"><Select items={DEEPSEEK_V4_MODELS} value={selectedModel} onChange={setSelectedModel} /></FormField>
            {apiMode === 'direct' && <FormField label="DeepSeek API Key" zh="智算令牌"><Input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-..." /></FormField>}
            <div className="flex items-end"><button onClick={handleTestApi} className="w-full rounded-2xl bg-emerald-400 px-6 py-4 text-[12px] font-black uppercase tracking-widest text-black hover:bg-emerald-500">Test & Enter / 测试并进入</button></div>
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/45 p-4 text-[11px] leading-6 text-stone-300">Status: {apiLog.status}<br/>Model: {apiLog.lastModel || selectedModel}<br/>Endpoint: {apiLog.lastEndpoint || deepSeekEndpoint}<br/>{apiLog.message}</div>
        </div>
      </section>
    </> });
  }

  if (!workspaceMode) {
    return PolarisShell({ compact: true, children: <>
      <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-[#050505] p-5 shadow-[0_0_100px_rgba(16,185,129,0.10)]">
        <div className="absolute -left-28 top-0 h-80 w-80 rounded-full bg-emerald-400/20 blur-[110px]" />
        <div className="absolute -right-28 top-24 h-96 w-96 rounded-full bg-cyan-400/16 blur-[120px]" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/[0.035] px-5 py-4 backdrop-blur-2xl">
          <div className="flex items-center gap-3"><BrandMark active={false} progress={100} /><div><div className="text-sm font-black uppercase tracking-[0.24em] text-white">POLARIS Home</div><div className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-200">API Connected · Choose Your Creation Path</div></div></div>
          <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest">
            <button onClick={openApiConnectionCenter} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-stone-200 hover:bg-white/10">API Center</button>
            <button onClick={() => { setProjectStudioOpen(true); setProjectStudioTab('canvas'); }} className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-cyan-100 hover:bg-cyan-300/20">Open Canvas</button>
          </div>
        </div>
        <div className="relative z-10 grid gap-8 px-3 py-12 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <div className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">API Connected / 可以开始</div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl">选择一个入口，不再被复杂功能淹没。</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-400">这个首页采用“产品入口 + 工作流入口”的结构。你先选择要做什么，进入之后再打开高级参数、节点画布和交付工具。</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={openPromptOnlyWorkspace} className="rounded-2xl bg-white px-6 py-4 text-[12px] font-black uppercase tracking-widest text-black hover:bg-emerald-100">Prompt Only / 只做提示词</button>
              <button onClick={openFullVisualWorkspace} className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-6 py-4 text-[12px] font-black uppercase tracking-widest text-cyan-100 hover:bg-cyan-300/20">Full Visual / 图文视频全流程</button>
            </div>
          </div>
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['漫剧制作', 'Comic Story', '剧情、分镜、连续性'],
                ['无限画布', 'Infinite Canvas', '节点式流程编排'],
                ['AI图像', 'Image Creation', 'Seedream 关键帧'],
                ['AI视频', 'Video Prompt', '模型适配与路由'],
              ].map(([title,en,sub]) => <button key={title} onClick={() => title === '无限画布' ? (setProjectStudioOpen(true), setProjectStudioTab('canvas')) : switchWorkspaceMode('pro')} className="rounded-[2rem] border border-white/10 bg-black/35 p-5 text-left transition hover:border-cyan-300/35 hover:bg-white/10"><div className="text-lg font-black text-white">{title}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest text-cyan-200">{en}</div><p className="mt-4 text-[12px] leading-6 text-stone-500">{sub}</p></button>)}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {v6ModeCards.map((m, i) => <button key={m.id} onClick={() => switchWorkspaceMode(m.id)} className="group rounded-[2.25rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(0,0,0,0.45))] p-7 text-left shadow-2xl transition hover:-translate-y-1 hover:border-emerald-300/35 hover:bg-white/10">
          <div className="flex items-center justify-between"><div className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">Path 0{i + 1}</div><div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black text-stone-400">{m.en}</div></div>
          <h3 className="mt-5 text-3xl font-black text-white">{m.title}</h3>
          <p className="mt-5 min-h-[84px] text-sm leading-7 text-stone-400">{m.desc}</p>
          <div className="mt-6 inline-flex rounded-2xl bg-emerald-400 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black">{m.cta}</div>
        </button>)}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-7">
          <div className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">Clean Production Flow / 清爽生产流</div>
          <h2 className="mt-3 text-3xl font-black text-white">以后按这 5 个区块维护，不要再堆页面。</h2>
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-5">
            {[
              ['01', '输入'], ['02', '故事'], ['03', '分镜'], ['04', '视觉'], ['05', '交付']
            ].map(([no, title]) => <div key={no} className="rounded-3xl border border-white/10 bg-black/35 p-4 text-center"><div className="text-[10px] font-black text-cyan-200">{no}</div><div className="mt-2 text-lg font-black text-white">{title}</div></div>)}
          </div>
          <p className="mt-5 text-sm leading-8 text-stone-400">首页学 Neowow 这类产品站的清晰入口逻辑：先让用户知道“能做什么”，再让用户进入“怎么做”。不要在第一屏暴露所有工程按钮。</p>
        </div>
        <div className="rounded-[2.5rem] border border-amber-300/20 bg-amber-400/[0.06] p-7">
          <div className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-200">Project Snapshot / 项目状态</div>
          <h3 className="mt-3 text-2xl font-black text-white">{project}</h3>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <MiniStat label="API" value={apiConnected ? 'Ready' : 'Ready'} tone="emerald" />
            <MiniStat label="Shots" value={shots.length} tone="cyan" />
            <MiniStat label="Mode" value={productionFlowMode === 'full-visual' ? 'Full Visual' : 'Prompt Only'} tone="amber" />
            <MiniStat label="Keyframes" value={`${Object.values(shotKeyframes).filter(x => x?.images?.length).length}/${shots.length || 0}`} tone="purple" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button onClick={() => { setProjectStudioOpen(true); setProjectStudioTab('workflow'); }} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-[10px] font-black text-white hover:bg-white/10">工作流</button>
            <button onClick={() => { setProjectStudioOpen(true); setProjectStudioTab('canvas'); }} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-[10px] font-black text-white hover:bg-white/10">画布</button>
            <button onClick={() => { setProjectStudioOpen(true); setProjectStudioTab('visual'); }} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-[10px] font-black text-white hover:bg-white/10">关键帧</button>
            <button onClick={() => { setProjectStudioOpen(true); setProjectStudioTab('delivery'); }} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-[10px] font-black text-white hover:bg-white/10">交付</button>
          </div>
        </div>
      </section>
    </> });
  }

  if (workspaceMode === "beginner") {
    return PolarisShell({ children: <>
      <div className="grid grid-cols-1 gap-7 xl:grid-cols-12">
        <section className="xl:col-span-7 space-y-6">
          <GlassPanel title="Beginner Quick Create" subTitle="新手一键生成" defaultOpen>
            <div className="space-y-5">
              <FormField label="Reference URL" zh="参考链接"><Input value={referenceUrl} onChange={e => setReferenceUrl(e.target.value)} placeholder="粘贴视频号 / 抖音 / 小红书 / B站 / 公众号 / 网页链接" /></FormField>
              <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/5 p-4"><div className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">Word Script Import / Word剧本导入</div><div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]"><input type="file" accept=".docx,.txt,.md,.markdown" onChange={handleScriptDocumentUpload} className="block w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-xs text-white file:mr-3 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-3 file:py-2 file:text-xs file:font-black file:text-black" /><button onClick={handleAnalyzeImportedScript} disabled={!scriptImportText.trim() || isAnalyzingImportedScript} className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-[10px] font-black uppercase text-cyan-200 disabled:opacity-40">Analyze / 分析</button></div>{scriptImportMeta?.name && <div className="mt-3 text-[11px] text-stone-400">已导入：{scriptImportMeta.name} · {scriptImportText.length} 字符</div>}<button onClick={handleApplyImportedScriptToBible} disabled={!scriptImportText.trim()} className="mt-3 rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-[10px] font-black uppercase text-amber-200 disabled:opacity-40">Apply to Script / 写入剧本</button></div>
              <FormField label="Idea Requirement" zh="一句话创作需求"><TextArea value={ideaInput} onChange={e => setIdeaInput(e.target.value)} className="min-h-[180px] text-base font-bold" placeholder="例如：写一个关于香港文化的短视频，要有剧情，要有爆款思维，1分钟内的短视频脚本。" /></FormField>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {OPT.douyinVideoTypes.slice(0, 6).map(t => <button key={t} onClick={() => setDouyinViral(p => ({ ...p, videoType: t }))} className={`rounded-2xl border px-4 py-3 text-left text-[11px] font-black ${douyinViral.videoType === t ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300"}`}>{t}</button>)}
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {OPT.shortVideoDurations.map(t => <button key={t} onClick={() => setDouyinViral(p => ({ ...p, duration: t }))} className={`rounded-2xl border px-4 py-3 text-center text-[11px] font-black ${douyinViral.duration === t ? "border-emerald-400 bg-emerald-400 text-black" : "border-white/10 bg-white/5 text-stone-300"}`}>{t}</button>)}
              </div>
              <Toggle checked={douyinViral.enabled} onChange={v => setDouyinViral(p => ({ ...p, enabled: v }))} label="Douyin Viral Logic" zh="启用抖音爆款短视频思维" />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2"><button onClick={handlePromptOnlyProduction} disabled={isOneClickRunning || isGenerating} className="w-full rounded-3xl bg-emerald-400 px-8 py-5 text-[13px] font-black uppercase tracking-widest text-black hover:bg-emerald-500 disabled:opacity-50">{isOneClickRunning ? "Running... / 运行中" : "Prompt Only / 只生成提示词"}</button><button onClick={handleFullVisualProduction} disabled={isOneClickRunning || isGenerating} className="w-full rounded-3xl border border-cyan-300/25 bg-cyan-400/10 px-8 py-5 text-[13px] font-black uppercase tracking-widest text-cyan-200 hover:bg-cyan-400/20 disabled:opacity-50">Full Visual / 提示词+图片</button></div>
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
    return PolarisShell({ children: <>
      <div className="grid grid-cols-1 gap-7 xl:grid-cols-12">
        <aside className="xl:col-span-3 space-y-3">{v6StepTabs.map(t => <button key={t.id} onClick={() => setProStep(t.id)} className={`w-full rounded-2xl border px-4 py-4 text-left text-[12px] font-black uppercase tracking-widest ${proStep === t.id ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"}`}>{t.label}</button>)}<div className="rounded-3xl border border-white/10 bg-black/35 p-4"><div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">Independent Workspace / 独立工作区</div><div className="mt-2 text-[11px] leading-5 text-stone-500">专业模式不会自动影响新手或导演模式。</div><button onClick={() => importCurrentWorkspaceTo("director")} className="mt-3 w-full rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-[11px] font-black uppercase text-amber-200 hover:bg-amber-400/20">Import to Director / 导入导演模式</button></div></aside>
        <section className="xl:col-span-9 space-y-6">
          {proStep === "reference" && <GlassPanel title="01 Reference Understanding" subTitle="参考链接理解" defaultOpen><div className="space-y-5"><FormField label="Reference URL" zh="参考链接"><Input value={referenceUrl} onChange={e => setReferenceUrl(e.target.value)} placeholder="https://..." /></FormField><FormField label="Manual Reference Content" zh="备用粘贴内容"><TextArea value={referenceManualContent} onChange={e => setReferenceManualContent(e.target.value)} /></FormField><FormField label="Reference Use Mode" zh="参考用途"><div className="grid grid-cols-1 gap-3 md:grid-cols-2">{OPT.referenceUseModes.map(x => <button key={x} onClick={() => setReferenceUseMode(x)} className={`rounded-2xl border px-4 py-3 text-left text-[11px] font-black ${referenceUseMode === x ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300"}`}>{x}</button>)}</div></FormField><button onClick={handleIngestReference} disabled={isIngestingReference} className="rounded-2xl bg-emerald-400 px-6 py-3 text-[12px] font-black uppercase text-black">Ingest Reference / 识别参考链接</button><div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-[12px] leading-6 text-stone-300">{referenceIngest.summary || referenceIngest.usableFacts || "链接解析结果会显示在这里。"}</div></div></GlassPanel>}
          {proStep === "script" && <div className="space-y-6"><GlassPanel title="Script Import Lab" subTitle="Word剧本文档导入分析室" defaultOpen>
            <div className="space-y-5">
              <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/5 p-4 text-[12px] leading-6 text-stone-300">支持 .docx / .txt / .md。导入后可分析人物、场景、对白、情绪曲线、分场结构，并写入剧本与创作圣经。</div>
              <FormField label="Import Script Document" zh="导入Word剧本"><input type="file" accept=".docx,.txt,.md,.markdown" onChange={handleScriptDocumentUpload} className="block w-full rounded-2xl border border-white/10 bg-black/70 px-5 py-3 text-sm text-white file:mr-4 file:rounded-xl file:border-0 file:bg-amber-400 file:px-4 file:py-2 file:text-xs file:font-black file:text-black" /></FormField>
              {scriptImportMeta?.name && <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-[11px] leading-6 text-stone-300"><b className="text-amber-200">{scriptImportMeta.name}</b><br />Type: {scriptImportMeta.type} · Parser: {scriptImportMeta.parser} · Text: {scriptImportText.length} chars</div>}
              <FormField label="Imported Script Text" zh="导入文本预览/可手动粘贴"><TextArea value={scriptImportText} onChange={e => setScriptImportText(e.target.value)} rows={6} placeholder="也可以直接粘贴剧本文档正文。" /></FormField>
              <div className="flex flex-wrap gap-3">
                <button onClick={handleAnalyzeImportedScript} disabled={isAnalyzingImportedScript || isImportingScript || !scriptImportText.trim()} className="rounded-2xl bg-cyan-400 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black disabled:opacity-50">Analyze Script / 分析剧本</button>
                <button onClick={handleApplyImportedScriptToBible} disabled={!scriptImportText.trim()} className="rounded-2xl border border-amber-300/20 bg-amber-400/10 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-amber-200 disabled:opacity-40">Apply to Bible / 写入创作圣经</button>
                <button onClick={handleGenerateShotPlanFromImport} disabled={!scriptImportText.trim() || isPlanningShots} className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-emerald-200 disabled:opacity-40">Shot Plan From Script / 从文档规划分镜</button>
              </div>
              {scriptImportScenes.length > 0 && <FormField label="Scene Selection" zh="选择生成范围"><Select items={["all", ...scriptImportScenes.map((s, i) => String(s.sceneId || s.id || s.index || i + 1))]} value={selectedImportScene} onChange={setSelectedImportScene} /></FormField>}
              {scriptImportAnalysis && <div className="rounded-3xl border border-white/10 bg-black/40 p-5"><div className="text-[11px] font-black uppercase tracking-[0.24em] text-cyan-200">Script Analysis Report / 剧本分析报告</div><div className="mt-3 whitespace-pre-wrap text-[12px] leading-6 text-stone-300">{summarizeImportedScriptAnalysis(scriptImportAnalysis) || scriptImportAnalysis.analysisReport || "已完成分析。"}</div>{scriptImportScenes.length > 0 && <div className="mt-4 grid grid-cols-1 gap-2">{scriptImportScenes.slice(0, 8).map((s, i) => <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[11px] leading-5 text-stone-300"><b className="text-amber-200">{s.titleZh || s.titleEn || `Scene ${i + 1}`}</b><br />{s.storyFunction || s.emotionalBeat || s.rawTextSummary || "分场信息"}</div>)}</div>}</div>}
            </div>
          </GlassPanel><GlassPanel title="02 Idea & Script Bible" subTitle="想法与剧本创作圣经" defaultOpen><div className="space-y-5"><FormField label="Idea Requirement" zh="想法需求"><TextArea value={ideaInput} onChange={e => setIdeaInput(e.target.value)} className="min-h-[140px]" /></FormField><button onClick={handleGenerateOutline} disabled={isGeneratingOutline} className="rounded-2xl bg-amber-400 px-6 py-3 text-[12px] font-black uppercase text-black">Generate Script Outline / 生成脚本大纲</button><FormField label="Script & Creative Bible" zh="剧本与创作圣经"><TextArea value={script} onChange={e => setScript(e.target.value)} className="min-h-[220px] text-base font-bold" /></FormField></div></GlassPanel></div>}
          {proStep === "planning" && <GlassPanel title="03 Smart Shot Planning" subTitle="智能分镜规划" defaultOpen><div className="space-y-5"><div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4"><div className="text-[11px] text-stone-300">{shotPlan.summaryZh}{NL}{shotPlan.summaryEn}</div></div><button onClick={handleGenerateShotPlan} disabled={isPlanningShots} className="rounded-2xl bg-amber-400 px-6 py-3 text-[12px] font-black uppercase text-black">Generate Shot Plan / 生成分镜规划表</button><div className="space-y-2 max-h-[420px] overflow-y-auto">{shotPlanRows.length ? shotPlanRows.map((r, i) => <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-[10px] font-black text-amber-300">#{r.shotNo || i + 1} · {r.roleZh || r.role}</div><div className="mt-1 text-sm text-white">{r.beatZh || r.beat}</div></div>) : <div className="text-sm text-stone-500">还没有分镜规划表。</div>}</div></div></GlassPanel>}
          {proStep === "shots" && <GlassPanel title="04 Generate & Review Shots" subTitle="正式分镜生成" defaultOpen><div className="space-y-5"><div className="flex flex-wrap gap-3"><button onClick={handleGenerateFromShotPlan} disabled={isGenerating} className="rounded-2xl bg-amber-400 px-6 py-3 text-[12px] font-black uppercase text-black">Generate From Plan / 按规划生成</button><button onClick={handleGenerate} disabled={isGenerating} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-[12px] font-black uppercase text-white">Smart Generate / 智能生成</button><button onClick={handleRepairMissingCoverage} disabled={!shots.length || isRepairingCoverage} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-[12px] font-black uppercase text-white">Inspect & Add Missing / 检查补镜头</button></div><div className="grid grid-cols-1 gap-3 md:grid-cols-2">{shots.length ? shots.map((s, i) => <button key={i} onClick={() => { importCurrentWorkspaceTo("director"); setActiveShot(i); }} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10"><div className="flex items-center justify-between gap-2"><div className="text-[10px] font-black text-amber-300">Shot {i + 1} · {s.duration}</div><ShotRoleBadge shot={s} /></div><div className="mt-2 text-sm font-black text-white">{s.titleZh}</div><div className="mt-2 line-clamp-2 text-[11px] text-stone-400">{s.sceneZh}</div></button>) : <div className="text-sm text-stone-500">还没有分镜。</div>}</div></div></GlassPanel>}
          {proStep === "scene" && <GlassPanel title="05 Scene Image Studio" subTitle="场景图工作室" defaultOpen><div className="space-y-5"><FormField label="Image Model Variant" zh="图像模型适配"><div className="grid grid-cols-1 gap-3 md:grid-cols-2">{OPT.sceneImageModels.map(m => <button key={m} onClick={() => setTech(p => ({ ...p, sceneImageModel: m }))} className={`rounded-2xl border px-4 py-3 text-left text-[11px] font-black ${tech.sceneImageModel === m ? "border-emerald-400 bg-emerald-400 text-black" : "border-white/10 bg-white/5 text-stone-300"}`}>{m}</button>)}</div></FormField><button onClick={handleEnhanceSceneImagePrompts} disabled={!shots.length || isEnhancingSceneImages} className="rounded-2xl bg-emerald-400 px-6 py-3 text-[12px] font-black uppercase text-black">Enhance All Scene Prompts / 增强场景图提示词</button><button onClick={handleDownloadSceneImagePack} disabled={!shots.length} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-[12px] font-black uppercase text-white">Download Prompt Pack / 下载提示词包</button></div></GlassPanel>}
          {proStep === "export" && <GlassPanel title="06 Export Center" subTitle="导出中心" defaultOpen><div className="grid grid-cols-1 gap-4 md:grid-cols-3"><button onClick={() => makeWord(rebuildFinalPrompts(shots), project, script, style, tech, modules)} disabled={!shots.length} className="rounded-2xl bg-amber-400 px-6 py-4 text-[12px] font-black uppercase text-black disabled:opacity-40">Export Word / 导出 Word</button><button onClick={handleCopySceneImagePack} disabled={!shots.length} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-[12px] font-black uppercase text-white disabled:opacity-40">Copy Scene Pack / 复制场景图包</button><button onClick={handleRunQualityCheck} disabled={!shots.length || isCheckingQuality} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-[12px] font-black uppercase text-white disabled:opacity-40">Quality Check / 质量检查</button><button onClick={() => downloadPromptPack(rebuildFinalPrompts(shots), project)} disabled={!shots.length} className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-6 py-4 text-[12px] font-black uppercase text-emerald-200 disabled:opacity-40">Export Prompt Pack / 导出纯提示词包</button></div>{qualityReport && <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4 text-[12px] text-stone-300">{qualityReport.summaryZh || qualityReport.summaryEn}</div>}</GlassPanel>}
        </section>
      </div>
    </> });
  }

  return PolarisShell({ compact: true, children: <>
    <div className="fixed bottom-4 left-4 z-[120] rounded-2xl border border-emerald-400/30 bg-black/90 px-4 py-3 shadow-[0_0_40px_rgba(16,185,129,0.18)] backdrop-blur-xl">
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">V7 VISUAL PRE-PRODUCTION STUDIO / Prompt → Image → Video 前期工业系统 · 火山即梦 Seedream 生图接入已生效</div>
      <div className="mt-1 select-all text-xs font-black text-white">API model = {DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0]}</div>
    </div>

    <section className="mb-5 overflow-hidden rounded-[2.2rem] border border-amber-300/15 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),rgba(0,0,0,0.6)_38%),linear-gradient(135deg,rgba(255,255,255,0.07),rgba(0,0,0,0.5))] p-5 shadow-2xl">
      <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-amber-200">Hollywood Director Flow Deck</span>
            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300">Mode-Isolated Workspace</span>
            <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300">Shot Keyframe + Visual Lock</span>
            <span className="rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">总工程师 · Haley黄衍衔 · Authentic Seal</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-[0.04em] text-white md:text-4xl">导演模式 · 好莱坞级镜头控制台</h2>
          <p className="mt-3 max-w-5xl text-sm leading-7 text-stone-400">重新设计为“左侧镜头资产库 + 中央创作中枢/当前镜头台 + 右侧标签式检查器”。导演模式的核心输入、剧本圣经、分镜规划和镜头编辑都集中在中间，右侧只作为专业检查器。</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/45 p-4 text-center"><div className="text-2xl font-black text-amber-300">{shots.length || 0}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-500">Shots</div></div>
          <div className="rounded-2xl border border-white/10 bg-black/45 p-4 text-center"><div className="text-2xl font-black text-emerald-300">{shotPlanRows.length || 0}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-500">Plan</div></div>
          <div className="rounded-2xl border border-white/10 bg-black/45 p-4 text-center"><div className="text-2xl font-black text-cyan-300">{qualityReport?.score || qualityScore}%</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-500">Quality</div></div>
          <div className="rounded-2xl border border-white/10 bg-black/45 p-4 text-center"><div className="text-2xl font-black text-white">51</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-500">Modules + Prompt</div></div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-6">
        <button onClick={handlePromptOnlyProduction} disabled={isOneClickRunning || isGenerating} className="rounded-2xl bg-emerald-400 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-black hover:bg-emerald-500 disabled:opacity-50">Prompt Only<br/><span className="opacity-70">只生成提示词</span></button><button onClick={handleFullVisualProduction} disabled={isOneClickRunning || isGenerating} className="rounded-2xl border border-cyan-300/25 bg-cyan-400/10 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-cyan-200 hover:bg-cyan-400/20 disabled:opacity-50">Full Visual<br/><span className="opacity-70">提示词+图片</span></button>
        <button onClick={handleGenerateShotPlan} disabled={isPlanningShots} className="rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-amber-200 hover:bg-amber-400/20 disabled:opacity-40">Shot Plan<br/><span className="opacity-70">分镜规划</span></button>
        <button onClick={handleGenerateFromShotPlan} disabled={isGenerating || !shotPlanRows.length} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 disabled:opacity-40">Generate From Plan<br/><span className="opacity-70">按规划生成</span></button>
        <button onClick={handleGenerate} disabled={isGenerating} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 disabled:opacity-40">Smart Generate<br/><span className="opacity-70">智能生成</span></button>
        <button onClick={handleRepairMissingCoverage} disabled={!shots.length || isRepairingCoverage} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 disabled:opacity-40">Add Missing<br/><span className="opacity-70">检查补镜头</span></button>
        <button onClick={() => makeWord(rebuildFinalPrompts(shots), project, script, style, tech, modules)} disabled={!shots.length} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 disabled:opacity-40">Export Word<br/><span className="opacity-70">导出脚本</span></button><button onClick={() => downloadPromptPack(rebuildFinalPrompts(shots), project)} disabled={!shots.length} className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-200 hover:bg-emerald-400/20 disabled:opacity-40">Prompt Pack<br/><span className="opacity-70">纯提示词包</span></button>
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
        <div className="rounded-[2rem] border border-amber-300/20 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.14),rgba(0,0,0,0.35)_42%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(0,0,0,0.25))] p-5 backdrop-blur-2xl">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-200">Director Flow Deck / 导演流程指挥台</div>
              <h3 className="mt-2 text-2xl font-black text-white">按导演工作流推进：创作 → 规划 → 镜头 → 提示词 → 关键帧 → 审片 → 交付</h3>
              <p className="mt-2 text-[12px] leading-6 text-stone-400">导演模式不再把全部功能堆在一起，核心操作集中在中间，右侧检查器只负责当前步骤的高级控制。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setProjectStudioOpen(true)} className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-cyan-200">Project Studio / 项目中心</button>
              <button onClick={() => { setProjectStudioOpen(true); setProjectStudioTab("workflow"); }} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white">Workflow / 流程总览</button>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
            {[
              { no: "01", title: "Creative", zh: "创作中枢", sub: "需求/剧本", active: directorView === "brief", action: () => { setDirectorView("brief"); setDirectorInspectorTab("setup"); } },
              { no: "02", title: "Plan", zh: "分镜规划", sub: "数量/覆盖", active: directorInspectorTab === "planning", action: () => { setDirectorView("brief"); setDirectorInspectorTab("planning"); } },
              { no: "03", title: "Shot", zh: "镜头编辑", sub: "画面/表演", active: directorView === "scene", action: () => { setDirectorView("scene"); setDirectorInspectorTab("look"); } },
              { no: "04", title: "Continuity", zh: "连续性", sub: "承接/状态", active: directorView === "continuity", action: () => { setDirectorView("continuity"); setDirectorInspectorTab("modules"); } },
              { no: "05", title: "Prompt", zh: "提示词", sub: "编译/适配", active: directorView === "prompts", action: () => { setDirectorView("prompts"); setDirectorInspectorTab("tools"); } },
              { no: "06", title: "Keyframe", zh: "关键帧", sub: "Seedream", active: projectStudioOpen && projectStudioTab === "visual", action: () => { setProjectStudioOpen(true); setProjectStudioTab("visual"); } },
              { no: "07", title: "Review", zh: "审片", sub: "质量/风险", active: directorInspectorTab === "review", action: () => { setDirectorInspectorTab("review"); } },
              { no: "08", title: "Delivery", zh: "交付", sub: "导出/封存", active: projectStudioOpen && projectStudioTab === "delivery", action: () => { setProjectStudioOpen(true); setProjectStudioTab("delivery"); } },
            ].map(item => <button key={item.no} onClick={item.action} className={`rounded-2xl border p-3 text-left transition ${item.active ? "border-amber-300 bg-amber-300 text-black" : "border-white/10 bg-black/35 text-stone-300 hover:bg-white/10"}`}>
              <div className="text-[10px] font-black uppercase tracking-[0.18em] opacity-70">{item.no} · {item.title}</div>
              <div className="mt-1 text-sm font-black">{item.zh}</div>
              <div className="mt-1 text-[10px] opacity-60">{item.sub}</div>
            </button>)}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-[11px] leading-5 text-stone-300"><b className="text-amber-200">输入状态：</b>{ideaInput ? "一句话需求已填写" : "等待一句话需求"} · {script ? "剧本圣经已准备" : "剧本未锁定"}</div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-[11px] leading-5 text-stone-300"><b className="text-cyan-200">分镜状态：</b>{shotPlanRows.length ? `规划 ${shotPlanRows.length} 行` : "尚未规划"} · {shots.length ? `${shots.length} 镜头` : "未生成"}</div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-[11px] leading-5 text-stone-300"><b className="text-purple-200">关键帧：</b>{Object.values(shotKeyframes).filter(x => x?.images?.length).length}/{shots.length || 0} · {Object.keys(visualLocks || {}).filter(k => visualLocks[k]?.description).length} 个锁定</div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-[11px] leading-5 text-stone-300"><b className="text-emerald-200">交付：</b>{lastArchiveId ? `已封存 ${lastArchiveId}` : "待封存"} · {qualityReport ? "已有审片报告" : "待审片"}</div>
          </div>
        </div>

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
                  <button onClick={handlePromptOnlyProduction} disabled={isOneClickRunning || isGenerating} className="rounded-2xl bg-emerald-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black disabled:opacity-50">Prompt Only / 只生成提示词</button><button onClick={handleFullVisualProduction} disabled={isOneClickRunning || isGenerating} className="rounded-2xl border border-cyan-300/25 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-cyan-200 disabled:opacity-50">Full Visual / 含图片流程</button>
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
                <GlassPanel title="Script Import Lab" subTitle="Word剧本文档导入分析室" defaultOpen>
            <div className="space-y-5">
              <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/5 p-4 text-[12px] leading-6 text-stone-300">支持 .docx / .txt / .md。导入后可分析人物、场景、对白、情绪曲线、分场结构，并写入剧本与创作圣经。</div>
              <FormField label="Import Script Document" zh="导入Word剧本"><input type="file" accept=".docx,.txt,.md,.markdown" onChange={handleScriptDocumentUpload} className="block w-full rounded-2xl border border-white/10 bg-black/70 px-5 py-3 text-sm text-white file:mr-4 file:rounded-xl file:border-0 file:bg-amber-400 file:px-4 file:py-2 file:text-xs file:font-black file:text-black" /></FormField>
              {scriptImportMeta?.name && <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-[11px] leading-6 text-stone-300"><b className="text-amber-200">{scriptImportMeta.name}</b><br />Type: {scriptImportMeta.type} · Parser: {scriptImportMeta.parser} · Text: {scriptImportText.length} chars</div>}
              <FormField label="Imported Script Text" zh="导入文本预览/可手动粘贴"><TextArea value={scriptImportText} onChange={e => setScriptImportText(e.target.value)} rows={6} placeholder="也可以直接粘贴剧本文档正文。" /></FormField>
              <div className="flex flex-wrap gap-3">
                <button onClick={handleAnalyzeImportedScript} disabled={isAnalyzingImportedScript || isImportingScript || !scriptImportText.trim()} className="rounded-2xl bg-cyan-400 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black disabled:opacity-50">Analyze Script / 分析剧本</button>
                <button onClick={handleApplyImportedScriptToBible} disabled={!scriptImportText.trim()} className="rounded-2xl border border-amber-300/20 bg-amber-400/10 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-amber-200 disabled:opacity-40">Apply to Bible / 写入创作圣经</button>
                <button onClick={handleGenerateShotPlanFromImport} disabled={!scriptImportText.trim() || isPlanningShots} className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-emerald-200 disabled:opacity-40">Shot Plan From Script / 从文档规划分镜</button>
              </div>
              {scriptImportScenes.length > 0 && <FormField label="Scene Selection" zh="选择生成范围"><Select items={["all", ...scriptImportScenes.map((s, i) => String(s.sceneId || s.id || s.index || i + 1))]} value={selectedImportScene} onChange={setSelectedImportScene} /></FormField>}
              {scriptImportAnalysis && <div className="rounded-3xl border border-white/10 bg-black/40 p-5"><div className="text-[11px] font-black uppercase tracking-[0.24em] text-cyan-200">Script Analysis Report / 剧本分析报告</div><div className="mt-3 whitespace-pre-wrap text-[12px] leading-6 text-stone-300">{summarizeImportedScriptAnalysis(scriptImportAnalysis) || scriptImportAnalysis.analysisReport || "已完成分析。"}</div>{scriptImportScenes.length > 0 && <div className="mt-4 grid grid-cols-1 gap-2">{scriptImportScenes.slice(0, 8).map((s, i) => <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[11px] leading-5 text-stone-300"><b className="text-amber-200">{s.titleZh || s.titleEn || `Scene ${i + 1}`}</b><br />{s.storyFunction || s.emotionalBeat || s.rawTextSummary || "分场信息"}</div>)}</div>}</div>}
            </div>
          </GlassPanel>
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
                    <FormField label="Content Mode" zh="内容增强模式"><Select items={OPT.contentEngineModes} value={tech.contentEngineMode} onChange={v => setTech(p => ({ ...p, contentEngineMode: v }))} /></FormField>
                    <FormField label="Prompt Strength" zh="提示词强度"><Select items={OPT.promptStrengthLevels} value={tech.promptStrength} onChange={v => setTech(p => ({ ...p, promptStrength: v }))} /></FormField>
                    <FormField label="Prompt Length" zh="提示词长度"><Select items={OPT.promptLengthModes} value={tech.promptLength} onChange={v => setTech(p => ({ ...p, promptLength: v }))} /></FormField>
                    <FormField label="Rewrite Mode" zh="提示词改写方向"><Select items={OPT.promptRewriteModes} value={tech.promptRewriteMode} onChange={v => setTech(p => ({ ...p, promptRewriteMode: v }))} /></FormField>
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
              <button onClick={handleGenerateOutline} disabled={isGeneratingOutline} className="w-full rounded-2xl bg-amber-400 px-4 py-3 text-[11px] font-black uppercase text-black disabled:opacity-50">{isGeneratingOutline ? "Writing... / 生成中" : "Generate Outline / 生成大纲"}</button><FormField label="Outline Rewrite Mode" zh="大纲打磨方向"><Select items={OPT.outlineRewriteModes} value={outlineRewriteMode} onChange={setOutlineRewriteMode} /></FormField><button onClick={handleRewriteOutline} disabled={isGeneratingOutline || !(outlineDraft || script || ideaInput)} className="w-full rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-[11px] font-black uppercase text-amber-100 disabled:opacity-40">Rewrite Outline / 打磨大纲</button>
              {outlineDraft && <button onClick={handleConfirmOutline} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase text-white">Confirm Outline / 确认大纲</button>}
              <FormField label="Script & Creative Bible" zh="剧本圣经"><TextArea value={script} onChange={e => setScript(e.target.value)} rows={6} /></FormField>
              <FormField label="Negative Prompt" zh="负面提示词"><TextArea value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} rows={3} /></FormField><div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4"><div className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">Character Lock / 角色一致性锁</div><div className="mt-3 grid grid-cols-1 gap-3"><Input value={characterLock.name} onChange={e => setCharacterLock(p => ({ ...p, name: e.target.value }))} placeholder="姓名 / Name" /><Input value={characterLock.appearance} onChange={e => setCharacterLock(p => ({ ...p, appearance: e.target.value }))} placeholder="外貌 / Appearance" /><Input value={characterLock.wardrobe} onChange={e => setCharacterLock(p => ({ ...p, wardrobe: e.target.value }))} placeholder="服装 / Wardrobe" /><TextArea value={characterLock.fixedTraits} onChange={e => setCharacterLock(p => ({ ...p, fixedTraits: e.target.value }))} rows={2} placeholder="不能改变的特征 / Fixed traits" /></div></div><div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4"><div className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200">Location Lock / 场景一致性锁</div><div className="mt-3 grid grid-cols-1 gap-3"><Input value={locationLock.mainLocation} onChange={e => setLocationLock(p => ({ ...p, mainLocation: e.target.value }))} placeholder="主场景 / Main location" /><Input value={locationLock.time} onChange={e => setLocationLock(p => ({ ...p, time: e.target.value }))} placeholder="时间 / Time" /><Input value={locationLock.color} onChange={e => setLocationLock(p => ({ ...p, color: e.target.value }))} placeholder="色调 / Color" /><Input value={locationLock.props} onChange={e => setLocationLock(p => ({ ...p, props: e.target.value }))} placeholder="关键道具 / Key props" /><TextArea value={locationLock.screenDirection} onChange={e => setLocationLock(p => ({ ...p, screenDirection: e.target.value }))} rows={2} placeholder="空间方向 / Screen direction" /></div></div>
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
              <FormField label="Optimization Mode" zh="优化模式"><Select items={OPT.shotOptimizeModes} value={shotOptimizationMode} onChange={setShotOptimizationMode} /></FormField><FormField label="Prompt Refine Mode" zh="一键提示词精修"><Select items={OPT.promptRefineModes} value={promptRefineMode} onChange={setPromptRefineMode} /></FormField><button onClick={() => handleQuickRefineCurrentPrompt()} disabled={!active} className="w-full rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-[11px] font-black uppercase text-cyan-100 disabled:opacity-40">Quick Refine Prompt / 一键精修提示词</button><div className="grid grid-cols-2 gap-2"><button onClick={() => handleQuickRefineCurrentPrompt(OPT.promptRefineModes[1])} disabled={!active} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white disabled:opacity-40">动作稳定</button><button onClick={() => handleQuickRefineCurrentPrompt(OPT.promptRefineModes[2])} disabled={!active} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white disabled:opacity-40">人物表演</button><button onClick={() => handleQuickRefineCurrentPrompt(OPT.promptRefineModes[3])} disabled={!active} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white disabled:opacity-40">连续性</button><button onClick={() => handleQuickRefineCurrentPrompt(OPT.promptRefineModes[4])} disabled={!active} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white disabled:opacity-40">可灵适配</button></div>
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
              <div className="rounded-2xl border border-white/10 bg-black/35 p-5 text-center"><div className="text-5xl font-black text-amber-400">{qualityReport?.score || qualityScore}%</div><div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">Quality Stability</div><button onClick={handleRunQualityCheck} disabled={isCheckingQuality} className="mt-4 w-full rounded-2xl bg-amber-400 px-4 py-3 text-[11px] font-black uppercase text-black disabled:opacity-50">{isCheckingQuality ? "Checking... / 检查中" : "Run Quality Check / 生成质量报告"}</button></div><div className="grid grid-cols-1 gap-3"><button onClick={handleRunShotSimilarityCheck} disabled={!shots.length} className="rounded-2xl border border-purple-300/20 bg-purple-400/10 px-4 py-3 text-[11px] font-black uppercase text-purple-100 disabled:opacity-40">Shot Similarity Check / 镜头重复检测</button><button onClick={handleRunFilmRiskEstimate} disabled={!shots.length} className="rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-[11px] font-black uppercase text-red-100 disabled:opacity-40">Final Video Risk / 成片风险预估</button></div>{shotSimilarityReport && <div className="rounded-2xl border border-purple-300/20 bg-purple-400/10 p-4"><div className="text-[10px] font-black uppercase tracking-widest text-purple-200">Shot Similarity / 镜头重复检测 · {shotSimilarityReport.score}/100 · {shotSimilarityReport.risk}</div><div className="mt-2 text-[11px] text-stone-300">{shotSimilarityReport.summaryZh}</div><div className="mt-3 space-y-2 max-h-[180px] overflow-y-auto">{shotSimilarityReport.issues.slice(0,6).map((x,i)=><div key={i} className="rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] text-stone-300">{x.zh}</div>)}</div></div>}{filmRiskReport && <div className="rounded-2xl border border-red-300/20 bg-red-400/10 p-4"><div className="text-[10px] font-black uppercase tracking-widest text-red-200">Final Video Risk / 成片风险 · {filmRiskReport.score}/100 · {filmRiskReport.risk}</div><div className="mt-2 text-[11px] text-stone-300">{filmRiskReport.summaryZh}</div><div className="mt-3 space-y-2 max-h-[180px] overflow-y-auto">{filmRiskReport.risks.slice(0,6).map((x,i)=><div key={i} className="rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] text-stone-300">Shot {x.shot} · {x.zh}</div>)}</div></div>}
              {qualityReport && <div className="rounded-2xl border border-white/10 bg-black/40 p-4"><div className="whitespace-pre-wrap text-[11px] leading-6 text-stone-300">{qualityReport.summaryZh || qualityReport.summaryEn}</div>{qualityReport.promptQuality && <div className="mt-3 rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-[11px] text-emerald-100">Prompt Quality Engine / 提示词质量引擎：{qualityReport.promptQuality.score}/100 · {qualityReport.promptQuality.summaryZh}</div>}{Array.isArray(qualityReport.problems) && <div className="mt-3 space-y-2 max-h-[240px] overflow-y-auto">{qualityReport.problems.slice(0, 8).map((p, i) => <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3"><div className="text-[10px] font-black text-red-300">{p.level || "Note"} · Shot {p.shot || "-"}</div><div className="mt-1 text-[11px] text-stone-300">{p.zh || p.en}</div><div className="mt-1 text-[10px] text-stone-500">{p.fixZh || p.fixEn}</div></div>)}</div>}</div>}
            </div>}
          </div>
        </GlassPanel>
      </aside>
    </div>
  </> });

}