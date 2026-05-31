export const runtime = "edge";

function stripHtml(html = "") {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
function pickMeta(html = "", name) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${name}["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${name}["'][^>]*>`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return "";
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    if (!url || !/^https?:\/\//i.test(url)) {
      return Response.json({ ok: false, error: "Invalid URL / 链接格式不正确" }, { status: 400 });
    }
    const upstream = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Polaris-AIGC-Link-Ingest/1.0)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });
    const contentType = upstream.headers.get("content-type") || "";
    const html = await upstream.text();
    const title = pickMeta(html, "og:title") || (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").replace(/\s+/g, " ").trim();
    const description = pickMeta(html, "og:description") || pickMeta(html, "description");
    const text = stripHtml(html).slice(0, 12000);
    return Response.json({
      ok: upstream.ok,
      status: upstream.status,
      finalUrl: upstream.url,
      contentType,
      title,
      description,
      text,
      warning: text.length < 80 ? "Readable text is very short. The page may require login, app access, JavaScript rendering, or manual copy/paste. / 可读文本较少，可能需要登录、App访问、JS渲染或手动粘贴文案。" : "",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ ok: false, error: String(error?.message || error), text: "", warning: "Link ingest failed. Paste title, caption, transcript or screenshots manually. / 链接读取失败，请手动粘贴标题、文案、字幕或截图文字。" }, { status: 200 });
  }
}
