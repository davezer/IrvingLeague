// crawl-icl.js
import { chromium } from 'playwright';

const BASE = 'https://irvingleague.club';
const BADGES_URL = `${BASE}/badges`;
const PARLAY_URL = `${BASE}/parlay`; // the site page
const PUBLIC_PARLAY_WEBAPP_URL = process.env.PUBLIC_PARLAY_WEBAPP_URL || process.env.VITE_PARLAY_WEBAPP_URL;

/** normalize text (collapse whitespace) */
function norm(s = '') {
  return (s || '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** get full visible text for a node (including inside Shadow DOM if any) */
async function visibleText(page, root = 'body') {
  return await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return '';
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        if (!n.parentElement) return NodeFilter.FILTER_REJECT;
        const style = getComputedStyle(n.parentElement);
        if (style && (style.visibility === 'hidden' || style.display === 'none')) {
          return NodeFilter.FILTER_REJECT;
        }
        return n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const out = [];
    let node;
    while ((node = walker.nextNode())) out.push(node.textContent);
    return out.join('\n');
  }, root);
}

/** try multiple ways to close a modal */
async function closeModal(page) {
  // Esc
  await page.keyboard.press('Escape').catch(() => {});
  // common close buttons
  const closeButtons = [
    '[data-close]', '[data-dismiss]', '[aria-label="Close"]',
    '.modal [data-close], .modal [aria-label="Close"]',
    '[role="dialog"] button:has-text("Close")',
    'button:has-text("×")'
  ];
  for (const sel of closeButtons) {
    const btn = await page.$(sel);
    if (btn) { await btn.click({ force: true }).catch(() => {}); break; }
  }
  // click backdrop
  const dlg = await page.$('[role="dialog"], .modal[open], .modal.show, [data-state="open"]');
  if (dlg) await page.mouse.click(10, 10).catch(() => {});
}

/** open a modal & extract its text; return '' if it fails quickly */
async function openAndExtractModal(page, opener) {
  try {
    await opener.click({ force: true });
  } catch {
    // some tiles use keyboard/capture—try Enter
    try { await opener.press('Enter'); } catch {}
  }

  const modal = await Promise.race([
    page.waitForSelector('[role="dialog"], .modal.show, .modal[open], [data-state="open"]', { timeout: 1200 }).catch(() => null),
    page.waitForSelector('.MuiModal-root[open]', { timeout: 1200 }).catch(() => null)
  ]);
  if (!modal) return '';

  const txt = await visibleText(page, '[role="dialog"], .modal.show, .modal[open], [data-state="open"], .MuiModal-root[open]');
  await closeModal(page);
  return norm(txt);
}

/** scrape badges page with modals */
async function scrapeBadges(browser) {
  const page = await browser.newPage();
  const url = BADGES_URL;

  await page.goto(url, { waitUntil: 'networkidle' });
  // page should be ready; many UIs mount headings or the badge grid
  await page.waitForTimeout(400);

  // 1) Base visible text (for headings & short blurbs)
  const pageTitle = await page.title();
  const baseText = norm(await visibleText(page));

  // 2) Find likely badge tiles/cards (broad selector net)
  const tileSelectors = [
    '[data-badge-id]',              // custom
    '[data-testid*="badge"]',
    '.badge-card', '.badge', '.Badge', '.card:has(img), .card:has(.badge)',
    '[role="button"][aria-haspopup="dialog"]',
    'button:has-text("Details")',
  ];

  const tiles = [];
  for (const sel of tileSelectors) {
    const els = await page.$$(sel);
    for (const el of els) tiles.push(el);
    if (tiles.length > 0) break; // first selector that yields results
  }

  const snippets = [];
  // 3) Try to open each tile to read modal text
  for (let i = 0; i < Math.min(tiles.length, 100); i++) {
    const t = tiles[i];
    try {
      const label = norm(await t.innerText().catch(() => '')) || `Badge-${i + 1}`;
      const detail = norm(await openAndExtractModal(page, t));
      if (detail) {
        // emit structured lines
        snippets.push(`BADGE: ${label}`);
        snippets.push(`BADGE_DETAILS: ${detail}`);
      }
    } catch {
      // ignore individual tile errors
    }
  }

  // 4) If there are hidden dialog nodes already in DOM, grab them
  if (snippets.length === 0) {
    const hiddenDialogs = await page.$$('[role="dialog"], .modal');
    for (const d of hiddenDialogs) {
      const txt = norm(await d.innerText().catch(() => ''));
      if (txt) snippets.push(`BADGE_DETAILS: ${txt}`);
    }
  }

  await page.close();

  return [{
    url,
    title: pageTitle || 'Badges',
    text: [
      'BADGES SUMMARY',
      baseText,
      ...snippets
    ].join('\n\n')
  }];
}

/** scrape parlay page; also attempt Apps Script webapp if env is set */
async function scrapeParlay(browser) {
  const docs = [];

  // 1) site /parlay page
  {
    const page = await browser.newPage();
    await page.goto(PARLAY_URL, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(400);
    const title = await page.title().catch(() => 'Parlay');
    const text = norm(await visibleText(page));
    if (text) {
      docs.push({
        url: PARLAY_URL,
        title: title || 'Parlay',
        text: `PARLAY PAGE:\n${text}`
      });
    }
    await page.close();
  }

  // 2) direct Apps Script endpoint (if available & CORS permits)
  if (PUBLIC_PARLAY_WEBAPP_URL) {
    const page = await browser.newPage();
    try {
      await page.goto(PUBLIC_PARLAY_WEBAPP_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      // Some Apps Script pages return HTML or JSON. Capture both.
      let raw = await page.content(); // HTML string
      // If JSON is rendered as plain text, prefer body innerText
      const bodyTxt = await page.evaluate(() => document.body && document.body.innerText || '').catch(() => '');
      if (bodyTxt && bodyTxt.length < raw.length + 50) raw = bodyTxt;

      const text = norm(raw);
      if (text) {
        docs.push({
          url: PUBLIC_PARLAY_WEBAPP_URL,
          title: 'Parlay (Apps Script)',
          text: `PARLAY DATA:\n${text}`
        });
      }
    } catch {
      // ignore if blocked/CORS; the site /parlay doc will still exist
    } finally {
      await page.close();
    }
  }

  return docs;
}

export async function crawl() {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const results = [];
  try {
    results.push(...await scrapeBadges(browser));
    results.push(...await scrapeParlay(browser));
  } finally {
    await browser.close();
  }
  return results;
}
