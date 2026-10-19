// Generates public/og-image.png (1200x630) for social sharing.
// Run with: node scripts/og-image.mjs  (requires Playwright with Chromium installed separately).
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('..', import.meta.url);
const font = (p) => new URL(`node_modules/${p}`, root).href;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: OgSerif; src: url(${font('@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2')}); font-weight: 200 900; }
@font-face { font-family: OgSans; src: url(${font('@fontsource-variable/source-sans-3/files/source-sans-3-latin-wght-normal.woff2')}); font-weight: 200 900; }
body { margin: 0; width: 1200px; height: 630px; background: #1b2a4a; color: #fff; display: flex; align-items: center; }
.wrap { padding: 0 96px; display: flex; gap: 56px; align-items: center; }
.mono { width: 168px; height: 168px; border: 3px solid #fff; display: grid; place-items: center; font: 600 58px/1 OgSerif; letter-spacing: 2px; flex: none; }
h1 { font: 600 64px/1.1 OgSerif; margin: 0 0 20px; }
p { font: 400 30px/1.35 OgSans; margin: 0; color: #d9dee5; }
</style></head><body><div class="wrap"><div class="mono">JGG</div><div>
<h1>João Gabriel Gonçalves</h1><p>Advogado | Direito Fiscal e Fiscalidade Internacional</p><p>Lawyer | Tax Law and International Taxation</p>
</div></div></body></html>`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
// Load from a file URL so the local font files are allowed.
const file = join(mkdtempSync(join(tmpdir(), 'og-')), 'og.html');
writeFileSync(file, html);
await page.goto(`file://${file}`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: fileURLToPath(new URL('public/og-image.png', root)) });
await browser.close();
