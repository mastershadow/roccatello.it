#!/usr/bin/env python3
"""Genera le social card Open Graph (1200x630) del sito.

Ogni articolo ne ha una: sfondo blu del brand, logo vettoriale, titolo in
Noto Serif (lo stesso font del corpo del sito). Serve a far uscire i link
con la card grande su LinkedIn invece del segnaposto piccolo.

Uso:
  make-og.py --title "Titolo articolo" --cat "SICUREZZA" --out ../../site/static/img/og/<slug>.png
  make-og.py --home --out ../../site/static/img/og/default.png

Richiede chromium (headless) nel PATH.
"""
import argparse
import html
import pathlib
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
LOGO = ROOT / "design/logo/lockup-navbar.svg"
FONT = ROOT / "site/static/fonts/notoserif-1.woff2"  # variabile, copre 400-700

CSS = f"""
@font-face {{
  font-family: 'Noto Serif';
  src: url('file://{FONT}') format('woff2');
  font-weight: 400 700;
  font-display: block;
}}
* {{ margin: 0; box-sizing: border-box; }}
html, body {{ width: 1200px; height: 630px; }}
body {{
  background: #013564;
  color: #fff;
  font-family: system-ui, sans-serif;
  padding: 72px 80px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}}
/* filo d'accento del brand, appena percettibile */
.rule {{ height: 5px; width: 90px; background: #ffffff; opacity: .9; }}
.cat {{
  font-size: 24px; letter-spacing: .2em; text-transform: uppercase;
  color: rgba(255,255,255,.65); font-weight: 600;
}}
.title {{
  font-family: 'Noto Serif', serif; font-weight: 700;
  line-height: 1.12; letter-spacing: -.01em; color: #fff;
}}
.foot {{ display: flex; align-items: center; justify-content: space-between; }}
.foot img {{ height: 46px; display: block; }}
.dom {{ font-size: 24px; color: rgba(255,255,255,.6); }}
.spacer {{ flex: 1; }}
/* home */
.home {{ justify-content: center; align-items: flex-start; }}
.home img.logo {{ height: 92px; display: block; margin-bottom: 44px; }}
.home .lead {{ font-family: 'Noto Serif', serif; font-size: 52px; line-height: 1.15; max-width: 900px; }}
.home .sub {{ font-size: 28px; color: rgba(255,255,255,.7); margin-top: 28px; }}
"""


def article_html(title: str, cat: str) -> str:
    # font-size adattivo: i titoli lunghi rimpiccioliscono per non traboccare
    n = len(title)
    size = 66 if n <= 48 else 58 if n <= 72 else 50 if n <= 100 else 44
    return f"""<!doctype html><meta charset="utf-8"><style>{CSS}
.title {{ font-size: {size}px; }}</style>
<body>
  <div class="cat">{html.escape(cat)}</div>
  <div class="rule" style="margin:22px 0 0"></div>
  <div class="spacer"></div>
  <div class="title">{html.escape(title)}</div>
  <div class="spacer"></div>
  <div class="foot">
    <img src="file://{LOGO}">
    <span class="dom">roccatello.it</span>
  </div>
</body>"""


def home_html() -> str:
    return f"""<!doctype html><meta charset="utf-8"><style>{CSS}</style>
<body class="home">
  <img class="logo" src="file://{LOGO}">
  <div class="lead">Geoinformatica, ingegneria del software e cybersecurity.</div>
  <div class="sub">Eduard Roccatello - co-fondatore e CTO di 3DGIS</div>
</body>"""


def render(markup: str, out: pathlib.Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False) as f:
        f.write(markup)
        tmp = f.name
    subprocess.run(
        ["chromium", "--headless", "--disable-gpu", "--no-sandbox",
         "--hide-scrollbars", "--force-device-scale-factor=1",
         "--window-size=1200,630", f"--screenshot={out}", f"file://{tmp}"],
        check=True, capture_output=True,
    )
    print(f"scritto {out}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--title")
    ap.add_argument("--cat", default="")
    ap.add_argument("--home", action="store_true")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    out = pathlib.Path(a.out)
    if not out.is_absolute():
        out = (pathlib.Path.cwd() / out).resolve()
    if a.home:
        render(home_html(), out)
    else:
        if not a.title:
            ap.error("--title è obbligatorio senza --home")
        render(article_html(a.title, a.cat), out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
