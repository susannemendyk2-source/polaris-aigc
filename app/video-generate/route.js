export const runtime = "edge";

function cleanText(value = "") {
  return String(value || "").trim();
}

function pickEnv(...names) {
  for (const name of names) {
    const v = cleanText(process.env[name]);
    if (v) return v;
  }
  return "";
}

function isAgentProvider(provider = "") {
  const p = String(provider || "").toLowerCase();
  return p.includes("agent") || p.includes("智能体") || p.includes("coze") || p.includes("custom");
}

function extractNestedVideoUrl(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
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

function withPromptParams(prompt, body = {}) {
  const params = [];
  if (body.resolution) params.push(`--resolution ${cleanText(body.resolution)}`);
  if (body.ratio) params.push(`--ratio ${cleanText(body.ratio)}`);
  if (body.duration) params.push(`--duration ${Number(body.duration || 5)}`);
  if (body.seed !== undefined && body.seed !== null && String(body.seed) !== "") params.push(`--seed ${Number(body.seed || 0)}`);
  params.push(`--camerafixed ${Boolean(body.cameraFixed).toString()}`);
  params.push(`--watermark ${Boolean(body.watermark).toString()}`);
  return [cleanText(prompt), params.join(" ")].filter(Boolean).join("\n");
}

function imageContent(url = "") {
  const image = cleanText(url);
  if (!image) return null;
  // Ark/Seedance examples use image_url. Data URLs are passed through so users can later replace with OSS/COS URLs if their model endpoint requires public URLs.
  return { type: "image_url", image_url: { url: image } };
}

async function callJson(url, init = {}) {
  const upstream = await fetch(url, init);
  const text = await upstream.text();
  let json = {};
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!upstream.ok) {
    const message = json?.error?.message || json?.message || json?.error || text || `Video API Error ${upstream.status}`;
    const err = new Error(message);
    err.status = upstream.status;
    err.raw = json;
    throw err;
  }
  return json;
}

async function forwardToCustomAgent(body) {
  const action = cleanText(body.action || "create").toLowerCase();
  const queryEndpoint = pickEnv("JIMENG_AGENT_QUERY_ENDPOINT", "VIDEO_AGENT_QUERY_ENDPOINT", "CUSTOM_VIDEO_AGENT_QUERY_ENDPOINT");
  const endpoint = (["query", "status", "poll", "get"].includes(action) && queryEndpoint) ? queryEndpoint : pickEnv("JIMENG_AGENT_ENDPOINT", "VIDEO_AGENT_ENDPOINT", "CUSTOM_VIDEO_AGENT_ENDPOINT");
  if (!endpoint) return null;
  const apiKey = pickEnv("JIMENG_AGENT_API_KEY", "VIDEO_AGENT_API_KEY", "CUSTOM_VIDEO_AGENT_API_KEY", "ARK_API_KEY");
  const authHeader = cleanText(process.env.JIMENG_AGENT_AUTH_HEADER || process.env.VIDEO_AGENT_AUTH_HEADER || "Authorization");
  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers[authHeader] = authHeader.toLowerCase() === "authorization" ? `Bearer ${apiKey}` : apiKey;
  const json = await callJson(endpoint, { method: "POST", headers, body: JSON.stringify(body) });
  return { ...normalizeVideoTask(json), provider: body.provider || "Custom Agent", endpoint, action };
}

