// Entries written per language (articles, news): src/content/<collection>/<pt|en>/<slug>.md.
// An entry may exist in one language only; `translationOf` (in either file) links two versions.
import { LOCALES, type Locale } from '../i18n/config';

export interface Entry {
  id: string;
  data: { date: Date; translationOf?: string };
}

export const slugOf = (e: Entry) => e.id.split('/').slice(1).join('/');
export const localeOf = (e: Entry) => e.id.split('/')[0] as Locale;

export function checkFolder(e: Entry, collection: string) {
  if (!(LOCALES as readonly string[]).includes(localeOf(e)) || !slugOf(e))
    throw new Error(`src/content/${collection}/${e.id}.md: put the file in ${collection}/pt/ or ${collection}/en/.`);
}

export const newestFirst = <T extends Entry>(list: T[]) => [...list].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

/** The version of an entry in a given language, if any. */
export function versionIn<T extends Entry>(all: T[], e: T, locale: Locale): T | undefined {
  if (localeOf(e) === locale) return e;
  return all.find(
    (b) => localeOf(b) === locale && (b.data.translationOf === slugOf(e) || e.data.translationOf === slugOf(b)),
  );
}

/**
 * Entries listed in a language: those written or translated in it, plus those that exist
 * only in another language (shown with a language label). Newest first.
 */
export function listFor<T extends Entry>(all: T[], locale: Locale): T[] {
  return newestFirst(all.filter((e) => localeOf(e) === locale || !versionIn(all, e, locale)));
}

export function groupByYear<T extends Entry>(items: T[]) {
  const groups = new Map<number, T[]>();
  for (const i of items) {
    const y = i.data.date.getUTCFullYear();
    groups.set(y, [...(groups.get(y) ?? []), i]);
  }
  return [...groups].map(([year, list]) => ({ year, items: list }));
}

/** Splits a list into pages of `size` items. Page 1 is the section's own URL, then <section>/2/, <section>/3/... */
export function paginate<T>(items: T[], size: number) {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages.length ? pages : [[]];
}
