// Opens your pages at phone / tablet / laptop widths and reports what breaks.
//   npm i -D playwright && npx playwright install chromium     (once)
//   node tools/mobile-check.mjs https://www.impilomag.co.za /editorial/login /read/impilo-101 /admin
// Needs no changes to the site. Screenshots go to ./mobile-check/.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [base, ...paths] = process.argv.slice(2);
if (!base) { console.log('usage: node tools/mobile-check.mjs <site> [/path ...]'); process.exit(1); }
const routes = paths.length ? paths : ['/'];
const sizes = [[320, 640], [375, 667], [414, 896], [768, 1024], [1280, 800]];
mkdirSync('mobile-check', { recursive: true });

const browser = await chromium.launch();
let problems = 0;
for (const route of routes) {
  for (const [w, h] of sizes) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 800, isMobile: w < 800 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('response', (r) => { if (r.status() >= 400 && new URL(r.url()).pathname.startsWith('/assets/')) errors.push(`${r.status()} ${r.url()}`); });
    try { await page.goto(base + route, { waitUntil: 'networkidle', timeout: 30000 }); } catch (e) { errors.push('load: ' + e.message); }
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const vw = de.clientWidth;
      const wide = [];
      for (const el of document.body.querySelectorAll('*')) {
        const b = el.getBoundingClientRect();
        if (b.width > 0 && b.right > vw + 1 && getComputedStyle(el).position !== 'fixed') {
          wide.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''} (right ${Math.round(b.right)}px)`);
          if (wide.length >= 5) break;
        }
      }
      const tiny = [...document.querySelectorAll('a,button,input,select,[role=button]')]
        .filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && (b.width < 32 || b.height < 32) && getComputedStyle(el).visibility !== 'hidden'; }).length;
      return {
        sideways: de.scrollWidth > vw + 1, scrollWidth: de.scrollWidth, vw,
        htmlHeight: Math.round(de.getBoundingClientRect().height), docHeight: de.scrollHeight, wide, tiny,
        canScrollY: de.scrollHeight > innerHeight,
      };
    });
    const flags = [];
    if (r.sideways) flags.push(`SIDEWAYS SCROLL (page ${r.scrollWidth}px in ${r.vw}px)`);
    if (r.wide.length) flags.push('wide: ' + r.wide.join('; '));
    if (r.docHeight > r.htmlHeight + 40) flags.push(`html box (${r.htmlHeight}px) shorter than content (${r.docHeight}px)`);
    if (w <= 414 && r.tiny > 0) flags.push(`${r.tiny} tap targets under 32px`);
    flags.push(...errors.map((e) => 'ERROR ' + e));
    const file = `mobile-check/${route.replace(/[^a-z0-9]+/gi, '_') || 'home'}-${w}.png`;
    await page.screenshot({ path: file, fullPage: false });
    console.log(`${flags.length ? 'X' : 'ok'}  ${route}  ${w}px${flags.length ? '\n     ' + flags.join('\n     ') : ''}`);
    problems += flags.length ? 1 : 0;
    await ctx.close();
  }
}
await browser.close();
console.log(problems ? `\n${problems} page/size combinations need attention. See ./mobile-check/*.png` : '\nAll clear.');
