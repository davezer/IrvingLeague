import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

console.log('SMOKE → SUPABASE_URL =', process.env.SUPABASE_URL);

const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// 1) Try a simple insert (zero vector 1536) to prove writes work
const { data: ins, error: ierr } = await supa
  .from('site_chunks')
  .insert({
    url: 'https://www.irvingleague.club/_smoke',
    title: 'smoke',
    content: 'smoke test row',
    token_count: 3,
    embedding: Array(1536).fill(0),
    content_sha: 'smoke-' + Date.now()
  })
  .select('id');

console.log('INSERT ok?', !ierr, 'rows:', ins?.length || 0, ierr?.message || '');

// 2) Read back counts
const { data: cnt, error: cerr } = await supa
  .from('site_chunks')
  .select('id', { count: 'exact', head: true });

console.log('COUNT read ok?', !cerr, 'total rows:', cnt?.length ?? '(see Supabase UI)');
