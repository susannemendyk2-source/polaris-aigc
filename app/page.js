"use client";

import React, { useMemo, useState } from "react";

const PLATFORM_PRESETS = ["可灵 Kling", "即梦 Dreamina", "Runway", "Pika", "海螺 MiniMax", "Luma Dream Machine", "通用 AIGC 视频"];
const RATIO_PRESETS = ["9:16 竖屏", "16:9 横屏", "2.39:1 电影宽银幕", "1:1 方屏", "4:5 信息流"];
const LANGUAGE_PRESETS = ["中英双语", "中文", "英文"];
const RHYTHM_PRESETS = ["情绪叙事节奏", "好莱坞预告片节奏", "商业广告快节奏", "慢节奏电影感", "产品展示节奏", "短视频爆款节奏"];
const SHOT_COUNT_PRESETS = ["自动", "4 镜头", "6 镜头", "8 镜头", "10 镜头", "12 镜头"];
const PRODUCTION_STATUS_PRESETS = ["未生成", "已生成", "需重做", "已选片", "已剪辑", "已交付", "客户已确认"];
const DEEPSEEK_MODEL_PRESETS = ["deepseek-v4-flash", "deepseek-v4-pro", "deepseek-chat", "deepseek-reasoner"];

const DEFAULT_SCRIPT = `黎明前的未来城市，一辆银黑色新能源概念车静静停在玻璃幕墙前，车身反射着冷蓝色天光。年轻女工程师穿过空旷的研发中心，手指划过全息控制台，车灯像呼吸一样逐渐亮起。镜头切到车辆内饰，座舱被柔和的环境光包围，仪表界面流动着极简科技线条。车辆驶出城市隧道，湿润路面倒映出霓虹与晨光，车身线条在高速运动中形成优雅光轨。最后车辆停在海边高架桥上，太阳从远处升起，女工程师望向远方，品牌标语浮现：Drive the Future Home。`;

const DEFAULT_PROJECT = {
  projectName: "北极星新能源概念车品牌片",
  clientName: "Aurora EV 未来出行品牌",
  directorName: "Polaris北极星导演组",
  promptEngineer: "Polaris Cinematic Prompt Team",
  targetAudience: "高端新能源车用户 / 科技品牌客户 / 商业广告片受众",
};

const DEFAULT_CLIENT_BRIEF = {
  coreMessage: "展示 Aurora EV 的未来科技感、豪华质感与安全可信赖的品牌形象",
  sellingPoints: "新能源动力、智能座舱、未来设计、舒适出行、高端科技生活方式",
  targetUser: "高端新能源车用户、科技爱好者、城市精英家庭",
  videoGoal: "用于品牌发布会、社交媒体广告和客户提案展示",
  brandTone: "高级、克制、未来感、可信赖、电影级商业广告",
  references: "Apple 产品片、豪华汽车广告、未来城市概念片、Runway cinematic commercial style",
  forbidden: "不要廉价科幻感、不要夸张漂浮 UI、不要卡通风、不要杂乱文字、不要过度炫技",
};

const DEFAULT_CHARACTER = {
  name: "女主角 / 未来汽车工程师",
  age: "28岁左右",
  appearance: "浅肤色，五官立体，眼神冷静坚定，面部轮廓清晰，具有高级科技品牌气质",
  hair: "利落低马尾或短发，发丝干净，发型全片保持一致",
  outfit: "白色高领内搭、银灰色科技感风衣、黑色长裤，服装全片保持一致",
  temperament: "冷静、专业、克制、有未来感和领导者气场",
  props: "全息控制台、车钥匙、透明数据平板、银黑色新能源概念车",
  lockedTraits: "same face, same hairstyle, same white and silver outfit, same body proportion, consistent futuristic engineer identity",
};

const DEFAULT_VISUAL_BIBLE = {
  worldSetting: "近未来清晨城市，玻璃建筑、研发中心、城市隧道与海边高架桥构成高级科技品牌世界观",
  colorPalette: "silver black, cold cyan, soft sunrise gold, premium automotive blue highlights",
  lightingStyle: "clean futuristic lighting, soft cyan rim light, reflective car paint, volumetric dawn haze, controlled studio-grade highlights",
  sceneStyle: "futuristic R&D center, glass curtain wall, wet reflective road, neon tunnel, sunrise coastal highway, premium automotive commercial atmosphere",
  costumeStyle: "minimal futuristic workwear, white and silver palette, clean silhouette, no random costume changes",
  propStyle: "silver black electric concept car, holographic interface, premium dashboard, clean brand details, elegant light trails",
  forbiddenElements: "cartoonish style, cheap sci-fi look, low detail car body, distorted wheels, random text, watermark, extra fingers, inconsistent face, changing outfit, messy dashboard",
};

const HOLLYWOOD_MODES = {
  blockbuster: { label: "好莱坞叙事电影", tagline: "Hollywood Narrative Cinema", lens: "35mm anamorphic lens", color: "teal and orange palette, warm highlights, cool shadows", lighting: "Hollywood blockbuster lighting, soft key light, strong rim light, volumetric haze", mood: "cinematic, dramatic, emotionally restrained, premium", texture: "realistic skin texture, cinematic grain, high dynamic range", transition: "match cut / cinematic dissolve" },
  commercial: { label: "商业广告大片", tagline: "Premium Commercial Film", lens: "50mm cinematic prime lens", color: "clean premium color grading, glossy highlights, refined contrast", lighting: "luxury studio lighting, controlled softbox, elegant rim light", mood: "premium, aspirational, clean, commercially polished", texture: "high-end product texture, crisp details, glossy reflections", transition: "smooth product reveal / elegant cut" },
  scifi: { label: "好莱坞科幻片", tagline: "Hollywood Sci-Fi Feature", lens: "24mm anamorphic wide lens", color: "cold blue shadows, cyan neon accents, metallic highlights", lighting: "neon practical lights, volumetric fog, hard rim light", mood: "futuristic, mysterious, tense, grand scale", texture: "metal, glass, holographic interface, cinematic atmospheric depth", transition: "glitch match cut / whip pan transition" },
  fantasy: { label: "史诗奇幻电影", tagline: "Epic Fantasy Cinema", lens: "32mm vintage anamorphic lens", color: "golden highlights, deep emerald shadows, mythic color palette", lighting: "god rays, magical volumetric light, dramatic backlight", mood: "epic, sacred, mysterious, awe-inspiring", texture: "ancient stone, mist, glowing particles, rich costume details", transition: "epic reveal / slow cinematic dissolve" },
  netflix: { label: "Netflix 剧集质感", tagline: "Premium Streaming Drama", lens: "40mm cinematic prime lens", color: "naturalistic color grade, muted contrast, subtle warmth", lighting: "motivated practical lighting, soft shadows, realistic interiors", mood: "intimate, grounded, character-driven, realistic", texture: "real locations, authentic skin texture, documentary-level realism", transition: "motivated cut / quiet emotional cut" },
  luxury: { label: "奢侈品品牌片", tagline: "Luxury Brand Film", lens: "85mm portrait cinema lens", color: "black gold palette, pearl highlights, luxury contrast", lighting: "precision studio light, elegant rim light, soft specular highlights", mood: "exclusive, elegant, refined, iconic", texture: "premium fabric, polished metal, glossy product surface, minimal set design", transition: "slow motion reveal / elegant fade" },
  documentary: { label: "高级纪录片电影感", tagline: "Prestige Documentary Cinema", lens: "35mm documentary cinema lens", color: "natural film color, earthy tones, soft contrast", lighting: "available light, motivated window light, gentle handheld realism", mood: "sincere, observant, grounded, human", texture: "realistic environment, organic detail, authentic atmosphere", transition: "observational cut / natural time jump" },
  trailer: { label: "电影预告片模式", tagline: "Hollywood Trailer Cut", lens: "24mm dramatic wide lens", color: "high contrast blockbuster grade, deep blacks, explosive highlights", lighting: "dramatic contrast lighting, hard backlight, atmospheric smoke", mood: "intense, epic, suspenseful, high-impact", texture: "large scale cinematic detail, sparks, dust, atmosphere", transition: "impact cut / smash cut / speed ramp" },
};

const DIRECTOR_LANGUAGE = [
  { camera: "establishing wide shot", movement: "slow dolly in", composition: "cinematic widescreen composition", transition: "cinematic dissolve", depth: "deep focus" },
  { camera: "dramatic close-up", movement: "subtle push-in", composition: "center-weighted emotional framing", transition: "quiet emotional cut", depth: "shallow depth of field" },
  { camera: "over-the-shoulder shot", movement: "controlled handheld micro-movement", composition: "intimate character perspective", transition: "motivated dialogue cut", depth: "natural depth of field" },
  { camera: "low angle hero shot", movement: "crane rise", composition: "heroic triangular composition", transition: "impact cut", depth: "medium depth of field" },
  { camera: "steadicam tracking shot", movement: "smooth lateral tracking", composition: "layered foreground and background", transition: "match cut", depth: "cinematic depth separation" },
  { camera: "product macro close-up", movement: "slow orbit reveal", composition: "premium product-centered composition", transition: "luxury reveal cut", depth: "macro shallow depth of field" },
  { camera: "handheld documentary shot", movement: "organic human movement", composition: "observational natural framing", transition: "natural time jump", depth: "realistic depth" },
  { camera: "slow motion impact shot", movement: "speed ramp into stillness", composition: "high-impact dramatic framing", transition: "smash cut", depth: "selective focus" },
];

const PLATFORM_PROMPT_RULES = {
  "可灵 Kling": "Kling platform prompt structure: clear subject first, then environment, action, camera movement, light, style, and motion stability. Emphasize stable subject identity, smooth motion, realistic physics, no text, no watermark.",
  "即梦 Dreamina": "Dreamina platform prompt structure: use vivid Chinese visual description, clear subject, strong atmosphere, detailed scene layers, consistent character, precise style words, avoid overly abstract camera language.",
  "Runway": "Runway platform prompt structure: concise English cinematic language, camera movement, lens, lighting, color grade, subject action, motion continuity, realistic texture, no flicker, no watermark.",
  "Pika": "Pika platform prompt structure: short dynamic prompt, clear action verb, camera motion, mood, visual style, smooth movement, avoid complex multi-action conflicts.",
  "海螺 MiniMax": "MiniMax platform prompt structure: cinematic Chinese scene description, natural motion, stable facial identity, clear lighting, clear lens movement, strong continuity between shots.",
  "Luma Dream Machine": "Luma platform prompt structure: physically plausible camera movement, cinematic scene geometry, realistic lighting, spatial continuity, natural motion, coherent depth.",
  "通用 AIGC 视频": "Universal AIGC video prompt structure: subject, scene, action, camera, lens, lighting, color, mood, quality, negative constraints, continuity notes.",
};

const OPTIMIZATION_ACTIONS = {
  cinema: { label: "增强电影感", suffix: "Add Hollywood-level cinematic blocking, stronger lens language, controlled camera rhythm, cinematic widescreen composition, refined lighting contrast, premium film texture." },
  commercial: { label: "增强商业感", suffix: "Strengthen premium brand communication, clean product visibility, refined highlights, elegant reveal, clear selling point, high-end commercial polish." },
  realism: { label: "增强真实感", suffix: "Improve realistic motion, natural facial performance, physically plausible lighting, real material texture, believable environment interaction." },
  consistency: { label: "增强一致性", suffix: "Lock same face, same hairstyle, same outfit, same body proportion, same props, same color palette, and continuous identity across all shots." },
  deform: { label: "降低变形风险", suffix: "Avoid deformed hands, extra fingers, distorted wheels, unstable face, flicker, random text, watermark, broken anatomy, inconsistent outfit." },
  platform: { label: "平台专用", suffix: "Rewrite with platform-specific structure, concise generation logic, clear subject, camera, action, lighting, motion stability, and negative constraints." },
};

