// Languages and localised URLs. Plain JavaScript so that astro.config.mjs (sitemap,
// i18n) and the site (src/i18n/config.ts) read the same values.
// To change the default language (served at "/"), change DEFAULT_LOCALE only.

export const LOCALES = /** @type {const} */ (['pt', 'en']);

/** @type {'pt' | 'en'} */
export const DEFAULT_LOCALE = 'en';

// BCP 47 tags used in <html lang>, hreflang, the sitemap and RSS.
// Language-only tags ("pt", "en") so that search engines serve each version to all
// speakers of the language. The text itself is European Portuguese and British English.
export const LANG_TAGS = { pt: 'pt', en: 'en' };

// Locales for formatting dates (European Portuguese conventions).
export const FORMAT_LOCALES = { pt: 'pt-PT', en: 'en-GB' };

// Route keys and their path in each language ('' is the home page).
// Paths may contain "/" (a page inside a section). Never change a published path:
// add a redirect in astro.config.mjs instead.
export const ROUTES = /** @type {const} */ ({
  home: { pt: '', en: '' },
  about: { pt: 'sobre', en: 'about' },
  practice: { pt: 'areas-de-pratica', en: 'practice-areas' },
  publications: { pt: 'publicacoes', en: 'publications' },
  articles: { pt: 'artigos', en: 'articles' },
  talks: { pt: 'intervencoes', en: 'talks' },
  news: { pt: 'noticias', en: 'news' },
  contact: { pt: 'contactos', en: 'contact' },
  privacy: { pt: 'politica-de-privacidade', en: 'privacy-policy' },
  legal: { pt: 'aviso-legal', en: 'legal-notice' },
});

/** Site path of a route in a language, without base: "/sobre/", "/en/about/". */
export function routePath(key, locale) {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  const slug = ROUTES[key][locale];
  return `${prefix}/${slug ? `${slug}/` : ''}`;
}

// Until 20 Oct 2026 Portuguese was the default language (at "/") and English was at "/en/".
// These published URLs redirect to their new place. Only pages that existed then are listed;
// sections that only exist with content had not been published.
const LEGACY_DEFAULT = 'pt';
const LEGACY_KEYS = ['about', 'practice', 'publications', 'contact', 'privacy', 'legal'];

/** Redirects from the URLs used while Portuguese was the default language. */
export function legacyRedirects() {
  const out = {};
  for (const key of LEGACY_KEYS) {
    for (const locale of LOCALES) {
      const slug = ROUTES[key][locale];
      const old = locale === LEGACY_DEFAULT ? `/${slug}/` : `/${locale}/${slug}/`;
      const now = routePath(key, locale);
      if (old !== now) out[old] = now;
    }
  }
  // Old English home page.
  out['/en/'] = routePath('home', 'en');
  // Until 21 Oct 2026 the publications list sat under a Publications hub; the hub page
  // itself is now the list. Old addresses of the list, in both URL schemes:
  for (const old of ['/publicacoes/artigos/', '/pt/publicacoes/artigos/']) out[old] = routePath('publications', 'pt');
  for (const old of ['/en/publications/articles/', '/publications/articles/']) out[old] = routePath('publications', 'en');
  return out;
}
