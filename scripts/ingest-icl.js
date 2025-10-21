// ingest-icl.js
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { crawl } from './crawl-icl.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
}
if (!OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const ai = new OpenAI({ apiKey: OPENAI_API_KEY });

function chunk(text, size = 1200, overlap = 150) {
  const parts = [];
  const words = text.split(/\s+/);
  let i = 0;
  while (i < words.length) {
    const block = words.slice(i, i + size).join(' ');
    parts.push(block);
    i += size - overlap;
  }
  return parts.filter(Boolean);
}

async function embedAll(chunks) {
  // OpenAI supports batching up to 2048 inputs; we’ll do smaller batches.
  const out = [];
  const B = 100;
  for (let i = 0; i < chunks.length; i += B) {
    const batch = chunks.slice(i, i + B);
    const resp = await ai.embeddings.create({
      model: 'text-embedding-3-small',
      input: batch
    });
    out.push(...resp.data.map(d => d.embedding));
  }
  return out;
}

async function upsertDoc({ url, title, text }) {
  // 1) upsert doc
  const { data: docRow, error: docErr } = await supabase
    .from('rag_docs')
    .upsert({ url, title, updated_at: new Date().toISOString() }, { onConflict: 'url' })
    .select()
    .single();
  if (docErr) throw docErr;

  // 2) delete old chunks for this doc
  const { error: delErr } = await supabase.from('rag_chunks').delete().eq('doc_id', docRow.id);
  if (delErr) throw delErr;

  // 3) chunk + embed
  const chunks = chunk(text);
  if (chunks.length === 0) return;

  const embs = await embedAll(chunks);

  // 4) insert chunks
  const rows = chunks.map((content, idx) => ({
    doc_id: docRow.id,
    idx,
    content,
    embedding: embs[idx] // pgvector accepts float[] from supabase-js
  }));

  // insert in batches
  const B = 1000;
  for (let i = 0; i < rows.length; i += B) {
    const slice = rows.slice(i, i + B);
    const { error } = await supabase.from('rag_chunks').insert(slice);
    if (error) throw error;
  }
}

export async function ingest() {
  const docs = await crawl(); // badges + parlay per your updated crawler
  for (const d of docs) {
    await upsertDoc(d);
    console.log(`Indexed: ${d.url} (${d.title})`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  ingest().then(() => { console.log('Done'); process.exit(0); })
          .catch((e) => { console.error(e); process.exit(1); });
}
