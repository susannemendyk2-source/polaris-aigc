"use client";

import React, { useEffect, useMemo, useState } from "react";

const NL = "\n";
const AUTO = "AI_AUTO / AI 自动逐镜设计";
const DEEPSEEK_V4_MODELS = ["deepseek-v4-flash", "deepseek-v4-pro"];
const BUILD_VERSION = "V4.2 RUNTIME PATCH ACTIVE · DeepSeek V4 Models Only / 运行补丁已生效 · 仅启用 DeepSeek V4 模型";

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
  shotCounts: ["4", "6", "8", "10", "12", "16"],
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
};

const DEFAULT_SCRIPT = "一名落魄导演在深夜的片场，对着空荡荡的影院独自诉说着对电影的热爱。突然银幕亮起，出现了他年轻时第一次拿起摄影机的画面。";
const DEFAULT_NEGATIVE = "low quality, blurry, distorted face, extra fingers, bad anatomy, inconsistent character, text watermark, logo, overexposed, underexposed, jitter, flicker";

const DEFAULT_MODULES = {
  character: { title: "Character Continuity", zh: "角色连续性", fields: { name: "落魄导演 / Struggling Director", age: "45-55", appearance: "疲惫的眼神、胡茬、瘦削脸型、旧大衣 / tired eyes, stubble, lean face, worn coat", costumeLock: "深色旧风衣、白衬衫、磨损皮鞋，全片不变 / dark worn trench coat, white shirt, scuffed leather shoes, unchanged", hair: "凌乱黑灰短发 / messy black-gray short hair", facialMood: "克制、疲惫、眼底仍有光 / restrained, exhausted, still carrying light in the eyes", bodyLanguage: "微驼背、手指习惯摩挲胶片盒 / slightly hunched, fingers rubbing a film canister", doNotChange: "不要改变年龄、发型、服装颜色、脸型、主角气质 / do not change age, hair, costume color, face shape, protagonist temperament" } },
  location: { title: "Location Continuity", zh: "场景连续性", fields: { mainLocation: "深夜废弃片场与空荡老影院 / abandoned midnight film set and empty old cinema", timeOfDay: "Midnight / 深夜", weather: "室外微雨，室内尘埃漂浮 / light rain outside, dust floating indoors", materials: "红色绒布座椅、旧木地板、银幕、胶片盒、金属放映机 / red velvet seats, old wooden floor, screen, film cans, metal projector", props: "老式摄影机、胶片盒、破旧导演椅、投影光束 / vintage camera, film canister, worn director chair, projector beam", environmentDetails: "空气中有灰尘颗粒，远处安全出口微弱绿光 / dust particles in the air, faint green exit sign in distance", locationLock: "不要改成现代影院，不要增加无关观众，不要更换主场景 / do not change to a modern cinema, do not add unrelated audience, do not replace main location" } },
  continuity: { title: "Continuity Check", zh: "连续性检查", fields: { target: "检查角色、场景、服装、道具、光影、情绪是否连续 / check character, location, costume, props, lighting and emotion continuity", scoring: "每个镜头输出连续性风险与修正建议 / output continuity risk and correction notes for each shot" } },
  rhythm: { title: "Narrative Rhythm", zh: "分镜节奏图", fields: { structure: "Opening 建立 → Build-up 积累 → Turning Point 转折 → Climax 高潮 → Resolution 余韵", beatRule: "每个镜头必须承担不同叙事功能，不能只是重复描述 / every shot must have a distinct narrative purpose" } },
  blocking: { title: "Blocking", zh: "人物调度", fields: { rule: "明确角色入画方向、站位、视线、前中后景关系、是否穿过光束 / specify entrance direction, position, eyeline, foreground-midground-background, whether crossing light beams", preference: "人物运动要服务心理变化，而不是为了动而动 / actor movement must serve psychology" } },
  composition: { title: "Composition", zh: "构图逻辑", fields: { defaultLogic: "根据情绪选择三分法、中心构图、留白、框中框、引导线、高低角度 / choose composition based on emotion", allowed: OPT.compositions.join(" | ") } },
  editing: { title: "Editing Language", zh: "剪辑语言", fields: { rhythm: "慢切建立孤独，转折处使用声音先入或匹配剪辑，高潮可加快速硬切 / slow cuts for loneliness, J-cut or match cut at turning point, faster cuts near climax", allowed: OPT.edits.join(" | ") } },
  sound: { title: "Sound Design", zh: "声音工业", fields: { ambience: "空影院低频嗡鸣、雨声、放映机齿轮、脚步回响 / empty cinema hum, rain, projector gears, echoing footsteps", music: "低频弦乐与稀疏钢琴，高潮时逐渐升起 / low strings and sparse piano, rising at climax", foley: "胶片盒摩擦、旧椅子吱呀、呼吸声 / film canister friction, old chair creak, breathing", silence: "关键台词前后保留设计性静默 / designed silence before and after key lines" } },
  platform: { title: "Platform Prompt", zh: "平台适配", fields: { templateRule: "可灵强调动作连续，Runway强调电影语义，Pika强调短促动作，Luma强调自然运动，Sora/Veo强调完整场景逻辑 / adapt to each platform", universalPrompt: "同时输出通用版与当前平台优化版 / output universal and selected-platform optimized prompts" } },
  frames: { title: "Omni Multi-Parameter", zh: "全能多参", fields: { omniParamRule: "每个镜头输出全能多参建议，不再使用全能多参提示词 / output universal multi-parameter controls for every shot, no first/last-frame prompts", motionStrength: "动作强度、镜头运动强度、主体运动幅度、节奏速度 / motion strength, camera motion intensity, subject motion range, pacing speed", consistencyControl: "角色一致性、场景一致性、服装一致性、道具一致性、时间连续性 / character, location, costume, prop and time continuity controls", generationParams: "时长、分辨率、帧率、种子策略、创意强度、提示词权重、负面权重 / duration, resolution, fps, seed strategy, creativity, prompt weight, negative weight", modelAdaptation: "按可灵、Runway、即梦、Pika、Luma、Sora、Veo 输出可调参数建议 / adjustable parameters for Kling, Runway, Dreamina, Pika, Luma, Sora and Veo" } },
  commercial: { title: "Production Mode", zh: "商业实用模式", fields: { mode: "Film Short / 电影短片", goal: "让画面既有电影质感，也适合 AI 视频实际生成 / cinematic quality and practical AI video generation", audience: "短片观众、AI 视频创作者、导演作品集 / short film audience, AI video creators, director portfolio" } },
  versions: { title: "Multi-Version", zh: "一键多版本", fields: { selected: "Cinematic / 电影感版本, Poetic Arthouse / 诗意文艺版本", note: "在每个镜头输出多版本改写方向，但主版本仍保持统一 / output multi-version adaptation notes while keeping one master version" } },
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
function moduleText(modules) {
  return Object.entries(modules)
    .map(([_, m]) => `## ${m.title} / ${m.zh}${NL}${Object.entries(m.fields).map(([fk, fv]) => `${fk}: ${fv}`).join(NL)}`)
    .join(`${NL}${NL}`);
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
    `平台优化：${s.platformPromptZh}`,
    `全能多参：${s.omniParamPromptZh}`,
    `连续性检查：${s.continuityCheckZh}`,
    `多版本方向：${s.versionNotesZh}`,
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
    `Platform optimization: ${s.platformPromptEn}`,
    `Omni multi-parameter controls: ${s.omniParamPromptEn}`,
    `Continuity check: ${s.continuityCheckEn}`,
    `Multi-version notes: ${s.versionNotesEn}`,
    `Director style: ${style.name}`,
    `Platform: ${tech.platform}`,
    `Aspect ratio: ${tech.ratio}`,
    `Negative prompt: ${negativePrompt}`,
    `Style tags: ${style.tags}`,
  ].join(NL);
}
function makeWord(shots, project, script, style, tech, modules) {
  const rows = shots.map(s => `<tr><td style="border:1px solid #ddd;padding:8px;font-weight:bold;">Shot ${s.id}<br/>${escapeHtml(s.titleZh)}<br/>${escapeHtml(s.titleEn)}</td><td style="border:1px solid #ddd;padding:8px;font-size:10px;"><b>景别:</b><br/>${escapeHtml(s.shotSize)}<br/><br/><b>摄影机:</b><br/>${escapeHtml(s.camera)}<br/><br/><b>焦段:</b><br/>${escapeHtml(s.lens)}<br/><br/><b>运镜:</b><br/>${escapeHtml(s.move)}<br/><br/><b>光影:</b><br/>${escapeHtml(s.light)}<br/><br/><b>时长:</b><br/>${escapeHtml(s.duration)}</td><td style="border:1px solid #ddd;padding:8px;"><b>画面 / Visual</b><br/>${escapeHtml(s.sceneZh)}<br/>${escapeHtml(s.sceneEn)}<br/><br/><b>调度 / Blocking</b><br/>${escapeHtml(s.blockingZh)}<br/>${escapeHtml(s.blockingEn)}<br/><br/><b>台词 / Dialogue</b><br/>${escapeHtml(s.dialogueZh)}<br/>${escapeHtml(s.dialogueEn)}</td><td style="border:1px solid #ddd;padding:8px;font-size:11px;"><b>视听逻辑 / AV Logic</b><br/>${escapeHtml(s.avLogicZh)}<br/>${escapeHtml(s.avLogicEn)}<br/><br/><b>全能多参 / Omni Multi-Parameter</b><br/>${escapeHtml(s.omniParamPromptZh)}<br/>${escapeHtml(s.omniParamPromptEn)}<br/><br/><b>完整提示词 / Prompt</b><br/><div style="white-space:pre-wrap;color:#444;">${escapeHtml(s.finalPrompt || "")}</div></td></tr>`).join("");
  const content = `<!doctype html><html><head><meta charset="UTF-8" /></head><body><h1 style="text-align:center;">${escapeHtml(project)} - 北极星AIGC电影工业系统 V4 双语工业分镜表</h1><p><b>导演风格:</b> ${escapeHtml(style.name)} | <b>制作模式:</b> ${escapeHtml(modules.commercial.fields.mode)} | <b>平台:</b> ${escapeHtml(tech.platform)}</p><p><b>剧本大纲:</b> ${escapeHtml(script)}</p><table style="border-collapse:collapse;width:100%;font-size:11px;"><thead><tr style="background:#eee;"><th>镜头</th><th>技术参数</th><th>内容/调度/台词</th><th>逻辑/全能多参/提示词</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
  const blob = new Blob([content], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeName(project)}_Polaris_V4_Bilingual_Shooting_Script.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const GlassPanel = ({ children, title, subTitle, className = "" }) => <div className={`rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl p-6 shadow-2xl ${className}`}>{title && <div className="mb-5 border-b border-white/5 pb-3 flex justify-between items-center"><h3 className="text-[12px] font-black uppercase tracking-[0.22em] text-amber-300">{title} <span className="text-stone-500 ml-2 text-[11px]">{subTitle}</span></h3><div className="h-1 w-6 rounded-full bg-amber-400/20" /></div>}{children}</div>;
const FormField = ({ label, zh, children }) => <div className="space-y-2"><label className="text-[11px] font-black uppercase tracking-widest text-stone-500">{label} <span className="text-[13px] opacity-80 ml-1">{zh}</span></label>{children}</div>;
const Input = (props) => <input {...props} className={`w-full bg-black/70 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-stone-700 outline-none focus:border-amber-300/50 ${props.className || ""}`} />;
const TextArea = (props) => <textarea {...props} className={`w-full bg-black/70 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-stone-700 outline-none focus:border-amber-300/50 min-h-[100px] leading-relaxed ${props.className || ""}`} />;
const Select = ({ items, value, onChange }) => <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-black text-white border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none appearance-none cursor-pointer focus:border-amber-300/50">{items.map(x => <option key={x} value={x} className="bg-black text-white">{x}</option>)}</select>;
const Toggle = ({ checked, onChange, label, zh }) => <button type="button" onClick={() => onChange(!checked)} className={`w-full rounded-2xl border px-5 py-3 text-left ${checked ? "bg-amber-400 border-amber-400 text-black" : "bg-black/70 border-white/10 text-stone-300"}`}><div className="text-[11px] font-black uppercase tracking-widest">{label}</div><div className="text-[11px] opacity-70 mt-1">{zh}</div></button>;
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return <button type="button" onClick={async () => { await navigator.clipboard.writeText(text || ""); setCopied(true); setTimeout(() => setCopied(false), 1200); }} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">{copied ? "Copied / 已复制" : "Copy / 复制"}</button>;
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
  const [selectedModel, setSelectedModel] = useState(OPT.models[0]);
  const [thinkingMode, setThinkingMode] = useState(OPT.thinkingModes[0]);
  const [reasoningEffort, setReasoningEffort] = useState(OPT.reasoningEfforts[0]);
  const [status, setStatus] = useState("System Standby / 系统就绪 · DeepSeek V4 Models Ready");
  const [negativePrompt, setNegativePrompt] = useState(DEFAULT_NEGATIVE);
  const [creativeBrief, setCreativeBrief] = useState({ genre: OPT.genres[0], pacing: OPT.pacing[0], dialogueStyle: OPT.dialogueStyles[0], mood: "孤独、怀旧、热爱电影、深夜奇迹 / lonely, nostalgic, devoted to cinema, midnight miracle" });
  const [modules, setModules] = useState(DEFAULT_MODULES);
  const [tech, setTech] = useState({ platform: OPT.platforms[0], ratio: OPT.ratios[0], shotCount: "8", shotSizeLock: AUTO, cameraLock: AUTO, lensLock: AUTO, movementLock: AUTO, stabilizerLock: AUTO, lightingLock: AUTO, compositionLock: OPT.compositions[0], editLock: OPT.edits[0], soundLock: OPT.sounds[0], colorScience: OPT.colors[2], bilingualDialogue: true, professionalAV: true, includeSound: true });

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

  const moduleKeys = Object.keys(modules);
  const active = shots[activeShot] || null;
  const livePrompt = active ? buildFinalPrompt(active, project, style, tech, modules, negativePrompt) : "";
  const qualityScore = useMemo(() => Math.min(99, 62 + (script.length > 80 ? 6 : 0) + (shots.length ? 8 : 0) + moduleKeys.length * 2 + (tech.professionalAV ? 5 : 0)), [script, shots, tech.professionalAV, moduleKeys.length]);
  const updateModuleField = (key, field, value) => setModules(p => ({ ...p, [key]: { ...p[key], fields: { ...p[key].fields, [field]: value } } }));
  const updateActiveShot = patch => { if (!active) return; setShots(prev => prev.map((s, i) => i === activeShot ? { ...s, ...patch } : s)); };
  const rebuildFinalPrompts = arr => arr.map(s => ({ ...s, finalPrompt: buildFinalPrompt(s, project, style, tech, modules, negativePrompt) }));

  async function handleGenerate() {
    if (!apiKey.trim()) return setStatus("API Key Required / 请输入 DeepSeek API Key");
    if (!script.trim()) return setStatus("Script Required / 请输入剧本大纲");
    const apiModel = DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0];
    if (apiModel !== selectedModel) setSelectedModel(apiModel);
    setIsGenerating(true);
    setProgressSidebarVisible(true);
    setGenerateProgress(6);
    setStatus(`AI Directing V4 with ${apiModel} / 正在使用 ${apiModel} 执行 12 模块工业分镜`);

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

    setGenerateProgress(22);

    const systemPrompt = `You are Polaris Cinema OS V4, a bilingual Hollywood-grade AI video director system. Return ONLY one valid JSON object. Every creative field must be bilingual Chinese and English. Dialogue must also be bilingual. Do not use fixed defaults unless locked. Integrate all 12 modules: 1 Character Continuity, 2 Location Continuity, 3 Continuity Check, 4 Narrative Rhythm, 5 Blocking, 6 Composition, 7 Editing Language, 8 Sound Design, 9 Platform Prompt Adaptation, 10 Omni Multi-Parameter Control, 11 Production Mode, 12 Multi-Version Notes.\n\nLOCK RULES:\n${lockRules}\n\nDIRECTOR STYLE:\n${style.name}\n${style.desc}\n${style.tags}\n\nOUTPUT JSON SCHEMA:\n{"shots":[{"id":1,"titleZh":"中文镜头标题","titleEn":"English shot title","emotionalBeatZh":"中文情绪节点","emotionalBeatEn":"English emotional beat","narrativeFunctionZh":"中文叙事功能","narrativeFunctionEn":"English narrative function","sceneZh":"中文电影化画面内容","sceneEn":"English cinematic visual content","dialogueZh":"中文台词或有意义的沉默","dialogueEn":"English dialogue or meaningful silence","avLogicZh":"中文视听语言逻辑","avLogicEn":"English AV logic","blockingZh":"中文人物调度","blockingEn":"English actor blocking","compositionZh":"中文构图逻辑","compositionEn":"English composition logic","soundDesignZh":"中文声音设计","soundDesignEn":"English sound design","transitionZh":"中文剪辑/转场","transitionEn":"English editing/transition","continuityCheckZh":"中文连续性风险与修正","continuityCheckEn":"English continuity risk and fix","omniParamPromptZh":"中文全能多参，包含运动强度、主体一致性、镜头控制、时长、帧率、分辨率、种子策略、创意强度、提示词权重、负面权重、平台可调参数","omniParamPromptEn":"English omni multi-parameter controls including motion strength, subject consistency, camera control, duration, fps, resolution, seed strategy, creativity, prompt weight, negative weight and platform-specific adjustable parameters","platformPromptZh":"中文平台适配提示词","platformPromptEn":"English platform-adapted prompt","versionNotesZh":"中文多版本改写方向","versionNotesEn":"English multi-version notes","shotSize":"bilingual shot size","camera":"bilingual camera","lens":"bilingual lens","move":"bilingual movement","stabilizer":"bilingual support","light":"bilingual lighting","colorScience":"bilingual color look","compositionType":"bilingual composition type","editType":"bilingual edit type","soundMode":"bilingual sound mode","duration":"4-6s / 4-6 秒","promptZh":"中文完整视频提示词","promptEn":"English complete video prompt"}]}`;
    const userPrompt = [`Project / 项目: ${project}`, `Platform / 平台: ${tech.platform}`, `Aspect Ratio / 画幅: ${tech.ratio}`, `Shot Count / 镜头数量: ${tech.shotCount}`, `Genre / 类型: ${creativeBrief.genre}`, `Pacing / 节奏: ${creativeBrief.pacing}`, `Dialogue Style / 台词风格: ${creativeBrief.dialogueStyle}`, `Mood / 情绪: ${creativeBrief.mood}`, `Color Science / 色彩科学: ${tech.colorScience}`, `Negative Prompt / 负面提示词: ${negativePrompt}`, `12 Modules / 十二模块:\n${moduleText(modules)}`, `Script Outline / 剧本大纲: ${script}`].join(NL);

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
      const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey.trim().replace(/[^\x00-\x7F]/g, "")}` },
        body: JSON.stringify(requestBody)
      });
      if (!res.ok) throw new Error(`API Error ${res.status}: ${(await res.text()).slice(0, 160)}`);
      setGenerateProgress(64);
      const data = await res.json();
      const parsed = JSON.parse(cleanJsonText(data?.choices?.[0]?.message?.content || ""));
      setGenerateProgress(78);
      const normalized = Array.isArray(parsed.shots) ? parsed.shots.map(normalizeShot) : [];
      if (!normalized.length) throw new Error("JSON parsed but shots array is empty / JSON 已解析但没有镜头数组");
      const withPrompts = rebuildFinalPrompts(normalized);
      setGenerateProgress(94);
      setShots(withPrompts);
      setActiveShot(0);
      setProgressSidebarVisible(true);
      setGenerateProgress(100);
      setStatus(`Directing Successful with ${apiModel} / 已使用 ${apiModel} 生成 ${withPrompts.length} 个 12 模块双语镜头`);
    } catch (e) {
      setGenerateProgress(0);
      setStatus(`Error: ${e.message} / 检查 API Key、模型、网络或 JSON 输出`);
    } finally {
      window.setTimeout(() => setIsGenerating(false), 450);
    }
  }

  return <div className="min-h-screen bg-[#070707] text-stone-300 font-sans">
    <div className="fixed bottom-4 left-4 z-[120] rounded-2xl border border-emerald-400/30 bg-black/90 px-4 py-3 shadow-[0_0_40px_rgba(16,185,129,0.18)] backdrop-blur-xl">
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">V4.2 PATCH ACTIVE / 修改已生效</div>
      <div className="mt-1 select-all text-xs font-black text-white">API model = {DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0]}</div>
      <div className="mt-1 text-[10px] text-stone-500">没有看到此标识 = 你还在运行旧文件</div>
    </div>
    {isGenerating && <GenerationProgressSidebar progress={generateProgress} status={status} visible={progressSidebarVisible} onShow={() => setProgressSidebarVisible(true)} onHide={() => setProgressSidebarVisible(false)} />}
    <header className="relative sticky top-0 z-50 border-b border-white/5 bg-black/75 backdrop-blur-3xl px-8 py-5 flex flex-col xl:flex-row gap-5 xl:items-center xl:justify-between">
      <div className="flex items-center gap-5"><BrandMark active={isGenerating} progress={generateProgress} /><div><h1 className="text-lg font-black uppercase tracking-[0.22em] text-white">北极星AIGC电影工业系统 V4</h1><span className="text-[11px] font-bold text-amber-300/70 uppercase tracking-widest mt-1 block">Polaris AIGC Film Industrial System V4</span><span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mt-1 block">{status}</span><span className="mt-2 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">{BUILD_VERSION} · MODEL: {DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0]}</span></div></div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 xl:flex flex-col items-center rounded-full border border-amber-300/20 bg-black/40 px-8 py-2 shadow-[0_0_40px_rgba(251,191,36,0.10)]"><span className="text-[13px] font-black tracking-[0.28em] text-amber-200">（Haley黄衍衔）</span><span className="mt-1 text-[9px] font-black uppercase tracking-[0.35em] text-stone-500">Authentic Seal / 防伪标识</span></div>
      <div className="flex flex-wrap gap-3"><button onClick={handleGenerate} disabled={isGenerating} className="relative overflow-hidden bg-amber-400 hover:bg-amber-500 text-black px-8 py-3.5 rounded-2xl font-black text-[12px] uppercase tracking-widest disabled:opacity-80"><span className="relative z-10 flex items-center gap-2">{isGenerating && <span className="h-4 w-4 rounded-full border-2 border-black/25 border-t-black animate-spin" />}{isGenerating ? `AI Directing ${Math.round(generateProgress)}% / 生成中` : "Smart Generate / 智能生成"}</span>{isGenerating && <span className="absolute left-0 top-0 h-full bg-white/30 transition-all duration-500" style={{ width: `${generateProgress}%` }} />}</button><button onClick={() => { setShots(p => rebuildFinalPrompts(p)); setStatus("Prompts Rebuilt / 已重建提示词"); }} disabled={!shots.length} className="bg-white/5 border border-white/10 text-white px-6 py-3.5 rounded-2xl font-black text-[12px] uppercase disabled:opacity-40">Rebuild Prompt / 重建提示词</button><button onClick={() => makeWord(rebuildFinalPrompts(shots), project, script, style, tech, modules)} disabled={!shots.length} className="bg-white/5 border border-white/10 text-white px-6 py-3.5 rounded-2xl font-black text-[12px] uppercase disabled:opacity-40">Export / 导出脚本</button></div>
    </header>

    <main className="max-w-[1920px] mx-auto px-8 py-10 grid grid-cols-1 xl:grid-cols-12 gap-8">
      <section className="xl:col-span-3 space-y-8">
        <GlassPanel title="AI Core" subTitle="AI 智算大脑"><div className="space-y-5"><FormField label="DeepSeek API Key" zh="智算令牌"><Input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-..." /></FormField><FormField label="AI Model" zh="模型选择 / 仅 DeepSeek V4"><Select items={DEEPSEEK_V4_MODELS} value={DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0]} onChange={setSelectedModel} /></FormField><div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4"><div className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">Current API Model / 当前实际接口模型</div><div className="mt-2 select-all text-sm font-black text-white">{selectedModel}</div><div className="mt-1 text-[11px] leading-relaxed text-stone-400">请求体会真实使用 model: {DEEPSEEK_V4_MODELS.includes(selectedModel) ? selectedModel : DEEPSEEK_V4_MODELS[0]}</div></div><FormField label="Thinking Mode" zh="思考模式 / API thinking.type"><Select items={OPT.thinkingModes} value={thinkingMode} onChange={setThinkingMode} /></FormField><FormField label="Reasoning Effort" zh="推理强度 / reasoning_effort"><Select items={OPT.reasoningEfforts} value={reasoningEffort} onChange={setReasoningEffort} /></FormField><FormField label="Project" zh="项目名称"><Input value={project} onChange={e => setProject(e.target.value)} /></FormField><FormField label="Shot Count" zh="镜头数量"><Select items={OPT.shotCounts} value={tech.shotCount} onChange={v => setTech(p => ({ ...p, shotCount: v }))} /></FormField></div></GlassPanel>
        <GlassPanel title="Director Styles" subTitle="大师风格"><div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">{DIRECTOR_STYLES.map(s => <button key={s.id} onClick={() => setStyle(s)} className={`w-full p-4 rounded-2xl border text-left ${style.id === s.id ? "bg-amber-400 border-amber-400 text-black" : "bg-white/5 border-white/5 hover:bg-white/10"}`}><div className="text-[12px] font-black uppercase mb-1">{s.name}</div><div className="text-[10px] leading-relaxed opacity-70">{s.desc}</div></button>)}</div></GlassPanel>
        <GlassPanel title="Output & Locks" subTitle="输出与参数锁"><div className="space-y-5"><FormField label="Platform" zh="输出平台"><Select items={OPT.platforms} value={tech.platform} onChange={v => setTech(p => ({ ...p, platform: v }))} /></FormField><FormField label="Aspect Ratio" zh="画幅比例"><Select items={OPT.ratios} value={tech.ratio} onChange={v => setTech(p => ({ ...p, ratio: v }))} /></FormField><FormField label="Shot Size Lock" zh="景别锁定"><Select items={OPT.shotSizes} value={tech.shotSizeLock} onChange={v => setTech(p => ({ ...p, shotSizeLock: v }))} /></FormField><FormField label="Camera Lock" zh="摄影机锁定"><Select items={OPT.cameras} value={tech.cameraLock} onChange={v => setTech(p => ({ ...p, cameraLock: v }))} /></FormField><FormField label="Lens Lock" zh="焦段锁定"><Select items={OPT.lensFocals} value={tech.lensLock} onChange={v => setTech(p => ({ ...p, lensLock: v }))} /></FormField><FormField label="Movement Lock" zh="运镜锁定"><Select items={OPT.moves} value={tech.movementLock} onChange={v => setTech(p => ({ ...p, movementLock: v }))} /></FormField><FormField label="Stabilizer Lock" zh="稳定系统锁定"><Select items={OPT.stabilizers} value={tech.stabilizerLock} onChange={v => setTech(p => ({ ...p, stabilizerLock: v }))} /></FormField><FormField label="Lighting Lock" zh="光影锁定"><Select items={OPT.lights} value={tech.lightingLock} onChange={v => setTech(p => ({ ...p, lightingLock: v }))} /></FormField><FormField label="Composition Lock" zh="构图锁定"><Select items={OPT.compositions} value={tech.compositionLock} onChange={v => setTech(p => ({ ...p, compositionLock: v }))} /></FormField><FormField label="Edit Lock" zh="剪辑锁定"><Select items={OPT.edits} value={tech.editLock} onChange={v => setTech(p => ({ ...p, editLock: v }))} /></FormField><FormField label="Sound Lock" zh="声音锁定"><Select items={OPT.sounds} value={tech.soundLock} onChange={v => setTech(p => ({ ...p, soundLock: v }))} /></FormField></div></GlassPanel>
      </section>

      <section className="xl:col-span-6 space-y-8">
        <GlassPanel title="Script & Creative Bible" subTitle="剧本与创作圣经"><div className="space-y-5"><TextArea value={script} onChange={e => setScript(e.target.value)} className="min-h-[170px] text-lg font-bold" /><div className="grid grid-cols-1 md:grid-cols-2 gap-5"><FormField label="Genre" zh="类型"><Select items={OPT.genres} value={creativeBrief.genre} onChange={v => setCreativeBrief(p => ({ ...p, genre: v }))} /></FormField><FormField label="Pacing" zh="节奏"><Select items={OPT.pacing} value={creativeBrief.pacing} onChange={v => setCreativeBrief(p => ({ ...p, pacing: v }))} /></FormField><FormField label="Dialogue Style" zh="台词风格"><Select items={OPT.dialogueStyles} value={creativeBrief.dialogueStyle} onChange={v => setCreativeBrief(p => ({ ...p, dialogueStyle: v }))} /></FormField><FormField label="Color Science" zh="色彩科学"><Select items={OPT.colors} value={tech.colorScience} onChange={v => setTech(p => ({ ...p, colorScience: v }))} /></FormField></div><FormField label="Mood" zh="情绪关键词"><TextArea value={creativeBrief.mood} onChange={e => setCreativeBrief(p => ({ ...p, mood: e.target.value }))} /></FormField><FormField label="Negative Prompt" zh="负面提示词"><TextArea value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} /></FormField></div></GlassPanel>

        {shots.length > 0 && active && <div className="space-y-6"><div className="flex gap-2 overflow-x-auto pb-4">{shots.map((_, i) => <button key={i} onClick={() => setActiveShot(i)} className={`min-w-fit px-5 py-3 rounded-2xl text-[11px] font-black uppercase ${activeShot === i ? "bg-amber-400 text-black" : "bg-white/5 text-stone-500 hover:bg-white/10"}`}>Shot {i + 1} / 镜头 {i + 1}</button>)}</div><GlassPanel title={`Shot Matrix #${active.id}`} subTitle={`${active.titleZh} / ${active.titleEn}`}><div className="space-y-7"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><FormField label="Visual ZH" zh="中文画面"><TextArea value={active.sceneZh} rows={6} onChange={e => updateActiveShot({ sceneZh: e.target.value })} /></FormField><FormField label="Visual EN" zh="英文画面"><TextArea value={active.sceneEn} rows={6} onChange={e => updateActiveShot({ sceneEn: e.target.value })} /></FormField><FormField label="Dialogue ZH" zh="中文台词"><TextArea value={active.dialogueZh} rows={3} onChange={e => updateActiveShot({ dialogueZh: e.target.value })} /></FormField><FormField label="Dialogue EN" zh="英文台词"><TextArea value={active.dialogueEn} rows={3} onChange={e => updateActiveShot({ dialogueEn: e.target.value })} /></FormField><FormField label="AV Logic ZH" zh="中文视听逻辑"><TextArea value={active.avLogicZh} rows={5} onChange={e => updateActiveShot({ avLogicZh: e.target.value })} /></FormField><FormField label="AV Logic EN" zh="英文视听逻辑"><TextArea value={active.avLogicEn} rows={5} onChange={e => updateActiveShot({ avLogicEn: e.target.value })} /></FormField><FormField label="Blocking ZH" zh="中文调度"><TextArea value={active.blockingZh} rows={4} onChange={e => updateActiveShot({ blockingZh: e.target.value })} /></FormField><FormField label="Blocking EN" zh="英文调度"><TextArea value={active.blockingEn} rows={4} onChange={e => updateActiveShot({ blockingEn: e.target.value })} /></FormField></div><div className="grid grid-cols-1 md:grid-cols-4 gap-5"><FormField label="Shot Size" zh="景别"><Select items={OPT.shotSizes} value={active.shotSize} onChange={v => updateActiveShot({ shotSize: v })} /></FormField><FormField label="Camera" zh="摄影机"><Select items={OPT.cameras} value={active.camera} onChange={v => updateActiveShot({ camera: v })} /></FormField><FormField label="Lens" zh="焦段"><Select items={OPT.lensFocals} value={active.lens} onChange={v => updateActiveShot({ lens: v })} /></FormField><FormField label="Movement" zh="运镜"><Select items={OPT.moves} value={active.move} onChange={v => updateActiveShot({ move: v })} /></FormField><FormField label="Stabilizer" zh="稳定"><Select items={OPT.stabilizers} value={active.stabilizer} onChange={v => updateActiveShot({ stabilizer: v })} /></FormField><FormField label="Lighting" zh="光影"><Select items={OPT.lights} value={active.light} onChange={v => updateActiveShot({ light: v })} /></FormField><FormField label="Composition" zh="构图"><Select items={OPT.compositions} value={active.compositionType} onChange={v => updateActiveShot({ compositionType: v })} /></FormField><FormField label="Edit" zh="剪辑"><Select items={OPT.edits} value={active.editType} onChange={v => updateActiveShot({ editType: v })} /></FormField></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><FormField label="Omni Multi-Parameter" zh="全能多参"><TextArea value={`${active.omniParamPromptZh}${NL}${active.omniParamPromptEn}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ omniParamPromptZh: zh, omniParamPromptEn: en.join(NL) }); }} /></FormField><FormField label="Platform Params" zh="平台参数建议"><TextArea value={`${active.platformPromptZh}${NL}${active.platformPromptEn}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ platformPromptZh: zh, platformPromptEn: en.join(NL) }); }} /></FormField><FormField label="Sound" zh="声音设计"><TextArea value={`${active.soundDesignZh}${NL}${active.soundDesignEn}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ soundDesignZh: zh, soundDesignEn: en.join(NL) }); }} /></FormField><FormField label="Continuity" zh="连续性检查"><TextArea value={`${active.continuityCheckZh}${NL}${active.continuityCheckEn}`} rows={4} onChange={e => { const [zh = "", ...en] = e.target.value.split(NL); updateActiveShot({ continuityCheckZh: zh, continuityCheckEn: en.join(NL) }); }} /></FormField></div><div className="bg-cyan-500/5 border border-cyan-500/10 rounded-3xl p-6 space-y-4"><div className="flex items-center justify-between"><div><div className="text-[12px] font-black uppercase tracking-[0.25em] text-cyan-200">AI Video Prompt / 视频生成提示词</div><div className="text-[11px] text-stone-500 mt-1">中英文双语，可直接复制；会随当前编辑实时更新</div></div><CopyButton text={livePrompt} /></div><pre className="whitespace-pre-wrap break-words text-[12px] leading-relaxed text-cyan-100/70 font-mono max-h-[420px] overflow-y-auto bg-black/40 p-5 rounded-2xl">{livePrompt}</pre></div></div></GlassPanel></div>}
    </section>

    <main className="xl:col-span-3 space-y-8">
      <GlassPanel title="12 Pro Modules" subTitle="十二大专业模块"><div className="grid grid-cols-2 gap-3">{moduleKeys.map((k, i) => <button key={k} onClick={() => setActiveModule(k)} className={`rounded-2xl border p-4 text-left ${activeModule === k ? "bg-amber-400 border-amber-400 text-black" : "bg-white/5 border-white/5 hover:bg-white/10 text-stone-400"}`}><div className="text-[10px] font-black opacity-60">MODULE {String(i + 1).padStart(2, "0")}</div><div className="text-[12px] font-black mt-1">{modules[k].title}</div><div className="text-[11px] opacity-70 mt-1">{modules[k].zh}</div></button>)}</div></GlassPanel>
      <GlassPanel title={modules[activeModule].title} subTitle={modules[activeModule].zh}><div className="space-y-5">{activeModule === "commercial" && <FormField label="Production Mode" zh="制作模式"><Select items={OPT.productionModes} value={modules.commercial.fields.mode} onChange={v => updateModuleField("commercial", "mode", v)} /></FormField>}{activeModule === "versions" && <FormField label="Version Preset" zh="版本预设"><Select items={OPT.versionModes} value={modules.versions.fields.selected.split(",")[0] || OPT.versionModes[0]} onChange={v => updateModuleField("versions", "selected", v)} /></FormField>}{Object.entries(modules[activeModule].fields).filter(([key]) => !(activeModule === "commercial" && key === "mode")).map(([key, value]) => <FormField key={key} label={key} zh="模块参数"><TextArea value={value} onChange={e => updateModuleField(activeModule, key, e.target.value)} rows={3} /></FormField>)}</div></GlassPanel>
      <GlassPanel title="Pro Switches" subTitle="专业开关"><div className="space-y-3"><Toggle checked={tech.bilingualDialogue} onChange={v => setTech(p => ({ ...p, bilingualDialogue: v }))} label="Bilingual Dialogue" zh="中英文双语台词" /><Toggle checked={tech.professionalAV} onChange={v => setTech(p => ({ ...p, professionalAV: v }))} label="Professional AV Logic" zh="专业视听语言逻辑" /><Toggle checked={tech.includeSound} onChange={v => setTech(p => ({ ...p, includeSound: v }))} label="Sound & Transition" zh="声音与剪辑转场" /></div></GlassPanel>
      <GlassPanel title="Health" subTitle="系统状态"><div className="text-center py-6"><div className="text-5xl font-black text-amber-400">{qualityScore}%</div><div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mt-2">Quality Stability / 质量稳定度</div><p className="text-[11px] text-stone-600 mt-5 leading-relaxed">12 个模块都会进入 API 提示词，不会阉割原本的生成、编辑、复制、导出、动态参数锁定功能。</p></div></GlassPanel>
    </main>
  </main>
</div>;
}