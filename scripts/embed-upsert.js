// scripts/embed-upsert.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import crypto from 'node:crypto';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { crawl } from './crawl-icl.js';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const CHUNK_TOKENS = 800;
const CHUNK_OVERLAP_TOKENS = 120;
const BATCH_SIZE = Number(process.env.BATCH_SIZE || 32);
const PAUSE_MS   = Number(process.env.PAUSE_MS   || 250);
const CRAWL_MAX  = Number(process.env.CRAWL_MAX  || 300);
const EXPORT_BASE = process.env.EXPORT_BASE || 'http://localhost:5173/api/export';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

function words(s) { return (s || '').split(/\s+/); }

function chunkTextGeneral(text, tok = CHUNK_TOKENS, over = CHUNK_OVERLAP_TOKENS) {
  const w = words(text);
  const out = [];
  const step = tok - over;
  for (let i = 0; i < w.length; i += step) {
    const slice = w.slice(i, i + tok).join(' ');
    if (slice.trim()) out.push(slice);
  }
  return out;
}

function chunkTextByUrl(url, text) {
  const isTx = /\/transactions\b/i.test(url);
  return isTx ? chunkTextGeneral(text, 250, 40) : chunkTextGeneral(text);
}

async function embedBatchWithRetry(texts, tries = 6) {
  for (let i = 0; i < tries; i++) {
    try {
      const { data } = await client.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts
      });
      return data.map((d) => d.embedding);
    } catch (e) {
      const status = e?.status || e?.code;
      const is429 = status === 429 || e?.error?.code === 'insufficient_quota';
      if (is429 && i < tries - 1) {
        const wait = 1000 * Math.pow(2, i);
        console.warn(`429 from embeddings, retry in ${wait}ms (attempt ${i + 1}/${tries})`);
        await sleep(wait);
        continue;
      }
      throw e;
    }
  }
}

async function replaceChunksForPage(url, title, newChunks, newEmbeddings) {
  if (newChunks.length !== newEmbeddings.length) {
    throw new Error('chunks/embeddings length mismatch');
  }

  const { error: delErr } = await supabase
    .from('site_chunks')
    .delete()
    .eq('url', url);
  if (delErr) console.warn('[CLEAN] delete failed for', url, delErr.message);

  const rows = newChunks.map((c, i) => ({
    url,
    title,
    content: c,
    token_count: c.split(/\s+/).length,
    embedding: newEmbeddings[i],
    content_sha: sha(url + '|' + c),
  }));

  const chunkSize = 200;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const batch = rows.slice(i, i + chunkSize);
    const { error: insErr } = await supabase.from('site_chunks').insert(batch);
    if (insErr) throw insErr;
  }

  console.log(`[REPLACE] ${url}: inserted ${rows.length} chunks`);
}

function flattenJson(obj, prefix = '') {
  if (Array.isArray(obj)) {
    return obj.map((v, i) => flattenJson(v, `${prefix}[${i}]`)).join('\n');
  } else if (obj && typeof obj === 'object') {
    return Object.entries(obj)
      .map(([k, v]) => flattenJson(v, prefix ? `${prefix}.${k}` : k))
      .join('\n');
  } else {
    return `${prefix}: ${obj}`;
  }
}

async function ingestExportedJsonFeeds() {
  const feeds = [
    'badges.json?season=2025',
    'draftmoney.json?season=2025',
    'records.json?season=2025',
    'standings.json?season=2025',
    'managers.json?season=2025',
    'trades2025.json',
    'waivers.json'
  ];

  for (const rel of feeds) {
    const url = `${EXPORT_BASE}/${rel}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const arr = Array.isArray(data.data) ? data.data : data;
      if (!arr || !arr.length) {
        console.log(`(empty) ${url}`);
        continue;
      }

      const text = flattenJson(arr);
      const chunks = chunkTextGeneral(text, 800, 120);
      const embeddings = [];

      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);
        const embs = await embedBatchWithRetry(batch);
        embeddings.push(...embs);
        if (PAUSE_MS) await sleep(PAUSE_MS);
      }

      await replaceChunksForPage(url, rel, chunks, embeddings);
    } catch (err) {
      console.warn(`⚠ Failed to index ${url}:`, err.message);
    }
  }
}

(async () => {
  console.log('INGEST → SUPABASE_URL =', process.env.SUPABASE_URL);
  console.log('INGEST → Using OPENAI model = text-embedding-3-small (1536 dims)');

  // (1) Crawl static site content
  const pages = await crawl(CRAWL_MAX);
  console.log('Total pages collected:', pages.length);

  for (const p of pages) {
    const chunks = chunkTextByUrl(p.url, p.text);
    if (!chunks.length) {
      console.log('skipped (no text):', p.url);
      continue;
    }

    const embeddings = [];
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const embs = await embedBatchWithRetry(batch);
      embeddings.push(...embs);
      if (PAUSE_MS) await sleep(PAUSE_MS);
    }

    await replaceChunksForPage(p.url, p.title, chunks, embeddings);
  }

  // (2) Ingest JSON API data
  await ingestExportedJsonFeeds();

  console.log('✅ Ingest complete.');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
