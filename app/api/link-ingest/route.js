// Place this file at: app/api/link-ingest/route.js
// This is a lightweight best-effort page reader. Some platforms such as WeChat Channels,
// Douyin, Xiaohongshu, or pages requiring login may still block scraping.

function pickMeta(html, name) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return m[1].trim();
  }
  return "";
}
function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    if (!url) return Response.json({ error: "Missing url" }, { status: 400 });
    const target = new URL(url);
    if (!["http:", "https:"].includes(target.protocol)) {
      return Response.json({ error: "Only http/https URLs are supported" }, { status: 400 });
    }
    const res = await fetch(target.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PolarisAIGC/6.1; +https://vercel.app)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });
    const html = await res.text();
    const title = pickMeta(html, "og:title") || (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim();
    const description = pickMeta(html, "og:description") || pickMeta(html, "description");
    const image = pickMeta(html, "og:image");
    const text = stripHtml(html).slice(0, 12000);
    return Response.json({
      ok: res.ok,
      status: res.status,
      finalUrl: res.url,
      title,
      description,
      image,
      text,
      note: text ? "Best-effort page text extracted." : "No readable text extracted. The page may require login or block scraping.",
    });
  } catch (error) {
    return Response.json({ error: String(error?.message || error), note: "Link ingest failed. Paste manual reference content as fallback." }, { status: 500 });
  }
}
