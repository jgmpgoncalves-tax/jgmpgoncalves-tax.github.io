// One RSS feed per language: /comentarios/rss.xml and /en/commentaries/rss.xml (only once commentaries exist).
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { LANG_TAGS, LOCALES, type Locale } from '../../i18n/config';
import { UI } from '../../i18n/ui';
import { pathFor, routeParam } from '../../i18n/utils';
import { commentaryPath, getCommentaries, localeOf } from '../../lib/commentaries';
import { getProfile } from '../../lib/data';

export async function getStaticPaths() {
  if (!(await getCommentaries()).length) return [];
  return LOCALES.map((locale) => ({
    params: { section: routeParam(pathFor('commentaries', locale)) },
    props: { locale },
  }));
}

export async function GET(context: APIContext) {
  const { locale } = context.props as { locale: Locale };
  const profile = await getProfile();
  const items = (await getCommentaries()).filter((c) => localeOf(c) === locale);
  return rss({
    title: `${profile.name}: ${UI[locale].nav.commentaries}`,
    description: UI[locale].meta.commentaries,
    site: context.site!,
    items: items.map((c) => ({
      title: c.data.title,
      pubDate: c.data.date,
      description: c.data.summary,
      link: commentaryPath(c),
      categories: c.data.tags,
      author: `${profile.email} (${profile.name})`,
    })),
    customData: `<language>${LANG_TAGS[locale]}</language>`,
    trailingSlash: true,
  });
}
