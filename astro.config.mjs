// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { DEFAULT_LOCALE, LOCALES, legacyRedirects, routePath } from './src/i18n/routes.mjs';
import { hasArticles, sitemapLinks } from './src/i18n/sitemap-links.mjs';

const SITE = 'https://jgmpgoncalves-tax.github.io';
const BASE = '/';
const links = sitemapLinks(SITE, BASE);

export default defineConfig({
  // GitHub Pages user site (repository jgmpgoncalves-tax.github.io), served at the domain root.
  // For a custom domain: set `site` to it, keep base '/' and add public/CNAME.
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  // Old URLs. Static redirect pages on GitHub Pages (meta refresh + canonical).
  // The first site's own-articles list (/artigos/, /en/articles/) points to Articles once
  // the first article is published (until then that page does not exist), otherwise to Publications.
  redirects: {
    ...legacyRedirects(),
    '/artigos/': routePath(hasArticles() ? 'articles' : 'publications', 'pt'),
    '/en/articles/': routePath(hasArticles() ? 'articles' : 'publications', 'en'),
  },
  output: 'static',
  build: { format: 'directory' },
  i18n: {
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // hreflang pairs from the route map and article translations (localised slugs).
      serialize(item) {
        const l = links.get(item.url);
        return l ? { ...item, links: l } : item;
      },
    }),
  ],
});
