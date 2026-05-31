export const runtime = "edge";
export const maxDuration = 60;

function cleanText(value = "") {
  return String(value || "").trim();
}

function cleanModel(model = "") {
  return cleanText(model) || "doubao-seedream-5-0-260128";
}

function normalizeImageItem(item = {}, index = 0, prefix = "image") {
  if (typeof item === "string") return { id: `${prefix}-${index}`, url: item, b64: "", mime: "image/png", revisedPrompt: "" };
  return {
    id: item.id || `${prefix}-${index}`,
    url: item.url || item.image_url || item.imageUrl || item.uri || "",
    b64: item.b64_json || item.b64 || item.base64 || item.image_base64 || "",
    mime: item.mime || item.mime_type || "image/png",
    revisedPrompt: item.revised_prompt || item.revisedPrompt || item.prompt || "",
  };
}

function normalizeOpenAIImages(json = {}) {
  const data = Array.isArray(json.data) ? json.data : [];
  return data.map((item, index) => normalizeImageItem(item, index, "openai"));
}

function extractNestedImageUrls(value, out = []) {
  if (!value) return out;
  if (typeof value === "string") {
    const v = cleanText(value);
    if (/^https?:\/\//i.test(v) || /^data:image\//i.test(v) || /^[A-Za-z0-9+/=\r\n]{200,}$/.test(v)) out.push(v);
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach(item => extractNestedImageUrls(item, out));
    return out;
  }
  if (typeof value === "object") {
    [value.url, value.image_url, value.imageUrl, value.uri, value.b64_json, value.b64, value.base64, value.image_base64].forEach(v => extractNestedImageUrls(v, out));
    [value.images, value.image_urls, value.data, value.result, value.output, value.outputs].forEach(v => extractNestedImageUrls(v, out));
  }
  return out;
}

function normalizeSeedreamImages(json = {}) {
  const urls = [];
  const pools = [
    json?.data,
    json?.images,
    json?.result?.images,
    json?.result?.data,
    json?.result?.image_urls,
    json?.image_urls,
    json?.output?.images,
  ];
  pools.forEach(pool => extractNestedImageUrls(pool, urls));
  return Array.from(new Set(urls)).map((url, index) => normalizeImageItem(url, index, "seedream"));
}

function normalizeCustomImages(json = {}) {
  const pools = [json?.images, json?.data, json?.result?.images, json?.output?.images];
  const found = pools.find(Array.isArray) || [];
  return found.map((item, index) => normalizeImageItem(item, index, "custom"));
}

function normalizeSizeTier(size = "2K") {
  const s = cleanText(size).toUpperCase();
  if (!s) return "2K";
  if (s.includes("4K")) return "4K";
  if (s.includes("1K")) return "1K";
  return "2K";
}

function mapSeedreamSize(size = "2K") {
  // Ark Seedream 4.x/5.x 官方图片接口更稳定的写法是 1K / 2K / 4K。
  // 比例不要拼成 2048x1152 这类尺寸，否则部分模型/账号会直接报错。
  return normalizeSizeTier(size);
}

function cleanAspectRatio(ratio = "") {
  const raw = cleanText(ratio).replace(/\s*\/\s*.*/g, "");
  if (!raw || /^auto/i.test(raw) || raw.includes("自动")) return "";
  const match = raw.match(/(2\.39:1|21:9|16:9|9:16|4:3|3:4|3:2|2:3|1:1)/);
  return match ? match[1] : "";
}

function mapImageSizeWithRatio(size = "2K", ratio = "") {
  // Keep Seedream size safe; aspect ratio is enforced through prompt text and returned to frontend.
  return mapSeedreamSize(size);
}

function isSeedreamProvider(provider = "") {
  const p = String(provider || "").toLowerCase();
  return p.includes("seedream") || p.includes("volcengine") || p.includes("火山") || p.includes("即梦") || p.includes("doubao");
}

function isOpenAIProvider(provider = "") {
  return String(provider || "").toLowerCase().includes("openai");
}

function isKlingProvider(provider = "") {
  const p = String(provider || "").toLowerCase();
  return p.includes("kling") || p.includes("可灵");
}

function isJimengImageAgent(provider = "") {
  const p = String(provider || "").toLowerCase();
  return p.includes("jimeng") || p.includes("即梦") || p.includes("image agent") || p.includes("智能体");
}

function pickEnv(...names) {
  for (const name of names) {
    const v = cleanText(process.env[name]);
    if (v) return v;
  }
  return "";
}

const DEFAULT_SEEDREAM_IMAGE_ENDPOINT = "https://ark.cn-beijing.volces.com/api/v3/images/generations";

const SEEDREAM_MODEL_FALLBACK = "doubao-seedream-5-0-260128";
const VALID_SEEDREAM_MODELS = new Set([
  "doubao-seedream-5-0-260128",
  "doubao-seedream-5-0-lite",
  "doubao-seedream-4-5-251128",
  "doubao-seedream-4-0-250828",
]);

function normalizeSeedreamModel(model = "") {
  const m = cleanModel(model);
  if (VALID_SEEDREAM_MODELS.has(m)) return m;
  if (/^ep-[A-Za-z0-9_-]+$/i.test(m)) return m;
  // jimeng-image-agent 是前端占位名称，不是火山方舟真实 model id。
  if (!m || /jimeng-image-agent|image-agent|智能体/i.test(m)) return SEEDREAM_MODEL_FALLBACK;
  return m;
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

function looksLikeApiKey(value = "") {
  const v = cleanText(value).replace(/^Bearer\s+/i, "");
  if (!v || isLocalApiRoute(v)) return false;
  if (isAbsoluteHttpUrl(v)) return false;
  if (/^(ark-|sk-|ak-|pk_|rk_|key-|kling-|jimeng-)/i.test(v)) return true;
  return v.length >= 24 && !v.includes("/") && !v.includes(".") && /^[A-Za-z0-9_\-]+$/.test(v);
}

function makeFriendlyApiError(serviceName, message, hint = "") {
  const err = new Error(`${serviceName}: ${message}`);
  err.status = 400;
  err.hint = hint;
  return err;
}

function normalizeBodyApiFields(body = {}, serviceName = "Image API") {
  const warnings = Array.isArray(body._apiWarnings) ? body._apiWarnings : [];
  const endpoint = cleanText(body.endpoint);
  const apiKey = cleanText(body.apiKey);
  if (isLocalApiRoute(endpoint)) {
    body.endpoint = "";
    warnings.push(`${serviceName}: Endpoint 是本地代理路由，已忽略；浏览器访问 /api/image-generate，服务端再转发官方接口。`);
  }
  if (looksLikeApiKey(endpoint)) {
    if (!apiKey) body.apiKey = endpoint.replace(/^Bearer\s+/i, "");
    body.endpoint = "";
    warnings.push(`${serviceName}: Endpoint looks like an API Key. 已自动把它当作密钥处理，并清空 Endpoint。`);
  }
  if (isAbsoluteHttpUrl(apiKey) && !cleanText(body.endpoint)) {
    body.endpoint = apiKey;
    body.apiKey = "";
    warnings.push(`${serviceName}: API Key field looks like a URL. 已自动把它移动到 Endpoint。`);
  }
  body._apiWarnings = warnings;
  return body;
}

function ensureEndpointUrl(endpoint = "", serviceName = "Image API") {
  const url = cleanText(endpoint);
  if (!url) return "";
  if (isLocalApiRoute(url)) return "";
  if (looksLikeApiKey(url)) {
    throw makeFriendlyApiError(serviceName, "Endpoint 填成了 API Key。", "Endpoint 必须是 https:// 开头的完整接口地址；API Key 请填写在密钥栏。即梦默认 Endpoint 可留空。");
  }
  if (!isAbsoluteHttpUrl(url)) {
    throw makeFriendlyApiError(serviceName, `Endpoint 不是有效 URL：${url.slice(0, 32)}`, "请填写完整接口地址，例如 https://ark.cn-beijing.volces.com/api/v3/images/generations，或留空使用默认接口。");
  }
  return url;
}

function isProbablyHtml(text = "") {
  return /^\s*<!doctype html/i.test(String(text || "")) || /<html[\s>]/i.test(String(text || "").slice(0, 600));
}

function normalizeReferenceImage(input) {
  if (!input) return "";
  let value = "";
  let mime = "image/png";
  if (typeof input === "string") {
    value = input;
  } else if (typeof input === "object") {
    mime = cleanText(input.mime || input.mime_type || input.type) || mime;
    value = input.url || input.image_url || input.imageUrl || input.uri || input.src || input.b64_json || input.b64 || input.base64 || input.image_base64 || "";
    if (typeof value === "object") value = value.url || "";
  }
  value = cleanText(value);
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (/^data:image\/[a-z0-9.+-]+;base64,/i.test(value)) return value;
  if (/^[A-Za-z0-9+/=\r\n]+$/.test(value) && value.length > 80) {
    const safeMime = /^image\/[a-z0-9.+-]+$/i.test(mime) ? mime.toLowerCase() : "image/png";
    return `data:${safeMime};base64,${value.replace(/\s+/g, "")}`;
  }
  return "";
}

function estimateInlineBytes(value = "") {
  const v = cleanText(value);
  if (!/^data:image\//i.test(v)) return 0;
  return v.length;
}

function normalizeReferenceImages(value) {
  const raw = Array.isArray(value) ? value : (value ? [value] : []);
  const out = [];
  let inlineTotal = 0;
  const MAX_SINGLE_INLINE = 1800000;
  const MAX_TOTAL_INLINE = 3800000;
  for (const item of raw.flat ? raw.flat(2) : raw) {
    const url = normalizeReferenceImage(item);
    if (!url || out.includes(url)) continue;
    const inlineBytes = estimateInlineBytes(url);
    if (inlineBytes && inlineBytes > MAX_SINGLE_INLINE) continue;
    if (inlineBytes && inlineTotal + inlineBytes > MAX_TOTAL_INLINE) continue;
    inlineTotal += inlineBytes;
    out.push(url);
  }
  return out.slice(0, 6);
}

function pickBodyOrEnv(body = {}, bodyKey = "", ...envNames) {
  const direct = cleanText(body?.[bodyKey]);
  if (direct) return direct;
  return pickEnv(...envNames);
}

async function forwardToImageAgent({ body, provider, model, prompt, n, size }) {
  const kling = isKlingProvider(provider);
  normalizeBodyApiFields(body, kling ? "Kling Image / 可灵生图" : "Jimeng Image / 即梦生图");
  const envEndpoint = kling
    ? pickEnv("KLING_IMAGE_ENDPOINT", "KLING_AGENT_IMAGE_ENDPOINT", "IMAGE_AGENT_ENDPOINT", "IMAGE_API_ENDPOINT")
    : pickEnv("JIMENG_IMAGE_ENDPOINT", "JIMENG_AGENT_IMAGE_ENDPOINT", "SEEDREAM_AGENT_ENDPOINT", "IMAGE_AGENT_ENDPOINT", "IMAGE_API_ENDPOINT");
  const endpoint = ensureEndpointUrl(cleanText(body.endpoint) || envEndpoint, kling ? "Kling Image / 可灵生图" : "Jimeng Image / 即梦生图");
  if (!endpoint) return null;
  const apiKey = cleanText(body.apiKey) || (kling
    ? pickEnv("KLING_API_KEY", "KLING_IMAGE_API_KEY", "IMAGE_AGENT_API_KEY", "IMAGE_API_KEY")
    : pickEnv("JIMENG_API_KEY", "JIMENG_IMAGE_API_KEY", "JIMENG_AGENT_API_KEY", "IMAGE_AGENT_API_KEY", "ARK_API_KEY", "IMAGE_API_KEY"));
  const authHeader = cleanText(body.authHeader || process.env.IMAGE_AGENT_AUTH_HEADER || "Authorization");
  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers[authHeader] = authHeader.toLowerCase() === "authorization" ? `Bearer ${apiKey}` : apiKey;
  const refs = normalizeReferenceImages(body.referenceImages || body.images || body.image || body.input_image || body.inputImage || body.referenceImage);
  const upstream = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify({ ...body, provider, model, prompt, n, size, referenceImages: refs, images: refs, image: refs.length === 1 ? refs[0] : refs }) });
  const text = await upstream.text();
  let json = {};
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (isProbablyHtml(text)) {
    const err = new Error("图片智能体返回了 HTML 页面，不是 JSON。请检查 Endpoint 是否填成了网页地址、Next 页面地址或控制台地址。");
    err.status = upstream.status || 500;
    err.raw = { contentType: upstream.headers.get("content-type") || "", preview: text.slice(0, 600) };
    throw err;
  }
  if (!upstream.ok) {
    const err = new Error(json?.error?.message || json?.message || json?.error || text || `Image Agent Error ${upstream.status}`);
    err.status = upstream.status;
    err.raw = json;
    throw err;
  }
  return { ok: true, provider, model, endpoint, images: normalizeCustomImages(json).length ? normalizeCustomImages(json) : normalizeSeedreamImages(json), raw: json };
}

async function callSeedreamOnce({ endpoint, apiKey, model, prompt, size, ratio, quality, responseFormat, watermark, referenceImages, stream }) {
  const aspectRatio = cleanAspectRatio(ratio);
  const finalPrompt = aspectRatio ? `${prompt}\nAspect ratio / 图片比例：${aspectRatio}. Please compose the image in this aspect ratio.` : prompt;
  const payload = {
    model,
    prompt: finalPrompt,
    size: mapImageSizeWithRatio(size, ratio),
    response_format: responseFormat || "url",
    watermark: Boolean(watermark),
    stream: Boolean(stream),
    sequential_image_generation: "disabled",
  };

  // Seedream 图生图/多参考图使用 image 字段；URL 或 data:image/...;base64,... 都可以走这个字段。
  const refs = normalizeReferenceImages(referenceImages);
  if (refs.length) {
    payload.image = refs.length === 1 ? refs[0] : refs;
    payload.reference_image_count = refs.length;
    if (refs.length > 1) payload.sequential_image_generation = "auto";
  }
  if (quality && quality !== "high") payload.quality = quality;

  const upstream = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  });
  const text = await upstream.text();
  let json = {};
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (isProbablyHtml(text)) {
    const err = new Error("Seedream 图片接口返回了 HTML 页面，不是 JSON。通常是 Endpoint 填成网页地址、Next 页面地址，或 app/api/image-generate/route.js 没有正确放置。请把 Endpoint 留空使用默认方舟接口，或填写真正的图片 API Endpoint。");
    err.status = upstream.status || 500;
    err.raw = { contentType: upstream.headers.get("content-type") || "", preview: text.slice(0, 600) };
    throw err;
  }
  if (!upstream.ok) {
    let message = json?.error?.message || json?.message || json?.error || text || `Seedream API Error ${upstream.status}`;
    if (/image|base64|url|图片|参考图/i.test(String(message))) {
      message += " · 图生图参考图必须是公网 URL，或完整 Data URI：data:image/png;base64,...；本版本已自动补齐/过滤无效参考图。";
    }
    if (/size|尺寸|resolution|ratio|比例/i.test(String(message))) {
      message += " · 已启用安全尺寸模式：Seedream 官方接口会使用 1K/2K/4K，比例会写入 Prompt，不再直接提交 16:9 像素尺寸。";
    }
    const err = new Error(message);
    err.status = upstream.status;
    err.raw = json;
    throw err;
  }
  return json;
}