function Icon({ name, className = "h-4 w-4" }) {
  const common = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };
  const icons = {
    copy: <svg {...common}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
    wand: <svg {...common}><path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9h2" /><path d="M20 9h2" /><path d="M17.8 11.8 19 13" /><path d="M15 9h0" /><path d="M17.8 6.2 19 5" /><path d="m3 21 9-9" /></svg>,
    film: <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 5v14" /><path d="M17 5v14" /><path d="M3 9h4" /><path d="M3 15h4" /><path d="M17 9h4" /><path d="M17 15h4" /></svg>,
    clock: <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
    settings: <svg {...common}><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7.1 4l.1.1A1.7 1.7 0 0 0 9 4.4 1.7 1.7 0 0 0 10 2.8V3a2 2 0 1 1 4 0v-.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z" /></svg>,
    file: <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h5" /></svg>,
    layers: <svg {...common}><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></svg>,
    check: <svg {...common}><path d="M20 6 9 17l-5-5" /></svg>,
    refresh: <svg {...common}><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" /><path d="M3 21v-5h5" /><path d="M3 12A9 9 0 0 1 18.5 5.8L21 8" /><path d="M21 3v5h-5" /></svg>,
    download: <svg {...common}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>,
    table: <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M9 4v16" /><path d="M15 4v16" /></svg>,
    brain: <svg {...common}><path d="M9.5 2A3.5 3.5 0 0 0 6 5.5v.3A3.8 3.8 0 0 0 3 9.5c0 1.4.7 2.6 1.8 3.3A4.3 4.3 0 0 0 9 18h1V2h-.5Z" /><path d="M14.5 2A3.5 3.5 0 0 1 18 5.5v.3a3.8 3.8 0 0 1 3 3.7c0 1.4-.7 2.6-1.8 3.3A4.3 4.3 0 0 1 15 18h-1V2h.5Z" /><path d="M10 8H8" /><path d="M16 8h-2" /><path d="M10 13H7" /><path d="M17 13h-3" /></svg>,
    alert: <svg {...common}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>,
    star: <svg {...common}><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3L5.8 21 7 14.2 2 9.3l6.9-1L12 2Z" /></svg>,
    user: <svg {...common}><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" /></svg>,
    eye: <svg {...common}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>,
  };
  return icons[name] || icons.star;
}

function classNames(...items) {
  return items.filter(Boolean).join(" ");
}

