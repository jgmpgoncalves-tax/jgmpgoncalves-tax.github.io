import { getCollection, getEntry } from 'astro:content';
import type { Locale } from '../i18n/config';
import { dateKey } from './dates';

const byStartDesc = <T extends { data: { start: string; end?: string | null } }>(a: T, b: T) =>
  dateKey(b.data.start).localeCompare(dateKey(a.data.start)) ||
  dateKey(b.data.end).localeCompare(dateKey(a.data.end));

export async function getProfile() {
  const entry = await getEntry('profile', 'main');
  if (!entry) throw new Error('src/data/profile.yaml must contain an entry with id "main".');
  return entry.data;
}

export async function getExperience() {
  const all = (await getCollection('experience')).sort(byStartDesc);
  return {
    main: all.filter((e) => !e.data.internship),
    internships: all.filter((e) => e.data.internship),
  };
}

/** Current role at an organisation: the one with `end: null`, otherwise the last listed. */
export function currentRole(roles: { title: { pt: string; en: string }; end?: string | null }[]) {
  return roles.find((r) => r.end === null) ?? roles[roles.length - 1];
}

/** Bio paragraphs with {position} filled in from the current employer in experience.yaml. */
export async function getBio(locale: Locale) {
  const profile = await getProfile();
  const { main } = await getExperience();
  const current = main.find((e) => e.data.end === null && e.data.position);
  if (!current?.data.position) throw new Error('experience.yaml: the current employer needs a `position` field.');
  const position = current.data.position[locale].replace('{role}', currentRole(current.data.roles).title[locale]);
  return profile.bio[locale].map((p) => p.replace('{position}', position));
}

export async function getEducation() {
  return (await getCollection('education')).sort(byStartDesc);
}

export async function getResearch() {
  return (await getCollection('research')).sort(byStartDesc);
}

export async function getTraining() {
  return (await getCollection('training')).sort((a, b) => dateKey(b.data.date).localeCompare(dateKey(a.data.date)));
}

export async function getPracticeAreas() {
  return (await getCollection('practiceAreas')).sort((a, b) => a.data.order - b.data.order);
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

// Loaded once per build: every page checks it for the navigation.
let newsCache: Awaited<ReturnType<typeof getCollection<'news'>>> | undefined;

/** News items for one language, newest first. */
export async function getNews(locale: Locale) {
  newsCache ??= await getCollection('news');
  return newsCache
    .filter((n) => n.id.startsWith(`${locale}/`))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function hasNews(locale: Locale) {
  return (await getNews(locale)).length > 0;
}
