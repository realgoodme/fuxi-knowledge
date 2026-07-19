import { getCollection } from "astro:content";

export type TopicRelation = {
  id: string;
  title: string;
  articleIds: string[];
  count: number;
  status: "编织中" | "初步成形";
};

export async function getTopicRelations(): Promise<TopicRelation[]> {
  const topics = await getCollection("topics");
  return topics.map((topic) => {
    const body = String((topic as any).body ?? "");
    const articleIds = [...new Set([...body.matchAll(/\/?articles\/([a-z0-9-]+)\//g)].map((match) => match[1]))];
    const hasDossierShape = /##\s*(当前结论|证据|反例|可写选题)/.test(body);
    return {
      id: topic.id,
      title: topic.data.title,
      articleIds,
      count: articleIds.length,
      status: hasDossierShape && articleIds.length >= 3 ? "初步成形" : "编织中",
    };
  });
}

export async function getArticleTopicMap() {
  const relations = await getTopicRelations();
  const map = new Map<string, { id: string; title: string; status: TopicRelation["status"] }>();
  for (const relation of relations) {
    for (const articleId of relation.articleIds) {
      if (!map.has(articleId)) map.set(articleId, { id: relation.id, title: relation.title, status: relation.status });
    }
  }
  return map;
}
