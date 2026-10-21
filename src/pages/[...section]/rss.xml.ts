// One RSS feed per language: /articles/rss.xml and /pt/artigos/rss.xml (only once articles exist).
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { LANG_TAGS, LOCALES, type Locale } from '../../i18n/config';
import { UI } from '../../i18n/ui';
import { pathFor, routeParam } from '../../i18n/utils';
import { articlePath, getArticles, localeOf } from '../../lib/articles';
import { getProfile } from '../../lib/data';

export async function getStaticPaths() {
  if (!(await getArticles()).length) return [];
  return LOCALES.map((locale) => ({
    params: { section: routeParam(pathFor('articles', locale)) },
    props: { locale },
  }));
}

export async function GET(context: APIContext) {
  const { locale } = context.props as { locale: Locale };
  const profile = await getProfile();
  const items = (await getArticles()).filter((c) => localeOf(c) === locale);
  return rss({
    title: `${profile.name}: ${UI[locale].nav.articles}`,
    description: UI[locale].meta.articles,
    site: context.site!,
    items: items.map((c) => ({
      title: c.data.title,
      pubDate: c.data.date,
      description: c.data.summary,
      link: articlePath(c),
      categories: c.data.tags,
      author: `${profile.email} (${profile.name})`,
    })),
    customData: `<language>${LANG_TAGS[locale]}</language>`,
    trailingSlash: true,
  });
}
