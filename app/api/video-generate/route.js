export const runtime = "edge";
export const maxDuration = 60;

const DEFAULT_SEEDANCE_VIDEO_ENDPOINT = "https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks";
const DEFAULT_SEEDANCE_MODEL = "doubao-seedance-2-0-260128";

const OFFICIAL_SEEDANCE_MODELS = new Set([
  "doubao-seedance-2-0-260128",
  "doubao-seedance-2-0-fast-260128",
  "doubao-seedance-1-5-pro-251215",
  "doubao-seedance-1-0-pro-250528",
  "doubao-seedance-1-0-pro-fast-251015",
  "doubao-seedance-1-0-lite-t2v-250428",
  "doubao-seedance-1-0-lite-i2v-250428",
]);

const MODEL_ALIASES = new Map([
  ["jimeng-video-agent", DEFAULT_SEEDANCE_MODEL],
  ["dreamina-video-agent", DEFAULT_SEEDANCE_MODEL],
  ["seedance-video-agent", DEFAULT_SEEDANCE_MODEL],
  ["doubao-seedance-2-0-pro-260511", "doubao-seedance-2-0-260128"],
  ["doubao-seedance-2-0-lite-260511", "doubao-seedance-2-0-fast-260128"],
  ["doubao-seedance-2-0-pro", "doubao-seedance-2-0-260128"],
  ["doubao-seedance-2-0-lite", "doubao-seedance-2-0-fast-260128"],
  ["doubao-seedance-2-0", "doubao-seedance-2-0-260128"],
  ["seedance-2-0", "doubao-seedance-2-0-260128"],
  ["seedance-2.0", "doubao-seedance-2-0-260128"],
  ["seedance-2-0-fast", "doubao-seedance-2-0-fast-260128"],
  ["seedance-2.0-fast", "doubao-seedance-2-0-fast-260128"],
  ["seedance-1-5-pro", "doubao-seedance-1-5-pro-251215"],
  ["seedance-1.5-pro", "doubao-seedance-1-5-pro-251215"],
  ["seedance-1-5", "doubao-seedance-1-5-pro-251215"],
  ["seedance-1.5", "doubao-seedance-1-5-pro-251215"],
  ["seedance-1-0-pro", "doubao-seedance-1-0-pro-250528"],
  ["seedance-1.0-pro", "doubao-seedance-1-0-pro-250528"],
  ["seedance-1-0-pro-fast", "doubao-seedance-1-0-pro-fast-251015"],
  ["seedance-1.0-pro-fast", "doubao-seedance-1-0-pro-fast-251015"],
  ["seedance-1-0-lite-t2v", "doubao-seedance-1-0-lite-t2v-250428"],
  ["seedance-1-0-lite-i2v", "doubao-seedance-1-0-lite-i2v-250428"],
]);

function cleanText(value = "") {
  return String(value ?? "").trim();
}

function lowerText(value = "") {
  return cleanText(value).toLowerCase();
}

function pickEnv(...names) {
  for (const name of names) {
    const v = cleanText(process.env[name]);
    if (v) return v;
  }
  return "";
}

