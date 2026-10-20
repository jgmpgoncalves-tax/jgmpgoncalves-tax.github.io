// hreflang links for the sitemap: every route in both languages, and every commentary
// with its translation (linked by `translationOf` in either file). Read at build time.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { DEFAULT_LOCALE, LANG_TAGS, LOCALES, ROUTES, routePath } from './routes.mjs';

const COMMENTARIES = 'src/content/commentaries';

function commentaryGroups() {
  const files = LOCALES.flatMap((locale) => {
    const dir = `${COMMENTARIES}/${locale}`;
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => {
        const front = readFileSync(`${dir}/${f}`, 'utf8').split(/^---$/m)[1] ?? '';
        const tr = /^translationOf:\s*["']?([^"'\n]+?)["']?\s*$/m.exec(front);
        // Drafts are not built in production, so they have no sitemap entry.
        const draft = /^draft:\s*true\s*$/m.test(front);
        return { locale, slug: f.slice(0, -3), translationOf: tr?.[1], draft };
      })
      .filter((f) => !f.draft);
  });
  const groups = [];
  for (const f of files) {
    const partner = files.find(
      (g) => g.locale !== f.locale && (g.translationOf === f.slug || f.translationOf === g.slug),
    );
    if (partner && f.locale === DEFAULT_LOCALE) groups.push({ [f.locale]: f.slug, [partner.locale]: partner.slug });
    else if (!partner) groups.push({ [f.locale]: f.slug });
  }
  return groups.map((g) =>
    Object.fromEntries(Object.entries(g).map(([l, slug]) => [l, `${routePath('commentaries', l)}${slug}/`])),
  );
}

/** Map from absolute URL to its sitemap `links` (language versions plus x-default). */
export function sitemapLinks(site, base = '/') {
  const prefix = base.replace(/\/$/, '');
  const abs = (path) => new URL(`${prefix}${path}`, site).href;
  const groups = [
    ...Object.keys(ROUTES).map((key) => Object.fromEntries(LOCALES.map((l) => [l, routePath(key, l)]))),
    ...commentaryGroups(),
  ];
  const map = new Map();
  for (const g of groups) {
    const links = Object.entries(g).map(([l, path]) => ({ lang: LANG_TAGS[l], url: abs(path) }));
    links.push({ lang: 'x-default', url: abs(g[DEFAULT_LOCALE] ?? Object.values(g)[0]) });
    for (const path of Object.values(g)) map.set(abs(path), links);
  }
  return map;
}
