import { getCollection } from "astro:content";

const site = "https://realgoodme.github.io";
const base = "/fuxi-knowledge";

export async function GET() {
  const [articles, topics] = await Promise.all([getCollection("articles"), getCollection("topics")]);
  const urls = [
    `${site}${base}/`,
    `${site}${base}/articles/`,
    `${site}${base}/topics/`,
    `${site}${base}/about/`,
    ...articles.map((entry) => `${site}${base}/articles/${entry.id}/`),
    ...topics.map((entry) => `${site}${base}/topics/${entry.id}/`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc></url>`).join("")}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