async function createSeedanceTask(body = {}) {
  const apiKey = pickEnv("ARK_API_KEY", "VOLCENGINE_ARK_API_KEY", "SEEDANCE_API_KEY", "JIMENG_API_KEY", "VIDEO_API_KEY");
  const endpoint = cleanText(process.env.ARK_VIDEO_ENDPOINT || process.env.SEEDANCE_VIDEO_ENDPOINT || "https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks");
  if (!apiKey) {
    return Response.json({
      ok: false,
      error: "Missing ARK_API_KEY / 缺少火山方舟 ARK_API_KEY 环境变量",
      hint: "在 .env.local 或部署平台配置 ARK_API_KEY。若使用自定义即梦智能体，可配置 JIMENG_AGENT_ENDPOINT 与 JIMENG_AGENT_API_KEY。",
    }, { status: 500 });
  }

  const model = cleanText(body.model) || "doubao-seedance-1-0-lite-i2v-250428";
  const content = [{ type: "text", text: withPromptParams(body.prompt, body) }];
  const first = imageContent(body.firstFrameUrl || body.image || body.imageUrl || body.first_frame_url);
  const last = imageContent(body.lastFrameUrl || body.last_frame_url);
  const refs = Array.isArray(body.referenceImages) ? body.referenceImages.map(imageContent).filter(Boolean) : [];
  if (first) content.push(first);
  if (last) content.push({ ...last, role: "last_frame" });
  content.push(...refs.slice(0, 8));

  const payload = {
    model,
    content,
    resolution: cleanText(body.resolution || "720p"),
    ratio: cleanText(body.ratio || "adaptive"),
    duration: Number(body.duration || 5),
    seed: Number(body.seed || 0),
    camera_fixed: Boolean(body.cameraFixed),
    watermark: Boolean(body.watermark),
  };
  if (body.generateAudio !== undefined) payload.generate_audio = Boolean(body.generateAudio);
  if (body.draftTaskId) payload.draft_task_id = cleanText(body.draftTaskId);

  const json = await callJson(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  });
  return Response.json({ ...normalizeVideoTask(json), provider: body.provider || "Volcengine Seedance", model, endpoint, request: { ...payload, content: payload.content.map(c => c.type === "text" ? c : { ...c, image_url: "[image omitted]" }) } }, { headers: { "Cache-Control": "no-store" } });
}

async function querySeedanceTask(body = {}) {
  const apiKey = pickEnv("ARK_API_KEY", "VOLCENGINE_ARK_API_KEY", "SEEDANCE_API_KEY", "JIMENG_API_KEY", "VIDEO_API_KEY");
  const base = cleanText(process.env.ARK_VIDEO_ENDPOINT || process.env.SEEDANCE_VIDEO_ENDPOINT || "https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks").replace(/\/+$/, "");
  const taskId = cleanText(body.taskId || body.task_id || body.id);
  if (!apiKey) return Response.json({ ok: false, error: "Missing ARK_API_KEY / 缺少 ARK_API_KEY" }, { status: 500 });
  if (!taskId) return Response.json({ ok: false, error: "Missing taskId / 缺少视频任务ID" }, { status: 400 });
  const json = await callJson(`${base}/${encodeURIComponent(taskId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
  });
  return Response.json({ ...normalizeVideoTask(json), taskId, endpoint: `${base}/${taskId}` }, { headers: { "Cache-Control": "no-store" } });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = cleanText(searchParams.get("taskId") || searchParams.get("id"));
    if (!taskId) return Response.json({ ok: false, error: "Missing taskId / 缺少视频任务ID" }, { status: 400 });
    const provider = cleanText(searchParams.get("provider") || "Jimeng Agent / 即梦智能体");
    const customQueryEndpoint = pickEnv("JIMENG_AGENT_QUERY_ENDPOINT", "VIDEO_AGENT_QUERY_ENDPOINT", "CUSTOM_VIDEO_AGENT_QUERY_ENDPOINT");
    if (isAgentProvider(provider) && customQueryEndpoint) {
      const agentResult = await forwardToCustomAgent({ action: "query", provider, taskId, task_id: taskId, id: taskId });
      if (agentResult) return Response.json(agentResult, { headers: { "Cache-Control": "no-store" } });
    }
    return querySeedanceTask({ taskId });
  } catch (error) {
    return Response.json({ ok: false, error: String(error?.message || error), raw: error?.raw || null }, { status: error?.status || 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const action = cleanText(body.action || "create").toLowerCase();
    const provider = cleanText(body.provider || "Jimeng Agent / 即梦智能体");

    if (isAgentProvider(provider)) {
      const agentResult = await forwardToCustomAgent(body);
      if (agentResult) return Response.json(agentResult, { headers: { "Cache-Control": "no-store" } });
      // No custom agent configured: use the official Ark Seedance task API as the Jimeng-compatible backend.
    }

    if (["query", "status", "poll", "get"].includes(action)) return querySeedanceTask(body);
    if (["create", "generate", "submit"].includes(action)) return createSeedanceTask(body);
    return Response.json({ ok: false, error: `Unsupported action / 不支持的动作：${action}` }, { status: 400 });
  } catch (error) {
    return Response.json({ ok: false, error: String(error?.message || error), raw: error?.raw || null, hint: "Video generation proxy failed / 视频生成代理请求失败" }, { status: error?.status || 500 });
  }
}