function isAbsoluteHttpUrl(value = "") {
  const v = cleanText(value);
  if (!v) return false;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function isLocalApiRoute(value = "") {
  return /^\/api\//i.test(cleanText(value));
}

function isVolcengineArkEndpoint(value = "") {
  const v = lowerText(value);
  return v.includes("volces.com/api/v3/contents/generations/tasks") || v.includes("byteplus") || v.includes("modelark") || v.includes("/contents/generations/tasks");
}

function looksLikeApiKey(value = "") {
  const v = cleanText(value).replace(/^Bearer\s+/i, "");
  if (!v || isAbsoluteHttpUrl(v) || isLocalApiRoute(v)) return false;
  if (/^(ark-|sk-|ak-|pk_|rk_|key-|kling-|jimeng-)/i.test(v)) return true;
  return v.length >= 24 && !v.includes("/") && !v.includes(".") && /^[A-Za-z0-9_\-]+$/.test(v);
}

function makeFriendlyApiError(serviceName, message, hint = "") {
  const err = new Error(`${serviceName}: ${message}`);
  err.status = 400;
  err.hint = hint;
  return err;
}

function normalizeBodyApiFields(body = {}, serviceName = "Video API") {
  const warnings = Array.isArray(body._apiWarnings) ? body._apiWarnings : Array.isArray(body.warnings) ? [...body.warnings] : [];
  const endpoint = cleanText(body.endpoint);
  const apiKey = cleanText(body.apiKey);

  if (isLocalApiRoute(endpoint)) {
    body.endpoint = "";
    warnings.push(`${serviceName}: Endpoint 是本地代理路由，已忽略；浏览器会访问 /api/video-generate，服务端再转发官方接口。`);
  }
  if (looksLikeApiKey(endpoint)) {
    if (!apiKey) body.apiKey = endpoint.replace(/^Bearer\s+/i, "");
    body.endpoint = "";
    warnings.push(`${serviceName}: Endpoint 看起来像 API Key，已自动移到密钥栏并清空 Endpoint。`);
  }
  if (isAbsoluteHttpUrl(apiKey) && !cleanText(body.endpoint)) {
    body.endpoint = apiKey;
    body.apiKey = "";
    warnings.push(`${serviceName}: API Key 栏看起来像 URL，已自动移动到 Endpoint。`);
  }
  if (looksLikeApiKey(body.queryEndpoint)) {
    body.queryEndpoint = "";
    warnings.push(`${serviceName}: Query Endpoint 看起来像 API Key，已清空。查询接口必须是 https:// 开头。`);
  }
  body._apiWarnings = warnings;
  return body;
}

function ensureEndpointUrl(endpoint = "", serviceName = "Video API") {
  const url = cleanText(endpoint);
  if (!url) return "";
  if (isLocalApiRoute(url)) return "";
  if (looksLikeApiKey(url)) {
    throw makeFriendlyApiError(serviceName, "Endpoint 填成了 API Key。", "Endpoint 必须是 https:// 开头的完整接口地址；API Key 请填写在密钥栏。即梦/Seedance 官方 Endpoint 可以留空。可灵必须填写官方或中转接口地址。");
  }
  if (!isAbsoluteHttpUrl(url)) {
    throw makeFriendlyApiError(serviceName, `Endpoint 不是有效 URL：${url.slice(0, 48)}`, "请填写完整接口地址，例如 https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks，或留空使用默认接口。");
  }
  return url;
}

function isKlingProvider(provider = "") {
  const p = lowerText(provider);
  return p.includes("kling") || p.includes("可灵");
}

function isCustomProvider(provider = "") {
  const p = lowerText(provider);
  return p.includes("custom") || p.includes("自定义") || p.includes("coze");
}

function isJimengProvider(provider = "") {
  const p = lowerText(provider);
  return p.includes("jimeng") || p.includes("即梦") || p.includes("dreamina") || p.includes("seedance") || p.includes("volcengine") || p.includes("火山");
}

function normalizeSeedanceModel(model = "", body = {}) {
  const raw = cleanText(model) || DEFAULT_SEEDANCE_MODEL;
  const key = raw.toLowerCase();
  let normalized = MODEL_ALIASES.get(key) || raw;

  const hasImage = Boolean(
    cleanText(body.firstFrameUrl || body.image || body.imageUrl || body.first_frame_url) ||
    (Array.isArray(body.referenceImages) && body.referenceImages.filter(Boolean).length) ||
    (Array.isArray(body.images) && body.images.filter(Boolean).length)
  );
  if (normalized === "doubao-seedance-1-0-lite-i2v-250428" && !hasImage) normalized = "doubao-seedance-1-0-lite-t2v-250428";
  if (normalized === "doubao-seedance-1-0-lite-t2v-250428" && hasImage) normalized = "doubao-seedance-1-0-lite-i2v-250428";

  if (OFFICIAL_SEEDANCE_MODELS.has(normalized)) return normalized;
  if (/^ep-[A-Za-z0-9_-]+$/.test(normalized)) return normalized;
  if (lowerText(normalized).includes("seedance")) return normalized;
  return DEFAULT_SEEDANCE_MODEL;
}

function isOfficialSeedanceModel(model = "") {
  const normalized = normalizeSeedanceModel(model);
  return OFFICIAL_SEEDANCE_MODELS.has(normalized) || lowerText(normalized).startsWith("doubao-seedance") || lowerText(normalized).includes("seedance");
}

function modelFamily(model = "") {
  const m = lowerText(model);
  if (m.includes("2-0")) return "2.0";
  if (m.includes("1-5")) return "1.5";
  if (m.includes("1-0")) return "1.0";
  return "seedance";
}

function isSeedance20(model = "") {
  return modelFamily(model) === "2.0";
}

function isSeedance15(model = "") {
  return modelFamily(model) === "1.5";
}

function cleanRatio(ratio = "adaptive") {
  const raw = cleanText(ratio).replace(/\s*\/\s*.*/g, "").toLowerCase();
  if (!raw || raw.includes("auto") || raw.includes("自动")) return "adaptive";
  const match = raw.match(/(21:9|16:9|9:16|4:3|3:4|1:1|adaptive)/i);
  return match ? match[1] : "adaptive";
}

function cleanResolution(resolution = "720p", model = "") {
  const raw = cleanText(resolution).toLowerCase();
  const match = raw.match(/(480p|720p|1080p)/i);
  let res = match ? match[1] : "720p";
  const m = lowerText(model);
  if ((m.includes("2-0-fast") || m.includes("lite")) && res === "1080p") res = "720p";
  return res;
}

function normalizeDuration(duration = 5, model = "") {
  const raw = cleanText(duration || 5).replace(/s$/i, "");
  const n = Number(raw);
  let value = Number.isFinite(n) ? n : 5;
  const family = modelFamily(model);

  if ((family === "2.0" || family === "1.5") && value === -1) return -1;
  if (family === "2.0") return Math.max(4, Math.min(15, Math.round(value)));
  if (family === "1.5") return Math.max(4, Math.min(12, Math.round(value)));
  if (model.includes("lite")) return Math.max(2, Math.min(12, Math.round(value)));
  return Math.max(2, Math.min(12, Math.round(value)));
}

function normalizeSeed(seed) {
  if (seed === undefined || seed === null || String(seed) === "") return -1;
  const n = Number(seed);
  if (!Number.isFinite(n)) return -1;
  return Math.max(-1, Math.min(4294967295, Math.trunc(n)));
}

function boolValue(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  const v = lowerText(value);
  return ["1", "true", "yes", "y", "on", "是", "开启"].includes(v);
}

function uniqueValues(items = []) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const v = cleanText(item);
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

function isImageLike(value = "") {
  const v = cleanText(value);
  if (!v) return false;
  return isAbsoluteHttpUrl(v) || /^data:image\//i.test(v) || /^asset:\/\//i.test(v) || /^[A-Za-z0-9+/=\s]{200,}$/.test(v);
}

function normalizeInlineImage(value = "") {
  const v = cleanText(value);
  if (!v) return "";
  if (/^https?:\/\//i.test(v) || /^data:image\//i.test(v) || /^asset:\/\//i.test(v)) return v;
  if (/^[A-Za-z0-9+/=\r\n]{200,}$/.test(v)) return `data:image/png;base64,${v.replace(/\s+/g, "")}`;
  return v;
}

function filterImageReferencesForRequest(items = [], warnings = []) {
  const out = [];
  let inlineTotal = 0;
  const MAX_SINGLE_INLINE = 1800000;
  const MAX_TOTAL_INLINE = 3800000;
  uniqueValues(items.map(normalizeInlineImage)).forEach(url => {
    if (!url) return;
    const inlineBytes = /^data:image\//i.test(url) ? url.length : 0;
    if (inlineBytes && inlineBytes > MAX_SINGLE_INLINE) {
      warnings.push("有一张内联参考图超过安全大小，已忽略。建议导入时压缩，或换成 TOS/OSS/COS HTTPS 图片地址。");
      return;
    }
    if (inlineBytes && inlineTotal + inlineBytes > MAX_TOTAL_INLINE) {
      warnings.push("内联参考图总量过大，已忽略超出部分，避免视频 API 请求体过大。");
      return;
    }
    inlineTotal += inlineBytes;
    out.push(url);
  });
  return out;
}

function imageContent(url = "", role = "") {
  const image = normalizeInlineImage(url);
  if (!image) return null;
  const item = { type: "image_url", image_url: { url: image } };
  if (role) item.role = role;
  return item;
}

function videoContent(url = "", role = "reference_video") {
  const video = cleanText(url);
  if (!video) return null;
  return { type: "video_url", video_url: { url: video }, role };
}

function audioContent(url = "", role = "reference_audio") {
  const audio = cleanText(url);
  if (!audio) return null;
  return { type: "audio_url", audio_url: { url: audio }, role };
}

function buildSeedancePrompt(prompt = "", body = {}) {
  const parts = [cleanText(prompt)];
  const cameraMotion = cleanText(body.cameraMotion);
  if (cameraMotion && !/^auto/i.test(cameraMotion) && !cameraMotion.includes("自动")) {
    parts.push(`Camera motion / 运镜：${cameraMotion}`);
  }
  return parts.filter(Boolean).join("\n");
}

function isProbablyHtml(text = "") {
  return /^\s*<!doctype html/i.test(String(text || "")) || /<html[\s>]/i.test(String(text || "").slice(0, 800));
}

function extractNestedVideoUrl(value) {
  if (!value) return "";
  if (typeof value === "string") return isAbsoluteHttpUrl(value) ? value : "";
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = extractNestedVideoUrl(item);
      if (found) return found;
    }
    return "";
  }
  if (typeof value === "object") {
    return value.videoUrl || value.video_url || value.url || value.uri || value.download_url || value?.video?.url || value?.video?.video_url || value?.file?.url || value?.content?.video_url || value?.output?.video_url || extractNestedVideoUrl(value.content) || extractNestedVideoUrl(value.output) || extractNestedVideoUrl(value.outputs) || extractNestedVideoUrl(value.videos) || extractNestedVideoUrl(value.data) || "";
  }
  return "";
}

