export const runtime = "edge";

export async function POST(request) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Missing DEEPSEEK_API_KEY in environment variables / 缺少环境变量 DEEPSEEK_API_KEY" }, { status: 500 });
    }
    const body = await request.json();
    const upstream = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") || "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return Response.json({ error: String(error?.message || error), hint: "DeepSeek proxy failed / DeepSeek 代理请求失败" }, { status: 500 });
  }
}