export async function POST(request) {
  try {
    const body = normalizeBodyApiFields(await request.json(), "Image API / 图片接口");
    const provider = cleanText(body.provider || "Volcengine Seedream / 火山即梦 Seedream");
    const prompt = cleanText(body.prompt);
    if (!prompt) return Response.json({ ok: false, error: "Missing prompt / 缺少图片提示词" }, { status: 400 });

    const n = Math.max(1, Math.min(4, Number(body.n || body.candidates || 1)));
    const size = cleanText(body.size || "2K");
    const requestedModel = cleanModel(body.model);
    let model = requestedModel;

    if (isKlingProvider(provider) || (isJimengImageAgent(provider) && !provider.toLowerCase().includes("seedream") && !provider.includes("Seedream"))) {
      const agentResult = await forwardToImageAgent({ body, provider, model, prompt, n, size });
      if (agentResult) return Response.json(agentResult, { headers: { "Cache-Control": "no-store" } });
      // If no dedicated agent endpoint is configured, only official Seedream provider may fall through to Ark.
      if (isKlingProvider(provider)) {
        return Response.json({ ok: false, error: "Missing KLING_IMAGE_ENDPOINT / 缺少可灵生图智能体接口", hint: "请在 .env.local 配置 KLING_IMAGE_ENDPOINT 和 KLING_API_KEY，或切换到火山即梦 Seedream。" }, { status: 500 });
      }
      if (String(provider || "").toLowerCase().includes("custom")) {
        return Response.json({ ok: false, error: "Missing JIMENG_IMAGE_ENDPOINT / 缺少自定义即梦生图接口", hint: "自定义即梦智能体需要填写 JIMENG_IMAGE_ENDPOINT 或在画布 API 窗口填写 Endpoint；如果你使用火山方舟 API Key，请选择 Volcengine Seedream，并使用 doubao-seedream-* 模型。" }, { status: 500 });
      }
    }

    if (isSeedreamProvider(provider) || isJimengImageAgent(provider)) {
      model = normalizeSeedreamModel(model);
      const modelWarning = model !== requestedModel ? `模型已自动修正：${requestedModel || "empty"} → ${model}。jimeng-image-agent 不是火山方舟真实模型ID，请使用 doubao-seedream-* 或 ep-*。` : "";
      if (modelWarning) body._apiWarnings = [...(body._apiWarnings || []), modelWarning];
      const apiKey = cleanText(body.apiKey) || process.env.ARK_API_KEY || process.env.VOLCENGINE_ARK_API_KEY || process.env.SEEDREAM_API_KEY || process.env.IMAGE_API_KEY;
      const endpoint = ensureEndpointUrl(cleanText(body.endpoint) || process.env.ARK_IMAGE_ENDPOINT || process.env.SEEDREAM_IMAGE_ENDPOINT || DEFAULT_SEEDREAM_IMAGE_ENDPOINT, "Seedream Image / 即梦生图");
      if (!apiKey) {
        return Response.json({
          ok: false,
          error: "Missing ARK_API_KEY / 缺少火山方舟 ARK_API_KEY 环境变量",
          hint: "在 .env.local 或部署平台环境变量中配置 ARK_API_KEY=你的火山方舟 API Key，也可用 VOLCENGINE_ARK_API_KEY 或 SEEDREAM_API_KEY。",
        }, { status: 500 });
      }

      // Some Seedream endpoints return multiple images with n-like params, but the Ark examples are more consistent when one call maps to one generation.
      // To keep the UI candidate count reliable, call the endpoint n times and normalize all images.
      const jobs = Array.from({ length: n }, () => callSeedreamOnce({
        endpoint,
        apiKey,
        model,
        prompt,
        size,
        ratio: body.ratio || body.imageRatio || body.aspectRatio,
        quality: body.quality,
        responseFormat: body.response_format || body.responseFormat || "url",
        watermark: body.watermark === true,
        referenceImages: normalizeReferenceImages(body.referenceImages || body.images || body.image || body.input_image || body.inputImage),
        stream: false,
      }));
      const results = await Promise.all(jobs);
      const images = results.flatMap((json, batchIndex) => normalizeSeedreamImages(json).map((img, i) => ({
        ...img,
        id: img.id || `seedream-${batchIndex}-${i}`,
        provider,
        model,
        size,
      })));
      const refsForReport = normalizeReferenceImages(body.referenceImages || body.images || body.image || body.input_image || body.inputImage || body.referenceImage);
      if (!images.length) {
        return Response.json({
          ok: false,
          error: "Seedream returned no images / Seedream 没有返回图片结果",
          hint: "请检查模型权限、Prompt、安全审核、参考图格式。图生图参考图必须是公网 URL 或 data:image/...;base64,...；过大的 base64 会被自动过滤。",
          provider,
          model,
          referenceImageCount: refsForReport.length,
          raw: results.length === 1 ? results[0] : results,
          warnings: body._apiWarnings || [],
        }, { status: 502, headers: { "Cache-Control": "no-store" } });
      }
      return Response.json({
        ok: true,
        provider,
        model,
        endpoint,
        warnings: body._apiWarnings || [],
        images,
        referenceImageCount: refsForReport.length,
        raw: results.length === 1 ? results[0] : results,
      }, { headers: { "Cache-Control": "no-store" } });
    }

    if (isOpenAIProvider(provider)) {
      const apiKey = cleanText(body.apiKey) || process.env.OPENAI_API_KEY;
      if (!apiKey) return Response.json({ ok: false, error: "Missing OPENAI_API_KEY / 缺少 OPENAI_API_KEY 环境变量" }, { status: 500 });
      const upstream = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, prompt, n, size: size === "2K" ? "1024x1024" : size, response_format: "b64_json" }),
      });
      const text = await upstream.text();
      let json = {};
      try { json = JSON.parse(text); } catch { json = { raw: text }; }
      if (!upstream.ok) return Response.json({ ok: false, error: json.error?.message || text }, { status: upstream.status });
      return Response.json({ ok: true, provider, model, images: normalizeOpenAIImages(json), raw: json }, { headers: { "Cache-Control": "no-store" } });
    }

    if (provider.includes("Custom")) {
      const endpoint = cleanText(body.endpoint) || process.env.IMAGE_API_ENDPOINT;
      const apiKey = cleanText(body.apiKey) || process.env.IMAGE_API_KEY;
      if (!endpoint) return Response.json({ ok: false, error: "Missing IMAGE_API_ENDPOINT / 缺少 IMAGE_API_ENDPOINT 环境变量" }, { status: 500 });
      const upstream = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) },
        body: JSON.stringify({ ...body, prompt, model, n, size }),
      });
      const text = await upstream.text();
      let json = {};
      try { json = JSON.parse(text); } catch { json = { raw: text }; }
      if (isProbablyHtml(text)) return Response.json({ ok: false, error: "Custom Image API returned HTML / 自定义图片接口返回 HTML，不是 JSON", hint: "Endpoint 不能是网页、控制台或 Next 页面地址，必须是真正的图片 API 地址。", raw: { preview: text.slice(0, 600) } }, { status: upstream.status || 500 });
      if (!upstream.ok) return Response.json({ ok: false, error: json.error || json.message || text }, { status: upstream.status });
      return Response.json({ ok: true, provider, model, images: normalizeCustomImages(json), raw: json }, { headers: { "Cache-Control": "no-store" } });
    }

    return Response.json({
      ok: false,
      error: "Provider route not configured yet / 当前图片模型供应商尚未在后端 route 中配置",
      hint: "当前 route 已支持 Volcengine Seedream、OpenAI Images 和 Custom Image API。腾讯混元或 Replicate Flux 可继续在此 route 中扩展。",
    }, { status: 501 });
  } catch (error) {
    return Response.json({
      ok: false,
      error: String(error?.message || error),
      hint: "Image generation proxy failed / 图片生成代理请求失败。请检查 ARK_API_KEY、模型名、接口地区和账号权限。图生图参考图必须是公网 URL 或完整 data:image/png;base64,...；火山方舟生图模型必须是 doubao-seedream-* 或 ep-*，不要使用 jimeng-image-agent 占位名。",
      status: error?.status || 500,
      raw: error?.raw || null,
    }, { status: error?.status || 500 });
  }
}
