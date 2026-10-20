// Languages and routes for the site. The values live in routes.mjs.

import { DEFAULT_LOCALE as DEFAULT, LANG_TAGS as TAGS, LOCALES as LOCALE_LIST, ROUTES as ROUTE_MAP } from './routes.mjs';

export const LOCALES = LOCALE_LIST;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = DEFAULT;

export const LANG_TAGS: Record<Locale, string> = TAGS;
export const OG_LOCALES: Record<Locale, string> = { pt: 'pt_PT', en: 'en_GB' };

// The route map itself is in routes.mjs (shared with astro.config.mjs).
export const ROUTES = ROUTE_MAP;

// Sections that exist only once they have content (navigation, home, hub, sitemap).
export const CONDITIONAL_ROUTES = ['commentaries', 'talks', 'news'] as const;

// Pages that sit inside another section (breadcrumbs, submenu).
export const PARENTS: Partial<Record<keyof typeof ROUTES, keyof typeof ROUTES>> = {
  papers: 'publications',
  commentaries: 'publications',
};

// Items per page in the commentaries, talks and news lists.
export const PAGE_SIZE = 10;

export type RouteKey = keyof typeof ROUTES;
