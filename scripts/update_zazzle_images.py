#!/usr/bin/env python3
"""
Download the latest product images from Zazzle for the Kartoonify web page.

This script:
  1. Fetches each Zazzle product page using Python's urllib (bypasses Zazzle's
     bot detection that blocks curl/wget).
  2. Extracts the og:image meta tag (the main product preview image).
  3. Downloads the image and saves it to the local assets directory.

The product URLs and local file mappings are defined in the PRODUCTS dict below,
which mirrors the Zazzle cards in kartoonify.html (the "Make It Real" section).

Usage:
    python3 scripts/update_zazzle_images.py

Run from the repository root.  Images are saved to
assets/images/kartoonify/zazzle/.
"""

import urllib.request
import gzip
import re
import os
import sys
import hashlib

# ---------------------------------------------------------------------------
# Configuration: Zazzle product URLs  →  local image filenames
# Mirrors the <a class="zazzle-card" href="..."> entries in kartoonify.html
# ---------------------------------------------------------------------------
PRODUCTS = [
    {
        "name": "Canvas Print",
        "url": "https://www.zazzle.com/kartoonify_canvas_print-256438174979296552",
        "local": "canvas.jpg",
    },
    {
        "name": "Poster Print",
        "url": "https://www.zazzle.com/kartoonify_print-256875841075244420",
        "local": "print.jpg",
    },
    {
        "name": "T-Shirt",
        "url": "https://www.zazzle.com/kartoonify_t_shirt-256470504046263326",
        "local": "t-shirt.jpg",
    },
    {
        "name": "Mugs",
        "url": "https://www.zazzle.com/kartoonify_mugs-256886499100142319",
        "local": "mugs.jpg",
    },
]

# Directory where images are saved (relative to repo root)
IMAGE_DIR = os.path.join("assets", "images", "kartoonify", "zazzle")

# HTTP headers that mimic a real browser — required to bypass Zazzle's
# bot detection (curl/wget get a 403 "Are you a Robot?" page).
BROWSER_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip",
}


def fetch_page(url):
    """Fetch a URL and return the decoded HTML text."""
    req = urllib.request.Request(url, headers=BROWSER_HEADERS)
    resp = urllib.request.urlopen(req, timeout=30)
    data = resp.read()
    if resp.headers.get("Content-Encoding") == "gzip":
        data = gzip.decompress(data)
    return data.decode("utf-8", errors="replace")


def extract_og_image(html):
    """Extract the og:image URL from the page's meta tags.

    Zazzle product pages include:
        <meta property="og:image" content="https://rlv.zcache.com/..._630.jpg?...">
    The query string (?rlvnet=1&view_padding=...) is stripped so we get the
    clean image URL.
    """
    # Try property="og:image" first
    match = re.search(
        r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']',
        html,
    )
    if not match:
        # Some pages use content before property
        match = re.search(
            r'<meta\s+content=["\']([^"\']+)["\']\s+property=["\']og:image["\']',
            html,
        )
    if not match:
        return None
    url = match.group(1)
    # Strip HTML entities and query string
    url = url.replace("&", "&")
    # Remove query parameters — we want the raw image
    url = url.split("?")[0]
    return url


def download_image(url, dest_path):
    """Download an image URL to dest_path. Returns True on success."""
    headers = dict(BROWSER_HEADERS)
    headers["Accept"] = "image/webp,image/apng,image/*,*/*;q=0.8"
    req = urllib.request.Request(url, headers=headers)
    resp = urllib.request.urlopen(req, timeout=30)
    data = resp.read()
    if resp.headers.get("Content-Encoding") == "gzip":
        data = gzip.decompress(data)
    with open(dest_path, "wb") as f:
        f.write(data)
    return len(data)


def file_hash(path):
    """Return MD5 hash of a file for change detection."""
    with open(path, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()


def main():
    os.makedirs(IMAGE_DIR, exist_ok=True)
    updated = []
    skipped = []

    for product in PRODUCTS:
        name = product["name"]
        url = product["url"]
        local = product["local"]
        dest = os.path.join(IMAGE_DIR, local)

        print(f"\n{'='*60}")
        print(f"Product: {name}")
        print(f"URL:     {url}")
        print(f"Local:   {dest}")

        # Step 1: Fetch the product page
        try:
            html = fetch_page(url)
        except Exception as e:
            print(f"  ERROR fetching page: {e}")
            continue

        if "Are you Human or a Robot" in html:
            print("  ERROR: Blocked by Zazzle bot detection")
            continue

        # Step 2: Extract the og:image URL
        og_image = extract_og_image(html)
        if not og_image:
            print("  ERROR: Could not find og:image meta tag")
            continue
        print(f"  og:image: {og_image}")

        # Step 3: Download the image
        old_hash = file_hash(dest) if os.path.exists(dest) else None
        try:
            size = download_image(og_image, dest)
        except Exception as e:
            print(f"  ERROR downloading image: {e}")
            continue

        new_hash = file_hash(dest)
        print(f"  Downloaded {size} bytes")

        if old_hash == new_hash:
            print(f"  → Unchanged (image is the same)")
            skipped.append(name)
        else:
            print(f"  → UPDATED (image changed)")
            updated.append(name)

    # Summary
    print(f"\n{'='*60}")
    print(f"SUMMARY")
    print(f"  Updated: {len(updated)}  {[u for u in updated]}")
    print(f"  Unchanged: {len(skipped)}  {[s for s in skipped]}")
    print(f"{'='*60}")

    return 0 if not updated else 0  # always success if we got this far


if __name__ == "__main__":
    sys.exit(main())
