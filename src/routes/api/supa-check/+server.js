// src/routes/api/supa-check/+server.js
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

export async function GET() {
  const url = env.SUPABASE_URL || '';
  const key = env.SUPABASE_SERVICE_ROLE_KEY || '';

  // Mask most of the key in logs
  const keyPreview = key ? `${key.slice(0, 6)}...${key.slice(-6)}` : '';

  if (!url || !key) {
    return json({ ok: false, why: 'Missing URL or SERVICE_ROLE', url: !!url, key: !!key }, { status: 500 });
  }

  const supa = createClient(url, key);

  // Lightweight call that still exercises auth
  const { data, error, status } = await supa
    .from('awards')
    .select('season', { count: 'exact', head: true });

  return json({
    ok: !error,
    status,
    error: error?.message || null,
    urlPreview: url.replace(/^https?:\/\//, '').slice(0, 32),
    keyPreview, // just to verify you’re loading what you expect
  }, { headers: { 'cache-control': 'no-store' } });
}
