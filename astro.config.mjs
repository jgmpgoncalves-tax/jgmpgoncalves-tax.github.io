// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { DEFAULT_LOCALE, LOCALES } from './src/i18n/routes.mjs';
import { sitemapLinks } from './src/i18n/sitemap-links.mjs';

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
  redirects: {
    '/areas-de-pratica/': '/sobre/',
    '/en/practice-areas/': '/en/about/',
    '/artigos/': '/comentarios/',
    '/en/articles/': '/en/commentaries/',
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
      // hreflang pairs from the route map and commentary translations (localised slugs).
      serialize(item) {
        const l = links.get(item.url);
        return l ? { ...item, links: l } : item;
      },
    }),
  ],
});
