import type { Locale, RouteKey } from './config';
import { routePath } from './routes.mjs';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Site-relative path (including base) for a route in a given language. */
export function pathFor(key: RouteKey, locale: Locale): string {
  return `${BASE}${routePath(key, locale)}`;
}

/** Absolute URL for a route, for canonical, hreflang and Open Graph. */
export function absoluteUrlFor(key: RouteKey, locale: Locale, site: URL | undefined): string {
  return new URL(pathFor(key, locale), site).href;
}

/** Path relative to base for a file in /public (favicon, images). */
export function asset(path: string): string {
  return `${BASE}/${path.replace(/^\//, '')}`;
}

/** Catch-all route parameter for a site path built by pathFor() (base and slashes removed). */
export function routeParam(path: string): string | undefined {
  return path.slice(BASE.length).replace(/^\/|\/$/g, '') || undefined;
}
