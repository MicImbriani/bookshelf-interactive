# Books I've Read — a calm pastel cylinder library

A minimal, relaxing webapp that displays the books you've read as a wide
**cylinder of stacked shelves** rendered with CSS 3D. Move your cursor to the
left/right edges to **rotate** the cylinder and reveal more books, and **drag
books** to rearrange them — they snap into tidy shelf slots. Add books by
searching the free **Open Library** API (covers and author fill in
automatically).

## Run locally

```bash
node serve.mjs        # serves the project at http://localhost:3000
```

Open http://localhost:3000.

While the dev server is running, every change (adding, removing, rearranging a
book) is written straight back to **`data/books.json`** via a tiny
`POST /api/save` endpoint — so just `git add data/books.json && git commit` to
keep your library. A `localStorage` copy is kept as a cache, and the **Export**
button downloads a fresh `books.json` as a manual backup.

## How it works

- **`index.html`** — the whole app: pastel design system, the CSS-3D cylinder,
  edge-rotation, drag-and-snap, the Open Library search panel, and persistence.
  Single file with inline styles + script.
- **`data/books.json`** — your library (source of truth). Each book has a
  `title`, `author`, `coverUrl`, a pastel `tint`, and a `(shelf, slot)`
  position on the cylinder.
- **`serve.mjs`** — zero-dependency static server + the local-only
  `GET /api/books` and `POST /api/save` endpoints.
- **`screenshot.mjs`** — Puppeteer helper for the compare-to-reference workflow
  (`npm i -D puppeteer` first; saves to `temporary_screenshots/`).

## Tuning the look

The cylinder geometry lives in CSS custom properties at the top of
`index.html` (`:root`) — adjust and reload:

| Variable        | Meaning                                  |
| --------------- | ---------------------------------------- |
| `--radius`      | cylinder radius (curvature/spacing)      |
| `--persp`       | camera perspective (depth intensity)     |
| `--book-w/-h`   | book cover size                          |
| `--row-h`       | vertical gap between shelves             |
| `--step`        | degrees per slot (auto = 360 / slots)    |

The number of shelves and slots comes from `config` in `data/books.json`.

> Note: the cylinder is rendered **convex** (camera outside — the centre book
> faces you and the rows curve gently back), which reads as a wide rotating
> cylinder. The structural reference photo is concave (interior view); the
> palette here is deliberately pastel rather than the dark reference, per the
> brief.

## Deploying

It's a static site — host `index.html` + `data/books.json` anywhere (Vercel,
Netlify, Cloudflare Pages, or any static host). On static hosting the save
endpoint is simply absent, so the deployed site is a read-only display of the
committed `books.json`; edit locally and re-commit to update it.
