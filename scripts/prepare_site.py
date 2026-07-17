from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

from kb_common import ROOT, parse_frontmatter, read_text


CONFIG = ROOT / "mkdocs.yml"
STAGE = ROOT / ".site-docs"


def nav_pages(config_text: str) -> list[str]:
    in_nav = False
    pages: list[str] = []
    for line in config_text.splitlines():
        if line == "nav:":
            in_nav = True
            continue
        if not in_nav:
            continue
        match = re.match(r"^\s+-\s+.+:\s+([^#]+\.md)\s*$", line)
        if match:
            pages.append(match.group(1).strip().strip("'\""))
    return list(dict.fromkeys(pages))


def safe_source(relative_path: str) -> Path:
    source = (ROOT / relative_path).resolve()
    if source != ROOT and ROOT not in source.parents:
        raise ValueError(f"路径越界：{relative_path}")
    return source


def public_wikilink_target(target: str) -> str:
    path = target.split("|", 1)[0].strip()
    if not path.endswith(".md"):
        path += ".md"
    return Path(path).as_posix()


def public_markdown_target(source_relative: str, target: str) -> str | None:
    if "://" in target or target.startswith(("#", "/")):
        return None
    path_part = target.split("#", 1)[0]
    if not path_part.endswith(".md"):
        return None
    return (Path(source_relative).parent / path_part).as_posix()


def main() -> int:
    pages = nav_pages(read_text(CONFIG))
    if not pages:
        print("未从 mkdocs.yml 解析到公开页面", file=sys.stderr)
        return 1

    errors: list[str] = []
    sources: list[tuple[str, Path]] = []
    for rel in pages:
        source = safe_source(rel)
        if not source.is_file():
            errors.append(f"导航目标不存在：{rel}")
            continue
        meta, _ = parse_frontmatter(read_text(source))
        if meta.get("visibility") == "private":
            errors.append(f"私密页面出现在公开导航：{rel}")
            continue
        sources.append((rel, source))

    if errors:
        for error in errors:
            print("ERROR " + error, file=sys.stderr)
        return 1

    public_paths = {rel for rel, _ in sources}
    for rel, source in sources:
        _, body = parse_frontmatter(read_text(source))
        for target in re.findall(r"\[\[([^]]+)\]\]", body):
            resolved = public_wikilink_target(target)
            if resolved not in public_paths:
                errors.append(f"公开页面 {rel} 链接到非公开页面：{resolved}")
        for target in re.findall(r"\[[^]]+\]\(([^)]+)\)", body):
            resolved = public_markdown_target(rel, target)
            if resolved and resolved not in public_paths:
                errors.append(f"公开页面 {rel} 链接到非公开页面：{resolved}")

    if errors:
        for error in errors:
            print("ERROR " + error, file=sys.stderr)
        return 1

    if STAGE.parent != ROOT or STAGE.name != ".site-docs":
        raise RuntimeError("拒绝清理非预期暂存目录")
    if STAGE.exists():
        shutil.rmtree(STAGE)
    STAGE.mkdir()

    for rel, source in sources:
        target = STAGE / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)

    assets = ROOT / "assets"
    if assets.exists():
        shutil.copytree(assets, STAGE / "assets")

    print(f"已准备公开站点：{len(sources)} 个 Markdown 页面，来源为 mkdocs.yml 导航白名单")
    return 0


if __name__ == "__main__":
    sys.exit(main())
