import { getCollection } from "astro:content";
import { getArticleTopicMap } from "../utils/relations";

const base = "/fuxi-knowledge";

export async function GET() {
  const articles = (await getCollection("articles")).sort((a, b) => (b.data.publicOrder ?? 0) - (a.data.publicOrder ?? 0));
  const topicMap = await getArticleTopicMap();
  const payload = articles.map((entry) => ({
    id: entry.id,
    title: entry.data.title,
    summary: entry.data.summary ?? "",
    series: entry.data.series ?? "原创文章",
    topic: topicMap.get(entry.id)?.title ?? "",
    date: (entry.data.date ?? entry.data.ingested)?.toISOString().slice(0, 10) ?? "",
    url: `${base}/articles/${entry.id}/`,
  }));
  return new Response(JSON.stringify(payload), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
