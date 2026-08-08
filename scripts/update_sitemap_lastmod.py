#!/usr/bin/env python3
"""Actualiza <lastmod> en sitemap.xml con la fecha real del último commit de cada página."""
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SITEMAP = REPO_ROOT / "sitemap.xml"
DOMAIN = "https://www.trabajoenexcel.com"


def file_for_loc(loc: str) -> Path:
    path = loc.replace(DOMAIN, "").lstrip("/")
    if path == "":
        path = "index.html"
    return REPO_ROOT / path


def last_commit_date(path: Path) -> str | None:
    if not path.exists():
        return None
    result = subprocess.run(
        ["git", "log", "-1", "--format=%cd", "--date=format:%Y-%m-%d", "--", str(path)],
        cwd=REPO_ROOT, capture_output=True, text=True,
    )
    date = result.stdout.strip()
    return date or None


def main():
    xml = SITEMAP.read_text(encoding="utf-8")
    changed = False

    def replace_block(match: re.Match) -> str:
        nonlocal changed
        block = match.group(0)
        loc_match = re.search(r"<loc>(.*?)</loc>", block)
        if not loc_match:
            return block
        loc = loc_match.group(1)
        path = file_for_loc(loc)
        date = last_commit_date(path)
        if not date:
            print(f"WARN: sin fecha de commit para {loc} ({path})", file=sys.stderr)
            return block
        new_block = re.sub(r"<lastmod>.*?</lastmod>", f"<lastmod>{date}</lastmod>", block)
        if new_block != block:
            changed = True
            print(f"{loc} -> {date}")
        return new_block

    new_xml = re.sub(r"<url>.*?</url>", replace_block, xml, flags=re.DOTALL)

    if changed:
        SITEMAP.write_text(new_xml, encoding="utf-8")
        print("sitemap.xml actualizado")
    else:
        print("sin cambios")


if __name__ == "__main__":
    main()
