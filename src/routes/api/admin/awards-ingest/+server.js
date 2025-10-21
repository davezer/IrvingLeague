// src/routes/api/admin/awards-ingest/+server.js
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, INGEST_SHARED_SECRET } from '$env/static/private';

export const prerender = false;

// Optional: quick browser test at /api/admin/awards-ingest
export async function GET() {
  return new Response('pong', { status: 200 });
}

export async function POST({ request }) {
  // auth
  const secret = request.headers.get('x-ingest-key');
  if (!secret || secret !== INGEST_SHARED_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  // parse
  let rows;
  try {
    rows = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }
  if (!Array.isArray(rows) || rows.length === 0) {
    return json({ ok: true, inserted: 0 });
  }

  // normalize
  const clean = rows.map((r) => ({
    badge_id: String(r.badge_id || '').trim(),
    manager_id: String(r.manager_id || '').trim() || null,
    season: r.season == null ? null : Number(r.season),
    week: r.week == null ? null : Number(r.week),
    points: r.points == null ? null : Number(r.points),
    opponent: r.opponent ? String(r.opponent).trim() : null,
    opponent_points: r.opponent_points == null ? null : Number(r.opponent_points),
    explanation: r.explanation ?? null,
    nominated_by: r.nominated_by ? String(r.nominated_by).trim() : null
  })).filter((r) => r.badge_id && r.manager_id);

  // supabase client (service role)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // upsert on composite PK
  const { data, error } = await supabase
    .from('awards')
    .upsert(clean, { onConflict: 'badge_id,manager_id,season,week' })
    .select(); // return inserted/updated rows

  if (error) {
    console.error('awards-ingest upsert error:', error);
    return new Response('Upsert failed', { status: 500 });
  }

  return json({ ok: true, inserted: data?.length ?? 0 });
}