function normalizeVideoTask(json = {}) {
  const d = json?.data || json?.result || json || {};
  const taskId = json.taskId || json.task_id || json.id || d.taskId || d.task_id || d.id || d?.task?.id || "";
  const rawStatus = json.status || d.status || json.state || d.state || json.task_status || d?.task_status || d?.status_text || "submitted";
  const status = String(rawStatus || "submitted").toLowerCase();
  const videoUrl = extractNestedVideoUrl(json) || extractNestedVideoUrl(d) || "";
  const coverUrl = json.coverUrl || json.cover_url || d.coverUrl || d.cover_url || d?.cover?.url || "";
  const progress = json.progress ?? d.progress ?? d?.task?.progress ?? null;
  return { ok: true, taskId, status, videoUrl, coverUrl, progress, raw: json };
}

async function callJson(url, init = {}) {
  const upstream = await fetch(url, init);
  const text = await upstream.text();
  let json = {};
  try { json = JSON.parse(text); } catch { json = { raw: text }; }

  if (isProbablyHtml(text)) {
    const err = new Error("视频接口返回了 HTML 页面，不是 JSON。通常是 Endpoint 填成了网页/Next 页面地址，或 API 路由没有正确放到 app/api/video-generate/route.js。");
    err.status = upstream.status || 500;
    err.raw = { contentType: upstream.headers.get("content-type") || "", preview: text.slice(0, 700) };
    err.hint = "即梦/Seedance 官方 Endpoint 可留空；前端只填 /api/video-generate。不要把控制台网页、Next 页面、或官网地址当作视频 Endpoint。";
    throw err;
  }

  if (!upstream.ok || json?.ok === false) {
    const message = json?.error?.message || json?.message || json?.error || text || `Video API Error ${upstream.status}`;
    const err = new Error(message);
    err.status = upstream.status || json?.status || 500;
    err.raw = json;
    err.hint = json?.hint || "检查 API Key、模型 ID、Endpoint、比例/清晰度/时长是否被当前模型支持。Seedance 2.0 还需要在方舟开通模型，并满足余额/资源包要求。";
    throw err;
  }
  return json;
}