function plainText(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function safeFileName(value) {
  const unsafe = ["/", "\\", ":", "*", "?", "\"", "<", ">", "|"];
  return String(value || "Polaris项目").split("").map((char) => (unsafe.includes(char) ? "_" : char)).join("").trim() || "Polaris项目";
}

function getPlatformRule(platform) {
  return PLATFORM_PROMPT_RULES[platform] || PLATFORM_PROMPT_RULES["通用 AIGC 视频"];
}

function resolveTargetShotCount(targetShotCount) {
  if (!targetShotCount || targetShotCount === "自动") return null;
  const match = String(targetShotCount).match(/[0-9]+/);
  return match ? Math.max(1, Math.min(12, Number(match[0]))) : null;
}

function splitScript(script, targetShotCount = "自动") {
  const cleaned = String(script || "")
    .split(String.fromCharCode(13)).join("")
    .split(String.fromCharCode(10)).join("。")
    .replace(/第[一二三四五六七八九十0-9]+[幕场段][：:、]?/g, "。")
    .trim();
  const parts = cleaned.split(/[。！？!?；;]+/).map((item) => item.trim().replace(/^[：:、，, -—]+/, "")).filter(Boolean);
  if (!parts.length) return [];
  const requested = resolveTargetShotCount(targetShotCount);
  if (!requested) return parts.slice(0, Math.min(12, Math.max(1, parts.length)));
  if (parts.length === requested) return parts;
  if (parts.length > requested) {
    const grouped = [];
    const groupSize = Math.ceil(parts.length / requested);
    for (let i = 0; i < parts.length; i += groupSize) grouped.push(parts.slice(i, i + groupSize).join("。"));
    return grouped.slice(0, requested);
  }
  const expanded = [...parts];
  while (expanded.length < requested) {
    const longestIndex = expanded.reduce((best, item, index, arr) => item.length > arr[best].length ? index : best, 0);
    const source = expanded[longestIndex];
    const cut = Math.max(1, Math.floor(source.length / 2));
    expanded.splice(longestIndex, 1, source.slice(0, cut), source.slice(cut));
  }
  return expanded.map((item) => item.trim()).filter(Boolean).slice(0, requested);
}

function pick(array, index) {
  return array[index % array.length];
}

function makeCharacterConsistency(character) {
  return `角色一致性：${character.name}，${character.age}，外貌=${character.appearance}，发型=${character.hair}，服装=${character.outfit}，气质=${character.temperament}，关键道具=${character.props}，锁定特征=${character.lockedTraits}。`;
}

function makeVisualBibleText(visualBible) {
  return `视觉圣经：世界观=${visualBible.worldSetting}；主色调=${visualBible.colorPalette}；灯光=${visualBible.lightingStyle}；场景=${visualBible.sceneStyle}；服装=${visualBible.costumeStyle}；道具=${visualBible.propStyle}；禁止元素=${visualBible.forbiddenElements}。`;
}

function makeClientBriefText(clientBrief) {
  const brief = clientBrief || DEFAULT_CLIENT_BRIEF;
  return `客户需求 Brief：核心表达=${brief.coreMessage}；产品卖点=${brief.sellingPoints}；目标人群=${brief.targetUser}；视频目的=${brief.videoGoal}；品牌调性=${brief.brandTone}；参考风格=${brief.references}；禁止表达=${brief.forbidden}。`;
}

function formatTimeRange(start, duration) {
  const end = start + duration;
  return `${start.toString().padStart(2, "0")}-${end.toString().padStart(2, "0")}s`;
}

function recalculateShotTimes(shots) {
  let cursor = 0;
  return shots.map((shot) => {
    const duration = Math.max(1, Number(shot.duration) || 1);
    const updated = { ...shot, duration, time: formatTimeRange(cursor, duration) };
    cursor += duration;
    return updated;
  });
}

function buildCinemaPromptVersions({ text, index, settings, character, visualBible, clientBrief, mode }) {
  const director = pick(DIRECTOR_LANGUAGE, index);
  const platformRule = getPlatformRule(settings.platform);
  const characterRule = makeCharacterConsistency(character);
  const visualRule = makeVisualBibleText(visualBible);
  const briefRule = makeClientBriefText(clientBrief);
  const promptZh = `【中文视频提示词】
画面内容：${text}
客户需求：${briefRule}
角色一致性：${characterRule}
视觉圣经：${visualRule}
摄影设计：使用 ${mode.lens}，${director.camera}，${director.movement}，${director.composition}，${director.depth}。
光影色彩：${mode.lighting}；${mode.color}。
运镜剪辑：${director.transition}，运动稳定，主体跟踪清晰，镜头节奏符合 ${settings.platform} 视频生成逻辑。
平台规则：${platformRule}
质量要求：${mode.texture}，电影级细节，高级商业质感，无水印，无随机文字，角色身份稳定。`;
  const promptEn = `【English Video Prompt】
Scene: ${text}
Client brief: ${briefRule}
Character consistency: ${characterRule}
Visual bible: ${visualRule}
Cinematography: ${mode.lens}, ${director.camera}, ${director.movement}, ${director.composition}, ${director.depth}.
Lighting and color: ${mode.lighting}; ${mode.color}.
Motion and editing: ${director.transition}; stable motion, clean subject tracking, platform-ready generation structure for ${settings.platform}.
Platform rule: ${platformRule}
Quality: ${mode.texture}, cinematic detail, premium production value, no watermark, no random text, stable character identity.`;
  return { promptZh, promptEn, prompt: `${promptZh}${String.fromCharCode(10)}${String.fromCharCode(10)}---${String.fromCharCode(10)}${String.fromCharCode(10)}${promptEn}` };
}

function buildCinemaPrompt({ text, index, settings, character, visualBible, clientBrief, mode, language }) {
  const versions = buildCinemaPromptVersions({ text, index, settings, character, visualBible, clientBrief, mode });
  if (language === "中文") return versions.promptZh;
  if (language === "英文") return versions.promptEn;
  return versions.prompt;
}

function evaluateQuality(shot, character, visualBible) {
  let score = 58;
  const text = `${shot.prompt} ${shot.scene}`.toLowerCase();
  if (/anamorphic|lens|镜头|cinematography|摄影/.test(text)) score += 8;
  if (/lighting|light|光影|rim|volumetric/.test(text)) score += 8;
  if (/character|角色|same face|same hairstyle|一致性/.test(text)) score += 10;
  if (/visual bible|视觉圣经|world|世界观|color palette|主色调/.test(text)) score += 9;
  if (/transition|转场|cut|dissolve/.test(text)) score += 5;
  if (/stable|稳定|no watermark|无水印|consistent/.test(text)) score += 5;
  if (/platform|kling|runway|dreamina|minimax|luma|平台/.test(text)) score += 3;
  if (character.name && character.outfit && character.lockedTraits) score += 3;
  if (visualBible.worldSetting && visualBible.colorPalette && visualBible.forbiddenElements) score += 4;
  score = Math.max(0, Math.min(100, score));
  const tips = [];
  if (!/same face|same hairstyle|一致性/.test(text)) tips.push("补充角色一致性：同一张脸、同一发型、同一服装。 ");
  if (!/lens|镜头|anamorphic|prime/.test(text)) tips.push("补充摄影参数：焦段、镜头类型、景深。 ");
  if (!/transition|转场|cut|dissolve/.test(text)) tips.push("补充转场和剪辑节奏，提升成片连贯性。 ");
  if (!/platform|kling|runway|dreamina|minimax|luma|平台/.test(text)) tips.push("补充平台专用结构，让提示词更适配当前生成平台。 ");
  if (tips.length === 0) tips.push("镜头具备电影级生成条件，可进入平台测试与人工微调。 ");
  const risk = score >= 90 ? "低风险 / 可交付" : score >= 78 ? "中低风险 / 建议微调" : score >= 65 ? "中风险 / 需要增强" : "高风险 / 不建议直接交付";
  return { score, risk, tips };
}

function generateStoryboard({ script, duration, platform, ratio, language, hollywoodMode, rhythmMode, character, visualBible, clientBrief, negativePrompt, targetShotCount = "自动" }) {
  const segments = splitScript(script, targetShotCount);
  const mode = HOLLYWOOD_MODES[hollywoodMode] || HOLLYWOOD_MODES.blockbuster;
  if (!segments.length) return [];
  const totalDuration = Math.max(segments.length, Number(duration) || 30);
  const baseDuration = Math.floor(totalDuration / segments.length);
  let timeCursor = 0;
  return segments.map((text, index) => {
    const isLast = index === segments.length - 1;
    const shotDuration = isLast ? totalDuration - timeCursor : baseDuration;
    const director = pick(DIRECTOR_LANGUAGE, index);
    const promptVersions = buildCinemaPromptVersions({ text, index, settings: { platform, ratio }, character, visualBible, clientBrief, mode });
    const prompt = language === "中文" ? promptVersions.promptZh : language === "英文" ? promptVersions.promptEn : promptVersions.prompt;
    const baseShot = {
      id: index + 1,
      platform,
      status: "未生成",
      producerNotes: "",
      time: formatTimeRange(timeCursor, shotDuration),
      duration: shotDuration,
      shotType: pick(["开场建立", "角色动作", "产品展示", "情绪推进", "高潮转折", "品牌收束"], index),
      shotSize: pick(["远景", "中景", "特写", "近景", "大全景", "细节特写"], index),
      directorLanguage: director.camera,
      camera: director.movement,
      lens: mode.lens,
      depth: director.depth,
      composition: director.composition,
      transition: director.transition,
      light: mode.lighting,
      color: mode.color,
      mood: mode.mood,
      scene: text,
      prompt,
      promptZh: promptVersions.promptZh,
      promptEn: promptVersions.promptEn,
      negative: negativePrompt,
    };
    timeCursor += shotDuration;
    const quality = evaluateQuality(baseShot, character, visualBible);
    return { ...baseShot, qualityScore: quality.score, risk: quality.risk, optimizationTips: quality.tips };
  });
}

function checkContinuity(shots) {
  const issues = [];
  const allText = shots.map((shot) => `${shot.prompt} ${shot.negative}`).join(" ").toLowerCase();
  if (!/same face|same hairstyle|一致性|consistent/.test(allText)) issues.push({ level: "high", title: "角色一致性不足", detail: "建议在所有镜头中锁定 same face、same hairstyle、same outfit 和关键道具。" });
  if (!/visual bible|视觉圣经|color palette|主色调|world|世界观/.test(allText)) issues.push({ level: "medium", title: "视觉圣经继承不足", detail: "建议将世界观、主色调、灯光风格和禁止元素写入每个镜头。" });
  if (!/platform|kling|runway|dreamina|minimax|luma|平台/.test(allText)) issues.push({ level: "medium", title: "缺少平台专用结构", detail: "建议根据当前平台调整提示词结构，避免所有平台使用同一种写法。" });
  if (!/watermark|random text|低清晰度|畸变/.test(allText)) issues.push({ level: "low", title: "生成风险控制不足", detail: "建议补充手部、脸部、服装漂移、文字水印和画面闪烁等负面约束。" });
  const score = Math.max(0, Math.min(100, 100 - issues.filter((item) => item.level === "high").length * 22 - issues.filter((item) => item.level === "medium").length * 12 - issues.filter((item) => item.level === "low").length * 5));
  const summary = score >= 90 ? "连续性优秀，可进入生成测试" : score >= 78 ? "连续性良好，建议微调少数镜头" : score >= 65 ? "连续性中等，需要补充统一约束" : "连续性风险较高，建议重新优化角色与视觉圣经";
  return { score, summary, issues };
}

function optimizeShotWithAction(shot, actionKey, platform, character, visualBible) {
  const action = OPTIMIZATION_ACTIONS[actionKey] || OPTIMIZATION_ACTIONS.cinema;
  const platformRule = actionKey === "platform" ? ` ${getPlatformRule(platform)}` : "";
  const zhSuffix = `

【Polaris 一键优化：${action.label}】${action.suffix}${platformRule}`;
  const enSuffix = `

【Polaris One-click Optimization: ${action.label}】${action.suffix}${platformRule}`;
  const promptZh = `${shot.promptZh || shot.prompt}${zhSuffix}`;
  const promptEn = `${shot.promptEn || shot.prompt}${enSuffix}`;
  const merged = { ...shot, promptZh, promptEn, prompt: `${promptZh}${String.fromCharCode(10)}${String.fromCharCode(10)}---${String.fromCharCode(10)}${String.fromCharCode(10)}${promptEn}` };
  if (actionKey === "deform") merged.negative = `${shot.negative}, deformed hands, extra fingers, distorted body, warped face, flicker, random text, watermark, unstable identity`;
  const quality = evaluateQuality(merged, character, visualBible);
  return { ...merged, qualityScore: quality.score, risk: quality.risk, optimizationTips: quality.tips };
}

function joinPrompts(shots) {
  return shots.map((shot) => shot.prompt || `${shot.promptZh || ""}${String.fromCharCode(10)}${String.fromCharCode(10)}---${String.fromCharCode(10)}${String.fromCharCode(10)}${shot.promptEn || ""}`).join(["", "---", ""].join(String.fromCharCode(10)));
}

function makeCombinedPrompt(promptZh, promptEn) {
  return `${promptZh || ""}${String.fromCharCode(10)}${String.fromCharCode(10)}---${String.fromCharCode(10)}${String.fromCharCode(10)}${promptEn || ""}`.trim();
}

function getExportColumns() {
  return ["镜头编号", "制作状态", "制作备注", "时间轴", "时长/秒", "镜头类型", "景别", "导演镜头语言", "镜头运动", "镜头焦段", "景深", "构图", "转场", "光影", "色彩", "情绪", "分镜画面", "质量评分", "风险等级", "优化建议", "平台专用规则", "中文视频提示词", "English Video Prompt", "合并提示词", "负面提示词"];
}

function getExportRows(data) {
  return data.map((shot) => [
    `镜头 ${shot.id}`,
    shot.status || "未生成",
    shot.producerNotes || "",
    shot.time,
    shot.duration,
    shot.shotType,
    shot.shotSize,
    shot.directorLanguage,
    shot.camera,
    shot.lens,
    shot.depth,
    shot.composition,
    shot.transition,
    shot.light,
    shot.color,
    shot.mood,
    shot.scene,
    shot.qualityScore,
    shot.risk,
    shot.optimizationTips.join(" "),
    getPlatformRule(shot.platform || "通用 AIGC 视频"),
    shot.promptZh || shot.prompt,
    shot.promptEn || shot.prompt,
    shot.prompt || makeCombinedPrompt(shot.promptZh, shot.promptEn),
    shot.negative,
  ]);
}

function makeExcelHtml(data) {
  const columns = getExportColumns();
  const rows = getExportRows(data);
  const head = columns.map((col) => `<th style="border:1px solid #999;padding:8px;background:#111827;color:white;">${escapeHtml(col)}</th>`).join("");
  const body = rows.map((row) => `<tr>${row.map((cell) => `<td style="border:1px solid #999;padding:8px;vertical-align:top;white-space:pre-wrap;">${escapeHtml(cell)}</td>`).join("")}</tr>`).join("");
  return `<!doctype html><html><head><meta charset="UTF-8" /></head><body><table>${head ? `<tr>${head}</tr>` : ""}${body}</table></body></html>`;
}

function makeClientWordHtml(data, settings, character, visualBible, clientBrief = DEFAULT_CLIENT_BRIEF) {
  const cover = `<div style="background:#050712;color:white;padding:48px 36px;margin-bottom:32px;"><div style="font-size:14px;letter-spacing:4px;color:#fcd34d;font-weight:bold;">POLARIS 北极星 AIGC STUDIO</div><h1 style="font-size:34px;margin:18px 0 8px;">${escapeHtml(settings.project.projectName)}</h1><div style="font-size:18px;color:#dbeafe;">AIGC Film Director Proposal / 电影级视频创作方案</div><div style="margin-top:32px;line-height:1.9;color:#d1d5db;">客户：${escapeHtml(settings.project.clientName)}<br />导演：${escapeHtml(settings.project.directorName)}<br />提示词工程师：${escapeHtml(settings.project.promptEngineer)}<br />目标受众：${escapeHtml(settings.project.targetAudience)}<br />电影模式：${escapeHtml(settings.mode.label)}<br />输出平台：${escapeHtml(settings.platform)}｜${escapeHtml(settings.ratio)}｜${escapeHtml(settings.duration)}s</div></div>`;
  const bible = `<h2>一、客户需求 Brief</h2><p style="line-height:1.8;">${escapeHtml(makeClientBriefText(clientBrief))}</p><h2>二、项目视觉圣经 Visual Bible</h2><p style="line-height:1.8;">${escapeHtml(makeVisualBibleText(visualBible))}</p><h2>三、角色一致性 Character Bible</h2><p style="line-height:1.8;">${escapeHtml(makeCharacterConsistency(character))}</p>`;
  const rows = data.map((shot) => `<section style="margin-bottom:28px;page-break-inside:avoid;"><h2 style="font-size:20px;color:#111827;">镜头 ${escapeHtml(shot.id)}｜${escapeHtml(shot.time)}｜评分 ${escapeHtml(shot.qualityScore)}/100</h2><table style="border-collapse:collapse;width:100%;margin-bottom:10px;"><tr><td style="border:1px solid #999;padding:8px;width:120px;">制作状态</td><td style="border:1px solid #999;padding:8px;">${escapeHtml(shot.status || "未生成")}</td></tr><tr><td style="border:1px solid #999;padding:8px;">制作备注</td><td style="border:1px solid #999;padding:8px;">${escapeHtml(shot.producerNotes || "")}</td></tr><tr><td style="border:1px solid #999;padding:8px;">镜头类型</td><td style="border:1px solid #999;padding:8px;">${escapeHtml(shot.shotType)}</td></tr><tr><td style="border:1px solid #999;padding:8px;">导演语言</td><td style="border:1px solid #999;padding:8px;">${escapeHtml(shot.directorLanguage)}｜${escapeHtml(shot.camera)}｜${escapeHtml(shot.transition)}</td></tr><tr><td style="border:1px solid #999;padding:8px;">摄影参数</td><td style="border:1px solid #999;padding:8px;">${escapeHtml(shot.lens)}｜${escapeHtml(shot.depth)}｜${escapeHtml(shot.composition)}</td></tr><tr><td style="border:1px solid #999;padding:8px;">画面内容</td><td style="border:1px solid #999;padding:8px;">${escapeHtml(shot.scene)}</td></tr><tr><td style="border:1px solid #999;padding:8px;">质检备注</td><td style="border:1px solid #999;padding:8px;">${escapeHtml(shot.risk)}；${escapeHtml(shot.optimizationTips.join(" "))}</td></tr></table><h3>中文视频提示词</h3><p style="line-height:1.7;">${escapeHtml(shot.promptZh || shot.prompt)}</p><h3>English Video Prompt</h3><p style="line-height:1.7;">${escapeHtml(shot.promptEn || shot.prompt)}</p><h3>负面提示词</h3><p style="line-height:1.7;color:#555;">${escapeHtml(shot.negative)}</p><p style="border-top:1px solid #ddd;padding-top:8px;color:#777;">客户确认备注：______________________________</p></section>`).join(String.fromCharCode(10));
  return `<!doctype html><html><head><meta charset="UTF-8" /><title>Polaris北极星 客户交付方案</title><style>body{font-family:Arial,'Microsoft YaHei',sans-serif;color:#111;line-height:1.5;}h1,h2,h3{font-weight:800;}table{font-size:13px;}@page{margin:24mm 18mm;}</style></head><body>${cover}${bible}<h2>四、电影级分镜方案</h2>${rows || "<p>暂无内容。</p>"}<p style="margin-top:36px;color:#555;">Polaris北极星 AIGC Studio｜让每一个脚本找到它的电影坐标</p></body></html>`;
}

function toMarkdown(data, settings, character, visualBible, clientBrief = DEFAULT_CLIENT_BRIEF) {
  const rows = data.length ? data.map((shot) => `### 镜头 ${shot.id}｜${shot.time}｜评分 ${shot.qualityScore}/100
- 制作状态：${shot.status || "未生成"}
- 制作备注：${shot.producerNotes || ""}
- 镜头类型：${shot.shotType}
- 景别：${shot.shotSize}
- 导演语言：${shot.directorLanguage}
- 运镜：${shot.camera}
- 摄影参数：${shot.lens}｜${shot.depth}
- 构图：${shot.composition}
- 光影：${shot.light}
- 色彩：${shot.color}
- 转场：${shot.transition}
- 情绪：${shot.mood}
- 质量风险：${shot.risk}
- 优化建议：${shot.optimizationTips.join(" ")}
- 画面内容：${shot.scene}
- 中文视频提示词：${shot.promptZh || shot.prompt}
- English Video Prompt：${shot.promptEn || shot.prompt}
- 负面提示词：${shot.negative}`).join(String.fromCharCode(10) + String.fromCharCode(10)) : "暂无内容，请先输入脚本。";
  return `# Polaris北极星 AIGC Film Director System

## 项目信息
- 项目名称：${settings.project.projectName}
- 客户名称：${settings.project.clientName}
- 导演：${settings.project.directorName}
- 提示词工程师：${settings.project.promptEngineer}
- 电影模式：${settings.mode.label}
- 输出平台：${settings.platform}
- 画幅：${settings.ratio}
- 总时长：${settings.duration}s

## 客户需求 Brief
${makeClientBriefText(clientBrief)}

## 角色一致性
${makeCharacterConsistency(character)}

## 视觉圣经 Visual Bible
${makeVisualBibleText(visualBible)}

## 分镜方案

${rows}`;
}

function downloadFile({ content, mimeType, filename }) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 300);
}

function getDeepSeekNextRouteCode() {
  return [
    "// app/api/ai-storyboard/route.js",
    "// Next.js App Router 后端代理：学生把 DeepSeek Key 放在 .env.local，不要写进前端。",
    "export async function POST(request) {",
    "  try {",
    "    const body = await request.json();",
    "    const apiKey = process.env.DEEPSEEK_API_KEY;",
    "    if (!apiKey) {",
    "      return Response.json({ error: \"Missing DEEPSEEK_API_KEY\" }, { status: 500 });",
    "    }",
    "",
    "    const response = await fetch(\"https://api.deepseek.com/chat/completions\", {",
    "      method: \"POST\",",
    "      headers: {",
    "        \"Content-Type\": \"application/json\",",
    "        Authorization: `Bearer ${apiKey}`,",
    "      },",
    "      body: JSON.stringify({",
    "        model: body.model || \"deepseek-v4-flash\",",
    "        messages: body.messages,",
    "        temperature: body.temperature ?? 0.72,",
    "        stream: false,",
    "      }),",
    "    });",
    "",
    "    const data = await response.json();",
    "    if (!response.ok) {",
    "      return Response.json({ error: data?.error?.message || \"DeepSeek request failed\", detail: data }, { status: response.status });",
    "    }",
    "    return Response.json(data);",
    "  } catch (error) {",
    "    return Response.json({ error: error?.message || \"Server error\" }, { status: 500 });",
    "  }",
    "}",
    "",
    "// .env.local",
    "// DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx"
  ].join(String.fromCharCode(10));
}

