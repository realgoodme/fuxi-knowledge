import { getCollection } from "astro:content";

export type TopicRelation = {
  id: string;
  title: string;
  articleIds: string[];
  count: number;
  status: "编织中" | "初步成形";
  roleByArticle: Record<string, string>;
};

function roleForSection(section: string) {
  if (/反例|矛盾|边界/.test(section)) return "提供反例";
  if (/证据|补充|恢复条目/.test(section)) return "给出案例";
  if (/当前结论|概念|表现形式/.test(section)) return "支持结论";
  if (/可写选题|写作应用|待修订/.test(section)) return "待修订线索";
  if (/关联/.test(section)) return "关联阅读";
  return "相关记录";
}

export async function getTopicRelations(): Promise<TopicRelation[]> {
  const topics = await getCollection("topics");
  return topics.map((topic) => {
    const body = String((topic as any).body ?? "");
    const roleByArticle: Record<string, string> = {};
    let section = "";
    for (const line of body.split(/\r?\n/)) {
      const heading = line.match(/^##\s+(.+)$/);
      if (heading) section = heading[1];
      for (const match of line.matchAll(/\/?articles\/([a-z0-9-]+)\//g)) {
        const articleId = match[1];
        if (!roleByArticle[articleId]) roleByArticle[articleId] = roleForSection(section);
      }
    }
    const articleIds = Object.keys(roleByArticle);
    const hasDossierShape = /##\s*(当前结论|证据|反例|可写选题|概念)/.test(body);
    return {
      id: topic.id,
      title: topic.data.title,
      articleIds,
      count: articleIds.length,
      status: hasDossierShape && articleIds.length >= 3 ? "初步成形" : "编织中",
      roleByArticle,
    };
  });
}

export async function getArticleTopicMap() {
  const relations = await getTopicRelations();
  const map = new Map<string, { id: string; title: string; status: TopicRelation["status"]; role: string }>();
  for (const relation of relations) {
    for (const articleId of relation.articleIds) {
      if (!map.has(articleId)) map.set(articleId, { id: relation.id, title: relation.title, status: relation.status, role: relation.roleByArticle[articleId] ?? "相关记录" });
    }
  }
  return map;
}