async function forwardToCustomAgent(body) {
  const action = lowerText(body.action || "create");
  const kling = isKlingProvider(body.provider);
  normalizeBodyApiFields(body, kling ? "Kling Video / 可灵视频" : "Custom Video / 自定义视频");
  const envQueryEndpoint = kling
    ? pickEnv("KLING_VIDEO_QUERY_ENDPOINT", "KLING_AGENT_QUERY_ENDPOINT", "VIDEO_AGENT_QUERY_ENDPOINT", "CUSTOM_VIDEO_AGENT_QUERY_ENDPOINT")
    : pickEnv("JIMENG_VIDEO_QUERY_ENDPOINT", "JIMENG_AGENT_QUERY_ENDPOINT", "VIDEO_AGENT_QUERY_ENDPOINT", "CUSTOM_VIDEO_AGENT_QUERY_ENDPOINT");
  const envEndpoint = kling
    ? pickEnv("KLING_VIDEO_ENDPOINT", "KLING_AGENT_ENDPOINT", "VIDEO_AGENT_ENDPOINT", "CUSTOM_VIDEO_AGENT_ENDPOINT")
    : pickEnv("JIMENG_VIDEO_ENDPOINT", "JIMENG_AGENT_ENDPOINT", "VIDEO_AGENT_ENDPOINT", "CUSTOM_VIDEO_AGENT_ENDPOINT");
  const rawEndpoint = (["query", "status", "poll", "get"].includes(action) && (cleanText(body.queryEndpoint) || envQueryEndpoint))
    ? (cleanText(body.queryEndpoint) || envQueryEndpoint)
    : (cleanText(body.endpoint) || envEndpoint);
  const endpoint = ensureEndpointUrl(rawEndpoint, kling ? "Kling Video / 可灵视频" : "Custom Video / 自定义视频");
  if (!endpoint) return null;

  const apiKey = cleanText(body.apiKey) || (kling
    ? pickEnv("KLING_API_KEY", "KLING_VIDEO_API_KEY", "VIDEO_AGENT_API_KEY", "CUSTOM_VIDEO_AGENT_API_KEY")
    : pickEnv("JIMENG_API_KEY", "JIMENG_VIDEO_API_KEY", "JIMENG_AGENT_API_KEY", "VIDEO_AGENT_API_KEY", "CUSTOM_VIDEO_AGENT_API_KEY"));
  const authHeader = cleanText(body.authHeader || process.env.JIMENG_AGENT_AUTH_HEADER || process.env.KLING_AGENT_AUTH_HEADER || process.env.VIDEO_AGENT_AUTH_HEADER || "Authorization");
  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers[authHeader] = authHeader.toLowerCase() === "authorization" ? `Bearer ${apiKey}` : apiKey;

  const json = await callJson(endpoint, { method: "POST", headers, body: JSON.stringify(body) });
  return { ...normalizeVideoTask(json), provider: body.provider || "Custom Video Agent", endpoint, action };
}

