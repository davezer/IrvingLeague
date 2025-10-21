import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

export async function GET({ url }) {
  const season = url.searchParams.get('season'); // optional; records may span all-time

  let query = supabaseAdmin
    .from('records') // table: records
    .select('id, category, value, holder_team, opponent_team, week, season, date');

  if (season) query = query.eq('season', Number(season));

  const { data, error } = await query.order('date', { ascending: false });

  if (error) return json({ records: [], error: error.message }, { status: 500 });

  return json({ records: data ?? [], season: season ? Number(season) : null }, {
    headers: { 'cache-control': 's-maxage=600, stale-while-revalidate=3600' }
  });
}
