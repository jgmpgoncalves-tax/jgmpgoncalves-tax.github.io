// Languages and localised URLs. Plain JavaScript so that astro.config.mjs (sitemap,
// i18n) and the site (src/i18n/config.ts) read the same values.
// To change the default language (served at "/"), change DEFAULT_LOCALE only.

export const LOCALES = /** @type {const} */ (['pt', 'en']);

/** @type {'pt' | 'en'} */
export const DEFAULT_LOCALE = 'pt';

// BCP 47 tags used in <html lang>, hreflang, og:locale and the sitemap.
export const LANG_TAGS = { pt: 'pt-PT', en: 'en-GB' };

// Route keys and their path in each language ('' is the home page).
// Paths may contain "/" (a page inside a section). Never change a published path:
// add a redirect in astro.config.mjs instead.
export const ROUTES = /** @type {const} */ ({
  home: { pt: '', en: '' },
  about: { pt: 'sobre', en: 'about' },
  publications: { pt: 'publicacoes', en: 'publications' },
  papers: { pt: 'publicacoes/artigos', en: 'publications/articles' },
  commentaries: { pt: 'comentarios', en: 'commentaries' },
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
