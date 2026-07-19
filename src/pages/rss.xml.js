import { getCollection } from "astro:content";
import { entryDate } from "../utils/dates";

const site = "https://realgoodme.github.io";
const base = "/fuxi-knowledge";
const escapeXml = (value = "") => String(value).replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[char]));

export async function GET() {
  const articles = (await getCollection("articles")).sort((a, b) => (b.data.publicOrder ?? 0) - (a.data.publicOrder ?? 0));
  const items = articles.map((entry) => {
    const date = entryDate(entry);
    return `<item><title>${escapeXml(entry.data.title)}</title><link>${site}${base}/articles/${entry.id}/</link><guid>${site}${base}/articles/${entry.id}/</guid>${date ? `<pubDate>${date.toUTCString()}</pubDate>` : ""}<description>${escapeXml(entry.data.summary ?? "")}</description></item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>朴散的思想仓库</title><link>${site}${base}/</link><description>故事、观察，以及不急着下结论的思考。</description><language>zh-CN</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