function buildSeedanceContent(body = {}, normalized = {}) {
  const warnings = body._apiWarnings || [];
  const mode = lowerText(body.videoMode || body.referenceMode || body.mode || (body.firstFrameUrl || body.image || body.imageUrl ? "image2video" : "text2video"));
  const model = normalized.model;
  const family = modelFamily(model);
  const content = [{ type: "text", text: buildSeedancePrompt(body.prompt, body) }];

  const firstFrame = normalizeInlineImage(body.firstFrameUrl || body.image || body.imageUrl || body.first_frame_url);
  const lastFrame = normalizeInlineImage(body.lastFrameUrl || body.last_frame_url);
  const references = filterImageReferencesForRequest([
    ...(Array.isArray(body.referenceImages) ? body.referenceImages : []),
    ...(Array.isArray(body.images) ? body.images : []),
    ...(Array.isArray(body.refs) ? body.refs : []),
  ].filter(Boolean), warnings);
  const videoRefs = uniqueValues([...(Array.isArray(body.referenceVideos) ? body.referenceVideos : [])].filter(Boolean));
  const audioRefs = uniqueValues([...(Array.isArray(body.referenceAudios) ? body.referenceAudios : [])].filter(Boolean));

  if ([firstFrame, lastFrame].some(v => /^data:image\//i.test(v) && v.length > 2600000)) {
    warnings.push("首帧/尾帧内联图片较大，可能导致请求体过大；建议换成 TOS/OSS/COS HTTPS 图片地址。前端导入图会自动压缩，但大图仍建议使用公网 URL。");
  }
  if ([firstFrame, lastFrame, ...references].some(v => v && !isImageLike(v))) {
    warnings.push("检测到图片参考不是公开 URL / data:image / base64 / asset://。官方接口可能无法读取，请优先使用 TOS/OSS/COS HTTPS 图片地址或素材 ID。");
  }

  const wantsFirstLast = mode.includes("first_last") || mode.includes("firstlast") || (firstFrame && lastFrame && !mode.includes("ref") && !mode.includes("omni"));
  const wantsReference = family === "2.0" && (mode.includes("omni") || mode.includes("image_ref") || mode.includes("reference") || (mode.includes("ref") && !wantsFirstLast));
  const wantsImageToVideo = mode.includes("image2video") || mode.includes("i2v") || firstFrame || references.length;

  if (wantsFirstLast) {
    if (firstFrame && lastFrame) {
      content.push(imageContent(firstFrame, "first_frame"));
      content.push(imageContent(lastFrame, "last_frame"));
      if (references.length) warnings.push("首尾帧模式与多模态参考图互斥，已忽略额外 reference_image。需要多参考请切换“全能参考/图片参考”模式。");
    } else if (firstFrame || references[0]) {
      content.push(imageContent(firstFrame || references[0], "first_frame"));
      warnings.push("首尾帧模式缺少首帧或尾帧，已自动降级为首帧图生视频。");
    } else {
      warnings.push("首尾帧模式没有收到图片，已自动降级为文生视频。");
    }
  } else if (wantsReference) {
    const refImages = filterImageReferencesForRequest([firstFrame, ...references, lastFrame].filter(Boolean), warnings).slice(0, 9);
    content.push(...refImages.map(url => imageContent(url, "reference_image")).filter(Boolean));
    content.push(...videoRefs.slice(0, 3).map(url => videoContent(url, "reference_video")).filter(Boolean));
    if (audioRefs.length && !refImages.length && !videoRefs.length) {
      warnings.push("Seedance 2.0 不支持单独输入音频参考，已忽略音频；请至少连接 1 张参考图或 1 段参考视频。");
    } else {
      content.push(...audioRefs.slice(0, 3).map(url => audioContent(url, "reference_audio")).filter(Boolean));
    }
    if (refImages.length > 9) warnings.push("Seedance 2.0 图片参考已限制为最多 9 张，超出部分已忽略。");
    if (!refImages.length && !videoRefs.length) warnings.push("多模态参考模式没有收到图片/视频参考，已自动降级为文生视频。");
  } else if (wantsImageToVideo) {
    const img = firstFrame || references[0];
    if (img) {
      content.push(imageContent(img, "first_frame"));
      if (references.length > 1 || (references.length && firstFrame)) warnings.push("首帧图生视频只使用 1 张图片，已忽略其他参考图；多图参考请切换 Seedance 2.0 全能参考/图片参考模式。");
    }
    if ((videoRefs.length || audioRefs.length) && family !== "2.0") warnings.push("当前模式/模型不支持视频或音频参考，已忽略这些参考素材。");
  }

  body._apiWarnings = warnings;
  return content.filter(Boolean).filter(c => c.type !== "text" || cleanText(c.text));
}

function pushOptionalSeedanceParams(payload, body = {}, normalized = {}, warnings = []) {
  const model = normalized.model;
  const family = modelFamily(model);
  const mode = lowerText(body.videoMode || body.referenceMode || body.mode || "");
  const isReferenceScene = mode.includes("ref") || mode.includes("omni");

  // Seedance 2.0 暂不支持 camera_fixed；参考图场景也不支持 camera_fixed。不要把该字段发给官方强校验接口。
  if (family !== "2.0" && !isReferenceScene) {
    payload.camera_fixed = Boolean(normalized.cameraFixed);
  } else if (normalized.cameraFixed) {
    warnings.push("Seedance 2.0 或参考图场景不支持 camera_fixed，已自动移除该参数。");
  }

  if (body.generateAudio !== undefined) {
    if (family === "2.0" || family === "1.5") payload.generate_audio = boolValue(body.generateAudio, false);
    else if (boolValue(body.generateAudio)) warnings.push("当前 Seedance 1.0 模型不支持 generate_audio，已自动移除该参数。");
  }

  if (body.serviceTier || body.service_tier) {
    if (family === "2.0") warnings.push("Seedance 2.0 仅支持在线推理模式，不支持配置 service_tier，已自动移除该参数。");
    else payload.service_tier = cleanText(body.serviceTier || body.service_tier);
  }

  if (body.priority !== undefined && family === "2.0") {
    const p = Math.max(0, Math.min(9, Math.trunc(Number(body.priority) || 0)));
    if (p > 0) payload.priority = p;
  }

  if (body.executionExpiresAfter || body.execution_expires_after) {
    const seconds = Math.max(3600, Math.min(259200, Math.trunc(Number(body.executionExpiresAfter || body.execution_expires_after) || 172800)));
    payload.execution_expires_after = seconds;
  }

  if (body.returnLastFrame !== undefined) payload.return_last_frame = boolValue(body.returnLastFrame, false);
  if (body.callbackUrl || body.callback_url) payload.callback_url = cleanText(body.callbackUrl || body.callback_url);
}

async function createSeedanceTask(body = {}) {
  normalizeBodyApiFields(body, "Seedance Video / 即梦 Seedance");
  const apiKey = cleanText(body.apiKey) || pickEnv("ARK_API_KEY", "VOLCENGINE_ARK_API_KEY", "SEEDANCE_API_KEY", "JIMENG_API_KEY", "VIDEO_API_KEY");
  const endpoint = ensureEndpointUrl(cleanText(body.endpoint) || cleanText(process.env.ARK_VIDEO_ENDPOINT || process.env.SEEDANCE_VIDEO_ENDPOINT || DEFAULT_SEEDANCE_VIDEO_ENDPOINT), "Seedance Video / 即梦 Seedance") || DEFAULT_SEEDANCE_VIDEO_ENDPOINT;

  if (!apiKey) {
    return Response.json({
      ok: false,
      error: "Missing ARK_API_KEY / 缺少火山方舟 ARK_API_KEY",
      hint: "在 .env.local 或部署平台配置 ARK_API_KEY。前端画布也可以填写即梦视频密钥；Endpoint 可留空使用默认 Seedance 任务接口。",
      warnings: body._apiWarnings || [],
    }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }

  const model = normalizeSeedanceModel(body.model, body);
  const warnings = body._apiWarnings || [];
  if (model === "doubao-seedance-2-0-fast-260128" && cleanResolution(body.resolution || body.quality || "720p", model) !== cleanText(body.resolution || body.quality || "720p").toLowerCase()) {
    warnings.push("Seedance 2.0 Fast 不支持 1080p，已自动降级为 720p。");
  }

  const ratio = cleanRatio(body.ratio || "adaptive");
  const resolution = cleanResolution(body.resolution || body.quality || "720p", model);
  const duration = normalizeDuration(body.duration || 5, model);
  const seed = normalizeSeed(body.seed);
  const normalized = {
    model,
    ratio,
    resolution,
    duration,
    seed,
    cameraFixed: boolValue(body.cameraFixed, false),
    watermark: boolValue(body.watermark, false),
  };
  const content = buildSeedanceContent(body, normalized);

  if (!cleanText(body.prompt) && !content.some(c => c.type !== "text")) {
    return Response.json({ ok: false, error: "Missing prompt / 缺少视频提示词", hint: "请输入视频提示词，或连接上游图片后使用图生视频。" }, { status: 400 });
  }

  const payload = {
    model,
    content,
    resolution,
    ratio,
    duration,
    seed,
    watermark: normalized.watermark,
  };

  pushOptionalSeedanceParams(payload, body, normalized, warnings);

  const json = await callJson(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  });

  return Response.json({
    ...normalizeVideoTask(json),
    warnings: body._apiWarnings || [],
    provider: body.provider || "Volcengine Seedance / 火山方舟 Seedance",
    model,
    endpoint,
    request: {
      ...payload,
      content: payload.content.map(c => c.type === "text" ? c : { ...c, image_url: c.image_url ? "[image omitted]" : undefined, video_url: c.video_url ? "[video omitted]" : undefined, audio_url: c.audio_url ? "[audio omitted]" : undefined }),
    },
  }, { headers: { "Cache-Control": "no-store" } });
}

async function querySeedanceTask(body = {}) {
  normalizeBodyApiFields(body, "Seedance Video Query / 即梦视频查询");
  const apiKey = cleanText(body.apiKey) || pickEnv("ARK_API_KEY", "VOLCENGINE_ARK_API_KEY", "SEEDANCE_API_KEY", "JIMENG_API_KEY", "VIDEO_API_KEY");
  const base = (ensureEndpointUrl(cleanText(body.queryEndpoint || body.endpoint) || cleanText(process.env.ARK_VIDEO_ENDPOINT || process.env.SEEDANCE_VIDEO_ENDPOINT || DEFAULT_SEEDANCE_VIDEO_ENDPOINT), "Seedance Video Query / 即梦视频查询") || DEFAULT_SEEDANCE_VIDEO_ENDPOINT).replace(/\/+$/, "");
  const taskId = cleanText(body.taskId || body.task_id || body.id);

  if (!apiKey) return Response.json({ ok: false, error: "Missing ARK_API_KEY / 缺少 ARK_API_KEY", hint: "查询视频任务也需要同一个 ARK_API_KEY。" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  if (!taskId) return Response.json({ ok: false, error: "Missing taskId / 缺少视频任务 ID" }, { status: 400, headers: { "Cache-Control": "no-store" } });

  const json = await callJson(`${base}/${encodeURIComponent(taskId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
  });
  return Response.json({ ...normalizeVideoTask(json), warnings: body._apiWarnings || [], taskId, endpoint: `${base}/${taskId}` }, { headers: { "Cache-Control": "no-store" } });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = cleanText(searchParams.get("taskId") || searchParams.get("id"));
    if (!taskId) return Response.json({ ok: false, error: "Missing taskId / 缺少视频任务 ID" }, { status: 400, headers: { "Cache-Control": "no-store" } });

    const provider = cleanText(searchParams.get("provider") || "Volcengine Seedance / 火山方舟 Seedance");
    const body = {
      action: "query",
      provider,
      taskId,
      apiKey: cleanText(searchParams.get("apiKey")),
      endpoint: cleanText(searchParams.get("endpoint")),
      queryEndpoint: cleanText(searchParams.get("queryEndpoint")),
    };

    if ((isKlingProvider(provider) || isCustomProvider(provider)) && cleanText(body.queryEndpoint || body.endpoint)) {
      const agentResult = await forwardToCustomAgent(body);
      if (agentResult) return Response.json(agentResult, { headers: { "Cache-Control": "no-store" } });
    }
    return querySeedanceTask(body);
  } catch (error) {
    return Response.json({
      ok: false,
      error: String(error?.message || error),
      hint: error?.hint || "视频查询失败：确认 taskId、API Key 和 Endpoint。即梦/Seedance 官方 Endpoint 可留空。",
      raw: error?.raw || null,
    }, { status: error?.status || 500, headers: { "Cache-Control": "no-store" } });
  }
}

export async function POST(request) {
  try {
    const body = normalizeBodyApiFields(await request.json(), "Video API / 视频接口");
    const action = lowerText(body.action || "create");
    const provider = cleanText(body.provider || "Volcengine Seedance / 火山方舟 Seedance");
    const model = cleanText(body.model || "");
    const endpoint = cleanText(body.endpoint);

    const shouldUseOfficialSeedance =
      isOfficialSeedanceModel(model) ||
      isVolcengineArkEndpoint(endpoint) ||
      (!isKlingProvider(provider) && !isCustomProvider(provider) && (!endpoint || isJimengProvider(provider)));

    if (["query", "status", "poll", "get"].includes(action)) {
      if ((isKlingProvider(provider) || isCustomProvider(provider)) && !shouldUseOfficialSeedance) {
        const agentResult = await forwardToCustomAgent(body);
        if (agentResult) return Response.json({ ...agentResult, warnings: body._apiWarnings || [] }, { headers: { "Cache-Control": "no-store" } });
      }
      return querySeedanceTask(body);
    }

    if (!["create", "generate", "submit"].includes(action)) {
      return Response.json({ ok: false, error: `Unsupported action / 不支持的动作：${action}` }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }

    if (!shouldUseOfficialSeedance && (isKlingProvider(provider) || isCustomProvider(provider) || endpoint)) {
      const agentResult = await forwardToCustomAgent(body);
      if (agentResult) return Response.json({ ...agentResult, warnings: body._apiWarnings || [] }, { headers: { "Cache-Control": "no-store" } });
      if (isKlingProvider(provider)) {
        return Response.json({ ok: false, error: "Missing KLING_VIDEO_ENDPOINT / 缺少可灵视频接口地址", hint: "可灵不是火山方舟默认接口，必须填写可灵视频 Endpoint，或在 .env.local 配置 KLING_VIDEO_ENDPOINT。", warnings: body._apiWarnings || [] }, { status: 500, headers: { "Cache-Control": "no-store" } });
      }
    }

    return createSeedanceTask(body);
  } catch (error) {
    return Response.json({
      ok: false,
      error: String(error?.message || error),
      raw: error?.raw || null,
      hint: error?.hint || "Video generation proxy failed / 视频生成代理请求失败。请检查 API Key 是否填在密钥栏，Endpoint 是否是 https:// 开头。即梦/Seedance 官方 Endpoint 可以留空；前端代理路由固定为 /api/video-generate。Seedance 2.0 还需要在方舟开通模型，并满足余额/资源包要求。",
    }, { status: error?.status || 500, headers: { "Cache-Control": "no-store" } });
  }
}
