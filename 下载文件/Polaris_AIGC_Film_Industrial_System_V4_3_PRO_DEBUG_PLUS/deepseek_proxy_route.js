// Optional Next.js App Router proxy route for Polaris AIGC Film Industrial System V4.3
// Put this file at: app/api/deepseek/route.js
// Add your key to .env.local: DEEPSEEK_API_KEY=sk-xxxx

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Missing DEEPSEEK_API_KEY in .env.local" }, { status: 500 });
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
      headers: { "Content-Type": upstream.headers.get("Content-Type") || "application/json" },
    });
  } catch (error) {
    return Response.json({ error: error.message || "Proxy request failed" }, { status: 500 });
  }
}
