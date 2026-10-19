import { DEFAULT_LOCALE, LOCALES, ROUTES, type Locale, type RouteKey } from './config';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Site-relative path (including base) for a route in a given language. */
export function pathFor(key: RouteKey, locale: Locale): string {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  const slug = ROUTES[key][locale];
  return `${BASE}${prefix}/${slug ? `${slug}/` : ''}`;
}

/** Absolute URL for a route, for canonical, hreflang and Open Graph. */
export function absoluteUrlFor(key: RouteKey, locale: Locale, site: URL | undefined): string {
  return new URL(pathFor(key, locale), site).href;
}

/** Path relative to base for a file in /public (favicon, images). */
export function asset(path: string): string {
  return `${BASE}/${path.replace(/^\//, '')}`;
}

/** Parameters for the catch-all route: one entry per route and language. */
export function allRouteParams() {
  return LOCALES.flatMap((locale) =>
    (Object.keys(ROUTES) as RouteKey[]).map((key) => {
      const prefix = locale === DEFAULT_LOCALE ? '' : locale;
      const slug = [prefix, ROUTES[key][locale]].filter(Boolean).join('/');
      return { params: { path: slug || undefined }, props: { key, locale } };
    }),
  );
}

export function otherLocales(locale: Locale): Locale[] {
  return LOCALES.filter((l) => l !== locale);
}
