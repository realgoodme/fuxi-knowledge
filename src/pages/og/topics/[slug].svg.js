import { getCollection } from "astro:content";

const escapeXml = (value = "") => String(value).replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[char]));
const wrapTitle = (value = "") => {
  const lines = [];
  for (let i = 0; i < String(value).length && lines.length < 2; i += 17) lines.push(String(value).slice(i, i + 17));
  return lines.length ? lines : ["主题档案"];
};

export async function getStaticPaths() {
  return (await getCollection("topics")).map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

export function GET({ props }) {
  const { entry } = props;
  const lines = wrapTitle(entry.data.title);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#102F35"/><rect x="64" y="64" width="1072" height="502" fill="none" stroke="#F4EFE6" stroke-width="3"/><rect x="96" y="96" width="72" height="72" fill="#A63A2A"/><text x="132" y="145" text-anchor="middle" font-family="serif" font-size="44" font-weight="700" fill="#F4EFE6">朴</text><text x="96" y="238" font-family="Arial, sans-serif" font-size="24" letter-spacing="5" fill="#E8B7AA">TOPIC DOSSIER</text>${lines.map((line, index) => `<text x="96" y="${360 + index * 86}" font-family="serif" font-size="64" font-weight="900" fill="#F4EFE6">${escapeXml(line)}</text>`).join("")}<text x="96" y="526" font-family="Arial, sans-serif" font-size="22" letter-spacing="6" fill="#B9C7C7">不是堆叠文章，而是把它们织回主题</text></svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=31536000, immutable" } });
}
