# Site rules (João Gabriel Gonçalves)

Personal professional website. Astro, static output, GitHub Pages. Public repository.

## Technical rules
- Astro (static), plain CSS with custom properties (`src/styles/global.css`). No UI framework, no client-side framework. Vanilla JS only where needed (mobile menu).
- Content lives outside templates: YAML in `src/data/`, Markdown in `src/content/`, validated by schemas in `src/content.config.ts`. A content change must never require editing a template.
- Languages: pt (pt-PT, default, at `/`) and en (en-GB, at `/en/`). Locales, default locale and localised slugs are defined only in `src/i18n/config.ts` (mirror `DEFAULT_LOCALE`/locales in `astro.config.mjs`). Every page exists in both languages. The language switch goes to the equivalent page.
- All internal links go through `pathFor()` / `asset()` in `src/i18n/utils.ts` (they handle `base`).
- No cookies, analytics, embeds or third-party requests at page load. Fonts self-hosted via Fontsource. The site must never need a cookie banner.
- Accessibility: semantic HTML, WCAG 2.2 AA contrast, visible focus, keyboard-operable menu, alt text, correct `lang`, `prefers-reduced-motion`.
- SEO: per-page title and description in both languages, Open Graph/Twitter, hreflang (pt-PT, en-GB, x-default), canonical, sitemap, robots.txt, JSON-LD Person.
- Responsive from 360px. Target Lighthouse 95+ in all categories.
- Do not commit anything not meant to be published (no CV files, notes, phone numbers, `.env`).

## Writing rules (all site copy)
- European Portuguese (AO90) and British English, each written natively, not translated sentence by sentence.
- Third person, factual, understated. Short sentences. No marketing language.
- No self-evaluation or superlatives ("leading", "top", "rigorous", "solutions-oriented"). Keep objective facts: dates, grades, prizes, roles. Information must be truthful, objective and not misleading.
- No em dashes (U+2014) anywhere. En dashes only in date ranges.
- Dates: "jul. 2025 – presente" / "Jul 2025 – present".
- Never invent facts, dates, URLs, titles or affiliations. Where data is missing, leave a visible `TODO` and report it.
- Do not publish the mobile number.

## Way of working
- Work in stages; stop for review after each. Commit after each stage with a clear message.
- Before finishing: `npm run check`, `npm run build`, broken-link check, Lighthouse, HTML validation, and search `dist/` for em dashes and `TODO`.

## Routine edits
- Current role / contacts: `src/data/profile.yaml`.
- Experience, education (incl. dissertation status), research, training, activities: matching file in `src/data/`.
- New publication: add an entry to `src/data/publications.yaml` (sorting and year grouping are automatic).
- News item: add `src/content/news/pt/<date>-<slug>.md` and the English counterpart in `src/content/news/en/`. News appears in the navigation and on the home page once the first entry exists.
- New page: add a route key and both slugs in `src/i18n/config.ts`, labels in `src/i18n/ui.ts`.
