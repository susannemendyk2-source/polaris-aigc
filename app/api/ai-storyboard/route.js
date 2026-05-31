export async function POST(request) {
  try {
    const body = await request.json();
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Missing DEEPSEEK_API_KEY" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: body.model || "deepseek-v4-flash",
        messages: body.messages,
        temperature: body.temperature ?? 0.72,
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          error: data?.error?.message || "DeepSeek request failed",
          detail: data,
        },
        { status: response.status }
      );
    }

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}
