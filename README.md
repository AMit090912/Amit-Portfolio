# Amit — Portfolio

Personal portfolio of **Amit**, AI & backend engineer (Python · FastAPI · LLMs).

The site is designed as an engineering **drawing set**: every project is a "sheet" with its real
architecture drawn as an animated diagram. The red dashed line in each diagram is the fallback path:
what the system does when the AI model is wrong, slow or missing.

## What's inside

- **4 primary projects:** HelioFlow, AI Support Ticket Platform, VedaAI, Healthcare RAG Assistant,
  each with an architecture diagram, numbered design notes and screenshots
- **6 supporting projects** with a screenshot / architecture view
- About, experience, skills and contact
- Paper (light) and Blueprint (dark) themes

## Tech

Plain **HTML, CSS and JavaScript**, with no framework and no build step. Diagrams are SVG generated from
the project data in `site/script.js`.

```
site/
├── index.html        page structure and static content
├── styles.css        all styling (Paper / Blueprint themes)
├── script.js         project data + diagram renderer
├── theme-init.js     restores the saved theme before first paint
├── assets/           photo, résumé, screenshots
├── vercel.json       security headers for Vercel
└── _headers          security headers for Netlify / Cloudflare Pages
```

## Run locally

Open `site/index.html` in a browser, or serve the folder:

```bash
cd site
python -m http.server 8000   # http://localhost:8000
```

## Deploy

The deployable site is the **`site/`** folder.

- **Vercel:** import the repo and set **Root Directory** to `site`. No build command is needed.
- **Netlify:** set **Base directory** to `site`, with no build command and publish directory `site`.
- **GitHub Pages:** the workflow in `.github/workflows/pages.yml` publishes `site/` on every push to
  `main`. In the repo settings, go to **Pages → Source** and choose **GitHub Actions**.
  (GitHub Pages ignores custom security headers; use Vercel or Netlify for those.)

## Editing content

Project text, links, screenshots and diagrams are defined at the top of `site/script.js`
(`PRIMARY` and `SECONDARY`). Everything else is in `site/index.html`.

---

© 2026 Amit
