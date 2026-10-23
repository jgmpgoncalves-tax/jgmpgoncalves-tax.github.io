# Site rules (João Gabriel Gonçalves)

Academic outlet of a tax lawyer: a short description, practice areas, publications (scholarly work) and, once they exist, articles (own opinion pieces, not peer-reviewed), talks and news. Astro, static output, GitHub Pages (repository `jgmpgoncalves-tax.github.io`, site at the domain root). Public repository.

## Technical rules
- Astro (static), plain CSS with custom properties (`src/styles/global.css`). No UI framework, no client-side framework. Vanilla JS only where needed (mobile menu, submenu when a nav item has children).
- Colour tokens are fixed: `--navy`, `--navy-700`, `--bg`, `--surface`, `--text`, `--muted`, `--border`, and `--accent` (burgundy `#9b1c39`, from the letterhead: only for the rules in the J|G|G monogram, on light backgrounds). Do not add tokens.
- Visual identity matches the letterhead: J|G|G monogram (serif capitals, two burgundy rules), navy rule under the header, profession letter-spaced beside the monogram, letter-spaced uppercase labels. The same mark is in `public/favicon.svg` and `public/og-image.png`. On navy surfaces: white for titles and arrows, `--border` for labels and dates. In white layouts, dates in `--muted`.
- Fonts: Source Serif 4 + Source Sans 3, self-hosted via Fontsource (the two latin files are preloaded in `Base.astro`).
- Content lives outside templates: YAML in `src/data/`, Markdown in `src/content/`, validated by schemas in `src/content.config.ts` (strict for {pt, en} pairs). A content change must never require editing a template.
- Languages: en (default, at `/`) and pt (at `/pt/`). Until 20 Oct 2026 pt was the default (at `/`) and en was at `/en/`; those URLs redirect (`legacyRedirects()` in `src/i18n/routes.mjs`). Locales, default locale and localised paths are defined only in `src/i18n/routes.mjs` (read by both the site and `astro.config.mjs`). Language tags are `pt` and `en` (language only, so each version reaches all speakers); dates are formatted pt-PT / en-GB.
- All internal links go through `pathFor()` / `asset()` in `src/i18n/utils.ts`.
- Publications and Articles are separate top-level pages. Publications (`/publications/`, `/pt/publicacoes/`) lists scholarly work from `publications.yaml` (journals, research series). Articles (`/articles/`, `/pt/artigos/`) are own texts written for the site: opinion and reflections, not peer-reviewed. Until 21 Oct 2026 the publications list was at `/publications/articles/` under a Publications hub; those URLs redirect.
- Sections with content only: Artigos, Intervenções and Notícias appear in the navigation, on the home page and in the sitemap only once they have an entry (`hasContent()` in `src/lib/data.ts`). Their pages are not generated before that.
- Lists (articles, talks, news): 10 items per page, `<section>/2/`, `<section>/3/`...
- Never change a published URL. Article URLs (`/articles/<slug>/`, `/pt/artigos/<slug>/`) are cited. Old URLs get a redirect in `astro.config.mjs`.
- No cookies, analytics, embeds or third-party requests at page load. The site must never need a cookie banner. The only third-party request is the contact form submission to Formspree (`contactForm` in `profile.yaml`), declared in the privacy policy; keep the policy in step with any change to the form.
- Accessibility: semantic HTML, WCAG 2.2 AA contrast, visible focus, keyboard-operable menu and submenu (hover, focus, toggle with `aria-expanded`, Escape), `<details>` for collapsible sections, alt text (decorative banners `alt=""`), correct `lang`, `prefers-reduced-motion`.
- SEO: per-page title (about 70 characters at most) and description in both languages, Open Graph/Twitter, hreflang (pt, en, x-default) and sitemap pairs for localised paths and article translations, canonical, robots.txt, JSON-LD Person (`worksFor`, former employers and degrees in `alumniOf`, `knowsAbout` from the research areas). Firm names are in structured data only, never in the visible text.
- Responsive from 360px; header on one line on mobile. Target Lighthouse 95+ in all categories.
- Do not commit anything not meant to be published (CV files, notes, phone numbers, `.env`, reference screenshots, images with metadata).

## Writing rules (all site copy)
- European Portuguese (AO90) and British English, each written natively, not translated sentence by sentence. The author's own texts (description) are kept as written, with spelling corrections only.
- First person ("I" / "eu") in the site's own copy (About text, page intros). Meta descriptions, alt text and the legal pages name the author instead. Factual, understated. Short sentences. No marketing language.
- No self-evaluation or superlatives. Information must be truthful, objective and not misleading.
- The site does not reproduce CV detail beyond the description: no grades, rankings, prizes, internships, training courses, moot court, debating or scholarships, and no task lists per job.
- No em dashes (U+2014) anywhere. En dashes only in date ranges.
- Dates: "jul. 2025 – presente" / "Jul 2025 – present".
- Never invent facts, dates, URLs, titles or affiliations. Where data is missing, leave a visible `TODO` and report it.
- Do not publish the mobile number.

