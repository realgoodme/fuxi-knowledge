from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIRS = (ROOT / "raw", ROOT / "notes", ROOT / "wiki")


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")


def parse_frontmatter(text: str) -> tuple[dict[str, object], str]:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return {}, text

    try:
        end = next(i for i in range(1, len(lines)) if lines[i].strip() == "---")
    except StopIteration:
        return {}, text

    data: dict[str, object] = {}
    for line in lines[1:end]:
        if not line or line.startswith((" ", "\t")) or ":" not in line:
            continue
        key, value = line.split(":", 1)
        value = value.strip()
        if value.startswith("[") and value.endswith("]"):
            inner = value[1:-1].strip()
            data[key.strip()] = [item.strip().strip("'\"") for item in inner.split(",") if item.strip()]
        else:
            data[key.strip()] = value.strip("'\"")
    return data, "\n".join(lines[end + 1 :]).lstrip()


def markdown_files() -> list[Path]:
    files: list[Path] = []
    for directory in CONTENT_DIRS:
        if directory.exists():
            files.extend(directory.rglob("*.md"))
    return sorted(files, key=lambda path: path.relative_to(ROOT).as_posix())


def display_title(path: Path, meta: dict[str, object], body: str) -> str:
    title = str(meta.get("title", "")).strip()
    if title:
        return title
    for line in body.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return path.stem


def one_line_summary(body: str, limit: int = 120) -> str:
    paragraph: list[str] = []
    in_code = False
    for raw_line in body.splitlines():
        line = raw_line.strip()
        if line.startswith("```"):
            in_code = not in_code
            continue
        if in_code or not line:
            if paragraph:
                break
            continue
        if line.startswith(("#", ">", "- ", "* ", "|", "<", "!")):
            continue
        if re.match(r"^\d+[.)]\s", line):
            continue
        paragraph.append(line)

    summary = " ".join(paragraph)
    summary = re.sub(r"!\[([^]]*)\]\([^)]+\)", r"\1", summary)
    summary = re.sub(r"\[([^]]+)\]\([^)]+\)", r"\1", summary)
    summary = re.sub(r"\[\[([^]|]+)\|([^]]+)\]\]", r"\2", summary)
    summary = re.sub(r"\[\[([^]]+)\]\]", r"\1", summary)
    summary = summary.replace("**", "").replace("`", "")
    if len(summary) > limit:
        summary = summary[: limit - 1].rstrip("，。；; ") + "…"
    return summary or "暂无摘要"


def relative(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()
