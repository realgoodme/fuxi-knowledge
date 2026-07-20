export function displayTitle(value = ""): string {
  let title = String(value).replace(/^\d+\.\s*/, "").trim();
  const aiSeries = title.match(/^AI 学习之路 · 实战篇之「(.+)」$/);
  if (aiSeries) title = aiSeries[1];
  return title.replace(/^AI 学习之路 · 实战篇之/, "").trim();
}