## Way of working
- Work in stages; stop for review after each. Commit after each stage with a clear message.
- Before finishing: `npm run check`, `npm run build`, broken-link check (including redirects), Lighthouse, HTML validation, keyboard test of the submenu and collapsible sections, and a search of `dist/` for em dashes, `TODO` and removed CV items.
- Sections that only exist with content must be tested with temporary sample content (build to a separate `--outDir`), then the samples removed.

## Routine edits
- Role or firm: `src/data/profile.yaml` only (`role`, `employer` for the text, `firm` for structured data). The first sentence of the About text is generated from it.
- Description: `src/content/description/<pt|en>.md` (home text in the frontmatter, About text in the body). `{dissertation}` is filled from `profile.yaml`; after the defence set `dissertation.status: defended` and `defenceYear`.
- Practice areas ("Áreas de prática" / "Expertise", `/practice-areas/`, `/pt/areas-de-pratica/`): `src/data/practice-areas.yaml`.
- Research areas: `src/data/research-areas.yaml`. Academic affiliations (research positions only): `src/data/research.yaml`.
- Publications (scholarly work only): `src/data/publications.yaml`; sorting and year groups are automatic.
- Article (own text): see "Publishing an article".
- News or talk: `src/content/news/<pt|en>/<slug>.md` with `date`, `category` (`talk`, `publication`, `teaching`, `other`, from `src/data/news-categories.yaml`), `title`, optional `link`, `image` (+ `imageAlt`), `translationOf`, `draft`. The body is the text shown in the list. `talk` items also appear on the Intervenções page. One language is enough.
- Images (optional, any of .jpg/.jpeg/.png/.webp): `src/assets/profile.jpg` (home photo), `src/assets/banners/{inicio,sobre,publicacoes,contactos}.<ext>` (banners; `contactos` is the image beside the contact box), `src/assets/strip.<ext>` (home strip). Without an image, banners are navy blocks. Strip metadata before committing.
- Privacy policy and legal notice: `src/content/legal/<pt|en>/<privacy|legal>.md`. Remove `draft: true` once approved.
- Missing data: `todo: [field]` in the YAML renders a visible TODO.
- New page: add a route key and both paths in `src/i18n/routes.mjs`, labels and meta description in `src/i18n/ui.ts`, a view in `src/views/` (use `layouts/Page.astro`) and a line in `src/pages/[...path].astro`.
- Share image: `node scripts/og-image.mjs` (needs Playwright) regenerates `public/og-image.png`. The favicon and share image URLs carry a content fingerprint (`?v=…`, `src/lib/versioned.ts`), so a new image reaches browsers and social networks without cache problems; keep the file names.

## Publishing an article
- Articles are the author's own texts (opinion, reflections, case and ruling commentaries, legislative notes), not peer-reviewed. Peer-reviewed or edited publications go in `publications.yaml` instead.
- File: `src/content/articles/<pt|en>/<slug>.md`. The file name is the slug: `/articles/<slug>/` or `/pt/artigos/<slug>/`. Lowercase ASCII and hyphens; not only digits. Never rename after publication.
- Frontmatter: `title`, `date` (YYYY-MM-DD), `updated` (optional), `summary`, `type` (`opinion`, `case-commentary`, `ruling-commentary`, `legislative-note`, from `src/data/article-types.yaml`), `tags`, `translationOf` (optional: slug of the version in the other language), `aiTranslation` (optional: `true` if translated with the help of AI; the note at the end of every article then says so instead of "AI used strictly for grammatical revision"), `pdf` (optional: file name in `public/pdf/`), `draft`.
- `draft: true` appears in `npm run dev` only and is never built in production. Draft files are still visible in the public repository.
- One language is enough: the other language's list shows it with a language label, and the language switch on the article goes to that list.
- Body: `##` and `###` headings only. Footnotes with `[^1]`. Statutory text as a block quote whose first line is the provision in bold (`> **Artigo 51.º do Código do IRC**`).
- The build fails on: wrong folder, a missing PDF, `#`/`####` headings, em dashes (including `---` inside text; a `---` line on its own is a horizontal rule).
- Generated automatically: list entry, home and sidebar "Em destaque", JSON-LD `Article`, Open Graph article tags, canonical, hreflang, sitemap pairs, RSS at `/articles/rss.xml` and `/pt/artigos/rss.xml`, the Artigos menu entry, and the switch of the old `/artigos/` and `/en/articles/` redirects to the articles.

## YAML pitfalls
- Quote any value containing a comma inside inline `{ }` or `[ ]`. Unquoted, the comma splits the value; the strict schemas then fail the build.
- Quote dates: `"2025-07"`.