function getDeepSeekExpressCode() {
  return [
    "// server.js",
    "// Node + Express 后端代理：npm i express cors dotenv",
    "import express from \"express\";",
    "import cors from \"cors\";",
    "import dotenv from \"dotenv\";",
    "dotenv.config();",
    "",
    "const app = express();",
    "app.use(cors());",
    "app.use(express.json({ limit: \"2mb\" }));",
    "",
    "app.post(\"/api/ai-storyboard\", async (req, res) => {",
    "  try {",
    "    const apiKey = process.env.DEEPSEEK_API_KEY;",
    "    if (!apiKey) return res.status(500).json({ error: \"Missing DEEPSEEK_API_KEY\" });",
    "",
    "    const response = await fetch(\"https://api.deepseek.com/chat/completions\", {",
    "      method: \"POST\",",
    "      headers: {",
    "        \"Content-Type\": \"application/json\",",
    "        Authorization: `Bearer ${apiKey}`,",
    "      },",
    "      body: JSON.stringify({",
    "        model: req.body.model || \"deepseek-v4-flash\",",
    "        messages: req.body.messages,",
    "        temperature: req.body.temperature ?? 0.72,",
    "        stream: false,",
    "      }),",
    "    });",
    "",
    "    const data = await response.json();",
    "    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || \"DeepSeek request failed\", detail: data });",
    "    return res.json(data);",
    "  } catch (error) {",
    "    return res.status(500).json({ error: error?.message || \"Server error\" });",
    "  }",
    "});",
    "",
    "app.listen(3001, () => console.log(\"DeepSeek proxy running on http://localhost:3001\"));",
    "",
    "// .env",
    "// DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx",
    "// 前端 API Endpoint 填：http://localhost:3001/api/ai-storyboard"
  ].join(String.fromCharCode(10));
}

function buildAiInstruction({ script, shots, settings, character, visualBible, clientBrief = DEFAULT_CLIENT_BRIEF }) {
  const compactShots = shots.map((shot) => ({ id: shot.id, time: shot.time, scene: shot.scene, shotType: shot.shotType, status: shot.status, producerNotes: shot.producerNotes, promptZh: shot.promptZh, promptEn: shot.promptEn, prompt: shot.prompt }));
  return `你是 Polaris北极星 AIGC Studio 的电影级分镜导演、摄影指导和提示词工程师。请基于脚本、客户需求 Brief、角色圣经、视觉圣经和已有分镜，生成更专业的好莱坞级 AIGC 视频提示词。

要求：
1. 保持镜头数量和 id 不变。
2. 每个镜头必须包含 scene、shotType、shotSize、directorLanguage、camera、lens、depth、composition、transition、light、color、mood、promptZh、promptEn、prompt、negative。
3. promptZh 输出中文视频提示词，方便中文用户查阅；promptEn 输出英文视频提示词，方便直接复制到国际模型；prompt 可以是中英合并版。三者都必须包含客户 Brief、角色一致性、视觉圣经、摄影参数、光影、色彩、转场、生成稳定性。
4. 输出只返回 JSON 数组，不要 Markdown，不要解释。

项目：${settings.project.projectName}
电影模式：${settings.mode.label}
平台：${settings.platform}
画幅：${settings.ratio}
客户需求 Brief：${JSON.stringify(clientBrief, null, 2)}
角色圣经：${JSON.stringify(character, null, 2)}
视觉圣经：${JSON.stringify(visualBible, null, 2)}
用户脚本：${script}
已有分镜：${JSON.stringify(compactShots, null, 2)}`;
}

function extractJsonArray(text) {
  const raw = String(text || "").trim();
  const first = raw.indexOf("[");
  const last = raw.lastIndexOf("]");
  if (first === -1 || last === -1 || last <= first) throw new Error("模型没有返回 JSON 数组");
  return JSON.parse(raw.slice(first, last + 1));
}

function normalizeAiResult(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.shots)) return payload.shots;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result)) return payload.result;
  const modelText = payload?.choices?.[0]?.message?.content || payload?.choices?.[0]?.text || payload?.content || payload?.result || payload?.message || "";
  return extractJsonArray(modelText);
}

function mergeAiShots(currentShots, aiResult, fallbackNegative, character, visualBible) {
  if (!Array.isArray(aiResult)) throw new Error("AI 返回内容不是数组");
  return currentShots.map((shot) => {
    const enhanced = aiResult.find((item) => Number(item.id) === Number(shot.id)) || {};
    const merged = {
      ...shot,
      scene: plainText(enhanced.scene) || shot.scene,
      shotType: plainText(enhanced.shotType) || shot.shotType,
      shotSize: plainText(enhanced.shotSize) || shot.shotSize,
      directorLanguage: plainText(enhanced.directorLanguage) || shot.directorLanguage,
      camera: plainText(enhanced.camera) || shot.camera,
      lens: plainText(enhanced.lens) || shot.lens,
      depth: plainText(enhanced.depth) || shot.depth,
      composition: plainText(enhanced.composition) || shot.composition,
      transition: plainText(enhanced.transition) || shot.transition,
      light: plainText(enhanced.light) || shot.light,
      color: plainText(enhanced.color) || shot.color,
      mood: plainText(enhanced.mood) || shot.mood,
      promptZh: String(enhanced.promptZh || enhanced.prompt_cn || enhanced.chinesePrompt || shot.promptZh || enhanced.prompt || shot.prompt).trim(),
      promptEn: String(enhanced.promptEn || enhanced.prompt_en || enhanced.englishPrompt || shot.promptEn || enhanced.prompt || shot.prompt).trim(),
      prompt: String(enhanced.prompt || makeCombinedPrompt(enhanced.promptZh || enhanced.prompt_cn || enhanced.chinesePrompt || shot.promptZh || shot.prompt, enhanced.promptEn || enhanced.prompt_en || enhanced.englishPrompt || shot.promptEn || shot.prompt)).trim(),
      negative: String(enhanced.negative || shot.negative || fallbackNegative).trim(),
    };
    const quality = evaluateQuality(merged, character, visualBible);
    return { ...merged, qualityScore: quality.score, risk: quality.risk, optimizationTips: quality.tips };
  });
}

function extractTextFromDocumentXml(xmlText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(String(xmlText || ""), "application/xml");
  const parserError = xml.getElementsByTagName("parsererror")[0];
  if (parserError) throw new Error("Word 正文 XML 解析失败，请确认文件没有损坏。 ");
  const paragraphs = Array.from(xml.getElementsByTagName("w:p"));
  const paragraphText = paragraphs.map((paragraph) => Array.from(paragraph.getElementsByTagName("w:t")).map((node) => node.textContent || "").join("").trim()).filter(Boolean).join(String.fromCharCode(10));
  if (paragraphText.trim()) return paragraphText;
  return Array.from(xml.getElementsByTagName("w:t")).map((node) => node.textContent || "").join("").trim();
}

function findEndOfCentralDirectory(bytes) {
  const minIndex = Math.max(0, bytes.length - 22 - 65535);
  for (let index = bytes.length - 22; index >= minIndex; index -= 1) {
    if (bytes[index] === 0x50 && bytes[index + 1] === 0x4b && bytes[index + 2] === 0x05 && bytes[index + 3] === 0x06) return index;
  }
  return -1;
}

