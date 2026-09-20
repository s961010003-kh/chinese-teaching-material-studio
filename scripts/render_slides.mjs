#!/usr/bin/env node
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';

function value(flag, fallback = undefined) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const html = value('--html');
const outDir = value('--out');
const prefix = value('--prefix', 'slide');
const modulePath = value('--playwright-module', process.env.PLAYWRIGHT_MODULE);
const browserPath = value('--browser', process.env.CHROME_EXECUTABLE);
if (!html || !outDir || !modulePath) {
  throw new Error('Usage: render_slides.mjs --html FILE --out DIR --playwright-module PATH [--browser PATH] [--prefix NAME]');
}
const imported = await import(pathToFileURL(path.resolve(modulePath)).href);
const playwright = imported.default ?? imported;
fs.mkdirSync(outDir, { recursive: true });
const launch = { headless: true };
if (browserPath) launch.executablePath = browserPath;
const browser = await playwright.chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.resolve(html)).href, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'screen' });
const report = await page.locator('.slide').evaluateAll((slides) => slides.map((slide, index) => {
  const sr = slide.getBoundingClientRect();
  const footer = slide.querySelector('.footer');
  const fr = footer?.getBoundingClientRect();
  const excluded = new Set(['footer', 'heroimg', 'hero', 'shade']);
  const intrusions = [...slide.children].filter((element) => ![...excluded].some((name) => element.classList.contains(name))).flatMap((element) => {
    const r = element.getBoundingClientRect();
    const reasons = [];
    if (r.left < sr.left - 1 || r.right > sr.right + 1 || r.top < sr.top - 1 || r.bottom > sr.bottom + 1) reasons.push('outside-slide');
    if (fr && r.bottom > fr.top - 10) reasons.push('footer-safe-zone');
    return reasons.length ? [{ tag: element.tagName, classes: element.className, reasons, bottom: Math.round(r.bottom - sr.top), footerTop: Math.round(fr.top - sr.top) }] : [];
  });
  return { page: index + 1, width: Math.round(sr.width), height: Math.round(sr.height), intrusions };
}));
const bad = report.filter((item) => item.width !== 1600 || item.height !== 900 || item.intrusions.length);
if (bad.length) throw new Error(`Layout QA failed: ${JSON.stringify(bad, null, 2)}`);
const slides = page.locator('.slide');
for (let index = 0; index < await slides.count(); index += 1) {
  await slides.nth(index).screenshot({ path: path.join(outDir, `${prefix}_${String(index + 1).padStart(2, '0')}.png`) });
}
console.log(JSON.stringify({ slides: await slides.count(), outDir: path.resolve(outDir), report }, null, 2));
await browser.close();
