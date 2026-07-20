import { getCollection } from "astro:content";
import { displayTitle } from "../../../utils/title";

const escapeXml = (value = "") => String(value).replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[char]));
const wrapTitle = (value = "") => {
  const clean = String(value).replace(/^\d+\.\s*/, "");
  const lines = [];
  for (let i = 0; i < clean.length && lines.length < 2; i += 17) lines.push(clean.slice(i, i + 17));
  return lines.length ? lines : ["朴散的思想仓库"];
};

export async function getStaticPaths() {
  return (await getCollection("articles")).map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

export function GET({ props }) {
  const { entry } = props;
  const lines = wrapTitle(displayTitle(entry.data.title));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#F4EFE6"/><rect x="64" y="64" width="1072" height="502" fill="none" stroke="#151512" stroke-width="3"/><rect x="96" y="96" width="72" height="72" fill="#A63A2A"/><text x="132" y="145" text-anchor="middle" font-family="serif" font-size="44" font-weight="700" fill="#F4EFE6">朴</text><text x="96" y="238" font-family="Arial, sans-serif" font-size="24" letter-spacing="5" fill="#7F281C">ARTICLE / ${escapeXml(entry.data.series ?? "原创文章")}</text>${lines.map((line, index) => `<text x="96" y="${360 + index * 86}" font-family="serif" font-size="64" font-weight="900" fill="#151512">${escapeXml(line)}</text>`).join("")}<text x="96" y="526" font-family="Arial, sans-serif" font-size="22" letter-spacing="6" fill="#6F6A60">PUSANZ · WRITING ARCHIVE</text></svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=31536000, immutable" } });
}
