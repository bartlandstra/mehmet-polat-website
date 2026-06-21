# Mehmet Polat — Official Website

Personal website for **Mehmet Polat**, master ud player, composer and teacher based in Amsterdam.

## Stack

Plain HTML · CSS · Vanilla JS — zero dependencies, no build step required.

## Structure

```
/
├── index.html      # Complete single-page site
└── README.md
```

## Sections

- **Hero** — Split-layout with photo left, name/CTA right
- **Bio** — About text with photo grid
- **Quote** — Press quote
- **The Quartet** — Current ensemble and members
- **Discography** — All 7 albums (2014–2025) with covers
- **Listen** — Embedded Spotify player
- **Gallery** — Four-image photo strip
- **Contact** — Phone, social links, contact form

## Running Locally

Just open `index.html` in any browser — no server needed.

```bash
open index.html
```

Or serve it with any static server:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Images & Media

All images are loaded directly from `mehmetpolat.net` (WordPress media library). No assets are bundled locally.

The Spotify embed uses the public artist ID `5G3QhltT1IWPSkV3Wh1My4`.

## Deployment

Drop the `index.html` onto any static host:

- **GitHub Pages** — push to a `gh-pages` branch or enable Pages on `main`
- **Netlify / Vercel** — drag-and-drop the folder
- **Any web host** — upload via FTP/SFTP

## Credits

Design & development by Claude (Anthropic) for Mehmet Polat.  
Photos © Hans de Vries, Ali Çağlar Erdoğan, Said Rassuli, Joris van der Linden, Demet Temel, Wim van Zon.
