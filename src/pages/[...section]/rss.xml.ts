// One RSS feed per language, at the article list's path: /artigos/rss.xml and /en/articles/rss.xml.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { LANG_TAGS, LOCALES, type Locale } from '../../i18n/config';
import { UI } from '../../i18n/ui';
import { pathFor } from '../../i18n/utils';
import { articlePath, getArticles, localeOf } from '../../lib/articles';
import { getProfile } from '../../lib/data';

export function getStaticPaths() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return LOCALES.map((locale) => ({
    params: { section: pathFor('articles', locale).slice(base.length + 1, -1) },
    props: { locale },
  }));
}

export async function GET(context: APIContext) {
  const { locale } = context.props as { locale: Locale };
  const profile = await getProfile();
  const articles = (await getArticles()).filter((a) => localeOf(a) === locale);
  return rss({
    title: `${profile.name}: ${UI[locale].nav.articles}`,
    description: UI[locale].meta.articles,
    site: context.site!,
    items: articles.map((a) => ({
      title: a.data.title,
      pubDate: a.data.date,
      description: a.data.summary,
      link: articlePath(a),
      categories: a.data.tags,
      author: `${profile.email} (${profile.name})`,
    })),
    customData: `<language>${LANG_TAGS[locale]}</language>`,
    trailingSlash: true,
  });
}
