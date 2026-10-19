// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Locales and the default locale are defined in src/i18n/config.ts.
// Keep these values in sync with it (astro.config cannot import TypeScript).
const DEFAULT_LOCALE = 'pt';
const LOCALES = { pt: 'pt-PT', en: 'en-GB' };

export default defineConfig({
  // GitHub Pages URL. For a custom domain: set `site` to it, keep base '/' and add public/CNAME.
  site: 'https://jgmpgoncalves-tax.github.io',
  base: '/',
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
