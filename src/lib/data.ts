import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { Locale, RouteKey } from '../i18n/config';
import { pathFor } from '../i18n/utils';
import { articlePath, getArticles, type Article } from './articles';
import { dateKey } from './dates';
import { checkFolder, listFor, newestFirst, slugOf } from './entries';

export async function getProfile() {
  const entry = await getEntry('profile', 'main');
  if (!entry) throw new Error('src/data/profile.yaml must contain an entry with id "main".');
  return entry.data;
}

/** Generated first sentence of the About text: role, employer and city from profile.yaml. */
export async function positionSentence(locale: Locale) {
  const p = await getProfile();
  const role = p.role[locale];
  if (locale === 'pt') return `Sou ${role} ${p.employer.pt}, em ${p.city.pt}.`;
  const article = /^[aeiou]/i.test(role) ? 'an' : 'a';
  return `I am ${article} ${role} ${p.employer.en} in ${p.city.en}.`;
}

/** The {dissertation} sentence, from the status field in profile.yaml. */
async function dissertationSentence(locale: Locale) {
  const d = (await getProfile()).dissertation;
  if (d.status === 'defended' && !d.defenceYear) throw new Error('profile.yaml: set dissertation.defenceYear once the dissertation is defended.');
  return d.text[d.status][locale].replace('{title}', d.title[locale]).replace('{year}', String(d.defenceYear ?? ''));
}

/** General description: paragraphs for the home page, HTML paragraphs for About (after the generated sentence). */
export async function getDescription(locale: Locale) {
  const entry = await getEntry('description', locale);
  if (!entry) throw new Error(`Missing src/content/description/${locale}.md`);
  const first = await positionSentence(locale);
  const diss = await dissertationSentence(locale);
  const fill = (s: string) => s.replaceAll('{dissertation}', diss);
  return {
    home: entry.data.home.map(fill),
    aboutHtml: fill(entry.rendered?.html ?? '').replace(/^<p>/, `<p>${first} `),
  };
}

export async function getResearchAreas() {
  return (await getCollection('researchAreas')).sort((a, b) => a.data.order - b.data.order);
}

export async function getPracticeAreas() {
  return (await getCollection('practiceAreas')).sort((a, b) => a.data.order - b.data.order);
}

export async function getResearch() {
  return (await getCollection('research')).sort(
    (a, b) => dateKey(b.data.start).localeCompare(dateKey(a.data.start)) || dateKey(b.data.end).localeCompare(dateKey(a.data.end)),
  );
}

/** Publications, newest first, grouped by year. Undated entries go in a final group with year null. */
export async function getPublicationsByYear() {
  const pubs = (await getCollection('publications')).sort((a, b) =>
    dateKey(b.data.date).localeCompare(dateKey(a.data.date)),
  );
  const groups = new Map<number | null, typeof pubs>();
  for (const p of pubs) {
    const year = p.data.date ? Number(p.data.date.slice(0, 4)) : null;
    groups.set(year, [...(groups.get(year) ?? []), p]);
  }
  return [...groups].map(([year, items]) => ({ year, items }));
}

export type NewsItem = CollectionEntry<'news'>;

let newsCache: NewsItem[] | undefined;

/** All news items that are built, newest first (drafts left out of production builds). */
export async function getAllNews() {
  if (!newsCache || import.meta.env.DEV) {
    const all = await getCollection('news', (n) => !(import.meta.env.PROD && n.data.draft));
    all.forEach((n) => checkFolder(n, 'news'));
    newsCache = newestFirst(all);
  }
  return newsCache;
}

/** News listed in a language (with items that exist only in the other language). */
export async function getNews(locale: Locale) {
  return listFor(await getAllNews(), locale);
}

/** Talks: news items in the "talk" category. */
export async function getTalks(locale: Locale) {
  return (await getNews(locale)).filter((n) => n.data.category.id === 'talk');
}

export async function getArticleList(locale: Locale) {
  return listFor(await getArticles(), locale);
}

/**
 * Whether a section has content. A section appears in the navigation, on the home page,
 * on the Publications hub and in the sitemap only once it has content.
 */
export async function hasContent(key: RouteKey): Promise<boolean> {
  if (key === 'articles') return (await getArticles()).length > 0;
  if (key === 'news') return (await getAllNews()).length > 0;
  if (key === 'talks') return (await getAllNews()).some((n) => n.data.category.id === 'talk');
  return true;
}

/** Anchor of a news item in a language's news list, used when the item has no link of its own. */
export const newsAnchor = (n: NewsItem, locale: Locale) => `${pathFor('news', locale)}#${slugOf(n)}`;

export type Featured = ({ kind: 'article'; item: Article } | { kind: 'news'; item: NewsItem }) & { label: string };

/** The latest items across articles and news, for "Em destaque". */
export async function getFeatured(locale: Locale, count = 3): Promise<Featured[]> {
  const items: Featured[] = [
    ...(await Promise.all(
      (await getArticleList(locale)).map(async (item) => ({
        kind: 'article' as const,
        item,
        label: (await categoryLabel('articleTypes', item.data.type.id))[locale],
      })),
    )),
    ...(await Promise.all(
      (await getNews(locale)).map(async (item) => ({
        kind: 'news' as const,
        item,
        label: (await categoryLabel('newsCategories', item.data.category.id))[locale],
      })),
    )),
  ];
  return items.sort((a, b) => b.item.data.date.getTime() - a.item.data.date.getTime()).slice(0, count);
}

/** Label of an article type or news category. */
export async function categoryLabel(collection: 'articleTypes' | 'newsCategories', id: string) {
  const entry = await getEntry(collection, id);
  if (!entry) throw new Error(`Unknown ${collection} id "${id}"`);
  return entry.data.label;
}

export const featuredHref = (f: Featured, locale: Locale) =>
  f.kind === 'article' ? articlePath(f.item) : (f.item.data.link ?? newsAnchor(f.item, locale));
