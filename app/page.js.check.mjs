"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
const NL = "\n";
const AUTO = "AI_AUTO / AI 自动逐镜设计";
const DEEPSEEK_V4_MODELS = ["deepseek-v4-flash", "deepseek-v4-pro"];
const BUILD_VERSION = "V10.6 CANVAS API KEY HOTFIX PRO · 北极星AIGC电影级工业系统 · 画布启动向导 · 即梦/可灵密钥接入 · 任务队列 · 时间线";
const LEGACY_LOCAL_STORAGE_KEYS = ["polaris_aigc_cinema_v8_director_canvas_workspace_store", "polaris_aigc_cinema_v9_6_visual_workflow_studio_store", "polaris_aigc_cinema_v9_9_infinite_canvas_studio_store", "polaris_aigc_cinema_v9_9_1_libtv_bugfix_canvas_studio_store", "polaris_aigc_cinema_v10_1_canvas_workflow_pro_store", "polaris_aigc_cinema_v10_2_canvas_workflow_pro_store", "polaris_aigc_cinema_v10_3_canvas_pan_workflow_store", "polaris_aigc_cinema_v10_4_deepseek_page_repair_store", "polaris_aigc_cinema_v10_5_canvas_api_key_workflow_store", "polaris_aigc_cinema_v10_5_1_canvas_api_key_hotfix_store"];
const LOCAL_STORAGE_KEY = "polaris_aigc_cinema_v10_6_canvas_model_camera_workflow_store";
const ENGINEER_NAME = "Haley黄衍衔";
const ENGINEER_ROLE = "Chief Engineer / 总工程师";
const AUTH_SEAL_ID = "POLARIS-HYX-V10-5-1-AUTHENTIC-CHIEF-ENGINEER-SEAL";
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
    imageApiProviders: ["Jimeng Image Agent / 即梦生图智能体", "Kling Image Agent / 可灵生图智能体", "Volcengine Seedream / 火山即梦 Seedream", "Custom Image API / 自定义图片接口", "OpenAI Images / OpenAI 生图"],
    imageApiModels: ["jimeng-image-agent", "kling-image-agent", "doubao-seedream-5-0-260128", "doubao-seedream-5-0-lite", "doubao-seedream-4-5-251128", "doubao-seedream-4-0-250828", "custom-image-model", "gpt-image-1"],
    videoApiProviders: ["Jimeng Video Agent / 即梦视频智能体", "Kling Video Agent / 可灵视频智能体", "Volcengine Seedance / 火山方舟 Seedance", "Custom Video Agent / 自定义视频智能体"],
    videoApiModels: ["jimeng-video-agent", "kling-video-agent", "doubao-seedance-2-0-pro-260511", "doubao-seedance-2-0-lite-260511", "doubao-seedance-1-5-pro-251215", "doubao-seedance-1-0-lite-i2v-250428", "custom-video-agent"],
    videoApiResolutions: ["480p", "720p", "1080p"],
    videoApiDurations: ["3", "4", "5", "6", "8", "10", "12"],
    videoApiRatios: ["adaptive", "16:9", "9:16", "1:1", "4:3", "3:4", "21:9"],
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
    if (!v)
        return { zh: fallback, en: fallback };
    if (typeof v === "string")
        return { zh: v, en: v };
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
            if (parsed && typeof parsed === "object")
                return parsed;
        }
        catch (_) { }
    }
    if (fallback !== null)
        return fallback;
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
    }
    catch (_) {
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
        }
        catch (err) {
            window.prompt("Copy manually / 请手动复制", text);
            return false;
        }
        finally {
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
    if (typeof window === "undefined")
        throw new Error("Browser environment required / 需要浏览器环境");
    if (window.mammoth?.extractRawText)
        return window.mammoth;
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
    if (!window.mammoth?.extractRawText)
        throw new Error("DOCX parser unavailable / DOCX解析器不可用，请转成TXT粘贴");
    return window.mammoth;
}
async function extractScriptDocumentText(file) {
    if (!file)
        throw new Error("No file selected / 未选择文件");
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
    if (ext === "doc")
        throw new Error("暂不支持旧版 .doc，请另存为 .docx 或复制为 TXT 再导入 / .doc is not supported; please convert to .docx or paste TXT");
    throw new Error("Unsupported file type / 仅支持 .docx、.txt、.md");
}
function summarizeImportedScriptAnalysis(analysis = {}) {
    if (!analysis || typeof analysis !== "object")
        return "";
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
    for (let i = 0; i < s.length; i += 1)
        hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
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
    if (!hasAnyInput)
        return "";
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
    if (outlineText)
        authorityLines.push(`已生成/待确认大纲（只能作为客户输入的派生内容）/ Derived outline:\n${outlineText}`);
    if (scriptText)
        authorityLines.push(`当前剧本圣经（若与客户输入冲突则忽略冲突部分）/ Current script bible, subordinate to client input:\n${scriptText}`);
    if (importedText)
        authorityLines.push(`导入文档上下文（若与客户输入冲突则以客户输入为准）/ Imported document context, subordinate to client input:\n${importedText.slice(0, 6000)}`);
    if (referenceText)
        authorityLines.push(`参考链接/手动参考内容（按参考用途使用，不可覆盖客户输入）/ Reference context:\n${referenceText.slice(0, 5000)}`);
    return authorityLines.join(NL);
}
function resolveAuthoritativeScript({ scriptOverride = null, script = "", ideaInput = "", outlineDraft = "", importedScriptContext = "", referenceContext = "" } = {}) {
    const overrideText = (typeof scriptOverride === "string") ? scriptOverride.trim() : "";
    const ideaText = String(ideaInput || "").trim();
    const scriptText = String(script || "").trim();
    const outlineText = String(outlineDraft || "").trim();
    const importedText = String(importedScriptContext || "").trim();
    const referenceText = String(referenceContext || "").trim();
    if (!overrideText && !ideaText && !scriptText && !outlineText && !importedText && !referenceText)
        return "";
    if (overrideText)
        return buildClientAuthorityBlock({ idea: ideaText, script: overrideText, outline: outlineText, imported: importedText, reference: referenceText });
    if (ideaText)
        return buildClientAuthorityBlock({ idea: ideaText, script: scriptText, outline: outlineText, imported: importedText, reference: referenceText });
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
    if (!m)
        return { min: 8, max: 16 };
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
    }
    else if (modeKey.includes("Range Count")) {
        const r = parseRange(tech.shotRange);
        min = r.min;
        max = r.max;
        target = Math.max(min, Math.min(max, Math.round((min + max) / 2 + complexityBoost / 2)));
    }
    else if (modeKey.includes("Minimum Coverage")) {
        min = Math.max(8, (tech.minimumCoverage || []).length);
        max = min + Math.max(4, Math.round(min * 0.6));
        target = Math.min(max, min + Math.ceil(coverageNeed / 2) + 2);
    }
    else if (modeKey.includes("Auto Director Count")) {
        target = Math.max(4, durationBaseCount);
        min = Math.max(4, target - 2);
        max = target + 4;
    }
    else {
        const r = parseRange(tech.shotRange || "8-16");
        min = r.min;
        max = r.max;
        target = Math.max(min, Math.min(max + (tech.allowAddMissingShots ? 4 : 0), durationBaseCount));
        if (target > max && !tech.allowAddMissingShots)
            target = max;
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
    if ((tech.shotCountMode || "").includes("Fixed Count"))
        return `SHOT COUNT MODE: Fixed Count. Generate exactly ${plan.target} shots.`;
    if ((tech.shotCountMode || "").includes("Range Count"))
        return `SHOT COUNT MODE: Range Count. Generate between ${plan.min} and ${plan.max} shots, target around ${plan.target}.`;
    if ((tech.shotCountMode || "").includes("Minimum Coverage"))
        return `SHOT COUNT MODE: Minimum Coverage. Ensure these coverage roles appear: ${coverage}. Use at least ${plan.min} shots and add more only if needed.`;
    if ((tech.shotCountMode || "").includes("Auto Director Count"))
        return `SHOT COUNT MODE: Auto Director Count. Based on duration ${tech.videoDuration} and density ${tech.shotDensity}, choose a director-appropriate count around ${plan.target} shots (acceptable range ${plan.min}-${plan.max}).`;
    return `SHOT COUNT MODE: Smart Range. Prefer ${plan.min}-${plan.max} shots, target around ${plan.target}. Coverage checklist: ${coverage}. ${tech.allowAddMissingShots ? "You may add necessary shots if key coverage is missing, but explain via narrativeFunction and coveragePlan." : "Do not exceed the range."}`;
}
function shotPlanRowsText(rows = []) {
    if (!Array.isArray(rows) || !rows.length)
        return "No preflight shot plan has been generated yet. / 尚未生成正式分镜规划表。";
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
    if (!ref)
        return "No reference content supplied / 未提供参考内容";
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
    if (!viral?.enabled)
        return "Douyin Viral Logic disabled / 未启用抖音爆款思维";
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
    const isEventObject = scriptOverride && typeof scriptOverride === "object" && ("nativeEvent" in scriptOverride ||
        "preventDefault" in scriptOverride ||
        ("target" in scriptOverride && "currentTarget" in scriptOverride));
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
function pick(raw, keys, fallback = "") { for (const k of keys)
    if (raw?.[k])
        return raw[k]; return fallback; }
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
        const header = ["shot", "titleZh", "titleEn", "keyframeMomentZh", "keyframeMomentEn", "sceneImagePromptZh", "sceneImagePromptEn", "negativeZh", "negativeEn", "continuityZh", "continuityEn", "fullPrompt"].map(csvCell).join(",");
        const rows = prepared.map(s => [s.index, s.titleZh, s.titleEn, s.keyframeMomentZh, s.keyframeMomentEn, s.sceneImagePromptZh, s.sceneImagePromptEn, s.sceneImageNegativeZh, s.sceneImageNegativeEn, s.sceneImageContinuityNotesZh, s.sceneImageContinuityNotesEn, s.finalSceneImagePrompt].map(csvCell).join(","));
        return [header, ...rows].join(NL);
    }
    return prepared.map(s => [`# Shot ${s.index} / ${s.titleZh} / ${s.titleEn}`, s.finalSceneImagePrompt].join(NL)).join(`${NL}${NL}---${NL}${NL}`);
}
function promptLengthLimit(text, mode = "Detailed / 详细版") {
    const t = String(text || "").replace(/\n{3,}/g, "\n\n").trim();
    if (mode.includes("Short"))
        return t.slice(0, 900);
    if (mode.includes("Standard"))
        return t.slice(0, 1800);
    if (mode.includes("Detailed"))
        return t.slice(0, 3200);
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
            if (indexes.length >= 3)
                issues.push({ type, value, shots: indexes, zh: `${type}「${value}」连续/高频出现 ${indexes.length} 次，建议增加插入、反应、静态特写或空镜变化。`, en: `${type} "${value}" appears ${indexes.length} times; vary coverage with inserts, reactions, locked-off close-ups or cutaways.` });
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
        if (/文字|招牌|字幕|logo|标志|neon sign|signboard|text|logo/i.test(text))
            risks.push({ shot: index, level: "Medium", zh: "画面含文字/招牌/Logo，AI 视频容易生成乱码或变形，建议描述为“模糊色块/不可读标识”。", en: "Readable text/signage/logo may become garbled; describe as blurred color blocks or unreadable signage." });
        if (/人群|crowd|街头|market|traffic|车辆|车流/i.test(text))
            risks.push({ shot: index, level: "Medium", zh: "复杂人群/车流容易出现穿模、鬼影和物理错误，建议降低人数并明确主体。", en: "Crowds/traffic can create ghosts and physics errors; reduce extras and clarify the subject." });
        if (/手|手指|拿|握|递|hand|finger|hold/i.test(text))
            risks.push({ shot: index, level: "Medium", zh: "手部动作风险较高，建议用简单动作、避免多次递交或复杂抓握。", en: "Hand actions are risky; keep simple and avoid complex handoffs or grips." });
        if (/旋转|奔跑|跳跃|打斗|爆炸|快速|whip|fight|run|jump|explosion/i.test(text))
            risks.push({ shot: index, level: "High", zh: "高速运动/动作戏风险较高，建议拆成多个短镜头并降低运动幅度。", en: "Fast action is high-risk; split into shorter shots and reduce motion amplitude." });
        if (!s.actionStartZh || !s.actionEndZh)
            risks.push({ shot: index, level: "Medium", zh: "缺少明确开始/结束动作，视频模型容易漂移。", en: "Missing start/end action; video model may drift." });
    });
    const high = risks.filter(r => r.level === "High").length;
    const score = Math.max(35, 100 - high * 15 - (risks.length - high) * 6);
    return { score, risk: high ? "High" : risks.length ? "Medium" : "Low", risks, summaryZh: risks.length ? `成片预估发现 ${risks.length} 个生成风险，建议先处理高风险镜头。` : "成片预估风险较低，适合进入生成测试。", summaryEn: risks.length ? `${risks.length} generation risks found; fix high-risk shots first.` : "Estimated production risk is low." };
}
function buildLockText(lock = {}, type = "character") {
    const entries = Object.entries(lock || {}).filter(([, v]) => String(v || "").trim());
    if (!entries.length)
        return "";
    const label = type === "location" ? "场景一致性锁 / Location Lock" : "角色一致性锁 / Character Lock";
    return `${label}: ${entries.map(([k, v]) => `${k}=${v}`).join("；")}`;
}
function applyConsistencyLocksToShot(shot = {}, characterLock = {}, locationLock = {}) {
    const c = buildLockText(characterLock, "character");
    const l = buildLockText(locationLock, "location");
    const locks = [c, l].filter(Boolean).join("\n");
    if (!locks)
        return shot;
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
    if (!img)
        return "";
    if (img.url)
        return img.url;
    if (img.b64_json)
        return `data:${img.mime || "image/png"};base64,${img.b64_json}`;
    if (img.b64)
        return `data:${img.mime || "image/png"};base64,${img.b64}`;
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
    if (/城市|街|风景|航拍|建筑|city|street|landscape|drone/.test(text)) {
        model = "Runway / Luma / Sora-Veo";
        modeZh = "文生视频或图生视频均可";
        risk = "Medium";
        reasonZh = "场景建立镜头更依赖氛围、光影和空间运动，适合高质量视频模型。";
    }
    if (/特写|close-up|portrait|脸|眼睛|表情|reaction/.test(text)) {
        model = "Image-to-Video First / 图生视频优先";
        modeZh = "必须先锁定关键帧";
        risk = "High";
        reasonZh = "人物脸部、表情和眼神一致性风险高，建议先生成关键帧再图生视频。";
    }
    if (/产品|logo|包装|咖啡|商品|product|packaging/.test(text)) {
        model = "Jimeng / 可灵 / 图生视频";
        modeZh = "图生视频优先";
        risk = "High";
        reasonZh = "产品比例、包装和反光容易漂移，必须用关键帧和负面提示锁定。";
    }
    if (/群像|人群|crowd|battle|dance|fight|动作/.test(text)) {
        model = "Kling / Sora-Veo";
        modeZh = "拆分动作后生成";
        risk = "High";
        reasonZh = "多人动作容易穿模和鬼影，建议拆成更短镜头或先生成首帧。";
    }
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
    return ["北极星AIGC电影级工业系统 V10.6 · Image-to-Video Production Pack", `Chief Engineer / 总工程师：${ENGINEER_NAME}`, `Generated At / 生成时间：${new Date().toLocaleString()}`, "", "## Visual Locks / 视觉锁定", JSON.stringify(visualLocks, null, 2), "", "## Shot Packs / 镜头包", rows.join(`${NL}${NL}---${NL}${NL}`)].join(NL);
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
      <h1>${escapeHtml(project)}<br/>北极星AIGC电影级工业系统 V10.6</h1>
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
    <div class="footer"><b>Powered by 北极星AIGC电影级工业系统 V10.6</b><br/>Chief Engineer / 总工程师：${escapeHtml(ENGINEER_NAME)}<br/>Authentic Seal：${escapeHtml(AUTH_SEAL_ID)}<br/>Production Package Archive ID：${escapeHtml(archiveId)}</div>
  </body></html>`;
    const blob = new Blob([content], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName(project)}_Polaris_V10_4_Production_Package.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function downloadPromptPack(shots, project) {
    const content = buildPurePromptPack(shots, project);
    downloadTextFile(`${safeName(project)}_Polaris_V10_4_Prompt_Pack.txt`, content, "text/plain;charset=utf-8");
}
const GlassPanel = ({ children, title, subTitle, className = "", defaultOpen = false }) => {
    const titleText = String(title || "");
    const shouldOpen = defaultOpen || titleText.startsWith("01");
    if (!title) {
        return _jsx("div", { className: `rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl p-6 shadow-2xl ${className}`, children: children });
    }
    return (_jsxs("details", { open: shouldOpen, className: `group rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden ${className}`, children: [_jsxs("summary", { className: "list-none cursor-pointer select-none px-6 py-5 border-b border-white/5 flex items-center justify-between gap-4 hover:bg-white/[0.03]", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("h3", { className: "text-[12px] font-black uppercase tracking-[0.22em] text-amber-300", children: [title, " ", _jsx("span", { className: "text-stone-500 ml-2 text-[11px]", children: subTitle })] }), _jsx("div", { className: "mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-600", children: "Click to expand / \u70B9\u51FB\u5C55\u5F00\u6216\u6536\u8D77" })] }), _jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [_jsx("div", { className: "hidden sm:block h-1 w-8 rounded-full bg-amber-400/20" }), _jsx("div", { className: "h-9 w-9 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-amber-300 transition-transform duration-300 group-open:rotate-180", children: "\u2304" })] })] }), _jsx("div", { className: "p-6", children: children })] }));
};
const FormField = ({ label, zh, children }) => _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-[11px] font-black uppercase tracking-widest text-stone-500", children: [label, " ", _jsx("span", { className: "text-[13px] opacity-80 ml-1", children: zh })] }), children] });
const normalizeControlValue = (value) => {
    if (value == null)
        return "";
    if (typeof value === "string" || typeof value === "number")
        return value;
    return String(value);
};
const isEditableTarget = (target) => {
    const tag = String(target?.tagName || "").toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || Boolean(target?.isContentEditable) || Boolean(target?.closest?.("input, textarea, select, [contenteditable='true']"));
};
const Input = ({ className = "", value = "", onChange, onKeyDown, onInput, ...props }) => (_jsx("input", { ...props, value: normalizeControlValue(value), onChange: e => onChange?.(e), onInput: e => onInput?.(e), onKeyDown: e => onKeyDown?.(e), className: `w-full bg-black/70 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-stone-700 outline-none focus:border-amber-300/50 ${className}` }));
const TextArea = ({ className = "", value = "", onChange, onKeyDown, onInput, ...props }) => (_jsx("textarea", { ...props, value: normalizeControlValue(value), onChange: e => onChange?.(e), onInput: e => onInput?.(e), onKeyDown: e => onKeyDown?.(e), className: `w-full bg-black/70 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-stone-700 outline-none focus:border-amber-300/50 min-h-[100px] leading-relaxed ${className}` }));
const parseSelectLabel = (raw = "") => {
    const label = String(raw ?? "").trim();
    const parts = label.split(/\s+\/\s+/).map(x => x.trim()).filter(Boolean);
    if (parts.length <= 1)
        return { primary: label || "No option", secondary: "" };
    const [first, ...rest] = parts;
    const secondary = rest.join(" / ");
    return { primary: first, secondary };
};
const normalizeSelectOption = (item, index = 0) => {
    if (item && typeof item === "object") {
        const value = String(item.value ?? item.id ?? item.name ?? item.label ?? index);
        const label = String(item.label ?? item.name ?? item.title ?? value);
        return { value, label, disabled: Boolean(item.disabled), meta: item.meta || item.desc || item.description || "" };
    }
    const value = String(item ?? "");
    return { value, label: value, disabled: false, meta: "" };
};
const Select = ({ items = [], value, onChange, placeholder = "Select / 请选择", searchable = true, className = "" }) => {
    const buttonRef = useRef(null);
    const searchRef = useRef(null);
    const listRef = useRef(null);
    const safeItems = useMemo(() => (Array.isArray(items) ? items : []).map(normalizeSelectOption), [items]);
    const fallbackValue = safeItems[0]?.value ?? "";
    const safeValue = safeItems.some(item => item.value === String(value ?? "")) ? String(value ?? "") : String(value ?? fallbackValue);
    const selected = safeItems.find(item => item.value === safeValue) || safeItems[0];
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [rect, setRect] = useState(null);
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q)
            return safeItems;
        return safeItems.filter(item => `${item.label} ${item.value} ${item.meta}`.toLowerCase().includes(q));
    }, [safeItems, query]);
    const updateRect = () => {
        const r = buttonRef.current?.getBoundingClientRect?.();
        if (!r)
            return;
        setRect({ top: r.top, bottom: r.bottom, left: r.left, width: r.width, height: r.height });
    };
    const close = () => {
        setOpen(false);
        setQuery("");
        setActiveIndex(Math.max(0, safeItems.findIndex(item => item.value === safeValue)));
    };
    const choose = (item) => {
        if (!item || item.disabled)
            return;
        onChange?.(item.value);
        close();
        requestAnimationFrame(() => buttonRef.current?.focus?.());
    };
    useEffect(() => {
        if (!open)
            return;
        updateRect();
        const selectedIndex = Math.max(0, safeItems.findIndex(item => item.value === safeValue));
        setActiveIndex(selectedIndex);
        const onGlobalPointer = (event) => {
            if (buttonRef.current?.contains(event.target) || listRef.current?.contains(event.target))
                return;
            close();
        };
        const onGlobalKey = (event) => {
            if (event.key === "Escape")
                close();
        };
        const onScrollOrResize = () => updateRect();
        document.addEventListener("mousedown", onGlobalPointer, true);
        window.addEventListener("keydown", onGlobalKey);
        window.addEventListener("resize", onScrollOrResize);
        window.addEventListener("scroll", onScrollOrResize, true);
        const t = setTimeout(() => searchRef.current?.focus?.(), 30);
        return () => {
            clearTimeout(t);
            document.removeEventListener("mousedown", onGlobalPointer, true);
            window.removeEventListener("keydown", onGlobalKey);
            window.removeEventListener("resize", onScrollOrResize);
            window.removeEventListener("scroll", onScrollOrResize, true);
        };
    }, [open, safeValue, safeItems.length]);
    useEffect(() => {
        if (!open)
            return;
        setActiveIndex(0);
    }, [query, open]);
    const selectedLabel = parseSelectLabel(selected?.label || placeholder);
    const canOpen = safeItems.length > 0;
    const menu = open && rect ? (() => {
        const viewportH = typeof window === "undefined" ? 900 : window.innerHeight;
        const viewportW = typeof window === "undefined" ? 1280 : window.innerWidth;
        const maxWidth = Math.min(Math.max(rect.width, 360), Math.max(320, viewportW - 24));
        const left = Math.min(Math.max(12, rect.left), Math.max(12, viewportW - maxWidth - 12));
        const openAbove = rect.bottom + 390 > viewportH && rect.top > 390;
        const top = openAbove ? Math.max(12, rect.top - 10) : Math.min(viewportH - 12, rect.bottom + 10);
        const transform = openAbove ? "translateY(-100%)" : "none";
        return createPortal(_jsxs("div", { ref: listRef, className: "polaris-select-menu fixed rounded-[1.35rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] ring-1 ring-black/5 overflow-hidden", style: { top, left, width: maxWidth, transform, zIndex: 9999999 }, children: [_jsxs("div", { className: "border-b border-slate-100 bg-gradient-to-r from-amber-50 via-white to-cyan-50 p-3", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "truncate text-[11px] font-black uppercase tracking-[0.18em] text-slate-500", children: "Choose Option / \u9009\u62E9\u53C2\u6570" }), _jsx("div", { className: "mt-1 truncate text-sm font-black text-slate-950", children: selected?.label || placeholder })] }), _jsx("button", { type: "button", onClick: close, className: "h-9 w-9 shrink-0 rounded-xl border border-slate-200 bg-white text-lg font-black text-slate-700 hover:bg-slate-50", children: "\u00D7" })] }), searchable && safeItems.length > 6 && _jsxs("div", { className: "mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm", children: [_jsx("span", { className: "text-slate-400", children: "\u2315" }), _jsx("input", { ref: searchRef, value: query, onChange: e => setQuery(e.target.value), onKeyDown: e => {
                                        if (e.key === "ArrowDown") {
                                            e.preventDefault();
                                            setActiveIndex(i => Math.min(filtered.length - 1, i + 1));
                                        }
                                        if (e.key === "ArrowUp") {
                                            e.preventDefault();
                                            setActiveIndex(i => Math.max(0, i - 1));
                                        }
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            choose(filtered[activeIndex]);
                                        }
                                    }, placeholder: "\u641C\u7D22\u4E2D\u6587 / English / \u53C2\u6570", className: "w-full bg-transparent text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none" })] })] }), _jsx("div", { className: "max-h-[320px] overflow-y-auto p-2 polaris-select-options", children: filtered.length ? filtered.map((item, index) => {
                        const label = parseSelectLabel(item.label);
                        const active = index === activeIndex;
                        const picked = item.value === safeValue;
                        return _jsxs("button", { type: "button", disabled: item.disabled, onMouseEnter: () => setActiveIndex(index), onClick: () => choose(item), className: `group flex w-full items-start gap-3 rounded-2xl px-3.5 py-3 text-left transition ${picked ? "bg-slate-950 text-white shadow-lg" : active ? "bg-amber-50 text-slate-950" : "text-slate-800 hover:bg-slate-50"} disabled:cursor-not-allowed disabled:opacity-45`, children: [_jsx("span", { className: `mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-black ${picked ? "border-amber-300 bg-amber-300 text-black" : "border-slate-300 text-slate-400 group-hover:border-amber-300"}`, children: picked ? "✓" : index + 1 }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsx("span", { className: "block break-words text-sm font-black leading-5", children: label.primary }), (label.secondary || item.meta) && _jsx("span", { className: `mt-1 block break-words text-[11px] font-bold leading-5 ${picked ? "text-slate-300" : "text-slate-500"}`, children: label.secondary || item.meta })] })] }, `${item.value}-${index}`);
                    }) : _jsx("div", { className: "rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm font-bold text-slate-500", children: "No matched option / \u6CA1\u6709\u5339\u914D\u9009\u9879" }) })] }), document.body);
    })() : null;
    return (_jsxs("div", { className: `relative ${className}`, children: [_jsxs("button", { ref: buttonRef, type: "button", disabled: !canOpen, onClick: () => { if (!canOpen)
                    return; setOpen(v => !v); requestAnimationFrame(updateRect); }, onKeyDown: e => {
                    if (["Enter", " ", "ArrowDown"].includes(e.key)) {
                        e.preventDefault();
                        if (canOpen)
                            setOpen(true);
                    }
                }, className: `group flex min-h-[58px] w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left outline-none transition ${open ? "border-amber-300 bg-white text-slate-950 shadow-[0_14px_38px_rgba(251,191,36,0.18)] ring-4 ring-amber-200/45" : "border-slate-200 bg-white text-slate-950 shadow-sm hover:border-amber-300 hover:shadow-md"} disabled:cursor-not-allowed disabled:opacity-50`, children: [_jsxs("span", { className: "min-w-0 flex-1", children: [_jsx("span", { className: "block truncate text-[13px] font-black leading-5", children: selectedLabel.primary || placeholder }), _jsx("span", { className: "mt-0.5 block truncate text-[11px] font-bold leading-4 text-slate-500", children: selectedLabel.secondary || `${safeItems.length} options / ${safeItems.length} 个选项` })] }), _jsx("span", { className: `flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition ${open ? "rotate-180 bg-amber-100 text-slate-950" : "group-hover:bg-amber-50"}`, children: "\u2304" })] }), menu] }));
};
const Toggle = ({ checked, onChange, label, zh }) => _jsxs("button", { type: "button", onClick: () => onChange(!checked), className: `w-full rounded-2xl border px-5 py-3 text-left ${checked ? "bg-amber-400 border-amber-400 text-black" : "bg-black/70 border-white/10 text-stone-300"}`, children: [_jsx("div", { className: "text-[11px] font-black uppercase tracking-widest", children: label }), _jsx("div", { className: "text-[11px] opacity-70 mt-1", children: zh })] });
const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);
    return _jsx("button", { type: "button", onClick: async () => {
            const value = text || "";
            try {
                if (navigator?.clipboard?.writeText)
                    await navigator.clipboard.writeText(value);
                else
                    throw new Error("Clipboard API unavailable");
                setCopied(true);
            }
            catch (_) {
                const el = document.createElement("textarea");
                el.value = value;
                el.setAttribute("readonly", "");
                el.style.position = "fixed";
                el.style.left = "-9999px";
                document.body.appendChild(el);
                el.select();
                try {
                    document.execCommand("copy");
                    setCopied(true);
                }
                catch (err) {
                    window.prompt("Copy manually / 请手动复制", value);
                }
                document.body.removeChild(el);
            }
            setTimeout(() => setCopied(false), 1200);
        }, className: "bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest", children: copied ? "Copied / 已复制" : "Copy / 复制" });
};
const ShotRoleBadge = ({ shot, active = false }) => {
    const role = inferShotRole(shot);
    return _jsxs("span", { className: `inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${active ? "border-black/20 bg-black/15 text-black" : "border-amber-300/20 bg-amber-300/10 text-amber-200"}`, children: [role.zh, " \u00B7 ", role.en] });
};
const BrandMark = ({ active = false, progress = 0 }) => {
    const radius = 25;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.max(0, Math.min(100, progress)) / 100) * circumference;
    return (_jsxs("div", { className: "relative h-16 w-16 shrink-0", children: [_jsx("div", { className: "absolute inset-0 rounded-[1.35rem] bg-gradient-to-br from-amber-200 via-yellow-500 to-stone-950 shadow-[0_0_38px_rgba(251,191,36,0.28)]" }), _jsx("div", { className: "absolute inset-[2px] rounded-[1.25rem] bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.38),rgba(255,255,255,0)_34%),linear-gradient(145deg,#1c1917,#050505_58%,#f59e0b)] border border-white/15 flex items-center justify-center overflow-hidden", children: _jsxs("svg", { viewBox: "0 0 64 64", className: "h-10 w-10 drop-shadow-[0_0_12px_rgba(251,191,36,0.45)]", "aria-hidden": "true", children: [_jsx("path", { d: "M32 5l5.9 20.1L58 32l-20.1 6.9L32 59l-5.9-20.1L6 32l20.1-6.9L32 5z", fill: "url(#polarisGold)" }), _jsx("path", { d: "M32 18l2.8 9.2L44 32l-9.2 4.8L32 46l-2.8-9.2L20 32l9.2-4.8L32 18z", fill: "#050505", opacity: "0.88" }), _jsx("circle", { cx: "32", cy: "32", r: "3.6", fill: "#fef3c7" }), _jsx("defs", { children: _jsxs("linearGradient", { id: "polarisGold", x1: "10", y1: "8", x2: "54", y2: "58", gradientUnits: "userSpaceOnUse", children: [_jsx("stop", { stopColor: "#fff7cc" }), _jsx("stop", { offset: "0.42", stopColor: "#fbbf24" }), _jsx("stop", { offset: "1", stopColor: "#92400e" })] }) })] }) }), _jsxs("svg", { className: "absolute -inset-1 h-[72px] w-[72px] -rotate-90", viewBox: "0 0 64 64", "aria-hidden": "true", children: [_jsx("circle", { cx: "32", cy: "32", r: radius, stroke: "rgba(255,255,255,0.08)", strokeWidth: "3", fill: "none" }), _jsx("circle", { cx: "32", cy: "32", r: radius, stroke: "rgba(251,191,36,0.95)", strokeWidth: "3", fill: "none", strokeLinecap: "round", strokeDasharray: circumference, strokeDashoffset: active ? offset : circumference, className: "transition-all duration-500 ease-out" })] }), active && _jsx("div", { className: "absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.95)] animate-pulse" })] }));
};
const EngineerSeal = ({ compact = false }) => (_jsxs("div", { className: compact ? "rounded-3xl border border-amber-300/25 bg-black/45 p-4 shadow-[0_0_50px_rgba(251,191,36,0.12)]" : "pointer-events-none fixed bottom-4 right-4 z-[80] hidden max-w-[280px] rounded-3xl border border-amber-300/25 bg-black/70 p-4 shadow-[0_0_60px_rgba(251,191,36,0.18)] backdrop-blur-2xl lg:block", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-200 via-yellow-500 to-stone-950 text-black shadow-[0_0_28px_rgba(251,191,36,0.25)]", children: [_jsx("span", { className: "text-lg font-black", children: "H" }), _jsx("span", { className: "absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.8)]" })] }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-amber-200", children: "Authentic Engineer Seal" }), _jsx("div", { className: "mt-1 text-sm font-black text-white", children: "Haley\u9EC4\u884D\u8854" }), _jsx("div", { className: "mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400", children: "Chief Engineer / \u603B\u5DE5\u7A0B\u5E08" })] })] }), _jsxs("div", { className: "mt-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2", children: [_jsx("div", { className: "text-[9px] font-black uppercase tracking-[0.22em] text-stone-500", children: AUTH_SEAL_ID }), _jsxs("div", { className: "mt-1 text-[10px] leading-5 text-stone-400", children: ["\u672C\u7F51\u9875\u7531 ", ENGINEER_NAME, " \u8BBE\u8BA1\u4E0E\u603B\u5DE5\u7A0B\u67B6\u6784\u7F72\u540D\u3002"] })] })] }));
const RitualOverlay = ({ ritual, onClose }) => {
    if (!ritual)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/25 px-5 backdrop-blur-md", children: _jsxs("div", { className: "relative w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-amber-200 bg-white p-8 shadow-[0_30px_100px_rgba(15,23,42,0.18)]", children: [_jsx("div", { className: "absolute -right-20 -top-20 h-52 w-52 rounded-full bg-amber-400/10 blur-3xl" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(BrandMark, { active: true, progress: ritual.progress || 100 }), _jsxs("div", { children: [_jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.35em] text-amber-300", children: ritual.kicker || "POLARIS RITUAL" }), _jsx("h3", { className: "mt-2 text-3xl font-black tracking-[0.04em] text-slate-950", children: ritual.title }), _jsx("p", { className: "mt-3 text-sm leading-7 text-slate-600", children: ritual.message })] })] }), _jsxs("div", { className: "mt-7 rounded-3xl border border-white/10 bg-white/5 p-5", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-amber-200", children: "Chief Engineer Seal / \u603B\u5DE5\u7A0B\u5E08\u8BA4\u8BC1" }), _jsx("div", { className: "mt-2 text-xl font-black text-white", children: ENGINEER_NAME }), _jsxs("div", { className: "mt-1 text-[11px] text-stone-500", children: [ENGINEER_ROLE, " \u00B7 ", AUTH_SEAL_ID] })] }), _jsx("div", { className: "mt-7 flex justify-end", children: _jsx("button", { onClick: onClose, className: "rounded-2xl bg-amber-400 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-black hover:bg-amber-300", children: "Continue / \u7EE7\u7EED" }) })] }) }));
};
const ProjectTemplateCard = ({ template, onApply }) => (_jsxs("button", { type: "button", onClick: () => onApply(template), className: "rounded-3xl border border-white/10 bg-white/5 p-5 text-left hover:border-amber-300/40 hover:bg-white/10", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-amber-300", children: "Template / \u6A21\u677F" }), _jsx("div", { className: "mt-3 text-lg font-black text-white", children: template.title }), _jsxs("div", { className: "mt-1 text-[11px] font-bold text-stone-500", children: [template.type, " \u00B7 ", template.duration] }), _jsx("div", { className: "mt-3 line-clamp-3 text-[12px] leading-6 text-stone-400", children: template.idea })] }));
const RitualMotionDeck = ({ apiIsReady, flowProgressPercent = 0, imageCount = 0, taskCount = 0, videoCount = 0, onIgnite, onCanvas }) => {
    const signal = apiIsReady ? "ONLINE" : "STANDBY";
    return (_jsxs("div", { className: "polaris-v92-launch-card mt-4 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-0 shadow-xl shadow-slate-200/60", children: [_jsx("div", { className: "polaris-v92-clapper h-12 border-b border-slate-200" }), _jsxs("div", { className: "relative p-5", children: [_jsx("div", { className: "polaris-v92-scanline" }), _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "polaris-section-title text-amber-600", children: "Studio Launch Sequence / \u5F00\u673A\u4EEA\u5F0F" }), _jsx("h3", { className: "mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950", children: "\u4ECE\u63D0\u793A\u8BCD\u51C6\u5907\u8FDB\u5165\u89C6\u89C9\u751F\u4EA7" }), _jsx("p", { className: "mt-3 text-base leading-7 text-slate-600", children: "\u628A\u201C\u5199\u63D0\u793A\u8BCD\u201D\u7684\u5DE5\u5177\u611F\uFF0C\u5347\u7EA7\u6210\u201C\u5F00\u673A\u3001\u8BD5\u62CD\u3001\u51FA\u7247\u3001\u5C01\u5B58\u201D\u7684\u521B\u4F5C\u4EEA\u5F0F\u611F\u3002\u7528\u6237\u77E5\u9053\u81EA\u5DF1\u6B63\u5728\u8FDB\u5165\u771F\u6B63\u7684\u56FE\u50CF / \u89C6\u9891\u751F\u4EA7\u6D41\u7A0B\u3002" })] }), _jsx("div", { className: `shrink-0 rounded-full px-4 py-2 text-sm font-black ${apiIsReady ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`, children: signal })] }), _jsx("div", { className: "mt-6 grid grid-cols-4 gap-2", children: [
                            ["Prompt", "提示词", apiIsReady],
                            ["Keyframe", "关键帧", imageCount > 0],
                            ["Video", "视频任务", taskCount > 0],
                            ["Delivery", "交付", videoCount > 0],
                        ].map(([en, zh, ready], i) => _jsxs("div", { className: `polaris-v92-ritual-node rounded-2xl border p-3 ${ready ? "is-ready border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-[10px] font-black text-slate-400", children: ["0", i + 1] }), _jsx("span", { className: `h-2.5 w-2.5 rounded-full ${ready ? "bg-emerald-400" : "bg-slate-300"}` })] }), _jsx("div", { className: "mt-2 text-sm font-black text-slate-950", children: en }), _jsx("div", { className: "text-xs font-bold text-slate-500", children: zh })] }, en)) }), _jsxs("div", { className: "mt-6", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-500", children: [_jsx("span", { children: "Production Energy / \u751F\u4EA7\u80FD\u91CF" }), _jsxs("span", { children: [flowProgressPercent, "%"] })] }), _jsx("div", { className: "polaris-v91-progress-track mt-2", children: _jsx("div", { className: "polaris-v92-progress-fill", style: { width: `${Math.max(6, flowProgressPercent)}%` } }) })] }), _jsxs("div", { className: "mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2", children: [_jsx("button", { onClick: onIgnite, className: "polaris-v92-premiere-button rounded-2xl px-5 py-4 text-sm font-black text-white shadow-lg shadow-violet-200", children: "Start Launch / \u5F00\u59CB\u751F\u4EA7\u4EEA\u5F0F" }), _jsx("button", { onClick: onCanvas, disabled: !apiIsReady, className: "rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-40", children: "Open Visual Canvas / \u6253\u5F00\u89C6\u89C9\u753B\u5E03" })] })] })] }));
};
const RitualMotionStrip = ({ apiIsReady, flowHasInput, flowHasPromptPrep, flowHasShots, flowHasImages, flowHasVideoTasks, flowHasVideosDone }) => {
    const items = [
        ["Gate", "连接引擎", apiIsReady, "API / 模型通道已就绪"],
        ["Brief", "创作需求", flowHasInput, "项目、参考、剧本完成输入"],
        ["Bible", "提示词母版", flowHasPromptPrep, "故事核与 Prompt Prep 成型"],
        ["Shots", "镜头试拍", flowHasShots, "镜头卡片进入生产"],
        ["Frames", "关键帧出图", flowHasImages, "Seedream 视觉资产可用"],
        ["Premiere", "视频首映", flowHasVideoTasks || flowHasVideosDone, "即梦 / Seedance 任务已提交"],
    ];
    return (_jsxs("section", { className: "polaris-v92-ceremony-strip mt-6 rounded-[2.6rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60", children: [_jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "polaris-section-title text-amber-600", children: "Creative Ceremony / \u521B\u4F5C\u4EEA\u5F0F\u611F" }), _jsx("h3", { className: "mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950", children: "\u8BA9\u7528\u6237\u50CF\u8FDB\u5165\u5236\u7247\u68DA\u4E00\u6837\u5B8C\u6210\u6BCF\u4E00\u6B65" }), _jsx("p", { className: "mt-2 max-w-4xl text-base leading-8 text-slate-600", children: "\u6BCF\u4E00\u6B65\u90FD\u6709\u660E\u786E\u72B6\u6001\u3001\u52A8\u6548\u53CD\u9988\u548C\u4E0B\u4E00\u6B65\u52A8\u4F5C\uFF1A\u4E0D\u662F\u5DE5\u5177\u5806\u53E0\uFF0C\u800C\u662F\u4E00\u6761\u5B8C\u6574\u7684 AI \u5F71\u89C6\u751F\u4EA7\u7EBF\u3002" })] }), _jsx("div", { className: "rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-black text-amber-700", children: "Director-grade UX" })] }), _jsx("div", { className: "mt-5 grid grid-cols-1 gap-3 md:grid-cols-3 2xl:grid-cols-6", children: items.map(([en, zh, done, desc], i) => _jsxs("div", { className: `polaris-v92-ceremony-card rounded-3xl border p-4 ${done ? "is-done border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-[11px] font-black uppercase tracking-widest text-violet-500", children: [String(i + 1).padStart(2, "0"), " \u00B7 ", en] }), _jsx("div", { className: `h-3 w-3 rounded-full ${done ? "bg-emerald-400" : "bg-slate-300"}` })] }), _jsx("div", { className: "mt-3 text-xl font-black text-slate-950", children: zh }), _jsx("p", { className: "mt-2 text-sm leading-6 text-slate-500", children: desc })] }, en)) })] }));
};
const MiniStat = ({ label, value, tone = "cyan" }) => {
    const toneClass = tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : tone === "emerald"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : tone === "purple"
                ? "border-violet-200 bg-violet-50 text-violet-800"
                : tone === "red"
                    ? "border-rose-200 bg-rose-50 text-rose-800"
                    : "border-cyan-200 bg-cyan-50 text-cyan-800";
    return (_jsxs("div", { className: `rounded-2xl border p-4 ${toneClass}`, children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.22em] opacity-70", children: label }), _jsx("div", { className: "mt-2 text-lg font-black text-slate-950", children: value })] }));
};
const ShotResultCard = ({ shot, index, active, onSelect, onCopyVideo, onCopyScene, onCopyPlatform }) => {
    const role = inferShotRole(shot);
    const score = evaluatePromptQuality(shot)?.score || "--";
    return (_jsxs("button", { type: "button", onClick: onSelect, className: `w-full rounded-3xl border p-5 text-left transition ${active ? "border-amber-300 bg-amber-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-amber-300", children: ["Shot ", index + 1, " \u00B7 ", role.zh] }), _jsx("div", { className: "mt-2 text-base font-black text-white", children: shot.titleZh || `镜头 ${index + 1}` }), _jsx("div", { className: "mt-2 line-clamp-2 text-[12px] leading-6 text-stone-400", children: shot.sceneZh || shot.narrativeFunctionZh || shot.emotionalBeatZh })] }), _jsxs("div", { className: "rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-center", children: [_jsx("div", { className: "text-lg font-black text-emerald-200", children: score }), _jsx("div", { className: "text-[9px] font-black uppercase tracking-widest text-emerald-400/70", children: "Score" })] })] }), _jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [_jsx("span", { className: "rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] text-stone-300", children: shot.duration || "4-6s" }), _jsx("span", { className: "rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] text-stone-300", children: shot.shotSize || "AI Shot Size" }), _jsx("span", { className: "rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] text-stone-300", children: shot.move || "AI Movement" })] }), _jsxs("div", { className: "mt-4 flex flex-wrap gap-2", onClick: e => e.stopPropagation(), children: [_jsx("button", { onClick: onCopyVideo, className: "rounded-xl bg-cyan-300 px-3 py-2 text-[10px] font-black text-black", children: "Copy Video / \u89C6\u9891" }), _jsx("button", { onClick: onCopyScene, className: "rounded-xl bg-emerald-300 px-3 py-2 text-[10px] font-black text-black", children: "Copy Scene" }), _jsx("button", { onClick: () => onCopyPlatform("kling"), className: "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white", children: "\u53EF\u7075" }), _jsx("button", { onClick: () => onCopyPlatform("runway"), className: "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white", children: "Runway" }), _jsx("button", { onClick: () => onCopyPlatform("soraVeo"), className: "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white", children: "Sora/Veo" })] })] }));
};
const ModeSwitchModal = ({ open, cards = [], currentMode = "", apiIsReady = false, onClose, onSelect }) => {
    if (!open || typeof document === "undefined")
        return null;
    const meta = {
        beginner: { tag: "FAST START", zh: "新手快速开片", tone: "emerald", flow: "一句话需求 → 爆款结构 → 一键初稿", desc: "适合第一次使用、快速测试、短视频脚本和低成本 Prompt Only 流程。" },
        pro: { tag: "PRO FLOW", zh: "专业制片流程", tone: "cyan", flow: "参考 → 剧本 → 分镜 → 图像 → 视频", desc: "适合完整项目制作，保留提示词准备，同时把画布作为图像 / 视频生产中心。" },
        director: { tag: "DIRECTOR DECK", zh: "导演级控制台", tone: "amber", flow: "创作核心 → 分镜规划 → 镜头精修 → 审片交付", desc: "适合深度控制镜头、连续性、表演、提示词编译、补镜头和客户交付。" },
    };
    return createPortal(_jsx("div", { className: "polaris-v94-modal fixed inset-0 z-[999998] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-2xl", role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: "polaris-v94-mode-panel relative w-full max-w-6xl overflow-hidden rounded-[3rem] border border-white/40 bg-white p-4 shadow-[0_40px_140px_rgba(15,23,42,.28)]", children: [_jsx("div", { className: "polaris-v94-modal-aura" }), _jsxs("div", { className: "relative z-10 rounded-[2.45rem] border border-slate-200/80 bg-white/82 p-5 backdrop-blur-2xl md:p-7", children: [_jsxs("div", { className: "flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx(BrandMark, { active: apiIsReady, progress: apiIsReady ? 100 : 35 }), _jsxs("div", { children: [_jsx("div", { className: "polaris-v94-kicker", children: "Mode Launch Ceremony / \u6A21\u5F0F\u5F00\u673A\u4EEA\u5F0F" }), _jsx("h3", { className: "mt-2 text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl", children: "\u9009\u62E9\u4F60\u7684\u5236\u4F5C\u8231\u4F4D" }), _jsx("p", { className: "mt-3 max-w-3xl text-base leading-8 text-slate-600", children: "\u5207\u6362\u6A21\u5F0F\u4F1A\u5148\u4FDD\u5B58\u5F53\u524D\u5DE5\u4F5C\u533A\uFF0C\u518D\u8FDB\u5165\u5BF9\u5E94\u6D41\u7A0B\u3002\u8FD9\u6837\u7528\u6237\u4E0D\u4F1A\u8FF7\u8DEF\uFF0C\u4E5F\u4E0D\u4F1A\u8BEF\u628A\u65B0\u624B\u3001\u4E13\u4E1A\u3001\u5BFC\u6F14\u6A21\u5F0F\u7684\u6570\u636E\u6DF7\u5728\u4E00\u8D77\u3002" })] })] }), _jsx("button", { onClick: onClose, className: "polaris-v94-close-btn rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg", children: "Close / \u5173\u95ED" })] }), _jsx("div", { className: "mt-7 grid grid-cols-1 gap-4 lg:grid-cols-3", children: cards.map((m, i) => {
                                const info = meta[m.id] || meta.pro;
                                const active = currentMode === m.id;
                                return _jsxs("button", { onClick: () => onSelect?.(m.id), className: `polaris-v94-mode-card group relative overflow-hidden rounded-[2.2rem] border p-5 text-left transition ${active ? "is-active border-amber-300 bg-amber-50" : "border-slate-200 bg-white hover:border-violet-200"}`, children: [_jsx("div", { className: "polaris-v94-card-glow" }), _jsxs("div", { className: "relative z-10 flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-[12px] font-black uppercase tracking-[0.24em] text-violet-500", children: ["Mode ", String(i + 1).padStart(2, "0"), " \u00B7 ", info.tag] }), _jsx("div", { className: "mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950", children: m.title }), _jsx("div", { className: "mt-1 text-sm font-black uppercase tracking-widest text-slate-500", children: m.en })] }), _jsx("div", { className: `rounded-full px-3 py-1 text-xs font-black ${active ? "bg-amber-400 text-slate-950" : "bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-700"}`, children: active ? "CURRENT" : "SELECT" })] }), _jsx("p", { className: "relative z-10 mt-5 min-h-[72px] text-base leading-7 text-slate-600", children: info.desc }), _jsxs("div", { className: "relative z-10 mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4", children: [_jsx("div", { className: "text-[12px] font-black uppercase tracking-[0.22em] text-slate-400", children: "Recommended Flow / \u63A8\u8350\u6D41\u7A0B" }), _jsx("div", { className: "mt-2 text-base font-black text-slate-800", children: info.flow })] }), _jsxs("div", { className: "relative z-10 mt-5 flex items-center justify-between gap-3", children: [_jsx("span", { className: "text-sm font-black text-slate-500", children: info.zh }), _jsx("span", { className: `inline-flex h-11 w-11 items-center justify-center rounded-2xl font-black transition group-hover:translate-x-1 ${active ? "bg-amber-400 text-black" : "bg-slate-950 text-white"}`, children: "\u2192" })] })] }, m.id);
                            }) }), _jsx("div", { className: "mt-7 grid grid-cols-1 gap-3 md:grid-cols-4", children: [
                                ["Auto Save", "切换前自动保存"],
                                ["DeepSeek", apiIsReady ? "模型通道在线" : "等待 API"],
                                ["Canvas", "图像 / 视频为中心"],
                                ["Delivery", "工程包可导出"],
                            ].map(([a, b]) => _jsxs("div", { className: "polaris-v94-mini rounded-3xl border border-slate-200 bg-slate-50 p-4", children: [_jsx("div", { className: "text-[12px] font-black uppercase tracking-[0.2em] text-violet-500", children: a }), _jsx("div", { className: "mt-2 text-sm font-bold text-slate-600", children: b })] }, a)) })] })] }) }), document.body);
};
const DigitalClapperboard = ({ open, project, workspaceMode, selectedModel, tech, style, onCancel, onAction }) => {
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-[145] flex items-center justify-center bg-black/80 px-5 backdrop-blur-2xl", children: _jsxs("div", { className: "w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-white/15 bg-[#080808] shadow-[0_0_120px_rgba(251,191,36,0.2)]", children: [_jsx("div", { className: "grid grid-cols-8 border-b border-white/15 bg-amber-400 text-black", children: Array.from({ length: 8 }).map((_, i) => _jsx("div", { className: `h-10 ${i % 2 ? "bg-black/90" : "bg-amber-300"}` }, i)) }), _jsxs("div", { className: "p-8", children: [_jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.35em] text-amber-300", children: "Digital Clapperboard / \u6570\u5B57\u573A\u8BB0\u677F" }), _jsx("h3", { className: "mt-1 text-xl font-black text-white", children: "Ready to Roll / \u51C6\u5907\u5F00\u673A" }), _jsx("div", { className: "mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
                                ["PROJECT", project || "Untitled Project"],
                                ["MODE", workspaceMode || "director"],
                                ["DURATION", tech?.videoDuration || tech?.shotCount || "-"],
                                ["STYLE", style?.name || "-"],
                                ["MODEL", selectedModel],
                                ["CHIEF ENGINEER", ENGINEER_NAME],
                            ].map(([k, v]) => _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.22em] text-stone-500", children: k }), _jsx("div", { className: "mt-2 text-sm font-black text-white", children: v })] }, k)) }), _jsxs("div", { className: "mt-7 flex flex-wrap justify-end gap-3", children: [_jsx("button", { onClick: onCancel, className: "rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10", children: "Cancel / \u53D6\u6D88" }), _jsx("button", { onClick: onAction, className: "rounded-2xl bg-amber-400 px-7 py-3 text-[11px] font-black uppercase tracking-widest text-black hover:bg-amber-300", children: "Clap & Generate / \u6253\u677F\u751F\u6210" })] })] })] }) }));
};
const DirectorCutReadyModal = ({ summary, onClose, onExport }) => {
    if (!summary)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-[145] flex items-center justify-center bg-black/75 px-5 backdrop-blur-2xl", children: _jsxs("div", { className: "w-full max-w-xl rounded-[2.5rem] border border-emerald-300/25 bg-[#080908] p-8 shadow-[0_0_120px_rgba(16,185,129,0.18)]", children: [_jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.35em] text-emerald-300", children: "Director's Cut Ready / \u5BFC\u6F14\u526A\u8F91\u7248\u5B8C\u6210" }), _jsx("h3", { className: "mt-3 text-3xl font-black text-white", children: "\u5DE5\u4E1A\u5206\u955C\u65B9\u6848\u5DF2\u5C01\u7248" }), _jsx("div", { className: "mt-6 grid grid-cols-2 gap-3", children: [
                        ["Shots / 镜头", summary.shotCount],
                        ["Scene Prompts / 场景图", summary.scenePromptCount],
                        ["Quality / 质量评分", summary.qualityScore],
                        ["Risk / 连续性风险", summary.risk],
                    ].map(([k, v]) => _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.22em] text-stone-500", children: k }), _jsx("div", { className: "mt-2 text-xl font-black text-white", children: v })] }, k)) }), _jsxs("div", { className: "mt-5 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-amber-200", children: "Archive ID / \u5C01\u5B58\u7F16\u53F7" }), _jsx("div", { className: "mt-2 select-all text-sm font-black text-white", children: summary.archiveId }), _jsxs("div", { className: "mt-1 text-[11px] text-stone-500", children: ["Chief Engineer: ", ENGINEER_NAME] })] }), _jsxs("div", { className: "mt-7 flex flex-wrap justify-end gap-3", children: [_jsx("button", { onClick: onClose, className: "rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10", children: "View Shot Deck / \u67E5\u770B\u5206\u955C\u53F0" }), _jsx("button", { onClick: onExport, className: "rounded-2xl bg-emerald-400 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black hover:bg-emerald-300", children: "Export Production Pack / \u5BFC\u51FA\u5DE5\u4E1A\u5305" })] })] }) }));
};
const RitualStageBar = ({ progress = 0 }) => {
    const { idx } = getRitualStage(progress);
    return (_jsxs("div", { className: "mt-4 rounded-2xl border border-white/10 bg-black/45 p-4", children: [_jsx("div", { className: "mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-amber-200", children: "Production Stages / \u7535\u5F71\u5DE5\u4E1A\u6D41\u7A0B" }), _jsx("div", { className: "grid grid-cols-1 gap-2", children: RITUAL_STAGES.map((stage, i) => _jsxs("div", { className: `flex items-center gap-3 rounded-xl px-3 py-2 text-[11px] ${i <= idx ? "bg-amber-400/15 text-amber-100" : "bg-white/5 text-stone-600"}`, children: [_jsx("span", { className: `h-2.5 w-2.5 rounded-full ${i <= idx ? "bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.8)]" : "bg-stone-700"}` }), String(i + 1).padStart(2, "0"), " \u00B7 ", stage] }, stage)) })] }));
};
const ProgressRing = ({ progress, size = 120, stroke = 9, label = "Generating" }) => {
    const pct = Math.max(0, Math.min(100, Math.round(progress || 0)));
    const center = size / 2;
    const radius = center - stroke - 7;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;
    return (_jsxs("div", { className: "relative flex items-center justify-center", style: { width: size, height: size }, children: [_jsxs("svg", { className: "absolute inset-0 h-full w-full -rotate-90", viewBox: `0 0 ${size} ${size}`, "aria-hidden": "true", children: [_jsx("circle", { cx: center, cy: center, r: radius, stroke: "rgba(255,255,255,0.08)", strokeWidth: stroke, fill: "none" }), _jsx("circle", { cx: center, cy: center, r: radius, stroke: "url(#sidebarProgressGold)", strokeWidth: stroke, fill: "none", strokeLinecap: "round", strokeDasharray: circumference, strokeDashoffset: offset, className: "transition-all duration-500 ease-out" }), _jsx("defs", { children: _jsxs("linearGradient", { id: "sidebarProgressGold", x1: "0", y1: "0", x2: size, y2: size, gradientUnits: "userSpaceOnUse", children: [_jsx("stop", { stopColor: "#fff7cc" }), _jsx("stop", { offset: "0.5", stopColor: "#fbbf24" }), _jsx("stop", { offset: "1", stopColor: "#f59e0b" })] }) })] }), _jsxs("div", { className: "absolute inset-[12%] rounded-full border border-white/10 bg-black/75 flex flex-col items-center justify-center shadow-[inset_0_0_28px_rgba(0,0,0,0.45)]", children: [_jsxs("div", { className: "text-2xl font-black text-amber-300 tabular-nums", children: [pct, "%"] }), _jsx("div", { className: "mt-1 text-[10px] font-black uppercase tracking-[0.24em] text-stone-500", children: label })] })] }));
};
const GenerationProgressSidebar = ({ progress, status, visible, onShow, onHide }) => {
    const pct = Math.max(0, Math.min(100, Math.round(progress || 0)));
    if (!visible) {
        return (_jsx("button", { type: "button", onClick: onShow, className: "fixed right-0 top-1/2 z-[100] -translate-y-1/2 rounded-l-3xl border border-amber-300/20 bg-[#090909]/95 px-3 py-4 shadow-[0_0_40px_rgba(251,191,36,0.16)] backdrop-blur-xl", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-300/20 bg-black/70 text-amber-300 font-black text-xs", children: [pct, "%"] }), _jsxs("div", { className: "text-left pr-1", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.22em] text-amber-200", children: "Show Progress" }), _jsx("div", { className: "mt-1 text-[11px] text-stone-400", children: "\u663E\u793A\u8FDB\u5EA6\u73AF" })] })] }) }));
    }
    return (_jsxs("aside", { className: "fixed right-4 top-1/2 z-[100] w-[320px] -translate-y-1/2 rounded-[2rem] border border-amber-300/20 bg-[#080807]/95 p-6 shadow-[0_0_80px_rgba(251,191,36,0.18)] backdrop-blur-2xl", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.28em] text-amber-200", children: "Generation Monitor" }), _jsx("div", { className: "mt-1 text-sm font-bold text-white", children: "AI \u751F\u6210\u8FDB\u5EA6\u73AF" })] }), _jsx("button", { type: "button", onClick: onHide, className: "rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-stone-300 hover:bg-white/10", children: "Hide / \u9690\u85CF" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(ProgressRing, { progress: pct, size: 118, stroke: 9 }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "text-[12px] font-black uppercase tracking-[0.18em] text-white", children: "AI Directing" }), _jsx("div", { className: "mt-2 text-sm leading-relaxed text-stone-400", children: status }), _jsx("div", { className: "mt-4 h-2 overflow-hidden rounded-full bg-white/5", children: _jsx("div", { className: "h-full rounded-full bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 transition-all duration-500", style: { width: `${pct}%` } }) }), _jsxs("div", { className: "mt-2 text-[11px] font-bold text-amber-300", children: [pct, "% / \u6B63\u5728\u5904\u7406\u4E2D"] })] })] }), _jsx(RitualStageBar, { progress: pct })] }));
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
    const [showModeSwitchModal, setShowModeSwitchModal] = useState(false);
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
    const canvasPanRef = useRef({ active: false, moved: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0, pointerId: null });
    const [canvasIsPanning, setCanvasIsPanning] = useState(false);
    useEffect(() => {
        if (typeof document === "undefined")
            return;
        if (!(projectStudioOpen && projectStudioTab === "canvas"))
            return;
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
    const [videoApiSettings, setVideoApiSettings] = useState({ provider: OPT.videoApiProviders[0], model: OPT.videoApiModels[0], endpoint: "/api/video-generate", resolution: "720p", duration: "5", ratio: "adaptive", seed: "0", cameraFixed: false, watermark: false, generateAudio: false, autoPoll: true });
    const [canvasApiCredentials, setCanvasApiCredentials] = useState({
        jimengImageKey: "", jimengVideoKey: "", klingImageKey: "", klingVideoKey: "",
        jimengImageEndpoint: "", jimengVideoEndpoint: "", jimengVideoQueryEndpoint: "",
        klingImageEndpoint: "", klingVideoEndpoint: "", klingVideoQueryEndpoint: "",
        authHeader: "Authorization", saveInBrowser: true, lastValidatedAt: ""
    });
    const [canvasLaunchProfile, setCanvasLaunchProfile] = useState({ mode: "full", defaultProvider: "jimeng", ratio: "16:9", resolution: "720p" });
    const [generationQueue, setGenerationQueue] = useState([]);
    const [timelineOpen, setTimelineOpen] = useState(true);
    const [assetLibraryOpen, setAssetLibraryOpen] = useState(true);
    const [shotVideos, setShotVideos] = useState({});
    const [isGeneratingVideos, setIsGeneratingVideos] = useState(false);
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
    const [workflowConnectCursor, setWorkflowConnectCursor] = useState(null);
    const [workflowRunLog, setWorkflowRunLog] = useState([]);
    const [workflowActiveNode, setWorkflowActiveNode] = useState("");
    const [workflowRunMode, setWorkflowRunMode] = useState("prompt-only");
    const [canvasNodeAssets, setCanvasNodeAssets] = useState({});
    const [workflowLibraryOpen, setWorkflowLibraryOpen] = useState(true);
    const [canvasQuickMenu, setCanvasQuickMenu] = useState(null);
    const [canvasInspectorOpen, setCanvasInspectorOpen] = useState(true);
    const [canvasApiGateOpen, setCanvasApiGateOpen] = useState(false);
    const [canvasFocusedInput, setCanvasFocusedInput] = useState(null);
    const [canvasTemplateOpen, setCanvasTemplateOpen] = useState(false);
    const [canvasContextMenu, setCanvasContextMenu] = useState(null);
    const [canvasCostMetrics, setCanvasCostMetrics] = useState({ deepseek: 0, image: 0, video: 0, failed: 0 });
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
            videoApiSettings: { provider: OPT.videoApiProviders[0], model: OPT.videoApiModels[0], endpoint: "/api/video-generate", resolution: "720p", duration: "5", ratio: "adaptive", seed: "0", cameraFixed: false, watermark: false, generateAudio: false, autoPoll: true },
            canvasApiCredentials: { jimengImageKey: "", jimengVideoKey: "", klingImageKey: "", klingVideoKey: "", jimengImageEndpoint: "", jimengVideoEndpoint: "", jimengVideoQueryEndpoint: "", klingImageEndpoint: "", klingVideoEndpoint: "", klingVideoQueryEndpoint: "", authHeader: "Authorization", saveInBrowser: true, lastValidatedAt: "" },
            canvasLaunchProfile: { mode: "full", defaultProvider: "jimeng", ratio: "16:9", resolution: "720p" },
            generationQueue: [],
            timelineOpen: true,
            assetLibraryOpen: true,
            productionFlowMode: "prompt-only",
            shotKeyframes: {},
            shotVideos: {},
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
            canvasNodeAssets: {},
            canvasCostMetrics: { deepseek: 0, image: 0, video: 0, failed: 0 },
            projectWizard: { projectType: "person", customType: "", duration: "60s", useCase: "抖音 / Douyin", creationMethod: "一句话生成 / One-line idea" },
            clientViewMode: "overview",
            lastArchiveId: "",
        };
    }
    function cloneWorkspace(value) {
        if (typeof structuredClone === "function")
            return structuredClone(value);
        return JSON.parse(JSON.stringify(value));
    }
    function captureWorkspace() {
        return cloneWorkspace({
            script, project, style, shots, activeShot, activeModule, proStep,
            generationHistory, shotPlanRows, shotPlanDiagnosis, qualityReport, promptVersions,
            negativePrompt, ideaInput, referenceUrl, referenceManualContent, scriptImportText, scriptImportMeta, scriptImportAnalysis, scriptImportScenes, selectedImportScene, referenceIngest,
            referenceUseMode, douyinViral, personFacts, outlineDraft, sceneImageBatchFormat,
            creativeBrief, modules, tech, preflightReport, rhythmTable, captionStudio, modelAdapterTarget, outlineRewriteMode, promptRefineMode, characterLock, locationLock, shotSimilarityReport, filmRiskReport, imageApiSettings, videoApiSettings, canvasApiCredentials, canvasLaunchProfile, generationQueue, timelineOpen, assetLibraryOpen, productionFlowMode, shotKeyframes, shotVideos, visualLocks, characterAssets, locationAssets, videoModelRouting, canvasViewMode, canvasZoom, canvasSelectedNode, canvasNodePositions, canvasRitualMode, workflowNodes, workflowEdges, workflowRunLog, workflowRunMode, canvasNodeAssets, canvasCostMetrics, projectWizard, clientViewMode, lastArchiveId,
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
        setVideoApiSettings(next.videoApiSettings || preset.videoApiSettings);
        setCanvasApiCredentials(next.canvasApiCredentials || preset.canvasApiCredentials);
        setCanvasLaunchProfile(next.canvasLaunchProfile || preset.canvasLaunchProfile);
        setGenerationQueue(next.generationQueue || preset.generationQueue || []);
        setTimelineOpen(next.timelineOpen ?? true);
        setAssetLibraryOpen(next.assetLibraryOpen ?? true);
        setProductionFlowMode(next.productionFlowMode || "prompt-only");
        setShotKeyframes(next.shotKeyframes || {});
        setShotVideos(next.shotVideos || {});
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
        setCanvasNodeAssets(next.canvasNodeAssets || {});
        setCanvasCostMetrics(next.canvasCostMetrics || preset.canvasCostMetrics || { deepseek: 0, image: 0, video: 0, failed: 0 });
        setProjectWizard(next.projectWizard || preset.projectWizard);
        setClientViewMode(next.clientViewMode || "overview");
        setLastArchiveId(next.lastArchiveId || "");
    }
    function switchWorkspaceMode(nextMode) {
        const normalizedMode = nextMode || "pro";
        if (workspaceMode)
            workspaceStoreRef.current[workspaceMode] = captureWorkspace();
        const nextWorkspace = workspaceStoreRef.current[normalizedMode] || createWorkspacePreset(normalizedMode);
        loadWorkspace(nextWorkspace, normalizedMode);
        setWorkspaceMode(normalizedMode);
        const ritualModeName = normalizedMode === "beginner" ? "Quick Creator Studio / 快速创作棚" : normalizedMode === "director" ? "Director Command Deck / 导演指挥舱" : "AIGC Production Studio / 专业制作棚";
        setRitualOverlay(null);
        setShowModeSwitchModal(false);
        setStatus(`Workspace switched / 已切换到独立工作区：${normalizedMode} · ${ritualModeName}`);
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
            [LOCAL_STORAGE_KEY, ...(Array.isArray(LEGACY_LOCAL_STORAGE_KEYS) ? LEGACY_LOCAL_STORAGE_KEYS : [])].forEach(key => window.localStorage.removeItem(key));
            workspaceStoreRef.current = {};
            setLastSavedAt("");
            setStatus("Local autosave cache cleared / 已清空本地自动保存缓存，旧默认脚本已移除");
            setWorkspaceStoreVersion(v => v + 1);
        }
        catch (e) {
            setStatus("Failed to clear local cache / 清空本地缓存失败");
        }
    }
    function applyProjectTemplate(template) {
        if (!template)
            return;
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
        const payload = { format: "polaris-project", version: "V10.6", exportedAt: new Date().toISOString(), engineer: ENGINEER_NAME, workspaceMode: workspaceMode || "pro", workspace: captureWorkspace() };
        downloadTextFile(`${safeName(project)}.polaris.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
        setStatus("Project file exported / 工程文件已导出");
    }
    async function importProjectFileFromUpload(e) {
        const file = e?.target?.files?.[0];
        if (!file)
            return;
        try {
            const txt = await readFileAsText(file);
            const parsed = JSON.parse(txt);
            const ws = parsed.workspace || parsed;
            loadWorkspace(ws, parsed.workspaceMode || workspaceMode || "pro");
            setWorkspaceMode(parsed.workspaceMode || workspaceMode || "pro");
            setProjectStudioOpen(false);
            setStatus(`Project file imported / 已导入工程文件：${file.name}`);
            showRitual("PROJECT FILE / 工程文件", "Project Imported / 项目已导入", file.name, 100);
        }
        catch (err) {
            showApiError(err, "Project file import failed / 工程文件导入失败");
        }
        finally {
            if (e?.target)
                e.target.value = "";
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
        if (!item?.workspace)
            return;
        if (workspaceMode)
            workspaceStoreRef.current[workspaceMode] = captureWorkspace();
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
        if (!apiIsReady)
            add("High", "API 尚未连接。", "先回到 API Center 点火 AI 引擎。");
        if (!String(ideaInput || script).trim())
            add("High", "缺少一句话创作需求或剧本圣经。", "填写主题、时长、风格和用途。");
        if (referenceUrl && referenceIngest.status !== "success" && !referenceManualContent.trim())
            add("Medium", "检测到参考链接，但尚未完成解析或手动补充。", "点击识别参考链接，或粘贴标题、字幕、简介。");
        if ((douyinViral.videoType || "").includes("人物") && !personFacts.name)
            add("Medium", "人物介绍缺少事实补充。", "填写人物姓名、身份、真实经历和不可编造项。");
        if (!tech.videoDuration)
            add("Low", "缺少预计时长。", "选择 15s/30s/60s 等目标时长。");
        if (!creativeBrief.mood)
            add("Low", "缺少情绪与视觉基调。", "填写整体情绪、色彩和风格定位。");
        const score = Math.max(55, 100 - issues.reduce((sum, x) => sum + (x.level === "High" ? 18 : x.level === "Medium" ? 10 : 5), 0));
        const report = { score, issues, checkedAt: new Date().toLocaleString(), summary: issues.length ? `发现 ${issues.length} 个可优化项，建议生成前修复。` : "输入完整，可以进入生成流程。" };
        setPreflightReport(report);
        setStatus(`Preflight complete / 生成前体检完成：${score}/100`);
        return report;
    }
    function autoCompleteMissingInfo() {
        if (!ideaInput.trim())
            setIdeaInput("写一个关于香港文化的短视频，要有剧情，要有爆款思维，1分钟内的短视频脚本。");
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
        }
        else
            setRhythmTable(timeline);
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
        const kit = [`北极星AIGC电影级工业系统 V10.6 · Full Production Kit`, `Project: ${project}`, `Chief Engineer: ${ENGINEER_NAME}`, `Archive ID: ${lastArchiveId || makeArchiveId(project || "Polaris")}`, `Generated At: ${new Date().toLocaleString()}`, "", "## 01 Project Overview / 项目总览", script || outlineDraft || ideaInput || "", "", "## 02 Preflight Report / 生成前体检", preflightReport ? JSON.stringify(preflightReport, null, 2) : "未生成体检报告", "", "## 02B Shot Similarity / 镜头重复检测", shotSimilarityReport ? JSON.stringify(shotSimilarityReport, null, 2) : "未生成镜头重复检测", "", "## 02C Final Video Risk / 成片风险预估", filmRiskReport ? JSON.stringify(filmRiskReport, null, 2) : "未生成成片风险预估", "", "## 03 Editing Rhythm / 成片节奏表", rhythmTable.map(r => `${r.time} · ${r.role} · ${r.title} · ${r.beat}`).join(NL) || "未生成节奏表", "", "## 04 Caption & Voiceover / 字幕旁白", captionStudio.voiceover, captionStudio.subtitles, captionStudio.titles, captionStudio.publishCopy, captionStudio.hashtags, "", "## 05 Prompt Pack / 提示词包", buildPurePromptPack(rebuildFinalPrompts(shots), project), "", "## 05B Image-to-Video Production Pack / 图生视频制作包", createImageToVideoPromptPack(rebuildFinalPrompts(shots), shotKeyframes, visualLocks, videoModelRouting), "", "## 05C Video Tasks / 视频生成任务", JSON.stringify(shotVideos, null, 2), "", "## 06 Project Data JSON / 项目数据", JSON.stringify(captureWorkspace(), null, 2)].join(NL);
        downloadTextFile(`${safeName(project)}_Polaris_V10_4_Full_Production_Kit.txt`, kit, "text/plain;charset=utf-8");
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
            const keyCandidates = [LOCAL_STORAGE_KEY, ...(Array.isArray(LEGACY_LOCAL_STORAGE_KEYS) ? LEGACY_LOCAL_STORAGE_KEYS : [])];
            let raw = "";
            let loadedKey = "";
            for (const key of keyCandidates) {
                raw = window.localStorage.getItem(key);
                if (raw) {
                    loadedKey = key;
                    break;
                }
            }
            if (raw) {
                const saved = JSON.parse(raw);
                if (loadedKey && loadedKey !== LOCAL_STORAGE_KEY) {
                    try {
                        window.localStorage.setItem(LOCAL_STORAGE_KEY, raw);
                    }
                    catch (_) { }
                }
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
        }
        catch (e) {
            console.warn("Failed to restore Polaris workspace", e);
        }
        finally {
            autosaveHydratedRef.current = true;
        }
    }, []);
    useEffect(() => {
        if (!autosaveHydratedRef.current)
            return;
        if (autosaveTimerRef.current)
            window.clearTimeout(autosaveTimerRef.current);
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
            }
            catch (e) {
                console.warn("Failed to autosave Polaris workspace", e);
            }
        }, 1200);
        return () => {
            if (autosaveTimerRef.current)
                window.clearTimeout(autosaveTimerRef.current);
        };
    }, [
        workspaceMode, script, project, style, shots, activeShot, activeModule, proStep,
        generationHistory, shotPlanRows, shotPlanDiagnosis, qualityReport, promptVersions,
        negativePrompt, ideaInput, referenceUrl, referenceManualContent, scriptImportText, scriptImportMeta,
        scriptImportAnalysis, scriptImportScenes, selectedImportScene, referenceIngest,
        referenceUseMode, douyinViral, personFacts, outlineDraft, sceneImageBatchFormat,
        creativeBrief, modules, tech, preflightReport, rhythmTable, captionStudio, modelAdapterTarget,
        outlineRewriteMode, promptRefineMode, characterLock, locationLock, shotSimilarityReport, filmRiskReport,
        imageApiSettings, videoApiSettings, productionFlowMode, shotKeyframes, shotVideos, visualLocks,
        characterAssets, locationAssets, videoModelRouting, canvasViewMode, canvasZoom, canvasSelectedNode,
        canvasNodePositions, canvasRitualMode, workflowNodes, workflowEdges, workflowRunLog, workflowRunMode, canvasNodeAssets, canvasApiCredentials, canvasLaunchProfile, generationQueue, timelineOpen, assetLibraryOpen,
        projectWizard, clientViewMode, lastArchiveId, apiMode, selectedModel, thinkingMode, reasoningEffort,
        workspaceStoreVersion
    ]);
    useEffect(() => {
        if (!DEEPSEEK_V4_MODELS.includes(selectedModel)) {
            setSelectedModel(DEEPSEEK_V4_MODELS[0]);
            setStatus(`Model migrated to ${DEEPSEEK_V4_MODELS[0]} / 已自动切换到 DeepSeek V4 模型`);
        }
    }, [selectedModel]);
    useEffect(() => {
        if (!isGenerating)
            return;
        setGenerateProgress(prev => (prev > 0 ? prev : 6));
        const timer = window.setInterval(() => {
            setGenerateProgress(prev => Math.min(92, prev + Math.max(1, Math.round((92 - prev) * 0.08))));
        }, 420);
        return () => window.clearInterval(timer);
    }, [isGenerating]);
    useEffect(() => {
        const handler = async (event) => {
            if (workspaceMode !== "director")
                return;
            const target = event.target;
            if (event.isComposing || isEditableTarget(target))
                return;
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
    const updateActiveShot = patch => { if (!active)
        return; setShots(prev => prev.map((s, i) => i === activeShot ? { ...s, ...patch } : s)); };
    const rebuildFinalPrompts = arr => arr.map(s => {
        const enriched = applyConsistencyLocksToShot({ ...s }, characterLock, locationLock);
        const promptQuality = assessPromptQuality(enriched);
        return { ...enriched, promptQualityScore: promptQuality.score, promptQualityNotesZh: promptQuality.zh, promptQualityNotesEn: promptQuality.en, finalPrompt: buildFinalPrompt(enriched, project, style, tech, modules, negativePrompt), finalSceneImagePrompt: tech.generateSceneImagePrompt ? buildSceneImageModelVariant(enriched, project, style, tech, negativePrompt) : "" };
    });
    function getSceneImagePack(format = sceneImageBatchFormat) {
        return buildSceneImagePromptPack(rebuildFinalPrompts(shots), project, style, tech, negativePrompt, format);
    }
    async function handleCopySceneImagePack() {
        if (!shots.length)
            return setStatus("No shots to export / 还没有可导出的镜头");
        await safeCopyText(getSceneImagePack(sceneImageBatchFormat));
        setStatus("Scene image prompt pack copied / 已复制全部场景图提示词包");
    }
    function handleDownloadSceneImagePack() {
        if (!shots.length)
            return setStatus("No shots to export / 还没有可导出的镜头");
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
        if (apiMode === "direct")
            headers.Authorization = `Bearer ${apiKey.trim().replace(/[^\u0000-\u007F]/g, "")}`;
        return headers;
    };
    async function handleTestApi() {
        if (apiMode === "direct" && !apiKey.trim())
            return setStatus("API Key Required / 请输入 DeepSeek API Key");
        const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
        const started = Date.now();
        setApiLog({ status: "testing", message: "Testing DeepSeek API... / 正在测试接口", lastModel: apiModel, lastEndpoint: deepSeekEndpoint, latencyMs: null, scriptFingerprint: scriptFingerprint(script) });
        try {
            const body = { model: apiModel, messages: [{ role: "user", content: "Return exactly this JSON: {\"pong\":true}" }], response_format: { type: "json_object" }, temperature: 0 };
            const headers = { "Content-Type": "application/json" };
            if (apiMode === "direct")
                headers.Authorization = `Bearer ${apiKey.trim().replace(/[^\x00-\x7F]/g, "")}`;
            const res = await fetch(deepSeekEndpoint, { method: "POST", headers, body: JSON.stringify(body) });
            const txt = await res.text();
            const latencyMs = Date.now() - started;
            if (!res.ok)
                throw new Error(`API Error ${res.status}: ${txt.slice(0, 180)}`);
            setApiLog({ status: "success", message: `API Connected / 接口连接成功 · ${latencyMs}ms`, lastModel: apiModel, lastEndpoint: deepSeekEndpoint, latencyMs, scriptFingerprint: scriptFingerprint(script), raw: txt.slice(0, 600) });
            setApiConnected(true);
            showRitual("AI ENGINE IGNITED", "北极星电影工业引擎已点火", `DeepSeek V4 已接入 · Model: ${apiModel} · Latency: ${latencyMs}ms · 总工程师认证：${ENGINEER_NAME}`, 100);
            const modeToReturn = returnModeAfterApi;
            if (modeToReturn) {
                switchWorkspaceMode(modeToReturn);
                setReturnModeAfterApi("");
                setStatus(`API Switched with ${apiModel} / 接口已切换，并返回 ${modeToReturn} 工作区`);
            }
            else {
                setStatus(`API Connected with ${apiModel} / 接口连接成功`);
            }
        }
        catch (e) {
            const info = showApiError(e, "API Test Failed / 接口测试失败");
            setApiLog({ status: "error", message: `${info.title}: ${info.message}`, lastModel: apiModel, lastEndpoint: deepSeekEndpoint, latencyMs: Date.now() - started, scriptFingerprint: scriptFingerprint(script), raw: String(e.message || e) });
            setApiConnected(false);
        }
    }
    async function handleScriptDocumentUpload(event) {
        const file = event?.target?.files?.[0];
        if (!file)
            return;
        setIsImportingScript(true);
        setStatus("Importing script document / 正在导入剧本文档");
        try {
            const { text, meta } = await extractScriptDocumentText(file);
            if (!String(text || "").trim())
                throw new Error("No readable text found / 文档中没有读取到可用文本");
            setScriptImportText(text);
            setScriptImportMeta(meta);
            setScriptImportAnalysis(null);
            setScriptImportScenes([]);
            setSelectedImportScene("all");
            setStatus(`Script imported / 剧本文档已导入：${meta.name} · ${text.length} chars`);
        }
        catch (e) {
            showApiError(e, "Script Import Error / 剧本文档导入失败");
            setStatus(`Script import failed / 剧本文档导入失败：${e.message}`);
        }
        finally {
            setIsImportingScript(false);
            if (event?.target)
                event.target.value = "";
        }
    }
    async function handleAnalyzeImportedScript() {
        if (apiMode === "direct" && !apiKey.trim())
            return setStatus("API Key Required / 请输入 DeepSeek API Key");
        if (!scriptImportText.trim())
            return setStatus("Import Required / 请先导入 Word、TXT 或 MD 剧本文档");
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
            if (!res.ok)
                throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 180)}`);
            const data = await res.json();
            const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
            const scenes = Array.isArray(parsed.scenes) ? parsed.scenes : [];
            setScriptImportAnalysis(parsed);
            setScriptImportScenes(scenes);
            setSelectedImportScene("all");
            if (parsed.title && (!project || project.includes("Project") || project.includes("项目")))
                setProject(parsed.title);
            setStatus(`Script analysis complete / 剧本文档分析完成：${scenes.length} scenes`);
            return parsed;
        }
        catch (e) {
            showApiError(e, "Script Analysis Error / 剧本分析失败");
            setStatus(`Script analysis failed / 剧本分析失败：${e.message}`);
            return null;
        }
        finally {
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
        if (!scriptImportText.trim() && !scriptImportAnalysis)
            return setStatus("No imported script / 还没有导入剧本文档");
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
        if (!url && !referenceManualContent.trim()) {
            setStatus("Reference Required / 请输入参考链接或粘贴参考内容");
            return null;
        }
        setIsIngestingReference(true);
        setStatus("Reading reference link / 正在识别参考链接内容");
        const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
        let proxyPayload = null;
        try {
            if (url) {
                try {
                    const proxyRes = await fetch(`/api/link-ingest?url=${encodeURIComponent(url)}`, { method: "GET" });
                    if (proxyRes.ok)
                        proxyPayload = await proxyRes.json();
                }
                catch (_) {
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
                headers: (() => { const h = { "Content-Type": "application/json" }; if (apiMode === "direct")
                    h.Authorization = `Bearer ${apiKey.trim().replace(/[^\x00-\x7F]/g, "")}`; return h; })(),
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
            if (!res.ok)
                throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 180)}`);
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
        }
        catch (e) {
            const failedIngest = { ...referenceIngest, status: "failed_needs_manual", uncertainInfo: String(e.message || e), summary: "链接读取失败。请粘贴视频文案、标题、简介、评论区重点或截图文字后再分析。" };
            setReferenceIngest(failedIngest);
            setStatus(`Reference Error: ${e.message} / 链接识别失败，请粘贴参考内容`);
            return failedIngest;
        }
        finally {
            setIsIngestingReference(false);
        }
    }
    async function handleGenerateScriptOutline() {
        if (apiMode === "direct" && !apiKey.trim())
            return setStatus("API Key Required / 请输入 DeepSeek API Key");
        if (!ideaInput.trim())
            return setStatus("Idea Required / 请先输入想法需求");
        let referenceContextForRequest = referencePromptContext;
        if ((referenceUrl.trim() || extractFirstUrl(ideaInput)) && referenceIngest.status === "idle") {
            setStatus("Auto analyzing reference before outline / 生成大纲前自动识别参考链接");
            const nextRef = await handleIngestReference();
            if (nextRef)
                referenceContextForRequest = summarizeReferenceForPrompt({ url: activeReferenceUrl, useMode: referenceUseMode, manualContent: referenceManualContent, ...nextRef });
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
            if (!res.ok)
                throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 160)}`);
            const data = await res.json();
            const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
            const outline = parsed.scriptOutline || parsed.outline || "";
            if (!outline.trim())
                throw new Error("No script outline returned / 没有返回剧本大纲");
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
            if (parsed.mood)
                setCreativeBrief(p => ({ ...p, mood: parsed.mood }));
            if (parsed.viralStrategy || parsed.coverTitle || parsed.threeSecondHook) {
                setReferenceIngest(p => ({ ...p, viralRhythm: parsed.viralStrategy || p.viralRhythm, suggestedShortVideoAngle: [parsed.coverTitle, parsed.threeSecondHook].filter(Boolean).join(" / ") }));
            }
            setStatus("Script outline generated with reference + Douyin logic / 已按参考链接与抖音爆款逻辑生成剧本大纲，请确认后再生成提示词");
            return enhancedOutline;
        }
        catch (e) {
            showApiError(e, "Outline Error / 剧本大纲生成失败");
            return null;
        }
        finally {
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
        if (apiMode === "direct" && !apiKey.trim())
            return setStatus("API Key Required / 请输入 DeepSeek API Key");
        if (!shots.length)
            return setStatus("No shots to enhance / 还没有镜头可增强");
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
            if (!res.ok)
                throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 160)}`);
            const data = await res.json();
            const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
            const returned = Array.isArray(parsed.shots) ? parsed.shots : [];
            if (!returned.length)
                throw new Error("No enhanced scene image prompts returned / 没有返回增强场景图提示词");
            const merged = shots.map((s, i) => {
                const r = returned.find(x => Number(x.id) === Number(s.id)) || returned[i] || {};
                return { ...s, ...r };
            });
            setShots(rebuildFinalPrompts(merged));
            setStatus("Scene image prompts enhanced / 全部场景图提示词已增强");
        }
        catch (e) {
            showApiError(e, "Scene Image Enhance Error / 场景图提示词增强失败");
        }
        finally {
            setIsEnhancingSceneImages(false);
        }
    }
    async function handleGenerateShotPlan(scriptOverride = null) {
        const referenceContextForPlan = referencePromptContext;
        const effectiveScript = resolveAuthoritativeScript({ scriptOverride, script, ideaInput, outlineDraft, importedScriptContext, referenceContext: referenceContextForPlan });
        if (apiMode === "direct" && !apiKey.trim())
            return setStatus("API Key Required / 请输入 DeepSeek API Key");
        if (!cleanUserText(effectiveScript))
            return setStatus("Script Required / 请输入剧本大纲或一句话创作需求");
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
            if (apiMode === "direct")
                headers.Authorization = `Bearer ${apiKey.trim().replace(/[^\x00-\x7F]/g, "")}`;
            const res = await fetch(deepSeekEndpoint, { method: "POST", headers, body: JSON.stringify(body) });
            if (!res.ok)
                throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 180)}`);
            const data = await res.json();
            const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
            const plan = Array.isArray(parsed.plan) ? parsed.plan : [];
            if (!plan.length)
                throw new Error("Shot plan is empty / 分镜规划为空");
            setShotPlanRows(plan);
            setShotPlanDiagnosis({ zh: parsed.diagnosisZh || "", en: parsed.diagnosisEn || "", recommendedCount: parsed.recommendedCount || plan.length });
            setStatus(`Shot plan ready / 分镜规划已生成：建议 ${parsed.recommendedCount || plan.length} 个镜头`);
            return plan;
        }
        catch (e) {
            showApiError(e, "Shot Plan Error / 分镜规划失败");
            return null;
        }
        finally {
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
        if (apiMode === "direct" && !apiKey.trim())
            return setStatus("API Key Required / 请输入 DeepSeek API Key");
        if (!shots.length)
            return setStatus("No shots to repair / 还没有镜头可检查补齐");
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
            if (apiMode === "direct")
                headers.Authorization = `Bearer ${apiKey.trim().replace(/[^\x00-\x7F]/g, "")}`;
            const res = await fetch(deepSeekEndpoint, { method: "POST", headers, body: JSON.stringify(body) });
            if (!res.ok)
                throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 180)}`);
            const data = await res.json();
            const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
            const repaired = Array.isArray(parsed.shots) ? parsed.shots.map(normalizeShot) : [];
            if (!repaired.length)
                throw new Error("No repaired shots returned / 没有返回修复镜头");
            setPromptVersions(prev => [{ id: Date.now(), type: "coverage_repair_before", time: new Date().toLocaleString(), shots }, ...prev].slice(0, 12));
            setShots(rebuildFinalPrompts(repaired));
            setActiveShot(0);
            setStatus(`Coverage repaired / 覆盖检查完成，当前 ${repaired.length} 个镜头`);
        }
        catch (e) {
            showApiError(e, "Coverage Repair Error / 自动补镜头失败");
        }
        finally {
            setIsRepairingCoverage(false);
        }
    }
    async function handleRegenerateCurrentShot() {
        if (apiMode === "direct" && !apiKey.trim())
            return setStatus("API Key Required / 请输入 DeepSeek API Key");
        if (!active)
            return setStatus("No active shot / 没有当前镜头");
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
            if (apiMode === "direct")
                headers.Authorization = `Bearer ${apiKey.trim().replace(/[^\x00-\x7F]/g, "")}`;
            const res = await fetch(deepSeekEndpoint, { method: "POST", headers, body: JSON.stringify(body) });
            if (!res.ok)
                throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 180)}`);
            const data = await res.json();
            const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
            const newShot = normalizeShot({ ...active, ...(parsed.shot || parsed) }, activeShot);
            setPromptVersions(prev => [{ id: Date.now(), type: "regenerate_before", time: new Date().toLocaleString(), shotIndex: activeShot, shot: active }, ...prev].slice(0, 12));
            setShots(prev => rebuildFinalPrompts(prev.map((s, i) => i === activeShot ? newShot : s)));
            setStatus(`Shot ${activeShot + 1} regenerated with context / 当前镜头已带上下文重生成`);
        }
        catch (e) {
            showApiError(e, "Regenerate Shot Error / 单镜头重生成失败");
        }
        finally {
            setIsRegeneratingShot(false);
        }
    }
    async function handleOptimizeCurrentShot() {
        if (apiMode === "direct" && !apiKey.trim())
            return setStatus("API Key Required / 请输入 DeepSeek API Key");
        if (!active)
            return setStatus("No active shot / 没有当前镜头");
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
            if (apiMode === "direct")
                headers.Authorization = `Bearer ${apiKey.trim().replace(/[^\x00-\x7F]/g, "")}`;
            const res = await fetch(deepSeekEndpoint, { method: "POST", headers, body: JSON.stringify(body) });
            if (!res.ok)
                throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 180)}`);
            const data = await res.json();
            const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
            const newShot = normalizeShot({ ...active, ...(parsed.shot || parsed) }, activeShot);
            setPromptVersions(prev => [{ id: Date.now(), type: "optimize_before", mode: shotOptimizationMode, time: new Date().toLocaleString(), shotIndex: activeShot, shot: active }, ...prev].slice(0, 12));
            setShots(prev => rebuildFinalPrompts(prev.map((s, i) => i === activeShot ? newShot : s)));
            setStatus(`Shot ${activeShot + 1} optimized / 当前镜头已优化`);
        }
        catch (e) {
            showApiError(e, "Optimize Shot Error / 当前镜头优化失败");
        }
        finally {
            setIsOptimizingShot(false);
        }
    }
    function handleQuickRefineCurrentPrompt(mode = promptRefineMode) {
        if (!active)
            return setStatus("No active shot / 没有当前镜头可精修");
        setPromptVersions(prev => [{ id: Date.now(), time: new Date().toLocaleString(), shot: activeShot + 1, reason: `Quick refine: ${mode}`, shotData: active }, ...prev].slice(0, 12));
        setShots(prev => rebuildFinalPrompts(prev.map((s, i) => i === activeShot ? locallyRefineShotPrompt(s, mode) : s)));
        setStatus(`Prompt refined locally / 已精修当前镜头提示词：${mode}`);
    }
    async function handleRewriteOutline() {
        const base = String(outlineDraft || script || ideaInput || "").trim();
        if (!base)
            return setStatus("Outline Required / 请先生成或输入剧本大纲");
        if (apiMode === "direct" && !apiKey.trim())
            return setStatus("API Key Required / 请输入 DeepSeek API Key");
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
            if (String(thinkingMode).split(" /")[0] === "enabled")
                body.thinking = { type: "enabled" };
            const headers = apiHeaders();
            const res = await fetch(deepSeekEndpoint, { method: "POST", headers, body: JSON.stringify(body) });
            if (!res.ok)
                throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 220)}`);
            const data = await res.json();
            const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "", {});
            const nextOutline = [parsed.outlineZh, parsed.outlineEn ? `${NL}${NL}${parsed.outlineEn}` : "", Array.isArray(parsed.fixNotesZh) ? `${NL}${NL}【打磨建议】${NL}${parsed.fixNotesZh.join(NL)}` : ""].join("").trim() || base;
            setOutlineDraft(nextOutline);
            setStatus(`Outline rewritten / 大纲已打磨：${outlineRewriteMode}`);
        }
        catch (e) {
            const info = friendlyApiError(e);
            setApiErrorModal(info);
            setStatus(`${info.title}: ${info.message}`);
        }
        finally {
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
    function updateCanvasApiCredential(key, value) {
        setCanvasApiCredentials(prev => ({ ...prev, [key]: value }));
    }
    function isFullHttpUrl(value = "") {
        const v = String(value || "").trim();
        return /^https?:\/\//i.test(v);
    }
    function looksLikeCanvasApiKey(value = "") {
        const v = String(value || "").trim().replace(/^Bearer\s+/i, "");
        if (!v || isFullHttpUrl(v))
            return false;
        if (/^(ark-|sk-|ak-|pk_|rk_|key-|kling-|jimeng-)/i.test(v))
            return true;
        return v.length >= 24 && !v.includes("/") && !v.includes(".") && /^[A-Za-z0-9_\-]+$/.test(v);
    }
    function safeProxyRoute(value = "", fallback = "/api/image-generate") {
        const v = String(value || "").trim();
        if (!v)
            return fallback;
        if (looksLikeCanvasApiKey(v))
            return fallback;
        if (v.startsWith("/") || isFullHttpUrl(v))
            return v;
        return fallback;
    }
    function sanitizeCanvasAuthFields(rawKey = "", rawEndpoint = "") {
        let apiKey = String(rawKey || "").trim();
        let endpoint = String(rawEndpoint || "").trim();
        const warnings = [];
        if (looksLikeCanvasApiKey(endpoint)) {
            if (!apiKey)
                apiKey = endpoint.replace(/^Bearer\s+/i, "");
            endpoint = "";
            warnings.push("检测到 Endpoint 填成了 API Key，已自动移到密钥栏。");
        }
        if (isFullHttpUrl(apiKey) && !endpoint) {
            endpoint = apiKey;
            apiKey = "";
            warnings.push("检测到 API Key 栏填成了 URL，已自动移到 Endpoint。");
        }
        return { apiKey, endpoint, warnings };
    }
    function normalizeCanvasApiCredentialFields({ silent = false } = {}) {
        const pairs = [
            ["jimengImageKey", "jimengImageEndpoint", "即梦生图"],
            ["jimengVideoKey", "jimengVideoEndpoint", "即梦视频"],
            ["klingImageKey", "klingImageEndpoint", "可灵生图"],
            ["klingVideoKey", "klingVideoEndpoint", "可灵视频"],
        ];
        let changed = false;
        const warnings = [];
        setCanvasApiCredentials(prev => {
            const next = { ...(prev || {}) };
            pairs.forEach(([keyField, endpointField, label]) => {
                const fixed = sanitizeCanvasAuthFields(next[keyField], next[endpointField]);
                if (fixed.apiKey !== String(next[keyField] || "") || fixed.endpoint !== String(next[endpointField] || ""))
                    changed = true;
                next[keyField] = fixed.apiKey;
                next[endpointField] = fixed.endpoint;
                fixed.warnings.forEach(w => warnings.push(`${label}: ${w}`));
            });
            next.lastValidatedAt = new Date().toLocaleString();
            return next;
        });
        if (!silent && warnings.length) {
            const msg = warnings.join("\n");
            setStatus(`API fields auto-fixed / 接口字段已自动修正：${warnings[0]}`);
            if (typeof window !== "undefined")
                window.alert(`已自动修正 API 填写位置：\n\n${msg}\n\nEndpoint 可以留空使用默认即梦/Seedance接口；可灵必须填写完整 https:// 接口地址。`);
        }
        return { changed, warnings };
    }
    function getCanvasApiAuth(provider = "", mediaType = "image") {
        const p = String(provider || "").toLowerCase();
        const isKling = p.includes("kling") || p.includes("可灵");
        const c = canvasApiCredentials || {};
        const prefix = isKling ? "kling" : "jimeng";
        const rawApiKey = mediaType === "video" ? (isKling ? c.klingVideoKey : c.jimengVideoKey) : (isKling ? c.klingImageKey : c.jimengImageKey);
        const rawEndpoint = mediaType === "video" ? (isKling ? c.klingVideoEndpoint : c.jimengVideoEndpoint) : (isKling ? c.klingImageEndpoint : c.jimengImageEndpoint);
        const fixed = sanitizeCanvasAuthFields(rawApiKey, rawEndpoint);
        const queryEndpointRaw = mediaType === "video" ? (isKling ? c.klingVideoQueryEndpoint : c.jimengVideoQueryEndpoint) : "";
        const queryEndpoint = looksLikeCanvasApiKey(queryEndpointRaw) ? "" : String(queryEndpointRaw || "").trim();
        return { apiKey: fixed.apiKey, endpoint: fixed.endpoint, queryEndpoint, authHeader: c.authHeader || "Authorization", providerFamily: prefix, warnings: fixed.warnings };
    }
    function canvasApiReadyFor(provider = "", mediaType = "image") {
        const p = String(provider || "").toLowerCase();
        const isSeed = p.includes("seedream") || p.includes("seedance") || p.includes("火山") || p.includes("volcengine");
        const isKling = p.includes("kling") || p.includes("可灵");
        const auth = getCanvasApiAuth(provider, mediaType);
        if (isKling)
            return Boolean(auth.apiKey && isFullHttpUrl(auth.endpoint));
        return isSeed || Boolean(auth.apiKey) || Boolean(isFullHttpUrl(auth.endpoint));
    }
    function getCanvasImageModelOptions(provider = "") {
        const p = String(provider || "").toLowerCase();
        if (p.includes("kling") || p.includes("可灵")) {
            return [
                { value: "kling-image-agent", label: "Kling Image Agent / 可灵生图智能体", meta: "默认可灵生图工作流" },
                { value: "kling-image-pro", label: "Kling Image Pro / 可灵专业生图", meta: "高质量海报、角色、场景" },
                { value: "kling-image-ref", label: "Kling Reference Image / 可灵参考图模式", meta: "适合角色/场景参考" },
            ];
        }
        if (p.includes("openai"))
            return [{ value: "gpt-image-1", label: "GPT Image 1 / OpenAI 生图", meta: "OpenAI Images" }];
        return [
            { value: "jimeng-image-agent", label: "Jimeng Image Agent / 即梦生图智能体", meta: "自定义即梦智能体" },
            { value: "doubao-seedream-5-0-260128", label: "Seedream 5.0 Pro / 即梦 5.0 专业", meta: "推荐：电影关键帧/商业画面" },
            { value: "doubao-seedream-5-0-lite", label: "Seedream 5.0 Lite / 即梦 5.0 轻量", meta: "快速草图/低成本" },
            { value: "doubao-seedream-4-5-251128", label: "Seedream 4.5 / 即梦 4.5", meta: "稳定通用" },
            { value: "doubao-seedream-4-0-250828", label: "Seedream 4.0 / 即梦 4.0", meta: "兼容旧接口" },
        ];
    }
    function getCanvasVideoModelOptions(provider = "") {
        const p = String(provider || "").toLowerCase();
        if (p.includes("kling") || p.includes("可灵")) {
            return [
                { value: "kling-video-agent", label: "Kling Video Agent / 可灵视频智能体", meta: "自定义可灵代理" },
                { value: "kling-o3", label: "Kling O3 / 可灵 O3", meta: "高质量运镜/图生视频" },
                { value: "kling-3-0", label: "Kling 3.0 / 可灵 3.0", meta: "通用视频生成" },
                { value: "kling-o1", label: "Kling O1 / 可灵 O1", meta: "轻量快速" },
            ];
        }
        return [
            { value: "jimeng-video-agent", label: "Jimeng Video Agent / 即梦视频智能体", meta: "自定义即梦智能体" },
            { value: "doubao-seedance-2-0-pro-260511", label: "Seedance 2.0 Pro / 即梦 Seedance 2.0 Pro", meta: "推荐：高质视频" },
            { value: "doubao-seedance-2-0-lite-260511", label: "Seedance 2.0 Lite / 即梦 Seedance 2.0 Lite", meta: "快速预览" },
            { value: "doubao-seedance-1-5-pro-251215", label: "Seedance 1.5 Pro / Seedance 1.5", meta: "兼容稳定" },
            { value: "doubao-seedance-1-0-lite-i2v-250428", label: "Seedance 1.0 I2V / 图生视频 Lite", meta: "首帧图生视频" },
        ];
    }
    function updateCanvasNodeSetting(nodeId, patch = {}) {
        const id = String(nodeId || "");
        if (!id)
            return;
        setCanvasNodeAssets(prev => ({ ...prev, [id]: { ...(prev[id] || {}), ...patch, updatedAt: new Date().toLocaleString() } }));
    }
    function updateCanvasNodeCameraSetting(nodeId, key, value) {
        const id = String(nodeId || "");
        if (!id)
            return;
        setCanvasNodeAssets(prev => {
            const before = prev[id] || {};
            return { ...prev, [id]: { ...before, cameraSettings: { ...(before.cameraSettings || {}), [key]: value }, updatedAt: new Date().toLocaleString() } };
        });
    }
    const CANVAS_CAMERA_OPTIONS = {
        framing: ["ECU 大特写", "CU 特写", "MCU 中近景", "MS 中景", "FS 全景", "WS 远景", "EWS 超远景"],
        angle: ["Front 正面", "Side 侧面", "Back 背面", "High 高角度", "Low 低角度", "Dutch 倾斜", "OTS 过肩"],
        movement: ["Static 固定", "Push In 推进", "Pull Out 拉远", "Tracking 跟拍", "Orbit 环绕", "Pan 摇镜", "Tilt 俯仰", "Handheld 手持"],
        lens: ["18mm 广角", "24mm 广角", "35mm 自然", "50mm 标准", "65mm 人像", "85mm 特写", "100mm Macro 微距"],
        aperture: ["f/1.4", "f/2", "f/2.8", "f/4", "f/5.6", "f/8"],
    };
    function addQueueItem(kind, title, status = "running", extra = {}) {
        const id = `${kind}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
        setGenerationQueue(prev => [{ id, kind, title, status, startedAt: new Date().toLocaleString(), ...extra }, ...(Array.isArray(prev) ? prev : [])].slice(0, 80));
        return id;
    }
    function updateQueueItem(id, patch = {}) {
        if (!id)
            return;
        setGenerationQueue(prev => (Array.isArray(prev) ? prev : []).map(item => item.id === id ? { ...item, ...patch, updatedAt: new Date().toLocaleString() } : item));
    }
    function inferWorkflowEdgeLabel(edge = {}) {
        const source = getWorkflowNodes().find(n => n.id === edge.source) || {};
        const target = getWorkflowNodes().find(n => n.id === edge.target) || {};
        if (source.type === "image" && target.type === "video")
            return "First Frame / 首帧";
        if (source.type === "text" && ["image", "video", "prompt"].includes(target.type))
            return "Prompt / 提示词";
        if (source.type === "prompt")
            return "Prompt+ / 优化提示词";
        if (source.type === "camera")
            return "Camera / 机位";
        if (source.type === "review")
            return "QC / 审片";
        if (edge.kind === "green")
            return "Ready / 可用";
        if (edge.kind === "gold")
            return "Lock / 锁定";
        return "Flow / 流程";
    }
    function getCanvasTimelineItems() {
        const nodes = getWorkflowNodes();
        return nodes.map(n => {
            const asset = canvasNodeAssets?.[n.id] || {};
            const videoUrl = asset.videoUrl || asset.url || "";
            if (!videoUrl && n.type !== "video")
                return null;
            return { id: n.id, title: n.title || n.titleZh || n.id, status: asset.status || n.status || "draft", videoUrl, duration: asset.duration || videoApiSettings.duration || "5", provider: asset.videoProvider || videoApiSettings.provider };
        }).filter(Boolean);
    }
    async function generateImageForShot(shot, index = 0) {
        const prompt = buildShotKeyframePrompt(shot, project, style, tech, visualLocks);
        const id = String(shot.id || index + 1);
        setShotKeyframes(prev => ({ ...prev, [id]: { ...(prev[id] || {}), status: "generating", prompt, shotTitle: shot.titleZh || shot.titleEn, images: prev[id]?.images || [] } }));
        const imageAuth = getCanvasApiAuth(imageApiSettings.provider, "image");
        const body = { provider: imageApiSettings.provider, model: imageApiSettings.model, prompt, size: imageApiSettings.size, quality: imageApiSettings.quality, n: Math.max(1, Math.min(4, Number(imageApiSettings.candidates || 1))), ...imageAuth, shot: { id, titleZh: shot.titleZh, titleEn: shot.titleEn } };
        const queueId = addQueueItem("image", `Shot ${id} image / 镜头${id}生图`, "running", { provider: imageApiSettings.provider });
        const res = await fetch(safeProxyRoute(imageApiSettings.endpoint, "/api/image-generate"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) {
            updateQueueItem(queueId, { status: "failed" });
            const raw = await res.text();
            let msg = raw;
            try {
                const j = JSON.parse(raw);
                msg = [j.error, j.hint].filter(Boolean).join(" · ");
            }
            catch (_) { }
            throw new Error(`Image API Error ${res.status}: ${String(msg).slice(0, 420)}`);
        }
        const data = await res.json();
        const images = Array.isArray(data.images) ? data.images : Array.isArray(data.data) ? data.data : [];
        const normalizedImages = images.map((img, i) => ({ ...img, id: `${id}-${Date.now()}-${i}`, prompt, provider: imageApiSettings.provider, model: imageApiSettings.model, createdAt: new Date().toLocaleString() }));
        setShotKeyframes(prev => ({ ...prev, [id]: { status: "done", prompt, shotTitle: shot.titleZh || shot.titleEn, selectedIndex: 0, images: normalizedImages, updatedAt: new Date().toLocaleString() } }));
        updateQueueItem(queueId, { status: "done", count: normalizedImages.length });
        return normalizedImages;
    }
    function getCanvasNodePrompt(node = null) {
        const source = node || getWorkflowNodes().find(n => n.id === canvasSelectedNode) || {};
        const asset = canvasNodeAssets?.[source.id] || {};
        const own = String(asset.translatedPrompt || asset.prompt || asset.output || asset.draft || source.prompt || source.body || "").trim();
        return buildCanvasPromptWithUpstream(source, own || "A cinematic production frame, premium lighting, clear subject, professional composition");
    }
    function updateCanvasNodeDraft(nodeId, value) {
        const id = String(nodeId || "");
        if (!id)
            return;
        setCanvasNodeAssets(prev => ({ ...prev, [id]: { ...(prev[id] || {}), draft: value, status: String(value || "").trim() ? "draft" : (prev[id]?.status || "empty"), updatedAt: new Date().toLocaleString() } }));
    }
    function getCanvasNodeDraft(node = null) {
        const source = node || getWorkflowNodes().find(n => n.id === canvasSelectedNode) || {};
        const asset = canvasNodeAssets?.[source.id] || {};
        return String(asset.draft ?? asset.prompt ?? source.prompt ?? source.body ?? (source.type === "text" ? "写下你想讲的故事、场景或角色设定。" : "描述你想生成的画面、动作、镜头、情绪和参考素材。"));
    }
    function getIncomingCanvasNodes(nodeId) {
        const id = String(nodeId || "");
        if (!id)
            return [];
        const nodes = getWorkflowNodes();
        const map = Object.fromEntries(nodes.map(n => [n.id, n]));
        return getWorkflowEdges().filter(e => e.target === id).map(e => map[e.source]).filter(Boolean);
    }
    function getOutgoingCanvasNodes(nodeId) {
        const id = String(nodeId || "");
        if (!id)
            return [];
        const nodes = getWorkflowNodes();
        const map = Object.fromEntries(nodes.map(n => [n.id, n]));
        return getWorkflowEdges().filter(e => e.source === id).map(e => map[e.target]).filter(Boolean);
    }
    function getCanvasNodeOutputText(node) {
        if (!node)
            return "";
        const asset = canvasNodeAssets?.[node.id] || {};
        const img = (asset.images || [])[Number(asset.selectedIndex || 0)] || null;
        const media = img ? `Image ready: ${img.url || img.image_url || img.uri || img.id || "generated-image"}` : asset.videoUrl ? `Video ready: ${asset.videoUrl}` : asset.taskId ? `Video task: ${asset.taskId}` : "";
        return String(asset.output || asset.translatedPrompt || asset.prompt || asset.draft || node.prompt || node.body || media || "").trim();
    }
    function getUpstreamCanvasContext(node) {
        const sources = getIncomingCanvasNodes(node?.id);
        const chunks = sources.map((n, i) => {
            const value = getCanvasNodeOutputText(n);
            return value ? `#${i + 1} ${n.title}:\n${value}` : "";
        }).filter(Boolean);
        return chunks.join("\n\n").slice(0, 8000);
    }
    function buildCanvasPromptWithUpstream(node, ownPrompt = "") {
        const upstream = getUpstreamCanvasContext(node);
        const own = String(ownPrompt || "").trim();
        if (!upstream)
            return own || String(outlineDraft || script || ideaInput || "").trim();
        if (!own)
            return upstream;
        return [`Use upstream connected context as source material / 请优先继承上游连线节点内容：`, upstream, `Current node instruction / 当前节点指令：`, own].join("\n\n").trim();
    }
    function getCanvasNodeLifecycle(node) {
        const asset = canvasNodeAssets?.[node?.id] || {};
        const status = String(asset.status || node?.status || "idle");
        const hasDraft = Boolean(String(asset.draft || asset.prompt || node?.prompt || node?.body || "").trim());
        const hasImage = Boolean((asset.images || []).length);
        const hasTask = Boolean(asset.taskId);
        const hasVideo = Boolean(asset.videoUrl);
        let key = "empty", label = "Empty / 未填写", pct = 8;
        if (status === "error") {
            key = "error";
            label = "Error / 失败";
            pct = 92;
        }
        else if (status === "thinking" || status === "translating" || status === "generating" || status === "submitting") {
            key = "running";
            label = "Running / 生成中";
            pct = 55;
        }
        else if (hasVideo) {
            key = "video";
            label = "Video Done / 视频完成";
            pct = 100;
        }
        else if (hasTask) {
            key = "task";
            label = "Video Task / 视频任务";
            pct = 82;
        }
        else if (hasImage) {
            key = "image";
            label = "Image Done / 图像完成";
            pct = 68;
        }
        else if (asset.translatedPrompt || asset.output) {
            key = "prompt";
            label = "Prompt Ready / 提示词就绪";
            pct = 46;
        }
        else if (hasDraft) {
            key = "draft";
            label = "Draft / 草稿";
            pct = 25;
        }
        return { key, label, pct, status };
    }
    function pushCanvasNodeHistory(prevAsset, item) {
        const history = Array.isArray(prevAsset?.history) ? prevAsset.history : [];
        return [{ id: Date.now() + Math.random(), time: new Date().toLocaleString(), ...item }, ...history].slice(0, 18);
    }
    function autoLayoutWorkflowCanvas(mode = "horizontal") {
        const nodes = getWorkflowNodes();
        const groups = ["input", "story", "shot", "prompt", "image", "video", "audio", "output", "ritual"];
        const next = {};
        const laneX = Object.fromEntries(groups.map((g, i) => [g, 420 + i * 560]));
        groups.forEach(group => {
            const lane = nodes.filter(n => (n.group || "input") === group);
            lane.forEach((n, idx) => {
                next[n.id] = mode === "vertical"
                    ? { x: 760 + (idx % 3) * 520, y: 360 + groups.indexOf(group) * 420 + Math.floor(idx / 3) * 220 }
                    : { x: laneX[group] || 420, y: 340 + idx * 220 };
            });
        });
        setCanvasNodePositions(next);
        addWorkflowLog(`Auto layout applied / 自动整理画布：${mode}`);
        setStatus("Canvas auto layout complete / 画布已自动整理");
    }
    function centerCanvasToNode(nodeId = canvasSelectedNode) {
        const stage = canvasStageRef.current;
        const n = getWorkflowNodes().find(x => x.id === nodeId);
        if (!stage || !n)
            return;
        const zoom = Math.max(canvasZoom || 1, 0.1);
        stage.scrollTo({ left: Math.max(0, Number(n.x || 0) * zoom - stage.clientWidth / 2 + 180), top: Math.max(0, Number(n.y || 0) * zoom - stage.clientHeight / 2 + 120), behavior: "smooth" });
    }
    async function callDeepSeekForCanvas(messages, options = {}) {
        if (apiMode === "direct" && !apiKey.trim())
            throw new Error("API Key Required / 请输入 DeepSeek API Key");
        const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
        const res = await fetch(deepSeekEndpoint, {
            method: "POST",
            headers: apiHeaders(),
            body: JSON.stringify({ model: apiModel, messages, temperature: options.temperature ?? 0.45 })
        });
        const txt = await res.text();
        if (!res.ok)
            throw new Error(`DeepSeek API Error ${res.status}: ${txt.slice(0, 260)}`);
        let json = {};
        try {
            json = JSON.parse(txt);
        }
        catch {
            json = { raw: txt };
        }
        return String(json?.choices?.[0]?.message?.content || json?.content || json?.raw || "").trim();
    }
    async function runDeepSeekForCanvasNode(node = null) {
        const target = node || getWorkflowNodes().find(n => n.id === canvasSelectedNode);
        if (!target)
            return setStatus("No canvas node selected / 未选择画布节点");
        const id = target.id;
        const draft = getCanvasNodeDraft(target);
        setCanvasNodeAssets(prev => ({ ...prev, [id]: { ...(prev[id] || {}), status: "thinking", draft, updatedAt: new Date().toLocaleString() } }));
        const queueId = addQueueItem("deepseek", target.title || id, "running", { nodeId: id });
        try {
            const upstreamContext = getUpstreamCanvasContext(target);
            const output = await callDeepSeekForCanvas([
                { role: "system", content: "你是北极星AIGC电影级工业系统的画布文本节点。根据用户输入和上游节点内容，输出可直接用于影视AIGC生产的中文内容：故事梗概、场景设定、人物动作、画面意图、镜头关系和可执行提示词。不要空泛，不要解释。" },
                { role: "user", content: [upstreamContext ? `【上游节点内容】\n${upstreamContext}` : "", `【当前节点输入】\n${draft}`].filter(Boolean).join("\n\n") }
            ]);
            setCanvasNodeAssets(prev => { const before = prev[id] || {}; return ({ ...prev, [id]: { ...before, status: "done", draft, output, prompt: output, history: pushCanvasNodeHistory(before, { type: "deepseek", label: "DeepSeek Output", prompt: draft, output }), updatedAt: new Date().toLocaleString() } }); });
            setCanvasCostMetrics(prev => ({ ...prev, deepseek: Number(prev.deepseek || 0) + 1 }));
            updateQueueItem(queueId, { status: "done" });
            addWorkflowLog(`DeepSeek canvas node complete / DeepSeek画布节点完成：${target.title}`);
            setStatus("DeepSeek canvas node complete / DeepSeek 画布节点已生成");
            return output;
        }
        catch (e) {
            setCanvasCostMetrics(prev => ({ ...prev, failed: Number(prev.failed || 0) + 1 }));
            updateQueueItem(queueId, { status: "failed", error: String(e?.message || e) });
            setCanvasNodeAssets(prev => ({ ...prev, [id]: { ...(prev[id] || {}), status: "error", error: String(e?.message || e), updatedAt: new Date().toLocaleString() } }));
            showApiError(e, "Canvas DeepSeek node failed / 画布 DeepSeek 节点失败");
            return "";
        }
    }
    async function translateCanvasNodePrompt(node = null) {
        const target = node || getWorkflowNodes().find(n => n.id === canvasSelectedNode);
        if (!target)
            return setStatus("No canvas node selected / 未选择画布节点");
        const id = target.id;
        const draft = getCanvasNodeDraft(target);
        setCanvasNodeAssets(prev => ({ ...prev, [id]: { ...(prev[id] || {}), status: "translating", draft, updatedAt: new Date().toLocaleString() } }));
        try {
            const translatedPrompt = await callDeepSeekForCanvas([
                { role: "system", content: "Translate and polish the user's Chinese visual/video prompt into a concise professional English AI generation prompt. Keep subject, camera, motion, lighting, style, composition, continuity and negative-risk cues. Return only the English prompt." },
                { role: "user", content: draft }
            ], { temperature: 0.25 });
            setCanvasNodeAssets(prev => { const before = prev[id] || {}; return ({ ...prev, [id]: { ...before, status: "translated", draft, translatedPrompt, prompt: translatedPrompt, history: pushCanvasNodeHistory(before, { type: "translate", label: "Prompt Translated", prompt: draft, output: translatedPrompt }), updatedAt: new Date().toLocaleString() } }); });
            setStatus("Prompt translated / 提示词已翻译优化");
            return translatedPrompt;
        }
        catch (e) {
            showApiError(e, "Prompt translation failed / 提示词翻译失败");
            return "";
        }
    }
    async function generateCameraBlockingForCanvasNode(node = null) {
        const target = node || getWorkflowNodes().find(n => n.id === canvasSelectedNode);
        if (!target)
            return setStatus("No camera node selected / 未选择机位节点");
        const id = target.id;
        const asset = canvasNodeAssets?.[id] || {};
        const settings = asset.cameraSettings || {};
        const source = buildCanvasPromptWithUpstream(target, getCanvasNodeDraft(target));
        const cameraSpec = [
            `Framing / 景别：${settings.framing || "MS 中景"}`,
            `Angle / 角度：${settings.angle || "Front 正面"}`,
            `Movement / 运镜：${settings.movement || "Push In 推进"}`,
            `Lens / 焦段：${settings.lens || "35mm 自然"}`,
            `Aperture / 光圈：${settings.aperture || "f/2.8"}`,
        ].join("\n");
        setCanvasNodeAssets(prev => ({ ...prev, [id]: { ...(prev[id] || {}), status: "thinking", cameraSettings: settings, updatedAt: new Date().toLocaleString() } }));
        try {
            const output = await callDeepSeekForCanvas([
                { role: "system", content: "你是电影摄影指导和机位分镜师。请参考专业工作流软件的机位设置逻辑，输出可执行机位分镜。必须中文为主，附英文术语。" },
                { role: "user", content: `请根据以下素材生成机位分镜，不要空泛，要包含 A-CAM/B-CAM/C-CAM/INSERT/MOVE/SAFETY 六组机位。每组包含：景别、角度、焦段、运动、用途、画面起点、画面终点、适合即梦/可灵视频的提示词。

【当前机位参数】
${cameraSpec}

【上游/节点内容】
${source}` }
            ]);
            setCanvasNodeAssets(prev => { const before = prev[id] || {}; return ({ ...prev, [id]: { ...before, status: "done", output, prompt: output, cameraBoard: output, history: pushCanvasNodeHistory(before, { type: "camera", label: "Camera Blocking / 机位分镜", prompt: source, output }), updatedAt: new Date().toLocaleString() } }); });
            setCanvasCostMetrics(prev => ({ ...prev, deepseek: Number(prev.deepseek || 0) + 1 }));
            addWorkflowLog(`Camera blocking generated / 机位分镜已生成：${target.title}`);
            setStatus("Camera blocking generated / 机位分镜已生成");
            return output;
        }
        catch (e) {
            setCanvasCostMetrics(prev => ({ ...prev, failed: Number(prev.failed || 0) + 1 }));
            setCanvasNodeAssets(prev => ({ ...prev, [id]: { ...(prev[id] || {}), status: "error", error: String(e?.message || e), updatedAt: new Date().toLocaleString() } }));
            showApiError(e, "Camera blocking failed / 机位分镜生成失败");
            return "";
        }
    }
    async function generateImageForCanvasNode(node = null) {
        const target = node || getWorkflowNodes().find(n => n.id === canvasSelectedNode);
        if (!target)
            return setStatus("No canvas node selected / 未选择画布节点");
        const prompt = getCanvasNodePrompt(target);
        const id = target.id;
        const nodeAsset = canvasNodeAssets?.[id] || {};
        const provider = nodeAsset.provider || imageApiSettings.provider || "Jimeng Image Agent / 即梦生图智能体";
        const model = nodeAsset.model || imageApiSettings.model || (String(provider).includes("Kling") || String(provider).includes("可灵") ? "kling-image-agent" : "jimeng-image-agent");
        setCanvasNodeAssets(prev => ({ ...prev, [id]: { ...(prev[id] || {}), type: "image", status: "generating", prompt, provider, model, updatedAt: new Date().toLocaleString() } }));
        try {
            const imageAuth = getCanvasApiAuth(provider, "image");
            const body = { provider, model, prompt, size: imageApiSettings.size, quality: imageApiSettings.quality, n: Math.max(1, Math.min(4, Number(imageApiSettings.candidates || 1))), ...imageAuth, node: { id, title: target.title } };
            const queueId = addQueueItem("image", target.title || id, "running", { nodeId: id, provider });
            const res = await fetch(safeProxyRoute(imageApiSettings.endpoint, "/api/image-generate"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            if (!res.ok) {
                updateQueueItem(queueId, { status: "failed" });
                const raw = await res.text();
                let msg = raw;
                try {
                    const j = JSON.parse(raw);
                    msg = [j.error, j.hint].filter(Boolean).join(" · ");
                }
                catch (_) { }
                throw new Error(`Image API Error ${res.status}: ${String(msg).slice(0, 420)}`);
            }
            const data = await res.json();
            const images = Array.isArray(data.images) ? data.images : Array.isArray(data.data) ? data.data : [];
            const normalizedImages = images.map((img, i) => ({ ...img, id: `${id}-${Date.now()}-${i}`, prompt, provider, model, createdAt: new Date().toLocaleString() }));
            setCanvasNodeAssets(prev => { const before = prev[id] || {}; return ({ ...prev, [id]: { ...before, type: "image", status: "done", prompt, provider, model, images: normalizedImages, selectedIndex: 0, history: pushCanvasNodeHistory(before, { type: "image", label: "Image Generation", prompt, provider, model, images: normalizedImages }), updatedAt: new Date().toLocaleString() } }); });
            updateQueueItem(queueId, { status: "done", count: normalizedImages.length });
            addWorkflowLog(`Canvas image generated / 画布节点生图完成：${target.title}`);
            setStatus(`Canvas image generated / 画布节点生图完成：${target.title}`);
            return normalizedImages;
        }
        catch (e) {
            setCanvasNodeAssets(prev => ({ ...prev, [id]: { ...(prev[id] || {}), type: "image", status: "error", error: String(e?.message || e), updatedAt: new Date().toLocaleString() } }));
            showApiError(e, "Canvas image generation failed / 画布节点生图失败");
            return [];
        }
    }
    async function generateVideoForCanvasNode(node = null) {
        const target = node || getWorkflowNodes().find(n => n.id === canvasSelectedNode);
        if (!target)
            return setStatus("No canvas node selected / 未选择画布节点");
        const prompt = getCanvasNodePrompt(target);
        const id = target.id;
        const nodeAsset = canvasNodeAssets?.[id] || {};
        const provider = nodeAsset.videoProvider || videoApiSettings.provider || "Jimeng Video Agent / 即梦视频智能体";
        const model = nodeAsset.videoModel || videoApiSettings.model || (String(provider).includes("Kling") || String(provider).includes("可灵") ? "kling-video-agent" : "jimeng-video-agent");
        const imageAsset = canvasNodeAssets[id]?.images?.[canvasNodeAssets[id]?.selectedIndex || 0];
        const firstFrameUrl = imageAsset?.url || imageAsset?.image_url || imageAsset?.uri || "";
        setCanvasNodeAssets(prev => ({ ...prev, [id]: { ...(prev[id] || {}), type: "video", status: "submitting", prompt, videoProvider: provider, videoModel: model, updatedAt: new Date().toLocaleString() } }));
        try {
            const videoAuth = getCanvasApiAuth(provider, "video");
            const queueId = addQueueItem("video", target.title || id, "running", { nodeId: id, provider });
            const res = await fetch(safeProxyRoute(videoApiSettings.endpoint, "/api/video-generate"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", provider, model, prompt, resolution: videoApiSettings.resolution, ratio: videoApiSettings.ratio, duration: videoApiSettings.duration, seed: videoApiSettings.seed, cameraFixed: videoApiSettings.cameraFixed, watermark: videoApiSettings.watermark, generateAudio: videoApiSettings.generateAudio, firstFrameUrl, ...videoAuth }) });
            if (!res.ok) {
                updateQueueItem(queueId, { status: "failed" });
                const raw = await res.text();
                let msg = raw;
                try {
                    const j = JSON.parse(raw);
                    msg = [j.error, j.hint].filter(Boolean).join(" · ");
                }
                catch (_) { }
                throw new Error(`Video API Error ${res.status}: ${String(msg).slice(0, 460)}`);
            }
            const data = await res.json();
            setCanvasNodeAssets(prev => { const before = prev[id] || {}; return ({ ...prev, [id]: { ...before, type: "video", status: data.status || "submitted", taskId: data.taskId || data.task_id || data.id || "", videoUrl: data.videoUrl || data.video_url || data.url || "", raw: data, prompt, videoProvider: provider, videoModel: model, history: pushCanvasNodeHistory(before, { type: "video", label: "Video Task", prompt, provider, model, taskId: data.taskId || data.task_id || data.id || "", videoUrl: data.videoUrl || data.video_url || data.url || "" }), updatedAt: new Date().toLocaleString() } }); });
            updateQueueItem(queueId, { status: data.videoUrl || data.url ? "done" : "submitted", taskId: data.taskId || data.task_id || data.id || "" });
            addWorkflowLog(`Canvas video submitted / 画布视频任务已提交：${target.title}`);
            setStatus(`Canvas video submitted / 画布视频任务已提交：${target.title}`);
            return data;
        }
        catch (e) {
            setCanvasNodeAssets(prev => ({ ...prev, [id]: { ...(prev[id] || {}), type: "video", status: "error", error: String(e?.message || e), updatedAt: new Date().toLocaleString() } }));
            showApiError(e, "Canvas video generation failed / 画布视频生成失败");
            return null;
        }
    }
    async function pollCanvasNodeVideo(node = null) {
        const target = node || getWorkflowNodes().find(n => n.id === canvasSelectedNode);
        if (!target)
            return setStatus("No canvas node selected / 未选择画布节点");
        const id = target.id;
        const taskId = canvasNodeAssets[id]?.taskId;
        if (!taskId)
            return setStatus("No video task ID on this canvas node / 当前节点没有视频任务ID");
        try {
            const provider = canvasNodeAssets[id]?.videoProvider || videoApiSettings.provider || "Jimeng Video Agent / 即梦视频智能体";
            const videoAuth = getCanvasApiAuth(provider, "video");
            const res = await fetch(safeProxyRoute(videoApiSettings.endpoint, "/api/video-generate"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "query", provider, taskId, ...videoAuth }) });
            if (!res.ok) {
                const raw = await res.text();
                let msg = raw;
                try {
                    const j = JSON.parse(raw);
                    msg = [j.error, j.hint].filter(Boolean).join(" · ");
                }
                catch (_) { }
                throw new Error(`Video Poll Error ${res.status}: ${String(msg).slice(0, 460)}`);
            }
            const data = await res.json();
            setCanvasNodeAssets(prev => { const before = prev[id] || {}; const nextUrl = data.videoUrl || data.video_url || data.url || before.videoUrl || ""; return ({ ...prev, [id]: { ...before, status: data.status || before.status || "submitted", videoUrl: nextUrl, raw: data, history: pushCanvasNodeHistory(before, { type: "poll", label: "Video Poll", status: data.status || "updated", videoUrl: nextUrl }), updatedAt: new Date().toLocaleString() } }); });
            setStatus(`Canvas video status / 画布视频状态：${data.status || "updated"}`);
            return data;
        }
        catch (e) {
            showApiError(e, "Canvas video polling failed / 画布视频查询失败");
            return null;
        }
    }
    async function handleGenerateShotKeyframe(index = activeShot) {
        const prepared = rebuildFinalPrompts(shots);
        const shot = prepared[index];
        if (!shot)
            return setStatus("No active shot / 当前没有可生成关键帧的镜头");
        setIsGeneratingKeyframes(true);
        setStatus(`Generating keyframe for Shot ${index + 1} / 正在生成第 ${index + 1} 镜关键帧`);
        try {
            await generateImageForShot(shot, index);
            setStatus(`Shot ${index + 1} keyframe generated / 第 ${index + 1} 镜关键帧已生成`);
        }
        catch (e) {
            showApiError(e, "Image generation failed / 图片生成失败");
        }
        finally {
            setIsGeneratingKeyframes(false);
        }
    }
    async function handleGenerateAllShotKeyframes(sourceShots = null, options = {}) {
        const prepared = rebuildFinalPrompts(Array.isArray(sourceShots) && sourceShots.length ? sourceShots : shots);
        if (!prepared.length)
            return setStatus("No shots to generate keyframes / 还没有分镜，无法生成关键帧");
        if (!options.skipConfirm && !confirmVisualGeneration("Generate All Shot Keyframes / 生成全部分镜关键帧", prepared))
            return setStatus("Keyframe generation cancelled / 已取消关键帧生成，未调用图片接口");
        setIsGeneratingKeyframes(true);
        showRitual("SHOT KEYFRAME STUDIO / 分镜关键帧工作室", "Generating Shot Keyframes / 正在生成分镜关键帧", `共 ${prepared.length} 个镜头 · ${imageApiSettings.provider}`, 38);
        try {
            for (let i = 0; i < prepared.length; i += 1) {
                setStatus(`Generating keyframe ${i + 1}/${prepared.length} / 正在生成关键帧 ${i + 1}/${prepared.length}`);
                await generateImageForShot(prepared[i], i);
            }
            showRitual("KEYFRAMES READY / 关键帧完成", "Visual Pre-production Deck Ready / 视觉前期板已生成", `已生成 ${prepared.length} 个镜头关键帧，可进入视觉锁定与视频模型路由。`, 100);
            setStatus("All shot keyframes generated / 全部分镜关键帧已生成");
        }
        catch (e) {
            showApiError(e, "Batch keyframe generation failed / 批量关键帧生成失败");
        }
        finally {
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
        if (!shot)
            return setStatus("No shot selected / 没有选中的镜头");
        const hero = frame?.images?.[frame.selectedIndex || 0];
        const summary = buildVisualLockSummaryFromShot(shot, hero);
        setVisualLocks(prev => ({ ...prev, [type]: { ...(prev[type] || {}), ...summary } }));
        if (type === "character")
            setCharacterAssets(prev => [{ id: Date.now(), title: shot.titleZh || "角色资产", ...summary }, ...prev].slice(0, 24));
        if (type === "location")
            setLocationAssets(prev => [{ id: Date.now(), title: shot.titleZh || "场景资产", ...summary }, ...prev].slice(0, 24));
        setStatus(`Visual lock saved / 已保存视觉锁定：${type}`);
    }
    function handleBuildVideoModelRouter(sourceShots = null) {
        const prepared = rebuildFinalPrompts(Array.isArray(sourceShots) && sourceShots.length ? sourceShots : shots);
        const rows = prepared.map((s, i) => {
            const frame = shotKeyframes[String(s.id || i + 1)];
            const hero = frame?.images?.[frame.selectedIndex || 0];
            return { ...buildVideoRouteForShot(s, hero), shotIndex: i + 1, title: s.titleZh || s.titleEn, hasHeroFrame: Boolean(hero), provider: videoApiSettings.provider, model: videoApiSettings.model };
        });
        setVideoModelRouting(rows);
        setStatus("Video model routing built / 视频模型路由建议已生成");
        return rows;
    }
    function getShotHeroFrame(shot, index = 0) {
        const key = String(shot?.id || index + 1);
        const frame = shotKeyframes?.[key] || {};
        return (frame.images || [])[Number(frame.selectedIndex || 0)] || null;
    }
    function getShotVideoRecord(shot, index = 0) {
        const key = String(shot?.id || index + 1);
        return shotVideos?.[key] || null;
    }
    function buildVideoGenerationPrompt(shot, index = 0) {
        const route = videoModelRouting.find(r => Number(r.shotIndex) === index + 1) || null;
        const lines = [
            `Project: ${project}`,
            `Shot ${index + 1}: ${shot?.titleZh || shot?.titleEn || "Untitled"}`,
            `Visual: ${shot?.sceneZh || shot?.sceneEn || ""}`,
            `Action Start: ${shot?.actionStartZh || shot?.openingFrameZh || ""}`,
            `Action End: ${shot?.actionEndZh || shot?.endingFrameZh || ""}`,
            `Camera: ${shot?.cameraLanguagePromptZh || shot?.move || shot?.lens || "cinematic camera movement"}`,
            `Continuity: ${shot?.continuityAnchorPromptZh || shot?.sceneImageContinuityNotesZh || "keep character, costume, props, lighting and screen direction consistent"}`,
            `Model Route: ${route?.model || videoApiSettings.model}`,
            `Negative: ${shot?.negativePromptStudioZh || shot?.sceneImageNegativeZh || negativePrompt}`,
        ];
        return lines.filter(Boolean).join("\n");
    }
    function extractNestedVideoUrl(value) {
        if (!value)
            return "";
        if (typeof value === "string")
            return value;
        if (Array.isArray(value)) {
            for (const item of value) {
                const found = extractNestedVideoUrl(item);
                if (found)
                    return found;
            }
            return "";
        }
        if (typeof value === "object") {
            return value.videoUrl || value.video_url || value.url || value.uri || value.download_url || value?.video?.url || value?.video?.video_url || value?.file?.url || value?.content?.video_url || value?.output?.video_url || extractNestedVideoUrl(value.content) || extractNestedVideoUrl(value.output) || extractNestedVideoUrl(value.outputs) || extractNestedVideoUrl(value.videos) || extractNestedVideoUrl(value.data) || "";
        }
        return "";
    }
    function normalizeVideoTaskRecord(data = {}, previous = {}) {
        const d = data?.data || data?.result || data || {};
        const taskId = data.taskId || data.task_id || data.id || d.taskId || d.task_id || d.id || d?.task?.id || previous.taskId || "";
        const status = data.status || d.status || data.state || d.state || data.task_status || d.task_status || previous.status || "submitted";
        const videoUrl = extractNestedVideoUrl(data) || extractNestedVideoUrl(d) || previous.videoUrl || "";
        const coverUrl = data.coverUrl || data.cover_url || d.coverUrl || d.cover_url || d?.cover?.url || previous.coverUrl || "";
        const progress = data.progress ?? d.progress ?? d?.task?.progress ?? previous.progress ?? null;
        return { ...previous, taskId, status, videoUrl, coverUrl, progress, raw: data, updatedAt: new Date().toLocaleString() };
    }
    async function generateVideoForShot(shot, index = 0, options = {}) {
        const key = String(shot?.id || index + 1);
        const hero = getShotHeroFrame(shot, index);
        const firstFrame = hero ? frameImageSrc(hero) : "";
        const prompt = buildVideoGenerationPrompt(shot, index);
        const payload = {
            action: "create",
            provider: videoApiSettings.provider,
            model: videoApiSettings.model,
            prompt,
            image: firstFrame,
            firstFrameUrl: firstFrame,
            mode: firstFrame ? "image-to-video" : "text-to-video",
            resolution: videoApiSettings.resolution,
            duration: Number(videoApiSettings.duration || 5),
            ratio: videoApiSettings.ratio,
            seed: Number(videoApiSettings.seed || 0),
            cameraFixed: Boolean(videoApiSettings.cameraFixed),
            watermark: Boolean(videoApiSettings.watermark),
            generateAudio: Boolean(videoApiSettings.generateAudio),
            shot: { id: key, index: index + 1, titleZh: shot?.titleZh, titleEn: shot?.titleEn },
            ...getCanvasApiAuth(videoApiSettings.provider, "video"),
        };
        setShotVideos(prev => ({ ...prev, [key]: { ...(prev[key] || {}), status: "creating", prompt, provider: videoApiSettings.provider, model: videoApiSettings.model, updatedAt: new Date().toLocaleString() } }));
        const queueId = addQueueItem("video", `Shot ${key} video / 镜头${key}视频`, "running", { provider: videoApiSettings.provider });
        const res = await fetch(safeProxyRoute(videoApiSettings.endpoint, "/api/video-generate"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) {
            updateQueueItem(queueId, { status: "failed" });
            throw new Error(`Video API Error ${res.status}: ${(await res.text()).slice(0, 320)}`);
        }
        const data = await res.json();
        const record = normalizeVideoTaskRecord(data, { prompt, provider: videoApiSettings.provider, model: videoApiSettings.model, firstFrame, shotTitle: shot?.titleZh || shot?.titleEn });
        setShotVideos(prev => ({ ...prev, [key]: record }));
        updateQueueItem(queueId, { status: record.videoUrl ? "done" : "submitted", taskId: record.taskId });
        if (videoApiSettings.autoPoll && record.taskId && !record.videoUrl && !options.skipPoll) {
            window.setTimeout(() => pollVideoTask(key, record.taskId), 1500);
        }
        return record;
    }
    async function pollVideoTask(shotId, taskId = null) {
        const key = String(shotId || rebuildFinalPrompts(shots)?.[activeShot]?.id || activeShot + 1);
        const current = shotVideos?.[key] || {};
        const id = taskId || current.taskId;
        if (!id)
            return setStatus("No video task id / 当前镜头没有视频任务ID");
        setShotVideos(prev => ({ ...prev, [key]: { ...(prev[key] || {}), status: prev[key]?.status || "querying", updatedAt: new Date().toLocaleString() } }));
        try {
            const payload = { action: "query", provider: videoApiSettings.provider, taskId: id, ...getCanvasApiAuth(videoApiSettings.provider, "video") };
            const res = await fetch(safeProxyRoute(videoApiSettings.endpoint, "/api/video-generate"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            if (!res.ok)
                throw new Error(`Video Query Error ${res.status}: ${(await res.text()).slice(0, 260)}`);
            const data = await res.json();
            const record = normalizeVideoTaskRecord(data, current);
            setShotVideos(prev => ({ ...prev, [key]: record }));
            setStatus(`Video task updated / 视频任务已更新：${record.status || "unknown"}`);
            return record;
        }
        catch (e) {
            showApiError(e, "Video task query failed / 视频任务查询失败");
            return null;
        }
    }
    async function handleGenerateShotVideo(index = activeShot) {
        const prepared = rebuildFinalPrompts(shots);
        const shot = prepared[index];
        if (!shot)
            return setStatus("No active shot / 当前没有可生成视频的镜头");
        setIsGeneratingVideos(true);
        setStatus(`Creating video task for Shot ${index + 1} / 正在创建第 ${index + 1} 镜视频任务`);
        try {
            await generateVideoForShot(shot, index);
            setStatus(`Video task submitted for Shot ${index + 1} / 第 ${index + 1} 镜视频任务已提交`);
        }
        catch (e) {
            showApiError(e, "Video generation failed / 视频生成失败");
        }
        finally {
            setIsGeneratingVideos(false);
        }
    }
    async function handleGenerateAllShotVideos() {
        const prepared = rebuildFinalPrompts(shots);
        if (!prepared.length)
            return setStatus("No shots to generate videos / 还没有分镜，无法生成视频");
        if (typeof window !== "undefined" && !window.confirm(`即将向 ${videoApiSettings.provider} 提交 ${prepared.length} 个视频任务，可能产生费用。继续吗？`))
            return;
        setIsGeneratingVideos(true);
        try {
            if (!videoModelRouting.length)
                handleBuildVideoModelRouter(prepared);
            for (let i = 0; i < prepared.length; i += 1) {
                setStatus(`Submitting video ${i + 1}/${prepared.length} / 正在提交视频任务 ${i + 1}/${prepared.length}`);
                await generateVideoForShot(prepared[i], i, { skipPoll: true });
            }
            setStatus("All video tasks submitted / 全部视频任务已提交，可稍后查询状态");
        }
        catch (e) {
            showApiError(e, "Batch video generation failed / 批量视频生成失败");
        }
        finally {
            setIsGeneratingVideos(false);
        }
    }
    async function handlePollAllVideoTasks() {
        const entries = Object.entries(shotVideos || {}).filter(([, v]) => v?.taskId);
        if (!entries.length)
            return setStatus("No video tasks to poll / 暂无可查询的视频任务");
        for (const [shotId, v] of entries)
            await pollVideoTask(shotId, v.taskId);
    }
    function getVisualGenerationEstimate(sourceShots = null) {
        const prepared = rebuildFinalPrompts(Array.isArray(sourceShots) && sourceShots.length ? sourceShots : shots);
        const shotCount = prepared.length || Math.max(1, Number(tech.shotCount || 8));
        const candidates = Math.max(1, Math.min(4, Number(imageApiSettings.candidates || 1)));
        const totalImages = shotCount * candidates;
        return { shotCount, candidates, totalImages, provider: imageApiSettings.provider, model: imageApiSettings.model, size: imageApiSettings.size };
    }
    function confirmVisualGeneration(actionLabel = "Generate keyframes / 生成关键帧", sourceShots = null) {
        if (typeof window === "undefined")
            return true;
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
        downloadTextFile(`${safeName(project)}_Polaris_V10_4_Image_to_Video_Pack.txt`, pack, "text/plain;charset=utf-8");
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
            if (!res.ok)
                throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 180)}`);
            const data = await res.json();
            const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
            const promptReport = buildPromptQualityReport(shots, tech, douyinViral);
            setQualityReport({ ...parsed, promptQuality: promptReport, score: parsed.score || promptReport.score });
            setStatus(`Quality report ready / 质量检查完成：${parsed.score || promptReport.score || "-"}分`);
        }
        catch (e) {
            const local = localQualityReport(shots, tech, douyinViral);
            const promptReport = buildPromptQualityReport(shots, tech, douyinViral);
            setQualityReport({ ...local, ...promptReport, error: String(e.message || e) });
            setStatus(`Quality Check Error, local fallback used / 质量检查失败，已使用本地兜底：${e.message}`);
        }
        finally {
            setIsCheckingQuality(false);
        }
    }
    async function handleOneClickProduction(options = {}) {
        if (isOneClickRunning || isGenerating)
            return;
        const includeImages = options?.includeImages ?? productionFlowMode === "full-visual";
        const hasIdeaOrScript = ideaInput.trim() || outlineDraft.trim() || script.trim();
        if (!hasIdeaOrScript)
            return setStatus("Please enter an idea or script first / 请先输入想法或剧本");
        if (apiMode === "direct" && !apiKey.trim())
            return setStatus("API Key Required / 请输入 DeepSeek API Key");
        setIsOneClickRunning(true);
        try {
            setStatus(includeImages ? "Full visual production started / 完整视觉流程开始：提示词 + 关键帧" : "Prompt-only production started / 只生成提示词流程开始");
            if ((referenceUrl.trim() || extractFirstUrl(ideaInput)) && referenceIngest.status === "idle")
                await handleIngestReference();
            let localOutline = "";
            if (ideaInput.trim()) {
                // 客户输入一旦存在，必须以本轮输入重新生成大纲，避免旧剧本/默认脚本污染。
                setScript("");
                setShots([]);
                setShotPlanRows([]);
                const generatedOutline = await handleGenerateScriptOutline();
                localOutline = String(generatedOutline || "").trim();
            }
            else {
                localOutline = outlineDraft.trim();
                if (!script.trim() && !localOutline) {
                    const generatedOutline = await handleGenerateScriptOutline();
                    localOutline = String(generatedOutline || "").trim();
                }
            }
            const effective = (localOutline || (ideaInput.trim() ? ideaInput : script)).trim();
            if (effective)
                setScript(effective);
            if (!shotPlanRows.length && effective)
                await handleGenerateShotPlan(effective);
            const generatedShots = await handleGenerate(effective || script);
            if (generatedShots?.length) {
                setTimeout(() => handleRunQualityCheck(), 900);
                if (includeImages) {
                    setStatus("Prompt package complete, entering keyframe generation / 提示词包已完成，进入关键帧生成");
                    await handleGenerateAllShotKeyframes(generatedShots, { skipConfirm: true });
                    handleBuildVideoModelRouter(generatedShots);
                    setProjectStudioOpen(true);
                    setProjectStudioTab("visual");
                }
                else {
                    setStatus("Prompt-only package complete / 只生成提示词流程完成，未自动调用图片生成接口");
                    setProjectStudioOpen(true);
                    setProjectStudioTab("prompt");
                }
            }
        }
        finally {
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
        if (!workflowNodes.length)
            setWorkflowNodes(buildDefaultWorkflowNodes());
        if (!workflowEdges.length)
            setWorkflowEdges(buildDefaultWorkflowEdges());
        setCanvasApiGateOpen(true);
        setStatus("Infinite Visual Canvas opened / 全屏无限视觉画布已打开，请先确认即梦与可灵接口");
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
            { id: "engine-ignition", type: "ritual", group: "ritual", title: "Engine Ignition / 引擎点火", action: "engine", x: 520, y: 420 },
            { id: "idea-input", type: "text", group: "input", title: "需求输入 / Idea Brief", action: "input", x: 820, y: 420 },
            { id: "reference-ingest", type: "text", group: "input", title: "参考解析 / Reference URL", action: "reference", x: 820, y: 690 },
            { id: "word-script", type: "text", group: "input", title: "剧本文档 / Script Upload", action: "word", x: 820, y: 960 },
            { id: "story-core", type: "ai", group: "story", title: "DeepSeek 故事核心 / Story Core", action: "story", x: 1160, y: 560 },
            { id: "outline-writer", type: "ai", group: "story", title: "大纲生成 / Outline Writer", action: "outline", x: 1500, y: 560 },
            { id: "outline-polish", type: "ai", group: "story", title: "大纲打磨 / Script Polish", action: "outline-polish", x: 1840, y: 560 },
            { id: "shot-planner", type: "shot", group: "shot", title: "镜头规划 / Shot Planner", action: "shot-plan", x: 2180, y: 420 },
            { id: "shot-generator", type: "shot", group: "shot", title: "分镜生成 / Shot Generator", action: "shots", x: 2520, y: 420 },
            { id: "continuity-check", type: "camera", group: "shot", title: "机位分镜 / Camera Blocking", action: "continuity", x: 2520, y: 710 },
            { id: "prompt-compiler", type: "prompt", group: "prompt", title: "提示词编译 / Prompt Compiler", action: "prompt-compile", x: 2860, y: 560 },
            { id: "prompt-debugger", type: "prompt", group: "prompt", title: "提示词诊断 / Prompt Debugger", action: "prompt-debug", x: 3200, y: 560 },
            { id: "scene-prompt", type: "image", group: "image", title: "图像提示 / Image Prompt", action: "scene-prompt", x: 3540, y: 380 },
            { id: "seedream-keyframe", type: "image", group: "image", title: "Seedream 生图 / Image Generate", action: "seedream", x: 3880, y: 380 },
            { id: "visual-lock", type: "image", group: "image", title: "视觉锁定 / Visual Lock", action: "visual-lock", x: 4220, y: 380 },
            { id: "model-router", type: "video", group: "video", title: "视频路线 / Video Router", action: "router", x: 3540, y: 770 },
            { id: "video-generate", type: "video", group: "video", title: "即梦智能体 / Video Generate", action: "video-generate", x: 3880, y: 770 },
            { id: "i2v-pack", type: "video", group: "video", title: "图生视频包 / I2V Pack", action: "i2v-pack", x: 4220, y: 770 },
            { id: "prompt-pack", type: "output", group: "output", title: "提示词包 / Prompt Pack", action: "prompt-pack", x: 4560, y: 560 },
            { id: "chief-seal", type: "ritual", group: "ritual", title: "项目封板 / Chief Seal", action: "seal", x: 4900, y: 560 },
            { id: "delivery-pack", type: "output", group: "output", title: "交付导出 / Delivery", action: "delivery", x: 5240, y: 560 },
        ];
    }
    function buildDefaultWorkflowEdges() {
        return [
            ["engine-ignition", "idea-input", "gold"],
            ["idea-input", "story-core", "text"], ["reference-ingest", "story-core", "text"], ["word-script", "story-core", "text"],
            ["story-core", "outline-writer", "text"], ["outline-writer", "outline-polish", "text"],
            ["outline-polish", "shot-planner", "text"], ["shot-planner", "shot-generator", "text"], ["shot-generator", "continuity-check", "blue"],
            ["continuity-check", "prompt-compiler", "purple"], ["prompt-compiler", "prompt-debugger", "purple"],
            ["prompt-debugger", "scene-prompt", "blue"], ["scene-prompt", "seedream-keyframe", "blue"], ["seedream-keyframe", "visual-lock", "blue"],
            ["visual-lock", "model-router", "gold"], ["model-router", "video-generate", "purple"], ["video-generate", "i2v-pack", "green"],
            ["prompt-debugger", "prompt-pack", "green"], ["i2v-pack", "chief-seal", "gold"], ["prompt-pack", "chief-seal", "gold"], ["chief-seal", "delivery-pack", "green"],
        ].map(([source, target, kind], i) => ({ id: `edge-${i + 1}`, source, target, kind }));
    }
    function buildTemplateNode(id, type, group, title, action, x, y, draft = "") {
        return { id, type, group, title, action, x, y, body: draft, prompt: draft };
    }
    function getCanvasProjectTemplates() {
        return [
            { id: "short-drama", title: "AI短剧生产线", desc: "剧情输入 → 角色/场景锁定 → 分镜 → 关键帧 → 视频 → 审片 → 交付", tone: "cyan" },
            { id: "person-profile", title: "人物介绍视频", desc: "人物资料 → 爆款钩子 → 口播稿 → 分镜 → 封面图 → 视频", tone: "violet" },
            { id: "product-ad", title: "产品广告工作流", desc: "卖点 → 场景脚本 → 商业分镜 → 产品图 → 广告视频 → 发布文案", tone: "amber" },
            { id: "comic-video", title: "漫剧/分镜漫画", desc: "故事文本 → 人物设定 → 场景设定 → 分镜图 → 连续画面 → 视频化", tone: "emerald" },
        ];
    }
    function buildCanvasTemplate(kind = "short-drama") {
        const baseX = 620;
        const draftBase = String(ideaInput || outlineDraft || script || "请在这里输入你的创作需求，然后运行 DeepSeek 节点生成完整生产素材。").slice(0, 900);
        const titleMap = {
            "short-drama": "AI短剧生产线 / AI Drama Pipeline",
            "person-profile": "人物介绍视频 / Character Profile Pipeline",
            "product-ad": "产品广告工作流 / Product Commercial Pipeline",
            "comic-video": "漫剧视频生产线 / Comic Video Pipeline",
        };
        const nodes = [
            buildTemplateNode(`${kind}-brief`, "text", "input", "需求输入 / Creative Brief", "input", baseX, 380, draftBase),
            buildTemplateNode(`${kind}-character`, "text", "story", "角色库 @Character", "input", baseX + 420, 250, "@主角：外貌、服装、身份、表演风格、禁止变化项。"),
            buildTemplateNode(`${kind}-location`, "text", "story", "场景库 @Location", "input", baseX + 420, 510, "@主场景：空间、时间、光线、道具、色调、镜头方向。"),
            buildTemplateNode(`${kind}-prompt`, "prompt", "prompt", "DeepSeek提示词准备", "prompt-compile", baseX + 840, 380, "基于上游需求，整理成镜头级画面提示词、负面提示词和连续性锚点。"),
            buildTemplateNode(`${kind}-shot`, "shot", "shot", "批量分镜拆解", "shots", baseX + 1260, 380, "把故事拆成 6-8 个镜头，每个镜头包含画面、动作、台词、运镜和转场。"),
            buildTemplateNode(`${kind}-review-a`, "review", "output", "审片质检 / Review Inspector", "review", baseX + 1680, 210, "检查人物变脸、服装连续、场景漂移、镜头重复和模型风险。"),
            buildTemplateNode(`${kind}-image`, "image", "image", "关键帧生图 / Image Keyframes", "seedream", baseX + 1680, 520, "生成统一角色、统一场景、电影感构图的关键帧。"),
            buildTemplateNode(`${kind}-video`, "video", "video", "视频生成 / Video Agent", "video-generate", baseX + 2100, 520, "使用即梦/可灵视频智能体生成 5 秒镜头。"),
            buildTemplateNode(`${kind}-review-b`, "review", "output", "成片质检 / Final Review", "review", baseX + 2520, 380, "对视频结果做最终审片，输出修复建议和交付风险。"),
            buildTemplateNode(`${kind}-delivery`, "output", "output", "交付中心 / Delivery Center", "delivery", baseX + 2940, 380, "导出提示词包、分镜表、图片/视频任务记录和客户预览包。"),
        ];
        // Fix template literal strings for generated ids after escaping stage.
        const fixedNodes = nodes.map(n => ({ ...n, id: String(n.id).replace('"', '') }));
        const rawEdges = [
            [0, 1, "text"], [0, 2, "text"], [1, 3, "purple"], [2, 3, "purple"], [3, 4, "purple"], [4, 5, "gold"], [4, 6, "blue"], [6, 7, "green"], [7, 8, "gold"], [8, 9, "green"], [5, 8, "gold"]
        ];
        const edges = rawEdges.map(([a, b, edgeKind], i) => ({ id: `${kind}-edge-${i + 1}`, source: fixedNodes[a].id, target: fixedNodes[b].id, kind: edgeKind }));
        const assets = Object.fromEntries(fixedNodes.map(n => [n.id, { draft: n.prompt || n.body || "", status: (n.prompt || n.body) ? "draft" : "empty", template: kind, updatedAt: new Date().toLocaleString() }]));
        return { title: titleMap[kind] || titleMap["short-drama"], nodes: fixedNodes, edges, assets };
    }
    function applyCanvasProjectTemplate(kind = "short-drama") {
        const tpl = buildCanvasTemplate(kind);
        setWorkflowNodes(tpl.nodes);
        setWorkflowEdges(tpl.edges);
        setCanvasNodeAssets(tpl.assets);
        setCanvasNodePositions({});
        setCanvasSelectedNode(tpl.nodes[0]?.id || "");
        setCanvasTemplateOpen(false);
        setCanvasInspectorOpen(true);
        addWorkflowLog(`Template applied / 已套用项目模板：${tpl.title}`);
        setStatus(`Canvas template applied / 画布模板已应用：${tpl.title}`);
        window.setTimeout(() => centerCanvasToNode(tpl.nodes[0]?.id), 120);
    }
    function getAssetMentionTokens() {
        const fromCharacter = (characterAssets || []).slice(0, 8).map((a, i) => ({ token: `@角色${i + 1}`, title: a.title || `角色${i + 1}`, body: a.description || a.prompt || "" }));
        const fromLocation = (locationAssets || []).slice(0, 8).map((a, i) => ({ token: `@场景${i + 1}`, title: a.title || `场景${i + 1}`, body: a.description || a.prompt || "" }));
        const lockTokens = [
            visualLocks?.character?.description ? { token: "@角色锁定", title: "角色锁定", body: visualLocks.character.description } : null,
            visualLocks?.location?.description ? { token: "@场景锁定", title: "场景锁定", body: visualLocks.location.description } : null,
            visualLocks?.style?.description ? { token: "@风格锁定", title: "风格锁定", body: visualLocks.style.description } : null,
        ].filter(Boolean);
        return [...lockTokens, ...fromCharacter, ...fromLocation];
    }
    function insertAssetMention(nodeId, token) {
        const target = nodeId || canvasSelectedNode;
        const asset = canvasNodeAssets?.[target] || {};
        const current = String(asset.draft || asset.prompt || "");
        updateCanvasNodeDraft(target, `${current}${current ? " " : ""}${token}`);
        setStatus(`Asset mention inserted / 已插入资产引用：${token}`);
    }
    function getNextNodeSuggestions(node) {
        if (!node)
            return [];
        if (node.type === "text" || node.group === "input")
            return [["prompt", "DeepSeek提示词"], ["story", "故事大纲"], ["image", "图片生成"]];
        if (node.type === "prompt" || node.group === "prompt")
            return [["image", "图片生成"], ["shot", "镜头分镜"], ["review", "提示词质检"]];
        if (node.type === "shot")
            return [["camera", "机位分镜"], ["image", "关键帧"], ["review", "分镜质检"]];
        if (node.type === "image")
            return [["video", "图生视频"], ["review", "画面质检"], ["delivery", "交付"]];
        if (node.type === "video")
            return [["review", "成片质检"], ["delivery", "交付导出"]];
        return [["text", "文本"], ["image", "图片"], ["video", "视频"]];
    }
    function addSuggestedNodeFrom(node, kind) {
        if (!node)
            return addInfiniteCanvasNode(kind);
        const point = { x: Number(node.x || 800) + 470, y: Number(node.y || 500) + 40 };
        const beforeIds = new Set(getWorkflowNodes().map(n => n.id));
        addInfiniteCanvasNode(kind, point);
        window.setTimeout(() => {
            const created = getWorkflowNodes().filter(n => !beforeIds.has(n.id)).at(-1);
            if (created)
                createWorkflowConnection(node.id, created.id, kind === "review" ? "gold" : "custom");
        }, 80);
    }
    function createBatchShotWorkflow(count = 6) {
        const n = Math.max(3, Math.min(12, Number(count || 6)));
        const existing = workflowNodes.length ? workflowNodes : buildDefaultWorkflowNodes();
        const startX = 900;
        const startY = Math.max(760, 520 + Math.ceil(existing.length / 4) * 120);
        const storyText = String(ideaInput || outlineDraft || script || "请先输入一个故事需求，再运行每个文本节点生成镜头内容。").slice(0, 900);
        const nodes = [];
        const edges = [];
        const assets = {};
        for (let i = 0; i < n; i += 1) {
            const sid = `batch-shot-${Date.now()}-${i + 1}`;
            const iid = `batch-image-${Date.now()}-${i + 1}`;
            const vid = `batch-video-${Date.now()}-${i + 1}`;
            const rowY = startY + i * 250;
            nodes.push({ id: sid, type: "text", group: "shot", title: `Shot ${i + 1} 文本镜头`, action: "input", x: startX, y: rowY }, { id: iid, type: "image", group: "image", title: `Shot ${i + 1} 关键帧`, action: "seedream", x: startX + 430, y: rowY }, { id: vid, type: "video", group: "video", title: `Shot ${i + 1} 视频`, action: "video-generate", x: startX + 860, y: rowY });
            edges.push({ id: `batch-edge-${Date.now()}-${i + 1}-a`, source: sid, target: iid, kind: "blue" }, { id: `batch-edge-${Date.now()}-${i + 1}-b`, source: iid, target: vid, kind: "green" });
            assets[sid] = { draft: `基于项目故事拆解 Shot ${i + 1}/${n}：${storyText}`, status: "draft", updatedAt: new Date().toLocaleString() };
            assets[iid] = { draft: `将 Shot ${i + 1} 转成电影级关键帧，保持角色、场景、服装、光影连续。`, status: "draft", updatedAt: new Date().toLocaleString() };
            assets[vid] = { draft: `将 Shot ${i + 1} 关键帧转成 5 秒视频，动作清晰，镜头稳定，有起承转合。`, status: "draft", updatedAt: new Date().toLocaleString() };
        }
        setWorkflowNodes([...existing, ...nodes]);
        setWorkflowEdges([...(workflowEdges.length ? workflowEdges : buildDefaultWorkflowEdges()), ...edges]);
        setCanvasNodeAssets(prev => ({ ...prev, ...assets }));
        setCanvasSelectedNode(nodes[0]?.id || canvasSelectedNode);
        setCanvasInspectorOpen(true);
        addWorkflowLog(`Batch shot workflow created / 已创建批量镜头工作流：${n} shots`);
        setStatus(`Batch shot workflow created / 已创建 ${n} 组 文本→图片→视频 节点`);
        window.setTimeout(() => centerCanvasToNode(nodes[0]?.id), 120);
    }
    async function runReviewInspectorForCanvasNode(node = null) {
        const target = node || getWorkflowNodes().find(n => n.id === canvasSelectedNode);
        if (!target)
            return;
        const id = target.id;
        const source = buildCanvasPromptWithUpstream(target, getCanvasNodeDraft(target));
        setCanvasNodeAssets(prev => ({ ...prev, [id]: { ...(prev[id] || {}), status: "thinking", updatedAt: new Date().toLocaleString() } }));
        try {
            const output = await callDeepSeekForCanvas([
                { role: "system", content: "你是影视AIGC审片质检官。请严格检查：人物一致性、服装连续性、场景漂移、镜头重复、动作起承转合、提示词可执行性、即梦/可灵生成风险。输出：总评分、主要问题、可执行修复、适合模型、下一步建议。" },
                { role: "user", content: source || JSON.stringify(captureWorkspace()).slice(0, 6000) }
            ], { temperature: 0.25 });
            setCanvasNodeAssets(prev => { const before = prev[id] || {}; return ({ ...prev, [id]: { ...before, status: "done", output, prompt: output, history: pushCanvasNodeHistory(before, { type: "review", label: "Review Inspector", output }), updatedAt: new Date().toLocaleString() } }); });
            setCanvasCostMetrics(prev => ({ ...prev, deepseek: Number(prev.deepseek || 0) + 1 }));
            addWorkflowLog(`Review complete / 审片质检完成：${target.title}`);
        }
        catch (e) {
            setCanvasCostMetrics(prev => ({ ...prev, failed: Number(prev.failed || 0) + 1 }));
            setCanvasNodeAssets(prev => ({ ...prev, [id]: { ...(prev[id] || {}), status: "error", error: String(e?.message || e), updatedAt: new Date().toLocaleString() } }));
            showApiError(e, "Review inspector failed / 审片质检节点失败");
        }
    }
    function openCanvasContextMenu(event) {
        event.preventDefault();
        const point = getCanvasPointFromPointer(event);
        setCanvasContextMenu(point);
        setCanvasQuickMenu(null);
    }
    function duplicateSelectedCanvasNode() {
        const node = getWorkflowNodes().find(n => n.id === canvasSelectedNode);
        if (!node)
            return;
        const id = `${node.type || 'node'}-${Date.now()}`;
        const clone = { ...node, id, title: `${node.title} Copy`, x: Number(node.x || 900) + 60, y: Number(node.y || 620) + 60 };
        setWorkflowNodes(prev => [...(prev.length ? prev : buildDefaultWorkflowNodes()), clone]);
        setCanvasNodeAssets(prev => ({ ...prev, [id]: { ...(prev[node.id] || {}), copiedFrom: node.id, updatedAt: new Date().toLocaleString() } }));
        setCanvasSelectedNode(id);
    }
    useEffect(() => {
        if (!(projectStudioOpen && projectStudioTab === "canvas"))
            return;
        const onKey = (e) => {
            const tag = String(e.target?.tagName || "").toLowerCase();
            const typing = ["input", "textarea", "select"].includes(tag) || e.target?.isContentEditable;
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                setWorkspaceStoreVersion(v => v + 1);
                setLastSavedAt(new Date().toLocaleTimeString());
                setStatus("Workspace saved / 工程已保存");
                return;
            }
            if (typing)
                return;
            if (e.key === "Delete" || e.key === "Backspace") {
                removeWorkflowNode(canvasSelectedNode);
            }
            if (e.key.toLowerCase() === "r") {
                const n = getWorkflowNodes().find(x => x.id === canvasSelectedNode);
                if (n)
                    runWorkflowNode(n);
            }
            if (e.key.toLowerCase() === "a") {
                autoLayoutWorkflowCanvas("horizontal");
            }
            if (e.key.toLowerCase() === "f") {
                centerCanvasToNode(canvasSelectedNode);
            }
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") {
                e.preventDefault();
                duplicateSelectedCanvasNode();
            }
            if (e.key === "Escape") {
                setCanvasQuickMenu(null);
                setCanvasContextMenu(null);
                setCanvasTemplateOpen(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [projectStudioOpen, projectStudioTab, canvasSelectedNode, workflowNodes, workflowEdges, canvasNodeAssets]);
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
            case "video-generate": return Object.values(shotVideos || {}).some(v => v?.taskId || v?.videoUrl) ? "ready" : videoModelRouting.length ? "idle" : "warning";
            case "i2v-pack": return shots.length ? "ready" : "warning";
            case "seal": return lastArchiveId ? "ready" : "idle";
            case "delivery": return shots.length ? "ready" : "warning";
            case "review": return (canvasNodeAssets?.[node.id]?.output || qualityReport || shotSimilarityReport) ? "ready" : "idle";
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
            router: videoModelRouting.length ? `${videoModelRouting.length} routes ready` : "运行后推荐即梦/Seedance/可灵/Runway/Luma/Sora/Veo",
            "video-generate": `${Object.values(shotVideos || {}).filter(v => v?.taskId || v?.videoUrl).length}/${shotCount || 0} video tasks · ${videoApiSettings.provider}`,
            "i2v-pack": "导出图生视频制作包 / Export image-to-video pack",
            seal: lastArchiveId || "运行后封存版本并生成认证编号",
            delivery: "Word / Prompt Pack / Full Kit / Client Preview / Project JSON",
            review: (canvasNodeAssets?.[node.id]?.output || "检查人物一致性、服装连续性、场景漂移、提示词可执行性与模型生成风险。"),
        };
        return { ...node, status, body: bodyMap[node.action] || node.title, meta: `${node.group} · ${status}`, prompt: selectedWorkflowOutput(node.id, node.action) };
    }
    function selectedWorkflowOutput(id, action) {
        if (id?.startsWith("shot-")) {
            const idx = Number(id.replace("shot-", "")) - 1;
            const s = rebuildFinalPrompts(shots || [])[idx];
            return s ? (s.finalPrompt || buildFinalPrompt(s, project, style, tech, modules, negativePrompt)) : "";
        }
        if (action === "prompt-pack")
            return rebuildFinalPrompts(shots || []).map((s, i) => `Shot ${i + 1}\n${s.finalPrompt || ""}`).join("\n\n");
        if (action === "scene-prompt")
            return rebuildFinalPrompts(shots || []).map((s, i) => `Shot ${i + 1}\n${s.finalSceneImagePrompt || buildSceneImageModelVariant(s, project, style, tech, negativePrompt)}`).join("\n\n");
        if (action === "video-generate")
            return JSON.stringify(shotVideos, null, 2);
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
        try {
            event.dataTransfer.setData("text/plain", id);
            event.dataTransfer.effectAllowed = "move";
        }
        catch (e) { }
        setCanvasSelectedNode(id);
    }
    function handleCanvasDrop(event) {
        event.preventDefault();
        let id = "";
        try {
            id = event.dataTransfer.getData("text/plain");
        }
        catch (e) { }
        if (!id)
            return;
        const stage = event.currentTarget;
        const rect = stage.getBoundingClientRect();
        const x = Math.max(20, Math.round((event.clientX - rect.left + stage.scrollLeft) / Math.max(canvasZoom || 1, 0.1) - 140));
        const y = Math.max(20, Math.round((event.clientY - rect.top + stage.scrollTop) / Math.max(canvasZoom || 1, 0.1) - 80));
        setCanvasNodePositions(prev => ({ ...prev, [id]: { x, y } }));
        setCanvasSelectedNode(id);
        addWorkflowLog(`Moved node / 移动节点：${id}`);
    }
    function getCanvasPointFromPointer(event) {
        const stage = canvasStageRef.current;
        const rect = stage?.getBoundingClientRect?.();
        const zoom = Math.max(canvasZoom || 1, 0.1);
        if (!stage || !rect)
            return { x: 900, y: 620, screenX: event.clientX || 0, screenY: event.clientY || 0 };
        return {
            x: Math.max(40, Math.round((event.clientX - rect.left + stage.scrollLeft) / zoom)),
            y: Math.max(40, Math.round((event.clientY - rect.top + stage.scrollTop) / zoom)),
            screenX: event.clientX,
            screenY: event.clientY,
        };
    }
    function isCanvasInteractionTarget(target) {
        return Boolean(target?.closest?.('.polaris-v98-node,.polaris-v98-menu,.polaris-v98-inspector,.polaris-v98-topbar,.polaris-v98-dock,.polaris-v98-bottom,.polaris-v100-api-gate,.polaris-v101-asset-rail,.polaris-v101-minimap,.polaris-v102-template-panel,.polaris-v102-context-menu,button,input,textarea,select,a,[role="button"]'));
    }
    function beginCanvasPan(event) {
        if (event.button !== 0 && event.button !== 1)
            return;
        if (isCanvasInteractionTarget(event.target))
            return;
        const stage = canvasStageRef.current;
        if (!stage)
            return;
        event.preventDefault();
        event.stopPropagation();
        canvasPanRef.current = { active: true, moved: false, startX: event.clientX, startY: event.clientY, scrollLeft: stage.scrollLeft, scrollTop: stage.scrollTop, pointerId: event.pointerId };
        setCanvasIsPanning(true);
        try {
            stage.setPointerCapture?.(event.pointerId);
        }
        catch (_) { }
    }
    function moveCanvasPan(event) {
        if (workflowConnectSource)
            setWorkflowConnectCursor(getCanvasPointFromPointer(event));
        const pan = canvasPanRef.current;
        if (!pan?.active)
            return;
        const stage = canvasStageRef.current;
        if (!stage)
            return;
        const dx = event.clientX - pan.startX;
        const dy = event.clientY - pan.startY;
        if (Math.abs(dx) + Math.abs(dy) > 4)
            pan.moved = true;
        stage.scrollLeft = Math.max(0, pan.scrollLeft - dx);
        stage.scrollTop = Math.max(0, pan.scrollTop - dy);
        event.preventDefault();
    }
    function endCanvasPan(event) {
        const pan = canvasPanRef.current;
        if (!pan?.active)
            return;
        canvasPanRef.current = { ...pan, active: false, suppressClick: pan.moved };
        setCanvasIsPanning(false);
        try {
            canvasStageRef.current?.releasePointerCapture?.(event.pointerId || pan.pointerId);
        }
        catch (_) { }
    }
    function openCanvasQuickMenu(event) {
        const target = event.target;
        if (target?.closest?.(".polaris-v98-node,.polaris-v98-menu,.polaris-v98-topbar,.polaris-v98-dock,.polaris-v98-bottom,.polaris-v98-inspector"))
            return;
        event.preventDefault();
        const point = getCanvasPointFromPointer(event);
        setCanvasQuickMenu(point);
        setCanvasInspectorOpen(false);
        addWorkflowLog("Canvas quick menu opened / 双击打开画布节点菜单");
    }
    function addInfiniteCanvasNode(kind, point = canvasQuickMenu) {
        const catalog = {
            text: { type: "text", group: "input", title: "文本创作节点 / Text Story Node", action: "input" },
            prompt: { type: "prompt", group: "prompt", title: "DeepSeek 提示词节点 / Prompt Prep", action: "prompt-compile" },
            story: { type: "ai", group: "story", title: "故事脚本节点 / Story Script", action: "outline" },
            shot: { type: "shot", group: "shot", title: "镜头分镜节点 / Shot Board", action: "shots" },
            camera: { type: "camera", group: "shot", title: "摄影机节点 / Camera Rig", action: "continuity" },
            image: { type: "image", group: "image", title: "图片生成节点 / Image Lab", action: "seedream" },
            video: { type: "video", group: "video", title: "视频生成节点 / Video Lab", action: "video-generate" },
            i2v: { type: "video", group: "video", title: "首帧图生视频 / First Frame I2V", action: "i2v-pack" },
            upload: { type: "asset", group: "input", title: "上传素材节点 / Upload Asset", action: "word" },
            audio: { type: "audio", group: "audio", title: "音乐音效节点 / Audio Node", action: "publish" },
            delivery: { type: "output", group: "output", title: "交付导出节点 / Delivery", action: "delivery" },
            review: { type: "review", group: "output", title: "审片质检节点 / Review Inspector", action: "review" },
        };
        const spec = catalog[kind] || catalog.text;
        const id = `${kind}-${Date.now()}`;
        const x = Math.round((point?.x || 900) - 150);
        const y = Math.round((point?.y || 620) - 90);
        setWorkflowNodes(prev => {
            const base = prev.length ? prev : buildDefaultWorkflowNodes();
            return [...base, { ...spec, id, x, y }];
        });
        setCanvasSelectedNode(id);
        setCanvasQuickMenu(null);
        setCanvasInspectorOpen(true);
        addWorkflowLog(`Added node from double click / 双击新增节点：${spec.title}`);
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
    function createWorkflowConnection(sourceId, targetId, kind = "custom") {
        const source = String(sourceId || "");
        const target = String(targetId || "");
        if (!source || !target)
            return false;
        if (source === target) {
            setWorkflowConnectSource("");
            setWorkflowConnectCursor(null);
            setStatus("Connection cancelled / 已取消同节点连线");
            return false;
        }
        const nodesNow = getWorkflowNodes();
        const sourceExists = nodesNow.some(n => n.id === source);
        const targetExists = nodesNow.some(n => n.id === target);
        if (!sourceExists || !targetExists) {
            setStatus("Connection failed: node missing / 连线失败：节点不存在");
            setWorkflowConnectSource("");
            setWorkflowConnectCursor(null);
            return false;
        }
        const currentEdges = getWorkflowEdges();
        const exists = currentEdges.some(e => e.source === source && e.target === target);
        if (!exists) {
            const nextEdge = { id: `edge-custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, source, target, kind };
            setWorkflowEdges([...currentEdges, nextEdge]);
            addWorkflowLog(`Connected / 已连接：${source} → ${target}`);
        }
        else {
            addWorkflowLog(`Connection already exists / 连线已存在：${source} → ${target}`);
        }
        setWorkflowConnectSource("");
        setWorkflowConnectCursor(null);
        setCanvasSelectedNode(target);
        setStatus(exists ? `Connection already exists / 连线已存在：${source} → ${target}` : `Workflow connected / 工作流已连接：${source} → ${target}`);
        return !exists;
    }
    function startConnectFromNode(id) {
        if (!id)
            return;
        if (!workflowConnectSource) {
            setWorkflowConnectSource(id);
            setWorkflowConnectCursor(null);
            setCanvasSelectedNode(id);
            addWorkflowLog(`Connect source selected / 已选择连线起点：${id}`);
            setStatus("Connect mode: click another node or its input port / 连线模式：点击另一个节点或输入端口即可连接");
            return;
        }
        return createWorkflowConnection(workflowConnectSource, id);
    }
    function handleCanvasPortClick(nodeId, side = "out") {
        if (!nodeId)
            return;
        if (side === "out") {
            if (workflowConnectSource === nodeId) {
                setWorkflowConnectSource("");
                setWorkflowConnectCursor(null);
                setStatus("Connect mode cancelled / 已取消当前连线");
                return;
            }
            setWorkflowConnectSource(nodeId);
            setWorkflowConnectCursor(null);
            setCanvasSelectedNode(nodeId);
            addWorkflowLog(`Output port armed / 已选择输出端口：${nodeId}`);
            setStatus("Output port armed: click a target input port / 输出端口已准备：点击目标节点左侧输入端口");
            return;
        }
        if (!workflowConnectSource) {
            setCanvasSelectedNode(nodeId);
            setStatus("Please click an output port first / 请先点击一个节点右侧输出端口");
            return;
        }
        return createWorkflowConnection(workflowConnectSource, nodeId);
    }
    function removeWorkflowNode(nodeId) {
        const id = String(nodeId || "");
        if (!id)
            return;
        const protectedIds = new Set(buildDefaultWorkflowNodes().map(n => n.id));
        if (protectedIds.has(id)) {
            const ok = typeof window === "undefined" ? true : window.confirm("这是默认主流程节点，确定要删除吗？\n可通过 Reset / 重置恢复默认流程。");
            if (!ok)
                return setStatus("Delete cancelled / 已取消删除默认节点");
        }
        setWorkflowNodes(prev => prev.filter(n => n.id !== id));
        setWorkflowEdges(prev => (prev || []).filter(e => e.source !== id && e.target !== id));
        setCanvasNodePositions(prev => { const next = { ...(prev || {}) }; delete next[id]; return next; });
        setCanvasNodeAssets(prev => { const next = { ...(prev || {}) }; delete next[id]; return next; });
        if (canvasSelectedNode === id)
            setCanvasSelectedNode("idea-input");
        addWorkflowLog(`Deleted node / 已删除节点：${id}`);
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
        setWorkflowNodes(prev => {
            const base = prev.length ? prev : buildDefaultWorkflowNodes();
            return [...base, { ...spec, id, x: 120 + (base.length % 4) * 260, y: 1450 + Math.floor(base.length / 4) * 160 }];
        });
        setCanvasSelectedNode(id);
        addWorkflowLog(`Added node / 新增节点：${spec.title}`);
    }
    async function runWorkflowNode(idOrNode, options = {}) {
        const node = typeof idOrNode === "string" ? getWorkflowNodes().find(n => n.id === idOrNode) : idOrNode;
        if (!node)
            return;
        setCanvasSelectedNode(node.id);
        setWorkflowActiveNode(node.id);
        addWorkflowLog(`▶ Running / 运行节点：${node.title}`);
        try {
            const canvasAsset = canvasNodeAssets?.[node.id] || {};
            const isCustomNode = !buildDefaultWorkflowNodes().some(n => n.id === node.id) && !String(node.id || "").startsWith("shot-");
            if ((isCustomNode || canvasAsset.draft) && node.type === "text") {
                await runDeepSeekForCanvasNode(node);
                addWorkflowLog(`✓ Complete / 完成节点：${node.title}`);
                return;
            }
            if ((isCustomNode || canvasAsset.draft) && node.type === "image") {
                await generateImageForCanvasNode(node);
                addWorkflowLog(`✓ Complete / 完成节点：${node.title}`);
                return;
            }
            if ((isCustomNode || canvasAsset.draft || canvasAsset.images?.length) && node.type === "video") {
                await generateVideoForCanvasNode(node);
                addWorkflowLog(`✓ Complete / 完成节点：${node.title}`);
                return;
            }
            if (node.type === "camera" && (isCustomNode || canvasAsset.draft || getUpstreamCanvasContext(node) || !shots.length)) {
                await generateCameraBlockingForCanvasNode(node);
                addWorkflowLog(`✓ Complete / 完成节点：${node.title}`);
                return;
            }
            if (node.type === "review" || node.action === "review") {
                await runReviewInspectorForCanvasNode(node);
                addWorkflowLog(`✓ Complete / 完成节点：${node.title}`);
                return;
            }
            switch (node.action) {
                case "engine":
                    if (!apiIsReady)
                        throw new Error("API not connected. 请先在 API Center 点火 AI 引擎。");
                    runCanvasRitual("premiere");
                    break;
                case "input":
                    if (!String(ideaInput || script || outlineDraft || scriptImportText).trim())
                        throw new Error("缺少输入：请填写一句话创作需求、剧本或导入文档。");
                    break;
                case "reference":
                    if (referenceUrl.trim() || extractFirstUrl(ideaInput))
                        await handleIngestReference();
                    break;
                case "word":
                    if (scriptImportText.trim())
                        await handleAnalyzeImportedScript();
                    break;
                case "story":
                    if (!String(script || outlineDraft || ideaInput || scriptImportText).trim())
                        throw new Error("缺少故事源文本。");
                    break;
                case "outline":
                    await handleGenerateScriptOutline();
                    break;
                case "outline-polish":
                    await handleRewriteOutline();
                    break;
                case "shot-plan":
                    await handleGenerateShotPlan();
                    break;
                case "shots":
                    if (shotPlanRows.length)
                        await handleGenerateFromShotPlan();
                    else
                        await handleGenerate();
                    break;
                case "continuity":
                    await handleRunShotSimilarityCheck();
                    await handleRunFilmRiskEstimate();
                    break;
                case "prompt-compile":
                    if (!shots.length)
                        throw new Error("需要先生成分镜。");
                    setShots(prev => rebuildFinalPrompts(prev || []));
                    break;
                case "prompt-debug":
                    await handleRunQualityCheck();
                    break;
                case "prompt-pack":
                    if (!shots.length)
                        throw new Error("需要先生成分镜。");
                    downloadPromptPack(rebuildFinalPrompts(shots), project);
                    break;
                case "scene-prompt":
                    if (!shots.length)
                        throw new Error("需要先生成分镜。");
                    await handleEnhanceSceneImagePrompts();
                    break;
                case "seedream":
                    if (!shots.length)
                        throw new Error("需要先生成分镜。");
                    if (!options.skipConfirm && !confirmVisualGeneration("Seedream Keyframe Node / 即梦关键帧节点", shots))
                        throw new Error("用户取消图片生成。");
                    await handleGenerateAllShotKeyframes(shots, { skipConfirm: true });
                    break;
                case "visual-lock":
                    lockVisualFromKeyframe("firstFrame");
                    lockVisualFromKeyframe("style");
                    break;
                case "router":
                    handleBuildVideoModelRouter();
                    break;
                case "video-generate":
                    await handleGenerateAllShotVideos();
                    break;
                case "i2v-pack":
                    handleExportImageToVideoPack();
                    break;
                case "seal":
                    lockProductionVersion();
                    runCanvasRitual("seal");
                    break;
                case "delivery":
                    exportFullProductionKit();
                    break;
                case "review":
                    await runReviewInspectorForCanvasNode(node);
                    break;
                case "single-shot":
                    setActiveShot(Number(node.shotIndex || 0));
                    await handleRegenerateCurrentShot();
                    break;
                case "publish":
                    buildRhythmTimeline();
                    break;
                case "client":
                    setProjectStudioTab("client");
                    break;
                case "risk":
                    await handleRunFilmRiskEstimate();
                    break;
                default: addWorkflowLog(`No operation / 无操作节点：${node.title}`);
            }
            addWorkflowLog(`✓ Complete / 完成节点：${node.title}`);
        }
        catch (err) {
            addWorkflowLog(`✕ Failed / 节点失败：${node.title} · ${err?.message || err}`);
            showApiError(err, `Workflow node failed / 工作流节点运行失败：${node.title}`);
        }
        finally {
            setWorkflowActiveNode("");
        }
    }
    function getDownstreamNodeIds(startId) {
        const edges = getWorkflowEdges();
        const seen = new Set();
        const queue = [startId];
        while (queue.length) {
            const cur = queue.shift();
            edges.filter(e => e.source === cur).forEach(e => {
                if (!seen.has(e.target)) {
                    seen.add(e.target);
                    queue.push(e.target);
                }
            });
        }
        return [...seen];
    }
    async function runDownstreamFromNode(id, options = {}) {
        runCanvasRitual("clap");
        const ids = [id, ...getDownstreamNodeIds(id)];
        for (const nodeId of ids) {
            const n = getWorkflowNodes().find(x => x.id === nodeId);
            if (!n)
                continue;
            if (options.stopBeforeImage && ["scene-prompt", "seedream", "visual-lock", "router", "i2v-pack"].includes(n.action))
                break;
            await runWorkflowNode(n, options);
        }
    }
    async function runPromptOnlyWorkflow() {
        setWorkflowRunMode("prompt-only");
        setProductionFlowMode("prompt-only");
        runCanvasRitual("prompt");
        const ids = ["engine-ignition", "idea-input", "reference-ingest", "word-script", "story-core", "outline-writer", "outline-polish", "shot-planner", "shot-generator", "continuity-check", "prompt-compiler", "prompt-debugger", "prompt-pack"];
        for (const id of ids)
            await runWorkflowNode(id, { stopBeforeImage: true });
        setProjectStudioTab("prompt");
        setStatus("Prompt-only workflow complete / 只生成提示词工作流完成，未调用图片接口");
    }
    async function runFullVisualWorkflow() {
        setWorkflowRunMode("full-visual");
        setProductionFlowMode("full-visual");
        if (!confirmVisualGeneration("Full Visual Workflow / 完整视觉节点工作流", shots.length ? shots : null))
            return setStatus("Full visual workflow cancelled / 已取消完整视觉节点工作流");
        runCanvasRitual("visual");
        const ids = ["engine-ignition", "idea-input", "reference-ingest", "word-script", "story-core", "outline-writer", "outline-polish", "shot-planner", "shot-generator", "continuity-check", "prompt-compiler", "prompt-debugger", "scene-prompt", "seedream-keyframe", "visual-lock", "model-router", "video-generate", "i2v-pack", "chief-seal", "delivery-pack"];
        for (const id of ids)
            await runWorkflowNode(id, { skipConfirm: true });
        setProjectStudioTab("canvas");
        setStatus("Full visual node workflow complete / 完整视觉节点工作流完成");
    }
    function rebuildContinuityFromCanvas() {
        const nodes = buildDirectorCanvasNodes();
        const shotNodes = nodes.filter(n => n.id?.startsWith("shot-")).sort((a, b) => (a.y - b.y) || (a.x - b.x));
        if (!shotNodes.length)
            return setStatus("No shot nodes to rebuild / 画布中没有可重建的镜头节点");
        const orderedShots = shotNodes.map(n => shots[n.shotIndex]).filter(Boolean);
        if (!orderedShots.length)
            return;
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
        const payload = { format: "polaris-node-workflow-canvas", version: "V10.6", exportedAt: new Date().toISOString(), engineer: ENGINEER_NAME, project, workspaceMode, productionFlowMode, workflowRunMode, canvasZoom, canvasNodePositions, nodes: getWorkflowNodes(), edges: getWorkflowEdges(), nodeAssets: canvasNodeAssets, runLog: workflowRunLog };
        downloadTextFile(`${safeName(project)}_visual_workflow_canvas_v10_6.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
        setStatus("Node workflow canvas JSON exported / 节点式工作流画布 JSON 已导出");
    }
    async function handleGenerate(scriptOverride = null) {
        let referenceContextForRequest = referencePromptContext;
        // 客户输入最高优先级：即使存在旧剧本/缓存/模板，也必须围绕本轮客户输入生成。
        if ((referenceUrl.trim() || extractFirstUrl(ideaInput)) && referenceIngest.status === "idle") {
            setStatus("Auto analyzing reference before final generation / 正式生成前自动识别参考链接");
            const nextRef = await handleIngestReference();
            if (nextRef)
                referenceContextForRequest = summarizeReferenceForPrompt({ url: activeReferenceUrl, useMode: referenceUseMode, manualContent: referenceManualContent, ...nextRef });
        }
        const effectiveScript = resolveAuthoritativeScript({ scriptOverride, script, ideaInput, outlineDraft, importedScriptContext, referenceContext: referenceContextForRequest });
        if (!cleanUserText(effectiveScript))
            return setStatus("Script Required / 请输入剧本大纲或一句话创作需求");
        const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
        if (apiModel !== selectedModel)
            setSelectedModel(apiModel);
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
            if (apiThinkingMode === "enabled")
                requestBody.reasoning_effort = reasoningEffort;
            setApiLog({ status: "requesting", message: "Generating with current script / 正在按当前剧本生成", lastModel: apiModel, lastEndpoint: deepSeekEndpoint, latencyMs: null, scriptFingerprint: scriptFingerprint(effectiveScript), requestPreview: userPrompt.slice(0, 1200) });
            const res = await fetch(deepSeekEndpoint, {
                method: "POST",
                headers: apiHeaders(),
                body: JSON.stringify(requestBody)
            });
            if (!res.ok)
                throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 160)}`);
            setGenerateProgress(64);
            const data = await res.json();
            const parsed = parseAIJson(data?.choices?.[0]?.message?.content || "");
            setGenerateProgress(78);
            const normalized = Array.isArray(parsed.shots) ? parsed.shots.map(normalizeShot) : [];
            if (!normalized.length)
                throw new Error("JSON parsed but shots array is empty / JSON 已解析但没有镜头数组");
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
        }
        catch (e) {
            setGenerateProgress(0);
            showApiError(e, "Generate Error / 生成失败");
            return null;
        }
        finally {
            window.setTimeout(() => setIsGenerating(false), 450);
        }
    }
    function openApiConnectionCenter() {
        const currentMode = workspaceMode || "";
        if (currentMode) {
            workspaceStoreRef.current[currentMode] = captureWorkspace();
            setReturnModeAfterApi(currentMode);
        }
        // Keep the current API online state while opening the switch center.
        // Only a failed test should mark the API as disconnected.
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
    const PolarisShell = ({ children, compact = false }) => _jsxs("div", { className: "polaris-v85-shell min-h-screen bg-[#f6f7fb] text-slate-900 font-sans", children: [_jsx("style", { children: `
.polaris-select-menu{animation:polaris-select-pop .14s ease-out;backdrop-filter:blur(18px)}
.polaris-select-options{scrollbar-width:thin;scrollbar-color:#f59e0b #f1f5f9}
.polaris-select-options::-webkit-scrollbar{width:10px}.polaris-select-options::-webkit-scrollbar-track{background:#f1f5f9;border-radius:999px}.polaris-select-options::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#f59e0b,#06b6d4);border-radius:999px;border:2px solid #fff}
@keyframes polaris-select-pop{from{opacity:0;transform:translateY(-6px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}

      .polaris-v85-shell{
        min-height:100vh;
        background:
          radial-gradient(circle at 14% 2%, rgba(124,58,237,.12), transparent 30%),
          radial-gradient(circle at 86% 8%, rgba(6,182,212,.14), transparent 32%),
          linear-gradient(180deg,#fbfdff 0%,#f6f8fc 42%,#eef4ff 100%);
        color:#0f172a;
        font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .polaris-v85-shell header{
        background:rgba(255,255,255,.92)!important;
        border-color:rgba(15,23,42,.08)!important;
        box-shadow:0 10px 36px rgba(15,23,42,.06);
        backdrop-filter:blur(22px);
      }
      .polaris-v85-shell header .text-white,
      .polaris-v85-shell header .text-stone-300,
      .polaris-v85-shell header .text-stone-400,
      .polaris-v85-shell header .text-stone-500{color:#0f172a!important;}
      .polaris-v85-shell button{
        min-height:44px;
        line-height:1.25;
        white-space:normal;
      }
      .polaris-v85-shell button:disabled{
        opacity:.55!important;
        cursor:not-allowed;
        filter:saturate(.65);
      }
      /* V9.1 readability and product-flow polish / 按钮可读性与产品流程优化 */
      .polaris-v85-shell button, .visual-canvas-v89 button{
        font-size:14px!important;
        letter-spacing:0!important;
        line-height:1.22!important;
        text-wrap:balance;
      }
      .polaris-v85-shell [class*="text-[10px]"], .visual-canvas-v89 [class*="text-[10px]"]{font-size:12px!important;}
      .polaris-v85-shell [class*="text-[11px]"], .visual-canvas-v89 [class*="text-[11px]"]{font-size:13px!important;}
      .polaris-v85-shell [class*="border-white"]{border-color:rgba(15,23,42,.12)!important;}
      .polaris-v85-shell [class*="text-stone-300"], .polaris-v85-shell [class*="text-stone-400"], .polaris-v85-shell [class*="text-stone-500"]{color:#64748b!important;}
      .polaris-v85-shell [class*="bg-white/5"], .polaris-v85-shell [class*="bg-black/30"], .polaris-v85-shell [class*="bg-black/40"], .polaris-v85-shell [class*="bg-black/45"]{background:rgba(255,255,255,.88)!important;color:#0f172a!important;}
      .polaris-v85-shell [class*="text-white"]{color:#0f172a!important;}
      .polaris-v85-shell .polaris-primary-button, .polaris-v85-shell .polaris-cyan-button, .polaris-v85-shell .polaris-purple-button, .polaris-v85-shell .polaris-green-button,
      .polaris-v85-shell button[class*="bg-cyan"], .polaris-v85-shell button[class*="bg-violet"], .polaris-v85-shell button[class*="bg-purple"], .polaris-v85-shell button[class*="bg-emerald"], .polaris-v85-shell button[class*="bg-slate-950"], .polaris-v85-shell button[class*="bg-black"]{color:#fff!important;}
      .polaris-v85-shell button[class*="bg-amber"]{color:#111827!important;}
      .polaris-project-studio-light{background:rgba(15,23,42,.24)!important;}
      .polaris-project-studio-light .polaris-project-studio-card{background:#ffffff!important;color:#0f172a!important;border-color:rgba(15,23,42,.10)!important;}
      .polaris-project-studio-light .text-white, .polaris-project-studio-light .text-stone-100, .polaris-project-studio-light .text-stone-200{color:#0f172a!important;}
      .polaris-project-studio-light .text-stone-300, .polaris-project-studio-light .text-stone-400, .polaris-project-studio-light .text-stone-500{color:#64748b!important;}
      .polaris-project-studio-light [class*="border-white"]{border-color:rgba(15,23,42,.12)!important;}
      .polaris-project-studio-light [class*="bg-black"], .polaris-project-studio-light [class*="bg-white/5"], .polaris-project-studio-light [class*="bg-white/[0.03]"]{background:#f8fafc!important;color:#0f172a!important;}
      .polaris-project-studio-light button[class*="bg-cyan"], .polaris-project-studio-light button[class*="bg-violet"], .polaris-project-studio-light button[class*="bg-purple"], .polaris-project-studio-light button[class*="bg-emerald"], .polaris-project-studio-light button[class*="bg-slate-950"]{color:#fff!important;}
      .visual-canvas-v89{--soft-card:#ffffff;--soft-line:#dbe6f3;--soft-text:#0f172a;}
      .polaris-v85-shell input,
      .polaris-v85-shell textarea,
      .polaris-v85-shell select{
        background:#fff!important;
        color:#0f172a!important;
        border-color:rgba(15,23,42,.12)!important;
        font-size:15px!important;
      }
      .polaris-v85-shell input::placeholder,
      .polaris-v85-shell textarea::placeholder{color:#94a3b8!important;}
      .polaris-v85-shell .polaris-readable-button{
        color:#0f172a!important;
        background:#fff!important;
        border:1px solid rgba(15,23,42,.10)!important;
        box-shadow:0 10px 22px rgba(15,23,42,.06);
      }
      .polaris-v85-shell .polaris-primary-button{
        color:white!important;
        background:linear-gradient(135deg,#111827,#334155)!important;
        box-shadow:0 16px 32px rgba(15,23,42,.18);
      }
      .polaris-v85-shell .polaris-cyan-button{
        color:white!important;
        background:linear-gradient(135deg,#0891b2,#2563eb)!important;
        box-shadow:0 16px 32px rgba(14,165,233,.22);
      }
      .polaris-v85-shell .polaris-purple-button{
        color:white!important;
        background:linear-gradient(135deg,#7c3aed,#db2777)!important;
        box-shadow:0 16px 32px rgba(124,58,237,.22);
      }
      .polaris-v85-shell .polaris-green-button{
        color:white!important;
        background:linear-gradient(135deg,#059669,#10b981)!important;
        box-shadow:0 16px 32px rgba(16,185,129,.22);
      }
      .polaris-v85-shell .polaris-soft-scroll{scrollbar-width:thin;scrollbar-color:rgba(99,102,241,.55) rgba(226,232,240,.8)}
      .polaris-v85-shell .polaris-soft-scroll::-webkit-scrollbar{width:10px;height:10px}
      .polaris-v85-shell .polaris-soft-scroll::-webkit-scrollbar-track{background:rgba(226,232,240,.8);border-radius:999px}
      .polaris-v85-shell .polaris-soft-scroll::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#8b5cf6,#06b6d4);border-radius:999px;border:2px solid rgba(255,255,255,.92)}
      .polaris-v85-shell .polaris-glass-card{background:rgba(255,255,255,.86);border:1px solid rgba(15,23,42,.09);box-shadow:0 18px 48px rgba(15,23,42,.08);backdrop-filter:blur(18px)}
      .polaris-v85-shell .polaris-hero-panel{background:radial-gradient(circle at 12% 12%,rgba(124,58,237,.18),transparent 34%),radial-gradient(circle at 92% 8%,rgba(6,182,212,.20),transparent 32%),linear-gradient(135deg,#ffffff 0%,#f9fbff 44%,#eef6ff 100%)}
      .polaris-v85-shell .polaris-step-pill{background:#fff;border:1px solid rgba(15,23,42,.08);box-shadow:0 10px 24px rgba(15,23,42,.05)}
      .polaris-v85-shell .polaris-asset-card{background:linear-gradient(180deg,#ffffff,#f8fafc);border:1px solid rgba(15,23,42,.09);box-shadow:0 12px 34px rgba(15,23,42,.06)}
      .polaris-v85-shell .polaris-section-title{font-size:13px;font-weight:900;letter-spacing:.22em;text-transform:uppercase;color:#7c3aed}
      .polaris-v85-shell .polaris-main-title{font-weight:950;letter-spacing:-.055em;color:#020617}
      .polaris-v85-shell .polaris-help-text{color:#64748b;line-height:1.85}
      .polaris-v85-shell .polaris-big-button{min-height:54px!important;font-size:15px!important;border-radius:18px!important;padding:14px 18px!important}
      .polaris-v85-shell .polaris-compact-button{min-height:46px!important;font-size:14px!important;border-radius:16px!important;padding:11px 14px!important}
      .polaris-v85-shell .polaris-danger-note{background:#fff7ed;border:1px solid #fed7aa;color:#9a3412}
      .polaris-v85-shell .polaris-ready-note{background:#ecfdf5;border:1px solid #a7f3d0;color:#047857}
      .polaris-v85-shell .polaris-wait-note{background:#f8fafc;border:1px solid #e2e8f0;color:#475569}
      /* V9.1 Flow QA: readable buttons + light product homepage / 可读按钮与浅色产品首页 */
      .polaris-v85-shell [class*="bg-[#050505]"],
      .polaris-v85-shell [class*="bg-[#060606]"],
      .polaris-v85-shell [class*="bg-[#09090b]"]{
        background:linear-gradient(135deg,#ffffff 0%,#f8fbff 52%,#eef6ff 100%)!important;
        color:#0f172a!important;
        border-color:rgba(15,23,42,.10)!important;
      }
      .polaris-v85-shell [class*="bg-white/[0.035]"],
      .polaris-v85-shell [class*="bg-white/[0.04]"],
      .polaris-v85-shell [class*="bg-white/[0.05]"],
      .polaris-v85-shell [class*="bg-white/5"],
      .polaris-v85-shell [class*="bg-black/35"],
      .polaris-v85-shell [class*="bg-black/50"]{
        background:rgba(255,255,255,.92)!important;
        color:#0f172a!important;
        border-color:rgba(15,23,42,.10)!important;
        box-shadow:0 14px 36px rgba(15,23,42,.06);
      }
      .polaris-v85-shell button[class*="bg-cyan"][class*="/10"],
      .polaris-v85-shell button[class*="bg-cyan"][class*="/20"],
      .polaris-project-studio-light button[class*="bg-cyan"][class*="/10"],
      .polaris-project-studio-light button[class*="bg-cyan"][class*="/20"]{
        background:#ecfeff!important;color:#0e7490!important;border-color:#67e8f9!important;
      }
      .polaris-v85-shell button[class*="bg-purple"][class*="/10"],
      .polaris-v85-shell button[class*="bg-purple"][class*="/20"],
      .polaris-v85-shell button[class*="bg-violet"][class*="/10"],
      .polaris-v85-shell button[class*="bg-violet"][class*="/20"],
      .polaris-project-studio-light button[class*="bg-purple"][class*="/10"],
      .polaris-project-studio-light button[class*="bg-violet"][class*="/10"]{
        background:#f5f3ff!important;color:#6d28d9!important;border-color:#c4b5fd!important;
      }
      .polaris-v85-shell button[class*="bg-emerald"][class*="/10"],
      .polaris-v85-shell button[class*="bg-emerald"][class*="/20"],
      .polaris-project-studio-light button[class*="bg-emerald"][class*="/10"]{
        background:#ecfdf5!important;color:#047857!important;border-color:#6ee7b7!important;
      }
      .polaris-v85-shell button[class*="bg-amber"][class*="/10"],
      .polaris-v85-shell button[class*="bg-amber"][class*="/20"]{
        background:#fffbeb!important;color:#92400e!important;border-color:#fcd34d!important;
      }
      .polaris-v85-shell button[class*="bg-white/5"],
      .polaris-v85-shell button[class*="bg-white/10"],
      .polaris-v85-shell button[class*="bg-black/35"],
      .polaris-v85-shell button[class*="bg-black/50"]{
        background:#ffffff!important;color:#0f172a!important;border:1px solid rgba(15,23,42,.12)!important;
      }
      .polaris-v85-shell button[class*="text-cyan-100"], .polaris-v85-shell button[class*="text-cyan-200"]{color:#0e7490!important;}
      .polaris-v85-shell button[class*="text-purple-100"], .polaris-v85-shell button[class*="text-purple-200"]{color:#6d28d9!important;}
      .polaris-v85-shell button[class*="text-emerald-100"], .polaris-v85-shell button[class*="text-emerald-200"]{color:#047857!important;}
      .polaris-v85-shell button[class*="text-amber-100"], .polaris-v85-shell button[class*="text-amber-200"]{color:#92400e!important;}
      .polaris-v85-shell .polaris-qa-strip{
        display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;
      }
      @media (max-width: 1180px){.polaris-v85-shell .polaris-qa-strip{grid-template-columns:repeat(3,minmax(0,1fr));}}
      @media (max-width: 720px){.polaris-v85-shell .polaris-qa-strip{grid-template-columns:1fr;}}
      .polaris-v85-shell .polaris-qa-step{
        border:1px solid rgba(15,23,42,.10);background:#fff;border-radius:22px;padding:14px;box-shadow:0 10px 24px rgba(15,23,42,.05);
      }
      .polaris-v85-shell .polaris-qa-step .num{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:999px;background:#0f172a;color:#fff;font-size:12px;font-weight:900;}
      .polaris-v85-shell .polaris-qa-step.done{border-color:#86efac;background:#f0fdf4;}
      .polaris-v85-shell .polaris-qa-step.active{border-color:#a78bfa;background:#f5f3ff;box-shadow:0 16px 34px rgba(124,58,237,.12);}
      .polaris-v85-shell .polaris-top-safe-area{padding-top:max(20px, env(safe-area-inset-top));}
      /* V9.1: operation-flow polish / 操作流程与按钮可读性增强 */
      .polaris-v85-shell, .polaris-v85-shell *{box-sizing:border-box;}
      .polaris-v85-shell button{line-height:1.35;white-space:normal;word-break:keep-all;}
      .polaris-v85-shell button:focus-visible{outline:3px solid rgba(124,58,237,.35);outline-offset:3px;}
      .polaris-v85-shell .polaris-v91-command-card{background:linear-gradient(135deg,#ffffff,#f8fbff 48%,#eef6ff);border:1px solid rgba(15,23,42,.10);box-shadow:0 22px 56px rgba(15,23,42,.08);}
      .polaris-v85-shell .polaris-v91-progress-track{height:12px;border-radius:999px;background:#e2e8f0;overflow:hidden;}
      .polaris-v85-shell .polaris-v91-progress-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#7c3aed,#06b6d4,#10b981);transition:width .35s ease;}
      .polaris-v85-shell .polaris-v91-flow-chip{display:inline-flex;align-items:center;gap:8px;border-radius:999px;background:#f1f5f9;border:1px solid #e2e8f0;padding:8px 12px;font-size:13px;font-weight:900;color:#334155;}
      .visual-canvas-v89 .polaris-v91-canvas-action{min-height:48px;border-radius:16px;font-size:14px;font-weight:900;line-height:1.3;}
      .visual-canvas-v89 .polaris-v91-status-card{background:#fff;border:1px solid #e2e8f0;border-radius:24px;padding:14px;box-shadow:0 10px 26px rgba(15,23,42,.05);}
      /* V9.3 Ritual Motion polish / 仪式感与高级动效 */
      @keyframes polarisAuroraDrift{0%{transform:translate3d(-4%,0,0) scale(1);opacity:.72}50%{transform:translate3d(4%,-3%,0) scale(1.08);opacity:1}100%{transform:translate3d(-4%,0,0) scale(1);opacity:.72}}
      @keyframes polarisFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      @keyframes polarisScan{0%{transform:translateX(-120%);opacity:.08}45%{opacity:.38}100%{transform:translateX(120%);opacity:.08}}
      @keyframes polarisPulseRing{0%{transform:scale(.94);opacity:.45}70%{transform:scale(1.14);opacity:0}100%{opacity:0}}
      @keyframes polarisProgressGlow{0%{filter:hue-rotate(0deg);box-shadow:0 0 0 rgba(124,58,237,0)}50%{filter:hue-rotate(18deg);box-shadow:0 0 28px rgba(6,182,212,.28)}100%{filter:hue-rotate(0deg);box-shadow:0 0 0 rgba(124,58,237,0)}}
      .polaris-v92-hero-dynamic:before{content:"";position:absolute;inset:-30%;background:radial-gradient(circle at 25% 20%,rgba(124,58,237,.24),transparent 28%),radial-gradient(circle at 78% 12%,rgba(6,182,212,.22),transparent 30%),radial-gradient(circle at 48% 78%,rgba(251,191,36,.18),transparent 32%);animation:polarisAuroraDrift 10s ease-in-out infinite;pointer-events:none;}
      .polaris-v92-hero-dynamic:after{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(15,23,42,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.045) 1px,transparent 1px);background-size:36px 36px;mask-image:linear-gradient(180deg,rgba(0,0,0,.75),rgba(0,0,0,.12));pointer-events:none;}
      .polaris-v92-launch-card{position:relative;animation:polarisFloat 7s ease-in-out infinite;}
      .polaris-v92-launch-card:before{content:"";position:absolute;right:18px;top:68px;width:90px;height:90px;border-radius:999px;border:1px solid rgba(124,58,237,.22);animation:polarisPulseRing 2.8s ease-out infinite;pointer-events:none;}
      .polaris-v92-clapper{background:repeating-linear-gradient(135deg,#111827 0 24px,#ffffff 24px 48px,#fbbf24 48px 72px,#ffffff 72px 96px);}
      .polaris-v92-scanline{position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.82),transparent);width:42%;animation:polarisScan 4.8s ease-in-out infinite;pointer-events:none;}
      .polaris-v92-ritual-node,.polaris-v92-ceremony-card{position:relative;overflow:hidden;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease;}
      .polaris-v92-ritual-node:hover,.polaris-v92-ceremony-card:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(15,23,42,.10);}
      .polaris-v92-ritual-node.is-ready:after,.polaris-v92-ceremony-card.is-done:after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 0%,rgba(255,255,255,.72) 50%,transparent 100%);transform:translateX(-130%);animation:polarisScan 5.5s ease-in-out infinite;pointer-events:none;}
      .polaris-v92-progress-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#7c3aed,#06b6d4,#10b981,#f59e0b);animation:polarisProgressGlow 3.6s ease-in-out infinite;transition:width .45s cubic-bezier(.2,.8,.2,1);}
      .polaris-v92-premiere-button{background:linear-gradient(135deg,#4c1d95,#7c3aed 38%,#06b6d4 100%);transition:transform .2s ease,box-shadow .2s ease;}
      .polaris-v92-premiere-button:hover{transform:translateY(-2px) scale(1.01);box-shadow:0 18px 42px rgba(124,58,237,.28);}
      .polaris-v92-ceremony-strip{position:relative;overflow:hidden;}
      .polaris-v92-ceremony-strip:before{content:"";position:absolute;left:-10%;top:-80px;width:45%;height:180px;background:radial-gradient(circle,rgba(124,58,237,.16),transparent 70%);filter:blur(4px);animation:polarisAuroraDrift 12s ease-in-out infinite;pointer-events:none;}
      .visual-canvas-v92 .polaris-v92-canvas-stage{position:relative;overflow:hidden;background:linear-gradient(135deg,#ffffff,#f8fbff 55%,#eef7ff);}
      .visual-canvas-v92 .polaris-v92-canvas-stage:before{content:"";position:absolute;inset:-60px;background:radial-gradient(circle at 14% 20%,rgba(124,58,237,.14),transparent 28%),radial-gradient(circle at 88% 18%,rgba(6,182,212,.16),transparent 32%);animation:polarisAuroraDrift 9s ease-in-out infinite;pointer-events:none;}
      .visual-canvas-v92 .polaris-v92-shot-card{position:relative;overflow:hidden;}
      .visual-canvas-v92 .polaris-v92-shot-card:before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:linear-gradient(90deg,#7c3aed,#06b6d4,#10b981);opacity:.75;}



      /* V10.6 Page QA Repair: global readability, API state, premium buttons / 页面质检修复 */
      .polaris-v85-shell .polaris-v97-qa-card{background:linear-gradient(135deg,rgba(255,255,255,.94),rgba(248,250,252,.9));border:1px solid rgba(15,23,42,.10);box-shadow:0 18px 48px rgba(15,23,42,.08);backdrop-filter:blur(18px);}
      .polaris-v85-shell .polaris-v97-status-dot{position:relative;display:inline-flex;width:10px;height:10px;border-radius:999px;background:#10b981;box-shadow:0 0 0 6px rgba(16,185,129,.12);}
      .polaris-v85-shell .polaris-v97-status-dot.off{background:#f59e0b;box-shadow:0 0 0 6px rgba(245,158,11,.16);}
      .polaris-v85-shell .polaris-v97-button{min-height:46px;border-radius:16px;padding:12px 16px;font-size:14px;font-weight:950;line-height:1.25;letter-spacing:.01em;transition:transform .18s ease,box-shadow .18s ease,filter .18s ease;}
      .polaris-v85-shell .polaris-v97-button:not(:disabled):hover{transform:translateY(-2px);box-shadow:0 16px 34px rgba(15,23,42,.14);filter:saturate(1.08);}
      .polaris-v85-shell .polaris-v97-primary{background:linear-gradient(135deg,#0f172a,#7c3aed 50%,#06b6d4);color:#fff!important;border:1px solid rgba(124,58,237,.32);}
      .polaris-v85-shell .polaris-v97-secondary{background:#fff;color:#0f172a!important;border:1px solid rgba(15,23,42,.13);}
      .polaris-v85-shell .polaris-v97-success{background:linear-gradient(135deg,#059669,#10b981);color:#fff!important;border:1px solid rgba(16,185,129,.35);}
      .polaris-v85-shell .polaris-v97-warning{background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#111827!important;border:1px solid rgba(245,158,11,.35);}
      .polaris-project-studio-light button:not(.polaris-v96-primary):not(.polaris-v96-green):not(.polaris-v96-cyan):not(.polaris-v96-amber):not(.polaris-primary-button):not(.polaris-purple-button):not(.polaris-green-button):not(.polaris-cyan-button)[class*="bg-white/5"],
      .polaris-project-studio-light button:not(.polaris-v96-primary):not(.polaris-v96-green):not(.polaris-v96-cyan):not(.polaris-v96-amber):not(.polaris-primary-button):not(.polaris-purple-button):not(.polaris-green-button):not(.polaris-cyan-button)[class*="bg-black"]{background:#fff!important;color:#0f172a!important;border-color:rgba(15,23,42,.14)!important;}
      .polaris-project-studio-light button[class*="text-white"]:not(.polaris-v96-primary):not(.polaris-v96-green):not(.polaris-v96-cyan):not(.polaris-v96-amber):not(.polaris-primary-button):not(.polaris-purple-button):not(.polaris-green-button):not(.polaris-cyan-button){color:#0f172a!important;}
      .polaris-project-studio-light .text-stone-300,.polaris-project-studio-light .text-stone-400,.polaris-project-studio-light .text-stone-500{color:#64748b!important;}
      .polaris-project-studio-light input,.polaris-project-studio-light textarea{background:#fff!important;color:#0f172a!important;border-color:rgba(15,23,42,.14)!important;}
      .polaris-v96-node button{pointer-events:auto;}
      .polaris-v96-node:focus-visible{outline:4px solid rgba(124,58,237,.28);outline-offset:4px;}
      /* V10.6 Visual Workflow Studio + DeepSeek page repair / 工作流画布与 DeepSeek 接入后页面修复 */
      @keyframes polarisV95NodeGlow{0%,100%{box-shadow:0 12px 34px rgba(15,23,42,.06),0 0 0 rgba(124,58,237,0)}50%{box-shadow:0 18px 50px rgba(15,23,42,.10),0 0 34px rgba(6,182,212,.16)}}
      @keyframes polarisV95FlowMove{0%{background-position:0% 50%}100%{background-position:180% 50%}}
      @keyframes polarisV95SoftRise{0%{opacity:0;transform:translateY(12px) scale(.985)}100%{opacity:1;transform:translateY(0) scale(1)}}
      .polaris-v95-topology{position:relative;background:radial-gradient(circle at 12% 10%,rgba(124,58,237,.16),transparent 28%),radial-gradient(circle at 90% 6%,rgba(6,182,212,.14),transparent 30%),linear-gradient(135deg,#fff,#f8fbff 56%,#edf7ff);}
      .polaris-v95-topology:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(15,23,42,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.045) 1px,transparent 1px);background-size:32px 32px;mask-image:linear-gradient(180deg,rgba(0,0,0,.72),rgba(0,0,0,.12));pointer-events:none;}
      .polaris-v95-node{position:relative;overflow:hidden;border:1px solid rgba(15,23,42,.10);background:rgba(255,255,255,.92);box-shadow:0 14px 36px rgba(15,23,42,.06);backdrop-filter:blur(18px);animation:polarisV95SoftRise .35s ease-out both;}
      .polaris-v95-node.is-ready{border-color:rgba(16,185,129,.36);background:linear-gradient(180deg,#ffffff,#ecfdf5);animation:polarisV95NodeGlow 5.6s ease-in-out infinite;}
      .polaris-v95-node.is-active{border-color:rgba(124,58,237,.45);background:linear-gradient(180deg,#ffffff,#f5f3ff);box-shadow:0 20px 60px rgba(124,58,237,.14);}
      .polaris-v95-node:after{content:"";position:absolute;left:-30%;right:-30%;top:0;height:3px;background:linear-gradient(90deg,#7c3aed,#06b6d4,#10b981,#f59e0b,#7c3aed);background-size:180% 100%;animation:polarisV95FlowMove 4.5s linear infinite;opacity:.72;}
      .polaris-v95-connector{height:4px;border-radius:999px;background:linear-gradient(90deg,#cbd5e1,#8b5cf6,#06b6d4,#10b981);background-size:180% 100%;animation:polarisV95FlowMove 5.2s linear infinite;box-shadow:0 0 22px rgba(6,182,212,.20);}
      .polaris-v95-action{min-height:48px;border-radius:16px;font-size:14px;font-weight:950;line-height:1.25;padding:12px 14px;transition:transform .18s ease,box-shadow .18s ease,filter .18s ease;}
      .polaris-v95-action:not(:disabled):hover{transform:translateY(-2px);box-shadow:0 16px 36px rgba(15,23,42,.14);filter:saturate(1.08);}
      .polaris-v95-action-primary{background:linear-gradient(135deg,#111827,#7c3aed 52%,#06b6d4);color:#fff;border:1px solid rgba(124,58,237,.34);}
      .polaris-v95-action-light{background:#fff;color:#0f172a;border:1px solid rgba(15,23,42,.12);}
      .polaris-v95-action-green{background:linear-gradient(135deg,#059669,#10b981);color:#fff;border:1px solid rgba(16,185,129,.35);}
      .polaris-v95-action-cyan{background:linear-gradient(135deg,#0891b2,#06b6d4);color:#fff;border:1px solid rgba(6,182,212,.35);}
      .polaris-v95-action-amber{background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#111827;border:1px solid rgba(245,158,11,.35);}
      .polaris-v95-camera-card{position:relative;overflow:hidden;border-radius:24px;border:1px solid rgba(15,23,42,.10);background:linear-gradient(180deg,#fff,#f8fafc);padding:16px;box-shadow:0 12px 30px rgba(15,23,42,.05);}
      .polaris-v95-camera-card:before{content:"";position:absolute;right:-20px;top:-20px;width:72px;height:72px;border-radius:999px;background:radial-gradient(circle,rgba(124,58,237,.16),transparent 66%);}
      .polaris-v95-camera-map{background:linear-gradient(135deg,#0f172a,#111827 58%,#172554);position:relative;overflow:hidden;}
      .polaris-v95-camera-map:before{content:"";position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,rgba(255,255,255,.15) 1px,transparent 0);background-size:22px 22px;opacity:.8;}
      .polaris-v95-camera-map .axis{position:absolute;left:10%;right:10%;top:50%;height:2px;background:linear-gradient(90deg,transparent,#fbbf24,transparent);box-shadow:0 0 24px rgba(251,191,36,.35);}
      .polaris-v95-shot-mini{background:#fff;border:1px solid #e2e8f0;border-radius:24px;padding:14px;text-align:left;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease;}
      .polaris-v95-shot-mini:hover{transform:translateY(-2px);border-color:#a78bfa;box-shadow:0 14px 34px rgba(124,58,237,.12);}
      .polaris-v95-shot-mini.is-active{border-color:#7c3aed;background:#f5f3ff;box-shadow:0 18px 38px rgba(124,58,237,.14);}
      .polaris-project-studio-light .polaris-project-studio-card{background:linear-gradient(135deg,#ffffff,#f8fbff 54%,#eef6ff)!important;color:#0f172a!important;border-color:rgba(15,23,42,.10)!important;}
      .polaris-project-studio-light .polaris-project-studio-card h2,.polaris-project-studio-light .polaris-project-studio-card h3,.polaris-project-studio-light .polaris-project-studio-card .text-white{color:#0f172a!important;}
      .polaris-project-studio-light .polaris-project-studio-card .text-stone-300,.polaris-project-studio-light .polaris-project-studio-card .text-stone-400,.polaris-project-studio-light .polaris-project-studio-card .text-stone-500{color:#64748b!important;}
      .polaris-project-studio-light .polaris-project-studio-card [class*="bg-black/"],.polaris-project-studio-light .polaris-project-studio-card [class*="bg-white/5"],.polaris-project-studio-light .polaris-project-studio-card [class*="bg-white/[0.03]"]{background:rgba(255,255,255,.88)!important;border-color:rgba(15,23,42,.10)!important;color:#0f172a!important;box-shadow:0 10px 28px rgba(15,23,42,.05);}
      .polaris-project-studio-light .polaris-project-studio-card button[class*="border-white/10"]{background:#fff!important;color:#0f172a!important;border-color:rgba(15,23,42,.12)!important;}
      .polaris-project-studio-light .polaris-project-studio-card .text-cyan-200,.polaris-project-studio-light .polaris-project-studio-card .text-cyan-300{color:#0891b2!important;}
      .polaris-project-studio-light .polaris-project-studio-card .text-amber-200,.polaris-project-studio-light .polaris-project-studio-card .text-amber-300{color:#b45309!important;}
      .polaris-project-studio-light .polaris-project-studio-card .text-emerald-200,.polaris-project-studio-light .polaris-project-studio-card .text-emerald-300{color:#047857!important;}
      .polaris-project-studio-light .polaris-project-studio-card .text-purple-200,.polaris-project-studio-light .polaris-project-studio-card .text-violet-200{color:#7c3aed!important;}

      /* V9.6 Premium Motion: DeepSeek API 后工作台、按钮、背景、模式弹窗高级化 */
      @keyframes polarisV94Shimmer{0%{transform:translateX(-140%) skewX(-12deg);opacity:0}18%{opacity:.55}55%{opacity:.22}100%{transform:translateX(150%) skewX(-12deg);opacity:0}}
      @keyframes polarisV94Orbit{0%{transform:translate3d(-2%,0,0) rotate(0deg) scale(1)}50%{transform:translate3d(3%,-2%,0) rotate(8deg) scale(1.05)}100%{transform:translate3d(-2%,0,0) rotate(0deg) scale(1)}}
      @keyframes polarisV94Breath{0%,100%{box-shadow:0 24px 80px rgba(124,58,237,.12), inset 0 1px 0 rgba(255,255,255,.75)}50%{box-shadow:0 32px 110px rgba(6,182,212,.18), inset 0 1px 0 rgba(255,255,255,.9)}}
      .polaris-v85-shell{position:relative;isolation:isolate;background:
        radial-gradient(circle at 10% -8%, rgba(124,58,237,.22), transparent 28%),
        radial-gradient(circle at 90% 4%, rgba(6,182,212,.20), transparent 30%),
        radial-gradient(circle at 58% 102%, rgba(251,191,36,.16), transparent 34%),
        linear-gradient(180deg,#fbfdff 0%,#f4f8ff 44%,#eef5ff 100%)!important;}
      .polaris-v85-shell:before{content:"";position:fixed;inset:0;z-index:-2;background-image:linear-gradient(rgba(15,23,42,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.045) 1px,transparent 1px);background-size:42px 42px;mask-image:linear-gradient(180deg,rgba(0,0,0,.65),rgba(0,0,0,.12));pointer-events:none;}
      .polaris-v85-shell:after{content:"";position:fixed;inset:-22%;z-index:-1;background:radial-gradient(circle at 24% 24%,rgba(124,58,237,.16),transparent 26%),radial-gradient(circle at 76% 18%,rgba(6,182,212,.15),transparent 28%),radial-gradient(circle at 52% 78%,rgba(251,191,36,.12),transparent 30%);filter:blur(10px);animation:polarisV94Orbit 16s ease-in-out infinite;pointer-events:none;}
      .polaris-v85-shell header{border-bottom:1px solid rgba(148,163,184,.22)!important;background:linear-gradient(180deg,rgba(255,255,255,.92),rgba(255,255,255,.80))!important;box-shadow:0 18px 60px rgba(15,23,42,.08)!important;}
      .polaris-v85-shell header h1{font-size:18px!important;letter-spacing:.08em!important;}
      .polaris-v85-shell header button{border-radius:16px!important;background:#fff!important;color:#0f172a!important;border:1px solid rgba(15,23,42,.12)!important;box-shadow:0 8px 20px rgba(15,23,42,.06);}
      .polaris-v85-shell header button:hover{transform:translateY(-1px);box-shadow:0 14px 30px rgba(15,23,42,.10);}
      .polaris-v85-shell header .polaris-v94-top-mode.is-active{background:linear-gradient(135deg,#111827,#7c3aed)!important;color:#fff!important;border-color:rgba(124,58,237,.45)!important;}
      .polaris-v85-shell button{font-weight:900!important;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease,background .18s ease!important;}
      .polaris-v85-shell button:not(:disabled):hover{transform:translateY(-1px);}
      .polaris-v85-shell button:not(:disabled):active{transform:translateY(0) scale(.99);}
      .polaris-v85-shell button[class*="bg-amber-400"], .polaris-v85-shell button[class*="bg-cyan-300"], .polaris-v85-shell button[class*="bg-cyan-500"], .polaris-v85-shell button[class*="bg-emerald-400"], .polaris-v85-shell button[class*="bg-emerald-500"], .polaris-v85-shell button[class*="bg-violet-600"], .polaris-v85-shell button[class*="bg-purple"]{box-shadow:0 14px 34px rgba(15,23,42,.14)!important;}
      .polaris-v85-shell .polaris-v91-command-card,.polaris-v85-shell .polaris-glass-card,.polaris-v85-shell .polaris-step-pill,.polaris-v85-shell .polaris-asset-card,.polaris-v85-shell section>.rounded-\[2rem\],.polaris-v85-shell section>.rounded-\[2\.2rem\]{animation:polarisV94Breath 8s ease-in-out infinite;background:linear-gradient(135deg,rgba(255,255,255,.94),rgba(248,251,255,.86))!important;}
      .polaris-v85-shell .polaris-v92-hero-dynamic{box-shadow:inset 0 1px 0 rgba(255,255,255,.86),0 28px 90px rgba(15,23,42,.10);}
      .polaris-v85-shell .polaris-v92-hero-dynamic:before{opacity:.9;filter:blur(6px);}
      .polaris-v85-shell .polaris-v92-launch-card,.polaris-v85-shell .polaris-v92-ceremony-strip{border-color:rgba(124,58,237,.16)!important;box-shadow:0 28px 85px rgba(15,23,42,.10)!important;}
      .polaris-v85-shell section[ class*="border-b" ], .polaris-v85-shell section.border-b{background:linear-gradient(90deg,rgba(255,255,255,.82),rgba(245,250,255,.76))!important;border-color:rgba(148,163,184,.22)!important;}
      .polaris-v85-shell .polaris-v94-entry-mode{background:#fff!important;color:#0f172a!important;border-color:rgba(15,23,42,.11)!important;box-shadow:0 10px 26px rgba(15,23,42,.06);}
      .polaris-v85-shell .polaris-v94-entry-mode.is-active{background:linear-gradient(135deg,#fbbf24,#fde68a)!important;color:#111827!important;border-color:#f59e0b!important;}
      .polaris-v94-modal{animation:polaris-select-pop .18s ease-out;}
      .polaris-v94-mode-panel{animation:polarisFloat 7s ease-in-out infinite;background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(239,246,255,.92));}
      .polaris-v94-mode-panel:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(15,23,42,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.045) 1px,transparent 1px);background-size:34px 34px;mask-image:linear-gradient(180deg,rgba(0,0,0,.5),rgba(0,0,0,.08));pointer-events:none;}
      .polaris-v94-modal-aura{position:absolute;inset:-28%;background:radial-gradient(circle at 22% 22%,rgba(124,58,237,.24),transparent 28%),radial-gradient(circle at 78% 20%,rgba(6,182,212,.20),transparent 28%),radial-gradient(circle at 50% 76%,rgba(251,191,36,.16),transparent 32%);filter:blur(12px);animation:polarisV94Orbit 12s ease-in-out infinite;pointer-events:none;}
      .polaris-v94-kicker{font-size:13px;font-weight:950;letter-spacing:.24em;text-transform:uppercase;color:#7c3aed;}
      .polaris-v94-mode-card{box-shadow:0 18px 44px rgba(15,23,42,.07);}
      .polaris-v94-mode-card:hover{transform:translateY(-6px);box-shadow:0 30px 80px rgba(15,23,42,.13);}
      .polaris-v94-mode-card.is-active{box-shadow:0 26px 70px rgba(251,191,36,.18);}
      .polaris-v94-card-glow{position:absolute;inset:0;background:linear-gradient(120deg,transparent,rgba(255,255,255,.82),transparent);transform:translateX(-140%) skewX(-12deg);pointer-events:none;}
      .polaris-v94-mode-card:hover .polaris-v94-card-glow{animation:polarisV94Shimmer 1.4s ease-out;}
      .polaris-v94-mini{box-shadow:0 12px 28px rgba(15,23,42,.06);}
      .polaris-v94-close-btn:hover{border-color:#a78bfa!important;color:#6d28d9!important;}
      .polaris-project-studio-light{background:radial-gradient(circle at 15% 0%,rgba(124,58,237,.18),transparent 30%),radial-gradient(circle at 85% 10%,rgba(6,182,212,.16),transparent 34%),rgba(15,23,42,.34)!important;}
      .polaris-project-studio-light .polaris-project-studio-card{background:rgba(255,255,255,.92)!important;backdrop-filter:blur(24px);box-shadow:0 38px 120px rgba(15,23,42,.24)!important;}
      .polaris-project-studio-light button{box-shadow:0 10px 24px rgba(15,23,42,.06);}
      .polaris-project-studio-light button:hover{box-shadow:0 16px 36px rgba(15,23,42,.11);}
      .polaris-project-studio-light pre{background:#0f172a!important;color:#e2e8f0!important;border:1px solid rgba(148,163,184,.18)!important;}
      @media (prefers-reduced-motion: reduce){.polaris-v85-shell:after,.polaris-v94-mode-panel,.polaris-v92-launch-card,.polaris-v92-scanline,.polaris-v92-progress-fill,.polaris-v94-modal-aura{animation:none!important;}}

      /* V10.2 DeepSeek API page + mode switch black box removal */
      .polaris-v992-api-command{background:linear-gradient(90deg,rgba(255,255,255,.88),rgba(238,247,255,.82))!important;}
      .polaris-v992-command-card,.polaris-v992-snapshot{position:relative;overflow:hidden;background:rgba(255,255,255,.92)!important;border:1px solid rgba(15,23,42,.10)!important;box-shadow:0 24px 70px rgba(15,23,42,.08);backdrop-filter:blur(22px);}
      .polaris-v992-command-card:before{content:"";position:absolute;inset:-40%;background:radial-gradient(circle at 20% 20%,rgba(124,58,237,.14),transparent 28%),radial-gradient(circle at 80% 18%,rgba(6,182,212,.16),transparent 28%),radial-gradient(circle at 55% 86%,rgba(251,191,36,.11),transparent 30%);animation:polarisV94Orbit 18s ease-in-out infinite;pointer-events:none;}
      .polaris-v992-command-card>*{position:relative;z-index:1;}
      .polaris-v992-kicker{font-size:12px;font-weight:950;letter-spacing:.22em;text-transform:uppercase;color:#7c3aed;}
      .polaris-v992-mode-chip{display:flex;min-width:150px;flex-direction:column;align-items:flex-start;gap:3px;border-radius:18px;border:1px solid rgba(15,23,42,.11)!important;background:#fff!important;color:#0f172a!important;padding:13px 15px!important;box-shadow:0 10px 22px rgba(15,23,42,.05)!important;}
      .polaris-v992-mode-chip span{font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.16em;color:#64748b;}.polaris-v992-mode-chip b{font-size:14px;}.polaris-v992-mode-chip.is-active{background:linear-gradient(135deg,#111827,#7c3aed)!important;color:#fff!important;border-color:rgba(124,58,237,.45)!important;}.polaris-v992-mode-chip.is-active span{color:#c4b5fd;}
      .polaris-v992-action{display:flex;min-height:92px!important;flex-direction:column;align-items:flex-start;justify-content:center;gap:5px;border-radius:22px!important;border:1px solid rgba(15,23,42,.10)!important;background:#fff!important;color:#0f172a!important;padding:16px!important;box-shadow:0 12px 26px rgba(15,23,42,.05)!important;}
      .polaris-v992-action span{font-size:11px;font-weight:950;color:#8b5cf6;}.polaris-v992-action b{font-size:17px;}.polaris-v992-action small{font-size:12px;font-weight:800;color:#64748b;}.polaris-v992-action.is-primary{background:linear-gradient(135deg,#0f172a,#7c3aed 55%,#06b6d4)!important;color:#fff!important;}.polaris-v992-action.is-primary span,.polaris-v992-action.is-primary small{color:#dbeafe;}
      .polaris-v992-online{border-radius:999px;background:#dcfce7;color:#047857;border:1px solid #86efac;padding:8px 12px;font-size:12px;font-weight:950;}
      .polaris-v992-stat{border-radius:18px;border:1px solid rgba(15,23,42,.09);background:#f8fafc;padding:13px;}.polaris-v992-stat small{display:block;font-size:11px;font-weight:950;letter-spacing:.14em;text-transform:uppercase;color:#64748b;}.polaris-v992-stat b{display:block;margin-top:6px;font-size:20px;color:#0f172a;}
      .polaris-v992-mini-btn{border-radius:16px!important;border:1px solid rgba(15,23,42,.10)!important;background:#fff!important;color:#0f172a!important;padding:11px!important;font-size:13px!important;font-weight:950!important;box-shadow:0 8px 18px rgba(15,23,42,.04)!important;}
      .polaris-v992-director-strip{background:rgba(255,255,255,.82)!important;backdrop-filter:blur(18px);}.polaris-v992-director-strip span{border-radius:999px;border:1px solid rgba(15,23,42,.10);background:#fff;color:#334155;padding:7px 12px;box-shadow:0 8px 16px rgba(15,23,42,.04);}
      .polaris-v992-director-hero{background:linear-gradient(135deg,#ffffff,#f8fbff 56%,#eef6ff)!important;color:#0f172a!important;border-color:rgba(15,23,42,.10)!important;box-shadow:0 24px 70px rgba(15,23,42,.08)!important;}
      .polaris-v992-director-hero .text-white{color:#0f172a!important;}.polaris-v992-director-hero .text-stone-400,.polaris-v992-director-hero .text-stone-500{color:#64748b!important;}.polaris-v992-director-hero [class*="bg-black/45"]{background:#fff!important;color:#0f172a!important;border-color:rgba(15,23,42,.10)!important;}
      .polaris-v85-shell .fixed.bottom-4.left-4{display:none!important;}

      @media (max-width: 768px){.polaris-v85-shell .polaris-main-title{letter-spacing:-.035em}.polaris-v85-shell .polaris-big-button{width:100%;justify-content:center}.polaris-v85-shell .polaris-v91-command-card{border-radius:28px!important}}
    ` }), isGenerating && _jsx(GenerationProgressSidebar, { progress: generateProgress, status: status, visible: progressSidebarVisible, onShow: () => setProgressSidebarVisible(true), onHide: () => setProgressSidebarVisible(false) }), _jsx(RitualOverlay, { ritual: ritualOverlay, onClose: () => setRitualOverlay(null) }), false && _jsx(ModeSwitchModal, { open: showModeSwitchModal, cards: v6ModeCards, currentMode: workspaceMode, apiIsReady: apiIsReady, onClose: () => setShowModeSwitchModal(false), onSelect: (id) => { setShowModeSwitchModal(false); switchWorkspaceMode(id); } }), _jsx(DigitalClapperboard, { open: showClapperboard, project: project, workspaceMode: workspaceMode, selectedModel: selectedModel, tech: tech, style: style, onCancel: () => setShowClapperboard(false), onAction: () => { setShowClapperboard(false); handleGenerate(); } }), _jsx(DirectorCutReadyModal, { summary: directorCutSummary, onClose: () => setDirectorCutSummary(null), onExport: () => { setDirectorCutSummary(null); makeWord(rebuildFinalPrompts(shots), project, script, style, tech, modules); } }), apiErrorModal && _jsx("div", { className: "fixed inset-0 z-[130] flex items-center justify-center bg-black/70 px-5 backdrop-blur-xl", children: _jsxs("div", { className: "w-full max-w-lg rounded-[2rem] border border-red-400/25 bg-[#0b0b0a] p-7 shadow-[0_0_80px_rgba(248,113,113,0.18)]", children: [_jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.3em] text-red-300", children: "API Error Assistant / \u63A5\u53E3\u9519\u8BEF\u52A9\u624B" }), _jsx("h3", { className: "mt-3 text-2xl font-black text-white", children: apiErrorModal.title }), _jsx("p", { className: "mt-4 text-sm leading-7 text-stone-300", children: apiErrorModal.message }), _jsxs("div", { className: "mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-[12px] leading-6 text-stone-400", children: [_jsx("b", { className: "text-amber-200", children: "\u5EFA\u8BAE\u5904\u7406 / Fix:" }), _jsx("br", {}), apiErrorModal.fix] }), apiErrorModal.raw && _jsx("pre", { className: "mt-4 max-h-32 overflow-auto rounded-2xl bg-black/60 p-4 text-[11px] text-red-200/70 whitespace-pre-wrap", children: apiErrorModal.raw }), _jsx("div", { className: "mt-6 flex justify-end gap-3", children: _jsx("button", { onClick: () => setApiErrorModal(null), className: "rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10", children: "Close / \u5173\u95ED" }) })] }) }), projectStudioOpen && typeof document !== "undefined" && createPortal(_jsx("div", { style: projectStudioTab === "canvas" ? { position: "fixed", inset: 0, zIndex: 999999, width: "100vw", height: "100dvh", maxWidth: "100vw", maxHeight: "100dvh", margin: 0, padding: 0, overflow: "hidden", borderRadius: 0, background: "#f8fafc" } : undefined, className: projectStudioTab === "canvas" ? "fixed inset-0 z-[999999] m-0 h-[100dvh] w-[100vw] max-w-none overflow-hidden rounded-none bg-slate-50 p-0 text-slate-900" : "polaris-project-studio-light fixed inset-0 z-[99998] overflow-y-auto bg-slate-950/20 px-5 py-8 backdrop-blur-xl", children: _jsxs("div", { style: projectStudioTab === "canvas" ? { width: "100vw", height: "100dvh", maxWidth: "100vw", maxHeight: "100dvh", margin: 0, padding: 0, overflow: "hidden", borderRadius: 0, background: "#f8fafc" } : undefined, className: projectStudioTab === "canvas" ? "m-0 h-[100dvh] w-[100vw] max-w-none overflow-hidden rounded-none bg-[#030303] p-0" : "polaris-project-studio-card mx-auto max-w-7xl rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)]", children: [_jsxs("div", { className: projectStudioTab === "canvas" ? "hidden" : "flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.32em] text-violet-600", children: "V10.6 Project Studio / \u9879\u76EE\u4E2D\u5FC3" }), _jsx("h2", { className: "mt-2 text-3xl font-black text-slate-950", children: "\u9879\u76EE\u4E2D\u5FC3 \u00B7 \u5DE5\u4F5C\u6D41\u753B\u5E03 \u00B7 \u4EA4\u4ED8\u5DE5\u4F5C\u53F0" }), _jsx("p", { className: "mt-2 text-sm text-slate-500", children: "DeepSeek \u8D1F\u8D23\u63D0\u793A\u8BCD\u4E0E\u903B\u8F91\uFF0C\u753B\u5E03\u8D1F\u8D23\u56FE\u50CF\u3001\u673A\u4F4D\u3001\u89C6\u9891\u548C\u4EA4\u4ED8\uFF0C\u4E0D\u518D\u628A\u6240\u6709\u529F\u80FD\u5806\u6210\u540E\u53F0\u3002" })] }), _jsx("button", { onClick: () => setProjectStudioOpen(false), className: "rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10", children: "Close / \u5173\u95ED" })] }), _jsxs("div", { className: projectStudioTab === "canvas" ? "hidden" : "mt-5 rounded-3xl border border-cyan-300/15 bg-cyan-400/5 p-4", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200", children: "Workflow Navigation / \u6D41\u7A0B\u5BFC\u822A" }), _jsx("p", { className: "mt-1 text-[12px] leading-6 text-stone-400", children: "\u6309\u7167\u771F\u5B9E\u5DE5\u4F5C\u6D41\u4F7F\u7528\uFF1A\u5148\u7ACB\u9879 \u2192 \u5199\u5927\u7EB2 \u2192 \u5206\u955C \u2192 \u63D0\u793A\u8BCD \u2192 \u5173\u952E\u5E27 \u2192 \u5BFC\u51FA\u4EA4\u4ED8\u3002\u9AD8\u7EA7\u529F\u80FD\u4ECD\u5168\u90E8\u4FDD\u7559\uFF0C\u4F46\u4E0D\u518D\u6253\u6563\u3002" })] }), _jsx("button", { onClick: () => setProjectStudioTab("workflow"), className: "rounded-2xl border border-cyan-300/25 bg-cyan-300/15 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-cyan-100 hover:bg-cyan-300/25", children: "Back to Workflow / \u8FD4\u56DE\u6D41\u7A0B\u603B\u89C8" })] }), _jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: [["workflow", "00 Workflow / 流程总览"], ["wizard", "01 Start / 立项"], ["preflight", "02 Input / 需求体检"], ["shots", "03 Storyboard / 分镜"], ["prompt", "04 Prompt / 提示词"], ["visual", "05 Keyframe / 关键帧"], ["canvas", "06 Canvas / 导演画布"], ["rhythm", "07 Rhythm / 节奏"], ["caption", "07 Publish / 发布"], ["delivery", "09 Delivery / 交付"], ["center", "Project Center / 项目中心"], ["templates", "Templates / 模板库"], ["client", "Client View / 客户视图"], ["files", "Project File / 工程文件"]].map(([id, label]) => _jsx("button", { onClick: () => id === "canvas" ? openDirectorCanvas() : setProjectStudioTab(id), className: `rounded-2xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${projectStudioTab === id ? "border-cyan-300 bg-cyan-300 text-black" : "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"}`, children: label }, id)) })] }), _jsxs("div", { style: projectStudioTab === "canvas" ? { width: "100vw", height: "100dvh", margin: 0, padding: 0, overflow: "hidden" } : undefined, className: projectStudioTab === "canvas" ? "m-0 h-[100dvh] w-[100vw] overflow-hidden p-0" : "mt-6", children: [projectStudioTab === "workflow" && _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "rounded-[2rem] border border-amber-300/20 bg-gradient-to-r from-amber-400/10 via-cyan-400/5 to-purple-400/10 p-6", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.28em] text-amber-200", children: "Workflow Overview / \u9875\u9762\u6309\u6D41\u7A0B\u7F16\u6392" }), _jsx("h3", { className: "mt-3 text-3xl font-black text-white", children: "\u63A8\u8350\u4F7F\u7528\u987A\u5E8F\uFF1A\u5148\u5185\u5BB9\uFF0C\u540E\u63D0\u793A\u8BCD\uFF0C\u518D\u5173\u952E\u5E27\uFF0C\u6700\u540E\u4EA4\u4ED8" }), _jsx("p", { className: "mt-3 max-w-4xl text-sm leading-7 text-stone-300", children: "\u4F60\u73B0\u5728\u770B\u5230\u7684\u662F\u6309\u771F\u5B9E\u521B\u4F5C\u6D41\u7A0B\u91CD\u7F16\u6392\u540E\u7684\u5BFC\u822A\u3002\u8FD9\u6837\u7528\u6237\u4E0D\u7528\u731C\u6BCF\u4E2A\u6A21\u5757\u5728\u54EA\u4E00\u6B65\u7528\uFF0C\u76F4\u63A5\u8DDF\u7740\u6D41\u7A0B\u8D70\u5373\u53EF\u3002\u539F\u6709\u6240\u6709\u9AD8\u7EA7\u529F\u80FD\u4ECD\u4FDD\u7559\u5728\u5404\u6B65\u9AA4\u9875\u9762\u4E2D\u3002" })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: [_jsxs("button", { onClick: openPromptOnlyWorkspace, className: `rounded-[2rem] border p-6 text-left transition ${productionFlowMode === "prompt-only" ? "border-emerald-300 bg-emerald-400/15" : "border-white/10 bg-black/30 hover:bg-white/10"}`, children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200", children: "Option A \u00B7 Default / \u9ED8\u8BA4\u6D41\u7A0B" }), _jsx("div", { className: "mt-2 text-2xl font-black text-white", children: "Prompt Only / \u53EA\u751F\u6210\u63D0\u793A\u8BCD" }), _jsx("p", { className: "mt-3 text-[12px] leading-6 text-stone-300", children: "\u53EA\u751F\u6210\u5267\u672C\u3001\u5927\u7EB2\u3001\u5206\u955C\u3001\u89C6\u9891\u63D0\u793A\u8BCD\u3001\u573A\u666F\u56FE\u63D0\u793A\u8BCD\u548C Prompt Pack\u3002\u4E0D\u4F1A\u81EA\u52A8\u8C03\u7528\u706B\u5C71\u5373\u68A6 / Seedream \u56FE\u7247\u751F\u6210\u63A5\u53E3\uFF0C\u9002\u5408\u53EA\u8981\u63D0\u793A\u8BCD\u7684\u7528\u6237\u3002" }), _jsx("div", { className: "mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-[11px] text-emerald-100", children: "\u4F4E\u6210\u672C / \u4E0D\u751F\u56FE / \u9ED8\u8BA4\u63A8\u8350" })] }), _jsxs("button", { onClick: openFullVisualWorkspace, className: `rounded-[2rem] border p-6 text-left transition ${productionFlowMode === "full-visual" ? "border-cyan-300 bg-cyan-400/15" : "border-white/10 bg-black/30 hover:bg-white/10"}`, children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200", children: "Option B \u00B7 Optional / \u4E3B\u52A8\u9009\u62E9" }), _jsx("div", { className: "mt-2 text-2xl font-black text-white", children: "Full Visual / \u5B8C\u6574\u6D41\u7A0B\u542B\u56FE\u7247" }), _jsx("p", { className: "mt-3 text-[12px] leading-6 text-stone-300", children: "\u5728\u63D0\u793A\u8BCD\u5B8C\u6210\u540E\uFF0C\u7EE7\u7EED\u751F\u6210\u5206\u955C\u5173\u952E\u5E27\u3001\u89C6\u89C9\u9501\u5B9A\u3001\u89C6\u9891\u6A21\u578B\u8DEF\u7531\u548C\u56FE\u751F\u89C6\u9891\u4EA4\u4ED8\u5305\u3002\u53EA\u6709\u9009\u62E9\u8FD9\u4E2A\u6D41\u7A0B\u624D\u4F1A\u81EA\u52A8\u8C03\u7528\u56FE\u7247 API\u3002" }), _jsx("div", { className: "mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-[11px] text-cyan-100", children: "\u4F1A\u8C03\u7528 Seedream \u56FE\u7247\u63A5\u53E3 / \u5DF2\u542F\u7528\u6210\u672C\u4FDD\u62A4" })] })] }), _jsx("div", { className: "grid grid-cols-1 gap-4 xl:grid-cols-4 md:grid-cols-2", children: [
                                                { id: "wizard", step: "STEP 01", title: "Project Setup / 立项", desc: "确定项目类型、时长、平台、创作方式，先把项目立起来。" },
                                                { id: "preflight", step: "STEP 02", title: "Creative Input / 需求体检", desc: "检查一句话创意、剧本、参考链接、人物资料，避免默认内容污染。" },
                                                { id: "shots", step: "STEP 03", title: "Storyboard / 分镜流程", desc: "从大纲到分镜规划，再到正式分镜生成与镜头卡片。" },
                                                { id: "prompt", step: "STEP 04", title: "Prompt Engine / 提示词引擎", desc: "精修视频提示词、平台适配、诊断提示词质量。" },
                                                { id: "visual", step: "STEP 05", title: "Keyframe Studio / 关键帧", desc: "先生成分镜关键帧，再做角色/场景/首帧锁定。" },
                                                { id: "canvas", step: "STEP 06", title: "Director Canvas / 导演画布", desc: "把故事、分镜、提示词、关键帧和风险铺成可视化导演墙。" },
                                                { id: "rhythm", step: "STEP 07", title: "Editing Rhythm / 节奏", desc: "生成成片节奏表，检查每个 Shot 的叙事位置。" },
                                                { id: "caption", step: "STEP 08", title: "Publish Studio / 发布", desc: "生成旁白、字幕、标题、标签和发布文案。" },
                                                { id: "delivery", step: "STEP 09", title: "Delivery / 交付", desc: "导出 Word、Prompt Pack、完整交付包与图生视频包。" },
                                            ].map(card => _jsxs("button", { onClick: () => setProjectStudioTab(card.id), className: "rounded-3xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/10", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200", children: card.step }), _jsx("div", { className: "mt-2 text-xl font-black text-white", children: card.title }), _jsx("p", { className: "mt-3 text-[12px] leading-6 text-stone-400", children: card.desc }), _jsx("div", { className: "mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200", children: "Click to open / \u70B9\u51FB\u8FDB\u5165" })] }, card.id)) }), _jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-3", children: [_jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/35 p-5", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-amber-200", children: "Current Status / \u5F53\u524D\u8FDB\u5EA6" }), _jsxs("div", { className: "mt-3 text-sm leading-7 text-stone-300", children: ["\u9879\u76EE\uFF1A", _jsx("b", { className: "text-white", children: project }), _jsx("br", {}), "\u4E00\u53E5\u8BDD\u9700\u6C42\uFF1A", ideaInput ? "已填写" : "未填写", _jsx("br", {}), "\u5927\u7EB2\uFF1A", outlineDraft || script ? "已准备" : "未生成", _jsx("br", {}), "\u5206\u955C\uFF1A", shots.length ? `${shots.length} 个镜头` : "未生成", _jsx("br", {}), "\u5173\u952E\u5E27\uFF1A", Object.values(shotKeyframes).filter(x => x?.images?.length).length, "/", shots.length || 0] })] }), _jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/35 p-5", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200", children: "Best Practice / \u6700\u4F73\u4F7F\u7528\u65B9\u5F0F" }), _jsxs("p", { className: "mt-3 text-sm leading-7 text-stone-300", children: ["\u5148\u5728 ", _jsx("b", { className: "text-white", children: "\u7ACB\u9879" }), " \u586B\u4E00\u53E5\u8BDD\u521B\u610F\uFF0C\u518D\u8DD1 ", _jsx("b", { className: "text-white", children: "\u4F53\u68C0" }), "\uFF0C\u786E\u8BA4\u65E0\u8BEF\u540E\u53BB ", _jsx("b", { className: "text-white", children: "\u5206\u955C" }), "\uFF0C\u5206\u955C\u7A33\u5B9A\u540E\u518D\u8FDB ", _jsx("b", { className: "text-white", children: "\u63D0\u793A\u8BCD" }), " \u548C ", _jsx("b", { className: "text-white", children: "\u5173\u952E\u5E27" }), "\u3002\u4E0D\u8981\u4E00\u5F00\u59CB\u5C31\u76F4\u63A5\u751F\u6210\u56FE\u7247\u3002"] })] }), _jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/35 p-5", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-purple-200", children: "Advanced Tools / \u9AD8\u7EA7\u5DE5\u5177" }), _jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [_jsx("button", { onClick: () => setProjectStudioTab("center"), className: "rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white", children: "\u9879\u76EE\u4E2D\u5FC3" }), _jsx("button", { onClick: () => setProjectStudioTab("templates"), className: "rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white", children: "\u6A21\u677F\u5E93" }), _jsx("button", { onClick: () => setProjectStudioTab("client"), className: "rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white", children: "\u5BA2\u6237\u9884\u89C8" }), _jsx("button", { onClick: () => setProjectStudioTab("files"), className: "rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white", children: "\u5DE5\u7A0B\u6587\u4EF6" })] })] })] })] }), projectStudioTab === "center" && _jsxs("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-3", children: [_jsxs("div", { className: "rounded-3xl border border-white/10 bg-white/5 p-5", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200", children: "Current Project / \u5F53\u524D\u9879\u76EE" }), _jsx("div", { className: "mt-3 text-xl font-black text-white", children: project }), _jsxs("div", { className: "mt-2 text-[12px] leading-6 text-stone-400", children: ["\u6A21\u5F0F\uFF1A", workspaceMode || "未选择", _jsx("br", {}), "\u955C\u5934\uFF1A", shots.length, _jsx("br", {}), "\u72B6\u6001\uFF1A", lastArchiveId ? "已封版" : shots.length ? "已生成" : script ? "草稿" : "待开始"] }), _jsx("button", { onClick: saveCurrentProjectToLibrary, className: "mt-5 w-full rounded-2xl bg-cyan-300 px-4 py-3 text-[11px] font-black uppercase text-black", children: "Save Project / \u4FDD\u5B58\u9879\u76EE" })] }), _jsxs("div", { className: "lg:col-span-2 rounded-3xl border border-white/10 bg-black/35 p-5", children: [_jsx("div", { className: "mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-amber-200", children: "Project Library / \u9879\u76EE\u5E93" }), _jsx("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2", children: projectLibrary.length ? projectLibrary.map(item => _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("div", { className: "text-sm font-black text-white", children: item.title }), _jsxs("div", { className: "mt-1 text-[10px] text-stone-500", children: [item.savedAt, " \u00B7 ", item.mode, " \u00B7 ", item.shotCount, " shots"] }), _jsx("div", { className: "mt-2 line-clamp-2 text-[11px] text-stone-400", children: item.scriptPreview }), _jsxs("div", { className: "mt-3 flex gap-2", children: [_jsx("button", { onClick: () => openProjectFromLibrary(item), className: "rounded-xl bg-amber-400 px-3 py-2 text-[10px] font-black text-black", children: "Open" }), _jsx("button", { onClick: () => deleteProjectFromLibrary(item.id), className: "rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-[10px] font-black text-red-200", children: "Delete / \u5220\u9664" })] })] }, item.id)) : _jsx("div", { className: "text-sm text-stone-500", children: "\u6682\u65E0\u4FDD\u5B58\u9879\u76EE\uFF0C\u70B9\u51FB\u5DE6\u4FA7 Save Project \u4FDD\u5B58\u5F53\u524D\u5DE5\u4F5C\u533A\u3002" }) })] })] }), projectStudioTab === "wizard" && _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-6", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200", children: "New Project Wizard / \u65B0\u5EFA\u9879\u76EE\u5411\u5BFC" }), _jsx("h3", { className: "mt-3 text-2xl font-black text-white", children: "\u4F60\u8981\u505A\u4EC0\u4E48\u7C7B\u578B\uFF1F" }), _jsx("p", { className: "mt-2 text-sm text-stone-400", children: "\u9009\u62E9\u9879\u76EE\u7C7B\u578B\uFF0C\u6216\u4F7F\u7528\u81EA\u5B9A\u4E49\u7C7B\u578B\uFF0C\u7CFB\u7EDF\u4F1A\u81EA\u52A8\u914D\u7F6E\u4E00\u53E5\u8BDD\u9700\u6C42\u3001\u65F6\u957F\u3001\u7206\u6B3E\u903B\u8F91\u548C\u57FA\u7840\u53C2\u6570\u3002" })] }), _jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3", children: PROJECT_TYPE_OPTIONS.map(item => _jsxs("button", { type: "button", onClick: () => setProjectWizard(p => ({ ...p, projectType: item.id })), className: `rounded-3xl border p-5 text-left transition ${projectWizard.projectType === item.id ? "border-amber-300 bg-amber-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`, children: [_jsx("div", { className: "text-lg font-black text-white", children: item.zh }), _jsx("div", { className: "mt-1 text-[11px] font-black uppercase tracking-widest text-stone-500", children: item.en }), _jsx("div", { className: "mt-3 line-clamp-3 text-[12px] leading-6 text-stone-400", children: item.id === "custom" ? "输入自己的项目类型，不被固定模板限制。" : item.idea })] }, item.id)) }), projectWizard.projectType === "custom" && _jsx(FormField, { label: "Custom Project Type", zh: "\u81EA\u5B9A\u4E49\u9879\u76EE\u7C7B\u578B", children: _jsx(Input, { value: projectWizard.customType, onChange: e => setProjectWizard(p => ({ ...p, customType: e.target.value })), placeholder: "\u4F8B\u5982\uFF1A\u7F8E\u98DF\u63A2\u5E97\u3001\u975E\u9057\u4EBA\u7269\u3001\u6BD5\u4E1A\u5B63\u77ED\u7247\u3001AI\u8BFE\u7A0B\u5BA3\u4F20..." }) }), _jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-3", children: [_jsx(FormField, { label: "Video Duration", zh: "\u89C6\u9891\u65F6\u957F", children: _jsx(Select, { items: OPT.videoDurations, value: projectWizard.duration, onChange: v => setProjectWizard(p => ({ ...p, duration: v })) }) }), _jsx(FormField, { label: "Use Case", zh: "\u4F7F\u7528\u573A\u666F", children: _jsx(Select, { items: PROJECT_USE_CASES, value: projectWizard.useCase, onChange: v => setProjectWizard(p => ({ ...p, useCase: v })) }) }), _jsx(FormField, { label: "Creation Method", zh: "\u521B\u4F5C\u65B9\u5F0F", children: _jsx(Select, { items: ["一句话生成 / One-line idea", "参考链接 / Reference link", "Word剧本导入 / Word script import", "从模板开始 / Start from template", "自定义 / Custom"], value: projectWizard.creationMethod, onChange: v => setProjectWizard(p => ({ ...p, creationMethod: v })) }) })] }), _jsx("button", { onClick: applyProjectWizard, className: "rounded-2xl bg-amber-400 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-black", children: "Create Project / \u521B\u5EFA\u9879\u76EE" })] }), projectStudioTab === "templates" && _jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: PROJECT_TEMPLATES.map(t => _jsx(ProjectTemplateCard, { template: t, onApply: applyProjectTemplate }, t.id)) }), projectStudioTab === "preflight" && _jsxs("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-2", children: [_jsxs("div", { className: "rounded-3xl border border-white/10 bg-white/5 p-5", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-amber-200", children: "Preflight Check / \u751F\u6210\u524D\u4F53\u68C0" }), _jsx("p", { className: "mt-3 text-sm leading-7 text-stone-400", children: "\u68C0\u67E5 API\u3001\u521B\u4F5C\u9700\u6C42\u3001\u53C2\u8003\u8D44\u6599\u3001\u4EBA\u7269\u4E8B\u5B9E\u3001\u65F6\u957F\u548C\u98CE\u683C\u662F\u5426\u5B8C\u6574\u3002" }), _jsxs("div", { className: "mt-5 flex gap-3", children: [_jsx("button", { onClick: runPreflightCheck, className: "rounded-2xl bg-amber-400 px-5 py-3 text-[11px] font-black uppercase text-black", children: "Run Check / \u5F00\u59CB\u4F53\u68C0" }), _jsx("button", { onClick: autoCompleteMissingInfo, className: "rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase text-white", children: "Auto Complete / \u81EA\u52A8\u8865\u5168" })] })] }), _jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/35 p-5", children: [_jsx("div", { className: "text-5xl font-black text-amber-300", children: preflightReport?.score || "--" }), _jsx("div", { className: "mt-2 text-[11px] font-black uppercase tracking-widest text-stone-500", children: "Preflight Score" }), _jsx("div", { className: "mt-4 text-sm text-stone-300", children: preflightReport?.summary || "尚未体检" }), _jsx("div", { className: "mt-4 space-y-2", children: (preflightReport?.issues || []).map((x, i) => _jsxs("div", { className: "rounded-xl border border-white/10 bg-white/5 p-3 text-[11px]", children: [_jsx("b", { className: "text-red-300", children: x.level }), " \u00B7 ", x.zh, _jsx("div", { className: "mt-1 text-stone-500", children: x.fix })] }, i)) })] })] }), projectStudioTab === "shots" && _jsx("div", { className: "space-y-5", children: _jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3", children: shots.length ? rebuildFinalPrompts(shots).map((s, i) => _jsx(ShotResultCard, { shot: s, index: i, active: activeShot === i, onSelect: () => { setActiveShot(i); setProjectStudioOpen(false); if (workspaceMode !== "director")
                                                setWorkspaceMode("director"); }, onCopyVideo: () => safeCopyText(s.finalPrompt || buildFinalPrompt(s, project, style, tech, modules, negativePrompt)), onCopyScene: () => safeCopyText(s.finalSceneImagePrompt || buildSceneImageModelVariant(s, project, style, tech, negativePrompt)), onCopyPlatform: (key) => copyPlatformPromptForShot(s, key) }, i)) : _jsx("div", { className: "rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-stone-500", children: "\u5C1A\u672A\u751F\u6210\u5206\u955C\u3002\u5148\u8FDB\u5165 Preflight \u6216\u4E13\u4E1A/\u5BFC\u6F14\u6A21\u5F0F\u751F\u6210\u5206\u955C\u3002" }) }) }), projectStudioTab === "visual" && _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: [_jsxs("button", { onClick: () => setProductionFlowMode("prompt-only"), className: `rounded-3xl border p-5 text-left transition ${productionFlowMode === "prompt-only" ? "border-emerald-300 bg-emerald-400/15" : "border-white/10 bg-black/30 hover:bg-white/10"}`, children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200", children: "Prompt Only / \u53EA\u751F\u6210\u63D0\u793A\u8BCD" }), _jsx("div", { className: "mt-2 text-xl font-black text-white", children: "\u4E0D\u81EA\u52A8\u751F\u6210\u53C2\u8003\u56FE\u7247" }), _jsx("p", { className: "mt-2 text-[12px] leading-6 text-stone-300", children: "\u505C\u7559\u5728\u63D0\u793A\u8BCD\u3001\u573A\u666F\u56FE\u63D0\u793A\u8BCD\u548C Prompt Pack\u3002\u7528\u6237\u4ECD\u53EF\u624B\u52A8\u751F\u6210\u5355\u5F20\u5173\u952E\u5E27\u3002" })] }), _jsxs("button", { onClick: () => setProductionFlowMode("full-visual"), className: `rounded-3xl border p-5 text-left transition ${productionFlowMode === "full-visual" ? "border-cyan-300 bg-cyan-400/15" : "border-white/10 bg-black/30 hover:bg-white/10"}`, children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200", children: "Full Visual / \u5B8C\u6574\u6D41\u7A0B\u542B\u56FE\u7247" }), _jsx("div", { className: "mt-2 text-xl font-black text-white", children: "\u4E3B\u52A8\u751F\u6210\u5206\u955C\u5173\u952E\u5E27" }), _jsx("p", { className: "mt-2 text-[12px] leading-6 text-stone-300", children: "\u8C03\u7528\u706B\u5C71\u5373\u68A6 / Seedream \u56FE\u7247 API\uFF0C\u751F\u6210\u5173\u952E\u5E27\u3001\u89C6\u89C9\u9501\u5B9A\u548C\u56FE\u751F\u89C6\u9891\u5305\u3002" })] })] }), _jsxs("div", { className: "rounded-3xl border border-purple-300/20 bg-purple-400/10 p-5", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-purple-200", children: "Keyframe Workflow / \u5173\u952E\u5E27\u6D41\u7A0B" }), _jsx("div", { className: "mt-4 grid grid-cols-1 gap-3 md:grid-cols-4", children: [
                                                        ["01", "设置图片接口", "先确认 Seedream 模型、尺寸和候选图数量。"],
                                                        ["02", "生成关键帧", "优先从分镜生成关键帧，不要一上来直接批量乱生。"],
                                                        ["03", "锁定视觉资产", "从满意关键帧里锁定角色、场景、风格和首帧。"],
                                                        ["04", "导出 I2V 包", "最后再生成视频模型路由和图生视频交付包。"],
                                                    ].map(([n, t, d]) => _jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/30 p-4", children: [_jsxs("div", { className: "text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200", children: ["Step ", n] }), _jsx("div", { className: "mt-2 text-sm font-black text-white", children: t }), _jsx("div", { className: "mt-2 text-[11px] leading-6 text-stone-400", children: d })] }, n)) })] }), _jsxs("div", { className: "grid grid-cols-1 gap-5 xl:grid-cols-[360px_minmax(0,1fr)]", children: [_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200", children: "Image API Gateway / \u56FE\u7247\u751F\u6210\u63A5\u53E3\u4E2D\u5FC3" }), _jsx("p", { className: "mt-3 text-sm leading-7 text-stone-400", children: "\u5148\u4E0D\u505A\u6602\u8D35\u7684\u89C6\u9891\u751F\u6210\uFF0C\u5148\u7528\u5206\u955C\u63D0\u793A\u8BCD\u751F\u6210\u5173\u952E\u5E27\uFF0C\u5F62\u6210 Prompt \u2192 Image \u2192 Video \u7684\u524D\u671F\u5DE5\u4E1A\u5305\u3002\u5DF2\u63A5\u5165\u706B\u5C71\u5F15\u64CE / \u5373\u68A6 Seedream\uFF1A\u540E\u7AEF route \u4F7F\u7528 ARK_API_KEY \u6216 VOLCENGINE_ARK_API_KEY \u8C03\u7528\u65B9\u821F\u56FE\u7247\u751F\u6210\u63A5\u53E3\u3002" }), _jsxs("div", { className: "mt-5 space-y-4", children: [_jsx(FormField, { label: "Image Provider", zh: "\u56FE\u7247\u6A21\u578B\u63A5\u53E3", children: _jsx(Select, { items: OPT.imageApiProviders, value: imageApiSettings.provider, onChange: v => setImageApiSettings(p => ({ ...p, provider: v, model: v.includes("Seedream") || v.includes("即梦") ? "doubao-seedream-5-0-260128" : v.includes("OpenAI") ? "gpt-image-1" : p.model })) }) }), _jsx(FormField, { label: "Video Provider", zh: "\u89C6\u9891\u667A\u80FD\u4F53\u63A5\u53E3", children: _jsx(Select, { items: OPT.videoApiProviders, value: videoApiSettings.provider, onChange: v => setVideoApiSettings(p => ({ ...p, provider: v })) }) }), _jsx(FormField, { label: "Video Model", zh: "\u89C6\u9891\u6A21\u578B/\u667A\u80FD\u4F53", children: _jsx(Input, { value: videoApiSettings.model, onChange: e => setVideoApiSettings(p => ({ ...p, model: e.target.value })) }) }), _jsx(FormField, { label: "Model", zh: "\u6A21\u578B\u540D\u79F0", children: _jsx(Input, { value: imageApiSettings.model, onChange: e => setImageApiSettings(p => ({ ...p, model: e.target.value })) }) }), _jsx(FormField, { label: "Endpoint", zh: "\u63A5\u53E3\u5730\u5740", children: _jsx(Input, { value: imageApiSettings.endpoint, onChange: e => setImageApiSettings(p => ({ ...p, endpoint: e.target.value })), placeholder: "/api/image-generate" }) }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(FormField, { label: "Size", zh: "\u5C3A\u5BF8", children: _jsx(Input, { value: imageApiSettings.size, onChange: e => setImageApiSettings(p => ({ ...p, size: e.target.value })) }) }), _jsx(FormField, { label: "Candidates", zh: "\u5019\u9009\u6570", children: _jsx(Select, { items: ["1", "2", "4"], value: imageApiSettings.candidates, onChange: v => setImageApiSettings(p => ({ ...p, candidates: v })) }) })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-3", children: [_jsx("button", { onClick: handleGenerateAllShotKeyframes, disabled: !shots.length || isGeneratingKeyframes, className: "rounded-2xl bg-cyan-300 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black disabled:opacity-50", children: "Generate All Shot Keyframes / \u751F\u6210\u5168\u90E8\u5206\u955C\u5173\u952E\u5E27" }), _jsx("button", { onClick: () => handleGenerateShotKeyframe(activeShot), disabled: !shots.length || isGeneratingKeyframes, className: "rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-cyan-200 disabled:opacity-40", children: "Generate Current Keyframe / \u751F\u6210\u5F53\u524D\u955C\u5934\u5173\u952E\u5E27" }), _jsx("button", { onClick: handleBuildVideoModelRouter, disabled: !shots.length, className: "rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white disabled:opacity-40", children: "Build Video Model Router / \u751F\u6210\u89C6\u9891\u6A21\u578B\u8DEF\u7531" }), _jsx("button", { onClick: handleGenerateAllShotVideos, disabled: !shots.length || isGeneratingVideos, className: "rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-emerald-200 disabled:opacity-40", children: "Generate Videos / \u63D0\u4EA4\u89C6\u9891\u4EFB\u52A1" }), _jsx("button", { onClick: handlePollAllVideoTasks, disabled: !Object.values(shotVideos).some(v => v?.taskId), className: "rounded-2xl border border-purple-300/20 bg-purple-400/10 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-purple-200 disabled:opacity-40", children: "Poll Videos / \u67E5\u8BE2\u89C6\u9891\u72B6\u6001" }), _jsx("button", { onClick: handleExportImageToVideoPack, disabled: !shots.length, className: "rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-emerald-200 disabled:opacity-40", children: "Export I2V Pack / \u5BFC\u51FA\u56FE\u751F\u89C6\u9891\u5305" })] }), _jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/35 p-5", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-amber-200", children: "Visual Lock System / \u89C6\u89C9\u9501\u5B9A\u7CFB\u7EDF" }), _jsx("div", { className: "mt-4 grid grid-cols-1 gap-2", children: [["character", "Lock Character / 锁定角色"], ["location", "Lock Location / 锁定场景"], ["style", "Lock Style / 锁定风格"], ["props", "Lock Props / 锁定道具"], ["firstFrame", "Lock First Frame / 锁定首帧"]].map(([key, label]) => _jsxs("button", { onClick: () => lockVisualFromKeyframe(key), className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-[11px] font-black uppercase text-stone-200 hover:bg-white/10", children: [label, _jsx("div", { className: "mt-1 line-clamp-1 text-[10px] font-normal text-stone-500", children: visualLocks[key]?.description || "未锁定 / Not locked" })] }, key)) })] })] }), _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "rounded-3xl border border-white/10 bg-white/5 p-5", children: [_jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200", children: "Shot Keyframe Wall / \u5206\u955C\u5173\u952E\u5E27\u5899" }), _jsx("p", { className: "mt-2 text-sm text-stone-500", children: "\u6BCF\u4E2A Shot \u7684\u5173\u952E\u5E27\u53EF\u4F5C\u4E3A\u56FE\u751F\u89C6\u9891\u9996\u5E27\u3001\u89C6\u89C9\u9501\u5B9A\u53C2\u8003\u548C\u5BA2\u6237\u9884\u89C8\u56FE\u3002" })] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-[11px] text-stone-400", children: ["\u5DF2\u751F\u6210 ", Object.values(shotKeyframes).filter(x => x?.images?.length).length, "/", shots.length] })] }), _jsx("div", { className: "mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3", children: shots.length ? rebuildFinalPrompts(shots).map((s, i) => {
                                                                        const id = String(s.id || i + 1);
                                                                        const k = shotKeyframes[id] || {};
                                                                        const hero = (k.images || [])[k.selectedIndex || 0];
                                                                        return _jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/35 p-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-[10px] font-black text-amber-300", children: ["Shot ", i + 1] }), _jsx("div", { className: "mt-1 line-clamp-2 text-sm font-black text-white", children: s.titleZh || s.titleEn })] }), _jsx("button", { onClick: () => handleGenerateShotKeyframe(i), className: "rounded-xl bg-cyan-300 px-3 py-2 text-[10px] font-black text-black", children: "Gen" })] }), _jsx("div", { className: "mt-3 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-[11px] text-stone-500", children: hero ? _jsx("img", { src: frameImageSrc(hero), alt: "shot keyframe", className: "h-full w-full object-cover" }) : k.status === "generating" ? "Generating... / 生成中" : "No keyframe yet / 未生成" }), k.images?.length > 1 && _jsx("div", { className: "mt-3 flex gap-2 overflow-x-auto", children: k.images.map((img, idx) => _jsx("button", { onClick: () => selectShotKeyframe(id, idx), className: `h-12 w-16 shrink-0 overflow-hidden rounded-xl border ${Number(k.selectedIndex || 0) === idx ? "border-cyan-300" : "border-white/10"}`, children: _jsx("img", { src: frameImageSrc(img), className: "h-full w-full object-cover" }) }, img.id || idx)) }), _jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [_jsx("button", { onClick: () => { setActiveShot(i); lockVisualFromKeyframe("firstFrame", id); }, className: "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white", children: "Use as First Frame" }), _jsx("button", { onClick: () => safeCopyText(k.prompt || buildShotKeyframePrompt(s, project, style, tech, visualLocks)), className: "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white", children: "Copy Prompt" })] })] }, id);
                                                                    }) : _jsx("div", { className: "rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-stone-500", children: "\u5148\u751F\u6210\u5206\u955C\uFF0C\u518D\u751F\u6210\u5173\u952E\u5E27\u3002" }) })] }), _jsxs("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-2", children: [_jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/35 p-5", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200", children: "Character Assets / \u89D2\u8272\u8D44\u4EA7\u5E93" }), _jsx("div", { className: "mt-3 space-y-2 max-h-64 overflow-y-auto", children: characterAssets.length ? characterAssets.map(a => _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-3 text-[11px] text-stone-300", children: [a.image && _jsx("img", { src: a.image, className: "mb-2 aspect-video w-full rounded-xl object-cover" }), _jsx("b", { className: "text-white", children: a.title }), _jsx("br", {}), a.description] }, a.id)) : _jsx("div", { className: "text-sm text-stone-500", children: "\u6682\u65E0\u89D2\u8272\u8D44\u4EA7\u3002\u7528\u5173\u952E\u5E27\u9501\u5B9A\u89D2\u8272\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002" }) })] }), _jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/35 p-5", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200", children: "Location Assets / \u573A\u666F\u8D44\u4EA7\u5E93" }), _jsx("div", { className: "mt-3 space-y-2 max-h-64 overflow-y-auto", children: locationAssets.length ? locationAssets.map(a => _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-3 text-[11px] text-stone-300", children: [a.image && _jsx("img", { src: a.image, className: "mb-2 aspect-video w-full rounded-xl object-cover" }), _jsx("b", { className: "text-white", children: a.title }), _jsx("br", {}), a.description] }, a.id)) : _jsx("div", { className: "text-sm text-stone-500", children: "\u6682\u65E0\u573A\u666F\u8D44\u4EA7\u3002\u7528\u5173\u952E\u5E27\u9501\u5B9A\u573A\u666F\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002" }) })] })] }), _jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/35 p-5", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-purple-200", children: "Video Model Router / \u89C6\u9891\u6A21\u578B\u8DEF\u7531\u5668" }), _jsx("div", { className: "mt-3 grid grid-cols-1 gap-3 md:grid-cols-2", children: videoModelRouting.length ? videoModelRouting.map(r => _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4 text-[11px] text-stone-300", children: [_jsxs("div", { className: "text-[10px] font-black text-purple-200", children: ["Shot ", r.shotIndex, " \u00B7 ", r.risk] }), _jsx("div", { className: "mt-1 text-sm font-black text-white", children: r.model }), _jsx("div", { className: "mt-2 leading-5", children: r.reasonZh }), _jsxs("div", { className: "mt-2 text-stone-500", children: ["Hero Frame: ", r.hasHeroFrame ? "Ready / 已有" : "Missing / 未生成"] })] }, r.shotIndex)) : _jsx("div", { className: "text-sm text-stone-500", children: "\u70B9\u51FB Build Video Model Router \u751F\u6210\u6BCF\u4E2A\u955C\u5934\u7684\u6A21\u578B\u63A8\u8350\u3002" }) })] })] })] })] }), projectStudioTab === "canvas" && (() => {
                                    const preparedShots = rebuildFinalPrompts(shots || []);
                                    const keyframeReadyCount = Object.values(shotKeyframes || {}).filter(x => x?.images?.length).length;
                                    const videoTaskCount = Object.values(shotVideos || {}).filter(x => x?.taskId).length;
                                    const finishedVideoCount = Object.values(shotVideos || {}).filter(x => x?.videoUrl).length;
                                    const boardNodes = buildDirectorCanvasNodes();
                                    const boardEdges = getWorkflowEdges();
                                    const selectedNode = getCanvasSelectedNodeData(boardNodes);
                                    const selectedShotIndex = selectedNode?.id?.startsWith("shot-") ? Math.max(0, Number(selectedNode.id.replace("shot-", "")) - 1) : Math.max(0, Number(activeShot || 0));
                                    const inspectedShot = preparedShots[selectedShotIndex] || preparedShots[activeShot] || preparedShots[0] || null;
                                    const inspectedShotId = inspectedShot ? String(inspectedShot.id || selectedShotIndex + 1) : "";
                                    const inspectedKeyframes = inspectedShotId ? (shotKeyframes?.[inspectedShotId] || {}) : {};
                                    const inspectedHero = (inspectedKeyframes.images || [])[Number(inspectedKeyframes.selectedIndex || 0)] || null;
                                    const inspectedVideo = inspectedShotId ? (shotVideos?.[inspectedShotId] || {}) : {};
                                    const canvasHealth = Math.round(((Boolean(script || outlineDraft || ideaInput) ? 1 : 0) + (preparedShots.length ? 1 : 0) + (keyframeReadyCount ? 1 : 0) + (videoModelRouting.length ? 1 : 0) + (videoTaskCount ? 1 : 0) + (finishedVideoCount ? 1 : 0)) / 6 * 100);
                                    const canvasWidth = Math.max(6200, ...boardNodes.map(n => Number(n.x || 0) + 520));
                                    const canvasHeight = Math.max(3600, ...boardNodes.map(n => Number(n.y || 0) + 360));
                                    const nodeMap = Object.fromEntries(boardNodes.map(n => [n.id, n]));
                                    const nextCanvasAction = !apiIsReady
                                        ? { title: "连接 DeepSeek API", desc: "先让故事、提示词和分镜引擎上线。", action: openApiConnectionCenter, cta: "Open API Center", tone: "amber" }
                                        : !preparedShots.length
                                            ? { title: "生成分镜工作流", desc: "画布需要镜头卡作为生产资产，先生成 Shot List。", action: handleGenerate, cta: "Generate Shots", tone: "violet" }
                                            : keyframeReadyCount < preparedShots.length
                                                ? { title: "批量生成关键帧", desc: "让 Seedream 把每个镜头变成可见的首帧资产。", action: () => handleGenerateAllShotKeyframes(preparedShots, { skipConfirm: false }), cta: "Generate Images", tone: "cyan" }
                                                : !videoModelRouting.length
                                                    ? { title: "建立视频路线", desc: "为每个镜头选择即梦 / Seedance / Runway / 可灵等生产路径。", action: handleBuildVideoModelRouter, cta: "Build Video Route", tone: "violet" }
                                                    : videoTaskCount < preparedShots.length
                                                        ? { title: "提交视频任务", desc: "把关键帧与视频提示词提交到视频智能体。", action: handleGenerateAllShotVideos, cta: "Generate Videos", tone: "emerald" }
                                                        : { title: finishedVideoCount ? "导出交付包" : "查询视频任务", desc: finishedVideoCount ? "视频结果已出现，可以封装交付。" : "视频任务已提交，继续轮询状态。", action: finishedVideoCount ? exportFullProductionKit : handlePollAllVideoTasks, cta: finishedVideoCount ? "Export Delivery" : "Poll Status", tone: "amber" };
                                    const productionStats = [
                                        ["Workflow", `${boardNodes.length} nodes`, "节点"],
                                        ["Shots", preparedShots.length, "镜头"],
                                        ["Images", `${keyframeReadyCount}/${preparedShots.length || 0}`, "关键帧"],
                                        ["Videos", `${finishedVideoCount}/${videoTaskCount || 0}`, "成片/任务"],
                                        ["Health", `${canvasHealth}%`, "完成度"],
                                    ];
                                    const cameraPlan = inspectedShot ? [
                                        { tag: "A-CAM", title: "建立机位", en: "Master / Establishing", use: inspectedShot.sceneZh || inspectedShot.narrativeFunctionZh || "交代空间、人物关系和主行动线", lens: inspectedShot.lens || tech.lensLock || "24mm / 35mm", move: inspectedShot.move || tech.movementLock || "Slow push-in" },
                                        { tag: "B-CAM", title: "主表演机位", en: "Performance Coverage", use: inspectedShot.emotionalBeatZh || "锁定表演、台词和情绪转折", lens: "50mm / 65mm", move: "Locked / subtle handheld" },
                                        { tag: "C-CAM", title: "过肩视线机位", en: "OTS / Eyeline", use: inspectedShot.previousContinuityZh || "保持180度轴线、视线方向和对象关系", lens: "65mm / 85mm", move: "Rack focus / eyeline match" },
                                        { tag: "INSERT", title: "道具插入机位", en: "Prop Insert", use: inspectedShot.propsZh || inspectedShot.visualMotifZh || "补充关键道具、动作细节或商业产品记忆点", lens: "85mm / Macro", move: "Micro dolly / focus pull" },
                                        { tag: "MOVE", title: "运动路径机位", en: "Movement Path", use: inspectedShot.actionZh || inspectedShot.actionEn || "人物走位和摄影机运动同步", lens: "35mm", move: inspectedShot.move || "Tracking" },
                                        { tag: "SAFETY", title: "安全补镜", en: "Reaction / Cutaway", use: inspectedShot.nextHookZh || "给剪辑留反应、空镜、转场和动作兜底", lens: "50mm / 85mm", move: "Static reaction" },
                                    ] : [];
                                    const lanes = [
                                        { id: "input", label: "Input / 输入", color: "#14b8a6" },
                                        { id: "story", label: "Story / 故事", color: "#f59e0b" },
                                        { id: "shot", label: "Shot / 分镜", color: "#6366f1" },
                                        { id: "prompt", label: "Prompt / 提示词", color: "#8b5cf6" },
                                        { id: "image", label: "Image / 生图", color: "#06b6d4" },
                                        { id: "video", label: "Video / 生视频", color: "#10b981" },
                                        { id: "output", label: "Delivery / 交付", color: "#f97316" },
                                    ];
                                    const selectedNodeAsset = selectedNode ? (canvasNodeAssets?.[selectedNode.id] || {}) : {};
                                    const selectedLifecycle = selectedNode ? getCanvasNodeLifecycle(selectedNode) : null;
                                    const selectedIncoming = selectedNode ? getIncomingCanvasNodes(selectedNode.id) : [];
                                    const selectedOutgoing = selectedNode ? getOutgoingCanvasNodes(selectedNode.id) : [];
                                    const selectedHistory = Array.isArray(selectedNodeAsset.history) ? selectedNodeAsset.history : [];
                                    const assetLibraryCount = characterAssets.length + locationAssets.length;
                                    return _jsxs("div", { className: "polaris-v98-canvas flex h-[100dvh] w-[100vw] overflow-hidden bg-[#050505] text-white", children: [_jsx("style", { children: `
                .polaris-v98-canvas{position:relative;background:#050505;color:#f8fafc;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}
                .polaris-v98-canvas:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 44%,rgba(56,189,248,.10),transparent 22%),radial-gradient(circle at 82% 10%,rgba(99,102,241,.12),transparent 28%),radial-gradient(circle at 18% 78%,rgba(245,158,11,.08),transparent 24%);pointer-events:none;animation:polarisV98Aura 12s ease-in-out infinite alternate;}
                @keyframes polarisV98Aura{from{opacity:.55;transform:scale(1)}to{opacity:.95;transform:scale(1.08)}}
                @keyframes polarisV98Flow{0%{stroke-dashoffset:260}100%{stroke-dashoffset:0}}
                @keyframes polarisV98Glow{0%,100%{box-shadow:0 0 0 rgba(56,189,248,0)}50%{box-shadow:0 0 38px rgba(56,189,248,.36)}}
                .polaris-v98-stage{position:relative;cursor:grab;touch-action:none;user-select:none;background-image:radial-gradient(circle at 1px 1px,rgba(255,255,255,.135) 1px,transparent 0),linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:24px 24px,120px 120px,120px 120px;scrollbar-width:thin;scrollbar-color:#475569 #111827;}
                .polaris-v98-stage.is-panning{cursor:grabbing}.polaris-v98-stage::-webkit-scrollbar{width:10px;height:10px}.polaris-v98-stage::-webkit-scrollbar-track{background:#111827}.polaris-v98-stage::-webkit-scrollbar-thumb{background:#475569;border-radius:999px;border:2px solid #111827}
                .polaris-v98-topbar{position:absolute;left:0;right:0;top:0;z-index:30;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;background:linear-gradient(180deg,rgba(5,5,5,.92),rgba(5,5,5,.58),transparent);pointer-events:none}.polaris-v98-topbar>*{pointer-events:auto}
                .polaris-v98-logo{height:34px;min-width:34px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,#fff,#777);color:#050505;font-weight:1000;box-shadow:0 0 24px rgba(255,255,255,.18)}
                .polaris-v98-pill{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.08);color:#e5e7eb;border-radius:14px;padding:10px 13px;font-size:12px;font-weight:850;backdrop-filter:blur(18px);transition:.16s ease}.polaris-v98-pill:hover{background:rgba(255,255,255,.14);transform:translateY(-1px)}
                .polaris-v98-dock{position:absolute;left:18px;top:50%;z-index:28;transform:translateY(-50%);display:flex;flex-direction:column;gap:10px;padding:10px;border-radius:22px;background:rgba(31,31,31,.88);border:1px solid rgba(255,255,255,.10);box-shadow:0 20px 50px rgba(0,0,0,.35);backdrop-filter:blur(20px)}
                .polaris-v98-dock button{width:36px;height:36px;border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.08);color:#f8fafc;font-weight:900;font-size:15px}.polaris-v98-dock button:hover{background:#fff;color:#111827}
                .polaris-v98-bottom{position:absolute;left:18px;bottom:18px;z-index:28;display:flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.10);background:rgba(31,31,31,.88);border-radius:16px;padding:8px 10px;backdrop-filter:blur(20px);box-shadow:0 18px 45px rgba(0,0,0,.35)}
                .polaris-v98-bottom button{width:32px;height:32px;border-radius:10px;border:0;background:rgba(255,255,255,.08);color:#e5e7eb;font-weight:900}.polaris-v98-bottom button:hover{background:#fff;color:#111827}
                .polaris-v99-help{position:absolute;left:50%;top:calc(50% - 22px);z-index:3;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:12px;color:#a1a1aa;font-size:13px;font-weight:800;pointer-events:none}.polaris-v99-help-row{display:flex;gap:12px;pointer-events:auto}.polaris-v99-help-row button{height:38px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.05));color:#f8fafc;padding:0 18px;font-size:12px;font-weight:900}.polaris-v99-help-row button:hover{background:#fff;color:#050505}
                .polaris-v99-menu-head{padding:4px 2px 8px}.polaris-v99-menu-head h4{margin:0;color:#fff;font-size:15px;font-weight:950}.polaris-v99-menu-head p{margin:4px 0 0;color:#9ca3af;font-size:11px}.polaris-v99-menu-section{margin:10px 0 6px;color:#71717a;font-size:10px;font-weight:950;letter-spacing:.18em;text-transform:uppercase}.polaris-v98-menu{width:280px}.polaris-v98-menu button{min-height:42px}.polaris-v98-menu .tag{margin-left:auto;color:#a1a1aa;font-size:10px}
                .polaris-v99-node-text{width:520px;min-height:232px;border-radius:20px}.polaris-v99-node-image,.polaris-v99-node-video{width:640px;min-height:420px;border-radius:22px}.polaris-v99-node-camera{width:560px;min-height:430px;border-radius:22px}.polaris-v99-node-prompt{width:460px}.polaris-v99-node-output{width:420px}.polaris-v99-node-text .polaris-v98-node-body,.polaris-v99-node-image .polaris-v98-node-body,.polaris-v99-node-video .polaris-v98-node-body,.polaris-v99-node-camera .polaris-v98-node-body{padding:0}
                .polaris-v99-preview{height:280px;margin:10px;border-radius:17px;border:2px solid rgba(255,255,255,.34);background:#252525;display:grid;place-items:center;overflow:hidden;position:relative}.polaris-v99-preview.image{height:288px}.polaris-v99-preview.video{height:300px}.polaris-v99-preview img,.polaris-v99-preview video{width:100%;height:100%;object-fit:cover}.polaris-v99-preview .empty{display:flex;flex-direction:column;align-items:center;gap:10px;color:#71717a}.polaris-v99-preview .empty .big{font-size:56px;opacity:.42}.polaris-v99-preview .upload-chip{position:absolute;left:50%;top:-18px;transform:translateX(-50%);border:1px solid rgba(255,255,255,.16);background:rgba(36,36,36,.92);border-radius:999px;padding:7px 12px;color:#f8fafc;font-size:12px;font-weight:900}
                .polaris-v99-composer{margin:0 10px 10px;border-radius:17px;background:#262626;border:1px solid rgba(255,255,255,.10);padding:12px;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)}.polaris-v99-composer .tabs{display:flex;flex-wrap:wrap;gap:7px}.polaris-v99-composer .tab{height:30px;border-radius:10px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.04);color:#d4d4d8;padding:0 12px;font-size:12px;font-weight:850}.polaris-v99-composer .tab.active{background:#fff;color:#111827;border-color:#fff}.polaris-v99-composer .prompt{min-height:58px;color:#a1a1aa;font-size:13px;line-height:1.7;padding:12px 4px}.polaris-v99-composer .tools{display:flex;flex-wrap:wrap;align-items:center;gap:9px}.polaris-v99-tool{height:34px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:#f4f4f5;padding:0 10px;font-size:11px;font-weight:900}.polaris-v99-tool.primary{margin-left:auto;background:#fff;color:#111827;border-color:#fff}.polaris-v99-tool.cyan{background:#06b6d4;color:#001018;border-color:#67e8f9}.polaris-v99-tool.gold{background:#fbbf24;color:#111827;border-color:#fde68a}
                .polaris-v99-titlebar{position:absolute;left:6px;top:-27px;color:#a1a1aa;font-size:13px;font-weight:850;display:flex;align-items:center;gap:6px}.polaris-v99-side-port{top:44%}.polaris-v99-text-preview{height:180px;margin:10px;border-radius:17px;border:2px solid rgba(255,255,255,.32);background:#252525;display:grid;place-items:center;color:#737373;font-size:54px}.polaris-v99-text-prompt{margin:0 10px 10px;border-radius:16px;background:#262626;border:1px solid rgba(255,255,255,.10);padding:15px;color:#a1a1aa;font-size:13px;line-height:1.6}.polaris-v99-text-run{display:flex;align-items:center;gap:10px;margin-top:14px}.polaris-v99-text-run button{height:34px;border-radius:12px;border:0;background:#fff;color:#111827;padding:0 13px;font-size:11px;font-weight:950}.polaris-v99-text-run button.alt{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.14)}
                .polaris-v99-camera-grid{margin:10px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.polaris-v99-camera-card{border-radius:16px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);padding:14px;min-height:112px}.polaris-v99-camera-card b{display:block;color:#fff;font-size:13px}.polaris-v99-camera-card span{display:block;margin-top:6px;color:#9ca3af;font-size:11px;line-height:1.5}.polaris-v99-camera-footer{margin:0 10px 10px;border-radius:16px;border:1px solid rgba(255,255,255,.10);background:#262626;padding:12px;display:flex;gap:8px;align-items:center;justify-content:space-between;color:#a1a1aa;font-size:12px}.polaris-v99-camera-footer button{height:34px;border-radius:12px;border:0;background:#06b6d4;color:#001018;padding:0 13px;font-size:11px;font-weight:950}
                
                .polaris-v98-shell,.polaris-v98-stage{overflow:hidden!important}.polaris-v98-stage::-webkit-scrollbar{display:none}.polaris-v98-stage{scrollbar-width:none;-ms-overflow-style:none}.polaris-v100-node-input{width:100%;min-height:86px;resize:vertical;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:rgba(0,0,0,.16);color:#f8fafc;padding:12px 12px;font-size:13px;line-height:1.6;outline:none}.polaris-v100-node-input:focus{border-color:#67e8f9;box-shadow:0 0 0 3px rgba(103,232,249,.12)}.polaris-v100-node-input.text{min-height:118px}.polaris-v100-translated,.polaris-v100-output{margin-top:9px;border-radius:12px;border:1px solid rgba(103,232,249,.12);background:rgba(8,145,178,.08);color:#a5f3fc;padding:9px 10px;font-size:11px;line-height:1.55}.polaris-v100-output{border-color:rgba(251,191,36,.16);background:rgba(251,191,36,.08);color:#fde68a}.polaris-v100-api-gate{position:absolute;inset:0;z-index:70;display:grid;place-items:center;background:radial-gradient(circle at 50% 40%,rgba(56,189,248,.16),transparent 34%),rgba(0,0,0,.58);backdrop-filter:blur(10px)}.polaris-v100-api-card{width:min(820px,calc(100vw - 36px));border-radius:28px;border:1px solid rgba(255,255,255,.14);background:rgba(24,24,27,.96);box-shadow:0 40px 120px rgba(0,0,0,.65);padding:28px;color:#f8fafc}.polaris-v100-api-kicker{font-size:11px;font-weight:950;letter-spacing:.24em;text-transform:uppercase;color:#67e8f9}.polaris-v100-api-card h3{margin:10px 0 0;font-size:28px;line-height:1.1;font-weight:950}.polaris-v100-api-card p{margin:12px 0 0;color:#a1a1aa;line-height:1.8}.polaris-v100-api-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:20px}.polaris-v100-api-grid label{display:block;margin-bottom:7px;font-size:11px;font-weight:950;color:#fbbf24;letter-spacing:.12em;text-transform:uppercase}.polaris-v100-api-grid input,.polaris-v100-api-grid select{width:100%;height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.14);background:#111;color:#fff;padding:0 12px;font-weight:850}.polaris-v100-api-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:22px}.polaris-v100-api-actions button{height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.08);color:#fff;padding:0 18px;font-size:13px;font-weight:950}.polaris-v100-api-actions button.primary{background:#67e8f9;color:#001018;border-color:#67e8f9}.polaris-v100-api-note{margin-top:14px;color:#71717a;font-size:11px}@media(max-width:760px){.polaris-v100-api-grid{grid-template-columns:1fr}.polaris-v100-api-actions{justify-content:stretch;flex-direction:column}.polaris-v100-api-actions button{width:100%}}
.polaris-v101-lifecycle{position:absolute;left:14px;right:14px;top:10px;height:4px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden}.polaris-v101-lifecycle span{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#475569,#94a3b8);transition:width .28s ease}.polaris-v101-lifecycle.draft span{background:linear-gradient(90deg,#64748b,#cbd5e1)}.polaris-v101-lifecycle.prompt span{background:linear-gradient(90deg,#8b5cf6,#c4b5fd)}.polaris-v101-lifecycle.image span{background:linear-gradient(90deg,#06b6d4,#67e8f9)}.polaris-v101-lifecycle.task span{background:linear-gradient(90deg,#fbbf24,#fde68a)}.polaris-v101-lifecycle.video span{background:linear-gradient(90deg,#22c55e,#86efac)}.polaris-v101-lifecycle.running span{background:linear-gradient(90deg,#38bdf8,#818cf8,#22c55e);background-size:180% 100%;animation:polarisV96NodeRun 1.1s linear infinite}.polaris-v101-lifecycle.error span{background:linear-gradient(90deg,#ef4444,#fca5a5)}.polaris-v101-status-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);border-radius:999px;padding:4px 8px;color:#d4d4d8;font-size:10px;font-weight:950}.polaris-v101-minimap{position:absolute;right:18px;bottom:18px;z-index:27;width:220px;height:140px;border-radius:18px;border:1px solid rgba(255,255,255,.12);background:rgba(23,23,23,.78);backdrop-filter:blur(16px);box-shadow:0 18px 50px rgba(0,0,0,.38);overflow:hidden}.polaris-v101-minimap-title{position:absolute;left:12px;top:10px;color:#a1a1aa;font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase}.polaris-v101-mini-node{position:absolute;width:8px;height:5px;border-radius:3px;background:#67e8f9;opacity:.86}.polaris-v101-mini-node.is-selected{background:#fbbf24;box-shadow:0 0 12px #fbbf24}.polaris-v101-mini-link{position:absolute;height:1px;background:rgba(255,255,255,.20);transform-origin:left center}.polaris-v101-inspector-label{font-size:10px;font-weight:950;letter-spacing:.18em;text-transform:uppercase;color:#71717a}.polaris-v101-inspector-textarea{width:100%;min-height:92px;border-radius:16px;border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.22);color:#f8fafc;padding:12px;font-size:12px;line-height:1.65;outline:none}.polaris-v101-inspector-textarea:focus{border-color:#67e8f9;box-shadow:0 0 0 3px rgba(103,232,249,.10)}.polaris-v101-history-item{border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);padding:10px;color:#a1a1aa;font-size:11px;line-height:1.55}.polaris-v101-asset-rail{position:absolute;right:18px;top:76px;z-index:24;width:220px;border-radius:18px;border:1px solid rgba(255,255,255,.10);background:rgba(23,23,23,.72);backdrop-filter:blur(16px);padding:12px;box-shadow:0 18px 50px rgba(0,0,0,.28)}.polaris-v101-asset-rail h4{margin:0 0 8px;color:#e5e7eb;font-size:11px;font-weight:950;letter-spacing:.14em;text-transform:uppercase}.polaris-v101-asset-token{display:flex;align-items:center;justify-content:space-between;gap:8px;border-radius:12px;background:rgba(255,255,255,.06);padding:8px 10px;margin-top:7px;color:#d4d4d8;font-size:11px;font-weight:850}.polaris-v101-asset-token button{border:0;border-radius:9px;background:rgba(255,255,255,.10);color:#fff;padding:5px 7px;font-size:10px;font-weight:950}
.polaris-v98-node{position:absolute;width:330px;min-height:148px;border-radius:22px;background:rgba(33,33,33,.92);border:1px solid rgba(255,255,255,.16);box-shadow:0 25px 70px rgba(0,0,0,.42);backdrop-filter:blur(18px);overflow:visible;cursor:grab;transition:box-shadow .16s,transform .16s,border-color .16s}.polaris-v98-node:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.32);box-shadow:0 34px 90px rgba(0,0,0,.55)}.polaris-v98-node.is-selected{border-color:#a5b4fc;box-shadow:0 0 0 2px rgba(165,180,252,.22),0 34px 100px rgba(99,102,241,.28)}.polaris-v98-node.is-running{animation:polarisV98Glow 1.3s ease-in-out infinite}.polaris-v98-node.is-running:before{content:"";position:absolute;left:0;right:0;top:0;height:3px;border-radius:22px 22px 0 0;background:linear-gradient(90deg,#38bdf8,#818cf8,#22c55e,#fbbf24,#38bdf8);background-size:200% 100%;animation:polarisV96NodeRun 1.1s linear infinite}.polaris-v98-node.is-connect-source{border-color:#22d3ee;box-shadow:0 0 0 2px rgba(34,211,238,.35),0 0 46px rgba(34,211,238,.30),0 34px 100px rgba(0,0,0,.48)}.polaris-v98-node.is-connect-target{border-color:rgba(251,191,36,.55)}.polaris-v98-node.is-connect-target:hover{border-color:#fbbf24;box-shadow:0 0 0 2px rgba(251,191,36,.24),0 32px 100px rgba(251,191,36,.18)}
                .polaris-v98-node .port{position:absolute;top:50%;width:28px;height:28px;margin-top:-14px;border-radius:999px;border:1px solid rgba(255,255,255,.45);background:#171717;display:grid;place-items:center;color:#f8fafc;font-size:16px;font-weight:950;z-index:6;box-shadow:0 0 0 4px rgba(0,0,0,.35);cursor:crosshair}.polaris-v98-node .port.left{left:-14px}.polaris-v98-node .port.right{right:-14px}.polaris-v98-node .port:hover{background:#38bdf8;color:#001018;border-color:#67e8f9;transform:scale(1.08)}.polaris-v98-pan-hint{position:absolute;left:50%;bottom:26px;z-index:26;transform:translateX(-50%);border:1px solid rgba(255,255,255,.10);background:rgba(23,23,23,.72);color:#d4d4d8;border-radius:999px;padding:8px 13px;font-size:11px;font-weight:900;backdrop-filter:blur(18px);pointer-events:none}.polaris-v98-connect-hint{position:absolute;left:50%;top:74px;z-index:40;transform:translateX(-50%);border:1px solid rgba(34,211,238,.26);background:rgba(6,182,212,.12);color:#cffafe;border-radius:999px;padding:10px 16px;font-size:12px;font-weight:950;letter-spacing:.08em;box-shadow:0 18px 45px rgba(0,0,0,.28);backdrop-filter:blur(18px)}
                .polaris-v98-node-thumb{height:132px;border-radius:22px 22px 0 0;background:#272727;display:grid;place-items:center;color:#666;overflow:hidden}.polaris-v98-node-thumb img{width:100%;height:100%;object-fit:cover}.polaris-v98-node-body{padding:15px}.polaris-v98-node-type{font-size:10px;letter-spacing:.20em;text-transform:uppercase;font-weight:950;color:#93c5fd}.polaris-v98-node-title{margin-top:5px;font-weight:950;font-size:16px;line-height:1.25;color:#fff}.polaris-v98-node-text{margin-top:8px;font-size:12px;line-height:1.55;color:#a1a1aa;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.polaris-v98-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.polaris-v98-actions button{min-height:30px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.08);color:#e5e7eb;padding:6px 9px;font-size:10px;font-weight:900}.polaris-v98-actions button:first-child{background:#fff;color:#111827}.polaris-v98-actions button:hover{border-color:rgba(255,255,255,.38);background:rgba(255,255,255,.16)}
                .polaris-v98-menu{position:fixed;z-index:1000000;width:286px;border-radius:22px;background:rgba(36,36,36,.96);border:1px solid rgba(255,255,255,.12);box-shadow:0 30px 90px rgba(0,0,0,.58);padding:14px;color:#f8fafc;backdrop-filter:blur(22px)}.polaris-v98-menu h4{margin:0 0 10px;font-size:12px;color:#a1a1aa;font-weight:900}.polaris-v98-menu button{width:100%;height:43px;display:flex;align-items:center;gap:12px;border:0;border-radius:13px;background:transparent;color:#f8fafc;text-align:left;padding:0 10px;font-size:13px;font-weight:850}.polaris-v98-menu button:hover{background:rgba(255,255,255,.10)}.polaris-v98-menu .ico{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;background:rgba(255,255,255,.12);font-size:15px}.polaris-v98-menu .tag{margin-left:auto;border-radius:999px;background:rgba(255,255,255,.10);padding:3px 7px;font-size:9px;color:#cbd5e1}
                .polaris-v98-inspector{position:absolute;right:18px;top:82px;bottom:82px;z-index:29;width:380px;overflow:auto;border-radius:24px;border:1px solid rgba(255,255,255,.12);background:rgba(27,27,27,.88);box-shadow:0 24px 80px rgba(0,0,0,.48);backdrop-filter:blur(22px);padding:18px;scrollbar-width:thin;scrollbar-color:#475569 #111827}.polaris-v98-inspector h3{font-size:22px;line-height:1.16;margin:8px 0 0;color:#fff}.polaris-v98-card{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.06);border-radius:18px;padding:13px}.polaris-v98-card b{color:#fff}.polaris-v98-card p{color:#a1a1aa;font-size:12px;line-height:1.6}.polaris-v98-cta{width:100%;min-height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:#fff;color:#111827;font-weight:950;font-size:12px}.polaris-v98-cta.alt{background:rgba(255,255,255,.08);color:#f8fafc}.polaris-v98-cta.gold{background:#fbbf24;color:#211000}.polaris-v98-cta.green{background:#22c55e;color:#052e16}.polaris-v98-asset{border-radius:18px;border:1px solid rgba(255,255,255,.10);background:#202020;padding:12px}.polaris-v98-asset video,.polaris-v98-asset img{width:100%;border-radius:14px;background:#000;aspect-ratio:16/9;object-fit:cover}
                .polaris-v98-toast{position:absolute;left:50%;top:50%;z-index:18;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:14px;color:#bdbdbd;pointer-events:none}.polaris-v98-starters{display:flex;gap:14px}.polaris-v98-starters button{pointer-events:auto;height:48px;min-width:170px;border-radius:10px;border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.09);color:#fff;font-weight:900;box-shadow:0 14px 30px rgba(0,0,0,.28)}.polaris-v98-starters button:hover{background:#fff;color:#111827}
                .polaris-v102-template-panel{position:absolute;left:50%;top:86px;z-index:1000001;transform:translateX(-50%);width:min(880px,calc(100vw - 48px));border-radius:26px;border:1px solid rgba(255,255,255,.12);background:rgba(25,25,25,.94);box-shadow:0 30px 100px rgba(0,0,0,.55);backdrop-filter:blur(24px);padding:18px;color:#f8fafc}.polaris-v102-template-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.polaris-v102-template-head b{font-size:18px}.polaris-v102-template-head p{margin:6px 0 0;color:#a1a1aa;font-size:12px;line-height:1.6}.polaris-v102-template-head button{border:0;border-radius:13px;background:rgba(255,255,255,.08);color:#fff;width:38px;height:38px}.polaris-v102-template-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:16px}.polaris-v102-template-card{min-height:132px;border:1px solid rgba(255,255,255,.10);border-radius:20px;background:rgba(255,255,255,.06);color:#fff;text-align:left;padding:16px;display:flex;flex-direction:column;justify-content:space-between}.polaris-v102-template-card b{font-size:15px;line-height:1.25}.polaris-v102-template-card span{font-size:11px;line-height:1.55;color:#cbd5e1}.polaris-v102-template-card.cyan{box-shadow:inset 0 0 0 1px rgba(34,211,238,.18)}.polaris-v102-template-card.violet{box-shadow:inset 0 0 0 1px rgba(167,139,250,.20)}.polaris-v102-template-card.amber{box-shadow:inset 0 0 0 1px rgba(251,191,36,.22)}.polaris-v102-template-card.emerald{box-shadow:inset 0 0 0 1px rgba(34,197,94,.20)}.polaris-v102-context-menu{position:fixed;z-index:1000000;width:238px;border-radius:18px;background:rgba(37,37,37,.96);border:1px solid rgba(255,255,255,.12);box-shadow:0 24px 80px rgba(0,0,0,.55);padding:9px;backdrop-filter:blur(18px)}.polaris-v102-context-menu button{width:100%;height:38px;border:0;border-radius:12px;background:transparent;color:#f8fafc;text-align:left;padding:0 12px;font-size:12px;font-weight:900}.polaris-v102-context-menu button:hover{background:rgba(255,255,255,.10)}.polaris-v102-node-review{border-color:rgba(251,191,36,.45)!important;box-shadow:0 20px 60px rgba(251,191,36,.10)}.polaris-v102-token-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}.polaris-v102-token-list button,.polaris-v102-mention-row button,.polaris-v102-next-row button{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);color:#e5e7eb;border-radius:999px;padding:6px 9px;font-size:10px;font-weight:950}.polaris-v102-mention-row{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.polaris-v102-next-row{margin-top:10px;border-radius:16px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.045);padding:10px;display:flex;flex-wrap:wrap;align-items:center;gap:7px}.polaris-v102-next-row b{color:#fbbf24;font-size:10px;letter-spacing:.14em;text-transform:uppercase}.polaris-v102-cost-bar{position:absolute;left:18px;bottom:78px;z-index:24;border-radius:16px;border:1px solid rgba(255,255,255,.10);background:rgba(23,23,23,.72);backdrop-filter:blur(16px);padding:10px 12px;color:#e5e7eb;font-size:11px;font-weight:850;display:flex;gap:12px}.polaris-v102-cost-bar span b{color:#fbbf24}
                .polaris-v105-queue{position:absolute;right:18px;bottom:210px;z-index:24;width:310px;border-radius:20px;border:1px solid rgba(255,255,255,.10);background:rgba(20,20,20,.82);backdrop-filter:blur(20px);padding:12px;box-shadow:0 18px 55px rgba(0,0,0,.42)}
                .polaris-v105-panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}.polaris-v105-panel-head b{font-size:12px;color:#fff;letter-spacing:.08em}.polaris-v105-panel-head button{height:26px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.08);color:#e5e7eb;font-size:11px;font-weight:850;padding:0 10px}
                .polaris-v105-queue-item{display:grid;grid-template-columns:48px 1fr auto;gap:8px;align-items:center;margin-top:7px;border-radius:14px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.045);padding:9px;color:#d4d4d8}.polaris-v105-queue-item span{text-transform:uppercase;color:#67e8f9;font-size:10px;font-weight:950}.polaris-v105-queue-item b{font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.polaris-v105-queue-item em{font-style:normal;font-size:10px;color:#fbbf24}.polaris-v105-queue-item.done em{color:#34d399}.polaris-v105-queue-item.failed em{color:#fb7185}
                .polaris-v105-empty{border-radius:14px;border:1px dashed rgba(255,255,255,.14);padding:12px;color:#71717a;font-size:12px;font-weight:800;text-align:center}.polaris-v105-timeline{position:absolute;left:190px;right:360px;bottom:18px;z-index:25;border-radius:22px;border:1px solid rgba(255,255,255,.10);background:rgba(20,20,20,.86);backdrop-filter:blur(20px);padding:12px;box-shadow:0 18px 55px rgba(0,0,0,.4)}
                .polaris-v105-timeline-row{display:flex;gap:10px;overflow-x:auto;padding-bottom:3px}.polaris-v105-timeline-shot{min-width:148px;border-radius:16px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.055);padding:10px;text-align:left;color:#e5e7eb}.polaris-v105-timeline-shot strong{display:block;color:#fbbf24;font-size:11px}.polaris-v105-timeline-shot span{display:block;margin-top:4px;font-size:12px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.polaris-v105-timeline-shot em{display:block;margin-top:5px;font-size:10px;font-style:normal;color:#a1a1aa}.polaris-v105-timeline-toggle{position:absolute;right:18px;bottom:18px;z-index:25;border:1px solid rgba(255,255,255,.12);background:rgba(20,20,20,.86);color:#fff;border-radius:999px;padding:10px 14px;font-size:12px;font-weight:900}
                .polaris-v100-api-grid input[type=password]{letter-spacing:.08em}.polaris-v100-api-card{max-height:86dvh;overflow:auto}.polaris-v100-api-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
                @media(max-width:900px){.polaris-v102-template-grid{grid-template-columns:1fr}.polaris-v102-template-panel{top:76px}.polaris-v101-asset-rail,.polaris-v101-minimap,.polaris-v105-queue,.polaris-v105-timeline{display:none}}

              ` }), canvasApiGateOpen && _jsx("div", { className: "polaris-v100-api-gate", onClick: e => e.stopPropagation(), children: _jsxs("div", { className: "polaris-v100-api-card", children: [_jsx("div", { className: "polaris-v100-api-kicker", children: "Canvas API Gate / \u753B\u5E03\u63A5\u53E3\u63A5\u5165" }), _jsx("h3", { children: "\u5148\u63A5\u5165\u5373\u68A6\u4E0E\u53EF\u7075\uFF0C\u518D\u8FDB\u5165\u65E0\u9650\u753B\u5E03\u751F\u4EA7\u3002" }), _jsx("p", { children: "\u65E0\u9650\u753B\u5E03\u53EA\u8D1F\u8D23\u56FE\u50CF\u4E0E\u89C6\u9891\u751F\u4EA7\uFF1A\u6587\u672C\u8282\u70B9\u8C03\u7528 DeepSeek\uFF0C\u56FE\u7247\u8282\u70B9\u8C03\u7528\u5373\u68A6/\u53EF\u7075\u751F\u56FE\uFF0C\u89C6\u9891\u8282\u70B9\u8C03\u7528\u5373\u68A6/\u53EF\u7075\u89C6\u9891\u667A\u80FD\u4F53\u3002" }), _jsxs("div", { className: "polaris-v100-api-grid", children: [_jsxs("div", { children: [_jsx("label", { children: "\u56FE\u7247\u63A5\u53E3 / Image Agent" }), _jsxs("select", { value: imageApiSettings.provider, onChange: e => setImageApiSettings(p => ({ ...p, provider: e.target.value, model: e.target.value.includes('Kling') || e.target.value.includes('可灵') ? 'kling-image-agent' : 'jimeng-image-agent' })), children: [_jsx("option", { children: "Jimeng Image Agent / \u5373\u68A6\u751F\u56FE\u667A\u80FD\u4F53" }), _jsx("option", { children: "Kling Image Agent / \u53EF\u7075\u751F\u56FE\u667A\u80FD\u4F53" }), _jsx("option", { children: "Volcengine Seedream / \u706B\u5C71\u5373\u68A6 Seedream" })] })] }), _jsxs("div", { children: [_jsx("label", { children: "\u56FE\u7247\u6A21\u578B / Image Model" }), _jsx("input", { value: imageApiSettings.model, onChange: e => setImageApiSettings(p => ({ ...p, model: e.target.value })) })] }), _jsxs("div", { children: [_jsx("label", { children: "\u89C6\u9891\u63A5\u53E3 / Video Agent" }), _jsxs("select", { value: videoApiSettings.provider, onChange: e => setVideoApiSettings(p => ({ ...p, provider: e.target.value, model: e.target.value.includes('Kling') || e.target.value.includes('可灵') ? 'kling-video-agent' : 'jimeng-video-agent' })), children: [_jsx("option", { children: "Jimeng Video Agent / \u5373\u68A6\u89C6\u9891\u667A\u80FD\u4F53" }), _jsx("option", { children: "Kling Video Agent / \u53EF\u7075\u89C6\u9891\u667A\u80FD\u4F53" }), _jsx("option", { children: "Volcengine Seedance / \u706B\u5C71\u65B9\u821F Seedance" })] })] }), _jsxs("div", { children: [_jsx("label", { children: "\u89C6\u9891\u6A21\u578B / Video Model" }), _jsx("input", { value: videoApiSettings.model, onChange: e => setVideoApiSettings(p => ({ ...p, model: e.target.value })) })] }), _jsxs("div", { children: [_jsx("label", { children: "\u56FE\u7247\u4EE3\u7406\u8DEF\u7531 / Image Proxy Route" }), _jsx("input", { value: imageApiSettings.endpoint || '/api/image-generate', onChange: e => setImageApiSettings(p => ({ ...p, endpoint: e.target.value })) })] }), _jsxs("div", { children: [_jsx("label", { children: "\u89C6\u9891\u4EE3\u7406\u8DEF\u7531 / Video Proxy Route" }), _jsx("input", { value: videoApiSettings.endpoint || '/api/video-generate', onChange: e => setVideoApiSettings(p => ({ ...p, endpoint: e.target.value })) })] }), _jsxs("div", { children: [_jsx("label", { children: "\u5373\u68A6\u751F\u56FE\u5BC6\u94A5 / Jimeng Image API Key" }), _jsx("input", { type: "password", value: canvasApiCredentials.jimengImageKey || '', onChange: e => updateCanvasApiCredential('jimengImageKey', e.target.value), placeholder: "sk-... / \u53EF\u7559\u7A7A\u4F7F\u7528\u670D\u52A1\u7AEF\u73AF\u5883\u53D8\u91CF" })] }), _jsxs("div", { children: [_jsx("label", { children: "\u5373\u68A6\u89C6\u9891\u5BC6\u94A5 / Jimeng Video API Key" }), _jsx("input", { type: "password", value: canvasApiCredentials.jimengVideoKey || '', onChange: e => updateCanvasApiCredential('jimengVideoKey', e.target.value), placeholder: "sk-... / \u53EF\u7559\u7A7A\u4F7F\u7528\u670D\u52A1\u7AEF\u73AF\u5883\u53D8\u91CF" })] }), _jsxs("div", { children: [_jsx("label", { children: "\u53EF\u7075\u751F\u56FE\u5BC6\u94A5 / Kling Image API Key" }), _jsx("input", { type: "password", value: canvasApiCredentials.klingImageKey || '', onChange: e => updateCanvasApiCredential('klingImageKey', e.target.value), placeholder: "Kling image key" })] }), _jsxs("div", { children: [_jsx("label", { children: "\u53EF\u7075\u89C6\u9891\u5BC6\u94A5 / Kling Video API Key" }), _jsx("input", { type: "password", value: canvasApiCredentials.klingVideoKey || '', onChange: e => updateCanvasApiCredential('klingVideoKey', e.target.value), placeholder: "Kling video key" })] }), _jsxs("div", { children: [_jsx("label", { children: "\u5373\u68A6\u751F\u56FE Endpoint / \u53EF\u7559\u7A7A\u4F7F\u7528\u9ED8\u8BA4\u65B9\u821F\u63A5\u53E3" }), _jsx("input", { value: canvasApiCredentials.jimengImageEndpoint || '', onChange: e => updateCanvasApiCredential('jimengImageEndpoint', e.target.value), placeholder: "\u9ED8\u8BA4\uFF1Ahttps://ark.cn-beijing.volces.com/api/v3/images/generations" })] }), _jsxs("div", { children: [_jsx("label", { children: "\u5373\u68A6\u89C6\u9891 Endpoint / \u53EF\u7559\u7A7A\u4F7F\u7528\u9ED8\u8BA4 Seedance \u4EFB\u52A1\u63A5\u53E3" }), _jsx("input", { value: canvasApiCredentials.jimengVideoEndpoint || '', onChange: e => updateCanvasApiCredential('jimengVideoEndpoint', e.target.value), placeholder: "\u9ED8\u8BA4\uFF1Ahttps://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks" })] }), _jsxs("div", { children: [_jsx("label", { children: "\u53EF\u7075\u751F\u56FE Endpoint / \u5FC5\u586B\u5B8C\u6574 URL" }), _jsx("input", { value: canvasApiCredentials.klingImageEndpoint || '', onChange: e => updateCanvasApiCredential('klingImageEndpoint', e.target.value), placeholder: "https://api.kling.../image \u6216\u4F60\u7684\u4E2D\u8F6C\u63A5\u53E3" })] }), _jsxs("div", { children: [_jsx("label", { children: "\u53EF\u7075\u89C6\u9891 Endpoint / \u5FC5\u586B\u5B8C\u6574 URL" }), _jsx("input", { value: canvasApiCredentials.klingVideoEndpoint || '', onChange: e => updateCanvasApiCredential('klingVideoEndpoint', e.target.value), placeholder: "https://api.kling.../video \u6216\u4F60\u7684\u4E2D\u8F6C\u63A5\u53E3" })] }), _jsxs("div", { children: [_jsx("label", { children: "\u53EF\u7075\u89C6\u9891\u67E5\u8BE2\u63A5\u53E3 / Kling Query Endpoint" }), _jsx("input", { value: canvasApiCredentials.klingVideoQueryEndpoint || '', onChange: e => updateCanvasApiCredential('klingVideoQueryEndpoint', e.target.value), placeholder: "https://.../query\uFF0C\u53EF\u9009" })] }), _jsxs("div", { children: [_jsx("label", { children: "\u753B\u5E03\u9ED8\u8BA4\u6BD4\u4F8B / Default Ratio" }), _jsxs("select", { value: canvasLaunchProfile.ratio, onChange: e => { setCanvasLaunchProfile(p => ({ ...p, ratio: e.target.value })); setVideoApiSettings(v => ({ ...v, ratio: e.target.value })); }, children: [_jsx("option", { children: "16:9" }), _jsx("option", { children: "9:16" }), _jsx("option", { children: "1:1" }), _jsx("option", { children: "4:3" }), _jsx("option", { children: "3:4" }), _jsx("option", { children: "21:9" })] })] })] }), _jsxs("div", { className: "polaris-v100-api-actions", children: [_jsx("button", { onClick: () => { setCanvasLaunchProfile(p => ({ ...p, defaultProvider: 'jimeng' })); setImageApiSettings(p => ({ ...p, provider: 'Jimeng Image Agent / 即梦生图智能体', model: p.model || 'jimeng-image-agent' })); setVideoApiSettings(p => ({ ...p, provider: 'Jimeng Video Agent / 即梦视频智能体', model: p.model || 'jimeng-video-agent' })); }, children: "\u4F7F\u7528\u5373\u68A6 / Jimeng" }), _jsx("button", { onClick: () => { setCanvasLaunchProfile(p => ({ ...p, defaultProvider: 'kling' })); setImageApiSettings(p => ({ ...p, provider: 'Kling Image Agent / 可灵生图智能体', model: 'kling-image-agent' })); setVideoApiSettings(p => ({ ...p, provider: 'Kling Video Agent / 可灵视频智能体', model: 'kling-video-agent' })); }, children: "\u4F7F\u7528\u53EF\u7075 / Kling" }), _jsx("button", { onClick: () => setCanvasApiCredentials(p => ({ ...p, lastValidatedAt: new Date().toLocaleString() })), children: "\u4FDD\u5B58\u5BC6\u94A5 / Save Keys" }), _jsx("button", { className: "primary", onClick: () => { normalizeCanvasApiCredentialFields({ silent: false }); setCanvasApiGateOpen(false); }, children: "\u68C0\u67E5\u5E76\u8FDB\u5165\u753B\u5E03 / Check & Enter Canvas" })] }), _jsx("div", { className: "polaris-v100-api-note", children: "\u586B\u5199\u89C4\u5219\uFF1AAPI Key \u586B ark-/sk-/\u53EF\u7075\u5BC6\u94A5\uFF1BEndpoint \u5FC5\u987B\u662F https:// \u5F00\u5934\u7684\u5B8C\u6574\u63A5\u53E3\u5730\u5740\u3002\u5373\u68A6/Seedream/Seedance Endpoint \u53EF\u7559\u7A7A\u4F7F\u7528\u9ED8\u8BA4\u65B9\u821F\u63A5\u53E3\uFF1B\u53EF\u7075\u4E00\u822C\u5FC5\u987B\u586B\u5199\u4F60\u81EA\u5DF1\u7684\u53EF\u7075\u5B98\u65B9\u63A5\u53E3\u6216\u4E2D\u8F6C\u63A5\u53E3\u3002\u7CFB\u7EDF\u4F1A\u81EA\u52A8\u8BC6\u522B\u201C\u628A\u5BC6\u94A5\u8BEF\u586B\u5230 Endpoint\u201D\u7684\u60C5\u51B5\u5E76\u4FEE\u6B63\u3002" })] }) }), _jsxs("div", { className: "polaris-v98-topbar", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "polaris-v98-logo", children: "\u2726" }), _jsxs("div", { children: [_jsx("div", { className: "text-[15px] font-black leading-none text-white", children: "Polaris \u89C6\u89C9\u5DE5\u4F5C\u6D41\u753B\u5E03" }), _jsxs("div", { className: "mt-1 text-[11px] font-bold text-zinc-500", children: [project || '未命名', " \u00B7 \u53CC\u51FB\u6DFB\u52A0\u8282\u70B9 \u00B7 \u7A7A\u767D\u5904\u62D6\u62FD\u5E73\u79FB \u00B7 Double click + drag canvas"] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => setCanvasTemplateOpen(true), className: "polaris-v98-pill", children: "Templates / \u6A21\u677F" }), _jsx("button", { onClick: () => createBatchShotWorkflow(6), className: "polaris-v98-pill", children: "Batch Shots / \u6279\u91CF\u955C\u5934" }), _jsx("button", { onClick: () => addInfiniteCanvasNode('review', { x: 1600, y: 500 }), className: "polaris-v98-pill", children: "Review / \u5BA1\u7247" }), _jsx("button", { onClick: () => setCanvasInspectorOpen(v => !v), className: "polaris-v98-pill", children: "Inspector / \u68C0\u67E5\u5668" }), _jsx("button", { onClick: () => autoLayoutWorkflowCanvas('horizontal'), className: "polaris-v98-pill", children: "Auto Layout / \u6574\u7406" }), _jsx("button", { onClick: () => centerCanvasToNode(), className: "polaris-v98-pill", children: "Center / \u5C45\u4E2D" }), _jsx("button", { onClick: runPromptOnlyWorkflow, disabled: !!workflowActiveNode, className: "polaris-v98-pill", children: "Prompt Only / \u53EA\u751F\u6210\u63D0\u793A\u8BCD" }), _jsx("button", { onClick: runFullVisualWorkflow, disabled: !!workflowActiveNode, className: "polaris-v98-pill", children: "Full Visual / \u5B8C\u6574\u89C6\u89C9" }), _jsx("button", { onClick: handleGenerateAllShotVideos, disabled: !preparedShots.length || !!workflowActiveNode || isGeneratingVideos, className: "polaris-v98-pill", children: "Generate Videos / \u751F\u6210\u89C6\u9891" }), _jsx("button", { onClick: resetDirectorCanvasLayout, className: "polaris-v98-pill", children: "Reset / \u91CD\u7F6E" }), _jsx("button", { onClick: exportDirectorCanvasJson, className: "polaris-v98-pill", children: "Export / \u5BFC\u51FA" }), _jsx("button", { onClick: () => setProjectStudioOpen(false), className: "polaris-v98-pill", children: "Exit / \u9000\u51FA" })] })] }), workflowConnectSource && _jsx("div", { className: "polaris-v98-connect-hint", children: "CONNECT MODE / \u8FDE\u7EBF\u6A21\u5F0F\uFF1A\u70B9\u51FB\u76EE\u6807\u8282\u70B9\u6216\u7AEF\u53E3\u5B8C\u6210\u8FDE\u63A5\uFF0C\u70B9\u51FB\u540C\u4E00\u8282\u70B9\u53D6\u6D88" }), !workflowConnectSource && !canvasApiGateOpen && _jsx("div", { className: "polaris-v98-pan-hint", children: "\u6309\u4F4F\u753B\u5E03\u7A7A\u767D\u5904\u62D6\u62FD\u5E73\u79FB \u00B7 \u6EDA\u8F6E\u4E0A\u4E0B\u79FB\u52A8 \u00B7 Shift+\u6EDA\u8F6E\u6A2A\u5411\u79FB\u52A8" }), _jsxs("div", { className: "polaris-v98-dock", children: [_jsx("button", { title: "\u6DFB\u52A0\u8282\u70B9", onClick: () => setCanvasQuickMenu({ x: 1200, y: 720, screenX: 70, screenY: 210 }), children: "\uFF0B" }), _jsx("button", { title: "\u8FD0\u884C\u5F53\u524D", onClick: () => selectedNode && runWorkflowNode(selectedNode), disabled: !selectedNode || !!workflowActiveNode, children: "\u25B6" }), _jsx("button", { title: "\u8FDE\u63A5", onClick: () => selectedNode && startConnectFromNode(selectedNode.id), disabled: !selectedNode, children: "\u26D3" }), _jsx("button", { title: "\u5B9A\u4F4D", onClick: () => { const stage = canvasStageRef.current; const n = selectedNode; if (stage && n) {
                                                            stage.scrollTo({ left: Math.max(0, Number(n.x || 0) * (canvasZoom || 1) - stage.clientWidth / 2), top: Math.max(0, Number(n.y || 0) * (canvasZoom || 1) - stage.clientHeight / 2), behavior: 'smooth' });
                                                        } }, children: "\u2316" }), _jsx("button", { title: "\u5168\u5C40\u67E5\u8BE2", onClick: handlePollAllVideoTasks, children: "\u27F3" }), _jsx("button", { title: "\u4EA4\u4ED8", onClick: exportFullProductionKit, children: "\u21E9" })] }), _jsxs("div", { className: "polaris-v98-bottom", children: [_jsx("button", { onClick: () => setCanvasZoom(z => Math.max(.35, Number((z - .1).toFixed(2)))), children: "\u2212" }), _jsxs("span", { className: "px-2 text-[12px] font-black text-zinc-300", children: [Math.round((canvasZoom || 1) * 100), "%"] }), _jsx("button", { onClick: () => setCanvasZoom(z => Math.min(1.7, Number((z + .1).toFixed(2)))), children: "\uFF0B" }), _jsx("button", { onClick: () => setCanvasZoom(1), children: "100" }), _jsx("button", { onClick: () => { setCanvasZoom(.72); canvasStageRef.current?.scrollTo({ left: 420, top: 280, behavior: 'smooth' }); }, children: "FIT" })] }), _jsxs("div", { className: "polaris-v102-cost-bar", children: [_jsxs("span", { children: ["DeepSeek ", _jsx("b", { children: canvasCostMetrics.deepseek })] }), _jsxs("span", { children: ["Image ", _jsx("b", { children: canvasCostMetrics.image })] }), _jsxs("span", { children: ["Video ", _jsx("b", { children: canvasCostMetrics.video })] }), _jsxs("span", { children: ["Fail ", _jsx("b", { children: canvasCostMetrics.failed })] })] }), _jsxs("div", { className: "polaris-v105-queue", children: [_jsxs("div", { className: "polaris-v105-panel-head", children: [_jsx("b", { children: "Generation Queue / \u751F\u6210\u961F\u5217" }), _jsx("button", { onClick: () => setGenerationQueue([]), children: "\u6E05\u7A7A" })] }), (generationQueue || []).slice(0, 5).map(item => _jsxs("div", { className: `polaris-v105-queue-item ${item.status}`, children: [_jsx("span", { children: item.kind }), _jsx("b", { children: item.title }), _jsx("em", { children: item.status })] }, item.id)), !(generationQueue || []).length && _jsx("div", { className: "polaris-v105-empty", children: "\u6682\u65E0\u4EFB\u52A1 \u00B7 \u8FD0\u884C\u8282\u70B9\u540E\u4F1A\u81EA\u52A8\u8BB0\u5F55" })] }), timelineOpen && _jsxs("div", { className: "polaris-v105-timeline", children: [_jsxs("div", { className: "polaris-v105-panel-head", children: [_jsx("b", { children: "Timeline / \u6210\u7247\u65F6\u95F4\u7EBF" }), _jsx("button", { onClick: () => setTimelineOpen(false), children: "\u6536\u8D77" })] }), _jsx("div", { className: "polaris-v105-timeline-row", children: getCanvasTimelineItems().slice(0, 12).map((item, idx) => _jsxs("button", { onClick: () => centerCanvasToNode(item.id), className: "polaris-v105-timeline-shot", children: [_jsx("strong", { children: String(idx + 1).padStart(2, '0') }), _jsx("span", { children: item.title }), _jsxs("em", { children: [item.duration, "s \u00B7 ", item.status] })] }, item.id)) }), !getCanvasTimelineItems().length && _jsx("div", { className: "polaris-v105-empty", children: "\u8FD8\u6CA1\u6709\u89C6\u9891\u7ED3\u679C \u00B7 \u751F\u6210\u89C6\u9891\u540E\u81EA\u52A8\u8FDB\u5165\u65F6\u95F4\u7EBF" })] }), !timelineOpen && _jsx("button", { className: "polaris-v105-timeline-toggle", onClick: () => setTimelineOpen(true), children: "Timeline / \u65F6\u95F4\u7EBF" }), _jsxs("div", { className: "polaris-v101-asset-rail", children: [_jsx("h4", { children: "Reference Locks / \u8D44\u4EA7\u9501\u5B9A" }), _jsxs("div", { className: "polaris-v101-asset-token", children: [_jsx("span", { children: "Characters / \u89D2\u8272" }), _jsx("button", { onClick: () => setProjectStudioTab('visual'), children: characterAssets.length })] }), _jsxs("div", { className: "polaris-v101-asset-token", children: [_jsx("span", { children: "Locations / \u573A\u666F" }), _jsx("button", { onClick: () => setProjectStudioTab('visual'), children: locationAssets.length })] }), _jsxs("div", { className: "polaris-v101-asset-token", children: [_jsx("span", { children: "Canvas Assets / \u753B\u5E03" }), _jsx("button", { onClick: exportDirectorCanvasJson, children: Object.keys(canvasNodeAssets || {}).length })] }), _jsxs("div", { className: "polaris-v101-asset-token", children: [_jsx("span", { children: "API Calls / \u8C03\u7528" }), _jsxs("button", { title: "DeepSeek / Image / Video", children: [canvasCostMetrics.deepseek, "/", canvasCostMetrics.image, "/", canvasCostMetrics.video] })] }), _jsx("div", { className: "polaris-v102-token-list", children: getAssetMentionTokens().slice(0, 6).map(t => _jsx("button", { onClick: () => insertAssetMention(canvasSelectedNode, t.token), children: t.token }, t.token)) }), _jsx("div", { className: "mt-2 text-[10px] leading-5 text-zinc-500", children: "\u7528 @\u89D2\u8272 / @\u573A\u666F \u4F5C\u4E3A\u8FDE\u7EED\u6027\u951A\u70B9\uFF0C\u8FDE\u63A5\u5230\u56FE\u7247\u6216\u89C6\u9891\u8282\u70B9\u540E\u81EA\u52A8\u7EE7\u627F\u4E0A\u6E38\u5185\u5BB9\u3002" })] }), _jsxs("div", { className: "polaris-v101-minimap", children: [_jsx("div", { className: "polaris-v101-minimap-title", children: "Map / \u5C0F\u5730\u56FE" }), boardNodes.map(n => _jsx("button", { title: n.title, onClick: () => centerCanvasToNode(n.id), className: `polaris-v101-mini-node ${canvasSelectedNode === n.id ? 'is-selected' : ''}`, style: { left: `${Math.max(8, Math.min(204, (Number(n.x || 0) / Math.max(canvasWidth, 1)) * 210))}px`, top: `${Math.max(30, Math.min(128, (Number(n.y || 0) / Math.max(canvasHeight, 1)) * 128))}px`, background: lanes.find(l => l.id === n.group)?.color || undefined } }, `mini-${n.id}`))] }), canvasQuickMenu && _jsxs("div", { className: "polaris-v98-menu", style: { left: Math.min(canvasQuickMenu.screenX || 120, (typeof window !== 'undefined' ? window.innerWidth - 310 : 900)), top: Math.min(canvasQuickMenu.screenY || 120, (typeof window !== 'undefined' ? window.innerHeight - 440 : 620)) }, onMouseLeave: () => { }, children: [_jsxs("div", { className: "polaris-v99-menu-head", children: [_jsx("h4", { children: "\u6DFB\u52A0\u751F\u4EA7\u8282\u70B9" }), _jsx("p", { children: "\u53CC\u51FB\u753B\u5E03\u7A7A\u767D\u5904\u547C\u51FA\uFF0C\u6309\u771F\u5B9E\u521B\u4F5C\u6D41\u7A0B\u6DFB\u52A0" })] }), _jsx("div", { className: "polaris-v99-menu-section", children: "\u751F\u6210\u521B\u4F5C" }), [
                                                        ['text', '☰', '文本 / 剧情', 'Story Text'], ['image', '▧', '图片生成', 'Image Lab'], ['video', '▶', '视频生成', 'Video Lab'], ['i2v', '⧉', '首帧图生视频', 'I2V'], ['review', '✓', '审片质检', 'Review'], ['audio', '♫', '音乐音效', 'Audio']
                                                    ].map(([kind, ico, zh, tag]) => _jsxs("button", { onClick: () => addInfiniteCanvasNode(kind), children: [_jsx("span", { className: "ico", children: ico }), _jsx("span", { children: zh }), _jsx("span", { className: "tag", children: tag })] }, kind)), _jsx("div", { className: "polaris-v99-menu-section", children: "\u5BFC\u6F14\u6D41\u7A0B" }), [
                                                        ['prompt', '✦', 'DeepSeek 提示词', 'Prompt'], ['story', '✍', '故事大纲', 'Story'], ['shot', '▦', '镜头分镜', 'Shot'], ['camera', '⌘', '摄影机 / 机位', 'Camera'], ['upload', '⇧', '上传素材', 'Upload'], ['delivery', '⇩', '交付导出', 'Delivery']
                                                    ].map(([kind, ico, zh, tag]) => _jsxs("button", { onClick: () => addInfiniteCanvasNode(kind), children: [_jsx("span", { className: "ico", children: ico }), _jsx("span", { children: zh }), _jsx("span", { className: "tag", children: tag })] }, `flow-${kind}`)), _jsxs("button", { onClick: () => setCanvasQuickMenu(null), children: [_jsx("span", { className: "ico", children: "\u00D7" }), _jsx("span", { children: "\u5173\u95ED" })] })] }), canvasTemplateOpen && _jsxs("div", { className: "polaris-v102-template-panel", onClick: e => e.stopPropagation(), children: [_jsxs("div", { className: "polaris-v102-template-head", children: [_jsxs("div", { children: [_jsx("b", { children: "Project Templates / \u9879\u76EE\u6A21\u677F" }), _jsx("p", { children: "\u9009\u62E9\u4E00\u4E2A\u771F\u5B9E\u751F\u4EA7\u6D41\u7A0B\uFF0C\u7CFB\u7EDF\u4F1A\u81EA\u52A8\u751F\u6210\u8282\u70B9\u3001\u8FDE\u7EBF\u548C\u521D\u59CB\u8349\u7A3F\u3002" })] }), _jsx("button", { onClick: () => setCanvasTemplateOpen(false), children: "\u00D7" })] }), _jsx("div", { className: "polaris-v102-template-grid", children: getCanvasProjectTemplates().map(t => _jsxs("button", { onClick: () => applyCanvasProjectTemplate(t.id), className: `polaris-v102-template-card ${t.tone}`, children: [_jsx("b", { children: t.title }), _jsx("span", { children: t.desc })] }, t.id)) })] }), canvasContextMenu && _jsxs("div", { className: "polaris-v102-context-menu", style: { left: Math.min(canvasContextMenu.screenX || 140, (typeof window !== 'undefined' ? window.innerWidth - 280 : 900)), top: Math.min(canvasContextMenu.screenY || 140, (typeof window !== 'undefined' ? window.innerHeight - 420 : 620)) }, onClick: e => e.stopPropagation(), children: [canvasContextMenu.nodeId && _jsxs("div", { className: "polaris-v106-menu-title", children: ["\u5F53\u524D\u8282\u70B9\uFF1A", String(canvasContextMenu.nodeTitle || canvasContextMenu.nodeId).slice(0, 28)] }), canvasContextMenu.nodeId && _jsx("button", { onClick: () => { const n = getWorkflowNodes().find(x => x.id === canvasContextMenu.nodeId); if (n)
                                                            runWorkflowNode(n); setCanvasContextMenu(null); }, children: "\u25B6 \u8FD0\u884C\u5F53\u524D\u8282\u70B9" }), canvasContextMenu.nodeId && _jsx("button", { onClick: () => { runDownstreamFromNode(canvasContextMenu.nodeId); setCanvasContextMenu(null); }, children: "\u2937 \u8FD0\u884C\u4E0B\u6E38" }), _jsx("button", { onClick: () => { setCanvasQuickMenu(canvasContextMenu); setCanvasContextMenu(null); }, children: "\uFF0B \u6DFB\u52A0\u8282\u70B9" }), _jsx("button", { onClick: () => { createBatchShotWorkflow(6); setCanvasContextMenu(null); }, children: "\u25A6 \u6279\u91CF\u955C\u5934\u6D41" }), _jsx("button", { onClick: () => { addInfiniteCanvasNode('review', canvasContextMenu); setCanvasContextMenu(null); }, children: "\u2713 \u5BA1\u7247\u8D28\u68C0\u8282\u70B9" }), _jsx("button", { onClick: () => { duplicateSelectedCanvasNode(); setCanvasContextMenu(null); }, children: "\u29C9 \u590D\u5236\u5F53\u524D\u8282\u70B9" }), canvasContextMenu.nodeId && _jsx("button", { className: "danger", onClick: () => { removeWorkflowNode(canvasContextMenu.nodeId); setCanvasContextMenu(null); }, children: "\u232B \u5220\u9664\u8282\u70B9" }), _jsx("button", { onClick: () => { autoLayoutWorkflowCanvas('horizontal'); setCanvasContextMenu(null); }, children: "\u2301 \u81EA\u52A8\u6574\u7406" }), _jsx("button", { onClick: () => setCanvasContextMenu(null), children: "\u00D7 \u5173\u95ED" })] }), _jsx("div", { ref: canvasStageRef, onPointerDown: beginCanvasPan, onPointerMove: moveCanvasPan, onPointerUp: endCanvasPan, onPointerCancel: endCanvasPan, onPointerLeave: endCanvasPan, onWheel: e => { const stage = canvasStageRef.current; if (stage) {
                                                    e.preventDefault();
                                                    stage.scrollLeft += (e.deltaX || (e.shiftKey ? e.deltaY : 0));
                                                    stage.scrollTop += (e.shiftKey ? 0 : e.deltaY);
                                                } }, onDragOver: e => e.preventDefault(), onDrop: handleCanvasDrop, onDoubleClick: openCanvasQuickMenu, onContextMenu: openCanvasContextMenu, onClick: e => { if (canvasPanRef.current?.suppressClick) {
                                                    canvasPanRef.current.suppressClick = false;
                                                    return;
                                                } if (!isCanvasInteractionTarget(e.target)) {
                                                    setCanvasQuickMenu(null);
                                                    setCanvasContextMenu(null);
                                                    if (workflowConnectSource) {
                                                        setWorkflowConnectSource('');
                                                        setWorkflowConnectCursor(null);
                                                        setStatus('Connect mode cancelled / 已退出连线模式');
                                                    }
                                                } }, className: `polaris-v98-stage h-full w-full overflow-hidden pt-[64px] ${canvasIsPanning ? 'is-panning' : ''}`, children: _jsx("div", { style: { width: canvasWidth * (canvasZoom || 1), height: canvasHeight * (canvasZoom || 1), minWidth: '100%', minHeight: '100%' }, children: _jsxs("div", { className: "relative", style: { width: canvasWidth, height: canvasHeight, transform: `scale(${canvasZoom || 1})`, transformOrigin: 'top left' }, children: [_jsxs("svg", { className: "pointer-events-none absolute inset-0", width: canvasWidth, height: canvasHeight, viewBox: `0 0 ${canvasWidth} ${canvasHeight}`, children: [_jsx("defs", { children: _jsxs("filter", { id: "polarisGlowV98", x: "-50%", y: "-50%", width: "200%", height: "200%", children: [_jsx("feGaussianBlur", { stdDeviation: "4", result: "coloredBlur" }), _jsxs("feMerge", { children: [_jsx("feMergeNode", { in: "coloredBlur" }), _jsx("feMergeNode", { in: "SourceGraphic" })] })] }) }), workflowConnectSource && nodeMap[workflowConnectSource] && workflowConnectCursor && (() => {
                                                                        const a = nodeMap[workflowConnectSource];
                                                                        const x1 = Number(a.x || 0) + 330;
                                                                        const y1 = Number(a.y || 0) + 78;
                                                                        const x2 = Number(workflowConnectCursor.x || x1 + 180);
                                                                        const y2 = Number(workflowConnectCursor.y || y1);
                                                                        const dx = Math.max(100, Math.abs(x2 - x1) * .42);
                                                                        const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
                                                                        return _jsx("path", { d: d, fill: "none", stroke: "#67e8f9", strokeWidth: "3", strokeLinecap: "round", strokeDasharray: "10 12", filter: "url(#polarisGlowV98)", style: { animation: 'polarisV98Flow 1.2s linear infinite' } }, "connect-preview");
                                                                    })(), boardEdges.map(edge => {
                                                                        const a = nodeMap[edge.source];
                                                                        const b = nodeMap[edge.target];
                                                                        if (!a || !b)
                                                                            return null;
                                                                        const x1 = Number(a.x || 0) + 330;
                                                                        const y1 = Number(a.y || 0) + 78;
                                                                        const x2 = Number(b.x || 0);
                                                                        const y2 = Number(b.y || 0) + 78;
                                                                        const dx = Math.max(120, Math.abs(x2 - x1) * .45);
                                                                        const stroke = edge.kind === 'green' ? '#22c55e' : edge.kind === 'blue' ? '#38bdf8' : edge.kind === 'gold' ? '#fbbf24' : edge.kind === 'purple' ? '#a78bfa' : '#94a3b8';
                                                                        const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
                                                                        const label = inferWorkflowEdgeLabel(edge);
                                                                        const labelX = (x1 + x2) / 2;
                                                                        const labelY = (y1 + y2) / 2 - 12;
                                                                        return _jsxs("g", { children: [_jsx("path", { d: d, fill: "none", stroke: "rgba(255,255,255,.18)", strokeWidth: "9", strokeLinecap: "round" }), _jsx("path", { d: d, fill: "none", stroke: stroke, strokeWidth: "2.5", strokeLinecap: "round", strokeDasharray: "18 18", filter: "url(#polarisGlowV98)", style: { animation: 'polarisV98Flow 5s linear infinite' } }), _jsx("rect", { x: labelX - 58, y: labelY - 13, width: "116", height: "24", rx: "12", fill: "rgba(5,5,5,.82)", stroke: "rgba(255,255,255,.14)" }), _jsx("text", { x: labelX, y: labelY + 4, textAnchor: "middle", fill: "#e5e7eb", fontSize: "11", fontWeight: "900", children: label })] }, edge.id);
                                                                    })] }), _jsxs("div", { className: "polaris-v99-help", children: [_jsx("div", { children: "\u53CC\u51FB\u6DFB\u52A0\u8282\u70B9 \u00B7 \u53F3\u952E\u6253\u5F00\u5FEB\u6377\u83DC\u5355 \u00B7 \u2318/Ctrl+S \u4FDD\u5B58 \u00B7 R\u8FD0\u884C \u00B7 A\u6574\u7406 \u00B7 Delete\u5220\u9664" }), _jsxs("div", { className: "polaris-v99-help-row", children: [_jsx("button", { onClick: () => setCanvasTemplateOpen(true), children: "\u9879\u76EE\u6A21\u677F" }), _jsx("button", { onClick: () => createBatchShotWorkflow(6), children: "\u6279\u91CF\u955C\u5934" }), _jsx("button", { onClick: () => addInfiniteCanvasNode('text', { x: 1110, y: 650 }), children: "\u6587\u672C\u521B\u4F5C" }), _jsx("button", { onClick: () => addInfiniteCanvasNode('image', { x: 1450, y: 650 }), children: "\u751F\u6210\u56FE\u7247" }), _jsx("button", { onClick: () => addInfiniteCanvasNode('video', { x: 1820, y: 650 }), children: "\u751F\u6210\u89C6\u9891" })] })] }), boardNodes.map(node => {
                                                                const isSelected = canvasSelectedNode === node.id;
                                                                const isRunning = workflowActiveNode === node.id;
                                                                const thumb = node.image || (node.action === 'seedream' && inspectedHero ? frameImageSrc(inspectedHero) : '');
                                                                const typeIcon = node.type === 'video' ? '▶' : node.type === 'image' ? '▧' : node.type === 'camera' ? '⌘' : node.type === 'prompt' ? '✦' : node.type === 'review' ? '✓' : node.type === 'shot' ? '▦' : node.type === 'ritual' ? '✺' : '☰';
                                                                const statusColor = node.status === 'ready' ? '#22c55e' : node.status === 'warning' ? '#fbbf24' : '#71717a';
                                                                const nodeShapeClass = node.type === 'image' ? 'polaris-v99-node-image' : node.type === 'video' ? 'polaris-v99-node-video' : node.type === 'text' ? 'polaris-v99-node-text' : node.type === 'camera' ? 'polaris-v99-node-camera' : node.type === 'prompt' ? 'polaris-v99-node-prompt' : node.type === 'review' ? 'polaris-v102-node-review' : node.group === 'output' ? 'polaris-v99-node-output' : '';
                                                                const modelLabel = node.type === 'video' ? (videoApiSettings.model || 'Seedance 2.0 VIP') : (imageApiSettings.model || 'Seedream Image Lab');
                                                                const nodePrompt = node.prompt || node.body || (node.type === 'text' ? '写下你想讲的故事、场景或角色设定。' : '描述你想要生成的画面内容，或引用上游素材。');
                                                                const nodeAsset = canvasNodeAssets?.[node.id] || {};
                                                                const lifecycle = getCanvasNodeLifecycle(node);
                                                                const incomingCount = getIncomingCanvasNodes(node.id).length;
                                                                const outgoingCount = getOutgoingCanvasNodes(node.id).length;
                                                                const historyCount = Array.isArray(nodeAsset.history) ? nodeAsset.history.length : 0;
                                                                const nodeImageAsset = (nodeAsset.images || [])[Number(nodeAsset.selectedIndex || 0)] || null;
                                                                const nodeImageSrc = nodeImageAsset ? frameImageSrc(nodeImageAsset) : thumb;
                                                                const nodeVideoUrl = nodeAsset.videoUrl || inspectedVideo?.videoUrl || '';
                                                                return _jsxs("div", { role: "button", tabIndex: 0, draggable: true, onDragStart: e => handleCanvasDragStart(e, node.id), onContextMenu: e => { e.preventDefault(); e.stopPropagation(); setCanvasSelectedNode(node.id); setCanvasInspectorOpen(true); setCanvasQuickMenu(null); setCanvasContextMenu({ ...getCanvasPointFromPointer(e), nodeId: node.id, nodeTitle: node.title }); }, onDoubleClick: e => { e.stopPropagation(); setCanvasSelectedNode(node.id); setCanvasInspectorOpen(true); }, onClick: e => { e.stopPropagation(); setCanvasQuickMenu(null); if (workflowConnectSource && workflowConnectSource !== node.id) {
                                                                        startConnectFromNode(node.id);
                                                                        return;
                                                                    } setCanvasSelectedNode(node.id); setCanvasInspectorOpen(true); if (node.shotIndex !== undefined)
                                                                        setActiveShot(Number(node.shotIndex || 0)); }, onKeyDown: e => { if (e.key === 'Enter') {
                                                                        if (workflowConnectSource && workflowConnectSource !== node.id)
                                                                            startConnectFromNode(node.id);
                                                                        else
                                                                            setCanvasSelectedNode(node.id);
                                                                    } }, className: `polaris-v98-node ${nodeShapeClass} ${isSelected ? 'is-selected' : ''} ${isRunning ? 'is-running' : ''} ${workflowConnectSource === node.id ? 'is-connect-source' : ''} ${workflowConnectSource && workflowConnectSource !== node.id ? 'is-connect-target' : ''}`, style: { left: node.x, top: node.y }, children: [_jsxs("div", { className: "polaris-v99-titlebar", children: [_jsx("span", { children: typeIcon }), _jsx("span", { children: node.title }), _jsx("span", { className: "polaris-v101-status-chip", children: lifecycle.label })] }), _jsx("div", { className: `polaris-v101-lifecycle ${lifecycle.key}`, children: _jsx("span", { style: { width: `${lifecycle.pct}%` } }) }), _jsx("button", { title: "\u8FDE\u63A5\u5230\u8FD9\u91CC / Input", className: "port left polaris-v99-side-port", onClick: e => { e.stopPropagation(); handleCanvasPortClick(node.id, "in"); }, children: "\uFF0B" }), _jsx("button", { title: "\u4ECE\u8FD9\u91CC\u5F00\u59CB\u8FDE\u7EBF / Output", className: "port right polaris-v99-side-port", onClick: e => { e.stopPropagation(); handleCanvasPortClick(node.id, "out"); }, children: "\uFF0B" }), node.type === 'image' ? _jsxs("div", { className: "polaris-v98-node-body", children: [_jsxs("div", { className: "polaris-v99-preview image", children: [nodeImageSrc ? _jsx("img", { src: nodeImageSrc, alt: "image node preview" }) : _jsxs("div", { className: "empty", children: [_jsx("div", { className: "big", children: "\u25A7" }), _jsx("div", { children: "\u56FE\u7247\u751F\u6210\u753B\u5E03 / Image Lab" })] }), _jsx("button", { className: "upload-chip", onClick: e => { e.stopPropagation(); addWorkflowLog('Upload placeholder / 上传素材入口待接入'); }, children: "\u21E7 \u4E0A\u4F20" })] }), _jsxs("div", { className: "polaris-v99-composer", children: [_jsxs("div", { className: "tabs", children: [_jsx("button", { className: "tab active", onClick: e => { e.stopPropagation(); setCanvasNodeAssets(prev => ({ ...prev, [node.id]: { ...(prev[node.id] || {}), provider: 'Jimeng Image Agent / 即梦生图智能体', model: 'jimeng-image-agent' } })); }, children: "\u5373\u68A6" }), _jsx("button", { className: "tab", onClick: e => { e.stopPropagation(); setCanvasNodeAssets(prev => ({ ...prev, [node.id]: { ...(prev[node.id] || {}), provider: 'Kling Image Agent / 可灵生图智能体', model: 'kling-image-agent' } })); }, children: "\u53EF\u7075" }), _jsx("button", { className: "tab", onClick: e => { e.stopPropagation(); translateCanvasNodePrompt(node); }, children: "\u7FFB\u8BD1\u63D0\u793A\u8BCD" })] }), _jsx("textarea", { className: "polaris-v100-node-input", value: getCanvasNodeDraft(node), onChange: e => updateCanvasNodeDraft(node.id, e.target.value), onFocus: () => setCanvasFocusedInput(node.id), onMouseDown: e => e.stopPropagation(), onClick: e => e.stopPropagation(), placeholder: "\u63CF\u8FF0\u4F60\u60F3\u751F\u6210\u7684\u753B\u9762\u5185\u5BB9\uFF0C\u652F\u6301\u4E2D\u6587\u3002\u53EF\u5148\u70B9\u2018\u7FFB\u8BD1\u63D0\u793A\u8BCD\u2019\uFF0C\u518D\u8C03\u7528\u5373\u68A6/\u53EF\u7075\u3002" }), _jsx("div", { className: "polaris-v100-translated", children: nodeAsset.translatedPrompt ? `EN: ${String(nodeAsset.translatedPrompt).slice(0, 180)}` : 'DeepSeek 可将中文需求翻译成英文专业生图提示词。' }), _jsxs("div", { className: "polaris-v106-model-row", children: [_jsxs("select", { className: "polaris-v106-select", value: nodeAsset.provider || imageApiSettings.provider || 'Jimeng Image Agent / 即梦生图智能体', onMouseDown: e => e.stopPropagation(), onClick: e => e.stopPropagation(), onChange: e => { const provider = e.target.value; const firstModel = getCanvasImageModelOptions(provider)[0]?.value || 'jimeng-image-agent'; updateCanvasNodeSetting(node.id, { provider, model: firstModel }); }, children: [_jsx("option", { children: "Jimeng Image Agent / \u5373\u68A6\u751F\u56FE\u667A\u80FD\u4F53" }), _jsx("option", { children: "Kling Image Agent / \u53EF\u7075\u751F\u56FE\u667A\u80FD\u4F53" }), _jsx("option", { children: "Volcengine Seedream / \u706B\u5C71\u5373\u68A6 Seedream" })] }), _jsx("select", { className: "polaris-v106-select", value: nodeAsset.model || imageApiSettings.model || getCanvasImageModelOptions(nodeAsset.provider || imageApiSettings.provider)[0]?.value, onMouseDown: e => e.stopPropagation(), onClick: e => e.stopPropagation(), onChange: e => updateCanvasNodeSetting(node.id, { model: e.target.value }), children: getCanvasImageModelOptions(nodeAsset.provider || imageApiSettings.provider).map(opt => _jsx("option", { value: opt.value, children: opt.label }, opt.value)) })] }), _jsxs("div", { className: "tools", children: [_jsxs("button", { className: "polaris-v99-tool", children: ["16:9 \u00B7 ", imageApiSettings.size || '2K'] }), _jsxs("button", { className: "polaris-v99-tool", children: [imageApiSettings.candidates || '1', "\u5F20"] }), _jsx("button", { className: "polaris-v99-tool alt", onClick: e => { e.stopPropagation(); setCanvasInspectorOpen(true); setCanvasSelectedNode(node.id); }, children: "\u53C2\u6570" }), _jsx("button", { className: "polaris-v99-tool primary", onClick: e => { e.stopPropagation(); generateImageForCanvasNode(node); }, children: nodeAsset.status === 'generating' ? '生成中…' : '生成图片 ↑' })] })] })] }) : node.type === 'video' ? _jsxs("div", { className: "polaris-v98-node-body", children: [_jsx("div", { className: "polaris-v99-preview video", children: nodeVideoUrl ? _jsx("video", { src: nodeVideoUrl, controls: true }) : _jsxs("div", { className: "empty", children: [_jsx("div", { className: "big", children: "\u25B6" }), _jsx("div", { children: "\u89C6\u9891\u751F\u6210\u753B\u5E03 / Video Lab" })] }) }), _jsxs("div", { className: "polaris-v99-composer", children: [_jsxs("div", { className: "tabs", children: [_jsx("button", { className: "tab active", onClick: e => { e.stopPropagation(); setCanvasNodeAssets(prev => ({ ...prev, [node.id]: { ...(prev[node.id] || {}), videoProvider: 'Jimeng Video Agent / 即梦视频智能体', videoModel: 'jimeng-video-agent' } })); }, children: "\u5373\u68A6\u89C6\u9891" }), _jsx("button", { className: "tab", onClick: e => { e.stopPropagation(); setCanvasNodeAssets(prev => ({ ...prev, [node.id]: { ...(prev[node.id] || {}), videoProvider: 'Kling Video Agent / 可灵视频智能体', videoModel: 'kling-video-agent' } })); }, children: "\u53EF\u7075\u89C6\u9891" }), _jsx("button", { className: "tab", children: "\u56FE\u751F\u89C6\u9891" }), _jsx("button", { className: "tab", onClick: e => { e.stopPropagation(); translateCanvasNodePrompt(node); }, children: "\u7FFB\u8BD1\u63D0\u793A\u8BCD" })] }), _jsx("textarea", { className: "polaris-v100-node-input", value: getCanvasNodeDraft(node), onChange: e => updateCanvasNodeDraft(node.id, e.target.value), onFocus: () => setCanvasFocusedInput(node.id), onMouseDown: e => e.stopPropagation(), onClick: e => e.stopPropagation(), placeholder: "\u63CF\u8FF0\u4F60\u60F3\u751F\u6210\u7684\u89C6\u9891\u753B\u9762\u3001\u8FD0\u52A8\u3001\u955C\u5934\u3001\u60C5\u7EEA\u3001\u65F6\u957F\uFF0C\u53EF\u5F15\u7528\u4E0A\u6E38\u56FE\u7247\u3002" }), _jsx("div", { className: "polaris-v100-translated", children: nodeAsset.translatedPrompt ? `EN: ${String(nodeAsset.translatedPrompt).slice(0, 190)}` : '可先用 DeepSeek 翻译提示词，再提交即梦/可灵视频任务。' }), _jsxs("div", { className: "polaris-v106-model-row", children: [_jsxs("select", { className: "polaris-v106-select", value: nodeAsset.videoProvider || videoApiSettings.provider || 'Jimeng Video Agent / 即梦视频智能体', onMouseDown: e => e.stopPropagation(), onClick: e => e.stopPropagation(), onChange: e => { const videoProvider = e.target.value; const firstModel = getCanvasVideoModelOptions(videoProvider)[0]?.value || 'jimeng-video-agent'; updateCanvasNodeSetting(node.id, { videoProvider, videoModel: firstModel }); }, children: [_jsx("option", { children: "Jimeng Video Agent / \u5373\u68A6\u89C6\u9891\u667A\u80FD\u4F53" }), _jsx("option", { children: "Kling Video Agent / \u53EF\u7075\u89C6\u9891\u667A\u80FD\u4F53" }), _jsx("option", { children: "Volcengine Seedance / \u706B\u5C71\u65B9\u821F Seedance" })] }), _jsx("select", { className: "polaris-v106-select", value: nodeAsset.videoModel || videoApiSettings.model || getCanvasVideoModelOptions(nodeAsset.videoProvider || videoApiSettings.provider)[0]?.value, onMouseDown: e => e.stopPropagation(), onClick: e => e.stopPropagation(), onChange: e => updateCanvasNodeSetting(node.id, { videoModel: e.target.value }), children: getCanvasVideoModelOptions(nodeAsset.videoProvider || videoApiSettings.provider).map(opt => _jsx("option", { value: opt.value, children: opt.label }, opt.value)) })] }), _jsxs("div", { className: "tools", children: [_jsxs("button", { className: "polaris-v99-tool", children: [videoApiSettings.ratio || '16:9', " \u00B7 ", videoApiSettings.resolution || '720p', " \u00B7 ", videoApiSettings.duration || '5', "s"] }), _jsx("button", { className: "polaris-v99-tool", onClick: e => { e.stopPropagation(); pollCanvasNodeVideo(node); }, children: "\u67E5\u72B6\u6001" }), _jsx("button", { className: "polaris-v99-tool alt", onClick: e => { e.stopPropagation(); setCanvasInspectorOpen(true); setCanvasSelectedNode(node.id); }, children: "\u53C2\u6570" }), _jsx("button", { className: "polaris-v99-tool primary", onClick: e => { e.stopPropagation(); generateVideoForCanvasNode(node); }, children: nodeAsset.status === 'submitting' ? '提交中…' : '生成视频 ↑' })] })] })] }) : node.type === 'text' ? _jsxs("div", { className: "polaris-v98-node-body", children: [_jsx("div", { className: "polaris-v99-text-preview", children: "\u2630" }), _jsxs("div", { className: "polaris-v99-text-prompt", children: [_jsx("textarea", { className: "polaris-v100-node-input text", value: getCanvasNodeDraft(node), onChange: e => updateCanvasNodeDraft(node.id, e.target.value), onFocus: () => setCanvasFocusedInput(node.id), onMouseDown: e => e.stopPropagation(), onClick: e => e.stopPropagation(), placeholder: "\u5199\u4E0B\u4F60\u60F3\u8BB2\u7684\u6545\u4E8B\u3001\u573A\u666F\u6216\u89D2\u8272\u8BBE\u5B9A\u3002\u8FD9\u4E2A\u8282\u70B9\u4F1A\u8C03\u7528 DeepSeek \u8FDB\u884C\u6269\u5199\u3001\u6574\u7406\u548C\u63D0\u793A\u8BCD\u51C6\u5907\u3002" }), nodeAsset.output && _jsx("div", { className: "polaris-v100-output", children: String(nodeAsset.output).slice(0, 260) }), _jsxs("div", { className: "polaris-v99-text-run", children: [_jsx("button", { onClick: e => { e.stopPropagation(); runDeepSeekForCanvasNode(node); }, children: nodeAsset.status === 'thinking' ? '思考中…' : 'DeepSeek生成' }), _jsx("button", { className: "alt", onClick: e => { e.stopPropagation(); translateCanvasNodePrompt(node); }, children: "\u7FFB\u8BD1\u63D0\u793A\u8BCD" }), _jsx("button", { className: "alt", onClick: e => { e.stopPropagation(); safeCopyText(getCanvasNodePrompt(node)); }, children: "\u590D\u5236" }), _jsx("button", { className: "alt", onClick: e => { e.stopPropagation(); startConnectFromNode(node.id); }, children: "\u8FDE\u63A5" })] })] })] }) : node.type === 'camera' ? _jsx("div", { className: "polaris-v98-node-body", children: _jsxs("div", { className: "polaris-v106-camera-panel", children: [_jsxs("div", { className: "polaris-v106-camera-grid", children: [_jsx("select", { value: nodeAsset.cameraSettings?.framing || 'MS 中景', onMouseDown: e => e.stopPropagation(), onClick: e => e.stopPropagation(), onChange: e => updateCanvasNodeCameraSetting(node.id, 'framing', e.target.value), children: CANVAS_CAMERA_OPTIONS.framing.map(x => _jsx("option", { children: x }, x)) }), _jsx("select", { value: nodeAsset.cameraSettings?.angle || 'Front 正面', onMouseDown: e => e.stopPropagation(), onClick: e => e.stopPropagation(), onChange: e => updateCanvasNodeCameraSetting(node.id, 'angle', e.target.value), children: CANVAS_CAMERA_OPTIONS.angle.map(x => _jsx("option", { children: x }, x)) }), _jsx("select", { value: nodeAsset.cameraSettings?.movement || 'Push In 推进', onMouseDown: e => e.stopPropagation(), onClick: e => e.stopPropagation(), onChange: e => updateCanvasNodeCameraSetting(node.id, 'movement', e.target.value), children: CANVAS_CAMERA_OPTIONS.movement.map(x => _jsx("option", { children: x }, x)) }), _jsx("select", { value: nodeAsset.cameraSettings?.lens || '35mm 自然', onMouseDown: e => e.stopPropagation(), onClick: e => e.stopPropagation(), onChange: e => updateCanvasNodeCameraSetting(node.id, 'lens', e.target.value), children: CANVAS_CAMERA_OPTIONS.lens.map(x => _jsx("option", { children: x }, x)) })] }), _jsx("textarea", { className: "polaris-v100-node-input camera", value: getCanvasNodeDraft(node), onChange: e => updateCanvasNodeDraft(node.id, e.target.value), onFocus: () => setCanvasFocusedInput(node.id), onMouseDown: e => e.stopPropagation(), onClick: e => e.stopPropagation(), placeholder: "\u8F93\u5165\u8FD9\u4E00\u955C\u7684\u8C03\u5EA6\u8981\u6C42\uFF1A\u4EBA\u7269\u7AD9\u4F4D\u3001\u8D70\u4F4D\u3001\u89C6\u7EBF\u3001\u9053\u5177\u3001\u52A8\u4F5C\u8D77\u70B9\u548C\u7EC8\u70B9\u3002" }), nodeAsset.cameraBoard && _jsx("div", { className: "polaris-v106-camera-output", children: String(nodeAsset.cameraBoard).slice(0, 520) }), _jsx("div", { className: "polaris-v99-camera-grid", children: cameraPlan.slice(0, 4).map(cam => _jsxs("div", { className: "polaris-v99-camera-card", children: [_jsxs("b", { children: [cam.tag, " \u00B7 ", cam.title] }), _jsxs("span", { children: [cam.lens, " \u00B7 ", cam.move] })] }, cam.tag)) }), _jsxs("div", { className: "polaris-v99-camera-footer", children: [_jsx("span", { children: "\u53C2\u8003\u89C6\u9891\u903B\u8F91\uFF1A\u666F\u522B / \u89D2\u5EA6 / \u8FD0\u955C / \u7126\u6BB5 / \u5149\u5708" }), _jsx("button", { onClick: e => { e.stopPropagation(); generateCameraBlockingForCanvasNode(node); }, children: "\u751F\u6210\u673A\u4F4D" })] })] }) }) : _jsxs("div", { className: "polaris-v98-node-body", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "polaris-v98-node-type", style: { color: statusColor }, children: [typeIcon, " ", node.group, " \u00B7 ", node.status] }), _jsx("div", { className: "polaris-v98-node-title", children: node.title })] }), _jsx("span", { className: "rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-black text-zinc-400", children: node.type })] }), _jsx("div", { className: "polaris-v98-node-text", children: node.body }), _jsxs("div", { className: "mt-2 flex flex-wrap gap-1", children: [_jsxs("span", { className: "polaris-v101-status-chip", children: ["\u2191 ", incomingCount] }), _jsxs("span", { className: "polaris-v101-status-chip", children: ["\u2193 ", outgoingCount] }), _jsxs("span", { className: "polaris-v101-status-chip", children: ["H ", historyCount] })] }), _jsxs("div", { className: "polaris-v98-actions", children: [_jsx("button", { onClick: e => { e.stopPropagation(); runWorkflowNode(node); }, disabled: !!workflowActiveNode, children: "\u8FD0\u884C" }), _jsx("button", { onClick: e => { e.stopPropagation(); runDownstreamFromNode(node.id); }, disabled: !!workflowActiveNode, children: "\u4E0B\u6E38" }), _jsx("button", { onClick: e => { e.stopPropagation(); startConnectFromNode(node.id); }, children: workflowConnectSource === node.id ? '连接中' : '连接' })] })] })] }, node.id);
                                                            })] }) }) }), canvasInspectorOpen && _jsxs("aside", { className: "polaris-v98-inspector", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.24em] text-amber-300", children: "Node Inspector" }), _jsx("button", { onClick: () => setCanvasInspectorOpen(false), className: "polaris-v98-pill", children: "\u00D7" })] }), _jsx("h3", { children: selectedNode?.title || '未选择节点' }), _jsxs("div", { className: "mt-2 text-xs font-bold text-zinc-500", children: [selectedNode?.meta || 'idle', " \u00B7 ", selectedNode?.id] }), _jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2 lg:grid-cols-3", children: [_jsx("button", { onClick: () => selectedNode && runWorkflowNode(selectedNode), disabled: !selectedNode || !!workflowActiveNode, className: "polaris-v98-cta", children: "Run Node / \u8FD0\u884C\u8282\u70B9" }), _jsx("button", { onClick: () => selectedNode && runDownstreamFromNode(selectedNode.id), disabled: !selectedNode || !!workflowActiveNode, className: "polaris-v98-cta green", children: "Downstream / \u8FD0\u884C\u4E0B\u6E38" }), _jsx("button", { onClick: () => selectedNode && safeCopyText(getCanvasNodeOutputText(selectedNode) || selectedNode.prompt || ''), disabled: !selectedNode, className: "polaris-v98-cta alt", children: "Copy Output / \u590D\u5236\u8F93\u51FA" }), _jsx("button", { onClick: () => selectedNode && startConnectFromNode(selectedNode.id), disabled: !selectedNode, className: "polaris-v98-cta gold", children: "Connect / \u8FDE\u7EBF" }), _jsx("button", { onClick: () => selectedNode && centerCanvasToNode(selectedNode.id), disabled: !selectedNode, className: "polaris-v98-cta alt", children: "Center / \u5C45\u4E2D" }), _jsx("button", { onClick: () => selectedNode && removeWorkflowNode(selectedNode.id), disabled: !selectedNode, className: "polaris-v98-cta alt", children: "Delete / \u5220\u9664" })] }), selectedNode && _jsxs("div", { className: "mt-5 polaris-v98-card", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("div", { className: "polaris-v101-inspector-label", children: "Node State / \u8282\u70B9\u72B6\u6001" }), _jsx("div", { className: "mt-2 text-lg font-black text-white", children: selectedLifecycle?.label })] }), _jsxs("span", { className: "polaris-v101-status-chip", children: [selectedIncoming.length, " IN \u00B7 ", selectedOutgoing.length, " OUT"] })] }), _jsx("div", { className: `polaris-v101-lifecycle ${selectedLifecycle?.key || 'empty'} mt-3`, style: { position: 'relative', left: 0, right: 0, top: 0 }, children: _jsx("span", { style: { width: `${selectedLifecycle?.pct || 0}%` } }) }), _jsxs("div", { className: "mt-4", children: [_jsx("div", { className: "polaris-v101-inspector-label", children: "Input / \u5F53\u524D\u8282\u70B9\u8F93\u5165" }), _jsx("textarea", { className: "polaris-v101-inspector-textarea mt-2", value: getCanvasNodeDraft(selectedNode), onChange: e => updateCanvasNodeDraft(selectedNode.id, e.target.value), placeholder: "\u7F16\u8F91\u5F53\u524D\u8282\u70B9\u7684\u8F93\u5165\uFF1B\u8FDE\u63A5\u4E0A\u6E38\u540E\u4F1A\u81EA\u52A8\u7EE7\u627F\u4E0A\u6E38\u5185\u5BB9\u3002" }), selectedNode?.type === 'image' && _jsxs("div", { className: "polaris-v106-inspector-settings", children: [_jsxs("label", { children: ["\u56FE\u7247\u63A5\u53E3 / Provider", _jsxs("select", { value: (canvasNodeAssets?.[selectedNode.id]?.provider || imageApiSettings.provider), onChange: e => { const provider = e.target.value; updateCanvasNodeSetting(selectedNode.id, { provider, model: getCanvasImageModelOptions(provider)[0]?.value }); }, children: [_jsx("option", { children: "Jimeng Image Agent / \u5373\u68A6\u751F\u56FE\u667A\u80FD\u4F53" }), _jsx("option", { children: "Kling Image Agent / \u53EF\u7075\u751F\u56FE\u667A\u80FD\u4F53" }), _jsx("option", { children: "Volcengine Seedream / \u706B\u5C71\u5373\u68A6 Seedream" })] })] }), _jsxs("label", { children: ["\u56FE\u7247\u6A21\u578B / Image Model", _jsx("select", { value: (canvasNodeAssets?.[selectedNode.id]?.model || imageApiSettings.model), onChange: e => updateCanvasNodeSetting(selectedNode.id, { model: e.target.value }), children: getCanvasImageModelOptions(canvasNodeAssets?.[selectedNode.id]?.provider || imageApiSettings.provider).map(opt => _jsx("option", { value: opt.value, children: opt.label }, opt.value)) })] })] }), selectedNode?.type === 'video' && _jsxs("div", { className: "polaris-v106-inspector-settings", children: [_jsxs("label", { children: ["\u89C6\u9891\u63A5\u53E3 / Provider", _jsxs("select", { value: (canvasNodeAssets?.[selectedNode.id]?.videoProvider || videoApiSettings.provider), onChange: e => { const videoProvider = e.target.value; updateCanvasNodeSetting(selectedNode.id, { videoProvider, videoModel: getCanvasVideoModelOptions(videoProvider)[0]?.value }); }, children: [_jsx("option", { children: "Jimeng Video Agent / \u5373\u68A6\u89C6\u9891\u667A\u80FD\u4F53" }), _jsx("option", { children: "Kling Video Agent / \u53EF\u7075\u89C6\u9891\u667A\u80FD\u4F53" }), _jsx("option", { children: "Volcengine Seedance / \u706B\u5C71\u65B9\u821F Seedance" })] })] }), _jsxs("label", { children: ["\u89C6\u9891\u6A21\u578B / Video Model", _jsx("select", { value: (canvasNodeAssets?.[selectedNode.id]?.videoModel || videoApiSettings.model), onChange: e => updateCanvasNodeSetting(selectedNode.id, { videoModel: e.target.value }), children: getCanvasVideoModelOptions(canvasNodeAssets?.[selectedNode.id]?.videoProvider || videoApiSettings.provider).map(opt => _jsx("option", { value: opt.value, children: opt.label }, opt.value)) })] })] }), selectedNode?.type === 'camera' && _jsxs("div", { className: "polaris-v106-inspector-settings", children: [_jsxs("label", { children: ["\u666F\u522B / Framing", _jsx("select", { value: canvasNodeAssets?.[selectedNode.id]?.cameraSettings?.framing || 'MS 中景', onChange: e => updateCanvasNodeCameraSetting(selectedNode.id, 'framing', e.target.value), children: CANVAS_CAMERA_OPTIONS.framing.map(x => _jsx("option", { children: x }, x)) })] }), _jsxs("label", { children: ["\u8FD0\u955C / Movement", _jsx("select", { value: canvasNodeAssets?.[selectedNode.id]?.cameraSettings?.movement || 'Push In 推进', onChange: e => updateCanvasNodeCameraSetting(selectedNode.id, 'movement', e.target.value), children: CANVAS_CAMERA_OPTIONS.movement.map(x => _jsx("option", { children: x }, x)) })] }), _jsx("button", { className: "polaris-v98-cta gold", onClick: () => generateCameraBlockingForCanvasNode(selectedNode), children: "\u751F\u6210\u673A\u4F4D\u5206\u955C" })] }), _jsx("div", { className: "polaris-v102-mention-row", children: getAssetMentionTokens().slice(0, 8).map(t => _jsx("button", { onClick: () => insertAssetMention(selectedNode.id, t.token), children: t.token }, t.token)) }), _jsxs("div", { className: "polaris-v102-next-row", children: [_jsx("b", { children: "Next / \u4E0B\u4E00\u6B65" }), getNextNodeSuggestions(selectedNode).map(([kind, label]) => _jsx("button", { onClick: () => addSuggestedNodeFrom(selectedNode, kind), children: label }, kind))] })] }), selectedIncoming.length > 0 && _jsxs("div", { className: "mt-4", children: [_jsx("div", { className: "polaris-v101-inspector-label", children: "Upstream Context / \u4E0A\u6E38\u7EE7\u627F" }), _jsx("div", { className: "mt-2 max-h-36 overflow-auto rounded-2xl bg-black/25 p-3 text-[11px] leading-5 text-zinc-400", children: getUpstreamCanvasContext(selectedNode) || '上游节点暂无可继承输出。' })] }), _jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2", children: [_jsx("button", { onClick: () => selectedNode && translateCanvasNodePrompt(selectedNode), className: "polaris-v98-cta alt", children: "Translate / \u7FFB\u8BD1" }), _jsx("button", { onClick: () => selectedNode && runDeepSeekForCanvasNode(selectedNode), className: "polaris-v98-cta", children: "DeepSeek" }), _jsx("button", { onClick: () => selectedNode && generateImageForCanvasNode(selectedNode), className: "polaris-v98-cta gold", children: "Image / \u751F\u56FE" }), _jsx("button", { onClick: () => selectedNode && generateVideoForCanvasNode(selectedNode), className: "polaris-v98-cta green", children: "Video / \u89C6\u9891" })] }), selectedNodeAsset.error && _jsx("div", { className: "mt-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-3 text-[11px] leading-5 text-red-200", children: selectedNodeAsset.error })] }), selectedHistory.length > 0 && _jsxs("div", { className: "mt-5 polaris-v98-card", children: [_jsx("div", { className: "polaris-v101-inspector-label", children: "History / \u7248\u672C\u5386\u53F2" }), _jsx("div", { className: "mt-3 max-h-72 space-y-2 overflow-auto pr-1", children: selectedHistory.map(h => _jsxs("div", { className: "polaris-v101-history-item", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("b", { className: "text-zinc-200", children: h.label || h.type }), _jsx("span", { children: h.time })] }), _jsx("div", { className: "mt-1 line-clamp-3", children: h.output || h.prompt || h.status || h.taskId || 'saved' }), _jsxs("div", { className: "mt-2 flex gap-2", children: [_jsx("button", { onClick: () => safeCopyText(h.output || h.prompt || h.videoUrl || ''), className: "polaris-v98-cta alt", children: "Copy / \u590D\u5236" }), h.images?.length ? _jsx("button", { onClick: () => setCanvasNodeAssets(prev => ({ ...prev, [selectedNode.id]: { ...(prev[selectedNode.id] || {}), images: h.images, selectedIndex: 0 } })), className: "polaris-v98-cta gold", children: "Restore / \u6062\u590D" }) : null] })] }, h.id)) })] }), inspectedShot && _jsxs("div", { className: "mt-5 polaris-v98-card", children: [_jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300", children: "Camera Shot Board / \u673A\u4F4D\u5206\u955C" }), _jsxs("h3", { className: "text-lg", children: ["Shot ", selectedShotIndex + 1, " \u00B7 ", inspectedShot.titleZh || inspectedShot.titleEn || '镜头'] }), _jsx("div", { className: "mt-3 polaris-v98-asset", children: inspectedHero ? _jsx("img", { src: frameImageSrc(inspectedHero), alt: "keyframe" }) : _jsx("div", { className: "grid aspect-video place-items-center text-zinc-600", children: "No keyframe" }) }), _jsx("div", { className: "mt-3 space-y-2", children: cameraPlan.map(cam => _jsxs("div", { className: "polaris-v98-card", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("b", { children: [cam.tag, " \u00B7 ", cam.title] }), _jsx("span", { className: "text-[10px] font-black text-cyan-300", children: cam.lens })] }), _jsxs("p", { children: [cam.en, " \u00B7 ", cam.use] }), _jsxs("p", { children: ["Move: ", cam.move] })] }, cam.tag)) }), _jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2", children: [_jsx("button", { onClick: () => handleGenerateShotKeyframe(selectedShotIndex), disabled: isGeneratingKeyframes, className: "polaris-v98-cta", children: "\u751F\u56FE" }), _jsx("button", { onClick: () => handleGenerateShotVideo(selectedShotIndex), disabled: isGeneratingVideos, className: "polaris-v98-cta green", children: "\u751F\u89C6\u9891" }), _jsx("button", { onClick: () => pollVideoTask(inspectedShotId), disabled: !inspectedVideo.taskId, className: "polaris-v98-cta gold", children: "\u67E5\u8BE2" }), _jsx("button", { onClick: () => safeCopyText(inspectedShot.finalPrompt || buildFinalPrompt(inspectedShot, project, style, tech, modules, negativePrompt)), className: "polaris-v98-cta alt", children: "\u590D\u5236\u63D0\u793A\u8BCD" })] }), inspectedVideo.videoUrl && _jsx("div", { className: "mt-3 polaris-v98-asset", children: _jsx("video", { src: inspectedVideo.videoUrl, controls: true }) })] }), _jsxs("div", { className: "mt-5 polaris-v98-card", children: [_jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.2em] text-violet-300", children: "Production Queue / \u751F\u4EA7\u961F\u5217" }), _jsx("div", { className: "mt-3 grid grid-cols-2 gap-2 text-xs", children: productionStats.map(([a, b, c]) => _jsxs("div", { className: "rounded-2xl bg-white/5 p-3", children: [_jsx("div", { className: "text-zinc-500", children: a }), _jsx("div", { className: "mt-1 text-lg font-black text-white", children: b }), _jsx("div", { className: "text-[10px] text-zinc-500", children: c })] }, a)) })] }), _jsxs("div", { className: "mt-5 polaris-v98-card", children: [_jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300", children: "Run Log / \u8FD0\u884C\u65E5\u5FD7" }), _jsx("div", { className: "mt-3 max-h-60 space-y-2 overflow-auto pr-1", children: workflowRunLog.length ? workflowRunLog.slice(0, 12).map(log => _jsxs("div", { className: "rounded-xl bg-black/30 p-2 text-[11px] leading-5 text-zinc-400", children: [_jsx("b", { children: log.time }), " \u00B7 ", log.message] }, log.id)) : _jsx("p", { children: "\u6682\u65E0\u8FD0\u884C\u65E5\u5FD7\u3002" }) })] })] })] });
                                })(), projectStudioTab === "client" && _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-5", children: [_jsx("button", { onClick: () => setClientViewMode("overview"), className: `rounded-2xl border px-4 py-3 text-[11px] font-black uppercase ${clientViewMode === "overview" ? "border-amber-300 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-white"}`, children: "Overview" }), _jsx("button", { onClick: () => setClientViewMode("shots"), className: `rounded-2xl border px-4 py-3 text-[11px] font-black uppercase ${clientViewMode === "shots" ? "border-amber-300 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-white"}`, children: "Shots" }), _jsx("button", { onClick: () => setClientViewMode("style"), className: `rounded-2xl border px-4 py-3 text-[11px] font-black uppercase ${clientViewMode === "style" ? "border-amber-300 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-white"}`, children: "Style" }), _jsx("button", { onClick: () => setClientViewMode("delivery"), className: `rounded-2xl border px-4 py-3 text-[11px] font-black uppercase ${clientViewMode === "delivery" ? "border-amber-300 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-white"}`, children: "Delivery" }), _jsx("button", { onClick: () => safeCopyText(buildClientPreviewText()), className: "rounded-2xl bg-cyan-300 px-4 py-3 text-[11px] font-black uppercase text-black", children: "Copy Client View" })] }), _jsxs("div", { className: "rounded-[2rem] border border-white/10 bg-white/[0.03] p-7", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300", children: "Client Preview / \u5BA2\u6237\u9884\u89C8" }), _jsx("h3", { className: "mt-3 text-3xl font-black text-white", children: project }), _jsxs("div", { className: "mt-5 grid grid-cols-2 gap-3 md:grid-cols-5", children: [_jsx(MiniStat, { label: "Health", value: `${getProjectHealthScore().total}/100`, tone: "emerald" }), _jsx(MiniStat, { label: "Shots", value: shots.length }), _jsx(MiniStat, { label: "Mode", value: workspaceMode || "-", tone: "amber" }), _jsx(MiniStat, { label: "Duration", value: tech.videoDuration || "-" }), _jsx(MiniStat, { label: "Archive", value: lastArchiveId ? "Locked" : "Draft" })] }), _jsx("pre", { className: "mt-6 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-3xl bg-black/40 p-5 text-[12px] leading-7 text-stone-300", children: buildClientPreviewText() })] })] }), projectStudioTab === "files" && _jsxs("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2", children: [_jsxs("div", { className: "rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-6", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200", children: "Export Project File / \u5BFC\u51FA\u5DE5\u7A0B\u6587\u4EF6" }), _jsx("p", { className: "mt-3 text-sm leading-7 text-stone-300", children: "\u5BFC\u51FA .polaris.json \u5DE5\u7A0B\u6587\u4EF6\uFF0C\u65B9\u4FBF\u5907\u4EFD\u3001\u8FC1\u79FB\u6216\u56E2\u961F\u534F\u4F5C\u3002" }), _jsx("button", { onClick: exportProjectFile, className: "mt-5 rounded-2xl bg-emerald-400 px-5 py-3 text-[11px] font-black uppercase text-black", children: "Export .polaris.json" })] }), _jsxs("div", { className: "rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-6", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200", children: "Import Project File / \u5BFC\u5165\u5DE5\u7A0B\u6587\u4EF6" }), _jsx("p", { className: "mt-3 text-sm leading-7 text-stone-300", children: "\u5BFC\u5165\u4ED6\u4EBA\u6216\u5386\u53F2\u5BFC\u51FA\u7684 .polaris.json\uFF0C\u7EE7\u7EED\u7F16\u8F91\u5B8C\u6574\u9879\u76EE\u3002" }), _jsxs("label", { className: "mt-5 inline-flex cursor-pointer rounded-2xl bg-cyan-300 px-5 py-3 text-[11px] font-black uppercase text-black", children: ["Import File", _jsx("input", { type: "file", accept: ".json,.polaris.json,application/json", onChange: importProjectFileFromUpload, className: "hidden" })] })] })] }), projectStudioTab === "prompt" && _jsxs("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-2", children: [_jsxs("div", { className: "rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-6", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200", children: "Prompt Master Engine / \u63D0\u793A\u8BCD\u5927\u5E08\u5F15\u64CE" }), _jsx("p", { className: "mt-3 text-sm leading-7 text-stone-300", children: "\u628A\u811A\u672C\u5185\u5BB9\u548C\u5206\u955C\u7F16\u8BD1\u6210\u53EF\u6267\u884C\u3001\u53EF\u8BCA\u65AD\u3001\u53EF\u9002\u914D\u4E0D\u540CAI\u89C6\u9891\u6A21\u578B\u7684\u5DE5\u4E1A\u7EA7\u63D0\u793A\u8BCD\u3002" }), _jsxs("div", { className: "mt-5 grid grid-cols-1 gap-4 md:grid-cols-2", children: [_jsx(FormField, { label: "Content Mode", zh: "\u5185\u5BB9\u589E\u5F3A\u6A21\u5F0F", children: _jsx(Select, { items: OPT.contentEngineModes, value: tech.contentEngineMode, onChange: v => setTech(p => ({ ...p, contentEngineMode: v })) }) }), _jsx(FormField, { label: "Prompt Strength", zh: "\u63D0\u793A\u8BCD\u5F3A\u5EA6", children: _jsx(Select, { items: OPT.promptStrengthLevels, value: tech.promptStrength, onChange: v => setTech(p => ({ ...p, promptStrength: v })) }) }), _jsx(FormField, { label: "Prompt Length", zh: "\u63D0\u793A\u8BCD\u957F\u5EA6", children: _jsx(Select, { items: OPT.promptLengthModes, value: tech.promptLength, onChange: v => setTech(p => ({ ...p, promptLength: v })) }) }), _jsx(FormField, { label: "Rewrite Mode", zh: "\u63D0\u793A\u8BCD\u6539\u5199\u65B9\u5411", children: _jsx(Select, { items: OPT.promptRewriteModes, value: tech.promptRewriteMode, onChange: v => setTech(p => ({ ...p, promptRewriteMode: v })) }) }), _jsx(FormField, { label: "Prompt Refine Mode", zh: "\u63D0\u793A\u8BCD\u7CBE\u4FEE\u6A21\u5F0F", children: _jsx(Select, { items: OPT.promptRefineModes, value: promptRefineMode, onChange: setPromptRefineMode }) }), _jsx(FormField, { label: "Outline Rewrite Mode", zh: "\u5927\u7EB2\u6253\u78E8\u65B9\u5411", children: _jsx(Select, { items: OPT.outlineRewriteModes, value: outlineRewriteMode, onChange: setOutlineRewriteMode }) })] }), _jsxs("div", { className: "mt-5 flex flex-wrap gap-3", children: [_jsx("button", { onClick: () => handleQuickRefineCurrentPrompt(), disabled: !active, className: "rounded-2xl bg-cyan-300 px-5 py-3 text-[11px] font-black uppercase text-black disabled:opacity-40", children: "Refine Active Prompt / \u7CBE\u4FEE\u5F53\u524D\u63D0\u793A\u8BCD" }), _jsx("button", { onClick: handleRewriteOutline, disabled: isGeneratingOutline || !(outlineDraft || script || ideaInput), className: "rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase text-white disabled:opacity-40", children: "Rewrite Outline / \u6253\u78E8\u5927\u7EB2" })] })] }), _jsxs("div", { className: "rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-6", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200", children: "Prompt Debugger / \u63D0\u793A\u8BCD\u8BCA\u65AD\u5668" }), _jsx("div", { className: "mt-4 text-5xl font-black text-emerald-200", children: buildPromptQualityReport(rebuildFinalPrompts(shots), tech, douyinViral).score || "--" }), _jsx("p", { className: "mt-3 text-sm leading-7 text-stone-300", children: buildPromptQualityReport(rebuildFinalPrompts(shots), tech, douyinViral).summaryZh }), _jsx("button", { onClick: handleRunQualityCheck, disabled: !shots.length || isCheckingQuality, className: "mt-5 rounded-2xl bg-emerald-400 px-5 py-3 text-[11px] font-black uppercase text-black disabled:opacity-40", children: "Run Prompt Debug / \u8FD0\u884C\u63D0\u793A\u8BCD\u8BCA\u65AD" })] })] }), projectStudioTab === "delivery" && _jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-3", children: [_jsxs("button", { onClick: () => makeWord(rebuildFinalPrompts(shots), project, script, style, tech, modules), disabled: !shots.length, className: "rounded-3xl border border-amber-300/20 bg-amber-400/10 p-6 text-left text-amber-100 disabled:opacity-40", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em]", children: "Director Script / \u5BFC\u6F14\u5206\u955C" }), _jsx("div", { className: "mt-3 text-lg font-black", children: "Export Word" })] }), _jsxs("button", { onClick: () => downloadPromptPack(rebuildFinalPrompts(shots), project), disabled: !shots.length, className: "rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-6 text-left text-cyan-100 disabled:opacity-40", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em]", children: "Prompt Pack / \u63D0\u793A\u8BCD\u5305" }), _jsx("div", { className: "mt-3 text-lg font-black", children: "Export TXT" })] }), _jsxs("button", { onClick: exportFullProductionKit, className: "rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-6 text-left text-emerald-100", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em]", children: "Full Production Kit / \u5B8C\u6574\u4EA4\u4ED8\u5305" }), _jsx("div", { className: "mt-3 text-lg font-black", children: "Export All" })] })] })] })] }) }), document.body), _jsx("header", { className: "sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-3xl px-6 py-4", children: _jsxs("div", { className: "mx-auto flex max-w-[1800px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(BrandMark, { active: isGenerating, progress: generateProgress }), _jsxs("div", { children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("h1", { className: "text-base font-black uppercase tracking-[0.18em] text-white", children: "\u5317\u6781\u661FAIGC\u7535\u5F71\u7EA7\u5DE5\u4E1A\u7CFB\u7EDF V10.6" }), _jsx("span", { className: "rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200", children: "\u603B\u5DE5\u7A0B\u5E08 \u00B7 Haley\u9EC4\u884D\u8854" })] }), _jsx("div", { className: "mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300/80", children: "PREMIUM MOTION STUDIO V10.6 \u00B7 DEEPSEEK READY \u00B7 VISUAL CANVAS \u00B7 VIDEO AGENT \u00B7 FULL KIT" }), _jsx("div", { className: "mt-1 text-[11px] text-stone-500", children: status }), _jsxs("div", { className: "mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300/70", children: ["Auto Save / \u81EA\u52A8\u4FDD\u5B58\uFF1A", lastSavedAt || "waiting"] })] })] }), apiIsReady && _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [v6ModeCards.map(m => _jsx("button", { onClick: () => switchWorkspaceMode(m.id), className: `polaris-v94-top-mode rounded-2xl border px-4 py-2 text-[11px] font-black uppercase tracking-widest ${workspaceMode === m.id ? "is-active border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"}`, children: m.title }, m.id)), workspaceMode && _jsx("button", { onClick: resetCurrentWorkspace, className: "rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-red-200 hover:bg-red-400/20", children: "Reset Workspace / \u91CD\u7F6E\u5F53\u524D" }), _jsx("button", { onClick: clearLocalWorkspaceCache, className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-stone-300 hover:bg-white/10", children: "Clear Cache / \u6E05\u7A7A\u7F13\u5B58" }), _jsx("button", { onClick: () => setShowClapperboard(true), className: "rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-amber-200 hover:bg-amber-400/20", children: "Clapperboard / \u6253\u677F" }), _jsx("button", { onClick: lockProductionVersion, className: "rounded-2xl border border-purple-400/25 bg-purple-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-purple-200 hover:bg-purple-400/20", children: "Lock Version / \u5C01\u5B58\u7248\u672C" }), _jsx("button", { onClick: () => setProjectStudioOpen(true), className: "rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-cyan-200 hover:bg-cyan-400/20", children: "Project Studio / \u9879\u76EE\u4E2D\u5FC3" }), _jsx("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab("visual"); }, className: "rounded-2xl border border-purple-400/25 bg-purple-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-purple-200 hover:bg-purple-400/20", children: "Visual Studio / \u89C6\u89C9\u524D\u671F" }), _jsx("button", { onClick: openDirectorCanvas, className: "rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-amber-200 hover:bg-amber-400/20", children: "Director Canvas / \u5BFC\u6F14\u753B\u5E03" }), _jsx("button", { onClick: openApiConnectionCenter, className: "rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-emerald-200 hover:bg-emerald-400/20", children: "API Center / \u5207\u6362 API" })] })] }) }), apiIsReady && _jsx("section", { className: "polaris-v992-api-command border-b border-slate-200/70 px-6 py-5", children: _jsx("div", { className: "mx-auto max-w-[1800px]", children: _jsxs("div", { className: "grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_420px]", children: [_jsxs("div", { className: "polaris-v992-command-card rounded-[2rem] p-5", children: [_jsxs("div", { className: "flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "polaris-v992-kicker", children: "DeepSeek Production Cockpit / API \u63A5\u5165\u540E\u521B\u4F5C\u9A7E\u9A76\u8231" }), _jsx("h2", { className: "mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950", children: "\u6309\u771F\u5B9E\u6D41\u7A0B\u5F00\u5DE5\uFF1A\u9700\u6C42 \u2192 \u63D0\u793A\u8BCD \u2192 \u753B\u5E03 \u2192 \u89C6\u9891 \u2192 \u4EA4\u4ED8" }), _jsx("p", { className: "mt-2 max-w-4xl text-sm leading-7 text-slate-600", children: "DeepSeek \u8D1F\u8D23\u6545\u4E8B\u3001\u5206\u955C\u4E0E\u63D0\u793A\u8BCD\u51C6\u5907\uFF1BSeedream \u8D1F\u8D23\u5173\u952E\u5E27\uFF1B\u5373\u68A6 / Seedance \u8D1F\u8D23\u89C6\u9891\u667A\u80FD\u4F53\u4EFB\u52A1\u3002\u6A21\u5F0F\u5207\u6362\u73B0\u5728\u76F4\u63A5\u751F\u6548\uFF0C\u4E0D\u518D\u5F39\u9ED1\u8272\u4EEA\u5F0F\u6846\u3002" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: v6ModeCards.map((m, i) => _jsxs("button", { onClick: () => switchWorkspaceMode(m.id), className: `polaris-v992-mode-chip ${workspaceMode === m.id ? "is-active" : ""}`, children: [_jsxs("span", { children: ["Mode 0", i + 1] }), _jsx("b", { children: m.title })] }, m.id)) })] }), _jsxs("div", { className: "mt-5 grid grid-cols-1 gap-3 md:grid-cols-4", children: [_jsxs("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab("wizard"); }, className: "polaris-v992-action", children: [_jsx("span", { children: "01" }), _jsx("b", { children: "\u9700\u6C42\u4F53\u68C0" }), _jsx("small", { children: "Brief / Reference" })] }), _jsxs("button", { onClick: handlePromptOnlyProduction, disabled: isOneClickRunning || isGenerating, className: "polaris-v992-action", children: [_jsx("span", { children: "02" }), _jsx("b", { children: "\u63D0\u793A\u8BCD\u51C6\u5907" }), _jsx("small", { children: "DeepSeek Prompt Prep" })] }), _jsxs("button", { onClick: openDirectorCanvas, className: "polaris-v992-action is-primary", children: [_jsx("span", { children: "03" }), _jsx("b", { children: "\u65E0\u9650\u753B\u5E03" }), _jsx("small", { children: "Image / Video Canvas" })] }), _jsxs("button", { onClick: handleFullVisualProduction, disabled: isOneClickRunning || isGenerating, className: "polaris-v992-action", children: [_jsx("span", { children: "04" }), _jsx("b", { children: "\u5B8C\u6574\u751F\u4EA7" }), _jsx("small", { children: "Prompt + Keyframe" })] })] })] }), _jsxs("div", { className: "polaris-v992-snapshot rounded-[2rem] p-5", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("div", { className: "polaris-v992-kicker", children: "Project Snapshot / \u9879\u76EE\u72B6\u6001" }), _jsx("div", { className: "mt-2 text-xl font-black text-slate-950", children: project })] }), _jsx("div", { className: "polaris-v992-online", children: "API Ready" })] }), _jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "polaris-v992-stat", children: [_jsx("small", { children: "Mode" }), _jsx("b", { children: workspaceMode || "-" })] }), _jsxs("div", { className: "polaris-v992-stat", children: [_jsx("small", { children: "Shots" }), _jsx("b", { children: shots.length })] }), _jsxs("div", { className: "polaris-v992-stat", children: [_jsx("small", { children: "Keyframes" }), _jsxs("b", { children: [Object.values(shotKeyframes).filter(x => x?.images?.length).length, "/", shots.length || 0] })] }), _jsxs("div", { className: "polaris-v992-stat", children: [_jsx("small", { children: "Videos" }), _jsx("b", { children: Object.values(shotVideos).filter(x => x?.videoUrl).length })] })] }), _jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2", children: [_jsx("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab("shots"); }, className: "polaris-v992-mini-btn", children: "\u5206\u955C\u5361\u7247" }), _jsx("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab("prompt"); }, className: "polaris-v992-mini-btn", children: "\u63D0\u793A\u8BCD\u5F15\u64CE" }), _jsx("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab("visual"); }, className: "polaris-v992-mini-btn", children: "\u89C6\u89C9\u524D\u671F" }), _jsx("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab("delivery"); }, className: "polaris-v992-mini-btn", children: "\u4EA4\u4ED8\u4E2D\u5FC3" })] })] })] }) }) }), apiIsReady && workspaceMode === "director" && _jsx("div", { className: "polaris-v992-director-strip border-b border-slate-200/70 px-6 py-3", children: _jsxs("div", { className: "mx-auto flex max-w-[1800px] flex-wrap items-center gap-3 text-[12px] font-black", children: [_jsx("span", { children: "Director Deck Online / \u5BFC\u6F14\u53F0\u5728\u7EBF" }), _jsxs("span", { children: ["Script: ", script?.trim() ? "Locked" : "Draft"] }), _jsxs("span", { children: ["Shot Plan: ", shotPlanRows.length ? "Ready" : "Pending"] }), _jsxs("span", { children: ["Prompts: ", shots.length ? "Live" : "Waiting"] }), _jsxs("span", { children: ["Engineer: ", ENGINEER_NAME] }), lastArchiveId && _jsxs("span", { children: ["Archive: ", lastArchiveId] })] }) }), _jsx("main", { className: `mx-auto max-w-[1800px] ${compact ? "px-5 py-6" : "px-6 py-8"}`, children: children }), _jsxs("footer", { className: "mx-auto max-w-[1800px] px-6 pb-8 text-center text-[10px] font-black uppercase tracking-[0.22em] text-stone-700", children: ["Powered by \u5317\u6781\u661FAIGC\u7535\u5F71\u7EA7\u5DE5\u4E1A\u7CFB\u7EDF V10.6 Canvas Model Camera Workflow Pro \u00B7 Chief Engineer: ", ENGINEER_NAME, " \u00B7 ", AUTH_SEAL_ID] })] });
    const flowHasInput = Boolean(ideaInput || referenceUrl || referenceManualContent || script);
    const flowHasPromptPrep = Boolean(outlineDraft || script || shots?.length);
    const flowHasShots = Boolean(shots?.length);
    const flowHasImages = Boolean(Object.values(shotKeyframes || {}).some(x => x?.images?.length));
    const flowHasVideoTasks = Boolean(Object.values(shotVideos || {}).some(x => x?.taskId || x?.videoUrl));
    const flowHasVideosDone = Boolean(Object.values(shotVideos || {}).some(x => x?.videoUrl));
    const flowFlags = [apiIsReady, flowHasInput, flowHasPromptPrep, flowHasShots, flowHasImages, flowHasVideoTasks || flowHasVideosDone];
    const flowProgressPercent = Math.round((flowFlags.filter(Boolean).length / flowFlags.length) * 100);
    const scrollToHomeCard = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    const nextBestAction = !apiIsReady
        ? { title: "先连接 API", desc: "DeepSeek 负责提示词和分镜，Seedream 负责关键帧，即梦 / Seedance 负责视频任务。", cta: "连接 API", action: () => scrollToHomeCard("polaris-api-card"), tone: "slate" }
        : !flowHasInput
            ? { title: "填写项目需求", desc: "先写项目名称、一句话需求、参考链接或剧本文档，系统才能进入提示词准备。", cta: "去填写需求", action: () => scrollToHomeCard("polaris-prep-card"), tone: "violet" }
            : !flowHasPromptPrep
                ? { title: "生成大纲与提示词准备", desc: "把素材整理成故事核、分镜语义和可执行提示词，这是你的特色能力。", cta: "生成大纲", action: handleGenerateOutline, tone: "cyan" }
                : !flowHasShots
                    ? { title: "生成分镜卡片", desc: "把提示词准备结果转成逐镜头资产，后续画布会按镜头生成图像和视频。", cta: "生成分镜", action: handleGenerate, tone: "cyan" }
                    : !flowHasImages
                        ? { title: "进入图像画布", desc: "先为镜头生成 Seedream 关键帧，再进行角色、场景与风格锁定。", cta: "批量生图", action: () => handleGenerateAllShotKeyframes(rebuildFinalPrompts(shots || []), { skipConfirm: false }), tone: "violet" }
                        : !flowHasVideoTasks
                            ? { title: "提交视频智能体任务", desc: "把关键帧和视频提示词提交给即梦 / Seedance / 自定义智能体。", cta: "生成视频", action: handleGenerateAllShotVideos, tone: "emerald" }
                            : { title: flowHasVideosDone ? "导出交付包" : "查询视频状态", desc: flowHasVideosDone ? "视频已有结果，可以导出 Prompt Pack、I2V 包和完整工程。" : "视频任务已提交，继续查询任务状态直到出现视频结果。", cta: flowHasVideosDone ? "导出交付" : "查询状态", action: flowHasVideosDone ? exportFullProductionKit : handlePollAllVideoTasks, tone: flowHasVideosDone ? "emerald" : "amber" };
    // V9.1：产品首页按真实用户任务流重构。提示词是前置准备，画布负责图像、视频、任务状态和交付。
    if (!workspaceMode || !apiIsReady) {
        return PolarisShell({ compact: true, children: _jsxs(_Fragment, { children: [_jsx("section", { className: "overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/70 md:p-4", children: _jsxs("div", { className: "polaris-hero-panel polaris-v92-hero-dynamic relative overflow-hidden rounded-[2.5rem] px-5 py-7 md:px-10 md:py-10", children: [_jsx("div", { className: "absolute right-6 top-6 hidden rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-black text-slate-700 shadow-sm backdrop-blur-xl lg:block", children: "Visual Production OS \u00B7 V10.6" }), _jsxs("div", { className: "relative z-10 grid gap-8 2xl:grid-cols-[1.05fr_.95fr] 2xl:items-center", children: [_jsxs("div", { children: [_jsx("div", { className: "inline-flex rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-sm font-black text-violet-700 shadow-sm backdrop-blur-xl", children: "Prompt Prep \u2192 Image Canvas \u2192 Video Agent \u2192 Delivery" }), _jsx("h1", { className: "polaris-main-title mt-6 max-w-6xl text-5xl leading-[0.96] md:text-7xl", children: "\u4E00\u4E2A\u628A\u63D0\u793A\u8BCD\u3001\u56FE\u50CF\u3001\u89C6\u9891\u4E32\u8D77\u6765\u7684 AI \u5F71\u89C6\u751F\u4EA7\u5E73\u53F0\u3002" }), _jsx("p", { className: "polaris-help-text mt-6 max-w-4xl text-lg", children: "\u7528\u6237\u6309\u771F\u5B9E\u5236\u4F5C\u6D41\u7A0B\u8D70\uFF1A\u8F93\u5165\u9700\u6C42 \u2192 \u63D0\u793A\u8BCD\u51C6\u5907 \u2192 \u5206\u955C \u2192 \u56FE\u50CF\u753B\u5E03 \u2192 \u89C6\u9891\u667A\u80FD\u4F53 \u2192 \u4EA4\u4ED8\u3002\u63D0\u793A\u8BCD\u662F\u4F60\u7684\u7279\u8272\u80FD\u529B\uFF0C\u753B\u5E03\u662F\u6700\u7EC8\u751F\u4EA7\u4E2D\u5FC3\u3002" }), _jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [!apiIsReady ? _jsx("button", { onClick: () => document.getElementById("polaris-api-card")?.scrollIntoView({ behavior: "smooth", block: "center" }), className: "polaris-primary-button polaris-big-button font-black", children: "\u8FDE\u63A5 API \u5F00\u59CB\u521B\u4F5C" }) : _jsx("button", { onClick: handleFullVisualProduction, disabled: isOneClickRunning || isGenerating, className: "polaris-purple-button polaris-big-button font-black disabled:opacity-50", children: "\u4E00\u952E\u5B8C\u6210\u63D0\u793A\u8BCD + \u56FE\u50CF\u6D41\u7A0B" }), _jsx("button", { onClick: handlePromptOnlyProduction, disabled: !apiIsReady || isOneClickRunning || isGenerating, className: "polaris-readable-button polaris-big-button font-black disabled:opacity-50", children: "\u53EA\u505A\u63D0\u793A\u8BCD\u51C6\u5907" }), _jsx("button", { onClick: openDirectorCanvas, disabled: !apiIsReady, className: "polaris-cyan-button polaris-big-button font-black disabled:opacity-50", children: "\u6253\u5F00\u89C6\u89C9\u753B\u5E03" }), _jsx("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab("workflow"); }, className: "polaris-readable-button polaris-big-button font-black", children: "\u5B8C\u6574\u9AD8\u7EA7\u5DE5\u4F5C\u6D41" })] })] }), _jsxs("div", { className: "polaris-glass-card rounded-[2.5rem] p-5", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("div", { className: "polaris-section-title", children: "Product Entry / \u4EA7\u54C1\u5165\u53E3" }), _jsx("div", { className: "mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950", children: "\u50CF\u5E73\u53F0\u9996\u9875\u4E00\u6837\u8FDB\u5165\u529F\u80FD" })] }), _jsx("div", { className: `rounded-full px-4 py-2 text-sm font-black ${apiIsReady ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`, children: apiIsReady ? "API Ready" : "Need API" })] }), _jsx("div", { className: "mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
                                                        { title: "漫剧 / 短片制作", en: "Story Production", body: "大纲、人物、钩子、分镜规划", action: () => { if (apiIsReady) {
                                                                switchWorkspaceMode("pro");
                                                                setProStep("script");
                                                            }
                                                            else
                                                                scrollToHomeCard("polaris-api-card"); } },
                                                        { title: "提示词准备", en: "Prompt Prep", body: "把原有提示词能力变成前置工作流", action: () => document.getElementById("polaris-prep-card")?.scrollIntoView({ behavior: "smooth", block: "center" }) },
                                                        { title: "AI 图像画布", en: "Image Canvas", body: "Seedream 关键帧、角色和场景锁定", action: () => { if (apiIsReady)
                                                                openDirectorCanvas();
                                                            else
                                                                scrollToHomeCard("polaris-api-card"); } },
                                                        { title: "AI 视频智能体", en: "Video Agent", body: "即梦 / Seedance 生视频与任务查询", action: () => document.getElementById("polaris-video-api-card")?.scrollIntoView({ behavior: "smooth", block: "center" }) },
                                                    ].map(item => _jsxs("button", { onClick: item.action, className: "group rounded-[2rem] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl", children: [_jsx("div", { className: "text-2xl font-black text-slate-950", children: item.title }), _jsx("div", { className: "mt-2 text-sm font-black uppercase tracking-widest text-violet-500", children: item.en }), _jsx("p", { className: "mt-4 text-base leading-7 text-slate-500", children: item.body }), _jsx("div", { className: "mt-5 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 group-hover:bg-violet-50 group-hover:text-violet-700", children: "\u8FDB\u5165 / Open" })] }, item.title)) })] }), _jsx(RitualMotionDeck, { apiIsReady: apiIsReady, flowProgressPercent: flowProgressPercent, imageCount: Object.values(shotKeyframes || {}).filter(x => x?.images?.length).length, taskCount: Object.values(shotVideos || {}).filter(x => x?.taskId).length, videoCount: Object.values(shotVideos || {}).filter(x => x?.videoUrl).length, onIgnite: () => { setRitualOverlay({ kicker: "POLARIS STUDIO GATE", title: "开机仪式已启动", message: "系统将按当前状态进入下一步：先提示词准备，再图像关键帧，最后视频智能体与交付。", progress: flowProgressPercent }); window.setTimeout(() => nextBestAction.action?.(), 180); }, onCanvas: openDirectorCanvas })] })] }) }), _jsx("section", { id: "polaris-flow-card", className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6", children: [
                            ["01", "输入", "需求 / 参考", Boolean(ideaInput || referenceUrl || script)],
                            ["02", "提示词", "大纲 / 镜头语义", Boolean(outlineDraft || script)],
                            ["03", "分镜", "镜头 / 连续性", Boolean(shots?.length)],
                            ["04", "生图", "Seedream 关键帧", Boolean(Object.values(shotKeyframes || {}).some(x => x?.images?.length))],
                            ["05", "视频", "即梦 / Seedance", Boolean(Object.values(shotVideos || {}).some(x => x?.taskId || x?.videoUrl))],
                            ["06", "交付", "导出 / 客户包", Boolean(lastArchiveId || shotVideos && Object.keys(shotVideos).length)],
                        ].map(([no, title, sub, ready]) => _jsxs("div", { className: `polaris-step-pill rounded-[2rem] p-5 ${ready ? "ring-2 ring-emerald-100" : ""}`, children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("div", { className: "text-sm font-black uppercase tracking-[0.24em] text-violet-500", children: no }), _jsx("div", { className: `rounded-full px-3 py-1 text-xs font-black ${ready ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`, children: ready ? "DONE" : "NEXT" })] }), _jsx("div", { className: "mt-3 text-2xl font-black text-slate-950", children: title }), _jsx("div", { className: "mt-1 text-sm font-black text-cyan-600", children: sub })] }, no)) }), _jsx(RitualMotionStrip, { apiIsReady: apiIsReady, flowHasInput: flowHasInput, flowHasPromptPrep: flowHasPromptPrep, flowHasShots: flowHasShots, flowHasImages: flowHasImages, flowHasVideoTasks: flowHasVideoTasks, flowHasVideosDone: flowHasVideosDone }), _jsx("section", { className: "polaris-v91-command-card polaris-v92-ceremony-card mt-6 rounded-[2.4rem] p-5 md:p-6", children: _jsxs("div", { className: "grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center", children: [_jsxs("div", { children: [_jsx("div", { className: "polaris-section-title", children: "Smart Next Action / \u5F53\u524D\u5EFA\u8BAE\u64CD\u4F5C" }), _jsx("h3", { className: "mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950", children: nextBestAction.title }), _jsx("p", { className: "mt-2 max-w-4xl text-base leading-8 text-slate-600", children: nextBestAction.desc }), _jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [_jsxs("span", { className: "polaris-v91-flow-chip", children: ["API ", apiIsReady ? "Ready" : "Off"] }), _jsxs("span", { className: "polaris-v91-flow-chip", children: ["Shots ", shots?.length || 0] }), _jsxs("span", { className: "polaris-v91-flow-chip", children: ["Images ", Object.values(shotKeyframes || {}).filter(x => x?.images?.length).length] }), _jsxs("span", { className: "polaris-v91-flow-chip", children: ["Videos ", Object.values(shotVideos || {}).filter(x => x?.videoUrl).length] })] }), _jsx("div", { className: "polaris-v91-progress-track mt-5", children: _jsx("div", { className: "polaris-v91-progress-fill", style: { width: `${flowProgressPercent}%` } }) }), _jsxs("div", { className: "mt-2 text-sm font-black text-slate-500", children: ["Workflow Progress / \u6D41\u7A0B\u8FDB\u5EA6\uFF1A", flowProgressPercent, "%"] })] }), _jsx("button", { onClick: nextBestAction.action, disabled: isGenerating || isOneClickRunning || isGeneratingKeyframes || isGeneratingVideos, className: `polaris-big-button font-black ${nextBestAction.tone === "emerald" ? "polaris-green-button" : nextBestAction.tone === "violet" ? "polaris-purple-button" : nextBestAction.tone === "amber" ? "polaris-readable-button" : "polaris-cyan-button"} disabled:opacity-50`, children: nextBestAction.cta })] }) }), _jsxs("section", { className: "mt-6 rounded-[2.2rem] border border-slate-200 bg-white p-5 shadow-sm", children: [_jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "polaris-section-title text-slate-500", children: "V10.6 Flow QA / \u9875\u9762\u8D28\u68C0" }), _jsx("h3", { className: "mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950", children: "\u5DF2\u628A\u5BB9\u6613\u51FA\u9519\u7684\u64CD\u4F5C\u6536\u6210 6 \u4E2A\u56FA\u5B9A\u6B65\u9AA4\u3002" })] }), _jsx("div", { className: "rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-600", children: "\u6309\u94AE\u9AD8\u5BF9\u6BD4 \u00B7 \u6D45\u8272\u4EA7\u54C1\u9875 \u00B7 \u89C6\u9891\u4EFB\u52A1\u53EF\u8FFD\u8E2A" })] }), _jsx("div", { className: "polaris-qa-strip mt-5", children: [
                                    ["01", "API", apiIsReady ? "已连接" : "待连接", apiIsReady ? "done" : "active"],
                                    ["02", "需求", ideaInput || referenceUrl || script ? "已填写" : "待填写", ideaInput || referenceUrl || script ? "done" : ""],
                                    ["03", "提示词", outlineDraft || script ? "可生产" : "待生成", outlineDraft || script ? "done" : ""],
                                    ["04", "分镜", shots?.length ? `${shots.length} 镜` : "待生成", shots?.length ? "done" : ""],
                                    ["05", "生图", Object.values(shotKeyframes || {}).some(x => x?.images?.length) ? "有关键帧" : "待生图", Object.values(shotKeyframes || {}).some(x => x?.images?.length) ? "done" : ""],
                                    ["06", "视频", Object.values(shotVideos || {}).some(x => x?.taskId || x?.videoUrl) ? "有任务" : "待提交", Object.values(shotVideos || {}).some(x => x?.taskId || x?.videoUrl) ? "done" : ""],
                                ].map(([no, title, desc, state]) => _jsx("div", { className: `polaris-qa-step ${state}`, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "num", children: no }), _jsxs("div", { children: [_jsx("div", { className: "text-base font-black text-slate-950", children: title }), _jsx("div", { className: "text-sm font-bold text-slate-500", children: desc })] })] }) }, no)) })] }), _jsxs("section", { className: "mt-6 grid grid-cols-1 gap-6 2xl:grid-cols-[440px_minmax(0,1fr)]", children: [_jsxs("aside", { className: "space-y-5", children: [_jsxs("div", { id: "polaris-prep-card", className: "polaris-glass-card rounded-[2.2rem] p-6", children: [_jsx("div", { className: "polaris-section-title", children: "01 Prompt Prep / \u524D\u7F6E\u51C6\u5907" }), _jsx("h2", { className: "polaris-main-title mt-2 text-3xl", children: "\u5148\u628A\u7D20\u6750\u53D8\u6210\u53EF\u751F\u4EA7\u7684\u955C\u5934\u3002" }), _jsx("p", { className: "polaris-help-text mt-3 text-sm", children: "\u7528\u6237\u53EA\u9700\u8981\u5148\u586B\u201C\u9879\u76EE\u540D\u79F0 + \u9700\u6C42 + \u53C2\u8003\u201D\u3002\u590D\u6742\u5BFC\u6F14\u53C2\u6570\u5148\u9690\u85CF\u5230\u9AD8\u7EA7\u5DE5\u4F5C\u6D41\u91CC\uFF0C\u907F\u514D\u7B2C\u4E00\u5C4F\u5413\u9000\u7528\u6237\u3002" }), _jsxs("div", { className: "mt-5 space-y-4", children: [_jsx(FormField, { label: "Project Name", zh: "\u9879\u76EE\u540D\u79F0", children: _jsx(Input, { value: project, onChange: e => setProject(e.target.value), placeholder: "\u4F8B\u5982\uFF1A\u5496\u5561\u8F66 520 \u5BA3\u4F20\u77ED\u7247" }) }), _jsx(FormField, { label: "Creative Requirement", zh: "\u4E00\u53E5\u8BDD\u521B\u4F5C\u9700\u6C42", children: _jsx(TextArea, { value: ideaInput, onChange: e => setIdeaInput(e.target.value), rows: 5, className: "min-h-[150px] text-base", placeholder: "\u4F8B\u5982\uFF1A\u505A\u4E00\u4E2A 30 \u79D2\u5496\u5561\u8F66\u5BA3\u4F20\u89C6\u9891\uFF0C\u8981\u9AD8\u7EA7\u3001\u6CBB\u6108\u3001\u8857\u5934\u611F\u3001\u9002\u5408\u5C0F\u7EA2\u4E66\u4F20\u64AD\u3002" }) }), _jsx(FormField, { label: "Reference Link", zh: "\u53C2\u8003\u94FE\u63A5", children: _jsx(Input, { value: referenceUrl, onChange: e => setReferenceUrl(e.target.value), placeholder: "\u7C98\u8D34\u89C6\u9891\u53F7 / \u6296\u97F3 / \u5C0F\u7EA2\u4E66 / B\u7AD9 / \u7F51\u9875\u94FE\u63A5" }) }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(FormField, { label: "Duration", zh: "\u65F6\u957F", children: _jsx(Select, { items: OPT.videoDurations, value: tech.videoDuration, onChange: v => setTech(p => ({ ...p, videoDuration: v })) }) }), _jsx(FormField, { label: "Ratio", zh: "\u753B\u5E45", children: _jsx(Select, { items: OPT.ratios, value: tech.ratio, onChange: v => setTech(p => ({ ...p, ratio: v })) }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx("button", { onClick: handleIngestReference, disabled: (!referenceUrl && !referenceManualContent) || isIngestingReference, className: "polaris-readable-button polaris-compact-button font-black disabled:opacity-50", children: "\u8BC6\u522B\u53C2\u8003" }), _jsx("button", { onClick: handleGenerateOutline, disabled: !apiIsReady || isGeneratingOutline, className: "polaris-readable-button polaris-compact-button font-black disabled:opacity-50", children: "\u751F\u6210\u5927\u7EB2" }), _jsx("button", { onClick: handleGenerateShotPlan, disabled: !apiIsReady || isPlanningShots, className: "polaris-readable-button polaris-compact-button font-black disabled:opacity-50", children: "\u5206\u955C\u89C4\u5212" }), _jsx("button", { onClick: handleGenerate, disabled: !apiIsReady || isGenerating, className: "polaris-cyan-button polaris-compact-button font-black disabled:opacity-50", children: "\u751F\u6210\u5206\u955C" })] }), _jsx("button", { onClick: handlePromptOnlyProduction, disabled: !apiIsReady || isOneClickRunning || isGenerating, className: "polaris-primary-button w-full rounded-2xl px-5 py-4 text-base font-black disabled:opacity-50", children: "\u4E00\u952E\u5B8C\u6210\u63D0\u793A\u8BCD\u51C6\u5907" })] })] }), _jsxs("div", { id: "polaris-api-card", className: "polaris-glass-card rounded-[2.2rem] p-6", children: [_jsx("div", { className: "polaris-section-title text-emerald-600", children: "Engine Center / \u5F15\u64CE\u8FDE\u63A5" }), _jsx("h3", { className: "mt-2 text-2xl font-black text-slate-950", children: "\u5148\u8FDE DeepSeek\uFF0C\u518D\u8FDB\u5165\u751F\u4EA7\u3002" }), _jsxs("div", { className: "mt-4 space-y-4", children: [_jsx(FormField, { label: "API Mode", zh: "\u63A5\u53E3\u6A21\u5F0F", children: _jsx("div", { className: "grid grid-cols-2 gap-3", children: ["direct", "proxy"].map(m => _jsxs("button", { onClick: () => setApiMode(m), className: `rounded-2xl border px-4 py-3 text-left text-sm font-black ${apiMode === m ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-700"}`, children: [m, _jsx("div", { className: "mt-1 text-xs font-bold text-slate-500", children: m === "direct" ? "前端输入 Key" : "后端代理推荐" })] }, m)) }) }), _jsx(FormField, { label: "DeepSeek Model", zh: "\u6A21\u578B", children: _jsx(Select, { items: DEEPSEEK_V4_MODELS, value: selectedModel, onChange: setSelectedModel }) }), apiMode === "direct" && _jsx(FormField, { label: "DeepSeek API Key", zh: "\u5BC6\u94A5", children: _jsx(Input, { type: "password", value: apiKey, onChange: e => setApiKey(e.target.value), placeholder: "sk-..." }) }), _jsx("button", { onClick: handleTestApi, className: "polaris-green-button w-full rounded-2xl px-5 py-4 text-base font-black", children: "Test API / \u8FDE\u63A5\u5F15\u64CE" }), _jsxs("div", { className: `rounded-2xl border p-4 text-sm leading-6 ${apiIsReady ? "polaris-ready-note" : "polaris-danger-note"}`, children: ["Status: ", apiLog.status || "idle", _jsx("br", {}), "Model: ", apiLog.lastModel || selectedModel, _jsx("br", {}), apiLog.message] })] })] }), _jsxs("div", { id: "polaris-video-api-card", className: "polaris-glass-card rounded-[2.2rem] p-6", children: [_jsx("div", { className: "polaris-section-title text-fuchsia-600", children: "AI Video Agent / \u89C6\u9891\u667A\u80FD\u4F53" }), _jsx("h3", { className: "mt-2 text-2xl font-black text-slate-950", children: "\u5373\u68A6 / Seedance \u89C6\u9891\u751F\u6210\u63A5\u53E3" }), _jsx("p", { className: "polaris-help-text mt-2 text-sm", children: "\u753B\u5E03\u91CC\u6BCF\u4E2A\u955C\u5934\u90FD\u53EF\u4EE5\u8D70\uFF1A\u5173\u952E\u5E27 \u2192 \u89C6\u9891\u8DEF\u7EBF \u2192 \u751F\u89C6\u9891 \u2192 \u67E5\u72B6\u6001 \u2192 \u9884\u89C8\u3002" }), _jsxs("div", { className: "mt-4 space-y-3", children: [_jsx(FormField, { label: "Provider", zh: "\u89C6\u9891\u63A5\u53E3", children: _jsx(Select, { items: OPT.videoApiProviders, value: videoApiSettings.provider, onChange: v => setVideoApiSettings(p => ({ ...p, provider: v })) }) }), _jsx(FormField, { label: "Model / Agent", zh: "\u6A21\u578B\u6216\u667A\u80FD\u4F53", children: _jsx(Input, { value: videoApiSettings.model, onChange: e => setVideoApiSettings(p => ({ ...p, model: e.target.value })) }) }), _jsx(FormField, { label: "Endpoint", zh: "\u4EE3\u7406\u5730\u5740", children: _jsx(Input, { value: videoApiSettings.endpoint, onChange: e => setVideoApiSettings(p => ({ ...p, endpoint: e.target.value })), placeholder: "/api/video-generate" }) }), _jsxs("div", { className: "grid grid-cols-3 gap-2", children: [_jsx(FormField, { label: "Quality", zh: "\u6E05\u6670\u5EA6", children: _jsx(Select, { items: OPT.videoApiResolutions, value: videoApiSettings.resolution, onChange: v => setVideoApiSettings(p => ({ ...p, resolution: v })) }) }), _jsx(FormField, { label: "Seconds", zh: "\u79D2\u6570", children: _jsx(Select, { items: OPT.videoApiDurations, value: String(videoApiSettings.duration), onChange: v => setVideoApiSettings(p => ({ ...p, duration: v })) }) }), _jsx(FormField, { label: "Ratio", zh: "\u6BD4\u4F8B", children: _jsx(Select, { items: OPT.videoApiRatios, value: videoApiSettings.ratio, onChange: v => setVideoApiSettings(p => ({ ...p, ratio: v })) }) })] })] })] })] }), _jsx("main", { className: "min-w-0 rounded-[2.5rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6", children: (() => {
                                    const preparedShots = rebuildFinalPrompts(shots || []);
                                    const imageCount = Object.values(shotKeyframes || {}).filter(x => x?.images?.length).length;
                                    const taskCount = Object.values(shotVideos || {}).filter(x => x?.taskId).length;
                                    const finishedVideoCount = Object.values(shotVideos || {}).filter(x => x?.videoUrl).length;
                                    const nextTip = !apiIsReady ? "先连接 DeepSeek API" : !preparedShots.length ? "先在左侧生成分镜" : imageCount < preparedShots.length ? "下一步：批量生成关键帧" : !videoModelRouting.length ? "下一步：生成视频路线" : taskCount < preparedShots.length ? "下一步：提交视频任务" : "下一步：查询状态并导出交付包";
                                    return _jsxs(_Fragment, { children: [_jsxs("div", { className: "flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "polaris-section-title text-cyan-600", children: "02 Visual Production Canvas / \u56FE\u50CF\u89C6\u9891\u753B\u5E03" }), _jsx("h2", { className: "polaris-main-title mt-2 text-4xl", children: "\u4E3B\u6218\u573A\uFF1A\u955C\u5934\u8D44\u4EA7\u751F\u4EA7\u770B\u677F\u3002" }), _jsx("p", { className: "polaris-help-text mt-3 max-w-5xl text-base", children: "\u8FD9\u91CC\u4E0D\u518D\u53EA\u662F\u5C55\u793A\u63D0\u793A\u8BCD\uFF0C\u800C\u662F\u628A\u6BCF\u4E2A Shot \u5F53\u4F5C\u4E00\u4E2A\u53EF\u751F\u4EA7\u8D44\u4EA7\uFF1A\u5148\u751F\u56FE\uFF0C\u518D\u9501\u5B9A\u89C6\u89C9\uFF0C\u518D\u63D0\u4EA4\u5373\u68A6 / Seedance \u89C6\u9891\u4EFB\u52A1\uFF0C\u6700\u540E\u67E5\u770B\u89C6\u9891\u7ED3\u679C\u3002" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[560px]", children: [_jsx(MiniStat, { label: "Shots", value: preparedShots.length, tone: "cyan" }), _jsx(MiniStat, { label: "Images", value: `${imageCount}/${preparedShots.length || 0}`, tone: "purple" }), _jsx(MiniStat, { label: "Tasks", value: `${taskCount}/${preparedShots.length || 0}`, tone: "amber" }), _jsx(MiniStat, { label: "Videos", value: `${finishedVideoCount}/${preparedShots.length || 0}`, tone: "emerald" })] })] }), _jsx("div", { className: "mt-5 rounded-[2rem] border border-violet-100 bg-violet-50/70 p-4", children: _jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-sm font-black text-violet-700", children: ["\u5F53\u524D\u5EFA\u8BAE\uFF1A", nextTip] }), _jsx("div", { className: "mt-1 text-sm text-slate-600", children: "\u6309\u94AE\u6309\u6D41\u7A0B\u4ECE\u5DE6\u5230\u53F3\u6392\u5217\uFF0C\u907F\u514D\u7528\u6237\u4E0D\u77E5\u9053\u4E0B\u4E00\u6B65\u70B9\u54EA\u91CC\u3002" })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { onClick: () => handleGenerateAllShotKeyframes(preparedShots, { skipConfirm: false }), disabled: !preparedShots.length || isGeneratingKeyframes, className: "polaris-cyan-button polaris-compact-button font-black disabled:opacity-50", children: "\u6279\u91CF\u751F\u56FE" }), _jsx("button", { onClick: handleBuildVideoModelRouter, disabled: !preparedShots.length, className: "polaris-purple-button polaris-compact-button font-black disabled:opacity-50", children: "\u89C6\u9891\u8DEF\u7EBF" }), _jsx("button", { onClick: handleGenerateAllShotVideos, disabled: !preparedShots.length || isGeneratingVideos, className: "polaris-green-button polaris-compact-button font-black disabled:opacity-50", children: "\u6279\u91CF\u751F\u89C6\u9891" }), _jsx("button", { onClick: handlePollAllVideoTasks, disabled: !Object.values(shotVideos || {}).some(v => v?.taskId), className: "polaris-readable-button polaris-compact-button font-black disabled:opacity-50", children: "\u67E5\u8BE2\u72B6\u6001" }), _jsx("button", { onClick: openDirectorCanvas, disabled: !apiIsReady, className: "polaris-readable-button polaris-compact-button font-black disabled:opacity-50", children: "\u5168\u5C4F\u753B\u5E03" })] })] }) }), _jsx("div", { className: "polaris-soft-scroll mt-6 max-h-[calc(100dvh-260px)] min-h-[560px] overflow-y-auto pr-1", children: _jsx("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3", children: preparedShots.length ? preparedShots.map((s, i) => {
                                                        const key = String(s.id || i + 1);
                                                        const k = shotKeyframes?.[key] || {};
                                                        const hero = (k.images || [])[Number(k.selectedIndex || 0)] || null;
                                                        const route = videoModelRouting.find(r => Number(r.shotIndex) === i + 1);
                                                        const video = shotVideos?.[key] || {};
                                                        const videoReady = Boolean(video.videoUrl);
                                                        const state = videoReady ? "VIDEO DONE" : video.taskId ? "VIDEO TASK" : hero ? "IMAGE READY" : "SHOT DRAFT";
                                                        return _jsxs("div", { className: `polaris-asset-card rounded-[2rem] p-4 transition hover:-translate-y-0.5 hover:shadow-xl ${activeShot === i ? "ring-4 ring-violet-100" : ""}`, children: [_jsx("div", { className: "aspect-video overflow-hidden rounded-3xl border border-slate-200 bg-slate-100", children: videoReady ? _jsx("video", { src: video.videoUrl, controls: true, className: "h-full w-full object-cover" }) : hero ? _jsx("img", { src: frameImageSrc(hero), className: "h-full w-full object-cover" }) : _jsxs("div", { className: "grid h-full place-items-center p-5 text-center text-sm font-black text-slate-400", children: ["No Image Yet", _jsx("br", {}), "\u5148\u751F\u6210\u5173\u952E\u5E27"] }) }), _jsxs("div", { className: "mt-4 flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-sm font-black uppercase tracking-widest text-violet-500", children: ["Shot ", i + 1] }), _jsx("div", { className: "mt-1 line-clamp-2 text-xl font-black text-slate-950", children: s.titleZh || s.titleEn || "Untitled Shot" })] }), _jsx("div", { className: `shrink-0 rounded-full px-3 py-1 text-xs font-black ${videoReady ? "bg-emerald-100 text-emerald-700" : video.taskId ? "bg-amber-100 text-amber-700" : hero ? "bg-cyan-100 text-cyan-700" : "bg-slate-100 text-slate-500"}`, children: state })] }), _jsx("p", { className: "mt-3 line-clamp-3 text-sm leading-6 text-slate-500", children: s.sceneZh || s.sceneEn || s.keyframeMomentZh }), _jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2", children: [_jsx("button", { onClick: () => { setActiveShot(i); handleGenerateShotKeyframe(i); }, disabled: isGeneratingKeyframes, className: "polaris-cyan-button rounded-2xl px-3 py-3 text-sm font-black disabled:opacity-50", children: "\u751F\u56FE" }), _jsx("button", { onClick: () => { setActiveShot(i); handleGenerateShotVideo(i); }, disabled: isGeneratingVideos, className: "polaris-green-button rounded-2xl px-3 py-3 text-sm font-black disabled:opacity-50", children: "\u751F\u89C6\u9891" }), _jsx("button", { onClick: () => { setActiveShot(i); handleBuildVideoModelRouter(); }, className: "polaris-purple-button rounded-2xl px-3 py-3 text-sm font-black", children: "\u8DEF\u7EBF" }), _jsx("button", { onClick: () => pollVideoTask(key), disabled: !video.taskId, className: "polaris-readable-button rounded-2xl px-3 py-3 text-sm font-black disabled:opacity-50", children: "\u67E5\u72B6\u6001" })] }), _jsxs("div", { className: "mt-3 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-500", children: [route ? `推荐：${route.model} · ${route.reasonZh || route.reason || "已生成视频路线"}` : "待生成视频路线", video.taskId ? `\nTask: ${video.taskId} · ${video.status || "submitted"}` : ""] })] }, key);
                                                    }) : _jsxs("div", { className: "col-span-full rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-12 text-center", children: [_jsx("div", { className: "text-4xl font-black tracking-[-0.04em] text-slate-950", children: "\u8FD8\u6CA1\u6709\u955C\u5934\u8D44\u4EA7" }), _jsx("p", { className: "mx-auto mt-3 max-w-2xl text-base leading-8 text-slate-500", children: "\u5148\u5728\u5DE6\u4FA7\u586B\u5199\u9879\u76EE\u9700\u6C42\u5E76\u751F\u6210\u5206\u955C\u3002\u751F\u6210\u540E\uFF0C\u8FD9\u91CC\u4F1A\u53D8\u6210\u53EF\u751F\u56FE\u3001\u53EF\u751F\u89C6\u9891\u3001\u53EF\u67E5\u8BE2\u4EFB\u52A1\u72B6\u6001\u7684\u89C6\u89C9\u751F\u4EA7\u753B\u5E03\u3002" }), _jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-3", children: [_jsx("button", { onClick: handleGenerate, disabled: !apiIsReady || isGenerating, className: "polaris-primary-button rounded-2xl px-6 py-4 text-sm font-black disabled:opacity-50", children: "Generate Storyboard / \u751F\u6210\u5206\u955C" }), _jsx("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab("workflow"); }, className: "polaris-readable-button rounded-2xl px-6 py-4 text-sm font-black", children: "\u67E5\u770B\u5B8C\u6574\u6D41\u7A0B" })] })] }) }) })] });
                                })() })] })] }) });
    }
    if (!apiIsReady) {
        return PolarisShell({ compact: true, children: _jsxs(_Fragment, { children: [_jsxs("section", { className: "relative overflow-hidden rounded-[3rem] border border-white/10 bg-[#050505] p-5 shadow-[0_0_100px_rgba(34,211,238,0.10)]", children: [_jsx("div", { className: "absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-[90px]" }), _jsx("div", { className: "absolute -right-24 top-16 h-80 w-80 rounded-full bg-purple-500/20 blur-[110px]" }), _jsx("div", { className: "absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-amber-400/10 blur-[90px]" }), _jsxs("div", { className: "relative z-10 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/[0.035] px-5 py-4 backdrop-blur-2xl", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(BrandMark, { active: false, progress: 0 }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-black uppercase tracking-[0.24em] text-white", children: "POLARIS AIGC STUDIO" }), _jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200", children: "Clean Home \u00B7 Infinite Canvas \u00B7 Image / Video AI" })] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest", children: [_jsx("button", { onClick: () => document.getElementById("polaris-api-card")?.scrollIntoView({ behavior: "smooth", block: "center" }), className: "rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-cyan-100 hover:bg-cyan-300/20", children: "Connect API" }), _jsx("button", { onClick: () => document.getElementById("polaris-flow-card")?.scrollIntoView({ behavior: "smooth", block: "center" }), className: "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-stone-200 hover:bg-white/10", children: "View Flow" })] })] }), _jsxs("div", { className: "relative z-10 grid gap-8 px-3 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-16", children: [_jsxs("div", { children: [_jsx("div", { className: "inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200", children: "\u4E00\u7AD9\u5F0F AI \u5F71\u89C6\u521B\u4F5C\u5DE5\u4F5C\u53F0" }), _jsx("h1", { className: "mt-6 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl", children: "\u628A\u7CFB\u7EDF\u6536\u56DE\u6765\uFF0C\u505A\u6210\u4E00\u4E2A\u5E72\u51C0\u7684\u521B\u4F5C\u9996\u9875\u3002" }), _jsx("p", { className: "mt-6 max-w-2xl text-base leading-8 text-stone-400", children: "\u4E0D\u518D\u628A\u6240\u6709\u9AD8\u7EA7\u529F\u80FD\u5806\u5728\u7B2C\u4E00\u5C4F\u3002\u9996\u9875\u53EA\u8D1F\u8D23\u4E09\u4EF6\u4E8B\uFF1A\u9009\u62E9\u521B\u4F5C\u7C7B\u578B\u3001\u8FDB\u5165\u5DE5\u4F5C\u6D41\u3001\u8FDE\u63A5 AI \u5F15\u64CE\u3002\u590D\u6742\u80FD\u529B\u653E\u8FDB\u9879\u76EE\u5185\u9875\u548C\u65E0\u9650\u753B\u5E03\u91CC\u3002" }), _jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [_jsx("button", { onClick: () => document.getElementById("polaris-api-card")?.scrollIntoView({ behavior: "smooth", block: "center" }), className: "rounded-2xl bg-white px-6 py-4 text-[12px] font-black uppercase tracking-widest text-black hover:bg-cyan-100", children: "Start Creating / \u5F00\u59CB\u521B\u4F5C" }), _jsx("button", { onClick: () => setProjectStudioOpen(true), className: "rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-[12px] font-black uppercase tracking-widest text-white hover:bg-white/10", children: "Preview Studio / \u9884\u89C8\u5DE5\u4F5C\u53F0" })] }), _jsx("div", { className: "mt-8 grid max-w-2xl grid-cols-3 gap-3", children: [['43+', 'Film Modules', '电影工业模块'], ['Seedream', 'Image API', '即梦生图'], ['Canvas', 'Node Flow', '无限画布']].map(([a, b, c]) => _jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/35 p-4", children: [_jsx("div", { className: "text-xl font-black text-white", children: a }), _jsx("div", { className: "mt-1 text-[10px] font-black uppercase tracking-widest text-cyan-200", children: b }), _jsx("div", { className: "mt-1 text-[11px] text-stone-500", children: c })] }, a)) })] }), _jsxs("div", { className: "rounded-[2.5rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5 shadow-2xl backdrop-blur-2xl", children: [_jsxs("div", { className: "rounded-[2rem] border border-cyan-300/15 bg-black/50 p-5", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200", children: "Product Map" }), _jsx("div", { className: "mt-1 text-xl font-black text-white", children: "\u521B\u4F5C\u4EA7\u54C1\u5165\u53E3" })] }), _jsx("div", { className: "rounded-full bg-emerald-300 px-3 py-1 text-[10px] font-black text-black", children: "Clean" })] }), _jsx("div", { className: "mt-5 grid grid-cols-2 gap-3", children: [
                                                            ['AI 漫剧制作', 'Comic / Story', '从剧情到分镜'],
                                                            ['无限画布', 'Canvas', '节点式工作流'],
                                                            ['AI 图像创作', 'Image', '关键帧与角色锁定'],
                                                            ['AI 视频生成', 'Video', '模型路由与交付'],
                                                        ].map(([title, en, sub]) => _jsxs("div", { className: "rounded-3xl border border-white/10 bg-white/[0.04] p-4 hover:border-cyan-300/30", children: [_jsx("div", { className: "text-sm font-black text-white", children: title }), _jsx("div", { className: "mt-1 text-[10px] font-black uppercase tracking-widest text-cyan-200", children: en }), _jsx("div", { className: "mt-3 text-[11px] leading-5 text-stone-500", children: sub })] }, title)) })] }), _jsxs("div", { className: "mt-4 rounded-[2rem] border border-purple-300/15 bg-purple-400/10 p-5", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-purple-200", children: "Why it feels cleaner / \u4E3A\u4EC0\u4E48\u4F1A\u66F4\u5E72\u51C0" }), _jsxs("div", { className: "mt-4 space-y-3 text-sm leading-7 text-stone-300", children: [_jsx("div", { className: "rounded-2xl bg-black/35 p-3", children: "01 \u00B7 \u9996\u9875\u53EA\u505A\u5BFC\u822A\u548C\u51B3\u7B56\uFF0C\u4E0D\u585E\u6EE1\u53C2\u6570\u3002" }), _jsx("div", { className: "rounded-2xl bg-black/35 p-3", children: "02 \u00B7 \u9AD8\u7EA7\u53C2\u6570\u8FDB\u5165\u9879\u76EE\u540E\u518D\u5C55\u5F00\u3002" }), _jsx("div", { className: "rounded-2xl bg-black/35 p-3", children: "03 \u00B7 \u65E0\u9650\u753B\u5E03\u4F5C\u4E3A Pro \u5DE5\u5177\uFF0C\u800C\u4E0D\u662F\u6240\u6709\u4EBA\u7684\u7B2C\u4E00\u5165\u53E3\u3002" })] })] })] })] })] }), _jsx("section", { id: "polaris-flow-card", className: "mt-8 grid grid-cols-1 gap-5 lg:grid-cols-4", children: [
                            ['01', 'Start', '立项', '一句话需求、参考链接、项目类型'],
                            ['02', 'Write', '剧本', '大纲、人物、节奏、爆款钩子'],
                            ['03', 'Produce', '制作', '分镜、提示词、关键帧、Seedream'],
                            ['04', 'Deliver', '交付', 'Word、TXT、JSON、客户预览'],
                        ].map(([no, en, zh, body]) => _jsxs("div", { className: "rounded-[2rem] border border-white/10 bg-white/[0.035] p-5", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-amber-200", children: no }), _jsxs("div", { className: "mt-3 text-xl font-black text-white", children: [en, " / ", zh] }), _jsx("p", { className: "mt-3 text-sm leading-7 text-stone-500", children: body })] }, no)) }), _jsxs("section", { className: "mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]", children: [_jsxs("div", { className: "rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-7", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.28em] text-amber-200", children: "Design Decision / \u8FD9\u6B21\u7684\u65B9\u5411" }), _jsx("h2", { className: "mt-3 text-3xl font-black text-white", children: "\u5C11\u5C31\u662F\u4E13\u4E1A\u3002" }), _jsx("p", { className: "mt-4 text-sm leading-8 text-stone-400", children: "\u73B0\u5728\u4E0D\u8981\u7EE7\u7EED\u52A0\u6309\u94AE\u3002\u5148\u5EFA\u7ACB\u6E05\u6670\u4FE1\u606F\u67B6\u6784\uFF1A\u7528\u6237\u5148\u770B\u5230\u4EA7\u54C1\u5165\u53E3\uFF0C\u518D\u8FDB\u5165\u5177\u4F53\u6D41\u7A0B\u3002\u8282\u70B9\u3001\u53C2\u6570\u3001\u6A21\u578B\u3001\u68C0\u67E5\u5668\u5168\u90E8\u6536\u8FDB\u4E8C\u7EA7\u9875\u9762\u3002" }), _jsx("div", { className: "mt-6 space-y-3 text-[12px] leading-6 text-stone-300", children: ['首页：产品入口 + 快速开始', '项目页：按生产流程分步骤', '画布页：只给高级用户做流程编排', '交付页：把结果打包给客户'].map(x => _jsx("div", { className: "rounded-2xl border border-white/10 bg-black/30 p-3", children: x }, x)) })] }), _jsxs("div", { id: "polaris-api-card", className: "rounded-[2.5rem] border border-cyan-300/20 bg-cyan-400/[0.06] p-7", children: [_jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200", children: "Engine Connection / \u5F15\u64CE\u8FDE\u63A5" }), _jsx("h2", { className: "mt-3 text-3xl font-black text-white", children: "\u8FDE\u63A5 API \u540E\u8FDB\u5165\u521B\u4F5C" }), _jsx("p", { className: "mt-2 text-sm leading-7 text-stone-400", children: "\u4FDD\u7559\u539F\u6709 direct / proxy \u4E24\u79CD\u6A21\u5F0F\uFF0C\u4F46\u653E\u5728\u9996\u9875\u5E95\u90E8\uFF0C\u4E0D\u518D\u62A2\u5360\u89C6\u89C9\u4E2D\u5FC3\u3002" })] }), _jsx("div", { className: "rounded-full border border-red-300/20 bg-red-300/10 px-3 py-1 text-[10px] font-black text-red-200", children: "Offline" })] }), _jsxs("div", { className: "mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2", children: [_jsx(FormField, { label: "API Mode", zh: "\u63A5\u53E3\u6A21\u5F0F", children: _jsx("div", { className: "grid grid-cols-2 gap-3", children: ['direct', 'proxy'].map(m => _jsxs("button", { onClick: () => setApiMode(m), className: `rounded-2xl border px-4 py-3 text-left ${apiMode === m ? 'border-emerald-400 bg-emerald-400 text-black' : 'border-white/10 bg-white/5 text-stone-300'}`, children: [_jsx("div", { className: "text-[12px] font-black uppercase", children: m }), _jsx("div", { className: "mt-1 text-[10px] opacity-70", children: m === 'direct' ? '前端输入 Key' : '后端 route 代理' })] }, m)) }) }), _jsx(FormField, { label: "AI Model", zh: "\u6A21\u578B\u9009\u62E9", children: _jsx(Select, { items: DEEPSEEK_V4_MODELS, value: selectedModel, onChange: setSelectedModel }) }), apiMode === 'direct' && _jsx(FormField, { label: "DeepSeek API Key", zh: "\u667A\u7B97\u4EE4\u724C", children: _jsx(Input, { type: "password", value: apiKey, onChange: e => setApiKey(e.target.value), placeholder: "sk-..." }) }), _jsx("div", { className: "flex items-end", children: _jsx("button", { onClick: handleTestApi, className: "w-full rounded-2xl bg-emerald-400 px-6 py-4 text-[12px] font-black uppercase tracking-widest text-black hover:bg-emerald-500", children: "Test API / \u8FDE\u63A5\u5F15\u64CE" }) })] }), _jsxs("div", { className: "mt-5 rounded-2xl border border-white/10 bg-black/45 p-4 text-[11px] leading-6 text-stone-300", children: ["Status: ", apiLog.status, _jsx("br", {}), "Model: ", apiLog.lastModel || selectedModel, _jsx("br", {}), "Endpoint: ", apiLog.lastEndpoint || deepSeekEndpoint, _jsx("br", {}), apiLog.message] })] })] })] }) });
    }
    if (!workspaceMode) {
        return PolarisShell({ compact: true, children: _jsxs(_Fragment, { children: [_jsxs("section", { className: "relative overflow-hidden rounded-[3rem] border border-white/10 bg-[#050505] p-5 shadow-[0_0_100px_rgba(16,185,129,0.10)]", children: [_jsx("div", { className: "absolute -left-28 top-0 h-80 w-80 rounded-full bg-emerald-400/20 blur-[110px]" }), _jsx("div", { className: "absolute -right-28 top-24 h-96 w-96 rounded-full bg-cyan-400/16 blur-[120px]" }), _jsxs("div", { className: "relative z-10 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/[0.035] px-5 py-4 backdrop-blur-2xl", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(BrandMark, { active: false, progress: 100 }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-black uppercase tracking-[0.24em] text-white", children: "POLARIS Home" }), _jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.28em] text-emerald-200", children: "API Connected \u00B7 Choose Your Creation Path" })] })] }), _jsxs("div", { className: "flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest", children: [_jsx("button", { onClick: openApiConnectionCenter, className: "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-stone-200 hover:bg-white/10", children: "API Center / \u5C45\u4E2D" }), _jsx("button", { onClick: openDirectorCanvas, className: "rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-cyan-100 hover:bg-cyan-300/20", children: "Open Canvas" })] })] }), _jsxs("div", { className: "relative z-10 grid gap-8 px-3 py-12 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-8 lg:py-16", children: [_jsxs("div", { children: [_jsx("div", { className: "inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200", children: "API Connected / \u53EF\u4EE5\u5F00\u59CB" }), _jsx("h1", { className: "mt-6 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl", children: "\u9009\u62E9\u4E00\u4E2A\u5165\u53E3\uFF0C\u4E0D\u518D\u88AB\u590D\u6742\u529F\u80FD\u6DF9\u6CA1\u3002" }), _jsx("p", { className: "mt-6 max-w-2xl text-base leading-8 text-stone-400", children: "\u8FD9\u4E2A\u9996\u9875\u91C7\u7528\u201C\u4EA7\u54C1\u5165\u53E3 + \u5DE5\u4F5C\u6D41\u5165\u53E3\u201D\u7684\u7ED3\u6784\u3002\u4F60\u5148\u9009\u62E9\u8981\u505A\u4EC0\u4E48\uFF0C\u8FDB\u5165\u4E4B\u540E\u518D\u6253\u5F00\u9AD8\u7EA7\u53C2\u6570\u3001\u8282\u70B9\u753B\u5E03\u548C\u4EA4\u4ED8\u5DE5\u5177\u3002" }), _jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [_jsx("button", { onClick: openPromptOnlyWorkspace, className: "rounded-2xl bg-white px-6 py-4 text-[12px] font-black uppercase tracking-widest text-black hover:bg-emerald-100", children: "Prompt Only / \u53EA\u505A\u63D0\u793A\u8BCD" }), _jsx("button", { onClick: openFullVisualWorkspace, className: "rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-6 py-4 text-[12px] font-black uppercase tracking-widest text-cyan-100 hover:bg-cyan-300/20", children: "Full Visual / \u56FE\u6587\u89C6\u9891\u5168\u6D41\u7A0B" })] })] }), _jsx("div", { className: "rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl", children: _jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                                                ['漫剧制作', 'Comic Story', '剧情、分镜、连续性'],
                                                ['无限画布', 'Infinite Canvas', '节点式流程编排'],
                                                ['AI图像', 'Image Creation', 'Seedream 关键帧'],
                                                ['AI视频', 'Video Prompt', '模型适配与路由'],
                                            ].map(([title, en, sub]) => _jsxs("button", { onClick: () => title === '无限画布' ? openDirectorCanvas() : switchWorkspaceMode('pro'), className: "rounded-[2rem] border border-white/10 bg-black/35 p-5 text-left transition hover:border-cyan-300/35 hover:bg-white/10", children: [_jsx("div", { className: "text-lg font-black text-white", children: title }), _jsx("div", { className: "mt-1 text-[10px] font-black uppercase tracking-widest text-cyan-200", children: en }), _jsx("p", { className: "mt-4 text-[12px] leading-6 text-stone-500", children: sub })] }, title)) }) })] })] }), _jsx("section", { className: "mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3", children: v6ModeCards.map((m, i) => _jsxs("button", { onClick: () => switchWorkspaceMode(m.id), className: "group rounded-[2.25rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(0,0,0,0.45))] p-7 text-left shadow-2xl transition hover:-translate-y-1 hover:border-emerald-300/35 hover:bg-white/10", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300", children: ["Path 0", i + 1] }), _jsx("div", { className: "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black text-stone-400", children: m.en })] }), _jsx("h3", { className: "mt-5 text-3xl font-black text-white", children: m.title }), _jsx("p", { className: "mt-5 min-h-[84px] text-sm leading-7 text-stone-400", children: m.desc }), _jsx("div", { className: "mt-6 inline-flex rounded-2xl bg-emerald-400 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black", children: m.cta })] }, m.id)) }), _jsxs("section", { className: "mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]", children: [_jsxs("div", { className: "rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-7", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200", children: "Clean Production Flow / \u6E05\u723D\u751F\u4EA7\u6D41" }), _jsx("h2", { className: "mt-3 text-3xl font-black text-white", children: "\u4EE5\u540E\u6309\u8FD9 5 \u4E2A\u533A\u5757\u7EF4\u62A4\uFF0C\u4E0D\u8981\u518D\u5806\u9875\u9762\u3002" }), _jsx("div", { className: "mt-6 grid grid-cols-1 gap-3 md:grid-cols-5", children: [
                                            ['01', '输入'], ['02', '故事'], ['03', '分镜'], ['04', '视觉'], ['05', '交付']
                                        ].map(([no, title]) => _jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/35 p-4 text-center", children: [_jsx("div", { className: "text-[10px] font-black text-cyan-200", children: no }), _jsx("div", { className: "mt-2 text-lg font-black text-white", children: title })] }, no)) }), _jsx("p", { className: "mt-5 text-sm leading-8 text-stone-400", children: "\u9996\u9875\u5B66 Neowow \u8FD9\u7C7B\u4EA7\u54C1\u7AD9\u7684\u6E05\u6670\u5165\u53E3\u903B\u8F91\uFF1A\u5148\u8BA9\u7528\u6237\u77E5\u9053\u201C\u80FD\u505A\u4EC0\u4E48\u201D\uFF0C\u518D\u8BA9\u7528\u6237\u8FDB\u5165\u201C\u600E\u4E48\u505A\u201D\u3002\u4E0D\u8981\u5728\u7B2C\u4E00\u5C4F\u66B4\u9732\u6240\u6709\u5DE5\u7A0B\u6309\u94AE\u3002" })] }), _jsxs("div", { className: "rounded-[2.5rem] border border-amber-300/20 bg-amber-400/[0.06] p-7", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.28em] text-amber-200", children: "Project Snapshot / \u9879\u76EE\u72B6\u6001" }), _jsx("h3", { className: "mt-3 text-2xl font-black text-white", children: project }), _jsxs("div", { className: "mt-5 grid grid-cols-2 gap-3", children: [_jsx(MiniStat, { label: "API", value: apiIsReady ? 'Ready' : 'Need API', tone: apiIsReady ? "emerald" : "red" }), _jsx(MiniStat, { label: "Shots", value: shots.length, tone: "cyan" }), _jsx(MiniStat, { label: "Mode", value: productionFlowMode === 'full-visual' ? 'Full Visual' : 'Prompt Only', tone: "amber" }), _jsx(MiniStat, { label: "Keyframes", value: `${Object.values(shotKeyframes).filter(x => x?.images?.length).length}/${shots.length || 0}`, tone: "purple" })] }), _jsxs("div", { className: "mt-5 grid grid-cols-2 gap-2", children: [_jsx("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab('workflow'); }, className: "rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-[10px] font-black text-white hover:bg-white/10", children: "\u5DE5\u4F5C\u6D41" }), _jsx("button", { onClick: openDirectorCanvas, className: "rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-[10px] font-black text-white hover:bg-white/10", children: "\u753B\u5E03" }), _jsx("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab('visual'); }, className: "rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-[10px] font-black text-white hover:bg-white/10", children: "\u5173\u952E\u5E27" }), _jsx("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab('delivery'); }, className: "rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-[10px] font-black text-white hover:bg-white/10", children: "\u4EA4\u4ED8" })] })] })] })] }) });
    }
    if (workspaceMode === "beginner") {
        return PolarisShell({ children: _jsx(_Fragment, { children: _jsxs("div", { className: "grid grid-cols-1 gap-7 xl:grid-cols-12", children: [_jsxs("section", { className: "xl:col-span-7 space-y-6", children: [_jsx(GlassPanel, { title: "Beginner Quick Create", subTitle: "\u65B0\u624B\u4E00\u952E\u751F\u6210", defaultOpen: true, children: _jsxs("div", { className: "space-y-5", children: [_jsx(FormField, { label: "Reference URL", zh: "\u53C2\u8003\u94FE\u63A5", children: _jsx(Input, { value: referenceUrl, onChange: e => setReferenceUrl(e.target.value), placeholder: "\u7C98\u8D34\u89C6\u9891\u53F7 / \u6296\u97F3 / \u5C0F\u7EA2\u4E66 / B\u7AD9 / \u516C\u4F17\u53F7 / \u7F51\u9875\u94FE\u63A5" }) }), _jsxs("div", { className: "rounded-2xl border border-cyan-300/15 bg-cyan-400/5 p-4", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200", children: "Word Script Import / Word\u5267\u672C\u5BFC\u5165" }), _jsxs("div", { className: "mt-2 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]", children: [_jsx("input", { type: "file", accept: ".docx,.txt,.md,.markdown", onChange: handleScriptDocumentUpload, className: "block w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-xs text-white file:mr-3 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-3 file:py-2 file:text-xs file:font-black file:text-black" }), _jsx("button", { onClick: handleAnalyzeImportedScript, disabled: !scriptImportText.trim() || isAnalyzingImportedScript, className: "rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-[10px] font-black uppercase text-cyan-200 disabled:opacity-40", children: "Analyze / \u5206\u6790" })] }), scriptImportMeta?.name && _jsxs("div", { className: "mt-3 text-[11px] text-stone-400", children: ["\u5DF2\u5BFC\u5165\uFF1A", scriptImportMeta.name, " \u00B7 ", scriptImportText.length, " \u5B57\u7B26"] }), _jsx("button", { onClick: handleApplyImportedScriptToBible, disabled: !scriptImportText.trim(), className: "mt-3 rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-[10px] font-black uppercase text-amber-200 disabled:opacity-40", children: "Apply to Script / \u5199\u5165\u5267\u672C" })] }), _jsx(FormField, { label: "Idea Requirement", zh: "\u4E00\u53E5\u8BDD\u521B\u4F5C\u9700\u6C42", children: _jsx(TextArea, { value: ideaInput, onChange: e => setIdeaInput(e.target.value), className: "min-h-[180px] text-base font-bold", placeholder: "\u4F8B\u5982\uFF1A\u5199\u4E00\u4E2A\u5173\u4E8E\u9999\u6E2F\u6587\u5316\u7684\u77ED\u89C6\u9891\uFF0C\u8981\u6709\u5267\u60C5\uFF0C\u8981\u6709\u7206\u6B3E\u601D\u7EF4\uFF0C1\u5206\u949F\u5185\u7684\u77ED\u89C6\u9891\u811A\u672C\u3002" }) }), _jsx("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-3", children: OPT.douyinVideoTypes.slice(0, 6).map(t => _jsx("button", { onClick: () => setDouyinViral(p => ({ ...p, videoType: t })), className: `rounded-2xl border px-4 py-3 text-left text-[11px] font-black ${douyinViral.videoType === t ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300"}`, children: t }, t)) }), _jsx("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-3", children: OPT.shortVideoDurations.map(t => _jsx("button", { onClick: () => setDouyinViral(p => ({ ...p, duration: t })), className: `rounded-2xl border px-4 py-3 text-center text-[11px] font-black ${douyinViral.duration === t ? "border-emerald-400 bg-emerald-400 text-black" : "border-white/10 bg-white/5 text-stone-300"}`, children: t }, t)) }), _jsx(Toggle, { checked: douyinViral.enabled, onChange: v => setDouyinViral(p => ({ ...p, enabled: v })), label: "Douyin Viral Logic", zh: "\u542F\u7528\u6296\u97F3\u7206\u6B3E\u77ED\u89C6\u9891\u601D\u7EF4" }), _jsxs("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2", children: [_jsx("button", { onClick: handlePromptOnlyProduction, disabled: isOneClickRunning || isGenerating, className: "w-full rounded-3xl bg-emerald-400 px-8 py-5 text-[13px] font-black uppercase tracking-widest text-black hover:bg-emerald-500 disabled:opacity-50", children: isOneClickRunning ? "Running... / 运行中" : "Prompt Only / 只生成提示词" }), _jsx("button", { onClick: handleFullVisualProduction, disabled: isOneClickRunning || isGenerating, className: "w-full rounded-3xl border border-cyan-300/25 bg-cyan-400/10 px-8 py-5 text-[13px] font-black uppercase tracking-widest text-cyan-200 hover:bg-cyan-400/20 disabled:opacity-50", children: "Full Visual / \u63D0\u793A\u8BCD+\u56FE\u7247" })] })] }) }), outlineDraft && _jsxs(GlassPanel, { title: "Script Outline", subTitle: "\u5267\u672C\u5927\u7EB2", defaultOpen: true, children: [_jsx(TextArea, { value: outlineDraft, onChange: e => setOutlineDraft(e.target.value), className: "min-h-[220px]" }), _jsxs("div", { className: "mt-4 flex flex-wrap gap-3", children: [_jsx("button", { onClick: handleConfirmOutline, className: "rounded-2xl bg-amber-400 px-5 py-3 text-[11px] font-black uppercase text-black", children: "Confirm Outline / \u786E\u8BA4\u5927\u7EB2" }), _jsx("button", { onClick: () => handleGenerate(outlineDraft), className: "rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase text-white", children: "Generate Shots / \u751F\u6210\u5206\u955C" })] })] })] }), _jsxs("section", { className: "xl:col-span-5 space-y-6", children: [_jsx(GlassPanel, { title: "Workspace Isolation", subTitle: "\u72EC\u7ACB\u5DE5\u4F5C\u533A", defaultOpen: true, children: _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-[12px] leading-6 text-stone-300", children: "\u65B0\u624B\u3001\u4E13\u4E1A\u3001\u5BFC\u6F14\u4E09\u4E2A\u6A21\u5F0F\u7684\u6570\u636E\u4E92\u4E0D\u5F71\u54CD\u3002\u9700\u8981\u7EE7\u7EED\u6DF1\u5EA6\u5236\u4F5C\u65F6\uFF0C\u8BF7\u624B\u52A8\u5BFC\u5165\u5230\u5176\u4ED6\u6A21\u5F0F\u3002" }), _jsxs("div", { className: "grid grid-cols-1 gap-3", children: [_jsx("button", { onClick: () => importCurrentWorkspaceTo("pro"), className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase text-white hover:bg-white/10", children: "Import to Pro / \u5BFC\u5165\u4E13\u4E1A\u6A21\u5F0F" }), _jsx("button", { onClick: () => importCurrentWorkspaceTo("director"), className: "rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-[11px] font-black uppercase text-amber-200 hover:bg-amber-400/20", children: "Import to Director / \u5BFC\u5165\u5BFC\u6F14\u6A21\u5F0F" })] })] }) }), _jsx(GlassPanel, { title: "Workflow Status", subTitle: "\u6D41\u7A0B\u72B6\u6001", defaultOpen: true, children: _jsx("div", { className: "space-y-3", children: workflowStatus.map((s, i) => _jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-[10px] font-black uppercase tracking-widest text-stone-500", children: ["0", i + 1, " \u00B7 ", s.id] }), _jsx("div", { className: "text-sm font-bold text-white", children: s.label })] }), _jsx("div", { className: `h-3 w-3 rounded-full ${s.done ? "bg-emerald-400" : "bg-stone-700"}` })] }, s.id)) }) }), _jsx(GlassPanel, { title: "Storyboard Result", subTitle: "\u5206\u955C\u7ED3\u679C", defaultOpen: true, children: _jsx("div", { className: "space-y-3 max-h-[520px] overflow-y-auto", children: shots.length ? shots.map((s, i) => _jsxs("button", { onClick: () => { importCurrentWorkspaceTo("director"); setActiveShot(i); }, className: "w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("div", { className: "text-[10px] font-black text-amber-300", children: ["Shot ", i + 1, " \u00B7 ", s.duration] }), _jsx(ShotRoleBadge, { shot: s })] }), _jsx("div", { className: "mt-2 text-sm font-black text-white", children: s.titleZh }), _jsx("div", { className: "mt-2 line-clamp-2 text-[11px] text-stone-400", children: s.sceneZh })] }, i)) : _jsx("div", { className: "text-sm text-stone-500", children: "\u751F\u6210\u540E\u8FD9\u91CC\u663E\u793A\u5206\u955C\u5361\u7247\u3002" }) }) })] })] }) }) });
    }
    if (workspaceMode === "pro") {
        return PolarisShell({ children: _jsx(_Fragment, { children: _jsxs("div", { className: "grid grid-cols-1 gap-7 xl:grid-cols-12", children: [_jsxs("aside", { className: "xl:col-span-3 space-y-3", children: [v6StepTabs.map(t => _jsx("button", { onClick: () => setProStep(t.id), className: `w-full rounded-2xl border px-4 py-4 text-left text-[12px] font-black uppercase tracking-widest ${proStep === t.id ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"}`, children: t.label }, t.id)), _jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/35 p-4", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-amber-200", children: "Independent Workspace / \u72EC\u7ACB\u5DE5\u4F5C\u533A" }), _jsx("div", { className: "mt-2 text-[11px] leading-5 text-stone-500", children: "\u4E13\u4E1A\u6A21\u5F0F\u4E0D\u4F1A\u81EA\u52A8\u5F71\u54CD\u65B0\u624B\u6216\u5BFC\u6F14\u6A21\u5F0F\u3002" }), _jsx("button", { onClick: () => importCurrentWorkspaceTo("director"), className: "mt-3 w-full rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-[11px] font-black uppercase text-amber-200 hover:bg-amber-400/20", children: "Import to Director / \u5BFC\u5165\u5BFC\u6F14\u6A21\u5F0F" })] })] }), _jsxs("section", { className: "xl:col-span-9 space-y-6", children: [proStep === "reference" && _jsx(GlassPanel, { title: "01 Reference Understanding", subTitle: "\u53C2\u8003\u94FE\u63A5\u7406\u89E3", defaultOpen: true, children: _jsxs("div", { className: "space-y-5", children: [_jsx(FormField, { label: "Reference URL", zh: "\u53C2\u8003\u94FE\u63A5", children: _jsx(Input, { value: referenceUrl, onChange: e => setReferenceUrl(e.target.value), placeholder: "https://..." }) }), _jsx(FormField, { label: "Manual Reference Content", zh: "\u5907\u7528\u7C98\u8D34\u5185\u5BB9", children: _jsx(TextArea, { value: referenceManualContent, onChange: e => setReferenceManualContent(e.target.value) }) }), _jsx(FormField, { label: "Reference Use Mode", zh: "\u53C2\u8003\u7528\u9014", children: _jsx("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2", children: OPT.referenceUseModes.map(x => _jsx("button", { onClick: () => setReferenceUseMode(x), className: `rounded-2xl border px-4 py-3 text-left text-[11px] font-black ${referenceUseMode === x ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300"}`, children: x }, x)) }) }), _jsx("button", { onClick: handleIngestReference, disabled: isIngestingReference, className: "rounded-2xl bg-emerald-400 px-6 py-3 text-[12px] font-black uppercase text-black", children: "Ingest Reference / \u8BC6\u522B\u53C2\u8003\u94FE\u63A5" }), _jsx("div", { className: "rounded-2xl border border-white/10 bg-black/40 p-4 text-[12px] leading-6 text-stone-300", children: referenceIngest.summary || referenceIngest.usableFacts || "链接解析结果会显示在这里。" })] }) }), proStep === "script" && _jsxs("div", { className: "space-y-6", children: [_jsx(GlassPanel, { title: "Script Import Lab", subTitle: "Word\u5267\u672C\u6587\u6863\u5BFC\u5165\u5206\u6790\u5BA4", defaultOpen: true, children: _jsxs("div", { className: "space-y-5", children: [_jsx("div", { className: "rounded-2xl border border-cyan-300/15 bg-cyan-400/5 p-4 text-[12px] leading-6 text-stone-300", children: "\u652F\u6301 .docx / .txt / .md\u3002\u5BFC\u5165\u540E\u53EF\u5206\u6790\u4EBA\u7269\u3001\u573A\u666F\u3001\u5BF9\u767D\u3001\u60C5\u7EEA\u66F2\u7EBF\u3001\u5206\u573A\u7ED3\u6784\uFF0C\u5E76\u5199\u5165\u5267\u672C\u4E0E\u521B\u4F5C\u5723\u7ECF\u3002" }), _jsx(FormField, { label: "Import Script Document", zh: "\u5BFC\u5165Word\u5267\u672C", children: _jsx("input", { type: "file", accept: ".docx,.txt,.md,.markdown", onChange: handleScriptDocumentUpload, className: "block w-full rounded-2xl border border-white/10 bg-black/70 px-5 py-3 text-sm text-white file:mr-4 file:rounded-xl file:border-0 file:bg-amber-400 file:px-4 file:py-2 file:text-xs file:font-black file:text-black" }) }), scriptImportMeta?.name && _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4 text-[11px] leading-6 text-stone-300", children: [_jsx("b", { className: "text-amber-200", children: scriptImportMeta.name }), _jsx("br", {}), "Type: ", scriptImportMeta.type, " \u00B7 Parser: ", scriptImportMeta.parser, " \u00B7 Text: ", scriptImportText.length, " chars"] }), _jsx(FormField, { label: "Imported Script Text", zh: "\u5BFC\u5165\u6587\u672C\u9884\u89C8/\u53EF\u624B\u52A8\u7C98\u8D34", children: _jsx(TextArea, { value: scriptImportText, onChange: e => setScriptImportText(e.target.value), rows: 6, placeholder: "\u4E5F\u53EF\u4EE5\u76F4\u63A5\u7C98\u8D34\u5267\u672C\u6587\u6863\u6B63\u6587\u3002" }) }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx("button", { onClick: handleAnalyzeImportedScript, disabled: isAnalyzingImportedScript || isImportingScript || !scriptImportText.trim(), className: "rounded-2xl bg-cyan-400 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black disabled:opacity-50", children: "Analyze Script / \u5206\u6790\u5267\u672C" }), _jsx("button", { onClick: handleApplyImportedScriptToBible, disabled: !scriptImportText.trim(), className: "rounded-2xl border border-amber-300/20 bg-amber-400/10 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-amber-200 disabled:opacity-40", children: "Apply to Bible / \u5199\u5165\u521B\u4F5C\u5723\u7ECF" }), _jsx("button", { onClick: handleGenerateShotPlanFromImport, disabled: !scriptImportText.trim() || isPlanningShots, className: "rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-emerald-200 disabled:opacity-40", children: "Shot Plan From Script / \u4ECE\u6587\u6863\u89C4\u5212\u5206\u955C" })] }), scriptImportScenes.length > 0 && _jsx(FormField, { label: "Scene Selection", zh: "\u9009\u62E9\u751F\u6210\u8303\u56F4", children: _jsx(Select, { items: ["all", ...scriptImportScenes.map((s, i) => String(s.sceneId || s.id || s.index || i + 1))], value: selectedImportScene, onChange: setSelectedImportScene }) }), scriptImportAnalysis && _jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/40 p-5", children: [_jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.24em] text-cyan-200", children: "Script Analysis Report / \u5267\u672C\u5206\u6790\u62A5\u544A" }), _jsx("div", { className: "mt-3 whitespace-pre-wrap text-[12px] leading-6 text-stone-300", children: summarizeImportedScriptAnalysis(scriptImportAnalysis) || scriptImportAnalysis.analysisReport || "已完成分析。" }), scriptImportScenes.length > 0 && _jsx("div", { className: "mt-4 grid grid-cols-1 gap-2", children: scriptImportScenes.slice(0, 8).map((s, i) => _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-3 text-[11px] leading-5 text-stone-300", children: [_jsx("b", { className: "text-amber-200", children: s.titleZh || s.titleEn || `Scene ${i + 1}` }), _jsx("br", {}), s.storyFunction || s.emotionalBeat || s.rawTextSummary || "分场信息"] }, i)) })] })] }) }), _jsx(GlassPanel, { title: "02 Idea & Script Bible", subTitle: "\u60F3\u6CD5\u4E0E\u5267\u672C\u521B\u4F5C\u5723\u7ECF", defaultOpen: true, children: _jsxs("div", { className: "space-y-5", children: [_jsx(FormField, { label: "Idea Requirement", zh: "\u60F3\u6CD5\u9700\u6C42", children: _jsx(TextArea, { value: ideaInput, onChange: e => setIdeaInput(e.target.value), className: "min-h-[140px]" }) }), _jsx("button", { onClick: handleGenerateOutline, disabled: isGeneratingOutline, className: "rounded-2xl bg-amber-400 px-6 py-3 text-[12px] font-black uppercase text-black", children: "Generate Script Outline / \u751F\u6210\u811A\u672C\u5927\u7EB2" }), _jsx(FormField, { label: "Script & Creative Bible", zh: "\u5267\u672C\u4E0E\u521B\u4F5C\u5723\u7ECF", children: _jsx(TextArea, { value: script, onChange: e => setScript(e.target.value), className: "min-h-[220px] text-base font-bold" }) })] }) })] }), proStep === "planning" && _jsx(GlassPanel, { title: "03 Smart Shot Planning", subTitle: "\u667A\u80FD\u5206\u955C\u89C4\u5212", defaultOpen: true, children: _jsxs("div", { className: "space-y-5", children: [_jsx("div", { className: "rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4", children: _jsxs("div", { className: "text-[11px] text-stone-300", children: [shotPlan.summaryZh, NL, shotPlan.summaryEn] }) }), _jsx("button", { onClick: handleGenerateShotPlan, disabled: isPlanningShots, className: "rounded-2xl bg-amber-400 px-6 py-3 text-[12px] font-black uppercase text-black", children: "Generate Shot Plan / \u751F\u6210\u5206\u955C\u89C4\u5212\u8868" }), _jsx("div", { className: "space-y-2 max-h-[420px] overflow-y-auto", children: shotPlanRows.length ? shotPlanRows.map((r, i) => _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsxs("div", { className: "text-[10px] font-black text-amber-300", children: ["#", r.shotNo || i + 1, " \u00B7 ", r.roleZh || r.role] }), _jsx("div", { className: "mt-1 text-sm text-white", children: r.beatZh || r.beat })] }, i)) : _jsx("div", { className: "text-sm text-stone-500", children: "\u8FD8\u6CA1\u6709\u5206\u955C\u89C4\u5212\u8868\u3002" }) })] }) }), proStep === "shots" && _jsx(GlassPanel, { title: "04 Generate & Review Shots", subTitle: "\u6B63\u5F0F\u5206\u955C\u751F\u6210", defaultOpen: true, children: _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx("button", { onClick: handleGenerateFromShotPlan, disabled: isGenerating, className: "rounded-2xl bg-amber-400 px-6 py-3 text-[12px] font-black uppercase text-black", children: "Generate From Plan / \u6309\u89C4\u5212\u751F\u6210" }), _jsx("button", { onClick: handleGenerate, disabled: isGenerating, className: "rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-[12px] font-black uppercase text-white", children: "Smart Generate / \u667A\u80FD\u751F\u6210" }), _jsx("button", { onClick: handleRepairMissingCoverage, disabled: !shots.length || isRepairingCoverage, className: "rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-[12px] font-black uppercase text-white", children: "Inspect & Add Missing / \u68C0\u67E5\u8865\u955C\u5934" })] }), _jsx("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2", children: shots.length ? shots.map((s, i) => _jsxs("button", { onClick: () => { importCurrentWorkspaceTo("director"); setActiveShot(i); }, className: "rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("div", { className: "text-[10px] font-black text-amber-300", children: ["Shot ", i + 1, " \u00B7 ", s.duration] }), _jsx(ShotRoleBadge, { shot: s })] }), _jsx("div", { className: "mt-2 text-sm font-black text-white", children: s.titleZh }), _jsx("div", { className: "mt-2 line-clamp-2 text-[11px] text-stone-400", children: s.sceneZh })] }, i)) : _jsx("div", { className: "text-sm text-stone-500", children: "\u8FD8\u6CA1\u6709\u5206\u955C\u3002" }) })] }) }), proStep === "scene" && _jsx(GlassPanel, { title: "05 Scene Image Studio", subTitle: "\u573A\u666F\u56FE\u5DE5\u4F5C\u5BA4", defaultOpen: true, children: _jsxs("div", { className: "space-y-5", children: [_jsx(FormField, { label: "Image Model Variant", zh: "\u56FE\u50CF\u6A21\u578B\u9002\u914D", children: _jsx("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2", children: OPT.sceneImageModels.map(m => _jsx("button", { onClick: () => setTech(p => ({ ...p, sceneImageModel: m })), className: `rounded-2xl border px-4 py-3 text-left text-[11px] font-black ${tech.sceneImageModel === m ? "border-emerald-400 bg-emerald-400 text-black" : "border-white/10 bg-white/5 text-stone-300"}`, children: m }, m)) }) }), _jsx("button", { onClick: handleEnhanceSceneImagePrompts, disabled: !shots.length || isEnhancingSceneImages, className: "rounded-2xl bg-emerald-400 px-6 py-3 text-[12px] font-black uppercase text-black", children: "Enhance All Scene Prompts / \u589E\u5F3A\u573A\u666F\u56FE\u63D0\u793A\u8BCD" }), _jsx("button", { onClick: handleDownloadSceneImagePack, disabled: !shots.length, className: "rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-[12px] font-black uppercase text-white", children: "Download Prompt Pack / \u4E0B\u8F7D\u63D0\u793A\u8BCD\u5305" })] }) }), proStep === "export" && _jsxs(GlassPanel, { title: "06 Export Center", subTitle: "\u5BFC\u51FA\u4E2D\u5FC3", defaultOpen: true, children: [_jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [_jsx("button", { onClick: () => makeWord(rebuildFinalPrompts(shots), project, script, style, tech, modules), disabled: !shots.length, className: "rounded-2xl bg-amber-400 px-6 py-4 text-[12px] font-black uppercase text-black disabled:opacity-40", children: "Export Word / \u5BFC\u51FA Word" }), _jsx("button", { onClick: handleCopySceneImagePack, disabled: !shots.length, className: "rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-[12px] font-black uppercase text-white disabled:opacity-40", children: "Copy Scene Pack / \u590D\u5236\u573A\u666F\u56FE\u5305" }), _jsx("button", { onClick: handleRunQualityCheck, disabled: !shots.length || isCheckingQuality, className: "rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-[12px] font-black uppercase text-white disabled:opacity-40", children: "Quality Check / \u8D28\u91CF\u68C0\u67E5" }), _jsx("button", { onClick: () => downloadPromptPack(rebuildFinalPrompts(shots), project), disabled: !shots.length, className: "rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-6 py-4 text-[12px] font-black uppercase text-emerald-200 disabled:opacity-40", children: "Export Prompt Pack / \u5BFC\u51FA\u7EAF\u63D0\u793A\u8BCD\u5305" })] }), qualityReport && _jsx("div", { className: "mt-5 rounded-2xl border border-white/10 bg-black/40 p-4 text-[12px] text-stone-300", children: qualityReport.summaryZh || qualityReport.summaryEn })] })] })] }) }) });
    }
    if (workspaceMode === "director") {
        const directorShots = rebuildFinalPrompts(shots || []);
        const directorImageCount = Object.values(shotKeyframes || {}).filter(x => x?.images?.length).length;
        const directorTaskCount = Object.values(shotVideos || {}).filter(x => x?.taskId).length;
        const directorVideoCount = Object.values(shotVideos || {}).filter(x => x?.videoUrl).length;
        const directorProgress = Math.round(([Boolean(ideaInput || script || referenceUrl), Boolean(outlineDraft || script), Boolean(directorShots.length), Boolean(directorImageCount), Boolean(directorTaskCount || directorVideoCount)].filter(Boolean).length / 5) * 100);
        const directorNext = !directorShots.length ? { title: "先生成分镜", desc: "DeepSeek 已连接，先把需求拆成镜头资产，再进入画布做图片和视频。", cta: "生成分镜", action: handleGenerate }
            : directorImageCount < directorShots.length ? { title: "进入画布或批量生图", desc: "分镜已准备，下一步在视觉画布中生成关键帧并锁定风格。", cta: "打开无限画布", action: openDirectorCanvas }
                : directorTaskCount < directorShots.length ? { title: "提交视频任务", desc: "关键帧已有，下一步提交即梦 / 可灵 / Seedance 视频智能体。", cta: "批量生视频", action: handleGenerateAllShotVideos }
                    : { title: directorVideoCount ? "导出交付包" : "查询视频状态", desc: directorVideoCount ? "已有视频结果，可以进入交付中心。" : "视频任务已提交，继续查询状态。", cta: directorVideoCount ? "导出交付" : "查询状态", action: directorVideoCount ? exportFullProductionKit : handlePollAllVideoTasks };
        const cockpitSteps = [
            ["01", "需求", "Brief", Boolean(ideaInput || script || referenceUrl)],
            ["02", "提示词", "Prompt", Boolean(outlineDraft || script)],
            ["03", "分镜", "Shots", Boolean(directorShots.length)],
            ["04", "生图", "Images", Boolean(directorImageCount)],
            ["05", "视频", "Video", Boolean(directorTaskCount || directorVideoCount)],
            ["06", "交付", "Delivery", Boolean(lastArchiveId || directorVideoCount)],
        ];
        return PolarisShell({ compact: true, children: _jsxs(_Fragment, { children: [_jsx("section", { className: "overflow-hidden rounded-[2.8rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70 md:p-5", children: _jsxs("div", { className: "relative overflow-hidden rounded-[2.4rem] bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_42%,#eefcff_100%)] p-6 md:p-8", children: [_jsx("div", { className: "pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-cyan-200/55 blur-[90px]" }), _jsx("div", { className: "pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-violet-200/45 blur-[90px]" }), _jsxs("div", { className: "relative z-10 grid gap-7 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-stretch", children: [_jsxs("div", { children: [_jsx("div", { className: "inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-700", children: "DeepSeek API Ready / \u521B\u4F5C\u9A7E\u9A76\u8231\u5DF2\u4E0A\u7EBF" }), _jsx("h1", { className: "mt-5 max-w-5xl text-4xl font-black leading-[0.98] tracking-[-0.055em] text-slate-950 md:text-6xl", children: "\u63A5\u5165 DeepSeek \u540E\uFF0C\u6309\u771F\u5B9E\u5F71\u89C6\u751F\u4EA7\u6D41\u7A0B\u7EE7\u7EED\u3002" }), _jsx("p", { className: "mt-5 max-w-4xl text-base leading-8 text-slate-600", children: "\u8FD9\u91CC\u91CD\u65B0\u6536\u53E3\u6210\u300C\u9700\u6C42 \u2192 \u63D0\u793A\u8BCD \u2192 \u5206\u955C \u2192 \u65E0\u9650\u753B\u5E03 \u2192 \u89C6\u9891\u667A\u80FD\u4F53 \u2192 \u4EA4\u4ED8\u300D\u3002\u590D\u6742\u5BFC\u6F14\u53C2\u6570\u4E0D\u518D\u5806\u6EE1\u9996\u9875\uFF0C\u6838\u5FC3\u6309\u94AE\u96C6\u4E2D\u5230\u521B\u4F5C\u9A7E\u9A76\u8231\u3002" }), _jsxs("div", { className: "mt-6 grid grid-cols-2 gap-3 md:grid-cols-4", children: [_jsxs("button", { onClick: openDirectorCanvas, className: "rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5", children: ["\u6253\u5F00\u65E0\u9650\u753B\u5E03", _jsx("br", {}), _jsx("span", { className: "text-xs font-bold text-cyan-200", children: "Image / Video Canvas" })] }), _jsxs("button", { onClick: handlePromptOnlyProduction, disabled: isOneClickRunning || isGenerating, className: "rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-950 shadow-sm transition hover:-translate-y-0.5 disabled:opacity-50", children: ["\u63D0\u793A\u8BCD\u51C6\u5907", _jsx("br", {}), _jsx("span", { className: "text-xs font-bold text-violet-500", children: "Prompt Prep" })] }), _jsxs("button", { onClick: handleFullVisualProduction, disabled: isOneClickRunning || isGenerating, className: "rounded-2xl border border-cyan-200 bg-cyan-50 px-5 py-4 text-sm font-black text-cyan-900 shadow-sm transition hover:-translate-y-0.5 disabled:opacity-50", children: ["\u5B8C\u6574\u6D41\u7A0B", _jsx("br", {}), _jsx("span", { className: "text-xs font-bold text-cyan-600", children: "Prompt + Image" })] }), _jsxs("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab("delivery"); }, className: "rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-black text-amber-900 shadow-sm transition hover:-translate-y-0.5", children: ["\u4EA4\u4ED8\u4E2D\u5FC3", _jsx("br", {}), _jsx("span", { className: "text-xs font-bold text-amber-600", children: "Delivery" })] })] })] }), _jsxs("div", { className: "rounded-[2rem] border border-slate-200 bg-white/88 p-5 shadow-lg shadow-slate-200/70 backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs font-black uppercase tracking-[0.22em] text-violet-500", children: "Current Project / \u5F53\u524D\u9879\u76EE" }), _jsx("div", { className: "mt-2 text-2xl font-black text-slate-950", children: project })] }), _jsx("div", { className: "rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700", children: "API Ready" })] }), _jsxs("div", { className: "mt-5 grid grid-cols-2 gap-3", children: [_jsx(MiniStat, { label: "Shots", value: directorShots.length, tone: "cyan" }), _jsx(MiniStat, { label: "Images", value: `${directorImageCount}/${directorShots.length || 0}`, tone: "purple" }), _jsx(MiniStat, { label: "Tasks", value: directorTaskCount, tone: "amber" }), _jsx(MiniStat, { label: "Videos", value: directorVideoCount, tone: "emerald" })] }), _jsxs("div", { className: "mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4", children: [_jsx("div", { className: "text-xs font-black text-slate-500", children: "\u5F53\u524D\u5EFA\u8BAE / Next Action" }), _jsx("div", { className: "mt-2 text-lg font-black text-slate-950", children: directorNext.title }), _jsx("p", { className: "mt-1 text-sm leading-6 text-slate-600", children: directorNext.desc }), _jsx("button", { onClick: directorNext.action, disabled: isGenerating || isGeneratingKeyframes || isGeneratingVideos, className: "mt-4 w-full rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-50", children: directorNext.cta })] })] })] })] }) }), _jsx("section", { className: "mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6", children: cockpitSteps.map(([no, zh, en, ok]) => _jsxs("div", { className: `rounded-[1.6rem] border p-4 shadow-sm ${ok ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"}`, children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("div", { className: "text-xs font-black text-slate-400", children: no }), _jsx("div", { className: `rounded-full px-2 py-1 text-[10px] font-black ${ok ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`, children: ok ? "DONE" : "NEXT" })] }), _jsx("div", { className: "mt-3 text-xl font-black text-slate-950", children: zh }), _jsx("div", { className: "mt-1 text-xs font-black uppercase tracking-widest text-violet-500", children: en })] }, no)) }), _jsxs("section", { className: "mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[390px_minmax(0,1fr)_360px]", children: [_jsxs("aside", { className: "space-y-5", children: [_jsxs("div", { className: "rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm", children: [_jsx("div", { className: "text-xs font-black uppercase tracking-[0.22em] text-cyan-600", children: "01 Brief / \u9700\u6C42\u8F93\u5165" }), _jsx("h2", { className: "mt-2 text-2xl font-black text-slate-950", children: "\u628A\u9879\u76EE\u8D44\u6599\u5148\u653E\u8FD9\u91CC\u3002" }), _jsxs("div", { className: "mt-4 space-y-4", children: [_jsx(FormField, { label: "Project Name", zh: "\u9879\u76EE\u540D\u79F0", children: _jsx(Input, { value: project, onChange: e => setProject(e.target.value), placeholder: "\u4F8B\u5982\uFF1A\u77ED\u5267\u9884\u544A / \u54C1\u724C\u5E7F\u544A / \u4EBA\u7269\u4ECB\u7ECD" }) }), _jsx(FormField, { label: "Creative Requirement", zh: "\u521B\u4F5C\u9700\u6C42", children: _jsx(TextArea, { value: ideaInput, onChange: e => setIdeaInput(e.target.value), rows: 5, className: "min-h-[140px]", placeholder: "\u5199\u4E00\u53E5\u8BDD\u9700\u6C42\uFF0CDeepSeek \u4F1A\u7EE7\u7EED\u62C6\u6210\u5927\u7EB2\u3001\u5206\u955C\u548C\u63D0\u793A\u8BCD\u3002" }) }), _jsx(FormField, { label: "Reference URL", zh: "\u53C2\u8003\u94FE\u63A5", children: _jsx(Input, { value: referenceUrl, onChange: e => setReferenceUrl(e.target.value), placeholder: "\u7C98\u8D34\u53C2\u8003\u94FE\u63A5\uFF0C\u53EF\u9009" }) }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx("button", { onClick: handleIngestReference, disabled: (!referenceUrl && !referenceManualContent) || isIngestingReference, className: "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-sm disabled:opacity-50", children: "\u8BC6\u522B\u53C2\u8003" }), _jsx("button", { onClick: handleGenerateOutline, disabled: !apiIsReady || isGeneratingOutline, className: "rounded-2xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-950 shadow-sm disabled:opacity-50", children: "\u751F\u6210\u5927\u7EB2" })] })] })] }), _jsxs("div", { className: "rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm", children: [_jsx("div", { className: "text-xs font-black uppercase tracking-[0.22em] text-emerald-600", children: "Engine / \u5F15\u64CE\u72B6\u6001" }), _jsxs("div", { className: "mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-7 text-slate-700", children: ["Status: ", apiLog.status || "success", _jsx("br", {}), "Model: ", apiLog.lastModel || selectedModel, _jsx("br", {}), "Endpoint: ", apiLog.lastEndpoint || deepSeekEndpoint] }), _jsx("button", { onClick: openApiConnectionCenter, className: "mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800", children: "API Center / \u5207\u6362 API" })] })] }), _jsxs("main", { className: "rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm", children: [_jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs font-black uppercase tracking-[0.22em] text-violet-600", children: "02 Workflow / \u5236\u4F5C\u6D41\u7A0B" }), _jsx("h2", { className: "mt-2 text-3xl font-black tracking-[-0.035em] text-slate-950", children: "\u6838\u5FC3\u6D41\u7A0B\u53EA\u4FDD\u7559\u6700\u5E38\u7528\u52A8\u4F5C\u3002" }), _jsx("p", { className: "mt-2 text-sm leading-7 text-slate-600", children: "\u66F4\u591A\u9AD8\u7EA7\u53C2\u6570\u6536\u8FDB Project Studio \u548C\u65E0\u9650\u753B\u5E03\uFF0C\u907F\u514D\u9875\u9762\u7EE7\u7EED\u53D8\u4E71\u3002" })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { onClick: handleGenerateShotPlan, disabled: isPlanningShots, className: "rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-black text-amber-900 disabled:opacity-50", children: "\u5206\u955C\u89C4\u5212" }), _jsx("button", { onClick: handleGenerate, disabled: isGenerating, className: "rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white disabled:opacity-50", children: "\u667A\u80FD\u751F\u6210" }), _jsx("button", { onClick: openDirectorCanvas, className: "rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-black text-white", children: "\u65E0\u9650\u753B\u5E03" })] })] }), _jsx("div", { className: "mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2", children: [
                                            ["Prompt Prep / 提示词准备", "把需求整理成故事核、分镜语义和模型可执行 Prompt。", handlePromptOnlyProduction, "开始准备"],
                                            ["Shot Plan / 分镜规划", "先规划镜头职责、机位、情绪节点，再正式生成镜头。", handleGenerateShotPlan, "规划镜头"],
                                            ["Visual Canvas / 视觉画布", "进入黑色无限画布，使用文本、图片、视频节点做生产。", openDirectorCanvas, "打开画布"],
                                            ["Delivery Center / 交付中心", "导出 Prompt Pack、I2V 包、视频任务和客户包。", () => { setProjectStudioOpen(true); setProjectStudioTab("delivery"); }, "去交付"],
                                        ].map(([title, desc, fn, cta]) => _jsxs("button", { onClick: fn, className: "group rounded-[1.8rem] border border-slate-200 bg-slate-50 p-5 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg", children: [_jsx("div", { className: "text-xl font-black text-slate-950", children: title }), _jsx("p", { className: "mt-3 min-h-[54px] text-sm leading-7 text-slate-600", children: desc }), _jsx("div", { className: "mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-slate-700 ring-1 ring-slate-200 group-hover:bg-violet-50 group-hover:text-violet-700", children: cta })] }, title)) }), _jsx("div", { className: "mt-5 rounded-[1.8rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a,#312e81)] p-5 text-white", children: _jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs font-black uppercase tracking-[0.22em] text-cyan-200", children: "Infinite Canvas / \u65E0\u9650\u753B\u5E03" }), _jsx("h3", { className: "mt-2 text-2xl font-black", children: "\u753B\u5E03\u624D\u662F\u56FE\u7247\u548C\u89C6\u9891\u751F\u4EA7\u4E2D\u5FC3\u3002" }), _jsx("p", { className: "mt-2 text-sm leading-7 text-slate-300", children: "\u53CC\u51FB\u6DFB\u52A0\u8282\u70B9\uFF0C\u7A7A\u767D\u5904\u62D6\u62FD\u5E73\u79FB\uFF0C\u6587\u672C\u8282\u70B9\u8D70 DeepSeek\uFF0C\u56FE\u7247\u548C\u89C6\u9891\u8282\u70B9\u8D70\u5373\u68A6 / \u53EF\u7075\u3002" })] }), _jsx("button", { onClick: openDirectorCanvas, className: "rounded-2xl bg-white px-5 py-4 text-sm font-black text-slate-950", children: "\u8FDB\u5165\u753B\u5E03" })] }) })] }), _jsxs("aside", { className: "space-y-5", children: [_jsxs("div", { className: "rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm", children: [_jsx("div", { className: "text-xs font-black uppercase tracking-[0.22em] text-amber-600", children: "03 Output / \u8F93\u51FA\u72B6\u6001" }), _jsx("div", { className: "mt-4 space-y-3", children: [['分镜卡片', directorShots.length], ['关键帧', `${directorImageCount}/${directorShots.length || 0}`], ['视频任务', directorTaskCount], ['完成视频', directorVideoCount]].map(([a, b]) => _jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3", children: [_jsx("span", { className: "text-sm font-black text-slate-600", children: a }), _jsx("b", { className: "text-lg text-slate-950", children: b })] }, a)) }), _jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2", children: [_jsx("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab("shots"); }, className: "rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-black text-slate-700", children: "\u5206\u955C\u5361\u7247" }), _jsx("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab("visual"); }, className: "rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-black text-slate-700", children: "\u89C6\u89C9\u524D\u671F" }), _jsx("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab("prompt"); }, className: "rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-black text-slate-700", children: "\u63D0\u793A\u8BCD\u5305" }), _jsx("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab("delivery"); }, className: "rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-black text-slate-700", children: "\u4EA4\u4ED8\u4E2D\u5FC3" })] })] }), _jsxs("div", { className: "rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm", children: [_jsx("div", { className: "text-xs font-black uppercase tracking-[0.22em] text-fuchsia-600", children: "Video Agent / \u89C6\u9891\u667A\u80FD\u4F53" }), _jsxs("div", { className: "mt-4 space-y-3", children: [_jsx(FormField, { label: "Provider", zh: "\u89C6\u9891\u63A5\u53E3", children: _jsx(Select, { items: OPT.videoApiProviders, value: videoApiSettings.provider, onChange: v => setVideoApiSettings(p => ({ ...p, provider: v })) }) }), _jsx(FormField, { label: "Model / Agent", zh: "\u6A21\u578B\u6216\u667A\u80FD\u4F53", children: _jsx(Input, { value: videoApiSettings.model, onChange: e => setVideoApiSettings(p => ({ ...p, model: e.target.value })) }) }), _jsx("button", { onClick: handlePollAllVideoTasks, disabled: !Object.values(shotVideos || {}).some(v => v?.taskId), className: "w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-black text-white disabled:opacity-50", children: "\u67E5\u8BE2\u89C6\u9891\u72B6\u6001" })] })] })] })] })] }) });
    }
    return PolarisShell({ compact: true, children: _jsxs(_Fragment, { children: [_jsxs("section", { className: "polaris-v992-director-hero mb-5 overflow-hidden rounded-[2.2rem] border border-amber-300/15 p-5 shadow-2xl", children: [_jsxs("div", { className: "flex flex-col gap-5 2xl:flex-row 2xl:items-center 2xl:justify-between", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx("span", { className: "rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-amber-200", children: "Hollywood Director Flow Deck" }), _jsx("span", { className: "rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300", children: "Mode-Isolated Workspace" }), _jsx("span", { className: "rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300", children: "Shot Keyframe + Visual Lock" }), _jsx("span", { className: "rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-stone-400", children: "\u603B\u5DE5\u7A0B\u5E08 \u00B7 Haley\u9EC4\u884D\u8854 \u00B7 Authentic Seal" })] }), _jsx("h2", { className: "mt-4 text-3xl font-black tracking-[0.04em] text-white md:text-4xl", children: "\u5BFC\u6F14\u6A21\u5F0F \u00B7 \u597D\u83B1\u575E\u7EA7\u955C\u5934\u63A7\u5236\u53F0" }), _jsx("p", { className: "mt-3 max-w-5xl text-sm leading-7 text-stone-400", children: "\u91CD\u65B0\u8BBE\u8BA1\u4E3A\u201C\u5DE6\u4FA7\u955C\u5934\u8D44\u4EA7\u5E93 + \u4E2D\u592E\u521B\u4F5C\u4E2D\u67A2/\u5F53\u524D\u955C\u5934\u53F0 + \u53F3\u4FA7\u6807\u7B7E\u5F0F\u68C0\u67E5\u5668\u201D\u3002\u5BFC\u6F14\u6A21\u5F0F\u7684\u6838\u5FC3\u8F93\u5165\u3001\u5267\u672C\u5723\u7ECF\u3001\u5206\u955C\u89C4\u5212\u548C\u955C\u5934\u7F16\u8F91\u90FD\u96C6\u4E2D\u5728\u4E2D\u95F4\uFF0C\u53F3\u4FA7\u53EA\u4F5C\u4E3A\u4E13\u4E1A\u68C0\u67E5\u5668\u3002" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-4", children: [_jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/45 p-4 text-center", children: [_jsx("div", { className: "text-2xl font-black text-amber-300", children: shots.length || 0 }), _jsx("div", { className: "mt-1 text-[10px] font-black uppercase tracking-widest text-stone-500", children: "Shots" })] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/45 p-4 text-center", children: [_jsx("div", { className: "text-2xl font-black text-emerald-300", children: shotPlanRows.length || 0 }), _jsx("div", { className: "mt-1 text-[10px] font-black uppercase tracking-widest text-stone-500", children: "Plan" })] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/45 p-4 text-center", children: [_jsxs("div", { className: "text-2xl font-black text-cyan-300", children: [qualityReport?.score || qualityScore, "%"] }), _jsx("div", { className: "mt-1 text-[10px] font-black uppercase tracking-widest text-stone-500", children: "Quality" })] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/45 p-4 text-center", children: [_jsx("div", { className: "text-2xl font-black text-white", children: "51" }), _jsx("div", { className: "mt-1 text-[10px] font-black uppercase tracking-widest text-stone-500", children: "Modules + Prompt" })] })] })] }), _jsxs("div", { className: "mt-5 grid grid-cols-2 gap-3 lg:grid-cols-6", children: [_jsxs("button", { onClick: handlePromptOnlyProduction, disabled: isOneClickRunning || isGenerating, className: "rounded-2xl bg-emerald-400 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-black hover:bg-emerald-500 disabled:opacity-50", children: ["Prompt Only", _jsx("br", {}), _jsx("span", { className: "opacity-70", children: "\u53EA\u751F\u6210\u63D0\u793A\u8BCD" })] }), _jsxs("button", { onClick: handleFullVisualProduction, disabled: isOneClickRunning || isGenerating, className: "rounded-2xl border border-cyan-300/25 bg-cyan-400/10 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-cyan-200 hover:bg-cyan-400/20 disabled:opacity-50", children: ["Full Visual", _jsx("br", {}), _jsx("span", { className: "opacity-70", children: "\u63D0\u793A\u8BCD+\u56FE\u7247" })] }), _jsxs("button", { onClick: handleGenerateShotPlan, disabled: isPlanningShots, className: "rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-amber-200 hover:bg-amber-400/20 disabled:opacity-40", children: ["Shot Plan", _jsx("br", {}), _jsx("span", { className: "opacity-70", children: "\u5206\u955C\u89C4\u5212" })] }), _jsxs("button", { onClick: handleGenerateFromShotPlan, disabled: isGenerating || !shotPlanRows.length, className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 disabled:opacity-40", children: ["Generate From Plan", _jsx("br", {}), _jsx("span", { className: "opacity-70", children: "\u6309\u89C4\u5212\u751F\u6210" })] }), _jsxs("button", { onClick: handleGenerate, disabled: isGenerating, className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 disabled:opacity-40", children: ["Smart Generate", _jsx("br", {}), _jsx("span", { className: "opacity-70", children: "\u667A\u80FD\u751F\u6210" })] }), _jsxs("button", { onClick: handleRepairMissingCoverage, disabled: !shots.length || isRepairingCoverage, className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 disabled:opacity-40", children: ["Add Missing", _jsx("br", {}), _jsx("span", { className: "opacity-70", children: "\u68C0\u67E5\u8865\u955C\u5934" })] }), _jsxs("button", { onClick: () => makeWord(rebuildFinalPrompts(shots), project, script, style, tech, modules), disabled: !shots.length, className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 disabled:opacity-40", children: ["Export Word", _jsx("br", {}), _jsx("span", { className: "opacity-70", children: "\u5BFC\u51FA\u811A\u672C" })] }), _jsxs("button", { onClick: () => downloadPromptPack(rebuildFinalPrompts(shots), project), disabled: !shots.length, className: "rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-200 hover:bg-emerald-400/20 disabled:opacity-40", children: ["Prompt Pack", _jsx("br", {}), _jsx("span", { className: "opacity-70", children: "\u7EAF\u63D0\u793A\u8BCD\u5305" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-5 2xl:grid-cols-[310px_minmax(0,1fr)_420px]", children: [_jsxs("aside", { className: "space-y-5 2xl:sticky 2xl:top-28 2xl:self-start", children: [_jsx(GlassPanel, { title: "Shot Library", subTitle: "\u955C\u5934\u8D44\u4EA7\u5E93", defaultOpen: true, children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("button", { onClick: () => importCurrentWorkspaceTo("pro"), className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase text-white hover:bg-white/10", children: ["Import to Pro", _jsx("br", {}), _jsx("span", { className: "opacity-60", children: "\u5BFC\u5165\u4E13\u4E1A" })] }), _jsxs("button", { onClick: resetCurrentWorkspace, className: "rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-[10px] font-black uppercase text-red-200 hover:bg-red-400/20", children: ["Reset", _jsx("br", {}), _jsx("span", { className: "opacity-60", children: "\u91CD\u7F6E" })] })] }), _jsxs("div", { className: "rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-4 text-[10px] leading-5 text-emerald-100/80", children: [_jsx("div", { className: "font-black uppercase tracking-[0.22em] text-emerald-300", children: "Director Shortcuts / \u5BFC\u6F14\u5FEB\u6377\u952E" }), _jsx("div", { className: "mt-2", children: "\u2190 / [ \u4E0A\u4E00\u4E2A\u955C\u5934 \u00B7 \u2192 / ] \u4E0B\u4E00\u4E2A\u955C\u5934" }), _jsx("div", { children: "Ctrl/\u2318 + C \u590D\u5236\u5F53\u524D\u89C6\u9891\u63D0\u793A\u8BCD \u00B7 Ctrl/\u2318 + R \u91CD\u751F\u6210\u5F53\u524D\u955C\u5934" })] }), _jsx("div", { className: "max-h-[48vh] space-y-3 overflow-y-auto pr-1", children: shots.length ? shots.map((s, i) => _jsxs("button", { onClick: () => setActiveShot(i), className: `w-full rounded-2xl border p-4 text-left transition ${activeShot === i ? "border-amber-400 bg-amber-400 text-black shadow-[0_0_35px_rgba(251,191,36,0.18)]" : "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"}`, children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { className: "text-[10px] font-black uppercase tracking-widest", children: ["Shot ", i + 1] }), _jsx("div", { className: "text-[10px] font-black opacity-70", children: s.duration })] }), _jsx("div", { className: "mt-2", children: _jsx(ShotRoleBadge, { shot: s, active: activeShot === i }) }), _jsx("div", { className: "mt-2 text-sm font-black leading-5", children: s.titleZh || s.titleEn }), _jsx("div", { className: "mt-2 line-clamp-2 text-[11px] leading-5 opacity-70", children: s.sceneZh || s.sceneEn }), _jsxs("div", { className: "mt-3 flex flex-wrap gap-2 text-[9px] font-black uppercase opacity-70", children: [_jsx("span", { children: s.shotSize }), _jsx("span", { children: "\u00B7" }), _jsx("span", { children: s.move })] })] }, i)) : _jsx("div", { className: "rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center text-sm text-stone-500", children: "\u6682\u65E0\u955C\u5934\u3002\u5148\u751F\u6210\u5206\u955C\u6216\u5BFC\u5165\u9879\u76EE\u3002" }) })] }) }), _jsx(GlassPanel, { title: "Plan + Versions", subTitle: "\u89C4\u5212\u4E0E\u7248\u672C", defaultOpen: true, children: _jsxs("div", { className: "space-y-4", children: [_jsxs("details", { open: true, className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("summary", { className: "cursor-pointer list-none text-[11px] font-black uppercase tracking-[0.18em] text-amber-200", children: "Shot Plan / \u5206\u955C\u89C4\u5212\u8868" }), _jsx("div", { className: "mt-3 max-h-[260px] space-y-2 overflow-y-auto", children: shotPlanRows.length ? shotPlanRows.map((r, i) => _jsxs("div", { className: "rounded-xl border border-white/10 bg-black/35 p-3", children: [_jsxs("div", { className: "text-[10px] font-black text-amber-300", children: ["#", r.shotNo || i + 1, " \u00B7 ", r.roleZh || r.role || "Role"] }), _jsx("div", { className: "mt-1 text-[11px] leading-5 text-stone-300", children: r.beatZh || r.beat || r.beatEn })] }, i)) : _jsx("div", { className: "text-[11px] text-stone-500", children: "\u8FD8\u6CA1\u6709\u5206\u955C\u89C4\u5212\u8868\u3002" }) })] }), _jsxs("details", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("summary", { className: "cursor-pointer list-none text-[11px] font-black uppercase tracking-[0.18em] text-amber-200", children: "History / \u751F\u6210\u5386\u53F2" }), _jsx("div", { className: "mt-3 max-h-[220px] space-y-2 overflow-y-auto", children: generationHistory.length ? generationHistory.map(h => _jsxs("button", { onClick: () => { setShots(h.shots); setActiveShot(0); setStatus(`Restored history / 已恢复历史版本 ${h.time}`); }, className: "w-full rounded-xl border border-white/10 bg-black/35 p-3 text-left hover:bg-white/10", children: [_jsx("div", { className: "text-[10px] font-black text-amber-300", children: h.time }), _jsxs("div", { className: "mt-1 text-[11px] text-white", children: [h.shotCount, " shots \u00B7 ", h.model] }), _jsx("div", { className: "mt-1 line-clamp-2 text-[10px] text-stone-500", children: h.scriptPreview })] }, h.id)) : _jsx("div", { className: "text-[11px] text-stone-500", children: "\u6682\u65E0\u5386\u53F2\u7248\u672C\u3002" }) })] }), _jsxs("details", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("summary", { className: "cursor-pointer list-none text-[11px] font-black uppercase tracking-[0.18em] text-amber-200", children: "Prompt Versions / \u63D0\u793A\u8BCD\u7248\u672C" }), _jsx("div", { className: "mt-3 max-h-[220px] space-y-2 overflow-y-auto", children: promptVersions.length ? promptVersions.map(v => _jsxs("button", { onClick: () => { if (v.shots)
                                                                setShots(v.shots); setStatus(`Prompt version restored / 已恢复提示词版本 ${v.time}`); }, className: "w-full rounded-xl border border-white/10 bg-black/35 p-3 text-left hover:bg-white/10", children: [_jsx("div", { className: "text-[10px] font-black text-cyan-300", children: v.time || "Version" }), _jsx("div", { className: "mt-1 text-[11px] text-stone-300", children: v.reason || v.label || "Prompt snapshot" })] }, v.id)) : _jsx("div", { className: "text-[11px] text-stone-500", children: "\u6682\u65E0\u63D0\u793A\u8BCD\u7248\u672C\u3002" }) })] })] }) })] }), _jsxs("section", { className: "min-w-0 space-y-5", children: [_jsxs("div", { className: "rounded-[2rem] border border-amber-300/20 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.14),rgba(0,0,0,0.35)_42%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(0,0,0,0.25))] p-5 backdrop-blur-2xl", children: [_jsxs("div", { className: "flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.28em] text-amber-200", children: "Director Flow Deck / \u5BFC\u6F14\u6D41\u7A0B\u6307\u6325\u53F0" }), _jsx("h3", { className: "mt-2 text-2xl font-black text-white", children: "\u6309\u5BFC\u6F14\u5DE5\u4F5C\u6D41\u63A8\u8FDB\uFF1A\u521B\u4F5C \u2192 \u89C4\u5212 \u2192 \u955C\u5934 \u2192 \u63D0\u793A\u8BCD \u2192 \u5173\u952E\u5E27 \u2192 \u5BA1\u7247 \u2192 \u4EA4\u4ED8" }), _jsx("p", { className: "mt-2 text-[12px] leading-6 text-stone-400", children: "\u5BFC\u6F14\u6A21\u5F0F\u4E0D\u518D\u628A\u5168\u90E8\u529F\u80FD\u5806\u5728\u4E00\u8D77\uFF0C\u6838\u5FC3\u64CD\u4F5C\u96C6\u4E2D\u5728\u4E2D\u95F4\uFF0C\u53F3\u4FA7\u68C0\u67E5\u5668\u53EA\u8D1F\u8D23\u5F53\u524D\u6B65\u9AA4\u7684\u9AD8\u7EA7\u63A7\u5236\u3002" })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { onClick: () => setProjectStudioOpen(true), className: "rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-cyan-200", children: "Project Studio / \u9879\u76EE\u4E2D\u5FC3" }), _jsx("button", { onClick: () => { setProjectStudioOpen(true); setProjectStudioTab("workflow"); }, className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white", children: "Workflow / \u6D41\u7A0B\u603B\u89C8" })] })] }), _jsx("div", { className: "mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8", children: [
                                                { no: "01", title: "Creative", zh: "创作中枢", sub: "需求/剧本", active: directorView === "brief", action: () => { setDirectorView("brief"); setDirectorInspectorTab("setup"); } },
                                                { no: "02", title: "Plan", zh: "分镜规划", sub: "数量/覆盖", active: directorInspectorTab === "planning", action: () => { setDirectorView("brief"); setDirectorInspectorTab("planning"); } },
                                                { no: "03", title: "Shot", zh: "镜头编辑", sub: "画面/表演", active: directorView === "scene", action: () => { setDirectorView("scene"); setDirectorInspectorTab("look"); } },
                                                { no: "04", title: "Continuity", zh: "连续性", sub: "承接/状态", active: directorView === "continuity", action: () => { setDirectorView("continuity"); setDirectorInspectorTab("modules"); } },
                                                { no: "05", title: "Prompt", zh: "提示词", sub: "编译/适配", active: directorView === "prompts", action: () => { setDirectorView("prompts"); setDirectorInspectorTab("tools"); } },
                                                { no: "06", title: "Keyframe", zh: "关键帧", sub: "Seedream", active: projectStudioOpen && projectStudioTab === "visual", action: () => { setProjectStudioOpen(true); setProjectStudioTab("visual"); } },
                                                { no: "07", title: "Review", zh: "审片", sub: "质量/风险", active: directorInspectorTab === "review", action: () => { setDirectorInspectorTab("review"); } },
                                                { no: "08", title: "Delivery", zh: "交付", sub: "导出/封存", active: projectStudioOpen && projectStudioTab === "delivery", action: () => { setProjectStudioOpen(true); setProjectStudioTab("delivery"); } },
                                            ].map(item => _jsxs("button", { onClick: item.action, className: `rounded-2xl border p-3 text-left transition ${item.active ? "border-amber-300 bg-amber-300 text-black" : "border-white/10 bg-black/35 text-stone-300 hover:bg-white/10"}`, children: [_jsxs("div", { className: "text-[10px] font-black uppercase tracking-[0.18em] opacity-70", children: [item.no, " \u00B7 ", item.title] }), _jsx("div", { className: "mt-1 text-sm font-black", children: item.zh }), _jsx("div", { className: "mt-1 text-[10px] opacity-60", children: item.sub })] }, item.no)) }), _jsxs("div", { className: "mt-4 grid grid-cols-1 gap-3 lg:grid-cols-4", children: [_jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/30 p-3 text-[11px] leading-5 text-stone-300", children: [_jsx("b", { className: "text-amber-200", children: "\u8F93\u5165\u72B6\u6001\uFF1A" }), ideaInput ? "一句话需求已填写" : "等待一句话需求", " \u00B7 ", script ? "剧本圣经已准备" : "剧本未锁定"] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/30 p-3 text-[11px] leading-5 text-stone-300", children: [_jsx("b", { className: "text-cyan-200", children: "\u5206\u955C\u72B6\u6001\uFF1A" }), shotPlanRows.length ? `规划 ${shotPlanRows.length} 行` : "尚未规划", " \u00B7 ", shots.length ? `${shots.length} 镜头` : "未生成"] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/30 p-3 text-[11px] leading-5 text-stone-300", children: [_jsx("b", { className: "text-purple-200", children: "\u5173\u952E\u5E27\uFF1A" }), Object.values(shotKeyframes).filter(x => x?.images?.length).length, "/", shots.length || 0, " \u00B7 ", Object.keys(visualLocks || {}).filter(k => visualLocks[k]?.description).length, " \u4E2A\u9501\u5B9A"] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/30 p-3 text-[11px] leading-5 text-stone-300", children: [_jsx("b", { className: "text-emerald-200", children: "\u4EA4\u4ED8\uFF1A" }), lastArchiveId ? `已封存 ${lastArchiveId}` : "待封存", " \u00B7 ", qualityReport ? "已有审片报告" : "待审片"] })] })] }), _jsx("div", { className: "rounded-[2rem] border border-white/10 bg-black/45 p-4 backdrop-blur-2xl", children: _jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.28em] text-stone-500", children: "Director Center Desk / \u5BFC\u6F14\u4E2D\u95F4\u5DE5\u4F5C\u53F0" }), _jsx("div", { className: "mt-1 truncate text-xl font-black text-white", children: directorView === "brief" ? "一句话创作需求 · 剧本圣经 · 分镜启动" : active ? `${active.titleZh || "当前镜头"} / ${active.titleEn || "Current Shot"}` : "等待分镜生成" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: directorViews.map(tab => _jsx("button", { onClick: () => setDirectorView(tab.id), className: `rounded-2xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${directorView === tab.id ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"}`, children: tab.label }, tab.id)) })] }) }), _jsx(GlassPanel, { title: directorView === "brief" ? "Director Creative Core" : "Current Shot Editor", subTitle: directorView === "brief" ? "导演模式重点输入区" : "当前镜头专业编辑区", defaultOpen: true, children: directorView === "brief" ? _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "rounded-[2rem] border border-amber-300/15 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.14),rgba(0,0,0,0.55)_42%)] p-6", children: [_jsxs("div", { className: "flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.26em] text-amber-200", children: "One-Line Creative Brief / \u5BFC\u6F14\u6A21\u5F0F\u4E00\u53E5\u8BDD\u521B\u4F5C\u9700\u6C42" }), _jsx("p", { className: "mt-2 text-sm leading-7 text-stone-400", children: "\u8FD9\u91CC\u662F\u5BFC\u6F14\u6A21\u5F0F\u7684\u6838\u5FC3\u5165\u53E3\u3002\u5148\u628A\u521B\u4F5C\u9700\u6C42\u3001\u53C2\u8003\u94FE\u63A5\u3001\u4EBA\u7269\u4FE1\u606F\u548C\u5267\u672C\u5723\u7ECF\u96C6\u4E2D\u5728\u4E2D\u95F4\uFF0C\u518D\u8FDB\u5165\u5206\u955C\u89C4\u5212\u4E0E\u955C\u5934\u7F16\u8F91\u3002" })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { onClick: handleIngestReference, disabled: isIngestingReference, className: "rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-200 disabled:opacity-50", children: "Analyze Ref / \u8BC6\u522B\u53C2\u8003" }), _jsx("button", { onClick: handleGenerateOutline, disabled: isGeneratingOutline, className: "rounded-2xl bg-amber-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black disabled:opacity-50", children: "Generate Outline / \u751F\u6210\u5927\u7EB2" }), _jsx("button", { onClick: handlePromptOnlyProduction, disabled: isOneClickRunning || isGenerating, className: "rounded-2xl bg-emerald-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black disabled:opacity-50", children: "Prompt Only / \u53EA\u751F\u6210\u63D0\u793A\u8BCD" }), _jsx("button", { onClick: handleFullVisualProduction, disabled: isOneClickRunning || isGenerating, className: "rounded-2xl border border-cyan-300/25 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-cyan-200 disabled:opacity-50", children: "Full Visual / \u542B\u56FE\u7247\u6D41\u7A0B" })] })] }), _jsxs("div", { className: "mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]", children: [_jsx(FormField, { label: "Director Creative Requirement", zh: "\u4E00\u53E5\u8BDD\u521B\u4F5C\u9700\u6C42", children: _jsx(TextArea, { value: ideaInput, onChange: e => setIdeaInput(e.target.value), rows: 7, className: "min-h-[190px] text-base font-bold", placeholder: "\u4F8B\u5982\uFF1A\u5199\u4E00\u4E2A\u5173\u4E8E\u9999\u6E2F\u6587\u5316\u7684\u77ED\u89C6\u9891\uFF0C\u8981\u6709\u5267\u60C5\uFF0C\u8981\u6709\u7206\u6B3E\u601D\u7EF4\uFF0C1\u5206\u949F\u5185\u7684\u77ED\u89C6\u9891\u811A\u672C\u3002" }) }), _jsxs("div", { className: "grid grid-cols-1 gap-4", children: [_jsx(FormField, { label: "Project", zh: "\u9879\u76EE\u540D\u79F0", children: _jsx(Input, { value: project, onChange: e => setProject(e.target.value) }) }), _jsx(FormField, { label: "Reference URL", zh: "\u53C2\u8003\u94FE\u63A5", children: _jsx(Input, { value: referenceUrl, onChange: e => setReferenceUrl(e.target.value), placeholder: "https://..." }) }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Toggle, { checked: douyinViral.enabled, onChange: v => setDouyinViral(p => ({ ...p, enabled: v })), label: "Douyin Viral", zh: "\u6296\u97F3\u7206\u6B3E" }), _jsx(Toggle, { checked: tech.generateSceneImagePrompt, onChange: v => setTech(p => ({ ...p, generateSceneImagePrompt: v })), label: "Scene Image", zh: "\u573A\u666F\u56FE" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-5 xl:grid-cols-2", children: [_jsxs("div", { className: "space-y-5", children: [_jsx(GlassPanel, { title: "Script Import Lab", subTitle: "Word\u5267\u672C\u6587\u6863\u5BFC\u5165\u5206\u6790\u5BA4", defaultOpen: true, children: _jsxs("div", { className: "space-y-5", children: [_jsx("div", { className: "rounded-2xl border border-cyan-300/15 bg-cyan-400/5 p-4 text-[12px] leading-6 text-stone-300", children: "\u652F\u6301 .docx / .txt / .md\u3002\u5BFC\u5165\u540E\u53EF\u5206\u6790\u4EBA\u7269\u3001\u573A\u666F\u3001\u5BF9\u767D\u3001\u60C5\u7EEA\u66F2\u7EBF\u3001\u5206\u573A\u7ED3\u6784\uFF0C\u5E76\u5199\u5165\u5267\u672C\u4E0E\u521B\u4F5C\u5723\u7ECF\u3002" }), _jsx(FormField, { label: "Import Script Document", zh: "\u5BFC\u5165Word\u5267\u672C", children: _jsx("input", { type: "file", accept: ".docx,.txt,.md,.markdown", onChange: handleScriptDocumentUpload, className: "block w-full rounded-2xl border border-white/10 bg-black/70 px-5 py-3 text-sm text-white file:mr-4 file:rounded-xl file:border-0 file:bg-amber-400 file:px-4 file:py-2 file:text-xs file:font-black file:text-black" }) }), scriptImportMeta?.name && _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4 text-[11px] leading-6 text-stone-300", children: [_jsx("b", { className: "text-amber-200", children: scriptImportMeta.name }), _jsx("br", {}), "Type: ", scriptImportMeta.type, " \u00B7 Parser: ", scriptImportMeta.parser, " \u00B7 Text: ", scriptImportText.length, " chars"] }), _jsx(FormField, { label: "Imported Script Text", zh: "\u5BFC\u5165\u6587\u672C\u9884\u89C8/\u53EF\u624B\u52A8\u7C98\u8D34", children: _jsx(TextArea, { value: scriptImportText, onChange: e => setScriptImportText(e.target.value), rows: 6, placeholder: "\u4E5F\u53EF\u4EE5\u76F4\u63A5\u7C98\u8D34\u5267\u672C\u6587\u6863\u6B63\u6587\u3002" }) }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx("button", { onClick: handleAnalyzeImportedScript, disabled: isAnalyzingImportedScript || isImportingScript || !scriptImportText.trim(), className: "rounded-2xl bg-cyan-400 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black disabled:opacity-50", children: "Analyze Script / \u5206\u6790\u5267\u672C" }), _jsx("button", { onClick: handleApplyImportedScriptToBible, disabled: !scriptImportText.trim(), className: "rounded-2xl border border-amber-300/20 bg-amber-400/10 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-amber-200 disabled:opacity-40", children: "Apply to Bible / \u5199\u5165\u521B\u4F5C\u5723\u7ECF" }), _jsx("button", { onClick: handleGenerateShotPlanFromImport, disabled: !scriptImportText.trim() || isPlanningShots, className: "rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-emerald-200 disabled:opacity-40", children: "Shot Plan From Script / \u4ECE\u6587\u6863\u89C4\u5212\u5206\u955C" })] }), scriptImportScenes.length > 0 && _jsx(FormField, { label: "Scene Selection", zh: "\u9009\u62E9\u751F\u6210\u8303\u56F4", children: _jsx(Select, { items: ["all", ...scriptImportScenes.map((s, i) => String(s.sceneId || s.id || s.index || i + 1))], value: selectedImportScene, onChange: setSelectedImportScene }) }), scriptImportAnalysis && _jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/40 p-5", children: [_jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.24em] text-cyan-200", children: "Script Analysis Report / \u5267\u672C\u5206\u6790\u62A5\u544A" }), _jsx("div", { className: "mt-3 whitespace-pre-wrap text-[12px] leading-6 text-stone-300", children: summarizeImportedScriptAnalysis(scriptImportAnalysis) || scriptImportAnalysis.analysisReport || "已完成分析。" }), scriptImportScenes.length > 0 && _jsx("div", { className: "mt-4 grid grid-cols-1 gap-2", children: scriptImportScenes.slice(0, 8).map((s, i) => _jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-3 text-[11px] leading-5 text-stone-300", children: [_jsx("b", { className: "text-amber-200", children: s.titleZh || s.titleEn || `Scene ${i + 1}` }), _jsx("br", {}), s.storyFunction || s.emotionalBeat || s.rawTextSummary || "分场信息"] }, i)) })] })] }) }), _jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/35 p-5", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[12px] font-black uppercase tracking-[0.24em] text-amber-200", children: "Script & Creative Bible / \u5267\u672C\u5723\u7ECF" }), _jsx("div", { className: "mt-1 text-[11px] text-stone-500", children: "\u5BFC\u6F14\u6A21\u5F0F\u4E3B\u6587\u672C\uFF0C\u6B63\u5F0F\u5206\u955C\u4F1A\u4EE5\u8FD9\u91CC\u4E3A\u6700\u9AD8\u4F18\u5148\u7EA7\u3002" })] }), outlineDraft && _jsx("button", { onClick: handleConfirmOutline, className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase text-white", children: "Confirm Outline / \u786E\u8BA4\u5927\u7EB2" })] }), _jsx(TextArea, { value: script, onChange: e => setScript(e.target.value), rows: 10, className: "min-h-[300px] text-base font-bold", placeholder: "\u751F\u6210\u5927\u7EB2\u540E\u786E\u8BA4\u5230\u8FD9\u91CC\uFF0C\u6216\u76F4\u63A5\u8F93\u5165\u5B8C\u6574\u5267\u672C/\u521B\u4F5C\u5723\u7ECF\u3002" })] }), outlineDraft && _jsxs("div", { className: "rounded-3xl border border-amber-300/15 bg-amber-400/5 p-5", children: [_jsx("div", { className: "mb-3 text-[12px] font-black uppercase tracking-[0.24em] text-amber-200", children: "Outline Draft / \u5F85\u786E\u8BA4\u5927\u7EB2" }), _jsx(TextArea, { value: outlineDraft, onChange: e => setOutlineDraft(e.target.value), rows: 7, className: "min-h-[210px]" })] })] }), _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/35 p-5", children: [_jsx("div", { className: "mb-4 text-[12px] font-black uppercase tracking-[0.24em] text-emerald-200", children: "Reference + Viral Strategy / \u53C2\u8003\u4E0E\u7206\u6B3E\u7B56\u7565" }), _jsxs("div", { className: "grid grid-cols-1 gap-4", children: [_jsx(FormField, { label: "Manual Reference", zh: "\u5907\u7528\u53C2\u8003\u5185\u5BB9", children: _jsx(TextArea, { value: referenceManualContent, onChange: e => setReferenceManualContent(e.target.value), rows: 4, placeholder: "\u5982\u679C\u94FE\u63A5\u65E0\u6CD5\u8BFB\u53D6\uFF0C\u7C98\u8D34\u89C6\u9891\u6587\u6848\u3001\u6807\u9898\u3001\u8BC4\u8BBA\u533A\u91CD\u70B9\u6216\u4EBA\u7269\u8D44\u6599\u3002" }) }), _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [_jsx(FormField, { label: "Reference Use", zh: "\u53C2\u8003\u7528\u9014", children: _jsx(Select, { items: OPT.referenceUseModes, value: referenceUseMode, onChange: setReferenceUseMode }) }), _jsx(FormField, { label: "Viral Type", zh: "\u77ED\u89C6\u9891\u7C7B\u578B", children: _jsx(Select, { items: OPT.douyinVideoTypes, value: douyinViral.videoType, onChange: v => setDouyinViral(p => ({ ...p, videoType: v })) }) }), _jsx(FormField, { label: "Hook Style", zh: "3\u79D2\u94A9\u5B50", children: _jsx(Select, { items: OPT.viralHookStyles, value: douyinViral.hookStyle, onChange: v => setDouyinViral(p => ({ ...p, hookStyle: v })) }) }), _jsx(FormField, { label: "Duration", zh: "\u77ED\u89C6\u9891\u65F6\u957F", children: _jsx(Select, { items: OPT.shortVideoDurations, value: douyinViral.duration, onChange: v => setDouyinViral(p => ({ ...p, duration: v })) }) })] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/40 p-4 text-[11px] leading-6 text-stone-300", children: [_jsxs("div", { className: "font-black text-emerald-300", children: ["Reference Status / \u53C2\u8003\u8BC6\u522B\u72B6\u6001\uFF1A", referenceIngest.status] }), _jsx("div", { className: "mt-2 whitespace-pre-wrap", children: referenceIngest.summary || referenceIngest.usableFacts || "暂无参考解析。可输入链接后点击识别，或粘贴备用参考内容。" })] })] })] }), _jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/35 p-5", children: [_jsx("div", { className: "mb-4 text-[12px] font-black uppercase tracking-[0.24em] text-cyan-200", children: "Shot Launch Console / \u5206\u955C\u542F\u52A8\u53F0" }), _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [_jsx(FormField, { label: "Shot Count Mode", zh: "\u5206\u955C\u6A21\u5F0F", children: _jsx(Select, { items: OPT.shotCountModes, value: tech.shotCountMode, onChange: v => setTech(p => ({ ...p, shotCountMode: v })) }) }), _jsx(FormField, { label: "Smart Range", zh: "\u667A\u80FD\u8303\u56F4", children: _jsx(Select, { items: OPT.shotRanges, value: tech.shotRange, onChange: v => setTech(p => ({ ...p, shotRange: v })) }) }), _jsx(FormField, { label: "Shot Density", zh: "\u955C\u5934\u5BC6\u5EA6", children: _jsx(Select, { items: OPT.shotDensities, value: tech.shotDensity, onChange: v => setTech(p => ({ ...p, shotDensity: v })) }) }), _jsx(FormField, { label: "Director Style", zh: "\u5BFC\u6F14\u98CE\u683C", children: _jsx(Select, { items: DIRECTOR_STYLES.map(s => s.name), value: style.name, onChange: v => setStyle(DIRECTOR_STYLES.find(s => s.name === v) || DIRECTOR_STYLES[0]) }) }), _jsx(FormField, { label: "Content Mode", zh: "\u5185\u5BB9\u589E\u5F3A\u6A21\u5F0F", children: _jsx(Select, { items: OPT.contentEngineModes, value: tech.contentEngineMode, onChange: v => setTech(p => ({ ...p, contentEngineMode: v })) }) }), _jsx(FormField, { label: "Prompt Strength", zh: "\u63D0\u793A\u8BCD\u5F3A\u5EA6", children: _jsx(Select, { items: OPT.promptStrengthLevels, value: tech.promptStrength, onChange: v => setTech(p => ({ ...p, promptStrength: v })) }) }), _jsx(FormField, { label: "Prompt Length", zh: "\u63D0\u793A\u8BCD\u957F\u5EA6", children: _jsx(Select, { items: OPT.promptLengthModes, value: tech.promptLength, onChange: v => setTech(p => ({ ...p, promptLength: v })) }) }), _jsx(FormField, { label: "Rewrite Mode", zh: "\u63D0\u793A\u8BCD\u6539\u5199\u65B9\u5411", children: _jsx(Select, { items: OPT.promptRewriteModes, value: tech.promptRewriteMode, onChange: v => setTech(p => ({ ...p, promptRewriteMode: v })) }) })] }), _jsxs("div", { className: "mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-[11px] leading-6 text-stone-300", children: [shotPlan.summaryZh, NL, shotPlan.summaryEn] }), _jsxs("div", { className: "mt-4 grid grid-cols-1 gap-3 md:grid-cols-3", children: [_jsx("button", { onClick: handleGenerateShotPlan, disabled: isPlanningShots, className: "rounded-2xl bg-amber-400 px-4 py-3 text-[10px] font-black uppercase text-black disabled:opacity-50", children: "Shot Plan / \u5206\u955C\u89C4\u5212" }), _jsx("button", { onClick: handleGenerateFromShotPlan, disabled: isGenerating || !shotPlanRows.length, className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase text-white disabled:opacity-40", children: "From Plan / \u6309\u89C4\u5212\u751F\u6210" }), _jsx("button", { onClick: handleGenerate, disabled: isGenerating, className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase text-white disabled:opacity-40", children: "Smart Generate / \u667A\u80FD\u751F\u6210" })] })] })] })] })] }) : active ? _jsxs("div", { className: "space-y-6", children: [directorView === "scene" && _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-2", children: [_jsx(FormField, { label: "Visual ZH", zh: "\u4E2D\u6587\u753B\u9762", children: _jsx(TextArea, { value: active.sceneZh, rows: 6, onChange: e => updateActiveShot({ sceneZh: e.target.value }) }) }), _jsx(FormField, { label: "Visual EN", zh: "\u82F1\u6587\u753B\u9762", children: _jsx(TextArea, { value: active.sceneEn, rows: 6, onChange: e => updateActiveShot({ sceneEn: e.target.value }) }) }), _jsx(FormField, { label: "Dialogue ZH", zh: "\u4E2D\u6587\u53F0\u8BCD", children: _jsx(TextArea, { value: active.dialogueZh, rows: 3, onChange: e => updateActiveShot({ dialogueZh: e.target.value }) }) }), _jsx(FormField, { label: "Dialogue EN", zh: "\u82F1\u6587\u53F0\u8BCD", children: _jsx(TextArea, { value: active.dialogueEn, rows: 3, onChange: e => updateActiveShot({ dialogueEn: e.target.value }) }) }), _jsx(FormField, { label: "AV Logic ZH", zh: "\u4E2D\u6587\u89C6\u542C\u903B\u8F91", children: _jsx(TextArea, { value: active.avLogicZh, rows: 4, onChange: e => updateActiveShot({ avLogicZh: e.target.value }) }) }), _jsx(FormField, { label: "AV Logic EN", zh: "\u82F1\u6587\u89C6\u542C\u903B\u8F91", children: _jsx(TextArea, { value: active.avLogicEn, rows: 4, onChange: e => updateActiveShot({ avLogicEn: e.target.value }) }) }), _jsx(FormField, { label: "Blocking ZH", zh: "\u4E2D\u6587\u8C03\u5EA6", children: _jsx(TextArea, { value: active.blockingZh, rows: 4, onChange: e => updateActiveShot({ blockingZh: e.target.value }) }) }), _jsx(FormField, { label: "Blocking EN", zh: "\u82F1\u6587\u8C03\u5EA6", children: _jsx(TextArea, { value: active.blockingEn, rows: 4, onChange: e => updateActiveShot({ blockingEn: e.target.value }) }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 xl:grid-cols-4", children: [_jsx(FormField, { label: "Shot Size", zh: "\u666F\u522B", children: _jsx(Select, { items: OPT.shotSizes, value: active.shotSize, onChange: v => updateActiveShot({ shotSize: v }) }) }), _jsx(FormField, { label: "Camera", zh: "\u6444\u5F71\u673A", children: _jsx(Select, { items: OPT.cameras, value: active.camera, onChange: v => updateActiveShot({ camera: v }) }) }), _jsx(FormField, { label: "Lens", zh: "\u7126\u6BB5", children: _jsx(Select, { items: OPT.lensFocals, value: active.lens, onChange: v => updateActiveShot({ lens: v }) }) }), _jsx(FormField, { label: "Movement", zh: "\u8FD0\u955C", children: _jsx(Select, { items: OPT.moves, value: active.move, onChange: v => updateActiveShot({ move: v }) }) }), _jsx(FormField, { label: "Stabilizer", zh: "\u7A33\u5B9A", children: _jsx(Select, { items: OPT.stabilizers, value: active.stabilizer, onChange: v => updateActiveShot({ stabilizer: v }) }) }), _jsx(FormField, { label: "Lighting", zh: "\u5149\u5F71", children: _jsx(Select, { items: OPT.lights, value: active.light, onChange: v => updateActiveShot({ light: v }) }) }), _jsx(FormField, { label: "Composition", zh: "\u6784\u56FE", children: _jsx(Select, { items: OPT.compositions, value: active.compositionType, onChange: v => updateActiveShot({ compositionType: v }) }) }), _jsx(FormField, { label: "Edit", zh: "\u526A\u8F91", children: _jsx(Select, { items: OPT.edits, value: active.editType, onChange: v => updateActiveShot({ editType: v }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-2", children: [_jsx(FormField, { label: "Omni Multi-Parameter", zh: "\u5168\u80FD\u591A\u53C2", children: _jsx(TextArea, { value: `${active.omniParamPromptZh}${NL}${active.omniParamPromptEn}`, rows: 4, onChange: e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ omniParamPromptZh: zh, omniParamPromptEn: en.join(NL) }); } }) }), _jsx(FormField, { label: "Platform Params", zh: "\u5E73\u53F0\u53C2\u6570", children: _jsx(TextArea, { value: `${active.platformPromptZh}${NL}${active.platformPromptEn}`, rows: 4, onChange: e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ platformPromptZh: zh, platformPromptEn: en.join(NL) }); } }) }), _jsx(FormField, { label: "Sound", zh: "\u58F0\u97F3\u8BBE\u8BA1", children: _jsx(TextArea, { value: `${active.soundDesignZh}${NL}${active.soundDesignEn}`, rows: 4, onChange: e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ soundDesignZh: zh, soundDesignEn: en.join(NL) }); } }) }), _jsx(FormField, { label: "Continuity Check", zh: "\u8FDE\u7EED\u6027\u68C0\u67E5", children: _jsx(TextArea, { value: `${active.continuityCheckZh}${NL}${active.continuityCheckEn}`, rows: 4, onChange: e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ continuityCheckZh: zh, continuityCheckEn: en.join(NL) }); } }) })] })] }), directorView === "continuity" && _jsxs("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-2", children: [_jsx(FormField, { label: "Story State", zh: "\u6545\u4E8B\u72B6\u6001\u5F15\u64CE", children: _jsx(TextArea, { value: `${active.storyStateZh || ""}${NL}${active.storyStateEn || ""}`, rows: 4, onChange: e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ storyStateZh: zh, storyStateEn: en.join(NL) }); } }) }), _jsx(FormField, { label: "Shot Dependency", zh: "\u955C\u5934\u627F\u63A5\u5173\u7CFB", children: _jsx(TextArea, { value: `上一镜头：${active.previousShotLinkZh || ""}${NL}开始：${active.actionStartZh || ""}${NL}结束：${active.actionEndZh || ""}${NL}下一钩子：${active.nextShotHookZh || ""}${NL}Cut: ${active.cutMotivationZh || ""}`, rows: 5, onChange: e => updateActiveShot({ previousShotLinkZh: e.target.value }) }) }), _jsx(FormField, { label: "Spatial Geography", zh: "\u573A\u666F\u7A7A\u95F4\u5730\u56FE", children: _jsx(TextArea, { value: `${active.spatialGeographyZh || ""}${NL}${active.spatialGeographyEn || ""}`, rows: 4, onChange: e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ spatialGeographyZh: zh, spatialGeographyEn: en.join(NL) }); } }) }), _jsx(FormField, { label: "Axis & Eyeline", zh: "\u8F74\u7EBF\u4E0E\u89C6\u7EBF", children: _jsx(TextArea, { value: `${active.axisEyelineZh || ""}${NL}${active.axisEyelineEn || ""}`, rows: 4, onChange: e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ axisEyelineZh: zh, axisEyelineEn: en.join(NL) }); } }) }), _jsx(FormField, { label: "Performance Direction", zh: "\u8868\u6F14\u6307\u5BFC", children: _jsx(TextArea, { value: `${active.performanceDirectionZh || ""}${NL}${active.performanceDirectionEn || ""}`, rows: 4, onChange: e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ performanceDirectionZh: zh, performanceDirectionEn: en.join(NL) }); } }) }), _jsx(FormField, { label: "Realism Layer", zh: "\u5B9E\u62CD\u7EC6\u817B\u5C42", children: _jsx(TextArea, { value: `${active.realismLayerZh || ""}${NL}${active.realismLayerEn || ""}`, rows: 4, onChange: e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ realismLayerZh: zh, realismLayerEn: en.join(NL) }); } }) }), _jsx(FormField, { label: "Lens Grammar", zh: "\u7126\u6BB5\u8BED\u6CD5\u66F2\u7EBF", children: _jsx(TextArea, { value: `${active.lensGrammarZh || ""}${NL}${active.lensGrammarEn || ""}`, rows: 4, onChange: e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ lensGrammarZh: zh, lensGrammarEn: en.join(NL) }); } }) }), _jsx(FormField, { label: "Coverage & Inspector", zh: "\u8986\u76D6\u62CD\u6CD5\u4E0E\u5BA1\u7247", children: _jsx(TextArea, { value: `覆盖：${active.coveragePlanZh || ""}${NL}审片：${active.continuityInspectorZh || ""}${NL}${active.coveragePlanEn || ""}${NL}${active.continuityInspectorEn || ""}`, rows: 5, onChange: e => { const [coverageZh = "", inspectorZh = "", coverageEn = "", ...rest] = e.target.value.split(NL); updateActiveShot({ coveragePlanZh: coverageZh.replace(/^覆盖：/, ""), continuityInspectorZh: inspectorZh.replace(/^审片：/, ""), coveragePlanEn: coverageEn, continuityInspectorEn: rest.join(NL) }); } }) })] }), directorView === "prompts" && _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-2", children: [_jsx(FormField, { label: "Keyframe Moment", zh: "\u5173\u952E\u5E27\u77AC\u95F4", children: _jsx(TextArea, { value: `${active.keyframeMomentZh || ""}${NL}${active.keyframeMomentEn || ""}`, rows: 4, onChange: e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ keyframeMomentZh: zh, keyframeMomentEn: en.join(NL) }); } }) }), _jsx(FormField, { label: "Scene Image Prompt", zh: "\u573A\u666F\u56FE\u63D0\u793A\u8BCD", children: _jsx(TextArea, { value: `${active.sceneImagePromptZh || ""}${NL}${active.sceneImagePromptEn || ""}`, rows: 5, onChange: e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ sceneImagePromptZh: zh, sceneImagePromptEn: en.join(NL) }); } }) }), _jsx(FormField, { label: "Scene Image Negative", zh: "\u573A\u666F\u56FE\u8D1F\u9762", children: _jsx(TextArea, { value: `${active.sceneImageNegativeZh || ""}${NL}${active.sceneImageNegativeEn || ""}`, rows: 4, onChange: e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ sceneImageNegativeZh: zh, sceneImageNegativeEn: en.join(NL) }); } }) }), _jsx(FormField, { label: "Scene Image Continuity", zh: "\u573A\u666F\u56FE\u8FDE\u7EED\u6027", children: _jsx(TextArea, { value: `${active.sceneImageContinuityNotesZh || ""}${NL}${active.sceneImageContinuityNotesEn || ""}`, rows: 4, onChange: e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ sceneImageContinuityNotesZh: zh, sceneImageContinuityNotesEn: en.join(NL) }); } }) })] }), _jsxs("div", { className: "rounded-3xl border border-emerald-500/10 bg-emerald-500/5 p-5", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[12px] font-black uppercase tracking-[0.25em] text-emerald-200", children: "Scene Image Prompt / \u573A\u666F\u56FE\u63D0\u793A\u8BCD" }), _jsx("div", { className: "mt-1 text-[11px] text-stone-500", children: "\u56FE\u751F\u89C6\u9891\u9996\u5E27 / \u5206\u955C\u677F / \u6982\u5FF5\u56FE" })] }), _jsx(CopyButton, { text: liveSceneImagePrompt })] }), _jsx("pre", { className: "mt-4 max-h-[340px] overflow-y-auto whitespace-pre-wrap break-words rounded-2xl bg-black/45 p-5 font-mono text-[12px] leading-relaxed text-emerald-100/75", children: liveSceneImagePrompt })] }), _jsxs("div", { className: "rounded-3xl border border-cyan-500/10 bg-cyan-500/5 p-5", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[12px] font-black uppercase tracking-[0.25em] text-cyan-200", children: "AI Video Prompt / \u89C6\u9891\u751F\u6210\u63D0\u793A\u8BCD" }), _jsx("div", { className: "mt-1 text-[11px] text-stone-500", children: "\u6700\u7EC8\u89C6\u9891\u6A21\u578B\u63D0\u793A\u8BCD" })] }), _jsx(CopyButton, { text: livePrompt })] }), _jsx("pre", { className: "mt-4 max-h-[420px] overflow-y-auto whitespace-pre-wrap break-words rounded-2xl bg-black/45 p-5 font-mono text-[12px] leading-relaxed text-cyan-100/75", children: livePrompt })] })] })] }) : _jsxs("div", { className: "rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center", children: [_jsx("div", { className: "text-lg font-black text-white", children: "\u8FD8\u6CA1\u6709\u53EF\u7F16\u8F91\u955C\u5934" }), _jsx("p", { className: "mt-2 text-sm text-stone-500", children: "\u5148\u751F\u6210\u5206\u955C\u89C4\u5212\uFF0C\u518D\u6309\u89C4\u5212\u751F\u6210\u955C\u5934\u3002\u5BFC\u6F14\u6A21\u5F0F\u6570\u636E\u72EC\u7ACB\uFF0C\u4E0D\u4F1A\u5F71\u54CD\u65B0\u624B\u548C\u4E13\u4E1A\u6A21\u5F0F\u3002" }), _jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-3", children: [_jsx("button", { onClick: handleGenerateShotPlan, className: "rounded-2xl bg-amber-400 px-5 py-3 text-[11px] font-black uppercase text-black", children: "Generate Shot Plan / \u751F\u6210\u89C4\u5212" }), _jsx("button", { onClick: handleGenerate, className: "rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase text-white", children: "Smart Generate / \u667A\u80FD\u751F\u6210" })] })] }) })] }), _jsx("aside", { className: "space-y-5 2xl:sticky 2xl:top-28 2xl:self-start", children: _jsxs(GlassPanel, { title: "Director Inspector", subTitle: "\u6807\u7B7E\u5F0F\u5BFC\u6F14\u68C0\u67E5\u5668", defaultOpen: true, children: [_jsx("div", { className: "mb-4 grid grid-cols-2 gap-2", children: directorInspectorTabs.map(tab => _jsx("button", { onClick: () => setDirectorInspectorTab(tab.id), className: `rounded-2xl border px-3 py-2 text-[10px] font-black uppercase tracking-widest ${directorInspectorTab === tab.id ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"}`, children: tab.label }, tab.id)) }), _jsxs("div", { className: "max-h-[72vh] overflow-y-auto pr-1", children: [directorInspectorTab === "setup" && _jsxs("div", { className: "space-y-4", children: [_jsx(FormField, { label: "Project", zh: "\u9879\u76EE\u540D\u79F0", children: _jsx(Input, { value: project, onChange: e => setProject(e.target.value) }) }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/40 p-4 text-[11px] leading-6 text-stone-300", children: ["Status: ", apiLog.status, NL, "Model: ", apiLog.lastModel || selectedModel, NL, "Endpoint: ", apiLog.lastEndpoint || deepSeekEndpoint, NL, "Script FP: ", apiLog.scriptFingerprint || scriptFingerprint(script), NL, apiLog.message] }), _jsx(FormField, { label: "Thinking Mode", zh: "\u601D\u8003\u6A21\u5F0F", children: _jsx(Select, { items: OPT.thinkingModes, value: thinkingMode, onChange: setThinkingMode }) }), _jsx(FormField, { label: "Reasoning Effort", zh: "\u63A8\u7406\u5F3A\u5EA6", children: _jsx(Select, { items: OPT.reasoningEfforts, value: reasoningEffort, onChange: setReasoningEffort }) }), _jsx(FormField, { label: "Reference URL", zh: "\u53C2\u8003\u94FE\u63A5", children: _jsx(Input, { value: referenceUrl, onChange: e => setReferenceUrl(e.target.value), placeholder: "https://..." }) }), _jsx(FormField, { label: "Reference Use", zh: "\u53C2\u8003\u7528\u9014", children: _jsx(Select, { items: OPT.referenceUseModes, value: referenceUseMode, onChange: setReferenceUseMode }) }), _jsx(FormField, { label: "Manual Reference", zh: "\u5907\u7528\u5185\u5BB9", children: _jsx(TextArea, { value: referenceManualContent, onChange: e => setReferenceManualContent(e.target.value), rows: 3 }) }), _jsx("button", { onClick: handleIngestReference, disabled: isIngestingReference, className: "w-full rounded-2xl bg-emerald-400 px-4 py-3 text-[11px] font-black uppercase text-black disabled:opacity-50", children: isIngestingReference ? "Reading... / 识别中" : "Analyze Reference / 识别参考" }), _jsx(Toggle, { checked: douyinViral.enabled, onChange: v => setDouyinViral(p => ({ ...p, enabled: v })), label: "Douyin Viral Logic", zh: "\u6296\u97F3\u7206\u6B3E\u601D\u7EF4" }), _jsx(FormField, { label: "Viral Type", zh: "\u77ED\u89C6\u9891\u7C7B\u578B", children: _jsx(Select, { items: OPT.douyinVideoTypes, value: douyinViral.videoType, onChange: v => setDouyinViral(p => ({ ...p, videoType: v })) }) }), _jsx(FormField, { label: "Hook Style", zh: "3\u79D2\u94A9\u5B50", children: _jsx(Select, { items: OPT.viralHookStyles, value: douyinViral.hookStyle, onChange: v => setDouyinViral(p => ({ ...p, hookStyle: v })) }) })] }), directorInspectorTab === "look" && _jsxs("div", { className: "space-y-4", children: [_jsx(FormField, { label: "Idea Backup", zh: "\u60F3\u6CD5\u9700\u6C42\u5907\u4EFD", children: _jsx(TextArea, { value: ideaInput, onChange: e => setIdeaInput(e.target.value), rows: 4 }) }), _jsx("button", { onClick: handleGenerateOutline, disabled: isGeneratingOutline, className: "w-full rounded-2xl bg-amber-400 px-4 py-3 text-[11px] font-black uppercase text-black disabled:opacity-50", children: isGeneratingOutline ? "Writing... / 生成中" : "Generate Outline / 生成大纲" }), _jsx(FormField, { label: "Outline Rewrite Mode", zh: "\u5927\u7EB2\u6253\u78E8\u65B9\u5411", children: _jsx(Select, { items: OPT.outlineRewriteModes, value: outlineRewriteMode, onChange: setOutlineRewriteMode }) }), _jsx("button", { onClick: handleRewriteOutline, disabled: isGeneratingOutline || !(outlineDraft || script || ideaInput), className: "w-full rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-[11px] font-black uppercase text-amber-100 disabled:opacity-40", children: "Rewrite Outline / \u6253\u78E8\u5927\u7EB2" }), outlineDraft && _jsx("button", { onClick: handleConfirmOutline, className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase text-white", children: "Confirm Outline / \u786E\u8BA4\u5927\u7EB2" }), _jsx(FormField, { label: "Script & Creative Bible", zh: "\u5267\u672C\u5723\u7ECF", children: _jsx(TextArea, { value: script, onChange: e => setScript(e.target.value), rows: 6 }) }), _jsx(FormField, { label: "Negative Prompt", zh: "\u8D1F\u9762\u63D0\u793A\u8BCD", children: _jsx(TextArea, { value: negativePrompt, onChange: e => setNegativePrompt(e.target.value), rows: 3 }) }), _jsxs("div", { className: "rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200", children: "Character Lock / \u89D2\u8272\u4E00\u81F4\u6027\u9501" }), _jsxs("div", { className: "mt-3 grid grid-cols-1 gap-3", children: [_jsx(Input, { value: characterLock.name, onChange: e => setCharacterLock(p => ({ ...p, name: e.target.value })), placeholder: "\u59D3\u540D / Name" }), _jsx(Input, { value: characterLock.appearance, onChange: e => setCharacterLock(p => ({ ...p, appearance: e.target.value })), placeholder: "\u5916\u8C8C / Appearance" }), _jsx(Input, { value: characterLock.wardrobe, onChange: e => setCharacterLock(p => ({ ...p, wardrobe: e.target.value })), placeholder: "\u670D\u88C5 / Wardrobe" }), _jsx(TextArea, { value: characterLock.fixedTraits, onChange: e => setCharacterLock(p => ({ ...p, fixedTraits: e.target.value })), rows: 2, placeholder: "\u4E0D\u80FD\u6539\u53D8\u7684\u7279\u5F81 / Fixed traits" })] })] }), _jsxs("div", { className: "rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4", children: [_jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200", children: "Location Lock / \u573A\u666F\u4E00\u81F4\u6027\u9501" }), _jsxs("div", { className: "mt-3 grid grid-cols-1 gap-3", children: [_jsx(Input, { value: locationLock.mainLocation, onChange: e => setLocationLock(p => ({ ...p, mainLocation: e.target.value })), placeholder: "\u4E3B\u573A\u666F / Main location" }), _jsx(Input, { value: locationLock.time, onChange: e => setLocationLock(p => ({ ...p, time: e.target.value })), placeholder: "\u65F6\u95F4 / Time" }), _jsx(Input, { value: locationLock.color, onChange: e => setLocationLock(p => ({ ...p, color: e.target.value })), placeholder: "\u8272\u8C03 / Color" }), _jsx(Input, { value: locationLock.props, onChange: e => setLocationLock(p => ({ ...p, props: e.target.value })), placeholder: "\u5173\u952E\u9053\u5177 / Key props" }), _jsx(TextArea, { value: locationLock.screenDirection, onChange: e => setLocationLock(p => ({ ...p, screenDirection: e.target.value })), rows: 2, placeholder: "\u7A7A\u95F4\u65B9\u5411 / Screen direction" })] })] }), _jsx(FormField, { label: "Director Style", zh: "\u5BFC\u6F14\u98CE\u683C", children: _jsx(Select, { items: DIRECTOR_STYLES.map(s => s.name), value: style.name, onChange: v => setStyle(DIRECTOR_STYLES.find(s => s.name === v) || DIRECTOR_STYLES[0]) }) }), _jsx(FormField, { label: "Platform", zh: "\u8F93\u51FA\u5E73\u53F0", children: _jsx(Select, { items: OPT.platforms, value: tech.platform, onChange: v => setTech(p => ({ ...p, platform: v })) }) }), _jsx(FormField, { label: "Aspect Ratio", zh: "\u753B\u5E45\u6BD4\u4F8B", children: _jsx(Select, { items: OPT.ratios, value: tech.ratio, onChange: v => setTech(p => ({ ...p, ratio: v })) }) }), _jsxs("div", { className: "grid grid-cols-1 gap-3", children: [_jsx(FormField, { label: "Shot Size Lock", zh: "\u666F\u522B\u9501", children: _jsx(Select, { items: OPT.shotSizes, value: tech.shotSizeLock, onChange: v => setTech(p => ({ ...p, shotSizeLock: v })) }) }), _jsx(FormField, { label: "Camera Lock", zh: "\u6444\u5F71\u673A\u9501", children: _jsx(Select, { items: OPT.cameras, value: tech.cameraLock, onChange: v => setTech(p => ({ ...p, cameraLock: v })) }) }), _jsx(FormField, { label: "Lens Lock", zh: "\u7126\u6BB5\u9501", children: _jsx(Select, { items: OPT.lensFocals, value: tech.lensLock, onChange: v => setTech(p => ({ ...p, lensLock: v })) }) }), _jsx(FormField, { label: "Movement Lock", zh: "\u8FD0\u955C\u9501", children: _jsx(Select, { items: OPT.moves, value: tech.movementLock, onChange: v => setTech(p => ({ ...p, movementLock: v })) }) }), _jsx(FormField, { label: "Lighting Lock", zh: "\u5149\u5F71\u9501", children: _jsx(Select, { items: OPT.lights, value: tech.lightingLock, onChange: v => setTech(p => ({ ...p, lightingLock: v })) }) })] })] }), directorInspectorTab === "planning" && _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-[11px] leading-6 text-stone-300", children: [shotPlan.summaryZh, NL, shotPlan.summaryEn] }), _jsx(FormField, { label: "Shot Count Mode", zh: "\u5206\u955C\u6570\u91CF\u6A21\u5F0F", children: _jsx(Select, { items: OPT.shotCountModes, value: tech.shotCountMode, onChange: v => setTech(p => ({ ...p, shotCountMode: v })) }) }), _jsx(FormField, { label: "Smart Range", zh: "\u667A\u80FD\u8303\u56F4", children: _jsx(Select, { items: OPT.shotRanges, value: tech.shotRange, onChange: v => setTech(p => ({ ...p, shotRange: v })) }) }), _jsx(FormField, { label: "Duration", zh: "\u9884\u8BA1\u65F6\u957F", children: _jsx(Select, { items: OPT.videoDurations, value: tech.videoDuration, onChange: v => setTech(p => ({ ...p, videoDuration: v })) }) }), _jsx(FormField, { label: "Density", zh: "\u955C\u5934\u5BC6\u5EA6", children: _jsx(Select, { items: OPT.shotDensities, value: tech.shotDensity, onChange: v => setTech(p => ({ ...p, shotDensity: v })) }) }), _jsx(Toggle, { checked: tech.allowAddMissingShots, onChange: v => setTech(p => ({ ...p, allowAddMissingShots: v })), label: "Allow Add Missing", zh: "\u5141\u8BB8\u81EA\u52A8\u8865\u955C\u5934" }), _jsx("button", { onClick: handleGenerateShotPlan, disabled: isPlanningShots, className: "w-full rounded-2xl bg-amber-400 px-4 py-3 text-[11px] font-black uppercase text-black disabled:opacity-50", children: "Generate Shot Plan / \u751F\u6210\u5206\u955C\u89C4\u5212" }), _jsx("button", { onClick: handleGenerateFromShotPlan, disabled: isGenerating || !shotPlanRows.length, className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase text-white disabled:opacity-40", children: "Generate From Plan / \u6309\u89C4\u5212\u751F\u6210" })] }), directorInspectorTab === "tools" && _jsxs("div", { className: "space-y-4", children: [_jsx(FormField, { label: "Optimization Mode", zh: "\u4F18\u5316\u6A21\u5F0F", children: _jsx(Select, { items: OPT.shotOptimizeModes, value: shotOptimizationMode, onChange: setShotOptimizationMode }) }), _jsx(FormField, { label: "Prompt Refine Mode", zh: "\u4E00\u952E\u63D0\u793A\u8BCD\u7CBE\u4FEE", children: _jsx(Select, { items: OPT.promptRefineModes, value: promptRefineMode, onChange: setPromptRefineMode }) }), _jsx("button", { onClick: () => handleQuickRefineCurrentPrompt(), disabled: !active, className: "w-full rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-[11px] font-black uppercase text-cyan-100 disabled:opacity-40", children: "Quick Refine Prompt / \u4E00\u952E\u7CBE\u4FEE\u63D0\u793A\u8BCD" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("button", { onClick: () => handleQuickRefineCurrentPrompt(OPT.promptRefineModes[1]), disabled: !active, className: "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white disabled:opacity-40", children: "\u52A8\u4F5C\u7A33\u5B9A" }), _jsx("button", { onClick: () => handleQuickRefineCurrentPrompt(OPT.promptRefineModes[2]), disabled: !active, className: "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white disabled:opacity-40", children: "\u4EBA\u7269\u8868\u6F14" }), _jsx("button", { onClick: () => handleQuickRefineCurrentPrompt(OPT.promptRefineModes[3]), disabled: !active, className: "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white disabled:opacity-40", children: "\u8FDE\u7EED\u6027" }), _jsx("button", { onClick: () => handleQuickRefineCurrentPrompt(OPT.promptRefineModes[4]), disabled: !active, className: "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-black text-white disabled:opacity-40", children: "\u53EF\u7075\u9002\u914D" })] }), _jsx("button", { onClick: handleOptimizeCurrentShot, disabled: !active || isOptimizingShot, className: "w-full rounded-2xl bg-cyan-400 px-4 py-3 text-[11px] font-black uppercase text-black disabled:opacity-50", children: isOptimizingShot ? "Optimizing... / 优化中" : "Optimize Current Shot / 优化当前镜头" }), _jsx("button", { onClick: handleRegenerateCurrentShot, disabled: !active || isRegeneratingShot, className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase text-white disabled:opacity-40", children: isRegeneratingShot ? "Regenerating... / 重生成中" : "Regenerate With Context / 上下文重生成" }), _jsx("button", { onClick: handleRepairMissingCoverage, disabled: !shots.length || isRepairingCoverage, className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase text-white disabled:opacity-40", children: "Inspect & Add Missing / \u68C0\u67E5\u8865\u955C\u5934" }), _jsx(Toggle, { checked: tech.bilingualDialogue, onChange: v => setTech(p => ({ ...p, bilingualDialogue: v })), label: "Bilingual Dialogue", zh: "\u4E2D\u82F1\u6587\u53CC\u8BED\u53F0\u8BCD" }), _jsx(Toggle, { checked: tech.professionalAV, onChange: v => setTech(p => ({ ...p, professionalAV: v })), label: "Professional AV Logic", zh: "\u4E13\u4E1A\u89C6\u542C\u8BED\u8A00\u903B\u8F91" }), _jsx(Toggle, { checked: tech.includeSound, onChange: v => setTech(p => ({ ...p, includeSound: v })), label: "Sound & Transition", zh: "\u58F0\u97F3\u4E0E\u8F6C\u573A" }), _jsx(Toggle, { checked: tech.generateSceneImagePrompt, onChange: v => setTech(p => ({ ...p, generateSceneImagePrompt: v })), label: "Scene Image Prompt", zh: "\u573A\u666F\u56FE\u63D0\u793A\u8BCD" }), _jsx(FormField, { label: "Image Model", zh: "\u56FE\u50CF\u6A21\u578B", children: _jsx(Select, { items: OPT.sceneImageModels, value: tech.sceneImageModel, onChange: v => setTech(p => ({ ...p, sceneImageModel: v })) }) }), _jsx(FormField, { label: "Scene Mode", zh: "\u573A\u666F\u56FE\u6A21\u5F0F", children: _jsx(Select, { items: OPT.sceneImageModes, value: tech.sceneImageMode, onChange: v => setTech(p => ({ ...p, sceneImageMode: v })) }) }), _jsx("button", { onClick: handleEnhanceSceneImagePrompts, disabled: !shots.length || isEnhancingSceneImages, className: "w-full rounded-2xl bg-emerald-400 px-4 py-3 text-[11px] font-black uppercase text-black disabled:opacity-50", children: isEnhancingSceneImages ? "Enhancing... / 增强中" : "Enhance All Scene Prompts / 增强全部场景图" }), _jsx("button", { onClick: handleCopySceneImagePack, disabled: !shots.length, className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase text-white disabled:opacity-40", children: "Copy Scene Prompt Pack / \u590D\u5236\u573A\u666F\u56FE\u5305" }), _jsx("button", { onClick: handleDownloadSceneImagePack, disabled: !shots.length, className: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase text-white disabled:opacity-40", children: "Download Prompt Pack / \u4E0B\u8F7D\u63D0\u793A\u8BCD\u5305" })] }), directorInspectorTab === "modules" && _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "grid grid-cols-2 gap-2", children: moduleKeys.map(k => _jsxs("button", { onClick: () => setActiveModule(k), className: `rounded-xl border px-3 py-2 text-left text-[10px] font-black ${activeModule === k ? "border-amber-400 bg-amber-400 text-black" : "border-white/10 bg-black/35 text-stone-400 hover:bg-white/10"}`, children: [_jsx("div", { className: "uppercase", children: modules[k].title }), _jsx("div", { className: "mt-1 opacity-70", children: modules[k].zh })] }, k)) }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/35 p-4", children: [_jsxs("div", { className: "text-[11px] font-black uppercase tracking-[0.18em] text-amber-200", children: [safeActiveModule.title, " / ", safeActiveModule.zh] }), _jsxs("div", { className: "mt-4 space-y-3 max-h-[430px] overflow-y-auto", children: [activeModule === "commercial" && _jsx(FormField, { label: "Production Mode", zh: "\u5236\u4F5C\u6A21\u5F0F", children: _jsx(Select, { items: OPT.productionModes, value: modules.commercial.fields.mode, onChange: v => updateModuleField("commercial", "mode", v) }) }), activeModule === "versions" && _jsx(FormField, { label: "Version Preset", zh: "\u7248\u672C\u9884\u8BBE", children: _jsx(Select, { items: OPT.versionModes, value: modules.versions.fields.selected.split(",")[0] || OPT.versionModes[0], onChange: v => updateModuleField("versions", "selected", v) }) }), Object.entries(safeActiveModule.fields || {}).filter(([key]) => !(activeModule === "commercial" && key === "mode")).map(([key, value]) => _jsx(FormField, { label: key, zh: "\u6A21\u5757\u53C2\u6570", children: _jsx(TextArea, { value: value, onChange: e => updateModuleField(safeActiveModuleKey, key, e.target.value), rows: 3 }) }, key))] })] })] }), directorInspectorTab === "review" && _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/35 p-5 text-center", children: [_jsxs("div", { className: "text-5xl font-black text-amber-400", children: [qualityReport?.score || qualityScore, "%"] }), _jsx("div", { className: "mt-1 text-[10px] font-bold uppercase tracking-widest text-stone-500", children: "Quality Stability" }), _jsx("button", { onClick: handleRunQualityCheck, disabled: isCheckingQuality, className: "mt-4 w-full rounded-2xl bg-amber-400 px-4 py-3 text-[11px] font-black uppercase text-black disabled:opacity-50", children: isCheckingQuality ? "Checking... / 检查中" : "Run Quality Check / 生成质量报告" })] }), _jsxs("div", { className: "grid grid-cols-1 gap-3", children: [_jsx("button", { onClick: handleRunShotSimilarityCheck, disabled: !shots.length, className: "rounded-2xl border border-purple-300/20 bg-purple-400/10 px-4 py-3 text-[11px] font-black uppercase text-purple-100 disabled:opacity-40", children: "Shot Similarity Check / \u955C\u5934\u91CD\u590D\u68C0\u6D4B" }), _jsx("button", { onClick: handleRunFilmRiskEstimate, disabled: !shots.length, className: "rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-[11px] font-black uppercase text-red-100 disabled:opacity-40", children: "Final Video Risk / \u6210\u7247\u98CE\u9669\u9884\u4F30" })] }), shotSimilarityReport && _jsxs("div", { className: "rounded-2xl border border-purple-300/20 bg-purple-400/10 p-4", children: [_jsxs("div", { className: "text-[10px] font-black uppercase tracking-widest text-purple-200", children: ["Shot Similarity / \u955C\u5934\u91CD\u590D\u68C0\u6D4B \u00B7 ", shotSimilarityReport.score, "/100 \u00B7 ", shotSimilarityReport.risk] }), _jsx("div", { className: "mt-2 text-[11px] text-stone-300", children: shotSimilarityReport.summaryZh }), _jsx("div", { className: "mt-3 space-y-2 max-h-[180px] overflow-y-auto", children: shotSimilarityReport.issues.slice(0, 6).map((x, i) => _jsx("div", { className: "rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] text-stone-300", children: x.zh }, i)) })] }), filmRiskReport && _jsxs("div", { className: "rounded-2xl border border-red-300/20 bg-red-400/10 p-4", children: [_jsxs("div", { className: "text-[10px] font-black uppercase tracking-widest text-red-200", children: ["Final Video Risk / \u6210\u7247\u98CE\u9669 \u00B7 ", filmRiskReport.score, "/100 \u00B7 ", filmRiskReport.risk] }), _jsx("div", { className: "mt-2 text-[11px] text-stone-300", children: filmRiskReport.summaryZh }), _jsx("div", { className: "mt-3 space-y-2 max-h-[180px] overflow-y-auto", children: filmRiskReport.risks.slice(0, 6).map((x, i) => _jsxs("div", { className: "rounded-xl border border-white/10 bg-black/30 p-3 text-[11px] text-stone-300", children: ["Shot ", x.shot, " \u00B7 ", x.zh] }, i)) })] }), qualityReport && _jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/40 p-4", children: [_jsx("div", { className: "whitespace-pre-wrap text-[11px] leading-6 text-stone-300", children: qualityReport.summaryZh || qualityReport.summaryEn }), qualityReport.promptQuality && _jsxs("div", { className: "mt-3 rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-[11px] text-emerald-100", children: ["Prompt Quality Engine / \u63D0\u793A\u8BCD\u8D28\u91CF\u5F15\u64CE\uFF1A", qualityReport.promptQuality.score, "/100 \u00B7 ", qualityReport.promptQuality.summaryZh] }), Array.isArray(qualityReport.problems) && _jsx("div", { className: "mt-3 space-y-2 max-h-[240px] overflow-y-auto", children: qualityReport.problems.slice(0, 8).map((p, i) => _jsxs("div", { className: "rounded-xl border border-white/10 bg-white/5 p-3", children: [_jsxs("div", { className: "text-[10px] font-black text-red-300", children: [p.level || "Note", " \u00B7 Shot ", p.shot || "-"] }), _jsx("div", { className: "mt-1 text-[11px] text-stone-300", children: p.zh || p.en }), _jsx("div", { className: "mt-1 text-[10px] text-stone-500", children: p.fixZh || p.fixEn })] }, i)) })] })] })] })] }) })] })] }) });
}