async function inflateZipData(data, method) {
  if (method === 0) return data;
  if (method !== 8) throw new Error("暂不支持该 Word 压缩格式。请另存为 .docx 后再导入。 ");
  if (typeof DecompressionStream === "undefined") throw new Error("当前浏览器不支持本地解压 DOCX。请使用新版 Chrome / Edge，或复制脚本文本粘贴。 ");
  try {
    const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch (error) {
    const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
}

async function readDocxText(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const eocdOffset = findEndOfCentralDirectory(bytes);
  if (eocdOffset < 0) throw new Error("无法识别 DOCX 文件结构，请确认文件没有损坏。 ");
  const entryCount = view.getUint16(eocdOffset + 10, true);
  let pointer = view.getUint32(eocdOffset + 16, true);
  const decoder = new TextDecoder("utf-8");
  for (let index = 0; index < entryCount; index += 1) {
    if (view.getUint32(pointer, true) !== 0x02014b50) break;
    const method = view.getUint16(pointer + 10, true);
    const compressedSize = view.getUint32(pointer + 20, true);
    const fileNameLength = view.getUint16(pointer + 28, true);
    const extraLength = view.getUint16(pointer + 30, true);
    const commentLength = view.getUint16(pointer + 32, true);
    const localHeaderOffset = view.getUint32(pointer + 42, true);
    const fileName = decoder.decode(bytes.slice(pointer + 46, pointer + 46 + fileNameLength));
    if (fileName === "word/document.xml") {
      const localNameLength = view.getUint16(localHeaderOffset + 26, true);
      const localExtraLength = view.getUint16(localHeaderOffset + 28, true);
      const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
      const compressed = bytes.slice(dataStart, dataStart + compressedSize);
      const inflated = await inflateZipData(compressed, method);
      const text = extractTextFromDocumentXml(decoder.decode(inflated));
      if (!text.trim()) throw new Error("已读取 Word，但没有识别到正文脚本。请确认脚本在正文区域，不在图片或扫描件里。 ");
      return text;
    }
    pointer += 46 + fileNameLength + extraLength + commentLength;
  }
  throw new Error("没有在 DOCX 中找到正文文件 word/document.xml，无法读取脚本。 ");
}

async function extractScriptFromFile(file) {
  if (!file) throw new Error("没有选择文件。 ");
  const name = file.name.toLowerCase();
  if (name.endsWith(".docx")) return readDocxText(file);
  if (name.endsWith(".txt") || name.endsWith(".md")) return file.text();
  if (name.endsWith(".doc")) throw new Error("旧版 .doc 暂不支持直接解析，请先在 Word / WPS 中另存为 .docx。 ");
  throw new Error("暂只支持 .docx、.txt、.md 文件。 ");
}

function runSelfTests() {
  const testSegments = splitScript("第一幕：城市下雨。她拿起咖啡！顾客微笑？");
  console.assert(testSegments.length === 3, "splitScript should split Chinese punctuation and scene labels into 3 shots");
  console.assert(splitScript("   ").length === 0, "splitScript should return empty array for blank input");
  const fixedShotCount = splitScript("一。二。三。四。五。六。七。八。九。十。", "4 镜头");
  console.assert(fixedShotCount.length === 4, "splitScript should respect target shot count");
  const storyboard = generateStoryboard({ script: "城市夜晚下雨。她递出咖啡。顾客微笑。", duration: 30, platform: "可灵 Kling", ratio: "9:16 竖屏", language: "中文", hollywoodMode: "blockbuster", rhythmMode: "情绪叙事节奏", character: DEFAULT_CHARACTER, visualBible: DEFAULT_VISUAL_BIBLE, clientBrief: DEFAULT_CLIENT_BRIEF, negativePrompt: "低清晰度", targetShotCount: "自动" });
  console.assert(storyboard.length === 3, "generateStoryboard should create one shot per segment");
  console.assert(storyboard.reduce((sum, shot) => sum + shot.duration, 0) === 30, "shot durations should add up to total duration");
  console.assert(storyboard[0].prompt.includes("客户需求"), "prompt should include client brief");
  console.assert(storyboard[0].promptZh.includes("中文视频提示词"), "storyboard should include Chinese prompt version");
  console.assert(storyboard[0].promptEn.includes("English Video Prompt"), "storyboard should include English prompt version");
  console.assert(makeExcelHtml(storyboard).includes("制作状态"), "Excel export should include production status");
  console.assert(makeClientWordHtml(storyboard, { project: DEFAULT_PROJECT, mode: HOLLYWOOD_MODES.blockbuster, platform: "可灵 Kling", ratio: "9:16 竖屏", duration: 30 }, DEFAULT_CHARACTER, DEFAULT_VISUAL_BIBLE, DEFAULT_CLIENT_BRIEF).includes("客户需求"), "Word report should include client brief");
  console.assert(joinPrompts([{ prompt: "A" }, { prompt: "B" }]) === ["A", "", "---", "", "B"].join(String.fromCharCode(10)), "joinPrompts should use a safe divider");
}

if (typeof window !== "undefined" && !window.__POLARIS_FILM_DIRECTOR_TESTED__) {
  window.__POLARIS_FILM_DIRECTOR_TESTED__ = true;
  runSelfTests();
}

function Field({ label, children, note }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">{label}</span>
      <div className="rounded-2xl border border-white/10 bg-black/25 p-1 shadow-inner shadow-black/30 transition focus-within:border-amber-300/45 focus-within:ring-4 focus-within:ring-amber-300/10">{children}</div>
      {note ? <span className="mt-2 block text-xs leading-5 text-stone-500">{note}</span> : null}
    </label>
  );
}

function SelectInput(props) {
  return <select {...props} className="w-full rounded-xl border-0 bg-transparent px-3 py-3 text-sm font-medium text-stone-100 outline-none focus:ring-0" />;
}

function TextInput(props) {
  return <input {...props} className="w-full rounded-xl border-0 bg-transparent px-3 py-3 text-sm font-medium text-stone-100 outline-none placeholder:text-stone-600 focus:ring-0" />;
}

function TextAreaInput(props) {
  return <textarea {...props} className="min-h-[82px] w-full resize-y rounded-xl border-0 bg-transparent px-3 py-3 text-sm leading-6 text-stone-100 outline-none placeholder:text-stone-600 focus:ring-0" />;
}

function ActionButton({ onClick, icon, children, variant = "secondary", disabled = false, className = "" }) {
  const styles = variant === "primary" ? "border-amber-300/60 bg-amber-300 text-black shadow-amber-500/25 hover:bg-amber-200" : variant === "gold" ? "border-white/15 bg-white text-black shadow-white/10 hover:bg-stone-200" : variant === "violet" ? "border-indigo-300/40 bg-indigo-400 text-white shadow-indigo-500/25 hover:bg-indigo-300" : "border-white/10 bg-white/[0.06] text-stone-100 hover:bg-white/[0.11]";
  return <button onClick={onClick} disabled={disabled} className={classNames("inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition shadow-lg disabled:cursor-not-allowed disabled:opacity-50", styles, className)} type="button"><Icon name={icon} className="h-4 w-4" />{children}</button>;
}

function Badge({ children, tone = "default" }) {
  const tones = { default: "border-white/10 bg-white/[0.06] text-stone-300", amber: "border-amber-300/25 bg-amber-300/10 text-amber-100", green: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100", blue: "border-sky-300/25 bg-sky-300/10 text-sky-100", dark: "border-white/10 bg-black/40 text-stone-300" };
  return <div className={classNames("rounded-full border px-3 py-1.5 text-xs font-semibold", tones[tone] || tones.default)}>{children}</div>;
}

function Toggle({ enabled, onClick }) {
  return <button onClick={onClick} className={classNames("relative h-8 w-14 rounded-full border transition", enabled ? "border-amber-300/50 bg-amber-300" : "border-white/10 bg-white/10")} type="button" aria-label="切换开关"><span className={classNames("absolute top-1 h-6 w-6 rounded-full bg-white shadow transition", enabled ? "left-7" : "left-1")} /></button>;
}

function ScoreBar({ score }) {
  const tone = score >= 90 ? "bg-emerald-300" : score >= 78 ? "bg-amber-300" : score >= 65 ? "bg-orange-300" : "bg-rose-300";
  return <div><div className="mb-2 flex items-center justify-between text-xs"><span className="font-medium text-stone-500">Quality</span><span className="font-semibold text-stone-100">{score}/100</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className={classNames("h-full rounded-full", tone)} style={{ width: `${Math.max(0, Math.min(100, score))}%` }} /></div></div>;
}

function StatCard({ icon, label, value, accent = "amber" }) {
  const accents = { amber: "text-amber-200 bg-amber-300/10 border-amber-300/15", blue: "text-sky-200 bg-sky-300/10 border-sky-300/15", green: "text-emerald-200 bg-emerald-300/10 border-emerald-300/15", violet: "text-violet-200 bg-violet-300/10 border-violet-300/15" };
  return <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl"><div className={classNames("mb-5 grid h-11 w-11 place-items-center rounded-2xl border", accents[accent] || accents.amber)}><Icon name={icon} className="h-5 w-5" /></div><div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">{label}</div><div className="mt-1 text-3xl font-black tracking-[-0.05em] text-white">{value}</div></div>;
}

function CommandPanel({ title, eyebrow, icon, children, compact }) {
  return <section className={classNames("rounded-[1.75rem] border border-white/10 bg-[#12110f]/80 shadow-2xl shadow-black/25 backdrop-blur-xl", compact ? "p-4" : "p-5")}><div className="mb-4 flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-amber-200"><Icon name={icon} className="h-4 w-4" /></div><div><div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-200/55">{eyebrow}</div><h3 className="text-sm font-semibold text-stone-100">{title}</h3></div></div>{children}</section>;
}

function AccordionSection({ title, eyebrow, icon, open, onToggle, children, summary }) {
  return <section className="overflow-hidden rounded-[1.45rem] border border-white/10 bg-white/[0.035]"><button onClick={onToggle} type="button" className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-white/[0.045]"><div className="flex min-w-0 items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-black/30 text-amber-200"><Icon name={icon} className="h-4 w-4" /></span><div className="min-w-0"><div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">{eyebrow}</div><div className="truncate text-sm font-semibold text-stone-100">{title}</div>{!open && summary ? <div className="mt-1 truncate text-xs text-stone-600">{summary}</div> : null}</div></div><span className={classNames("text-xl font-light text-stone-500 transition", open ? "rotate-45" : "")}>+</span></button>{open ? <div className="border-t border-white/10 p-4">{children}</div> : null}</section>;
}

function InfoTile({ label, value }) {
  return <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500">{label}</div><div className="text-sm font-medium leading-6 text-stone-200">{value}</div></div>;
}

function ScriptComposer({ script, setScript, shots, onReset, onGenerate, isEnhancing, onImportFile, importStatus, aiProgress }) {
  return <section className="relative overflow-hidden rounded-[2.3rem] border border-white/10 bg-[#15130f] shadow-2xl shadow-black/30"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(251,191,36,.18),transparent_32%),radial-gradient(circle_at_90%_20%,rgba(56,189,248,.10),transparent_32%)]" /><div className="relative p-5 md:p-7"><div className="mb-5 flex flex-wrap items-start justify-between gap-4"><div><div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-amber-200/75">Script Import</div><h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-white md:text-4xl">先把脚本放进来。</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-stone-400">粘贴脚本或导入 Word，系统会自动拆分镜头、生成时间轴、导演语言和平台提示词。</p></div><div className="flex flex-wrap gap-2"><Badge tone="amber">{script.trim().length} 字</Badge><Badge tone="blue">{shots.length} 镜头</Badge><label className="cursor-pointer rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-300 hover:text-black">导入 Word<input type="file" accept=".docx,.doc,.txt,.md,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown" className="hidden" onChange={(event) => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ""; if (file) onImportFile(file); }} /></label><button onClick={onReset} type="button" className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-stone-200 transition hover:bg-white/[0.12]">示例脚本</button></div></div><textarea value={script} onChange={(event) => setScript(event.target.value)} placeholder="把学生或客户脚本粘贴到这里……" className="min-h-[220px] w-full resize-y rounded-[1.65rem] border border-white/10 bg-black/35 p-5 text-sm leading-7 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-300/50 focus:ring-4 focus:ring-amber-300/10" />{importStatus ? <div className="mt-3 rounded-2xl border border-white/10 bg-black/25 p-3 text-xs leading-5 text-stone-500">{importStatus}</div> : null}{isEnhancing ? <AiProgressBar progress={aiProgress} label="AI 正在生成电影级中英文提示词" /> : null}<div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2 text-xs"><Badge tone="dark">商业广告</Badge><Badge tone="dark">情绪短片</Badge><Badge tone="dark">产品视频</Badge><Badge tone="dark">预告片</Badge></div><ActionButton onClick={onGenerate} icon="wand" variant="primary" disabled={isEnhancing}>{isEnhancing ? "生成中..." : "生成电影级分镜"}</ActionButton></div></div></section>;
}

function ShotCard({ shot, copied, copyText, onOptimize, onUpdate }) {
  const updatePromptZh = (value) => onUpdate(shot.id, { promptZh: value, prompt: makeCombinedPrompt(value, shot.promptEn || "") });
  const updatePromptEn = (value) => onUpdate(shot.id, { promptEn: value, prompt: makeCombinedPrompt(shot.promptZh || "", value) });
  return <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#12110f]/90 shadow-2xl shadow-black/25 transition hover:-translate-y-0.5 hover:border-amber-300/25"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-white/[0.035] p-5"><div className="flex items-center gap-4"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300 text-lg font-black text-black shadow-lg shadow-amber-500/20">{String(shot.id).padStart(2, "0")}</div><div><div className="flex flex-wrap items-center gap-2"><span className="text-base font-semibold text-stone-100">{shot.shotType}</span><span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-stone-400">{shot.shotSize}</span><span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-xs font-medium text-amber-100">{shot.status || "未生成"}</span></div><div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone-500"><Icon name="clock" className="h-3.5 w-3.5" />{shot.time} · {shot.duration}s · {shot.risk}</div></div></div><div className="flex flex-wrap items-center gap-2"><div className="min-w-[120px]"><ScoreBar score={shot.qualityScore} /></div><button onClick={() => copyText(shot.promptZh || shot.prompt, `shot-${shot.id}-zh`)} className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-stone-200 transition hover:bg-amber-300 hover:text-black" type="button"><Icon name={copied === `shot-${shot.id}-zh` ? "check" : "copy"} className="h-3.5 w-3.5" />{copied === `shot-${shot.id}-zh` ? "已复制" : "复制中文"}</button><button onClick={() => copyText(shot.promptEn || shot.prompt, `shot-${shot.id}-en`)} className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-stone-200 transition hover:bg-amber-300 hover:text-black" type="button"><Icon name={copied === `shot-${shot.id}-en` ? "check" : "copy"} className="h-3.5 w-3.5" />{copied === `shot-${shot.id}-en` ? "已复制" : "复制英文"}</button></div></div><div className="grid gap-5 p-5 2xl:grid-cols-[0.9fr_1.1fr]"><div className="space-y-4"><div className="grid grid-cols-2 gap-3"><Field label="制作状态"><SelectInput value={shot.status || "未生成"} onChange={(event) => onUpdate(shot.id, { status: event.target.value })}>{PRODUCTION_STATUS_PRESETS.map((status) => <option key={status}>{status}</option>)}</SelectInput></Field><Field label="时长 / 秒"><TextInput type="number" min="1" value={shot.duration} onChange={(event) => onUpdate(shot.id, { duration: Number(event.target.value) || 1 })} /></Field></div><Field label="分镜画面 / 可手动编辑"><TextAreaInput value={shot.scene} onChange={(event) => onUpdate(shot.id, { scene: event.target.value })} /></Field><div className="grid grid-cols-2 gap-3 text-xs lg:grid-cols-3"><InfoTile label="导演语言" value={shot.directorLanguage} /><InfoTile label="镜头运动" value={shot.camera} /><InfoTile label="摄影焦段" value={shot.lens} /><InfoTile label="景深" value={shot.depth} /><InfoTile label="光影" value={shot.light} /><InfoTile label="转场" value={shot.transition} /></div><div className="rounded-[1.5rem] border border-amber-300/15 bg-amber-300/8 p-4 text-xs leading-6 text-amber-100"><span className="font-semibold">优化建议：</span>{shot.optimizationTips.join(" ")}</div><Field label="内部制作备注"><TextAreaInput value={shot.producerNotes || ""} onChange={(event) => onUpdate(shot.id, { producerNotes: event.target.value })} placeholder="例如：第 2 次生成效果最好；需要补首帧；客户要求车标更清晰。" /></Field><div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4"><div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">One-click Optimize</div><div className="flex flex-wrap gap-2">{Object.entries(OPTIMIZATION_ACTIONS).map(([key, action]) => <button key={key} onClick={() => onOptimize(shot.id, key)} type="button" className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs font-semibold text-stone-300 transition hover:border-amber-300/40 hover:bg-amber-300 hover:text-black">{action.label}</button>)}</div></div></div><div className="space-y-4"><Field label="中文视频提示词 / 可手动编辑"><textarea value={shot.promptZh || shot.prompt} onChange={(event) => updatePromptZh(event.target.value)} className="min-h-[260px] w-full resize-y rounded-xl border-0 bg-transparent px-3 py-3 text-sm leading-7 text-stone-100 outline-none placeholder:text-stone-600 focus:ring-0" /></Field><Field label="English Video Prompt / Editable"><textarea value={shot.promptEn || shot.prompt} onChange={(event) => updatePromptEn(event.target.value)} className="min-h-[260px] w-full resize-y rounded-xl border-0 bg-transparent px-3 py-3 text-sm leading-7 text-stone-100 outline-none placeholder:text-stone-600 focus:ring-0" /></Field><Field label="负面提示词 / 可手动编辑"><TextAreaInput value={shot.negative} onChange={(event) => onUpdate(shot.id, { negative: event.target.value })} /></Field></div></div></article>;
}

