import { existsSync } from 'node:fs';
import { getCollection, type CollectionEntry } from 'astro:content';
import { LANG_TAGS, LOCALES, type Locale } from '../i18n/config';
import { pathFor } from '../i18n/utils';

export type Article = CollectionEntry<'articles'>;

const EM_DASH = '\u2014';

/** Slug of an article: its file name without the language folder. */
export const slugOf = (a: Article) => a.id.split('/').slice(1).join('/');
export const localeOf = (a: Article) => a.id.split('/')[0] as Locale;

/** Site path of an article page, e.g. /artigos/<slug>/ or /en/articles/<slug>/. */
export const articlePath = (a: Article) => `${pathFor('articles', localeOf(a))}${slugOf(a)}/`;

// Checks that cannot be expressed in the schema. They fail the build with a clear message.
function validate(a: Article) {
  const where = `src/content/articles/${a.id}.md`;
  if (!(LOCALES as readonly string[]).includes(localeOf(a))) throw new Error(`${where}: put the file in articles/pt/ or articles/en/.`);
  if (a.data.lang !== localeOf(a)) throw new Error(`${where}: lang is "${a.data.lang}" but the file is in articles/${localeOf(a)}/.`);
  if (a.data.pdf && !existsSync(`public/pdf/${a.data.pdf}`)) throw new Error(`${where}: public/pdf/${a.data.pdf} does not exist.`);
  const body = a.body ?? '';
  if (body.includes(EM_DASH) || /(^|[^-])---([^-]|$)/m.test(body.replace(/^---$/gm, '')))
    throw new Error(`${where}: em dashes are not allowed (write them as a comma, colon or parentheses; "---" also becomes an em dash).`);
  const html = a.rendered?.html ?? '';
  if (/<h1[\s>]|<h[4-6][\s>]/.test(html)) throw new Error(`${where}: use only ## and ### headings.`);
}

let cache: Article[] | undefined;

/** All articles that are built: drafts are left out of production builds. */
export async function getArticles(): Promise<Article[]> {
  if (!cache || import.meta.env.DEV) {
    const all = await getCollection('articles', (a) => !(import.meta.env.PROD && a.data.draft));
    all.forEach(validate);
    cache = all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  }
  return cache;
}

/** The version of an article in another language, linked by `translationOf` in either file. */
export async function translationOf(a: Article, locale: Locale): Promise<Article | undefined> {
  if (localeOf(a) === locale) return a;
  return (await getArticles()).find(
    (b) => localeOf(b) === locale && (b.data.translationOf === slugOf(a) || a.data.translationOf === slugOf(b)),
  );
}

/**
 * Articles listed for a language: those written or translated in it, plus those
 * that exist only in another language (shown with a language label). Newest first.
 */
export async function articlesFor(locale: Locale) {
  const all = await getArticles();
  const own = all.filter((a) => localeOf(a) === locale);
  const others = [];
  for (const a of all.filter((x) => localeOf(x) !== locale)) {
    if (!(await translationOf(a, locale))) others.push(a);
  }
  return [...own, ...others].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Paths of every language version of an article (for hreflang and the language switch). */
export async function articleAlternates(a: Article) {
  const out: Partial<Record<Locale, string>> = {};
  for (const l of LOCALES) {
    const t = await translationOf(a, l);
    if (t) out[l] = articlePath(t);
  }
  return out;
}

export function groupByYear<T extends { data: { date: Date } }>(items: T[]) {
  const groups = new Map<number, T[]>();
  for (const i of items) {
    const y = i.data.date.getUTCFullYear();
    groups.set(y, [...(groups.get(y) ?? []), i]);
  }
  return [...groups].map(([year, list]) => ({ year, items: list }));
}

const FOOTNOTE_LABELS: Record<Locale, { heading: string; back: (n: string) => string }> = {
  pt: { heading: 'Notas', back: (n) => `Voltar à referência ${n}` },
  en: { heading: 'Notes', back: (n) => `Back to reference ${n}` },
};

/** Rendered article HTML with footnote labels in the article's language. */
export function articleHtml(a: Article): string {
  const t = FOOTNOTE_LABELS[localeOf(a)];
  return (a.rendered?.html ?? '')
    .replace(/(<h2[^>]*id="footnote-label"[^>]*>)Footnotes(<\/h2>)/, `$1${t.heading}$2`)
    .replace(/aria-label="Back to reference ([^"]+)"/g, (_, n) => `aria-label="${t.back(n)}"`)
    // Text presentation of the arrow, so iOS does not show it as an emoji.
    .replace(/↩/g, '↩︎');
}

export const dateFormat = (locale: Locale) =>
  new Intl.DateTimeFormat(LANG_TAGS[locale], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const TYPE_LABELS: Record<Locale, Record<Article['data']['type'], string>> = {
  pt: { scientific: 'Artigo científico', note: 'Nota', commentary: 'Comentário' },
  en: { scientific: 'Scientific article', note: 'Note', commentary: 'Commentary' },
};

/**
 * Parts of the "Como citar / How to cite" reference, following the Católica Law Review
 * style rules for texts consulted online (V.5): author (surname in small capitals),
 * year, title in italics, "in" + URL, and the date of consultation (d.mm.yyyy).
 */
export function citation(a: Article, name: { surname: string; given: string }, url: string) {
  return { surname: name.surname, given: name.given, year: a.data.date.getUTCFullYear(), title: a.data.title, url };
}
