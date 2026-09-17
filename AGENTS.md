# AGENTS.md — Pocket AI Labs Website

Guidance for AI agents (Devin, Hermes, etc.) working on this repository.

## Project Overview

Static website for Pocket AI Labs, deployed to GitHub Pages via `.github/workflows/pages.yml`.
No build step — HTML/CSS/JS is served as-is. Push to `main` triggers deployment.

## Repository Layout

```
.
├── index.html              # Landing page
├── kartoonify.html         # Kartoonify product page (Zazzle "Make It Real" section)
├── smartreceipts.html     # SmartReceipts product page
├── terms.html              # Terms of service
├── kartoonify.css          # Kartoonify page styles
├── css/                    # Shared styles
├── js/                     # Shared JavaScript
├── assets/images/          # Image assets
│   └── kartoonify/zazzle/  # Zazzle product preview images
├── scripts/                # Maintenance scripts
│   └── update_zazzle_images.py
└── .github/workflows/      # GitHub Pages deployment
```

## Zazzle Product Images — Update Process

The Kartoonify page (`kartoonify.html`) has a "Make It Real" section that links to
Zazzle products and displays preview images stored locally in
`assets/images/kartoonify/zazzle/`.

### How to update the Zazzle product images

Run the update script from the repository root:

```bash
python3 scripts/update_zazzle_images.py
```

This script:
1. Fetches each Zazzle product page using Python's `urllib` (which bypasses
   Zazzle's bot detection that blocks `curl`/`wget` with a 403 "Robot" page).
2. Extracts the `og:image` meta tag from the page HTML — this is Zazzle's
   canonical product preview image (630×630 JPEG hosted on `rlv.zcache.com`).
3. Downloads the image and saves it to `assets/images/kartoonify/zazzle/`,
   overwriting the existing file.
4. Reports which images changed (MD5 hash comparison) vs. which were unchanged.

### Product URL → local file mapping

The mapping is defined in `scripts/update_zazzle_images.py` (the `PRODUCTS` list)
and mirrors the `<a class="zazzle-card">` entries in `kartoonify.html`:

| Product       | Zazzle URL                                                        | Local file         |
|---------------|-------------------------------------------------------------------|--------------------|
| Canvas Print  | `https://www.zazzle.com/kartoonify_canvas_print-256438174979296552` | `canvas.jpg`       |
| Poster Print  | `https://www.zazzle.com/kartoonify_print-256875841075244420`       | `print.jpg`        |
| T-Shirt       | `https://www.zazzle.com/kartoonify_t_shirt-256470504046263326`     | `t-shirt.jpg`     |
| Mugs          | `https://www.zazzle.com/kartoonify_mugs-256886499100142319`        | `mugs.jpg`         |

The `selfieboard.jpg` image links to the Zazzle store page (not a specific
product), so it is **not** auto-updated by the script. Update it manually if
needed.

### Why Python `urllib` and not `curl`?

Zazzle's bot detection returns a 403 with an "Are you Human or a Robot?" page
for `curl` and `wget` requests, even with browser-like `User-Agent` headers.
Python's `urllib.request` with the same headers successfully fetches the full
product page HTML (~500 KB). The exact reason is unclear (likely TLS
fingerprinting or header ordering), but the method is reliable.

### Adding a new Zazzle product

1. Add the product to the `PRODUCTS` list in `scripts/update_zazzle_images.py`
   with its Zazzle URL and desired local filename.
2. Add a `<a class="zazzle-card">` entry in `kartoonify.html` (in the
   `#zazzle-gallery` div) with the product URL and `<img>` pointing to the local
   file.
3. Run `python3 scripts/update_zazzle_images.py` to download the image.

### After updating images

- The HTML does **not** need to be edited if filenames stay the same — the
  script overwrites files in place.
- Commit the updated images: `git add assets/images/kartoonify/zazzle/ && git commit`
- Push to `main` to deploy via GitHub Pages.

## Verification

- `python3 scripts/update_zazzle_images.py` — downloads latest Zazzle images
- Open `kartoonify.html` in a browser to visually verify the "Make It Real" section
- `file assets/images/kartoonify/zazzle/*.jpg` — verify images are valid JPEGs (630×630)