function AiProgressBar({ progress, label }) {
  const safeProgress = Math.max(0, Math.min(100, Number(progress) || 0));
  return <div className="mt-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4"><div className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-amber-100">{label}</span><span className="font-black text-amber-200">{safeProgress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-black/40"><div className="h-full rounded-full bg-amber-300 transition-all duration-500" style={{ width: `${safeProgress}%` }} /></div></div>;
}

function QualityPanel({ shots }) {
  const ready = shots.filter((shot) => shot.qualityScore >= 90).length;
  const needPolish = shots.filter((shot) => shot.qualityScore >= 78 && shot.qualityScore < 90).length;
  const risky = shots.filter((shot) => shot.qualityScore < 78).length;
  const avg = shots.length ? Math.round(shots.reduce((sum, shot) => sum + shot.qualityScore, 0) / shots.length) : 0;
  return <div className="space-y-4"><div className="grid gap-3 md:grid-cols-4"><StatCard icon="star" label="Average" value={avg} accent="amber" /><StatCard icon="check" label="Deliverable" value={ready} accent="green" /><StatCard icon="wand" label="Polish" value={needPolish} accent="blue" /><StatCard icon="alert" label="Risk" value={risky} accent="violet" /></div>{shots.map((shot) => <div key={shot.id} className="rounded-[2rem] border border-white/10 bg-[#12110f]/90 p-5 shadow-2xl shadow-black/25"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/65">Quality Control</div><h3 className="mt-1 text-lg font-semibold text-stone-100">镜头 {shot.id}｜{shot.shotType}</h3></div><div className="rounded-2xl bg-amber-300 px-4 py-2 text-lg font-black text-black">{shot.qualityScore}/100</div></div><ScoreBar score={shot.qualityScore} /><div className="mt-4 grid gap-3 md:grid-cols-3"><InfoTile label="风险等级" value={shot.risk} /><InfoTile label="角色一致性" value={shot.prompt.includes("角色一致性") ? "已锁定" : "待增强"} /><InfoTile label="视觉圣经" value={shot.prompt.includes("视觉圣经") ? "已继承" : "待增强"} /></div><div className="mt-4 rounded-2xl border border-amber-300/15 bg-amber-300/8 p-4 text-sm leading-6 text-amber-100">{shot.optimizationTips.join(" ")}</div></div>)}</div>;
}

function ContinuityPanel({ continuity }) {
  const issueTone = { high: "border-rose-300/25 bg-rose-300/10 text-rose-100", medium: "border-amber-300/25 bg-amber-300/10 text-amber-100", low: "border-sky-300/25 bg-sky-300/10 text-sky-100" };
  return <div className="space-y-4"><section className="rounded-[2rem] border border-white/10 bg-[#12110f]/90 p-6 shadow-2xl shadow-black/25"><div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div><div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200/65">Continuity Check</div><h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-white">连续性检查</h2><p className="mt-2 text-sm leading-6 text-stone-500">检查角色、服装、视觉风格、平台结构、负面约束与镜头节奏是否统一。</p></div><div className="rounded-[1.75rem] border border-amber-300/20 bg-amber-300/10 px-6 py-5 text-center"><div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-100/55">Continuity</div><div className="mt-1 text-5xl font-black tracking-[-0.06em] text-amber-200">{continuity.score}</div></div></div><ScoreBar score={continuity.score} /><div className="mt-4 rounded-2xl border border-sky-300/15 bg-sky-300/8 p-4 text-sm leading-7 text-sky-100">{continuity.summary}</div></section>{continuity.issues.length === 0 ? <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6 text-emerald-100">连续性优秀：角色、视觉、平台结构和生成风险控制都已统一。</div> : continuity.issues.map((issue, index) => <div key={`${issue.title}-${index}`} className={classNames("rounded-[1.5rem] border p-4", issueTone[issue.level] || issueTone.low)}><div className="text-sm font-semibold">{issue.title}</div><div className="mt-2 text-sm leading-6 opacity-85">{issue.detail}</div></div>)}</div>;
}

function DeliveryPreview({ project, mode, platform, ratio, effectiveDuration, character, visualBible, clientBrief, markdown, copied, copyText }) {
  return <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]"><div className="space-y-5"><section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#12110f]/90 shadow-2xl shadow-black/25"><div className="bg-[radial-gradient(circle_at_20%_0%,rgba(251,191,36,.20),transparent_38%),linear-gradient(135deg,#050505,#191714)] p-7 text-white"><div className="mb-10 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200/60">POLARIS 北极星 AIGC STUDIO</div><h2 className="text-3xl font-black tracking-[-0.045em] text-white">{project.projectName}</h2><p className="mt-2 text-sm text-stone-400">AIGC Film Director Proposal / 电影级视频创作方案</p></div><div className="grid gap-3 p-5 text-sm"><InfoTile label="客户" value={project.clientName} /><InfoTile label="导演" value={project.directorName} /><InfoTile label="提示词工程师" value={project.promptEngineer} /><InfoTile label="模式 / 平台" value={`${mode.label} · ${platform} · ${ratio} · ${effectiveDuration}s`} /></div></section><section className="rounded-[2rem] border border-white/10 bg-[#12110f]/90 p-5 shadow-2xl shadow-black/25"><h3 className="mb-3 text-lg font-semibold text-stone-100">客户需求 Brief</h3><p className="text-sm leading-7 text-stone-400">{makeClientBriefText(clientBrief)}</p></section><section className="rounded-[2rem] border border-white/10 bg-[#12110f]/90 p-5 shadow-2xl shadow-black/25"><h3 className="mb-3 text-lg font-semibold text-stone-100">角色圣经摘要</h3><p className="text-sm leading-7 text-stone-400">{makeCharacterConsistency(character)}</p></section><section className="rounded-[2rem] border border-white/10 bg-[#12110f]/90 p-5 shadow-2xl shadow-black/25"><h3 className="mb-3 text-lg font-semibold text-stone-100">Visual Bible 摘要</h3><p className="text-sm leading-7 text-stone-400">{makeVisualBibleText(visualBible)}</p></section></div><section className="rounded-[2rem] border border-white/10 bg-[#12110f]/90 p-5 shadow-2xl shadow-black/25"><div className="mb-4 flex items-center justify-between gap-4"><div><div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200/65">Client Delivery Markdown</div><h2 className="mt-1 text-2xl font-black tracking-[-0.035em] text-white">交付文档预览</h2></div><ActionButton onClick={() => copyText(markdown, "markdown2")} icon={copied === "markdown2" ? "check" : "copy"} variant="primary">{copied === "markdown2" ? "已复制" : "复制"}</ActionButton></div><pre className="max-h-[760px] overflow-auto whitespace-pre-wrap rounded-[1.5rem] border border-white/10 bg-black/35 p-5 text-sm leading-7 text-stone-300">{markdown}</pre></section></div>;
}

function ExportCenter({ handleExportWord, handleExportExcel }) {
  return <div className="grid gap-5 md:grid-cols-2"><div className="rounded-[2rem] border border-white/10 bg-[#12110f]/90 p-7 shadow-2xl shadow-black/25"><div className="mb-8 grid h-14 w-14 place-items-center rounded-[1.4rem] bg-white text-black"><Icon name="file" className="h-6 w-6" /></div><h3 className="text-2xl font-black tracking-[-0.04em] text-white">客户交付版 Word 报告</h3><p className="mt-3 text-sm leading-7 text-stone-500">含客户 Brief、项目档案、角色圣经、视觉圣经、镜头质检、客户确认栏。</p><ActionButton onClick={handleExportWord} icon="download" variant="gold" className="mt-6 w-full">导出 .doc 报告</ActionButton></div><div className="rounded-[2rem] border border-white/10 bg-[#12110f]/90 p-7 shadow-2xl shadow-black/25"><div className="mb-8 grid h-14 w-14 place-items-center rounded-[1.4rem] bg-amber-300 text-black"><Icon name="table" className="h-6 w-6" /></div><h3 className="text-2xl font-black tracking-[-0.04em] text-white">Excel 制作分镜表</h3><p className="mt-3 text-sm leading-7 text-stone-500">含制作状态、制作备注、提示词、负面提示词、评分和平台规则。</p><ActionButton onClick={handleExportExcel} icon="download" variant="primary" className="mt-6 w-full">导出 .xls 表格</ActionButton></div></div>;
}

function WorkflowFooter() {
  return <div className="rounded-[2rem] border border-white/10 bg-[#12110f]/80 p-6 shadow-2xl shadow-black/25"><div className="mb-5"><div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Studio Workflow</div><h3 className="mt-1 text-xl font-black tracking-[-0.035em] text-white">北极星工作室电影级生产流程</h3></div><div className="grid gap-3 text-sm leading-6 text-stone-400 md:grid-cols-3"><div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5"><div className="mb-3 text-3xl font-black tracking-[-0.05em] text-amber-200">01</div><div className="mb-2 font-semibold text-stone-100">建立创作圣经</div><p>统一项目档案、客户 Brief、角色一致性和 Visual Bible。</p></div><div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5"><div className="mb-3 text-3xl font-black tracking-[-0.05em] text-amber-200">02</div><div className="mb-2 font-semibold text-stone-100">生成并编辑分镜</div><p>按指定镜头数量生成，再手动修正画面、提示词和制作状态。</p></div><div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5"><div className="mb-3 text-3xl font-black tracking-[-0.05em] text-amber-200">03</div><div className="mb-2 font-semibold text-stone-100">质检并交付</div><p>通过评分和连续性检查，再导出客户版 Word 与内部 Excel。</p></div></div></div>;
}

