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
- Current role or promotion: `src/data/experience.yaml` only (current role has `end: null`). The bio in `src/data/profile.yaml` fills `{position}` from it.
- Identity, contacts, bio, languages: `src/data/profile.yaml`.
- Education (incl. dissertation `status`), research, training, practice areas: matching file in `src/data/`.
- New publication: add an entry to `src/data/publications.yaml` (sorting and year grouping are automatic).
- Article: see "Publishing an article" below.
- News item: add `src/content/news/pt/<date>-<slug>.md` and the same file name in `src/content/news/en/`. News appears in the navigation and on the home page once the first entry in that language exists.
- Privacy policy and legal notice: `src/content/legal/<pt|en>/<privacy|legal>.md`. Remove `draft: true` once approved.
- Missing data: `todo: [field]` in the YAML renders a visible TODO.
- New page: add a route key and both slugs in `src/i18n/config.ts`, labels and meta description in `src/i18n/ui.ts`, a view in `src/views/` and a line in `src/pages/[...path].astro`.
- Share image: `node scripts/og-image.mjs` (needs Playwright) regenerates `public/og-image.png`.

## Publishing an article
- File: `src/content/articles/<pt|en>/<slug>.md`. The file name is the slug: `/artigos/<slug>/` or `/en/articles/<slug>/`. Use lowercase ASCII and hyphens.
- Frontmatter: `title`, `date` (YYYY-MM-DD), `updated` (optional), `summary`, `type` (`scientific` | `note` | `commentary`), `tags` (list), `lang` (must match the folder), `translationOf` (optional: slug of the version in the other language), `pdf` (optional: file name in `public/pdf/`), `draft` (true/false).
- `draft: true` articles appear in `npm run dev` only; they are not built in production. Draft files are still visible in the public repository.
- An article may exist in one language only. The other language's list shows it with a language label, and the language switch on the article goes to that list.
- Body: `##` and `###` headings only. Footnotes with `[^1]` and `[^1]: text`. Statutory text as a block quote whose first line is the provision in bold (`> **Artigo 51.º do Código do IRC**`).
- The build fails on: wrong folder/`lang`, a missing PDF, `#`/`####` headings, em dashes (including `---` inside text, which the Markdown processor turns into one; a `---` line on its own is a horizontal rule and is allowed).
- Generated automatically: list and home entry, "Como citar / How to cite" (Católica Law Review style rules, V.5: `GONÇALVES, João Gabriel (2026), *Título*, in <URL> (d.mm.aaaa)`, consultation date filled in by the reader's browser), JSON-LD (ScholarlyArticle for `scientific`, Article otherwise), Open Graph article tags, canonical, hreflang (only for versions that exist), RSS at `/artigos/rss.xml` and `/en/articles/rss.xml`.

## YAML pitfalls
- Quote any value containing a comma inside inline `{ }` or `[ ]` (e.g. `{ pt: "Lisboa, Portugal", en: "Lisbon, Portugal" }`). Unquoted, the comma splits the value; the strict schemas then fail the build.
- Quote dates: `"2025-07"`.
