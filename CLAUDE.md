# CLAUDE.md

This project is a static, vanilla HTML/CSS/JS high school geography knowledge integration platform for Chinese students. No build tools, no framework, no tests.

## File Structure

```
index.html            — Homepage with four module cards (自然/人文/区域/选修)
css/style.css         — Shared styles for all pages (CSS variables, layout, responsive)
js/app.js             — Shared JS: mobile nav toggle, search, sidebar highlight, anchor scroll
js/data.js            — Knowledge point data for search indexing (title, desc, keywords per topic)
knowledge/nature.html — Natural geography (5 chapters: 地球运动/大气环境/水体/地表形态/自然带)
knowledge/humanity.html — Human geography (4 chapters: 人口与城市/农业/工业/交通与服务业)
knowledge/region.html   — Regional geography (4 chapters: 中国自然/中国人文/世界地区/地理信息技术)
knowledge/elective.html — Elective topics (5 chapters: 自然资源/环境污染/自然灾害/区域可持续/生态保护)
```

## Architecture

- **Pure static site** — each page is a standalone HTML file served directly; no server-side rendering, no build step.
- **Shared layout pattern** across all four knowledge pages:
  - `<header>` with nav links (manually kept in sync across files)
  - `<main>` with a `.page-header` + `.knowledge-layout` grid (260px sidebar + fluid content)
  - `.content-section` containers with `id="secN"` for sidebar TOC anchors
  - `.knowledge-point` blocks inside each section (title + text)
  - Optional `.knowledge-tip` callout boxes
  - `<footer>` with shared links
- **Homepage** (`index.html`) differs from knowledge pages — it has a hero section, module card grid, and channel banner, but no sidebar/content-section layout.
- **JavaScript** (`app.js`) handles: mobile nav toggle, live search with keyword matching against `KNOWLEDGE_DATA`, sidebar chapter highlighting, and URL anchor scrolling (`#search:xxx`).
- **Search** indexes all knowledge points from `js/data.js` and cross-links pages — clicking a result navigates to the correct knowledge page + scrolls to the matching section.

## CSS Conventions

- Uses CSS custom properties in `:root` for colors, radii, shadows, transitions, and max-width.
- Theme: green palette (`--color-primary: #1a7a6d`) with light backgrounds.
- Layout uses CSS Grid (`.knowledge-layout`, `.modules-grid`) and Flexbox throughout.
- Responsive breakpoints: 900px (sidebar collapses to single column), 768px (mobile nav hamburger).

## Making Changes

- **Add a knowledge point**: Copy an existing `.knowledge-point` block inside the relevant `.content-section` in the appropriate `knowledge/*.html` file.
- **Add a new section/chapter**: Add a new `.content-section` with a unique `id="secN"`, update the sidebar TOC links, and add a corresponding entry in `js/data.js` for search indexing.
- **Style changes**: Edit `css/style.css` — all pages share this single stylesheet.
- **Search data**: Update `js/data.js` keywords field when adding new content so search works.
- **Nav links**: Manually update the `<nav>` in each page's `<header>` and `index.html` if adding new sections.