export default function PolarisFilmDirectorSystem() {
  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [project, setProject] = useState(DEFAULT_PROJECT);
  const [clientBrief, setClientBrief] = useState(DEFAULT_CLIENT_BRIEF);
  const [character, setCharacter] = useState(DEFAULT_CHARACTER);
  const [visualBible, setVisualBible] = useState(DEFAULT_VISUAL_BIBLE);
  const [platform, setPlatform] = useState("Runway");
  const [ratio, setRatio] = useState("2.39:1 电影宽银幕");
  const [duration, setDuration] = useState(45);
  const [language, setLanguage] = useState("中英双语");
  const [targetShotCount, setTargetShotCount] = useState("自动");
  const [hollywoodMode, setHollywoodMode] = useState("luxury");
  const [rhythmMode, setRhythmMode] = useState("产品展示节奏");
  const [negativePrompt, setNegativePrompt] = useState("低清晰度、画面畸变、人物手部错误、文字水印、过度模糊、穿帮、比例错误、重复人物、闪烁");
  const [manualShots, setManualShots] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState("/api/ai-storyboard");
  const [apiKey, setApiKey] = useState("");
  const [apiModel, setApiModel] = useState("deepseek-v4-flash");
  const [useApi, setUseApi] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [apiStatus, setApiStatus] = useState("DeepSeek 教学接入已就绪：建议学生使用后端代理 /api/ai-storyboard，并把 DEEPSEEK_API_KEY 放在服务器环境变量中。 ");
  const [importStatus, setImportStatus] = useState("支持导入 .docx Word 正文，也支持 .txt / .md；旧版 .doc 请先另存为 .docx。");
  const [panel, setPanel] = useState("storyboard");
  const [copied, setCopied] = useState("");
  const [openSections, setOpenSections] = useState({ project: true, brief: true, mode: true, character: false, visual: false, ai: false });

  const mode = HOLLYWOOD_MODES[hollywoodMode] || HOLLYWOOD_MODES.blockbuster;
  const generatedShots = useMemo(() => generateStoryboard({ script, duration, platform, ratio, language, hollywoodMode, rhythmMode, character, visualBible, clientBrief, negativePrompt, targetShotCount }), [script, duration, platform, ratio, language, hollywoodMode, rhythmMode, character, visualBible, clientBrief, negativePrompt, targetShotCount]);
  const shots = manualShots || generatedShots;
  const effectiveDuration = shots.reduce((sum, shot) => sum + Number(shot.duration || 0), 0) || Number(duration) || 0;
  const avgScore = shots.length ? Math.round(shots.reduce((sum, shot) => sum + shot.qualityScore, 0) / shots.length) : 0;
  const exportSettings = useMemo(() => ({ project, mode, platform, ratio, duration: effectiveDuration, hollywoodMode, rhythmMode }), [project, mode, platform, ratio, effectiveDuration, hollywoodMode, rhythmMode]);
  const markdown = useMemo(() => toMarkdown(shots, exportSettings, character, visualBible, clientBrief), [shots, exportSettings, character, visualBible, clientBrief]);
  const continuity = useMemo(() => checkContinuity(shots), [shots]);
  const toggleSection = (key) => setOpenSections((old) => ({ ...old, [key]: !old[key] }));
  const updateObject = (setter, key, value) => setter((old) => ({ ...old, [key]: value }));
  const resetDemo = () => { setScript(DEFAULT_SCRIPT); setProject(DEFAULT_PROJECT); setClientBrief(DEFAULT_CLIENT_BRIEF); setCharacter(DEFAULT_CHARACTER); setVisualBible(DEFAULT_VISUAL_BIBLE); setPlatform("Runway"); setRatio("2.39:1 电影宽银幕"); setDuration(45); setLanguage("中英双语"); setTargetShotCount("自动"); setHollywoodMode("luxury"); setRhythmMode("产品展示节奏"); setManualShots(null); setApiStatus("已恢复默认新能源概念车案例。"); };
  const clearAiResult = () => { setManualShots(null); setApiStatus("已恢复为本地导演引擎生成结果。 "); };
  const handleOptimizeShot = (shotId, actionKey) => { const nextShots = shots.map((shot) => Number(shot.id) === Number(shotId) ? optimizeShotWithAction(shot, actionKey, platform, character, visualBible) : shot); setManualShots(nextShots); setApiStatus(`已执行一键优化：${OPTIMIZATION_ACTIONS[actionKey]?.label || "优化"}。`); };
  const handleUpdateShot = (shotId, patch) => { const updatedShots = shots.map((shot) => { if (Number(shot.id) !== Number(shotId)) return shot; const updated = { ...shot, ...patch }; const quality = evaluateQuality(updated, character, visualBible); return { ...updated, qualityScore: quality.score, risk: quality.risk, optimizationTips: quality.tips }; }); const nextShots = Object.prototype.hasOwnProperty.call(patch, "duration") ? recalculateShotTimes(updatedShots) : updatedShots; setManualShots(nextShots); };
  const handleImportFile = async (file) => { setImportStatus(`正在读取：${file.name} ...`); try { const importedText = await extractScriptFromFile(file); const cleanedText = importedText.split(String.fromCharCode(13)).join("").trim(); if (cleanedText.length < 8) throw new Error("文档内容太短，没有形成可用脚本。 "); setScript(cleanedText); setManualShots(null); setImportStatus(`已导入：${file.name}，识别 ${cleanedText.length} 字，可直接生成分镜。`); setApiStatus(`已从 Word / 文本文件导入脚本：${file.name}。`); } catch (error) { const message = error instanceof Error ? error.message : "导入失败，请检查文件格式。"; setImportStatus(message); setApiStatus(message); } };
  const copyText = async (text, type) => { try { if (navigator?.clipboard?.writeText) await navigator.clipboard.writeText(text); else throw new Error("Clipboard API unavailable"); setCopied(type); window.setTimeout(() => setCopied(""), 1800); } catch (error) { const area = document.createElement("textarea"); area.value = text; area.setAttribute("readonly", ""); area.style.position = "fixed"; area.style.opacity = "0"; document.body.appendChild(area); area.select(); document.execCommand("copy"); document.body.removeChild(area); setCopied(type); window.setTimeout(() => setCopied(""), 1800); } };
  const handleLocalDirector = () => { setAiProgress(15); setApiStatus("正在使用 Polaris 本地导演引擎生成中英文提示词……"); window.setTimeout(() => setAiProgress(60), 120); window.setTimeout(() => { setManualShots(generateStoryboard({ script, duration, platform, ratio, language, hollywoodMode, rhythmMode, character, visualBible, clientBrief, negativePrompt, targetShotCount })); setAiProgress(100); setApiStatus("已使用 Polaris 本地电影导演引擎生成好莱坞级中英文提示词。 "); window.setTimeout(() => setAiProgress(0), 700); }, 260); };
  const handleAiEnhance = async () => { if (!shots.length) { setApiStatus("请先输入脚本，再进行 AI 增强。 "); return; } if (!useApi) { setIsEnhancing(true); setAiProgress(5); handleLocalDirector(); window.setTimeout(() => setIsEnhancing(false), 1000); return; } if (!apiEndpoint.trim()) { setApiStatus("请填写 API Endpoint，推荐使用自己的后端代理接口，例如 /api/ai-storyboard。 "); return; } setIsEnhancing(true); setAiProgress(8); setApiStatus("正在整理脚本、客户 Brief、角色圣经和视觉圣经……"); try { const instruction = buildAiInstruction({ script, shots, settings: exportSettings, character, visualBible, clientBrief }); setAiProgress(24); const headers = { "Content-Type": "application/json" }; if (apiKey.trim()) headers.Authorization = `Bearer ${apiKey.trim()}`; setApiStatus("正在请求 DeepSeek 生成中英文电影级提示词……"); setAiProgress(46); const response = await fetch(apiEndpoint.trim(), { method: "POST", headers, body: JSON.stringify({ model: apiModel.trim() || "deepseek-v4-flash", temperature: 0.72, messages: [{ role: "system", content: "你是 Polaris北极星 AIGC Studio 的电影级分镜导演、摄影指导和提示词工程师。请为每个镜头同时输出 promptZh 中文提示词和 promptEn 英文提示词。" }, { role: "user", content: instruction }] }) }); setAiProgress(72); if (!response.ok) throw new Error(`API 请求失败：HTTP ${response.status}`); const payload = await response.json(); setApiStatus("正在解析模型返回结果并更新分镜……"); setAiProgress(88); const aiJson = normalizeAiResult(payload); setManualShots(mergeAiShots(shots, aiJson, negativePrompt, character, visualBible)); setAiProgress(100); setApiStatus("AI 增强完成：已更新为大模型优化后的电影级中英文提示词。 "); window.setTimeout(() => setAiProgress(0), 900); } catch (error) { setAiProgress(0); setApiStatus(`${error.message || "AI 增强失败"}。已保留当前分镜，可检查接口地址、CORS、返回 JSON 格式或 API Key。`); } finally { window.setTimeout(() => setIsEnhancing(false), 350); } };
  const handleExportExcel = () => { if (!shots.length) { setApiStatus("暂无分镜内容，无法导出 Excel。 "); return; } downloadFile({ content: makeExcelHtml(shots), mimeType: "application/vnd.ms-excel;charset=utf-8", filename: `${safeFileName(project.projectName)}_Polaris分镜表.xls` }); setApiStatus("已导出 Excel 电影级分镜制作表。 "); };
  const handleExportWord = () => { if (!shots.length) { setApiStatus("暂无分镜内容，无法导出 Word。 "); return; } downloadFile({ content: makeClientWordHtml(shots, exportSettings, character, visualBible, clientBrief), mimeType: "application/msword;charset=utf-8", filename: `${safeFileName(project.projectName)}_Polaris客户交付方案.doc` }); setApiStatus("已导出客户交付版 Word 报告。 "); };

  return <div className="min-h-screen bg-[#080807] text-stone-100"><style>{`.studio-bg{background:radial-gradient(circle at 20% 0%,rgba(251,191,36,.14),transparent 30%),radial-gradient(circle at 88% 8%,rgba(56,189,248,.09),transparent 28%),linear-gradient(135deg,#080807 0%,#11100e 48%,#080807 100%)}.film-grain{background-image:radial-gradient(circle at 1px 1px,rgba(255,255,255,.08) 1px,transparent 0);background-size:30px 30px;mask-image:linear-gradient(to bottom,black,transparent 84%)}`}</style><div className="pointer-events-none fixed inset-0 studio-bg" /><div className="pointer-events-none fixed inset-0 film-grain opacity-[0.12]" /><nav className="sticky top-0 z-40 border-b border-white/10 bg-[#080807]/78 backdrop-blur-2xl"><div className="mx-auto flex max-w-[1560px] items-center justify-between gap-4 px-5 py-4 md:px-8"><div className="flex min-w-0 items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-300 text-black shadow-lg shadow-amber-500/20"><Icon name="star" className="h-5 w-5" /></div><div className="min-w-0"><div className="truncate text-sm font-black tracking-[0.18em] text-white">Polaris北极星</div><div className="truncate text-xs text-stone-500">AIGC Film Director System</div></div></div><div className="hidden items-center gap-2 xl:flex"><Badge tone="amber">{project.projectName}</Badge><Badge>{mode.label}</Badge><Badge>{platform}</Badge></div><div className="flex flex-wrap gap-2"><ActionButton onClick={handleAiEnhance} icon="wand" variant="primary" disabled={isEnhancing}>{isEnhancing ? "生成中" : "生成分镜"}</ActionButton><ActionButton onClick={handleExportWord} icon="file" variant="gold">Word</ActionButton><ActionButton onClick={handleExportExcel} icon="table">Excel</ActionButton></div></div></nav><main className="relative mx-auto max-w-[1560px] px-5 pb-14 pt-8 md:px-8"><section className="mb-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"><div className="rounded-[2.5rem] border border-white/10 bg-[#12110f]/80 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-9"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-semibold text-amber-100"><Icon name="film" className="h-4 w-4" /> Studio-grade cinematic workflow</div><h1 className="max-w-5xl text-4xl font-black tracking-[-0.06em] text-white md:text-6xl">北极星电影级<span className="block bg-gradient-to-r from-amber-100 via-white to-stone-400 bg-clip-text text-transparent">AIGC 分镜导演台</span></h1><p className="mt-5 max-w-3xl text-base leading-8 text-stone-400">把脚本、客户 Brief、角色一致性、Visual Bible、平台提示词、质量评分和客户交付统一到一个舒服的工作空间。</p></div><div className="grid grid-cols-2 gap-4"><StatCard icon="film" label="Shots" value={`${shots.length}`} accent="amber" /><StatCard icon="clock" label="Duration" value={`${effectiveDuration}s`} accent="blue" /><StatCard icon="star" label="QC Score" value={`${avgScore}`} accent="green" /><StatCard icon="layers" label="Mode" value="Film" accent="violet" /></div></section><section className="grid gap-6 xl:grid-cols-[380px_1fr]"><aside className="space-y-4 xl:sticky xl:top-24 xl:self-start"><CommandPanel title="导演控制台" eyebrow="Command Center" icon="settings"><div className="space-y-3"><AccordionSection title="项目档案" icon="file" eyebrow="Project" open={openSections.project} onToggle={() => toggleSection("project")} summary={`${project.clientName} · ${project.directorName}`}><div className="grid gap-3"><Field label="项目名称"><TextInput value={project.projectName} onChange={(event) => updateObject(setProject, "projectName", event.target.value)} /></Field><Field label="客户名称"><TextInput value={project.clientName} onChange={(event) => updateObject(setProject, "clientName", event.target.value)} /></Field><div className="grid grid-cols-2 gap-3"><Field label="导演"><TextInput value={project.directorName} onChange={(event) => updateObject(setProject, "directorName", event.target.value)} /></Field><Field label="提示词工程师"><TextInput value={project.promptEngineer} onChange={(event) => updateObject(setProject, "promptEngineer", event.target.value)} /></Field></div><Field label="目标受众"><TextInput value={project.targetAudience} onChange={(event) => updateObject(setProject, "targetAudience", event.target.value)} /></Field><button onClick={resetDemo} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-semibold text-stone-200 transition hover:bg-white/[0.12]" type="button">恢复示例项目</button></div></AccordionSection><AccordionSection title="客户需求 Brief" icon="file" eyebrow="Client Brief" open={openSections.brief} onToggle={() => toggleSection("brief")} summary={clientBrief.brandTone}><div className="grid gap-3"><Field label="核心表达"><TextAreaInput value={clientBrief.coreMessage} onChange={(event) => updateObject(setClientBrief, "coreMessage", event.target.value)} /></Field><Field label="产品卖点"><TextAreaInput value={clientBrief.sellingPoints} onChange={(event) => updateObject(setClientBrief, "sellingPoints", event.target.value)} /></Field><Field label="目标人群"><TextInput value={clientBrief.targetUser} onChange={(event) => updateObject(setClientBrief, "targetUser", event.target.value)} /></Field><Field label="视频目的"><TextInput value={clientBrief.videoGoal} onChange={(event) => updateObject(setClientBrief, "videoGoal", event.target.value)} /></Field><Field label="品牌调性"><TextInput value={clientBrief.brandTone} onChange={(event) => updateObject(setClientBrief, "brandTone", event.target.value)} /></Field><Field label="参考风格"><TextAreaInput value={clientBrief.references} onChange={(event) => updateObject(setClientBrief, "references", event.target.value)} /></Field><Field label="禁止表达"><TextAreaInput value={clientBrief.forbidden} onChange={(event) => updateObject(setClientBrief, "forbidden", event.target.value)} /></Field></div></AccordionSection><AccordionSection title="创作模式" icon="film" eyebrow="Cinema" open={openSections.mode} onToggle={() => toggleSection("mode")} summary={`${mode.label} · ${rhythmMode}`}><div className="grid gap-4"><Field label="好莱坞电影模式"><SelectInput value={hollywoodMode} onChange={(event) => { setHollywoodMode(event.target.value); setManualShots(null); }}>{Object.entries(HOLLYWOOD_MODES).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}</SelectInput></Field><Field label="节奏引擎"><SelectInput value={rhythmMode} onChange={(event) => { setRhythmMode(event.target.value); setManualShots(null); }}>{RHYTHM_PRESETS.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field><Field label="分镜数量"><SelectInput value={targetShotCount} onChange={(event) => { setTargetShotCount(event.target.value); setManualShots(null); }}>{SHOT_COUNT_PRESETS.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field><div className="grid grid-cols-2 gap-3"><Field label="平台"><SelectInput value={platform} onChange={(event) => { setPlatform(event.target.value); setManualShots(null); }}>{PLATFORM_PRESETS.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field><Field label="画幅"><SelectInput value={ratio} onChange={(event) => { setRatio(event.target.value); setManualShots(null); }}>{RATIO_PRESETS.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field></div><div className="grid grid-cols-2 gap-3"><Field label="总时长/秒"><TextInput type="number" min="9" max="240" value={duration} onChange={(event) => { setDuration(event.target.value); setManualShots(null); }} /></Field><Field label="语言"><SelectInput value={language} onChange={(event) => { setLanguage(event.target.value); setManualShots(null); }}>{LANGUAGE_PRESETS.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field></div><div className="rounded-2xl border border-amber-300/15 bg-amber-300/8 p-4 text-xs leading-6 text-stone-400"><b className="text-amber-100">{mode.tagline}</b><br />{mode.lens}<br />{mode.lighting}<br />{mode.color}</div></div></AccordionSection></div></CommandPanel><CommandPanel title="制作圣经" eyebrow="Bible" icon="eye" compact><div className="space-y-3"><AccordionSection title="角色一致性" icon="user" eyebrow="Character Bible" open={openSections.character} onToggle={() => toggleSection("character")} summary={`${character.name} · ${character.age}`}><div className="grid gap-3"><Field label="角色名"><TextInput value={character.name} onChange={(event) => { updateObject(setCharacter, "name", event.target.value); setManualShots(null); }} /></Field><div className="grid grid-cols-2 gap-3"><Field label="年龄"><TextInput value={character.age} onChange={(event) => { updateObject(setCharacter, "age", event.target.value); setManualShots(null); }} /></Field><Field label="气质"><TextInput value={character.temperament} onChange={(event) => { updateObject(setCharacter, "temperament", event.target.value); setManualShots(null); }} /></Field></div><Field label="外貌特征"><TextAreaInput value={character.appearance} onChange={(event) => { updateObject(setCharacter, "appearance", event.target.value); setManualShots(null); }} /></Field><Field label="发型"><TextAreaInput value={character.hair} onChange={(event) => { updateObject(setCharacter, "hair", event.target.value); setManualShots(null); }} /></Field><Field label="服装"><TextAreaInput value={character.outfit} onChange={(event) => { updateObject(setCharacter, "outfit", event.target.value); setManualShots(null); }} /></Field><Field label="关键道具"><TextInput value={character.props} onChange={(event) => { updateObject(setCharacter, "props", event.target.value); setManualShots(null); }} /></Field><Field label="锁定特征"><TextAreaInput value={character.lockedTraits} onChange={(event) => { updateObject(setCharacter, "lockedTraits", event.target.value); setManualShots(null); }} /></Field></div></AccordionSection><AccordionSection title="Visual Bible" icon="eye" eyebrow="Look Bible" open={openSections.visual} onToggle={() => toggleSection("visual")} summary={visualBible.colorPalette}><div className="grid gap-3"><Field label="世界观设定"><TextAreaInput value={visualBible.worldSetting} onChange={(event) => { updateObject(setVisualBible, "worldSetting", event.target.value); setManualShots(null); }} /></Field><Field label="主色调"><TextInput value={visualBible.colorPalette} onChange={(event) => { updateObject(setVisualBible, "colorPalette", event.target.value); setManualShots(null); }} /></Field><Field label="灯光风格"><TextAreaInput value={visualBible.lightingStyle} onChange={(event) => { updateObject(setVisualBible, "lightingStyle", event.target.value); setManualShots(null); }} /></Field><Field label="场景风格"><TextAreaInput value={visualBible.sceneStyle} onChange={(event) => { updateObject(setVisualBible, "sceneStyle", event.target.value); setManualShots(null); }} /></Field><Field label="服装风格"><TextAreaInput value={visualBible.costumeStyle} onChange={(event) => { updateObject(setVisualBible, "costumeStyle", event.target.value); setManualShots(null); }} /></Field><Field label="道具风格"><TextAreaInput value={visualBible.propStyle} onChange={(event) => { updateObject(setVisualBible, "propStyle", event.target.value); setManualShots(null); }} /></Field><Field label="禁止元素"><TextAreaInput value={visualBible.forbiddenElements} onChange={(event) => { updateObject(setVisualBible, "forbiddenElements", event.target.value); setManualShots(null); }} /></Field><Field label="通用负面提示词"><TextAreaInput value={negativePrompt} onChange={(event) => { setNegativePrompt(event.target.value); setManualShots(null); }} /></Field></div></AccordionSection></div></CommandPanel><CommandPanel title="AI 增强接口" eyebrow="Model Gateway" icon="brain" compact><AccordionSection title="接口设置" icon="brain" eyebrow="API" open={openSections.ai} onToggle={() => toggleSection("ai")} summary={useApi ? "真实 API 已开启" : "本地导演引擎"}><div className="grid gap-3"><div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-xs leading-5 text-amber-100"><b>DeepSeek 接入建议：</b>让学生用后端代理请求 DeepSeek，不要把 API Key 写在前端。前端默认请求 /api/ai-storyboard，后端再转发到 https://api.deepseek.com/chat/completions。</div><div className="grid grid-cols-2 gap-3"><ActionButton onClick={() => copyText(getDeepSeekNextRouteCode(), "next-deepseek")} icon={copied === "next-deepseek" ? "check" : "copy"} className="w-full">{copied === "next-deepseek" ? "已复制" : "复制 Next.js 后端"}</ActionButton><ActionButton onClick={() => copyText(getDeepSeekExpressCode(), "express-deepseek")} icon={copied === "express-deepseek" ? "check" : "copy"} className="w-full">{copied === "express-deepseek" ? "已复制" : "复制 Express 后端"}</ActionButton></div><div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4"><div><div className="text-sm font-semibold text-stone-100">真实 API 请求</div><div className="mt-1 text-xs text-stone-500">关闭时使用本地导演引擎</div></div><Toggle enabled={useApi} onClick={() => setUseApi((value) => !value)} /></div><Field label="API Endpoint"><TextInput value={apiEndpoint} onChange={(event) => setApiEndpoint(event.target.value)} placeholder="/api/ai-storyboard" /></Field><Field label="DeepSeek 模型"><SelectInput value={apiModel} onChange={(event) => setApiModel(event.target.value)}>{DEEPSEEK_MODEL_PRESETS.map((item) => <option key={item}>{item}</option>)}</SelectInput></Field><Field label="临时 API Key / 不推荐前端保存"><TextInput value={apiKey} onChange={(event) => setApiKey(event.target.value)} type="password" placeholder="建议留空，改用后端 .env.local 保存 DEEPSEEK_API_KEY" /></Field><div className="grid grid-cols-2 gap-3"><ActionButton onClick={handleAiEnhance} icon="brain" variant="violet" disabled={isEnhancing} className="w-full">{isEnhancing ? "生成中" : "AI 增强"}</ActionButton><ActionButton onClick={clearAiResult} icon="refresh" disabled={!manualShots} className="w-full">恢复</ActionButton></div>{isEnhancing ? <AiProgressBar progress={aiProgress} label="DeepSeek / Polaris AI 生成进度" /> : null}<div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-5 text-stone-500">{apiStatus}</div></div></AccordionSection></CommandPanel></aside><section className="space-y-6"><ScriptComposer script={script} setScript={(value) => { setScript(value); setManualShots(null); }} shots={shots} onReset={resetDemo} onGenerate={handleAiEnhance} isEnhancing={isEnhancing} onImportFile={handleImportFile} importStatus={importStatus} aiProgress={aiProgress} /><div className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-white/10 bg-[#12110f]/80 p-3 shadow-2xl shadow-black/25 backdrop-blur-xl"><div className="flex flex-wrap gap-2">{[["storyboard", "电影分镜"], ["quality", "质量评分"], ["continuity", "连续性检查"], ["delivery", "交付预览"], ["export", "导出中心"]].map(([key, label]) => <button key={key} onClick={() => setPanel(key)} className={classNames("rounded-2xl px-4 py-2 text-sm font-semibold transition", panel === key ? "bg-amber-300 text-black" : "text-stone-500 hover:bg-white/[0.07] hover:text-stone-100")} type="button">{label}</button>)}</div><div className="flex flex-wrap gap-2"><ActionButton onClick={() => copyText(markdown, "markdown")} icon={copied === "markdown" ? "check" : "copy"} variant="primary">{copied === "markdown" ? "已复制" : "复制方案"}</ActionButton><ActionButton onClick={() => copyText(joinPrompts(shots), "prompts")} icon={copied === "prompts" ? "check" : "copy"}>复制提示词</ActionButton></div></div>{shots.length === 0 ? <div className="rounded-[2rem] border border-dashed border-white/15 bg-[#12110f]/80 p-12 text-center shadow-2xl shadow-black/25"><div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-amber-300 text-black"><Icon name="film" className="h-7 w-7" /></div><h3 className="text-xl font-black text-white">等待脚本输入</h3><p className="mt-2 text-sm text-stone-500">粘贴脚本后，这里会自动生成电影级分镜、质量评分和客户报告。</p></div> : panel === "storyboard" ? <div className="space-y-5">{shots.map((shot) => <ShotCard key={shot.id} shot={shot} copied={copied} copyText={copyText} onOptimize={handleOptimizeShot} onUpdate={handleUpdateShot} />)}</div> : panel === "quality" ? <QualityPanel shots={shots} /> : panel === "continuity" ? <ContinuityPanel continuity={continuity} /> : panel === "delivery" ? <DeliveryPreview project={project} mode={mode} platform={platform} ratio={ratio} effectiveDuration={effectiveDuration} character={character} visualBible={visualBible} clientBrief={clientBrief} markdown={markdown} copied={copied} copyText={copyText} /> : <ExportCenter handleExportWord={handleExportWord} handleExportExcel={handleExportExcel} />}<WorkflowFooter /></section></section></main></div>;
}
