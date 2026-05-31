export const runtime = "edge";

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

function normalizeSeedreamImages(json = {}) {
  const pools = [
    json?.data,
    json?.images,
    json?.result?.images,
    json?.result?.data,
    json?.result?.image_urls,
    json?.image_urls,
    json?.output?.images,
  ];
  const found = pools.find(Array.isArray) || [];
  if (found.length) return found.map((item, index) => normalizeImageItem(item, index, "seedream"));
  const singleUrl = json?.url || json?.image_url || json?.result?.url || json?.result?.image_url;
  const singleB64 = json?.b64_json || json?.image_base64 || json?.result?.b64_json || json?.result?.image_base64;
  if (singleUrl || singleB64) return [normalizeImageItem({ url: singleUrl, b64_json: singleB64 }, 0, "seedream")];
  return [];
}

function normalizeCustomImages(json = {}) {
  const pools = [json?.images, json?.data, json?.result?.images, json?.output?.images];
  const found = pools.find(Array.isArray) || [];
  return found.map((item, index) => normalizeImageItem(item, index, "custom"));
}

function mapSeedreamSize(size = "2K") {
  const s = cleanText(size);
  if (!s) return "2K";
  if (["1K", "2K", "4K"].includes(s.toUpperCase())) return s.toUpperCase();
  // Ark image API accepts WxH strings on Seedream 4.x/5.x compatible endpoints.
  return s.replace("*", "x");
}

function isSeedreamProvider(provider = "") {
  const p = String(provider || "").toLowerCase();
  return p.includes("seedream") || p.includes("volcengine") || p.includes("火山") || p.includes("即梦") || p.includes("doubao");
}

function isOpenAIProvider(provider = "") {
  return String(provider || "").toLowerCase().includes("openai");
}

async function callSeedreamOnce({ endpoint, apiKey, model, prompt, size, quality, responseFormat, watermark, referenceImages, stream }) {
  const payload = {
    model,
    prompt,
    size: mapSeedreamSize(size),
    response_format: responseFormat || "url",
    watermark: Boolean(watermark),
    stream: Boolean(stream),
    sequential_image_generation: "disabled",
  };

  // Seedream supports text-to-image, image-to-image and multi-image reference on compatible Ark endpoints.
  const refs = Array.isArray(referenceImages) ? referenceImages.filter(Boolean) : [];
  if (refs.length) payload.image = refs.length === 1 ? refs[0] : refs.slice(0, 10);
  if (quality && quality !== "high") payload.quality = quality;

  const upstream = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  });
  const text = await upstream.text();
  let json = {};
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!upstream.ok) {
    const message = json?.error?.message || json?.message || json?.error || text || `Seedream API Error ${upstream.status}`;
    const err = new Error(message);
    err.status = upstream.status;
    err.raw = json;
    throw err;
  }
  return json;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const provider = cleanText(body.provider || "Volcengine Seedream / 火山即梦 Seedream");
    const prompt = cleanText(body.prompt);
    if (!prompt) return Response.json({ ok: false, error: "Missing prompt / 缺少图片提示词" }, { status: 400 });

    const n = Math.max(1, Math.min(4, Number(body.n || body.candidates || 1)));
    const size = cleanText(body.size || "2K");
    const model = cleanModel(body.model);

    if (isSeedreamProvider(provider)) {
      const apiKey = process.env.ARK_API_KEY || process.env.VOLCENGINE_ARK_API_KEY || process.env.SEEDREAM_API_KEY || process.env.IMAGE_API_KEY;
      const endpoint = process.env.ARK_IMAGE_ENDPOINT || process.env.SEEDREAM_IMAGE_ENDPOINT || "https://ark.cn-beijing.volces.com/api/v3/images/generations";
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
        quality: body.quality,
        responseFormat: body.response_format || body.responseFormat || "url",
        watermark: body.watermark === true,
        referenceImages: body.referenceImages || body.images || body.image,
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
      return Response.json({
        ok: true,
        provider,
        model,
        endpoint,
        images,
        raw: results.length === 1 ? results[0] : results,
      }, { headers: { "Cache-Control": "no-store" } });
    }

    if (isOpenAIProvider(provider)) {
      const apiKey = process.env.OPENAI_API_KEY;
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
      const endpoint = process.env.IMAGE_API_ENDPOINT;
      const apiKey = process.env.IMAGE_API_KEY;
      if (!endpoint) return Response.json({ ok: false, error: "Missing IMAGE_API_ENDPOINT / 缺少 IMAGE_API_ENDPOINT 环境变量" }, { status: 500 });
      const upstream = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) },
        body: JSON.stringify({ ...body, prompt, model, n, size }),
      });
      const text = await upstream.text();
      let json = {};
      try { json = JSON.parse(text); } catch { json = { raw: text }; }
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
      hint: "Image generation proxy failed / 图片生成代理请求失败。请检查 ARK_API_KEY、模型名、接口地区和账号权限。",
      status: error?.status || 500,
      raw: error?.raw || null,
    }, { status: error?.status || 500 });
  }
}
