import { existsSync } from 'node:fs';
import { getCollection, type CollectionEntry } from 'astro:content';
import { FORMAT_LOCALES, LOCALES, type Locale } from '../i18n/config';
import { pathFor } from '../i18n/utils';
import { checkFolder, localeOf, newestFirst, slugOf, versionIn } from './entries';

export { localeOf, slugOf };

export type Article = CollectionEntry<'articles'>;

const EM_DASH = '\u2014';

/** Site path of an article page: /articles/<slug>/ or /pt/artigos/<slug>/. */
export const articlePath = (c: Article) => `${pathFor('articles', localeOf(c))}${slugOf(c)}/`;

// Checks that cannot be expressed in the schema. They fail the build with a clear message.
function validate(c: Article) {
  const where = `src/content/articles/${c.id}.md`;
  checkFolder(c, 'articles');
  if (/^\d+$/.test(slugOf(c))) throw new Error(`${where}: a slug cannot be only digits (those URLs are list pages).`);
  if (c.data.pdf && !existsSync(`public/pdf/${c.data.pdf}`)) throw new Error(`${where}: public/pdf/${c.data.pdf} does not exist.`);
  const body = c.body ?? '';
  if (body.includes(EM_DASH) || /(^|[^-])---([^-]|$)/m.test(body.replace(/^---$/gm, '')))
    throw new Error(`${where}: em dashes are not allowed (write them as a comma, colon or parentheses; "---" also becomes an em dash).`);
  const html = c.rendered?.html ?? '';
  if (/<h1[\s>]|<h[4-6][\s>]/.test(html)) throw new Error(`${where}: use only ## and ### headings.`);
}

let cache: Article[] | undefined;

/** All articles that are built, newest first. Drafts are left out of production builds. */
export async function getArticles(): Promise<Article[]> {
  if (!cache || import.meta.env.DEV) {
    const all = await getCollection('articles', (c) => !(import.meta.env.PROD && c.data.draft));
    all.forEach(validate);
    cache = newestFirst(all);
  }
  return cache;
}

/** Paths of every language version of an article (for hreflang and the language switch). */
export async function articleAlternates(c: Article) {
  const all = await getArticles();
  const out: Partial<Record<Locale, string>> = {};
  for (const l of LOCALES) {
    const v = versionIn(all, c, l);
    if (v) out[l] = articlePath(v);
  }
  return out;
}

const FOOTNOTE_LABELS: Record<Locale, { heading: string; back: (n: string) => string }> = {
  pt: { heading: 'Notas', back: (n) => `Voltar à referência ${n}` },
  en: { heading: 'Notes', back: (n) => `Back to reference ${n}` },
};

/** Rendered article HTML with footnote labels in its language. */
export function articleHtml(c: Article): string {
  const t = FOOTNOTE_LABELS[localeOf(c)];
  return (c.rendered?.html ?? '')
    .replace(/(<h2[^>]*id="footnote-label"[^>]*>)Footnotes(<\/h2>)/, `$1${t.heading}$2`)
    .replace(/aria-label="Back to reference ([^"]+)"/g, (_, n) => `aria-label="${t.back(n)}"`)
    // Text presentation of the arrow, so iOS does not show it as an emoji.
    .replace(/↩/g, '↩︎');
}

export const dateFormat = (locale: Locale) =>
  new Intl.DateTimeFormat(FORMAT_LOCALES[locale], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
