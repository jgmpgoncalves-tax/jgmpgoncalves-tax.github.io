// Single source of truth for languages and localised URLs.
// To change the default language (served at "/"), change DEFAULT_LOCALE only.

export const LOCALES = ['pt', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'pt';

// BCP 47 tags used in <html lang>, hreflang and og:locale.
export const LANG_TAGS: Record<Locale, string> = { pt: 'pt-PT', en: 'en-GB' };
export const OG_LOCALES: Record<Locale, string> = { pt: 'pt_PT', en: 'en_GB' };

// Route keys and their slug in each language ('' is the home page).
export const ROUTES = {
  home: { pt: '', en: '' },
  about: { pt: 'sobre', en: 'about' },
  practice: { pt: 'areas-de-pratica', en: 'practice-areas' },
  publications: { pt: 'publicacoes', en: 'publications' },
  articles: { pt: 'artigos', en: 'articles' },
  news: { pt: 'noticias', en: 'news' },
  contact: { pt: 'contactos', en: 'contact' },
  privacy: { pt: 'politica-de-privacidade', en: 'privacy-policy' },
  legal: { pt: 'aviso-legal', en: 'legal-notice' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof ROUTES;
