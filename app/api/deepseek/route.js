export const runtime = "edge";

const DEFAULT_BASE_URL = "https://api.deepseek.com/v1/chat/completions";

function clean(value = "") {
  return String(value || "").trim();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRetryable(status, text = "") {
  const lower = String(text || "").toLowerCase();
  return [429, 500, 502, 503, 504].includes(Number(status)) || lower.includes("busy") || lower.includes("service_unavailable") || lower.includes("temporarily") || lower.includes("overloaded") || lower.includes("rate limit");
}

function friendlyError(status, text = "") {
  const lower = String(text || "").toLowerCase();
  if (status === 401 || lower.includes("unauthorized") || lower.includes("invalid api key")) {
    return {
      ok: false,
      title: "API Key 错误 / Invalid API Key",
      error: "DeepSeek 密钥无效、过期或没有权限。请检查 DEEPSEEK_API_KEY 或前端 direct 模式密钥。",
      fix: "重新粘贴 DeepSeek API Key，或在 .env.local / 部署平台配置 DEEPSEEK_API_KEY。",
      status,
      raw: String(text || "").slice(0, 900),
    };
  }
  if (status === 429 || lower.includes("rate limit")) {
    return {
      ok: false,
      title: "请求太频繁 / Rate Limited",
      error: "DeepSeek 正在限流。系统已自动重试，但仍未成功。",
      fix: "等待 30-60 秒后重试，或减少一次生成的镜头数量。",
      status,
      raw: String(text || "").slice(0, 900),
    };
  }
  if ([500, 502, 503, 504].includes(Number(status)) || lower.includes("service is too busy") || lower.includes("service_unavailable") || lower.includes("temporarily")) {
    return {
      ok: false,
      title: "DeepSeek 繁忙 / Service Busy",
      error: "DeepSeek 上游服务当前繁忙，这不是你的密钥错误。系统已自动重试，但服务端仍返回繁忙。",
      fix: "稍后重试；或配置 DEEPSEEK_BACKUP_ENDPOINT / DEEPSEEK_BACKUP_API_KEY 作为备用上游。",
      status,
      raw: String(text || "").slice(0, 900),
    };
  }
  return {
    ok: false,
    title: "DeepSeek 请求失败 / Request Failed",
    error: "DeepSeek 代理请求失败。",
    fix: "请查看 raw 错误信息，检查网络、模型名、Key 或 Endpoint。",
    status,
    raw: String(text || "").slice(0, 900),
  };
}

async function callDeepSeek({ endpoint, apiKey, body, maxRetries = 2 }) {
  let lastStatus = 0;
  let lastText = "";
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    if (upstream.ok) {
      return new Response(text, {
        status: upstream.status,
        headers: {
          "Content-Type": upstream.headers.get("Content-Type") || "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Polaris-Retry-Count": String(attempt),
        },
      });
    }
    lastStatus = upstream.status;
    lastText = text;
    if (!isRetryable(upstream.status, text) || attempt >= maxRetries) break;
    await sleep(700 * (attempt + 1));
  }
  const payload = friendlyError(lastStatus || 500, lastText);
  return Response.json(payload, {
    status: lastStatus || 500,
    headers: {
      "Cache-Control": "no-store",
      "X-Polaris-Friendly-Error": "true",
    },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const primaryKey = clean(process.env.DEEPSEEK_API_KEY || body.apiKey);
    const primaryEndpoint = clean(process.env.DEEPSEEK_ENDPOINT || process.env.DEEPSEEK_BASE_URL || process.env.DEEPSEEK_API_ENDPOINT || DEFAULT_BASE_URL);
    const backupKey = clean(process.env.DEEPSEEK_BACKUP_API_KEY);
    const backupEndpoint = clean(process.env.DEEPSEEK_BACKUP_ENDPOINT || process.env.DEEPSEEK_BACKUP_BASE_URL);

    if (!primaryKey) {
      return Response.json({
        ok: false,
        title: "缺少 DeepSeek Key / Missing API Key",
        error: "Missing DEEPSEEK_API_KEY in environment variables / 缺少环境变量 DEEPSEEK_API_KEY",
        fix: "在 .env.local 或部署平台配置 DEEPSEEK_API_KEY；或使用前端 direct 模式输入 Key。",
      }, { status: 500 });
    }

    const first = await callDeepSeek({ endpoint: primaryEndpoint, apiKey: primaryKey, body, maxRetries: 2 });
    if (first.ok || !(backupKey && backupEndpoint)) return first;

    // Optional backup upstream. Only used when configured on server.
    const firstText = await first.clone().text().catch(() => "");
    if (!isRetryable(first.status, firstText)) return first;
    const second = await callDeepSeek({ endpoint: backupEndpoint, apiKey: backupKey, body, maxRetries: 1 });
    second.headers.set("X-Polaris-Backup-Upstream", "true");
    return second;
  } catch (error) {
    return Response.json({
      ok: false,
      title: "DeepSeek 代理异常 / Proxy Failed",
      error: String(error?.message || error),
      fix: "检查 app/api/deepseek/route.js、网络、环境变量和模型参数。",
    }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
