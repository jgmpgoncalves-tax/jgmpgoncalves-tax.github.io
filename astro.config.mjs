// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Locales and the default locale are defined in src/i18n/config.ts.
// Keep these values in sync with it (astro.config cannot import TypeScript).
const DEFAULT_LOCALE = 'pt';
const LOCALES = { pt: 'pt-PT', en: 'en-GB' };

export default defineConfig({
  // GitHub Pages URL. The repository is a project repository, so the site lives under /<repo>/.
  // If the repository is renamed to jgmpgoncalves-tax.github.io, or for a custom domain
  // (set `site` to it and add public/CNAME), change `base` to '/'.
  site: 'https://jgmpgoncalves-tax.github.io',
  base: '/jgmpgoncalves-tax',
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory' },
  i18n: {
    locales: Object.keys(LOCALES),
    defaultLocale: DEFAULT_LOCALE,
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: DEFAULT_LOCALE, locales: LOCALES },
    }),
  ],
});
