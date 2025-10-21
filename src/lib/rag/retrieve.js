// src/lib/rag/retrieve.js
import { createClient } from '@supabase/supabase-js';

/**
 * Hybrid search (text + embedding) over site_chunks via SQL function.
 * You already created the `hybrid_search` function in Supabase.
 */
export async function retrieveHybrid({ queryText, queryEmbedding, k = 16 }) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase.rpc('hybrid_search', {
    q_text: queryText,
    q_embedding: queryEmbedding,
    match_count: k
  });

  if (error) throw error;
  return data || [];
}

/**
 * WIDE FETCH for all transactions pages.
 * Pulls *every* chunk whose URL looks like /transactions or /transactions?page=N.
 * We merge these with hybrid results whenever the user asks about trades.
 */
export async function fetchTransactionPages(limit = 9999) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from('site_chunks')
    .select('url, title, content')
    .ilike('url', '%/transactions%')
    .order('url', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
}
