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
* { box-sizing: border-box; }
body { margin: 0; width: 1200px; height: 630px; background: #fff; color: #1b2a4a; font-family: OgSans; position: relative; }
.top { position: absolute; left: 80px; right: 80px; top: 64px; display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 22px; border-bottom: 2px solid #1b2a4a; }
.tag { font-size: 20px; letter-spacing: 0.35em; color: #4f5b69; text-transform: uppercase; }
.body { position: absolute; left: 80px; right: 80px; top: 250px; }
h1 { font: 600 76px/1.05 OgSerif; margin: 0 0 24px; }
p { font: 400 30px/1.4 OgSans; margin: 0; color: #4f5b69; }
.foot { position: absolute; left: 80px; right: 80px; bottom: 56px; padding-top: 18px; border-top: 1px solid #d9dee5; font-size: 18px; letter-spacing: 0.3em; color: #4f5b69; text-transform: uppercase; display: flex; justify-content: space-between; }
</style></head><body>
<div class="top">
  <svg width="174" height="66" viewBox="0 0 132 50"><g font-family="OgSerif" font-size="44" font-weight="500" fill="#1b2a4a" text-anchor="middle"><text x="16" y="40">J</text><text x="66" y="40">G</text><text x="116" y="40">G</text></g><g stroke="#9b1c39" stroke-width="2.2"><line x1="40" y1="14" x2="40" y2="42"/><line x1="91" y1="14" x2="91" y2="42"/></g></svg>
  <span class="tag">Advogado · Lawyer</span>
</div>
<div class="body"><h1>João Gabriel Gonçalves</h1><p>Lawyer | Tax Law and International Taxation</p><p>Advogado | Direito Fiscal e Fiscalidade Internacional</p></div>
<div class="foot"><span>Lisboa · Portugal</span><span>Cédula n.º 70649L</span></div>
</body></html>`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
// Load from a file URL so the local font files are allowed.
const file = join(mkdtempSync(join(tmpdir(), 'og-')), 'og.html');
writeFileSync(file, html);
await page.goto(`file://${file}`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: fileURLToPath(new URL('public/og-image.png', root)) });
await browser.close();
